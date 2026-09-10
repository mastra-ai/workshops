import { expect, test } from 'vitest';
import { mastra } from '../src/mastra/index.js';
import { capabilities } from '../src/mastra/mcp/index.js';

test('registers the same five tools with Mastra and MCP', () => {
  expect(mastra.listTools()).toEqual(capabilities.tools);
  expect(Object.keys(mastra.listTools() ?? {})).toHaveLength(5);
});
