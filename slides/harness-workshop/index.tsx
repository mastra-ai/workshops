import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import abhiAvatar from './assets/abhi-avatar.jpg';

// ─── Design tokens ───────────────────────────────────────────────────────────
// Mastra brand: bg #020202, foreground #d9d9d9, primary #18fb6f.
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

// ─── Atoms ───────────────────────────────────────────────────────────────────
const Eyebrow = ({ children, color = palette.accent }: { children: ReactNode; color?: string }) => (
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

const TOTAL = 17;

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
    <span>MASTRA · AGENT HARNESS</span>
    <span>
      {String(index).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
    </span>
  </div>
);

const Stage = ({ children, padding = '120px 120px 120px' }: { children: ReactNode; padding?: string }) => (
  <div style={{ ...fill, padding, display: 'flex', flexDirection: 'column' }}>{children}</div>
);

const SectionTitle = ({ title }: { title: ReactNode }) => (
  <h1
    style={{
      fontFamily: font.display,
      fontSize: 92,
      fontWeight: 800,
      lineHeight: 1.02,
      letterSpacing: '-0.025em',
      margin: '20px 0 22px',
      maxWidth: 1620,
      color: palette.text,
    }}
  >
    {title}
  </h1>
);

const SubTitle = ({ children }: { children: ReactNode }) => (
  <p style={{ fontSize: 30, color: palette.textSoft, lineHeight: 1.4, maxWidth: 1500, margin: 0 }}>{children}</p>
);

const Pill = ({
  icon,
  label,
  desc,
  accent = palette.accent,
}: {
  icon?: ReactNode;
  label: string;
  desc?: ReactNode;
  accent?: string;
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
      {icon && <span style={{ fontSize: 26 }}>{icon}</span>}
      <span
        style={{
          fontFamily: font.mono,
          fontSize: 16,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: accent,
        }}
      >
        {label}
      </span>
    </div>
    {desc && <div style={{ fontSize: 21, color: palette.textSoft, lineHeight: 1.45 }}>{desc}</div>}
  </div>
);

const Author = ({ name, role, avatar }: { name: string; role: string; avatar?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        border: `2px solid ${palette.accent}`,
        background: palette.surfaceHi,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: font.mono,
        fontSize: 22,
        color: palette.accent,
        flexShrink: 0,
      }}
    >
      {avatar ? (
        <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        name
          .split(' ')
          .map((p) => p[0])
          .join('')
      )}
    </div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: palette.text }}>{name}</div>
      <div style={{ fontSize: 18, color: palette.muted, marginTop: 2 }}>{role}</div>
    </div>
  </div>
);

// ─── Shared building blocks ──────────────────────────────────────────────────
const MonoLabel = ({ children, color = palette.muted }: { children: ReactNode; color?: string }) => (
  <div
    style={{
      fontFamily: font.mono,
      fontSize: 14,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color,
      marginBottom: 14,
    }}
  >
    {children}
  </div>
);

const Card = ({
  accent,
  children,
  style,
}: {
  accent?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      ...(accent ? { borderTop: `2px solid ${accent}` } : null),
      borderRadius: 14,
      padding: '22px 26px',
      ...style,
    }}
  >
    {children}
  </div>
);

const Code = ({ children, color = palette.accent }: { children: ReactNode; color?: string }) => (
  <code style={{ fontFamily: font.mono, fontSize: '0.9em', color }}>{children}</code>
);

// ════════════════════════════════════════════════════════════════════════════
// 01 — Cover
// ════════════════════════════════════════════════════════════════════════════
const Cover: Page = () => (
  <div
    style={{
      ...fill,
      padding: '0 120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
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
          fontSize: 200,
          fontWeight: 900,
          lineHeight: 0.94,
          margin: '36px 0 28px',
          letterSpacing: '-0.045em',
          maxWidth: 1620,
        }}
      >
        Agent <span style={{ color: palette.accent }}>harness.</span>
      </h1>
      <p
        style={{
          fontSize: 38,
          color: palette.textSoft,
          maxWidth: 1500,
          lineHeight: 1.35,
          marginBottom: 56,
        }}
      >
        A tour of the real harness inside <b style={{ color: palette.text }}>MastraCode</b> — the{' '}
        <b style={{ color: palette.text }}>Harness</b>, <b style={{ color: palette.text }}>Session</b>, and{' '}
        run engine that turn an LLM into a steerable, resumable agent.
      </p>

      <div style={{ display: 'flex', gap: 64, marginBottom: 56 }}>
        <Author name="Abhi Aiyer" role="Founder / CTO, Mastra" avatar={abhiAvatar} />
        <Author name="Alex Booker" role="Developer Advocate, Mastra" />
      </div>

      <div style={{ display: 'flex', gap: 28, fontFamily: font.mono, fontSize: 20 }}>
        <span style={{ color: palette.accent }}>mastra.ai</span>
        <span style={{ color: palette.muted }}>·</span>
        <span style={{ color: palette.textSoft }}>github.com/mastra-ai/mastra</span>
        <span style={{ color: palette.muted }}>·</span>
        <span style={{ color: palette.textSoft }}>discord.gg/mastra</span>
      </div>
    </div>
    <Footer index={1} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 02 — "Harness" is everywhere
// ════════════════════════════════════════════════════════════════════════════
const QuoteCard = ({ src, quote, accent }: { src: string; quote: string; accent: string }) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderLeft: `2px solid ${accent}`,
      borderRadius: 14,
      padding: '22px 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent }}>{src}</div>
    <div style={{ fontSize: 22, color: palette.textSoft, lineHeight: 1.4 }}>{quote}</div>
  </div>
);

const Everywhere: Page = () => (
  <Stage>
    <Eyebrow>The word of the year</Eyebrow>
    <SectionTitle
      title={
        <>
          "Harness" is <span style={{ color: palette.accent }}>everywhere.</span>
        </>
      }
    />
    <SubTitle>
      OpenAI, Stripe, Thoughtworks, Anthropic — everyone says "harness" now. The trouble: it means a
      different thing in every sentence. <b style={{ color: palette.text }}>Agent = Model + Harness</b> —
      "everything except the model" — is true but says almost nothing.
    </SubTitle>

    <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
      <QuoteCard
        src="Thoughtworks · Fowler"
        quote="Guides and sensors a team builds around a coding agent — a control system to earn enough trust to supervise less."
        accent={palette.blue}
      />
      <QuoteCard
        src="The plain-English version"
        quote="Everything around the model that grounds it in reality — tools, context, guardrails, a verify step — so a rented black box behaves reliably."
        accent={palette.purple}
      />
      <QuoteCard
        src="Anthropic · Devin"
        quote="The runtime that turns a model into a product — the loop, tools, memory, and recovery behind Claude Code."
        accent={palette.accent}
      />
    </div>

    <div
      style={{
        marginTop: 44,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <span style={{ fontSize: 28 }}>🎯</span>
      <div style={{ fontSize: 24, color: palette.text, lineHeight: 1.4 }}>
        Different words, one job: <b style={{ color: palette.accent }}>reliability</b> — make a
        non-deterministic, rented model do its job anyway. The next slide pins down the two layers and
        where <b style={{ color: palette.accent }}>Mastra</b> sits.
      </div>
    </div>

    <Footer index={2} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 03 — Spectrum: Framework vs Harness
// ════════════════════════════════════════════════════════════════════════════
const Spectrum: Page = () => (
  <Stage>
    <Eyebrow>The big picture</Eyebrow>
    <SectionTitle
      title={
        <>
          Framework vs <span style={{ color: palette.accent }}>harness.</span>
        </>
      }
    />
    <SubTitle>
      Frameworks and harnesses sit at different points on a spectrum of opinionation — and "harness"
      itself splits in two. <b style={{ color: palette.text }}>Mastra is both:</b> it ships the inner
      harness, and gives you the <Code>Harness</Code> class to build the outer one.
    </SubTitle>

    <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      <SpectrumCol
        label="Raw Code"
        title="API calls"
        desc="Call APIs directly. Manage state yourself. Total flexibility, total responsibility."
        accent={palette.muted}
      />
      <SpectrumCol
        label="Framework"
        title="Building blocks"
        desc="Structure & abstractions. You pick memory, configure tools, define orchestration. Modular & swappable."
        accent={palette.blue}
      />
      <SpectrumCol
        label="Harness"
        title="Complete system"
        desc="Sessions, the agent loop, modes, steering, memory, recovery — assembled and wired for you."
        accent={palette.accent}
        highlight
      />
    </div>

    <div
      style={{
        marginTop: 40,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 18,
      }}
    >
      <Card accent={palette.blue} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MonoLabel color={palette.blue}>Inner harness · the agent loop</MonoLabel>
        <div style={{ fontSize: 24, color: palette.text, lineHeight: 1.4 }}>
          The orchestration substrate that makes an agent <b style={{ color: palette.text }}>run</b> —
          the loop, tool execution, memory, retrieval.
        </div>
        <div style={{ fontFamily: font.mono, fontSize: 17, color: palette.muted }}>
          Mastra ships this: the <span style={{ color: palette.blue }}>Agent</span>.
        </div>
      </Card>
      <Card accent={palette.accent} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MonoLabel color={palette.accent}>Outer harness · what you build</MonoLabel>
        <div style={{ fontSize: 24, color: palette.text, lineHeight: 1.4 }}>
          The guides + sensors that make an agent <b style={{ color: palette.text }}>trustworthy</b> —
          modes, steering, approval, sessions, recovery.
        </div>
        <div style={{ fontFamily: font.mono, fontSize: 17, color: palette.muted }}>
          You build this with the <span style={{ color: palette.accent }}>Harness</span> class.
        </div>
      </Card>
    </div>

    <Footer index={3} />
  </Stage>
);

const SpectrumCol = ({
  label,
  title,
  desc,
  accent,
  highlight,
}: {
  label: string;
  title: string;
  desc: string;
  accent: string;
  highlight?: boolean;
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${highlight ? accent : palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 14,
      padding: '24px 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 14, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color: palette.text }}>{title}</div>
    <div style={{ fontSize: 20, color: palette.textSoft, lineHeight: 1.45 }}>{desc}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 04 — The Harness class is purpose-built
// ════════════════════════════════════════════════════════════════════════════
const ProductCard = ({ name, kind, accent }: { name: string; kind: string; accent: string }) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 14,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      minHeight: 124,
    }}
  >
    <div style={{ fontSize: 26, fontWeight: 700, color: palette.text }}>{name}</div>
    <div style={{ fontSize: 19, color: palette.textSoft, lineHeight: 1.4 }}>{kind}</div>
  </div>
);

const PurposeBuilt: Page = () => (
  <Stage>
    <Eyebrow>Why we built it</Eyebrow>
    <SectionTitle
      title={
        <>
          Build your own <span style={{ color: palette.accent }}>Claude Code.</span>
        </>
      }
    />
    <SubTitle>
      Mastra's <Code>Harness</Code> class is purpose-built for the outer harness: it wraps the agent
      loop and gives you the controls — sessions, modes, steering, subagents, recovery — to build
      collaborative and headless agent products.
    </SubTitle>

    <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <ProductCard name="Claude Code" kind="Collaborative coding agent — HITL, modes, tool approval." accent={palette.accent} />
      <ProductCard name="CoWork" kind="A teammate in the loop — steerable, resumable sessions." accent={palette.blue} />
      <ProductCard name="Devin" kind="Autonomous engineer — goal-driven, long-horizon runs." accent={palette.purple} />
      <ProductCard name="Software Factory" kind="Headless agents at scale — recovery + persisted sessions." accent={palette.amber} />
    </div>

    <div
      style={{
        marginTop: 44,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 18,
      }}
    >
      <Card accent={palette.accent} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MonoLabel color={palette.accent}>Collaborative · human-in-the-loop</MonoLabel>
        <div style={{ fontSize: 22, color: palette.textSoft, lineHeight: 1.4 }}>
          Leans on the steering layer — modes, tool approval, suspension, follow-ups, plan approval.
        </div>
      </Card>
      <Card accent={palette.amber} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MonoLabel color={palette.amber}>Headless · autonomous</MonoLabel>
        <div style={{ fontSize: 22, color: palette.textSoft, lineHeight: 1.4 }}>
          Leans on the autonomy layer — goal mode, subagents, persisted SessionRecords + recovery.
        </div>
      </Card>
    </div>

    <Footer index={4} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — Architecture map
// ════════════════════════════════════════════════════════════════════════════
const Architecture: Page = () => (
  <Stage>
    <Eyebrow>How it's actually built</Eyebrow>
    <SectionTitle
      title={
        <>
          Four layers.{' '}
          <span style={{ color: palette.accent }}>One agent loop.</span>
        </>
      }
    />
    <SubTitle>
      The harness in MastraCode is a small stack of objects. The <Code>Harness</Code> owns config and
      wiring; each <Code>Session</Code> owns a conversation; the run engine drives one turn at a time.
    </SubTitle>

    <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <LayerCard
        n="1"
        name="Harness"
        accent={palette.accent}
        desc="Validates modes, builds the gateway manager, owns workspace/browser, and wires every session."
        items={['createSession()', 'init() / destroy()', 'buildToolsets()']}
      />
      <LayerCard
        n="2"
        name="Session"
        accent={palette.blue}
        desc="One resource's conversation as focused domain objects — identity, thread, mode, model, OM, permissions."
        items={['sendMessage()', 'steer() / followUp()', 'mode · model · state']}
      />
      <LayerCard
        n="3"
        name="SessionRunEngine"
        accent={palette.purple}
        desc="Consumes the agent event stream and folds chunks into display messages, token usage, and finish state."
        items={['processStreamChunk()', 'approval / suspension', 'finish-reason mapping']}
      />
      <LayerCard
        n="4"
        name="Tools + Storage"
        accent={palette.amber}
        desc="Built-in tools, subagents, and a session store that persists identity, mode/model, and pending items."
        items={['ask_user · task_* · subagent', 'HarnessStorage', 'SessionRecord']}
      />
    </div>

    <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.mono, fontSize: 18, color: palette.muted }}>
      <span style={{ color: palette.accent }}>Harness</span>
      <span>→</span>
      <span style={{ color: palette.blue }}>Session</span>
      <span>→</span>
      <span style={{ color: palette.purple }}>RunEngine</span>
      <span>→</span>
      <span style={{ color: palette.amber }}>Tools / Storage</span>
      <span style={{ color: palette.dim }}>· everything below wraps a single Mastra Agent</span>
    </div>

    <Footer index={5} />
  </Stage>
);

const LayerCard = ({
  n,
  name,
  desc,
  items,
  accent,
}: {
  n: string;
  name: string;
  desc: string;
  items: string[];
  accent: string;
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 14,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <span style={{ fontFamily: font.mono, fontSize: 16, color: accent }}>{n}</span>
      <span style={{ fontSize: 24, fontWeight: 700, color: palette.text }}>{name}</span>
    </div>
    <div style={{ fontSize: 17, color: palette.textSoft, lineHeight: 1.45 }}>{desc}</div>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 5 }}>
      {items.map((it) => (
        <li key={it} style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted }}>
          · {it}
        </li>
      ))}
    </ul>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 04 — The Harness container
// ════════════════════════════════════════════════════════════════════════════
const TheHarness: Page = () => (
  <Stage>
    <Eyebrow>The container</Eyebrow>
    <SectionTitle
      title={
        <>
          The <span style={{ color: palette.accent }}>Harness</span> wires everything together.
        </>
      }
    />
    <SubTitle>
      Construction validates your config and assembles the runtime. <Code>init()</Code> brings storage,
      workspace, and gateways online, then propagates them to every backing agent.
    </SubTitle>

    <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Card accent={palette.green}>
        <MonoLabel color={palette.green}>Constructor · validate &amp; assemble</MonoLabel>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
          <FeatureRow
            title="validateModes()"
            desc="Mode IDs must be unique; a mode can't set both tools and additionalTools; transitionsTo can't self-reference or point to an unknown mode."
          />
          <FeatureRow
            title="GatewayManager"
            desc="Built from your gateways plus defaultGateways, with custom precedence — model IDs route through it for auth and provider selection."
          />
          <FeatureRow
            title="defaultMode"
            desc="Resolved from defaultModeId, otherwise the configured default or first mode."
          />
        </ul>
      </Card>

      <Card accent={palette.blue}>
        <MonoLabel color={palette.blue}>init() · bring the runtime online</MonoLabel>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
          <FeatureRow
            title="Internal vs external Mastra"
            desc="Creates an internal Mastra only when storage exists and no parent Mastra is present; otherwise initializes inherited storage on the external one."
          />
          <FeatureRow
            title="Workspace &amp; browser"
            desc="Supplied as instances or lazy factories. The workspace factory resolves on first use with { requestContext, mastra } and is cached."
          />
          <FeatureRow
            title="Runtime-service propagation"
            desc="Injects memory, workspace, browser, and pubsub into each backing agent only when it's missing them, then starts heartbeats."
          />
        </ul>
      </Card>
    </div>

    <Footer index={6} />
  </Stage>
);

const FeatureRow = ({ title, desc }: { title: string; desc: ReactNode }) => (
  <li>
    <div style={{ fontFamily: font.mono, fontSize: 19, color: palette.text, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 18, color: palette.textSoft, lineHeight: 1.4 }}>{desc}</div>
  </li>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — Modes
// ════════════════════════════════════════════════════════════════════════════
const Modes: Page = () => (
  <Stage>
    <Eyebrow>Modes</Eyebrow>
    <SectionTitle
      title={
        <>
          Same conversation.{' '}
          <span style={{ color: palette.accent }}>Different agent.</span>
        </>
      }
    />
    <SubTitle>
      A mode picks the agent, its tools, and (via the gateway) its model. The harness resolves the
      agent per mode and caches it — no restart when you switch.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 28 }}>
      <Card>
        <MonoLabel color={palette.accent}>getAgentForMode() · resolution order</MonoLabel>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14, counterReset: 'r' }}>
          <ResolveStep
            n="1"
            code="mode.agent"
            desc="Deprecated per-mode agent, if set."
            accent={palette.muted}
          />
          <ResolveStep
            n="2"
            code="config.agent"
            desc="A shared backing agent reused across modes."
            accent={palette.blue}
          />
          <ResolveStep
            n="3"
            code="constructed + cached"
            desc="Otherwise a per-mode Agent is built (needs defaultModelId) and cached. Mode instructions combine with harness instructions; mode.tools + additionalTools merge in."
            accent={palette.accent}
          />
        </ol>
      </Card>

      <div style={{ display: 'grid', gap: 18 }}>
        <Card accent={palette.green}>
          <MonoLabel color={palette.green}>tools vs additionalTools</MonoLabel>
          <div style={{ fontSize: 20, color: palette.textSoft, lineHeight: 1.45 }}>
            <Code>tools</Code> means replace, <Code>additionalTools</Code> means augment. Setting both
            on one mode is rejected at construction. With a shared agent, mode tools arrive as a toolset
            augment so the agent's own tools survive.
          </div>
        </Card>
        <Card accent={palette.purple}>
          <MonoLabel color={palette.purple}>gateway-driven models</MonoLabel>
          <div style={{ fontSize: 20, color: palette.textSoft, lineHeight: 1.45 }}>
            The agent receives a bare model-id string. Auth and provider routing happen through the
            Mastra gateways attached to the harness — one switch re-points the model.
          </div>
        </Card>
      </div>
    </div>

    <Footer index={7} />
  </Stage>
);

const ResolveStep = ({ n, code, desc, accent }: { n: string; code: string; desc: ReactNode; accent: string }) => (
  <li style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
    <span
      style={{
        fontFamily: font.mono,
        fontSize: 14,
        color: accent,
        border: `1px solid ${accent}`,
        borderRadius: 6,
        padding: '2px 8px',
        flexShrink: 0,
      }}
    >
      {n}
    </span>
    <span>
      <span style={{ fontFamily: font.mono, fontSize: 20, color: accent }}>{code}</span>
      <span style={{ fontSize: 18, color: palette.textSoft, lineHeight: 1.4, display: 'block', marginTop: 3 }}>
        {desc}
      </span>
    </span>
  </li>
);

// ════════════════════════════════════════════════════════════════════════════
// 06 — Prompts & request context
// ════════════════════════════════════════════════════════════════════════════
const PromptsContext: Page = () => (
  <Stage>
    <Eyebrow>Toolsets &amp; request context</Eyebrow>
    <SectionTitle
      title={
        <>
          What the agent can do is{' '}
          <span style={{ color: palette.accent }}>assembled per turn.</span>
        </>
      }
    />
    <SubTitle>
      <Code>buildToolsets()</Code> composes the tool surface from built-ins, your config, and subagents
      — minus anything disabled or denied. <Code>buildRequestContext()</Code> seeds the live harness
      state every tool sees.
    </SubTitle>

    <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 28 }}>
      <Card>
        <MonoLabel color={palette.accent}>buildToolsets() · the recipe</MonoLabel>
        <div style={{ display: 'grid', gap: 8 }}>
          <ToolsetLine sign="+" color={palette.green} label="built-ins" detail="ask_user · submit_plan · task_write · task_update · task_complete · task_check" />
          <ToolsetLine sign="+" color={palette.green} label="config.tools" detail="your harness tools (resolved if a function)" />
          <ToolsetLine sign="+" color={palette.blue} label="subagent" detail="auto-wired when subagents are configured" />
          <ToolsetLine sign="−" color={palette.amber} label="disableBuiltinTools" detail="explicitly removed built-ins" />
          <ToolsetLine sign="−" color={palette.red} label="deny policy" detail="tools the permission rules deny" />
          <ToolsetLine sign="+" color={palette.purple} label="modeTools" detail="mode tools as an augment (shared agent)" />
        </div>
      </Card>

      <Card accent={palette.cyan}>
        <MonoLabel color={palette.cyan}>buildRequestContext() · the 'harness' state</MonoLabel>
        <div style={{ fontSize: 20, color: palette.textSoft, lineHeight: 1.5 }}>
          Seeds <Code>requestContext.get('harness')</Code> with harness, session, thread, and resource
          state, the abort signal, the resolved workspace, event emission, and subagent model lookup.
        </div>
        <div style={{ marginTop: 16, fontSize: 19, color: palette.textSoft, lineHeight: 1.5 }}>
          State is live: tools read and write through{' '}
          <Code>session.state.get / set / update</Code> instead of a static blob.
        </div>
      </Card>
    </div>

    <Footer index={8} />
  </Stage>
);

const ToolsetLine = ({ sign, color, label, detail }: { sign: string; color: string; label: string; detail: string }) => (
  <div
    style={{
      display: 'flex',
      gap: 14,
      alignItems: 'baseline',
      background: palette.bg,
      border: `1px solid ${palette.border}`,
      borderRadius: 10,
      padding: '11px 16px',
    }}
  >
    <span style={{ fontFamily: font.mono, fontSize: 20, color, width: 18, flexShrink: 0 }}>{sign}</span>
    <span style={{ fontFamily: font.mono, fontSize: 17, color: palette.text, minWidth: 210 }}>{label}</span>
    <span style={{ fontSize: 16, color: palette.muted }}>{detail}</span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 07 — Session as domain objects
// ════════════════════════════════════════════════════════════════════════════
const SessionDomains: Page = () => (
  <Stage>
    <Eyebrow>The Session</Eyebrow>
    <SectionTitle
      title={
        <>
          One conversation,{' '}
          <span style={{ color: palette.accent }}>fourteen small objects.</span>
        </>
      }
    />
    <SubTitle>
      Instead of one god-object, a <Code>Session</Code> is split into focused domains. Each owns a
      slice of state, so the run loop and steering logic stay readable.
    </SubTitle>

    <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      {[
        ['identity', 'owner, resource, ids', palette.accent],
        ['thread', 'create, rename, clone, switch', palette.blue],
        ['stream', 'live run output', palette.purple],
        ['suspensions', 'pending tool calls', palette.amber],
        ['follow-ups', 'queued user messages', palette.cyan],
        ['approval', 'plan + tool gating', palette.green],
        ['run', 'abort + run-state', palette.rose],
        ['model', 'per-thread model', palette.blue],
        ['mode', 'active mode selection', palette.amber],
        ['om', 'observational memory', palette.purple],
        ['permissions', 'tool policy rules', palette.red],
        ['subagents', 'name resolution', palette.cyan],
        ['display', 'tokens + display msgs', palette.green],
        ['state', 'live session state', palette.accent],
      ].map(([name, desc, color]) => (
        <DomainCard key={name} name={name} desc={desc} accent={color} />
      ))}
    </div>

    <div style={{ marginTop: 32, fontSize: 22, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.5 }}>
      The harness injects every dependency through one wiring step, so a session never reaches back
      into the harness — it just <span style={{ color: palette.accent }}>asks its domains</span>.
    </div>

    <Footer index={9} />
  </Stage>
);

const DomainCard = ({ name, desc, accent }: { name: string; desc: string; accent: string }) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 10,
      padding: '14px 16px',
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 18, color: accent }}>{name}</div>
    <div style={{ fontSize: 15, color: palette.muted, marginTop: 4 }}>{desc}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 08 — Message flow
// ════════════════════════════════════════════════════════════════════════════
const MessageFlow: Page = () => (
  <Stage>
    <Eyebrow>Message flow</Eyebrow>
    <SectionTitle
      title={
        <>
          Four ways a message{' '}
          <span style={{ color: palette.accent }}>reaches the agent.</span>
        </>
      }
    />
    <SubTitle>
      Every entry point ends in <Code>sendSignal()</Code>, which dispatches with{' '}
      <Code>ifActive</Code> / <Code>ifIdle</Code> semantics — queue into a live run, or start a fresh one.
    </SubTitle>

    <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
      <Pill
        icon="✉️"
        label="sendMessage()"
        desc="Builds the input, sends a signal, waits for accepted — and when idle, also waits for agent_end."
        accent={palette.green}
      />
      <Pill
        icon="🛞"
        label="steer()"
        desc="Aborts the current run, clears the follow-up queue, emits an empty-queue state, then sends."
        accent={palette.amber}
      />
      <Pill
        icon="📨"
        label="followUp()"
        desc="Enqueues during an active run; sends immediately when the session is idle."
        accent={palette.blue}
      />
      <Pill
        icon="🚰"
        label="drainFollowUpQueue()"
        desc="Dequeues, re-queues on failure, and either feeds the live stream or falls back to sendMessage()."
        accent={palette.cyan}
      />
    </div>

    <div
      style={{
        marginTop: 36,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        padding: '20px 26px',
        fontFamily: font.mono,
        fontSize: 19,
        color: palette.textSoft,
        lineHeight: 1.5,
        maxWidth: 1500,
      }}
    >
      <span style={{ color: palette.muted }}>// sendSignal()</span> creates a user signal, ensures the
      thread + subscription exist, <span style={{ color: palette.amber }}>declines a pending tool approval</span>{' '}
      when a new message interrupts a run, waits out the post-abort window, then dispatches to{' '}
      <span style={{ color: palette.accent }}>agent.sendSignal()</span>.
    </div>

    <Footer index={10} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 09 — Run engine
// ════════════════════════════════════════════════════════════════════════════
const RunEngine: Page = () => (
  <Stage>
    <Eyebrow>SessionRunEngine</Eyebrow>
    <SectionTitle
      title={
        <>
          The run engine{' '}
          <span style={{ color: palette.accent }}>folds the stream.</span>
        </>
      }
    />
    <SubTitle>
      One engine owns the run loop: it consumes the agent's event stream, folds chunks into Harness
      display messages and token usage, and decides how each run ends.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <Card>
        <MonoLabel color={palette.accent}>processStreamChunk() handles</MonoLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 17, color: palette.textSoft }}>
          {[
            'text / reasoning',
            'tool-call input',
            'tool results / errors',
            'approval events',
            'suspension events',
            'finish / error / goal',
            'OM lifecycle',
            'system reminders',
            'signals / user msgs',
            'sandbox stdout/stderr',
          ].map((c) => (
            <div key={c} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span style={{ color: palette.accent }}>·</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card accent={palette.amber}>
        <MonoLabel color={palette.amber}>finish-reason → stopReason</MonoLabel>
        <div style={{ display: 'grid', gap: 12 }}>
          <FinishRow from="stop · end-turn" to="complete" color={palette.green} />
          <FinishRow from="tool-calls" to="tool_use" color={palette.blue} />
          <FinishRow from="anything else" to="terminal error" color={palette.red} />
          <div style={{ fontSize: 17, color: palette.muted, lineHeight: 1.45, marginTop: 4 }}>
            Non-success reasons surface through <Code color={palette.muted}>describeNonSuccessFinishReason()</Code>{' '}
            instead of a silent complete. Server-side fallback models emit an info notice.
          </div>
        </div>
      </Card>
    </div>

    <Footer index={11} />
  </Stage>
);

const FinishRow = ({ from, to, color }: { from: string; to: string; color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <span style={{ fontFamily: font.mono, fontSize: 19, color: palette.textSoft, minWidth: 230 }}>{from}</span>
    <span style={{ color: palette.muted }}>→</span>
    <span style={{ fontFamily: font.mono, fontSize: 19, color }}>{to}</span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 10 — Steering & HITL
// ════════════════════════════════════════════════════════════════════════════
const Steering: Page = () => (
  <Stage>
    <Eyebrow>Human-in-the-loop</Eyebrow>
    <SectionTitle
      title={
        <>
          The harness should{' '}
          <span style={{ color: palette.accent }}>ask, not just act.</span>
        </>
      }
    />
    <SubTitle>
      Interrupts aren't edge cases — they're core UX. The run engine gates side effects, suspends on
      interactive tools, and gates intent before any plan executes.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
      <Pill
        icon="🛡️"
        label="Tool approval gate"
        desc={
          <>
            On a tool call the engine runs <Code>resolveToolApproval()</Code>: auto-approve or
            auto-deny fixed policies, otherwise arm approval state and emit{' '}
            <Code>tool_approval_required</Code>.
          </>
        }
        accent={palette.green}
      />
      <Pill
        icon="⏸️"
        label="Tool suspension"
        desc={
          <>
            Interactive tools like <Code>ask_user</Code> suspend the run, surface a question, and
            resume once the human answers.
          </>
        }
        accent={palette.purple}
      />
      <Pill
        icon="📋"
        label="Plan approval"
        desc={
          <>
            <Code>submit_plan</Code> gates intent: approve, reject, or request changes before any code
            changes happen.
          </>
        }
        accent={palette.blue}
      />
      <Pill
        icon="⛔"
        label="Abort + follow-up"
        desc="Abort kills a runaway run; the follow-up queue holds the next message until the current op finishes."
        accent={palette.amber}
      />
    </div>

    <div
      style={{
        marginTop: 30,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderLeft: `2px solid ${palette.cyan}`,
        borderRadius: 14,
        padding: '20px 26px',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <span style={{ fontSize: 26 }}>✅</span>
      <div style={{ fontSize: 22, color: palette.text, lineHeight: 1.4 }}>
        <b style={{ color: palette.cyan }}>Verify · goal mode + judges.</b>{' '}
        Approval gates the <i>act</i>; verification checks the <i>result</i>. A{' '}
        <Code>/goal</Code> is a persistent objective — after each turn a judge scores it and returns{' '}
        <Code>complete · continue · pause · wait-for-input</Code>, bounded by a turn budget.
      </div>
    </div>

    <Footer index={12} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 11 — Memory: Context Rot + OM
// ════════════════════════════════════════════════════════════════════════════
const Memory: Page = () => (
  <Stage padding="100px 120px 120px">
    <Eyebrow>Observational memory</Eyebrow>
    <SectionTitle
      title={
        <>
          Context is precious.{' '}
          <span style={{ color: palette.accent }}>Context Rot is real.</span>
        </>
      }
    />
    <SubTitle>
      As the window fills, models degrade. Observational Memory watches token counts and rolls the
      conversation up — observations first, then reflections — on real thresholds.
    </SubTitle>

    <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <Pill
        icon="👁️"
        label="Observation · 30k tok"
        desc="When message tokens cross the observation threshold (default 30,000), the OM observer summarizes recent turns into observations."
        accent={palette.green}
      />
      <Pill
        icon="🪞"
        label="Reflection · 40k tok"
        desc="When observation tokens cross the reflection threshold (default 40,000), observations are distilled further into reflections."
        accent={palette.purple}
      />
      <Pill
        icon="🧊"
        label="Buffering"
        desc="In-flight observations and reflections are buffered and restored on reload, so progress survives restarts."
        accent={palette.blue}
      />
    </div>

    <LiveContextDemo />

    <Footer index={13} />
  </Stage>
);

// ─── Live context-fill demo (Memory slide) ───────────────────────────────────
type DemoBar = { id: number; role: 'user' | 'asst' | 'tool' | 'obs'; t: number };
const demoScript: { role: 'user' | 'asst' | 'tool'; text: string; t: number }[] = [
  { role: 'user', text: 'Fix the auth bug in login.ts', t: 1200 },
  { role: 'asst', text: 'Let me look at the file...', t: 800 },
  { role: 'tool', text: 'view("src/auth/login.ts") → 240 lines', t: 2800 },
  { role: 'asst', text: 'Found the issue — missing token refresh', t: 1500 },
  { role: 'tool', text: 'string_replace_lsp(...) → 2 diagnostics', t: 2200 },
  { role: 'asst', text: 'Fixed. Running tests...', t: 900 },
  { role: 'tool', text: 'execute_command("npm test") → 47 tests', t: 4200 },
  { role: 'asst', text: 'All tests pass. Checking types...', t: 1000 },
  { role: 'tool', text: 'execute_command("tsc --noEmit") → clean', t: 3800 },
  { role: 'user', text: 'Now add rate limiting to the API', t: 1100 },
  { role: 'asst', text: 'Exploring the API structure...', t: 900 },
  { role: 'tool', text: 'search_content("rateLimit") → 0 matches', t: 1800 },
  { role: 'tool', text: 'view("src/api/middleware/") → 5 files', t: 3200 },
  { role: 'asst', text: 'No existing rate limiting. Adding it...', t: 1600 },
  { role: 'tool', text: 'write_file("rate-limit.ts")', t: 2400 },
  { role: 'tool', text: 'string_replace_lsp("api/index.ts")', t: 1800 },
  { role: 'tool', text: 'execute_command("npm test") → 52 tests', t: 5200 },
];

// OM observation threshold default (see harness loadOMProgress: 30_000).
const THRESHOLD = 30000;

function LiveContextDemo() {
  const [tokens, setTokens] = useState(0);
  const [bars, setBars] = useState<DemoBar[]>([]);
  const [observations, setObservations] = useState(0);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    if (step >= demoScript.length) {
      setRunning(false);
      return;
    }
    const timer = setTimeout(() => {
      const s = demoScript[step];
      const next = tokens + s.t;
      const newBar: DemoBar = { id: idRef.current++, role: s.role, t: s.t };

      if (next >= THRESHOLD * 0.9) {
        // observation rollup
        setBars((prev) => {
          const keep = prev.slice(-2);
          const obsBars: DemoBar[] = [
            { id: idRef.current++, role: 'obs', t: 1200 },
            { id: idRef.current++, role: 'obs', t: 800 },
            { id: idRef.current++, role: 'obs', t: 1500 },
          ];
          return [...obsBars, ...keep, newBar];
        });
        setTokens(Math.floor(next * 0.3));
        setObservations((c) => c + 1);
      } else {
        setBars((prev) => [...prev, newBar]);
        setTokens(next);
      }
      setStep((s) => s + 1);
    }, 700);
    return () => clearTimeout(timer);
  }, [running, step, tokens]);

  const reset = () => {
    setRunning(false);
    setTokens(0);
    setBars([]);
    setObservations(0);
    setStep(0);
  };

  const pct = Math.min(100, (tokens / THRESHOLD) * 100);
  const fillColor = pct > 85 ? palette.rose : pct > 60 ? palette.amber : palette.accent;

  return (
    <div
      style={{
        marginTop: 22,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        padding: '18px 22px',
        maxWidth: 1500,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontFamily: font.mono, fontSize: 13, color: palette.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Live · Context fill → Observation rollup
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {!running && step < demoScript.length && (
            <DemoBtn onClick={() => setRunning(true)}>{step === 0 ? '▶ Start' : '▶ Resume'}</DemoBtn>
          )}
          {running && <DemoBtn onClick={() => setRunning(false)}>⏸ Pause</DemoBtn>}
          {(step > 0 || tokens > 0) && <DemoBtn onClick={reset}>↺ Reset</DemoBtn>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* Left: meter + bars */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: font.mono, fontSize: 13, color: palette.textSoft }}>
            <span>Message tokens</span>
            <span style={{ color: pct > 85 ? palette.rose : palette.textSoft }}>
              {tokens.toLocaleString()} / {THRESHOLD.toLocaleString()} tok
            </span>
          </div>
          <div style={{ height: 14, background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: fillColor, transition: 'width 0.4s, background 0.4s' }} />
          </div>

          <div
            style={{
              marginTop: 10,
              maxHeight: 150,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column-reverse',
              gap: 3,
            }}
          >
            {[...bars].slice(-11).reverse().map((b) => (
              <div key={b.id} style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: font.mono, fontSize: 11 }}>
                <span style={{ width: 38, color: roleColor(b.role), letterSpacing: '0.06em' }}>{b.role}</span>
                <div
                  style={{
                    height: 9,
                    borderRadius: 3,
                    background: roleColor(b.role),
                    opacity: b.role === 'obs' ? 0.9 : 0.55,
                    width: `${Math.min(100, (b.t / 5200) * 100)}%`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: OM stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
          <DemoStat label="observation rollups" value={observations} accent={palette.green} />
          <DemoStat label="messages processed" value={step} accent={palette.blue} />
          <DemoStat
            label="window state"
            value={pct > 85 ? 'near threshold' : pct > 60 ? 'filling' : 'healthy'}
            accent={fillColor}
            text
          />
        </div>
      </div>
    </div>
  );
}

function roleColor(role: DemoBar['role']) {
  switch (role) {
    case 'user':
      return palette.blue;
    case 'asst':
      return palette.text;
    case 'tool':
      return palette.amber;
    case 'obs':
      return palette.green;
  }
}

const DemoBtn = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: font.mono,
      fontSize: 14,
      color: palette.text,
      background: palette.surfaceHi,
      border: `1px solid ${palette.borderBright}`,
      borderRadius: 8,
      padding: '6px 14px',
      cursor: 'pointer',
    }}
  >
    {children}
  </button>
);

const DemoStat = ({
  label,
  value,
  accent,
  text,
}: {
  label: string;
  value: number | string;
  accent: string;
  text?: boolean;
}) => (
  <div
    style={{
      background: palette.bg,
      border: `1px solid ${palette.border}`,
      borderRadius: 10,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 12,
    }}
  >
    <span style={{ fontFamily: font.display, fontSize: text ? 22 : 32, fontWeight: 800, color: accent, letterSpacing: '-0.02em' }}>
      {value}
    </span>
    <span style={{ fontFamily: font.mono, fontSize: 13, color: palette.muted, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'right' }}>
      {label}
    </span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 12 — Subagents
// ════════════════════════════════════════════════════════════════════════════
const Subagents: Page = () => (
  <Stage>
    <Eyebrow>Subagents</Eyebrow>
    <SectionTitle
      title={
        <>
          Delegate work,{' '}
          <span style={{ color: palette.accent }}>forked or fresh.</span>
        </>
      }
    />
    <SubTitle>
      When you configure subagents, <Code>createSubagentTool()</Code> exposes one <Code>subagent</Code>{' '}
      tool. Each call picks an <Code>agentType</Code>, a <Code>task</Code>, and whether to fork.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Card accent={palette.blue} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: palette.text }}>Non-forked</div>
        <div style={{ fontFamily: font.mono, fontSize: 15, color: palette.blue, letterSpacing: '0.14em' }}>
          SELF-CONTAINED DELEGATION
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 19, color: palette.textSoft, lineHeight: 1.4 }}>
          <li>· Runs with the subagent definition's own config</li>
          <li>· Its own instructions, tools, and model</li>
          <li>· Can't see the parent conversation — the task must carry all context</li>
          <li>· Optional <Code>modelId</Code> override per call</li>
        </ul>
      </Card>

      <Card accent={palette.accent} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: palette.text }}>Forked</div>
        <div style={{ fontFamily: font.mono, fontSize: 15, color: palette.accent, letterSpacing: '0.14em' }}>
          CONTEXT-DEPENDENT · CACHE-FRIENDLY
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 19, color: palette.textSoft, lineHeight: 1.4 }}>
          <li>· Reuses the parent agent + a cloned parent thread</li>
          <li>· Keeps the prompt prefix cache-friendly</li>
          <li>· Requires memory; <Code>modelId</Code> is ignored (parent's model)</li>
          <li>· Clone tagged <Code>forkedSubagent</Code> + <Code>parentThreadId</Code>, hidden from pickers</li>
        </ul>
      </Card>
    </div>

    <div style={{ marginTop: 30, fontFamily: font.mono, fontSize: 19, color: palette.textSoft }}>
      <span style={{ color: palette.muted }}>resolved as</span>{' '}
      <span style={{ color: palette.accent }}>forked ?? definition.forked ?? false</span>
    </div>

    <Footer index={14} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 13 — Persistence & recovery
// ════════════════════════════════════════════════════════════════════════════
const Persistence: Page = () => (
  <Stage>
    <Eyebrow>Persistence &amp; recovery</Eyebrow>
    <SectionTitle
      title={
        <>
          Sessions survive{' '}
          <span style={{ color: palette.accent }}>a restart.</span>
        </>
      }
    />
    <SubTitle>
      <Code>HarnessStorage</Code> persists each session as a <Code>SessionRecord</Code>. Pending items
      capture anything mid-flight, so a resumed session can pick up exactly where it stopped.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 28 }}>
      <Card>
        <MonoLabel color={palette.accent}>SessionRecord · what's stored</MonoLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 17, color: palette.textSoft }}>
          {[
            'ownerId · resourceId · threadId',
            'parent / subagent lineage',
            'origin + source metadata',
            'modeId · modelId',
            'title',
            'metadata + state blobs',
            'pending items',
            'createdAt · lastActivityAt',
          ].map((c) => (
            <div key={c} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span style={{ color: palette.accent }}>·</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 17, color: palette.muted, lineHeight: 1.45 }}>
          <Code color={palette.muted}>updateSession()</Code> preserves id + createdAt and refreshes
          lastActivityAt. Origins: <Code color={palette.muted}>top-level · subagent-tool · direct-local · remote-resolve</Code>.
        </div>
      </Card>

      <Card accent={palette.amber}>
        <MonoLabel color={palette.amber}>Pending items · resume points</MonoLabel>
        <div style={{ display: 'grid', gap: 10 }}>
          <PendingRow kind="tool-approval" desc="a tool call waiting on approve / deny" color={palette.green} />
          <PendingRow kind="tool-suspension" desc="an interactive tool waiting on input" color={palette.purple} />
          <PendingRow kind="question" desc="an ask_user question awaiting an answer" color={palette.blue} />
          <PendingRow kind="plan-approval" desc="a submitted plan awaiting a decision" color={palette.cyan} />
        </div>
        <div style={{ marginTop: 14, fontSize: 16, color: palette.muted, lineHeight: 1.45 }}>
          Status moves through <Code color={palette.muted}>pending → responded / canceled / failed</Code>.
        </div>
      </Card>
    </div>

    <Footer index={15} />
  </Stage>
);

const PendingRow = ({ kind, desc, color }: { kind: string; desc: string; color: string }) => (
  <div
    style={{
      display: 'flex',
      gap: 14,
      alignItems: 'baseline',
      background: palette.bg,
      border: `1px solid ${palette.border}`,
      borderRadius: 10,
      padding: '11px 16px',
    }}
  >
    <span style={{ fontFamily: font.mono, fontSize: 17, color, minWidth: 180 }}>{kind}</span>
    <span style={{ fontSize: 16, color: palette.muted }}>{desc}</span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 14 — Production checklist
// ════════════════════════════════════════════════════════════════════════════
const Checklist: Page = () => (
  <Stage>
    <Eyebrow>Production-ready</Eyebrow>
    <SectionTitle
      title={
        <>
          What the harness{' '}
          <span style={{ color: palette.accent }}>actually gives you.</span>
        </>
      }
    />
    <SubTitle>Twelve subsystems, all real and demoable in MastraCode today.</SubTitle>

    <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Check item="Validated modes that re-resolve the agent" tag="Modes" />
      <Check item="Per-turn toolset assembly with deny filtering" tag="Toolsets" />
      <Check item="Gateway-driven multi-model routing" tag="Gateways" />
      <Check item="Session split into focused domain objects" tag="Session" />
      <Check item="sendMessage / steer / followUp flow" tag="Messages" />
      <Check item="Stream folded into display + token usage" tag="RunEngine" />
      <Check item="Tool approval, suspension, plan approval" tag="Steering" />
      <Check item="Goal mode + judge-driven verification" tag="Goals" />
      <Check item="Observational memory on token thresholds" tag="Memory" />
      <Check item="Forked + non-forked subagents" tag="Subagents" />
      <Check item="Sandboxed workspace + browser, lazily resolved" tag="Workspace" />
      <Check item="Persisted SessionRecord + pending items" tag="Storage" />
    </div>

    <div style={{ marginTop: 32, fontSize: 24, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.5 }}>
      None of this is aspirational — every box maps to code in{' '}
      <span style={{ color: palette.accent }}>packages/core/src/harness</span>.
    </div>

    <Footer index={16} />
  </Stage>
);

const Check = ({ item, tag }: { item: string; tag: string }) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderLeft: `3px solid ${palette.accent}`,
      borderRadius: 10,
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}
  >
    <span style={{ fontFamily: font.mono, color: palette.accent, fontSize: 20 }}>✓</span>
    <span style={{ fontSize: 20, color: palette.text, flex: 1 }}>{item}</span>
    <span
      style={{
        fontFamily: font.mono,
        fontSize: 13,
        color: palette.muted,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
      }}
    >
      → {tag}
    </span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 15 — What's next (futures + close)
// ════════════════════════════════════════════════════════════════════════════
const Futures: Page = () => (
  <Stage>
    <Eyebrow>What's next</Eyebrow>
    <SectionTitle
      title={
        <>
          The harness{' '}
          <span style={{ color: palette.accent }}>keeps evolving.</span>
        </>
      }
    />
    <SubTitle>
      The foundation is here. The frontier is long-horizon autonomous execution — agents that run for
      hours, self-verify, and recover from failure without a human in the loop.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
      <Pill
        icon="🔄"
        label="Long-Horizon Execution"
        desc="Pending items and SessionRecords already make runs resumable. Next: checkpoints, rollback, and self-verification across many turns."
        accent={palette.green}
      />
      <Pill
        icon="🤖"
        label="Parallel Orchestration"
        desc="Subagents run delegated work today. Next: many subagents in parallel, coordinating through the harness without stepping on each other."
        accent={palette.blue}
      />
      <Pill
        icon="🧬"
        label="Model–Harness Co-evolution"
        desc="Better tool use → richer toolsets → models trained on richer harness traces. A loop that compounds."
        accent={palette.purple}
      />
      <Pill
        icon="🔧"
        label="Dynamic Harnesses"
        desc="buildToolsets() already composes per turn. Next: the agent assembles its own harness for the task — tools, guardrails, and a verify step generated on the fly, plan-mode on steroids."
        accent={palette.amber}
      />
    </div>

    <div
      style={{
        marginTop: 36,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderLeft: `3px solid ${palette.accent}`,
        borderRadius: 12,
        padding: '20px 26px',
        maxWidth: 1500,
      }}
    >
      <div style={{ fontSize: 26, color: palette.text, fontWeight: 700, marginBottom: 8 }}>
        Now go build it.
      </div>
      <div style={{ fontSize: 20, color: palette.textSoft, lineHeight: 1.5 }}>
        Everything you've seen lives in{' '}
        <b style={{ color: palette.accent }}>MastraCode</b>, on top of the Mastra framework — the
        harness is open-source and ready to extend.
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 24, fontFamily: font.mono, fontSize: 16 }}>
        <span style={{ color: palette.accent }}>📖 mastra.ai</span>
        <span style={{ color: palette.textSoft }}>💻 github.com/mastra-ai</span>
        <span style={{ color: palette.textSoft }}>💬 discord.gg/mastra</span>
      </div>
    </div>

    <Footer index={17} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// Meta + speaker notes
// ════════════════════════════════════════════════════════════════════════════
export const meta: SlideMeta = {
  title: 'Mastra · Agent Harness',
};

export const notes: (string | undefined)[] = [
  // 01 Cover
  `Welcome them. Two presenters: Abhi (CTO) and Alex (DevRel). This is a code-grounded tour of the actual harness inside MastraCode — the Harness class, the Session, and the run engine. Everything we show maps to packages/core/src/harness.`,

  // 02 Everywhere
  `Frame the confusion before defining anything. "Harness" is suddenly everywhere — OpenAI, Stripe, Thoughtworks, Anthropic, Devin all use it. Agent = Model + Harness ("everything except the model") is technically true but useless. The plain-English version (credit Tejas Kumar's talk): a harness is everything around the model that grounds it in reality — tools, context, guardrails, a verify step — so a rented, non-deterministic black box behaves RELIABLY. That's the real why: reliability irrespective of which model the provider actually serves you. It splits into two layers: the OUTER harness (Fowler/Böckeler — guides + sensors a team builds around an agent to earn trust and supervise less) and the INNER / built-in harness (the loop, tools, memory, recovery behind Claude Code). Same word, two layers, one job. Next slide pins them down and shows where Mastra sits.`,

  // 03 Spectrum
  `Mental model. A spectrum of opinionation: raw code (total flexibility + total responsibility) → framework (building blocks — Mastra, CrewAI, LangChain) → harness (a complete system, all wired). But "harness" itself splits in two. INNER / built-in harness = the orchestration substrate that makes an agent RUN (the loop, tool execution, memory, retrieval) — Mastra ships this as the Agent. OUTER harness = the guides + sensors that make an agent TRUSTWORTHY (modes, steering, tool approval, sessions, recovery) — you BUILD that with the Harness class. The punchline: Mastra is both — it ships the inner harness and gives you the Harness class to build the outer one. The rest of the talk is what's inside that Harness class.`,

  // 04 PurposeBuilt
  `Now make it concrete. Claude Code IS an outer harness. Mastra's Harness class is purpose-built to let you build one: it wraps the agent loop and gives you the controls. The same class powers Claude Code (collaborative coding agent), CoWork (a teammate in the loop), Devin (autonomous engineer), and headless software-factory agents. Two operating points, same class: collaborative / HITL products lean on the steering layer (modes, tool approval, suspension, follow-ups, plan approval); headless / autonomous products lean on the autonomy layer (goal mode, subagents, persisted SessionRecords + recovery). Everything from here shows what's inside that Harness class.`,

  // 05 Architecture
  `The architecture map. Four layers: Harness owns config + wiring (createSession, init, buildToolsets). Session owns one resource's conversation as small domain objects. SessionRunEngine drives one turn — folding the agent's event stream into display messages and token usage. Tools + Storage provide built-ins, subagents, and persistence. Everything below the Harness ultimately wraps a single Mastra Agent. The next slides walk each layer.`,

  // 06 The Harness
  `The container. The constructor validates before it assembles: validateModes() enforces unique mode IDs, blocks setting both tools and additionalTools, and validates transitionsTo (no self-reference, no unknown target). It builds the GatewayManager from your gateways plus defaultGateways, and resolves defaultMode. init() creates an internal Mastra only when storage exists and there's no parent Mastra; otherwise it initializes inherited storage on the external one. Workspace and browser can be instances or lazy factories (factory resolves with { requestContext, mastra } and is cached). Then it propagates memory/workspace/browser/pubsub into each backing agent that's missing them and starts heartbeats.`,

  // 07 Modes
  `Modes. getAgentForMode() resolves in order: deprecated mode.agent, then a shared config.agent, otherwise it constructs and caches a per-mode Agent (which needs defaultModelId). Mode instructions combine with harness instructions; mode.tools + additionalTools merge into that agent. tools means replace, additionalTools means augment — setting both is rejected. With a shared agent, mode tools arrive as a toolset augment so the agent's own tools survive. Models are gateway-driven: the agent gets a bare model-id string and routing/auth happen through the attached Mastra gateways. So a switch re-points the model with no restart.`,

  // 08 Prompts & request context
  `What the agent can do is assembled per turn. buildToolsets() starts from built-ins (ask_user, submit_plan, task_write/update/complete/check), adds your config.tools (resolved if it's a function), auto-wires the subagent tool when subagents are configured, removes anything in disableBuiltinTools, drops tools the permission rules deny, and adds modeTools as an augment when there's a shared agent. buildRequestContext() seeds requestContext.get('harness') with harness/session/thread/resource state, the abort signal, the resolved workspace, event emission, and subagent model lookup. State is live — tools go through session.state.get/set/update, not a static blob.`,

  // 09 Session domains
  `The Session is not a god-object. It's split into focused domains: identity, thread, stream, suspensions, follow-ups, approval, run, model, mode, OM, permissions, subagents, display, and state. The harness injects every dependency through one wiring step, so a session never reaches back into the harness — it asks its domains. This is what keeps the run loop and steering logic readable.`,

  // 10 Message flow
  `Four entry points, one dispatch. sendMessage builds the input, sends a signal, waits for accepted, and when idle also waits for agent_end. steer aborts the current run, clears the follow-up queue, emits an empty-queue state, then sends. followUp enqueues during an active run or sends immediately when idle. drainFollowUpQueue dequeues, re-queues on failure, and either feeds the live stream or falls back to sendMessage. All of them funnel into sendSignal(), which ensures thread + subscription, declines a pending tool approval when a new message interrupts a run, waits out the post-abort window, then dispatches to agent.sendSignal() with ifActive / ifIdle semantics.`,

  // 11 Run engine
  `The SessionRunEngine owns the run loop. processStreamChunk handles text/reasoning, tool-call input, tool results/errors, approval + suspension events, finish/error/goal, the OM lifecycle, system reminders, signals/user messages, and sandbox stdout/stderr — folding all of it into display messages and token usage. Finish-reason mapping: stop and end-turn map to complete; tool-calls maps to tool_use; anything else surfaces as a terminal error via describeNonSuccessFinishReason() instead of a silent complete. Server-side fallback models emit an info notice.`,

  // 12 Steering
  `Human-in-the-loop is core, not an edge case. On a tool call, the engine runs resolveToolApproval(): fixed policies auto-approve or auto-deny; otherwise it arms approval state and emits tool_approval_required, then routes the decision through approve/decline. Interactive tools like ask_user suspend the run, surface a question, and resume on the answer. submit_plan gates intent before any code changes. Abort kills runaway runs; the follow-up queue holds the next message. Plan approval gates intent, tool approval gates side effects, abort and follow-ups gate flow. And the verify step (Tejas's harness pillar): approval gates the ACT, verification checks the RESULT. In Mastra that's goal mode + judges — a /goal is a persistent objective, and after each turn a judge scores it and returns complete / continue / pause / wait-for-input (GoalEvaluationPayload: passed, status active|paused|done, scorer results, reason), bounded by goalMaxTurns. The deterministic verify-and-retry loop, model- and scorer-driven.`,

  // 13 Memory
  `Context Rot is real — as the window fills, models degrade. Observational Memory watches token counts on real thresholds. Default observation threshold is 30,000 message tokens: cross it and the observer summarizes recent turns into observations. Default reflection threshold is 40,000 observation tokens: cross it and observations distill into reflections. In-flight observations and reflections are buffered and restored on reload, so progress survives restarts. The live demo shows message tokens climbing and an observation rollup compressing the window when it nears the threshold.`,

  // 14 Subagents
  `Subagents. When configured, createSubagentTool() exposes one subagent tool; each call picks an agentType (enum), a task, and optionally forked. Non-forked runs use the subagent definition's own config — its own instructions, tools, and model — and can't see the parent conversation, so the task must carry all context; a per-call modelId override is allowed. Forked runs reuse the parent agent and a cloned parent thread to keep the prompt prefix cache-friendly; they require memory, ignore modelId (parent's model is used), and tag the clone with forkedSubagent + parentThreadId so it's hidden from thread pickers. Resolution is forked ?? definition.forked ?? false.`,

  // 15 Persistence
  `Sessions survive a restart. HarnessStorage persists each session as a SessionRecord: owner/resource/thread IDs, parent + subagent lineage, origin and source metadata, modeId/modelId, title, metadata and state blobs, pending items, and timestamps. updateSession() preserves id and createdAt and refreshes lastActivityAt. Origins are top-level, subagent-tool, direct-local, remote-resolve. Pending items are the resume points: tool-approval, tool-suspension, question, and plan-approval — each moving through pending → responded / canceled / failed. So a resumed session knows exactly what it was waiting on.`,

  // 16 Checklist
  `The bar — and it's all real. Validated modes that re-resolve the agent, per-turn toolset assembly with deny filtering, gateway-driven multi-model routing, the Session split into domains, the message flow, the run engine folding the stream, full steering (tool approval / suspension / plan approval), goal mode + judge-driven verification, observational memory on token thresholds, forked + non-forked subagents, a sandboxed workspace + browser, and persisted SessionRecords with pending items. Every box maps to code in packages/core/src/harness — nothing aspirational.`,

  // 17 Futures
  `What's next. The foundation is here; the frontier is long-horizon autonomous execution. Four directions, each grounded in what already exists: long-horizon execution (pending items + SessionRecords already make runs resumable — next is checkpoints, rollback, self-verification), parallel orchestration (subagents today — next is many in parallel coordinating through the harness), model-harness co-evolution (a compounding loop), and dynamic harnesses (buildToolsets already composes per turn — next, per Tejas's 2027 prediction, the agent generates its own harness for the task: tools, guardrails, and a verify step on the fly — plan-mode on steroids). Close: it's all in MastraCode, open-source, ready to extend. Now go build it.`,
];

export default [
  Cover,
  Everywhere,
  Spectrum,
  PurposeBuilt,
  Architecture,
  TheHarness,
  Modes,
  PromptsContext,
  SessionDomains,
  MessageFlow,
  RunEngine,
  Steering,
  Memory,
  Subagents,
  Persistence,
  Checklist,
  Futures,
] satisfies Page[];
