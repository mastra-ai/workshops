/**
 * Score one lead. No agent, no workflow: state in, answers out.
 *
 * Run: pnpm score
 */
import { typeSafeAi } from '@ai-sdk/typesafe-ai';
import { Classifier } from '@mastra/core/classifier';

const lead = {
  name: 'Priya Shah',
  company: 'Northwind Analytics',
  title: 'VP Engineering',
  employees: 180,
  industry: 'B2B SaaS',
  message: 'We need pricing for 200 seats before our Q3 planning meeting next Thursday.',
};

// Three questions, asked together, about the same lead.
// fit reads the title. intent reads the message. icp reads the company.
// None of them decides what to do next. That stays in code.
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

const intentLabels = ['browsing', 'researching', 'evaluating', 'ready to buy'] as const;

// Jev is an evaluation model. It is not the model that writes the reply.
const jev = typeSafeAi.evaluationModel('jev-latest');

console.log('A classifier answers questions. It does not write the reply.');
console.log('');
console.log(`${lead.name} just came in.`);
console.log(`She is ${lead.title} at ${lead.company}, ${lead.employees} people, ${lead.industry}.`);
console.log(`She wrote: "${lead.message}"`);
console.log('');

const scorer = new Classifier({
  id: 'lead-scorer',
  model: jev,
  questions: leadQuestions,
});

const { fit, intent, icp } = (await scorer.evaluate({ state: lead })).answers;
const intentLevel = Math.round(intent.score);

console.log(`fit is ${fit.choice}.`);
console.log(`  Asked: does "${lead.title}" look like a buyer for a developer platform?`);
console.log('  strong means she owns the decision. partial means technical, but not the buyer.');
console.log('  poor means no technical buying role.');
if (fit.probabilities) {
  const spread = Object.entries(fit.probabilities)
    .map(([choice, probability]) => `${choice} ${probability}`)
    .join(', ');
  console.log(`  The distribution is ${spread}. A flat spread would mean the title was ambiguous.`);
}
console.log('');
console.log(`intent is ${intent.score}, ${intentLabels[intentLevel] ?? 'between levels'}.`);
console.log('  Asked: how close is the message to a buying decision?');
console.log('  0 is browsing. 1 is researching. 2 is evaluating. 3 is ready to buy.');
console.log('  A score can land between rungs. 2.4 would mean past evaluating, not yet ready.');
if (intent.probabilities) {
  const peaked = intent.probabilities[String(intentLevel)];
  console.log(`  ${peaked} of the probability sits on ${intentLevel}. The rest of the rungs are near zero.`);
}
console.log('');
console.log(`icp is ${icp.probability}.`);
console.log('  Asked: is this company B2B software with at least 50 people?');
console.log('  That number is the chance of yes. It is not a confidence score on a yes/no bit.');
console.log('  0.96 is a yes you can act on. 0.55 would be a review, not a rejection.');
console.log('');
console.log('Same questions, second shape: nothing configured, questions passed on the call.');
console.log('Later demos cannot do this. A processor, a workflow step, and a scorer need the');
console.log('questions on the constructor so the answer type exists before the call.');

const open = new Classifier({ id: 'open-scorer', model: jev });
const again = await open.evaluate({ state: lead, questions: leadQuestions });
console.log(
  `It lands in the same place: fit ${again.answers.fit.choice}, intent ${again.answers.intent.score}, icp ${again.answers.icp.probability}.`,
);
