# Example 00 — Guardrails

Input safety checks using `processInput` and parallel processor workflows.

## What it demonstrates

1. **Topic Guard** — LLM-based classification with a fast safeguard model (`gpt-oss-safeguard-20b`). Uses typed `abort()` metadata.
2. **PII Guard** — Regex-only PII detection (zero latency, no LLM call). Shows that not every guardrail needs an LLM.
3. **Compliance Pipeline** — Composes all guards into a parallel workflow. All three run concurrently; if any aborts, the pipeline stops.

## Key concepts

- `Processor<TId, TMetadata>` — the second generic types the abort metadata
- `abort(reason, { metadata })` — structured tripwire with typed data
- `createStep()` + `createWorkflow().parallel()` + `.map()` — concurrent processor composition

## Run

```bash
pnpm i
pnpm dev
# Studio opens at http://localhost:4111
```
