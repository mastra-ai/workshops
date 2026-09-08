import { mkdir, writeFile, rm } from 'node:fs/promises';
import { startServer } from './server.js';

const server = await startServer();
await mkdir('.runtime', { recursive: true });
await writeFile('.runtime/server.env', `export MASTRA_BASE_URL=${server.baseUrl}\n`);
console.log(`export MASTRA_BASE_URL=${server.baseUrl}`);
console.log('Fresh fixtures ready. In another terminal: source .runtime/server.env');
console.log('Stop with Ctrl-C. Restart to reset fixtures.');
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  await server.close();
  await rm('.runtime/server.env', { force: true });
}
process.once('SIGINT', close);
process.once('SIGTERM', close);
