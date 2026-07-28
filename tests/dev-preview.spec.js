const {test,expect}=require('@playwright/test');

const presets={
  '1920x1080':[1920,1080],
  '1600x900':[1600,900],
  '1440x900':[1440,900],
  '1366x768':[1366,768],
  '1280x800':[1280,800]
};

async function waitForPreviewViewport(page,width,height){
  const preview=page.locator('#preview');
  await expect(preview).toHaveCSS('width',`${width}px`);
  await expect(preview).toHaveCSS('height',`${height}px`);

  await expect.poll(async()=>{
    const inner=page.frames().find(frame=>frame.url().includes('embedded-preview=1'));
    if(!inner)return null;
    try{
      return await inner.evaluate(()=>({width:innerWidth,height:innerHeight,ready:document.readyState}));
    }catch{
      return null;
    }
  },{
    timeout:15000,
    intervals:[100,200,400]
  }).toEqual({width,height,ready:'complete'});
}

test('development preview exposes all target sizes and gives SMT the requested viewport',async({page})=>{
  await page.setViewportSize({width:844,height:390});
  await page.goto('http://127.0.0.1:4173/dev-preview.html?size=1920x1080',{waitUntil:'domcontentloaded'});
  await expect(page.getByText('尺寸驗收',{exact:true}).first()).toBeVisible();

  const entries=Object.entries(presets);
  for(let index=0;index<entries.length;index+=1){
    const [name,[width,height]]=entries[index];
    const chooser=page.locator('#chooser');
    const sizeButton=page.locator(`[data-size="${name}"]`);
    await expect(chooser).toBeVisible();
    await expect(sizeButton).toBeVisible();
    await sizeButton.click();
    await waitForPreviewViewport(page,width,height);
    if(index<entries.length-1){
      const backSelect=page.locator('#backSelect');
      await expect(backSelect).toBeVisible();
      await backSelect.click();
      await expect(chooser).toBeVisible();
    }
  }
});

test('normal SMT entry shows launcher but embedded preview hides it',async({page})=>{
  await page.goto('http://127.0.0.1:4173/index.html#/order',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#dev-preview-entry')).toBeVisible();
  await page.goto('http://127.0.0.1:4173/index.html?embedded-preview=1#/order',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#dev-preview-entry')).toBeHidden();
});
