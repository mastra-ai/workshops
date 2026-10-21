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
  --mt-shell: #040506; --mt-panel: #090c11; --mt-border: #29332d;
  --mt-soft: #cfd6de; --mt-muted: #a2aca5; --mt-subtle: #111913;
  --mt-pill: #142619; --mt-code: #99deac; color-scheme: dark;
`
export const themeCss = `
  @font-face { font-family: Greed; src: url(${greed}) format('woff2'); font-weight: 100 900; font-display: swap; }
  .signals-ongoing {
    --mt-bg: var(--osd-bg, #f5f6f4); --mt-text: var(--osd-text, #101813); --mt-accent: var(--osd-accent, #19783a);
    --mt-shell: #e6ebe5; --mt-panel: #fff; --mt-border: #c4cec5;
    --mt-soft: #25362b; --mt-muted: #46554b; --mt-subtle: #f3f7f1;
    --mt-pill: #edf6e8; --mt-code: #19783a; color-scheme: light;
    position: relative; width: 100%; height: 100%; isolation: isolate;
    background: var(--mt-bg); color: var(--mt-text);
    font-family: var(--osd-font-body, Greed, system-ui, sans-serif);
  }
  .signals-ongoing, .signals-ongoing * { box-sizing: border-box; }
  .signals-ongoing[data-appearance="dark"] { ${darkTokens} }
  @media (prefers-color-scheme: dark) {
    .signals-ongoing[data-appearance="system"] { ${darkTokens} }
  }
`
if (typeof document !== 'undefined') {
  const id = 'signals-ongoing-styles'
  const style = document.getElementById(id) ?? document.createElement('style')
  style.id = id
  if (style.textContent !== themeCss) style.textContent = themeCss
  if (!style.isConnected) document.head.appendChild(style)
}

const mono = '"SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace'
const MastraPage = ({ children }: { children: ReactNode }) => <div className="signals-ongoing" data-appearance={appearance}>{children}</div>
const Frame = ({ children }: { children: ReactNode }) => <>
  <div style={{ position: 'absolute', inset: 56, borderRadius: 64, background: 'var(--mt-shell)' }} />
  <div style={{ position: 'absolute', inset: 92, borderRadius: 42, border: '1px solid var(--mt-border)', background: 'var(--mt-panel)', padding: '88px 96px' }}>{children}</div>
</>
const Wordmark = () => <div role="img" aria-label="Mastra" style={{ width: 332, height: 84, background: 'var(--mt-text)', mask: `url("${wordmark}") center / contain no-repeat`, WebkitMask: `url("${wordmark}") center / contain no-repeat` }} />
const Badge = ({ children }: { children: ReactNode }) => <span style={{ display: 'inline-block', border: '1px solid var(--mt-border)', background: 'var(--mt-subtle)', borderRadius: 999, padding: '12px 22px', fontSize: 26, letterSpacing: '.1em', textTransform: 'uppercase' }}>{children}</span>

// The same three stops recur across chapters; each new capability changes how input reaches the next step.
const SignalPath = ({ outside = 'outside event', thread = 'thread', next = 'next agent step', active = 'thread' }: { outside?: string; thread?: string; next?: string; active?: 'outside' | 'thread' | 'next' }) => <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
  <PathStop label={outside} selected={active === 'outside'} />
  <span style={{ fontSize: 40, color: 'var(--mt-accent)' }}>→</span>
  <PathStop label={thread} selected={active === 'thread'} />
  <span style={{ fontSize: 40, color: 'var(--mt-accent)' }}>→</span>
  <PathStop label={next} selected={active === 'next'} />
</div>
const PathStop = ({ label, selected }: { label: string; selected: boolean }) => <div style={{ flex: 1, minWidth: 0, border: '1px solid var(--mt-border)', background: selected ? 'var(--mt-pill)' : 'var(--mt-subtle)', color: selected ? 'var(--mt-accent)' : 'var(--mt-muted)', borderRadius: 20, padding: '18px 12px', textAlign: 'center', fontSize: 29, fontWeight: 520, whiteSpace: 'nowrap' }}>{label}</div>
const Card = ({ label, children }: { label: string; children: ReactNode }) => <div style={{ flex: 1, minWidth: 0, border: '1px solid var(--mt-border)', borderRadius: 22, background: 'var(--mt-subtle)', padding: '28px 32px' }}>
  <div style={{ fontFamily: mono, fontSize: 23, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--mt-accent)', marginBottom: 22 }}>{label}</div>
  <div style={{ fontSize: 36, lineHeight: 1.3, color: 'var(--mt-soft)' }}>{children}</div>
</div>
const Code = ({ children }: { children: ReactNode }) => <div style={{ flex: '1 1 0', minWidth: 0, border: '1px solid var(--mt-border)', borderRadius: 22, background: 'var(--mt-subtle)', padding: '32px 40px', color: 'var(--mt-code)', fontFamily: mono, fontSize: 29, lineHeight: 1.5, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{children}</div>
const Story = ({ chapter, title, children, path }: { chapter: string; title: string; children: ReactNode; path?: ReactNode }) => <MastraPage><Frame>
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ color: 'var(--mt-accent)', fontFamily: mono, fontSize: 24, textTransform: 'uppercase', letterSpacing: '.12em' }}>{chapter}</div>
    <h2 style={{ margin: '18px 0 0', maxWidth: 1500, fontSize: 74, fontWeight: 520, lineHeight: 1.13, letterSpacing: '-.025em' }}>{title}</h2>
    <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 28, minHeight: 0 }}>{children}</div>
    {path && <div style={{ borderTop: '1px solid var(--mt-border)', paddingTop: 18 }}>{path}</div>}
  </div>
</Frame></MastraPage>
const Quote = ({ children }: { children: ReactNode }) => <p style={{ margin: 0, maxWidth: 1400, fontSize: 54, lineHeight: 1.25, fontWeight: 450, letterSpacing: '-.02em' }}>{children}</p>
const Aside = ({ children }: { children: ReactNode }) => <p style={{ flex: '0 0 32%', margin: 0, fontSize: 32, lineHeight: 1.35, color: 'var(--mt-muted)' }}>{children}</p>
const FlowNode = ({ label, children, emphasis = false }: { label: string; children: ReactNode; emphasis?: boolean }) => <div style={{ flex: 1, minWidth: 0, minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 32, border: '1px solid var(--mt-border)', borderRadius: 24, background: emphasis ? 'var(--mt-pill)' : 'var(--mt-subtle)' }}>
  <span style={{ fontFamily: mono, fontSize: 23, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--mt-accent)' }}>{label}</span>
  <span style={{ fontSize: 41, lineHeight: 1.15, color: 'var(--mt-text)' }}>{children}</span>
</div>
const FlowArrow = () => <span aria-hidden="true" style={{ fontSize: 48, color: 'var(--mt-accent)' }}>→</span>

const Cover: Page = () => <MastraPage><Frame><div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Wordmark /><Badge>Workshop</Badge></div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><h1 style={{ margin: 0, maxWidth: 1350, fontSize: 'var(--osd-size-hero, 108px)', lineHeight: 1.1, fontWeight: 520, letterSpacing: '-.035em' }}>Signals for ongoing agents</h1></div>
</div></Frame></MastraPage>

const AgentsChanged: Page = () => <Story chapter="01 / The mismatch" title="Agents stopped being one-shot requests">
  <Quote>They keep working, watching, and responding after the first call returns.</Quote>
</Story>
const InterfaceDidNot: Page = () => <Story chapter="01 / The mismatch" title="But we still reach them like a function">
  <Card label="Old contract">Send a prompt → wait for an answer → start over.</Card>
  <Card label="New reality">The thread remains addressable even when no run is active.</Card>
</Story>
const NewPrimitive: Page = () => <Story chapter="01 / The mismatch" title="The thread needs an address">
  <Quote>A signal sends typed input into an existing thread. It can join an active run or wake an idle thread.</Quote>
</Story>
const Loop: Page = () => <Story chapter="01 / The mismatch" title="More than a chat message" path={<SignalPath />}>
  <Card label="Input">A person, processor, or outside system has something new to say.</Card>
  <Card label="Delivery">Mastra joins that input to the thread according to what the agent is doing.</Card>
</Story>

const Observe: Page = () => <Story chapter="02 / Watch and steer" title="First: watch the thread, not the request" path={<SignalPath outside="subscribers" thread="thread stream" next="agent run" active="thread" />}>
  <Code>{'agent.subscribeToThread({\n  resourceId, threadId\n})'}</Code>
  <Aside>Output and lifecycle events belong to the thread. Multiple clients can observe the same run.</Aside>
</Story>
const ThreadStream: Page = () => <Story chapter="02 / Watch and steer" title="The stream tells you what happened" path={<SignalPath outside="subscribers" thread="thread stream" next="agent run" active="next" />}>
  <Card label="Observe">Model text, tool calls, approvals, errors, and run events.</Card>
  <Card label="Recover">Subscribe with stored history, then continue with live chunks.</Card>
</Story>
const Send: Page = () => <Story chapter="02 / Watch and steer" title="Now you can talk to a running agent" path={<SignalPath outside="new user input" thread="same thread" next="next step" active="outside" />}>
  <Code>{'agent.sendMessage("...", {\n  resourceId, threadId\n})'}</Code>
  <Aside>New user input reaches the existing thread. No second conversation to reconcile.</Aside>
</Story>
const Queue: Page = () => <Story chapter="02 / Watch and steer" title="Or leave the next instruction in line" path={<SignalPath outside="follow-up" thread="same thread" next="next run" active="next" />}>
  <Code>{'agent.queueMessage("...", {\n  resourceId, threadId\n})'}</Code>
  <Aside>During an active run, queue a new run for when it finishes. If idle, start now.</Aside>
</Story>

const DifferentInput: Page = () => <Story chapter="03 / Input has a lifecycle" title="Not every update is a message" path={<SignalPath outside="new context" thread="same thread" next="next step" active="outside" />}>
  <Card label="Message">A person's instruction or follow-up.</Card>
  <Card label="Signal">System context that should join the agent's work.</Card>
  <Card label="State / event">A changing fact or a discrete occurrence.</Card>
</Story>
const SystemContext: Page = () => <Story chapter="03 / Input has a lifecycle" title="Context can arrive without a new user turn" path={<SignalPath outside="system context" thread="same thread" next="next step" active="thread" />}>
  <Code>{'agent.sendSignal(\n  { type: "reactive", contents: "..." },\n  { resourceId, threadId }\n)'}</Code>
  <Aside>Use a signal for system-originated context; use sendMessage for a person's instruction.</Aside>
</Story>
const State: Page = () => <Story chapter="03 / Input has a lifecycle" title="State is a lane, not a pile of messages">
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
    <div style={{ fontFamily: mono, fontSize: 26, color: 'var(--mt-accent)' }}>NAMED LANE / browser</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <FlowNode label="Snapshot">The full picture</FlowNode><FlowArrow />
      <FlowNode label="Delta">Only what changed</FlowNode><FlowArrow />
      <FlowNode label="Next model step" emphasis>Current context</FlowNode>
    </div>
    <p style={{ margin: 0, fontSize: 32, color: 'var(--mt-muted)' }}>The producer computes the change; Mastra tracks the lane.</p>
  </div>
</Story>
const StateRefresh: Page = () => <Story chapter="03 / Input has a lifecycle" title="When context moves on, restore the snapshot" path={<SignalPath outside="fresh snapshot" thread="state lane" next="next model step" active="next" />}>
  <Quote>The producer tracks what changed; the processor can send a fresh snapshot when the active context no longer has one.</Quote>
</Story>
const Notifications: Page = () => <Story chapter="03 / Input has a lifecycle" title="An event needs an inbox, not a state lane">
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '19px 26px', borderRadius: 18, background: 'var(--mt-subtle)', fontSize: 31 }}>Review changed</div>
        <div style={{ padding: '19px 26px', borderRadius: 18, background: 'var(--mt-subtle)', fontSize: 31 }}>Review changed again</div>
      </div>
      <FlowArrow />
      <div style={{ flex: 1.5, padding: 36, minHeight: 270, borderRadius: 28, border: '2px solid var(--mt-accent)', background: 'var(--mt-pill)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: mono, fontSize: 24, color: 'var(--mt-accent)' }}>DURABLE INBOX</span>
        <span style={{ fontSize: 48, lineHeight: 1.1 }}>One pending record</span>
        <span style={{ fontSize: 28, color: 'var(--mt-soft)' }}>dedupe repeats · coalesce related events</span>
      </div>
      <FlowArrow />
      <div style={{ flex: 1, fontSize: 41, lineHeight: 1.15 }}>Deliver to<br />agent attention</div>
    </div>
    <p style={{ margin: 0, paddingLeft: 32, borderLeft: '5px solid var(--mt-accent)', fontSize: 31, lineHeight: 1.3, color: 'var(--mt-muted)' }}>A direct notification signal skips the inbox record.</p>
  </div>
</Story>
const Providers: Page = () => <Story chapter="03 / Input has a lifecycle" title="Let one connector watch for many threads" path={<SignalPath outside="external source" thread="subscriptions" next="notifications" active="outside" />}>
  <Quote>A signal provider tracks which threads care about a resource, watches the source, and delivers matching changes.</Quote>
</Story>

const ProcessBoundary: Page = () => <Story chapter="04 / Beyond one process" title="What if the agent lives somewhere else?">
  <div style={{ display: 'flex', width: '100%', alignItems: 'stretch', gap: 28 }}>
    <div style={{ flex: 1, minWidth: 0, padding: 38, borderRadius: 28, background: 'var(--mt-subtle)', display: 'flex', flexDirection: 'column', gap: 36 }}>
      <span style={{ fontFamily: mono, fontSize: 24, color: 'var(--mt-muted)' }}>PROCESS B / RECEIVER</span>
      <span style={{ fontSize: 47, lineHeight: 1.12 }}>Signal arrives here</span>
      <span style={{ fontSize: 30, color: 'var(--mt-muted)' }}>No active run here</span>
    </div>
    <div style={{ flex: '0 0 265px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: 'var(--mt-accent)' }}>
      <span style={{ fontSize: 50 }}>→</span>
      <span style={{ fontFamily: mono, fontSize: 27, textAlign: 'center' }}>SHARED<br />PUBSUB</span>
      <span style={{ fontSize: 50 }}>→</span>
    </div>
    <div style={{ flex: 1, minWidth: 0, padding: 38, borderRadius: 28, border: '2px solid var(--mt-accent)', background: 'var(--mt-pill)', display: 'flex', flexDirection: 'column', gap: 36 }}>
      <span style={{ fontFamily: mono, fontSize: 24, color: 'var(--mt-accent)' }}>PROCESS A / OWNER</span>
      <span style={{ fontSize: 47, lineHeight: 1.12 }}>The thread runs here</span>
      <span style={{ fontSize: 30, color: 'var(--mt-soft)' }}>Lease selects one owner</span>
    </div>
  </div>
</Story>
const Ownership: Page = () => <Story chapter="04 / Beyond one process" title="One thread. One active owner." path={<SignalPath outside="outside event" thread="owned thread" next="next agent step" active="next" />}>
  <Quote>Leases coordinate who runs the thread. Shared storage and PubSub make delivery and recovery possible across processes.</Quote>
</Story>
const Close: Page = () => <MastraPage><Frame><div style={{ display: 'flex', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 50 }}>
  <h2 style={{ margin: 0, maxWidth: 1400, fontSize: 94, lineHeight: 1.12, fontWeight: 520 }}>An ongoing agent needs an ongoing way in.</h2>
  <div style={{ width: '100%' }}><SignalPath outside="watch / send" thread="state / events" next="across processes" /></div>
</div></Frame></MastraPage>

export const meta: SlideMeta = {
  title: 'Signals for ongoing agents',
  theme: 'mastra',
  createdAt: '2026-10-21T18:13:58.363Z',
}
export const notes = [
  'Open on the thesis: agents have become long-running processes, but our input model still assumes one request, one answer. This is a story about the primitive, not a single PR scenario. Based on the Signals guides in PR #28022.',
  'The first agent.stream() call is only the beginning. Long-running agents work with goals, tools, users, and outside events. Let the mismatch land before presenting APIs.',
  'The old request/response boundary makes new information feel like a new invocation, even when the work belongs to an existing thread. The thread remains addressable across active and idle runs. Review feedback on a PR is just one illustration.',
  'Define Signals as typed input into an existing agent thread after the initial stream call. Delivery depends on agent state: sendSignal defaults to deliver during an active run and wake when idle; callers can override both paths. A thread is not the same as a continuously running agent.',
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
  'Return to the thesis and the same path. Watch the thread, steer it, keep state current, react to events, and route input across processes. One primitive lets an ongoing agent stay reachable.',
]
export default [Cover, AgentsChanged, InterfaceDidNot, NewPrimitive, Loop, Observe, ThreadStream, Send, Queue, DifferentInput, SystemContext, State, StateRefresh, Notifications, Providers, ProcessBoundary, Ownership, Close] satisfies Page[]
