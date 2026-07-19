/* More Fun SMT API boundary — full-port */
'use strict';
window.MoreFunSMTApi={
  async health(){return {api:{ok:false,label:'API',detail:'未連接'},printer:{ok:false,label:'打印機',detail:'未連接'},sync:{ok:false,label:'同步',detail:'等待 API'},backup:{ok:true,label:'備份',detail:'本機資料正常'}};},
  async submitOrder(payload){return {ok:true,mode:'local-demo',orderId:`LOCAL-${Date.now()}`,payload};},
  async saveDraft(payload){return {ok:true,payload};},
  async claimPendingOrder(orderId){return {ok:true,orderId};}
};
