import { z } from 'zod';
import { DomainError, identitySchema, orderIdSchema, orderSchema, eligibilitySchema, policy, returnSchema, returnRequestSchema, type Identity } from './schemas.js';

const storedOrderSchema = orderSchema.extend({ tenantId: z.enum(['north', 'south']) });
const seed = storedOrderSchema.array().parse([
  { id: 'ORD-001', tenantId: 'north', totalCents: 4900, ageDays: 5, status: 'delivered' },
  { id: 'ORD-002', tenantId: 'north', totalCents: 99000, ageDays: 8, status: 'delivered' },
  { id: 'ORD-003', tenantId: 'north', totalCents: 1200, ageDays: 45, status: 'delivered' },
  { id: 'ORD-004', tenantId: 'north', totalCents: 3500, ageDays: 10, status: 'returned' },
  { id: 'ORD-005', tenantId: 'south', totalCents: 7500, ageDays: 2, status: 'delivered' },
]);

export class ReturnsService {
  private orders = structuredClone(seed);
  private returns = new Map<string, { fingerprint: string; result: z.infer<typeof returnSchema> }>();
  get mutationCount() { return this.returns.size; }
  reset() { this.orders = structuredClone(seed); this.returns.clear(); }
  private authorizedOrder(identity: Identity, id: string) {
    if (!identitySchema.safeParse(identity).success) throw new DomainError('UNAUTHORIZED', 'Authentication required.');
    if (!orderIdSchema.safeParse(id).success) throw new DomainError('INVALID_INPUT', 'Use an order identifier such as ORD-001.');
    const order = this.orders.find(order => order.id === id && order.tenantId === identity.tenantId);
    if (!order) throw new DomainError('FORBIDDEN', 'Order unavailable in your account.');
    return order;
  }
  listOrders(identity: Identity) {
    if (!identitySchema.safeParse(identity).success) throw new DomainError('UNAUTHORIZED', 'Authentication required.');
    return this.orders.filter(order => order.tenantId === identity.tenantId).map(order => orderSchema.parse(order));
  }
  getOrder(identity: Identity, id: string) { return orderSchema.parse(this.authorizedOrder(identity, id)); }
  checkEligibility(identity: Identity, id: string) {
    const order = this.getOrder(identity, id);
    const reason = order.status === 'returned' ? 'ALREADY_RETURNED' : order.ageDays > policy.returnWindowDays ? 'EXPIRED' : 'ELIGIBLE';
    return eligibilitySchema.parse({ orderId: id, eligible: reason === 'ELIGIBLE', reason, requiresConfirmation: order.totalCents >= policy.highValueCents });
  }
  createReturn(identity: Identity, input: unknown, confirmed = false) {
    const parsed = returnRequestSchema.safeParse(input);
    if (!parsed.success) throw new DomainError('INVALID_INPUT', 'Provide an orderId, reason, and idempotencyKey of 8–100 characters.');
    const request = parsed.data;
    const order = this.authorizedOrder(identity, request.orderId);
    const key = JSON.stringify([identity.tenantId, request.idempotencyKey]);
    const fingerprint = JSON.stringify([request.orderId, request.reason]);
    const previous = this.returns.get(key);
    if (previous) {
      if (previous.fingerprint !== fingerprint) throw new DomainError('CONFLICT', 'Idempotency key already used for a different request.');
      return structuredClone(previous.result);
    }
    const eligibility = this.checkEligibility(identity, request.orderId);
    if (!eligibility.eligible) throw new DomainError('INELIGIBLE', eligibility.reason);
    if (eligibility.requiresConfirmation && !confirmed) throw new DomainError('CONFIRMATION_REQUIRED', 'Confirm the high-value return before writing.');
    const result = returnSchema.parse({ id: `RET-${String(this.returns.size + 1).padStart(3, '0')}`, orderId: order.id, refundCents: order.totalCents, status: 'created' });
    // No await between the idempotency lookup and commit: one atomic in-memory write.
    order.status = 'returned';
    this.returns.set(key, { fingerprint, result });
    return structuredClone(result);
  }
}

export const returnsService = new ReturnsService();
