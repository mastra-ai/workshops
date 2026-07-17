# Mastra Workshops

Workshop code lives in top-level directories. The decks and their OpenSlide project live under `slides/`.

## Workshops

| Title | Code | Slides |
| --- | --- | --- |
| Agent-to-Agent with Mastra ([Luma](https://luma.com/mastra-d04q)) | `agent-to-agent` | `slides/agent-to-agent` |
| What is an Agent Harness? And How to Build a Great One! ([Luma](https://luma.com/mastra-0kae)) | `agent-harness` | `slides/agent-harness` |
| Channels and Browser Deep Dive ([Luma](https://luma.com/hkoc0rjj)) | `channels-and-browser` | `slides/channels-and-browser` |
| Introducing Observational Memory + How We Used It To Build A Coding Agent (w/ Mastra) ([Luma](https://luma.com/nn4nxix8)) | `personal-assistant-agent`, `code-research-agent`, `playwright-agent`, `mastra-code` | `slides/observational-memory` |
| Mastra 101 Masterclass | `mastra-101` | `slides/mastra-101` |
| Building Multi-Agent Architectures with Mastra ([Luma](https://luma.com/nctl14q0)) | `multi-agent-architectures` | None |
| Guardrails and beyond: Control the agent loop with Mastra processors ([Luma](https://luma.com/jz42wrql)) | `guardrails`, `beyond-guardrails`, `enterprise-pipeline` | `slides/processors` |
| Wake, Notify, and Steer Long-Running Agents with Signals ([Luma](https://luma.com/mastra-ka8t)) | None | `slides/signals` |
| Build a Software Factory with Mastra ([Luma](https://luma.com/mastra-fxyk)) | None | `slides/software-factory` |
| Build Realtime Voice Agents with Mastra ([Luma](https://luma.com/mastra-4h08)) | None | `slides/realtime-voice-agents` |

## Running

```bash
cd slides
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # static production build into slides/dist
pnpm preview
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
├── agent-to-agent/
├── channels-and-browser/
├── guardrails/
├── mastra-101/
├── ...                             # Other workshop code
└── slides/
    ├── agent-to-agent/
    ├── channels-and-browser/
    ├── processors/
    ├── ...                         # Other decks
    ├── open-slide.config.ts
    ├── package.json
    └── tsconfig.json
```

## Links

- [mastra.ai](https://mastra.ai)
- [github.com/mastra-ai/mastra](https://github.com/mastra-ai/mastra)
- [discord.gg/mastra](https://discord.gg/mastra)
