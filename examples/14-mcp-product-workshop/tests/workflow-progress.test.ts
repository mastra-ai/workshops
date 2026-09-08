import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { expect, test } from 'vitest';

test('workflow demo proves generated stages and live MCP progress/logs before resource read', async () => {
  const { stdout } = await promisify(execFile)('pnpm', ['demo:workflow'], { timeout: 90_000, env: { ...process.env, FORCE_COLOR: '0' } });
  expect(stdout).toContain("GENERATED WORKFLOW STAGES [ 'eligibility', 'draft', 'completion' ]");
  expect(stdout).toContain('WORKFLOW PROGRESS 3 / 3 completion');
  expect(stdout).toContain("WORKFLOW LOG { message: 'completion' }");
  expect(stdout.indexOf('WORKFLOW PROGRESS 3')).toBeLessThan(stdout.indexOf('ORDER RESOURCE'));
  expect(stdout).toContain('WORKFLOW GREEN');
}, 100_000);
