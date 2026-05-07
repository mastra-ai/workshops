import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import danielAvatar from './assets/daniel.png';
import alexAvatar from './assets/alex.png';

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

// ─── Atoms ───────────────────────────────────────────────────────────────────
const TOTAL = 10;

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
    <span>MASTRA · PROCESSORS</span>
    <span>
      {String(index).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
    </span>
  </div>
);

const Stage = ({ children, padding = '120px 120px 120px' }: { children: React.ReactNode; padding?: string }) => (
  <div style={{ ...fill, padding, display: 'flex', flexDirection: 'column' }}>{children}</div>
);

const SectionTitle = ({ title, maxWidth = 1620 }: { title: React.ReactNode; maxWidth?: number }) => (
  <h1
    style={{
      fontFamily: font.display,
      fontSize: 92,
      fontWeight: 800,
      lineHeight: 1.02,
      letterSpacing: '-0.025em',
      margin: '20px 0 22px',
      maxWidth,
      color: palette.text,
    }}
  >
    {title}
  </h1>
);

const SubTitle = ({ children, maxWidth = 1500 }: { children: React.ReactNode; maxWidth?: number }) => (
  <p style={{ fontSize: 30, color: palette.textSoft, lineHeight: 1.4, maxWidth, margin: 0 }}>{children}</p>
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
          fontSize: 184,
          fontWeight: 900,
          lineHeight: 0.94,
          margin: '36px 0 24px',
          letterSpacing: '-0.045em',
          maxWidth: 1620,
        }}
      >
        Guardrails <span style={{ color: palette.accent }}>and beyond.</span>
      </h1>
      <p style={{ fontSize: 38, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.35, marginBottom: 56 }}>
        Control the agent loop with{' '}
        <b style={{ color: palette.text }}>Mastra Processors</b> — middleware for every phase of an
        LLM interaction.
      </p>

      <div style={{ display: 'flex', gap: 64, marginBottom: 56 }}>
        <Author name="Daniel Lew" role="Software Engineer, Mastra" avatar={danielAvatar} />
        <Author name="Alex Booker" role="Developer Experience, Mastra" avatar={alexAvatar} />
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
// 02 — The Problem
// ════════════════════════════════════════════════════════════════════════════
const TheProblem: Page = () => (
  <Stage>
    <Eyebrow>The problem</Eyebrow>
    <SectionTitle
      title={
        <>
          Your agent is a <span style={{ color: palette.accent }}>black box.</span>
        </>
      }
    />
    <SubTitle>
      Messages go in. Responses come out. PII leaks, off-topic drift, wrong tone, hallucinations —
      and no standard place to hook in.
    </SubTitle>

    <div
      style={{
        marginTop: 40,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 22,
      }}
    >
      <BoxStep label="user message" tone="neutral" />
      <Arrow />
      <div
        style={{
          background: palette.surfaceHi2,
          border: `1px dashed ${palette.borderBright}`,
          borderRadius: 12,
          padding: '20px 26px',
          flex: 1,
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 10 }}>
          {['PII leak?', 'off-topic?', 'wrong tone?', 'hallucination?'].map((q) => (
            <span
              key={q}
              style={{
                fontFamily: font.mono,
                fontSize: 16,
                color: palette.rose,
                background: palette.surface,
                border: `1px solid ${palette.border}`,
                borderRadius: 999,
                padding: '6px 12px',
              }}
            >
              {q}
            </span>
          ))}
        </div>
        <div style={{ fontFamily: font.mono, fontSize: 20, color: palette.muted }}>agent.generate()</div>
      </div>
      <Arrow />
      <BoxStep label="response" tone="neutral" />
    </div>

    <div
      style={{
        marginTop: 32,
        fontFamily: font.mono,
        fontSize: 14,
        color: palette.muted,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}
    >
      What you'd build yourself · without processors
    </div>
    <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <Pill icon="🛡️" label="Safety" desc="PII detection, content moderation, prompt injection — bolted on after the fact." accent={palette.rose} />
      <Pill icon="🎯" label="Quality" desc="Brand voice, topic relevance, output validation — no standard hook point." accent={palette.amber} />
      <Pill icon="🧠" label="Memory" desc="Thread history, working memory, semantic recall — separate systems to wire up." accent={palette.purple} />
      <Pill icon="⚡" label="Performance" desc="Token limits, context pruning, caching — custom code for each agent." accent={palette.blue} />
      <Pill icon="🔁" label="Recovery" desc="Guardrails that retry, self-correction loops — hard to build reliably." accent={palette.cyan} />
      <Pill icon="📊" label="Observability" desc="What happened between input and output? Good luck debugging." accent={palette.green} />
    </div>

    <Footer index={2} />
  </Stage>
);

const Arrow = () => (
  <span style={{ fontFamily: font.mono, fontSize: 28, color: palette.muted }}>→</span>
);

const BoxStep = ({ label, tone }: { label: string; tone: 'neutral' | 'accent' }) => (
  <div
    style={{
      background: palette.surfaceHi,
      border: `1px solid ${tone === 'accent' ? palette.accent : palette.border}`,
      borderRadius: 12,
      padding: '20px 24px',
      fontFamily: font.mono,
      fontSize: 18,
      color: palette.textSoft,
      minWidth: 200,
      textAlign: 'center',
    }}
  >
    {label}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 03 — Everything is a Processor
// ════════════════════════════════════════════════════════════════════════════
const EverythingIsProcessor: Page = () => (
  <Stage>
    <Eyebrow>The insight</Eyebrow>
    <SectionTitle
      title={
        <>
          Everything is a <span style={{ color: palette.accent }}>processor.</span>
        </>
      }
    />
    <SubTitle>
      Processors are middleware for the agentic loop — hooks that run at specific phases of every
      LLM interaction. Memory, guardrails, routing, observability — all built on the same socket.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 14 }}>
      <PhaseChip icon="📥" label="Input" hook="processInput" />
      <Arrow />
      <PhaseChip icon="🔄" label="Each Step" hook="processInputStep" />
      <Arrow />
      <PhaseChip icon="🤖" label="LLM" hook="generate()" accent={palette.accent} />
      <Arrow />
      <PhaseChip icon="✅" label="Each Step" hook="processOutputStep" />
      <Arrow />
      <PhaseChip icon="📤" label="Result" hook="processOutputResult" />
    </div>

    <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24 }}>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 14,
          padding: '20px 24px',
          fontFamily: font.mono,
          fontSize: 16,
          lineHeight: 1.55,
          color: palette.textSoft,
        }}
      >
        <div style={{ color: palette.muted, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
          packages/core/src/memory/memory.ts
        </div>
        <div>
          <span style={{ color: palette.purple }}>async</span>{' '}
          <span style={{ color: palette.blue }}>getInputProcessors</span>() {'{'}
          <br />
          &nbsp;&nbsp;<span style={{ color: palette.purple }}>const</span> processors = [];
          <br />
          &nbsp;&nbsp;<span style={{ color: palette.purple }}>if</span> (config.workingMemory) processors.push(<span style={{ color: palette.accent }}>new WorkingMemory</span>(...));
          <br />
          &nbsp;&nbsp;<span style={{ color: palette.purple }}>if</span> (config.lastMessages) processors.push(<span style={{ color: palette.accent }}>new MessageHistory</span>(...));
          <br />
          &nbsp;&nbsp;<span style={{ color: palette.purple }}>if</span> (config.semanticRecall) processors.push(<span style={{ color: palette.accent }}>new SemanticRecall</span>(...));
          <br />
          &nbsp;&nbsp;<span style={{ color: palette.purple }}>if</span> (config.observationalMemory) processors.push(<span style={{ color: palette.accent }}>new ObservationalMemory</span>(...));
          <br />
          &nbsp;&nbsp;<span style={{ color: palette.purple }}>return</span> processors;
          <br />
          {'}'}
        </div>
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
          Insight
        </div>
        <div style={{ fontSize: 22, color: palette.text, fontWeight: 600, lineHeight: 1.4, marginBottom: 12 }}>
          The Memory class returns an array of processors.
        </div>
        <div style={{ fontSize: 19, color: palette.textSoft, lineHeight: 1.5 }}>
          Each memory feature — working memory, message history, semantic recall, observational
          memory — is a processor that hooks into <code style={{ fontFamily: font.mono, color: palette.accent }}>processInput</code> and{' '}
          <code style={{ fontFamily: font.mono, color: palette.accent }}>processOutputResult</code>.
          The same interface you implement when writing your own.
        </div>
      </div>
    </div>

    <Footer index={3} />
  </Stage>
);

const PhaseChip = ({ icon, label, hook, accent = palette.muted }: { icon: string; label: string; hook: string; accent?: string }) => (
  <div
    style={{
      flex: 1,
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 12,
      padding: '18px 16px',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 30, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 18, color: palette.text, fontWeight: 600 }}>{label}</div>
    <div style={{ fontFamily: font.mono, fontSize: 14, color: accent, marginTop: 4 }}>{hook}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 04 — Five Phases
// ════════════════════════════════════════════════════════════════════════════
const FivePhases: Page = () => (
  <Stage>
    <Eyebrow>Agent execution flow</Eyebrow>
    <SectionTitle
      title={
        <>
          Hook into <span style={{ color: palette.accent }}>any phase.</span>
        </>
      }
    />
    <SubTitle>
      Each <code style={{ fontFamily: font.mono, color: palette.accent }}>process*</code> function
      fires at a different point in the agent's execution cycle.
    </SubTitle>

    <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
      <PhaseCard
        icon="📥"
        phase="Phase 1"
        hook="processInput"
        when="Once · before the loop"
        purpose="Validate, redact, gate the whole conversation."
        cadence="once"
        accent={palette.green}
      />
      <PhaseCard
        icon="🔄"
        phase="Phase 2"
        hook="processInputStep"
        when="Each step · before LLM call"
        purpose="Swap models, gate tools, inject context."
        cadence="each step"
        accent={palette.blue}
      />
      <PhaseCard
        icon="🌊"
        phase="Phase 3"
        hook="processOutputStream"
        when="Each chunk · during stream"
        purpose="Watch tokens, abort mid-generation, redact live."
        cadence="each chunk"
        accent={palette.purple}
      />
      <PhaseCard
        icon="✅"
        phase="Phase 4"
        hook="processOutputStep"
        when="After LLM · before tools"
        purpose="Validate output, check drift, retry."
        cadence="each step"
        accent={palette.amber}
      />
      <PhaseCard
        icon="📤"
        phase="Phase 5"
        hook="processOutputResult"
        when="Once · after generation"
        purpose="Trigger business logic, escalate, persist."
        cadence="once"
        accent={palette.rose}
      />
    </div>

    <div
      style={{
        marginTop: 36,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        padding: '20px 26px',
        fontSize: 22,
        color: palette.textSoft,
        lineHeight: 1.5,
      }}
    >
      <span style={{ color: palette.accent, fontWeight: 700 }}>Tools loop back into Phase 2.</span>{' '}
      The agentic loop runs Phases 2 → LLM → 4 → tools repeatedly until no tools are called, then
      Phase 5 fires once with the final result.
    </div>

    <Footer index={4} />
  </Stage>
);

const PhaseCard = ({
  icon,
  phase,
  hook,
  when,
  purpose,
  cadence,
  accent,
}: {
  icon: string;
  phase: string;
  hook: string;
  when: string;
  purpose: string;
  cadence: string;
  accent: string;
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `3px solid ${accent}`,
      borderRadius: 12,
      padding: '18px 18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span
        style={{
          fontFamily: font.mono,
          fontSize: 11,
          color: palette.muted,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          background: palette.surfaceHi2,
          border: `1px solid ${palette.border}`,
          padding: '3px 8px',
          borderRadius: 999,
        }}
      >
        {cadence}
      </span>
    </div>
    <div style={{ fontFamily: font.mono, fontSize: 12, color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{phase}</div>
    <div style={{ fontFamily: font.mono, fontSize: 18, color: palette.text, fontWeight: 700 }}>{hook}</div>
    <div style={{ fontSize: 13, color: palette.muted, fontFamily: font.mono }}>{when}</div>
    <div style={{ fontSize: 16, color: palette.textSoft, lineHeight: 1.45, marginTop: 6 }}>{purpose}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — The UI (Studio)
// ════════════════════════════════════════════════════════════════════════════
const TheUI: Page = () => (
  <Stage>
    <Eyebrow>The processors UI</Eyebrow>
    <SectionTitle
      title={
        <>
          Test processors in <span style={{ color: palette.accent }}>the Studio.</span>
        </>
      }
    />
    <SubTitle>
      Every processor registered with your agent shows up in Mastra Studio — ready to inspect,
      step through, and test in isolation.
    </SubTitle>

    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 28 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ExampleRow num="00" name="Guardrails" tag="processInput + parallel" accent={palette.green} />
        <ExampleRow num="01" name="Every Phase" tag="all 5 phases" accent={palette.blue} />
        <ExampleRow num="02" name="Enterprise Pipeline" tag="full compliance" accent={palette.purple} />
      </div>

      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 14,
          padding: '24px 28px',
        }}
      >
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 14,
            color: palette.muted,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          localhost:4111 — Mastra Studio
        </div>
        <div
          style={{
            background: palette.bg,
            border: `1px solid ${palette.borderBright}`,
            borderRadius: 10,
            padding: '20px 22px',
            fontFamily: font.mono,
            fontSize: 16,
            color: palette.textSoft,
            lineHeight: 1.7,
          }}
        >
          <div style={{ color: palette.muted }}># start all three example servers</div>
          <div>cd examples/00-guardrails &amp;&amp; <span style={{ color: palette.accent }}>PORT=4111 mastra dev</span></div>
          <div>cd examples/01-beyond-guardrails &amp;&amp; <span style={{ color: palette.accent }}>PORT=4112 mastra dev</span></div>
          <div>cd examples/02-enterprise-pipeline &amp;&amp; <span style={{ color: palette.accent }}>PORT=4113 mastra dev</span></div>
        </div>
        <div style={{ marginTop: 16, fontSize: 18, color: palette.textSoft, lineHeight: 1.5 }}>
          Studio auto-detects registered processors and renders an inspector. Run input through any
          phase, see what the processor saw, what it returned, what it aborted with.
        </div>
      </div>
    </div>

    <Footer index={5} />
  </Stage>
);

const ExampleRow = ({ num, name, tag, accent }: { num: string; name: string; tag: string; accent: string }) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 12,
      padding: '18px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: 18,
    }}
  >
    <span style={{ fontFamily: font.mono, fontSize: 26, color: accent, fontWeight: 700 }}>{num}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 24, color: palette.text, fontWeight: 700 }}>{name}</div>
      <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, marginTop: 4 }}>{tag}</div>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 06 — Building Processors (three examples in a single map)
// ════════════════════════════════════════════════════════════════════════════
const BuildingProcessors: Page = () => (
  <Stage>
    <Eyebrow>Hands-on</Eyebrow>
    <SectionTitle
      title={
        <>
          Building <span style={{ color: palette.accent }}>processors.</span>
        </>
      }
    />
    <SubTitle>
      Three progressive examples. Each one adds a phase, a primitive, or a composition rule.
    </SubTitle>

    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <ExampleColumn
        num="00"
        title="Guardrails"
        subtitle="processInput + .parallel"
        accent={palette.green}
        snippets={[
          ['topic-guard.ts', 'safeguard model + typed metadata', [
            'class TopicGuard implements',
            "  Processor<'topic-guard',",
            '             TopicGuardMetadata> {',
            '  async processInput({ abort }) {',
            '    if (!onTopic)',
            "      abort('Off-topic',",
            '        { metadata: { category }})',
            '} }',
          ], { tag: 'Typed Metadata', body: 'The second generic types what abort() metadata carries — structured info about what tripped the guard.', color: palette.green }],
          ['pii-guard.ts', 'regex only · μs · $0', [
            'class PIIGuard implements ... {',
            '  async processInput({ abort }) {',
            '    for (const [t, p] of PATTERNS)',
            '      if (p.test(text)) hits.push(t)',
            "    if (hits.length) abort('PII')",
            '} }',
          ], { tag: 'No LLM Needed', body: 'Pure regex — runs in microseconds, costs nothing. Not every guard needs a model call.', color: palette.cyan }],
          ['compliance-pipeline.ts', 'parallel workflow', [
            'createWorkflow({...})',
            '  .parallel([topicGuard,',
            '             piiGuard,',
            '             moderation])',
            '  .map(mergeResults)',
            '  .commit()',
          ], { tag: 'Parallel Workflow', body: '.parallel() runs all checks concurrently. First abort() wins and returns its typed metadata.', color: palette.purple }],
        ]}
      />

      <ExampleColumn
        num="01"
        title="Every phase"
        subtitle="all 5 hooks in action"
        accent={palette.blue}
        snippets={[
          ['model-router.ts', 'processInputStep · swap model', [
            'async processInputStep(',
            '  { stepNumber }) {',
            '  if (stepNumber === 0) return',
            "  return { model: 'gpt-5-nano' }",
            '}',
          ], { tag: 'processInputStep', body: 'Runs before every LLM call. Can swap model, filter activeTools, modify systemMessages — the most powerful per-step hook.', color: palette.green }],
          ['tool-dependency-enforcer.ts', 'gate tools per step', [
            'const DEPS = {',
            '  create_order:',
            "    ['search', 'inventory']",
            '}',
            'async processInputStep({steps, tools}){',
            '  const active = filterByDeps(...)',
            '  return { activeTools: active }',
            '}',
          ], { tag: 'state', body: 'Mutable object that persists across method calls within a request. Track intent, token counts, flags.', color: palette.cyan }],
          ['cost-tracker.ts', 'processOutputStream · abort', [
            'async processOutputStream(',
            '  { part, state, abort }) {',
            "  if (part.type === 'text-delta')",
            '    state.tokens += est(part)',
            '  if (state.tokens > MAX)',
            "    abort('Budget exceeded')",
            '}',
          ], { tag: 'processOutputStream', body: 'Real-time chunk processing. Can abort() mid-stream if budget or safety is violated.', color: palette.rose }],
        ]}
      />

      <ExampleColumn
        num="02"
        title="Enterprise pipeline"
        subtitle="compose all of it"
        accent={palette.purple}
        snippets={[
          ['input-pipeline.ts', 'cheap → expensive in parallel', [
            'createWorkflow({...})',
            '  .then(regexPreFilter)        // μs',
            '  .parallel([topicGuard,',
            '             moderation])',
            '  .map(mergeResults).commit()',
          ], { tag: 'Layered Defense', body: 'Regex pre-filter runs first (free). Only if it passes do the expensive LLM checks run — and those run in parallel.', color: palette.green }],
          ['output-pipeline.ts', '.branch · conditional', [
            'createWorkflow({...})',
            '  .branch([',
            '    [ctx => ctx.stepNumber % 5',
            '            === 0, driftMonitor],',
            '  ])',
            '  .map(mergeResults).commit()',
          ], { tag: 'Conditional Branching', body: ".branch() only runs drift monitoring every 5th step. Don't pay for checks you don't need every time.", color: palette.amber }],
          ['enterprise-agent.ts', 'full config', [
            'new Agent({',
            '  inputProcessors: [',
            '    inputPipeline, new ModelRouter(),',
            '    new ToolDependencyEnforcer(),',
            '    new WrapUpEnforcer() ],',
            '  outputProcessors: [',
            '    outputPipeline,',
            '    new OrderConfirmation(),',
            '    new EscalationDetector() ],',
            '})',
          ], { tag: 'onFinish Side Effects', body: 'processOutputResult fires once per request — webhooks on orders, escalation detection. Business logic, not observability.', color: palette.purple }],
        ]}
      />
    </div>

    <Footer index={6} />
  </Stage>
);

type Annotation = { tag: string; body: string; color: string };
type Snippet = [string, string, string[]] | [string, string, string[], Annotation];

const ExampleColumn = ({
  num,
  title,
  subtitle,
  accent,
  snippets,
}: {
  num: string;
  title: string;
  subtitle: string;
  accent: string;
  snippets: Snippet[];
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderTop: `2px solid ${accent}`,
        borderRadius: 12,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span style={{ fontFamily: font.mono, fontSize: 22, color: accent, fontWeight: 700 }}>{num}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 18, color: palette.text, fontWeight: 700 }}>{title}</div>
        <div style={{ fontFamily: font.mono, fontSize: 12, color: palette.muted }}>{subtitle}</div>
      </div>
    </div>
    {snippets.map((snippet) => {
      const [path, tag, lines, note] = snippet as [string, string, string[], Annotation?];
      return (
        <div key={path} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              background: palette.surface,
              border: `1px solid ${palette.border}`,
              borderRadius: 10,
              padding: '10px 14px',
              fontFamily: font.mono,
              fontSize: 12,
              color: palette.textSoft,
              lineHeight: 1.55,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
              <span style={{ color: palette.muted, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{path}</span>
              <span style={{ color: accent, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{tag}</span>
            </div>
            {lines.map((line, i) => (
              <div key={i} style={{ whiteSpace: 'pre' }}>{line}</div>
            ))}
          </div>
          {note && (
            <div
              style={{
                borderLeft: `3px solid ${note.color}`,
                background: 'rgba(255,255,255,0.02)',
                padding: '6px 10px',
                borderRadius: 4,
              }}
            >
              <div style={{ fontFamily: font.mono, fontSize: 10, color: note.color, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
                {note.tag}
              </div>
              <div style={{ fontSize: 11, color: palette.textSoft, lineHeight: 1.4 }}>
                {note.body}
              </div>
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 07 — Performance
// ════════════════════════════════════════════════════════════════════════════
const Performance: Page = () => (
  <Stage>
    <Eyebrow>Thinking about performance</Eyebrow>
    <SectionTitle
      title={
        <>
          Not every check needs <span style={{ color: palette.accent }}>an LLM.</span>
        </>
      }
    />
    <SubTitle>
      Six strategies to keep processor pipelines fast and cost-effective. Cheap-first, LLM only
      when it earns it.
    </SubTitle>

    <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <PerfCard tag="Fast" title="Regex pre-filters" desc="Pattern-match PII, profanity, format. $0, microseconds. Only hit the LLM if regex passes." accent={palette.green} />
      <PerfCard tag="Fast" title="Safeguard models" desc="Classification doesn't need your main model. gpt-oss-safeguard-20b is purpose-built — faster, cheaper." accent={palette.green} />
      <PerfCard tag="Parallel" title="Run checks concurrently" desc=".parallel() runs independent checks at the same time. Latency = slowest, not sum." accent={palette.blue} />
      <PerfCard tag="Smart" title="Route per step" desc="processInputStep can swap models. Best model on step 0, downgrade for tool-result steps." accent={palette.amber} />
      <PerfCard tag="Smart" title="Only check what matters" desc=".branch() makes processing conditional. Drift check every 5th step, not every step." accent={palette.amber} />
      <PerfCard tag="Stream" title="Early termination" desc="processOutputStream can abort mid-generation. Stop on token budget or safety flag." accent={palette.purple} />
    </div>

    <div
      style={{
        marginTop: 28,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderLeft: `3px solid ${palette.accent}`,
        borderRadius: 12,
        padding: '18px 26px',
        fontSize: 22,
        color: palette.textSoft,
        lineHeight: 1.5,
      }}
    >
      <b style={{ color: palette.accent }}>The hierarchy:</b> regex (μs, $0) → safeguard model (ms,
      ¢) → parallel LLM checks (latency of slowest) → full model only for generation.
    </div>

    <Footer index={7} />
  </Stage>
);

const PerfCard = ({ tag, title, desc, accent }: { tag: string; title: string; desc: string; accent: string }) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 12,
      padding: '18px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}
  >
    <span
      style={{
        alignSelf: 'flex-start',
        fontFamily: font.mono,
        fontSize: 12,
        color: accent,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        background: palette.surfaceHi2,
        border: `1px solid ${palette.border}`,
        padding: '3px 10px',
        borderRadius: 999,
      }}
    >
      {tag}
    </span>
    <div style={{ fontSize: 22, color: palette.text, fontWeight: 700 }}>{title}</div>
    <div style={{ fontSize: 17, color: palette.textSoft, lineHeight: 1.45 }}>{desc}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 08 — Enterprise Flow
// ════════════════════════════════════════════════════════════════════════════
const EnterpriseFlow: Page = () => (
  <Stage>
    <Eyebrow>Enterprise pipeline · full picture</Eyebrow>
    <SectionTitle
      title={
        <>
          Every processor in <span style={{ color: palette.accent }}>one flow.</span>
        </>
      }
    />
    <SubTitle>How ten processors compose into a single enterprise pipeline.</SubTitle>

    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
      <FlowColumn
        header="Input pipeline"
        sub="processInput · workflow"
        accent={palette.green}
        steps={[
          ['🔍', 'RegexPreFilter', 'PII + profanity · μs · $0'],
          ['🏷️', 'TopicGuard', 'safeguard model'],
          ['🛡️', 'ModerationProcessor', 'safeguard model'],
          ['🔀', '.map() merge', 'merge parallel results'],
        ]}
      />
      <FlowColumn
        header="Loop · maxSteps 10"
        sub="processInputStep · per step"
        accent={palette.blue}
        steps={[
          ['💰', 'ModelRouter', 'step 0 → gpt-5.2 · 1+ → nano'],
          ['🔗', 'ToolDependencyEnforcer', 'create_order needs search + inv.'],
          ['⏰', 'WrapUpEnforcer', 'step ≥ 8 → "wrap up"'],
          ['🎯', 'TaskDriftMonitor', 'step % 5 → check alignment'],
        ]}
      />
      <FlowColumn
        header="Output pipeline"
        sub="processOutputResult · once"
        accent={palette.amber}
        steps={[
          ['📦', 'OrderConfirmation', 'create_order → notify'],
          ['🚨', 'EscalationDetector', 'nano · score human escalation'],
        ]}
      />
    </div>

    <div
      style={{
        marginTop: 28,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        padding: '18px 26px',
        fontSize: 20,
        color: palette.textSoft,
        lineHeight: 1.5,
      }}
    >
      <b style={{ color: palette.accent }}>Same primitive at every layer.</b> Regex, safeguard
      models, full LLMs, business logic — all expressed as processors and composed with{' '}
      <code style={{ fontFamily: font.mono, color: palette.accent }}>.parallel()</code>,{' '}
      <code style={{ fontFamily: font.mono, color: palette.accent }}>.branch()</code>, and{' '}
      <code style={{ fontFamily: font.mono, color: palette.accent }}>.then()</code>.
    </div>

    <Footer index={8} />
  </Stage>
);

const FlowColumn = ({
  header,
  sub,
  accent,
  steps,
}: {
  header: string;
  sub: string;
  accent: string;
  steps: [string, string, string][];
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 12,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 13, color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{header}</div>
    <div style={{ fontFamily: font.mono, fontSize: 12, color: palette.muted }}>{sub}</div>
    <div style={{ display: 'grid', gap: 8, marginTop: 4 }}>
      {steps.map(([icon, name, desc]) => (
        <div
          key={name}
          style={{
            background: palette.surfaceHi,
            border: `1px solid ${palette.border}`,
            borderRadius: 10,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 22 }}>{icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.text, fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 13, color: palette.muted, lineHeight: 1.4, marginTop: 2 }}>{desc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 09 — Built-in Processors
// ════════════════════════════════════════════════════════════════════════════
const BuiltIns: Page = () => (
  <Stage>
    <Eyebrow>Battery included</Eyebrow>
    <SectionTitle
      title={
        <>
          Built-in <span style={{ color: palette.accent }}>processors.</span>
        </>
      }
    />
    <SubTitle>
      Mastra ships processors you can use out of the box — or read as inspiration for your own.
    </SubTitle>

    <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 22 }}>
      <CategoryGrid
        title="🛡️ Safety"
        accent={palette.rose}
        items={[
          ['🔒', 'PIIDetector', 'Detects & redacts personal information'],
          ['⚖️', 'ModerationProcessor', 'Content safety classification'],
          ['🚫', 'PromptInjectionDetector', 'Blocks injection attempts'],
          ['🔤', 'UnicodeNormalizer', 'Normalizes encoding attacks'],
          ['🧹', 'SystemPromptScrubber', 'Blocks system prompt leakage'],
        ]}
      />
      <CategoryGrid
        title="⚡ Performance"
        accent={palette.amber}
        items={[
          ['📏', 'TokenLimiter', 'Enforces context window limits'],
          ['📦', 'BatchParts', 'Batches streaming parts efficiently'],
          ['✂️', 'ToolCallFilter', 'Strips tool calls from message context'],
        ]}
      />
      <CategoryGrid
        title="🧠 Intelligence"
        accent={palette.blue}
        items={[
          ['📋', 'StructuredOutput', 'Schema-based response formatting'],
          ['🎯', 'SkillsProcessor', 'Dynamic skill-based routing'],
          ['🔍', 'ToolSearchProcessor', 'Dynamic tool discovery per step'],
          ['🌍', 'LanguageDetector', 'Detects & routes by language'],
        ]}
      />
      <CategoryGrid
        title="💾 Memory"
        accent={palette.purple}
        items={[
          ['📜', 'MessageHistory', 'Thread-based message persistence'],
          ['📝', 'WorkingMemory', 'Cross-conversation scratchpad'],
          ['🔎', 'SemanticRecall', 'Vector-based context retrieval'],
          ['🧬', 'ObservationalMemory', 'Human-inspired observe & reflect'],
        ]}
      />
    </div>

    <Footer index={9} />
  </Stage>
);

const CategoryGrid = ({ title, accent, items }: { title: string; accent: string; items: [string, string, string][] }) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 12,
      padding: '18px 22px',
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 14, color: accent, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
      {title}
    </div>
    <div style={{ display: 'grid', gap: 6 }}>
      {items.map(([icon, name, desc]) => (
        <div key={name} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontFamily: font.mono, fontSize: 16, color: palette.text, minWidth: 220 }}>{name}</span>
          <span style={{ fontSize: 15, color: palette.muted, flex: 1 }}>{desc}</span>
        </div>
      ))}
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 10 — Wrap-up
// ════════════════════════════════════════════════════════════════════════════
const WrapUp: Page = () => (
  <Stage>
    <Eyebrow>Wrap-up</Eyebrow>
    <SectionTitle
      title={
        <>
          Key <span style={{ color: palette.accent }}>takeaways.</span>
        </>
      }
    />

    <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
      <Pill
        icon="🛡️"
        label="Guardrails are just the start"
        desc="processInput stops bad messages — but processors also route models, enforce tool order, monitor drift, and trigger business logic."
        accent={palette.green}
      />
      <Pill
        icon="⚡"
        label="Performance is a design choice"
        desc="Regex first, safeguard models for classification, parallel checks, cheaper models per step. Don't pay for what you don't need."
        accent={palette.amber}
      />
      <Pill
        icon="🏗️"
        label="Compose into pipelines"
        desc=".then(), .parallel(), .branch() — build layered defense from simple, testable building blocks."
        accent={palette.purple}
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
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 14, color: palette.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
        Resources
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 19 }}>
        <Link icon="📖" label="Processors documentation" href="mastra.ai/docs" />
        <Link icon="🧠" label="Memory processors guide" href="mastra.ai/docs" />
        <Link icon="💻" label="Mastra GitHub" href="github.com/mastra-ai" />
        <Link icon="💬" label="Discord community" href="discord.gg/mastra" />
      </div>
      <div style={{ marginTop: 18, display: 'flex', gap: 28, fontFamily: font.mono, fontSize: 16, color: palette.muted }}>
        <span>𝕏 <span style={{ color: palette.textSoft }}>x.com/Mastra</span></span>
        <span>𝕏 <span style={{ color: palette.textSoft }}>x.com/ShlomesLew</span></span>
        <span>𝕏 <span style={{ color: palette.textSoft }}>x.com/bookercodes</span></span>
      </div>
    </div>

    <div
      style={{
        marginTop: 24,
        fontSize: 22,
        color: palette.textSoft,
        lineHeight: 1.5,
        maxWidth: 1500,
      }}
    >
      <b style={{ color: palette.accent }}>Next workshop:</b> Agent Harness — what it is, why it
      matters, what it enables.
    </div>

    <Footer index={10} />
  </Stage>
);

const Link = ({ icon, label, href }: { icon: string; label: string; href: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ fontSize: 22 }}>{icon}</span>
    <span style={{ color: palette.text, fontWeight: 600 }}>{label}</span>
    <span style={{ fontFamily: font.mono, fontSize: 15, color: palette.accent }}>{href}</span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// Meta + speaker notes
// ════════════════════════════════════════════════════════════════════════════
export const meta: SlideMeta = {
  title: 'Mastra · Processors',
};

export const notes: (string | undefined)[] = [
  // 01 Cover
  `Welcome them. Daniel + Alex hosting. The talk is about Mastra Processors — middleware for the agentic loop. We'll go from "what's a processor" through five execution phases, building three progressively richer examples, ending on built-ins and performance discipline.`,

  // 02 The Problem
  `Set the pain. Today an agent is a black box: messages go in, responses come out, lots of unsolved problems in between — PII, off-topic drift, wrong tone, hallucinations. Without processors you'd hand-roll all of this: safety, quality, memory, performance, recovery, observability. There's no standard hook point. That's the gap processors fill.`,

  // 03 Everything is a Processor
  `The core insight. Processors are middleware for the agentic loop. The big tell: when you configure memory on an agent, Mastra doesn't do anything magical — Memory.getInputProcessors() returns an array of processors. Working memory, message history, semantic recall, observational memory — all processors. You implement the same interface when you write your own. Memory is not a special case.`,

  // 04 Five Phases
  `Walk the lifecycle: processInput (once, before the loop), processInputStep (each step, before LLM), processOutputStream (each chunk, during stream), processOutputStep (after LLM, before tools), processOutputResult (once, after generation). Tools loop you back to Phase 2 — Phase 5 only fires when there are no more tool calls. The cadence pills (once / each step / each chunk) tell you what kind of work belongs where.`,

  // 05 The UI
  `Every processor registered with your agent shows up in Mastra Studio — ready to inspect and test in isolation. Run input through any phase, see what the processor saw, what it returned, what it aborted with. Three example apps: Guardrails (port 4111), Beyond Guardrails / Every Phase (4112), Enterprise Pipeline (4113). Live demo time.`,

  // 06 Building Processors
  `Walk three example processors. TopicGuard uses processInput + a fast safeguard model + typed metadata — Processor<TId, TMetadata> means abort() carries structured info. PIIGuard is regex only — μs, $0, no LLM. Compose with createWorkflow().parallel() — first abort wins, returns its typed metadata. Notes panel: typed metadata, parallel, safeguard model.`,

  // 07 Performance
  `Six discipline strategies. Regex pre-filter for PII / profanity (free, instant). Safeguard models for classification (cheap, fast, purpose-built). .parallel() for independent checks (latency = slowest, not sum). Per-step routing — best model on step 0, cheap on tool-result steps. .branch() for conditional checks — drift every 5th step, not every step. Stream-time abort — kill mid-generation on token budget or safety flag. The hierarchy: regex → safeguard → parallel LLM → full model.`,

  // 08 Enterprise Flow
  `The capstone. Ten processors, three lanes. Input pipeline: regex pre-filter, then parallel TopicGuard + Moderation, then .map() merge. Loop (each step): ModelRouter swaps models, ToolDependencyEnforcer requires create_order to come after search + inventory, WrapUpEnforcer pushes summary at step ≥ 8, TaskDriftMonitor checks every 5th step. Output (once): OrderConfirmation triggers notifications when create_order ran, EscalationDetector scores human handoff. Same primitive at every layer.`,

  // 09 Built-ins
  `What ships today. Safety: PIIDetector, ModerationProcessor, PromptInjectionDetector, UnicodeNormalizer, SystemPromptScrubber. Performance: TokenLimiter, BatchParts, ToolCallFilter. Intelligence: StructuredOutput, SkillsProcessor, ToolSearchProcessor, LanguageDetector. Memory: MessageHistory, WorkingMemory, SemanticRecall, ObservationalMemory. Use them as-is or read them as inspiration for your own.`,

  // 10 Wrap-up
  `Three takeaways: guardrails are just the start (every phase has a use), performance is a design choice (cheap-first hierarchy), compose into pipelines (.then / .parallel / .branch). Resources slide. Tease the next workshop: Agent Harness. Q&A.`,
];

export default [
  Cover,
  TheProblem,
  EverythingIsProcessor,
  FivePhases,
  TheUI,
  BuildingProcessors,
  Performance,
  EnterpriseFlow,
  BuiltIns,
  WrapUp,
] satisfies Page[];
