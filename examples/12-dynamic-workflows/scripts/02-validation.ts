// Beat 2 — Strict validation on save.
//
// What it shows: a broken definition is rejected BEFORE anything is persisted,
// with structured, machine-readable issues pointing at the exact graph entry.
//
// Why it matters: runtime authoring means accepting definitions from authors
// you don't control — end users, LLMs, visual editors. Strict save validation
// is what makes that safe: a bad definition can never reach storage or boot.
import { banner, checkServer, list, loadWorkflow, show, upsert } from './lib';

await checkServer();

const def = loadWorkflow('broken-workflow.json');

banner('This graph references a tool that does not exist');
show('workflows/broken-workflow.json', def);

banner('Save is rejected with structured issues');
const saved = await upsert(def);
show(`HTTP ${saved.status}`, saved.json);

banner('broken-workflow was never persisted');
const after = await list();
show(`HTTP ${after.status}`, after.json);
