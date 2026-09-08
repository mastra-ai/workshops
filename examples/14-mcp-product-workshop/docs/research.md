# Workshop claims and sources

Research checked 2026-09-08. This is the evidence behind the presentation, not extra slides. Sources are also linked in the deck’s per-slide speaker notes.

## Second-pass audit: change the story, not just the wording

The previous pass improved factual qualifications but kept an abstract sequence: debate → decision matrix → architecture → vocabulary → product. Returns Desk arrived on slide 11, after the audience had already been asked to reason about it. The decision matrix repeated the comparison, while the single modern slide understated the practical interaction changes. The production slide listed responsibilities without giving the audience a failure to reason about.

The revised spine is **familiar assistant → one return → choose access → reuse rules → design tools → operate safely → demonstrate**:

- Bring Returns Desk forward to slide 3. Every subsequent example answers “Can I return this order?”
- Fold the decision lab into the CLI/MCP comparison. Ask what the actual host can run and authorize, not which interface is fashionable.
- Explain a useful return tool before naming the protocol primitives. Use the policy and optional reply prompt to introduce the other shapes.
- Limit new-spec setup to two slides: self-contained requests, then confirmation/change delivery. The next slide asks what happens when a response is lost; this motivates application idempotency rather than another protocol lecture.
- Keep twelve setup slides plus optional questions, then one uninterrupted demo. No extra vendor-logo slide or nine-item changelog slide.

### Real-world evidence added in this pass

| Source | What it supports | What it does not establish |
| --- | --- | --- |
| [Notion: connect to MCP](https://developers.notion.com/guides/mcp/get-started-with-mcp) | A real product offers host-specific setup, OAuth authorization and access within the selected workspace. Its documented interactive-authorization requirement is a concrete deployment constraint. | Universal host compatibility, non-interactive automation support, or adoption of the 2026-07-28 revision. Verify current client behavior before presenting. |
| [GitHub: tool-specific configuration](https://github.blog/changelog/2025-12-10-the-github-mcp-server-adds-support-for-tool-specific-configuration-and-more) | GitHub reports that selecting two useful tools previously loaded toolsets totaling 27 tools; it added per-tool selection to reduce unnecessary context. Tool catalog design matters in deployed products. | A universal token saving, a requirement that every discovered tool enter every prompt, or proof that MCP is intrinsically inefficient. |
| [Zechner: what if you don’t need MCP?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp) | A practitioner demonstrates a small script/README interface for browser work, using code composition and on-demand instructions. A provisioned shell can be an excellent agent interface. | That all customers can install/run it, that every MCP integration has his measured overhead, or that MCP cannot be composed through code. |
| [Anthropic: code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) | Tools can load on demand and intermediate data can be filtered in code over MCP. Context strategy and transport choice are distinct. Sandboxing adds cost and responsibility. | A CLI-versus-MCP benchmark, automatic security, or a reason to add a code-mode runtime to our six-tool example. |

We cite vendor documentation for what that vendor does, not as independent proof of adoption or superiority. Notion’s connection guide—not a generated summary—is the source for its setup constraints.

## What counts as evidence here

- **Protocol facts:** the versioned MCP specification, especially the [2026-07-28 changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog), [base protocol](https://modelcontextprotocol.io/specification/2026-07-28/basic) and [maintainer release explanation](https://blog.modelcontextprotocol.io/posts/2026-07-28).
- **Implementation facts:** Mastra source/history and this example’s executable proofs. A specification requirement does not prove Mastra or a particular host implements it.
- **Practitioner findings:** observations from a specific implementation, not universal benchmarks.
- **Workshop recommendations:** our architectural judgment, not protocol requirements.
- **Product hypothesis:** Daniel’s coworker analogy and both illustrative questions. Neither is measured adoption evidence or a customer testimonial.

## Slide-by-slide grounding

| Slide | Claim / purpose | Evidence and qualification |
| --- | --- | --- |
| 1 · Cover | Make one capability available to an existing assistant. | Workshop objective. “MCP is so back!” is the event title, not a measured trend. |
| 2 · Coworkers | Users may prefer an assistant they know. | Product hypothesis. Validate with the intended users; an embedded experience may be preferable. |
| 3 · Returns Desk | Find an order, check rules, create one return. | `src/domain/service.ts` and the ORD-001 fixture. The card is a diagram, not a screenshot. This creates a return record, not a payment-provider refund. |
| 4 · CLI / MCP | Choose for the execution environment and available access. | Zechner, Anthropic and [Cloudflare Code Mode](https://blog.cloudflare.com/code-mode). CLI can call remote APIs; MCP can be local. Embedded agent when owning UX/reasoning, direct API for deterministic integration: our recommendations. |
| 5 · Boundary | Configured access; host reasoning and server authorization are distinct. | [MCP architecture](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture), Notion setup. Named hosts are possible destinations, not a verified modern-protocol compatibility matrix. |
| 6 · Shared service | Reuse business rules across adapters. | Application design recommendation. `src/domain/service.ts`, CLI, API and tools; `pnpm demo:surfaces`. Processes share code, not a database. |
| 7 · Contracts | Expose an understandable task with bounded results and actionable failures. | [Anthropic tool-writing guidance](https://www.anthropic.com/engineering/writing-tools-for-agents), GitHub catalog example, `tests/mcp-contract.test.ts`. Not a blanket ban on generic search/execute gateways. |
| 8 · Primitives | Tools, resources and prompts serve different interaction roles. | [Server concepts](https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts), [tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools). Model-selected/app-managed/user-invoked are intended patterns, not mandatory UI. Tools can read; workflows are behavior behind tools. |
| 9 · Independent requests | No initialize/session ID; version and capabilities travel per request. | Changelog; `pnpm demo:v2`. Less session coordination, not no business state. Legacy diagram describes our server, not a universal requirement of older HTTP implementations. |
| 10 · Interaction | MRTR asks for input through a result/retry; changes have a separate opted-in stream. | Changelog/base protocol; modern JSONL and workflow progress demo. Public policy updates only. Progress/logs belong to their request, not the subscription. |
| 11 · Lost response | A new request ID is not a new business operation. | Changelog’s removal of stream resumption; application idempotency reasoning. Failure/replay/concurrency tests cover one in-memory write, NOT a dropped post-commit response or durable distributed recovery. |
| 12–13 · Demo / close | Demonstrate the task, then test its boundaries. | Existing demo scripts and proof fixtures. Signed-in host task completion and human rehearsal remain separate gates. |

## All nine major changes: consequence, placement, evidence

Source for every normative statement below: [2026-07-28 key changes](https://modelcontextprotocol.io/specification/2026-07-28/changelog). This table is presenter/reference material, not a slide. “Wire observation” means the relevant fields appear in the captured exchange; it is not a claim of exhaustive conformance testing.

| Change | Practical consequence | Where taught / what is proven |
| --- | --- | --- |
| **1. Sessions removed (SEP-2567).** No `Mcp-Session-Id`; list endpoints cannot vary per connection. Cross-call state uses explicit server-minted handles as ordinary tool arguments. | Do not rely on an initialized connection to remember a selected workspace or draft. Authorize explicit handles; a connection-independent catalog is not permission to expose private content. Business state and credentials still matter. | Slide 9; HTTP proof asserts no session header. Handle design and catalog migration are discussion, not new workshop features. The caller’s idempotency key is application logic, not an implementation of server-minted handles. |
| **2. Handshake removed (SEP-2575).** Each request requires `_meta` protocolVersion and clientCapabilities. ClientInfo and result serverInfo SHOULD identify parties; mismatches return `UnsupportedProtocolVersionError`. | Requests can be routed without protocol-session affinity. Still coordinate shared application data and verify authorization each time. | Slide 9; inspect modern request metadata and modern-pin rejection. The SDK exposes its typed negotiation failure; distinguish it from the wire error name. No live multi-replica routing proof. |
| **3. `server/discover` added (SEP-2575).** Servers MUST implement it; clients MAY invoke it for selection or stdio compatibility probing. | Discovery is supported, not a mandatory replacement handshake. | Slide 9 notes; stdio auto captures the opening probe. Pinned modern HTTP needs no opening probe. |
| **4. Change notifications move (SEP-2575).** `subscriptions/listen` replaces the GET endpoint and resource subscribe/unsubscribe calls. One long-lived POST-response stream has explicit notification-type opt-ins, acknowledgement and subscriptionId tagging. | Separate background catalog/resource changes from progress of a call. Subscriptions still consume live-stream resources despite stateless protocol requests. | Slide 10; public-policy listen/update/unsubscribe proof. Workflow progress/logs stay on the originating request. No sensitive order broadcasts: URI membership did not establish authorization. |
| **5. Methods removed (SEP-2575).** `ping`, `logging/setLevel`, `notifications/roots/list_changed` removed. Logs require request `_meta` logLevel; without it, servers MUST NOT emit `notifications/message`. | Log preference is per request, not connection state. | Slide 10 notes and workflow demo’s explicit logging opt-in. Not a new negative conformance suite for every removed method or missing logLevel. |
| **6. Tasks become an official extension (SEP-2663).** `io.modelcontextprotocol/tasks` uses `tasks/get` polling and `tasks/update` input; removes blocking `tasks/result` and `tasks/list`; permits unsolicited task handles. | Core MCP and long-running task extension support must be checked separately. | Optional migration discussion only. Not implemented or demonstrated here; a Mastra workflow is not proof of MCP Tasks extension support. |
| **7. MRTR (SEP-2322).** `InputRequiredResult` with `inputRequests`; client retries the original request with `inputResponses`. | An interaction may replay execution. Put writes after accepted confirmation and enforce application idempotency. | Slide 10; high-value confirmation, decline/cancel and replay with exact mutation-count assertions. |
| **8. Required `resultType` (SEP-2322).** Ordinary results are `complete`, interim MRTR results `input_required`; absent field from an earlier-protocol server means `complete`. | A result envelope is not necessarily a finished operation. | Slide 10; locate fields in modern JSONL. Earlier-protocol omission behavior is a specification compatibility rule, not a claim every legacy fixture omits the field. |
| **9. Stream resumption removed (SEP-2575).** No SSE event IDs, `Last-Event-ID` or redelivery. Broken in-flight responses require reissuing with a new request ID. | A lost response leaves application outcome uncertain. For the same intended operation, retain its business idempotency key and reconcile safely. Reauthorize retries. | Slide 11 design question. Existing retry/concurrency tests prove one in-memory return; they do not deliberately sever a post-commit response or prove durable recovery. |

**SSE precision:** modern POST responses can still use SSE framing. Removing GET subscription delivery and resumability is not removal of response streaming. The separately deprecated legacy HTTP+SSE transport is not the recommended participant transport.

**Novelty precision:** the spec revision, Mastra’s support for it, and the v2 default are different events. [Mastra #20929](https://github.com/mastra-ai/mastra/pull/20929) and [#20931](https://github.com/mastra-ai/mastra/pull/20931) establish pre-v2 opt-in behavior. Our v2 build remains local/unmerged at research time; do not imply registry release or host-wide adoption.

## Give the CLI argument its strongest version

Zechner’s browser example replaces broad catalogs with scripts whose README is read when needed. The agent invokes commands and composes/filters outputs in code. That is a concrete argument about tool scope, context use and engineering simplicity where a shell is available—not proof that every product should distribute a CLI.

The counterpoint is not “MCP is enterprise-grade.” Anthropic and Cloudflare demonstrate code execution **over MCP** with on-demand definitions and intermediate processing outside model context. MCP does not require every definition or result to appear in every prompt. Code execution also needs sandboxing, resource limits, credential isolation and authorization. A large catalog may justify it; this workshop does not need another runtime.

Ask: an agent must filter 500 orders and create three returns. Must all 500 records enter model context? A shell pipeline, a scoped code-execution API or focused server-side search can reduce the data. Choose based on what the model needs and the environment available.

### Benchmark hygiene

- Zechner’s counts/context percentages describe his browser setup in 2025.
- Anthropic’s 150,000 → 2,000 token example is not CLI versus MCP; both paths use MCP.
- Do not repeat secondary “32× cheaper,” “35× fewer tokens,” “96–99% savings” or monthly-cost claims without reproducing task, model, catalog, cache and accounting conditions.
- Prompt caching changes economics. [Client best practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices) discusses catalog stability and caching; discovering a tool is not necessarily injecting it into every prompt.

## Safety and evidence boundaries

Host consent, server authorization and high-value confirmation are separate decisions. Use HTTPS and suitable OAuth for protected public HTTP deployment; local bearer fixtures teach only a boundary. Validate token audience, scope access by tenant/operation and never pass inbound bearer tokens to unrelated upstream APIs. See [authorization security](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations).

Schemas validate shape, not tool usefulness or prompt-injection resistance. Evaluate selection, correct identifiers, recovery and task completion with the intended host. The deterministic suite proves contracts and side effects, not general model success. Cancellation cannot undo a committed transaction; an in-memory idempotency map is not durable production storage. These limitations stay explicit even when the scripted demos are green.

## Revision verification

This narrative-only revision passed a targeted `tsc --noEmit` check and `pnpm build` from `open-slide/`. The existing local deck-proof script regenerated all 13 pages at 1920×1080, checked text overflow/image loading and reduced motion, and produced the contact sheets used for visual review of every slide. Local evidence remains under `.mastracode/proof/mcp-product-workshop/` at repository root (`deck-01.png` through `deck-13.png`, `deck-check.json`, `review-*.png`).

`pnpm demo:v2` and `pnpm demo:workflow` were rerun successfully against the local v2 overlay. The committed modern JSONL contains every field called out in the new walkthrough: `input_required`, `inputRequests`, `inputResponses`, `complete`, subscription ID, protocol version and client capabilities. No application code or protocol fixtures were changed. This is not a new registry-only release proof or a completed human host check.
