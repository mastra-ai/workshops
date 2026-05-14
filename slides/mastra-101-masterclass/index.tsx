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
  letterSpacing: '-0.012em',
  position: 'relative' as const,
  overflow: 'hidden',
};

const TOTAL = 32;

const accentCycle = [palette.green, palette.blue, palette.amber, palette.purple, palette.rose, palette.cyan];

const layers = [
  { min: 1, max: 4, label: 'Mission', footer: 'LAYER 1 · MISSION AND MAP', accent: palette.green, wash: '#062312' },
  { min: 5, max: 10, label: 'Agent', footer: 'LAYER 2 · FIRST USEFUL AGENT', accent: palette.blue, wash: '#07182c' },
  { min: 11, max: 14, label: 'Tools', footer: 'LAYER 3 · SAFE HANDS', accent: palette.amber, wash: '#2a2108' },
  { min: 15, max: 18, label: 'Context', footer: 'LAYER 4 · CONTEXT', accent: palette.purple, wash: '#1d1230' },
  { min: 19, max: 23, label: 'Process', footer: 'LAYER 5 · BUSINESS PROCESS', accent: palette.rose, wash: '#301018' },
  { min: 24, max: 32, label: 'Launch', footer: 'LAYER 6 · HARDENING AND LAUNCH', accent: palette.cyan, wash: '#062527' },
];

const layerForIndex = (index: number) => layers.find((layer) => index >= layer.min && index <= layer.max) ?? layers[0];

const Stage = ({
  children,
  index,
  section,
  padding = '112px 120px 120px',
}: {
  children: React.ReactNode;
  index: number;
  section?: string;
  padding?: string;
}) => {
  const layer = layerForIndex(index);

  return (
    <div
      style={{
        ...fill,
        padding,
        display: 'flex',
        flexDirection: 'column',
        background:
          `linear-gradient(120deg, ${layer.wash} 0%, ${palette.bg} 34%, ${palette.bg} 100%), ` +
          `linear-gradient(90deg, ${layer.accent}18 0 1px, transparent 1px)`,
      }}
    >
      <LayerFrame layer={layer} index={index} />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>
      <Footer index={index} section={section ?? layer.footer} accent={layer.accent} />
    </div>
  );
};

const Grid = ({ opacity = 0.25 }: { opacity?: number }) => (
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

const LayerFrame = ({ layer, index }: { layer: (typeof layers)[number]; index: number }) => (
  <>
    <Grid opacity={0.18} />
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 20,
        background: layer.accent,
        boxShadow: `0 0 40px ${layer.accent}22`,
      }}
    />
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: 64,
        top: 54,
        bottom: 96,
        width: 1,
        background: `linear-gradient(${layer.accent}, transparent)`,
        opacity: 0.5,
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 48,
        left: 120,
        right: 120,
        zIndex: 2,
        display: 'grid',
        gridTemplateColumns: `repeat(${layers.length}, 1fr)`,
        gap: 10,
      }}
    >
      {layers.map((item) => {
        const active = item === layer;
        const complete = index > item.max;
        return (
          <div
            key={item.label}
            style={{
              height: 5,
              borderRadius: 999,
              background: active || complete ? item.accent : palette.surfaceHi2,
              opacity: active ? 1 : complete ? 0.55 : 0.32,
            }}
          />
        );
      })}
    </div>
    <div
      style={{
        position: 'absolute',
        top: 74,
        right: 120,
        zIndex: 2,
        fontFamily: font.mono,
        fontSize: 14,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: layer.accent,
      }}
    >
      {layer.label}
    </div>
  </>
);

const Footer = ({ index, section, accent = palette.accent }: { index: number; section: string; accent?: string }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 56,
      left: 120,
      right: 120,
      zIndex: 2,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: font.mono,
      fontSize: 18,
      color: palette.dim,
      letterSpacing: '0.12em',
    }}
  >
    <span style={{ color: `${accent}aa` }}>{section}</span>
    <span>
      {String(index).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
    </span>
  </div>
);

const Eyebrow = ({ children, color = palette.accent }: { children: React.ReactNode; color?: string }) => (
  <div
    style={{
      fontFamily: font.mono,
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);

const Title = ({ children, maxWidth = 1540 }: { children: React.ReactNode; maxWidth?: number }) => (
  <h1
    style={{
      fontFamily: font.display,
      fontSize: 94,
      fontWeight: 850,
      lineHeight: 1.02,
      letterSpacing: '-0.025em',
      margin: '24px 0 24px',
      maxWidth,
      color: palette.text,
    }}
  >
    {children}
  </h1>
);

const Subtitle = ({ children, maxWidth = 1480 }: { children: React.ReactNode; maxWidth?: number }) => (
  <p style={{ fontSize: 31, color: palette.textSoft, lineHeight: 1.4, maxWidth, margin: 0 }}>{children}</p>
);

const Strong = ({ children }: { children: React.ReactNode }) => <b style={{ color: palette.text }}>{children}</b>;

const Card = ({
  label,
  title,
  children,
  accent = palette.accent,
  minHeight = 190,
}: {
  label?: string;
  title: React.ReactNode;
  children: React.ReactNode;
  accent?: string;
  minHeight?: number;
}) => (
  <div
    style={{
      flex: 1,
      minHeight,
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 14,
      padding: '26px 30px',
    }}
  >
    {label && <MiniLabel color={accent}>{label}</MiniLabel>}
    <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.16, color: palette.text, marginBottom: 14 }}>{title}</div>
    <div style={{ fontSize: 23, lineHeight: 1.42, color: palette.textSoft }}>{children}</div>
  </div>
);

const MiniLabel = ({ children, color = palette.accent }: { children: React.ReactNode; color?: string }) => (
  <div
    style={{
      fontFamily: font.mono,
      fontSize: 15,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
      marginBottom: 12,
    }}
  >
    {children}
  </div>
);

const Row = ({ children, gap = 24 }: { children: React.ReactNode; gap?: number }) => (
  <div style={{ display: 'flex', gap, alignItems: 'stretch' }}>{children}</div>
);

const Split = ({ left, right }: { left: React.ReactNode; right: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: 56, alignItems: 'center', flex: 1 }}>
    <div>{left}</div>
    <div>{right}</div>
  </div>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: '#050505',
      border: `1px solid ${palette.borderBright}`,
      borderRadius: 14,
      padding: '30px 34px',
      fontFamily: font.mono,
      fontSize: 23,
      lineHeight: 1.48,
      color: palette.textSoft,
      whiteSpace: 'pre-wrap',
      boxShadow: `0 0 0 1px ${palette.bg}`,
    }}
  >
    {children}
  </div>
);

const StackDiagram = ({ items }: { items: { label: string; desc: string; accent: string }[] }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
    {items.map((item, index) => (
      <div
        key={item.label}
        style={{
          display: 'grid',
          gridTemplateColumns: '84px 1fr',
          gap: 20,
          alignItems: 'center',
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderLeft: `4px solid ${item.accent}`,
          borderRadius: 14,
          padding: '22px 26px',
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 10,
            background: `${item.accent}1d`,
            border: `1px solid ${item.accent}55`,
            color: item.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: font.mono,
            fontSize: 21,
            fontWeight: 800,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
        <div>
          <div style={{ fontSize: 30, fontWeight: 800, color: palette.text, marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontSize: 22, lineHeight: 1.36, color: palette.textSoft }}>{item.desc}</div>
        </div>
      </div>
    ))}
  </div>
);

const CapabilityGrid = ({
  items,
  columns = 3,
}: {
  items: { label: string; desc: string; accent?: string }[];
  columns?: number;
}) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 22 }}>
    {items.map((item, index) => (
      <div
        key={item.label}
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderTop: `2px solid ${item.accent ?? accentCycle[index % accentCycle.length]}`,
          borderRadius: 14,
          padding: '24px 26px',
          minHeight: 150,
        }}
      >
        <div style={{ fontSize: 27, fontWeight: 800, color: palette.text, marginBottom: 9 }}>{item.label}</div>
        <div style={{ fontSize: 21, color: palette.textSoft, lineHeight: 1.36 }}>{item.desc}</div>
      </div>
    ))}
  </div>
);

const Pipeline = ({
  items,
}: {
  items: { label: string; desc: string; accent?: string }[];
}) => (
  <div style={{ display: 'flex', alignItems: 'stretch', gap: 18 }}>
    {items.map((item, index) => (
      <div key={item.label} style={{ display: 'flex', flex: 1, gap: 18 }}>
        <div
          style={{
            flex: 1,
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderTop: `2px solid ${item.accent ?? accentCycle[index % accentCycle.length]}`,
            borderRadius: 14,
            padding: '24px 24px',
            minHeight: 166,
          }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 15, color: item.accent ?? palette.accent, marginBottom: 12 }}>
            {String(index + 1).padStart(2, '0')}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: palette.text, marginBottom: 8 }}>{item.label}</div>
          <div style={{ fontSize: 20, color: palette.textSoft, lineHeight: 1.34 }}>{item.desc}</div>
        </div>
        {index < items.length - 1 && (
          <div style={{ alignSelf: 'center', color: palette.muted, fontSize: 28, marginRight: -4 }}>-&gt;</div>
        )}
      </div>
    ))}
  </div>
);

const Timeline = ({ items }: { items: { phase: string; label: string; desc: string; accent?: string }[] }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
    {items.map((item, index) => (
      <div
        key={item.phase}
        style={{
          display: 'grid',
          gridTemplateColumns: '112px 1fr',
          gap: 20,
          alignItems: 'center',
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderLeft: `4px solid ${item.accent ?? accentCycle[index % accentCycle.length]}`,
          borderRadius: 14,
          padding: '22px 24px',
          minHeight: 160,
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 21, color: item.accent ?? palette.accent }}>{item.phase}</div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: palette.text, marginBottom: 6 }}>{item.label}</div>
          <div style={{ fontSize: 20, lineHeight: 1.32, color: palette.textSoft }}>{item.desc}</div>
        </div>
      </div>
    ))}
  </div>
);

const Checklist = ({ items }: { items: { label: string; desc: string; accent?: string }[] }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
    {items.map((item, index) => (
      <div
        key={item.label}
        style={{
          display: 'grid',
          gridTemplateColumns: '46px 1fr',
          gap: 18,
          alignItems: 'start',
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 14,
          padding: '22px 24px',
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            border: `1px solid ${(item.accent ?? accentCycle[index % accentCycle.length])}66`,
            background: `${item.accent ?? accentCycle[index % accentCycle.length]}1b`,
            color: item.accent ?? accentCycle[index % accentCycle.length],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: 20,
          }}
        >
          ✓
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: palette.text, marginBottom: 5 }}>{item.label}</div>
          <div style={{ fontSize: 21, color: palette.textSoft, lineHeight: 1.35 }}>{item.desc}</div>
        </div>
      </div>
    ))}
  </div>
);

const LayerPath = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, flex: 1, alignItems: 'stretch' }}>
    {[
      ['01', 'Mission', 'Pick the support/refund problem and map each failure to a primitive.'],
      ['02', 'Agent', 'Build the first useful loop with Studio, instructions, models, and streaming.'],
      ['03', 'Tools', 'Give the agent narrow, typed hands and explicit integration boundaries.'],
      ['04', 'Context', 'Add customer continuity, policy grounding, retrieval quality, and durable storage.'],
      ['05', 'Process', 'Promote refund approval and business rules into inspectable workflow state.'],
      ['06', 'Launch', 'Harden with processors, specialists, traces, evals, readiness, and interfaces.'],
    ].map(([number, label, desc], index) => {
      const layer = layers[index];
      return (
        <div
          key={label}
          style={{
            minHeight: 560,
            padding: '30px 24px',
            borderRadius: 18,
            border: `1px solid ${layer.accent}55`,
            background: `linear-gradient(180deg, ${layer.wash}, ${palette.surface} 64%)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 58,
              lineHeight: 1,
              fontWeight: 900,
              color: layer.accent,
            }}
          >
            {number}
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 850, color: palette.text, marginBottom: 14 }}>{label}</div>
            <div style={{ fontSize: 20, lineHeight: 1.34, color: palette.textSoft }}>{desc}</div>
          </div>
        </div>
      );
    })}
  </div>
);

const FailureMap = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
    {[
      ['Unknown next step', 'Agent', 'Let the model choose the next move within a bounded role.', palette.green],
      ['Needs to touch a system', 'Tool', 'Expose one typed capability with a visible side effect.', palette.blue],
      ['User context should persist', 'Memory', 'Carry useful thread and profile state across turns.', palette.amber],
      ['Answer depends on docs', 'RAG', 'Retrieve grounded policy or product knowledge at runtime.', palette.purple],
      ['Rule must be repeatable', 'Workflow', 'Move approval paths and business process into explicit steps.', palette.rose],
      ['Prompt should not enforce it', 'Processor', 'Make redaction, routing, validation, and retries runtime behavior.', palette.cyan],
    ].map(([failure, primitive, desc, accent]) => (
      <div
        key={String(primitive)}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 92px 1fr',
          gap: 18,
          alignItems: 'center',
          minHeight: 128,
          padding: '18px 22px',
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 14,
        }}
      >
        <div style={{ fontSize: 23, lineHeight: 1.22, color: palette.textSoft }}>{failure}</div>
        <div
          style={{
            height: 52,
            borderRadius: 999,
            border: `1px solid ${accent}66`,
            color: accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: font.mono,
            fontSize: 18,
          }}
        >
          -&gt;
        </div>
        <div>
          <div style={{ fontSize: 27, fontWeight: 850, color: accent as string, marginBottom: 5 }}>{primitive}</div>
          <div style={{ fontSize: 19, lineHeight: 1.28, color: palette.textSoft }}>{desc}</div>
        </div>
      </div>
    ))}
  </div>
);

const AgentLoopDiagram = () => (
  <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch' }}>
    {[
      ['01', 'Prompt', 'Instructions, runtime context, memory, tools, and user input become the model call.', palette.green],
      ['02', 'Decide', 'The model answers, calls a tool, asks for structure, or continues reasoning.', palette.blue],
      ['04', 'Stop', 'Final output, limits, approval gates, errors, or workflow control end the run.', palette.purple],
      ['03', 'Act', 'Mastra validates tool inputs, executes, captures outputs, and feeds results back.', palette.amber],
    ].map(([number, label, desc, accent]) => (
      <div
        key={String(label)}
        style={{
          minHeight: 230,
          padding: '28px 30px',
          background: palette.surface,
          border: `1px solid ${accent}55`,
          borderRadius: 18,
          position: 'relative',
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 18, color: accent as string, marginBottom: 22 }}>{number}</div>
        <div style={{ fontSize: 40, fontWeight: 850, color: palette.text, marginBottom: 12 }}>{label}</div>
        <div style={{ fontSize: 22, lineHeight: 1.34, color: palette.textSoft }}>{desc}</div>
      </div>
    ))}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 270,
        height: 270,
        borderRadius: '50%',
        border: `2px solid ${palette.blue}66`,
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: font.mono,
        fontSize: 25,
        color: palette.text,
        boxShadow: `0 0 0 14px ${palette.bg}`,
      }}
    >
      supportAgent
      <br />
      run()
    </div>
  </div>
);

const ContextMap = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 32, alignItems: 'stretch' }}>
    <div style={{ display: 'grid', gap: 16 }}>
      {[
        ['Conversation layer', 'Thread history, working memory, semantic recall.', palette.green],
        ['Knowledge layer', 'Policy docs, order records, tickets, product documentation.', palette.purple],
        ['Request layer', 'Tenant, role, limits, feature flags, locale, auth state.', palette.rose],
        ['Runtime layer', 'Processor metadata, redactions, route decisions, trace labels.', palette.cyan],
      ].map(([label, desc, accent]) => (
        <div
          key={String(label)}
          style={{
            padding: '24px 28px',
            borderRadius: 16,
            border: `1px solid ${accent}55`,
            background: `linear-gradient(90deg, ${accent}1f, ${palette.surface})`,
          }}
        >
          <div style={{ fontSize: 31, fontWeight: 850, color: palette.text, marginBottom: 7 }}>{label}</div>
          <div style={{ fontSize: 22, color: palette.textSoft, lineHeight: 1.34 }}>{desc}</div>
        </div>
      ))}
    </div>
    <div
      style={{
        borderRadius: 18,
        border: `1px solid ${palette.borderBright}`,
        background: '#050505',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <MiniLabel color={palette.purple}>Context Rule</MiniLabel>
      <div style={{ fontSize: 42, lineHeight: 1.08, fontWeight: 850, color: palette.text, marginBottom: 22 }}>
        Do not build one giant prompt bucket.
      </div>
      <div style={{ fontSize: 25, lineHeight: 1.36, color: palette.textSoft }}>
        Facts need homes. The right home depends on lifetime, authority, freshness, and who is allowed to change it.
      </div>
    </div>
  </div>
);

const WorkflowGraph = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, alignItems: 'center' }}>
    {[
      ['Classify', 'What kind of request is this?', palette.green],
      ['Gather', 'Orders, docs, memory, permissions.', palette.blue],
      ['Draft', 'Agent proposes answer or action.', palette.amber],
      ['Review', 'Scorer, processor, or human gate.', palette.purple],
      ['Commit', 'Write, send, update, and trace.', palette.rose],
    ].map(([label, desc, accent], index) => (
      <div key={String(label)} style={{ display: 'flex', gap: 18 }}>
        <div
          style={{
            minHeight: 260,
            flex: 1,
            padding: '28px 24px',
            borderRadius: 18,
            background: index === 3 ? `${palette.surfaceHi}` : palette.surface,
            border: `1px solid ${accent}66`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontFamily: font.mono, color: accent as string, fontSize: 18 }}>
            {String(index + 1).padStart(2, '0')}
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 850, color: palette.text, marginBottom: 12 }}>{label}</div>
            <div style={{ fontSize: 21, lineHeight: 1.32, color: palette.textSoft }}>{desc}</div>
          </div>
        </div>
        {index < 4 && <div style={{ alignSelf: 'center', color: palette.muted, fontSize: 30 }}>-&gt;</div>}
      </div>
    ))}
  </div>
);

const OpsDashboard = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 26, alignItems: 'stretch' }}>
    <div
      style={{
        background: '#050505',
        border: `1px solid ${palette.borderBright}`,
        borderRadius: 18,
        padding: '28px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 18,
      }}
    >
      {[
        ['Trace health', '99.2%', palette.green],
        ['Grounding score', '0.87', palette.blue],
        ['Approval waits', '14', palette.amber],
        ['P95 latency', '3.8s', palette.rose],
      ].map(([label, value, accent]) => (
        <div key={String(label)} style={{ background: palette.surface, borderRadius: 14, padding: '24px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 15, color: accent as string, marginBottom: 20 }}>{label}</div>
          <div style={{ fontSize: 58, fontWeight: 900, color: palette.text }}>{value}</div>
        </div>
      ))}
    </div>
    <Checklist
      items={[
        { label: 'Trace the path', desc: 'Prompt, context, tool input, output, score, cost.', accent: palette.green },
        { label: 'Promote failures', desc: 'Turn real incidents into regression cases.', accent: palette.amber },
        { label: 'Gate releases', desc: 'Block rollout when quality drops below threshold.', accent: palette.rose },
      ]}
    />
  </div>
);

const Cover: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Grid />
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background:
          `radial-gradient(920px 520px at 16% 20%, ${palette.accent}20 0%, transparent 60%),` +
          `radial-gradient(760px 460px at 84% 78%, ${palette.blue}16 0%, transparent 64%)`,
      }}
    />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Eyebrow>Mastra 101 Masterclass</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 182,
          fontWeight: 900,
          lineHeight: 0.94,
          letterSpacing: '-0.04em',
          margin: '36px 0 30px',
          maxWidth: 1580,
        }}
      >
        Build agents
        <br />
        that <span style={{ color: palette.accent }}>ship.</span>
      </h1>
      <Subtitle maxWidth={1320}>
        Turn one support and refund agent from a working prototype into production software: tools, context, workflows,
        guardrails, evaluation, and deployment.
      </Subtitle>
      <div style={{ marginTop: 56, display: 'flex', gap: 22, maxWidth: 1420 }}>
        {['Build the first agent', 'Add context and control', 'Operate in production'].map((label, index) => (
          <div
            key={label}
            style={{
              flex: 1,
              background: palette.surface,
              border: `1px solid ${palette.border}`,
              borderTop: `2px solid ${accentCycle[index]}`,
              borderRadius: 14,
              padding: '24px 28px',
              fontSize: 26,
              fontWeight: 800,
              color: palette.text,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
    <Footer index={1} section="MASTRA 101 MASTERCLASS" />
  </div>
);

const RunOfShow: Page = () => (
  <Stage index={2}>
    <Eyebrow>00 / Build path</Eyebrow>
    <Title>We build the agent in production layers.</Title>
    <LayerPath />
  </Stage>
);

const MentalModel: Page = () => (
  <Stage index={3}>
    <Eyebrow>01 / Production mental model</Eyebrow>
    <Split
      left={
        <>
          <Title>Mastra is the application layer around the model.</Title>
          <Subtitle>
            The LLM is the reasoning engine. Mastra provides the typed runtime that makes it useful in a real app:
            state, tools, control flow, safety, telemetry, and APIs.
          </Subtitle>
        </>
      }
      right={
        <StackDiagram
          items={[
            { label: 'Reason', desc: 'Models generate, stream, call tools, and produce structured output.', accent: palette.green },
            { label: 'Act', desc: 'Tools, MCP, browsers, voice, and custom integrations touch the outside world.', accent: palette.blue },
            { label: 'Remember', desc: 'Memory, storage, semantic recall, and RAG keep context available.', accent: palette.amber },
            { label: 'Control', desc: 'Workflows, processors, auth, approvals, and runtime context shape execution.', accent: palette.purple },
            { label: 'Operate', desc: 'Studio, logs, traces, scorers, and deployment close the production loop.', accent: palette.rose },
          ]}
        />
      }
    />
  </Stage>
);

const DecisionMap: Page = () => (
  <Stage index={4}>
    <Eyebrow>01b / Choosing primitives</Eyebrow>
    <Title>Mastra is easier when every primitive has a job.</Title>
    <FailureMap />
  </Stage>
);

const ProjectAnatomy: Page = () => (
  <Stage index={5}>
    <Eyebrow>02 / Project anatomy</Eyebrow>
    <Title>Most Mastra apps center on `src/mastra`.</Title>
    <Row>
      <Card label="Entry" title="Register the runtime" accent={palette.green}>
        `new Mastra()` wires agents, workflows, storage, vectors, loggers, telemetry, and server behavior.
      </Card>
      <Card label="Modules" title="Keep primitives separate" accent={palette.blue}>
        Agents live with instructions and models. Tools wrap typed side effects. Workflows define controlled processes.
      </Card>
      <Card label="Studio" title="Debug before integrating" accent={palette.amber}>
        Local Studio lets you test prompts, inspect tool calls, run workflows, and iterate before building the UI.
      </Card>
    </Row>
    <div style={{ marginTop: 38 }}>
      <Code>{`src/mastra/
  index.ts              // Mastra registry
  agents/               // Agent definitions
  tools/                // Typed executable capabilities
  workflows/            // Repeatable orchestration
  processors/           // Input/output control points
  scorers/              // Quality checks and evals`}</Code>
    </div>
  </Stage>
);

const Agents: Page = () => (
  <Stage index={7}>
    <Eyebrow>03 / First working agent</Eyebrow>
    <Split
      left={
        <>
          <Title>Use agents when the path is open-ended.</Title>
          <Subtitle>
            An agent owns the goal, the instructions, the model, and the tools it can call. It loops until it has a final
            answer or reaches your stop condition.
          </Subtitle>
        </>
      }
      right={
        <Code>{`import { Agent } from '@mastra/core/agent';

export const supportAgent = new Agent({
  id: 'support-agent',
  name: 'Support Agent',
  instructions: 'Resolve customer issues clearly.',
  model: 'openai/gpt-5.4',
  tools: { lookupOrder, refundCustomer },
  memory,
  scorers: { helpfulness },
});`}</Code>
      }
    />
    <div style={{ marginTop: 34 }}>
      <CapabilityGrid
        items={[
          { label: 'Generate', desc: 'Return a complete response with tool calls, tool results, steps, and usage.' },
          { label: 'Stream', desc: 'Deliver tokens and events to the UI while tools and steps are still resolving.' },
          { label: 'Structured output', desc: 'Use schemas when the app needs data, not prose.' },
        ]}
      />
    </div>
  </Stage>
);

const AgentLoop: Page = () => (
  <Stage index={8}>
    <Eyebrow>03b / The agent loop</Eyebrow>
    <Title>An agent run is a loop with observable state.</Title>
    <AgentLoopDiagram />
  </Stage>
);

const ModelsAndStreaming: Page = () => (
  <Stage index={10}>
    <Eyebrow>04 / Models and streaming</Eyebrow>
    <Title>Models should be swappable, but behavior should stay typed.</Title>
    <CapabilityGrid
      items={[
        { label: 'Model router', desc: 'Reference models by provider/name and change them without rewriting agent code.', accent: palette.green },
        { label: 'Provider breadth', desc: 'Use OpenAI, Anthropic, Google, Groq, Mistral, xAI, local providers, and more.', accent: palette.blue },
        { label: 'Streaming events', desc: 'Stream text, tool calls, workflow progress, and UI events for responsive apps.', accent: palette.amber },
        { label: 'Runtime context', desc: 'Inject user, tenant, plan, auth, locale, or feature flags per request.', accent: palette.purple },
        { label: 'Cost control', desc: 'Route simple steps to smaller models and reserve larger models for hard reasoning.', accent: palette.rose },
        { label: 'Fallback patterns', desc: 'Keep the surrounding app stable while experimenting with model quality.', accent: palette.cyan },
      ]}
    />
    <div style={{ marginTop: 42 }}>
      <Code>{`const response = await agent.stream('Plan my onboarding', {
  runtimeContext: new RuntimeContext([
    ['tenantId', 'acme'],
    ['role', 'admin'],
  ]),
});`}</Code>
    </div>
  </Stage>
);

const ToolsAndMcp: Page = () => (
  <Stage index={11}>
    <Eyebrow>05 / Tools and MCP</Eyebrow>
    <Split
      left={
        <>
          <Title>Tools are the boundary between reasoning and action.</Title>
          <Subtitle>
            A Mastra tool is a typed function with an input schema, description, and executor. MCP lets you import
            external tools or expose your own tools and agents to other clients.
          </Subtitle>
        </>
      }
      right={
        <Pipeline
          items={[
            { label: 'Describe', desc: 'Give the model a precise capability and when to use it.', accent: palette.green },
            { label: 'Validate', desc: 'Use Zod schemas to constrain inputs before side effects run.', accent: palette.blue },
            { label: 'Execute', desc: 'Call APIs, databases, browsers, filesystems, or internal services.', accent: palette.amber },
            { label: 'Observe', desc: 'Trace arguments, results, latency, errors, and approvals.', accent: palette.purple },
          ]}
        />
      }
    />
    <div style={{ marginTop: 38 }}>
      <CapabilityGrid
        columns={2}
        items={[
          { label: 'MCPClient', desc: 'Pull tools, resources, and prompts from existing MCP servers.' },
          { label: 'MCPServer', desc: 'Expose Mastra tools, workflows, and agents to external MCP clients.' },
        ]}
      />
    </div>
  </Stage>
);

const ToolDesign: Page = () => (
  <Stage index={12}>
    <Eyebrow>05b / Tool design</Eyebrow>
    <Title>A good tool is boring, narrow, and easy to audit.</Title>
    <Row>
      <Card label="Bad" title="`doEverything()`" accent={palette.red} minHeight={250}>
        Broad tools hide intent, make traces useless, increase blast radius, and force the model to invent implicit
        arguments.
      </Card>
      <Card label="Better" title="One verb, one resource" accent={palette.green} minHeight={250}>
        `lookupOrder`, `draftRefund`, `sendApprovalRequest`, `updateTicketStatus`. Each has a schema and a visible side
        effect.
      </Card>
      <Card label="Best" title="Use the repo pattern" accent={palette.blue} minHeight={250}>
        `supportAgent` can call `draftRefund`. Only `refundWorkflow` can reach `approvalGateAndCommit`, where policy and
        approval decide submit vs wait.
      </Card>
    </Row>
    <div style={{ marginTop: 40 }}>
      <Code>{`supportAgent.tools = { lookupOrder, draftRefund, updateTicketStatus }

refundWorkflow
  .then(gatherContext)
  .then(draftRefundDecision)
  .then(approvalGateAndCommit) // submits only if approved`}</Code>
    </div>
  </Stage>
);

const CheckpointOne: Page = () => (
  <Stage index={14}>
    <Eyebrow>Checkpoint 1</Eyebrow>
    <Title>Design the first agent before writing code.</Title>
    <Split
      left={
        <Checklist
          items={[
            { label: 'Name the job', desc: 'What outcome does this agent own?' },
            { label: 'List allowed actions', desc: 'Which tools are required, and which side effects need approval?' },
            { label: 'Choose context sources', desc: 'Which inputs are prompt context, memory, RAG, or runtime context?' },
            { label: 'Define the first score', desc: 'What would make this response clearly good or clearly wrong?' },
          ]}
        />
      }
      right={
        <Code>{`Exercise prompt:

"We are building an internal support agent.
It can read orders, draft refunds, update tickets,
and answer policy questions from docs.

What should be an agent, tool, workflow,
memory item, and RAG source?"`}</Code>
      }
    />
  </Stage>
);

const MemoryAndRag: Page = () => (
  <Stage index={15}>
    <Eyebrow>06 / Memory and RAG</Eyebrow>
    <Title>Agents need context, knowledge, and durable state.</Title>
    <Row>
      <Card label="Memory" title="Conversation state" accent={palette.green} minHeight={240}>
        Threads, resources, working memory, conversation history, semantic recall, and memory processors keep user context
        available across turns and sessions.
      </Card>
      <Card label="RAG" title="Knowledge retrieval" accent={palette.blue} minHeight={240}>
        Documents are chunked, embedded, stored in vectors, retrieved, filtered, reranked, and injected when a question
        needs outside knowledge.
      </Card>
      <Card label="Storage" title="Durable backend" accent={palette.amber} minHeight={240}>
        Use LibSQL, Postgres, Upstash, DynamoDB, Cloudflare stores, and vector backends such as PgVector, Pinecone,
        Qdrant, Chroma, MongoDB, and more.
      </Card>
    </Row>
    <div style={{ marginTop: 42 }}>
      <Pipeline
        items={[
          { label: 'Ingest', desc: 'Load docs, HTML, markdown, JSON, PDFs, or domain records.' },
          { label: 'Index', desc: 'Chunk, embed, attach metadata, and upsert into a vector store.' },
          { label: 'Retrieve', desc: 'Query, filter, hybrid search, rerank, and compress context.' },
          { label: 'Answer', desc: 'Ground the agent response and score faithfulness or recall.' },
        ]}
      />
    </div>
  </Stage>
);

const MemoryPatterns: Page = () => (
  <Stage index={16}>
    <Eyebrow>06b / Context architecture</Eyebrow>
    <Title>Do not put every fact in the same bucket.</Title>
    <ContextMap />
  </Stage>
);

const Workflows: Page = () => (
  <Stage index={19}>
    <Eyebrow>07 / Workflows</Eyebrow>
    <Split
      left={
        <>
          <Title>Use workflows when the process must be repeatable.</Title>
          <Subtitle>
            Workflows turn agentic systems into explicit execution graphs: typed steps, deterministic code, agents,
            tools, branches, loops, snapshots, suspension, and replay.
          </Subtitle>
        </>
      }
      right={
        <CapabilityGrid
          columns={2}
          items={[
            { label: 'Sequential', desc: '`step.then(nextStep)` for clear process order.', accent: palette.green },
            { label: 'Parallel', desc: 'Run independent steps together and join results.', accent: palette.blue },
            { label: 'Branch', desc: 'Route by condition, input, tool output, or score.', accent: palette.amber },
            { label: 'Loop', desc: 'Repeat until quality, budget, or state criteria are met.', accent: palette.purple },
            { label: 'Suspend', desc: 'Pause for approval, payment, review, or external events.', accent: palette.rose },
            { label: 'Replay', desc: 'Debug from snapshots with the same original context.', accent: palette.cyan },
          ]}
        />
      }
    />
  </Stage>
);

const WorkflowRunbook: Page = () => (
  <Stage index={20}>
    <Eyebrow>07b / Workflow runbook</Eyebrow>
    <Title>Promote brittle prompt steps into workflow steps.</Title>
    <WorkflowGraph />
    <div style={{ marginTop: 44 }}>
      <Code>{`Good workflow boundary:
"The user asked for a refund" is agentic.
"Refunds over $100 require manager approval" is workflow logic.`}</Code>
    </div>
  </Stage>
);

const HumanInLoop: Page = () => (
  <Stage index={22}>
    <Eyebrow>08 / Context, auth, and approvals</Eyebrow>
    <Title>Production agents need per-request authority.</Title>
    <Row>
      <Card label="Runtime context" title="Dynamic behavior" accent={palette.green}>
        Pass identity, permissions, tenant settings, budget, feature flags, locale, and request metadata into agents and
        workflows.
      </Card>
      <Card label="Auth" title="Access control" accent={palette.blue}>
        Integrate JWT, Clerk, Supabase, Firebase, WorkOS, Auth0, or your own middleware before agent execution.
      </Card>
      <Card label="Human review" title="Controlled side effects" accent={palette.amber}>
        Suspend workflows or require approval before tool calls that spend money, send messages, delete data, or escalate.
      </Card>
    </Row>
    <div style={{ marginTop: 44 }}>
      <Code>{`// Pattern: let the model recommend, but let the workflow decide.
if (refund.amount > runtimeContext.get('autoRefundLimit')) {
  await suspend({ reason: 'manager approval required' });
}`}</Code>
    </div>
  </Stage>
);

const CheckpointTwo: Page = () => (
  <Stage index={23}>
    <Eyebrow>Checkpoint 2</Eyebrow>
    <Title>For risky actions, split recommendation from authority.</Title>
    <Split
      left={
        <Card label="Scenario" title="Customer asks for a $240 refund" accent={palette.amber} minHeight={520}>
          The order exists, policy is ambiguous, the customer has a prior refund, and the support rep is a contractor.
          The agent can help, but it should not be the component that decides whether money moves.
        </Card>
      }
      right={
        <Checklist
          items={[
            { label: 'Agent', desc: 'Drafts the customer-facing recommendation and explains missing context.' },
            { label: 'RAG', desc: 'Retrieves refund policy and prior-refund rules from the knowledge base.' },
            { label: 'Runtime context', desc: 'Carries requesterRole=contractor and the auto-refund limit.' },
            { label: 'Workflow', desc: 'Applies approval rules and chooses submit vs waiting-on-approval.' },
            { label: 'Scorers/processors', desc: 'Check grounding, required approval language, and response safety.' },
          ]}
        />
      }
    />
  </Stage>
);

const Networks: Page = () => (
  <Stage index={26}>
    <Eyebrow>10 / Multi-agent systems</Eyebrow>
    <Split
      left={
        <>
          <Title>Networks split broad tasks into specialist roles.</Title>
          <Subtitle>
            A supervisor coordinates agents that each own one domain. Use this when the job naturally decomposes into
            planning, research, execution, review, or domain-specific analysis.
          </Subtitle>
        </>
      }
      right={
        <StackDiagram
          items={[
            { label: 'Supervisor', desc: 'Understands the goal, delegates, reconciles, and decides when to stop.', accent: palette.green },
            { label: 'Specialists', desc: 'Focused agents with narrow instructions, tools, memory, and eval criteria.', accent: palette.blue },
            { label: 'Shared state', desc: 'Runtime context, memory, traces, and workflow state make handoffs explicit.', accent: palette.amber },
            { label: 'Reviewer', desc: 'A separate agent or scorer checks quality before the user sees the output.', accent: palette.purple },
          ]}
        />
      }
    />
  </Stage>
);

const Guardrails: Page = () => (
  <Stage index={24}>
    <Eyebrow>09 / Processors and guardrails</Eyebrow>
    <Title>Do not ask prompts to do infrastructure work.</Title>
    <Pipeline
      items={[
        { label: 'Input processors', desc: 'Normalize, redact, block, trim, enrich, or route before the model sees the message.', accent: palette.green },
        { label: 'Agent loop', desc: 'The model reasons, calls tools, observes results, and decides the next step.', accent: palette.blue },
        { label: 'Output processors', desc: 'Validate, transform, redact, retry, abort, or attach metadata before responding.', accent: palette.amber },
      ]}
    />
    <div style={{ marginTop: 44 }}>
      <CapabilityGrid
        items={[
          { label: 'Safety', desc: 'PII filtering, topic blocking, prompt-injection checks, policy enforcement.' },
          { label: 'Reliability', desc: 'Response validation, retries, answer length limits, required tool usage.' },
          { label: 'Cost', desc: 'Context pruning, model routing, token budgets, escalation detection.' },
        ]}
      />
    </div>
  </Stage>
);

const Observability: Page = () => (
  <Stage index={27}>
    <Eyebrow>11 / Observability and scorers</Eyebrow>
    <Title>Agent quality is a production signal.</Title>
    <OpsDashboard />
  </Stage>
);

const EvaluationLoop: Page = () => (
  <Stage index={28}>
    <Eyebrow>11b / Evaluation loop</Eyebrow>
    <Title>Turn production traces into regression tests.</Title>
    <Pipeline
      items={[
        { label: 'Trace', desc: 'Capture real prompts, tool calls, retrieved context, latency, cost, and outputs.', accent: palette.green },
        { label: 'Label', desc: 'Collect human labels, policy outcomes, bug reports, and known-good examples.', accent: palette.blue },
        { label: 'Score', desc: 'Run relevance, faithfulness, completeness, toxicity, custom rules, or LLM judges.', accent: palette.amber },
        { label: 'Gate', desc: 'Fail CI or block rollout when quality drops below the chosen threshold.', accent: palette.purple },
      ]}
    />
    <div style={{ marginTop: 44 }}>
      <Checklist
        items={[
          { label: 'Start with one metric', desc: 'Pick the failure that would hurt users first.' },
          { label: 'Sample deliberately', desc: 'Score high-risk paths more often than low-risk chat.' },
          { label: 'Keep examples fresh', desc: 'Promote real failures into the next regression set.' },
        ]}
      />
    </div>
  </Stage>
);

const Interfaces: Page = () => (
  <Stage index={31}>
    <Eyebrow>14 / Interfaces and modalities</Eyebrow>
    <Title>Mastra apps can meet users where the work happens.</Title>
    <CapabilityGrid
      items={[
        { label: 'REST and client SDK', desc: 'Expose registered agents, tools, workflows, memory, vectors, logs, and telemetry.' },
        { label: 'Web frameworks', desc: 'Integrate with Next.js, SvelteKit, Vite/React, Astro, Express, and standard server adapters.' },
        { label: 'Agentic UIs', desc: 'Pair streaming agents with Vercel AI SDK, CopilotKit, Assistant UI, Cedar-OS, and OpenRouter flows.' },
        { label: 'Voice', desc: 'Add text-to-speech, speech-to-text, and real-time speech-to-speech providers.' },
        { label: 'Browser actions', desc: 'Use browser automation patterns for sites where APIs are missing or incomplete.' },
        { label: 'Workspaces', desc: 'Give agents filesystems, sandboxed execution, and reusable skills for coding or document-heavy work.' },
      ]}
    />
  </Stage>
);

const Deployment: Page = () => (
  <Stage index={30}>
    <Eyebrow>13 / Deployment</Eyebrow>
    <Split
      left={
        <>
          <Title>Ship the same primitives you tested locally.</Title>
          <Subtitle>
            Mastra can run as a production server, behind your web framework, in cloud provider targets, or on Mastra
            Server for purpose-built agent deployment.
          </Subtitle>
        </>
      }
      right={
        <StackDiagram
          items={[
            { label: 'Local Studio', desc: 'Prototype, run, trace, and tune with fast feedback.', accent: palette.green },
            { label: 'Production server', desc: 'Expose agents and workflows as APIs with middleware, auth, and storage.', accent: palette.blue },
            { label: 'Cloud targets', desc: 'Deploy to providers such as AWS, Azure, DigitalOcean, and framework hosts.', accent: palette.amber },
            { label: 'Mastra Server', desc: 'Deploy agents with managed routing, scaling, telemetry, and endpoints.', accent: palette.purple },
            { label: 'Operate', desc: 'Monitor traces, cost, latency, scorer drift, and user feedback after launch.', accent: palette.rose },
          ]}
        />
      }
    />
  </Stage>
);

const SetupDeepDive: Page = () => (
  <Stage index={6}>
    <Eyebrow>02b / Setup and Studio</Eyebrow>
    <Title>Start with the fastest loop: code, Studio, trace, repeat.</Title>
    <Split
      left={
        <Checklist
          items={[
            { label: 'Bootstrap the app', desc: 'Create the Mastra project and keep all runtime primitives under `src/mastra`.' },
            { label: 'Register primitives', desc: '`new Mastra()` is the composition root for agents, workflows, storage, telemetry, and server behavior.' },
            { label: 'Use Studio early', desc: 'Inspect prompts, tool calls, memory, workflow runs, traces, and response shape before wiring a production UI.' },
            { label: 'Hit the API directly', desc: 'Call the generated endpoints to confirm agents and workflows work outside Studio.' },
          ]}
        />
      }
      right={
        <Code>{`import { Mastra } from '@mastra/core/mastra';
import { supportAgent } from './agents/support-agent';
import { refundWorkflow } from './workflows/refund-workflow';

export const mastra = new Mastra({
  agents: { supportAgent },
  workflows: { refundWorkflow },
  storage,
  logger,
  telemetry,
});`}</Code>
      }
    />
  </Stage>
);

const InstructionDesign: Page = () => (
  <Stage index={9}>
    <Eyebrow>03c / Instructions and output</Eyebrow>
    <Title>Instructions define behavior; schemas define contracts.</Title>
    <Row>
      <Card label="Role" title="What job does it own?" accent={palette.green} minHeight={240}>
        State the agent's responsibility, audience, tone, and success criteria. Avoid asking one agent to own the whole
        business.
      </Card>
      <Card label="Rules" title="What must never happen?" accent={palette.amber} minHeight={240}>
        Put policy boundaries in instructions, but enforce critical boundaries with tools, workflows, processors, and
        auth.
      </Card>
      <Card label="Shape" title="What does the app need?" accent={palette.blue} minHeight={240}>
        Use structured output when downstream code needs fields, enums, confidence, citations, or action plans.
      </Card>
    </Row>
    <div style={{ marginTop: 42 }}>
      <Code>{`const triageSchema = z.object({
  category: z.enum(['billing', 'bug', 'how-to', 'refund']),
  priority: z.enum(['low', 'normal', 'urgent']),
  needsHumanReview: z.boolean(),
  summary: z.string(),
});`}</Code>
    </div>
  </Stage>
);

const McpDeepDive: Page = () => (
  <Stage index={13}>
    <Eyebrow>05c / MCP architecture</Eyebrow>
    <Title>MCP lets your agent runtime plug into other runtimes.</Title>
    <CapabilityGrid
      columns={2}
      items={[
        { label: 'Use existing servers', desc: 'Connect to MCP servers for GitHub, databases, browser tools, files, docs, internal APIs, or vendor systems.', accent: palette.green },
        { label: 'Expose Mastra capabilities', desc: 'Publish Mastra tools, agents, and workflows as MCP capabilities for other clients.', accent: palette.blue },
        { label: 'Control trust boundaries', desc: 'Treat remote tools like integration surfaces: validate inputs, limit scopes, and trace every call.', accent: palette.amber },
        { label: 'Prefer typed wrappers', desc: 'Wrap high-risk MCP tools in narrow Mastra tools when the domain needs stronger validation or approvals.', accent: palette.purple },
      ]}
    />
    <div style={{ marginTop: 44 }}>
      <Pipeline
        items={[
          { label: 'Discover', desc: 'List remote tools, resources, and prompts.' },
          { label: 'Select', desc: 'Expose only what the agent needs.' },
          { label: 'Wrap', desc: 'Add schemas, descriptions, approvals, and telemetry.' },
          { label: 'Run', desc: 'Call through Mastra with traceable inputs and outputs.' },
        ]}
      />
    </div>
  </Stage>
);

const RagQuality: Page = () => (
  <Stage index={17}>
    <Eyebrow>06c / Retrieval quality</Eyebrow>
    <Title>RAG quality is mostly won before the model answers.</Title>
    <CapabilityGrid
      columns={2}
      items={[
        { label: 'Chunking', desc: 'Chunk by document structure when possible. Preserve headings, source IDs, dates, and section hierarchy.', accent: palette.green },
        { label: 'Metadata filters', desc: 'Filter by tenant, product, version, policy type, freshness, permissions, and visibility.', accent: palette.blue },
        { label: 'Hybrid retrieval', desc: 'Combine semantic search with keyword or structured filters when exact terms matter.', accent: palette.amber },
        { label: 'Reranking', desc: 'Reorder candidate chunks by relevance before spending context budget.', accent: palette.purple },
        { label: 'Context compression', desc: 'Summarize or trim retrieved material so the model sees the useful parts, not every matching token.', accent: palette.rose },
        { label: 'Grounding scores', desc: 'Score whether the answer is supported by retrieved context and cites the right sources.', accent: palette.cyan },
      ]}
    />
  </Stage>
);

const StorageDeepDive: Page = () => (
  <Stage index={18}>
    <Eyebrow>06d / Storage choices</Eyebrow>
    <Title>Choose storage by lifetime, query pattern, and blast radius.</Title>
    <Row>
      <Card label="Local prototype" title="LibSQL or file-backed state" accent={palette.green} minHeight={270}>
        Best for quick iteration, examples, and local Studio demos. Keep schemas simple and migrations visible.
      </Card>
      <Card label="Production app" title="Postgres-style durability" accent={palette.blue} minHeight={270}>
        Use durable relational storage when threads, workflow state, auth boundaries, and audit trails matter.
      </Card>
      <Card label="Knowledge base" title="Vector store plus metadata" accent={palette.amber} minHeight={270}>
        Pick a vector backend that fits filtering, tenancy, latency, cost, and operational ownership.
      </Card>
    </Row>
    <div style={{ marginTop: 42 }}>
      <Code>{`Rule of thumb:
memory state needs correctness;
retrieval indexes need search quality;
workflow snapshots need resumability;
traces need auditability.`}</Code>
    </div>
  </Stage>
);

const WorkflowImplementation: Page = () => (
  <Stage index={21}>
    <Eyebrow>07c / Workflow implementation</Eyebrow>
    <Title>Workflow steps should be typed, named, and inspectable.</Title>
    <Split
      left={
        <Checklist
          items={[
            { label: 'Give every step one responsibility', desc: 'Classify, retrieve, draft, review, approve, commit, or notify.' },
            { label: 'Pass typed data between steps', desc: 'Use schemas so downstream code knows what exists and what can fail.' },
            { label: 'Carry business state explicitly', desc: 'Return fields like risk, requiresApproval, approvedBy, and status instead of hiding decisions in prose.' },
            { label: 'Suspend at real-world boundaries', desc: 'Approval, payment, manual review, and external callbacks belong in workflow control.' },
          ]}
        />
      }
      right={
        <Code>{`const refundWorkflow = createWorkflow({
  id: 'refund-workflow',
  inputSchema: refundRequestSchema,
})
  .then(classifyRisk)
  .then(gatherOrderContext)
  .branch([
    [needsApproval, requestManagerApproval],
    [isLowRisk, draftRefund],
  ])
  .then(recordOutcome)
  .commit();`}</Code>
      }
    />
  </Stage>
);

const ProcessorExamples: Page = () => (
  <Stage index={25}>
    <Eyebrow>09b / Processor examples</Eyebrow>
    <Title>Processors make policy visible in the runtime.</Title>
    <Pipeline
      items={[
        { label: 'Pre-filter', desc: 'Reject unsupported topics, malformed requests, or forbidden tenants before model spend.', accent: palette.green },
        { label: 'Redact', desc: 'Mask secrets, PII, tokens, account numbers, and internal-only fields.', accent: palette.blue },
        { label: 'Route', desc: 'Choose model, toolset, retrieval index, or workflow path based on request risk.', accent: palette.amber },
        { label: 'Validate', desc: 'Check output schema, citations, tone, policy compliance, and required disclaimers.', accent: palette.purple },
        { label: 'Enrich', desc: 'Attach audit metadata, handoff hints, trace labels, or UI annotations.', accent: palette.rose },
      ]}
    />
    <div style={{ marginTop: 44 }}>
      <CapabilityGrid
        columns={2}
        items={[
          { label: 'Prompt belongs to behavior', desc: 'Use instructions to shape how the agent thinks and responds.' },
          { label: 'Processor belongs to enforcement', desc: 'Use processors when the system must guarantee a behavior outside model discretion.' },
        ]}
      />
    </div>
  </Stage>
);

const ProductionReadiness: Page = () => (
  <Stage index={29}>
    <Eyebrow>12 / Production readiness</Eyebrow>
    <Title>Before launch, make every failure mode observable or bounded.</Title>
    <CapabilityGrid
      columns={2}
      items={[
        { label: 'Tool blast radius', desc: 'Scopes, dry-run modes, approvals, idempotency keys, and audit records for side effects.', accent: palette.green },
        { label: 'Context safety', desc: 'Tenant isolation, permission-aware retrieval, redaction, and memory lifecycle rules.', accent: palette.blue },
        { label: 'Quality gates', desc: 'Scorers, regression datasets, human labels, and release thresholds.', accent: palette.amber },
        { label: 'Operational limits', desc: 'Token budgets, latency budgets, retry policy, fallback models, and escalation paths.', accent: palette.purple },
        { label: 'Debuggability', desc: 'Trace IDs, prompt snapshots, tool arguments, workflow snapshots, and user feedback links.', accent: palette.rose },
        { label: 'Ownership', desc: 'Who reviews failures, updates prompts, changes tools, approves policies, and ships new evals.', accent: palette.cyan },
      ]}
    />
  </Stage>
);

const MasterclassFlow: Page = () => (
  <Stage index={32}>
    <Eyebrow>15 / Recap</Eyebrow>
    <Title>The production path is the takeaway.</Title>
    <CapabilityGrid
      columns={2}
      items={[
        { label: '1. Build the first agent', desc: 'Project, Studio, instructions, model, streaming, and structured output.' },
        { label: '2. Give it safe tools', desc: 'Narrow capabilities, typed schemas, MCP boundaries, and auditable side effects.' },
        { label: '3. Add context', desc: 'Memory, RAG, retrieval quality, and storage matched to lifetime and risk.' },
        { label: '4. Promote process', desc: 'Explicit workflow steps for approval, branching, suspension, replay, and commit.' },
        { label: '5. Harden the runtime', desc: 'Runtime authority, human review, processors, guardrails, and specialists when needed.' },
        { label: '6. Operate and ship', desc: 'Traces, scorers, regression datasets, readiness checks, deployment, and interfaces.' },
      ]}
    />
    <div style={{ marginTop: 48, display: 'flex', gap: 28, fontFamily: font.mono, fontSize: 22 }}>
      <span style={{ color: palette.accent }}>examples/10-mastra-101-masterclass</span>
      <span style={{ color: palette.muted }}>·</span>
      <span style={{ color: palette.accent }}>mastra.ai</span>
      <span style={{ color: palette.muted }}>·</span>
      <span style={{ color: palette.textSoft }}>github.com/mastra-ai/mastra</span>
      <span style={{ color: palette.muted }}>·</span>
      <span style={{ color: palette.textSoft }}>discord.gg/mastra</span>
    </div>
  </Stage>
);

export const meta: SlideMeta = {
  title: 'Mastra 101 Masterclass',
};

// Speaker notes — what to actually say at each slide
// ════════════════════════════════════════════════════════════════════════════
export const notes: (string | undefined)[] = [
  // 01 Cover
  `Open with the concrete build: one support and refund agent that starts useful, then gets hardened until it looks like production software. Say that the session is not a tour of every API surface. The throughline is a common product problem: a customer asks about an order, then asks for a refund, and the system has to answer helpfully without losing policy, authority, or auditability. Set expectations that every layer appears because the prototype runs into a limitation. Transition: first we need a map for deciding which Mastra primitive solves which kind of problem.`,

  // 02 Run of show
  `Use this as the contract for the room. Walk left to right, but do not explain every later section in detail yet. The important promise is that we will not jump randomly between primitives: we start with a working agent, then add safe actions, then context, then business process, then production hardening. A useful phrase: "At each layer, the question is what broke or became risky in the previous layer." Transition: before writing the agent, define the mental model for what Mastra owns around the model.`,

  // 03 Mental model
  `Establish the core claim before naming too many APIs: the model reasons, but the application owns the production guarantees. Use the refund agent as the example. The model can draft a response like "you may be eligible for a refund," but Mastra controls which order data can be read, which tools can run, whether the requester has authority, whether the policy was retrieved, whether approval is required, and what trace is captured. Emphasize that this split prevents prompt text from becoming the entire application architecture. Transition: with that model in mind, map common failures to the primitive that should own them.`,

  // 04 Decision map
  `Frame this as a diagnostic, not a glossary. Ask the audience to imagine the support bot gave a bad refund answer. Was the issue that the model did not reason well, that it lacked an order lookup tool, that it forgot prior customer context, that it retrieved the wrong policy, that the approval path was not deterministic, or that redaction and validation were missing? Each answer points to a different primitive. The main point: if every failure becomes "tune the prompt," the system will become fragile. Transition: now that we know what each primitive is for, put them in a project shape people can navigate.`,

  // 05 Project anatomy
  `Make the file tree part of the story. A production agent project needs clear places for behavior, side effects, workflow state, policy checks, and evals. Point out that src/mastra is the runtime boundary: it is where the app declares what agents, workflows, tools, processors, storage, and scorers exist. This matters for maintenance because a teammate should know where to look when a refund was drafted, blocked, approved, or scored. Transition: once the project has shape, we want the shortest feedback loop for trying the first agent.`,

  // 06 Setup deep dive
  `Move from concept to feedback loop. The key message is that Studio lets you test the agent and workflow before a product UI exists, which keeps debugging close to the runtime. If demoing, open the example project and show the composition root: supportAgent, refundWorkflow, storage, logger, telemetry, and scorers are registered in one place. Call out that boring registration code is a feature. It makes the system inspectable. Transition: with the runtime registered, build the first useful agent.`,

  // 07 Agents
  `Emphasize ownership. An agent should have a job description narrow enough that you could hand it to a person and evaluate the result. In this example, the support agent owns understanding the request, asking for missing information, looking up relevant context through tools, and drafting a clear customer response. It does not own final money movement. That boundary is important because it lets the agent be helpful while keeping authority elsewhere. Transition: once you define the agent, explain the loop it runs every time a user asks for help.`,

  // 08 Agent loop
  `Make the loop tangible. Walk the cycle as a debugger would: what prompt and context were assembled, what decision the model made, what tool was called, what came back, and why the run stopped. Ask the audience: "If this agent tells a customer the wrong refund policy, where would you look first?" Good answers include retrieved context, tool output, instructions, stop conditions, or trace. This slide gives the debug handles for the rest of the talk. Transition: the loop is only as good as the job and output contract we give it.`,

  // 09 Instruction design
  `This is where the first agent becomes reliable enough to exercise. Explain the split: instructions shape behavior, while schemas shape contracts for downstream code. A useful heuristic: every instruction should either define the role, set a boundary, or describe the output shape. Use the refund agent example: "draft but do not submit refunds" can start as an instruction, but if the business depends on it, we will later enforce it with tool boundaries and workflow approval. Transition: after the behavior is defined, we choose how the model runs and how the user sees progress.`,

  // 10 Models and streaming
  `Separate model choice from request authority. Model routing is an engineering choice: which provider and model should handle this kind of work. Runtime context is a business-context choice: who is asking, what tenant they belong to, what role they have, and what limits apply. Streaming is not just polish. For support work, it lets the UI show that the agent is looking up an order, searching policy, drafting a response, or waiting for approval. Transition: the agent can now reason and respond, but it still cannot safely touch real systems without tools.`,

  // 11 Tools and MCP
  `Now the agent needs hands. Tools are where trust becomes concrete: the description tells the model when to use the capability, the schema limits arguments, the executor touches a system, and tracing records what happened. In the refund example, useful tools are things like lookupOrder, searchPolicyKnowledgeBase, draftRefund, and updateTicketStatus. MCP expands the set of systems the agent can reach, but reach is not the same as permission. More reach makes validation, scoping, and auditability more important. Transition: next, show why tool design matters as much as having tools at all.`,

  // 12 Tool design
  `Use a quick contrast: "doEverything" or "sendRefund" sounds convenient until someone asks why it fired. Narrow tools give you readable traces and defensible permissions. Encourage the audience to look for one verb and one resource. lookupOrder is clear. draftRefund is clear. approvalGateAndCommit belongs in a workflow because it combines policy, authority, and side effects. The pattern is: the supportAgent can draft, but refundWorkflow decides whether anything is committed. Transition: after local tools, discuss how MCP fits without dissolving trust boundaries.`,

  // 13 MCP deep dive
  `Position MCP as a connector layer, not a permission model. MCP helps you discover and call tools from other runtimes, or expose Mastra capabilities to other clients. But the application still decides which capabilities this agent should see for this tenant and request. For low-risk read operations, a direct imported MCP tool may be fine. For high-risk actions, wrap the remote capability in a narrower Mastra tool with schemas, approvals, logging, and domain language. Transition: pause here and make the room design the first support agent before adding more layers.`,

  // 14 Checkpoint one
  `Make this an actual pause. Give people 60 seconds to answer four questions: what outcome does the support agent own, which tools does it need, which side effects require approval, and what would make its answer clearly wrong? Then call on one or two answers. Push them to separate "may do" from "may recommend." For example, read orders and draft refunds are allowed actions; submitting money movement is approval-controlled. Transition: the first agent can now act, but it still lacks continuity and grounded policy knowledge.`,

  // 15 Memory and RAG
  `The first agent can answer one turn; now it needs continuity and policy grounding. Clarify the split with a simple rule: memory is what this relationship or thread has learned, while RAG is what the organization already knows elsewhere. If the answer should change because the customer has a preference, prior interaction, or ongoing task, use memory. If the answer should change because the refund policy document changed, use retrieval. In the example, customer history and prior messages are memory; refund policy and order rules are retrieval. Transition: now decide where each kind of fact belongs.`,

  // 16 Memory patterns
  `Use this as a "where should this fact live?" exercise. Give concrete facts: preferred language may belong in working memory; the last twelve messages belong in thread history; a remembered prior refund might be semantic recall; refund policy belongs in the knowledge base; requesterRole and autoRefundLimit belong in runtime context; a PII redaction flag belongs in processor output. The enemy is one giant bucket called context. The right home depends on lifetime, freshness, authority, and who is allowed to change the fact. Transition: after placing facts, improve the quality of the retrieval path.`,

  // 17 RAG quality
  `Make the point that RAG failures often look like model failures. If the wrong policy chunk is retrieved, the model can produce fluent, confident, and wrong text. Walk through the retrieval quality checklist: chunk by document structure, preserve metadata like product and effective date, filter by tenant and policy type, use hybrid search when exact terms matter, rerank before spending context, and score grounding afterward. Encourage teams to inspect retrieval inputs and citations before changing prompts. Transition: retrieval and memory need storage choices that match their consequences.`,

  // 18 Storage deep dive
  `Tie storage to consequences. Local file or LibSQL storage is useful for workshops and prototypes because it is inspectable and fast to reset. Production support systems usually need durable relational storage for threads, workflow snapshots, tenant boundaries, and audit trails. Knowledge bases need vector storage plus metadata filters, and the operational choice depends on latency, cost, tenancy, and who owns the backend. Use the rule of thumb on the slide: memory needs correctness, retrieval needs search quality, workflow snapshots need resumability, and traces need auditability. Transition: now that the agent has context, it hits the hard part: business process.`,

  // 19 Workflows
  `Now the agent hits business process. Frame workflows as the place where the company says, "this is how we do it here." The model may be good at understanding the customer's request, but refund approval rules need to be repeatable, inspectable, resumable, and replayable. If a customer or manager asks why a $240 refund was held, you want workflow state, not just a transcript. Transition: show the pattern for turning fragile prompt checklists into workflow steps.`,

  // 20 Workflow runbook
  `Give the migration pattern: when a prompt instruction starts sounding like a checklist, promote it into workflow steps. Classify the request, gather order and policy context, let the agent draft from bounded context, review risk, then commit or pause. Especially promote approvals, deadlines, compliance language, and side effects. A useful line: "The user asked for a refund" is agentic; "refunds over $100 require manager approval" is workflow logic. Transition: next, show what implementation discipline makes those workflow steps maintainable.`,

  // 21 Workflow implementation
  `Tell people to name workflow steps like audit log entries. Six months later, "approvalGateAndCommit" is more useful than "step3." The deeper lesson is to move business state into fields the system can branch on, not prose the next step has to reinterpret. Fields like risk, requiresApproval, approvedBy, status, and reason make the workflow debuggable and resumable. If you demo code, show gather context, draft decision, and approval gate as separate responsibilities. Transition: workflow logic still needs request-specific authority and human approval.`,

  // 22 Human in the loop
  `State the principle plainly: human review is not an apology for weak models; it is a product requirement for certain actions. Approval should be modeled as state the system can see, resume from, and audit. Runtime context carries facts like requesterRole, tenant, plan, autoRefundLimit, locale, or feature flags. Auth decides whether the requester can start the action. Human review decides whether the side effect can complete. Transition: apply that split to a deliberately uncomfortable refund scenario.`,

  // 23 Checkpoint two
  `Let the room reason through the risky refund. The customer asks for $240, the order exists, policy is ambiguous, there is a prior refund, and the support rep is a contractor. Ask: what should the agent do, what should RAG retrieve, what should runtime context carry, what should the workflow decide, and what should be scored? Then vary the scenario: what if the requester is a manager, the amount is $40, or the prior refund was suspicious? The learning is that the same user message can produce different allowed actions because authority and policy are runtime facts. Transition: after approvals, harden the rest of the runtime.`,

  // 24 Guardrails
  `After workflow, harden the runtime. Use this test: if you would be embarrassed to enforce it only by asking nicely in a prompt, make it runtime behavior. Redaction, routing, validation, retries, topic blocking, token budgets, and required tool usage are engineering concerns. In the refund example, PII should be redacted before model exposure, unsupported topics can be blocked early, and output can be validated for policy language before the customer sees it. Transition: processors are how those runtime policies become composable.`,

  // 25 Processor examples
  `Reinforce the prompt-versus-runtime boundary. A processor is a good fit when the app should behave the same way regardless of the model's mood, token budget, or phrasing. Walk through the examples as production behaviors: pre-filter unsupported or malformed requests, redact secrets and PII, route by risk, validate output, and enrich with audit metadata. Mention that simple processors are often the most valuable because they are cheap and consistent. Transition: sometimes hardening means splitting a broad job across specialists, but do that only when it earns its cost.`,

  // 26 Networks
  `Put multi-agent systems in their proper place: optional scaling architecture, not the default starting point. A network helps when the job has genuinely different expertise, tools, memory, or evaluation criteria. In the support example, a policyReviewer can review the customer-facing recommendation against policy and approval requirements while supportAgent stays focused on the customer conversation. Warn that if roles are not distinct, a network just adds latency and ambiguity. Transition: whether one agent or many, you now need to operate the system.`,

  // 27 Observability
  `Make this operational, not abstract. A final answer rarely tells you why something went wrong; the trace does. In a support incident, you want to know the prompt, retrieved policy, order lookup arguments, tool result, workflow decision, approval state, scorer output, cost, and latency. Use the dashboard numbers as placeholders for the questions an operator asks: are traces complete, are grounding scores dropping, are approvals backing up, is latency acceptable? Transition: once you can observe behavior, turn real traces into repeatable tests.`,

  // 28 Evaluation loop
  `Push back on "we will evaluate later." Later usually means customers supply the dataset the hard way. Start with one painful failure mode: for this system, maybe wrong refund policy, missing approval language, or unsupported answer without citation. Capture traces, label expected outcomes, score the behavior, then gate releases when quality drops. The first scorer does not need to be perfect; it needs to make regressions visible and create a habit of promoting failures into the dataset. Transition: evaluations feed the broader launch checklist.`,

  // 29 Production readiness
  `Present this as a launch review, not a wish list. Pick a scary failure mode, such as an unauthorized refund, leaked PII, wrong policy citation, runaway cost, or untraceable side effect. Ask whether it is prevented, bounded, detected, or merely hoped against. Ownership is part of readiness: someone must know who updates prompts, changes tools, reviews incidents, approves policy changes, and ships new evals. Transition: once the system passes readiness review, ship the same primitives you tested locally.`,

  // 30 Deployment
  `Deployment should not introduce a second mental model. The same agents, workflows, storage, processors, scorers, and telemetry used locally should be the things operated in production. "It worked in Studio" matters only if the production path preserves the same primitives. Call out the deployment options as shapes, not as the main lesson: behind a framework, as a production server, on cloud targets, or on Mastra Server. Transition: after deployment, decide where users will actually interact with the agent.`,

  // 31 Interfaces
  `End the operations section with surfaces. The runtime should be testable before choosing Slack, web, voice, or an internal dashboard. The interface should expose the important runtime states: streaming progress, tool calls, approval requests, citations, fallback paths, and failure states. For a support refund agent, the first production interface might be an internal support console, but the same runtime could later appear in Slack, a customer portal, or voice. Transition: close by turning the whole session back into an implementation sequence.`,

  // 32 Masterclass flow
  `Close by turning the slide into an action plan. Do not build the whole architecture on day one. Start with one narrow agent and one useful workflow through Studio. Add tools when the agent needs hands, add memory and RAG when context matters, promote business rules into workflows, add processors when prompts are carrying enforcement work, and add observability before launch. Point people to examples/10-mastra-101-masterclass, mastra.ai, GitHub, and Discord. Invite questions framed around decomposition: "Tell me one agent you are building, and we can decide which primitive should own each responsibility."`,
];

export default [
  Cover,
  RunOfShow,
  MentalModel,
  DecisionMap,
  ProjectAnatomy,
  SetupDeepDive,
  Agents,
  AgentLoop,
  InstructionDesign,
  ModelsAndStreaming,
  ToolsAndMcp,
  ToolDesign,
  McpDeepDive,
  CheckpointOne,
  MemoryAndRag,
  MemoryPatterns,
  RagQuality,
  StorageDeepDive,
  Workflows,
  WorkflowRunbook,
  WorkflowImplementation,
  HumanInLoop,
  CheckpointTwo,
  Guardrails,
  ProcessorExamples,
  Networks,
  Observability,
  EvaluationLoop,
  ProductionReadiness,
  Deployment,
  Interfaces,
  MasterclassFlow,
] satisfies Page[];
