import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateLoan, loanCalculatorServer, outputSchema } from '../src/mastra/mcp/loan-calculator';
import { withMcpClient } from './helpers';

const scenario = { principal: 25000, annualRate: 6.5, termMonths: 60 };

test('amortization handles standard, zero, tiny interest, and one-month loans', () => {
  const result = calculateLoan(scenario);
  assert.equal(result.monthlyPayment, 489.15);
  assert.equal(result.totalInterest, 4349.22);
  assert.equal(result.yearlyBalance.at(-1)?.balance, 0);
  assert.equal(result.yearlyBalance.length, 6);
  assert.deepEqual(calculateLoan({ principal: 1200, annualRate: 0, termMonths: 12 }), {
    principal: 1200, annualRate: 0, termMonths: 12, monthlyPayment: 100,
    totalInterest: 0, totalRepayment: 1200,
    yearlyBalance: [{ month: 0, balance: 1200 }, { month: 12, balance: 0 }],
  });
  assert.equal(calculateLoan({ principal: 1200, annualRate: 12, termMonths: 1 }).monthlyPayment, 1212);
  assert.equal(calculateLoan({ principal: 1200, annualRate: 1e-10, termMonths: 12 }).monthlyPayment, 100);
  assert.throws(() => calculateLoan({ ...scenario, principal: -1 }));
});

test('loan server exposes a self-contained app, structured results, and fake-only onboarding over MCP', async () => {
  await withMcpClient(loanCalculatorServer, async client => {
    const { tools } = await client.listTools();
    assert.equal(tools.length, 3);
    assert.deepEqual(tools.find(tool => tool.name === 'submit_demo_loan')?._meta?.ui,
      { resourceUri: 'ui://loan-calculator/app.html', visibility: ['app'] });
    const { contents } = await client.readResource({ uri: 'ui://loan-calculator/app.html' });
    assert.equal(contents[0].mimeType, 'text/html;profile=mcp-app');
    assert.ok('text' in contents[0] && contents[0].text.includes('Find your monthly payment.'));
    const calculation = await client.callTool({ name: 'calculate_loan', arguments: scenario });
    assert.equal(calculation.isError, false);
    assert.equal(outputSchema.parse(calculation.structuredContent).estimate.monthlyPayment, 489.15);
    const start = await client.callTool({ name: 'start_loan_application', arguments: scenario });
    assert.equal(outputSchema.parse(start.structuredContent).application?.stage, 'profile');
    const args = { ...scenario, demoProfile: 'alex-demo', purpose: 'education', confirmDemo: true };
    const submitted = await client.callTool({ name: 'submit_demo_loan', arguments: args });
    const application = outputSchema.parse(submitted.structuredContent).application;
    assert.equal(application?.stage, 'submitted');
    assert.ok(application?.reference);
    assert.match(application.reference, /^DEMO-/);
    for (const arguments_ of [{ ...args, confirmDemo: false }, { ...args, demoProfile: 'real-person' }]) {
      const rejected = await client.callTool({ name: 'submit_demo_loan', arguments: arguments_ });
      assert.equal(rejected.isError, true);
    }
    const invalid = await client.callTool({ name: 'calculate_loan', arguments: { ...scenario, termMonths: 0 } });
    assert.equal(invalid.isError, true);
  });
});
