import test from 'node:test';
import assert from 'node:assert/strict';
import {createInitialState} from '../smt-state.js';
import {renderApp} from '../smt-views.js';
import {products, categories} from '../smt-data.js';

const render = state => renderApp(state ?? createInitialState(), {products, categories});

test('renders fixed Traditional Chinese navigation and replica shell', () => {
  const html = render();
  for (const label of ['點單','訂單','堂食','售罄','更多']) assert.match(html, new RegExp(`>${label}<`));
  assert.match(html, /磨飯 SMT/);
  assert.match(html, /本機已保存/);
  assert.match(html, /id="workspace"/);
});

test('order page replicas category rail, product grid and current order panel', () => {
  const html = render();
  assert.match(html, /全部分類/);
  assert.match(html, /點單主頁/);
  assert.match(html, /目前訂單/);
  assert.match(html, /快速飲品/);
  assert.match(html, /蜜糖雞絲＋鹽酥雞/);
  assert.match(html, /餐點圖片暫未提供/);
});

test('Required cart state keeps blocking copy and drawer flow', () => {
  const state = {...createInitialState(), cart:[{lineId:'l1',productId:'b1',code:'B1',name:'自選便當',qty:1,unitPrice:48,options:{},optionSignature:'[]',requiredGroups:['rice']}], overlay:{type:'product-rule',productId:'b1',lineId:'l1'}};
  const html = render(state);
  assert.match(html, /先整理 · 尚欠 1 項/);
  assert.match(html, /必選（Required）/);
  assert.match(html, /共享池（Pool）/);
  assert.match(html, /關聯加配（Link Up）/);
});

test('checkout replicas source, mode, payment and safe confirmation', () => {
  const initial=createInitialState();
  const state={...initial,cart:[{lineId:'l1',productId:'f4',code:'F4',name:'蜜糖雞絲＋鹽酥雞',qty:1,unitPrice:45,options:{},optionSignature:'[]',requiredGroups:[]}],checkout:{...initial.checkout,paymentMethod:'cash'},overlay:{type:'checkout'}};
  const html=render(state);
  for(const label of ['來源','訂單模式','付款方式','收款／核實','備註（可填可不填）','正式確認']) assert.match(html,new RegExp(label));
});

test('orders, dine, sold and more pages cover SMT-05 through SMT-16', () => {
  for (const [page, labels] of Object.entries({
    orders:['SMT-05 + SMT-06','30 分鐘','列印狀態'],
    dine:['SMT-07 + SMT-08','堂食枱面','分項付款'],
    sold:['SMT-09 + SMT-10','打印中心','恢復供應'],
    more:['SMT-11 至 SMT-16','營運摘要','日結／現金核對／支出','全局狀態中心','最終驗收 Gate']
  })) {
    const html=render({...createInitialState(),page});
    for(const label of labels) assert.ok(html.includes(label), `${page}: ${label}`);
  }
});

test('incoming batch modal keeps the two required actions', () => {
  const state={...createInitialState(),incomingOrders:[{id:'N1',status:'pending'}],incomingBatch:{visible:true,reminderRequired:false,orderIds:['N1']}};
  const html=render(state);
  assert.match(html,/查看及處理/);
  assert.match(html,/稍後處理/);
});

test('top new-order control remains actionable for the concept demo state', () => {
  const html = render();
  assert.match(html, /data-action="incoming-open" class="top-alert"/);
  assert.doesNotMatch(html, /class="top-alert" disabled/);
});
