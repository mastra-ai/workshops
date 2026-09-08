import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { identitySchema, orderIdSchema, orderSchema, eligibilitySchema } from '../../domain/schemas.js';
import { returnsService } from '../../domain/service.js';

export const getOrder = createTool({
  id: 'getOrder', description: 'Read one order in the authenticated tenant. Requires an ORD identifier. No side effects. Do not use to create returns. Unavailable orders are forbidden.',
  inputSchema: z.object({ orderId: orderIdSchema }), outputSchema: orderSchema,
  execute: async ({ orderId }, context) => returnsService.getOrder(identitySchema.parse(context?.requestContext?.get('identity')), orderId),
});
export const checkReturnEligibility = createTool({
  id: 'checkReturnEligibility', description: 'Check return eligibility and high-value confirmation requirements for one authenticated-tenant order. Read only; does not reserve or create a return.',
  inputSchema: z.object({ orderId: orderIdSchema }), outputSchema: eligibilitySchema,
  execute: async ({ orderId }, context) => returnsService.checkEligibility(identitySchema.parse(context?.requestContext?.get('identity')), orderId),
});
