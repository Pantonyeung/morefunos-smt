const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/order';
const sizes=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800]];

for(const [width,height] of sizes){
  test(`shell fits ${width}x${height} without horizontal overflow`,async({page})=>{
    await page.setViewportSize({width,height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    await expect(page.locator('#stage')).toBeVisible();
    await expect(page.locator('#page')).toBeVisible();
    const metrics=await page.evaluate(()=>({
      viewport:document.documentElement.clientWidth,
      scroll:document.documentElement.scrollWidth,
      stage:document.getElementById('stage').getBoundingClientRect(),
      frame:document.getElementById('page').getBoundingClientRect()
    }));
    expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport);
    expect(Math.round(metrics.stage.width)).toBe(width);
    expect(Math.round(metrics.frame.width)).toBe(width);
    expect(metrics.stage.left).toBeGreaterThanOrEqual(0);
    expect(metrics.frame.left).toBeGreaterThanOrEqual(0);
  });
}
