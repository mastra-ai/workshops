import type { DesignSystem, Page } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';

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

const styles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

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

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      margin: 0,
      fontFamily: 'var(--osd-font-display)',
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 520,
      fontStretch: '112%',
      letterSpacing: '0.015em',
      lineHeight: 1.08,
      color: 'var(--osd-text)',
      textWrap: 'balance',
    }}
  >
    {children}
  </h1>
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
        color: '#8f97a3',
      }}
    >
      <span>{label}</span>
      <span>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
  );
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 24,
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#8f97a3',
    }}
  >
    {children}
  </div>
);

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

const Frame = ({ children }: { children: React.ReactNode }) => (
  <>
    <style>{styles}</style>
    <div
      style={{
        position: 'absolute',
        inset: 56,
        borderRadius: 64,
        background: '#040506',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 92,
        borderRadius: 42,
        border: '1px solid #1f2530',
        background: '#090c11',
        padding: '88px 96px',
      }}
    >
      {children}
    </div>
  </>
);

const MastraLogo = ({ size = 46 }: { size?: number }) => {
  const dot = Math.round(size * 0.24);

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <span style={{ position: 'absolute', left: 0, top: 0, width: dot, height: dot, borderRadius: '50%', background: '#f3f5f7' }} />
      <span style={{ position: 'absolute', left: Math.round(size * 0.34), top: 0, width: dot, height: dot, borderRadius: '50%', background: '#f3f5f7' }} />
      <span style={{ position: 'absolute', left: 0, top: Math.round(size * 0.34), width: dot, height: dot, borderRadius: '50%', background: '#f3f5f7' }} />
      <span style={{ position: 'absolute', left: Math.round(size * 0.34), top: Math.round(size * 0.34), width: dot, height: dot, borderRadius: '50%', background: '#f3f5f7' }} />
      <span style={{ position: 'absolute', left: Math.round(size * 0.6), top: Math.round(size * 0.18), width: Math.round(size * 0.34), height: Math.round(size * 0.5), borderRadius: 999, background: '#f3f5f7' }} />
    </div>
  );
};

const MastraWordmark = () => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
    <MastraLogo size={56} />
    <span style={{ fontSize: 66, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>mastra</span>
  </div>
);

const CornerLogo = () => (
  <div
    style={{
      position: 'absolute',
      top: 90,
      right: 118,
      display: 'inline-flex',
      alignItems: 'center',
      opacity: 0.86,
    }}
  >
    <MastraLogo size={50} />
  </div>
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
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '18px 0',
      borderBottom: '1px solid rgba(122,255,120,0.08)',
    }}
  >
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

const HostCard = ({ name, role, note }: { name: string; role: string; note: string }) => (
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
        <div style={{ width: '100%', height: '100%', borderRadius: 14, background: 'radial-gradient(circle at 50% 30%, #26313d 0%, #1a2129 45%, #101419 100%)' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 62, lineHeight: 1.02, fontWeight: 520, color: '#eef3f7' }}>{name}</h3>
        <p style={{ margin: '14px 0 0 0', fontSize: 25, lineHeight: 1.24, color: '#a8b4bf', fontWeight: 450 }}>
          <span style={{ color: 'var(--osd-accent)' }}>•</span> {role}
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: 25, lineHeight: 1.24, color: '#a8b4bf', fontWeight: 450 }}>
          <span style={{ color: 'var(--osd-accent)' }}>•</span> {note}
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
  <div
    style={{
      width: 720,
      borderRadius: 28,
      border: '1px solid #26303c',
      background: 'linear-gradient(170deg, rgba(12,17,22,0.92) 0%, rgba(7,10,14,0.88) 100%)',
      padding: '28px 32px',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
    }}
  >
    <div style={{ fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8f97a3' }}>{title}</div>
    <p style={{ margin: '18px 0 0 0', fontSize: 36, lineHeight: 1.22, color: '#dde5ec' }}>{body}</p>
  </div>
);

const Cover: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeUp 320ms ease forwards' }}>
        <MastraWordmark />
        <WorkshopBadge />
      </div>
      <div style={{ marginTop: 120, maxWidth: 1240, display: 'flex', flexDirection: 'column', gap: 30, animation: 'fadeUp 380ms ease forwards' }}>
        <Title>Mastra Workshop System</Title>
        <p style={{ margin: 0, fontSize: 41, lineHeight: 1.34, color: '#cfd6de', maxWidth: 1120 }}>
          A single theme and layout system for repeatable workshop decks.
        </p>
      </div>
      <div style={{ position: 'absolute', left: 96, right: 96, bottom: 84, display: 'flex', gap: 20, animation: 'fadeUp 440ms ease forwards' }}>
        <div style={{ borderRadius: 999, border: '1px solid #1f2530', background: '#0f141b', padding: '14px 22px', fontSize: 26, color: '#d8e0e8' }}>Cover</div>
        <div style={{ borderRadius: 999, border: '1px solid #1f2530', background: '#0f141b', padding: '14px 22px', fontSize: 26, color: '#d8e0e8' }}>Welcome</div>
        <div style={{ borderRadius: 999, border: '1px solid #1f2530', background: '#0f141b', padding: '14px 22px', fontSize: 26, color: '#d8e0e8' }}>What you&apos;ll learn</div>
        <div style={{ borderRadius: 999, border: '1px solid #1f2530', background: '#0f141b', padding: '14px 22px', fontSize: 26, color: '#d8e0e8' }}>Meet your hosts</div>
        <div style={{ borderRadius: 999, border: '1px solid #1f2530', background: '#0f141b', padding: '14px 22px', fontSize: 26, color: '#d8e0e8' }}>Questions</div>
      </div>
    </Frame>
    <Footer />
  </div>
);

const Welcome: Page = () => (
  <div style={fill}>
    <style>{styles}</style>
    <div style={{ position: 'absolute', inset: 0, padding: '92px 112px 102px' }}>
      <RightAnchor />
      <CornerLogo />
      <div style={{ marginTop: 158, maxWidth: 1140, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <WorkshopBadge compact />
        <h2 style={{ margin: '28px 0 0 0', fontSize: 108, fontWeight: 515, fontStretch: '112%', lineHeight: 1.08, letterSpacing: '0.015em', maxWidth: 860 }}>Welcome!</h2>
        <p style={{ margin: '22px 0 0 0', fontSize: 41, lineHeight: 1.36, fontWeight: 400, color: '#cfd6de', maxWidth: 1100, textWrap: 'balance' }}>
          Start every workshop with one clear orientation moment that sets the tone, names the goal, and points attendees to the live session flow.
        </p>
        <div style={{ marginTop: 44, display: 'inline-flex', alignItems: 'center', gap: 14, border: '1px solid rgba(122,255,120,0.24)', color: '#9afc96', borderRadius: 999, padding: '16px 30px 16px 20px', fontSize: 30, fontWeight: 500, lineHeight: 1, letterSpacing: '0.008em', background: 'linear-gradient(180deg, rgba(9,20,14,0.92) 0%, rgba(6,15,10,0.9) 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 24px rgba(0,0,0,0.28)' }}>
          <span style={{ width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(122,255,120,0.08)', border: '1px solid rgba(122,255,120,0.2)' }}>→</span>
          <span>Point people to the next action</span>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const WhatYouWillLearn: Page = () => (
  <div style={fill}>
    <style>{styles}</style>
    <div style={{ position: 'absolute', inset: 0, padding: '92px 112px 96px' }}>
      <CornerLogo />
      <h2 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 94, fontWeight: 530, lineHeight: 1.03, letterSpacing: '0.006em', color: '#f3f7f9' }}>What you&apos;ll learn</h2>
      <div style={{ marginTop: 32, width: 1500, borderRadius: 30, padding: '12px 22px 6px', background: 'linear-gradient(180deg, rgba(8,14,11,0.64) 0%, rgba(5,9,8,0.42) 100%)', border: '1px solid rgba(122,255,120,0.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <AgendaItem number="1" title="What the session is about" />
        <AgendaItem number="2" title="Which skills or concepts attendees should leave with" />
        <AgendaItem number="3" title="How the live walkthrough will be structured" />
        <AgendaItem number="4" title="Where the practical handoff or resources will land" />
        <AgendaInfo text="Share questions in the chat anytime. We&apos;ll answer them throughout and at the end." />
      </div>
    </div>
    <Footer />
  </div>
);

const MeetYourHosts: Page = () => (
  <div style={fill}>
    <style>{styles}</style>
    <div style={{ position: 'absolute', inset: 0, padding: '92px 112px 96px' }}>
      <WhoAreWeAccent />
      <CornerLogo />
      <h2 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 94, fontWeight: 530, lineHeight: 1.03, letterSpacing: '0.006em', color: '#f3f7f9' }}>Meet your hosts</h2>
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 950 }}>
        <HostCard name="Host One" role="Workshop lead" note="Add one credibility point or session responsibility" />
        <HostCard name="Host Two" role="Product or platform expert" note="Add one short line about what they will cover" />
      </div>
    </div>
    <Footer />
  </div>
);

const Questions: Page = () => (
  <div style={fill}>
    <style>{styles}</style>
    <div style={{ position: 'absolute', inset: 0, padding: '92px 112px 96px' }}>
      <CornerLogo />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 980 }}>
        <Eyebrow>Questions</Eyebrow>
        <h2 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 94, fontWeight: 530, lineHeight: 1.03, letterSpacing: '0.006em', color: '#f3f7f9' }}>Make space for discussion.</h2>
        <p style={{ margin: 0, fontSize: 38, lineHeight: 1.3, color: '#cfd6de', maxWidth: 900 }}>
          End with a calm facilitation slide that invites the next question, clarifies how to participate, and makes the handoff feel intentional.
        </p>
      </div>
      <div style={{ marginTop: 42, display: 'flex', gap: 22 }}>
        <QuestionCard title="Prompt" body="What would you like to see explained live before we wrap?" />
        <QuestionCard title="Facilitation" body="Share questions in chat, unmute for discussion, or ask about implementation details." />
      </div>
    </div>
    <Footer />
  </div>
);

export default [Cover, Welcome, WhatYouWillLearn, MeetYourHosts, Questions] satisfies Page[];
