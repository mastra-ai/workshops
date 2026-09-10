import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { InternalMastraMCPClient } from '@mastra/mcp';
import { noopObserve } from '@mastra/core/tools';
import { returnsModern } from '../../src/mastra/mcp/index.js';
import { returnsService } from '../../src/domain/service.js';

export async function runFailureInjection() {
  returnsService.reset();
  const original = returnsService.prepareReturn;
  const server = http.createServer(async (req, res) => {
    Object.assign(req, { auth: { token: 'fixture', clientId: 'test', scopes: [], extra: { user: { tenantId: 'north', userId: 'support-north' } } } });
    await returnsModern.startHTTP({ url: new URL(req.url ?? '/', 'http://localhost'), httpPath: '/mcp', req, res });
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const address = server.address(); if (!address || typeof address === 'string') throw new Error('No port');
  const client = new InternalMastraMCPClient({ name: 'failure-injection', server: { url: new URL(`http://127.0.0.1:${address.port}/mcp`), protocolVersion: '2026-07-28' } });
  try {
    await client.connect(); const tools = await client.tools();
    const input = { orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'failure-test-001' };
    returnsService.prepareReturn = async () => { throw new Error('INTERNAL_SECRET_DATABASE_PASSWORD'); };
    const error = await tools.createReturn.execute?.(input, { observe: noopObserve }).then(() => undefined, error => error);
    assert(error instanceof Error);
    assert.match(error.message, /Unable to complete the request/);
    assert.doesNotMatch(error.message, /INTERNAL_SECRET/);
    assert.equal(returnsService.mutationCount, 0);
    let began!: () => void;
    const started = new Promise<void>(resolve => { began = resolve; });
    let ended!: () => void;
    const finished = new Promise<void>(resolve => { ended = resolve; });
    returnsService.prepareReturn = async signal => {
      began();
      try { await delay(10_000, undefined, { signal }); }
      finally { ended(); }
    };
    const abort = new AbortController();
    const pending = tools.createReturn.execute?.(input, { observe: noopObserve, abortSignal: abort.signal });
    await Promise.race([started, delay(3000).then(() => { throw new Error('Preflight was not entered'); })]);
    abort.abort();
    await assert.rejects(async () => pending);
    await Promise.race([finished, delay(3000).then(() => { throw new Error('Server did not cancel preflight'); })]);
    assert.equal(returnsService.mutationCount, 0);
    returnsService.prepareReturn = original;
    const results = await Promise.all(Array.from({ length: 12 }, () => tools.createReturn.execute?.(input, { observe: noopObserve })));
    assert(results.every(result => JSON.stringify(result) === JSON.stringify(results[0])));
    assert.equal(returnsService.mutationCount, 1);
    return { internalErrorRedacted: true, abortStoppedPreflight: true, abortedWrites: 0, concurrentRetries: 12, committedWrites: 1 };
  } finally {
    returnsService.prepareReturn = original;
    await client.disconnect(); await returnsModern.close();
    server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve()));
  }
}
