const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/order';
const sizes=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800]];
const routes=['order','checkout','orders','dine','soldout','more'];

async function currentFrame(page,route){
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  await page.waitForTimeout(180);
  const re=new RegExp(`pages\\/${route}\\/index\\.html`);
  const frame=page.frames().find(f=>re.test(f.url()));
  if(!frame)throw new Error(`${route} iframe not loaded`);
  await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible({timeout:15000});
  return frame;
}

for(const [width,height] of sizes){
  test(`responsive stress matrix ${width}x${height}`,async({page})=>{
    const pageErrors=[];
    page.on('pageerror',error=>pageErrors.push(String(error?.message||error)));
    await page.setViewportSize({width,height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});

    let frame=await currentFrame(page,'order');

    // Rapid product/cart activity. Keep actions bounded so the matrix stays deterministic.
    for(let i=0;i<40;i++){
      const card=frame.locator('.product-card:not([disabled])').nth(i%Math.max(1,await frame.locator('.product-card:not([disabled])').count()));
      if(await card.count())await card.click({force:true});
      const close=frame.locator('[data-action="modal-close"],[data-action="close"],.modal-card header button,.confirm-card button').first();
      if(await close.count()&&await close.isVisible().catch(()=>false))await close.click({force:true}).catch(()=>{});
    }

    const qtyButtons=frame.locator('[data-action="cart-qty"]');
    const qtyCount=await qtyButtons.count();
    for(let i=0;i<30&&qtyCount;i++)await qtyButtons.nth(i%qtyCount).click({force:true}).catch(()=>{});

    // Route hammer: each main page must survive repeated navigation.
    for(let i=0;i<24;i++){
      const route=routes[i%routes.length];
      await page.evaluate(r=>{location.hash='#/'+r;},route);
      await currentFrame(page,route);
    }

    // Resize/reload churn simulates Android viewport changes and WebView recreation.
    const alternate=width===1280?{width:1366,height:768}:{width:1280,height:800};
    for(let i=0;i<4;i++){
      await page.setViewportSize(i%2?{width,height}:alternate);
      await page.waitForTimeout(120);
    }
    await page.setViewportSize({width,height});
    await page.evaluate(()=>{location.hash='#/order';});
    frame=await currentFrame(page,'order');
    await page.reload({waitUntil:'domcontentloaded'});
    frame=await currentFrame(page,'order');

    const shell=await page.locator('#stage').evaluate(node=>({fitted:node.dataset.fitted,profile:node.dataset.responsiveProfile||node.dataset.profile}));
    expect(shell.fitted).toBe('1');
    expect(shell.profile).toBeTruthy();
    expect(pageErrors,`runtime page errors: ${pageErrors.join(' | ')}`).toEqual([]);
  });
}
