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

// ─── Local (non-tweakable) palette extensions ────────────────────────────────
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

// ─── Reusable atoms ──────────────────────────────────────────────────────────
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

const Footer = ({ index, total, label }: { index: number; total: number; label: string }) => (
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
      {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
    </span>
  </div>
);

const TOTAL = 21;

// ════════════════════════════════════════════════════════════════════════════
// 01 — Cover
// ════════════════════════════════════════════════════════════════════════════
const Cover: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    {/* Background grain */}
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
          fontSize: 224,
          fontWeight: 900,
          lineHeight: 0.94,
          letterSpacing: '-0.04em',
          margin: '36px 0 28px',
        }}
      >
        Browser
        <span style={{ color: palette.muted, fontWeight: 300 }}> & </span>
        Channels
      </h1>
      <p style={{ fontSize: 40, color: palette.textSoft, maxWidth: 1400, lineHeight: 1.35, margin: 0 }}>
        The two primitives that connect a Mastra agent to the outside world.
      </p>
      <div style={{ marginTop: 80, display: 'flex', gap: 56, fontFamily: font.mono, fontSize: 22, color: palette.muted }}>
        <span>
          <span style={{ color: palette.accent }}>→</span> Two demos
        </span>
        <span>
          <span style={{ color: palette.accent }}>→</span> Source-grounded
        </span>
        <span>
          <span style={{ color: palette.accent }}>→</span> Q&A at the end
        </span>
      </div>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 02 — What "primitive" means
// ════════════════════════════════════════════════════════════════════════════
const PrimitiveDef: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>01</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 96, fontWeight: 800, margin: '24px 0 56px', lineHeight: 1.05 }}>
      What "primitive" means here
    </h2>
    <ol
      style={{
        fontSize: 36,
        lineHeight: 1.5,
        color: palette.textSoft,
        listStyle: 'none',
        counterReset: 'p',
        padding: 0,
        margin: 0,
        maxWidth: 1500,
      }}
    >
      {[
        'Lives in @mastra/core with a stable interface.',
        'Has multiple providers in their own packages.',
        'Hooks into the agent loop via input processors.',
        'Owns its own lifecycle and state.',
      ].map((line, i) => (
        <li
          key={i}
          style={{
            counterIncrement: 'p',
            display: 'flex',
            gap: 32,
            alignItems: 'baseline',
            marginBottom: 28,
          }}
        >
          <span style={{ fontFamily: font.mono, fontSize: 24, color: palette.accent, minWidth: 56 }}>
            0{i + 1}
          </span>
          <span>{line}</span>
        </li>
      ))}
    </ol>
    <Footer index={2} total={TOTAL} label="Why primitives" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 03 — The two outside-world problems
// ════════════════════════════════════════════════════════════════════════════
const TwoProblems: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>The problem</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 88, fontWeight: 800, margin: '24px 0 64px', lineHeight: 1.05, maxWidth: 1500 }}>
      Two things humans take for granted.
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
      {[
        { num: '01', title: 'Use a browser', body: 'Read and act on the web.', tag: 'Browser' },
        { num: '02', title: 'Talk to people', body: 'Where they already are.', tag: 'Channels' },
      ].map(p => (
        <div
          key={p.num}
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: design.radius,
            padding: 56,
          }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 22, color: palette.accent, letterSpacing: '0.18em' }}>
            {p.num} · {p.tag.toUpperCase()}
          </div>
          <div style={{ fontFamily: font.display, fontSize: 64, fontWeight: 800, margin: '24px 0 16px', lineHeight: 1.1 }}>
            {p.title}
          </div>
          <div style={{ fontSize: 32, color: palette.textSoft, lineHeight: 1.4 }}>{p.body}</div>
        </div>
      ))}
    </div>
    <Footer index={3} total={TOTAL} label="Why primitives" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 04 — Without primitives, you rebuild this
// ════════════════════════════════════════════════════════════════════════════
const Rebuild: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>Without primitives</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 80, fontWeight: 800, margin: '24px 0 56px', lineHeight: 1.05, maxWidth: 1600 }}>
      Every team rebuilds the same plumbing.
    </h2>
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        fontSize: 32,
        lineHeight: 1.55,
        color: palette.textSoft,
        maxWidth: 1600,
      }}
    >
      {[
        'Playwright glue. Profile lock cleanup. Orphan process killing.',
        'Slack signatures. Dedupe. Typing indicators. Approval UIs.',
        'Prompt-cache-friendly context injection.',
        'Thread state and subscription management.',
      ].map(l => (
        <li
          key={l}
          style={{
            display: 'flex',
            gap: 28,
            alignItems: 'baseline',
            marginBottom: 22,
            paddingBottom: 22,
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          <span style={{ color: palette.accent, fontFamily: font.mono }}>—</span>
          <span>{l}</span>
        </li>
      ))}
    </ul>
    <Footer index={4} total={TOTAL} label="Why primitives" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 05 — Section: Browser
// ════════════════════════════════════════════════════════════════════════════
const SectionBrowser: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(1200px 600px at 70% 50%, ${palette.accent}22 0%, transparent 60%)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <Eyebrow>Part one</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 280,
          fontWeight: 900,
          lineHeight: 0.92,
          letterSpacing: '-0.04em',
          margin: '32px 0 28px',
        }}
      >
        Browser
      </h1>
      <p style={{ fontSize: 40, color: palette.textSoft, maxWidth: 1400, margin: 0, lineHeight: 1.35 }}>
        The agent loop, the snapshot/ref trick, and the prompt-cache discipline that makes it cheap.
      </p>
    </div>
    <Footer index={5} total={TOTAL} label="Browser" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 06 — Browser architecture
// ════════════════════════════════════════════════════════════════════════════
const BrowserArchitecture: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>packages/core/src/browser/</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 76, fontWeight: 800, margin: '24px 0 56px', lineHeight: 1.05 }}>
      Architecture
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, fontSize: 28, lineHeight: 1.45 }}>
      {[
        ['MastraBrowser', 'Abstract base. Lifecycle, scope, tools, screencast.'],
        ['ThreadManager', 'Owns sessions per thread, or one shared instance.'],
        ['BrowserContextProcessor', 'Injects browser state into the agent loop.'],
        ['ScreencastStream', 'CDP frames over WebSocket → Studio.'],
        ['cli-handler', 'CDP injection for CLI subprocess agents.'],
        ['errors / cleanup', 'Profile lock files, orphan process groups.'],
      ].map(([name, desc]) => (
        <div
          key={name}
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: design.radius,
            padding: '28px 32px',
          }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 24, color: palette.accent, marginBottom: 8 }}>
            {name}
          </div>
          <div style={{ color: palette.textSoft }}>{desc}</div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 40, fontFamily: font.mono, fontSize: 22, color: palette.muted }}>
      Lifecycle: pending → launching → ready → error → closing → closed
    </div>
    <Footer index={6} total={TOTAL} label="Browser" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 07 — Two paradigms
// ════════════════════════════════════════════════════════════════════════════
const Paradigms: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>Same base class</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 80, fontWeight: 800, margin: '24px 0 64px', lineHeight: 1.05 }}>
      Three providers, two paradigms.
    </h2>
    <div
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: design.radius,
        overflow: 'hidden',
        fontSize: 28,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1.6fr 0.7fr 0.9fr',
          background: palette.surfaceHi,
          padding: '24px 32px',
          fontFamily: font.mono,
          fontSize: 22,
          color: palette.muted,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        <span>Provider</span>
        <span>How it targets</span>
        <span>Cost</span>
        <span>Reliability</span>
      </div>
      {[
        ['AgentBrowser', 'Accessibility refs (@e1, @e2)', 'Low', 'High', palette.green],
        ['Stagehand', 'Natural language', 'High', 'Variable', palette.amber],
        ['BrowserViewer', 'Injects CDP into CLI tools', 'Low', 'High', palette.blue],
      ].map(([name, how, cost, rel, color]) => (
        <div
          key={name}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1.6fr 0.7fr 0.9fr',
            padding: '32px',
            borderTop: `1px solid ${palette.border}`,
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 700, color }}>{name}</span>
          <span style={{ color: palette.textSoft }}>{how}</span>
          <span style={{ color: palette.textSoft }}>{cost}</span>
          <span style={{ color: palette.textSoft }}>{rel}</span>
        </div>
      ))}
    </div>
    <p style={{ marginTop: 40, fontSize: 28, color: palette.muted, maxWidth: 1500, lineHeight: 1.4 }}>
      Default to AgentBrowser. Reach for Stagehand when targets are genuinely fuzzy. Use BrowserViewer for workspace agents.
    </p>
    <Footer index={7} total={TOTAL} label="Browser" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 08 — The snapshot/ref loop
// ════════════════════════════════════════════════════════════════════════════
const SnapshotLoop: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>The most important idea</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 84, fontWeight: 800, margin: '24px 0 56px', lineHeight: 1.05 }}>
      The snapshot/ref loop.
    </h2>
    <pre
      style={{
        margin: 0,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: design.radius,
        padding: 48,
        fontFamily: font.mono,
        fontSize: 32,
        lineHeight: 1.5,
        color: palette.textSoft,
        maxWidth: 1600,
      }}
    >
{`1.  browser_snapshot()
    → "[link    ref=e3] Sign in"
    → "[textbox ref=e7] Email"
    → ...

2.  browser_click({ ref: '@e3' })

3.  browser_snapshot()        ← verify the new state`}
    </pre>
    <p style={{ marginTop: 36, fontSize: 28, color: palette.muted, maxWidth: 1500, lineHeight: 1.4 }}>
      Refs come from the accessibility tree — what screen readers use. Stable, semantic, language-aware.
    </p>
    <Footer index={8} total={TOTAL} label="Browser" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 09 — Why it beats the alternatives
// ════════════════════════════════════════════════════════════════════════════
const WhyRefs: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>Why it wins</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 76, fontWeight: 800, margin: '24px 0 56px', lineHeight: 1.05 }}>
      Cheaper than NL. Tougher than selectors.
    </h2>
    <div
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: design.radius,
        overflow: 'hidden',
        fontSize: 28,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          background: palette.surfaceHi,
          padding: '24px 32px',
          fontFamily: font.mono,
          fontSize: 22,
          color: palette.muted,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        <span>Approach</span>
        <span>Brittle</span>
        <span>Tokens</span>
        <span>Auditable</span>
      </div>
      {[
        ['CSS selectors', 'High', 'Low', 'Low', palette.muted],
        ['XPath', 'High', 'Low', 'Low', palette.muted],
        ['Natural language only', 'Med', 'High', 'Med', palette.amber],
        ['Snapshot + refs', 'Low', 'Low', 'High', palette.green],
      ].map(([name, b, t, a, c]) => (
        <div
          key={name}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
            padding: '28px 32px',
            borderTop: `1px solid ${palette.border}`,
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 700, color: c }}>{name}</span>
          <span style={{ color: palette.textSoft }}>{b}</span>
          <span style={{ color: palette.textSoft }}>{t}</span>
          <span style={{ color: palette.textSoft }}>{a}</span>
        </div>
      ))}
    </div>
    <p style={{ marginTop: 40, fontSize: 26, color: palette.muted, maxWidth: 1500, lineHeight: 1.4 }}>
      NL re-reasons every action. Refs are picked once, then reused. Refs in the transcript = full audit trail.
    </p>
    <Footer index={9} total={TOTAL} label="Browser" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 10 — Context processor: the cache trick
// ════════════════════════════════════════════════════════════════════════════
const CacheTrick: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>BrowserContextProcessor</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 72, fontWeight: 800, margin: '24px 0 48px', lineHeight: 1.05 }}>
      The two-phase prompt-cache trick.
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      {[
        {
          tag: 'Phase 1 · processInput',
          when: 'once per request',
          code: `// STABLE system message
You have access to a browser
(agent-browser).
Session ID: ab-1778106399658`,
          note: 'Never changes → prompt-cacheable.',
          color: palette.green,
        },
        {
          tag: 'Phase 2 · processInputStep',
          when: 'step 0 only',
          code: `// APPENDED user message
<system-reminder
  type="browser-context">
  Current URL: example.com
  Page title: Sign in
</system-reminder>`,
          note: 'Appended, not mutated. Cache stays valid.',
          color: palette.blue,
        },
      ].map(p => (
        <div
          key={p.tag}
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: design.radius,
            padding: 36,
          }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 22, color: p.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {p.tag}
          </div>
          <div style={{ fontSize: 22, color: palette.muted, marginTop: 6, marginBottom: 24 }}>{p.when}</div>
          <pre
            style={{
              margin: 0,
              fontFamily: font.mono,
              fontSize: 22,
              lineHeight: 1.45,
              color: palette.textSoft,
              background: palette.bg,
              padding: 24,
              borderRadius: 8,
            }}
          >
            {p.code}
          </pre>
          <div style={{ marginTop: 20, fontSize: 24, color: palette.textSoft }}>{p.note}</div>
        </div>
      ))}
    </div>
    <p style={{ marginTop: 36, fontSize: 26, color: palette.muted, maxWidth: 1500, lineHeight: 1.4 }}>
      The processor also dedupes a trailing reminder so the same URL isn't re-injected.
    </p>
    <Footer index={10} total={TOTAL} label="Browser" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 11 — Scope + screencast
// ════════════════════════════════════════════════════════════════════════════
const ScopeAndScreencast: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>Configuration</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 72, fontWeight: 800, margin: '24px 0 48px', lineHeight: 1.05 }}>
      Scope &nbsp;·&nbsp; Screencast
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: design.radius, padding: 36 }}>
        <div style={{ fontFamily: font.mono, fontSize: 22, color: palette.accent, letterSpacing: '0.1em' }}>SCOPE</div>
        <pre style={{ margin: '20px 0 0', fontFamily: font.mono, fontSize: 22, lineHeight: 1.55, color: palette.textSoft }}>
{`{ scope: 'thread' }
   one browser per thread (default local)

{ scope: 'shared' }
   one browser for all threads

{ cdpUrl, scope: 'thread' }
   ❌ TypeScript error`}
        </pre>
        <div style={{ marginTop: 24, fontSize: 22, color: palette.muted }}>
          BrowserConfig is a discriminated union — invalid combos fail at compile time.
        </div>
      </div>
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: design.radius, padding: 36 }}>
        <div style={{ fontFamily: font.mono, fontSize: 22, color: palette.accent, letterSpacing: '0.1em' }}>SCREENCAST</div>
        <ul style={{ margin: '20px 0 0', padding: 0, listStyle: 'none', fontSize: 24, lineHeight: 1.55, color: palette.textSoft }}>
          <li>CDP <code style={{ fontFamily: font.mono, color: palette.text }}>Page.startScreencast</code></li>
          <li>JPEG/PNG frames → WebSocket → Studio</li>
          <li>format · quality · maxWidth · maxHeight · everyNthFrame</li>
          <li>Defaults: jpeg, q=80, 1280×720</li>
          <li style={{ color: palette.amber, marginTop: 12 }}>Disabled in serverless (needs ws + @hono/node-ws)</li>
        </ul>
      </div>
    </div>
    <p style={{ marginTop: 36, fontSize: 26, color: palette.muted, maxWidth: 1500, lineHeight: 1.4 }}>
      The same CDP plumbing connects to remote browsers — Browserless, Browserbase, hosted Chromium.
    </p>
    <Footer index={11} total={TOTAL} label="Browser" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 12 — Browser demo
// ════════════════════════════════════════════════════════════════════════════
const BrowserDemo: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Eyebrow>Demo</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 96, fontWeight: 800, margin: '24px 0 32px', lineHeight: 1.0, maxWidth: 1600 }}>
      "Cheapest direct SFO → JFK next Friday."
    </h2>
    <ol
      style={{
        listStyle: 'none',
        padding: 0,
        margin: '32px 0 0',
        fontSize: 32,
        lineHeight: 1.6,
        color: palette.textSoft,
        counterReset: 'd',
        maxWidth: 1500,
      }}
    >
      {[
        <span key="1">
          <code style={{ fontFamily: font.mono, color: palette.accent }}>browser: new AgentBrowser({'{'} headless: false {'}'})</code> — one line.
        </span>,
        'Studio screencast pane lights up.',
        <span key="3">Transcript: <code style={{ fontFamily: font.mono, color: palette.text }}>goto → snapshot → click(@e12) → re-snapshot</code>.</span>,
        'If a ref goes stale: a fresh snapshot is the recovery path.',
      ].map((t, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            gap: 28,
            alignItems: 'baseline',
            marginBottom: 16,
          }}
        >
          <span style={{ fontFamily: font.mono, fontSize: 22, color: palette.accent, minWidth: 48 }}>0{i + 1}</span>
          <span>{t}</span>
        </li>
      ))}
    </ol>
    <Footer index={12} total={TOTAL} label="Browser" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 13 — Section: Channels
// ════════════════════════════════════════════════════════════════════════════
const SectionChannels: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(1200px 600px at 30% 50%, ${palette.blue}22 0%, transparent 60%)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <Eyebrow color={palette.blue}>Part two</Eyebrow>
      <h1
        style={{
          fontFamily: font.display,
          fontSize: 280,
          fontWeight: 900,
          lineHeight: 0.92,
          letterSpacing: '-0.04em',
          margin: '32px 0 28px',
        }}
      >
        Channels
      </h1>
      <p style={{ fontSize: 40, color: palette.textSoft, maxWidth: 1500, margin: 0, lineHeight: 1.35 }}>
        Webhooks, the stream consumer, and the rules that keep a bot from spamming #general.
      </p>
    </div>
    <Footer index={13} total={TOTAL} label="Channels" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 14 — Channels architecture
// ════════════════════════════════════════════════════════════════════════════
const ChannelsArch: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>packages/core/src/channels/</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 76, fontWeight: 800, margin: '24px 0 56px', lineHeight: 1.05 }}>
      Architecture
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, fontSize: 28, lineHeight: 1.45 }}>
      {[
        ['AgentChannels', 'Wires adapters to an agent. Consumes the agent\u2019s fullStream. Posts back.'],
        ['ChatChannelProcessor', 'Per-step input processor. Platform identity + stay-silent rule.'],
        ['MastraStateAdapter', 'Dedupe + subscriptions, persisted via Mastra storage.'],
        ['formatting.ts', 'Tool-call cards, approval prompts, error rendering.'],
      ].map(([name, desc]) => (
        <div
          key={name}
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: design.radius,
            padding: '28px 32px',
          }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 24, color: palette.blue, marginBottom: 8 }}>{name}</div>
          <div style={{ color: palette.textSoft }}>{desc}</div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 40, fontFamily: font.mono, fontSize: 22, color: palette.muted }}>
      Route per adapter: /api/agents/{'{agentId}'}/channels/{'{platform}'}/webhook
    </div>
    <Footer index={14} total={TOTAL} label="Channels" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 15 — Minimal Slack agent
// ════════════════════════════════════════════════════════════════════════════
const MinimalSlack: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>One-line wiring</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 76, fontWeight: 800, margin: '24px 0 48px', lineHeight: 1.05 }}>
      Minimal Slack agent.
    </h2>
    <pre
      style={{
        margin: 0,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: design.radius,
        padding: 44,
        fontFamily: font.mono,
        fontSize: 26,
        lineHeight: 1.55,
        color: palette.textSoft,
      }}
    >
{`import { Agent } from '@mastra/core/agent'
import { createSlackAdapter } from '@chat-adapter/slack'

export const slackAgent = new Agent({
  id: 'slack-agent',
  name: 'Slack Agent',
  instructions: 'Be helpful in Slack.',
  model: 'anthropic/claude-opus-4-6',
  channels: {
    adapters: { slack: createSlackAdapter() },
  },
})`}
    </pre>
    <p style={{ marginTop: 32, fontSize: 26, color: palette.muted, maxWidth: 1500, lineHeight: 1.4 }}>
      Mastra wires the webhook, signature verification, and message normalization through the Chat SDK.
    </p>
    <Footer index={15} total={TOTAL} label="Channels" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 16 — consumeAgentStream
// ════════════════════════════════════════════════════════════════════════════
const StreamConsumer: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow color={palette.blue}>The heart of channels</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 72, fontWeight: 800, margin: '24px 0 40px', lineHeight: 1.05 }}>
      How <code style={{ fontFamily: font.mono }}>fullStream</code> becomes a Slack message.
    </h2>
    <pre
      style={{
        margin: 0,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: design.radius,
        padding: 36,
        fontFamily: font.mono,
        fontSize: 24,
        lineHeight: 1.55,
        color: palette.textSoft,
      }}
    >
{`for await (const chunk of stream.fullStream) {
  if (chunk.type === 'text-delta')      buffer += chunk.payload.text
  if (chunk.type === 'reasoning-delta') keep typing alive
  if (chunk.type === 'file')            flush text, post attachment
  if (chunk.type === 'tool-call')       post a card (or approval)
  if (chunk.type === 'tool-result')     EDIT the same card
  if (chunk.type === 'finish')          flush remaining text
}`}
    </pre>
    <p style={{ marginTop: 32, fontSize: 28, color: palette.textSoft, maxWidth: 1500, lineHeight: 1.4 }}>
      The agent has no idea this is happening. It just streams.
    </p>
    <Footer index={16} total={TOTAL} label="Channels" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 17 — What the primitive handles for you
// ════════════════════════════════════════════════════════════════════════════
const FreeStuff: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>You don't write any of this</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 72, fontWeight: 800, margin: '24px 0 48px', lineHeight: 1.05 }}>
      What the primitive handles.
    </h2>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 28, lineHeight: 1.55, color: palette.textSoft }}>
      {[
        ['Typing keepalive', 'Discord expires after ~10s → refire every 8s. 3s fallback for slow image models.'],
        ['Zero-width char stripping', 'LLMs emit U+200B–U+200D, U+FEFF. Slack/Discord render them broken.'],
        ['Tool-call cards', 'Each tool-call posts a card; the matching tool-result edits the same message.'],
        ['Approvals', 'requireApproval: true → Approve/Deny card. On click, agent resumes; result edits in place.'],
        ['cards: false fallback', 'Sets autoResumeSuspendedTools so approvals never deadlock.'],
      ].map(([k, v]) => (
        <li
          key={k as string}
          style={{
            display: 'grid',
            gridTemplateColumns: '380px 1fr',
            gap: 32,
            paddingBottom: 18,
            marginBottom: 18,
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          <span style={{ fontFamily: font.mono, fontSize: 24, color: palette.blue }}>{k}</span>
          <span>{v}</span>
        </li>
      ))}
    </ul>
    <Footer index={17} total={TOTAL} label="Channels" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 18 — ChatChannelProcessor
// ════════════════════════════════════════════════════════════════════════════
const ChatProcessor: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>ChatChannelProcessor · runs every step</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 64, fontWeight: 800, margin: '24px 0 40px', lineHeight: 1.05 }}>
      The fix for "bot replies to every message in #general".
    </h2>
    <pre
      style={{
        margin: 0,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: design.radius,
        padding: 36,
        fontFamily: font.mono,
        fontSize: 22,
        lineHeight: 1.55,
        color: palette.textSoft,
      }}
    >
{`You are communicating via slack.
Your identity is "Slack Agent" / <@U123ABC>.
You are in a public channel or thread.
Not every message is directed at you. If users appear to be talking
to each other, stay silent unless you are explicitly mentioned.
To stay silent, respond with an empty message.`}
    </pre>
    <p style={{ marginTop: 32, fontSize: 26, color: palette.muted, maxWidth: 1500, lineHeight: 1.4 }}>
      System messages reset between steps — so the processor injects every step. For DMs, "stay silent" becomes "this is a DM".
    </p>
    <Footer index={18} total={TOTAL} label="Channels" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 19 — Multi-user, threads, gateway
// ════════════════════════════════════════════════════════════════════════════
const MultiUserThreads: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>The non-obvious parts</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 68, fontWeight: 800, margin: '24px 0 40px', lineHeight: 1.05 }}>
      Multi-user · Thread context · Serverless
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
      {[
        {
          tag: 'MULTI-USER',
          color: palette.blue,
          body: (
            <>
              Public-channel messages are prefixed:
              <pre style={{ margin: '14px 0 0', fontFamily: font.mono, fontSize: 18, lineHeight: 1.5, color: palette.textSoft }}>
{`[Alice (@U123)] hey
[Bob   (@U456)] yeah`}
              </pre>
              <div style={{ marginTop: 12, color: palette.muted, fontSize: 20 }}>The agent can <em>follow</em> a conversation without barging in.</div>
            </>
          ),
        },
        {
          tag: 'THREAD CONTEXT',
          color: palette.green,
          body: (
            <>
              On the <em>first</em> mention in a thread: prefetch up to <code style={{ fontFamily: font.mono }}>maxMessages</code> (default 10) and subscribe.
              <div style={{ marginTop: 12, color: palette.muted, fontSize: 20 }}>After that, Mastra memory has full history. No more platform fetches.</div>
            </>
          ),
        },
        {
          tag: 'GATEWAY',
          color: palette.amber,
          body: (
            <>
              <code style={{ fontFamily: font.mono }}>gateway: true</code> — persistent WebSocket. Required for DMs / mentions / reactions.
              <div style={{ marginTop: 12 }}><code style={{ fontFamily: font.mono }}>gateway: false</code> — HTTP-only. For serverless deployments.</div>
            </>
          ),
        },
      ].map(c => (
        <div
          key={c.tag}
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: design.radius,
            padding: 32,
            fontSize: 22,
            lineHeight: 1.5,
            color: palette.textSoft,
          }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 20, color: c.color, letterSpacing: '0.14em', marginBottom: 16 }}>
            {c.tag}
          </div>
          {c.body}
        </div>
      ))}
    </div>
    <Footer index={19} total={TOTAL} label="Channels" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 20 — Channels demo + Combining
// ════════════════════════════════════════════════════════════════════════════
const ChannelsDemoAndCombine: Page = () => (
  <div style={{ ...fill, padding: '120px 120px 160px' }}>
    <Eyebrow>Demo</Eyebrow>
    <h2 style={{ fontFamily: font.display, fontSize: 64, fontWeight: 800, margin: '24px 0 36px', lineHeight: 1.05 }}>
      "Summarize this thread, add 👀 reaction."
    </h2>
    <ol style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 26, lineHeight: 1.55, color: palette.textSoft, maxWidth: 1600 }}>
      {[
        '@bot in a thread → first-mention prefetch → typing indicator',
        'add_reaction tool-call card → result edits in place',
        'Mention in a busy channel where two humans talk → bot stays silent',
      ].map((t, i) => (
        <li key={i} style={{ display: 'flex', gap: 24, alignItems: 'baseline', marginBottom: 12 }}>
          <span style={{ fontFamily: font.mono, fontSize: 20, color: palette.blue, minWidth: 48 }}>0{i + 1}</span>
          <span>{t}</span>
        </li>
      ))}
    </ol>
    <div style={{ marginTop: 56, paddingTop: 40, borderTop: `1px solid ${palette.border}` }}>
      <Eyebrow color={palette.accent}>Combining them</Eyebrow>
      <h3 style={{ fontFamily: font.display, fontSize: 44, fontWeight: 800, margin: '20px 0 24px' }}>
        <code style={{ fontFamily: font.mono }}>/research &lt;topic&gt;</code> — Slack triggers AgentBrowser.
      </h3>
      <p style={{ fontSize: 26, color: palette.textSoft, lineHeight: 1.5, margin: 0, maxWidth: 1500 }}>
        Slash command → templated prompt → agent streams →
        <code style={{ fontFamily: font.mono, color: palette.accent }}> consumeAgentStream</code> posts cards as it works → final summary lands as a card with citations.
      </p>
    </div>
    <Footer index={20} total={TOTAL} label="Demo · Combine" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 21 — Closing
// ════════════════════════════════════════════════════════════════════════════
const Closing: Page = () => (
  <div style={{ ...fill, padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background:
          `radial-gradient(900px 500px at 20% 30%, ${palette.accent}22 0%, transparent 60%),` +
          `radial-gradient(900px 500px at 80% 70%, ${palette.blue}1c 0%, transparent 60%)`,
      }}
    />
    <div style={{ position: 'relative' }}>
      <Eyebrow>Where to read the source</Eyebrow>
      <h2 style={{ fontFamily: font.display, fontSize: 96, fontWeight: 900, margin: '24px 0 40px', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
        Q&A.
      </h2>
      <pre
        style={{
          margin: 0,
          fontFamily: font.mono,
          fontSize: 22,
          lineHeight: 1.6,
          color: palette.textSoft,
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: design.radius,
          padding: 32,
          maxWidth: 1500,
        }}
      >
{`packages/core/src/browser/processor.ts       ← the cache trick
packages/core/src/browser/thread-manager.ts  ← session lifecycle
packages/core/src/channels/agent-channels.ts ← consumeAgentStream
packages/core/src/channels/processor.ts      ← per-step identity`}
      </pre>
      <div style={{ marginTop: 40, fontSize: 22, color: palette.muted, fontFamily: font.mono, letterSpacing: '0.1em' }}>
        /docs/browser/overview &nbsp;·&nbsp; /docs/agents/channels &nbsp;·&nbsp; /reference/agents/channels
      </div>
    </div>
    <Footer index={21} total={TOTAL} label="Thanks" />
  </div>
);

// ─── Export ──────────────────────────────────────────────────────────────────
export const meta: SlideMeta = {
  title: 'Mastra · Browser & Channels',
};

export default [
  Cover,
  PrimitiveDef,
  TwoProblems,
  Rebuild,
  SectionBrowser,
  BrowserArchitecture,
  Paradigms,
  SnapshotLoop,
  WhyRefs,
  CacheTrick,
  ScopeAndScreencast,
  BrowserDemo,
  SectionChannels,
  ChannelsArch,
  MinimalSlack,
  StreamConsumer,
  FreeStuff,
  ChatProcessor,
  MultiUserThreads,
  ChannelsDemoAndCombine,
  Closing,
] satisfies Page[];
