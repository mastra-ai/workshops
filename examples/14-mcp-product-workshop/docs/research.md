# Workshop claims and sources

Research checked 2026-09-08. This is the evidence behind the presentation, not extra slides. Sources are also linked in the deck’s per-slide speaker notes.

## What counts as evidence here

- **Protocol facts:** the versioned MCP specification and its maintainers’ release explanation.
- **Implementation facts:** Mastra source/history and this example’s executable proofs. Specification support does not imply Mastra or every host implements it.
- **Practitioner findings:** useful observations from a specific implementation, not universal benchmarks.
- **Workshop recommendations:** our architectural judgment, stated as recommendations rather than protocol requirements.
- **Product hypothesis:** Daniel’s “agents are like coworkers” analogy and the illustrative customer question. Neither is a measured adoption claim or a customer testimonial.

## Slide-by-slide grounding

| Slide | What we can say | Evidence and qualification |
| --- | --- | --- |
| 1 · Cover | Build capabilities for an existing host instead of requiring a new assistant. | Workshop objective. “MCP is so back!” is the event title, not a measured adoption trend. |
| 2 · Coworkers | Users may prefer an assistant they already know. | Product hypothesis to discuss with the audience, not a universal claim about nontechnical users. The quotation is illustrative. |
| 3 · CLI / MCP | Agents use CLIs; shell composition and on-demand help are useful. MCP can also sit underneath code execution. | [Zechner’s browser-tool example](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp), [Anthropic code execution](https://www.anthropic.com/engineering/code-execution-with-mcp), [Cloudflare Code Mode](https://blog.cloudflare.com/code-mode). Separate the integration protocol from what enters model context. |
| 4 · Choice | Choose based on execution environment, host compatibility, ownership and permissions. | Our recommendation, informed by [MCP architecture](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture). CLI can call remote services; MCP can run locally. None of these choices is restricted to a demographic. |
| 5 · Boundary | A host coordinates clients; servers expose capabilities. Host consent and server authorization have distinct responsibilities. | [Architecture](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture), [tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools). MCP does not make a server automatically visible to all assistants or guarantee host feature parity. |
| 6 · Shared service | Keep business rules in a shared service, not duplicated across adapters. | Application design recommendation. Inspect `src/domain/service.ts`, `src/cli.ts`, `src/mastra/api/returns.ts`, and `src/mastra/tools/`; run `pnpm demo:surfaces`. These processes share code, not a database. |
| 7 · Primitives | Tools are model-selected, resources app-managed, prompts user-invoked in the intended interaction model. | [Server concepts](https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts) and [tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools). The specification permits other UI patterns. Read-only tools exist. Workflows are application behavior behind tools, not a fourth MCP primitive. |
| 8 · Contracts | Use clear inputs, bounded useful results and actionable errors; evaluate on realistic tasks. | [Writing effective tools](https://www.anthropic.com/engineering/writing-tools-for-agents). Our bounded return tool reduces API knowledge required for this task. This is not a blanket ban on generic search/execute gateways. |
| 9 · Modern | The 2026-07-28 spec removes protocol sessions. Our Mastra v2 build makes modern behavior the default. | [Maintainer release explanation](https://blog.modelcontextprotocol.io/posts/2026-07-28), pre-v2 opt-in support in [Mastra #20929](https://github.com/mastra-ai/mastra/pull/20929) and [#20931](https://github.com/mastra-ai/mastra/pull/20931), plus `pnpm demo:v2`. The legacy diagram is our server’s behavior, not a universal requirement of older HTTP servers. v2 remains unmerged/unpublished at research time. |
| 10 · Safety | Authenticate, authorize, confirm and deduplicate at the appropriate boundaries. | [Authorization security](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations), [client best practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices), `pnpm demo:failures`. OAuth does not implement tenant business rules. Idempotency is application logic, not an MCP exactly-once promise. |
| 11–13 · Demo / close | Show a specific implementation and its limits. | ORD-001 is a deterministic fixture, not a commerce screenshot. The proofs establish contracts and failure behavior, not general agent task success. Signed-in host and human rehearsal checks remain separate. |

## Give the CLI argument its strongest version

Zechner’s November 2025 example replaces broad browser MCP tool catalogs with a few scripts. The agent reads their README when needed, invokes commands, and composes or filters outputs in code. That is a concrete argument about tool scope, context use and engineering simplicity in an environment with shell access—not proof that every product should distribute a CLI.

The important counterpoint is not “MCP is enterprise-grade.” Anthropic and Cloudflare demonstrate code execution **over MCP**: load definitions when needed and process intermediate data outside the model context. The same principle can be implemented at different layers. MCP does not require every discovered tool definition or intermediate result to be placed in every model prompt.

Code execution also has costs: a sandbox, resource limits, credential isolation and authorization on individual calls. A large catalog may justify this; six bounded workshop tools do not require adding a code-mode runtime to the lesson.

### A concrete question for the room

An agent must filter 500 orders and create three returns. Should all 500 records pass through the model? A shell pipeline, a scoped code-execution API, or a focused server-side search can reduce that data. Ask what information the model actually needs, then choose the interface. Do not assume the transport determines context efficiency.

### Benchmark hygiene

- Zechner’s tool counts and context percentages are observations about particular browser tools and a particular setup in 2025.
- Anthropic reports 150,000 → 2,000 tokens in its code-execution example. That is not a CLI-versus-MCP benchmark; both paths use MCP.
- Do not use secondary “32× cheaper,” “35× fewer tokens,” “96–99% savings,” or monthly-cost claims without reproducing their task, model, catalog, caching and accounting conditions.
- Prompt caching changes the economics of catalog loading. Dynamic tool lists can invalidate cached prefixes; the current [client best practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices) explicitly discusses this tradeoff.

## Teaching points to keep out of slogans

**Discovery:** `tools/list` describes configured server capabilities. It is not automatic global product discovery. Hosts vary in transports, auth flows, resource/prompt UX and modern-protocol support.

**Tool quality:** a schema validates shape, not usefulness. Test whether the agent selects the right operation, supplies identifiers, recovers from errors and completes the task. Our deterministic suite is necessary but does not measure those model-dependent outcomes.

**Stateless:** self-describing requests remove protocol-session routing constraints. Shared business data, idempotency records and long-lived subscription streams still have operational requirements. Do not conflate HTTP response streaming with deprecated legacy SSE transport.

**Security:** host approval is not business authorization; confirmation is not authorization either. Validate token audience, scope access by tenant and operation, treat external tool content as untrusted, and keep credentials out of generated code/logs. Neither shell access nor an MCP schema is a security guarantee.

**Novelty:** the MCP specification revision, Mastra’s support for it, and Mastra’s default selection are three different events. Teach the actual wire behavior, and use the local-overlay release caveat until the registry-only gate passes.
