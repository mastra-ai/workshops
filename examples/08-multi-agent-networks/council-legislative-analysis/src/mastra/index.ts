/**
 * Mastra instance configuration — the central registry for agents and workflows.
 *
 * The `Mastra` class acts as a dependency injection container that makes agents
 * and workflows available throughout the application:
 *
 *   - **Agents** are registered by key (e.g., "fiscalAnalyst"). Workflow steps
 *     retrieve them at runtime via `mastra.getAgent(key)`. The key must match
 *     what the step passes to `getAgent()`.
 *
 *   - **Workflows** are registered by key and can be retrieved via
 *     `mastra.getWorkflow(key)` in API routes or other application code.
 *
 * This file wires together the agents defined in `./agents` and the workflows
 * defined in `./workflows` into a single Mastra instance exported for use
 * by the Next.js API route (`/api/analyze`).
 *
 * Agent key → Agent ID mapping:
 *   The agent's registration key here (e.g., "fiscalAnalyst") is what workflow
 *   steps use to look up the agent. This is different from the agent's `id` field
 *   (e.g., "fiscal-analyst") which is used internally by Mastra for logging/tracing.
 */
import { Mastra } from '@mastra/core/mastra';

import {
  fiscalAnalyst,
  healthAnalyst,
  defenseAnalyst,
  technologyAnalyst,
  civilRightsAnalyst,
  environmentalAnalyst,
  synthesizer,
} from './agents';
import { legislativeCouncilWorkflow, legislativeCouncilWithDeliberationWorkflow } from './workflows';

export const mastra = new Mastra({
  agents: {
    fiscalAnalyst,
    healthAnalyst,
    defenseAnalyst,
    technologyAnalyst,
    civilRightsAnalyst,
    environmentalAnalyst,
    synthesizer,
  },
  workflows: {
    legislativeCouncilWorkflow,
    legislativeCouncilWithDeliberationWorkflow,
  },
});
