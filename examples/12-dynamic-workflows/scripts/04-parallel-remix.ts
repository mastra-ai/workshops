// Beat 4 — Parallel fan-out + mapping merge.
// Three transforms run concurrently on the same input; a mapping step merges the results.
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
