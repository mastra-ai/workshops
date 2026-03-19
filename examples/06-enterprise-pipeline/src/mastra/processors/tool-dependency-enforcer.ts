import type { Processor, ProcessInputStepArgs, ProcessInputStepResult } from '@mastra/core/processors';

const TOOL_DEPENDENCIES: Record<string, string[]> = {
  create_order: ['search_products', 'check_inventory'],
  process_refund: ['lookup_order'],
};

export class ToolDependencyEnforcer implements Processor<'tool-dependency-enforcer'> {
  readonly id = 'tool-dependency-enforcer' as const;
  readonly name = 'Tool Dependency Enforcer';
  readonly description = 'Gates tool availability based on prerequisite tool calls';

  async processInputStep({ steps, activeTools }: ProcessInputStepArgs): Promise<ProcessInputStepResult | undefined> {
    if (!activeTools) return;

    const calledTools = new Set<string>();
    for (const step of steps) {
      for (const call of step.toolCalls || []) {
        calledTools.add(call.toolName);
      }
    }

    const allowed = activeTools.filter(toolName => {
      const deps = TOOL_DEPENDENCIES[toolName];
      if (!deps) return true;
      return deps.every(dep => calledTools.has(dep));
    });

    return { activeTools: allowed };
  }
}
