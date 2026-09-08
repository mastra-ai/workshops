# Phase 2 development proof

Local MCP overlay: `a5019083edc3d147f35692fcb0c94099abbf2251`; published core: `1.64.0`.
This is development evidence, not released-v2 ship proof.

Run `pnpm setup:local-v2` with `MASTRA_MCP_V2_PATH` set, then `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm demo:discover`.
The discovery script allocates a port, prints `export MASTRA_BASE_URL=...`, invokes curl against the registry, asserts both protocol revisions, calls a tool, lists resources/templates/prompts, reads policy and authorized order state, then disconnects and stops its server.

## Subscription authorization spike

`tests/mcp-http.test.ts` authenticates as south, proves north's ORD-001 cannot be read, then successfully subscribes to that same URI. Subscription membership is **not authorization**.
Source checked in the overlay: `packages/mcp/src/server/server.ts` resource subscription handlers (1382–1400) track URI membership without an authorization callback; `resourceActions.ts:61–65` publishes a URI event to the modern handler bus.

Decision: use only the non-sensitive public policy for update events. Order resources remain tenant-authorized for listing and reading, but **never publish order update events**. Do not imply URI filtering isolates tenant subscriptions. This workshop does not implement credential revocation for long-lived streams.

## Resource and cache boundaries

The current server resolves reads from `listResources` before calling `getResourceContent` (`server.ts:1304–1319`); a resource template alone does not resolve arbitrary URIs. Therefore list concrete authorized fixture orders as well as the template, and recheck authorization at read.

Cache hints are operation-wide, not per-resource. Both policy and mutable orders share `resources/read`; keep its default zero TTL rather than accidentally caching mutable orders. Cache only the stable, public template catalogue for 60 seconds. Per-policy read caching remains unsupported by this public configuration seam.

## Local overlay type boundary

`tsconfig.check.json` resolves the core peer to the example's installed core for type checking, avoiding private-class identity errors between two physical core installations. Keep that mapping out of the runtime tsconfig: the bundler otherwise inlines core internals and emits unresolved transitive package imports. Runtime workflow behavior is tested through the real server, not assumed from the typecheck.

The workflow intentionally handles only standard-value orders. High-value requests must use the interactive createReturn tool; no workflow input can claim confirmation. Workflow retry handling and modern elicitation replay remain Phase 4/5 verification work.
