import { Agent } from '@mastra/core/agent';
import { getOrder, checkReturnEligibility } from '../tools/reads.js';

// Optional: deliberately not registered or imported by the keyless core demo.
export const supportAgent = new Agent({
  id: 'returns-support', name: 'Returns support', model: 'openai/gpt-5-mini',
  instructions: 'Help support staff understand orders and eligibility. Use the read tools; never claim a return was created. Ask for an order identifier when missing.',
  tools: { getOrder, checkReturnEligibility },
});
