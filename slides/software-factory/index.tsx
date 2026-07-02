import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import preAiSoftwareLoop from './assets/pre-ai-software-loop.png';
import softwareFactoryDiagram from './assets/software-factory.png';
import shaneAvatar from './assets/shane-avatar.jpg';
import alexAvatar from './assets/alex-avatar.jpg';

export const design: DesignSystem = {
  palette: {
    bg: '#020202',
    text: '#d9d9d9',
    accent: '#18fb6f',
  },
  fonts: {
    display: 'Geist, Inter, system-ui, -apple-system, sans-serif',
    body: 'Geist, Inter, system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 166, body: 36 },
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
  dim: '#585858',
  green: design.palette.accent,
  blue: '#6aa8ff',
  amber: '#e3b758',
  purple: '#b48cff',
  rose: '#ff7a89',
  cyan: '#5ed4d6',
  red: '#ff6464',
};

const font = {
  display: design.fonts.display,
  body: design.fonts.body,
  mono: 'Geist Mono, JetBrains Mono, ui-monospace, Menlo, Monaco, Consolas, monospace',
};

const TOTAL = 24;

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  letterSpacing: '-0.012em',
  position: 'relative',
  overflow: 'hidden',
};

const Grid = ({ opacity = 0.16 }: { opacity?: number }) => (
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
          ? `radial-gradient(920px 540px at 16% 22%, ${color}22 0%, transparent 62%), radial-gradient(760px 460px at 84% 76%, ${palette.surfaceHi} 0%, transparent 66%)`
          : `radial-gradient(920px 540px at 84% 22%, ${color}22 0%, transparent 62%), radial-gradient(760px 460px at 16% 76%, ${palette.surfaceHi} 0%, transparent 66%)`,
    }}
  />
);

const Footer = ({ index, section = 'MASTRA · SOFTWARE FACTORY' }: { index: number; section?: string }) => (
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
      {String(index).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
    </span>
  </div>
);

const Stage = ({
  children,
  index,
  section,
  padding = '106px 120px 118px',
  glow = palette.accent,
}: {
  children: ReactNode;
  index: number;
  section?: string;
  padding?: string;
  glow?: string;
}) => (
  <div style={{ ...fill, padding, display: 'flex', flexDirection: 'column' }}>
    <Grid />
    <Glow color={glow} side={index % 2 === 0 ? 'right' : 'left'} />
    <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>
    <Footer index={index} section={section} />
  </div>
);

const Eyebrow = ({ children, color = palette.accent }: { children: ReactNode; color?: string }) => (
  <div
    style={{
      fontFamily: font.mono,
      fontSize: 22,
      fontWeight: 750,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);

const Title = ({
  children,
  size = 78,
  maxWidth = 1540,
}: {
  children: ReactNode;
  size?: number;
  maxWidth?: number;
}) => (
  <h1
    style={{
      fontFamily: font.display,
      fontSize: size,
      fontWeight: 900,
      lineHeight: 1.02,
      letterSpacing: '-0.035em',
      margin: '22px 0 0',
      maxWidth,
      color: 'var(--osd-text)',
    }}
  >
    {children}
  </h1>
);

const Subtitle = ({ children, maxWidth = 1320, size = 31 }: { children: ReactNode; maxWidth?: number; size?: number }) => (
  <p style={{ fontSize: size, color: palette.textSoft, lineHeight: 1.38, maxWidth, margin: '26px 0 0' }}>{children}</p>
);

const Code = ({ children, color = palette.accent }: { children: ReactNode; color?: string }) => (
  <code style={{ fontFamily: font.mono, fontSize: '0.9em', color }}>{children}</code>
);

const Card = ({
  label,
  title,
  children,
  accent = palette.accent,
  style,
}: {
  label: string;
  title: ReactNode;
  children: ReactNode;
  accent?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      background: `linear-gradient(180deg, ${accent}12 0%, ${palette.surface} 58%)`,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 18,
      padding: '28px 30px',
      boxShadow: '0 28px 80px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.04)',
      ...style,
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 17, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent }}>
      {label}
    </div>
    <div style={{ marginTop: 18, fontSize: 34, lineHeight: 1.12, fontWeight: 850, color: palette.text }}>{title}</div>
    <div style={{ marginTop: 18, fontSize: 24, lineHeight: 1.36, color: palette.textSoft }}>{children}</div>
  </div>
);

const QuoteCard = ({
  quote,
  source,
  accent = palette.accent,
  compact = false,
}: {
  quote: ReactNode;
  source: string;
  accent?: string;
  compact?: boolean;
}) => (
  <div
    style={{
      borderRadius: 24,
      border: `1px solid ${accent}55`,
      borderLeft: `5px solid ${accent}`,
      background: `linear-gradient(120deg, ${accent}12 0%, ${palette.surface} 62%)`,
      padding: compact ? '28px 34px' : '40px 46px',
      boxShadow: '0 34px 90px rgba(0,0,0,0.42)',
    }}
  >
    <div style={{ fontSize: compact ? 36 : 45, lineHeight: 1.15, letterSpacing: '-0.025em', color: palette.text, fontWeight: 850 }}>{quote}</div>
    <div style={{ marginTop: compact ? 18 : 24, fontFamily: font.mono, fontSize: 18, letterSpacing: '0.16em', color: accent, textTransform: 'uppercase' }}>
      {source}
    </div>
  </div>
);

const FlowNode = ({
  label,
  detail,
  accent = palette.accent,
  style,
}: {
  label: string;
  detail?: string;
  accent?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      minHeight: 118,
      borderRadius: 18,
      border: `1px solid ${accent}55`,
      background: `linear-gradient(180deg, ${accent}14 0%, ${palette.surface} 78%)`,
      padding: '24px 26px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxShadow: `0 20px 60px ${accent}0d`,
      ...style,
    }}
  >
    <div style={{ fontSize: 29, fontWeight: 850, lineHeight: 1.1, color: palette.text }}>{label}</div>
    {detail && <div style={{ marginTop: 10, fontSize: 20, lineHeight: 1.3, color: palette.textSoft }}>{detail}</div>}
  </div>
);

const Arrow = ({ label }: { label?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 58 }}>
    <div style={{ fontFamily: font.mono, fontSize: 40, color: palette.accent, lineHeight: 1 }}>→</div>
    {label && <div style={{ marginTop: 8, fontFamily: font.mono, fontSize: 12, color: palette.muted, letterSpacing: '0.12em' }}>{label}</div>}
  </div>
);

const Gate = ({ label, accent = palette.amber }: { label: string; accent?: string }) => (
  <div
    style={{
      width: 184,
      minHeight: 106,
      borderRadius: 16,
      border: `1px dashed ${accent}`,
      background: `${accent}10`,
      color: palette.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontFamily: font.mono,
      fontSize: 18,
      lineHeight: 1.3,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: 18,
    }}
  >
    {label}
  </div>
);

const PersonCard = ({ avatar, name, role, accent }: { avatar: string; name: string; role: string; accent: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
    <div
      style={{
        width: 86,
        height: 86,
        borderRadius: '50%',
        border: `2px solid ${accent}`,
        background: palette.surfaceHi,
        padding: 4,
        boxShadow: `0 0 44px ${accent}2f`,
      }}
    >
      <img
        src={avatar}
        alt={`${name} headshot`}
        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
      />
    </div>
    <div>
      <div style={{ fontSize: 26, color: palette.text, fontWeight: 850 }}>{name}</div>
      <div style={{ marginTop: 4, fontSize: 19, color: palette.muted }}>{role}</div>
    </div>
  </div>
);

const CodePanel = ({ label, children, accent = palette.green }: { label: string; children: string; accent?: string }) => (
  <div
    style={{
      borderRadius: 20,
      border: `1px solid ${palette.borderBright}`,
      background: `linear-gradient(180deg, ${palette.surfaceHi} 0%, ${palette.surface} 100%)`,
      boxShadow: '0 34px 90px rgba(0,0,0,0.42)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        padding: '18px 24px',
        borderBottom: `1px solid ${palette.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: font.mono,
        fontSize: 16,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: accent,
      }}
    >
      <span>{label}</span>
      <span style={{ color: palette.dim }}>conceptual</span>
    </div>
    <pre style={{ margin: 0, padding: 28, fontFamily: font.mono, fontSize: 24, lineHeight: 1.45, color: palette.textSoft, whiteSpace: 'pre-wrap' }}>
      {children}
    </pre>
  </div>
);

const DiagramPanel = ({ children, caption }: { children: ReactNode; caption?: string }) => (
  <div
    style={{
      borderRadius: 24,
      border: `1px solid ${palette.borderBright}`,
      background: `linear-gradient(180deg, ${palette.surfaceHi} 0%, ${palette.surface} 100%)`,
      padding: 30,
      boxShadow: '0 34px 90px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.04)',
    }}
  >
    {children}
    {caption && <div style={{ marginTop: 22, fontFamily: font.mono, fontSize: 15, letterSpacing: '0.14em', color: palette.dim, textTransform: 'uppercase' }}>{caption}</div>}
  </div>
);

const RiskCell = ({ label, tone, accent }: { label: string; tone: string; accent: string }) => (
  <div
    style={{
      minHeight: 92,
      borderRadius: 14,
      border: `1px solid ${accent}55`,
      background: `${accent}12`,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div style={{ fontSize: 23, fontWeight: 850, color: palette.text }}>{label}</div>
    <div style={{ marginTop: 7, fontFamily: font.mono, fontSize: 13, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{tone}</div>
  </div>
);

const RiskMatrix = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '210px repeat(3, 1fr)', gap: 12 }}>
    <div />
    <div style={{ fontFamily: font.mono, fontSize: 15, color: palette.muted, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Low risk</div>
    <div style={{ fontFamily: font.mono, fontSize: 15, color: palette.muted, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Medium risk</div>
    <div style={{ fontFamily: font.mono, fontSize: 15, color: palette.muted, letterSpacing: '0.14em', textTransform: 'uppercase' }}>High risk</div>
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, color: palette.textSoft, fontWeight: 800 }}>Simple</div>
    <RiskCell label="Auto lane" tone="agent fixes + tests" accent={palette.green} />
    <RiskCell label="Fast review" tone="human glances" accent={palette.blue} />
    <RiskCell label="Stop" tone="human plan first" accent={palette.amber} />
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, color: palette.textSoft, fontWeight: 800 }}>Ambiguous</div>
    <RiskCell label="Plan gate" tone="agent drafts plan" accent={palette.blue} />
    <RiskCell label="Architecture" tone="review before code" accent={palette.amber} />
    <RiskCell label="Design review" tone="senior owner" accent={palette.rose} />
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, color: palette.textSoft, fontWeight: 800 }}>Systemic</div>
    <RiskCell label="Experiment" tone="sandbox only" accent={palette.amber} />
    <RiskCell label="Split work" tone="smaller lanes" accent={palette.rose} />
    <RiskCell label="Manual lane" tone="humans decide" accent={palette.red} />
  </div>
);

const RailStep = ({ number, title, detail, accent }: { number: string; title: string; detail: string; accent: string }) => (
  <div style={{ flex: 1, position: 'relative' }}>
    <div
      style={{
        height: 8,
        background: accent,
        borderRadius: 999,
        boxShadow: `0 0 30px ${accent}40`,
        marginBottom: 26,
      }}
    />
    <div style={{ fontFamily: font.mono, fontSize: 20, color: accent, letterSpacing: '0.16em' }}>{number}</div>
    <div style={{ marginTop: 14, fontSize: 31, lineHeight: 1.1, fontWeight: 900, color: palette.text }}>{title}</div>
    <div style={{ marginTop: 14, fontSize: 20, lineHeight: 1.34, color: palette.textSoft }}>{detail}</div>
  </div>
);

const MaturityRail = () => (
  <div style={{ display: 'flex', gap: 18, marginTop: 64 }}>
    <RailStep number="01" title="Manual SDLC" detail="Humans move every ticket through every checkpoint." accent={palette.muted} />
    <RailStep number="02" title="Assistants" detail="Coding agents speed up local build loops." accent={palette.blue} />
    <RailStep number="03" title="Guarded" detail="Review bots, tests, and plan gates raise quality." accent={palette.amber} />
    <RailStep number="04" title="Auto lanes" detail="Low-risk requests flow through workflows." accent={palette.purple} />
    <RailStep number="05" title="Operator" detail="Humans monitor, steer, approve, and halt." accent={palette.green} />
  </div>
);

const PrimitiveRow = ({ primitive, factoryRole, job, accent }: { primitive: string; factoryRole: string; job: string; accent: string }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '300px 330px 1fr',
      gap: 18,
      alignItems: 'center',
      padding: '14px 20px',
      borderRadius: 16,
      border: `1px solid ${palette.border}`,
      background: `${accent}0e`,
      marginBottom: 10,
    }}
  >
    <div style={{ fontSize: 29, fontWeight: 900, color: palette.text }}>{primitive}</div>
    <div style={{ fontFamily: font.mono, fontSize: 16, letterSpacing: '0.13em', color: accent, textTransform: 'uppercase' }}>{factoryRole}</div>
    <div style={{ fontSize: 21, lineHeight: 1.22, color: palette.textSoft }}>{job}</div>
  </div>
);

const PrimitiveMap = () => (
  <div style={{ marginTop: 34 }}>
    <PrimitiveRow primitive="Agents" factoryRole="workers" job="Reason, plan, review, implement, and use tools inside bounded jobs." accent={palette.green} />
    <PrimitiveRow primitive="Workflows" factoryRole="assembly lines" job="Make SDLC stages explicit: branch, gate, retry, pause, resume, and commit." accent={palette.blue} />
    <PrimitiveRow primitive="AgentControllers" factoryRole="floor supervisor" job="Assign the right worker, team, or model; watch status; pause, resume, or halt the line when risk changes." accent={palette.purple} />
    <PrimitiveRow primitive="Agent Signals" factoryRole="communication lines" job="Carry messages between agents, controllers, humans, and outside systems; let webhooks wake the factory up." accent={palette.rose} />
    <PrimitiveRow primitive="Tools + MCP" factoryRole="hands + sensors" job="Read code, query logs, inspect CI, update tickets, open PRs, and reach external systems." accent={palette.amber} />
    <PrimitiveRow primitive="Observability" factoryRole="factory record" job="Persist state, traces, metrics, decisions, scores, and regression evidence." accent={palette.cyan} />
  </div>
);

const Cover: Page = () => (
  <Stage index={1} padding="0 120px" section="MASTRA WORKSHOP" glow={palette.green}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Eyebrow>Mastra Workshop</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 176,
          fontWeight: 950,
          lineHeight: 0.95,
          letterSpacing: '-0.055em',
          margin: '34px 0 30px',
          maxWidth: 1640,
          color: palette.text,
        }}
      >
        Create a <span style={{ color: palette.accent }}>Software Factory</span> with Mastra.
      </h1>
      <p style={{ margin: 0, maxWidth: 1440, fontSize: 37, lineHeight: 1.34, color: palette.textSoft }}>
        A practical maturity model for automating SDLC loops with agents, workflows, gates, context, and human operators.
      </p>
      <div style={{ display: 'flex', gap: 64, marginTop: 58, marginBottom: 52 }}>
        <PersonCard avatar={shaneAvatar} name="Shane Thomas" role="CPO & Founder, Mastra" accent={palette.green} />
        <PersonCard avatar={alexAvatar} name="Alex Booker" role="Head of DX, Mastra" accent={palette.blue} />
      </div>
      <div style={{ display: 'flex', gap: 28, fontFamily: font.mono, fontSize: 20 }}>
        <span style={{ color: palette.accent }}>mastra.ai</span>
        <span style={{ color: palette.muted }}>·</span>
        <span style={{ color: palette.textSoft }}>github.com/mastra-ai/mastra</span>
        <span style={{ color: palette.muted }}>·</span>
        <span style={{ color: palette.textSoft }}>youtube.com/@mastra-ai</span>
      </div>
    </div>
  </Stage>
);

const Promise: Page = () => (
  <Stage index={2}>
    <Eyebrow>The promise</Eyebrow>
    <Title size={88}>A software factory is a spectrum, not a switch.</Title>
    <Subtitle maxWidth={1380}>
      You do not start by turning engineers off. You start by automating loops, adding gates, and increasing autonomy only where risk is low and evidence is strong.
    </Subtitle>
    <div style={{ marginTop: 62, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 26 }}>
      <Card label="Start here" title="Compress the build loop" accent={palette.blue}>
        Coding agents turn a ticket into a draft PR faster than a human can type it.
      </Card>
      <Card label="Earn trust" title="Raise the floor" accent={palette.amber}>
        Planning, review bots, tests, and context make generated work easier to approve.
      </Card>
      <Card label="End state" title="Operate the factory" accent={palette.green}>
        Humans watch the flow, approve exceptions, and halt the line when needed.
      </Card>
    </div>
  </Stage>
);

const PreAiFactory: Page = () => (
  <Stage index={3} padding="74px 96px 112px">
    <Eyebrow>The factory already exists</Eyebrow>
    <Title size={68}>Pre-AI software teams already run loops.</Title>
    <Subtitle size={25} maxWidth={1380}>
      Before agents, the factory floor is a human state machine with inner review loops and outer customer feedback loops.
    </Subtitle>
    <div
      style={{
        marginTop: 26,
        height: 660,
        borderRadius: 28,
        border: `1px solid ${palette.borderBright}`,
        background: palette.bg,
        padding: 18,
        boxShadow: '0 34px 90px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <a
        href={preAiSoftwareLoop}
        aria-label="Open full-size Pre-AI software team feedback loop diagram"
        title="Open full-size diagram"
        onClick={(event) => {
          if (event.currentTarget.getBoundingClientRect().width < 500) event.preventDefault();
        }}
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'zoom-in' }}
      >
        <img
          src={preAiSoftwareLoop}
          alt="Pre-AI software team feedback loop diagram"
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </a>
    </div>
  </Stage>
);

const Definition: Page = () => (
  <Stage index={4}>
    <Eyebrow>Definition</Eyebrow>
    <Title>Automating SDLC means automating controlled feedback systems.</Title>
    <Subtitle maxWidth={1260}>The useful definition is not just more code generation. It is work moving through visible loops with explicit controls.</Subtitle>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28, marginTop: 58 }}>
      <Card label="Loop" title="Work keeps flowing" accent={palette.green}>
        Feedback from review, tests, users, and monitoring creates the next action automatically.
      </Card>
      <Card label="Gate" title="Risk is checked" accent={palette.amber}>
        Plans, architecture, code, QA, and deploy can pause for humans when confidence is low.
      </Card>
      <Card label="Record" title="Evidence is captured" accent={palette.cyan}>
        Traces, logs, tests, scores, and approvals tell operators what happened and why.
      </Card>
    </div>
  </Stage>
);

const WhereTeamsStart: Page = () => (
  <Stage index={5}>
    <Eyebrow>Where teams start</Eyebrow>
    <Title>The first automation compresses build time.</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, marginTop: 62, alignItems: 'stretch' }}>
      <div style={{ borderRadius: 26, border: `1px solid ${palette.border}`, background: palette.surface, padding: 44 }}>
        <div style={{ fontFamily: font.mono, color: palette.muted, fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Before agents</div>
        <div style={{ marginTop: 30, fontSize: 118, fontWeight: 950, letterSpacing: '-0.05em', color: palette.text }}>2 hours</div>
        <div style={{ marginTop: 18, fontSize: 29, color: palette.textSoft, lineHeight: 1.34 }}>A developer manually builds, tests, and opens a small PR.</div>
      </div>
      <div style={{ borderRadius: 26, border: `1px solid ${palette.green}66`, background: `${palette.green}12`, padding: 44 }}>
        <div style={{ fontFamily: font.mono, color: palette.green, fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase' }}>With coding agents</div>
        <div style={{ marginTop: 30, fontSize: 118, fontWeight: 950, letterSpacing: '-0.05em', color: palette.green }}>2 min</div>
        <div style={{ marginTop: 18, fontSize: 29, color: palette.textSoft, lineHeight: 1.34 }}>The draft PR appears quickly. The bottleneck moves downstream.</div>
      </div>
    </div>
    <QuoteCard source="Factory bottleneck" accent={palette.amber} quote={<>Your backlog of work becomes a backlog of things to <span style={{ color: palette.amber }}>review</span>.</>} />
  </Stage>
);


const GoalBottleneck: Page = () => (
  <Stage index={6} glow={palette.amber}>
    <Eyebrow>Goal</Eyebrow>
    <Title size={72}>The goal is not more PRs. It is a better control room.</Title>
    <Subtitle size={29} maxWidth={1420}>Coding agents compress implementation time. The next job is keeping planning, review, and risk routing from becoming the new bottleneck.</Subtitle>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 86px 1fr 86px 1.18fr 86px 1fr', gap: 14, alignItems: 'center', marginTop: 42 }}>
      <FlowNode label="Incoming work" detail="Issues, alerts, asks" accent={palette.blue} />
      <Arrow label="more" />
      <FlowNode label="Coding agents" detail="Draft PRs fast" accent={palette.green} />
      <Arrow label="queue" />
      <div
        style={{
          borderRadius: 24,
          border: `2px solid ${palette.rose}77`,
          background: `linear-gradient(180deg, ${palette.rose}18 0%, ${palette.surface} 66%)`,
          padding: '28px 30px',
          boxShadow: `0 30px 90px ${palette.rose}20`,
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 15, color: palette.rose, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Bottleneck</div>
        <div style={{ marginTop: 16, fontSize: 32, lineHeight: 1.12, fontWeight: 900, color: palette.text }}>Human review queue</div>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ borderRadius: 999, background: `${palette.rose}1e`, border: `1px solid ${palette.rose}55`, padding: '10px 16px', fontFamily: font.mono, fontSize: 17, color: palette.textSoft }}>PR #1842 · unclear plan</div>
          <div style={{ borderRadius: 999, background: `${palette.rose}1e`, border: `1px solid ${palette.rose}55`, padding: '10px 16px', fontFamily: font.mono, fontSize: 17, color: palette.textSoft }}>PR #1843 · missing tests</div>
          <div style={{ borderRadius: 999, background: `${palette.rose}1e`, border: `1px solid ${palette.rose}55`, padding: '10px 16px', fontFamily: font.mono, fontSize: 17, color: palette.textSoft }}>PR #1844 · design drift</div>
        </div>
      </div>
      <Arrow label="solve" />
      <FlowNode label="Factory controls" detail="Route, gate, prove" accent={palette.amber} />
    </div>
    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22 }}>
      <Card label="Route" title="Separate lanes" accent={palette.blue}>Simple repeatable work can move faster than ambiguous or systemic work.</Card>
      <Card label="Gate" title="Pause early" accent={palette.amber}>Plans and architecture are cheaper to fix before code exists.</Card>
      <Card label="Prove" title="Arrive with evidence" accent={palette.green}>Tests, reviewers, traces, and context make human review smaller.</Card>
    </div>
  </Stage>
);

const ReviewBots: Page = () => (
  <Stage index={7}>
    <Eyebrow>The next layer</Eyebrow>
    <Title>Review bots and agentic testing raise the floor.</Title>
    <Subtitle>They do not replace human judgment early. They remove obvious defects before the human spends attention.</Subtitle>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 62 }}>
      <FlowNode label="Draft PR" detail="Agent produced code" accent={palette.blue} style={{ flex: 1 }} />
      <Arrow />
      <FlowNode label="PR reviewer" detail="Style, risks, diffs" accent={palette.purple} style={{ flex: 1 }} />
      <Arrow />
      <FlowNode label="Agentic tests" detail="Browser, black-box, edge cases" accent={palette.amber} style={{ flex: 1 }} />
      <Arrow />
      <FlowNode label="Human review" detail="Design, ownership, judgment" accent={palette.green} style={{ flex: 1 }} />
    </div>
    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
      <Card label="Good automation" title="Catches low-hanging issues" accent={palette.blue}>
        Lint, tests, browser checks, obvious security problems, missing docs, and risky diffs.
      </Card>
      <Card label="Still human" title="Owns product and architecture" accent={palette.green}>
        Is this the right design? Will we maintain it? Does it fit the system?
      </Card>
    </div>
  </Stage>
);

const ExternalTriggers: Page = () => (
  <Stage index={8}>
    <Eyebrow>More autonomous entry points</Eyebrow>
    <Title>Then the world starts waking agents up.</Title>
    <Subtitle>External triggers let agents pick up work before a human has manually converted every signal into a ticket.</Subtitle>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 40 }}>
      <Card label="Issue tracker" title="Assigned issue" accent={palette.blue}>
        New bug, chore, or small feature is routed into the factory lane.
      </Card>
      <Card label="Slack / Teams" title="Tagged agent" accent={palette.purple}>
        A teammate asks an agent to investigate, patch, or draft a plan.
      </Card>
      <Card label="Monitoring" title="Sentry alert" accent={palette.rose}>
        A production failure becomes a diagnostic run and possible PR.
      </Card>
    </div>
    <div style={{ marginTop: 34, display: 'grid', gridTemplateColumns: '1fr 0.9fr', gap: 30, alignItems: 'stretch' }}>
      <QuoteCard compact source="Example pattern" accent={palette.green} quote={<>Devin-style workers are the visible version: a ticket enters, an autonomous engineer runs, a PR exits.</>} />
      <Card label="Key shift" title="Humans initiate less" accent={palette.amber}>
        Operators still see the run, but they are not always the person who starts it.
      </Card>
    </div>
  </Stage>
);

const LightsOffDream: Page = () => (
  <Stage index={9}>
    <Eyebrow>The lights-off dream</Eyebrow>
    <Title>The dream is a closed loop from signal to deploy.</Title>
    <Subtitle>Feedback, monitoring, and support enter the system; fixes flow to production without anyone touching the line.</Subtitle>
    <DiagramPanel caption="The aspirational closed loop">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <FlowNode label="User feedback" accent={palette.blue} style={{ flex: 1 }} />
        <Arrow />
        <FlowNode label="Triage agent" accent={palette.purple} style={{ flex: 1 }} />
        <Arrow />
        <FlowNode label="Fix agent" accent={palette.green} style={{ flex: 1 }} />
        <Arrow />
        <FlowNode label="Tests + deploy" accent={palette.amber} style={{ flex: 1 }} />
      </div>
      <div style={{ marginTop: 34, borderRadius: 18, border: `1px solid ${palette.red}55`, background: `${palette.red}10`, padding: '26px 30px', fontSize: 30, lineHeight: 1.32, color: palette.textSoft }}>
        But if you remove planning and review too early, the factory can keep shipping while the codebase quietly rots.
      </div>
    </DiagramPanel>
  </Stage>
);

const SlopCreepsIn: Page = () => (
  <Stage index={10}>
    <Eyebrow>Why slop creeps in</Eyebrow>
    <Title>Models are rewarded for passing the task, not preserving the factory.</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: 34, marginTop: 58 }}>
      <QuoteCard source="Benchmark trap" accent={palette.rose} quote={<>The verifier asks: did the tests pass? It rarely asks: will a teammate hate this in six months?</>} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card label="Short horizon" title="One-off patches" accent={palette.blue}>
          SWE-style tasks reward small isolated fixes with a golden test.
        </Card>
        <Card label="Long horizon" title="Codebase health" accent={palette.amber}>
          Real teams pay later when coupling, design drift, and context loss compound.
        </Card>
      </div>
    </div>
  </Stage>
);

const LeveragePoint: Page = () => (
  <Stage index={11}>
    <Eyebrow>The leverage point</Eyebrow>
    <Title>Make the PR 95–99% correct before review.</Title>
    <Subtitle maxWidth={1480}>If review is the bottleneck, do not just add reviewers. Increase the chance that generated work arrives with the right plan and architecture.</Subtitle>
    <div style={{ marginTop: 52, display: 'flex', alignItems: 'center', gap: 14 }}>
      <FlowNode label="Goal" detail="What outcome matters?" accent={palette.blue} style={{ flex: 1 }} />
      <Arrow />
      <FlowNode label="Plan" detail="How should we build?" accent={palette.amber} style={{ flex: 1 }} />
      <Arrow />
      <FlowNode label="Architecture" detail="What boundaries hold?" accent={palette.purple} style={{ flex: 1 }} />
      <Arrow />
      <FlowNode label="PR" detail="Small review, not rescue" accent={palette.green} style={{ flex: 1 }} />
    </div>
    <div style={{ marginTop: 50 }}>
      <QuoteCard source="Review bottleneck" accent={palette.green} quote={<>You are not drowning in PRs. You are drowning in <span style={{ color: palette.green }}>bad PRs</span>.</>} />
    </div>
  </Stage>
);

const MaturityLadder: Page = () => (
  <Stage index={12}>
    <Eyebrow>Maturity ladder</Eyebrow>
    <Title>Autonomy increases lane by lane.</Title>
    <Subtitle>The factory gets more autonomous as context, evidence, and controls mature. You do not grant every request the same freedom.</Subtitle>
    <MaturityRail />
  </Stage>
);

const HumanGates: Page = () => (
  <Stage index={13}>
    <Eyebrow>Early-stage gates</Eyebrow>
    <Title>Install human gates before you remove humans.</Title>
    <Subtitle>At first, pause often. The goal is to learn where the factory is reliable enough to keep moving.</Subtitle>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 70 }}>
      <Gate label="Plan approval" accent={palette.blue} />
      <Arrow />
      <Gate label="Architecture review" accent={palette.purple} />
      <Arrow />
      <Gate label="Code review" accent={palette.green} />
      <Arrow />
      <Gate label="QA check" accent={palette.amber} />
      <Arrow />
      <Gate label="Deploy approval" accent={palette.rose} />
    </div>
    <div style={{ marginTop: 58, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
      <Card label="Why" title="Gates collect trust data" accent={palette.green}>
        Every approval teaches which classes of work are safe to automate next.
      </Card>
      <Card label="How" title="Move gates by risk" accent={palette.amber}>
        Keep gates for ambiguous or risky work. Relax them for simple repeatable lanes.
      </Card>
    </div>
  </Stage>
);

const RiskRouter: Page = () => (
  <Stage index={14}>
    <Eyebrow>Risk router</Eyebrow>
    <Title>Simple, low-risk work can flow automatically.</Title>
    <Subtitle>Every factory needs a router that separates safe automation lanes from ambiguous work that must stop for humans.</Subtitle>
    <div style={{ marginTop: 44 }}>
      <RiskMatrix />
    </div>
  </Stage>
);

const ContextFuel: Page = () => (
  <Stage index={15}>
    <Eyebrow>Context is fuel</Eyebrow>
    <Title>Better decisions require self-discovered context.</Title>
    <Subtitle>Agents should not rely only on a ticket description. They need tools to gather the same context a strong engineer would gather.</Subtitle>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 52 }}>
      <Card label="Codebase" title="Read and search" accent={palette.green}>Files, symbols, owners, prior implementations, tests, and package scripts.</Card>
      <Card label="Delivery" title="Inspect CI" accent={palette.blue}>Build logs, failing jobs, test history, deployment status, and artifacts.</Card>
      <Card label="Production" title="Query telemetry" accent={palette.rose}>Sentry, logs, traces, metrics, release health, and user impact.</Card>
      <Card label="Product" title="Read context" accent={palette.purple}>Issues, PRs, docs, roadmap, Slack threads, and customer reports.</Card>
      <Card label="Team" title="Respect norms" accent={palette.amber}>Architecture decisions, conventions, review comments, and risk policies.</Card>
      <Card label="Memory" title="Keep state" accent={palette.cyan}>Past decisions, approvals, incidents, and what this run already learned.</Card>
    </div>
  </Stage>
);

const AgentsInPlanning: Page = () => (
  <Stage index={16}>
    <Eyebrow>Advanced pattern</Eyebrow>
    <Title>Put agents before the code, not just after it.</Title>
    <Subtitle>Planning is where you can steer cheaply. Once the implementation exists, every correction is more expensive.</Subtitle>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20, marginTop: 58 }}>
      <Card label="Planner" title="Breaks down work" accent={palette.blue}>Clarifies goal, constraints, dependencies, and likely files.</Card>
      <Card label="Architect" title="Protects design" accent={palette.purple}>Checks boundaries, data flow, ownership, and future maintainability.</Card>
      <Card label="Test strategist" title="Plans proof" accent={palette.amber}>Defines unit, integration, browser, and regression checks before coding.</Card>
      <Card label="Human" title="Aligns intent" accent={palette.green}>Approves the plan or redirects before compute turns into code.</Card>
    </div>
  </Stage>
);

const PrReconciliation: Page = () => (
  <Stage index={17}>
    <Eyebrow>Advanced pattern</Eyebrow>
    <Title>Reviewer agents need reconciliation.</Title>
    <Subtitle>Multiple reviewers produce noise unless another step deduplicates, prioritizes, and explains what matters.</Subtitle>
    <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', marginTop: 62 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <FlowNode label="Security reviewer" detail="Secrets, auth, injection, permissions" accent={palette.rose} />
        <FlowNode label="Maintainability reviewer" detail="Coupling, boundaries, readability" accent={palette.purple} />
        <FlowNode label="Test reviewer" detail="Coverage, flaky paths, missing cases" accent={palette.amber} />
      </div>
      <Arrow label="findings" />
      <FlowNode label="Reconciler" detail="Deduplicate, rank, assign owners" accent={palette.green} style={{ flex: 0.9 }} />
      <Arrow label="short list" />
      <FlowNode label="Human reviewer" detail="Decides the final tradeoff" accent={palette.blue} style={{ flex: 0.9 }} />
    </div>
  </Stage>
);

const MultiHarness: Page = () => (
  <Stage index={18}>
    <Eyebrow>Advanced pattern</Eyebrow>
    <Title>Compete implementations when the answer is uncertain.</Title>
    <Subtitle>Use multiple harnesses, models, or teams when one path may overfit the first idea.</Subtitle>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 26, marginTop: 58 }}>
      <Card label="Lane A" title="Claude plans" accent={palette.blue}>Strong planning agent creates the spec, risks, file map, and proof plan.</Card>
      <Card label="Lane B" title="Codex implements" accent={palette.green}>Different implementation harness turns the plan into code and tests.</Card>
      <Card label="Lane C" title="Evaluator selects" accent={palette.amber}>A third reviewer compares correctness, maintainability, risk, and test evidence.</Card>
    </div>
    <div style={{ marginTop: 46 }}>
      <QuoteCard source="Multi-harness version" accent={palette.purple} quote={<>Or let both implement, then have a separate evaluator pick the winner and explain why.</>} />
    </div>
  </Stage>
);

const AgentsCheckingAgents: Page = () => (
  <Stage index={19}>
    <Eyebrow>Advanced pattern</Eyebrow>
    <Title>Teams of agents can check each other.</Title>
    <Subtitle>The goal is not a chorus of agreement. It is structured disagreement that surfaces risk before production.</Subtitle>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 58 }}>
      <Card label="Council" title="Parallel specialists" accent={palette.blue}>
        Security, tests, product, operations, and maintainability review the same plan independently.
      </Card>
      <Card label="Deliberation" title="Agents challenge findings" accent={palette.purple}>
        A second pass reconciles disagreements and revises recommendations.
      </Card>
      <Card label="Competition" title="Best solution wins" accent={palette.amber}>
        Multiple candidates are scored against the same spec, tests, and architecture goals.
      </Card>
      <Card label="Synthesis" title="One decision record" accent={palette.green}>
        The factory stores the final rationale, not a pile of raw agent opinions.
      </Card>
    </div>
  </Stage>
);


const ComplexFactory: Page = () => (
  <Stage index={20} padding="78px 96px 108px" glow={palette.cyan}>
    <Eyebrow>Complex factory</Eyebrow>
    <Title size={62}>The full factory is a network of loops, not one agent.</Title>
    <Subtitle size={25} maxWidth={1400}>Advanced teams combine intake, routing, planning, implementation, review, observability, and human gates into one operating system.</Subtitle>
    <div
      style={{
        marginTop: 26,
        height: 638,
        borderRadius: 28,
        border: `1px solid ${palette.borderBright}`,
        background: palette.bg,
        padding: 18,
        boxShadow: '0 34px 90px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <a
        href={softwareFactoryDiagram}
        aria-label="Open full-size complex software factory diagram"
        title="Open full-size diagram"
        onClick={(event) => {
          if (event.currentTarget.getBoundingClientRect().width < 500) event.preventDefault();
        }}
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'zoom-in' }}
      >
        <img
          src={softwareFactoryDiagram}
          alt="Complex software factory diagram"
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </a>
    </div>
  </Stage>
);

const MastraMap: Page = () => (
  <Stage index={21}>
    <Eyebrow>How this maps to Mastra</Eyebrow>
    <Title>Mastra gives each factory part a job.</Title>
    <PrimitiveMap />
  </Stage>
);

const MastraBlueprints: Page = () => (
  <Stage index={22} padding="0 140px" glow={palette.blue}>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 154,
          fontWeight: 950,
          lineHeight: 0.95,
          letterSpacing: '-0.055em',
          margin: 0,
          color: palette.text,
          textAlign: 'center',
        }}
      >
        Mastra <span style={{ color: palette.accent }}>Blueprints</span>
      </h1>
    </div>
  </Stage>
);

const NextSteps: Page = () => (
  <Stage index={23}>
    <Eyebrow>Next steps</Eyebrow>
    <Title>Already using coding agents? Make the lane trustworthy.</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22, marginTop: 54 }}>
      <Card label="1" title="Map one lane" accent={palette.blue}>
        Pick a real coding-agent workflow and draw trigger → agent → PR → review → merge.
      </Card>
      <Card label="2" title="Add plan gates" accent={palette.amber}>
        Stop ambiguous work before implementation and require intent, files, risks, and proof.
      </Card>
      <Card label="3" title="Define pre-PR proof" accent={palette.green}>
        Require tests, browser checks, review bots, and a short evidence summary before humans review.
      </Card>
      <Card label="4" title="Wire context" accent={palette.purple}>
        Give agents access to repo search, CI logs, issues, docs, telemetry, and team conventions.
      </Card>
      <Card label="5" title="Route by risk" accent={palette.rose}>
        Let simple repeatable changes move faster; keep systemic changes in a human-first lane.
      </Card>
      <Card label="6" title="Measure trust" accent={palette.cyan}>
        Track rework, review time, escaped defects, and which gates actually catch risk.
      </Card>
    </div>
  </Stage>
);

const LinkTile = ({ label, href, accent }: { label: string; href: string; accent: string }) => (
  <div
    style={{
      borderRadius: 18,
      border: `1px solid ${accent}55`,
      background: `linear-gradient(120deg, ${accent}12 0%, ${palette.surface} 72%)`,
      padding: '24px 28px',
      minHeight: 116,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 16, letterSpacing: '0.16em', textTransform: 'uppercase', color: accent }}>{label}</div>
    <div style={{ marginTop: 12, fontSize: 28, fontWeight: 850, color: palette.text }}>{href}</div>
  </div>
);

const Closing: Page = () => (
  <Stage index={24} padding="0 120px" section="MASTRA WORKSHOP" glow={palette.green}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Eyebrow>Closing</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 150,
          fontWeight: 950,
          lineHeight: 0.95,
          letterSpacing: '-0.055em',
          margin: '34px 0 30px',
          maxWidth: 1500,
          color: palette.text,
        }}
      >
        Build the factory. <span style={{ color: palette.accent }}>Keep humans in control.</span>
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 34 }}>
        <LinkTile label="Mastra" href="@mastra" accent={palette.green} />
        <LinkTile label="Shane" href="@smthomas3" accent={palette.blue} />
        <LinkTile label="Alex" href="@bookercodes" accent={palette.purple} />
        <LinkTile label="YouTube" href="youtube.com/@mastra-ai" accent={palette.rose} />
        <LinkTile label="Careers" href="mastra.ai/careers" accent={palette.amber} />
        <LinkTile label="Contact" href="mastra.ai/contact" accent={palette.cyan} />
      </div>
    </div>
  </Stage>
);

export const meta: SlideMeta = {
  title: 'Create a Software Factory with Mastra',
  createdAt: '2026-06-30T17:13:39.728Z',
};

export const notes: (string | undefined)[] = [
  `Open by naming the ambition plainly: people are asking how to build a software factory or automate SDLC. This workshop is not about pretending humans disappear. It is about moving humans from repetitive factory-line work into operator roles where they set goals, approve risky decisions, and stop the line when something looks wrong. Introduce Shane first as CPO and Founder, then Alex as Head of DX, matching the workshop cover pattern.`,
  `Set the frame for the whole session. A software factory is not binary. Most teams start by making code generation faster, then discover review and quality become the bottleneck. The maturity path is to add gates, context, telemetry, and risk routing before increasing autonomy. Transition into the pre-AI factory so the audience sees this is an extension of their existing process, not a brand-new religion.`,
  `Walk the loop slowly using the supplied diagram: customer feedback, trends, team insights, issues, Slack, and monitoring all become work. Then trace the human SDLC lane from triage to planning to code to review to merge. Emphasize the inner review loop and the outer feedback loop back into monitoring and customers.`,
  `Define terms defensively. Software factory and automating SDLC both mean controlled loops, gates, and feedback systems. Code generation alone is not a factory. A factory has visible flow, checkpoints, and records. The talk is about deciding which parts of that loop are safe to automate and which parts still require human judgment.`,
  `Use the bottleneck shift from the interview. A small change that took two hours may take two minutes with an agent. That feels magical until the team has a queue of PRs to inspect. The constraint moves from typing code to trusting code. This is where many teams first feel the pain of agent adoption.`,
  `Make the goal slide explicit: the point is not to create more PRs faster. Once coding agents speed up implementation, the factory needs a control room that routes work, pauses risk early, and asks for evidence before a human reviewer spends attention.`,
  `Position review bots and agentic testing as floor raisers, not magic replacements. They catch obvious issues before a human opens the PR. That makes human review more about design, ownership, product fit, and maintainability. The goal is not too many automated comments; the goal is fewer bad PRs reaching humans.`,
  `Explain the next autonomy step: agents respond to issue assignment, Slack tags, and production alerts. Devin is a familiar example of this shape. The important shift is that humans are no longer always initiating work. They can watch runs begin from external events, but the factory still needs controls because autonomous entry points can multiply work quickly.`,
  `Describe the dream with enthusiasm first: feedback enters, agents triage, fix, test, and deploy. Then add the caution from Dex: teams have tried skipping review and planning, and after months the codebase degrades. A closed loop that ships bad design faster is still a bad factory.`,
  `Give the mechanism for slop. Many coding benchmarks reward passing tests on isolated tasks. They do not strongly penalize code that makes the fifth, sixth, or twentieth future change harder. In a real codebase, maintainability is a long-horizon property. This is why lights-off automation can look fine for weeks before the pain appears.`,
  `Use the central quote: if review is the bottleneck, increase the odds the PR is 95 to 99 percent right before review. That means planning and architecture are leverage points. Steer early when the cost of changing direction is low. Remind the audience they are usually not drowning in PRs; they are drowning in bad PRs.`,
  `Make the maturity ladder practical. Manual SDLC is the baseline. Coding assistants compress build loops. Guarded automation adds bots and gates. Autonomous lanes emerge for simple repeatable work. The operator model is where humans manage flow instead of touching every item. Stress that teams can sit at different maturity levels for different work types.`,
  `Argue for many gates early. Plan approval, architecture review, code review, QA, and deploy approval are not bureaucracy if they collect trust data. The trick is to remove or relax gates only for classes of work that have proven low risk. Gates move by evidence, not by wishful thinking.`,
  `Explain the risk router as a core factory primitive. Simple low-risk changes can go straight through an automated lane. Ambiguous or systemic changes stop for humans. This is how autonomy grows safely: not by trusting every agent more, but by routing each request into a lane with the right controls.`,
  `Make context the bridge from brittle agents to useful operators. Strong engineers inspect code, tests, logs, CI, issues, docs, and production impact before deciding. Agents need tools to do the same. This is the outer harness idea from the transcript: sensors and hands around the model so it can discover what matters.`,
  `Move into advanced patterns. Planning agents should decompose work, architecture agents should protect boundaries, test strategists should define proof, and humans should align the direction before code is written. The main idea is that planning is where steering is cheapest.`,
  `Describe why multiple PR reviewers can create noise. A security reviewer, maintainability reviewer, and test reviewer may all be useful, but someone or something needs to reconcile them. The reconciler deduplicates, prioritizes, and gives the human a short list of decisions instead of a wall of comments.`,
  `Explain multi-harness implementations as a way to avoid overcommitting to one model or one first idea. Claude might produce the plan, Codex might implement, or both might implement independently while a third evaluator chooses. This is expensive, so reserve it for important or ambiguous work.`,
  `Tie this to council and supervisor patterns. Agents can collaborate, deliberate, or compete. Security, product, tests, operations, and maintainability specialists can check the same proposal independently, then a synthesizer turns disagreement into a decision record. The value is structured dissent before production.`,
  `Use the complex factory diagram to zoom out. The advanced pattern is not one agent doing everything; it is a network of intake sources, routers, planning loops, implementation lanes, review systems, monitoring, and human gates. Point out that the same control ideas repeat at every scale.`,
  `Map the story into Mastra primitives. Agents are the workers. Workflows are the assembly lines. AgentControllers are the floor supervisor: they assign the right worker, watch status, and pause or halt the line. Agent Signals are the factory communication lines between agents, controllers, humans, and outside systems; webhooks can wake the factory up. Tools and MCP give agents hands and sensors. Observability captures state, traces, metrics, decisions, scores, and regression evidence. Keep this conceptual unless showing current docs.`,
  `Use this as a placeholder transition into the live demo and supporting diagrams. Say that the concrete Mastra implementation lives in the blueprints and examples rather than overloading the workshop deck with API details.`,
  `Close the instructional arc with tangible next steps for teams already using coding agents. They should map one lane, add plan gates, define pre-PR proof, wire context, route by risk, and measure trust. The point is practical operating discipline, not a calendar-based transformation plan.`,
  `End with the links and the core message: build the factory, but keep humans in control. Invite people to follow Mastra, Shane, and Alex, watch the Mastra YouTube channel, check careers, or reach out through the contact page.`,
];

export default [
  Cover,
  Promise,
  PreAiFactory,
  Definition,
  WhereTeamsStart,
  GoalBottleneck,
  ReviewBots,
  ExternalTriggers,
  LightsOffDream,
  SlopCreepsIn,
  LeveragePoint,
  MaturityLadder,
  HumanGates,
  RiskRouter,
  ContextFuel,
  AgentsInPlanning,
  PrReconciliation,
  MultiHarness,
  AgentsCheckingAgents,
  ComplexFactory,
  MastraMap,
  MastraBlueprints,
  NextSteps,
  Closing,
] satisfies Page[];
