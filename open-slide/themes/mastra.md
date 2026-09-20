---
name: Mastra
description: Minimal talks and workshops with paired light/dark palettes, system appearance, clean code, floating capabilities, media, and fixed QR overlays
---

# Mastra

The reusable catalog is [`mastra.demo.tsx`](mastra.demo.tsx). It contains 18 page recipes, all using the same system/light/dark foundation. Copy only the needed page and its helpers into a deck’s `index.tsx`. The [five-page workshop starter](../../slides/mastra-workshop-template/index.tsx) uses the same appearance foundation. Keep one-off timeline research and chronology in the source talk; they are deliberately absent here.

## Palette

Default to **system** using `prefers-color-scheme`. Set the `appearance` constant to `light` for a bright venue or `dark` for a fixed dark deck. A page can explicitly pass `<MastraPage mode="light">`. System mode updates as the OS preference changes; the editor UI theme is independent.

| Token | Light | Dark |
| --- | --- | --- |
| Background | `#f5f6f4` | `#07090b` |
| Text | `#101813` | `#f3f5f7` |
| Accent | `#19783a` | `#7aff78` |
| Shell | `#e6ebe5` | `#040506` |
| Panel | `#ffffff` | `#090c11` |
| Border | `#c4cec5` | `#29332d` |
| Soft text | `#25362b` | `#cfd6de` |
| Muted text | `#46554b` | `#a2aca5` |
| Subtle/code panel | `#f3f7f1` | `#111913` |
| Feature pill | `#edf6e8` | `#142619` |
| Prominent pill | `#d8efcf` | `#23442b` |
| Quiet pill | `#f3f5f2` | `#141918` |
| Code keyword | `#75419a` | `#d4adf0` |
| Code string | `#19783a` | `#99deac` |
| Code property | `#245a96` | `#9dc9fb` |
| Highlighter | yellow `rgba(255,222,70,.26)` | yellow `rgba(255,222,70,.17)` |
| Demo button | green / white | light green / dark text |

Use `--mt-*` semantic variables from `themeCss` for all chrome. The exported `design` supplies typography and the light base palette; the CSS owns dark overrides. The current Design panel does not independently edit both palettes. Adjust paired tokens in source when changing the theme itself.

QR codes remain black on white in either mode. Screenshots, videos, and third-party web pages preserve their source appearance; their surrounding canvas, controls, loading, and fallback UI follow the theme. Do not invert media to simulate a dark version.

## Typography

- Actual local Greed variable font: `@assets/fonts/GreedVF.woff2`, registered once with HMR-safe replacement.
- Display/body: Greed, Inter, system-ui. Heading weight 520, body 400–450.
- Monospace: SFMono-Regular, Menlo, Consolas, Liberation Mono.
- Cover h1: 108px, line-height 1.1, balanced lines and max width 1300px.
- Centered h2: 94px / 1.15. Content headings: 76px; narrow screenshot-column headings: 68px.
- Body: 32–41px; supporting labels: 24–28px. Code: 34px / 48px; single command: 64px.
- Feature casing is readable and idiomatic, with acronyms preserved. Displayed TypeScript has no semicolons and may use explicit `...` abbreviations.

## Layout

1920×1080 canvas. Framed pages use an outer inset of 56px/radius 64px, inner inset of 92px/radius 42px, and inner padding of 88px 96px. That leaves a 1542×718px content area after the border. Calculate text, rows, and gaps within that space.

Covers center the title in the space below the logo row. The Talk badge is optional; Workshop is a distinct configurable label. Host names are opt-in. No deck-name or slide-count footer by default.

Media pages occupy the entire canvas. A two-column screenshot layout uses 580px for the title, a 48px gap, and the remaining width for the image. Preserve aspect ratio with `contain`; split closers may deliberately crop with `cover` after checking the important content.

QR overlays sit 36px from the bottom/side, with a 200px code, 24px white padding, 18px radius, and 80% overall opacity. Product goes bottom-left, presenter goes bottom-right. They are siblings of moving layers, never children of the animated panels. Don't add a URL caption unless requested.

## Fixed components

Copy the module imports, `design`, appearance type/default, CSS registration, and `MastraPage` foundation from the top of `mastra.demo.tsx`, then the helpers required by your chosen recipes. Use `@assets` imports so copied pages still resolve fonts/logos/QRs from `open-slide/assets/`. Do not import the theme module from a finished deck: copied JSX must remain editable by the inspector.

Core components below match the runnable catalog:

```tsx
const Frame = ({ children }: { children: ReactNode }) => <>
  <div style={{ position: 'absolute', inset: 56, borderRadius: 64, background: 'var(--mt-shell)' }} />
  <div style={{ position: 'absolute', inset: 92, borderRadius: 42, border: '1px solid var(--mt-border)', background: 'var(--mt-panel)', padding: '88px 96px' }}>{children}</div>
</>
const Center = ({ children }: { children: ReactNode }) => <div style={{ position: 'absolute', inset: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 36 }}>{children}</div>
const Title = ({ children }: { children: ReactNode }) => <h1 style={{ margin: 0, maxWidth: 1300, fontFamily: 'var(--osd-font-display)', fontSize: 'var(--osd-size-hero, 108px)', fontWeight: 520, lineHeight: 1.1, textWrap: 'balance' }}>{children}</h1>
const Heading = ({ children, size = 94 }: { children: ReactNode; size?: number }) => <h2 style={{ margin: 0, maxWidth: 1440, fontSize: size, fontWeight: 520, lineHeight: 1.15, textWrap: 'balance' }}>{children}</h2>
const Wordmark = () => <div role="img" aria-label="Mastra" style={{ width: 332, height: 84, background: 'var(--mt-text)', mask: `url("${wordmark}") center / contain no-repeat`, WebkitMask: `url("${wordmark}") center / contain no-repeat` }} />
const EventBadge = ({ children = 'Talk' }: { children?: ReactNode }) => <div style={{ display: 'inline-flex', border: '1px solid var(--mt-border)', background: 'var(--mt-subtle)', borderRadius: 999, padding: '12px 22px', fontSize: 28, letterSpacing: '.1em', textTransform: 'uppercase' }}>{children}</div>

```

`QrOverlay`, `LiveSiteLink`, `DemoLink`, `CodePanel`, `CodeLine`, `FeaturePill`, `AgentCard`, `WebsiteSurface`, and `VideoSurface` are the corresponding source helpers. Their props are the reuse boundary. `SampleScreen` is a labeled catalog fixture, not a real product screenshot; replace it with the user's imported asset.

### Recipe catalog

| Page | Component | Copy with / purpose |
| --- | --- | --- |
| 1 | `Cover` | Frame, Title, Wordmark, EventBadge; minimal talk cover |
| 2 | `Section` | Frame, Center, Heading; h2 section divider |
| 3 | `Statement` | Heading-only numbered prediction; explanation in notes |
| 4 | `Command` | CodePanel + syntax spans + optional QrOverlay |
| 5 | `Code` | CodePanel, CodeLine, K/S/P; faint yellow emphasis, abridged agent relationship |
| 6 | `FeatureCloud` | FeaturePill; irregular placements, inspiring capabilities and quieter essentials |
| 7 | `AgentGrid` | AgentCard; structured role/responsibility comparison |
| 8 | `ScreenshotBesideText` | Narrow left h2, large right image |
| 9 | `GridWithScreenshot` | Compact cards at left and a supplied image at right |
| 10 | `Website` | WebsiteSurface, LiveSiteLink; no decorative frame |
| 11 | `Video` | VideoSurface; full-screen, muted autoplay/loop, pause off-slide |
| 12 | `LocalInteractive` | Bundled HTML or served local demo; full-screen |
| 13 | `ScreenshotDemo` | Supplied screenshot + large DemoLink with hover/focus lift |
| 14 | `Questions` | Separate heading and bottom-corner QR targets |
| 15 | `SplitClosing` | Product left, presenter right, slow shared-boundary drift, static QRs |
| 16 | `Welcome` | Optional workshop welcome |
| 17 | `Agenda` | Optional concise workshop learning goals |
| 18 | `Hosts` | Optional workshop hosts; not automatic cover attribution |

Keep page instances explicit rather than rendering content from `.map`. The companion `notes` array is positional; update it alongside any reordered pages. The right QR in the catalog intentionally uses Mastra as an example destination: replace both its asset and href with the requested profile. Never reuse a presenter handle from a prior talk implicitly.

### Embedding choices

`WebsiteSurface` accepts `iframe`, `static`, or `snapshot`. `iframe` is interactive where framing is allowed. `static` fetches HTML, disables scripts, and inserts a base URL for relative assets; it requires CORS and loses script-driven interactions. `snapshot` takes an actual image path and keeps a live link. Verify the selected strategy visually. X and Product Hunt blocked framing during the source talk; recheck rather than assuming the same forever.

Bundle local demos into the deck's `assets/`, import HTML with `?raw`, and include relative assets or serve the whole tree. `file://` URLs cannot work in hosted decks. Use a sandbox that permits the intended demo scripts, without casually enabling more access. The 1280×720 to 1920×1080 scale pattern is demonstrated in `LocalInteractive`.

Normal HTTPS Demo links are portable. If Chrome is explicitly required for authentication, use an appropriate platform-specific launch mechanism and verify it when allowed. The `google-chrome:https://…` route used by the source talk is not a universal browser capability. Do not bake an authenticated Factory URL into the theme.

## Motion

Pills drift around fixed, irregular centers: about 6 seconds for capabilities and 9 for quiet essentials, with staggered phases. Their motion envelope must not cross adjacent pills or the frame. Feature importance is encoded by type size/color as well as movement.

The split closer moves its column boundary through 48%–52% over 16 seconds. QR overlays stay fixed. Demo hover/focus uses a 220ms lift, brighter fill/shadow, and a small arrow movement. Animations stop for reduced motion and print; video pauses off-slide. Gallery previews are frozen by the framework, so use an actual interactive preview to assess motion.

## Aesthetic

Minimal architectural framing, generous spacing, restrained green emphasis, clean monospace examples, and readable source media. Light is bright-room friendly; dark is a corresponding palette, not an unrelated design. Avoid decorative filler, word-cloud randomness that hurts legibility, or unsolicited footers. A quiet essential feature still needs readable contrast.

## Example usage

After copying the foundation and required helpers into `slides/<id>/index.tsx`:

```tsx
const Opening: Page = () => (
  <MastraPage>
    <Frame>
      <Center><Title>Your talk title</Title></Center>
    </Frame>
  </MastraPage>
)
const NextIdea: Page = () => (
  <MastraPage>
    <Frame><Center><Heading>Your next idea</Heading></Center></Frame>
  </MastraPage>
)
export const notes = ['', 'Put the spoken explanation here.']
// Add meta.title, theme: 'mastra', and a freshly generated literal createdAt.
export default [Opening, NextIdea] satisfies Page[]
```

Preview at `/themes/mastra`. Add `?appearance=light`, `?appearance=dark`, or `?appearance=system` to compare modes without changing OS settings; this query override is restricted to theme previews. The default remains system for new decks. The completed source talk is intentionally unchanged.
