import { beforeEach, expect, test, vi } from 'vitest';
import { RequestContext } from '@mastra/core/request-context';
import { z } from 'zod';
import { returnsModern } from '../src/mastra/mcp/index.js';
import { returnsService } from '../src/domain/service.js';
import { processReturnWorkflow } from '../src/mastra/workflows/returns.js';
import { shippingService } from '../src/domain/shipping.js';
import { supportAgent } from '../src/mastra/agents/support.js';
import { processReturn } from '../src/mastra/tools/process-return.js';

// Deliberately broad anti-contract: no operation semantics, authorization or side-effect boundary.
const callApi = z.object({ method: z.string(), path: z.string(), body: z.unknown() });
const context = () => new RequestContext<unknown>([['identity', { tenantId: 'north', userId: 'support-north' }]]);
beforeEach(() => { returnsService.reset(); shippingService.reset(); });
test('the optional agent reuses the same workflow-backed tool', async () => {
  expect((await supportAgent.listTools()).processReturn).toBe(processReturn);
});
test('registry resolves the modern default', () => {
  expect(returnsModern.getServerInfo().protocol_version).toBe('2026-07-28');
});
test('bounded catalogue excludes the generic API anti-contract', async () => {
  expect(callApi.safeParse({ method: 'DELETE', path: '/anything', body: {} }).success).toBe(true);
  const catalogue = await returnsModern.getToolListInfo();
  const names = catalogue.tools.map(tool => tool.name);
  expect(names).toEqual(expect.arrayContaining(['getOrder', 'checkReturnEligibility', 'createReturn', 'returnRiskScore']));
  expect(names).toContain('processReturn');
  expect(names).toHaveLength(5);
  expect(names).not.toContain('callApi');
});
test.each([
  ['ORD-003', 'INELIGIBLE'], ['ORD-005', 'FORBIDDEN'], ['ORD-002', 'CONFIRMATION_REQUIRED'],
])('workflow tool safely rejects %s', async (orderId, code) => {
  const result = await returnsModern.executeTool('processReturn', { orderId, reason: 'damaged', idempotencyKey: 'reject-001' }, { requestContext: context() });
  expect(result).toMatchObject({ status: 'rejected', error: { code } });
  expect(JSON.stringify(result)).not.toMatch(/stack|node_modules/);
  expect(returnsService.mutationCount).toBe(0);
  expect(shippingService.labelCount).toBe(0);
});
test('read and scalar contracts preserve public shapes', async () => {
  const options = { requestContext: context() };
  expect(await returnsModern.executeTool('getOrder', { orderId: 'ORD-001' }, options)).toEqual({ id: 'ORD-001', totalCents: 4900, ageDays: 5, status: 'delivered' });
  expect(await returnsModern.executeTool('returnRiskScore', { orderId: 'ORD-001' }, options)).toBe(20);
});
test('invalid domain output fails the tool output contract instead of being coerced', async () => {
  const spy = vi.spyOn(returnsService, 'getOrder').mockReturnValue({ id: 'ORD-001', totalCents: -1, ageDays: 5, status: 'delivered' });
  try {
    const result = await returnsModern.executeTool('getOrder', { orderId: 'ORD-001' }, { requestContext: context() });
    expect(result).toMatchObject({ error: true });
    expect(JSON.stringify(result)).toContain('totalCents');
  } finally { spy.mockRestore(); }
});
test('mutating tool retries converge without bypassing high-value confirmation', async () => {
  const options = { requestContext: context() };
  const request = { orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'contract-001' };
  const first = await returnsModern.executeTool('createReturn', request, options);
  expect(await returnsModern.executeTool('createReturn', request, options)).toEqual(first);
  expect(returnsService.mutationCount).toBe(1);
  await expect(returnsModern.executeTool('createReturn', { ...request, orderId: 'ORD-002', idempotencyKey: 'contract-002' }, options)).rejects.toThrow();
  expect(returnsService.mutationCount).toBe(1);
});
test('workflow rejects pre-cancellation and conflicting retries without another write', async () => {
  const inputData = { orderId: 'ORD-001', reason: 'damaged' as const, idempotencyKey: 'workflow-retry-001' };
  const run = async (data = inputData, requestContext = context()) => (await processReturnWorkflow.createRun()).start({ inputData: data, requestContext });
  const cancelled = context(); cancelled.set('signal', AbortSignal.abort());
  expect((await run(inputData, cancelled)).status).toBe('failed');
  expect(returnsService.mutationCount).toBe(0);
  expect((await run()).status).toBe('success');
  const conflict = await run({ ...inputData, idempotencyKey: inputData.idempotencyKey, orderId: 'ORD-002' });
  expect(conflict.status).toBe('failed');
  expect(returnsService.mutationCount).toBe(1);
  expect(shippingService.labelCount).toBe(1);
});
test('unexpected workflow errors stay out of the tool result', async () => {
  const spy = vi.spyOn(returnsService, 'previousReturn').mockImplementation(() => { throw new Error('PRIVATE_DATABASE_DETAIL'); });
  try {
    const result = await returnsModern.executeTool('processReturn', { orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'internal-workflow-001' }, { requestContext: context() });
    expect(result).toMatchObject({ status: 'rejected', error: { code: 'INTERNAL' } });
    expect(JSON.stringify(result)).not.toMatch(/PRIVATE|stack/);
    expect(returnsService.mutationCount).toBe(0);
  } finally { spy.mockRestore(); }
});
test('concurrent workflow calls converge on one return and label', async () => {
  const input = { orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'concurrent-workflow-001' };
  const results = await Promise.all(Array.from({ length: 12 }, () => returnsModern.executeTool('processReturn', input, { requestContext: context() })));
  expect(results.every(result => JSON.stringify(result) === JSON.stringify(results[0]))).toBe(true);
  expect(results[0]).toMatchObject({ status: 'completed' });
  expect(returnsService.mutationCount).toBe(1);
  expect(shippingService.labelCount).toBe(1);
});
test('cancellation after return creation leaves a recoverable label, not a false rollback', async () => {
  const controller = new AbortController();
  const requestContext = context(); requestContext.set('signal', controller.signal);
  const original = shippingService.createLabel.bind(shippingService);
  const spy = vi.spyOn(shippingService, 'createLabel').mockImplementationOnce((identity, result, signal) => { controller.abort(); return original(identity, result, signal); });
  const input = { orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'cancel-shipping-001' };
  try {
    expect(await returnsModern.executeTool('processReturn', input, { requestContext })).toMatchObject({ status: 'needs_retry' });
    expect(returnsService.mutationCount).toBe(1);
    expect(shippingService.labelCount).toBe(0);
    expect(await returnsModern.executeTool('processReturn', input, { requestContext: context() })).toMatchObject({ status: 'completed' });
    expect(returnsService.mutationCount).toBe(1);
    expect(shippingService.labelCount).toBe(1);
  } finally { spy.mockRestore(); }
});
test('workflow reaches completion for standard orders and blocks ineligible orders', async () => {
  const run = await processReturnWorkflow.createRun();
  const result = await run.start({ inputData: { orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'workflow-001' }, requestContext: context() });
  expect(result.status).toBe('success');
  expect(returnsService.mutationCount).toBe(1);
  const blocked = await processReturnWorkflow.createRun();
  expect((await blocked.start({ inputData: { orderId: 'ORD-003', reason: 'damaged', idempotencyKey: 'workflow-003' }, requestContext: context() })).status).toBe('failed');
  expect(returnsService.mutationCount).toBe(1);
});
