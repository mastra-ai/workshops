import { createTool } from '@mastra/core/tools';
import { MCPServer } from '@mastra/mcp';
import { z } from 'zod';
import html from './generated/product-metrics';

const dashboardUri = 'ui://product-metrics/dashboard.html';
const cardUri = 'ui://product-metrics/card.html';
const metricId = z.enum(['mrr', 'active_users', 'activation', 'retention', 'churn', 'nps']);
const filters = z.object({
  period: z.enum(['30d', '90d']).default('30d'),
  segment: z.enum(['all', 'startups', 'enterprise']).default('all'),
});
const metricSchema = z.object({
  id: metricId, label: z.string(), definition: z.string(), unit: z.enum(['usd', 'count', 'percent', 'score']),
  value: z.number(), previousValue: z.number(), changePercent: z.number(), higherIsBetter: z.boolean(),
  trend: z.array(z.object({ date: z.string(), value: z.number() })),
});
export const dashboardSchema = z.object({
  view: z.enum(['dashboard', 'card']),
  fakeData: z.literal(true),
  product: z.string(),
  snapshot: z.string(),
  period: z.enum(['30d', '90d']),
  segment: z.enum(['all', 'startups', 'enterprise']),
  metrics: z.array(metricSchema),
  funnel: z.array(z.object({ stage: z.string(), users: z.number() })),
  channels: z.array(z.object({ channel: z.string(), signups: z.number(), share: z.number() })),
  retention: z.array(z.object({ cohort: z.string(), weeks: z.array(z.number()) })),
});
export type DashboardData = z.infer<typeof dashboardSchema>;
export type Metric = z.infer<typeof metricSchema>;
type Filters = z.infer<typeof filters>;

const definitions: Array<Pick<Metric, 'id' | 'label' | 'definition' | 'unit' | 'higherIsBetter'> & { base: number; growth: number; average: boolean }> = [
  { id: 'mrr', label: 'Monthly recurring revenue', definition: 'MRR on the final day, compared with the snapshot one selected period earlier. USD; not total revenue for the period.', unit: 'usd', base: 68000, growth: 270, average: false, higherIsBetter: true },
  { id: 'active_users', label: 'Daily active users', definition: 'Distinct active users on the final day, compared with the snapshot one selected period earlier. Not a sum of daily users.', unit: 'count', base: 3100, growth: 19, average: false, higherIsBetter: true },
  { id: 'activation', label: 'Activation rate', definition: 'Mean daily share of new users reaching their first value event, compared with the preceding equal-length period.', unit: 'percent', base: 42, growth: 0.095, average: true, higherIsBetter: true },
  { id: 'retention', label: '30-day retention', definition: 'Mean daily 30-day cohort retention, compared with the preceding equal-length period.', unit: 'percent', base: 65, growth: 0.08, average: true, higherIsBetter: true },
  { id: 'churn', label: 'Monthly customer churn', definition: 'Trailing 30-day customer churn on the final day, compared with the snapshot one selected period earlier. Lower is better.', unit: 'percent', base: 4.8, growth: -0.009, average: false, higherIsBetter: false },
  { id: 'nps', label: 'Net promoter score', definition: 'Mean daily fictional survey score, compared with the preceding equal-length period. Range: -100 to 100.', unit: 'score', base: 32, growth: 0.075, average: true, higherIsBetter: true },
];
const round = (n: number) => Math.round(n * 100) / 100;

// A fixed snapshot and deterministic series make chat references reproducible.
// None of these figures describe a real business or query an analytics service.
export function getDashboard(input: Filters): DashboardData {
  const { period, segment } = filters.parse(input);
  const days = period === '30d' ? 30 : 90;
  const share = segment === 'all' ? 1 : segment === 'enterprise' ? 0.62 : 0.38;
  const rateOffset = segment === 'enterprise' ? 3 : segment === 'startups' ? -3 : 0;
  const metrics = definitions.map(({ base, growth, average, ...definition }): Metric => {
    const series = Array.from({ length: 180 }, (_, day) => {
      const date = new Date(Date.UTC(2026, 9, 7) - (179 - day) * 86_400_000).toISOString().slice(0, 10);
      let value = base + day * growth + Math.sin(day / 9) * Math.abs(growth) * 4;
      if (definition.unit === 'usd' || definition.unit === 'count') value *= share;
      else value += definition.id === 'churn' ? -rateOffset / 5 : rateOffset;
      return { date, value: definition.unit === 'count' ? Math.round(value) : round(value) };
    });
    const current = series.slice(-days);
    const previous = series.slice(-days * 2, -days);
    const summarize = (points: typeof series) => round(average
      ? points.reduce((sum, point) => sum + point.value, 0) / points.length
      : points.at(-1)!.value);
    const value = summarize(current);
    const previousValue = summarize(previous);
    return {
      ...definition, value, previousValue, changePercent: round((value - previousValue) / previousValue * 100),
      trend: current.filter((_, index) => index % Math.ceil(days / 12) === 0 || index === days - 1),
    };
  });
  const visitors = Math.round(84000 * share * days / 30);
  const signups = Math.round(visitors * 0.12);
  const activated = Math.round(signups * metrics.find(metric => metric.id === 'activation')!.value / 100);
  const funnel = [
    { stage: 'Visitors', users: visitors }, { stage: 'Signed up', users: signups },
    { stage: 'Activated', users: activated }, { stage: 'Paid', users: Math.round(activated * 0.24) },
  ];
  const channelShares = [0.42, 0.28, 0.18, 0.12];
  let assigned = 0;
  const channels = ['Organic search', 'Product-led / direct', 'Referrals', 'Paid campaigns'].map((channel, index) => {
    const count = index === 3 ? signups - assigned : Math.round(signups * channelShares[index]);
    assigned += count;
    return { channel, signups: count, share: round(count / signups * 100) };
  });
  const retention = Array.from({ length: 5 }, (_, cohort) => ({
    cohort: `Cohort ${cohort + 1}`,
    weeks: Array.from({ length: 5 }, (_, week) => week === 0 ? 100 : round(89 - week * 6 + cohort + rateOffset)),
  }));
  return { view: 'dashboard', fakeData: true, product: 'Orbit Analytics', snapshot: '2026-10-07', period, segment, metrics, funnel, channels, retention };
}

export const showDashboardTool = createTool({
  id: 'show_dashboard',
  description: 'Open the full fictional product metrics dashboard with KPI cards, trends, acquisition funnel, channel mix, and cohort retention. Can be launched from chat or a supported ChatGPT sidebar entrypoint.',
  inputSchema: filters,
  outputSchema: dashboardSchema,
  mcp: {
    annotations: { title: 'Orbit product metrics', readOnlyHint: true, openWorldHint: false, idempotentHint: true },
    _meta: {
      ui: { resourceUri: dashboardUri, visibility: ['model', 'app'] },
      'openai/ui': { entrypoints: [{ type: 'global' }, { type: 'thread' }] },
    },
  },
  execute: async input => getDashboard(input),
});

export const showMetricTool = createTool({
  id: 'show_metric',
  description: 'Show one product metric as a compact interactive card in chat. Use the exact metricId, period and segment referenced by the dashboard selection. The card can open the full dashboard. Data is fictional.',
  inputSchema: filters.extend({ metricId }),
  outputSchema: dashboardSchema,
  mcp: {
    annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true },
    _meta: { ui: { resourceUri: cardUri, visibility: ['model', 'app'] } },
  },
  execute: async ({ metricId, ...input }) => {
    const data = getDashboard(input);
    return { ...data, view: 'card' as const, metrics: data.metrics.filter(metric => metric.id === metricId), funnel: [], channels: [], retention: [] };
  },
});

export const productMetricsTools = { show_dashboard: showDashboardTool, show_metric: showMetricTool };

export const productMetricsServer = new MCPServer({
  id: 'product-metrics', name: 'Product Metrics', version: '1.0.0',
  instructions: 'All Orbit Analytics data is fictional, fixed at October 7, 2026. Use show_dashboard for the full app; use show_metric to insert a referenced KPI into chat. Preserve the selection’s metricId, period and segment. Explain definitions and comparisons, not invented causal conclusions. A relative percent change is not a percentage-point change. Sidebar availability and display modes are host-controlled.',
  tools: productMetricsTools,
  appResources: {
    [dashboardUri]: { name: 'Full product metrics dashboard', html, meta: { prefersBorder: false, csp: { connectDomains: [], resourceDomains: [] } } },
    [cardUri]: { name: 'Product metric card', html, meta: { prefersBorder: true, csp: { connectDomains: [], resourceDomains: [] } } },
  },
});
