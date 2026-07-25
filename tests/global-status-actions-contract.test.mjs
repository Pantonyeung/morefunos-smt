import fs from 'node:fs';
import assert from 'node:assert/strict';

const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const loader=fs.readFileSync(new URL('../app-loader.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../app-shell.css',import.meta.url),'utf8');

assert.ok(index.includes('id="shell-page-actions"'),'global shell must expose a page action host');
assert.ok(loader.includes('syncChildStatusActions'),'loader must proxy child-page status actions');
assert.ok(loader.includes('data-shell-proxy-index'),'proxy actions must preserve a stable child action index');
assert.ok(css.includes('.shell-page-actions'),'global page action host must be styled');
console.log('GLOBAL_STATUS_ACTION_PROXY_OK');
