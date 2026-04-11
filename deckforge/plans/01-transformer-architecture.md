# DeckForge Transformer Architecture — Design Doc

**Status:** Draft · **Author:** pairing session · **Supersedes:** current `generator.js` rebuild-from-scratch model

## Problem

Today, `src/generator.js` rebuilds every slide's HTML from scratch on each markdown change. Any hand-applied visual enhancement (custom layouts, interactive toggles, syntax-highlighted code, etc.) is wiped on the next rebuild. This makes the "edit HTML directly, hot-reload" workflow that `CLAUDE.md` and `skills/enhance/SKILL.md` describe structurally unstable: the enhancer can only apply changes that survive until the author next touches the markdown.

We want: **markdown edits only change text content. Presentational choices persist across rebuilds.**

## Proposed model

A three-layer pipeline replaces the current one-shot generator:

```
markdown source
    │
    ▼
┌──────────────────────────────┐
│ 1. Parser                    │  marked → typed block tree per slide
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ 2. Slide IR                  │  shell (layout) + ordered blocks
└──────────────────────────────┘
    │    ▲
    │    │ transformer selection (per-block directives)
    ▼    │
┌──────────────────────────────┐
│ 3. Renderer                  │  for each block: transformer.render(ir)
│                              │      → { html, css, js }
│                              │  compose slide shell + blocks
└──────────────────────────────┘
    │
    ▼
slide HTML (deterministic, idempotent under text-only edits)
```

The key idempotency guarantee: if markdown text changes but transformer directives don't, the emitted HTML changes only in the text nodes. Presentational choices live in the markdown next to the content they apply to, so they move with reorders, survive rebuilds, and diff cleanly.

## 1. Base content primitives

The parser produces exactly this set of block types. Everything else is a transformer of one of these.

| Primitive | Markdown syntax | Notes |
| --- | --- | --- |
| `heading` | `#` / `##` / `###` | H1 = group, H2 = slide, H3 = subsection |
| `paragraph` | plain text with inline `**bold**` / `*italic*` / `` `code` `` | |
| `bullet-list` | `- item` / `* item` (flat) | |
| `nested-bullet-list` | `- item\n  - child` | Distinguished from flat list — enables richer transformers |
| `ordered-list` | `1. item` | |
| `code-block` | ``` ```lang ``` | Language tag preserved |
| `blockquote` | `> text` | |
| `image` | `![alt](url){attrs}` | Extended with optional `{width=… class=… }` — see "Image metadata" below |
| `horizontal-rule` | `---` | Used as explicit in-group slide break, as today |

**Not a primitive:** hero-slide decorations, floating elements, scroll sequences. Those are slide-shell concerns (§5).

**Explicitly dropped from the primitive surface:** free-form HTML blocks. Authors who need raw HTML can still write it, but it's treated as opaque `html-passthrough` — no transformer applies and no guarantee of idempotency.

## 2. Directive syntax

Transformer selection lives **inline in the markdown**, as HTML comments immediately preceding the block they apply to. This is the format authors already use informally across the decks, it survives `git mv`, it diffs cleanly, and it doesn't require a sidecar file.

### Block directive

```markdown
<!-- df: demo-card-grid -->
- **Admissions processing** — triage applications, flag anomalies
- **Student advising** — proactive outreach when students fall behind
- **Research compliance** — monitor IRB submissions
```

Syntax: `<!-- df: <transformer-name> [key=value ...] -->`

- Must appear on its own line, immediately before the block (blank line optional).
- Applies to the next block only.
- Unknown transformer name → build error (with suggestion).
- Invalid content shape for the named transformer → build error naming the specific requirement (`demo-card-grid` requires `**bold**` prefix on every item, etc.).

### Slide-shell directive

Slide-level choices live at the top of a slide, immediately after the H1/H2:

```markdown
## Core Architecture
<!-- df-slide: standard, label="Architecture" -->
```

Syntax: `<!-- df-slide: <shell-name> [key=value ...] -->`

- `shell` determines overall layout (`standard`, `hero`, `section-divider`, `centered`).
- Additional keys depend on the shell (e.g. `label`, `authors`, `decoration`).

### Inline span directive

For phrase-level styling inside a paragraph we use existing markdown where possible (`**bold**`, `` `code` ``). When that's not enough — highlighting a key term as accent color, marking a word for the gradient hero treatment — we use a minimal shortcode:

```markdown
The real opportunity is in {=agentic systems} — AI that can take action.
```

Syntax: `{=text}` highlights (accent color). Other variants: `{+text}` (positive/green), `{!text}` (warning/red), `{.type text}` for explicit coloring. Kept tiny deliberately; transformers cover the heavy lifting.

## 3. Transformer contract

Every transformer is a pure function:

```ts
type Transformer = {
  name: string;                              // e.g. "demo-card-grid"
  accepts: PrimitiveType[];                  // which IR blocks it can consume
  validate(block: Block, params): Result;    // shape + params check → error or ok
  render(block: Block, params, ctx): Output; // → { html, css, js }
};

type Output = {
  html: string;      // the block's markup
  css?: string;      // scoped to this transformer instance via slide-id
  js?: string;       // inline; wrapped in IIFE to avoid globals
};
```

Rules:

- Transformers receive **only the IR block** (no raw markdown, no sibling access).
- `css` and `js` are collected by the renderer and deduped by transformer name — two slides using `tui-window` emit its styles once per slide, keyed by class prefix.
- Transformers **never synthesize new text**. They may re-format what the primitive already contains, but if a transformer wants richer sub-structure (e.g. `mode-toggle` wanting a tagline + a use-case), it must require the author to provide it as a nested list. This is the idempotency rule: no transformer invents content, so text-only edits round-trip.
- Transformers can depend on classes in `shared.css`, but any transformer-specific animation keyframes must be declared in the transformer's own `css` output.

## 4. Initial transformer set (v1)

Six transformers in the first implementation — chosen to exercise every axis of the contract and cover the highest-frequency patterns from the research:

| Transformer | Input | Why it's in v1 |
| --- | --- | --- |
| `card-grid` | `bullet-list` with `**bold**` prefix on every item | Most-used pattern in the research; replaces today's implicit regex detection with an explicit directive |
| `demo-card-grid` | `bullet-list` (3–6 items) | Exercises "transformer adds numbering from the block's order" — pure re-formatting, no content invention |
| `stat-grid` | `bullet-list` with numeric prefix on every item | Exercises transformer-level content-shape validation |
| `callout` | `blockquote` or `paragraph` | Simplest non-trivial transformer; exercises param variants (`color=accent\|green\|yellow\|orange`) |
| `tui-window` | `code-block` | Exercises primitive-specific specialization; reuses `shared.css` classes |
| `mode-toggle` | `nested-bullet-list` (each parent = a mode, children = details) | Exercises inline JS output + the "require richer markdown to avoid synthesis" rule |

Defaults: if a block has no `df:` directive, it falls through to a built-in default renderer for its primitive — identical to today's output for regular lists, paragraphs, code blocks, etc. This gives a zero-migration path: existing decks keep rendering correctly until the author opts into a transformer.

Not in v1, deferred to v2: `flow-diagram`, `pipeline`, `phase-card-grid`, `roadmap-list`, `code-highlight-block`, `inline-note` (redundant with `callout` params).

## 5. Slide shells

A slide shell wraps the ordered block outputs and controls slide-level layout and any chrome that's not per-block. Shells are a closed set in v1 — authors pick one by name; they don't write custom shells.

| Shell | Use | Behavior |
| --- | --- | --- |
| `standard` | default for H2 slides | Renders blocks in order inside `.section.fade-on-scroll`. What the current `slideStyles()` output looks like. |
| `centered` | default for H1 (group) slides | Single-block vertical-center layout, `.section.centered`. |
| `hero` | opening slide | Richer version of `centered`: accepts `title`, `subtitle`, `authors[]`, `decoration` params; transformers render into a structured hero layout with the shared animation library (see §7). |
| `section-divider` | "Part One / Two / Three" slides between groups | `centered` + `section-label` + pulse animation, consistent across the deck. |

Shell selection precedence:

1. `<!-- df-slide: <shell> -->` directive if present.
2. Otherwise: H1 with `isGroupHeader=true` → `centered`; H1 that is the first slide of the deck → `hero`; other H1s → `section-divider`; H2 → `standard`.

## 6. Anchoring protocol (slide identity)

Today, slide identity is derived from `slugify(title)` with a numeric suffix for duplicates. This is fragile under renames and reorders — rename a heading and the output file moves, breaking any external link.

v1 rule:

- Primary identity: explicit `{#anchor}` on the heading, if provided:
  `## Core Architecture {#core-arch}` → `id = "core-arch"`
- Fallback: `slugify(title)` as today.
- On build, the IR also carries a **content hash** of the slide (stable hash of the block tree). This isn't used as identity — it's emitted as a `<meta name="df-content-hash">` in the output and logged in `deck.json`, so tooling can detect "text-only edit" vs. "structural edit" cheaply.

This gives: stable external URLs when authors opt in, current behavior when they don't, and a mechanism for future optimizations (e.g. skip re-rendering slides with unchanged content hashes).

## 7. What lives where

- `src/parser.js` (new) — markdown → IR. Owns the primitive list and directive parsing. No HTML concerns.
- `src/ir.js` (new) — type definitions and validation for blocks and slides.
- `src/transformers/` (new) — one file per transformer. Each exports the `Transformer` interface from §3.
- `src/shells/` (new) — one file per shell. Same contract, but consumes a list of transformer outputs and produces the slide body.
- `src/renderer.js` (new) — orchestrates: walks the IR, picks transformer per block, calls render, composes shell, deduplicates CSS/JS, emits final HTML file.
- `src/generator.js` — shrinks to a thin entry point that wires parser → renderer.
- `theme/shared.css` — unchanged except for (a) a new `animations.css` partial containing shared keyframes (`chipFloat`, `scatterIn`, `title-shimmer`, etc.) extracted from the workshop decks, and (b) minor additions as transformers need them.

## 8. Migration path

1. Land the parser + IR + renderer + default-passthrough transformers. At this point, builds are byte-compatible with today's output for any deck that has no directives.
2. Land the six v1 transformers.
3. Convert `examples/sample-deck.md` to use directives where enhancements were applied in this session. Verify hot-reload + text-edit round-trip.
4. Update `skills/enhance/SKILL.md` — the enhancement advisor now proposes *directives*, not HTML edits. The skill's job becomes "read the IR, suggest transformers," which is much narrower and more reliable than HTML review.
5. Deprecate the stale `examples/output/` directory and the implicit card-grid regex in `generator.js`.

## 9. Open questions

- **Image metadata syntax.** I proposed `![alt](url){width=48 class=avatar}`. Alternatives: fence-style `![alt](url)` on its own with a preceding `<!-- df: image width=48 -->` directive (consistent with the rest). The latter is probably cleaner — drops the `{attrs}` extension. Worth deciding before implementing.
- **How do transformers compose?** A `stagger-in` wrapper is a useful decoration that applies *to another block*. Options: (a) it's a parameter on every list-consuming transformer (`<!-- df: card-grid stagger -->`), (b) it's a separate transformer that wraps another (`<!-- df: stagger-in over=card-grid -->`), (c) it's a shell-level concern. I lean (a) — composition adds complexity disproportionate to the payoff.
- **Hero shell parameterization.** The research showed every workshop deck reinventing hero slides with slightly different shapes (author cards, floating chips, taglines). How many params does the `hero` shell need before it becomes a mini-templating language? Worth sketching two or three real hero slides against a proposed parameter set before committing.
- **Error UX.** On validation failure, does the build fail loudly, or emit a slide with an error panel and continue? I lean "continue with error panel" for dev, "fail loudly" for production builds.
- **Scroll-driven narrative sequences** (om-workshop/02-the-problem.html). These don't fit shells or transformers cleanly. Probably a v3 problem — defer.

## 10. Decision checklist

Before writing code, we need the author (you) to commit to:

- [ ] Primitive list in §1 is the right set (nothing missing, nothing superfluous)
- [ ] Directive syntax in §2 (`<!-- df: ... -->`, `<!-- df-slide: ... -->`, `{=…}` inline) is acceptable
- [ ] Transformer contract in §3 — specifically the "never synthesize content" rule
- [ ] v1 transformer set in §4 is the right six
- [ ] Shell set in §5 is the right four
- [ ] Anchoring protocol in §6
- [ ] Module layout in §7
- [ ] Answers (or deferrals) on the open questions in §9

Once those are locked, implementation is a straightforward sequence: parser → IR validation → renderer shell → six transformers → migrate sample-deck → update skill.
