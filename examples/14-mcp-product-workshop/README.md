# MCP is so back! Build Tools for the Agents Your Users Already Use

Presenters: **Daniel Lew** and **Alex Booker**.

Returns Desk is a deterministic local commerce application: one business layer will serve REST, CLI, embedded-agent, and MCP interfaces. No model key is required for the core workshop.

## Development baseline

Requires Node 22.13+ and pnpm. This scaffold is not yet a runnable workshop. The registration smoke test intentionally fails until Phase 1 implements the application. Demo script entries reserve the approved command names; their implementations follow in order.

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
