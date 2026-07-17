import type { Processor, ProcessInputStepArgs, ProcessInputStepResult } from '@mastra/core/processors';

export class ModelRouter implements Processor<'model-router'> {
  readonly id = 'model-router' as const;
  readonly name = 'Model Router';
  readonly description = 'Uses GPT-5.2 for the first step, downgrades to GPT-5-nano for follow-ups';

  async processInputStep({ stepNumber }: ProcessInputStepArgs): Promise<ProcessInputStepResult | undefined> {
    if (stepNumber === 0) return; // Keep the default model for the first call

    return { model: 'openai/gpt-5-nano' };
  }
}
