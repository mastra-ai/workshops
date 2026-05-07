# Mastra Company Presentations

Two flavors of decks live in this repo:

1. **open-slide decks** — React, served by a single dev server at the repo root. Source lives in `slides/<deck-id>/`.
2. **Legacy HTML decks** — vanilla HTML/CSS/JS with a flatten step. Source lives in `decks/<deck-id>/`.

## Decks

### open-slide (React, run from repo root)

| Deck (URL) | Description |
|------------|-------------|
| [`/s/browser-channels`](slides/browser-channels/) | "Browser & Channels" — deep dive on the Browser and Channels primitives. |
| [`/s/om-workshop`](slides/om-workshop/) | "Building Agents That Never Forget" — Observational Memory + Harness Architecture. |

```bash
pnpm install
pnpm dev      # http://localhost:5173 — dashboard lists all open-slide decks
              # http://localhost:5173/s/<deck-id> for a specific deck
pnpm build    # static production build into ./dist
```

Each deck is a single `slides/<deck-id>/index.tsx` exporting a `Page[]` plus optional `meta` and `notes`.

### Legacy HTML (vanilla, no build server)

| Deck | Description |
|------|-------------|
| [decks/processors-workshop](decks/processors-workshop/) | "Processors: Beyond Guardrails" |
| [decks/harness-workshop](decks/harness-workshop/) | "Agent Harness" |
| [decks/component-showcase](decks/component-showcase/) | Reference deck for the legacy design system |

```bash
pnpm flatten          # bakes partials into each HTML slide + writes decks/index.html
open decks/index.html # legacy hub page
```

**Keyboard navigation:** ← → arrow keys move between slides (both flavors).

## Creating a New Deck

1. Create a directory under `decks/` with a `deck.json`:

```json
{
  "title": "My New Deck",
  "slides": [
    { "file": "01-intro.html", "nav": "Intro" },
    { "file": "02-content.html", "nav": "Content" }
  ]
}
```

2. Create slide files — each is a complete HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Intro — My New Deck</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="shared.css">
    <style>/* per-slide styles */</style>
</head>
<body>
<nav class="topnav">
    <a href="01-intro.html" class="topnav-brand">My New Deck</a>
    <div class="topnav-sections">
        <a href="01-intro.html">Intro</a>
        <a href="02-content.html">Content</a>
    </div>
</nav>
<div class="page">
    <main class="main">
        <!-- your content -->
    </main>
</div>
<script src="shared.js"></script>
<script>initKeyNav(null, "02-content.html");</script>
</body>
</html>
```

3. Copy `shared.css` and `shared.js` from `shared/` into your deck directory.

4. Run `node flatten.js` to regenerate the root and deck index pages.

See `decks/component-showcase/` for examples of every available component.

## Project Structure

```
├── index.html            # Root hub page linking all decks
├── flatten.js            # Regenerate index pages & copy shared assets
├── shared/               # Source of truth for shared design system
│   ├── shared.css        # CSS variables, components, utilities (1600+ lines)
│   └── shared.js         # Navigation, animations, helpers
├── decks/                # Each subdirectory is a self-contained deck
│   ├── om-workshop/                  # 11 slides + shared.css/js (HTML)
│   ├── processors-workshop/          # 10 slides + images + shared.css/js (HTML)
│   ├── harness-workshop/             # 12 slides + shared.css/js (HTML)
│   ├── component-showcase/           # 8 slides + shared.css/js (HTML)
│   └── browser-channels-workshop/    # 21 slides (open-slide / React)
└── examples/             # Workshop code examples
```

## Workshop Examples

| Directory | Description |
|-----------|-------------|
| `examples/00-personal-assistant-agent` | OM-powered personal assistant agent |
| `examples/01-code-research-agent` | OM-powered code research agent |
| `examples/02-playwright-agent` | OM-powered Playwright browser agent |
| `examples/03-mastra-code` | Progressive MastraCode agent examples (basic → full TUI) |
| `examples/04-guardrails` | Basic guardrails processor example |
| `examples/05-beyond-guardrails` | Advanced processor patterns beyond guardrails |
| `examples/06-enterprise-pipeline` | Enterprise-grade processor pipeline |

Each example directory has its own `package.json`. Install and run individually — see each example's README for instructions.

## Links

- [mastra.ai](https://mastra.ai)
- [github.com/mastra-ai/mastra](https://github.com/mastra-ai/mastra)
- [discord.gg/mastra](https://discord.gg/mastra)
