const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/order';
const cases=[
  {width:1920,height:1080,profile:'large'},
  {width:1600,height:900,profile:'standard'},
  {width:1440,height:900,profile:'standard'},
  {width:1366,height:768,profile:'compact'},
  {width:1280,height:800,profile:'compact'}
];

for(const item of cases){
  test(`responsive profile ${item.width}x${item.height} -> ${item.profile}`,async({page})=>{
    await page.setViewportSize({width:item.width,height:item.height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    await expect(page.locator('#stage')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-responsive-profile',item.profile);
    await expect(page.locator('html')).toHaveAttribute('data-viewport-width',String(item.width));
    await expect(page.locator('html')).toHaveAttribute('data-viewport-height',String(item.height));
    const frame=page.frame({url:/pages\/order\/index\.html/})||page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
    expect(frame).toBeTruthy();
    await expect(frame.locator('html')).toHaveAttribute('data-responsive-profile',item.profile);
  });
}

test('1920 baseline boots after responsive engine integration',async({page})=>{
  const runtimeErrors=[];
  page.on('pageerror',error=>runtimeErrors.push(String(error)));
  await page.setViewportSize({width:1920,height:1080});
  await page.goto(APP,{waitUntil:'domcontentloaded'});
  const frame=page.frame({url:/pages\/order\/index\.html/})||page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
  expect(frame).toBeTruthy();
  await expect(frame.locator('body[data-page="order"]')).toBeVisible();
  await expect(frame.locator('#app')).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});
