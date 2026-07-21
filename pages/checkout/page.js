import {ORDER_HISTORY_STORAGE_KEY,ORDER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,readJSON,writeJSON} from '../../shared/store.js';
import {normalizeTerminalId} from '../../shared/operations.js';
import {money,showToast,escapeHtml} from '../../shared/components.js';
import {applyCheckoutDiscount,buildCheckoutRecord,enterKeypadValue} from './checkout-domain.js';
import {checkoutConfig} from './page-config.js';

const app=document.getElementById('app');
const order=readJSON(ORDER_STORAGE_KEY,{cart:[]});
const terminalId=normalizeTerminalId(localStorage.getItem(TERMINAL_ID_STORAGE_KEY)||new URLSearchParams(location.search).get('terminal')||'SMT');
localStorage.setItem(TERMINAL_ID_STORAGE_KEY,terminalId);
let channel='現場外賣',payment='現金付款',receivedInput='',completed=false,discount={type:'none'},discountPanel=false,keypadTarget='received';

function nextOrderId(history){
  const highest=history.reduce((max,row)=>Math.max(max,Number(String(row?.id||'').replace(/\D/g,''))||0),0);
  return 'P'+String(highest+1).padStart(4,'0');
}
function pricing(){
  try{return applyCheckoutDiscount(order.cart,discount,channel);}catch(error){return {...applyCheckoutDiscount(order.cart,{type:'none'},channel),error:error.message};}
}
function discountLabel(result){
  if(discount.type==='student')return `學生優惠 · ${result.appliedUnits} 份`;
  if(discount.type==='group')return `團體整單折扣 · ${Number(discount.percent)||0}%`;
  return '選擇優惠';
}
function completeCheckout(){
  if(completed)return;
  if(!order.cart?.length){showToast('購物籃沒有產品');return;}
  const result=pricing();
  if(result.error){showToast(result.error);return;}
  const received=Number(receivedInput)||0;
  if(received<result.payable){showToast('收款金額不足');return;}
  const history=readJSON(ORDER_HISTORY_STORAGE_KEY,[]);
  const now=Date.now();
  const completedOrder=buildCheckoutRecord({
    id:nextOrderId(history),cart:order.cart,channel,payment,pricing:result,discount,terminalId,now,
    audit:[...(order.draftSession?.audit||[]),...(order.reuse?.audit||[])],
  });
  completedOrder.reusedFromOrderId=order.reuse?.orderId||null;
  writeJSON(ORDER_HISTORY_STORAGE_KEY,[completedOrder,...history]);
  writeJSON(ORDER_STORAGE_KEY,{cart:[],category:'全部',lastCheckout:{orderId:completedOrder.id,checkedOutByTerminalId:terminalId,checkedOutAt:now}});
  completed=true;
  showToast('結帳完成 · '+completedOrder.id+' · '+terminalId);
  setTimeout(()=>parent.postMessage({type:'morefun:navigate',route:'orders'},'*'),500);
}
function keypad(){
  return `<section class="keypad" aria-label="數字鍵盤">${['7','8','9','4','5','6','1','2','3','00','0'].map(key=>`<button data-action="keypad" data-key="${key}">${key}</button>`).join('')}<button data-action="keypad" data-key="backspace" aria-label="退格">⌫</button><button class="clear-key" data-action="keypad" data-key="clear">清除</button></section>`;
}
function discountCard(result){
  if(!discountPanel)return '';
  const platform=channel==='Keeta'||channel==='Foodpanda';
  return `<div class="modal-scrim"><section class="discount-card panel"><header><div><small>同一時間只可使用一種</small><h2>優惠</h2></div><button data-action="discount-close">×</button></header>${platform?'<p class="notice">平台訂單不可使用本店優惠。</p>':`<div class="discount-options"><button data-action="discount-type" data-value="none" class="${discount.type==='none'?'active':''}"><strong>不使用優惠</strong><small>按原價結帳</small></button><button data-action="discount-type" data-value="student" class="${discount.type==='student'?'active':''}"><strong>學生優惠</strong><small>輸入現場已核實學生人數</small></button><button data-action="discount-type" data-value="group" class="${discount.type==='group'?'active':''}"><strong>團體整單折扣</strong><small>${channel==='堂食'?'堂食不可使用':'輸入整單折扣百分比'}</small></button></div>${discount.type==='student'?`<button class="discount-input" data-action="keypad-target" data-value="student"><span>學生優惠份數</span><b>${Number(discount.studentCount)||0} 份</b></button>`:''}${discount.type==='group'?`<button class="discount-input" data-action="keypad-target" data-value="group" ${channel==='堂食'?'disabled':''}><span>整單折扣</span><b>${Number(discount.percent)||0}%</b></button>`:''}`}<footer><span>折扣 ${money(result.discountAmount)}　應付 ${money(result.payable)}</span><button data-action="discount-close">套用優惠</button></footer></section></div>`;
}
function render(){
  const result=pricing();
  const received=Number(receivedInput)||0;
  app.innerHTML=`<div class="app"><header class="topbar statusbar"><div class="brand">磨飯 SMT</div><span class="status-item">操作終端 ${terminalId}</span><div class="spacer"></div><span class="status-item">● 線上</span></header><main class="checkout"><aside class="checkout-cart panel"><header><h2>訂單詳情</h2><span>${(order.cart||[]).reduce((n,line)=>n+Number(line.qty||0),0)} 件</span></header><div class="cart-lines">${(order.cart||[]).map((line,index)=>`<article><span class="seq">${index+1}</span><span><strong>${escapeHtml(line.name)}</strong><small>x${line.qty}</small></span><b>${money(line.total)}</b></article>`).join('')}</div><div class="detail-actions"><button data-action="back">返回訂單</button><button data-action="discount-open" class="${discount.type!=='none'?'active':''}"><span>優惠</span><small>${discountLabel(result)}</small></button></div></aside><section class="checkout-main panel"><div class="row five">${checkoutConfig.channels.map(value=>`<button data-action="channel" data-value="${value}" class="${channel===value?'active':''}">${value}</button>`).join('')}</div><div class="row six">${checkoutConfig.payments.map(value=>`<button data-action="payment" data-value="${value}" class="${payment===value?'active':''}">${value}</button>`).join('')}</div><div class="summary"><span>原價 <b>${money(result.subtotal)}</b></span><span>優惠 <b>-${money(result.discountAmount)}</b></span><span>應付 <b>${money(result.payable)}</b></span><span>已收 <b>${money(received)}</b></span><span>找續 <b>${money(Math.max(0,received-result.payable))}</b></span></div><div class="cash-area"><div class="cash-entry"><label>收款金額</label><button class="received-display ${keypadTarget==='received'?'active':''}" data-action="keypad-target" data-value="received">${receivedInput?money(received):'請輸入金額'}</button><div class="quick"><button data-action="amount" data-value="${result.payable}">剛剛好 ${money(result.payable)}</button>${checkoutConfig.quickAmounts.map(value=>`<button data-action="amount" data-value="${value}">$${value}</button>`).join('')}</div></div>${keypad()}</div><button class="confirm" data-action="confirm" ${completed?'disabled':''}>${completed?'已完成':'確認結帳 '+money(result.payable)}</button></section></main></div>${discountCard(result)}<div id="toast" class="toast"></div>`;
  app.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>handle(button));
}
function handle(button){
  const action=button.dataset.action;
  if(action==='back')parent.postMessage({type:'morefun:navigate',route:'order'},'*');
  else if(action==='channel'){
    channel=button.dataset.value;
    if((channel==='Keeta'||channel==='Foodpanda')&&discount.type!=='none'){discount={type:'none'};showToast('平台訂單已移除本店優惠');}
    if(channel==='堂食'&&discount.type==='group'){discount={type:'none'};showToast('堂食不提供團體優惠');}
  }else if(action==='payment')payment=button.dataset.value;
  else if(action==='amount'){receivedInput=String(Number(button.dataset.value)||0);keypadTarget='received';}
  else if(action==='discount-open')discountPanel=true;
  else if(action==='discount-close')discountPanel=false;
  else if(action==='discount-type'){
    const type=button.dataset.value;
    if(type==='group'&&channel==='堂食'){showToast('堂食不提供團體優惠');return;}
    discount=type==='student'?{type,studentCount:0}:type==='group'?{type,percent:0}:{type:'none'};
    keypadTarget=type==='student'?'student':type==='group'?'group':'received';
  }else if(action==='keypad-target')keypadTarget=button.dataset.value;
  else if(action==='keypad'){
    const key=button.dataset.key;
    if(keypadTarget==='student')discount={...discount,studentCount:Math.floor(Number(enterKeypadValue(String(discount.studentCount||''),key))||0)};
    else if(keypadTarget==='group')discount={...discount,percent:Math.min(100,Number(enterKeypadValue(String(discount.percent||''),key))||0)};
    else receivedInput=enterKeypadValue(receivedInput,key);
  }else if(action==='confirm'){completeCheckout();return;}
  render();
}
render();
