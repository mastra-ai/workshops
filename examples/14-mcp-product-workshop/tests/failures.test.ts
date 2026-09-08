import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { expect, test } from 'vitest';

test('failure drill exits cleanly and proves cancellation, redaction and idempotent concurrency', async () => {
  for (let run = 0; run < 2; run++) {
    const { stdout, stderr } = await promisify(execFile)('pnpm', ['demo:failures'], { timeout: 60_000 });
    expect(stdout).toContain('FAILURES GREEN');
    expect(stdout).toContain('"abortStoppedPreflight":true');
    expect(stdout).toContain('"abortedWrites":0');
    expect(stdout).toContain('"committedWrites":1');
    expect(stdout + stderr).not.toContain('INTERNAL_SECRET_DATABASE_PASSWORD');
  }
}, 130_000);
