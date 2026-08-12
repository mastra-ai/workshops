import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Override with MASTRA_BASE_URL if `mastra dev` picked a different port
// (it silently increments when 4111 is taken — check the dev server banner!).
export const BASE = process.env.MASTRA_BASE_URL ?? 'http://localhost:4111/api';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function loadWorkflow(file: string) {
  return JSON.parse(readFileSync(join(root, 'workflows', file), 'utf8'));
}

export function banner(title: string) {
  console.log(`\n=== ${title} ===\n`);
}

export function show(label: string, value: unknown) {
  console.log(`${label}:`);
  console.log(JSON.stringify(value, null, 2));
  console.log();
}

async function request(method: string, path: string, body?: unknown) {
  console.log(`→ ${method} ${BASE}${path}`);
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: res.status, json };
}

export async function checkServer() {
  try {
    await fetch(`${BASE}/tools`);
  } catch {
    console.error(`Cannot reach ${BASE} — is \`pnpm dev\` running on this port?`);
    console.error('If mastra dev printed a different port, set MASTRA_BASE_URL, e.g.');
    console.error('  MASTRA_BASE_URL=http://localhost:4112/api npx tsx scripts/01-create-and-run.ts');
    process.exit(1);
  }
}

/** POST /api/stored/workflows — validate + persist + register a JSON definition. */
export async function upsert(def: unknown) {
  return request('POST', '/stored/workflows', def);
}

/** POST /api/workflows/:id/start-async — run a workflow and wait for the result. */
export async function run(workflowId: string, inputData: unknown) {
  return request('POST', `/workflows/${workflowId}/start-async`, { inputData });
}

/** GET /api/stored/workflows — list persisted dynamic workflow definitions. */
export async function list() {
  return request('GET', '/stored/workflows');
}

/** GET /api/stored/workflows/:id — fetch one persisted definition. */
export async function get(workflowId: string) {
  return request('GET', `/stored/workflows/${workflowId}`);
}

/** DELETE /api/stored/workflows/:id — remove definition + live registration. */
export async function remove(workflowId: string) {
  return request('DELETE', `/stored/workflows/${workflowId}`);
}
