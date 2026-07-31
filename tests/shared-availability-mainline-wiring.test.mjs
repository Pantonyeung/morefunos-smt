import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';

const rootIndex=await readFile(new URL('../index.html',import.meta.url),'utf8');
const shellBridge=await readFile(new URL('../shared/supply-shell-bridge.js',import.meta.url),'utf8');
const runtime=await readFile(new URL('../shared/supply-runtime.js',import.meta.url),'utf8');
const soldoutIndex=await readFile(new URL('../pages/soldout/index.html',import.meta.url),'utf8');
const mobileIndex=await readFile(new URL('../pages/mobile-soldout/index.html',import.meta.url),'utf8');
const mobilePage=await readFile(new URL('../pages/mobile-soldout/page.js',import.meta.url),'utf8');
const smmEntry=await readFile(new URL('../smm/index.html',import.meta.url),'utf8');


test('latest SMT shell keeps supply synchronization alive across route iframes',()=>{
  assert.match(rootIndex,/shared\/supply-shell-bridge\.js/);
  assert.match(rootIndex,/page-next/);
  assert.match(shellBridge,/bootSupplyRuntimeBridge/);
  assert.match(shellBridge,/page-frame\.is-active/);
  assert.match(shellBridge,/morefun:supply-runtime-remote-change/);
});

test('existing Register soldout page boots the shared Staff runtime before its current page code',()=>{
  assert.match(soldoutIndex,/shared\/supply-runtime\.js/);
  assert.match(soldoutIndex,/surface:'soldout'/);
  assert.match(soldoutIndex,/source:'smt'/);
  assert.ok(soldoutIndex.indexOf('bootSupplyRuntimeBridge')<soldoutIndex.indexOf("import('./page.js"));
});

test('SMM official mobile entry uses the same runtime and clean route',()=>{
  assert.match(smmEntry,/pages\/mobile-soldout/);
  assert.match(mobileIndex,/shared\/supply-runtime\.js/);
  assert.match(mobileIndex,/surface: 'soldout'/);
  assert.match(mobileIndex,/source: 'smm'/);
  assert.match(mobilePage,/PUBLIC_RUNTIME_URL='https:\/\/morefunos-admin\.pages\.dev\/v1\/runtime\/customer'/);
  assert.match(mobilePage,/SUPPLY_STORAGE_KEY/);
  assert.match(mobilePage,/今日售罄/);
  assert.match(mobilePage,/暫停供應/);
  assert.match(mobilePage,/恢復供應/);
  assert.match(mobilePage,/紫米全部售罄/);
});

test('shared runtime is local-first and synchronizes child and shell contexts',()=>{
  assert.match(runtime,/SUPPLY_PENDING_STORAGE_KEY/);
  assert.match(runtime,/captureLocalChange/);
  assert.match(runtime,/flushPending/);
  assert.match(runtime,/reloadFromStorage/);
  assert.match(runtime,/addEventListener\?\.\('storage'/);
  assert.match(runtime,/addEventListener\?\.\('online'/);
  assert.match(runtime,/\/v1\/staff\/login/);
  assert.match(runtime,/\/v1\/staff\/availability/);
  assert.match(runtime,/POLL_MS=15000/);
});
