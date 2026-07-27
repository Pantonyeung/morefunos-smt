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
  test(`order page fits and keeps component contracts at ${width}x${height}`,async({page})=>{
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
      const rootStyle=getComputedStyle(document.documentElement);
      const imageToken=parseFloat(rootStyle.getPropertyValue('--adaptive-cart-image'))||0;
      const markerToken=parseFloat(rootStyle.getPropertyValue('--adaptive-cart-marker'))||0;
      const hero=document.querySelector('.product-card.large:not(.no-product-image) .product-hero');
      const heroImg=hero?.querySelector('img');
      const heroRect=hero?.getBoundingClientRect();
      const heroImgRect=heroImg?.getBoundingClientRect();
      const heroFit=heroImg?getComputedStyle(heroImg).objectFit:'';
      return {innerWidth,innerHeight,cart,catalog,primary,cards,imageToken,markerToken,heroRect,heroImgRect,heroFit};
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

    expect(layout.imageToken).toBeGreaterThan(0);
    expect(layout.markerToken/layout.imageToken).toBeCloseTo(.9,2);
    if(layout.heroRect&&layout.heroImgRect){
      expect(layout.heroFit).toBe('contain');
      expect(layout.heroImgRect.width/layout.heroRect.width).toBeLessThanOrEqual(.72);
      expect(layout.heroImgRect.height/layout.heroRect.height).toBeLessThanOrEqual(.72);
      expect(layout.heroImgRect.width/layout.heroRect.width).toBeGreaterThan(.5);
      expect(layout.heroImgRect.height/layout.heroRect.height).toBeGreaterThan(.5);
    }

    const quickHandle=frame.locator('[data-action="toggle-quick-drawer"]').first();
    if(await quickHandle.count()){
      await quickHandle.click();
      const drink=frame.locator('.quick-drawer-panel .drink-choice-card.is-image').first();
      if(await drink.count()){
        await expect(drink).toBeVisible();
        const drinkVisual=await drink.evaluate(node=>{
          const shell=node.querySelector('.drink-choice-img');
          const img=shell?.querySelector('img');
          const shellRect=shell?.getBoundingClientRect();
          const imgRect=img?.getBoundingClientRect();
          return {fit:img?getComputedStyle(img).objectFit:'',shellRect,imgRect};
        });
        if(drinkVisual.shellRect&&drinkVisual.imgRect){
          expect(drinkVisual.fit).toBe('contain');
          expect(drinkVisual.imgRect.width/drinkVisual.shellRect.width).toBeLessThanOrEqual(.72);
          expect(drinkVisual.imgRect.height/drinkVisual.shellRect.height).toBeLessThanOrEqual(.72);
        }
      }
    }

    const pairingButton=frame.locator('[data-action="open-specified-link"]').first();
    if(await pairingButton.count()){
      await pairingButton.click();
      const pairing=frame.locator('.specified-link-card').last();
      if(await pairing.count()){
        await expect(pairing).toBeVisible();
        const modal=await pairing.evaluate(node=>{
          const r=node.getBoundingClientRect();
          const footer=node.querySelector('footer')?.getBoundingClientRect();
          const body=node.querySelector('.pairing-body')?.getBoundingClientRect();
          return {rect:r,footer,body,viewportHeight:innerHeight};
        });
        expect(modal.rect.top).toBeGreaterThanOrEqual(-1);
        expect(modal.rect.bottom).toBeLessThanOrEqual(modal.viewportHeight+1);
        if(modal.footer){
          expect(modal.footer.top).toBeGreaterThanOrEqual(modal.rect.top-1);
          expect(modal.footer.bottom).toBeLessThanOrEqual(modal.rect.bottom+1);
        }
        if(modal.body&&modal.footer)expect(modal.body.bottom).toBeLessThanOrEqual(modal.footer.top+1);
      }
    }
  });
}
