# DeckForge Requirements

## Who it's for

Workshop authors who want to write a presentation in Markdown and get a polished HTML deck without a build-system tax. The author is technical (comfortable editing HTML by hand when needed) but does not want to run a bundler, learn a framework, or maintain a static-site generator.

## What authors can do today

- Write a single `.md` file per deck.
- Run `deckforge dev <file.md>` and get a live-reloading browser preview with one HTML file per slide.
- Run `deckforge build <file.md>` and get a static deck ready to publish.
- Hand-edit generated HTML while the dev server is running; edits hot-reload.
- Review and enhance slides via the `skills/enhance/SKILL.md` advisor workflow.

## Known limitations (driving the transformer architecture)

1. **Hand-applied enhancements are ephemeral.** Any edit to the generated HTML is wiped on the next markdown change, because the generator rebuilds each slide from scratch. Authors cannot trust that their visual choices will survive a typo fix.
2. **No explicit component selection.** The current generator detects card-grids via a regex over bullet list shape. Authors cannot opt in or out, cannot choose between visual variants, and cannot compose effects.
3. **Slide identity is derived from the title slug.** Renaming a heading moves the output file and breaks external links.
4. **No test harness.** Regressions in the generator surface only when a deck visibly breaks.

## What the transformer architecture unlocks

- **Markdown edits only change text content.** Presentational choices persist across rebuilds because they live in directives next to the content, not in the emitted HTML.
- **Explicit component selection.** `<!-- df: card-grid -->` before a bullet list says exactly what the author wants. Unknown transformer names fail the build with a suggestion.
- **Stable slide identity.** Optional `{#anchor}` on a heading pins the output filename; renames no longer break links.
- **A test harness.** `node --test` covers parser primitives, transformer validation and output, and end-to-end fixture decks.

See `plans/01-transformer-architecture.md` for the full design and `plans/` for the active ExecPlans delivering it.
