import fs from 'node:fs';
import assert from 'node:assert/strict';

const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const core=fs.readFileSync(new URL('../shared/status-actions.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../app-shell.css',import.meta.url),'utf8');

assert.ok(index.includes('id="shell-page-actions"'),'global shell must expose a page action host');
assert.ok(index.includes('shared/status-actions.js'),'global shell must load status actions from shared core');
assert.ok(core.includes('syncChildStatusActions'),'shared core must sync child-page status actions');
assert.ok(core.includes('data-shell-proxy-index'),'shared core actions must preserve a stable child action index');
assert.ok(css.includes('.shell-page-actions'),'global page action host must be styled');
console.log('GLOBAL_STATUS_ACTION_CORE_OK');
