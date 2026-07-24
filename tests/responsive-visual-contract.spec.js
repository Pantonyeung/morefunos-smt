const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/order';
const cases=[
  {width:1920,height:1080},
  {width:1600,height:900},
  {width:1440,height:900},
  {width:1366,height:768},
  {width:1280,height:800}
];

async function orderFrame(page){
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  const frame=page.frame({url:/pages\/order\/index\.html/})||page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
  if(!frame)throw new Error('order iframe not loaded');
  await expect(frame.locator('body[data-page="order"]')).toBeVisible();
  return frame;
}

async function layoutRatio(frame){
  return frame.evaluate(()=>{
    const grid=document.querySelector('.order-grid')?.getBoundingClientRect();
    const cart=document.querySelector('.cart')?.getBoundingClientRect();
    if(!grid||!cart)return null;
    return cart.width/grid.width;
  });
}

async function expectInsideViewport(locator){
  await expect(locator).toBeVisible();
  const rect=await locator.evaluate(node=>{
    const r=node.getBoundingClientRect();
    return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:innerWidth,height:innerHeight};
  });
  expect(rect.left).toBeGreaterThanOrEqual(-1);
  expect(rect.top).toBeGreaterThanOrEqual(-1);
  expect(rect.right).toBeLessThanOrEqual(rect.width+1);
  expect(rect.bottom).toBeLessThanOrEqual(rect.height+1);
}

for(const item of cases){
  test(`visual contract ${item.width}x${item.height}`,async({page})=>{
    await page.addInitScript(()=>localStorage.clear());
    await page.setViewportSize({width:item.width,height:item.height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    const frame=await orderFrame(page);

    // Default cart setting is 32/68 and must stay a real 32% choice on every supported viewport.
    expect(Math.abs((await layoutRatio(frame))-.32)).toBeLessThan(.02);

    // User cart ratio controls must actually alter the live layout.
    await frame.locator('[data-action="open-settings"]').click();
    const settings=frame.locator('.side-card.modal-card').last();
    await expectInsideViewport(settings);
    for(const choice of [25,30,32]){
      await frame.locator(`[data-action="cart-width"][data-value="${choice}"]`).click();
      await page.waitForTimeout(80);
      expect(Math.abs((await layoutRatio(frame))-(choice/100))).toBeLessThan(.02);
      if(choice!==32){
        await frame.locator('[data-action="open-settings"]').click();
        await expectInsideViewport(frame.locator('.side-card.modal-card').last());
      }
    }
    await frame.locator('[data-action="dismiss-modal"]').last().click();

    // Product cards must remain inside the catalog and use the responsive hero height.
    const card=frame.locator('.product-card.large:not([disabled])').first();
    await expect(card).toBeVisible();
    const cardMetrics=await card.evaluate(node=>{
      const card=node.getBoundingClientRect();
      const hero=node.querySelector('.product-hero')?.getBoundingClientRect();
      const catalog=document.querySelector('.catalog')?.getBoundingClientRect();
      return {card,hero,catalog};
    });
    expect(cardMetrics.card.left).toBeGreaterThanOrEqual(cardMetrics.catalog.left-1);
    expect(cardMetrics.card.right).toBeLessThanOrEqual(cardMetrics.catalog.right+1);
    expect(cardMetrics.hero.height).toBeGreaterThanOrEqual(90);
    expect(cardMetrics.hero.height).toBeLessThanOrEqual(151);

    // Representative operational popups must all remain fully on-screen.
    const popupActions=[
      ['open-completion','.completion-card'],
      ['open-quick-settings','.quick-mode-card'],
      ['open-health','.side-card.modal-card'],
      ['toggle-pending-panel','.pending-panel']
    ];
    for(const [action,selector] of popupActions){
      await frame.locator(`[data-action="${action}"]`).first().click();
      await page.waitForTimeout(250);
      await expectInsideViewport(frame.locator(selector).last());
      await frame.locator('[data-action="dismiss-modal"]').last().click();
    }
  });
}

test('product card hero height scales down with viewport',async({page})=>{
  const heights=[];
  for(const item of cases){
    await page.setViewportSize({width:item.width,height:item.height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    const frame=await orderFrame(page);
    const height=await frame.locator('.product-card.large:not([disabled]) .product-hero').first().evaluate(node=>node.getBoundingClientRect().height);
    heights.push(height);
  }
  expect(heights[0]).toBeGreaterThan(heights.at(-1));
  for(let i=1;i<heights.length;i++)expect(heights[i]).toBeLessThanOrEqual(heights[i-1]+1);
});
