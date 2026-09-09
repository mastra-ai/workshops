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

const Choice: Page = () => <Canvas>
  <Label>01 / Choose the experience</Label>
  <h1 style={heading}>Build the assistant—or connect theirs?</h1>
  <div style={{ display: 'flex', gap: 90, marginTop: 88 }}>
    <section style={{ flex: 1, borderRight: `1px solid ${c.line}`, paddingRight: 60 }}>
      <div style={{ fontSize: 66, color: c.blue }}>Embedded agent</div>
      <Line>You provide the experience.</Line>
      <div style={{ marginTop: 58, fontSize: 38, lineHeight: 1.7 }}>Your interface<br />Your model and instructions<br />Your responsibility for its behavior</div>
    </section>
    <section style={{ flex: 1 }}>
      <div style={{ fontSize: 66, color: c.green }}>MCP server</div>
      <Line>Their assistant uses your product.</Line>
      <div style={{ marginTop: 58, fontSize: 38, lineHeight: 1.7 }}>Their familiar workspace<br />Your tools and data<br />Your rules for access and actions</div>
    </section>
  </div>
  <Line style={{ position: 'absolute', bottom: 0 }}>Start with where users want to work—not which technology you want to ship.</Line>
</Canvas>;

const Audience: Page = () => <Canvas>
  <Label>One possible answer: both</Label>
  <h1 style={heading}>Different users. Different ways in.</h1>
  <div style={{ marginTop: 78, display: 'flex', alignItems: 'center', gap: 70 }}>
    <div style={{ flex: 1 }}><div style={{ fontSize: 52, color: c.blue }}>Your support team</div><Line>A guided agent in your app</Line></div>
    <span style={{ fontSize: 88, color: c.green }}>+</span>
    <div style={{ flex: 1 }}><div style={{ fontSize: 52, color: c.green }}>Your customers</div><Line>Your product in their assistant</Line></div>
  </div>
  <div style={{ borderTop: `1px solid ${c.line}`, marginTop: 100, paddingTop: 44 }}>
    <div style={{ fontSize: 42 }}>What can your team support well?</div>
    <Line style={{ fontSize: 33 }}>Agent behavior and evaluations · Tool quality and client compatibility</Line>
  </div>
  <Line style={{ fontSize: 28, position: 'absolute', bottom: 0 }}>An example, not a rule. Ask your users; internal and external can switch places.</Line>
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
      <div style={{ fontSize: 48, color: c.green }}>Ask. Respond.<br />Continue.</div>
      <Line style={{ fontSize: 34 }}>No protocol session to keep alive while the user decides.</Line>
    </section>
  </div>
  <Line style={{ fontSize: 29, position: 'absolute', bottom: 12 }}>The application still verifies permission and confirmation before creating the return.</Line>
</Canvas>;

const Boundary: Page = () => <Canvas>
  <Label>03 / Connect to an existing agent</Label>
  <h1 style={heading}>Connect. Discover. Try a real task.</h1>
  <div style={{ position: 'relative', marginTop: 88, height: 410 }}>
    <div style={{ position: 'absolute', left: 0, top: 86, width: 360 }}><div style={{ fontSize: 56 }}>Their host</div><Line style={{ fontSize: 30 }}>Chooses what to call</Line><div style={{ fontSize: 25, color: c.muted, marginTop: 32 }}>ChatGPT · Claude · Cursor</div></div>
    <div style={{ position: 'absolute', right: 0, top: 86, width: 390 }}><div style={{ fontSize: 56 }}>Your app</div><Line style={{ fontSize: 30 }}>Checks what’s allowed</Line><div style={{ fontSize: 25, color: c.muted, marginTop: 32 }}>Orders · policies · returns</div></div>
    <div style={{ position: 'absolute', left: 780, top: 0, height: 370, borderLeft: `2px dashed ${c.line}` }} />
    <div style={{ position: 'absolute', left: 728, top: 0, padding: '8px 20px', background: c.bg, fontFamily: mono, color: c.green, fontSize: 30 }}>MCP</div>
    <div style={{ position: 'absolute', left: 390, right: 430, top: 106 }}><Wire label={'getOrder("ORD-001")'} /><div style={{ marginTop: 55 }}><Wire label="order details" reverse /></div></div>
  </div>
  <Line style={{ marginTop: 26, fontSize: 32 }}>Check connection + authorization. Then test tool choice, inputs and recovery.</Line>
</Canvas>;

const Shared: Page = () => <Canvas>
  <h1 style={{ ...heading, maxWidth: 1120 }}>Don’t write the return<br />logic four times.</h1>
  <div style={{ position: 'relative', height: 410, marginTop: 62 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>{['REST', 'CLI', 'Your agent', 'MCP'].map((label, i) => <div key={label} style={{ width: 330, padding: '23px 0', borderBottom: `2px solid ${i === 3 ? c.green : c.line}`, fontSize: 43, color: i === 3 ? c.green : c.text }}>{label}</div>)}</div>
    <svg viewBox="0 0 1696 200" width="1696" height="200" aria-hidden="true" style={{ display: 'block' }}><path d="M165 0 V80 H1531 V0 M620 0 V80 M1075 0 V80 M848 80 V180 M836 168 L848 180 L860 168" stroke={c.line} strokeWidth="3" fill="none" /></svg>
    <div style={{ position: 'absolute', top: 262, left: 310, right: 310, padding: '32px 48px', textAlign: 'center', background: c.panel, border: `1px solid ${c.green}`, borderRadius: 18, fontFamily: mono, fontSize: 44 }}>ReturnsService</div>
  </div>
  <Line style={{ textAlign: 'center', fontSize: 32 }}>Already working in a shell? A CLI may fit. Agents can use either.</Line>
  <Line style={{ textAlign: 'center', fontSize: 27 }}>CLI: installed commands + help + pipes. MCP: a compatible client + tool discovery.</Line>
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
    <div style={{ width: 575, paddingTop: 70 }}><Label>02 / Design tools agents can use</Label><h1 style={{ ...heading, fontSize: 90 }}>When to call it.<br />What to send.</h1><Line style={{ fontSize: 34 }}>Description: purpose + limits<br />Schema: names + valid values</Line><Line style={{ fontSize: 29 }}>Returns Desk example:<br />create a return for an order.</Line></div>
    <div style={{ flex: 1, paddingTop: 40 }}>
      <div style={{ fontFamily: mono, color: c.muted, fontSize: 29, padding: '25px 0' }}>callApi({`{ method, path, body }`})</div>
      <div style={{ color: c.green, fontSize: 65, margin: '12px 0' }}>↓</div>
      <div style={{ fontSize: 32, lineHeight: 1.4, marginBottom: 30 }}>Create a return for an eligible order.<br />Changes order state. Requires account access.</div>
      <pre style={{ margin: 0, padding: 34, background: c.panel, borderLeft: `4px solid ${c.green}`, fontFamily: mono, color: c.text, fontSize: 29, lineHeight: 1.65 }}>{'orderId: ORD- followed by 3 digits\nreason: damaged | wrong-item\n        | changed-mind\nidempotencyKey: 8–100 characters'}</pre>
      <Line style={{ fontSize: 25 }}>Contract excerpt—not a complete tool definition.</Line>
    </div>
  </div>
</Canvas>;

const Modern: Page = () => <Canvas>
  <Label>04 / Run it with less protocol bookkeeping</Label>
  <h1 style={heading}>Requests don’t need a session.</h1>
  <div style={{ display: 'flex', marginTop: 80, gap: 88 }}>
    <section style={{ width: 780 }}><div style={{ fontSize: 30, color: c.muted }}>OUR LEGACY SERVER</div><div style={{ fontSize: 46, marginTop: 20 }}>A session between calls</div>
      <svg viewBox="0 0 780 230" width="780" height="230" role="img" aria-label="Legacy: initialize a session, then make two calls using its session ID"><path d="M55 116 H725" stroke={c.muted} strokeWidth="3" fill="none" />{[70, 390, 710].map((x, i) => <g key={x}><circle cx={x} cy={116} r={14} fill={c.bg} stroke={c.muted} strokeWidth={3} /><text x={x} y={78} textAnchor="middle" fontFamily={mono} fontSize={26} fill={c.text}>{i === 0 ? 'init' : 'call'}</text></g>)}<text x="390" y="186" textAnchor="middle" fontFamily={mono} fontSize="25" fill={c.muted}>same session ID</text></svg>
    </section>
    <section style={{ flex: 1 }}><div style={{ fontSize: 30, color: c.green }}>MASTRA v2 · 2026-07-28</div><div style={{ fontSize: 46, marginTop: 20 }}>No initialize. No session ID.</div>
      <svg viewBox="0 0 780 230" width="780" height="230" role="img" aria-label="Modern: two independent call and response exchanges without a transport session ID">{[0, 1].map(i => <g key={i}><path d={`M50 ${66 + i * 100} H725 m-14 -10 l14 10 -14 10`} stroke={c.green} strokeWidth="3" fill="none" /><text x="388" y={48 + i * 100} textAnchor="middle" fontFamily={mono} fontSize="26" fill={c.text}>request → response</text></g>)}</svg>
    </section>
  </div>
  <Line style={{ fontSize: 32, marginTop: 24 }}>A simpler fit for serverless: no protocol session to route back to.</Line>
  <Line style={{ fontSize: 27, marginTop: 18 }}>Business state still needs storage. Streaming still has platform limits.</Line>
  <Line style={{ fontSize: 25, marginTop: 18 }}>2026 support was opt-in. Our Mastra v2 build makes it the default.</Line>
</Canvas>;

const Outcomes: Page = () => <Canvas>
  <Label>Outputs and errors</Label>
  <h1 style={heading}>Help the agent decide what to do next.</h1>
  <div style={{ display: 'flex', gap: 85, marginTop: 82 }}>
    <section style={{ flex: 1 }}>
      <div style={{ fontSize: 40, color: c.green }}>Success: say what happened</div>
      <pre style={{ fontFamily: mono, fontSize: 33, lineHeight: 1.6, padding: 32, background: c.panel }}>{'id: "RET-001"\nstatus: "created"\nrefundCents: 4900'}</pre>
      <Line style={{ fontSize: 32 }}>Report the result—not just “OK”.</Line>
    </section>
    <section style={{ flex: 1 }}>
      <div style={{ fontSize: 40, color: c.blue }}>Failure: make the next step clear</div>
      <div style={{ marginTop: 42, fontFamily: mono, fontSize: 28, color: c.blue }}>INVALID_INPUT</div>
      <Line style={{ fontSize: 32 }}>“Use an order identifier such as ORD-001.”</Line>
      <div style={{ marginTop: 40, fontSize: 32 }}>Correct the input—not a blind retry.</div>
    </section>
  </div>
  <Line style={{ fontSize: 27, position: 'absolute', bottom: 0 }}>Domain-result excerpts. Test selection, task completion and recovery in the intended host.</Line>
</Canvas>;

const Demo: Page = () => <Canvas green>
  <div style={{ fontFamily: mono, fontSize: 26, marginTop: 22 }}>RETURNS DESK / LIVE BUILD</div>
  <h1 style={{ ...heading, fontSize: 212, lineHeight: 0.98, marginTop: 124 }}>Let’s<br />build it.</h1>
  <div style={{ position: 'absolute', right: 60, top: 270, fontSize: 260, fontWeight: 300 }} aria-hidden="true">↗</div>
  <p style={{ fontSize: 42, marginTop: 64 }}>“Can I return this order?” — from an existing agent.</p>
</Canvas>;

const Questions: Page = () => <Canvas>
  <Label>Questions</Label>
  <h1 style={{ ...heading, fontSize: 120, maxWidth: 1450, marginTop: 122 }}>What should your users<br />be able to ask for?</h1>
  <div style={{ marginTop: 112, height: 4, width: 180, background: c.green }} />
  <Line>Daniel Lew & Alex Booker</Line>
</Canvas>;

export const notes: (string | undefined)[] = [
  "Introduce Daniel Lew and Alex Booker. Four promises: choose embedded agent versus MCP; design descriptions, schemas, outputs and errors; expose tools/workflows/resources and connect an existing agent; understand stateless deployment and interaction. Presentation 25 minutes, one continuous demo 60, questions five. MCP is so back is an event hook, not a measured adoption claim.",
  "Daniel’s coworker analogy is the reason to consider MCP: every agent has habits users must learn. A familiar assistant can reduce that learning burden. This is a product hypothesis and illustrative quote, not a universal preference or testimonial. Ask whether the audience’s users already have an assistant they trust.",
  "Compare who owns the experience, not which technology is superior. Embedded agent: your UI, instructions, model choices and evaluation responsibility. MCP: capabilities available to a configured external host; you still own authorization, tool quality and business behavior. A nontechnical user may prefer a guided embedded agent. MCP is not automatically easier to build or connect. Architecture grounding: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture .",
  "Daniel and Shane’s example: internal support uses a product-owned agent while customers connect their existing assistant. Present as a possible arrangement, not internal=technical or external=MCP. Reverse it: internal engineers may use Cursor; customers may need a guided app. Ask who users are, where they work, what access they have, and what the team can maintain. Agent evaluations and client compatibility are examples of differing work, not exclusive responsibilities. Both need security, support and testing.",
  "Both can reuse Mastra tools and the same domain service. REST is also appropriate for deterministic application integration. CLI is a relevant alternative when users or their agents have a provisioned shell, installed commands and credentials; help and pipes are useful. MCP fits compatible clients with discovery. CLI can reach remote systems; MCP can run locally. Neither is universally more token-efficient. Source: https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp . Code execution can also be used with MCP: https://www.anthropic.com/engineering/code-execution-with-mcp . Our surfaces share code, not a database: the demo uses per-process memory.",
  "Introduce Returns Desk as the worked example, not the workshop thesis. Description: when to use createReturn, when not to, effects, account scope and high-value confirmation. Inputs: names, order-ID format, enumerated reasons, key length; show src/domain/schemas.ts in demo. The slide is a condensed contract, not literal registration code. Compare generic callApi without declaring it always wrong. Source: https://www.anthropic.com/engineering/writing-tools-for-agents . Tool lists should be useful rather than exhaustive: https://github.blog/changelog/2025-12-10-the-github-mcp-server-adds-support-for-tool-specific-configuration-and-more .",
  "Outputs should expose bounded, structured facts, units and identifiers for the next step. Success excerpt uses actual return fields: RET-001, created, refundCents 4900; this lab records a return, not a payment-provider refund. Error text is from ReturnsService: INVALID_INPUT, Use an order identifier such as ORD-001. Explain correct-input versus do-not-retry policy/permission failures versus transient failure. The transport may validate malformed input before this domain error; do not promise identical envelopes across REST and MCP. Ineligible creation currently reports INELIGIBLE/EXPIRED; use eligibility plus policy to explain the 30-day rule, and discuss improving terse errors rather than claiming the example already has ideal prose. Evaluate behavior in the intended host; schema tests alone do not prove model reliability. Source: https://www.anthropic.com/engineering/writing-tools-for-agents .",
  "Tools execute actions, including reads. Resources provide content. Prompts provide reusable instructions. Model-selected, app-managed and user-invoked describe intended control, not mandatory host UI. A Mastra workflow is exposed through a tool, not a fourth MCP primitive. Show eligibility, draft and completion, then read the resulting resource. Prompts are optional. Source: https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts .",
  "The host chooses calls; the server enforces account and business permissions. Configure endpoint and authorization, inspect the catalog, then ask a real task and inspect selected tools, arguments, outputs and recovery. Programmatic clients and Inspector prove connectivity/contracts, not model behavior. Signed-in Cursor remains a human check; named hosts are not a tested compatibility matrix. Verify protocol, transport, authentication and elicitation separately. Notion illustrates setup and permission concerns, not July revision adoption: https://developers.notion.com/guides/mcp/get-started-with-mcp .",
  "Explain deployment benefit before wire fields: removing protocol-session affinity makes independent requests easier to route to serverless instances. Version and capabilities travel with each request. Database state, credentials, idempotency and stream duration still need engineering. This is not a deployed serverless benchmark. Our legacy server is sessionful; older HTTP sessions were optional. Opt-in 2026 support predates the local v2 default: https://github.com/mastra-ai/mastra/pull/20929 and https://github.com/mastra-ai/mastra/pull/20931 . Source: https://modelcontextprotocol.io/specification/2026-07-28/changelog . The demo, not this slide, shows server/discover, request metadata and legacy comparison.",
  "Explain one interaction only: request a high-value return, receive a request for confirmation, collect the answer, resend the operation with it, complete. This MRTR exchange does not require keeping a protocol session alive while waiting. input_required carries inputRequests; the retry carries inputResponses; completion is complete. This schematic is not an exact count of demo elicitation rounds. The application must authorize, validate confirmation and prevent duplicate writes. subscriptions/listen is a separate opt-in change stream, demonstrated with a public policy update during the live demo, not part of this confirmation flow. Source: https://modelcontextprotocol.io/specification/2026-07-28/changelog .",
  "Leave the deck for the entire demo. Start from existing Returns Desk business operations; inspect and improve contracts; register tools/resources/workflow; connect independent client and intended host; inspect failure/recovery; prove modern deployment/interaction behavior. Keep the existing modern wire and production drills. Lost-response/idempotency is explained at retries, not as an opening slide. No model key for deterministic scripts; Cursor requires signed-in human approval. Do not imply a scripted SDK call is an agent choosing correctly.",
  "Optional closing after the continuous demo. Ask: which users, which experience, which useful capability, which failure should the agent handle? Keep five minutes for questions."
];
export const meta: SlideMeta = { title, theme: 'mastra', createdAt: '2026-09-08T20:13:50.713Z' };
export default [Cover, Coworkers, Choice, Audience, Shared, Contracts, Outcomes, Primitives, Boundary, Modern, Interaction, Demo, Questions] satisfies Page[];
