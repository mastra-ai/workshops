/**
 * Studio entry. The scripts do not import this file.
 *
 * `pnpm dev` loads it so the workflow graph and the agent are visible.
 * The questions and the classifier are the same ones `03-workflow.ts` uses.
 */
import { typeSafeAi } from '@ai-sdk/typesafe-ai';
import { Agent } from '@mastra/core/agent';
import { Classifier } from '@mastra/core/classifier';
import { Mastra } from '@mastra/core/mastra';
import { createTool } from '@mastra/core/tools';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { LibSQLStore } from '@mastra/libsql';
import { z } from 'zod';

const account = { listPricePerSeat: 49, seatsQuoted: 200 };

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
  answers: z.object({
    fit: z.object({ choice: z.string() }),
    intent: z.object({ score: z.number() }),
    icp: z.object({ probability: z.number() }),
  }),
  prompt: z.string(),
});

function routeStep(id: string, ask: string) {
  return createStep({
    id,
    inputSchema: z.any(),
    outputSchema: routed,
    execute: async ({ inputData, getInitData }) => {
      const incoming = getInitData() as z.infer<typeof leadSchema>;
      const answers = (inputData as { answers: z.infer<typeof routed>['answers'] }).answers;
      return {
        answers,
        prompt: ask ? `${incoming.name} at ${incoming.company} wrote: "${incoming.message}"\n${ask}` : '',
      };
    },
  });
}

const workflow = createWorkflow({
  id: 'lead-route',
  inputSchema: leadSchema,
  outputSchema: z.object({ text: z.string() }),
})
  .classifier<typeof leadQuestions>('lead-scorer')
  .branch([
    [async ({ inputData }) => inputData.answers.fit.choice === 'poor', routeStep('disqualify', '')],
    [
      async ({ inputData }) => inputData.answers.fit.choice !== 'poor' && inputData.answers.intent.score >= 2,
      routeStep('sales', 'Quote only the list price and ask for a meeting.'),
    ],
    [
      async ({ inputData }) =>
        inputData.answers.fit.choice !== 'poor' &&
        inputData.answers.intent.score < 2 &&
        inputData.answers.icp.probability > 0.8,
      routeStep('nurture', 'Offer help. Do not quote a price.'),
    ],
    [
      async ({ inputData }) =>
        inputData.answers.fit.choice !== 'poor' &&
        inputData.answers.intent.score < 2 &&
        inputData.answers.icp.probability <= 0.8,
      routeStep('review', 'Write a one-paragraph summary. Do not quote a price.'),
    ],
  ])
  .then(
    createStep({
      id: 'to-prompt',
      inputSchema: z.any(),
      outputSchema: z.object({ prompt: z.string(), text: z.string() }),
      execute: async ({ inputData, bail }) => {
        const chosen = Object.values(inputData as Record<string, { prompt?: string }>).find(value => value?.prompt);
        if (!chosen?.prompt) return bail({ prompt: '', text: '' });
        return { prompt: chosen.prompt, text: '' };
      },
    }),
  )
  .agent(agent)
  .commit();

export const mastra = new Mastra({
  agents: { salesAgent: agent },
  classifiers: { leadScorer },
  workflows: { leadRoute: workflow },
  // The dev server runs with cwd src/mastra/public. `pnpm seed` runs from that
  // same folder, so both open this file.
  storage: new LibSQLStore({ id: 'classifier-workshop', url: 'file:./mastra.db' }),
});
