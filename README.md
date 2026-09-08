# Mastra Company Presentations

All decks are React modules served by [open-slide](https://github.com/1weiho/open-slide). One dev server, one build, one design language.

## Workshops

| Workshop | Slides | Code |
|----------|--------|------|
| **MCP is so back! Build Tools for the Agents Your Users Already Use**<br>Daniel Lew and Alex Booker show how to expose one product through bounded tools, resources and workflows. Development preview; coordinated MCP v2 release gate pending. | [`mcp-product-workshop`](slides/mcp-product-workshop/) | [`14-mcp-product-workshop`](examples/14-mcp-product-workshop/) |
| **Building Agents That Never Forget**<br>Connects observational memory, agent harnesses, and MastraCode through four progressive agent examples. | [`om-workshop`](slides/om-workshop/) | [`00-personal-assistant-agent`](examples/00-personal-assistant-agent/)<br>[`01-code-research-agent`](examples/01-code-research-agent/)<br>[`02-playwright-agent`](examples/02-playwright-agent/)<br>[`03-mastra-code`](examples/03-mastra-code/) |
| **Guardrails and Beyond**<br>Demonstrates Mastra Processors through input guardrails, model routing, monitoring, cost controls, and enterprise pipelines. | [`processors-workshop`](slides/processors-workshop/) | [`04-guardrails`](examples/04-guardrails/)<br>[`05-beyond-guardrails`](examples/05-beyond-guardrails/)<br>[`06-enterprise-pipeline`](examples/06-enterprise-pipeline/) |
| **Agent Harness**<br>Shows how a harness gives agents subagents, MCP tools, event streaming, terminal interfaces, and server-hosted chat. | [`harness-workshop`](slides/harness-workshop/) | [`07-harness-workshop`](examples/07-harness-workshop/) |
| **Multi-Agent Networks**<br>Explores supervisor and council patterns for coordinating specialized agents and synthesizing their results. | None | [`08-multi-agent-networks`](examples/08-multi-agent-networks/) |
| **Browser & Channels**<br>Covers browser-driven screen interaction and channels-based reachability for agents. | [`browser-channels`](slides/browser-channels/) | [`09-browser-channels-workshop`](examples/09-browser-channels-workshop/) |
| **Mastra 101 Masterclass**<br>Builds a support and refund agent through tools, memory, RAG, workflows, processors, evaluation, and deployment. | [`mastra-101-masterclass`](slides/mastra-101-masterclass/) | [`10-mastra-101-masterclass`](examples/10-mastra-101-masterclass/) |
| **ACP and A2A Protocols**<br>Introduces ACP, A2A, and MCP through a release-research supervisor that delegates across local and remote agents. | [`acp-a2a`](slides/acp-a2a/) | [`11-acp-a2a`](examples/11-acp-a2a/) |
| **Dynamic Workflows**<br>Demonstrates runtime-created workflow definitions with validation, live replacement, composition, persistence, and HTTP execution. | None | [`12-dynamic-workflows`](examples/12-dynamic-workflows/) |
| **Trace Intelligence**<br>Uses an intentionally imperfect support agent and evaluation dataset to find and group recurring production behaviors. | [`trace-intelligence`](slides/trace-intelligence/) | [`13-support-agent`](examples/13-support-agent/) |
| **Agent Learning**<br>Explains how traces become signals, themes, investigations, evaluated changes, and pull requests in a closed improvement loop. | [`agent-learning`](slides/agent-learning/) | None |
| **Multiplayer Agents with Channels**<br>Demonstrates how multiple Slack participants can share one attributable and steerable agent conversation. | [`multiplayer-channels`](slides/multiplayer-channels/) | None |
| **Agent Signals**<br>Presents reactive, state, and notification signals for watching, steering, and waking running agents. | [`signals-workshop`](slides/signals-workshop/) | None |
| **Software Factory**<br>Presents a maturity model for automating controlled software-development feedback loops with agents, workflows, and human gates. | [`software-factory`](slides/software-factory/) | None |
| **Real-Time Voice Agents**<br>Covers LiveKit integration, lifecycle hooks, observability, and Mastra memory for browser-to-phone voice agents. | [`voice-agents`](slides/voice-agents/) | None |

Each code directory is a standalone project. Install and run it from that directory using the instructions in its README.

## Running

```bash
cd open-slide
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
├── open-slide/                     # Presentation runtime
│   ├── open-slide.config.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Links

- [mastra.ai](https://mastra.ai)
- [github.com/mastra-ai/mastra](https://github.com/mastra-ai/mastra)
- [discord.gg/mastra](https://discord.gg/mastra)
