import { createScorer } from '@mastra/core/evals';
import { createCompletenessScorer } from '@mastra/evals/scorers/prebuilt';
import { getAssistantMessageFromRunOutput, getUserMessageFromRunInput } from '@mastra/evals/scorers/utils';
import { z } from 'zod';

export const supportCompletenessScorer = createCompletenessScorer();

export const policyGroundingScorer = createScorer({
  id: 'policy-grounding-scorer',
  name: 'Policy Grounding',
  description: 'Checks whether support answers that discuss refunds mention policy or approval requirements',
  type: 'agent',
  judge: {
    model: 'openai/gpt-4o',
    instructions:
      'You evaluate TechMart support responses. Return only structured JSON matching the schema. Be strict when refunds are discussed without policy or approval context.',
  },
})
  .preprocess(({ run }) => {
    const userText = getUserMessageFromRunInput(run.input) || '';
    const assistantText = getAssistantMessageFromRunOutput(run.output) || '';
    return { userText, assistantText };
  })
  .analyze({
    description: 'Determine whether refund answers are grounded in policy and approval constraints',
    outputSchema: z.object({
      discussesRefund: z.boolean(),
      mentionsPolicy: z.boolean(),
      mentionsApprovalWhenNeeded: z.boolean(),
      explanation: z.string(),
    }),
    createPrompt: ({ results }) => `
User:
${results.preprocessStepResult.userText}

Assistant:
${results.preprocessStepResult.assistantText}

Evaluate:
1. Does the exchange discuss a refund?
2. If yes, does the assistant mention policy, eligibility, or approval constraints?
3. If the request appears high-risk, does the assistant mention approval?
`,
  })
  .generateScore(({ results }) => {
    const analysis = (results as any)?.analyzeStepResult || {};
    if (!analysis.discussesRefund) return 1;
    if (analysis.mentionsPolicy && analysis.mentionsApprovalWhenNeeded) return 1;
    if (analysis.mentionsPolicy) return 0.7;
    return 0.2;
  })
  .generateReason(({ results, score }) => {
    const analysis = (results as any)?.analyzeStepResult || {};
    return `Policy grounding score=${score}. ${analysis.explanation ?? ''}`;
  });
