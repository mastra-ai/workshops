import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { MCPClient } from '@mastra/mcp';
import { LibSQLStore } from '@mastra/libsql';

const storage = new LibSQLStore({
  id: "libsql",
  url: 'file:memory.db',
});

const memory = new Memory({
  storage,
  options: {
    observationalMemory: true,
  },
});

// Connect to the Playwright MCP server
const mcp = new MCPClient({
  id: 'playwright-mcp',
  servers: {
    playwright: {
      command: 'npx',
      args: ['-y', '@playwright/mcp@latest'],
    },
  },
});

const playwrightAgent = new Agent({
  id: 'playwright-agent',
  name: 'playwright-agent',
  instructions: `You are a browser automation agent. You can navigate the web, interact with pages, fill forms, click buttons, and extract information using Playwright.

When given a task:
1. Navigate to the relevant page
2. Interact with elements as needed
3. Extract and report the information found

Be thorough but concise in your responses.`,
  model: 'cerebras/zai-glm-4.7',
  memory,
  tools: await mcp.listTools(),
  defaultOptions: {
    maxSteps: 50,
  },
});

export const mastra = new Mastra({
  agents: { 'playwright-agent': playwrightAgent },
  server: {
    port: 4112,
  },
});
