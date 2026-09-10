import { mkdir, writeFile, rm } from 'node:fs/promises';
import { startServer } from './server.js';
import { createPublicGateway } from './public-gateway.js';
import { once } from 'node:events';

const publish = process.argv.includes('--public');
if (publish && (process.env.MCP_AUTH_MODE !== 'workos' || !process.env.MCP_RESOURCE_URL || !process.env.WORKOS_ISSUER)) {
  throw new Error('Public gateway requires WorkOS mode, issuer and resource URL');
}
const server = await startServer();
const gateway = publish && process.env.MCP_RESOURCE_URL && process.env.WORKOS_ISSUER
  ? createPublicGateway(server.baseUrl, process.env.MCP_RESOURCE_URL, process.env.WORKOS_ISSUER, process.argv.includes('--oauth-check')) : undefined;
if (gateway) {
  try { gateway.listen(4180, '127.0.0.1'); await once(gateway, 'listening'); }
  catch (error) { await server.close(); throw error; }
  console.log('MCP-only gateway: http://127.0.0.1:4180');
}
await mkdir('.runtime', { recursive: true });
await writeFile('.runtime/server.env', `export MASTRA_BASE_URL=${server.baseUrl}\n`);
console.log(`export MASTRA_BASE_URL=${server.baseUrl}`);
console.log('Fresh fixtures ready. In another terminal: source .runtime/server.env');
console.log('Stop with Ctrl-C. Restart to reset fixtures.');
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  gateway?.close();
  gateway?.closeAllConnections();
  await server.close();
  await rm('.runtime/server.env', { force: true });
}
process.once('SIGINT', close);
process.once('SIGTERM', close);
