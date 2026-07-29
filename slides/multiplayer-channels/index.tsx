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

const Person = ({ name, color, message }: { name: string; color: string; message: string }) => (
  <Card accent={color} style={{ padding: '22px 26px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          background: `${color}20`,
          border: `1px solid ${color}70`,
          color,
          fontFamily: font.mono,
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {name[0]}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{name}</div>
    </div>
    <div style={{ color: palette.textSoft, fontSize: 26, lineHeight: 1.35 }}>{message}</div>
  </Card>
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
      <Eyebrow>What we're building</Eyebrow>
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
        One agent.
        <br />
        One <span style={{ color: palette.accent }}>team conversation.</span>
      </h1>
      <Subtitle>A Slack thread becomes a shared interface to the same running Mastra agent.</Subtitle>
    </div>
    <Footer index={1} />
  </Stage>
);

// 02 — Establish the multiplayer scenario before the live demo.
const SharedThread: Page = () => (
  <Stage>
    <div style={{ paddingBottom: 60 }}>
      <Eyebrow>Shared context</Eyebrow>
      <Title>
        One Slack thread → one <span style={{ color: palette.accent }}>Mastra thread.</span>
      </Title>
      <Subtitle>Every reply reuses the same memory thread, so the team's context accumulates over time.</Subtitle>

      <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: '1fr 110px 1.1fr', gap: 28, alignItems: 'center' }}>
        <div style={{ display: 'grid', gap: 18 }}>
          <Person name="Caleb" color={palette.blue} message="Investigate why CI is failing on the release PR." />
          <Person name="Alex" color={palette.purple} message="Also check whether the migration is safe to roll back." />
        </div>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <Arrow color={palette.accent} />
        </div>
        <Card accent={palette.accent} style={{ minHeight: 270, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: font.mono, color: palette.accent, fontSize: 17, letterSpacing: '0.18em' }}>ONE MASTRA MEMORY THREAD</div>
          <div style={{ fontSize: 40, fontWeight: 800, margin: '16px 0 12px' }}>Shared history</div>
          <div style={{ fontSize: 27, lineHeight: 1.4, color: palette.textSoft }}>
            Both requests land in the same conversation history while preserving who sent each one.
          </div>
        </Card>
      </div>
    </div>
    <Footer index={2} />
  </Stage>
);

// 03 — Cue the live Slack demo.
const LiveDemo: Page = () => (
  <Stage>
    <div style={{ paddingBottom: 70 }}>
      <Eyebrow color={palette.blue}>Live demo · Caleb</Eyebrow>
      <Title>
        Let's use the agent from <span style={{ color: palette.blue }}>Slack.</span>
      </Title>
      <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
        {[
          ['01', 'Start', 'Send the first request in a new Slack thread.'],
          ['02', 'Join', 'A second teammate adds context to the same conversation.'],
          ['03', 'Continue', 'The agent responds with the combined context intact.'],
        ].map(([number, title, body], index) => (
          <Card key={number} accent={[palette.blue, palette.purple, palette.accent][index]} style={{ minHeight: 250 }}>
            <div style={{ fontFamily: font.mono, fontSize: 20, color: [palette.blue, palette.purple, palette.accent][index] }}>{number}</div>
            <div style={{ fontSize: 38, fontWeight: 800, margin: '18px 0 14px' }}>{title}</div>
            <div style={{ fontSize: 27, lineHeight: 1.45, color: palette.textSoft }}>{body}</div>
          </Card>
        ))}
      </div>
    </div>
    <Footer index={3} />
  </Stage>
);

// 04 — Alex takes over for the setup speedrun.
const SetupHandoff: Page = () => (
  <Stage>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(900px 540px at 78% 48%, ${palette.amber}14 0%, transparent 65%)`,
      }}
    />
    <div style={{ position: 'relative', paddingBottom: 70 }}>
      <Eyebrow color={palette.amber}>Setup speedrun · Alex</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 142,
          fontWeight: 900,
          lineHeight: 0.98,
          letterSpacing: '-0.045em',
          margin: '34px 0 30px',
          maxWidth: 1600,
        }}
      >
        From a blank app to Slack in <span style={{ color: palette.amber }}>3–5 minutes.</span>
      </h1>
      <Subtitle>Then we'll come back and unpack what Channels did for us.</Subtitle>
    </div>
    <Footer index={4} owner="ALEX" />
  </Stage>
);

// 05 — End-to-end mental model after the setup.
const UnderTheHood: Page = () => (
  <Stage>
    <div style={{ paddingBottom: 60 }}>
      <Eyebrow>How it works</Eyebrow>
      <Title>
        What happened after someone pressed <span style={{ color: palette.accent }}>Send?</span>
      </Title>
      <div style={{ marginTop: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
        <FlowNode label="Slack event" detail="message + thread + sender" color={palette.blue} />
        <Arrow />
        <FlowNode label="Channel adapter" detail="normalize the platform" color={palette.purple} />
        <Arrow />
        <FlowNode label="Signal" detail="deliver context" color={palette.accent} />
        <Arrow />
        <FlowNode label="Agent loop" detail="reason + tools + memory" color={palette.amber} />
        <Arrow />
        <FlowNode label="Slack reply" detail="stream + edit in place" color={palette.blue} />
      </div>
      <div style={{ marginTop: 54, fontSize: 31, color: palette.textSoft, lineHeight: 1.45, maxWidth: 1500 }}>
        Channels handles the platform boundary. The agent keeps working with Mastra concepts: messages, threads, signals, tools, and memory.
      </div>
    </div>
    <Footer index={5} />
  </Stage>
);

// 06 — Shared conversation, individual attribution.
const SenderAttribution: Page = () => (
  <Stage>
    <div style={{ paddingBottom: 58 }}>
      <Eyebrow>Multi-user awareness</Eyebrow>
      <Title>
        Every signal keeps its <span style={{ color: palette.accent }}>author.</span>
      </Title>
      <Subtitle>Messages share one thread, but Channels preserves who contributed each piece of context.</Subtitle>
      <div style={{ marginTop: 42, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
        {[
          { name: 'Caleb', id: 'U012AB3CD4E', message: 'Investigate the failing release.', color: palette.blue },
          { name: 'Alex', id: 'U045EF6GH7I', message: 'Check rollback safety too.', color: palette.purple },
        ].map(item => (
          <Card key={item.id} accent={item.color} style={{ padding: '26px 30px' }}>
            <Person name={item.name} color={item.color} message={item.message} />
            <div
              style={{
                fontFamily: font.mono,
                fontSize: 18,
                lineHeight: 1.65,
                color: palette.textSoft,
                marginTop: 20,
                padding: '16px 20px',
                borderRadius: 12,
                background: palette.surfaceHi,
              }}
            >
              attributes.authorName: <span style={{ color: item.color }}>{item.name}</span>
              <br />
              attributes.authorId: <span style={{ color: item.color }}>{item.id}</span>
              <br />
              channels.slack.author: <span style={{ color: palette.text }}>original sender payload</span>
            </div>
          </Card>
        ))}
      </div>
      <div
        style={{
          marginTop: 24,
          padding: '16px 24px',
          borderRadius: 12,
          background: `${palette.accent}0d`,
          border: `1px solid ${palette.accent}45`,
          fontFamily: font.mono,
          fontSize: 20,
          color: palette.textSoft,
          textAlign: 'center',
        }}
      >
        shared threadId: <span style={{ color: palette.accent }}>slack:C_TEAM:release-482</span>
      </div>
    </div>
    <Footer index={6} />
  </Stage>
);

// 07 — Explain why input cannot be coupled to an output stream.
const SeparateLanes: Page = () => (
  <Stage>
    <div style={{ paddingBottom: 55 }}>
      <Eyebrow>The important split</Eyebrow>
      <Title>
        Input and output travel on <span style={{ color: palette.accent }}>different lanes.</span>
      </Title>
      <div style={{ marginTop: 50, display: 'grid', gridTemplateColumns: '1fr 250px 1fr', gap: 34, alignItems: 'stretch' }}>
        <Card accent={palette.purple} style={{ minHeight: 325 }}>
          <div style={{ fontFamily: font.mono, fontSize: 17, color: palette.purple, letterSpacing: '0.16em' }}>INBOUND · SIGNALS</div>
          <div style={{ fontSize: 36, fontWeight: 800, margin: '20px 0 22px' }}>Context can arrive anytime.</div>
          {['A teammate replies', 'Someone corrects a detail', 'Another request joins the thread'].map(item => (
            <div key={item} style={{ fontSize: 25, color: palette.textSoft, marginTop: 14 }}>+ {item}</div>
          ))}
        </Card>

        <div style={{ display: 'grid', placeItems: 'center' }}>
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: 999,
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
              background: palette.surfaceHi,
              border: `2px solid ${palette.accent}`,
              boxShadow: `0 0 80px ${palette.accent}18`,
              fontSize: 32,
              fontWeight: 850,
              lineHeight: 1.12,
            }}
          >
            running
            <br />
            agent
          </div>
        </div>

        <Card accent={palette.blue} style={{ minHeight: 325 }}>
          <div style={{ fontFamily: font.mono, fontSize: 17, color: palette.blue, letterSpacing: '0.16em' }}>OUTBOUND · STREAM</div>
          <div style={{ fontSize: 36, fontWeight: 800, margin: '20px 0 22px' }}>The response keeps streaming.</div>
          {['Text arrives incrementally', 'Tool progress remains visible', 'Slack updates the same reply'].map(item => (
            <div key={item} style={{ fontSize: 25, color: palette.textSoft, marginTop: 14 }}>→ {item}</div>
          ))}
        </Card>
      </div>
    </div>
    <Footer index={7} />
  </Stage>
);

// 08 — The payoff: new context can steer a live process.
const Steering: Page = () => (
  <Stage>
    <div style={{ paddingBottom: 58 }}>
      <Eyebrow>The result</Eyebrow>
      <Title>
        Steering is what makes the agent <span style={{ color: palette.accent }}>multiplayer.</span>
      </Title>
      <div style={{ marginTop: 52, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 80, right: 80, top: 71, height: 2, background: palette.borderBright }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26, position: 'relative' }}>
          {[
            { n: '01', title: 'Agent starts', body: 'Investigating CI failures', color: palette.amber },
            { n: '02', title: 'Caleb adds context', body: 'Look at the release workflow', color: palette.blue },
            { n: '03', title: 'Alex redirects', body: 'Check rollback safety too', color: palette.purple },
            { n: '04', title: 'Agent adapts', body: 'The next step accounts for both', color: palette.accent },
          ].map(item => (
            <div key={item.n} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 999,
                  background: palette.bg,
                  border: `2px solid ${item.color}`,
                  display: 'grid',
                  placeItems: 'center',
                  margin: '36px auto 26px',
                  fontFamily: font.mono,
                  fontSize: 19,
                  color: item.color,
                  boxShadow: `0 0 30px ${item.color}18`,
                }}
              >
                {item.n}
              </div>
              <div style={{ fontSize: 29, fontWeight: 800, color: palette.text }}>{item.title}</div>
              <div style={{ fontSize: 23, lineHeight: 1.4, color: palette.textSoft, marginTop: 12 }}>{item.body}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 58, textAlign: 'center', fontSize: 33, color: palette.textSoft }}>
        People do not get separate conversations. New context reaches the active loop or wakes the same thread.
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
  `Alex has already framed Channels and why Slack is the main example. My job here is to make the result concrete before we explain the setup. The simplest definition is one agent participating in one ongoing team conversation. This is not several private chats that happen to use the same bot. The Slack thread itself is the shared interface to the same running agent.`,
  `Set up the demo story before switching screens. AgentChannels maps the external Slack thread to one Mastra memory thread using channel metadata, then reuses that mapping for later replies. I start with a request. Alex joins the same Slack thread and adds a constraint. Both messages land in the same conversation history, but the author metadata stays distinct. That combination — shared thread context plus individual sender attribution — is the multiplayer behavior we want to make visible.`,
  `Switch to Slack. Start a clean thread with a deterministic request. Have Alex reply with an extra constraint while the agent is running or immediately after the first response begins. Then send one follow-up that depends on both messages. Do not open code yet. The purpose is only to prove the experience before explaining the machinery.`,
  `Hand back to Alex for the setup speedrun. He starts from a blank Mastra app and follows the Slack guide. Keep this slide visible during the handoff. When he finishes, take over again with: "That gets the agent connected. Now let's look at what had to happen after someone pressed Send."`,
  `This is the first mental model, not an exhaustive architecture diagram. Slack sends an event with the message, thread, and sender. The channel adapter normalizes Slack-specific details. Channels delivers that context into the agent loop as a signal. The agent keeps using normal Mastra tools and memory. Its output stream is rendered back into Slack, usually by updating the same response as tokens arrive.`,
  `Slow down here because sender attribution is one of the most important multiplayer differences. Caleb and Alex share the same thread ID, so their messages contribute to the same conversation. Each message still carries its own user identity. That lets the agent understand who said what. Later, if we expand the workshop, this becomes the bridge into authorization and RequestContext. For this version, stop at attribution.`,
  `A normal request-response handler assumes input arrives, output streams, and then the turn ends. That breaks when another teammate replies while the agent is still working. Channels uses signals for inbound context, while the response remains an outbound stream. New context does not need to masquerade as another output chunk or wait for a brand-new run.`,
  `Close this first section with the practical definition of multiplayer. The agent starts working, multiple people add or correct context, and the running loop can adapt. It does not create an isolated agent for every message. Pause here and decide with Alex whether to continue into authentication, RequestContext, Factory, and SlackProvider, or move to questions and live code.`,
];

export default [
  OneConversation,
  SharedThread,
  LiveDemo,
  SetupHandoff,
  UnderTheHood,
  SenderAttribution,
  SeparateLanes,
  Steering,
] satisfies Page[];
