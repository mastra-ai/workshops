import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import demoVideo from './assets/channels-demo-steering.mp4';
import slackHandoff from './assets/slack-handoff.png';
import slackMultiplayer from './assets/slack-multiplayer.png';

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
  border: '#242424',
  borderBright: '#3a3a3a',
  textSoft: '#a9a9a9',
  muted: '#757575',
  dim: '#5c5c5c',
  blue: '#6aa8ff',
  purple: '#b48cff',
  amber: '#e3b758',
  rose: '#ff7a89',
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

const TOTAL = 8;

const Eyebrow = ({ children, color = palette.accent }: { children: React.ReactNode; color?: string }) => (
  <div
    style={{
      fontFamily: font.mono,
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);

const Footer = ({ index, owner = 'CALEB' }: { index: number; owner?: 'CALEB' | 'ALEX' }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 50,
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
    <span>MASTRA · MULTIPLAYER CHANNELS · {owner}</span>
    <span>
      {String(index).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
    </span>
  </div>
);

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div style={{ ...fill, padding: '90px 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    {children}
  </div>
);

const Title = ({ children, maxWidth = 1620 }: { children: React.ReactNode; maxWidth?: number }) => (
  <h1
    style={{
      fontFamily: font.display,
      fontSize: 88,
      fontWeight: 850,
      lineHeight: 1.02,
      letterSpacing: '-0.035em',
      margin: '22px 0 22px',
      maxWidth,
    }}
  >
    {children}
  </h1>
);

const Subtitle = ({ children, maxWidth = 1450 }: { children: React.ReactNode; maxWidth?: number }) => (
  <p style={{ fontSize: 34, lineHeight: 1.45, color: palette.textSoft, maxWidth, margin: 0 }}>{children}</p>
);

const Card = ({
  children,
  accent = palette.borderBright,
  style,
}: {
  children: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 16,
      padding: '28px 32px',
      ...style,
    }}
  >
    {children}
  </div>
);

const Arrow = ({ color = palette.muted }: { color?: string }) => (
  <div style={{ color, fontFamily: font.mono, fontSize: 40, lineHeight: 1 }}>→</div>
);

const FlowNode = ({ label, detail, color = palette.accent }: { label: string; detail?: string; color?: string }) => (
  <div
    style={{
      minWidth: 225,
      padding: '24px 26px',
      borderRadius: 16,
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      boxShadow: `inset 0 3px 0 ${color}`,
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 25, fontWeight: 750, color: palette.text }}>{label}</div>
    {detail && <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.muted, marginTop: 8 }}>{detail}</div>}
  </div>
);

// 01 — Caleb opens with the thing attendees are about to see.
const OneConversation: Page = () => (
  <Stage>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background:
          `radial-gradient(900px 540px at 20% 35%, ${palette.accent}16 0%, transparent 65%),` +
          `radial-gradient(850px 520px at 86% 72%, ${palette.blue}12 0%, transparent 64%)`,
      }}
    />
    <div style={{ position: 'relative', paddingBottom: 70 }}>
      <Eyebrow>Mastra Workshop</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 154,
          fontWeight: 900,
          lineHeight: 0.96,
          letterSpacing: '-0.045em',
          margin: '34px 0 34px',
          maxWidth: 1600,
        }}
      >
        Build Multiplayer Agents
        <br />
        with <span style={{ color: palette.accent }}>Mastra Channels</span>
      </h1>
      <Subtitle>A Slack thread becomes a shared conversation backed by one Mastra memory thread.</Subtitle>
    </div>
    <Footer index={1} />
  </Stage>
);

// 02 — Show the real behavior before explaining the machinery.
const RecordedDemo: Page = () => (
  <Stage>
    <div style={{ paddingBottom: 54 }}>
      <Eyebrow>Demo</Eyebrow>

      <div
        style={{
          margin: '28px auto 0',
          width: 1156,
          aspectRatio: '16 / 9',
          borderRadius: 20,
          border: `1px solid ${palette.borderBright}`,
          background: palette.surface,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
        }}
      >
        <video
          src={demoVideo}
          controls
          playsInline
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#000' }}
        />
      </div>

      <div style={{ margin: '22px auto 0', width: 1156, textAlign: 'center', fontSize: 26, lineHeight: 1.4, color: palette.textSoft }}>
        New messages <b style={{ color: palette.accent }}>steer the agent</b> while it is still working.
      </div>
    </div>
    <Footer index={2} />
  </Stage>
);

// 03 — Hold a clean handoff while Alex shares his screen.
const SetupHandoff: Page = () => (
  <Stage>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(900px 540px at 50% 50%, ${palette.amber}14 0%, transparent 68%)`,
      }}
    />
    <div style={{ position: 'relative', textAlign: 'center', paddingBottom: 70 }}>
      <Eyebrow color={palette.amber}>Setup</Eyebrow>
    </div>
    <Footer index={3} owner="ALEX" />
  </Stage>
);

// 04 — Signals let input reach a run independently from its output stream.
const UnderTheHood: Page = () => (
  <Stage>
    <div style={{ paddingBottom: 56 }}>
      <Eyebrow>How it works</Eyebrow>
      <Title maxWidth={1700}>
        Messages can reach the agent <span style={{ color: palette.accent }}>while it is already running.</span>
      </Title>
      <Subtitle maxWidth={1580}>
        Channels gives inbound context and outbound responses separate lanes through the same agent loop.
      </Subtitle>

      <div style={{ marginTop: 42, display: 'grid', gap: 22 }}>
        <Card accent={palette.purple} style={{ padding: '24px 30px', display: 'grid', gridTemplateColumns: '230px 1fr', alignItems: 'center', gap: 28 }}>
          <div>
            <div style={{ fontFamily: font.mono, fontSize: 17, color: palette.purple, letterSpacing: '0.16em' }}>INBOUND · SIGNAL</div>
            <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.3, color: palette.textSoft }}>New context enters the active conversation.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <FlowNode label="Slack message" detail="thread + sender + content" color={palette.blue} />
            <Arrow color={palette.purple} />
            <FlowNode label="Attributed signal" detail="addressed to the thread" color={palette.purple} />
            <Arrow color={palette.accent} />
            <FlowNode label="Agent loop" detail="receives it at the next step" color={palette.accent} />
          </div>
        </Card>

        <Card accent={palette.blue} style={{ padding: '24px 30px', display: 'grid', gridTemplateColumns: '230px 1fr', alignItems: 'center', gap: 28 }}>
          <div>
            <div style={{ fontFamily: font.mono, fontSize: 17, color: palette.blue, letterSpacing: '0.16em' }}>OUTBOUND · STREAM</div>
            <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.3, color: palette.textSoft }}>The response keeps moving back to Slack.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <FlowNode label="Agent loop" detail="text + tools + reasoning" color={palette.accent} />
            <Arrow color={palette.blue} />
            <FlowNode label="Response chunks" detail="processed independently" color={palette.blue} />
            <Arrow color={palette.blue} />
            <FlowNode label="Slack reply" detail="the same reply keeps updating" color={palette.blue} />
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 28, fontSize: 27, color: palette.textSoft, lineHeight: 1.4 }}>
        A new message does not have to wait for the current response to finish—and it does not become an output chunk.
      </div>
    </div>
    <Footer index={4} />
  </Stage>
);

// 05 — Shared conversation, individual attribution, and attachments.
const SenderAttribution: Page = () => (
  <Stage>
    <div style={{ paddingBottom: 54 }}>
      <Eyebrow>Group threads, solved</Eyebrow>
      <Title maxWidth={1720}>
        Everyone can add context. <span style={{ color: palette.accent }}>The agent knows who said what.</span>
      </Title>

      <div style={{ marginTop: 38, display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 28 }}>
        <Card accent={palette.blue} style={{ padding: '26px 32px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 19, color: palette.blue, letterSpacing: '0.18em', marginBottom: 20 }}>IN SLACK</div>
          {[
            ['Alex', '@Mastra I got this error with Opus 5: “The model stopped because it reached its maximum output length before finishing.”'],
            ['Caleb', 'Yeah, I hit it for tool calls with very long input. Mostly write_plan.'],
            ['Abhi', 'Yeah dude, I saw it only with Opus 5.'],
          ].map(([name, message], index) => (
            <div key={name} style={{ display: 'grid', gridTemplateColumns: '88px 1fr', gap: 14, marginTop: index === 0 ? 0 : 18 }}>
              <span style={{ fontSize: 22, fontWeight: 750, color: [palette.blue, palette.purple, palette.rose][index] }}>{name}</span>
              <span style={{ fontSize: 22, lineHeight: 1.4, color: palette.textSoft }}>{message}</span>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr', gap: 14, marginTop: 18 }}>
            <span style={{ fontSize: 22, fontWeight: 750, color: palette.blue }}>Alex</span>
            <div style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 10, padding: '10px 14px', border: `1px solid ${palette.border}`, borderRadius: 8, fontFamily: font.mono, fontSize: 18, color: palette.text }}>
              <span style={{ color: palette.accent }}>▧</span> opus-5-error.png
            </div>
          </div>
        </Card>

        <Card accent={palette.accent} style={{ padding: '26px 32px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 19, color: palette.accent, letterSpacing: '0.18em', marginBottom: 18 }}>WHAT THE AGENT SEES</div>
          <div style={{ fontFamily: font.mono, fontSize: 17.5, lineHeight: 1.48, color: palette.textSoft }}>
            <div>&lt;user name=<span style={{ color: palette.blue }}>&quot;Alex&quot;</span> id=<span style={{ color: palette.blue }}>&quot;U123&quot;</span>&gt;</div>
            <div style={{ paddingLeft: 18, color: palette.text }}>@Mastra I got this error with Opus 5: “The model stopped...”</div>
            <div>&lt;/user&gt;</div>
            <div style={{ height: 8 }} />
            <div>&lt;user name=<span style={{ color: palette.purple }}>&quot;Caleb&quot;</span> id=<span style={{ color: palette.purple }}>&quot;U456&quot;</span>&gt;</div>
            <div style={{ paddingLeft: 18, color: palette.text }}>I hit it for tool calls with very long input. Mostly write_plan.</div>
            <div>&lt;/user&gt;</div>
            <div style={{ height: 8 }} />
            <div>&lt;user name=<span style={{ color: palette.rose }}>&quot;Abhi&quot;</span> id=<span style={{ color: palette.rose }}>&quot;U789&quot;</span>&gt;</div>
            <div style={{ paddingLeft: 18, color: palette.text }}>Yeah dude, I saw it only with Opus 5.</div>
            <div>&lt;/user&gt;</div>
            <div style={{ height: 8 }} />
            <div>&lt;user name=<span style={{ color: palette.blue }}>&quot;Alex&quot;</span> id=<span style={{ color: palette.blue }}>&quot;U123&quot;</span>&gt;</div>
            <div style={{ paddingLeft: 18, color: palette.muted }}>[Attached image/png file: opus-5-error.png]</div>
            <div>&lt;/user&gt;</div>
            <div style={{ color: palette.accent }}>{`{ type: "file", mediaType: "image/png", data: "data:image/png;base64,iVBO…" }`}</div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <div style={{ fontSize: 20, lineHeight: 1.4, color: palette.textSoft }}>
          <b style={{ color: palette.text }}>Every contribution stays attributable.</b> Each inbound message carries the sender's identity.
        </div>
        <div style={{ fontSize: 20, lineHeight: 1.4, color: palette.textSoft }}>
          <b style={{ color: palette.text }}>Attachments become model input.</b> Inline images are delivered as file parts alongside the text.
        </div>
      </div>
    </div>
    <Footer index={5} />
  </Stage>
);

// 06 — Show a conversation moving naturally from one person to another.
const MultiplayerMoment: Page = () => (
  <Stage>
    <div style={{ paddingBottom: 54 }}>
      <Eyebrow>Real Slack thread</Eyebrow>
      <Title maxWidth={1700}>
        A conversation can move <span style={{ color: palette.accent }}>from one person to another.</span>
      </Title>

      <div style={{ margin: '34px auto 0', width: 1234, height: 530, borderRadius: 18, border: `1px solid ${palette.borderBright}`, background: palette.surface, overflow: 'hidden', boxShadow: '0 20px 70px rgba(0, 0, 0, 0.45)' }}>
        <img
          src={slackHandoff}
          alt="Caleb hands a Slack conversation to Joel and the agent responds to Joel"
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </div>

      <div style={{ margin: '22px auto 0', width: 1234, fontSize: 22, lineHeight: 1.4, color: palette.textSoft }}>
        Caleb invites Joel into the thread. The agent follows the handoff and responds to Joel in the same shared conversation.
      </div>
    </div>
    <Footer index={6} />
  </Stage>
);

// 07 — Show the agent retaining attribution as more people join the thread.
const GroupConversation: Page = () => (
  <Stage>
    <div style={{ paddingBottom: 54 }}>
      <Eyebrow>Real Slack thread</Eyebrow>
      <Title maxWidth={1700}>
        As more people join, <span style={{ color: palette.accent }}>the agent stays oriented.</span>
      </Title>

      <div style={{ margin: '34px auto 0', width: 960, height: 620, borderRadius: 18, border: `1px solid ${palette.borderBright}`, background: palette.surface, overflow: 'hidden', boxShadow: '0 20px 70px rgba(0, 0, 0, 0.45)' }}>
        <img
          src={slackMultiplayer}
          alt="Daniel, Joel, Caleb, and ExampleAgent participate in one Slack thread"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
        />
      </div>

      <div style={{ marginTop: 22, textAlign: 'center', fontSize: 22, lineHeight: 1.4, color: palette.textSoft }}>
        Daniel, Joel, Caleb, and the agent all contribute without losing who said what.
      </div>
    </div>
    <Footer index={7} />
  </Stage>
);

// 08 — Close on the three capabilities attendees should remember.
const ChannelsGuarantees: Page = () => (
  <Stage>
    <div style={{ paddingBottom: 58 }}>
      <Eyebrow>What Channels gives the agent</Eyebrow>
      <Title>
        Shared conversation. <span style={{ color: palette.accent }}>Multiplayer context.</span>
      </Title>
      <div style={{ marginTop: 50, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
        {[
          { n: '01', title: 'Shared thread', body: 'One platform thread maps to one Mastra memory thread.', color: palette.blue },
          { n: '02', title: 'Attributable input', body: 'Every message retains its sender and platform metadata.', color: palette.purple },
          { n: '03', title: 'Live steering', body: 'New input can reach the agent while output streams independently.', color: palette.accent },
        ].map(item => (
          <Card key={item.n} accent={item.color} style={{ minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: font.mono, fontSize: 18, color: item.color }}>{item.n}</div>
            <div>
              <div style={{ fontSize: 35, fontWeight: 850 }}>{item.title}</div>
              <div style={{ marginTop: 16, fontSize: 25, lineHeight: 1.4, color: palette.textSoft }}>{item.body}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 48, textAlign: 'center', fontSize: 31, lineHeight: 1.4, color: palette.textSoft }}>
        That is the difference between putting an agent in Slack and making it <b style={{ color: palette.text }}>part of the conversation.</b>
      </div>
    </div>
    <Footer index={8} />
  </Stage>
);

export const meta: SlideMeta = {
  title: 'Build Multiplayer Agents with Mastra Channels',
  createdAt: '2026-07-29T23:21:34.271Z',
};

export const notes: (string | undefined)[] = [
  `Alex has already framed Channels and why Slack is the main example. Make the result concrete before explaining setup: one agent participating in an ongoing team conversation. The Slack thread is a shared interface backed by one Mastra memory thread. Avoid saying one permanently running process—the signal pipeline can deliver to an active run or wake a new run on the same thread.`,
  `Play the prerecorded Slack demo without narration. Caleb asks the agent to research AgentChannels, then adds attachment handling while the research is already running. He asks for progress, stops the run, and asks for a short summary. Point out that each follow-up enters the same active thread and changes what the agent does next. The purpose is to show steering before explaining the signal machinery.`,
  `Hand to Alex and leave this clean slide visible while he starts sharing his screen. Alex walks through the Slack setup live. When he finishes, take over again with: "That connects the agent. Now let's trace one message through the system."`,
  `Start with the problem this solves: in a shared Slack thread, a second person can add context while the agent is already working. Channels maps the platform thread to the Mastra memory thread and delivers that message as an attributed Signal. If a run already owns the thread, the Signal reaches that loop; otherwise it wakes a run on the same thread. Be precise: this does not interrupt the model in the middle of a token. The new context is incorporated at the next model step. Meanwhile, the outbound processor independently keeps rendering response chunks into the same Slack reply. That separation between inbound Signals and the outbound stream is what makes live steering possible.`,
  `This example is adapted from a real MastraCode Slack thread. Alex tags the agent with an Opus 5 output-length error. Caleb narrows it to tool calls with long input, especially write_plan, and Abhi confirms he only saw it with Opus 5. Their replies arrive as separate inbound messages on the same Mastra thread, each carrying its own authorName, authorId, and authorMention attributes. Alex then adds a screenshot. Channels emits a wrapped text part describing the attachment followed by a structured file part; image files are converted to image content by the model adapter. The XML on screen is intentionally simplified to name and id for readability.`,
  `Move from steering by one person to a real multiplayer handoff. Caleb explicitly invites Joel into the conversation, Joel asks his own question, and the agent responds to Joel in the same Slack thread. The shared thread is the continuity boundary—not whichever person spoke first.`,
  `Now show the same idea with more participants. Daniel, Joel, Caleb, and the agent all contribute naturally. The important point is not the joke—it is that every message remains attributable, so the agent can follow the conversation and respond to the right person as the group changes.`,
  `Close the core Channels section with three guarantees: shared thread mapping, attributable input, and live steering. Let this feel like a real ending. Then pause before moving into the optional deeper material rather than turning the summary into another transition slide.`,
  `Use this as a clean reset. The first section explained what makes a channel agent multiplayer. The deep dive is about what application developers can build at the event boundary: custom policy, authenticated identities, tenant-specific runs, and managed Slack apps.`,
  `Channels provides default behavior for direct messages, mentions, and subscribed-thread messages, but each handler is replaceable. A custom handler receives the thread, message, defaultHandler, and a fresh RequestContext. It can inspect or block the event, write context for the run, then call the default behavior. Factory uses this exact seam for every Slack event that could start or continue a run.`,
  `Factory requires users to link Slack before an agent run begins. The user is already signed into Mastra, then Slack OIDC proves which Slack workspace and user they control. Factory stores that mapping. When an event arrives, the handler resolves the workspace and sender against the link. An unlinked sender gets a private connect card; a linked sender resolves to the correct Mastra user, organization, and Factory project.`,
  `The important part is not the literal user object on screen. It is that the custom handler can modify the same RequestContext the agent run receives. Factory currently uses it to select the linked user's credentials and tenant boundary. The same seam can drive per-user model selection, usage accounting, tool access, data access, instructions, memory, or skills. Those are application decisions, not hard-coded Channels behavior.`,
  `Once identity is resolved per message, the same Slack-facing agent can serve different organizations safely. A team member, customer, and unlinked guest may all reach the same platform endpoint, but they do not receive the same runtime. The account link and RequestContext choose the tenant, credentials, tools, data, and policy before dispatch. Emphasize that Channels creates the hook; Factory is one concrete implementation.`,
  `Separate this from Factory's custom authentication story. SlackProvider is a ChannelProvider registered on the Mastra instance. Calling connect creates a Slack app from a generated manifest and returns its OAuth installation URL. Active installations are stored, adapters are restored when Mastra starts, webhook traffic is routed to the right agent, and manifest drift is updated automatically. This is the managed app lifecycle around normal AgentChannels.`,
];

export default [
  OneConversation,
  RecordedDemo,
  SetupHandoff,
  UnderTheHood,
  SenderAttribution,
  MultiplayerMoment,
  GroupConversation,
  ChannelsGuarantees,
] satisfies Page[];
