import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useIsActivePage, type DesignSystem, type Page } from '@open-slide/core'
import greed from '@assets/fonts/GreedVF.woff2'
import wordmark from '@assets/Mastra wordmark black.svg'
import mastraQr from '@assets/qr/mastra.png'

// Copy the shared foundation and only the page recipes you need into a new deck.
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
// Lock this to light for a bright venue. System follows OS changes live through CSS.
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
export const themeCss = `
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
  .mt-demo-button { background: var(--mt-action); color: var(--mt-action-text); box-shadow: 0 12px 40px var(--mt-shadow); transition: transform 220ms ease, box-shadow 220ms ease, filter 220ms ease; }
  .mt-demo-button:hover, .mt-demo-button:focus-visible { transform: translateY(-8px) scale(1.035); filter: brightness(1.08); box-shadow: 0 20px 52px var(--mt-shadow); }
  .mt-demo-button span { transition: transform 220ms ease; }
  .mt-demo-button:hover span, .mt-demo-button:focus-visible span { transform: translate(6px,-6px); }
  @keyframes mt-pill-drift { 0%,100% { transform: translate(-5px,14px); } 50% { transform: translate(5px,-16px); } }
  @keyframes mt-pill-quiet { 0%,100% { transform: translate(-2px,7px); } 50% { transform: translate(2px,-7px); } }
  @keyframes mt-push-pull { 0%,100% { grid-template-columns: 50% 50%; } 25% { grid-template-columns: 52% 48%; } 75% { grid-template-columns: 48% 52%; } }
  .mt-feature { animation: mt-pill-drift 6s ease-in-out infinite; }
  .mt-feature[data-quiet] { animation-name: mt-pill-quiet; animation-duration: 9s; }
  .mt-split { animation: mt-push-pull 16s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .mastra-template .mt-feature, .mastra-template .mt-split { animation: none !important; }
    .mastra-template .mt-demo-button, .mastra-template .mt-demo-button span { transition: none; transform: none; }
  }
  @media print {
    .mastra-template .mt-feature, .mastra-template .mt-split { animation: none !important; }
    .mt-demo-button, .mt-demo-button span { transform: none !important; }
  }
`
// One font/style registration; HMR replaces it instead of leaving stale rules.
if (typeof document !== 'undefined') {
  const id = 'mastra-template-styles'
  const style = document.getElementById(id) ?? document.createElement('style')
  style.id = id
  if (style.textContent !== themeCss) style.textContent = themeCss
  if (!style.isConnected) document.head.appendChild(style)
}

export const MastraPage = ({ children, mode = appearance }: { children: ReactNode; mode?: Appearance }) => {
  // Gallery-only query override for reviewing both palettes; no controls on a talk slide.
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
const EventBadge = ({ children = 'Talk' }: { children?: ReactNode }) => <div style={{ display: 'inline-flex', border: '1px solid var(--mt-border)', background: 'var(--mt-subtle)', borderRadius: 999, padding: '12px 22px', fontSize: 28, letterSpacing: '.1em', textTransform: 'uppercase' }}>{children}</div>

// Fixed overlay: deliberately white in both themes for scanning. Use a real generated QR asset.
const QrOverlay = ({ src, href, side = 'left', opacity = .8 }: { src: string; href: string; side?: 'left' | 'right'; opacity?: number }) => <a href={href} target="_blank" rel="noreferrer" aria-label={`Scan or open ${href}`} style={{ position: 'absolute', bottom: 36, [side]: 36, zIndex: 2, opacity, padding: 24, borderRadius: 18, background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,.16)' }}>
  <img src={src} alt={`QR code for ${href}`} style={{ display: 'block', width: 200, height: 200, imageRendering: 'pixelated' }} />
</a>
const LiveSiteLink = ({ href }: { href: string }) => <a href={href} target="_blank" rel="noreferrer" style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 2, opacity: .8, background: 'var(--mt-panel)', color: 'var(--mt-text)', border: '1px solid var(--mt-border)', borderRadius: 12, padding: '14px 22px', fontSize: 24, textDecoration: 'none' }}>Open live site ↗</a>
const DemoLink = ({ href }: { href: string }) => <a className="mt-demo-button" href={href} target="_blank" rel="noreferrer" style={{ position: 'absolute', right: 64, bottom: 56, zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: 32, padding: '32px 60px', borderRadius: 26, border: '2px solid var(--mt-panel)', fontSize: 72, fontWeight: 550, lineHeight: 1.2, textDecoration: 'none' }}>Demo <span aria-hidden>↗</span></a>

const CodeLine = ({ children, highlight = false }: { children?: ReactNode; highlight?: boolean }) => <div style={{ minHeight: 48 }}><span style={highlight ? { background: 'linear-gradient(transparent 12%, var(--mt-highlight) 12%, var(--mt-highlight) 92%, transparent 92%)', borderRadius: 4 } : undefined}>{children}</span></div>
const K = ({ children }: { children: ReactNode }) => <span style={{ color: 'var(--mt-keyword)' }}>{children}</span>
const S = ({ children }: { children: ReactNode }) => <span style={{ color: 'var(--mt-string)' }}>{children}</span>
const P = ({ children }: { children: ReactNode }) => <span style={{ color: 'var(--mt-property)' }}>{children}</span>
const CodePanel = ({ children, command = false }: { children: ReactNode; command?: boolean }) => <pre style={{ margin: 0, padding: command ? '48px 56px' : '36px 44px', border: '1px solid var(--mt-border)', borderRadius: 24, background: 'var(--mt-subtle)', whiteSpace: 'pre', textAlign: 'left' }}><code style={{ fontFamily: mono, fontSize: command ? 64 : 34, lineHeight: command ? 1.4 : '48px', letterSpacing: '-.025em' }}>{children}</code></pre>

const FeaturePill = ({ children, x, y, width, size = 42, quiet = false, prominent = false, delay = 0 }: { children: ReactNode; x: number; y: number; width: number; size?: number; quiet?: boolean; prominent?: boolean; delay?: number }) => {
  const active = useIsActivePage()
  return <div style={{ position: 'absolute', left: x, top: y, width, transform: 'translate(-50%, -50%)' }}>
    <div className="mt-feature" data-quiet={quiet ? '' : undefined} style={{ animationDelay: `${delay}s`, animationPlayState: active ? 'running' : 'paused', borderRadius: 999, padding: quiet ? '17px 20px' : '24px 24px', background: quiet ? 'var(--mt-quiet)' : prominent ? 'var(--mt-pill-strong)' : 'var(--mt-pill)', border: '1px solid var(--mt-border)', boxShadow: quiet ? 'none' : '0 10px 28px var(--mt-shadow)', color: quiet ? 'var(--mt-muted)' : 'var(--mt-accent)', textAlign: 'center', whiteSpace: 'nowrap', fontSize: quiet ? 28 : size, fontWeight: quiet ? 420 : 520, lineHeight: 1.2, letterSpacing: '-.015em' }}>{children}</div>
  </div>
}
const AgentCard = ({ title, children }: { title: string; children: ReactNode }) => <div style={{ border: '1px solid var(--mt-border)', borderRadius: 22, background: 'var(--mt-subtle)', padding: '24px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}><h3 style={{ margin: 0, fontSize: 38, fontWeight: 520, color: 'var(--mt-accent)' }}>{title}</h3><p style={{ margin: 0, fontSize: 32, lineHeight: 1.4, color: 'var(--mt-soft)' }}>{children}</p></div>

// Visual fixture for the catalog, not a product screenshot. Replace with a supplied asset.
const SampleScreen = ({ kind = 'product' }: { kind?: 'product' | 'profile' }) => <div aria-label={kind === 'product' ? 'Product screenshot slot' : 'Profile screenshot slot'} style={{ width: '100%', height: '100%', padding: '80px 64px', background: kind === 'product' ? 'var(--mt-subtle)' : 'var(--mt-panel)', color: 'var(--mt-text)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
  <div style={{ fontSize: 26, color: 'var(--mt-muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{kind === 'product' ? 'Product screenshot' : 'Profile screenshot'}</div>
  <div style={{ fontSize: 72, fontWeight: 520, lineHeight: 1.12 }}>{kind === 'product' ? 'Make something useful.' : 'Keep in touch.'}</div>
  <div style={{ height: 2, background: 'var(--mt-border)' }} />
  <div style={{ display: 'flex', gap: 18 }}><div style={{ width: 128, height: 128, borderRadius: 28, background: 'var(--mt-pill-strong)' }} /><div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}><div style={{ height: 18, background: 'var(--mt-border)', borderRadius: 8 }} /><div style={{ height: 18, width: '70%', background: 'var(--mt-border)', borderRadius: 8 }} /></div></div>
</div>

// External pages may block framing. A static snapshot keeps the talk reliable.
// Use this component only after checking the chosen page and its asset paths.
const WebsiteSurface = ({ url, title, strategy = 'iframe', snapshot }: { url: string; title: string; strategy?: 'iframe' | 'static' | 'snapshot'; snapshot?: string }) => {
  const [html, setHtml] = useState('')
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    setHtml(''); setFailed(false)
    if (strategy !== 'static') return
    const abort = new AbortController()
    fetch(url, { signal: abort.signal }).then(response => {
      if (!response.ok) throw new Error('Unavailable')
      return response.text()
    }).then(source => {
      const page = new DOMParser().parseFromString(source, 'text/html')
      page.querySelectorAll('script, base, meta[http-equiv="refresh"]').forEach(node => node.remove())
      const base = page.createElement('base'); base.href = url; base.target = '_blank'; page.head.prepend(base)
      setHtml('<!doctype html>' + page.documentElement.outerHTML)
    }).catch(() => { if (!abort.signal.aborted) setFailed(true) })
    return () => abort.abort()
  }, [url, strategy])
  const fallback = <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 40 }}>{failed ? 'Open the live site to continue.' : 'Loading…'}</div>
  return <>
    {strategy === 'snapshot' && snapshot ? <img src={snapshot} alt={title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : strategy === 'static' ? html ? <iframe title={title} srcDoc={html} sandbox="allow-popups allow-popups-to-escape-sandbox" style={{ width: '100%', height: '100%', border: 0 }} /> : fallback : strategy === 'iframe' ? <iframe title={title} src={url} style={{ width: '100%', height: '100%', border: 0 }} /> : <div style={{ padding: 120, fontSize: 40 }}>Add a screenshot for this page.</div>}
    <LiveSiteLink href={url} />
  </>
}
const VideoSurface = ({ src, poster }: { src: string; poster?: string }) => {
  const active = useIsActivePage()
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (active) void video.play().catch(() => {})
    else video.pause()
    return () => video.pause()
  }, [active])
  return <video ref={ref} src={src} poster={poster} controls autoPlay={active} loop muted playsInline preload="metadata" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', background: 'var(--mt-bg)' }} />
}

// Runnable, offline embed example. Real local demos go in the deck assets folder.
const localDemo = `<!doctype html><html><head><meta charset="utf-8"><style>
  :root { color-scheme: light dark; font-family: system-ui; }
  * { box-sizing: border-box; } body { margin: 0; background: light-dark(#f5f6f4,#07090b); color: light-dark(#101813,#f3f5f7); }
  main { height: 720px; padding: 80px; display: flex; flex-direction: column; justify-content: center; gap: 32px; }
  h1 { margin: 0; font-size: 64px; font-weight: 520; } p { margin: 0; font-size: 30px; }
  button { align-self: start; border: 0; border-radius: 14px; padding: 20px 30px; font-size: 28px; background: light-dark(#19783a,#7aff78); color: light-dark(white,#102415); cursor: pointer; }
</style></head><body><main><h1>Interactive demo</h1><p id="count">0 ideas explored</p><button onclick="document.getElementById('count').textContent = (++window.count) + ' ideas explored'">Explore an idea</button></main><script>window.count = 0</script></body></html>`

const Cover: Page = () => <MastraPage><Frame>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Wordmark /><EventBadge /></div>
  <div style={{ position: 'absolute', top: 172, bottom: 88, left: 96, right: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><Title>Build something<br />worth talking about</Title></div>
</Frame></MastraPage>
const Section: Page = () => <MastraPage><Frame><Center><Heading>Make moves<br />with your next idea</Heading></Center></Frame></MastraPage>
const Statement: Page = () => <MastraPage><Frame><Center><Heading><span style={{ color: 'var(--mt-accent)' }}>1.</span> One clear prediction</Heading></Center></Frame></MastraPage>
const Command: Page = () => <MastraPage><Frame><Center><CodePanel command><S>npm</S>{' '}<P>create</P>{' mastra'}<K>@latest</K></CodePanel></Center></Frame><QrOverlay src={mastraQr} href="https://mastra.ai/" /></MastraPage>
const Code: Page = () => <MastraPage><Frame><Center><CodePanel>
  <CodeLine><K>const</K>{' agent = '}<K>new</K>{' Agent({ ... })'}</CodeLine>
  <CodeLine />
  <CodeLine highlight><K>const</K>{' controller = '}<K>new</K>{' AgentController({'}</CodeLine>
  <CodeLine highlight>{'  '}<P>id</P>{': '}<S>'research-harness'</S>{','}</CodeLine>
  <CodeLine highlight>{'  agent,'}</CodeLine>
  <CodeLine highlight>{'  storage,'}</CodeLine>
  <CodeLine highlight>{'  '}<P>modes</P>{': [ ... ],'}</CodeLine>
  <CodeLine highlight>{'})'}</CodeLine>
  <CodeLine />
  <CodeLine><K>await</K>{' controller.init()'}</CodeLine>
</CodePanel></Center></Frame></MastraPage>
const FeatureCloud: Page = () => <MastraPage><Frame>
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
</Frame></MastraPage>
const AgentGrid: Page = () => <MastraPage><Frame><Heading size={76}>Agents join the team</Heading>
  <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3,170px)', gap: 22 }}>
    <AgentCard title="Customer agent">Customer knowledge and requirements</AgentCard>
    <AgentCard title="Marketing agent">GTM and product marketing</AgentCard>
    <AgentCard title="Community agent">Open-source feedback and insights</AgentCard>
    <AgentCard title="Workshop agent">Workshop management</AgentCard>
    <div style={{ gridColumn: '1 / -1', display: 'grid' }}><AgentCard title="Factory agent">Software development in Slack</AgentCard></div>
  </div>
</Frame></MastraPage>
const ScreenshotBesideText: Page = () => <MastraPage><Frame>
  <div style={{ display: 'grid', gridTemplateColumns: '580px 1fr', gap: 48, height: '100%', alignItems: 'center' }}>
    <Heading size={68}>Your next idea<br />in action</Heading>
    <div style={{ height: 640, border: '1px solid var(--mt-border)', borderRadius: 24, overflow: 'hidden' }}><SampleScreen /></div>
  </div>
</Frame></MastraPage>
const GridWithScreenshot: Page = () => <MastraPage><Frame><Heading size={76}>Agents join the team</Heading>
  <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '600px 1fr', gap: 36, height: 596 }}>
    <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 18 }}>
      <AgentCard title="Customer agent">Customer knowledge</AgentCard>
      <AgentCard title="Community agent">Feedback and insights</AgentCard>
      <AgentCard title="Factory agent">Development in Slack</AgentCard>
    </div>
    <div style={{ border: '1px solid var(--mt-border)', borderRadius: 24, overflow: 'hidden' }}><SampleScreen /></div>
  </div>
</Frame></MastraPage>
const Website: Page = () => <MastraPage><WebsiteSurface url="https://mastra.ai/integrations" title="Mastra integrations" strategy="static" /></MastraPage>
const Video: Page = () => <MastraPage><VideoSurface src="https://res.cloudinary.com/mastra-assets/video/upload/v1778051861/mastracode-demo_thoxc9.mp4" /></MastraPage>
const LocalInteractive: Page = () => <MastraPage><iframe title="Local interactive demo" srcDoc={localDemo} sandbox="allow-scripts" style={{ width: 1280, height: 720, border: 0, display: 'block', transform: 'scale(1.5)', transformOrigin: 'top left', colorScheme: 'inherit' }} /></MastraPage>
const ScreenshotDemo: Page = () => <MastraPage><SampleScreen /><DemoLink href="https://mastra.ai/factory" /></MastraPage>
const Questions: Page = () => <MastraPage><Frame><Center><Heading>Questions?</Heading><div style={{ fontSize: 34, color: 'var(--mt-muted)', marginTop: 48 }}>Try it now · mastra.ai</div></Center></Frame><QrOverlay src={mastraQr} href="https://mastra.ai/" /><QrOverlay src={mastraQr} href="https://mastra.ai/" side="right" /></MastraPage>
const SplitClosing: Page = () => {
  const active = useIsActivePage()
  return <MastraPage>
    <div className="mt-split" style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '50% 50%', gridTemplateRows: 'minmax(0,1fr)', animationPlayState: active ? 'running' : 'paused' }}>
      <div style={{ minWidth: 0, overflow: 'hidden' }}><SampleScreen /></div>
      <div style={{ minWidth: 0, overflow: 'hidden' }}><SampleScreen kind="profile" /></div>
    </div>
    <QrOverlay src={mastraQr} href="https://mastra.ai/" /><QrOverlay src={mastraQr} href="https://mastra.ai/" side="right" />
  </MastraPage>
}
const Welcome: Page = () => <MastraPage><Frame><EventBadge>Workshop</EventBadge><div style={{ marginTop: 120 }}><Heading>Welcome!</Heading><p style={{ fontSize: 41, lineHeight: 1.4, maxWidth: 1120, color: 'var(--mt-soft)' }}>Build one useful agent together.</p></div></Frame></MastraPage>
const Agenda: Page = () => <MastraPage><Frame><Heading>What you’ll learn</Heading><div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 34, fontSize: 46, lineHeight: 1.4 }}><div><span style={{ color: 'var(--mt-accent)' }}>1.</span> Build an agent</div><div><span style={{ color: 'var(--mt-accent)' }}>2.</span> Add a capability</div><div><span style={{ color: 'var(--mt-accent)' }}>3.</span> Put it to work</div></div></Frame></MastraPage>
const Hosts: Page = () => <MastraPage><Frame><Heading>Meet your hosts</Heading><div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, height: 440 }}><AgentCard title="Host name">Session lead</AgentCard><AgentCard title="Host name">Product expert</AgentCard></div></Frame></MastraPage>

export const templateNames = ['Minimal talk cover', 'Section h2', 'Heading-only prediction', 'Command', 'Highlighted code', 'Floating feature pills', 'Agent grid', 'Text + screenshot', 'Grid + screenshot', 'Full-screen website', 'Autoplay video', 'Local interactive demo', 'Screenshot + Demo', 'Questions + QR', 'Split closing + fixed QR', 'Workshop welcome', 'Workshop agenda', 'Optional hosts']
export const notes = ['', '', '', '', 'Abridged teaching example: restore imports and Agent configuration; supply persistent storage and valid modes. Verify current APIs before authoring a real example.', '', 'Example roles, not a required list for every talk.', 'Replace the catalog fixture with a supplied screenshot using objectFit: contain.', 'Keep the supplied screenshot readable; use compact cards on the left. Add only as many examples as fit.', 'Static HTML preserves the source site’s appearance. Use Open live site for script-driven interactions.', 'Autoplay is muted and active-page-only. Controls allow sound. The original video colors are preserved.', 'Replace srcDoc with imported HTML or a served URL; bundle relative assets. Never use file:// in a hosted deck.', 'Use a normal HTTPS destination by default. Test Chrome-specific launch separately when explicitly requested.', 'Replace the right QR with the presenter’s real profile QR; keep its href and encoded destination identical.', 'Replace both fixtures and the right QR with actual assets. Only the panels animate.', '', '', 'Host details are optional, never add a presenter name to a minimal talk cover without a request.']
export default [Cover, Section, Statement, Command, Code, FeatureCloud, AgentGrid, ScreenshotBesideText, GridWithScreenshot, Website, Video, LocalInteractive, ScreenshotDemo, Questions, SplitClosing, Welcome, Agenda, Hosts] satisfies Page[]
