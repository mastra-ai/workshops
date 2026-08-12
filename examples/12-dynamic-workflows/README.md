# Dynamic Workflows Workshop

Demo project for the dynamic workflows workshop: workflow definitions as **data**, created over HTTP at runtime — no code changes, no redeploy.

The only code in this project is two tools (`create-greeting`, `shout`) and a `Mastra` instance with LibSQL storage. Every workflow is created live via the API.

## Setup

```bash
pnpm install --ignore-workspace
rm -f mastra.db   # start clean before demoing
pnpm dev
```

Note the port the dev server prints (defaults to 4111; picks the next free port if occupied).

## Run the demo

```bash
./demo/api-demo.sh                                  # default: localhost:4111
BASE=http://localhost:4112/api ./demo/api-demo.sh   # if dev picked another port
```

The script walks 5 beats:

1. **Create** — `POST /api/stored/workflows` with `demo/greeting-workflow.json`
2. **Run immediately** — `POST /api/workflows/greeting-workflow/start-async` (no restart)
3. **Validation** — `demo/broken-workflow.json` references a nonexistent tool → structured `missing-reference` issue, nothing persisted
4. **Upsert** — `demo/greeting-workflow-v2.json` adds a `shout` step; same id replaces the live workflow, output becomes `HELLO, ADA!!!!`
5. **Persistence** — list definitions; restart `pnpm dev` and run again — the workflow survives (rehydrated from `mastra.db` at boot)

## Docs

- [Dynamic workflows](https://mastra.ai/docs/workflows/dynamic-workflows)
- [Dynamic workflow definition reference](https://mastra.ai/reference/workflows/dynamic-workflow-definition)
