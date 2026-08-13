// Beat 3 — Upsert semantics: saving the same id replaces the live registration.
// v2 adds a `shout` step. New runs pick up the new graph instantly.
import { banner, checkServer, loadWorkflow, run, show, upsert } from './lib';

await checkServer();

const def = loadWorkflow('greeting-workflow-v2.json');

banner('Same id, new graph — a second step is added');
show('workflows/greeting-workflow-v2.json', def);

banner('Upsert replaces the live registration');
const saved = await upsert(def);
show(`HTTP ${saved.status}`, saved.json);

banner('Run again — output reflects the new graph, no restart');
const result = await run('greeting-workflow', { name: 'Brandon' });
show(`HTTP ${result.status}`, result.json);

console.log('→ Refresh Studio: the graph now shows two steps.');
console.log('→ Bonus: restart the dev server — the v2 definition rehydrates from mastra.db.');
