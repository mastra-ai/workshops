/**
 * Seed the drafts Studio scores in bulk.
 *
 * A scorer experiment passes `item.input` straight to `scorer.run()`.
 * That input is `{ output: { text } }`, not a chat message.
 *
 * Run: pnpm seed
 * Then open Studio, Datasets, Draft grades, and run an experiment against
 * grounded, next-step, and concedes.
 */
import { typeSafeAi } from '@ai-sdk/typesafe-ai';
import { Classifier } from '@mastra/core/classifier';
import { createClassifierScorer } from '@mastra/core/evals';
import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';

const lead = {
  name: 'Priya Shah',
  company: 'Northwind Analytics',
  title: 'VP Engineering',
  message: 'We need pricing for 200 seats before our Q3 planning meeting next Thursday.',
};

const toolResult = { listPricePerSeat: 49, seats: 200 };

const draftQuestions = {
  grounded: {
    type: 'score',
    instructions:
      'How closely does every number and offer in `draft` match `toolResult`? Read `lead.message` for what was asked, not as a source of prices.',
    criteria: [
      'Invents a price, a discount, a seat count, or a deadline the tool result does not contain',
      'Mixes a real figure from the tool result with a figure it invented',
      'Uses only figures from the tool result, but drops the unit or the seat count',
      'Every figure matches the tool result, including price per seat and seats',
    ],
  },
  nextStep: {
    type: 'choice',
    instructions: 'What does `draft` ask the lead to do next?',
    criteria: {
      meeting: 'Proposes a specific call or meeting',
      reply: 'Asks the lead to reply, confirm, or send something',
      none: 'No ask. The draft ends on the quote',
    },
  },
  concedes: {
    type: 'boolean',
    instructions: 'Does `draft` concede on price, offer a discount, or invite a negotiation that `toolResult` does not authorize?',
    criteria: {
      true: 'Offers a discount, a percentage off, a flexible price, or asks what budget they had in mind',
      false: 'Holds the list price, or names no price at all',
    },
  },
} as const;

const drafts = [
  {
    id: 'holds-price',
    note: 'Every figure is in the tool result, and Wednesday is a specific ask.',
    text: 'Priya, Northwind can have 200 seats at $49 each before Thursday. Can we meet Wednesday to confirm?',
  },
  {
    id: 'invents-discount',
    note: '15% off is not in the tool result.',
    text: 'Priya, we can do 200 seats at $49, and I can take 15% off if you sign this week.',
  },
  {
    id: 'no-ask',
    note: 'The numbers match, but it never asks for a next step.',
    text: 'Priya, Northwind Analytics can have 200 seats at $49 per seat.',
  },
  {
    id: 'reply-only',
    note: 'It asks them to write back, not to meet.',
    text: 'Priya, the list price is $49 per seat for 200 seats. Reply if you want me to send the quote.',
  },
  {
    id: 'opens-negotiation',
    note: 'No invented number, but it invites a price the tool did not authorize.',
    text: 'Priya, list price is $49 per seat for 200. What budget did you have in mind? Happy to find a number that works.',
  },
  {
    id: 'wrong-price',
    note: '$39 is not the list price. The meeting ask does not make the number real.',
    text: 'Priya, I can get Northwind 200 seats at $39 each. Can we meet Wednesday to lock it in?',
  },
];

const jev = typeSafeAi.evaluationModel('jev-latest');

const draftScorer = new Classifier({
  id: 'draft-scorer',
  model: jev,
  questions: draftQuestions,
});

function state(context: { run: { output?: unknown } }) {
  const output = context.run.output;
  const text =
    typeof output === 'string'
      ? output
      : output && typeof output === 'object' && 'text' in output && typeof output.text === 'string'
        ? output.text
        : '';
  return { lead, toolResult, draft: text };
}

const grounded = createClassifierScorer({
  id: 'grounded',
  name: 'Grounded in the account',
  description: '1 when every figure matches the account tool. 0 when the draft invents a price.',
  classifier: draftScorer,
  question: 'grounded',
  state,
});

const nextStep = createClassifierScorer({
  id: 'next-step',
  name: 'Asks for a next step',
  description: 'A meeting scores 1. Asking them to reply scores 0.4. Ending on the quote scores 0.',
  classifier: draftScorer,
  question: 'nextStep',
  scores: { meeting: 1, reply: 0.4, none: 0 },
  state,
});

const concedes = createClassifierScorer({
  id: 'concedes',
  name: 'Gives ground on price',
  description: 'High is a failure. It is the chance the draft offers a discount the account tool did not authorize.',
  classifier: draftScorer,
  question: 'concedes',
  state,
});

// Studio's dev server runs with cwd src/mastra/public and opens file:./mastra.db.
// This script runs from that same folder, so both see one database.
const mastra = new Mastra({
  scorers: { grounded, nextStep, concedes },
  storage: new LibSQLStore({ id: 'classifier-workshop', url: 'file:./mastra.db' }),
});

const NAME = 'Draft grades';
const existing = await mastra.datasets.list({ page: 0, perPage: 100 });
for (const dataset of existing.datasets) {
  if (dataset.name === NAME) await mastra.datasets.delete({ id: dataset.id });
}

const dataset = await mastra.datasets.create({
  name: NAME,
  description:
    'Six replies to the same lead. Grounded checks the numbers against the account tool ($49, 200 seats). Next-step checks the ask. Concedes is a failure when it is high.',
  scorerIds: ['grounded', 'next-step', 'concedes'],
});

for (const draft of drafts) {
  await dataset.addItem({
    input: { output: { text: draft.text } },
    metadata: { case: draft.id, note: draft.note },
  });
}

console.log(`Seeded ${drafts.length} drafts in "${NAME}" (${dataset.id}).`);
console.log('Open Studio, then Datasets, Draft grades, and run an experiment.');
console.log('Pick grounded, next-step, and concedes.');
