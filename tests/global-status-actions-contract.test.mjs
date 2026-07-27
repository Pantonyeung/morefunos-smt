import fs from 'node:fs';
import assert from 'node:assert/strict';

const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const core=fs.readFileSync(new URL('../shared/status-actions.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../app-shell.css',import.meta.url),'utf8');

assert.ok(index.includes('id="shell-page-actions"'),'global shell must expose a page action host');
assert.ok(index.includes('shared/status-actions.js'),'global shell must load status actions from shared core');
assert.ok(core.includes('actionsByFrame'),'shared core must keep explicit action descriptors by child frame');
assert.ok(core.includes("message.type!=='morefun:status-actions'"),'shared core must accept explicit status-action descriptor messages');
assert.ok(core.includes('data-shell-action-id'),'shell actions must preserve stable explicit action ids');
assert.ok(core.includes("type:'morefun:status-action-trigger'"),'shell must trigger child actions by explicit id');
assert.equal(core.includes('MutationObserver'),false,'status actions must not return to DOM observer synchronization');
assert.equal(core.includes('syncChildStatusActions'),false,'legacy child DOM scanner must remain removed');
assert.ok(css.includes('.shell-page-actions'),'global page action host must be styled');
console.log('GLOBAL_STATUS_ACTION_DESCRIPTOR_CORE_OK');
