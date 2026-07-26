import assert from 'node:assert/strict';
import {ORDER_STORAGE_KEY} from '../shared/store.js';
import {
  CART_VIEW_INPUT,CART_VIEW_ORGANIZED,SERVICE_TAKEAWAY,SERVICE_DINE_IN,
  resolveInitialOrderServiceMode,applyOrderServiceMode,toggleLineServiceMode,cartForView
} from '../pages/order/order-domain.js';

const storage=new Map();
globalThis.localStorage={
  getItem:key=>storage.has(key)?storage.get(key):null,
  setItem:(key,value)=>storage.set(key,String(value)),
  removeItem:key=>storage.delete(key)
};

const base=[
  {lineId:'1',name:'雞翼',category:'小食',qty:1,createdOrder:1,serviceMode:SERVICE_TAKEAWAY,serviceModeOverride:''},
  {lineId:'2',name:'F4',category:'飯團',qty:1,createdOrder:2,serviceMode:SERVICE_TAKEAWAY,serviceModeOverride:''},
  {lineId:'3',name:'便當',category:'便當',qty:1,createdOrder:3,serviceMode:SERVICE_TAKEAWAY,serviceModeOverride:''},
];

storage.clear();
assert.equal(resolveInitialOrderServiceMode(null,null),SERVICE_TAKEAWAY,'normal entry defaults to takeaway');
assert.equal(resolveInitialOrderServiceMode({tableId:'1'},SERVICE_TAKEAWAY),SERVICE_DINE_IN,'dine entry forces dine-in');

localStorage.setItem(ORDER_STORAGE_KEY,JSON.stringify({cart:[],orderServiceMode:SERVICE_DINE_IN}));
assert.equal(resolveInitialOrderServiceMode(null,SERVICE_DINE_IN),SERVICE_TAKEAWAY,'empty ordinary session must reset to takeaway after restart');
localStorage.setItem(ORDER_STORAGE_KEY,JSON.stringify({cart:[base[0]],orderServiceMode:SERVICE_DINE_IN}));
assert.equal(resolveInitialOrderServiceMode(null,SERVICE_DINE_IN),SERVICE_DINE_IN,'unfinished cart may restore its active service mode');

const dine=applyOrderServiceMode(base,SERVICE_DINE_IN);
assert.ok(dine.every(line=>line.serviceMode===SERVICE_DINE_IN&&!line.serviceModeOverride),'global switch updates every line and clears exceptions');

const mixed=toggleLineServiceMode(dine,'2',SERVICE_DINE_IN);
assert.equal(mixed.find(line=>line.lineId==='2').serviceMode,SERVICE_TAKEAWAY,'single line can reverse the order default');
assert.equal(mixed.find(line=>line.lineId==='2').serviceModeOverride,SERVICE_TAKEAWAY,'single-line reverse is explicit');

assert.deepEqual(cartForView(base,CART_VIEW_INPUT).map(line=>line.lineId),['1','2','3'],'input view preserves recorded order');
assert.deepEqual(cartForView(base,CART_VIEW_ORGANIZED).map(line=>line.lineId),['2','3','1'],'organized view changes presentation only');
assert.deepEqual(base.map(line=>line.lineId),['1','2','3'],'organized view must not mutate source cart order');

console.log('SMT_ORDER_CART_DOMAIN_OK');
