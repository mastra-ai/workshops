import { beforeEach, expect, test } from 'vitest';
import { RequestContext } from '@mastra/core/request-context';
import { z } from 'zod';
import { returnsModern, returnsLegacy } from '../src/mastra/mcp/index.js';
import { returnsService } from '../src/domain/service.js';
import { processReturnWorkflow } from '../src/mastra/workflows/returns.js';

// Deliberately broad anti-contract: no operation semantics, authorization or side-effect boundary.
const callApi = z.object({ method: z.string(), path: z.string(), body: z.unknown() });
const context = () => new RequestContext<unknown>([['identity', { tenantId: 'north', userId: 'support-north' }]]);
beforeEach(() => returnsService.reset());
test('registry resolves modern default and explicitly pinned legacy', () => {
  expect(returnsModern.getServerInfo().protocol_version).toBe('2026-07-28');
  expect(returnsLegacy.getServerInfo().protocol_version).toBe('2025-11-25');
});
test('bounded catalogue excludes the generic API anti-contract', async () => {
  expect(callApi.safeParse({ method: 'DELETE', path: '/anything', body: {} }).success).toBe(true);
  const catalogue = await returnsModern.getToolListInfo();
  const names = catalogue.tools.map(tool => tool.name);
  expect(names).toEqual(expect.arrayContaining(['getOrder', 'checkReturnEligibility', 'createReturn', 'returnRiskScore']));
  expect(names.some(name => name.includes('processReturnWorkflow'))).toBe(true);
  expect(names).not.toContain('callApi');
});
test('read and scalar contracts preserve public shapes', async () => {
  const options = { requestContext: context() };
  expect(await returnsModern.executeTool('getOrder', { orderId: 'ORD-001' }, options)).toEqual({ id: 'ORD-001', totalCents: 4900, ageDays: 5, status: 'delivered' });
  expect(await returnsModern.executeTool('returnRiskScore', { orderId: 'ORD-001' }, options)).toBe(20);
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
test('workflow reaches completion for standard orders and blocks ineligible orders', async () => {
  const run = await processReturnWorkflow.createRun();
  const result = await run.start({ inputData: { orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'workflow-001' }, requestContext: context() });
  expect(result.status).toBe('success');
  expect(returnsService.mutationCount).toBe(1);
  const blocked = await processReturnWorkflow.createRun();
  expect((await blocked.start({ inputData: { orderId: 'ORD-003', reason: 'damaged', idempotencyKey: 'workflow-003' }, requestContext: context() })).status).toBe('failed');
  expect(returnsService.mutationCount).toBe(1);
});
