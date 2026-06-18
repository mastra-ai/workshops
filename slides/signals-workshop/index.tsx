import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
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
  typeScale: { hero: 168, body: 36 },
  radius: 12,
};

const palette = {
  bg: design.palette.bg,
  text: design.palette.text,
  accent: design.palette.accent,
  surface: '#0a0a0a',
  surfaceHi: '#161616',
  surfaceHi2: '#1f1f1f',
  border: '#1f1f1f',
  borderBright: '#343434',
  textSoft: '#a9a9a9',
  muted: '#757575',
  dim: '#5c5c5c',
  green: design.palette.accent,
  amber: '#e3b758',
  blue: '#6aa8ff',
  purple: '#b48cff',
  rose: '#ff7a89',
  red: '#ff6464',
  cyan: '#5ed4d6',
};

const font = {
  sans: design.fonts.body,
  display: design.fonts.display,
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
  overflow: 'hidden',
};

const TOTAL = 19;

// Display type scale — aligned with processors-workshop / om-workshop.
// hero: cover + closing splash · beat: standalone quiet headlines · section: in-deck h1 · sub: hero subtitle
const display = { hero: 96, beat: 92, section: 80, sub: 28 } as const;

// ─── Atoms ───────────────────────────────────────────────────────────────────

const Eyebrow = ({ children, color = palette.accent }: { children: React.ReactNode; color?: string }) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color,
      fontFamily: font.mono,
    }}
  >
    {children}
  </div>
);

const Footer = ({ index }: { index: number }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 56,
      left: 120,
      right: 120,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: font.mono,
      fontSize: 18,
      color: palette.dim,
      letterSpacing: '0.12em',
    }}
  >
    <span>MASTRA · SIGNALS</span>
    <span>
      {String(index).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
    </span>
  </div>
);

const Stage = ({ children, padding = '0 120px' }: { children: React.ReactNode; padding?: string }) => (
  <div style={{ ...fill, padding, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{children}</div>
);

const SectionTitle = ({ title, maxWidth = 1620 }: { title: React.ReactNode; maxWidth?: number }) => (
  <h1
    style={{
      fontFamily: font.display,
      fontSize: display.section,
      fontWeight: 800,
      lineHeight: 1.04,
      letterSpacing: '-0.025em',
      margin: '16px 0 20px',
      maxWidth,
      color: palette.text,
    }}
  >
    {title}
  </h1>
);

const SubTitle = ({ children, maxWidth = 1500 }: { children: React.ReactNode; maxWidth?: number }) => (
  <p style={{ fontSize: display.sub, color: palette.textSoft, lineHeight: 1.42, maxWidth, margin: 0 }}>{children}</p>
);

const Arrow = () => (
  <span style={{ fontFamily: font.mono, fontSize: 26, color: palette.muted, flexShrink: 0 }}>→</span>
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
    style: {
      ...style.style,
      backgroundColor: 'transparent',
    },
  })),
};

const readableCodeColor = (color?: string) => {
  if (!color || color === palette.textSoft || color === palette.muted || color === palette.dim) return '#d9d9d9';
  return color;
};

const CodeBlock = ({
  label,
  lines,
  code,
  language = 'tsx',
  accent = palette.accent,
}: {
  label?: string;
  lines?: { text: string; color?: string }[];
  code?: string;
  language?: string;
  accent?: string;
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 14,
      padding: '22px 26px',
      fontFamily: font.mono,
      fontSize: 17,
      lineHeight: 1.7,
    }}
  >
    {label && (
      <div style={{ color: accent, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
        {label}
      </div>
    )}
    {code ? (
      <Highlight theme={codeTheme} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ ...style, margin: 0, background: 'transparent', fontFamily: font.mono, fontSize: 17, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
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
    ) : (
      lines?.map((line, i) => (
        <div key={i} style={{ color: readableCodeColor(line.color), whiteSpace: 'pre', tabSize: 2 }}>
          {line.text}
        </div>
      ))
    )}
  </div>
);

const Insight = ({ title, children, accent = palette.accent }: { title: string; children: React.ReactNode; accent?: string }) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 14,
      padding: '24px 28px',
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 14, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
      {title}
    </div>
    <div style={{ fontSize: 22, color: palette.text, fontWeight: 600, lineHeight: 1.42, marginBottom: 10 }}>{children}</div>
  </div>
);


const Pill = ({
  label,
  desc,
  accent = palette.accent,
  icon,
}: {
  label: string;
  desc?: React.ReactNode;
  accent?: string;
  icon?: string;
}) => (
  <div
    style={{
      flex: 1,
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 14,
      padding: '22px 26px',
      minHeight: 116,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      {icon && <span style={{ fontSize: 24 }}>{icon}</span>}
      <span style={{ fontFamily: font.mono, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent }}>
        {label}
      </span>
    </div>
    {desc && <div style={{ fontSize: 20, color: palette.textSoft, lineHeight: 1.45 }}>{desc}</div>}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 01 — Cover
// ════════════════════════════════════════════════════════════════════════════
const Cover: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background:
          `radial-gradient(1100px 600px at 18% 22%, ${palette.accent}1a 0%, transparent 60%),` +
          `radial-gradient(900px 500px at 82% 78%, ${palette.surfaceHi} 0%, transparent 65%)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <Eyebrow>Mastra Workshop</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 76,
          fontWeight: 900,
          lineHeight: 1.04,
          margin: '32px 0 24px',
          letterSpacing: '-0.03em',
          maxWidth: 1120,
        }}
      >
        Agent Signals Workshop
      </h1>
      <p style={{ fontSize: 32, color: palette.textSoft, maxWidth: 900, lineHeight: 1.35, margin: 0 }}>
        watch, steer, and wake running agents
      </p>
      <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.mono }}>
        <span style={{ fontSize: 22, color: palette.text, fontWeight: 800, letterSpacing: '0.04em' }}>Tyler Barnes</span>
        <span style={{ width: 34, height: 1, background: palette.borderBright }} />
        <span style={{ fontSize: 20, color: palette.muted, letterSpacing: '0.045em' }}>Founding Principal Engineer @ Mastra</span>
      </div>
    </div>
    <Footer index={1} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 02 — The Problem: Agents stopped fitting request/response
// ════════════════════════════════════════════════════════════════════════════
// 02a — Framing: the original request/response shape
const Problem_Framing: Page = () => (
  <Stage padding="0 120px">
    <div style={{ marginTop: -28, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100%' }}>
      <Eyebrow>The problem</Eyebrow>
      <SectionTitle
        title={
          <>
            Agents stopped fitting <span style={{ color: palette.accent }}>request / response.</span>
          </>
        }
      />
      <SubTitle>
        The first generation were chatbots: send a message, stream a response, finish the turn.
      </SubTitle>

      <div style={{ marginTop: 64, display: 'flex', alignItems: 'center', gap: 24, maxWidth: 1500 }}>
        <div style={{ background: palette.surfaceHi, border: `1px solid ${palette.border}`, borderRadius: 12, padding: '24px 32px', fontFamily: font.mono, fontSize: 22, color: palette.textSoft, textAlign: 'center', minWidth: 220 }}>
          user message
        </div>
        <Arrow />
        <div style={{ background: palette.surfaceHi2, border: `1px dashed ${palette.borderBright}`, borderRadius: 12, padding: '24px 32px', flex: 1, textAlign: 'center', fontFamily: font.mono, fontSize: 22, color: palette.muted }}>
          agent.generate()
        </div>
        <Arrow />
        <div style={{ background: palette.surfaceHi, border: `1px solid ${palette.border}`, borderRadius: 12, padding: '24px 32px', fontFamily: font.mono, fontSize: 22, color: palette.textSoft, textAlign: 'center', minWidth: 220 }}>
          response
        </div>
      </div>
    </div>

    <Footer index={2} />
  </Stage>
);

// 02b — The agents we're building now look different
const Problem_Traits: Page = () => (
  <Stage padding="0 120px">
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 70 }}>
      <Eyebrow>The gap</Eyebrow>
    <SectionTitle
      title={
        <>
          The agents we're building now <span style={{ color: palette.accent }}>look different.</span>
        </>
      }
    />

      <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 1620 }}>
      <Pill icon="⏱️" label="Long-running" desc="Run for minutes or hours, use tools, browse, wait for approvals." accent={palette.blue} />
      <Pill icon="🌐" label="World-aware" desc="Watch GitHub, CI, Slack, email — external systems change state." accent={palette.purple} />
      <Pill icon="🧠" label="Stateful" desc="Working memory, browser state, project state — context that shifts." accent={palette.amber} />
      <Pill icon="👥" label="Multi-user" desc="Multiple clients observing, sending input, approving tools." accent={palette.cyan} />
      <Pill icon="🎯" label="Goal-seeking" desc="A /goal loop self-continues across runs until a stop-condition is met." accent={palette.green} />
      <Pill icon="🔀" label="Multi-channel" desc="One agent reachable from terminal, web, Slack, CI — not one stream." accent={palette.rose} />
      </div>
    </div>

    <Footer index={3} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 03 — Not everything is a chat message
// ════════════════════════════════════════════════════════════════════════════
const NotAChatMessage: Page = () => (
  <Stage>
    <Eyebrow>The gap</Eyebrow>
    <SectionTitle
      title={
        <>
          Not everything is a <span style={{ color: palette.accent }}>chat message.</span>
        </>
      }
    />
    <SubTitle>
      The only universal interface was "append another message." But the things an agent needs to know
      about aren't conversations.
    </SubTitle>

    <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
      {[
        { icon: '🌐', label: 'Browser tab changed', desc: 'The agent navigated — state is now different.', accent: palette.blue },
        { icon: '🧠', label: 'Working memory updated', desc: 'A preference was learned mid-run.', accent: palette.purple },
        { icon: '🔄', label: 'PR has failing CI', desc: 'External system needs to wake the agent.', accent: palette.rose },
        { icon: '💬', label: 'New PR comments', desc: 'GitHub activity the agent subscribed to.', accent: palette.amber },
        { icon: '⏰', label: 'Heartbeat / cron', desc: 'A periodic tick wakes an idle agent.', accent: palette.green },
        { icon: '✉️', label: 'Received a new email', desc: 'External context arrives from another channel.', accent: palette.cyan },
      ].map((item) => (
        <div
          key={item.label}
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderLeft: `3px solid ${item.accent}`,
            borderRadius: 12,
            padding: '20px 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <span style={{ fontSize: 20, color: palette.text, fontWeight: 600 }}>{item.label}</span>
          </div>
          <div style={{ fontSize: 18, color: palette.textSoft, lineHeight: 1.45 }}>{item.desc}</div>
        </div>
      ))}
    </div>

    <Footer index={4} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 04 — Strategic framing: Tools, Memory, Signals
// ════════════════════════════════════════════════════════════════════════════
// ─── Animated agent loop (slide 5) ──────────────────────────────────────────
// One loop iteration as a ring: regular steps are muted, signal injections are
// green. A green pulse travels around the ring continuously.
type LoopNode = {
  label: string;
  kind: 'step' | 'signal';
  signal?: string;
  example?: string;
  callout?: { dx: number; dy: number; align: 'left' | 'right'; arrowFrom: 'left' | 'right' | 'top' };
};

const LOOP_NODES: LoopNode[] = [
  { label: 'text', kind: 'step' },
  { label: 'tool call', kind: 'step' },
  { label: 'reasoning', kind: 'step' },
  { label: 'notification', kind: 'signal', signal: 'signal', example: 'Slack message', callout: { dx: 126, dy: 20, align: 'left', arrowFrom: 'left' } },
  { label: 'tool call', kind: 'step' },
  { label: 'text', kind: 'step' },
  { label: 'reactive', kind: 'signal', signal: 'signal', example: 'AGENTS.md loading', callout: { dx: -12, dy: 76, align: 'left', arrowFrom: 'top' } },
  { label: 'text', kind: 'step' },
  { label: 'tool call', kind: 'step' },
  { label: 'state', kind: 'signal', signal: 'signal', example: 'working memory', callout: { dx: -86, dy: -48, align: 'right', arrowFrom: 'right' } },
  { label: 'steer', kind: 'signal', signal: 'signal', example: 'user correction', callout: { dx: -48, dy: -76, align: 'right', arrowFrom: 'right' } },
];

const AgentLoop = () => {
  const size = 560; // svg viewport (px on the 1080 stage)
  const cx = size / 2;
  const cy = size / 2;
  const r = 218; // node ring radius
  const n = LOOP_NODES.length;
  // total travel time for the pulse to go all the way around
  const period = 9;
  const signalStops = LOOP_NODES.map((node, i) => (node.kind === 'signal' ? (i / n) * 100 : null)).filter(
    (stop): stop is number => stop !== null,
  );
  const flashWindow = 2.6;
  const dotFillKeyframes = signalStops
    .flatMap(stop => [
      `${Math.max(0, stop - flashWindow).toFixed(2)}% { fill: ${palette.muted}; }`,
      `${stop.toFixed(2)}% { fill: ${palette.accent}; }`,
      `${Math.min(100, stop + flashWindow).toFixed(2)}% { fill: ${palette.muted}; }`,
    ])
    .join('\n');
  const dotHaloKeyframes = signalStops
    .flatMap(stop => [
      `${Math.max(0, stop - flashWindow).toFixed(2)}% { opacity: 0; }`,
      `${stop.toFixed(2)}% { opacity: 0.28; }`,
      `${Math.min(100, stop + flashWindow).toFixed(2)}% { opacity: 0; }`,
    ])
    .join('\n');

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <style>{`
        @keyframes osd-loop-spin { to { transform: rotate(360deg); } }
        @keyframes osd-loop-dash { to { stroke-dashoffset: -1408; } }
        @keyframes osd-signal-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(24,251,111,0.0); }
          50%      { box-shadow: 0 0 22px 4px rgba(24,251,111,0.35); }
        }
        /* dot is grey, flashes green only as it passes signal nodes */
        @keyframes osd-dot-fill {
          0%, 100% { fill: ${palette.muted}; }
          ${dotFillKeyframes}
        }
        @keyframes osd-dot-halo {
          0%, 100% { opacity: 0; }
          ${dotHaloKeyframes}
        }
      `}</style>

      {/* track + traveling pulse */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* base ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={palette.border} strokeWidth={2} />
        {/* faint moving dash overlay */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={palette.borderBright}
          strokeWidth={2}
          strokeDasharray="4 18"
          style={{ animation: 'osd-loop-dash 12s linear infinite' }}
        />
        {/* traveling pulse — grey, flashes green as it passes each signal node */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: `osd-loop-spin ${period}s linear infinite` }}>
          <circle
            cx={cx}
            cy={cy - r}
            r={18}
            fill={palette.accent}
            style={{ animation: `osd-dot-halo ${period}s linear infinite` }}
          />
          <circle
            cx={cx}
            cy={cy - r}
            r={9}
            fill={palette.muted}
            style={{ animation: `osd-dot-fill ${period}s linear infinite` }}
          />
        </g>
      </svg>

      {/* center label */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: palette.text,
          }}
        >
          agent loop
        </div>
      </div>

      {/* nodes around the ring */}
      {LOOP_NODES.map((node, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2; // start at top, clockwise
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const isSignal = node.kind === 'signal';
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: isSignal ? '10px 16px' : '8px 14px',
              borderRadius: 10,
              whiteSpace: 'nowrap',
              background: isSignal ? 'rgba(24,251,111,0.10)' : palette.surfaceHi,
              border: `1.5px solid ${isSignal ? palette.accent : palette.border}`,
              animation: isSignal ? 'osd-signal-pulse 3s ease-in-out infinite' : undefined,
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontFamily: font.mono,
                fontSize: isSignal ? 19 : 17,
                fontWeight: isSignal ? 700 : 500,
                color: isSignal ? palette.accent : palette.textSoft,
              }}
            >
              {node.label}
            </span>
            {isSignal && (
              <span style={{ fontFamily: font.mono, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: palette.accent, opacity: 0.85 }}>
                signal
              </span>
            )}
          </div>
        );
      })}

      {/* short arrows from example pills toward signal nodes */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 2 }}
      >
        <defs>
          <marker id="example-arrow" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 7 3.5 L 0 7 z" fill={palette.accent} opacity={0.48} />
          </marker>
        </defs>
        {LOOP_NODES.map((node, i) => {
          if (!node.example || !node.callout) return null;
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
          const signalX = cx + r * Math.cos(angle);
          const signalY = cy + r * Math.sin(angle);
          const x = signalX + node.callout.dx;
          const y = signalY + node.callout.dy;
          const renderedLeft = node.callout.align === 'right' ? x - (node.example.length * 8.4 + 34) : x;
          const pillWidth = node.example.length * 8.4 + 34;
          const pillHeight = 33;
          const startX = node.callout.arrowFrom === 'left' ? renderedLeft : node.callout.arrowFrom === 'right' ? renderedLeft + pillWidth : renderedLeft + pillWidth / 2;
          const startY = node.callout.arrowFrom === 'top' ? y : y + pillHeight / 2;
          const vx = signalX - startX;
          const vy = signalY - startY;
          const len = Math.max(1, Math.hypot(vx, vy));
          const gap = 58;
          const endX = signalX - (vx / len) * gap;
          const endY = signalY - (vy / len) * gap;
          return (
            <line
              key={`example-arrow-${i}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={palette.accent}
              strokeWidth={1.5}
              strokeOpacity={0.35}
              markerEnd="url(#example-arrow)"
            />
          );
        })}
      </svg>

      {/* example callouts for signal injections */}
      {LOOP_NODES.map((node, i) => {
        if (!node.example || !node.callout) return null;
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const x = cx + r * Math.cos(angle) + node.callout.dx;
        const y = cy + r * Math.sin(angle) + node.callout.dy;
        return (
          <div
            key={`callout-${i}`}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: node.callout.align === 'right' ? 'translateX(-100%)' : undefined,
              padding: '7px 10px',
              borderRadius: 999,
              background: 'rgba(217,217,217,0.08)',
              border: `1px solid rgba(217,217,217,0.16)`,
              boxShadow: '0 12px 32px rgba(0,0,0,0.32)',
              pointerEvents: 'none',
              zIndex: 3,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: palette.accent, display: 'inline-block', flex: '0 0 auto' }} />
            <span style={{ fontSize: 15, fontWeight: 650, color: palette.textSoft }}>
              {node.example}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const StrategicFraming: Page = () => (
  <Stage padding="0 120px">
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 80, paddingBottom: 70 }}>
      <div style={{ flex: 1, maxWidth: 820 }}>
        <Eyebrow>The solution</Eyebrow>
        <SectionTitle
          maxWidth={820}
          title={
            <>
              We built <span style={{ color: palette.accent }}>Signals</span> to fill this gap.
            </>
          }
        />
        <SubTitle maxWidth={760}>
          A signal is a way to send context into an active or idle agent — delivered right into the loop as it runs.
        </SubTitle>

        <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 28 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: font.mono, fontSize: 16, color: palette.textSoft }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: palette.surfaceHi, border: `1.5px solid ${palette.border}` }} />
            loop step
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: font.mono, fontSize: 16, color: palette.accent }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: 'rgba(24,251,111,0.12)', border: `1.5px solid ${palette.accent}` }} />
            signal injection
          </span>
        </div>
      </div>

      <div style={{ flexShrink: 0 }}>
        <AgentLoop />
      </div>
    </div>

    <Footer index={5} />
  </Stage>
);

// 04b — Before signals: streaming and context delivery were coupled
const CoupledDelivery: Page = () => (
  <Stage padding="0 130px">
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: 72, alignItems: 'center', paddingBottom: 70 }}>
      <div>
        <Eyebrow>The old shape</Eyebrow>
        <SectionTitle
          maxWidth={760}
          title={
            <>
              Streaming and context delivery were <span style={{ color: palette.accent }}>tightly coupled.</span>
            </>
          }
        />
        <SubTitle maxWidth={720}>
          The stream was both the output channel and the only practical way to push new context into the run.
        </SubTitle>
      </div>

      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 18, padding: 32, boxShadow: '0 28px 80px rgba(0,0,0,0.35)' }}>
        <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.muted, marginBottom: 18 }}>Request-shaped loops</div>
        <div style={{ display: 'grid', gap: 36, paddingTop: 52, fontFamily: font.mono }}>
          {[
            ['Tyler', 'CLI'],
            ['Alex', 'web app'],
            ['CI bot', 'Slack'],
          ].map(([actor, client]) => (
            <div key={actor} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 160px 1fr 150px', alignItems: 'center', gap: 34 }}>
              <div style={{ padding: '14px 16px', borderRadius: 14, background: palette.surfaceHi, border: `1px solid ${palette.borderBright}`, color: palette.textSoft, fontSize: 20, textAlign: 'center' }}>
                {actor}
              </div>
              <div style={{ height: 2, background: palette.borderBright, position: 'relative' }}>
                <div style={{ position: 'absolute', right: -1, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: `22px solid ${palette.borderBright}` }} />
              </div>
              <div style={{ width: 160, height: 100, borderRadius: 999, background: palette.surfaceHi, border: `1px solid ${palette.borderBright}`, display: 'grid', placeItems: 'center' }}>
                <div style={{ color: palette.text, fontSize: 18, fontWeight: 800, textAlign: 'center', lineHeight: 1.15 }}>
                  agent<br />loop
                </div>
              </div>
              <div style={{ height: 2, background: palette.borderBright, position: 'relative' }}>
                <div style={{ position: 'absolute', right: -1, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: `22px solid ${palette.borderBright}` }} />
              </div>
              <div style={{ padding: '14px 16px', borderRadius: 14, background: palette.surfaceHi, border: `1px solid ${palette.borderBright}`, color: palette.textSoft, fontSize: 20, textAlign: 'center' }}>
                {client}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <Footer index={6} />
  </Stage>
);

// 04c — With signals: context delivery is its own lane
const DecoupledDelivery: Page = () => (
  <Stage padding="0 130px">
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: 72, alignItems: 'center', paddingBottom: 70 }}>
      <div>
        <Eyebrow>The new shape</Eyebrow>
        <SectionTitle
          maxWidth={760}
          title={
            <>
              Signals decouple streaming from <span style={{ color: palette.accent }}>delivering context.</span>
            </>
          }
        />
        <SubTitle maxWidth={720}>
          The output stream can keep streaming. Context gets its own addressable lane into the active agent loop.
        </SubTitle>
      </div>

      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 18, padding: 32, boxShadow: '0 28px 80px rgba(0,0,0,0.35)' }}>
        <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.muted, marginBottom: 18 }}>Addressable loop</div>
        <div style={{ position: 'relative', height: 430, fontFamily: font.mono }}>
          <svg aria-hidden width="100%" height="100%" viewBox="0 0 760 430" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <marker id="arrow-accent" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill={palette.accent} />
              </marker>
              <marker id="arrow-muted" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill={palette.borderBright} />
              </marker>
            </defs>
            <path d="M150 92 C245 92 275 132 314 162" stroke={palette.accent} strokeWidth="2" fill="none" markerEnd="url(#arrow-accent)" />
            <path d="M150 210 C235 210 270 210 315 210" stroke={palette.accent} strokeWidth="2" fill="none" markerEnd="url(#arrow-accent)" />
            <path d="M150 328 C245 328 275 288 314 258" stroke={palette.accent} strokeWidth="2" fill="none" markerEnd="url(#arrow-accent)" />
            <path d="M430 190 C505 150 545 110 610 92" stroke={palette.borderBright} strokeWidth="2" fill="none" markerEnd="url(#arrow-muted)" />
            <path d="M430 205 C510 205 545 205 610 205" stroke={palette.borderBright} strokeWidth="2" fill="none" markerEnd="url(#arrow-muted)" />
            <path d="M430 220 C505 260 545 305 610 328" stroke={palette.borderBright} strokeWidth="2" fill="none" markerEnd="url(#arrow-muted)" />
          </svg>

          <div style={{ position: 'absolute', left: 0, top: 48, display: 'grid', gap: 56 }}>
            {['Tyler', 'Alex', 'CI bot'].map((client) => (
              <div key={client} style={{ width: 150, padding: '14px 16px', borderRadius: 14, background: 'rgba(24,251,111,0.08)', border: `1px solid ${palette.accent}`, color: palette.accent, fontSize: 20, textAlign: 'center' }}>
                {client}
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', left: 315, top: 138, width: 150, height: 150, borderRadius: 999, background: 'radial-gradient(circle, rgba(24,251,111,0.20), rgba(24,251,111,0.04))', border: `1px solid ${palette.accent}`, display: 'grid', placeItems: 'center', boxShadow: `0 0 50px ${palette.accent}22` }}>
            <div style={{ color: palette.text, fontSize: 24, fontWeight: 800, textAlign: 'center', lineHeight: 1.15 }}>
              agent<br />loop
            </div>
          </div>

          <div style={{ position: 'absolute', right: 0, top: 48, display: 'grid', gap: 56 }}>
            {['CLI', 'web app', 'Slack'].map((sub) => (
              <div key={sub} style={{ width: 150, padding: '14px 16px', borderRadius: 14, background: palette.surfaceHi, border: `1px solid ${palette.borderBright}`, color: palette.textSoft, fontSize: 20, textAlign: 'center' }}>
                {sub}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>

    <Footer index={7} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 08 — Transition into mechanics
// ════════════════════════════════════════════════════════════════════════════
const HowItWorks: Page = () => (
  <Stage padding="0 120px">
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 70 }}>
      <div style={{ textAlign: 'center' }}>
        <Eyebrow>Okay</Eyebrow>
        <h1
          style={{
            fontFamily: font.display,
            fontSize: display.beat,
            fontWeight: 900,
            lineHeight: 0.98,
            letterSpacing: '-0.035em',
            margin: 0,
          }}
        >
          Cool — so <span style={{ color: palette.accent }}>how does it work?</span>
        </h1>
      </div>
    </div>

    <Footer index={8} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 09 — Subscribe API
// ════════════════════════════════════════════════════════════════════════════
const SubscribeObserve: Page = () => (
  <Stage padding="0 120px">
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 70 }}>
      <Eyebrow>The API</Eyebrow>
      <SectionTitle
        maxWidth={1180}
        title={
          <>
            First: <span style={{ color: palette.accent }}>observe the loop.</span>
          </>
        }
      />
      <SubTitle maxWidth={1040}>
        subscribeToThread gives every client the same live view of the agent loop.
      </SubTitle>

      <div style={{ marginTop: 46, display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 32, alignItems: 'stretch' }}>
        <CodeBlock
          label="observe"
          code={`const sub = await agent.subscribeToThread({
  resourceId,
  threadId,
});

for await (const chunk of sub.stream) {
  render(chunk);
}`}
        />
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderLeft: `3px solid ${palette.accent}`,
            borderRadius: 14,
            padding: '24px 28px',
            fontFamily: font.mono,
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            gap: 20,
          }}
        >
          <div style={{ color: palette.accent, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            stream fan-out
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1.1fr', gap: 18, alignItems: 'center' }}>
            <div style={{ display: 'grid', gap: 14 }}>
              {['terminal', 'web app', 'slack bot'].map((client) => (
                <div key={client} style={{ padding: '14px 16px', borderRadius: 10, background: palette.surfaceHi, border: `1px solid ${palette.borderBright}`, color: palette.text, fontSize: 17 }}>
                  &lt;{client} /&gt;
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', justifyItems: 'center', gap: 10, color: palette.accent, fontSize: 22 }}>
              <div>↖</div>
              <div>←</div>
              <div>↙</div>
            </div>
            <div style={{ padding: '22px 20px', borderRadius: 12, background: 'rgba(24,251,111,0.08)', border: `1px solid ${palette.accent}`, color: palette.text }}>
              <div style={{ color: palette.accent, fontSize: 18, marginBottom: 12 }}>&lt;agent-stream&gt;</div>
              <div style={{ color: palette.textSoft, fontSize: 16, lineHeight: 1.5 }}>
                tokens<br />tool events<br />signals<br />state updates
              </div>
              <div style={{ color: palette.accent, fontSize: 18, marginTop: 12 }}>&lt;/agent-stream&gt;</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer index={9} />
  </Stage>
);

const SendNow: Page = () => (
  <Stage padding="0 120px">
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 70 }}>
      <Eyebrow>The API</Eyebrow>
      <SectionTitle
        maxWidth={1180}
        title={
          <>
            Then: <span style={{ color: palette.blue }}>send into it.</span>
          </>
        }
      />
      <SubTitle maxWidth={1040}>
        sendMessage adds input to the thread so the agent can receive new context.
      </SubTitle>

      <div style={{ marginTop: 46, display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 32, alignItems: 'stretch' }}>
        <CodeBlock
          label="send now"
          accent={palette.blue}
          code={`await agent.sendMessage(
  "Also check the tests,"
  { resourceId, threadId }
);`}
        />
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderLeft: `3px solid ${palette.blue}`,
            borderRadius: 14,
            padding: '24px 28px',
            fontFamily: font.mono,
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            gap: 20,
          }}
        >
          <div style={{ color: palette.blue, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            one client sends
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1.1fr', gap: 18, alignItems: 'center' }}>
            <div style={{ display: 'grid', gap: 14 }}>
              {['terminal', 'web app', 'slack bot'].map((client) => {
                const active = client === 'terminal';
                return (
                  <div
                    key={client}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 10,
                      background: active ? 'rgba(24,251,111,0.10)' : palette.surfaceHi,
                      border: `1px solid ${active ? palette.accent : palette.borderBright}`,
                      color: active ? palette.accent : palette.textSoft,
                      fontSize: 17,
                    }}
                  >
                    &lt;{client} /&gt;
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'grid', justifyItems: 'center', gap: 10, fontSize: 22 }}>
              <div style={{ color: palette.accent }}>↘</div>
              <div style={{ color: palette.dim }}>·</div>
              <div style={{ color: palette.dim }}>·</div>
            </div>
            <div style={{ padding: '22px 20px', borderRadius: 12, background: 'rgba(106,168,255,0.08)', border: `1px solid ${palette.blue}`, color: palette.text }}>
              <div style={{ color: palette.blue, fontSize: 18, marginBottom: 12 }}>&lt;agent-stream&gt;</div>
              <div style={{ color: palette.textSoft, fontSize: 16, lineHeight: 1.5 }}>
                active run<br />new user input<br />next model step
              </div>
              <div style={{ color: palette.blue, fontSize: 18, marginTop: 12 }}>&lt;/agent-stream&gt;</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer index={10} />
  </Stage>
);

const QueueNext: Page = () => (
  <Stage padding="0 120px">
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 70 }}>
      <Eyebrow>The API</Eyebrow>
      <SectionTitle
        maxWidth={1180}
        title={
          <>
            Or: <span style={{ color: palette.accent }}>queue the next turn.</span>
          </>
        }
      />
      <SubTitle maxWidth={1040}>
        queueMessage preserves order when the loop is already active.
      </SubTitle>

      <div style={{ marginTop: 46, display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 32, alignItems: 'stretch' }}>
        <CodeBlock
          label="queue next"
          accent={palette.amber}
          code={`await agent.queueMessage(
  "Also check the tests,"
  { resourceId, threadId }
);`}
        />
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderLeft: `3px solid ${palette.amber}`,
            borderRadius: 14,
            padding: '24px 28px',
            fontFamily: font.mono,
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            gap: 20,
          }}
        >
          <div style={{ color: palette.amber, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            another client queues
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1.1fr', gap: 18, alignItems: 'center' }}>
            <div style={{ display: 'grid', gap: 14 }}>
              {['terminal', 'web app', 'slack bot'].map((client) => {
                const active = client === 'web app';
                return (
                  <div
                    key={client}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 10,
                      background: active ? 'rgba(227,183,88,0.10)' : palette.surfaceHi,
                      border: `1px solid ${active ? palette.amber : palette.borderBright}`,
                      color: active ? palette.amber : palette.textSoft,
                      fontSize: 17,
                    }}
                  >
                    &lt;{client} /&gt;
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'grid', justifyItems: 'center', gap: 10, fontSize: 22 }}>
              <div style={{ color: palette.dim }}>·</div>
              <div style={{ color: palette.amber }}>→</div>
              <div style={{ color: palette.dim }}>·</div>
            </div>
            <div style={{ padding: '22px 20px', borderRadius: 12, background: 'rgba(227,183,88,0.08)', border: `1px solid ${palette.amber}`, color: palette.text }}>
              <div style={{ color: palette.amber, fontSize: 18, marginBottom: 12 }}>&lt;queued-turn&gt;</div>
              <div style={{ color: palette.textSoft, fontSize: 16, lineHeight: 1.5 }}>
                waits in order<br />runs after current step<br />preserves sequence
              </div>
              <div style={{ color: palette.amber, fontSize: 18, marginTop: 12 }}>&lt;/queued-turn&gt;</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer index={11} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 12 — Transition into demo
// ════════════════════════════════════════════════════════════════════════════
const SeeItInAction: Page = () => (
  <Stage padding="0 120px">
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 70 }}>
      <div style={{ textAlign: 'center' }}>
        <Eyebrow>Demo</Eyebrow>
        <h1
          style={{
            fontFamily: font.display,
            fontSize: display.beat,
            fontWeight: 900,
            lineHeight: 0.98,
            letterSpacing: '-0.035em',
            margin: 0,
          }}
        >
          Let’s see it <span style={{ color: palette.accent }}>in action.</span>
        </h1>
      </div>
    </div>

    <Footer index={12} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 13 — Bridge back from live demo
// ════════════════════════════════════════════════════════════════════════════
const BeyondMultiplayer: Page = () => (
  <Stage padding="0 120px">
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 70 }}>
      <div style={{ textAlign: 'center', maxWidth: 1440 }}>
        <div
          style={{
            fontFamily: font.display,
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.035em',
            color: palette.text,
            marginBottom: 24,
          }}
        >
          Signals give you <span style={{ color: palette.accent }}>multiplayer</span> and <span style={{ color: palette.accent }}>steering</span>.
        </div>
        <div style={{ fontSize: 34, color: palette.text, fontWeight: 800, lineHeight: 1.25, marginBottom: 54 }}>
          But they can do a lot more.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, textAlign: 'left' }}>
          {[
            { label: 'Reactive', desc: 'Guide the running agent with processor-generated context.', accent: palette.accent },
            { label: 'State', desc: 'Keep dynamic system context fresh with snapshots and deltas.', accent: palette.amber },
            { label: 'Notification', desc: 'Wake or update the agent from external systems.', accent: palette.blue },
          ].map((type) => (
            <div key={type.label} style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderTop: `4px solid ${type.accent}`, borderRadius: 14, padding: '28px 30px' }}>
              <div style={{ fontFamily: font.mono, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', color: type.accent, marginBottom: 14 }}>
                {type.label}
              </div>
              <div style={{ fontSize: 21, lineHeight: 1.38, color: palette.textSoft }}>
                {type.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <Footer index={13} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 14 — Reactive signal in Mastra Code TUI
// ════════════════════════════════════════════════════════════════════════════
const ReactiveDemo: Page = () => (
  <Stage>
    <Eyebrow>Section 3 · Reactive Signals</Eyebrow>
    <SectionTitle
      title={
        <>
          Reactive guidance, <span style={{ color: palette.accent }}>visible in the loop.</span>
        </>
      }
    />

    <div style={{ marginTop: 34, display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 28, alignItems: 'stretch' }}>
      <CodeBlock
        label="processor hook"
        code={`class AgentsMdProcessor {
  async processInputStep({ messageList, sendSignal }) {
    const dir = findTouchedDirectory(messageList);
    const instructions = await readNestedAgentsMd(dir);

    if (instructions) {
      await sendSignal({
        type: "reactive",
        tagName: "agents-md",
        contents: instructions,
      });
    }
  }
}`}
      />

      {/* TUI simulation */}
      <div
        style={{
          background: '#050505',
          border: `1px solid ${palette.borderBright}`,
          borderRadius: 10,
          padding: '20px 24px',
          fontFamily: font.mono,
          fontSize: 17,
          lineHeight: 1.7,
        }}
      >
        <div style={{ color: palette.muted, marginBottom: 10 }}>$ mastracode "refactor the billing route"</div>
        <div style={{ color: palette.textSoft }}>▸ Viewing apps/api/billing/route.ts</div>
        <div style={{ color: palette.textSoft }}>▸ Directory contains apps/api/billing/AGENTS.md</div>
        <div style={{ color: palette.textSoft }}>▸ Loading nested instructions...</div>
        <div
          style={{
            marginTop: 12,
            padding: '12px 16px',
            background: palette.surface,
            border: `1px solid ${palette.amber}40`,
            borderLeft: `3px solid ${palette.amber}`,
            borderRadius: 8,
          }}
        >
          <div style={{ color: palette.amber, fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
            ⚡ Reactive Signal · agents-md
          </div>
          <div style={{ color: palette.text, fontSize: 16 }}>
            Use the billing service conventions: validate tenant scope first, then call the ledger adapter.
          </div>
        </div>
        <div style={{ color: palette.textSoft, marginTop: 10 }}>▸ Applying local directory guidance...</div>
        <div style={{ color: palette.accent }}>  ✓ Tenant scope check added before ledger writes</div>
        <div style={{ color: palette.textSoft }}>▸ Editing apps/api/billing/route.ts</div>
        <div style={{ color: palette.accent }}>  ✓ Refactor follows nested AGENTS.md</div>
      </div>
    </div>

    <Footer index={14} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 12 — Section 4: State Signals — snapshot vs delta
// ════════════════════════════════════════════════════════════════════════════
const StateSignals: Page = () => (
  <Stage>
    <Eyebrow>Section 4 · State Signals</Eyebrow>
    <SectionTitle
      title={
        <>
          Dynamic, <span style={{ color: palette.accent }}>cacheable</span> system context.
        </>
      }
    />

    <div style={{ marginTop: 34, display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 28, alignItems: 'stretch' }}>
      <CodeBlock
        label="state processor"
        code={`async computeStateSignal(args) {
  const memory = await getWorkingMemory();
  if (!memory) return;

  if (unchanged(memory) && args.contextWindow.hasSnapshot) {
    return; // skip
  }

  if (args.contextWindow.hasSnapshot) {
    return {
      id: "working-memory",
      mode: "delta",
      contents: diff(memory),
    };
  }
  return {
    id: "working-memory",
    mode: "snapshot",
    contents: memory,
  };
}`}
      />

      <div
        style={{
          background: '#050505',
          border: `1px solid ${palette.borderBright}`,
          borderRadius: 10,
          padding: '20px 24px',
          fontFamily: font.mono,
          fontSize: 17,
          lineHeight: 1.7,
        }}
      >
        <div style={{ color: palette.muted, marginBottom: 14 }}>$ user: remember I prefer concise answers</div>
        <div style={{ color: palette.textSoft }}>▸ working memory changes</div>
        <div
          style={{
            marginTop: 12,
            padding: '12px 16px',
            background: palette.surface,
            border: `1px solid ${palette.amber}40`,
            borderLeft: `3px solid ${palette.amber}`,
            borderRadius: 8,
          }}
        >
          <div style={{ color: palette.amber, fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
            State Signal · delta
          </div>
          <div style={{ color: palette.text, fontSize: 16 }}>+ prefers concise answers</div>
        </div>
        <div style={{ color: palette.textSoft, marginTop: 14 }}>▸ assistant answers briefly</div>
        <div style={{ color: palette.textSoft }}>▸ tool call: search docs</div>
        <div style={{ color: palette.textSoft }}>▸ user asks follow-up</div>
        <div
          style={{
            marginTop: 16,
            padding: '10px 14px',
            background: 'rgba(217,217,217,0.05)',
            border: `1px dashed ${palette.borderBright}`,
            borderRadius: 8,
            color: palette.text,
            fontSize: 15,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Later · context window rewritten
        </div>
        <div style={{ color: palette.textSoft, marginTop: 10 }}>▸ previous snapshot is no longer present</div>
        <div
          style={{
            marginTop: 12,
            padding: '12px 16px',
            background: palette.surface,
            border: `1px solid ${palette.accent}40`,
            borderLeft: `3px solid ${palette.accent}`,
            borderRadius: 8,
          }}
        >
          <div style={{ color: palette.accent, fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
            State Signal · snapshot
          </div>
          <div style={{ color: palette.text, fontSize: 16 }}>
            # Working Memory<br />- Communication: concise answers<br />- Topic: Mastra docs
          </div>
        </div>
      </div>
    </div>

    <Footer index={15} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 14 — Prompt cache beat
// ════════════════════════════════════════════════════════════════════════════
const PromptCache: Page = () => (
  <Stage>
    <Eyebrow>Why this matters</Eyebrow>
    <SectionTitle
      title={
        <>
          State updates are <span style={{ color: palette.accent }}>append-only.</span>
        </>
      }
    />

    <div style={{ marginTop: 34, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'stretch' }}>
      <div
        style={{
          background: '#050505',
          border: `1px solid ${palette.borderBright}`,
          borderRadius: 10,
          padding: '20px 24px',
          fontFamily: font.mono,
          fontSize: 17,
          lineHeight: 1.7,
        }}
      >
        <div style={{ color: palette.rose, fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>
          Without signals
        </div>
        <div style={{ color: palette.textSoft }}>system: You are helpful.</div>
        <div style={{ color: palette.rose }}>system: Working memory = concise answers</div>
        <div style={{ color: palette.textSoft }}>user: follow up on the docs</div>
        <div style={{ color: palette.rose, marginTop: 14 }}>system rewritten again</div>
        <div style={{ color: palette.textSoft }}>assistant: ...</div>
        <div style={{ color: palette.rose, marginTop: 14 }}>✗ prompt prefix changed</div>
        <div style={{ color: palette.rose }}>✗ cache broken</div>
      </div>

      <div
        style={{
          background: '#050505',
          border: `1px solid ${palette.accent}55`,
          borderLeft: `3px solid ${palette.accent}`,
          borderRadius: 10,
          padding: '20px 24px',
          fontFamily: font.mono,
          fontSize: 17,
          lineHeight: 1.7,
        }}
      >
        <div style={{ color: palette.accent, fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>
          With state signals
        </div>
        <div style={{ color: palette.textSoft }}>system: You are helpful.</div>
        <div style={{ color: palette.accent }}>signal: working-memory snapshot</div>
        <div style={{ color: palette.textSoft }}>user: follow up on the docs</div>
        <div style={{ color: palette.amber }}>signal: working-memory delta</div>
        <div style={{ color: palette.textSoft }}>assistant: ...</div>
        <div style={{ color: palette.accent, marginTop: 14 }}>✓ prompt prefix stable</div>
        <div style={{ color: palette.accent }}>✓ cache intact</div>
      </div>
    </div>

    <Footer index={16} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 16 — Section 5: Notification Signals
// ════════════════════════════════════════════════════════════════════════════
const NotificationSignals: Page = () => (
  <Stage>
    <Eyebrow>Section 5 · Notification Signals</Eyebrow>
    <SectionTitle
      title={
        <>
          Wake an agent from <span style={{ color: palette.accent }}>the outside world.</span>
        </>
      }
    />
    <SubTitle>
      GitHub Signals turns subscribed PR activity into notification signals the agent can receive while active — or use to wake from idle.
    </SubTitle>

    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 24, alignItems: 'stretch' }}>
      <div style={{ display: 'grid', gap: 14 }}>
        {[
          { label: 'Subscribe', desc: 'Thread stores owner/repo/PR in GitHub metadata.', accent: palette.purple },
          { label: 'Poll + sync', desc: 'gitcrawl syncs the PR and loads a fresh snapshot.', accent: palette.blue },
          { label: 'Compare cursors', desc: 'CI, review, merge, head SHA, and thread hashes reveal changes.', accent: palette.amber },
          { label: 'Classify', desc: 'Map change → kind, priority, and model-facing summary.', accent: palette.rose },
          { label: 'Notify', desc: 'sendNotificationSignal delivers with dedupe/coalesce keys.', accent: palette.accent },
        ].map((step, i) => (
          <div key={step.label} style={{ display: 'grid', gridTemplateColumns: '42px 1fr', gap: 14, alignItems: 'start', background: palette.surface, border: `1px solid ${palette.border}`, borderLeft: `4px solid ${step.accent}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ width: 28, height: 28, borderRadius: 999, background: `${step.accent}22`, color: step.accent, display: 'grid', placeItems: 'center', fontFamily: font.mono, fontSize: 14, fontWeight: 800 }}>
              {i + 1}
            </div>
            <div>
              <div style={{ fontFamily: font.mono, fontSize: 15, color: step.accent, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 5 }}>
                {step.label}
              </div>
              <div style={{ fontSize: 18, color: palette.textSoft, lineHeight: 1.36 }}>
                {step.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: palette.bg, border: `1px solid ${palette.borderBright}`, borderRadius: 12, padding: '22px 26px', fontFamily: font.mono, fontSize: 17, lineHeight: 1.65 }}>
        <div style={{ color: palette.textSoft }}>▸ Agent: fixing PR #142...</div>
        <div style={{ color: palette.textSoft }}>▸ GitHub Signals: polling subscribed PR</div>
        <div style={{ color: palette.amber }}>▸ Snapshot changed: unresolved review thread</div>
        <div style={{ marginTop: 12, padding: '16px 18px', background: palette.surface, border: `1px solid ${palette.purple}55`, borderLeft: `4px solid ${palette.purple}`, borderRadius: 10 }}>
          <div style={{ color: palette.purple, fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 800, marginBottom: 8 }}>
            notification · github · medium
          </div>
          <div style={{ color: palette.text, fontSize: 18, lineHeight: 1.45 }}>
            mastra-ai/mastra#142 has 1 unresolved review thread
          </div>
          <div style={{ marginTop: 12, color: palette.textSoft, fontSize: 15 }}>
            dedupeKey: github:mastra-ai/mastra#142:&lt;contentHash&gt;<br />
            coalesceKey: github:mastra-ai/mastra#142:pull-request-review-activity
          </div>
        </div>
        <div style={{ color: palette.textSoft, marginTop: 12 }}>▸ Agent: reading review feedback...</div>
        <div style={{ color: palette.accent }}>  ✓ Adjusting implementation mid-run</div>
      </div>
    </div>

    <Footer index={17} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 18 — Recap arc
// ════════════════════════════════════════════════════════════════════════════
const Recap: Page = () => (
  <Stage padding="0 120px">
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 70 }}>
      <Eyebrow>Section 6 · What this unlocks</Eyebrow>
      <SectionTitle
        maxWidth={1120}
        title={
          <>
            The arc: <span style={{ color: palette.accent }}>watch → wake.</span>
          </>
        }
      />

      <div style={{ marginTop: 64, position: 'relative' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 92,
            right: 92,
            top: 54,
            height: 2,
            background: `linear-gradient(90deg, ${palette.accent}66, ${palette.blue}66, ${palette.amber}66, ${palette.purple}66, ${palette.cyan}66)`,
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
          {[
            { icon: '👀', verb: 'Watch', desc: 'subscribeToThread', detail: 'the loop is observable', accent: palette.accent },
            { icon: '💬', verb: 'Talk', desc: 'send / queue', detail: 'the loop is addressable', accent: palette.blue },
            { icon: '🎛️', verb: 'Guide', desc: 'reactive signals', detail: 'processors guide without restart', accent: palette.amber },
            { icon: '🔄', verb: 'Update', desc: 'state signals', detail: 'append-only and cache-preserving', accent: palette.purple },
            { icon: '🌍', verb: 'Wake', desc: 'notification signals', detail: 'external systems reach in', accent: palette.cyan },
          ].map((step, i) => (
            <div key={step.verb} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 108,
                  height: 108,
                  borderRadius: 999,
                  background: `radial-gradient(circle, ${step.accent}22 0%, ${palette.surfaceHi} 72%)`,
                  border: `1px solid ${step.accent}88`,
                  boxShadow: `0 0 42px ${step.accent}18`,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 40,
                  zIndex: 2,
                }}
              >
                {step.icon}
              </div>

              <div
                style={{
                  marginTop: 24,
                  width: '100%',
                  minHeight: 190,
                  background: palette.surface,
                  border: `1px solid ${palette.border}`,
                  borderTop: `4px solid ${step.accent}`,
                  borderRadius: 16,
                  padding: '24px 22px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: font.mono, fontSize: 15, color: palette.muted, marginBottom: 8 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 28, color: step.accent, fontWeight: 850, marginBottom: 14 }}>
                  {step.verb}
                </div>
                <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.text, marginBottom: 12 }}>
                  {step.desc}
                </div>
                <div style={{ fontSize: 17, color: palette.textSoft, lineHeight: 1.35 }}>
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <Footer index={18} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 19 — Close
// ════════════════════════════════════════════════════════════════════════════
const Close: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background:
          `radial-gradient(1100px 600px at 18% 22%, ${palette.accent}1a 0%, transparent 60%),` +
          `radial-gradient(900px 500px at 82% 78%, ${palette.surfaceHi} 0%, transparent 65%)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <Eyebrow>Close</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: display.beat,
          fontWeight: 900,
          lineHeight: 0.98,
          margin: '32px 0 24px',
          letterSpacing: '-0.035em',
          maxWidth: 1620,
        }}
      >
        A running agent needs <span style={{ color: palette.accent }}>more than messages.</span>
      </h1>
      <p style={{ fontSize: 52, color: palette.text, fontStyle: 'italic', fontWeight: 700, maxWidth: 1500, lineHeight: 1.3, marginBottom: 48 }}>
        Signals deliver the rest.
      </p>

      <div style={{ display: 'flex', gap: 28, fontFamily: font.mono, fontSize: 20, marginBottom: 48 }}>
        <span style={{ color: palette.accent }}>mastra.ai</span>
        <span style={{ color: palette.muted }}>·</span>
        <span style={{ color: palette.textSoft }}>github.com/mastra-ai/mastra</span>
        <span style={{ color: palette.muted }}>·</span>
        <span style={{ color: palette.textSoft }}>discord.gg/mastra</span>
      </div>

    </div>
    <Footer index={19} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// Meta + speaker notes
// ════════════════════════════════════════════════════════════════════════════
export const meta: SlideMeta = {
  title: 'Mastra · Signals',
};

export const notes: (string | undefined)[] = [
  // 01 Cover
  `Welcome. This workshop is about Mastra Signals — how you communicate with running agents. We'll go from "why does this exist" through watching, steering, updating state, and waking agents from the outside world. Two live demos in Mastra Code and Playground. The thesis: signals let you watch, talk to, steer, update, and wake a running agent without restarting the loop.`,

  // 02 The Problem — Framing
  `Open with the problem, not the primitive. First-gen agents were chatbots: send a message, stream a response, the turn ends. Request, response, done. That's the shape almost every framework was built around. Show the diagram and let it sit — that's the world we're leaving.`,

  // 03 The Problem — Traits (the diagnosis)
  `So name what changed. The agents we're building now look different — and these properties explain why the old shape stopped fitting. Long-running — they run for minutes or hours, use tools, browse, wait for approvals. World-aware — they watch GitHub, CI, Slack, email; external systems change state while they're alive. Stateful — working memory, browser state, project state, context shifts under them. Multi-user — multiple clients may be observing, sending input, approving tools. Goal-seeking — a /goal loop self-continues across runs until a stop-condition is met. Multi-channel — one agent reachable from terminal, web, Slack, CI, not a single stream.`,

  // 04 Not a chat message — the symptoms
  `Here's where those properties show up. The only universal interface was appending a chat message. But the things an agent needs to know about aren't conversations. Browser tab changed. Working memory updated. PR has failing CI. New PR comments arrived. A heartbeat or cron tick fired. A new email came in. These are types of information, not chat turns — and request/response has nowhere to put them.`,

  // 05 Strategic Framing — introducing signals
  `This is the reveal. We built Signals to fill that gap. A signal is a way to send context into an active or idle agent, delivered right into the loop as it runs. The loop has normal steps, but signals can enter from the side: Slack, AGENTS.md, working memory, user steering. Don't enumerate signal types yet — just name the primitive and what it's for.`,

  // 06 Coupled delivery
  `Before Signals, streaming and context delivery were tightly coupled. The stream was the visible output channel, but it also became the place people tried to smuggle dynamic context. Use the HTML-ish diagram: output tokens and context updates all ride inside the same agent-stream. That's the old shape we're breaking apart.`,

  // 07 Decoupled delivery
  `Signals create a second lane. The output stream keeps doing output. Context gets delivered through a signal channel into the active or idle agent loop. This is the conceptual payoff: context delivery no longer has to pretend to be a chat message, a token, or a restart. End Section 1 here.`,


  // 08 Transition
  `Pause here. We have the why and the mental model: old request-shaped loops, then a separate signal lane. Now pivot into the mechanics with a light question: cool, so how does it work?`,

  // 09 Observe API
  `First handle: observe the loop. subscribeToThread makes the running agent visible to any client with the resource and thread. This is not about sending more context yet — just establishing that the loop is observable while it runs. Live demo cue: jump out and show multiple clients watching the same running thread.`,

  // 10 Send API
  `Second handle: send into the loop. sendMessage lets another client add context while the agent is active. This is the simplest form of talking to the live loop: one client sends, the agent receives it without a restart. Live demo cue: send a correction or extra instruction while the agent is working.`,

  // 11 Queue API
  `Third handle: queue the next turn. queueMessage preserves order when the loop is already active, so follow-up context waits its turn instead of interrupting the current step. Live demo cue: queue a second instruction and show it runs after the active step.`,

  // 12 Transition
  `Pause after the mechanics. We have the three handles — observe, send, queue. Now shift from API shape into a concrete live loop: let’s see it in action.`,

  // 13 Bridge
  `After the live demo, bring the room back to the bigger idea. The first payoff was multiplayer observation and steering: multiple clients can watch, send, and queue into a live loop. Now widen the frame — the same signal mechanism also carries reactive guidance, dynamic state, and external notifications.`,

  // 14 Reactive Demo
  `Section 3. Reactive signals are agent-facing guidance, not UI commands. The code on the left is the processor hook: processInputStep receives messageList and sendSignal, notices that the agent viewed or edited a file inside a directory with a nested AGENTS.md, and emits those local instructions as a reactive signal. The history on the right shows the effect: directory-specific guidance reaches the running agent mid-run without restarting. Live demo cue: open or edit a file under a nested AGENTS.md and show Mastra Code autoloading that guidance into the loop.`,

  // 15 State Signals
  `Section 4. State signals are computed by processors, not usually hand-written with sendStateSignal in application code. The left side is a simplified WorkingMemoryStateProcessor: read current working memory, hash it, skip if unchanged, emit a delta when the prior snapshot is still in context, otherwise emit a full snapshot. The right side shows the lifecycle: user teaches the agent a preference, working memory changes, a delta is emitted; later old messages fall out of the context window, so the processor emits a full snapshot to keep the latest state available.`,

  // 16 Prompt Cache
  `This is the technical payoff. Without signals, changing state means rewriting system context over and over; the prompt prefix changes and cache breaks. With state signals, the system prompt stays stable and state arrives as append-only signal messages in conversation history. The side-by-side chats make the contrast concrete: rewritten prompt versus stable prompt plus snapshot/delta messages.`,

  // 17 Notification Signals
  `Section 5. External systems need to notify or wake an agent — idle or active. Use GitHub Signals as the concrete implementation. A thread subscribes to a PR; polling syncs via gitcrawl; the snapshot is compared against stored cursors like CI state, review state hash, mergeability, head SHA, and content hashes; a classifier chooses kind, priority, and summary; then sendNotificationSignal delivers with dedupeKey and coalesceKey. The right side shows the agent receiving that notification mid-run and adjusting without restart.`,

  // 18 Recap
  `Section 6. The arc: watch it (subscribeToThread), talk to it (sendMessage/queueMessage), steer it (reactive signals from processors), update its state (state signals — append-only, cache-preserving), wake it from the world (notification signals — external systems reach in). Five capabilities, one primitive class. The loop stays running through all of them.`,

  // 19 Close
  `Agents are becoming live processes. Signals are how you reach them. What's next: notification vendor integrations (GitHub, Slack, Resend, calendars), state signals as the substrate for all dynamic state, subconscious/background agents delivering updates through signals. Boundaries: not a pub/sub bus, not a replacement for tools/memory/processors, currently requires Mastra memory (resource/thread). Multi-process pub/sub is available but only matters past single-server. Q&A. Resources at mastra.ai, github.com/mastra-ai/mastra, discord.gg/mastra.`,
];

export default [
  Cover,
  Problem_Framing,
  Problem_Traits,
  NotAChatMessage,
  StrategicFraming,
  CoupledDelivery,
  DecoupledDelivery,
  HowItWorks,
  SubscribeObserve,
  SendNow,
  QueueNext,
  SeeItInAction,
  BeyondMultiplayer,
  ReactiveDemo,
  StateSignals,
  PromptCache,
  NotificationSignals,
  Recap,
  Close,
] satisfies Page[];
