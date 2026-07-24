const {test,expect}=require('@playwright/test');

const presets={
  '1920x1080':[1920,1080],
  '1600x900':[1600,900],
  '1440x900':[1440,900],
  '1366x768':[1366,768],
  '1280x800':[1280,800]
};

test('development preview exposes all target sizes and gives SMT the requested viewport',async({page})=>{
  await page.setViewportSize({width:844,height:390});
  await page.goto('http://127.0.0.1:4173/dev-preview.html?size=1920x1080',{waitUntil:'domcontentloaded'});
  await expect(page.getByText('尺寸驗收',{exact:true}).first()).toBeVisible();

  for(const [name,[width,height]] of Object.entries(presets)){
    await page.locator(`[data-size="${name}"]`).click();
    const preview=page.locator('#preview');
    await expect(preview).toHaveCSS('width',`${width}px`);
    await expect(preview).toHaveCSS('height',`${height}px`);
    const inner=page.frames().find(frame=>frame.url().includes('embedded-preview=1'));
    expect(inner).toBeTruthy();
    await inner.waitForLoadState('domcontentloaded');
    const measured=await inner.evaluate(()=>({width:innerWidth,height:innerHeight}));
    expect(measured.width).toBe(width);
    expect(measured.height).toBe(height);
  }
});

test('normal SMT entry shows launcher but embedded preview hides it',async({page})=>{
  await page.goto('http://127.0.0.1:4173/index.html#/order',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#dev-preview-entry')).toBeVisible();
  await page.goto('http://127.0.0.1:4173/index.html?embedded-preview=1#/order',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#dev-preview-entry')).toBeHidden();
});
