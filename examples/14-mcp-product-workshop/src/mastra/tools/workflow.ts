import { createTool } from '@mastra/core/tools';
import { RequestContext } from '@mastra/core/request-context';
import { returnRequestSchema, returnSchema, DomainError } from '../../domain/schemas.js';
import { identityFromContext } from '../../domain/auth.js';
import { processReturnWorkflow } from '../workflows/returns.js';
import type { StageReporter } from '../workflows/progress.js';

export const processReturnWithProgress = createTool({
  id: 'processReturnWithProgress',
  description: 'Run the standard-value return workflow with live stage progress and logs. Requires orderId, reason and idempotencyKey; uses authenticated tenant scope. Writes only at completion; retries are idempotent. Ineligible orders fail before mutation. For high-value returns use createReturn instead.',
  inputSchema: returnRequestSchema,
  outputSchema: returnSchema,
  execute: async (inputData, context) => {
    const requestContext = new RequestContext();
    requestContext.set('identity', identityFromContext(context?.requestContext));
    const reporter: StageReporter = async (stage, progress) => {
      await context?.mcp?.log?.('info', stage);
      await context?.mcp?.progress?.({ progress, total: 3, message: stage });
    };
    requestContext.set('returns.stageReporter', reporter);
    try {
      const run = await processReturnWorkflow.createRun();
      const result = await run.start({ inputData, requestContext });
      if (result.status !== 'success') throw new DomainError('INELIGIBLE', 'Workflow did not complete. Check eligibility; high-value orders require createReturn.');
      return result.result;
    } finally {
      requestContext.delete('returns.stageReporter');
    }
  },
});
