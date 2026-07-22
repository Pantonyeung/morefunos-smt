const app=document.getElementById('app');
const collapsedCategories=new Set();

function categoryName(section){
  return section.querySelector('.cart-category>header strong')?.textContent?.trim()||'';
}

function prepareCategory(section){
  const header=section.querySelector(':scope>header');
  if(!header)return;
  const name=categoryName(section);
  header.setAttribute('role','button');
  header.setAttribute('tabindex','0');
  header.setAttribute('aria-expanded',String(!collapsedCategories.has(name)));
  section.classList.toggle('collapsed',collapsedCategories.has(name));
}

function prepareAll(){
  app.querySelectorAll('.cart-category').forEach(prepareCategory);
}

function toggle(section){
  const name=categoryName(section);
  if(!name)return;
  if(collapsedCategories.has(name))collapsedCategories.delete(name);
  else collapsedCategories.add(name);
  prepareCategory(section);
}

app.addEventListener('click',event=>{
  const header=event.target.closest('.cart-category>header');
  if(!header)return;
  event.preventDefault();
  toggle(header.parentElement);
});

app.addEventListener('keydown',event=>{
  if(event.key!=='Enter'&&event.key!==' ')return;
  const header=event.target.closest('.cart-category>header');
  if(!header)return;
  event.preventDefault();
  toggle(header.parentElement);
});

new MutationObserver(prepareAll).observe(app,{childList:true,subtree:true});
prepareAll();
