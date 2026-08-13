// Beat 1 — Workflow definitions as data.
//
// What it shows: the whole lifecycle in one call — POST a JSON graph, it's
// validated, persisted, registered, and runnable immediately.
//
// Why it matters: a workflow stops being something you ship and becomes
// something you store. Anything that can produce JSON — an HTTP client, an
// LLM, a visual editor — can author one, with no deploy and no restart.
import { banner, checkServer, loadWorkflow, run, show, upsert } from './lib';

await checkServer();

const def = loadWorkflow('greeting-workflow.json');

banner('The entire workflow is this JSON');
show('workflows/greeting-workflow.json', def);

banner('Save it — validated, persisted, registered in one call');
const saved = await upsert(def);
show(`HTTP ${saved.status}`, saved.json);

banner('Run it immediately — no restart');
const result = await run('greeting-workflow', { name: 'Brandon' });
show(`HTTP ${result.status}`, result.json);

console.log('→ Open Studio: greeting-workflow now appears under Workflows.');
