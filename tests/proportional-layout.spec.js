const {test,expect}=require('@playwright/test');

const cases=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800]];
const targetRows={large:10/3,small:13/3,text:16/3};

async function frameFor(page,route){
  await page.goto(`http://127.0.0.1:4173/#/${route}`,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  const pattern=new RegExp(`pages\\/${route}\\/index\\.html`);
  const frame=page.frames().find(f=>pattern.test(f.url()));
  if(!frame)throw new Error(`${route} iframe not loaded`);
  await expect(frame.locator('body')).toBeVisible();
  return frame;
}

async function setCardMode(frame,mode){
  await frame.locator('[data-action="open-settings"]').click();
  await frame.locator(`[data-action="setting-card"][data-value="${mode}"]`).click();
  await frame.locator('[data-action="dismiss-modal"]').last().click();
  await frame.waitForTimeout(320);
}

async function productMetrics(frame,mode){
  return frame.evaluate((mode)=>{
    const products=document.querySelector(`.products-${mode}`);
    const card=products?.querySelector(`.product-card.${mode}`);
    if(!products||!card)return null;
    const style=getComputedStyle(products);
    const rect=products.getBoundingClientRect();
    const paddingTop=parseFloat(style.paddingTop||0);
    const paddingBottom=parseFloat(style.paddingBottom||0);
    const visibleBox=Math.max(0,Math.min(innerHeight,rect.bottom)-Math.max(0,rect.top));
    const height=visibleBox-paddingTop-paddingBottom;
    const gap=parseFloat(style.rowGap||style.gap||0);
    const cardHeight=card.getBoundingClientRect().height;
    const visibleRows=(height+gap)/(cardHeight+gap);
    return {
      height,gap,cardHeight,visibleRows,
      target:Number(products.dataset.adaptiveTargetRows||0),
      source:document.documentElement.dataset.adaptiveProductSource||''
    };
  },mode);
}

for(const [width,height] of cases){
  test(`order exact visible-row capacity ${width}x${height}`,async({page})=>{
    await page.addInitScript(()=>localStorage.clear());
    await page.setViewportSize({width,height});
    const frame=await frameFor(page,'order');
    for(const mode of ['large','small','text']){
      await setCardMode(frame,mode);
      const metric=await productMetrics(frame,mode);
      expect(metric).toBeTruthy();
      expect(metric.source).toBe('order-live-area');
      expect(Math.abs(metric.target-targetRows[mode])).toBeLessThan(.01);
      expect(Math.abs(metric.visibleRows-targetRows[mode])).toBeLessThan(.08);
    }
  });
}

test('large card reserves roughly three quarters for image',async({page})=>{
  await page.addInitScript(()=>localStorage.clear());
  await page.setViewportSize({width:1280,height:800});
  const frame=await frameFor(page,'order');
  await setCardMode(frame,'large');
  const card=frame.locator('.product-card.large:not([disabled])').first();
  await expect(card).toBeVisible();
  const ratio=await card.evaluate(node=>{
    const card=node.getBoundingClientRect();
    const hero=node.querySelector('.product-hero')?.getBoundingClientRect();
    return hero?hero.height/card.height:0;
  });
  expect(ratio).toBeGreaterThan(.70);
  expect(ratio).toBeLessThan(.78);
});

test('soldout reuses order large-card height at same viewport',async({page})=>{
  await page.addInitScript(()=>localStorage.clear());
  await page.setViewportSize({width:1440,height:900});
  const order=await frameFor(page,'order');
  await setCardMode(order,'large');
  const orderHeight=await order.locator('.product-card.large:not([disabled])').first().evaluate(node=>node.getBoundingClientRect().height);
  const soldout=await frameFor(page,'soldout');
  await soldout.waitForTimeout(320);
  const soldoutHeight=await soldout.locator('.supply-product.large').first().evaluate(node=>node.getBoundingClientRect().height);
  const source=await soldout.evaluate(()=>document.documentElement.dataset.adaptiveProductSource||'');
  expect(source).toBe('order-shared-metric');
  expect(Math.abs(soldoutHeight-orderHeight)).toBeLessThan(3);
});
