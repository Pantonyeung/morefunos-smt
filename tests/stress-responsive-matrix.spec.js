const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/order';
const sizes=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800]];
const routes=['order','checkout','orders','dine','soldout','more'];

async function currentFrame(page,route){
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  const re=new RegExp(`pages\\/${route}\\/index\\.html`);
  await expect.poll(()=>page.frames().some(frame=>re.test(frame.url())),{
    timeout:15000,
    intervals:[100,200,400]
  }).toBe(true);
  const frame=page.frames().find(candidate=>re.test(candidate.url()));
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

    // Product/modal churn: cache the product count once so the stress loop tests
    // runtime interaction rather than repeatedly paying a full locator scan.
    const cards=frame.locator('.product-card:not([disabled])');
    const cardCount=await cards.count();
    expect(cardCount).toBeGreaterThan(0);
    for(let i=0;i<12;i++){
      await cards.nth(i%cardCount).click({force:true,timeout:5000});
      const close=frame.locator('[data-action="modal-close"],[data-action="close"],.modal-card header button,.confirm-card button').first();
      if(await close.isVisible().catch(()=>false))await close.click({force:true,timeout:3000}).catch(()=>{});
    }

    // Cart mutation churn.
    const qtyButtons=frame.locator('[data-action="cart-qty"]');
    const qtyCount=await qtyButtons.count();
    for(let i=0;i<12&&qtyCount;i++)await qtyButtons.nth(i%qtyCount).click({force:true,timeout:3000}).catch(()=>{});

    // Route hammer: cover every route twice.
    for(let i=0;i<12;i++){
      const route=routes[i%routes.length];
      await page.evaluate(next=>{location.hash='#/'+next;},route);
      await currentFrame(page,route);
    }

    // Resize/reload churn simulates Android window changes and WebView recreation.
    const alternate=width===1280?{width:1366,height:768}:{width:1280,height:800};
    for(let i=0;i<2;i++){
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
