import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const store=await readFile(new URL('../shared/store.js',import.meta.url),'utf8');
const runtime=await readFile(new URL('../shared/supply-runtime.js',import.meta.url),'utf8');
const proxy=await readFile(new URL('../functions/v1/staff/availability.js',import.meta.url),'utf8');

assert.match(store,/MoreFunStartup\?\.supplyRuntime|MoreFunStartup\.supplyRuntime/,'Supply writes must resolve the shared shell runtime directly');
assert.match(store,/captureLocalSnapshot\(snapshot\)/,'Supply writes must enter the canonical pending queue');
assert.match(store,/flushPending/,'Supply writes must attempt the Staff API mutation immediately');
assert.match(runtime,/PATCH[^]*\/v1\/staff\/availability|\/v1\/staff\/availability[^]*method:'PATCH'/,'Shared runtime must PATCH the Staff availability API');
assert.match(proxy,/onRequestPatch/,'SMT Pages must expose the same-origin PATCH proxy');
assert.doesNotMatch(store,/location\.reload/,'Supply mutation must not rely on page reload');

console.log('SMT direct supply mutation contract checks passed.');
