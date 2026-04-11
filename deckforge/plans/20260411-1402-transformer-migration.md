# ExecPlan: Transformer Architecture — Migration, Skill Update, Legacy Cleanup

## Purpose

After this change, DeckForge's flagship example (`examples/sample-deck.md`) uses the new directive syntax for every visual enhancement that previously required hand-edited HTML. The round-trip is proven end-to-end: an author can edit text in the markdown, rebuild, and see their enhancement choices persist. The `skills/enhance/SKILL.md` advisor no longer proposes HTML edits; it proposes *directives*. The legacy `examples/output/` directory and the implicit card-grid regex in the old generator are removed.

This is the plan that closes the loop. The foundation built the pipeline, the v1 transformer plan filled it, and this plan proves the whole thing works for a real deck and updates the advisor workflow so new decks start in the directive-first world.

## Context

- **Linear Issue:** [IAM-80](https://linear.app/iam-ms/issue/IAM-80)
- **Superset Task:** `578dd72a-6f90-414d-886c-7bb5b0e89c7a`
- **Depends on:** [IAM-78](https://linear.app/iam-ms/issue/IAM-78) (foundation) and [IAM-79](https://linear.app/iam-ms/issue/IAM-79) (v1 transformers) must both be merged to `main`.
- **Blocks:** nothing. This is the final plan in the transformer architecture rollout.
- **Design doc:** `plans/01-transformer-architecture.md` §8 (migration path) is the primary reference.

## Scope

### Files to modify

- `examples/sample-deck.md` — add directives for every block that currently relies on the implicit card-grid regex or hand-applied HTML enhancement. Every directive addition must be accompanied by a markdown text that matches the transformer's shape requirement (e.g. bullet items prefixed with `**bold**` for `card-grid`). **No content words are added or removed** — only directive comments and, where necessary, minimal restructuring of existing content to match shape requirements (e.g. adding a bold prefix to a bullet item that already had the same text as a sentence).
- `skills/enhance/SKILL.md` — rewrite the advisor instructions. The new version instructs the advisor to: (a) read the IR for the current slide via a new dev-server endpoint, (b) propose directives by name with a short rationale, (c) stop proposing raw HTML edits. Include the complete list of v1 transformers and when to pick each. Remove the component-catalog-based HTML-review workflow.
- `src/server.js` — add an IR-inspection endpoint: `GET /ir?slide=<slug>` returns the IR JSON for the given slide. Used by the enhance advisor. Small addition, ~30 lines.
- `src/generator.js` — remove the implicit card-grid regex if any of it still exists post-foundation. The foundation plan shrunk generator.js to an entry point, but if any detection logic survived, delete it now.
- `bin/deckforge.js` — no functional changes; but verify that `deckforge build` still exits non-zero on any directive error as designed.
- `README.md` (if present) or `CLAUDE.md` — update the "how to enhance a deck" section to reflect directives over HTML editing.

### Files to delete

- `examples/output/` — entire directory. Stale artifacts, not used by the dev server (which writes to `.deckforge-output/`). Confirm nothing in `bin/`, `src/`, or tests references `examples/output/` before deleting.
- Any leftover HTML-enhancement docs that referenced the old workflow.

### Files to create (tests)

- `test/roundtrip.test.js` — the end-to-end regression test that proves the whole pipeline works. Loads `examples/sample-deck.md`, builds it, then programmatically applies a small text edit (replace one word with a synonym), rebuilds, and asserts: (a) the output of the edited build differs from the original only in the specific text nodes that should have changed, and (b) all directive-driven visual elements (cards, callouts, TUI windows, mode toggles) are present in both outputs with identical structure. This is the idempotency rule, verified as a test.

### Existing code context

- After foundation + v1 transformers, the working tree has: a full `src/parser.js` → `src/ir.js` → `src/renderer.js` pipeline, six transformers in `src/transformers/`, four shells in `src/shells/`, and a test suite under `test/`.
- `examples/sample-deck.md` currently builds byte-identically to its pre-transformer output (locked in by `test/snapshots/sample-deck/`). This plan will break that snapshot intentionally — the sample deck now uses directives, so its output is different (and richer) than pre-transformer. **You must update `test/snapshots/sample-deck/` in this plan** to reflect the new desired output. Delete the old snapshot files and regenerate.
- `skills/enhance/SKILL.md` currently documents a component catalog and instructs the advisor to hand-edit HTML files in `.deckforge-output/`. Full rewrite.
- `CLAUDE.md` at the deckforge root has an "Enhancement Advisor" section pointing at the old workflow. Update to reference the new directive-based workflow.

### Conventions (from `AGENTS.md`)

- Markdown edits in `examples/sample-deck.md` must preserve existing content words. Directive comments are additive; minor restructuring (bold prefixes, nested lists) is allowed where required by the transformer's shape contract. Do not rewrite prose.
- The roundtrip test has zero new dependencies; it uses the existing snapshot helper and `node:test`.
- Conventional commits with `Refs: IAM-80` in the body.

## Verification

1. **Full test suite:**
   ```
   cd deckforge
   npm test
   ```
   Expected: all tests pass, including the new `test/roundtrip.test.js`.

2. **Updated sample-deck snapshot:**
   ```
   cd deckforge
   npm run build examples/sample-deck.md
   diff -r examples/sample-deck.deckforge-output test/snapshots/sample-deck
   ```
   Expected: no diff against the *new* snapshot committed in this plan.

3. **Manual round-trip smoke test:**
   ```
   cd deckforge
   npm run dev examples/sample-deck.md
   ```
   Open the browser. Visually confirm every directive-enhanced slide renders correctly (cards, callouts, TUI windows, mode toggles). Edit one word of prose in the markdown — watch the browser hot-reload and confirm the visual enhancements survive. Edit a second word. Kill the server. Confirm `git diff examples/sample-deck.deckforge-output` shows changes **only in text nodes** — no structural HTML diff.

4. **Advisor skill smoke test:**
   With the dev server running, hit `http://localhost:<port>/ir?slide=<some-slug>`. Expected: valid IR JSON. This is the new inspection endpoint the advisor uses.

5. **Legacy cleanup verification:**
   ```
   cd deckforge
   ls examples/output 2>&1
   grep -r "examples/output" src/ bin/ test/ 2>&1
   grep -r "card.grid.*regex\|regex.*card.grid" src/ 2>&1
   ```
   Expected: `examples/output` does not exist; no surviving references to it in source; no card-grid regex anywhere.

6. **Enhance skill read-through:**
   Read `skills/enhance/SKILL.md` end to end. Confirm it contains: (a) a list of all six v1 transformers with a one-line "use this when" for each, (b) the `GET /ir?slide=` inspection workflow, (c) no instructions to edit `.deckforge-output/` HTML files. If any of those are missing, fix.

## Instructions

You are running fully autonomously. Do not ask questions or wait for user feedback.

**⚠️ CRITICAL: All PRs MUST target `main`. Use `gh pr create --base main`.**

**📝 Memory note:** This repo does not use `.claude/memory/`. Ignore any memory-loading instructions from upstream templates. Sources of truth: `deckforge/AGENTS.md`, `deckforge/docs/architecture.md`, `deckforge/docs/planning.md`, `deckforge/plans/01-transformer-architecture.md`.

1. Confirm both the foundation plan (IAM-78) and v1 transformers plan (IAM-79) are merged to `main`. If either is not, stop and escalate.
2. Read `deckforge/AGENTS.md`, `deckforge/docs/architecture.md`, `deckforge/plans/01-transformer-architecture.md` §8, `skills/enhance/SKILL.md`, and both predecessor plans in full.
3. Read `examples/sample-deck.md` end to end. For each slide, decide which transformer (if any) best matches the existing content. Cross-reference with the pre-transformer output in `test/snapshots/sample-deck/` to see what visual intent the author had. Record your per-slide decisions in a scratchpad; you'll fold them into the Decision Log.
4. Add the IR-inspection endpoint to `src/server.js` first — the advisor skill depends on it, and it's a small, low-risk change.
5. Edit `examples/sample-deck.md` slide by slide. For each: add the directive, adjust the markdown text minimally to satisfy the transformer's shape contract (add bold prefixes, nest lists, etc.), run `npm run build examples/sample-deck.md`, and visually inspect the output. Do not move on until that slide looks correct.
6. Regenerate the sample-deck snapshot:
   ```
   rm -rf test/snapshots/sample-deck
   cp -R examples/sample-deck.deckforge-output test/snapshots/sample-deck
   ```
   Commit the new snapshot in a single dedicated commit so the diff is reviewable.
7. Write `test/roundtrip.test.js`. The test must fail if a text-only edit produces any structural HTML diff.
8. Rewrite `skills/enhance/SKILL.md`. Use the predecessor as a starting point for tone and structure; replace the component catalog with the transformer list; replace the HTML-edit workflow with the directive-proposal workflow.
9. Update `deckforge/CLAUDE.md`'s Enhancement Advisor section to point at the new skill behavior.
10. Delete `examples/output/` after confirming nothing references it.
11. Run the full verification sequence. Every step must pass.
12. Commit in logical chunks (advisor endpoint, sample-deck migration, snapshot update, roundtrip test, skill rewrite, legacy cleanup). Each atomic, each referencing `IAM-80`.
13. Open a PR against `main`:
    ```
    gh pr create --base main --title "feat(deckforge): sample-deck migration, skill update, legacy cleanup (IAM-80)" --body "<description>"
    ```
14. Update Superset task `578dd72a-6f90-414d-886c-7bb5b0e89c7a` via `mcp__superset__update_task` with a summary and PR URL.

## Open Questions

- [ ] **Which slides in `sample-deck.md` get which transformer?** You have to make this call per slide. Rule of thumb: if the slide already *visually* looks like one of the six transformers, opt it in; if it doesn't match any, leave it as passthrough (directive-free). Don't force-fit.
- [ ] **IR-inspection endpoint auth.** The `GET /ir?slide=` endpoint is dev-server-only and already behind the dev server's localhost binding. No auth needed in v1. If the dev server ever binds to non-localhost, revisit.
- [ ] **Deletion blast radius of `examples/output/`.** Grep the whole repo, including workshop directories outside `deckforge/`, before deleting. If any external workshop deck links into `deckforge/examples/output/`, preserve or redirect those references.

## Decision Log

| Decision | Rationale | Date |
| -------- | --------- | ---- |
| Update `test/snapshots/sample-deck/` to reflect the new directive-driven output (snapshot is intentionally broken by this plan) | Migration plan's deliverable is the new output shape; byte-compat with pre-transformer is no longer the goal | 2026-04-11 |
| New roundtrip test enforces "text-only edit → text-only diff" | This is the core invariant of the whole architecture; it deserves a direct test | 2026-04-11 |
| Advisor skill rewrite is complete replacement, not incremental addition | Old workflow (HTML edits) is obsolete; keeping it alongside would confuse the advisor | 2026-04-11 |
| `examples/output/` deletion happens in this plan, not earlier | Deleting it earlier could break hand-tested deck workflows; wait until the migration proves the replacement works | 2026-04-11 |

## Progress

- [ ] Foundation + v1 transformer plans merged
- [ ] IR-inspection endpoint in `src/server.js`
- [ ] `examples/sample-deck.md` migrated slide by slide
- [ ] New `test/snapshots/sample-deck/` committed
- [ ] `test/roundtrip.test.js` green
- [ ] `skills/enhance/SKILL.md` rewritten
- [ ] `deckforge/CLAUDE.md` updated
- [ ] `examples/output/` deleted, no dangling references
- [ ] All verification steps green
- [ ] PR open against `main`
- [ ] Superset task updated

## Outcomes & Retrospective

(Filled at closeout)
