const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/order';
const cases=[
  {width:1920,height:1080,cartRatio:.28},
  {width:1600,height:900,cartRatio:.30},
  {width:1440,height:900,cartRatio:.30},
  {width:1366,height:768,cartRatio:.30},
  {width:1280,height:800,cartRatio:.32}
];

async function orderFrame(page){
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  const frame=page.frame({url:/pages\/order\/index\.html/})||page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
  if(!frame)throw new Error('order iframe not loaded');
  await expect(frame.locator('body[data-page="order"]')).toBeVisible();
  return frame;
}

for(const item of cases){
  test(`visual contract ${item.width}x${item.height}`,async({page})=>{
    await page.addInitScript(()=>localStorage.clear());
    await page.setViewportSize({width:item.width,height:item.height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    const frame=await orderFrame(page);

    const ratio=await frame.evaluate(()=>{
      const grid=document.querySelector('.order-grid')?.getBoundingClientRect();
      const cart=document.querySelector('.cart')?.getBoundingClientRect();
      if(!grid||!cart)return null;
      return cart.width/grid.width;
    });
    expect(ratio).not.toBeNull();
    expect(Math.abs(ratio-item.cartRatio)).toBeLessThan(.025);

    await frame.locator('[data-action="open-completion"]').click();
    const modal=frame.locator('.completion-card').last();
    await expect(modal).toBeVisible();
    await page.waitForTimeout(350);
    const rect=await modal.evaluate(node=>{
      const r=node.getBoundingClientRect();
      return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:innerWidth,height:innerHeight};
    });
    expect(rect.left).toBeGreaterThanOrEqual(-1);
    expect(rect.top).toBeGreaterThanOrEqual(-1);
    expect(rect.right).toBeLessThanOrEqual(rect.width+1);
    expect(rect.bottom).toBeLessThanOrEqual(rect.height+1);
  });
}
