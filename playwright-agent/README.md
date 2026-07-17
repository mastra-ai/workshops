# Example 5: Playwright Browser Agent

A browser automation agent using Playwright MCP — the perfect showcase for OM's tool-call compression.

## Why This Demo

Browser automation generates the **heaviest tool output** of any agent pattern:

- DOM snapshots (thousands of tokens per page)
- Accessibility trees
- Screenshot descriptions
- Navigation results with full page content
- Form interactions with element details

This is where OM's 5-40x compression for tool calls really shines. The Observer compresses "navigated to X, found a login form, filled in credentials" from thousands of tokens of DOM/accessibility data into a few lines of observations.

## What You'll See

- Agent navigates real websites, clicks elements, reads content
- Each tool call returns massive context (DOM trees, page content)
- Observer compresses all of it into concise observations
- Agent remembers *what it found* without carrying the raw DOM forward

## Prerequisites

- Node.js v20+
- Playwright browsers will be installed automatically on first run

## Setup

```bash
pnpm install
cp .env.example .env
# Add your OpenAI API key to .env
```

## Running

```bash
pnpm dev
```

Opens Mastra Studio. Try asking the agent to:

- "Go to https://news.ycombinator.com and tell me the top 5 stories"
- "Navigate to https://github.com/mastra-ai/mastra and describe the repo"
- "Go to https://mastra.ai/docs and find the memory documentation"
- "Search Google for 'observational memory mastra' and summarize the results"

Watch the Observer fire frequently — browser tool output is extremely verbose, and OM compresses it down to just the decisions and findings.

## How It Works

This example uses the official [Playwright MCP server](https://www.npmjs.com/package/@playwright/mcp) via Mastra's `MCPClient`:

```typescript
import { MCPClient } from '@mastra/mcp';

const mcp = new MCPClient({
  id: 'playwright-mcp',
  servers: {
    playwright: {
      command: 'npx',
      args: ['-y', '@playwright/mcp@latest'],
    },
  },
});

// Pass MCP tools to the agent
const agent = new Agent({
  // ...
  tools: await mcp.listTools(),
});
```

The MCP server spawns a browser and exposes tools for navigation, clicking, form filling, screenshots, and reading the accessibility tree. Each of these returns verbose structured data that OM compresses efficiently.

## Token Threshold

The `messageTokens` threshold is set to 5k for demo purposes (normally 30k). Browser tool output is so verbose that even 5k triggers quickly — often after just 2-3 page interactions.
