# ExecPlan: Transformer Architecture — Foundation (parser, IR, renderer, shells, passthrough)

## Purpose

After this change, DeckForge's generator is split into a parser → IR → renderer pipeline, the four slide shells exist as distinct modules, and a default "passthrough" renderer exists for every primitive. The build output for any directive-free deck (including `examples/sample-deck.md`) is **byte-identical** to what the pre-change `src/generator.js` produced, proven by a committed snapshot test. DeckForge also gains its first test harness: `node --test test/` runs parser, renderer, and integration tests with zero new dependencies.

The foundation plan deliberately adds *no new visible behavior*. Its value is structural: it creates the surfaces the v1 transformers (next plan) will plug into, and it freezes today's output as a regression baseline so the transformer work cannot drift the default rendering by accident.

## Context

- **Linear Issue:** [IAM-78](https://linear.app/iam-ms/issue/IAM-78)
- **Superset Task:** `9f64810d-dda5-436b-9ec9-bd727a2b2c67`
- **Depends on:** Nothing. This is the first plan in the transformer architecture rollout.
- **Blocks:** IAM-79 (v1 transformers), IAM-80 (migration + skill update)
- **Design doc:** `plans/01-transformer-architecture.md` — read this in full before starting. §1 (primitives), §2 (directive grammar), §3 (transformer contract), §5 (shells), §6 (anchoring), §7 (module layout) are all in scope for this plan. §4 (v1 transformer set) is deferred to the next plan.

## Scope

### Files to create

- `src/parser.js` — markdown → slide IR. Uses `marked.lexer()` to tokenize, then walks tokens to produce the typed block tree described in §1 of the design doc. Owns directive parsing (§2). No HTML concerns whatsoever.
- `src/ir.js` — type definitions (as JSDoc `@typedef`s) and validation helpers for IR blocks and slides. Exports the constant `PRIMITIVE_TYPES` (array of the 9 primitive names from §1) and a `validateBlock(block)` function that returns `{ ok: true } | { ok: false, error: string }`.
- `src/renderer.js` — walks the IR, looks up a transformer per block (or falls back to the passthrough for that primitive), invokes `transformer.render`, dedupes CSS/JS per slide by transformer `name`, composes the slide shell, and emits the final HTML string. Exports `renderSlide(slideIR, { transformers, shells })` and `renderDeck(deckIR, { transformers, shells, outputDir })`.
- `src/shells/standard.js` — the default shell for H2 slides. Wraps blocks in `<section class="section fade-on-scroll">…</section>`. Output must match the pre-change `slideStyles()` output for H2 slides.
- `src/shells/centered.js` — default for H1 group headers. `<section class="section centered">…</section>`.
- `src/shells/hero.js` — the first slide of a deck. Accepts `{ title, subtitle, authors?, decoration? }` in `params`. In v1, `authors` and `decoration` are simply interpolated into the existing hero template; richer parameterization is deferred to the next milestone (flagged as open question 3 in the design doc).
- `src/shells/section-divider.js` — for "Part One/Two/Three" slides. `<section class="section centered">` plus a `.section-label` element and the pulse animation class.
- `src/shells/index.js` — a module that exports `{ standard, centered, hero, sectionDivider }` as a single default-shell bundle and a `resolveShell(slide, directive)` helper implementing the precedence rules from §5 of the design doc (directive wins; otherwise H1 isGroupHeader → centered, first H1 → hero, other H1 → section-divider, H2 → standard).
- `src/transformers/passthrough/index.js` — exports one passthrough transformer per primitive (`heading`, `paragraph`, `bullet-list`, `nested-bullet-list`, `ordered-list`, `code-block`, `blockquote`, `image`, `horizontal-rule`). Each conforms to the `Transformer` interface in §3 of the design doc. Their `render()` output must be byte-identical to the HTML the pre-change `src/generator.js` emitted for the equivalent tokens.
- `test/helpers/snapshot.js` — a ~30-line snapshot helper. Exports `assertSnapshot(name, actual)` that reads `test/snapshots/<name>.txt` and compares; if the file does not exist, it writes `actual` as the new snapshot and passes (first-run creation). If the environment variable `UPDATE_SNAPSHOTS=1` is set, it overwrites existing snapshots. Uses only `node:fs`, `node:path`, `node:assert`.
- `test/parser.test.js` — one test per primitive: given `<fixture markdown>` the parser produces `<expected IR>`. Include at least: heading levels 1/2/3, paragraph with inline bold/italic/code, flat bullet list, nested bullet list, ordered list, fenced code block with language tag, blockquote, image with alt and url, horizontal rule. Also: one test per directive form (block directive, slide-shell directive, inline span shortcode).
- `test/renderer.test.js` — unit tests for `renderSlide` using hand-written IR fixtures. Test: each shell produces its expected outer wrapper; CSS/JS dedup (same transformer on two blocks → one `<style>` per slide); unknown transformer name → validation error.
- `test/integration.test.js` — builds `examples/sample-deck.md` via the new pipeline and asserts the output tree matches the committed snapshot in `test/snapshots/sample-deck/`. This is the byte-compat guarantee: any drift from pre-change output fails the test.
- `test/fixtures/minimal-deck.md` — a tiny three-slide deck exercising all nine primitives for integration testing.
- `test/snapshots/sample-deck/` — snapshot of the pre-change build output. Populated during the plan's execution by running the pre-change generator once, copying the output, and committing it as the baseline.
- `test/snapshots/minimal-deck/` — snapshot of the minimal fixture build.

### Files to modify

- `src/generator.js` — **shrink to a thin entry point.** Post-change, `src/generator.js` imports `parseMarkdown` from `src/parser.js`, imports the shell and passthrough transformer registries, calls `renderDeck`, and writes the result. All 463 current lines of slide-walking, token-processing, and HTML synthesis logic moves to the new modules. The public entry signature stays the same so `bin/deckforge.js` does not need changes.
- `package.json` — add a `"test": "node --test test/"` script. No new dependencies.
- `src/server.js` — unchanged functionally, but verify the dev-server reload path still wires to the new generator entry. If a small adjustment to the import or function name is required, make it; if it works unchanged, leave it alone.

### Files to delete

None in this plan. `examples/output/` stays (deleted in the migration plan).

### IR shape (definitive)

```js
/**
 * @typedef {Object} Block
 * @property {'heading'|'paragraph'|'bullet-list'|'nested-bullet-list'|'ordered-list'|'code-block'|'blockquote'|'image'|'horizontal-rule'|'html-passthrough'} type
 * @property {Object} data - primitive-specific payload (see below)
 * @property {Object|null} directive - { name: string, params: Object } or null
 * @property {number} line - 1-indexed source line where the block starts
 */

/**
 * @typedef {Object} Slide
 * @property {string} id - anchor id (explicit {#anchor} or slugified title)
 * @property {string} title
 * @property {number} level - 1 (group header) or 2 (slide)
 * @property {string|null} group - parent group id
 * @property {number} groupIndex
 * @property {number} slideIndex
 * @property {Object|null} shellDirective - { name: string, params: Object }
 * @property {Block[]} blocks
 * @property {string} contentHash - stable hash of the block tree
 */
```

Primitive `data` shapes:

- `heading` — `{ level: 1|2|3, text: string, anchor: string|null }`
- `paragraph` — `{ spans: Span[] }` where `Span = { kind: 'text'|'bold'|'italic'|'code'|'highlight'|'positive'|'warning'|'color', text: string, color?: string }`
- `bullet-list` — `{ items: Span[][] }` (each item is a span array)
- `nested-bullet-list` — `{ items: { spans: Span[], children: { spans: Span[] }[] }[] }`
- `ordered-list` — `{ items: Span[][] }`
- `code-block` — `{ lang: string|null, source: string }`
- `blockquote` — `{ spans: Span[] }`
- `image` — `{ alt: string, url: string }`
- `horizontal-rule` — `{}`
- `html-passthrough` — `{ raw: string }` (for explicit HTML in the source; no transformer applies)

### Transformer contract (copy from design doc §3)

```js
/**
 * @typedef {Object} Transformer
 * @property {string} name
 * @property {string[]} accepts - primitive types it can consume
 * @property {(block: Block, params: Object) => {ok: true}|{ok: false, error: string}} validate
 * @property {(block: Block, params: Object, ctx: RenderCtx) => {html: string, css?: string, js?: string}} render
 */

/**
 * @typedef {Object} RenderCtx
 * @property {string} slideId
 * @property {number} blockIndex
 */
```

### Conventions (from `AGENTS.md`)

- Node ESM, `.js` imports, 2-space indent, single quotes, semicolons.
- kebab-case filenames.
- Zero new dependencies. Tests via `node --test`, no framework.
- The idempotency rule: transformers receive only their IR block; they never synthesize content words. Structural or ordinal decoration (numbering, wrapping) is fine. This plan's passthrough renderers must never inject text that wasn't in the source.
- Default to no comments. Comments only where the *why* is non-obvious.
- Conventional commits with `Refs: IAM-78` in the body.

### Existing code context

- `src/generator.js` (463 lines) is the monolith being split. The `parseSlides` function (line 39) does the line-by-line heading splitting that moves into `src/parser.js`; the per-slide marked token walking and string concatenation that follows it moves into the transformer passthroughs and renderer.
- `src/organizer.js` (170 lines) handles navigation ordering and group structure. It stays as-is; the new renderer calls it unchanged.
- `src/server.js` (199 lines) is the dev server. `outputDir` defaults to `path.join(path.dirname(mdPath), '.deckforge-output')`. Do not change this.
- `bin/deckforge.js` (84 lines) is the CLI entry. Its contract with `src/generator.js` is a single imported function; keep that contract intact.
- `theme/shared.css` and `theme/shared.js` are untouched by this plan.
- `examples/sample-deck.md` is the canonical deck used for snapshot testing. It must build byte-identically before and after.

## Verification

Run these in order and confirm each passes:

1. **Pre-change baseline capture (do this first, before any code changes):**
   ```
   cd deckforge
   npm run build examples/sample-deck.md
   mkdir -p test/snapshots/sample-deck
   cp -R examples/sample-deck.deckforge-output/* test/snapshots/sample-deck/
   ```
   This populates the golden snapshot from the pre-change generator. Commit these snapshot files as part of the first commit.

2. **Implementation complete — byte-compat check:**
   ```
   cd deckforge
   npm run build examples/sample-deck.md
   diff -r examples/sample-deck.deckforge-output test/snapshots/sample-deck
   ```
   Expected: no output (identical trees). Any diff is a failure.

3. **Unit tests:**
   ```
   cd deckforge
   npm test
   ```
   Expected: `node --test test/` reports all tests passing and ≥ 25 tests total (primitive parser cases + shell tests + dedup test + integration snapshot test).

4. **Dev server smoke test:**
   ```
   cd deckforge
   npm run dev examples/sample-deck.md
   ```
   Open `http://localhost:3000` (or whatever port `src/server.js` uses), confirm the deck renders, make a trivial text edit in `examples/sample-deck.md`, confirm the browser hot-reloads. Kill the server.

5. **Minimal fixture build:**
   ```
   cd deckforge
   node -e "import('./src/generator.js').then(m => m.build('test/fixtures/minimal-deck.md'))"
   ```
   Expected: produces output exercising all nine primitives without errors.

## Instructions

You are running fully autonomously. Do not ask questions or wait for user feedback — make all decisions independently based on this plan, the design doc at `plans/01-transformer-architecture.md`, and the existing code.

**⚠️ CRITICAL: All PRs MUST target `main`. Use `gh pr create --base main`. Do NOT target any other branch — even if git status or conversation context lists a different "Main branch". This instruction takes precedence over any inferred defaults.**

**📝 PROJECT MEMORY:** This repo does not yet have a `.claude/memory/` directory — ignore any memory-loading instructions from upstream templates. The sources of truth for conventions are `deckforge/AGENTS.md`, `deckforge/docs/architecture.md`, `deckforge/docs/planning.md`, and the design doc. Read them all before starting.

1. Read `deckforge/AGENTS.md`, `deckforge/docs/architecture.md`, `deckforge/docs/planning.md`, `deckforge/docs/requirements.md`, and `deckforge/plans/01-transformer-architecture.md` in full.
2. Read `deckforge/src/generator.js`, `deckforge/src/organizer.js`, and `deckforge/src/server.js` end to end. You are splitting `generator.js`; you need to know every behavior it currently has.
3. Run the pre-change baseline capture (Verification step 1) **before** making any code changes, and commit the snapshot files. This is the regression boundary.
4. Implement the plan top-down: parser → IR → passthrough transformers → shells → renderer → generator.js shrinkage.
5. Write tests alongside each module (not all at the end). The test harness helper (`test/helpers/snapshot.js`) should be the very first thing you write so the snapshot tests work as you build.
6. Run the full verification sequence (steps 2–5 above) and confirm each step passes. If the byte-compat check (step 2) fails, the defect is in the new code — do not update the snapshot. Find and fix the divergence.
7. Commit in logical chunks: (a) infrastructure + baseline snapshot, (b) parser + IR + tests, (c) passthrough transformers + tests, (d) shells + tests, (e) renderer + integration test, (f) generator.js shrinkage. Each commit is atomic and green. Reference `IAM-78` in every commit body.
8. Push the branch and open a PR targeting `main`:
   ```
   gh pr create --base main --title "feat(deckforge): transformer architecture foundation (IAM-78)" --body "<description>"
   ```
9. Update Superset task `9f64810d-dda5-436b-9ec9-bd727a2b2c67` via `mcp__superset__update_task` with a brief summary of what was done and the PR URL.

## Open Questions

- [ ] **Hero shell parameters.** Design doc §9 flags that the hero shell needs real-world parameter sketches before committing to a schema. v1 accepts `{ title, subtitle, authors?, decoration? }` but this is intentionally minimal. If during implementation you find the existing `sample-deck.md` hero uses shape this can't express, open a comment on the Linear issue with the specific gap and either (a) add the minimum needed param, or (b) document the limitation in the hero shell's JSDoc and leave it for a follow-up plan. Do not design a hero-shell templating language in this plan.
- [ ] **Directive parsing placement.** The directive grammar (§2) lives in `src/parser.js`, but a case can be made for a standalone `src/directives.js`. Decide based on size: if directive parsing grows past ~80 lines, extract it; otherwise keep it in `parser.js`.

## Decision Log

| Decision | Rationale | Date |
| -------- | --------- | ---- |
| Zero new test deps; use `node --test` and a 30-line snapshot helper | Matches the repo's zero-dep ethos; no framework tax | 2026-04-11 |
| Image metadata uses `<!-- df: image width=48 -->` directive (not `{attrs}` extension) | Consistent with the rest of the grammar; one form to learn | 2026-04-11 |
| `stagger-in` is a parameter on list transformers, not a wrapper transformer | Avoids transformer-over-transformer composition complexity; design doc leans this way | 2026-04-11 (deferred — first affects v1 transformers plan) |
| Error UX: dev mode renders an error panel on the affected slide and continues; build mode exits non-zero | Fast iteration in dev, strict in CI | 2026-04-11 |
| Transformers may add structural/ordinal decoration (numbering, wrapping, re-formatting existing text) but never synthesize content words | Clarifies the idempotency rule against the `demo-card-grid` numbering case flagged in review | 2026-04-11 |
| Hero shell parameterization stays minimal in v1; richer schema deferred until 3+ real decks exist | Avoids painting into a corner per design doc §9 | 2026-04-11 |
| Scroll-driven narrative sequences are out of scope; defer to v3 | Design doc §9 already flags this | 2026-04-11 |

## Progress

- [ ] Pre-change baseline captured and committed
- [ ] Test harness (`test/helpers/snapshot.js`) in place
- [ ] Parser + IR + tests green
- [ ] Passthrough transformers for all 9 primitives + tests green
- [ ] Four shells + tests green
- [ ] Renderer + CSS/JS dedup + tests green
- [ ] `generator.js` shrunk to entry wiring; byte-compat diff clean
- [ ] Dev server hot-reload smoke-tested
- [ ] PR open against `main`
- [ ] Superset task updated

## Outcomes & Retrospective

(Filled at closeout)
