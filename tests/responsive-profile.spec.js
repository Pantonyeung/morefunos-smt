const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/order';
const cases=[
  {width:1920,height:1080,profile:'large',widthClass:'extra-large',heightClass:'expanded'},
  {width:1600,height:900,profile:'standard',widthClass:'extra-large',heightClass:'expanded'},
  {width:1440,height:900,profile:'standard',widthClass:'large',heightClass:'expanded'},
  {width:1366,height:768,profile:'standard',widthClass:'large',heightClass:'medium'},
  {width:1280,height:800,profile:'compact',widthClass:'large',heightClass:'medium'}
];

async function waitForOrderFrame(page){
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('iframe')).some(frame=>/pages\/order\/index\.html/.test(frame.src)),null,{timeout:15000});
  await expect.poll(()=>{
    const frame=page.frames().find(candidate=>/pages\/order\/index\.html/.test(candidate.url()));
    return Boolean(frame);
  },{timeout:15000}).toBe(true);
  return page.frames().find(frame=>/pages\/order\/index\.html/.test(frame.url()));
}

for(const item of cases){
  test(`adaptive profile ${item.width}x${item.height} -> ${item.profile} / ${item.widthClass}-${item.heightClass}`,async({page})=>{
    await page.setViewportSize({width:item.width,height:item.height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    await expect(page.locator('#stage')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-responsive-profile',item.profile);
    await expect(page.locator('html')).toHaveAttribute('data-viewport-width',String(item.width));
    await expect(page.locator('html')).toHaveAttribute('data-viewport-height',String(item.height));
    await expect(page.locator('html')).toHaveAttribute('data-window-width-class',item.widthClass);
    await expect(page.locator('html')).toHaveAttribute('data-window-height-class',item.heightClass);
    await expect(page.locator('html')).toHaveAttribute('data-two-pane-eligible','true');
    const frame=await waitForOrderFrame(page);
    await expect(frame.locator('html')).toHaveAttribute('data-responsive-profile',item.profile);
    await expect(frame.locator('html')).toHaveAttribute('data-window-width-class',item.widthClass);
    await expect(frame.locator('html')).toHaveAttribute('data-window-height-class',item.heightClass);
    await expect(frame.locator('html')).toHaveAttribute('data-two-pane-eligible','true');
  });
}

test('1920 baseline boots after adaptive window contract integration',async({page})=>{
  const runtimeErrors=[];
  page.on('pageerror',error=>runtimeErrors.push(String(error)));
  await page.setViewportSize({width:1920,height:1080});
  await page.goto(APP,{waitUntil:'domcontentloaded'});
  const frame=await waitForOrderFrame(page);
  await expect(frame.locator('body[data-page="order"]')).toBeVisible();
  await expect(frame.locator('#app')).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});
