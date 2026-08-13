// Beat 10 — Composition: nested workflows saved as an atomic bundle.
//
// What it shows: the root references a helper by workflowId; the helper rides
// along in `dependencies`. One POST saves both — dependency-ordered,
// cycle-detected, all-or-nothing.
//
// Why it matters: you can grow a library of reusable sub-workflows that users
// and agents compose into bigger ones. Atomic saves mean you never end up with
// a half-registered set.
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
