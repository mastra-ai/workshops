# Phase 7 — development completion, release blocked

Verified on 2026-09-08. Executable workshop commit: `d7d19f3`; active MCP source: `a5019083edc3d147f35692fcb0c94099abbf2251`. Later handoff-only edits do not change this tested executable boundary. See [release handoff](../RELEASE.md) for exact versions and blocking registry/human gates.

## Fresh-clone proof (not registry-only MCP v2 proof)

A new independent clone of `feat/mcp-product-workshop` received a frozen-lockfile install, followed by the guarded local overlay. The overlay reported its realpath/commit, core 1.64.0, GREEN cross-instance smoke and unchanged manifests. Two sequential rounds each began with `pnpm reset` and completed:

- `pnpm typecheck`
- `pnpm test`: **29 tests / 9 files passed**, natural process exit
- `pnpm build`
- `pnpm demo:surfaces`
- `pnpm demo:discover`
- `pnpm demo:workflow`
- `pnpm demo:v2`
- `pnpm demo:failures`

Then `open-slide/` frozen install and production build passed. The terminal transcript ends `FINAL FRESH CLONE OVERLAY REHEARSAL GREEN`. This does **not** replace the future released-package rehearsal. A prior complete two-round clone at `291cd18` is retained as historical evidence, not the final executable gate.

The scripted run sheet was also rerun and recorded after these changes, including Inspector and CLI fallback. The asciicast is a genuine automated rehearsal, not signed-in Cursor or human timing approval.

## Matrix audit

| Required claim | Committed assertion |
| --- | --- |
| REST/CLI shared product, tenant and malformed rejection | `tests/api.test.ts`, `tests/domain.test.ts`; `demo:surfaces` |
| Bounded catalogue; callApi absent | `tests/mcp-contract.test.ts` catalogue test; `demo:discover` |
| Generated workflow stages; ineligible stops before write | `tests/mcp-http.test.ts`, `tests/mcp-contract.test.ts` |
| Live progress/logs and then order resource | `tests/workflow-progress.test.ts`; actual SDK notifications in `scripts/demo-workflow.ts` |
| Invalid output not coerced | `tests/mcp-contract.test.ts` injects negative totalCents and checks output-validation failure |
| Raw sensitive metadata not echoed | `tests/mcp-http.test.ts` injects authorization/baggage markers and checks raw SDK response before sanitization; only safe trace correlation survives |
| Modern default, stateless HTTP, auto stdio probe, pinned mismatch | `tests/protocol.test.ts`, registry curl in `tests/mcp-http.test.ts`; `proof/expected/` |
| MRTR decline/cancel/replay writes zero/one | `scripts/protocol/http.ts` via `tests/protocol.test.ts` |
| Subscribed update; no event after unsubscribe | `scripts/protocol/http.ts`; policy-only publication |
| Subscription is not order authorization | `tests/mcp-http.test.ts` authorization spike |
| Authentication, idempotency, cancellation, redacted internal error | `tests/failures.test.ts`, `scripts/protocol/failures.ts` and `demo:failures` |
| Wrapper cancellation/conflict | `tests/mcp-contract.test.ts`; pre-aborted wrapper writes zero, conflicting replay writes no additional return |
| Natural process shutdown | two full matrix rounds exit; failure test runs child proof twice with timeout, no forced successful exit |
| Inspector/programmatic interop and portable configs | `scripts/clients/inspector.ts`, `tests/client-config.test.ts`; Cursor still human-gated |
| Title/presenters and novelty | deck cover/footer, root catalogue, FACILITATOR title; README newly-defaulted/supported-before/not-implemented table; cold review |

Wrapper cancellation proof uses direct execution with an abort signal, not a mid-run HTTP disconnect. Cancellation after a committed write cannot undo it; use the idempotency key to recover the result. The failure drill's in-flight abort proof exercises `createReturn`.

## Cold review and safety

Two adversarial review rounds inspected the complete branch against the approved plan. Initial must-fixes: stale five-tool counts and pre-wrapper evidence. Both fixed; final re-review reported **no must-fix findings**. It also verified the stronger output/metadata tests and wrapper conflict/cancellation behavior. Remaining risks are documented in RELEASE.md and above, not hidden as completed human gates.

Branch-scope check allows only the workshop example/deck, catalogue and proof ignore rules. The original checkout still has its four pre-existing dirty files; none is in this branch diff. Committed transcript/config scan found no personal absolute paths, bearer secrets or private-key patterns. Synthetic fixture tokens in runnable local auth documentation are explicitly teaching values, not production secrets.

## Local evidence map

All paths below are relative to repository `.mastracode/proof/mcp-product-workshop/` and are gitignored.

| Local files | Committed claim / reproduction |
| --- | --- |
| `fresh-clone-final.txt` | Two-round final executable gate above; reproduce with RELEASE.md development sequence in a new clone |
| `fresh-clone-overlay.txt` | Historical two-round gate before additional negative-boundary tests |
| `rehearsal.txt`, `demo.cast`, `rehearse.mjs` | FACILITATOR scripted chapters, including live workflow progress/logs and Inspector; automated recording only |
| `safety-scan.txt` | Branch scope and committed transcript/config scan described above |
| `adversarial-review.md` | Review rounds and resolved must-fixes described above |
| `deck-01.png` through `deck-13.png`, `review-*.png` | Phase 6 visual review, twelve setup slides plus closing |
| `deck-check.json`, `deck-proof.mjs` | Fixed 1920×1080 bounds and reduced-motion assertions in phase-6.md |
| `deck-build.log` | Phase 6 deck build; final clone rebuild also captured in fresh-clone-final.txt |
| `video/*.webm` | Slide traversal visual evidence, not full instructor delivery |
| `studio-published-{modern,legacy}.{txt,png}` | Known failed published-asset modern presentation, phase-6.md |
| `studio-local-{modern,legacy}.{txt,png}` | Passing local-asset modern/legacy transport assertions, phase-6.md |
| `README.md` | Owner-local absolute-path handoff and links back to this committed map |

**Status: content complete / release blocked.** Outstanding: MCP stack release/registry availability and coordinated Studio, registry-only rerun and final review, signed-in Cursor discovery/call, second-person five-minute path, owner-approved full timed recording, and launch approval.
