export const MENU_CACHE_KEY='morefun.smt.menu.cache.v2';
export const FIREBASE_DATABASE_URL='https://morefunposos-default-rtdb.asia-southeast1.firebasedatabase.app';
export const FIREBASE_CATALOG_PATH='public/catalogV1';
export const FIREBASE_CATALOG_URL=`${FIREBASE_DATABASE_URL}/${FIREBASE_CATALOG_PATH}.json`;

const array=value=>Array.isArray(value)?value:[];
const records=value=>Array.isArray(value)?value:value&&typeof value==='object'?Object.values(value):[];
const truthy=(value,fallback=true)=>value===undefined||value===null||value===''?fallback:!['false','0','no','off'].includes(String(value).toLowerCase());
const moneyNumber=value=>Number(String(value??0).replace(/[^0-9.-]/g,''))||0;
const key=value=>String(value??'').trim().toLowerCase().replace(/\s+/g,'');

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
    productRules:records(value.product_rules),
    raw:value
  };
}

function matchFallback(raw,fallback){
  const id=key(raw.product_id??raw.id),code=key(raw.product_code??raw.code??raw.sku),name=key(raw.product_name??raw.name);
  return fallback.products.find(item=>key(item.id)===id||(code&&key(item.code)===code)||(name&&key(item.name)===name));
}

function matchDrink(raw,base,fallback){
  const code=key(raw.product_code??raw.code??raw.sku??base?.code),name=key(raw.product_name??raw.name??base?.name);
  return fallback.drinks.find(item=>(code&&key(item.code)===code)||key(item.name)===name||key(item.id)===key(raw.product_id??raw.id));
}

function inferRules(category,matched={},raw={}){
  const categoryText=String(category||'');
  const explicitRequired=array(raw.required_groups||raw.required_options);
  const required=explicitRequired.length?[...explicitRequired]:array(matched.required);
  const add=group=>{if(!required.includes(group))required.push(group);};
  const drinkMeal=['便當','紫米沙律','沙律','麵餐','拌麵','薯角餐','薯蓉餐'].some(name=>categoryText.includes(name));
  if(drinkMeal)add('drink');
  if(categoryText.includes('沙律'))add('sauce');
  const isRiceball=categoryText.includes('飯團')&&!categoryText.includes('套餐');
  const isSnack=categoryText.includes('小食');
  const isDrink=categoryText.includes('飲品');
  return {
    required,
    drinkSlots:required.includes('drink')?Math.max(1,moneyNumber(raw.drink_slots??matched.drinkSlots)):moneyNumber(raw.drink_slots??matched.drinkSlots),
    combinable:isRiceball||truthy(raw.is_combinable,Boolean(matched.combinable)),
    linkRole:isDrink?'drink':isSnack?'snack':String(raw.link_role??matched.linkRole??'')
  };
}

export function mapMenuToOrderCatalog(menu,fallback){
  const categoryNames=new Map(array(menu.categories).map((item,index)=>[
    String(item.category_id??item.id??index),
    String(item.category_name??item.name??item.title??'其他').trim()||'其他'
  ]));
  const availability=new Map(array(menu.availability).map(item=>[String(item.product_id??item.id),item]));
  const visibleCategories=array(menu.categories).filter(item=>truthy(item.is_visible??item.visible,true)).sort((a,b)=>moneyNumber(a.sort_order)-moneyNumber(b.sort_order));
  const rawProducts=array(menu.products).filter(item=>truthy(item.is_visible??item.visible,true)).sort((a,b)=>moneyNumber(a.sort_order)-moneyNumber(b.sort_order));
  const products=rawProducts.map((raw,index)=>{
    const matched=matchFallback(raw,fallback)||{};
    const id=String(raw.product_id??raw.id??raw.sku??raw.product_code??('product-'+index));
    const code=String(raw.product_code??raw.code??raw.sku??matched.code??'');
    const name=String(raw.product_name??raw.name??raw.title??matched.name??'未命名產品');
    const categoryId=String(raw.category_id??raw.category??matched.category??'');
    const category=categoryNames.get(categoryId)||String(raw.category_name??matched.category??'其他');
    const status=availability.get(id)||{};
    const soldOut=truthy(status.is_sold_out,false)||String(status.availability_status??'').toLowerCase()==='sold_out';
    const available=truthy(raw.is_available,true)&&truthy(status.is_available,true)&&!soldOut;
    const rules=inferRules(category,matched,raw);
    return {
      ...matched,id,code,name,category,
      description:String(raw.product_description??raw.description??raw.subtitle??matched.description??''),
      price:moneyNumber(raw.price??raw.base_price??raw.single_price??raw.display_price??raw.product_price??matched.price),
      image:String(raw.image_url??raw.product_image_url??raw.image??raw.photo_url??matched.image??''),
      required:rules.required,drinkSlots:rules.drinkSlots,
      combinable:rules.combinable,
      linkRole:rules.linkRole,
      available,soldOut,apiRaw:raw
    };
  });
  const drinks=products.filter(item=>item.linkRole==='drink'||item.category.includes('飲品')).map(item=>{
    const raw=item.apiRaw||{},matched=matchDrink(raw,item,fallback)||{};
    return {id:item.id,code:item.code,name:item.name,price:item.price,image:item.image,sweet:truthy(raw.allow_sweetness,matched.sweet??true),ice:truthy(raw.allow_ice,matched.ice??true),available:item.available};
  });
  const categoryOrder=visibleCategories.map((item,index)=>categoryNames.get(String(item.category_id??item.id??index))).filter(Boolean);
  products.forEach(item=>{if(!categoryOrder.includes(item.category))categoryOrder.push(item.category);});
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
