import type { Processor, ProcessInputStepArgs, ProcessInputStepResult } from '@mastra/core/processors';
import { MAX_STEPS } from '../constants';

/**
 * On the penultimate step, injects a system message telling the agent
 * to wrap up its task and summarize progress. Prevents the agent from
 * getting cut off mid-task when it hits the step limit.
 */
export class WrapUpEnforcer implements Processor<'wrap-up-enforcer'> {
  readonly id = 'wrap-up-enforcer' as const;
  readonly name = 'Wrap-Up Enforcer';
  readonly description = 'Tells the agent to wrap up when approaching the step limit';

  async processInputStep({ stepNumber, messageList }: ProcessInputStepArgs): Promise<ProcessInputStepResult | undefined> {
    if (stepNumber < MAX_STEPS - 2) return;

    const stepsRemaining = MAX_STEPS - stepNumber;
    messageList?.addSystem(
      `You have ${stepsRemaining} steps remaining. Wrap up your current task now.
Summarize what you've accomplished and list anything that still needs to be done.
Do NOT start new tool calls unless absolutely necessary.`,
    );

    return { messageList };
  }
}
