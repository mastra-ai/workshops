/**
 * Same answers, used as control flow. The agent only writes.
 *
 * The classifier step answers. The branches read those answers and write a
 * prompt. A disqualified lead writes no prompt, so the agent is never called.
 *
 * Run: pnpm workflow
 */
import { typeSafeAi } from '@ai-sdk/typesafe-ai';
import { Agent } from '@mastra/core/agent';
import { Classifier } from '@mastra/core/classifier';
import { Mastra } from '@mastra/core/mastra';
import { createTool } from '@mastra/core/tools';
import { createStep, createWorkflow } from '@mastra/core/workflows';
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

/** Same shape as Priya, but the title is not a buyer. The first rule should win. */
const badLead = {
  name: 'Sam Ortiz',
  company: 'Ortiz Landscaping',
  title: 'Owner',
  employees: 4,
  industry: 'Landscaping',
  message: 'Can you send pricing for 20 seats before Friday? We need to decide this week.',
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
    'Keep the reply under 80 words. Name the person and the company, and ask for a meeting.',
  ].join('\n'),
  model: 'openai/gpt-5-mini',
  tools: { lookupAccount },
});

const leadSchema = z.object({
  name: z.string(),
  company: z.string(),
  title: z.string(),
  employees: z.number(),
  industry: z.string(),
  message: z.string(),
});

const routed = z.object({
  route: z.enum(['disqualify', 'sales', 'nurture', 'review']),
  reason: z.string(),
  prompt: z.string(),
  answers: z.object({
    fit: z.object({ choice: z.string() }),
    intent: z.object({ score: z.number() }),
    icp: z.object({ probability: z.number() }),
  }),
});

type Answers = z.infer<typeof routed>['answers'];

function routeStep(id: 'disqualify' | 'sales' | 'nurture' | 'review', reason: string, ask: string) {
  return createStep({
    id,
    inputSchema: z.any(),
    outputSchema: routed,
    execute: async ({ inputData, getInitData }) => {
      const incoming = getInitData() as Lead;
      const answers = (inputData as { answers: Answers }).answers;
      return {
        route: id,
        reason,
        answers,
        prompt: ask ? `${incoming.name} at ${incoming.company} wrote: "${incoming.message}"\n${ask}` : '',
      };
    },
  });
}

// The classifier step replaces the lead with { answers }. The original fields
// come back through getInitData, or the prompt has nothing to name.
const disqualify = routeStep('disqualify', 'Title is not a buyer.', '');
const sales = routeStep('sales', 'Ready to buy. Hand to a rep.', 'Quote only the list price and ask for a meeting.');
const nurture = routeStep('nurture', 'Matches the ICP, but not ready to buy.', 'Offer help. Do not quote a price.');
const review = routeStep('review', 'No rule matched. A person should look.', 'Write a one-paragraph summary. Do not quote a price.');

const toPrompt = createStep({
  id: 'to-prompt',
  inputSchema: z.any(),
  outputSchema: z.object({ prompt: z.string(), text: z.string() }),
  execute: async ({ inputData, bail }) => {
    const chosen = Object.values(inputData as Record<string, { prompt?: string }>).find(value => value?.prompt);
    // An empty prompt means this route gets no reply. bail() stops the chain
    // before the agent step starts.
    if (!chosen?.prompt) return bail({ prompt: '', text: '' });
    return { prompt: chosen.prompt, text: '' };
  },
});

// branch() runs every matching condition, not the first. Later conditions
// exclude the earlier ones, or a poor-fit lead also gets a sales prompt.
const workflow = createWorkflow({
  id: 'lead-route',
  inputSchema: leadSchema,
  outputSchema: z.object({ text: z.string() }),
})
  .classifier<typeof leadQuestions>('lead-scorer')
  .branch([
    [async ({ inputData }) => inputData.answers.fit.choice === 'poor', disqualify],
    [
      async ({ inputData }) => inputData.answers.fit.choice !== 'poor' && inputData.answers.intent.score >= 2,
      sales,
    ],
    [
      async ({ inputData }) =>
        inputData.answers.fit.choice !== 'poor' &&
        inputData.answers.intent.score < 2 &&
        inputData.answers.icp.probability > 0.8,
      nurture,
    ],
    [
      async ({ inputData }) =>
        inputData.answers.fit.choice !== 'poor' &&
        inputData.answers.intent.score < 2 &&
        inputData.answers.icp.probability <= 0.8,
      review,
    ],
  ])
  .then(toPrompt)
  .agent(agent)
  .commit();

const mastra = new Mastra({
  agents: { salesAgent: agent },
  classifiers: { leadScorer },
  workflows: { leadRoute: workflow },
});

const routes = ['disqualify', 'sales', 'nurture', 'review'] as const;
const intentLabels = ['browsing', 'researching', 'evaluating', 'ready to buy'] as const;

console.log('The classifier answers. The workflow routes. The agent writes.');
console.log('');
console.log('  1. fit is poor             -> disqualify, no reply');
console.log('  2. intent is 2 or more     -> sales, quote the list price');
console.log('  3. icp chance is above 0.8 -> nurture, no price');
console.log('  4. nothing else matched    -> review, a summary for a person');
console.log('');

async function run(value: Lead) {
  console.log(`${value.name}, ${value.title} at ${value.company}.`);
  console.log(`"${value.message}"`);
  console.log('');

  const started = await mastra.getWorkflow('leadRoute').createRun();
  const result = await started.start({ inputData: value });

  if (result.status !== 'success') {
    console.log(result.status, 'error' in result ? result.error : '');
    process.exit(1);
  }

  const steps = result.steps ?? {};
  const routeId = routes.find(id => steps[id]?.status === 'success');
  const routedStep = routeId ? steps[routeId] : undefined;
  const output = routedStep?.status === 'success' ? (routedStep.output as z.infer<typeof routed>) : undefined;

  if (!routeId || !output) {
    console.log('No branch ran.');
    process.exit(1);
  }

  const { fit, intent, icp } = output.answers;
  const intentLevel = intentLabels[Math.round(intent.score)];
  console.log(`fit ${fit.choice}, intent ${intent.score} (${intentLevel ?? 'between rungs'}), icp ${icp.probability.toFixed(2)}.`);
  console.log(`Routed to \`${routeId}\`. ${output.reason}`);

  const agentStep = steps['sales-agent'];
  const draft =
    agentStep?.status === 'success' && agentStep.output && typeof agentStep.output === 'object' && 'text' in agentStep.output
      ? String(agentStep.output.text ?? '')
      : '';
  if (!draft) {
    console.log('The agent was not called. A poor fit writes no prompt, so the step bails.');
  } else {
    console.log('');
    console.log('The agent wrote, inside the route it was given:');
    console.log(draft);
  }
}

console.log('--- A lead the rules hand to sales ---');
await run(lead);

console.log('');
console.log('--- A lead the first rule stops ---');
console.log('The message asks for pricing. The title is not a buyer, so the agent never starts.');
console.log('');
await run(badLead);
