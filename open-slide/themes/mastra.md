---
name: Mastra
description: Unified Mastra Workshop system with matte-black framing, stretched display type, and restrained neon telemetry accents
---

# Mastra

## Palette

| Role      | Value     | Notes                                          |
| --------- | --------- | ---------------------------------------------- |
| bg        | `#07090b` | deck background                                |
| text      | `#f3f5f7` | primary headlines and body copy                |
| accent    | `#7AFF78` | numbered agenda markers, CTAs, telemetry cues  |
| muted     | `#8f97a3` | secondary copy, footer text, supporting labels |
| shell     | `#040506` | outer frame slab                               |
| panel     | `#090c11` | inner content panel                            |
| border    | `#1f2530` | structural panel borders                       |
| badge     | `#0d1219` | workshop badge background                      |
| text-soft | `#cfd6de` | cover subtitles and welcome copy               |
| line      | `#26303c` | host card and question card borders            |

## Typography

- Display font: `"Greed", "Inter", system-ui, -apple-system, sans-serif` - weight 520 with slight stretch for headings.
- Body font: `"Greed", "Inter", system-ui, -apple-system, sans-serif` - weight 400-500 for readable workshop narration.
- Mono font: `"JetBrains Mono", "SF Mono", ui-monospace, monospace` - page numbers, small labels, code-style metadata.
- Type-scale overrides:
  - Hero title: 108 px.
  - Cover subtitle: 41 px.
  - Section heading: 94 px.
  - Host name: 62 px.
  - Agenda row title: 46 px.
  - Body text: 30-36 px.
  - Supporting label / eyebrow: 24 px.

## Layout

- Content padding: 92-112 px from the 1920 x 1080 canvas edges.
- Signature shell: layered rounded rectangles (`shell` outside, `panel` inside) for cover pages.
- Alignment: left-first workshop narrative with restrained right-side telemetry accents.
- Header rhythm: Mastra wordmark or compact logo on the left, workshop badge on the right when appropriate.
- Footer: uppercase workshop label on the left, live page number on the right from `useSlidePageNumber()`.
- Canonical workshop layouts in this system:
  - Cover
  - Welcome
  - What you'll learn
  - Meet your hosts
  - Questions

## Fixed components

These are paste-ready. Copy them verbatim into a slide that uses this theme.

### Title

```tsx
const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      margin: 0,
      fontFamily: '"Greed", "Inter", system-ui, -apple-system, sans-serif',
      fontSize: 108,
      fontWeight: 520,
      fontStretch: "112%",
      letterSpacing: "0.015em",
      lineHeight: 1.08,
      color: "#f3f5f7",
      textWrap: "balance",
    }}
  >
    {children}
  </h1>
);
```

### Footer

Pull page numbers from `useSlidePageNumber()`.

```tsx
import { useSlidePageNumber } from "@open-slide/core";

const Footer = ({ label = "Mastra Workshop" }: { label?: string }) => {
  const { current, total } = useSlidePageNumber();

  return (
    <div
      style={{
        position: "absolute",
        left: 112,
        right: 112,
        bottom: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 24,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#8f97a3",
      }}
    >
      <span>{label}</span>
      <span>
        {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
};
```

### Eyebrow / accents

```tsx
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 24,
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#8f97a3",
    }}
  >
    {children}
  </div>
);
```

### WorkshopBadge

```tsx
const WorkshopBadge = ({ compact = false }: { compact?: boolean }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: compact ? 8 : 10,
      background: "#0d1219",
      border: "2px solid #222222",
      borderRadius: 999,
      padding: compact ? "10px 18px" : "12px 22px",
      fontSize: compact ? 22 : 28,
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#e7ebef",
    }}
  >
    <span
      style={{
        width: compact ? 20 : 24,
        height: compact ? 20 : 24,
        borderRadius: "50%",
        border: "2px solid #e7ebef",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          width: compact ? 5 : 6,
          height: compact ? 5 : 6,
          borderRadius: "50%",
          background: "#e7ebef",
          display: "inline-block",
        }}
      />
    </span>
    <span>Workshop</span>
  </div>
);
```

### Frame

```tsx
const Frame = ({ children }: { children: React.ReactNode }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 56,
        borderRadius: 64,
        background: "#040506",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 92,
        borderRadius: 42,
        border: "1px solid #1f2530",
        background: "#090c11",
        padding: "88px 96px",
      }}
    >
      {children}
    </div>
  </>
);
```

### QuestionsCard

```tsx
const QuestionsCard = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: 720,
      borderRadius: 28,
      border: "1px solid #26303c",
      background:
        "linear-gradient(170deg, rgba(12,17,22,0.92) 0%, rgba(7,10,14,0.88) 100%)",
      padding: "28px 32px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
    }}
  >
    {children}
  </div>
);
```

## Motion

- Philosophy: subtle. Use short entrance fades for major groups and keep workshop facilitation pages calm and readable.
- Reusable keyframes:

```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Aesthetic

This is the unified Mastra Workshop system: matte-black architectural framing, oversized stretched display type, precise borders, and sparse neon telemetry accents. The mood should feel like a polished launch control room rather than a generic webinar template. Use the green accent to direct attention, not to decorate every surface. Avoid rainbow color systems, playful sticker-like motifs, soft pastel cards, or bespoke interaction patterns unless a specific deck truly needs them.

## Example usage

```tsx
const Cover: Page = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      position: "relative",
      background: "#07090b",
      color: "#f3f5f7",
      padding: 96,
    }}
  >
    <Frame>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Eyebrow>Mastra Workshop</Eyebrow>
        <WorkshopBadge />
      </div>
      <div
        style={{
          marginTop: 120,
          maxWidth: 1240,
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <Title>Monitor, Debug, and Evaluate Agents with Mastra</Title>
        <p
          style={{
            margin: 0,
            fontSize: 41,
            lineHeight: 1.34,
            color: "#cfd6de",
            maxWidth: 1100,
          }}
        >
          Weekly sessions to empower you with the tools and expertise to build
          more capable Mastra agents.
        </p>
      </div>
    </Frame>
    <Footer />
  </div>
);
```
