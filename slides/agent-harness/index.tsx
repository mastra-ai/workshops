import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import abhiAvatar from './assets/abhi-avatar.jpg';
import alexAvatar from './assets/alex-avatar.jpg';

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

const TOTAL = 19;

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
        How Mastra's <b style={{ color: palette.text }}>Harness</b> turns an LLM into a steerable,
        resumable, verifiable agent. The foundation for products like{' '}
        <b style={{ color: palette.text }}>Claude Code</b>.
      </p>

      <div style={{ display: 'flex', gap: 64, marginBottom: 56 }}>
        <Author name="Abhi Aiyer" role="Founder / CTO, Mastra" avatar={abhiAvatar} />
        <Author name="Alex Booker" role="Head of DX, Mastra" avatar={alexAvatar} />
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
      OpenAI, Stripe, Thoughtworks, Anthropic: everyone says "harness" now. The trouble is it means a
      different thing in every sentence. <b style={{ color: palette.text }}>Agent = Model + Harness</b>,
      or "everything except the model," is true but says almost nothing.
    </SubTitle>

    <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
      <QuoteCard
        src="Thoughtworks · Fowler"
        quote="Guides and sensors a team builds around a coding agent: a control system to earn enough trust to supervise less."
        accent={palette.blue}
      />
      <QuoteCard
        src="The plain-English version"
        quote="Everything around the model that grounds it in reality (tools, context, guardrails, a verify step) so a rented black box behaves reliably."
        accent={palette.purple}
      />
      <QuoteCard
        src="Anthropic · Devin"
        quote="The runtime that turns a model into a product: the loop, tools, memory, and recovery behind Claude Code."
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
        Different words, one job: <b style={{ color: palette.accent }}>reliability</b>. Make a
        non-deterministic, rented model do its job anyway.
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
      Frameworks and harnesses sit at different points on a spectrum of opinionation, and "harness"
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
        desc="Sessions, the agent loop, modes, steering, memory, recovery, assembled and wired for you."
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
          The orchestration substrate that makes an agent <b style={{ color: palette.text }}>run</b>:
          the loop, tool execution, memory, retrieval.
        </div>
        <div style={{ fontFamily: font.mono, fontSize: 17, color: palette.muted }}>
          Mastra ships this: the <span style={{ color: palette.blue }}>Agent</span>.
        </div>
      </Card>
      <Card accent={palette.accent} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MonoLabel color={palette.accent}>Outer harness · what you build</MonoLabel>
        <div style={{ fontSize: 24, color: palette.text, lineHeight: 1.4 }}>
          The guides + sensors that make an agent <b style={{ color: palette.text }}>trustworthy</b>:
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
// 04 — Anatomy of a harness: the three-bar test
// ════════════════════════════════════════════════════════════════════════════
const AnatomyBar = ({
  n,
  title,
  desc,
  accent,
}: {
  n: string;
  title: string;
  desc: ReactNode;
  accent: string;
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 14,
      padding: '24px 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 15, color: accent, letterSpacing: '0.18em' }}>
      {n}
    </div>
    <div style={{ fontSize: 27, fontWeight: 700, color: palette.text, lineHeight: 1.2 }}>{title}</div>
    <div style={{ fontSize: 20, color: palette.textSoft, lineHeight: 1.45 }}>{desc}</div>
  </div>
);

const Anatomy: Page = () => (
  <Stage>
    <Eyebrow>Anatomy of a harness</Eyebrow>
    <SectionTitle
      title={
        <>
          When your agent <span style={{ color: palette.accent }}>needs a harness.</span>
        </>
      }
    />
    <SubTitle>
      You can't hand an agent a <Code>/goal</Code> and walk away if it lobotomizes itself every 40
      minutes. The moment it has to run unattended, it has to do three things{' '}
      <b style={{ color: palette.text }}>alone</b>, with nobody there to correct it. Most agents do
      zero of the three, and that's the gap a harness fills.
    </SubTitle>

    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      <AnatomyBar
        n="01"
        title="Manage its own context"
        desc={
          <>
            Distill the conversation as it runs, not one lossy{' '}
            <i style={{ color: palette.text }}>summarize-and-discard</i> at the limit. Compaction is
            where agents go to die.
          </>
        }
        accent={palette.blue}
      />
      <AnatomyBar
        n="02"
        title="Survive a restart"
        desc={
          <>
            Close the terminal mid-task, reopen, and the thread comes back: same mode, model, token
            count, and memory settings. State lives on the thread, not the process.
          </>
        }
        accent={palette.accent}
      />
      <AnatomyBar
        n="03"
        title="Hold onto decisions"
        desc={
          <>
            Keep the wording of a requirement and the edge cases you flagged, unsupervised, instead
            of contradicting them right after a compaction boundary.
          </>
        }
        accent={palette.purple}
      />
    </div>

    <div
      style={{
        marginTop: 40,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderLeft: `3px solid ${palette.accent}`,
        borderRadius: 12,
        padding: '20px 26px',
        maxWidth: 1500,
      }}
    >
      <div style={{ fontSize: 22, color: palette.text, lineHeight: 1.5 }}>
        The next slides are everything we learned turning a naive agent loop into a harness that runs
        for hours: thread persistence, live task lists, interrupt / queue / steer, tools that pause
        for a human, the plan to build handoff, the approval chain, and subagents.
      </div>
    </div>

    <Footer index={4} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — The Harness class is purpose-built
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
      loop and gives you the controls (sessions, modes, steering, subagents, recovery) to build
      collaborative and headless agent products.
    </SubTitle>

    <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <ProductCard name="Claude Code" kind="Collaborative coding agent: HITL, modes, tool approval." accent={palette.accent} />
      <ProductCard name="CoWork" kind="A teammate in the loop: steerable, resumable sessions." accent={palette.blue} />
      <ProductCard name="Devin" kind="Autonomous engineer: goal-driven, long-horizon runs." accent={palette.purple} />
      <ProductCard name="Software Factory" kind="Headless agents at scale: recovery + persisted sessions." accent={palette.amber} />
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
          Leans on the steering layer: modes, tool approval, suspension, follow-ups, plan approval.
        </div>
      </Card>
      <Card accent={palette.amber} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MonoLabel color={palette.amber}>Headless · autonomous</MonoLabel>
        <div style={{ fontSize: 22, color: palette.textSoft, lineHeight: 1.4 }}>
          Leans on the autonomy layer: goal mode, subagents, saved sessions, and crash recovery.
        </div>
      </Card>
    </div>

    <Footer index={5} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — Architecture map
// ════════════════════════════════════════════════════════════════════════════
const Architecture: Page = () => (
  <Stage>
    <Eyebrow>One minute under the hood</Eyebrow>
    <SectionTitle
      title={
        <>
          Four layers.{' '}
          <span style={{ color: palette.accent }}>One agent loop.</span>
        </>
      }
    />
    <SubTitle>
      Just this one slide goes under the hood. The harness in MastraCode is a small stack of objects.
      The <Code>Harness</Code> owns config and wiring; each <Code>Session</Code> owns a conversation;
      the run engine drives one turn at a time. After this we are back to the high level.
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
        desc="One resource's conversation as focused domain objects: identity, thread, mode, model, OM, permissions."
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

    <Footer index={6} />
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
      The constructor validates your config. <Code>init()</Code> brings the runtime online and shares it
      with every backing agent. Two phases, and the agent never sees the plumbing.
    </SubTitle>

    <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Card accent={palette.green}>
        <MonoLabel color={palette.green}>Constructor · validate &amp; assemble</MonoLabel>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
          <FeatureRow
            title="Validate modes"
            desc="Catches bad config before anything runs, so misconfiguration fails loudly at startup, not mid-task."
          />
          <FeatureRow
            title="Wire up gateways"
            desc="Your model IDs get a routing layer for auth and provider selection."
          />
          <FeatureRow
            title="Pick a default mode"
            desc="The session knows where to start."
          />
        </ul>
      </Card>

      <Card accent={palette.blue}>
        <MonoLabel color={palette.blue}>init() · bring the runtime online</MonoLabel>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
          <FeatureRow
            title="Storage"
            desc="Threads, sessions, and memory get a place to live and survive restarts."
          />
          <FeatureRow
            title="Workspace &amp; browser"
            desc="A sandbox for tools to act in, resolved lazily and shared across the session."
          />
          <FeatureRow
            title="Share with every agent"
            desc="Memory, workspace, browser, and pubsub flow to each backing agent that's missing them."
          />
        </ul>
      </Card>
    </div>

    <ThesisTag>The agent never runs on config that was never checked.</ThesisTag>

    <Footer index={7} />
  </Stage>
);

const FeatureRow = ({ title, desc }: { title: string; desc: ReactNode }) => (
  <li>
    <div style={{ fontFamily: font.mono, fontSize: 19, color: palette.text, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 18, color: palette.textSoft, lineHeight: 1.4 }}>{desc}</div>
  </li>
);

const ThesisTag = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      marginTop: 28,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontSize: 21,
      color: palette.textSoft,
    }}
  >
    <span style={{ fontFamily: font.mono, fontSize: 14, color: palette.accent, letterSpacing: '0.16em' }}>
      WHY IT EARNS TRUST
    </span>
    <span style={{ color: palette.dim }}>·</span>
    <span>{children}</span>
  </div>
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
          Same agent.{' '}
          <span style={{ color: palette.accent }}>Different personalities.</span>
        </>
      }
    />
    <SubTitle>
      One conversation, but plan, build, and review each want different behavior. A mode gives the
      same agent a new personality: its instructions, its tools, and its model, swapped in place. No
      new thread, no restart, no lost context.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <Card accent={palette.accent}>
        <MonoLabel color={palette.accent}>Instructions</MonoLabel>
        <div style={{ fontSize: 20, color: palette.textSoft, lineHeight: 1.45 }}>
          Each mode brings its own prompt, layered on top of the harness instructions, so the agent
          knows what job it's doing right now.
        </div>
      </Card>
      <Card accent={palette.green}>
        <MonoLabel color={palette.green}>Tools</MonoLabel>
        <div style={{ fontSize: 20, color: palette.textSoft, lineHeight: 1.45 }}>
          A mode can replace the toolset or add to it. Plan mode reads; build mode writes and runs
          commands.
        </div>
      </Card>
      <Card accent={palette.purple}>
        <MonoLabel color={palette.purple}>Model</MonoLabel>
        <div style={{ fontSize: 20, color: palette.textSoft, lineHeight: 1.45 }}>
          Point a mode at a different model and the switch takes effect on the next turn. A cheap model
          for triage, a strong one for the hard work.
        </div>
      </Card>
    </div>

    <ThesisTag>One job stays one conversation, even as the agent changes personality.</ThesisTag>

    <Footer index={8} />
  </Stage>
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
      The tool surface isn't fixed at startup. On every turn the harness builds it fresh, then hands the
      agent live shared state so each tool acts on the real session, not a stale snapshot.
    </SubTitle>

    <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 28 }}>
      <Card>
        <MonoLabel color={palette.accent}>The toolset, assembled fresh</MonoLabel>
        <div style={{ display: 'grid', gap: 8 }}>
          <ToolsetLine sign="+" color={palette.green} label="Built-in tools" detail="task lists, ask the user, submit a plan" />
          <ToolsetLine sign="+" color={palette.green} label="Your tools" detail="whatever you wired into the harness" />
          <ToolsetLine sign="+" color={palette.blue} label="Subagents" detail="added automatically when configured" />
          <ToolsetLine sign="+" color={palette.purple} label="Mode tools" detail="extra tools for the current mode" />
          <ToolsetLine sign="−" color={palette.red} label="Anything denied" detail="tools policy or config takes off the table" />
        </div>
      </Card>

      <Card accent={palette.cyan}>
        <MonoLabel color={palette.cyan}>Live shared state</MonoLabel>
        <div style={{ fontSize: 20, color: palette.textSoft, lineHeight: 1.5 }}>
          Every tool gets a handle to the current session: where it is, what's running, the workspace to
          act in, and a way to cancel.
        </div>
        <div style={{ marginTop: 16, fontSize: 19, color: palette.textSoft, lineHeight: 1.5 }}>
          It's live, not a copy. One tool writes, the next tool reads it, so they stay in sync within the
          turn.
        </div>
      </Card>
    </div>

    <ThesisTag>It only ever holds the tools it should, nothing it shouldn't.</ThesisTag>

    <Footer index={9} />
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
          <span style={{ color: palette.accent }}>four kinds of job.</span>
        </>
      }
    />
    <SubTitle>
      A <Code>Session</Code> isn't one giant object. It's split so each concern owns its own state and
      stays out of the others' way. Four groups cover everything it does.
    </SubTitle>

    <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 22 }}>
      <GroupCard
        accent={palette.accent}
        title="The conversation"
        desc="Who it belongs to, the thread itself, and what the user sees."
        parts={['identity', 'thread', 'display', 'state']}
      />
      <GroupCard
        accent={palette.blue}
        title="What's running"
        desc="The live turn, plus the mode and model it runs under."
        parts={['stream', 'run', 'mode', 'model']}
      />
      <GroupCard
        accent={palette.green}
        title="Human in the loop"
        desc="Pausing for approval, queuing follow-ups, enforcing what's allowed."
        parts={['approval', 'suspensions', 'follow-ups', 'permissions']}
      />
      <GroupCard
        accent={palette.purple}
        title="Memory & helpers"
        desc="Long-term memory and the subagents it can hand work to."
        parts={['observational memory', 'subagents']}
      />
    </div>

    <ThesisTag>One durable conversation that holds together, not scattered state to lose.</ThesisTag>

    <Footer index={10} />
  </Stage>
);

const GroupCard = ({
  title,
  desc,
  parts,
  accent,
}: {
  title: string;
  desc: string;
  parts: string[];
  accent: string;
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 12,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
  >
    <div style={{ fontSize: 24, fontWeight: 700, color: accent }}>{title}</div>
    <div style={{ fontSize: 19, color: palette.textSoft, lineHeight: 1.45 }}>{desc}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 2 }}>
      {parts.map((p) => (
        <span
          key={p}
          style={{
            fontFamily: font.mono,
            fontSize: 15,
            color: palette.muted,
            background: palette.bg,
            border: `1px solid ${palette.border}`,
            borderRadius: 7,
            padding: '4px 10px',
          }}
        >
          {p}
        </span>
      ))}
    </div>
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
          You can talk to the agent{' '}
          <span style={{ color: palette.accent }}>while it's working.</span>
        </>
      }
    />
    <SubTitle>
      Whether the agent is idle or mid-run, a new message lands in the same place. The harness decides whether to
      join the live run or start a fresh one, so steering never feels like a different mode.
    </SubTitle>

    <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
      <Pill
        icon="✉️"
        label="Send a message"
        desc="The normal turn. If the agent is idle, it starts working and you wait for it to finish."
        accent={palette.green}
      />
      <Pill
        icon="🛞"
        label="Steer it"
        desc="Change course mid-run. The current work stops, the queue clears, and your new direction takes over."
        accent={palette.amber}
      />
      <Pill
        icon="📨"
        label="Follow up"
        desc="Add to the plan without interrupting. It queues while the agent is busy, or runs right away when idle."
        accent={palette.blue}
      />
      <Pill
        icon="🚰"
        label="Drain the queue"
        desc="When a run ends, queued follow-ups flow into the next turn so nothing you typed gets lost."
        accent={palette.cyan}
      />
    </div>

    <div
      style={{
        marginTop: 36,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderLeft: `3px solid ${palette.accent}`,
        borderRadius: 14,
        padding: '20px 26px',
        fontSize: 20,
        color: palette.textSoft,
        lineHeight: 1.5,
        maxWidth: 1500,
      }}
    >
      The win: <span style={{ color: palette.text }}>one dispatch path</span>. Every message funnels through the
      same door, so the agent is always interruptible and steerable. That is how you steer it without
      derailing the run.
    </div>

    <Footer index={11} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 09 — Run engine
// ════════════════════════════════════════════════════════════════════════════
const RunEngine: Page = () => (
  <Stage>
    <Eyebrow>The run engine</Eyebrow>
    <SectionTitle
      title={
        <>
          Raw model output,{' '}
          <span style={{ color: palette.accent }}>turned into something you can see.</span>
        </>
      }
    />
    <SubTitle>
      The model emits a fast, messy stream of tokens and events. One engine owns that loop: it watches every
      chunk, builds the live transcript you watch unfold, and decides honestly how the turn ended.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <Card>
        <MonoLabel color={palette.accent}>What's in the stream</MonoLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 17, color: palette.textSoft }}>
          {[
            'words & reasoning',
            'tool calls',
            'tool results',
            'approval prompts',
            'pauses for you',
            'how it finished',
            'memory updates',
            'terminal output',
          ].map((c) => (
            <div key={c} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span style={{ color: palette.accent }}>·</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 16, color: palette.muted, lineHeight: 1.45, marginTop: 4 }}>
          One place folds all of it into the display and the running token count.
        </div>
      </Card>

      <Card accent={palette.amber}>
        <MonoLabel color={palette.amber}>How a turn ends</MonoLabel>
        <div style={{ display: 'grid', gap: 12 }}>
          <FinishRow from="finished cleanly" to="done" color={palette.green} />
          <FinishRow from="wants a tool" to="keep going" color={palette.blue} />
          <FinishRow from="anything else" to="show the error" color={palette.red} />
          <div style={{ fontSize: 17, color: palette.muted, lineHeight: 1.45, marginTop: 4 }}>
            The point: a run that fails is never reported as a silent success. If something goes wrong, the
            engine says so instead of pretending it finished.
          </div>
        </div>
      </Card>
    </div>

    <Footer index={12} />
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
      Interrupts aren't edge cases, they're the core experience. A good harness pauses for a human at the
      moments that matter, instead of barreling ahead and asking forgiveness later.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
      <Pill
        icon="🛡️"
        label="Approve risky actions"
        desc="Before a tool does something with real consequences, the agent can stop and ask. Safe actions pass through, dangerous ones wait for a yes."
        accent={palette.green}
      />
      <Pill
        icon="⏸️"
        label="Pause to ask a question"
        desc="When the agent needs information only you have, it pauses, asks, and picks up exactly where it left off once you answer."
        accent={palette.purple}
      />
      <Pill
        icon="📋"
        label="Approve the plan first"
        desc="For bigger work, the agent proposes a plan and waits. You approve, reject, or request changes before a single line of code is touched."
        accent={palette.blue}
      />
      <Pill
        icon="⛔"
        label="Stop or redirect anytime"
        desc="Hit the brakes on a runaway run, or send a new message that waits its turn and steers what happens next."
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
        <b style={{ color: palette.cyan }}>Approval checks the action. But who checks the result?</b>{' '}
        That's the verify step, and it's important enough to get its own slide next.
      </div>
    </div>

    <Footer index={13} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 14 — Goals: verify the result
// ════════════════════════════════════════════════════════════════════════════
const Goals: Page = () => (
  <Stage>
    <Eyebrow>Goal mode</Eyebrow>
    <SectionTitle
      title={
        <>
          Hand it a goal,{' '}
          <span style={{ color: palette.accent }}>not just a task.</span>
        </>
      }
    />
    <SubTitle>
      A task runs once and stops. A goal runs until it's actually done. You give the agent a{' '}
      <Code>/goal</Code>, and after every turn a judge asks the only question that matters: are we
      there yet?
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      <Pill
        icon="🎯"
        label="Keep going"
        desc="Not there yet? The agent takes another run at it, carrying everything it just learned, up to a run limit so it never loops forever."
        accent={palette.green}
      />
      <Pill
        icon="⏸️"
        label="Pause and ask"
        desc="Stuck or unsure? Instead of guessing or quitting, it pauses with a reason and hands the decision back to you."
        accent={palette.purple}
      />
      <Pill
        icon="✅"
        label="Done, for real"
        desc="The judge confirms the goal is met, not just that the agent claims it is. The work is checked, then the run stops."
        accent={palette.cyan}
      />
    </div>

    <div
      style={{
        marginTop: 30,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderLeft: `2px solid ${palette.accent}`,
        borderRadius: 14,
        padding: '20px 26px',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <span style={{ fontSize: 26 }}>🔁</span>
      <div style={{ fontSize: 22, color: palette.text, lineHeight: 1.4 }}>
        This is the loop that lets you walk away. Try, check, retry, escalate, until the result holds
        up, not just until the model says it's finished.
      </div>
    </div>

    <ThesisTag>This is the verify step that makes long, unattended runs trustworthy.</ThesisTag>

    <Footer index={14} />
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
      As the window fills, models degrade. Observational Memory watches the token count and, before the
      window gets dangerous, rolls the conversation up into a compact summary. Watch it happen:
    </SubTitle>

    <LiveContextDemo />

    <Footer index={15} />
  </Stage>
);

// ─── Live context-fill demo (Memory slide) ───────────────────────────────────
type DemoBar = { id: number; role: 'user' | 'asst' | 'tool' | 'obs'; t: number };
const demoScript: { role: 'user' | 'asst' | 'tool'; text: string; t: number }[] = [
  { role: 'user', text: 'Fix the auth bug in login.ts', t: 1200 },
  { role: 'asst', text: 'Let me look at the file...', t: 800 },
  { role: 'tool', text: 'view("src/auth/login.ts") → 240 lines', t: 2800 },
  { role: 'asst', text: 'Found the issue: missing token refresh', t: 1500 },
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
        marginTop: 32,
        background: palette.surface,
        border: `1px solid ${palette.borderBright}`,
        borderRadius: 18,
        padding: '30px 36px',
        maxWidth: 1640,
        boxShadow: `0 0 0 1px ${palette.border}, 0 24px 60px -24px rgba(0,0,0,0.6)`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.accent, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 28 }}>
        {/* Left: meter + bars */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontFamily: font.mono, fontSize: 16, color: palette.textSoft }}>
            <span>Message tokens</span>
            <span style={{ color: pct > 85 ? palette.rose : palette.textSoft }}>
              {tokens.toLocaleString()} / {THRESHOLD.toLocaleString()} tok
            </span>
          </div>
          <div style={{ height: 22, background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: fillColor, transition: 'width 0.4s, background 0.4s' }} />
          </div>

          <div
            style={{
              marginTop: 16,
              maxHeight: 230,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column-reverse',
              gap: 5,
            }}
          >
            {[...bars].slice(-13).reverse().map((b) => (
              <div key={b.id} style={{ display: 'flex', gap: 10, alignItems: 'center', fontFamily: font.mono, fontSize: 13 }}>
                <span style={{ width: 44, color: roleColor(b.role), letterSpacing: '0.06em' }}>{b.role}</span>
                <div
                  style={{
                    height: 12,
                    borderRadius: 4,
                    background: roleColor(b.role),
                    opacity: b.role === 'obs' ? 0.95 : 0.55,
                    width: `${Math.min(100, (b.t / 5200) * 100)}%`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: OM stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
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
      fontSize: 16,
      color: palette.text,
      background: palette.surfaceHi,
      border: `1px solid ${palette.borderBright}`,
      borderRadius: 8,
      padding: '9px 18px',
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
      borderRadius: 12,
      padding: '18px 22px',
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 14,
    }}
  >
    <span style={{ fontFamily: font.display, fontSize: text ? 26 : 42, fontWeight: 800, color: accent, letterSpacing: '-0.02em' }}>
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
      The agent can hand a piece of work to a helper agent and keep going. Two flavors: a fresh helper
      that starts clean, or a forked helper that inherits the conversation so far.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Card accent={palette.blue} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: palette.text }}>Fresh</div>
        <div style={{ fontFamily: font.mono, fontSize: 15, color: palette.blue, letterSpacing: '0.14em' }}>
          STARTS CLEAN
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 19, color: palette.textSoft, lineHeight: 1.4 }}>
          <li>· Its own setup: instructions, tools, and model</li>
          <li>· Cannot see the parent conversation</li>
          <li>· The task has to carry everything it needs</li>
          <li>· Best for self-contained, well-scoped jobs</li>
        </ul>
      </Card>

      <Card accent={palette.accent} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: palette.text }}>Forked</div>
        <div style={{ fontFamily: font.mono, fontSize: 15, color: palette.accent, letterSpacing: '0.14em' }}>
          INHERITS THE CONTEXT
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 19, color: palette.textSoft, lineHeight: 1.4 }}>
          <li>· Picks up a copy of the conversation so far</li>
          <li>· Reuses the prompt cache, so it is cheaper and faster</li>
          <li>· No need to re-explain the context in the task</li>
          <li>· Best when the work depends on what just happened</li>
        </ul>
      </Card>
    </div>

    <div style={{ marginTop: 30, fontSize: 19, color: palette.textSoft }}>
      <span style={{ color: palette.muted }}>Either way, the helper runs on its own and reports a result back to the main agent.</span>
    </div>

    <Footer index={16} />
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
      Every session is saved as it runs. Close the laptop, crash the process, come back tomorrow, and
      the agent picks up exactly where it left off, including anything it was waiting on.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 28 }}>
      <Card>
        <MonoLabel color={palette.accent}>What gets saved</MonoLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 17, color: palette.textSoft }}>
          {[
            'Who owns it and which thread',
            'Its parent, if it is a subagent',
            'The mode and model in use',
            'The title',
            'Any saved settings and state',
            'What it is waiting on',
            'When it started and was last active',
            'Where it came from',
          ].map((c) => (
            <div key={c} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span style={{ color: palette.accent }}>·</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 17, color: palette.muted, lineHeight: 1.45 }}>
          Each save keeps the original creation time and bumps a last-active timestamp, so you always
          know the most recent session to resume.
        </div>
      </Card>

      <Card accent={palette.amber}>
        <MonoLabel color={palette.amber}>What it can resume from</MonoLabel>
        <div style={{ display: 'grid', gap: 10 }}>
          <PendingRow kind="A tool call" desc="waiting on approve or deny" color={palette.green} />
          <PendingRow kind="An interactive tool" desc="waiting on your input" color={palette.purple} />
          <PendingRow kind="A question" desc="waiting on your answer" color={palette.blue} />
          <PendingRow kind="A submitted plan" desc="waiting on a decision" color={palette.cyan} />
        </div>
        <div style={{ marginTop: 14, fontSize: 16, color: palette.muted, lineHeight: 1.45 }}>
          Each one is remembered until it is answered, cancelled, or it fails, so nothing in flight is
          silently lost.
        </div>
      </Card>
    </div>

    <Footer index={17} />
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
    <span style={{ fontSize: 17, fontWeight: 600, color, minWidth: 210 }}>{kind}</span>
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
      <Check item="Switch behavior, tools, and model mid-chat" tag="Modes" />
      <Check item="The right tools assembled fresh each turn" tag="Toolsets" />
      <Check item="Route any model from any provider" tag="Gateways" />
      <Check item="One conversation, cleanly organized" tag="Session" />
      <Check item="Talk to the agent while it works" tag="Messages" />
      <Check item="Raw model output turned human-readable" tag="RunEngine" />
      <Check item="Approve, pause, or redirect any action" tag="Steering" />
      <Check item="Verify the work, then keep or retry" tag="Goals" />
      <Check item="Compaction before the context fills up" tag="Memory" />
      <Check item="Hand work to fresh or forked helpers" tag="Subagents" />
      <Check item="A safe sandbox and a real browser" tag="Workspace" />
      <Check item="Survive a restart, resume mid-flight" tag="Storage" />
    </div>

    <div style={{ marginTop: 32, fontSize: 24, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.5 }}>
      None of this is a roadmap. Every box is shipping code you can read today in{' '}
      <span style={{ color: palette.accent }}>packages/core/src/harness</span>.
    </div>

    <Footer index={18} />
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
      This is what turns a rented, non-deterministic model into something you can trust with real work,
      and all of it is open. The frontier from here is long-horizon autonomy: agents that run for hours,
      check their own work, and recover on their own.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
      <Pill
        icon="🔄"
        label="Long-Horizon Execution"
        desc="Runs already resume after a restart. Next: agents that work for hours, check their own progress, and recover on their own."
        accent={palette.green}
      />
      <Pill
        icon="🤖"
        label="Parallel Orchestration"
        desc="Agents already hand work to helpers. Next: many helpers running at once, coordinating through the harness without stepping on each other."
        accent={palette.blue}
      />
      <Pill
        icon="🧬"
        label="Model and Harness Co-evolution"
        desc="Better tools make agents better. Better agents make richer harnesses. A loop that compounds."
        accent={palette.purple}
      />
      <Pill
        icon="🔧"
        label="Dynamic Harnesses"
        desc="The agent builds its own harness for the task: the tools, the guardrails, and the verify step, generated on the fly. Plan-mode on steroids."
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
        <b style={{ color: palette.accent }}>MastraCode</b>, on top of the Mastra framework. The
        harness is open-source and ready to extend.
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 24, fontFamily: font.mono, fontSize: 16 }}>
        <span style={{ color: palette.accent }}>📖 mastra.ai</span>
        <span style={{ color: palette.textSoft }}>💻 github.com/mastra-ai</span>
        <span style={{ color: palette.textSoft }}>💬 discord.gg/mastra</span>
      </div>
    </div>

    <Footer index={19} />
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
  `Welcome them. Two presenters: Abhi (CTO) and Alex (Head of DX). This is a code-grounded tour of the actual harness inside MastraCode: the Harness class, the Session, and the run engine. Everything we show maps to packages/core/src/harness.`,

  // 02 Everywhere
  `Frame the confusion before defining anything. "Harness" is suddenly everywhere: OpenAI, Stripe, Thoughtworks, Anthropic, Devin all use it. Agent = Model + Harness ("everything except the model") is technically true but useless. The plain-English version (credit Tejas Kumar's talk): a harness is everything around the model that grounds it in reality (tools, context, guardrails, a verify step) so a rented, non-deterministic black box behaves RELIABLY. That's the real why: reliability irrespective of which model the provider actually serves you. It splits into two layers: the OUTER harness (Fowler/Böckeler: guides + sensors a team builds around an agent to earn trust and supervise less) and the INNER / built-in harness (the loop, tools, memory, recovery behind Claude Code). Same word, two layers, one job. Next slide pins them down and shows where Mastra sits.`,

  // 03 Spectrum
  `Mental model. A spectrum of opinionation: raw code (total flexibility + total responsibility) → framework (building blocks — Mastra, CrewAI, LangChain) → harness (a complete system, all wired). But "harness" itself splits in two. INNER / built-in harness = the orchestration substrate that makes an agent RUN (the loop, tool execution, memory, retrieval) — Mastra ships this as the Agent. OUTER harness = the guides + sensors that make an agent TRUSTWORTHY (modes, steering, tool approval, sessions, recovery) — you BUILD that with the Harness class. The punchline: Mastra is both — it ships the inner harness and gives you the Harness class to build the outer one. The rest of the talk is what's inside that Harness class.`,

  // 04 Anatomy
  `The three-bar test (credit Sam's "Compaction is where coding agents go to die"). The punchline: you can't hand a harness a /goal and go to sleep if it lobotomizes itself every 40 minutes. The moment an agent has to run unattended it has to do three things ALONE, with nobody there to correct it, and most agents do zero of the three. That gap is exactly what a harness fills. (1) Manage its own context: distill the conversation as it goes instead of one lossy summarize-and-discard at the limit. (2) Survive a restart: close the terminal mid-task, reopen, and the thread returns with the same mode, model, token count, and memory settings, because state lives on the thread and not the process. (3) Hold onto decisions unsupervised: keep the exact requirement wording and the edge cases you flagged instead of contradicting them right after a compaction boundary. Tee up the rest of the deck: thread persistence, live task lists, interrupt / queue / steer, tools that pause for a human, the plan to build handoff, the approval chain, and subagents are how we pass all three.`,

  // 05 PurposeBuilt
  `Now make it concrete. Claude Code IS an outer harness. Mastra's Harness class is purpose-built to let you build one: it wraps the agent loop and gives you the controls. The same class powers Claude Code (collaborative coding agent), CoWork (a teammate in the loop), Devin (autonomous engineer), and headless software-factory agents. Two operating points, same class: collaborative / HITL products lean on the steering layer (modes, tool approval, suspension, follow-ups, plan approval); headless / autonomous products lean on the autonomy layer (goal mode, subagents, persisted SessionRecords + recovery). Everything from here shows what's inside that Harness class.`,

  // 06 Architecture
  `The architecture map. Four layers: Harness owns config + wiring (createSession, init, buildToolsets). Session owns one resource's conversation as small domain objects. SessionRunEngine drives one turn — folding the agent's event stream into display messages and token usage. Tools + Storage provide built-ins, subagents, and persistence. Everything below the Harness ultimately wraps a single Mastra Agent. The next slides walk each layer.`,

  // 07 The Harness
  `The container. The constructor validates before it assembles: validateModes() enforces unique mode IDs, blocks setting both tools and additionalTools, and validates transitionsTo (no self-reference, no unknown target). It builds the GatewayManager from your gateways plus defaultGateways, and resolves defaultMode. init() creates an internal Mastra only when storage exists and there's no parent Mastra; otherwise it initializes inherited storage on the external one. Workspace and browser can be instances or lazy factories (factory resolves with { requestContext, mastra } and is cached). Then it propagates memory/workspace/browser/pubsub into each backing agent that's missing them and starts heartbeats.`,

  // 08 Modes
  `Modes. It's the same agent loop the whole time, but plan, build, and review each want different behavior, so a mode gives that same agent a different personality by swapping three things in place: instructions, tools, and model. Instructions: each mode layers its own prompt on top of the harness instructions. Tools: a mode can replace the toolset or just add to it, so plan mode reads while build mode writes and runs commands. Model: point a mode at a different model and the switch takes effect on the next turn, cheap for triage and strong for the hard work. The key property is that all of this happens in place, with no new thread, no restart, and no lost context. Under the hood it's gateway-driven model routing and a cached per-mode agent, but on stage keep it at the three-swaps level.`,

  // 09 Prompts & request context
  `What the agent can do is assembled fresh every turn, not fixed at startup. The harness adds it up: built-in tools (task lists, ask the user, submit a plan), your own tools, subagents when configured, and extra tools for the current mode, then subtracts anything policy or config denies. Then it hands the agent live shared state: a handle to the current session, where it is, what's running, the workspace to act in, and a way to cancel. The important part is that the state is live, not a copy, so when one tool writes the next tool reads it and they stay in sync within the turn. Under the hood this is buildToolsets() plus buildRequestContext(), but keep it at assembled-fresh plus live-shared-state.`,

  // 10 Session domains
  `The Session is not a god-object. Don't read out a list of fourteen things, frame it as four jobs. The conversation: who it belongs to, the thread itself, and what the user sees (identity, thread, display, state). What's running: the live turn plus the mode and model it runs under (stream, run, mode, model). Human in the loop: pausing for approval, queuing follow-ups, enforcing what's allowed (approval, suspensions, follow-ups, permissions). Memory and helpers: long-term memory and subagents it can hand work to (OM, subagents). The point is the split itself, each concern owns its state and stays out of the others' way, which keeps the run loop and steering logic readable.`,

  // 11 Message flow
  `The headline: you can talk to the agent while it's working, and it always feels like the same conversation. There are four ways in, but don't read them as APIs, read them as user intents. Send a message is the normal turn. Steer it changes course mid-run: abort what's happening, clear the queue, take the new direction. Follow up adds to the plan without interrupting: it queues while busy, runs immediately when idle. Drain the queue is the cleanup: when a run ends, queued follow-ups flow into the next turn so nothing gets lost. The reason this works is one dispatch path. Under the hood they all funnel into sendSignal(), which ensures the thread and subscription exist, declines a pending tool approval when a new message interrupts a run, waits out the post-abort window, then hands off with ifActive / ifIdle semantics: join the live run, or start a fresh one. Because every message goes through that single door, the agent is always interruptible and steerable, and all the messy abort-and-requeue logic lives in one place instead of scattered across the UI.`,

  // 12 Run engine
  `The model doesn't hand you clean messages, it emits a fast stream of tokens and events. The big idea here is that one component, the SessionRunEngine, owns that loop and turns the raw stream into the transcript a human actually watches. Concretely processStreamChunk handles text and reasoning, tool-call input, tool results and errors, approval and suspension events, finish/error/goal, the OM lifecycle, system reminders, signals and user messages, and sandbox stdout/stderr, folding all of it into display messages and a running token count. The second half is finishing honestly. Finish-reason mapping: stop and end-turn map to complete; tool-calls maps to tool_use, meaning keep going; anything else surfaces as a terminal error via describeNonSuccessFinishReason() instead of a silent complete, and server-side fallback models emit an info notice. The takeaway to say out loud: a failed run is never dressed up as a success.`,

  // 13 Steering
  `The frame: a good harness asks, it doesn't just act. Walk the four pills as moments, not APIs. Approve risky actions: on a tool call the engine runs resolveToolApproval() — fixed policies auto-approve or auto-deny, otherwise it arms approval state and emits tool_approval_required, then routes approve/decline. Pause to ask a question: interactive tools like ask_user suspend the run, surface a question, and resume on the answer. Approve the plan first: submit_plan gates intent before any code changes. Stop or redirect: abort kills runaway runs, and the follow-up queue holds the next message until it's safe to send. Close on the verify handoff: approval checks the ACT, but who checks the RESULT? That's the verify step, and it gets its own slide next.`,

  // 14 Goals
  `Goal mode is the verify step, and it's the heart of the reliability story (Tejas's harness pillar: approval checks the action, verification checks the result). The frame: a task runs once and stops, a goal runs until it's actually done. You give the agent a /goal — a persistent objective — and after every turn a judge scores it and decides what happens next. Walk the three outcomes as moments, not APIs. Keep going: not passed yet, so it takes another run carrying what it just learned, bounded by goalMaxTurns so it never loops forever. Pause and ask: stuck or unsure, so it pauses with a reason and hands the decision back to the user instead of guessing. Done for real: the judge confirms the goal is met, not just that the model claims it is. Under the hood that's GoalEvaluationPayload — objective, iteration, maxRuns, passed, status active|paused|done, scorer results, reason, pausedReason, isContinued — a deterministic verify-and-retry loop, model- and scorer-driven. The takeaway: this is the loop that lets you walk away and trust the result.`,

  // 15 Memory
  `Run the demo, that's the whole slide. Hit Start and let the token meter climb as messages stack up; when it nears the threshold the window collapses into a compact summary and the bar count drops. That's Observational Memory. The point to land: context rot is real, as the window fills models degrade, so the harness compacts before it gets dangerous. The real numbers behind the demo (mention if asked): default observation threshold is 30,000 message tokens, where the observer summarizes recent turns into observations; default reflection threshold is 40,000 observation tokens, where observations distill into reflections. In-flight observations and reflections are buffered and restored on reload, so progress survives restarts. Compaction is where coding agents go to die, this is how the harness keeps it from dying.`,

  // 16 Subagents
  `Subagents. When configured, createSubagentTool() exposes one subagent tool; each call picks an agentType (enum), a task, and optionally forked. Non-forked runs use the subagent definition's own config — its own instructions, tools, and model — and can't see the parent conversation, so the task must carry all context; a per-call modelId override is allowed. Forked runs reuse the parent agent and a cloned parent thread to keep the prompt prefix cache-friendly; they require memory, ignore modelId (parent's model is used), and tag the clone with forkedSubagent + parentThreadId so it's hidden from thread pickers. Resolution is forked ?? definition.forked ?? false.`,

  // 17 Persistence
  `Sessions survive a restart. HarnessStorage persists each session as a SessionRecord: owner/resource/thread IDs, parent + subagent lineage, origin and source metadata, modeId/modelId, title, metadata and state blobs, pending items, and timestamps. updateSession() preserves id and createdAt and refreshes lastActivityAt. Origins are top-level, subagent-tool, direct-local, remote-resolve. Pending items are the resume points: tool-approval, tool-suspension, question, and plan-approval — each moving through pending → responded / canceled / failed. So a resumed session knows exactly what it was waiting on.`,

  // 18 Checklist
  `The bar — and it's all real. Validated modes that re-resolve the agent, per-turn toolset assembly with deny filtering, gateway-driven multi-model routing, the Session split into domains, the message flow, the run engine folding the stream, full steering (tool approval / suspension / plan approval), goal mode + judge-driven verification, observational memory on token thresholds, forked + non-forked subagents, a sandboxed workspace + browser, and persisted SessionRecords with pending items. Every box maps to code in packages/core/src/harness — nothing aspirational.`,

  // 19 Futures
  `What's next. The foundation is here; the frontier is long-horizon autonomous execution. Four directions, each grounded in what already exists: long-horizon execution (pending items + SessionRecords already make runs resumable — next is checkpoints, rollback, self-verification), parallel orchestration (subagents today — next is many in parallel coordinating through the harness), model-harness co-evolution (a compounding loop), and dynamic harnesses (buildToolsets already composes per turn — next, per Tejas's 2027 prediction, the agent generates its own harness for the task: tools, guardrails, and a verify step on the fly — plan-mode on steroids). Close: it's all in MastraCode, open-source, ready to extend. Now go build it.`,
];

export default [
  Cover,
  Everywhere,
  Spectrum,
  Anatomy,
  PurposeBuilt,
  Architecture,
  TheHarness,
  Modes,
  PromptsContext,
  SessionDomains,
  MessageFlow,
  RunEngine,
  Steering,
  Goals,
  Memory,
  Subagents,
  Persistence,
  Checklist,
  Futures,
] satisfies Page[];
