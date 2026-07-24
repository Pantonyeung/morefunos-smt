const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/checkout';
const sizes=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800]];

async function checkoutFrame(page){
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  await page.waitForTimeout(250);
  const frame=page.frame({url:/pages\/checkout\/index\.html/})||page.frames().find(f=>/pages\/checkout\/index\.html/.test(f.url()));
  if(!frame)throw new Error('checkout iframe not loaded');
  await expect(frame.locator('body[data-page="checkout"]')).toBeVisible();
  return frame;
}

for(const [width,height] of sizes){
  test(`checkout controls fit ${width}x${height}`,async({page})=>{
    await page.setViewportSize({width,height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    const frame=await checkoutFrame(page);
    await expect(frame.locator('.checkout-cart')).toBeVisible();
    await expect(frame.locator('.checkout-main')).toBeVisible();
    await expect(frame.locator('.row.channels button').first()).toBeVisible();
    await expect(frame.locator('.keypad button').first()).toBeVisible();
    await expect(frame.locator('.confirm')).toBeVisible();

    const result=await frame.evaluate(()=>{
      const selectors=['.checkout-cart','.checkout-main','.row.channels button','.keypad button','.confirm'];
      return {width:innerWidth,height:innerHeight,rects:selectors.map(selector=>{const node=document.querySelector(selector);if(!node)return null;const r=node.getBoundingClientRect();return {selector,left:r.left,right:r.right,top:r.top,bottom:r.bottom};})};
    });
    for(const rect of result.rects){
      expect(rect,`missing ${rect?.selector||'element'}`).toBeTruthy();
      expect(rect.left).toBeGreaterThanOrEqual(-1);
      expect(rect.right).toBeLessThanOrEqual(result.width+1);
      expect(rect.top).toBeGreaterThanOrEqual(-1);
      expect(rect.bottom).toBeLessThanOrEqual(result.height+1);
    }
  });
}
