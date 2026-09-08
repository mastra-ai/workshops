# MCP is so back! Build Tools for the Agents Your Users Already Use

Presenters: **Daniel Lew** and **Alex Booker**.

Returns Desk is a deterministic local commerce application: one business layer will serve REST, CLI, embedded-agent, and MCP interfaces. No model key is required for the core workshop.

## Development baseline

Requires Node 22.13+ and pnpm. Phase 1 provides runnable REST/CLI surfaces; MCP demos are still being implemented. The registration smoke test now passes.

`pnpm demo:surfaces` starts an isolated Mastra server on an allocated port, compares a REST lookup with a real CLI process, then closes the server. `pnpm dev` starts the interactive server. GET `/returns/orders/ORD-001` and POST `/returns` require `Authorization: Bearer workshop-north` (or `workshop-south`). These are public local teaching credentials, not production secrets.

CLI: `RETURNS_TENANT=north pnpm exec tsx src/cli.ts get ORD-001`. For a mutation: `return ORD-001 damaged unique-key-001`. Each CLI process/server has fresh in-memory fixtures; this example does not provide shared persistent storage. Restart a running server to reset its state. `pnpm reset` resets only its own process; automated demos always start fresh servers.

The optional `src/mastra/agents/support.ts` is deliberately not registered. To use it, supply your model key and a trusted `RequestContext` containing `identity: {tenantId, userId}`. The model cannot choose that identity. Both read tools call the same authorized service.

```bash
pnpm install --frozen-lockfile
pnpm test
```

The committed dependency is currently published `@mastra/mcp@^1.17.3`. Public launch requires released `^2.0.0`, a regenerated lockfile, and a clean registry-only rehearsal.

For maintainer-only pre-release testing:

```bash
MASTRA_MCP_V2_PATH=/path/to/mcp-v2-worktree pnpm setup:local-v2
```

The worktree must already have dependencies installed. Setup builds MCP and its dependencies, verifies the core peer range, replaces only the generated MCP symlink, and registers/lists/invokes a Zod-backed tool across the package boundary. It prints the exact source commit and checks manifest/lockfile hashes even on failure. Do not commit the overlay. Remove `node_modules` and run a frozen install to restore published packages reliably.

## Workshop format

25 minutes of presentation/setup, 60 minutes of continuous live demonstration, 5 minutes of recap. Optional 30-minute production/protocol extension. Features are demo chapters, not separate slides.
