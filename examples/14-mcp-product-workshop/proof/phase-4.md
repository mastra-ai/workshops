# Phase 4 modern wire proof

Development overlay reactivated with unchanged manifest/lockfile hashes at MCP commit `a5019083edc3d147f35692fcb0c94099abbf2251`. The recorded local setup output is `.runtime/overlay.log` (not committed). This is not a released-v2 ship proof.

## Reproduce

```bash
pnpm demo:discover
pnpm typecheck
pnpm test
pnpm demo:v2
pnpm build
```

The Phase 2 registry gate is explicit in both `scripts/demo-discover.ts` (prints/exports allocated MASTRA_BASE_URL, parses curl response) and `tests/mcp-http.test.ts` (asserts modern 2026-07-28 and legacy 2025-11-25 from the real Mastra app).

`demo:v2` writes `.runtime/proof/{modern,legacy,stdio}.jsonl`. To intentionally refresh the committed evidence after review:

```bash
PROOF_DIR=proof/expected pnpm demo:v2
```

The protocol test regenerates to a temporary directory and compares semantic properties, not entire snapshots. Two consecutive demo runs were also byte-identical after sanitization. All 23 tests, typecheck and build passed at this checkpoint.

## What the records prove

- Modern HTTP is pinned to 2026-07-28, carries per-request client/protocol metadata and has no session header. Mastra may also probe on this leg; no claim is made that HTTP requires that probe.
- `returnRiskScore` arrives as unwrapped scalar `structuredContent: 80`.
- Allowed W3C trace metadata is attached by the client callback. `getOrder` reads traceparent from MCP extra metadata and returns only the trace ID as correlationId, never baggage or tracestate.
- Three elicitation answers (decline, cancel, accept) each cause an `input_required` response and a resumed request. Decline/cancel leave zero mutations. Acceptance plus identical retry leaves exactly one mutation and one return result.
- Public policy revision changes from 1 to 2; the subscriber receives the URI event and rereads policy. After unsubscribe, another update does not deliver. Never emit tenant order notifications: subscription URI membership is not authorization.
- Explicit legacy HTTP negotiates 2025-11-25 and uses session headers. A modern-pinned client against that same server throws `SdkError` with `SdkErrorCode.EraNegotiationFailed`.
- Stdio uses omitted Mastra negotiation (auto) and records actual process bytes, including the opening `server/discover`. It serves public policy only without a tenant identity. The SDK's initial probe bypasses its public transport.send method, so intercepting only that method is insufficient evidence.

## Boundaries and precise claims

The HTTP protocol harness mounts the exact application MCP server instances on a small Node HTTP listener, with fixture identity mapping, so it can assert the domain mutation count directly. The separate HTTP integration suite and registry check exercise `mastra dev`. Do not conflate these two proof boundaries.

The installed core's schema converter currently emits explicit draft-07 tool schemas. This demo proves scalar structured-result interoperability; it does **not** claim these particular generated schemas exercise advanced JSON Schema 2020-12 keywords. Modern protocol support existed opt-in before v2; v2 changes the default.

Raw evidence retains request/response bodies, status codes, session presence and method names. Protocol IDs are normalized; opaque replay state, baggage and tracestate are redacted. Domain IDs and schemas are preserved. Authentication headers are never captured. Cancellation here means declining the elicitation with action `cancel`; aborting in-flight slow work is separately verified in Phase 5.
