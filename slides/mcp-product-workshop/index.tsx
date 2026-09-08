import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import type { ReactNode } from 'react';
import mastraLogoWhite from '@assets/Mastra logo white.svg';

export const design: DesignSystem = {
  palette: { bg: '#07090b', text: '#f3f5f7', accent: '#7AFF78' },
  fonts: { display: '"Greed", "Inter", system-ui, sans-serif', body: '"Greed", "Inter", system-ui, sans-serif' },
  typeScale: { hero: 140, body: 36 }, radius: 22,
};
const color = { panel: '#090c11', border: '#1f2530', soft: '#cfd6de', muted: '#a5afbb', accent: '#7AFF78' };
const title = 'MCP is so back! Build Tools for the Agents Your Users Already Use';
const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return <footer style={{ position: 'absolute', left: 112, right: 112, bottom: 44, display: 'flex', justifyContent: 'space-between', color: color.muted, fontSize: 24 }}><span>Mastra Workshop · Daniel Lew & Alex Booker</span><span>{String(current).padStart(2, '0')} / {total}</span></footer>;
};
const Stage = ({ label, heading, children }: { label: string; heading: string; children: ReactNode }) => <div className="mcp-workshop" style={{ width: '100%', height: '100%', background: 'var(--osd-bg)', color: 'var(--osd-text)', fontFamily: 'var(--osd-font-body)', position: 'relative' }}>
  <style>{`.mcp-workshop .mcp-enter { animation: mcp-enter 280ms ease-out both; } @keyframes mcp-enter { from { opacity: 0; } to { opacity: 1; } } @media (prefers-reduced-motion: reduce) { .mcp-workshop .mcp-enter { animation: none; } }`}</style>
  <img src={mastraLogoWhite} alt="Mastra" style={{ position: 'absolute', right: 118, top: 84, width: 80, height: 48 }} />
  <main className="mcp-enter" style={{ position: 'absolute', inset: '96px 112px 120px' }}>
    <div style={{ fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase', color: color.accent, marginBottom: 28 }}>{label}</div>
    <h1 style={{ fontSize: 82, lineHeight: 1.12, fontWeight: 500, maxWidth: 1570, margin: '0 0 48px' }}>{heading}</h1>
    {children}
  </main><Footer />
</div>;
const Lead = ({ children }: { children: ReactNode }) => <p style={{ fontSize: 44, lineHeight: 1.45, color: color.soft, margin: '0 0 36px', maxWidth: 1480 }}>{children}</p>;
const Grid = ({ children, columns = 2 }: { children: ReactNode; columns?: number }) => <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 28, marginBottom: 32 }}>{children}</div>;
const Card = ({ label, children }: { label: string; children: ReactNode }) => <section style={{ background: color.panel, border: `1px solid ${color.border}`, borderRadius: 22, padding: 32 }}><h2 style={{ fontSize: 34, lineHeight: 1.25, color: color.accent, margin: '0 0 22px', fontWeight: 500 }}>{label}</h2><div style={{ color: color.soft, fontSize: 34, lineHeight: 1.45 }}>{children}</div></section>;
const Code = ({ children }: { children: string }) => <pre style={{ background: '#040506', border: `1px solid ${color.border}`, padding: 32, borderRadius: 22, fontFamily: '"Geist Mono", monospace', fontSize: 30, lineHeight: 1.5, whiteSpace: 'pre-wrap', margin: 0 }}>{children}</pre>;

const Cover: Page = () => <Stage label="Workshop · 90 minutes · no model key required" heading="MCP is so back!">
  <div style={{ fontSize: 76, lineHeight: 1.16, maxWidth: 1380, marginBottom: 52 }}>Build Tools for the Agents<br />Your Users Already Use</div>
  <Lead>Turn your existing product into a capability—not another assistant to learn.</Lead>
  <Grid><Card label="Daniel Lew">Live build & protocol walkthrough</Card><Card label="Alex Booker">Host & audience questions</Card></Grid>
</Stage>;
const Coworkers: Page = () => <Stage label="Start with the user" heading="Another agent is another coworker.">
  <Lead>Every one has a learning curve. Preferences. Quirks.</Lead>
  <Grid><Card label="The product’s instinct">“Try our new assistant.”</Card><Card label="The user’s preference">“Can I stay in ChatGPT or Claude?”</Card></Grid>
  <p style={{ color: color.accent, fontSize: 50, marginTop: 64 }}>Meet them in the host they already know.</p>
</Stage>;
const FalseBinary: Page = () => <Stage label="Why revisit MCP?" heading="MCP versus CLI is a false binary.">
  <Lead>Different users. Different owners. Different deployment boundaries.</Lead>
  <Grid><Card label="CLI">Explicit commands for technical users, scripts and local automation.</Card><Card label="MCP">Discoverable, typed capabilities for an agent outside your product.</Card></Grid>
  <p style={{ fontSize: 44, marginTop: 54 }}>You can ship both. Neither replaces your API.</p>
</Stage>;
const Decision: Page = () => <Stage label="Decision lab · there may be more than one answer" heading="Who owns the reasoning loop?">
  <Grid><Card label="Internal support engineer">Local scripts + explicit control → CLI / API</Card><Card label="Customer’s chosen assistant">External reasoning + discovery → MCP</Card><Card label="Your product owns the outcome">UX + model policy + orchestration → embedded agent</Card><Card label="Another application">Deterministic integration → direct API</Card></Grid>
  <p style={{ color: color.muted, fontSize: 28, marginTop: 38 }}>Ask: user skill · auth owner · locality · discovery · side-effect risk</p>
</Stage>;
const Boundary: Page = () => <Stage label="The mental model" heading="The host reasons. Your product acts.">
  <Grid columns={3}><Card label="External host">Conversation<br />Model policy<br />Tool selection</Card><Card label="MCP boundary">Discover<br />Validate<br />Call & respond</Card><Card label="Your application">Authorization<br />Business rules<br />Durable side effects</Card></Grid>
  <Lead>Typed access is not permission. The application still decides what is allowed.</Lead>
</Stage>;
const Surfaces: Page = () => <Stage label="Reuse capabilities, not adapter logic" heading="One domain. Many interfaces.">
  <Grid columns={4}><Card label="REST">Applications</Card><Card label="CLI">Engineers</Card><Card label="Agent">Your UX</Card><Card label="MCP">Their host</Card></Grid>
  <div style={{ textAlign: 'center', fontSize: 58, padding: 32, color: color.accent }}>↓</div>
  <Card label="Shared ReturnsService + schemas">Tenant isolation · eligibility · confirmation · idempotency</Card>
</Stage>;
const Primitives: Page = () => <Stage label="Choose the right primitive" heading="Actions, context and reusable instructions.">
  <Grid><Card label="Tool · do something">getOrder / createReturn<br />Bounded inputs and outputs</Card><Card label="Resource · read context">returns://policies/current<br />An addressable document</Card><Card label="Prompt · prepare instructions">draft-customer-reply<br />Not an executable operation</Card><Card label="Workflow-backed tool · coordinate">Eligibility → draft → complete<br />A staged application process</Card></Grid>
</Stage>;
const Contracts: Page = () => <Stage label="Discovery is your product interface" heading="Expose intent—not an arbitrary API.">
  <Grid><Card label="Avoid"><Code>{'callApi({ method, path, body })'}</Code><p>What is safe? When should I use it?</p></Card><Card label="Prefer"><Code>{'createReturn({\n  orderId, reason,\n  idempotencyKey\n})'}</Code></Card></Grid>
  <p style={{ fontSize: 36, lineHeight: 1.5 }}>Describe when to use it, when not to, scope, side effects and failure meanings.</p>
</Stage>;
const Modern: Page = () => <Stage label="Precision matters" heading="Modern behavior is now the default.">
  <Grid columns={3}><Card label="Newly defaulted in v2">2026-07-28 negotiation<br /><br />Stateless HTTP<br />Replay-based elicitation<br />subscriptions/listen</Card><Card label="Supported before v2">Tools, resources, prompts<br />Workflow-backed tools<br />Streamable HTTP<br /><br />2026 behavior was opt-in</Card><Card label="Not implemented here">Tasks · sampling<br />Completions · roots<br /><br />A production OAuth server</Card></Grid>
  <p style={{ fontSize: 30, color: color.muted, marginTop: 38 }}>Explicit 2025-11-25 remains available. “Defaulted” does not mean “invented.”</p>
</Stage>;
const Production: Page = () => <Stage label="Simpler transport ≠ no responsibilities" heading="Keep the safety boundary in your product.">
  <Grid><Card label="Identity & authorization">Authenticate the host. Authorize the user and tenant in the domain.</Card><Card label="Retries & side effects">Read → confirm → write once.<br />Bind an idempotency key to the request.</Card><Card label="Cancellation & errors">Stop pending work. Return actionable errors—not internal details.</Card><Card label="Beyond localhost">HTTPS + OAuth for public users.<br />CIMD is metadata, not authorization.</Card></Grid>
</Stage>;
const ReturnsDesk: Page = () => <Stage label="Our running application" heading="Returns Desk: a real boundary, local fixtures.">
  <Lead>One order. One policy. One return—even after a retry.</Lead>
  <Grid columns={3}><Card label="Existing surfaces">REST + CLI<br />Optional embedded agent</Card><Card label="Shared domain">North / south tenants<br />Normal / high-value<br />Expired / already returned</Card><Card label="MCP adapters">Modern (omitted config)<br />Legacy (explicit pin)<br />Public policy subscriptions</Card></Grid>
  <p style={{ fontSize: 30, color: color.muted }}>In-memory data; not a commerce backend. Never publish tenant order updates.</p>
</Stage>;
const Demo: Page = () => <Stage label="Leave the deck · one continuous demo" heading="Let’s make the product callable.">
  <Lead>Shared surfaces → discovery → workflow → modern wire → failure drill</Lead>
  <Code>{'// Real sanitized response excerpt: proof/expected/modern.jsonl\n"structuredContent": 80\n\n// Real failure-drill summary\n"abortedWrites": 0, "concurrentRetries": 12, "committedWrites": 1'}</Code>
  <p style={{ color: color.accent, fontSize: 42, marginTop: 44 }}>Watch the requests and responses—not just the UI.</p>
</Stage>;
const Questions: Page = () => <Stage label="Questions · five-minute recap" heading="What capability would you expose first?">
  <Grid><Card label="Choose a boundary">Who owns the agent?<br />What can it safely discover and call?</Card><Card label="Keep one source of truth">Reuse your domain layer.<br />Prove authorization and retries.</Card></Grid>
  <Lead>Start with one bounded read. Then earn the right to write.</Lead>
</Stage>;
export const meta: SlideMeta = { title, theme: 'mastra', createdAt: '2026-09-08T20:13:50.713Z' };
export default [Cover, Coworkers, FalseBinary, Decision, Boundary, Surfaces, Primitives, Contracts, Modern, Production, ReturnsDesk, Demo, Questions] satisfies Page[];
