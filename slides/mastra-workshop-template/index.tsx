import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { ImagePlaceholder, useSlidePageNumber } from '@open-slide/core';

import mastraLogoWhite from '@assets/Mastra logo white.svg';
import mastraWordmarkWhite from '@assets/Mastra wordmark white.png';

export const design: DesignSystem = {
  palette: {
    bg: '#07090b',
    text: '#f3f5f7',
    accent: '#7AFF78',
  },
  fonts: {
    display: '"Greed", "Inter", system-ui, -apple-system, sans-serif',
    body: '"Greed", "Inter", system-ui, -apple-system, sans-serif',
  },
  typeScale: {
    hero: 108,
    body: 34,
  },
  radius: 22,
};

const palette = {
  shell: '#040506',
  panel: '#090c11',
  border: '#1f2530',
  textSoft: '#cfd6de',
  textMuted: '#8f97a3',
} as const;

const fill = {
  width: '100%',
  height: '100%',
  position: 'relative' as const,
  overflow: 'hidden',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  letterSpacing: '0.015em',
};

const WorkshopBadge = ({ compact = false }: { compact?: boolean }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: compact ? 8 : 10,
      background: '#0d1219',
      border: '2px solid #222222',
      borderRadius: 999,
      padding: compact ? '10px 18px' : '12px 22px',
      fontSize: compact ? 22 : 28,
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#e7ebef',
    }}
  >
    <span
      style={{
        width: compact ? 20 : 24,
        height: compact ? 20 : 24,
        borderRadius: '50%',
        border: '2px solid #e7ebef',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          width: compact ? 5 : 6,
          height: compact ? 5 : 6,
          borderRadius: '50%',
          background: '#e7ebef',
          display: 'inline-block',
        }}
      />
    </span>
    <span>Workshop</span>
  </div>
);

const Footer = ({ label = 'Mastra Workshop' }: { label?: string }) => {
  const { current, total } = useSlidePageNumber();

  return (
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        bottom: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 24,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: palette.textMuted,
      }}
    >
      <span>{label}</span>
      <span>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
  );
};

const Frame = ({ children }: { children: React.ReactNode }) => (
  <>
    <div style={{ position: 'absolute', inset: 56, borderRadius: 64, background: palette.shell }} />
    <div
      style={{
        position: 'absolute',
        inset: 92,
        borderRadius: 42,
        border: `1px solid ${palette.border}`,
        background: palette.panel,
        padding: '88px 96px',
      }}
    >
      {children}
    </div>
    <Footer />
  </>
);

const CornerLogo = () => (
  <a
    href="https://mastra.ai"
    target="_blank"
    rel="noreferrer"
    style={{ position: 'absolute', top: 90, right: 118, display: 'inline-flex', alignItems: 'center', opacity: 0.86 }}
  >
    <img src={mastraLogoWhite} alt="Mastra logo" style={{ width: 80, height: 48, objectFit: 'contain' }} />
  </a>
);

const RightAnchor = () => (
  <div
    aria-hidden
    style={{
      position: 'absolute',
      right: 154,
      top: 286,
      width: 392,
      height: 392,
      borderRadius: '50%',
      border: '1px dashed #2a3340',
      background: 'radial-gradient(circle at 50% 50%, rgba(122,255,120,0.1) 0%, rgba(122,255,120,0.02) 44%, rgba(122,255,120,0) 70%)',
      opacity: 0.78,
      pointerEvents: 'none',
    }}
  >
    <div style={{ position: 'absolute', inset: 54, borderRadius: '50%', border: '1px dashed #253246', opacity: 0.84 }} />
    <div style={{ position: 'absolute', right: 26, top: 210, width: 20, height: 20, borderRadius: '50%', background: 'var(--osd-accent)', boxShadow: '0 0 22px rgba(122,255,120,0.42)' }} />
  </div>
);

const WhoAreWeAccent = () => (
  <div
    aria-hidden
    style={{
      position: 'absolute',
      right: 122,
      top: 350,
      width: 360,
      height: 246,
      borderRadius: 24,
      border: '1px solid rgba(122,255,120,0.12)',
      background: 'linear-gradient(160deg, rgba(122,255,120,0.06) 0%, rgba(122,255,120,0.01) 34%, rgba(122,255,120,0) 74%)',
      opacity: 0.74,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      pointerEvents: 'none',
    }}
  >
    <div style={{ position: 'absolute', left: 28, right: 28, top: 54, height: 1, background: 'rgba(122,255,120,0.12)' }} />
    <div style={{ position: 'absolute', left: 28, top: 86, width: 170, height: 10, borderRadius: 999, background: 'rgba(122,255,120,0.14)' }} />
    <div style={{ position: 'absolute', left: 28, top: 118, width: 118, height: 10, borderRadius: 999, background: 'rgba(122,255,120,0.1)' }} />
    <div style={{ position: 'absolute', right: 68, top: 104, width: 10, height: 10, borderRadius: '50%', background: 'rgba(122,255,120,0.68)' }} />
    <div style={{ position: 'absolute', right: 52, top: 164, width: 8, height: 8, borderRadius: '50%', background: 'rgba(122,255,120,0.46)' }} />
  </div>
);

const AgendaItem = ({ number, title }: { number: string; title: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 0', borderBottom: '1px solid rgba(122,255,120,0.08)' }}>
    <span
      style={{
        width: 46,
        height: 46,
        borderRadius: 14,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        fontWeight: 610,
        lineHeight: 1,
        letterSpacing: '0.01em',
        color: '#06210f',
        background: 'linear-gradient(180deg, #86ff80 0%, #73f476 100%)',
        boxShadow: '0 0 18px rgba(122,255,120,0.24)',
      }}
    >
      {number}
    </span>
    <h3 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 46, fontWeight: 500, lineHeight: 1.12, letterSpacing: '0.002em', color: '#e2e8ee' }}>
      {title}
    </h3>
  </div>
);

const AgendaInfo = ({ text }: { text: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 0 10px' }}>
    <span style={{ width: 46, height: 46, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 600, lineHeight: 1, color: '#8be889', background: 'rgba(122,255,120,0.1)', border: '1px solid rgba(122,255,120,0.2)' }} aria-hidden>
      i
    </span>
    <p style={{ margin: 0, fontSize: 36, fontWeight: 470, lineHeight: 1.2, letterSpacing: '0.002em', color: '#b8c5d1' }}>{text}</p>
  </div>
);

const HostCard = ({ name, role, detail, placeholderHint }: { name: string; role: string; detail: string; placeholderHint: string }) => (
  <div
    style={{
      flex: 1,
      borderRadius: 28,
      padding: '18px 20px 18px',
      background: 'linear-gradient(180deg, rgba(8,14,11,0.78) 0%, rgba(5,10,8,0.58) 100%)',
      border: '1px solid rgba(122,255,120,0.16)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 18 }}>
      <div style={{ width: 216, minWidth: 216, height: 236, borderRadius: 20, border: '1px solid rgba(122,255,120,0.2)', padding: 8, background: 'linear-gradient(180deg, rgba(122,255,120,0.12) 0%, rgba(122,255,120,0.04) 100%)' }}>
        <ImagePlaceholder hint={placeholderHint} width={200} height={220} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 62, lineHeight: 1.02, fontWeight: 520, color: '#eef3f7' }}>{name}</h3>
        <p style={{ margin: '14px 0 0 0', fontSize: 25, lineHeight: 1.24, color: '#a8b4bf', fontWeight: 450 }}>
          <span style={{ color: 'var(--osd-accent)' }}>•</span> {role}
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: 25, lineHeight: 1.24, color: '#a8b4bf', fontWeight: 450 }}>
          <span style={{ color: 'var(--osd-accent)' }}>•</span> {detail}
        </p>
        <div style={{ marginTop: 'auto', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <div style={{ borderRadius: 999, padding: '7px 11px', color: '#a9b4bf', background: 'rgba(122,255,120,0.028)', border: '1px solid rgba(122,255,120,0.08)', fontSize: 18 }}>@handle</div>
          <div style={{ borderRadius: 999, padding: '7px 11px', color: '#a9b4bf', background: 'rgba(122,255,120,0.028)', border: '1px solid rgba(122,255,120,0.08)', fontSize: 18 }}>linkedin</div>
        </div>
      </div>
    </div>
  </div>
);

const QuestionCard = ({ title, body }: { title: string; body: string }) => (
  <div style={{ width: 720, borderRadius: 28, border: '1px solid #26303c', background: 'linear-gradient(170deg, rgba(12,17,22,0.92) 0%, rgba(7,10,14,0.88) 100%)', padding: '28px 32px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
    <div style={{ fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase', color: palette.textMuted }}>{title}</div>
    <p style={{ margin: '18px 0 0 0', fontSize: 36, lineHeight: 1.22, color: '#dde5ec' }}>{body}</p>
  </div>
);

const Cover: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={mastraWordmarkWhite} alt="Mastra wordmark" style={{ width: 332, height: 84, objectFit: 'contain' }} />
        <WorkshopBadge />
      </div>
      <h1 style={{ margin: '120px 0 0 0', fontFamily: 'var(--osd-font-display)', fontSize: 'var(--osd-size-hero)', fontWeight: 520, fontStretch: '112%', letterSpacing: '0.015em', lineHeight: 1.1, maxWidth: 1280, textWrap: 'balance' }}>
        Replace with your workshop title
      </h1>
      <p style={{ margin: '34px 0 0 0', fontSize: 41, lineHeight: 1.34, color: palette.textSoft, maxWidth: 1180 }}>
        Add a one-sentence description explaining what attendees will learn and why this session matters.
      </p>
    </Frame>
  </div>
);

const Welcome: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '92px 112px 102px' }}>
      <RightAnchor />
      <CornerLogo />
      <div style={{ marginTop: 158, maxWidth: 1140, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <WorkshopBadge compact />
        <h2 style={{ margin: '28px 0 0 0', fontSize: 108, fontWeight: 515, fontStretch: '112%', lineHeight: 1.08, letterSpacing: '0.015em', maxWidth: 860 }}>Welcome!</h2>
        <p style={{ margin: '22px 0 0 0', fontSize: 41, lineHeight: 1.36, fontWeight: 400, color: palette.textSoft, maxWidth: 1100, textWrap: 'balance' }}>
          Introduce the session, set expectations, and point attendees toward the chat, repo, or link you want them to use during the workshop.
        </p>
        <div style={{ marginTop: 44, display: 'inline-flex', alignItems: 'center', gap: 14, border: '1px solid rgba(122,255,120,0.24)', color: '#9afc96', borderRadius: 999, padding: '16px 30px 16px 20px', fontSize: 30, fontWeight: 500, lineHeight: 1, letterSpacing: '0.008em', background: 'linear-gradient(180deg, rgba(9,20,14,0.92) 0%, rgba(6,15,10,0.9) 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 24px rgba(0,0,0,0.28)' }}>
          <span style={{ width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(122,255,120,0.08)', border: '1px solid rgba(122,255,120,0.2)' }}>→</span>
          <span>Replace with the primary attendee action</span>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const WhatYouWillLearn: Page = () => (
  <div style={fill}>
    <CornerLogo />
    <div style={{ position: 'absolute', inset: 0, padding: '92px 112px 96px' }}>
      <h2 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 94, fontWeight: 530, lineHeight: 1.03, letterSpacing: '0.006em', color: '#f3f7f9' }}>What you&apos;ll learn</h2>
      <div style={{ marginTop: 32, width: 1500, borderRadius: 30, padding: '12px 22px 6px', background: 'linear-gradient(180deg, rgba(8,14,11,0.64) 0%, rgba(5,9,8,0.42) 100%)', border: '1px solid rgba(122,255,120,0.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <AgendaItem number="1" title="How to build an agent with Mastra" />
        <AgendaItem number="2" title="New patterns shaping the future of agents" />
        <AgendaItem number="3" title="Real production use cases for agents" />
        <AgendaItem number="4" title="How to connect agents to your frontend" />
        <AgendaItem number="5" title="How client-side tools unlock richer agentic assistants" />
        <AgendaInfo text="Raise your hand anytime! We&apos;ll answer questions throughout and at the end." />
      </div>
    </div>
    <Footer />
  </div>
);

const MeetYourHosts: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '92px 112px 96px' }}>
      <WhoAreWeAccent />
      <CornerLogo />
      <h2 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 94, fontWeight: 530, lineHeight: 1.03, letterSpacing: '0.006em', color: '#f3f7f9' }}>Meet your hosts</h2>
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 950 }}>
        <HostCard name="Host One" role="Workshop lead" detail="Add one credibility point or facilitation role" placeholderHint="Host one headshot" />
        <HostCard name="Host Two" role="Product or platform expert" detail="Add one short supporting detail about what they cover" placeholderHint="Host two headshot" />
      </div>
    </div>
    <Footer />
  </div>
);

const Questions: Page = () => (
  <div style={fill}>
    <CornerLogo />
    <div style={{ position: 'absolute', inset: 0, padding: '92px 112px 96px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 980 }}>
        <div style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.4, letterSpacing: '0.12em', textTransform: 'uppercase', color: palette.textMuted }}>Questions</div>
        <h2 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 94, fontWeight: 530, lineHeight: 1.03, letterSpacing: '0.006em', color: '#f3f7f9' }}>Open the floor.</h2>
        <p style={{ margin: 0, fontSize: 38, lineHeight: 1.3, color: palette.textSoft, maxWidth: 900 }}>
          Use this slide to invite questions, clarify how people should participate, and transition into discussion without inventing a bespoke interaction pattern.
        </p>
      </div>
      <div style={{ marginTop: 42, display: 'flex', gap: 22 }}>
        <QuestionCard title="Prompt" body="What would you like to see explained live before we wrap?" />
        <QuestionCard title="Facilitation" body="Replace with your preferred Q&A instructions, follow-up CTA, or next-step handoff." />
      </div>
    </div>
    <Footer />
  </div>
);

export const meta: SlideMeta = {
  title: 'Mastra Workshop Template',
  theme: 'mastra',
  createdAt: '2026-06-04T13:45:16.417Z',
};

export default [Cover, Welcome, WhatYouWillLearn, MeetYourHosts, Questions] satisfies Page[];
