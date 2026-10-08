import type { LoanData } from '../../mastra/mcp/loan-calculator';
import { createAppClient, element, money, status } from '../shared/client';

let current: LoanData | undefined;
const client = createAppClient<LoanData>('Loan calculator', render);
const input = (id: string) => element<HTMLInputElement>(id);

function scenario() {
  if (!current) throw new Error('Calculate a loan first.');
  const { principal, annualRate, termMonths } = current.estimate;
  return { principal, annualRate, termMonths };
}

function render(data: LoanData) {
  current = data;
  const loan = data.estimate;
  input('principal').value = String(loan.principal);
  input('rate').value = String(loan.annualRate);
  input('months').value = String(loan.termMonths);
  element('payment').textContent = money(loan.monthlyPayment);
  element('terms').textContent = `${loan.termMonths} payments · ${loan.annualRate}% annual interest`;
  element('interest').textContent = money(loan.totalInterest);
  element('total').textContent = money(loan.totalRepayment);
  element('disclaimer').textContent = data.disclaimer;
  element<HTMLButtonElement>('ask').disabled = false;
  element<HTMLButtonElement>('start').disabled = false;
  element('schedule-panel').hidden = false;
  element('schedule').replaceChildren(...loan.yearlyBalance.map(point => {
    const row = document.createElement('tr');
    for (const value of [String(point.month), money(point.balance)]) {
      const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
    }
    return row;
  }));
  const submitted = data.application?.stage === 'submitted';
  element('onboarding').hidden = !data.application;
  element('profile-form').hidden = submitted;
  element('review-form').hidden = true;
  element('receipt').hidden = !submitted;
  input('confirm').checked = false;
  element('step-title').textContent = submitted ? '3. Simulation complete' : '1. Choose a fictional profile';
  if (submitted) element('receipt-text').textContent = `Reference ${data.application?.reference}. Nothing was sent to a lender; no account was created and no credit check was run.`;
  status('Scenario ready.');
}

element('calculator').addEventListener('input', () => {
  element<HTMLButtonElement>('ask').disabled = true;
  element<HTMLButtonElement>('start').disabled = true;
  element('onboarding').hidden = true;
  status('Inputs changed. Calculate again to update the estimate before sharing or signing up.');
});
element('calculator').addEventListener('submit', event => {
  event.preventDefault();
  void client.run(async () => render(await client.call('calculate_loan', {
    principal: Number(input('principal').value), annualRate: Number(input('rate').value), termMonths: Number(input('months').value),
  })));
});
element('ask').onclick = () => void client.run(() => client.share('Explain the payment and total interest for this illustrative loan. What changes if I choose a shorter term?', { estimate: current?.estimate }));
element('start').onclick = () => void client.run(async () => render(await client.call('start_loan_application', scenario())));
element('cancel').onclick = () => { element('onboarding').hidden = true; };
element('profile-form').addEventListener('submit', event => {
  event.preventDefault();
  element('profile-form').hidden = true;
  element('review-form').hidden = false;
  element('step-title').textContent = '2. Review your fictional application';
  const profile = element<HTMLSelectElement>('profile');
  const purpose = element<HTMLSelectElement>('purpose');
  element('review').textContent = `${profile.selectedOptions[0].text} · ${purpose.selectedOptions[0].text} · ${money(current!.estimate.principal)} at ${current!.estimate.annualRate}% for ${current!.estimate.termMonths} months. Estimated payment: ${money(current!.estimate.monthlyPayment)}.`;
});
element('back').onclick = () => {
  element('profile-form').hidden = false; element('review-form').hidden = true;
  element('step-title').textContent = '1. Choose a fictional profile';
};
element('review-form').addEventListener('submit', event => {
  event.preventDefault();
  void client.run(async () => render(await client.call('submit_demo_loan', {
    ...scenario(), demoProfile: element<HTMLSelectElement>('profile').value,
    purpose: element<HTMLSelectElement>('purpose').value, confirmDemo: input('confirm').checked,
  })));
});
element('receipt-share').onclick = () => void client.run(() => client.share('I completed this simulated sign-up. Explain what a real loan application might involve, without collecting personal data.', { ...current }));
void client.connect();
