import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';
import mastraWordmark from '@assets/Mastra wordmark white.png';
import daniel from './assets/daniel.png';
import alex from './assets/alex.png';
import growthTweet from './assets/mcp-growth-tweet.png';
import sharedCapabilities from './assets/shared-capabilities.png';

export const design: DesignSystem = {
  palette: { bg: '#07090b', text: '#f3f5f7', accent: '#7AFF78' },
  fonts: { display: '"Greed", "Inter", sans-serif', body: '"Greed", "Inter", sans-serif' },
  typeScale: { hero: 156, body: 36 }, radius: 22,
};
const c = { bg: '#07090b', panel: '#10151a', line: '#33404a', text: '#f3f5f7', muted: '#a9b4be', green: '#7AFF78', blue: '#91bdff' };
const mono = '"Geist Mono", monospace';
const title = 'MCP is so back! Build Tools for the Agents Your Users Already Use';
const heading: CSSProperties = { fontSize: 110, lineHeight: 1.08, fontWeight: 520, letterSpacing: '-0.025em', margin: 0 };
const Footer = ({ dark = false }: { dark?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  return <footer style={{ position: 'absolute', left: 112, right: 112, bottom: 42, display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: '0.08em', color: dark ? '#234422' : c.muted }}><span>MASTRA WORKSHOP</span><span>{String(current).padStart(2, '0')} / {total}</span></footer>;
};
const Canvas = ({ children, green = false }: { children: ReactNode; green?: boolean }) => <div className="mcp-workshop" style={{ width: '100%', height: '100%', position: 'relative', background: green ? c.green : c.bg, color: green ? c.bg : c.text, fontFamily: 'var(--osd-font-body)' }}>
  <style>{`.mcp-workshop * { box-sizing: border-box; } .mcp-workshop .mcp-enter { animation: mcp-reveal 350ms ease-out both; } @keyframes mcp-reveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @media (prefers-reduced-motion: reduce) { .mcp-workshop .mcp-enter { animation: none; } }`}</style>
  <main className="mcp-enter" style={{ position: 'absolute', inset: '96px 112px 128px' }}>{children}</main><Footer dark={green} />
</div>;
const Label = ({ children }: { children: ReactNode }) => <div style={{ fontFamily: mono, fontSize: 25, color: c.green, marginBottom: 30 }}>{children}</div>;
const HostCard = ({ name, image }: { name: string; image: string }) => <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}><img src={image} alt={name} style={{ width: 84, height: 84, borderRadius: 18, objectFit: 'cover', objectPosition: 'center 20%' }} /><div><div style={{ fontSize: 32 }}>{name}</div><div style={{ fontSize: 22, color: c.muted, marginTop: 6 }}>Mastra</div></div></div>;

const Cover: Page = () => <Canvas>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><img src={mastraWordmark} alt="Mastra" style={{ width: 250, height: 64, objectFit: 'contain' }} /><div style={{ border: `2px solid ${c.line}`, borderRadius: 999, padding: '12px 22px', fontSize: 24, letterSpacing: '0.12em' }}>WORKSHOP</div></div>
  <div style={{ marginTop: 110 }}><h1 style={{ ...heading, fontSize: 166 }}>MCP is <span style={{ color: c.green }}>so back!</span></h1><p style={{ fontSize: 59, lineHeight: 1.2, margin: '32px 0 0' }}>Build Tools for the Agents<br />Your Users Already Use</p></div>
  <div style={{ position: 'absolute', bottom: 28, display: 'flex', gap: 110 }}><HostCard name="Daniel Lew" image={daniel} /><HostCard name="Alex Booker" image={alex} /></div>
</Canvas>;

const Definition: Page = () => <Canvas>
  <Label>Model Context Protocol</Label><h1 style={heading}>What is MCP?</h1>
  <div style={{ display: 'flex', alignItems: 'center', gap: 34, marginTop: 48 }}>
    <div style={{ width: 455, border: `2px solid ${c.blue}`, padding: 28, borderRadius: 20 }}><div style={{ fontSize: 37 }}>ChatGPT <span style={{ fontSize: 25, color: c.muted }}>· host</span></div><div style={{ fontSize: 29, color: c.muted, margin: '16px 0 22px' }}>“Can I return this order?”</div><div style={{ fontFamily: mono, fontSize: 29, color: c.blue, background: c.panel, padding: 18, borderRadius: 10 }}>MCP client</div></div>
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, color: c.muted }}>discover / call</div><div style={{ fontSize: 76, color: c.green }}>⇄</div><div style={{ fontSize: 24, color: c.muted }}>results</div></div>
    <div style={{ flex: 1, border: `2px solid ${c.green}`, padding: '38px 30px', borderRadius: 20 }}><div style={{ fontSize: 36 }}>MCP server</div><div style={{ fontFamily: mono, fontSize: 29, color: c.green, marginTop: 28 }}>new MCPServer({'{ … }'})</div></div>
    <div style={{ fontSize: 60, color: c.muted }}>⇄</div><div style={{ width: 245, fontSize: 36, lineHeight: 1.4 }}>Your app<br /><span style={{ fontSize: 27, color: c.muted }}>Rules + data</span></div>
  </div>
  <div style={{ marginTop: 45, fontFamily: mono, fontSize: 23, color: c.muted }}>INSIDE THE SERVER CONFIG</div>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 20 }}>{[
    ['Tools', 'Create a return', 'tools: { createReturn }'],
    ['Resources', 'Read the return policy', 'resources: {\n  listResources,\n  getResourceContent\n}'],
    ['Prompts', 'Draft a customer reply', 'prompts: {\n  listPrompts,\n  getPromptMessages\n}'],
  ].map(([name, example, syntax]) => <div key={name} style={{ borderTop: `2px solid ${c.line}`, paddingTop: 20 }}><div style={{ fontSize: 39, color: c.green }}>{name}</div><div style={{ fontSize: 29, color: c.muted, marginTop: 12 }}>{example}</div><pre style={{ fontSize: 26, fontFamily: mono, lineHeight: 1.4, margin: '20px 0 0' }}>{syntax}</pre></div>)}</div>
</Canvas>;

const NeverLeft: Page = () => <Canvas>
  <div style={{ display: 'flex', height: '100%', gap: 50, alignItems: 'center' }}><h1 style={{ ...heading, fontSize: 130, width: 650 }}>MCP<br />never left.</h1><img src={growthTweet} alt="Max Stoiber: MCP tool calls by ChatGPT users up 98× in 2026 so far; chart shows calls through OpenAI’s gateway" style={{ width: 980, height: 840, objectFit: 'contain' }} /></div>
</Canvas>;

const Timeline: Page = () => <Canvas>
  <h1 style={heading}>MCP timeline</h1>
  <div style={{ position: 'relative', marginTop: 140, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 61, height: 3, background: c.line }} />
    {[
      { date: '2024-11-05', event: 'Foundation', detail: 'Introduced the core protocol for connecting AI applications to tools, resources and prompts.', ours: false },
      { date: '2025-03-26', event: 'Remote servers', detail: 'Introduced Streamable HTTP, making MCP practical to run across networks and production infrastructure.', ours: false },
      { date: '2025-06-18', event: 'Richer interactions', detail: 'Added structured tool outputs and elicitation, allowing servers to return typed data and request user input.', ours: false },
      { date: '2025-11-25', event: 'Long-running workflows', detail: 'Added experimental tasks, tool-enabled sampling and improved authorization and elicitation.', ours: false },
      { date: '2026-07-28', event: 'Stateless MCP', detail: 'Removed protocol sessions and the initialization handshake. Each request now carries its own protocol context, making servers easier to scale and recover.', ours: false },
    ].map(({ date, event, detail, ours }) => <div key={date} style={{ position: 'relative' }}>
      <div style={{ fontFamily: mono, fontSize: 23, color: ours ? c.green : c.muted }}>{date}</div>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: ours ? c.green : c.blue, margin: '25px 0 35px', boxShadow: `0 0 0 7px ${c.bg}` }} />
      <div style={{ fontSize: 33, lineHeight: 1.2, color: ours ? c.green : c.text }}>{event}</div>
      <div style={{ fontSize: 27, color: c.muted, lineHeight: 1.4, marginTop: 22 }}>{detail}</div>
    </div>)}
  </div>
</Canvas>;

const Choice: Page = () => <Canvas>
  <h1 style={heading}>Why should you care?</h1>
  <div style={{ display: 'grid', gridTemplateColumns: '760px 1fr', gap: 90, marginTop: 45 }}>
    <div><div style={{ fontSize: 53, lineHeight: 1.15 }}>Your tools.<br /><span style={{ color: c.green }}>Their assistant.</span></div><img src={sharedCapabilities} alt="One product toolbox connects its capabilities to several different assistants" style={{ width: 760, height: 430, objectFit: 'cover', borderRadius: 20, marginTop: 22 }} /><div style={{ color: c.muted, fontSize: 28, marginTop: 20 }}>Own the assistant? Embed an agent.<br /><span style={{ color: c.green }}>You can offer both.</span></div></div>
    <div>{[
      ['Lower barrier to adoption', 'One less assistant for users to learn.'],
      ['Enterprise adoption', 'Meet teams in the assistants they already use.'],
      ['Less to maintain', 'Your capabilities—not another chat experience.'],
      ['“They blame their agent”', 'The host owns the reasoning. You own tool quality.'],
    ].map(([name, detail], i) => <div key={name} style={{ padding: '22px 0 28px', borderTop: `1px solid ${c.line}` }}><div style={{ fontSize: 37 }}><span style={{ color: c.green, fontFamily: mono, fontSize: 23, marginRight: 20 }}>0{i + 1}</span>{name}</div><div style={{ color: c.muted, fontSize: 29, lineHeight: 1.35, marginTop: 14 }}>{detail}</div></div>)}</div>
  </div>
</Canvas>;

const ShortDemo: Page = () => <Canvas green>
  <div style={{ fontFamily: mono, fontSize: 28 }}>SHORT DEMO</div><h1 style={{ ...heading, fontSize: 178, marginTop: 165 }}>Give ChatGPT<br />your tools.</h1>
</Canvas>;

const Changes: Page = () => <Canvas>
  <Label>Previous: 2025-11-25　→　Latest: 2026-07-28</Label><h1 style={{ ...heading, fontSize: 99 }}>What changed in the latest MCP spec?</h1>
  <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '35px 80px' }}>{[
    ['Stateless requests', 'Each request carries its protocol context.'],
    ['server/discover', 'Check supported versions and capabilities.'],
    ['Multi-round-trip requests', 'Ask for input, then continue in a follow-up call.'],
    ['subscriptions/listen', 'Listen for the updates you choose.'],
    ['Per-request logging', 'Choose the log level for this call.'],
    ['Schema, cache + auth', 'Richer results, cache hints and OAuth discovery.'],
  ].map(([name, detail]) => <div key={name} style={{ borderTop: `2px solid ${c.line}`, paddingTop: 22 }}><div style={{ fontSize: 39, color: c.green }}>{name}</div><div style={{ fontSize: 29, color: c.muted, lineHeight: 1.35, marginTop: 14 }}>{detail}</div></div>)}</div>
</Canvas>;

const Sessions: Page = () => <Canvas>
  <h1 style={heading}>Why remove sessions?</h1>
  <div style={{ display: 'flex', gap: 80, marginTop: 65 }}>
    {[false, true].map(modern => <section key={String(modern)} style={{ flex: 1 }}>
      <div style={{ fontSize: 40, color: modern ? c.green : c.blue }}>{modern ? 'Now' : 'Before'}</div>
      <svg viewBox="0 0 800 310" width="100%" height="310" role="img" aria-label={modern ? 'Each request can go to any server.' : 'A stateful connection sends the first and next request back to Server A.'}>
        <defs><marker id={`session-arrow-${modern}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L10 5 L0 10" fill={modern ? c.green : c.blue} /></marker></defs>
        {[0, 1].map(i => <g key={i}>
          <text x="0" y={88 + i * 160} fill={c.text} fontSize="31">{i === 0 ? 'Request' : 'Next request'}</text>
          <path d={`M220 ${78 + i * 160} H470`} stroke={modern ? c.green : c.blue} strokeWidth="3" markerEnd={`url(#session-arrow-${modern})`} />
          <rect x="500" y={30 + i * 160} width="285" height="96" rx="16" fill={c.panel} stroke={modern ? c.green : c.blue} strokeWidth="2" />
          <text x="642" y={88 + i * 160} fill={c.text} fontSize="34" textAnchor="middle">{modern ? 'Any server' : 'Server A'}</text>
        </g>)}
      </svg>
      <p style={{ fontSize: 36, lineHeight: 1.35, color: c.muted, margin: '28px 0 0' }}>{modern ? 'The request includes what it needs.' : 'The server remembers the connection.'}</p>
    </section>)}
  </div>
  <div style={{ display: 'flex', gap: 50, marginTop: 58 }}>{['Any replica', 'Simpler restarts', 'No session cleanup'].map(text => <div key={text} style={{ flex: 1, borderTop: `2px solid ${c.line}`, paddingTop: 22, fontSize: 36, color: c.green }}>{text}</div>)}</div>
</Canvas>;

const WhyNow: Page = () => <Canvas>
  <h1 style={heading}>Why now?</h1>
  <div style={{ marginTop: 150, display: 'flex', gap: 70 }}>{['Spec maturing', 'Usage growing', 'Enterprise adoption'].map((text, i) => <div key={text} style={{ flex: 1 }}><div style={{ color: c.green, fontFamily: mono, fontSize: 28 }}>0{i + 1}</div><div style={{ height: 3, background: c.green, margin: '30px 0 40px' }} /><div style={{ fontSize: 61, lineHeight: 1.2 }}>{text}</div></div>)}</div>
</Canvas>;

const Practices: Page = () => <Canvas>
  <h1 style={heading}>Best practices</h1>
  <div style={{ marginTop: 55 }}>{['Reuse your business logic', 'Write tools that fit your workflows', 'Authenticate and authorize', 'Make writes safe to retry', 'Test in the real client'].map((text, i) => <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 42, padding: '24px 0', borderBottom: `1px solid ${c.line}` }}><span style={{ color: c.green, fontFamily: mono, fontSize: 30 }}>0{i + 1}</span><span style={{ fontSize: 45 }}>{text}</span></div>)}</div>
</Canvas>;

const LongDemo: Page = () => <Canvas green>
  <div style={{ fontFamily: mono, fontSize: 28 }}>DEMO + QUESTIONS</div><h1 style={{ ...heading, fontSize: 174, marginTop: 165 }}>Let’s add auth.</h1>
</Canvas>;

export const notes: (string | undefined)[] = [
  'Eleven slides covering MCP concepts, adoption, tool design, protocol changes and two demos. Keep explanations and caveats spoken rather than adding footnotes. Introduce Daniel Lew and Alex Booker, the workshop promise and two demos.',
  'Define Model Context Protocol as a standard way for an AI application to discover and use external capabilities. ChatGPT is the host; its MCP client sends requests to the product’s server. The simplified drawing does not imply ChatGPT is only a client or that the server is an agent. Tools perform actions including reads; resources provide content; prompts supply reusable instructions. Walk through one example each. The snippets are MCPServer configuration fragments with imported/predefined handlers, not complete standalone programs. They match src/mastra/mcp/index.ts: tools, resources/listResources/getResourceContent and prompts/listPrompts/getPromptMessages. Mastra workflows run behind tools, not a fourth MCP primitive. Sources: local spec docs/docs/2026-07-28/learn/architecture.mdx and server-concepts.mdx.',
  'Read the supplied Max Stoiber tweet: MCP calls by ChatGPT users grew 98× in 2026 so far and more than doubled in August. Chart scope: MCP tool calls through OpenAI’s gateway, January–August 2026. This is attributed vendor usage, not global market share or enterprise adoption percentage. The point is that use continued growing after the launch hype.',
  'Follow the five protocol revisions from foundation to stateless MCP. These are revision dates, not announcement dates. Experimental protocol tasks are distinct from Mastra workflows exposed as tools; tasks and sampling are not part of this demo. Primary references in docs/sources.md.',
  'Discuss use cases aloud: return an order, update a CRM account, find an issue. Your embedded agent owns UI, instructions, model choices and outcome; an MCP server lets users bring their familiar assistant. Agents have quirks like coworkers, so one less assistant to learn can lower adoption friction. Team expertise and user preferences determine the right choice. MCP can narrow what you maintain, but tool quality, compatibility, authorization and evaluations remain yours. The host owns the reasoning experience; tool authors remain responsible for their tools. Both can reuse domain logic. A CLI remains useful where a shell is available; do not turn this into the organizing debate.',
  'Short real ChatGPT demo: ask Can I return order ORD-001?, inspect selected tools, inputs and grounded answer. Requires an approved reachable HTTPS endpoint and verified account/auth/protocol support. Use the WorkOS OAuth configuration and restricted gateway, not fixture tokens. Keep Studio private. FACILITATOR.md records setup and the Inspector fallback; rehearse with the presenting account.',
  'Compare protocol revisions 2025-11-25 and 2026-07-28, not package v1/v2. Briefly name each change. Stateless requests remove initialization and protocol sessions. server/discover is mandatory for servers but optional for clients, not a replacement mandatory handshake. MRTR returns input_required then accepts inputResponses on a follow-up call; elicitation remains the capability. subscriptions/listen carries opted-in change notifications. Logging level is per request; ping/logging-setLevel/roots-list-changed are removed. Roots, sampling and logging themselves are deprecated, not all removed. Schema 2020-12/scalars, cache hints and OAuth/CIMD improvements are additional highlights. This is not an exhaustive changelog. Mastra v2 makes modern behavior default; opt-in support predates it. Source: local docs/specification/2026-07-28/changelog.mdx. Answer safety and runtime questions aloud here or during the demo: stronger remote OAuth/token validation does not solve prompt injection or business authorization; Node is tested, functions/edge depend on runtime and streaming limits.',
  'Explain the picture: previously a stateful server could need information from the initial connection to understand later calls, so requests returned to the instance remembering it. The latest spec carries protocol version/capabilities with each request, removing that dependency. Benefits: any replica, simpler restarts, no protocol-session cleanup. Also useful: no mandatory initialization round trip when the client already knows the version/capabilities, and per-call capability/logging preferences. These are spoken examples rather than more diagram labels. Your application still stores orders/users normally; any replica must have access to required business state and authenticate/authorize the request. Older implementations could already use stateless modes: Before illustrates the stateful case, not every old server. This is about protocol-session state, not OAuth login sessions or conversation memory. Source: SEP-2575, especially lines 35–84. SEP-2567 adds the inconsistent lifetime/sharing rationale; keep basket handles and client lifetime examples for questions, not the initial explanation.',
  'Spec maturing: smaller core, extension mechanism, governance and deprecation policy; not finished or free from breaking changes. Usage growing: the supplied OpenAI-gateway chart. Enterprise adoption: concrete vendor products and workspace integration controls (GitHub, Notion, ChatGPT), plus AAIF investment; do not infer a percentage of enterprise production use. Do not call MCP the longest-living AI concept. Sources: docs/sources.md, including Anthropic’s AAIF announcement, GitHub July-spec support and OpenAI custom-app docs.',
  'Give examples verbally: reuse domain rules; design tools around the work agents need to do, not a fixed tool count. Schema exploration can suit an open-ended read tool, while a return process suits a workflow-backed operation. Clear inputs, outputs, permissions and recovery matter in both cases. Mention search_tools/execute_tool for on-demand discovery and code mode for composing calls, without implying either grants unrestricted execution; authenticate with appropriate OAuth/token validation and authorize each tenant/resource operation; confirmation plus idempotency for writes; test tool selection, malformed input, wrong tenant, prompt injection, cancellation and retries in the intended host. Authentication is not business authorization. Do not pass arbitrary upstream tokens through. Handles identify resources, not permission. Source: Anthropic Writing effective tools for agents; local spec authorization/security references in docs/sources.md.',
  'Longer demo and questions: show reusable tools, workflow orchestration, carrier failure and recovery in Studio traces, then WorkOS OAuth and domain authorization. WorkOS is the authorization server; this application verifies tokens and scopes access to orders. Fixture tokens are only for local tests. Show wrong-tenant rejection and same-key retry. FACILITATOR.md has commands and fallbacks. Finish in the code or with questions.',
];
export const meta: SlideMeta = { title, theme: 'mastra', createdAt: '2026-09-08T20:13:50.713Z' };
export default [Cover, Definition, NeverLeft, Timeline, Choice, ShortDemo, Changes, Sessions, WhyNow, Practices, LongDemo] satisfies Page[];
