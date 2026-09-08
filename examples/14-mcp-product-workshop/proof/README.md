# Verification record

## Phase 0 — development baseline

- Isolated branch: `feat/mcp-product-workshop`, based on `origin/main` at `12793d7`.
- `pnpm install --frozen-lockfile`: passed with pnpm 10.27.0.
- Registry baseline: MCP 1.17.3, core 1.64.0, CLI 1.27.3, Zod 4.5.4.
- `pnpm test`: intentional RED, missing `src/mastra/index.js` application registration; Vitest starts successfully.
- `pnpm setup:local-v2`: GREEN; MCP dependency build passed (16 tasks), cross-instance Zod tool registration/list/invoke returned `{value:7}`, modern protocol default asserted, manifest/lockfile/workspace hashes unchanged.
- Local MCP source commit: `a5019083edc3d147f35692fcb0c94099abbf2251`.
- Installer reported an upstream `@hono/node-ws` peer warning (`@hono/node-server` 2.1.1 versus ^1.19.11). Runtime transport gates must verify the relevant behavior before proceeding.

This is not released-package proof. Demo commands, app build and typecheck await Phase 1 implementation. No slides, transcripts or human release checks are claimed complete.
