import { afterAll, beforeEach, expect, test } from 'vitest';
import { RequestContext } from '@mastra/core/request-context';
import { mastra, traceExporter } from '../src/mastra/index.js';
import { processReturnWorkflow } from '../src/mastra/workflows/returns.js';
import { returnsService } from '../src/domain/service.js';
import { shippingService } from '../src/domain/shipping.js';

const inputData = { orderId: 'ORD-001', reason: 'damaged' as const, idempotencyKey: 'shipping-demo-001' };
const context = () => new RequestContext<unknown>([['identity', { tenantId: 'north', userId: 'support-north' }]]);
const run = async () => (await processReturnWorkflow.createRun()).start({ inputData, requestContext: context() });
beforeEach(() => { returnsService.reset(); shippingService.reset(); });
afterAll(() => traceExporter.shutdown());

test('retries only the carrier step after a transient failure', async () => {
  shippingService.failNext(1);
  const result = await run();
  expect(result.status).toBe('success');
  expect(shippingService.attempts).toBe(2);
  expect(returnsService.mutationCount).toBe(1);
  expect(shippingService.labelCount).toBe(1);
});

test('exhausted retries leave a recoverable return, not a duplicate', async () => {
  shippingService.failNext(3);
  const failed = await run();
  expect(failed.status).toBe('failed');
  expect(shippingService.attempts).toBe(3);
  expect(returnsService.mutationCount).toBe(1);
  expect(shippingService.labelCount).toBe(0);
  const recovered = await run();
  expect(recovered.status).toBe('success');
  expect(returnsService.mutationCount).toBe(1);
  expect(shippingService.labelCount).toBe(1);
  const replay = await run();
  expect(replay.status).toBe('success');
  if (replay.status === 'success' && recovered.status === 'success') expect(replay.result).toEqual(recovered.result);
  expect(shippingService.attempts).toBe(4);
});

test('configured observability persists workflow traces', async () => {
  const result = await run();
  if (!result.traceId) throw new Error('Workflow did not produce a trace');
  await traceExporter.flush();
  const storage = await mastra.getStorage()?.getStore('observability');
  const trace = await storage?.getTrace({ traceId: result.traceId });
  expect(trace?.spans.some(span => span.name.includes('processReturnWorkflow'))).toBe(true);
});
