import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { expect, test } from 'vitest';

test('real MCP calls recover shipping and persist nested workflow traces', async () => {
  const { stdout } = await promisify(execFile)('pnpm', ['demo:workflow'], { timeout: 90_000, env: { ...process.env, MASTRA_BASE_URL: '', FORCE_COLOR: '0' } });
  expect(stdout).toContain('CARRIER DOWN');
  expect(stdout).toContain('RECOVERED');
  expect(stdout).toContain('WORKFLOW GREEN');
}, 100_000);
