# Phase 6 — presentation and instructor experience

Development proof only. MCP source overlay: `a5019083edc3d147f35692fcb0c94099abbf2251`. Per owner confirmation, the MCP stack is unmerged; local builds are the intended development dependencies.

## Artifacts and checks

- Twelve setup/education slides plus optional questions, using the Mastra palette, typography, footer and sparse layout. Exact workshop title and presenters on cover/catalogue/run sheet.
- `FACILITATOR.md`: 25/60/5 timing, one continuous demo, setup/expected output/fallback/cleanup for each chapter, drop-order rule and 30-minute extension.
- README: setup, five-minute reviewer path, slide-to-code map, state boundary and troubleshooting.
- `scripts/demo-workflow.ts`: actual HTTP workflow invocation; eligibility/draft/completion path, result and mutated resource all asserted. These are final execution results, not streamed progress events.
- Open-slide frozen install and production build passed. All thirteen pages rendered at 1920×1080. Automated DOM bounds checks found no overflow; computed animation is `none` under reduced motion. All pages visually reviewed for contrast, wrapping and code legibility.
- Example typecheck, 25 tests and build passed. Full scripted rehearsal executed from shell, including surfaces, discovery, workflow, Inspector, modern wire, failures and CLI fallback. Commands allocate fresh state and close their owned processes. Interactive env-file sourcing/registry curl were exercised during Studio checks.

## Studio: record both the failed baseline and the local success

Published CLI 1.27.3 bundles an older Studio: both modern and legacy pages show an SSE card. That baseline **fails** the modern presentation assertion. Do not claim the MCP-only overlay updates Studio assets.

A second browser run served the workshop's built app with `MASTRA_STUDIO_PATH` pointing to the MCP stack's locally built `packages/playground/dist`. This is a development-only visual-asset override, not a registry package proof. The browser supplied the local north fixture authorization header for authenticated catalogue requests.

Assertions on extracted body text:

- Modern: `Streamable HTTP` present; `Server-Sent Events` absent; `createReturn` present.
- Legacy: `Streamable HTTP` and `Server-Sent Events` present; `createReturn` present.

Both pass with the local Studio build. No product/Studio source was edited. Before release, repeat against the published coordinated CLI/Studio and MCP packages with no asset override.

A forcibly terminated background launcher initially left its owned dev child alive, causing subsequent tests to reject duplicate startup. The known child was stopped and the entire typecheck/test/build/rehearsal rerun passed. Interactive users should stop the foreground launcher with Ctrl-C, not terminate only its package-manager parent.

## Local-only evidence

Under repository `.mastracode/proof/mcp-product-workshop/` (gitignored):

- `deck-01.png` … `deck-13.png`, `review-*.png`, `deck-check.json`, reusable `deck-proof.mjs`.
- `video/`: slide traversal recording (not the full timed instructor workshop).
- `studio-published-{modern,legacy}.{txt,png}`: failed published-asset baseline.
- `studio-local-{modern,legacy}.{txt,png}`: successful local-asset assertions.
- `rehearse.mjs`, `rehearsal.txt`, `demo.cast`: actual scripted demo output and timestamped asciicast recording. This is an automated rehearsal, not human timing approval.

Remaining human gates: signed-in Cursor discovery/call recording; second-person README rehearsal; owner approval of the full timed delivery. Streamed workflow progress/log presentation has not been verified; only staged final results are claimed. Stable MCP 2.x registry installation remains a release gate, not something the local override proves.
