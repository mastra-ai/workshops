import type { ReactNode } from 'react'
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core'
import greed from '@assets/fonts/GreedVF.woff2'
import wordmark from '@assets/Mastra wordmark black.svg'

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
const darkTokens = `
  --mt-bg: #07090b; --mt-text: #f3f5f7; --mt-accent: #7aff78;
  --mt-shell: #0b1010; --mt-panel: #0d1214; --mt-border: #2d3a34;
  --mt-soft: #cfd6de; --mt-muted: #a2aca5; --mt-subtle: #121b18;
  --mt-pill: #142a1d; --mt-code: #99deac; --mt-blue: #75baff;
  --mt-blue-soft: #10233a; --mt-amber: #ffc866; --mt-amber-soft: #2b2110;
  --mt-violet: #c6a5ff; --mt-violet-soft: #211936; --mt-coral: #ff9b86;
  --mt-coral-soft: #321a17; --mt-shadow: rgba(0,0,0,.42); color-scheme: dark;
`
export const themeCss = `
  @font-face { font-family: Greed; src: url(${greed}) format('woff2'); font-weight: 100 900; font-display: swap; }
  .signals-long-running {
    --mt-bg: var(--osd-bg, #f5f6f4); --mt-text: var(--osd-text, #101813); --mt-accent: var(--osd-accent, #19783a);
    --mt-shell: #dce7df; --mt-panel: #fffefa; --mt-border: #bdcbc1;
    --mt-soft: #25362b; --mt-muted: #526158; --mt-subtle: #f0f6ef;
    --mt-pill: #e5f5e7; --mt-code: #126a32; --mt-blue: #176fc1;
    --mt-blue-soft: #e8f3ff; --mt-amber: #b76808; --mt-amber-soft: #fff1d8;
    --mt-violet: #7550b7; --mt-violet-soft: #f1eaff; --mt-coral: #b94b36;
    --mt-coral-soft: #ffebe5; --mt-shadow: rgba(24,57,37,.16); color-scheme: light;
    position: relative; width: 100%; height: 100%; isolation: isolate; overflow: hidden;
    background:
      radial-gradient(circle at 12% 15%, color-mix(in srgb, var(--mt-blue) 13%, transparent) 0, transparent 30%),
      radial-gradient(circle at 87% 82%, color-mix(in srgb, var(--mt-amber) 12%, transparent) 0, transparent 32%),
      linear-gradient(145deg, var(--mt-bg), color-mix(in srgb, var(--mt-bg) 86%, var(--mt-violet-soft)));
    color: var(--mt-text);
    font-family: var(--osd-font-body, Greed, system-ui, sans-serif);
  }
  .signals-long-running, .signals-long-running * { box-sizing: border-box; }
  .signals-long-running[data-appearance="dark"] { ${darkTokens} }
  @media (prefers-color-scheme: dark) {
    .signals-long-running[data-appearance="system"] { ${darkTokens} }
  }
`
if (typeof document !== 'undefined') {
  const id = 'signals-long-running-styles'
  const style = document.getElementById(id) ?? document.createElement('style')
  style.id = id
  if (style.textContent !== themeCss) style.textContent = themeCss
  if (!style.isConnected) document.head.appendChild(style)
}

const mono = '"SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace'
const MastraPage = ({ children }: { children: ReactNode }) => <div className="signals-long-running" data-appearance={appearance}>{children}</div>
const Frame = ({ children }: { children: ReactNode }) => <>
  <div style={{ position: 'absolute', inset: 56, borderRadius: 64, background: 'linear-gradient(135deg, color-mix(in srgb, var(--mt-shell) 88%, var(--mt-blue-soft)), color-mix(in srgb, var(--mt-shell) 88%, var(--mt-amber-soft)))', boxShadow: '0 30px 80px var(--mt-shadow)' }} />
  <div style={{ position: 'absolute', inset: 72, borderRadius: 54, border: '1px solid color-mix(in srgb, var(--mt-border) 70%, transparent)', opacity: .72 }} />
  <div style={{ position: 'absolute', inset: 92, borderRadius: 42, border: '1px solid var(--mt-border)', background: 'linear-gradient(150deg, color-mix(in srgb, var(--mt-panel) 97%, var(--mt-blue-soft)), color-mix(in srgb, var(--mt-panel) 96%, var(--mt-amber-soft)))', boxShadow: '0 18px 48px var(--mt-shadow), inset 0 1px 0 rgba(255,255,255,.55)', padding: '88px 96px' }}>{children}</div>
</>
const Wordmark = () => <div role="img" aria-label="Mastra" style={{ width: 332, height: 84, background: 'linear-gradient(90deg, var(--mt-text), var(--mt-accent))', mask: `url("${wordmark}") center / contain no-repeat`, WebkitMask: `url("${wordmark}") center / contain no-repeat` }} />
const Badge = ({ children }: { children: ReactNode }) => <span style={{ display: 'inline-block', border: '1px solid color-mix(in srgb, var(--mt-violet) 55%, var(--mt-border))', background: 'linear-gradient(135deg, var(--mt-violet-soft), var(--mt-blue-soft))', color: 'var(--mt-violet)', boxShadow: '0 8px 22px var(--mt-shadow)', borderRadius: 999, padding: '12px 22px', fontSize: 24, lineHeight: 1, letterSpacing: '.075em', textTransform: 'uppercase' }}>{children}</span>

// ── diagram kit ────────────────────────────────────────────────────────────
// Wires live in one SVG layer; boxes are HTML so type stays crisp at 1920×1080.
type Tone = 'plain' | 'accent' | 'ghost'
const semanticSurface = (value?: ReactNode) => {
  const text = typeof value === 'string' ? value.toLowerCase() : ''
  if (/state|snapshot|delta|storage|history/.test(text)) return { bg: 'var(--mt-blue-soft)', color: 'var(--mt-blue)' }
  if (/event|notification|inbox|queue|approval/.test(text)) return { bg: 'var(--mt-amber-soft)', color: 'var(--mt-amber)' }
  if (/process|provider|subscriber|processor|system|pubsub/.test(text)) return { bg: 'var(--mt-violet-soft)', color: 'var(--mt-violet)' }
  if (/error|idle|skip|ends|no match/.test(text)) return { bg: 'var(--mt-coral-soft)', color: 'var(--mt-coral)' }
  return { bg: 'var(--mt-subtle)', color: 'var(--mt-muted)' }
}
const MarkerDefs = ({ id, tone }: { id: string; tone: 'accent' | 'muted' }) => <defs>
  <marker id={id} markerWidth={10} markerHeight={10} refX={8} refY={5} orient="auto">
    <path d="M0,0 L10,5 L0,10 Z" style={{ fill: tone === 'accent' ? 'var(--mt-accent)' : 'var(--mt-border)' }} />
  </marker>
</defs>
const Diagram = ({ id, width = 1544, height = 420, wires, children }: { id: string; width?: number; height?: number; wires: ReactNode; children?: ReactNode }) => <div style={{ position: 'relative', width, height, flexShrink: 0 }}>
  <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', inset: 0 }}>
    <MarkerDefs id={`${id}-a`} tone="accent" />
    <MarkerDefs id={`${id}-m`} tone="muted" />
    {wires}
  </svg>
  {children}
</div>
const Wire = ({ id, d, tone = 'accent', dashed = false, arrow = true }: { id: string; d: string; tone?: 'accent' | 'muted'; dashed?: boolean; arrow?: boolean }) => <path d={d} markerEnd={arrow ? `url(#${id}-${tone === 'accent' ? 'a' : 'm'})` : undefined}
  style={{ fill: 'none', stroke: tone === 'accent' ? 'var(--mt-accent)' : 'var(--mt-border)', strokeWidth: 2.5, strokeDasharray: dashed ? '10 9' : undefined }} />
const Line = ({ d, tone = 'muted', width = 3, dashed = false }: { d: string; tone?: 'accent' | 'muted'; width?: number; dashed?: boolean }) => <path d={d}
  style={{ fill: 'none', stroke: tone === 'accent' ? 'var(--mt-accent)' : 'var(--mt-border)', strokeWidth: width, strokeDasharray: dashed ? '10 9' : undefined }} />
const Tag = ({ x, y, children, size = 22, tone = 'muted', anchor = 'middle', label = true }: { x: number; y: number; children: ReactNode; size?: number; tone?: 'accent' | 'muted' | 'text'; anchor?: 'start' | 'middle' | 'end'; label?: boolean }) => <text x={x} y={y} textAnchor={anchor}
  style={{ fill: tone === 'accent' ? 'var(--mt-accent)' : tone === 'text' ? 'var(--mt-text)' : 'var(--mt-muted)', fontSize: size, fontWeight: label ? 540 : 480, fontFamily: label ? mono : 'inherit', letterSpacing: label ? '.025em' : '0', textTransform: label ? 'uppercase' : 'none' }}>{children}</text>
const Box = ({ x, y, w, h, label, tone = 'plain', size = 32, radius = 20, pad = 24, gap = 12, children }: { x: number; y: number; w: number; h: number; label?: string; tone?: Tone; size?: number; radius?: number; pad?: number; gap?: number; children: ReactNode }) => {
  const semantic = semanticSurface(label ?? children)
  return <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, padding: pad, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap,
    background: tone === 'accent' ? 'linear-gradient(145deg, var(--mt-pill), color-mix(in srgb, var(--mt-pill) 72%, var(--mt-blue-soft)))' : tone === 'ghost' ? 'transparent' : `linear-gradient(145deg, ${semantic.bg}, color-mix(in srgb, ${semantic.bg} 72%, var(--mt-panel)))`,
    border: tone === 'accent' ? '2px solid var(--mt-accent)' : tone === 'ghost' ? '2px dashed var(--mt-border)' : `1px solid color-mix(in srgb, ${semantic.color} 42%, var(--mt-border))`, borderRadius: radius,
    boxShadow: tone === 'ghost' ? 'none' : '0 12px 28px var(--mt-shadow), inset 0 1px 0 rgba(255,255,255,.5)' }}>
    {label && <span style={{ fontFamily: mono, fontSize: 21, lineHeight: 1.15, letterSpacing: '.065em', textTransform: 'uppercase', color: tone === 'accent' ? 'var(--mt-accent)' : semantic.color }}>{label}</span>}
    <span style={{ fontSize: size, lineHeight: 1.24, letterSpacing: '-.01em', color: tone === 'ghost' ? 'var(--mt-muted)' : 'var(--mt-text)' }}>{children}</span>
  </div>
}
const Chip = ({ x, y, w, h = 68, tone = 'plain', size = 28, children }: { x: number; y: number; w: number; h?: number; tone?: Tone; size?: number; children: ReactNode }) => {
  const semantic = semanticSurface(children)
  return <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, display: 'grid', placeItems: 'center', padding: '0 18px', textAlign: 'center',
    background: tone === 'accent' ? 'linear-gradient(135deg, var(--mt-pill), var(--mt-blue-soft))' : tone === 'ghost' ? 'transparent' : `linear-gradient(135deg, ${semantic.bg}, var(--mt-panel))`,
    border: tone === 'accent' ? '2px solid var(--mt-accent)' : tone === 'ghost' ? '2px dashed var(--mt-border)' : `1px solid color-mix(in srgb, ${semantic.color} 38%, var(--mt-border))`,
    boxShadow: tone === 'ghost' ? 'none' : '0 8px 20px var(--mt-shadow)', borderRadius: 999, fontSize: size, lineHeight: 1.2, letterSpacing: '-.008em', color: tone === 'ghost' ? 'var(--mt-muted)' : 'var(--mt-text)' }}>{children}</div>
}
const Tick = ({ x, y, w = 40, h = 40, tone = 'plain' }: { x: number; y: number; w?: number; h?: number; tone?: Tone }) => <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 10,
  background: tone === 'accent' ? 'var(--mt-accent)' : tone === 'ghost' ? 'transparent' : 'var(--mt-panel)',
  border: tone === 'accent' ? '2px solid var(--mt-accent)' : tone === 'ghost' ? '2px dashed var(--mt-border)' : '1px solid var(--mt-border)' }} />
const Dot = ({ x, y, r = 9, tone = 'accent' }: { x: number; y: number; r?: number; tone?: 'accent' | 'muted' }) => <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: 999, background: tone === 'accent' ? 'var(--mt-accent)' : 'var(--mt-border)' }} />

const Story = ({ chapter, title, children }: { chapter: string; title: string; children: ReactNode }) => <MastraPage><Frame>
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ color: 'var(--mt-accent)', fontFamily: mono, fontSize: 23, lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: '.085em' }}>{chapter}</div>
    <h2 style={{ margin: '20px 0 0', maxWidth: 1500, fontSize: 74, fontWeight: 520, lineHeight: 1.08, letterSpacing: '-.032em' }}>{title}</h2>
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 0, width: '100%' }}>{children}</div>
  </div>
</Frame></MastraPage>
const Code = ({ children }: { children: ReactNode }) => <div style={{ flex: '1 1 0', minWidth: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center', border: '1px solid color-mix(in srgb, var(--mt-blue) 35%, var(--mt-border))', borderLeft: '6px solid var(--mt-blue)', borderRadius: 22, background: 'linear-gradient(145deg, var(--mt-blue-soft), color-mix(in srgb, var(--mt-panel) 90%, var(--mt-violet-soft)))', boxShadow: '0 14px 32px var(--mt-shadow)', padding: '38px 42px', color: 'var(--mt-code)', fontFamily: mono, fontSize: 25, lineHeight: 1.55, letterSpacing: '-.012em', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{children}</div>
const Split = ({ children }: { children: ReactNode }) => <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 36 }}>{children}</div>

// ── 01 cover ───────────────────────────────────────────────────────────────
const Cover: Page = () => <MastraPage><Frame><div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Wordmark /><Badge>Workshop</Badge></div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><h1 style={{ margin: 0, maxWidth: 1350, fontSize: 'var(--osd-size-hero, 108px)', lineHeight: 1.04, fontWeight: 520, letterSpacing: '-.045em' }}>Signals for Long-Running Agents (LRA)</h1></div>
  <Diagram id="cover" height={130} wires={<>
    <Wire id="cover" d="M400,40 L400,84" />
    <Wire id="cover" d="M772,40 L772,84" />
    <Wire id="cover" d="M1140,40 L1140,84" />
    <Line d="M60,88 L1400,88" tone="accent" width={3} />
    <Wire id="cover" d="M1400,88 L1478,88" />
    <Tag x={400} y={26}>message</Tag>
    <Tag x={772} y={26}>state</Tag>
    <Tag x={1140} y={26}>event</Tag>
    <Tag x={60} y={122} anchor="start" tone="accent">one thread, still running</Tag>
  </>} />
  <div style={{ textAlign: 'center', fontSize: 30, color: 'var(--mt-muted)', paddingTop: 24 }}>Abhi Aiyer · Tyler Barnes</div>
</div></Frame></MastraPage>

// ── 02 hosts ───────────────────────────────────────────────────────────────
const HostCard = ({ initials, name, role }: { initials: string; name: string; role: string }) => <div style={{ flex: 1, minWidth: 0, height: 372, padding: 48, background: initials === 'AA' ? 'linear-gradient(145deg, var(--mt-blue-soft), var(--mt-panel))' : 'linear-gradient(145deg, var(--mt-violet-soft), var(--mt-panel))', border: '1px solid var(--mt-border)', borderLeft: `6px solid ${initials === 'AA' ? 'var(--mt-blue)' : 'var(--mt-violet)'}`, borderRadius: 26, boxShadow: '0 16px 36px var(--mt-shadow)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
  <div style={{ width: 112, height: 112, borderRadius: 999, border: `2px solid ${initials === 'AA' ? 'var(--mt-blue)' : 'var(--mt-violet)'}`, background: initials === 'AA' ? 'var(--mt-blue-soft)' : 'var(--mt-violet-soft)', color: initials === 'AA' ? 'var(--mt-blue)' : 'var(--mt-violet)', boxShadow: '0 10px 24px var(--mt-shadow)', display: 'grid', placeItems: 'center', fontFamily: mono, fontSize: 40, letterSpacing: '.04em' }}>{initials}</div>
  <div style={{ fontSize: 54, fontWeight: 520, lineHeight: 1.06, letterSpacing: '-.025em' }}>{name}</div>
  <div style={{ fontSize: 29, lineHeight: 1.35, letterSpacing: '-.008em', color: 'var(--mt-muted)' }}>{role}</div>
</div>
const Hosts: Page = () => <MastraPage><Frame><div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', gap: 56 }}>
  <h2 style={{ margin: 0, fontSize: 80, fontWeight: 520, lineHeight: 1.15 }}>Meet your hosts</h2>
  <div style={{ display: 'flex', gap: 64 }}>
    <HostCard initials="AA" name="Abhi Aiyer" role="CTO &amp; Co-Founder, Mastra" />
    <HostCard initials="TB" name="Tyler Barnes" role="Founding Principal Engineer, Mastra" />
  </div>
</div></Frame></MastraPage>

// ── 03 agents as functions ─────────────────────────────────────────────────
const AgentsChanged: Page = () => <Story chapter="01 / Back in the day" title="We treated agents like functions">
  <Diagram id="p3" wires={<>
    <Wire id="p3" d="M340,215 L466,215" />
    <Wire id="p3" d="M870,215 L996,215" />
    <Wire id="p3" d="M1300,215 L1392,215" tone="muted" dashed arrow={false} />
    <Line d="M1398,148 L1398,282" width={5} />
    <Tag x={1398} y={122} tone="accent">stream ends</Tag>
    <Tag x={772} y={378} size={30} label={false} tone="text">That worked for turn-based chat. Then the turn ended.</Tag>
  </>}>
    <Box x={40} y={160} w={300} h={110} label="Request">One prompt</Box>
    <Box x={470} y={120} w={400} h={190} tone="accent" label="Run" size={38}>Agent runs once</Box>
    <Box x={1000} y={160} w={300} h={110} label="Response">One answer</Box>
  </Diagram>
</Story>

// ── 04 now long-running ────────────────────────────────────────────────────
const InterfaceDidNot: Page = () => <Story chapter="01 / The new era" title="Now agents are long-running">
  <Diagram id="p4" wires={<>
    <Wire id="p4" d="M400,92 L400,206" />
    <Wire id="p4" d="M770,92 L770,206" />
    <Wire id="p4" d="M1140,92 L1140,206" />
    <Wire id="p4" d="M1300,258 L1436,258" />
    <Tag x={1368} y={222} tone="accent">keeps going</Tag>
    <Tag x={60} y={372} anchor="start">time →</Tag>
    <Tag x={1484} y={372} anchor="end" size={30} label={false}>The thread stays reachable while it works.</Tag>
  </>}>
    <Chip x={250} y={20} w={300}>Person · follow-up</Chip>
    <Chip x={620} y={20} w={300}>Tool result</Chip>
    <Chip x={990} y={20} w={300}>Outside event</Chip>
    <Box x={60} y={210} w={1240} h={96} tone="accent" radius={48} size={36}>One live thread</Box>
  </Diagram>
</Story>

// ── 05 the primitive ───────────────────────────────────────────────────────
const NewPrimitive: Page = () => <Story chapter="01 / The new primitive" title="New input reaches the same thread">
  <Diagram id="p5" wires={<>
    <Wire id="p5" d="M380,110 C450,110 470,180 516,192" />
    <Wire id="p5" d="M380,285 C450,285 470,250 516,238" />
    <Wire id="p5" d="M820,190 C880,170 900,124 956,108" />
    <Wire id="p5" d="M820,240 C880,260 900,278 956,290" />
    <Tag x={772} y={402} size={28} label={false}>Same thread either way — callers can override both paths.</Tag>
  </>}>
    <Box x={20} y={60} w={360} h={100} size={30}>Person · follow-up</Box>
    <Box x={20} y={235} w={360} h={100} size={30}>System · an event</Box>
    <Box x={520} y={140} w={300} h={150} tone="accent" radius={75} label="Signal" size={36}>Typed input</Box>
    <Box x={960} y={40} w={520} h={130} tone="accent" label="Thread is active" size={34}>Joins the run in progress</Box>
    <Box x={960} y={230} w={520} h={120} label="Thread is idle" size={34}>Wakes a new run</Box>
  </Diagram>
</Story>

// ── 06 the anchor ──────────────────────────────────────────────────────────
const Loop: Page = () => <Story chapter="01 / The new primitive" title="More than a chat message">
  <Diagram id="p6" wires={<>
    <Wire id="p6" d="M320,59 C392,59 380,205 426,205" />
    <Wire id="p6" d="M320,133 C392,133 384,205 426,205" />
    <Wire id="p6" d="M320,207 L426,205" />
    <Wire id="p6" d="M320,281 C392,281 384,205 426,205" />
    <Wire id="p6" d="M730,205 L806,205" />
    <Wire id="p6" d="M1110,205 L1186,205" />
    <Wire id="p6" d="M1357,282 C1357,358 1100,374 964,374 L964,286" dashed />
    <Tag x={1196} y={318} tone="accent">the loop stays running</Tag>
    <Tag x={20} y={384} anchor="start" size={28} label={false}>A user message is one kind of signal, not the only kind.</Tag>
  </>}>
    <Chip x={20} y={30} w={300} h={58} size={27}>User message</Chip>
    <Chip x={20} y={104} w={300} h={58} size={27}>System context</Chip>
    <Chip x={20} y={178} w={300} h={58} size={27}>State</Chip>
    <Chip x={20} y={252} w={300} h={58} size={27}>Event</Chip>
    <Box x={430} y={130} w={300} h={150} label="Outside">Something happens</Box>
    <Box x={810} y={130} w={300} h={150} tone="accent" label="Thread">Same live run</Box>
    <Box x={1190} y={130} w={334} h={150} label="Next step">Agent acts on it</Box>
  </Diagram>
</Story>

// ── 07 observe ─────────────────────────────────────────────────────────────
const Observe: Page = () => <Story chapter="02 / Watch and steer" title="First: watch the thread, not the request">
  <Split>
    <Code>{'const sub = agent.subscribeToThread({\n  resourceId, threadId,\n})\n\nfor await (const c of sub.stream) {\n  render(c)\n}'}</Code>
    <Diagram id="p7" width={800} height={400} wires={<>
      <Wire id="p7" d="M250,180 C380,180 400,72 516,72" />
      <Wire id="p7" d="M250,200 L516,200" />
      <Wire id="p7" d="M250,220 C380,220 400,328 516,328" />
      <Tag x={20} y={62} anchor="start">output belongs to the thread</Tag>
      <Tag x={392} y={386} size={28} label={false}>many eyes, one run</Tag>
    </>}>
      <Box x={20} y={140} w={230} h={120} tone="accent" label="Thread" size={28}>Agent stream</Box>
      <Chip x={520} y={30} w={260} h={84}>terminal</Chip>
      <Chip x={520} y={158} w={260} h={84}>web app</Chip>
      <Chip x={520} y={286} w={260} h={84}>slack bot</Chip>
    </Diagram>
  </Split>
</Story>

// ── 08 thread stream ───────────────────────────────────────────────────────
const ThreadStream: Page = () => <Story chapter="02 / Watch and steer" title="The stream tells you what happened">
  <Diagram id="p8" wires={<>
    <Line d="M40,240 L1420,240" width={3} />
    <Wire id="p8" d="M1420,240 L1498,240" />
    <Line d="M600,112 L600,330" dashed />
    <Tag x={600} y={92} tone="accent">subscribe</Tag>
    <Tag x={280} y={152}>history · stored messages</Tag>
    <Tag x={1000} y={152} tone="accent">live · output + lifecycle</Tag>
    <Tag x={722} y={322} size={20}>text</Tag>
    <Tag x={902} y={322} size={20}>tool</Tag>
    <Tag x={1082} y={322} size={20}>approval</Tag>
    <Tag x={1262} y={322} size={20}>error</Tag>
    <Tag x={40} y={384} anchor="start" size={28} label={false}>Group chunks by run. Unsubscribing does not abort the run.</Tag>
  </>}>
    <Tick x={80} y={180} w={120} h={44} tone="ghost" />
    <Tick x={240} y={180} w={120} h={44} tone="ghost" />
    <Tick x={400} y={180} w={120} h={44} tone="ghost" />
    <Tick x={700} y={218} tone="accent" />
    <Tick x={880} y={218} />
    <Tick x={1060} y={218} tone="accent" />
    <Tick x={1240} y={218} />
  </Diagram>
</Story>

// ── 09 send ────────────────────────────────────────────────────────────────
const Send: Page = () => <Story chapter="02 / Watch and steer" title="Now you can talk to a running agent">
  <Split>
    <Code>{'agent.sendMessage("...", {\n  resourceId, threadId,\n})'}</Code>
    <Diagram id="p9" width={800} height={400} wires={<>
      <Wire id="p9" d="M280,328 C400,328 400,262 466,226" />
      <Tag x={400} y={70}>run in progress</Tag>
      <Tag x={770} y={384} anchor="end" size={24} label={false}>lands in the current run</Tag>
    </>}>
      <Box x={30} y={92} w={740} h={132} tone="accent" radius={26} pad={0} />
      <Tick x={110} y={140} />
      <Tick x={270} y={140} />
      <Tick x={430} y={140} tone="accent" />
      <Tick x={590} y={140} />
      <Chip x={30} y={290} w={250} h={76} tone="accent" size={27}>sendMessage</Chip>
      <Dot x={470} y={224} r={11} />
    </Diagram>
  </Split>
</Story>

// ── 10 queue ───────────────────────────────────────────────────────────────
const QueueRow = ({ x, y, n, children }: { x: number; y: number; n: string; children: ReactNode }) => <div style={{ position: 'absolute', left: x, top: y, width: 250, height: 64, display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', background: 'var(--mt-panel)', border: '1px solid var(--mt-border)', borderRadius: 14 }}>
  <span style={{ fontFamily: mono, fontSize: 24, color: 'var(--mt-accent)' }}>{n}</span>
  <span style={{ fontSize: 26, color: 'var(--mt-text)' }}>{children}</span>
</div>
const Queue: Page = () => <Story chapter="02 / Watch and steer" title="Or leave the next instruction in line">
  <Split>
    <Code>{'agent.queueMessage("...", {\n  resourceId, threadId,\n})'}</Code>
    <Diagram id="p10" width={800} height={400} wires={<>
      <Wire id="p10" d="M550,215 L596,215" />
      <Wire id="p10" d="M270,110 C420,58 560,80 686,168" dashed />
      <Tag x={145} y={62} size={20}>queued · in order</Tag>
      <Tag x={445} y={146} size={20} tone="accent">running</Tag>
      <Tag x={690} y={146} size={20}>next</Tag>
      <Tag x={20} y={352} anchor="start" tone="accent">if idle → starts now</Tag>
    </>}>
      <QueueRow x={20} y={90} n="1">follow-up</QueueRow>
      <QueueRow x={20} y={170} n="2">retry</QueueRow>
      <QueueRow x={20} y={250} n="3">summarize</QueueRow>
      <Box x={340} y={170} w={210} h={90} tone="accent" size={28}>Active run</Box>
      <Box x={600} y={170} w={180} h={90} tone="ghost" size={28}>Next run</Box>
    </Diagram>
  </Split>
</Story>

// ── 11 kinds of input ──────────────────────────────────────────────────────
const KindCard = ({ x, eyebrow, title, caption, art }: { x: number; eyebrow: string; title: string; caption: string; art: ReactNode }) => {
  const semantic = semanticSurface(eyebrow)
  return <div style={{ position: 'absolute', left: x, top: 10, width: 480, height: 386, padding: 32, background: `linear-gradient(145deg, ${semantic.bg}, var(--mt-panel))`, border: `1px solid color-mix(in srgb, ${semantic.color} 38%, var(--mt-border))`, borderTop: `5px solid ${semantic.color}`, borderRadius: 22, boxShadow: '0 14px 30px var(--mt-shadow)', display: 'flex', flexDirection: 'column', gap: 18 }}>
  <span style={{ fontFamily: mono, fontSize: 22, letterSpacing: '.1em', textTransform: 'uppercase', color: semantic.color }}>{eyebrow}</span>
  <svg aria-hidden="true" width={416} height={112} viewBox="0 0 416 112">{art}</svg>
  <span style={{ fontSize: 34, lineHeight: 1.15, color: 'var(--mt-text)' }}>{title}</span>
  <span style={{ fontSize: 26, lineHeight: 1.3, color: 'var(--mt-muted)' }}>{caption}</span>
</div>
}
const DifferentInput: Page = () => <Story chapter="03 / Input has a lifecycle" title="Not every update is a message">
  <div style={{ position: 'relative', width: 1544, height: 406 }}>
    <KindCard x={0} eyebrow="01 / Message" title="A person gives an instruction" caption="Delivered once, into the run." art={<>
      <Line d="M20,74 L396,74" width={3} />
      <rect x={54} y={16} width={150} height={40} rx={20} style={{ fill: 'var(--mt-pill)', stroke: 'var(--mt-accent)', strokeWidth: 2 }} />
      <path d="M120,56 L120,68" style={{ stroke: 'var(--mt-accent)', strokeWidth: 2.5, fill: 'none' }} />
      <circle cx={120} cy={74} r={9} style={{ fill: 'var(--mt-accent)' }} />
      <text x={286} y={44} textAnchor="middle" style={{ fill: 'var(--mt-muted)', fontSize: 20, fontFamily: mono, letterSpacing: '.08em' }}>ONE TURN</text>
    </>} />
    <KindCard x={532} eyebrow="02 / State" title="A fact that changes over time" caption="Kept in a named lane." art={<>
      <rect x={20} y={30} width={376} height={52} rx={14} style={{ fill: 'var(--mt-panel)', stroke: 'var(--mt-border)' }} />
      <rect x={32} y={40} width={120} height={32} rx={8} style={{ fill: 'var(--mt-pill)', stroke: 'var(--mt-accent)', strokeWidth: 2 }} />
      <rect x={162} y={40} width={76} height={32} rx={8} style={{ fill: 'var(--mt-subtle)', stroke: 'var(--mt-border)' }} />
      <rect x={248} y={40} width={76} height={32} rx={8} style={{ fill: 'var(--mt-subtle)', stroke: 'var(--mt-border)' }} />
      <text x={92} y={62} textAnchor="middle" style={{ fill: 'var(--mt-accent)', fontSize: 18, fontFamily: mono }}>SNAPSHOT</text>
      <text x={200} y={62} textAnchor="middle" style={{ fill: 'var(--mt-muted)', fontSize: 18, fontFamily: mono }}>Δ</text>
      <text x={286} y={62} textAnchor="middle" style={{ fill: 'var(--mt-muted)', fontSize: 18, fontFamily: mono }}>Δ</text>
      <text x={208} y={107} textAnchor="middle" style={{ fill: 'var(--mt-muted)', fontSize: 17, fontFamily: mono, letterSpacing: '.035em' }}>SAME LANE, UPDATED</text>
    </>} />
    <KindCard x={1064} eyebrow="03 / Event" title="Something happens once" caption="Needs an inbox, not a lane." art={<>
      <path d="M118,50 L118,82 L298,82 L298,50" style={{ fill: 'var(--mt-subtle)', stroke: 'var(--mt-accent)', strokeWidth: 2 }} />
      <circle cx={160} cy={16} r={8} style={{ fill: 'var(--mt-accent)' }} />
      <circle cx={208} cy={10} r={8} style={{ fill: 'var(--mt-accent)' }} />
      <circle cx={256} cy={18} r={8} style={{ fill: 'var(--mt-accent)' }} />
      <path d="M160,26 L160,46 M208,20 L208,46 M256,28 L256,46" style={{ stroke: 'var(--mt-accent)', strokeWidth: 2, fill: 'none', strokeDasharray: '5 5' }} />
      <text x={208} y={107} textAnchor="middle" style={{ fill: 'var(--mt-muted)', fontSize: 17, fontFamily: mono, letterSpacing: '.035em' }}>DISCRETE, PENDING</text>
    </>} />
  </div>
</Story>

// ── 12 reactive / system context ───────────────────────────────────────────
const SystemContext: Page = () => <Story chapter="03 / Input has a lifecycle" title="Context can arrive without a new user turn">
  <Split>
    <Code>{'agent.sendSignal(\n  { type: "reactive",\n    contents: "..." },\n  { resourceId, threadId },\n)'}</Code>
    <Diagram id="p12" width={800} height={400} wires={<>
      <Wire id="p12" d="M200,300 L226,300" />
      <Wire id="p12" d="M520,250 C520,224 514,206 512,184" />
      <Tag x={400} y={56}>run in progress</Tag>
      <Tag x={138} y={222} size={20}>step 1</Tag>
      <Tag x={398} y={222} size={20}>step 2</Tag>
      <Tag x={658} y={222} size={20}>step 3</Tag>
      <Tag x={650} y={252} tone="accent">reactive signal</Tag>
      <Tag x={770} y={380} anchor="end" size={22} label={false}>system context, not a user turn</Tag>
    </>}>
      <Box x={30} y={86} w={740} h={98} tone="accent" radius={26} pad={0} />
      <Tick x={120} y={115} />
      <Tick x={380} y={115} tone="accent" />
      <Tick x={640} y={115} />
      <Box x={230} y={250} w={380} h={100} label="Processor" size={28}>processInputStep</Box>
      <Chip x={20} y={265} w={180} h={70} size={24}>messageList</Chip>
    </Diagram>
  </Split>
</Story>

// ── 13 state lane ──────────────────────────────────────────────────────────
const State: Page = () => <Story chapter="03 / Input has a lifecycle" title="State is a lane, not a pile of messages">
  <Diagram id="p13" wires={<>
    <Wire id="p13" d="M390,158 L426,158" />
    <Wire id="p13" d="M710,158 L746,158" />
    <Wire id="p13" d="M1030,158 L1066,158" tone="muted" dashed />
    <Tag x={20} y={42} anchor="start" tone="accent">named lane · browser</Tag>
    <Tag x={20} y={384} anchor="start" size={28} label={false}>The producer computes the change; Mastra tracks the lane.</Tag>
  </>}>
    <div style={{ position: 'absolute', left: 20, top: 70, width: 1504, height: 176, background: 'var(--mt-subtle)', border: '1px solid var(--mt-border)', borderRadius: 22 }} />
    <Box x={50} y={100} w={340} h={116} tone="accent" label="Snapshot" size={30}>The full picture</Box>
    <Box x={430} y={100} w={280} h={116} label="Delta" size={30}>+ tab changed</Box>
    <Box x={750} y={100} w={280} h={116} label="Delta" size={30}>+ form filled</Box>
    <Box x={1070} y={100} w={300} h={116} tone="ghost" label="Unchanged" size={30}>skip</Box>
    <Box x={20} y={262} w={1504} h={88} label="Why" size={29} pad={16} gap={4}>Append-only, so the system prompt stays stable and the cache survives.</Box>
  </Diagram>
</Story>

// ── 14 snapshot refresh ────────────────────────────────────────────────────
const StateRefresh: Page = () => <Story chapter="03 / Input has a lifecycle" title="When context moves on, restore the snapshot">
  <Diagram id="p14" wires={<>
    <Wire id="p14" d="M125,232 C125,300 250,344 376,344" />
    <Wire id="p14" d="M900,344 C1040,344 1076,300 1096,268" />
    <Tag x={1000} y={76} tone="accent">context window</Tag>
    <Tag x={125} y={264} size={20}>snapshot fell out</Tag>
    <Tag x={1120} y={292} anchor="start" tone="accent">fresh snapshot</Tag>
  </>}>
    <div style={{ position: 'absolute', left: 600, top: 118, width: 800, height: 152, border: '2px dashed var(--mt-accent)', borderRadius: 22 }} />
    <Tick x={40} y={160} w={170} h={70} tone="ghost" />
    <Tick x={234} y={160} w={170} h={70} />
    <Tick x={428} y={160} w={170} h={70} />
    <Tick x={622} y={160} w={170} h={70} />
    <Tick x={816} y={160} w={170} h={70} />
    <Tick x={1010} y={160} w={170} h={70} />
    <Tick x={1204} y={160} w={170} h={70} />
    <Box x={380} y={290} w={520} h={110} tone="accent" label="computeStateSignal" size={28}>hasSnapshot = false → rebuild</Box>
  </Diagram>
</Story>

// ── 15 notifications ───────────────────────────────────────────────────────
const Notifications: Page = () => <Story chapter="03 / Input has a lifecycle" title="An event needs an inbox, not a state lane">
  <Diagram id="p15" wires={<>
    <Wire id="p15" d="M350,64 C410,64 420,150 466,156" />
    <Wire id="p15" d="M350,152 C410,152 420,182 466,186" />
    <Wire id="p15" d="M350,240 C410,240 420,232 466,232" />
    <Wire id="p15" d="M350,328 C410,328 420,272 466,266" />
    <Wire id="p15" d="M850,210 L936,210" />
    <Wire id="p15" d="M1240,210 L1316,210" />
    <Tag x={772} y={382} size={22}>{"sendSignal({ type: 'notification' }) skips the record"}</Tag>
  </>}>
    <Chip x={20} y={30} w={330}>Review changed</Chip>
    <Chip x={20} y={118} w={330}>Review changed</Chip>
    <Chip x={20} y={206} w={330}>CI failed</Chip>
    <Chip x={20} y={294} w={330}>CI failed</Chip>
    <Box x={470} y={110} w={380} h={200} label="Delivery policy" size={32}>dedupeKey · coalesceKey</Box>
    <Box x={940} y={130} w={300} h={160} tone="accent" label="Durable inbox" size={30}>One pending record</Box>
    <Box x={1320} y={160} w={204} h={100} tone="accent" size={26} pad={14}>Agent attention</Box>
  </Diagram>
</Story>

// ── 16 providers ───────────────────────────────────────────────────────────
const Providers: Page = () => <Story chapter="03 / Input has a lifecycle" title="Let one connector watch for many threads">
  <Diagram id="p16" wires={<>
    <Wire id="p16" d="M340,210 L436,210" />
    <Wire id="p16" d="M820,160 C880,160 890,78 936,78" />
    <Wire id="p16" d="M820,210 L936,210" />
    <Wire id="p16" d="M820,262 C880,262 890,344 936,344" tone="muted" dashed />
    <Wire id="p16" d="M1300,78 L1392,78" />
    <Wire id="p16" d="M1300,210 L1392,210" />
    <Wire id="p16" d="M1300,344 L1392,344" tone="muted" dashed />
    <Tag x={1468} y={84} tone="accent">notify</Tag>
    <Tag x={1468} y={216} tone="accent">notify</Tag>
    <Tag x={1468} y={350}>skip</Tag>
    <Tag x={20} y={384} anchor="start" size={28} label={false}>One connector, many threads — or send the signal yourself.</Tag>
  </>}>
    <Box x={20} y={140} w={320} h={140} label="GitHub" size={26}>One stream of changes</Box>
    <Box x={440} y={110} w={380} h={200} tone="accent" label="Provider" size={30}>Poll or webhook · match subscriptions</Box>
    <Box x={940} y={32} w={360} h={92} tone="accent" size={28} pad={18}>Thread A · subscribed</Box>
    <Box x={940} y={164} w={360} h={92} tone="accent" size={28} pad={18}>Thread B · subscribed</Box>
    <Box x={940} y={298} w={360} h={92} tone="ghost" size={28} pad={18}>Thread C · no match</Box>
  </Diagram>
</Story>

// ── 17 process boundary ────────────────────────────────────────────────────
const ProcessBoundary: Page = () => <Story chapter="04 / Beyond one process" title="What if the agent lives somewhere else?">
  <Diagram id="p17" wires={<>
    <Wire id="p17" d="M440,160 L556,160" />
    <Wire id="p17" d="M980,160 L1096,160" />
    <Line d="M230,250 L230,278" dashed />
    <Line d="M1310,250 L1310,278" dashed />
    <Tag x={772} y={390} size={28} label={false}>PubSub routes; shared storage is the system of record.</Tag>
  </>}>
    <Box x={20} y={70} w={420} h={180} label="Process B · receiver" size={34}>Signal arrives here<span style={{ display: 'block', fontSize: 28, color: 'var(--mt-muted)', marginTop: 10 }}>no active run</span></Box>
    <Box x={560} y={90} w={420} h={140} tone="accent" label="Shared PubSub" size={32}>Routes to the owner</Box>
    <Box x={1100} y={70} w={424} h={180} tone="accent" label="Process A · owner" size={34}>The thread runs here<span style={{ display: 'block', fontSize: 28, color: 'var(--mt-soft)', marginTop: 10 }}>lease holder</span></Box>
    <Box x={200} y={270} w={1140} h={84} label="Shared storage" size={28} pad={14} gap={4}>Design for duplicates and crashes</Box>
  </Diagram>
</Story>

// ── 18 ownership ───────────────────────────────────────────────────────────
const Ownership: Page = () => <Story chapter="04 / Beyond one process" title="One thread. One active owner.">
  <Diagram id="p18" wires={<>
    <Wire id="p18" d="M270,162 L270,246" />
    <Wire id="p18" d="M770,162 L770,246" tone="muted" dashed />
    <Wire id="p18" d="M1270,162 L1270,246" tone="muted" dashed />
    <Tag x={292} y={212} anchor="start" tone="accent">lease · runs it</Tag>
    <Tag x={792} y={212} anchor="start">can still deliver</Tag>
    <Tag x={1292} y={212} anchor="start">recover</Tag>
    <Tag x={772} y={384} size={28} label={false}>If the owner fails, another process claims the lease.</Tag>
  </>}>
    <Box x={40} y={40} w={460} h={122} tone="accent" label="Process A" size={30}>Holds the lease</Box>
    <Box x={540} y={40} w={460} h={122} tone="ghost" label="Process B" size={30}>Standby</Box>
    <Box x={1040} y={40} w={460} h={122} tone="ghost" label="Process C" size={30}>Standby</Box>
    <Box x={40} y={250} w={1460} h={100} tone="accent" radius={50} size={34}>One thread · one active owner</Box>
  </Diagram>
</Story>

// ── 19 close ───────────────────────────────────────────────────────────────
const Close: Page = () => <MastraPage><Frame><div style={{ display: 'flex', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 56 }}>
  <h2 style={{ margin: 0, maxWidth: 1400, fontSize: 94, lineHeight: 1.12, fontWeight: 520 }}>Long-running agents need a way in between requests.</h2>
  <Diagram id="p19" height={220} wires={<>
    <Wire id="p19" d="M162,86 L162,146" />
    <Wire id="p19" d="M467,86 L467,146" />
    <Wire id="p19" d="M772,86 L772,146" />
    <Wire id="p19" d="M1077,86 L1077,146" />
    <Wire id="p19" d="M1382,86 L1382,146" />
    <Line d="M60,150 L1420,150" tone="accent" width={3} />
    <Wire id="p19" d="M1420,150 L1490,150" />
    <Tag x={772} y={202} tone="accent" size={26}>one primitive · signals</Tag>
  </>}>
    <Chip x={20} y={0} w={284} h={84}>Watch it</Chip>
    <Chip x={325} y={0} w={284} h={84}>Talk to it</Chip>
    <Chip x={630} y={0} w={284} h={84}>Steer it</Chip>
    <Chip x={935} y={0} w={284} h={84}>Update its state</Chip>
    <Chip x={1240} y={0} w={284} h={84}>Wake it</Chip>
  </Diagram>
</div></Frame></MastraPage>

export const meta: SlideMeta = {
  title: 'Signals for Long-Running Agents',
  theme: 'mastra',
  createdAt: '2026-10-21T18:13:58.363Z',
}
export const notes = [
  'Introduce Signals for Long-Running Agents (LRA). Abhi and Tyler are presenting. The story moves from agents as functions, to long-running agents with reachable threads, to Signals as the way new input arrives. Based on the Signals guides in PR #28022.',
  'Introduce Abhi Aiyer and Tyler Barnes before starting the story.',
  'We used to treat agents like functions: call one with a prompt, get an answer, finish the turn. That was a useful interface for turn-based chat. Let it feel reasonable before explaining what changed.',
  'Now agents can work across turns, tools, people, and outside events. Their threads are like live inboxes: new input can reach the same thread during a run or while idle. Live describes reachability, not a continuously running model or a durable notification inbox.',
  'Define Signals as typed input into an existing agent thread after the initial stream call. Delivery depends on agent state: sendSignal defaults to deliver during an active run and wake when idle; callers can override both paths.',
  'Introduce the persistent visual anchor: outside event → thread → next agent step. User messages are also signals; the primitive is broader than a chat bubble or an output stream.',
  'Subscribe to the thread before sending new input, because a signal may cause a run. The Agent and client SDK both expose thread subscriptions. Code is an abbreviated teaching snippet; supply the actual threadId and handle the returned stream in a demo.',
  'Thread streams carry output and lifecycle chunks, including approvals and failures. With initial history, the observer can read stored messages first and then live events. Group chunks by run where needed; do not confuse unsubscribing with aborting a run.',
  'sendMessage is the user-input path into an existing thread. A second terminal or browser can speak while others keep observing. This is an abbreviated teaching snippet, not a complete runnable example.',
  'queueMessage never joins the active run: it queues a new run after the active one completes, or wakes the thread immediately when idle. Contrast with sendMessage, which can deliver into the active run. Factory kickoffs use accepted with requireDelivery, then verify that queued input actually landed: a delivery acknowledgement is not proof that the run succeeded.',
  'Pause to classify input by lifecycle rather than by source application. User messages, system context, named state, and discrete events should not all be represented as chat messages.',
  'sendSignal is for system-originated context, including transient input. For user-authored instructions, prefer sendMessage. Review the ifActive and ifIdle delivery controls in the guide during the exercise.',
  'State signals retain a named lane. Producer owns snapshot/delta semantics and cache keys; Mastra tracks signals and avoids unchanged duplicates, but does not merge state on the application’s behalf. Built-in examples include browser state, goals, tasks, and working memory.',
  'computeStateSignal runs before the model request is finalized. When contextWindow.hasSnapshot is false, re-establish a snapshot instead of sending a delta that would be meaningless without its base. State signals are persisted so tracking can be rebuilt.',
  'Notifications are discrete events. sendNotificationSignal creates a durable inbox record and applies a delivery policy; sendSignal({ type: "notification" }) does not create an inbox record. A delivered record means the signal was accepted for delivery, not that an agent handled it or completed its run. dedupeKey avoids repeated identical records; coalesceKey merges related pending records. Factory GitHub webhooks use the delivery ID as a dedupe key and the PR as a coalescing key; the GitHub Signals connector polls subscriptions and batches changed activity.',
  'Signal providers are an optional connector abstraction for outside systems. They register resource subscriptions, watch through polling or webhooks, and send relevant notifications to matching threads. For a single direct event, manually sending a signal may be simpler.',
  'A process that receives a signal is not necessarily the owner of the agent run. Shared PubSub routes to the current owner. PubSub alone is not a durable system of record; use shared storage and design for duplicates and crashes.',
  'Thread leases enforce a single active owner. On failure, another process can claim ownership; use shared storage and matching configuration across processes. In serverless environments in-memory queues are fragile. See Running across processes for topology and shutdown considerations.',
  'Return to the thesis and the same path. Watch the thread, steer it, keep state current, react to events, and route input across processes. One primitive lets a long-running agent stay reachable.',
]
export default [Cover, Hosts, AgentsChanged, InterfaceDidNot, NewPrimitive, Loop, Observe, ThreadStream, Send, Queue, DifferentInput, SystemContext, State, StateRefresh, Notifications, Providers, ProcessBoundary, Ownership, Close] satisfies Page[]
