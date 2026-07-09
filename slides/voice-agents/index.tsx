import type { ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import { Highlight, themes } from 'prism-react-renderer';

// ─── Design tokens (shared Mastra brand) ─────────────────────────────────────
export const design: DesignSystem = {
  palette: {
    bg: '#020202',
    text: '#d9d9d9',
    accent: '#18fb6f',
  },
  fonts: {
    display: '"Geist", "Inter", system-ui, -apple-system, sans-serif',
    body: '"Geist", "Inter", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 140, body: 32 },
  radius: 12,
};

const palette = {
  bg: design.palette.bg,
  text: design.palette.text,
  accent: design.palette.accent,
  surface: '#0a0a0a',
  surfaceHi: '#151515',
  surfaceHi2: '#202020',
  border: '#242424',
  borderBright: '#3a3a3a',
  textSoft: '#a9a9a9',
  muted: '#757575',
  dim: '#5c5c5c',
  green: design.palette.accent,
  blue: '#6aa8ff',
  amber: '#e3b758',
  purple: '#b48cff',
  rose: '#ff7a89',
  cyan: '#5ed4d6',
};

const font = {
  display: design.fonts.display,
  body: design.fonts.body,
  mono: '"Geist Mono", "JetBrains Mono", ui-monospace, Menlo, monospace',
};

const fill = {
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  letterSpacing: '-0.012em',
  position: 'relative' as const,
  overflow: 'hidden' as const,
};

// ─── Motion — subtle, one DNA across the deck ────────────────────────────────
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

export const transition: SlideTransition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-4px)' },
    ],
  },
  enter: {
    duration: 200,
    delay: 80,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

const settle: SlideTransition = {
  duration: 280,
  exit: {
    duration: 160,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-6px)' },
    ],
  },
  enter: {
    duration: 280,
    delay: 100,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

// ─── Atoms ───────────────────────────────────────────────────────────────────

const Grid = ({ opacity = 0.14 }: { opacity?: number }) => (
  <div
    aria-hidden
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage:
        `linear-gradient(${palette.border} 1px, transparent 1px), ` +
        `linear-gradient(90deg, ${palette.border} 1px, transparent 1px)`,
      backgroundSize: '96px 96px',
      opacity,
    }}
  />
);

const Glow = ({ color = palette.accent, side = 'left' }: { color?: string; side?: 'left' | 'right' }) => (
  <div
    aria-hidden
    style={{
      position: 'absolute',
      inset: 0,
      background:
        side === 'left'
          ? `radial-gradient(920px 540px at 16% 20%, ${color}20 0%, transparent 62%), radial-gradient(760px 460px at 84% 80%, ${palette.surfaceHi} 0%, transparent 66%)`
          : `radial-gradient(920px 540px at 84% 20%, ${color}20 0%, transparent 62%), radial-gradient(760px 460px at 16% 80%, ${palette.surfaceHi} 0%, transparent 66%)`,
    }}
  />
);

const Footer = ({ section = 'MASTRA · VOICE AGENTS' }: { section?: string }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 50,
        left: 120,
        right: 120,
        zIndex: 4,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: font.mono,
        fontSize: 18,
        color: palette.dim,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}
    >
      <span>{section}</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Stage = ({
  children,
  padding = '106px 120px 118px',
  glow = palette.accent,
  glowSide = 'left',
  section,
}: {
  children: ReactNode;
  padding?: string;
  glow?: string;
  glowSide?: 'left' | 'right';
  section?: string;
}) => (
  <div style={{ ...fill, padding, display: 'flex', flexDirection: 'column' }}>
    <Grid />
    <Glow color={glow} side={glowSide} />
    <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>
    <Footer section={section} />
  </div>
);

const Eyebrow = ({ children, color = 'var(--osd-accent)' }: { children: ReactNode; color?: string }) => (
  <div
    style={{
      fontFamily: font.mono,
      fontSize: 22,
      fontWeight: 750,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);

const Title = ({ children, size = 72, maxWidth = 1560 }: { children: ReactNode; size?: number; maxWidth?: number }) => (
  <h1
    style={{
      fontFamily: font.display,
      fontSize: size,
      fontWeight: 880,
      lineHeight: 1.06,
      letterSpacing: '-0.03em',
      margin: '22px 0 0',
      maxWidth,
      color: 'var(--osd-text)',
    }}
  >
    {children}
  </h1>
);

const Subtitle = ({ children, maxWidth = 1360, size = 30 }: { children: ReactNode; maxWidth?: number; size?: number }) => (
  <p style={{ fontSize: size, color: palette.textSoft, lineHeight: 1.42, maxWidth, margin: '24px 0 0' }}>{children}</p>
);

const Card = ({
  label,
  title,
  children,
  accent = palette.accent,
}: {
  label: string;
  title: ReactNode;
  children?: ReactNode;
  accent?: string;
}) => (
  <div
    style={{
      background: `linear-gradient(180deg, ${accent}12 0%, ${palette.surface} 58%)`,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 18,
      padding: '26px 28px',
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 15, letterSpacing: '0.16em', textTransform: 'uppercase', color: accent }}>
      {label}
    </div>
    <div style={{ marginTop: 16, fontSize: 30, lineHeight: 1.16, fontWeight: 850, color: palette.text }}>{title}</div>
    {children && <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.4, color: palette.textSoft }}>{children}</div>}
  </div>
);

const Bullet = ({ children, accent = palette.accent, size = 34 }: { children: ReactNode; accent?: string; size?: number }) => (
  <li style={{ display: 'flex', alignItems: 'flex-start', gap: 16, fontSize: size, lineHeight: 1.4, color: palette.textSoft }}>
    <span style={{ color: accent, fontFamily: font.mono, fontSize: size * 0.76, lineHeight: 1.5, flexShrink: 0 }}>▸</span>
    <span>{children}</span>
  </li>
);

const BulletList = ({ children, gap = 22, marginTop = 48 }: { children: ReactNode; gap?: number; marginTop?: number }) => (
  <ul style={{ listStyle: 'none', margin: `${marginTop}px 0 0`, padding: 0, display: 'flex', flexDirection: 'column', gap }}>
    {children}
  </ul>
);

const FlowNode = ({ label, detail, accent = palette.accent }: { label: string; detail: string; accent?: string }) => (
  <div
    style={{
      flex: 1,
      minHeight: 112,
      borderRadius: 18,
      border: `1px solid ${accent}55`,
      background: `linear-gradient(180deg, ${accent}14 0%, ${palette.surface} 78%)`,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxShadow: `0 20px 60px ${accent}0d`,
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 23, fontWeight: 800, color: palette.text, letterSpacing: '0.02em' }}>
      {label}
    </div>
    <div style={{ marginTop: 8, fontSize: 17, lineHeight: 1.3, color: palette.textSoft }}>{detail}</div>
  </div>
);

const Arrow = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 44 }}>
    <span style={{ fontFamily: font.mono, fontSize: 30, color: palette.muted }}>→</span>
  </div>
);

const Mono = ({ children, color = palette.text }: { children: ReactNode; color?: string }) => (
  <span style={{ fontFamily: font.mono, fontSize: '0.85em', color }}>{children}</span>
);

const codeTheme = {
  ...themes.nightOwl,
  plain: {
    ...themes.nightOwl.plain,
    backgroundColor: 'transparent',
    color: palette.text,
    fontFamily: font.mono,
  },
  styles: themes.nightOwl.styles.map((style) => ({
    ...style,
    style: { ...style.style, backgroundColor: 'transparent' },
  })),
};

const CodeBlock = ({
  label,
  code,
  language = 'typescript',
  accent = palette.accent,
  fontSize = 20,
}: {
  label?: string;
  code: string;
  language?: string;
  accent?: string;
  fontSize?: number;
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 14,
      padding: '20px 26px',
    }}
  >
    {label && (
      <div
        style={{
          fontFamily: font.mono,
          color: accent,
          fontSize: 14,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: 14,
        }}
      >
        {label}
      </div>
    )}
    <Highlight theme={codeTheme} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            margin: 0,
            background: 'transparent',
            fontFamily: font.mono,
            fontSize,
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  </div>
);

const HookRow = ({
  hook,
  fires,
  contract,
  use,
  accent,
  header = false,
}: {
  hook: string;
  fires: string;
  contract: string;
  use: string;
  accent?: string;
  header?: boolean;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '300px 1.1fr 1fr 1.1fr',
      gap: 20,
      alignItems: 'center',
      padding: header ? '0 0 12px' : '17px 0',
      borderBottom: header ? `1px solid ${palette.borderBright}` : `1px solid ${palette.border}`,
    }}
  >
    <div
      style={
        header
          ? { fontFamily: font.mono, fontSize: 15, letterSpacing: '0.14em', textTransform: 'uppercase', color: palette.muted }
          : { fontFamily: font.mono, fontSize: 22, fontWeight: 800, color: accent }
      }
    >
      {hook}
    </div>
    {[fires, contract, use].map((cell, i) => (
      <div
        key={i}
        style={
          header
            ? { fontFamily: font.mono, fontSize: 15, letterSpacing: '0.14em', textTransform: 'uppercase', color: palette.muted }
            : { fontSize: 20, color: palette.textSoft, lineHeight: 1.32 }
        }
      >
        {cell}
      </div>
    ))}
  </div>
);

const Chip = ({ children, accent }: { children: ReactNode; accent?: string }) => (
  <span
    style={{
      fontFamily: font.mono,
      fontSize: 16,
      padding: '6px 12px',
      borderRadius: 8,
      border: `1px solid ${accent ? `${accent}66` : palette.borderBright}`,
      background: palette.surfaceHi,
      color: accent ?? palette.text,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

const DiagBox = ({
  left,
  top,
  width,
  height,
  label,
  accent,
  children,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
  label: string;
  accent: string;
  children?: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height,
      borderRadius: 18,
      border: `1px solid ${accent}55`,
      background: `linear-gradient(180deg, ${accent}12 0%, ${palette.surface} 72%)`,
      padding: '18px 20px',
      boxShadow: `0 20px 60px ${accent}0d`,
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 15, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>
      {label}
    </div>
    {children}
  </div>
);

const DiagLabel = ({
  left,
  top,
  width,
  color = palette.muted,
  align = 'left',
  children,
}: {
  left: number;
  top: number;
  width: number;
  color?: string;
  align?: 'left' | 'center';
  children: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width,
      fontFamily: font.mono,
      fontSize: 16,
      lineHeight: 1.4,
      color,
      textAlign: align,
    }}
  >
    {children}
  </div>
);

const HArrow = ({
  left,
  top,
  width,
  color = palette.dim,
  dashed = false,
  heads = 'both',
}: {
  left: number;
  top: number;
  width: number;
  color?: string;
  dashed?: boolean;
  heads?: 'both' | 'right' | 'left';
}) => (
  <div style={{ position: 'absolute', left, top, width, display: 'flex', alignItems: 'center' }}>
    {(heads === 'both' || heads === 'left') && <span style={{ color, fontSize: 13, lineHeight: 1 }}>◀</span>}
    <div
      style={{
        flex: 1,
        height: dashed ? 0 : 2,
        borderTop: dashed ? `2px dashed ${color}` : 'none',
        background: dashed ? 'transparent' : color,
      }}
    />
    {(heads === 'both' || heads === 'right') && <span style={{ color, fontSize: 13, lineHeight: 1 }}>▶</span>}
  </div>
);

const VArrow = ({ left, top, height, color = palette.dim }: { left: number; top: number; height: number; color?: string }) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      height,
      width: 14,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <span style={{ color, fontSize: 13, lineHeight: 1 }}>▲</span>
    <div style={{ flex: 1, width: 2, background: color }} />
    <span style={{ color, fontSize: 13, lineHeight: 1 }}>▼</span>
  </div>
);

const HackItem = ({
  n,
  sub,
  accent = palette.accent,
  size = 22,
  children,
}: {
  n: string;
  sub?: ReactNode;
  accent?: string;
  size?: number;
  children: ReactNode;
}) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <span style={{ fontFamily: font.mono, fontSize: size * 0.9, fontWeight: 800, color: accent, minWidth: 30, lineHeight: 1.4 }}>
      {n}
    </span>
    <div>
      <div style={{ fontSize: size, lineHeight: 1.35, color: palette.text }}>{children}</div>
      {sub && <div style={{ marginTop: 6, fontSize: size * 0.82, lineHeight: 1.4, color: palette.muted }}>{sub}</div>}
    </div>
  </div>
);

const FootNote = ({ children }: { children: ReactNode }) => (
  <p style={{ marginTop: 28, fontSize: 20, color: palette.dim, fontFamily: font.mono, lineHeight: 1.5 }}>{children}</p>
);

// ─── Landscape helpers (context section) ─────────────────────────────────────

const TierCard = ({
  tier,
  name,
  api,
  feel,
  tag,
  accent,
  highlight = false,
}: {
  tier: string;
  name: string;
  api: string;
  feel: string;
  tag: string;
  accent: string;
  highlight?: boolean;
}) => (
  <div
    style={{
      flex: 1,
      borderRadius: 16,
      border: `1px solid ${highlight ? accent : palette.border}`,
      borderTop: `2px solid ${accent}`,
      background: highlight
        ? `linear-gradient(180deg, ${accent}1e 0%, ${palette.surface} 62%)`
        : `linear-gradient(180deg, ${accent}10 0%, ${palette.surface} 60%)`,
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: highlight ? `0 24px 70px ${accent}16` : 'none',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontFamily: font.mono, fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase', color: accent }}>
        {tier}
      </div>
      <span style={{ fontFamily: font.mono, fontSize: 13, color: highlight ? accent : palette.dim }}>{tag}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.14, fontWeight: 850, color: palette.text }}>{name}</div>
    <div
      style={{
        marginTop: 12,
        fontFamily: font.mono,
        fontSize: 15,
        lineHeight: 1.5,
        color: palette.textSoft,
        whiteSpace: 'pre-line',
      }}
    >
      {api}
    </div>
    <div style={{ marginTop: 'auto', paddingTop: 16, fontSize: 16, lineHeight: 1.36, color: accent }}>{feel}</div>
  </div>
);

const Bucket = ({
  label,
  count,
  accent,
  children,
}: {
  label: string;
  count: string;
  accent: string;
  children: ReactNode;
}) => (
  <div
    style={{
      borderRadius: 14,
      border: `1px solid ${palette.border}`,
      borderLeft: `3px solid ${accent}`,
      background: palette.surface,
      padding: '16px 20px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <div style={{ fontFamily: font.mono, fontSize: 14, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>
        {label}
      </div>
      <div style={{ fontFamily: font.mono, fontSize: 13, color: palette.dim }}>{count}</div>
    </div>
    <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 01b — The landscape: three tiers of voice
// ════════════════════════════════════════════════════════════════════════════
const VoiceLandscape: Page = () => (
  <Stage section="MASTRA · VOICE AGENTS · LANDSCAPE" glow={palette.green} glowSide="right">
    <Eyebrow>The landscape — where LiveKit fits</Eyebrow>
    <Title size={52}>One voice API. Three ways to ship it.</Title>
    <Subtitle size={21} maxWidth={1660}>
      Every provider extends one <Mono color={palette.text}>MastraVoice</Mono> base; the agent takes one{' '}
      <Mono color={palette.text}>voice</Mono> property. What changes is how real-time you need to be — and which of
      the 17 providers you reach for.
    </Subtitle>
    <div style={{ marginTop: 24, display: 'flex', gap: 20, alignItems: 'stretch' }}>
      <TierCard
        tier="Tier 1 · turn-based"
        name="TTS + STT"
        tag="13 providers"
        accent={palette.cyan}
        api={`speak(text)  → audio\nlisten(audio) → text`}
        feel="Batch, request/response. When you don't need real-time."
      />
      <TierCard
        tier="Tier 2 · realtime"
        name="Provider speech-to-speech"
        tag="5 providers"
        accent={palette.amber}
        api={`connect() · send(audio)\n.on('speaker' | 'writing')`}
        feel="One vendor, in your process. Fastest to a demo."
      />
      <TierCard
        tier="Tier 3 · LiveKit"
        name="@mastra/livekit"
        tag="this deck"
        accent={palette.green}
        highlight
        api={`createLiveKitWorker({ stt,\n  tts, turnDetection, agent })`}
        feel="Composable stack, media off your box. Phone-grade."
      />
    </div>
    <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <Bucket label="TTS only" count="4" accent={palette.purple}>
        <Chip accent={palette.purple}>Murf</Chip>
        <Chip accent={palette.purple}>PlayAI</Chip>
        <Chip accent={palette.purple}>Speechify</Chip>
        <Chip accent={palette.purple}>ModelsLab</Chip>
      </Bucket>
      <Bucket label="STT only" count="2" accent={palette.blue}>
        <Chip accent={palette.blue}>Cloudflare</Chip>
        <Chip accent={palette.blue}>Gladia</Chip>
      </Bucket>
      <Bucket label="TTS + STT" count="7" accent={palette.cyan}>
        <Chip accent={palette.cyan}>OpenAI</Chip>
        <Chip accent={palette.cyan}>ElevenLabs</Chip>
        <Chip accent={palette.cyan}>Deepgram</Chip>
        <Chip accent={palette.cyan}>Google</Chip>
        <Chip accent={palette.cyan}>Azure</Chip>
        <Chip accent={palette.cyan}>Sarvam</Chip>
        <Chip accent={palette.cyan}>Inworld</Chip>
      </Bucket>
      <Bucket label="Realtime · speech-to-speech" count="5" accent={palette.amber}>
        <Chip accent={palette.amber}>OpenAI Realtime</Chip>
        <Chip accent={palette.amber}>Gemini Live</Chip>
        <Chip accent={palette.amber}>AWS Nova Sonic</Chip>
        <Chip accent={palette.amber}>xAI</Chip>
        <Chip accent={palette.amber}>Inworld Realtime</Chip>
      </Bucket>
    </div>
    <FootNote>
      Mix any STT + TTS with <Mono color={palette.text}>CompositeVoice</Mono> — or drop in any Vercel AI SDK v5
      speech / transcription model, no dedicated package needed.
    </FootNote>
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 01 — Cover
// ════════════════════════════════════════════════════════════════════════════
const Cover: Page = () => (
  <Stage padding="0 120px" glow={palette.green} glowSide="left">
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Eyebrow>Mastra · voice agents</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 920,
          lineHeight: 1.02,
          letterSpacing: '-0.04em',
          margin: '30px 0 0',
          maxWidth: 1620,
          color: palette.text,
        }}
      >
        Building real-time
        <br />
        <span style={{ color: palette.accent, whiteSpace: 'nowrap' }}>voice agents.</span>
      </h1>
      <p style={{ margin: '30px 0 0', maxWidth: 1440, fontSize: 32, lineHeight: 1.4, color: palette.textSoft }}>
        The speech stack, the lifecycle hooks, and the full Mastra memory stack — everything behind a production
        voice agent, from the browser to the phone.
      </p>
      <div style={{ display: 'flex', gap: 28, marginTop: 52, fontFamily: font.mono, fontSize: 19 }}>
        <span style={{ color: palette.accent }}>mastra.ai/reference/voice/livekit</span>
        <span style={{ color: palette.muted }}>·</span>
        <span style={{ color: palette.textSoft }}>docs.livekit.io/agents</span>
      </div>
    </div>
  </Stage>
);
Cover.transition = settle;

// ════════════════════════════════════════════════════════════════════════════
// 02 — The shape of it + agenda (combined)
// ════════════════════════════════════════════════════════════════════════════
const ShapeAndAgenda: Page = () => (
  <Stage glow={palette.green} glowSide="right">
    <Eyebrow>The shape of it</Eyebrow>
    <Title>LiveKit owns the audio loop. Mastra owns the reply.</Title>
    <div style={{ marginTop: 44, display: 'flex', alignItems: 'center', gap: 14 }}>
      <FlowNode label="VAD" detail="detect speech" accent={palette.blue} />
      <Arrow />
      <FlowNode label="STT" detail="stream the transcript" accent={palette.cyan} />
      <Arrow />
      <FlowNode label="Turn detection" detail="a finished thought, not just silence" accent={palette.amber} />
      <Arrow />
      <FlowNode label="Mastra agent" detail="agent.stream() — the reply" accent={palette.green} />
      <Arrow />
      <FlowNode label="TTS" detail="speak as tokens arrive" accent={palette.purple} />
    </div>
    <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
      <Card label="01" title="The batteries-included worker" accent={palette.green}>
        <Mono color={palette.green}>createLiveKitWorker()</Mono> — speech stack, reply paths, and grouped
        compliance configuration.
      </Card>
      <Card label="02" title="Lifecycle hooks" accent={palette.blue}>
        <Mono color={palette.blue}>toolFeedback</Mono>, <Mono color={palette.blue}>onTurnComplete</Mono>,{' '}
        <Mono color={palette.blue}>onCallEnd</Mono> — real work, zero added latency.
      </Card>
      <Card label="03" title="Memory on calls" accent={palette.purple}>
        Thread = call, resource = caller — with writes kept off the spoken path.
      </Card>
    </div>
    <p style={{ margin: '34px 0 0', maxWidth: 1620, fontSize: 23, lineHeight: 1.45, color: palette.textSoft }}>
      In practice: a worker process registers with LiveKit and answers calls. LiveKit turns speech into a live
      transcript and decides when the caller has finished a thought; the worker hands that turn to your Mastra
      agent, and the reply streams straight into TTS while it's still generating. Memory, tools, and observability
      all run on the Mastra side — the audio itself never touches your HTTP server.
    </p>
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — Quick start: the worker
// ════════════════════════════════════════════════════════════════════════════
const QuickStartWorker: Page = () => (
  <Stage section="MASTRA · VOICE AGENTS · THE WORKER" glow={palette.green} glowSide="left">
    <Eyebrow>The worker — Quick start</Eyebrow>
    <Title size={60}>A voice agent is one file.</Title>
    <div style={{ marginTop: 36 }}>
      <CodeBlock
        label="src/mastra/voice-worker.ts"
        accent={palette.green}
        fontSize={19}
        code={`import { fileURLToPath } from 'node:url'
import { createLiveKitWorker, runLiveKitWorker } from '@mastra/livekit/worker'
import { mastra } from './index'

export default createLiveKitWorker({
  mastra,
  agent: 'support',              // Mastra agent key/id — or a per-call resolver
  stt: 'deepgram/nova-3',        // LiveKit Cloud inference string, or your own plugin
  tts: 'cartesia/sonic-3',
  turnDetection: 'multilingual', // semantic end-of-turn model, runs locally on CPU
  configuration: {
    greeting: { text: 'Thanks for calling. How can I help?' },
  },
})

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runLiveKitWorker({ entry: import.meta.url, agentName: 'mastra-voice' })
}`}
      />
    </div>
    <FootNote>
      Model strings route through LiveKit Cloud inference — no separate Deepgram or Cartesia accounts, just LIVEKIT_* env vars.
    </FootNote>
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — Data flow: frontend ↔ Mastra ↔ LiveKit ↔ worker
// ════════════════════════════════════════════════════════════════════════════
const CallDataFlow: Page = () => (
  <Stage section="MASTRA · VOICE AGENTS · THE WORKER" glow={palette.blue} glowSide="left">
    <Eyebrow>The worker — Data flow</Eyebrow>
    <Title size={60}>How a call actually flows.</Title>
    <div style={{ position: 'relative', marginTop: 36, height: 540 }}>
      <DiagBox left={0} top={20} width={330} height={150} label="Your frontend" accent={palette.blue}>
        <div style={{ marginTop: 12, fontSize: 18, lineHeight: 1.4, color: palette.textSoft }}>
          Browser, mobile app — or a phone caller coming in over a SIP trunk.
        </div>
      </DiagBox>

      <DiagBox left={0} top={370} width={330} height={150} label="Your Mastra server" accent={palette.green}>
        <div style={{ marginTop: 12, fontSize: 18, lineHeight: 1.4, color: palette.textSoft }}>
          <Mono color={palette.green}>liveKitConnectionRoute</Mono> mints a short-lived JWT with the agent
          dispatch embedded — then it's out of the loop.
        </div>
      </DiagBox>

      <VArrow left={38} top={182} height={176} />
      <DiagLabel left={84} top={206} width={480} color={palette.blue}>
        ① POST /voice/livekit/connection-details
      </DiagLabel>
      <DiagLabel left={84} top={296} width={480} color={palette.green}>
        ② {'{ serverUrl, roomName, participantToken }'}
      </DiagLabel>

      <HArrow left={340} top={88} width={270} heads="both" color={palette.blue} />
      <DiagLabel left={340} top={38} width={270} align="center" color={palette.blue}>
        ③ joins the room over WebRTC — audio ⇄
      </DiagLabel>

      <DiagBox left={620} top={20} width={420} height={500} label="LiveKit media server" accent={palette.amber}>
        <div style={{ marginTop: 16, border: `1.5px dashed ${palette.borderBright}`, borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.dim }}>room · mastra-voice-4f2a</div>
          <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Chip accent={palette.blue}>caller</Chip>
            <Chip accent={palette.purple}>agent (worker)</Chip>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 17, lineHeight: 1.42, color: palette.textSoft }}>
          Cloud or self-hosted. Holds room state and routes WebRTC audio between participants — your servers
          never proxy the media.
        </div>
      </DiagBox>

      <DiagLabel left={1044} top={40} width={202} align="center" color={palette.amber}>
        ④ dispatch pulls a registered worker in
      </DiagLabel>
      <HArrow left={1050} top={110} width={190} heads="right" color={palette.amber} />
      <HArrow left={1050} top={330} width={190} heads="both" color={palette.dim} />
      <DiagLabel left={1044} top={346} width={202} align="center" color={palette.dim}>
        ⑤ audio ⇄
      </DiagLabel>

      <DiagBox left={1250} top={20} width={430} height={500} label="LiveKit worker" accent={palette.purple}>
        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Chip>VAD</Chip>
          <span style={{ color: palette.muted, fontFamily: font.mono, fontSize: 14 }}>▸</span>
          <Chip>STT</Chip>
          <span style={{ color: palette.muted, fontFamily: font.mono, fontSize: 14 }}>▸</span>
          <Chip>turn detection</Chip>
          <span style={{ color: palette.muted, fontFamily: font.mono, fontSize: 14 }}>▸</span>
          <Chip accent={palette.green}>agent.stream()</Chip>
          <span style={{ color: palette.muted, fontFamily: font.mono, fontSize: 14 }}>▸</span>
          <Chip>TTS</Chip>
        </div>
        <div style={{ marginTop: 18, fontSize: 17, lineHeight: 1.42, color: palette.textSoft }}>
          Registers under <Mono>agentName: 'mastra-voice'</Mono> and answers dispatches — one isolated job
          process per call. Your Mastra instance runs in-process: tools, memory, processors, model routing.
        </div>
        <div style={{ marginTop: 14, fontSize: 17, lineHeight: 1.42, color: palette.dim }}>
          Barge-in cancels the in-flight stream; the finished turn's reply streams straight back into TTS.
        </div>
      </DiagBox>

      <HArrow left={340} top={452} width={270} heads="right" color={palette.dim} dashed />
      <DiagLabel left={340} top={468} width={270} align="center" color={palette.dim}>
        outbound: dispatchVoiceSession()
      </DiagLabel>
    </div>
    <FootNote>
      One LiveKit project, three shared env vars: LIVEKIT_URL · LIVEKIT_API_KEY · LIVEKIT_API_SECRET. Metadata
      rides the dispatch: agentId / threadId / resourceId / requestContext.
    </FootNote>
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 09 — Configuration overview
// ════════════════════════════════════════════════════════════════════════════
const Configuration: Page = () => (
  <Stage section="MASTRA · VOICE AGENTS · THE WORKER" glow={palette.amber} glowSide="right">
    <Eyebrow>The worker — configuration</Eyebrow>
    <Title size={56}>One home for conversation & compliance.</Title>
    <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 34, alignItems: 'start' }}>
      <CodeBlock
        label="grouped worker configuration"
        accent={palette.amber}
        fontSize={16}
        code={`configuration: {
  greeting: {
    text: 'You are speaking with an AI assistant.',
    allowInterruptions: false,   // can't be barged over
    repeatEvery: 3 * 60_000,     // re-disclose on long calls
  },
  requireConsent: {
    summaryStorage: { required: true, purpose: 'call summary' },
  },
  endCall: { message: 'Thanks for calling. Goodbye!' },
  tts: ({ requestContext }) =>            // per-call voice
    TENANTS[requestContext?.tenantId]?.voice,
}`}
      />
      <BulletList marginTop={2} gap={16}>
        <Bullet size={21} accent={palette.green}>
          <strong style={{ color: palette.text }}>Greeting = AI disclosure</strong>: spoken via TTS at call start —
          no model round-trip, persisted to the thread.
        </Bullet>
        <Bullet size={21} accent={palette.green}>
          Non-interruptible + periodic re-disclosure → EU AI Act Art. 50, landed at a turn boundary, never
          mid-sentence.
        </Bullet>
        <Bullet size={21} accent={palette.blue}>
          <Mono>requireConsent</Mono>: declare → capture → enforce. Requirements surface on <Mono>onCallEnd</Mono>;
          gate the summary write on the grant.
        </Bullet>
        <Bullet size={21} accent={palette.amber}>
          A named, extensible set — recording, retention, handoff land as new keys, not new flags.
        </Bullet>
      </BulletList>
    </div>
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 12 — Observability
// ════════════════════════════════════════════════════════════════════════════
const Observability: Page = () => (
  <Stage section="MASTRA · VOICE AGENTS · THE WORKER" glow={palette.purple} glowSide="right">
    <Eyebrow>The worker — Observability</Eyebrow>
    <Title>One trace per call, on by default.</Title>
    <Subtitle maxWidth={1500}>
      When your Mastra instance has observability configured, the worker opens a{' '}
      <Mono color={palette.text}>voice call</Mono> span per session and nests everything under it.
    </Subtitle>
    <BulletList>
      <Bullet accent={palette.purple}>Every turn's Mastra agent run, nested under the call span.</Bullet>
      <Bullet accent={palette.purple}>
        LiveKit pipeline metrics as child spans: STT, TTS time-to-first-byte, end-of-utterance, VAD, LLM
        time-to-first-token.
      </Bullet>
      <Bullet accent={palette.purple}>A per-model token / character / audio usage roll-up when the call closes.</Bullet>
      <Bullet accent={palette.purple}>
        Where your latency actually goes — the data behind every tuning decision in this deck.
      </Bullet>
    </BulletList>
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 10 — The hook map (expanded)
// ════════════════════════════════════════════════════════════════════════════
const HookMap: Page = () => (
  <Stage section="MASTRA · VOICE AGENTS · LIFECYCLE HOOKS" glow={palette.blue} glowSide="left">
    <Eyebrow>Lifecycle hooks — The map</Eyebrow>
    <Title>Four hooks, four latency contracts.</Title>
    <div style={{ marginTop: 36 }}>
      <HookRow header hook="hook" fires="fires" contract="latency contract" use="use it for" />
      <HookRow
        hook="toolFeedback"
        fires="Mid-turn, as a tool call starts"
        contract="Sync — the returned string is spoken"
        use="Filler while a slow tool runs; lands in the transcript"
        accent={palette.amber}
      />
      <HookRow
        hook="onSessionStart"
        fires="Once, after greeting playout"
        contract="Awaited at startup"
        use="Attach listeners, trigger a first reply"
        accent={palette.cyan}
      />
      <HookRow
        hook="onTurnComplete"
        fires="After each reply — barge-in included"
        contract="Fire-and-forget — never awaited, errors logged"
        use="CRM logs, off-clock writes keyed to the caller"
        accent={palette.blue}
      />
      <HookRow
        hook="onCallEnd"
        fires="Once — hang-up or agent endCall"
        contract="Awaited in the shutdown grace window"
        use="Summarize the call, flush memory"
        accent={palette.green}
      />
    </div>
    <div style={{ marginTop: 26 }}>
      <CodeBlock
        label="the two per-turn hooks, together"
        accent={palette.blue}
        fontSize={18}
        code={`toolFeedback: ({ toolName }) =>
  toolName === 'lookupOrder' ? 'Let me pull that up.' : undefined,

onTurnComplete: async ({ result, memory }) => {
  // result.text · result.toolCalls · result.interrupted (true on barge-in)
  if (memory) await crm.logContact(memory.resource, result.text)
},`}
      />
    </div>
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// Combined — end the call, then do the heavy work (endCall + onCallEnd)
// ════════════════════════════════════════════════════════════════════════════
const Teardown: Page = () => (
  <Stage section="MASTRA · VOICE AGENTS · LIFECYCLE HOOKS" glow={palette.green} glowSide="right">
    <Eyebrow>configuration.endCall · onCallEnd</Eyebrow>
    <Title size={56}>Hang up, then do the expensive work.</Title>
    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, alignItems: 'start' }}>
      <CodeBlock
        label="the agent hangs up — after the goodbye lands"
        accent={palette.rose}
        fontSize={15}
        code={`import { createEndCallTool } from '@mastra/livekit'

// on the agent — it only signals, can't reach the room:
endCall: createEndCallTool(),

// on the worker — owns the room:
configuration: {
  endCall: {
    message: 'Thanks for calling. Goodbye!',
    maxWaitMs: 30_000,
  },
},`}
      />
      <CodeBlock
        label="then teardown runs the expensive work"
        accent={palette.green}
        fontSize={15}
        code={`onCallEnd: async ({ memory }) => {
  if (!memory) return
  await callCenterMemory.summarizeThread({
    model: 'openai/gpt-4.1-mini',
    threadId: memory.thread,
    resourceId: memory.resource,
    instructions:
      'Summarize this call for the business owner.',
  })
},`}
      />
    </div>
    <BulletList marginTop={26} gap={12}>
      <Bullet size={21} accent={palette.rose}>
        The agent says its goodbye, then calls <Mono>endCall</Mono> — the worker waits for the words to finish, then
        deletes the room (SIP-safe hang-up).
      </Bullet>
      <Bullet size={21} accent={palette.green}>
        Caller hang-up <em>and</em> agent <Mono>endCall</Mono> fire the same <Mono>onCallEnd</Mono> — awaited in the
        shutdown window, so summaries, extraction, and CRM writes finish before the process exits.
      </Bullet>
    </BulletList>
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 12 — Memory foundations: scoping + the three layers
// ════════════════════════════════════════════════════════════════════════════
const MemoryFoundations: Page = () => (
  <Stage section="MASTRA · VOICE AGENTS · MEMORY" glow={palette.purple} glowSide="right">
    <Eyebrow>Memory — Scoping & layers</Eyebrow>
    <Title>Thread = the call. Resource = the caller.</Title>
    <Subtitle maxWidth={1540}>
      The worker maps memory automatically —{' '}
      <Mono color={palette.text}>{'{ thread: threadId ?? roomName, resource: resourceId ?? thread }'}</Mono>. The
      thread is created up front (a "Voice call" in Studio), the greeting is persisted as its first message, and
      each turn sends only the new user input — Memory supplies the rest.
    </Subtitle>
    <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
      <Card label="workingMemory" title="Structured fields" accent={palette.green}>
        The intake checklist as a Zod schema — an unfilled field is an unasked question.{' '}
        <Mono>scope: 'resource'</Mono> carries it across calls.
      </Card>
      <Card label="semanticRecall" title="Prior-call context" accent={palette.blue}>
        Relevant snippets of past calls, in context. Runs synchronously before the reply — keep{' '}
        <Mono>topK</Mono> small; every hit is latency the caller hears.
      </Card>
      <Card label="observationalMemory" title="Durable facts" accent={palette.purple}>
        An Observer distills lasting caller facts. Size its threshold above a typical call so it fires between
        calls, not during one.
      </Card>
    </div>
    <FootNote>
      Interrupted turns self-heal: the fragment the caller actually heard is re-sent and deduped — the saved thread
      stays a faithful transcript under barge-in.
    </FootNote>
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 18 — Memory writes off the caller's clock
// ════════════════════════════════════════════════════════════════════════════
const MemoryOffClock: Page = () => (
  <Stage section="MASTRA · VOICE AGENTS · MEMORY" glow={palette.green} glowSide="left">
    <Eyebrow>Memory — Writes</Eyebrow>
    <Title size={60}>Keep every memory write off the caller's clock.</Title>
    <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
      <div>
        <CodeBlock
          label="in the call — read-only working memory"
          accent={palette.green}
          fontSize={17}
          code={`workingMemory: {
  enabled: true,
  scope: 'resource',   // the caller — fields persist across calls
  agentManaged: false, // read-only in the call: no in-loop tool
  schema: z.object({
    callerName: z.string().nullish(),  // .nullish() — extractors
    callerPhone: z.string().nullish(), // emit null for unknowns
    zip: z.string().nullish(),
  }),
},`}
        />
        <BulletList marginTop={22} gap={14}>
          <Bullet size={24}>
            In-loop writes were the top live-call offender: replies re-stated after the tool result, dead air
            before them.
          </Bullet>
          <Bullet size={24}>
            Removing the tool is deterministic — no prompt discipline needed. <Mono>lastMessages</Mono> covers
            in-call recall.
          </Bullet>
        </BulletList>
      </div>
      <div>
        <CodeBlock
          label="at hang-up — one summarization pass"
          accent={palette.amber}
          fontSize={17}
          code={`onCallEnd: async ({ memory }) => {
  await callCenterMemory.summarizeThread({
    model: 'openai/gpt-4.1-mini',
    threadId: memory.thread,
    resourceId: memory.resource,
    extract: [
      callSummaryExtractor,         // -> your store, via onExtracted
      new WorkingMemoryExtractor(), // caller fields land here, once
    ],
  })
},`}
        />
        <BulletList marginTop={22} gap={14}>
          <Bullet size={24} accent={palette.amber}>
            One-shot summarization + extraction at hang-up — awaited in the shutdown window, outside observational
            memory's lifecycle.
          </Bullet>
          <Bullet size={24} accent={palette.amber}>
            Nothing written back to memory: <Mono>onExtracted</Mono> routes the record (summary, sentiment,
            services) to your own store.
          </Bullet>
        </BulletList>
      </div>
    </div>
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// Demo — go live, then come back for the hacks
// ════════════════════════════════════════════════════════════════════════════
const DemoLink = ({ label, href, accent }: { label: string; href: string; accent: string }) => (
  <span>
    <span style={{ color: accent }}>{label}</span>{' '}
    <span style={{ color: palette.textSoft }}>{href}</span>
  </span>
);

const Demo: Page = () => (
  <Stage section="MASTRA · VOICE AGENTS · DEMO" glow={palette.green} glowSide="left">
    <Eyebrow>Demo — then we come back for the hacks</Eyebrow>
    <h1
      style={{
        fontFamily: font.display,
        fontSize: 88,
        fontWeight: 920,
        lineHeight: 1.0,
        letterSpacing: '-0.035em',
        margin: '18px 0 0',
        color: palette.text,
      }}
    >
      Let's <span style={{ color: palette.accent }}>hear the agent.</span>
    </h1>
    <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: '10px 32px', fontFamily: font.mono, fontSize: 18 }}>
      <DemoLink label="Docs" href="mastra.ai/docs/voice/livekit" accent={palette.green} />
      <DemoLink label="Reference" href="mastra.ai/reference/voice/livekit" accent={palette.blue} />
      <DemoLink label="Example" href="mastra/examples/voice-agent" accent={palette.rose} />
      <DemoLink label="Package" href="@mastra/livekit · alpha" accent={palette.amber} />
      <DemoLink label="LiveKit" href="docs.livekit.io/agents" accent={palette.purple} />
    </div>
    <div
      style={{
        marginTop: 34,
        marginBottom: 4,
        fontFamily: font.mono,
        fontSize: 15,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: palette.rose,
      }}
    >
      When we're back — voice agent hacks · via Brendan Jowett
    </div>
    <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 48px' }}>
      <HackItem n="1" size={18} accent={palette.rose}>Static first message, as often as possible.</HackItem>
      <HackItem n="7" size={18} accent={palette.rose}>Ask for real call transcripts — train on what it'll face.</HackItem>
      <HackItem n="2" size={18} accent={palette.rose}>Pick voices trained for phone calls, not audiobooks.</HackItem>
      <HackItem n="8" size={18} accent={palette.rose}>Build for the unhappy path, not just the happy path.</HackItem>
      <HackItem n="3" size={18} accent={palette.rose}>Pay attention to words-per-minute.</HackItem>
      <HackItem n="9" size={18} accent={palette.rose}>Use SMS mid-call to verify emails, phones, names.</HackItem>
      <HackItem n="4" size={18} accent={palette.rose}>Move heavy automations to after the call.</HackItem>
      <HackItem n="10" size={18} accent={palette.rose}>Simplify lead qualification — two or three questions.</HackItem>
      <HackItem n="5" size={18} accent={palette.rose}>Give every agent an escape hatch.</HackItem>
      <HackItem n="11" size={18} accent={palette.rose}>Test relentlessly, then test again.</HackItem>
      <HackItem n="6" size={18} accent={palette.rose}>Keep the system prompt focused on one clear goal.</HackItem>
    </div>
  </Stage>
);
Demo.transition = settle;

export const meta: SlideMeta = {
  title: 'Voice Agents Presentation',
  createdAt: '2026-07-08T00:47:37.408Z',
};

export default [
  Cover,
  VoiceLandscape,
  ShapeAndAgenda,
  QuickStartWorker,
  CallDataFlow,
  Configuration,
  Observability,
  HookMap,
  Teardown,
  MemoryFoundations,
  MemoryOffClock,
  Demo,
] satisfies Page[];
