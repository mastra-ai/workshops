import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useEffect, useState } from 'react';

import greedVf from '@assets/fonts/GreedVF.woff2';
import mastraLogoWhite from '@assets/Mastra logo white.svg';
import mastraWordmarkWhite from '@assets/Mastra wordmark white.png';
import alexBookerHeadshot from './assets/Alex Booker.png';
import joelSmithHeadshot from './assets/Joel Smith.png';

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
  textSoft: '#a9b1bc',
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
  fontFeatureSettings: '"ss01", "ss02"',
};

const fontStyles = `
  @font-face {
    font-family: 'Greed';
    src: url(${greedVf}) format('woff2');
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
  }
  *::selection {
    background: rgba(122, 255, 120, 0.42);
    color: #07090b;
  }
`;

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
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: compact ? 5 : 6,
          height: compact ? 5 : 6,
          marginLeft: compact ? -2.5 : -3,
          marginTop: compact ? -2.5 : -3,
          borderRadius: '50%',
          background: '#e7ebef',
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: compact ? 5 : 6,
          borderRadius: '50%',
          border: '2px solid #e7ebef',
          opacity: 0.85,
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 1,
          borderRadius: '50%',
          border: '2px solid #e7ebef',
          opacity: 0.6,
        }}
      />
    </span>
    <span>Workshop</span>
  </div>
);

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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  </>
);

const Header = ({ useWordmark }: { useWordmark: boolean }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    {useWordmark ? (
      <a
        href="https://mastra.ai"
        target="_blank"
        rel="noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        <img
          src={mastraWordmarkWhite}
          alt="Mastra wordmark"
          style={{ width: 332, height: 84, objectFit: 'contain' }}
        />
      </a>
    ) : (
      <img src={mastraLogoWhite} alt="Mastra logo" style={{ width: 76, height: 48, objectFit: 'contain' }} />
    )}
    <WorkshopBadge />
  </div>
);

const Cover: Page = () => (
  <div style={fill}>
    <Frame>
      <Header useWordmark />
      <h1
        style={{
          margin: '120px 0 0 0',
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 520,
          fontStretch: '112%',
          letterSpacing: '0.015em',
          lineHeight: 1.1,
          maxWidth: 1240,
          textWrap: 'balance',
        }}
      >
        Monitor, Debug, and Evaluate Agents with Mastra
      </h1>
    </Frame>
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

const WorkshopsOverview: Page = () => (
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
  </div>
);

const AgendaItem = ({
  number,
  title,
}: {
  number: string;
  title: string;
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      padding: '18px 0',
      borderBottom: '1px solid rgba(122, 255, 120, 0.08)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
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
      <h3
        style={{
          margin: 0,
          fontFamily: 'var(--osd-font-display)',
          fontSize: 46,
          fontWeight: 500,
          lineHeight: 1.12,
          letterSpacing: '0.002em',
          color: '#e2e8ee',
        }}
      >
        {title}
      </h3>
    </div>
  </div>
);

const AgendaInfo = ({ text }: { text: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '18px 0 10px',
    }}
  >
    <span
      style={{
        width: 46,
        height: 46,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        fontWeight: 600,
        lineHeight: 1,
        color: '#8be889',
        background: 'rgba(122, 255, 120, 0.1)',
        border: '1px solid rgba(122, 255, 120, 0.2)',
      }}
      aria-hidden
    >
      i
    </span>
    <p
      style={{
        margin: 0,
        fontSize: 36,
        fontWeight: 470,
        lineHeight: 1.2,
        letterSpacing: '0.002em',
        color: '#b8c5d1',
      }}
    >
      {text}
    </p>
  </div>
);

const Agenda: Page = () => (
  <div style={fill}>
    <style>{fontStyles}</style>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 78% 22%, rgba(122,255,120,0.09) 0%, rgba(122,255,120,0.02) 26%, rgba(122,255,120,0) 52%), radial-gradient(circle at 14% 86%, rgba(122,255,120,0.05) 0%, rgba(122,255,120,0) 44%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '92px 112px 96px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
      >What you'll learn</h2>

      <div
        style={{
          marginTop: 32,
          width: 1500,
          borderRadius: 30,
          padding: '12px 22px 6px',
          background: 'linear-gradient(180deg, rgba(8,14,11,0.64) 0%, rgba(5,9,8,0.42) 100%)',
          border: '1px solid rgba(122,255,120,0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <AgendaItem
          number="1"
          title="Why observability is essential"
        />
        <AgendaItem
          number="2"
          title="How to monitor and debug Mastra agents"
        />
        <AgendaItem
          number="3"
          title="How to score production traces with Studio"
        />
        <AgendaItem
          number="4"
          title="Create a production feedback loop"
        />
        <AgendaInfo text="Share questions in the chat anytime - we'll answer them throughout and at the end" />
      </div>
    </div>
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
}: {
  name: string;
  xHandle: string;
  xUrl: string;
  linkedInHandle: string;
  linkedInUrl: string;
  bulletOne: string;
  bulletTwo: string;
  bulletThree?: string;
  headshot: string;
  headshotPosition: string;
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

const WhoAreWe: Page = () => (
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
      >Meet your hosts</h2>

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
          name="Joel Smith"
          xHandle="@jsumnersmith"
          xUrl="https://x.com/jsumnersmith"
          linkedInHandle="jsumnersmith"
          linkedInUrl="https://www.linkedin.com/in/jsumnersmith/"
          bulletOne="Head of Platform at Mastra"
          bulletTwo="10+ years in developer products"
          bulletThree="Previously at Gatsby!"
          headshot={joelSmithHeadshot}
          headshotPosition="center 20%"
        />
      </div>
    </div>
  </div>
);

const questionCloudStyles = `
  @keyframes questionFloat {
    0% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(0, -14px, 0) scale(1.01); }
    100% { transform: translate3d(0, 0, 0); }
  }
`;

const QuestionChip = ({
  text,
  left,
  top,
  width,
  delay,
  duration,
}: {
  text: string;
  left: number;
  top: number;
  width: number;
  delay: string;
  duration: string;
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width,
      borderRadius: 20,
      padding: '18px 22px',
      border: '1px solid rgba(122,255,120,0.16)',
      background: 'linear-gradient(180deg, rgba(8,14,11,0.82) 0%, rgba(5,10,8,0.58) 100%)',
      color: '#d2dae3',
      fontSize: 34,
      lineHeight: 1.2,
      fontWeight: 450,
      letterSpacing: '0.002em',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 28px rgba(0,0,0,0.22)',
      animationName: 'questionFloat',
      animationDuration: duration,
      animationDelay: delay,
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease-in-out',
    }}
  >
    {text}
  </div>
);

const QuestionCloud: Page = () => {
  const [showCallout, setShowCallout] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const nextKeys = ['ArrowRight', 'PageDown', ' ', 'Enter'];
      const prevKeys = ['ArrowLeft', 'PageUp', 'Backspace'];

      if (!showCallout && nextKeys.includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        setShowCallout(true);
        return;
      }

      if (showCallout && prevKeys.includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        setShowCallout(false);
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [showCallout]);

  return (
    <div style={fill}>
      <style>{`${fontStyles}\n${questionCloudStyles}`}</style>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 18% 20%, rgba(122,255,120,0.1) 0%, rgba(122,255,120,0.01) 34%, rgba(122,255,120,0) 60%), radial-gradient(circle at 84% 82%, rgba(122,255,120,0.06) 0%, rgba(122,255,120,0) 52%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '92px 112px 96px',
        }}
      >
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

        <QuestionChip text="What happened?" left={128} top={146} width={420} delay="0s" duration="6.9s" />
        <QuestionChip text="Why did it happen?" left={578} top={150} width={452} delay="0.8s" duration="7.4s" />
        <QuestionChip text="Who was affected?" left={1044} top={196} width={454} delay="1.6s" duration="7.1s" />
        <QuestionChip text="How often has it happened?" left={208} top={300} width={526} delay="0.4s" duration="7.8s" />
        <QuestionChip text="Was this an isolated failure or a pattern?" left={754} top={322} width={766} delay="1.1s" duration="8s" />
        <QuestionChip
          text="Which component failed: prompt, retrieval, tool, memory, model, or policy?"
          left={140}
          top={474}
          width={1160}
          delay="0.2s"
          duration="8.6s"
        />
        <QuestionChip text="What changed?" left={1320} top={478} width={286} delay="1.5s" duration="7.3s" />
        <QuestionChip text="What will prevent recurrence?" left={430} top={640} width={604} delay="0.9s" duration="7.9s" />
        <QuestionChip text="Where did all my token budget go?" left={1060} top={640} width={560} delay="1.3s" duration="7.2s" />

        <div
          style={{
            position: 'absolute',
            right: 118,
            bottom: 84,
            width: 676,
            borderRadius: 18,
            border: '1px solid rgba(122,255,120,0.18)',
            background: 'linear-gradient(180deg, rgba(8,14,11,0.84) 0%, rgba(5,10,8,0.62) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 26px rgba(0,0,0,0.24)',
            padding: '18px 22px',
            opacity: showCallout ? 1 : 0,
            transform: showCallout ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 320ms ease, transform 320ms ease',
            pointerEvents: showCallout ? 'auto' : 'none',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 29,
              lineHeight: 1.3,
              color: '#c9d2db',
              fontWeight: 430,
            }}
          >
            <span style={{ color: 'var(--osd-accent)', fontWeight: 520 }}>Accountability:</span> When you put an agent into
            the world, you do not outsource accountability to the model. You assume it. Observability helps you see what
            happened, diagnose what went wrong, and fix it.
          </p>
        </div>
      </div>
    </div>
  );
};

const LogsIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="5" width="28" height="24" rx="7" stroke="currentColor" strokeWidth="2" />
    <path d="M10 13H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 18H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 23H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MetricsIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M6 27V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 27V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 27V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 27V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TracesIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="7" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="27" cy="17" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="10" cy="27" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M10 9L24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 19L13 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PillarCard = ({
  icon,
  title,
  detail,
  example,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  example: string;
}) => (
  <div
    style={{
      flex: 1,
      borderRadius: 24,
      padding: '28px 26px 24px',
      border: '1px solid rgba(122,255,120,0.14)',
      background: 'linear-gradient(180deg, rgba(8,14,11,0.78) 0%, rgba(5,10,8,0.6) 100%)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
    }}
  >
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, color: 'var(--osd-accent)' }}>
      <span style={{ display: 'inline-flex' }}>{icon}</span>
      <h3
        style={{
          margin: 0,
          fontFamily: 'var(--osd-font-display)',
          fontSize: 48,
          lineHeight: 1.06,
          fontWeight: 520,
          letterSpacing: '0.005em',
          color: '#eaf0f4',
        }}
      >
        {title}
      </h3>
    </div>

    <p style={{ margin: 0, fontSize: 30, lineHeight: 1.24, color: '#b8c3ce', fontWeight: 430 }}>{detail}</p>
    <p style={{ margin: 0, fontSize: 27, lineHeight: 1.26, color: '#98a6b4', fontWeight: 420 }}>
      <span style={{ color: 'var(--osd-accent)', fontWeight: 500 }}>example:</span> {example}
    </p>
  </div>
);

const ThreePillars: Page = () => (
  <div style={fill}>
    <style>{fontStyles}</style>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 14% 14%, rgba(122,255,120,0.08) 0%, rgba(122,255,120,0.01) 34%, rgba(122,255,120,0) 56%), radial-gradient(circle at 88% 84%, rgba(122,255,120,0.05) 0%, rgba(122,255,120,0) 48%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '92px 112px 96px',
      }}
    >
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
          fontSize: 82,
          fontWeight: 530,
          lineHeight: 1.04,
          letterSpacing: '0.006em',
          color: '#f3f7f9',
        }}
      >
        Three Pillars of Observability
      </h2>

      <div style={{ marginTop: 62, display: 'flex', gap: 18 }}>
        <PillarCard
          icon={<LogsIcon />}
          title="Logs"
          detail="Detailed records of discrete events that happened in a system."
          example="Prompts, responses, tool calls, retrieval results, and decisions."
        />
        <PillarCard
          icon={<TracesIcon />}
          title="Traces"
          detail="End-to-end records of how a request travels through distributed services."
          example="Full agent workflow across planning, memory, tools, models, and guardrails."
        />
        <PillarCard
          icon={<MetricsIcon />}
          title="Metrics"
          detail="Numerical measurements of system health and performance, often aggregated over time."
          example="Tokens, cost, step latency, success rate, tool accuracy, and quality scores."
        />
      </div>
    </div>
  </div>
);

const ObservabilityColumn = ({
  heading,
  points,
  link,
  linkLabel,
}: {
  heading: string;
  points: string[];
  link?: string;
  linkLabel?: string;
}) => (
  <div
    style={{
      flex: 1,
      borderRadius: 24,
      padding: '26px 24px 24px',
      border: '1px solid rgba(122,255,120,0.14)',
      background: 'linear-gradient(180deg, rgba(8,14,11,0.8) 0%, rgba(5,10,8,0.62) 100%)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
    }}
  >
    <h3
      style={{
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 52,
        lineHeight: 1.04,
        fontWeight: 520,
        color: '#ecf2f6',
      }}
    >
      {heading}
    </h3>

    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {points.map((point, idx) => (
        <p key={idx} style={{ margin: 0, fontSize: 28, lineHeight: 1.24, color: '#b7c3cf', fontWeight: 430 }}>
          <span style={{ color: 'var(--osd-accent)' }}>•</span> {point}
        </p>
      ))}
    </div>

    {link && linkLabel ? (
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        style={{
          marginTop: 20,
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          border: '1px solid rgba(122,255,120,0.24)',
          color: '#9afc96',
          borderRadius: 999,
          padding: '12px 22px 12px 16px',
          fontSize: 24,
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: '0.006em',
          background: 'linear-gradient(180deg, rgba(9, 20, 14, 0.9) 0%, rgba(6, 15, 10, 0.86) 100%)',
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(122,255,120,0.08)',
            border: '1px solid rgba(122,255,120,0.18)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M5 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 6L18 12L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{linkLabel}</span>
      </a>
    ) : null}
  </div>
);

const ObservabilityInMastra: Page = () => {
  const [showNextDemo, setShowNextDemo] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const nextKeys = ['ArrowRight', 'PageDown', ' ', 'Enter'];
      const prevKeys = ['ArrowLeft', 'PageUp', 'Backspace'];

      if (!showNextDemo && nextKeys.includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        setShowNextDemo(true);
        return;
      }

      if (showNextDemo && prevKeys.includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        setShowNextDemo(false);
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [showNextDemo]);

  return (
    <div style={fill}>
      <style>{fontStyles}</style>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 14% 16%, rgba(122,255,120,0.09) 0%, rgba(122,255,120,0.01) 36%, rgba(122,255,120,0) 56%), radial-gradient(circle at 88% 84%, rgba(122,255,120,0.05) 0%, rgba(122,255,120,0) 50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '92px 112px 96px',
        }}
      >
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
            fontSize: 76,
            fontWeight: 530,
            lineHeight: 1.06,
            letterSpacing: '0.006em',
            color: '#f3f7f9',
          }}
        >
          How observability works in Mastra
        </h2>

        <div style={{ marginTop: 62, display: 'flex', gap: 20 }}>
          <ObservabilityColumn
            heading="Framework"
            points={[
              'Mastra open source TS framework has powerful observability system.',
              'Capture traces, logs, and metrics.',
              'Export anywhere.',
            ]}
          />

          <ObservabilityColumn
            heading="Mastra Observability"
            points={[
              'Hosted sink for telemetry captured by Mastra.',
              'Powered by ClickHouse for enormous scale.',
              'Connect traces to Studio to run scorers and curate datasets.',
              'Shareable with your team through Mastra Platform.',
            ]}
            link="https://mastra.ai/platform-observability"
            linkLabel="mastra.ai/platform-observability"
          />
        </div>

        <div
          style={{
            position: 'absolute',
            right: 118,
            bottom: 84,
            borderRadius: 999,
            padding: '12px 18px',
            color: '#8fe48c',
            border: '1px solid rgba(122,255,120,0.2)',
            background: 'rgba(122,255,120,0.08)',
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: '0.01em',
            opacity: showNextDemo ? 1 : 0,
            transform: showNextDemo ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 260ms ease, transform 260ms ease',
            pointerEvents: showNextDemo ? 'auto' : 'none',
          }}
        >
          Next: live demo
        </div>
      </div>
    </div>
  );
};

export const meta: SlideMeta = {
  title: 'Monitor, Debug, and Evaluate Agents with Mastra',
  theme: 'mastra',
  createdAt: '2026-05-20T08:57:10.632Z',
};

export default [
  Cover,
  WorkshopsOverview,
  Agenda,
  WhoAreWe,
  QuestionCloud,
  ThreePillars,
  ObservabilityInMastra,
] satisfies Page[];
