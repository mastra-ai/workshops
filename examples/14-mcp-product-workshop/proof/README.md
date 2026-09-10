# Protocol transcript fixtures

`expected/` contains sanitized request/response captures for three connections:

- `modern.jsonl`: stateless HTTP, scalar output, elicitation, trace metadata and a public policy subscription.
- `legacy.jsonl`: explicit legacy HTTP with a protocol session.
- `stdio.jsonl`: automatic negotiation using `server/discover`.

These are synthetic fixtures, not customer traffic. Tokens, ports and other run-specific values are removed before recording.

After the [project setup](../README.md#setup), regenerate them from the example directory:

```bash
PROOF_DIR=proof/expected pnpm demo:v2
pnpm exec vitest run tests/protocol.test.ts
```

Tests compare protocol semantics rather than requiring byte-for-byte identical captures. The legacy server runs only in this harness, not in the interactive application. Only public policy updates are broadcast; URI subscriptions alone do not establish tenant authorization.
