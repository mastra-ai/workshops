import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import abhiAvatar from './assets/abhi-avatar.jpg';

export const design: DesignSystem = {
  palette: {
    bg: '#0a0a0f',
    text: '#f2f2f5',
    accent: '#8b7ff5',
  },
  fonts: {
    display: '"Geist", "Inter", system-ui, -apple-system, sans-serif',
    body: '"Geist", "Inter", system-ui, -apple-system, sans-serif',
  },
  typeScale: {
    hero: 96,
    body: 44,
  },
  radius: 14,
};

const palette = {
  surface: '#12121a',
  surfaceHi: '#181822',
  border: '#232330',
  textSoft: '#8b8b9a',
  muted: '#5f5f70',
  dim: '#43434f',
  green: '#4ade80',
  blue: '#7aa2f7',
  orange: '#f0883e',
  accent: '#8b7ff5',
};

const font = {
  mono: '"Geist Mono", "JetBrains Mono", ui-monospace, Menlo, monospace',
};

const fill = {
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  letterSpacing: '-0.015em',
  position: 'relative' as const,
  overflow: 'hidden',
};

const PageNumber = () => {
  const { current } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        top: 64,
        left: 120,
        fontFamily: font.mono,
        fontSize: 34,
        color: palette.textSoft,
      }}
    >
      {current}
    </div>
  );
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontFamily: font.mono,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
    }}
  >
    {children}
  </div>
);

const Handle = ({ label, value }: { label: string; value: string }) => (
  <span>
    <span style={{ color: 'var(--osd-accent)' }}>{label}</span>{' '}
    <span style={{ color: 'var(--osd-text)' }}>{value}</span>
  </span>
);

const Title: Page = () => (
  <div
    style={{
      ...fill,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 140px',
      boxSizing: 'border-box',
    }}
  >
    <PageNumber />

    <h1
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 184,
        fontWeight: 800,
        lineHeight: 1.0,
        letterSpacing: '-0.04em',
        margin: 0,
      }}
    >
      Agent Learning
    </h1>

    <div
      style={{
        width: 220,
        height: 5,
        background: 'var(--osd-accent)',
        borderRadius: 3,
        margin: '52px 0',
      }}
    />

    <p
      style={{
        fontSize: 48,
        lineHeight: 1.4,
        color: palette.textSoft,
        margin: 0,
        maxWidth: 1500,
      }}
    >
      Your agents already produce the data they need to get better.
      <br />
      This is how you close the loop.
    </p>

    <div
      style={{
        position: 'absolute',
        left: 140,
        bottom: 96,
        fontFamily: font.mono,
        fontSize: 24,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: palette.muted,
      }}
    >
      Abhi Aiyer <span style={{ color: palette.dim }}>·</span> Mastra
    </div>
  </div>
);

const AboutMe: Page = () => (
  <div
    style={{
      ...fill,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 140px',
      boxSizing: 'border-box',
    }}
  >
    <PageNumber />

    <Eyebrow>Who&apos;s talking</Eyebrow>

    <div style={{ display: 'flex', alignItems: 'center', gap: 56, marginTop: 44 }}>
      <div
        style={{
          width: 260,
          height: 260,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          border: '2px solid var(--osd-accent)',
          boxShadow: '0 0 0 8px rgba(139, 127, 245, 0.12), 0 18px 50px rgba(0, 0, 0, 0.45)',
        }}
      >
        <img
          src={abhiAvatar}
          alt="Abhi Aiyer"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h1
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 152,
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            margin: 0,
          }}
        >
          Abhi Aiyer
        </h1>
        <p style={{ fontSize: 40, lineHeight: 1.2, margin: 0, fontWeight: 500, color: palette.textSoft }}>
          CTO &amp; Co-Founder, <span style={{ color: 'var(--osd-accent)' }}>Mastra</span>
        </p>
      </div>
    </div>

    <div
      style={{
        marginTop: 64,
        paddingTop: 36,
        borderTop: `1px solid ${palette.border}`,
        display: 'flex',
        gap: 56,
        fontFamily: font.mono,
        fontSize: 24,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: palette.muted,
      }}
    >
      <Handle label="X" value="@abhiaiyer" />
      <Handle label="Web" value="mastra.ai" />
      <Handle label="GH" value="github.com/mastra-ai" />
    </div>
  </div>
);

const SpanIcon = ({ glyph, color }: { glyph: string; color: string }) => (
  <div
    style={{
      width: 40,
      height: 40,
      flexShrink: 0,
      borderRadius: 9,
      background: `${color}22`,
      border: `1px solid ${color}55`,
      color,
      fontFamily: font.mono,
      fontSize: 20,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {glyph}
  </div>
);

const Span = ({
  glyph,
  color,
  name,
  detail,
  duration,
}: {
  glyph: string;
  color: string;
  name: string;
  detail: string;
  duration: string;
}) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22, height: 89 }}>
    <div
      style={{
        width: 12,
        height: 12,
        flexShrink: 0,
        marginTop: 15,
        borderRadius: '50%',
        background: palette.dim,
      }}
    />
    <SpanIcon glyph={glyph} color={color} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: font.mono, fontSize: 27, fontWeight: 600, lineHeight: 1.2 }}>{name}</div>
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 22,
          lineHeight: 1.3,
          color: palette.textSoft,
          marginTop: 6,
        }}
      >
        {detail}
      </div>
    </div>
    <div
      style={{
        fontFamily: font.mono,
        fontSize: 24,
        color: palette.textSoft,
        marginTop: 4,
        whiteSpace: 'nowrap',
      }}
    >
      {duration}
    </div>
  </div>
);

const TracePanel = () => (
  <div
    style={{
      position: 'absolute',
      top: 90,
      left: 820,
      width: 980,
      height: 900,
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderRadius: 'var(--osd-radius)',
      padding: 40,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingBottom: 26,
        borderBottom: `1px solid ${palette.border}`,
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 600 }}>Trace #8f3a12e</div>
      <div style={{ fontFamily: font.mono, fontSize: 28, color: palette.textSoft }}>8.42s</div>
    </div>

    <div style={{ position: 'relative', marginTop: 28 }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 5,
          top: 21,
          bottom: 68,
          width: 2,
          background: `repeating-linear-gradient(to bottom, ${palette.border} 0 6px, transparent 6px 12px)`,
        }}
      />
      <Span glyph="M" color={palette.blue} name="User Message" detail="How do I reset my password?" duration="120ms" />
      <Span glyph="O" color={palette.orange} name="Orchestrator" detail="Planning steps" duration="320ms" />
      <Span glyph="K" color={palette.green} name="Retrieve Knowledge" detail="Vector search (2.1k results)" duration="1.24s" />
      <Span glyph="A" color={palette.green} name="Check User Account" detail="Get user by email" duration="532ms" />
      <Span glyph="P" color="var(--osd-accent)" name="Apply Policy" detail="Check rate limits" duration="210ms" />
      <Span glyph="R" color="var(--osd-accent)" name="Generate Response" detail="Streaming tokens" duration="4.12s" />
      <Span glyph="T" color="var(--osd-accent)" name="Tool: Send Email" detail="Password reset link" duration="1.33s" />
      <Span glyph="✓" color={palette.green} name="Complete" detail="Success" duration="79ms" />
    </div>
  </div>
);

const TraceStory: Page = () => (
  <div style={fill}>
    <PageNumber />

    <div
      style={{
        position: 'absolute',
        left: 120,
        top: 0,
        bottom: 0,
        width: 600,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 800,
          lineHeight: 1.12,
          margin: 0,
        }}
      >
        Every AI application already tells a story.
      </h1>

      <div style={{ marginTop: 56, fontSize: 'var(--osd-size-body)', lineHeight: 1.4 }}>
        <div style={{ color: palette.textSoft }}>The problem is…</div>
        <div style={{ color: 'var(--osd-accent)' }}>nobody can read it.</div>
      </div>
    </div>

    <TracePanel />
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Scale page — one trace → a million

const MiniRow = ({ chip, width }: { chip: string; width: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7, height: 22 }}>
    <div style={{ width: 3, height: 3, borderRadius: '50%', background: palette.dim, flexShrink: 0 }} />
    <div
      style={{
        width: 13,
        height: 13,
        borderRadius: 3,
        flexShrink: 0,
        background: `${chip}33`,
        border: `1px solid ${chip}66`,
      }}
    />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ width, height: 5, borderRadius: 3, background: palette.textSoft, opacity: 0.55 }} />
      <div style={{ width: width - 14, height: 4, borderRadius: 3, background: palette.muted, opacity: 0.45 }} />
    </div>
    <div style={{ width: 22, height: 5, borderRadius: 3, background: palette.muted, opacity: 0.5, flexShrink: 0 }} />
  </div>
);

const MiniTrace = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderRadius: 10,
      padding: 14,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottom: `1px solid ${palette.border}`,
      }}
    >
      <div style={{ width: 82, height: 7, borderRadius: 3, background: palette.textSoft, opacity: 0.7 }} />
      <div style={{ width: 26, height: 7, borderRadius: 3, background: palette.muted, opacity: 0.6 }} />
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
      <MiniRow chip={palette.blue} width={92} />
      <MiniRow chip={palette.orange} width={70} />
      <MiniRow chip={palette.green} width={104} />
      <MiniRow chip={palette.green} width={84} />
      <MiniRow chip="#8b7ff5" width={64} />
      <MiniRow chip="#8b7ff5" width={96} />
      <MiniRow chip="#8b7ff5" width={78} />
      <MiniRow chip={palette.green} width={54} />
    </div>
  </div>
);

// Decorative depth layers behind the front card — empty frames, no content.
const TraceStack = ({ layers }: { layers: number }) => (
  <div style={{ position: 'relative', width: 210, height: 272 }}>
    {Array.from({ length: layers }, (_, i) => {
      const depth = layers - i;
      return (
        <div
          key={i}
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${-depth * 5}px, ${-depth * 6}px)`,
            background: palette.surfaceHi,
            border: `1px solid ${palette.border}`,
            borderRadius: 10,
          }}
        />
      );
    })}
    <MiniTrace />
  </div>
);

const CLOUD_SIZE = 420;

const DOTS = (() => {
  let seed = 0x5eed1234;
  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const half = CLOUD_SIZE / 2;
  const out: { x: number; y: number; r: number; o: number; violet: boolean }[] = [];
  for (let i = 0; i < 620; i++) {
    // Sum of uniforms → gaussian-ish cluster, dense in the middle.
    const gx = (rand() + rand() + rand() - 1.5) / 1.5;
    const gy = (rand() + rand() + rand() - 1.5) / 1.5;
    const x = half + gx * half * 0.92;
    const y = half + gy * half * 0.92;
    const edge = Math.min(1, Math.hypot(gx, gy));
    out.push({
      x,
      y,
      r: 1.1 + rand() * 2.1,
      o: 0.9 - edge * 0.62,
      violet: rand() < 0.55,
    });
  }
  return out;
})();

const TraceCloud = () => (
  <svg
    width={CLOUD_SIZE}
    height={CLOUD_SIZE}
    viewBox={`0 0 ${CLOUD_SIZE} ${CLOUD_SIZE}`}
    aria-hidden
    style={{ display: 'block', overflow: 'visible' }}
  >
    {DOTS.map((d, i) => (
      <circle
        key={i}
        cx={d.x}
        cy={d.y}
        r={d.r}
        fill={d.violet ? 'var(--osd-accent)' : palette.textSoft}
        opacity={d.o}
      />
    ))}
  </svg>
);

const Arrow = () => (
  <svg width={56} height={24} viewBox="0 0 56 24" aria-hidden style={{ flexShrink: 0 }}>
    <path
      d="M2 12 H46"
      stroke={palette.muted}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path
      d="M38 5 L47 12 L38 19"
      stroke={palette.muted}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const StageLabel = ({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) => (
  <div
    style={{
      position: 'absolute',
      bottom: -92,
      left: 0,
      right: 0,
      fontSize: 34,
      lineHeight: 1.2,
      textAlign: 'center',
      color: accent ? 'var(--osd-accent)' : palette.textSoft,
    }}
  >
    {children}
  </div>
);

// Sits under a stage label to mark where the pain actually starts.
const StageNote = ({ children }: { children: React.ReactNode }) => (
  <>
    <div
      style={{
        position: 'absolute',
        bottom: -134,
        left: '50%',
        width: 1,
        height: 26,
        background: 'linear-gradient(#3a3654, #6b62b8)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: -186,
        left: -70,
        right: -70,
        textAlign: 'center',
        fontFamily: font.mono,
        fontSize: 25,
        lineHeight: 1.3,
        letterSpacing: '0.03em',
        color: '#a99df8',
      }}
    >
      {children}
    </div>
  </>
);

const stageColumn = {
  position: 'relative' as const,
  height: 420,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const Scale: Page = () => (
  <div style={fill}>
    <PageNumber />

    <h2
      style={{
        position: 'absolute',
        top: 132,
        left: 120,
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 68,
        fontWeight: 800,
        lineHeight: 1.26,
        letterSpacing: '-0.025em',
      }}
    >
      One trace is understandable.
      <br />
      <span style={{ color: 'var(--osd-accent)' }}>A million</span> traces are not.
    </h2>

    <div
      style={{
        position: 'absolute',
        left: 110,
        right: 110,
        top: 386,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ ...stageColumn, width: 240 }}>
        <TraceStack layers={0} />
        <StageLabel>1 trace</StageLabel>
      </div>

      <Arrow />

      <div style={{ ...stageColumn, width: 240 }}>
        <TraceStack layers={2} />
        <StageLabel>10 traces</StageLabel>
      </div>

      <Arrow />

      <div style={{ ...stageColumn, width: 240 }}>
        <TraceStack layers={5} />
        <StageLabel>100 traces</StageLabel>
      </div>

      <Arrow />

      <div style={{ ...stageColumn, width: 240 }}>
        <TraceStack layers={10} />
        <StageLabel>1,000 traces</StageLabel>
        <StageNote>Already too many to read</StageNote>
      </div>

      <Arrow />

      <div style={{ ...stageColumn, width: CLOUD_SIZE }}>
        <TraceCloud />
        <StageLabel accent>1,000,000+ traces</StageLabel>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Signals page — traces funnel into categorized signals

const BOX = { x: 676, y: 429, w: 260, h: 260 };
const HUB_Y = BOX.y + BOX.h / 2;
const CARD = { x: 1176, w: 624, h: 168, gap: 30, top: 178 };

const cardCenter = (i: number) => CARD.top + i * (CARD.h + CARD.gap) + CARD.h / 2;

const cubic = (p: number[], t: number) => {
  const u = 1 - t;
  return (
    u * u * u * p[0] + 3 * u * u * t * p[1] + 3 * u * t * t * p[2] + t * t * t * p[3]
  );
};

const INFLOW = (() => {
  let seed = 0x1f2e3d4c;
  const rand = () => {
    seed = (seed + 0x9e3779b9) | 0;
    let t = Math.imul(seed ^ (seed >>> 16), 2246822507);
    t = (t + Math.imul(t ^ (t >>> 13), 3266489909)) ^ t;
    return ((t ^ (t >>> 16)) >>> 0) / 4294967296;
  };

  const lines: { d: string; dots: { x: number; y: number; r: number }[] }[] = [];
  const count = 30;

  for (let i = 0; i < count; i++) {
    const y0 = 186 + (i * (908 - 186)) / (count - 1);
    const spread = ((i - (count - 1) / 2) / count) * 96;
    const xs = [0, 250 + rand() * 90, 470, BOX.x + 16];
    const ys = [y0, y0, HUB_Y + (y0 - HUB_Y) * 0.12, HUB_Y + spread];
    const d = `M ${xs[0]} ${ys[0]} C ${xs[1]} ${ys[1]}, ${xs[2]} ${ys[2]}, ${xs[3]} ${ys[3]}`;

    const dots = Array.from({ length: 2 }, (_, k) => {
      const t = 0.12 + k * 0.3 + rand() * 0.22;
      return { x: cubic(xs, t), y: cubic(ys, t), r: 1.6 + rand() * 1.4 };
    });

    lines.push({ d, dots });
  }

  return lines;
})();

const Sparkle = ({ size, opacity = 1 }: { size: number; opacity?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ opacity }}>
    <path
      d="M12 1.5 L14.3 9.7 L22.5 12 L14.3 14.3 L12 22.5 L9.7 14.3 L1.5 12 L9.7 9.7 Z"
      fill="var(--osd-accent)"
    />
  </svg>
);

const icons = {
  goal: (
    <>
      <circle cx="18" cy="18" r="13" />
      <circle cx="18" cy="18" r="6.5" />
      <circle cx="18" cy="18" r="1.6" fill="currentColor" stroke="none" />
      <path d="M23 13 L30.5 5.5" />
      <path d="M26.5 3 L30.5 5.5 L33 9.5" />
    </>
  ),
  outcome: (
    <>
      <circle cx="18" cy="18" r="14" />
      <path d="M11 18.5 L16 23.5 L25.5 12.5" />
    </>
  ),
  behavior: (
    <>
      <path d="M4 10 H10 C15 10 17 26 22 26 H30" />
      <path d="M26 22 L30.5 26 L26 30" />
      <path d="M4 26 H10 C13 26 14.5 20 16 16" />
      <path d="M22 10 H30" />
      <path d="M26 6 L30.5 10 L26 14" />
    </>
  ),
  sentiment: (
    <>
      <circle cx="18" cy="18" r="14" />
      <circle cx="13" cy="14.5" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="23" cy="14.5" r="1.6" fill="currentColor" stroke="none" />
      <path d="M11.5 22 C13.5 25.5 22.5 25.5 24.5 22" />
    </>
  ),
};

const SignalIcon = ({ kind, color }: { kind: keyof typeof icons; color: string }) => (
  <div
    style={{
      width: 84,
      height: 84,
      borderRadius: '50%',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `${color}14`,
      border: `1.5px solid ${color}59`,
    }}
  >
    <svg
      width={46}
      height={46}
      viewBox="0 0 36 36"
      aria-hidden
      style={{ color, overflow: 'visible' }}
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[kind]}
    </svg>
  </div>
);

const SIGNALS = [
  { kind: 'goal' as const, color: palette.green, title: 'Goal', body: 'What is the user trying to accomplish?' },
  { kind: 'outcome' as const, color: '#e8b339', title: 'Outcome', body: 'Did they succeed?' },
  { kind: 'behavior' as const, color: '#8b7ff5', title: 'Behavior', body: 'What actually happened during execution?' },
  { kind: 'sentiment' as const, color: palette.blue, title: 'Sentiment', body: 'How did the interaction feel?' },
];

const SignalCard = ({
  kind,
  color,
  title,
  body,
  top,
}: (typeof SIGNALS)[number] & { top: number }) => (
  <div
    style={{
      position: 'absolute',
      left: CARD.x,
      top,
      width: CARD.w,
      height: CARD.h,
      boxSizing: 'border-box',
      borderRadius: 18,
      border: `1px solid ${color}3d`,
      background: `linear-gradient(100deg, ${color}1a 0%, ${palette.surface} 62%)`,
      display: 'flex',
      alignItems: 'center',
      gap: 30,
      padding: '0 36px',
    }}
  >
    <SignalIcon kind={kind} color={color} />
    <div>
      <div style={{ fontSize: 42, fontWeight: 600, color, letterSpacing: '-0.02em' }}>{title}</div>
      <div style={{ fontSize: 30, lineHeight: 1.3, color: palette.textSoft, marginTop: 8 }}>{body}</div>
    </div>
  </div>
);

const Signals: Page = () => (
  <div style={fill}>
    <PageNumber />

    <h2
      style={{
        position: 'absolute',
        top: 50,
        left: 236,
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: '-0.025em',
      }}
    >
      Traces become Signals
    </h2>

    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      aria-hidden
      style={{ position: 'absolute', inset: 0 }}
    >
      {INFLOW.map((line, i) => (
        <g key={i}>
          <path d={line.d} fill="none" stroke={palette.textSoft} strokeWidth={1.2} opacity={0.42} />
          {line.dots.map((dot, k) => (
            <circle key={k} cx={dot.x} cy={dot.y} r={dot.r} fill={palette.textSoft} opacity={0.85} />
          ))}
        </g>
      ))}

      {SIGNALS.map((signal, i) => {
        const cy = cardCenter(i);
        return (
          <path
            key={signal.title}
            d={`M ${BOX.x + BOX.w - 14} ${HUB_Y} C ${BOX.x + BOX.w + 110} ${HUB_Y}, ${CARD.x - 150} ${cy}, ${CARD.x} ${cy}`}
            fill="none"
            stroke={signal.color}
            strokeWidth={2.5}
            opacity={0.85}
          />
        );
      })}
    </svg>

    <div
      style={{
        position: 'absolute',
        left: BOX.x,
        top: BOX.y,
        width: BOX.w,
        height: BOX.h,
        boxSizing: 'border-box',
        borderRadius: 22,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        boxShadow: '0 0 80px rgba(139, 127, 245, 0.14)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
        <Sparkle size={54} />
        <Sparkle size={32} opacity={0.75} />
      </div>
      <div style={{ fontSize: 36, lineHeight: 1.2, textAlign: 'center', fontWeight: 500 }}>
        Generate
        <br />
        Signals
      </div>
    </div>

    {SIGNALS.map((signal, i) => (
      <SignalCard key={signal.title} {...signal} top={CARD.top + i * (CARD.h + CARD.gap)} />
    ))}

  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Themes page — raw messages dissolve into clustered themes

// Counts sum to 10,368 — the same week the Sankey and the proof slide read from.
const THEMES = [
  { key: 'user' as const, color: palette.green, title: 'Password Reset', count: '1,842' },
  { key: 'billing' as const, color: '#e8b339', title: 'Billing', count: '1,528' },
  { key: 'report' as const, color: '#8b7ff5', title: 'Report Generation', count: '1,324' },
  { key: 'other' as const, color: palette.blue, title: 'Other', count: '5,674' },
];

const PILLS: { text: string; theme: number; x: number; y: number }[] = [
  { text: 'Forgot password', theme: 0, x: 96, y: 196 },
  { text: 'Reset my password', theme: 0, x: 452, y: 258 },
  { text: "Can't log in", theme: 0, x: 60, y: 320 },
  { text: 'Password reset link', theme: 0, x: 300, y: 380 },
  { text: 'Need to reset', theme: 0, x: 128, y: 466 },
  { text: 'Account locked', theme: 0, x: 470, y: 476 },
  { text: 'Where is my invoice?', theme: 1, x: 76, y: 562 },
  { text: 'Billing question', theme: 1, x: 486, y: 574 },
  { text: 'Refund request', theme: 1, x: 176, y: 656 },
  { text: 'How much do I owe?', theme: 1, x: 452, y: 726 },
  { text: 'Generate report', theme: 2, x: 66, y: 776 },
  { text: 'Create report', theme: 2, x: 500, y: 828 },
  { text: 'Export to CSV', theme: 2, x: 174, y: 884 },
  { text: 'Download data', theme: 2, x: 486, y: 934 },
];

const GHOST_PILLS = [
  { w: 150, x: 452, y: 168 },
  { w: 128, x: 486, y: 668 },
  { w: 96, x: 300, y: 990 },
];

const THEME_DUST = (() => {
  let seed = 0x51ed2c7f;
  const rand = () => {
    seed = (seed + 0x9e3779b9) | 0;
    let t = Math.imul(seed ^ (seed >>> 16), 2246822507);
    t = (t + Math.imul(t ^ (t >>> 13), 3266489909)) ^ t;
    return ((t ^ (t >>> 16)) >>> 0) / 4294967296;
  };

  const origins = [
    { x: 430, y: 330 },
    { x: 430, y: 640 },
    { x: 430, y: 862 },
    { x: 410, y: 560 },
  ];

  return THEMES.flatMap((theme, i) => {
    const from = origins[i];
    const to = { x: CARD.x - 18, y: cardCenter(i) };
    const n = i === 3 ? 70 : 104;

    return Array.from({ length: n }, () => {
      const t = rand() ** 0.72;
      const fade = (1 - t) ** 1.5;
      return {
        color: theme.color,
        x: from.x + (to.x - from.x) * t + (rand() - 0.5) * (60 + fade * 320),
        y: from.y + (to.y - from.y) * t + (rand() - 0.5) * (30 + fade * 460),
        r: 1.1 + rand() * (1.4 + t * 1.5),
        opacity: 0.2 + t * 0.65,
      };
    });
  });
})();

const themeIcons = {
  user: (
    <>
      <circle cx="18" cy="12.5" r="6" />
      <path d="M6.5 30.5 C8 23 12.5 20 18 20 C23.5 20 28 23 29.5 30.5" />
    </>
  ),
  billing: (
    <>
      <path d="M18 5.5 V30.5" />
      <path d="M24 11.5 C24 9 21.5 7.5 18 7.5 C14.5 7.5 12 9 12 12 C12 18.5 24 16.5 24 23.5 C24 26.5 21.5 28.5 18 28.5 C14 28.5 12 26.5 12 24" />
    </>
  ),
  report: (
    <>
      <path d="M9.5 5.5 H21 L27 12 V30.5 H9.5 Z" />
      <path d="M20.5 5.5 V12.5 H27" />
      <path d="M14 19 H22.5" />
      <path d="M14 24 H22.5" />
    </>
  ),
  other: (
    <>
      <circle cx="8.5" cy="18" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="18" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="27.5" cy="18" r="2.4" fill="currentColor" stroke="none" />
    </>
  ),
};

const ThemeCard = ({
  key: _key,
  color,
  title,
  count,
  kind,
  top,
}: {
  key?: string;
  color: string;
  title: string;
  count: string;
  kind: keyof typeof themeIcons;
  top: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: CARD.x,
      top,
      width: CARD.w,
      height: CARD.h,
      boxSizing: 'border-box',
      borderRadius: 18,
      border: `1px solid ${color}47`,
      background: `linear-gradient(100deg, ${color}1f 0%, ${palette.surface} 62%)`,
      display: 'flex',
      alignItems: 'center',
      gap: 30,
      padding: '0 36px',
    }}
  >
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: 22,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${color}1f`,
        border: `1.5px solid ${color}59`,
      }}
    >
      <svg
        width={46}
        height={46}
        viewBox="0 0 36 36"
        aria-hidden
        style={{ color }}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {themeIcons[kind]}
      </svg>
    </div>
    <div>
      <div style={{ fontSize: 42, fontWeight: 600, color, letterSpacing: '-0.02em' }}>{title}</div>
      <div style={{ fontSize: 30, color: palette.textSoft, marginTop: 8 }}>({count} signals)</div>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Pipeline page — how a signal is actually made

const PIPE = {
  bands: [
    { x: 270, w: 500, label: 'Raw Extraction & Grouping', how: 'code', tone: palette.blue },
    { x: 790, w: 360, label: 'Feature Creation', how: 'code + model', tone: palette.textSoft },
    { x: 1310, w: 510, label: 'Signal Generation', how: 'model', tone: '#8b7ff5' },
  ],
  chipX: 800,
  chipW: 330,
  chipH: 76,
  chipY: [300, 402, 504, 606, 708],
  cardX: 1330,
  cardW: 470,
  cardH: 124,
  cardY: [282, 434, 586, 738],
};

const chipMid = (i: number) => PIPE.chipY[i] + PIPE.chipH / 2;
const sigMid = (i: number) => PIPE.cardY[i] + PIPE.cardH / 2;

const FEATURES = ['Deterministic Tags', 'Sentiment History', 'Last User Input', 'Observational Summary', 'Intent Summary'];

// feature index → signal indices it feeds (0 Goal, 1 Outcome, 2 Behavior, 3 Sentiment)
const FEATURE_TO_SIGNAL: number[][] = [[2, 1], [3], [0, 1, 3], [1, 2, 3], [0, 2]];

const flowPath = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = (x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
};

const PipeBox = ({
  x,
  y,
  w,
  h,
  tone,
  children,
  align = 'center',
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: string;
  children: React.ReactNode;
  align?: 'center' | 'left';
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      boxSizing: 'border-box',
      borderRadius: 14,
      border: `1px solid ${tone}47`,
      background: `linear-gradient(100deg, ${tone}12 0%, ${palette.surface} 70%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      justifyContent: 'center',
      padding: align === 'center' ? '0 20px' : '0 26px',
      gap: 10,
    }}
  >
    {children}
  </div>
);

const PipeSignalCard = ({ i }: { i: number }) => {
  const s = SIGNALS[i];
  return (
    <div
      style={{
        position: 'absolute',
        left: PIPE.cardX,
        top: PIPE.cardY[i],
        width: PIPE.cardW,
        height: PIPE.cardH,
        boxSizing: 'border-box',
        borderRadius: 16,
        border: `1px solid ${s.color}45`,
        background: `linear-gradient(100deg, ${s.color}1c 0%, ${palette.surface} 66%)`,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 30px',
      }}
    >
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `${s.color}14`,
          border: `1.5px solid ${s.color}59`,
        }}
      >
        <svg
          width={34}
          height={34}
          viewBox="0 0 36 36"
          aria-hidden
          fill="none"
          stroke={s.color}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ overflow: 'visible' }}
        >
          {icons[s.kind]}
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 38, fontWeight: 600, color: s.color, letterSpacing: '-0.02em' }}>{s.title}</div>
        <div style={{ fontSize: 24, color: palette.muted, marginTop: 4 }}>{s.body}</div>
      </div>
    </div>
  );
};

const Pipeline: Page = () => (
  <div style={fill}>
    <PageNumber />

    <h2
      style={{
        position: 'absolute',
        top: 50,
        left: 236,
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: '-0.025em',
      }}
    >
      How a signal is made
    </h2>

    {PIPE.bands.map((band) => (
      <div key={band.label} style={{ position: 'absolute', left: band.x, top: 178, width: band.w }}>
        <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>{band.label}</div>
        <div
          style={{
            marginTop: 10,
            fontFamily: font.mono,
            fontSize: 20,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: band.tone,
          }}
        >
          {band.how}
        </div>
      </div>
    ))}

    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      aria-hidden
      style={{ position: 'absolute', inset: 0 }}
    >
      {PIPE.bands.map((band) => (
        <rect
          key={band.label}
          x={band.x - 24}
          y={168}
          width={band.w + 48}
          height={712}
          rx={20}
          fill="#ffffff04"
        />
      ))}

      <ellipse cx={168} cy={482} rx={58} ry={19} fill={`${palette.blue}2e`} stroke={`${palette.blue}80`} />
      <path
        d={`M 110 482 V 608 A 58 19 0 0 0 226 608 V 482`}
        fill={`${palette.blue}14`}
        stroke={`${palette.blue}80`}
      />
      <path d="M 110 524 A 58 19 0 0 0 226 524" fill="none" stroke={`${palette.blue}54`} />
      <path d="M 110 566 A 58 19 0 0 0 226 566" fill="none" stroke={`${palette.blue}54`} />

      {/* traces → extraction, traces → agent intent */}
      <path d={flowPath(228, 545, 288, 556)} fill="none" stroke={palette.muted} strokeWidth={1.6} />
      <path d={flowPath(212, 618, 428, 786)} fill="none" stroke={palette.muted} strokeWidth={1.6} />
      {/* extraction → family baseline */}
      <path d={flowPath(560, 450, 604, 376)} fill="none" stroke={palette.muted} strokeWidth={1.6} />

      {/* band 1 → features */}
      <path d={flowPath(734, 330, 798, chipMid(0))} fill="none" stroke={palette.muted} strokeWidth={1.6} />
      {[1, 2, 3].map((c, k) => (
        <path
          key={c}
          d={flowPath(622, 500 + k * 56, 798, chipMid(c))}
          fill="none"
          stroke={palette.muted}
          strokeWidth={1.6}
        />
      ))}
      <path d={flowPath(694, 786, 798, chipMid(4))} fill="none" stroke={palette.muted} strokeWidth={1.6} />

      {/* features → signals */}
      {FEATURE_TO_SIGNAL.map((targets, f) =>
        targets.map((t) => (
          <path
            key={`${f}-${t}`}
            d={flowPath(1132, chipMid(f), 1328, sigMid(t))}
            fill="none"
            stroke={SIGNALS[t].color}
            strokeWidth={1.7}
            opacity={0.5}
          />
        )),
      )}
    </svg>

    <div
      style={{
        position: 'absolute',
        left: 96,
        top: 660,
        width: 144,
        textAlign: 'center',
        fontFamily: font.mono,
        fontSize: 22,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: palette.blue,
      }}
    >
      Traces
    </div>

    <PipeBox x={290} y={452} w={332} h={208} tone={palette.textSoft} align="left">
      <div style={{ fontSize: 30, fontWeight: 600 }}>Extraction</div>
      <div style={{ fontSize: 25, lineHeight: 1.55, color: palette.textSoft }}>
        User input
        <br />
        Tool calls
        <br />
        Compressed shape
      </div>
    </PipeBox>

    <PipeBox x={470} y={286} w={264} h={90} tone={palette.orange}>
      <div style={{ fontSize: 28, fontWeight: 600 }}>Family Baseline</div>
    </PipeBox>

    <PipeBox x={430} y={742} w={264} h={90} tone={palette.orange}>
      <div style={{ fontSize: 28, fontWeight: 600 }}>Agent Intent</div>
    </PipeBox>

    {FEATURES.map((label, i) => (
      <div
        key={label}
        style={{
          position: 'absolute',
          left: PIPE.chipX,
          top: PIPE.chipY[i],
          width: PIPE.chipW,
          height: PIPE.chipH,
          boxSizing: 'border-box',
          borderRadius: 12,
          border: `1px solid ${palette.blue}45`,
          background: `linear-gradient(100deg, ${palette.blue}14 0%, ${palette.surface} 70%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 18px',
          fontSize: 26,
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {label}
      </div>
    ))}

    {SIGNALS.map((s, i) => (
      <PipeSignalCard key={s.title} i={i} />
    ))}

    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 74,
        textAlign: 'center',
        fontSize: 40,
        color: palette.textSoft,
      }}
    >
      Deterministic where it can be. <span style={{ color: 'var(--osd-accent)' }}>Model-driven where it must be.</span>
    </div>
  </div>
);

const Themes: Page = () => (
  <div style={fill}>
    <PageNumber />

    <h2
      style={{
        position: 'absolute',
        top: 50,
        left: 236,
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: '-0.025em',
      }}
    >
      AI discovers recurring themes.
    </h2>

    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      aria-hidden
      style={{ position: 'absolute', inset: 0 }}
    >
      {THEME_DUST.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill={dot.color} opacity={dot.opacity} />
      ))}
    </svg>

    {GHOST_PILLS.map((pill, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: pill.x,
          top: pill.y,
          width: pill.w,
          height: 54,
          borderRadius: 12,
          border: `1px solid ${palette.border}`,
          background: palette.surface,
          opacity: 0.5,
        }}
      />
    ))}

    {PILLS.map((pill) => {
      const color = THEMES[pill.theme].color;
      return (
        <div
          key={pill.text}
          style={{
            position: 'absolute',
            left: pill.x,
            top: pill.y,
            padding: '13px 26px',
            borderRadius: 12,
            fontSize: 30,
            whiteSpace: 'nowrap',
            border: `1px solid ${color}52`,
            background: `linear-gradient(180deg, ${color}2b, ${palette.surface})`,
          }}
        >
          {pill.text}
        </div>
      );
    })}

    {THEMES.map((theme, i) => (
      <ThemeCard
        key={theme.title}
        kind={theme.key}
        color={theme.color}
        title={theme.title}
        count={theme.count}
        top={CARD.top + i * (CARD.h + CARD.gap)}
      />
    ))}
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Living model page — themes swell, fade, and emerge over time

const CX0 = 470;
const CX1 = 1744;
const ROW_TOP = 396;
const ROW_GAP = 138;

const shieldIcon = (
  <>
    <path d="M18 4 L29.5 8.5 V17 C29.5 25 24.5 30 18 32.5 C11.5 30 6.5 25 6.5 17 V8.5 Z" />
    <path d="M12.5 17.5 L16.5 21.5 L24 13.5" />
  </>
);

// Band height is the only variable — it reads as share of traces. Nothing
// drifts vertically, so there is no second encoding to misread.
type Stream = {
  title: string;
  color: string;
  icon: React.ReactNode;
  width: number[];
};

const STREAMS: Stream[] = [
  {
    title: 'Password Reset',
    color: palette.green,
    icon: themeIcons.user,
    width: [1, 0.96, 0.82, 0.58, 0.4, 0.3, 0.24],
  },
  {
    title: 'Billing',
    color: '#e8b339',
    icon: themeIcons.billing,
    width: [0.38, 0.5, 0.72, 0.88, 0.8, 0.62, 0.54],
  },
  {
    title: 'Report Generation',
    color: '#8b7ff5',
    icon: themeIcons.report,
    width: [0.76, 0.66, 0.46, 0.28, 0.16, 0.09, 0.05],
  },
  {
    title: 'MCP\nAuthentication',
    color: palette.blue,
    icon: shieldIcon,
    width: [0, 0, 0.08, 0.34, 0.66, 0.9, 1],
  },
  {
    title: 'Other',
    color: '#9a9aa8',
    icon: themeIcons.other,
    width: [0.46, 0.56, 0.44, 0.6, 0.46, 0.58, 0.5],
  },
];

const sampleKf = (kf: number[], t: number) => {
  const n = kf.length - 1;
  const x = Math.max(0, Math.min(0.99999, t)) * n;
  const i = Math.floor(x);
  const f = x - i;
  const s = f * f * (3 - 2 * f);
  return kf[i] * (1 - s) + kf[i + 1] * s;
};

const ribbon = (widthKf: number[], rowY: number, maxHalf = 48) => {
  const N = 90;
  const top: string[] = [];
  const bottom: string[] = [];

  for (let j = 0; j < N; j++) {
    const t = j / (N - 1);
    const x = CX0 + (CX1 - CX0) * t;
    const half = sampleKf(widthKf, t) * maxHalf;
    top.push(`${x} ${rowY - half}`);
    bottom.push(`${x} ${rowY + half}`);
  }

  return {
    area: `M ${top.join(' L ')} L ${bottom.reverse().join(' L ')} Z`,
    edge: `M ${top.join(' L ')}`,
  };
};

const TimeAxis = () => {
  const marks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Now'];
  return (
    <>
      {marks.map((mark, i) => {
        const x = CX0 + ((CX1 - CX0) * (0.05 + i * 0.185));
        return (
          <div
            key={mark}
            style={{
              position: 'absolute',
              left: x - 120,
              top: 262,
              width: 240,
              textAlign: 'center',
              fontSize: 32,
              color: palette.textSoft,
            }}
          >
            {mark}
          </div>
        );
      })}
      <svg
        width={1920}
        height={1080}
        aria-hidden
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <path d={`M ${CX0 - 60} 322 H ${CX1 + 40}`} stroke={palette.border} strokeWidth={1.5} />
        {marks.map((mark, i) => {
          const x = CX0 + (CX1 - CX0) * (0.05 + i * 0.185);
          return <path key={mark} d={`M ${x} 322 V 336`} stroke={palette.border} strokeWidth={1.5} />;
        })}
      </svg>
    </>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Math pages — how a theme is found, and how it stays itself

const MathBadge = () => (
  <div
    style={{
      position: 'absolute',
      top: 62,
      right: 120,
      padding: '10px 22px',
      borderRadius: 999,
      border: `1px solid ${palette.border}`,
      background: palette.surface,
      fontFamily: font.mono,
      fontSize: 22,
      letterSpacing: '0.22em',
      color: palette.muted,
    }}
  >
    MATH
  </div>
);

const StepLabel = ({
  x,
  y,
  note,
  children,
}: {
  x: number;
  y: number;
  note?: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 200,
      marginLeft: -100,
      textAlign: 'center',
      fontFamily: font.mono,
      fontSize: 21,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: palette.muted,
    }}
  >
    {children}
    {note ? (
      <div
        style={{
          marginTop: 8,
          fontSize: 18,
          letterSpacing: '0.04em',
          textTransform: 'none',
          color: palette.dim,
        }}
      >
        {note}
      </div>
    ) : null}
  </div>
);

const rng = (s: number) => {
  let seed = s;
  return () => {
    seed = (seed + 0x9e3779b9) | 0;
    let t = Math.imul(seed ^ (seed >>> 16), 2246822507);
    t = Math.imul(t ^ (t >>> 13), 3266489909);
    return ((t ^ (t >>> 16)) >>> 0) / 4294967296;
  };
};

const THEME_COLORS = [palette.green, '#e8b339', palette.blue];

// Three clusters in a shared drawing space, reused across both math pages
// so the second page reads as the first one extended through time.
const CLUSTERS = [
  { cx: 0.3, cy: 0.34, r: 0.15 },
  { cx: 0.66, cy: 0.3, r: 0.13 },
  { cx: 0.45, cy: 0.73, r: 0.14 },
];

type Dot = { x: number; y: number; c: number };

const sampleCloud = (seedValue: number, counts: number[], noise: number): Dot[] => {
  const rand = rng(seedValue);
  const dots: Dot[] = [];
  CLUSTERS.forEach((cluster, c) => {
    for (let i = 0; i < counts[c]; i += 1) {
      const a = rand() * Math.PI * 2;
      const d = (rand() + rand()) / 2;
      dots.push({
        x: cluster.cx + Math.cos(a) * d * cluster.r,
        y: cluster.cy + Math.sin(a) * d * cluster.r,
        c,
      });
    }
  });
  for (let i = 0; i < noise; i += 1) dots.push({ x: 0.06 + rand() * 0.88, y: 0.06 + rand() * 0.88, c: -1 });
  return dots;
};

const Scatter = ({
  x,
  y,
  size,
  dots,
  active,
  hulls = true,
}: {
  x: number;
  y: number;
  size: number;
  dots: Dot[];
  active: number[];
  hulls?: boolean;
}) => (
  <g>
    <rect x={x} y={y} width={size} height={size} rx={16} fill="#ffffff05" stroke={palette.border} />
    {hulls &&
      CLUSTERS.map((cluster, c) =>
        active.includes(c) ? (
          <circle
            key={c}
            cx={x + cluster.cx * size}
            cy={y + cluster.cy * size}
            r={cluster.r * size * 1.24}
            fill={`${THEME_COLORS[c]}12`}
            stroke={`${THEME_COLORS[c]}5c`}
            strokeWidth={1.4}
          />
        ) : null,
      )}
    {dots.map((dot, i) =>
      dot.c >= 0 && !active.includes(dot.c) ? null : (
        <circle
          key={i}
          cx={x + dot.x * size}
          cy={y + dot.y * size}
          r={dot.c < 0 ? 2.6 : 3.4}
          fill={dot.c < 0 ? palette.dim : THEME_COLORS[dot.c]}
          opacity={dot.c < 0 ? 0.9 : 0.82}
        />
      ),
    )}
  </g>
);

const SIG_STACK = [palette.green, '#e8b339', palette.blue, '#8b7ff5', palette.textSoft];

const ThemeMath: Page = () => {
  const dots = sampleCloud(0x2b71, [26, 20, 22], 12);
  const embedRand = rng(0x77a3);
  return (
    <div style={fill}>
      <PageNumber />
      <MathBadge />

      <h2
        style={{
          position: 'absolute',
          top: 50,
          left: 236,
          margin: 0,
          fontFamily: 'var(--osd-font-display)',
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: '-0.025em',
        }}
      >
        How a theme is found
      </h2>

      <div
        style={{
          position: 'absolute',
          top: 132,
          left: 236,
          fontSize: 34,
          color: palette.textSoft,
        }}
      >
        Per signal. Every signal type gets its own space.
      </div>

      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        aria-hidden
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* signal stack */}
        {SIG_STACK.map((color, i) => (
          <rect
            key={i}
            x={146 + i * 15}
            y={556 - i * 20}
            width={236}
            height={82}
            rx={11}
            fill={`${color}1f`}
            stroke={`${color}70`}
          />
        ))}

        {/* embedding column — a high-dimensional vector */}
        {Array.from({ length: 30 }, (_, i) => {
          const v = embedRand();
          return (
            <rect
              key={i}
              x={562}
              y={348 + i * 13.2}
              width={26 + v * 150}
              height={8}
              rx={4}
              fill={palette.blue}
              opacity={0.24 + v * 0.62}
            />
          );
        })}
        <rect x={544} y={330} width={216} height={430} rx={14} fill="none" stroke={palette.border} />

        <Scatter x={950} y={330} size={430} dots={dots} active={[0, 1, 2]} />

        {/* arrows */}
        <path d="M 418 562 H 522" stroke={palette.muted} strokeWidth={1.6} fill="none" />
        <path d="M 514 556 L 524 562 L 514 568 Z" fill={palette.muted} />
        <path d="M 790 545 H 920" stroke={palette.muted} strokeWidth={1.6} fill="none" />
        <path d="M 912 539 L 922 545 L 912 551 Z" fill={palette.muted} />
        <path d="M 1410 545 H 1444" stroke={palette.muted} strokeWidth={1.6} fill="none" />
        <path d="M 1436 539 L 1446 545 L 1436 551 Z" fill={palette.muted} />
      </svg>

      <StepLabel x={280} y={676}>
        signals
      </StepLabel>
      <StepLabel x={470} y={506}>
        embed
      </StepLabel>
      <StepLabel x={652} y={782}>
        high-dim
      </StepLabel>
      <StepLabel x={855} y={488}>
        project
      </StepLabel>
      <StepLabel x={1165} y={782} note="drawn here in two">
        5-D coordinates
      </StepLabel>
      <StepLabel x={1427} y={488}>
        cluster
      </StepLabel>

      {[0, 1, 2].map((c) => (
        <div
          key={c}
          style={{
            position: 'absolute',
            left: 1470,
            top: 332 + c * 104,
            width: 330,
            height: 84,
            boxSizing: 'border-box',
            borderRadius: 12,
            border: `1px solid ${THEME_COLORS[c]}52`,
            background: `linear-gradient(100deg, ${THEME_COLORS[c]}16 0%, ${palette.surface} 72%)`,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 24px',
            fontSize: 27,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: THEME_COLORS[c] }} />
          Theme {c + 1}
        </div>
      ))}

      <div
        style={{
          position: 'absolute',
          left: 1470,
          top: 656,
          width: 330,
          height: 84,
          boxSizing: 'border-box',
          borderRadius: 12,
          border: `1.5px dashed ${palette.dim}`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 24px',
          fontSize: 27,
          color: palette.textSoft,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: palette.dim }} />
        Noise
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 74,
          textAlign: 'center',
          fontSize: 40,
          color: palette.textSoft,
        }}
      >
        Nothing is forced into a bucket.{' '}
        <span style={{ color: 'var(--osd-accent)' }}>What doesn&apos;t cluster stays noise.</span>
      </div>
    </div>
  );
};

const FRAMES = [
  { label: 'Initial fit', tag: 'anchor', active: [0, 1, 2], counts: [26, 20, 22], noise: 10, seed: 0x2b71 },
  { label: 'New data', tag: 'aligned fit', active: [0, 1, 2], counts: [22, 26, 9], noise: 8, seed: 0x51c4 },
  { label: 'New data', tag: 'aligned fit', active: [0, 1], counts: [30, 31, 0], noise: 5, seed: 0x9de2 },
];

const ThemeAlignment: Page = () => (
  <div style={fill}>
    <PageNumber />
    <MathBadge />

    <h2
      style={{
        position: 'absolute',
        top: 50,
        left: 236,
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: '-0.025em',
      }}
    >
      How a theme stays itself
    </h2>

    <div style={{ position: 'absolute', top: 132, left: 236, fontSize: 34, color: palette.textSoft }}>
      Later batches are rotated into the anchor&apos;s space — never given their own.
    </div>

    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      aria-hidden
      style={{ position: 'absolute', inset: 0 }}
    >
      {FRAMES.map((frame, i) => {
        const x = 190 + i * 545;
        return (
          <g key={i}>
            <rect x={x - 40} y={276} width={464} height={520} rx={20} fill="#ffffff04" />
            <Scatter
              x={x}
              y={310}
              size={384}
              dots={sampleCloud(frame.seed, frame.counts, frame.noise)}
              active={frame.active}
            />
            {i < 2 && (
              <>
                <path
                  d={`M ${x + 424} 502 H ${x + 496}`}
                  stroke={palette.muted}
                  strokeWidth={1.6}
                  fill="none"
                  strokeDasharray="6 6"
                />
                <path d={`M ${x + 488} 496 L ${x + 498} 502 L ${x + 488} 508 Z`} fill={palette.muted} />
              </>
            )}
          </g>
        );
      })}

      <path
        d="M 232 848 H 1688"
        stroke={palette.border}
        strokeWidth={1.4}
        fill="none"
      />
      <path d="M 1680 842 L 1690 848 L 1680 854 Z" fill={palette.border} />
    </svg>

    {FRAMES.map((frame, i) => {
      const x = 190 + i * 545;
      return (
        <div key={i} style={{ position: 'absolute', left: x, top: 208, width: 384, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 600 }}>{frame.label}</div>
          <div
            style={{
              marginTop: 8,
              fontFamily: font.mono,
              fontSize: 20,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: i === 0 ? 'var(--osd-accent)' : palette.muted,
            }}
          >
            {frame.tag}
          </div>
        </div>
      );
    })}

    {FRAMES.map((_, i) => {
      const x = 190 + i * 545;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: 726,
            width: 384,
            textAlign: 'center',
            fontFamily: font.mono,
            fontSize: 21,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: palette.muted,
          }}
        >
          Frame {i + 1}
        </div>
      );
    })}

    {[
      { x: 190, text: 'Three themes' },
      { x: 735, text: 'Blue thinning' },
      { x: 1280, text: 'Blue is gone' },
    ].map((note) => (
      <div
        key={note.x}
        style={{
          position: 'absolute',
          left: note.x,
          top: 872,
          width: 384,
          textAlign: 'center',
          fontSize: 28,
          color: palette.textSoft,
        }}
      >
        {note.text}
      </div>
    ))}

    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 74,
        textAlign: 'center',
        fontSize: 40,
        color: palette.textSoft,
      }}
    >
      The same coordinate space every time — so{' '}
      <span style={{ color: 'var(--osd-accent)' }}>change is real, not an artifact.</span>
    </div>
  </div>
);

const LivingModel: Page = () => (
  <div style={fill}>
    <PageNumber />

    <h2
      style={{
        position: 'absolute',
        top: 50,
        left: 236,
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: '-0.025em',
      }}
    >
      A living semantic model.
    </h2>
    <div style={{ position: 'absolute', top: 138, left: 236, fontSize: 40, color: palette.textSoft }}>
      Themes evolve over time.
    </div>

    <TimeAxis />

    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      aria-hidden
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        {STREAMS.map((stream, i) => (
          <linearGradient key={stream.title} id={`stream-${i}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={stream.color} stopOpacity={0.34} />
            <stop offset="55%" stopColor={stream.color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={stream.color} stopOpacity={0.82} />
          </linearGradient>
        ))}
      </defs>

      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = CX0 + (CX1 - CX0) * (0.05 + i * 0.185);
        return (
          <path
            key={i}
            d={`M ${x} 344 V ${ROW_TOP + 4 * ROW_GAP + 66}`}
            stroke="#1c1c28"
            strokeWidth={1.4}
          />
        );
      })}

      {STREAMS.map((stream, i) => {
        const rowY = ROW_TOP + i * ROW_GAP;
        const { area, edge } = ribbon(stream.width, rowY);
        return (
          <g key={stream.title}>
            <path d={area} fill={`url(#stream-${i})`} />
            <path d={edge} fill="none" stroke={stream.color} strokeWidth={2} opacity={0.95} />
            {Array.from({ length: 5 }, (_, k) => (
              <circle
                key={k}
                cx={CX1 + 26 + k * 26}
                cy={rowY}
                r={3.4}
                fill={stream.color}
                opacity={0.9 - k * 0.13}
              />
            ))}
          </g>
        );
      })}
    </svg>

    {STREAMS.map((stream, i) => (
      <div
        key={stream.title}
        style={{
          position: 'absolute',
          left: 128,
          top: ROW_TOP + i * ROW_GAP - 34,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          height: 68,
        }}
      >
        <svg
          width={44}
          height={44}
          viewBox="0 0 36 36"
          aria-hidden
          style={{ color: stream.color, flexShrink: 0 }}
          fill="none"
          stroke={stream.color}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {stream.icon}
        </svg>
        <div style={{ fontSize: 32, lineHeight: 1.18, whiteSpace: 'pre-line' }}>{stream.title}</div>
      </div>
    ))}

    <div
      style={{
        position: 'absolute',
        top: 200,
        right: 176,
        fontFamily: font.mono,
        fontSize: 22,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: palette.muted,
      }}
    >
      Band height = share of traces
    </div>

  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Lifecycle page — themes are born, split, and die

const LC = {
  frameX: [216, 566, 916, 1266],
  frameW: 268,
  top: 232,
  bottom: 758,
};

const LC_BANDS = [
  {
    color: palette.green,
    points: '236,280 1016,330 1016,346 236,398',
  },
  {
    color: '#e8747f',
    points: '772,386 1704,312 1704,458 772,398',
  },
  {
    color: palette.blue,
    points: '236,462 884,462 884,578 236,578',
  },
  {
    color: '#e8c04a',
    points: '620,572 972,634 1704,634 1704,726 946,726 620,586',
  },
];

const LC_EVENTS = [
  ['Green theme born', 'Blue theme born'],
  ['Green weakening', 'Yellow splits from blue', 'Red theme born'],
  ['Green dies', 'Blue dies suddenly', 'Red strengthening'],
  ['Red strengthening'],
];

const Lifecycle: Page = () => (
  <div style={fill}>
    <PageNumber />

    <h2
      style={{
        position: 'absolute',
        top: 50,
        left: 236,
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: '-0.025em',
      }}
    >
      Themes are born, split, and die
    </h2>

    <div style={{ position: 'absolute', top: 132, left: 236, fontSize: 34, color: palette.textSoft }}>
      Width is volume. Every change is an event you can act on.
    </div>

    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      aria-hidden
      style={{ position: 'absolute', inset: 0 }}
    >
      {LC.frameX.map((x, i) => (
        <rect key={i} x={x} y={LC.top} width={LC.frameW} height={LC.bottom - LC.top} rx={22} fill="#ffffff06" />
      ))}

      {LC_BANDS.map((band) => (
        <polygon
          key={band.color}
          points={band.points}
          fill={`${band.color}59`}
          stroke={`${band.color}b8`}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      ))}

      {/* abrupt end marker on the blue band */}
      <path d="M 884 462 V 578" stroke={palette.blue} strokeWidth={5} />

      <path d="M 236 800 H 1690" stroke={palette.border} strokeWidth={1.4} fill="none" />
      <path d="M 1682 794 L 1692 800 L 1682 806 Z" fill={palette.border} />
    </svg>

    {LC.frameX.map((x, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: LC.bottom + 12,
          width: LC.frameW,
          textAlign: 'center',
          fontFamily: font.mono,
          fontSize: 21,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: palette.muted,
        }}
      >
        Frame {i + 1}
      </div>
    ))}

    {LC_EVENTS.map((events, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: LC.frameX[i] - 10,
          top: 838,
          width: LC.frameW + 60,
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
        }}
      >
        {events.map((event) => (
          <div key={event} style={{ fontSize: 25, color: palette.textSoft, lineHeight: 1.2 }}>
            <span style={{ color: palette.dim }}>·</span> {event}
          </div>
        ))}
      </div>
    ))}

    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 60,
        textAlign: 'center',
        fontSize: 40,
        color: palette.textSoft,
      }}
    >
      Not a dashboard to stare at. <span style={{ color: 'var(--osd-accent)' }}>This is the alert layer.</span>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Flow vocabulary — shared by the three "what happens next" pages

type Tone = 'default' | 'accent' | 'dim';

const toneStyle = (tone: Tone) => {
  if (tone === 'accent')
    return {
      border: '1px solid #8b7ff55e',
      background: 'linear-gradient(157deg, #221f3d 0%, #14131f 52%, #101019 100%)',
      boxShadow: '0 30px 70px -34px #8b7ff5b0, inset 0 1px 0 rgba(255,255,255,0.09)',
    };
  if (tone === 'dim')
    return {
      border: `1.5px dashed ${palette.dim}`,
      background: 'linear-gradient(160deg, rgba(255,255,255,0.018) 0%, rgba(255,255,255,0) 100%)',
      boxShadow: 'none',
    };
  return {
    border: '1px solid #282836',
    background: 'linear-gradient(157deg, #1a1a25 0%, #131320 60%, #0f0f18 100%)',
    boxShadow: '0 26px 54px -34px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.055)',
  };
};

// A soft pool of light behind a diagram, so the flow reads as one object.
const Backdrop = ({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) => (
  <div
    style={{
      position: 'absolute',
      left: cx - rx,
      top: cy - ry,
      width: rx * 2,
      height: ry * 2,
      background: 'radial-gradient(ellipse at center, rgba(139,127,245,0.085) 0%, rgba(139,127,245,0) 68%)',
      pointerEvents: 'none',
    }}
  />
);

const FlowNode = ({
  x,
  y,
  w,
  h,
  title,
  lines,
  tone = 'default',
  size = 28,
  hue,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  tone?: Tone;
  size?: number;
  hue?: string;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      boxSizing: 'border-box',
      borderRadius: 16,
      padding: '0 22px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      textAlign: 'center',
      overflow: 'hidden',
      ...toneStyle(tone),
    }}
  >
    {hue && (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: `linear-gradient(180deg, ${hue} 0%, ${hue}33 100%)`,
        }}
      />
    )}
    <div
      style={{
        fontSize: size,
        lineHeight: 1.16,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        color: tone === 'dim' ? palette.textSoft : 'var(--osd-text)',
      }}
    >
      {title}
    </div>
    {lines?.map((line) => (
      <div key={line} style={{ fontSize: size - 6, lineHeight: 1.22, color: palette.textSoft }}>
        {line}
      </div>
    ))}
  </div>
);

const PanelLabel = ({ x, y, w, children }: { x: number; y: number; w: number; children: React.ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '7px 18px',
        borderRadius: 999,
        border: '1px solid #8b7ff54d',
        background: 'linear-gradient(180deg, #1c1a2e 0%, #131220 100%)',
        boxShadow: '0 14px 32px -20px #8b7ff5cc',
        fontFamily: font.mono,
        fontSize: 20,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--osd-accent)',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: 'var(--osd-accent)',
          boxShadow: '0 0 12px 2px #8b7ff5aa',
        }}
      />
      {children}
    </div>
  </div>
);

type Dir = 'r' | 'd' | 'l' | 'u';

const arrowHead = (x: number, y: number, dir: Dir = 'r') => {
  const L = 14;
  const W = 7.5;
  switch (dir) {
    case 'r':
      return `M ${x} ${y} L ${x - L} ${y - W} L ${x - L} ${y + W} Z`;
    case 'l':
      return `M ${x} ${y} L ${x + L} ${y - W} L ${x + L} ${y + W} Z`;
    case 'd':
      return `M ${x} ${y} L ${x - W} ${y - L} L ${x + W} ${y - L} Z`;
    default:
      return `M ${x} ${y} L ${x - W} ${y + L} L ${x + W} ${y + L} Z`;
  }
};

// Orthogonal connectors with rounded corners — a flow chart should look drawn,
// not sketched. Each helper names the segment order it emits.
const corner = (x: number, y: number, dx: number, dy: number, r: number) =>
  `Q ${x} ${y} ${x + dx * r} ${y + dy * r}`;

// horizontal → vertical → horizontal, turning at `mid`
const hvh = (x0: number, y0: number, x1: number, y1: number, mid?: number, r = 22) => {
  if (Math.abs(y1 - y0) < 1) return `M ${x0} ${y0} H ${x1}`;
  const mx = mid ?? (x0 + x1) / 2;
  const sy = Math.sign(y1 - y0);
  const sx = Math.sign(mx - x0);
  const rr = Math.min(r, Math.abs(y1 - y0) / 2, Math.abs(mx - x0), Math.abs(x1 - mx));
  return [
    `M ${x0} ${y0}`,
    `H ${mx - sx * rr}`,
    corner(mx, y0, 0, sy, rr),
    `V ${y1 - sy * rr}`,
    corner(mx, y1, Math.sign(x1 - mx), 0, rr),
    `H ${x1}`,
  ].join(' ');
};

// vertical → horizontal
const vh = (x0: number, y0: number, x1: number, y1: number, r = 22) => {
  if (Math.abs(y1 - y0) < 1) return `M ${x0} ${y0} H ${x1}`;
  const sy = Math.sign(y1 - y0);
  const sx = Math.sign(x1 - x0);
  const rr = Math.min(r, Math.abs(y1 - y0), Math.abs(x1 - x0));
  return `M ${x0} ${y0} V ${y1 - sy * rr} ${corner(x0, y1, sx, 0, rr)} H ${x1}`;
};

// down → across → up, the return rail under a flow
const railBack = (x0: number, y0: number, x1: number, y1: number, railY: number, r = 22) => {
  const sx = Math.sign(x1 - x0);
  const rr = r;
  return [
    `M ${x0} ${y0}`,
    `V ${railY - rr}`,
    corner(x0, railY, sx, 0, rr),
    `H ${x1 - sx * rr}`,
    corner(x1, railY, 0, -1, rr),
    `V ${y1}`,
  ].join(' ');
};

const FlowArrow = ({
  d,
  head,
  dir = 'r',
  color = '#4d4d63',
  dashed = false,
}: {
  d: string;
  head: [number, number];
  dir?: Dir;
  color?: string;
  dashed?: boolean;
}) => (
  <g>
    <path
      d={d}
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? '7 9' : undefined}
    />
    <path d={arrowHead(head[0], head[1], dir)} fill={color} />
  </g>
);

// A label that sits on the wire itself, so branches never read ambiguously.
const EdgeChip = ({
  x,
  y,
  color = palette.muted,
  children,
}: {
  x: number;
  y: number;
  color?: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: 'translate(-50%, -50%)',
      padding: '5px 13px',
      borderRadius: 999,
      border: `1px solid ${color}59`,
      background: '#0b0b12',
      fontFamily: font.mono,
      fontSize: 18,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

// Diamond with softened corners — a hard polygon looks cheap next to rounded cards.
const roundedDiamond = (cx: number, cy: number, rx: number, ry: number, r: number) => {
  const v = [
    [cx, cy - ry],
    [cx + rx, cy],
    [cx, cy + ry],
    [cx - rx, cy],
  ];
  const cut = (a: number[], b: number[]) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    const t = Math.min(r, len * 0.36) / len;
    return [a[0] + dx * t, a[1] + dy * t];
  };
  let d = '';
  for (let i = 0; i < 4; i++) {
    const prev = v[(i + 3) % 4];
    const cur = v[i];
    const next = v[(i + 1) % 4];
    const inPt = cut(cur, prev);
    const outPt = cut(cur, next);
    d += i === 0 ? `M ${inPt[0]} ${inPt[1]} ` : `L ${inPt[0]} ${inPt[1]} `;
    d += `Q ${cur[0]} ${cur[1]} ${outPt[0]} ${outPt[1]} `;
  }
  return `${d}Z`;
};

const Diamond = ({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) => (
  <g>
    <path
      d={roundedDiamond(cx, cy, rx + 9, ry + 9, 26)}
      fill="none"
      stroke="#8b7ff51f"
      strokeWidth={1.2}
    />
    <path
      d={roundedDiamond(cx, cy, rx, ry, 22)}
      fill="#8b7ff51a"
      stroke="#8b7ff57a"
      strokeWidth={1.6}
    />
  </g>
);

const StepRow = ({
  x,
  y,
  w,
  n,
  title,
  sub,
}: {
  x: number;
  y: number;
  w: number;
  n: number;
  title: string;
  sub: string;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: 76,
      boxSizing: 'border-box',
      borderRadius: 13,
      border: '1px solid #2b2b3a',
      background: 'linear-gradient(180deg, #1b1b27 0%, #131320 100%)',
      boxShadow: '0 18px 38px -26px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.05)',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}
  >
    <span
      style={{
        fontFamily: font.mono,
        fontSize: 18,
        color: 'var(--osd-accent)',
        opacity: 0.8,
        width: 26,
        flexShrink: 0,
      }}
    >
      {`0${n}`}
    </span>
    <span style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, overflow: 'hidden' }}>
      <span style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.1 }}>{title}</span>
      <span style={{ fontSize: 19, color: palette.muted, lineHeight: 1.1 }}>{sub}</span>
    </span>
  </div>
);

const EdgeLabel = ({ x, y, children }: { x: number; y: number; children: React.ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      fontFamily: font.mono,
      fontSize: 20,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: palette.muted,
    }}
  >
    {children}
  </div>
);

const PageHead = ({ title, sub }: { title: string; sub: string }) => (
  <>
    <h2
      style={{
        position: 'absolute',
        top: 50,
        left: 236,
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: '-0.025em',
      }}
    >
      {title}
    </h2>
    <div style={{ position: 'absolute', top: 132, left: 236, fontSize: 34, color: palette.textSoft }}>{sub}</div>
  </>
);

const IllustrativeTag = () => (
  <div
    style={{
      position: 'absolute',
      right: 140,
      top: 58,
      padding: '7px 18px',
      borderRadius: 999,
      border: '1px solid #2c2c3c',
      background: '#0e0e16',
      fontFamily: font.mono,
      fontSize: 19,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#6b6b7e',
    }}
  >
    Illustrative data
  </div>
);

const Takeaway = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 58,
      textAlign: 'center',
      fontSize: 38,
      color: palette.textSoft,
    }}
  >
    {children}
  </div>
);

const BulletCard = ({
  x,
  y,
  w,
  title,
  lines,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  lines: string[];
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      boxSizing: 'border-box',
      borderRadius: 16,
      padding: '26px 28px',
      ...toneStyle('accent'),
    }}
  >
    <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 18 }}>{title}</div>
    {lines.map((line) => (
      <div key={line} style={{ fontSize: 24, lineHeight: 1.5, color: palette.textSoft, display: 'flex', gap: 12 }}>
        <span style={{ color: 'var(--osd-accent)' }}>·</span>
        {line}
      </div>
    ))}
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Struggle — names the received wisdom, then shows the hole in it. This is the
// question the whole deck answers, so it lands before the roadmap.

const Struggle: Page = () => (
  <div style={fill}>
    <PageNumber />
    <PageHead title={'\u201CJust use traces and evals.\u201D'} sub="Everyone agrees. Almost nobody gets a better agent out of it." />

    <Backdrop cx={890} cy={560} rx={760} ry={340} />

    <svg width={1920} height={1080} viewBox="0 0 1920 1080" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <rect
        x={590}
        y={372}
        width={600}
        height={370}
        rx={20}
        fill="#0d0d15"
        fillOpacity={0.55}
        stroke="#33334a"
        strokeWidth={2}
        strokeDasharray="10 12"
      />

      <FlowArrow d="M 470 467 H 570" head={[580, 467]} color="#3b3b4c" />
      <FlowArrow d="M 470 647 H 570" head={[580, 647]} color="#3b3b4c" />
      <FlowArrow d="M 1200 557 H 1296" head={[1306, 557]} color={`${palette.accent}a6`} />
    </svg>

    <FlowNode x={170} y={392} w={300} h={150} title="Traces" lines={['You already have them']} tone="dim" size={34} />
    <FlowNode x={170} y={572} w={300} h={150} title="Evals" lines={['You already run them']} tone="dim" size={34} />

    <div
      style={{
        position: 'absolute',
        left: 590,
        top: 372,
        width: 600,
        height: 370,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
      }}
    >
      <div style={{ fontSize: 150, lineHeight: 1, fontWeight: 700, color: '#2f2f42' }}>?</div>
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 22,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: palette.muted,
        }}
      >
        Nobody explains this part
      </div>
    </div>

    <FlowNode x={1320} y={467} w={400} h={180} title="A better agent" lines={['The thing you actually wanted']} tone="accent" size={34} />

    <Takeaway>
      Collecting the data was never the hard part.{' '}
      <span style={{ color: 'var(--osd-accent)' }}>Closing the gap is.</span>
    </Takeaway>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Roadmap — the promise slide. Shown early so the audience holds the
// destination through every mechanism slide that follows.

const ROADMAP = [
  { title: 'Traces', lines: ['What your agent', 'already emits'] },
  { title: 'Signals', lines: ['Goal, outcome,', 'behavior, sentiment'] },
  { title: 'Themes', lines: ['The patterns', 'underneath them'] },
  { title: 'Candidate', lines: ['Something changed,', 'and it matters'] },
  { title: 'Investigation', lines: ['Evidence,', 'not a guess'] },
  { title: 'Pull request', lines: ['A diff and a scorer', 'that proves it'] },
];

const RM = { x0: 128, step: 286, w: 234, y: 420, h: 180 };

// Three acts, named above the row. Act one gets its own divider slide next.
const RM_ACTS = [
  { label: 'Trace Intelligence', from: 0, to: 2, t: 0.18 },
  { label: 'Investigation', from: 3, to: 4, t: 0.58 },
  { label: 'Change', from: 5, to: 5, t: 0.95 },
];
const rmX = (i: number) => RM.x0 + i * RM.step;
const rmCx = (i: number) => rmX(i) + RM.w / 2;
const rmMid = RM.y + RM.h / 2;
const rmBottom = RM.y + RM.h;

// The row warms up from left to right, so the eye travels to the payoff.
const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, '0');
const mix = (a: string, b: string, t: number) => {
  const ch = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2].map((i) => hex2(ch(a, i) + (ch(b, i) - ch(a, i)) * t)).join('')}`;
};

const Roadmap: Page = () => (
  <div style={fill}>
    <PageNumber />
    <PageHead title="A bird's-eye view of Agent Learning" sub="Traces go in. A pull request comes out." />

    <Backdrop cx={960} cy={520} rx={900} ry={360} />
    <Backdrop cx={rmCx(5)} cy={rmMid} rx={290} ry={230} />

    <svg width={1920} height={1080} viewBox="0 0 1920 1080" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="rm-spine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#22222e" />
          <stop offset="100%" stopColor={palette.accent} />
        </linearGradient>
      </defs>

      <line x1={rmCx(0)} x2={rmCx(5)} y1={rmMid} y2={rmMid} stroke="url(#rm-spine)" strokeWidth={2} />

      {RM_ACTS.map((act) => {
        const l = rmX(act.from);
        const r = rmX(act.to) + RM.w;
        const c = mix('#33334a', palette.accent, act.t);
        return (
          <path
            key={act.label}
            d={`M ${l} ${364} V ${374} M ${l} ${364} H ${r} M ${r} ${364} V ${374}`}
            stroke={c}
            strokeWidth={1.5}
            fill="none"
            opacity={0.85}
          />
        );
      })}

      {ROADMAP.slice(0, -1).map((stage, i) => (
        <path
          key={stage.title}
          d={arrowHead(rmX(i) + RM.w + 34, rmMid)}
          fill={mix('#3a3a4c', palette.accent, (i + 1) / 5)}
        />
      ))}

      <path
        d={`M ${rmCx(5)} ${rmBottom + 18} C ${rmCx(5)} ${rmBottom + 210}, ${rmCx(0)} ${rmBottom + 210}, ${rmCx(0)} ${rmBottom + 26}`}
        stroke={`${palette.accent}52`}
        strokeWidth={2}
        fill="none"
        strokeDasharray="7 9"
        strokeLinecap="round"
      />
      <path d={arrowHead(rmCx(0), rmBottom + 18, 'u')} fill={`${palette.accent}8c`} />
    </svg>

    {RM_ACTS.map((act) => (
      <div
        key={act.label}
        style={{
          position: 'absolute',
          left: rmX(act.from),
          top: 322,
          width: rmX(act.to) + RM.w - rmX(act.from),
          textAlign: 'center',
          fontFamily: font.mono,
          fontSize: 21,
          letterSpacing: '0.13em',
          textTransform: 'uppercase',
          color: mix('#6a6a7e', palette.accent, act.t),
        }}
      >
        {act.label}
      </div>
    ))}

    {ROADMAP.map((stage, i) => {
      const t = i / (ROADMAP.length - 1);
      const last = i === ROADMAP.length - 1;
      return (
        <div key={stage.title}>
          <div
            style={{
              position: 'absolute',
              left: rmX(i),
              top: RM.y,
              width: RM.w,
              height: RM.h,
              boxSizing: 'border-box',
              borderRadius: 18,
              border: `1px solid ${mix('#242432', palette.accent, 0.12 + t * 0.62)}`,
              background: `linear-gradient(180deg, ${mix('#15151f', '#1c1834', t)} 0%, ${mix('#101018', '#141126', t)} 100%)`,
              boxShadow: last
                ? `0 26px 56px -30px rgba(0,0,0,0.95), 0 0 46px -8px ${palette.accent}4d, inset 0 1px 0 rgba(255,255,255,0.06)`
                : '0 24px 50px -32px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.045)',
              padding: '0 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: '-0.015em',
                color: mix('#9d9dae', '#f2f2f5', t),
              }}
            >
              {stage.title}
            </div>
            {stage.lines.map((line) => (
              <div key={line} style={{ fontSize: 21, lineHeight: 1.22, color: palette.muted }}>
                {line}
              </div>
            ))}
          </div>

          <div
            style={{
              position: 'absolute',
              left: rmCx(i) - 25,
              top: RM.y - 25,
              width: 50,
              height: 50,
              borderRadius: 999,
              boxSizing: 'border-box',
              border: `1px solid ${mix('#2a2a38', palette.accent, 0.16 + t * 0.66)}`,
              background: '#0c0c14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: font.mono,
              fontSize: 20,
              color: mix('#6d6d80', palette.accent, t),
            }}
          >
            {`0${i + 1}`}
          </div>
        </div>
      );
    })}

    <EdgeChip x={960} y={rmBottom + 175} color={palette.accent}>
      And the traces change again
    </EdgeChip>

    <Takeaway>
      You don&apos;t end with a dashboard.{' '}
      <span style={{ color: 'var(--osd-accent)' }}>You end with a diff.</span>
    </Takeaway>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Act divider — hands off from the roadmap into act one. The strip along the
// bottom is the roadmap row at the same x positions, with act one lit, so the
// audience sees exactly where in the map they are standing.

const ActDivider = ({
  part,
  title,
  sub,
  lit,
}: {
  part: string;
  title: string;
  sub: string;
  lit: [number, number];
}) => (
  <div style={fill}>
    <PageNumber />
    <Backdrop cx={760} cy={470} rx={820} ry={330} />

    <div
      style={{
        position: 'absolute',
        left: 236,
        top: 296,
        fontFamily: font.mono,
        fontSize: 26,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: palette.accent,
      }}
    >
      {part}
    </div>

    <h2
      style={{
        position: 'absolute',
        top: 348,
        left: 236,
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 118,
        fontWeight: 800,
        letterSpacing: '-0.03em',
      }}
    >
      {title}
    </h2>

    <div style={{ position: 'absolute', top: 512, left: 236, fontSize: 40, color: palette.textSoft }}>{sub}</div>

    <svg width={1920} height={1080} viewBox="0 0 1920 1080" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <line x1={rmCx(0)} x2={rmCx(5)} y1={870} y2={870} stroke="#22222e" strokeWidth={2} />
    </svg>

    {ROADMAP.map((stage, i) => {
      const on = i >= lit[0] && i <= lit[1];
      return (
        <div
          key={stage.title}
          style={{
            position: 'absolute',
            left: rmX(i),
            top: 838,
            width: RM.w,
            height: 64,
            boxSizing: 'border-box',
            borderRadius: 12,
            border: `1px solid ${on ? `${palette.accent}8c` : '#22222e'}`,
            background: on ? 'linear-gradient(180deg, #1c1834 0%, #141126 100%)' : '#0c0c14',
            boxShadow: on ? `0 0 34px -10px ${palette.accent}59` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: 24,
            color: on ? '#f2f2f5' : '#4e4e60',
          }}
        >
          <span style={{ fontFamily: font.mono, fontSize: 18, color: on ? palette.accent : '#3a3a4a' }}>
            {`0${i + 1}`}
          </span>
          {stage.title}
        </div>
      );
    })}
  </div>
);

const TraceIntelligence: Page = () => (
  <ActDivider
    part="Part one"
    title="Trace Intelligence"
    sub="Turning what your agent already emits into a map of what it actually does."
    lit={[0, 2]}
  />
);

const InvestigationAct: Page = () => (
  <ActDivider
    part="Part two"
    title="Investigation"
    sub="The map moved. Now something has to go find out why."
    lit={[3, 4]}
  />
);

const ChangeAct: Page = () => (
  <ActDivider
    part="Part three"
    title="Change"
    sub="The cause is known. Now it has to become something you can merge."
    lit={[5, 5]}
  />
);

// ────────────────────────────────────────────────────────────────────────────
// Grayson — a character card, deliberately off-rhythm from the flow diagrams
// on either side. The dossier is what he can see, do, and hand back.

const GRAYSON_DOSSIER = [
  { label: 'Sees', top: 286, lines: [{ t: 'Every trace behind the candidate' }, { t: 'The repository that produced them' }] },
  {
    label: 'Does',
    top: 486,
    lines: [{ t: 'Reads the traces' }, { t: 'Finds the pattern that repeats' }, { t: 'Reads the code that caused it' }],
  },
  {
    label: 'Returns',
    top: 734,
    lines: [{ t: 'A finding, with the evidence attached' }, { t: 'Or nothing at all', dim: true }],
  },
];

const GRAYSON_ORB = { cx: 545, cy: 424, r: 130 };

const GraysonIntro: Page = () => (
  <div style={fill}>
    <PageNumber />
    <Backdrop cx={GRAYSON_ORB.cx} cy={GRAYSON_ORB.cy} rx={400} ry={360} />

    <svg width={1920} height={1080} viewBox="0 0 1920 1080" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <circle cx={GRAYSON_ORB.cx} cy={GRAYSON_ORB.cy} r={GRAYSON_ORB.r + 46} stroke="#242433" strokeWidth={1} fill="none" />
      <circle
        cx={GRAYSON_ORB.cx}
        cy={GRAYSON_ORB.cy}
        r={GRAYSON_ORB.r + 22}
        stroke={`${palette.accent}2e`}
        strokeWidth={1.5}
        strokeDasharray="3 11"
        fill="none"
      />
      <circle
        cx={GRAYSON_ORB.cx}
        cy={GRAYSON_ORB.cy}
        r={GRAYSON_ORB.r}
        fill="#0d0d17"
        stroke={`${palette.accent}8c`}
        strokeWidth={1.5}
      />

      {Array.from({ length: 36 }, (_, i) => {
        const a = (i * Math.PI) / 18;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const r0 = GRAYSON_ORB.r + 52;
        const r1 = r0 + (i % 3 === 0 ? 14 : 7);
        return (
          <line
            key={i}
            x1={GRAYSON_ORB.cx + r0 * cos}
            y1={GRAYSON_ORB.cy + r0 * sin}
            x2={GRAYSON_ORB.cx + r1 * cos}
            y2={GRAYSON_ORB.cy + r1 * sin}
            stroke={i % 3 === 0 ? `${palette.accent}73` : '#2b2b3c'}
            strokeWidth={1.5}
          />
        );
      })}

      <path
        d={`M ${GRAYSON_ORB.cx + 152 * Math.cos(-1.92)} ${GRAYSON_ORB.cy + 152 * Math.sin(-1.92)} A 152 152 0 0 1 ${
          GRAYSON_ORB.cx + 152 * Math.cos(-0.7)
        } ${GRAYSON_ORB.cy + 152 * Math.sin(-0.7)}`}
        stroke={palette.accent}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx={GRAYSON_ORB.cx + 152 * Math.cos(-0.7)}
        cy={GRAYSON_ORB.cy + 152 * Math.sin(-0.7)}
        r={5}
        fill={palette.accent}
      />

      {Array.from({ length: 13 }, (_, i) => {
        const y = GRAYSON_ORB.cy + (i - 6) * 27;
        const x0 = 92 + (i % 3) * 26;
        const xEnd = GRAYSON_ORB.cx - 202;
        return (
          <path
            key={`feed-${i}`}
            d={`M ${x0} ${y} C ${(x0 + xEnd) / 2} ${y}, ${(x0 + xEnd) / 2} ${
              GRAYSON_ORB.cy + (y - GRAYSON_ORB.cy) * 0.45
            }, ${xEnd} ${GRAYSON_ORB.cy + (y - GRAYSON_ORB.cy) * 0.4}`}
            stroke={i % 4 === 0 ? `${palette.accent}59` : '#262634'}
            strokeWidth={1.5}
            fill="none"
          />
        );
      })}

      <line x1={1000} x2={1000} y1={286} y2={880} stroke="#1e1e2b" strokeWidth={1} />
    </svg>

    <div
      style={{
        position: 'absolute',
        left: GRAYSON_ORB.cx - GRAYSON_ORB.r,
        top: GRAYSON_ORB.cy - GRAYSON_ORB.r,
        width: GRAYSON_ORB.r * 2,
        height: GRAYSON_ORB.r * 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--osd-font-display)',
        fontSize: 132,
        fontWeight: 800,
        color: palette.accent,
        textShadow: `0 0 40px ${palette.accent}59`,
      }}
    >
      G
    </div>

    <h2
      style={{
        position: 'absolute',
        left: 190,
        top: 632,
        width: 710,
        margin: 0,
        textAlign: 'center',
        fontFamily: 'var(--osd-font-display)',
        fontSize: 130,
        fontWeight: 800,
        letterSpacing: '-0.03em',
      }}
    >
      Grayson
    </h2>

    <div
      style={{
        position: 'absolute',
        left: 190,
        top: 794,
        width: 710,
        textAlign: 'center',
        fontFamily: font.mono,
        fontSize: 25,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: palette.accent,
      }}
    >
      Investigation agent
    </div>

    {GRAYSON_DOSSIER.map((block, i) => (
      <div key={block.label} style={{ position: 'absolute', left: 1058, top: block.top, width: 740 }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 6,
            bottom: 6,
            width: 2,
            borderRadius: 2,
            background: `linear-gradient(180deg, ${palette.accent}8c 0%, ${palette.accent}14 100%)`,
          }}
        />
        <div style={{ paddingLeft: 34 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '5px 15px',
                borderRadius: 999,
                border: `1px solid ${palette.accent}45`,
                background: 'linear-gradient(180deg, #1b1830 0%, #131120 100%)',
                fontFamily: font.mono,
                fontSize: 20,
                letterSpacing: '0.17em',
                textTransform: 'uppercase',
                color: palette.accent,
              }}
            >
              {block.label}
            </span>
            <span style={{ fontFamily: font.mono, fontSize: 18, color: '#3f3f52' }}>{`0${i + 1}`}</span>
          </div>
          {block.lines.map((line) => (
            <div
              key={line.t}
              style={{ fontSize: 34, lineHeight: 1.4, color: line.dim ? '#55556a' : palette.textSoft }}
            >
              {line.t}
            </div>
          ))}
        </div>
      </div>
    ))}

    <Takeaway>
      You never ask Grayson anything.{' '}
      <span style={{ color: 'var(--osd-accent)' }}>It shows up when the map moves.</span>
    </Takeaway>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Candidate page — a change becomes a hypothesis

const CANDIDATE_BRANCHES = [
  {
    y: 261,
    hue: palette.accent,
    title: 'Lifecycle changed',
    lines: ['Born · split or merged · disappeared or resurfaced'],
  },
  { y: 481, hue: palette.blue, title: 'Frequency shifted', lines: ['A larger or smaller share of traces'] },
  { y: 701, hue: palette.orange, title: 'New activity surged', lines: ['Unusually many new traces joining'] },
];

const CandidateFlow: Page = () => (
  <div style={fill}>
    <PageNumber />
    <PageHead title="A change becomes a candidate" sub="Only meaningful movement gets picked up." />

    <Backdrop cx={940} cy={556} rx={800} ry={400} />

    <svg width={1920} height={1080} viewBox="0 0 1920 1080" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <Diamond cx={600} cy={556} rx={148} ry={128} />

      <FlowArrow d="M 350 556 H 438" head={[448, 556]} />

      <FlowArrow d={vh(600, 428, 826, 336)} head={[840, 336]} color={`${palette.accent}96`} />
      <FlowArrow d="M 748 556 H 826" head={[840, 556]} color={`${palette.blue}96`} />
      <FlowArrow d={vh(600, 684, 826, 776)} head={[840, 776]} color={`${palette.orange}96`} />

      {CANDIDATE_BRANCHES.map((b) => (
        <path
          key={b.title}
          d={hvh(1290, b.y + 75, 1426, 556, 1364)}
          stroke={`${b.hue}96`}
          strokeWidth={2}
          fill="none"
          strokeLinejoin="round"
        />
      ))}
      <path d={arrowHead(1440, 556)} fill={palette.accent} />

      <path d="M 1760 556 H 1836" stroke={palette.muted} strokeWidth={2} strokeDasharray="7 9" fill="none" />
      <path d={arrowHead(1850, 556)} fill={palette.muted} />
    </svg>

    <FlowNode x={120} y={486} w={230} h={140} title="Theme" lines={['Recurring pattern', 'across traces']} />

    <div
      style={{
        position: 'absolute',
        left: 460,
        top: 506,
        width: 280,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 600,
        lineHeight: 1.2,
      }}
    >
      Changed
      <br />
      meaningfully?
    </div>

    {CANDIDATE_BRANCHES.map((b) => (
      <FlowNode key={b.title} x={850} y={b.y} w={440} h={150} title={b.title} lines={b.lines} hue={b.hue} size={30} />
    ))}

    <FlowNode
      x={1440}
      y={476}
      w={320}
      h={160}
      title="Candidate"
      lines={['A neutral hypothesis', 'worth investigating']}
      tone="accent"
    />

    <EdgeLabel x={1772} y={506}>
      Pub/Sub
    </EdgeLabel>

    <Takeaway>
      A candidate is not a bug report. <span style={{ color: 'var(--osd-accent)' }}>It&apos;s a question.</span>
    </Takeaway>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Investigation page

const INV_STEPS = [
  { title: 'Inspect the traces', sub: 'What actually happened?' },
  { title: 'Identify the failure pattern', sub: 'One bad run, or a shape?' },
  { title: 'Review the relevant source', sub: 'Why did it happen — can we fix it?' },
];

const Investigation: Page = () => (
  <div style={fill}>
    <PageNumber />
    <PageHead
      title="Grayson investigates"
      sub="It gets the traces and the repository, and goes looking."
    />

    <Backdrop cx={940} cy={520} rx={820} ry={390} />

    <svg width={1920} height={1080} viewBox="0 0 1920 1080" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <rect x={698} y={326} width={540} height={388} rx={22} fill="#8b7ff50d" stroke="#8b7ff540" />
      <rect x={686} y={314} width={564} height={412} rx={26} fill="none" stroke="#8b7ff518" />

      <FlowArrow d="M 320 520 H 362" head={[372, 520]} />
      <FlowArrow d="M 652 520 H 678" head={[688, 520]} />
      {[0, 1].map((i) => (
        <FlowArrow key={i} d={`M 768 ${492 + i * 96} V ${502 + i * 96}`} head={[768, 512 + i * 96]} dir="d" color="#8b7ff566" />
      ))}
      <FlowArrow d="M 1250 520 H 1286" head={[1296, 520]} />

      <Diamond cx={1396} cy={520} rx={100} ry={108} />

      <FlowArrow d={vh(1396, 412, 1486, 280)} head={[1500, 280]} color={palette.dim} />
      <FlowArrow d={vh(1396, 628, 1486, 690)} head={[1500, 690]} color={`${palette.accent}96`} />
      <FlowArrow d="M 1670 780 V 812" head={[1670, 822]} dir="d" />
    </svg>

    <FlowNode x={120} y={462} w={200} h={116} title="Candidate" tone="accent" size={30} />
    <FlowNode
      x={382}
      y={436}
      w={270}
      h={168}
      title="Gather context"
      lines={['Related runtime traces', 'Connected Git repository']}
      size={29}
    />

    <PanelLabel x={698} y={348} w={540}>
      Grayson
    </PanelLabel>

    {INV_STEPS.map((step, i) => (
      <StepRow key={step.title} x={728} y={416 + i * 96} w={480} n={i + 1} title={step.title} sub={step.sub} />
    ))}

    <div
      style={{
        position: 'absolute',
        left: 1306,
        top: 486,
        width: 180,
        textAlign: 'center',
        fontSize: 27,
        fontWeight: 600,
        lineHeight: 1.16,
      }}
    >
      Failure mode
      <br />
      confirmed?
    </div>

    <EdgeChip x={1396} y={358}>
      No
    </EdgeChip>
    <EdgeChip x={1396} y={654} color={palette.accent}>
      Yes
    </EdgeChip>

    <FlowNode x={1500} y={225} w={340} h={110} title="No issue created" tone="dim" size={28} />
    <FlowNode
      x={1500}
      y={600}
      w={340}
      h={180}
      title="Issue created"
      lines={['Finding summary · supporting evidence', 'Links to the traces']}
      size={28}
    />
    <FlowNode
      x={1500}
      y={826}
      w={340}
      h={100}
      title="Human review"
      lines={['Dismiss, or ask for a fix']}
      tone="accent"
      size={27}
    />

    <Takeaway>
      Most candidates die here. <span style={{ color: 'var(--osd-accent)' }}>That&apos;s the point.</span>
    </Takeaway>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Proposed fix page

const FIX_STEPS = [
  { title: 'Create a scorer', sub: 'Define success' },
  { title: 'Run the current agent', sub: 'Establish a baseline' },
  { title: 'Propose an agent revision', sub: 'Change one thing' },
  { title: 'Edit an isolated repo copy', sub: 'Nothing touches main' },
];

const ProposedFix: Page = () => (
  <div style={fill}>
    <PageNumber />
    <PageHead title="The fix arrives as a diff" sub="Confirmed evidence becomes a dataset, and the dataset becomes a test." />

    <Backdrop cx={950} cy={556} rx={830} ry={400} />

    <svg width={1920} height={1080} viewBox="0 0 1920 1080" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <rect x={724} y={314} width={500} height={484} rx={22} fill="#8b7ff50d" stroke="#8b7ff540" />
      <rect x={712} y={302} width={524} height={508} rx={26} fill="none" stroke="#8b7ff518" />

      <FlowArrow d="M 344 556 H 386" head={[396, 556]} />
      <FlowArrow d="M 678 556 H 704" head={[714, 556]} />
      {[0, 1, 2].map((i) => (
        <FlowArrow
          key={i}
          d={`M 794 ${480 + i * 96} V ${490 + i * 96}`}
          head={[794, 500 + i * 96]}
          dir="d"
          color="#8b7ff566"
        />
      ))}
      <FlowArrow d="M 1224 556 H 1260" head={[1270, 556]} />
      <FlowArrow d="M 1524 556 H 1560" head={[1570, 556]} />
    </svg>

    <FlowNode x={120} y={486} w={224} h={140} title="Investigation confirmed" size={27} />
    <FlowNode
      x={406}
      y={466}
      w={272}
      h={180}
      title="Evidence becomes a dataset"
      lines={['The failing cases, captured']}
      size={28}
    />

    <PanelLabel x={724} y={336} w={500}>
      Grayson proposes
    </PanelLabel>

    {FIX_STEPS.map((step, i) => (
      <StepRow key={step.title} x={754} y={404 + i * 96} w={440} n={i + 1} title={step.title} sub={step.sub} />
    ))}

    <FlowNode
      x={1284}
      y={466}
      w={240}
      h={180}
      title="Git validates the exact diff"
      lines={['It has to apply cleanly']}
      size={26}
    />

    <BulletCard
      x={1570}
      y={424}
      w={320}
      title="Proposed fix"
      lines={['The proposed change', 'Why it should work', 'The code diff', 'A scorer that proves it']}
    />

    <Takeaway>
      You don&apos;t get advice.{' '}
      <span style={{ color: 'var(--osd-accent)' }}>You get a diff and a scorer that proves it.</span>
    </Takeaway>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Validate → approve. Both pages are the same machine, so they share one layout.

type DecisionSpec = {
  input: { title: string; lines?: string[] };
  steps: { title: string; lines: string[] }[];
  question: string;
  accept: { label: string; title: string; lines: string[] };
  reject: { label: string; title: string; lines: string[] };
  loopLabel: string;
};

const DecisionFlow = ({ input, steps, question, accept, reject, loopLabel }: DecisionSpec) => (
  <>
    <Backdrop cx={960} cy={560} rx={860} ry={410} />

    <svg width={1920} height={1080} viewBox="0 0 1920 1080" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <FlowArrow d="M 334 556 H 372" head={[382, 556]} />
      <FlowArrow d="M 678 556 H 716" head={[726, 556]} />
      <FlowArrow d="M 1022 556 H 1074" head={[1084, 556]} />

      <Diamond cx={1196} cy={556} rx={112} ry={120} />

      <FlowArrow
        d={hvh(1308, 556, 1416, 440, 1362)}
        head={[1430, 440]}
        color={`${palette.accent}a6`}
      />
      <FlowArrow d={vh(1196, 676, 1416, 770)} head={[1430, 770]} color={`${palette.orange}a6`} />

      <FlowArrow
        d={railBack(1630, 840, 535, 662, 912)}
        head={[535, 648]}
        dir="u"
        color={`${palette.orange}80`}
        dashed
      />
    </svg>

    <FlowNode x={120} y={486} w={214} h={140} title={input.title} lines={input.lines} tone="accent" size={28} />
    {steps.map((step, i) => (
      <FlowNode
        key={step.title}
        x={392 + i * 344}
        y={466}
        w={286}
        h={180}
        title={step.title}
        lines={step.lines}
        size={28}
      />
    ))}

    <div
      style={{
        position: 'absolute',
        left: 1096,
        top: 522,
        width: 200,
        textAlign: 'center',
        fontSize: 27,
        fontWeight: 600,
        lineHeight: 1.16,
      }}
    >
      {question}
    </div>

    <EdgeChip x={1362} y={498} color={palette.accent}>
      {accept.label}
    </EdgeChip>
    <EdgeChip x={1196} y={716} color={palette.orange}>
      {reject.label}
    </EdgeChip>
    <EdgeChip x={1082} y={912} color={palette.orange}>
      {loopLabel}
    </EdgeChip>

    <BulletCard x={1440} y={308} w={380} title={accept.title} lines={accept.lines} />
    <FlowNode
      x={1440}
      y={700}
      w={380}
      h={140}
      title={reject.title}
      lines={reject.lines}
      tone="dim"
      size={28}
      hue={palette.orange}
    />
  </>
);

const Validation: Page = () => (
  <div style={fill}>
    <PageNumber />
    <PageHead title="Then it has to prove it" sub="The revised agent runs the same dataset, against the same scorer." />

    <DecisionFlow
      input={{ title: 'Proposed fix' }}
      steps={[
        { title: 'Run the revised agent', lines: ['Same dataset.', 'Same scorer.'] },
        { title: 'Compare against baseline', lines: ['The experiment vs.', 'the agent you have today'] },
      ]}
      question="Did behavior improve?"
      accept={{
        label: 'Yes',
        title: 'Validated proposed fix',
        lines: ['The proposed change', 'Why it should work', 'The code diff', 'The experiment results'],
      }}
      reject={{ label: 'No', title: 'Return for revision', lines: ['With the evaluations it failed'] }}
      loopLabel="Revise and re-run"
    />

    <Takeaway>
      A proposal that doesn&apos;t beat the baseline{' '}
      <span style={{ color: 'var(--osd-accent)' }}>never reaches you.</span>
    </Takeaway>
  </div>
);

const Deployment: Page = () => (
  <div style={fill}>
    <PageNumber />
    <PageHead title="You approve. It opens a PR." sub="One more pass over everything else you already care about." />

    <DecisionFlow
      input={{ title: 'Approved fix', lines: ['You said yes'] }}
      steps={[
        { title: 'Run the golden dataset', lines: ['Not just the failing cases.', 'All of them.'] },
        { title: 'Score the whole suite', lines: ['The scorers you', 'already trust'] },
      ]}
      question="Any regressions?"
      accept={{
        label: 'None',
        title: 'GitHub pull request',
        lines: ['The exact reviewed diff', 'The issue and its evidence', 'The validation results'],
      }}
      reject={{ label: 'Found', title: 'Return for revision', lines: ['With the evaluations it broke'] }}
      loopLabel="Fix and re-score"
    />

    <Takeaway>
      The loop ends where your workflow already starts:{' '}
      <span style={{ color: 'var(--osd-accent)' }}>a pull request.</span>
    </Takeaway>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Proof — the deck is called Agent Learning, so a number has to move. The bug
// being fixed is the 19% of traces on the "no output delivered" path (1,970 of
// 10,368), so these scores are measured against that same week.

const PROOF_ROWS = [
  { label: 'Tool output actually returned', before: 71, after: 96 },
  { label: 'Report delivery verified', before: 64, after: 91 },
  { label: 'Task completed end to end', before: 82, after: 94 },
  { label: 'Everything else you already scored', before: 98, after: 98, held: true },
];

const PF = { x0: 720, x1: 1560, vMin: 60, vMax: 100, top: 336, rowH: 92, gap: 40 };
const pfX = (v: number) => PF.x0 + ((v - PF.vMin) / (PF.vMax - PF.vMin)) * (PF.x1 - PF.x0);
const pfY = (i: number) => PF.top + i * (PF.rowH + PF.gap) + PF.rowH / 2;

const Proof: Page = () => (
  <div style={fill}>
    <PageNumber />
    <PageHead title="And the agent got better." sub="412 golden cases, the same scorers — before and after the merged diff." />
    <IllustrativeTag />

    <Backdrop cx={1080} cy={580} rx={820} ry={360} />

    <svg width={1920} height={1080} viewBox="0 0 1920 1080" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      {[60, 70, 80, 90, 100].map((tick) => (
        <line
          key={tick}
          x1={pfX(tick)}
          x2={pfX(tick)}
          y1={PF.top - 16}
          y2={pfY(PROOF_ROWS.length - 1) + 58}
          stroke="#1a1a26"
          strokeWidth={1}
        />
      ))}

      {PROOF_ROWS.map((row, i) => (
        <g key={row.label}>
          <line
            x1={PF.x0}
            x2={PF.x1}
            y1={pfY(i)}
            y2={pfY(i)}
            stroke="#20202c"
            strokeWidth={2}
            strokeLinecap="round"
          />
          {!row.held && (
            <line
              x1={pfX(row.before)}
              x2={pfX(row.after)}
              y1={pfY(i)}
              y2={pfY(i)}
              stroke={palette.accent}
              strokeWidth={7}
              strokeLinecap="round"
              opacity={0.5}
            />
          )}
          {!row.held && <circle cx={pfX(row.before)} cy={pfY(i)} r={11} fill="#2c2c3a" stroke={palette.dim} strokeWidth={2} />}
          <circle
            cx={pfX(row.after)}
            cy={pfY(i)}
            r={13}
            fill={row.held ? palette.surfaceHi : palette.accent}
            stroke={row.held ? palette.muted : 'none'}
            strokeWidth={2}
          />
        </g>
      ))}
    </svg>

    {[60, 70, 80, 90, 100].map((tick) => (
      <div
        key={tick}
        style={{
          position: 'absolute',
          left: pfX(tick) - 40,
          top: PF.top - 66,
          width: 80,
          textAlign: 'center',
          fontFamily: font.mono,
          fontSize: 22,
          color: palette.muted,
        }}
      >
        {tick}%
      </div>
    ))}

    {PROOF_ROWS.map((row, i) => (
      <div key={row.label}>
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: pfY(i) - 24,
            width: 520,
            textAlign: 'right',
            fontSize: 32,
            lineHeight: 1.2,
            color: row.held ? palette.textSoft : 'var(--osd-text)',
          }}
        >
          {row.label}
        </div>

        {!row.held && (
          <div
            style={{
              position: 'absolute',
              left: pfX(row.before) - 50,
              top: pfY(i) - 68,
              width: 100,
              textAlign: 'center',
              fontFamily: font.mono,
              fontSize: 26,
              color: palette.muted,
            }}
          >
            {row.before}
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            left: pfX(row.after) - 50,
            top: pfY(i) - 70,
            width: 100,
            textAlign: 'center',
            fontFamily: font.mono,
            fontSize: 30,
            fontWeight: 700,
            color: row.held ? palette.textSoft : 'var(--osd-accent)',
          }}
        >
          {row.after}
        </div>

        <div
          style={{
            position: 'absolute',
            left: pfX(row.after) + 34,
            top: pfY(i) - 20,
            fontFamily: font.mono,
            fontSize: 26,
            color: row.held ? palette.muted : palette.green,
            whiteSpace: 'nowrap',
          }}
        >
          {row.held ? 'held' : `+${row.after - row.before}`}
        </div>
      </div>
    ))}

    <div
      style={{
        position: 'absolute',
        top: 872,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 34,
        color: palette.textSoft,
      }}
    >
      <span style={{ color: 'var(--osd-text)' }}>&ldquo;Tool invoked — no output delivered&rdquo;</span> went from{' '}
      <span style={{ color: 'var(--osd-text)' }}>1,970 traces a week</span> to{' '}
      <span style={{ color: 'var(--osd-text)' }}>38</span>.
    </div>

    <Takeaway>
      You didn&apos;t get a report about your agent.{' '}
      <span style={{ color: 'var(--osd-accent)' }}>You got a better one.</span>
    </Takeaway>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Closer — the line from the roadmap slide, bent into a circle.

const LOOP_STAGES = ['Traces', 'Signals', 'Themes', 'Candidate', 'Investigation', 'Pull request'];
const LOOP = { cx: 960, cy: 575, r: 320, w: 200, h: 92 };
const loopAngle = (i: number) => ((-90 + i * 60) * Math.PI) / 180;
const loopPos = (a: number) => [LOOP.cx + LOOP.r * Math.cos(a), LOOP.cy + LOOP.r * Math.sin(a)];

// A triangle sitting on the ring, pointing the way the loop travels.
const ringArrow = (a: number) => {
  const [x, y] = loopPos(a);
  const dx = -Math.sin(a);
  const dy = Math.cos(a);
  const nx = Math.cos(a);
  const ny = Math.sin(a);
  const L = 16;
  const W = 8.5;
  return [
    `M ${x + dx * L} ${y + dy * L}`,
    `L ${x - dx * 2 + nx * W} ${y - dy * 2 + ny * W}`,
    `L ${x - dx * 2 - nx * W} ${y - dy * 2 - ny * W}`,
    'Z',
  ].join(' ');
};

const Closer: Page = () => (
  <div style={fill}>
    <PageNumber />
    <PageHead title="The loop closes." sub="Every fix changes the agent, the agent changes the traces, and the traces start it again." />

    <Backdrop cx={LOOP.cx} cy={LOOP.cy} rx={560} ry={440} />

    <svg width={1920} height={1080} viewBox="0 0 1920 1080" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <circle cx={LOOP.cx} cy={LOOP.cy} r={LOOP.r} fill="none" stroke={`${palette.accent}14`} strokeWidth={20} />
      <circle cx={LOOP.cx} cy={LOOP.cy} r={LOOP.r} fill="none" stroke={`${palette.accent}7a`} strokeWidth={3} />
      {LOOP_STAGES.map((stage, i) => (
        <path key={stage} d={ringArrow(loopAngle(i) + Math.PI / 6)} fill={palette.accent} />
      ))}
    </svg>

    {LOOP_STAGES.map((stage, i) => {
      const [x, y] = loopPos(loopAngle(i));
      return (
        <FlowNode
          key={stage}
          x={x - LOOP.w / 2}
          y={y - LOOP.h / 2}
          w={LOOP.w}
          h={LOOP.h}
          title={stage}
          size={28}
        />
      );
    })}

    <div
      style={{
        position: 'absolute',
        left: LOOP.cx - 170,
        top: LOOP.cy - 66,
        width: 340,
        textAlign: 'center',
        fontFamily: 'var(--osd-font-display)',
        fontSize: 58,
        fontWeight: 800,
        lineHeight: 1.06,
        letterSpacing: '-0.03em',
      }}
    >
      Agent
      <br />
      Learning
    </div>

    <Takeaway>
      Your agents already produce the data they need to get better.{' '}
      <span style={{ color: 'var(--osd-accent)' }}>This is how you close the loop.</span>
    </Takeaway>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Real traffic page — named clusters, goal → outcome → behavior

const RT = {
  colX: [560, 1060, 1560],
  nodeW: 20,
  top: 288,
  height: 600,
  gap: 14,
  scale: 0.53,
};

const RT_GOALS = [
  { label: 'Report generation requested', color: '#8b7ff5' },
  { label: 'Simple conversational success', color: '#4ade80' },
  { label: 'Tool execution verification needed', color: '#f0883e' },
  { label: 'Verify report delivery & content', color: '#7aa2f7' },
  { label: 'Data processing completion', color: '#e8c04a' },
  { label: 'Other', color: '#6f6f80' },
];

const RT_OUTCOMES = [
  'Report generation succeeded',
  'Successful simple text response',
  'Tool invoked — no output delivered',
  'Tool invocations succeeded',
  'Other',
];

const RT_BEHAVIORS = [
  'Incomplete report generation',
  'Simple text generation',
  'Tool output verification needed',
  'Successful task completion',
  'Tool invoked, task completed',
  'Other',
];

// goal → outcome
const RT_GO: number[][] = [
  [150, 0, 60, 20, 10],
  [0, 250, 0, 20, 30],
  [0, 0, 90, 70, 20],
  [70, 0, 40, 20, 0],
  [20, 0, 0, 55, 15],
  [0, 20, 0, 10, 30],
];

// outcome → behavior
const RT_OB: number[][] = [
  [60, 0, 0, 150, 30, 0],
  [0, 230, 0, 30, 0, 10],
  [50, 0, 110, 0, 0, 30],
  [0, 0, 20, 55, 120, 0],
  [0, 25, 0, 20, 0, 60],
];

const rtStack = (totals: number[]) => {
  const h = totals.reduce((a, b) => a + b, 0) * RT.scale + (totals.length - 1) * RT.gap;
  let y = RT.top + (RT.height - h) / 2;
  return totals.map((t) => {
    const y0 = y;
    y += t * RT.scale + RT.gap;
    return { y0, y1: y0 + t * RT.scale };
  });
};

const RT_GOAL_TOT = RT_GO.map((row) => row.reduce((a, b) => a + b, 0));
const RT_OUT_TOT = RT_OUTCOMES.map((_, o) => RT_GO.reduce((a, row) => a + row[o], 0));
const RT_BEH_TOT = RT_BEHAVIORS.map((_, b) => RT_OB.reduce((a, row) => a + row[b], 0));

const RT_NODES = [rtStack(RT_GOAL_TOT), rtStack(RT_OUT_TOT), rtStack(RT_BEH_TOT)];

type RtRibbon = { x0: number; y0: number; x1: number; y1: number; w: number; color: string };

const buildRtRibbons = (): RtRibbon[] => {
  const ribbons: RtRibbon[] = [];

  // hop 1 — goal → outcome, ordered so bands don't needlessly cross
  const srcCursor = RT_NODES[0].map((n) => n.y0);
  const tgtCursor = RT_NODES[1].map((n) => n.y0);
  RT_GO.forEach((row, g) =>
    row.forEach((v, o) => {
      if (!v) return;
      const w = v * RT.scale;
      ribbons.push({
        x0: RT.colX[0] + RT.nodeW,
        y0: srcCursor[g],
        x1: RT.colX[1],
        y1: tgtCursor[o],
        w,
        color: RT_GOALS[g].color,
      });
      srcCursor[g] += w;
      tgtCursor[o] += w;
    }),
  );

  // hop 2 — outcome → behavior, keeping each trace's goal colour
  const outCursor = RT_NODES[1].map((n) => n.y0);
  const behCursor = RT_NODES[2].map((n) => n.y0);
  RT_OB.forEach((row, o) =>
    row.forEach((v, b) => {
      if (!v) return;
      RT_GO.forEach((goalRow, g) => {
        const share = goalRow[o] / RT_OUT_TOT[o];
        if (!share) return;
        const w = v * share * RT.scale;
        ribbons.push({
          x0: RT.colX[1] + RT.nodeW,
          y0: outCursor[o],
          x1: RT.colX[2],
          y1: behCursor[b],
          w,
          color: RT_GOALS[g].color,
        });
        outCursor[o] += w;
        behCursor[b] += w;
      });
    }),
  );

  return ribbons;
};

const RT_RIBBONS = buildRtRibbons();

const RtLabel = ({
  y0,
  y1,
  align,
  x,
  width,
  color,
  children,
}: {
  y0: number;
  y1: number;
  align: 'right' | 'left';
  x: number;
  width: number;
  color?: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: align === 'right' ? x - width : x,
      top: (y0 + y1) / 2 - 30,
      width,
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      textAlign: align,
      fontSize: 22,
      lineHeight: 1.15,
      color: color ?? palette.textSoft,
    }}
  >
    <span
      style={{
        background: 'rgba(10,10,15,0.86)',
        padding: '3px 8px',
        borderRadius: 6,
      }}
    >
      {children}
    </span>
  </div>
);

const RealTraffic: Page = () => (
  <div style={fill}>
    <PageNumber />
    <IllustrativeTag />

    <h2
      style={{
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        margin: 0,
        textAlign: 'center',
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: '-0.025em',
      }}
    >
      What it finds
    </h2>
    <div
      style={{
        position: 'absolute',
        top: 132,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 34,
        color: palette.textSoft,
      }}
    >
      Nobody wrote these categories down. They came out of 10,368 traces in one week.
    </div>

    <div
      style={{
        position: 'absolute',
        top: 226,
        left: 0,
        right: 0,
        display: 'flex',
        fontFamily: font.mono,
        fontSize: 22,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: palette.muted,
      }}
    >
      {['Goal', 'Outcome', 'Behavior'].map((label, i) => (
        <span key={label} style={{ position: 'absolute', left: RT.colX[i] - 130, width: 280, textAlign: 'center' }}>
          {label}
        </span>
      ))}
    </div>

    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      aria-hidden
      style={{ position: 'absolute', inset: 0 }}
    >
      <g style={{ mixBlendMode: 'screen' }}>
        {RT_RIBBONS.map((r, i) => (
          <path key={i} d={ribbonPath(r.x0, r.y0, r.x1, r.y1, r.w)} fill={r.color} opacity={0.34} />
        ))}
      </g>

      {RT_NODES.map((col, c) =>
        col.map((node, i) => (
          <rect
            key={`${c}-${i}`}
            x={RT.colX[c]}
            y={node.y0}
            width={RT.nodeW}
            height={node.y1 - node.y0}
            rx={4}
            fill={c === 0 ? RT_GOALS[i].color : palette.textSoft}
            opacity={c === 0 ? 0.92 : 0.5}
          />
        )),
      )}
    </svg>

    {RT_NODES[0].map((node, i) => (
      <RtLabel key={i} y0={node.y0} y1={node.y1} align="right" x={RT.colX[0] - 20} width={420} color={RT_GOALS[i].color}>
        {RT_GOALS[i].label}
      </RtLabel>
    ))}

    {RT_NODES[1].map((node, i) => (
      <RtLabel key={i} y0={node.y0} y1={node.y1} align="left" x={RT.colX[1] + RT.nodeW + 12} width={330}>
        {RT_OUTCOMES[i]}
      </RtLabel>
    ))}

    {RT_NODES[2].map((node, i) => (
      <RtLabel key={i} y0={node.y0} y1={node.y1} align="left" x={RT.colX[2] + RT.nodeW + 12} width={300}>
        {RT_BEHAVIORS[i]}
      </RtLabel>
    ))}

    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 64,
        textAlign: 'center',
        fontSize: 34,
        color: palette.textSoft,
      }}
    >
      Ribbon thickness is trace volume, coloured by goal.{' '}
      <span style={{ color: 'var(--osd-accent)' }}>
        &ldquo;Tool invoked — no output delivered&rdquo; is a bug you can now see.
      </span>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Sankey page — individual traces aggregate into shared journeys

const SK_COLS = [
  { label: 'Goal', color: palette.green },
  { label: 'Outcome', color: '#e8b339' },
  { label: 'Behavior', color: '#8b7ff5' },
  { label: 'Sentiment', color: palette.blue },
];

// Flow matrices between adjacent columns. Rows = source node, cols = target node.
// Column sums of matrix n equal row sums of matrix n+1, so flow is conserved.
const SK_FLOWS = [
  [
    [0.24, 0.06, 0.04],
    [0.15, 0.06, 0.05],
    [0.12, 0.06, 0.04],
    [0.07, 0.04, 0.07],
  ],
  [
    [0.32, 0.2, 0.05, 0.01],
    [0.06, 0.09, 0.05, 0.02],
    [0.02, 0.05, 0.06, 0.07],
  ],
  [
    [0.28, 0.1, 0.02],
    [0.14, 0.14, 0.06],
    [0.04, 0.07, 0.05],
    [0.0, 0.03, 0.07],
  ],
];

const SK = {
  left: 104,
  stageW: 306,
  gap: 44,
  nodeW: 14,
  nodeX: [6, 96, 186, 276],
  top: 352,
  h: 452,
  pad: 14,
  scale: 410,
};

const stageX = (i: number) => SK.left + i * (SK.stageW + SK.gap);

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

type SkNode = { value: number; y0: number; y1: number };
type SkRibbon = { pair: number; v: number; ys: number; yt: number; w: number };

const buildSankey = (geo: { top: number; h: number; scale: number; pad: number }) => {
  const values: number[][] = [
    SK_FLOWS[0].map(sum),
    SK_FLOWS[1].map(sum),
    SK_FLOWS[2].map(sum),
    SK_FLOWS[2][0].map((_, j) => sum(SK_FLOWS[2].map((row) => row[j]))),
  ];

  const nodes: SkNode[][] = values.map((col) => {
    const stack = geo.scale + (col.length - 1) * geo.pad;
    let y = geo.top + (geo.h - stack) / 2;
    return col.map((value) => {
      const y0 = y;
      const y1 = y0 + value * geo.scale;
      y = y1 + geo.pad;
      return { value, y0, y1 };
    });
  });

  const ribbons: SkRibbon[][] = SK_FLOWS.map((matrix, pair) => {
    const srcCursor = nodes[pair].map((n) => n.y0);
    const tgtCursor = nodes[pair + 1].map((n) => n.y0);
    const out: SkRibbon[] = [];

    matrix.forEach((row, i) =>
      row.forEach((v, j) => {
        if (v <= 0) return;
        const w = v * geo.scale;
        out.push({ pair, v, ys: srcCursor[i], yt: tgtCursor[j], w });
        srcCursor[i] += w;
        tgtCursor[j] += w;
      }),
    );

    return out;
  });

  return { nodes, ribbons };
};

const { nodes: SK_NODES, ribbons: SK_RIBBONS } = buildSankey(SK);

// Largest-remainder apportionment: exactly `n` traces split across the ribbons
// of one column pair, so every stage keeps flow conserved.
const apportion = (n: number, weights: number[]) => {
  const raw = weights.map((w) => n * w);
  const counts = raw.map(Math.floor);
  let left = n - sum(counts);
  raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac)
    .forEach(({ i }) => {
      if (left > 0) {
        counts[i] += 1;
        left -= 1;
      }
    });
  return counts;
};

const SK_STAGES = [
  { label: 'One trace', n: 1, stroke: 3, opacity: 1 },
  { label: 'Five traces', n: 5, stroke: 2.2, opacity: 0.92 },
  { label: 'Hundreds of traces', n: 44, stroke: 1.4, opacity: 0.55 },
  { label: 'Thousands of traces', n: 220, stroke: 0.8, opacity: 0.3 },
  { label: 'All traces', n: 0, stroke: 0, opacity: 1 },
];

type SkLine = { pair: number; ys: number; yt: number };

// The lone trace weaves through mid-sized nodes so it reads as a journey, not a rail.
const SK_SOLO = [1, 1, 1, 1];

const soloLines: SkLine[] = SK_FLOWS.map((matrix, pair) => {
  const i = SK_SOLO[pair];
  const j = SK_SOLO[pair + 1];
  const r = SK_RIBBONS[pair][
    matrix.slice(0, i).reduce((n, row) => n + row.filter((v) => v > 0).length, 0) +
      matrix[i].slice(0, j).filter((v) => v > 0).length
  ];
  return { pair, ys: r.ys + r.w / 2, yt: r.yt + r.w / 2 };
});

const SK_LINES: SkLine[][] = SK_STAGES.map((stage) =>
  stage.n === 1
    ? soloLines
    : stage.n === 0
    ? []
    : SK_RIBBONS.flatMap((group, pair) => {
        const counts = apportion(
          stage.n,
          group.map((r) => r.v),
        );
        return group.flatMap((r, k) => {
          const n = counts[k];
          return Array.from({ length: n }, (_, m) => ({
            pair,
            ys: r.ys + (r.w * (m + 0.5)) / n,
            yt: r.yt + (r.w * (m + 0.5)) / n,
          }));
        });
      }),
);

const linkX = (pair: number) => ({
  x0: SK.nodeX[pair] + SK.nodeW,
  x1: SK.nodeX[pair + 1],
});

const curve = (x0: number, y0: number, x1: number, y1: number) => {
  const d = (x1 - x0) * 0.46;
  return `M ${x0} ${y0} C ${x0 + d} ${y0}, ${x1 - d} ${y1}, ${x1} ${y1}`;
};

const ribbonPath = (x0: number, y0: number, x1: number, y1: number, w: number) => {
  const d = (x1 - x0) * 0.5;
  return [
    `M ${x0} ${y0}`,
    `C ${x0 + d} ${y0}, ${x1 - d} ${y1}, ${x1} ${y1}`,
    `L ${x1} ${y1 + w}`,
    `C ${x1 - d} ${y1 + w}, ${x0 + d} ${y0 + w}, ${x0} ${y0 + w}`,
    'Z',
  ].join(' ');
};

const SankeyArrow = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, ${SK.top + SK.h / 2})`} opacity={0.5}>
    <path d="M -13 0 H 11" stroke={palette.textSoft} strokeWidth={2} />
    <path d="M 4 -7 L 11 0 L 4 7" stroke={palette.textSoft} strokeWidth={2} fill="none" />
  </g>
);

const StageNodes = ({ labelled = false }: { labelled?: boolean }) => (
  <g>
    {SK_NODES.map((col, c) =>
      col.map((node, i) => (
        <g key={`${c}-${i}`}>
          <rect
            x={SK.nodeX[c]}
            y={node.y0}
            width={SK.nodeW}
            height={node.y1 - node.y0}
            rx={4}
            fill={SK_COLS[c].color}
            opacity={0.85}
          />
          {labelled && node.y1 - node.y0 > 30 && (
            <text
              x={SK.nodeX[c] + SK.nodeW / 2}
              y={(node.y0 + node.y1) / 2}
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(-90, ${SK.nodeX[c] + SK.nodeW / 2}, ${(node.y0 + node.y1) / 2})`}
              fill="var(--osd-bg)"
              fontSize={11}
              fontWeight={700}
              fontFamily={font.mono}
              letterSpacing="0.06em"
            >
              {`${SK_COLS[c].label.slice(0, 4).toUpperCase()} ${i + 1}`}
            </text>
          )}
        </g>
      )),
    )}
  </g>
);

const Sankey: Page = () => (
  <div style={fill}>
    <PageNumber />

    <h2
      style={{
        position: 'absolute',
        top: 52,
        left: 0,
        right: 0,
        margin: 0,
        textAlign: 'center',
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: '-0.025em',
      }}
    >
      Every trace connects across signals.
    </h2>
    <div
      style={{
        position: 'absolute',
        top: 140,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 40,
        color: palette.textSoft,
      }}
    >
      Each column is a signal. Each block is a theme inside it.
    </div>

    <div
      style={{
        position: 'absolute',
        top: 224,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 46,
        fontSize: 26,
        color: palette.textSoft,
      }}
    >
      {SK_COLS.map((col) => (
        <span key={col.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: col.color,
            }}
          />
          {col.label}
        </span>
      ))}
    </div>

    {SK_STAGES.map((stage, s) => (
      <div
        key={stage.label}
        style={{
          position: 'absolute',
          top: 292,
          left: stageX(s),
          width: SK.stageW,
          textAlign: 'center',
          fontSize: 28,
          color: 'var(--osd-accent)',
        }}
      >
        {stage.label}
      </div>
    ))}

    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      aria-hidden
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        {[0, 1, 2].map((pair) => (
          <linearGradient key={pair} id={`sk-${pair}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={SK_COLS[pair].color} />
            <stop offset="100%" stopColor={SK_COLS[pair + 1].color} />
          </linearGradient>
        ))}
        <filter id="sk-glow" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {SK_STAGES.map((stage, s) => (
        <g key={stage.label} transform={`translate(${stageX(s)}, 0)`}>
          {stage.n === 0 ? (
            <g style={{ mixBlendMode: 'screen' }} opacity={0.74}>
              {SK_RIBBONS.map((group, pair) =>
                group.map((r, k) => {
                  const { x0, x1 } = linkX(pair);
                  return (
                    <path
                      key={`${pair}-${k}`}
                      d={ribbonPath(x0, r.ys, x1, r.yt, r.w)}
                      fill={`url(#sk-${pair})`}
                    />
                  );
                }),
              )}
            </g>
          ) : (
            <g style={{ mixBlendMode: 'screen' }}>
              {SK_LINES[s].map((line, i) => {
                const { x0, x1 } = linkX(line.pair);
                return (
                  <path
                    key={i}
                    d={curve(x0, line.ys, x1, line.yt)}
                    fill="none"
                    stroke={s === 0 ? '#ffffff' : `url(#sk-${line.pair})`}
                    strokeWidth={stage.stroke}
                    strokeLinecap="round"
                    opacity={stage.opacity}
                    filter={s === 0 ? 'url(#sk-glow)' : undefined}
                  />
                );
              })}
            </g>
          )}

          <StageNodes labelled={stage.n === 0} />
        </g>
      ))}

      {[0, 1, 2, 3].map((i) => (
        <SankeyArrow key={i} x={stageX(i) + SK.stageW + SK.gap / 2 - 8} />
      ))}
    </svg>

    <div
      style={{
        position: 'absolute',
        top: 892,
        left: SK.left,
        width: SK.stageW * 3 + SK.gap * 2,
        textAlign: 'center',
        fontSize: 32,
        color: palette.textSoft,
      }}
    >
      Each line is one trace threading through its signals.
    </div>
    <div
      style={{
        position: 'absolute',
        top: 892,
        left: stageX(3),
        width: SK.stageW * 2 + SK.gap,
        textAlign: 'center',
        fontSize: 32,
        color: palette.textSoft,
      }}
    >
      At scale, shared paths thicken into one map.
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Understanding page — the questions the semantic model can now answer

const UND = {
  nodeX: [886, 1186, 1486, 1786],
  nodeW: 22,
  top: 268,
  h: 600,
  scale: 540,
  pad: 20,
};

const { nodes: UND_NODES, ribbons: UND_RIBBONS } = buildSankey(UND);

const questionIcons = {
  target: (
    <>
      <circle cx="18" cy="18" r="13" />
      <circle cx="18" cy="18" r="6.5" />
      <circle cx="18" cy="18" r="1.8" fill="currentColor" stroke="none" />
    </>
  ),
  warning: (
    <>
      <path d="M18 5.5 L32 29.5 H4 Z" />
      <path d="M18 14 V21" />
      <circle cx="18" cy="25.5" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  behavior: (
    <>
      <path d="M6 27 L13 18 L19 22.5 L30 8.5" />
      <path d="M25.5 6 L30.5 8 L28.5 13" />
      <circle cx="10" cy="9" r="2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="6.5" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  trend: (
    <>
      <path d="M5 26 L14 16.5 L20 22 L31.5 9.5" />
      <path d="M24 9.5 H31.5 V17" />
    </>
  ),
  more: (
    <>
      <circle cx="9" cy="18" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="18" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="27" cy="18" r="2.2" fill="currentColor" stroke="none" />
    </>
  ),
};

const QUESTIONS = [
  { kind: 'target' as const, color: palette.green, text: 'Which user goals succeed?' },
  { kind: 'warning' as const, color: '#e8b339', text: 'Which goals create frustration?' },
  { kind: 'behavior' as const, color: '#8b7ff5', text: 'Which behaviors lead to successful outcomes?' },
  { kind: 'trend' as const, color: palette.blue, text: 'What changed this week?' },
  { kind: 'more' as const, color: palette.textSoft, text: 'Which workflows are becoming more common?' },
];

const Q = { x: 120, w: 690, top: 268, h: 108, gap: 15 };

const QuestionRow = ({
  kind,
  color,
  text,
  top,
}: (typeof QUESTIONS)[number] & { top: number }) => (
  <div
    style={{
      position: 'absolute',
      left: Q.x,
      top,
      width: Q.w,
      height: Q.h,
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      padding: '0 30px',
      boxSizing: 'border-box',
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderRadius: 16,
    }}
  >
    <div
      style={{
        width: 62,
        height: 62,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${color}14`,
        border: `1.5px solid ${color}59`,
      }}
    >
      <svg
        width={34}
        height={34}
        viewBox="0 0 36 36"
        aria-hidden
        style={{ color }}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {questionIcons[kind]}
      </svg>
    </div>
    <div style={{ fontSize: 34, lineHeight: 1.2 }}>{text}</div>
  </div>
);

const Understanding: Page = () => (
  <div style={fill}>
    <PageNumber />

    <h2
      style={{
        position: 'absolute',
        top: 54,
        left: 226,
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: '-0.025em',
      }}
    >
      Now you can answer the hard questions.
    </h2>
    <div
      style={{
        position: 'absolute',
        top: 142,
        left: 226,
        fontSize: 40,
        color: palette.textSoft,
      }}
    >
      This is where every other tool stops.
    </div>

    {QUESTIONS.map((q, i) => (
      <QuestionRow key={q.text} {...q} top={Q.top + i * (Q.h + Q.gap)} />
    ))}

    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      aria-hidden
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        {[0, 1, 2].map((pair) => (
          <linearGradient key={pair} id={`und-${pair}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={SK_COLS[pair].color} />
            <stop offset="100%" stopColor={SK_COLS[pair + 1].color} />
          </linearGradient>
        ))}
      </defs>

      {SK_COLS.map((col, c) => (
        <rect
          key={col.label}
          x={UND.nodeX[c] - 7}
          y={UND.top}
          width={UND.nodeW + 14}
          height={UND.h}
          rx={10}
          fill={`${col.color}12`}
        />
      ))}

      <g opacity={0.85}>
        {UND_RIBBONS.map((group, pair) =>
          group.map((r, k) => {
            const inset = Math.min(3, r.w / 4);
            return (
              <path
                key={`${pair}-${k}`}
                d={ribbonPath(
                  UND.nodeX[pair] + UND.nodeW,
                  r.ys + inset,
                  UND.nodeX[pair + 1],
                  r.yt + inset,
                  r.w - inset * 2,
                )}
                fill={`url(#und-${pair})`}
                opacity={0.6}
              />
            );
          }),
        )}
      </g>

      {UND_NODES.map((col, c) =>
        col.map((node, i) => (
          <rect
            key={`${c}-${i}`}
            x={UND.nodeX[c]}
            y={node.y0}
            width={UND.nodeW}
            height={node.y1 - node.y0}
            rx={6}
            fill={SK_COLS[c].color}
            opacity={0.88}
          />
        )),
      )}
    </svg>

    {SK_COLS.map((col, c) => (
      <div
        key={col.label}
        style={{
          position: 'absolute',
          top: UND.top - 62,
          left: UND.nodeX[c] + UND.nodeW / 2 - 110,
          width: 220,
          textAlign: 'center',
          fontSize: 30,
          color: col.color,
        }}
      >
        {col.label}
      </div>
    ))}

    <div
      style={{
        position: 'absolute',
        top: 934,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 46,
        fontWeight: 600,
      }}
    >
      A semantic model of how your agent is being used —{' '}
      <span style={{ color: 'var(--osd-accent)' }}>and answers still aren&apos;t fixes.</span>
    </div>
  </div>
);


export const transition: SlideTransition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-4px)' },
    ],
  },
  enter: {
    duration: 200,
    delay: 80,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: 'Agent Learning',
  createdAt: '2026-08-10T21:29:41.175Z',
};

// ────────────────────────────────────────────────────────────────────────────
// Thank you — bookends the title slide: same avatar, same handles, same
// left-aligned hero. The ring from the closer is left behind it, dimmed.

const ThankYou: Page = () => (
  <div style={fill}>
    <PageNumber />
    <Backdrop cx={1440} cy={520} rx={520} ry={430} />

    <svg width={1920} height={1080} viewBox="0 0 1920 1080" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <circle cx={1440} cy={520} r={286} stroke="#1e1e2b" strokeWidth={1.5} fill="none" />
      <circle cx={1440} cy={520} r={228} stroke={`${palette.accent}24`} strokeWidth={1.5} strokeDasharray="4 14" fill="none" />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3 - Math.PI / 2;
        return (
          <circle
            key={i}
            cx={1440 + 286 * Math.cos(a)}
            cy={520 + 286 * Math.sin(a)}
            r={7}
            fill={palette.accent}
            opacity={0.55}
          />
        );
      })}
    </svg>

    <h1
      style={{
        position: 'absolute',
        left: 140,
        top: 388,
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 176,
        fontWeight: 800,
        lineHeight: 0.92,
        letterSpacing: '-0.04em',
      }}
    >
      Thank you
    </h1>

    <div style={{ position: 'absolute', left: 140, top: 634, display: 'flex', alignItems: 'center', gap: 32 }}>
      <div
        style={{
          width: 108,
          height: 108,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          border: '2px solid var(--osd-accent)',
          boxShadow: '0 0 0 6px rgba(139, 127, 245, 0.12), 0 14px 36px rgba(0, 0, 0, 0.45)',
        }}
      >
        <img src={abhiAvatar} alt="Abhi Aiyer" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div>
        <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: '-0.02em' }}>Abhi Aiyer</div>
        <div style={{ fontSize: 30, color: palette.textSoft, marginTop: 4 }}>
          CTO &amp; Co-Founder, <span style={{ color: 'var(--osd-accent)' }}>Mastra</span>
        </div>
      </div>
    </div>

    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        bottom: 92,
        paddingTop: 34,
        borderTop: `1px solid ${palette.border}`,
        display: 'flex',
        gap: 56,
        fontFamily: font.mono,
        fontSize: 24,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: palette.muted,
      }}
    >
      <Handle label="X" value="@abhiaiyer" />
      <Handle label="Web" value="mastra.ai" />
      <Handle label="GH" value="github.com/mastra-ai" />
    </div>
  </div>
);

export default [
  Title,
  AboutMe,
  TraceStory,
  Scale,
  Struggle,
  Roadmap,
  TraceIntelligence,
  Signals,
  Pipeline,
  Themes,
  ThemeMath,
  ThemeAlignment,
  LivingModel,
  Lifecycle,
  Sankey,
  RealTraffic,
  Understanding,
  InvestigationAct,
  CandidateFlow,
  GraysonIntro,
  Investigation,
  ChangeAct,
  ProposedFix,
  Validation,
  Deployment,
  Proof,
  Closer,
  ThankYou,
] satisfies Page[];
