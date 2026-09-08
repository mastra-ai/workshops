import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { MCPClient } from '@mastra/mcp';
import { noopObserve } from '@mastra/core/tools';
import { startServer } from './server.js';

const server = await startServer();
process.env.MASTRA_BASE_URL = server.baseUrl;
console.log(`export MASTRA_BASE_URL=${server.baseUrl}`);
const client = new MCPClient({ servers: { returns: { url: new URL(`${server.baseUrl}/api/mcp/returns-modern/mcp`), requestInit: { headers: { authorization: 'Bearer workshop-north' } } } } });
try {
  const registry = JSON.parse(execFileSync('curl', ['-fsS', `${process.env.MASTRA_BASE_URL}/api/mcp/v0/servers`], { encoding: 'utf8' }));
  assert.equal(registry.servers.find((entry: { id: string }) => entry.id === 'returns-modern').protocol_version, '2026-07-28');
  assert.equal(registry.servers.find((entry: { id: string }) => entry.id === 'returns-legacy').protocol_version, '2025-11-25');
  const tools = await client.listTools();
  console.log('TOOLS', Object.keys(tools));
  const result = await tools.returns_getOrder.execute?.({ orderId: 'ORD-001' }, { observe: noopObserve });
  assert.deepEqual(result, { id: 'ORD-001', totalCents: 4900, ageDays: 5, status: 'delivered' });
  console.log('ORDER', result);
  console.log('RESOURCES', await client.resources.list());
  console.log('TEMPLATES', await client.resources.templates());
  console.log('POLICY', await client.resources.read('returns', 'returns://policies/current'));
  console.log('ORDER RESOURCE', await client.resources.read('returns', 'returns://orders/ORD-001'));
  console.log('PROMPTS', await client.prompts.list());
  console.log('DISCOVERY GREEN');
} finally { await client.disconnect(); await server.close(); }
