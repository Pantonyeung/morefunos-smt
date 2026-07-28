const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/order';
const cases=[{width:1920,height:1080},{width:1600,height:900},{width:1440,height:900},{width:1366,height:768},{width:1280,height:800}];

async function orderFrame(page){
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  await expect.poll(()=>page.frames().some(f=>/pages\/order\/index\.html/.test(f.url())),{timeout:15000}).toBe(true);
  const frame=page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
  await expect(frame.locator('body[data-page="order"]')).toBeVisible();
  return frame;
}

async function layoutRatio(frame){
  return frame.evaluate(()=>{const grid=document.querySelector('.order-grid')?.getBoundingClientRect();const cart=document.querySelector('.cart')?.getBoundingClientRect();return grid&&cart?cart.width/grid.width:null;});
}

async function expectInsideViewport(locator){
  await expect(locator).toBeVisible({timeout:5000});
  const rect=await locator.evaluate(node=>{const r=node.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:innerWidth,height:innerHeight};});
  expect(rect.left).toBeGreaterThanOrEqual(-1);expect(rect.top).toBeGreaterThanOrEqual(-1);expect(rect.right).toBeLessThanOrEqual(rect.width+1);expect(rect.bottom).toBeLessThanOrEqual(rect.height+1);
}

async function clickAction(page,frame,action){
  const source=frame.locator(`[data-action="${action}"][data-shell-source-id]`).first();
  if(await source.count()){
    const sourceId=await source.getAttribute('data-shell-source-id');
    if(sourceId){
      const proxy=page.locator(`[data-shell-action-id="${sourceId}"]`).first();
      await expect(proxy).toBeVisible({timeout:5000});
      return proxy.click({timeout:5000});
    }
  }
  const visibleParent=page.locator(`[data-action="${action}"]:visible`).first();
  if(await visibleParent.count())return visibleParent.click({timeout:5000});
  return frame.locator(`[data-action="${action}"]:visible`).first().click({timeout:5000});
}

for(const item of cases){
  test(`visual contract ${item.width}x${item.height}`,async({page})=>{
    await page.addInitScript(()=>localStorage.clear());await page.setViewportSize(item);await page.goto(APP,{waitUntil:'domcontentloaded'});const frame=await orderFrame(page);
    expect(Math.abs((await layoutRatio(frame))-.32)).toBeLessThan(.02);

    await clickAction(page,frame,'open-settings');
    const settingsCard=frame.locator('.side-card.modal-card').last();
    await expectInsideViewport(settingsCard);
    for(const choice of [25,30,32]){
      await frame.locator(`[data-action="cart-width"][data-value="${choice}"]`).click({timeout:5000});
      await expect(settingsCard).toBeVisible({timeout:5000});
      await expect.poll(()=>layoutRatio(frame),{timeout:5000,intervals:[50,100,200]}).toBeCloseTo(choice/100,1);
    }
    await frame.locator('[data-action="dismiss-modal"]').last().click({timeout:5000});

    const card=frame.locator('.product-card.large:not([disabled])').first();await expect(card).toBeVisible();
    const cardMetrics=await card.evaluate(node=>{const card=node.getBoundingClientRect();const hero=node.querySelector('.product-hero')?.getBoundingClientRect();const catalog=document.querySelector('.catalog')?.getBoundingClientRect();return {card,hero,catalog};});
    expect(cardMetrics.card.left).toBeGreaterThanOrEqual(cardMetrics.catalog.left-1);expect(cardMetrics.card.right).toBeLessThanOrEqual(cardMetrics.catalog.right+1);expect(cardMetrics.hero.height).toBeGreaterThanOrEqual(90);expect(cardMetrics.hero.height).toBeLessThanOrEqual(151);

    const popupActions=[['open-completion','.completion-card'],['open-quick-settings','.quick-mode-card'],['open-health','.side-card.modal-card'],['toggle-pending-panel','.pending-panel']];
    for(const [action,selector] of popupActions){
      await clickAction(page,frame,action);await page.waitForTimeout(120);await expectInsideViewport(frame.locator(selector).last());
      const dismiss=frame.locator('[data-action="dismiss-modal"]').last();if(await dismiss.count())await dismiss.click({timeout:5000}).catch(()=>{});
    }
  });
}

test('product card hero follows responsive profile geometry',async({page})=>{
  const metrics=[];
  for(const item of cases){
    await page.setViewportSize(item);
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    const frame=await orderFrame(page);
    await expect.poll(()=>frame.evaluate(()=>document.documentElement.dataset.adaptiveProductSource||''),{timeout:15000}).toBe('order-live-area');
    const metric=await frame.locator('.product-card.large:not([disabled])').first().evaluate((node,viewport)=>{
      const card=node.getBoundingClientRect();
      const hero=node.querySelector('.product-hero')?.getBoundingClientRect();
      return {viewport,profile:document.documentElement.dataset.responsiveProfile||'',cardHeight:card.height,heroHeight:hero?.height||0,heroRatio:hero?hero.height/card.height:0};
    },item);
    metrics.push(metric);
  }

  const masterAndStandard=metrics.filter(metric=>metric.profile!=='compact');
  expect(masterAndStandard[0].heroHeight).toBeGreaterThan(masterAndStandard.at(-1).heroHeight);
  for(let index=1;index<masterAndStandard.length;index++)expect(masterAndStandard[index].heroHeight).toBeLessThanOrEqual(masterAndStandard[index-1].heroHeight+1);

  const compact=metrics.find(metric=>metric.profile==='compact');
  expect(compact,JSON.stringify(metrics)).toBeTruthy();
  expect(compact.heroRatio).toBeGreaterThan(.70);
  expect(compact.heroRatio).toBeLessThan(.78);
  expect(metrics[0].heroHeight).toBeGreaterThan(compact.heroHeight);
});
