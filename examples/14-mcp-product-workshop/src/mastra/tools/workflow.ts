import { createTool } from '@mastra/core/tools';
import { RequestContext } from '@mastra/core/request-context';
import { returnRequestSchema, returnSchema, DomainError } from '../../domain/schemas.js';
import { identityFromContext } from '../../domain/auth.js';
import { returnsService } from '../../domain/service.js';
import { processReturnWorkflow } from '../workflows/returns.js';
import type { StageReporter } from '../workflows/progress.js';

export const processReturnWithProgress = createTool({
  id: 'processReturnWithProgress',
  description: 'Run the standard-value return workflow with live stage progress and logs. Requires orderId, reason and idempotencyKey; uses authenticated tenant scope. Writes only at completion; retries are idempotent. Ineligible orders fail before mutation. For high-value returns use createReturn instead.',
  inputSchema: returnRequestSchema,
  outputSchema: returnSchema,
  execute: async (inputData, context) => {
    const requestContext = new RequestContext();
    const identity = identityFromContext(context?.requestContext);
    requestContext.set('identity', identity);
    const previous = returnsService.previousReturn(identity, inputData);
    const eligibility = returnsService.checkEligibility(identity, inputData.orderId);
    if (!previous && !eligibility.eligible) throw new DomainError('INELIGIBLE', eligibility.reason);
    if (eligibility.requiresConfirmation) throw new DomainError('CONFIRMATION_REQUIRED', 'Use createReturn for high-value confirmation.');
    const signal = context?.abortSignal ?? context?.mcp?.extra?.signal;
    requestContext.set('returns.abortSignal', signal);
    const reporter: StageReporter = async (stage, progress) => {
      await context?.mcp?.log?.('info', stage);
      await context?.mcp?.progress?.({ progress, total: 3, message: stage });
    };
    requestContext.set('returns.stageReporter', reporter);
    try {
      const run = await processReturnWorkflow.createRun();
      const result = await run.start({ inputData, requestContext });
      if (signal?.aborted) throw new DomainError('CANCELLED', 'Return workflow cancelled.');
      if (result.status !== 'success') throw new DomainError('INTERNAL', 'Unable to complete the return workflow.');
      return result.result;
    } finally {
      requestContext.delete('returns.stageReporter');
    }
  },
});
