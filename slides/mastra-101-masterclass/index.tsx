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

// Speaker notes — what to actually say at each slide
// ════════════════════════════════════════════════════════════════════════════
export const notes: (string | undefined)[] = [
  // 01 Cover
  `Welcome. This is Mastra 101, but the goal is not to memorize a catalog of APIs. The goal is to leave with a mental model for building an agent application that can actually ship. The three promises on the slide are the arc: understand the primitives, compose reliable systems, and operate them in production. We'll keep coming back to examples/10-mastra-101-masterclass, a TechMart support and refund system, because production agents are not just model responses. They are tools, memory, workflows, guardrails, observability, and deployment wrapped around a model.`,

  // 02 Run of show
  `Here's the path for the session. Part one frames the system: what Mastra is, what it replaces, and the mental model. Part two builds the core agent: project anatomy, the agent contract, model routing, streaming, tools, and MCP. Part three adds state and orchestration: memory, RAG, workflows, snapshots, suspend and resume, and human review. Part four scales the architecture with runtime context, auth, multi-agent networks, processors, and guardrails. Part five is operating it with observability, scorers, interfaces, deployment, and production readiness. Then we wrap and take questions. The checkpoints are placed before the answers because decomposition is the real skill.`,

  // 03 Mental model
  `The simplest way to think about Mastra is this: the model reasons, but the application still has work to do. Reason means models generate, stream, call tools, and produce structured output. Act means tools, MCP, browsers, voice, and custom integrations touch the outside world. Remember means memory, storage, semantic recall, and RAG keep context available. Control means workflows, processors, auth, approvals, and runtime context shape execution. Operate means Studio, logs, traces, scorers, and deployment close the production loop. In the example project, supportAgent reasons, order and policy tools act, Memory plus LibSQL remember, refundWorkflow controls, and observability plus scorers operate it.`,

  // 04 Decision map
  `The fastest way to get confused with agent frameworks is to use every primitive for every job. Give each primitive a clear job. Use an agent when the steps are unknown and the model should decide what to do next. Use a tool when an agent or workflow needs a typed capability with side effects. Use memory when user, thread, or session state must survive across turns. Use RAG when the answer depends on external knowledge retrieved at runtime. Use a workflow when the path must be repeatable, auditable, resumable, or partly deterministic. Use a processor when prompt text should not be responsible for validation, redaction, routing, or retries. In the support example, supportAgent answers and drafts, order-tools.ts wraps side effects, memory tracks the customer, policy-tools.ts handles retrieval, refund-workflow.ts controls submission, and processors enforce PII and response metadata.`,

  // 05 Project anatomy
  `This is the shape of a Mastra application. src/mastra is the composition boundary: it is where the runtime learns what it can serve and observe. The entry point, index.ts, calls new Mastra() and wires agents, workflows, storage, vectors, loggers, telemetry, and server behavior. The modules stay separate: agents hold instructions and models, tools wrap typed side effects, workflows define controlled processes, processors are input and output control points, and scorers are quality checks. Studio is the fast feedback loop: test prompts, inspect tool calls, run workflows, and iterate before building the UI. examples/10-mastra-101-masterclass follows this exact tree.`,

  // 06 Agents
  `Use agents when the path is open-ended. An agent owns the goal, instructions, model, tools, memory, processors, scorers, and stop conditions. The slide shows the shape: id, name, instructions, model, tools, memory, and scorers. Agents can generate a full response, stream tokens and events while tools are resolving, or return structured output when the app needs data instead of prose. In examples/10-mastra-101-masterclass, support-agent.ts uses openai/gpt-5.2, lookupOrder, searchPolicyKnowledgeBase, draftRefund, updateTicketStatus, Memory, PIIRedactor, SupportResponseFooter, and two scorers. It can draft a refund, but it cannot submit money movement directly.`,

  // 07 Agent loop
  `Every run is a loop with observable state. Prompt means instructions, runtime context, memory, tools, retrieval, and user input become the model call. Decide means the model either answers, calls a tool, asks for structured output, or continues reasoning. Act means Mastra validates tool inputs, executes, captures outputs, and feeds results back. Stop means final output, configured limits, approval gates, errors, or workflow control end the run. The three questions are the production checklist: what can it do, what does it know, and how do we trust it? In supportAgent, maxSteps is 8, tools define the reachable world, memory and policy retrieval define context, and schemas, processors, approvals, traces, and scorers define control.`,

  // 08 Models and streaming
  `Model choice should be swappable, while behavior stays typed. Model router means you reference provider/name and can change models without rewriting agent code. Provider breadth means the same app shape can use OpenAI, Anthropic, Google, Groq, Mistral, xAI, local providers, and more. Streaming events matter because the UI can show text, tool calls, workflow progress, and custom UI events while work is still resolving. Runtime context injects user, tenant, plan, auth, locale, or feature flags per request; the code sample shows tenantId and role. Cost control is routing simple steps to smaller models and saving larger models for hard reasoning. Fallback patterns keep the app stable while you experiment with model quality. In the example, supportAgent pins a default model, while refundWorkflow takes requesterRole and autoRefundLimitCents as runtime authority instead of burying those rules in a prompt.`,

  // 09 Tools and MCP
  `Tools are the boundary between reasoning and action. Describe means give the model a precise capability and when to use it. Validate means use Zod schemas to constrain inputs before side effects run. Execute means the tool can call APIs, databases, browsers, filesystems, or internal services. Observe means trace arguments, results, latency, errors, and approvals. MCP adds interoperability: MCPClient pulls tools, resources, and prompts from existing MCP servers, while MCPServer exposes Mastra tools, workflows, and agents to external clients. In the example project, order-tools.ts implements lookup_order, draft_refund, and update_ticket_status; policy-tools.ts implements search_policy_knowledge_base with input and output schemas.`,

  // 10 Tool design
  `Tool design is where a lot of production quality comes from. doEverything is bad because broad tools hide intent, make traces useless, increase blast radius, and force the model to invent implicit arguments. Better is one verb and one resource: lookupOrder, draftRefund, sendApprovalRequest, updateTicketStatus. The project uses that better pattern for draftRefund. The best example is the repo boundary shown here: supportAgent.tools includes draftRefund, but it does not include approvalGateAndCommit or submitRefund. refundWorkflow chains gatherContext, draftRefundDecision, and approvalGateAndCommit. That final step checks policy and approval state, then either submits the refund or leaves the ticket waiting on approval.`,

  // 11 Checkpoint one
  `Let's classify the support system before we look at the full implementation. Name the job: the support agent owns resolving customer issues clearly. List allowed actions: read orders, draft refunds, update tickets, and answer policy questions; side effects like money movement need approval. Choose context sources: prompt context handles the immediate request, memory handles customer continuity, RAG handles policy docs, and runtime context handles authority. Define the first score: what would make the response clearly good or clearly wrong? In the example project, that maps to supportCompletenessScorer and policyGroundingScorer.`,

  // 12 Memory and RAG
  `Agents need three related pieces: context, knowledge, and durable state. Memory is conversation state: threads, resources, working memory, conversation history, semantic recall, and memory processors keep user context available across turns and sessions. RAG is knowledge retrieval: ingest docs, HTML, markdown, JSON, PDFs, or domain records; index by chunking, embedding, metadata, and vector upsert; retrieve with query, filters, hybrid search, reranking, and compression; then answer with grounding and faithfulness scoring. Storage is the durable backend: LibSQL, Postgres, Upstash, DynamoDB, Cloudflare stores, plus vector backends like PgVector, Pinecone, Qdrant, Chroma, and MongoDB. The example uses LibSQLStore and LibSQLVector, working memory on supportAgent, and search_policy_knowledge_base over local policyDocuments.`,

  // 13 Memory patterns
  `Do not put every fact in the same bucket. Thread history is what happened in this conversation and what the user already said. Working memory is durable profile facts, preferences, and current task state. Semantic recall retrieves relevant past messages by meaning, not just recency. The knowledge base is external docs, tickets, policies, code, records, and files retrieved through RAG. Runtime context carries identity, permissions, tenant, plan, locale, and feature flags for this request. Processor output carries redactions, context trimming, metadata, route decisions, and validation state. In support-agent.ts, lastMessages is 12, working memory has a support template, semantic recall turns on when OPENAI_API_KEY is present, and PIIRedactor output is part of the context story.`,

  // 14 Workflows
  `Use workflows when the process must be repeatable. Workflows turn agentic systems into explicit execution graphs with typed steps, deterministic code, agents, tools, branches, loops, snapshots, suspension, and replay. Sequential is step.then(nextStep) for clear process order. Parallel runs independent steps together. Branch routes by condition, input, tool output, or score. Loop repeats until quality, budget, or state criteria are met. Suspend pauses for approval, payment, review, or external events. Replay debugs from snapshots with the same original context. The example refundWorkflow is intentionally simple and sequential: gather-refund-context, draft-refund-decision, approval-gate-and-commit.`,

  // 15 Workflow runbook
  `Promote brittle prompt steps into workflow steps. Classify means deterministic code or a small model labels the request type and required policy. Gather means tools retrieve orders, docs, memory, permissions, and account state. Draft means an agent or tool proposes an answer or action from bounded context. Review means a scorer, processor, or human checks risk before commit. Commit means a tool writes data, sends the message, updates the ticket, and logs trace metadata. The rule of thumb is on the slide: "the user asked for a refund" is agentic, but "refunds over $100 require manager approval" is workflow logic. In refund-workflow.ts, gatherContext loads order and policy notes, draftRefundDecision creates the draft and risk classification, and approvalGateAndCommit submits or leaves the ticket waiting on approval.`,

  // 16 Human in the loop
  `Production agents need per-request authority. Runtime context is dynamic behavior: identity, permissions, tenant settings, budget, feature flags, locale, and request metadata enter the agent or workflow at runtime. Auth is access control: JWT, Clerk, Supabase, Firebase, WorkOS, Auth0, or your own middleware can sit before execution. Human review controls side effects: suspend workflows or require approval before spending money, sending messages, deleting data, or escalating. The code pattern is the point: let the model recommend, but let the workflow decide. In refundWorkflow, requesterRole, autoRefundLimitCents, and approvedBy decide whether a refund is submitted or waits for manager approval.`,

  // 17 Checkpoint two
  `This checkpoint is about separating recommendation from authority. A customer asks for a $240 refund. The order exists, policy is ambiguous, there is a prior refund, and the support rep is a contractor. The agent's job is to draft a helpful customer-facing recommendation, not to decide whether money moves. RAG retrieves the refund policy and prior-refund rules. Runtime context carries requesterRole=contractor and the auto-refund limit. The workflow applies the approval rules and chooses submitted versus waiting-on-approval. Scorers and processors check grounding, required approval language, and response safety. In the example project, this is exactly why supportAgent can draft, but refundWorkflow owns approvalGateAndCommit.`,

  // 18 Networks
  `Networks split broad tasks into specialist roles. A supervisor understands the goal, delegates, reconciles, and decides when to stop. Specialists are focused agents with narrow instructions, tools, memory, and eval criteria. Shared state means runtime context, memory, traces, and workflow state make handoffs explicit. A reviewer is a separate agent or scorer that checks quality before the user sees the output. This is a scaling pattern, not a default. In examples/10-mastra-101-masterclass, policyReviewer is the specialist: it reviews support recommendations against policy and approval requirements, while supportAgent remains the customer-facing agent.`,

  // 19 Guardrails
  `Do not ask prompts to do infrastructure work. Input processors normalize, redact, block, trim, enrich, or route before the model sees the message. The agent loop is where the model reasons, calls tools, observes results, and decides the next step. Output processors validate, transform, redact, retry, abort, or attach metadata before responding. Safety includes PII filtering, topic blocking, prompt-injection checks, and policy enforcement. Reliability includes response validation, retries, answer length limits, and required tool usage. Cost includes context pruning, model routing, token budgets, and escalation detection. In this example, PIIRedactor is the input processor and SupportResponseFooter is the output processor.`,

  // 20 Observability
  `Agent quality is a production signal, so observability has to capture the path, not only the final text. That means model calls, prompts, completions, tool calls, memory operations, tokens, latency, cost, errors, and scorer results. Logs are persistent run records for agents and workflows. Tracing gives decision paths, spans, timing, inputs, and outputs. OTel export sends telemetry to OpenTelemetry-compatible platforms. Scorers run model-graded, rule-based, or statistical checks asynchronously. Datasets turn traces and examples into repeatable tests. CI catches regressions before deploy. In index.ts, the example registers PinoLogger, Observability, DefaultExporter, SensitiveDataFilter, and both support scorers.`,

  // 21 Evaluation loop
  `Turn production traces into regression tests. Trace means capture real prompts, tool calls, retrieved context, latency, cost, and outputs. Label means collect human labels, policy outcomes, bug reports, and known-good examples. Score means run relevance, faithfulness, completeness, toxicity, custom rules, or LLM judges. Gate means fail CI or block rollout when quality drops below the threshold. Start with one metric: pick the failure that would hurt users first. Sample deliberately: score high-risk paths more often than low-risk chat. Keep examples fresh: promote real failures into the next regression set. The example includes supportCompletenessScorer and policyGroundingScorer as first concrete gates for the refund domain.`,

  // 22 Interfaces
  `Mastra apps can meet users where the work happens. REST and client SDK expose registered agents, tools, workflows, memory, vectors, logs, and telemetry. Web frameworks include Next.js, SvelteKit, Vite/React, Astro, Express, and standard server adapters. Agentic UIs can pair streaming agents with Vercel AI SDK, CopilotKit, Assistant UI, Cedar-OS, and OpenRouter flows. Voice adds text-to-speech, speech-to-text, and real-time speech-to-speech providers. Browser actions help with sites where APIs are missing or incomplete. Workspaces give agents filesystems, sandboxed execution, and reusable skills for coding or document-heavy work. The example is UI-light on purpose: Studio can exercise supportAgent and refundWorkflow before any product surface is chosen.`,

  // 23 Deployment
  `Ship the same primitives you tested locally. Local Studio is for prototyping, running, tracing, and tuning with fast feedback. The production server exposes agents and workflows as APIs with middleware, auth, and storage. Cloud targets include providers like AWS, Azure, DigitalOcean, and framework hosts. Mastra Server gives managed routing, scaling, telemetry, and endpoints for agent deployment. Operate means monitoring traces, cost, latency, scorer drift, and user feedback after launch. The example already behaves like a small service: index.ts registers server port 4111, persistent storage, telemetry, agents, workflows, and scorers.`,

  // 24 Setup deep dive
  `Start with the fastest loop: code, Studio, trace, repeat. Bootstrap the app and keep runtime primitives under src/mastra. Register primitives with new Mastra(); that is the composition root for agents, workflows, storage, telemetry, and server behavior. Use Studio early to inspect prompts, tool calls, memory, workflow runs, traces, and response shape before wiring a production UI. Then hit the generated API endpoints directly, because the system has to work outside Studio too. In examples/10-mastra-101-masterclass/src/mastra/index.ts, you can see supportAgent, policyReviewer, refundWorkflow, storage, logger, observability, scorers, and the server config all registered in one place.`,

  // 25 Instruction design
  `Instructions define behavior; schemas define contracts. Role is the job: responsibility, audience, tone, and success criteria. Rules are what must never happen: put policy boundaries in instructions, but enforce critical boundaries with tools, workflows, processors, and auth. Shape is what the app needs: fields, enums, confidence, citations, and action plans belong in structured output. The triageSchema on the slide shows category, priority, needsHumanReview, and summary. In support-agent.ts, the instructions say to look up orders, search policy, draft but not submit refunds, explain approval needs, and avoid inventing missing information; in refund-workflow.ts, Zod schemas validate order IDs, amounts, roles, risk, status, and approval requirements.`,

  // 26 MCP deep dive
  `MCP lets your agent runtime plug into other runtimes. Use existing servers to connect to GitHub, databases, browser tools, files, docs, internal APIs, or vendor systems. Expose Mastra capabilities by publishing tools, agents, and workflows as MCP capabilities for other clients. Control trust boundaries: treat remote tools like integration surfaces, validate inputs, limit scopes, and trace every call. Prefer typed wrappers for high-risk MCP tools when the domain needs stronger validation or approvals. The operational flow is discover, select, wrap, run: list remote tools and resources, expose only what the agent needs, add schemas and telemetry, then call through Mastra with traceable inputs and outputs. The follow-along keeps tools local so it is easy to run, but lookupOrder and searchPolicyKnowledgeBase are shaped the way MCP-backed tools should be wrapped.`,

  // 27 RAG quality
  `RAG quality is mostly won before the model answers. Chunking should follow document structure when possible and preserve headings, source IDs, dates, and hierarchy. Metadata filters enforce tenant, product, version, policy type, freshness, permissions, and visibility. Hybrid retrieval combines semantic search with keyword or structured filters when exact terms matter. Reranking reorders candidate chunks before spending context budget. Context compression summarizes or trims retrieved material so the model sees useful parts, not every matching token. Grounding scores check whether the answer is supported by retrieved context and cites the right sources. search_policy_knowledge_base is a small transparent version of this: it accepts query, tags, and topK, scores matching policyDocuments, and returns structured results for the agent.`,

  // 28 Storage deep dive
  `Choose storage by lifetime, query pattern, and blast radius. Local prototypes can use LibSQL or file-backed state for quick iteration, examples, and local Studio demos. Production apps usually need Postgres-style durability when threads, workflow state, auth boundaries, and audit trails matter. Knowledge bases need a vector store plus metadata, chosen around filtering, tenancy, latency, cost, and operational ownership. The rule of thumb is direct: memory state needs correctness, retrieval indexes need search quality, workflow snapshots need resumability, and traces need auditability. In storage.ts, the example uses LibSQLStore and LibSQLVector against file:./mastra-101.db so the masterclass is local and inspectable.`,

  // 29 Workflow implementation
  `Workflow steps should be typed, named, and inspectable. Give every step one responsibility: classify, retrieve, draft, review, approve, commit, or notify. Pass typed data between steps with schemas so downstream code knows what exists and what can fail. Carry business state explicitly: return fields like risk, requiresApproval, approvedBy, and status instead of hiding decisions in prose. Suspend at real-world boundaries like approval, payment, manual review, and external callbacks. The code on the slide shows the richer API shape: createWorkflow, inputSchema, then, branch, and commit. The actual example keeps the refund flow compact: gather-refund-context loads order and policy state, draft-refund-decision creates a risk-classified draft, and approval-gate-and-commit submits or waits.`,

  // 30 Processor examples
  `Processors make policy visible in the runtime. Pre-filter rejects unsupported topics, malformed requests, or forbidden tenants before model spend. Redact masks secrets, PII, tokens, account numbers, and internal-only fields. Route chooses model, toolset, retrieval index, or workflow path based on request risk. Validate checks output schema, citations, tone, policy compliance, and required disclaimers. Enrich attaches audit metadata, handoff hints, trace labels, or UI annotations. The key distinction is at the bottom: prompts belong to behavior, processors belong to enforcement. In the example, PIIRedactor handles the redact case and SupportResponseFooter enriches every response with consistent support metadata.`,

  // 31 Production readiness
  `Before launch, make every failure mode observable or bounded. Tool blast radius means scopes, dry-run modes, approvals, idempotency keys, and audit records for side effects. Context safety means tenant isolation, permission-aware retrieval, redaction, and memory lifecycle rules. Quality gates mean scorers, regression datasets, human labels, and release thresholds. Operational limits mean token budgets, latency budgets, retry policy, fallback models, and escalation paths. Debuggability means trace IDs, prompt snapshots, tool arguments, workflow snapshots, and user feedback links. Ownership means deciding who reviews failures, updates prompts, changes tools, approves policies, and ships new evals. The example demonstrates the skeleton: narrow tools, approval-aware workflow, PII redaction, trace filtering, and two domain scorers.`,

  // 32 Masterclass flow
  `The build sequence is the takeaway. Start with one agent: instructions, model, typed tools, and streaming response. Add memory and retrieval: persistent user context plus grounded external knowledge. Promote process into workflows: explicit steps for approvals, branching, retries, and replay. Add specialists when one prompt becomes too broad: supervisor and reviewer agents. Harden the loop with processors, auth, runtime context, guardrails, and human-in-the-loop gates. Operate it with Studio, traces, scorers, deployment, and a regression suite. Point people back to examples/10-mastra-101-masterclass, mastra.ai, github.com/mastra-ai/mastra, and discord.gg/mastra as the path after the room clears.`,
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
