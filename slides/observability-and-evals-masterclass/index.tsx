import { useId, useState, type ReactNode } from 'react'
import { Highlight, type PrismTheme } from 'prism-react-renderer'
import { useIsActivePage } from '@open-slide/core'
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core'
import greed from '@assets/fonts/GreedVF.woff2'
import mastraLogoWhite from '@assets/Mastra logo white.svg'
import wordmark from '@assets/Mastra wordmark black.svg'
import alexPortrait from './assets/alex-booker.png'
import evalAnatomyDiagram from './assets/eval-anatomy.svg'
import experimentComparisonScreenshot from './assets/mastra-experiment-comparison.png'
import metricsScreenshot from './assets/mastra-metrics.png'
import observabilityScreenshot from './assets/mastra-observability.png'
import threadViewScreenshot from './assets/mastra-thread-view.png'
import yujohnPortrait from './assets/yujohn-nattrass.png'

// Mastra theme foundation, matching the Future of Agents cover.
export const design: DesignSystem = {
  palette: { bg: '#07090b', text: '#f3f5f7', accent: '#9bd7a4' },
  fonts: {
    display: '"Greed", "Inter", system-ui, sans-serif',
    body: '"Greed", "Inter", system-ui, sans-serif',
  },
  typeScale: { hero: 108, body: 34 },
  radius: 22,
}

export const themeCss = `
  @font-face { font-family: Greed; src: url(${greed}) format('woff2'); font-weight: 100 900; font-display: swap; }
  .observability-evals-masterclass {
    --mw-bg: var(--osd-bg, #07090b); --mw-text: var(--osd-text, #f3f5f7); --mw-accent: var(--osd-accent, #9bd7a4);
    --mw-shell: #040506; --mw-panel: #090c11; --mw-border: #29332d;
    --mw-muted: #a2aca5; --mw-subtle: #111913; --mw-pill: #142619; --mw-emphasis: #23442b;
    --mw-shadow: rgba(0,0,0,.3); color-scheme: dark;
    width: 100%; height: 100%; position: relative; isolation: isolate;
    background: var(--mw-bg); color: var(--mw-text);
    font-family: var(--osd-font-body, Greed, system-ui, sans-serif); letter-spacing: .015em;
  }
  .observability-evals-masterclass, .observability-evals-masterclass * { box-sizing: border-box; }
  .observability-evals-masterclass a:focus-visible, .observability-evals-masterclass button:focus-visible { outline: 4px solid var(--mw-accent); outline-offset: 6px; }
  .mw-trace-children {
    list-style: none;
    margin: 12px 0 0 40px;
    padding-left: 44px;
    border-left: 2px solid var(--mw-border);
    display: grid;
    gap: 12px;
  }
  .mw-trace-children > li > .mw-trace-entry::before {
    content: '';
    position: absolute;
    top: 44px;
    left: -44px;
    width: 44px;
    border-top: 2px solid var(--mw-border);
  }
  .mw-trace-entry { position: relative; }
  .mw-trace-row { cursor: help; }
  .mw-trace-row:focus-visible { outline: 3px solid var(--mw-accent); outline-offset: 4px; }
  .mw-trace-tooltip {
    visibility: hidden;
    pointer-events: none;
    position: absolute;
    right: 170px;
    top: 50%;
    transform: translateY(-50%);
    width: 620px;
    padding: 22px 28px;
    border: 1px solid var(--mw-border);
    border-radius: 16px;
    background: var(--mw-panel);
    box-shadow: 0 8px 28px var(--mw-shadow);
    font-size: 26px;
  }
  .mw-trace-entry:has(> .mw-trace-row:is(:hover, :focus-visible)) { z-index: 1; }
  .mw-trace-row:is(:hover, :focus-visible) + .mw-trace-tooltip { visibility: visible; }
  .mw-scorer-hint { position: relative; }
  .mw-scorer-hint-trigger {
    color: var(--mw-accent);
    cursor: help;
    text-decoration: underline dotted;
    text-underline-offset: 7px;
  }
  .mw-scorer-hint-trigger:focus-visible { outline: 2px solid var(--mw-accent); outline-offset: 5px; }
  .mw-scorer-hint-tooltip {
    visibility: hidden;
    position: absolute;
    top: 100%;
    left: 50%;
    z-index: 1;
    padding: 14px 20px;
    border: 1px solid var(--mw-border);
    border-radius: 12px;
    background: var(--mw-subtle);
    box-shadow: 0 8px 28px var(--mw-shadow);
    font-size: 28px;
    white-space: nowrap;
  }
  .mw-scorer-hint:hover .mw-scorer-hint-tooltip,
  .mw-scorer-hint-trigger:focus-visible + .mw-scorer-hint-tooltip { visibility: visible; }
  .mw-eval-table[data-hide-results] :is(th, td):nth-child(n + 3) { visibility: hidden; }
  .mw-experiment-spinner {
    width: 68px;
    height: 68px;
    border: 5px solid var(--mw-border);
    border-top-color: var(--mw-accent);
    border-radius: 50%;
  }
  @keyframes mw-experiment-spin {
    to { transform: rotate(1turn); }
  }
  @keyframes mw-trace-enter {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes mw-question-drift {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @media screen and (prefers-reduced-motion: no-preference) {
    .mw-trace[data-animate="true"] .mw-trace-beat {
      animation: mw-trace-enter 280ms ease-out both;
    }
    .mw-question-cloud[data-active="true"] .mw-question-chip {
      animation: mw-question-drift 7.5s ease-in-out infinite;
    }
    .mw-experiment-spinner[data-active="true"] {
      animation: mw-experiment-spin 850ms linear infinite;
    }
  }

`
// One font/style registration; HMR replaces it instead of leaving stale rules.
if (typeof document !== 'undefined') {
  const id = 'observability-evals-masterclass-styles'
  const style = document.getElementById(id) ?? document.createElement('style')
  style.id = id
  if (style.textContent !== themeCss) style.textContent = themeCss
  if (!style.isConnected) document.head.appendChild(style)
}

const MastraPage = ({ children }: { children: ReactNode }) => <div className="observability-evals-masterclass">{children}</div>

const Frame = ({ children }: { children: ReactNode }) => <>
  <div style={{ position: 'absolute', inset: 56, borderRadius: 64, background: 'var(--mw-shell)' }} />
  <div style={{ position: 'absolute', inset: 92, borderRadius: 42, border: '1px solid var(--mw-border)', background: 'var(--mw-panel)', padding: '88px 96px' }}>{children}</div>
</>
const Title = ({ children }: { children: ReactNode }) => <h1 style={{ margin: 0, maxWidth: 1300, fontFamily: 'var(--osd-font-display)', fontSize: 'var(--osd-size-hero, 108px)', fontWeight: 520, fontStretch: '112%', lineHeight: 1.1, textWrap: 'balance' }}>{children}</h1>
const Wordmark = () => <div role="img" aria-label="Mastra" style={{ width: 332, height: 84, background: 'var(--mw-text)', mask: `url("${wordmark}") center / contain no-repeat`, WebkitMask: `url("${wordmark}") center / contain no-repeat` }} />
const EventBadge = ({ children = 'Talk' }: { children?: ReactNode }) => <div style={{ display: 'inline-flex', border: '1px solid var(--mw-border)', background: 'var(--mw-subtle)', borderRadius: 999, padding: '12px 22px', fontSize: 28, letterSpacing: '.1em', textTransform: 'uppercase' }}>{children}</div>

const QuestionChip = ({ children, x, y, width, delay, size = 36, tone = 'soft' }: {
  children: ReactNode
  x: number
  y: number
  width: number
  delay: number
  size?: number
  tone?: 'quiet' | 'soft' | 'accent'
}) => (
  <div style={{ position: 'absolute', left: x, top: y, width, transform: 'translate(-50%, -50%)' }}>
    <div className="mw-question-chip" style={{
      padding: '20px 22px', borderRadius: 999, textAlign: 'center', whiteSpace: 'nowrap',
      border: '1px solid var(--mw-border)',
      background: tone === 'quiet' ? 'var(--mw-subtle)' : tone === 'accent' ? 'var(--mw-emphasis)' : 'var(--mw-pill)',
      color: tone === 'quiet' ? 'var(--mw-muted)' : 'var(--mw-text)',
      fontSize: size, fontWeight: tone === 'quiet' ? 420 : 520, lineHeight: 1.2,
      letterSpacing: '-.015em', animationDelay: `${delay}s`,
    }}>
      {children}
    </div>
  </div>
)

const QuestionCloud: Page = () => {
  const active = useIsActivePage()

  return (
    <MastraPage>
      <Frame>
        <div className="mw-question-cloud" data-active={active} style={{
          position: 'absolute', inset: 0, borderRadius: 42,
          background: 'radial-gradient(ellipse at 50% 48%, rgba(122,255,120,.05), transparent 70%)',
        }}>
          <QuestionChip x={460} y={218} width={690} size={41} tone="accent" delay={0}>Did my agent get stuck in a loop?</QuestionChip>
          <QuestionChip x={1220} y={175} width={620} tone="quiet" delay={-2}>Are handoffs slowing it down?</QuestionChip>
          <QuestionChip x={425} y={418} width={500} tone="quiet" delay={-5}>Did it follow the policy?</QuestionChip>
          <QuestionChip x={1195} y={450} width={700} delay={-4}>How does it handle missing info?</QuestionChip>
          <QuestionChip x={490} y={681} width={680} delay={-3}>Can a cheaper model do as well?</QuestionChip>
          <QuestionChip x={1250} y={658} width={705} size={41} tone="accent" delay={-1}>Did the fix break anything else?</QuestionChip>
        </div>
      </Frame>
    </MastraPage>
  )
}

const Cover: Page = () => <MastraPage><Frame>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Wordmark /><EventBadge>Workshop</EventBadge></div>
  <div style={{ position: 'absolute', top: 172, bottom: 88, left: 96, right: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><Title>Observability and Evals<br />Masterclass</Title></div>
</Frame></MastraPage>

const portraitStyle = { display: 'block', width: 624, height: 624, objectFit: 'contain' } as const

const Introductions: Page = () => (
  <div style={{
    width: '100%', height: '100%', background: '#000', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: 48,
  }}>
    <img src={yujohnPortrait} alt="Yujohn Nattrass" style={portraitStyle} />
    <img src={alexPortrait} alt="Alex Booker" style={portraitStyle} />
  </div>
)

const MastraHomepage: Page = () => (
  <iframe
    src="https://mastra.ai/"
    title="Mastra homepage"
    style={{ display: 'block', width: '100%', height: '100%', border: 0, background: '#07090b' }}
  />
)

const TopCroppedScreenshot = ({ src, alt }: { src: string; alt: string }) => (
  <div style={{ width: '100%', height: '100%', background: '#000' }}>
    <img
      src={src}
      alt={alt}
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
    />
  </div>
)

const MastraObservability: Page = () => (
  <TopCroppedScreenshot src={observabilityScreenshot} alt="Mastra Observability traces view" />
)

const mastraCodeTheme: PrismTheme = {
  plain: { color: 'var(--mw-text)', backgroundColor: 'var(--mw-subtle)' },
  styles: [
    { types: ['comment'], style: { color: 'var(--mw-muted)' } },
    { types: ['keyword', 'operator', 'boolean', 'null'], style: { color: '#ea8270' } },
    { types: ['string', 'number'], style: { color: '#7ff193' } },
    { types: ['function', 'class-name'], style: { color: '#c370e7' } },
  ],
}

const SyntaxCode = ({ code, language }: {
  code: string
  language: 'typescript' | 'json'
}) => (
  <Highlight theme={mastraCodeTheme} code={code} language={language}>
    {({ tokens, getTokenProps }) => (
      <code>
        {tokens.map((line, index) => (
          <span key={index}>
            {index > 0 && '\n'}
            {line.map((token, tokenIndex) => <span key={tokenIndex} {...getTokenProps({ token })} />)}
          </span>
        ))}
      </code>
    )}
  </Highlight>
)

const AgendaItem = ({ number, href, children }: { number: number; href?: string; children: ReactNode }) => (
  <li style={{
    display: 'flex', alignItems: 'center', gap: 22, padding: '22px 4px',
    borderBottom: '1px solid var(--mw-border)', fontSize: 46, fontWeight: 500,
  }}>
    <span aria-hidden="true" style={{
      display: 'grid', placeItems: 'center', width: 48, height: 48, borderRadius: 14,
      background: 'var(--mw-emphasis)', color: 'var(--mw-accent)', fontSize: 28, fontWeight: 610,
    }}>{number}</span>
    {href ? (
      <a href={href} target="_blank" rel="noreferrer" style={{
        color: 'inherit', textDecoration: 'none',
      }}>{children}</a>
    ) : children}
  </li>
)

const Agenda: Page = () => (
  <MastraPage>
    <div style={{
      position: 'absolute', inset: 0, padding: '92px 112px',
      background: 'radial-gradient(ellipse at 78% 22%, rgba(122,255,120,.08), transparent 52%)',
    }}>
      <img src={mastraLogoWhite} alt="Mastra" style={{
        position: 'absolute', top: 78, right: 112, width: 64, height: 44, objectFit: 'contain', opacity: 0.9,
      }} />
      <h2 style={{ margin: 0, fontSize: 94, lineHeight: 1.05, fontWeight: 530 }}>What you’ll learn</h2>
      <ol role="list" style={{
        listStyle: 'none', width: 1500, margin: '32px 0 0', padding: '10px 24px', borderRadius: 30,
        border: '1px solid var(--mw-border)', background: 'var(--mw-panel)',
      }}>
        <AgendaItem number={1} href="https://mastra.ai/blog/get-started-with-mastra-observability#understand-every-agent-run">
          Understand every agent run
        </AgendaItem>
        <AgendaItem number={2} href="https://mastra.ai/blog/get-started-with-mastra-observability#monitor-performance-cost-and-correctness">
          Monitor performance, cost, and correctness
        </AgendaItem>
        <AgendaItem number={3}>Build an eval loop</AgendaItem>
        <AgendaItem number={4}>Diagnose failures with error analysis</AgendaItem>
        <AgendaItem number={5}>Catch regressions in CI</AgendaItem>
      </ol>
    </div>
  </MastraPage>
)

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <MastraPage>
    <Frame>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', paddingInline: 96 }}>
        <h2 style={{ margin: 0, fontSize: 108, fontWeight: 520, textAlign: 'center', textWrap: 'balance' }}>{children}</h2>
      </div>
    </Frame>
  </MastraPage>
)

const UnderstandEveryRun: Page = () => <SectionTitle>Understand every run</SectionTitle>
const EvalsTitle: Page = () => <SectionTitle>Evals</SectionTitle>
const EvalLoopTitle: Page = () => <SectionTitle>Build an eval loop</SectionTitle>
const ErrorAnalysisTitle: Page = () => <SectionTitle>Diagnose failures with error analysis</SectionTitle>
const CatchRegressionsTitle: Page = () => <SectionTitle>Catch regressions in CI</SectionTitle>

const spanTypes = {
  agent_run: { kind: 'Agent', label: 'Agent run', color: '#7ab1f8' },
  model_inference: { kind: 'Model', label: 'Model call', color: '#cd90e3' },
  tool_call: { kind: 'Tool', label: 'Tool call', color: '#c1b040' },
}

type TraceSpanData = {
  spanId: string
  parentSpanId: string | null
  type: keyof typeof spanTypes
  name: string
  durationMs: number
  offsetMs: number
  status: string
  input: string
  output: string
  attributes: Record<string, string | number | boolean>
}

const demoTrace: { traceId: string; spans: TraceSpanData[] } = {
  traceId: 'docs-demo',
  spans: [
    {
      spanId: '01', parentSpanId: null, type: 'agent_run', name: 'Mastra Docs', durationMs: 41400, status: 'Completed',
      offsetMs: 0, attributes: { agentId: 'mastra-docs', maxSteps: 8 },
      input: 'Streams vs durable agents?', output: 'Streams replay. Durable agents resume.',
    },
    {
      spanId: '02', parentSpanId: '01', type: 'model_inference', name: 'Plan the search', durationMs: 4180, status: 'Completed',
      offsetMs: 6000, attributes: { model: 'gpt-5-nano', provider: 'openai', stepIndex: 0 },
      input: 'User question', output: 'Search for both terms',
    },
    {
      spanId: '03', parentSpanId: '01', type: 'tool_call', name: 'searchDocs', durationMs: 90, status: 'Completed',
      offsetMs: 10180, attributes: { toolId: 'searchDocs', success: true },
      input: 'Resumable streams, durable agents', output: '2 guides found',
    },
    {
      spanId: '04', parentSpanId: '01', type: 'model_inference', name: 'Choose a page', durationMs: 3150, status: 'Completed',
      offsetMs: 10270, attributes: { model: 'gpt-5-nano', provider: 'openai', stepIndex: 1 },
      input: '2 guide titles', output: 'Resumable streams guide',
    },
    {
      spanId: '05', parentSpanId: '01', type: 'tool_call', name: 'readDocs', durationMs: 517, status: 'Completed',
      offsetMs: 13420, attributes: { toolId: 'readDocs', success: true },
      input: 'Resumable streams guide', output: 'Replay cached chunks',
    },
    {
      spanId: '06', parentSpanId: '01', type: 'tool_call', name: 'askDocsSpecialist', durationMs: 2400, status: 'Completed',
      offsetMs: 13937, attributes: { toolId: 'askDocsSpecialist', success: true },
      input: 'Do runs survive restarts?', output: 'Durable agents resume',
    },
    {
      spanId: '07', parentSpanId: '06', type: 'agent_run', name: 'Docs Specialist', durationMs: 2200, status: 'Completed',
      offsetMs: 14037, attributes: { agentId: 'docs-specialist' },
      input: 'Check restart behavior', output: 'Durable agents resume',
    },
    {
      spanId: '08', parentSpanId: '01', type: 'model_inference', name: 'Write the answer', durationMs: 24900, status: 'Completed',
      offsetMs: 16337, attributes: { model: 'gpt-5-nano', provider: 'openai', stepIndex: 2 },
      input: 'Findings from the guides', output: 'Streams replay. Durable agents resume.',
    },
  ],
}

const demoTraceStart = Date.parse('2026-11-04T22:15:00Z')

// Group related fields together so each span is easy to scan.
const jsonFields = (fields: object) => Object.entries(fields)
  .map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)}`)
  .join(', ')

const traceJson = [
  '{',
  `  "traceId": ${JSON.stringify(demoTrace.traceId)},`,
  '  "spans": [',
  demoTrace.spans.map(({ spanId, parentSpanId, type, input, output, offsetMs, attributes, ...details }) => {
    const startTime = new Date(demoTraceStart + offsetMs).toISOString()
    const endTime = new Date(demoTraceStart + offsetMs + details.durationMs).toISOString()
    return [
      `    { ${jsonFields({ spanId, parentSpanId, type })},`,
      `      ${jsonFields(details)},`,
      `      ${jsonFields({ startTime, endTime })},`,
      `      ${jsonFields({ input, output })},`,
      `      "attributes": { ${jsonFields(attributes)} } }`,
    ].join('\n')
  }).join(',\n'),
  '  ]',
  '}',
].join('\n')

const TraceSpan = ({ span }: { span: TraceSpanData }) => {
  const tooltipId = useId()
  const active = useIsActivePage()
  const { kind, label, color } = spanTypes[span.type]
  const duration = span.durationMs < 1000 ? `${span.durationMs} ms` : `${span.durationMs / 1000} s`
  const children = demoTrace.spans.filter(child => child.parentSpanId === span.spanId)

  return (
    <li>
      <div className="mw-trace-entry">
        <div
          className="mw-trace-row mw-trace-beat"
          tabIndex={active ? 0 : -1}
          aria-describedby={tooltipId}
          style={{
            display: 'grid', gridTemplateColumns: '150px 1fr auto', alignItems: 'center',
            gap: 24, minHeight: 88, padding: '0 30px', border: '1px solid var(--mw-border)',
            borderRadius: 16, background: 'var(--mw-panel)',
            animationDelay: `${demoTrace.spans.indexOf(span) * 280}ms`,
          }}
        >
          <span style={{
            justifySelf: 'start', padding: '5px 13px', borderRadius: 10, fontSize: 28, color,
            border: `1px solid color-mix(in srgb, ${color} 36%, transparent)`,
            background: `color-mix(in srgb, ${color} 14%, transparent)`,
          }}>{kind}</span>
          <span style={{ fontSize: 42, fontWeight: 520 }}>{span.name}</span>
          <span style={{ fontSize: 30, fontVariantNumeric: 'tabular-nums', color: 'var(--mw-muted)' }}>{duration}</span>
        </div>
        <div className="mw-trace-tooltip" role="tooltip" id={tooltipId}>
          <strong style={{ display: 'block', fontSize: 30, marginBottom: 10 }}>{span.name}</strong>
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '6px 20px' }}>
            <dt>Span type</dt><dd style={{ margin: 0 }}>{label}</dd>
            <dt>Span ID</dt><dd style={{ margin: 0 }}>{span.spanId}</dd>
            {span.parentSpanId && <><dt>Parent ID</dt><dd style={{ margin: 0 }}>{span.parentSpanId}</dd></>}
            <dt>Input</dt><dd style={{ margin: 0 }}>{span.input}</dd>
            <dt>Output</dt><dd style={{ margin: 0 }}>{span.output}</dd>
            <dt>Duration</dt><dd style={{ margin: 0 }}>{duration}</dd>
            <dt>Status</dt><dd style={{ margin: 0 }}>{span.status}</dd>
          </dl>
        </div>
      </div>
      {children.length > 0 && (
        <ul className="mw-trace-children">
          {children.map(child => <TraceSpan key={child.spanId} span={child} />)}
        </ul>
      )}
    </li>
  )
}

const WhatIsATrace: Page = () => {
  const active = useIsActivePage()
  const [showJson, setShowJson] = useState(false)
  const viewId = useId()

  return (
    <MastraPage>
      <button
        type="button"
        aria-pressed={showJson}
        aria-controls={viewId}
        tabIndex={active ? 0 : -1}
        onClick={() => setShowJson(value => !value)}
        style={{
          position: 'absolute', top: 44, right: 96, zIndex: 2,
          padding: '8px 22px', minHeight: 54, border: '1px solid var(--mw-border)', borderRadius: 12,
          background: showJson ? 'var(--mw-emphasis)' : 'var(--mw-panel)',
          color: 'var(--mw-text)',
          fontSize: 28, fontWeight: 520, cursor: 'pointer',
        }}
      >
        JSON
      </button>
      <div id={viewId} className="mw-trace" data-animate={active} style={{
        height: '100%', padding: '118px 96px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        {showJson ? (
          <pre aria-label="Trace JSON" data-wheel-nav-ignore tabIndex={active ? 0 : -1} onKeyDown={event => {
            if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
              event.stopPropagation()
            }
          }} style={{
            margin: 0, padding: '24px 38px', border: '1px solid var(--mw-border)', borderRadius: 16,
            background: 'var(--mw-subtle)', letterSpacing: 0,
            minHeight: 0, overflowY: 'auto', overscrollBehaviorY: 'contain', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
            fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace', fontSize: 25, lineHeight: '29px',
          }}>
            <SyntaxCode code={traceJson} language="json" />
          </pre>
        ) : (
          <ul aria-label="Illustrative agent trace" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <TraceSpan span={demoTrace.spans[0]} />
          </ul>
        )}
      </div>
    </MastraPage>
  )
}

const platformObservabilityCode = `import { Mastra } from '@mastra/core'
import {
  Observability, MastraPlatformExporter,
} from '@mastra/observability'

export const mastra = new Mastra({
  observability: new Observability({
    configs: { default: {
      serviceName: 'docs-agent',
      exporters: [new MastraPlatformExporter()],
    } },
  }),
})`

const ossObservabilityCode = `import { Mastra } from '@mastra/core'
import {
  Observability, MastraStorageExporter,
} from '@mastra/observability'
import { MastraCompositeStore } from '@mastra/core/storage'
import {
  ObservabilityStorageClickhouseVNext as ClickHouse,
} from '@mastra/clickhouse'

export const mastra = new Mastra({
  observability: new Observability({
    configs: { default: {
      serviceName: 'docs-agent',
      exporters: [new MastraStorageExporter()],
    } },
  }),
  storage: new MastraCompositeStore({
    id: 'docs-storage',
    domains: {
      observability: new ClickHouse({
        url: process.env.CLICKHOUSE_URL!,
        username: process.env.CLICKHOUSE_USERNAME!,
        password: process.env.CLICKHOUSE_PASSWORD!,
      }),
    },
  }),
})`

const EnableObservability: Page = () => (
  <MastraPage>
    <Frame>
      <div style={{ position: 'absolute', inset: '32px 42px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ margin: 0, fontSize: 56, lineHeight: 1.1, fontWeight: 520 }}>Enable observability</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 26, flex: 1 }}>
          {[
            { title: 'OSS', code: ossObservabilityCode },
            { title: 'Platform', code: platformObservabilityCode },
          ].map(({ title, code }) => (
            <section key={title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 32, lineHeight: 1.15, fontWeight: 520 }}>{title}</h3>
              <pre style={{
                margin: 0, padding: '14px 18px', flex: 1, border: '1px solid var(--mw-border)',
                borderRadius: 20, background: 'var(--mw-subtle)', whiteSpace: 'pre',
                fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace',
                fontSize: 22, lineHeight: '24px', letterSpacing: '-.02em',
              }}>
                <SyntaxCode code={code} language="typescript" />
              </pre>
            </section>
          ))}
        </div>
      </div>
    </Frame>
  </MastraPage>
)

const MastraThreadView: Page = () => (
  <TopCroppedScreenshot
    src={threadViewScreenshot}
    alt="Mastra Platform thread view showing two conversation turns alongside their agent spans"
  />
)

const MastraMetrics: Page = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflow: 'clip' }}>
    <img
      src={metricsScreenshot}
      alt="Mastra Metrics dashboard showing token usage, agent runs, latency, resources and threads, and a breakdown by agent"
      style={{ position: 'absolute', display: 'block', width: '114.286%', maxWidth: 'none', left: '-7.143%', top: -137 }}
    />
  </div>
)

const traceBenefits = [
  {
    text: 'Inspect what happened in a run',
    evalCheck: 'Grade live answers with online scorers',
    icon: <><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6M7 10h6M10 7v6" /></>,
  },
  {
    text: 'Track latency, cost, and errors over time',
    evalCheck: <>Track answer <em>correctness</em> over time</>,
    icon: <><rect x="3" y="3" width="7" height="10" rx="1" /><rect x="14" y="3" width="7" height="6" rx="1" /><rect x="3" y="17" width="7" height="4" rx="1" /><rect x="14" y="13" width="7" height="8" rx="1" /></>,
  },
  {
    text: 'Group similar failures and find a likely cause',
    evalCheck: 'Verify the fix and catch regressions',
    icon: <><path d="M20 13 11 22 2 13V2h11l9 9z" /><circle cx="7" cy="7" r="1.5" /></>,
  },
  {
    text: 'Use AI to improve agents',
    href: 'https://mastra.ai/blog/get-started-with-mastra-observability#use-ai-to-improve-agents',
    evalCheck: 'Compare proposed fixes on the same test cases',
    icon: <><path d="m10 3 2 5 5 2-5 2-2 5-2-5-5-2 5-2zM18 14v8m-4-4h8" /></>,
  },
]

const TraceBenefitsTable = ({ showEvals = false }: { showEvals?: boolean }) => (
  <MastraPage>
    <Frame>
      <div style={{
        position: 'absolute', top: '50%', left: 96, right: 96, transform: 'translateY(-50%)',
        border: '1px solid var(--mw-border)', borderRadius: 24, overflow: 'hidden',
      }}>
        <table aria-label={showEvals ? 'How traces and evals work together' : 'What traces help you do'} style={{
          width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left',
        }}>
          <thead style={{
            background: 'var(--mw-subtle)', color: 'var(--mw-muted)', fontSize: 30,
            fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace',
          }}>
            <tr>
              <th scope="col" style={{ width: '54%', padding: '24px 32px', fontWeight: 520 }}>Traces help you</th>
              <th scope="col" style={{
                padding: '24px 32px', fontWeight: 520, visibility: showEvals ? 'visible' : 'hidden',
              }}>Evals help you</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: 40, lineHeight: 1.25 }}>
            {traceBenefits.map(({ text, href, evalCheck, icon }) => (
              <tr key={text} style={{ borderTop: '1px solid var(--mw-border)' }}>
                <td style={{ padding: '34px 32px', fontWeight: 520 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <svg
                      width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                      style={{ color: 'var(--mw-accent)', flexShrink: 0 }}
                    >
                      {icon}
                    </svg>
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        {text}
                      </a>
                    ) : text}
                  </div>
                </td>
                <td style={{ padding: '34px 32px', visibility: showEvals ? 'visible' : 'hidden' }}>{evalCheck}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  </MastraPage>
)

const TraceBenefits: Page = () => <TraceBenefitsTable />
const TraceAndEvalBenefits: Page = () => <TraceBenefitsTable showEvals />

const EvalAnatomy: Page = () => (
  <MastraPage>
    <Frame>
      <h2 style={{ margin: 0, fontSize: 82, lineHeight: 1.08, fontWeight: 520 }}>The anatomy of an Eval</h2>
      <div style={{ position: 'absolute', inset: '230px 72px 100px', display: 'grid', placeItems: 'center' }}>
        <img
          src={evalAnatomyDiagram}
          alt="A test case supplies an input and optional ground truth. The Experiment box groups the target, which can be an agent, workflow, or scorer, and the scorer that grades the trace output."
          style={{ display: 'block', width: '100%' }}
        />
      </div>
    </Frame>
  </MastraPage>
)

const datasetExamples = [
  {
    input: 'Does Mastra support Jev?',
    groundTruth: 'Yes. Mastra classifiers can use Jev through the TypeSafe AI SDK provider.',
    output: 'I couldn’t find Jev in the Mastra docs, so I can’t confirm support.',
    score: 0,
  },
  {
    input: 'Can I run code before an agent calls a tool?',
    groundTruth: 'Yes. Use the beforeToolCall hook to inspect the inputs or block the call.',
    output: 'Use beforeToolCall to inspect the arguments or stop the tool from running.',
    score: 1,
  },
  {
    input: 'How do I integrate Mastra with Next.js?',
    groundTruth: 'Call the agent from a Next.js route. For streaming chat, use handleChatStream from @mastra/ai-sdk.',
    output: 'In a Next.js route, call your Mastra agent and stream chat with handleChatStream from @mastra/ai-sdk.',
    score: 1,
  },
]

const evalTableTitles = {
  golden: 'Golden dataset',
  dataset: 'Dataset',
  experiment: 'Dataset experiment 2332',
}

const EvalTable = ({ view = 'golden' }: { view?: keyof typeof evalTableTitles }) => {
  const usesExperimentLayout = view !== 'golden'
  const columns = usesExperimentLayout
    ? [
        { key: 'input', label: 'Input', width: '25%' },
        { key: 'groundTruth', label: 'Ground Truth', width: '34%' },
        { key: 'output', label: 'Output', width: '32%' },
        { key: 'score', label: 'Score', width: '9%' },
      ] as const
    : [
        { key: 'input', label: 'Input', width: '38%' },
        { key: 'groundTruth', label: 'Ground Truth', width: '62%' },
      ] as const

  return (
    <div style={{
      position: 'absolute', top: '50%', left: 96, right: 96, transform: 'translateY(-50%)',
      border: '1px solid var(--mw-border)', borderRadius: 24, overflow: 'hidden',
    }}>
      <table className="mw-eval-table" data-hide-results={view === 'dataset' ? true : undefined} style={{
        width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left',
      }}>
        <caption style={{
          padding: usesExperimentLayout ? '17px 24px' : '17px 32px', textAlign: 'left',
          borderBottom: '1px solid var(--mw-border)', color: 'var(--mw-muted)', fontSize: 24, fontWeight: 520,
        }}>
          {evalTableTitles[view]}
        </caption>
        <thead style={{
          background: 'var(--mw-subtle)', color: 'var(--mw-muted)', fontSize: usesExperimentLayout ? 28 : 31,
          fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace',
        }}>
          <tr>
            {columns.map(({ key, label, width }) => (
              <th key={key} scope="col" style={{ width, padding: usesExperimentLayout ? '20px 24px' : '22px 32px', fontWeight: 520 }}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ fontSize: usesExperimentLayout ? 30 : 36, lineHeight: 1.3 }}>
          {datasetExamples.map(example => (
            <tr key={example.input} style={{ borderTop: '1px solid var(--mw-border)' }}>
              {columns.map(({ key }) => (
                <td key={key} style={{
                  padding: usesExperimentLayout ? '20px 24px' : '29px 32px', verticalAlign: 'top',
                  fontWeight: key === 'input' || key === 'score' ? 520 : undefined,
                }}>{example[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const EvalDataset: Page = () => (
  <MastraPage>
    <Frame>
      <EvalTable />
    </Frame>
  </MastraPage>
)

const Scorers: Page = () => {
  const active = useIsActivePage()
  const tooltipId = useId()

  return (
    <MastraPage>
      <Frame>
        <h2 style={{ margin: 0, fontSize: 82, lineHeight: 1.08, fontWeight: 520 }}>Scorers</h2>
        <ul style={{ margin: '52px 0 0', paddingLeft: 62, listStyleType: 'disc', fontSize: 54, lineHeight: 1.45 }}>
          <li>Trace <span style={{ color: 'var(--mw-accent)' }}>→</span> numeric score</li>
          <li style={{ marginTop: 18 }}>
            Use a{' '}
            <span className="mw-scorer-hint">
              <span className="mw-scorer-hint-trigger" tabIndex={active ? 0 : -1} aria-describedby={tooltipId}>built-in scorer</span>
              <span className="mw-scorer-hint-tooltip" role="tooltip" id={tooltipId}>
                Faithfulness · Answer Relevancy · Content Similarity
              </span>
            </span>
            {' '}or define your own
          </li>
          <li style={{ marginTop: 18 }}>
            Methods
            <ul style={{ margin: '12px 0 0', paddingLeft: 66, listStyleType: 'circle', fontSize: 48 }}>
              <li>Manual</li>
              <li>Code</li>
              <li>LLM or classifier as Judge</li>
            </ul>
          </li>
        </ul>
      </Frame>
    </MastraPage>
  )
}

const EvalExperimentDataset: Page = () => (
  <MastraPage>
    <Frame>
      <EvalTable view="dataset" />
    </Frame>
  </MastraPage>
)

const RunningExperiment: Page = () => {
  const active = useIsActivePage()

  return (
    <MastraPage>
      <Frame>
        <EvalTable view="dataset" />
      </Frame>
      <div style={{
        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
        background: 'rgba(0,0,0,.6)', pointerEvents: 'none',
      }}>
        <div role="status" style={{
          display: 'grid', justifyItems: 'center', gap: 20, padding: '30px 44px',
          background: 'var(--mw-panel)', border: '1px solid var(--mw-border)', borderRadius: 24,
          fontSize: 31, fontWeight: 520,
        }}>
          <div className="mw-experiment-spinner" data-active={active} aria-hidden="true" />
          Running experiment…
        </div>
      </div>
    </MastraPage>
  )
}

const EvalExperiments: Page = () => (
  <MastraPage>
    <Frame>
      <EvalTable view="experiment" />
    </Frame>
  </MastraPage>
)

const EvalComparison: Page = () => (
  <TopCroppedScreenshot
    src={experimentComparisonScreenshot}
    alt="Mastra Studio comparing baseline and contender experiments on the Missed documented information dataset"
  />
)

const EvalLoop: Page = () => (
  <MastraPage>
    <Frame>
      <svg
        role="img" aria-label="Curate test cases and run the dataset. When a case scores zero, inspect the failure, make a change, and rerun the same dataset."
        viewBox="0 0 1540 432" style={{ display: 'block', width: 'calc(100% - 192px)', position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}
      >
        <rect x="470" y="16" width="1068" height="402" rx="30" fill="none" stroke="var(--mw-border)" strokeWidth="2" />
        <g fill="var(--mw-subtle)" stroke="var(--mw-border)" strokeWidth="2">
          <rect x="2" y="92" width="382" height="174" rx="28" />
          <rect x="512" y="92" width="386" height="174" rx="28" />
          <rect x="1080" y="92" width="418" height="174" rx="28" />
        </g>
        <g fill="none" stroke="var(--mw-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M384 179h128m-13-10 13 10-13 10" />
          <path d="M898 179h182m-13-10 13 10-13 10" />
          <path d="M1289 266v49a20 20 0 0 1-20 20H725a20 20 0 0 1-20-20v-49m-10 13 10-13 10 13" />
        </g>
        <g fill="var(--mw-text)" textAnchor="middle" fontSize="40" fontWeight="520">
          <text x="193" y="155">Curate test cases</text>
          <text x="705" y="155">Evaluate</text>
          <text x="1289" y="155">Diagnose and fix</text>
        </g>
        <g fill="var(--mw-muted)" textAnchor="middle" fontSize="29">
          <text x="193" y="204">Use real failures and</text>
          <text x="193" y="239">reference answers</text>
          <text x="705" y="204">Run the dataset</text>
          <text x="705" y="239">and compare scores</text>
          <text x="1289" y="204">Inspect the failure</text>
          <text x="1289" y="239">and make a change</text>
          <text x="989" y="158" fill="var(--mw-accent)">Score 0</text>
          <text x="997" y="384" fill="var(--mw-accent)">Rerun the same dataset</text>
        </g>
      </svg>
    </Frame>
  </MastraPage>
)

const evalProjectImports = `import { docsAgent } from '../mastra/agents/docs'
import { docsDataset } from './docs.dataset'`

const getAnswerImport = "import { getAssistantMessageFromRunOutput as getAnswer } from '@mastra/evals/scorers/utils'"

const docsEvalConfig = `export const docsEval = {
  target: docsAgent,
  data: docsDataset,
  scorers: [scorer],
}`

const lengthScorerCode = `import { createScorer } from '@mastra/core/evals'
${getAnswerImport}

${evalProjectImports}

const scorer = createScorer({ id: 'answer-length', type: 'agent' })
  .generateScore(({ run }) => {
    const answer = getAnswer(run.output)?.trim() ?? ''
    return answer.length > 0 && answer.length <= 500 ? 1 : 0
  })

${docsEvalConfig}`

const llmJudgeCode = `import { createAnswerSimilarityScorer } from '@mastra/evals/scorers/prebuilt'

${evalProjectImports}

const scorer = createAnswerSimilarityScorer({
  model: 'openai/gpt-6.1-sol',
})

${docsEvalConfig}`

const jevScorerCode = `import { createClassifierScorer } from '@mastra/core/evals'
import { Classifier } from '@mastra/core/classifier'
import { typeSafeAi } from '@ai-sdk/typesafe-ai'
${getAnswerImport}

export const scorer = createClassifierScorer({
  id: 'docs-correctness', type: 'agent',
  classifier: new Classifier({
    id: 'docs-judge',
    model: typeSafeAi.decisionModel('jev-latest'),
    questions: { correctness: {
      type: 'score',
      instructions: 'Compare the answer with the reference.',
      criteria: ['Misses the key fact', 'States the key fact correctly'],
    } },
  }),
  question: 'correctness',
  state: ({ run }) => ({
    answer: getAnswer(run.output) ?? '',
    reference: run.groundTruth ?? '',
  }),
})`

const ciRegressionCode = `import { runEvals } from '@mastra/core/evals';

try {
  // Check your agent against your quality requirements
  const result = await runEvals({
    target: refundPolicyAgent,
    data,
    scorers: [{ scorer: refundCorrectnessScorer, threshold: 1 }],
  });

  console.log('Refund check:', result.verdict);
  if (result.verdict !== 'passed') {
    process.exitCode = 1;
  }
} catch (error) {
  console.error('Refund check could not complete:', error);
  process.exitCode = 1;
}`

const CodeExampleSlide = ({ code }: { code: string }) => (
  <MastraPage>
    <Frame>
      <div style={{ position: 'absolute', inset: 44, display: 'grid', placeItems: 'center' }}>
        <pre style={{
          margin: 0, padding: '32px 44px', border: '1px solid var(--mw-border)',
          borderRadius: 24, background: 'var(--mw-subtle)', whiteSpace: 'pre',
          fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace',
          fontSize: 28, lineHeight: '31px', letterSpacing: '-0.015em',
        }}>
          <SyntaxCode code={code} language="typescript" />
        </pre>
      </div>
    </Frame>
  </MastraPage>
)

const LengthScorer: Page = () => <CodeExampleSlide code={lengthScorerCode} />
const LlmJudge: Page = () => <CodeExampleSlide code={llmJudgeCode} />
const JevScorer: Page = () => <CodeExampleSlide code={jevScorerCode} />
const CatchRegressionsExample: Page = () => <CodeExampleSlide code={ciRegressionCode} />

export const notes = [
  '',
  'Event: Observability and Evals Masterclass. https://luma.com/mastra-18cw. Uses the Mastra theme and framed cover layout from The Future of Agents.',
  '',
  '',
  '',
  '',
  '',
  'A trace records one run as a tree of spans. The rows and their inputs and outputs simplify the reference trace. The Docs Specialist delegation is illustrative. Hover a span to inspect it, then toggle JSON to show how parentSpanId connects the spans. The root has no parent. https://mastra.ai/docs/observability/tracing/overview',
  'Platform reads MASTRA_PLATFORM_ACCESS_TOKEN and MASTRA_PROJECT_ID from the environment. OSS uses MastraStorageExporter to write to the ClickHouse observability domain for viewing in Studio. Keep your existing app storage as the composite default if your app uses other storage domains. https://mastra.ai/reference/observability/tracing/exporters/mastra-platform-exporter · https://mastra.ai/integrations/databases/clickhouse',
  '',
  'Metrics aggregate runs over time. Use the dashboard to look at volume, failures, latency, token usage, and cost by agent. https://mastra.ai/docs/observability/metrics/overview',
  'A coding agent can query traces to investigate slow, expensive, or failed runs and suggest fixes. Advance to reveal what evals add.',
  '',
  '',
  'Run the input through the target, then have the scorer grade the trace output. When the test case includes ground truth, the scorer can use it as a reference. https://www.braintrust.dev/articles/how-to-eval',
  'Each row pairs a question with a short reference answer. These examples are adapted from the dataset screenshot. https://mastra.ai/reference/classifier/classifier · https://mastra.ai/blog/introducing-tool-hooks · https://mastra.ai/integrations/frameworks/next-js',
  'Use a manual score to illustrate the judgment first. Then show how a code rule or a model can repeat that judgment. Hover over “built-in scorer” for examples. https://mastra.ai/blog/mastra-experiments',
  'The length check passes a non-empty answer up to 500 characters. The length and LLM examples import the local agent and dataset. https://mastra.ai/reference/evals/scorer-utils · https://mastra.ai/reference/evals/run-evals',
  'The built-in answer similarity scorer uses an LLM to compare the answer against ground truth. https://mastra.ai/reference/evals/answer-similarity',
  'Jev compares the docs agent’s answer with the dataset reference. The two ordered criteria map to 0 and 1. https://mastra.ai/reference/evals/create-classifier-scorer',
  'Start with the dataset inputs and ground truth. Advance to start the illustrated experiment.',
  'Advance to reveal the outputs and scores.',
  'Illustrative experiment results for the three dataset rows. A score of 1 means the output states the key fact, and 0 means it misses or contradicts it.',
  '',
  '',
  'Start with the Jev answer that scored zero. Inspect the trace, make a change, and rerun the same cases to see whether the fix worked and other cases still pass.',
  '',
  '',
  '',
]

export const meta: SlideMeta = {
  title: 'Observability and Evals Masterclass',
  theme: 'mastra',
  createdAt: '2026-11-05T04:33:42.209Z',
}

export default [
  QuestionCloud, Cover, Introductions, MastraHomepage, MastraObservability, Agenda,
  UnderstandEveryRun, WhatIsATrace, EnableObservability, MastraThreadView, MastraMetrics, TraceBenefits, TraceAndEvalBenefits,
  EvalsTitle, EvalAnatomy, EvalDataset, Scorers, LengthScorer, LlmJudge, JevScorer,
  EvalExperimentDataset, RunningExperiment, EvalExperiments, EvalComparison, EvalLoopTitle, EvalLoop,
  ErrorAnalysisTitle, CatchRegressionsTitle, CatchRegressionsExample,
] satisfies Page[]
