import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

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
    hero: 176,
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
  border: '#171717',
  borderBright: '#343434',
  textSoft: '#a9a9a9',
  muted: '#757575',
  dim: '#5c5c5c',
  amber: '#e3b758',
  blue: '#6aa8ff',
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

const TOTAL = 5;

const Eyebrow = ({ children, color = 'var(--osd-accent)' }: { children: React.ReactNode; color?: string }) => (
  <div
    style={{
      fontFamily: font.mono,
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color,
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
    <span>MASTRA · AGENT PROTOCOLS</span>
    <span>
      {String(index).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
    </span>
  </div>
);

const Bullet = ({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) => (
  <li
    style={{
      fontSize: 36,
      lineHeight: 1.42,
      color: accent ? 'var(--osd-text)' : palette.textSoft,
      marginBottom: 18,
      paddingLeft: 36,
      position: 'relative',
      listStyle: 'none',
    }}
  >
    <span
      style={{
        position: 'absolute',
        left: 0,
        top: 18,
        width: 14,
        height: 14,
        borderRadius: 4,
        background: accent ? 'var(--osd-accent)' : palette.borderBright,
      }}
    />
    {children}
  </li>
);

const Glow = () => (
  <div
    aria-hidden
    style={{
      position: 'absolute',
      inset: 0,
      background:
        `radial-gradient(1000px 640px at 18% 18%, ${palette.accent}1a 0%, transparent 62%),` +
        `radial-gradient(900px 520px at 84% 80%, ${palette.surfaceHi} 0%, transparent 66%)`,
    }}
  />
);

const Card = ({ label, title, color }: { label: string; title: string; color: string }) => (
  <div
    style={{
      flex: 1,
      minHeight: 220,
      padding: 36,
      borderRadius: 'var(--osd-radius)',
      border: `1px solid ${palette.borderBright}`,
      background: `linear-gradient(180deg, ${palette.surfaceHi} 0%, ${palette.surface} 100%)`,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 28px 70px rgba(0,0,0,0.34)`,
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 26, color, letterSpacing: '0.18em', fontWeight: 800 }}>{label}</div>
    <div style={{ marginTop: 28, fontSize: 42, lineHeight: 1.12, fontWeight: 800, color: 'var(--osd-text)' }}>
      {title}
    </div>
  </div>
);

const CompareCard = ({
  label,
  title,
  description,
  items,
  color,
}: {
  label: string;
  title: string;
  description: string;
  items: string[];
  color: string;
}) => (
  <div
    style={{
      flex: 1,
      minHeight: 430,
      padding: 34,
      borderRadius: 24,
      border: `1px solid ${color}55`,
      background: `linear-gradient(180deg, ${color}14 0%, ${palette.surface} 72%)`,
      boxShadow: `0 30px 80px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.05)`,
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 24, color, letterSpacing: '0.18em', fontWeight: 850 }}>{label}</div>
    <div style={{ marginTop: 20, fontSize: 38, lineHeight: 1.08, fontWeight: 850, color: 'var(--osd-text)' }}>{title}</div>
    <p style={{ margin: '24px 0 0', fontSize: 25, lineHeight: 1.32, color: palette.textSoft }}>{description}</p>
    <div style={{ height: 1, background: palette.borderBright, margin: '28px 0 24px' }} />
    <ul style={{ margin: 0, padding: 0 }}>
      {items.map((item) => (
        <li
          key={item}
          style={{
            listStyle: 'none',
            display: 'flex',
            gap: 13,
            alignItems: 'flex-start',
            marginBottom: 16,
            fontSize: 23,
            lineHeight: 1.24,
            color: palette.textSoft,
          }}
        >
          <span style={{ marginTop: 8, width: 8, height: 8, borderRadius: 3, background: color, flex: '0 0 auto' }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const DiagramShell = ({ children, caption }: { children: React.ReactNode; caption?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div
      style={{
        width: '100%',
        padding: 28,
        borderRadius: 24,
        border: `1px solid ${palette.borderBright}`,
        background:
          `linear-gradient(180deg, ${palette.surfaceHi} 0%, ${palette.surface} 100%), ` +
          `radial-gradient(620px 360px at 50% 20%, ${palette.accent}14, transparent 68%)`,
        boxShadow: `0 34px 90px rgba(0,0,0,0.42), 0 0 0 1px ${palette.accent}12`,
      }}
    >
      <div
        style={{
          position: 'relative',
          height: 486,
          borderRadius: 18,
          border: `1px solid ${palette.border}`,
          background:
            `linear-gradient(${palette.border} 1px, transparent 1px), ` +
            `linear-gradient(90deg, ${palette.border} 1px, transparent 1px), ` +
            `linear-gradient(180deg, #070707 0%, #030303 100%)`,
          backgroundSize: '42px 42px, 42px 42px, auto',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
      {caption ? (
        <div style={{ marginTop: 24, fontFamily: font.mono, fontSize: 18, color: palette.dim, letterSpacing: '0.04em' }}>
          {caption}
        </div>
      ) : null}
    </div>
  </div>
);

const DiagramNode = ({
  x,
  y,
  w,
  h,
  label,
  detail,
  color = palette.accent,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  detail?: string;
  color?: string;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      padding: '22px 24px',
      borderRadius: 18,
      border: `1px solid ${color}66`,
      background: `linear-gradient(180deg, ${color}16 0%, rgba(12,12,12,0.96) 100%)`,
      boxShadow: `0 0 42px ${color}18, inset 0 1px 0 rgba(255,255,255,0.05)`,
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 20, fontWeight: 850, letterSpacing: '0.12em', color }}>{label}</div>
    {detail ? <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.15, color: palette.textSoft }}>{detail}</div> : null}
  </div>
);

const DiagramLabel = ({ x, y, children, color = palette.accent }: { x: number; y: number; children: React.ReactNode; color?: string }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      padding: '10px 14px',
      borderRadius: 999,
      border: `1px solid ${color}55`,
      background: '#050505e6',
      color,
      fontFamily: font.mono,
      fontSize: 18,
      fontWeight: 850,
      letterSpacing: '0.12em',
    }}
  >
    {children}
  </div>
);

const ArrowDefs = () => (
  <defs>
    <marker id="arrowGreen" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
      <path d="M2,2 L10,6 L2,10 Z" fill={palette.accent} />
    </marker>
    <marker id="arrowBlue" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
      <path d="M2,2 L10,6 L2,10 Z" fill={palette.blue} />
    </marker>
  </defs>
);

const AcpDiagram = () => (
  <DiagramShell caption="agentcommunicationprotocol.dev/introduction/welcome">
    <svg width="100%" height="100%" viewBox="0 0 720 486" style={{ position: 'absolute', inset: 0 }}>
      <ArrowDefs />
      <path d="M210 238 H332" stroke={palette.accent} strokeWidth="4" markerEnd="url(#arrowGreen)" opacity="0.9" />
      <path d="M420 212 C492 172 522 142 560 114" stroke={palette.accent} strokeWidth="4" markerEnd="url(#arrowGreen)" fill="none" opacity="0.9" />
      <path d="M420 244 H552" stroke={palette.accent} strokeWidth="4" markerEnd="url(#arrowGreen)" opacity="0.9" />
      <path d="M420 276 C492 316 522 344 560 372" stroke={palette.accent} strokeWidth="4" markerEnd="url(#arrowGreen)" fill="none" opacity="0.9" />
      <path d="M54 80 H210 V396 H54 Z" stroke={palette.borderBright} strokeWidth="2" fill="none" strokeDasharray="10 10" opacity="0.7" />
      <path d="M520 58 H680 V430 H520 Z" stroke={palette.borderBright} strokeWidth="2" fill="none" strokeDasharray="10 10" opacity="0.7" />
    </svg>
    <DiagramLabel x={78} y={54} color={palette.textSoft}>HOST / CLIENT</DiagramLabel>
    <DiagramNode x={68} y={178} w={158} h={112} label="MASTRA" detail="agent host" />
    <DiagramNode x={314} y={178} w={132} h={112} label="ACP" detail="common wire" />
    <DiagramLabel x={548} y={32} color={palette.textSoft}>LOCAL RUNTIMES</DiagramLabel>
    <DiagramNode x={540} y={78} w={150} h={88} label="CLAUDE" detail="CLI" color={palette.blue} />
    <DiagramNode x={540} y={200} w={150} h={88} label="GEMINI" detail="CLI" color={palette.blue} />
    <DiagramNode x={540} y={322} w={150} h={88} label="CUSTOM" detail="agent" color={palette.blue} />
  </DiagramShell>
);

const A2aDiagram = () => (
  <DiagramShell>
    <svg width="100%" height="100%" viewBox="0 0 720 486" style={{ position: 'absolute', inset: 0 }}>
      <ArrowDefs />
      <path d="M224 172 H498" stroke={palette.blue} strokeWidth="4" markerEnd="url(#arrowBlue)" opacity="0.95" />
      <path d="M498 244 H224" stroke={palette.accent} strokeWidth="4" markerEnd="url(#arrowGreen)" opacity="0.95" />
      <path d="M224 316 H498" stroke={palette.blue} strokeWidth="4" markerEnd="url(#arrowBlue)" opacity="0.95" />
      <path d="M100 76 H620 V408 H100 Z" stroke={palette.borderBright} strokeWidth="2" fill="none" strokeDasharray="10 10" opacity="0.7" />
    </svg>
    <DiagramLabel x={284} y={50} color={palette.textSoft}>A2A SESSION</DiagramLabel>
    <DiagramNode x={54} y={164} w={174} h={156} label="MASTRA" detail="discovers + executes" color={palette.accent} />
    <DiagramLabel x={292} y={140} color={palette.blue}>1 · DISCOVER</DiagramLabel>
    <DiagramLabel x={234} y={214}>2 · CAPABILITIES BACK</DiagramLabel>
    <DiagramLabel x={258} y={286} color={palette.blue}>3 · EXECUTE TASK</DiagramLabel>
    <DiagramNode x={498} y={164} w={174} h={156} label="REMOTE AGENT" detail="capabilities + task runner" color={palette.blue} />
  </DiagramShell>
);

const ProtocolPage = ({
  index,
  eyebrow,
  title,
  children,
  side,
}: {
  index: number;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  side?: React.ReactNode;
}) => (
  <div style={{ ...fill, padding: '112px 120px 120px' }}>
    <Glow />
    <div style={{ position: 'relative', height: '100%', display: 'grid', gridTemplateColumns: side ? '0.96fr 0.92fr' : '1fr', gap: 72 }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 112,
            fontWeight: 900,
            lineHeight: 0.96,
            margin: '28px 0 44px',
            letterSpacing: '-0.055em',
            maxWidth: 980,
          }}
        >
          {title}
        </h1>
        {children}
      </div>
      {side}
    </div>
    <Footer index={index} />
  </div>
);

const Cover: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Glow />
    <div style={{ position: 'relative' }}>
      <Eyebrow>Mastra Workshop</Eyebrow>
      <h1
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 900,
          lineHeight: 0.92,
          margin: '38px 0 32px',
          letterSpacing: '-0.055em',
        }}
      >
        Agent
        <br />
        <span style={{ color: 'var(--osd-accent)' }}>Protocols</span>
      </h1>
      <p style={{ fontSize: 40, color: palette.textSoft, maxWidth: 1200, lineHeight: 1.34, margin: 0 }}>
        Three ways agents connect: to clients, to each other, and to tools.
      </p>
      <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.mono }}>
        <span style={{ fontSize: 24, color: 'var(--osd-text)', fontWeight: 850, letterSpacing: '0.08em' }}>Ward Peeters</span>
        <span style={{ width: 34, height: 1, background: palette.borderBright }} />
        <span style={{ fontSize: 22, color: palette.muted, letterSpacing: '0.12em' }}>Founding Farmer</span>
      </div>
      <div style={{ display: 'flex', gap: 28, marginTop: 56 }}>
        <Card label="ACP" title="Agent Communication Protocol" color={palette.accent} />
        <Card label="A2A" title="Agent To Agent" color={palette.blue} />
        <Card label="MCP" title="Model Context Protocol" color={palette.amber} />
      </div>
    </div>
    <Footer index={1} />
  </div>
);

const Acp: Page = () => (
  <ProtocolPage
    index={2}
    eyebrow="ACP"
    title="Agent Communication Protocol"
    side={<AcpDiagram />}
  >
    <p style={{ fontSize: 39, lineHeight: 1.42, color: palette.textSoft, margin: 0, maxWidth: 900 }}>
      A protocol for multi-agent communication between clients and agents, making agents portable across hosts.
    </p>
    <ul style={{ padding: 0, margin: '44px 0 0' }}>
      <Bullet accent>Mastra can connect to ACP-compatible agents.</Bullet>
      <Bullet>Think Claude CLI, Gemini CLI, and other local agent runtimes.</Bullet>
    </ul>
  </ProtocolPage>
);

const A2a: Page = () => (
  <ProtocolPage index={3} eyebrow="A2A" title="Agent To Agent" side={<A2aDiagram />}>
    <p style={{ fontSize: 39, lineHeight: 1.42, color: palette.textSoft, margin: 0, maxWidth: 900 }}>
      An open, vendor-neutral protocol for agent discovery, communication, and collaboration across systems.
    </p>
    <ul style={{ padding: 0, margin: '44px 0 0' }}>
      <Bullet accent>Agents discover capabilities across boundaries.</Bullet>
      <Bullet>They communicate and collaborate without sharing a vendor.</Bullet>
      <Bullet>Mastra agents can connect with external agents.</Bullet>
    </ul>
  </ProtocolPage>
);

const Mcp: Page = () => (
  <ProtocolPage index={4} eyebrow="MCP" title="Model Context Protocol">
    <p style={{ fontSize: 43, lineHeight: 1.42, color: palette.textSoft, margin: 0, maxWidth: 1260 }}>
      A standard way for LLM applications to connect with tools, data sources, prompts, and external context.
    </p>
    <ul style={{ padding: 0, margin: '58px 0 0', maxWidth: 1180 }}>
      <Bullet accent>Standardizes how models reach external capabilities.</Bullet>
      <Bullet>Turns tool and data integrations into reusable MCP servers.</Bullet>
      <Bullet>Mastra agents can connect to external MCP tools.</Bullet>
    </ul>
  </ProtocolPage>
);

const Compare: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 120px' }}>
    <Glow />
    <div style={{ position: 'relative' }}>
      <Eyebrow>Protocol map</Eyebrow>
      <h1
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 88,
          fontWeight: 900,
          lineHeight: 0.98,
          margin: '24px 0 50px',
          letterSpacing: '-0.052em',
        }}
      >
        When to use which protocol?
      </h1>
      <div style={{ display: 'flex', gap: 26 }}>
        <CompareCard
          label="ACP"
          title="Host/client ↔ agent runtime"
          description="Use it when an agent host needs a common interface to talk to agent runtimes."
          color={palette.accent}
          items={['Connect Mastra to ACP-compatible agents', 'Make local or hosted agents portable', 'Best mental model: agent interface']}
        />
        <CompareCard
          label="A2A"
          title="Agent ↔ remote agent"
          description="Use it when agents need to discover capabilities and delegate work across boundaries."
          color={palette.blue}
          items={['Discover what another agent can do', 'Exchange capabilities, messages, and tasks', 'Best mental model: agent collaboration']}
        />
        <CompareCard
          label="MCP"
          title="Model/app ↔ tools + context"
          description="Use it when an agent needs standardized access to external tools, data, or prompts."
          color={palette.amber}
          items={['Expose reusable tool and data servers', 'Bring resources and prompts into the model loop', 'Best mental model: context interface']}
        />
      </div>
      <div
        style={{
          marginTop: 42,
          padding: '28px 34px',
          borderRadius: 22,
          border: `1px solid ${palette.borderBright}`,
          background: `linear-gradient(90deg, ${palette.accent}12 0%, ${palette.blue}12 50%, ${palette.amber}12 100%)`,
          fontFamily: font.mono,
          fontSize: 25,
          lineHeight: 1.28,
          color: 'var(--osd-text)',
          letterSpacing: '0.04em',
        }}
      >
        ACP = agent interface · A2A = agent collaboration · MCP = tool/context interface
      </div>
    </div>
    <Footer index={5} />
  </div>
);

export const meta: SlideMeta = { title: 'ACP-A2A Protocol Workshop' };
export default [Cover, Acp, A2a, Mcp, Compare] satisfies Page[];
