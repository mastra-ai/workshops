import { beforeEach, expect, test } from 'vitest';
import { ReturnsService } from '../src/domain/service.js';
import { runCli } from '../src/cli.js';
const identity = { tenantId: 'north', userId: 'test' } as const;
const request = { orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'test-key-001' };
let service: ReturnsService;
beforeEach(() => { service = new ReturnsService(); });
test('classifies every fixture', () => {
  expect(service.checkEligibility(identity, 'ORD-001')).toMatchObject({ eligible: true, requiresConfirmation: false });
  expect(service.checkEligibility(identity, 'ORD-002')).toMatchObject({ eligible: true, requiresConfirmation: true });
  expect(service.checkEligibility(identity, 'ORD-003').reason).toBe('EXPIRED');
  expect(service.checkEligibility(identity, 'ORD-004').reason).toBe('ALREADY_RETURNED');
});
test('rejects cross-tenant and malformed operations without mutation', () => {
  expect(() => service.getOrder(identity, 'ORD-005')).toThrow('unavailable');
  for (const input of [{ ...request, orderId: 'ORD-005' }, { ...request, orderId: 'bad' }, { ...request, extra: true }]) expect(() => service.createReturn(identity, input)).toThrow();
  expect(service.mutationCount).toBe(0);
});
test('replay writes once and conflicting key does not write', () => {
  const first = service.createReturn(identity, request);
  expect(service.createReturn(identity, request)).toEqual(first);
  expect(() => service.createReturn(identity, { ...request, reason: 'wrong-item' })).toThrow('different request');
  expect(service.mutationCount).toBe(1);
});
test('high value confirmation precedes mutation and reset restores fixtures', () => {
  expect(() => service.createReturn(identity, { ...request, orderId: 'ORD-002' })).toThrow('Confirm');
  expect(service.mutationCount).toBe(0);
  service.createReturn(identity, { ...request, orderId: 'ORD-002' }, true);
  service.reset();
  expect(service.mutationCount).toBe(0);
  expect(service.getOrder(identity, 'ORD-002').status).toBe('delivered');
});
test('CLI reuses domain results and authorization', () => {
  expect(runCli(['get', 'ORD-001'], identity, service)).toEqual(service.getOrder(identity, 'ORD-001'));
  expect(() => runCli(['return', 'ORD-005', 'damaged', 'test-key-001'], identity, service)).toThrow();
  expect(service.mutationCount).toBe(0);
});
