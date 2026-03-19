# Example 01 — Beyond Guardrails

Demonstrates every processor phase — not just input safety, but per-step intelligence and real-time monitoring.

## What it demonstrates

1. **Model Router** (`processInputStep`) — Uses GPT-5.2 for step 0, downgrades to GPT-5-nano for follow-up steps. Saves ~90% on tool result processing.
2. **Tool Dependency Enforcer** (`processInputStep`) — Gates `create_order` until `search_products` and `check_inventory` have been called. Enforces safe tool ordering.
3. **Task Drift Monitor** (`processOutputStep`) — Every 2 steps, evaluates if the agent is still on task. Retries with corrective feedback if drifting.
4. **Cost Tracker** (`processOutputStream`) — Counts tokens in real-time, emits custom `data-cost-update` stream chunks. Aborts if budget exceeded.
5. **Response Enricher** (`processOutputResult`) — Appends a disclaimer footer after all steps complete.

## Key concepts

- `processInputStep` can swap models and tools per step
- `processOutputStep` uses `stepNumber` for periodic quality checks + `abort({ retry: true })`
- `processOutputStream` uses `writer.custom()` for real-time data events
- `processOutputResult` for final post-processing

## Run

```bash
pnpm i
pnpm dev
# Studio opens at http://localhost:4112
```
