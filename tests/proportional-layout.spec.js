const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/order';
const cases=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800]];
const targetRows={large:10/3,small:13/3,text:16/3};

async function frameFor(page,route){
  await page.goto(`http://127.0.0.1:4173/#/${route}`,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  const pattern=new RegExp(`pages\\/${route==='order'?'order':route}\\/index\\.html`);
  const frame=page.frames().find(f=>pattern.test(f.url()));
  if(!frame)throw new Error(`${route} iframe not loaded`);
  await expect(frame.locator('body')).toBeVisible();
  return frame;
}

async function setCardMode(frame,mode){
  await frame.locator('[data-action="open-settings"]').click();
  await frame.locator(`[data-action="setting-card"][data-value="${mode}"]`).click();
  await frame.locator('[data-action="dismiss-modal"]').last().click();
  await frame.waitForTimeout(120);
}

async function productMetrics(frame,mode){
  return frame.evaluate((mode)=>{
    const products=document.querySelector(`.products-${mode}`);
    const card=products?.querySelector(`.product-card.${mode}`);
    if(!products||!card)return null;
    const style=getComputedStyle(products);
    const height=products.clientHeight-parseFloat(style.paddingTop||0)-parseFloat(style.paddingBottom||0);
    const gap=parseFloat(style.rowGap||style.gap||0);
    const cardHeight=card.getBoundingClientRect().height;
    return {height,gap,cardHeight};
  },mode);
}

for(const [width,height] of cases){
  test(`order proportional card visibility ${width}x${height}`,async({page})=>{
    await page.addInitScript(()=>localStorage.clear());
    await page.setViewportSize({width,height});
    const frame=await frameFor(page,'order');
    for(const mode of ['large','small','text']){
      await setCardMode(frame,mode);
      const metric=await productMetrics(frame,mode);
      expect(metric).toBeTruthy();
      const expected=(metric.height-Math.floor(targetRows[mode])*metric.gap)/targetRows[mode];
      expect(Math.abs(metric.cardHeight-expected)).toBeLessThan(3);
    }
  });
}

test('large card reserves roughly three quarters for image',async({page})=>{
  await page.setViewportSize({width:1280,height:800});
  const frame=await frameFor(page,'order');
  const card=frame.locator('.product-card.large:not([disabled])').first();
  await expect(card).toBeVisible();
  const ratio=await card.evaluate(node=>{
    const card=node.getBoundingClientRect();
    const hero=node.querySelector('.product-hero')?.getBoundingClientRect();
    return hero?hero.height/card.height:0;
  });
  expect(ratio).toBeGreaterThan(.68);
  expect(ratio).toBeLessThan(.80);
});

test('soldout uses the same large-card height contract as order',async({page})=>{
  await page.addInitScript(()=>localStorage.clear());
  await page.setViewportSize({width:1440,height:900});
  const order=await frameFor(page,'order');
  const orderHeight=await order.locator('.product-card.large:not([disabled])').first().evaluate(node=>node.getBoundingClientRect().height);
  const soldout=await frameFor(page,'soldout');
  const soldoutHeight=await soldout.locator('.supply-product.large').first().evaluate(node=>node.getBoundingClientRect().height);
  expect(Math.abs(soldoutHeight-orderHeight)).toBeLessThan(3);
});
