import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { publicError, publicErrorSchema, returnRequestSchema, returnSchema } from '../../domain/schemas.js';
import { instructionsSchema } from '../../domain/shipping.js';
import { processReturnWorkflow } from '../workflows/returns.js';

export const processResultSchema = z.discriminatedUnion('status', [
  instructionsSchema.extend({ status: z.literal('completed') }),
  z.object({ status: z.literal('needs_retry'), return: returnSchema, message: z.string() }),
  publicErrorSchema.extend({ status: z.literal('rejected') }),
]);
export const processReturn = createTool({
  id: 'processReturn',
  description: 'Create a return and shipping label in the authenticated account. Use for the full return process, not order lookup. Shipping is simulated. On needs_retry, the return exists: retry with the SAME idempotencyKey. High-value returns need createReturn confirmation first; then reuse that key here.',
  inputSchema: returnRequestSchema, outputSchema: processResultSchema,
  execute: async (inputData, context) => {
    const requestContext = context?.requestContext;
    const signal = context?.abortSignal ?? context?.mcp?.extra?.signal;
    if (signal) requestContext?.set('signal', signal);
    const run = await processReturnWorkflow.createRun();
    const result = await run.start({ inputData, requestContext, tracingContext: context?.tracingContext });
    if (result.status === 'success') return { status: 'completed' as const, ...result.result };
    const created = result.steps['create-return'];
    if (created?.status === 'success') {
      return { status: 'needs_retry' as const, return: returnSchema.parse(created.output), message: 'Return created; label pending. Retry with the same idempotency key.' };
    }
    const error = publicErrorSchema.safeParse({ error: result.status === 'failed' ? result.error : undefined });
    return { status: 'rejected' as const, ...(error.success && error.data.error.code !== 'INTERNAL' ? error.data : publicError(new Error())) };
  },
});
