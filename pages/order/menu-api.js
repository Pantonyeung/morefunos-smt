import {resolveTemporaryComboRule,resolveDrinkUpgradeRule} from './combo-rules.js';

export const MENU_CACHE_KEY='morefun.smt.menu.cache.v6';
export const CUSTOMER_RUNTIME_URL='/v1/runtime/customer';
export const FIREBASE_DATABASE_URL='https://morefunposos-default-rtdb.asia-southeast1.firebasedatabase.app';
export const FIREBASE_CATALOG_PATH='public/catalogV1';
export const FIREBASE_CATALOG_URL=CUSTOMER_RUNTIME_URL;

const array=value=>Array.isArray(value)?value:[];
const records=value=>Array.isArray(value)?value:value&&typeof value==='object'?Object.entries(value).map(([id,item])=>item&&typeof item==='object'?{_recordKey:id,...item}:{_recordKey:id,status:item}):[];
const truthy=(value,fallback=true)=>value===undefined||value===null||value===''?fallback:!['false','0','no','off','disabled','inactive','hidden'].includes(String(value).toLowerCase());
const moneyNumber=value=>Number(String(value??0).replace(/[^0-9.-]/g,''))||0;
const key=value=>String(value??'').trim().toLowerCase().replace(/\s+/g,'');
const list=value=>Array.isArray(value)?value:String(value??'').split(/[|,，;；]/).map(item=>item.trim()).filter(Boolean);
const first=(source,names,fallback='')=>{for(const name of names){const value=source?.[name];if(value!==undefined&&value!==null&&value!=='')return value;}return fallback;};

function unwrap(payload){
  let value=payload;
  for(let index=0;index<5;index++){
    if(!value||typeof value!=='object')break;
    if(value.categories||value.products||value.menu||value.catalog)break;
    value=value.data??value.result??value.payload??value.response??value.runtime??value;
  }
  const menu=value?.menu&&typeof value.menu==='object'?value.menu:value?.catalog&&typeof value.catalog==='object'?value.catalog:value||{};
  const runtime=value?.runtime&&typeof value.runtime==='object'?value.runtime:payload?.runtime&&typeof payload.runtime==='object'?payload.runtime:{};
  return {...value,...menu,runtime};
}

export function normalizeMenuPayload(payload){
  const value=unwrap(payload);
  const runtime=value.runtime||{};
  return {
    categories:records(value.categories||value.category_list||value.menu_categories),
    products:records(value.products||value.items||value.menu_items),
    availability:records(value.product_availability||value.availability||value.availability_status||runtime.availability||runtime.soldout),
    productRules:records(value.product_rules||value.productRules||value.rules),
    raw:value,
    meta:{
      version:String(payload?.version||value.version||value.runtimeVersion||''),
      checksum:String(payload?.checksum||value.checksum||''),
      availabilityUpdatedAt:payload?.availabilityUpdatedAt||runtime.updatedAt||runtime.availabilityUpdatedAt||null
    }
  };
}

function canonicalProductId(raw,index=0){return String(first(raw,['canonicalProductId','canonical_product_id','productId','product_id','id','_recordKey','sku','productCode','product_code'],`product-${index}`));}
function canonicalCategoryId(raw,index=0){return String(first(raw,['customerCategoryId','customer_category_id','categoryId','category_id','id','_recordKey'],`category-${index}`));}
function productName(raw){return String(first(raw,['customerName','customer_name','externalName','external_name','productName','product_name','name','title'],'未命名產品'));}
function productCode(raw){return String(first(raw,['customerCode','customer_code','productCode','product_code','code','sku'],'')).trim();}
function productPrice(raw){return moneyNumber(first(raw,['customerPrice','customer_price','displayPrice','display_price','price','base_price','single_price','product_price'],0));}
function productImage(raw){return String(first(raw,['customerImageUrl','customerImage','customer_image_url','storefrontImageUrl','imageUrl','image_url','product_image_url','image','photo_url'],'')).trim();}
function productDescription(raw){return String(first(raw,['customerDescription','customer_description','productDescription','product_description','description','subtitle'],'')).trim();}
function categoryName(raw){return String(first(raw,['customerName','customer_name','categoryName','category_name','name','title'],'其他')).trim()||'其他';}
function categorySort(raw){return moneyNumber(first(raw,['customerSort','customer_sort','sort','sortOrder','sort_order'],0));}
function productSort(raw){return moneyNumber(first(raw,['customerSort','customer_sort','sort','sortOrder','sort_order'],0));}
function productVisible(raw){
  const channels=raw?.channels||{};
  const customerChannel=channels.customer??raw.customerVisible??raw.customer_visible;
  return truthy(first(raw,['customerEnabled','customer_enabled','isVisible','is_visible','visible'],customerChannel),true)&&truthy(customerChannel,true);
}

function normalizeStatus(value){
  const status=String(value||'available').trim().toLowerCase().replace(/[-\s]+/g,'_');
  if(['soldout','sold_out','out_of_stock','unavailable'].includes(status))return 'soldout';
  if(['paused','pause','suspended','disabled'].includes(status))return 'paused';
  return 'available';
}

function availabilityIndex(rows){
  const output=new Map();
  for(const row of records(rows)){
    const productId=canonicalProductId(row);
    if(!productId)continue;
    output.set(productId,{...row,status:normalizeStatus(first(row,['status','availabilityStatus','availability_status'],row.is_sold_out?'soldout':'available'))});
  }
  return output;
}

function matchFallback(raw,fallback){
  const id=key(canonicalProductId(raw)),code=key(productCode(raw)),name=key(productName(raw));
  return array(fallback?.products).find(item=>key(item.id)===id||(code&&key(item.code)===code)||(name&&key(item.name)===name));
}

function matchDrink(raw,base,fallback){
  const code=key(productCode(raw)||base?.code),name=key(productName(raw)||base?.name);
  return array(fallback?.drinks).find(item=>(code&&key(item.code)===code)||key(item.name)===name||key(item.id)===key(canonicalProductId(raw)));
}

function buildRuleIndex(rules){
  const index=new Map();
  records(rules).forEach(rule=>{
    const ids=[rule.canonicalProductId,rule.canonical_product_id,rule.productId,rule.product_id,rule.id,rule.productCode,rule.product_code,rule.code,rule.sku,rule._recordKey].filter(Boolean).map(key);
    ids.forEach(id=>index.set(id,{...(index.get(id)||{}),...rule}));
  });
  return index;
}

function resolveRule(raw,index){
  const candidates=[canonicalProductId(raw),productCode(raw),raw.sku,raw._recordKey].filter(Boolean).map(key);
  for(const candidate of candidates){if(index.has(candidate))return index.get(candidate);}
  return {};
}

function resolveCategoryIds(raw){
  const direct=first(raw,['customerCategoryIds','customer_category_ids','categoryIds','category_ids'],null);
  const single=first(raw,['customerCategoryId','customer_category_id','categoryId','category_id','category'],null);
  const source=[direct,raw.categories,single].flatMap(value=>{
    if(Array.isArray(value))return value.map(item=>typeof item==='object'?first(item,['customerCategoryId','category_id','id','name','category_name'],''):item);
    if(value&&typeof value==='object')return Object.entries(value).map(([id,item])=>typeof item==='object'?first(item,['customerCategoryId','category_id','id'],id):truthy(item,false)?id:'').filter(Boolean);
    return list(value);
  });
  return [...new Set(source.map(String).filter(Boolean))];
}

function inferRules({categoryNames,name,matched={},raw={},rule={}}){
  const categoryText=categoryNames.join('|');
  const explicitRequired=array(rule.required_groups||rule.required_options||raw.required_groups||raw.required_options);
  const required=explicitRequired.length?[...explicitRequired]:array(matched.required);
  const add=group=>{if(!required.includes(group))required.push(group);};
  if(['便當','紫米沙律','沙律','麵餐','拌麵','薯角餐','薯蓉餐'].some(label=>categoryText.includes(label)))add('drink');
  if(categoryText.includes('沙律'))add('sauce');

  const productType=String(rule.product_type??rule.item_type??raw.product_type??raw.item_type??'').toLowerCase();
  const explicitRole=String(rule.link_role??rule.combo_role??raw.link_role??raw.combo_role??'').toLowerCase();
  const knownRole=String(matched.linkRole??'').toLowerCase();
  const temporary=resolveTemporaryComboRule({name,category:categoryNames[0],categories:categoryNames});
  const isDrink=categoryText.includes('飲品')||productType.includes('drink')||explicitRole==='drink'||knownRole==='drink'||temporary?.role==='combo_drink';
  const isSnack=explicitRole==='snack'||knownRole==='snack'||temporary?.role==='combo_snack';
  const explicitCombinable=rule.is_combinable??raw.is_combinable;
  return {
    required,
    drinkSlots:required.includes('drink')?Math.max(1,moneyNumber(rule.drink_slots??raw.drink_slots??matched.drinkSlots)):moneyNumber(rule.drink_slots??raw.drink_slots??matched.drinkSlots),
    combinable:Boolean(truthy(explicitCombinable,Boolean(matched.combinable))||temporary?.role==='riceball_main'),
    comboEligible:Boolean(temporary?.comboEligible||matched.comboEligible),
    linkRole:isDrink?'drink':isSnack?'snack':'',
    comboRole:temporary?.role||explicitRole||'',
    comboTier:temporary?.comboTier||matched.comboTier||'',
    comboBasePrice:Number(temporary?.comboBasePrice??matched.comboBasePrice??0),
    comboSurcharge:Number(temporary?.comboSurcharge??matched.comboSurcharge??0),
    ruleSource:Object.keys(rule).length?'product_rules':temporary?'menu_inference':Object.keys(matched).length?'known_catalog':'product'
  };
}

export function mapMenuToOrderCatalog(menu,fallback={categories:[],products:[],drinks:[]}){
  const normalized=menu?.products?menu:normalizeMenuPayload(menu);
  const categoryNamesById=new Map(array(normalized.categories).map((item,index)=>[canonicalCategoryId(item,index),categoryName(item)]));
  const ruleIndex=buildRuleIndex(normalized.productRules);
  const availability=availabilityIndex(normalized.availability);
  const visibleCategories=array(normalized.categories).filter(item=>truthy(first(item,['customerEnabled','customer_enabled','isVisible','is_visible','visible'],true),true)).sort((a,b)=>categorySort(a)-categorySort(b));
  const rawProducts=array(normalized.products).filter(productVisible).sort((a,b)=>productSort(a)-productSort(b));

  const products=rawProducts.map((raw,index)=>{
    const matched=matchFallback(raw,fallback)||{};
    const rule=resolveRule(raw,ruleIndex);
    const id=canonicalProductId(raw,index);
    const code=productCode(raw)||String(matched.code||'');
    const name=productName(raw)||String(matched.name||'未命名產品');
    const categoryIds=resolveCategoryIds(raw);
    const categoryNames=categoryIds.map(categoryId=>categoryNamesById.get(categoryId)||categoryId).filter(Boolean);
    const fallbackCategory=String(first(raw,['customerCategoryName','customer_category_name','categoryName','category_name'],matched.category||'其他'));
    const category=categoryNames[0]||fallbackCategory;
    if(!categoryNames.length)categoryNames.push(category);
    const statusRow=availability.get(id)||{};
    const status=normalizeStatus(first(statusRow,['status','availabilityStatus','availability_status'],first(raw,['availabilityStatus','availability_status','status'],'available')));
    const blocked=status==='soldout'||status==='paused'||truthy(raw.is_sold_out,false)||truthy(raw.is_paused,false);
    const available=truthy(first(raw,['isAvailable','is_available','available'],true),true)&&truthy(first(statusRow,['isAvailable','is_available'],true),true)&&!blocked;
    const rules=inferRules({categoryNames,name,matched,raw,rule});
    return {
      ...matched,
      id,code,name,category,categories:categoryNames,
      description:productDescription(raw)||String(matched.description||''),
      price:productPrice(raw)||moneyNumber(matched.price),
      image:productImage(raw)||String(matched.image||''),
      required:rules.required,drinkSlots:rules.drinkSlots,
      combinable:rules.combinable,comboEligible:rules.comboEligible,
      linkRole:rules.linkRole,comboRole:rules.comboRole,comboTier:rules.comboTier,
      comboBasePrice:rules.comboBasePrice,comboSurcharge:rules.comboSurcharge,
      ruleSource:rules.ruleSource,
      availabilityStatus:status,
      available,
      soldOut:status==='soldout',
      paused:status==='paused',
      isVisible:true,
      apiRaw:raw,
      apiRule:rule
    };
  });

  const drinks=products.filter(item=>item.linkRole==='drink'||item.categories.some(category=>category.includes('飲品'))).map(item=>{
    const raw=item.apiRaw||{},matched=matchDrink(raw,item,fallback)||{},temporary=resolveDrinkUpgradeRule(item)||{};
    return {id:item.id,code:item.code,name:item.name,price:item.price,image:item.image,sweet:truthy(raw.allow_sweetness,matched.sweet??true),ice:truthy(raw.allow_ice,matched.ice??true),available:item.available,specialDrinkSurcharge:Number(raw.special_drink_surcharge??matched.specialDrinkSurcharge??temporary.specialDrinkSurcharge??0)};
  });

  const categoryOrder=visibleCategories.map((item,index)=>categoryNamesById.get(canonicalCategoryId(item,index))).filter(Boolean);
  products.forEach(item=>item.categories.forEach(category=>{if(!categoryOrder.includes(category))categoryOrder.push(category);}));
  return {
    categories:['全部',...categoryOrder.filter(name=>name!=='全部'&&name!=='搜尋')],
    products,
    drinks,
    availability:Object.fromEntries(products.filter(item=>item.availabilityStatus!=='available').map(item=>[item.id,{status:item.availabilityStatus,canonicalProductId:item.id}])),
    loadedAt:Date.now(),
    meta:normalized.meta||{}
  };
}

async function fetchMenu(url,fetchImpl,timeoutMs){
  const controller=typeof AbortController==='function'?new AbortController():null;
  const timer=controller?setTimeout(()=>controller.abort(),timeoutMs):null;
  try{
    const response=await fetchImpl(url,{method:'GET',headers:{Accept:'application/json'},cache:'no-store',signal:controller?.signal});
    if(!response?.ok)throw new Error('MENU_HTTP_'+(response?.status||0));
    const payload=await response.json();
    const normalized=normalizeMenuPayload(payload);
    if(!normalized.products.length)throw new Error('MENU_EMPTY');
    return normalized;
  }finally{if(timer)clearTimeout(timer);}
}

export async function loadMenuCatalog({fetchImpl=globalThis.fetch?.bind(globalThis),storage=globalThis.localStorage,fallback,url=CUSTOMER_RUNTIME_URL,timeoutMs=8000}={}){
  let lastError=null;
  if(fetchImpl){
    try{
      const catalog=mapMenuToOrderCatalog(await fetchMenu(url,fetchImpl,timeoutMs),fallback);
      storage?.setItem?.(MENU_CACHE_KEY,JSON.stringify(catalog));
      return {...catalog,source:'live',apiUrl:url};
    }catch(error){lastError=error;}
  }
  try{
    const cached=JSON.parse(storage?.getItem?.(MENU_CACHE_KEY)||'null');
    if(cached?.products?.length)return {...cached,source:'cache',error:lastError?.message||''};
  }catch(_error){}
  return {...fallback,source:'fallback',error:lastError?.message||'MENU_UNAVAILABLE'};
}
