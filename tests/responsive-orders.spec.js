const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/pages/orders/';
const sizes=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800]];

for(const [width,height] of sizes){
  test(`orders page fits ${width}x${height} and keeps shell visible`,async({page})=>{
    await page.setViewportSize({width,height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.locator('.orders-layout')).toBeVisible();
    await expect(page.locator('.bottom-nav')).toBeVisible();

    const metrics=await page.evaluate(()=>{
      const rect=node=>node.getBoundingClientRect();
      const layout=rect(document.querySelector('.orders-layout'));
      const nav=rect(document.querySelector('.bottom-nav'));
      const body=document.body;
      const buttons=[...document.querySelectorAll('.shell-nav-button')].map(button=>{
        const b=rect(button);
        const icon=rect(button.querySelector('.shell-nav-icon'));
        const label=rect(button.querySelector('span'));
        return {button:b,icon,label};
      });
      return {
        viewport:{width:innerWidth,height:innerHeight},
        scrollWidth:document.documentElement.scrollWidth,
        bodyWidth:rect(body).width,
        layout,
        nav,
        buttons
      };
    });

    expect(metrics.scrollWidth).toBeLessThanOrEqual(width);
    expect(Math.abs(metrics.bodyWidth-width)).toBeLessThanOrEqual(1);
    expect(metrics.layout.left).toBeGreaterThanOrEqual(0);
    expect(metrics.layout.right).toBeLessThanOrEqual(width+1);
    expect(metrics.nav.left).toBeGreaterThanOrEqual(0);
    expect(metrics.nav.right).toBeLessThanOrEqual(width+1);
    expect(metrics.nav.bottom).toBeLessThanOrEqual(height+1);
    for(const item of metrics.buttons){
      expect(item.icon.top).toBeGreaterThanOrEqual(metrics.nav.top-1);
      expect(item.label.bottom).toBeLessThanOrEqual(metrics.nav.bottom+1);
      expect(item.button.bottom).toBeLessThanOrEqual(metrics.nav.bottom+1);
    }
  });
}
