const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/order';
const sizes=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800]];

async function orderFrame(page){
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  await page.waitForTimeout(300);
  const frame=page.frame({url:/pages\/order\/index\.html/})||page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
  if(!frame)throw new Error('order iframe not loaded');
  await expect(frame.locator('body[data-page="order"]')).toBeVisible();
  return frame;
}

for(const [width,height] of sizes){
  test(`order page fits and remains operable at ${width}x${height}`,async({page})=>{
    await page.setViewportSize({width,height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    const frame=await orderFrame(page);
    await expect(frame.locator('.cart')).toBeVisible();
    await expect(frame.locator('.catalog')).toBeVisible();
    await expect(frame.locator('.cart footer .primary')).toBeVisible();
    await expect(frame.locator('.product-card:not([disabled])').first()).toBeVisible({timeout:15000});

    const layout=await frame.evaluate(()=>{
      const cart=document.querySelector('.cart')?.getBoundingClientRect();
      const catalog=document.querySelector('.catalog')?.getBoundingClientRect();
      const primary=document.querySelector('.cart footer .primary')?.getBoundingClientRect();
      const cards=[...document.querySelectorAll('.product-card:not([disabled])')].slice(0,2).map(node=>node.getBoundingClientRect());
      return {innerWidth,innerHeight,cart,catalog,primary,cards};
    });
    for(const rect of [layout.cart,layout.catalog,layout.primary]){
      expect(rect).toBeTruthy();
      expect(rect.left).toBeGreaterThanOrEqual(0);
      expect(rect.right).toBeLessThanOrEqual(layout.innerWidth+1);
      expect(rect.top).toBeGreaterThanOrEqual(0);
      expect(rect.bottom).toBeLessThanOrEqual(layout.innerHeight+1);
    }
    if(layout.cards.length===2){
      const [a,b]=layout.cards;
      const overlap=!(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top);
      expect(overlap).toBeFalsy();
    }

    await frame.locator('.product-card:not([disabled])').first().click({force:true});
    const modal=frame.locator('.modal-card,.confirm-card').last();
    if(await modal.count()){
      await expect(modal).toBeVisible();
      const rect=await modal.evaluate(node=>{const r=node.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:innerWidth,height:innerHeight};});
      expect(rect.left).toBeGreaterThanOrEqual(-1);
      expect(rect.right).toBeLessThanOrEqual(rect.width+1);
      expect(rect.top).toBeGreaterThanOrEqual(-1);
      expect(rect.bottom).toBeLessThanOrEqual(rect.height+1);
    }
  });
}
