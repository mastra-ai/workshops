import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';

import alexBookerHeadshot from '@assets/headshots/alex booker.png';
import joshSchlissermanHeadshot from '@assets/headshots/joshua schilsserman.png';
import mastraLogoWhite from '@assets/Mastra logo white.svg';
import mastraWordmarkWhite from '@assets/Mastra wordmark white.png';

import yujohnNattrassHeadshot from '@assets/headshots/yujohn nattrass.png';

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

const XLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M4 4H8.2L13.1 10.9L19 4H21.2L14.1 12.3L21.6 20H17.5L12.2 14.5L7.4 20H5.2L11.2 13L4 4Z"
      fill="currentColor"
    />
  </svg>
);

const LinkedInLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" />
    <circle cx="8.1" cy="8.4" r="1.3" fill="#05110a" />
    <rect x="6.9" y="10" width="2.4" height="7" fill="#05110a" />
    <path d="M11.1 10H13.4V11.1C13.8 10.4 14.6 9.8 15.9 9.8C18.2 9.8 19 11.2 19 13.5V17H16.6V13.9C16.6 12.7 16.2 12 15.2 12C14.3 12 13.8 12.6 13.8 13.9V17H11.1V10Z" fill="#05110a" />
  </svg>
);

const SocialLink = ({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      borderRadius: 999,
      padding: '6px 10px',
      textDecoration: 'none',
      color: '#a9b4bf',
      background: 'rgba(122,255,120,0.028)',
      border: '1px solid rgba(122,255,120,0.08)',
      fontSize: 16,
      lineHeight: 1,
      fontWeight: 470,
    }}
  >
    <span style={{ color: '#73d976', display: 'inline-flex', alignItems: 'center', opacity: 0.85 }}>{icon}</span>
    <span>{label}</span>
  </a>
);

const HostCard = ({
  name,
  titleOne,
  titleTwo,
  headshot,
  xLink,
  linkedInLink,
}: {
  name: string;
  titleOne: string;
  titleTwo?: string;
  headshot: string;
  xLink: string;
  linkedInLink: string;
}) => (
  <div
    style={{
      flex: 1,
      borderRadius: 24,
      padding: '16px 18px',
      background: 'linear-gradient(180deg, rgba(8,14,11,0.78) 0%, rgba(5,10,8,0.58) 100%)',
      border: '1px solid rgba(122,255,120,0.16)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
    }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 16 }}>
      <div style={{ width: 164, minWidth: 164, height: 172, borderRadius: 18, border: '1px solid rgba(122,255,120,0.2)', padding: 8, background: 'linear-gradient(180deg, rgba(122,255,120,0.12) 0%, rgba(122,255,120,0.04) 100%)' }}>
        <img src={headshot} alt={name} style={{ width: 148, height: 156, objectFit: 'cover', objectPosition: 'center 18%', borderRadius: 12 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 48, lineHeight: 1.02, fontWeight: 520, color: '#eef3f7' }}>{name}</h3>
        <p style={{ margin: '10px 0 0 0', fontSize: 22, lineHeight: 1.24, color: '#a8b4bf', fontWeight: 450 }}>
          <span style={{ color: 'var(--osd-accent)' }}>•</span> {titleOne}
        </p>
        {titleTwo ? (
          <p style={{ margin: '8px 0 0 0', fontSize: 22, lineHeight: 1.24, color: '#a8b4bf', fontWeight: 450 }}>
            <span style={{ color: 'var(--osd-accent)' }}>•</span> {titleTwo}
          </p>
        ) : null}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <SocialLink href={`https://${xLink}`} label={xLink} icon={<XLogo />} />
          <SocialLink href={`https://${linkedInLink}`} label={linkedInLink} icon={<LinkedInLogo />} />
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
      <div style={{ height: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 'var(--osd-size-hero)', fontWeight: 520, fontStretch: '112%', letterSpacing: '0.015em', lineHeight: 1.1, maxWidth: 1280, textWrap: 'balance' }}>Mastra Agent Builder</h1>
        <p style={{ margin: '30px 0 0 0', fontSize: 39, lineHeight: 1.32, color: palette.textSoft, maxWidth: 1200, textWrap: 'balance' }}>An internal agent platform for your whole team</p>
      </div>
    </Frame>
  </div>
);

const Welcome: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '92px 112px 102px' }}>
      <RightAnchor />
      <CornerLogo />
      <div style={{ marginTop: 158, maxWidth: 1160, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <WorkshopBadge compact />
        <h2 style={{ margin: '28px 0 0 0', fontSize: 108, fontWeight: 515, fontStretch: '112%', lineHeight: 1.08, letterSpacing: '0.015em', maxWidth: 860 }}>Welcome!</h2>
        <p style={{ margin: '22px 0 0 0', fontSize: 39, lineHeight: 1.34, fontWeight: 400, color: palette.textSoft, maxWidth: 1120, textWrap: 'balance' }}>
          Weekly sessions to empower you with the tools and expertise to build more capable Mastra agents.
        </p>
        <a href="https://mastra.ai/workshops" target="_blank" rel="noreferrer" style={{ marginTop: 44, display: 'inline-flex', alignItems: 'center', gap: 14, border: '1px solid rgba(122,255,120,0.24)', color: '#9afc96', borderRadius: 999, padding: '16px 30px 16px 20px', fontSize: 28, fontWeight: 500, lineHeight: 1, letterSpacing: '0.008em', background: 'linear-gradient(180deg, rgba(9,20,14,0.92) 0%, rgba(6,15,10,0.9) 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 24px rgba(0,0,0,0.28)', textDecoration: 'none' }}>
          <span style={{ width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(122,255,120,0.08)', border: '1px solid rgba(122,255,120,0.2)' }}>→</span>
          <span>mastra.ai/workshops</span>
        </a>
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
        <AgendaItem number="1" title="What is Agent Builder?" />
        <AgendaItem number="2" title="Demo" />
        <AgendaItem number="3" title="How the code works" />
        <AgendaInfo text="Share questions anytime. We&apos;ll answer them throughout and at the end." />
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
      <h2 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 94, fontWeight: 530, lineHeight: 1.03, letterSpacing: '0.006em', color: '#f3f7f9' }}>Guests</h2>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 1200 }}>
        <HostCard
          name="Alex Booker"
          titleOne="Host"
          headshot={alexBookerHeadshot}
          xLink="x.com/bookercodes"
          linkedInLink="linkedin.com/in/bookercodes"
        />
        <HostCard
          name="Yujohn Nattrass"
          titleOne="Engineer"
          headshot={yujohnNattrassHeadshot}
          xLink="x.com/YujohnNatt"
          linkedInLink="linkedin.com/in/yujohn-nattrass"
        />
        <HostCard
          name="Josh Schlisserman"
          titleOne="Chief of Staff"
          headshot={joshSchlissermanHeadshot}
          xLink="x.com/jslishi"
          linkedInLink="linkedin.com/in/joshua-schlisserman"
        />
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
        <p style={{ margin: 0, fontSize: 38, lineHeight: 1.3, color: palette.textSoft, maxWidth: 920 }}>
          Bring your questions about setup, guardrails, publishing workflows, or where Agent Builder fits inside an existing Mastra platform.
        </p>
      </div>
      <div style={{ marginTop: 42, display: 'flex', gap: 22 }}>
        <QuestionCard title="Prompt" body="What part of safe self-serve agent building would you want to see demonstrated live before we wrap?" />
        <QuestionCard title="Follow-up" body="Everyone who registers gets the recording and code examples, so you can revisit the workflow after the session." />
      </div>
    </div>
    <Footer />
  </div>
);

export const meta: SlideMeta = {
  title: 'Mastra Agent Builder: Build Agents, No Code Required',
  theme: 'mastra',
  createdAt: '2026-06-04T14:02:47.933Z',
};

export default [Cover, Welcome, WhatYouWillLearn, MeetYourHosts] satisfies Page[];
