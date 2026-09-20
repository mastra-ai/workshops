---
name: create-slide
description: Create or extend a presentation in this open-slide repo using its theme templates. Use for new decks, new pages, and slide content; not for framework implementation.
---

# Create or extend a deck

Use [slide-authoring](../slide-authoring/SKILL.md) for the file contract and canvas constraints. For Mastra layouts and talk conventions, read its [presentation patterns](../slide-authoring/references/presentation-patterns.md) and the theme catalog.

## Resolve the scope first

- New deck: create `slides/<id>/index.tsx` plus any local `assets/`.
- Add a page to an existing deck: inspect its default page array, preserve its design and established preferences, and insert in the requested position. Move the matching `notes` entry with it.
- For “this slide”, consult [current-slide](../current-slide/SKILL.md). If a numbered page conflicts with the named content (e.g. page 13 is a video but the user says “website embed”), resolve that conflict before replacing unrelated content.
- Limit ordinary authoring edits to the requested deck. Theme/skill maintenance is a separate, explicitly requested workflow.

## Reuse the actual theme

Themes live under **`open-slide/themes/`**, assets under **`open-slide/assets/`**. The installed runtime lives under `open-slide/`; repo slides live alongside it.

When the user picks Mastra, read `open-slide/themes/mastra.md` and copy the needed recipe and its helpers from `open-slide/themes/mastra.demo.tsx`. The runnable demo is the template catalog, not merely loose inspiration. Set `meta.theme: 'mastra'`. Do not copy the whole catalog into a talk or import from another finished deck.

For a new deck without an established theme, list available themes and ask only if the choice cannot be inferred. Continue an existing deck in its current theme without asking again.

## Clarify only the missing decisions

Use the request and conversation to determine topic/audience, approximate length, density, and motion. Ask concise questions only for choices that materially affect the result and are not already supplied. A request for one minimal title slide is enough to begin; do not ask the full new-deck questionnaire for an incremental edit.

Mastra defaults from this repo:

- A talk uses a Talk badge, a centered title, no presenter line unless requested, and no deck-name or slide-count footer.
- A workshop can use the optional welcome, agenda, and host recipes. “Talk” and “workshop” are not interchangeable.
- New templates/decks support **system, light, and dark**, with system the default. A venue-specific request for light mode is an explicit override; preserve it.
- Use h1 for the cover, h2 for section/statement slides. Heading-only means no explanatory body; put supplied elaboration in speaker notes.
- Use restrained motion where it serves the layout. Keep QR codes fixed.

## Build and verify

1. Choose the smallest set of recipes that carries the requested content. Timeline chronology and historical feature mapping are bespoke: don't seed future decks with this talk’s years, model names, or claims.
2. Write a literal `meta.createdAt` only for a new deck, from `node -e "console.log(new Date().toISOString())"`. Preserve it when editing.
3. Keep explicit JSX instances for cards/pills, one source node per editable instance. Use the theme’s shared components within the single deck file.
4. Keep the default-export page order and `notes` array in sync after inserts, moves, and deletions.
5. Verify the changed page at 1920×1080. New reusable layouts must work in both palettes and reduced motion. Check embeds actually render, imported assets resolve, QR destinations match their links, and videos pause off-slide.
6. Reuse the running dev server. Start it only when authorized; prior authorization in the task persists. Don't start duplicate servers.

Report the concrete result and a useful preview link. Keep simple edit responses short.
