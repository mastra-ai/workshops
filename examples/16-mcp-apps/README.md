# Mastra MCP Apps examples

Three independent MCP servers, each defined in one file and imported into `src/mastra/index.ts`. Each serves its own self-contained interactive app; the chat host supplies the agent and the MCP Apps bridge.

| Example | Server definition | App source | What it demonstrates |
| --- | --- | --- | --- |
| Loan calculator | `src/mastra/mcp/loan-calculator.ts` | `src/apps/loan-calculator/` | Loan scenarios, agent Q&A, and a fictional sign-up flow |
| Tic-tac-toe | `src/mastra/mcp/tic-tac-toe.ts` | `src/apps/tic-tac-toe/` | Human/agent collaboration on shared, revision-checked state |
| Product metrics | `src/mastra/mcp/product-metrics.ts` | `src/apps/product-metrics/` | Full dashboard, compact metric cards, and sidebar entrypoint metadata |

No real loans, applications, analytics accounts, or customer data are involved.

## Run locally

Requires Node **22.13+**.

```sh
npm install
npm run dev
```

Mastra Studio runs at `http://localhost:4111`. Connect an **MCP Apps-capable host** to one or more of these HTTP MCP endpoints:

```text
http://localhost:4111/api/mcp/loan-calculator/mcp
http://localhost:4111/api/mcp/tic-tac-toe/mcp
http://localhost:4111/api/mcp/product-metrics/mcp
```

The route uses the server's `id`, not its registration key. Servers expose only their own tools. All tools are also registered at the top level in `src/mastra/index.ts` for inspection; registration alone does not give them to the unrelated starter agent.

The MCP tools and local browser preview need **no model API key**. Chatting with either Mastra agent requires `OPENAI_API_KEY` in `.env`.

### Chat with the MCP Apps agent

Set `OPENAI_API_KEY` in `.env` (see `.env.example`), run `npm run dev`, then open `http://localhost:4111/agents/mcp-apps-agent/threads/new`. Choose **MCP Apps Agent**, not the unrelated general-purpose **Agent**.

Try:

- **Calculator:** “Show me a loan calculator for $25,000 at 6.5% over 60 months.” Follow up with “What if I shorten it to 36 months?”
- **Game:** “Let's play tic-tac-toe. I'll be X and you be O.” Play X in the app; the agent reads the current board and plays O.
- **Dashboard:** “Open the product metrics dashboard for enterprise customers over 90 days.” Follow up with “Show retention as a compact card.”

`src/mastra/agents/mcp-apps-agent.ts` defines this agent using the same `openai/gpt-5.6-terra` model as the starter agent and simple conversation memory. Its `MCPClient` discovers tools over HTTP from all three registered servers. Discovery is deferred until the agent's tools are requested, so the server can finish starting before connecting to itself. Seven model-visible tools are exposed; fake-loan submission and human game moves remain app-only. Server IDs and app metadata are preserved for Studio resource lookup.

The default MCP origin is `http://localhost:4111`. If Mastra runs on another origin, set `MCP_BASE_URL` to that origin before startup; keep the three registered MCP routes available there. A separate browser UI is not added: Studio is the chat host, and each tool still serves its existing MCP App.

**Studio 1.33.0 limitation:** the installed host does not advertise app-to-chat messaging. If an app shows “Copy into chat,” paste the provided message into the chat composer. For tic-tac-toe, that message includes the current game ID and revision; the agent then plays O and the existing board updates. The same fallback applies to loan explanations and metric references. The local preview and other hosts that support messaging can deliver these messages directly.

The browser build uses the SDK's AJV validator via `scripts/mcp-browser-shim.mjs` because the default validator crashes when loaded in Studio's `blob:` frames. The shared app client also accepts Studio's JSON-text initial results and `{ result }` callback envelope. Tests cover these compatibility paths; server-side MCP validation is unchanged.

### Preview without a chat account

```sh
npm run preview
```

Open `http://127.0.0.1:4173`. This development-only harness uses real HTTP MCP tools and the official `AppBridge`, rendering the actual app resources in sandboxed frames. It shows app context and outgoing chat messages, supports light/dark themes and simulated message rejection, and includes:

- **Loan:** calculate, explain in chat, choose a fictional profile, review, confirm, and receive a fake receipt.
- **Game:** click as X, then use **Simulate agent move** in the host controls to choose O's move. The board discovers the change by polling; the host does not push that move into the iframe.
- **Metrics:** filter and select a KPI, reference it in chat, then use **Render referenced card in chat**. The compact card can reopen the full dashboard with the same filters.
- **Sidebar launch:** loads the dashboard without an initial tool result.

**The preview does not run an LLM or impersonate ChatGPT.** Its agent controls are manual simulations. A real MCP Apps host invokes the same server tools with its own agent. The preview binds only to loopback and rejects unexpected Host/Origin headers; do not deploy it as a production host.

## 1. Loan calculator

Tools:

- `calculate_loan`: principal in USD, fixed annual interest rate (not APR), and term in months. Returns monthly payment, totals, and yearly balances.
- `start_loan_application`: opens the fictional onboarding UI with the chosen scenario.
- `submit_demo_loan`: app-only action accepting just the canned `alex-demo` / `sam-demo` profile, purpose, and explicit simulation confirmation.

Try asking your chat host:

> Show me a loan calculator for $25,000 at 6.5% over 60 months.
>
> What happens if I shorten this to 36 months?

The app's **Explain this loan in chat** button sends the exact displayed estimate to the agent. Sign-up is a three-step local interaction backed by the demo tool; it creates no account, performs no credit check, and sends nothing to a lender. It never requests names, email addresses, income, or other personal information. Payments use fixed-rate monthly amortization and exclude fees, taxes, and insurance; totals are computed before display rounding.

## 2. Human vs agent tic-tac-toe

Tools:

- `new_game`: create a board; human X goes first.
- `get_game`: fetch authoritative state and revision.
- `play_human_move`: app-visible X action.
- `play_agent_move`: model-visible O action.

Try:

> Let's play tic-tac-toe. Open the board; I'll be X and you be O.

A human click calls `play_human_move`, then explicitly sends a user message containing the game ID, board, and revision. The agent is instructed to call `get_game`, choose an empty cell, and call `play_agent_move` with the current `expectedRevision`. The existing app polls every 1.5 seconds while active and playing, so it sees agent moves even if the host never forwards later tool results to the original iframe. Failed chat delivery can be retried without replaying the move.

Cells are row-major, `0 1 2 / 3 4 5 / 6 7 8`. The server validates turns, occupancy, finished games, and revisions. Games expire after one hour, are capped at 1,000, and are lost on process restart. This is intentionally a single-process demo, not an authenticated multiplayer service.

## 3. Product metrics dashboard

Tools:

- `show_dashboard`: six KPIs, trend charts, funnel, acquisition channels, and cohort retention; `period` is `30d` or `90d`, `segment` is `all`, `startups`, or `enterprise`.
- `show_metric`: one compact, interactive metric reference with the same filters and values. Metric IDs: `mrr`, `active_users`, `activation`, `retention`, `churn`, `nps`.

Try:

> Open the product metrics dashboard for enterprise customers over 90 days.
>
> Show retention as a card in this conversation and explain its trend.

Selecting a card updates model context without triggering a turn. **Reference this metric in chat** requests a response and includes the exact metric, period, and segment. **Compact card** switches the current app to a focused view; **Open full dashboard** preserves its filters. Fullscreen is offered only when the host advertises support.

All values are deterministic synthetic data for fictional **Orbit Analytics**, fixed at **October 7, 2026**. Definitions explain whether a metric is an end-of-period snapshot or a period average. Changes are relative percentages, not percentage-point differences. These examples do not infer causes from fake trends.

### ChatGPT sidebar / conversation panel

`show_dashboard` includes the OpenAI extension metadata alongside the standard MCP Apps UI metadata:

```ts
_meta: {
  ui: { resourceUri: 'ui://product-metrics/dashboard.html', visibility: ['model', 'app'] },
  'openai/ui': { entrypoints: [{ type: 'global' }, { type: 'thread' }] },
}
```

`global` requests a sidebar/fullscreen entry; `thread` requests a conversation panel. This is host-specific metadata, not a promise that every client can pin an app to its sidebar. The standard MCP Apps inline experience remains usable without the extension.

See the official [OpenAI extension documentation](https://developers.openai.com/plugins/build/extensions) and [connection guide](https://developers.openai.com/plugins/deploy/connect-chatgpt). A remote host needs a reachable HTTPS endpoint. If using a development tunnel or reverse proxy, expose **only the required `/api/mcp/<id>/mcp` routes**, not the whole starter Mastra server, whose unrelated agent has filesystem, shell, and scheduling capabilities. Do not put real data behind these unauthenticated demo endpoints.

The installed MCP stack is `@mastra/mcp` 2.x; protocol tests pin `2026-07-28`. Older clients that only implement earlier MCP transports may not connect. Local protocol, production endpoint, and browser bridge behavior are tested here; **live ChatGPT/Claude rendering and actual sidebar placement still require a connection test in those hosts**.

## How the pieces fit

1. Each server file defines its schemas, tools, instructions, and `appResources`.
2. Tool `mcp._meta.ui.resourceUri` points to an HTML resource served by that server.
3. Mastra uses each tool's `outputSchema` for structured results. The app renders `structuredContent`; Mastra also emits text content for the model.
4. App actions call `App.callServerTool` through the host, not directly over the network. UI-only state is not automatically visible to the agent: `updateModelContext` and `sendMessage` make sharing explicit.
5. `src/apps/shared/client.ts` contains only common bridge, theme, busy, and error handling. Each example owns its interaction logic.
6. `scripts/build-apps.mjs` bundles the Apps SDK and app TypeScript with esbuild, embeds shared CSS, and generates HTML string modules under `src/mastra/mcp/generated/`. There is no CDN, separate frontend server, or runtime HTML file path to resolve in production.

`dev`, `build`, `typecheck`, `test`, `test:ui`, and `preview` rebuild app assets first. Restart dev/preview after editing app HTML/CSS/TypeScript; this intentionally small build script is not an app-file watcher. Never edit generated modules.

App resources declare no external network or asset domains. Hosts control capabilities, theme, display modes, message delivery, and sandbox policy. The preview permits script execution and form events but blocks direct network connections and native form navigation. Unsupported chat delivery displays a copyable message instead of pretending it succeeded.

**Security boundary:** tool visibility is a host/UI hint, not authorization. UUID game IDs are not access control. Before adding real users or persistence, authenticate requests, authorize game/resource ownership on the server, add rate limiting, and use shared transactional storage for revision updates across instances. Keep fake loan onboarding fake unless you design a separate secure, compliant application service.

## Verify

```sh
npm run typecheck       # tsc --noEmit, including tests
npm test                # calculation + real HTTP MCP protocol tests
npx playwright install chromium  # once per environment
npm run test:ui         # browser flows, retries, context, themes, narrow layout
npm run build           # production Mastra build with embedded app HTML
npm run start           # leave running in one terminal
npm run test:smoke      # another terminal: all three registered production routes
```

Set `MASTRA_BASE_URL` for smoke-testing another running instance. The smoke test creates one temporary game but has no external side effects. There is no lint script configured.

Browser tests exercise the official bridge with actual MCP responses. They cover the fake sign-up, a complete game including rejected-message retry and agent polling, filtered dashboard references, compact-card expansion, sidebar-style startup, optional context/messaging capabilities, dark themes, and narrow screens. They are not substitutes for tests in each target chat host.

## Existing starter agent

The pre-existing general-purpose agent, scheduling tools, memory, LibSQL/DuckDB storage, and observability remain registered. `OPENAI_API_KEY` enables its model; optional `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` configure remote LibSQL storage. Its local workspace is `workspace/` relative to the running server (`src/mastra/public/workspace/` in dev). Shell commands are not OS-isolated by default; review approvals and do not expose that agent publicly. Recurring schedules consume model tokens until paused.

## Background

- `reference/index.html`: the supplied MCP Apps primer.
- [Mastra documentation](https://mastra.ai/llms.txt).
- [MCP Apps overview](https://modelcontextprotocol.io/extensions/apps/overview).
- [MCP Apps SDK](https://github.com/modelcontextprotocol/ext-apps).
- [Interaction and polling patterns](https://apps.extensions.modelcontextprotocol.io/api/documents/patterns.html).
