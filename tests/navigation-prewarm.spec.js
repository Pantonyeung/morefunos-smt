const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/';

 test('shell prewarms route module graphs and styles after startup',async({page})=>{
  await page.goto(APP+'#/order',{waitUntil:'domcontentloaded'});
  await expect.poll(async()=>page.locator('link[data-morefun-prewarm="module"]').count(),{timeout:2500}).toBeGreaterThanOrEqual(5);
  await expect.poll(async()=>page.locator('link[data-morefun-prewarm="style"]').count(),{timeout:2500}).toBeGreaterThanOrEqual(5);
  const moduleHrefs=await page.locator('link[data-morefun-prewarm="module"]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
  expect(moduleHrefs.some(href=>href?.includes('pages/more/page.js'))).toBeTruthy();
  expect(moduleHrefs.some(href=>href?.includes('pages/orders/page.js'))).toBeTruthy();
});
