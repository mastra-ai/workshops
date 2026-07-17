# 07 · Harness Workshop

A set of small, self-contained demos showing how to drive a Mastra **`Harness`** + **`Session`** directly — from a one-shot CLI script, to MCP tools, to an interactive TUI, to a server-hosted web chat.

Every demo builds an `Agent`, wraps it in a `Harness` (with LibSQL storage, memory, and subagents), opens a `Session` with `harness.createSession()`, and sends a message with `session.sendMessage({ content })`.

## Prerequisites

- **Node 20+**
- An **`ANTHROPIC_API_KEY`** — all demos use `anthropic/claude-haiku-4-5`.

Install deps and add your key:

```bash
cd agent-harness
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
```

Each demo loads `.env` automatically (via `tsx --env-file=.env`).

## Demos

| File | What it shows | Run |
| --- | --- | --- |
| `basic.ts` | Orchestrator agent delegating to `researcher` + `poet` subagents, logging every harness event | `npm run basic` |
| `mc.ts` | Wiring **MCP** filesystem tools into the harness so the agent can read the project | `npm run mc` |
| `basic-tui.ts` | The orchestrator demo inside the interactive **`MastraTUI`** | `npm run basic-tui` |
| `tui.ts` | A workshop-style coding assistant (build/plan modes + subagents) in the TUI | `npm run tui` |
| `server.ts` | The harness hosted behind an HTTP server with a polished **web chat UI** | `npm run server` |

### `basic.ts` — one-shot orchestrator

Sends a single prompt ("research a pangolin, then write a haiku"), delegates research and writing to subagents exactly once, and prints the streamed events plus the final answer.

```bash
npm run basic
```

### `mc.ts` — MCP filesystem tools

Spins up the `@modelcontextprotocol/server-filesystem` MCP server scoped to the current directory, flattens its tools into the harness, and asks the agent to read and summarize `package.json`.

```bash
npm run mc
```

> First run downloads the MCP server via `npx -y`.

### `basic-tui.ts` & `tui.ts` — interactive TUI

Launch the orchestrator (`basic-tui.ts`) or the build/plan coding assistant (`tui.ts`) inside `MastraTUI`. Type to chat; the subagent activity and tool calls render inline.

```bash
npm run basic-tui
# or
npm run tui
```

### `server.ts` — web chat UI

Hosts the harness over HTTP and serves an embedded chat UI. Sessions are resource-scoped, events stream to the browser over SSE (`GET /api/stream`), and messages post to `POST /api/message`.

```bash
npm run server
```

Then open the printed URL (defaults to <http://localhost:4111>; override with `PORT`):

```bash
PORT=4138 npm run server
```

The UI shows live subagent activity chips with timings, token usage, and markdown-rendered replies.

## Shared helper

`log-events.ts` exports `logEvent`, a single `HarnessEventListener` reused by the CLI demos (`basic.ts`, `mc.ts`) to pretty-print agent, tool, subagent, message, usage, and error events.

## Notes

- All demos write to a local `mastra.db` (LibSQL) in this folder; delete it to reset memory/threads.
- Models resolve through the default Mastra gateways, so the bare `anthropic/...` id works as long as `ANTHROPIC_API_KEY` is set.
