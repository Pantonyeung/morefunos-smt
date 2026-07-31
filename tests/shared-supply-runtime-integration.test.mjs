import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';

const startup=await readFile(new URL('../shell-startup.js',import.meta.url),'utf8');
const loader=await readFile(new URL('../app-loader.js',import.meta.url),'utf8');
const shellCss=await readFile(new URL('../app-shell.css',import.meta.url),'utf8');
const soldoutIndex=await readFile(new URL('../pages/soldout/index.html',import.meta.url),'utf8');
const orderIndex=await readFile(new URL('../pages/order/index.html',import.meta.url),'utf8');
const soldoutResponsive=await readFile(new URL('../pages/soldout/responsive.css',import.meta.url),'utf8');
const runtime=await readFile(new URL('../shared/supply-runtime.js',import.meta.url),'utf8');


test('Shell explicitly captures supply storage writes and owns remote sync',()=>{
  assert.match(startup,/SUPPLY_STORAGE_KEY/);
  assert.match(startup,/createSupplyRuntime/);
  assert.match(startup,/captureLocalSnapshot/);
  assert.match(startup,/morefun:critical-storage-written/);
  assert.doesNotMatch(runtime,/Storage\.prototype/);
  assert.doesNotMatch(runtime,/MutationObserver/);
});

test('SMT register and SMM mobile profile use the same soldout page and supply domain',()=>{
  assert.match(loader,/APP_PROFILE/);
  assert.match(loader,/mobile/);
  assert.match(loader,/soldout/);
  assert.doesNotMatch(loader,/mobile-soldout/);
  assert.match(shellCss,/data-app-profile="mobile"/);
  assert.match(soldoutResponsive,/data-app-profile="mobile"/);
});

test('order and soldout pages react to shared storage changes without a second state authority',()=>{
  assert.match(soldoutIndex,/SUPPLY_STORAGE_KEY/);
  assert.match(orderIndex,/SUPPLY_STORAGE_KEY/);
  assert.match(soldoutIndex,/addEventListener\('storage'/);
  assert.match(orderIndex,/addEventListener\('storage'/);
});

test('SMT Pages Functions provide same-origin Staff API proxies',async()=>{
  const login=await readFile(new URL('../functions/v1/staff/login.js',import.meta.url),'utf8');
  const availability=await readFile(new URL('../functions/v1/staff/availability.js',import.meta.url),'utf8');
  assert.match(login,/morefunos-admin\.pages\.dev/);
  assert.match(availability,/authorization/);
  assert.match(availability,/onRequestPatch/);
  assert.match(availability,/onRequestGet/);
});
