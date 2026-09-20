import { useEffect, useRef, useState } from 'react';
import { useIsActivePage } from '@open-slide/core';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import greedVf from '@assets/fonts/GreedVF.woff2';
import mastraWordmarkBlack from '@assets/Mastra wordmark black.svg';
import mastraQr from './assets/mastra-qr.png';
import bookerQr from './assets/bookercodes-qr.png';
import closingMastra from './assets/closing-mastra.png';
import closingXProfile from './assets/closing-x-profile.png';
import factoryProductHunt from './assets/factory-product-hunt.png';
import omInteractiveDemo from './assets/om-interactive-demo.html?raw';
import factoryWorkBoard from './assets/factory-work-board.png';
import agentsSlackExample from './assets/agents-slack-example.png';
import alexandriaKnowledgeBase from './assets/alexandria-knowledge-base.png';

export const design: DesignSystem = {
  palette: {
    bg: '#f5f6f4',
    text: '#101813',
    accent: '#19783a',
  },
  fonts: {
    display: '"Greed", "Inter", system-ui, -apple-system, sans-serif',
    body: '"Greed", "Inter", system-ui, -apple-system, sans-serif',
  },
  typeScale: {
    hero: 108,
    body: 34,
  },
  radius: 22,
};

const palette = {
  shell: '#e6ebe5',
  panel: '#ffffff',
  border: '#c4cec5',
  textSoft: '#25362b',
  textMuted: '#46554b',
};

const fontStyles = `
  @font-face {
    font-family: 'Greed';
    src: url(${greedVf}) format('woff2');
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('future-of-agents-fonts')) {
  const style = document.createElement('style');
  style.id = 'future-of-agents-fonts';
  style.textContent = fontStyles;
  document.head.appendChild(style);
}

const fill = {
  width: '100%',
  height: '100%',
  position: 'relative' as const,
  overflow: 'hidden',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  letterSpacing: '0.015em',
  colorScheme: 'light',
};

const TalkBadge = ({ compact = false }: { compact?: boolean }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: compact ? 8 : 10,
      background: '#edf5ed',
      border: '2px solid #9faf9f',
      borderRadius: 999,
      padding: compact ? '10px 18px' : '12px 22px',
      fontSize: compact ? 22 : 28,
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#193c24',
    }}
  >
    <span
      style={{
        width: compact ? 20 : 24,
        height: compact ? 20 : 24,
        borderRadius: '50%',
        border: '2px solid #193c24',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          width: compact ? 5 : 6,
          height: compact ? 5 : 6,
          borderRadius: '50%',
          background: '#193c24',
          display: 'inline-block',
        }}
      />
    </span>
    <span>Talk</span>
  </div>
);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 56,
        borderRadius: 64,
        background: palette.shell,
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 92,
        borderRadius: 42,
        border: `1px solid ${palette.border}`,
        background: palette.panel,
        padding: '88px 96px',
      }}
    >
      {children}
    </div>
  </>
);

const Cover: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={mastraWordmarkBlack} alt="Mastra wordmark" style={{ width: 332, height: 84, objectFit: 'contain' }} />
        <TalkBadge />
      </div>
      <div style={{ position: 'absolute', top: 172, bottom: 88, left: 96, right: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1
        style={{
          margin: 0,
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 520,
          fontStretch: '112%',
          letterSpacing: '0.015em',
          lineHeight: 1.1,
          maxWidth: 1300,
          textWrap: 'balance',
        }}
      >
        Mastra and the Future of Agents
      </h1>
      </div>
    </Frame>
  </div>
);

const MastraSite = ({ url, title, showQr = false }: { url: string; title: string; showQr?: boolean }) => {
  const [html, setHtml] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Website unavailable');
        return response.text();
      })
      .then((source) => {
        const page = new DOMParser().parseFromString(source, 'text/html');
        page.querySelectorAll('script, base').forEach((node) => node.remove());
        page.documentElement.classList.remove('dark', 'c15t-dark');
        page.documentElement.classList.add('light');
        page.documentElement.style.colorScheme = 'light';
        const base = page.createElement('base');
        base.href = url;
        base.target = '_blank';
        page.head.prepend(base);
        setHtml('<!doctype html>' + page.documentElement.outerHTML);
      })
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, [url]);

  return (
    <div style={{ ...fill, background: '#ffffff' }}>
      {html ? (
        <iframe
          srcDoc={html}
          title={title}
          sandbox="allow-popups allow-popups-to-escape-sandbox"
          style={{ width: '100%', height: '100%', display: 'block', border: 0, background: '#ffffff', colorScheme: 'light' }}
        />
      ) : (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          <img src={mastraWordmarkBlack} alt="Mastra" style={{ width: 400 }} />
          <p style={{ fontSize: 34 }}>{failed ? 'Open the Mastra website to continue.' : `Loading ${title}…`}</p>
        </div>
      )}
      {showQr && <a href={url} target="_blank" rel="noreferrer" aria-label="Visit mastra.ai" style={{ position: 'absolute', bottom: 36, left: 36, opacity: 0.8, padding: 24, borderRadius: 18, background: '#ffffff', color: '#101813', boxShadow: '0 4px 24px rgba(0,0,0,0.16)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <img src={mastraQr} alt="QR code linking to https://mastra.ai/" style={{ width: 200, height: 200, display: 'block', imageRendering: 'pixelated' }} />
      </a>}
      <a href={url} target="_blank" rel="noreferrer" style={{ position: 'absolute', bottom: 24, right: 24, opacity: 0.8, padding: '14px 22px', borderRadius: 12, background: '#ffffff', color: '#101813', border: '1px solid #c4cec5', fontSize: 24, textDecoration: 'none' }}>
        Open live site ↗
      </a>
    </div>
  );
};

const MastraWebsite: Page = () => <MastraSite url="https://mastra.ai/ai-agent-framework" title="Mastra AI agent framework" showQr />;

const Milestone = ({ time, children }: { time: string; children: React.ReactNode }) => (
  <div style={{ position: 'relative', flex: '1 1 0', minWidth: 0, textAlign: 'center' }}>
    <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.3, color: 'var(--osd-accent)', marginBottom: 30 }}>
      {time}
    </div>
    <div style={{ position: 'relative', margin: '0 auto', width: 22, height: 22, borderRadius: '50%', background: 'var(--osd-accent)', outline: '8px solid #ffffff' }} />
    <h2 style={{ margin: '36px auto 0', maxWidth: 226, fontSize: 34, fontWeight: 520, lineHeight: 1.25, letterSpacing: 0, textWrap: 'balance' }}>
      {children}
    </h2>
  </div>
);

const AgentTimeline: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ position: 'absolute', left: 96, right: 96, top: 350 }}>
        <div aria-hidden style={{ position: 'absolute', left: 128, right: 128, top: 78, height: 4, background: '#9bbda3' }} />
        <div style={{ display: 'flex' }}>
          <Milestone time="2023">Single-turn LLM calls</Milestone>
          <Milestone time="2024">Multi-turn chatbots</Milestone>
          <Milestone time="Early 2025">Reasoning models and agent loops</Milestone>
          <Milestone time="Late 2025">Opus 4.5</Milestone>
          <Milestone time="Early 2026">OpenClaw</Milestone>
          <Milestone time="2026">Harnesses and factories</Milestone>
        </div>
      </div>
    </Frame>
  </div>
);

const CapabilityMoment = ({ year, moment, children }: { year: string; moment: string; children: React.ReactNode }) => (
  <li style={{ position: 'relative', display: 'grid', gridTemplateColumns: '250px 64px 1fr', alignItems: 'center', minHeight: 110 }}>
    <div style={{ paddingLeft: 64, paddingRight: 24, textAlign: 'left' }}>
      <div style={{ fontSize: 24, lineHeight: 1.4, color: 'var(--osd-accent)', marginBottom: 5 }}>{year}</div>
      <div style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.25, letterSpacing: 0 }}>{moment}</div>
    </div>
    <div aria-hidden style={{ position: 'relative', width: 20, height: 20, borderRadius: '50%', background: 'var(--osd-accent)', outline: '7px solid #ffffff', zIndex: 1 }} />
    <div style={{ padding: '10px 28px', borderRadius: 18, background: '#f2f6f0', fontSize: 32, lineHeight: 1.4, letterSpacing: 0, color: palette.textSoft }}>{children}</div>
  </li>
);

const MastraCapabilities: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ position: 'absolute', top: 50, left: 96, right: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '314px 1fr', alignItems: 'center', marginBottom: 20, height: 46 }}>
          <div style={{ paddingLeft: 64, textAlign: 'left', fontSize: 30, fontWeight: 550 }}>Moment</div>
          <div style={{ fontSize: 30, fontWeight: 550, color: 'var(--osd-accent)' }}>Mastra</div>
        </div>
        <div style={{ position: 'relative' }}>
          <div aria-hidden style={{ position: 'absolute', left: 258, top: 55, bottom: 55, width: 4, borderRadius: 4, background: '#a6c5ab' }} />
        <ol aria-label="Industry timeline and supporting Mastra capabilities" style={{ position: 'relative', listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <CapabilityMoment year="2023" moment="LLMs">Model routing · Structured output · RAG</CapabilityMoment>
          <CapabilityMoment year="2024" moment="Chatbots">Message history · Working memory<br />Semantic recall</CapabilityMoment>
          <CapabilityMoment year="Early 2025" moment="Agents">Tool calling · Workflows · Human-in-the-loop<br />Evals · Tracing</CapabilityMoment>
          <CapabilityMoment year="Late 2025" moment="Opus 4.5">Workspaces · Filesystem · Sandbox · Skills</CapabilityMoment>
          <CapabilityMoment year="Early 2026" moment="OpenClaw">Observational Memory · Channels · Schedules</CapabilityMoment>
          <CapabilityMoment year="2026" moment="Factories">Harness · Goals · Background tasks<br />Durable agents · Mastra Factory</CapabilityMoment>
        </ol>
        </div>
      </div>
    </Frame>
  </div>
);

const CreateMastra: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ position: 'absolute', inset: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <pre style={{ margin: 0, padding: '48px 56px', borderRadius: 24, border: '1px solid #c4cec5', background: '#f5f7f3', whiteSpace: 'pre' }}>
          <code style={{ fontFamily: '"SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace', fontSize: 64, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-0.025em' }}>
            <span style={{ color: '#19783a' }}>npm</span>{' '}
            <span style={{ color: '#245a96' }}>create</span>{' '}
            <span style={{ color: '#101813' }}>mastra</span><span style={{ color: '#6e3f91' }}>@latest</span>
          </code>
        </pre>
      </div>
    </Frame>
    <a href="https://mastra.ai" target="_blank" rel="noreferrer" aria-label="Scan or open Mastra" style={{ position: 'absolute', bottom: 36, left: 36, opacity: 0.8, padding: 24, borderRadius: 18, background: '#ffffff', boxShadow: '0 4px 24px rgba(0,0,0,0.16)' }}>
      <img src={mastraQr} alt="QR code linking to https://mastra.ai/" style={{ width: 200, height: 200, display: 'block', imageRendering: 'pixelated' }} />
    </a>
  </div>
);

const CodeLine = ({ children }: { children?: React.ReactNode }) => (
  <div style={{ minHeight: 56 }}>{children}</div>
);
const Keyword = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#75419a' }}>{children}</span>;
const CodeString = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#19783a' }}>{children}</span>;
const Property = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#245a96' }}>{children}</span>;

const MinimalAgent: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ position: 'absolute', inset: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <pre style={{ margin: 0, padding: '42px 52px', background: '#f5f7f3', border: '1px solid #c4cec5', borderRadius: 24, whiteSpace: 'pre' }}>
          <code style={{ fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace', fontSize: 38, lineHeight: '56px', letterSpacing: '-0.025em', color: '#101813' }}>
            <CodeLine><Keyword>import</Keyword>{' { Agent } '}<Keyword>from</Keyword>{' '}<CodeString>'@mastra/core/agent'</CodeString></CodeLine>
            <CodeLine><Keyword>import</Keyword>{' { webFetchTool } '}<Keyword>from</Keyword>{' '}<CodeString>'@mastra/core/tools'</CodeString></CodeLine>
            <CodeLine />
            <CodeLine><Keyword>const</Keyword>{' agent = '}<Keyword>new</Keyword>{' Agent({'}</CodeLine>
            <CodeLine>{'  '}<Property>id</Property>{': '}<CodeString>'research-agent'</CodeString>{','}</CodeLine>
            <CodeLine>{'  '}<Property>name</Property>{': '}<CodeString>'Research Agent'</CodeString>{','}</CodeLine>
            <CodeLine>{'  '}<Property>instructions</Property>{': '}<CodeString>'Read linked research. Find the next big idea.'</CodeString>{','}</CodeLine>
            <CodeLine>{'  '}<Property>tools</Property>{': { webFetchTool },'}</CodeLine>
            <CodeLine>{'  '}<Property>model</Property>{': '}<CodeString>'openai/gpt-6-astra'</CodeString>{','}</CodeLine>
            <CodeLine>{'})'}</CodeLine>
            <CodeLine><Keyword>await</Keyword>{' agent.stream('}<CodeString>'Find ideas at https://arxiv.org'</CodeString>{')'}</CodeLine>
          </code>
        </pre>
      </div>
    </Frame>
  </div>
);

const ExampleCode = ({ children }: { children: React.ReactNode }) => (
  <div style={fill}>
    <Frame>
      <div style={{ position: 'absolute', inset: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <pre style={{ margin: 0, padding: '28px 44px', background: '#f5f7f3', border: '1px solid #c4cec5', borderRadius: 24, whiteSpace: 'pre' }}>
          <code style={{ fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace', fontSize: 34, lineHeight: '48px', letterSpacing: '-0.025em', color: '#101813' }}>{children}</code>
        </pre>
      </div>
    </Frame>
  </div>
);

const ExampleLine = ({ children, highlight = false }: { children?: React.ReactNode; highlight?: boolean }) => (
  <div style={{ minHeight: 48 }}>
    <span style={highlight ? { background: 'linear-gradient(transparent 12%, rgba(255, 222, 70, 0.26) 12%, rgba(255, 222, 70, 0.26) 92%, transparent 92%)', borderRadius: 4 } : undefined}>{children}</span>
  </div>
);

const SandboxAndBrowser: Page = () => (
  <ExampleCode>
    <ExampleLine><Keyword>import</Keyword>{' { Workspace } '}<Keyword>from</Keyword>{' '}<CodeString>'@mastra/core/workspace'</CodeString></ExampleLine>
    <ExampleLine><Keyword>import</Keyword>{' { DaytonaSandbox } '}<Keyword>from</Keyword>{' '}<CodeString>'@mastra/daytona'</CodeString></ExampleLine>
    <ExampleLine><Keyword>import</Keyword>{' { AgentBrowser } '}<Keyword>from</Keyword>{' '}<CodeString>'@mastra/agent-browser'</CodeString></ExampleLine>
    <ExampleLine />
    <ExampleLine><Keyword>const</Keyword>{' agent = '}<Keyword>new</Keyword>{' Agent({'}</ExampleLine>
    <ExampleLine><span style={{ color: palette.textMuted }}>{'  ...'}</span></ExampleLine>
    <ExampleLine highlight>{'  '}<Property>workspace</Property>{': '}<Keyword>new</Keyword>{' Workspace({'}</ExampleLine>
    <ExampleLine highlight>{'    '}<Property>sandbox</Property>{': '}<Keyword>new</Keyword>{' DaytonaSandbox({ '}<Property>language</Property>{': '}<CodeString>'typescript'</CodeString>{' }),'}</ExampleLine>
    <ExampleLine highlight>{'  }),'}</ExampleLine>
    <ExampleLine highlight>{'  '}<Property>browser</Property>{': '}<Keyword>new</Keyword>{' AgentBrowser({ '}<Property>headless</Property>{': '}<Keyword>false</Keyword>{' }),'}</ExampleLine>
    <ExampleLine>{'})'}</ExampleLine>
  </ExampleCode>
);

const IntegrationsWebsite: Page = () => <MastraSite url="https://mastra.ai/integrations" title="Mastra integrations" />;

const AgentHarness: Page = () => (
  <ExampleCode>
    <ExampleLine><Keyword>import</Keyword>{' { AgentController } '}<Keyword>from</Keyword>{' '}<CodeString>'@mastra/core/agent-controller'</CodeString></ExampleLine>
    <ExampleLine />
    <ExampleLine><Keyword>const</Keyword>{' agent = '}<Keyword>new</Keyword>{' Agent({ ... })'}</ExampleLine>
    <ExampleLine highlight><Keyword>const</Keyword>{' controller = '}<Keyword>new</Keyword>{' AgentController({'}</ExampleLine>
    <ExampleLine highlight>{'  '}<Property>id</Property>{': '}<CodeString>'research-harness'</CodeString>{','}</ExampleLine>
    <ExampleLine highlight>{'  agent,'}</ExampleLine>
    <ExampleLine highlight>{'  storage,'}</ExampleLine>
    <ExampleLine highlight>{'  '}<Property>modes</Property>{': ['}</ExampleLine>
    <ExampleLine highlight>{'    { '}<Property>id</Property>{': '}<CodeString>'plan'</CodeString>{', '}<Property>name</Property>{': '}<CodeString>'Plan'</CodeString>{', '}<Property>instructions</Property>{': '}<CodeString>'Explore ideas.'</CodeString>{' },'}</ExampleLine>
    <ExampleLine highlight>{'    { '}<Property>id</Property>{': '}<CodeString>'build'</CodeString>{', '}<Property>name</Property>{': '}<CodeString>'Build'</CodeString>{', '}<Property>instructions</Property>{': '}<CodeString>'Make it real.'</CodeString>{' },'}</ExampleLine>
    <ExampleLine highlight>{'  ],'}</ExampleLine>
    <ExampleLine highlight>{'})'}</ExampleLine>
    <ExampleLine><Keyword>await</Keyword>{' controller.init()'}</ExampleLine>
    <ExampleLine><Keyword>const</Keyword>{' session = '}<Keyword>await</Keyword>{' controller.createSession({ '}<Property>resourceId</Property>{': '}<CodeString>'alex'</CodeString>{' })'}</ExampleLine>
    <ExampleLine><Keyword>await</Keyword>{' session.sendMessage({ '}<Property>content</Property>{': '}<CodeString>'Build a research digest'</CodeString>{' })'}</ExampleLine>
  </ExampleCode>
);

const FeaturePill = ({ children, x, y, width, quiet = false, delay = 0, prominent = false, size = 42 }: {
  children: React.ReactNode; x: number; y: number; width: number; quiet?: boolean; delay?: number; prominent?: boolean; size?: number;
}) => (
  <div style={{ position: 'absolute', left: x, top: y, width, transform: 'translate(-50%, -50%)' }}>
    <div className="future-agents-feature-pill" style={{
      padding: quiet ? '17px 20px' : '24px 24px',
      borderRadius: 999,
      border: quiet ? '1px solid #d9ded8' : '1px solid #aac5ac',
      background: quiet ? '#f7f8f6' : prominent ? 'linear-gradient(135deg, #d4efcc, #e8f5dd)' : 'linear-gradient(160deg, #f6fcf2, #e8f3e2)',
      color: quiet ? '#657065' : '#19492b',
      boxShadow: quiet ? 'none' : '0 10px 28px rgba(42,76,41,0.07), inset 0 1px 0 #ffffff',
      textAlign: 'center', whiteSpace: 'nowrap',
      fontSize: quiet ? 28 : size, fontWeight: quiet ? 420 : 520,
      lineHeight: 1.2, letterSpacing: quiet ? '0.01em' : '-0.015em',
      animationName: quiet ? 'future-agents-pill-float-quiet' : 'future-agents-pill-float',
      animationDuration: quiet ? '9s' : '6s', animationDelay: `${delay}s`,
    }}>
      {children}
    </div>
  </div>
);

const FeatureCloud: Page = () => (
  <div style={fill}>
    <style>{`
      @keyframes future-agents-pill-float {
        0%, 100% { transform: translate3d(-5px, 14px, 0); }
        50% { transform: translate3d(5px, -16px, 0); }
      }
      @keyframes future-agents-pill-float-quiet {
        0%, 100% { transform: translate3d(-2px, 7px, 0); }
        50% { transform: translate3d(2px, -7px, 0); }
      }
      .future-agents-feature-pill { animation: future-agents-pill-float 6s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .future-agents-feature-pill { animation: none !important; }
      }
    `}</style>
    <Frame>
      <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 42, background: 'radial-gradient(ellipse at 50% 48%, rgba(214,235,203,0.28), transparent 70%)' }} />
      <FeaturePill x={170} y={355} width={150} quiet delay={-2}>Auth</FeaturePill>
      <FeaturePill x={530} y={800} width={280} quiet delay={-5}>Observability</FeaturePill>
      <FeaturePill x={1500} y={165} width={160} quiet delay={-1}>Evals</FeaturePill>
      <FeaturePill x={1475} y={495} width={230} quiet delay={-7}>Guardrails</FeaturePill>

      <FeaturePill x={425} y={270} width={330} size={52} delay={-1} prominent>Memory</FeaturePill>
      <FeaturePill x={1090} y={215} width={250} size={50} delay={-4} prominent>Skills</FeaturePill>
      <FeaturePill x={1330} y={365} width={310} delay={-6}>Sandbox</FeaturePill>
      <FeaturePill x={1365} y={635} width={330} size={40} delay={-2}>Filesystem</FeaturePill>

      <FeaturePill x={285} y={550} width={285} size={44} delay={-5}>Browser</FeaturePill>
      <FeaturePill x={575} y={655} width={280} size={40} delay={-2}>Task List</FeaturePill>
      <FeaturePill x={935} y={610} width={225} size={50} delay={-4} prominent>Goals</FeaturePill>
      <FeaturePill x={685} y={120} width={245} size={40} delay={-7}>Modes</FeaturePill>

      <FeaturePill x={865} y={435} width={375} size={60} delay={-3} prominent>Harness</FeaturePill>
      <FeaturePill x={460} y={415} width={300} size={40} delay={-6}>Knowledge</FeaturePill>
      <FeaturePill x={1020} y={785} width={440} size={40} delay={-1}>Background Tasks</FeaturePill>
      <FeaturePill x={235} y={130} width={180} size={38} delay={-5}>MCP</FeaturePill>

      <FeaturePill x={1210} y={85} width={345} quiet delay={-6}>Human-in-the-Loop</FeaturePill>
      <FeaturePill x={775} y={270} width={235} quiet delay={-3}>Code Mode</FeaturePill>
      <FeaturePill x={235} y={725} width={330} quiet delay={-8}>Durable Execution</FeaturePill>
      <FeaturePill x={1450} y={790} width={290} quiet delay={-4}>Slack Channels</FeaturePill>
    </Frame>
  </div>
);

const FactoryTitle: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ position: 'absolute', inset: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 94, fontWeight: 520, lineHeight: 1.15, letterSpacing: '0.015em' }}>
          Make moves with<br />Mastra Factory
        </h2>
      </div>
    </Frame>
  </div>
);

const TeamAgentCard = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <div style={{ border: '1px solid #dce5db', borderRadius: 20, background: '#f3f7f1', padding: '12px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
    <h3 style={{ margin: 0, fontSize: 34, fontWeight: 520, lineHeight: 1.2, color: 'var(--osd-accent)' }}>{name}</h3>
    <p style={{ margin: 0, fontSize: 28, lineHeight: 1.3, color: palette.textSoft }}>{children}</p>
  </div>
);

const FuturePredictions: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ position: 'absolute', inset: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 36 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 108, fontWeight: 520, lineHeight: 1.1 }}>The future of agents</h1>
        <h2 style={{ margin: 0, fontSize: 64, fontWeight: 450, lineHeight: 1.2, color: 'var(--osd-accent)' }}>4 predictions</h2>
      </div>
    </Frame>
  </div>
);

const PredictionHeading = ({ number, children }: { number: string; children: React.ReactNode }) => (
  <div style={fill}>
    <Frame>
      <div style={{ position: 'absolute', inset: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <h2 style={{ margin: 0, maxWidth: 1440, fontFamily: 'var(--osd-font-display)', fontSize: 94, fontWeight: 520, lineHeight: 1.15 }}>
          <span style={{ color: 'var(--osd-accent)' }}>{number}.</span> {children}
        </h2>
      </div>
    </Frame>
  </div>
);

const ContinuousWork: Page = () => <PredictionHeading number="2">Ambient agents</PredictionHeading>;
const ContextTeams: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ display: 'grid', gridTemplateColumns: '580px 1fr', gap: 48, height: '100%', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 68, fontWeight: 520, lineHeight: 1.15 }}>
          <span style={{ color: 'var(--osd-accent)' }}>3.</span> Company<br />knowledge bases<br />will become your<br />most valuable asset
        </h2>
        <img src={alexandriaKnowledgeBase} alt="Mastra’s Alexandria repository on GitHub, a shared company knowledge base" style={{ display: 'block', width: '100%', maxHeight: 716, objectFit: 'contain', borderRadius: 24 }} />
      </div>
    </Frame>
  </div>
);
const BeyondSoftware: Page = () => <PredictionHeading number="4">Factories spread<br />beyond software</PredictionHeading>;

const AgentsJoinTheTeam: Page = () => (
  <div style={fill}>
    <Frame>
      <h2 style={{ margin: '0 0 32px', fontFamily: 'var(--osd-font-display)', fontSize: 76, fontWeight: 520, lineHeight: 1.2 }}>
        <span style={{ color: 'var(--osd-accent)' }}>1.</span> Agents join the team
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '600px 1fr', gap: 36, height: 596 }}>
        <div style={{ display: 'grid', gridTemplateRows: 'repeat(5, 108px)', gap: 14 }}>
          <TeamAgentCard name="Customer agent">Customer knowledge and requirements</TeamAgentCard>
          <TeamAgentCard name="Marketing agent">GTM and product marketing</TeamAgentCard>
          <TeamAgentCard name="Community agent">Open-source feedback and insights</TeamAgentCard>
          <TeamAgentCard name="Workshop agent">Workshop management</TeamAgentCard>
          <TeamAgentCard name="Factory agent">Software development in Slack</TeamAgentCard>
        </div>
        <img src={agentsSlackExample} alt="Mastra teammates asking the Vox agent in Slack to summarize customer calls" style={{ width: '100%', height: 596, objectFit: 'contain', borderRadius: 16 }} />
      </div>
    </Frame>
  </div>
);

const LiveSiteLink = ({ href }: { href: string }) => (
  <a href={href} target="_blank" rel="noreferrer" style={{ position: 'absolute', bottom: 24, right: 24, opacity: 0.8, padding: '14px 22px', borderRadius: 12, background: '#ffffff', color: '#101813', border: '1px solid #c4cec5', fontSize: 24, textDecoration: 'none' }}>Open live site ↗</a>
);

const FactoryWebsite: Page = () => <MastraSite url="https://mastra.ai/factory" title="Mastra Factory website" />;

const FactoryProductHunt: Page = () => (
  <div style={{ ...fill, background: '#ffffff' }}>
    <a href="https://www.producthunt.com/products/mastra/launches/mastra-factory" target="_blank" rel="noreferrer" aria-label="Open Mastra Factory on Product Hunt" style={{ display: 'block', width: '100%', height: '100%' }}>
      <img src={factoryProductHunt} alt="Mastra Factory launch on Product Hunt" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
    </a>
    <LiveSiteLink href="https://www.producthunt.com/products/mastra/launches/mastra-factory" />
  </div>
);

const MastraCodeVideo: Page = () => {
  const active = useIsActivePage();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) void video.play().catch(() => {});
    else video.pause();
    return () => video.pause();
  }, [active]);

  return (
    <div style={{ ...fill, background: '#000000' }}>
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/mastra-assets/video/upload/v1778051861/mastracode-demo_thoxc9.mp4"
        aria-label="Mastra Code demo"
        controls
        autoPlay={active}
        loop
        muted
        playsInline
        preload="metadata"
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
      />
    </div>
  );
};

const ObservationalMemoryWebsite: Page = () => <MastraSite url="https://mastra.ai/research/observational-memory" title="Observational Memory research" />;

const ObservationalMemoryDemo: Page = () => (
  <div style={{ ...fill, background: '#0d1117' }}>
    <iframe
      srcDoc={omInteractiveDemo}
      title="Observational Memory interactive demo"
      sandbox="allow-scripts"
      style={{ width: 1280, height: 720, display: 'block', border: 0, transform: 'scale(1.5)', transformOrigin: 'top left' }}
    />
  </div>
);

const FactoryScreenshot: Page = () => (
  <div style={{ ...fill, background: '#f8f8f8' }}>
    <style>{`
      .future-agents-demo-link {
        background: var(--osd-accent);
        box-shadow: 0 12px 40px rgba(16, 24, 19, 0.28);
        transition: transform 220ms ease, box-shadow 220ms ease, background 220ms ease;
      }
      .future-agents-demo-link:hover,
      .future-agents-demo-link:focus-visible {
        background: #218d46;
        transform: translateY(-8px) scale(1.035);
        box-shadow: 0 20px 52px rgba(25, 120, 58, 0.36), 0 0 0 8px rgba(25, 120, 58, 0.12);
      }
      .future-agents-demo-link:focus-visible { outline: 4px solid #101813; outline-offset: 8px; }
      .future-agents-demo-link span { transition: transform 220ms ease; }
      .future-agents-demo-link:hover span,
      .future-agents-demo-link:focus-visible span { transform: translate(6px, -6px); }
      @media (prefers-reduced-motion: reduce) {
        .future-agents-demo-link, .future-agents-demo-link span { transition: none; }
        .future-agents-demo-link:hover, .future-agents-demo-link:focus-visible,
        .future-agents-demo-link:hover span, .future-agents-demo-link:focus-visible span { transform: none; }
      }
    `}</style>
    <img src={factoryWorkBoard} alt="Mastra Factory work board showing Intake, Triage, Planning, and Building" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
    <a
      className="future-agents-demo-link"
      href="google-chrome:https://shipyard.factory.mastra.cloud/factories/7d5175c3-3a20-42ac-aba9-756f183136f4/work"
      aria-label="Demo — open Mastra Factory in Chrome"
      title="Open demo in Google Chrome"
      style={{ position: 'absolute', right: 64, bottom: 56, display: 'inline-flex', alignItems: 'center', gap: 32, padding: '32px 60px', borderRadius: 26, color: '#ffffff', border: '2px solid #ffffff', fontSize: 72, fontWeight: 550, lineHeight: 1.2, textDecoration: 'none' }}
    >
      Demo <span aria-hidden>↗</span>
    </a>
  </div>
);

const XProfile: Page = () => {
  const active = useIsActivePage();
  return (
  <div style={{ ...fill, background: '#ffffff' }}>
    <style>{`
      @keyframes future-agents-closing-push-pull {
        0%, 100% { grid-template-columns: 50% 50%; }
        25% { grid-template-columns: 52% 48%; }
        75% { grid-template-columns: 48% 52%; }
      }
      .future-agents-closing-panels {
        animation: future-agents-closing-push-pull 16s ease-in-out infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .future-agents-closing-panels { animation: none; }
      }
      @media print {
        .future-agents-closing-panels { animation: none; }
      }
    `}</style>
    <div className="future-agents-closing-panels" style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '50% 50%', gridTemplateRows: 'minmax(0, 1fr)', animationPlayState: active ? 'running' : 'paused' }}>
    <a href="https://mastra.ai" target="_blank" rel="noreferrer" aria-label="Open Mastra" style={{ display: 'block', minWidth: 0, height: '100%', background: '#090909' }}>
      <img src={closingMastra} alt="Mastra — Build AI agents" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'left top' }} />
    </a>
    <a href="https://x.com/bookercodes" target="_blank" rel="noreferrer" aria-label="Open Alex Booker's X profile" style={{ display: 'block', minWidth: 0, height: '100%' }}>
      <img src={closingXProfile} alt="Alex Booker (@bookercodes) on X" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center top' }} />
    </a>
    </div>
    <a href="https://mastra.ai" target="_blank" rel="noreferrer" aria-label="Scan or open Mastra" style={{ position: 'absolute', bottom: 36, left: 36, opacity: 0.8, padding: 24, borderRadius: 18, background: '#ffffff', boxShadow: '0 4px 24px rgba(0,0,0,0.16)' }}>
      <img src={mastraQr} alt="QR code linking to https://mastra.ai/" style={{ width: 200, height: 200, display: 'block', imageRendering: 'pixelated' }} />
    </a>
    <a href="https://x.com/bookercodes" target="_blank" rel="noreferrer" aria-label="Scan or open @bookercodes on X" style={{ position: 'absolute', bottom: 36, right: 36, opacity: 0.8, padding: 24, borderRadius: 18, background: '#ffffff', boxShadow: '0 4px 24px rgba(0,0,0,0.16)' }}>
      <img src={bookerQr} alt="QR code linking to https://x.com/bookercodes" style={{ width: 200, height: 200, display: 'block', imageRendering: 'pixelated' }} />
    </a>
  </div>
  );
};

export const notes = [
  '',
  `2023 — Single-turn LLM calls
Backend logic calls a model for a specific task, like summarizing a PDF.

2024 — Multi-turn chatbots
Apps carry context across messages so users can have ongoing conversations.

Early 2025 — Reasoning models and agent loops
Agents become better at taking actions, checking results, and deciding what to do next.

Late 2025 — Opus 4.5
Delegating substantial coding tasks starts to feel practical.

Early 2026 — OpenClaw
Persistent personal agents capture widespread attention.

2026 — Harnesses and factories
Agents run ongoing operations across software development, SRE, GTM, security, and more.`,
  '',
  `This is a capability map to the industry moments on slide 2, not a claim that Mastra shipped every feature in the year on the left. The milestones are the talk's framing; mapping features to them is our editorial synthesis. Do not imply that Mastra launched in 2023, or that later features were available at the Opus 4.5 or OpenClaw milestone.

2023 — Single-turn LLM calls
Mastra now offers model routing, structured output, and retrieval-augmented generation (RAG): choose a model, return typed data, and ground responses in your own knowledge. The public beta announcement on February 20, 2025 already described agents and a RAG pipeline.
https://mastra.ai/docs/agents/overview
https://mastra.ai/blog/beta-launch

2024 — Multi-turn chatbots
Message history carries a conversation across turns. Working memory retains useful facts, and semantic recall retrieves relevant past messages. These are distinct memory mechanisms. The February 2025 beta already discussed conversation history and retrieval; the Observational Memory announcement places working memory and semantic recall releases in March/April 2025.
https://mastra.ai/docs/memory/message-history
https://mastra.ai/docs/memory/working-memory
https://mastra.ai/docs/memory/semantic-recall
https://mastra.ai/blog/observational-memory

Early 2025 — Reasoning models and agent loops
An agent can repeatedly call tools and use their results. Workflows make multi-step execution explicit; suspend/resume supports human review. Evals and tracing help assess behavior. Agents, workflows, human-in-the-loop, evals, and tracing were described in the February 20, 2025 public beta announcement.
https://mastra.ai/blog/beta-launch
https://mastra.ai/docs/agents/overview

Late 2025 — Opus 4.5
The coding-delegation moment creates demand for environments where agents can work with files, run commands, and follow reusable skills. Mastra announced Workspaces on February 5, 2026, after this milestone. Workspace capabilities include filesystem access, sandbox execution, search, and skills, with configurable tool permissions and approvals. A local sandbox executes locally; use a remote sandbox provider when isolation is required.
https://mastra.ai/blog/introducing-mastra-workspaces

Early 2026 — OpenClaw
Persistent personal agents need longer-lived context, familiar communication surfaces, and scheduled work. Observational Memory was announced February 9, 2026 and compresses conversation history into observations and reflections. Channels were announced April 28, 2026, schedules July 8, and Harness Channels September 1. These support the pattern; they were not all available at the start of 2026.
https://mastra.ai/blog/observational-memory
https://mastra.ai/blog/category/features
https://mastra.ai/docs/channels
https://mastra.ai/docs/harness/schedules
https://mastra.ai/blog/introducing-harness-channels

2026 — Harnesses and factories
The Harness announcement on June 18, 2026 introduced session management, modes, model switching, approvals, persistence, and subagents; the current API is AgentController. Background Tasks were announced May 7 for progress during long-running tool calls. Goals were announced July 15 for durable objectives with a judge and budget. Durable agents support resumable execution; crash recovery requires the appropriate persistence and recovery configuration. Mastra Factory was announced July 27, with a beta announcement September 8, orchestrating software work from issues through validation and release.
https://mastra.ai/blog/announcing-agent-harness
https://mastra.ai/docs/harness/agent-controller
https://mastra.ai/blog/introducing-background-tasks
https://mastra.ai/blog/introducing-goals
https://mastra.ai/docs/harness/durable-agents
https://mastra.ai/blog/announcing-mastra-factory

Research index: https://mastra.ai/llms.txt
Documentation: https://mastra.ai/docs
Research checked September 19, 2026.`,
  'The instructions field provides the system instruction. Tools are capabilities the model can call; webFetchTool is built into @mastra/core/tools and fetches the text of a public URL. Give the agent a research article URL to explore. Mastra requires an id and name. The model uses the provider/model format: openai/gpt-6-astra. Running this example requires OPENAI_API_KEY. References: https://mastra.ai/blog/introducing-built-in-tools and https://mastra.ai/reference/agents/agent and https://developers.openai.com/api/docs/models/gpt-6-astra',
  '',
  `Pick Sandbox and Browser from the feature cloud and add them to the same agent. The ellipsis represents the existing id, name, instructions, model, and tools; Agent is imported on the earlier code slide. This is an abridged teaching snippet, not a standalone file.

DaytonaSandbox provides remote command execution through Workspace; set DAYTONA_API_KEY and install @mastra/daytona. AgentBrowser supplies browser tools automatically; install @mastra/agent-browser and its Chromium binary. The browser here runs locally, separately from the remote sandbox. The example assumes trusted, single-user use; scope environments appropriately in a multi-user application.

Suggested demo prompt: Read a research article in the browser, then use the sandbox to turn the findings into a small HTML digest.

References: https://mastra.ai/docs/sandbox/overview
https://mastra.ai/integrations/sandboxes/daytona
https://mastra.ai/docs/browser
https://mastra.ai/integrations/browsers/agent-browser`,
  'Embedded integrations page: https://mastra.ai/integrations. Scripts are disabled for reliable rendering; use Open live site for full interactions.',
  `Now pick Harness and Modes. The abridged Agent definition is the same agent from earlier: import Agent from @mastra/core/agent and restore its id, name, instructions, model, tools, workspace, and browser. The controller receives that agent and creates a session for Alex. storage is an already configured persistent store, for example: new LibSQLStore({ id: 'harness-storage', url: 'file:./mastra.db' }), imported from @mastra/libsql. Setup and UI event handling are abridged for the slide.

Initialize the controller once. createSession is get-or-create by resourceId and optional scope. In the UI, subscribe to session events to render progress. Modes change instructions while sharing the conversation. Switch explicitly with await session.mode.switch({ modeId: 'build' }); these short instructions alone do not enforce a read-only planning phase or automatic transitions. Add availableTools and permission policies when required. AgentController is currently a beta API.

Reference: https://mastra.ai/docs/harness/agent-controller`,
  '',
  '',
  'Embedded HTML fetched from https://mastra.ai/factory. Scripts are disabled for reliable rendering inside the slide; use Open live site for full website interactions.',
  'Product Hunt blocks third-party iframe embedding with X-Frame-Options: SAMEORIGIN. This slide uses a local snapshot of the launch details, captured September 19, 2026. Click the slide or Open live site to visit the interactive page: https://www.producthunt.com/products/mastra/launches/mastra-factory',
  'The full-screen Mastra Code demo autoplays muted and loops while this slide is active. Use the controls to enable sound. Video source: https://res.cloudinary.com/mastra-assets/video/upload/v1778051861/mastracode-demo_thoxc9.mp4',
  'Embedded research page: https://mastra.ai/research/observational-memory. Scripts are disabled for reliable rendering; use Open live site for full interactions.',
  'Interactive demo bundled from /Users/booker/Code/om-interactive-demo/index.html. Runs locally inside this slide with its original controls and scripts.',
  'The Demo button uses Google Chrome’s registered direct-launch URL scheme so you can authenticate in Chrome. Destination: https://shipyard.factory.mastra.cloud/factories/7d5175c3-3a20-42ac-aba9-756f183136f4/work',
  '',
  'Agents join the team: examples from Mastra. Customer agent — customer knowledge and requirements. Marketing agent — GTM and product marketing. Community agent — open-source feedback and insights. Workshop agent — workshop management. Factory agent — software development in Slack.',
  'They monitor, investigate, and move tasks forward between human interactions.',
  'We make goals, decisions, ownership, and constraints explicit so agents can act without constantly asking us.',
  'The same pattern extends to SRE, security, GTM, and other ongoing operations.',
  '',
];

export const meta: SlideMeta = {
  title: 'Mastra and the Future of Agents',
  theme: 'mastra',
  createdAt: '2026-09-19T11:37:47.364Z',
};

export default [Cover, AgentTimeline, MastraWebsite, MastraCapabilities, MinimalAgent, FeatureCloud, SandboxAndBrowser, IntegrationsWebsite, AgentHarness, CreateMastra, FactoryTitle, FactoryWebsite, FactoryProductHunt, MastraCodeVideo, ObservationalMemoryWebsite, ObservationalMemoryDemo, FactoryScreenshot, FuturePredictions, AgentsJoinTheTeam, ContinuousWork, ContextTeams, BeyondSoftware, XProfile] satisfies Page[];
