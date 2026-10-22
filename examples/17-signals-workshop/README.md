# Signals workshop demos

Four demos in one local Mastra Studio project: send/queue/steer/cancel, a shopping cart, a simulated home, and a builder/reviewer loop. See the [Signals deck](../../slides/signals-workshop/) and [presenter cues](PRESENTER.md).

## Setup

Use Node 24 LTS and pnpm. Run these commands **from this directory**, not the repository root:

```sh
pnpm install --frozen-lockfile
cp .env.example .env
# Put your own DEEPSEEK_API_KEY in .env (never commit it).
pnpm typecheck
pnpm test
pnpm dev
```

Wait for Studio at `http://localhost:4111`. The CLI reads `.env`; scripts call the running server and do not start it. DeepSeek (`deepseek/deepseek-chat`) is the default; set `MODEL` and that provider's credentials in the server environment to use a different model. Model requests cost money. Initial installation needs network access.

In a second terminal, from this directory:

```sh
pnpm demo1 # research: send, queue two follow-ups, cancel one, steer the active run
pnpm demo2 # split page: shop on the left, shopper's Studio thread on the right
pnpm demo3 # split page: simulated home on the left, home agent on the right
pnpm demo4 # split page: builder left, read-only reviewer right
```

Demo 1 and 4 pause for Enter. Demo 2 sets up a thread and lets you click/type. Demo 3 gives click/type cues. Each makes fresh memory threads. `--auto` runs scripted checks without pauses; redirected/non-TTY input also enables auto mode. `--no-open` suppresses browser opening; otherwise `open` is used on macOS. On Linux use `OPEN_CMD=xdg-open`, or open the printed URL yourself. Keep only the current demo tab open: Studio subscriptions hold long-lived connections, which can exhaust a browser's per-origin HTTP/1 connection pool.

## Published packages versus the live workshop build

This example installs published **Core 1.79.0**, **Memory 1.39.0**, **LibSQL 1.27.0**, and **CLI `mastra` 1.35.0**, with a standalone lockfile. There are no local overrides or vendored framework builds.

The live Oct 22 demo instead linked Core **and the CLI's bundled Studio** to a local main-based build with unpublished changes. Those changes emitted pending steer/queued-message events at acceptance, removed cancelled queued bubbles, reconciled the eventual echo, and added Option/Alt+Enter queueing plus queued-bubble labels in Studio. **This published setup does not promise those UI features.** Steers are still processed within the active run, but the user bubble may appear only after the tool returns; queued/cancelled follow-ups may not be visible while waiting. Use the terminal checks as the authoritative send/queue/cancel result. The example does not install the live patch or instruct you to link an unreleased build.

Typechecking against the published pins establishes API compatibility, not end-to-end model/browser behavior. Rehearse with your own provider before presenting; old workshop recordings are not proof of this portable setup.

## What to inspect

| Demo | Code                                             | What changes                                                                                                                                           |
| ---- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | `scripts/demo.ts`, `src/mastra/index.ts`         | A slow research tool keeps a run active; send steers it, queue waits for a later run, cancel removes a pending follow-up.                              |
| 2    | `src/mastra/shop.ts`, `src/mastra/pages.ts`      | Cart edits become state snapshots/deltas on the next model step. Sale/order/pack/ship/delay events use notifications.                                  |
| 3    | `src/mastra/home.ts`, `src/mastra/home-page.ts`  | Simulated lights, cameras, locks and events share state with a tool-using agent. No physical device, phone, police or emergency-service integration.   |
| 4    | `src/mastra/work-item.ts`, `src/mastra/index.ts` | A shared state lane and notification signals coordinate submission, one requested change, resubmission and approval. Reviewer filesystem is read-only. |

`StateLane` is an example input processor: it computes a full snapshot if no snapshot remains in context, a delta after a change, and nothing if unchanged. **Application cart/home/work-item state lives in process memory**, not a durable application store. Signals and conversation history use Mastra memory, but restarting the server does not reconstruct these application stores. This is a single-server teaching example, not a distributed ownership or production approval system.

Demo 4 supports one active pair at a time. It writes into `peer-workspace/` and clears **only** `parse-duration.ts` and `countdown.html` before starting. Run it from this directory against this same local project. Do not use a valuable folder, run concurrent pairs, or execute the generated files as trusted code. Treat model-produced HTML as untrusted.

## Verification and rehearsal

```sh
pnpm typecheck # published package types
pnpm test      # deterministic unit tests; no model key, server or network needed
```

Tests cover state snapshots/deltas/re-snapshots, cart edits, shared work-item transitions and HTML generation. They are **not** live model, notification wake, SSE or Studio integration tests.

For a **dedicated**, already-started rehearsal server:

```sh
# First terminal, from a disposable copy of this example:
# PORT=4112 pnpm dev
# Second terminal:
BASE=http://localhost:4112 pnpm rehearse
```

This runs every demo twice with `--auto --no-open`, stops on failure, and makes model calls and local demo state changes. It never starts/stops a server or deletes a database. It requires an explicit `BASE` so it cannot silently target another Studio on port 4111. Demo commands themselves default to port 4111; set `BASE` for any other server. Set `HOME_PACE=0.2` on the server to shorten the simulated device timeline during rehearsal (default `1`).

Manual signals use the most recently updated thread for that agent unless `--thread` is supplied:

```sh
pnpm send message "also include pricing" --agent assistant --thread THREAD_ID
pnpm send queue "then translate to French" --agent assistant --thread THREAD_ID
pnpm send cancel --agent assistant --thread THREAD_ID
pnpm send notify "CI failed" --agent assistant --thread THREAD_ID --priority high
```

`cancel` without signal IDs uses `.queued-ids.json`, which is local convenience state shared by this script; use explicit IDs if switching agents/threads. The `notify` helper targets `assistant` or `builder`; shop and home events use their own dashboard routes.

## Local state and troubleshooting

The server creates `workshop.db` and possibly SQLite sidecars, `.mastra/`, and `peer-workspace/`. These, `.env*` secrets, logs and queued IDs are ignored; do not contribute them. Stop only servers you own before backing up/resetting local state. Preserve the database and generated work before any reset. No reset command is automatic.

If a page appears to load forever, first close other Studio/demo tabs and retry. Check the server terminal and browser console/network before concluding that storage is stale. The workshop had a recovery after a local state reset, but its exact cause was not established; deleting data is not a general fix. A busy research tool intentionally waits up to the 90-second safety cap; the runner normally releases it five seconds after steering.

The demo routes are unauthenticated and designed for a trusted loopback environment only. Do not expose this project to the internet, attach real home controls, use sensitive data, or treat its simulated emergency instructions as safety advice.

## Offline fallback

The captured CLI replay kits referenced during the private workshop were **not part of this source snapshot** and are not included here. No command in this example replays a recorded model run. Without provider access, use the [presenter walkthrough](PRESENTER.md#offline-walkthrough) and local state tests to explain the flow; do not call them a live demo. Full per-demo recorded fallbacks remain a publication follow-up.
