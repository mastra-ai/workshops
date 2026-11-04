import type { ReactNode } from 'react'
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core'
import greed from '@assets/fonts/GreedVF.woff2'
import wordmark from '@assets/Mastra wordmark black.svg'
import frameworkScreen from './assets/framework.png'

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
const appearance: Appearance = 'light'
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
  .mastra-build-deploy-observe {
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
  .mastra-build-deploy-observe, .mastra-build-deploy-observe * { box-sizing: border-box; }
  .mastra-build-deploy-observe[data-appearance="dark"] { ${darkTokens} }
  @media (prefers-color-scheme: dark) {
    .mastra-build-deploy-observe[data-appearance="system"] { ${darkTokens} }
  }
  .mastra-build-deploy-observe a:focus-visible, .mastra-build-deploy-observe button:focus-visible { outline: 4px solid var(--mt-accent); outline-offset: 6px; }

`
// One font/style registration; HMR replaces it instead of leaving stale rules.
if (typeof document !== 'undefined') {
  const id = 'mastra-build-deploy-observe-styles'
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
  return <div className="mastra-build-deploy-observe" data-appearance={resolved}>{children}</div>
}

const Frame = ({ children }: { children: ReactNode }) => <>
  <div style={{ position: 'absolute', inset: 56, borderRadius: 64, background: 'var(--mt-shell)' }} />
  <div style={{ position: 'absolute', inset: 92, borderRadius: 42, border: '1px solid var(--mt-border)', background: 'var(--mt-panel)', padding: '88px 96px' }}>{children}</div>
</>

const Title = ({ children }: { children: ReactNode }) => <h1 style={{ margin: 0, maxWidth: 1300, fontFamily: 'var(--osd-font-display)', fontSize: 'var(--osd-size-hero, 108px)', fontWeight: 520, lineHeight: 1.1, textWrap: 'balance' }}>{children}</h1>
const Wordmark = () => <div role="img" aria-label="Mastra" style={{ width: 332, height: 84, background: 'var(--mt-text)', mask: `url("${wordmark}") center / contain no-repeat`, WebkitMask: `url("${wordmark}") center / contain no-repeat` }} />
const EventBadge = ({ children = 'Talk' }: { children?: ReactNode }) => <div style={{ display: 'inline-flex', border: '1px solid var(--mt-border)', background: 'var(--mt-subtle)', borderRadius: 999, padding: '12px 22px', fontSize: 28, letterSpacing: '.1em', textTransform: 'uppercase' }}>{children}</div>

const Cover: Page = () => <MastraPage><Frame>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Wordmark /><EventBadge>Workshop</EventBadge></div>
  <div style={{ position: 'absolute', top: 172, bottom: 88, left: 96, right: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><Title>Build, Deploy, Observe<br />TypeScript Agents on Mastra</Title></div>
</Frame></MastraPage>

const Center = ({ children }: { children: ReactNode }) => <div style={{ position: 'absolute', inset: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 36 }}>{children}</div>
const Heading = ({ children, size = 94 }: { children: ReactNode; size?: number }) => <h2 style={{ margin: 0, maxWidth: 1440, fontSize: size, fontWeight: 520, lineHeight: 1.15, textWrap: 'balance' }}>{children}</h2>
const mono = 'SFMono-Regular, Menlo, Consolas, monospace'
const K = ({ children }: { children: ReactNode }) => <span style={{ color: 'var(--mt-keyword)' }}>{children}</span>
const S = ({ children }: { children: ReactNode }) => <span style={{ color: 'var(--mt-string)' }}>{children}</span>
const P = ({ children }: { children: ReactNode }) => <span style={{ color: 'var(--mt-property)' }}>{children}</span>
const CodePanel = ({ children, command = false }: { children: ReactNode; command?: boolean }) => <pre style={{ margin: 0, padding: command ? '48px 56px' : '36px 44px', border: '1px solid var(--mt-border)', borderRadius: 24, background: 'var(--mt-subtle)', whiteSpace: 'pre', textAlign: 'left' }}><code style={{ fontFamily: mono, fontSize: command ? 64 : 34, lineHeight: command ? 1.4 : '48px', letterSpacing: '-.025em' }}>{children}</code></pre>
const Body = ({ children }: { children: ReactNode }) => <p style={{ margin: 0, fontSize: 38, lineHeight: 1.45, color: 'var(--mt-soft)' }}>{children}</p>
const Label = ({ children }: { children: ReactNode }) => <div style={{ fontSize: 26, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--mt-accent)' }}>{children}</div>
const Card = ({ title, children }: { title: string; children: ReactNode }) => <div style={{ borderRadius: 24, border: '1px solid var(--mt-border)', background: 'var(--mt-subtle)', padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}><h3 style={{ margin: 0, fontSize: 40, fontWeight: 520, color: 'var(--mt-accent)' }}>{title}</h3><div style={{ fontSize: 32, lineHeight: 1.4, color: 'var(--mt-soft)' }}>{children}</div></div>
const Link = ({ href, children }: { href: string; children: ReactNode }) => <a href={href} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '18px 28px', borderRadius: 16, background: 'var(--mt-action)', color: 'var(--mt-action-text)', textDecoration: 'none', fontSize: 30 }}>{children} ↗</a>

const Teammate: Page = () => <MastraPage><Frame><Center><Label>Today, you’ll build</Label><Heading>An AI teammate</Heading><Body>It remembers, uses your tools, and joins you in Slack.</Body><div style={{ display: 'flex', gap: 80, marginTop: 48, fontSize: 38, color: 'var(--mt-accent)' }}><span>Build</span><span>Deploy</span><span>Observe & improve</span></div></Center></Frame></MastraPage>

const WhatIsMastra: Page = () => <MastraPage><Frame>
  <Heading size={76}>What is Mastra?</Heading>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 36 }}>
    <div><Label>Open-source TypeScript framework</Label><a href="https://mastra.ai/ai-agent-framework" target="_blank" rel="noreferrer"><img src={frameworkScreen} alt="Mastra framework website showing TypeScript agent building blocks" style={{ display: 'block', width: '100%', height: 420, objectFit: 'contain', background: '#080808', borderRadius: 20, marginTop: 24 }} /></a><p style={{ margin: '22px 0 0', fontSize: 30, color: 'var(--mt-muted)' }}>Started October 2024</p></div>
    <div><Label>Platform to operate your agents</Label><div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}><Card title="Deploy">Hosted runtime & storage</Card><Card title="Observe">Traces, costs & failures</Card><Card title="Improve">Datasets & experiments</Card><Card title="Connect">Tools & channels</Card></div><p style={{ margin: '24px 0 0', fontSize: 30, color: 'var(--mt-soft)' }}>Gateway: memory + model routing</p></div>
  </div>
</Frame></MastraPage>

const BuildAndOperate: Page = () => <MastraPage><Frame><Center><Heading>Building the agent<br />is only the beginning.</Heading><Body>Deploy it. See what happened. Make it better.</Body></Center></Frame></MastraPage>

const CreateProject: Page = () => <MastraPage><Frame><Center><Label>Start with the open-source framework</Label><CodePanel command><S>pnpm</S>{' '}<P>create</P>{' mastra'}</CodePanel><Body>The CLI installs the Mastra skill for your coding agent.</Body></Center></Frame></MastraPage>

const Starter: Page = () => <MastraPage><Frame><Heading size={76}>A useful starting point</Heading><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 52 }}><Card title="Memory">Keep the conversation going</Card><Card title="Workspace">Files and shell tools</Card><Card title="Web access">Search and fetch pages</Card><Card title="Task tracking">Follow multi-step work</Card><Card title="Approvals">Review sensitive actions</Card><Card title="Schedules">Return to ongoing work</Card></div><div style={{ marginTop: 40 }}><Link href="http://localhost:4111">Explore the starter in Studio</Link></div></Frame></MastraPage>

const ShapeTeammate: Page = () => <MastraPage><Frame><Label>Live build · Use the Mastra skill</Label><div style={{ marginTop: 48 }}><Heading size={76}>Give your teammate a job</Heading></div><div style={{ marginTop: 48, padding: 44, borderRadius: 24, background: 'var(--mt-subtle)', border: '1px solid var(--mt-border)', fontSize: 44, lineHeight: 1.45 }}>“Help me prepare for customer calls.<br />Use our company notes, remember my preferences,<br />and ask before taking external actions.”</div><p style={{ margin: '38px 0 0', fontSize: 30, color: 'var(--mt-muted)' }}>Add a small company brief to the workspace.</p></Frame></MastraPage>

const ContextWindow: Page = () => <MastraPage><Frame><Heading size={76}>A context window is finite</Heading><Body>Every message and tool result takes up space.</Body><div style={{ marginTop: 100, padding: 28, border: '2px solid var(--mt-border)', borderRadius: 26 }}><div style={{ display: 'flex', height: 160, gap: 12, fontSize: 32, textAlign: 'center' }}><div style={{ width: 250, background: 'var(--mt-pill)', borderRadius: 16, display: 'grid', placeItems: 'center' }}>Instructions</div><div style={{ flex: 1, background: 'var(--mt-pill-strong)', borderRadius: 16, display: 'grid', placeItems: 'center' }}>Conversation + tool results</div><div style={{ width: 230, border: '2px dashed var(--mt-accent)', borderRadius: 16, display: 'grid', placeItems: 'center' }}>Next turn?</div></div></div><p style={{ margin: '52px 0 0', fontSize: 40, color: 'var(--mt-accent)' }}>More history isn’t the same as better context.</p></Frame></MastraPage>

const ObservationalMemory: Page = () => <MastraPage><Frame><Heading size={76}>Remember what matters</Heading><div style={{ marginTop: 72, display: 'grid', gridTemplateColumns: '1fr 64px 1fr 64px 1fr', alignItems: 'center', gap: 20 }}><Card title="Conversation">Messages and tool results</Card><div style={{ fontSize: 60 }}>→</div><Card title="Observer">Captures useful observations</Card><div style={{ fontSize: 60 }}>→</div><Card title="Reflector">Condenses older observations</Card></div><div style={{ marginTop: 72, padding: 36, borderRadius: 24, background: 'var(--mt-pill)', fontSize: 40, textAlign: 'center' }}>Agent context = observations + recent messages</div></Frame></MastraPage>

const EnableMemory: Page = () => <MastraPage><Frame><Center><Label>Add observational memory</Label><CodePanel><K>import</K>{' { Memory } '}<K>from</K>{' '}<S>'@mastra/memory'</S>{'\n\n'}<K>const</K>{' memory = '}<K>new</K>{' Memory({\n  '}<P>options</P>{': {\n    '}<P>observationalMemory</P>{': '}<K>true</K>{',\n  },\n})'}</CodePanel><Body>Attach it to your agent and use persistent storage.</Body></Center></Frame></MastraPage>

const MemoryDemo: Page = () => <MastraPage><Frame><Label>Live demo · Observational memory</Label><div style={{ marginTop: 42 }}><Heading size={76}>One continuous conversation</Heading></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28, marginTop: 60 }}><Card title="1 · Tell it">“Use three bullets for my call briefs.”</Card><Card title="2 · Keep working">Research, read notes, and inspect the observations.</Card><Card title="3 · Ask again">“Prepare my next call brief.”</Card></div><div style={{ display: 'flex', gap: 24, marginTop: 52 }}><Link href="http://localhost:4111">Open Studio</Link><Link href="https://mastra.ai/docs/memory/observational-memory">Memory docs</Link></div></Frame></MastraPage>

const DocsTour: Page = () => <MastraPage><Frame><Center><Label>Live tour</Label><Heading>Pick a capability.<br />Add it to your teammate.</Heading><div style={{ display: 'flex', gap: 36, fontSize: 34, color: 'var(--mt-accent)' }}><span>Tools</span><span>Memory</span><span>Workflows</span><span>Skills</span><span>Approvals</span></div><Link href="https://mastra.ai/docs">Explore the docs</Link></Center></Frame></MastraPage>

const Deploy: Page = () => <MastraPage><Frame><Center><Label>Live demo · Mastra platform</Label><Heading>Put your teammate online</Heading><CodePanel command><S>pnpm</S>{' '}<P>exec</P>{' mastra deploy'}</CodePanel><Body>Deploy the runtime. Keep its memory persistent.</Body></Center></Frame></MastraPage>

const Slack: Page = () => <MastraPage><Frame><Heading size={76}>Meet your teammate in Slack</Heading><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28, marginTop: 60 }}><Card title="Connect">Authorize the Slack channel provider</Card><Card title="Install">Link the channel to your agent in Studio</Card><Card title="Try it">Ask for a customer call brief in a thread</Card></div><div style={{ marginTop: 52, padding: 32, borderRadius: 22, background: 'var(--mt-subtle)', fontSize: 38 }}>“@teammate What should I know before this call?”</div><div style={{ marginTop: 36 }}><Link href="https://mastra.ai/docs/mastra-platform/connect/channels">Channel setup</Link></div></Frame></MastraPage>

const Connect: Page = () => <MastraPage><Frame><Heading size={76}>Give it the tools your team uses</Heading><Label>Mastra Connect</Label><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 64 }}><Card title="Gmail">Find the latest customer conversation</Card><Card title="Notion">Read account notes and company knowledge</Card></div><p style={{ margin: '48px 0', fontSize: 38, lineHeight: 1.4 }}>Authorize an account → choose tools → add them to the agent.</p><Link href="https://mastra.ai/docs/mastra-platform/connect/tools">Connect tools</Link></Frame></MastraPage>

const Observe: Page = () => <MastraPage><Frame><Heading size={76}>See what actually happened</Heading><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28, marginTop: 72 }}><Card title="Decisions">Which tools and context did it use?</Card><Card title="Performance">How long did it take? What did it cost?</Card><Card title="Failures">Where did it go wrong?</Card></div><p style={{ margin: '64px 0 0', fontSize: 42, color: 'var(--mt-accent)' }}>Turn a real failure into a test case.</p></Frame></MastraPage>

const Dataset: Page = () => <MastraPage><Frame><Heading size={76}>Define what good looks like</Heading><div style={{ marginTop: 46, border: '1px solid var(--mt-border)', borderRadius: 24, padding: '12px 32px' }}><table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 32, lineHeight: 1.4, textAlign: 'left' }}><thead><tr><th style={{ padding: '24px 16px', width: '50%', color: 'var(--mt-accent)' }}>Dataset input</th><th style={{ padding: '24px 16px', color: 'var(--mt-accent)' }}>Expected behavior</th></tr></thead><tbody><tr><td style={{ padding: '24px 16px', borderTop: '1px solid var(--mt-border)' }}>“Brief me on Acme before my call.”</td><td style={{ padding: '24px 16px', borderTop: '1px solid var(--mt-border)' }}>Uses the supplied account facts</td></tr><tr><td style={{ padding: '24px 16px', borderTop: '1px solid var(--mt-border)' }}>“What did Acme decide last week?”</td><td style={{ padding: '24px 16px', borderTop: '1px solid var(--mt-border)' }}>Retrieves evidence; doesn’t invent it</td></tr><tr><td style={{ padding: '24px 16px', borderTop: '1px solid var(--mt-border)' }}>“Email this brief to the customer.”</td><td style={{ padding: '24px 16px', borderTop: '1px solid var(--mt-border)' }}>Requests approval before sending</td></tr></tbody></table></div><p style={{ margin: '36px 0 0', fontSize: 30, color: 'var(--mt-muted)' }}>Use fixed company fixtures and tool responses for repeatable comparisons.</p></Frame></MastraPage>

const Experiments: Page = () => <MastraPage><Frame><Heading size={76}>Compare model versions</Heading><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 60 }}><Card title="Experiment A">Current model · fixed dataset</Card><Card title="Experiment B">Candidate model · same dataset</Card></div><div style={{ marginTop: 56, fontSize: 40, color: 'var(--mt-accent)' }}>Score quality. Compare cost and latency. Inspect regressions.</div><div style={{ marginTop: 46 }}><Link href="https://mastra.ai/docs/evals/experiments">Run experiments</Link></div></Frame></MastraPage>

const Questions: Page = () => <MastraPage><Frame><Center><Heading>Your teammate is just<br />getting started.</Heading><Body>Questions?</Body><Link href="https://mastra.ai/docs">Keep building with Mastra</Link></Center></Frame></MastraPage>

export const notes = [
  'Workshop: build an AI teammate. https://luma.com/mastra-88zp. Follow one call-preparation teammate throughout, from the default scaffold to memory, deployment, Slack, Connect and evaluations.',
  'Outcome: a teammate that uses company context, remembers relevant information, is reachable in Slack, and can be evaluated. Prerequisites: Node and pnpm, a model provider key, a coding assistant, a Mastra platform account, and permission to install a Slack app. Pre-authorize demo accounts before the session.',
  'Mastra is an open-source TypeScript framework. Work began in October 2024, confirmed by https://mastra.ai/blog/announcing-mastra-1. Screenshot reused from the prior talk, not a current product UI capture. The platform supports deployment, observability and Connect; datasets and evals are also framework capabilities. Gateway adds observational memory and model routing for any agent stack: https://mastra.ai/ai-gateway. Do not imply the framework requires hosted deployment.',
  'Writing the agent is only part of the work. Once people use it, you need persistent state, deployment, traces, cost visibility, debugging, and a way to measure improvements. The platform supplies operational tools without changing the core agent concept.',
  'Run pnpm create mastra (latest is also available as pnpm create mastra@latest), choose the provider, enter the new directory, and run pnpm dev. Open localhost:4111. Current CLI creates a general-purpose harness and installs the Mastra skill for detected coding assistants. Manual fallback: pnpm dlx skills add mastra-ai/skills. Sources: https://mastra.ai/docs and https://mastra.ai/docs/develop. The coding assistant skill is distinct from runtime skills your teammate may use.',
  'Tour the generated files and Studio. The current default harness includes workspace/shell tools, conversation memory, web access, task tracking, approvals and recurring schedules. Show rather than configure every feature. Observational memory is a separate configuration to inspect or enable, not something to assume is active by default. Sources: https://mastra.ai/docs and https://mastra.ai/templates/agent-harness.',
  'Ask the coding assistant to use the Mastra skill to adapt the starter. Add a fictional company brief and an Acme account note as fixtures, then give the teammate a clear instruction. Keep the existing tool and approval setup. Test a local question before adding integrations. This is a suggested workshop scenario, not a claim about a shipped template.',
  'A model only sees the context provided on a call, bounded by its token limit. Instructions, messages, retrieved data, tool calls and results all compete for that budget. Persistent storage alone does not make every past detail visible. Trimming raw history can remove useful facts. Diagram is conceptual, not a measured allocation.',
  'Observational Memory uses background Observer and Reflector agents. The Observer captures observations from messages; the Reflector condenses them as they grow. Older raw history is replaced in model context while recent unobserved messages remain. Compression is selective, not perfect recall. Source: https://mastra.ai/docs/memory/observational-memory.',
  'This is the Memory configuration fragment, not a standalone program. Pass memory into the Agent configuration and configure a persistent storage provider on Mastra or Memory. Check the default observation model and required provider key before presenting. Use stable resource and thread identifiers when calling the agent. Source: https://mastra.ai/docs/memory/observational-memory.',
  'Use a prepared, sufficiently long conversation so observation thresholds are reached; a three-message exchange will not necessarily trigger OM. Show the observation log in Studio, continue the same thread/resource, and ask for another brief. Demonstrate the saved preference and company facts. Have a pre-seeded thread ready to keep the demo quick. Source: https://mastra.ai/docs/memory/observational-memory.',
  'Browse the docs live: Agents → Tools → Memory → Workflows → Skills → Human-in-the-loop. Pick one small capability that improves the same teammate rather than creating another example. Use the Mastra skill and llms.txt for coding-assistant discovery. https://mastra.ai/docs ; https://mastra.ai/llms.txt',
  'Run pnpm exec mastra deploy from the project. Authenticate when prompted, create/select the project and environment, configure provider credentials, and provision persistent hosted storage when preflight offers it. Do not rely on an ephemeral local database in production. Open deployed Studio and make a test request. Source: https://mastra.ai/docs/mastra-platform/deploy.',
  'Slack setup uses Connect ahead of the broader tools tour. Install @mastra/connect; register channels: await channels() on the Mastra instance and deploy. Create a Slack app configuration token, run mastra connect add slack-channels, then connect the channel to the agent in Studio and authorize the app. Invite the app to the test channel and mention it. slack-channels is different from slack API tools. Have vendor authorization prepared before presenting. Source: https://mastra.ai/docs/mastra-platform/connect/channels.',
  'Use Connect to authorize Gmail (provider ID google-mail) and Notion (notion). Add only the tools needed for the exercise, then fetch a demo email and an account note. Connect handles credentials and OAuth refresh through the platform. Channels are how people talk to the agent; tools are how the agent acts. Use demo data and require human approval for send/write actions. Sources: https://mastra.ai/docs/mastra-platform/connect/overview ; https://mastra.ai/docs/mastra-platform/connect/providers ; https://mastra.ai/docs/mastra-platform/connect/tools.',
  'Open the trace for the Slack or Connect request. Walk through the model call, tool arguments/results, timing, tokens/cost where available, and errors. Avoid equating traces with a full record of model reasoning. Save an observed failure as a dataset item. https://mastra.ai/docs/observability/tracing/overview',
  'Create a small versioned dataset in Studio. Inputs shown are illustrative; supply the same company fixtures and tool responses for both models. Add expected outputs or scoring criteria for factuality and task completion. Approval behavior should be checked against the tool trace, not just the final prose. Memory-specific cases need consistent seeded state. https://mastra.ai/docs/evals/datasets ; https://mastra.ai/docs/evals/evals-with-memory',
  'Run a baseline experiment, change only the model version, and run again with the same dataset version, scorers, instructions and isolated starting memory. Compare row-level outputs and aggregate quality; review latency/cost in run telemetry when available. Do not invent benchmark results. An experiment runs dataset items against an agent/workflow and persists results for comparison. https://mastra.ai/docs/evals/experiments',
  'Recap: create, remember, deploy, connect, observe, evaluate. Invite questions and direct participants to the docs. The slides are teaching and live-demo prompts; no deployment or connected-account actions were performed while authoring.',
]

export const meta: SlideMeta = {
  title: 'Build, Deploy, Observe TypeScript Agents on Mastra',
  theme: 'mastra',
  createdAt: '2026-10-29T15:00:19.356Z',
}

export default [Cover, Teammate, WhatIsMastra, BuildAndOperate, CreateProject, Starter, ShapeTeammate, ContextWindow, ObservationalMemory, EnableMemory, MemoryDemo, DocsTour, Deploy, Slack, Connect, Observe, Dataset, Experiments, Questions] satisfies Page[]
