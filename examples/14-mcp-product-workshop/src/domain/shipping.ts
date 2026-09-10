import { setTimeout } from 'node:timers/promises';
import { z } from 'zod';
import { identitySchema, returnSchema, type Identity } from './schemas.js';
import { returnsService } from './service.js';

export const labelSchema = z.object({ id: z.string(), returnId: z.string(), carrier: z.literal('Demo Post') });
export const shipmentSchema = z.object({ return: returnSchema, label: labelSchema });
export const instructionsSchema = shipmentSchema.extend({ instructions: z.string() });

// Local carrier simulator; no shipment or payment leaves this process.
export class ShippingService {
  private labels = new Map<string, z.infer<typeof labelSchema>>();
  private failures = 0;
  attempts = 0;
  get labelCount() { return this.labels.size; }
  failNext(count: number) { this.failures = z.number().int().nonnegative().parse(count); }
  reset() { this.labels.clear(); this.failures = 0; this.attempts = 0; }
  async createLabel(identity: Identity, result: z.infer<typeof returnSchema>, signal?: AbortSignal) {
    identitySchema.parse(identity);
    returnsService.getOrder(identity, result.orderId);
    const key = `${identity.tenantId}:${result.id}`;
    const previous = this.labels.get(key);
    if (previous) return { ...previous };
    this.attempts++;
    await setTimeout(50, undefined, { signal });
    if (this.failures > 0) { this.failures--; throw new Error('Carrier unavailable. Retry this return with the same idempotency key.'); }
    const label = this.labels.get(key) ?? labelSchema.parse({ id: `LABEL-${result.id}`, returnId: result.id, carrier: 'Demo Post' });
    this.labels.set(key, label);
    return { ...label };
  }
}
export const shippingService = new ShippingService();
shippingService.failNext(z.coerce.number().int().nonnegative().parse(process.env.SHIPPING_FAILURES ?? 0));
