const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/';

async function loginAndOpen(page){
  await page.goto(APP,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#startup-gate')).toBeVisible();
  await page.locator('[name="username"]').fill('morefun');
  await page.locator('[name="password"]').fill('morefun');
  await page.getByRole('button',{name:'登入'}).click();
  await expect(page.locator('[data-startup-step="cash"]')).toBeVisible();
  const opening=page.locator('[name="opening-adjustment"]');
  await opening.fill('0');
  await page.getByRole('button',{name:'確認開工'}).click();
  await expect(page.locator('#startup-gate')).toBeHidden();
}

test('global shell owns status bar and bottom navigation',async({page})=>{
  await loginAndOpen(page);
  await expect(page.locator('#global-statusbar')).toBeVisible();
  await expect(page.locator('#global-bottom-nav')).toBeVisible();
  await expect(page.locator('#page-host')).toBeVisible();
});

test('startup requires login before opening cash confirmation',async({page})=>{
  await page.goto(APP,{waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-startup-step="login"]')).toBeVisible();
  await page.locator('[name="username"]').fill('morefun');
  await page.locator('[name="password"]').fill('wrong');
  await page.getByRole('button',{name:'登入'}).click();
  await expect(page.locator('[data-startup-step="login"]')).toBeVisible();
  await expect(page.locator('#startup-error')).toContainText('帳號或密碼');
});

test('global navigation responds immediately and only switches central view',async({page})=>{
  await loginAndOpen(page);
  const nav=page.locator('#global-bottom-nav');
  await nav.locator('[data-route="soldout"]').click();
  await expect(nav.locator('[data-route="soldout"]')).toHaveClass(/active/,{timeout:150});
  await expect(page).toHaveURL(/#\/soldout$/,{timeout:500});
  await expect(page.locator('#global-statusbar')).toBeVisible();
  await expect(page.locator('#global-bottom-nav')).toBeVisible();
});
