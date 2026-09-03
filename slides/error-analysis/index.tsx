import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

export const design: DesignSystem = {
  palette: {
    bg: '#071019',
    text: '#f3f8fc',
    accent: '#42d9ff',
  },
  fonts: {
    display: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  typeScale: {
    hero: 112,
    body: 34,
  },
  radius: 24,
};

const colors = {
  panel: '#0c1823',
  panelRaised: '#102230',
  border: '#1b3445',
  muted: '#91a5b5',
  amber: '#ffbe55',
  green: '#6fe3a1',
} as const;

const animationStyles = `
  @keyframes error-analysis-enter {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes error-analysis-pulse {
    0%, 100% { opacity: 0.42; }
    50% { opacity: 0.9; }
  }
  .error-analysis-enter {
    animation: error-analysis-enter 420ms cubic-bezier(0, 0, 0.2, 1) both;
  }
  @media (prefers-reduced-motion: reduce) {
    .error-analysis-enter { animation: none; }
    .error-analysis-pulse { animation: none !important; }
  }
`;

const Stage = ({
  number,
  label,
  detail,
  color,
  delay,
}: {
  number: string;
  label: string;
  detail: string;
  color: string;
  delay: number;
}) => (
  <div
    className="error-analysis-enter"
    style={{
      flex: 1,
      minWidth: 0,
      height: 300,
      border: `1px solid ${colors.border}`,
      borderRadius: 'var(--osd-radius)',
      background: `linear-gradient(145deg, ${colors.panelRaised}, ${colors.panel})`,
      padding: '38px 40px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      animationDelay: `${delay}ms`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span
        style={{
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: '0.14em',
          color,
        }}
      >
        {number}
      </span>
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 24px ${color}`,
        }}
      />
    </div>
    <div>
      <h2
        style={{
          margin: '0 0 18px',
          fontFamily: 'var(--osd-font-display)',
          fontSize: 52,
          lineHeight: 1.05,
          letterSpacing: '-0.035em',
        }}
      >
        {label}
      </h2>
      <p
        style={{
          margin: 0,
          color: colors.muted,
          fontSize: 28,
          lineHeight: 1.45,
        }}
      >
        {detail}
      </p>
    </div>
  </div>
);

const Arrow = () => (
  <div
    aria-hidden="true"
    style={{
      width: 70,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.muted,
      fontSize: 42,
      flexShrink: 0,
    }}
  >
    →
  </div>
);

const EvalApproach = ({
  label,
  title,
  detail,
  source,
  color,
  delay,
}: {
  label: string;
  title: string;
  detail: string;
  source: string;
  color: string;
  delay: number;
}) => (
  <div
    className="error-analysis-enter"
    style={{
      flex: 1,
      minWidth: 0,
      height: 520,
      boxSizing: 'border-box',
      padding: '46px 50px',
      borderRadius: 'var(--osd-radius)',
      border: `1px solid ${colors.border}`,
      background: `linear-gradient(145deg, ${colors.panelRaised}, ${colors.panel})`,
      display: 'flex',
      flexDirection: 'column',
      animationDelay: `${delay}ms`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span
        style={{
          color,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span
        style={{
          padding: '9px 14px',
          borderRadius: 999,
          border: `1px solid ${color}`,
          color,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {source}
      </span>
    </div>

    <h2
      style={{
        margin: '58px 0 24px',
        fontFamily: 'var(--osd-font-display)',
        fontSize: 66,
        fontWeight: 830,
        lineHeight: 1,
        letterSpacing: '-0.045em',
      }}
    >
      {title}
    </h2>
    <p style={{ margin: 0, maxWidth: 570, color: colors.muted, fontSize: 32, lineHeight: 1.5 }}>{detail}</p>

    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 14, color, fontSize: 23 }}>
      <span style={{ width: 34, height: 2, background: color }} />
      Defines what good looks like
    </div>
  </div>
);

const BuildingEvals: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden',
      padding: '92px 120px 82px',
      background:
        'radial-gradient(850px 500px at 16% 0%, rgba(66, 217, 255, 0.1), transparent 66%), var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    <style>{animationStyles}</style>

    <div style={{ marginBottom: 58 }}>
      <div
        style={{
          marginBottom: 18,
          color: 'var(--osd-accent)',
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        Designing evaluations
      </div>
      <h1
        className="error-analysis-enter"
        style={{
          margin: 0,
          fontFamily: 'var(--osd-font-display)',
          fontSize: 88,
          fontWeight: 850,
          lineHeight: 1,
          letterSpacing: '-0.05em',
        }}
      >
        Two ways to determine what to evaluate
      </h1>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
      <EvalApproach
        label="01 / Top down"
        title="Start with requirements"
        detail="Translate the product’s intended behavior and success criteria into evals."
        source="Product-led"
        color="var(--osd-accent)"
        delay={80}
      />

      <div
        aria-hidden="true"
        style={{
          width: 68,
          height: 68,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: `1px solid ${colors.border}`,
          background: colors.panel,
          color: colors.muted,
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        +
      </div>

      <EvalApproach
        label="02 / Bottom up"
        title="Start with the data"
        detail="Use real traces and recurring failures to discover the evals you need."
        source="Data-led"
        color={colors.green}
        delay={160}
      />
    </div>

    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        color: colors.muted,
        fontSize: 22,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ width: 54, height: 2, background: 'var(--osd-accent)' }} />
      The strongest eval suite uses both
      <span style={{ width: 54, height: 2, background: colors.green }} />
    </div>
  </div>
);

const ErrorAnalysis: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden',
      padding: '96px 120px 88px',
      background:
        'radial-gradient(900px 540px at 84% 0%, rgba(66, 217, 255, 0.11), transparent 66%), var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    <style>{animationStyles}</style>

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 70,
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 20,
            color: 'var(--osd-accent)',
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <span
            className="error-analysis-pulse"
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--osd-accent)',
              animation: 'error-analysis-pulse 2.4s ease-in-out infinite',
            }}
          />
          Agent quality loop
        </div>
        <h1
          className="error-analysis-enter"
          style={{
            margin: 0,
            fontFamily: 'var(--osd-font-display)',
            fontSize: 'var(--osd-size-hero)',
            fontWeight: 850,
            lineHeight: 0.98,
            letterSpacing: '-0.055em',
          }}
        >
          Error analysis
        </h1>
      </div>

      <div
        style={{
          width: 360,
          padding: '22px 26px',
          border: `1px solid ${colors.border}`,
          borderRadius: 18,
          background: 'rgba(12, 24, 35, 0.72)',
        }}
      >
        <div style={{ color: colors.muted, fontSize: 22, marginBottom: 14 }}>Objective</div>
        <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.25 }}>Turn failures into a better agent.</div>
      </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Stage
        number="01"
        label="Analyze your data"
        detail="Find recurring failures and the conditions behind them."
        color="var(--osd-accent)"
        delay={80}
      />
      <Arrow />
      <Stage
        number="02"
        label="Measure"
        detail="Track the signals that reveal whether changes work."
        color={colors.amber}
        delay={160}
      />
      <Arrow />
      <Stage
        number="03"
        label="Improve your agent"
        detail="Apply what you learned, then run the loop again."
        color={colors.green}
        delay={240}
      />
    </div>

    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 48,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        color: colors.muted,
        fontSize: 22,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ width: 36, height: 2, background: 'var(--osd-accent)' }} />
      Observe · evaluate · iterate
    </div>
  </div>
);

const ProcessStep = ({
  number,
  title,
  note,
  color,
}: {
  number: string;
  title: string;
  note: string;
  color: string;
}) => (
  <div
    style={{
      minHeight: 96,
      boxSizing: 'border-box',
      display: 'grid',
      gridTemplateColumns: '58px 1fr',
      alignItems: 'center',
      gap: 18,
      padding: '15px 18px',
      borderRadius: 16,
      border: `1px solid ${colors.border}`,
      background: 'rgba(7, 16, 25, 0.62)',
    }}
  >
    <div
      style={{
        width: 50,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: `${color}16`,
        border: `1px solid ${color}`,
        color,
        fontSize: 22,
        fontWeight: 850,
      }}
    >
      {number}
    </div>
    <div>
      <div style={{ fontSize: 31, fontWeight: 760, lineHeight: 1.1, letterSpacing: '-0.025em' }}>{title}</div>
      <div style={{ marginTop: 7, color: colors.muted, fontSize: 21, lineHeight: 1.25 }}>{note}</div>
    </div>
  </div>
);

const PhasePanel = ({
  label,
  color,
  children,
  delay,
}: {
  label: string;
  color: string;
  children: React.ReactNode;
  delay: number;
}) => (
  <div
    className="error-analysis-enter"
    style={{
      minWidth: 0,
      height: 570,
      boxSizing: 'border-box',
      padding: '34px 30px',
      borderRadius: 'var(--osd-radius)',
      border: `1px solid ${colors.border}`,
      background: `linear-gradient(155deg, ${color}0d, ${colors.panel} 54%)`,
      animationDelay: `${delay}ms`,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        marginBottom: 30,
        color,
        fontSize: 23,
        fontWeight: 850,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 20px ${color}` }} />
      {label}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
  </div>
);

const ErrorAnalysisSteps: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden',
      padding: '84px 120px 72px',
      background:
        'radial-gradient(900px 520px at 50% 0%, rgba(66, 217, 255, 0.09), transparent 68%), var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    <style>{animationStyles}</style>

    <div style={{ marginBottom: 52 }}>
      <div
        style={{
          marginBottom: 16,
          color: 'var(--osd-accent)',
          fontSize: 23,
          fontWeight: 850,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        The error analysis workflow
      </div>
      <h1
        className="error-analysis-enter"
        style={{
          margin: 0,
          fontFamily: 'var(--osd-font-display)',
          fontSize: 86,
          fontWeight: 850,
          lineHeight: 1,
          letterSpacing: '-0.05em',
        }}
      >
        From traces to a better agent
      </h1>
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.08fr 0.92fr 0.92fr',
        gap: 26,
      }}
    >
      <PhasePanel label="Discover" color="var(--osd-accent)" delay={80}>
        <ProcessStep number="01" title="Curate a dataset" note="Representative examples" color="var(--osd-accent)" />
        <ProcessStep number="02" title="Run the agent" note="Capture real behavior" color="var(--osd-accent)" />
        <ProcessStep number="03" title="Review traces" note="Comment on failures" color="var(--osd-accent)" />
      </PhasePanel>

      <PhasePanel label="Synthesize" color={colors.amber} delay={160}>
        <ProcessStep number="04" title="Cluster patterns" note="Group repeated findings" color={colors.amber} />
        <ProcessStep number="05" title="Pick eval areas" note="Prioritize what matters" color={colors.amber} />
      </PhasePanel>

      <PhasePanel label="Improve" color={colors.green} delay={240}>
        <ProcessStep number="06" title="Score a baseline" note="Run your scorers" color={colors.green} />
        <ProcessStep number="07" title="Improve the agent" note="Change with confidence" color={colors.green} />
      </PhasePanel>
    </div>

    <div
      style={{
        position: 'absolute',
        right: 120,
        bottom: 34,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        color: colors.muted,
        fontSize: 21,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      Improve · measure · repeat
      <span style={{ color: colors.green, fontSize: 28 }}>↻</span>
    </div>
  </div>
);

const ReviewLoopPhase = ({
  number,
  title,
  detail,
  color,
  badge,
}: {
  number: string;
  title: string;
  detail: string;
  color: string;
  badge?: string;
}) => (
  <div
    style={{
      height: 190,
      boxSizing: 'border-box',
      padding: '26px 28px',
      borderRadius: 20,
      border: `1px solid ${badge ? color : colors.border}`,
      background: badge ? `${color}0f` : `linear-gradient(145deg, ${colors.panelRaised}, ${colors.panel})`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color, fontSize: 21, fontWeight: 850, letterSpacing: '0.14em' }}>{number}</span>
      {badge ? (
        <span
          style={{
            padding: '6px 10px',
            borderRadius: 999,
            background: `${color}18`,
            color,
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </span>
      ) : null}
    </div>
    <div>
      <div style={{ fontSize: 35, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.035em' }}>{title}</div>
      <div style={{ marginTop: 11, color: colors.muted, fontSize: 22, lineHeight: 1.3 }}>{detail}</div>
    </div>
  </div>
);

const FlowArrow = ({ direction = 'right' }: { direction?: 'right' | 'left' }) => (
  <div
    aria-hidden="true"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.muted,
      fontSize: 38,
    }}
  >
    {direction === 'right' ? '→' : '←'}
  </div>
);

const ExperimentReviewLoop: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden',
      padding: '80px 120px 70px',
      background:
        'radial-gradient(980px 560px at 86% 8%, rgba(66, 217, 255, 0.1), transparent 66%), var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    <style>{animationStyles}</style>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
      <div>
        <div
          style={{
            marginBottom: 14,
            color: 'var(--osd-accent)',
            fontSize: 23,
            fontWeight: 850,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Experiment review skill
        </div>
        <h1
          className="error-analysis-enter"
          style={{
            margin: 0,
            fontFamily: 'var(--osd-font-display)',
            fontSize: 80,
            fontWeight: 850,
            lineHeight: 1,
            letterSpacing: '-0.05em',
          }}
        >
          The experiment review loop
        </h1>
      </div>

      <div
        style={{
          marginTop: 38,
          padding: '15px 20px',
          borderRadius: 999,
          border: `1px solid ${colors.amber}`,
          color: colors.amber,
          fontSize: 21,
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        Human in the loop
      </div>
    </div>

    <div className="error-analysis-enter" style={{ position: 'relative', animationDelay: '100ms' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 1fr 64px 1fr' }}>
        <ReviewLoopPhase number="01" title="Load evidence" detail="Select the latest experiment and fetch every result." color="var(--osd-accent)" />
        <FlowArrow />
        <ReviewLoopPhase number="02" title="Detect failures" detail="Generate candidate signals—not final judgments." color="var(--osd-accent)" />
        <FlowArrow />
        <ReviewLoopPhase number="03" title="Embed & cluster" detail="Project similar failures into common patterns." color="var(--osd-accent)" />
      </div>

      <div
        aria-hidden="true"
        style={{
          height: 74,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 210,
          color: colors.muted,
          fontSize: 38,
        }}
      >
        ↓
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 1fr 64px 1fr' }}>
        <ReviewLoopPhase number="06" title="Re-review & iterate" detail="Update the rubric, reports, tags, and next sample." color={colors.green} />
        <FlowArrow direction="left" />
        <ReviewLoopPhase
          number="05"
          title="Consume feedback"
          detail="Let human judgment correct the machine taxonomy."
          color={colors.amber}
          badge="Human"
        />
        <FlowArrow direction="left" />
        <ReviewLoopPhase number="04" title="Queue samples" detail="Send diverse representatives to Studio Inbox." color={colors.green} />
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 28,
          bottom: -70,
          width: 520,
          height: 54,
          borderLeft: `2px solid ${colors.green}70`,
          borderBottom: `2px solid ${colors.green}70`,
          borderRadius: '0 0 0 18px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 570,
          bottom: -80,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: colors.green,
          fontSize: 20,
          fontWeight: 750,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        ↻ Feedback sharpens the next pass
      </div>
    </div>
  </div>
);

export const meta: SlideMeta = {
  title: 'Error Analysis',
  createdAt: '2026-09-03T05:28:29.693Z',
};

export default [BuildingEvals, ErrorAnalysis, ErrorAnalysisSteps, ExperimentReviewLoop] satisfies Page[];
