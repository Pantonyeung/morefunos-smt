import fs from 'node:fs';
import assert from 'node:assert/strict';

const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const loader=fs.readFileSync(new URL('../app-loader.js',import.meta.url),'utf8');
const pageBase=fs.readFileSync(new URL('../shared/page-base.css',import.meta.url),'utf8');
const statusActions=fs.readFileSync(new URL('../shared/status-actions.js',import.meta.url),'utf8');
const startup=fs.readFileSync(new URL('../shell-startup.js',import.meta.url),'utf8');

assert.ok(index.includes('shared/status-actions.js'),'status actions must live in shared shell core');
assert.ok(!index.includes('status-actions-proxy.js'),'temporary root proxy must not return');
assert.ok(!fs.existsSync(new URL('../status-actions-proxy.js',import.meta.url)),'temporary proxy file must stay removed');
assert.ok(pageBase.includes(':root[data-global-shell="1"]'),'child shell mode must be owned by shared CSS');
assert.ok(!loader.includes('morefun-global-shell-mode'),'loader must not inject compatibility styles at runtime');
assert.ok(!loader.includes("createElement('style')"),'loader must not create runtime style patches');
assert.ok(statusActions.includes('syncChildStatusActions'),'page-specific status actions must remain functional through shared core');
assert.ok(loader.includes("key==='checkout'"),'checkout transaction route must remain explicit');
assert.ok(loader.includes('checkoutExitArmed'),'checkout exit lock must remain protected');
assert.ok(startup.includes('opening'),'startup/opening flow must remain present');
console.log('SMT_HEALTH_SEAL_CONTRACT_OK');
