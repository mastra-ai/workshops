import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { identityFromContext } from '../../domain/auth.js';
import { orderIdSchema, orderSchema, eligibilitySchema } from '../../domain/schemas.js';
import { returnsService } from '../../domain/service.js';

export const getOrder = createTool({
  id: 'getOrder', description: 'Read one order in the authenticated tenant. Requires an ORD identifier. No side effects. Do not use to create returns. Unavailable orders are forbidden.',
  inputSchema: z.object({ orderId: orderIdSchema }).strict(),
  outputSchema: orderSchema.extend({ correlationId: z.string().regex(/^[0-9a-f]{32}$/).optional() }),
  execute: async ({ orderId }, context) => {
    const order = returnsService.getOrder(identityFromContext(context?.requestContext), orderId);
    const trace = z.string().regex(/^00-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/).safeParse(context?.mcp?.extra._meta?.traceparent);
    const correlationId = trace.success ? trace.data.split('-')[1] : undefined;
    return correlationId ? { ...order, correlationId } : order;
  },
});
export const checkReturnEligibility = createTool({
  id: 'checkReturnEligibility', description: 'Check return eligibility and high-value confirmation requirements for one authenticated-tenant order. Read only; does not reserve or create a return.',
  inputSchema: z.object({ orderId: orderIdSchema }), outputSchema: eligibilitySchema,
  execute: async ({ orderId }, context) => returnsService.checkEligibility(identityFromContext(context?.requestContext), orderId),
});
