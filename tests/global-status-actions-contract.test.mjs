import fs from 'node:fs';
import assert from 'node:assert/strict';

const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const proxy=fs.readFileSync(new URL('../status-actions-proxy.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../app-shell.css',import.meta.url),'utf8');

assert.ok(index.includes('id="shell-page-actions"'),'global shell must expose a page action host');
assert.ok(index.includes('status-actions-proxy.js'),'global shell must load the page action proxy');
assert.ok(proxy.includes('syncChildStatusActions'),'proxy module must sync child-page status actions');
assert.ok(proxy.includes('data-shell-proxy-index'),'proxy actions must preserve a stable child action index');
assert.ok(css.includes('.shell-page-actions'),'global page action host must be styled');
console.log('GLOBAL_STATUS_ACTION_PROXY_OK');
