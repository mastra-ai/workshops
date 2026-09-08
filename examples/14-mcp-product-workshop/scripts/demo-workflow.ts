import assert from 'node:assert/strict';
import { z } from 'zod';
import { MCPClient } from '@mastra/mcp';
import { noopObserve } from '@mastra/core/tools';
import { startServer } from './server.js';
const server = await startServer();
const client = new MCPClient({ servers: { returns: { url: new URL(`${server.baseUrl}/api/mcp/returns-modern/mcp`), requestInit: { headers: { authorization: 'Bearer workshop-north' } } } } });
try {
  const tools = await client.listTools();
  const result = await tools.returns_run_processReturnWorkflow.execute?.({ orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'workflow-demo-001' }, { observe: noopObserve });
  const envelope = z.object({ isError: z.literal(false), content: z.array(z.object({ text: z.string() })).min(1) }).parse(result);
  const workflow = JSON.parse(envelope.content[0].text);
  assert.equal(workflow.status, 'success');
  assert.deepEqual(workflow.stepExecutionPath, ['eligibility', 'draft', 'completion']);
  console.log('WORKFLOW STAGES', workflow.stepExecutionPath);
  console.log('WORKFLOW RESULT', workflow.result);
  const resource = await client.resources.read('returns', 'returns://orders/ORD-001');
  const content = z.object({ contents: z.array(z.object({ text: z.string() })).min(1) }).parse(resource);
  assert.equal(JSON.parse(content.contents[0].text).status, 'returned');
  console.log('ORDER RESOURCE', content.contents[0].text);
  console.log('WORKFLOW GREEN: staged execution and resulting resource verified.');
} finally { await client.disconnect(); await server.close(); }
