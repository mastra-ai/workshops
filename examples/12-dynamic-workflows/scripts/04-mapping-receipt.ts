// Beat 4 — Pure data shaping with a mapping step: templates, constants, field picks.
// No tools, no LLM — the whole workflow is one mapping projection.
import { banner, checkServer, loadWorkflow, run, show, upsert } from './lib';

await checkServer();

const def = loadWorkflow('order-receipt.json');

banner('mapping: mapConfig is a JSON-encoded string of { key: source } descriptors');
show('workflows/order-receipt.json', def);

banner('Save');
const saved = await upsert(def);
show(`HTTP ${saved.status}`, saved.json);

banner('Run');
const result = await run('order-receipt', { item: 'Widget', quantity: 3 });
show(`HTTP ${result.status}`, result.json);

console.log('→ Templates resolve ${initData.*} / ${stepResults.*} — no arithmetic, no code.');
