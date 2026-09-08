import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { startServer } from '../server.js';

const server = await startServer();
const directory = await mkdtemp(join(tmpdir(), 'returns-inspector-'));
try {
  console.log(`export MASTRA_BASE_URL=${server.baseUrl}`);
  async function invoke(method: string, args: string[] = []) {
    const { stdout } = await promisify(execFile)('pnpm', ['dlx', '@modelcontextprotocol/inspector@2.5.0', '--cli', '--server-url', `${server.baseUrl}/api/mcp/returns-modern/mcp`, '--transport', 'http', '--method', method, '--format', 'json', '--header', 'Authorization: Bearer workshop-north', ...args], {
      timeout: 90_000, maxBuffer: 2_000_000,
      env: { ...process.env, MCP_CATALOG_PATH: join(directory, 'catalog.json'), MCP_CLIENT_CONFIG_PATH: join(directory, 'client.json') },
    });
    return JSON.parse(stdout);
  }
  const tools = await invoke('tools/list');
  assert.match(JSON.stringify(tools), /getOrder/);
  assert.doesNotMatch(JSON.stringify(tools), /callApi/);
  const order = await invoke('tools/call', ['--tool-name', 'getOrder', '--tool-args-json', '{"orderId":"ORD-001"}']);
  assert.match(JSON.stringify(order), /ORD-001/);
  const resources = await invoke('resources/list');
  assert.match(JSON.stringify(resources), /returns:\/\/policies\/current/);
  const policy = await invoke('resources/read', ['--uri', 'returns://policies/current']);
  assert.match(JSON.stringify(policy), /contents/);
  const prompts = await invoke('prompts/list');
  assert.match(JSON.stringify(prompts), /draft-customer-reply/);
  console.log('INSPECTOR GREEN: independent discovery, tool invocation, resource read and prompts; no Studio dependency.');
} finally {
  await server.close();
  await rm(directory, { recursive: true, force: true });
}
