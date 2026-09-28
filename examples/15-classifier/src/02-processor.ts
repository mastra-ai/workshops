/**
 * The classifier sits on the agent. It still does not write the reply.
 *
 * Before the model runs, drop a lead the business will not work.
 * After the model drafts, stop a reply that concedes on price. That second
 * check is its own classifier, because it reads the draft, not the lead.
 *
 * Run: pnpm processor
 */
import { typeSafeAi } from '@ai-sdk/typesafe-ai';
import { Agent } from '@mastra/core/agent';
import { Classifier } from '@mastra/core/classifier';
import { ClassifierProcessor } from '@mastra/core/processors';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const account = { listPricePerSeat: 49, seatsQuoted: 200 };

const lead = {
  name: 'Priya Shah',
  company: 'Northwind Analytics',
  title: 'VP Engineering',
  employees: 180,
  industry: 'B2B SaaS',
  message: 'We need pricing for 200 seats before our Q3 planning meeting next Thursday.',
};

/** A lead the business will not work. Same shape, different title and company. */
const badLead = {
  name: 'Sam Ortiz',
  company: 'Ortiz Landscaping',
  title: 'Owner',
  employees: 4,
  industry: 'Landscaping',
  message: 'Do you sell anything that could help a four-person crew?',
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

// One question, about the draft. Lead questions cannot grade a reply:
// a draft has no title and no company, so those answers would not move.
const draftQuestions = {
  concedes: {
    type: 'boolean',
    instructions: 'Does this reply concede on price, offer a discount, or invite a negotiation?',
    criteria: {
      true: 'Offers a discount, a percentage off, a flexible price, or asks what budget they had in mind',
      false: 'Holds the list price, or names no price at all',
    },
  },
} as const;

const intentLabels = ['browsing', 'researching', 'evaluating', 'ready to buy'] as const;
const jev = typeSafeAi.evaluationModel('jev-latest');

const leadScorer = new Classifier({
  id: 'lead-scorer',
  model: jev,
  questions: leadQuestions,
});

const draftCheck = new Classifier({
  id: 'draft-check',
  model: jev,
  questions: draftQuestions,
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
    'Keep the reply under 80 words. Name the person and the company, and ask for a meeting.',
  ].join('\n'),
  model: 'openai/gpt-5-mini',
  tools: { lookupAccount },
});

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

function screenLead(value: Lead) {
  return new ClassifierProcessor({
    id: 'lead-screen',
    classifier: leadScorer,
    // A failed classifier call should not take the agent down during a demo.
    errorStrategy: 'warn',
    onResult: (answers, context) => {
      const intentLevel = intentLabels[Math.round(answers.intent.score)];
      console.log(`Before the agent replies to ${value.name}:`);
      console.log(`  fit ${answers.fit.choice}. Does "${value.title}" own a buying decision?`);
      console.log(`  intent ${answers.intent.score}, ${intentLevel ?? 'between rungs'}.`);
      console.log(`  icp ${answers.icp.probability.toFixed(2)}. Chance this company matches.`);

      if (answers.fit.choice === 'poor' || answers.icp.probability < 0.3) {
        console.log('  Stopped. A poor fit, or an ICP chance under 0.3, never reaches the model.');
        context.abort(`${value.name} is not a fit. No reply was drafted.`);
        return;
      }

      console.log('  Let through. The agent will draft a reply.');
      if (answers.intent.score >= 2) console.log('  Also flagged hot. Intent of 2 or more means evaluating or ready to buy.');
      console.log('');
    },
  });
}

function checkDraft() {
  return new ClassifierProcessor({
    id: 'offer-check',
    classifier: draftCheck,
    errorStrategy: 'warn',
    onResult: (answers, context) => {
      const chance = answers.concedes.probability;
      console.log('After the model drafted:');
      console.log(`  concedes ${chance.toFixed(2)}. The chance this reply gives ground on price.`);
      console.log('  The line is 0.8, not 0.5. A coin flip is not enough to throw a reply away.');

      if (chance >= 0.8) {
        console.log('  Tripwire. The account tool did not authorize a discount, so this reply is not returned.');
        context.abort('Draft offers a discount the account tool did not authorize.');
        return;
      }

      console.log('  Let through. The reply holds the list price, or names no price at all.');
      console.log('');
    },
  });
}

async function run(value: Lead) {
  const result = await agent.generate(prompt(value), {
    maxSteps: 3,
    inputProcessors: [screenLead(value)],
    outputProcessors: [checkDraft()],
  });

  if (result.tripwire) {
    console.log(`The caller gets the reason, not a reply: "${result.tripwire.reason}"`);
    return;
  }

  console.log('The reply the agent was allowed to send:');
  console.log(result.text);
}

console.log('The classifier does not write the reply. It decides whether the agent should.');
console.log('');
console.log('--- A lead worth a reply ---');
console.log(`${lead.name}, ${lead.title} at ${lead.company}.`);
console.log(`"${lead.message}"`);
console.log('');
await run(lead);

console.log('');
console.log('--- A lead that should never reach the agent ---');
console.log(`${badLead.name}, ${badLead.title} at ${badLead.company}, ${badLead.employees} people, ${badLead.industry}.`);
console.log(`"${badLead.message}"`);
console.log('');
await run(badLead);
