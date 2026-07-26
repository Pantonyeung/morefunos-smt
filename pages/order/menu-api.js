import {resolveTemporaryComboRule,resolveDrinkUpgradeRule} from './combo-rules.js';

export const MENU_CACHE_KEY='morefun.smt.menu.cache.v5';
export const FIREBASE_DATABASE_URL='https://morefunposos-default-rtdb.asia-southeast1.firebasedatabase.app';
export const FIREBASE_CATALOG_PATH='public/catalogV1';
export const FIREBASE_CATALOG_URL=`${FIREBASE_DATABASE_URL}/${FIREBASE_CATALOG_PATH}.json`;

const array=value=>Array.isArray(value)?value:[];
const records=value=>Array.isArray(value)?value:value&&typeof value==='object'?Object.entries(value).map(([id,item])=>item&&typeof item==='object'?{_recordKey:id,...item}:item):[];
const truthy=(value,fallback=true)=>value===undefined||value===null||value===''?fallback:!['false','0','no','off'].includes(String(value).toLowerCase());
const moneyNumber=value=>Number(String(value??0).replace(/[^0-9.-]/g,''))||0;
const key=value=>String(value??'').trim().toLowerCase().replace(/\s+/g,'');
const list=value=>Array.isArray(value)?value:String(value??'').split(/[|,，;；]/).map(item=>item.trim()).filter(Boolean);

function unwrap(payload){
  let value=payload;
  for(let index=0;index<4;index++){
    if(!value||typeof value!=='object')break;
    if(value.categories||value.products||value.menu)break;
    value=value.data??value.result??value.payload??value.response??value;
  }
  return value?.menu&&typeof value.menu==='object'?{...value,...value.menu}:value||{};
}

export function normalizeMenuPayload(payload){
  const value=unwrap(payload);
  return {
    categories:records(value.categories||value.category_list||value.menu_categories),
    products:records(value.products||value.items||value.menu_items),
    availability:records(value.product_availability||value.availability||value.availability_status),
    productRules:records(value.product_rules||value.productRules||value.rules),
    raw:value
  };
}

function matchFallback(raw,fallback){
  const id=key(raw.product_id??raw.id??raw._recordKey),code=key(raw.product_code??raw.code??raw.sku),name=key(raw.product_name??raw.name);
  return fallback.products.find(item=>key(item.id)===id||(code&&key(item.code)===code)||(name&&key(item.name)===name));
}

function matchDrink(raw,base,fallback){
  const code=key(raw.product_code??raw.code??raw.sku??base?.code),name=key(raw.product_name??raw.name??base?.name);
  return fallback.drinks.find(item=>(code&&key(item.code)===code)||key(item.name)===name||key(item.id)===key(raw.product_id??raw.id??raw._recordKey));
}

function buildRuleIndex(rules){
  const index=new Map();
  records(rules).forEach(rule=>{
    const ids=[rule.product_id,rule.id,rule.product_code,rule.code,rule.sku,rule._recordKey].filter(Boolean).map(key);
    ids.forEach(id=>index.set(id,{...(index.get(id)||{}),...rule}));
  });
  return index;
}

function resolveRule(raw,index){
  const candidates=[raw.product_id,raw.id,raw.product_code,raw.code,raw.sku,raw._recordKey].filter(Boolean).map(key);
  for(const candidate of candidates){if(index.has(candidate))return index.get(candidate);}
  return {};
}

function resolveCategoryIds(raw){
  const source=[raw.category_ids,raw.categories,raw.category_id,raw.category].flatMap(value=>{
    if(Array.isArray(value))return value.map(item=>typeof item==='object'?(item.category_id??item.id??item.name??item.category_name):item);
    if(value&&typeof value==='object')return Object.entries(value).map(([id,item])=>typeof item==='object'?(item.category_id??item.id??id):truthy(item,false)?id:'').filter(Boolean);
    return list(value);
  });
  return [...new Set(source.map(String).filter(Boolean))];
}

function inferRules({categoryNames,name,matched={},raw={},rule={}}){
  const categoryText=categoryNames.join('|');
  const explicitRequired=array(rule.required_groups||rule.required_options||raw.required_groups||raw.required_options);
  const required=explicitRequired.length?[...explicitRequired]:array(matched.required);
  const add=group=>{if(!required.includes(group))required.push(group);};
  const drinkMeal=['便當','紫米沙律','沙律','麵餐','拌麵','薯角餐','薯蓉餐'].some(label=>categoryText.includes(label));
  if(drinkMeal)add('drink');
  if(categoryText.includes('沙律'))add('sauce');

  const productType=String(rule.product_type??rule.item_type??raw.product_type??raw.item_type??'').toLowerCase();
  const comboRole=String(rule.link_role??rule.combo_role??raw.link_role??raw.combo_role??matched.linkRole??'').toLowerCase();
  const isDrink=categoryText.includes('飲品')||productType.includes('drink')||comboRole==='drink';
  const temporary=resolveTemporaryComboRule({name,category:categoryNames[0],categories:categoryNames});

  return {
    required,
    drinkSlots:required.includes('drink')?Math.max(1,moneyNumber(rule.drink_slots??raw.drink_slots??matched.drinkSlots)):moneyNumber(rule.drink_slots??raw.drink_slots??matched.drinkSlots),
    combinable:temporary?.role==='riceball_main',
    comboEligible:Boolean(temporary?.comboEligible),
    linkRole:isDrink?'drink':temporary?.role==='combo_snack'?'snack':'',
    comboRole:temporary?.role||'',
    comboTier:temporary?.comboTier||'',
    comboBasePrice:Number(temporary?.comboBasePrice||0),
    comboSurcharge:Number(temporary?.comboSurcharge||0),
    ruleSource:temporary?'smt_menu_test':Object.keys(rule).length?'product_rules':'product'
  };
}

export function mapMenuToOrderCatalog(menu,fallback){
  const categoryNamesById=new Map(array(menu.categories).map((item,index)=>[
    String(item.category_id??item.id??item._recordKey??index),
    String(item.category_name??item.name??item.title??'其他').trim()||'其他'
  ]));
  const ruleIndex=buildRuleIndex(menu.productRules);
  const availability=new Map(array(menu.availability).map(item=>[String(item.product_id??item.id??item._recordKey),item]));
  const visibleCategories=array(menu.categories).filter(item=>truthy(item.is_visible??item.visible,true)).sort((a,b)=>moneyNumber(a.sort_order)-moneyNumber(b.sort_order));
  const rawProducts=array(menu.products).filter(item=>truthy(item.is_visible??item.visible,true)).sort((a,b)=>moneyNumber(a.sort_order)-moneyNumber(b.sort_order));

  const products=rawProducts.map((raw,index)=>{
    const matched=matchFallback(raw,fallback)||{};
    const rule=resolveRule(raw,ruleIndex);
    const id=String(raw.product_id??raw.id??raw._recordKey??raw.sku??raw.product_code??('product-'+index));
    const code=String(raw.product_code??raw.code??raw.sku??matched.code??'');
    const name=String(raw.product_name??raw.name??raw.title??matched.name??'未命名產品');
    const categoryIds=resolveCategoryIds(raw);
    const categoryNames=categoryIds.map(categoryId=>categoryNamesById.get(categoryId)||categoryId).filter(Boolean);
    const fallbackCategory=String(raw.category_name??matched.category??'其他');
    const category=categoryNames[0]||fallbackCategory;
    if(!categoryNames.length)categoryNames.push(category);
    const status=availability.get(id)||{};
    const soldOut=truthy(status.is_sold_out,false)||String(status.availability_status??'').toLowerCase()==='sold_out';
    const available=truthy(raw.is_available,true)&&truthy(status.is_available,true)&&!soldOut;
    const rules=inferRules({categoryNames,name,matched,raw,rule});
    return {
      ...matched,id,code,name,category,categories:categoryNames,
      description:String(raw.product_description??raw.description??raw.subtitle??matched.description??''),
      price:moneyNumber(raw.price??raw.base_price??raw.single_price??raw.display_price??raw.product_price??matched.price),
      image:String(raw.image_url??raw.product_image_url??raw.image??raw.photo_url??matched.image??''),
      required:rules.required,drinkSlots:rules.drinkSlots,
      combinable:rules.combinable,comboEligible:rules.comboEligible,
      linkRole:rules.linkRole,comboRole:rules.comboRole,comboTier:rules.comboTier,
      comboBasePrice:rules.comboBasePrice,comboSurcharge:rules.comboSurcharge,
      ruleSource:rules.ruleSource,available,soldOut,apiRaw:raw,apiRule:rule
    };
  });

  const drinks=products.filter(item=>item.linkRole==='drink'||item.categories.some(category=>category.includes('飲品'))).map(item=>{
    const raw=item.apiRaw||{},matched=matchDrink(raw,item,fallback)||{},temporary=resolveDrinkUpgradeRule(item)||{};
    return {id:item.id,code:item.code,name:item.name,price:item.price,image:item.image,sweet:truthy(raw.allow_sweetness,matched.sweet??true),ice:truthy(raw.allow_ice,matched.ice??true),available:item.available,specialDrinkSurcharge:Number(raw.special_drink_surcharge??matched.specialDrinkSurcharge??temporary.specialDrinkSurcharge??0)};
  });
  const categoryOrder=visibleCategories.map((item,index)=>categoryNamesById.get(String(item.category_id??item.id??item._recordKey??index))).filter(Boolean);
  products.forEach(item=>item.categories.forEach(category=>{if(!categoryOrder.includes(category))categoryOrder.push(category);}));
  return {categories:['全部',...categoryOrder.filter(name=>name!=='全部'&&name!=='搜尋')],products,drinks,loadedAt:Date.now()};
}

async function fetchMenu(url,fetchImpl,timeoutMs){
  const controller=typeof AbortController==='function'?new AbortController():null;
  const timer=controller?setTimeout(()=>controller.abort(),timeoutMs):null;
  try{
    const response=await fetchImpl(url,{method:'GET',headers:{Accept:'application/json'},signal:controller?.signal});
    if(!response?.ok)throw new Error('MENU_HTTP_'+(response?.status||0));
    const payload=await response.json();
    const normalized=normalizeMenuPayload(payload);
    if(!normalized.products.length)throw new Error('MENU_EMPTY');
    return normalized;
  }finally{if(timer)clearTimeout(timer);}
}

export async function loadMenuCatalog({fetchImpl=globalThis.fetch?.bind(globalThis),storage=globalThis.localStorage,fallback,url=FIREBASE_CATALOG_URL,timeoutMs=8000}={}){
  let lastError=null;
  if(fetchImpl){
    try{
      const catalog=mapMenuToOrderCatalog(await fetchMenu(url,fetchImpl,timeoutMs),fallback);
      storage?.setItem?.(MENU_CACHE_KEY,JSON.stringify(catalog));
      return {...catalog,source:'firebase',apiUrl:url};
    }catch(error){lastError=error;}
  }
  try{
    const cached=JSON.parse(storage?.getItem?.(MENU_CACHE_KEY)||'null');
    if(cached?.products?.length)return {...cached,source:'cache',error:lastError?.message||''};
  }catch(_error){}
  return {...fallback,source:'fallback',error:lastError?.message||'MENU_UNAVAILABLE'};
}
