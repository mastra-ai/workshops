import { Agent } from '@mastra/core/agent';
import type { Processor, ProcessOutputStepArgs } from '@mastra/core/processors';
import type { MastraDBMessage } from '@mastra/core/agent';
import { z } from 'zod';

type DriftMetadata = {
  driftScore: number;
  originalIntent: string;
};

const evaluator = new Agent({
  id: 'drift-evaluator',
  name: 'Drift Evaluator',
  model: 'openai/gpt-5-nano',
  instructions: `You evaluate whether an AI assistant's response is aligned with the user's original intent.
Score 0.0 (perfectly aligned) to 1.0 (completely off-topic).
A score above 0.6 means the agent has drifted.`,
});

export class TaskDriftMonitor implements Processor<'task-drift-monitor', DriftMetadata> {
  readonly id = 'task-drift-monitor' as const;
  readonly name = 'Task Drift Monitor';
  readonly description = 'Checks if the agent is still aligned with the original task';

  async processOutputStep({
    messages,
    text,
    state,
    abort,
  }: ProcessOutputStepArgs<DriftMetadata>): Promise<MastraDBMessage[]> {
    // Store the original user intent on first call
    if (!state.originalIntent) {
      const firstUserMsg = messages.find(m => m.role === 'user');
      state.originalIntent = firstUserMsg ? JSON.stringify(firstUserMsg.content) : '';
    }

    // Note: this processor is invoked conditionally by the output pipeline
    // (every 5th step), so no internal step check needed here.

    const result = await evaluator.generate(
      `Original intent: ${state.originalIntent}\n\nLatest response: ${text ?? '(no text)'}`,
      {
        structuredOutput: {
          schema: z.object({
            aligned: z.boolean(),
            driftScore: z.number(),
            reason: z.string(),
          }),
        },
      },
    );

    if (result.object && !result.object.aligned) {
      abort(`Agent is drifting: ${result.object.reason}. Refocus on: ${state.originalIntent}`, {
        retry: true,
        metadata: {
          driftScore: result.object.driftScore,
          originalIntent: state.originalIntent as string,
        },
      });
    }

    return messages;
  }
}
