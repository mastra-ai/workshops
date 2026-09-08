import assert from 'node:assert/strict';
import { z } from 'zod';
import { Client, LOG_LEVEL_META_KEY, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { startServer } from './server.js';
const server = await startServer();
const client = new Client({ name: 'workflow-demo', version: '1.0.0' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
const stages: string[] = [], logs: unknown[] = [];
try {
  await client.connect(new StreamableHTTPClientTransport(new URL(`${server.baseUrl}/api/mcp/returns-modern/mcp`), { requestInit: { headers: { authorization: 'Bearer workshop-north' } } }));
  const args = { orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'workflow-demo-001' };
  const result = await client.callTool({ name: 'run_processReturnWorkflow', arguments: args });
  const envelope = z.object({ content: z.array(z.object({ text: z.string() })).min(1) }).parse(result);
  const workflow = JSON.parse(envelope.content[0].text);
  assert.equal(workflow.status, 'success');
  assert.deepEqual(workflow.stepExecutionPath, ['eligibility', 'draft', 'completion']);
  console.log('GENERATED WORKFLOW STAGES', workflow.stepExecutionPath);
  client.setNotificationHandler('notifications/message', notification => { logs.push(notification.params.data); console.log('WORKFLOW LOG', notification.params.data); });
  // Same idempotency key: demonstrate the live-event wrapper without a second write.
  const replay = await client.callTool({ name: 'processReturnWithProgress', arguments: args, _meta: { [LOG_LEVEL_META_KEY]: 'info' } }, { onprogress: event => { stages.push(event.message ?? ''); console.log('WORKFLOW PROGRESS', event.progress, '/', event.total, event.message); } });
  assert(!replay.isError);
  assert.deepEqual(stages, ['eligibility', 'draft', 'completion']);
  assert.deepEqual(logs, stages.map(message => ({ message })));
  console.log('WORKFLOW RESULT', replay);
  const resource = await client.readResource({ uri: 'returns://orders/ORD-001' });
  const content = z.object({ contents: z.array(z.object({ text: z.string() })).min(1) }).parse(resource);
  assert.equal(JSON.parse(content.contents[0].text).status, 'returned');
  console.log('ORDER RESOURCE', content.contents[0].text);
  console.log('WORKFLOW GREEN: generated staged result, live progress/logs and resulting resource verified.');
} finally { await client.close(); await server.close(); }
