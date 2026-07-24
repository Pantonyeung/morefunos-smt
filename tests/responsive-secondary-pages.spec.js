const {test,expect}=require('@playwright/test');

const sizes=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800]];
const routes=[
  {name:'orders',selector:'.orders-layout'},
  {name:'dine',selector:'.dine-workspace'},
  {name:'soldout',selector:'.soldout-grid'},
  {name:'more',selector:'.more-grid'}
];

async function routeFrame(page,route){
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  await page.waitForTimeout(300);
  const re=new RegExp(`pages/${route}/index\\.html`);
  const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
  if(!frame)throw new Error(`${route} iframe not loaded`);
  await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
  await expect(frame.locator('#app')).toBeVisible();
  return frame;
}

for(const {name,selector} of routes){
  for(const [width,height] of sizes){
    test(`${name} fits ${width}x${height}`,async({page})=>{
      await page.setViewportSize({width,height});
      await page.goto(`http://127.0.0.1:4173/#/${name}`,{waitUntil:'domcontentloaded'});
      const frame=await routeFrame(page,name);
      await expect(frame.locator(selector)).toBeVisible({timeout:15000});
      const metrics=await frame.evaluate((selector)=>{
        const root=document.documentElement;
        const node=document.querySelector(selector);
        const r=node?.getBoundingClientRect();
        return {
          clientWidth:root.clientWidth,
          scrollWidth:root.scrollWidth,
          clientHeight:root.clientHeight,
          rect:r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom}:null
        };
      },selector);
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth+1);
      expect(metrics.rect).toBeTruthy();
      expect(metrics.rect.left).toBeGreaterThanOrEqual(-1);
      expect(metrics.rect.right).toBeLessThanOrEqual(metrics.clientWidth+1);
      expect(metrics.rect.top).toBeGreaterThanOrEqual(-1);
      expect(metrics.rect.bottom).toBeLessThanOrEqual(metrics.clientHeight+1);
    });
  }
}
