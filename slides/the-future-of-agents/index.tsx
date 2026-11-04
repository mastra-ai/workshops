import customerMongoDB from './assets/customer-mongodb.svg';
import customerReplit from './assets/customer-replit.svg';
import customerSalesforce from './assets/customer-salesforce.svg';
import customerSoftBank from './assets/customer-softbank.svg';
import customerWorkday from './assets/customer-workday.svg';
import customerMarsh from './assets/customer-marsh-mclennan.svg';
import customerFactorial from './assets/customer-factorial.svg';
import customerRange from './assets/customer-range.svg';
import customerSanity from './assets/customer-sanity.svg';
import mastraAgentBooks from './assets/mastra-agent-books.png';
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
import alexandriaKnowledgeBase from './assets/alexandria-knowledge-base.png';
import mastraPlatform from './assets/mastra-platform.png';
import mastraDownloads from './assets/mastra-downloads.png';
import factoryTriageSkill from './assets/factory-triage-skill.png';
import factoryBuild from './assets/factory-build.png';
import mastraBooth from './assets/mastra-booth.png';
import companyLogoWall from './assets/company-logo-wall.png';
import buildYourFactory from './assets/build-your-factory.png';
import observationalMemoryResearch from './assets/observational-memory-research.png';
import factoryKnowledgeGraph from './assets/factory-knowledge-graph.png';
import intakeLinear from './assets/intake-linear.svg';
import intakeSlack from './assets/intake-slack.svg';
import intakeGithub from './assets/intake-github.svg';
import mastraFactoryIntroduction from './assets/mastra-factory-introduction.png';
import mastraHomepage from './assets/mastra-homepage.png';
import softwareFactoryLoop from './assets/software-factory-loop.png';
import stripeLogo from './assets/company-stripe-wordmark.svg';
import rampLogo from './assets/company-ramp.svg';
import spotifyLogo from './assets/company-spotify-wordmark.svg';
import cursorLogo from './assets/company-cursor.svg';

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

const MastraQrOverlay = () => (
  <a href="https://mastra.ai" target="_blank" rel="noreferrer" aria-label="Scan or open Mastra" style={{ position: 'absolute', bottom: 36, left: 36, zIndex: 2, opacity: 0.8, padding: 20, borderRadius: 18, background: '#ffffff', boxShadow: '0 4px 24px rgba(0,0,0,0.16)' }}>
    <img src={mastraQr} alt="QR code linking to https://mastra.ai/" style={{ width: 160, height: 160, display: 'block', imageRendering: 'pixelated' }} />
  </a>
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
        Software Factories and the Future of Agents
      </h1>
      </div>
    </Frame>
    <MastraQrOverlay />
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

const CustomerUseCase = ({ company, logo, children }: { company: string; logo: string; children: React.ReactNode }) => (
  <div style={{ padding: '24px 0', borderTop: '1px solid #30352f', height: 170, boxSizing: 'border-box' }}>
    <img src={logo} alt={company} style={{ width: 240, height: 62, objectFit: 'contain', objectPosition: 'left center', display: 'block', marginBottom: 18 }} />
    <div style={{ fontSize: 30, lineHeight: 1.35, color: '#b8c0b4' }}>{children}</div>
  </div>
);

const CustomerCategory = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ minWidth: 0 }}>
    <h3 style={{ margin: '0 0 28px', fontSize: 40, fontWeight: 520, color: '#b6f78c' }}>{title}</h3>
    {children}
  </section>
);

const MastraCustomers: Page = () => (
  <div style={{ ...fill, background: '#10120f', color: '#ffffff' }}>
    <div style={{ position: 'absolute', top: 160, left: 120, right: 120 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 72 }}>
        <CustomerCategory title="Customer-facing">
          <CustomerUseCase company="Sanity" logo={customerSanity}>Create and edit CMS content</CustomerUseCase>
          <CustomerUseCase company="Range" logo={customerRange}>Personalized financial advice</CustomerUseCase>
          <CustomerUseCase company="Factorial" logo={customerFactorial}>HR assistance across products</CustomerUseCase>
        </CustomerCategory>
        <CustomerCategory title="Internal">
          <CustomerUseCase company="Marsh" logo={customerMarsh}>Company knowledge and tools</CustomerUseCase>
          <CustomerUseCase company="Workday" logo={customerWorkday}>Security alert triage</CustomerUseCase>
          <CustomerUseCase company="SoftBank" logo={customerSoftBank}>Document creation with Satto</CustomerUseCase>
        </CustomerCategory>
        <CustomerCategory title="Developer platform">
          <CustomerUseCase company="Salesforce" logo={customerSalesforce}>Agentforce Vibes coding harness</CustomerUseCase>
          <CustomerUseCase company="Replit" logo={customerReplit}>Generate agents and workflows</CustomerUseCase>
          <CustomerUseCase company="MongoDB" logo={customerMongoDB}>CI log analysis and triage</CustomerUseCase>
        </CustomerCategory>
      </div>
    </div>
    <MastraQrOverlay />
  </div>
);

const MastraAgentBooks: Page = () => (
  <div style={{ ...fill, background: '#000000' }}>
    <img src={mastraAgentBooks} alt="Principles of Building AI Agents and Patterns for Building AI Agents books" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
    <MastraQrOverlay />
  </div>
);

const MastraHomepage: Page = () => (
  <div style={{ ...fill, background: '#000000' }}>
    <img src={mastraHomepage} alt="Mastra homepage: Build AI agents" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
    <MastraQrOverlay />
  </div>
);

const MastraFactoryIntroduction: Page = () => (
  <div style={{ ...fill, background: '#000000' }}>
    <img src={mastraFactoryIntroduction} alt="Introducing Mastra Factory: Intake, Triage, In Progress, Review" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
  </div>
);

const MastraDownloads: Page = () => (
  <div style={{ ...fill, background: '#000000' }}>
    <img src={mastraDownloads} alt="Mastra weekly downloads chart: 600k in April and 1.2m in July" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
    <MastraQrOverlay />
  </div>
);

const IntakeSource = ({ src, name }: { src: string; name: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>
    <img src={src} alt={name} style={{ width: 144, height: 144, objectFit: 'contain' }} />
    <span style={{ fontSize: 44, fontWeight: 500 }}>{name}</span>
  </div>
);

const HowWorkStarts: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 110 }}>
        <h2 style={{ margin: 0, fontSize: 84, fontWeight: 520, lineHeight: 1.15 }}>Intake</h2>
        <div style={{ width: 1200, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 100 }}>
          <IntakeSource src={intakeLinear} name="Linear" />
          <IntakeSource src={intakeSlack} name="Slack" />
          <IntakeSource src={intakeGithub} name="GitHub" />
        </div>
      </div>
    </Frame>
  </div>
);

const FactoryTriage: Page = () => (
  <div style={{ ...fill, background: '#fafafa', padding: '64px 96px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 32 }}>
    <h2 style={{ margin: 0, fontSize: 76, fontWeight: 520, lineHeight: 1.15 }}>Triage and Plan</h2>
    <img src={factoryTriageSkill} alt="Factory Triage and Planning skills in Mastra Factory settings" style={{ width: '100%', flex: 1, minHeight: 0, objectFit: 'contain', display: 'block' }} />
  </div>
);

const FactoryBuild: Page = () => (
  <div style={{ ...fill, background: '#fafafa', padding: '64px 96px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 32 }}>
    <h2 style={{ margin: 0, fontSize: 76, fontWeight: 520, lineHeight: 1.15 }}>Build</h2>
    <img src={factoryBuild} alt="Mastra Factory build session reproducing an issue, editing code, and running tests" style={{ width: '100%', flex: 1, minHeight: 0, objectFit: 'contain', display: 'block' }} />
  </div>
);

const FactoryReview: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 112, fontWeight: 520, lineHeight: 1.15 }}>Review</h2>
      </div>
    </Frame>
  </div>
);

const FactoryShip: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 112, fontWeight: 520, lineHeight: 1.15 }}>Ship</h2>
      </div>
    </Frame>
  </div>
);

const ObservationalMemoryScreenshot: Page = () => (
  <div style={{ ...fill, background: '#0a0a0a' }}>
    <img src={observationalMemoryResearch} alt="Observational Memory research: 95% on LongMemEval" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
  </div>
);

const FactoryKnowledgeGraph: Page = () => (
  <div style={{ ...fill, background: '#fafafa' }}>
    <img src={factoryKnowledgeGraph} alt="Mastra Factory knowledge graph" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
  </div>
);

const BuildYourFactory: Page = () => (
  <div style={{ ...fill, background: '#000000' }}>
    <img src={buildYourFactory} alt="Build your factory today: npm create factory" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
  </div>
);

const CompanyLogoWall: Page = () => (
  <div style={{ ...fill, background: '#000000' }}>
    <img src={companyLogoWall} alt="Company logos" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
  </div>
);

const MastraBooth: Page = () => (
  <div style={{ ...fill, background: '#ffffff', display: 'grid', gridTemplateColumns: '70% 30%' }}>
    <img src={mastraBooth} alt="Mastra booth at the venue" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', background: '#000000' }} />
    <a href="https://mastra.ai" target="_blank" rel="noreferrer" aria-label="Scan or open Mastra" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 36, boxSizing: 'border-box', background: '#ffffff' }}>
      <img src={mastraQr} alt="QR code linking to https://mastra.ai/" style={{ width: '100%', height: 'auto', display: 'block', imageRendering: 'pixelated' }} />
    </a>
  </div>
);

const MastraPlatform: Page = () => (
  <div style={{ ...fill, background: '#000000' }}>
    <img src={mastraPlatform} alt="Mastra Platform: Build, Observe, Improve, Deploy" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
    <MastraQrOverlay />
  </div>
);

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
          <Milestone time="2026">Factories</Milestone>
        </div>
      </div>
    </Frame>
  </div>
);

const AgentTimelineRecap: Page = () => (
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
          <Milestone time="2026">Factories</Milestone>
        </div>
      </div>
    </Frame>
  </div>
);

const AgentTimelinePerspective: Page = () => (
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
          <Milestone time="2026">Factories</Milestone>
        </div>
      </div>
      <p style={{ position: 'absolute', bottom: 88, left: 96, right: 96, margin: 0, textAlign: 'center', fontSize: 64, fontWeight: 520, color: '#19783a' }}>Just 36 months</p>
    </Frame>
  </div>
);

const SoftwareFactoryDefinition: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '560px 1fr', alignItems: 'center', gap: 40 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 76, fontWeight: 520, lineHeight: 1.15 }}>Factory</h2>
          <p style={{ margin: '36px 0 0', fontSize: 42, lineHeight: 1.4, color: palette.textSoft }}>A <em>system</em> of agents that continuously builds, ships, and improves software.</p>
        </div>
        <img src={softwareFactoryLoop} alt="Continuous feedback loop: Signals, Triage, Plan, Build, Test, Review, Secure, Ship, Monitor, then back to Signals" style={{ width: '100%', height: 718, objectFit: 'contain', display: 'block' }} />
      </div>
    </Frame>
  </div>
);

const FactoryExample = ({ logo, company, children, wordmark = false }: { logo: string; company: string; children: React.ReactNode; wordmark?: boolean }) => (
  <div style={{ padding: '30px 36px', borderRadius: 24, border: '1px solid #dce4d9', background: '#f7f9f5' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 52 }}>
      <img src={logo} alt={company} style={{ width: wordmark ? 142 : 48, height: 48, objectFit: 'contain', objectPosition: 'left center', filter: 'grayscale(1) brightness(0)' }} />
      {!wordmark && <span style={{ fontSize: 40, fontWeight: 550 }}>{company}</span>}
    </div>
    <div style={{ marginTop: 26, fontSize: 34, lineHeight: 1.35, color: palette.textSoft }}>{children}</div>
  </div>
);

const FactoryExamples: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '290px 290px', gap: 24, height: '100%', alignContent: 'center' }}>
        <FactoryExample logo={stripeLogo} company="Stripe" wordmark>
          “We ship <strong style={{ fontWeight: 600 }}>1,300</strong> reviewed PRs a week.”
        </FactoryExample>
        <FactoryExample logo={rampLogo} company="Ramp" wordmark>
          “Our agent writes <strong style={{ fontWeight: 600 }}>30%</strong> of merged PRs across frontend and backend repos.”
        </FactoryExample>
        <FactoryExample logo={spotifyLogo} company="Spotify" wordmark>
          “Honk migrated our backend services to a new Java version in <strong style={{ fontWeight: 600 }}>3 days</strong>.”
        </FactoryExample>
        <FactoryExample logo={cursorLogo} company="Cursor">
          “I shipped <strong style={{ fontWeight: 600 }}>2,500</strong> PRs last month to production.”
        </FactoryExample>
      </div>
    </Frame>
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

const ExampleCode = ({ children, showQr = false }: { children: React.ReactNode; showQr?: boolean }) => (
  <div style={fill}>
    <Frame>
      <div style={{ position: 'absolute', inset: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <pre style={{ margin: 0, padding: '28px 44px', background: '#f5f7f3', border: '1px solid #c4cec5', borderRadius: 24, whiteSpace: 'pre' }}>
          <code style={{ fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace', fontSize: 34, lineHeight: '48px', letterSpacing: '-0.025em', color: '#101813' }}>{children}</code>
        </pre>
      </div>
    </Frame>
    {showQr && <MastraQrOverlay />}
  </div>
);

const ExampleLine = ({ children, highlight = false }: { children?: React.ReactNode; highlight?: boolean }) => (
  <div style={{ minHeight: 48 }}>
    <span style={highlight ? { background: 'linear-gradient(transparent 12%, rgba(255, 222, 70, 0.26) 12%, rgba(255, 222, 70, 0.26) 92%, transparent 92%)', borderRadius: 4 } : undefined}>{children}</span>
  </div>
);

const SandboxAndBrowser: Page = () => (
  <ExampleCode showQr>
    <ExampleLine><Keyword>const</Keyword>{' agent = '}<Keyword>new</Keyword>{' Agent({'}</ExampleLine>
    <ExampleLine>{'  '}<Property>instructions</Property>{': '}<CodeString>'Research ideas and build working prototypes.'</CodeString>{','}</ExampleLine>
    <ExampleLine>{'  '}<Property>model</Property>{': '}<CodeString>'openai/gpt-6-astra'</CodeString>{','}</ExampleLine>
    <ExampleLine>{'  '}<Property>tools</Property>{': { webFetchTool },'}</ExampleLine>
    <ExampleLine>{'  '}<Property>workspace</Property>{': '}<Keyword>new</Keyword>{' Workspace({'}</ExampleLine>
    <ExampleLine>{'    '}<Property>sandbox</Property>{': '}<Keyword>new</Keyword>{' DaytonaSandbox({ '}<Property>language</Property>{': '}<CodeString>'typescript'</CodeString>{' }),'}</ExampleLine>
    <ExampleLine>{'  }),'}</ExampleLine>
    <ExampleLine>{'  '}<Property>browser</Property>{': '}<Keyword>new</Keyword>{' AgentBrowser({ '}<Property>headless</Property>{': '}<Keyword>false</Keyword>{' }),'}</ExampleLine>
    <ExampleLine>{'})'}</ExampleLine>
    <ExampleLine />
    <ExampleLine><Keyword>await</Keyword>{' agent.stream('}<CodeString>'Research arxiv.org and build a demo'</CodeString>{')'}</ExampleLine>
  </ExampleCode>
);

const IntegrationsWebsite: Page = () => <MastraSite url="https://mastra.ai/integrations" title="Mastra integrations" />;

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
      <FeaturePill x={650} y={545} width={270} size={40} delay={-2} prominent>Subagents</FeaturePill>
      <FeaturePill x={1210} y={515} width={270} size={40} delay={-2} prominent>Workflows</FeaturePill>
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
  <div style={{ border: '1px solid #dce5db', borderRadius: 20, background: '#f3f7f1', padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
    <h3 style={{ margin: 0, fontSize: 34, fontWeight: 520, lineHeight: 1.2, color: 'var(--osd-accent)' }}>{name}</h3>
    <p style={{ margin: 0, fontSize: 28, lineHeight: 1.3, color: palette.textSoft }}>{children}</p>
  </div>
);

const FuturePredictions: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ position: 'absolute', inset: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 36 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 108, fontWeight: 520, lineHeight: 1.1 }}>The future of agents</h1>
        <h2 style={{ margin: 0, fontSize: 64, fontWeight: 450, lineHeight: 1.2, color: 'var(--osd-accent)' }}>6 predictions</h2>
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

const ContinuousWork: Page = () => <PredictionHeading number="3">Ambient agents</PredictionHeading>;
const ContextTeams: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ display: 'grid', gridTemplateColumns: '580px 1fr', gap: 48, height: '100%', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 68, fontWeight: 520, lineHeight: 1.15 }}>
          <span style={{ color: 'var(--osd-accent)' }}>2.</span> Company<br />knowledge bases<br />will become your<br />most valuable asset
        </h2>
        <img src={alexandriaKnowledgeBase} alt="Mastra’s Alexandria repository on GitHub, a shared company knowledge base" style={{ display: 'block', width: '100%', maxHeight: 716, objectFit: 'contain', borderRadius: 24 }} />
      </div>
    </Frame>
  </div>
);
const BeyondSoftware: Page = () => <PredictionHeading number="6">Factories spread<br />beyond software</PredictionHeading>;
const SignalsStartWork: Page = () => <PredictionHeading number="4">Signals kick off work</PredictionHeading>;
const EconomicViability: Page = () => <PredictionHeading number="5">Agents become more<br />economically viable</PredictionHeading>;

const AgentsJoinTheTeam: Page = () => (
  <div style={fill}>
    <Frame>
      <h2 style={{ margin: '0 0 32px', fontFamily: 'var(--osd-font-display)', fontSize: 76, fontWeight: 520, lineHeight: 1.2 }}>
        <span style={{ color: 'var(--osd-accent)' }}>1.</span> Agents join the team
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: 172, gap: 24 }}>
        <TeamAgentCard name="Customer">Customer call transcripts and CRM data</TeamAgentCard>
        <TeamAgentCard name="GTM">GTM and product marketing</TeamAgentCard>
        <TeamAgentCard name="Community">Open-source feedback and insights</TeamAgentCard>
        <TeamAgentCard name="Events">Event management</TeamAgentCard>
        <TeamAgentCard name="Software Factory">Software development in Slack</TeamAgentCard>
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
  'Mastra homepage screenshot supplied by the presenter.',
  'Mastra downloads chart supplied by the presenter.',
  'Mastra agent example combining instructions, model, tools, workspace, and browser. The required id and name fields are omitted for presentation brevity. Imports are omitted for readability: Agent from @mastra/core/agent, webFetchTool from @mastra/core/tools, Workspace from @mastra/core/workspace, DaytonaSandbox from @mastra/daytona, and AgentBrowser from @mastra/agent-browser. Configure OPENAI_API_KEY for the model. Daytona requires DAYTONA_API_KEY and @mastra/daytona. AgentBrowser requires @mastra/agent-browser and Chromium; this browser runs locally, separately from the remote sandbox. References: https://mastra.ai/docs/sandbox/overview and https://mastra.ai/docs/browser.',
  'Mastra building blocks: animated feature pills, with essential operational capabilities shown more quietly.',
  'Company logo screenshot supplied by the presenter.',
  `Customer examples grouped by the use case shown, not exclusive company categories. Sources checked September 22, 2026.
Customer-facing:
Sanity — CMS content creation/editing: https://mastra.ai/customers/sanity
Range — Rai financial advice: https://mastra.ai/customers/range
Factorial — permission-aware HR agent: https://mastra.ai/customers/factorial
Internal:
Marsh — LenAI company knowledge and MCP tools: https://mastra.ai/customers/marsh
Workday — security operations alert triage: https://mastra.ai/customers/workday
SoftBank — Satto Workspace document productivity: https://mastra.ai/customers/softbank
Developer platform:
Salesforce — Mastra powers the non-Claude harness in Agentforce Vibes; Claude models use the Claude Agent SDK: https://mastra.ai/customers/salesforce
Replit — Agent 3 generates Mastra agents/workflows; this does not claim Replit Agent itself runs on Mastra: https://mastra.ai/customers/replit
MongoDB — Sage internal developer platform, Parsley AI CI analysis and triage: https://mastra.ai/customers/mongodb
`,
  '',
  'Photo of Mastra agent books supplied by the presenter.',
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
  `A software factory coordinates agents, tools, shared context, and checks across an ongoing software delivery process. The circular loop runs through Signals, Triage, Plan, Build, Test, Review, Secure, Ship, and Monitor. Monitoring shipped software produces new signals, and the loop continues. Review and test feedback can also send work back for another iteration. Each stage can be automatic or require human approval; a factory does not imply unreviewed deployments. In Mastra Factory, GitHub, Linear, and Slack feed configurable boards, and agents investigate, plan, implement, and move work toward review in sandboxed environments.
Reference: https://mastra.ai/blog/announcing-mastra-factory-beta`,
  `Examples and reported snapshots, rather than directly comparable productivity measures. Stripe, Ramp, and Spotify card copy is paraphrased for presentation, not verbatim quotation; quotation marks indicate a conversational presentation style. The Cursor card preserves the user-supplied Lauren Tan quote.
Stripe Minions: approximately 1,300 merged PRs per week, reviewed by humans. Source: https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2
Ramp Inspect: 30% of merged frontend/backend PRs in the week reported by its builder Zach Bruggeman, not a permanent or current ceiling. Sources: https://builders.ramp.com/post/why-we-built-our-background-agent and https://www.linkedin.com/posts/zachbruggeman_the-craft-of-engineering-is-rapidly-changing-activity-7416509951386259456-O193
Spotify: Honk performed code modifications within Fleet Management; the backend Java migration took three days. Xirp is the later agentic development environment, not simply a rename of Honk. Sources: https://www.engineering.atspotify.com/2026/6/code-with-claude-coding-is-no-longer-the-constraint and https://portal.spotify.com/blog/introducing-xirp
Cursor: user-supplied quote attributed to Lauren Tan, her personal self-report, not Cursor company-wide output. Original post: https://x.com/poteto/status/2102050467505430555 (direct access blocked during verification). The figure was corroborated by an indexed copy, not independently audited. Do not imply she was at Cursor at the time.
Logo assets: Cursor from https://simpleicons.org; Stripe from https://commons.wikimedia.org/wiki/File:Stripe_Logo,_revised_2016.svg; Spotify from https://commons.wikimedia.org/wiki/File:2024_Spotify_Logo_(black).svg; Ramp from https://commons.wikimedia.org/wiki/File:Ramp_Business_Corporation_Logo.svg.`,
  '',
  'The full-screen Mastra Code demo autoplays muted and loops while this slide is active. Use the controls to enable sound. Video source: https://res.cloudinary.com/mastra-assets/video/upload/v1778051861/mastracode-demo_thoxc9.mp4',
  'Mastra Factory introduction screenshot supplied by the presenter.',
  'Work can start in Linear, Slack, or GitHub. Logo sources: Linear and GitHub from Simple Icons; Slack from https://commons.wikimedia.org/wiki/File:Slack_icon_2019.svg.',
  'Triage: the Factory Triage skill, shown in the screenshot supplied by the presenter.',
  'Build: a Mastra Factory coding session, shown in the screenshot supplied by the presenter.',
  '',
  '',
  'Observational Memory research screenshot supplied by the presenter.',
  'Mastra Factory knowledge graph screenshot supplied by the presenter.',
  'Product Hunt blocks third-party iframe embedding with X-Frame-Options: SAMEORIGIN. This slide uses a local snapshot of the launch details, captured September 19, 2026. Click the slide or Open live site to visit the interactive page: https://www.producthunt.com/products/mastra/launches/mastra-factory',
  'Build your factory today screenshot supplied by the presenter.',
  '',
  'Agents join the team: examples from Mastra. Customer — customer call transcripts and CRM data. GTM — GTM and product marketing. Community — open-source feedback and insights. Events — event management. Software Factory — software development in Slack.',
  'We make goals, decisions, ownership, and constraints explicit so agents can act without constantly asking us.',
  'They monitor, investigate, and move tasks forward between human interactions.',
  'Signals such as incidents and user questions kick off work.',
  'Agents and software factories become more economically viable.',
  'The same pattern extends to SRE, security, GTM, and other ongoing operations.',
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
  '2023 to 2026 spans three years: (2026 - 2023) × 12 = 36 months, comparing equivalent points in each year. The timeline uses year-level dates, not exact launch dates. Perspective prompt: what will change in the next 36 months?',
  'Mastra booth photo supplied by the presenter. QR code links to https://mastra.ai/.',
];

export const meta: SlideMeta = {
  title: 'Software Factories and the Future of Agents',
  theme: 'mastra',
  createdAt: '2026-09-19T11:37:47.364Z',
};

export default [Cover, MastraHomepage, MastraDownloads, SandboxAndBrowser, FeatureCloud, CompanyLogoWall, MastraCustomers, MastraPlatform, MastraAgentBooks, AgentTimeline, SoftwareFactoryDefinition, FactoryExamples, FactoryTitle, MastraCodeVideo, MastraFactoryIntroduction, HowWorkStarts, FactoryTriage, FactoryBuild, FactoryReview, FactoryShip, ObservationalMemoryScreenshot, FactoryKnowledgeGraph, FactoryProductHunt, BuildYourFactory, FuturePredictions, AgentsJoinTheTeam, ContextTeams, ContinuousWork, SignalsStartWork, EconomicViability, BeyondSoftware, AgentTimelineRecap, AgentTimelinePerspective, MastraBooth] satisfies Page[];
