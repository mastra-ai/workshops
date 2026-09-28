/**
 * A tool that pauses for a person, but only when the quote is worth pausing for.
 *
 * `requireApproval` runs before `execute`. It asks one boolean question.
 * A probability of 0.7 or more suspends the agent. Below that, the quote goes out.
 * The classifier never sends anything.
 *
 * Run: pnpm approval
 */
import { typeSafeAi } from '@ai-sdk/typesafe-ai';
import { Agent } from '@mastra/core/agent';
import { Classifier } from '@mastra/core/classifier';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const LINE = 0.7;
const account = { listPricePerSeat: 49 };

const jev = typeSafeAi.evaluationModel('jev-latest');

const approvalCheck = new Classifier({
  id: 'approval-check',
  model: jev,
  questions: {
    needsReview: {
      type: 'boolean',
      instructions: 'Does this quote need a person to approve it before it is sent?',
      criteria: {
        true: 'More than 100 seats, or any discount',
        false: 'List price for 100 seats or fewer',
      },
    },
  },
});

// Approving a suspended tool calls requireApproval again. Remember the first
// answer so the resume does not score the same quote twice.
const seen = new Map<string, boolean>();

const sendPricing = createTool({
  id: 'send-pricing',
  description: 'Send a quote. Large quotes and any discount wait for a person.',
  inputSchema: z.object({
    to: z.string(),
    seats: z.number(),
    discountPercent: z.number().default(0),
  }),
  outputSchema: z.object({ sent: z.boolean(), total: z.number() }),
  requireApproval: async input => {
    const key = `${input.to}:${input.seats}:${input.discountPercent}`;
    const cached = seen.get(key);
    if (cached !== undefined) return cached;

    const result = await approvalCheck.evaluate({ state: input });
    const chance = result.answers.needsReview.probability;
    const ask = chance >= LINE;
    seen.set(key, ask);

    console.log(`  Quote: ${input.seats} seats for ${input.to}, ${input.discountPercent}% off.`);
    console.log(`  needsReview ${chance.toFixed(2)}. The chance a person should see this before it goes out.`);
    console.log(`  The line is ${LINE}. ${ask ? 'Paused for a person.' : 'Small enough. Sent without asking.'}`);
    return ask;
  },
  execute: async ({ seats, discountPercent }) => ({
    sent: true,
    total: Math.round(seats * account.listPricePerSeat * (1 - discountPercent / 100)),
  }),
});

const agent = new Agent({
  id: 'sales-agent',
  name: 'Sales agent',
  instructions: 'Send the quote the user asks for. Do not draft a reply before the tool runs.',
  model: 'openai/gpt-5-mini',
});

console.log('The classifier does not send the quote. It decides whether a person has to.');
console.log('');
console.log('true:  more than 100 seats, or any discount');
console.log('false: list price for 100 seats or fewer');
console.log(`${LINE} or higher pauses the agent. Under that, the tool sends it.`);
console.log('');

async function quote(seats: number, discountPercent: number) {
  const result = await agent.generate(
    [
      'Send the quote. Do not draft a reply first.',
      `Call send-pricing with to="Priya Shah", seats=${seats}, discountPercent=${discountPercent}.`,
      'Then say whether it was sent or is waiting.',
    ].join('\n'),
    {
      maxSteps: 4,
      toolsets: { pricing: { sendPricing } },
    },
  );

  if (result.finishReason !== 'suspended' || !result.runId || !result.suspendPayload) {
    console.log('  The tool ran. Nobody was asked.');
    console.log(`  ${result.text || '(no reply)'}`);
    return;
  }

  const payload = result.suspendPayload;
  console.log(`  Waiting on tool call ${payload.toolCallId}. The quote has not been sent.`);

  const done = await agent.approveToolCallGenerate({
    runId: result.runId,
    toolCallId: payload.toolCallId,
  });
  console.log('  Approved. The tool sent it, and the agent continued.');
  console.log(`  ${done.text || '(no reply)'}`);
}

console.log('--- Goes out on its own ---');
console.log('20 seats at list price. Under 100, and no discount.');
await quote(20, 0);

console.log('');
console.log('--- Waits for a person ---');
console.log('200 seats. Over 100, so the tool does not send it until someone approves.');
await quote(200, 0);
