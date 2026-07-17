# Example 08: Browser & Channels Workshop — Demo 1

A single agent that searches for flights on Google Flights using `@mastra/stagehand`.

This is the live code behind **Demo 1** of the Browser & Channels workshop deck. It exists to show one thing: **plug a browser into an agent and let the loop drive**.

## What you'll see

- One agent, one capability: `browser` (a `StagehandBrowser`).
- The agent navigates `google.com/travel/flights`, fills the search form, observes the results, and reads the cheapest option back in chat.
- A live browser **screencast** streams into Mastra Studio so the room can watch the agent click around in real time.
- No booking — read-only.

## Setup

```bash
pnpm install
cp .env.example .env
# Add your OpenAI API key
```

Stagehand will download a Chromium binary on first run via Playwright. If it complains, run:

```bash
npx playwright install chromium
```

`ws` and `@hono/node-ws` are already in `package.json` — they power the live browser screencast in Studio. (Without them, the agent still works; you just don't see the browser feed.)

## Run

```bash
pnpm dev
```

Opens Mastra Studio. Try:

- "Find me the cheapest flight from SFO to NYC on December 15, returning December 22."
- "What's the best one-way flight from LAX to Tokyo next Friday?"
- "Compare prices SFO → London for the first weekend of next month."

Watch the agent loop in Studio: each `stagehand_act` / `stagehand_observe` / `stagehand_extract` call is a turn of **observe → reason → act → repeat**.

## Why Stagehand here

Google Flights is the kind of site that breaks deterministic refs — heavy JS, autocomplete suggestions, dynamic results. Stagehand's natural-language tools (`stagehand_act("type 'SFO' into the origin field")`) are forgiving where `@mastra/agent-browser` would need pixel-perfect refs.

Trade-off: more tokens, slower, less deterministic. That's the point — we'll talk through when to pick which provider.

## Files

- `src/mastra/index.ts` — Mastra entry. One agent, one browser, one memory.

That's the whole thing.
