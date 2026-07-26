import {ORDER_STORAGE_KEY,readJSON} from '../../shared/store.js';

export const CART_VIEW_INPUT='input';
export const CART_VIEW_ORGANIZED='organized';
export const SERVICE_TAKEAWAY='外賣';
export const SERVICE_DINE_IN='堂食';

export const TAKEAWAY_PACKAGING_FEE_PER_UNIT=1;

function isStandaloneRiceball(line){
  if(line?.lineType==='combo')return false;
  if(line?.combinable===true)return true;
  const categories=[line?.category,...(Array.isArray(line?.categories)?line.categories:[])].map(String);
  return categories.some(value=>value==='飯團'||value.includes('單點飯團'));
}
function isStandaloneDrink(line){
  if(line?.lineType==='combo')return false;
  if(line?.linkRole==='drink')return true;
  const categories=[line?.category,...(Array.isArray(line?.categories)?line.categories:[])].map(String);
  return categories.some(value=>value==='飲品'||value.includes('單點飲品'));
}
export function packagingUnitsForLine(line){
  if(normalizeServiceMode(line?.serviceMode,SERVICE_TAKEAWAY)!==SERVICE_TAKEAWAY)return 0;
  if(isStandaloneRiceball(line)||isStandaloneDrink(line))return 0;
  return Math.max(0,Number(line?.qty)||0);
}
export function packagingFeeForLine(line){return packagingUnitsForLine(line)*TAKEAWAY_PACKAGING_FEE_PER_UNIT;}
export function cartPricingSummary(cart=[]){
  const rows=Array.isArray(cart)?cart:[];
  const foodSubtotal=rows.reduce((sum,line)=>sum+Number(line?.total??Number(line?.unitPrice||0)*Number(line?.qty||0)),0);
  const packagingUnits=rows.reduce((sum,line)=>sum+packagingUnitsForLine(line),0);
  const packagingFee=rows.reduce((sum,line)=>sum+packagingFeeForLine(line),0);
  return {foodSubtotal,packagingUnits,packagingFee,total:foodSubtotal+packagingFee};
}


const ORGANIZED_CATEGORY_ORDER=['飯團','飯團套餐','便當','紫米沙律','沙律','麵餐','拌麵','薯角餐','薯蓉餐','套餐小食','小食','飲品','其他'];

export function normalizeCartViewMode(value){
  return value===CART_VIEW_ORGANIZED?CART_VIEW_ORGANIZED:CART_VIEW_INPUT;
}

export function normalizeServiceMode(value,fallback=SERVICE_TAKEAWAY){
  return value===SERVICE_DINE_IN?SERVICE_DINE_IN:value===SERVICE_TAKEAWAY?SERVICE_TAKEAWAY:fallback;
}

export function resolveInitialOrderServiceMode(dineContext,savedMode){
  if(dineContext)return SERVICE_DINE_IN;
  const persisted=readJSON(ORDER_STORAGE_KEY,{});
  const hasActiveCart=Array.isArray(persisted?.cart)&&persisted.cart.length>0;
  return hasActiveCart?normalizeServiceMode(savedMode,SERVICE_TAKEAWAY):SERVICE_TAKEAWAY;
}

export function applyOrderServiceMode(cart,mode){
  const serviceMode=normalizeServiceMode(mode,SERVICE_TAKEAWAY);
  return (cart||[]).map(line=>({...line,serviceMode,serviceModeOverride:''}));
}

export function toggleLineServiceMode(cart,lineId,orderServiceMode){
  return (cart||[]).map(line=>{
    if(line.lineId!==lineId)return line;
    const current=normalizeServiceMode(line.serviceMode,orderServiceMode);
    const serviceMode=current===SERVICE_DINE_IN?SERVICE_TAKEAWAY:SERVICE_DINE_IN;
    return {...line,serviceMode,serviceModeOverride:serviceMode===orderServiceMode?'':serviceMode};
  });
}

export function organizeCartForDisplay(cart){
  const rank=new Map(ORGANIZED_CATEGORY_ORDER.map((category,index)=>[category,index]));
  return [...(cart||[])].sort((a,b)=>{
    const aCategory=a.category||'其他',bCategory=b.category||'其他';
    const aRank=rank.has(aCategory)?rank.get(aCategory):ORGANIZED_CATEGORY_ORDER.length;
    const bRank=rank.has(bCategory)?rank.get(bCategory):ORGANIZED_CATEGORY_ORDER.length;
    return aRank-bRank||Number(a.createdOrder||0)-Number(b.createdOrder||0);
  });
}

export function cartForView(cart,viewMode){
  return normalizeCartViewMode(viewMode)===CART_VIEW_ORGANIZED?organizeCartForDisplay(cart):[...(cart||[])].sort((a,b)=>Number(a.createdOrder||0)-Number(b.createdOrder||0));
}

export function inferOrderServiceMode(cart,dineContext){
  if(dineContext)return SERVICE_DINE_IN;
  const rows=Array.isArray(cart)?cart:[];
  if(rows.length&&rows.every(line=>normalizeServiceMode(line.serviceMode)===SERVICE_DINE_IN))return SERVICE_DINE_IN;
  return SERVICE_TAKEAWAY;
}

export function updateCartLineQuantity(cart,lineId,delta,drinkSlotsByProduct={}){
  return cart.flatMap(line=>{
    if(line.lineId!==lineId)return [line];
    const qty=Number(line.qty||0)+Number(delta||0);
    if(qty<=0)return [];
    const slotsPerUnit=line.lineType==='combo'?1:Number(drinkSlotsByProduct[line.productId]||0);
    return [{
      ...line,
      qty,
      total:Number(line.unitPrice||0)*qty,
      drinkSlots:slotsPerUnit*qty,
      drinkAssignments:(line.drinkAssignments||[]).slice(0,slotsPerUnit*qty)
    }];
  });
}

function takeOne(cart,lineId){
  let taken=null;
  const remaining=cart.flatMap(line=>{
    if(line.lineId!==lineId)return [line];
    taken={...line,qty:1,total:Number(line.unitPrice||0),drinkAssignments:(line.drinkAssignments||[]).slice(0,1)};
    if(Number(line.qty||0)<=1)return [];
    return [{...line,qty:line.qty-1,total:Number(line.unitPrice||0)*(line.qty-1),drinkAssignments:(line.drinkAssignments||[]).slice(1)}];
  });
  return {taken,remaining};
}

function component(role,line,source='cart'){
  if(!line)return null;
  return {
    role,source,productId:line.productId||line.drinkId||'',name:line.name||'',image:line.image||'',
    unitPrice:Number(line.unitPrice??line.price??0),options:{...(line.options||{})},selection:line.selection||'',
    drinkId:line.drinkId||line.productId||'',studentDiscountEligible:line.studentDiscountEligible===true,
    specialDrinkSurcharge:Number(line.specialDrinkSurcharge)||0
  };
}

export function combineRiceballSet(cart,selection,options={}){
  let result=[...cart];
  const mainResult=takeOne(result,selection.mainLineId);
  if(!mainResult.taken)return result;
  result=mainResult.remaining;
  const snackResult=takeOne(result,selection.snackLineId);
  if(!snackResult.taken)return cart;
  result=snackResult.remaining;
  let drink=null;
  if(selection.drinkLineId){
    const drinkResult=takeOne(result,selection.drinkLineId);
    drink=drinkResult.taken;
    result=drinkResult.remaining;
  }else if(selection.quickDrink){
    const quickId=selection.quickDrink.drinkId||selection.quickDrink.selection?.drinkId||selection.quickDrink.productId||selection.quickDrink.id;
    drink={...selection.quickDrink,productId:quickId,drinkId:quickId,unitPrice:Number(selection.quickDrink.unitPrice??selection.quickDrink.price??0)};
  }
  const components=[component('main',mainResult.taken),component('snack',snackResult.taken),component('drink',drink,selection.quickDrink?'quick':'cart')].filter(Boolean);
  const singleTotal=components.reduce((sum,item)=>sum+item.unitPrice,0);
  const comboPrice=Number(options.comboPrice??singleTotal);
  const missingRoles=drink?[]:['drink'];
  const drinkAssignments=drink?[{drinkId:drink.drinkId||drink.productId,name:drink.name,image:drink.image||'',sweetness:'',ice:'',source:selection.quickDrink?'quick':'cart',studentDiscountEligible:drink.studentDiscountEligible===true,specialDrinkSurcharge:Number(drink.specialDrinkSurcharge)||0}]:[];
  result.push({
    lineId:options.lineId||'riceball-combo-'+Date.now(),lineType:'combo',productId:'riceball-combo',name:'飯糰套餐',category:'飯團套餐',
    image:mainResult.taken.image||'',qty:1,unitPrice:comboPrice,total:comboPrice,required:['drink'],drinkSlots:1,drinkAssignments,
    serviceMode:mainResult.taken.serviceMode||SERVICE_TAKEAWAY,serviceModeOverride:mainResult.taken.serviceModeOverride||'',
    options:{},createdOrder:Number(options.createdOrder||Date.now()),
    combo:{id:options.comboId||'combo-'+Date.now(),kind:'riceball-set',source:options.source||'custom',components,missingRoles,singleTotal,comboPrice,discount:Math.max(0,singleTotal-comboPrice)}
  });
  return result;
}

export function dissolveRiceballSet(cart,comboLineId,options={}){
  const makeId=options.idFactory||((role)=>'line-'+role+'-'+Date.now());
  return cart.flatMap(line=>{
    if(line.lineId!==comboLineId||line.lineType!=='combo')return [line];
    const qty=Math.max(1,Number(line.qty||1));
    return (line.combo?.components||[]).map(item=>({
      lineId:makeId(item.role),lineType:'product',productId:item.productId,name:item.name,image:item.image||'',
      category:item.role==='main'?'飯團':item.role==='snack'?'小食':'飲品',qty,
      unitPrice:Number(item.unitPrice||0),total:Number(item.unitPrice||0)*qty,options:{...(item.options||{})},
      required:[],drinkSlots:0,drinkAssignments:[],serviceMode:line.serviceMode||SERVICE_TAKEAWAY,serviceModeOverride:line.serviceModeOverride||'',createdOrder:Number(line.createdOrder||Date.now())
    }));
  });
}

export const ORDER_AUTO_COMPLETE_MS=30*60*1000;

export function acceptPendingOrder(order,acceptedAt=Date.now()){
  return {...order,status:'running',acceptedAt,autoCompleteAt:acceptedAt+ORDER_AUTO_COMPLETE_MS};
}

export function completeExpiredOrders(orders,now=Date.now()){
  return orders.map(order=>order.status==='running'&&Number(order.autoCompleteAt)<=now?{...order,status:'completed',completedAt:now}:order);
}

export function createWhatsAppLink(phone,message){
  const normalized=String(phone||'').replace(/\D/g,'');
  return 'https://wa.me/'+normalized+'?text='+encodeURIComponent(String(message||''));
}
