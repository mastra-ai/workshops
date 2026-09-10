import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { z } from 'zod';
import { expect, test } from 'vitest';
import { sanitize } from '../scripts/protocol/wire.js';

const eventSchema = z.object({ direction: z.string(), method: z.string().optional(), status: z.number().optional(), session: z.boolean().optional(), body: z.unknown().optional() });
function semantics(raw: string) {
  const events = raw.trim().split('\n').map(line => eventSchema.parse(JSON.parse(line)));
  const responses = events.filter(event => event.direction === 'body').map(event => z.object({ result: z.object({ resultType: z.string().optional(), structuredContent: z.unknown().optional() }).passthrough().optional(), method: z.string().optional() }).passthrough().parse(event.body));
  return {
    requestMethods: [...new Set(events.filter(event => event.direction === 'request').map(event => event.method))].sort(),
    hasSession: events.some(event => event.session),
    inputRequired: responses.filter(body => body.result?.resultType === 'input_required').length,
    scalar80: responses.some(body => body.result?.structuredContent === 80),
    updateEvents: responses.filter(body => body.method === 'notifications/resources/updated').length,
    assertions: events.filter(event => event.direction === 'assertion').map(event => event.body),
  };
}

test('three real protocol legs regenerate sanitized evidence with the required semantics', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'returns-protocol-'));
  try {
    const result = await promisify(execFile)('pnpm', ['demo:v2'], { env: { ...process.env, PROOF_DIR: directory }, timeout: 60_000 });
    expect(result.stdout).toContain('V2 PROOF GREEN');
    for (const era of ['modern', 'legacy', 'stdio']) {
      const actual = await readFile(join(directory, `${era}.jsonl`), 'utf8');
      const expected = await readFile(new URL(`../proof/expected/${era}.jsonl`, import.meta.url), 'utf8');
      expect(semantics(actual)).toEqual(semantics(expected));
      expect(actual).not.toMatch(/Bearer |workshop-north|\/Users\/|\/private\/tmp\/|127\.0\.0\.1:\d+/);
      if (era === 'modern') expect(semantics(actual)).toMatchObject({ hasSession: false, inputRequired: 3, scalar80: true, updateEvents: 1 });
      if (era === 'legacy') expect(semantics(actual).hasSession).toBe(true);
      if (era === 'stdio') expect(semantics(actual).requestMethods).toContain('server/discover');
    }
  } finally { await rm(directory, { recursive: true, force: true }); }
}, 90_000);

test('redaction preserves domain IDs and schema contracts while removing protocol IDs and sensitive metadata', () => {
  expect(sanitize({ jsonrpc: '2.0', id: 7, result: { id: 'ORD-001', properties: { id: { type: 'string' } }, baggage: 'secret', requestState: 'opaque' } })).toEqual({ jsonrpc: '2.0', id: '<volatile>', result: { id: 'ORD-001', properties: { id: { type: 'string' } }, baggage: '<redacted>', requestState: '<redacted>' } });
});
