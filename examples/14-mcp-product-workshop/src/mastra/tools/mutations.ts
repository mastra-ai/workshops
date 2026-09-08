import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { identityFromContext } from '../../domain/auth.js';
import { DomainError, publicError, orderIdSchema, returnRequestSchema, returnSchema } from '../../domain/schemas.js';
import { returnsService } from '../../domain/service.js';

export const createReturn = createTool({
  id: 'createReturn',
  description: 'Create one return in the authenticated tenant using an orderId, reason, and stable idempotencyKey. Writes once; reuse the same key and request to retry. Ineligible orders fail. High-value returns require explicit user confirmation through MCP elicitation; without it no write occurs. Never supply identity or confirmation as arguments.',
  inputSchema: returnRequestSchema,
  outputSchema: returnSchema,
  execute: async (input, context) => {
    const identity = identityFromContext(context?.requestContext);
    const signal = context?.mcp?.extra.signal ?? context?.abortSignal;
    const checkCancellation = () => { if (signal?.aborted) throw new DomainError('CANCELLED', 'Return request cancelled before writing.'); };
    try {
      returnsService.getOrder(identity, input.orderId);
      await returnsService.prepareReturn(signal);
      checkCancellation();
      // Let the service resolve idempotent replays before asking for confirmation.
      return returnsService.createReturn(identity, input);
    } catch (error) {
      checkCancellation();
      if (!(error instanceof DomainError) || error.code !== 'CONFIRMATION_REQUIRED') {
        const safe = publicError(error).error;
        throw new DomainError(safe.code, safe.message);
      }
      const elicitation = context?.mcp?.elicitation;
      if (!elicitation) throw error;
      const response = await elicitation.sendRequest({
          mode: 'form',
          message: `Confirm the high-value return for ${input.orderId} (${input.reason}).`,
          requestedSchema: {
            type: 'object',
            properties: { confirmed: { type: 'boolean', title: 'Confirm this return' } },
            required: ['confirmed'],
          },
        });
      if (response.action !== 'accept' || response.content?.confirmed !== true) throw error;
      // Recheck authorization, eligibility and idempotency after the interaction.
      checkCancellation();
      try { return returnsService.createReturn(identity, input, true); }
      catch (error) { const safe = publicError(error).error; throw new DomainError(safe.code, safe.message); }
    }
  },
});

export const returnRiskScore = createTool({
  id: 'returnRiskScore',
  description: 'Read a deterministic workshop risk score (0–100) for one authenticated-tenant order: 100 if ineligible, 80 if high value, otherwise 20. This is a policy heuristic, not a fraud prediction or approval. No writes; never replaces eligibility checks or high-value confirmation.',
  inputSchema: z.object({ orderId: orderIdSchema }).strict(),
  outputSchema: z.number().int().min(0).max(100),
  execute: async ({ orderId }, context) => {
    const eligibility = returnsService.checkEligibility(identityFromContext(context?.requestContext), orderId);
    return !eligibility.eligible ? 100 : eligibility.requiresConfirmation ? 80 : 20;
  },
});
