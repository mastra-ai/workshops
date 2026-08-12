// Beat 2 — Strict validation on save.
// A broken definition is rejected BEFORE anything is persisted, with structured issues.
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
