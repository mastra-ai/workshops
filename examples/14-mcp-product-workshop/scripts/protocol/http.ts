import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { InternalMastraMCPClient, MCPServer } from '@mastra/mcp';
import { SdkError, SdkErrorCode } from '@modelcontextprotocol/client';
import { noopObserve } from '@mastra/core/tools';
import { capabilities, returnsModern } from '../../src/mastra/mcp/index.js';
import { returnsService } from '../../src/domain/service.js';
import { advancePublicPolicy, resetPublicPolicy } from '../../src/domain/public-policy.js';
import { recorder, type WireEvent } from './wire.js';

export async function runHttpProof() {
  const returnsLegacy = new MCPServer({ ...capabilities, id: 'returns-legacy', name: 'Legacy test fixture', protocolVersion: '2025-11-25' });
  returnsService.reset(); resetPublicPolicy();
  const modern: WireEvent[] = [], legacy: WireEvent[] = [];
  const server = http.createServer(async (req, res) => {
    if (req.headers.authorization !== 'Bearer workshop-north') { res.writeHead(401).end(); return; }
    Object.assign(req, { auth: { token: 'fixture', clientId: 'workshop', scopes: [], extra: { user: { tenantId: 'north', userId: 'support-north' } } } });
    const target = req.url === '/legacy' ? returnsLegacy : returnsModern;
    await target.startHTTP({ url: new URL(req.url ?? '/', 'http://localhost'), httpPath: req.url ?? '/', req, res });
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const address = server.address(); if (!address || typeof address === 'string') throw new Error('No port');
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const clients: InternalMastraMCPClient[] = [];
  function connect(era: '2026-07-28' | '2025-11-25', path: string, events: WireEvent[]) {
    const client = new InternalMastraMCPClient({ name: `proof-${clients.length}`, server: {
      url: new URL(`${baseUrl}${path}`), protocolVersion: era,
      requestInit: { headers: { authorization: 'Bearer workshop-north' } }, fetch: recorder(events),
      traceContext: () => ({ traceparent: '00-11111111111111111111111111111111-2222222222222222-01', tracestate: 'workshop=demo', baggage: 'non-sensitive=fixture' }),
    } });
    clients.push(client); return client;
  }
  try {
    const client = connect('2026-07-28', '/modern', modern);
    let action: 'accept' | 'decline' | 'cancel' = 'decline';
    let rounds = 0;
    client.elicitation.onRequest(async () => { rounds++; return { action, content: { confirmed: action === 'accept' } }; });
    await client.connect();
    const tools = await client.tools();
    const call = (name: string, input: object) => tools[name].execute?.(input, { observe: noopObserve });
    assert.equal(await call('returnRiskScore', { orderId: 'ORD-002' }), 80);
    assert.equal((await call('getOrder', { orderId: 'ORD-001' })).correlationId, '11111111111111111111111111111111');
    const input = { orderId: 'ORD-002', reason: 'damaged', idempotencyKey: 'modern-high-value' };
    for (const answer of ['decline', 'cancel'] as const) {
      action = answer;
      await assert.rejects(async () => call('createReturn', input));
      assert.equal(returnsService.mutationCount, 0);
    }
    action = 'accept';
    const result = await call('createReturn', input);
    assert.equal(returnsService.mutationCount, 1);
    assert.deepEqual(await call('createReturn', input), result);
    assert.equal(returnsService.mutationCount, 1);
    assert.equal(rounds, 3);
    const updates: string[] = [];
    await client.resources.onUpdated(({ uri }) => updates.push(uri));
    await client.resources.subscribe('returns://policies/current');
    advancePublicPolicy();
    await returnsModern.resources.notifyUpdated({ uri: 'returns://policies/current' });
    for (let n = 0; n < 50 && updates.length === 0; n++) await new Promise(resolve => setTimeout(resolve, 20));
    assert.deepEqual(updates, ['returns://policies/current']);
    assert.match(JSON.stringify(await client.resources.read('returns://policies/current')), /revision/);
    await client.resources.unsubscribe('returns://policies/current');
    advancePublicPolicy(); await returnsModern.resources.notifyUpdated({ uri: 'returns://policies/current' });
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(updates.length, 1);
    await client.disconnect();
    assert(modern.some(event => event.method === 'subscriptions/listen'));
    assert(modern.every(event => !event.session));
    const old = connect('2025-11-25', '/legacy', legacy);
    await old.connect(); const oldTools = await old.tools();
    const oldOrder = await oldTools.getOrder.execute?.({ orderId: 'ORD-001' }, { observe: noopObserve });
    assert.equal(oldOrder.id, 'ORD-001');
    await old.disconnect();
    assert(legacy.some(event => event.session));
    const pinned = connect('2026-07-28', '/legacy', []);
    const error = await pinned.connect().then(() => undefined, error => error);
    assert(error instanceof SdkError); assert.equal(error.code, SdkErrorCode.EraNegotiationFailed);
    modern.push({ direction: 'assertion', body: { elicitationRounds: rounds, writes: returnsService.mutationCount, subscribedUpdates: updates.length, declinedWrites: 0, cancelledWrites: 0, pinnedError: error.name } });
    return { modern, legacy };
  } finally {
    await Promise.all(clients.map(client => client.disconnect().catch(() => {})));
    await returnsModern.close(); await returnsLegacy.close();
    server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve()));
  }
}
