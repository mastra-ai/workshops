// Beat 5 — Conditional branching with the declarative predicate DSL.
// No closures: predicates are JSON (eq/gt/lte/and/or/...), so the branch logic round-trips.
import { banner, checkServer, loadWorkflow, run, show, upsert } from './lib';

await checkServer();

const def = loadWorkflow('text-router.json');

banner('conditional: predicates are data, aligned index-for-index with branches');
show('workflows/text-router.json', def);

banner('Save');
const saved = await upsert(def);
show(`HTTP ${saved.status}`, saved.json);

banner('Short text (≤ 4 words) → shout branch');
const short = await run('text-router', { text: 'hello there' });
show(`HTTP ${short.status}`, short.json);

banner('Long text (> 4 words) → whisper branch');
const long = await run('text-router', {
  text: 'This sentence definitely has more than four words in it',
});
show(`HTTP ${long.status}`, long.json);

console.log('→ Studio labels the condition nodes from the predicates automatically.');
