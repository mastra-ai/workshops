import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

test('Cursor template uses environment placeholders rather than credentials or personal paths', async () => {
  const raw = await readFile(new URL('../docs/clients/cursor-mcp.json', import.meta.url), 'utf8');
  const config = JSON.parse(raw);
  expect(config.mcpServers['returns-desk']).toEqual({
    url: '${env:MASTRA_BASE_URL}/api/mcp/returns-modern/mcp',
    headers: { Authorization: 'Bearer ${env:RETURNS_DESK_TOKEN}' },
  });
  expect(raw).not.toMatch(/workshop-north|\/Users\/|\/tmp\/|localhost:\d+/);
});
