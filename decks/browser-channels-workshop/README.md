# Browser & Channels Workshop

A 60-minute workshop deck on Mastra's Browser and Channels primitives — the two interfaces that connect an agent to the outside world.

Built with [open-slide](https://github.com/1weiho/open-slide) (slides as React components, 1920×1080 canvas).

## Run it

```bash
pnpm install
pnpm dev
```

Then open the dev server. Arrow keys / PageUp / PageDown navigate. `F` enters fullscreen play mode.

## Slides

The deck lives at `slides/mastra-browser-channels/index.tsx` — 21 pages covering:

| Section | Pages |
| --- | --- |
| Why primitives | Cover · primitive definition · two outside-world problems · what you'd otherwise rebuild |
| Browser | architecture · three providers / two paradigms · snapshot/ref loop · why refs win · prompt-cache trick · scope + screencast · demo |
| Channels | architecture · minimal Slack agent · `consumeAgentStream` · what the primitive gives you · `ChatChannelProcessor` · multi-user / threads / gateway · demo + combining browser + channels |
| Wrap-up | source pointers · Q&A |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server with hot reload. |
| `pnpm build` | Build a static bundle. |
| `pnpm preview` | Preview the built bundle locally. |

See [`AGENTS.md`](./AGENTS.md) and [`CLAUDE.md`](./CLAUDE.md) for the open-slide authoring guide.
