import assert from 'node:assert/strict';
import { z } from 'zod';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { processResultSchema } from '../src/mastra/tools/process-return.js';
import { startServer } from './server.js';

const server = process.env.MASTRA_BASE_URL ? undefined : await startServer({ SHIPPING_FAILURES: '3' });
const baseUrl = process.env.MASTRA_BASE_URL || server?.baseUrl;
assert(baseUrl);
const headers = { authorization: 'Bearer workshop-north' };
const client = new Client({ name: 'workflow-demo', version: '1.0.0' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
try {
  await client.connect(new StreamableHTTPClientTransport(new URL(`${baseUrl}/api/mcp/returns-modern/mcp`), { requestInit: { headers } }));
  const args = { orderId: 'ORD-001', reason: 'damaged', idempotencyKey: 'workflow-demo-001' };
  const call = async () => {
    const wire = await client.callTool({ name: 'processReturn', arguments: args });
    assert(!JSON.stringify(wire).match(/stack|\/Users\/|node_modules|Bearer/));
    return z.object({ structuredContent: processResultSchema }).parse(wire).structuredContent;
  };
  const failed = await call();
  assert.equal(failed.status, 'needs_retry');
  console.log('CARRIER DOWN', failed);
  const recovered = await call();
  assert.equal(recovered.status, 'completed');
  assert(failed.status === 'needs_retry' && recovered.status === 'completed');
  assert.equal(recovered.return.id, failed.return.id);
  assert.deepEqual(await call(), recovered);
  console.log('RECOVERED', recovered);

  const spanSchema = z.object({ traceId: z.string(), spanId: z.string(), parentSpanId: z.string().nullable(), spanType: z.string(), name: z.string(), error: z.unknown().optional() });
  const traceSchema = z.object({ spans: z.array(spanSchema) });
  let traces: z.infer<typeof traceSchema> = { spans: [] };
  for (let attempt = 0; attempt < 40; attempt++) {
    traces = traceSchema.parse(await (await fetch(`${baseUrl}/api/observability/traces?perPage=100`, { headers })).json());
    if (traces.spans.filter(span => span.name.includes('processReturn')).length >= 3) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert(traces.spans.length >= 3, 'Workflow traces must reach storage');
  let carrierFailure = false;
  for (const root of traces.spans.filter(span => span.name.includes('processReturn'))) {
    const trace = traceSchema.parse(await (await fetch(`${baseUrl}/api/observability/traces/${root.traceId}`, { headers })).json());
    assert(trace.spans.some(span => span.spanType === 'workflow_run' && span.parentSpanId === root.spanId), 'Tool must parent the workflow');
    assert(trace.spans.some(span => span.name.includes('create-return')));
    carrierFailure ||= trace.spans.some(span => span.name.includes('shipping-label') && !!span.error);
  }
  assert(carrierFailure, 'Carrier failure must be visible in the trace');
  console.log(`TRACES ${baseUrl}`);
  console.log('WORKFLOW GREEN: carrier failure, recovery, replay and persisted nested traces.');
} finally { await client.close(); await server?.close(); }
