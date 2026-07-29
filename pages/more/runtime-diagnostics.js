const TEST_ACTION='runtime-self-test';

function getRunner(){
  try{return window.parent?.MoreFunStaff?.runRuntimeSelfTest||null}catch{return null}
}

function ensureStyles(){
  if(document.getElementById('runtime-self-test-styles'))return;
  const style=document.createElement('style');
  style.id='runtime-self-test-styles';
  style.textContent=`
    .runtime-test-panel{margin-top:12px;padding:14px 16px;border:1px solid var(--line,#e8ddd4);border-radius:14px;background:#fff}
    .runtime-test-panel header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}
    .runtime-test-panel h3{margin:0;font-size:16px;font-weight:950;color:var(--text,#382b24)}
    .runtime-test-panel p{margin:0 0 12px;color:var(--muted,#75675e);font-size:12px;line-height:1.5}
    .runtime-test-panel button{min-height:44px;padding:0 18px;border:0;border-radius:10px;background:var(--orange,#ef5b23);color:#fff;font-weight:900;font-size:13px}
    .runtime-test-panel button:disabled{opacity:.55}
    .runtime-test-result{margin-top:12px;padding:12px;border-radius:10px;background:#f8f6f2;font-size:12px;line-height:1.55}
    .runtime-test-result strong{display:block;margin-bottom:6px;font-size:15px}
    .runtime-test-result.ok strong{color:#16784a}.runtime-test-result.bad strong{color:#b53225}
    .runtime-test-items{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 10px;margin-top:8px}
    .runtime-test-items span{display:flex;justify-content:space-between;gap:8px;padding:5px 7px;border-radius:7px;background:#fff}
    .runtime-test-items b{font-weight:900}.runtime-test-items .pass{color:#16784a}.runtime-test-items .fail{color:#b53225}
  `;
  document.head.appendChild(style);
}

function panelMarkup(){
  return `<section class="runtime-test-panel" data-runtime-test-panel>
    <header><h3>Runtime 自測</h3><span>系統與診斷</span></header>
    <p>檢查本機 Queue、冪等處理、失敗重試及 Snapshot 讀寫。測試完成後會還原原有本機資料，不會修改正式訂單。</p>
    <button type="button" data-action="${TEST_ACTION}">開始自測</button>
    <div data-runtime-test-output hidden></div>
  </section>`;
}

function injectPanel(){
  ensureStyles();
  if(document.querySelector('[data-runtime-test-panel]'))return;
  const dialog=document.querySelector('.detail-system .dialog-body, .detail-dialog.detail-system .dialog-body');
  if(!dialog)return;
  dialog.insertAdjacentHTML('beforeend',panelMarkup());
}

function renderReport(output,report){
  const items=(report.results||[]).map(item=>`<span><b>${escapeHtml(item.name)}</b><em class="${item.ok?'pass':'fail'}">${item.ok?'通過':'失敗'}</em></span>`).join('');
  output.hidden=false;
  output.className=`runtime-test-result ${report.ok?'ok':'bad'}`;
  output.innerHTML=`<strong>${report.ok?'✅ 全部通過':'⚠️ 發現失敗項目'}：${report.passed}/${report.total}</strong><div>失敗 ${report.failed} 項｜完成時間 ${new Date(report.finishedAt).toLocaleTimeString('zh-HK')}</div><div class="runtime-test-items">${items}</div>`;
}

function renderError(output,error){
  output.hidden=false;
  output.className='runtime-test-result bad';
  output.innerHTML=`<strong>⚠️ 自測未能執行</strong><div>${escapeHtml(error?.message||String(error))}</div>`;
}

function escapeHtml(value=''){
  return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

async function run(button){
  const output=button.closest('[data-runtime-test-panel]')?.querySelector('[data-runtime-test-output]');
  const runner=getRunner();
  if(!output)return;
  if(!runner){renderError(output,new Error('主系統尚未提供 Runtime 自測服務'));return}
  button.disabled=true;
  button.textContent='測試中…';
  output.hidden=false;
  output.className='runtime-test-result';
  output.innerHTML='<strong>正在執行 8 項檢查…</strong><div>請保持此頁開啟。</div>';
  try{renderReport(output,await runner())}
  catch(error){renderError(output,error)}
  finally{button.disabled=false;button.textContent='重新自測'}
}

document.addEventListener('click',event=>{
  const button=event.target.closest(`[data-action="${TEST_ACTION}"]`);
  if(!button)return;
  event.preventDefault();
  event.stopPropagation();
  run(button);
},true);

new MutationObserver(injectPanel).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectPanel,{once:true});else injectPanel();
