const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/';
const sources=['order','orders','dine','soldout'];

for(const source of sources){
  test(`${source} reaches more with one bottom-nav click`,async({page})=>{
    await page.goto(`${APP}#/${source}`,{waitUntil:'domcontentloaded'});
    const frame=page.frameLocator('#page');
    const more=frame.locator('[data-action="shell-navigate"][data-route="more"]');
    await expect(more).toBeVisible();
    await more.click();
    await expect(page).toHaveURL(/#\/more$/,{timeout:1500});
    await expect(page.locator('#page.is-active')).toHaveCount(1,{timeout:1500});
  });
}

test('shell keeps the current page visible while the next route loads',async({page})=>{
  await page.goto(`${APP}#/order`,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#page')).toBeVisible();
  await expect(page.locator('#page-next')).toHaveCount(1);
  await expect(page.locator('#page.is-active')).toHaveCount(1);

  const frame=page.frameLocator('#page.is-active');
  await frame.locator('[data-action="shell-navigate"][data-route="more"]').click();

  await expect(page.locator('#page.is-active')).toBeVisible();
  await expect(page.locator('#page-next.is-loading')).toHaveCount(1);
  await expect(page).toHaveURL(/#\/more$/,{timeout:1500});
  await expect(page.locator('iframe.is-active')).toHaveAttribute('src',/pages\/more\/index\.html/,{timeout:1500});
});

test('warm route switching completes without a forced cache-busting URL',async({page})=>{
  await page.goto(`${APP}#/order`,{waitUntil:'domcontentloaded'});
  const clickRoute=async(route)=>{
    const active=page.frameLocator('iframe.is-active');
    const button=active.locator(`[data-action="shell-navigate"][data-route="${route}"]`);
    await expect(button).toBeVisible();
    const started=Date.now();
    await button.click();
    await expect(page).toHaveURL(new RegExp(`#/${route}$`),{timeout:1500});
    await expect(page.locator('iframe.is-active')).toHaveAttribute('src',new RegExp(`pages/${route}/index\\.html\\?build=`),{timeout:1500});
    const src=await page.locator('iframe.is-active').getAttribute('src');
    expect(src).not.toMatch(/[?&](t|nav|ts)=\d+/);
    return Date.now()-started;
  };

  await clickRoute('more');
  await clickRoute('order');
  const elapsed=await clickRoute('more');
  expect(elapsed).toBeLessThan(900);
});
