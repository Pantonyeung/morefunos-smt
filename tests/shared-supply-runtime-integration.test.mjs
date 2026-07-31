import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';

const startup=await readFile(new URL('../shell-startup.js',import.meta.url),'utf8');
const profileBootstrap=await readFile(new URL('../mobile-profile-bootstrap.js',import.meta.url),'utf8');
const mobileCss=await readFile(new URL('../mobile-profile.css',import.meta.url),'utf8');
const soldoutIndex=await readFile(new URL('../pages/soldout/index.html',import.meta.url),'utf8');
const orderIndex=await readFile(new URL('../pages/order/index.html',import.meta.url),'utf8');
const soldoutResponsive=await readFile(new URL('../pages/soldout/responsive.css',import.meta.url),'utf8');
const pageBridge=await readFile(new URL('../shared/supply-page-bridge.js',import.meta.url),'utf8');
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
  assert.match(profileBootstrap,/profile/);
  assert.match(profileBootstrap,/mobile/);
  assert.match(profileBootstrap,/#\/soldout/);
  assert.doesNotMatch(profileBootstrap,/mobile-soldout/);
  assert.match(mobileCss,/data-app-profile="mobile"/);
  assert.match(soldoutResponsive,/data-app-profile="mobile"/);
});

test('order and soldout pages react to shared storage changes without a second state authority',()=>{
  assert.match(soldoutIndex,/supply-page-bridge\.js/);
  assert.match(orderIndex,/supply-page-bridge\.js/);
  assert.match(pageBridge,/SUPPLY_STORAGE_KEY/);
  assert.match(pageBridge,/addEventListener\('storage'/);
  assert.doesNotMatch(pageBridge,/MutationObserver/);
});

test('SMT Pages Functions provide same-origin Staff API proxies',async()=>{
  const proxy=await readFile(new URL('../functions/_shared/operations-proxy.js',import.meta.url),'utf8');
  const login=await readFile(new URL('../functions/v1/staff/login.js',import.meta.url),'utf8');
  const availability=await readFile(new URL('../functions/v1/staff/availability.js',import.meta.url),'utf8');
  assert.match(proxy,/morefunos-admin\.pages\.dev/);
  assert.match(proxy,/authorization/);
  assert.match(login,/onRequestPost/);
  assert.match(availability,/onRequestPatch/);
  assert.match(availability,/onRequestGet/);
});
