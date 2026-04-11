# DeckForge — Agent Conventions

Entry point for any agent working in `deckforge/`. Read this before making changes. For deeper context see `docs/architecture.md`, `docs/planning.md`, `docs/requirements.md`, and the transformer architecture design doc at `plans/01-transformer-architecture.md`.

## What DeckForge is

A Markdown-driven HTML presentation framework. Authors write a single `.md` file; `deckforge build` emits one HTML file per slide plus a `deck.json` manifest. A dev server watches for changes and hot-reloads generated HTML in the browser.

## Stack

- Node.js ESM (`"type": "module"` in `package.json`)
- Runtime deps: `marked` (markdown parser), `chokidar` (file watcher), `ws` (hot-reload socket)
- **Zero build step.** No TypeScript, no bundler. Source ships as-is.
- **Zero test dependencies.** The test harness uses Node's built-in `node:test` runner. Do not add `vitest`, `jest`, `mocha`, or any other test framework.

## Commands

- `npm run build <deck.md>` — build a deck once
- `npm run dev <deck.md>` — start the dev server with hot reload
- `node --test test/` — run the full test suite (introduced by IAM-N foundation plan)
- `node --test test/parser.test.js` — run a single test file

## Conventions

- **Indent:** 2 spaces. No tabs.
- **Quotes:** single quotes in JS, double quotes in HTML attributes.
- **Semicolons:** yes.
- **Imports:** relative paths with explicit `.js` extension (ESM requirement). No import-alias setup.
- **Filenames:** kebab-case for all new files (`demo-card-grid.js`, not `demoCardGrid.js`).
- **Comments:** default to none. Only write a comment when the *why* is non-obvious (a hidden constraint, a workaround, a surprising invariant). Never explain *what* the code does.

## Module layout (post-foundation)

- `src/parser.js` — markdown → IR. No HTML concerns.
- `src/ir.js` — IR type definitions and validation helpers.
- `src/renderer.js` — orchestrates IR → HTML. Picks transformer per block, composes shell, dedupes CSS/JS.
- `src/transformers/<name>.js` — one file per transformer. Each exports the `Transformer` interface defined in `plans/01-transformer-architecture.md §3`.
- `src/shells/<name>.js` — one file per slide shell. Consumes ordered transformer outputs; produces a slide body.
- `src/generator.js` — thin entry point that wires parser → renderer.

## The idempotency rule

DeckForge's core guarantee: **text-only markdown edits produce text-only HTML diffs.** Every design choice follows from this.

- Transformers receive only the IR block they consume. No sibling access, no raw markdown.
- Transformers **never synthesize content words.** Structural or ordinal decoration (numbering items, wrapping in a grid, re-formatting existing text) is fine. Inventing text that isn't in the input is not.
- If a transformer needs richer sub-structure than the primitive provides, it must require the author to express that richness in the markdown (e.g. as a nested list). This is what keeps text-only round-trips clean.

## Directive grammar

Transformers are selected inline in markdown via HTML comments:

- **Block directive:** `<!-- df: <transformer> [key=value ...] -->` on its own line, immediately before the block it applies to. Applies to the next block only.
- **Slide-shell directive:** `<!-- df-slide: <shell> [key=value ...] -->` at the top of a slide, immediately after the H1/H2.
- **Inline span shortcodes:** `{=text}` (accent), `{+text}` (positive), `{!text}` (warning), `{.type text}` (explicit color).

Unknown transformer name or invalid content shape is a build error. In `dev` mode the renderer substitutes an error panel for the affected slide and keeps building the rest of the deck. In `build` mode the process exits non-zero.

## Tests

- Every transformer gets unit tests: one for `validate` (happy path + every error case), one for `render` (snapshot of the HTML/CSS/JS output).
- Every parser primitive case gets a unit test.
- Renderer integration tests use fixture decks in `test/fixtures/` and compare output trees against committed snapshots in `test/snapshots/` — plain files, no snapshot library.
- When a snapshot needs updating, delete the snapshot file and rerun `node --test`; the test harness writes missing snapshots on first run and fails on mismatches thereafter (see `test/helpers/snapshot.js`, added by the foundation plan).

## Commit style

Conventional commits: `feat(parser): ...`, `fix(renderer): ...`, `test(callout): ...`, `docs(agents): ...`. Reference the Linear issue in the commit body: `Refs: IAM-42`. Keep commits atomic.

## Plans

Non-trivial work lives in `plans/`. See `docs/planning.md` for the ExecPlan workflow. Completed plans move to `plans/done/`, abandoned plans move to `plans/abandoned/`.
