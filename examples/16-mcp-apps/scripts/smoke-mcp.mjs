import assert from 'node:assert/strict';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';

const base = process.env.MASTRA_BASE_URL ?? 'http://localhost:4111';
for (const [id, name, args, count] of [
  ['loan-calculator', 'calculate_loan', { principal: 25000, annualRate: 6.5, termMonths: 60 }, 3],
  ['tic-tac-toe', 'new_game', {}, 4],
  ['product-metrics', 'show_dashboard', {}, 2],
]) {
  const client = new Client({ name: 'production-smoke', version: '1.0.0' }, {
    versionNegotiation: { mode: { pin: '2026-07-28' } },
  });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(`/api/mcp/${id}/mcp`, base)));
    const { tools } = await client.listTools();
    assert.equal(tools.length, count);
    const { resources } = await client.listResources();
    assert.equal(resources.length, id === 'product-metrics' ? 2 : 1);
    for (const resource of resources) {
      const { contents } = await client.readResource({ uri: resource.uri });
      assert.equal(contents[0].mimeType, 'text/html;profile=mcp-app');
      assert.ok(contents[0].text?.includes('<script>'));
      assert.ok(!contents[0].text?.includes('<!-- APP_SCRIPT -->'));
    }
    const result = await client.callTool({ name, arguments: args });
    assert.equal(result.isError, false);
    assert.ok(result.structuredContent);
    console.log(`PASS /api/mcp/${id}/mcp: ${tools.length} tools, ${resources.length} embedded apps, ${name} returned structured data`);
  } finally { await client.close(); }
}
