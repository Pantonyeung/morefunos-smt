const {test,expect}=require('@playwright/test');

const cases=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800]];
const targetRows={large:10/3,small:13/3,text:16/3};

async function resetStorageOnce(page){
  await page.addInitScript(()=>{
    try{
      const flag='__qa_proportional_storage_ready';
      if(localStorage.getItem(flag)==='1')return;
      localStorage.clear();
      localStorage.setItem(flag,'1');
    }catch{}
  });
}

async function frameFor(page,route){
  await page.goto(`http://127.0.0.1:4173/#/${route}`,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  const pattern=new RegExp(`pages\\/${route}\\/index\\.html`);
  await expect.poll(()=>page.frames().some(f=>pattern.test(f.url())),{timeout:15000}).toBe(true);
  const frame=page.frames().find(f=>pattern.test(f.url()));
  await expect(frame.locator('body')).toBeVisible();
  return frame;
}

async function setCardMode(page,frame,mode){
  const settingsButton=page.getByRole('button',{name:'顯示設定',exact:true});
  await expect(settingsButton).toBeVisible({timeout:5000});
  await settingsButton.click({timeout:5000});
  await expect(frame.locator(`[data-action="setting-card"][data-value="${mode}"]`)).toBeVisible({timeout:5000});
  await frame.locator(`[data-action="setting-card"][data-value="${mode}"]`).click({timeout:5000});
  await frame.locator('[data-action="dismiss-modal"]').last().click({timeout:5000});
  await expect(page.locator('#shell-app')).not.toHaveClass(/child-overlay-active/,{timeout:5000});
  await expect(page.locator('#page')).not.toHaveClass(/has-shell-overlay/,{timeout:5000});
  await expect.poll(async()=>{
    const metric=await productMetrics(frame,mode);
    if(!metric)return null;
    return {
      source:metric.source,
      targetOk:Math.abs(metric.target-targetRows[mode])<.01,
      rowsOk:Math.abs(metric.visibleRows-targetRows[mode])<.08
    };
  },{timeout:5000,intervals:[50,100,200]}).toEqual({source:'order-live-area',targetOk:true,rowsOk:true});
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
    return {height,gap,cardHeight,visibleRows,target:Number(products.dataset.adaptiveTargetRows||0),source:document.documentElement.dataset.adaptiveProductSource||''};
  },mode);
}

for(const [width,height] of cases){
  test(`order exact visible-row capacity ${width}x${height}`,async({page})=>{
    await resetStorageOnce(page);
    await page.setViewportSize({width,height});
    const frame=await frameFor(page,'order');
    for(const mode of ['large','small','text']){
      await setCardMode(page,frame,mode);
      const metric=await productMetrics(frame,mode);
      expect(metric).toBeTruthy();
      expect(metric.source).toBe('order-live-area');
      expect(Math.abs(metric.target-targetRows[mode])).toBeLessThan(.01);
      expect(Math.abs(metric.visibleRows-targetRows[mode])).toBeLessThan(.08);
    }
  });
}

test('large card reserves roughly three quarters for image',async({page})=>{
  await resetStorageOnce(page);
  await page.setViewportSize({width:1280,height:800});
  const frame=await frameFor(page,'order');
  await setCardMode(page,frame,'large');
  const card=frame.locator('.product-card.large:not([disabled])').first();
  await expect(card).toBeVisible();
  const ratio=await card.evaluate(node=>{const card=node.getBoundingClientRect();const hero=node.querySelector('.product-hero')?.getBoundingClientRect();return hero?hero.height/card.height:0;});
  expect(ratio).toBeGreaterThan(.70);
  expect(ratio).toBeLessThan(.78);
});

for(const [width,height] of cases){
  test(`soldout reuses order large-card width and height ${width}x${height}`,async({page})=>{
    await resetStorageOnce(page);
    await page.setViewportSize({width,height});
    const order=await frameFor(page,'order');
    await setCardMode(page,order,'large');
    const orderBox=await order.locator('.product-card.large:not([disabled])').first().evaluate(node=>{const r=node.getBoundingClientRect();return {width:r.width,height:r.height};});
    const soldout=await frameFor(page,'soldout');
    await expect.poll(async()=>{
      const card=soldout.locator('.supply-product.large').first();
      if(!await card.count())return null;
      const soldoutBox=await card.evaluate(node=>{const r=node.getBoundingClientRect();return {width:r.width,height:r.height};});
      const source=await soldout.evaluate(()=>document.documentElement.dataset.adaptiveProductSource||'');
      return {
        source,
        heightOk:Math.abs(soldoutBox.height-orderBox.height)<3,
        widthOk:Math.abs(soldoutBox.width-orderBox.width)<4
      };
    },{timeout:5000,intervals:[50,100,200]}).toEqual({source:'order-shared-metric',heightOk:true,widthOk:true});
  });
}

test('order cart lower controls keep current authority proportions',async({page})=>{
  await resetStorageOnce(page);
  await page.setViewportSize({width:1280,height:800});
  const frame=await frameFor(page,'order');
  const footer=frame.locator('.cart footer button');
  await expect(footer).toHaveCount(3);
  const footerWidths=await footer.evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().width));
  expect(Math.abs(footerWidths[0]-footerWidths[1])).toBeLessThan(3);
  expect(footerWidths[2]/footerWidths[0]).toBeGreaterThan(3.0);
  expect(footerWidths[2]/footerWidths[0]).toBeLessThan(4.6);
  const pending=frame.locator('.pending-area>button');
  await expect(pending).toHaveCount(3);
  const pendingWidths=await pending.evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().width));
  expect(pendingWidths[0]/pendingWidths[1]).toBeGreaterThan(2.2);
  expect(pendingWidths[2]/pendingWidths[1]).toBeGreaterThan(.8);
  expect(pendingWidths[2]/pendingWidths[1]).toBeLessThan(1.3);
});
