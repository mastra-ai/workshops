import type { DashboardData, Metric } from '../../mastra/mcp/product-metrics';
import { createAppClient, element, money, status } from '../shared/client';

let current: DashboardData | undefined;
let selectedId: Metric['id'] = 'mrr';
const client = createAppClient<DashboardData>('Orbit product metrics', render);
const format = (metric: Metric, value = metric.value) => metric.unit === 'usd' ? money(value)
  : metric.unit === 'percent' ? `${value.toFixed(1)}%` : value.toLocaleString('en-US', { maximumFractionDigits: 1 });

function chart(metric: Metric, small = false) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 600 160');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `${metric.label}: ${format(metric, metric.trend[0].value)} to ${format(metric, metric.trend.at(-1)!.value)}. Vertical scale starts at zero.`);
  const values = metric.trend.map(point => point.value);
  const min = Math.min(0, ...values);
  const max = Math.max(1, ...values) * 1.12;
  const points = values.map((value, i) => `${12 + i / (values.length - 1) * 576},${148 - (value - min) / (max - min) * 136}`).join(' ');
  const area = document.createElementNS(ns, 'polygon');
  area.setAttribute('points', `12,148 ${points} 588,148`);
  area.setAttribute('fill', 'currentColor'); area.setAttribute('opacity', '.1');
  const line = document.createElementNS(ns, 'polyline');
  line.setAttribute('points', points); line.setAttribute('fill', 'none');
  line.setAttribute('stroke', 'currentColor'); line.setAttribute('stroke-width', small ? '5' : '3');
  svg.append(area, line);
  return svg;
}

function change(metric: Metric) {
  const text = `${metric.changePercent >= 0 ? '+' : ''}${metric.changePercent.toFixed(1)}% relative to previous period`;
  const positive = metric.higherIsBetter ? metric.changePercent >= 0 : metric.changePercent <= 0;
  return { text, className: positive ? 'positive' : 'negative' };
}

function selectionContext() {
  const metric = current?.metrics.find(item => item.id === selectedId);
  if (!current || !metric) throw new Error('Select a metric first.');
  return { metricId: metric.id, period: current.period, segment: current.segment, snapshot: current.snapshot, fakeData: true, metric };
}

function selectMetric(id: Metric['id']) {
  selectedId = id;
  const metric = current!.metrics.find(item => item.id === id)!;
  element('selection').hidden = false;
  element('selected-id').textContent = `Metric / ${metric.id}`;
  element('selected-label').textContent = metric.label;
  element('selected-period').textContent = `${current!.period} · ${current!.segment}`;
  element('selected-value').textContent = format(metric);
  element('selected-change').textContent = change(metric).text;
  element('selected-change').className = `delta ${change(metric).className}`;
  element('selection-description').textContent = metric.definition;
  element('selected-chart').replaceChildren(chart(metric));
  element('chart-start').textContent = metric.trend[0].date;
  element('chart-end').textContent = metric.trend.at(-1)!.date;
  element('trend-table').replaceChildren(...metric.trend.map(point => {
    const row = document.createElement('tr');
    for (const value of [point.date, format(metric, point.value)]) {
      const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
    }
    return row;
  }));
  document.querySelectorAll<HTMLButtonElement>('.kpi').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.id === id)));
}

function render(data: DashboardData) {
  current = data;
  const compact = data.view === 'card';
  element('main').classList.toggle('compact', compact);
  element('metrics').hidden = compact;
  element('open-dashboard').hidden = !compact;
  element('card').hidden = compact;
  element('title').textContent = compact ? 'A closer look.' : 'Your product, at a glance.';
  element('subtitle').textContent = compact ? 'One metric, shared with your conversation.' : 'Select any card. Explore it here, or reference it in chat.';
  element('snapshot').textContent = `Fictional snapshot: ${data.snapshot} · ${data.period} · ${data.segment}. All values are synthetic. Changes are relative percentages, not percentage points.`;
  element<HTMLSelectElement>('period').value = data.period;
  element<HTMLSelectElement>('segment').value = data.segment;
  element('metrics').replaceChildren(...data.metrics.map(metric => {
    const button = document.createElement('button');
    button.className = 'panel kpi'; button.dataset.id = metric.id;
    const label = document.createElement('p'); label.className = 'metric-label'; label.textContent = metric.label;
    const value = document.createElement('p'); value.className = 'number'; value.textContent = format(metric);
    const delta = document.createElement('p'); delta.className = `delta ${change(metric).className}`; delta.textContent = change(metric).text;
    button.append(label, value, delta, chart(metric, true));
    button.onclick = () => void client.run(async () => {
      selectMetric(metric.id);
      if (client.app.getHostCapabilities()?.updateModelContext) {
        await client.app.updateModelContext({ structuredContent: selectionContext() });
      }
      status('Metric selected. Use Reference this metric in chat to request a response.');
    });
    return button;
  }));
  selectMetric(data.metrics.some(metric => metric.id === selectedId) ? selectedId : data.metrics[0].id);
  element('funnel').replaceChildren(...data.funnel.map(step => {
    const container = document.createElement('div'); container.className = 'funnel-step';
    const label = document.createElement('p'); label.textContent = `${step.stage} · ${step.users.toLocaleString('en-US')}`;
    const bar = document.createElement('div'); bar.className = 'progress'; bar.style.marginTop = '10px';
    const fill = document.createElement('span'); fill.style.width = `${step.users / data.funnel[0].users * 100}%`;
    bar.append(fill); container.append(label, bar); return container;
  }));
  element('channels').replaceChildren(...data.channels.map(channel => {
    const row = document.createElement('div'); row.className = 'funnel-step';
    const label = document.createElement('p'); label.textContent = `${channel.channel} · ${channel.signups.toLocaleString('en-US')} (${channel.share}%)`;
    const bar = document.createElement('div'); bar.className = 'progress'; bar.style.marginTop = '10px';
    const fill = document.createElement('span'); fill.style.width = `${channel.share}%`;
    bar.append(fill); row.append(label, bar); return row;
  }));
  element('retention').replaceChildren(...data.retention.map(cohort => {
    const row = document.createElement('tr');
    const label = document.createElement('th'); label.scope = 'row'; label.textContent = cohort.cohort; row.append(label);
    for (const value of cohort.weeks) {
      const cell = document.createElement('td'); cell.textContent = `${value}%`;
      cell.style.background = `color-mix(in srgb, var(--accent) ${Math.round(value * 0.28)}%, var(--panel))`;
      row.append(cell);
    }
    return row;
  }));
  status('Dashboard ready.');
}

async function loadDashboard() {
  render(await client.call('show_dashboard', {
    period: element<HTMLSelectElement>('period').value, segment: element<HTMLSelectElement>('segment').value,
  }));
}
for (const id of ['period', 'segment']) element(id).onchange = () => void client.run(loadDashboard);
element('discuss').onclick = () => void client.run(() => {
  const context = selectionContext();
  return client.share(`Show this selected metric as a card in chat using show_metric with metricId=${context.metricId}, period=${context.period}, segment=${context.segment}. Explain its trend and suggest questions to investigate without inventing causes.`, context);
});
element('card').onclick = () => void client.run(async () => {
  const { metricId, period, segment } = selectionContext();
  render(await client.call('show_metric', { metricId, period, segment }));
});
element('open-dashboard').onclick = () => void client.run(loadDashboard);
element('fullscreen').onclick = () => void client.run(async () => {
  const mode = client.app.getHostContext()?.displayMode === 'fullscreen' ? 'inline' : 'fullscreen';
  const actual = await client.app.requestDisplayMode({ mode });
  element('fullscreen').textContent = actual.mode === 'fullscreen' ? 'Return to chat size' : 'Expand dashboard';
  status(actual.mode === mode ? `Display mode: ${actual.mode}.` : `Host kept display mode: ${actual.mode}.`);
});

void (async () => {
  await client.connect();
  element('fullscreen').hidden = !client.app.getHostContext()?.availableDisplayModes?.includes('fullscreen');
  // Some hosts launch without a tool result. Do not race a pending result (e.g. a metric card).
  if (!current && !client.app.getHostContext()?.toolInfo) {
    await client.run(async () => {
      const initial = await client.call('show_dashboard', {});
      if (!current) render(initial);
    });
  }
})();
