import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {acceptPendingOrder,completeExpiredOrders,createWhatsAppLink,updateCartLineQuantity} from '../pages/order/order-domain.js';

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
  assert.match(css, /width:\s*min\(25vw/);
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
  assert.match(css,/main\s*\{[^}]*height:\s*100%[^}]*display:\s*flex[^}]*flex-direction:\s*column/);
  assert.match(css,/\.workspace\s*\{[^}]*flex:\s*1[^}]*min-height:\s*0/);
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
  assert.match(css,/\.pending-split\s*\{[^}]*display:\s*flex[^}]*flex-direction:\s*column/);
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

test('quick drink opens as an image-led anchored drawer', () => {
  assert.match(page,/drink-drawer-hero/);
  assert.match(page,/imageBlock\(d\.image,d\.name,'drink-drawer-image'\)/);
});

test('shell uses a fixed T2S canvas fitted inside both viewport dimensions', async () => {
  const loader=await readFile(new URL('../app-loader.js',import.meta.url),'utf8');
  assert.match(loader,/logicalHeight/);
  assert.match(loader,/morefun-smt-ui-scale/);
  assert.match(loader,/morefun:set-ui-scale/);
});

test('root height chain and scroll regions keep both bars fixed', async () => {
  const base=await readFile(new URL('../shared/page-base.css',import.meta.url),'utf8');
  assert.match(base,/#app\{width:1920px;height:100%;min-height:0;overflow:hidden\}/);
  assert.match(css,/\.cart-list\{[^}]*min-height:0[^}]*overflow-y:auto/);
  assert.match(css,/\.products\{[^}]*min-height:0[^}]*overflow-y:auto/);
});

test('quick drinks are a collapsed upward drawer with reorder controls', () => {
  assert.match(page,/quickDrawerOpen/);
  assert.match(page,/toggle-quick-drawer/);
  assert.match(page,/quick-drawer-panel/);
  assert.match(page,/move-quick-drink/);
});

test('drink editor supports multiple configuration groups without forced images', () => {
  assert.match(page,/draft\.groups/);
  assert.match(page,/add-drink-group/);
  assert.match(page,/showImages!==false/);
});

test('completion exposes automatic, specified, and demo link-up flows', () => {
  assert.match(page,/一鍵自動組合/);
  assert.match(page,/指定配對/);
  assert.doesNotMatch(page,/載入組合測試/);
});

test('large product grid reserves complete rows and never overlaps cards', () => {
  assert.match(css,/\.products-large\s*\{[^}]*grid-auto-rows:\s*max-content/);
  assert.match(css,/\.product-card\.large\s*\{[^}]*min-height:/);
});

test('collapsed quick drinks use the approved centred pill above navigation', () => {
  assert.match(page,/快捷飲品<\/span><em>待補/);
  assert.match(css,/\.quick-drawer-handle\s*\{[^}]*left:\s*50%[^}]*transform:\s*translateX\(-50%\)/);
  assert.match(css,/\.quick-drawer-panel\s*\{[^}]*position:\s*absolute[^}]*bottom:\s*44px/);
});

test('operational surfaces include sold-out preview and new-order toast', () => {
  assert.match(page,/售罄列表/);
  assert.match(page,/soldout-preview/);
  assert.match(page,/new-order-toast/);
  assert.match(page,/稍後處理/);
  assert.match(page,/立即處理/);
});

test('accepting a verified pending order creates a running order with a 30 minute deadline', () => {
  const acceptedAt=Date.UTC(2026,6,20,12,0,0);
  const result=acceptPendingOrder({id:'T6631',source:'WhatsApp',contact:'陳小姐',phone:'85291234567',items:1,amount:59},acceptedAt);
  assert.equal(result.status,'running');
  assert.equal(result.acceptedAt,acceptedAt);
  assert.equal(result.autoCompleteAt,acceptedAt+30*60*1000);
});

test('running orders auto-complete after 30 minutes without intermediate states', () => {
  const acceptedAt=Date.UTC(2026,6,20,12,0,0);
  const orders=[{id:'A512',status:'running',acceptedAt,autoCompleteAt:acceptedAt+30*60*1000}];
  assert.equal(completeExpiredOrders(orders,acceptedAt+29*60*1000)[0].status,'running');
  assert.equal(completeExpiredOrders(orders,acceptedAt+30*60*1000)[0].status,'completed');
});

test('WhatsApp QR target opens the customer chat with the preset message', () => {
  const link=createWhatsAppLink('852 9123-4567','陳小姐，你的磨飯訂單 T6631 需要補充付款證明。');
  assert.equal(link,'https://wa.me/85291234567?text='+encodeURIComponent('陳小姐，你的磨飯訂單 T6631 需要補充付款證明。'));
});

test('pending verification uses start review then confirm order wording', () => {
  assert.match(page,/開始核對/);
  assert.match(page,/確認接單/);
  assert.doesNotMatch(page,/確認處理/);
  assert.match(page,/付款證明/);
  assert.match(page,/WhatsApp QR Code/);
});
