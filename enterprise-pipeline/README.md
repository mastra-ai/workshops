# Example 02 — Enterprise Pipeline

A production-grade agent with layered defenses, conditional processing, and post-completion side effects.

## Architecture

```
                    INPUT PIPELINE
                    ═══════════════
  User Message → RegexPreFilter (fast, no LLM)
                       │
                 ┌─────┴─────┐
                 │            │
            TopicGuard   Moderation     (LLM checks in parallel)
                 │            │
                 └─────┬─────┘
                       │
                    ┌──┴──┐
                    │     │
              ModelRouter  ToolDependencyEnforcer  WrapUpEnforcer  (per-step)
                    │     │
                    └──┬──┘
                       ▼
                    [ LLM ]
                       │
                    OUTPUT PIPELINE
                    ════════════════
                .branch([
                  every 5th step → TaskDriftMonitor
                ])
                       │
                  OrderConfirmation  (fire webhook)
                  EscalationDetector (flag for human review)
```

## Key concepts

- **Layered defense**: Regex first (microseconds), then LLM checks in parallel
- **Conditional branching**: Only check drift every 5th step via `.branch()`
- **Wrap-up enforcer**: `processInputStep` injects "wrap up" instructions approaching the step limit
- **Tool dependency enforcer**: Gates tools until prerequisites are called
- **Model router**: GPT-5.2 for step 0, GPT-5-nano for follow-ups
- **onFinish side effects**: `OrderConfirmation` fires webhooks, `EscalationDetector` flags for human review
- **Shared constants**: `MAX_STEPS` used by both agent config and wrap-up enforcer

## Run

```bash
pnpm i
pnpm dev
# Studio opens at http://localhost:4113
```
