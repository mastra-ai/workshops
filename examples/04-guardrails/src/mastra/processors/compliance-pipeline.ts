import { createStep, createWorkflow } from '@mastra/core/workflows';
import { ModerationProcessor, ProcessorStepSchema } from '@mastra/core/processors';
import { TopicGuard } from './topic-guard';
import { PIIGuard } from './pii-guard';

const topicGuardStep = createStep(new TopicGuard());
const piiGuardStep = createStep(new PIIGuard());
const moderationStep = createStep(new ModerationProcessor({ model: 'openrouter/openai/gpt-oss-safeguard-20b' }));

/**
 * Compliance pipeline — runs three checks in PARALLEL:
 *
 *   ┌─ Topic Guard ──── is the question on-topic?
 *   │
 *   ├─ PII Guard ────── does the message contain personal info?  (regex, no LLM)
 *   │
 *   └─ Moderation ───── is the content safe?  (built-in processor)
 *
 * If any check calls abort(), the pipeline stops and the agent never sees the message.
 */
export const compliancePipeline = createWorkflow({
  id: 'compliance-pipeline',
  inputSchema: ProcessorStepSchema,
  outputSchema: ProcessorStepSchema,
})
  .parallel([topicGuardStep, piiGuardStep, moderationStep])
  .map(async ({ inputData }) => {
    const results = inputData as Record<string, any>;
    const first =
      results['processor:topic-guard'] ||
      results['processor:pii-guard'] ||
      results['processor:moderation'] ||
      {};
    return {
      phase: 'input' as const,
      messages: first.messages || [],
      messageList: first.messageList,
    };
  })
  .commit();
