// Beat 8 — Loops: repeat a step until a declarative predicate says stop.
//
// What it shows: `dountil` re-runs the step while the JSON predicate is false.
// The loop step's output must satisfy its own input shape — iteration N+1
// eats N's output.
//
// Why it matters: polling and retry — "check until the job is done" — is the
// most common loop in real integrations, and here it's expressed entirely as
// data. No while loop, no code to ship.
import { banner, checkServer, loadWorkflow, run, show, upsert } from './lib';

await checkServer();

const def = loadWorkflow('countdown.json');

banner('loop: dountil re-runs the step until the predicate is TRUE (exit condition)');
show('workflows/countdown.json', def);

banner('Save');
const saved = await upsert(def);
show(`HTTP ${saved.status}`, saved.json);

banner('Run from 5 — the tick step executes 5 times');
const result = await run('countdown', { count: 5 });
show(`HTTP ${result.status}`, result.json);
