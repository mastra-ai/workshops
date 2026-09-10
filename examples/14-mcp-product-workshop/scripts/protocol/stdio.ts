import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { InternalMastraMCPClient } from '@mastra/mcp';
import { sanitize, type WireEvent } from './wire.js';

export async function runStdioProof() {
  const directory = await mkdtemp(join(tmpdir(), 'returns-stdio-'));
  const path = join(directory, 'wire.jsonl');
  // Omitted Mastra client negotiation maps to auto. Capture real process bytes,
  // including the SDK negotiation probe that bypasses transport.send().
  const client = new InternalMastraMCPClient({ name: 'returns-stdio-proof', server: {
    command: process.execPath, args: ['scripts/protocol/stdio-proxy.mjs'], env: { ...process.env, STDIO_WIRE_PATH: path },
  } });
  try {
    await client.connect();
    await client.tools();
    assert((await client.resources.read('returns://policies/current')).contents.length > 0);
    await client.disconnect();
    const events: WireEvent[] = (await readFile(path, 'utf8')).trim().split('\n').map(line => JSON.parse(line));
    assert.equal(events.find(event => event.direction === 'request')?.method, 'server/discover');
    assert(JSON.stringify(events).includes('2026-07-28'));
    return events.map(event => ({ ...event, body: sanitize(event.body) }));
  } finally { await client.disconnect(); await rm(directory, { recursive: true, force: true }); }
}
