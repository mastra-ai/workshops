import { afterAll, beforeAll, expect, test } from 'vitest';
import { execFileSync } from 'node:child_process';
import { startServer } from '../scripts/server.js';
let server: Awaited<ReturnType<typeof startServer>>;
beforeAll(async () => { server = await startServer(); }, 90_000);
afterAll(async () => { await server?.close(); });
const headers = { authorization: 'Bearer workshop-north', 'content-type': 'application/json' };
test('REST and independent CLI process return the same public order', async () => {
  const response = await fetch(`${server.baseUrl}/returns/orders/ORD-001`, { headers });
  const cli = JSON.parse(execFileSync('pnpm', ['exec', 'tsx', 'src/cli.ts', 'get', 'ORD-001'], { env: { ...process.env, RETURNS_TENANT: 'north' }, encoding: 'utf8' }));
  expect(await response.json()).toEqual(cli);
  expect(cli).not.toHaveProperty('tenantId');
});
test('unauthorized, cross-tenant and invalid requests cannot mutate', async () => {
  expect((await fetch(`${server.baseUrl}/returns/orders/ORD-001`)).status).toBe(401);
  expect((await fetch(`${server.baseUrl}/returns/orders/ORD-005`, { headers })).status).toBe(403);
  for (const [body, expected] of [['{', 400], [JSON.stringify({ orderId: 'ORD-005', reason: 'damaged', idempotencyKey: 'test-key-1' }), 403], [JSON.stringify({ orderId: 'ORD-001' }), 400]] as const) {
    expect((await fetch(`${server.baseUrl}/returns`, { method: 'POST', headers, body })).status).toBe(expected);
  }
  expect(await fetch(`${server.baseUrl}/returns/orders/ORD-001`, { headers }).then(r => r.json())).toMatchObject({ status: 'delivered' });
  expect(await fetch(`${server.baseUrl}/returns/orders/ORD-005`, { headers: { authorization: 'Bearer workshop-south' } }).then(r => r.json())).toMatchObject({ status: 'delivered' });
});
test('REST replay converges on the same return and updates order', async () => {
  const body = JSON.stringify({ orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'test-key-1' });
  const call = () => fetch(`${server.baseUrl}/returns`, { method: 'POST', headers, body }).then(r => r.json());
  expect(await call()).toEqual(await call());
  expect(await fetch(`${server.baseUrl}/returns/orders/ORD-001`, { headers }).then(r => r.json())).toMatchObject({ status: 'returned' });
});
