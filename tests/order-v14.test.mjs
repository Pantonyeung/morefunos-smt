import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
  normalizeCart,
  sortCartByMenuOrder,
  applyEditToQuantity
} from '../pages/order/page-v14.js';

const read=path=>readFile(new URL(path,import.meta.url),'utf8');

test('legacy cart lines are normalized before edit actions',()=>{
  const [line]=normalizeCart([{lineId:'x',productId:'b1',qty:2,unitPrice:48}]);
  assert.deepEqual(line.options,{});
  assert.deepEqual(line.drinkAssignments,[]);
  assert.deepEqual(line.requiredGroups,['rice','drink']);
  assert.equal(line.total,96);
});

test('cart is sorted by menu product order instead of click order',()=>{
  const cart=sortCartByMenuOrder([
    {lineId:'late',productId:'d1',qty:1,unitPrice:18},
    {lineId:'first',productId:'f4',qty:1,unitPrice:45},
    {lineId:'middle',productId:'b1',qty:1,unitPrice:48}
  ]);
  assert.deepEqual(cart.map(line=>line.productId),['f4','b1','d1']);
});

test('editing part of a multi-quantity line splits selected quantity safely',()=>{
  const cart=normalizeCart([{lineId:'b',productId:'b1',qty:3,unitPrice:48,options:{rice:'肉燥飯'},drinkSlots:3,drinkAssignments:[]}]);
  const next=applyEditToQuantity(cart,'b',2,{options:{rice:'菜飯'}});
  assert.equal(next.reduce((sum,line)=>sum+line.qty,0),3);
  assert.equal(next.filter(line=>line.options.rice==='菜飯').reduce((sum,line)=>sum+line.qty,0),2);
  assert.equal(next.filter(line=>line.options.rice==='肉燥飯').reduce((sum,line)=>sum+line.qty,0),1);
});

test('order runtime includes quantity modal, serial badges and product fallback text',async()=>{
  const js=await read('../pages/order/page-v14.js');
  const css=await read('../pages/order/page-v14.css');
  assert.match(js,/edit-quantity/);
  assert.match(js,/cart-seq/);
  assert.match(js,/product-image-fallback/);
  assert.match(js,/safeHandle/);
  assert.match(css,/\.cart-seq/);
  assert.match(css,/\.product \.meta/);
  assert.match(css,/grid-template-rows:166px minmax\(82px,auto\)/);
});

test('preview loader clears legacy cache without a reload loop',async()=>{
  const loader=await read('../app-loader.js');
  assert.match(loader,/BUILD_ID='v14-20260719'/);
  const resetBlock=loader.slice(loader.indexOf('export async function resetLegacyPreviewCaches'),loader.indexOf('function normalizedRoute'));
  assert.doesNotMatch(resetBlock,/location\.reload\(/);
});
