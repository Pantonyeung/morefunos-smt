import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
const css=fs.readFileSync(new URL('../pages/order/pairing-modal.css',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../pages/order/index.html',import.meta.url),'utf8');

test('pairing-modal.css owns specified pairing task layout',()=>{
  for(const needle of ['.specified-link-card','.pairing-group-tabs','.pairing-body','.combo-editor-card','.combo-help','.combo-role','.combo-candidates','.combo-actions','.drink-link-candidates']) assert.match(css,new RegExp(needle.replaceAll('.','\\.')));
});

test('pairing modal keeps body scroll bounded and fixed task surfaces',()=>{
  assert.match(css,/\.specified-link-card>\.pairing-body/);
  assert.match(css,/overflow-y:auto/);
  assert.match(css,/\.specified-link-card>footer/);
  assert.match(css,/\.pairing-group-tabs\{/);
});

test('pairing candidate visuals are scoped to the modal owner',()=>{
  assert.match(css,/\.specified-link-card \.link-candidates/);
  assert.match(css,/\.combo-candidates button\.selected/);
});

test('order page loads current Pairing Modal authority asset',()=>{
  assert.match(html,/pairing-modal\.css\?v=pairing-modal-owner-v3/);
});
