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

test('page ready waits for stable frames and republishes explicit actions',()=>{
  assert.match(bridge,/requestAnimationFrame\(\(\)=>requestAnimationFrame\(\(\)=>\{ready\(\);publishStatusActions\(\);\}\)\)/);
});

test('overlay state stays explicit and event driven',()=>{
  assert.match(loader,/message\.type==='morefun:overlay-state'/);
  assert.match(loader,/setChildOverlayState\(frame,Boolean\(message\.open\)\)/);
  assert.doesNotMatch(loader,/MutationObserver/);
  assert.doesNotMatch(loader,/installChildOverlayObserver/);
  assert.doesNotMatch(loader,/stopChildOverlayObserver/);
});

test('responsive profile writes are deduplicated per frame',()=>{
  assert.match(loader,/function profileSignature\(/);
  assert.match(loader,/frame\.dataset\.appliedProfile!==signature/);
});

test('inactive pages cannot keep a second overlay truth source',()=>{
  assert.match(loader,/findSourceFrame\(event\.source\)/);
  assert.match(loader,/setChildOverlayState\(frame,false\)/);
  assert.doesNotMatch(loader,/_shellOverlayObserver/);
});
