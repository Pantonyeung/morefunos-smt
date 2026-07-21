import {ORDER_HISTORY_STORAGE_KEY,ORDER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,readJSON,writeJSON} from '../../shared/store.js';
import {normalizeTerminalId,recordCheckoutOperator} from '../../shared/operations.js';
import {money,showToast,escapeHtml} from '../../shared/components.js';
import {checkoutConfig} from './page-config.js';

const app=document.getElementById('app');
const order=readJSON(ORDER_STORAGE_KEY,{cart:[]});
const terminalId=normalizeTerminalId(localStorage.getItem(TERMINAL_ID_STORAGE_KEY)||new URLSearchParams(location.search).get('terminal')||'SMT');
localStorage.setItem(TERMINAL_ID_STORAGE_KEY,terminalId);
let channel='現場外賣',payment='現金付款',received=0,completed=false;
const total=(order.cart||[]).reduce((n,l)=>n+Number(l.total||0),0);

function nextOrderId(history){
  const highest=history.reduce((max,row)=>Math.max(max,Number(String(row?.id||'').replace(/\D/g,''))||0),0);
  return 'P'+String(highest+1).padStart(4,'0');
}
function channelGroup(value){
  if(value==='堂食'||value==='現場外賣')return 'onsite';
  if(value==='磨飯 App'||value==='電話／WhatsApp')return 'owned';
  return 'platform';
}
function completeCheckout(){
  if(completed)return;
  if(!order.cart?.length){showToast('購物籃沒有產品');return;}
  if(received<total){showToast('收款金額不足');return;}
  const history=readJSON(ORDER_HISTORY_STORAGE_KEY,[]);
  const now=Date.now();
  const base={
    id:nextOrderId(history),group:channelGroup(channel),source:channel,acceptedAt:now,
    itemCount:order.cart.reduce((n,line)=>n+Number(line.qty||0),0),amount:total,
    paymentMethod:payment,paymentStatus:'已付款',printStatus:'正常',
    items:order.cart.map(line=>({...line})),cart:order.cart.map(line=>({...line})),
    reusedFromOrderId:order.reuse?.orderId||null,
    audit:[...(order.draftSession?.audit||[]),...(order.reuse?.audit||[])]
  };
  const completedOrder=recordCheckoutOperator(base,terminalId,now);
  writeJSON(ORDER_HISTORY_STORAGE_KEY,[completedOrder,...history]);
  writeJSON(ORDER_STORAGE_KEY,{cart:[],category:'全部',lastCheckout:{orderId:completedOrder.id,checkedOutByTerminalId:terminalId,checkedOutAt:now}});
  completed=true;
  showToast('結帳完成 · '+completedOrder.id+' · '+terminalId);
  setTimeout(()=>parent.postMessage({type:'morefun:navigate',route:'orders'},'*'),500);
}
function render(){
  app.innerHTML=`<div class="app"><header class="topbar"><div class="brand">磨飯 SMT</div><span class="top-btn">操作終端 ${terminalId}</span><div class="spacer"></div><button class="top-btn">快捷金額 ${money(total)}</button><button class="top-btn">● 線上</button></header><main class="checkout"><aside class="checkout-cart panel"><header><h2>購物籃</h2></header><div>${(order.cart||[]).map((l,i)=>`<article><span class="seq">${i+1}</span><span><strong>${escapeHtml(l.name)}</strong><small>x${l.qty}</small></span><b>${money(l.total)}</b></article>`).join('')}</div><button class="btn" data-action="back">返回訂單</button></aside><section class="checkout-main panel"><div class="row five">${checkoutConfig.channels.map(x=>`<button data-action="channel" data-value="${x}" class="${channel===x?'active':''}">${x}</button>`).join('')}</div><div class="row six">${checkoutConfig.payments.map(x=>`<button data-action="payment" data-value="${x}" class="${payment===x?'active':''}">${x}</button>`).join('')}</div><div class="summary"><span>原價 <b>${money(total)}</b></span><span>應付 <b>${money(total)}</b></span><span>已收 <b>${money(received)}</b></span><span>找續 <b>${money(Math.max(0,received-total))}</b></span></div><div class="quick"><button data-action="amount" data-value="${total}">剛好 ${money(total)}</button>${checkoutConfig.quickAmounts.map(v=>`<button data-action="amount" data-value="${v}">$${v}</button>`).join('')}</div><button class="confirm" data-action="confirm" ${completed?'disabled':''}>${completed?'已完成':'確認結帳'}</button></section></main></div><div id="toast" class="toast"></div>`;
  app.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>handle(b));
}
function handle(b){
  const action=b.dataset.action;
  if(action==='back')parent.postMessage({type:'morefun:navigate',route:'order'},'*');
  else if(action==='channel')channel=b.dataset.value;
  else if(action==='payment')payment=b.dataset.value;
  else if(action==='amount')received=Number(b.dataset.value);
  else if(action==='confirm'){completeCheckout();return;}
  render();
}
render();
