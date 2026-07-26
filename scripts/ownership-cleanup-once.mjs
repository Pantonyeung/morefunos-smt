import fs from 'node:fs';

const files={
  page:'pages/order/page.css',
  cart:'pages/order/cart.css',
  adaptive:'shared/adaptive-layout.css',
  index:'pages/order/index.html',
  audit:'scripts/audit-component-ownership.mjs',
  registry:'docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md'
};

const read=file=>fs.readFileSync(file,'utf8');
const write=(file,text)=>fs.writeFileSync(file,text.endsWith('\n')?text:text+'\n');

function stripComments(value){return value.replace(/\/\*[\s\S]*?\*\//g,' ').trim();}
function splitSelectors(header){return stripComments(header).split(',').map(s=>s.trim()).filter(Boolean);}
function findMatchingBrace(text,open){
  let depth=1,quote='',comment=false;
  for(let i=open+1;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(comment){if(c==='*'&&n==='/'){comment=false;i++;}continue;}
    if(quote){if(c==='\\'){i++;continue;}if(c===quote)quote='';continue;}
    if(c==='/'&&n==='*'){comment=true;i++;continue;}
    if(c==='"'||c==="'"){quote=c;continue;}
    if(c==='{')depth++;
    else if(c==='}'&&--depth===0)return i;
  }
  throw new Error('Unbalanced CSS brace near '+open);
}
function nextTopLevelOpen(text,from){
  let quote='',comment=false;
  for(let i=from;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(comment){if(c==='*'&&n==='/'){comment=false;i++;}continue;}
    if(quote){if(c==='\\'){i++;continue;}if(c===quote)quote='';continue;}
    if(c==='/'&&n==='*'){comment=true;i++;continue;}
    if(c==='"'||c==="'"){quote=c;continue;}
    if(c==='{')return i;
  }
  return -1;
}
function selectorHeaderStart(prefix){
  const semi=prefix.lastIndexOf(';');
  return semi+1;
}

const drinkSelector=selector=>{
  if(/\.drink-choice-(?:card|img|count)\b/.test(selector))return true;
  if(/\.drink-card--/.test(selector))return true;
  if(/(?:\.quick-drawer-panel|\.required-drink-grid)\s+\.image-fallback/.test(selector))return true;
  return false;
};
const cartSelector=selector=>{
  if(drinkSelector(selector))return false;
  return /(?:\.cart(?:\b|[- >.:#])|\.seq-service\b|\.line-service-toggle\b|\.recent-badge\b|\.pending-area\b|\.pending-receipt\b|\.quick-drawer\b|\.quick-drawer-panel\b|\.quick-drawer-handle\b|\.quick-scroll-hint\b|\.required-workflow\b|\.required-workflow-grid\b|\.required-target(?:\b|-)|\.required-choice-pane\b|\.required-option-grid\b|\.required-drink-grid\b|\.required-fill\b|\.required-assign-mode\b|\.required-active-target\b|\.quick-drink-context\b)/.test(selector);
};
function targetForSelector(selector){
  if(drinkSelector(selector))return 'page';
  if(cartSelector(selector))return 'cart';
  return null;
}

function routeCss(text,currentOwner){
  const moved={page:[],cart:[]};
  function walk(segment){
    let out='',cursor=0;
    while(true){
      const open=nextTopLevelOpen(segment,cursor);
      if(open<0){out+=segment.slice(cursor);break;}
      const close=findMatchingBrace(segment,open);
      const prefix=segment.slice(cursor,open);
      const hs=selectorHeaderStart(prefix);
      const before=prefix.slice(0,hs);
      const headerRaw=prefix.slice(hs);
      const header=stripComments(headerRaw);
      const body=segment.slice(open+1,close);
      out+=before;
      if(/^@(media|supports|container|layer)\b/i.test(header)){
        const inner=walk(body);
        out+=headerRaw+'{'+inner+'}';
      }else if(header.startsWith('@')){
        out+=headerRaw+'{'+body+'}';
      }else{
        const selectors=splitSelectors(headerRaw);
        const keep=[],routes={page:[],cart:[]};
        for(const selector of selectors){
          const target=targetForSelector(selector);
          if(target&&target!==currentOwner)routes[target].push(selector);
          else keep.push(selector);
        }
        if(keep.length)out+=keep.join(',')+'{'+body+'}';
        for(const [target,list] of Object.entries(routes)){
          if(list.length)moved[target].push(list.join(',')+'{'+body+'}');
        }
      }
      cursor=close+1;
    }
    return out;
  }
  return {text:walk(text),moved};
}

let page=read(files.page);
let cart=read(files.cart);
let adaptive=read(files.adaptive);

const pageResult=routeCss(page,'page');
page=pageResult.text;
const cartResult=routeCss(cart,'cart');
cart=cartResult.text;
const adaptiveResult=routeCss(adaptive,'adaptive');
adaptive=adaptiveResult.text;

const cartInbound=[...pageResult.moved.cart,...adaptiveResult.moved.cart];
const pageInbound=[...cartResult.moved.page,...adaptiveResult.moved.page];

if(!cartInbound.length)throw new Error('V1 migration found no Cart rules to consolidate.');
if(!pageInbound.length)throw new Error('V2 migration found no Drink Card rules to consolidate.');

cart += '\n\n/* OWNERSHIP V1 — Cart is the sole visual owner. Adaptive/Page may provide tokens/data only. */\n'+cartInbound.join('\n')+'\n';
page += '\n\n/* OWNERSHIP V2 — page.css is the sole Drink Choice Card visual owner. Context classes only scale the same component. */\n'+pageInbound.join('\n')+'\n';

// Cache keys: force Safari / Cloudflare clients to load the ownership-consolidated assets.
let index=read(files.index)
  .replace(/page\.css\?v=[^"']+/,'page.css?v=order-owner-v1')
  .replace(/adaptive-layout\.css\?v=[^"']+/,'adaptive-layout.css?v=adaptive-tokens-v4')
  .replace(/cart\.css\?v=[^"']+/,'cart.css?v=order-cart-owner-v14');

// Tighten ownership audit: V1/V2 are no longer allowed as known migrations.
let audit=read(files.audit);
audit=audit.replace(
  /\{\s*id:'V1_ORDER_CART_MULTI_OWNER',[\s\S]*?\},\s*\{\s*id:'V2_DRINK_CARD_MULTI_OWNER',[\s\S]*?\},/,
  ''
);
const insertion=`  {\n    id:'ORDER_CART_VISUAL_SINGLE_OWNER',\n    description:'Order Cart internal visual selectors must only exist in pages/order/cart.css',\n    owner:'pages/order/cart.css',\n    forbidden:[\n      ['pages/order/page.css','.cart-row'],\n      ['pages/order/page.css','.cart-img'],\n      ['pages/order/page.css','.pending-area'],\n      ['shared/adaptive-layout.css','body[data-page="order"] .cart'],\n      ['shared/adaptive-layout.css','.seq-service'],\n      ['shared/adaptive-layout.css','.pending-area'],\n      ['shared/adaptive-layout.css','.required-workflow']\n    ]\n  },\n  {\n    id:'DRINK_CARD_VISUAL_SINGLE_OWNER',\n    description:'Drink Choice Card visual must only exist in pages/order/page.css',\n    owner:'pages/order/page.css',\n    forbidden:[\n      ['pages/order/cart.css','.drink-choice-card'],\n      ['pages/order/cart.css','.drink-choice-img'],\n      ['pages/order/cart.css','.drink-choice-count'],\n      ['shared/adaptive-layout.css','.drink-choice-card'],\n      ['shared/responsive-pages.css','.drink-choice-card']\n    ]\n  },\n`;
audit=audit.replace('const checks=[\n','const checks=[\n'+insertion);

// Hard assertions before writing.
const forbiddenPage=['.cart-row','.cart-img','.pending-area','.pending-receipt','.seq-service'];
for(const needle of forbiddenPage)if(page.includes(needle))throw new Error('page.css still owns Cart selector '+needle);
const forbiddenAdaptive=['body[data-page="order"] .cart','.seq-service','.pending-area','.required-workflow'];
for(const needle of forbiddenAdaptive)if(adaptive.includes(needle))throw new Error('adaptive-layout.css still owns Cart selector '+needle);
const forbiddenCart=['.drink-choice-card','.drink-choice-img','.drink-choice-count'];
for(const needle of forbiddenCart)if(cart.includes(needle))throw new Error('cart.css still owns Drink selector '+needle);
if(!page.includes('.drink-choice-card'))throw new Error('page.css lost Drink Choice Card owner rules');
if(!cart.includes('.cart-row'))throw new Error('cart.css lost Cart owner rules');

write(files.page,page);
write(files.cart,cart);
write(files.adaptive,adaptive);
write(files.index,index);
write(files.audit,audit);

let registry=read(files.registry)
  .replace('### V1 — Order Cart Visual 多 Owner','### V1 — Order Cart Visual 多 Owner（CLEARED）')
  .replace('### V2 — Drink Card Visual Dual Owner','### V2 — Drink Card Visual Dual Owner（CLEARED）')
  .replace('狀態：**MIGRATION REQUIRED / HIGH PRIORITY**\n\n目標：`cart.css` 成為唯一 Visual Owner；`page.css` 移除 Cart 內部 Style；Adaptive 只提供 `--adaptive-cart-*` Token。','狀態：**CLEARED**\n\n結果：`cart.css` 為唯一 Visual Owner；`page.css` 不再持有 Cart 內部 Style；Adaptive 只提供 `--adaptive-cart-*` Token。')
  .replace('狀態：**MIGRATION REQUIRED / HIGH PRIORITY**\n\n目標：`page.css` 成為 Drink Card 唯一 Visual Owner；`cart.css` 只管理 Quick Drawer／Required Grid 容器。','狀態：**CLEARED**\n\n結果：`page.css` 為 Drink Card 唯一 Visual Owner；`cart.css` 只管理 Quick Drawer／Required Grid 容器。');
write(files.registry,registry);

console.log('Ownership cleanup V1/V2 complete');
console.log('Moved to cart.css:',cartInbound.length,'rules');
console.log('Moved to page.css:',pageInbound.length,'rules');
