export const ORDER_STORAGE_KEY='morefun:smt:preview:order:v4';
export const DRAFT_STORAGE_KEY='morefun:smt:preview:drafts:v1';
export const CHECKOUT_CONTEXT_KEY='morefun:smt:preview:checkout-context:v1';

export const categories=['全部','人氣推薦','飯團','飯團套餐','便當','紫米沙律','薯角餐','小食','飲品','湯品','甜品','加購','更多','搜尋'];

export const products=[
{id:'f4',code:'F4',name:'蜜糖雞絲＋鹽酥雞',price:45,category:'人氣推薦',image:'../../assets/products/f4.webp',tag:'人氣',requiredGroups:[]},
{id:'a1',code:'A1',name:'紫米飯團 A 餐',price:59,category:'飯團套餐',image:'../../assets/products/f4.webp',tag:'套餐',requiredGroups:['drink'],drinkSlotsPerUnit:1},
{id:'custom-riceball-set',code:'A自選',name:'自選紫米飯團餐',price:59,category:'飯團套餐',image:'../../assets/products/f3.webp',tag:'自選',requiredGroups:['snack','drink'],drinkSlotsPerUnit:1},
{id:'b1',code:'B1',name:'自選便當',price:48,category:'便當',image:'../../assets/products/b1.webp',tag:'推薦',requiredGroups:['rice','drink'],drinkSlotsPerUnit:1},
{id:'b2',code:'B2',name:'泡菜豬肉便當',price:52,category:'便當',image:'../../assets/products/b2.webp',requiredGroups:['rice','drink'],drinkSlotsPerUnit:1},
{id:'f1',code:'F1',name:'原味紫米飯團',price:41,category:'飯團',image:'../../assets/products/f1.webp',requiredGroups:[],combinableGroup:'single-riceball'},
{id:'f3',code:'F3',name:'泡菜豬肉飯團',price:45,category:'飯團',image:'../../assets/products/f3.webp',requiredGroups:[],combinableGroup:'single-riceball'},
{id:'salad1',code:'SL1',name:'紫米能量沙律',price:48,category:'紫米沙律',image:'../../assets/products/b4.webp',requiredGroups:['sauce','drink'],drinkSlotsPerUnit:1},
{id:'s2',code:'S2',name:'香脆薯角餐',price:16,category:'薯角餐',image:'../../assets/products/s2.webp',requiredGroups:['drink'],drinkSlotsPerUnit:1},
{id:'s1',code:'S1',name:'香脆雞翼（2件）',price:18,category:'小食',image:'../../assets/products/s1.webp',requiredGroups:[]},
{id:'d1',code:'D1',name:'手打檸檬茶',price:18,category:'飲品',image:'../../assets/products/d1.webp',requiredGroups:[]},
{id:'d2',code:'D2',name:'台式奶茶',price:16,category:'飲品',image:'../../assets/products/d2.webp',requiredGroups:[]},
{id:'soup1',code:'SP1',name:'味噌湯',price:12,category:'湯品',image:'../../assets/products/b4.webp',requiredGroups:[]}
];

export const quickDrinks=[
{id:'iced-lemon-tea',name:'凍檸茶',price:18,options:['sweetness','ice'],icon:'🍹',image:'../../assets/products/d1.webp'},
{id:'taiwan-milk-tea',name:'台式奶茶',price:16,options:['sweetness','ice'],icon:'🧋',image:'../../assets/products/d2.webp'},
{id:'iced-lemon-water',name:'凍檸水',price:16,options:['sweetness','ice'],icon:'🍋',image:'../../assets/products/d1.webp'},
{id:'cola',name:'可樂',price:12,options:['ice'],icon:'🥤',image:'../../assets/products/d1.webp'},
{id:'genmaicha',name:'玄米冷泡茶',price:18,options:[],icon:'🍵',image:'../../assets/products/d2.webp'},
{id:'puer',name:'普洱冷泡茶',price:18,options:[],icon:'🫖',image:'../../assets/products/d2.webp'},
{id:'limited-tea',name:'限定冷泡茶',price:18,options:[],icon:'🧊',image:'../../assets/products/d1.webp'},
{id:'sparkling-water',name:'氣泡水',price:16,options:[],icon:'💧',image:'../../assets/products/d1.webp'},
{id:'wintermelon-lemon',name:'冬瓜檸檬',price:16,options:['ice'],icon:'🍈',image:'../../assets/products/d1.webp'},
{id:'americano',name:'美式咖啡',price:18,options:[],icon:'☕',image:'../../assets/products/d2.webp'},
{id:'latte',name:'拿鐵',price:22,options:[],icon:'🥛',image:'../../assets/products/d2.webp'}
];

export const defaultQuickDrinkOrder=quickDrinks.map(item=>item.id);
export const sweetnessOptions=['正常甜','多甜','少甜','走甜'];
export const iceOptions=['正常冰','少冰','多冰'];
export const riceOptions=['肉燥飯','咖喱飯','菜飯'];
export const sauceOptions=['不需要','標準','少醬','多醬'];
export const snackOptions=['薯角','鹽酥雞','沙律','味噌湯'];

const clone=value=>JSON.parse(JSON.stringify(value));
const lineId=()=>`line-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
const assignedDrink=(drinkId,name,unitPrice,sweetness='正常甜',ice='正常冰')=>({drinkId,name,unitPrice,sweetness,ice});

export const initialCart=[
{lineId:'c1',productId:'f4',name:'蜜糖雞絲＋鹽酥雞',detail:'F4 · 標準',qty:2,unitPrice:45,total:90,image:'../../assets/products/f4.webp',category:'人氣推薦',requiredGroups:[],options:{},drinkSlots:0,drinkAssignments:[]},
{lineId:'c2',productId:'a1',name:'紫米飯團 A 餐',detail:'尚欠飲品 2 份',qty:2,unitPrice:59,total:118,image:'../../assets/products/f4.webp',category:'飯團套餐',requiredGroups:['drink'],options:{},drinkSlots:2,drinkAssignments:[]},
{lineId:'c3',productId:'b1',name:'自選便當',detail:'肉燥飯 · 走蛋',qty:3,unitPrice:52,total:156,image:'../../assets/products/b1.webp',category:'便當',requiredGroups:['rice','drink'],options:{rice:'肉燥飯',adjustment:'走蛋'},drinkSlots:3,drinkAssignments:[assignedDrink('taiwan-milk-tea','台式奶茶',16),assignedDrink('taiwan-milk-tea','台式奶茶',16),assignedDrink('taiwan-milk-tea','台式奶茶',16)]},
{lineId:'c4',productId:'salad1',name:'紫米能量沙律',detail:'少醬',qty:1,unitPrice:48,total:48,image:'../../assets/products/b4.webp',category:'紫米沙律',requiredGroups:['sauce','drink'],options:{sauce:'少醬'},drinkSlots:1,drinkAssignments:[assignedDrink('genmaicha','玄米冷泡茶',18)]},
{lineId:'c5',productId:'d1',name:'手打檸檬茶',detail:'少冰 · 少甜',qty:1,unitPrice:18,total:18,image:'../../assets/products/d1.webp',category:'飲品',requiredGroups:[],options:{sweetness:'少甜',ice:'少冰'},drinkSlots:0,drinkAssignments:[]}
];

export const pendingOrders=[
{id:'A512',source:'磨飯 App',customer:'小米粒',itemCount:3,total:168,payment:'平台已付款',items:['紫米飯團 A 餐 ×1','自選便當 ×1','凍檸茶 ×1']},
{id:'A513',source:'磨飯 App',customer:'陳小姐',itemCount:2,total:104,payment:'平台已付款',items:['泡菜豬肉便當 ×2']},
{id:'A514',source:'磨飯 App',customer:'黃先生',itemCount:4,total:207,payment:'待核對',items:['飯團套餐 ×2','小食 ×2']},
{id:'A515',source:'磨飯 App',customer:'李小姐',itemCount:1,total:48,payment:'平台已付款',items:['紫米能量沙律 ×1']},
{id:'A516',source:'磨飯 App',customer:'何先生',itemCount:5,total:256,payment:'平台已付款',items:['自選便當 ×3','飲品 ×2']},
{id:'TK0252',source:'電話／WhatsApp',customer:'張先生',itemCount:2,total:96,payment:'需要電話核對',items:['自選便當 ×2']},
{id:'TK0253',source:'電話／WhatsApp',customer:'電話尾號 6631',itemCount:1,total:59,payment:'需要核對',items:['紫米飯團 A 餐 ×1']},
{id:'TK0254',source:'電話／WhatsApp',customer:'WhatsApp 客人',itemCount:3,total:135,payment:'付款截圖待核對',items:['紫米飯團 ×3']}
];

export function createInitialCart(){return clone(initialCart)}
export function getProductAddDecision(product,quickMode){if(!(product?.requiredGroups?.length))return 'add-direct';return quickMode?'add-with-pending':'configure-before-add'}
export function createCartLine(product,{qty=1,options={},drink=null}={}){const assignments=drink?[clone(drink)]:[];return {lineId:lineId(),productId:product.id,name:product.name,detail:product.code,qty,unitPrice:product.price,total:product.price*qty,image:product.image,category:product.category,requiredGroups:[...(product.requiredGroups||[])],combinableGroup:product.combinableGroup||null,options:{...options},drinkSlots:(product.drinkSlotsPerUnit||0)*qty,drinkAssignments:assignments}}
export function addProductToCart(cart,product,{quickMode=false,options={},drink=null}={}){if(!product)return cart;const decision=getProductAddDecision(product,quickMode);if(decision==='configure-before-add'&&(product.requiredGroups||[]).some(group=>group==='drink'?!drink:!options[group]))return cart;return [...cart,createCartLine(product,{options,drink})]}
export function getRequiredOptionValues(group){if(group==='drink')return quickDrinks.map(item=>item.id);if(group==='rice')return [...riceOptions];if(group==='sauce')return [...sauceOptions];if(group==='snack')return [...snackOptions];return []}
export function getOrderedQuickDrinks(drinks=quickDrinks,order=defaultQuickDrinkOrder){const map=new Map(drinks.map(item=>[item.id,item]));const ordered=[];for(const id of order||[]){const item=map.get(id);if(item){ordered.push(item);map.delete(id)}}return [...ordered,...map.values()]}
export function getLineMissingRequirements(line){const missing=[];for(const group of line.requiredGroups||[]){if(group==='drink'){const count=Math.max(0,(line.drinkSlots||0)-(line.drinkAssignments||[]).length);if(count)missing.push({lineId:line.lineId,group:'drink',label:'飲品',count})}else if(!line.options?.[group]){const label=group==='rice'?'飯底':group==='sauce'?'醬汁':group==='snack'?'小食':group;missing.push({lineId:line.lineId,group,label,count:1})}}return missing}
export function getPendingState(cart){const requiredMissing=cart.flatMap(getLineMissingRequirements);const requiredMissingCount=requiredMissing.reduce((sum,item)=>sum+item.count,0);const combinable=cart.filter(line=>line.combinableGroup).map(line=>({lineId:line.lineId,group:line.combinableGroup,label:'單點飯團可組合',count:line.qty||1}));return {requiredMissing,requiredMissingCount,combinable,canCheckout:requiredMissingCount===0}}
export function getMissingDrinkSlots(cart){return cart.reduce((sum,line)=>sum+Math.max(0,(line.drinkSlots||0)-(line.drinkAssignments||[]).length),0)}
const sameDrink=(a,b)=>a.drinkId===b.drinkId&&(a.sweetness||'正常甜')===(b.sweetness||'正常甜')&&(a.ice||'正常冰')===(b.ice||'正常冰');
export function addQuickDrinkToLine(cart,lineId,selection){return cart.map(line=>line.lineId===lineId&&(line.drinkSlots||0)>(line.drinkAssignments||[]).length?{...line,drinkAssignments:[...(line.drinkAssignments||[]),clone(selection)]}:line)}
export function addQuickDrink(cart,selection){if(getMissingDrinkSlots(cart)<=0)return cart;const target=cart.find(line=>(line.drinkSlots||0)>(line.drinkAssignments||[]).length);return target?addQuickDrinkToLine(cart,target.lineId,selection):cart}
export function removeQuickDrinkFromLine(cart,lineId,selection){return cart.map(line=>{if(line.lineId!==lineId)return line;const list=line.drinkAssignments||[];for(let index=list.length-1;index>=0;index--){if(sameDrink(list[index],selection))return {...line,drinkAssignments:list.filter((_,i)=>i!==index)}}return line})}
export function removeQuickDrink(cart,selection){for(let i=cart.length-1;i>=0;i--){const list=cart[i].drinkAssignments||[];for(let j=list.length-1;j>=0;j--){if(sameDrink(list[j],selection))return cart.map((line,index)=>index===i?{...line,drinkAssignments:list.filter((_,k)=>k!==j)}:line)}}return cart}
export function quickDrinkGroupQuantity(cart,drinkId,sweetness='正常甜',ice='正常冰'){return cart.reduce((sum,line)=>sum+(line.drinkAssignments||[]).filter(item=>sameDrink(item,{drinkId,sweetness,ice})).length,0)}
export function quickDrinkTotalQuantity(cart,drinkId){return cart.reduce((sum,line)=>sum+(line.drinkAssignments||[]).filter(item=>item.drinkId===drinkId).length,0)}
export function getCartTotal(cart){return cart.reduce((sum,line)=>sum+Number(line.total||line.unitPrice*line.qty||0),0)}
export function getCartItemCount(cart){return cart.reduce((sum,line)=>sum+Number(line.qty||0),0)}
export function createStoredDraft(cart,createdAt=new Date().toISOString(),id=`draft-${Date.now()}`){return {id,createdAt,cart:clone(cart),itemCount:getCartItemCount(cart),total:getCartTotal(cart)}}
export function addStoredDraft(drafts,draft){return [clone(draft),...clone(drafts||[])]}
export function takeStoredDraft(drafts,id){const draft=(drafts||[]).find(item=>item.id===id);return {cart:draft?clone(draft.cart):[],drafts:clone((drafts||[]).filter(item=>item.id!==id))}}
export function describeLine(line){const parts=[];if(line.options?.rice)parts.push(line.options.rice);if(line.options?.sauce)parts.push(line.options.sauce);if(line.options?.snack)parts.push(line.options.snack);if(line.options?.adjustment)parts.push(line.options.adjustment);const groups={};for(const item of line.drinkAssignments||[]){const key=[item.name,item.sweetness||'正常甜',item.ice||'正常冰'].join('|');groups[key]=(groups[key]||0)+1}for(const [key,qty] of Object.entries(groups)){const [name,sweetness,ice]=key.split('|');const optionText=[sweetness,ice].filter(value=>!value.startsWith('正常')).join('');parts.push(`${name}${optionText?` · ${optionText}`:''}${qty>1?` ×${qty}`:''}`)}const missing=Math.max(0,(line.drinkSlots||0)-(line.drinkAssignments||[]).length);if(missing)parts.push(`尚欠飲品 ${missing} 份`);return parts.length?parts.join(' · '):(line.detail||line.code||'標準')}
