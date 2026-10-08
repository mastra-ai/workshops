import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import test from 'node:test';
import { noopObserve } from '@mastra/core/tools';
import { loanCalculatorServer, outputSchema } from '../src/mastra/mcp/loan-calculator';
import { ticTacToeServer, gameSchema } from '../src/mastra/mcp/tic-tac-toe';
import { productMetricsServer, dashboardSchema } from '../src/mastra/mcp/product-metrics';

test('MCP Apps agent discovers model-visible tools and executes all three servers over HTTP', async () => {
  const servers = [loanCalculatorServer, ticTacToeServer, productMetricsServer];
  const requests: string[] = [];
  const http = createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
    requests.push(url.pathname);
    const server = servers.find(server => url.pathname === `/api/mcp/${server.id}/mcp`);
    if (!server) {
      res.writeHead(404).end();
      return;
    }
    void server.startHTTP({ url, httpPath: url.pathname, req, res }).catch(error => {
      res.writeHead(500).end(String(error));
    });
  });
  await new Promise<void>(resolve => http.listen(0, '127.0.0.1', resolve));
  const address = http.address();
  assert.ok(address && typeof address !== 'string');
  const previousBaseUrl = process.env.MCP_BASE_URL;
  process.env.MCP_BASE_URL = `http://127.0.0.1:${address.port}`;
  const { mcpAppsAgent, mcpAppsClient } = await import('../src/mastra/agents/mcp-apps-agent');

  try {
    assert.equal(requests.length, 0, 'Importing the agent must not connect before Mastra starts');
    const tools = await mcpAppsAgent.listTools();
    assert.deepEqual(Object.keys(tools).sort(), [
      'loan-calculator_calculate_loan',
      'loan-calculator_start_loan_application',
      'product-metrics_show_dashboard',
      'product-metrics_show_metric',
      'tic-tac-toe_get_game',
      'tic-tac-toe_new_game',
      'tic-tac-toe_play_agent_move',
    ]);
    assert.ok(!('loan-calculator_submit_demo_loan' in tools));
    assert.ok(!('tic-tac-toe_play_human_move' in tools));

    const loan = tools['loan-calculator_calculate_loan'];
    assert.deepEqual(loan.mcp?._meta?.ui, {
      resourceUri: 'ui://loan-calculator/app.html',
      visibility: ['model', 'app'],
      serverId: 'loan-calculator',
    });
    assert.ok(loan.execute);
    const loanResult = await loan.execute({ principal: 1200, annualRate: 0, termMonths: 12 }, { observe: noopObserve });
    assert.equal(outputSchema.parse(loanResult).estimate.monthlyPayment, 100);

    const game = tools['tic-tac-toe_new_game'];
    assert.ok(game.execute);
    const gameResult = await game.execute({}, { observe: noopObserve });
    const board = gameSchema.parse(gameResult);
    assert.equal(board.turn, 'X');
    assert.equal(board.revision, 0);

    const dashboard = tools['product-metrics_show_dashboard'];
    assert.ok(dashboard.execute);
    const dashboardResult = await dashboard.execute({ period: '90d', segment: 'enterprise' }, { observe: noopObserve });
    const metrics = dashboardSchema.parse(dashboardResult);
    assert.equal(metrics.period, '90d');
    assert.equal(metrics.segment, 'enterprise');
    assert.equal(metrics.fakeData, true);
    assert.equal(metrics.metrics.length, 6);
    assert.deepEqual(new Set(requests), new Set(servers.map(server => `/api/mcp/${server.id}/mcp`)));

    const resources = await mcpAppsClient.resources.read('loan-calculator', 'ui://loan-calculator/app.html');
    assert.equal(resources.contents[0].mimeType, 'text/html;profile=mcp-app');
  } finally {
    if (previousBaseUrl === undefined) delete process.env.MCP_BASE_URL;
    else process.env.MCP_BASE_URL = previousBaseUrl;
    await mcpAppsClient.disconnect();
    await Promise.all(servers.map(server => server.close()));
    http.closeAllConnections();
    await new Promise<void>((resolve, reject) => http.close(error => error ? reject(error) : resolve()));
  }
});
