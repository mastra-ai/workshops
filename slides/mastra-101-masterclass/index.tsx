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

const Stage = ({
  children,
  index,
  section = 'MASTRA 101 MASTERCLASS',
  padding = '112px 120px 120px',
}: {
  children: React.ReactNode;
  index: number;
  section?: string;
  padding?: string;
}) => (
  <div style={{ ...fill, padding, display: 'flex', flexDirection: 'column' }}>
    <Grid />
    <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>
    <Footer index={index} section={section} />
  </div>
);

const Grid = () => (
  <div
    aria-hidden
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage:
        `linear-gradient(${palette.border} 1px, transparent 1px), ` +
        `linear-gradient(90deg, ${palette.border} 1px, transparent 1px)`,
      backgroundSize: '96px 96px',
      opacity: 0.25,
    }}
  />
);

const Footer = ({ index, section }: { index: number; section: string }) => (
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
    <span>{section}</span>
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
        A practical tour of Mastra's TypeScript primitives: agents, tools, memory, workflows, guardrails,
        observability, and deployment.
      </Subtitle>
      <div style={{ marginTop: 56, display: 'flex', gap: 22, maxWidth: 1420 }}>
        {['Understand the primitives', 'Compose reliable systems', 'Operate in production'].map((label, index) => (
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
    <Eyebrow>00 / Agenda</Eyebrow>
    <Title>This is a masterclass, not a lightning tour.</Title>
    <Timeline
      items={[
        { phase: 'Part 1', label: 'Frame the system', desc: 'What Mastra is, what it replaces, and the mental model for the rest of the session.', accent: palette.green },
        { phase: 'Part 2', label: 'Build the core agent', desc: 'Project anatomy, agent contract, model routing, streaming, tools, and MCP.', accent: palette.blue },
        { phase: 'Part 3', label: 'Add state and orchestration', desc: 'Memory, RAG, workflows, snapshots, suspend/resume, and human review.', accent: palette.amber },
        { phase: 'Part 4', label: 'Scale the architecture', desc: 'Runtime context, auth, multi-agent networks, processors, and guardrails.', accent: palette.purple },
        { phase: 'Part 5', label: 'Operate it', desc: 'Observability, scorers, interfaces, deployment, and production readiness.', accent: palette.rose },
        { phase: 'Part 6', label: 'Wrap and questions', desc: 'Recap the build path and open the floor for discussion.', accent: palette.cyan },
      ]}
    />
  </Stage>
);

const MentalModel: Page = () => (
  <Stage index={3}>
    <Eyebrow>01 / Mental model</Eyebrow>
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
    <CapabilityGrid
      columns={2}
      items={[
        { label: 'Agent', desc: 'Use when the steps are unknown and the model should decide what to do next.', accent: palette.green },
        { label: 'Tool', desc: 'Use when an agent or workflow needs a typed capability with side effects.', accent: palette.blue },
        { label: 'Memory', desc: 'Use when the app must remember user, thread, or session state across turns.', accent: palette.amber },
        { label: 'RAG', desc: 'Use when the answer depends on external knowledge that should be retrieved at runtime.', accent: palette.purple },
        { label: 'Workflow', desc: 'Use when the path must be repeatable, auditable, resumable, or partly deterministic.', accent: palette.rose },
        { label: 'Processor', desc: 'Use when prompt text should not be responsible for validation, redaction, routing, or retries.', accent: palette.cyan },
      ]}
    />
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
  <Stage index={6}>
    <Eyebrow>03 / Agents</Eyebrow>
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
  <Stage index={7}>
    <Eyebrow>03b / The agent loop</Eyebrow>
    <Title>An agent run is a loop with observable state.</Title>
    <Pipeline
      items={[
        { label: 'Prompt', desc: 'Instructions, runtime context, memory, tools, and user input become the model call.', accent: palette.green },
        { label: 'Decide', desc: 'The model either answers, calls a tool, asks for structure, or continues reasoning.', accent: palette.blue },
        { label: 'Act', desc: 'Mastra validates tool inputs, executes, captures outputs, and feeds results back.', accent: palette.amber },
        { label: 'Stop', desc: 'The run ends on final output, configured limits, approval gates, errors, or workflow control.', accent: palette.purple },
      ]}
    />
    <div style={{ marginTop: 44 }}>
      <Checklist
        items={[
          { label: 'What can it do?', desc: 'Tools and MCP define the reachable world.' },
          { label: 'What does it know?', desc: 'Instructions, memory, runtime context, and retrieval define context.' },
          { label: 'How do we trust it?', desc: 'Schemas, processors, approvals, traces, and scorers define control.' },
        ]}
      />
    </div>
  </Stage>
);

const ModelsAndStreaming: Page = () => (
  <Stage index={8}>
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
  <Stage index={9}>
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
  <Stage index={10}>
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
      <Card label="Best" title="Separate plan from commit" accent={palette.blue} minHeight={250}>
        Let the model propose actions, then require workflow logic or approval before money, messages, or data changes.
      </Card>
    </Row>
    <div style={{ marginTop: 40 }}>
      <Code>{`description: 'Create a draft refund. Does not submit it.'
inputSchema: z.object({
  orderId: z.string(),
  amountCents: z.number().int().positive(),
  reason: z.string().min(10),
})`}</Code>
    </div>
  </Stage>
);

const CheckpointOne: Page = () => (
  <Stage index={11}>
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
  <Stage index={12}>
    <Eyebrow>06 / Memory and RAG</Eyebrow>
    <Title>Agents need two different context systems.</Title>
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
  <Stage index={13}>
    <Eyebrow>06b / Context architecture</Eyebrow>
    <Title>Do not put every fact in the same bucket.</Title>
    <CapabilityGrid
      columns={2}
      items={[
        { label: 'Thread history', desc: 'What happened in this conversation and what the user already said.', accent: palette.green },
        { label: 'Working memory', desc: 'Durable profile facts, preferences, and current task state.', accent: palette.blue },
        { label: 'Semantic recall', desc: 'Relevant past messages retrieved by meaning, not just recency.', accent: palette.amber },
        { label: 'Knowledge base', desc: 'External docs, tickets, policies, code, records, and files retrieved through RAG.', accent: palette.purple },
        { label: 'Runtime context', desc: 'Request-specific identity, permissions, tenant, plan, locale, and feature flags.', accent: palette.rose },
        { label: 'Processor output', desc: 'Redactions, context trimming, metadata, route decisions, and validation state.', accent: palette.cyan },
      ]}
    />
  </Stage>
);

const Workflows: Page = () => (
  <Stage index={14}>
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
  <Stage index={15}>
    <Eyebrow>07b / Workflow runbook</Eyebrow>
    <Title>Promote brittle prompt steps into workflow steps.</Title>
    <Pipeline
      items={[
        { label: 'Classify', desc: 'Deterministic code or a small model labels request type and required policy.', accent: palette.green },
        { label: 'Gather', desc: 'Tools retrieve orders, docs, memory, permissions, and account state.', accent: palette.blue },
        { label: 'Draft', desc: 'Agent proposes an answer or action from bounded context.', accent: palette.amber },
        { label: 'Review', desc: 'Scorer, processor, or human checks risk before commit.', accent: palette.purple },
        { label: 'Commit', desc: 'Tool writes data, sends message, updates ticket, and logs trace metadata.', accent: palette.rose },
      ]}
    />
    <div style={{ marginTop: 44 }}>
      <Code>{`Good workflow boundary:
"The user asked for a refund" is agentic.
"Refunds over $100 require manager approval" is workflow logic.`}</Code>
    </div>
  </Stage>
);

const HumanInLoop: Page = () => (
  <Stage index={16}>
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
  <Stage index={17}>
    <Eyebrow>Checkpoint 2</Eyebrow>
    <Title>Turn the support agent into a reliable system.</Title>
    <Row>
      <Card label="Scenario" title="Customer asks for a $240 refund" accent={palette.amber} minHeight={260}>
        The order exists, policy is ambiguous, the customer has a prior refund, and the support rep is a contractor.
      </Card>
      <Card label="Question" title="Where does control live?" accent={palette.blue} minHeight={260}>
        Decide which parts belong in agent instructions, runtime context, RAG, workflow branches, processors, approval,
        and scorers.
      </Card>
      <Card label="Expected answer" title="Model proposes, system disposes" accent={palette.green} minHeight={260}>
        The model can draft the recommendation. Workflow, auth, policy, and approval decide what actually happens.
      </Card>
    </Row>
  </Stage>
);

const Networks: Page = () => (
  <Stage index={18}>
    <Eyebrow>09 / Multi-agent systems</Eyebrow>
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
  <Stage index={19}>
    <Eyebrow>10 / Processors and guardrails</Eyebrow>
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
  <Stage index={20}>
    <Eyebrow>11 / Observability and scorers</Eyebrow>
    <Split
      left={
        <>
          <Title>Agent quality is a production signal.</Title>
          <Subtitle>
            Mastra captures the path, not only the final text: model calls, prompts, completions, tool calls, memory
            operations, tokens, latency, cost, errors, and scorer results.
          </Subtitle>
        </>
      }
      right={
        <CapabilityGrid
          columns={2}
          items={[
            { label: 'Logs', desc: 'Persistent run records for agents and workflows.', accent: palette.green },
            { label: 'Tracing', desc: 'Decision paths, spans, timing, inputs, and outputs.', accent: palette.blue },
            { label: 'OTel export', desc: 'Send telemetry to OpenTelemetry-compatible platforms.', accent: palette.amber },
            { label: 'Scorers', desc: 'Run model-graded, rule-based, or statistical checks asynchronously.', accent: palette.purple },
            { label: 'Datasets', desc: 'Turn traces and examples into repeatable quality tests.', accent: palette.rose },
            { label: 'CI', desc: 'Catch regressions before deploy instead of reading logs after.', accent: palette.cyan },
          ]}
        />
      }
    />
  </Stage>
);

const EvaluationLoop: Page = () => (
  <Stage index={21}>
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
  <Stage index={22}>
    <Eyebrow>12 / Interfaces and modalities</Eyebrow>
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
  <Stage index={23}>
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
  <Stage index={24}>
    <Eyebrow>Deep dive / Setup and Studio</Eyebrow>
    <Title>Start with the fastest loop: code, Studio, trace, repeat.</Title>
    <Split
      left={
        <Checklist
          items={[
            { label: 'Bootstrap the app', desc: 'Create the Mastra project and keep all runtime primitives under `src/mastra`.' },
            { label: 'Register primitives', desc: '`new Mastra()` is the composition root for agents, workflows, storage, telemetry, and server behavior.' },
            { label: 'Use Studio early', desc: 'Inspect prompts, tool calls, memory, workflow runs, traces, and response shape before wiring a production UI.' },
            { label: 'Keep examples runnable', desc: 'A masterclass works best when every concept maps to a small local example.' },
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
  <Stage index={25}>
    <Eyebrow>Deep dive / Instructions and output</Eyebrow>
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
  <Stage index={26}>
    <Eyebrow>Deep dive / MCP architecture</Eyebrow>
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
  <Stage index={27}>
    <Eyebrow>Deep dive / Retrieval quality</Eyebrow>
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
  <Stage index={28}>
    <Eyebrow>Deep dive / Storage choices</Eyebrow>
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
  <Stage index={29}>
    <Eyebrow>Deep dive / Workflow implementation</Eyebrow>
    <Title>Workflow steps should be typed, named, and inspectable.</Title>
    <Split
      left={
        <Checklist
          items={[
            { label: 'Give every step one responsibility', desc: 'Classify, retrieve, draft, review, approve, commit, or notify.' },
            { label: 'Pass typed data between steps', desc: 'Use schemas so downstream code knows what exists and what can fail.' },
            { label: 'Snapshot important state', desc: 'Store enough context to replay, resume, explain, or debug the run.' },
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
  <Stage index={30}>
    <Eyebrow>Deep dive / Processor examples</Eyebrow>
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
  <Stage index={31}>
    <Eyebrow>Deep dive / Production readiness</Eyebrow>
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
    <Eyebrow>14 / The masterclass build</Eyebrow>
    <Title>By the end, the system should look like production software.</Title>
    <CapabilityGrid
      columns={2}
      items={[
        { label: '1. Start with one agent', desc: 'Instructions, model, typed tools, and streaming response.' },
        { label: '2. Add memory and retrieval', desc: 'Persistent user context plus grounded external knowledge.' },
        { label: '3. Promote process into workflows', desc: 'Explicit steps for approvals, branching, retries, and replay.' },
        { label: '4. Add specialists', desc: 'Supervisor and reviewer agents when one prompt becomes too broad.' },
        { label: '5. Harden the loop', desc: 'Processors, auth, runtime context, guardrails, and human-in-the-loop gates.' },
        { label: '6. Operate it', desc: 'Studio, traces, scorers, deployment, and a regression suite.' },
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

export const notes: (string | undefined)[] = [
  `Set expectations: this is not a feature dump. It is a mental model plus practical build path for a real Mastra app.`,
  `Walk through the agenda. Tell the room there are two checkpoints where they will design pieces of the system before seeing the production pattern.`,
  `Mastra is the app runtime around a model. The core story is reason, act, remember, control, and operate. Use this framing throughout the talk.`,
  `Give the primitive decision map. The goal is to reduce confusion later: agents decide, tools act, memory remembers, RAG retrieves, workflows orchestrate, processors control.`,
  `Show the project anatomy in this repo. Point out that examples follow the same pattern: src/mastra/index.ts plus folders for agents, tools, workflows, processors, and scorers.`,
  `Agents are for open-ended work. The model decides tool usage and loop count. Emphasize that instructions, tools, memory, model, and scorers are all part of the agent contract.`,
  `Explain the loop: prompt, decide, act, stop. Keep this concrete; every future production concern plugs into one of those four points.`,
  `A production agent should not be coupled to one model. Talk through model routing, streaming, runtime context, and cost-aware model selection.`,
  `Tools are where side effects happen. Schema validation and narrow descriptions matter because they are the contract between model reasoning and the outside world. MCP is the interoperability layer.`,
  `Tool design rules: narrow verbs, explicit schemas, no broad side-effect tools. Separate draft tools from commit tools when risk is meaningful.`,
  `Checkpoint 1. Ask the audience to classify pieces of the support agent system, then resolve using the primitive map.`,
  `Separate memory from RAG. Memory remembers interactions and users. RAG retrieves external knowledge. They often work together, but they solve different problems.`,
  `Context architecture slide. Make clear that thread history, working memory, semantic recall, RAG, runtime context, and processor output have different lifetimes and trust levels.`,
  `Workflows are for reliable, auditable processes. Agents decide; workflows orchestrate. Use workflows when order, branching, replay, or approval matters.`,
  `Promote brittle prompt logic into workflow steps. Use the refund example to show the difference between agentic recommendation and deterministic business rule.`,
  `Runtime context and auth make the same agent behave differently for different users. Human-in-the-loop gates are how you keep sensitive side effects under control.`,
  `Checkpoint 2. Ask where control belongs for a high-risk refund. The key answer: model proposes, workflow/auth/policy/approval decide.`,
  `Networks are useful when a task has real specialist boundaries. Add specialists when separation improves quality or control.`,
  `Processors are the control points around the model loop and are better than prompt-only guardrails for redaction, validation, retries, cost control, and compliance.`,
  `Observability must include quality, not only uptime. Walk through traces, logs, scorers, and CI as the production feedback loop.`,
  `Turn traces into eval datasets. Pick one important metric first, sample intentionally, and promote production failures into regression tests.`,
  `Mastra can serve normal APIs, streaming UIs, voice apps, browser agents, and workspace-heavy agents. The framework is not tied to a single UI.`,
  `Deployment should preserve the exact primitives tested locally. Discuss production server, framework integration, cloud providers, Mastra Server, and ongoing operations.`,
  `Deep dive: show how the composition root ties the runtime together. Emphasize Studio as the shortest debugging loop before there is a polished application UI.`,
  `Deep dive: instructions are not the only contract. Use schemas when the next piece of code needs reliable shape, enums, fields, or review signals.`,
  `Deep dive: MCP is interoperability, but it does not remove the need for trust boundaries. Narrow high-risk tools and trace every external call.`,
  `Deep dive: RAG quality depends on chunking, metadata, retrieval, reranking, compression, and grounding. The answer model is only the last stage.`,
  `Deep dive: storage choices should follow the data's job. Memory, vectors, workflow snapshots, and traces have different correctness and query requirements.`,
  `Deep dive: workflows are easier to debug when each step is named, typed, and responsible for one thing. Suspension belongs at real-world handoff points.`,
  `Deep dive: processors are runtime enforcement. Give concrete examples of redaction, routing, validation, enrichment, and policy enforcement.`,
  `Deep dive: production readiness means bounding failure modes. Walk through blast radius, context safety, quality gates, limits, debug data, and ownership.`,
  `Final recap. Close with the masterclass build order. This is the practical path: one agent, then memory/RAG, workflows, specialists, guardrails, and production telemetry.`,
];

export default [
  Cover,
  RunOfShow,
  MentalModel,
  DecisionMap,
  ProjectAnatomy,
  Agents,
  AgentLoop,
  ModelsAndStreaming,
  ToolsAndMcp,
  ToolDesign,
  CheckpointOne,
  MemoryAndRag,
  MemoryPatterns,
  Workflows,
  WorkflowRunbook,
  HumanInLoop,
  CheckpointTwo,
  Networks,
  Guardrails,
  Observability,
  EvaluationLoop,
  Interfaces,
  Deployment,
  SetupDeepDive,
  InstructionDesign,
  McpDeepDive,
  RagQuality,
  StorageDeepDive,
  WorkflowImplementation,
  ProcessorExamples,
  ProductionReadiness,
  MasterclassFlow,
] satisfies Page[];
