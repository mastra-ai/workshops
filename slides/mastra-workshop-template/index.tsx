import type { ReactNode } from 'react'
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core'
import greed from '@assets/fonts/GreedVF.woff2'
import wordmark from '@assets/Mastra wordmark black.svg'
import mastraQr from '@assets/qr/mastra.png'

// Five-page workshop starter copied from the Mastra catalog. Host details are optional.
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
const darkTokens = `
  --mw-bg: #07090b; --mw-text: #f3f5f7; --mw-accent: #7aff78;
  --mw-shell: #040506; --mw-panel: #090c11; --mw-border: #29332d;
  --mw-soft: #cfd6de; --mw-muted: #a2aca5; --mw-subtle: #111913;
  --mw-pill: #142619; --mw-pill-strong: #23442b; --mw-quiet: #141918;
  --mw-keyword: #d4adf0; --mw-string: #99deac; --mw-property: #9dc9fb;
  --mw-highlight: rgba(255,222,70,.17); --mw-shadow: rgba(0,0,0,.3);
  --mw-action: #7aff78; --mw-action-text: #102415; color-scheme: dark;
`
export const themeCss = `
  @font-face { font-family: Greed; src: url(${greed}) format('woff2'); font-weight: 100 900; font-display: swap; }
  .mastra-workshop-template {
    --mw-bg: var(--osd-bg, #f5f6f4); --mw-text: var(--osd-text, #101813); --mw-accent: var(--osd-accent, #19783a);
    --mw-shell: #e6ebe5; --mw-panel: #fff; --mw-border: #c4cec5;
    --mw-soft: #25362b; --mw-muted: #46554b; --mw-subtle: #f3f7f1;
    --mw-pill: #edf6e8; --mw-pill-strong: #d8efcf; --mw-quiet: #f3f5f2;
    --mw-keyword: #75419a; --mw-string: #19783a; --mw-property: #245a96;
    --mw-highlight: rgba(255,222,70,.26); --mw-shadow: rgba(16,24,19,.14);
    --mw-action: #19783a; --mw-action-text: #fff; color-scheme: light;
    width: 100%; height: 100%; position: relative; isolation: isolate;
    background: var(--mw-bg); color: var(--mw-text);
    font-family: var(--osd-font-body, Greed, system-ui, sans-serif); letter-spacing: .015em;
  }
  .mastra-workshop-template, .mastra-workshop-template * { box-sizing: border-box; }
  .mastra-workshop-template[data-appearance="dark"] { ${darkTokens} }
  @media (prefers-color-scheme: dark) {
    .mastra-workshop-template[data-appearance="system"] { ${darkTokens} }
  }
  .mastra-workshop-template a:focus-visible, .mastra-workshop-template button:focus-visible { outline: 4px solid var(--mw-accent); outline-offset: 6px; }

`
// One font/style registration; HMR replaces it instead of leaving stale rules.
if (typeof document !== 'undefined') {
  const id = 'mastra-workshop-template-styles'
  const style = document.getElementById(id) ?? document.createElement('style')
  style.id = id
  if (style.textContent !== themeCss) style.textContent = themeCss
  if (!style.isConnected) document.head.appendChild(style)
}

const MastraPage = ({ children, mode = appearance }: { children: ReactNode; mode?: Appearance }) => <div className="mastra-workshop-template" data-appearance={mode}>{children}</div>

const Frame = ({ children }: { children: ReactNode }) => <>
  <div style={{ position: 'absolute', inset: 56, borderRadius: 64, background: 'var(--mw-shell)' }} />
  <div style={{ position: 'absolute', inset: 92, borderRadius: 42, border: '1px solid var(--mw-border)', background: 'var(--mw-panel)', padding: '88px 96px' }}>{children}</div>
</>
const Center = ({ children }: { children: ReactNode }) => <div style={{ position: 'absolute', inset: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 36 }}>{children}</div>
const Title = ({ children }: { children: ReactNode }) => <h1 style={{ margin: 0, maxWidth: 1300, fontFamily: 'var(--osd-font-display)', fontSize: 'var(--osd-size-hero, 108px)', fontWeight: 520, lineHeight: 1.1, textWrap: 'balance' }}>{children}</h1>
const Heading = ({ children, size = 94 }: { children: ReactNode; size?: number }) => <h2 style={{ margin: 0, maxWidth: 1440, fontSize: size, fontWeight: 520, lineHeight: 1.15, textWrap: 'balance' }}>{children}</h2>
const Wordmark = () => <div role="img" aria-label="Mastra" style={{ width: 332, height: 84, background: 'var(--mw-text)', mask: `url("${wordmark}") center / contain no-repeat`, WebkitMask: `url("${wordmark}") center / contain no-repeat` }} />
const EventBadge = ({ children = 'Talk' }: { children?: ReactNode }) => <div style={{ display: 'inline-flex', border: '1px solid var(--mw-border)', background: 'var(--mw-subtle)', borderRadius: 999, padding: '12px 22px', fontSize: 28, letterSpacing: '.1em', textTransform: 'uppercase' }}>{children}</div>

// Fixed overlay: deliberately white in both themes for scanning. Use a real generated QR asset.
const QrOverlay = ({ src, href, side = 'left', opacity = .8 }: { src: string; href: string; side?: 'left' | 'right'; opacity?: number }) => <a href={href} target="_blank" rel="noreferrer" aria-label={`Scan or open ${href}`} style={{ position: 'absolute', bottom: 36, [side]: 36, zIndex: 2, opacity, padding: 24, borderRadius: 18, background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,.16)' }}>
  <img src={src} alt={`QR code for ${href}`} style={{ display: 'block', width: 200, height: 200, imageRendering: 'pixelated' }} />
</a>
const AgentCard = ({ title, children }: { title: string; children: ReactNode }) => <div style={{ border: '1px solid var(--mw-border)', borderRadius: 22, background: 'var(--mw-subtle)', padding: '24px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}><h3 style={{ margin: 0, fontSize: 38, fontWeight: 520, color: 'var(--mw-accent)' }}>{title}</h3><p style={{ margin: 0, fontSize: 32, lineHeight: 1.4, color: 'var(--mw-soft)' }}>{children}</p></div>

const Cover: Page = () => <MastraPage><Frame>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Wordmark /><EventBadge>Workshop</EventBadge></div>
  <div style={{ position: 'absolute', top: 172, bottom: 88, left: 96, right: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><Title>Your workshop<br />title goes here</Title></div>
</Frame></MastraPage>
const Welcome: Page = () => <MastraPage><Frame><EventBadge>Workshop</EventBadge><div style={{ marginTop: 120 }}><Heading>Welcome!</Heading><p style={{ fontSize: 41, lineHeight: 1.4, maxWidth: 1120, color: 'var(--mw-soft)' }}>Build one useful agent together.</p></div></Frame></MastraPage>
const Agenda: Page = () => <MastraPage><Frame><Heading>What you’ll learn</Heading><div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 34, fontSize: 46, lineHeight: 1.4 }}><div><span style={{ color: 'var(--mw-accent)' }}>1.</span> Build an agent</div><div><span style={{ color: 'var(--mw-accent)' }}>2.</span> Add a capability</div><div><span style={{ color: 'var(--mw-accent)' }}>3.</span> Put it to work</div></div></Frame></MastraPage>
const Hosts: Page = () => <MastraPage><Frame><Heading>Meet your hosts</Heading><div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, height: 440 }}><AgentCard title="Host name">Session lead</AgentCard><AgentCard title="Host name">Product expert</AgentCard></div></Frame></MastraPage>

const Questions: Page = () => <MastraPage><Frame><Center><Heading>Questions?</Heading><p style={{ margin: '48px 0 0', fontSize: 34, color: 'var(--mw-muted)' }}>Try it now</p></Center></Frame><QrOverlay src={mastraQr} href="https://mastra.ai/" /></MastraPage>

export const notes = [
  'Replace the title. Keep host names and subtitles off the cover unless requested.',
  'Set expectations and share the workshop repo or primary attendee action verbally.',
  'Replace these three goals with the actual workshop outcomes.',
  'Optional host slide: replace the names and roles, or remove this page and its notes together.',
  'Leave this up during questions. The QR code opens https://mastra.ai/.',
]
export const meta: SlideMeta = {
  title: 'Mastra Workshop Template',
  theme: 'mastra',
  createdAt: '2026-06-04T13:45:16.417Z',
}
export default [Cover, Welcome, Agenda, Hosts, Questions] satisfies Page[]
