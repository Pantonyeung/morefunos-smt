import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile(new URL('../smm/index.html',import.meta.url),'utf8');
const app=await readFile(new URL('../smm/mobile-app.js',import.meta.url),'utf8');
const css=await readFile(new URL('../smm/mobile-app.css',import.meta.url),'utf8');

test('SMM is a native mobile composition, not desktop iframe shell',()=>{
  assert.match(html,/id="smm-app"/);
  assert.match(html,/smm\/mobile-app\.js/);
  assert.doesNotMatch(html,/<iframe/i);
  assert.doesNotMatch(html,/app-loader\.js/);
});

test('SMM reuses SMT shared catalog, supply and order state',()=>{
  assert.match(app,/pages\/order\/menu-api\.js/);
  assert.match(app,/pages\/order\/order-domain\.js/);
  assert.match(app,/ORDER_STORAGE_KEY/);
  assert.match(app,/SUPPLY_STORAGE_KEY/);
  assert.doesNotMatch(app,/const products=\[/);
  assert.doesNotMatch(app,/demoPendingOrders|示範資料/);
});

test('SMM mobile UX uses bottom navigation and floating cart',()=>{
  assert.match(css,/\.smm-bottomnav/);
  assert.match(css,/\.smm-cartbar/);
  assert.match(css,/safe-area-inset-bottom/);
});
