# Example 12: Dynamic Workflows

Demo project for the dynamic workflows workshop: workflow definitions as **data**, created over HTTP at runtime — no code changes, no redeploy, no restart.

The only code in this project is a handful of tools (`src/mastra/tools/`) and a `Mastra` instance with LibSQL storage. There are **zero code-defined workflows** — every workflow lives in `workflows/*.json` and is created live via the API. No API key needed.

## What you'll see

- A workflow that is nothing but JSON, saved with one `POST` and runnable immediately
- Strict validation on save: broken definitions rejected with structured issues, nothing persisted
- Upsert semantics: re-saving the same id live-replaces the workflow
- Parallel fan-out, conditional branching (declarative predicate DSL), and foreach — all as JSON
- Everything rendering in Studio as real graphs, with runs and traces
- Persistence: definitions rehydrate from `mastra.db` on restart

## Setup

```bash
pnpm install --ignore-workspace
rm -f mastra.db   # start clean before demoing
pnpm dev
```

**Check the port the dev server prints.** It defaults to 4111 but silently picks the next free port if occupied. If it's not 4111, prefix every demo command with `MASTRA_BASE_URL`, e.g.:

```bash
MASTRA_BASE_URL=http://localhost:4112/api pnpm demo:1
```

## Demo run-sheet

Each script prints the workflow JSON, the exact HTTP requests it makes, and the responses. Run them in order:

| # | Command | Beat |
|---|---------|------|
| 1 | `pnpm demo:1` | **Create + run.** `POST /api/stored/workflows` with `greeting-workflow.json`, then `POST /api/workflows/greeting-workflow/start-async` → `Hello, Ada!` — no restart. |
| 2 | `pnpm demo:2` | **Validation.** `broken-workflow.json` references a nonexistent tool → structured `missing-reference` issue; list proves nothing was persisted. |
| 3 | `pnpm demo:3` | **Live update.** `greeting-workflow-v2.json` adds a `shout` step under the same id → output becomes `HELLO, ADA!!!!` instantly. |
| 4 | `pnpm demo:4` | **Parallel.** `text-remixer.json` fans one text out to three tools concurrently; a mapping step merges results by step id. |
| 5 | `pnpm demo:5` | **Conditional.** `text-router.json` branches on word count using the JSON predicate DSL (`lte`/`gt`); runs both branches to show routing. |
| 6 | `pnpm demo:6` | **Foreach.** `bulk-greeter.json` greets an array of names, order preserved, `concurrency: 2`. |
| 7 | `pnpm demo:7` | **Manage.** `GET` list, `GET` one, `DELETE` one — the storage row and the live registration both go away. |

### Studio beats (interleave as you go)

Open Studio at the dev server URL:

- After **demo 1**: `greeting-workflow` appears under Workflows — save is registration.
- After **demo 3**: refresh — the graph now has two steps. Same page, new shape, no restart.
- After **demo 4**: open `text-remixer` — a real fan-out/fan-in graph. Run it from the Studio form and inspect the trace.
- After **demo 5**: open `text-router` — the condition nodes are labeled `inputData.words <= 4` / `inputData.words > 4`, derived automatically from the predicates.
- After **demo 7**: `bulk-greeter` is gone from the list.

### Persistence beat

Kill and restart `pnpm dev`, then re-run any workflow (or just refresh Studio): definitions rehydrate from `mastra.db` at boot.

## Part 2: Let an agent write the JSON

Writing this JSON by hand gets old fast. In Mastra Code (build mode), the `create-workflow` tool delegates to a workflow-builder agent that discovers registered agents/tools/workflows, composes a definition, and saves it through the same API.

Prepared prompts:

1. `build me a workflow that researches a topic and writes a summary`
2. `build me a workflow that takes a file path, reads the file, and reports its word count`

Then in the TUI:

```
/workflows list
/workflows run <id-from-the-save-message> {"topic": "dynamic workflows"}
```

> The model picks the workflow id — read it off the save confirmation rather than assuming.

## Files

- `src/mastra/index.ts` — Mastra instance: tools + LibSQL storage, nothing else
- `src/mastra/tools/` — the tools that dynamic workflows reference by `toolId`
- `workflows/*.json` — every workflow definition used in the demo
- `scripts/*.ts` — one script per demo beat; `scripts/lib.ts` wraps the four endpoints

## Docs

- [Dynamic workflows](https://mastra.ai/docs/workflows/dynamic-workflows)
- [Dynamic workflow definition reference](https://mastra.ai/reference/workflows/dynamic-workflow-definition)
