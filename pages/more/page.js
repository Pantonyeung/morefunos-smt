import {ORDER_HISTORY_STORAGE_KEY,ORDER_STORAGE_KEY,SETTINGS_STORAGE_KEY,readJSON,writeJSON} from '../../shared/store.js';
import {escapeHtml,showToast} from '../../shared/components.js';

const app=document.getElementById('app');
const MORE_STORAGE_KEY='morefun:smt:v1:more-page';
const saved=readJSON(MORE_STORAGE_KEY,{});
const orders=readJSON(ORDER_HISTORY_STORAGE_KEY,[]);
const orderState=readJSON(ORDER_STORAGE_KEY,{});
const settings=readJSON(SETTINGS_STORAGE_KEY,{});
let detailId='';
let confirmId='';
let reportTab='營運摘要';

const displaySettings={
  quickMode:Boolean(settings.morePage?.quickMode),
  productImages:settings.morePage?.productImages!==false,
  sounds:settings.morePage?.sounds!==false,
  theme:settings.morePage?.theme||'warm',
  ...saved.displaySettings
};

function money(value){return '$'+Math.max(0,Number(value)||0).toLocaleString('zh-HK',{maximumFractionDigits:0});}
function businessStart(now=new Date()){const start=new Date(now);start.setHours(5,0,0,0);if(now<start)start.setDate(start.getDate()-1);return start;}
function businessDateLabel(){return businessStart().toLocaleDateString('zh-HK',{year:'numeric',month:'long',day:'numeric'});}
function todayOrders(){const start=businessStart().getTime(),end=start+86400000;return (Array.isArray(orders)?orders:[]).filter(order=>{const time=Number(order.completedAt||order.createdAt||order.updatedAt||0);return time>=start&&time<end;});}
function netSales(){return todayOrders().reduce((sum,order)=>sum+Number(order.netAmount??order.amount??order.total??0),0);}
function paymentPending(){return todayOrders().filter(order=>/待核實|pending/i.test(String(order.paymentStatus||order.payment||''))).length;}
function outboxCount(){return Array.isArray(orderState.outbox)?orderState.outbox.length:0;}
function themeName(id){return ({warm:'暖米',tea:'焙茶',sprout:'青芽',purple:'紫米',sunset:'夕照',mist:'霧藍'})[id]||'暖米';}
function navigate(route){window.MoreFunPageBridge?.navigate(route);}

const cards=()=>[
  {id:'dayclose',icon:'＄',title:'收銀與日結',desc:'營業摘要、現金核對、支出、差異與版本化日結',tag:'今日未日結',tone:'warn',meta:'營業日 '+businessDateLabel()},
  {id:'reports',icon:'▥',title:'報表與分析',desc:'營運、渠道、商品、付款異常及資料匯出',tag:'淨銷售 '+money(netSales()),tone:'ok',meta:'付款待核實 '+paymentPending()+' 張'},
  {id:'printers',icon:'▧',title:'打印與設備',desc:'五部打印機、路由、測試、重試、補印及改送',tag:'設備狀態：待接通',tone:'bad',meta:'硬件接口尚未接通'},
  {id:'backup',icon:'⇩',title:'備份與恢復',desc:'本機快照、USB 匯出、驗證與安全恢復',tag:'本機資料可用',tone:'ok',meta:'最近完整備份：尚未接通'},
  {id:'display',icon:'◐',title:'顯示與操作',desc:'快速模式、六套主題、工作區比例、圖片與聲音',tag:displaySettings.quickMode?'快速模式':'一般模式',tone:'ok',meta:themeName(displaySettings.theme)+'主題／聲音'+(displaySettings.sounds?'開啟':'關閉')},
  {id:'system',icon:'⚙',title:'系統與更新',desc:'版本、目錄、同步、裝置、更新與操作紀錄',tag:'同步狀態：待接通',tone:'warn',meta:'版本 order-v1-26／待同步 '+outboxCount()}
];

function topbar(){return `<header class="topbar more-topbar"><div class="brand-mark">⌣</div><div class="brand">磨飯 SMT</div><div class="top-divider"></div><span class="receiving"><i></i>接單中</span><div class="serial"><small>訂單號</small><strong>${escapeHtml(String(todayOrders().at(-1)?.id||'—'))}</strong></div><div class="spacer"></div><button class="top-btn" data-action="navigate" data-value="orders">待處理 <span class="badge">${paymentPending()}</span></button><button class="top-btn" data-action="navigate" data-value="soldout">售罄</button><button class="top-btn" data-action="open-detail" data-value="display">快速 <span class="mini-switch ${displaySettings.quickMode?'on':''}"></span></button><button class="top-btn alert" data-action="open-detail" data-value="printers">！設備</button><button class="top-btn" data-action="open-detail" data-value="system">•••</button></header>`;}
function bottomNav(){return `<nav class="bottom-nav"><button data-action="navigate" data-value="order"><span>▣</span>點餐</button><button data-action="navigate" data-value="orders"><span>▤</span>訂單</button><button data-action="navigate" data-value="dine"><span>⌂</span>堂食</button><button data-action="navigate" data-value="soldout"><span>⊗</span>售罄</button><button class="active"><span>•••</span>更多</button></nav>`;}
function mainPage(){return `<main class="app">${topbar()}<section class="workspace more-workspace"><header class="more-heading"><div><h1>更多</h1><p>低頻營運、設備及系統功能。所有正式資料仍以本機為準。</p></div><span>營業日：${businessDateLabel()}　05:00–翌日04:59</span></header><section class="more-grid">${cards().map(card=>`<button class="more-card" data-action="open-detail" data-value="${card.id}"><span class="more-icon">${card.icon}</span><span class="more-copy"><strong>${card.title}</strong><small>${card.desc}</small><span class="card-status"><b class="status-tag ${card.tone}">${card.tag}</b><em>${card.meta}</em></span></span><i>›</i></button>`).join('')}</section></section>${bottomNav()}</main>`;}

function metric(label,value,sub=''){return `<div class="metric"><span>${label}</span><strong>${value}</strong>${sub?`<small>${sub}</small>`:''}</div>`;}
function rows(items){return `<div class="rows">${items.map(item=>`<div class="row"><span><strong>${item[0]}</strong>${item[1]?`<small>${item[1]}</small>`:''}</span>${item[2]||''}</div>`).join('')}</div>`;}
function tag(text,tone=''){return `<b class="status-tag ${tone}">${text}</b>`;}
function panel(title,body){return `<section class="info-panel"><h3>${title}</h3>${body}</section>`;}
function note(copy){return `<div class="notice">${copy}</div>`;}
function toggle(key){return `<button class="toggle ${displaySettings[key]?'on':''}" data-action="toggle-setting" data-value="${key}" aria-pressed="${displaySettings[key]?'true':'false'}"><i></i></button>`;}

function detailContent(id){
  if(id==='dayclose')return `${note('營業日以 05:00–翌日 04:59 計算。打印或同步失敗唔會阻止本機安全保存日結草稿。')}<div class="progress-steps"><b class="active">1　營業摘要</b><b>2　現金／付款／支出</b><b>3　差異處理</b><b>4　確認日結</b></div><div class="metrics">${metric('淨銷售額',money(netSales()))}${metric('現金應有',money(0),'等待正式付款資料層')}${metric('電子付款',money(0),'等待正式付款資料層')}${metric('付款待核實',paymentPending()+' 張')}</div><div class="two-columns">${panel('今日核對摘要',rows([['現金實際點算','尚未輸入',tag('待確認','warn')],['快速支出','未有正式支出資料',''],['差異門檻','淨銷售額 × 3%',tag('待計算','warn')]]))}${panel('版本與安全',rows([['目前狀態','尚未正式日結',tag('草稿','warn')],['安全快照','真實備份接口尚未接通',tag('未接通','bad')],['日結版本','確認後應建立 V1','']]))}</div>`;
  if(id==='reports')return `<div class="tabs">${['營運摘要','銷售分析','付款與異常','商品分析'].map(name=>`<button data-action="report-tab" data-value="${name}" class="${reportTab===name?'active':''}">${name}</button>`).join('')}</div><div class="metrics">${metric('淨銷售額',money(netSales()))}${metric('完成訂單',String(todayOrders().length))}${metric('付款待核實',String(paymentPending()),'未計入已核實電子收款')}${metric('退款／補收','0／0','等待正式付款資料層')}</div><div class="two-columns">${panel('渠道銷售',rows([['現場外賣','從本機正式訂單計算',''],['WhatsApp','從本機正式訂單計算',''],['Web／App','從本機正式訂單計算',''],['Foodpanda／Keeta','平台金額不等於銀行入帳','']]))}${panel('今日提醒',rows([['目前分頁',reportTab,tag('本機','ok')],['比較範圍','上一營業日同一時間',''],['匯出狀態','匯出接口尚未接通',tag('未接通','warn')]]))}</div>`;
  if(id==='printers')return `${note('訂單安全保存後先建立打印工作；打印失敗唔會刪除訂單或阻止營運。')}${panel('五部打印機',`<div class="printer-list">${[['Sunmi T2s','顧客小票｜內置打印機'],['XP-N160II #1','後廚製作單｜網絡'],['XP-N160II #2','打包單｜網絡'],['T271U #1','飯團標籤｜網絡'],['T271U #2','包裝標籤｜網絡']].map(item=>`<div><span><strong>${item[0]}</strong><small>${item[1]}</small></span><em>未有健康資料</em>${tag('硬件尚未接通','bad')}</div>`).join('')}</div>`)}`;
  if(id==='backup')return `${note('核心次序：本機安全備份 → USB → 可選雲端。USB 或雲端失敗唔影響本機營運。')}<div class="metrics">${metric('最近完整備份','尚未接通')}${metric('本機狀態','資料可讀')}${metric('USB 副本','未有紀錄')}${metric('保留策略','7／4／6','每日／每週／每月')}</div><div class="two-columns">${panel('備份操作',rows([['立即建立安全快照','真實備份接口尚未接通',tag('未接通','warn')],['匯出到 USB','需要先驗證裝置及剩餘空間',''],['可選雲端副本','失敗只保留待重試','']]))}${panel('恢復方式',rows([['完整資料恢復','先備份現況，再匯入暫存庫',''],['只恢復設定','顯示、打印路由及裝置設定',''],['安全驗證','Manifest／Checksum／版本',tag('必須','ok')]]))}</div>`;
  if(id==='display')return `<div class="two-columns display-columns">${panel('操作模式',rows([['快速模式','只改資訊密度、按鈕尺寸及動畫',toggle('quickMode')],['產品圖片','產品卡顯示圖片',toggle('productImages')],['操作聲音','新單、錯誤及 35 分鐘提示',toggle('sounds')],['工作區比例','購物車 30%｜商品 70%',tag('30／70')]]))}${panel('六套品牌主題',`<div class="theme-grid">${[['warm','暖米'],['tea','焙茶'],['sprout','青芽'],['purple','紫米'],['sunset','夕照'],['mist','霧藍']].map(item=>`<button data-action="choose-theme" data-value="${item[0]}" class="theme ${displaySettings.theme===item[0]?'active':''}"><i class="${item[0]}"></i>${item[1]}</button>`).join('')}</div>${rows([['主題切換','手動固定於本機設定',tag('手動')]])}`)}</div>${panel('維護入口',rows([['退出全螢幕模式／進入維護','需要二次確認，但不設密碼。','<button class="ghost-danger" data-action="open-confirm" data-value="exit">退出全螢幕模式</button>']]))}`;
  return `<div class="metrics">${metric('應用版本','SMT V1.0')}${metric('網頁核心','order-v1-26')}${metric('產品目錄','最後有效本機版本')}${metric('待同步',String(outboxCount()))}</div><div class="two-columns">${panel('本機與同步',rows([['本機正式資料','最近安全保存由各模組獨立處理',tag('本機','ok')],['網絡狀態','離線時仍可營運',''],['同步佇列',outboxCount()+' 項待同步',tag('待接通','warn')],['正式主機','SMT-01｜唯一主機','']]))}${panel('更新與操作紀錄',rows([['可用更新','更新服務尚未接通',tag('未接通','warn')],['上一有效版本','更新失敗時必須可回退',tag('必須保留','ok')],['操作紀錄','訂單、付款、售罄、打印及日結',''],['裝置授權','等待正式裝置接口','']]))}</div>${note('更新、帳戶、憑證或雲端異常只影響遠端功能，唔會停止本機收銀。')}`;
}

function detailFooter(id){const actions={dayclose:'<button data-action="save-dayclose-draft">儲存日結草稿</button><button class="primary" data-action="open-confirm" data-value="dayclose">進入正式日結確認</button>',reports:'<button data-action="unavailable" data-value="匯出接口尚未接通，未有建立文件">匯出 CSV／USB</button>',printers:'<button data-action="unavailable" data-value="硬件尚未接通，未有送出測試頁">打印測試頁</button><button class="primary" data-action="unavailable" data-value="硬件尚未接通，暫時未能開啟打印工作">查看打印工作／重試</button>',backup:'<button data-action="unavailable" data-value="真實備份接口尚未接通，未有建立備份">建立安全快照</button><button class="ghost-danger" data-action="open-confirm" data-value="restore">進入安全恢復</button>',display:'<button class="primary" data-action="save-display">儲存顯示與操作設定</button>',system:'<button data-action="unavailable" data-value="操作紀錄資料層尚未接通">查看操作紀錄</button><button class="primary" data-action="open-confirm" data-value="update">檢查及準備更新</button>'};return `<button data-action="close-detail">返回</button>${actions[id]}`;}
function detailDialog(){const card=cards().find(item=>item.id===detailId);if(!card)return '';return `<div class="dialog-layer"><div class="dialog-scrim" aria-hidden="true"></div><section class="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title"><header><span class="dialog-icon">${card.icon}</span><div><h2 id="detail-title">${card.title}</h2><p>${card.desc}</p></div><button class="dialog-close" data-action="close-detail" aria-label="關閉">×</button></header><div class="dialog-body">${detailContent(card.id)}</div><footer>${detailFooter(card.id)}</footer></section></div>`;}

const confirms={
  dayclose:{title:'確認正式日結？',copy:'系統應建立 Day Close V1，保存原差額及所有核對資料；唔會修改原訂單。',checks:['本機資料需要先安全保存','所有差異保留原值及原因','日結後自動建立完整本機備份'],button:'確認日結'},
  restore:{title:'進入安全恢復？',copy:'恢復唔會直接覆蓋目前唯一資料庫。系統應先備份現況，再於暫存庫驗證。',checks:['目前資料先建立安全快照','驗證 Manifest、Checksum 及版本','驗證成功後先原子切換'],button:'選擇恢復檔案'},
  update:{title:'準備下載及更新？',copy:'更新係可選操作。下載、驗證或資料遷移失敗，必須回到上一個有效版本。',checks:['先建立完整本機備份','下載完整更新並驗證','暫存執行資料遷移及回退測試'],button:'開始準備更新'},
  exit:{title:'退出全螢幕模式？',copy:'退出後會進入維護畫面，店內同事可以返回收銀；呢個操作需要二次確認但不設鎖。',checks:['未完成訂單與草稿全部保留','背景接單及打印服務繼續','可隨時返回全螢幕收銀'],button:'確認退出'}
};
function confirmDialog(){const data=confirms[confirmId];if(!data)return '';return `<div class="dialog-layer confirm-layer"><div class="dialog-scrim" aria-hidden="true"></div><section class="confirm-dialog" role="alertdialog" aria-modal="true"><div class="confirm-body"><span>!</span><h2>${data.title}</h2><p>${data.copy}</p><div>${data.checks.map(item=>`<b><i>✓</i>${item}</b>`).join('')}</div></div><footer><button data-action="close-confirm">返回</button><button class="${['restore','exit'].includes(confirmId)?'danger':'primary'}" data-action="confirm-action" data-value="${confirmId}">${data.button}</button></footer></section></div>`;}

function render(){app.innerHTML=mainPage()+detailDialog()+confirmDialog()+'<div id="toast" class="toast"></div>';}
function saveDisplay(){const next={...settings,morePage:{...(settings.morePage||{}),...displaySettings}};writeJSON(SETTINGS_STORAGE_KEY,next);writeJSON(MORE_STORAGE_KEY,{...readJSON(MORE_STORAGE_KEY,{}),displaySettings});}
function confirmAction(type){if(type==='exit'){window.parent?.postMessage?.({type:'morefun:exit-fullscreen'},'*');confirmId='';render();showToast('已送出退出全螢幕要求');return;}const messages={dayclose:'正式日結資料層尚未接通，未有寫入正式日結',restore:'真實備份接口尚未接通，未有開啟恢復',update:'更新服務尚未接通，未有下載或安裝'};confirmId='';render();showToast(messages[type]);}
function handle(button){const action=button.dataset.action,value=button.dataset.value;if(action==='navigate')navigate(value);else if(action==='open-detail'){detailId=value;render();}else if(action==='close-detail'){detailId='';render();}else if(action==='report-tab'){reportTab=value;render();}else if(action==='toggle-setting'){displaySettings[value]=!displaySettings[value];render();}else if(action==='choose-theme'){displaySettings.theme=value;render();}else if(action==='save-display'){saveDisplay();render();showToast('顯示與操作設定已儲存於本機');}else if(action==='save-dayclose-draft'){writeJSON(MORE_STORAGE_KEY,{...readJSON(MORE_STORAGE_KEY,{}),dayCloseDraft:{savedAt:Date.now(),businessDate:businessDateLabel()}});showToast('日結草稿已保存；尚未執行正式日結');}else if(action==='unavailable')showToast(value);else if(action==='open-confirm'){confirmId=value;render();}else if(action==='close-confirm'){confirmId='';render();}else if(action==='confirm-action')confirmAction(value);}
app.addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(button)handle(button);});
render();
