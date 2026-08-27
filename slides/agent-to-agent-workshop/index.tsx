import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { ImagePlaceholder, useSlidePageNumber } from '@open-slide/core';

import greedVf from '@assets/fonts/GreedVF.woff2';
import mastraLogoWhite from '@assets/Mastra logo white.svg';
import mastraWordmarkWhite from '@assets/Mastra wordmark white.png';
import alexBookerHeadshot from '../mastra-monitor-debug-evaluate/assets/Alex Booker.png';
import asset1Person from './assets/1 Person.png';


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
};

const fontStyles = `
  @font-face {
    font-family: 'Greed';
    src: url(${greedVf}) format('woff2');
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
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

const Footer = () => {
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
      <span>Agent-to-Agent</span>
      <span>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
  );
};

const Frame = ({ children }: { children: React.ReactNode }) => (
  <>
    <style>{fontStyles}</style>
    <div
      style={{
        position: 'absolute',
        inset: 56,
        borderRadius: 64,
        background: palette.shell,
      }}
    />
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
    style={{
      position: 'absolute',
      top: 90,
      right: 118,
      display: 'inline-flex',
      alignItems: 'center',
      opacity: 0.86,
    }}
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
      background:
        'radial-gradient(circle at 50% 50%, rgba(122,255,120,0.1) 0%, rgba(122,255,120,0.02) 44%, rgba(122,255,120,0) 70%)',
      opacity: 0.78,
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 54,
        borderRadius: '50%',
        border: '1px dashed #253246',
        opacity: 0.84,
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 26,
        top: 210,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: 'var(--osd-accent)',
        boxShadow: '0 0 22px rgba(122,255,120,0.42)',
      }}
    />
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
      background:
        'linear-gradient(160deg, rgba(122,255,120,0.06) 0%, rgba(122,255,120,0.01) 34%, rgba(122,255,120,0) 74%)',
      opacity: 0.74,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 28,
        right: 28,
        top: 54,
        height: 1,
        background: 'linear-gradient(90deg, rgba(122,255,120,0.04) 0%, rgba(122,255,120,0.36) 46%, rgba(122,255,120,0.04) 100%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 28,
        right: 28,
        top: 112,
        height: 1,
        background: 'linear-gradient(90deg, rgba(122,255,120,0.03) 0%, rgba(122,255,120,0.26) 52%, rgba(122,255,120,0.03) 100%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 28,
        right: 28,
        top: 170,
        height: 1,
        background: 'linear-gradient(90deg, rgba(122,255,120,0.02) 0%, rgba(122,255,120,0.2) 48%, rgba(122,255,120,0.02) 100%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 44,
        top: 46,
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: 'var(--osd-accent)',
        boxShadow: '0 0 16px rgba(122,255,120,0.36)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 68,
        top: 104,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'rgba(122,255,120,0.68)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 52,
        top: 164,
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'rgba(122,255,120,0.46)',
      }}
    />
  </div>
);

const overviewRhythm = {
  sectionTop: 158,
  badgeToTitle: 28,
  titleToBody: 22,
  bodyToCta: 44,
};

const Cover: Page = () => (
  <div style={fill}>
    <Frame>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={mastraWordmarkWhite} alt="Mastra wordmark" style={{ width: 332, height: 84, objectFit: 'contain' }} />
        <WorkshopBadge />
      </div>
      <h1
        style={{
          margin: '120px 0 0 0',
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 520,
          fontStretch: '112%',
          letterSpacing: '0.015em',
          lineHeight: 1.1,
          maxWidth: 1300,
          textWrap: 'balance',
        }}
      >
        Agent-to-Agent with Mastra
      </h1>
      <p
        style={{
          margin: '34px 0 0 0',
          fontSize: 41,
          lineHeight: 1.34,
          color: palette.textSoft,
          maxWidth: 1220,
          animation: 'fadeUp 320ms ease forwards',
        }}
      >
        Connect Mastra agents to remote agents and coding harnesses with A2A and ACP.
      </p>
    </Frame>
  </div>
);

const Welcome: Page = () => (
  <div style={fill}>
    <style>{fontStyles}</style>
    <div style={{ position: 'absolute', inset: 0, padding: '92px 112px 102px' }}>
      <RightAnchor />
      <a
        href="https://mastra.ai"
        target="_blank"
        rel="noreferrer"
        style={{
          position: 'absolute',
          top: 90,
          right: 118,
          display: 'inline-flex',
          alignItems: 'center',
          opacity: 0.86,
        }}
      >
        <img
          src={mastraLogoWhite}
          alt="Mastra logo"
          style={{ width: 80, height: 48, objectFit: 'contain' }}
        />
      </a>

      <div
        style={{
          marginTop: overviewRhythm.sectionTop,
          maxWidth: 1140,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <WorkshopBadge compact />

        <h2
          style={{
            margin: `${overviewRhythm.badgeToTitle}px 0 0 0`,
            fontSize: 108,
            fontWeight: 515,
            fontStretch: '112%',
            lineHeight: 1.08,
            letterSpacing: '0.015em',
            maxWidth: 860,
          }}
        >
          Welcome!
        </h2>

        <p
          style={{
            margin: `${overviewRhythm.titleToBody}px 0 0 0`,
            fontSize: 41,
            lineHeight: 1.36,
            fontWeight: 400,
            color: '#cfd6de',
            maxWidth: 1100,
            textWrap: 'balance',
          }}
        >
          Weekly sessions to empower you with the{' '}
          <strong style={{ color: '#e5ebf3', fontWeight: 500 }}>tools and expertise</strong>{' '}
          to build more capable Mastra agents.
        </p>

        <a
          href="https://mastra.ai/workshops"
          target="_blank"
          rel="noreferrer"
          style={{
            marginTop: overviewRhythm.bodyToCta,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            textDecoration: 'none',
            border: '1px solid rgba(122, 255, 120, 0.24)',
            color: '#9afc96',
            borderRadius: 999,
            padding: '16px 30px 16px 20px',
            fontSize: 30,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: '0.008em',
            background: 'linear-gradient(180deg, rgba(9, 20, 14, 0.92) 0%, rgba(6, 15, 10, 0.9) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 24px rgba(0, 0, 0, 0.28)',
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(122, 255, 120, 0.08)',
              border: '1px solid rgba(122, 255, 120, 0.2)',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
              style={{ display: 'block', transform: 'translateY(0.5px)' }}
            >
              <path
                d="M5 12H18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 6L18 12L12 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span style={{ display: 'inline-block', lineHeight: '32px' }}>mastra.ai/workshops</span>
        </a>
      </div>
    </div>
    <Footer />
  </div>
);

const AgendaItem = ({ number, title }: { number: string; title: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: 18,
      padding: '8px 0',
      borderBottom: '1px solid rgba(122,255,120,0.12)',
    }}
  >
    <span
      style={{
        width: 44,
        fontSize: 33,
        lineHeight: 1.2,
        color: 'var(--osd-accent)',
      }}
    >
      {number}
    </span>
    <span
      style={{
        fontSize: 35,
        lineHeight: 1.28,
        color: '#d7dde5',
      }}
    >
      {title}
    </span>
  </div>
);

const Agenda: Page = () => (
  <div style={fill}>
    <style>{fontStyles}</style>
    <CornerLogo />
    <div style={{ position: 'absolute', inset: 0, padding: '92px 112px 96px' }}>
      <h2
        style={{
          margin: 0,
          fontSize: 94,
          fontWeight: 530,
          lineHeight: 1.03,
          letterSpacing: '0.006em',
        }}
      >
        You're going to learn
      </h2>
      <div
        style={{
          marginTop: 34,
          width: 1480,
          borderRadius: 30,
          padding: '18px 28px 14px',
          background: 'linear-gradient(180deg, rgba(8,14,11,0.64) 0%, rgba(5,9,8,0.42) 100%)',
          border: '1px solid rgba(122,255,120,0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <AgendaItem number="1" title="What A2A is" />
        <AgendaItem number="2" title="How A2A works in Mastra" />
        <AgendaItem number="3" title="What ACP is" />
        <AgendaItem number="4" title="How ACP works in practice" />
        <AgendaItem number="5" title="How A2A and ACP differ from MCP" />
      </div>
    </div>
    <Footer />
  </div>
);

const XLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M4 4H8.2L13.1 10.9L19 4H21.2L14.1 12.3L21.6 20H17.5L12.2 14.5L7.4 20H5.2L11.2 13L4 4Z"
      fill="currentColor"
    />
  </svg>
);

const LinkedInLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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
      padding: '7px 11px',
      textDecoration: 'none',
      color: '#a9b4bf',
      background: 'rgba(122,255,120,0.028)',
      border: '1px solid rgba(122,255,120,0.08)',
      fontSize: 18,
      lineHeight: 1,
      fontWeight: 470,
    }}
  >
    <span style={{ color: '#73d976', display: 'inline-flex', alignItems: 'center', opacity: 0.85 }}>{icon}</span>
    <span>{label}</span>
  </a>
);

const PersonCard = ({
  name,
  xHandle,
  xUrl,
  linkedInHandle,
  linkedInUrl,
  bulletOne,
  bulletTwo,
  bulletThree,
  headshot,
  headshotPosition,
  placeholderHint,
}: {
  name: string;
  xHandle: string;
  xUrl: string;
  linkedInHandle: string;
  linkedInUrl: string;
  bulletOne: string;
  bulletTwo: string;
  bulletThree?: string;
  headshot?: string;
  headshotPosition?: string;
  placeholderHint?: string;
}) => (
  <div
    style={{
      flex: 1,
      minHeight: 0,
      borderRadius: 28,
      padding: '18px 20px 18px',
      background: 'linear-gradient(180deg, rgba(8,14,11,0.78) 0%, rgba(5,10,8,0.58) 100%)',
      border: '1px solid rgba(122,255,120,0.16)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 18 }}>
      <div
        style={{
          width: 216,
          minWidth: 216,
          height: 236,
          borderRadius: 20,
          border: '1px solid rgba(122,255,120,0.2)',
          padding: 8,
          background: 'linear-gradient(180deg, rgba(122,255,120,0.12) 0%, rgba(122,255,120,0.04) 100%)',
        }}
      >
        {headshot ? (
          <img
            src={headshot}
            alt={`${name} headshot`}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 14,
              objectFit: 'cover',
              objectPosition: headshotPosition,
              background: '#101419',
              display: 'block',
            }}
          />
        ) : (
          <img src={asset1Person} alt='' style={{ width: 200, height: 220, objectFit: 'cover', objectPosition: '50% 50%' }} />
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--osd-font-display)',
            fontSize: 62,
            lineHeight: 1.02,
            fontWeight: 520,
            color: '#eef3f7',
          }}
        >
          {name}
        </h3>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
          <p style={{ margin: 0, fontSize: 25, lineHeight: 1.24, color: '#a8b4bf', fontWeight: 450 }}>
            <span style={{ color: 'var(--osd-accent)' }}>•</span> {bulletOne}
          </p>
          <p style={{ margin: 0, fontSize: 25, lineHeight: 1.24, color: '#a8b4bf', fontWeight: 450 }}>
            <span style={{ color: 'var(--osd-accent)' }}>•</span> {bulletTwo}
          </p>
          {bulletThree ? (
            <p style={{ margin: 0, fontSize: 25, lineHeight: 1.24, color: '#a8b4bf', fontWeight: 450 }}>
              <span style={{ color: 'var(--osd-accent)' }}>•</span> {bulletThree}
            </p>
          ) : null}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <SocialLink href={xUrl} label={xHandle} icon={<XLogo />} />
          <SocialLink href={linkedInUrl} label={linkedInHandle} icon={<LinkedInLogo />} />
        </div>
      </div>
    </div>
  </div>
);

const Hosts: Page = () => (
  <div style={fill}>
    <style>{fontStyles}</style>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 16% 18%, rgba(122,255,120,0.09) 0%, rgba(122,255,120,0.01) 30%, rgba(122,255,120,0) 54%), radial-gradient(circle at 84% 82%, rgba(122,255,120,0.06) 0%, rgba(122,255,120,0) 48%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '92px 112px 96px',
      }}
    >
      <WhoAreWeAccent />
      <a
        href="https://mastra.ai"
        target="_blank"
        rel="noreferrer"
        style={{
          position: 'absolute',
          top: 90,
          right: 118,
          display: 'inline-flex',
          alignItems: 'center',
          opacity: 0.86,
        }}
      >
        <img
          src={mastraLogoWhite}
          alt="Mastra logo"
          style={{ width: 80, height: 48, objectFit: 'contain' }}
        />
      </a>

      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--osd-font-display)',
          fontSize: 94,
          fontWeight: 530,
          lineHeight: 1.03,
          letterSpacing: '0.006em',
          color: '#f3f7f9',
        }}
      >
        Meet your hosts
      </h2>

      <div
        style={{
          marginTop: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          maxWidth: 950,
        }}
      >
        <PersonCard
          name="Alex Booker"
          xHandle="@bookercodes"
          xUrl="https://x.com/bookercodes"
          linkedInHandle="bookercodes"
          linkedInUrl="https://www.linkedin.com/in/bookercodes"
          bulletOne="Developer Educator at Mastra"
          bulletTwo="Workshop host"
          headshot={alexBookerHeadshot}
          headshotPosition="center 18%"
        />
        <PersonCard
          name="Ward Peeters"
          xHandle="@wardpeet"
          xUrl="https://x.com/wardpeet"
          linkedInHandle="wardpeet"
          linkedInUrl="https://www.linkedin.com/in/wardpeet/?skipRedirect=true"
          bulletOne="OSS Lead at Mastra"
          bulletTwo="Founding Engineer at Mastra"
          placeholderHint="Ward headshot"
        />
      </div>
    </div>
    <Footer />
  </div>
);

export const meta: SlideMeta = {
  title: 'Agent-to-Agent with Mastra',
  theme: 'mastra',
  createdAt: '2026-05-28T13:18:34.302Z',
};

export default [Cover, Welcome, Agenda, Hosts] satisfies Page[];
