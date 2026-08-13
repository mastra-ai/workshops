// Beat 6 — Conditional routing with the declarative predicate DSL.
//
// What it shows: no closures — predicates are JSON (eq/gt/in/and/or/...),
// aligned index-for-index with the branch steps. A mapping with a step ARRAY
// merges whichever branch actually ran.
//
// Why it matters: routing logic as data means an end user, an agent, or a
// visual editor can define "if urgent → escalate" rules without you shipping
// code. This is the pattern behind user-configurable triage and routing.
import { banner, checkServer, loadWorkflow, run, show, upsert } from './lib';

await checkServer();

const def = loadWorkflow('support-triage.json');

banner('conditional: classify → branch on priority → merge the chosen reply');
show('workflows/support-triage.json', def);

banner('Save');
const saved = await upsert(def);
show(`HTTP ${saved.status}`, saved.json);

banner('Urgent message → escalation branch');
const urgent = await run('support-triage', {
  text: 'Production is down after the last deploy!',
});
show(`HTTP ${urgent.status}`, urgent.json);

banner('Normal message → standard branch');
const normal = await run('support-triage', {
  text: 'How do I change my billing email?',
});
show(`HTTP ${normal.status}`, normal.json);

console.log('→ Studio labels the condition nodes from the predicates automatically.');
