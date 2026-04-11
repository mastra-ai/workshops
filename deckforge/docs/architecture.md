# DeckForge Architecture

## Current state (pre-transformer)

`src/generator.js` walks a marked token tree in a single pass and emits HTML per slide. Card-grids are detected implicitly via a regex over bullet lists. Hand-applied visual enhancements live in the emitted HTML files and are wiped on the next rebuild.

## Target state (transformer architecture)

Three-layer pipeline:

```
markdown source
    │
    ▼
  Parser       marked → typed block tree per slide (src/parser.js)
    │
    ▼
  Slide IR     shell (layout) + ordered blocks (src/ir.js)
    │    ▲
    │    │ transformer selection (per-block directives)
    ▼    │
  Renderer    walks IR, picks transformer per block, composes slide shell,
              dedupes CSS/JS, emits final HTML (src/renderer.js)
    │
    ▼
  slide HTML (deterministic, idempotent under text-only edits)
```

The full design — primitive list, directive grammar, transformer contract, v1 transformer set, slide shell set, anchoring protocol, module layout, migration path, and open questions — lives in **`plans/01-transformer-architecture.md`**. That is the source of truth for §1–§7 of the design. This file is a pointer; do not duplicate the design doc here.

## Key invariants

1. **Text-only edits round-trip.** Changing a word in markdown changes only text nodes in HTML. This is enforced by the transformer contract (see `AGENTS.md` → "The idempotency rule").
2. **Directive selection is explicit.** No implicit pattern matching — a bullet list becomes a `card-grid` only if `<!-- df: card-grid -->` precedes it.
3. **Transformers are pure.** They receive an IR block and return `{ html, css?, js? }`. No file I/O, no DOM, no access to siblings.
4. **Zero migration required.** Directive-free decks build byte-compatibly with pre-transformer output.

## Runtime topology

- **Build mode:** `deckforge build <file.md>` parses once, renders all slides, writes to `.deckforge-output/` by default.
- **Dev mode:** `deckforge dev <file.md>` builds once, then watches the markdown file and any linked assets with `chokidar`. On change, it re-parses, re-renders, and pushes a reload signal over a `ws` socket to the browser.
- **Hot-reload target:** browsers connect to the dev server's socket on page load. The dev server writes to `<deck-dir>/.deckforge-output/`; any other `output/` dirs are stale artifacts and must not be edited (see `CLAUDE.md`).
