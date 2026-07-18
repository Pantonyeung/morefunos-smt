import {
  ORDER_STORAGE_KEY,INCOMING_ORDER_STORAGE_KEY,createInitialCart,getCartTotal,getPendingState,describeLine,quickDrinks,
  normalizeIncomingAppCoupon,returnAppCoupon
} from '../order/page-data-v11.js';

export const WHOLE_ORDER_DISCOUNT_RATES=[95,90,85,80];
export function clampStudentDiscountQuantity(requested,confirmedHeadcount,eligibleCount){return Math.max(0,Math.min(Number(requested)||0,Number(confirmedHeadcount)||0,Number(eligibleCount)||0))}
export function calculateWholeOrderDiscount(subtotal,rate){return Math.round(Number(subtotal||0)*(1-Number(rate||100)/100))}
export function calculateStudentDrinkDiscount(eligibleGroups,selectedCount){let remaining=Math.max(0,Number(selectedCount)||0),amount=0;for(const group of eligibleGroups||[]){const take=Math.min(remaining,Number(group.qty)||0);amount+=take*Number(group.unitPrice||0)*.5;remaining-=take;if(remaining<=0)break}return Math.round(amount)}

if(typeof document!=='undefined')initCheckout();

function initCheckout(){
  const app=document.getElementById('app');
  const clone=value=>JSON.parse(JSON.stringify(value));
  const loadJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}};
  const saved=loadJSON(ORDER_STORAGE_KEY,null);
  const cart=Array.isArray(saved?.cart)?saved.cart:createInitialCart();
  let incomingOrder=loadJSON(INCOMING_ORDER_STORAGE_KEY,null);
  let incomingCoupon=normalizeIncomingAppCoupon(incomingOrder);
  let channel=incomingOrder?.source||'現場外賣';
  let payment=incomingOrder?.payment==='平台已付款'?'平台已付款':'現金付款';
  let received=50;
  let inputBuffer='50';
  let discount=incomingCoupon?{type:'app-coupon',name:incomingCoupon.name,rate:'App 客人已選',amount:incomingCoupon.discountAmount}:{type:'none',name:'未套用',rate:'—',amount:0};
  let modal=null;
  let modalDirty=false;
  let modalSnapshot=null;
  let studentDraft={headcount:0,quantities:{}};
  const subtotal=getCartTotal(cart);
  const money=value=>`$${Math.max(0,Number(value)||0).toFixed(0)}`;
  const drinkMap=new Map(quickDrinks.map(item=>[item.id,item]));
  const due=()=>Math.max(0,subtotal-discount.amount);
  const confirmDiscard=()=>window.confirm('有未儲存改動，確定離開並放棄改動？');
  function openModal(type,{snapshot=null}={}){modal=type;modalDirty=false;modalSnapshot=snapshot?clone(snapshot):null}
  function closeModal({force=false,discard=true}={}){
    if(!force&&modalDirty&&!confirmDiscard())return false;
    if(discard&&modalDirty&&modalSnapshot){studentDraft=clone(modalSnapshot.studentDraft||studentDraft)}
    modal=null;modalDirty=false;modalSnapshot=null;return true;
  }
  function persistIncomingOrder(){
    if(!incomingOrder)return;
    localStorage.setItem(INCOMING_ORDER_STORAGE_KEY,JSON.stringify(incomingOrder));
  }
  function cartRows(){return cart.map(x=>`<article class="cart-row"><img src="${x.image}" alt=""><div><h3>${x.name}</h3><small>${describeLine(x)}</small></div><div class="cart-price">x${x.qty}<br>${money(x.total)}</div></article>`).join('')}
  function top(){return `<header class="topbar"><div class="brand"><span class="logo"></span><span>磨飯 SMT</span></div><div class="serial"><small>流水號</small><strong>10248</strong></div><div class="top-spacer"></div><button class="top-action">待處理 <span class="badge">8</span></button><button class="top-action">快速 <span class="switch on"></span></button><span class="top-action">快捷金額 <strong style="color:var(--orange)">${money(due())}</strong></span><button class="top-action online">● 線上</button></header>`}
  function eligibleStudentGroups(){
    const groups=new Map();
    for(const line of cart){
      if(line.category==='飲品'){
        const key=`line:${line.lineId}`;
        groups.set(key,{key,label:line.name,detail:describeLine(line),qty:line.qty,unitPrice:line.unitPrice});
      }
      for(const assignment of line.drinkAssignments||[]){
        const drink=drinkMap.get(assignment.drinkId);
        const key=`drink:${assignment.drinkId}:${assignment.sweetness||'正常甜'}:${assignment.ice||'正常冰'}`;
        const label=assignment.name||drink?.name||'飲品';
        const detail=[assignment.sweetness,assignment.ice].filter(v=>v&&!v.startsWith('正常')).join(' · ')||'正常設定';
        const current=groups.get(key)||{key,label,detail,qty:0,unitPrice:assignment.unitPrice||drink?.price||0};
        current.qty++;
        groups.set(key,current);
      }
    }
    return [...groups.values()];
  }
  const selectedStudentTotal=()=>Object.values(studentDraft.quantities).reduce((sum,value)=>sum+Number(value||0),0);
  const selectedStudentAmount=()=>Math.round(eligibleStudentGroups().reduce((sum,group)=>sum+Number(studentDraft.quantities[group.key]||0)*group.unitPrice*.5,0));
  function modalShell(content,classes=''){return `<div class="modal-backdrop" data-action="backdrop-close"><section class="modal ${classes}" data-overlay-panel>${content}</section></div>`}
  function appCouponStatus(){
    if(incomingCoupon?.status==='applied'){
      return `<section class="app-coupon-status applied"><div><strong>${incomingCoupon.name}</strong><small>由磨飯 App 客人選擇 · 已自動生效<br>原失效時間：${incomingCoupon.expiresAt||'按 App 記錄'}</small></div><div><b>-${money(incomingCoupon.discountAmount)}</b><button class="btn" data-action="coupon-reject">手動拒絕</button></div></section>`;
    }
    if(incomingCoupon?.status==='returned'){
      return `<section class="app-coupon-status returned"><div><strong>${incomingCoupon.name}</strong><small>已原路退回同一張優惠券；原失效時間不變。</small></div><b>已退回</b></section>`;
    }
    return `<section class="app-coupon-status locked"><div><strong>磨飯優惠券</strong><small>僅由磨飯 App 客人選擇；店員不可手動加入。App 訂單帶券時會直接生效。</small></div><b>App 專屬</b></section>`;
  }
  function discountChooser(){
    const locked=Boolean(incomingCoupon?.status==='applied');
    return modalShell(`<header><h2>優惠方案／折扣</h2><button class="close" data-action="modal-close">×</button></header>${appCouponStatus()}<div class="discount-options"><button class="discount-option" data-action="discount-student-open" ${locked?'disabled':''}><strong>學生優惠</strong><small>${locked?'App 優惠券生效中，先拒絕優惠券才可改用':'按已確認學生人數，選擇合資格飲品份數'}</small></button><button class="discount-option" data-action="discount-whole-open" ${locked?'disabled':''}><strong>整單折扣</strong><small>${locked?'App 優惠券生效中，先拒絕優惠券才可改用':'九五折／九折／八五折／八折'}</small></button></div>`,'discount-modal');
  }
  function studentModal(){
    const groups=eligibleStudentGroups();
    const eligibleCount=groups.reduce((sum,item)=>sum+item.qty,0);
    const selected=selectedStudentTotal();
    return modalShell(`<header><div><h2>學生優惠</h2><small>每位已確認學生最多選擇 1 份合資格飲品</small></div><button class="close" data-action="modal-close">×</button></header><section class="student-headcount"><span><strong>已確認學生人數</strong><small>由店員現場人手確認</small></span><div class="mini-stepper"><button data-action="student-head-minus" ${studentDraft.headcount?'':'disabled'}>−</button><b>${studentDraft.headcount}</b><button data-action="student-head-plus" ${studentDraft.headcount<eligibleCount?'':'disabled'}>＋</button></div></section><div class="student-list">${groups.length?groups.map(group=>{const qty=Number(studentDraft.quantities[group.key]||0);const plusDisabled=qty>=group.qty||selected>=studentDraft.headcount;return `<article><span><strong>${group.label}</strong><small>${group.detail} · 可選 ${group.qty} 份 · 每份半價</small></span><div class="mini-stepper"><button data-action="student-item-minus" data-key="${group.key}" ${qty?'':'disabled'}>−</button><b>${qty}</b><button data-action="student-item-plus" data-key="${group.key}" ${plusDisabled?'disabled':''}>＋</button></div></article>`}).join(''):'<p class="empty-discount">本單沒有合資格飲品。</p>'}</div><footer class="student-footer"><span>已選 ${selected}／${studentDraft.headcount} 份</span><strong>減免 ${money(selectedStudentAmount())}</strong></footer><button class="btn primary" style="width:100%" data-action="student-apply" ${selected?'':'disabled'}>套用學生優惠</button>`,'student-modal');
  }
  function wholeModal(){return modalShell(`<header><div><h2>整單折扣</h2><small>最低八折，不接受低於 80%</small></div><button class="close" data-action="modal-close">×</button></header><div class="rate-grid">${WHOLE_ORDER_DISCOUNT_RATES.map(rate=>`<button data-action="whole-rate" data-value="${rate}"><strong>${rate}%</strong><small>${rate===95?'九五折':rate===90?'九折':rate===85?'八五折':'八折'}</small><em>減免 ${money(calculateWholeOrderDiscount(subtotal,rate))}</em></button>`).join('')}</div>`,'whole-modal')}
  function combinedModal(){return modalShell(`<header><h2>組合付款（最多 2 種）</h2><button class="close" data-action="modal-close">×</button></header><div class="combined-grid"><select data-dirty-input><option>現金付款</option><option>FPS／轉數快</option><option>PayMe</option></select><input data-dirty-input type="number" value="20"><select data-dirty-input><option>PayMe</option><option>AlipayHK</option><option>WeChat Pay HK</option></select><input data-dirty-input type="number" value="${Math.max(0,due()-20)}"></div><button class="btn primary" style="width:100%;margin-top:18px" data-action="combined-apply">確認組合 ${money(due())}</button>`,'combined-modal')}
  function render(){
    const amountDue=due();
    const change=Math.max(0,received-amountDue);
    const pending=getPendingState(cart);
    app.innerHTML=`<div class="app">${top()}<main class="checkout"><aside class="checkout-cart panel"><div class="list">${cartRows()}</div><div class="foot"><button class="return-btn" data-action="return">←　返回訂單</button><button class="discount-entry" data-action="discount-open">🏷　優惠方案／折扣　›</button></div></aside><section class="checkout-right panel"><div class="checkout-label">渠道</div><div class="channel-row">${['現場外賣','電話／WhatsApp','磨飯 App','Foodpanda','Keeta'].map(x=>`<button class="choice ${channel===x?'active':''}" data-action="channel" data-value="${x}">${x}</button>`).join('')}</div><div class="checkout-label">付款方式</div><div class="payment-row">${['現金付款','FPS／轉數快','PayMe','AlipayHK','WeChat Pay HK','組合付款'].map(x=>`<button class="choice ${payment===x?'active':''}" data-action="payment" data-value="${x}">${x}${x==='組合付款'?'<small>最多 2 種</small>':''}</button>`).join('')}</div><div class="summary-strip"><div class="summary-cell"><span>原價</span><strong>${money(subtotal)}</strong></div><div class="summary-cell"><span>優惠／折扣</span><strong class="discount-line">${discount.name}</strong><span class="discount-line">${discount.rate}　-${money(discount.amount)}</span></div><div class="summary-cell"><span>應付金額</span><strong class="orange">${money(amountDue)}</strong></div><div class="summary-cell"><span>已收金額</span><strong>${money(received)}</strong></div><div class="summary-cell"><span>找續金額</span><strong class="orange">${money(change)}</strong></div></div><div class="quick-title"><span>快捷金額</span><small>按一次直接輸入</small></div><div class="quick-amounts"><button class="${received===amountDue?'active':''}" data-action="quick" data-value="${amountDue}">剛好 ${money(amountDue)}</button><button class="${received===20?'active':''}" data-action="quick" data-value="20">$20</button><button class="${received===50?'active':''}" data-action="quick" data-value="50">$50</button><button class="${received===100?'active':''}" data-action="quick" data-value="100">$100</button><button class="${received===500?'active':''}" data-action="quick" data-value="500">$500</button></div><div class="keypad"><button data-action="key" data-value="7">7</button><button data-action="key" data-value="8">8</button><button data-action="key" data-value="9">9</button><button class="delete" data-action="key" data-value="back">⌫</button><button data-action="key" data-value="4">4</button><button data-action="key" data-value="5">5</button><button data-action="key" data-value="6">6</button><button data-action="key" data-value="1">1</button><button data-action="key" data-value="2">2</button><button data-action="key" data-value="3">3</button><button data-action="key" data-value="00">00</button><button data-action="key" data-value="0">0</button><button data-action="key" data-value=".">.</button><button class="clear" data-action="key" data-value="clear">清除</button></div><div class="checkout-bottom"><button class="btn">暫存為草稿</button><textarea placeholder="備註（可不填）"></textarea><button class="confirm" data-action="confirm" ${pending.canCheckout?'':'disabled'}>✓　${pending.canCheckout?'確認結帳':`尚欠 ${pending.requiredMissingCount} 項`}</button></div></section></main></div>${modal==='discount'?discountChooser():modal==='student'?studentModal():modal==='whole'?wholeModal():modal==='combined'?combinedModal():''}<div id="toast" class="toast"></div>`;
    bind();
  }
  function bind(){
    document.querySelectorAll('[data-action]').forEach(element=>element.addEventListener('click',event=>{
      if(element.dataset.action==='backdrop-close'&&event.target!==element)return;
      event.preventDefault();event.stopPropagation();handle(element);
    }));
    document.querySelectorAll('[data-dirty-input]').forEach(element=>element.addEventListener('change',()=>{modalDirty=true}));
  }
  function handle(button){
    const action=button.dataset.action;
    if(action==='backdrop-close'||action==='modal-close')closeModal();
    if(action==='return'){window.MoreFunPageBridge.navigate('order');return}
    if(action==='channel')channel=button.dataset.value;
    if(action==='payment'){payment=button.dataset.value;if(payment==='組合付款')openModal('combined')}
    if(action==='quick'){received=Number(button.dataset.value);inputBuffer=String(received)}
    if(action==='key'){
      const key=button.dataset.value;
      if(key==='clear')inputBuffer='0';
      else if(key==='back')inputBuffer=inputBuffer.slice(0,-1)||'0';
      else if(key!=='.')inputBuffer=(inputBuffer==='0'?'':inputBuffer)+key;
      received=Number(inputBuffer)||0;
    }
    if(action==='discount-open')openModal('discount');
    if(action==='discount-student-open'){
      const eligible=eligibleStudentGroups().reduce((sum,item)=>sum+item.qty,0);
      studentDraft={headcount:Math.min(1,eligible),quantities:{}};
      openModal('student',{snapshot:{studentDraft}});
    }
    if(action==='discount-whole-open')openModal('whole');
    if(action==='student-head-plus'){const eligible=eligibleStudentGroups().reduce((sum,item)=>sum+item.qty,0);studentDraft.headcount=Math.min(eligible,studentDraft.headcount+1);modalDirty=true}
    if(action==='student-head-minus'){
      studentDraft.headcount=Math.max(0,studentDraft.headcount-1);
      let overflow=Math.max(0,selectedStudentTotal()-studentDraft.headcount);
      if(overflow){for(const key of Object.keys(studentDraft.quantities).reverse()){const take=Math.min(overflow,studentDraft.quantities[key]);studentDraft.quantities[key]-=take;overflow-=take;if(!overflow)break}}
      modalDirty=true;
    }
    if(action==='student-item-plus'){
      const group=eligibleStudentGroups().find(item=>item.key===button.dataset.key);
      const current=Number(studentDraft.quantities[group.key]||0);
      const allowed=clampStudentDiscountQuantity(current+1,studentDraft.headcount,group.qty);
      if(selectedStudentTotal()<studentDraft.headcount)studentDraft.quantities[group.key]=allowed;
      modalDirty=true;
    }
    if(action==='student-item-minus'){const key=button.dataset.key;studentDraft.quantities[key]=Math.max(0,Number(studentDraft.quantities[key]||0)-1);modalDirty=true}
    if(action==='student-apply'){const selected=selectedStudentTotal();discount={type:'student',name:`學生優惠 ${selected} 份`,rate:'合資格飲品半價',amount:selectedStudentAmount()};closeModal({force:true,discard:false})}
    if(action==='whole-rate'){const rate=Number(button.dataset.value);discount={type:'whole',name:'整單折扣',rate:`${rate}%`,amount:calculateWholeOrderDiscount(subtotal,rate)};closeModal({force:true,discard:false})}
    if(action==='combined-apply')closeModal({force:true,discard:false});
    if(action==='coupon-reject'){
      if(window.confirm('確定拒絕此 App 優惠券？優惠券會原路退回，原失效時間不變。')){
        incomingCoupon=returnAppCoupon(incomingCoupon,'staff_rejected');
        incomingOrder={...(incomingOrder||{}),coupon:{...(incomingOrder?.coupon||{}),status:'returned',returnedAt:incomingCoupon.returnedAt,expiresAt:incomingCoupon.expiresAt}};
        discount={type:'none',name:'優惠券已退回',rate:'原失效時間不變',amount:0};
        persistIncomingOrder();
        closeModal({force:true,discard:false});
      }
    }
    if(action==='confirm')showToast(getPendingState(cart).canCheckout?'結帳完成':'請先完成待補項目');
    render();
  }
  function showToast(text){const toast=document.getElementById('toast');if(!toast)return;toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1500)}
  render();
}
