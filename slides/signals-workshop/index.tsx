import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

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

const TOTAL = 20;

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

const CodeBlock = ({
  label,
  lines,
  accent = palette.accent,
}: {
  label?: string;
  lines: { text: string; color?: string }[];
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
      <div style={{ color: palette.muted, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
        {label}
      </div>
    )}
    {lines.map((line, i) => (
      <div key={i} style={{ color: line.color || palette.textSoft }}>
        {line.text}
      </div>
    ))}
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

    <Footer index={4} />
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
        { icon: '🔄', label: 'CI failed on main', desc: 'External system needs to wake the agent.', accent: palette.rose },
        { icon: '👀', label: 'PR review requested', desc: 'GitHub activity the agent subscribed to.', accent: palette.amber },
        { icon: '⏰', label: 'Heartbeat / cron', desc: 'A periodic tick wakes an idle agent.', accent: palette.green },
        { icon: '👋', label: 'Another user joined', desc: 'New participant entering the thread.', accent: palette.cyan },
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

    <Footer index={3} />
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

// 04b — Decouple: the conceptual payoff, on its own beat
const Decouple: Page = () => (
  <Stage padding="0 160px">
    <div style={{ ...fill, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Eyebrow>Introducing signals</Eyebrow>
      <div style={{ fontSize: display.beat, lineHeight: 1.1, fontWeight: 700, color: palette.text, letterSpacing: '-0.02em', maxWidth: 1600 }}>
        The agent loop used to own both execution and context delivery.
        <br />
        <span style={{ color: palette.accent }}>Signals decouple those.</span>
      </div>
    </div>

    <Footer index={6} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — Section 2: Watch and talk to a live loop
// ════════════════════════════════════════════════════════════════════════════
const WatchAndTalk: Page = () => (
  <Stage padding="0 120px">
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 70 }}>
      <Eyebrow>Section 2</Eyebrow>
    <SectionTitle
      title={
        <>
          Watch and talk to a <span style={{ color: palette.accent }}>live loop.</span>
        </>
      }
    />
    <SubTitle>
      A long-running agent is active. Another client or user wants to observe it or send input — without
      restarting the interaction.
    </SubTitle>

      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 14,
          padding: '24px 28px',
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
          Before Signals
        </div>
        <ul style={{ margin: 0, paddingLeft: 22, fontSize: 20, color: palette.textSoft, lineHeight: 1.6 }}>
          <li>Restart the interaction to inject context</li>
          <li>Poll state externally</li>
          <li>Force traffic through the original stream owner</li>
          <li>Append regular messages — no active-loop semantics</li>
        </ul>
      </div>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderLeft: `3px solid ${palette.accent}`,
          borderRadius: 14,
          padding: '24px 28px',
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
          With Signals
        </div>
        <ul style={{ margin: 0, paddingLeft: 22, fontSize: 20, color: palette.textSoft, lineHeight: 1.6 }}>
          <li>Subscribe to the thread and watch it live</li>
          <li>Send or queue messages while the loop runs</li>
          <li>Active vs idle delivery — the loop decides</li>
          <li>Multiple clients, one agent, no restart</li>
        </ul>
      </div>
      </div>
    </div>

    <Footer index={7} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 06 — Subscribe + Send API
// ════════════════════════════════════════════════════════════════════════════
const SubscribeSend: Page = () => (
  <Stage>
    <Eyebrow>The API</Eyebrow>
    <SectionTitle
      title={
        <>
          Make the loop <span style={{ color: palette.accent }}>observable</span> and{' '}
          <span style={{ color: palette.accent }}>addressable.</span>
        </>
      }
    />

    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <CodeBlock
        label="subscribe + watch"
        lines={[
          { text: 'const sub = await agent.subscribeToThread({', color: palette.muted },
          { text: '  resourceId, threadId,', color: palette.textSoft },
          { text: '});', color: palette.muted },
          { text: '' },
          { text: 'for await (const chunk of sub.stream) {', color: palette.muted },
          { text: '  render(chunk); // live updates', color: palette.textSoft },
          { text: '}', color: palette.muted },
        ]}
      />
      <CodeBlock
        label="send while running"
        accent={palette.blue}
        lines={[
          { text: 'await agent.sendMessage(', color: palette.muted },
          { text: '  "Also check the tests,",', color: palette.textSoft },
          { text: '  { resourceId, threadId,', color: palette.muted },
          { text: '    ifActive: "queue",', color: palette.blue },
          { text: '    ifIdle: "stream",', color: palette.blue },
          { text: '  }', color: palette.muted },
          { text: ');', color: palette.muted },
        ]}
      />
    </div>

    <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
      <Pill label="subscribeToThread" desc="Returns a subscription with .stream for live observation." accent={palette.accent} />
      <Pill label="sendMessage" desc="Deliver input. ifActive / ifIdle control delivery semantics." accent={palette.blue} />
      <Pill label="queueMessage" desc="Preserve turn order — messages arrive in sequence." accent={palette.purple} />
    </div>

    <Footer index={8} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 07 — Tool Approval sidebar
// ════════════════════════════════════════════════════════════════════════════
const ToolApproval: Page = () => (
  <Stage padding="0 120px">
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 70 }}>
      <Eyebrow>Sidebar · control plane</Eyebrow>
    <SectionTitle
      title={
        <>
          Tool approval rides the <span style={{ color: palette.accent }}>same path.</span>
        </>
      }
    />
    <SubTitle>
      Tool approvals are control-plane input over the subscription — not a separate signal type. The same
      subscribe/send plumbing handles them.
    </SubTitle>

      <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: '20px 24px', fontFamily: font.mono, fontSize: 18, color: palette.textSoft, textAlign: 'center', minWidth: 200 }}>
        agent calls tool
      </div>
      <Arrow />
      <div style={{ background: palette.surfaceHi2, border: `1px dashed ${palette.borderBright}`, borderRadius: 12, padding: '20px 24px', flex: 1, textAlign: 'center' }}>
        <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.muted, marginBottom: 8 }}>subscription delivers</div>
        <div style={{ fontFamily: font.mono, fontSize: 18, color: palette.amber }}>pending tool call → client</div>
      </div>
      <Arrow />
      <div style={{ background: palette.surface, border: `1px solid ${palette.accent}`, borderRadius: 12, padding: '20px 24px', fontFamily: font.mono, fontSize: 18, color: palette.accent, textAlign: 'center', minWidth: 200 }}>
        approve / decline
      </div>
    </div>

      <div style={{ marginTop: 28, display: 'flex', gap: 20 }}>
      <Pill label="approveToolCall" desc="Resume the loop — tool executes, agent continues." accent={palette.accent} />
      <Pill label="declineToolCall" desc="Stop the tool — agent gets feedback and adapts." accent={palette.rose} />
    </div>

      <div style={{ marginTop: 24, fontSize: 22, color: palette.textSoft, lineHeight: 1.45, maxWidth: 1500 }}>
      The subscription path is the control plane. Observing, sending, and approving all flow through it —
      one channel, multiple interaction types.
      </div>
    </div>

    <Footer index={9} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 08 — Demo A intro: Live PR Agent in Mastra Code
// ════════════════════════════════════════════════════════════════════════════
const DemoA: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(900px 500px at 50% 50%, ${palette.accent}12 0%, transparent 60%)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <Eyebrow color={palette.accent}>Demo A · Mastra Code</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: display.beat,
          fontWeight: 900,
          lineHeight: 1.02,
          margin: '28px 0 24px',
          letterSpacing: '-0.035em',
          maxWidth: 1600,
        }}
      >
        A live PR agent that <span style={{ color: palette.accent }}>keeps working</span> while context arrives.
      </h1>
      <p style={{ fontSize: display.sub, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.42, marginBottom: 40 }}>
        Start a real PR task in Mastra Code. Send follow-up steering while the agent is active. Watch reactive
        guidance appear. See a GitHub notification surface mid-run.
      </p>

      <div style={{ display: 'flex', gap: 32 }}>
        {[
          { num: '①', label: 'Subscribe + send', desc: 'Section 2 — talk to the live loop', accent: palette.accent },
          { num: '②', label: 'Reactive guidance', desc: 'Section 3 — processor steers the agent', accent: palette.blue },
          { num: '③', label: 'GitHub notification', desc: 'Section 5 — external world wakes the agent', accent: palette.purple },
        ].map((step) => (
          <div
            key={step.num}
            style={{
              background: palette.surface,
              border: `1px solid ${palette.border}`,
              borderTop: `2px solid ${step.accent}`,
              borderRadius: 14,
              padding: '24px 28px',
              flex: 1,
            }}
          >
            <div style={{ fontSize: 32, color: step.accent, fontWeight: 800, fontFamily: font.mono, marginBottom: 10 }}>{step.num}</div>
            <div style={{ fontSize: 22, color: palette.text, fontWeight: 700, marginBottom: 8 }}>{step.label}</div>
            <div style={{ fontSize: 18, color: palette.textSoft, lineHeight: 1.45 }}>{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
    <Footer index={10} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 09 — Section 3: Steer the loop while it works — Reactive Signals
// ════════════════════════════════════════════════════════════════════════════
const SteerTheLoop: Page = () => (
  <Stage>
    <Eyebrow>Section 3 · Reactive Signals</Eyebrow>
    <SectionTitle
      title={
        <>
          Steer the loop <span style={{ color: palette.accent }}>while it works.</span>
        </>
      }
    />
    <SubTitle>
      The agent is already running. A processor notices relevant context or a risky condition — and injects
      structured guidance without interrupting the loop.
    </SubTitle>

    <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24 }}>
      <CodeBlock
        label="processor hook"
        lines={[
          { text: 'class GuidanceProcessor {', color: palette.muted },
          { text: '  async processInputStep({', color: palette.muted },
          { text: '    messageList,', color: palette.textSoft },
          { text: '    sendSignal,', color: palette.blue },
          { text: '  }) {', color: palette.muted },
          { text: '    if (detectsRisk(messageList)) {', color: palette.textSoft },
          { text: '      await sendSignal({', color: palette.accent },
          { text: '        type: "reactive",', color: palette.accent },
          { text: '        tagName: "safety-hint",', color: palette.accent },
          { text: '        contents: "Verify before', color: palette.accent },
          { text: '          deleting files.",', color: palette.accent },
          { text: '      });', color: palette.muted },
          { text: '    }', color: palette.muted },
          { text: '  }', color: palette.muted },
          { text: '}', color: palette.muted },
        ]}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Insight title="Agent-facing, not UI commands" accent={palette.amber}>
          Reactive signals guide the running agent. They may render in a UI, but their job is to add
          structured context to the loop — not to trigger interface actions.
        </Insight>
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: 14,
            padding: '22px 26px',
          }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
            Before Signals
          </div>
          <ul style={{ margin: 0, paddingLeft: 22, fontSize: 19, color: palette.textSoft, lineHeight: 1.55 }}>
            <li>Mutate the prompt and restart the run</li>
            <li>Hide logic inside tools</li>
            <li>Hope the agent finds context on its own</li>
          </ul>
        </div>
      </div>
    </div>

    <Footer index={11} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 10 — Reactive signal in Mastra Code TUI
// ════════════════════════════════════════════════════════════════════════════
const ReactiveDemo: Page = () => (
  <Stage>
    <Eyebrow>Demo A · continued</Eyebrow>
    <SectionTitle
      title={
        <>
          Reactive guidance, <span style={{ color: palette.accent }}>visible in the loop.</span>
        </>
      }
    />
    <SubTitle>
      In Mastra Code, the agent is working on a PR. A processor detects context and injects a reactive signal —
      the agent adjusts without restarting.
    </SubTitle>

    <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* TUI simulation */}
      <div
        style={{
          background: palette.bg,
          border: `1px solid ${palette.borderBright}`,
          borderRadius: 10,
          padding: '20px 24px',
          fontFamily: font.mono,
          fontSize: 17,
          lineHeight: 1.7,
        }}
      >
        <div style={{ color: palette.muted, marginBottom: 10 }}>$ mastracode "fix the failing test in PR #142"</div>
        <div style={{ color: palette.textSoft }}>▸ Reading test file...</div>
        <div style={{ color: palette.textSoft }}>▸ Running npm test -- --grep "auth"</div>
        <div style={{ color: palette.red }}>  ✗ 3 tests failed</div>
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
            ⚡ Reactive Signal · safety-hint
          </div>
          <div style={{ color: palette.text, fontSize: 16 }}>
            The failing tests are in auth middleware. Check if the JWT secret rotation broke the mock.
          </div>
        </div>
        <div style={{ color: palette.textSoft, marginTop: 10 }}>▸ Reading auth/middleware.ts...</div>
        <div style={{ color: palette.accent }}>  ✓ Found it — mock uses old secret format</div>
        <div style={{ color: palette.textSoft }}>▸ Fixing mock...</div>
        <div style={{ color: palette.accent }}>  ✓ Tests passing</div>
      </div>
    </div>

    <div style={{ marginTop: 22, fontSize: 22, color: palette.textSoft, lineHeight: 1.45 }}>
      The processor injected guidance mid-run. The agent never stopped — it received the signal and adjusted course.
    </div>

    <Footer index={12} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 11 — Section 4: State Signals — snapshot vs delta
// ════════════════════════════════════════════════════════════════════════════
const StateSignals: Page = () => (
  <Stage>
    <Eyebrow>Section 4 · State Signals</Eyebrow>
    <SectionTitle
      title={
        <>
          Keep state fresh <span style={{ color: palette.accent }}>without rewriting the prompt.</span>
        </>
      }
    />
    <SubTitle>
      Working memory, browser state, project state, runtime state — all delivered as append-only state
      updates. The processor decides snapshot vs delta.
    </SubTitle>

    <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
      <CodeBlock
        label="snapshot — full state"
        lines={[
          { text: 'await agent.sendStateSignal({', color: palette.muted },
          { text: '  id: "working-memory",', color: palette.textSoft },
          { text: '  mode: "snapshot",', color: palette.accent },
          { text: '  cacheKey: hash(state),', color: palette.textSoft },
          { text: '  contents: rendered,', color: palette.blue },
          { text: '  value: fullState,', color: palette.purple },
          { text: '}, { resourceId, threadId });', color: palette.muted },
        ]}
      />
      <CodeBlock
        label="delta — just what changed"
        accent={palette.amber}
        lines={[
          { text: 'await agent.sendStateSignal({', color: palette.muted },
          { text: '  id: "working-memory",', color: palette.textSoft },
          { text: '  mode: "delta",', color: palette.amber },
          { text: '  cacheKey: hash(newState),', color: palette.textSoft },
          { text: '  contents: diffText,', color: palette.blue },
          { text: '  delta: changeRecord,', color: palette.purple },
          { text: '}, { resourceId, threadId });', color: palette.muted },
        ]}
      />
    </div>

    <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
      <Pill label="contents" desc="Model-facing rendered text." accent={palette.blue} />
      <Pill label="value" desc="Full structured backing state." accent={palette.purple} />
      <Pill label="delta" desc="Machine-readable change record." accent={palette.amber} />
      <Pill label="cacheKey" desc="Stable identity — skip unchanged state." accent={palette.accent} />
    </div>

    <Footer index={13} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 12 — State processor: computeStateSignal
// ════════════════════════════════════════════════════════════════════════════
const StateProcessor: Page = () => (
  <Stage>
    <Eyebrow>How it works</Eyebrow>
    <SectionTitle
      title={
        <>
          The processor decides <span style={{ color: palette.accent }}>what to emit.</span>
        </>
      }
    />
    <SubTitle>
      <code style={{ fontFamily: font.mono, color: palette.accent }}>computeStateSignal</code> runs each step. It
      compares current state to the last snapshot — and emits a snapshot or a delta.
    </SubTitle>

    <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderTop: `2px solid ${palette.accent}`, borderRadius: 12, padding: '20px 24px', flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: 24, color: palette.text, fontWeight: 700, marginBottom: 6 }}>Step N</div>
        <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.accent }}>computeStateSignal()</div>
      </div>
      <Arrow />
      <div style={{ background: palette.surfaceHi2, border: `1px dashed ${palette.borderBright}`, borderRadius: 12, padding: '20px 24px', flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: 20, color: palette.textSoft, marginBottom: 8 }}>Compare to last snapshot</div>
        <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.muted }}>cacheKey match?</div>
      </div>
      <Arrow />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: palette.surface, border: `1px solid ${palette.accent}40`, borderRadius: 10, padding: '14px 20px', fontFamily: font.mono, fontSize: 16, color: palette.accent }}>
          ✓ unchanged → skip
        </div>
        <div style={{ background: palette.surface, border: `1px solid ${palette.amber}40`, borderRadius: 10, padding: '14px 20px', fontFamily: font.mono, fontSize: 16, color: palette.amber }}>
          → delta (just the change)
        </div>
        <div style={{ background: palette.surface, border: `1px solid ${palette.blue}40`, borderRadius: 10, padding: '14px 20px', fontFamily: font.mono, fontSize: 16, color: palette.blue }}>
          → snapshot (full state)
        </div>
      </div>
    </div>

    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 14, padding: '22px 26px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
          Working Memory is one use case
        </div>
        <div style={{ fontSize: 19, color: palette.textSoft, lineHeight: 1.5 }}>
          Browser state, project state, org state, runtime state — all use the same delivery mechanism. State
          Signals are the substrate; working memory is one consumer.
        </div>
      </div>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 14, padding: '22px 26px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
          Before Signals
        </div>
        <div style={{ fontSize: 19, color: palette.textSoft, lineHeight: 1.5 }}>
          Rewrite system instructions every turn → break prompt cache, lose chronology, or stuff state into
          normal messages and hope the model treats it differently.
        </div>
      </div>
    </div>

    <Footer index={14} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 13 — Prompt cache beat
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
    <SubTitle>
      Signals are added to conversation history in order. Changing state stays append-only — so prompt cache
      is preserved.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Before: rewriting prompt */}
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 14,
          padding: '24px 28px',
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.rose, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
          Without Signals — rewrite every turn
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.mono, fontSize: 17 }}>
          <span style={{ color: palette.muted }}>system prompt</span>
          <span style={{ color: palette.rose }}>✗ rewritten</span>
          <Arrow />
          <span style={{ color: palette.muted }}>LLM</span>
          <Arrow />
          <span style={{ color: palette.muted }}>turn 2</span>
          <Arrow />
          <span style={{ color: palette.rose }}>✗ rewritten again</span>
          <Arrow />
          <span style={{ color: palette.muted }}>cache broken</span>
        </div>
      </div>

      {/* After: append-only */}
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderLeft: `3px solid ${palette.accent}`,
          borderRadius: 14,
          padding: '24px 28px',
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
          With Signals — append-only history
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.mono, fontSize: 17 }}>
          <span style={{ color: palette.muted }}>system prompt</span>
          <span style={{ color: palette.accent }}>✓ stable</span>
          <Arrow />
          <span style={{ color: palette.blue }}>signal: snapshot</span>
          <Arrow />
          <span style={{ color: palette.amber }}>signal: delta</span>
          <Arrow />
          <span style={{ color: palette.amber }}>signal: delta</span>
          <Arrow />
          <span style={{ color: palette.accent }}>cache intact ✓</span>
        </div>
      </div>
    </div>

    <div style={{ marginTop: 28, fontSize: 24, color: palette.text, fontWeight: 600, lineHeight: 1.45, maxWidth: 1500 }}>
      Dynamic system guidance without rewriting the prompt or destroying prompt cache.
    </div>

    <Footer index={15} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 14 — Demo B: Working Memory state signal in Playground
// ════════════════════════════════════════════════════════════════════════════
const DemoB: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(900px 500px at 50% 50%, ${palette.blue}10 0%, transparent 60%)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <Eyebrow color={palette.blue}>Demo B · Playground</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: display.beat,
          fontWeight: 900,
          lineHeight: 1.02,
          margin: '28px 0 24px',
          letterSpacing: '-0.035em',
          maxWidth: 1600,
        }}
      >
        Working Memory as a <span style={{ color: palette.blue }}>State Signal.</span>
      </h1>
      <p style={{ fontSize: display.sub, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.42, marginBottom: 40 }}>
        Ask the agent to remember a preference. Watch the state signal render in Playground. Update the
        preference — see snapshot vs delta in the conversation history.
      </p>

      <div style={{ display: 'flex', gap: 28 }}>
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderTop: `2px solid ${palette.blue}`,
            borderRadius: 14,
            padding: '24px 28px',
            flex: 1,
          }}
        >
          <div style={{ fontSize: 28, color: palette.blue, fontWeight: 800, fontFamily: font.mono, marginBottom: 12 }}>①</div>
          <div style={{ fontSize: 22, color: palette.text, fontWeight: 700, marginBottom: 8 }}>Remember a preference</div>
          <div style={{ fontSize: 18, color: palette.textSoft, lineHeight: 1.45 }}>"Always use TypeScript, never JavaScript."</div>
        </div>
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderTop: `2px solid ${palette.accent}`,
            borderRadius: 14,
            padding: '24px 28px',
            flex: 1,
          }}
        >
          <div style={{ fontSize: 28, color: palette.accent, fontWeight: 800, fontFamily: font.mono, marginBottom: 12 }}>②</div>
          <div style={{ fontSize: 22, color: palette.text, fontWeight: 700, marginBottom: 8 }}>State signal renders</div>
          <div style={{ fontSize: 18, color: palette.textSoft, lineHeight: 1.45 }}>First delivery is a snapshot — full working memory state appears in the stream.</div>
        </div>
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderTop: `2px solid ${palette.amber}`,
            borderRadius: 14,
            padding: '24px 28px',
            flex: 1,
          }}
        >
          <div style={{ fontSize: 28, color: palette.amber, fontWeight: 800, fontFamily: font.mono, marginBottom: 12 }}>③</div>
          <div style={{ fontSize: 22, color: palette.text, fontWeight: 700, marginBottom: 8 }}>Update → delta</div>
          <div style={{ fontSize: 18, color: palette.textSoft, lineHeight: 1.45 }}>Next change emits only the diff — append-only, cache preserved.</div>
        </div>
      </div>
    </div>
    <Footer index={16} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 15 — Section 5: Notification Signals
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
      External systems need to notify or wake an agent — idle or active. Notification signals carry delivery
      policy, priority, dedupe, and coalescing.
    </SubTitle>

    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
      <CodeBlock
        label="send a notification signal"
        accent={palette.purple}
        lines={[
          { text: 'await agent.sendNotificationSignal({', color: palette.muted },
          { text: '  source: "github",', color: palette.purple },
          { text: '  kind: "ci-status",', color: palette.purple },
          { text: '  priority: "high",', color: palette.rose },
          { text: '  summary: "CI failed on main', color: palette.blue },
          { text: '    — tests/auth.spec.ts",', color: palette.blue },
          { text: '  dedupeKey: "github:repo#42', color: palette.textSoft },
          { text: '    :ci:main:a1b2c3",', color: palette.textSoft },
          { text: '  coalesceKey: "github:repo#42', color: palette.textSoft },
          { text: '    :ci-status",', color: palette.textSoft },
          { text: '}, { resourceId, threadId });', color: palette.muted },
        ]}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Pill label="source" desc="Who sent it — github, slack, resend." accent={palette.purple} />
        <Pill label="summary" desc="Model-facing text — what the agent sees." accent={palette.blue} />
        <Pill label="dedupeKey" desc="Exact event identity — skip duplicates." accent={palette.accent} />
        <Pill label="coalesceKey" desc="Group noisy related events into one." accent={palette.amber} />
      </div>
    </div>

    <div style={{ marginTop: 22, fontSize: 22, color: palette.textSoft, lineHeight: 1.45, maxWidth: 1500 }}>
      Signals don't require the agent to be running. <span style={{ color: palette.accent, fontWeight: 600 }}>Idle delivery wakes the loop; active delivery joins it mid-flight.</span>
    </div>

    <Footer index={17} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 16 — Demo A final: GitHub notification in Mastra Code
// ════════════════════════════════════════════════════════════════════════════
const NotificationDemo: Page = () => (
  <Stage>
    <Eyebrow>Demo A · final act</Eyebrow>
    <SectionTitle
      title={
        <>
          GitHub wakes the agent <span style={{ color: palette.accent }}>mid-run.</span>
        </>
      }
    />
    <SubTitle>
      The agent is working on the PR. GitHub Signals polls for activity, detects a new comment, and delivers a
      notification signal — without the agent asking.
    </SubTitle>

    <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          background: palette.bg,
          border: `1px solid ${palette.borderBright}`,
          borderRadius: 10,
          padding: '18px 24px',
          fontFamily: font.mono,
          fontSize: 16,
          lineHeight: 1.7,
        }}
      >
        <div style={{ color: palette.textSoft }}>▸ Agent: fixing test in auth/middleware.ts...</div>
        <div style={{ color: palette.textSoft }}>▸ Agent: running npm test...</div>
        <div
          style={{
            marginTop: 10,
            padding: '14px 18px',
            background: palette.surface,
            border: `1px solid ${palette.purple}50`,
            borderLeft: `3px solid ${palette.purple}`,
            borderRadius: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ color: palette.purple, fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
              🔔 Notification · github · high
            </span>
          </div>
          <div style={{ color: palette.text, fontSize: 16 }}>
            New review comment on PR #142: "This mock won't work with the rotated secret."
          </div>
        </div>
        <div style={{ color: palette.textSoft, marginTop: 10 }}>▸ Agent: adjusting approach based on review feedback...</div>
        <div style={{ color: palette.accent }}>  ✓ Updated mock to use rotation-compatible format</div>
      </div>
    </div>

    <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: '20px 24px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.purple, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
          What just happened
        </div>
        <div style={{ fontSize: 19, color: palette.textSoft, lineHeight: 1.5 }}>
          GitHub Signals polled, detected a new comment, classified it, and delivered a notification signal —
          all while the agent kept working.
        </div>
      </div>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: '20px 24px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.accent, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
          The unlock
        </div>
        <div style={{ fontSize: 19, color: palette.textSoft, lineHeight: 1.5 }}>
          Agents become world-aware processes — not just chat responders. External systems reach in without
          restarts, custom side channels, or noisy messages.
        </div>
      </div>
    </div>

    <Footer index={18} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 17 — Recap arc
// ════════════════════════════════════════════════════════════════════════════
const Recap: Page = () => (
  <Stage padding="0 120px">
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 70 }}>
      <Eyebrow>Section 6 · What this unlocks</Eyebrow>
    <SectionTitle
      title={
        <>
          The arc: <span style={{ color: palette.accent }}>watch → wake.</span>
        </>
      }
    />

      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[
        { icon: '👀', verb: 'Watch it', desc: 'subscribeToThread — the loop is observable', accent: palette.accent },
        { icon: '💬', verb: 'Talk to it', desc: 'sendMessage / queueMessage — the loop is addressable', accent: palette.blue },
        { icon: '🎛️', verb: 'Steer it', desc: 'Reactive signals — processors guide without restart', accent: palette.amber },
        { icon: '🔄', verb: 'Update its state', desc: 'State signals — append-only, cache-preserving', accent: palette.purple },
        { icon: '🌍', verb: 'Wake it from the world', desc: 'Notification signals — external systems reach in', accent: palette.cyan },
      ].map((step, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderLeft: `4px solid ${step.accent}`,
            borderRadius: 14,
            padding: '20px 28px',
          }}
        >
          <span style={{ fontSize: 32 }}>{step.icon}</span>
          <div style={{ fontFamily: font.mono, fontSize: 24, color: step.accent, fontWeight: 700, minWidth: 280 }}>{step.verb}</div>
          <div style={{ fontSize: 20, color: palette.textSoft, flex: 1 }}>{step.desc}</div>
        </div>
      ))}
      </div>
    </div>

    <Footer index={19} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 18 — Close
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
        Agents are becoming <span style={{ color: palette.accent }}>live processes.</span>
      </h1>
      <p style={{ fontSize: display.sub, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.42, marginBottom: 48 }}>
        Signals are how you reach them.
      </p>

      <div style={{ display: 'flex', gap: 28, fontFamily: font.mono, fontSize: 20, marginBottom: 48 }}>
        <span style={{ color: palette.accent }}>mastra.ai</span>
        <span style={{ color: palette.muted }}>·</span>
        <span style={{ color: palette.textSoft }}>github.com/mastra-ai/mastra</span>
        <span style={{ color: palette.muted }}>·</span>
        <span style={{ color: palette.textSoft }}>discord.gg/mastra</span>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: '18px 24px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
            What's next
          </div>
          <div style={{ fontSize: 19, color: palette.textSoft, lineHeight: 1.45, maxWidth: 600 }}>
            Notification vendor integrations (GitHub, Slack, Resend, calendars). State signals as the substrate
            for working memory, browser, project, org state. Subconscious agents delivering updates through
            signals.
          </div>
        </div>
        <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: '18px 24px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
            Boundaries
          </div>
          <div style={{ fontSize: 19, color: palette.textSoft, lineHeight: 1.45, maxWidth: 600 }}>
            Not a pub/sub bus between arbitrary services. Not a replacement for tools, memory, or processors —
            they complement signals. Currently require Mastra memory (resource/thread).
          </div>
        </div>
      </div>
    </div>
    <Footer index={20} />
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

  // 03 Not a chat message — the symptoms
  `Here's where it breaks. The only universal interface was appending a chat message. But the things an agent needs to know about aren't conversations. Browser tab changed. Working memory updated. CI failed. PR review requested. A heartbeat or cron tick fired. Another user joined. These are types of information, not chat turns — and request/response has nowhere to put them. That's why the old shape stopped fitting.`,

  // 04 The Problem — Traits (the diagnosis)
  `So name what changed. The agents we're building now look different — and these properties are why all that information has nowhere to go. Long-running — they run for minutes or hours, use tools, browse, wait for approvals. World-aware — they watch GitHub, CI, Slack, email; external systems change state while they're alive. Stateful — working memory, browser state, project state, context shifts under them. Multi-user — multiple clients may be observing, sending input, approving tools. Goal-seeking — a /goal loop self-continues across runs until a stop-condition is met. Multi-channel — one agent reachable from terminal, web, Slack, CI, not a single stream. The previous slide was the symptom; this is the diagnosis.`,

  // 05 Strategic Framing — introducing signals
  `This is the reveal. We built Signals to fill that gap. A signal is a way to send context into a running — or idle — agent, without appending another chat message or restarting the loop. The world sends a signal into the live agent loop. The agent loop used to own both execution and context delivery; signals decouple those. Don't enumerate signal types yet — just name the primitive and what it's for. The next sections show the three concrete kinds in use. End Section 1 here.`,

  // 05 Watch and Talk
  `Section 2. User problem: a long-running agent is active, and another client or user wants to watch or send input. Before signals: restart, poll, force traffic through the stream owner, or append messages with no active-loop semantics. With signals: subscribe to the thread, send or queue messages, active vs idle delivery. The loop decides how to handle input based on its state.`,

  // 06 Subscribe + Send API
  `The API shapes. subscribeToThread returns a subscription with .stream for live observation. sendMessage delivers input — ifActive controls what happens when the loop is running (queue, join, skip), ifIdle controls what happens when it's idle (stream, wake, skip). queueMessage preserves turn order. Multiple clients can subscribe and send to the same thread. These are the verified API shapes — note the field is contents, not content.`,

  // 07 Tool Approval
  `Sidebar, not a deep dive. Tool approvals are control-plane input over the same subscription path. The subscription delivers pending tool calls to the client. The client approves or declines. This is NOT a separate signal type — it uses the subscribe/send plumbing. One channel, multiple interaction types. Mention it, then move on.`,

  // 08 Demo A intro
  `Transition to Demo A. We're going to start a real PR task in Mastra Code. While the agent works, we'll send follow-up steering (Section 2), watch reactive guidance appear (Section 3), and see a GitHub notification surface mid-run (Section 5). One cohesive demo that carries three sections. Don't include tool approval unless it happens naturally.`,

  // 09 Steer the Loop
  `Section 3. The agent is already running. A processor notices relevant context or a risky condition and injects a reactive signal. The key correction: reactive signals are agent-facing input, NOT UI commands. They may render in a UI, but their job is to guide the loop. The processor hook is processInputStep — it receives messageList and sendSignal. Before signals: mutate the prompt, restart, hide logic in tools, or hope.`,

  // 10 Reactive Demo
  `Demo A continued. In Mastra Code, the agent is fixing a failing test. It runs the tests, they fail. A processor detects the failure pattern and injects a reactive signal: "Check if JWT secret rotation broke the mock." The agent reads the signal, adjusts, and fixes it — without restarting. The signal rendered visibly in the TUI but its purpose was guiding the agent, not triggering a UI action. Open decisions: the reactive source could be AGENTS.md detection, gh pr guidance, or error recovery — pick whichever feels most natural live.`,

  // 11 State Signals
  `Section 4. The agent needs fresh changing context: working memory, browser state, project state. Before signals: rewrite system instructions every turn — break prompt cache, lose chronology, stuff state into messages. State signals deliver snapshots and deltas as append-only state updates. Working memory is ONE use case — browser, project, org, runtime state all use the same mechanism. The fields: contents is model-facing rendered text, value is full structured backing state, delta is the machine-readable change, cacheKey is the stable identity to skip unchanged state.`,

  // 12 State Processor
  `computeStateSignal runs each step. It compares current state to the last snapshot using cacheKey. If unchanged, skip. If changed and a prior snapshot exists, emit a delta. If no prior snapshot or the snapshot was evicted, emit a full snapshot. The processor decides — the agent code doesn't need to know. Working memory is one use case of this substrate. Before signals: rewrite system instructions every turn and break everything.`,

  // 13 Prompt Cache
  `This is the technical payoff. Without signals: you rewrite the system prompt every turn to inject new state — cache broken, latency added, cost increased. With signals: the system prompt stays stable. State updates are appended to conversation history in order as signal messages — snapshot first, then deltas. The prompt cache sees the same prefix every turn. Dynamic system guidance without rewriting the prompt or destroying cache.`,

  // 14 Demo B
  `Transition to Demo B. In Mastra Code, signals showed up as a product experience — the agent kept working while context arrived from us, from processors, and from GitHub. One of the most important parts of that system is easier to see in isolation: state. Switch to Playground. Ask the agent to remember a preference. Watch the state signal render. Update the preference — see snapshot vs delta. This is the working memory state signal in isolation.`,

  // 15 Notification Signals
  `Section 5. External systems need to notify or wake an agent — idle or active. Notification signals carry source, kind, priority, summary (model-facing), dedupeKey (exact event identity — skip duplicates), coalesceKey (group noisy related events), attributes (routing/filtering), and metadata (system-facing). Signals don't require the agent to be running. Idle delivery wakes the loop. Active delivery joins it mid-flight. Use Mastra Code + GitHub Signals as the concrete example — not hypothetical.`,

  // 16 Notification Demo
  `Demo A final act. The agent is working on the PR. GitHub Signals is polling in the background. It detects a new review comment, classifies it, and delivers a notification signal — all while the agent keeps working. The agent receives the signal, reads the review feedback, and adjusts its approach. No restart, no custom side channel, no noisy chat message. The unlock: agents become world-aware processes, not just chat responders.`,

  // 17 Recap
  `Section 6. The arc: watch it (subscribeToThread), talk to it (sendMessage/queueMessage), steer it (reactive signals from processors), update its state (state signals — append-only, cache-preserving), wake it from the world (notification signals — external systems reach in). Five capabilities, one primitive class. The loop stays running through all of them.`,

  // 18 Close
  `Agents are becoming live processes. Signals are how you reach them. What's next: notification vendor integrations (GitHub, Slack, Resend, calendars), state signals as the substrate for all dynamic state, subconscious/background agents delivering updates through signals. Boundaries: not a pub/sub bus, not a replacement for tools/memory/processors, currently requires Mastra memory (resource/thread). Multi-process pub/sub is available but only matters past single-server. Q&A. Resources at mastra.ai, github.com/mastra-ai/mastra, discord.gg/mastra.`,
];

export default [
  Cover,
  Problem_Framing,
  NotAChatMessage,
  Problem_Traits,
  StrategicFraming,
  Decouple,
  WatchAndTalk,
  SubscribeSend,
  ToolApproval,
  DemoA,
  SteerTheLoop,
  ReactiveDemo,
  StateSignals,
  StateProcessor,
  PromptCache,
  DemoB,
  NotificationSignals,
  NotificationDemo,
  Recap,
  Close,
] satisfies Page[];
