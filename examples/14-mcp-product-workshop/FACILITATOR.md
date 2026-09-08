# MCP is so back! Build Tools for the Agents Your Users Already Use

**Daniel Lew and Alex Booker** · 90-minute core + optional 30-minute extension.

Present first, then leave the deck for one continuous live demo. Do not return to slides between features. Daniel drives the code/protocol; Alex hosts and collects questions. These are suggested facilitation roles, not biographical claims.

## Before the room opens

Follow the README setup, including the maintainer overlay until v2 is published. Capture its commit. Install Inspector while online. Close any previous workshop launcher with Ctrl-C; do not kill unrelated processes. Open the deck, editor and terminal side by side. Set terminal text large enough for the room. Keep `proof/expected/` and `proof/phase-5.md` open as offline fallbacks.

Run from this example directory:

```bash
pnpm reset
pnpm typecheck
pnpm test
pnpm build
pnpm demo:surfaces
pnpm demo:discover
pnpm demo:workflow
pnpm demo:inspector
pnpm demo:v2
pnpm demo:failures
```

Each demo owns fresh state, allocates a port and closes its process/clients. `reset` cannot change an already-running server. The scripts do not depend on a pre-existing server. Their shared launcher supplies the allocated URL; the interactive launcher writes `.runtime/server.env`. Never copy a port from yesterday's terminal.

## Presentation and setup: 00:00–25:00

| Slide | Time | Speaker notes / question |
| --- | --- | --- |
| 1 · Cover + hosts | 2 min | Welcome, introduce Daniel Lew and Alex Booker. Promise: a callable product, not a new assistant. No model key needed. |
| 2 · Coworkers | 2 min | Every agent has a learning curve and quirks. Ask who already has a preferred assistant. Nontechnical users may prefer their existing host. |
| 3 · False binary | 2 min | MCP has re-entered the conversation; CLI debates need not produce a winner. A CLI is excellent for explicit local automation. |
| 4 · Decision lab | 4 min | Classify support engineer, customer assistant and embedded checkout helper. Ask who owns reasoning/auth; consider user skill, locality, discovery and side effects. Accept “both.” |
| 5 · Boundary | 2 min | The host controls reasoning; the product controls authorization. Discovery is not permission. |
| 6 · Shared domain | 2 min | Four surfaces, one service. Reuse semantics, not HTTP calls between adapters. Processes share code, not in-memory state. |
| 7 · Primitives | 2 min | Tool = action, resource = context, prompt = reusable instructions. Workflow = coordinated application behavior exposed as a tool. |
| 8 · Contracts | 2 min | Open `tests/mcp-contract.test.ts` later for the unregistered callApi anti-contract. A generic wrapper shifts knowledge and safety burden onto the model. |
| 9 · Modern | 2 min | Explicitly read the three columns. 2026 support predates v2; v2 makes it the default. Modern HTTP is not a mandatory server/discover probe. |
| 10 · Production | 2 min | Identity is not authorization; stateless transport is not stateless business data. Local bearer fixtures are not OAuth. |
| 11 · Returns Desk | 2 min | Set the outcome: read an order, complete a return, prove one write after replay. Public policy updates only. |
| 12 · Transition | 1 min | Leave the deck. Show actual requests/responses and source, not screenshots as correctness proof. |

## Continuous live demo: 25:00–85:00

For each chapter below: run `pnpm reset` first. Do not restart a manually running interactive server behind Cursor without reconnecting the host.

### 1. One product, multiple surfaces — 25:00–33:00 (8 min)

- **State:** fresh fixtures, no external host required.
- **Command:** `pnpm demo:surfaces`.
- **Expected:** REST and CLI agree on ORD-001 (4900 cents, delivered). Show `src/domain/service.ts`, `src/cli.ts`, `src/mastra/api/returns.ts`, then the thin MCP read tool.
- **Teaching point:** same code and policy, not duplicated business rules. Each process has independent fixture state.
- **Fallback:** run `RETURNS_TENANT=north pnpm exec tsx src/cli.ts get ORD-001`; inspect API test assertions.
- **Cleanup:** script closes its owned server. No manual deletion needed.

### 2. Discovery and real hosts — 33:00–47:00 (14 min)

- **State:** fresh fixtures; Inspector package cached; signed-in Cursor only for optional human demonstration.
- **Commands:** `pnpm demo:discover`, then `pnpm demo:inspector`.
- **Expected:** five tools including generated `run_processReturnWorkflow`, policy resource, order template, reply prompt; authorized order read. Registry curl asserts modern 2026-07-28 and explicit legacy 2025-11-25.
- **Teaching point:** descriptions and schemas are the product interface. `callApi` is test-only and absent. Resources are not executable tools; prompt invocation is optional.
- **Host chapter:** run `pnpm serve` in a dedicated terminal. In another, `source .runtime/server.env`. Follow `docs/client-setup.md` exactly for Inspector UI / Cursor. Open Studio's MCP list and inspect both registered servers. This is a human checkpoint, not a claim that Cursor automation ran.
- **Fallback:** programmatic client + Inspector CLI output. If signed-in Cursor is unavailable, skip its mutation; never burn wire/failure time troubleshooting login.
- **Cleanup:** disconnect Cursor, stop `pnpm serve` with Ctrl-C. Its env file is removed.

### 3. Workflow-backed capability — 47:00–57:00 (10 min)

- **State:** fresh ORD-001, not the order already mutated by a host.
- **Command:** `pnpm demo:workflow`.
- **Expected:** `eligibility`, `draft`, `completion`; success; order resource now `returned`.
- **Teaching point:** staged behavior is more than an arbitrary endpoint. The workflow rejects high-value orders; interactive `createReturn` owns their confirmation. Show source steps and the returned execution path. The execution path is a final result, not a claim of streamed progress events.
- **Fallback:** the real-HTTP workflow test in `tests/mcp-http.test.ts` and its asserted step path. Do not fabricate progress/log messages if a host doesn't display them.
- **Cleanup:** script disconnects and closes the server. Explain process-local storage on restart.

### 4. What modern changes on the wire — 57:00–74:00 (17 min)

- **State:** three isolated harness legs, modern overlay active (or released v2 at launch).
- **Command:** `pnpm demo:v2`.
- **Expected:** `V2 PROOF GREEN`; regenerated `.runtime/proof/modern.jsonl`, `legacy.jsonl`, `stdio.jsonl`.
- **Walkthrough:** HTTP modern has no session header; accepted high-value confirmation causes execution replay but exactly one write; decline/cancel cause none. Show scalar `structuredContent: 80`, safe trace correlation and public policy event via `subscriptions/listen`. Show unsubscribed delivery stops. Compare explicit legacy session headers. Finally show stdio auto's opening `server/discover` and the typed modern-pin rejection against legacy.
- **Teaching point:** only stdio auto demonstrates the opening probe here. HTTP is explicitly pinned. This is a change in operational defaults, not the invention of every capability.
- **Fallback:** committed sanitized `proof/expected/` plus `proof/phase-4.md`; identify it as recorded evidence, never a live run.
- **Cleanup:** harness closes streams/transports/listeners in finally; no persistent app state.

### 5. Production failure drill — 74:00–85:00 (11 min)

- **State:** fresh fixtures; no public fault-injection endpoint.
- **Command:** `pnpm demo:failures`.
- **Expected:** 401 missing token, 403 wrong tenant, 400 malformed input, 409 conflicting key; identical retries return the same result. Injected dependency error is redacted; an actual in-flight abort stops preflight with zero writes; twelve concurrent retries yield one write.
- **Teaching point:** domain authorization, post-confirmation writes and durable idempotency—not the model—enforce safety. The injected loopback adapter is test infrastructure, not a deployable auth server. Cancellation cannot reverse an already committed transaction.
- **Fallback:** `proof/phase-5.md`; explain both the positive and negative assertions.
- **Cleanup:** restore dependency implementation, disconnect, close all listeners. Tests run this twice and require natural process exit.

## Recap: 85:00–90:00

Optional slide 13. Ask participants to name their first bounded read and their ownership boundary. Point to the five-minute README path. Collect questions. Do not claim release readiness while the release checklist remains open.

**If time is lost:** drop the optional reply prompt and live Cursor mutation first. Shorten source browsing next. **Never drop modern wire proof or the production failure drill.**

## Optional extension: +30 minutes

| Budget | Topic / source | Exercise / expected result |
| --- | --- | --- |
| 8 min | Workflow depth: `src/mastra/workflows/returns.ts` | Explain high-value rejection, step contracts and why durable storage matters. Discuss progress/log emission separately from the returned step path. |
| 7 min | Cache / trace: `src/mastra/mcp/index.ts`, `proof/expected/modern.jsonl` | Locate policy cache hints and trace metadata. No mutable-order cache hints; only safe trace ID returned. |
| 8 min | OAuth / CIMD: `docs/production.md` | Diagram host → authorization server → access token → resource server → domain authorization. CIMD vs DCR concerns client registration, not user/tenant permission. |
| 7 min | Migration: modern vs legacy JSONL | Pin 2025-11-25 deliberately, inventory session-dependent features, then migrate a host. Do not recommend SSE as the new deployment path. |

Extension cleanup is the same as the core: stop only owned processes and reconnect hosts after restart. No OAuth server or unimplemented protocol feature is silently added to the lab.
