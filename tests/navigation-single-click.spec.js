const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/';
const sources=['order','orders','dine','soldout'];

for(const source of sources){
  test(`${source} reaches more with one bottom-nav click`,async({page})=>{
    await page.goto(`${APP}#/${source}`,{waitUntil:'domcontentloaded'});
    const frame=page.frameLocator('#page');
    const more=frame.locator('[data-action="shell-navigate"][data-route="more"]');
    await expect(more).toBeVisible();
    await more.click();
    await expect(page).toHaveURL(/#\/more$/,{timeout:1500});
    await expect(page.locator('#page')).toHaveAttribute('src',/pages\/more\/index\.html/,{timeout:1500});
  });
}
