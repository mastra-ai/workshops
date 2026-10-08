import { expect, test } from '@playwright/test';

for (const kind of ['loan-calculator', 'tic-tac-toe', 'product-metrics']) {
  test(`${kind} connects and calls tools with Studio-style blob frames and JSON text results`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/?app=${kind}&blob=1&textOnly=1`);
    const app = page.frameLocator('#app');
    await expect(page.locator('#host-status')).toContainText('App connected');
    await expect(page.locator('#app')).toHaveAttribute('src', /^blob:/);
    if (kind === 'loan-calculator') {
      await expect(app.locator('#payment')).toHaveText('$489.15');
      await app.locator('#principal').fill('1200');
      await app.locator('#rate').fill('0');
      await app.locator('#months').fill('12');
      await app.getByRole('button', { name: 'Calculate payment' }).click();
      await expect(app.locator('#payment')).toHaveText('$100.00');
    } else if (kind === 'tic-tac-toe') {
      await expect(app.locator('#turn')).toContainText('Your turn');
      await app.getByRole('button', { name: 'Row 1, column 1: empty' }).click();
      await expect(page.locator('#messages')).toContainText('I played X at cell 0');
      await page.locator('#agent-move').click();
      await expect(app.getByRole('button', { name: 'Row 2, column 2: O' })).toBeVisible();
    } else {
      await expect(app.locator('.kpi')).toHaveCount(6);
      await app.locator('#period').selectOption('90d');
      await expect(app.locator('#snapshot')).toContainText('90d');
      await app.locator('#segment').selectOption('enterprise');
      await expect(app.locator('#snapshot')).toContainText('90d · enterprise');
    }
    expect(errors).toEqual([]);
  });
}

test('loan calculator sends context and completes a fake-only sign-up', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?app=loan-calculator');
  const app = page.frameLocator('#app');
  await expect(app.locator('#payment')).toHaveText('$489.15');
  await app.locator('#principal').fill('1200');
  await app.locator('#rate').fill('0');
  await app.locator('#months').fill('12');
  await expect(app.locator('#ask')).toBeDisabled();
  await expect(app.locator('#start')).toBeDisabled();
  await app.getByRole('button', { name: 'Calculate payment' }).click();
  await expect(app.locator('#payment')).toHaveText('$100.00');
  await app.getByRole('button', { name: 'Explain this loan in chat' }).click();
  await expect(page.locator('#messages')).toContainText('"principal":1200');
  await app.getByRole('button', { name: 'Try demo sign-up' }).click();
  await app.locator('#profile').selectOption('sam-demo');
  await app.locator('#purpose').selectOption('education');
  await app.getByRole('button', { name: 'Review demo application' }).click();
  await expect(app.locator('#review')).toContainText('Sam');
  await app.getByRole('button', { name: 'Submit fake application' }).click();
  await expect(app.locator('#receipt')).toBeHidden();
  await app.locator('#confirm').check();
  await app.getByRole('button', { name: 'Submit fake application' }).click();
  await expect(app.locator('#receipt-text')).toContainText('DEMO-');
  await expect(app.locator('#receipt-text')).toContainText('no credit check');
  expect(errors).toEqual([]);
});

test('each human move goes to chat, with retry; agent moves update the existing board by polling', async ({ page }) => {
  await page.goto('/?app=tic-tac-toe');
  const app = page.frameLocator('#app');
  await expect(app.locator('#turn')).toContainText('Your turn');
  await page.locator('#reject').check();
  await app.getByRole('button', { name: 'Row 1, column 1: empty' }).click();
  await expect(app.locator('#status')).toContainText('rejected');
  await expect(app.locator('#retry')).toBeVisible();
  await page.locator('#reject').uncheck();
  await app.locator('#retry').click();
  await expect(page.locator('#messages pre')).toHaveCount(1);
  await expect(page.locator('#messages')).toContainText('I played X at cell 0');
  await page.locator('#agent-cell').fill('4');
  await page.locator('#agent-move').click();
  await expect(app.getByRole('button', { name: 'Row 2, column 2: O' })).toBeVisible({ timeout: 10_000 });
  await app.getByRole('button', { name: 'Row 1, column 2: empty' }).click();
  await expect(page.locator('#messages pre')).toHaveCount(2);
  await page.locator('#agent-cell').fill('8');
  await page.locator('#agent-move').click();
  await expect(app.getByRole('button', { name: 'Row 3, column 3: O' })).toBeVisible();
  await app.getByRole('button', { name: 'Row 1, column 3: empty' }).click();
  await expect(app.locator('#turn')).toHaveText('You win!');
  await expect(page.locator('#messages pre')).toHaveCount(3);
  await expect(page.locator('#messages')).toContainText('The game has ended');
  await app.getByRole('button', { name: 'New game', exact: true }).click();
  await expect(app.locator('#turn')).toContainText('Your turn');
  await expect(app.locator('.square[data-player="X"]')).toHaveCount(0);
});

test('dashboard preserves a selected metric in chat and expands its compact card', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?app=product-metrics');
  const app = page.frameLocator('#app');
  await expect(app.locator('.kpi')).toHaveCount(6);
  await expect.poll(() => page.locator('#app').evaluate(frame => frame.getBoundingClientRect().height)).toBeGreaterThan(600);
  await expect(page.locator('#chat-card')).toBeHidden();
  await app.locator('#period').selectOption('90d');
  await expect(app.locator('#snapshot')).toContainText('90d');
  await app.locator('#segment').selectOption('enterprise');
  await expect(app.locator('#snapshot')).toContainText('enterprise');
  await app.locator('.kpi[data-id="retention"]').click();
  await expect(page.locator('#context')).toContainText('"metricId": "retention"');
  const value = await app.locator('#selected-value').textContent();
  await app.getByRole('button', { name: 'Reference this metric in chat' }).click();
  await expect(page.locator('#messages')).toContainText('metricId=retention, period=90d, segment=enterprise');
  await page.getByRole('button', { name: 'Render referenced card in chat' }).click();
  const card = page.frameLocator('#chat-card');
  await expect(card.locator('#main')).toHaveClass('compact');
  await expect(card.locator('#selected-value')).toHaveText(value!);
  await card.getByRole('button', { name: 'Open full dashboard' }).click();
  await expect(card.locator('.kpi')).toHaveCount(6);
  await expect(card.locator('#snapshot')).toContainText('90d · enterprise');
  await app.getByRole('button', { name: 'Expand dashboard' }).click();
  await expect(page.locator('body')).toHaveClass('fullscreen');
  expect(errors).toEqual([]);
});

test('direct metric cards are not replaced by bootstrap dashboard data', async ({ page }) => {
  await page.goto('/?app=metric-card');
  const app = page.frameLocator('#app');
  await expect(app.locator('#selected-label')).toHaveText('30-day retention');
  await expect(app.locator('#main')).toHaveClass('compact');
  await expect(app.locator('#snapshot')).toContainText('90d · enterprise');
});

test('sidebar-style launches fetch their own initial data', async ({ page }) => {
  await page.goto('/?app=sidebar');
  await expect(page.frameLocator('#app').locator('.kpi')).toHaveCount(6);
});

test('unsupported host messaging gives a copyable fallback; context is optional', async ({ page }) => {
  await page.goto('/?app=loan-calculator&noMessages=1&noContext=1');
  const app = page.frameLocator('#app');
  await expect(app.locator('#payment')).toHaveText('$489.15');
  await app.getByRole('button', { name: 'Explain this loan in chat' }).click();
  await expect(app.locator('#status')).toContainText('Copy into chat:');
  await page.goto('/?app=loan-calculator&noContext=1');
  await expect(app.locator('#payment')).toHaveText('$489.15');
  await app.getByRole('button', { name: 'Explain this loan in chat' }).click();
  await expect(page.locator('#messages')).toContainText('"principal":25000');
});

for (const kind of ['loan-calculator', 'tic-tac-toe', 'product-metrics']) {
  test(`${kind} works in a narrow, dark, inline-only host`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/?app=${kind}&inlineOnly=1`);
    await expect(page.locator('#host-status')).toContainText('App connected');
    await page.locator('#dark').check();
    const app = page.frameLocator('#app');
    await expect(app.locator('html')).toHaveAttribute('data-theme', 'dark');
    const overflow = await app.locator('body').evaluate(body => body.scrollWidth > body.clientWidth + 1);
    expect(overflow).toBe(false);
    if (kind === 'product-metrics') await expect(app.locator('#fullscreen')).toBeHidden();
  });
}
