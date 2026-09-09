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
| 1 · Cover + hosts | 1 min | Daniel Lew and Alex Booker. Four promises: choose an experience, design reliable tools, connect an agent, understand modern deployment. |
| 2 · Coworkers | 2 min | Another agent is another collaborator to learn. Does the user want your guided experience or their familiar assistant? Not a universal preference. |
| 3 · Embedded agent / MCP | 3 min | Compare owning UI/model/behavior with exposing capabilities to another host. Both require authorization and evaluation. Who should own the experience? |
| 4 · Users and team | 2 min | Daniel/Shane example: internal support agent plus external MCP. Reverse the audiences to test the reasoning. Team expertise affects what you can maintain, not a fixed technology ranking. |
| 5 · Shared capabilities / CLI | 2 min | Both can reuse the same business service through Mastra. Shell users or agents may prefer CLI help/pipes; compatible hosts may prefer MCP discovery. Direct APIs remain useful. No universal token comparison. |
| 6 · Descriptions + schemas | 3 min | Introduce Returns Desk as the example. When should createReturn be selected? What does it change? Inspect ID format, enum values and key length. Contrast callApi; do not teach every endpoint as a tool. |
| 7 · Outputs + errors | 3 min | What happened, and what should the agent do next? Explain result IDs/units, correction versus retry versus stop. Actual domain excerpts, not fabricated wire envelopes. |
| 8 · Expose the pieces | 2 min | Tools execute, resources supply content, workflows run behind a tool. Prompts are optional. Show registration in the demo. |
| 9 · Connect and evaluate | 2 min | Connect/authenticate, discover, then try a real task. Judge tool selection, inputs and recovery—not just a green connection indicator. Host compatibility must be checked. |
| 10 · Deployment | 2 min | Independent requests remove protocol-session affinity, a simpler fit for serverless. Business data still needs storage; streams still have runtime limits. No claim of a deployed serverless benchmark. |
| 11 · Interaction | 2 min | Request → needs confirmation → answer → complete. No protocol session to keep alive while the user decides. Authorization and confirmation remain application responsibilities. |
| 12 · Transition | 1 min | Leave slides for one continuous build/demo. Returns Desk is the worked example, not the workshop subject. |

### Detail for the presenter, not the screen

The story follows the event promises: **choose the experience → design capabilities agents can use → connect them → understand how to run it**. Daniel’s coworker insight motivates the embedded-agent/MCP choice. Internal versus external and technical versus nontechnical are questions to investigate, not fixed rules. An embedded agent can be ideal for nontechnical customers; internal engineers may already prefer Cursor. Team capability changes the operational work you can support: agent behavior/evaluations, tool quality, authorization and client compatibility.

The deck exports source-linked notes. [Workshop claims and sources](docs/research.md) retains the primary evidence and all nine spec changes as reference. Only slides 10–11 explain protocol changes. Subscriptions, discovery, request logging and retries stay in the live chapters or extension. Notion and GitHub illustrate real setup/catalog concerns, not universal host support or July-spec adoption.

For slide 10, keep the release distinctions precise:

| Newly defaulted in v2 | Supported before v2 | Not implemented in this workshop |
| --- | --- | --- |
| Omitted config selects 2026-07-28: stateless HTTP, replay-based elicitation and modern subscriptions | Tools, resources, prompts, workflow tools and Streamable HTTP; native 2026 behavior was opt-in | Tasks, sampling, completions, roots and a production OAuth authorization server |

On slide 7, the success fields come from `returnSchema`; the error wording comes from `ReturnsService.authorizedOrder`. MCP schema validation can reject malformed input before that domain error. The slide does not promise an identical REST/MCP error envelope. Ineligible creation currently reports `INELIGIBLE` / `EXPIRED`; use eligibility and policy to explain the 30-day limit, and discuss that terse message as an improvement opportunity rather than pretending it is ideal. Keep sensitive internal errors redacted. A return record is not a real payment-provider refund.

On slide 9, distinguish an SDK invoking a known tool from an agent selecting the right tool. Inspector/programmatic checks are deterministic; signed-in Cursor task execution remains a human check. Ask the host to look up an order, check eligibility and explain the outcome before mutating. Inspect its actual choices; do not invent a successful host transcript.

On slide 11, teach only confirmation. During the wire chapter, separately show the public-policy `subscriptions/listen` stream. Workflow progress/logs belong to their request, not that subscription. `server/discover` is required on servers but optional for clients; only our stdio auto leg shows the opening probe. Modern POST responses can still use SSE framing.

During the failure chapter, discuss a lost response: a **new JSON-RPC request ID** is not a **new business operation**. Keep the business idempotency key. Existing tests cover replay/concurrency and preflight cancellation, not a dropped post-commit response or durable multi-instance recovery. This is no longer a setup slide. Show the real failure summary at that point, not before the audience sees the application.

## Continuous live demo: 25:00–85:00

For each chapter below: run `pnpm reset` first. Do not restart a manually running interactive server behind Cursor without reconnecting the host.

### 1. One product, multiple surfaces — 25:00–33:00 (8 min)

- **State:** fresh fixtures, no external host required.
- **Command:** `pnpm demo:surfaces`.
- **Expected:** REST and CLI agree on ORD-001 (4900 cents, delivered). Show `src/domain/service.ts`, `src/cli.ts`, `src/mastra/api/returns.ts`, then the thin MCP read tool.
- **Teaching point:** same code and policy, not duplicated business rules. Each process has independent fixture state.
- **Fallback:** run `RETURNS_TENANT=north pnpm exec tsx src/cli.ts get ORD-001`; inspect API test assertions.
- **Cleanup:** script closes its owned server. No manual deletion needed.

### 2. Tool design, discovery and real hosts — 33:00–55:00 (22 min)

- **State:** fresh fixtures; Inspector package cached; signed-in Cursor only for optional human demonstration.
- **Commands:** `pnpm demo:discover`, then `pnpm demo:inspector`.
- **Expected:** six tools including generated `run_processReturnWorkflow` and live-event wrapper `processReturnWithProgress`, policy resource, order template, reply prompt; authorized order read. Registry curl asserts modern 2026-07-28 and explicit legacy 2025-11-25.
- **Contract lab (8 min):** inspect `src/mastra/tools/mutations.ts` and `src/domain/schemas.ts`. Ask when the agent should select createReturn, which values it must supply, what changes and what it receives. Compare the test-only `callApi` contract. Show the actual return result and safe-error mapping; explain why field names, units and actionable errors matter. Do not add the broad tool to the server.
- **Discovery + host (14 min):** run the two client scripts, inspect tool/resource/workflow registration, then follow the host chapter. Ask for an order lookup and eligibility explanation; inspect selection/arguments/results before the bounded mutation. If it chooses poorly, identify the missing description/schema/output information rather than silently retrying until success.
- **Teaching point:** connection success is necessary, not sufficient. Schema tests prove deterministic contracts, not model task success. Resources are content; prompts are optional. Host behavior must be observed, not inferred from the SDK test.
- **Host chapter:** run `pnpm serve` in a dedicated terminal. In another, `source .runtime/server.env`. Follow `docs/client-setup.md` exactly for Inspector UI / Cursor. Open Studio's MCP list and inspect both registered servers. This is a human checkpoint, not a claim that Cursor automation ran.
- **Fallback:** programmatic client + Inspector CLI output. If signed-in Cursor is unavailable, skip its mutation; never burn wire/failure time troubleshooting login.
- **Cleanup:** disconnect Cursor, stop `pnpm serve` with Ctrl-C. Its env file is removed.

### 3. Workflow-backed capability — 55:00–65:00 (10 min)

- **State:** fresh ORD-001, not the order already mutated by a host.
- **Command:** `pnpm demo:workflow`.
- **Expected:** generated workflow result lists `eligibility`, `draft`, `completion`; the `processReturnWithProgress` wrapper then emits actual `WORKFLOW LOG` and `WORKFLOW PROGRESS` events (1/3 through 3/3), followed by the order resource now `returned`. The same idempotency key replays without another return.
- **Teaching point:** automatic workflow exposure returns the final execution path; it does not automatically translate step events to MCP. The narrow wrapper uses public `mcp.log`/`mcp.progress` helpers and an ephemeral application-owned reporter to expose each completed stage. The client opts into per-request logging and progress. Do not persist this callback across durable suspension. Both paths run the same workflow; interactive `createReturn` still owns high-value confirmation.
- **Fallback:** the real-HTTP workflow test in `tests/mcp-http.test.ts` and its asserted step path. Do not fabricate progress/log messages if a host doesn't display them.
- **Cleanup:** script disconnects and closes the server. Explain process-local storage on restart.

### 4. What modern changes on the wire — 65:00–75:00 (10 min)

- **State:** three isolated harness legs, modern overlay active (or released v2 at launch).
- **Command:** `pnpm demo:v2`.
- **Expected:** `V2 PROOF GREEN`; regenerated `.runtime/proof/modern.jsonl`, `legacy.jsonl`, `stdio.jsonl`.
- **Walkthrough, in story order:** (1) the order request needs no initialize/session header; locate version/capabilities in `_meta`; (2) the high-value return needs confirmation—locate `resultType: "input_required"`, `inputRequests`, the retry’s `inputResponses` and final `complete`; accepted confirmation plus replay writes once, decline/cancel write none; (3) the public policy changes—locate `subscriptions/listen`, its acknowledgment/subscription ID and update, then show unsubscribed delivery stops; (4) compare legacy session headers and stdio auto’s `server/discover` probe with the modern-pin rejection. Scalar `structuredContent: 80` and safe trace correlation are brief bonus observations, not new stories.
- **Teaching point:** the workflow’s earlier progress/log events belonged to its own request, not this subscription. Request logging requires an explicit `logLevel` opt-in. Only stdio auto demonstrates the opening probe here; HTTP is pinned. Spec-level changes and Mastra’s default adoption are different claims.
- **Fallback:** committed sanitized `proof/expected/` plus `proof/phase-4.md`; identify it as recorded evidence, never a live run.
- **Cleanup:** harness closes streams/transports/listeners in finally; no persistent app state.

### 5. Production failure drill — 75:00–85:00 (10 min)

- **State:** fresh fixtures; no public fault-injection endpoint.
- **Command:** `pnpm demo:failures`.
- **Expected:** 401 missing token, 403 wrong tenant, 400 malformed input, 409 conflicting key; identical retries return the same result. Injected dependency error is redacted; an actual in-flight abort stops preflight with zero writes; twelve concurrent retries yield one write.
- **Teaching point:** domain authorization, post-confirmation writes and durable idempotency—not the model—enforce safety. The injected loopback adapter is test infrastructure, not a deployable auth server. Cancellation cannot reverse an already committed transaction.
- **Fallback:** `proof/phase-5.md`; explain both the positive and negative assertions.
- **Cleanup:** restore dependency implementation, disconnect, close all listeners. Tests run this twice and require natural process exit.

## Recap: 85:00–90:00

Optional slide 13. Ask participants which users they serve, which experience fits, which capability to expose, and which failure their agent should handle. Point to the five-minute README path. Collect questions. Do not claim release readiness while the release checklist remains open.

**If time is lost:** drop the optional reply prompt and live Cursor mutation first. Shorten source browsing next. **Never drop modern wire proof or the production failure drill.**

## Optional extension: +30 minutes

| Budget | Topic / source | Exercise / expected result |
| --- | --- | --- |
| 8 min | Workflow depth: `src/mastra/workflows/returns.ts` | Explain high-value rejection, step contracts and why durable storage matters. Discuss progress/log emission separately from the returned step path. |
| 7 min | Cache / trace: `src/mastra/mcp/index.ts`, `proof/expected/modern.jsonl` | Locate policy cache hints and trace metadata. No mutable-order cache hints; only safe trace ID returned. |
| 8 min | OAuth / CIMD: `docs/production.md` | Diagram host → authorization server → access token → resource server → domain authorization. CIMD vs DCR concerns client registration, not user/tenant permission. |
| 7 min | Migration: modern vs legacy JSONL | Pin 2025-11-25 deliberately, inventory session-dependent features, then migrate a host. Do not recommend SSE as the new deployment path. |

Extension cleanup is the same as the core: stop only owned processes and reconnect hosts after restart. No OAuth server or unimplemented protocol feature is silently added to the lab.
