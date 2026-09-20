---
name: create-theme
description: Create, extract, or update a reusable open-slide theme and its runnable template catalog. Use for theme/template work, including learning patterns from an existing deck; not for ordinary deck edits.
---

# Create or update a theme catalog

Read [slide-authoring](../slide-authoring/SKILL.md) for canvas and file contracts. This repo stores paired theme files at **`open-slide/themes/<id>.md`** and **`open-slide/themes/<id>.demo.tsx`**. Shared brand assets belong in `open-slide/assets/` and import through `@assets`.

The markdown describes the visual system and maps authoring requests to recipes. The `.demo.tsx` is a runnable, self-contained catalog with a default `Page[]` export. It appears at `/themes/<id>` and does not create a real deck. Keep them in agreement; prefer linking to named source components over maintaining long, divergent copies.

## Extract useful decisions

Use the specified conversation, deck, or images. Distinguish stable design preferences from content chosen for one talk:

- Carry forward hierarchy, alignment, density, sizing, motion, media behavior, and reusable controls.
- Preserve configurable choices such as Talk vs Workshop, optional host details, and footer visibility.
- Do not turn specific presenter handles, authenticated URLs, private screenshots, models, dates, or researched timeline claims into template defaults.
- Use the actual supplied brand assets and font. Avoid redrawing an approximate logo.
- Update an existing theme when requested; leave finished decks unchanged unless explicitly included in scope.

For this repo’s learned slide patterns, consult [presentation-patterns.md](../slide-authoring/references/presentation-patterns.md). It is authoring guidance, not an outline that every talk must follow.

## Appearance is part of every recipe

Every template page must support **light and dark**, following `prefers-color-scheme` by default. Also provide an explicit per-deck or per-page `light | dark | system` override for venues and exports.

- Scope CSS variables under the theme root. Define complete pairs for background, panel, shell, text, muted text, border, accent, code tokens, highlighter, pills, and action buttons.
- Use the same geometry in both modes. Validate brand contrast, muted features, code tokens, and highlights in each.
- Do not infer slide mode from the editor’s `.dark` class or change the OS setting. Use CSS media queries so system changes apply without a reload.
- Fixed screenshots, videos, QR codes, and external pages keep their source colors. The wrapper, loading/fallback UI, and controls are themed. Do not invert screenshots or claim an external page was recolored.
- Keep QR symbols black on a white quiet zone. Default overlays to 80% opacity and verify scanning against the actual background; opacity is configurable.
- Printed/frozen previews need a stable layout and no animation. Respect reduced motion.

The current Mastra implementation exports `design` for typography and the light base palette, then sets scoped `--mt-*` colors for dark mode. The dark palette is explicit in the stylesheet, not a second Design-panel palette. Document this limitation instead of silently promising dual-palette Design-panel editing.

## Catalog composition

Use enough pages to demonstrate distinct recipes; there is no arbitrary 2–3 page limit. A Mastra catalog should cover the minimal cover, h2 sections, heading-only statements, command/code, irregular feature pills, cards, screenshot layouts, full-screen web/video/local demos, Demo overlay, and QR closers. Retain optional workshop welcome/agenda/hosts.

Each page should be copyable with its named helpers from the same module. Keep content instances explicit so the inspector can target them independently. Put explanation, sample requirements, and sources in aligned `notes` entries, not template body copy.

Media examples may use a clearly labeled fixture or public sample. Keep private/presenter-specific assets in the original deck. Promote only reusable brand assets such as logos and the public Mastra QR.

## Markdown contract

Include Palette (paired values), Typography, Layout, Fixed components (source locations and paste-ready core snippets), Motion, Aesthetic, and Example usage. Add a recipe table with names and dependencies. Explain appearance overrides and how to copy recipes without importing the demo at runtime into a production deck.

## Verify before finishing

- Compile/build the catalog with the installed runtime; do not add packages just for authoring.
- Review every recipe in light and dark. Check real bounds and readable contrast, not only successful compilation.
- Verify `system` selects the matching palette and explicit overrides win. Check reduced-motion/print rules and live media behavior separately: the Themes gallery intentionally freezes motion and intercepts interaction.
- Use an isolated temporary preview for interaction QA if needed; remove it afterward. Reuse an authorized dev server.
- Verify real QR destinations, static overlay positions during animation, active-page video pausing, link targets, and embed loading/fallback.
- Check the documented recipe count and notes match the default export. No bespoke timeline content or accidental changes to the completed deck.

Tell the user which skills/theme files changed, where to preview, and the relevant validation results.
