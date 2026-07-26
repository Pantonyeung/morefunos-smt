import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const loader=fs.readFileSync(new URL('../app-loader.js',import.meta.url),'utf8');
const bridge=fs.readFileSync(new URL('../shared/page-bridge.js',import.meta.url),'utf8');

test('seed frame stays hidden until child ready',()=>{
  assert.match(index,/id="page" class="shell-page is-loading"/);
  assert.match(loader,/requestAnimationFrame\(\(\)=>setActiveFrame\(frame,key\)\)/);
});

test('unlock does not force reload the active order page',()=>{
  const unlock=loader.slice(loader.indexOf('unlock(){'),loader.indexOf('reload(){'));
  assert.doesNotMatch(unlock,/load\(\{force:true\}\)/);
});

test('page ready waits for stable frames',()=>{
  assert.match(bridge,/requestAnimationFrame\(\(\)=>requestAnimationFrame\(ready\)\)/);
});

test('order overlay state stays event driven',()=>{
  assert.match(loader,/morefun:overlay-state/);
  assert.match(loader,/frame\?\.dataset\?\.route==='order'/);
});

test('responsive profile writes are deduplicated per frame',()=>{
  assert.match(loader,/function profileSignature\(/);
  assert.match(loader,/frame\.dataset\.appliedProfile!==signature/);
});

test('inactive preloaded pages do not keep overlay observers running',()=>{
  assert.match(loader,/function stopChildOverlayObserver\(/);
  assert.match(loader,/frame!==activeFrame/);
  assert.match(loader,/stopChildOverlayObserver\(old\)/);
});
