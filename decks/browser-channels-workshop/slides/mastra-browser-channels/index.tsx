import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import abhiAvatar from './assets/abhi-avatar.jpg';

// ─── Design tokens (panel-tweakable) ─────────────────────────────────────────
// Matches mastra.ai/dev/kitchen-sink:
//   bg #020202, foreground #d9d9d9, primary #18fb6f.
//   greed/geistMono are the brand fonts; Geist is a close, freely-available stand-in.
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
    hero: 168,
    body: 36,
  },
  radius: 12,
};

// ─── Local palette + fonts ───────────────────────────────────────────────────
// Layered grays follow the kitchen-sink --bg-N / --text-N / --border-N scales.
const palette = {
  bg: design.palette.bg,
  text: design.palette.text,
  accent: design.palette.accent,
  surface: '#0a0a0a',     // --bg-9
  surfaceHi: '#161616',   // --bg-2
  border: '#171717',      // --border-6
  borderBright: '#343434',// --border-1
  textSoft: '#a9a9a9',    // --text-4
  muted: '#757575',       // --text-9
  dim: '#5c5c5c',         // --text-8
  green: design.palette.accent, // primary green
  amber: '#e3b758',
  blue: '#6aa8ff',
  rose: '#ff7a89',
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

const TOTAL = 24;

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
    <span>MASTRA · BROWSER + CHANNELS</span>
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
          `radial-gradient(1100px 600px at 18% 22%, ${palette.accent}1a 0%, transparent 60%),` +
          `radial-gradient(900px 500px at 82% 78%, ${palette.surfaceHi} 0%, transparent 65%)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <Eyebrow>Mastra Workshop</Eyebrow>
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
        A cursor
        <br />
        and <span style={{ color: palette.accent }}>an inbox.</span>
      </h1>
      <p style={{ fontSize: 40, color: palette.textSoft, maxWidth: 1400, lineHeight: 1.35 }}>
        Two primitives every agent needs: <b style={{ color: palette.text }}>Browser</b> to drive a screen, <b style={{ color: palette.text }}>Channels</b> to be reachable.
      </p>
    </div>
    <Footer index={1} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 02 — About me
// ════════════════════════════════════════════════════════════════════════════
const AboutMe: Page = () => (
  <div
    style={{
      ...fill,
      padding: '120px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(900px 600px at 30% 40%, ${palette.accent}12 0%, transparent 65%)`,
      }}
    />

    <div style={{ position: 'relative' }}>
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 20,
          color: palette.accent,
          letterSpacing: '0.32em',
        }}
      >
        WHO'S TALKING
      </div>

      {/* Avatar + name row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 56,
          marginTop: 36,
        }}
      >
        <div
          style={{
            width: 260,
            height: 260,
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            border: `2px solid ${palette.accent}`,
            boxShadow: `0 0 0 8px ${palette.accent}1a, 0 18px 50px rgba(0,0,0,0.45)`,
          }}
        >
          <img
            src={abhiAvatar}
            alt="Abhi Aiyer"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h1
            style={{
              fontFamily: font.display,
              fontSize: 168,
              fontWeight: 900,
              lineHeight: 0.9,
              margin: 0,
              letterSpacing: '-0.04em',
            }}
          >
            Abhi Aiyer
          </h1>
          <p
            style={{
              fontSize: 40,
              color: palette.textSoft,
              lineHeight: 1.2,
              margin: 0,
              fontWeight: 500,
            }}
          >
            CTO &amp; Co-Founder,{' '}
            <span style={{ color: palette.accent }}>Mastra</span>
          </p>
        </div>
      </div>

      {/* Handles strip */}
      <div
        style={{
          marginTop: 64,
          display: 'flex',
          gap: 56,
          fontFamily: font.mono,
          fontSize: 24,
          letterSpacing: '0.18em',
          color: palette.muted,
          textTransform: 'uppercase',
          paddingTop: 32,
          borderTop: `1px solid ${palette.border}`,
        }}
      >
        <span>
          <span style={{ color: palette.accent }}>X</span>{' '}
          <span style={{ color: palette.text }}>@abhiaiyer</span>
        </span>
        <span>
          <span style={{ color: palette.accent }}>WEB</span>{' '}
          <span style={{ color: palette.text }}>mastra.ai</span>
        </span>
        <span>
          <span style={{ color: palette.accent }}>GH</span>{' '}
          <span style={{ color: palette.text }}>github.com/mastra-ai</span>
        </span>
      </div>
    </div>

    <Footer index={2} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 03 — Brain in a jar
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
      An LLM on its own
      <br />
      is just a <span style={{ color: palette.accent }}>chat window</span>.
    </h2>
    <p style={{ fontSize: 38, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.45 }}>
      It can reason. It can plan. It can write beautifully. But it can't book a flight, read your Slack, or click a button. To do any of that, it needs to <b style={{ color: palette.text }}>reach out</b> and <b style={{ color: palette.text }}>be reached</b>.
    </p>
    <Footer index={3} />
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
    <Footer index={4} />
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
        OUTBOUND →
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
    <Footer index={5} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — The naive attempt
// ════════════════════════════════════════════════════════════════════════════
const NaiveBrowser: Page = () => {
  const Row = ({ label, children, last = false }: { label: string; children: React.ReactNode; last?: boolean }) => (
    <li style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 48, alignItems: 'baseline', padding: '20px 0', borderTop: `1px solid ${palette.border}`, ...(last ? { borderBottom: `1px solid ${palette.border}` } : {}) }}>
      <div style={{ fontFamily: font.mono, fontSize: 24, color: palette.accent, letterSpacing: '0.18em' }}>{label}</div>
      <div style={{ fontSize: 32, lineHeight: 1.35, color: palette.textSoft }}>{children}</div>
    </li>
  );
  return (
    <div style={{ ...fill, padding: '120px 120px 120px' }}>
      <Eyebrow color={palette.rose}>The integration problem</Eyebrow>
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 68,
          fontWeight: 800,
          margin: '20px 0 28px',
          letterSpacing: '-0.025em',
          lineHeight: 1.08,
          maxWidth: 1600,
        }}
      >
        Browser automation is solved.<br />
        Plugging it into an <i style={{ color: palette.accent, fontStyle: 'normal' }}>agent</i> isn't.
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <Row label="LIFECYCLE">
          When does Chrome launch? Close? Per tool call, per conversation, or never?
        </Row>
        <Row label="SCOPE">
          Two users hit your agent at once. Do they share a tab? <b style={{ color: palette.text }}>That's a privacy bug.</b>
        </Row>
        <Row label="VISIBILITY">
          The user wants to <b style={{ color: palette.text }}>watch</b> the agent work. Now you're streaming a live browser into your UI.
        </Row>
        <Row label="CONTEXT" last>
          The agent forgets what page it's on between steps. You inject URL + title into every prompt by hand.
        </Row>
      </ul>
      <div style={{ marginTop: 28, fontSize: 32, fontFamily: font.mono, color: palette.text }}>
        Pick a browser tool. <span style={{ color: palette.accent }}>Mastra owns everything around it.</span>
      </div>
      <Footer index={6} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 06 — The substrate: how agents read a page
// ════════════════════════════════════════════════════════════════════════════
const HowAgentsRead: Page = () => {
  const Col = ({
    label,
    title,
    body,
    verdict,
    verdictColor,
    accent,
  }: {
    label: string;
    title: string;
    body: string;
    verdict: string;
    verdictColor: string;
    accent?: boolean;
  }) => (
    <div
      style={{
        flex: 1,
        background: palette.surface,
        border: `1px solid ${accent ? palette.accent : palette.border}`,
        borderRadius: 16,
        padding: '28px 28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 18, color: palette.muted, letterSpacing: '0.22em' }}>{label}</div>
      <div style={{ fontFamily: font.display, fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, color: accent ? palette.accent : palette.text }}>
        {title}
      </div>
      <div style={{ fontSize: 22, color: palette.textSoft, lineHeight: 1.45 }}>{body}</div>
      <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: `1px solid ${palette.border}`, fontSize: 20, color: verdictColor, fontFamily: font.mono, letterSpacing: '0.04em' }}>
        {verdict}
      </div>
    </div>
  );
  return (
    <div style={{ ...fill, padding: '100px 120px 100px' }}>
      <Eyebrow>The substrate</Eyebrow>
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 64,
          fontWeight: 800,
          margin: '18px 0 28px',
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
          maxWidth: 1600,
        }}
      >
        How does an agent <i style={{ color: palette.accent, fontStyle: 'normal' }}>read</i> a webpage?
      </h2>
      <div style={{ display: 'flex', gap: 22, alignItems: 'stretch', height: 380 }}>
        <Col
          label="OPTION A"
          title="Raw HTML"
          body="page.content() — the whole DOM as a string."
          verdict="✗  4MB. Buries meaning in markup."
          verdictColor={palette.rose}
        />
        <Col
          label="OPTION B"
          title="Screenshot"
          body="A PNG of the rendered page."
          verdict="✗  Can see a button. Can't target it."
          verdictColor={palette.rose}
        />
        <Col
          label="OPTION C"
          title="Accessibility tree"
          body="The same tree your browser builds for screen readers."
          verdict="✓  Structured. Labeled. Already there."
          verdictColor={palette.accent}
          accent
        />
      </div>
      <div
        style={{
          marginTop: 32,
          background: palette.surfaceHi,
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 20, lineHeight: 1.55, color: palette.textSoft, flex: 1 }}>
          <span style={{ color: palette.muted }}>heading</span> "Welcome back" &nbsp;·&nbsp;
          <span style={{ color: palette.muted }}>textbox</span> "Email" &nbsp;·&nbsp;
          <span style={{ color: palette.muted }}>button</span> "Sign in" &nbsp;·&nbsp;
          <span style={{ color: palette.muted }}>link</span> "Forgot password?"
        </div>
        <div style={{ fontSize: 20, color: palette.text, fontStyle: 'italic', maxWidth: 540, lineHeight: 1.4 }}>
          Your browser already builds this. We hand it to the LLM.
        </div>
      </div>
      <Footer index={7} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 07 — From DOM to a11y tree
// ════════════════════════════════════════════════════════════════════════════
const A11yDecomposition: Page = () => {
  const Reason = ({
    label,
    desc,
  }: {
    label: string;
    desc: React.ReactNode;
  }) => (
    <div
      style={{
        flex: 1,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 16,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: palette.accent,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 19, color: palette.textSoft, lineHeight: 1.4 }}>{desc}</div>
    </div>
  );
  const codeStyle: React.CSSProperties = {
    fontFamily: font.mono,
    fontSize: 17,
    lineHeight: 1.55,
    color: palette.textSoft,
    whiteSpace: 'pre',
    margin: 0,
  };
  return (
    <div style={{ ...fill, padding: '90px 120px 90px' }}>
      <Eyebrow>Why this tree</Eyebrow>
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 60,
          fontWeight: 800,
          margin: '14px 0 22px',
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
        }}
      >
        The browser strips it down for you.
      </h2>

      {/* Decomposition diagram */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px 1fr',
          alignItems: 'stretch',
          gap: 0,
          marginBottom: 22,
        }}
      >
        {/* Left: DOM */}
        <div
          style={{
            background: palette.surfaceHi,
            border: `1px solid ${palette.border}`,
            borderTop: `3px solid ${palette.rose}`,
            borderRadius: 12,
            padding: '18px 22px 16px',
          }}
        >
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 14,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: palette.rose,
              marginBottom: 12,
            }}
          >
            DOM · what the browser parses
          </div>
          <pre style={codeStyle}>
{`<div class="card login">
  <div class="header">
    <h1 class="title">Welcome back</h1>
  </div>
  <form class="form">
    <div class="field">
      <label for="e">Email</label>
      <input id="e" type="email"
        class="input input--lg" />
    </div>
    <div role="button" tabindex="0"
      class="btn btn--primary"
      onclick="submit()">
      Sign in
    </div>
  </form>
</div>`}
          </pre>
          <div style={{ marginTop: 10, fontFamily: font.mono, fontSize: 14, color: palette.dim }}>
            ~10,000 nodes on a real page
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 28,
              color: palette.accent,
              fontWeight: 700,
            }}
          >
            →
          </div>
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: palette.dim,
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            a11y engine
          </div>
        </div>

        {/* Right: A11y tree */}
        <div
          style={{
            background: palette.surfaceHi,
            border: `1px solid ${palette.border}`,
            borderTop: `3px solid ${palette.accent}`,
            borderRadius: 12,
            padding: '18px 22px 16px',
          }}
        >
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 14,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: palette.accent,
              marginBottom: 12,
            }}
          >
            A11y tree · what the agent sees
          </div>
          <pre style={codeStyle}>
{`heading "Welcome back"  [@e1]
textbox "Email"         [@e2]
button  "Sign in"       [@e3]`}
          </pre>
          <div style={{ marginTop: 10, fontFamily: font.mono, fontSize: 14, color: palette.dim }}>
            ~200 meaningful ones
          </div>
        </div>
      </div>

      {/* Four reasons */}
      <div style={{ display: 'flex', gap: 14 }}>
        <Reason
          label="Semantic"
          desc={
            <>
              A button is a button — whether it's{' '}
              <span style={{ fontFamily: font.mono, color: palette.text }}>{'<button>'}</span> or{' '}
              <span style={{ fontFamily: font.mono, color: palette.text }}>{'<div onclick>'}</span>.
            </>
          }
        />
        <Reason
          label="Compact"
          desc={<>10,000 DOM nodes collapse to ~200 meaningful ones.</>}
        />
        <Reason
          label="Actionable"
          desc={<>Only what a user can interact with. Decorative junk filtered out.</>}
        />
        <Reason
          label="Stable"
          desc={<>Survives redesigns. CSS selectors and coordinates don't.</>}
        />
      </div>

      <p style={{ fontSize: 20, color: palette.muted, marginTop: 18, fontStyle: 'italic', lineHeight: 1.4 }}>
        This is why every modern browser-agent — Mastra's or anyone else's — converges on the a11y tree.
      </p>
      <Footer index={8} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 08 — Who built each tool
// ════════════════════════════════════════════════════════════════════════════
const Companies: Page = () => {
  const Row = ({
    company,
    accentColor,
    tool,
    blurb,
  }: {
    company: string;
    accentColor: string;
    tool: string;
    blurb: string;
  }) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '380px 320px 1fr',
        alignItems: 'center',
        gap: 32,
        padding: '28px 32px',
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
      }}
    >
      <div
        style={{
          fontFamily: font.display,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: accentColor,
        }}
      >
        {company}
      </div>
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 22,
          color: palette.text,
          letterSpacing: '0.02em',
        }}
      >
        {tool}
      </div>
      <div
        style={{
          fontSize: 24,
          color: palette.textSoft,
          lineHeight: 1.45,
        }}
      >
        {blurb}
      </div>
    </div>
  );
  return (
    <div style={{ ...fill, padding: '110px 120px 110px' }}>
      <Eyebrow>Who built each tool</Eyebrow>
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 76,
          fontWeight: 800,
          margin: '20px 0 44px',
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
        }}
      >
        You have <i style={{ color: palette.accent, fontStyle: 'normal' }}>options</i>.
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Row
          company="Vercel Labs"
          accentColor={palette.accent}
          tool="agent-browser"
          blurb="Open-source Node CLI + npm package. Pioneered the accessibility-tree + ref pattern."
        />
        <Row
          company="Browserbase"
          accentColor={palette.amber}
          tool="Stagehand · browse-cli"
          blurb="Managed browser cloud (anti-bot, captcha, session replay). Stagehand is their open-source AI-driven SDK."
        />
        <Row
          company="Browser Use"
          accentColor={palette.blue}
          tool="browser-use"
          blurb="YC company building the most-starred open-source browser-agent framework. Python CLI."
        />
      </div>
      <p
        style={{
          marginTop: 36,
          fontSize: 26,
          color: palette.muted,
          maxWidth: 1500,
          lineHeight: 1.4,
          fontStyle: 'italic',
        }}
      >
        Three companies, three tools, three philosophies. Mastra's job is the socket, not the automation.
      </p>
      <Footer index={9} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 08 — MastraBrowser: the socket
// ════════════════════════════════════════════════════════════════════════════
const MastraBrowserPrimitive: Page = () => {
  const Pill = ({
    label,
    desc,
    color,
  }: {
    label: string;
    desc: string;
    color: string;
  }) => (
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 16,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 18, color: palette.textSoft, lineHeight: 1.35 }}>{desc}</div>
    </div>
  );
  const Provider = ({ name, color }: { name: string; color: string }) => (
    <div
      style={{
        flex: 1,
        background: palette.surfaceHi,
        border: `1px solid ${palette.border}`,
        borderTop: `3px solid ${color}`,
        borderRadius: 12,
        padding: '14px 18px',
        textAlign: 'center',
        fontFamily: font.mono,
        fontSize: 22,
        color: palette.text,
      }}
    >
      {name}
    </div>
  );
  return (
    <div style={{ ...fill, padding: '100px 120px 100px' }}>
      <Eyebrow>The Mastra interface</Eyebrow>
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 72,
          fontWeight: 800,
          margin: '18px 0 12px',
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
        }}
      >
        <span style={{ fontFamily: font.mono, color: palette.accent, fontWeight: 700 }}>MastraBrowser</span> is the socket.
      </h2>
      <p style={{ fontSize: 26, color: palette.textSoft, margin: '0 0 28px', maxWidth: 1500, lineHeight: 1.4 }}>
        An abstract base class. Every provider implements <span style={{ fontFamily: font.mono, color: palette.text }}>getTools()</span>; the base class owns everything that lives outside the automation.
      </p>

      {/* Diagram */}
      <div
        style={{
          background: palette.surfaceHi,
          border: `1px solid ${palette.border}`,
          borderRadius: 16,
          padding: '30px 36px 32px',
        }}
      >
        {/* Top row: four responsibilities */}
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 14,
            letterSpacing: '0.22em',
            color: palette.dim,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          What the base class owns
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <Pill label="Lifecycle" desc="ensureReady() · launch · close · cleanup" color={palette.accent} />
          <Pill label="Scope" desc="thread vs shared · ThreadManager · per-user isolation" color={palette.accent} />
          <Pill label="Context" desc="inject URL + title into prompt · cache-safe" color={palette.accent} />
          <Pill label="Screencast" desc="CDP frame stream → Studio" color={palette.accent} />
        </div>

        {/* Center socket */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '22px 0 18px',
          }}
        >
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 30,
              fontWeight: 700,
              color: palette.accent,
              padding: '14px 28px',
              border: `2px solid ${palette.accent}`,
              borderRadius: 12,
              background: 'rgba(24, 251, 111, 0.06)',
              letterSpacing: '0.02em',
            }}
          >
            MastraBrowser
          </div>
        </div>

        {/* Plug-in arrow */}
        <div
          style={{
            textAlign: 'center',
            fontFamily: font.mono,
            fontSize: 14,
            letterSpacing: '0.22em',
            color: palette.dim,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          ↓ Providers plug in here ↓
        </div>

        {/* Bottom row: three providers */}
        <div style={{ display: 'flex', gap: 14 }}>
          <Provider name="AgentBrowser" color={palette.accent} />
          <Provider name="StagehandBrowser" color={palette.amber} />
          <Provider name="BrowserViewer" color={palette.blue} />
        </div>
      </div>

      <p style={{ fontSize: 22, color: palette.muted, marginTop: 18, lineHeight: 1.4, fontStyle: 'italic' }}>
        Same agent code regardless of which one you pick. Swap providers, keep your agent.
      </p>
      <Footer index={10} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 09 — The cast: three providers
// ════════════════════════════════════════════════════════════════════════════
const TheCast: Page = () => {
  const Card = ({
    name,
    accentColor,
    tagline,
    body,
    foot,
  }: {
    name: string;
    accentColor: string;
    tagline: string;
    body: React.ReactNode;
    foot: string;
  }) => (
    <div
      style={{
        flex: 1,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 16,
        padding: '28px 28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ fontFamily: font.display, fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, color: accentColor }}>
        {name}
      </div>
      <div style={{ fontFamily: font.mono, fontSize: 18, color: palette.muted, letterSpacing: '0.04em' }}>{tagline}</div>
      <div style={{ fontSize: 22, color: palette.textSoft, lineHeight: 1.45, marginTop: 4 }}>{body}</div>
      <div
        style={{
          marginTop: 'auto',
          paddingTop: 12,
          borderTop: `1px solid ${palette.border}`,
          fontFamily: font.mono,
          fontSize: 18,
          color: palette.textSoft,
          letterSpacing: '0.04em',
        }}
      >
        {foot}
      </div>
    </div>
  );
  return (
    <div style={{ ...fill, padding: '100px 120px 100px' }}>
      <Eyebrow>The cast</Eyebrow>
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 64,
          fontWeight: 800,
          margin: '18px 0 28px',
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
          maxWidth: 1600,
        }}
      >
        Three providers. <i style={{ color: palette.accent, fontStyle: 'normal' }}>Three strategies.</i>
      </h2>
      <div style={{ display: 'flex', gap: 22, alignItems: 'stretch', height: 470 }}>
        <Card
          name="AgentBrowser"
          accentColor={palette.accent}
          tagline="SDK · @mastra/agent-browser"
          body={
            <>
              Snapshot the page, point at an element by ref, act.
              <br />
              <span style={{ color: palette.muted }}>
                <span style={{ fontFamily: font.mono, color: palette.amber }}>browser_click({'{'}ref:'@e1'{'}'})</span> — your agent's LLM picks.
              </span>
            </>
          }
          foot="Cheap. Fast. Deterministic."
        />
        <Card
          name="StagehandBrowser"
          accentColor={palette.amber}
          tagline="SDK · @mastra/stagehand"
          body={
            <>
              Talk to the page in English. Stagehand's own LLM resolves the sentence to a DOM node.
              <br />
              <span style={{ color: palette.muted }}>
                <span style={{ fontFamily: font.mono, color: palette.amber }}>stagehand_act("click sign in")</span>
              </span>
            </>
          }
          foot="Survives redesigns. Costs more tokens."
        />
        <Card
          name="BrowserViewer"
          accentColor={palette.blue}
          tagline="CLI tool, not an SDK"
          body={
            <>
              Bring your own CLI. Mastra launches Chrome and injects the CDP URL.
              <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', fontFamily: font.mono, fontSize: 19, color: palette.textSoft, lineHeight: 1.55 }}>
                <li><span style={{ color: palette.muted }}>›</span> agent-browser <span style={{ color: palette.dim }}>(Vercel Labs)</span></li>
                <li><span style={{ color: palette.muted }}>›</span> browser-use <span style={{ color: palette.dim }}>(Python)</span></li>
                <li><span style={{ color: palette.muted }}>›</span> browse-cli <span style={{ color: palette.dim }}>(Browserbase)</span></li>
              </ul>
            </>
          }
          foot="For CLI-driven agents."
        />
      </div>
      <div
        style={{
          marginTop: 28,
          background: palette.surfaceHi,
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
          padding: '20px 28px',
          fontSize: 22,
          color: palette.textSoft,
          lineHeight: 1.4,
        }}
      >
        All three plug into <span style={{ fontFamily: font.mono, color: palette.accent }}>MastraBrowser</span> — lifecycle, thread scope, screencast, context injection. <span style={{ color: palette.text, fontStyle: 'italic' }}>Handled once.</span>
      </div>
      <Footer index={11} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 11 — The loop
// ════════════════════════════════════════════════════════════════════════════
const SnapshotLoop: Page = () => {
  const Card = ({
    n,
    t,
    sub,
    body,
  }: {
    n: string;
    t: string;
    sub: string;
    body: React.ReactNode;
  }) => (
    <div
      style={{
        flex: 1,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        padding: '28px 26px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 20, color: palette.accent, letterSpacing: '0.2em' }}>{n}</div>
      <div style={{ fontFamily: font.mono, fontSize: 34, fontWeight: 700 }}>{t}</div>
      <div style={{ fontSize: 22, color: palette.muted, lineHeight: 1.35, fontFamily: font.mono, letterSpacing: '0.04em' }}>{sub}</div>
      <div style={{ fontSize: 22, color: palette.textSoft, lineHeight: 1.45, marginTop: 4 }}>{body}</div>
    </div>
  );
  return (
    <div style={{ ...fill, padding: '110px 120px 110px' }}>
      <Eyebrow>The loop the agent runs</Eyebrow>
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 80,
          fontWeight: 800,
          margin: '20px 0 48px',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
        }}
      >
        Observe. Reason. Act. Repeat.
      </h2>
      <div style={{ display: 'flex', gap: 22, alignItems: 'stretch' }}>
        <Card
          n="01"
          t="observe"
          sub="snapshot the a11y tree"
          body="Read what's on screen — the roles, names, and states the browser exposes."
        />
        <Card
          n="02"
          t="reason"
          sub="decide the next action"
          body="Pick a target by what it is, not where it is. A button named 'Sign in.' A textbox named 'Email.'"
        />
        <Card
          n="03"
          t="act"
          sub="touch the page"
          body={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div><span style={{ color: palette.accent, fontFamily: font.mono }}>click</span> a node by ref</div>
              <div><span style={{ color: palette.accent, fontFamily: font.mono }}>type</span> into a textbox</div>
              <div><span style={{ color: palette.accent, fontFamily: font.mono }}>select</span> a dropdown option</div>
            </div>
          }
        />
        <Card
          n="04"
          t="repeat"
          sub="observe the new tree"
          body="The page changed. New refs, new state. Loop until the task is done."
        />
      </div>
      <p style={{ fontSize: 30, color: palette.muted, marginTop: 44, maxWidth: 1600, lineHeight: 1.4 }}>
        The model never sees pixels or HTML. It sees a list of things it can touch, and the names of the actions.
      </p>
      <Footer index={12} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 10 — DEMO 1
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
      <Eyebrow>Live demo</Eyebrow>
      <div style={{ fontSize: 30, fontFamily: font.mono, color: palette.muted, marginTop: 24, letterSpacing: '0.12em' }}>
        TERMINAL ↗
      </div>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 152,
          fontWeight: 900,
          lineHeight: 0.95,
          margin: '24px 0 24px',
          letterSpacing: '-0.04em',
        }}
      >
        Demo 1: <span style={{ color: palette.accent }}>search for flights</span>.
      </h1>
      <p style={{ fontSize: 38, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.35 }}>
        One agent. One tool: <Code>browser</Code>. We point it at Google Flights, let the loop drive — observe the page, fill the form, observe again, pull out the options — and the agent reads the results back to us in chat.
      </p>
    </div>
    <Footer index={14} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 12 — The cache trick (browser state injection)
// ════════════════════════════════════════════════════════════════════════════
const CacheTrick: Page = () => {
  // Visual building block: a stylized chat message in the model's context.
  const Msg = ({
    role,
    body,
    tone = 'normal',
  }: {
    role: string;
    body: React.ReactNode;
    tone?: 'normal' | 'mutated' | 'fresh';
  }) => {
    const accent =
      tone === 'mutated' ? palette.rose : tone === 'fresh' ? palette.green : palette.muted;
    return (
      <div
        style={{
          background: palette.bg,
          border: `1px solid ${tone === 'normal' ? palette.border : `${accent}55`}`,
          borderLeft: `3px solid ${accent}`,
          borderRadius: 8,
          padding: '10px 14px',
          fontFamily: font.mono,
          fontSize: 18,
          lineHeight: 1.45,
          color: palette.textSoft,
        }}
      >
        <div style={{ fontSize: 13, color: accent, letterSpacing: '0.2em', marginBottom: 4 }}>{role}</div>
        <div>{body}</div>
      </div>
    );
  };

  const Card = ({
    tag,
    tagColor,
    title,
    children,
    foot,
    footColor,
  }: {
    tag: string;
    tagColor: string;
    title: string;
    children: React.ReactNode;
    foot: string;
    footColor: string;
  }) => (
    <div
      style={{
        flex: 1,
        background: palette.surface,
        border: `1px solid ${tagColor}55`,
        borderRadius: 14,
        padding: '24px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 18, color: tagColor, letterSpacing: '0.22em' }}>{tag}</div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: font.display, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
      <div style={{ marginTop: 'auto', paddingTop: 12, fontFamily: font.mono, fontSize: 18, color: footColor, lineHeight: 1.5 }}>
        {foot}
      </div>
    </div>
  );

  return (
    <div style={{ ...fill, padding: '90px 110px 90px' }}>
      <Eyebrow>Keeping the agent grounded</Eyebrow>
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 64,
          fontWeight: 800,
          margin: '14px 0 14px',
          letterSpacing: '-0.025em',
          lineHeight: 1.06,
          maxWidth: 1700,
        }}
      >
        Every turn, the agent needs to know <i style={{ color: palette.accent, fontStyle: 'normal' }}>where it is</i>.
      </h2>
      <p style={{ fontSize: 24, color: palette.muted, maxWidth: 1500, lineHeight: 1.45, marginBottom: 22 }}>
        URL changes. Page title changes. So how do you keep the model up to date — without re-tokenizing the system prompt every turn?
      </p>
      <div style={{ display: 'flex', gap: 22, alignItems: 'stretch', minHeight: 560 }}>
        <Card
          tag="THE NAIVE WAY"
          tagColor={palette.rose}
          title="Rebuild the system prompt with current state."
          foot="→ system bytes change · prefix cache misses · re-tokenize"
          footColor={palette.rose}
        >
          <Msg
            role="TURN 0 · SYSTEM"
            tone="mutated"
            body={
              <>
                You are an agent. Current URL: <span style={{ color: palette.rose }}>https://flights.example.com/</span>
              </>
            }
          />
          <Msg
            role="TURN 1 · SYSTEM"
            tone="mutated"
            body={
              <>
                You are an agent. Current URL: <span style={{ color: palette.rose }}>…/search?from=SFO</span>
              </>
            }
          />
          <Msg
            role="TURN 2 · SYSTEM"
            tone="mutated"
            body={
              <>
                You are an agent. Current URL: <span style={{ color: palette.rose }}>…/results/123</span>
              </>
            }
          />
        </Card>
        <Card
          tag="THE MASTRA WAY"
          tagColor={palette.green}
          title="Stable system. Append one reminder at step 0 of each loop."
          foot="→ system never mutates · prior turns frozen · prefix cacheable"
          footColor={palette.green}
        >
          <Msg role="SYSTEM" body={<>You are an agent. <span style={{ color: palette.muted }}>(set once · never mutated)</span></>} />
          <Msg role="TURN 0 · USER (appended @ step 0)" tone="fresh" body={
            <>
              <span style={{ color: palette.green }}>&lt;system-reminder type="browser-context"&gt;</span><br />
              Current URL: …/search?from=SFO<br />
              <span style={{ color: palette.green }}>&lt;/system-reminder&gt;</span>
            </>
          } />
          <Msg role="TURN 1 · USER (appended @ step 0)" tone="fresh" body={
            <>
              <span style={{ color: palette.green }}>&lt;system-reminder type="browser-context"&gt;</span><br />
              Current URL: …/results/123<br />
              <span style={{ color: palette.green }}>&lt;/system-reminder&gt;</span>
            </>
          } />
        </Card>
      </div>
      <p style={{ fontSize: 22, color: palette.textSoft, marginTop: 22, maxWidth: 1700, lineHeight: 1.45 }}>
        <code style={{ fontFamily: font.mono, color: palette.accent }}>BrowserContextProcessor</code> ships in core — auto-wired by every <code style={{ fontFamily: font.mono, color: palette.accent }}>MastraBrowser</code>. Skips itself if the trailing message is already this exact reminder.
      </p>
      <Footer index={13} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 14 — Section: Channels
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
        ← INBOUND
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
    <Footer index={15} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 15 — What are Channels? (definition + why care)
// ════════════════════════════════════════════════════════════════════════════
const WhatAreChannels: Page = () => {
  const Row = ({
    n,
    label,
    title,
    body,
  }: {
    n: string;
    label: string;
    title: string;
    body: string;
  }) => (
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderLeft: `3px solid ${palette.blue}`,
        borderRadius: 12,
        padding: '24px 32px 26px',
        display: 'grid',
        gridTemplateColumns: '72px 1fr',
        columnGap: 28,
        alignItems: 'start',
      }}
    >
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 28,
          color: palette.blue,
          fontWeight: 600,
          paddingTop: 4,
        }}
      >
        {n}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: font.mono, fontSize: 18, color: palette.blue, letterSpacing: '0.22em' }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: palette.text,
            lineHeight: 1.12,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 26, color: palette.textSoft, lineHeight: 1.4 }}>{body}</div>
      </div>
    </div>
  );

  return (
    <div style={{ ...fill, padding: '70px 120px' }}>
      <Eyebrow color={palette.blue}>What is a channel?</Eyebrow>
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 80,
          fontWeight: 800,
          margin: '18px 0 14px',
          letterSpacing: '-0.03em',
          lineHeight: 1.04,
          maxWidth: 1700,
        }}
      >
        The place your users <span style={{ color: palette.blue }}>already are</span>.
      </h2>
      <p
        style={{
          fontSize: 28,
          color: palette.textSoft,
          lineHeight: 1.4,
          maxWidth: 1640,
          margin: '0 0 26px',
        }}
      >
        A <b style={{ color: palette.text }}>Channel</b> wires your agent into a messaging surface — Slack, Discord,
        Telegram. Plug in <b style={{ color: palette.text }}>one or several</b> on the same agent.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Row
          n="01"
          label="WHY IT MATTERS"
          title="Meet users where they work."
          body="Nobody opens a new tab for your agent. They @-mention it in the thread they're already in."
        />
        <Row
          n="02"
          label="WHAT YOU GET"
          title="The agent loop, addressable."
          body="Threads map to memory. Messages stream live. Tool calls render as approve / deny cards."
        />
        <Row
          n="03"
          label="MULTI-CHANNEL"
          title="One agent, many surfaces."
          body="adapters: { slack, discord, telegram } — same prompt, same tools, same memory. Add a platform without rewriting your agent."
        />
      </div>
      <Footer index={16} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 16 — Naive channels (everything you build without the primitive)
// ════════════════════════════════════════════════════════════════════════════
const NaiveChannels: Page = () => {
  const Row = ({
    accent,
    label,
    title,
    items,
  }: {
    accent: string;
    label: string;
    title: string;
    items: string[];
  }) => (
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 10,
        padding: '26px 32px',
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        columnGap: 40,
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: font.mono, fontSize: 16, color: accent, letterSpacing: '0.18em' }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: palette.text, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
          {title}
        </div>
      </div>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: 12,
          columnGap: 0,
        }}
      >
        {items.map((it, i) => (
          <li
            key={i}
            style={{
              flex: '0 0 50%',
              fontSize: 26,
              color: palette.textSoft,
              lineHeight: 1.35,
              paddingLeft: 22,
              paddingRight: 18,
              position: 'relative',
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 16,
                width: 10,
                height: 1,
                background: palette.muted,
              }}
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div style={{ ...fill, padding: '90px 120px' }}>
      <Eyebrow color={palette.rose}>Without a primitive</Eyebrow>
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 60,
          fontWeight: 800,
          margin: '18px 0 28px',
          letterSpacing: '-0.025em',
          lineHeight: 1.08,
        }}
      >
        "I'll just plug my agent into Slack." Here's the actual checklist:
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Row
          accent={palette.rose}
          label="TRANSPORT"
          title="Get a message in the door."
          items={[
            'Webhook route + 3-second ack window',
            'HMAC signature verification',
            'Retries, dedupe, idempotency',
            'OAuth install + token refresh',
            'Multi-workspace tenancy',
          ]}
        />
        <Row
          accent={palette.amber}
          label="CONVERSATION"
          title="Decide who's talking and to whom."
          items={[
            'DM vs @mention vs thread reply',
            'Map platform thread → memory thread',
            'Backfill the last N messages as context',
            'Tag every message with sender + ID',
            'Stream incremental updates, edit-in-place',
          ]}
        />
        <Row
          accent={palette.blue}
          label="RICH CONTENT"
          title="Everything that isn't plain text."
          items={[
            'Fetch private-CDN attachments with auth',
            'Promote pasted URLs (YouTube, images)',
            'Tool-call cards: approve / deny / resume',
            'Per-platform formatting (mrkdwn / md / HTML)',
            'Reactions: 👀 on start, ✅ on done',
          ]}
        />
      </div>
      <p style={{ fontSize: 24, color: palette.rose, marginTop: 24, fontWeight: 600 }}>
        That's a Slack SDK. You haven't written your agent yet — and Discord's next.
      </p>
      <Footer index={17} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 15 — The insight: adapters
// ════════════════════════════════════════════════════════════════════════════
const InsightAdapters: Page = () => {
  // tiny syntax helpers for the code block
  const kw = (s: string) => <span style={{ color: palette.rose }}>{s}</span>;
  const id = (s: string) => <span style={{ color: palette.text }}>{s}</span>;
  const str = (s: string) => <span style={{ color: palette.green }}>{s}</span>;
  const fn = (s: string) => <span style={{ color: palette.blue }}>{s}</span>;
  const cm = (s: string) => <span style={{ color: palette.muted }}>{s}</span>;
  const pn = (s: string) => <span style={{ color: palette.textSoft }}>{s}</span>;
  const hi = (s: string) => <span style={{ color: palette.accent, fontWeight: 600 }}>{s}</span>;

  return (
    <div style={{ ...fill, padding: '90px 120px' }}>
      <Eyebrow>The insight</Eyebrow>
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 76,
          fontWeight: 800,
          margin: '20px 0 28px',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          maxWidth: 1700,
        }}
      >
        Your agent shouldn't know{' '}
        <span style={{ color: palette.accent }}>it's on Slack.</span>
      </h2>
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
          padding: '28px 36px',
          fontFamily: font.mono,
          fontSize: 24,
          lineHeight: 1.55,
          color: palette.textSoft,
          whiteSpace: 'pre',
        }}
      >
        <div>{kw('import')} {pn('{')} {id('Agent')} {pn('}')} {kw('from')} {str("'@mastra/core/agent'")}</div>
        <div>{kw('import')} {pn('{')} {fn('createSlackAdapter')} {pn('}')} {kw('from')} {str("'@chat-adapter/slack'")}</div>
        <div style={{ height: 14 }} />
        <div>{kw('export const')} {id('supportAgent')} {pn('=')} {kw('new')} {fn('Agent')}({pn('{')}</div>
        <div>  {id('id')}{pn(':')} {str("'support-agent'")}{pn(',')}</div>
        <div>  {id('name')}{pn(':')} {str("'Support Agent'")}{pn(',')}</div>
        <div>  {id('instructions')}{pn(':')} {str("'You are a helpful support assistant.'")}{pn(',')}</div>
        <div>  {id('model')}{pn(':')} {str("'openai/gpt-5.4'")}{pn(',')}</div>
        <div>  {hi('channels')}{pn(':')} {pn('{')}   {cm('// ← the entire integration')}</div>
        <div>    {hi('adapters')}{pn(':')} {pn('{')}</div>
        <div>      {id('slack')}{pn(':')} {fn('createSlackAdapter')}(){pn(',')}</div>
        <div>    {pn('},')}</div>
        <div>  {pn('},')}</div>
        <div>{pn('}')})</div>
      </div>
      <p style={{ fontSize: 28, color: palette.muted, marginTop: 24, maxWidth: 1500, lineHeight: 1.4 }}>
        Swap <Code>slack</Code> for <Code>discord</Code>. Same agent. Different platform.
      </p>
      <Footer index={18} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 16 — DEMO 2
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
      <Eyebrow color={palette.blue}>Live demo</Eyebrow>
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
    <Footer index={19} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 17 — Threads + multi-user
// ════════════════════════════════════════════════════════════════════════════
const ThreadsMultiUser: Page = () => (
  <div style={{ ...fill, padding: '90px 120px' }}>
    <Eyebrow color={palette.blue}>Group threads, solved</Eyebrow>
    <h2
      style={{
        fontFamily: font.display,
        fontSize: 72,
        fontWeight: 800,
        margin: '18px 0 18px',
        letterSpacing: '-0.025em',
        lineHeight: 1.06,
      }}
    >
      Multiple users in one thread —{' '}
      <span style={{ color: palette.blue }}>without confusing the agent.</span>
    </h2>
    <p
      style={{
        fontSize: 26,
        color: palette.textSoft,
        lineHeight: 1.4,
        maxWidth: 1640,
        margin: '0 0 28px',
      }}
    >
      A Slack thread is rarely 1-on-1. People interrupt each other, change their minds, talk past the bot.
      The Channels primitive gives the agent enough context to know <b style={{ color: palette.text }}>who said what</b>
      {' '}— and when to keep its mouth shut.
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'stretch' }}>
      {/* Left: what the channel sees */}
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderTop: `2px solid ${palette.muted}`,
          borderRadius: 12,
          padding: '22px 26px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.muted, letterSpacing: '0.2em' }}>
          IN SLACK
        </div>
        <div style={{ fontFamily: font.mono, fontSize: 22, lineHeight: 1.55, color: palette.textSoft }}>
          <div><b style={{ color: palette.accent }}>Alice</b>: @bot can someone summarize?</div>
          <div><b style={{ color: palette.blue }}>Bob</b>: i've got it, one sec</div>
          <div><b style={{ color: palette.green }}>Carol</b>: nvm bob is on it</div>
          <div style={{ color: palette.muted, marginTop: 8 }}>// agent stays silent</div>
        </div>
      </div>

      {/* Right: what the agent receives */}
      <div
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderTop: `2px solid ${palette.blue}`,
          borderRadius: 12,
          padding: '22px 26px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.blue, letterSpacing: '0.2em' }}>
          WHAT THE AGENT SEES
        </div>
        <div style={{ fontFamily: font.mono, fontSize: 20, lineHeight: 1.55, color: palette.textSoft }}>
          <div><span style={{ color: palette.accent }}>[Alice (@U123ABC)]</span> @bot can someone summarize?</div>
          <div><span style={{ color: palette.blue }}>[Bob (@U456DEF)]</span> i've got it, one sec</div>
          <div><span style={{ color: palette.green }}>[Carol (@U789GHI)]</span> nvm bob is on it</div>
          <div style={{ color: palette.muted, marginTop: 8 }}>
            // system: not every message is for you. respond empty if users are talking to each other.
          </div>
        </div>
      </div>
    </div>

    <ul style={{ listStyle: 'none', padding: 0, margin: '26px 0 0', maxWidth: 1700 }}>
      <Bullet>
        Every line tagged with <Code>name + platform ID</Code> — the agent can address Alice by name without
        guessing who pinged it.
      </Bullet>
      <Bullet>
        On the <b style={{ color: palette.text }}>first @-mention</b> in a thread, Channels backfills the last 10
        messages so the agent isn't dropped in cold.
      </Bullet>
      <Bullet accent>
        On every step, a system reminder tells the agent: <i>stay silent if humans are talking to each other.</i>
      </Bullet>
    </ul>
    <Footer index={20} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 18 — Approval cards
// ════════════════════════════════════════════════════════════════════════════
const ApprovalCards: Page = () => {
  const kw = (s: string) => <span style={{ color: palette.rose }}>{s}</span>;
  const id = (s: string) => <span style={{ color: palette.text }}>{s}</span>;
  const str = (s: string) => <span style={{ color: palette.green }}>{s}</span>;
  const fn = (s: string) => <span style={{ color: palette.blue }}>{s}</span>;
  const cm = (s: string) => <span style={{ color: palette.muted }}>{s}</span>;
  const pn = (s: string) => <span style={{ color: palette.textSoft }}>{s}</span>;
  const lit = (s: string) => <span style={{ color: palette.amber }}>{s}</span>;
  const hi = (s: string) => <span style={{ color: palette.accent, fontWeight: 600 }}>{s}</span>;

  return (
    <div style={{ ...fill, padding: '90px 120px' }}>
      <Eyebrow>Human-in-the-loop</Eyebrow>
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 76,
          fontWeight: 800,
          margin: '20px 0 28px',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
        }}
      >
        Tools that need approval render as <span style={{ color: palette.accent }}>cards</span>.
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 36, alignItems: 'start' }}>
        {/* Code panel */}
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: 12,
            padding: '26px 32px',
            fontFamily: font.mono,
            fontSize: 20,
            lineHeight: 1.55,
            color: palette.textSoft,
            whiteSpace: 'pre',
            overflow: 'hidden',
          }}
        >
          <div>{kw('import')} {pn('{')} {fn('createTool')} {pn('}')} {kw('from')} {str("'@mastra/core/tools'")}</div>
          <div style={{ height: 12 }} />
          <div>{kw('export const')} {id('bookFlight')} {pn('=')} {fn('createTool')}({pn('{')}</div>
          <div>  {id('id')}{pn(':')} {str("'book-flight'")}{pn(',')}</div>
          <div>  {id('description')}{pn(':')} {str("'Book a flight. Charges the card on file.'")}{pn(',')}</div>
          <div>  {id('inputSchema')}{pn(':')} {fn('z')}.{fn('object')}({pn('{')}</div>
          <div>    {id('flightNumber')}{pn(':')} {fn('z')}.{fn('string')}(){pn(',')}</div>
          <div>    {id('origin')}{pn(':')} {fn('z')}.{fn('string')}(){pn(',')}</div>
          <div>    {id('destination')}{pn(':')} {fn('z')}.{fn('string')}(){pn(',')}</div>
          <div>    {id('priceUsd')}{pn(':')} {fn('z')}.{fn('number')}(){pn(',')}</div>
          <div>  {pn('}),')}</div>
          <div>  {hi('requireApproval')}{pn(':')} {lit('true')}{pn(',')}   {cm('// ← gates the call')}</div>
          <div>  {id('execute')}{pn(': async (')}{id('input')}{pn(') =>')} {pn('{')}</div>
          <div>    {kw('return')} {pn('{')} {id('confirmationCode')}{pn(':')} {fn('issueBooking')}({id('input')}) {pn('}')}</div>
          <div>  {pn('},')}</div>
          <div>{pn('}')})</div>
        </div>

        {/* Slack-style card */}
        <div
          style={{
            background: palette.surfaceHi,
            border: `1px solid ${palette.borderBright}`,
            borderRadius: 14,
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 16, color: palette.muted, letterSpacing: '0.2em' }}>
            IN SLACK
          </div>
          <div style={{ fontSize: 26, color: palette.text, fontWeight: 700 }}>
            book-flight
          </div>
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 17,
              color: palette.textSoft,
              background: palette.surface,
              border: `1px solid ${palette.border}`,
              borderRadius: 8,
              padding: '12px 14px',
              lineHeight: 1.6,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            <div>flightNumber: <span style={{ color: palette.green }}>"UA 234"</span></div>
            <div>origin: <span style={{ color: palette.green }}>"SFO"</span></div>
            <div>destination: <span style={{ color: palette.green }}>"JFK"</span></div>
            <div>priceUsd: <span style={{ color: palette.amber }}>389</span></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <span
              style={{
                background: palette.green,
                color: '#0b0d10',
                padding: '12px 22px',
                borderRadius: 8,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Approve
            </span>
            <span
              style={{
                background: palette.surface,
                color: palette.text,
                padding: '12px 22px',
                borderRadius: 8,
                fontSize: 20,
                fontWeight: 700,
                border: `1px solid ${palette.borderBright}`,
              }}
            >
              Deny
            </span>
          </div>
          <div
            style={{
              fontSize: 16,
              color: palette.muted,
              fontFamily: font.mono,
              marginTop: 4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            // click → tool resumes → agent continues
          </div>
        </div>
      </div>
      <p style={{ fontSize: 26, color: palette.muted, marginTop: 28, maxWidth: 1700, lineHeight: 1.4 }}>
        No webhook handlers. No button-action routing. The agent suspends until the human clicks —
        Channels owns the loop on both sides.
      </p>
      <Footer index={21} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 19 — The whole point
// ════════════════════════════════════════════════════════════════════════════
const WholePoint: Page = () => {
  // Horizontal round-trip diagram.
  // Top row: outbound flow (Slack in → Agent → Browser → Website).
  // Return arc above the row carries the reply back to Slack.
  // Each step is a stacked card: label on top, role caption below.
  // Inbound steps (Slack in / reply) are blue; outbound (Browser / Website) are green.

  type Step = {
    label: string;
    sub: string;
    color: string;
    side: 'in' | 'out';
  };
  const steps: Step[] = [
    { label: 'Slack', sub: 'USER @-MENTIONS', color: palette.blue, side: 'in' },
    { label: 'Agent', sub: 'ONE DEFINITION', color: palette.text, side: 'out' },
    { label: 'Browser', sub: 'AGENT DRIVES', color: palette.accent, side: 'out' },
    { label: 'Website', sub: 'READS RESULTS', color: palette.muted, side: 'out' },
    { label: 'Slack', sub: 'REPLY POSTED', color: palette.blue, side: 'in' },
  ];

  const arrows: Array<{ label: string; color: string }> = [
    { label: 'reaches in', color: palette.blue },
    { label: 'drives', color: palette.accent },
    { label: 'reads', color: palette.accent },
    { label: 'reply', color: palette.blue },
  ];

  return (
    <div style={{ ...fill, padding: '120px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(900px 600px at 50% 70%, ${palette.accent}0d 0%, transparent 65%)`,
        }}
      />

      {/* Title block */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 20,
            color: palette.accent,
            letterSpacing: '0.32em',
          }}
        >
          ↻  THE WHOLE POINT
        </div>
        <h2
          style={{
            fontFamily: font.display,
            fontSize: 112,
            fontWeight: 900,
            margin: '20px 0 28px',
            letterSpacing: '-0.04em',
            lineHeight: 0.98,
          }}
        >
          A cursor <i style={{ color: palette.accent, fontStyle: 'normal' }}>and</i> an inbox.
        </h2>
        <p
          style={{
            fontSize: 28,
            color: palette.textSoft,
            lineHeight: 1.45,
            margin: 0,
            maxWidth: 1400,
          }}
        >
          One agent definition. <b style={{ color: palette.blue }}>Channels</b> let the world reach in.{' '}
          <b style={{ color: palette.accent }}>Browser</b> lets the agent reach out. The loop runs forever, on its own.
        </p>
      </div>

      {/* Horizontal flow */}
      <div
        style={{
          position: 'relative',
          marginTop: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        {steps.flatMap((s, i) => [
          (
            <div
              key={`step-${i}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                minWidth: 200,
              }}
            >
              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  border: `2px solid ${s.color}`,
                  background: palette.surface,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: font.display,
                  fontSize: 36,
                  fontWeight: 800,
                  color: palette.text,
                  letterSpacing: '-0.02em',
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: font.mono,
                  fontSize: 14,
                  letterSpacing: 3,
                  color: s.color,
                  textTransform: 'uppercase',
                }}
              >
                {s.sub}
              </div>
            </div>
          ),
          i < steps.length - 1 ? (
              <div
                key={`arr-${i}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    fontFamily: font.mono,
                    fontSize: 16,
                    letterSpacing: 4,
                    color: arrows[i].color,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  {arrows[i].label}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 2,
                    background: arrows[i].color,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      right: -2,
                      top: -7,
                      width: 0,
                      height: 0,
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      borderLeft: `12px solid ${arrows[i].color}`,
                    }}
                  />
                </div>
              </div>
            ) : null,
        ])}
      </div>

      {/* Caption strip */}
      <div
        style={{
          marginTop: 64,
          display: 'flex',
          gap: 48,
          fontFamily: font.mono,
          fontSize: 18,
          letterSpacing: 2,
          color: palette.muted,
          textTransform: 'uppercase',
        }}
      >
        <span>
          <span style={{ color: palette.blue }}>●</span> channels — reach in
        </span>
        <span>
          <span style={{ color: palette.accent }}>●</span> browser — reach out
        </span>
      </div>

      <Footer index={22} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 20 — DEMO 3
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
    <Footer index={23} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 23 — Resources + Q&A
// ════════════════════════════════════════════════════════════════════════════
const Resources: Page = () => {
  const links = [
    {
      label: 'DOCS',
      title: 'mastra.ai',
      href: 'https://mastra.ai',
      color: palette.accent,
    },
    {
      label: 'STAR US ★',
      title: 'github.com/mastra-ai/mastra',
      href: 'https://github.com/mastra-ai/mastra',
      color: palette.accent,
    },
    {
      label: 'FOLLOW ME',
      title: '@abhiaiyer on X',
      href: 'https://x.com/abhiaiyer',
      color: palette.blue,
    },
    {
      label: 'THESE SLIDES',
      title: 'github.com/mastra-ai/workshops',
      href: 'https://github.com/mastra-ai/workshops',
      color: palette.blue,
    },
  ];

  return (
    <div
      style={{
        ...fill,
        padding: '120px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(900px 600px at 50% 50%, ${palette.accent}1a 0%, transparent 65%)`,
        }}
      />

      <div style={{ position: 'relative' }}>
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 22,
            color: palette.accent,
            letterSpacing: '0.32em',
          }}
        >
          ✦  THAT'S A WRAP
        </div>
        <h1
          style={{
            fontFamily: font.display,
            fontSize: 220,
            fontWeight: 900,
            lineHeight: 0.92,
            margin: '24px 0 24px',
            letterSpacing: '-0.05em',
          }}
        >
          Thank <span style={{ color: palette.accent }}>you.</span>
        </h1>
        <p
          style={{
            fontSize: 32,
            color: palette.textSoft,
            lineHeight: 1.45,
            margin: '0 0 56px',
            maxWidth: 1200,
          }}
        >
          Now go give your agents a cursor and an inbox.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            maxWidth: 1600,
          }}
        >
          {links.map(l => (
            <div
              key={l.href}
              style={{
                background: palette.surface,
                border: `1px solid ${palette.border}`,
                borderRadius: 14,
                padding: '28px 32px',
              }}
            >
              <div
                style={{
                  fontFamily: font.mono,
                  fontSize: 18,
                  color: l.color,
                  letterSpacing: '0.24em',
                }}
              >
                {l.label}
              </div>
              <div
                style={{
                  fontFamily: font.display,
                  fontSize: 36,
                  fontWeight: 800,
                  color: palette.text,
                  letterSpacing: '-0.02em',
                  marginTop: 8,
                }}
              >
                {l.title}
              </div>
              <div
                style={{
                  fontFamily: font.mono,
                  fontSize: 18,
                  color: palette.muted,
                  marginTop: 6,
                  wordBreak: 'break-all',
                }}
              >
                {l.href}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer index={24} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// Speaker notes — what to actually say at each slide
// ════════════════════════════════════════════════════════════════════════════
export const meta: SlideMeta = {
  title: 'Mastra · Browser & Channels',
};

export const notes: (string | undefined)[] = [
    // 01 Cover
    `Welcome them. State the deal up front: 60 minutes, two primitives, three live demos. By the end they'll know when to reach for each, and they'll have seen both running.`,
    // 02 About me
    `Quick intro. Abhi Aiyer, CTO and co-founder of Mastra. Spent the last few years thinking about agents in production — what breaks, what's worth abstracting, what isn't. Today's talk is two of the things we decided were worth abstracting. If you want to push back on either, find me on X (@abhiaiyer) or on the GitHub.`,
    // 03 Brain in a jar
    `The setup. Get them to feel that an LLM by itself is a text predictor — useful, but disembodied. Ask: "How many of you have wired an LLM up to do something in the real world? How well did it go the first time?" Wait for laughter.`,
    // 04 Two directions
    `This slide is the spine of the whole talk. Outbound = agent does something out there. Inbound = something out there talks to the agent. Every other slide hangs off this distinction. Say it twice.`,
    // 05 Section: Browser
    `Hard pivot. Twenty minutes on outbound. We'll start with what it looks like when you DON'T have a primitive — the pain — then show the trick that makes it tractable, then run it.`,
    // 06 Naive browser
    `Don't read the bullets — point at them. Most of the audience has hit at least two of these. The punchline is the last one: "you've written a Playwright wrapper, badly, in production."`,
    // 07 The substrate — how agents read a page
    `Three options on the table: raw HTML, screenshot, accessibility tree. Walk left to right. Raw HTML — too big, no semantics. Screenshot — pretty, can't be acted on. Accessibility tree — already built, already labeled, already filtered to interactive elements. Pause on the example strip at the bottom. "Your browser builds this for screen readers. We just hand it to the LLM." This is the foundational insight; everything else in this section is a strategy on top of it.`,
    // 08 From DOM to a11y tree — why this tree
    `Now show what that decomposition actually looks like. On the left, a normal-looking login card — divs nested in divs, classes everywhere, an onclick handler pretending to be a button. On the right, the same UI as the agent sees it: three lines. heading, textbox, button. With refs. That arrow in the middle is your browser's accessibility engine — already running, already maintaining this tree for screen readers. Then walk the four reasons, fast. Semantic: a button is a button regardless of how the dev wrote it. Compact: ten thousand DOM nodes become two hundred meaningful ones. Actionable: only the things a user can touch make it through. Stable: redesigns don't break it; CSS selectors and pixel coordinates do. Land it: every serious browser-agent — Mastra's, Stagehand's, browser-use's — converges on this tree. Now you know why.`,
    // 09 Companies — who built each tool
    `Open up the landscape. You have options. Vercel Labs publishes agent-browser — the original a11y-tree + ref pattern, npm package and skill. Browserbase built Stagehand (their open-source AI-driven SDK) and browse-cli, on top of their managed browser cloud. Browser Use is a YC company shipping the most-starred OSS browser-agent framework — Python CLI. Three companies, three tools, three philosophies. Mastra's job is the socket: the thing that makes any of them work cleanly inside an agent. That's the next slide.`,
    // 10 MastraBrowser — the socket
    `Here's the socket. MastraBrowser is an abstract base class. Every provider — AgentBrowser, StagehandBrowser, BrowserViewer — extends it and implements getTools(). The base class owns the four things you'd otherwise re-implement every time: Lifecycle (when does Chrome launch and close, how do we recover from a crashed profile lock), Scope (one shared browser for the whole agent vs one per thread for multi-user privacy), Context (URL and title injected into the prompt every step, without breaking prompt cache — that's the trick we'll cover later), and Screencast (a CDP frame stream into Studio so the user can watch). Everything below the diagram plugs in. Same agent code regardless of which provider you pick. THAT is the primitive.`,
    // 11 The cast — three providers
    `Now meet the cast. Three providers ship in Mastra, each with a different shape. AgentBrowser — SDK, deterministic, your LLM picks elements by ref. StagehandBrowser — SDK, AI-powered, Stagehand's own LLM resolves natural language. BrowserViewer — different beast: not an SDK at all, it's for agents driving a CLI tool. You bring agent-browser, browser-use, or browse-cli; Mastra launches Chrome and hands the CLI a CDP URL. The strip at the bottom is the punchline: all three plug into the same socket you just saw — lifecycle, scope, screencast, context, handled once. Pick the one that fits your use case.`,
    // 12 The loop
    `Observe, reason, act, repeat. Observe — snapshot the a11y tree to understand what's on screen. Reason — decide what action to take based on roles, names, and states (a button named "Sign in", a textbox named "Email"). Act — click a node by ref, type into a textbox, select a dropdown option. Repeat — observe the updated tree after the action; the page just changed, so the refs change too. Make the point: the LLM never sees pixels or HTML. It sees a list of things it can touch, and the names of the actions. That's the whole loop. Tee up the demo: "let's watch one run."`,
    // 13 Cache trick — keeping the agent grounded
    `Before we run the loop, the question that comes up in every browser-agent build: how does the agent know where it is, every step? The page changes — URL, title, refs, all of it. Set this up. Then walk through the two columns. NAIVE: patch state into the system prompt. Looks fine, until you realize the system prompt is the FIRST thing the model sees. Change it once and the entire prefix has to be re-tokenized. Every step. You're paying full price for every turn. THE MASTRA WAY: BrowserContextProcessor — runs at step 0 of each agent loop call. Stable stuff (provider, sessionId, headless) goes into a system message, set once. Per-request stuff (currentUrl, pageTitle) gets appended as a NEW user message wrapped in <system-reminder type="browser-context">. The system prompt and all the history before it stay byte-identical, so the prompt cache hits. There's also dedup: if the trailing message is already a reminder with the same URL, it's skipped — no churn for no-op steps. Punchline: the agent gets fresh state every turn, and the cache never notices. This kind of detail is why you reach for a primitive instead of building it yourself.`,
    // 14 DEMO 1 — flight search
    `SWITCH TO TERMINAL. Don't read the slide. Run the flight-search agent. Narrate: "snapshot — see the refs — pick one — click — snapshot again." Keep it under 5 minutes. If a step fails, that's GREAT, talk through what the agent does next. Come back to slides.`,
    // 15 Section: Channels
    `Switch gears. Twenty minutes on inbound. Same shape: pain → insight → demo → "the part nobody talks about" → "the cool part."`,
    // 16 What is a channel?
    `Set the definition before the pain. A channel is a two-way bridge between your agent and a messaging surface — Slack, Discord, Telegram. Why it matters: nobody opens a new tab for your agent; they @-mention it in the thread they're already in. What you get: threads map to memory, messages stream live, tool calls render as approve/deny cards, reactions track progress. Why it's a primitive: same agent, swap the adapter — Slack today, Discord tomorrow, Teams next quarter, no prompt rewrite. Now we can earn the pain on the next slide.`,
    // 17 Naive channels
    `Walk the three columns left-to-right. TRANSPORT: webhook, 3-sec ack, signatures, OAuth, multi-tenancy — pure plumbing. CONVERSATION: this is where the agent actually thinks — DM vs mention, threads mapped to memory, backfill, multi-user tagging, streaming. RICH CONTENT: private-CDN attachments, URL promotion, tool-approval cards, per-platform formatting, reactions. End on the punchline: "you've built a Slack SDK, the agent doesn't exist yet, and Discord is next." Sets up the adapter insight.`,
    // 18 Insight: adapters
    `Show the agent definition. Read it line by line. Point at the channels block. The agent has no idea it's on Slack — that's an adapter. Swap it for Discord, same agent, different platform. THAT'S the primitive.`,
    // 19 DEMO 2 — Slack thread summary
    `SWITCH TO SLACK. Show a noisy thread. @-mention the bot. Watch it pull history, summarize, reply in-thread. Point out: it's a real Slack app, real OAuth, real signatures — Mastra handled all of it. Under 5 minutes.`,
    // 20 Threads + multi-user
    `The reality of group chat. Walk through both panels. LEFT: what humans see in Slack — Alice asks, Bob answers, Carol cancels, the bot didn't need to say anything. RIGHT: what the channel hands to the agent on every turn. Two pieces of context. First, every message is prefixed with name + platform ID, so the model can address Alice as Alice without inventing a sender. Second, a system reminder injected each step that says "not every message is for you; if humans are talking to each other, respond empty." That's the behavior people get wrong when they wire Slack themselves — they assume every message in a subscribed thread is a prompt. Channels frames it correctly so the model knows when to be quiet. Land the bullet about first-mention backfill: the agent gets the last 10 messages of context so it isn't dropped in cold.`,
    // 21 Approval cards
    `The "oh nice" moment. Add requireApproval: true to a tool. The tool call renders as an interactive card with Approve / Deny buttons. No webhook handlers, no button-action routing — the primitive owns it. Demo this in Slack if you have time.`,
    // 22 The whole point
    `Pull it together. Slack message → agent → browser → website → result → Slack. The agent reaches in to listen, reaches out to act. Both directions, one primitive each.`,
    // 23 DEMO 3 — combined
    `THE PAYOFF. SWITCH TO SLACK. @-mention the bot with "find me a flight to SFO under $400." Watch the agent open a browser, navigate, click, extract, post results back to Slack. This is what you came for. Take your time.`,
    // 24 Resources / Q&A
    `Drop the docs links and the example repo. Open the floor. Have one or two prompts ready in case it's quiet: "what's the first thing you'd build with this?" or "anyone tried wiring an LLM to a website before — what broke?"`,
];

export default [
  Cover,
  AboutMe,
  BrainInJar,
  TwoDirections,
  SectionBrowser,
  NaiveBrowser,
  HowAgentsRead,
  A11yDecomposition,
  Companies,
  MastraBrowserPrimitive,
  TheCast,
  SnapshotLoop,
  CacheTrick,
  Demo1,
  SectionChannels,
  WhatAreChannels,
  NaiveChannels,
  InsightAdapters,
  Demo2,
  ThreadsMultiUser,
  ApprovalCards,
  WholePoint,
  Demo3,
  Resources,
] satisfies Page[];
