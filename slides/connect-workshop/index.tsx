import { type ReactNode } from 'react'
import { useIsActivePage, type DesignSystem, type Page, type SlideMeta, type SlideTransition } from '@open-slide/core'
import greed from '@assets/fonts/GreedVF.woff2'
import wordmark from '@assets/Mastra wordmark black.svg'
import mastraQr from '@assets/qr/mastra.png'
import attioLogo from './assets/logos/attio.svg'
import canvaLogo from './assets/logos/canva.svg'
import clerkLogo from './assets/logos/clerk.svg'
import firefliesLogo from './assets/logos/fireflies.svg'
import githubLogo from './assets/logos/github.svg'
import gmailLogo from './assets/logos/gmail.svg'
import googleCalendarLogo from './assets/logos/googlecalendar.svg'
import googleDriveLogo from './assets/logos/googledrive.svg'
import hubspotLogo from './assets/logos/hubspot.svg'
import incidentIoLogo from './assets/logos/incident-io.svg'
import jiraLogo from './assets/logos/jira.svg'
import linearLogo from './assets/logos/linear.svg'
import neonLogo from './assets/logos/neon.svg'
import notionLogo from './assets/logos/notion.svg'
import posthogLogo from './assets/logos/posthog.svg'
import sanityLogo from './assets/logos/sanity.svg'
import slackLogo from './assets/logos/slack.svg'
import discordLogo from './assets/logos/discord.svg'
import supabaseLogo from './assets/logos/supabase.svg'
import workosLogo from './assets/logos/workos.svg'

export const design: DesignSystem = {
  palette: { bg: '#f5f6f4', text: '#101813', accent: '#19783a' },
  fonts: {
    display: '"Greed", "Inter", system-ui, sans-serif',
    body: '"Greed", "Inter", system-ui, sans-serif',
  },
  typeScale: { hero: 108, body: 34 },
  radius: 22,
}

type Appearance = 'system' | 'light' | 'dark'
const appearance: Appearance = 'system'
const mono = '"SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace'
const darkTokens = `
  --mt-bg: #07090b; --mt-text: #f3f5f7; --mt-accent: #7aff78;
  --mt-shell: #040506; --mt-panel: #090c11; --mt-border: #29332d;
  --mt-soft: #cfd6de; --mt-muted: #a2aca5; --mt-subtle: #111913;
  --mt-pill: #142619; --mt-pill-strong: #23442b; --mt-quiet: #141918;
  --mt-keyword: #d4adf0; --mt-string: #99deac; --mt-property: #9dc9fb;
  --mt-highlight: rgba(255,222,70,.17); --mt-shadow: rgba(0,0,0,.3);
  --mt-action: #7aff78; --mt-action-text: #102415; color-scheme: dark;
`
const themeCss = `
  @font-face { font-family: Greed; src: url(${greed}) format('woff2'); font-weight: 100 900; font-display: swap; }
  .mastra-template {
    --mt-bg: var(--osd-bg, #f5f6f4); --mt-text: var(--osd-text, #101813); --mt-accent: var(--osd-accent, #19783a);
    --mt-shell: #e6ebe5; --mt-panel: #fff; --mt-border: #c4cec5;
    --mt-soft: #25362b; --mt-muted: #46554b; --mt-subtle: #f3f7f1;
    --mt-pill: #edf6e8; --mt-pill-strong: #d8efcf; --mt-quiet: #f3f5f2;
    --mt-keyword: #75419a; --mt-string: #19783a; --mt-property: #245a96;
    --mt-highlight: rgba(255,222,70,.26); --mt-shadow: rgba(16,24,19,.14);
    --mt-action: #19783a; --mt-action-text: #fff; color-scheme: light;
    width: 100%; height: 100%; position: relative; isolation: isolate;
    background: var(--mt-bg); color: var(--mt-text);
    font-family: var(--osd-font-body, Greed, system-ui, sans-serif); letter-spacing: .015em;
  }
  .mastra-template, .mastra-template * { box-sizing: border-box; }
  .mastra-template[data-appearance="dark"] { ${darkTokens} }
  @media (prefers-color-scheme: dark) {
    .mastra-template[data-appearance="system"] { ${darkTokens} }
  }
  .mastra-template a:focus-visible, .mastra-template button:focus-visible { outline: 4px solid var(--mt-accent); outline-offset: 6px; }
  @keyframes mt-pill-drift { 0%,100% { transform: translate(-5px,14px); } 50% { transform: translate(5px,-16px); } }
  @keyframes mt-pill-quiet { 0%,100% { transform: translate(-2px,7px); } 50% { transform: translate(2px,-7px); } }
  .mt-feature { animation: mt-pill-drift 6s ease-in-out infinite; }
  .mt-feature[data-quiet] { animation-name: mt-pill-quiet; animation-duration: 9s; }
  @media (prefers-reduced-motion: reduce) {
    .mastra-template .mt-feature { animation: none !important; }
  }
  @media print {
    .mastra-template .mt-feature { animation: none !important; }
  }
`
if (typeof document !== 'undefined') {
  const id = 'mastra-connect-workshop-styles'
  const style = document.getElementById(id) ?? document.createElement('style')
  style.id = id
  if (style.textContent !== themeCss) style.textContent = themeCss
  if (!style.isConnected) document.head.appendChild(style)
}

const MastraPage = ({ children, mode = appearance }: { children: ReactNode; mode?: Appearance }) => {
  const preview = typeof location !== 'undefined' && location.pathname.startsWith('/themes/')
    ? new URLSearchParams(location.search).get('appearance') : null
  const resolved = preview === 'light' || preview === 'dark' || preview === 'system' ? preview : mode
  return <div className="mastra-template" data-appearance={resolved}>{children}</div>
}

const Frame = ({ children }: { children: ReactNode }) => <>
  <div style={{ position: 'absolute', inset: 56, borderRadius: 64, background: 'var(--mt-shell)' }} />
  <div style={{ position: 'absolute', inset: 92, borderRadius: 42, border: '1px solid var(--mt-border)', background: 'var(--mt-panel)', padding: '88px 96px' }}>{children}</div>
</>
const Center = ({ children }: { children: ReactNode }) => <div style={{ position: 'absolute', inset: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 36 }}>{children}</div>
const Title = ({ children }: { children: ReactNode }) => <h1 style={{ margin: 0, maxWidth: 1300, fontFamily: 'var(--osd-font-display)', fontSize: 'var(--osd-size-hero, 108px)', fontWeight: 520, lineHeight: 1.1, textWrap: 'balance' }}>{children}</h1>
const Heading = ({ children, size = 94 }: { children: ReactNode; size?: number }) => <h2 style={{ margin: 0, maxWidth: 1440, fontSize: size, fontWeight: 520, lineHeight: 1.15, textWrap: 'balance' }}>{children}</h2>
const Wordmark = () => <div role="img" aria-label="Mastra" style={{ width: 332, height: 84, background: 'var(--mt-text)', mask: `url("${wordmark}") center / contain no-repeat`, WebkitMask: `url("${wordmark}") center / contain no-repeat` }} />
const EventBadge = ({ children = 'Workshop' }: { children?: ReactNode }) => <div style={{ display: 'inline-flex', border: '1px solid var(--mt-border)', background: 'var(--mt-subtle)', borderRadius: 999, padding: '12px 22px', fontSize: 28, letterSpacing: '.1em', textTransform: 'uppercase' }}>{children}</div>

const QrOverlay = ({ src, href, side = 'left', opacity = .8 }: { src: string; href: string; side?: 'left' | 'right'; opacity?: number }) => <a href={href} target="_blank" rel="noreferrer" aria-label={`Scan or open ${href}`} style={{ position: 'absolute', bottom: 36, [side]: 36, zIndex: 2, opacity, padding: 24, borderRadius: 18, background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,.16)' }}>
  <img src={src} alt={`QR code for ${href}`} style={{ display: 'block', width: 200, height: 200, imageRendering: 'pixelated' }} />
</a>

const CodeLine = ({ children, highlight = false }: { children?: ReactNode; highlight?: boolean }) => <div style={{ minHeight: 48 }}><span style={highlight ? { background: 'linear-gradient(transparent 12%, var(--mt-highlight) 12%, var(--mt-highlight) 92%, transparent 92%)', borderRadius: 4 } : undefined}>{children}</span></div>
const K = ({ children }: { children: ReactNode }) => <span style={{ color: 'var(--mt-keyword)' }}>{children}</span>
const S = ({ children }: { children: ReactNode }) => <span style={{ color: 'var(--mt-string)' }}>{children}</span>
const P = ({ children }: { children: ReactNode }) => <span style={{ color: 'var(--mt-property)' }}>{children}</span>
const CodePanel = ({ children, command = false }: { children: ReactNode; command?: boolean }) => <pre style={{ margin: 0, padding: command ? '48px 56px' : '36px 44px', border: '1px solid var(--mt-border)', borderRadius: 24, background: 'var(--mt-subtle)', whiteSpace: 'pre', textAlign: 'left' }}><code style={{ fontFamily: mono, fontSize: command ? 64 : 34, lineHeight: command ? 1.4 : '48px', letterSpacing: '-.025em' }}>{children}</code></pre>

// `logo` adds a brand mark before the label; `mono` tints a black mark with the
// pill's text color via mask so it stays visible in dark mode.
const PillLogo = ({ src, size, mono = false }: { src: string; size: number; mono?: boolean }) => mono
  ? <span aria-hidden style={{ flex: 'none', width: size, height: size, background: 'currentcolor', mask: `url("${src}") center / contain no-repeat`, WebkitMask: `url("${src}") center / contain no-repeat` }} />
  : <img src={src} alt="" style={{ flex: 'none', width: size, height: size, objectFit: 'contain' }} />
const FeaturePill = ({ children, x, y, width, size = 42, quiet = false, prominent = false, delay = 0, logo, mono = false }: { children: ReactNode; x: number; y: number; width: number; size?: number; quiet?: boolean; prominent?: boolean; delay?: number; logo?: string; mono?: boolean }) => {
  const active = useIsActivePage()
  return <div style={{ position: 'absolute', left: x, top: y, width, transform: 'translate(-50%, -50%)' }}>
    <div className="mt-feature" data-quiet={quiet ? '' : undefined} style={{ animationDelay: `${delay}s`, animationPlayState: active ? 'running' : 'paused', borderRadius: 999, padding: quiet ? '17px 20px' : '24px 24px', background: quiet ? 'var(--mt-quiet)' : prominent ? 'var(--mt-pill-strong)' : 'var(--mt-pill)', border: '1px solid var(--mt-border)', boxShadow: quiet ? 'none' : '0 10px 28px var(--mt-shadow)', color: quiet ? 'var(--mt-muted)' : 'var(--mt-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: quiet ? 12 : 14, whiteSpace: 'nowrap', fontSize: quiet ? 28 : size, fontWeight: quiet ? 420 : 520, lineHeight: 1.2, letterSpacing: '-.015em' }}>
      {logo && <PillLogo src={logo} size={quiet ? 30 : size} mono={mono} />}
      {children}
    </div>
  </div>
}

const InfoCard = ({ title, children }: { title: string; children: ReactNode }) => <div style={{ border: '1px solid var(--mt-border)', borderRadius: 22, background: 'var(--mt-subtle)', padding: '24px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}><h3 style={{ margin: 0, fontSize: 38, fontWeight: 520, color: 'var(--mt-accent)' }}>{title}</h3><p style={{ margin: 0, fontSize: 32, lineHeight: 1.4, color: 'var(--mt-soft)' }}>{children}</p></div>

const Bullet = ({ n, children }: { n?: string; children: ReactNode }) => <div style={{ fontSize: 41, lineHeight: 1.4, color: 'var(--mt-soft)' }}>{n && <span style={{ color: 'var(--mt-accent)', marginRight: 20 }}>{n}</span>}{children}</div>

const FlowCard = ({ title, children }: { title: string; children: ReactNode }) => <div style={{ flex: 1, border: '1px solid var(--mt-border)', borderRadius: 22, background: 'var(--mt-subtle)', padding: '32px 34px', display: 'flex', flexDirection: 'column', gap: 18 }}>
  <h3 style={{ margin: 0, fontSize: 36, fontWeight: 520, color: 'var(--mt-accent)' }}>{title}</h3>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
</div>
const FlowLine = ({ children }: { children: ReactNode }) => <p style={{ margin: 0, fontSize: 27, lineHeight: 1.35, color: 'var(--mt-soft)' }}>{children}</p>
const FlowArrow = ({ label }: { label: string }) => <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 170 }}>
  <span style={{ fontSize: 52, color: 'var(--mt-accent)', lineHeight: 1 }}>→</span>
  <span style={{ fontSize: 22, color: 'var(--mt-muted)', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
</div>

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)'
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)'
export const transition: SlideTransition = {
  duration: 200,
  exit: { duration: 140, easing: EASE_IN, keyframes: [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-4px)' }] },
  enter: { duration: 200, delay: 80, easing: EASE_OUT, keyframes: [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }] },
}

// 1 — Cover
const Cover: Page = () => <MastraPage><Frame>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Wordmark /><EventBadge /></div>
  <div style={{ position: 'absolute', top: 172, bottom: 88, left: 96, right: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 40 }}>
    <Title>Connect</Title>
    <p style={{ margin: 0, fontSize: 44, color: 'var(--mt-muted)', maxWidth: 1200, lineHeight: 1.35 }}>Real tools and channels for your agents, in minutes</p>
  </div>
</Frame></MastraPage>

// 2 — Agenda / orientation
const Agenda: Page = () => <MastraPage><Frame>
  <Heading size={76}>Today</Heading>
  <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 34 }}>
    <Bullet n="1.">What Connect is: tools, channels, credentials</Bullet>
    <Bullet n="2.">Why it exists, and why now</Bullet>
    <Bullet n="3.">Demo 1: deploy a personal agent from a template</Bullet>
    <Bullet n="4.">How it works under the hood</Bullet>
    <Bullet n="5.">Demo 2: add Connect to an existing project</Bullet>
  </div>
</Frame></MastraPage>

// 3 — What is Connect
const WhatIsConnect: Page = () => <MastraPage><Frame>
  <Heading size={76}>What is Connect?</Heading>
  <p style={{ margin: '28px 0 0', fontSize: 36, lineHeight: 1.4, color: 'var(--mt-muted)', maxWidth: 1400 }}>Provider accounts live on Mastra platform. Your app uses them three ways:</p>
  <div style={{ marginTop: 40, display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 22, height: 420 }}>
    <InfoCard title="tools()">Ready-made provider tools for your agents</InfoCard>
    <InfoCard title="channels()">Talk to your agents from Slack, Discord, and Telegram</InfoCard>
    <InfoCard title="credential()">The raw token when you need to go direct</InfoCard>
  </div>
</Frame></MastraPage>

// 4 — Provider cloud
const ProviderCloud: Page = () => <MastraPage><Frame>
  <FeaturePill x={170} y={355} width={160} quiet delay={-2} logo={clerkLogo}>Clerk</FeaturePill>
  <FeaturePill x={530} y={800} width={260} quiet delay={-5} logo={incidentIoLogo} mono>incident.io</FeaturePill>
  <FeaturePill x={1500} y={165} width={200} quiet delay={-1} logo={workosLogo}>WorkOS</FeaturePill>
  <FeaturePill x={1475} y={495} width={230} quiet delay={-7} logo={firefliesLogo}>Fireflies</FeaturePill>

  <FeaturePill x={425} y={270} width={290} size={52} delay={-1} prominent logo={slackLogo}>Slack</FeaturePill>
  <FeaturePill x={1090} y={215} width={290} size={50} delay={-4} prominent logo={notionLogo} mono>Notion</FeaturePill>
  <FeaturePill x={1330} y={365} width={230} delay={-6} logo={jiraLogo}>Jira</FeaturePill>
  <FeaturePill x={1365} y={635} width={360} size={40} delay={-2} logo={googleDriveLogo}>Google Drive</FeaturePill>

  <FeaturePill x={285} y={550} width={250} size={44} delay={-5} logo={gmailLogo}>Gmail</FeaturePill>
  <FeaturePill x={575} y={655} width={260} size={40} delay={-2} logo={discordLogo}>Discord</FeaturePill>
  <FeaturePill x={935} y={610} width={290} size={50} delay={-4} prominent logo={githubLogo} mono>GitHub</FeaturePill>
  <FeaturePill x={685} y={120} width={265} size={40} delay={-7} logo={hubspotLogo}>HubSpot</FeaturePill>

  <FeaturePill x={865} y={435} width={345} size={60} delay={-3} prominent logo={linearLogo}>Linear</FeaturePill>
  <FeaturePill x={460} y={415} width={290} size={40} delay={-6} logo={supabaseLogo}>Supabase</FeaturePill>
  <FeaturePill x={1020} y={785} width={440} size={40} delay={-1} logo={googleCalendarLogo}>Google Calendar</FeaturePill>
  <FeaturePill x={235} y={130} width={255} size={38} delay={-5} logo={posthogLogo} mono>PostHog</FeaturePill>

  <FeaturePill x={1210} y={85} width={230} quiet delay={-6} logo={neonLogo}>Neon MCP</FeaturePill>
  <FeaturePill x={775} y={270} width={250} quiet delay={-3} logo={canvaLogo}>Canva MCP</FeaturePill>
  <FeaturePill x={235} y={725} width={250} quiet delay={-8} logo={sanityLogo} mono>Sanity MCP</FeaturePill>
  <FeaturePill x={1450} y={790} width={240} quiet delay={-4} logo={attioLogo}>Attio MCP</FeaturePill>
</Frame></MastraPage>

// 5 — Why now
const WhyNow: Page = () => <MastraPage><Frame>
  <Heading size={76}>Why now</Heading>
  <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 36 }}>
    <Bullet>Grok Bot, Dots, Muse: users love agents with real tools and data</Bullet>
    <Bullet>That's now table-stakes for your internal agents too</Bullet>
    <Bullet>Mastra platform started as hosting and observability</Bullet>
    <Bullet>Now it gives you everything in one place so you can move faster</Bullet>
  </div>
</Frame></MastraPage>

// 6 — The problem
const TheProblem: Page = () => <MastraPage><Frame>
  <Heading size={76}>The problem it solves</Heading>
  <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 36 }}>
    <Bullet>Managing credentials is a headache</Bullet>
    <Bullet>Every provider: an OAuth app, a token store, a refresh job</Bullet>
    <Bullet>Secrets sprawl across .env files, CI, and teammates' laptops</Bullet>
    <Bullet>Writing the same tool definitions for every new API</Bullet>
  </div>
</Frame></MastraPage>

// 7 — Value prop
const ValueProp: Page = () => <MastraPage><Frame>
  <Heading size={76}>Why Connect</Heading>
  <div style={{ marginTop: 48, display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 22, height: 480 }}>
    <InfoCard title="Fastest to set up">One CLI command per provider. No OAuth plumbing, no SDKs</InfoCard>
    <InfoCard title="Tools you can shape">Modify and extend them, not just what the MCP server gives you</InfoCard>
    <InfoCard title="No redeploys">Connections added or replaced on the platform show up live</InfoCard>
  </div>
</Frame></MastraPage>

// 8 — Demo 1 divider
const Demo1: Page = () => <MastraPage><Frame><Center>
  <EventBadge>Live demo 1</EventBadge>
  <Heading>Deploy a personal agent<br />from a template</Heading>
</Center></Frame></MastraPage>

// 9 — Demo 1 follow-along commands
const QuickStart: Page = () => <MastraPage><Frame>
  <Heading size={68}>Follow along</Heading>
  <div style={{ position: 'absolute', top: 240, bottom: 88, left: 96, right: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <CodePanel>
      <code style={{ fontFamily: mono, fontSize: 46, lineHeight: '84px', letterSpacing: '-.025em' }}>
        <S>npx</S>{' create-mastra@latest \\'}{'\n'}
        {'  '}<P>--template</P>{' template-connect-agent'}{'\n'}
        <S>mastra</S>{' connect add '}<P>linear</P>{'\n'}
        <S>mastra</S>{' deploy'}
      </code>
    </CodePanel>
  </div>
</Frame></MastraPage>

// 10 — tools()
const ToolsCode: Page = () => <MastraPage><Frame>
  <Heading size={68}>Give an agent tools</Heading>
  <div style={{ position: 'absolute', top: 240, bottom: 88, left: 96, right: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <CodePanel>
      <CodeLine><K>import</K>{' { Agent } '}<K>from</K>{' '}<S>'@mastra/core/agent'</S></CodeLine>
      <CodeLine><K>import</K>{' { tools } '}<K>from</K>{' '}<S>'@mastra/connect'</S></CodeLine>
      <CodeLine />
      <CodeLine><K>export const</K>{' opsAgent = '}<K>new</K>{' Agent({'}</CodeLine>
      <CodeLine>{'  '}<P>id</P>{': '}<S>'ops'</S>{','}</CodeLine>
      <CodeLine>{'  '}<P>instructions</P>{': '}<S>'You help the team track work.'</S>{','}</CodeLine>
      <CodeLine>{'  '}<P>model</P>{': ...,'}</CodeLine>
      <CodeLine highlight>{'  '}<P>tools</P>{': tools(),'}</CodeLine>
      <CodeLine>{'})'}</CodeLine>
    </CodePanel>
  </div>
</Frame></MastraPage>

// 11 — channels()
const ChannelsCode: Page = () => <MastraPage><Frame>
  <Heading size={68}>Give people a channel</Heading>
  <div style={{ position: 'absolute', top: 240, bottom: 88, left: 96, right: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <CodePanel>
      <CodeLine><K>import</K>{' { Mastra } '}<K>from</K>{' '}<S>'@mastra/core'</S></CodeLine>
      <CodeLine><K>import</K>{' { channels } '}<K>from</K>{' '}<S>'@mastra/connect'</S></CodeLine>
      <CodeLine />
      <CodeLine><K>export const</K>{' mastra = '}<K>new</K>{' Mastra({'}</CodeLine>
      <CodeLine>{'  '}<P>agents</P>{': { assistant },'}</CodeLine>
      <CodeLine highlight>{'  '}<P>channels</P>{': '}<K>await</K>{' channels(),'}</CodeLine>
      <CodeLine>{'})'}</CodeLine>
    </CodePanel>
  </div>
</Frame></MastraPage>

// 12 — Scope the toolset
const ScopeCode: Page = () => <MastraPage><Frame>
  <Heading size={68}>Scope it to what you trust</Heading>
  <div style={{ position: 'absolute', top: 240, bottom: 88, left: 96, right: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <CodePanel>
      <CodeLine><K>export const</K>{' opsAgent = '}<K>new</K>{' Agent({'}</CodeLine>
      <CodeLine>{'  '}<span style={{ color: 'var(--mt-soft)' }}>{'// ...id, instructions, model'}</span></CodeLine>
      <CodeLine>{'  '}<P>tools</P>{': '}<K>async</K>{' ctx => {'}</CodeLine>
      <CodeLine>{'    '}<K>const</K>{' role = ctx.requestContext?.get('}<S>'role'</S>{')'}</CodeLine>
      <CodeLine>{'    '}<K>return</K>{' tools({'}</CodeLine>
      <CodeLine>{'      '}<P>providers</P>{': {'}</CodeLine>
      <CodeLine highlight>{'        '}<P>linear</P>{': role === '}<S>'viewer'</S></CodeLine>
      <CodeLine highlight>{'          ? { '}<P>allowTools</P>{': ['}<S>'linear_list_*'</S>{'] }'}</CodeLine>
      <CodeLine highlight>{'          : { '}<P>requireApproval</P>{': ['}<S>'linear_delete_*'</S>{'] },'}</CodeLine>
      <CodeLine>{'      },'}</CodeLine>
      <CodeLine>{'    })(ctx)'}</CodeLine>
      <CodeLine>{'  },'}</CodeLine>
      <CodeLine>{'})'}</CodeLine>
    </CodePanel>
  </div>
</Frame></MastraPage>

// 13 — How it works
const HowItWorks: Page = () => <MastraPage><Frame>
  <Heading size={76}>How it works</Heading>
  <div style={{ marginTop: 64, display: 'flex', alignItems: 'stretch', gap: 24 }}>
    <FlowCard title="Your app">
      <FlowLine>@mastra/connect</FlowLine>
      <FlowLine>tools() · channels() · credential()</FlowLine>
      <FlowLine>Holds one platform token</FlowLine>
    </FlowCard>
    <div style={{ display: 'flex', alignItems: 'center' }}><FlowArrow label="platform token only" /></div>
    <FlowCard title="Platform proxy">
      <FlowLine>Injects the credential</FlowLine>
      <FlowLine>Refreshes OAuth tokens</FlowLine>
      <FlowLine>Records every call</FlowLine>
      <FlowLine>Locked to provider hosts</FlowLine>
    </FlowCard>
    <div style={{ display: 'flex', alignItems: 'center' }}><FlowArrow label="authorized request" /></div>
    <FlowCard title="Providers">
      <FlowLine>REST APIs</FlowLine>
      <FlowLine>Hosted MCP servers</FlowLine>
      <FlowLine>Your connected accounts</FlowLine>
    </FlowCard>
  </div>
  <p style={{ margin: '56px 0 0', fontSize: 38, color: 'var(--mt-accent)', fontWeight: 520 }}>Provider credentials never touch your app.</p>
</Frame></MastraPage>

// 14 — Done for you
const DoneForYou: Page = () => <MastraPage><Frame>
  <Heading size={76}>So you don't have to</Heading>
  <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 36 }}>
    <Bullet>Credentials stored and rotated on the platform, server-side</Bullet>
    <Bullet>OAuth tokens kept fresh by the platform, not your app</Bullet>
    <Bullet>Every proxied call audited, with no args or results logged</Bullet>
    <Bullet>MCP session lifecycle handled for you</Bullet>
    <Bullet>credential() when you need the raw token anyway</Bullet>
  </div>
</Frame></MastraPage>

// 15 — Demo 2 divider
const AdvancedDemo: Page = () => <MastraPage><Frame><Center>
  <EventBadge>Live demo 2</EventBadge>
  <Heading>Add Connect to an<br />existing project</Heading>
</Center></Frame></MastraPage>

// 16 — Questions
const Questions: Page = () => <MastraPage><Frame><Center>
  <Heading>Questions?</Heading>
  <div style={{ fontSize: 34, color: 'var(--mt-muted)', marginTop: 48 }}>Try it now · mastra.ai</div>
</Center></Frame><QrOverlay src={mastraQr} href="https://mastra.ai/" /></MastraPage>

export const notes = [
  'Preamble: yo, welcome to the stream — intros, how\'s the weather, where\'s everyone tuning in from. Housekeeping: questions in chat, we\'ll do Q&A at the end.',
  'Orientation: who this is for (people building agents with Mastra, or evaluating it), what we\'ll cover and in what order. Connect is in public beta and free on the platform while it is.',
  'Connect manages provider connections on your Mastra platform project. The @mastra/connect package surfaces them three ways. Tools = capabilities AND speed; channels = speed; credentials = the escape hatch. A provider defines the service; a connection authorizes an account on it.',
  'Breadth: ~23 providers with generated toolsets, plus hosted MCP providers (quiet pills) discovered at runtime. Run `mastra connect list` to see the live catalog. Multiple connections per provider are fine — e.g. two Slack workspaces.',
  'Grok Bot, Dots, Muse showed how much users value agents that can touch real tools and data. That\'s now the baseline expectation for internal agents too. Mastra platform began as hosting + o11y; Connect is part of maturing into one place with everything you need.',
  'The pain: per-provider OAuth apps, token stores, refresh jobs, secret sprawl, and hand-rolled tool definitions. Connect moves accounts and credentials to the platform; you add or replace connections without touching agent code or redeploying.',
  'Value prop: fastest path to working provider tools; a toolset you can filter/extend/gate (vs. taking whatever an MCP server exposes); live resolver picks up connection changes as caches refresh.',
  'DEMO 1 framing: a personal agent, from nothing to deployed on Mastra platform, using the template-connect-agent template. Seeing is believing — target: under 5 minutes. Prereqs done off-screen: platform project, `mastra auth login`, Gateway API key.',
  'Demo 1 script: scaffold from the template, fill .env (MASTRA_PLATFORM_ACCESS_TOKEN from `mastra auth tokens create`, MASTRA_PROJECT_ID), `mastra connect add linear` walks the OAuth flow in the browser, `mastra deploy` ships it to the platform. Then open Studio and ask it to list your Linear issues.',
  'tools() with no options = every connected provider with a supported toolset. Mastra calls the resolver per generate/stream; 30s TTL cache, stale-while-revalidate. Tool keys look like linear_list_issues.',
  'channels() registers channel providers + their webhook/OAuth routes at construction; credentials bind dynamically. Then connect the channel to an agent in Studio — two separate steps. Slack channels use an app-config token (slack-channels provider, distinct from slack tools).',
  'Scoping per request: the tools function reads request context (role set server-side from the authenticated user) and builds the toolset for THIS request. Viewers get read-only list tools; everyone else gets the full set but deletes pause for human approval. allowTools/requireApproval take globs and FAIL on typos — never silently widen. Note: constructing the resolver inside the callback trades the 30s cache for simplicity; hoist it if that matters. You can also merge your own tools into the returned object.',
  'Technical credibility moment. App holds ONE platform token. The proxy strips caller auth, injects the provider credential, refreshes OAuth, records the call (no args/results logged), and only allows the provider\'s API hosts. MCP providers: platform proxies the protocol to the hosted server; tools discovered at runtime, namespaced <provider>_<tool>.',
  'The "look at the shit we do so you don\'t have to" list. Mention multi-connection routing: with 2+ connections, agents get <provider>__list_connections and a connection_name input per call — or pin with connectionId. needs_reauth connections are skipped with a warning, not errors.',
  'DEMO 2: take an existing Mastra project and add Connect — npm install @mastra/connect, env vars, swap tools: tools() into an existing agent, show new tools appear in Studio. Then attach another connection on the platform and show it arrive live, without a redeploy. Optionally show requireApproval pausing a mutation.',
  'Recap the three primitives, point at docs (mastra.ai → Mastra platform → Connect), beta = free to use. Q&A from chat.',
]

export const meta: SlideMeta = {
  title: 'Mastra Connect',
  theme: 'mastra',
  createdAt: '2026-10-14T14:03:06.509Z',
}

export default [Cover, Agenda, WhatIsConnect, ProviderCloud, WhyNow, TheProblem, ValueProp, Demo1, QuickStart, ToolsCode, ChannelsCode, ScopeCode, HowItWorks, DoneForYou, AdvancedDemo, Questions] satisfies Page[]
