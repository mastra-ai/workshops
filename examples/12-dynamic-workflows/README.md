# Example 12: Dynamic Workflows

Demo project for the dynamic workflows workshop: workflow definitions as **data**, created over HTTP at runtime — no code changes, no redeploy, no restart.

The only code in this project is a handful of tools (`src/mastra/tools/`) and a `Mastra` instance with LibSQL storage. There are **zero code-defined workflows** — every workflow lives in `workflows/*.json` and is created live via the API. No API key needed.

## What you'll see

- A workflow that is nothing but JSON, saved with one `POST` and runnable immediately
- Strict validation on save: broken definitions rejected with structured issues, nothing persisted
- Upsert semantics: re-saving the same id live-replaces the workflow
- Every step type as JSON: mapping, parallel, conditional (predicate DSL), foreach, loop, sleep, nested workflows
- Atomic bundles: a root workflow + helper saved in one request
- Everything rendering in Studio as real graphs, with runs and traces
- Persistence: definitions rehydrate from the LibSQL db on restart

## Setup

```bash
pnpm install --ignore-workspace
rm -f mastra.db* .mastra/output/mastra.db* src/mastra/public/mastra.db*   # start clean before demoing
pnpm dev
```

**Check the port the dev server prints.** It defaults to 4111 but silently picks the next free port if occupied. If it's not 4111, prefix every demo command with `MASTRA_BASE_URL`, e.g.:

```bash
MASTRA_BASE_URL=http://localhost:4112/api pnpm demo:1
```

## Demo run-sheet

Each script prints the workflow JSON, the exact HTTP requests it makes, and the responses. Each script's header comment states why that beat is in the demo. Run them in order (or cherry-pick — each is self-contained):

The sequence is deliberate: **1–3** establish the lifecycle (create → validate → live-update), **4–10** walk through every graph entry type (mapping → parallel → conditional → foreach → loop → sleep → nested bundle), **11** completes CRUD and hands off to Mastra Code.

| # | Command | Beat |
|---|---------|------|
| 1 | `pnpm demo:1` | **Create + run.** `POST /api/stored/workflows` with `greeting-workflow.json`, then `POST /api/workflows/greeting-workflow/start-async` → `Hello, Brandon!` — no restart. |
| 2 | `pnpm demo:2` | **Validation.** `broken-workflow.json` references a nonexistent tool → structured `missing-reference` issue; list proves nothing was persisted. |
| 3 | `pnpm demo:3` | **Live update.** `greeting-workflow-v2.json` adds a `shout` step under the same id → output becomes `HELLO, ADA!!!!` instantly. |
| 4 | `pnpm demo:4` | **Mapping.** `order-receipt.json` is a single mapping step — templates, constants, field picks. Pure data shaping, no tools, no LLM. |
| 5 | `pnpm demo:5` | **Parallel.** `text-remixer.json` fans one text out to three tools concurrently; a mapping step merges results by step id. |
| 6 | `pnpm demo:6` | **Conditional.** `support-triage.json` classifies a support message, routes it with JSON predicates (`eq` on priority), and merges the chosen branch. |
| 7 | `pnpm demo:7` | **Foreach.** `bulk-greeter.json` greets an array of names, order preserved, `concurrency: 2`. |
| 8 | `pnpm demo:8` | **Loop.** `countdown.json` decrements a counter with `dountil` + a declarative exit predicate — the polling/retry pattern as data. |
| 9 | `pnpm demo:9` | **Sleep.** `delayed-greeting.json` pauses 2s mid-graph between greet and shout. |
| 10 | `pnpm demo:10` | **Bundle.** `fanfare-greeting.json` nests a helper workflow and saves both atomically via `dependencies` — then runs root AND helper. |
| 11 | `pnpm demo:11` | **Manage.** `GET` list, `GET` one, `DELETE` one — the storage row and the live registration both go away. |

### Studio beats (interleave as you go)

Open Studio at the dev server URL:

- After **demo 1**: `greeting-workflow` appears under Workflows — save is registration.
- After **demo 3**: refresh — the graph now has two steps. Same page, new shape, no restart.
- After **demo 5**: open `text-remixer` — a real fan-out/fan-in graph. Run it from the Studio form and inspect the trace.
- After **demo 6**: open `support-triage` — condition nodes labeled `inputData.priority == "urgent"` / `== "normal"`, derived automatically from the predicates.
- After **demo 10**: open `fanfare-greeting` — the `greet` step carries the nested-workflow badge; `polite-greeting` is its own workflow in the list.
- After **demo 11**: `bulk-greeter` is gone from the list.

### Persistence beat

Kill and restart `pnpm dev`, then re-run any workflow (or just refresh Studio): definitions rehydrate from storage at boot.

## Part 2: Let an agent write the JSON

Writing this JSON by hand gets old fast. In Mastra Code (build mode), the `create-workflow` tool delegates to a workflow-builder agent that discovers registered agents/tools/workflows, composes a definition, and saves it through the same API.

Prepared prompts, in ramping complexity (all five verified end-to-end). The ramp mirrors the API beats — deterministic → agent step → conditional → parallel → foreach — so the audience watches the agent reach for the same primitives you just demoed by hand:

| # | Prompt | What it builds | Why it matters |
|---|--------|----------------|----------------|
| 1 | `build me a workflow that takes a file path, reads the file, and reports its word count` | mapping → `execute_command` tool step (`wc -w`) → mapping. Deterministic, no LLM in the loop. | The agent *chose* deterministic steps: you pay for LLM reasoning once at author time, then every run is cheap, instant, and reproducible. |
| 2 | `build me a workflow that researches a topic and writes a summary` | single agent step doing live web research. | LLM judgment *inside* the workflow, but the orchestration around it is fixed — the same research pipeline replays identically for any topic. |
| 3 | `build me a workflow that triages a bug report: if it mentions a crash or data loss, write an urgent escalation note, otherwise a polite standard reply` | agent classify (structured output) → conditional with two helper workflows → step-array merge. | One sentence of intent became routing rules (predicates + helper bundle) — user-configurable triage without anyone writing branching code. |
| 4 | `build me a workflow that takes meeting notes and produces both action items and an executive summary, then combines them into one report` | two agent steps with prompt mappings → combining mapping. | One input fanned into two analyses and merged — the multi-step report pipeline you'd otherwise hand-code, described in plain language. |
| 5 | `build me a workflow that summarizes every markdown file in a directory and combines the summaries into a single report` | `find` tool step → agent building `{prompt}` array → **foreach** over files (concurrency 3) → synthesis agent. | A real map-reduce over files, composed entirely from chat — the same shape scales to any "do this for every item, then combine" job. |

Then in the TUI:

```
/workflows list
/workflows run <id-from-the-save-message> {"path": "/tmp/notes"}
```

> The model picks the workflow id and exact graph shape — read the id off the save confirmation rather than assuming. If a save fails validation (most likely on prompt 5), just re-send the same prompt; the builder typically lands it on the next attempt.

## Files

- `src/mastra/index.ts` — Mastra instance: tools + LibSQL storage, nothing else
- `src/mastra/tools/` — the tools that dynamic workflows reference by `toolId`
- `workflows/*.json` — every workflow definition used in the demo
- `scripts/*.ts` — one script per demo beat; `scripts/lib.ts` wraps the four endpoints

## Docs

- [Dynamic workflows](https://mastra.ai/docs/workflows/dynamic-workflows)
- [Dynamic workflow definition reference](https://mastra.ai/reference/workflows/dynamic-workflow-definition)
