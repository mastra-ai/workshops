import assert from 'node:assert/strict';
import { startServer } from './server.js';
import { runFailureInjection } from './protocol/failures.js';

const server = await startServer();
try {
  const headers = { authorization: 'Bearer workshop-north', 'content-type': 'application/json' };
  assert.equal((await fetch(`${server.baseUrl}/returns/orders/ORD-001`)).status, 401);
  assert.equal((await fetch(`${server.baseUrl}/returns/orders/ORD-005`, { headers })).status, 403);
  for (const path of ['/api/mcp/returns-modern/mcp', '/api/workflows/processReturnWorkflow/start', '/api/mcp/returns-modern/tools/createReturn/execute']) {
    assert.equal((await fetch(`${server.baseUrl}${path}`, { method: 'POST' })).status, 401);
  }
  assert.equal((await fetch(`${server.baseUrl}/returns`, { method: 'POST', headers, body: '{bad json' })).status, 400);
  const request = { orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'http-failure-drill' };
  const post = (body: object) => fetch(`${server.baseUrl}/returns`, { method: 'POST', headers, body: JSON.stringify(body) });
  const first = await post(request), second = await post(request);
  assert.equal(first.status, 200); assert.equal(second.status, 200);
  assert.deepEqual(await first.json(), await second.json());
  assert.equal((await post({ ...request, reason: 'wrong-item' })).status, 409);
  console.log('HTTP FAILURE DRILL GREEN: missing token 401, wrong tenant 403, malformed input 400, identical retry converges, conflicting key 409; all MCP entry paths protected.');
} finally { await server.close(); }
console.log('INJECTED FAILURE DRILL', JSON.stringify(await runFailureInjection()));
console.log('FAILURES GREEN. Elicitation decline/cancel zero-write proof: pnpm demo:v2.');
