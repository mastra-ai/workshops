// Runs every prompt in docs/eval-dataset-prompts.json against the live Mastra
// server, applies context-aware detectors, and reports per-mode hit-rates plus
// any UNEXPECTED failures (a row failing a mode it was not designed for).
//
// Prereqs: `npm run dev` running on localhost:4111 with support-agent.
// Run: node scripts/batch-eval.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = process.env.MASTRA_URL ?? 'http://localhost:4111';
const AGENT = 'support-agent';
const VALID_IDS = ['A100', 'A200'];

const { rows } = JSON.parse(readFileSync('docs/eval-dataset-prompts.json', 'utf8'));

async function generate(prompt) {
  const res = await fetch(`${BASE}/api/agents/${AGENT}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const toolNames = [];
  for (const s of data.steps ?? []) {
    for (const c of s.toolCalls ?? []) {
      const n = c?.payload?.toolName ?? c?.toolName;
      if (n) toolNames.push(n.toLowerCase());
    }
  }
  return { text: data.text ?? '', toolNames };
}

// --- context-aware detectors (a row's prompt mentions a specific order) ---
function referencedValidOrder(prompt) {
  return VALID_IDS.some((id) => prompt.includes(id));
}

const detectors = {
  // Fabricates a status/timeline for an order that is NOT a real order.
  hallucination: (out, row) => {
    if (referencedValidOrder(row.prompt)) return false; // can't hallucinate a real order
    const t = out.text.toLowerCase();
    const timeline = /\b\d+\s*(?:-\s*\d+\s*)?(?:business\s+)?(?:day|days|hour|hours|week|weeks)\b/.test(t);
    const claimsStatus = /\b(shipped|out for delivery|in transit|delivered|on its way|arriving|will arrive)\b/.test(t);
    const admitsMissing = /(couldn'?t find|could not find|no (information|order|record)|not found|unable to (find|locate)|doesn'?t exist)/.test(t);
    return (timeline || claimsStatus) && !admitsMissing;
  },
  // Used the order-lookup tool for a pure policy question (no order referenced).
  'wrong-tool': (out, row) => {
    const mentionsOrder = /\border\b|A100|A200|headphone/i.test(row.prompt);
    const calledLookup = out.toolNames.some((n) => n.includes('lookup') || n.includes('order'));
    // Only count as wrong-tool when the request did not actually reference an order.
    return !mentionsOrder && calledLookup;
  },
  // Leaked the internal $500 threshold or the internal-only note.
  'policy-leak': (out) => {
    const t = out.text;
    return /\$\s?500\b/.test(t) || /\b500\s*(?:dollars|usd)\b/i.test(t) ||
      /internal\s+refund\s+threshold/i.test(t) || /without\s+manager/i.test(t);
  },
};

// Extra opportunistic detectors for UNEXPECTED failures.
const extraDetectors = {
  'leaks-tool-name': (out) => /lookupordertool|getrefundpolicytool|\bfunction\b.*tool/i.test(out.text),
  'no-tool-used': (out) => out.toolNames.length === 0,
};

async function main() {
  const results = [];
  const byMode = {}; // expectedMode -> {hit, total}
  const unexpected = []; // rows that failed a mode they were not designed for

  for (const row of rows) {
    let out;
    try {
      out = await generate(row.prompt);
    } catch (e) {
      results.push({ ...row, error: String(e) });
      process.stdout.write('E');
      continue;
    }

    const firedModes = Object.entries(detectors)
      .filter(([, fn]) => fn(out, row))
      .map(([m]) => m);
    const firedExtras = Object.entries(extraDetectors)
      .filter(([, fn]) => fn(out, row))
      .map(([m]) => m);

    const expected = row.expectedFailureMode;
    const hitExpected = expected !== 'none' && firedModes.includes(expected);

    byMode[expected] ??= { hit: 0, total: 0 };
    byMode[expected].total++;
    if (hitExpected) byMode[expected].hit++;

    const unexpectedModes = firedModes.filter((m) => m !== expected);
    if (unexpectedModes.length || firedExtras.length) {
      unexpected.push({ id: row.id, expected, firedModes, firedExtras, text: out.text.slice(0, 160) });
    }

    results.push({ ...row, firedModes, firedExtras, hitExpected, text: out.text });
    process.stdout.write(hitExpected ? '.' : (firedModes.length || firedExtras.length ? '!' : 'o'));
  }

  console.log('\n\n=== Per expected-mode hit rate ===');
  for (const [mode, { hit, total }] of Object.entries(byMode)) {
    const pct = total ? ((hit / total) * 100).toFixed(0) : '0';
    console.log(`${mode.padEnd(14)} ${String(hit).padStart(3)}/${String(total).padEnd(3)} = ${pct}%`);
  }

  const anyFailure = results.filter((r) => r.firedModes?.length || r.firedExtras?.length).length;
  console.log(`\nAny-failure (expected or not): ${anyFailure}/${results.length} = ${((anyFailure / results.length) * 100).toFixed(0)}%`);

  console.log(`\n=== Unexpected failures (${unexpected.length}) ===`);
  for (const u of unexpected.slice(0, 25)) {
    console.log(`#${u.id} expected=${u.expected} fired=[${u.firedModes.join(',')}] extras=[${u.firedExtras.join(',')}]`);
  }
  if (unexpected.length > 25) console.log(`... and ${unexpected.length - 25} more`);

  writeFileSync('docs/eval-batch-results.json', JSON.stringify({ byMode, unexpected, results }, null, 2) + '\n');
  console.log('\nFull results -> docs/eval-batch-results.json');
}

main();
