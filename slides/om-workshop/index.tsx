import { Fragment, useEffect, useState, type CSSProperties } from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import abhiAvatar from './assets/abhi-avatar.jpg';

// ─── Design tokens ───────────────────────────────────────────────────────────
// Matches the Mastra brand surface used in browser-channels:
//   bg #020202, foreground #d9d9d9, primary #18fb6f.
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
  typeScale: {
    hero: 168,
    body: 36,
  },
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

const TOTAL = 13;

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
    <span>MASTRA · OBSERVATIONAL MEMORY + HARNESS</span>
    <span>
      {String(index).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
    </span>
  </div>
);

const Stage = ({ children, padding = '120px 120px 120px' }: { children: React.ReactNode; padding?: string }) => (
  <div style={{ ...fill, padding, display: 'flex', flexDirection: 'column' }}>{children}</div>
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
          fontSize: 184,
          fontWeight: 900,
          lineHeight: 0.94,
          margin: '36px 0 28px',
          letterSpacing: '-0.04em',
          maxWidth: 1600,
        }}
      >
        Building agents
        <br />
        that <span style={{ color: palette.accent }}>never forget.</span>
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
        From human-inspired memory to a steerable, observable, multi-model{' '}
        <b style={{ color: palette.text }}>harness</b>.
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 24,
          marginBottom: 56,
          maxWidth: 1400,
        }}
      >
        <ArcCard label="Observational Memory" desc="Why agents forget &amp; how to fix it" accent={palette.green} />
        <Arrow />
        <ArcCard label="The Harness" desc="Stateful orchestrator of agents" accent={palette.blue} />
        <Arrow />
        <ArcCard label="MastraCode" desc="Production coding agent — proof in the field" accent={palette.purple} />
      </div>

      <div style={{ display: 'flex', gap: 64 }}>
        <Author name="Abhi Aiyer" role="Founder / CTO, Mastra" avatar={abhiAvatar} />
        <Author name="Shane Thomas" role="Founder / CPO, Mastra" />
      </div>
    </div>

    <Footer index={1} />
  </div>
);

const ArcCard = ({ label, desc, accent }: { label: string; desc: string; accent: string }) => (
  <div
    style={{
      flex: 1,
      padding: '28px 32px',
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderRadius: 16,
      borderTop: `2px solid ${accent}`,
    }}
  >
    <div
      style={{
        fontFamily: font.mono,
        fontSize: 16,
        color: accent,
        marginBottom: 12,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 22, color: palette.textSoft, lineHeight: 1.35 }} dangerouslySetInnerHTML={{ __html: desc }} />
  </div>
);

const Arrow = () => (
  <div aria-hidden style={{ display: 'flex', alignItems: 'center', color: palette.muted, fontSize: 28 }}>
    →
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

// ════════════════════════════════════════════════════════════════════════════
// Shared section atoms used by slides 02–11
// ════════════════════════════════════════════════════════════════════════════
const SectionTitle = ({ title }: { title: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: font.display,
      fontSize: 92,
      fontWeight: 800,
      lineHeight: 1.02,
      letterSpacing: '-0.025em',
      margin: '20px 0 22px',
      maxWidth: 1600,
      color: palette.text,
    }}
  >
    {title}
  </h1>
);

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 32, color: palette.textSoft, lineHeight: 1.4, maxWidth: 1500, margin: 0 }}>{children}</p>
);

const Pill = ({
  icon,
  label,
  desc,
  accent = palette.accent,
}: {
  icon?: React.ReactNode;
  label: string;
  desc?: React.ReactNode;
  accent?: string;
}) => (
  <div
    style={{
      flex: 1,
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 14,
      padding: '24px 28px',
      minHeight: 120,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      {icon && <span style={{ fontSize: 28 }}>{icon}</span>}
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
    {desc && <div style={{ fontSize: 22, color: palette.textSoft, lineHeight: 1.45 }}>{desc}</div>}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 02 — The Problem
// ════════════════════════════════════════════════════════════════════════════
const TheProblem: Page = () => (
  <Stage>
    <Eyebrow>The Problem</Eyebrow>
    <SectionTitle
      title={
        <>
          LLMs read enormous context.{' '}
          <span style={{ color: palette.accent }}>Agents drown in it.</span>
        </>
      }
    />
    <SubTitle>
      The most common fix — retrieve the signal each turn — runs the same pipeline on every message.
      Different context every turn. No continuity. Cache miss every time.
    </SubTitle>

    <div style={{ marginTop: 64 }}>
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 14,
          letterSpacing: '0.2em',
          color: palette.muted,
          marginBottom: 20,
          textTransform: 'uppercase',
        }}
      >
        The retrieval pattern · every turn
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {[
          { icon: '💬', label: 'User msg' },
          { icon: '🔢', label: 'Embed' },
          { icon: '🗃️', label: 'Vector DB' },
          { icon: '📊', label: 'Rank' },
          { icon: '💉', label: 'Inject' },
          { icon: '🤖', label: 'LLM' },
        ].map((node, i, arr) => (
          <PipeNode key={node.label} icon={node.icon} label={node.label} last={i === arr.length - 1} />
        ))}
      </div>

      <div
        style={{
          marginTop: 48,
          fontSize: 28,
          color: palette.textSoft,
          maxWidth: 1500,
          lineHeight: 1.4,
        }}
      >
        Different context <span style={{ color: palette.red }}>every turn</span>. Different results{' '}
        <span style={{ color: palette.red }}>every query</span>. Cache miss{' '}
        <span style={{ color: palette.red }}>every time</span>.
      </div>
    </div>

    <Footer index={2} />
  </Stage>
);

const PipeNode = ({ icon, label, last }: { icon: string; label: string; last?: boolean }) => (
  <>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        minWidth: 160,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 44,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 16,
          color: palette.textSoft,
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </div>
    </div>
    {!last && (
      <div
        aria-hidden
        style={{
          flex: 1,
          height: 2,
          background: palette.border,
          maxWidth: 80,
        }}
      />
    )}
  </>
);

// ════════════════════════════════════════════════════════════════════════════
// 03 — The Insight
// ════════════════════════════════════════════════════════════════════════════
const TheInsight: Page = () => (
  <Stage>
    <Eyebrow>The Insight</Eyebrow>
    <SectionTitle
      title={
        <>
          What if{' '}
          <span style={{ color: palette.accent }}>forgetting is a feature?</span>
        </>
      }
    />
    <SubTitle>
      Humans don't store everything. We compress, abstract, and forget — that's what makes us coherent. Three agents, one memory.
    </SubTitle>

    <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
      <Pill
        icon="💬"
        label="Actor"
        desc="Drives the conversation, calls tools, ships work. Sees only what it needs to act."
        accent={palette.green}
      />
      <Pill
        icon="👁️"
        label="Observer"
        desc="Watches every turn. Extracts signal — entities, preferences, decisions. Always running."
        accent={palette.blue}
      />
      <Pill
        icon="🔄"
        label="Reflector"
        desc="Compacts observed signal into stable working memory. The agent's subconscious."
        accent={palette.purple}
      />
    </div>

    <ObserverReflectorDemo />

    <Footer index={3} />
  </Stage>
);

// ─── Live Observer / Reflector demo (Insight slide) ──────────────────────────
type Turn = { role: 'user' | 'asst'; text: string; obs?: string };
const insightScript: Turn[] = [
  { role: 'user', text: 'Planning a trip to Japan in March', obs: 'destination: Japan, timeframe: March (cherry blossom season)' },
  { role: 'asst', text: 'Late March is peak cherry blossoms — Tokyo + Kyoto are the classic pair.' },
  { role: 'user', text: "I'm vegetarian, is that hard there?", obs: 'constraint: vegetarian' },
  { role: 'asst', text: 'Dashi is everywhere. Shojin ryori (Buddhist temple cuisine) is fully veg.' },
  { role: 'user', text: 'Mid-range budget, not luxury', obs: 'budget: mid-range (~$150-200/day)' },
  { role: 'asst', text: '~$150-200/day works. Business hotels or ryokans, 14-day JR Pass ~$450.' },
  { role: 'user', text: 'Look up flights from SFO?' },
  { role: 'asst', text: 'ANA $1,250 direct, JAL $1,180 direct, United $980 with a stop.', obs: 'preference: SFO origin · flight options surfaced' },
  { role: 'user', text: 'JAL it is.', obs: 'decision: airline = JAL' },
  { role: 'asst', text: 'Booked the search. Hotels near Shinjuku next?' },
  { role: 'user', text: 'Yeah, Shinjuku.' },
  { role: 'asst', text: 'Hotel Gracery $165 (the Godzilla one), Granbell $120, Keio Plaza $280.' },
  { role: 'user', text: 'Day trips from Kyoto?' },
  { role: 'asst', text: 'Nara, Osaka, Himeji. Kintetsu to Nara is 35 min, ¥640.', obs: 'interest: day trips from Kyoto' },
];

const RAW_LIMIT = 1200; // chars
const OBS_THRESHOLD = 0.85;

function ObserverReflectorDemo() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [observations, setObservations] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [compactions, setCompactions] = useState(0);

  const rawChars = turns.reduce((sum, t) => sum + t.text.length, 0);
  const rawPct = Math.min(100, (rawChars / RAW_LIMIT) * 100);

  useEffect(() => {
    if (!running) return;
    if (step >= insightScript.length) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => {
      const turn = insightScript[step];
      setTurns(prev => [...prev, turn]);
      if (turn.obs) setObservations(prev => [...prev, turn.obs!]);

      // Reflector fires
      if ((rawChars + turn.text.length) / RAW_LIMIT >= OBS_THRESHOLD) {
        setTimeout(() => {
          setTurns(prev => prev.slice(-2)); // keep last 2 turns
          setCompactions(c => c + 1);
        }, 500);
      }
      setStep(s => s + 1);
    }, 750);
    return () => clearTimeout(t);
  }, [running, step, rawChars]);

  const reset = () => {
    setRunning(false);
    setTurns([]);
    setObservations([]);
    setStep(0);
    setCompactions(0);
  };

  const meterColor = rawPct > 85 ? palette.rose : rawPct > 60 ? palette.amber : palette.accent;

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
        <div style={{ fontFamily: font.mono, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: palette.muted }}>
          Live · chat → Observer → Reflector → compact
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!running && step < insightScript.length && (
            <DemoBtnInsight onClick={() => setRunning(true)}>{step === 0 ? '▶ Start' : '▶ Resume'}</DemoBtnInsight>
          )}
          {running && <DemoBtnInsight onClick={() => setRunning(false)}>⏸ Pause</DemoBtnInsight>}
          {(step > 0) && <DemoBtnInsight onClick={reset}>↺ Reset</DemoBtnInsight>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        {/* Left: Actor's chat */}
        <div>
          <div style={subLabel}>Actor's view (raw context)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: font.mono, fontSize: 12, color: palette.textSoft }}>
            <span>{rawChars} / {RAW_LIMIT} chars</span>
            <span style={{ color: meterColor }}>{compactions > 0 ? `compacted ${compactions}×` : 'building'}</span>
          </div>
          <div style={{ height: 8, background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${rawPct}%`, background: meterColor, transition: 'width 0.4s, background 0.4s' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflow: 'hidden' }}>
            {turns.slice(-6).map((t, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: '6px 10px',
                  borderRadius: 6,
                  background: t.role === 'user' ? `${palette.green}14` : palette.bg,
                  border: `1px solid ${palette.border}`,
                  color: palette.textSoft,
                  lineHeight: 1.4,
                }}
              >
                <span style={{ fontFamily: font.mono, fontSize: 10, color: palette.muted, marginRight: 8, letterSpacing: '0.1em' }}>{t.role.toUpperCase()}</span>
                {t.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Observer + Reflector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={subLabel}>Observer (always running)</div>
            <div
              style={{
                background: palette.bg,
                border: `1px solid ${palette.blue}40`,
                borderRadius: 8,
                padding: '8px 12px',
                minHeight: 100,
                maxHeight: 130,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {observations.length === 0 && (
                <span style={{ fontFamily: font.mono, fontSize: 11, color: palette.muted, fontStyle: 'italic' }}>watching...</span>
              )}
              {observations.slice(-5).map((o, i) => (
                <div key={i} style={{ fontFamily: font.mono, fontSize: 11, color: palette.textSoft, lineHeight: 1.5 }}>
                  <span style={{ color: palette.blue }}>›</span> {o}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={subLabel}>Reflector (working memory)</div>
            <div
              style={{
                background: palette.bg,
                border: `1px solid ${palette.purple}40`,
                borderRadius: 8,
                padding: '8px 12px',
                fontFamily: font.mono,
                fontSize: 11,
                color: palette.textSoft,
                lineHeight: 1.6,
                minHeight: 70,
              }}
            >
              {compactions === 0 ? (
                <span style={{ color: palette.muted, fontStyle: 'italic' }}>idle — fires at threshold</span>
              ) : (
                <>
                  <div style={{ color: palette.purple, marginBottom: 4 }}>● Compacted {compactions}× — context replaced with summary:</div>
                  <div>Trip: Japan, late March. Veg, mid-budget. JAL SFO→Tokyo. Hotels near Shinjuku. Kyoto + day trips next.</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const subLabel: CSSProperties = {
  fontFamily: font.mono,
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: palette.muted,
  marginBottom: 6,
};

function DemoBtnInsight({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: `1px solid ${palette.border}`,
        color: palette.text,
        fontFamily: font.mono,
        fontSize: 12,
        padding: '5px 12px',
        borderRadius: 6,
        cursor: 'pointer',
        letterSpacing: '0.06em',
      }}
    >
      {children}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 04 — The Harness
// ════════════════════════════════════════════════════════════════════════════
const TheHarness: Page = () => (
  <Stage>
    <Eyebrow>What is an agent harness?</Eyebrow>
    <SectionTitle
      title={
        <>
          One loop.{' '}
          <span style={{ color: palette.accent }}>Every part of the agent</span>{' '}
          plugged into it.
        </>
      }
    />
    <SubTitle>
      The harness is the stateful orchestrator: it assembles prompts, swaps modes, gates tools,
      streams events, and enforces policy. The agent is just the model in the middle.
    </SubTitle>

    <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22 }}>
      <Pill icon="📝" label="Prompts" desc="System, mode, tools, tasks, skills — assembled per turn." accent={palette.green} />
      <Pill icon="🎛️" label="Modes" desc="Build, plan, fast, review, triage. Each rewires the agent." accent={palette.blue} />
      <Pill icon="📁" label="Workspace" desc="Sandboxed filesystem and shell. Skills as a catalog." accent={palette.purple} />
      <Pill icon="🛡️" label="Steering" desc="Approve, deny, abort, ask. Interrupts are core UX." accent={palette.amber} />
      <Pill icon="📡" label="Events" desc="Streaming, protocols, multi-model. Everything observable." accent={palette.rose} />
      <Pill icon="💰" label="Policies" desc="Permissions, token budget, cost guardrails." accent={palette.text} />
    </div>

    <Footer index={4} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — Prompts & Context
// ════════════════════════════════════════════════════════════════════════════
const PromptsContext: Page = () => (
  <Stage>
    <Eyebrow>System Prompts &amp; Context</Eyebrow>
    <SectionTitle
      title={
        <>
          The system prompt is{' '}
          <span style={{ color: palette.accent }}>not a static string.</span>
        </>
      }
    />
    <SubTitle>
      The harness assembles the prompt every turn from environment, mode, tools, tasks, and skills.
      Slash commands let users actively re-orient mid-conversation.
    </SubTitle>

    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <div>
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 14,
            letterSpacing: '0.2em',
            color: palette.muted,
            marginBottom: 16,
            textTransform: 'uppercase',
          }}
        >
          Passive · assembled per turn
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          {[
            ['ENVIRONMENT', 'cwd, project, branch, platform'],
            ['MODE PROMPT', 'BUILD / PLAN / FAST behavior'],
            ['AVAILABLE TOOLS', 'tool list injected per mode'],
            ['ACTIVE TASKS', 'current todo list from state'],
            ['AGENTS.MD', 'project-specific instructions'],
            ['SKILLS', 'available skill catalog'],
          ].map(([k, v]) => (
            <li
              key={k}
              style={{
                background: palette.surface,
                border: `1px solid ${palette.border}`,
                borderRadius: 10,
                padding: '14px 18px',
                display: 'flex',
                gap: 18,
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontFamily: font.mono, fontSize: 14, color: palette.accent, letterSpacing: '0.14em', minWidth: 200 }}>
                {k}
              </span>
              <span style={{ fontSize: 20, color: palette.textSoft }}>{v}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 14,
            letterSpacing: '0.2em',
            color: palette.muted,
            marginBottom: 16,
            textTransform: 'uppercase',
          }}
        >
          Active · slash commands
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['/mode build', 'switch to build'],
            ['/model opus', 'change provider'],
            ['/compact', 'force compaction'],
            ['/yolo on', 'auto-approve tools'],
            ['/pr-review', 'review current PR'],
            ['/pr-new', 'create PR'],
            ['/thread new', 'fresh conversation'],
            ['/sandbox ~/x', 'grant path access'],
          ].map(([cmd, desc]) => (
            <div
              key={cmd}
              style={{
                background: palette.surface,
                border: `1px solid ${palette.border}`,
                borderRadius: 10,
                padding: '14px 16px',
              }}
            >
              <div style={{ fontFamily: font.mono, fontSize: 18, color: palette.accent }}>{cmd}</div>
              <div style={{ fontSize: 16, color: palette.muted, marginTop: 4 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <Footer index={5} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 06 — Workspace
// ════════════════════════════════════════════════════════════════════════════
const Workspace: Page = () => (
  <Stage>
    <Eyebrow>Workspace</Eyebrow>
    <SectionTitle
      title={
        <>
          The agent needs a{' '}
          <span style={{ color: palette.accent }}>place to work.</span>
        </>
      }
    />
    <SubTitle>
      Skills as a discoverable catalog. A sandboxed filesystem. Purpose-built tools — not bash and pray.
    </SubTitle>

    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <Pill
        icon="🧩"
        label="Skills"
        desc={
          <>
            Discoverable capabilities the agent activates on demand. Listed in the prompt as a catalog —
            not loaded upfront.{' '}
            <code style={{ fontFamily: font.mono, fontSize: 18, color: palette.accent }}>
              .mastracode/skills/
            </code>
          </>
        }
        accent={palette.green}
      />
      <Pill
        icon="📁"
        label="Filesystem &amp; Sandbox"
        desc={
          <>
            Reads and writes scoped to the project root. Shell execution sandboxed.{' '}
            <code style={{ fontFamily: font.mono, fontSize: 18, color: palette.accent }}>/sandbox</code> grants
            access. Prevents{' '}
            <code style={{ fontFamily: font.mono, fontSize: 18, color: palette.red }}>rm -rf /</code>.
          </>
        }
        accent={palette.blue}
      />
    </div>

    <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderTop: `2px solid ${palette.green}`,
          borderRadius: 14,
          padding: '22px 26px',
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.green, marginBottom: 12, letterSpacing: '0.18em' }}>
          ✓ PURPOSE-BUILT TOOLS
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 19 }}>
          <li>📄 string_replace_lsp — edit with LSP diagnostics</li>
          <li>🔍 search_content — regex across files</li>
          <li>📂 find_files — glob, .gitignore-aware</li>
          <li>🌳 ast_smart_edit — AST-aware transforms</li>
          <li>👁️ view — read with line numbers</li>
        </ul>
      </div>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderTop: `2px solid ${palette.red}`,
          borderRadius: 14,
          padding: '22px 26px',
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.red, marginBottom: 12, letterSpacing: '0.18em' }}>
          ✗ BASH AND PRAY
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 19, color: palette.textSoft }}>
          <li>💀 sed -i 's/foo/bar/g' — silent corruption</li>
          <li>💀 grep -r "pattern" . — no structure</li>
          <li>💀 find . -name "*.ts" — no .gitignore</li>
          <li>💀 cat &gt;&gt; file — race conditions</li>
        </ul>
      </div>
    </div>

    <Footer index={6} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 07 — Modes
// ════════════════════════════════════════════════════════════════════════════
const Modes: Page = () => (
  <Stage>
    <Eyebrow>Modes</Eyebrow>
    <SectionTitle
      title={
        <>
          Same agent.{' '}
          <span style={{ color: palette.accent }}>Different behavior.</span>
        </>
      }
    />
    <SubTitle>
      Each mode rewires the agent: different prompt, different tool set, different model, different
      approval policy. The harness swaps them without restarting the conversation.
    </SubTitle>

    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      <ModeCard name="PLAN" tagline="Explore, design, submit" tools="read-only · ask_user · submit_plan" model="opus" accent={palette.blue} />
      <ModeCard name="BUILD" tagline="Code, edit, ship" tools="full file + shell · LSP · AST" model="sonnet" accent={palette.green} />
      <ModeCard name="FAST" tagline="Quick edits, no ceremony" tools="view · string_replace_lsp" model="haiku" accent={palette.amber} />
      <ModeCard name="REVIEW" tagline="Read PRs, comment, suggest" tools="git · gh · view" model="sonnet" accent={palette.purple} />
      <ModeCard name="TRIAGE" tagline="Sort issues, label, route" tools="gh · search_content" model="haiku" accent={palette.rose} />
      <ModeCard name="CUSTOM" tagline="Bring your own" tools="user-defined" model="any" accent={palette.text} />
    </div>

    <Footer index={7} />
  </Stage>
);

const ModeCard = ({
  name,
  tagline,
  tools,
  model,
  accent,
}: {
  name: string;
  tagline: string;
  tools: string;
  model: string;
  accent: string;
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 14,
      padding: '22px 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
  >
    <div
      style={{
        fontFamily: font.mono,
        fontSize: 28,
        fontWeight: 700,
        color: accent,
        letterSpacing: '0.06em',
      }}
    >
      {name}
    </div>
    <div style={{ fontSize: 22, color: palette.text, fontWeight: 600 }}>{tagline}</div>
    <div style={{ fontSize: 16, color: palette.muted, marginTop: 6 }}>
      <span style={{ fontFamily: font.mono, color: palette.textSoft }}>tools:</span> {tools}
    </div>
    <div style={{ fontSize: 16, color: palette.muted }}>
      <span style={{ fontFamily: font.mono, color: palette.textSoft }}>model:</span> {model}
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 08 — Steering / Human-in-the-Loop
// ════════════════════════════════════════════════════════════════════════════
const Steering: Page = () => (
  <Stage>
    <Eyebrow>Human-in-the-Loop</Eyebrow>
    <SectionTitle
      title={
        <>
          The harness should{' '}
          <span style={{ color: palette.accent }}>ask, not just act.</span>
        </>
      }
    />
    <SubTitle>
      Users need to interrupt, bail, and queue the next message. Interrupts aren't edge cases —
      they're core UX.
    </SubTitle>

    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 22 }}>
      <Pill
        icon="📋"
        label="Plan Approval"
        desc="Agent submits a plan. You approve, deny, or edit before any code changes."
        accent={palette.blue}
      />
      <Pill
        icon="🛡️"
        label="Tool Approval"
        desc="Approve, deny, or always-allow tool calls before they execute."
        accent={palette.green}
      />
      <Pill
        icon="⛔"
        label="Abort"
        desc="Kill the current operation. Or steer mid-stream to redirect the agent."
        accent={palette.red}
      />
      <Pill
        icon="📨"
        label="Follow-Up"
        desc="Queue a message while the agent is busy. Sent after the current op finishes."
        accent={palette.amber}
      />
    </div>

    <div
      style={{
        marginTop: 40,
        fontSize: 26,
        color: palette.textSoft,
        maxWidth: 1500,
        lineHeight: 1.45,
      }}
    >
      Plan approval gates intent.{' '}
      <span style={{ color: palette.green }}>Tool approval gates side effects.</span>{' '}
      Abort and follow-up gate flow. The agent never runs alone.
    </div>

    <Footer index={8} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 09 — MastraCode
// ════════════════════════════════════════════════════════════════════════════
const MastraCode: Page = () => (
  <Stage>
    <Eyebrow>MastraCode</Eyebrow>
    <SectionTitle
      title={
        <>
          You just learned the parts.{' '}
          <span style={{ color: palette.accent }}>This is the whole thing.</span>
        </>
      }
    />
    <SubTitle>
      MastraCode is a production coding agent built on the harness and Observational Memory. Every
      piece you've seen — running, end-to-end.
    </SubTitle>

    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      <Pill icon="📝" label="Prompts" desc="Assembled at runtime from env, mode, tools, tasks, and skills." accent={palette.green} />
      <Pill icon="📁" label="Workspace" desc="Sandboxed filesystem, LSP tools, and a discoverable skill catalog." accent={palette.blue} />
      <Pill icon="🎛️" label="Modes" desc="Build, plan, review, fast — each with its own tools and model." accent={palette.purple} />
      <Pill icon="🎯" label="Steering" desc="Human-in-the-loop approvals, steer, abort, and follow-ups." accent={palette.amber} />
      <Pill icon="🕉️" label="Memory" desc="Observational Memory — forgetting is a feature, not a bug." accent={palette.rose} />
      <Pill icon="🔧" label="Harness" desc="One agent loop orchestrating every piece, every turn." accent={palette.text} />
    </div>

    <Footer index={9} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 10 — The Proof
// ════════════════════════════════════════════════════════════════════════════
const TheProof: Page = () => (
  <Stage>
    <Eyebrow>The Proof</Eyebrow>
    <SectionTitle
      title={
        <>
          LongMemEval. <span style={{ color: palette.accent }}>500 questions.</span>{' '}
          ~57M tokens.
        </>
      }
    />
    <SubTitle>
      A long-conversation memory benchmark. Each question depends on ~50 prior sessions. OM is the
      only architecture that scores higher than the oracle.
    </SubTitle>

    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
      <Stat value="84.2%" label="OM + gpt-4o" accent={palette.accent} highlight />
      <Stat value="82.4%" label="Oracle (cheating)" accent={palette.blue} />
      <Stat value="81.6%" label="Supermemory" accent={palette.muted} />
      <Stat value="60.0%" label="Baseline" accent={palette.red} />
    </div>

    <div
      style={{
        marginTop: 36,
        fontSize: 24,
        color: palette.textSoft,
        maxWidth: 1500,
        lineHeight: 1.5,
      }}
    >
      The oracle is given <i>only</i> the conversations containing the answer. OM ingested all ~50 — and{' '}
      <span style={{ color: palette.accent }}>still scored higher</span>.
    </div>

    <div
      style={{
        marginTop: 36,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderTop: `2px solid ${palette.accent}`,
        borderRadius: 14,
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'baseline',
        gap: 24,
        maxWidth: 1500,
      }}
    >
      <div style={{ fontFamily: font.display, fontSize: 72, fontWeight: 800, color: palette.accent, lineHeight: 1 }}>
        94.9%
      </div>
      <div style={{ fontSize: 24, color: palette.textSoft, lineHeight: 1.4 }}>
        Highest score ever recorded on LongMemEval — OM + gpt-5-mini.
      </div>
    </div>

    <Footer index={10} />
  </Stage>
);

const Stat = ({
  value,
  label,
  accent,
  highlight,
}: {
  value: string;
  label: string;
  accent: string;
  highlight?: boolean;
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${highlight ? accent : palette.border}`,
      borderRadius: 14,
      padding: '24px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}
  >
    <div
      style={{
        fontFamily: font.display,
        fontSize: 64,
        fontWeight: 800,
        color: accent,
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 18, color: palette.textSoft, fontFamily: font.mono, letterSpacing: '0.04em' }}>{label}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 11 — Leaderboard
// ════════════════════════════════════════════════════════════════════════════
type LbRow = { rank: number; system: string; model: string; score: string; om?: boolean };
const lbRows: LbRow[] = [
  { rank: 1, system: 'OM', model: 'gpt-5-mini', score: '94.9%', om: true },
  { rank: 2, system: 'OM', model: 'gemini-3-pro-preview', score: '93.3%', om: true },
  { rank: 3, system: 'Hindsight', model: 'gemini-3-pro-preview', score: '91.4%' },
  { rank: 4, system: 'OM', model: 'gemini-3-flash-preview', score: '89.2%', om: true },
  { rank: 5, system: 'Hindsight', model: 'GPT-OSS 120B', score: '89.0%' },
  { rank: 6, system: 'Supermemory', model: 'gemini-3-pro-preview', score: '85.2%' },
  { rank: 7, system: 'Supermemory', model: 'gpt-5', score: '84.6%' },
  { rank: 8, system: 'OM', model: 'gpt-4o', score: '84.2%', om: true },
  { rank: 9, system: 'Hindsight', model: 'GPT-OSS 20B', score: '83.6%' },
  { rank: 10, system: 'EmergenceMem Simple', model: 'gpt-4o', score: '82.4%' },
  { rank: 11, system: 'Oracle', model: 'gpt-4o', score: '82.4%' },
  { rank: 12, system: 'Supermemory', model: 'gpt-4o', score: '81.6%' },
  { rank: 13, system: 'Mastra RAG', model: 'gpt-4o', score: '80.1%' },
  { rank: 14, system: 'Zep', model: 'gpt-4o', score: '71.2%' },
  { rank: 15, system: 'Full context', model: 'gpt-4o', score: '60.2%' },
];

const Leaderboard: Page = () => (
  <Stage>
    <Eyebrow>The Proof · Leaderboard</Eyebrow>
    <SectionTitle
      title={
        <>
          OM takes <span style={{ color: palette.accent }}>3 of the top 4 spots.</span>
        </>
      }
    />
    <SubTitle>
      The architecture wins, regardless of the model underneath. gpt-5-mini, gemini-3-pro, gemini-3-flash, gpt-4o — OM finishes near the top with each.
    </SubTitle>

    <div
      style={{
        marginTop: 28,
        display: 'grid',
        gridTemplateColumns: '64px 1fr 1fr 120px',
        gap: 0,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        fontFamily: font.mono,
        fontSize: 18,
      }}
    >
      <div style={hCell}>#</div>
      <div style={hCell}>System</div>
      <div style={hCell}>Model</div>
      <div style={{ ...hCell, textAlign: 'right' }}>Score</div>
      {lbRows.map((r, i) => {
        const isOm = !!r.om;
        const bg = isOm ? `${palette.accent}14` : i % 2 ? palette.surfaceHi : 'transparent';
        const color = isOm ? palette.accent : palette.textSoft;
        const weight = isOm ? 700 : 400;
        return (
          <Fragment key={r.rank}>
            <div style={{ ...rCell, background: bg, color, fontWeight: weight }}>{r.rank}</div>
            <div style={{ ...rCell, background: bg, color, fontWeight: weight }}>{r.system}</div>
            <div style={{ ...rCell, background: bg, color }}>{r.model}</div>
            <div style={{ ...rCell, background: bg, color, fontWeight: weight, textAlign: 'right' }}>{r.score}</div>
          </Fragment>
        );
      })}
    </div>

    <Footer index={11} />
  </Stage>
);

const hCell: CSSProperties = {
  padding: '10px 18px',
  fontSize: 14,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: palette.muted,
  background: palette.surfaceHi,
  borderBottom: `1px solid ${palette.border}`,
};
const rCell: CSSProperties = {
  padding: '8px 18px',
  borderBottom: `1px solid ${palette.border}`,
  lineHeight: 1.3,
};

// ════════════════════════════════════════════════════════════════════════════
// 12 — Category breakdowns
// ════════════════════════════════════════════════════════════════════════════
const Categories: Page = () => (
  <Stage>
    <Eyebrow>The Proof · Categories</Eyebrow>
    <SectionTitle
      title={
        <>
          OM wins <span style={{ color: palette.accent }}>every category that requires memory</span>.
        </>
      }
    />

    <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* Same-model comparison (gemini-3-pro) */}
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 14,
          padding: '18px 22px',
        }}
      >
        <div style={catCaption}>Same model · gemini-3-pro</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', fontFamily: font.mono, fontSize: 15 }}>
          <div style={tHead}>Category</div>
          <div style={{ ...tHead, textAlign: 'right' }}>OM (5-mini)</div>
          <div style={{ ...tHead, textAlign: 'right' }}>SM (gpt-5)</div>
          <div style={{ ...tHead, textAlign: 'right' }}>OM (g3p)</div>
          <div style={{ ...tHead, textAlign: 'right' }}>HS (g3p)</div>
          {[
            ['Temporal reasoning', '95.5%', '81.2%', '94.0%', '91.0%', [true, false, false, false]],
            ['Knowledge update', '96.2%', '87.2%', '94.9%', '94.9%', [true, false, false, false]],
            ['Multi-session', '87.2%', '75.2%', '87.2%', '87.2%', [true, false, true, true]],
          ].map((row, i) => {
            const [label, ...rest] = row as [string, string, string, string, string, boolean[]];
            const flags = (row as any)[5] as boolean[];
            return (
              <Fragment key={i}>
                <div style={tCell}>{label}</div>
                {(rest as string[]).slice(0, 4).map((v, j) => (
                  <div
                    key={j}
                    style={{
                      ...tCell,
                      textAlign: 'right',
                      color: flags[j] ? palette.accent : palette.textSoft,
                      fontWeight: flags[j] ? 700 : 400,
                    }}
                  >
                    {v}
                  </div>
                ))}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Architecture comparison */}
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 14,
          padding: '18px 22px',
        }}
      >
        <div style={catCaption}>Per-category · OM vs Hindsight vs Supermemory</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', fontFamily: font.mono, fontSize: 15 }}>
          <div style={tHead}>Category</div>
          <div style={{ ...tHead, textAlign: 'right' }}>OM</div>
          <div style={{ ...tHead, textAlign: 'right' }}>Hindsight</div>
          <div style={{ ...tHead, textAlign: 'right' }}>Supermemory</div>
          {[
            ['Single-session (user)', '97.1%', '97.1%', '98.6%', [false, false, true]],
            ['Single-session (assistant)', '96.4%', '96.4%', '98.2%', [false, false, true]],
            ['Single-session (preference)', '90.0%', '80.0%', '70.0%', [true, false, false]],
            ['Knowledge update', '94.9%', '94.9%', '89.7%', [true, true, false]],
            ['Temporal reasoning', '94.0%', '91.0%', '82.0%', [true, false, false]],
            ['Multi-session', '87.2%', '87.2%', '76.7%', [true, true, false]],
            ['Overall', '93.3%', '91.4%', '85.2%', [true, false, false]],
          ].map((row, i) => {
            const [label, om, hs, sm] = row as [string, string, string, string, boolean[]];
            const flags = (row as any)[4] as boolean[];
            const isOverall = label === 'Overall';
            const cellStyle: CSSProperties = isOverall
              ? { ...tCell, borderTop: `1px solid ${palette.border}`, marginTop: 4, paddingTop: 8, fontWeight: 700 }
              : tCell;
            return (
              <Fragment key={i}>
                <div style={cellStyle}>{label}</div>
                {[om, hs, sm].map((v, j) => (
                  <div
                    key={j}
                    style={{
                      ...cellStyle,
                      textAlign: 'right',
                      color: flags[j] ? palette.accent : palette.textSoft,
                      fontWeight: flags[j] || isOverall ? 700 : 400,
                    }}
                  >
                    {v}
                  </div>
                ))}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>

    <div style={{ marginTop: 24, fontSize: 22, color: palette.textSoft, lineHeight: 1.4, maxWidth: 1500 }}>
      Single-session questions don't need memory — every system ties. The moment a question reaches
      across sessions, only architecture matters.{' '}
      <span style={{ color: palette.accent }}>OM wins every memory category.</span>
    </div>

    <Footer index={12} />
  </Stage>
);

const catCaption: CSSProperties = {
  fontFamily: font.mono,
  fontSize: 13,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: palette.muted,
  marginBottom: 12,
};
const tHead: CSSProperties = {
  padding: '6px 8px',
  fontSize: 12,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: palette.muted,
  borderBottom: `1px solid ${palette.border}`,
};
const tCell: CSSProperties = {
  padding: '6px 8px',
  color: palette.textSoft,
  lineHeight: 1.3,
};

// ════════════════════════════════════════════════════════════════════════════
// 13 — Thank you
// ════════════════════════════════════════════════════════════════════════════
const ThankYou: Page = () => (
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
          `radial-gradient(900px 500px at 80% 20%, ${palette.accent}1f 0%, transparent 60%),` +
          `radial-gradient(900px 500px at 18% 82%, ${palette.purple}14 0%, transparent 65%)`,
      }}
    />
    <div style={{ position: 'relative', maxWidth: 1500 }}>
      <div style={{ fontSize: 96, marginBottom: 12 }}>🍕</div>
      <Eyebrow>Thank you</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 168,
          fontWeight: 900,
          lineHeight: 0.96,
          letterSpacing: '-0.04em',
          margin: '24px 0 28px',
        }}
      >
        Thank you, <span style={{ color: palette.accent }}>Denise!</span>
      </h1>
      <p style={{ fontSize: 32, color: palette.textSoft, lineHeight: 1.4, marginBottom: 28, maxWidth: 1300 }}>
        We're incredibly grateful to have this event at <b style={{ color: palette.text }}>Gradient</b>.
        Seriously — thank you for making this happen.
      </p>
      <p style={{ fontSize: 28, color: palette.muted, lineHeight: 1.4, marginBottom: 56 }}>
        🙏 Now please, Denise — buy some really good pizza for once.
      </p>

      <div style={{ display: 'flex', gap: 28, fontFamily: font.mono, fontSize: 22 }}>
        <span style={{ color: palette.accent }}>mastra.ai</span>
        <span style={{ color: palette.muted }}>·</span>
        <span style={{ color: palette.textSoft }}>github.com/mastra-ai</span>
        <span style={{ color: palette.muted }}>·</span>
        <span style={{ color: palette.textSoft }}>discord.gg/mastra</span>
      </div>
    </div>

    <Footer index={13} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// Meta + speaker notes
// ════════════════════════════════════════════════════════════════════════════
export const meta: SlideMeta = {
  title: 'Mastra · Building Agents That Never Forget',
};

export const notes: (string | undefined)[] = [
  // 01 Cover
  `Welcome them. Two presenters, two arcs. Abhi takes Observational Memory and MastraCode; Shane takes the harness. The whole talk is a single argument: you can't build a production coding agent on stateless tool calls — you need a memory model that mirrors how humans actually remember, and a harness that runs the loop. We end on MastraCode as the proof it works.`,

  // 02 The Problem
  `Frame the pain. LLMs can read enormous context, but agents drown in it — every turn we cram in more history, more retrieved chunks, more tool output. The standard fix is RAG-per-turn: embed, search, rank, inject. Walk through the pipeline. The killer line: different context every turn means cache miss every time, and no continuity between turns.`,

  // 03 The Insight
  `The pivot. Forgetting isn't a bug — it's the mechanism that makes humans coherent. We compress, abstract, throw most of it away. Three agents, one memory: an Actor that talks, an Observer that watches, a Reflector that compacts. Observer + Reflector are the subconscious — always running, never interrupting the Actor's loop.`,

  // 04 The Harness
  `Hand off to Shane. The harness is the orchestrator — it's what makes "an agent" production-grade. Walk through the six pillars: prompts, modes, workspace, steering, events, policies. The model is the part in the middle; the harness is everything around it. The next slides are a tour of each pillar.`,

  // 05 Prompts & Context
  `The prompt is not a string — it's a build target. Passive side: the harness composes from environment, mode, tool list, active tasks, AGENTS.md, and skill catalog. Active side: slash commands let users actively re-orient — switch mode, swap model, force compaction, grant sandbox access. Show the example commands; emphasize that the agent's reality changes turn by turn.`,

  // 06 Workspace
  `The agent needs a place to do work. Skills are a discoverable catalog — listed in the prompt, activated on demand. Filesystem and shell are sandboxed — reads/writes scoped to project root, /sandbox grants explicit access. Compare purpose-built tools (string_replace_lsp, ast_smart_edit) with bash-and-pray (sed -i, grep -r) — point out that bash tools silently corrupt and ignore .gitignore.`,

  // 07 Modes
  `Modes rewire the agent end-to-end: prompt, tool set, model, approval policy. PLAN explores read-only and submits a plan. BUILD ships code with the full toolset. FAST does quick edits with cheap models. REVIEW reads PRs. TRIAGE sorts issues. CUSTOM is bring-your-own. Same agent, different operating modes — switch without restarting the conversation.`,

  // 08 Steering
  `Interrupts are core UX, not edge cases. Plan approval gates intent — agent submits, user approves/denies/edits. Tool approval gates side effects — every dangerous op asks first. Abort kills runaway loops. Follow-up queues messages while the agent is busy. The agent never runs alone.`,

  // 09 MastraCode
  `Pull it all together. MastraCode is the proof — every piece you've seen running end-to-end. Prompts assembled per turn, sandboxed workspace, multiple modes, human-in-the-loop steering, observational memory, one harness orchestrating all of it. Hand back to Abhi for the benchmark numbers.`,

  // 10 The Proof
  `LongMemEval — 500 questions, ~57M tokens of conversation, ~50 sessions per question. OM scored 84.2% with gpt-4o. Oracle — given only the conversations that contain the answer — scored 82.4%. We beat the oracle while ingesting everything. Then point at 94.9%: highest score ever recorded on the benchmark, OM + gpt-5-mini. The architecture wins; the model is interchangeable.`,

  // 11 Leaderboard
  `Now show the rest of the leaderboard. OM takes 3 of the top 4 spots — gpt-5-mini, gemini-3-pro, gemini-3-flash. Same architecture, different models, all near the top. Hindsight, Supermemory, EmergenceMem, Oracle, Mastra RAG, Zep, Full context all sit below. The point: this isn't a model story, it's an architecture story.`,

  // 12 Categories
  `Two breakdowns. Left — same model (gemini-3-pro), OM beats Hindsight head-to-head on temporal reasoning and ties on knowledge update + multi-session. Right — per-category split. On single-session questions everyone ties (no memory needed). On knowledge update, temporal reasoning, multi-session — OM wins every one. Memory categories are where architecture matters; OM wins them all.`,

  // 13 Thank you
  `Close with gratitude — Denise hosted this at Gradient. Plug links: mastra.ai, GitHub, Discord. Q&A.`,
];

export default [
  Cover,
  TheProblem,
  TheInsight,
  TheHarness,
  PromptsContext,
  Workspace,
  Modes,
  Steering,
  MastraCode,
  TheProof,
  Leaderboard,
  Categories,
  ThankYou,
] satisfies Page[];
