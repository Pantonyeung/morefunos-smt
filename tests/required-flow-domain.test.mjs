import test from 'node:test';
import assert from 'node:assert/strict';
import {buildRequiredTasks,buildRequiredWorkflow,requiredCheckoutGate,requiredTaskId,applyRequiredTaskSelection,clearRequiredTaskSelection} from '../pages/order/required-flow-domain.js';

function line(overrides={}){
  return {
    lineId:'line-1',
    productId:'p1',
    name:'測試餐點',
    qty:1,
    createdOrder:1,
    required:[],
    options:{},
    drinkSlots:0,
    drinkAssignments:[],
    ...overrides
  };
}

test('required tasks follow 飯底 → 醬汁 → 小食 → 飲品 order across cart lines',()=>{
  const cart=[
    line({lineId:'late',createdOrder:20,name:'第二餐',required:['drink'],drinkSlots:1}),
    line({lineId:'early',createdOrder:10,name:'第一餐',required:['snack','rice','sauce','drink'],drinkSlots:1})
  ];
  const tasks=buildRequiredTasks(cart);
  assert.deepEqual(tasks.map(task=>task.group),['rice','sauce','snack','drink','drink']);
  assert.equal(tasks[0].lineId,'early');
  assert.equal(tasks[3].lineId,'early');
  assert.equal(tasks[4].lineId,'late');
});

test('line-level required option reports quantity as one fast task without changing legacy transaction shape',()=>{
  const task=buildRequiredTasks([
    line({lineId:'bento-1',qty:3,required:['rice']})
  ])[0];
  assert.equal(task.scope,'line');
  assert.equal(task.requiredCount,3);
  assert.equal(task.completedCount,0);
  assert.equal(task.remainingCount,3);
  assert.equal(task.status,'pending');
});

test('completed line option marks every unit complete for current line-level semantics',()=>{
  const task=buildRequiredTasks([
    line({lineId:'bento-1',qty:2,required:['rice'],options:{rice:'菜飯'}})
  ])[0];
  assert.equal(task.requiredCount,2);
  assert.equal(task.completedCount,2);
  assert.equal(task.remainingCount,0);
  assert.deepEqual(task.selection,{value:'菜飯'});
});

test('drink task counts exact slots and existing assignments',()=>{
  const task=buildRequiredTasks([
    line({
      lineId:'combo-1',qty:2,required:['drink'],drinkSlots:2,
      drinkAssignments:[{drinkId:'d1',name:'台式奶茶',sweetness:'少甜',ice:'少冰'}]
    })
  ])[0];
  assert.equal(task.scope,'slot');
  assert.equal(task.requiredCount,2);
  assert.equal(task.completedCount,1);
  assert.equal(task.remainingCount,1);
  assert.equal(task.selection[0].name,'台式奶茶');
});

test('optional and link-up data never enter the required task queue',()=>{
  const tasks=buildRequiredTasks([
    line({lineId:'optional-only',required:[],combinable:true,linkRole:'snack'}),
    line({lineId:'required-one',required:['drink'],drinkSlots:1,combinable:true})
  ]);
  assert.deepEqual(tasks.map(task=>task.lineId),['required-one']);
});

test('workflow exposes next task and checkout gate from one truth source',()=>{
  const cart=[
    line({lineId:'bento',required:['rice','drink'],drinkSlots:1,options:{rice:'肉燥飯'}}),
    line({lineId:'salad',createdOrder:2,required:['sauce'],options:{}})
  ];
  const workflow=buildRequiredWorkflow(cart);
  assert.equal(workflow.totalRequired,3);
  assert.equal(workflow.totalCompleted,1);
  assert.equal(workflow.totalRemaining,2);
  assert.equal(workflow.canCheckout,false);
  assert.equal(workflow.nextTask.id,requiredTaskId('salad','sauce'));

  const gate=requiredCheckoutGate(cart);
  assert.deepEqual(gate,{
    blocked:true,
    remainingCount:2,
    focusTaskId:requiredTaskId('salad','sauce'),
    focusLineId:'salad',
    focusGroup:'sauce'
  });
});

test('checkout is allowed only when every required task is complete',()=>{
  const cart=[
    line({lineId:'bento',required:['rice','drink'],drinkSlots:1,options:{rice:'菜飯'},drinkAssignments:[{drinkId:'d1',name:'凍檸茶'}]})
  ];
  const workflow=buildRequiredWorkflow(cart);
  assert.equal(workflow.totalRemaining,0);
  assert.equal(workflow.nextTask,null);
  assert.equal(workflow.canCheckout,true);
  assert.equal(requiredCheckoutGate(cart).blocked,false);
});

test('line-level selection applies through the required domain and advances the workflow',()=>{
  const cart=[line({lineId:'bento',required:['rice','sauce'],options:{}})];
  const afterRice=applyRequiredTaskSelection(cart,requiredTaskId('bento','rice'),{value:'菜飯'});
  assert.equal(afterRice[0].options.rice,'菜飯');
  assert.equal(buildRequiredWorkflow(afterRice).nextTask.group,'sauce');
  assert.equal(cart[0].options.rice,undefined,'domain mutation must not mutate the input cart');
});

test('repeated drink selection fills the next slot and never exceeds drinkSlots',()=>{
  const cart=[line({lineId:'combo',required:['drink'],drinkSlots:2})];
  const taskId=requiredTaskId('combo','drink');
  const first=applyRequiredTaskSelection(cart,taskId,{drinkId:'d1',name:'台式奶茶'});
  const second=applyRequiredTaskSelection(first,taskId,{drinkId:'d2',name:'凍檸茶'});
  const overflow=applyRequiredTaskSelection(second,taskId,{drinkId:'d3',name:'第三杯'});
  assert.deepEqual(second[0].drinkAssignments.map(item=>item.drinkId),['d1','d2']);
  assert.deepEqual(overflow[0].drinkAssignments.map(item=>item.drinkId),['d1','d2']);
  assert.equal(buildRequiredWorkflow(second).canCheckout,true);
});

test('specified drink assignment can replace an existing slot without creating a second data model',()=>{
  const cart=[line({
    lineId:'combo',required:['drink'],drinkSlots:2,
    drinkAssignments:[{drinkId:'d1',name:'台式奶茶'},{drinkId:'d2',name:'凍檸茶'}]
  })];
  const next=applyRequiredTaskSelection(cart,requiredTaskId('combo','drink'),{drinkId:'d3',name:'玄米冷泡茶'},{assignmentIndex:1});
  assert.deepEqual(next[0].drinkAssignments.map(item=>item.drinkId),['d1','d3']);
});

test('clear required selection reopens the same task and checkout gate',()=>{
  const cart=[line({
    lineId:'bento',required:['rice','drink'],drinkSlots:1,
    options:{rice:'肉燥飯'},drinkAssignments:[{drinkId:'d1',name:'台式奶茶'}]
  })];
  const noRice=clearRequiredTaskSelection(cart,requiredTaskId('bento','rice'));
  assert.equal(noRice[0].options.rice,undefined);
  assert.equal(requiredCheckoutGate(noRice).focusGroup,'rice');
  const noDrink=clearRequiredTaskSelection(cart,requiredTaskId('bento','drink'),{assignmentIndex:0});
  assert.equal(noDrink[0].drinkAssignments.length,0);
  assert.equal(requiredCheckoutGate(noDrink).focusGroup,'drink');
});

test('invalid or non-required task selection is a safe no-op',()=>{
  const cart=[line({lineId:'plain',required:[]})];
  assert.strictEqual(applyRequiredTaskSelection(cart,requiredTaskId('plain','rice'),'菜飯'),cart);
  assert.strictEqual(clearRequiredTaskSelection(cart,'missing::drink'),cart);
});
