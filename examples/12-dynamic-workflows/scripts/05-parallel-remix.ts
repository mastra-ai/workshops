// Beat 5 — Parallel fan-out + mapping merge.
//
// What it shows: every parallel child gets the same input concurrently; the
// output is an object keyed by child id, which a mapping step then merges.
//
// Why it matters: independent analyses of the same input — classify AND
// extract AND score — run concurrently without you writing any orchestration
// code. The fan-out/fan-in shape is declared, not implemented.
import { banner, checkServer, loadWorkflow, run, show, upsert } from './lib';

await checkServer();

const def = loadWorkflow('text-remixer.json');

banner('parallel: three tool steps get the same input, mapping merges by step id');
show('workflows/text-remixer.json', def);

banner('Save');
const saved = await upsert(def);
show(`HTTP ${saved.status}`, saved.json);

banner('Run');
const result = await run('text-remixer', { text: 'Dynamic workflows are data' });
show(`HTTP ${result.status}`, result.json);

console.log('→ Open Studio: text-remixer renders as a real fan-out/fan-in graph.');
