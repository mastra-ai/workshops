import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { identityFromContext } from '../../domain/auth.js';
import { DomainError, returnRequestSchema, returnSchema } from '../../domain/schemas.js';
import { returnsService } from '../../domain/service.js';

const draftSchema = returnRequestSchema.extend({ refundCents: z.number().int().nonnegative() });
const eligibility = createStep({
  id: 'eligibility', inputSchema: returnRequestSchema, outputSchema: returnRequestSchema,
  execute: async ({ inputData, requestContext }) => {
    const result = returnsService.checkEligibility(identityFromContext(requestContext), inputData.orderId);
    if (!result.eligible) throw new DomainError('INELIGIBLE', result.reason);
    if (result.requiresConfirmation) throw new DomainError('CONFIRMATION_REQUIRED', 'Use createReturn with interactive confirmation for high-value orders.');
    return inputData;
  },
});
const draft = createStep({
  id: 'draft', inputSchema: returnRequestSchema, outputSchema: draftSchema,
  execute: async ({ inputData, requestContext }) => ({ ...inputData, refundCents: returnsService.getOrder(identityFromContext(requestContext), inputData.orderId).totalCents }),
});
const completion = createStep({
  id: 'completion', inputSchema: draftSchema, outputSchema: returnSchema,
  execute: async ({ inputData, requestContext }) => {
    const { refundCents, ...request } = inputData;
    return returnsService.createReturn(identityFromContext(requestContext), request);
  },
});
export const processReturnWorkflow = createWorkflow({
  id: 'processReturnWorkflow',
  description: 'Process an eligible standard-value return through eligibility, draft and completion. Requires orderId, reason and idempotencyKey in the authenticated tenant. Writes a return only at completion. High-value orders must use interactive createReturn instead. Ineligible orders fail before mutation.',
  inputSchema: returnRequestSchema, outputSchema: returnSchema,
}).then(eligibility).then(draft).then(completion).commit();
