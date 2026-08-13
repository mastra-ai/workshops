// Beat 7 — foreach: run one step per array item, order preserved, bounded concurrency.
import { banner, checkServer, loadWorkflow, run, show, upsert } from './lib';

await checkServer();

const def = loadWorkflow('bulk-greeter.json');

banner('foreach wraps a single tool step; input is an array');
show('workflows/bulk-greeter.json', def);

banner('Save');
const saved = await upsert(def);
show(`HTTP ${saved.status}`, saved.json);

banner('Run with four names (concurrency: 2)');
const result = await run('bulk-greeter', [
  { name: 'Brandon' },
  { name: 'Nik' },
  { name: 'Ada' },
  { name: 'Grace' },
]);
show(`HTTP ${result.status}`, result.json);
