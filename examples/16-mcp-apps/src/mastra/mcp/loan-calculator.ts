import { randomUUID } from 'node:crypto';
import { createTool } from '@mastra/core/tools';
import { MCPServer } from '@mastra/mcp';
import { z } from 'zod';
import html from './generated/loan-calculator';

const resourceUri = 'ui://loan-calculator/app.html';
const loanInput = z.object({
  principal: z.number().min(100).max(10_000_000).describe('Loan principal in USD.'),
  annualRate: z.number().min(0).max(40).describe('Fixed annual interest rate as a percentage, e.g. 6.5. Not APR.'),
  termMonths: z.number().int().min(1).max(360).describe('Number of monthly payments.'),
});
const estimateSchema = loanInput.extend({
  monthlyPayment: z.number(),
  totalInterest: z.number(),
  totalRepayment: z.number(),
  yearlyBalance: z.array(z.object({ month: z.number(), balance: z.number() })),
});
const applicationSchema = z.object({
  stage: z.enum(['profile', 'submitted']),
  reference: z.string().optional(),
  demoProfile: z.enum(['alex-demo', 'sam-demo']).optional(),
  purpose: z.enum(['home-improvement', 'education', 'other']).optional(),
});
export const outputSchema = z.object({
  estimate: estimateSchema,
  application: applicationSchema.optional(),
  disclaimer: z.string(),
});
export type LoanData = z.infer<typeof outputSchema>;

const disclaimer = 'Fictional demo only. Fixed-rate monthly amortization; excludes fees, taxes, and insurance. Not an offer, approval, or financial advice.';
const cents = (value: number) => Math.round(value * 100) / 100;

export function calculateLoan(input: z.infer<typeof loanInput>): LoanData['estimate'] {
  const { principal, annualRate, termMonths } = loanInput.parse(input);
  const rate = annualRate / 1200;
  // expm1/log1p avoid cancellation for small nonzero rates. Zero interest is a separate case.
  const payment = rate === 0 ? principal / termMonths
    : principal * rate / -Math.expm1(-termMonths * Math.log1p(rate));
  let balance = principal;
  const yearlyBalance = [{ month: 0, balance: principal }];
  for (let month = 1; month <= termMonths; month++) {
    balance = Math.max(0, balance * (1 + rate) - payment);
    if (month % 12 === 0 || month === termMonths) {
      yearlyBalance.push({ month, balance: month === termMonths ? 0 : cents(balance) });
    }
  }
  return {
    principal, annualRate, termMonths,
    monthlyPayment: cents(payment),
    totalInterest: cents(payment * termMonths - principal),
    totalRepayment: cents(payment * termMonths),
    yearlyBalance,
  };
}

const ui = { resourceUri, visibility: ['model', 'app'] };

export const calculateLoanTool = createTool({
  id: 'calculate_loan',
  description: 'Open the interactive loan calculator or compare a fixed-rate loan scenario. Return estimated monthly payments, total interest and balances. Defaults are examples, not personalized rates.',
  inputSchema: loanInput,
  outputSchema,
  mcp: {
    annotations: { title: 'Loan calculator', readOnlyHint: true, openWorldHint: false, idempotentHint: true },
    _meta: { ui },
  },
  execute: async input => ({ estimate: calculateLoan(input), disclaimer }),
});

export const startLoanApplicationTool = createTool({
  id: 'start_loan_application',
  description: 'Start a fictional loan sign-up in the calculator. No application is filed and no real personal data is collected.',
  inputSchema: loanInput,
  outputSchema,
  mcp: {
    annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true },
    _meta: { ui },
  },
  execute: async input => ({ estimate: calculateLoan(input), application: { stage: 'profile' as const }, disclaimer }),
});

export const submitDemoLoanTool = createTool({
  id: 'submit_demo_loan',
  description: 'Complete the fake sign-up after the user reviews and confirms. Only accepts canned fictional profiles; never sends a real application.',
  inputSchema: loanInput.extend({
    demoProfile: z.enum(['alex-demo', 'sam-demo']),
    purpose: z.enum(['home-improvement', 'education', 'other']),
    confirmDemo: z.literal(true),
  }),
  outputSchema,
  mcp: {
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false, idempotentHint: false },
    _meta: { ui: { resourceUri, visibility: ['app'] } },
  },
  execute: async ({ demoProfile, purpose, ...loan }) => ({
    estimate: calculateLoan(loan),
    application: { stage: 'submitted' as const, reference: `DEMO-${randomUUID()}`, demoProfile, purpose },
    disclaimer,
  }),
});

export const loanTools = {
  calculate_loan: calculateLoanTool,
  start_loan_application: startLoanApplicationTool,
  submit_demo_loan: submitDemoLoanTool,
};

export const loanCalculatorServer = new MCPServer({
  id: 'loan-calculator',
  name: 'Loan Calculator',
  version: '1.0.0',
  instructions: 'Use calculate_loan to open the app. If inputs are missing, use principal 25000, annualRate 6.5 and termMonths 60, clearly labeled as an example. Use the selected estimate shared by the app to answer questions or compare scenarios. Onboarding is fictional; never request real identity, income, account or credit information.',
  tools: loanTools,
  appResources: {
    [resourceUri]: {
      name: 'Loan calculator and demo sign-up',
      html,
      meta: { prefersBorder: true, csp: { connectDomains: [], resourceDomains: [] } },
    },
  },
});
