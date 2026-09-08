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
| 2 · Coworkers | 2 min | Ask who already has a preferred assistant. Agents have habits and quirks to learn; this is a product hypothesis, not a universal preference. Bridge: give that assistant one useful job. |
| 3 · Returns Desk | 2 min | “Can I return this order?” Establish the application before the protocol. ORD-001 is the normal path; ORD-002 will need confirmation. We create a return record, not a real financial refund. |
| 4 · CLI / MCP decision | 3 min | Same task, different environment: provisioned support shell → CLI/API; compatible customer host → consider MCP; your UX/reasoning → embedded agent; deterministic integration → API. Change one assumption. Both is valid. Give CLI composition/on-demand help its due; code execution can also run over MCP. |
| 5 · Boundary | 2 min | Trace the order request. Notion’s real setup requires connection, OAuth and workspace permissions. Host compatibility is a check, not a promise; a configured server is not global discovery. |
| 6 · Shared domain | 2 min | Four surfaces, one service. Processes share code, not in-memory state. Ask which rule would drift if copied across four adapters. |
| 7 · Contracts | 2 min | A return, not an API puzzle. GitHub added selective loading so two tools did not require 27. Keep tools useful, not merely numerous. Inspect actual descriptions/schemas later; callApi remains unregistered. |
| 8 · Primitives | 2 min | Name the pieces only after seeing the task: return tool, policy resource, optional reply prompt. Workflow is application behavior behind a tool. Host UI/support varies. |
| 9 · Independent requests | 2 min | No initialize or session ID; version/capabilities travel per request. Less protocol-session coordination, not less business responsibility. Distinguish July spec from Mastra’s v2 default. |
| 10 · Interaction | 2 min | Confirmation returns input_required; retry with the answer. Separate opted-in subscription stream for policy changes; progress/logs stay with their request. Two practical consequences, not an RPC inventory. |
| 11 · Lost response | 3 min | Ask whether the return happened. New protocol request ID is not a new business operation: keep the idempotency key. Authorize, confirm, deduplicate. Modern stream resumption is gone; this motivates the failure drill. |
| 12 · Transition | 1 min | Leave the deck. Show actual requests/responses and source, not screenshots as correctness proof. |

### Detail for the presenter, not the screen

The deck exports per-slide speaker notes with primary-source links. Read [Workshop claims and sources](docs/research.md), including the second-pass audit and complete major-change map. The story is now **familiar assistant → one return → choose access → reuse rules → design tools → operate safely → demonstrate**. Returns Desk moves to slide 3; the separate decision matrix is folded into slide 4. Contracts precede the primitive vocabulary. Only slides 9–10 focus on new protocol mechanics; slide 11 connects them to application reliability. The total stays 25/60/5.

The quotations on slides 2–3 are illustrative, not testimonials. The slide 3 receipt depicts the real ORD-001 fixture, not an application screenshot. Notion and GitHub are real integration/catalog examples, not evidence that those services or every named host supports 2026-07-28. Before the room opens, check the particular host/version/auth/elicitation combination. No demo claim depends on an unverified client supporting the latest spec.

For slide 9, keep the release distinctions precise:

| Newly defaulted in v2 | Supported before v2 | Not implemented in this workshop |
| --- | --- | --- |
| Omitted config selects 2026-07-28: stateless HTTP, replay-based elicitation and modern subscriptions | Tools, resources, prompts, workflow tools and Streamable HTTP; native 2026 behavior was opt-in | Tasks, sampling, completions, roots and a production OAuth authorization server |

The modern HTTP leg is pinned and does not need a `server/discover` probe; servers must implement discovery, but clients may choose to call it. The auto-negotiated stdio leg shows that probe. Slide 10 previews MRTR and `subscriptions/listen`; the live demonstration supplies actual envelopes. Trace metadata, cache hints, removed methods and the tasks extension belong in the notes/extension, not another setup slide. Use the nine-change map in `docs/research.md` for precise requirements and proof limits.

On slide 11, distinguish **new JSON-RPC request ID** from **same application idempotency key**. A broken stream no longer resumes from an SSE event ID, but loss of the response does not tell you whether a write committed. The slide is a design question: our tests cover replay, concurrency and preflight cancellation, not a deliberately dropped post-commit response or durable multi-instance recovery. Do not present those as tested. SSE remains the framing for modern streamed responses; the deprecated standalone HTTP+SSE transport is a different concept.

Slide 12 is only the transition. Show `structuredContent: 80` from the real wire capture, and `abortedWrites: 0`, `concurrentRetries: 12`, `committedWrites: 1` from the real failure drill when those chapters run. Do not read a protocol excerpt before the audience has seen the application.

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
- **Expected:** six tools including generated `run_processReturnWorkflow` and live-event wrapper `processReturnWithProgress`, policy resource, order template, reply prompt; authorized order read. Registry curl asserts modern 2026-07-28 and explicit legacy 2025-11-25.
- **Teaching point:** descriptions and schemas are the product interface. `callApi` is test-only and absent. Resources are not executable tools; prompt invocation is optional.
- **Host chapter:** run `pnpm serve` in a dedicated terminal. In another, `source .runtime/server.env`. Follow `docs/client-setup.md` exactly for Inspector UI / Cursor. Open Studio's MCP list and inspect both registered servers. This is a human checkpoint, not a claim that Cursor automation ran.
- **Fallback:** programmatic client + Inspector CLI output. If signed-in Cursor is unavailable, skip its mutation; never burn wire/failure time troubleshooting login.
- **Cleanup:** disconnect Cursor, stop `pnpm serve` with Ctrl-C. Its env file is removed.

### 3. Workflow-backed capability — 47:00–57:00 (10 min)

- **State:** fresh ORD-001, not the order already mutated by a host.
- **Command:** `pnpm demo:workflow`.
- **Expected:** generated workflow result lists `eligibility`, `draft`, `completion`; the `processReturnWithProgress` wrapper then emits actual `WORKFLOW LOG` and `WORKFLOW PROGRESS` events (1/3 through 3/3), followed by the order resource now `returned`. The same idempotency key replays without another return.
- **Teaching point:** automatic workflow exposure returns the final execution path; it does not automatically translate step events to MCP. The narrow wrapper uses public `mcp.log`/`mcp.progress` helpers and an ephemeral application-owned reporter to expose each completed stage. The client opts into per-request logging and progress. Do not persist this callback across durable suspension. Both paths run the same workflow; interactive `createReturn` still owns high-value confirmation.
- **Fallback:** the real-HTTP workflow test in `tests/mcp-http.test.ts` and its asserted step path. Do not fabricate progress/log messages if a host doesn't display them.
- **Cleanup:** script disconnects and closes the server. Explain process-local storage on restart.

### 4. What modern changes on the wire — 57:00–74:00 (17 min)

- **State:** three isolated harness legs, modern overlay active (or released v2 at launch).
- **Command:** `pnpm demo:v2`.
- **Expected:** `V2 PROOF GREEN`; regenerated `.runtime/proof/modern.jsonl`, `legacy.jsonl`, `stdio.jsonl`.
- **Walkthrough, in story order:** (1) the order request needs no initialize/session header; locate version/capabilities in `_meta`; (2) the high-value return needs confirmation—locate `resultType: "input_required"`, `inputRequests`, the retry’s `inputResponses` and final `complete`; accepted confirmation plus replay writes once, decline/cancel write none; (3) the public policy changes—locate `subscriptions/listen`, its acknowledgment/subscription ID and update, then show unsubscribed delivery stops; (4) compare legacy session headers and stdio auto’s `server/discover` probe with the modern-pin rejection. Scalar `structuredContent: 80` and safe trace correlation are brief bonus observations, not new stories.
- **Teaching point:** the workflow’s earlier progress/log events belonged to its own request, not this subscription. Request logging requires an explicit `logLevel` opt-in. Only stdio auto demonstrates the opening probe here; HTTP is pinned. Spec-level changes and Mastra’s default adoption are different claims.
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
