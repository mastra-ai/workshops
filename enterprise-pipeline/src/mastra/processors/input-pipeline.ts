import { createStep, createWorkflow } from '@mastra/core/workflows';
import { ModerationProcessor, ProcessorStepSchema } from '@mastra/core/processors';
import { RegexPreFilter } from './regex-pre-filter';
import { TopicGuard } from './topic-guard';

const regexStep = createStep(new RegexPreFilter());
const topicGuardStep = createStep(new TopicGuard());
const moderationStep = createStep(new ModerationProcessor({ model: 'openrouter/openai/gpt-oss-safeguard-20b' }));

/**
 * Layered input defense:
 *
 *   regexPreFilter  (fast, no LLM — catches PII + profanity)
 *       │
 *       ▼
 *   ┌─ topicGuard ──── LLM-based topic check
 *   │
 *   └─ moderation ──── LLM-based content moderation
 *
 * Cheap checks run first. Expensive LLM checks run in parallel after.
 */
export const inputPipeline = createWorkflow({
  id: 'input-pipeline',
  inputSchema: ProcessorStepSchema,
  outputSchema: ProcessorStepSchema,
})
  .then(regexStep)
  .parallel([topicGuardStep, moderationStep])
  .map(async ({ inputData }) => {
    return inputData['processor:topic-guard'] || inputData['processor:moderation'] || {};
  })
  .commit();
