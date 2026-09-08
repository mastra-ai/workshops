# Phase 5 failure proof

MCP overlay commit: `a5019083edc3d147f35692fcb0c94099abbf2251`. Published core 1.64.0, Inspector 2.5.0, raw SDK client 2.0.0. Development-only evidence; release gate remains open.

Verified: typecheck, all 25 tests, Mastra build and modern demo. The failure test executes the full drill twice from fresh processes and exits without forced test termination; a separate repeated focused run also passed.

```text
HTTP FAILURE DRILL GREEN: missing token 401, wrong tenant 403, malformed input 400, identical retry converges, conflicting key 409; all MCP entry paths protected.
INJECTED FAILURE DRILL {"internalErrorRedacted":true,"abortStoppedPreflight":true,"abortedWrites":0,"concurrentRetries":12,"committedWrites":1}
FAILURES GREEN. Elicitation decline/cancel zero-write proof: pnpm demo:v2.
```

Run `pnpm demo:failures` to reproduce. The injected server is a loopback harness only; real authentication assertions run through Mastra. Server-side cancellation is synchronized on entry into the actual preflight, not on a guessed delay. Client abort stops that preflight, and the domain count remains zero. All injected method replacements are restored in finally; neither injection is exposed to product callers.

Secret/path scan passed for `proof/expected` and `docs/clients` (no bearer value, local fixture token, injected private error marker, personal directory or temporary path). The tests also check stdout/stderr do not contain the injected private error.

Hardening: all MCP execution/transport paths now require identity, not only `/mcp`; native workflow API registration is intentionally absent to avoid creating an unreviewed second execution boundary. External-preflight errors are redacted before they reach MCP error logging. The SDK elicitation interrupt is not caught or rewritten.

Limitations are explicit in `docs/production.md`: in-memory single-process idempotency, public-only subscription events, no OAuth authorization server, production ingress limits/rate limits and durable audit storage still required. Clean process exit is the local lifecycle proof, not a production load/leak benchmark.
