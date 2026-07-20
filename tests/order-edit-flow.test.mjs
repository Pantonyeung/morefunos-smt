import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {updateCartLineQuantity} from '../pages/order/order-domain.js';

const page = await readFile(new URL('../pages/order/page.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../pages/order/page.css', import.meta.url), 'utf8');

test('quick mode uses a direct-add product action', () => {
  assert.match(page, /quick-add-product/);
  assert.match(page, /function quickAddProduct/);
});

test('cart rows expose separate quantity and edit controls', () => {
  assert.match(page, /data-action="cart-qty"/);
  assert.match(page, /data-action="edit-line"/);
  assert.match(page, /function changeCartQuantity/);
});

test('product editor is a compact anchored card with explicit confirmation', () => {
  assert.match(page, /product-settings-card/);
  assert.match(page, /修改產品/);
  assert.match(css, /width:min\(25vw/);
  assert.match(page, /data-action="apply-product"/);
});

test('modal backdrop is inert and cannot dismiss changes', () => {
  assert.match(page, /<div class="modal-scrim"/);
  assert.doesNotMatch(page, /class="modal-scrim" data-action=/);
});

test('cart quantity updates totals, trims drink assignments, and removes zero rows', () => {
  const line={lineId:'l1',productId:'set',qty:2,unitPrice:59,total:118,drinkSlots:2,drinkAssignments:[{id:1},{id:2}]};
  const increased=updateCartLineQuantity([line],'l1',1,{set:1});
  assert.equal(increased[0].qty,3);
  assert.equal(increased[0].total,177);
  assert.equal(increased[0].drinkSlots,3);
  const decreased=updateCartLineQuantity(increased,'l1',-2,{set:1});
  assert.equal(decreased[0].qty,1);
  assert.equal(decreased[0].drinkAssignments.length,1);
  assert.deepEqual(updateCartLineQuantity(decreased,'l1',-1,{set:1}),[]);
});

test('order shell keeps the bottom navigation inside the fixed canvas', () => {
  assert.match(css,/main\{[^}]*height:100%[^}]*display:flex[^}]*flex-direction:column/);
  assert.match(css,/\.workspace\{flex:1;min-height:0/);
  assert.doesNotMatch(css,/\.workspace\{height:calc\(100% - 78px\)/);
});

test('checkout call to action shows the payable total', () => {
  assert.ok(page.includes("結帳 '+money(cartTotal(state.cart))+'"));
  assert.doesNotMatch(page,/>先處理</);
});

test('quick order mode, drink strip, and quick assist are independent settings', () => {
  assert.match(page,/data-action="set-order-mode"/);
  assert.match(page,/data-action="toggle-quick-drink-strip"/);
  assert.match(page,/quickDrinks\.visible/);
  assert.match(page,/quickDrinks\.quickAssist/);
});

test('display settings include the three cart ratios', () => {
  assert.match(page,/購物籃比例/);
  assert.match(page,/\[25,30,32\]/);
  assert.match(page,/data-action="cart-width"/);
});

test('cards are positioned from the pressed control and expose a pointer side', () => {
  assert.match(page,/function anchorRect/);
  assert.match(page,/function positionActiveCard/);
  assert.match(css,/data-pointer-side/);
});

test('pending orders use a vertical split', () => {
  assert.match(css,/\.pending-split\{display:flex;flex-direction:column/);
});

test('every expanded card is owned by the single modal controller', () => {
  assert.doesNotMatch(page,/pendingExpanded/);
  assert.match(page,/modal=\{type:'pending'/);
  assert.match(page,/if\(modal\.type==='pending'\)return pendingPanel\(\)/);
});

test('pending order card is actionable and grouped by channel', () => {
  assert.match(page,/磨飯 App／網頁訂單/);
  assert.match(page,/電話／WhatsApp 排隊單/);
  assert.match(page,/data-action="process-pending-order"/);
  assert.match(page,/件 · /);
});

test('anchored cards support all four pointer directions and stay between fixed bars', () => {
  assert.match(page,/topbarRect/);
  assert.match(page,/bottomNavRect/);
  for (const side of ['top','bottom','left','right']) assert.match(css,new RegExp('data-pointer-side="'+side+'"'));
});

test('cart image visibility is configurable', () => {
  assert.match(page,/顯示購物車產品圖片/);
  assert.match(page,/toggle-cart-images/);
  assert.match(page,/showImages/);
});

test('shell uses a fixed T2S canvas fitted inside both viewport dimensions', async () => {
  const loader=await readFile(new URL('../app-loader.js',import.meta.url),'utf8');
  assert.match(loader,/CANVAS_HEIGHT=1080/);
  assert.match(loader,/Math\.min\(size\.width\/CANVAS_WIDTH,size\.height\/CANVAS_HEIGHT\)/);
  assert.doesNotMatch(loader,/logicalHeight/);
});
