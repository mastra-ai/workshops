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
  <h1 style={{ ...heading, fontSize: 88 }}>You don’t have to pick a side.</h1>
  <div style={{ display: 'flex', marginTop: 78, gap: 80 }}>
    <section style={{ width: 808, paddingRight: 60, borderRight: `1px solid ${c.line}` }}>
      <div style={{ fontSize: 108, color: c.blue }}>CLI</div>
      <Line>For people who want commands.</Line>
      <div style={{ fontFamily: mono, fontSize: 34, padding: '36px 0', marginTop: 38, color: c.blue }}>$ returns get ORD-001</div>
    </section>
    <section style={{ flex: 1 }}>
      <div style={{ fontSize: 108, color: c.green }}>MCP</div>
      <Line>For agents that need your product.</Line>
      <div style={{ fontSize: 42, lineHeight: 1.25, padding: '36px 0', marginTop: 38 }}>“Can this order be returned?”</div>
    </section>
  </div>
  <div style={{ position: 'absolute', bottom: 25, fontSize: 34, color: c.muted }}>Same business logic. Different ways in.</div>
</Canvas>;

const Decision: Page = () => <Canvas>
  <Label>Start with who’s using it</Label>
  <h1 style={heading}>Who is this for?</h1>
  <div style={{ marginTop: 68 }}>
    {[
      ['Your support engineers', 'CLI', c.blue],
      ['Customers in their own assistant', 'MCP', c.green],
      ['Customers inside your product', 'Embedded agent', c.text],
      ['Another application', 'API', c.text],
    ].map(([user, choice, color]) => <div key={choice} style={{ display: 'flex', alignItems: 'center', borderTop: `1px solid ${c.line}`, padding: '27px 0', gap: 38 }}>
      <div style={{ fontSize: 40, width: 1020 }}>{user}</div><span style={{ color: c.muted, fontSize: 36 }}>→</span><div style={{ fontSize: 40, color }}>{choice}</div>
    </div>)}
  </div>
  <Line style={{ fontSize: 30 }}>More than one answer is fine.</Line>
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
  <Line style={{ marginTop: 26 }}>Your application still makes the authorization decision.</Line>
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
      ['Tool', 'createReturn(…)', 'Do something', c.green],
      ['Resource', 'returns://policies/current', 'Read something', c.blue],
      ['Prompt', 'draft-customer-reply', 'Prepare instructions', c.text],
    ].map(([kind, example, meaning, color]) => <div key={kind} style={{ display: 'flex', alignItems: 'center', padding: '32px 0', borderTop: `1px solid ${c.line}` }}>
      <div style={{ width: 260, fontSize: 38, color }}>{kind}</div><div style={{ width: 1000, fontFamily: mono, fontSize: 36 }}>{example}</div><div style={{ fontSize: 28, color: c.muted }}>{meaning}</div>
    </div>)}
  </div>
  <div style={{ marginTop: 54, display: 'flex', alignItems: 'center', gap: 34 }}><div style={{ fontSize: 32 }}>A tool can run a workflow:</div><div style={{ fontFamily: mono, fontSize: 30, color: c.green }}>eligibility → draft → completion</div></div>
</Canvas>;

const Contracts: Page = () => <Canvas>
  <div style={{ display: 'flex', height: '100%', gap: 85 }}>
    <div style={{ width: 575, paddingTop: 70 }}><Label>Tool design</Label><h1 style={{ ...heading, fontSize: 99 }}>Make the<br />action<br />obvious.</h1><Line style={{ fontSize: 34 }}>Name the job,<br />not the HTTP request.</Line></div>
    <div style={{ flex: 1, paddingTop: 40 }}>
      <div style={{ fontFamily: mono, color: c.muted, fontSize: 29, padding: '25px 0' }}>callApi({`{ method, path, body }`})</div>
      <div style={{ color: c.green, fontSize: 65, margin: '12px 0' }}>↓</div>
      <pre style={{ margin: 0, padding: 42, background: c.panel, borderLeft: `4px solid ${c.green}`, fontFamily: mono, color: c.text, fontSize: 37, lineHeight: 1.7 }}>{'createReturn({\n  orderId,\n  reason,\n  idempotencyKey\n})'}</pre>
    </div>
  </div>
</Canvas>;

const Modern: Page = () => <Canvas>
  <Label>Stateless Streamable HTTP</Label>
  <h1 style={heading}>No transport session to keep alive.</h1>
  <div style={{ display: 'flex', marginTop: 80, gap: 88 }}>
    <section style={{ width: 780 }}><div style={{ fontSize: 30, color: c.muted }}>EXPLICIT LEGACY</div><div style={{ fontSize: 46, marginTop: 20 }}>A session between calls</div>
      <svg viewBox="0 0 780 230" width="780" height="230" role="img" aria-label="Legacy: initialize a session, then make two calls using its session ID"><path d="M55 116 H725" stroke={c.muted} strokeWidth="3" fill="none" />{[70, 390, 710].map((x, i) => <g key={x}><circle cx={x} cy={116} r={14} fill={c.bg} stroke={c.muted} strokeWidth={3} /><text x={x} y={78} textAnchor="middle" fontFamily={mono} fontSize={26} fill={c.text}>{i === 0 ? 'init' : 'call'}</text></g>)}<text x="390" y="186" textAnchor="middle" fontFamily={mono} fontSize="25" fill={c.muted}>same session ID</text></svg>
    </section>
    <section style={{ flex: 1 }}><div style={{ fontSize: 30, color: c.green }}>MODERN DEFAULT · v2</div><div style={{ fontSize: 46, marginTop: 20 }}>Each request stands alone</div>
      <svg viewBox="0 0 780 230" width="780" height="230" role="img" aria-label="Modern: two independent call and response exchanges without a transport session ID">{[0, 1].map(i => <g key={i}><path d={`M50 ${66 + i * 100} H725 m-14 -10 l14 10 -14 10`} stroke={c.green} strokeWidth="3" fill="none" /><text x="388" y={48 + i * 100} textAnchor="middle" fontFamily={mono} fontSize="26" fill={c.text}>request → response</text></g>)}</svg>
    </section>
  </div>
  <Line style={{ fontSize: 32, marginTop: 44 }}>Available before v2 as opt-in. Now the default.</Line>
</Canvas>;

const Safety: Page = () => <Canvas>
  <Label>Your application’s job</Label>
  <h1 style={{ ...heading, maxWidth: 1350 }}>A tool call isn’t permission<br />to issue a refund.</h1>
  <div style={{ display: 'flex', alignItems: 'center', marginTop: 104, gap: 38 }}>
    {['Authorize', 'Confirm', 'Write once'].map((label, i) => <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 38 }}><div><div style={{ fontFamily: mono, fontSize: 28, color: c.green, marginBottom: 20 }}>0{i + 1}</div><div style={{ fontSize: 64 }}>{label}</div></div>{i < 2 && <span style={{ fontSize: 48, color: c.line, padding: '40px 30px 0' }}>→</span>}</div>)}
  </div>
  <Line style={{ marginTop: 90, fontSize: 32 }}>Local token in this lab. Production: HTTPS + OAuth + tenant authorization.</Line>
</Canvas>;

const ReturnsDesk: Page = () => <Canvas>
  <div style={{ display: 'flex', gap: 110, alignItems: 'center', height: '100%' }}>
    <div style={{ width: 860 }}><Label>Today’s application</Label><h1 style={{ ...heading, fontSize: 134 }}>Returns<br />Desk</h1><Line style={{ fontSize: 40 }}>Let an assistant check an order<br />and start a return.</Line><div style={{ marginTop: 60, fontFamily: mono, fontSize: 28, color: c.green }}>MCP → ReturnsService → orders</div></div>
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
  'Welcome and introduce Daniel Lew and Alex Booker. The promise: wrap an existing application so customers can use it from the agents they already have. The core path needs no model key. Spend 25 minutes on this setup, then 60 minutes in one continuous demo and five on questions.',
  'The quotation is an illustrative customer question, not a testimonial. Use Daniel’s coworker analogy: every agent has habits, a learning curve, and quirks. Customers may prefer ChatGPT or Claude over learning another product-specific assistant. MCP is a way to meet them there.',
  'MCP is back in the conversation, but the CLI discussion was not wrong. CLIs suit engineers and scripts. Agents can also use CLIs when the deployment and permissions make sense. MCP adds a discoverable, typed boundary for external hosts. These are not exclusive choices.',
  'Ask the audience which interface they would ship. These are starting points, not rules: ask about technical skill, who owns the reasoning loop and authentication, local versus remote deployment, discovery, and side effects. An embedded agent fits when the product owns UX, model policy, and orchestration. Both is a valid answer.',
  'The host owns the reasoning loop and tool selection. MCP describes the calls and carries requests and responses. The application checks identity, tenant scope, and business permissions. Walk the outgoing getOrder request and the returning data. The labels are schematic, not a complete wire transcript.',
  'Show how REST, CLI, the optional embedded agent, and MCP all call ReturnsService. An adapter does not duplicate eligibility or idempotency rules. In the live demo, compare the surfaces before inspecting the MCP registration.',
  'Tools perform operations, resources expose readable context, and prompts provide reusable instructions rather than execute a mutation. A workflow-backed tool can coordinate eligibility, draft, and completion. The demo shows both the generated workflow tool and a narrow wrapper with live log/progress events.',
  'Contrast the test-only callApi contract with createReturn. Beyond the name, explain required identifiers, when to use the tool, side effects, authorization scope, errors, and output schemas. Show the actual descriptions and schemas during discovery. Neither code snippet here is a complete invocation.',
  'The diagram compares this workshop’s explicit 2025-11-25 sessionful server with modern 2026-07-28 HTTP. Stateless transport does not mean stateless business data or that streams cannot stay open. Modern behavior was supported before v2 as opt-in; v2 changes the default. Tools, resources, prompts, workflows, and Streamable HTTP itself predate v2. MRTR elicitation and subscriptions/listen are shown live. Keep cache hints, trace metadata, CIMD, and the exact novelty/scope table in FACILITATOR.md and RELEASE.md, not on screen.',
  'Authenticate the caller, authorize the tenant and operation, and confirm high-value returns before writing. Enforce idempotency for retries, keep replayed reads safe, propagate cancellation before commit, and redact internal failures. The local bearer token is a teaching boundary, not a production OAuth implementation. CIMD supplies client metadata; it does not replace authorization.',
  'This is a diagrammatic fixture card, not a screenshot of a commerce UI. ORD-001 is a $49 order purchased five days ago. Data is process-local; restart resets it. The same service is exposed by modern and explicit-legacy adapters. Subscriptions use only the non-sensitive public policy resource because URI membership does not authorize tenant data.',
  'Leave the slides now. Follow FACILITATOR.md: shared surfaces, discovery, workflow, modern wire proof, and failure drills. Show the real scalar structuredContent 80 and the failure summary with abortedWrites 0, concurrentRetries 12, committedWrites 1 in terminal output, not on this transition. Drop the optional prompt and Cursor mutation first if time is short; keep the wire and failure demos.',
  'Optional closing slide after the entire demo. Ask for one concrete capability participants could expose in their own application. Leave time for questions rather than repeating a checklist.',
];
export const meta: SlideMeta = { title, theme: 'mastra', createdAt: '2026-09-08T20:13:50.713Z' };
export default [Cover, Coworkers, Both, Decision, Boundary, Shared, Primitives, Contracts, Modern, Safety, ReturnsDesk, Demo, Questions] satisfies Page[];
