/**
 * Grade a draft after the fact.
 *
 * Each scorer asks one question and turns the answer into 0-1. The sentence
 * under the number is the criterion that was chosen, so the score says what
 * was wrong. A scorer does not write a reply, and it does not stop one.
 *
 * Run: pnpm scorer
 */
import { typeSafeAi } from '@ai-sdk/typesafe-ai';
import { Classifier } from '@mastra/core/classifier';
import { createClassifierScorer } from '@mastra/core/evals';

const lead = {
  name: 'Priya Shah',
  company: 'Northwind Analytics',
  title: 'VP Engineering',
  message: 'We need pricing for 200 seats before our Q3 planning meeting next Thursday.',
};

// The numbers the reply is allowed to use. A scorer does not see the tool call,
// so "grounded" means "matches these numbers."
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

// One reply per failure. The first holds the price and asks for a meeting.
// Each of the others breaks one rule, so one column moves and the rest stay put.
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

function state({ run }: { run: { output?: unknown } }) {
  const output = run.output;
  const text = output && typeof output === 'object' && 'text' in output && typeof output.text === 'string' ? output.text : '';
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

console.log('A scorer grades a draft. It does not write one, and it does not stop one.');
console.log('');
console.log('The account tool is the only source of numbers: $49 per seat, 200 seats.');
console.log('High is good, except for the last one.');
console.log('  grounded    1 matches the tool. 0 invents a price, a discount, or a seat count.');
console.log('  next-step   a meeting is 1, a reply is 0.4, no ask is 0.');
console.log('  concedes    high means it gives ground on price. That is a failure.');
console.log('');

for (const draft of drafts) {
  console.log(`--- ${draft.id} ---`);
  console.log(draft.note);
  console.log(`"${draft.text}"`);
  console.log('');

  for (const scorer of [grounded, nextStep, concedes]) {
    const result = await scorer.run({ input: lead, output: { text: draft.text } });
    console.log(`  ${scorer.id.padEnd(10)} ${(result.score ?? 0).toFixed(2)}  ${result.reason ?? ''}`);
  }
  console.log('');
}
