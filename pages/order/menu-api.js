export const MENU_CACHE_KEY='morefun.smt.unified-menu.lkg.v1';
export const STAFF_SESSION_STORAGE_KEY='morefun:staff:session:v1';
export const OPERATIONS_API_BASE_STORAGE_KEY='morefun:operations-api-base-url';
export const DEFAULT_OPERATIONS_API_BASE='https://morefunos-admin.pages.dev';
export const UNIFIED_STAFF_MENU_PATH='/v1/staff/menu';

const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const array=value=>Array.isArray(value)?value:[];
const number=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;
const text=(value,fallback='')=>String(value??fallback).trim();
const parse=value=>{try{return JSON.parse(value||'null')}catch{return null}};

function sessionToken(storage){
  const session=parse(storage?.getItem?.(STAFF_SESSION_STORAGE_KEY));
  return text(session?.token);
}

function apiBase(storage){
  return text(storage?.getItem?.(OPERATIONS_API_BASE_STORAGE_KEY),DEFAULT_OPERATIONS_API_BASE).replace(/\/+$/,'');
}

function categoryRecord(input,index=0){
  return {
    id:text(input?.id||input?.categoryId||`category-${index+1}`),
    name:text(input?.name||input?.operationsName||input?.customerName||'其他'),
    order:number(input?.operationsOrder??input?.order,index+1),
    visible:input?.visible!==false
  };
}

function optionGroups(product){
  return array(product?.options).map((group,index)=>({
    id:text(group?.optionGroupId||group?.id||`option-${index+1}`),
    name:text(group?.name),
    required:group?.required===true,
    selectionType:group?.selectionType==='multi'?'multi':'single',
    min:number(group?.min,group?.required?1:0),
    max:number(group?.max,group?.selectionType==='multi'?99:1),
    order:number(group?.order,index+1),
    options:array(group?.options).filter(option=>option?.enabled!==false).sort((a,b)=>number(a?.order)-number(b?.order)).map(option=>({
      id:text(option?.optionId||option?.id),
      name:text(option?.name),
      priceDelta:number(option?.priceDelta),
      conditions:clone(option?.conditions||{})
    }))
  })).filter(group=>group.id&&group.name);
}

function orderProduct(product,index,categoryNames){
  const core=product?.core||{};
  const presentation=product?.presentation?.operations||{};
  const productId=text(product?.productId);
  const categoryId=text(presentation?.categoryId);
  const category=categoryNames.get(categoryId)||categoryId||'其他';
  const status=['soldout','paused','disabled'].includes(text(product?.status))?text(product.status):'available';
  const groups=optionGroups(product);
  const required=groups.filter(group=>group.required).map(group=>group.id);
  const type=text(core?.productType).toLowerCase();
  const linkRole=type.includes('drink')?'drink':type.includes('snack')?'snack':'';
  return {
    id:productId,
    code:text(core?.internalShortName||productId),
    name:text(core?.internalName||core?.customerName||productId),
    customerName:text(core?.customerName||core?.internalName||productId),
    description:text(core?.description||core?.customerDescription),
    price:number(core?.price),
    category,
    categoryId,
    categories:[category],
    categoryOrder:number(presentation?.categoryOrder,9999),
    sortOrder:number(presentation?.productOrder,index+1),
    image:text(core?.imageUrl||core?.customerImageUrl),
    available:status==='available',
    soldOut:status==='soldout',
    status,
    required,
    optionGroups:groups,
    optionRules:clone(core?.optionRules||{}),
    comboRules:clone(core?.comboRules||{}),
    printRules:clone(core?.printRules||{}),
    printing:clone(product?.printing||{}),
    reporting:clone(product?.reporting||{}),
    combinable:Boolean(core?.comboRules?.combinable),
    comboEligible:Boolean(core?.comboRules?.eligible),
    linkRole,
    productType:text(core?.productType),
    authorityVersion:number(product?.audit?.version,1)
  };
}

export function normalizeMenuPayload(payload){
  const value=payload?.menu&&typeof payload.menu==='object'?payload.menu:payload||{};
  return {
    schemaVersion:text(value.schemaVersion),
    version:text(value.version),
    checksum:text(value.checksum),
    updatedAt:text(value.updatedAt),
    categories:array(value.categories),
    products:array(value.products)
  };
}

export function mapMenuToOrderCatalog(menu){
  const normalized=normalizeMenuPayload(menu);
  if(!normalized.version||!normalized.checksum||!normalized.products.length)throw new Error('UNIFIED_MENU_INVALID');
  const categories=normalized.categories.map(categoryRecord).filter(category=>category.id&&category.visible).sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id));
  const categoryNames=new Map(categories.map(category=>[category.id,category.name]));
  const products=normalized.products
    .filter(product=>product?.presentation?.operations?.visible!==false&&product?.status!=='disabled')
    .map((product,index)=>orderProduct(product,index,categoryNames))
    .filter(product=>product.id)
    .sort((a,b)=>a.categoryOrder-b.categoryOrder||a.categoryId.localeCompare(b.categoryId)||a.sortOrder-b.sortOrder||a.id.localeCompare(b.id));
  const categoryOrder=[];
  for(const product of products)if(!categoryOrder.includes(product.category))categoryOrder.push(product.category);
  for(const category of categories)if(!categoryOrder.includes(category.name))categoryOrder.push(category.name);
  const drinks=products.filter(product=>product.linkRole==='drink'||product.productType.toLowerCase().includes('drink'));
  return {
    schemaVersion:normalized.schemaVersion||'unified-menu-v1',
    version:normalized.version,
    checksum:normalized.checksum,
    updatedAt:normalized.updatedAt,
    categories:['全部',...categoryOrder.filter(Boolean)],
    products,
    drinks,
    loadedAt:Date.now()
  };
}

async function fetchUnifiedMenu({fetchImpl,storage,timeoutMs}){
  const token=sessionToken(storage);
  if(!token)throw new Error('STAFF_SESSION_REQUIRED');
  const controller=typeof AbortController==='function'?new AbortController():null;
  const timer=controller?setTimeout(()=>controller.abort(),timeoutMs):null;
  try{
    const response=await fetchImpl(`${apiBase(storage)}${UNIFIED_STAFF_MENU_PATH}`,{
      method:'GET',
      headers:{accept:'application/json',authorization:`Bearer ${token}`},
      signal:controller?.signal
    });
    const payload=await response.json().catch(()=>null);
    if(!response.ok||payload?.ok!==true)throw Object.assign(new Error(payload?.error||`UNIFIED_MENU_HTTP_${response.status}`),{status:response.status});
    return mapMenuToOrderCatalog(payload);
  }finally{if(timer)clearTimeout(timer);}
}

function validCache(value){
  return value&&value.version&&value.checksum&&Array.isArray(value.products)&&value.products.length>0;
}

export async function loadMenuCatalog({fetchImpl=globalThis.fetch?.bind(globalThis),storage=globalThis.localStorage,timeoutMs=8000}={}){
  let lastError=null;
  if(typeof fetchImpl==='function'){
    try{
      const catalog=await fetchUnifiedMenu({fetchImpl,storage,timeoutMs});
      storage?.setItem?.(MENU_CACHE_KEY,JSON.stringify(catalog));
      return {...catalog,source:'unified-live',apiUrl:`${apiBase(storage)}${UNIFIED_STAFF_MENU_PATH}`};
    }catch(error){lastError=error;}
  }
  const cached=parse(storage?.getItem?.(MENU_CACHE_KEY));
  if(validCache(cached))return {...cached,source:'unified-cache',error:lastError?.message||''};
  return {categories:['全部'],products:[],drinks:[],version:null,checksum:null,updatedAt:null,source:'unavailable',error:lastError?.message||'UNIFIED_MENU_UNAVAILABLE'};
}
