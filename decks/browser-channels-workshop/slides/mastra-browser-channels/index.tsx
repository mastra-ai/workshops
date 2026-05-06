import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

// ─── Design tokens (panel-tweakable) ─────────────────────────────────────────
export const design: DesignSystem = {
  palette: {
    bg: '#0b0d10',
    text: '#f4f4f5',
    accent: '#ff6b35',
  },
  fonts: {
    display: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
    body: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
  },
  typeScale: {
    hero: 168,
    body: 36,
  },
  radius: 12,
};

// ─── Local palette + fonts ───────────────────────────────────────────────────
const palette = {
  bg: design.palette.bg,
  text: design.palette.text,
  accent: design.palette.accent,
  surface: '#13161a',
  surfaceHi: '#1b1f24',
  border: 'rgba(255,255,255,0.08)',
  borderBright: 'rgba(255,255,255,0.16)',
  textSoft: '#c5c8cf',
  muted: '#7c8088',
  dim: '#4a4e57',
  green: '#65d39a',
  amber: '#e3b758',
  blue: '#6aa8ff',
  rose: '#ff7a89',
};

const font = {
  sans: design.fonts.body,
  display: design.fonts.display,
  mono: '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace',
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

const TOTAL = 21;

const Footer = ({ index, label }: { index: number; label: string }) => (
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
    <span>MASTRA · BROWSER + CHANNELS</span>
    <span>{label}</span>
    <span>
      {String(index).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
    </span>
  </div>
);

const Bullet = ({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) => (
  <li
    style={{
      fontSize: 38,
      lineHeight: 1.4,
      color: accent ? palette.text : palette.textSoft,
      marginBottom: 18,
      paddingLeft: 36,
      position: 'relative',
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
        background: accent ? palette.accent : palette.borderBright,
      }}
    />
    {children}
  </li>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: font.mono, color: palette.amber, fontSize: '0.92em' }}>{children}</span>
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
          `radial-gradient(1100px 600px at 18% 22%, ${palette.accent}22 0%, transparent 60%),` +
          `radial-gradient(900px 500px at 82% 78%, ${palette.blue}18 0%, transparent 60%)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <Eyebrow>Mastra Workshop · 60 min</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 200,
          fontWeight: 900,
          lineHeight: 0.94,
          margin: '40px 0 28px',
          letterSpacing: '-0.04em',
        }}
      >
        Giving agents
        <br />
        <span style={{ color: palette.accent }}>a body.</span>
      </h1>
      <p style={{ fontSize: 40, color: palette.textSoft, maxWidth: 1400, lineHeight: 1.35 }}>
        Two primitives for building agents that touch the real world: <b style={{ color: palette.text }}>Browser</b> and <b style={{ color: palette.text }}>Channels</b>.
      </p>
    </div>
    <Footer index={1} label="COVER" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 02 — Brain in a jar
// ════════════════════════════════════════════════════════════════════════════
const BrainInJar: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Eyebrow>The premise</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 110,
        fontWeight: 800,
        lineHeight: 1.05,
        margin: '32px 0 28px',
        letterSpacing: '-0.03em',
        maxWidth: 1500,
      }}
    >
      An agent without a body
      <br />
      is just a <span style={{ color: palette.accent }}>text predictor</span>.
    </h2>
    <p style={{ fontSize: 38, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.45 }}>
      It can reason. It can plan. It can write beautifully. But it can't book a flight, read your Slack, or click a button. To do any of that, it needs to <b style={{ color: palette.text }}>see</b> and <b style={{ color: palette.text }}>speak</b>.
    </p>
    <Footer index={2} label="ACT I · HOOK" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 03 — Two directions (the spine)
// ════════════════════════════════════════════════════════════════════════════
const TwoDirections: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <Eyebrow>The spine of this talk</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 92,
        fontWeight: 800,
        margin: '28px 0 56px',
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
      }}
    >
      Two directions an agent can move.
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 16,
          padding: '44px 44px 40px',
        }}
      >
        <div style={{ fontSize: 22, fontFamily: font.mono, color: palette.accent, letterSpacing: '0.2em' }}>
          OUTBOUND →
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, fontFamily: font.display, margin: '14px 0 14px' }}>Browser</div>
        <div style={{ fontSize: 32, color: palette.textSoft, lineHeight: 1.4 }}>
          The agent reaches <b style={{ color: palette.text }}>out</b> to the world.<br />
          Navigate, click, type, extract.
        </div>
      </div>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 16,
          padding: '44px 44px 40px',
        }}
      >
        <div style={{ fontSize: 22, fontFamily: font.mono, color: palette.blue, letterSpacing: '0.2em' }}>
          ← INBOUND
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, fontFamily: font.display, margin: '14px 0 14px' }}>Channels</div>
        <div style={{ fontSize: 32, color: palette.textSoft, lineHeight: 1.4 }}>
          The world reaches <b style={{ color: palette.text }}>in</b> to the agent.<br />
          Slack, Discord, Telegram, threads.
        </div>
      </div>
    </div>
    <Footer index={3} label="ACT I · HOOK" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 04 — Section: Browser
// ════════════════════════════════════════════════════════════════════════════
const SectionBrowser: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(1200px 600px at 20% 50%, ${palette.accent}1f 0%, transparent 65%)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <div style={{ fontSize: 28, fontFamily: font.mono, color: palette.accent, letterSpacing: '0.3em' }}>
        ACT II · 20 MIN
      </div>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 220,
          fontWeight: 900,
          lineHeight: 0.94,
          margin: '32px 0 28px',
          letterSpacing: '-0.04em',
        }}
      >
        Browser.
      </h1>
      <p style={{ fontSize: 44, color: palette.textSoft, maxWidth: 1400, lineHeight: 1.3 }}>
        Letting the agent <b style={{ color: palette.text }}>see and click</b>.
      </p>
    </div>
    <Footer index={4} label="ACT II · BROWSER" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — The naive attempt
// ════════════════════════════════════════════════════════════════════════════
const NaiveBrowser: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <Eyebrow color={palette.rose}>Without a primitive</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 80,
        fontWeight: 800,
        margin: '24px 0 36px',
        letterSpacing: '-0.025em',
        lineHeight: 1.08,
      }}
    >
      The painful version of "agent uses a website".
    </h2>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 1500 }}>
      <Bullet><Code>document.querySelector('.btn-primary')</Code> — until they ship a redesign</Bullet>
      <Bullet>Send the LLM a screenshot — burns tokens, loses structure</Bullet>
      <Bullet>The page rendered before JS ran. Now you're in retry-loop hell.</Bullet>
      <Bullet>Two tabs. A modal. A captcha. Your agent has no idea where it is.</Bullet>
      <Bullet accent>You've written a Playwright wrapper, badly, in production.</Bullet>
    </ul>
    <Footer index={5} label="ACT II · BROWSER" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 06 — The insight: accessibility tree
// ════════════════════════════════════════════════════════════════════════════
const InsightA11y: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <Eyebrow>The insight</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 88,
        fontWeight: 800,
        margin: '24px 0 32px',
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        maxWidth: 1600,
      }}
    >
      The browser already builds<br />
      a tree for screen readers.<br />
      <span style={{ color: palette.accent }}>Give that to the LLM.</span>
    </h2>
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        padding: '28px 36px',
        fontFamily: font.mono,
        fontSize: 28,
        lineHeight: 1.6,
        maxWidth: 1500,
        color: palette.textSoft,
      }}
    >
      <div><span style={{ color: palette.muted }}>[ref=e1]</span> button "Sign in"</div>
      <div><span style={{ color: palette.muted }}>[ref=e2]</span> textbox "Email"</div>
      <div><span style={{ color: palette.muted }}>[ref=e3]</span> link "Forgot password?"</div>
    </div>
    <Footer index={6} label="ACT II · BROWSER" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 07 — The loop
// ════════════════════════════════════════════════════════════════════════════
const SnapshotLoop: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <Eyebrow>The loop the agent runs</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 88,
        fontWeight: 800,
        margin: '24px 0 60px',
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
      }}
    >
      Snapshot. Reason. Act. Repeat.
    </h2>
    <div style={{ display: 'flex', gap: 28, alignItems: 'stretch' }}>
      {[
        { n: '01', t: 'snapshot', d: 'Get the a11y tree + refs' },
        { n: '02', t: 'reason', d: 'Pick a target ref' },
        { n: '03', t: 'act', d: 'click / type / scroll' },
        { n: '04', t: 'snapshot', d: 'Did it work?' },
      ].map(({ n, t, d }, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: 14,
            padding: '32px 28px',
          }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 22, color: palette.accent, letterSpacing: '0.2em' }}>
            {n}
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 36, fontWeight: 700, marginTop: 10 }}>{t}</div>
          <div style={{ fontSize: 26, color: palette.textSoft, marginTop: 14, lineHeight: 1.4 }}>{d}</div>
        </div>
      ))}
    </div>
    <p style={{ fontSize: 32, color: palette.muted, marginTop: 48, maxWidth: 1500, lineHeight: 1.4 }}>
      The model never sees pixels or HTML. It sees a list of things it can touch, and the names of the actions.
    </p>
    <Footer index={7} label="ACT II · BROWSER" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 08 — DEMO 1
// ════════════════════════════════════════════════════════════════════════════
const Demo1: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `repeating-linear-gradient(135deg, ${palette.accent}10 0 24px, transparent 24px 48px)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <Eyebrow>Live demo · ~5 min</Eyebrow>
      <div style={{ fontSize: 30, fontFamily: font.mono, color: palette.muted, marginTop: 24, letterSpacing: '0.12em' }}>
        TERMINAL ↗
      </div>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 168,
          fontWeight: 900,
          lineHeight: 0.95,
          margin: '24px 0 24px',
          letterSpacing: '-0.04em',
        }}
      >
        Demo 1: <span style={{ color: palette.accent }}>book a flight</span>.
      </h1>
      <p style={{ fontSize: 38, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.35 }}>
        One agent, one tool: <Code>browser</Code>. Watch it navigate, snapshot, click, fill the form, extract a result.
      </p>
    </div>
    <Footer index={8} label="ACT II · BROWSER · DEMO" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 09 — The cache trick
// ════════════════════════════════════════════════════════════════════════════
const CacheTrick: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <Eyebrow>Why this matters at scale</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 78,
        fontWeight: 800,
        margin: '20px 0 36px',
        letterSpacing: '-0.025em',
        lineHeight: 1.06,
        maxWidth: 1700,
      }}
    >
      Browser state changes every step.<br />
      The system prompt <span style={{ color: palette.accent }}>can't</span>.
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.rose}55`,
          borderRadius: 12,
          padding: '28px 32px',
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 22, color: palette.rose, letterSpacing: '0.18em' }}>NAIVE</div>
        <div style={{ fontSize: 32, marginTop: 12, lineHeight: 1.4, color: palette.textSoft }}>
          Patch URL into the system prompt each turn.
        </div>
        <div style={{ fontSize: 28, marginTop: 16, color: palette.rose, fontFamily: font.mono }}>
          → cache miss every step
        </div>
      </div>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.green}55`,
          borderRadius: 12,
          padding: '28px 32px',
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 22, color: palette.green, letterSpacing: '0.18em' }}>MASTRA</div>
        <div style={{ fontSize: 32, marginTop: 12, lineHeight: 1.4, color: palette.textSoft }}>
          Inject as a fresh user message: <Code>&lt;browser-state&gt;…&lt;/&gt;</Code>
        </div>
        <div style={{ fontSize: 28, marginTop: 16, color: palette.green, fontFamily: font.mono }}>
          → prefix stays cached
        </div>
      </div>
    </div>
    <p style={{ fontSize: 28, color: palette.muted, marginTop: 36, maxWidth: 1700, lineHeight: 1.4 }}>
      Real money. A 20-step session can be 10× cheaper just from this one decision.
    </p>
    <Footer index={9} label="ACT II · BROWSER" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 10 — AgentBrowser vs Stagehand
// ════════════════════════════════════════════════════════════════════════════
const TwoFlavors: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <Eyebrow>Pick the right one</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 84,
        fontWeight: 800,
        margin: '20px 0 44px',
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
      }}
    >
      Two flavors, one interface.
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 14, padding: '32px 36px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 22, color: palette.accent, letterSpacing: '0.18em' }}>AGENTBROWSER</div>
        <div style={{ fontSize: 44, fontWeight: 800, fontFamily: font.display, marginTop: 10 }}>Deterministic</div>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 18, fontSize: 28, color: palette.textSoft, lineHeight: 1.55 }}>
          <li>• Refs (<Code>@e1</Code>) from a11y tree</li>
          <li>• Cheap, fast, predictable</li>
          <li>• Reach for it first</li>
        </ul>
      </div>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 14, padding: '32px 36px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 22, color: palette.blue, letterSpacing: '0.18em' }}>STAGEHAND</div>
        <div style={{ fontSize: 44, fontWeight: 800, fontFamily: font.display, marginTop: 10 }}>AI-targeted</div>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 18, fontSize: 28, color: palette.textSoft, lineHeight: 1.55 }}>
          <li>• Natural language: "click sign in"</li>
          <li>• Higher token cost, more flexible</li>
          <li>• Reach for it when refs aren't enough</li>
        </ul>
      </div>
    </div>
    <Footer index={10} label="ACT II · BROWSER" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 11 — Section: Channels
// ════════════════════════════════════════════════════════════════════════════
const SectionChannels: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(1200px 600px at 80% 50%, ${palette.blue}22 0%, transparent 65%)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <div style={{ fontSize: 28, fontFamily: font.mono, color: palette.blue, letterSpacing: '0.3em' }}>
        ACT III · 20 MIN
      </div>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 220,
          fontWeight: 900,
          lineHeight: 0.94,
          margin: '32px 0 28px',
          letterSpacing: '-0.04em',
        }}
      >
        Channels.
      </h1>
      <p style={{ fontSize: 44, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.3 }}>
        Letting the world <b style={{ color: palette.text }}>talk to</b> the agent.
      </p>
    </div>
    <Footer index={11} label="ACT III · CHANNELS" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 12 — Naive channels
// ════════════════════════════════════════════════════════════════════════════
const NaiveChannels: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <Eyebrow color={palette.rose}>Without a primitive</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 80,
        fontWeight: 800,
        margin: '24px 0 36px',
        letterSpacing: '-0.025em',
        lineHeight: 1.08,
      }}
    >
      "I'll just hook up Slack" — <span style={{ color: palette.rose }}>two weeks later</span>:
    </h2>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 1600 }}>
      <Bullet>Webhook routes, signature verification, retries on 3-second timeouts</Bullet>
      <Bullet>Threading: which messages are <i>this</i> conversation?</Bullet>
      <Bullet>Multi-user: three people are talking. Who said what? Reply to whom?</Bullet>
      <Bullet>Attachments, inline images, links to videos</Bullet>
      <Bullet accent>You've shipped a worse Slack SDK and your agent isn't built yet.</Bullet>
    </ul>
    <Footer index={12} label="ACT III · CHANNELS" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 13 — The insight: adapters
// ════════════════════════════════════════════════════════════════════════════
const InsightAdapters: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <Eyebrow>The insight</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 92,
        fontWeight: 800,
        margin: '24px 0 32px',
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        maxWidth: 1700,
      }}
    >
      Your agent shouldn't know<br />
      <span style={{ color: palette.accent }}>it's on Slack.</span>
    </h2>
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        padding: '32px 40px',
        fontFamily: font.mono,
        fontSize: 26,
        lineHeight: 1.7,
        maxWidth: 1500,
        color: palette.textSoft,
      }}
    >
      <div><span style={{ color: palette.muted }}>// the agent definition</span></div>
      <div>const support = new Agent(&#123;</div>
      <div>{'  '}name: 'support',</div>
      <div>{'  '}instructions: 'Help users with their orders.',</div>
      <div>{'  '}channels: &#123;</div>
      <div>{'    '}adapters: &#123; <span style={{ color: palette.accent }}>slack: createSlackAdapter()</span> &#125;,</div>
      <div>{'  '}&#125;,</div>
      <div>&#125;);</div>
    </div>
    <p style={{ fontSize: 30, color: palette.muted, marginTop: 32, maxWidth: 1500, lineHeight: 1.4 }}>
      Swap <Code>slack</Code> for <Code>discord</Code>. Same agent. Different platform.
    </p>
    <Footer index={13} label="ACT III · CHANNELS" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 14 — DEMO 2
// ════════════════════════════════════════════════════════════════════════════
const Demo2: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `repeating-linear-gradient(135deg, ${palette.blue}12 0 24px, transparent 24px 48px)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <Eyebrow color={palette.blue}>Live demo · ~5 min</Eyebrow>
      <div style={{ fontSize: 30, fontFamily: font.mono, color: palette.muted, marginTop: 24, letterSpacing: '0.12em' }}>
        SLACK ↗
      </div>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 168,
          fontWeight: 900,
          lineHeight: 0.95,
          margin: '24px 0 24px',
          letterSpacing: '-0.04em',
        }}
      >
        Demo 2: <span style={{ color: palette.blue }}>summarize a thread</span>.
      </h1>
      <p style={{ fontSize: 38, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.35 }}>
        @-mention the bot in a noisy thread. It pulls history, summarizes, replies in-thread.
      </p>
    </div>
    <Footer index={14} label="ACT III · CHANNELS · DEMO" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 15 — Threads + multi-user
// ════════════════════════════════════════════════════════════════════════════
const ThreadsMultiUser: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <Eyebrow>The part everyone gets wrong</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 78,
        fontWeight: 800,
        margin: '20px 0 36px',
        letterSpacing: '-0.025em',
        lineHeight: 1.06,
      }}
    >
      Three humans and a bot walk into a thread.
    </h2>
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        padding: '28px 32px',
        fontFamily: font.mono,
        fontSize: 26,
        lineHeight: 1.7,
        maxWidth: 1600,
        color: palette.textSoft,
      }}
    >
      <div><span style={{ color: palette.accent }}>[Alice (@U123ABC)]</span> hey can someone summarize?</div>
      <div><span style={{ color: palette.blue }}>[Bob (@U456DEF)]</span> i've got it, one sec</div>
      <div><span style={{ color: palette.green }}>[Carol (@U789GHI)]</span> nvm bob is on it</div>
    </div>
    <ul style={{ listStyle: 'none', padding: 0, margin: '36px 0 0', maxWidth: 1700 }}>
      <Bullet>Every line is prefixed with sender + platform ID — agent knows who's who.</Bullet>
      <Bullet>If humans are talking to each other, the agent <b style={{ color: palette.text }}>stays silent</b>.</Bullet>
      <Bullet accent>First mention pulls last 10 messages so the agent has context.</Bullet>
    </ul>
    <Footer index={15} label="ACT III · CHANNELS" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 16 — Approval cards
// ════════════════════════════════════════════════════════════════════════════
const ApprovalCards: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <Eyebrow>The "oh nice" moment</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 84,
        fontWeight: 800,
        margin: '20px 0 36px',
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
      }}
    >
      Tools that need approval render as cards.
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'start' }}>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
          padding: '24px 28px',
          fontFamily: font.mono,
          fontSize: 24,
          lineHeight: 1.7,
          color: palette.textSoft,
        }}
      >
        <div><span style={{ color: palette.muted }}>// in your tool definition</span></div>
        <div>tool(&#123;</div>
        <div>{'  '}id: 'send_refund',</div>
        <div>{'  '}<span style={{ color: palette.accent }}>requireApproval: true</span>,</div>
        <div>{'  '}execute: …</div>
        <div>&#125;)</div>
      </div>
      <div
        style={{
          background: palette.surfaceHi,
          border: `1px solid ${palette.borderBright}`,
          borderRadius: 12,
          padding: '28px 32px',
        }}
      >
        <div style={{ fontSize: 28, color: palette.text, fontWeight: 600 }}>send_refund</div>
        <div style={{ fontSize: 24, color: palette.textSoft, marginTop: 8, fontFamily: font.mono }}>
          orderId: "A-9281", amount: $42
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 24 }}>
          <span style={{ background: palette.green, color: '#0b0d10', padding: '12px 24px', borderRadius: 8, fontSize: 24, fontWeight: 700 }}>Approve</span>
          <span style={{ background: palette.surface, color: palette.text, padding: '12px 24px', borderRadius: 8, fontSize: 24, fontWeight: 700, border: `1px solid ${palette.borderBright}` }}>Deny</span>
        </div>
      </div>
    </div>
    <p style={{ fontSize: 30, color: palette.muted, marginTop: 36, maxWidth: 1700 }}>
      No webhook handlers, no button-action routing. The primitive owns it.
    </p>
    <Footer index={16} label="ACT III · CHANNELS" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 17 — The whole point
// ════════════════════════════════════════════════════════════════════════════
const WholePoint: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <div style={{ fontSize: 28, fontFamily: font.mono, color: palette.accent, letterSpacing: '0.3em' }}>
      ACT IV · 10 MIN
    </div>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 96,
        fontWeight: 800,
        margin: '24px 0 48px',
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        maxWidth: 1700,
      }}
    >
      Together, they're a body.
    </h2>
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontFamily: font.mono, fontSize: 32, color: palette.textSoft, flexWrap: 'wrap' }}>
      <span style={{ color: palette.blue }}>Slack</span>
      <span style={{ color: palette.dim }}>──→</span>
      <span style={{ background: palette.surface, padding: '14px 28px', borderRadius: 10, border: `1px solid ${palette.border}`, color: palette.text }}>Agent</span>
      <span style={{ color: palette.dim }}>──→</span>
      <span style={{ color: palette.accent }}>Browser</span>
      <span style={{ color: palette.dim }}>──→</span>
      <span style={{ color: palette.muted }}>website</span>
      <span style={{ color: palette.dim }}>──→</span>
      <span style={{ color: palette.muted }}>result</span>
      <span style={{ color: palette.dim }}>──→</span>
      <span style={{ color: palette.blue }}>Slack</span>
    </div>
    <p style={{ fontSize: 36, color: palette.textSoft, marginTop: 56, maxWidth: 1600, lineHeight: 1.4 }}>
      The same agent. One reaches out, one reaches in. Both directions, ~50 lines of code.
    </p>
    <Footer index={17} label="ACT IV · COMBINING" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 18 — DEMO 3
// ════════════════════════════════════════════════════════════════════════════
const Demo3: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(900px 500px at 50% 50%, ${palette.accent}22 0%, transparent 60%)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <Eyebrow>Live demo · the payoff</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 156,
          fontWeight: 900,
          lineHeight: 0.95,
          margin: '24px 0 24px',
          letterSpacing: '-0.04em',
        }}
      >
        Demo 3: <span style={{ color: palette.accent }}>both, together</span>.
      </h1>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 10,
          padding: '20px 28px',
          fontFamily: font.mono,
          fontSize: 30,
          color: palette.textSoft,
          maxWidth: 1500,
        }}
      >
        @bot find me a flight to SFO under $400
      </div>
    </div>
    <Footer index={18} label="ACT IV · COMBINING · DEMO" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 19 — What you just saw
// ════════════════════════════════════════════════════════════════════════════
const WhatYouSaw: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <Eyebrow>What you just saw</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 72,
        fontWeight: 800,
        margin: '20px 0 28px',
        letterSpacing: '-0.025em',
        lineHeight: 1.05,
      }}
    >
      The whole agent.
    </h2>
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        padding: '28px 36px',
        fontFamily: font.mono,
        fontSize: 24,
        lineHeight: 1.7,
        color: palette.textSoft,
        maxWidth: 1700,
      }}
    >
      <div>const concierge = new Agent(&#123;</div>
      <div>{'  '}name: 'concierge',</div>
      <div>{'  '}instructions: 'Help users find flights and post results.',</div>
      <div>{'  '}model: openai('gpt-4o'),</div>
      <div>{'  '}<span style={{ color: palette.accent }}>browser: new AgentBrowser()</span>,</div>
      <div>{'  '}<span style={{ color: palette.blue }}>channels: &#123; adapters: &#123; slack: createSlackAdapter() &#125; &#125;</span>,</div>
      <div>&#125;);</div>
    </div>
    <p style={{ fontSize: 32, color: palette.muted, marginTop: 40, maxWidth: 1700, lineHeight: 1.4 }}>
      No webhook handlers. No selectors. No threading logic. Two primitives, plugged in.
    </p>
    <Footer index={19} label="ACT IV · COMBINING" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 20 — Recap
// ════════════════════════════════════════════════════════════════════════════
const Recap: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <div style={{ fontSize: 28, fontFamily: font.mono, color: palette.accent, letterSpacing: '0.3em' }}>
      ACT V · CLOSE
    </div>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 100,
        fontWeight: 800,
        margin: '24px 0 48px',
        letterSpacing: '-0.03em',
        lineHeight: 1.04,
      }}
    >
      Two interfaces.<br />
      That's the whole talk.
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 14, padding: '28px 32px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 22, color: palette.accent, letterSpacing: '0.2em' }}>OUTBOUND</div>
        <div style={{ fontSize: 44, fontWeight: 800, fontFamily: font.display, marginTop: 8 }}>Browser</div>
        <div style={{ fontSize: 28, color: palette.textSoft, marginTop: 8 }}>The agent reaches the world.</div>
      </div>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 14, padding: '28px 32px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 22, color: palette.blue, letterSpacing: '0.2em' }}>INBOUND</div>
        <div style={{ fontSize: 44, fontWeight: 800, fontFamily: font.display, marginTop: 8 }}>Channels</div>
        <div style={{ fontSize: 28, color: palette.textSoft, marginTop: 8 }}>The world reaches the agent.</div>
      </div>
    </div>
    <p style={{ fontSize: 34, color: palette.text, marginTop: 48, maxWidth: 1700 }}>
      Pick one. Build something this week.
    </p>
    <Footer index={20} label="ACT V · CLOSE" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 21 — Resources + Q&A
// ════════════════════════════════════════════════════════════════════════════
const Resources: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 120px' }}>
    <Eyebrow>Where to go next</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 96,
        fontWeight: 800,
        margin: '20px 0 40px',
        letterSpacing: '-0.03em',
        lineHeight: 1.04,
      }}
    >
      Questions.
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 1700 }}>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: '24px 28px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 22, color: palette.accent, letterSpacing: '0.18em' }}>DOCS</div>
        <div style={{ fontSize: 32, marginTop: 10, color: palette.textSoft, lineHeight: 1.5 }}>
          mastra.ai/docs/browser<br />
          mastra.ai/docs/agents/channels
        </div>
      </div>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: '24px 28px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 22, color: palette.blue, letterSpacing: '0.18em' }}>EXAMPLE</div>
        <div style={{ fontSize: 32, marginTop: 10, color: palette.textSoft, lineHeight: 1.5 }}>
          examples/08-browser-channels-workshop
        </div>
      </div>
    </div>
    <p style={{ fontSize: 32, color: palette.muted, marginTop: 48 }}>Thanks. ✦</p>
    <Footer index={21} label="ACT V · CLOSE" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// Speaker notes — what to actually say at each slide
// ════════════════════════════════════════════════════════════════════════════
export const meta: SlideMeta = {
  title: 'Mastra · Browser & Channels',
};

export const notes: (string | undefined)[] = [
    // 01 Cover
    `Welcome them. State the deal up front: 60 minutes, two primitives, three live demos. By the end they'll know when to reach for each, and they'll have seen both running.`,
    // 02 Brain in a jar
    `The setup. Get them to feel that an LLM by itself is a text predictor — useful, but disembodied. Ask: "How many of you have wired an LLM up to do something in the real world? How well did it go the first time?" Wait for laughter.`,
    // 03 Two directions
    `This slide is the spine of the whole talk. Outbound = agent does something out there. Inbound = something out there talks to the agent. Every other slide hangs off this distinction. Say it twice.`,
    // 04 Section: Browser
    `Hard pivot. Twenty minutes on outbound. We'll start with what it looks like when you DON'T have a primitive — the pain — then show the trick that makes it tractable, then run it.`,
    // 05 Naive browser
    `Don't read the bullets — point at them. Most of the audience has hit at least two of these. The punchline is the last one: "you've written a Playwright wrapper, badly, in production."`,
    // 06 Insight: a11y tree
    `The big idea. The browser ALREADY builds a structured tree for screen readers. We just hand that to the LLM, with stable refs. The LLM never sees pixels or HTML. Show the example and pause — it's small but it's the whole insight.`,
    // 07 The loop
    `Walk through the four steps slowly. Make the point that the LLM never sees a webpage — it sees a list of things and a set of verbs. That's why it works. Tee up the demo: "let's watch one run."`,
    // 08 DEMO 1 — flight search
    `SWITCH TO TERMINAL. Don't read the slide. Run the flight-search agent. Narrate: "snapshot — see the refs — pick one — click — snapshot again." Keep it under 5 minutes. If a step fails, that's GREAT, talk through what the agent does next. Come back to slides.`,
    // 09 Cache trick
    `Now the technical "ooh." Browser state changes every step. If you patch URL into the system prompt, you blow the prompt cache every turn. Mastra injects state as a fresh user message inside <browser-state> tags — prefix stays cached. Real money: 10x cheaper sessions. This is the kind of detail that builds trust.`,
    // 10 AgentBrowser vs Stagehand
    `Reach for AgentBrowser first — it's cheap, fast, deterministic. Reach for Stagehand when refs aren't enough (visual things, complex pages, you want natural language). Both speak the same agent interface; you can swap them.`,
    // 11 Section: Channels
    `Switch gears. Twenty minutes on inbound. Same shape: pain → insight → demo → "the part nobody talks about" → "the cool part."`,
    // 12 Naive channels
    `Same exercise — read the bullets aloud, watch heads nod. The Slack SDK is fine; the problem is everything around it: threading, signatures, retries, multi-user. Two weeks gone before your agent does anything.`,
    // 13 Insight: adapters
    `Show the agent definition. Read it line by line. Point at the channels block. The agent has no idea it's on Slack — that's an adapter. Swap it for Discord, same agent, different platform. THAT'S the primitive.`,
    // 14 DEMO 2 — Slack thread summary
    `SWITCH TO SLACK. Show a noisy thread. @-mention the bot. Watch it pull history, summarize, reply in-thread. Point out: it's a real Slack app, real OAuth, real signatures — Mastra handled all of it. Under 5 minutes.`,
    // 15 Threads + multi-user
    `The part everyone gets wrong on their own. Three humans and a bot are talking. Mastra prefixes every message with sender + platform ID, so the agent knows who said what. And — critically — when humans are talking to EACH OTHER, the agent stays silent. That behavior alone is worth the primitive.`,
    // 16 Approval cards
    `The "oh nice" moment. Add requireApproval: true to a tool. The tool call renders as an interactive card with Approve / Deny buttons. No webhook handlers, no button-action routing — the primitive owns it. Demo this in Slack if you have time.`,
    // 17 The whole point
    `Pull it together. Slack message → agent → browser → website → result → Slack. The agent reaches in to listen, reaches out to act. Both directions, one primitive each.`,
    // 18 DEMO 3 — combined
    `THE PAYOFF. SWITCH TO SLACK. @-mention the bot with "find me a flight to SFO under $400." Watch the agent open a browser, navigate, click, extract, post results back to Slack. This is what you came for. Take your time.`,
    // 19 What you just saw
    `Show the actual Agent definition. Two lines: browser, channels. That's the whole agent that just did all of that. Land the punchline: "two primitives, plugged in, no glue code."`,
    // 20 Recap
    `Recap the spine. Outbound = Browser. Inbound = Channels. That's the talk. Tell them to pick one and build something this week. Specificity matters — give them homework.`,
    // 21 Resources / Q&A
    `Drop the docs links and the example repo. Open the floor. Have one or two prompts ready in case it's quiet: "what's the first thing you'd build with this?" or "anyone tried wiring an LLM to a website before — what broke?"`,
];

export default [
  Cover,
  BrainInJar,
  TwoDirections,
  SectionBrowser,
  NaiveBrowser,
  InsightA11y,
  SnapshotLoop,
  Demo1,
  CacheTrick,
  TwoFlavors,
  SectionChannels,
  NaiveChannels,
  InsightAdapters,
  Demo2,
  ThreadsMultiUser,
  ApprovalCards,
  WholePoint,
  Demo3,
  WhatYouSaw,
  Recap,
  Resources,
] satisfies Page[];
