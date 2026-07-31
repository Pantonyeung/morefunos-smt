import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const bootstrap=await readFile(new URL('../mobile-profile-bootstrap.js',import.meta.url),'utf8');
const redirects=await readFile(new URL('../_redirects',import.meta.url),'utf8');

assert.match(redirects,/^\/smm\s+\/index\.html\s+200/m,'Cloudflare Pages must serve the shared app shell at /smm');
assert.match(bootstrap,/location\.pathname.*\/smm/,'Mobile profile bootstrap must recognise /smm');
assert.match(bootstrap,/profile=mobile/,'The /smm entry must activate the SMM Mobile Profile');
assert.match(bootstrap,/history\.replaceState/,'The SMM entry must preserve a memorable /smm URL without a reload');
assert.match(bootstrap,/SMM-01/,'The SMM entry must expose the default mobile terminal identity');

console.log('SMM path entry contract checks passed.');
