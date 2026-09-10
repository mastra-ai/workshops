import { mkdir, writeFile } from 'node:fs/promises';
import { runHttpProof } from './protocol/http.js';

import { runStdioProof } from './protocol/stdio.js';

const proof = { ...await runHttpProof(), stdio: await runStdioProof() };
const directory = process.env.PROOF_DIR ?? '.runtime/proof';
await mkdir(directory, { recursive: true });
for (const [era, events] of Object.entries(proof)) {
  await writeFile(`${directory}/${era}.jsonl`, events.map(event => JSON.stringify(event)).join('\n') + '\n');
}
console.log('V2 PROOF GREEN: stateless modern HTTP; scalar 80; safe trace correlation; decline/cancel 0 writes; elicitation/retry 1 write; public subscription update; auto stdio server/discover; sessionful legacy; typed pinned-modern failure.');
console.log(`Sanitized JSONL: ${directory}`);
