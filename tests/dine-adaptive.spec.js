const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/pages/dine/index.html';
const sizes=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800]];

for(const [width,height] of sizes){
  test(`dine page fits ${width}x${height}`,async({page})=>{
    await page.setViewportSize({width,height});
    await page.goto(APP,{waitUntil:'domcontentloaded'});
    await page.waitForTimeout(250);

    const workspace=page.locator('.dine-workspace');
    const grid=page.locator('.table-grid');
    const detail=page.locator('.table-detail');
    await expect(workspace).toBeVisible();
    await expect(grid).toBeVisible();
    await expect(detail).toBeVisible();

    const metrics=await page.evaluate(()=>{
      const box=selector=>document.querySelector(selector)?.getBoundingClientRect();
      const root=document.documentElement;
      const workspace=box('.dine-workspace');
      const grid=box('.table-grid');
      const detail=box('.table-detail');
      const cards=[...document.querySelectorAll('.table-card')].map(node=>node.getBoundingClientRect());
      return {
        viewport:{w:root.clientWidth,h:root.clientHeight,scrollW:root.scrollWidth,scrollH:root.scrollHeight},
        workspace,grid,detail,cards
      };
    });

    expect(metrics.viewport.scrollW).toBeLessThanOrEqual(metrics.viewport.w);
    expect(metrics.workspace.left).toBeGreaterThanOrEqual(0);
    expect(metrics.workspace.right).toBeLessThanOrEqual(width+1);
    expect(metrics.workspace.bottom).toBeLessThanOrEqual(height+1);
    expect(metrics.grid.width).toBeGreaterThan(0);
    expect(metrics.grid.height).toBeGreaterThan(0);
    expect(metrics.detail.right).toBeLessThanOrEqual(width+1);
    expect(metrics.detail.bottom).toBeLessThanOrEqual(height+1);
    for(const card of metrics.cards){
      expect(card.left).toBeGreaterThanOrEqual(metrics.grid.left-1);
      expect(card.right).toBeLessThanOrEqual(metrics.grid.right+1);
      expect(card.top).toBeGreaterThanOrEqual(metrics.grid.top-1);
      expect(card.bottom).toBeLessThanOrEqual(metrics.grid.bottom+1);
    }
  });
}

test('dine page no longer owns legacy compact geometry',()=>{
  const fs=require('fs');
  const path=require('path');
  const root=path.resolve(__dirname,'..');
  const responsive=fs.readFileSync(path.join(root,'shared/responsive-pages.css'),'utf8');
  for(const token of [
    ':root[data-responsive-profile="compact"] body[data-page="dine"] .dine-workspace',
    ':root[data-responsive-profile="compact"] body[data-page="dine"] .table-card',
    ':root[data-responsive-profile="compact"] body[data-page="dine"] .table-detail'
  ]) expect(responsive).not.toContain(token);
  const adaptive=fs.readFileSync(path.join(root,'shared/adaptive-dine.css'),'utf8');
  expect(adaptive).toContain('container-name:dine-workspace');
  expect(adaptive).toContain('grid-template-columns:repeat(3,minmax(0,1fr))');
});
