import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const startup=await readFile(new URL('../shell-startup.js',import.meta.url),'utf8');
const runtime=await readFile(new URL('../shared/supply-runtime.js',import.meta.url),'utf8');

assert.match(html,/6位員工編號/,'Login must label the six-digit staff number');
assert.match(html,/pattern="\[0-9\]\{6\}"/,'Login inputs must enforce six numeric digits');
assert.match(html,/name="rememberLogin"[^>]*checked/,'Remember login must be enabled by default');
assert.doesNotMatch(html,/value="morefun"/,'Legacy default credentials must be removed');
assert.match(startup,/localStorage.*SESSION_KEY|SESSION_KEY.*localStorage/s,'Remembered shell session must use durable local storage');
assert.match(startup,/SIX_DIGITS/,'Startup must validate six-digit credentials');
assert.match(startup,/clearShellSession/,'Startup must clear remembered shell state after revocation');
assert.doesNotMatch(startup,/password.*localStorage|localStorage.*password/s,'Plaintext password must never be stored');
assert.match(runtime,/STAFF_SESSION_STORAGE_KEY/,'Runtime must persist the signed staff token');
assert.match(runtime,/sessionVersion|session-required|invalidateSession/,'Runtime must support server-side session revocation');

console.log('SMT remembered staff login contract checks passed.');
