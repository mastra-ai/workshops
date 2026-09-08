# Verification record

## Current development evidence

- [MCP contracts and authorization spike](phase-2.md)
- [Independent client / Inspector](phase-3.md)
- [Modern, legacy and stdio wire proof](phase-4.md): raw sanitized fixtures under `expected/`.
- [Production failures](phase-5.md): cancellation, redaction and concurrent retries.
- [Deck, instructor materials and Studio checks](phase-6.md).

Regenerate with `pnpm demo:v2`; protocol tests compare the sanitized semantic assertions. Run `pnpm demo:failures` for the production drill and `pnpm demo:workflow` for staged execution and the resulting order resource. All require the local v2 overlay until the coordinated release.

Local visual/recording evidence lives at repository `.mastracode/proof/mcp-product-workshop/` (gitignored). Screenshots supplement—not replace—wire assertions. The published Studio baseline still shows SSE on modern servers; only the local stack's Studio assets pass that visual assertion.

**Release blocked:** the registry query for `@mastra/mcp@^2.0.0` returned E404 on 2026-09-08. No released-package proof or human approval is claimed. Cursor login/call recording, second-person five-minute path, full timed owner review and final adversarial review remain open. Workflow staged results and actual progress/log emission are now verified by `tests/workflow-progress.test.ts`; see the Phase 7 development follow-up and release handoff.

## Historical scaffold gate

## Phase 0 — development baseline

- Isolated branch: `feat/mcp-product-workshop`, based on `origin/main` at `12793d7`.
- `pnpm install --frozen-lockfile`: passed with pnpm 10.27.0.
- Registry baseline: MCP 1.17.3, core 1.64.0, CLI 1.27.3, Zod 4.5.4.
- `pnpm test`: intentional RED, missing `src/mastra/index.js` application registration; Vitest starts successfully.
- `pnpm setup:local-v2`: GREEN; MCP dependency build passed (16 tasks), cross-instance Zod tool registration/list/invoke returned `{value:7}`, modern protocol default asserted, manifest/lockfile/workspace hashes unchanged.
- Local MCP source commit: `a5019083edc3d147f35692fcb0c94099abbf2251`.
- Installer reported an upstream `@hono/node-ws` peer warning (`@hono/node-server` 2.1.1 versus ^1.19.11). Runtime transport gates must verify the relevant behavior before proceeding.

This is not released-package proof. Demo commands, app build and typecheck await Phase 1 implementation. No slides, transcripts or human release checks are claimed complete.
