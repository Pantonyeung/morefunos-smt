import {runAllRuntimeDiagnostics} from '../../shared/runtime-diagnostics.js';
import {getRuntimeStatus} from '../../shared/runtime-status.js';
import {ensureOfflineSurvival,getOfflineSurvivalStatus,refreshOfflineAssets,flushOfflineJournal,getOfflineSyncState} from '../../shared/offline-survival.js';
import {getOfflineJournalStatus,exportOfflineJournal,recoverDurableStorageFromJournal} from '../../shared/offline-journal.js';
import {getStorageHealth} from '../../shared/storage-health.js';
import {runOfflineEnduranceSelfTest} from '../../shared/offline-endurance-self-test.js';

const app=document.getElementById('app');
let busy=false;

function fmt(value){return value?new Date(value).toLocaleString('zh-HK'):'未建立';}
function downloadJson(filename,value){const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}

async function model(){
  const runtime=getRuntimeStatus();
  const [offline,journal,storage]=await Promise.all([getOfflineSurvivalStatus(),getOfflineJournalStatus().catch(()=>({ready:false,count:0,unsynced:0})),getStorageHealth()]);
  return {runtime,offline,journal,storage,sync:getOfflineSyncState()};
}

async function inject(){
  const body=app?.querySelector('.detail-system .dialog-body');
  if(!body||body.querySelector('[data-runtime-hook]'))return;
  const {runtime,offline,journal,storage,sync}=await model();
  const section=document.createElement('section');
  section.className='info-panel';
  section.dataset.runtimeHook='1';
  section.innerHTML=`<h3>離線生存與 Runtime</h3><div class="row"><span><strong>Runtime</strong><small>${runtime.mode}｜版本 ${runtime.runtimeVersion}｜待傳 ${runtime.queuedWrites}</small></span><b class="status-tag ${runtime.ready?'ok':'warn'}">${runtime.ready?'可用':'未啟動'}</b></div><div class="row"><span><strong>完整離線資料包</strong><small>最近保存：${fmt(offline.createdAt)}｜來源 ${offline.source}</small></span><b class="status-tag ${offline.ready?'ok':'warn'}">${offline.ready?'已保存':'未建立'}</b></div><div class="row"><span><strong>離線寫入 Journal</strong><small>${journal.count||0} 項紀錄｜未補傳 ${journal.unsynced||0}｜最近 ${fmt(journal.lastWriteAt)}</small></span><b class="status-tag ${journal.ready?'ok':'warn'}">${journal.ready?'運作中':'未啟動'}</b></div><div class="row"><span><strong>Journal 補傳</strong><small>${sync.adapterMode||'未接 Adapter'}｜最近成功 ${fmt(sync.lastSuccessAt)}${sync.lastError?'｜'+sync.lastError:''}</small></span><b class="status-tag ${['synced','idle'].includes(sync.status)?'ok':'warn'}">${sync.status}</b></div><div class="row"><span><strong>本機儲存</strong><small>${storage.usageMb} MB／${storage.quotaMb} MB｜${storage.percent}%｜持久化 ${storage.persisted?'已批准':'未確認'}</small></span><b class="status-tag ${storage.level==='ok'?'ok':'warn'}">${storage.level==='critical'?'容量危險':storage.level==='warning'?'容量偏高':'正常'}</b></div><div class="row"><span><strong>離線開機資源</strong><small>Service Worker：${offline.serviceWorker?'已註冊':'未註冊'}</small></span><b class="status-tag ${offline.longRunReady?'ok':'warn'}">${offline.longRunReady?'長時間離線準備完成':'仍需準備'}</b></div><div class="button-row"><button data-runtime-action="refresh-offline">更新離線資料</button><button data-runtime-action="flush-journal">重試補傳</button><button data-runtime-action="export-journal">匯出 Journal</button><button data-runtime-action="recover-journal">人工復原長期資料</button><button data-runtime-action="endurance">離線耐久自檢</button><button class="primary" data-runtime-action="diagnostics">Runtime 完整自檢</button></div><pre data-runtime-result hidden style="white-space:pre-wrap;max-height:220px;overflow:auto"></pre>`;
  body.prepend(section);
}

async function run(action,button){
  if(busy)return;busy=true;button.disabled=true;
  const output=app.querySelector('[data-runtime-result]');
  try{
    if(action==='diagnostics'){
      const report=await runAllRuntimeDiagnostics();
      output.hidden=false;output.textContent=`Runtime 自檢：${report.ok?'PASS':'FAIL'}\n通過 ${report.passed}/${report.total}\n${JSON.stringify(report,null,2)}`;
    }
    if(action==='endurance'){
      const report=await runOfflineEnduranceSelfTest();
      output.hidden=false;output.textContent=`離線耐久自檢：${report.ok?'PASS':'FAIL'}\n通過 ${report.passed}/${report.total}\n${JSON.stringify(report,null,2)}`;
    }
    if(action==='refresh-offline'){
      const result=await ensureOfflineSurvival({force:true});
      await refreshOfflineAssets();
      output.hidden=false;output.textContent=result.ok?'完整離線資料及介面快取已更新。':'更新失敗：'+result.error;
    }
    if(action==='flush-journal'){
      const state=await flushOfflineJournal();
      output.hidden=false;output.textContent=`Journal 補傳狀態：${state.status}\n待處理：${state.pending}\n${state.lastError||''}`;
    }
    if(action==='export-journal'){
      const journal=await exportOfflineJournal();
      downloadJson(`morefun-offline-journal-${Date.now()}.json`,journal);
      output.hidden=false;output.textContent=`已匯出 ${journal.entries.length} 項 Journal 紀錄。`;
    }
    if(action==='recover-journal'){
      const result=await recoverDurableStorageFromJournal({force:true});
      output.hidden=false;output.textContent=`人工復原完成：${result.count} 個長期資料區。\n${result.keys.join('\n')}`;
    }
  }catch(error){output.hidden=false;output.textContent='操作失敗：'+String(error?.message||error);}
  finally{busy=false;button.disabled=false;}
}

app?.addEventListener('click',event=>{const button=event.target.closest('[data-runtime-action]');if(button)void run(button.dataset.runtimeAction,button);},true);
new MutationObserver(()=>void inject()).observe(app,{childList:true,subtree:true});
window.addEventListener('morefun:offline-survival-ready',()=>void inject());
void inject();
