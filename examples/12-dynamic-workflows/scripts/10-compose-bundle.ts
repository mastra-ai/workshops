// Beat 10 — Composition: a root workflow nests a helper workflow, and both save
// atomically as one bundle (`dependencies`). Dependency-ordered, cycle-detected —
// either the whole set lands or none of it does.
import { banner, checkServer, loadWorkflow, run, show, upsert } from './lib';

await checkServer();

const def = loadWorkflow('fanfare-greeting.json');

banner('bundle: root references the helper by workflowId, helper rides along in dependencies');
show('workflows/fanfare-greeting.json', def);

banner('Save (one POST persists BOTH workflows)');
const saved = await upsert(def);
show(`HTTP ${saved.status}`, saved.json);

banner('Run the root — it invokes the nested helper, then amplifies');
const result = await run('fanfare-greeting', { name: 'Brandon' });
show(`HTTP ${result.status}`, result.json);

banner('The helper is a real, individually runnable workflow too');
const helper = await run('polite-greeting', { name: 'Nik' });
show(`HTTP ${helper.status}`, helper.json);
