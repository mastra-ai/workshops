// Beat 9 — Sleep steps: pause mid-graph, then continue.
//
// What it shows: sleep pauses for a literal duration (2s here — the response
// time proves it); output passes through unchanged. sleepUntil takes an ISO
// date instead.
//
// Why it matters: time as a first-class step — cool-off periods, rate-limit
// spacing, scheduled follow-ups — declared in the graph instead of buried in
// setTimeout code.
import { banner, checkServer, loadWorkflow, run, show, upsert } from './lib';

await checkServer();

const def = loadWorkflow('delayed-greeting.json');

banner('sleep: a 2-second dramatic pause between greet and shout');
show('workflows/delayed-greeting.json', def);

banner('Save');
const saved = await upsert(def);
show(`HTTP ${saved.status}`, saved.json);

banner('Run (watch the ~2s pause before the result lands)');
const started = Date.now();
const result = await run('delayed-greeting', { name: 'Brandon' });
const elapsed = ((Date.now() - started) / 1000).toFixed(1);
show(`HTTP ${result.status} after ${elapsed}s`, result.json);
