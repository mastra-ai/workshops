// Beat 11 — Full CRUD over stored workflows: list, inspect, delete.
// Deleting removes the storage row AND unregisters the live workflow.
import { banner, checkServer, get, list, remove, show } from './lib';

await checkServer();

banner('List everything created during this demo');
const before = await list();
show(`HTTP ${before.status}`, before.json);

banner('Fetch one stored definition — the same JSON we saved');
const one = await get('bulk-greeter');
show(`HTTP ${one.status}`, one.json);

banner('Delete it');
const del = await remove('bulk-greeter');
show(`HTTP ${del.status}`, del.json);

banner('Gone from the list (and from Studio)');
const after = await list();
show(`HTTP ${after.status}`, after.json);

console.log('→ Handoff: writing JSON by hand gets old fast. Next: let Mastra Code write it.');
