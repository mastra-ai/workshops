# Phase 3 external-client proof

Development overlay: `a5019083edc3d147f35692fcb0c94099abbf2251`. This does not satisfy the released-package ship gate.

Verified 2026-09-08:

```text
pnpm typecheck: PASS
pnpm test: 20 passed
pnpm demo:inspector:
INSPECTOR GREEN: independent discovery, tool invocation, resource read and prompts; no Studio dependency.
```

Inspector 2.5.0 ran from an independent pnpm dlx installation over HTTP. Its five operations list tools, invoke getOrder, list resources, read policy, and list prompts. The runner asserts responses rather than trusting the exit code and uses a temporary client/catalog location. The programmatic client gate is `pnpm demo:discover` (Phase 2).

Cursor JSON passes the placeholder-only configuration test. Signed-in Cursor invocation remains a human release gate; it has not been claimed as verified. UI screenshots are collected with the Phase 6 visual pass. The optional stdio template follows the implemented Phase 4 harness, not a speculative command.
