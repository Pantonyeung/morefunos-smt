import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';
import {ORDER_STORAGE_KEY,SETTINGS_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';
import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';
import {orderPageConfig as defaults} from './page-config.js';
import {categories,products,drinks,optionSets} from './page-data.js';

const app=document.getElementById('app');
const productMap=new Map(products.map(item=>[item.id,item]));
const drinkMap=new Map(drinks.map(item=>[item.id,item]));
const snackProducts=products.filter(item=>item.linkRole==='snack');
const drinkProducts=products.filter(item=>item.linkRole==='drink');
let modal=null;
let confirmState=null;

const saved=readJSON(ORDER_STORAGE_KEY,null);
const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});
const settings={
  catalog:{...defaults.catalog,...(savedSettings.catalog||{}),productOverrides:{}},
  cart:{...defaults.cart,...(savedSettings.cart||{})},
  quickDrinks:{...defaults.quickDrinks,...(savedSettings.quickDrinks||{})}
};

function drinkSelection(id,sweetness='',ice=''){
  const d=drinkMap.get(id);
  return {drinkId:id,name:d?.name||id,unitPrice:d?.price||0,sweetness,ice};
}
function makeLine(productId,qty=1,{options={},drinkAssignments=[],linkedComboId='',linkedQty=0}={}){
  const p=productMap.get(productId);
  qty=Math.max(1,Number(qty)||1);
  return {
    lineId:stableId('line'),productId,name:p.name,image:p.image,qty,
    unitPrice:p.price,total:p.price*qty,options:safeClone(options),
    drinkAssignments:safeClone(drinkAssignments),drinkSlots:(p.drinkSlots||0)*qty,
    required:[...(p.required||[])],combinable:Boolean(p.combinable),linkRole:p.linkRole||'',
    linkedComboId,linkedQty,createdOrder:Date.now()+Math.random()
  };
}
function normalizeCart(cart){
  return (Array.isArray(cart)?cart:[]).map((line,index)=>{
    const p=productMap.get(line.productId)||{};
    const qty=Math.max(1,Number(line.qty)||1);
    const unitPrice=Number(line.unitPrice??p.price??0);
    return {...line,lineId:line.lineId||stableId('line'),name:line.name||p.name||'餐點',image:line.image||p.image||'',qty,unitPrice,total:unitPrice*qty,options:{...(line.options||{})},drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],drinkSlots:Number(line.drinkSlots??(p.drinkSlots||0)*qty),required:Array.isArray(line.required)?line.required:[...(p.required||[])],combinable:Boolean(line.combinable??p.combinable),linkRole:line.linkRole||p.linkRole||'',linkedComboId:line.linkedComboId||'',linkedQty:Number(line.linkedQty||0),createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:index};
  }).sort((a,b)=>a.createdOrder-b.createdOrder);
}
function mergeKey(line){return JSON.stringify({productId:line.productId,options:line.options,drinks:line.drinkAssignments.map(d=>[d.drinkId,d.sweetness||'',d.ice||'']),linkedComboId:line.linkedComboId});}
function mergeCart(cart,mode){
  const rows=normalizeCart(cart);if(mode==='never')return rows;
  const out=[];
  rows.forEach(line=>{
    const found=out.find(item=>item.productId===line.productId&&(mode==='always'||mergeKey(item)===mergeKey(line)));
    if(!found){out.push(safeClone(line));return;}
    found.qty+=line.qty;found.total=found.unitPrice*found.qty;found.drinkSlots+=line.drinkSlots;found.drinkAssignments.push(...safeClone(line.drinkAssignments));
  });
  return out;
}
function describe(line){
  const parts=[];
  Object.entries(line.options||{}).forEach(([key,value])=>{if(value)parts.push(Array.isArray(value)?value.join('、'):value);});
  const grouped={};
  (line.drinkAssignments||[]).forEach(d=>{const key=[d.name,d.sweetness||'',d.ice||''].join('|');grouped[key]=(grouped[key]||0)+1;});
  Object.entries(grouped).forEach(([key,count])=>{const [name,sweet,ice]=key.split('|');const mods=[sweet,ice].filter(Boolean).join(' · ');parts.push(name+(mods?' · '+mods:'')+(count>1?' ×'+count:''));});
  if(line.linkedComboId)parts.push('已組合套餐'+(line.linkedQty>1?' ×'+line.linkedQty:''));
  const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
  if(missing&&line.required.includes('drink'))parts.push('尚欠飲品 '+missing+' 份');
  return parts.join(' · ')||'標準';
}
function missingGroups(line){
  const groups=[];
  (line.required||[]).forEach(group=>{
    if(group==='drink'){
      const count=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
      if(count)groups.push({group,label:'飲品',count});
    }else if(!line.options?.[group]) groups.push({group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':'小食',count:line.qty||1});
  });
  return groups;
}
function pendingSummary(cart){
  const out={rice:0,sauce:0,snack:0,drink:0,total:0};
  cart.forEach(line=>missingGroups(line).forEach(item=>{out[item.group]+=item.count;out.total+=item.count;}));
  return out;
}
function linkUpSummary(cart){
  const available=cart.filter(line=>!line.linkedComboId);
  const riceballs=available.filter(line=>line.combinable).reduce((n,line)=>n+line.qty,0);
  const snacks=available.filter(line=>line.linkRole==='snack').reduce((n,line)=>n+line.qty,0);
  const standaloneDrinks=available.filter(line=>line.linkRole==='drink').reduce((n,line)=>n+line.qty,0);
  return {riceballs,snacks,drinks:standaloneDrinks,count:Math.min(riceballs,snacks,standaloneDrinks)};
}
function applyLinkUp(count){
  if(!count)return;
  store.set(state=>{
    let riceLeft=count,snackLeft=count,drinkLeft=count;
    const comboId=stableId('combo');
    const next=[];
    state.cart.forEach(line=>{
      if(line.linkedComboId){next.push(line);return;}
      let take=0;
      if(line.combinable&&riceLeft){take=Math.min(line.qty,riceLeft);riceLeft-=take;}
      else if(line.linkRole==='snack'&&snackLeft){take=Math.min(line.qty,snackLeft);snackLeft-=take;}
      else if(line.linkRole==='drink'&&drinkLeft){take=Math.min(line.qty,drinkLeft);drinkLeft-=take;}
      if(!take){next.push(line);return;}
      next.push({...line,lineId:stableId('line'),qty:take,total:line.unitPrice*take,drinkSlots:Math.min(line.drinkSlots||0,take),drinkAssignments:(line.drinkAssignments||[]).slice(0,take),linkedComboId:comboId,linkedQty:take});
      const remain=line.qty-take;
      if(remain)next.push({...line,lineId:stableId('line'),qty:remain,total:line.unitPrice*remain,drinkSlots:Math.max(0,(line.drinkSlots||0)-take),drinkAssignments:(line.drinkAssignments||[]).slice(take),linkedComboId:'',linkedQty:0,createdOrder:line.createdOrder+.0001});
    });
    state.cart=normalizeCart(next);
    return state;
  });
  showToast('已組合 '+count+' 份飯團套餐');
}

const initialCart=saved&&Array.isArray(saved.cart)?saved.cart:[
  makeLine('f4',2),
  makeLine('a1',2,{drinkAssignments:[drinkSelection('taiwan-milk-tea'),drinkSelection('taiwan-milk-tea')]}),
  makeLine('b1',3,{options:{rice:'肉燥飯'},drinkAssignments:[drinkSelection('taiwan-milk-tea'),drinkSelection('taiwan-milk-tea'),drinkSelection('taiwan-milk-tea')]})
];
const defaultHealth={api:{ok:false,label:'API',detail:'未連接'},printer:{ok:false,label:'打印機',detail:'未連接'},sync:{ok:false,label:'同步',detail:'等待 API'},backup:{ok:true,label:'備份',detail:'本機資料正常'}};
const store=createStore({category:'全部',cart:normalizeCart(initialCart),settings,pendingExpanded:false,operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false},health:defaultHealth},{storageKey:ORDER_STORAGE_KEY,normalize:state=>({...state,cart:normalizeCart(state.cart||[]),settings:{...settings,...(state.settings||{}),catalog:{...settings.catalog,...(state.settings?.catalog||{})},cart:{...settings.cart,...(state.settings?.cart||{})},quickDrinks:{...settings.quickDrinks,...(state.settings?.quickDrinks||{})}},pendingExpanded:Boolean(state.pendingExpanded),operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false,...(state.operations||{})},health:{...defaultHealth,...(state.health||{})}})});
const queue=createRenderQueue(render);store.subscribe(()=>queue.schedule());
installErrorBoundary({toast:showToast,report:error=>window.parent?.postMessage?.({type:'morefun:page-runtime-error',page:'order',message:String(error?.message||error)},'*')});

function updateSettings(mutator){
  store.set(state=>{mutator(state.settings);writeJSON(SETTINGS_STORAGE_KEY,state.settings);return state;});
}
function productTemplate(){return store.get().settings.catalog.defaultTemplate;}
function drinkChoiceCard(d,action='select-drink',selected=false){
  const imageMode=store.get().settings.quickDrinks.showImages!==false;
  return '<button class="drink-choice-card '+(imageMode?'is-image':'is-text')+' '+(selected?'selected':'')+'" data-action="'+action+'" data-id="'+d.id+'">'+(imageMode?imageBlock(d.image,d.name,'drink-choice-img'):'')+'<span>'+escapeHtml(d.name)+'</span></button>';
}
function productCard(p){
  const template=productTemplate();const showCode=store.get().settings.catalog.showCode;const showDescription=store.get().settings.catalog.showDescription;
  const code=showCode?'<small class="product-code">'+p.code+'</small>':'';
  if(template==='text')return '<button class="product-card text" data-action="open-product" data-id="'+p.id+'"><span class="product-copy">'+code+'<strong>'+p.name+'</strong></span><b class="product-price">'+money(p.price)+'</b></button>';
  if(template==='small')return '<button class="product-card small" data-action="open-product" data-id="'+p.id+'">'+imageBlock(p.image,p.name,'product-thumb')+'<span class="product-copy">'+code+'<strong>'+p.name+'</strong></span><b class="product-price">'+money(p.price)+'</b></button>';
  const description=showDescription&&p.description?'<p class="product-description">'+p.description+'</p>':'';
  return '<button class="product-card large" data-action="open-product" data-id="'+p.id+'">'+imageBlock(p.image,p.name,'product-hero')+'<div class="product-info"><span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+description+'</span><b class="product-price">'+money(p.price)+'</b></div></button>';
}
function cartRows(){
  const cart=store.get().cart;if(!cart.length)return '<div class="empty">購物車未有餐點</div>';
  return cart.map((line,index)=>'<button class="cart-row" data-action="edit-line" data-id="'+line.lineId+'"><span class="seq">'+(index+1)+'</span>'+imageBlock(line.image,line.name,'cart-img')+'<span><strong>'+line.name+'</strong><small>'+describe(line)+'</small></span><b>x'+line.qty+'<br>'+money(line.total)+'</b></button>').join('');
}
function pendingArea(){
  const state=store.get();const required=pendingSummary(state.cart);const link=linkUpSummary(state.cart);
  return '<section class="pending-area '+(!required.total?'complete':'')+'"><button class="pending-receipt" data-action="open-completion"><strong>待補區</strong><span>'+(required.total?'必須完成 '+required.total+' 項':'必選已完成')+'</span>'+(link.count?'<span>可組合 '+link.count+' 份套餐</span>':'<span>可補選／可組合</span>')+'<b>整理</b></button></section>';
}
function quickDrinks(){
  const state=store.get();if(!state.quickMode)return '';
  const order=state.settings.quickDrinks.order||drinks.map(d=>d.id);
  return '<section class="quick-strip"><button class="quick-label" data-action="open-quick-settings"><span>快選</span><span>飲品</span></button><div>'+order.map(id=>drinkMap.get(id)).filter(Boolean).map(d=>drinkChoiceCard(d,'quick-drink')).join('')+'</div></section>';
}
function operationLabel(state){if(state.operations.immediateStopped||!state.operations.acceptingOrders)return '已停止接單';if(state.operations.scheduledClose)return '接單至 '+state.operations.scheduledClose;return '接單中';}
function healthIssueCount(state){return Object.values(state.health).filter(item=>!item.ok).length;}
function topbar(){
  const state=store.get();const issues=healthIssueCount(state);
  return '<header class="topbar"><div class="brand">磨飯 SMT</div><button class="online-state '+(state.operations.acceptingOrders&&!state.operations.immediateStopped?'is-online':'is-offline')+'" data-action="open-status"><span></span>'+operationLabel(state)+'</button><div class="order-number">訂單：<strong>10248</strong></div><div class="spacer"></div><button class="top-btn" data-action="toggle-pending-panel">待處理 <span class="badge">8</span></button><button class="top-btn" data-action="open-quick-settings">快捷 '+(state.quickMode?'ON':'OFF')+'</button><button class="top-btn health-button '+(issues?'has-error':'is-ok')+'" data-action="open-health"><span>'+(issues?'!':'✓')+'</span>'+(issues?'系統異常 '+issues:'系統正常')+'</button><button class="top-btn" data-action="open-settings">顯示設定</button></header>';
}
function pendingPanel(){
  if(!store.get().pendingExpanded)return '';
  const incoming=[['磨飯 App','5'],['電話／WhatsApp','3']];
  return '<aside class="pending-panel modal-card"><header><strong>待處理訂單</strong><button data-action="toggle-pending-panel">×</button></header><div class="pending-split"><section><h3>新訂單</h3><div class="pending-scroll">'+incoming.map((x,i)=>'<button><span>'+x[0]+'</span><b>'+x[1]+' 張</b><small>#10'+(249+i)+'｜剛剛收到</small></button>').join('')+'</div></section><section><h3>已接單／待完成</h3><div class="pending-scroll">'+Array.from({length:6},(_,i)=>'<button><span>訂單 #'+(10240+i)+'</span><b>'+(i+6)+' 分鐘</b><small>按下可開啟訂單</small></button>').join('')+'</div></section></div></aside>';
}
function modalScrim(){return modal?'<button class="modal-scrim" data-action="dismiss-modal" aria-label="關閉"></button>':'';}
function quickSettingsModal(){
  const state=store.get();const q=state.settings.quickDrinks;
  return '<aside class="side-card modal-card quick-mode-card"><header><strong>快捷模式</strong><button data-action="dismiss-modal">×</button></header><div class="setting-row"><div><strong>快捷飲品列</strong><small>顯示底部快捷飲品</small></div><button class="switch '+(state.quickMode?'on':'')+'" data-action="toggle-quick-mode"><i></i></button></div><div class="setting-block"><strong>飲品卡顯示</strong><div class="segmented"><button class="'+(q.showImages!==false?'active':'')+'" data-action="quick-display" data-value="image">圖片</button><button class="'+(q.showImages===false?'active':'')+'" data-action="quick-display" data-value="text">純文字</button></div><div class="quick-preview">'+(q.order||[]).slice(0,6).map(id=>drinkMap.get(id)).filter(Boolean).map(d=>drinkChoiceCard(d,'noop')).join('')+'</div></div><div class="setting-row"><div><strong>快捷補選</strong><small>獨立控制，唔受快捷飲品列影響</small></div><button class="switch '+(q.quickAssist!==false?'on':'')+'" data-action="toggle-quick-assist"><i></i></button></div></aside>';
}
function settingsModal(){
  const state=store.get();const c=state.settings.catalog;
  return '<aside class="side-card modal-card"><header><strong>顯示設定</strong><button data-action="dismiss-modal">×</button></header><div class="setting-block"><strong>產品卡</strong><div class="segmented three"><button data-action="setting-card" data-value="large" class="'+(c.defaultTemplate==='large'?'active':'')+'">大圖</button><button data-action="setting-card" data-value="small" class="'+(c.defaultTemplate==='small'?'active':'')+'">小圖</button><button data-action="setting-card" data-value="text" class="'+(c.defaultTemplate==='text'?'active':'')+'">純文字</button></div></div><div class="setting-row"><div><strong>顯示產品 Code</strong><small>例如 F4、B1、S1</small></div><button class="switch '+(c.showCode?'on':'')+'" data-action="toggle-code"><i></i></button></div></aside>';
}
function healthModal(){
  const state=store.get();return '<aside class="side-card modal-card"><header><strong>系統狀態</strong><button data-action="dismiss-modal">×</button></header><div class="health-list">'+Object.values(state.health).map(item=>'<div class="health-row '+(item.ok?'ok':'bad')+'"><span>'+(item.ok?'✓':'!')+'</span><div><strong>'+item.label+'</strong><small>'+item.detail+'</small></div><b>'+(item.ok?'正常':'異常')+'</b></div>').join('')+'</div></aside>';
}
function statusModal(){
  const state=store.get(),ops=state.operations;
  return '<aside class="side-card modal-card"><header><strong>今日接單狀態</strong><button data-action="dismiss-modal">×</button></header><div class="setting-row"><div><strong>接受網絡／預約訂單</strong><small>'+operationLabel(state)+'</small></div><button class="switch '+(ops.acceptingOrders&&!ops.immediateStopped?'on':'')+'" data-action="toggle-accepting"><i></i></button></div><div class="setting-block"><label>今日停止接單時間</label><div class="time-row"><input id="scheduled-close" type="time" value="'+(ops.scheduledClose||'')+'"><button data-action="save-close-time">儲存</button></div></div><div class="setting-block"><button class="danger wide" data-action="immediate-stop">即時停止接單</button><button class="wide" data-action="resume-orders">恢復接單</button></div></aside>';
}
function completionModal(){
  const state=store.get(),required=pendingSummary(state.cart),link=linkUpSummary(state.cart),assist=state.settings.quickDrinks.quickAssist!==false;
  return '<aside class="completion-card modal-card"><header><strong>統一整理</strong><button data-action="dismiss-modal">×</button></header><div class="completion-section required"><div><small>必須完成</small><strong>'+(required.total?'共欠 '+required.total+' 項':'全部完成')+'</strong><span>未完成項目會阻止結帳</span></div>'+['rice','sauce','snack','drink'].filter(k=>required[k]).map(k=>'<button data-action="complete-group" data-group="'+k+'"><span>'+({rice:'飯底',sauce:'醬汁',snack:'小食',drink:'飲品'}[k])+'</span><b>'+required[k]+' 份</b><em>選擇</em></button>').join('')+'</div><div class="completion-section optional"><div><small>可補選</small><strong>唔影響結帳</strong><span>單點飯團可加小食及飲品升級套餐</span></div></div><div class="completion-section linkup"><div><small>可組合套餐</small><strong>'+link.count+' 份</strong><span>飯團 '+link.riceballs+'｜小食 '+link.snacks+'｜飲品 '+link.drinks+'</span></div>'+(link.count?'<button class="primary" data-action="linkup-all" data-count="'+link.count+'">一鍵組合</button>':'')+'</div>'+(assist&&required.drink?'<div class="completion-drinks"><strong>選擇飲品</strong><div>'+drinks.map(d=>drinkChoiceCard(d,'completion-drink')).join('')+'</div></div>':'')+'</aside>';
}
function optionButtons(group,values,selected,multi=false){
  return '<div class="option-chips">'+values.map(value=>'<button data-action="detail-option" data-group="'+group+'" data-value="'+escapeHtml(value)+'" data-multi="'+multi+'" class="'+((multi?selected.includes(value):selected===value)?'selected':'')+'">'+escapeHtml(value)+'</button>').join('')+'</div>';
}
function detailGroups(product,draft){
  const rows=[];
  if(product.required.includes('rice'))rows.push('<section><header><strong>飯底</strong><span class="required-tag">必選</span></header>'+optionButtons('rice',optionSets.rice,draft.options.rice||'')+'</section>');
  if(product.required.includes('sauce'))rows.push('<section><header><strong>醬汁</strong><span class="required-tag">必選</span></header>'+optionButtons('sauce',optionSets.sauce,draft.options.sauce||'')+'</section>');
  rows.push('<section><header><strong>飯量／份量</strong><span>可選</span></header>'+optionButtons('portion',['少飯','標準','多飯','加飯 +$5'],draft.options.portion||'標準')+'</section>');
  rows.push('<section><header><strong>口味調整</strong><span>可多選</span></header>'+optionButtons('taste',['走蔥','少辣','走蒜','走香菜','不要花生'],draft.options.taste||[],true)+'</section>');
  if(product.required.includes('snack'))rows.push('<section><header><strong>套餐小食</strong><span class="required-tag">必選</span></header>'+optionButtons('snack',optionSets.snack,draft.options.snack||'')+'</section>');
  if(product.combinable)rows.push('<section class="upgrade-section"><header><strong>升級飯團套餐</strong><span>可補選</span></header><p>小食及飲品都選擇後，會直接組合成飯團套餐。</p>'+optionButtons('snack',optionSets.snack,draft.options.snack||'')+'</section>');
  if(product.required.includes('drink')||product.combinable){
    rows.push('<section><header><strong>'+(product.required.includes('drink')?'套餐飲品':'加配飲品')+'</strong><span class="'+(product.required.includes('drink')?'required-tag':'')+'">'+(product.required.includes('drink')?'必選':'可補選')+'</span></header><div class="detail-drinks">'+drinks.map(d=>drinkChoiceCard(d,'detail-drink',draft.drink?.drinkId===d.id)).join('')+'</div></section>');
  }
  rows.push('<section><header><strong>備註</strong><span>可選</span></header><textarea data-action="detail-note" maxlength="80" placeholder="例如：醬汁分開、謝謝">'+escapeHtml(draft.note||'')+'</textarea></section>');
  return rows.join('');
}
function productDetailModal(){
  const {productId,draft}=modal;const p=productMap.get(productId);const missing=[];
  p.required.forEach(group=>{if(group==='drink'){if(!draft.drink)missing.push('飲品');}else if(!draft.options[group])missing.push(group==='rice'?'飯底':group==='sauce'?'醬汁':'小食');});
  const subtotal=p.price*draft.qty;
  return '<aside class="product-detail modal-card"><header class="detail-head">'+imageBlock(p.image,p.name,'detail-image')+'<div><small>'+p.code+'</small><h2>'+p.name+'</h2><strong>'+money(p.price)+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="detail-layout"><div class="detail-options">'+detailGroups(p,draft)+'</div><aside class="detail-control"><div class="qty-row"><span>數量</span><button data-action="detail-qty" data-delta="-1">−</button><strong>'+draft.qty+'</strong><button data-action="detail-qty" data-delta="1">＋</button><button class="keypad-toggle" data-action="toggle-keypad">小鍵盤</button></div><div class="price-summary"><span>單價 <b>'+money(p.price)+'</b></span><span>加購／升級 <b>$0</b></span><strong>小計 <b>'+money(subtotal)+'</b></strong></div>'+(draft.keypad?'<div class="mini-keypad">'+['1','2','3','4','5','6','7','8','9','←','0','完成'].map(key=>'<button data-action="keypad" data-key="'+key+'">'+key+'</button>').join('')+'</div>':'')+'<div class="detail-actions"><button data-action="dismiss-modal">取消</button><button class="primary" data-action="apply-product" '+(missing.length?'disabled':'')+'>'+(modal.editLineId?'確認修改':'加入購物車')+' '+money(subtotal)+'</button></div>'+(missing.length?'<p class="missing-hint">還欠：'+missing.join('、')+'</p>':'')+'</aside></div></aside>';
}
function drinkModifierModal(){
  const d=drinkMap.get(modal.drinkId),draft=modal.draft;
  return '<aside class="modifier-card modal-card"><header><strong>'+d.name+'</strong><button data-action="dismiss-modal">×</button></header><div class="qty-row"><span>修改份數</span><button data-action="modifier-qty" data-delta="-1">−</button><strong>'+draft.qty+'</strong><button data-action="modifier-qty" data-delta="1">＋</button></div>'+(d.sweet?'<section><strong>甜度 <small>不選即正常</small></strong>'+optionButtons('sweetness',['多甜','少甜','走甜'],draft.sweetness||'')+'</section>':'')+(d.ice?'<section><strong>冰量 <small>不選即正常</small></strong>'+optionButtons('ice',['少冰','多冰'],draft.ice||'')+'</section>':'')+'<button class="primary wide" data-action="apply-drink">套用 '+draft.qty+' 份</button></aside>';
}
function bulkOptionModal(){
  const values=optionSets[modal.group]||[];
  const label={rice:'飯底',sauce:'醬汁',snack:'小食'}[modal.group]||'選項';
  return '<aside class="modifier-card modal-card"><header><strong>統一補'+label+'</strong><button data-action="dismiss-modal">×</button></header><section><strong>選擇'+label+' <small>套用到所有未完成項目</small></strong>'+optionButtons('bulk',values,modal.draft.value||'')+'</section><button class="primary wide" data-action="apply-bulk" '+(modal.draft.value?'':'disabled')+'>確認套用</button></aside>';
}
function customConfirm(){
  if(!confirmState)return '';
  return '<div class="confirm-layer"><section class="confirm-card"><strong>'+confirmState.title+'</strong><p>'+confirmState.message+'</p><div><button data-action="confirm-cancel">繼續修改</button><button class="danger" data-action="confirm-discard">放棄修改</button></div></section></div>';
}
function activeModal(){
  if(!modal)return '';
  if(modal.type==='quick')return quickSettingsModal();
  if(modal.type==='settings')return settingsModal();
  if(modal.type==='health')return healthModal();
  if(modal.type==='status')return statusModal();
  if(modal.type==='completion')return completionModal();
  if(modal.type==='product')return productDetailModal();
  if(modal.type==='drink')return drinkModifierModal();
  if(modal.type==='bulk')return bulkOptionModal();
  return '';
}
function render(){
  const state=store.get();const filtered=state.category==='全部'?products:products.filter(p=>p.category===state.category);const template=productTemplate();
  app.innerHTML='<main>'+topbar()+'<section class="workspace"><section class="order-grid"><aside class="cart"><header><h2>購物車（'+state.cart.reduce((n,l)=>n+l.qty,0)+'）</h2><button data-action="clear-cart">清空</button></header><div class="cart-list">'+cartRows()+'</div>'+pendingArea()+'<footer><button data-action="save">暫存</button><button class="primary" data-action="checkout">先處理</button></footer></aside><section class="catalog"><nav class="categories">'+categories.map(cat=>'<button data-action="category" data-value="'+cat+'" class="'+(cat===state.category?'active':'')+'">'+cat+'</button>').join('')+'</nav><div class="products products-'+template+'">'+filtered.map(productCard).join('')+'</div>'+quickDrinks()+'</section>'+pendingPanel()+'</section></section><nav class="bottom-nav"><button class="active">點餐</button><button>訂單</button><button>堂食</button><button>售罄</button><button>更多</button></nav></main>'+modalScrim()+activeModal()+customConfirm()+'<div id="toast" class="toast"></div>';
  document.body.classList.toggle('has-modal',Boolean(modal));
  bindImageFallbacks(app);
}
function markDirty(){if(modal)modal.dirty=true;}
function requestDismiss(){
  if(!modal)return;
  if(modal.dirty&&['product','drink','bulk'].includes(modal.type)){
    confirmState={title:'尚未套用修改',message:'返回後今次選擇將不會保存。',returnModal:modal.type==='drink'&&modal.parent?modal.parent:null};render();return;
  }
  modal=modal.type==='drink'&&modal.parent?modal.parent:null;confirmState=null;render();
}
function openProduct(productId,lineId=''){
  const p=productMap.get(productId),line=lineId?store.get().cart.find(x=>x.lineId===lineId):null;
  modal={type:'product',productId,editLineId:lineId,dirty:false,draft:{qty:line?.qty||1,options:safeClone(line?.options||{}),drink:line?.drinkAssignments?.[0]||null,note:line?.options?.note||'',keypad:false,keypadValue:''}};
  render();
}
function openDrink(drinkId,context,maxQty=1){modal={type:'drink',drinkId,context,maxQty,dirty:false,draft:{qty:1,sweetness:'',ice:''}};render();}
function applyProduct(){
  const editing=Boolean(modal.editLineId);
  const p=productMap.get(modal.productId),d=modal.draft,options={...d.options};if(d.note)options.note=d.note;
  const drinkAssignments=d.drink?Array.from({length:d.qty},()=>safeClone(d.drink)):[];
  const line=makeLine(p.id,d.qty,{options,drinkAssignments,linkedComboId:p.combinable&&d.options.snack&&d.drink?stableId('combo'):'',linkedQty:p.combinable&&d.options.snack&&d.drink?d.qty:0});
  store.set(state=>{
    if(modal.editLineId)state.cart=state.cart.map(item=>item.lineId===modal.editLineId?{...line,lineId:item.lineId,createdOrder:item.createdOrder}:item);
    else state.cart=mergeCart(state.cart.concat(line),state.settings.cart.mergeMode);
    return state;
  });
  modal=null;render();showToast(editing?'已更新產品':'已加入購物車');
}
function applyDrink(){
  const d=drinkSelection(modal.drinkId,modal.draft.sweetness,modal.draft.ice),qty=modal.draft.qty,context=modal.context;
  if(context==='detail'){
    const productModal=modal.parent;productModal.draft.drink=d;productModal.dirty=true;modal=productModal;render();return;
  }
  store.set(state=>{let left=qty;state.cart=state.cart.map(line=>{if(!left)return line;const miss=Math.max(0,line.drinkSlots-line.drinkAssignments.length);const take=Math.min(left,miss);left-=take;return take?{...line,drinkAssignments:line.drinkAssignments.concat(Array.from({length:take},()=>safeClone(d)))}:line;});return state;});
  modal=null;render();showToast('已補選飲品');
}
function handle(button){
  const action=button.dataset.action;
  if(action==='category')store.set(state=>({...state,category:button.dataset.value}));
  else if(action==='open-product')openProduct(button.dataset.id);
  else if(action==='edit-line'){const line=store.get().cart.find(x=>x.lineId===button.dataset.id);if(line)openProduct(line.productId,line.lineId);}
  else if(action==='open-completion'){modal={type:'completion',dirty:false};render();}
  else if(action==='open-quick-settings'){modal={type:'quick',dirty:false};render();}
  else if(action==='open-settings'){modal={type:'settings',dirty:false};render();}
  else if(action==='open-health'){modal={type:'health',dirty:false};render();}
  else if(action==='open-status'){modal={type:'status',dirty:false};render();}
  else if(action==='dismiss-modal')requestDismiss();
  else if(action==='confirm-cancel'){confirmState=null;render();}
  else if(action==='confirm-discard'){modal=confirmState?.returnModal||null;confirmState=null;render();}
  else if(action==='toggle-pending-panel')store.set(state=>({...state,pendingExpanded:!state.pendingExpanded}));
  else if(action==='toggle-quick-mode')store.set(state=>({...state,quickMode:!state.quickMode}));
  else if(action==='quick-display')updateSettings(s=>{s.quickDrinks.showImages=button.dataset.value==='image';});
  else if(action==='toggle-quick-assist')updateSettings(s=>{s.quickDrinks.quickAssist=s.quickDrinks.quickAssist===false;});
  else if(action==='setting-card')updateSettings(s=>{s.catalog.defaultTemplate=button.dataset.value;s.catalog.productOverrides={};});
  else if(action==='toggle-code')updateSettings(s=>{s.catalog.showCode=!s.catalog.showCode;});
  else if(action==='toggle-accepting')store.set(state=>{state.operations.acceptingOrders=!state.operations.acceptingOrders;state.operations.immediateStopped=false;return state;});
  else if(action==='save-close-time'){const v=document.getElementById('scheduled-close')?.value||'';store.set(state=>{state.operations.scheduledClose=v;return state;});showToast('接單時間已更新');}
  else if(action==='immediate-stop')store.set(state=>{state.operations.acceptingOrders=false;state.operations.immediateStopped=true;return state;});
  else if(action==='resume-orders')store.set(state=>{state.operations.acceptingOrders=true;state.operations.immediateStopped=false;state.operations.scheduledClose='';return state;});
  else if(action==='detail-option'){
    markDirty();const g=button.dataset.group,v=button.dataset.value,multi=button.dataset.multi==='true';
    if(modal.type==='drink'){
      if(g==='sweetness')modal.draft.sweetness=modal.draft.sweetness===v?'':v;
      if(g==='ice')modal.draft.ice=modal.draft.ice===v?'':v;
    }else if(modal.type==='bulk'){
      modal.draft.value=modal.draft.value===v?'':v;
    }else if(multi){const arr=modal.draft.options[g]||[];modal.draft.options[g]=arr.includes(v)?arr.filter(x=>x!==v):arr.concat(v);}else modal.draft.options[g]=modal.draft.options[g]===v?'':v;
    render();
  }
  else if(action==='detail-drink'){
    const parent=modal;modal={type:'drink',drinkId:button.dataset.id,context:'detail',maxQty:parent.draft.qty,parent,dirty:false,draft:{qty:parent.draft.qty,sweetness:'',ice:''}};render();
  }
  else if(action==='detail-qty'){markDirty();modal.draft.qty=Math.max(1,modal.draft.qty+Number(button.dataset.delta));render();}
  else if(action==='toggle-keypad'){modal.draft.keypad=!modal.draft.keypad;render();}
  else if(action==='keypad'){
    const key=button.dataset.key;if(key==='完成'){modal.draft.keypad=false;}else if(key==='←'){modal.draft.keypadValue=modal.draft.keypadValue.slice(0,-1);}else modal.draft.keypadValue=(modal.draft.keypadValue+key).replace(/^0+(?=\d)/,'');
    if(modal.draft.keypadValue)modal.draft.qty=Math.max(1,Number(modal.draft.keypadValue));markDirty();render();
  }
  else if(action==='apply-product')applyProduct();
  else if(action==='modifier-qty'){markDirty();modal.draft.qty=Math.max(1,Math.min(modal.maxQty,modal.draft.qty+Number(button.dataset.delta)));render();}
  else if(action==='apply-drink')applyDrink();
  else if(action==='quick-drink'){
    if(store.get().settings.quickDrinks.quickAssist===false){showToast('快捷補選已關閉');return;}
    const missing=pendingSummary(store.get().cart).drink;if(!missing){showToast('目前沒有待補飲品');return;}openDrink(button.dataset.id,'global',missing);
  }
  else if(action==='completion-drink')openDrink(button.dataset.id,'global',pendingSummary(store.get().cart).drink);
  else if(action==='complete-group'){
    const g=button.dataset.group;if(g==='drink'){showToast('請在下方選擇飲品');return;}
    modal={type:'bulk',group:g,dirty:false,draft:{value:''}};render();
  }
  else if(action==='apply-bulk'){
    const g=modal.group,value=modal.draft.value;
    store.set(state=>{state.cart=state.cart.map(line=>line.required.includes(g)&&!line.options[g]?{...line,options:{...line.options,[g]:value}}:line);return state;});
    modal={type:'completion',dirty:false};render();showToast('已統一補選 '+value);
  }
  else if(action==='linkup-all')applyLinkUp(Number(button.dataset.count)||0);
  else if(action==='clear-cart'){if(window.confirm('清空後不可恢復，確定清空整張購物車？'))store.set(state=>({...state,cart:[]}));}
  else if(action==='checkout'){if(pendingSummary(store.get().cart).total){showToast('請先完成必選項目');return;}window.parent?.postMessage?.({type:'morefun:navigate',route:'checkout'},'*');}
}
app.addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(button&&!button.disabled)handle(button);});
app.addEventListener('input',event=>{if(event.target.matches('[data-action="detail-note"]')&&modal?.type==='product'){modal.draft.note=event.target.value;markDirty();}});
render();
