import { afterAll, beforeAll, expect, test } from 'vitest';
import { z } from 'zod';
import { execFileSync } from 'node:child_process';
import { MCPClient } from '@mastra/mcp';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { noopObserve } from '@mastra/core/tools';
import { startServer } from '../scripts/server.js';
let server: Awaited<ReturnType<typeof startServer>>;
const clients: MCPClient[] = [];
beforeAll(async () => { server = await startServer(); }, 90_000);
afterAll(async () => { await Promise.all(clients.map(client => client.disconnect())); await server?.close(); });
function client(tenant: string, era: 'modern' | 'legacy' = 'modern') {
  const result = new MCPClient({ id: `test-${clients.length}`, servers: { returns: { url: new URL(`${server.baseUrl}/api/mcp/returns-${era}/mcp`), requestInit: { headers: { authorization: `Bearer workshop-${tenant}` } }, ...(era === 'legacy' ? { protocolVersion: '2025-11-25' as const } : {}) } } });
  clients.push(result); return result;
}
test('allocated server registry reports resolved modern and explicit legacy revisions through curl', () => {
  const registry = JSON.parse(execFileSync('curl', ['-fsS', `${server.baseUrl}/api/mcp/v0/servers`], { encoding: 'utf8' }));
  expect(registry.servers).toEqual(expect.arrayContaining([
    expect.objectContaining({ id: 'returns-modern', protocol_version: '2026-07-28' }),
    expect.objectContaining({ id: 'returns-legacy', protocol_version: '2025-11-25' }),
  ]));
});
test('modern and legacy clients discover and read authorized resources', async () => {
  for (const era of ['modern', 'legacy'] as const) {
    const connection = client('north', era);
    const tools = await connection.listTools();
    expect(await tools.returns_getOrder.execute?.({ orderId: 'ORD-001' }, { observe: noopObserve })).toHaveProperty('id', 'ORD-001');
    const resource = await connection.resources.read('returns', 'returns://orders/ORD-001');
    expect(resource.contents[0]).toHaveProperty('text', JSON.stringify({ id: 'ORD-001', totalCents: 4900, ageDays: 5, status: 'delivered' }));
    expect((await connection.prompts.list()).returns).toHaveLength(1);
    expect((await connection.resources.templates()).returns).toHaveLength(1);
  }
});
test('cross-tenant and unknown resource reads are rejected', async () => {
  const south = client('south');
  await expect(south.resources.read('returns', 'returns://orders/ORD-001')).rejects.toThrow();
  await expect(south.resources.read('returns', 'returns://unknown')).rejects.toThrow();
  expect((await south.resources.read('returns', 'returns://orders/ORD-005')).contents).toHaveLength(1);
});
test('registered workflow executes through the real HTTP tool boundary', async () => {
  const connection = client('north');
  const tools = await connection.listTools();
  const result = await tools.returns_run_processReturnWorkflow.execute?.({ orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'http-workflow-001' }, { observe: noopObserve });
  const envelope = z.object({ isError: z.literal(false), content: z.array(z.object({ type: z.literal('text'), text: z.string() })).min(1) }).parse(result);
  const workflowResult = JSON.parse(envelope.content[0].text);
  expect(workflowResult.status).toBe('success');
  expect(workflowResult.stepExecutionPath).toEqual(['eligibility', 'draft', 'completion']);
  expect((await connection.resources.read('returns', 'returns://orders/ORD-001')).contents[0]).toHaveProperty('text', JSON.stringify({ id: 'ORD-001', totalCents: 4900, ageDays: 5, status: 'returned' }));
});
test('raw MCP response never echoes sensitive request metadata', async () => {
  const raw = new Client({ name: 'metadata-proof', version: '1.0.0' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  try {
    await raw.connect(new StreamableHTTPClientTransport(new URL(`${server.baseUrl}/api/mcp/returns-modern/mcp`), { requestInit: { headers: { authorization: 'Bearer workshop-north' } } }));
    const result = await raw.callTool({ name: 'getOrder', arguments: { orderId: 'ORD-001' }, _meta: { authorization: 'FORBIDDEN-SECRET-MARKER', baggage: 'private=FORBIDDEN-BAGGAGE', traceparent: '00-11111111111111111111111111111111-2222222222222222-01' } });
    expect(result.isError).toBeFalsy();
    expect(JSON.stringify(result)).toContain('11111111111111111111111111111111');
    expect(JSON.stringify(result)).not.toContain('FORBIDDEN');
    expect(JSON.stringify(result)).not.toContain('2222222222222222');
  } finally { await raw.close(); }
});
test('transport rejects missing authentication', async () => {
  const response = await fetch(`${server.baseUrl}/api/mcp/returns-modern/mcp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
  expect(response.status).toBe(401);
});
test('subscription spike: URI membership does not enforce order authorization', async () => {
  const south = client('south');
  await expect(south.resources.read('returns', 'returns://orders/ORD-001')).rejects.toThrow();
  // This succeeds despite the forbidden read. Therefore no order events may be published.
  await south.resources.subscribe('returns', 'returns://orders/ORD-001');
  await south.resources.unsubscribe('returns', 'returns://orders/ORD-001');
});
