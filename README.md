# Mastra Company Presentations

All decks are React modules served by [open-slide](https://github.com/vercel-labs/open-slide). One dev server, one build, one design language.

## Decks

| Deck | URL | Description |
|------|-----|-------------|
| **Browser & Channels** | [`/s/browser-channels`](slides/browser-channels/) | Two primitives every agent needs: Browser to drive a screen, Channels to be reachable. |
| **Building Agents That Never Forget** | [`/s/om-workshop`](slides/om-workshop/) | Observational Memory + Harness Architecture. |
| **Agent Harness** | [`/s/harness-workshop`](slides/harness-workshop/) | What it is, why it matters, and what it enables. |
| **Guardrails and Beyond** | [`/s/processors-workshop`](slides/processors-workshop/) | Control the agent loop with Mastra Processors. |
| **Mastra 101 Masterclass** | [`/s/mastra-101-masterclass`](slides/mastra-101-masterclass/) | End-to-end Mastra fundamentals with a support/refund follow-along. |

## Running

```bash
pnpm install
pnpm dev      # http://localhost:5173 — dashboard lists every deck
              # http://localhost:5173/s/<deck-id> jumps straight to one
pnpm build    # static production build into ./dist
pnpm preview  # serve the production build
```

**Keyboard navigation:** ← → arrow keys move between slides.

## Creating a New Deck

1. Add a directory under `slides/<deck-id>/` with an `index.tsx` that default-exports an array of `Page` components.

```tsx
import type { Page, SlideMeta } from '@open-slide/core';

const Cover: Page = () => (
  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <h1>Hello, world.</h1>
  </div>
);

export const meta: SlideMeta = { title: 'My New Deck' };

export const notes: (string | undefined)[] = [
  `Speaker notes for slide 1.`,
];

export default [Cover] satisfies Page[];
```

2. (Optional) Add a `slides/<deck-id>/deck.json` with per-slide nav labels.
3. (Optional) Drop assets in `slides/<deck-id>/assets/` and import them.

The dashboard auto-discovers any deck under `slides/`.

### Design conventions

The four shipping decks share a brand palette so they feel like one talk series:

- Background `#020202`, foreground `#d9d9d9`, accent `#18fb6f`.
- Geist for display + body, Geist Mono for code.
- Canvas is fixed at 1920×1080. Every slide must fit without scrolling.

Existing decks expose their tokens as named exports (`palette`, `font`, atoms like `Eyebrow`, `Footer`, `Pill`, `Stage`, `SectionTitle`, `SubTitle`). Copy from the most recent one when starting a new deck.

## Project Structure

```
├── slides/
│   ├── browser-channels/
│   ├── om-workshop/
│   ├── harness-workshop/
│   └── processors-workshop/
├── examples/                       # Workshop code examples
├── open-slide.config.ts
├── package.json
└── tsconfig.json
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
| `examples/07-harness-workshop` | Agent harness workshop example |
| `examples/08-multi-agent-networks` | Council + supervisor multi-agent demos |
| `examples/09-browser-channels-workshop` | Browser + Channels workshop example |
| `examples/10-mastra-101-masterclass` | Follow-along support/refund app for the Mastra 101 deck |

Each example directory has its own `package.json`. Install and run individually — see each example's README for instructions.

## Links

- [mastra.ai](https://mastra.ai)
- [github.com/mastra-ai/mastra](https://github.com/mastra-ai/mastra)
- [discord.gg/mastra](https://discord.gg/mastra)
