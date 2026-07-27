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
assert.ok(statusActions.includes('actionsByFrame'),'page-specific status actions must use explicit per-frame descriptor state');
assert.ok(statusActions.includes("message.type!=='morefun:status-actions'"),'shared status core must accept explicit descriptor messages');
assert.ok(statusActions.includes("type:'morefun:status-action-trigger'"),'shell must trigger registered child actions by stable explicit id');
assert.equal(statusActions.includes('MutationObserver'),false,'health seal forbids DOM observer synchronization for status actions');
assert.equal(statusActions.includes('syncChildStatusActions'),false,'legacy child DOM scanner must stay removed');
assert.ok(loader.includes("key==='checkout'"),'checkout transaction route must remain explicit');
assert.ok(loader.includes('checkoutExitArmed'),'checkout exit lock must remain protected');
assert.ok(startup.includes('opening'),'startup/opening flow must remain present');
console.log('SMT_HEALTH_SEAL_DESCRIPTOR_CONTRACT_OK');
