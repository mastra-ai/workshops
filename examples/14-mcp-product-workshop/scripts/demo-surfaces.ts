import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { startServer } from './server.js';
const server = await startServer();
try {
  const rest = await fetch(`${server.baseUrl}/returns/orders/ORD-001`, { headers: { authorization: 'Bearer workshop-north' } }).then(response => response.json());
  const cli = JSON.parse(execFileSync('pnpm', ['exec', 'tsx', 'src/cli.ts', 'get', 'ORD-001'], { env: { ...process.env, RETURNS_TENANT: 'north' }, encoding: 'utf8' }));
  assert.deepEqual(rest, cli);
  console.log(JSON.stringify({ rest, cli, result: 'GREEN: shared product layer' }, null, 2));
} finally { await server.close(); }
