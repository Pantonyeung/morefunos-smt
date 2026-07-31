import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';

const loader=await readFile(new URL('../app-loader.js',import.meta.url),'utf8');
const mobileIndex=await readFile(new URL('../pages/mobile-soldout/index.html',import.meta.url),'utf8');
const mobilePage=await readFile(new URL('../pages/mobile-soldout/page.js',import.meta.url),'utf8');
const soldoutIndex=await readFile(new URL('../pages/soldout/index.html',import.meta.url),'utf8');
const orderIndex=await readFile(new URL('../pages/order/index.html',import.meta.url),'utf8');
const runtime=await readFile(new URL('../shared/supply-runtime.js',import.meta.url),'utf8');


test('SMM is a mobile profile inside the SMT authority application',()=>{
  assert.match(loader,/APP_PROFILE=.*mobile.*register/);
  assert.match(loader,/pages\/mobile-soldout\/index\.html/);
  assert.match(loader,/profile:APP_PROFILE/);
  assert.match(loader,/smm-mobile/);
});

test('SMT register and SMM mobile surfaces boot the same supply runtime',()=>{
  assert.match(soldoutIndex,/shared\/supply-runtime\.js/);
  assert.match(orderIndex,/shared\/supply-runtime\.js/);
  assert.match(mobileIndex,/shared\/supply-runtime\.js/);
  assert.match(mobileIndex,/source:\s*'smm'/);
  assert.match(mobileIndex,/surface:\s*'soldout'/);
});

test('mobile soldout controls use the shared local-first storage key',()=>{
  assert.match(mobilePage,/SUPPLY_STORAGE_KEY/);
  assert.match(mobilePage,/writeJSON\(SUPPLY_STORAGE_KEY,supply\)/);
  assert.match(mobilePage,/今日售罄/);
  assert.match(mobilePage,/暫停供應/);
  assert.match(mobilePage,/恢復供應/);
  assert.match(mobilePage,/紫米全部售罄/);
});

test('shared runtime supports staff login, queued writes, refresh and reconnect',()=>{
  assert.match(runtime,/\/v1\/staff\/login/);
  assert.match(runtime,/\/v1\/staff\/availability/);
  assert.match(runtime,/SUPPLY_PENDING_STORAGE_KEY/);
  assert.match(runtime,/captureLocalChange/);
  assert.match(runtime,/flushPending/);
  assert.match(runtime,/refresh/);
  assert.match(runtime,/addEventListener\?\.\('online'/);
  assert.match(runtime,/source=.*smm.*smt/s);
});
