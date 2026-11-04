import type { ReactNode } from 'react'
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core'
import greed from '@assets/fonts/GreedVF.woff2'
import wordmark from '@assets/Mastra wordmark black.svg'

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
  .mastra-observability-roadmap {
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
  .mastra-observability-roadmap, .mastra-observability-roadmap * { box-sizing: border-box; }
  .mastra-observability-roadmap[data-appearance="dark"] { ${darkTokens} }
  @media (prefers-color-scheme: dark) {
    .mastra-observability-roadmap[data-appearance="system"] { ${darkTokens} }
  }
  .mastra-observability-roadmap a:focus-visible, .mastra-observability-roadmap button:focus-visible { outline: 4px solid var(--mt-accent); outline-offset: 6px; }
`
// One font/style registration; HMR replaces it instead of leaving stale rules.
if (typeof document !== 'undefined') {
  const id = 'mastra-observability-roadmap-styles'
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
  return <div className="mastra-observability-roadmap" data-appearance={resolved}>{children}</div>
}

const Frame = ({ children }: { children: ReactNode }) => <>
  <div style={{ position: 'absolute', inset: 56, borderRadius: 64, background: 'var(--mt-shell)' }} />
  <div style={{ position: 'absolute', inset: 92, borderRadius: 42, border: '1px solid var(--mt-border)', background: 'var(--mt-panel)', padding: '88px 96px' }}>{children}</div>
</>
const Title = ({ children }: { children: ReactNode }) => <h1 style={{ margin: 0, maxWidth: 1300, fontFamily: 'var(--osd-font-display)', fontSize: 'var(--osd-size-hero, 108px)', fontWeight: 520, lineHeight: 1.1, textWrap: 'balance' }}>{children}</h1>
const Wordmark = () => <div role="img" aria-label="Mastra" style={{ width: 332, height: 84, background: 'var(--mt-text)', mask: `url("${wordmark}") center / contain no-repeat`, WebkitMask: `url("${wordmark}") center / contain no-repeat` }} />
const EventBadge = ({ children = 'Talk' }: { children?: ReactNode }) => <div style={{ display: 'inline-flex', border: '1px solid var(--mt-border)', background: 'var(--mt-subtle)', borderRadius: 999, padding: '12px 22px', fontSize: 28, letterSpacing: '.1em', textTransform: 'uppercase' }}>{children}</div>

const Cover: Page = () => <MastraPage><Frame>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Wordmark /><EventBadge /></div>
  <div style={{ position: 'absolute', top: 172, bottom: 88, left: 96, right: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><Title>Mastra Observability<br />Roadmap</Title></div>
</Frame></MastraPage>

const RoadmapIcon = ({ kind }: { kind: 'annotation' | 'tag' | 'dashboard' | 'intelligence' | 'alert' | 'views' | 'editor' | 'diagnose' | 'evals' | 'optimize' }) => <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--mt-accent)', flexShrink: 0 }}>
  {kind === 'annotation' && <><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-3 2V11.5a8.5 8.5 0 0 1 17-1" /><path d="m13 6 5-5 3 3-5 5-4 1z" /></>}
  {kind === 'tag' && <><path d="M20 13 11 22 2 13V2h11l9 9z" /><circle cx="7" cy="7" r="1.5" /></>}
  {kind === 'dashboard' && <><rect x="3" y="3" width="7" height="10" rx="1" /><rect x="14" y="3" width="7" height="6" rx="1" /><rect x="3" y="17" width="7" height="4" rx="1" /><rect x="14" y="13" width="7" height="8" rx="1" /></>}
  {kind === 'intelligence' && <><path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8z" /></>}
  {kind === 'alert' && <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>}
  {kind === 'views' && <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M9 4v16M9 10h13" /></>}
  {kind === 'editor' && <><path d="m8 5-7 7 7 7M16 5l7 7-7 7M14 3l-4 18" /></>}
  {kind === 'diagnose' && <><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6M7 10h6M10 7v6" /></>}
  {kind === 'evals' && <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="m8 9 2 2 5-5M8 16h8" /></>}
  {kind === 'optimize' && <><path d="M20 7a9 9 0 0 0-15-2L2 8m0-6v6h6M4 17a9 9 0 0 0 15 2l3-3m0 6v-6h-6" /></>}
</svg>
const TimingBadge = ({ children, provisional = false }: { children: ReactNode; provisional?: boolean }) => <span style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 18px', borderRadius: 999, border: '1px solid var(--mt-border)', background: provisional ? 'var(--mt-quiet)' : 'var(--mt-pill)', color: provisional ? 'var(--mt-muted)' : 'var(--mt-accent)', fontSize: 26, lineHeight: 1.25, whiteSpace: 'nowrap' }}>{children}</span>
const RoadmapBullet = ({ kind, children, timing, provisional = false }: { kind: Parameters<typeof RoadmapIcon>[0]['kind']; children: ReactNode; timing?: string; provisional?: boolean }) => <li style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 42, lineHeight: 1.3 }}><RoadmapIcon kind={kind} /><span>{children}</span>{timing && <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><TimingBadge>{timing}</TimingBadge>{provisional && <TimingBadge provisional>Provisional</TimingBadge>}</div>}</li>

const YearHeading = ({ children }: { children: ReactNode }) => <h2 style={{ margin: 0, fontSize: 76, fontWeight: 520, lineHeight: 1.15 }}>{children}</h2>

const Roadmap2026: Page = () => <MastraPage><Frame>
  <YearHeading>2026</YearHeading>
  <ul style={{ listStyle: 'none', padding: 0, margin: '64px 0 0', display: 'flex', flexDirection: 'column', gap: 40 }}>
    <RoadmapBullet kind="annotation" timing="November">Annotations & assignments</RoadmapBullet>
    <RoadmapBullet kind="dashboard" timing="November">Custom dashboards</RoadmapBullet>
    <RoadmapBullet kind="alert" timing="November" provisional>Alerts</RoadmapBullet>
    <RoadmapBullet kind="tag" timing="December">Tags</RoadmapBullet>
    <RoadmapBullet kind="intelligence" timing="December" provisional>Trace Intelligence public beta</RoadmapBullet>
  </ul>
</Frame></MastraPage>

const Roadmap2027: Page = () => <MastraPage><Frame>
  <YearHeading>2027</YearHeading>
  <ul style={{ listStyle: 'none', padding: 0, margin: '64px 0 0', display: 'flex', flexDirection: 'column', gap: 40 }}>
    <RoadmapBullet kind="diagnose" timing="Proposed">Automated root-cause analysis</RoadmapBullet>
    <RoadmapBullet kind="optimize" timing="Proposed">Continuous agent optimization</RoadmapBullet>
    <RoadmapBullet kind="views">Custom views</RoadmapBullet>
    <RoadmapBullet kind="editor">Prompt management</RoadmapBullet>
  </ul>
</Frame></MastraPage>

export const notes = ['', 'Roadmap as of October 2026. November: Annotations, including assignments; Custom dashboards; Alerts (provisional). December: Tags; Trace Intelligence public beta (provisional). Dates reflect planned timing supplied for this presentation.', '2027: Custom views, with timing TBD, and prompt management. Two proposed directions for discussion, not committed deliverables: automated root-cause analysis across traces and tool failures; continuous agent optimization through measured prompt/model experiments and human-reviewed improvements.']
export const meta: SlideMeta = {
  title: 'Mastra Observability Roadmap',
  theme: 'mastra',
  createdAt: '2026-10-30T15:22:25.379Z',
}
export default [Cover, Roadmap2026, Roadmap2027] satisfies Page[]
