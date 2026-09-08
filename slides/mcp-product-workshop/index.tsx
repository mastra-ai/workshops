import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';
import mastraWordmark from '@assets/Mastra wordmark white.png';
import daniel from './assets/daniel.png';
import alex from './assets/alex.png';

export const design: DesignSystem = {
  palette: { bg: '#07090b', text: '#f3f5f7', accent: '#7AFF78' },
  fonts: { display: '"Greed", "Inter", sans-serif', body: '"Greed", "Inter", sans-serif' },
  typeScale: { hero: 156, body: 36 },
  radius: 22,
};
const c = { bg: '#07090b', panel: '#10151a', line: '#33404a', text: '#f3f5f7', muted: '#a9b4be', green: '#7AFF78', blue: '#91bdff' };
const mono = '"Geist Mono", monospace';
const title = 'MCP is so back! Build Tools for the Agents Your Users Already Use';
const heading: CSSProperties = { fontSize: 94, lineHeight: 1.08, fontWeight: 520, letterSpacing: '-0.025em', margin: 0 };

const Footer = ({ dark = false }: { dark?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  return <footer style={{ position: 'absolute', left: 112, right: 112, bottom: 42, display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: '0.08em', color: dark ? '#234422' : c.muted }}>
    <span>MASTRA WORKSHOP</span><span>{String(current).padStart(2, '0')} / {total}</span>
  </footer>;
};
const WorkshopBadge = () => <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, border: `2px solid ${c.line}`, borderRadius: 999, padding: '12px 22px', fontSize: 24, letterSpacing: '0.12em' }}><span style={{ width: 14, height: 14, border: `2px solid ${c.text}`, borderRadius: '50%' }} />WORKSHOP</div>;
const HostCard = ({ name, image }: { name: string; image: string }) => <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
  <img src={image} alt={name} style={{ width: 84, height: 84, borderRadius: 18, objectFit: 'cover', objectPosition: 'center 20%' }} />
  <div><div style={{ fontSize: 32 }}>{name}</div><div style={{ fontSize: 22, color: c.muted, marginTop: 6 }}>Mastra</div></div>
</div>;
const Canvas = ({ children, green = false }: { children: ReactNode; green?: boolean }) => <div className="mcp-workshop" style={{ width: '100%', height: '100%', position: 'relative', background: green ? c.green : c.bg, color: green ? c.bg : c.text, fontFamily: 'var(--osd-font-body)' }}>
  <style>{`.mcp-workshop * { box-sizing: border-box; } .mcp-workshop .mcp-enter { animation: mcp-reveal 350ms ease-out both; } @keyframes mcp-reveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @media (prefers-reduced-motion: reduce) { .mcp-workshop .mcp-enter { animation: none; } }`}</style>
  <main className="mcp-enter" style={{ position: 'absolute', inset: '96px 112px 128px' }}>{children}</main>
  <Footer dark={green} />
</div>;
const Label = ({ children }: { children: ReactNode }) => <div style={{ fontFamily: mono, fontSize: 24, color: c.green, marginBottom: 30 }}>{children}</div>;
const Line = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => <p style={{ fontSize: 36, lineHeight: 1.4, color: c.muted, margin: '28px 0 0', ...style }}>{children}</p>;
const Wire = ({ label, reverse = false }: { label: string; reverse?: boolean }) => <div style={{ width: '100%' }}>
  <div style={{ textAlign: 'center', fontFamily: mono, color: reverse ? c.muted : c.green, fontSize: 25, marginBottom: 18 }}>{label}</div>
  <svg width="100%" height="26" viewBox="0 0 600 26" preserveAspectRatio="none" aria-hidden="true"><path d={reverse ? 'M598 13 H5 M20 2 L5 13 L20 24' : 'M2 13 H595 M580 2 L595 13 L580 24'} stroke={reverse ? c.muted : c.green} strokeWidth="2" fill="none" /></svg>
</div>;

const Cover: Page = () => <Canvas>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><img src={mastraWordmark} alt="Mastra" style={{ width: 250, height: 64, objectFit: 'contain' }} /><WorkshopBadge /></div>
  <div style={{ marginTop: 110 }}>
    <h1 style={{ ...heading, fontSize: 166 }}>MCP is <span style={{ color: c.green }}>so back!</span></h1>
    <p style={{ fontSize: 59, lineHeight: 1.2, margin: '32px 0 0', maxWidth: 1460 }}>Build Tools for the Agents<br />Your Users Already Use</p>
  </div>
  <div style={{ position: 'absolute', bottom: 28, display: 'flex', gap: 110 }}><HostCard name="Daniel Lew" image={daniel} /><HostCard name="Alex Booker" image={alex} /></div>
</Canvas>;

const Coworkers: Page = () => <Canvas>
  <Label>The user’s side of the conversation</Label>
  <div style={{ fontSize: 200, lineHeight: 1, color: c.green, height: 142 }}>“</div>
  <h1 style={{ ...heading, fontSize: 112, maxWidth: 1470 }}>Can I use the assistant<br />I already know?</h1>
  <div style={{ marginTop: 88, paddingLeft: 34, borderLeft: `4px solid ${c.green}` }}>
    <div style={{ fontSize: 40 }}>Agents are like coworkers.</div>
    <Line style={{ marginTop: 12 }}>You have to learn how each one works.</Line>
  </div>
</Canvas>;

const Both: Page = () => <Canvas>
  <h1 style={{ ...heading, fontSize: 88 }}>Can their agent already use your CLI?</h1>
  <div style={{ display: 'flex', marginTop: 78, gap: 80 }}>
    <section style={{ width: 808, paddingRight: 60, borderRight: `1px solid ${c.line}` }}>
      <div style={{ fontSize: 108, color: c.blue }}>CLI</div>
      <Line>Install it. Read help. Pipe results.</Line>
      <div style={{ fontFamily: mono, fontSize: 34, padding: '36px 0', marginTop: 38, color: c.blue }}>$ returns get ORD-001</div>
    </section>
    <section style={{ flex: 1 }}>
      <div style={{ fontSize: 108, color: c.green }}>MCP</div>
      <Line>Connect. Authorize. Discover tools.</Line>
      <div style={{ fontFamily: mono, fontSize: 34, padding: '36px 0', marginTop: 38, color: c.green }}>tools/list → tools/call</div>
    </section>
  </div>
  <div style={{ position: 'absolute', bottom: 25, fontSize: 34, color: c.muted }}>Choose for the host and access you actually have. Both can fit.</div>
</Canvas>;

const Interaction: Page = () => <Canvas>
  <Label>2026-07-28 · interaction without a session</Label>
  <h1 style={heading}>What if it needs an answer?</h1>
  <div style={{ display: 'flex', gap: 88, marginTop: 76 }}>
    <section style={{ width: 990 }}>
      <div style={{ fontSize: 42 }}>Confirm a high-value return</div>
      <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '25px 22px', marginTop: 36, fontSize: 34 }}>
        <span style={{ color: c.green }}>→</span><span>Request the return</span>
        <span style={{ color: c.green }}>←</span><span>Needs input: “Confirm?”</span>
        <span style={{ color: c.green }}>→</span><span>Retry with the answer</span>
        <span style={{ color: c.green }}>←</span><span>Return created</span>
      </div>
      <div style={{ fontFamily: mono, fontSize: 25, color: c.green, marginTop: 38 }}>input_required → complete</div>
    </section>
    <section style={{ flex: 1, borderLeft: `1px solid ${c.line}`, paddingLeft: 52 }}>
      <div style={{ fontSize: 42 }}>Keep listening for changes</div>
      <div style={{ fontFamily: mono, fontSize: 29, color: c.blue, marginTop: 42 }}>subscriptions/listen</div>
      <Line style={{ fontSize: 32 }}>One opted-in stream.<br />“The return policy changed.”</Line>
    </section>
  </div>
  <Line style={{ fontSize: 29, position: 'absolute', bottom: 12 }}>Progress belongs to its request. Change notifications use the subscription.</Line>
</Canvas>;

const Boundary: Page = () => <Canvas>
  <Label>Where MCP fits</Label>
  <h1 style={heading}>Their agent. Your application.</h1>
  <div style={{ position: 'relative', marginTop: 88, height: 410 }}>
    <div style={{ position: 'absolute', left: 0, top: 86, width: 360 }}><div style={{ fontSize: 56 }}>Their host</div><Line style={{ fontSize: 30 }}>Chooses what to call</Line><div style={{ fontSize: 25, color: c.muted, marginTop: 32 }}>ChatGPT · Claude · Cursor</div></div>
    <div style={{ position: 'absolute', right: 0, top: 86, width: 390 }}><div style={{ fontSize: 56 }}>Your app</div><Line style={{ fontSize: 30 }}>Checks what’s allowed</Line><div style={{ fontSize: 25, color: c.muted, marginTop: 32 }}>Orders · policies · returns</div></div>
    <div style={{ position: 'absolute', left: 780, top: 0, height: 370, borderLeft: `2px dashed ${c.line}` }} />
    <div style={{ position: 'absolute', left: 728, top: 0, padding: '8px 20px', background: c.bg, fontFamily: mono, color: c.green, fontSize: 30 }}>MCP</div>
    <div style={{ position: 'absolute', left: 390, right: 430, top: 106 }}><Wire label={'getOrder("ORD-001")'} /><div style={{ marginTop: 55 }}><Wire label="order details" reverse /></div></div>
  </div>
  <Line style={{ marginTop: 26, fontSize: 32 }}>A configured, authorized connection—not automatic access from every assistant.</Line>
</Canvas>;

const Shared: Page = () => <Canvas>
  <h1 style={{ ...heading, maxWidth: 1120 }}>Don’t write the return<br />logic four times.</h1>
  <div style={{ position: 'relative', height: 410, marginTop: 62 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>{['REST', 'CLI', 'Your agent', 'MCP'].map((label, i) => <div key={label} style={{ width: 330, padding: '23px 0', borderBottom: `2px solid ${i === 3 ? c.green : c.line}`, fontSize: 43, color: i === 3 ? c.green : c.text }}>{label}</div>)}</div>
    <svg viewBox="0 0 1696 200" width="1696" height="200" aria-hidden="true" style={{ display: 'block' }}><path d="M165 0 V80 H1531 V0 M620 0 V80 M1075 0 V80 M848 80 V180 M836 168 L848 180 L860 168" stroke={c.line} strokeWidth="3" fill="none" /></svg>
    <div style={{ position: 'absolute', top: 262, left: 310, right: 310, padding: '32px 48px', textAlign: 'center', background: c.panel, border: `1px solid ${c.green}`, borderRadius: 18, fontFamily: mono, fontSize: 44 }}>ReturnsService</div>
  </div>
  <Line style={{ textAlign: 'center', fontSize: 32 }}>Same rules, whichever way the request arrives.</Line>
</Canvas>;

const Primitives: Page = () => <Canvas>
  <Label>The pieces you expose</Label>
  <h1 style={heading}>An action. A document. A prompt.</h1>
  <div style={{ marginTop: 70 }}>
    {[
      ['Tool', 'createReturn(…)', 'Model-selected', c.green],
      ['Resource', 'returns://policies/current', 'App-managed', c.blue],
      ['Prompt', 'draft-customer-reply', 'User-invoked', c.text],
    ].map(([kind, example, meaning, color]) => <div key={kind} style={{ display: 'flex', alignItems: 'center', padding: '32px 0', borderTop: `1px solid ${c.line}` }}>
      <div style={{ width: 260, fontSize: 38, color }}>{kind}</div><div style={{ width: 1000, fontFamily: mono, fontSize: 36 }}>{example}</div><div style={{ fontSize: 28, color: c.muted }}>{meaning}</div>
    </div>)}
  </div>
  <div style={{ marginTop: 54, display: 'flex', alignItems: 'center', gap: 34 }}><div style={{ fontSize: 32 }}>A tool can run a workflow:</div><div style={{ fontFamily: mono, fontSize: 30, color: c.green }}>eligibility → draft → completion</div></div>
</Canvas>;

const Contracts: Page = () => <Canvas>
  <div style={{ display: 'flex', height: '100%', gap: 85 }}>
    <div style={{ width: 575, paddingTop: 70 }}><Label>Tool design</Label><h1 style={{ ...heading, fontSize: 99 }}>A return.<br />Not an API<br />puzzle.</h1><Line style={{ fontSize: 34 }}>What it needs.<br />What it changes.<br />What comes back.</Line></div>
    <div style={{ flex: 1, paddingTop: 40 }}>
      <div style={{ fontFamily: mono, color: c.muted, fontSize: 29, padding: '25px 0' }}>callApi({`{ method, path, body }`})</div>
      <div style={{ color: c.green, fontSize: 65, margin: '12px 0' }}>↓</div>
      <pre style={{ margin: 0, padding: 42, background: c.panel, borderLeft: `4px solid ${c.green}`, fontFamily: mono, color: c.text, fontSize: 37, lineHeight: 1.7 }}>{'createReturn({\n  orderId,\n  reason,\n  idempotencyKey\n})'}</pre>
    </div>
  </div>
</Canvas>;

const Modern: Page = () => <Canvas>
  <Label>Stateless Streamable HTTP</Label>
  <h1 style={heading}>Each request brings what it needs.</h1>
  <div style={{ display: 'flex', marginTop: 80, gap: 88 }}>
    <section style={{ width: 780 }}><div style={{ fontSize: 30, color: c.muted }}>OUR LEGACY SERVER</div><div style={{ fontSize: 46, marginTop: 20 }}>A session between calls</div>
      <svg viewBox="0 0 780 230" width="780" height="230" role="img" aria-label="Legacy: initialize a session, then make two calls using its session ID"><path d="M55 116 H725" stroke={c.muted} strokeWidth="3" fill="none" />{[70, 390, 710].map((x, i) => <g key={x}><circle cx={x} cy={116} r={14} fill={c.bg} stroke={c.muted} strokeWidth={3} /><text x={x} y={78} textAnchor="middle" fontFamily={mono} fontSize={26} fill={c.text}>{i === 0 ? 'init' : 'call'}</text></g>)}<text x="390" y="186" textAnchor="middle" fontFamily={mono} fontSize="25" fill={c.muted}>same session ID</text></svg>
    </section>
    <section style={{ flex: 1 }}><div style={{ fontSize: 30, color: c.green }}>MASTRA v2 · 2026-07-28</div><div style={{ fontSize: 46, marginTop: 20 }}>No initialize. No session ID.</div>
      <svg viewBox="0 0 780 230" width="780" height="230" role="img" aria-label="Modern: two independent call and response exchanges without a transport session ID">{[0, 1].map(i => <g key={i}><path d={`M50 ${66 + i * 100} H725 m-14 -10 l14 10 -14 10`} stroke={c.green} strokeWidth="3" fill="none" /><text x="388" y={48 + i * 100} textAnchor="middle" fontFamily={mono} fontSize="26" fill={c.text}>request → response</text></g>)}</svg>
    </section>
  </div>
  <Line style={{ fontSize: 30, marginTop: 24 }}>Version + client capabilities travel with the request.</Line>
  <Line style={{ fontSize: 25, marginTop: 18 }}>2026 support was opt-in. Our Mastra v2 build makes it the default.</Line>
</Canvas>;

const Safety: Page = () => <Canvas>
  <Label>Your application’s job</Label>
  <h1 style={{ ...heading, maxWidth: 1450 }}>The response was lost.<br />Was the return created?</h1>
  <div style={{ display: 'flex', alignItems: 'center', marginTop: 104, gap: 38 }}>
    {['Authorize', 'Confirm', 'Write once'].map((label, i) => <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 38 }}><div><div style={{ fontFamily: mono, fontSize: 28, color: c.green, marginBottom: 20 }}>0{i + 1}</div><div style={{ fontSize: 64 }}>{label}</div></div>{i < 2 && <span style={{ fontSize: 48, color: c.line, padding: '40px 30px 0' }}>→</span>}</div>)}
  </div>
  <Line style={{ marginTop: 90, fontSize: 32 }}>New request ID. Same business idempotency key.</Line>
</Canvas>;

const ReturnsDesk: Page = () => <Canvas>
  <div style={{ display: 'flex', gap: 110, alignItems: 'center', height: '100%' }}>
    <div style={{ width: 860 }}><Label>One request to build around</Label><h1 style={{ ...heading, fontSize: 112 }}>“Can I return<br />this order?”</h1><Line style={{ fontSize: 38 }}>Returns Desk already has the rules.<br />The assistant needs access.</Line><div style={{ marginTop: 60, fontFamily: mono, fontSize: 28, color: c.green }}>Find order → check policy → create return</div></div>
    <div style={{ flex: 1, padding: '52px 48px', borderRadius: 6, background: '#ecede5', color: '#182019', transform: 'rotate(2deg)' }}>
      <div style={{ fontFamily: mono, fontSize: 23, letterSpacing: '0.1em' }}>LOCAL FIXTURE / ORDER</div>
      <div style={{ fontSize: 64, marginTop: 40 }}>ORD-001</div>
      <div style={{ marginTop: 32, borderTop: '2px dashed #8b9389', paddingTop: 30, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 30 }}><span>Total</span><span>$49.00</span></div>
      <div style={{ marginTop: 32, fontSize: 30 }}>Purchased 5 days ago</div>
      <div style={{ marginTop: 60, borderTop: '2px dashed #8b9389', paddingTop: 30, fontSize: 27 }}>One return, even after a retry.</div>
    </div>
  </div>
</Canvas>;

const Demo: Page = () => <Canvas green>
  <div style={{ fontFamily: mono, fontSize: 26, marginTop: 22 }}>RETURNS DESK / LIVE BUILD</div>
  <h1 style={{ ...heading, fontSize: 212, lineHeight: 0.98, marginTop: 124 }}>Let’s<br />build it.</h1>
  <div style={{ position: 'absolute', right: 60, top: 270, fontSize: 260, fontWeight: 300 }} aria-hidden="true">↗</div>
  <p style={{ fontSize: 42, marginTop: 64 }}>One application. Your assistant.</p>
</Canvas>;

const Questions: Page = () => <Canvas>
  <Label>Questions</Label>
  <h1 style={{ ...heading, fontSize: 120, maxWidth: 1450, marginTop: 122 }}>What should your users<br />be able to ask for?</h1>
  <div style={{ marginTop: 112, height: 4, width: 180, background: c.green }} />
  <Line>Daniel Lew & Alex Booker</Line>
</Canvas>;

export const notes: (string | undefined)[] = [
  'Introduce Daniel Lew and Alex Booker. The promise is one useful product capability in an existing assistant, not another assistant to adopt. The title is our event hook, not a measured resurgence claim. 25 minutes of setup, 60 of continuous demonstration, five for questions. No model key required for the deterministic path.',
  'This is an illustrative question, not a testimonial. Daniel’s analogy: agents are like coworkers; you learn their habits and quirks. Some users will prefer their familiar host; others will prefer a product-owned experience. Validate that preference rather than treating it as universal. Bridge: what would it take for that assistant to handle an actual return?',
  'Introduce Returns Desk NOW, before the protocol. ORD-001 is a real local fixture: $49, purchased five days ago. This receipt is a diagram, not a commerce screenshot. The task is to find the order, check eligibility and create one return. Start with a normal order, later use ORD-002 for confirmation and replay. Our demo creates a return record, not a real payment-provider refund. Existing business rules stay in the application. Processes share code but have independent in-memory state; restart resets it.',
  'Run a short decision lab around the same return task: (1) support engineer with a provisioned shell and scoped credentials: CLI/API is a strong starting point; (2) customer in a compatible host without that shell: MCP is a candidate; (3) you own UX and reasoning: embedded agent; (4) deterministic app-to-app integration: direct API. Change one assumption and ask again; both is valid. CLI can call remote APIs and MCP can run locally. Steelman composition and on-demand help: https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp . His measurements are setup-specific. Anthropic and Cloudflare apply code execution over MCP: https://www.anthropic.com/engineering/code-execution-with-mcp and https://blog.cloudflare.com/code-mode . Context strategy is not dictated by protocol. Do not add code mode to this six-tool workshop or claim universal token savings. The command is schematic; use the actual README CLI invocation in the demo.',
  'Walk getOrder and the response across the boundary. The host coordinates model, consent and clients; our server checks identity and business access on every call. Labels are schematic, not JSON-RPC. Architecture: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture . Real integration example: Notion documents host-specific setup, OAuth and workspace permissions, plus an interactive-authorization limitation: https://developers.notion.com/guides/mcp/get-started-with-mcp . That demonstrates the integration pattern, NOT adoption of the July 2026 wire revision. The named hosts are possible destinations, not a tested compatibility matrix. Check transport, protocol revision, auth and elicitation support separately. An MCP server is not automatically available to every assistant.',
  'Reuse ReturnsService from REST, CLI, the optional embedded agent and MCP. This is our design recommendation, not a protocol requirement. The live surfaces demo shares business code, not a database. Ask where authorization, eligibility and idempotency would drift if each adapter reimplemented them. Bridge: shared code is necessary, but the model still needs an understandable interface.',
  'Anthropic recommends clear task-oriented tools, bounded outputs and real-task evaluations: https://www.anthropic.com/engineering/writing-tools-for-agents . Ask what API knowledge callApi requires that createReturn removes. Explain required identifiers, effects, authorization scope and actionable failure meanings in the live contract. Neither snippet is a full invocation. Do not turn every API endpoint into a tool by default. Real example: GitHub added per-tool configuration so two useful tools did not require loading 27: https://github.blog/changelog/2025-12-10-the-github-mcp-server-adds-support-for-tool-specific-configuration-and-more . That is a specific catalog design problem, not proof that MCP is intrinsically bloated. Generic search/execute can be appropriate with discovery and enforced permissions. Our tests prove contracts, not model task success rates.',
  'Now name the primitives using the return task: createReturn is a tool, policy is a resource, reply drafting can be a prompt. Tools may also be reads. Model-selected, app-managed and user-invoked describe the intended control model, not mandatory UI. Source: https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts . Workflow-backed tools remain tools; Mastra supplies the application workflow, not a fourth MCP primitive. Bridge: we know what to expose; what does running this over the network involve?',
  '2026-07-28 removes initialize/initialized and Mcp-Session-Id. Requests MUST carry protocolVersion and clientCapabilities in _meta; clientInfo and result serverInfo SHOULD identify the parties. Catalogs cannot vary by connection; this does not make private data public. Explicit server-minted handles can represent cross-call application state, subject to authorization. Servers MUST implement server/discover; clients MAY call it, including for stdio compatibility probing. Mismatches yield UnsupportedProtocolVersionError. Source: https://modelcontextprotocol.io/specification/2026-07-28/changelog . This removes protocol-session affinity, not database coordination or all state. Left diagram is OUR sessionful legacy server; older HTTP sessions were not universally mandatory. Mastra opt-in support predates v2: https://github.com/mastra-ai/mastra/pull/20929 and https://github.com/mastra-ai/mastra/pull/20931 . v2 here is an unmerged local build. HTTP proof is pinned; stdio auto shows discovery. See docs/research.md for the complete change-to-proof map.',
  'Two different jobs, not one notification channel. MRTR returns resultType input_required with inputRequests; the client gathers input and retries the original operation with inputResponses. Ordinary results have resultType complete; an earlier-version result without it is treated as complete. The left is a schematic accepted high-value path, not a count of every demo branch. subscriptions/listen is a long-lived POST response for opted-in change types, acknowledged and tagged with subscriptionId. We broadcast only a non-sensitive public policy update; subscribing to an order URI is not authorization. Request progress and logs stay on the originating request response. logging/setLevel is removed; logs require per-request logLevel, otherwise notifications/message MUST NOT be emitted. Source: https://modelcontextprotocol.io/specification/2026-07-28/changelog . SSE framing still carries streamed responses; deprecating the legacy HTTP+SSE transport does not mean removing all SSE. Tasks are a separate extension, outside this lab.',
  'Ask before answering: no response arrived, so can we safely create another return? The modern transport no longer resumes SSE events or redelivers them with Last-Event-ID. A broken response requires a new request ID; that is NOT the business idempotency key. Keep the same operation key, enforce it durably and reauthorize; a request ID is not an exactly-once guarantee. Source: https://modelcontextprotocol.io/specification/2026-07-28/changelog . Our replay/concurrency drills prove one in-memory return; they do not simulate a dropped post-commit response or a multi-instance database. Treat the lost-response scenario as a design discussion, not an executed fault test. Separate host consent, server authorization and high-value confirmation. Protected public deployment needs HTTPS, appropriate OAuth and tenant checks; local bearer fixtures are only a boundary exercise. No token passthrough: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations . Schemas do not prevent prompt injection. Cancellation cannot undo a committed transaction. Bridge: demonstrate the happy path, then challenge it.',
  'Leave the slides for one continuous demo. Every chapter answers the same return request: existing service, independent discovery, workflow, high-value confirmation/update delivery and failure drills. Raw transcripts are the protocol evidence, not Studio. Show scalar/trace as short additional observations rather than separate product stories. Drop optional prompt and live Cursor mutation first if time is short. Keep modern wire proof and production failures. Host login and compatibility remain explicit human gates.',
  'Optional closing after the full demo. Ask participants for one concrete product operation and one failure they must handle. No more feature checklist. Leave five minutes for questions.',
];
export const meta: SlideMeta = { title, theme: 'mastra', createdAt: '2026-09-08T20:13:50.713Z' };
export default [Cover, Coworkers, ReturnsDesk, Both, Boundary, Shared, Contracts, Primitives, Modern, Interaction, Safety, Demo, Questions] satisfies Page[];
