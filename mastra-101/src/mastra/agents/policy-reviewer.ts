import { Agent } from '@mastra/core/agent';
import { searchPolicyKnowledgeBase } from '../tools/policy-tools';

export const policyReviewer = new Agent({
  id: 'policy-reviewer',
  name: 'Policy Reviewer',
  instructions: `You review support recommendations against TechMart policy.

Return a concise review with:
- whether the recommendation is policy-supported
- which policy documents matter
- whether manager approval is required
- what should be changed before the customer sees it

Do not submit refunds or update tickets. You only review.`,
  model: 'openai/gpt-5.2',
  tools: { searchPolicyKnowledgeBase },
});
