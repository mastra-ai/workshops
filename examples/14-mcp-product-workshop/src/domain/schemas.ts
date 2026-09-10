import { z } from 'zod';

export const identitySchema = z.object({ tenantId: z.enum(['north', 'south']), userId: z.string().min(1) });
export type Identity = z.infer<typeof identitySchema>;
export const orderIdSchema = z.string().regex(/^ORD-\d{3}$/);
export const orderSchema = z.object({
  id: orderIdSchema, totalCents: z.number().int().nonnegative(),
  ageDays: z.number().int().nonnegative(), status: z.enum(['delivered', 'returned']),
});
export const policySchema = z.object({ returnWindowDays: z.number().int().positive(), highValueCents: z.number().int().positive() });
export const policy = policySchema.parse({ returnWindowDays: 30, highValueCents: 50_000 });
export const eligibilitySchema = z.object({ orderId: orderIdSchema, eligible: z.boolean(), reason: z.enum(['ELIGIBLE', 'EXPIRED', 'ALREADY_RETURNED']), requiresConfirmation: z.boolean() });
export const returnRequestSchema = z.object({ orderId: orderIdSchema, idempotencyKey: z.string().min(8).max(100), reason: z.enum(['damaged', 'wrong-item', 'changed-mind']) }).strict();
export type ReturnRequest = z.infer<typeof returnRequestSchema>;
export const returnSchema = z.object({ id: z.string(), orderId: orderIdSchema, refundCents: z.number().int().nonnegative(), status: z.literal('created') });
export const publicErrorSchema = z.object({ error: z.object({ code: z.enum(['UNAUTHORIZED', 'FORBIDDEN', 'INVALID_INPUT', 'INELIGIBLE', 'CONFIRMATION_REQUIRED', 'CONFLICT', 'CANCELLED', 'INTERNAL']), message: z.string() }) });
export type ErrorCode = z.infer<typeof publicErrorSchema>['error']['code'];
export class DomainError extends Error {
  constructor(public readonly code: ErrorCode, message: string) { super(message); }
}
export function publicError(error: unknown) {
  return publicErrorSchema.parse({ error: error instanceof DomainError ? { code: error.code, message: error.message } : { code: 'INTERNAL', message: 'Unable to complete the request.' } });
}
