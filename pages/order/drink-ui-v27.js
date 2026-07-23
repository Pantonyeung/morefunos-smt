import {drinks} from './page-data.js';

const app=document.getElementById('app');
const drinkByName=new Map(drinks.map(item=>[String(item.name||'').trim(),item]));
let scheduled=false;

function imageMarkup(drink){
  const src=drink?.image||'';
  const name=drink?.name||'飲品';
  return '<span class="drink-choice-img"><img src="'+src+'" alt="'+name.replaceAll('"','&quot;')+'"></span>';
}

function patchDrinkButton(button,{context='combo'}={}){
  if(button.dataset.drinkUiPatched==='1')return;
  const nameNode=button.querySelector('span');
  const name=String(nameNode?.textContent||'').trim();
  const drink=drinkByName.get(name);
  if(!drink)return;

  button.dataset.drinkUiPatched='1';
  button.classList.add('drink-choice-card','is-image','drink-card--'+context);
  if(!button.querySelector('.drink-choice-img'))button.insertAdjacentHTML('beforeend',imageMarkup(drink));
}

function patch(){
  scheduled=false;

  document.querySelectorAll('.combo-role').forEach(section=>{
    const title=section.querySelector('header strong')?.textContent||'';
    if(!title.includes('飲品'))return;
    const candidates=section.querySelector('.combo-candidates');
    candidates?.classList.add('is-drink-candidates');
    candidates?.querySelectorAll('button').forEach(button=>patchDrinkButton(button,{context:'combo'}));
  });

  document.querySelectorAll('.drink-link-candidates button[data-source="quick"]').forEach(button=>patchDrinkButton(button,{context:'combo'}));
}

function schedulePatch(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(patch);
}

const observer=new MutationObserver(records=>{
  if(records.some(record=>record.addedNodes.length))schedulePatch();
});

observer.observe(app,{childList:true,subtree:true});
schedulePatch();
