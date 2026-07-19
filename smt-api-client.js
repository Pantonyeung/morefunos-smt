/* More Fun SMT API client baseline — stable integration boundary */
'use strict';
window.MoreFunSMTApi={
  async health(){return {ok:true,mode:'local',version:'16.1-5root'};},
  async submitOrder(order){return {ok:true,orderId:`LOCAL-${Date.now()}`,order};},
  async syncPush(payload){return {ok:true,accepted:Array.isArray(payload)?payload.length:1};},
  async syncPull(){return {ok:true,items:[],cursor:null};}
};
