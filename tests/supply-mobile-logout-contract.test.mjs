import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const mobile=fs.readFileSync(new URL('../smm/mobile-app.js',import.meta.url),'utf8');
const startup=fs.readFileSync(new URL('../shell-startup.js',import.meta.url),'utf8');

test('SMM workbench routes are native interactive actions',()=>{
  for(const route of ['menu','orders','soldout','dine'])assert.match(mobile,new RegExp(`data-view=\\"${route}\\"`));
  assert.match(mobile,/function setView\(view\)/);
  assert.match(mobile,/event\.target\.closest\('\[data-view\]'\)/);
});

test('SMM availability mutation enters shared supply runtime',()=>{
  assert.match(mobile,/supplyRuntime\?\.captureLocalSnapshot\?\.\(next\)/);
  assert.match(mobile,/writeJSON\(SUPPLY_STORAGE_KEY,next\)/);
});

test('Register and Mobile expose core-owned logout without clearing business state',()=>{
  assert.match(startup,/function logout\(/);
  assert.match(startup,/supplyRuntime\.logout\(\)/);
  assert.match(startup,/clearShellSession\(\)/);
  assert.doesNotMatch(startup,/function logout[^]*removeItem\(ORDER_STORAGE_KEY\)/);
  assert.match(mobile,/data-logout/);
  assert.match(mobile,/MoreFunStartup\?\.showLogin/);
});
