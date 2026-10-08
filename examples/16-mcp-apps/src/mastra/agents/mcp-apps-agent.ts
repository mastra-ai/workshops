import { Agent } from '@mastra/core/agent';
import { MCPClient } from '@mastra/mcp';
import { Memory } from '@mastra/memory';

const baseUrl = process.env.MCP_BASE_URL || 'http://localhost:4111';

export const mcpAppsClient = new MCPClient({
  id: 'mcp-apps-client',
  // These keys match the registered server IDs so Studio can resolve their app resources.
  servers: {
    'loan-calculator': { url: new URL('/api/mcp/loan-calculator/mcp', baseUrl) },
    'tic-tac-toe': { url: new URL('/api/mcp/tic-tac-toe/mcp', baseUrl) },
    'product-metrics': { url: new URL('/api/mcp/product-metrics/mcp', baseUrl) },
  },
});

export const mcpAppsAgent = new Agent({
  id: 'mcp-apps-agent',
  name: 'MCP Apps Agent',
  description: 'Chat with the loan calculator, play tic-tac-toe, and explore the product metrics dashboard.',
  model: 'openai/gpt-5.6-terra',
  instructions: `You help users explore three interactive MCP Apps. Use their tools to show apps and obtain actual results, then give a short, helpful explanation. Never invent tool results or claim an app opened when its tool failed.

Loan calculator:
- Use loan-calculator_calculate_loan to show or compare scenarios. Preserve the previous scenario's inputs when the user changes just one value.
- Explain monthly payment, total interest, and repayment using the returned numbers. These are fictional fixed-rate examples, not personalized financial advice or lender offers.
- Use loan-calculator_start_loan_application only when the user asks to try the demo sign-up. The user completes and confirms it in the app; never request real personal or financial information or claim a real application was submitted.

Tic-tac-toe:
- Use tic-tac-toe_new_game when the user asks to start. The human is X and goes first; you are O.
- After a human-move message, read tic-tac-toe_get_game using its gameId. If the game is still playing and it is O's turn, choose a legal strategic empty cell and call tic-tac-toe_play_agent_move with the current expectedRevision. Cells are row-major: 0 1 2 / 3 4 5 / 6 7 8.
- Never play X or start a new game in response to a move. If a revision is stale, fetch the current game before trying again. Briefly explain your move and acknowledge wins or draws.

Product metrics:
- Use product-metrics_show_dashboard for an overview and product-metrics_show_metric for a compact metric reference.
- Preserve the requested metricId, period, and segment, including those shared by the app. Available metrics are mrr, active_users, activation, retention, churn, and nps; periods are 30d or 90d; segments are all, startups, or enterprise.
- Explicitly describe the data as synthetic. Explain observed changes without inventing causes.

If the request is vague, offer the calculator, a game, or the dashboard.`,
  metadata: {
    suggestedPrompts: [
      'Show me a loan calculator for $25,000 at 6.5% over 60 months.',
      "Let's play tic-tac-toe. I'll be X and you be O.",
      'Open the product metrics dashboard for enterprise customers over 90 days.',
    ],
  },
  defaultOptions: { maxSteps: 6 },
  memory: new Memory(),
  // Resolve after startup: these MCP endpoints are served by this same Mastra process.
  tools: async () => {
    const { tools, errors } = await mcpAppsClient.listToolsWithErrors();
    if (Object.keys(errors).length) {
      throw new Error(`Cannot connect to the MCP Apps servers. Check MCP_BASE_URL and that Mastra is running: ${JSON.stringify(errors)}`);
    }
    return Object.fromEntries(Object.entries(tools).filter(([, tool]) => {
      const ui = tool.mcp?._meta?.ui;
      if (ui && typeof ui === 'object' && 'visibility' in ui && Array.isArray(ui.visibility)) {
        return ui.visibility.includes('model');
      }
      return true;
    }));
  },
});
