/**
 * Spend the strong model only where the lead is worth it.
 *
 * `select` sees every answer and returns a model id, or nothing to keep the
 * agent's own model. Returning nothing is the safe move: a wrong downgrade
 * writes the reply on the weaker model.
 *
 * Run: pnpm model-selection
 */
import { typeSafeAi } from '@ai-sdk/typesafe-ai';
import { Agent } from '@mastra/core/agent';
import { Classifier } from '@mastra/core/classifier';
import { ModelSelectionProcessor } from '@mastra/core/processors';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const SMALL = 'openai/gpt-5-nano';
const STRONG = 'openai/gpt-5-mini';

const account = { listPricePerSeat: 49, seatsQuoted: 200 };

const lead = {
  name: 'Priya Shah',
  company: 'Northwind Analytics',
  title: 'VP Engineering',
  employees: 180,
  industry: 'B2B SaaS',
  message: 'We need pricing for 200 seats before our Q3 planning meeting next Thursday.',
};

/** A lead that asks for pricing, but the title is not a buyer. Drops to nano. */
const poorFit = {
  name: 'Sam Ortiz',
  company: 'Ortiz Landscaping',
  title: 'Owner',
  employees: 4,
  industry: 'Landscaping',
  message: 'Can you send pricing for 20 seats before Friday? We need to decide this week.',
};

/** A buyer with no ask yet. Intent under 1 also drops to nano. */
const browsing = {
  name: 'Dana Cho',
  company: 'Harbor Metrics',
  title: 'VP Engineering',
  employees: 90,
  industry: 'B2B SaaS',
  message: 'Just looking around. Not sure we need anything right now.',
};

/** A technical role without budget, and a real need. Neither rule fires. */
const partial = {
  name: 'Luis Ortega',
  company: 'Northwind Analytics',
  title: 'Senior Engineer',
  employees: 180,
  industry: 'B2B SaaS',
  message: 'We are comparing a few platforms for the team. Can you send an overview?',
};

type Lead = typeof lead;

const leadQuestions = {
  fit: {
    type: 'choice',
    instructions: 'How well does `title` match a buyer for a developer platform?',
    criteria: {
      strong: 'Engineering leader or technical founder who owns the buying decision',
      partial: 'Technical role without budget authority, or a buyer one step removed',
      poor: 'No technical buying role',
    },
  },
  intent: {
    type: 'score',
    instructions: 'How close is `message` to a buying decision?',
    criteria: [
      'Browsing, no specific need',
      'Researching, gathering information',
      'Evaluating, comparing options against a real need',
      'Ready to buy, asking for pricing or a next step with a deadline',
    ],
  },
  icp: {
    type: 'boolean',
    instructions: 'Does this company match an ideal customer: B2B software, 50 or more employees?',
    criteria: {
      true: 'B2B software company with at least 50 employees',
      false: 'Wrong industry, or too small to buy',
    },
  },
} as const;

type Answers = {
  fit: { choice: string };
  intent: { score: number };
  icp: { probability: number };
};

const intentLabels = ['browsing', 'researching', 'evaluating', 'ready to buy'] as const;
const jev = typeSafeAi.evaluationModel('jev-latest');

const leadScorer = new Classifier({
  id: 'lead-scorer',
  model: jev,
  questions: leadQuestions,
});

const lookupAccount = createTool({
  id: 'lookup-account',
  description: 'Look up list price. Never returns a discount.',
  inputSchema: z.object({ company: z.string() }),
  outputSchema: z.object({ listPricePerSeat: z.number(), seatsQuoted: z.number() }),
  execute: async () => account,
});

const agent = new Agent({
  id: 'sales-agent',
  name: 'Sales agent',
  instructions: [
    'You draft replies to inbound leads.',
    'Call lookup-account before you mention a price.',
    'Quote only the list price the tool returns. Never offer a discount.',
    'Keep the reply under 80 words.',
  ].join('\n'),
  model: STRONG,
  tools: { lookupAccount },
});

function pick(answers: Answers): string | undefined {
  if (answers.fit.choice === 'poor' || answers.intent.score < 1) return SMALL;
  if (answers.fit.choice === 'strong' && answers.icp.probability >= 0.8) return STRONG;
  return undefined;
}

function prompt(value: Lead): string {
  return [
    'New inbound lead.',
    `Name: ${value.name}`,
    `Company: ${value.company} (${value.employees} employees, ${value.industry})`,
    `Title: ${value.title}`,
    `Message: ${value.message}`,
    '',
    'Look up the account, then draft a short reply. Do not invent a discount or a price.',
  ].join('\n');
}

console.log('The classifier does not write the reply. It picks the model that will.');
console.log('');
console.log(`The agent's own model is ${STRONG}. It stays unless the answers say this lead is not worth it.`);
console.log('  A poor fit, or intent under 1, drops to gpt-5-nano.');
console.log('  A strong fit with an ICP chance of 0.8 or more keeps gpt-5-mini.');
console.log('  Anything else returns nothing, and the agent keeps its own model.');
console.log('');

async function run(value: Lead) {
  const scored = await leadScorer.evaluate({ state: value });
  const answers = scored.answers;
  const chosen = pick(answers);
  const intentLevel = intentLabels[Math.round(answers.intent.score)];

  console.log(`Before the agent replies to ${value.name}:`);
  console.log(`  fit ${answers.fit.choice}. intent ${answers.intent.score}, ${intentLevel ?? 'between rungs'}. icp ${answers.icp.probability.toFixed(2)}.`);
  if (chosen === SMALL) console.log(`  Downgraded to ${SMALL}.`);
  else if (chosen === STRONG) console.log(`  Kept ${STRONG}.`);
  else console.log('  No change. Not poor enough to downgrade, not strong enough to confirm.');
  console.log('');

  const result = await agent.generate(prompt(value), {
    maxSteps: 3,
    inputProcessors: [
      new ModelSelectionProcessor({
        id: 'lead-model',
        classifier: leadScorer,
        select: pick,
      }),
    ],
  });

  console.log('The agent replied:');
  console.log(result.text || '(no reply)');
}

const cases = [
  { heading: 'Keeps the strong model', value: lead },
  { heading: 'Drops because the title is not a buyer', value: poorFit },
  { heading: 'Drops because there is no ask', value: browsing },
  { heading: 'Leaves the model alone', value: partial },
];

for (const [index, item] of cases.entries()) {
  if (index > 0) console.log('');
  console.log(`--- ${item.heading} ---`);
  console.log(`${item.value.name}, ${item.value.title} at ${item.value.company}.`);
  console.log(`"${item.value.message}"`);
  console.log('');
  await run(item.value);
}
