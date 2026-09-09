# Workshop claims and sources

Research checked 2026-09-08. This is the evidence behind the presentation, not extra slides. Sources are also linked in the deck’s per-slide speaker notes.

## Recenter on the event promise (2026-09-09)

The last revision over-weighted protocol mechanics and failures while compressing the event’s first promise—embedded agent versus MCP—into a CLI comparison. Moving the application earlier did not fix that imbalance. Daniel approved this new spine: **choose the experience → design capabilities agents can use → connect them → understand how to run it**.

- Give embedded agent versus MCP an explicit comparison: product-owned experience versus capabilities in an existing assistant. Daniel’s coworker-learning-curve insight explains why that choice matters.
- Present Daniel and Shane’s internal-agent/external-MCP arrangement as one possible “both,” not a rule about technical users. Ask what users prefer and what the team can support.
- Keep CLI as a supporting option where installed commands, shell composition and help fit the environment. Share domain code across interfaces; Mastra can support both agent and MCP approaches.
- Teach descriptions/schema and outputs/errors on separate slides using actual domain contracts. A syntactically valid response does not prove the agent knows its next step.
- Teach tools/resources/workflows, then connection and evaluation in the intended host. Do not equate SDK invocation with successful agent selection.
- Two setup slides explain deployment and interactive confirmation. Subscription/discovery details and the lost-response/idempotency discussion move to the continuous demo. The complete change map remains below for presenter accuracy.

### Coverage against the advertised event

| Promise | Setup | Live practice |
| --- | --- | --- |
| Embedded agent vs MCP | Slides 2–5: learning curve, ownership, audiences, team capability, both and CLI | Shared business service; discuss which experience the intended users need |
| Descriptions, schemas, outputs, errors | Slides 6–7: purpose/limits, identifiers/values, useful results and next steps | Expanded contract/host chapter, including actual error limitations |
| Expose tools/workflows/resources; connect existing agents | Slides 8–9 | Registration, independent clients, workflow/resource read and signed-in host check |
| Stateless/serverless/interactive evolution | Slides 10–11 | Modern wire proof and confirmation; deployment benefit is explained, not claimed as a live serverless deployment |

### Real-world evidence retained from the research

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
- **Product hypothesis:** Daniel’s coworker analogy and the illustrative customer question. Neither is measured adoption evidence or a customer testimonial.

## Slide-by-slide grounding

| Slide | Claim / purpose | Evidence and qualification |
| --- | --- | --- |
| 1 · Cover | Four advertised outcomes, not a protocol survey | Event brief; title is not a measured adoption claim |
| 2 · Coworkers | Another agent has a learning curve | Daniel’s product insight; validate user preference, not a universal rule |
| 3 · Agent / MCP | Own the experience or expose capabilities to another host | [MCP architecture](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture); architectural recommendation, not a claim that one is inherently simpler |
| 4 · Users and team | Both can fit different audiences | Daniel/Shane scenario; audiences can be reversed. Team expertise affects maintenance and evaluation needs |
| 5 · Shared code / CLI | Reuse business capabilities; CLI can be a useful alternative | `demo:surfaces`, service/API/CLI/tools; Zechner and Anthropic evidence above. Shared code is not shared process memory |
| 6 · Description / schema | Explain selection, effects and valid input | [Anthropic tool guidance](https://www.anthropic.com/engineering/writing-tools-for-agents), actual `returnRequestSchema`; displayed contract is condensed, not full registration |
| 7 · Output / error | Provide facts and a useful next decision | Actual `returnSchema` and `ReturnsService.authorizedOrder` error. Domain excerpts, not identical cross-transport envelopes. Ineligibility prose remains terse; discuss improvement, do not pretend it is ideal |
| 8 · Primitives | Execute tools, read resources, expose workflow through a tool | [Server concepts](https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts), MCP registration and workflow. Prompts optional; control labels are intended patterns, not mandatory UI |
| 9 · Connect and evaluate | Test intended host behavior, not only connectivity | Notion setup, `docs/client-setup.md`; named hosts not a modern-protocol compatibility matrix. Cursor remains a human gate |
| 10 · Deployment | No protocol-session affinity; easier independent request routing | Versioned changelog, modern wire proof. No deployed serverless/multi-replica benchmark; storage and stream/runtime limits remain |
| 11 · Confirmation | Ask for input through a result and follow-up request | MRTR proof. Schematic single confirmation flow; demo may have multiple rounds. Subscriptions are a separate live chapter |
| 12–13 · Demo / close | Practice four promises in one continuous demo | FACILITATOR run sheet; deterministic scripts versus human checks explicitly separated |

## All nine major changes: consequence, placement, evidence

Source for every normative statement below: [2026-07-28 key changes](https://modelcontextprotocol.io/specification/2026-07-28/changelog). This table is presenter/reference material, not a slide. “Wire observation” means the relevant fields appear in the captured exchange; it is not a claim of exhaustive conformance testing.

| Change | Practical consequence | Where taught / what is proven |
| --- | --- | --- |
| **1. Sessions removed (SEP-2567).** No `Mcp-Session-Id`; list endpoints cannot vary per connection. Cross-call state uses explicit server-minted handles as ordinary tool arguments. | Do not rely on an initialized connection to remember a selected workspace or draft. Authorize explicit handles; a connection-independent catalog is not permission to expose private content. Business state and credentials still matter. | Slide 10; HTTP proof asserts no session header. Handle design and catalog migration are discussion, not new workshop features. The caller’s idempotency key is application logic, not an implementation of server-minted handles. |
| **2. Handshake removed (SEP-2575).** Each request requires `_meta` protocolVersion and clientCapabilities. ClientInfo and result serverInfo SHOULD identify parties; mismatches return `UnsupportedProtocolVersionError`. | Requests can be routed without protocol-session affinity. Still coordinate shared application data and verify authorization each time. | Slide 10; inspect modern request metadata and modern-pin rejection. The SDK exposes its typed negotiation failure; distinguish it from the wire error name. No live multi-replica routing proof. |
| **3. `server/discover` added (SEP-2575).** Servers MUST implement it; clients MAY invoke it for selection or stdio compatibility probing. | Discovery is supported, not a mandatory replacement handshake. | Slide 10 notes; stdio auto captures the opening probe. Pinned modern HTTP needs no opening probe. |
| **4. Change notifications move (SEP-2575).** `subscriptions/listen` replaces the GET endpoint and resource subscribe/unsubscribe calls. One long-lived POST-response stream has explicit notification-type opt-ins, acknowledgement and subscriptionId tagging. | Separate background catalog/resource changes from progress of a call. Subscriptions still consume live-stream resources despite stateless protocol requests. | Live wire chapter; public-policy listen/update/unsubscribe proof. Workflow progress/logs stay on the originating request. No sensitive order broadcasts: URI membership did not establish authorization. |
| **5. Methods removed (SEP-2575).** `ping`, `logging/setLevel`, `notifications/roots/list_changed` removed. Logs require request `_meta` logLevel; without it, servers MUST NOT emit `notifications/message`. | Log preference is per request, not connection state. | Workflow demo and reference notes; demo’s explicit logging opt-in. Not a new negative conformance suite for every removed method or missing logLevel. |
| **6. Tasks become an official extension (SEP-2663).** `io.modelcontextprotocol/tasks` uses `tasks/get` polling and `tasks/update` input; removes blocking `tasks/result` and `tasks/list`; permits unsolicited task handles. | Core MCP and long-running task extension support must be checked separately. | Optional migration discussion only. Not implemented or demonstrated here; a Mastra workflow is not proof of MCP Tasks extension support. |
| **7. MRTR (SEP-2322).** `InputRequiredResult` with `inputRequests`; client retries the original request with `inputResponses`. | An interaction may replay execution. Put writes after accepted confirmation and enforce application idempotency. | Slide 11; high-value confirmation, decline/cancel and replay with exact mutation-count assertions. |
| **8. Required `resultType` (SEP-2322).** Ordinary results are `complete`, interim MRTR results `input_required`; absent field from an earlier-protocol server means `complete`. | A result envelope is not necessarily a finished operation. | Slide 11; locate fields in modern JSONL. Earlier-protocol omission behavior is a specification compatibility rule, not a claim every legacy fixture omits the field. |
| **9. Stream resumption removed (SEP-2575).** No SSE event IDs, `Last-Event-ID` or redelivery. Broken in-flight responses require reissuing with a new request ID. | A lost response leaves application outcome uncertain. For the same intended operation, retain its business idempotency key and reconcile safely. Reauthorize retries. | Live failure chapter design question, not a setup slide. Existing retry/concurrency tests prove one in-memory return; they do not deliberately sever a post-commit response or prove durable recovery. |

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

## Previous revision verification (2026-09-08)

This narrative-only revision passed a targeted `tsc --noEmit` check and `pnpm build` from `open-slide/`. The existing local deck-proof script regenerated all 13 pages at 1920×1080, checked text overflow/image loading and reduced motion, and produced the contact sheets used for visual review of every slide. Local evidence remains under `.mastracode/proof/mcp-product-workshop/` at repository root (`deck-01.png` through `deck-13.png`, `deck-check.json`, `review-*.png`).

`pnpm demo:v2` and `pnpm demo:workflow` were rerun successfully against the local v2 overlay. The committed modern JSONL contains every field called out in the new walkthrough: `input_required`, `inputRequests`, `inputResponses`, `complete`, subscription ID, protocol version and client capabilities. No application code or protocol fixtures were changed. This is not a new registry-only release proof or a completed human host check.
