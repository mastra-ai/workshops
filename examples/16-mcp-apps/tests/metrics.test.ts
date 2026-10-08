import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getDashboard, productMetricsServer, dashboardSchema } from '../src/mastra/mcp/product-metrics';
import { withMcpClient } from './helpers';

test('synthetic metrics are deterministic, scoped, and internally consistent', () => {
  for (const period of ['30d', '90d'] as const) {
    for (const segment of ['all', 'startups', 'enterprise'] as const) {
      const data = getDashboard({ period, segment });
      assert.deepEqual(data, getDashboard({ period, segment }));
      assert.equal(data.metrics.length, 6);
      assert.equal(data.channels.reduce((sum, channel) => sum + channel.signups, 0), data.funnel[1].users);
      assert.ok(data.metrics.every(metric => Number.isFinite(metric.value) && metric.trend.length > 1));
      assert.ok(data.metrics.every(metric => metric.trend.at(-1)?.date === data.snapshot));
      assert.ok(data.funnel.every((step, i) => i === 0 || step.users <= data.funnel[i - 1].users));
      assert.ok(data.retention.every(cohort => cohort.weeks.every(value => value >= 0 && value <= 100)));
    }
  }
  assert.notDeepEqual(getDashboard({ period: '30d', segment: 'all' }), getDashboard({ period: '90d', segment: 'all' }));
  assert.notDeepEqual(getDashboard({ period: '30d', segment: 'startups' }), getDashboard({ period: '30d', segment: 'enterprise' }));
});

test('dashboard and compact cards share metric values and preserve sidebar metadata over MCP', async () => {
  await withMcpClient(productMetricsServer, async client => {
    const { tools } = await client.listTools();
    assert.deepEqual(tools.find(tool => tool.name === 'show_dashboard')?._meta?.['openai/ui'], {
      entrypoints: [{ type: 'global' }, { type: 'thread' }],
    });
    const resources = await client.listResources();
    assert.equal(resources.resources.length, 2);
    for (const resource of resources.resources) {
      const result = await client.readResource({ uri: resource.uri });
      assert.equal(result.contents[0].mimeType, 'text/html;profile=mcp-app');
      assert.deepEqual(result.contents[0]._meta?.ui, { prefersBorder: resource.uri.includes('card'), csp: { connectDomains: [], resourceDomains: [] } });
    }
    const args = { period: '90d', segment: 'enterprise' };
    const full = dashboardSchema.parse((await client.callTool({ name: 'show_dashboard', arguments: args })).structuredContent);
    for (const metricId of ['mrr', 'active_users', 'activation', 'retention', 'churn', 'nps']) {
      const card = dashboardSchema.parse((await client.callTool({ name: 'show_metric', arguments: { ...args, metricId } })).structuredContent);
      assert.equal(card.view, 'card');
      assert.equal(card.metrics.length, 1);
      assert.deepEqual(card.metrics[0], full.metrics.find(metric => metric.id === metricId));
      assert.equal(card.segment, 'enterprise');
      assert.equal(card.period, '90d');
    }
    assert.equal((await client.callTool({ name: 'show_metric', arguments: { metricId: 'unknown' } })).isError, true);
    assert.equal((await client.callTool({ name: 'show_dashboard', arguments: { period: '7d' } })).isError, true);
    assert.equal(dashboardSchema.parse((await client.callTool({ name: 'show_dashboard', arguments: {} })).structuredContent).period, '30d');
  });
});
