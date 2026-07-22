import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createOrderIdentity,
  latestOrderDisplayNumber,
  orderBusinessDate,
  orderDisplayNumber
} from '../shared/order-identity.js';

const at=(year,month,day,hour,minute=0,second=0,ms=0)=>new Date(year,month-1,day,hour,minute,second,ms).getTime();

test('每日流水以早上五時為分界並固定三位數',()=>{
  const beforeFive={acceptedAt:at(2026,7,22,4,59),displayOrderNo:'P008',dailySequence:8};
  assert.equal(orderBusinessDate(beforeFive), '2026-07-21');
  const identity=createOrderIdentity([beforeFive],{terminalId:'SMT-01',now:at(2026,7,22,5,1)});
  assert.equal(identity.displayOrderNo,'P001');
  assert.equal(identity.dailySequence,1);
  assert.equal(identity.businessDate,'2026-07-22');
});

test('所有渠道共用同一每日流水並兼容舊 P 編號',()=>{
  const now=at(2026,7,22,14,30);
  const history=[
    {acceptedAt:at(2026,7,22,8),source:'Keeta',displayOrderNo:'P004',dailySequence:4},
    {acceptedAt:at(2026,7,22,9),source:'電話／WhatsApp',id:'P0060'}
  ];
  const identity=createOrderIdentity(history,{terminalId:'smt-01',now});
  assert.equal(identity.displayOrderNo,'P061');
  assert.equal(identity.dailySequence,61);
  assert.match(identity.id,/^MF-20260722-143000000-SMT01-P061$/);
  assert.equal(identity.createdTerminalId,'SMT01');
});

test('每日流水到 P999 後拒絕循環覆蓋',()=>{
  const now=at(2026,7,22,19);
  assert.throws(
    ()=>createOrderIdentity([{acceptedAt:at(2026,7,22,18),displayOrderNo:'P999',dailySequence:999}],{now}),
    /P999/
  );
});

test('顯示號碼支援新舊訂單並按真實時間找最新一張',()=>{
  const history=[
    {id:'MF-OLD',displayOrderNo:'P058',acceptedAt:200},
    {id:'P0057',acceptedAt:100},
    {id:'MF-LATEST',displayOrderNo:'P060',completedAt:400},
    {id:'MF-MIDDLE',displayOrderNo:'P059',acceptedAt:300}
  ];
  assert.equal(orderDisplayNumber(history[0]),'P058');
  assert.equal(orderDisplayNumber(history[1]),'P057');
  assert.equal(orderDisplayNumber({id:'K0061'}),'K0061');
  assert.equal(latestOrderDisplayNumber(history),'P060');
  assert.equal(latestOrderDisplayNumber([]),'—');
});

test('流水營業日及最近訂單以開單時間為準而不受完成時間延遲影響',()=>{
  const beforeFive={id:'P0010',acceptedAt:at(2026,7,22,4,59),completedAt:at(2026,7,22,5,1)};
  const afterFive={id:'MF-NEW',displayOrderNo:'P001',acceptedAt:at(2026,7,22,5,2),completedAt:at(2026,7,22,13)};
  const laterOpened={id:'MF-LATER',displayOrderNo:'P002',acceptedAt:at(2026,7,22,12),completedAt:at(2026,7,22,12,30)};
  assert.equal(orderBusinessDate(beforeFive),'2026-07-21');
  assert.equal(createOrderIdentity([beforeFive],{now:at(2026,7,22,5,2)}).displayOrderNo,'P001');
  assert.equal(latestOrderDisplayNumber([afterFive,laterOpened]),'P002');
});

test('永久編號使用實際日期並在堂食單包含枱號',()=>{
  const now=at(2026,7,23,1,0);
  const identity=createOrderIdentity([],{terminalId:'SMT-01',tableId:'3',now});
  assert.match(identity.id,/^MF-20260723-010000000-SMT01-P001-TABLE3$/);
  assert.equal(identity.businessDate,'2026-07-22');
});
