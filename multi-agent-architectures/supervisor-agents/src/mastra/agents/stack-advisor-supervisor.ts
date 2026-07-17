import { Agent } from '@mastra/core/agent';
import type { DelegationCompleteContext } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import type { DelegationTraceEvent } from '../demo/runtime-events';
import {
  buildDelegationPrompt,
  specialistContextRules,
  specialistNames,
  summarizeScopedContext,
} from './supervisor-shared';
import { appRecommenderAgent } from './app-recommender';
import { operationsReviewerAgent } from './operations-reviewer';
import { securityReviewerAgent } from './security-reviewer';
import { MODEL } from '../utils';

const buildTraceEvent = ({
  primitiveId,
  status,
  prompt,
  summary,
  duration,
  contextShared,
}: {
  primitiveId: string;
  status: DelegationTraceEvent['status'];
  prompt: string;
  summary?: string;
  duration?: number;
  contextShared: string;
}): DelegationTraceEvent => ({
  traceId: `${primitiveId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  specialistId: primitiveId,
  specialistName: specialistNames[primitiveId] ?? primitiveId,
  status,
  reason: specialistContextRules[primitiveId] ?? 'Use only the scoped intake required for this specialist.',
  contextShared,
  prompt: prompt.slice(0, 1200),
  summary: summary?.slice(0, 1200),
  durationMs: duration,
  timestamp: new Date().toISOString(),
});

export const getDelegationTraceEvent = (
  context: DelegationCompleteContext,
  contextShared = summarizeScopedContext(context.messages),
): DelegationTraceEvent =>
  buildTraceEvent({
    primitiveId: context.primitiveId,
    status: context.success ? 'completed' : 'failed',
    prompt: context.prompt,
    summary: context.success ? context.result.text : context.error?.message,
    duration: context.duration,
    contextShared,
  });

export const stackAdvisorSupervisorAgent = new Agent({
  id: 'stack-advisor-supervisor',
  name: 'Self-Hosting Stack Advisor Supervisor',
  description: 'Supervises a selective team of narrow specialists to turn an open-ended self-hosting request into one final tailored recommendation.',
  instructions: `You are the supervisor for a self-hosting stack advisory system.

You stay responsible for the task from start to finish.
- You own routing, delegation, synthesis, and the final answer.
- Specialists are narrow contributors. They do not speak directly to the user.
- Delegate selectively. Do not call every specialist by default.
- Delegate only when a specialist meaningfully improves the answer.
- Pass scoped context instead of the entire conversation.
- When information is missing, state assumptions explicitly and continue when reasonable.
- Keep recommendations realistic for the user's budget, skill level, privacy needs, and maintenance tolerance.

Delegation policy:
- Use App Recommender for software or service selection.
- Use Security Reviewer when internet exposure, authentication, secrets, or backup integrity matter.
- Use Operations Reviewer when maintenance burden, migration effort, or realism for the user's skill level matters.
- The structured intake already captures requirements, so do not delegate to a separate discovery specialist.
- If a specialist is unnecessary, do not use it.

Before each delegation, internally decide the minimum context needed.
Context rules:
- App Recommender: ${specialistContextRules['app-recommender']}
- Security Reviewer: ${specialistContextRules['security-reviewer']}
- Operations Reviewer: ${specialistContextRules['operations-reviewer']}

When you finish, return markdown with exactly these top-level sections in this order:
## Best-fit stack
## Alternative option
## Why this choice
## Security checklist
## Ops burden
## 30-day rollout plan
## Assumptions

Inside the sections:
- Name concrete apps and services when appropriate.
- Include tradeoffs, not just positives.
- Make the security checklist actionable.
- Make the 30-day rollout plan phased and realistic.
- Do not use --- or any other section dividers besides the ones specified above.
- Keep your answers practical, concise, and approachable. The resulting output should be something a real user can understand and use, not an internal design document or a sales pitch.
`,
  model: MODEL,
  agents: {
    appRecommenderAgent,
    securityReviewerAgent,
    operationsReviewerAgent,
  },
  defaultOptions: {
    maxSteps: 4,
    delegation: {
      onDelegationStart: ({ primitiveId, prompt, messages }) => {
        const contextShared = summarizeScopedContext(messages);

        return {
          modifiedPrompt: buildDelegationPrompt({
            primitiveId,
            prompt,
            scopedContextSummary: contextShared,
          }),
          modifiedMaxSteps: 2,
        };
      },
      onDelegationComplete: (context) => ({
        feedback: JSON.stringify(getDelegationTraceEvent(context)),
      }),
    },
  },
  memory: new Memory(),
});
