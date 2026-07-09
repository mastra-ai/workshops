import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import type { ReactNode } from 'react';

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
  typeScale: { hero: 164, body: 36 },
  radius: 14,
};

const palette = {
  bg: design.palette.bg,
  text: design.palette.text,
  accent: design.palette.accent,
  surface: '#0a0a0a',
  surfaceHi: '#151515',
  border: '#242424',
  borderBright: '#3a3a3a',
  soft: '#a8a8a8',
  muted: '#727272',
  dim: '#4f4f4f',
  blue: '#6aa8ff',
  amber: '#e3b758',
  purple: '#b48cff',
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
  position: 'relative' as const,
  overflow: 'hidden',
};

const Stage = ({ children }: { children: ReactNode }) => (
  <div style={{ ...fill, padding: 120, display: 'flex', flexDirection: 'column' }}>{children}</div>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      fontFamily: font.mono,
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
    }}
  >
    {children}
  </div>
);

const Title = ({ children, maxWidth = 1500 }: { children: ReactNode; maxWidth?: number }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 88,
      fontWeight: 850,
      lineHeight: 1.04,
      letterSpacing: '-0.04em',
      margin: '24px 0 0',
      maxWidth,
    }}
  >
    {children}
  </h1>
);

const Subtitle = ({ children, maxWidth = 1320 }: { children: ReactNode; maxWidth?: number }) => (
  <p style={{ fontSize: 34, lineHeight: 1.45, color: palette.soft, maxWidth, margin: '32px 0 0' }}>{children}</p>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 54,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: font.mono,
        fontSize: 18,
        letterSpacing: '0.14em',
        color: palette.dim,
      }}
    >
      <span>MASTRACODE · CONSULTING TEAMS</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Card = ({ label, title, children, accent = palette.accent }: { label: string; title: string; children: ReactNode; accent?: string }) => (
  <div
    style={{
      flex: 1,
      minHeight: 255,
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `3px solid ${accent}`,
      borderRadius: 'var(--osd-radius)',
      padding: '34px 34px 30px',
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 17, letterSpacing: '0.18em', color: accent, textTransform: 'uppercase' }}>
      {label}
    </div>
    <h3 style={{ fontSize: 38, lineHeight: 1.14, margin: '24px 0 18px', letterSpacing: '-0.025em' }}>{title}</h3>
    <p style={{ fontSize: 26, lineHeight: 1.45, color: palette.soft, margin: 0 }}>{children}</p>
  </div>
);

const Pill = ({ children, accent = palette.accent }: { children: ReactNode; accent?: string }) => (
  <div
    style={{
      fontFamily: font.mono,
      fontSize: 24,
      color: palette.text,
      padding: '22px 30px',
      border: `1px solid ${palette.borderBright}`,
      borderLeft: `5px solid ${accent}`,
      background: palette.surface,
      borderRadius: 12,
    }}
  >
    {children}
  </div>
);

const ToolTile = ({ name, note, accent = palette.accent }: { name: string; note: string; accent?: string }) => (
  <div
    style={{
      minHeight: 146,
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderLeft: `4px solid ${accent}`,
      borderRadius: 'var(--osd-radius)',
      padding: '28px 30px',
    }}
  >
    <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.025em' }}>{name}</div>
    <div style={{ fontSize: 24, lineHeight: 1.35, color: palette.soft, marginTop: 14 }}>{note}</div>
  </div>
);

const Cover: Page = () => (
  <Stage>
    <div style={{ marginTop: 92 }}>
      <Eyebrow>Presentation draft</Eyebrow>
      <h1
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 900,
          lineHeight: 0.94,
          letterSpacing: '-0.065em',
          margin: '36px 0 0',
          maxWidth: 1260,
        }}
      >
        MastraCode for everyone
      </h1>
      <Subtitle maxWidth={980}>A practical view of how to use MastraCode for your daily work.</Subtitle>
    </div>
    <div
      style={{
        position: 'absolute',
        right: 120,
        bottom: 124,
        width: 470,
        height: 470,
        border: `1px solid ${palette.borderBright}`,
        borderRadius: 28,
        background: `radial-gradient(circle at 28% 24%, ${palette.accent}55, transparent 34%), linear-gradient(135deg, ${palette.surfaceHi}, ${palette.bg})`,
      }}
    />
    <Footer />
  </Stage>
);

const WhyNow: Page = () => (
  <Stage>
    <Eyebrow>Why now</Eyebrow>
    <Title>Software work is moving from assistance to delegation.</Title>
    <div style={{ display: 'flex', gap: 28, marginTop: 76 }}>
      <Card label="Copilots" title="Complete the next line" accent={palette.blue}>Inline help, local edits, and faster individual typing.</Card>
      <Card label="CLI agents" title="Operate on the repo">Inspect, edit, run commands, verify, and iterate inside a project.</Card>
      <Card label="Platforms" title="Turn work into systems" accent={palette.purple}>Connect workflows, memory, evals, and governance to production use.</Card>
    </div>
    <Footer />
  </Stage>
);

const Landscape: Page = () => (
  <Stage>
    <Eyebrow>CLI landscape</Eyebrow>
    <Title>You have to start somewhere.</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 74 }}>
      <ToolTile name="MastraCode" note="Mastra" />
      <ToolTile name="Codex" note="OpenAI" accent={palette.blue} />
      <ToolTile name="Claude CLI" note="Anthropic" accent={palette.amber} />
      <ToolTile name="PI" note="Earendil" accent={palette.cyan} />
      <ToolTile name="Hermes Agent" note="Nous Research" accent={palette.purple} />
      <ToolTile name="OpenClaw" note="OpenClaw Foundation" accent={palette.blue} />
    </div>
    <Footer />
  </Stage>
);

const Models: Page = () => (
  <Stage>
    <Eyebrow>Models</Eyebrow>
    <Title>Start with any plan.</Title>
    <Subtitle>For meaningful tasks, ask multiple models for coding plans and compare the shape of their answers.</Subtitle>
    <div style={{ display: 'flex', gap: 28, marginTop: 70 }}>
      <Card label="Google" title="Get a Gemini plan" accent={palette.blue}>{" "}</Card>
      <Card label="Anthropic" title="Get a Claude plan" accent={palette.amber}>{" "}</Card>
      <Card label="OpenAI" title="Get a GPT plan">{" "}</Card>
    </div>
    <Footer />
  </Stage>
);

const ObservationalMemory: Page = () => (
  <Stage>
    <Eyebrow>Observational memory</Eyebrow>
    <Title>Memory makes agent work compound.</Title>
    <div style={{ display: 'flex', gap: 28, marginTop: 72 }}>
      <Card label="01" title="Observe">Capture what happened: intent, context, tool results, and state changes.</Card>
      <Card label="02" title="Reflect" accent={palette.blue}>Compress observations into lessons, preferences, constraints, and patterns.</Card>
      <Card label="03" title="Recall" accent={palette.purple}>Bring the right context back later so the team does not restart from zero.</Card>
    </div>
    <Footer />
  </Stage>
);

const SkillsCommands: Page = () => (
  <Stage>
    <Eyebrow>Skills and commands</Eyebrow>
    <Title>Make it repeatable.</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 70 }}>
      <Card label="Skills" title="Reusable playbooks">Package domain-specific instructions, patterns, and constraints for recurring work.</Card>
      <Card label="Commands" title="Explicit actions" accent={palette.blue}>Give teams standard entry points for tasks they want agents to perform safely.</Card>
      <Card label="Together" title="Less prompt folklore" accent={palette.purple}>Move knowledge out of one person’s head and into shared operating practice.</Card>
      <Card label="For consulting" title="Repeatable delivery" accent={palette.amber}>Make client work more consistent without flattening expert judgment.</Card>
    </div>
    <Footer />
  </Stage>
);

const SoftwareLoop: Page = () => (
  <Stage>
    <Eyebrow>Operating loop</Eyebrow>
    <Title>The agentic software loop is a proof loop.</Title>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 70, maxWidth: 1220 }}>
      <Pill accent={palette.blue}>Understand — read the repo, constraints, and intent before changing anything.</Pill>
      <Pill>Change — make focused edits that follow existing conventions.</Pill>
      <Pill accent={palette.purple}>Verify — run the relevant checks instead of assuming correctness.</Pill>
      <Pill accent={palette.amber}>Prove — summarize what changed, why it works, and what remains.</Pill>
    </div>
    <Footer />
  </Stage>
);

const AdoptionPath: Page = () => (
  <Stage>
    <Eyebrow>Adoption path</Eyebrow>
    <Title>Adopt coding agents where the loop is visible.</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28, marginTop: 76 }}>
      <Card label="Start" title="Low-risk tasks" accent={palette.blue}>Docs, tests, refactors, and scoped fixes with clear acceptance criteria.</Card>
      <Card label="Standardize" title="Shared rules">Define prompts, skills, commands, verification, and approval gates.</Card>
      <Card label="Scale" title="Measure outcomes" accent={palette.purple}>Track cycle time, review quality, defects, onboarding speed, and repeatability.</Card>
    </div>
    <Footer />
  </Stage>
);


export const meta: SlideMeta = {
  title: 'MastraCode for Consulting Teams',
  createdAt: '2026-07-08T17:25:42.546Z',
};

export default [
  Cover,
  WhyNow,
  Landscape,
  Models,
  ObservationalMemory,
  SkillsCommands,
  SoftwareLoop,
  AdoptionPath,
] satisfies Page[];
