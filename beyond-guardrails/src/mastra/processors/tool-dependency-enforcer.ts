import type { Processor, ProcessInputStepArgs, ProcessInputStepResult } from '@mastra/core/processors';

/**
 * Enforces tool call ordering. Some tools should only become available
 * after prerequisites have been called. For example:
 * - create_order requires search_products AND check_inventory first
 * - process_refund requires lookup_order first
 */
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

    // Collect all tool names that have been called in previous steps
    const calledTools = new Set<string>();
    for (const step of steps) {
      for (const call of step.toolCalls || []) {
        calledTools.add(call.toolName);
      }
    }

    // Filter out tools whose dependencies haven't been met
    const allowed = activeTools.filter(toolName => {
      const deps = TOOL_DEPENDENCIES[toolName];
      if (!deps) return true; // No dependencies — always available
      return deps.every(dep => calledTools.has(dep));
    });

    return { activeTools: allowed };
  }
}
