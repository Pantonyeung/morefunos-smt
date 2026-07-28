const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/order';
const sizes=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800]];

async function globalNav(page){
  await expect(page.locator('#stage')).toBeVisible({timeout:15000});
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  const nav=page.locator('#global-bottom-nav');
  await expect(nav).toBeVisible({timeout:15000});
  return nav;
}

for(const [width,height] of sizes){
  test(`shell fits ${width}x${height} without horizontal overflow`,async({page})=>{
    await page.setViewportSize({width,height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    await expect(page.locator('#stage')).toBeVisible();
    await expect(page.locator('#page')).toBeVisible();
    const metrics=await page.evaluate(()=>({
      viewport:document.documentElement.clientWidth,
      scroll:document.documentElement.scrollWidth,
      stage:document.getElementById('stage').getBoundingClientRect(),
      frame:document.getElementById('page').getBoundingClientRect()
    }));
    expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport);
    expect(Math.round(metrics.stage.width)).toBe(width);
    expect(Math.round(metrics.frame.width)).toBe(width);
    expect(metrics.stage.left).toBeGreaterThanOrEqual(0);
    expect(metrics.frame.left).toBeGreaterThanOrEqual(0);
  });

  test(`bottom navigation content is not vertically clipped at ${width}x${height}`,async({page})=>{
    await page.setViewportSize({width,height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    const nav=await globalNav(page);
    const metric=await nav.evaluate(node=>{
      const navRect=node.getBoundingClientRect();
      const items=[...node.querySelectorAll('button')].map(button=>{
        const buttonRect=button.getBoundingClientRect();
        const iconRect=button.querySelector('span')?.getBoundingClientRect();
        const textRect=button.querySelector('b')?.getBoundingClientRect();
        return {buttonRect,iconRect,textRect};
      });
      return {navRect,viewportHeight:innerHeight,items};
    });
    expect(metric.navRect.top).toBeGreaterThanOrEqual(0);
    expect(metric.navRect.bottom).toBeLessThanOrEqual(metric.viewportHeight+.5);
    for(const item of metric.items){
      expect(item.buttonRect.top).toBeGreaterThanOrEqual(metric.navRect.top-.5);
      expect(item.buttonRect.bottom).toBeLessThanOrEqual(metric.navRect.bottom+.5);
      expect(item.iconRect.top).toBeGreaterThanOrEqual(metric.navRect.top-.5);
      expect(item.iconRect.bottom).toBeLessThanOrEqual(metric.navRect.bottom+.5);
      expect(item.textRect.top).toBeGreaterThanOrEqual(metric.navRect.top-.5);
      expect(item.textRect.bottom).toBeLessThanOrEqual(metric.navRect.bottom+.5);
    }
  });
}
