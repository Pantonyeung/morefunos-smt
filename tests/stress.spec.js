const { test, expect } = require('@playwright/test');

const APP = 'http://127.0.0.1:4173/#/order';

function attachErrorCapture(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(String(error?.stack || error)));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('console: ' + msg.text());
  });
  return errors;
}

async function orderFrame(page) {
  const frameHandle = page.locator('#page');
  await expect(frameHandle).toBeVisible({ timeout: 15000 });
  const frame = page.frame({ url: /pages\/order\/index\.html/ });
  if (frame) return frame;
  await page.waitForTimeout(500);
  const fallback = page.frames().find(f => /pages\/order\/index\.html/.test(f.url()));
  if (!fallback) throw new Error('order iframe not loaded');
  return fallback;
}

test.describe.configure({ mode: 'serial' });

test('1920 baseline boots cleanly', async ({ page }) => {
  const errors = attachErrorCapture(page);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(APP, { waitUntil: 'networkidle' });
  const frame = await orderFrame(page);
  await expect(frame.locator('body[data-page="order"]')).toBeVisible();
  await expect(frame.locator('#app')).toBeVisible();
  await page.waitForTimeout(1000);
  expect(errors, errors.join('\n')).toEqual([]);
});

test('rapid product/cart interaction stress', async ({ page }) => {
  const errors = attachErrorCapture(page);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(APP, { waitUntil: 'domcontentloaded' });
  const frame = await orderFrame(page);
  const products = frame.locator('.product-card:not([disabled])');
  await expect(products.first()).toBeVisible({ timeout: 15000 });

  for (let i = 0; i < 200; i++) {
    await products.nth(i % Math.max(1, await products.count())).click({ force: true });
    const modal = frame.locator('.modal-card, .confirm-card').last();
    if (await modal.count()) {
      const primary = modal.locator('[data-action="quick-add-product"], [data-action="add-product"], [data-action="confirm-product"], .primary').last();
      if (await primary.count()) await primary.click({ force: true }).catch(() => {});
      const close = modal.locator('[data-action="dismiss-modal"]').first();
      if (await close.count()) await close.click({ force: true }).catch(() => {});
    }
  }

  for (let i = 0; i < 150; i++) {
    const plus = frame.locator('[data-action="cart-qty"][data-delta="1"]').first();
    if (await plus.count()) await plus.click({ force: true });
    const minus = frame.locator('[data-action="cart-qty"][data-delta="-1"]').first();
    if (await minus.count()) await minus.click({ force: true });
  }

  await page.waitForTimeout(500);
  expect(errors, errors.join('\n')).toEqual([]);
});

test('modal open close stress', async ({ page }) => {
  const errors = attachErrorCapture(page);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(APP, { waitUntil: 'domcontentloaded' });
  const frame = await orderFrame(page);

  const actions = ['toggle-pending-panel', 'open-health', 'open-settings', 'open-completion'];
  for (let round = 0; round < 80; round++) {
    for (const action of actions) {
      const trigger = frame.locator(`[data-action="${action}"]`).first();
      if (await trigger.count()) {
        await trigger.click({ force: true }).catch(() => {});
        const close = frame.locator('[data-action="dismiss-modal"]').first();
        if (await close.count()) await close.click({ force: true }).catch(() => {});
      }
    }
  }

  await page.waitForTimeout(500);
  expect(errors, errors.join('\n')).toEqual([]);
});

test('navigation hammer test', async ({ page }) => {
  const errors = attachErrorCapture(page);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(APP, { waitUntil: 'domcontentloaded' });

  const routes = ['order', 'checkout', 'orders', 'dine', 'soldout', 'more'];
  for (let i = 0; i < 120; i++) {
    await page.evaluate(route => { location.hash = '#/' + route; }, routes[i % routes.length]);
    await page.waitForTimeout(30);
  }

  await page.evaluate(() => { location.hash = '#/order'; });
  await page.waitForTimeout(1000);
  const frame = await orderFrame(page);
  await expect(frame.locator('#app')).toBeVisible();
  expect(errors, errors.join('\n')).toEqual([]);
});

test('viewport resize and repeated reload stress', async ({ page }) => {
  const errors = attachErrorCapture(page);
  const sizes = [
    [1920,1080], [1600,900], [1440,900], [1366,768], [1280,800], [1920,1080]
  ];
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(APP, { waitUntil: 'domcontentloaded' });

  for (let round = 0; round < 20; round++) {
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(30);
    }
    if (round % 5 === 0) await page.reload({ waitUntil: 'domcontentloaded' });
  }

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(500);
  const frame = await orderFrame(page);
  await expect(frame.locator('#app')).toBeVisible();
  expect(errors, errors.join('\n')).toEqual([]);
});
