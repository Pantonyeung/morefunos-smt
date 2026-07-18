import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
  products,
  quickDrinks,
  getPendingState,
  createCartLine,
  getOrderedQuickDrinks,
  getRequiredOptionValues
} from '../pages/order/page-data.js';

const read=path=>readFile(new URL(path,import.meta.url),'utf8');
const product=id=>products.find(item=>item.id===id);

test('bento salad and potato meals include drink requirements',()=>{
  assert.deepEqual(product('b1').requiredGroups,['rice','drink']);
  assert.deepEqual(product('b2').requiredGroups,['rice','drink']);
  assert.deepEqual(product('salad1').requiredGroups,['sauce','drink']);
  assert.deepEqual(product('s2').requiredGroups,['drink']);
  for(const id of ['b1','b2','salad1','s2']) assert.equal(product(id).drinkSlotsPerUnit,1);
});

test('custom rice-ball meal requires snack while single rice balls remain combinable',()=>{
  const custom=product('custom-riceball-set');
  assert.ok(custom);
  assert.deepEqual(custom.requiredGroups,['snack','drink']);
  const single=createCartLine(product('f1'));
  const pending=getPendingState([single]);
  assert.equal(pending.requiredMissingCount,0);
  assert.equal(pending.combinable.length,1);
  assert.equal(pending.combinable[0].group,'single-riceball');
});

test('required drink selection exposes every configured quick drink',()=>{
  assert.deepEqual(getRequiredOptionValues('drink'),quickDrinks.map(item=>item.id));
  assert.ok(quickDrinks.length>5);
});

test('quick drink order is configurable and applied to all and custom modes',()=>{
  const order=['sparkling-water','iced-lemon-water','taiwan-milk-tea'];
  assert.deepEqual(getOrderedQuickDrinks(quickDrinks,order).slice(0,3).map(item=>item.id),order);
});

test('order runtime implements anchored quick drink popover and double clear confirmation',async()=>{
  const js=await read('../pages/order/page.js');
  const css=await read('../pages/order/page.css');
  assert.match(js,/quick-drink-anchor/);
  assert.match(js,/clear-confirm-first/);
  assert.match(js,/clear-confirm-second/);
  assert.match(js,/第一次確認/);
  assert.match(js,/第二次確認/);
  assert.match(css,/\.quick-drink-popover/);
  assert.match(css,/bottom:calc\(100% \+ 8px\)/);
});

test('pending and quick large cards use 25 percent width and restrained open states',async()=>{
  const shared=await read('../shared/page-base.css');
  const css=await read('../pages/order/page.css');
  const js=await read('../pages/order/page.js');
  assert.match(shared,/--large-card-width:25%/);
  assert.match(css,/\.edit-card[^}]*width:var\(--large-card-width\)/s);
  assert.match(css,/\.pending-card[^}]*width:var\(--large-card-width\)/s);
  assert.match(css,/\.quick-card[^}]*width:var\(--large-card-width\)/s);
  assert.match(js,/top-action card-toggle/);
  assert.match(js,/state\.card==='quick'/);
});

test('pending card labels More Fun App and has independent scroll groups',async()=>{
  const js=await read('../pages/order/page.js');
  const css=await read('../pages/order/page.css');
  assert.match(js,/磨飯App/);
  assert.match(js,/pending-group-toggle/);
  assert.match(js,/pending-card-expand-all/);
  assert.match(css,/\.pending-group-list[^}]*overflow-y:auto/s);
  assert.match(css,/\.pending-groups[^}]*display:flex/s);
});

test('custom quick drink mode renders doubled icons and both modes support reordered horizontal scrolling',async()=>{
  const js=await read('../pages/order/page.js');
  const css=await read('../pages/order/page.css');
  assert.match(js,/quickDrinkOrder/);
  assert.match(js,/quick-drink-icon/);
  assert.match(js,/drink-order-up/);
  assert.match(js,/drink-order-down/);
  assert.match(css,/\.quick-drink-icon[^}]*width:48px/s);
  assert.match(css,/\.quick-drink-scroll[^}]*overflow-x:auto/s);
});
