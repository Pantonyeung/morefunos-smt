export const MENU_CACHE_KEY='morefun.smt.menu.cache.v1';
export const MENU_API_URLS=[
  'https://script.google.com/macros/s/AKfycbzp2OzaZFFGpvtA0-DJwo2TjKa_4FG0grTH4gLJpNyQsIqHfpbjqUmgfUIVQmDDNFY0pA/exec',
  'https://script.google.com/macros/s/AKfycbzeCzRBI3dnG9TS9-hb3q2j9cfxUJlEpVY8ybjDO-RTkVFNGlAh2EKfKjHerRVWPQrlig/exec'
];

const array=value=>Array.isArray(value)?value:[];
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
    categories:array(value.categories||value.category_list||value.menu_categories),
    products:array(value.products||value.items||value.menu_items),
    availability:array(value.product_availability||value.availability||value.availability_status),
    productRules:array(value.product_rules),
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
    const required=array(raw.required_groups||raw.required_options).length?array(raw.required_groups||raw.required_options):array(matched.required);
    const inferredDrink=category.includes('飲品');
    return {
      ...matched,id,code,name,category,
      description:String(raw.product_description??raw.description??raw.subtitle??matched.description??''),
      price:moneyNumber(raw.price??raw.base_price??raw.single_price??raw.display_price??raw.product_price??matched.price),
      image:String(raw.image_url??raw.product_image_url??raw.image??raw.photo_url??matched.image??''),
      required,drinkSlots:moneyNumber(raw.drink_slots??matched.drinkSlots),
      combinable:truthy(raw.is_combinable,Boolean(matched.combinable)),
      linkRole:String(raw.link_role??matched.linkRole??(inferredDrink?'drink':'')),
      available,soldOut,apiRaw:raw
    };
  });
  const drinks=products.filter(item=>item.linkRole==='drink'||item.category.includes('飲品')).map(item=>{
    const raw=item.apiRaw||{},matched=matchDrink(raw,item,fallback)||{};
    return {id:item.id,code:item.code,name:item.name,price:item.price,image:item.image,sweet:truthy(raw.allow_sweetness,matched.sweet??true),ice:truthy(raw.allow_ice,matched.ice??true),available:item.available};
  });
  const categoryOrder=visibleCategories.map((item,index)=>categoryNames.get(String(item.category_id??item.id??index))).filter(Boolean);
  products.forEach(item=>{if(!categoryOrder.includes(item.category))categoryOrder.push(item.category);});
  return {categories:['全部',...categoryOrder.filter(name=>name!=='全部')],products,drinks,loadedAt:Date.now()};
}

async function fetchMenu(url,fetchImpl,timeoutMs){
  const controller=typeof AbortController==='function'?new AbortController():null;
  const timer=controller?setTimeout(()=>controller.abort(),timeoutMs):null;
  try{
    const response=await fetchImpl(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'menu.read',payload:{},context:{client:'morefun-smt',page:'order'}}),signal:controller?.signal});
    if(!response?.ok)throw new Error('MENU_HTTP_'+(response?.status||0));
    const payload=await response.json();
    const normalized=normalizeMenuPayload(payload);
    if(!normalized.products.length)throw new Error('MENU_EMPTY');
    return normalized;
  }finally{if(timer)clearTimeout(timer);}
}

export async function loadMenuCatalog({fetchImpl=globalThis.fetch?.bind(globalThis),storage=globalThis.localStorage,fallback,urls=MENU_API_URLS,timeoutMs=8000}={}){
  let lastError=null;
  if(fetchImpl){
    for(const url of urls){
      try{
        const catalog=mapMenuToOrderCatalog(await fetchMenu(url,fetchImpl,timeoutMs),fallback);
        storage?.setItem?.(MENU_CACHE_KEY,JSON.stringify(catalog));
        return {...catalog,source:'api',apiUrl:url};
      }catch(error){lastError=error;}
    }
  }
  try{
    const cached=JSON.parse(storage?.getItem?.(MENU_CACHE_KEY)||'null');
    if(cached?.products?.length)return {...cached,source:'cache',error:lastError?.message||''};
  }catch(_error){}
  return {...fallback,source:'fallback',error:lastError?.message||'MENU_UNAVAILABLE'};
}
