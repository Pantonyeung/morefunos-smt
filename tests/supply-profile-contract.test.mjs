import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('SMT register and SMM mobile profiles share the same Supply Runtime',async()=>{
  const startup=await read('shell-startup.js');
  assert.match(startup,/APP_PROFILE=.*'mobile':'register'/);
  assert.match(startup,/SUPPLY_SOURCE=APP_PROFILE==='mobile'\?'smm':'smt'/);
  assert.match(startup,/createSupplyRuntime\(\{source:SUPPLY_SOURCE,deviceId:terminalId/);
  assert.match(startup,/supplyRuntime\.captureLocalSnapshot/);
  assert.match(startup,/morefun:critical-storage-written/);
});

test('SMM remains a mobile profile and opens the shared sold-out page',async()=>{
  const mobile=await read('mobile-profile-bootstrap.js');
  assert.match(mobile,/profile=.*'mobile':'register'/);
  assert.match(mobile,/磨飯 SMM｜售罄管理/);
  assert.match(mobile,/#\/soldout/);
});

test('same-origin Pages Functions proxy staff login and availability',async()=>{
  const login=await read('functions/v1/staff/login.js');
  const availability=await read('functions/v1/staff/availability.js');
  const proxy=await read('functions/_shared/operations-proxy.js');
  assert.match(login,/\/v1\/staff\/login/);
  assert.match(availability,/\/v1\/staff\/availability/);
  assert.match(availability,/onRequestPatch/);
  assert.match(proxy,/authorization/);
  assert.match(proxy,/x-morefun-proxy/);
});

test('supply status control delegates re-login to the startup authority',async()=>{
  const index=await read('index.html');
  const control=await read('shared/supply-session-control.js');
  assert.match(index,/id="shell-online"/);
  assert.match(index,/shared\/supply-session-control\.js/);
  assert.match(control,/startup\?\.showLogin/);
  assert.doesNotMatch(control,/gate\.hidden=false/);
});

test('staff login is remote-first and only falls back offline for known local credentials',async()=>{
  const startup=await read('shell-startup.js');
  const remoteIndex=startup.indexOf('await supplyRuntime.login');
  const offlineIndex=startup.indexOf('if(!localMatch)');
  assert.ok(remoteIndex>=0);
  assert.ok(offlineIndex>remoteIndex);
  assert.match(startup,/status===401\|\|status===403/);
  assert.match(startup,/STAFF_LOGIN_OFFLINE_FALLBACK/);
});
