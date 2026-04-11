# DeckForge

A Markdown-driven HTML presentation framework with LLM-powered enhancement advising.

## Project Structure

- `src/` — Node.js build system (generator, organizer, dev server)
- `theme/` — shared.css and shared.js design system
- `cli/` — Rust CLI for model-agnostic enhancement advising
- `skills/enhance/SKILL.md` — Enhancement advisor instructions and component reference
- `examples/` — Sample deck and build output

## Enhancement Advisor

When asked to review or enhance slides in a DeckForge deck, read `skills/enhance/SKILL.md` first — it contains the full component catalog, CSS class reference, and instructions for how to suggest and apply visual enhancements to generated slide HTML files.

The typical workflow:
1. The dev server is running (`node bin/deckforge.js dev <file.md>`)
2. You review each slide HTML in the dev server's output directory
3. Suggest enhancements based on the component library
4. When the author approves, edit the HTML files directly — the dev server hot-reloads

**IMPORTANT — which output directory to edit:** The dev server writes to `<deck-dir>/.deckforge-output/` by default (see `src/server.js` — `outputDir` defaults to `path.join(path.dirname(mdPath), '.deckforge-output')`). This is the directory your edits must target for hot-reload to work. Do **not** edit any other `output/` folder that may exist alongside the markdown — those are stale build artifacts and are not served by the dev server. If unsure, confirm with the author which command they ran, or check which directory contains the most recently modified `deck.json`.

## Key Files

- `theme/shared.css` — All available CSS classes and design tokens
- `theme/shared.js` — Client-side JS (animations, nav, typewriter, stagger)
- Output directories contain `deck.json` (manifest), individual `.html` slide files, and copied theme assets
