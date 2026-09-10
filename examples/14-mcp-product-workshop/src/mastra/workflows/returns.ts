import { createStep, createWorkflow } from '@mastra/core/workflows';
import { identityFromContext } from '../../domain/auth.js';
import { DomainError, returnRequestSchema, returnSchema } from '../../domain/schemas.js';
import { returnsService } from '../../domain/service.js';
import { instructionsSchema, shipmentSchema, shippingService } from '../../domain/shipping.js';

const eligibility = createStep({
  id: 'eligibility', inputSchema: returnRequestSchema, outputSchema: returnRequestSchema,
  execute: async ({ inputData, requestContext }) => {
    const identity = identityFromContext(requestContext);
    if (returnsService.previousReturn(identity, inputData)) return inputData;
    const result = returnsService.checkEligibility(identity, inputData.orderId);
    if (!result.eligible) throw new DomainError('INELIGIBLE', result.reason);
    if (result.requiresConfirmation) throw new DomainError('CONFIRMATION_REQUIRED', 'Confirm with createReturn first, then reuse its idempotency key here.');
    return inputData;
  },
});
const createReturn = createStep({
  id: 'create-return', inputSchema: returnRequestSchema, outputSchema: returnSchema,
  execute: async ({ inputData, requestContext }) => {
    const signal = requestContext?.get('signal');
    if (signal instanceof AbortSignal && signal.aborted) throw new DomainError('CANCELLED', 'Return cancelled before creation.');
    return returnsService.createReturn(identityFromContext(requestContext), inputData);
  },
});
const shippingLabel = createStep({
  id: 'shipping-label', inputSchema: returnSchema, outputSchema: shipmentSchema, retries: 2,
  execute: async ({ inputData, requestContext }) => {
    const signal = requestContext?.get('signal');
    const label = await shippingService.createLabel(identityFromContext(requestContext), inputData, signal instanceof AbortSignal ? signal : undefined);
    return { return: inputData, label };
  },
});
const instructions = createStep({
  id: 'instructions', inputSchema: shipmentSchema, outputSchema: instructionsSchema,
  execute: async ({ inputData }) => ({ ...inputData, instructions: `Pack order ${inputData.return.orderId} and attach ${inputData.label.id}. Drop it at Demo Post. This is a simulated label.` }),
});

export const processReturnWorkflow = createWorkflow({
  id: 'processReturnWorkflow',
  description: 'Create a return and arrange its shipping label. Use for the complete return process, not lookup. Requires orderId, reason and idempotencyKey; authenticated tenant only. Carrier failure can leave the return created: retry with the same key. High-value orders require createReturn confirmation first. Shipping is simulated locally.',
  inputSchema: returnRequestSchema, outputSchema: instructionsSchema,
  retryConfig: { attempts: 0, delay: 100 },
}).then(eligibility).then(createReturn).then(shippingLabel).then(instructions).commit();
