import type { ReactNode } from 'react';
import dustinAvatar from './assets/dustin-avatar.jpg';
import alexAvatar from './assets/alex-avatar.jpg';
import { useSlidePageNumber } from '@open-slide/core';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

export const design: DesignSystem = {
  palette: { bg: '#020202', text: '#d9d9d9', accent: '#18fb6f' },
  fonts: {
    display: 'Geist, Inter, system-ui, -apple-system, sans-serif',
    body: 'Geist, Inter, system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 166, body: 36 },
  radius: 12,
};

const muted = '#a9a9a9';
const dim = '#757575';
const border = '#242424';
const mono = 'Geist Mono, JetBrains Mono, ui-monospace, Menlo, monospace';

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return <div style={{ position: 'absolute', bottom: 48, left: 120, right: 120, display: 'flex', justifyContent: 'space-between', color: dim, fontFamily: mono, fontSize: 20, letterSpacing: '0.12em' }}>
    <span>MASTRA · FACTORY 101</span><span>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
  </div>;
};

const Stage = ({ children, label }: { children: ReactNode; label: string }) => <div style={{ width: '100%', height: '100%', position: 'relative', padding: '120px 120px 130px', boxSizing: 'border-box', background: 'var(--osd-bg)', color: 'var(--osd-text)', fontFamily: 'var(--osd-font-body)' }}>
  <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${border} 1px, transparent 1px), linear-gradient(90deg, ${border} 1px, transparent 1px)`, backgroundSize: '96px 96px', opacity: 0.18 }} />
  <div style={{ position: 'relative', zIndex: 1 }}>
    <div style={{ color: 'var(--osd-accent)', fontFamily: mono, fontSize: 24, fontWeight: 700, letterSpacing: '0.18em', marginBottom: 40 }}>{label}</div>
    {children}
  </div>
  <Footer />
</div>;

const Heading = ({ children }: { children: ReactNode }) => <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 88, lineHeight: 1.08, letterSpacing: '-0.04em', margin: '0 0 58px', maxWidth: 1500 }}>{children}</h2>;
const Lead = ({ children }: { children: ReactNode }) => <p style={{ fontSize: 48, lineHeight: 1.4, color: muted, maxWidth: 1450, margin: 0 }}>{children}</p>;
const Item = ({ number, title, detail }: { number: string; title: string; detail: string }) => <div style={{ display: 'flex', alignItems: 'baseline', gap: 34, padding: '28px 0', borderTop: `1px solid ${border}` }}><span style={{ fontFamily: mono, color: 'var(--osd-accent)', fontSize: 27 }}>{number}</span><strong style={{ fontSize: 42, fontWeight: 650, minWidth: 340 }}>{title}</strong><span style={{ color: muted, fontSize: 31, lineHeight: 1.3 }}>{detail}</span></div>;

const FactoryIllustration = () => <div style={{ position: 'absolute', right: 105, top: 205, width: 800, height: 660, color: 'var(--osd-accent)' }}>
  <style>{`@keyframes factory-packet { 0% { offset-distance: 0%; opacity: 0 } 8%, 88% { opacity: 1 } 100% { offset-distance: 100%; opacity: 0 } } @keyframes factory-smoke { 0% { transform: translateY(0); opacity: 0 } 25% { opacity: .7 } 100% { transform: translateY(-90px); opacity: 0 } } @media (prefers-reduced-motion: reduce) { .factory-packet, .factory-smoke { animation: none !important } .factory-packet { opacity: 1; offset-distance: 50% } }`}</style>
  <svg viewBox="0 0 800 660" width="800" height="660" role="img" aria-label="Animated factory moving work through its production line">
    <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
      <path d="M80 520H730M120 520V310L250 375V310L380 375V240H655V520M455 240V120H515V240M565 240V160H625V240" />
      <path d="M120 310L250 375L380 310M380 375L510 310L655 375M380 240L510 310L655 240" opacity=".5" />
      <path d="M160 450H680M160 475H680" strokeWidth="5" />
      <path d="M410 355H475V415H410ZM520 355H585V415H520Z" opacity=".65" />
      <path d="M185 495v25m85-25v25m85-25v25m85-25v25m85-25v25m85-25v25" opacity=".4" />
    </g>
    <path d="M175 460H665" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 12" opacity=".6" />
    <rect className="factory-packet" x="-17" y="-17" width="34" height="34" rx="4" fill="currentColor" style={{ offsetPath: 'path("M175 460H665")', animation: 'factory-packet 5s linear infinite' }} />
    <rect className="factory-packet" x="-17" y="-17" width="34" height="34" rx="4" fill="currentColor" style={{ offsetPath: 'path("M175 460H665")', animation: 'factory-packet 5s linear -2.5s infinite' }} />
    <circle className="factory-smoke" cx="485" cy="100" r="12" fill="currentColor" style={{ animation: 'factory-smoke 3s ease-out infinite' }} />
    <circle className="factory-smoke" cx="595" cy="140" r="9" fill="currentColor" style={{ animation: 'factory-smoke 3s ease-out -1.5s infinite' }} />
  </svg>
</div>;

const Cover: Page = () => <Stage label="WORKSHOP / INTRODUCTION"><FactoryIllustration /><div style={{ marginTop: 125, position: 'relative', maxWidth: 920 }}><h1 style={{ fontSize: 'var(--osd-size-hero)', fontFamily: 'var(--osd-font-display)', lineHeight: 0.98, letterSpacing: '-0.06em', margin: 0 }}>Factory<br /><span style={{ color: 'var(--osd-accent)' }}>101.</span></h1><p style={{ fontSize: 43, color: muted, marginTop: 64, maxWidth: 800 }}>Build a factory for building your own software factory.</p></div></Stage>;

const Intros: Page = () => <Stage label="01 / YOUR HOSTS"><Heading>Meet your builders.</Heading><div style={{ display: 'flex', gap: 44, marginTop: 55 }}><div style={{ flex: 1, borderTop: '3px solid var(--osd-accent)', paddingTop: 36 }}><img src={dustinAvatar} alt="Dustin Schau" style={{ width: 190, height: 190, objectFit: 'cover', borderRadius: '50%', float: 'right', marginLeft: 22, border: `2px solid ${border}` }} /><div style={{ color: 'var(--osd-accent)', fontFamily: mono, fontSize: 25, letterSpacing: '0.12em' }}>PRODUCT × ENGINEERING</div><h3 style={{ fontSize: 72, letterSpacing: '-0.04em', margin: '30px 0 22px' }}>Dustin Schau</h3><p style={{ fontSize: 34, color: muted, lineHeight: 1.4, maxWidth: 720 }}>Mastra advisor. Former product & engineering leader at Gatsby and Postman.</p><div style={{ color: dim, fontFamily: mono, fontSize: 23, marginTop: 42 }}>dustinschau.com</div></div><div style={{ flex: 1, borderTop: '3px solid var(--osd-accent)', paddingTop: 36 }}><img src={alexAvatar} alt="Alex Booker" style={{ width: 190, height: 190, objectFit: 'cover', borderRadius: '50%', float: 'right', marginLeft: 22, border: `2px solid ${border}` }} /><div style={{ color: 'var(--osd-accent)', fontFamily: mono, fontSize: 25, letterSpacing: '0.12em' }}>DEVELOPER EXPERIENCE × EDUCATION</div><h3 style={{ fontSize: 72, letterSpacing: '-0.04em', margin: '30px 0 22px' }}>Alex Booker</h3><p style={{ fontSize: 34, color: muted, lineHeight: 1.4, maxWidth: 720 }}>Leads Observability & Evals at Mastra. Engineer-turned-educator and former Scrimba Podcast host.</p><div style={{ color: dim, fontFamily: mono, fontSize: 23, marginTop: 42 }}>booker.codes</div></div></div></Stage>;

const Goals: Page = () => <Stage label="02 / GOALS"><Heading>What you’ll leave with.</Heading><Item number="01" title="Understand" detail="What a factory is—and what powers Mastra’s." /><Item number="02" title="Build" detail="A factory end to end, alongside Dustin and Alex." /><Item number="03" title="Use it" detail="Take home a factory for building your own software factory." /></Stage>;

const Definition: Page = () => <Stage label="03 / DEFINITION"><Heading>What is a factory?</Heading><p style={{ fontSize: 58, lineHeight: 1.35, maxWidth: 1470, margin: 0 }}>An <span style={{ color: 'var(--osd-accent)' }}>automated way</span> to produce increasingly high-quality, specialized inputs into a system—while controlling each step as desired.</p></Stage>;

const BuildingBlocks: Page = () => <Stage label="04 / BUILDING BLOCKS"><Heading>The pieces that power it.</Heading><div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 90, fontFamily: mono, fontSize: 34, color: 'var(--osd-accent)' }}><div style={{ padding: 30, border: `1px solid ${border}` }}>INTAKE</div><span>→</span><div style={{ padding: 30, border: `1px solid ${border}` }}>TRIAGE</div><span>→</span><div style={{ padding: 30, border: `1px solid ${border}` }}>PLAN</div><span>→</span><div style={{ padding: 30, border: `1px solid ${border}` }}>BUILD</div><span>→</span><div style={{ padding: 30, border: `1px solid ${border}` }}>REVIEW</div></div><div style={{ display: 'flex', gap: 24, marginTop: 85 }}><div style={{ flex: 1, borderTop: `2px solid ${border}`, paddingTop: 26, fontSize: 32 }}>Memory<br /><span style={{ color: muted, fontSize: 27 }}>Context across work</span></div><div style={{ flex: 1, borderTop: `2px solid ${border}`, paddingTop: 26, fontSize: 32 }}>Harness<br /><span style={{ color: muted, fontSize: 27 }}>Agent + tools</span></div><div style={{ flex: 1, borderTop: `2px solid ${border}`, paddingTop: 26, fontSize: 32 }}>Sandbox<br /><span style={{ color: muted, fontSize: 27 }}>Cloud workspace</span></div><div style={{ flex: 1, borderTop: `2px solid ${border}`, paddingTop: 26, fontSize: 32 }}>Connections<br /><span style={{ color: muted, fontSize: 27 }}>Team systems</span></div></div></Stage>;

const Choices: Page = () => <Stage label="05 / DESIGN QUESTIONS"><Heading>How should a factory work?</Heading><Lead>What solutions do we consider and evaluate when choosing a factory?</Lead><div style={{ display: 'flex', gap: 32, marginTop: 100 }}><div style={{ padding: 38, border: `1px solid ${border}`, fontSize: 32, flex: 1 }}>What gets automated?</div><div style={{ padding: 38, border: `1px solid ${border}`, fontSize: 32, flex: 1 }}>What stays controllable?</div><div style={{ padding: 38, border: `1px solid ${border}`, fontSize: 32, flex: 1 }}>How does quality improve?</div></div></Stage>;

const MastraFactory: Page = () => <Stage label="06 / MASTRA"><Heading>What is Mastra’s factory?</Heading><Lead>Issue intake, configurable stages, a persistent coding agent, cloud workspaces, and connectors—built to fit your team.</Lead><div style={{ marginTop: 105, color: 'var(--osd-accent)', fontFamily: mono, fontSize: 34 }}>YOUR INPUTS → YOUR STAGES → YOUR APPROVALS</div></Stage>;

const Demo: Page = () => <Stage label="07 / LIVE DEMO"><Heading>See it, then ship it.</Heading><Lead>Follow a work item from intake through plan, build, and review.</Lead><div style={{ display: 'flex', gap: 32, marginTop: 90 }}><div style={{ flex: 1, border: `1px solid ${border}`, padding: 38, fontSize: 36 }}>01 / Start with an issue</div><div style={{ flex: 1, border: `1px solid ${border}`, padding: 38, fontSize: 36 }}>02 / Review the plan</div><div style={{ flex: 1, border: `1px solid ${border}`, padding: 38, fontSize: 36 }}>03 / Open the live preview</div></div></Stage>;

const Quality: Page = () => <Stage label="08 / MASTRA'S RESULTS"><Heading>What changed at Mastra.</Heading><div style={{ display: 'flex', gap: 34, marginTop: 70 }}><div style={{ flex: 1, borderTop: '3px solid var(--osd-accent)', paddingTop: 28 }}><div style={{ fontFamily: mono, fontSize: 23, color: muted }}>MEDIAN TIME IN TRIAGE</div><div style={{ fontSize: 64, fontWeight: 800, color: 'var(--osd-accent)', margin: '28px 0 18px' }}>6.9h → 11m</div><div style={{ fontSize: 25, color: muted }}>August → November 11</div></div><div style={{ flex: 1, borderTop: '3px solid var(--osd-accent)', paddingTop: 28 }}><div style={{ fontFamily: mono, fontSize: 23, color: muted }}>ISSUE → MERGED PR</div><div style={{ fontSize: 64, fontWeight: 800, color: 'var(--osd-accent)', margin: '28px 0 18px' }}>56.4h → 28.2h</div><div style={{ fontSize: 25, color: muted }}>Median; before Factory vs. Factory PRs</div></div><div style={{ flex: 1, borderTop: '3px solid var(--osd-accent)', paddingTop: 28 }}><div style={{ fontFamily: mono, fontSize: 23, color: muted }}>MERGED PRS / ENGINEER / WEEK</div><div style={{ fontSize: 64, fontWeight: 800, color: 'var(--osd-accent)', margin: '28px 0 18px' }}>9.5 → 16.9</div><div style={{ fontSize: 25, color: muted }}>Human + Factory output; +79%</div></div></div><div style={{ marginTop: 72, fontSize: 22, color: dim, fontFamily: mono }}>Source: mastra.ai/blog/announcing-new-capabilities-in-mastra-factory</div></Stage>;

const Start: Page = () => <Stage label="09 / HANDS ON"><div style={{ marginTop: 140 }}><h2 style={{ fontSize: 142, lineHeight: 1.05, letterSpacing: '-0.05em', margin: 0 }}>Let’s get<br /><span style={{ color: 'var(--osd-accent)' }}>started.</span></h2><p style={{ fontSize: 42, color: muted, marginTop: 50 }}>Build your factory with Dustin and Alex.</p></div></Stage>;

export const meta: SlideMeta = { title: 'Factory 101', createdAt: '2026-11-24T21:28:36.150Z' };
export default [Cover, Intros, Goals, Definition, BuildingBlocks, Choices, MastraFactory, Demo, Quality, Start] satisfies Page[];
