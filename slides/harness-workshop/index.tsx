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
    <span>MASTRA · AGENT HARNESS</span>
    <span>
      {String(index).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
    </span>
  </div>
);

const Stage = ({ children, padding = '120px 120px 120px' }: { children: React.ReactNode; padding?: string }) => (
  <div style={{ ...fill, padding, display: 'flex', flexDirection: 'column' }}>{children}</div>
);

const SectionTitle = ({ title }: { title: React.ReactNode }) => (
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

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 30, color: palette.textSoft, lineHeight: 1.4, maxWidth: 1500, margin: 0 }}>{children}</p>
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
        From raw LLM calls to a steerable, observable, multi-model{' '}
        <b style={{ color: palette.text }}>harness</b>. What it is, why it matters, and what it
        enables.
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
// 02 — Spectrum: Framework vs Harness
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
      Frameworks and harnesses sit at different points on a spectrum of opinionation. Where you sit
      changes what you're responsible for.
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
        desc="Everything baked in. Memory, context management, the agent loop, safety. All decided for you."
        accent={palette.accent}
        highlight
      />
    </div>

    <div
      style={{
        marginTop: 56,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        padding: '24px 28px',
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
        On the spectrum · where things land
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Landmark icon="🔧" name="Raw ReAct loop" tag="Raw Code" accent={palette.muted} />
        <div aria-hidden style={{ flex: 1, height: 2, background: palette.border }} />
        <Landmark icon="🧱" name="Mastra · CrewAI · LangChain" tag="Framework" accent={palette.blue} />
        <div aria-hidden style={{ flex: 1, height: 2, background: palette.border }} />
        <Landmark icon="⚡" name="Claude Code · MastraCode" tag="Harness" accent={palette.accent} />
      </div>
    </div>

    <Footer index={2} />
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

const Landmark = ({ icon, name, tag, accent }: { icon: string; name: string; tag: string; accent: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 200 }}>
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: palette.surfaceHi,
        border: `1px solid ${palette.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
      }}
    >
      {icon}
    </div>
    <div style={{ fontSize: 18, color: palette.text, fontWeight: 600, textAlign: 'center' }}>{name}</div>
    <div style={{ fontFamily: font.mono, fontSize: 13, color: accent, letterSpacing: '0.16em' }}>{tag}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 03 — The Harness (architecture map)
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
      streams events, and enforces policy. The next nine slides walk each piece.
    </SubTitle>

    <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      <Pill icon="📝" label="Prompts" desc="Assembled per turn from env, mode, tools, tasks, skills." accent={palette.green} />
      <Pill icon="📁" label="Workspace" desc="Sandboxed filesystem and shell. Skills as a catalog." accent={palette.blue} />
      <Pill icon="🧠" label="Memory" desc="Compaction, offloading, prompt caching. Beat Context Rot." accent={palette.purple} />
      <Pill icon="🎛️" label="Modes" desc="Build, plan, fast, review, triage. Each rewires the agent." accent={palette.amber} />
      <Pill icon="🛡️" label="Steering" desc="Approve, deny, abort, ask. Interrupts are core UX." accent={palette.rose} />
      <Pill icon="📡" label="Protocols" desc="Events, MCP, subagents. Everything observable." accent={palette.cyan} />
    </div>

    <Footer index={3} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 04 — Prompts & Context
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
      The harness assembles it every turn from environment, mode, tools, tasks, and skills. Slash
      commands let users actively re-orient mid-conversation.
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

    <Footer index={4} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — Workspace
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
      Skills as a discoverable catalog. A sandboxed filesystem. Purpose-built tools — not bash and
      pray.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Pill
        icon="🧩"
        label="Skills"
        desc={
          <>
            Discoverable capabilities the agent activates on demand. Listed in the prompt as a
            catalog —{' '}
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
            Reads/writes scoped to project root. Shell sandboxed.{' '}
            <code style={{ fontFamily: font.mono, fontSize: 18, color: palette.accent }}>/sandbox</code>{' '}
            grants access. Prevents{' '}
            <code style={{ fontFamily: font.mono, fontSize: 18, color: palette.red }}>rm -rf /</code>.
          </>
        }
        accent={palette.blue}
      />
    </div>

    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderTop: `2px solid ${palette.green}`,
          borderRadius: 14,
          padding: '20px 24px',
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.green, marginBottom: 12, letterSpacing: '0.18em' }}>
          ✓ PURPOSE-BUILT TOOLS
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6, fontSize: 18 }}>
          <li>📄 string_replace_lsp — edit with LSP diagnostics</li>
          <li>🔍 search_content — regex across files</li>
          <li>📂 find_files — glob, .gitignore-aware</li>
          <li>🌳 ast_smart_edit — AST-aware transforms</li>
          <li>👁️ view — read with line numbers</li>
          <li>👤 ask_user — structured Q&amp;A</li>
        </ul>
      </div>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderTop: `2px solid ${palette.red}`,
          borderRadius: 14,
          padding: '20px 24px',
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.red, marginBottom: 12, letterSpacing: '0.18em' }}>
          ✗ BASH AND PRAY
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6, fontSize: 18, color: palette.textSoft }}>
          <li>💀 sed -i 's/foo/bar/g' — silent corruption</li>
          <li>💀 grep -r "pattern" . — no structure</li>
          <li>💀 find . -name "*.ts" — no .gitignore</li>
          <li>💀 cat file.ts — no line numbers</li>
          <li>💀 echo "..." &gt; file — full overwrite</li>
          <li>💀 read -p "?" — TTY hangs</li>
        </ul>
      </div>
    </div>

    <Footer index={5} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 06 — Memory: Context Rot
// ════════════════════════════════════════════════════════════════════════════
const Memory: Page = () => (
  <Stage>
    <Eyebrow>Memory</Eyebrow>
    <SectionTitle
      title={
        <>
          Context is precious.{' '}
          <span style={{ color: palette.accent }}>Context Rot is real.</span>
        </>
      }
    />
    <SubTitle>
      As the window fills, models degrade — reasoning gets worse, instructions get lost, costs
      spike. The harness needs strategies to fight it.
    </SubTitle>

    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      <Pill
        icon="🗜️"
        label="Compaction"
        desc="When context fills, intelligently summarize and compress — don't just truncate. Agent keeps working with a clean window."
        accent={palette.green}
      />
      <Pill
        icon="📤"
        label="Tool-Call Offloading"
        desc="Large tool outputs clutter context without adding value. Keep head + tail, offload the rest to disk for on-demand access."
        accent={palette.blue}
      />
      <Pill
        icon="💰"
        label="Prompt Caching"
        desc="Stable prefix = cache hits. Compaction preserves the prefix so caches stay warm and costs stay low."
        accent={palette.amber}
      />
    </div>

    <div
      style={{
        marginTop: 40,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        padding: '24px 28px',
        maxWidth: 1500,
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
        Before vs after compaction
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
        <ContextBar label="Before" pct={92} accent={palette.red} note="92% full · model degrading · cache thrashing" />
        <ContextBar label="After" pct={34} accent={palette.green} note="34% · stable prefix · cache warm · agent fast" />
      </div>
    </div>

    <Footer index={6} />
  </Stage>
);

const ContextBar = ({ label, pct, accent, note }: { label: string; pct: number; accent: string; note: string }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <span style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontFamily: font.mono, fontSize: 14, color: accent }}>{pct}%</span>
    </div>
    <div style={{ height: 16, background: palette.surfaceHi2, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: accent }} />
    </div>
    <div style={{ marginTop: 10, fontSize: 17, color: palette.textSoft }}>{note}</div>
  </div>
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
      Each mode rewires the agent: different prompt, different tools, different model, different
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
    <div style={{ fontFamily: font.mono, fontSize: 28, fontWeight: 700, color: accent, letterSpacing: '0.06em' }}>{name}</div>
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
// 08 — Steering
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
// 09 — Protocols (events + MCP + subagents)
// ════════════════════════════════════════════════════════════════════════════
const Protocols: Page = () => (
  <Stage>
    <Eyebrow>The connective tissue</Eyebrow>
    <SectionTitle
      title={
        <>
          Every action.{' '}
          <span style={{ color: palette.accent }}>Every state change. Observable.</span>
        </>
      }
    />
    <SubTitle>
      The harness emits events for everything. Protocols connect in (MCP). Subagents fan work out.
      If it's not emitting events, you're flying blind.
    </SubTitle>

    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 28 }}>
      <div>
        <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
          Events out · who's listening
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Subscriber name="TUI" desc="Renders messages, tool calls, approvals" accent={palette.green} />
          <Subscriber name="OM" desc="Tracks tokens, triggers compaction" accent={palette.purple} />
          <Subscriber name="Hooks" desc="Policy checks, notifications, logging" accent={palette.amber} />
          <Subscriber name="Cost" desc="Token counting, usage persistence" accent={palette.blue} />
        </div>
      </div>

      <div>
        <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
          Protocols in · MCP &amp; subagents
        </div>
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: 12,
            padding: '18px 20px',
            fontFamily: font.mono,
            fontSize: 16,
            color: palette.textSoft,
            lineHeight: 1.55,
            marginBottom: 14,
          }}
        >
          <span style={{ color: palette.muted }}>// mcp.json</span>
          <br />
          {'{'}
          <br />
          &nbsp;&nbsp;<span style={{ color: palette.accent }}>"playwright"</span>: {'{ "command": "npx", "args": ["@playwright/mcp"] }'},
          <br />
          &nbsp;&nbsp;<span style={{ color: palette.accent }}>"github"</span>: {'{ "command": "npx", "args": ["@github/mcp-server"] }'}
          <br />
          {'}'}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <SubAgent icon="🔍" label="Explore" />
          <SubAgent icon="📋" label="Plan" />
          <SubAgent icon="⚡" label="Execute" />
        </div>
      </div>
    </div>

    <Footer index={9} />
  </Stage>
);

const Subscriber = ({ name, desc, accent }: { name: string; desc: string; accent: string }) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 12,
      padding: '14px 18px',
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 16, color: accent, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{name}</div>
    <div style={{ fontSize: 18, color: palette.textSoft, marginTop: 6 }}>{desc}</div>
  </div>
);

const SubAgent = ({ icon, label }: { icon: string; label: string }) => (
  <div
    style={{
      flex: 1,
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderRadius: 12,
      padding: '14px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
    }}
  >
    <div style={{ fontSize: 28 }}>{icon}</div>
    <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.textSoft, letterSpacing: '0.16em' }}>{label}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 10 — Streaming & Multi-Model
// ════════════════════════════════════════════════════════════════════════════
const Streaming: Page = () => (
  <Stage>
    <Eyebrow>Streaming &amp; Multi-Model</Eyebrow>
    <SectionTitle
      title={
        <>
          One harness.{' '}
          <span style={{ color: palette.accent }}>Many models.</span>
        </>
      }
    />
    <SubTitle>
      Streaming is not optional — design for resumability. The harness routes per mode, supports
      OAuth and API keys, and tracks cost across providers.
    </SubTitle>

    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
      <ModelCard name="Claude Opus 4.6" provider="Anthropic" use="BUILD mode" strength="Reasoning" cost="$15/1M in" auth="OAuth · Claude Max" accent={palette.purple} />
      <ModelCard name="GPT-5.3 Codex" provider="OpenAI" use="PLAN mode" strength="Code analysis" cost="$12/1M in" auth="OAuth · Codex" accent={palette.green} />
      <ModelCard name="ZAI-GLM 4.7" provider="Cerebras" use="FAST mode" strength="Speed" cost="$0.60/1M in" auth="API key" accent={palette.amber} />
      <ModelCard name="Gemini 2.5 Flash" provider="Google" use="OM Observer" strength="Compression" cost="$0.15/1M in" auth="API key" accent={palette.blue} />
      <ModelCard name="Moonshot Kimi" provider="Moonshot AI" use="Cost-sensitive" strength="Budget coding" cost="$0.30/1M in" auth="API key" accent={palette.cyan} />
      <ModelCard name="Your model" provider="Any provider" use="Custom mode" strength="Your choice" cost="varies" auth="—" accent={palette.muted} />
    </div>

    <div
      style={{
        marginTop: 28,
        fontSize: 22,
        color: palette.textSoft,
        maxWidth: 1500,
        lineHeight: 1.5,
      }}
    >
      <b style={{ color: palette.accent }}>Key design point:</b> interrupts happen mid-stream. Save
      what was streamed, clean up, and restart with the new context.
    </div>

    <Footer index={10} />
  </Stage>
);

const ModelCard = ({
  name,
  provider,
  use,
  strength,
  cost,
  auth,
  accent,
}: {
  name: string;
  provider: string;
  use: string;
  strength: string;
  cost: string;
  auth: string;
  accent: string;
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 12,
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 700, color: palette.text }}>{name}</div>
    <div style={{ fontFamily: font.mono, fontSize: 14, color: accent, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{provider}</div>
    <div style={{ marginTop: 8, fontSize: 16, color: palette.textSoft }}>
      <span style={{ color: palette.muted }}>use </span>
      {use}
    </div>
    <div style={{ fontSize: 16, color: palette.textSoft }}>
      <span style={{ color: palette.muted }}>strength </span>
      {strength}
    </div>
    <div style={{ fontSize: 16, color: palette.textSoft }}>
      <span style={{ color: palette.muted }}>cost </span>
      {cost}
    </div>
    <div style={{ fontSize: 14, color: palette.muted, marginTop: 4, fontFamily: font.mono }}>● {auth}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 11 — Policies & Cost
// ════════════════════════════════════════════════════════════════════════════
const Policies: Page = () => (
  <Stage>
    <Eyebrow>Tool policies &amp; cost awareness</Eyebrow>
    <SectionTitle
      title={
        <>
          Parallelism is the norm.{' '}
          <span style={{ color: palette.accent }}>Govern it.</span>
        </>
      }
    />
    <SubTitle>
      Define tool approvals per tool or per category. Track tokens, usage, and costs — especially in
      YOLO mode.
    </SubTitle>

    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr repeat(3, 1fr)',
            padding: '14px 22px',
            fontFamily: font.mono,
            fontSize: 14,
            color: palette.muted,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          <span>Tool</span>
          <span style={{ textAlign: 'center' }}>Allow</span>
          <span style={{ textAlign: 'center' }}>Ask</span>
          <span style={{ textAlign: 'center' }}>Deny</span>
        </div>
        {[
          ['view', 'allow'],
          ['string_replace_lsp', 'allow'],
          ['execute_command', 'ask'],
          ['delete_file', 'ask'],
          ['web_search', 'allow'],
          ['rm -rf /', 'deny'],
        ].map(([tool, state]) => (
          <PolicyRow key={tool} tool={tool} state={state as 'allow' | 'ask' | 'deny'} />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Stat value="42,180" label="prompt tokens" accent={palette.blue} />
        <Stat value="8,340" label="completion tokens" accent={palette.purple} />
        <Stat value="$0.78" label="estimated cost" accent={palette.accent} highlight />
        <Stat value="67%" label="cache hit rate" accent={palette.amber} />
      </div>
    </div>

    <div
      style={{
        marginTop: 32,
        fontSize: 22,
        color: palette.textSoft,
        maxWidth: 1500,
        lineHeight: 1.5,
      }}
    >
      <b style={{ color: palette.amber }}>YOLO mode</b> auto-approves all tool calls. Faster — but
      every policy is overridden. Only use when you trust the agent and the workspace.
    </div>

    <Footer index={11} />
  </Stage>
);

const PolicyRow = ({ tool, state }: { tool: string; state: 'allow' | 'ask' | 'deny' }) => {
  const cell = (col: 'allow' | 'ask' | 'deny') => {
    const active = state === col;
    const color = col === 'allow' ? palette.green : col === 'ask' ? palette.amber : palette.red;
    return (
      <span
        style={{
          textAlign: 'center',
          fontFamily: font.mono,
          fontSize: 14,
          color: active ? color : palette.dim,
          letterSpacing: '0.18em',
        }}
      >
        {active ? '●' : '○'}
      </span>
    );
  };
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr repeat(3, 1fr)',
        padding: '12px 22px',
        fontSize: 18,
        color: palette.textSoft,
        borderBottom: `1px solid ${palette.border}`,
        alignItems: 'center',
      }}
    >
      <span style={{ fontFamily: font.mono, color: palette.text }}>{tool}</span>
      {cell('allow')}
      {cell('ask')}
      {cell('deny')}
    </div>
  );
};

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
      borderRadius: 12,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 14,
    }}
  >
    <span style={{ fontFamily: font.display, fontSize: 38, fontWeight: 800, color: accent, letterSpacing: '-0.02em' }}>
      {value}
    </span>
    <span style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
      {label}
    </span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 12 — Production-Ready Checklist
// ════════════════════════════════════════════════════════════════════════════
const Checklist: Page = () => (
  <Stage>
    <Eyebrow>Production-ready</Eyebrow>
    <SectionTitle
      title={
        <>
          What makes a harness{' '}
          <span style={{ color: palette.accent }}>production-ready.</span>
        </>
      }
    />
    <SubTitle>This is the bar. Ten boxes. If you tick all ten, you've shipped a harness.</SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <Check item="Stateful, resumable execution" tag="Harness" />
      <Check item="Dynamic, tuned system prompts" tag="Prompts" />
      <Check item="Right workspace primitives + tools" tag="Workspace" />
      <Check item="Context Rot mitigation — compaction + offloading" tag="Memory" />
      <Check item="Modes that rewire agent behavior" tag="Modes" />
      <Check item="Real HITL — interrupts, bailing, free-form" tag="Steering" />
      <Check item="Event emission throughout" tag="Protocols" />
      <Check item="Streaming UX across form factors" tag="Streaming" />
      <Check item="Tool policies + cost tracking" tag="Policies" />
      <Check item="Multi-model and multi-modal" tag="Streaming" />
    </div>

    <div
      style={{
        marginTop: 32,
        fontSize: 24,
        color: palette.textSoft,
        maxWidth: 1500,
        lineHeight: 1.5,
      }}
    >
      Tick all ten and you've shipped a harness. But the bar keeps moving — next slide.
    </div>

    <Footer index={12} />
  </Stage>
);

// ════════════════════════════════════════════════════════════════════════════
// 13 — What's Next (futures + close)
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
      Everything we covered today is table stakes. The frontier is long-horizon autonomous
      execution — agents that run for hours, self-verify, and recover from failure without humans.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
      <Pill
        icon="🔄"
        label="Long-Horizon Execution"
        desc="Agents that plan ahead, execute across many turns, and self-verify progress. The harness manages checkpoints, rollback, and recovery."
        accent={palette.green}
      />
      <Pill
        icon="🧬"
        label="Model–Harness Co-evolution"
        desc="Models get better at tool use → harnesses give them more tools → models train on richer harness traces. A feedback loop that compounds."
        accent={palette.purple}
      />
      <Pill
        icon="🤖"
        label="Parallel Agent Orchestration"
        desc="Subagents that run in parallel, share context through the harness, and coordinate without stepping on each other."
        accent={palette.blue}
      />
      <Pill
        icon="🔧"
        label="Dynamic Tool Assembly"
        desc="The harness decides which tools to surface based on the current task — not a static list, a context-aware toolkit."
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
        Everything you've seen today is implemented in{' '}
        <b style={{ color: palette.accent }}>MastraCode</b>, on top of the Mastra framework. The
        harness pattern is open-source and ready to extend.
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 24, fontFamily: font.mono, fontSize: 16 }}>
        <span style={{ color: palette.accent }}>📖 mastra.ai</span>
        <span style={{ color: palette.textSoft }}>💻 github.com/mastra-ai</span>
        <span style={{ color: palette.textSoft }}>💬 discord.gg/mastra</span>
      </div>
    </div>

    <Footer index={13} />
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
// Meta + speaker notes
// ════════════════════════════════════════════════════════════════════════════
export const meta: SlideMeta = {
  title: 'Mastra · Agent Harness',
};

export const notes: (string | undefined)[] = [
  // 01 Cover
  `Welcome them. Two presenters: Abhi (CTO) and Alex (DevRel). Whole talk: anatomy of a production agent harness — prompts, workspace, memory, modes, steering, protocols, streaming, policies. We end on a checklist that doubles as a build spec.`,

  // 02 Spectrum
  `Set up the mental model. Three points on a spectrum: raw code, framework, harness. Raw code = total flexibility, total responsibility. Framework = building blocks (Mastra, CrewAI, LangChain). Harness = complete system, decisions baked in (Claude Code, MastraCode). Today we go all the way right — every piece included, no kit assembly.`,

  // 03 The Harness
  `The architecture map. The model is the part in the middle; the harness is everything around it. Six pillars: Prompts, Workspace, Memory, Modes, Steering, Protocols. The next nine slides walk each piece in turn.`,

  // 04 Prompts & Context
  `The prompt is not a string — it's a build target. Passive side: harness composes from environment, mode, tool list, active tasks, AGENTS.md, skill catalog. Active side: slash commands let users actively re-orient — switch mode, swap model, force compaction, grant sandbox access. The agent's reality changes turn by turn.`,

  // 05 Workspace
  `The agent needs a place to do work. Skills are a discoverable catalog — listed in the prompt, activated on demand. Filesystem and shell are sandboxed — reads/writes scoped to project root, /sandbox grants explicit access. Compare purpose-built tools (string_replace_lsp, ast_smart_edit) with bash-and-pray (sed -i, grep -r) — point out that bash tools silently corrupt and ignore .gitignore.`,

  // 06 Memory
  `Context Rot is real. As the window fills, models degrade — reasoning gets worse, instructions get lost, costs spike. Three strategies: compaction (intelligently summarize, don't truncate), tool-call offloading (keep head + tail of large outputs, offload the body to disk), prompt caching (stable prefix = cache hits — compaction must preserve the prefix or you lose the cache).`,

  // 07 Modes
  `Modes rewire the agent end-to-end: prompt, tool set, model, approval policy. PLAN explores read-only and submits a plan. BUILD ships code with the full toolset. FAST does quick edits with cheap models. REVIEW reads PRs. TRIAGE sorts issues. CUSTOM is bring-your-own. Same agent, different operating modes — switch without restarting the conversation.`,

  // 08 Steering
  `Interrupts are core UX, not edge cases. Plan approval gates intent — agent submits, user approves/denies/edits. Tool approval gates side effects — every dangerous op asks first. Abort kills runaway loops. Follow-up queues messages while the agent is busy. The agent never runs alone.`,

  // 09 Protocols
  `The connective tissue. Events flow out: TUI renders, OM tracks tokens, hooks run policy checks, cost counter runs. Protocols connect in: MCP servers provide tools dynamically. Subagents fan work out: Explore, Plan, Execute — each constrained, each its own thread. If the harness isn't emitting events, you're flying blind.`,

  // 10 Streaming
  `Streaming is not optional — design for resumability. Interrupts happen mid-stream. The harness must save what was streamed, clean up, and restart with the new context. Multi-model is the norm: route per mode (Opus for BUILD, FAST model for quick edits, cheap model for the OM Observer). OAuth where available (Claude Max, Codex Plan) — API keys otherwise. Track cost across all of them.`,

  // 11 Policies
  `Parallelism is the norm — multiple tools running simultaneously. Govern it. Define approvals per tool or per category: allow, ask, deny. Track every token: prompt, completion, cost, cache hit rate. YOLO mode auto-approves everything — fast, but every policy is overridden. Only use when you trust the agent and the workspace.`,

  // 12 Checklist
  `The bar. Ten items. Stateful execution, dynamic prompts, right workspace, Context Rot mitigation, modes, real HITL, events, streaming, policies, multi-model. Tick all ten and you've shipped a harness. The bar keeps moving — next slide is what comes next.`,

  // 13 Futures
  `What's next. Everything we just covered is table stakes. The frontier is long-horizon autonomous execution — hours of work, self-verification, recovery from failure. Four directions: long-horizon execution (checkpoints, rollback), model-harness co-evolution (a feedback loop that compounds), parallel orchestration (subagents that don't step on each other), dynamic tool assembly (context-aware toolkits, not static lists). Close the talk: everything is in MastraCode, open-source, ready to extend. Now go build it.`,
];

export default [
  Cover,
  Spectrum,
  TheHarness,
  PromptsContext,
  Workspace,
  Memory,
  Modes,
  Steering,
  Protocols,
  Streaming,
  Policies,
  Checklist,
  Futures,
] satisfies Page[];
