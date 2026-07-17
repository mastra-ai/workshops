import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { PIIRedactor } from '../processors/pii-redactor';
import { SupportResponseFooter } from '../processors/support-response-footer';
import { lookupOrder, draftRefund, updateTicketStatus } from '../tools/order-tools';
import { searchPolicyKnowledgeBase } from '../tools/policy-tools';
import { supportCompletenessScorer, policyGroundingScorer } from '../scorers/support-scorer';
import { storage, vector } from '../storage';

const semanticRecallEnabled = Boolean(process.env.OPENAI_API_KEY);

export const memory = new Memory({
  storage,
  vector: semanticRecallEnabled ? vector : false,
  embedder: semanticRecallEnabled ? 'openai/text-embedding-3-small' : undefined,
  options: {
    lastMessages: 12,
    ...(semanticRecallEnabled
      ? {
          semanticRecall: {
            topK: 3,
            messageRange: 2,
          },
        }
      : {}),
    workingMemory: {
      enabled: true,
      template: `# Customer support working memory
- Customer preferences:
- Known open issues:
- Prior commitments:
- Escalation notes:`,
    },
  },
});

export const supportAgent = new Agent({
  id: 'support-agent',
  name: 'Support Agent',
  instructions: `You are a TechMart support agent for order, shipping, return, and refund questions.

Use this operating model:
1. Look up the order before discussing order-specific refunds or shipping.
2. Search the policy knowledge base before answering policy questions.
3. You may create refund drafts, but you do not submit refunds.
4. Explain when a request needs manager approval.
5. Keep customer-facing responses concise, empathetic, and specific.
6. Include order IDs, ticket status, and next action when relevant.

Important boundaries:
- Never claim a refund was submitted unless the workflow result says it was submitted.
- Refunds over $100, prior-refund customers, shipped-not-delivered orders, and ambiguous policy cases require approval.
- If information is missing, say what is missing instead of inventing it.`,
  model: 'openai/gpt-5.2',
  tools: {
    lookupOrder,
    searchPolicyKnowledgeBase,
    draftRefund,
    updateTicketStatus,
  },
  memory,
  inputProcessors: [new PIIRedactor()],
  outputProcessors: [new SupportResponseFooter()],
  scorers: {
    supportCompletenessScorer: { scorer: supportCompletenessScorer },
    policyGroundingScorer: { scorer: policyGroundingScorer },
  },
  defaultOptions: {
    maxSteps: 8,
  },
});
