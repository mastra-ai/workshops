import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import { Step, Steps, useIsActivePage, type DesignSystem, type Page, type SlideMeta } from '@open-slide/core'
import greed from '@assets/fonts/GreedVF.woff2'
import mastraWordmark from '@assets/Mastra wordmark white.png'
import shane from './assets/shane-thomas.jpg'
import alex from './assets/alex-booker.jpg'

export const design: DesignSystem = {
  palette: { bg: '#07090b', text: '#f3f5f7', accent: '#7AFF78' },
  fonts: {
    display: '"Greed", "Inter", sans-serif',
    body: '"Greed", "Inter", sans-serif',
  },
  typeScale: { hero: 166, body: 36 },
  radius: 22,
}

const c = {
  bg: 'var(--osd-bg)', text: 'var(--osd-text)', green: 'var(--osd-accent)',
  panel: '#10151a', line: '#33404a', muted: '#a9b4be', blue: '#91bdff',
  warm: '#ffd28b', greenPanel: '#142619', purple: '#d4adf0',
}
const mono = '"SFMono-Regular", Menlo, Consolas, monospace'
const heading: CSSProperties = { fontFamily: 'var(--osd-font-display)', fontSize: 92, lineHeight: 1.08, fontWeight: 520, letterSpacing: '-0.025em', margin: 0 }
const row: CSSProperties = { display: 'flex', alignItems: 'stretch', gap: 32 }
const panel: CSSProperties = { border: `1px solid ${c.line}`, borderRadius: 22, background: c.panel, padding: 36 }
const themeCss = `
  @font-face { font-family: Greed; src: url(${greed}) format('woff2'); font-weight: 100 900; font-display: swap; }
  .chatgpt-plugin-workshop, .chatgpt-plugin-workshop * { box-sizing: border-box; }
  .chatgpt-plugin-workshop .plugin-enter { animation: plugin-reveal 250ms ease-out both; }
  .chatgpt-plugin-workshop button { font-family: inherit; cursor: pointer; }
  .chatgpt-plugin-workshop button:focus-visible { outline: 3px solid ${c.blue}; outline-offset: 5px; }
  .chatgpt-plugin-workshop button:hover { border-color: ${c.green} !important; }
  .chatgpt-plugin-workshop button[aria-pressed='true'] { border-color: ${c.green}; }
  @keyframes plugin-reveal {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .chatgpt-plugin-workshop .plugin-enter { animation: none; }
  }
  @media print {
    .chatgpt-plugin-workshop .plugin-enter { animation: none; }
  }
`

if (typeof document !== 'undefined') {
  const id = 'chatgpt-plugin-workshop-styles'
  const style = document.getElementById(id) ?? document.createElement('style')
  style.id = id
  if (style.textContent !== themeCss) style.textContent = themeCss
  if (!style.isConnected) document.head.appendChild(style)
}

const Canvas = ({ children, green = false }: { children: ReactNode; green?: boolean }) => (
  <div className="chatgpt-plugin-workshop" style={{ width: '100%', height: '100%', position: 'relative', background: green ? c.green : c.bg, color: green ? c.bg : c.text, colorScheme: 'dark', fontFamily: 'var(--osd-font-body)' }}>
    <main className="plugin-enter" style={{ position: 'absolute', inset: '96px 112px' }}>{children}</main>
  </div>
)

const Label = ({ children, color = c.green }: { children: ReactNode; color?: string }) => <div style={{ fontFamily: mono, fontSize: 24, lineHeight: 1.3, letterSpacing: '0.08em', color, marginBottom: 24 }}>{children}</div>
const Content = ({ label, title, children }: { label: string; title: ReactNode; children: ReactNode }) => <Canvas>
  <Label>{label}</Label><h2 style={heading}>{title}</h2>
  <div style={{ marginTop: 48 }}>{children}</div>
</Canvas>
const Card = ({ label, title, children, color = c.green }: { label?: string; title: string; children?: ReactNode; color?: string }) => <section style={{ ...panel, flex: 1, minWidth: 0 }}>
  {label && <Label color={color}>{label}</Label>}
  <h3 style={{ margin: 0, fontSize: 42, lineHeight: 1.15, fontWeight: 520, color }}>{title}</h3>
  {children && <div style={{ fontSize: 32, lineHeight: 1.45, marginTop: 24 }}>{children}</div>}
</section>
const Node = ({ title, detail, color = c.green }: { title: string; detail: string; color?: string }) => <div style={{ ...panel, flex: 1, minWidth: 0, borderColor: color, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 210 }}>
  <div style={{ fontSize: 42, lineHeight: 1.15, color }}>{title}</div>
  <div style={{ fontSize: 30, color: c.muted, lineHeight: 1.4, marginTop: 24 }}>{detail}</div>
</div>
const Arrow = ({ both = false }: { both?: boolean }) => <div aria-hidden="true" style={{ alignSelf: 'center', flex: '0 0 62px', textAlign: 'center', fontSize: 62, color: c.muted }}>{both ? '⇄' : '→'}</div>
const Pill = ({ children, color = c.green }: { children: ReactNode; color?: string }) => <span style={{ display: 'inline-block', border: `1px solid ${c.line}`, borderRadius: 999, padding: '10px 18px', color, fontSize: 26, lineHeight: 1.25 }}>{children}</span>
const DemoButton = ({ children, style, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const active = useIsActivePage()
  // Thumbnail containers are buttons, so their demo controls must be static.
  if (!active) return <div style={{ fontFamily: 'inherit', textAlign: 'center', ...style }}>{children}</div>
  return <button type="button" {...props} style={style}>{children}</button>
}
const Button = ({ children, active = false, onClick, label }: { children: ReactNode; active?: boolean; onClick: () => void; label?: string }) => <DemoButton aria-label={label} aria-pressed={active} onClick={onClick} style={{ border: `1px solid ${active ? c.green : c.line}`, background: active ? c.greenPanel : c.panel, color: active ? c.green : c.text, borderRadius: 12, padding: '12px 20px', fontSize: 28, lineHeight: 1.2 }}>{children}</DemoButton>
const CodeLine = ({ children, highlight = false }: { children: ReactNode; highlight?: boolean }) => <div style={{ minHeight: 42 }}><span style={highlight ? { background: 'rgba(255,222,70,.12)', borderRadius: 4 } : undefined}>{children}</span></div>
const K = ({ children }: { children: ReactNode }) => <span style={{ color: c.purple }}>{children}</span>
const S = ({ children }: { children: ReactNode }) => <span style={{ color: '#99deac' }}>{children}</span>
const CodePanel = ({ children }: { children: ReactNode }) => <div style={{ ...panel, background: '#111913', fontFamily: mono, fontSize: 30, lineHeight: '42px', whiteSpace: 'pre', letterSpacing: '-0.025em' }}>{children}</div>

const HostCard = ({ name, role, image }: { name: string; role: string; image: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
    <img src={image} alt={name} style={{ width: 84, height: 84, borderRadius: 18, objectFit: 'cover', objectPosition: 'center 20%' }} />
    <div>
      <div style={{ fontSize: 32 }}>{name}</div>
      <div style={{ fontSize: 22, color: c.muted, marginTop: 6 }}>{role}</div>
    </div>
  </div>
)

const Cover: Page = () => (
  <Canvas>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <img src={mastraWordmark} alt="Mastra" style={{ width: 250, height: 64, objectFit: 'contain' }} />
      <div style={{ border: `2px solid ${c.line}`, borderRadius: 999, padding: '12px 22px', fontSize: 24, letterSpacing: '0.12em' }}>WORKSHOP</div>
    </div>
    <div style={{ marginTop: 110 }}>
      <h1 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 'var(--osd-size-hero)', lineHeight: 1.08, fontWeight: 520, letterSpacing: '-0.025em', margin: 0 }}>
        Build a<br />
        <span style={{ color: 'var(--osd-accent)' }}>ChatGPT Plugin</span>
      </h1>
      <p style={{ fontSize: 59, lineHeight: 1.2, margin: '32px 0 0' }}>with Mastra</p>
    </div>
    <div style={{ position: 'absolute', bottom: 28, display: 'flex', gap: 110 }}>
      <HostCard name="Shane Thomas" role="Co-founder & CPO, Mastra" image={shane} />
      <HostCard name="Alex Booker" role="Developer Experience, Mastra" image={alex} />
    </div>
  </Canvas>
)

const ChecklistItem = ({ children, done, onClick }: { children: ReactNode; done: boolean; onClick: () => void }) => <DemoButton role="checkbox" aria-checked={done} onClick={onClick} style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 22, padding: '24px 0', border: 0, borderBottom: `1px solid ${c.line}`, background: 'transparent', color: done ? c.muted : c.text, fontSize: 34, textAlign: 'left' }}>
  <span aria-hidden="true" style={{ width: 34, height: 34, flexShrink: 0, border: `2px solid ${done ? c.green : c.muted}`, borderRadius: 7, background: done ? c.green : 'transparent', color: c.bg, fontSize: 27, lineHeight: '30px', textAlign: 'center' }}>{done ? '✓' : ''}</span>
  <span style={{ textDecoration: done ? 'line-through' : 'none' }}>{children}</span>
</DemoButton>
const TodoList = () => {
  const [done, setDone] = useState({ groceries: false, haircut: false, plants: true })
  const remaining = Object.values(done).filter(value => !value).length
  return <div style={{ ...panel, padding: 30 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginBottom: 14 }}><span style={{ fontSize: 36 }}>Today’s to-do list</span><Pill>{remaining} left</Pill></div>
    <ChecklistItem done={done.groceries} onClick={() => setDone(value => ({ ...value, groceries: !value.groceries }))}>Buy groceries</ChecklistItem>
    <ChecklistItem done={done.haircut} onClick={() => setDone(value => ({ ...value, haircut: !value.haircut }))}>Book a haircut</ChecklistItem>
    <ChecklistItem done={done.plants} onClick={() => setDone(value => ({ ...value, plants: !value.plants }))}>Water the plants</ChecklistItem>
  </div>
}

const Opportunity: Page = () => <Content label="01 / THE OPPORTUNITY" title={<>Some answers need <span style={{ color: c.green }}>an interface.</span></>}>
  <div style={{ fontSize: 42, marginBottom: 42 }}>“What’s on my to-do list today?”</div>
  <div style={{ ...row, gap: 48 }}>
    <div style={{ ...panel, flex: 1 }}>
      <Label color={c.muted}>READ THE ANSWER</Label>
      <p style={{ fontSize: 38, lineHeight: 1.5, margin: 0 }}>You need to buy groceries and book a haircut. You’ve already watered the plants.</p>
    </div>
    <div style={{ flex: 1 }}><Label>USE THE ANSWER</Label><TodoList /></div>
  </div>
</Content>

const MiniChart = ({ scenario = false }: { scenario?: boolean }) => <svg width="100%" height="170" viewBox="0 0 420 170" role="img" aria-label={scenario ? 'Illustrative scenario comparison' : 'Illustrative service activity chart'}>
  <path d="M12 142H408 M12 92H408 M12 42H408" stroke={c.line} strokeWidth="1" />
  <path d={scenario ? 'M12 138L88 126L164 104L244 76L326 44L408 18' : 'M12 112L72 104L132 114L192 40L252 82L312 72L372 86L408 68'} fill="none" stroke={scenario ? c.blue : c.green} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  {scenario && <path d="M12 138L88 130L164 120L244 108L326 93L408 76" fill="none" stroke={c.muted} strokeWidth="3" strokeDasharray="8 9" />}
</svg>
const Ideas: Page = () => <Content label="01 / POSSIBILITIES" title="What would you put in the conversation?">
  <div style={row}>
    <Card label="OPERATIONS" title="Find the problem."><MiniChart /><p style={{ margin: '18px 0 0' }}>Scan service health.<br />Inspect a failed deploy.</p></Card>
    <Card label="PLANNING" title="Try the alternative." color={c.blue}><MiniChart scenario /><p style={{ margin: '18px 0 0' }}>Adjust assumptions.<br />Compare scenarios.</p></Card>
    <Card label="DOCUMENTS" title="Review together." color={c.warm}>
      <svg width="100%" height="170" viewBox="0 0 420 170" role="img" aria-label="Illustrative document with a selected passage"><rect x="65" y="4" width="290" height="160" rx="10" fill="#1b2229" stroke={c.line} /><path d="M95 37H292 M95 67H325 M95 97H314 M95 127H260" stroke={c.muted} strokeWidth="9" /><rect x="84" y="81" width="244" height="31" rx="4" fill="rgba(255,210,139,.25)" /></svg>
      <p style={{ margin: '18px 0 0' }}>Select a passage.<br />Ask a better question.</p>
    </Card>
  </div>
</Content>

const Server: Page = () => <Content label="02 / THE CAPABILITY LAYER" title={<>MCP server: <span style={{ color: c.green }}>what your product can do.</span></>}>
  <div style={{ ...row, alignItems: 'center', marginTop: 80 }}>
    <Node title="ChatGPT" detail="The host discovers and calls tools." color={c.blue} /><Arrow both />
    <Node title="MCP server" detail="list_tasks → structured results" /><Arrow both />
    <Node title="Your product" detail="Data, business rules, permissions." color={c.muted} />
  </div>
  <p style={{ fontSize: 42, margin: '70px 0 0' }}>A useful tool works <span style={{ color: c.green }}>without a custom UI.</span></p>
</Content>

const App: Page = () => <Content label="02 / THE INTERFACE LAYER" title={<>MCP App: <span style={{ color: c.green }}>give the tool a view.</span></>}>
  <div style={{ ...row, alignItems: 'center' }}>
    <div style={{ ...panel, flex: 1.5, borderColor: c.blue }}>
      <Label color={c.blue}>INSIDE THE HOST</Label><TodoList />
      <div style={{ fontSize: 28, color: c.muted, marginTop: 22 }}>Sandboxed HTML interface + host bridge</div>
    </div>
    <div style={{ width: 210, textAlign: 'center', flexShrink: 0 }}><div style={{ fontSize: 26, color: c.muted }}>MCP transport</div><div style={{ fontSize: 80, color: c.green }}>⇄</div></div>
    <div style={{ flex: 1 }}><Node title="MCP server" detail="Tool + linked UI resource" /><div style={{ fontFamily: mono, fontSize: 28, color: c.green, marginTop: 26 }}>ui://tasks/…</div></div>
  </div>
</Content>

const Plugin: Page = () => <Content label="02 / THE DISTRIBUTION LAYER" title={<>ChatGPT plugin: <span style={{ color: c.green }}>what users install.</span></>}>
  <div style={{ ...panel, padding: 36, borderColor: c.green }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 }}><span style={{ fontSize: 40 }}>Tasks plugin</span><Pill>Installable package</Pill></div>
    <div style={row}>
      <Card label="OPTIONAL" title="Skills">Instructions for repeatable work.</Card>
      <Card label="OPTIONAL" title="MCP connection" color={c.blue}>Tools and data from your server.<div style={{ marginTop: 26 }}><Pill color={c.blue}>UI when it helps</Pill></div></Card>
    </div>
  </div>
</Content>

const Extensions: Page = () => <Content label="02 / THE CHATGPT-SPECIFIC LAYER" title={<>Same plugin. <span style={{ color: c.green }}>More ways in.</span></>}>
  <div style={{ ...row, alignItems: 'center', gap: 50 }}>
    <div style={{ ...panel, flex: 1, padding: '64px 42px', borderColor: c.green }}><Label>YOUR PLUGIN</Label><div style={{ fontSize: 68 }}>Tasks</div><div style={{ fontSize: 34, color: c.muted, marginTop: 25 }}>MCP tools + app UI</div></div>
    <Arrow />
    <div style={{ flex: 1.6, display: 'grid', gap: 22 }}>
      <Node title="Sidebar" detail="A place to return to." />
      <div style={row}><Card title="Beside a chat" color={c.blue} /><Card title="Inside a file" color={c.warm} /></div>
    </div>
  </div>
</Content>

type TaskId = 'groceries' | 'haircut' | 'plants'
const TaskButton = ({ name, detail, attention = false, selected, onClick }: { name: string; detail: string; attention?: boolean; selected: boolean; onClick: () => void }) => <DemoButton onClick={onClick} aria-pressed={selected} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, textAlign: 'left', border: `1px solid ${selected ? c.green : c.line}`, borderRadius: 14, padding: '16px 26px', background: selected ? c.greenPanel : c.bg, color: c.text, marginTop: 16 }}>
  <span style={{ fontSize: 33 }}>{name}</span><span style={{ fontSize: 28, color: attention ? c.warm : c.muted }}>{detail}</span>
</DemoButton>
const Tasks: Page = () => {
  const [attention, setAttention] = useState(false)
  const [fresh, setFresh] = useState(false)
  const [selected, setSelected] = useState<TaskId | null>(null)
  const [action, setAction] = useState('Initial result → render the task list.')
  const select = (id: TaskId) => { setSelected(id); setAction('Selection → explicitly share task context.') }
  return <Content label="03 / TRY IT" title="Which tasks need attention?">
    <div style={{ ...row, gap: 38 }}>
      <div style={{ ...panel, flex: 1.85 }}>
        <div style={{ fontSize: 38, marginBottom: 24 }}>My tasks</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button active={!attention} onClick={() => { setAttention(false); setAction('Filter → local state. No tool call.') }}>All</Button>
          <Button active={attention} onClick={() => { setAttention(true); setAction('Filter → local state. No tool call.') }}>Overdue</Button>
          <Button onClick={() => { setFresh(value => !value); setAction('Refresh → tool call through the host.') }}>Refresh ↻</Button>
        </div>
        {!attention && <TaskButton name="Buy groceries" detail="Today" selected={selected === 'groceries'} onClick={() => select('groceries')} />}
        {(!attention || !fresh) && <TaskButton name="Book a haircut" detail={fresh ? 'Done' : 'Overdue'} attention={!fresh} selected={selected === 'haircut'} onClick={() => select('haircut')} />}
        {!attention && <TaskButton name="Water the plants" detail="Done" selected={selected === 'plants'} onClick={() => select('plants')} />}
        {attention && fresh && <div style={{ padding: '38px 8px', fontSize: 32, color: c.green }}>Nothing overdue.</div>}
      </div>
      <aside style={{ flex: 1, padding: '16px 0' }} aria-live="polite">
        <Label>UNDER THE HOOD</Label><p style={{ margin: 0, fontSize: 36, lineHeight: 1.4 }}>{action}</p>
        <div style={{ marginTop: 46 }}><Label color={c.blue}>SHARED CONTEXT</Label><div style={{ fontFamily: mono, fontSize: 29, lineHeight: 1.5, color: c.blue }}>{selected ? <>task_id:<br />"{selected}"</> : 'No selection yet.'}</div></div>
      </aside>
    </div>
  </Content>
}

const Packet = ({ n, from, to, children }: { n: string; from: string; to: string; children: ReactNode }) => <div style={{ display: 'grid', gridTemplateColumns: '56px 300px 55px 310px 1fr', gap: 20, alignItems: 'center', padding: '22px 26px', borderBottom: `1px solid ${c.line}`, minHeight: 102 }}>
  <span style={{ fontFamily: mono, color: c.green, fontSize: 26 }}>{n}</span><span style={{ fontSize: 32 }}>{from}</span><span aria-hidden="true" style={{ color: c.muted, fontSize: 36 }}>→</span><span style={{ fontSize: 32 }}>{to}</span><span style={{ fontSize: 28, color: c.muted }}>{children}</span>
</div>
const RequestFlow: Page = () => <Content label="03 / FOLLOW ONE REQUEST" title="From a question to an interface.">
  <div style={{ ...panel, padding: '10px 20px' }}>
    <Steps>
      <Packet n="01" from="You" to="ChatGPT">“Which tasks need attention?”</Packet>
      <Step><Packet n="02" from="ChatGPT" to="MCP server">Call list_tasks; return allowed data.</Packet></Step>
      <Step><Packet n="03" from="ChatGPT" to="MCP server">Read the linked HTML resource.</Packet></Step>
      <Step><Packet n="04" from="ChatGPT" to="Sandboxed UI">Initialize the bridge; deliver results.</Packet></Step>
      <Step><Packet n="05" from="You" to="App interface">Inspect, filter, select.</Packet></Step>
    </Steps>
  </div>
</Content>

const UIHome: Page = () => <Content label="03 / WHERE THE UI LIVES" title={<>Ships with you. <span style={{ color: c.green }}>Runs with them.</span></>}>
  <div style={{ ...row, alignItems: 'center', marginTop: 65 }}>
    <Node title="Your repository" detail="React + components" color={c.muted} /><Arrow />
    <Node title="Your deployment" detail="HTML, JS, CSS via an MCP resource" /><Arrow />
    <Node title="The host" detail="Renders the UI inside a sandbox" color={c.blue} />
  </div>
  <div style={{ ...panel, marginTop: 50, display: 'flex', justifyContent: 'space-between', fontSize: 34 }}><span>Tool handlers run on <span style={{ color: c.green }}>your server.</span></span><span>Click handlers run in <span style={{ color: c.blue }}>the UI.</span></span></div>
</Content>

const Clicks: Page = () => <Content label="03 / THREE DIFFERENT PATHS" title="Not every click needs the model.">
  <div style={row}>
    <Card label="FILTER" title="Local state"><div style={{ fontSize: 56, color: c.green, margin: '36px 0' }}>UI ↺</div>Instantly narrow the data already on screen.</Card>
    <Card label="REFRESH" title="Tool call" color={c.blue}><div style={{ fontSize: 38, color: c.blue, margin: '48px 0' }}>UI ⇄ host ⇄ server</div>Ask the backend for an authorized update.</Card>
    <Card label="SELECT" title="Shared context" color={c.warm}><div style={{ fontSize: 42, color: c.warm, margin: '45px 0' }}>UI → host / model</div>Tell the assistant which item matters.</Card>
  </div>
</Content>

const Authorization: Page = () => <Content label="03 / THE TRUST BOUNDARY" title={<>Signed in <span style={{ color: c.warm }}>≠</span> allowed.</>}>
  <div style={{ ...row, alignItems: 'center' }}>
    <div style={{ width: 330, flexShrink: 0 }}><Label color={c.blue}>HOST</Label><div style={{ fontSize: 40, lineHeight: 1.3 }}>Tool request<br />+ access token</div></div><Arrow />
    <div style={{ ...panel, flex: 1, border: `2px dashed ${c.green}`, padding: 40 }}>
      <Label>YOUR BACKEND</Label>
      <div style={row}><Card title="Verify identity">Is this token valid?</Card><Card title="Check access" color={c.blue}>May this user read this task?</Card></div>
      <div style={{ marginTop: 34, fontSize: 34 }}>Only then → return the permitted data.</div>
    </div>
  </div>
</Content>

const Portable: Page = () => <Content label="04 / THE STANDARD AND THE HOST" title={<>One core. <span style={{ color: c.green }}>Different entrances.</span></>}>
  <div style={{ ...panel, borderColor: c.green, textAlign: 'center', padding: 34 }}><div style={{ fontSize: 48 }}>MCP tools + MCP App UI</div></div>
  <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: 48, color: c.muted, margin: '18px 0' }} aria-hidden="true"><span>↓</span><span>↓</span><span>↓</span></div>
  <div style={row}>
    <Card title="ChatGPT"><span style={{ color: c.muted }}>Core UI</span><div style={{ marginTop: 18 }}><Pill>+ plugin extensions</Pill></div></Card>
    <Card title="Claude" color={c.blue}>Compatible host capabilities.</Card>
    <Card title="Other hosts" color={c.muted}>Detect support. Test the client.</Card>
  </div>
</Content>

const Sidebar: Page = () => {
  const [open, setOpen] = useState(false)
  return <Content label="04 / SIDEBAR APPS" title={<>Your app, <span style={{ color: c.green }}>one click away.</span></>}>
    <div style={{ display: 'flex', gap: 44, alignItems: 'center' }}>
      <div style={{ ...panel, padding: 0, flex: 1.65, display: 'flex', minHeight: 475 }}>
        <aside style={{ width: 248, flexShrink: 0, padding: '32px 20px', borderRight: `1px solid ${c.line}` }}>
          <div style={{ fontSize: 30, marginBottom: 35 }}>ChatGPT</div><div style={{ fontSize: 27, color: c.muted, marginBottom: 25 }}>New chat</div>
          <DemoButton aria-pressed={open} onClick={() => setOpen(true)} style={{ fontSize: 29, color: c.green, border: `1px solid ${open ? c.green : c.line}`, background: c.greenPanel, padding: '16px 18px', borderRadius: 12, width: '100%', textAlign: 'left' }}>↗ Tasks</DemoButton>
        </aside>
        <div style={{ flex: 1, padding: 30, minWidth: 0 }} aria-live="polite">
          {open ? <><div style={{ fontSize: 26, color: c.green, marginBottom: 24 }}>FULLSCREEN APP SURFACE</div><TodoList /></> : <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 }}><div style={{ fontSize: 46 }}>A place to return to.</div><div style={{ color: c.muted, fontSize: 32 }}>Click Tasks in the sidebar.</div></div>}
        </div>
      </div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 48, lineHeight: 1.25 }}>No prompt required.</div><p style={{ fontSize: 34, color: c.muted, lineHeight: 1.45 }}>A global entry point opens your MCP App fullscreen.</p><Pill>entrypoint: global</Pill></div>
    </div>
  </Content>
}

const Surfaces: Page = () => <Content label="04 / OTHER ENTRY POINTS" title="Meet users where they’re working.">
  <div style={row}>
    <Card label="CONVERSATION PANEL" title="Plan beside the chat.">
      <div style={{ display: 'flex', gap: 12, height: 146, margin: '30px 0', padding: 18, border: `1px solid ${c.line}`, borderRadius: 12 }}><div style={{ flex: 1, borderRadius: 8, background: '#25303a', padding: 16, color: c.muted, fontSize: 27 }}>Chat</div><div style={{ flex: 1, borderRadius: 8, background: c.greenPanel, padding: 16, fontSize: 27 }}>Plan</div></div>
      Task plans that stay beside the discussion.
    </Card>
    <Card label="FILE VIEWER / EDITOR" title="Work inside the file." color={c.warm}>
      <div style={{ height: 146, margin: '30px 0', padding: '34px 24px', border: `1px solid ${c.line}`, borderRadius: 12, color: c.warm, fontFamily: mono, fontSize: 30 }}>launch-brief.pdf</div>
      A purpose-built view for supported file types.
    </Card>
    <Card label="COMPOSER MENTION" title="Bring the context." color={c.blue}>
      <div style={{ height: 146, margin: '30px 0', padding: '34px 24px', border: `1px solid ${c.line}`, borderRadius: 12, color: c.blue, fontSize: 32 }}>@Tasks / Groceries</div>
      Find and attach content before sending.
    </Card>
  </div>
</Content>

const SharedContext: Page = () => {
  const [task, setTask] = useState<'Buy groceries' | 'Book a haircut'>('Book a haircut')
  return <Content label="04 / MODEL–APP CONTEXT" title="Let the conversation follow the selection.">
    <div style={{ ...row, alignItems: 'center' }}>
      <div style={{ ...panel, flex: 1 }}><Label>IN THE APP</Label><div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}><Button active={task === 'Buy groceries'} onClick={() => setTask('Buy groceries')}>Buy groceries</Button><Button active={task === 'Book a haircut'} onClick={() => setTask('Book a haircut')}>Book a haircut</Button></div></div>
      <Arrow />
      <div style={{ ...panel, flex: 1 }}><Label color={c.blue}>EXPLICIT CONTEXT</Label><div aria-live="polite" style={{ fontFamily: mono, fontSize: 30, lineHeight: 1.7, color: c.blue }}>selected_task:<br />"{task === 'Buy groceries' ? 'groceries' : 'haircut'}"</div></div>
      <Arrow />
      <div style={{ ...panel, flex: 1.1 }}><Label color={c.warm}>IN THE CONVERSATION</Label><div style={{ fontSize: 38, lineHeight: 1.35 }}>“What should I check next?”</div><div aria-live="polite" style={{ fontSize: 28, color: c.muted, marginTop: 24 }}>Now grounded in {task}.</div></div>
    </div>
    <p style={{ fontSize: 36, margin: '55px 0 0' }}>Share the relevant selection, <span style={{ color: c.green }}>not every pixel.</span></p>
  </Content>
}

const FirstSlice: Page = () => <Canvas green>
  <Label color="#234422">05 / MAKE THE FIRST VERSION SMALL</Label>
  <h2 style={{ ...heading, fontSize: 132, lineHeight: 1.16, marginTop: 55 }}>One outcome.<br />One tool.<br />One screen.</h2>
  <div style={{ marginTop: 48, fontSize: 38 }}>Know which task needs attention.</div>
  <div style={{ fontFamily: mono, fontSize: 32, marginTop: 22 }}>list_tasks → task list</div>
</Canvas>

const Mastra: Page = () => <Content label="05 / WHERE MASTRA FITS" title="Your tool. Your UI. One MCP server.">
  <div style={{ ...row, alignItems: 'center', gap: 52 }}>
    <div style={{ flex: 0.9 }}>
      <div style={{ borderLeft: `3px solid ${c.green}`, paddingLeft: 30, marginBottom: 44 }}><div style={{ fontSize: 38 }}>Mastra tool</div><div style={{ fontSize: 30, color: c.muted, marginTop: 16 }}>Validate input. Enforce access.<br />Return useful data.</div></div>
      <div style={{ borderLeft: `3px solid ${c.blue}`, paddingLeft: 30 }}><div style={{ fontSize: 38 }}>App resource</div><div style={{ fontSize: 30, color: c.muted, marginTop: 16 }}>Serve your built HTML UI.</div></div>
      <p style={{ fontSize: 32, color: c.green, marginTop: 45 }}>No separate Mastra agent required.</p>
    </div>
    <div style={{ flex: 1.45 }}><CodePanel>
      <CodeLine><K>const</K>{' server = '}<K>new</K>{' MCPServer({'}</CodeLine>
      <CodeLine>{'  name: '}<S>'Tasks'</S>{','}</CodeLine>
      <CodeLine>{'  version: '}<S>'1.0.0'</S>{','}</CodeLine>
      <CodeLine highlight>{'  tools: { list_tasks },'}</CodeLine>
      <CodeLine highlight>{'  appResources: {'}</CodeLine>
      <CodeLine>{'    '}<S>'ui://tasks/tasks-v1.html'</S>{': {'}</CodeLine>
      <CodeLine>{'      name: '}<S>'Task list'</S>{','}</CodeLine>
      <CodeLine>{'      html: bundledHtml,'}</CodeLine>
      <CodeLine>{'    },'}</CodeLine>
      <CodeLine>{'  },'}</CodeLine>
      <CodeLine>{'})'}</CodeLine>
    </CodePanel></div>
  </div>
</Content>

const Build: Page = () => <Content label="05 / LIVE BUILD" title="Build it in three passes.">
  <div style={{ ...row, alignItems: 'center', gap: 58 }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 42, marginBottom: 38 }}><span style={{ color: c.green }}>01</span> Expose the tool.</div>
      <div style={{ fontSize: 42, marginBottom: 38 }}><span style={{ color: c.green }}>02</span> Connect the view.</div>
      <div style={{ fontSize: 42 }}><span style={{ color: c.green }}>03</span> Add the sidebar entry.</div>
      <p style={{ fontSize: 32, color: c.muted, marginTop: 50, lineHeight: 1.45 }}>The resource URI must match the registered app resource.</p>
    </div>
    <div style={{ flex: 1.35 }}><Label color={c.blue}>INSIDE createTool({'{ … }'})</Label><CodePanel>
      <CodeLine>{'mcp: {'}</CodeLine>
      <CodeLine>{'  _meta: {'}</CodeLine>
      <CodeLine>{'    ui: { resourceUri: appUri },'}</CodeLine>
      <CodeLine highlight>{'    '}<S>'openai/ui'</S>{': {'}</CodeLine>
      <CodeLine highlight>{'      entrypoints: [{ type: '}<S>'global'</S>{' }],'}</CodeLine>
      <CodeLine>{'    },'}</CodeLine>
      <CodeLine>{'  },'}</CodeLine>
      <CodeLine>{'}'}</CodeLine>
    </CodePanel></div>
  </div>
</Content>

const UnhappyPaths: Page = () => <Content label="05 / DESIGN FOR REAL ACCOUNTS" title="Build the unhappy paths, too.">
  <div style={row}>
    <Card label="EMPTY" title="Nothing here yet."><div style={{ fontSize: 98, fontWeight: 520, margin: '30px 0', color: c.muted }}>0</div>Explain what belongs here.<div style={{ color: c.green, marginTop: 30 }}>Offer a next step.</div></Card>
    <Card label="REQUEST FAILED" title="Couldn’t refresh." color={c.warm}><div style={{ fontSize: 98, fontWeight: 520, margin: '30px 0', color: c.warm }}>↻</div>Keep the last useful result.<div style={{ color: c.warm, marginTop: 30 }}>Label stale data. Allow retry.</div></Card>
    <Card label="AUTH EXPIRED" title="Reconnect to continue." color={c.blue}><div style={{ fontSize: 98, fontWeight: 520, margin: '30px 0', color: c.blue }}>↗</div>Explain why access stopped.<div style={{ color: c.blue, marginTop: 30 }}>Guide account linking.</div></Card>
  </div>
</Content>

const Deploy: Page = () => <Content label="05 / TEST AND CONNECT" title="From local demo to ChatGPT.">
  <div style={{ ...row, alignItems: 'center', marginTop: 60 }}>
    <Node title="Inspect" detail="Check tools, resources, and bad inputs." color={c.muted} /><Arrow />
    <Node title="Deploy" detail="Expose a stable HTTPS MCP endpoint." /><Arrow />
    <Node title="Connect" detail="Link your test account in ChatGPT." color={c.blue} />
  </div>
  <div style={{ ...panel, marginTop: 44, fontSize: 36 }}>Test the full task: <span style={{ color: c.green }}>request → result → UI → next action.</span></div>
</Content>

const Distribution: Page = () => <Content label="06 / DISTRIBUTION OPTIONS" title={<>Pick <span style={{ color: c.green }}>your audience.</span></>}>
  <div style={{ ...row, marginTop: 80 }}>
    <Card label="JUST YOU" title="Personal plugin">
      <p style={{ margin: 0 }}>Install locally for your own use.</p>
      <div style={{ color: c.muted, marginTop: 42 }}>Your personal catalog.</div>
    </Card>
    <Card label="YOUR TEAM" title="Git marketplace" color={c.blue}>
      <p style={{ margin: 0 }}>Share plugins through a Git repo.</p>
      <div style={{ color: c.muted, marginTop: 42 }}>A catalog your team installs.</div>
    </Card>
    <Card label="EVERYONE" title="Public marketplace" color={c.warm}>
      <p style={{ margin: 0 }}>Submit to the public plugin directory.</p>
      <div style={{ color: c.muted, marginTop: 42 }}>OpenAI review, then publish.</div>
    </Card>
  </div>
</Content>

const PrivateSharing: Page = () => <Content label="06 / PERSONAL + TEAM" title="Start local. Share a repo.">
  <div style={row}>
    <Card label="PERSONAL PLUGIN" title="For your own use.">
      <div style={{ lineHeight: 1.8 }}>Create a local plugin folder.<br />Register it in your personal catalog.<br />Install in ChatGPT desktop.</div>
      <div style={{ marginTop: 36, fontFamily: mono, fontSize: 28, color: c.green }}>~/.agents/plugins/marketplace.json</div>
    </Card>
    <Card label="TEAM MARKETPLACE" title="For your team." color={c.blue}>
      <div style={{ lineHeight: 1.8 }}>Put the catalog and plugins in Git.<br />Teammates add the Git source.<br />Install plugins from that catalog.</div>
      <div style={{ marginTop: 36, fontFamily: mono, fontSize: 28, lineHeight: 1.65, color: c.blue }}>codex plugin marketplace add<br />owner/repo</div>
    </Card>
  </div>
</Content>

const Publish: Page = () => <Content label="06 / PUBLIC MARKETPLACE" title={<>Publish to <span style={{ color: c.green }}>the public directory.</span></>}>
  <div style={{ ...row, alignItems: 'center', gap: 48 }}>
    <div style={{ ...panel, flex: 1 }}><Label>YOUR PLUGIN ZIP</Label>
      <div style={{ fontFamily: mono, fontSize: 30, lineHeight: 1.8 }}>plugin.json<br />mcp.json<br />assets/<br /><span style={{ color: c.muted }}>skills/  (optional)</span></div>
    </div>
    <Arrow />
    <div style={{ flex: 1.45 }}>
      <div style={{ fontSize: 44, lineHeight: 1.6 }}><span style={{ color: c.green }}>Upload</span> → checks → review</div>
      <div style={{ fontSize: 64, margin: '26px 0', color: c.green }}>Approved → Publish</div>
      <div style={{ fontSize: 32, lineHeight: 1.5, color: c.muted }}>Listing details. Working auth.<br />Reviewer access. Test cases.</div>
    </div>
  </div>
</Content>

const MaintenanceRow = ({ layer, action }: { layer: string; action: string }) => <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', alignItems: 'center', gap: 44, padding: '25px 0', borderBottom: `1px solid ${c.line}` }}><div style={{ fontSize: 35, color: c.green }}>{layer}</div><div style={{ fontSize: 32 }}>{action}</div></div>
const Maintain: Page = () => <Content label="06 / AFTER LAUNCH" title="Shipping is the start.">
  <div style={{ ...panel, padding: '12px 38px' }}>
    <MaintenanceRow layer="Backend" action="Improve behavior without breaking the tool contract." />
    <MaintenanceRow layer="Tools + metadata" action="Rescan changes and verify discovery." />
    <MaintenanceRow layer="UI bundle" action="Version breaking changes; keep URI links in sync." />
    <MaintenanceRow layer="Package + skills" action="Update your catalog or submit a new public version." />
  </div>
</Content>

const DemoTime: Page = () => <Canvas green>
  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <h2 style={{ ...heading, fontSize: 'var(--osd-size-hero)', textAlign: 'center' }}>Demo Time</h2>
  </div>
</Canvas>

const Closing: Page = () => <Canvas>
  <img src={mastraWordmark} alt="Mastra" style={{ width: 250, height: 64, objectFit: 'contain' }} />
  <h2 style={{ ...heading, fontSize: 148, margin: '88px 0 60px' }}>Thanks for <span style={{ color: c.green }}>joining.</span></h2>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
    <Card label="MASTRA · X" title="@mastra" />
    <Card label="SHANE THOMAS · X" title="@smthomas3" color={c.blue} />
    <Card label="ALEX BOOKER · X" title="@bookercodes" color={c.blue} />
    <Card label="YOUTUBE" title="youtube.com/@mastra-ai" />
    <Card label="CAREERS" title="mastra.ai/careers" />
    <Card label="CONTACT" title="mastra.ai/contact" />
  </div>
</Canvas>

export const notes = [
  `Welcome attendees and introduce Shane Thomas (Co-founder and CPO, Mastra) and Alex Booker (Developer Experience, Mastra). Today: build one useful MCP-backed interface, understand ChatGPT plugins, and explore optional host extensions. This deck contains the presentation, not a deployed plugin or runnable backend. Event: https://luma.com/mastra-no5w. Narrative adapted from the supplied reference-guide/index.html, “Small App, Big Context.” Documentation checked October 8, 2026.`,
  `Ask what is on today's to-do list. Compare a paragraph with a checklist: buy groceries, book a haircut, water the plants. Click a checkbox to show why a UI can be useful without introducing a fictional product. This interaction is local React state, not a saved backend change or a live ChatGPT integration. A real completion action would need a separate authorized write tool; the later list_tasks example stays read-only. Source: https://modelcontextprotocol.io/extensions/apps/overview.`,
  `Pause for possibilities before vocabulary. An operations console could become a recurring sidebar app; a scenario planner could sit beside a conversation; a document reviewer could open supported files. Other ideas: analytics with filters, inspect-before-send messages, task timelines, and interactive product comparisons. These are suggested products, not claims about integrations already shipped. The supplied guide has links to runnable reference examples.`,
  `The host includes an MCP client. Discovery tells it which tools exist and how to call them. The server runs handlers and enforces product rules. The list_tasks example returns only tasks the authenticated caller may read, with useful structured results and a text fallback. Custom UI is optional. Source: https://developers.openai.com/plugins/concepts/mcp-server and https://developers.openai.com/plugins/concepts/plugins.`,
  `An MCP App pairs a tool with a registered UI resource. The host reads the resource and renders the HTML in an isolated UI surface. The interface communicates with the host through the MCP Apps bridge; host-to-server communication is separate MCP transport. Do not draw the embedded UI as having automatic direct access to the backend. Sources: https://modelcontextprotocol.io/extensions/apps/overview and https://developers.openai.com/plugins/build/chatgpt-ui.`,
  `A plugin is the package users discover and install. Skills can be enough; MCP capabilities can be enough; they can be combined. UI is optional. This diagram is not an exhaustive package schema: current plugin architecture also documents runtime-specific hooks. A remote MCP connection points at a separately deployed service; installing the package does not deploy that backend. Source: https://developers.openai.com/plugins/concepts/plugins.`,
  `Contrast the terms explicitly: the plugin is the installable integration; plugin extensions add optional ChatGPT behavior and surfaces. This is not a browser extension or a second server. A sidebar makes Tasks easy to revisit; a conversation panel keeps planning near the chat; a file entrypoint opens a supported document in a custom view. Source: https://developers.openai.com/plugins/build/extensions.`,
  `Interactive local simulation; no network or model calls. Click Overdue: only Book a haircut remains. Select it to show task_id: haircut. Click Refresh: the example task is now done, so the overdue filter is empty. Click All to restore the whole list. Refresh again to reset the example. Use the right-side log to distinguish local filtering, a host-mediated refresh in a real app, and explicit selection sharing. The same everyday tasks recur throughout the deck.`,
  `Use the right arrow to reveal four additional packets. Start with the user’s goal. The host calls the discovered tool, the server validates access and returns the result, the host obtains the UI resource, then initializes the bridge and provides the data. The final interaction is in the UI. This is conceptual ordering: discovery may precede the request and the host can cache or preload a UI resource. Sources: https://modelcontextprotocol.io/extensions/apps/overview and https://developers.openai.com/plugins/build/chatgpt-ui.`,
  `React source lives in your repository. Build browser assets and expose the HTML through the MCP server’s UI resource. It may bundle scripts and styles inline; external origins must satisfy host CSP requirements. UI code executes in the host’s sandbox, while tools execute on your backend. Reusing components is different from embedding an entire website with its cookie assumptions. Source: https://developers.openai.com/plugins/build/chatgpt-ui.`,
  `Use the three actions from the preceding simulation. Filter the already-loaded list locally. Refresh through the host’s tool bridge; permission checks still happen on the server. Share a meaningful selection or view state explicitly with the host/model. A UI interaction need not create a new model turn. Standard MCP Apps mechanisms and ChatGPT-specific context extensions are related but not interchangeable APIs. Sources: https://apps.extensions.modelcontextprotocol.io/api/documents/patterns.html and https://developers.openai.com/plugins/build/chatgpt-ui.`,
  `OAuth establishes the caller’s identity and delegated access, not unlimited product authorization. Verify tokens as appropriate for the issuer, audience, expiry, and scopes, then check organization membership and resource-level permissions. Derive trusted identity from verified credentials, not a model-supplied organization ID. Keep credentials off the UI. A readOnlyHint is descriptive metadata, not enforcement. Sources: https://developers.openai.com/plugins/build/auth and https://developers.openai.com/plugins/guides/security-privacy.`,
  `Build on the shared MCP Apps foundation, then progressively enhance for the host. Do not promise every host supports every feature, auth setup, or display mode. Capability negotiation and client testing matter. This slide deliberately avoids a broad compatibility checklist that could become stale. Sources: https://modelcontextprotocol.io/extensions/apps/overview and https://developers.openai.com/plugins/build/chatgpt-ui.`,
  `Click Tasks in the conceptual sidebar to reveal the dashboard. The real global entrypoint launches the app fullscreen; it is not merely a link to an external website. This illustration runs locally and is not connected to ChatGPT. Useful for recurring dashboards and workspaces. Check availability in the target account/client before presenting a live version. Source: https://developers.openai.com/plugins/build/extensions.`,
  `Map each entrance to a task: conversation panel for a working plan; a file viewer/editor for a document or supported design file; composer mention for selecting product content before sending a prompt. Composer mentions are documented as desktop-only as of October 8, 2026. Web extension rollout differs by plan; check before the event. Additional capabilities to discuss verbally: deep links, plugin settings, display modes, rich forms, and onboarding. Source: https://developers.openai.com/plugins/build/extensions.`,
  `Click between Buy groceries and Book a haircut. The explicit selected_task value changes, grounding the next question. This is an illustration, not an implementation of a host API and not an AI-generated answer. The host does not automatically see every UI state change. Share only task-relevant context and continue to enforce permissions on any tool call. Standard apps offer explicit context mechanisms; ChatGPT’s Model-App Context extension adds its own bidirectional contract. Sources: https://developers.openai.com/plugins/build/chatgpt-ui and https://developers.openai.com/plugins/build/extensions.`,
  `Transition from possibility to a deliberately small build. The first outcome is seeing which to-do items are overdue. One authorized read-only tool and one useful screen are enough. Avoid migrating an entire website into the assistant. Preserve a useful tool result even when the host does not render the custom UI. This scope recommendation comes from the supplied reference guide, chapter “Build the first useful slice.”`,
  `Abridged configuration, not runnable code. Import MCPServer from @mastra/mcp. Define list_tasks with createTool from @mastra/core/tools, including validated schemas, real authorization in the handler, and mcp._meta.ui.resourceUri matching the resource key. Supply bundledHtml from your UI build, or use htmlPath for the built HTML. Mastra exposes tools without requiring a separate Agent. Checked with the Mastra maintainer against main at 79ea2ae745d3; pin and verify the installed version before live coding. Source: https://mastra.ai/reference/tools/mcp-server.`,
  `Live-coding handoff. This deck does not contain a standalone backend implementation. Pass 1: create and test list_tasks with a useful headless result. Pass 2: build the view with the MCP Apps bridge, register its HTML resource, and connect tool results. Pass 3: add the optional OpenAI metadata shown here. appUri is ui://tasks/tasks-v1.html from the previous slide. The excerpt belongs inside a Mastra createTool definition under mcp._meta, not arbitrary top-level _meta. Arbitrary descriptor metadata is passed through; host support is still required. Sources: https://mastra.ai/reference/tools/mcp-server and https://developers.openai.com/plugins/build/extensions.`,
  `Walk through these as product states, not decorative error screens. Empty accounts need a meaningful next step. During request failure retain only data that is still appropriate to display and clearly mark it stale; when authorization is lost, do not retain sensitive data on screen. Allow retry without duplicate destructive actions. Reauthentication should be understandable. Also test loading, slow requests, denied access, and stale data. Suggested design exercise based on the supplied guide.`,
  `Test tools and resource retrieval with MCP Inspector or an equivalent client. Deploy the MCP service and UI bundle to a stable reachable HTTPS endpoint, then connect it using ChatGPT’s current developer flow. Test the target host and real sample accounts, including denied cross-organization access. Development tunnels are useful temporarily, but public review requires a stable service. Source: https://developers.openai.com/plugins/deploy/connect-chatgpt and https://developers.openai.com/plugins/build/mcp-server.`,
  `There are three distribution choices: personal installation, a shared Git marketplace, or the public directory. Public review is not a prerequisite for local or team use. Confirm supported clients and workspace policies. Source: https://developers.openai.com/plugins/build/plugins.`,
  `Personal: a catalog at ~/.agents/plugins/marketplace.json references local plugin folders. Team: commit .agents/plugins/marketplace.json plus plugin folders; each teammate adds owner/repo (an example placeholder) with the Codex CLI shown. Restart ChatGPT desktop, choose the catalog, and install. Workspace admins can instead import a GitHub marketplace through Admin > Plugins > Add > Import marketplace and configure role access. Imported MCP configurations are desktop-only; other web-capable integrations use the documented app references. Sources: https://developers.openai.com/plugins/build/plugins and https://learn.chatgpt.com/docs/enterprise/plugin-management.`,
  `For public distribution, upload the plugin ZIP, complete automated checks and review, then explicitly publish after approval. Approval alone does not make it public. The illustrated portable package uses root plugin.json and mcp.json; validate their schemas and any optional assets or skills. OpenAI-specific manifest settings use extensions.com.openai. Prepare listing information, working authentication, reviewer access, and test cases. Sources: https://developers.openai.com/plugins/build/plugins and https://developers.openai.com/plugins/deploy/submission.`,
  `Updates differ by layer. Preserve backend contracts, rescan changed tools/metadata, version breaking UI resources and update their tool references, and update personal or Git catalogs when their packages change. Public-directory versions follow the review/publication process. Always rerun the sample task and permission tests. Monitor connection success and task completion rather than treating a listing as the finish line. Sources: https://developers.openai.com/plugins/deploy/submission and https://developers.openai.com/plugins/build/chatgpt-ui.`,
  `Transition to the live demo. Keep this green title on screen while switching to the demo environment.`,
  `Thank everyone for joining and leave the contact information on screen for final questions. Shane Thomas is @smthomas3 on X, as supplied by Shane. Alex Booker is @bookercodes, copied from slides/software-factory/index.tsx page 27. Mastra, YouTube, careers, and contact details also come from that reference closing slide.`,
]

export const meta: SlideMeta = {
  title: 'Build a ChatGPT Plugin with Mastra',
  theme: 'mastra',
  createdAt: '2026-10-08T04:42:20.857Z',
}

export default [
  Cover, Opportunity, Ideas, Server, App, Plugin, Extensions,
  Tasks, RequestFlow, UIHome, Clicks, Authorization,
  Portable, Sidebar, Surfaces, SharedContext,
  FirstSlice, Mastra, Build, UnhappyPaths, Deploy, Distribution, PrivateSharing, Publish, Maintain,
  DemoTime, Closing,
] satisfies Page[]
