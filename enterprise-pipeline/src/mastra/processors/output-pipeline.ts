import { createStep, createWorkflow } from '@mastra/core/workflows';
import { ProcessorStepSchema } from '@mastra/core/processors';
import { TaskDriftMonitor } from './task-drift-monitor';

const driftStep = createStep(new TaskDriftMonitor());

/**
 * Conditional output processing:
 *
 *   .branch([
 *     [every 5th step → drift monitor]
 *   ])
 *
 * Only checks drift periodically — no wasted compute on every step.
 */
export const outputPipeline = createWorkflow({
  id: 'output-pipeline',
  inputSchema: ProcessorStepSchema,
  outputSchema: ProcessorStepSchema,
})
  .branch([
    [
      async ({ inputData }) => {
        const step = (inputData as any).stepNumber ?? 0;
        return step > 0 && step % 5 === 0;
      },
      driftStep,
    ],
  ])
  .map(async ({ inputData }) => {
    const results = inputData as Record<string, any>;
    // Branch returns { [branchKey]: result } if executed, or empty if no branch matched
    const branchResult = Object.values(results)[0] || {};
    return {
      phase: 'outputStep' as const,
      messages: branchResult.messages || [],
      messageList: branchResult.messageList,
    };
  })
  .commit();
