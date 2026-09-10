import { afterAll, beforeAll, expect, test } from 'vitest';
import { processResultSchema } from '../src/mastra/tools/process-return.js';
import { execFileSync } from 'node:child_process';
import { MCPClient } from '@mastra/mcp';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { noopObserve } from '@mastra/core/tools';
import { startServer } from '../scripts/server.js';
let server: Awaited<ReturnType<typeof startServer>>;
const clients: MCPClient[] = [];
beforeAll(async () => { server = await startServer(); }, 90_000);
afterAll(async () => { await Promise.all(clients.map(client => client.disconnect())); await server?.close(); });
function client(tenant: string) {
  const result = new MCPClient({ id: `test-${clients.length}`, servers: { returns: { url: new URL(`${server.baseUrl}/api/mcp/returns-modern/mcp`), requestInit: { headers: { authorization: `Bearer workshop-${tenant}` } } } } });
  clients.push(result); return result;
}
test('allocated registry exposes one modern server', () => {
  const registry = JSON.parse(execFileSync('curl', ['-fsS', '-H', 'Authorization: Bearer workshop-north', `${server.baseUrl}/api/mcp/v0/servers`], { encoding: 'utf8' }));
  expect(registry.servers).toEqual([
    expect.objectContaining({ id: 'returns-modern', protocol_version: '2026-07-28' }),
  ]);
});
test('Studio lists registered tools while anonymous execution stays blocked', async () => {
  const headers = { authorization: 'Bearer workshop-north' };
  expect((await fetch(`${server.baseUrl}/api/mcp/returns-modern/tools`)).status).toBe(200);
  const globalTools = await fetch(`${server.baseUrl}/api/tools`, { headers });
  expect(globalTools.status).toBe(200);
  expect(Object.keys(await globalTools.json())).toHaveLength(5);
  const catalogue = await fetch(`${server.baseUrl}/api/mcp/returns-modern/tools`, { headers });
  expect(catalogue.status).toBe(200);
  expect((await catalogue.json()).tools).toHaveLength(5);
  for (const path of ['/api/mcp/returns-modern/tools/getOrder', '/api/mcp/returns-modern/resources', '/api/tools/getOrder']) {
    expect((await fetch(`${server.baseUrl}${path}`, { headers })).status).toBe(200);
  }
  for (const path of ['/api/mcp/returns-modern/tools/createReturn/execute', '/api/mcp/returns-modern/resources/read', '/api/tools/createReturn/execute']) {
    expect((await fetch(`${server.baseUrl}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })).status).toBe(401);
  }
});
test('Studio can aggregate persisted tool metrics', async () => {
  const tools = await client('north').listTools();
  await tools.returns_getOrder.execute?.({ orderId: 'ORD-001' }, { observe: noopObserve });
  await expect.poll(async () => {
    const response = await fetch(`${server.baseUrl}/api/observability/metrics/aggregate`, {
      method: 'POST', headers: { authorization: 'Bearer workshop-north', 'content-type': 'application/json' },
      body: JSON.stringify({ name: ['mastra_tool_duration_ms'], aggregation: 'count' }),
    });
    expect(response.status).toBe(200);
    return (await response.json()).value;
  }, { timeout: 5000 }).toBeGreaterThan(0);
});
test('client discovers and reads authorized resources', async () => {
    const connection = client('north');
    const tools = await connection.listTools();
    expect(await tools.returns_getOrder.execute?.({ orderId: 'ORD-001' }, { observe: noopObserve })).toHaveProperty('id', 'ORD-001');
    const resource = await connection.resources.read('returns', 'returns://orders/ORD-001');
    expect(resource.contents[0]).toHaveProperty('text', JSON.stringify({ id: 'ORD-001', totalCents: 4900, ageDays: 5, status: 'delivered' }));
    expect((await connection.prompts.list()).returns).toHaveLength(1);
    expect((await connection.resources.templates()).returns).toHaveLength(1);
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
  expect(tools.returns_run_processReturnWorkflow).toBeUndefined();
  const result = processResultSchema.parse(await tools.returns_processReturn.execute?.({ orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'http-workflow-001' }, { observe: noopObserve }));
  expect(result.status).toBe('completed');
  expect(JSON.stringify(result)).not.toMatch(/stack|steps|node_modules/);
  expect((await connection.resources.read('returns', 'returns://orders/ORD-001')).contents[0]).toHaveProperty('text', JSON.stringify({ id: 'ORD-001', totalCents: 4900, ageDays: 5, status: 'returned' }));
});
test('workflow API cannot replace middleware identity with caller context', async () => {
  const south = { tenantId: 'south', userId: 'support-south' };
  const response = await fetch(`${server.baseUrl}/api/workflows/processReturnWorkflow/start-async`, {
    method: 'POST', headers: { authorization: 'Bearer workshop-north', 'content-type': 'application/json' },
    body: JSON.stringify({ inputData: { orderId: 'ORD-005', reason: 'damaged', idempotencyKey: 'forged-context-001' }, requestContext: { identity: south, mastra__user: south, authInfo: { extra: { user: south } } } }),
  });
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ status: 'failed', error: { code: 'FORBIDDEN' } });
  const order = await client('south').resources.read('returns', 'returns://orders/ORD-005');
  expect(JSON.stringify(order)).toContain('delivered');
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
