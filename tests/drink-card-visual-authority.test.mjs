import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read=(file)=>fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const drinkCss=read('pages/order/drink-card.css');
const orderHtml=read('pages/order/index.html');

test('drink-card.css owns selected state and external pointer',()=>{
  assert.match(drinkCss,/\.drink-choice-card\.selected\{/);
  assert.match(drinkCss,/\.drink-choice-card\.selected::before\{/);
  assert.match(drinkCss,/border-bottom-color:var\(--orange\)/);
  assert.match(drinkCss,/\.drink-choice-card\{[^}]*overflow:visible/);
});

test('drink-card.css owns the shared image-first card geometry',()=>{
  assert.match(drinkCss,/\.drink-choice-card\.is-image\{[^}]*grid-template-rows:10% 90%/);
  assert.match(drinkCss,/\.drink-choice-card\.is-image>\.drink-choice-img>img\{[^}]*width:70%[^}]*height:70%[^}]*object-fit:contain/);
  assert.match(drinkCss,/\.drink-choice-card>span:not\(\.drink-choice-img\)\{[^}]*font-weight:950/);
});

test('order page loads the current Drink Card authority asset',()=>{
  assert.match(orderHtml,/drink-card\.css\?v=drink-card-owner-v2/);
});
