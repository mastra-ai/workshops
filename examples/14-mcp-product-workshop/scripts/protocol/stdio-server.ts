import { returnsModern } from '../../src/mastra/mcp/index.js';

// Protocol-only harness: no HTTP listener, no identity injection, no mutation demo.
await returnsModern.startStdio();
process.once('SIGTERM', async () => { await returnsModern.close(); process.exit(0); });
