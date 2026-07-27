export const REQUIRED_GROUP_ORDER=['rice','sauce','snack','drink'];

const GROUP_LABELS={
  rice:'飯底',
  sauce:'醬汁',
  snack:'小食',
  drink:'飲品'
};

function positiveInt(value,fallback=0){
  const number=Number(value);
  if(!Number.isFinite(number))return fallback;
  return Math.max(0,Math.floor(number));
}

export function requiredGroupLabel(group){
  return GROUP_LABELS[group]||String(group||'必選');
}

export function requiredTaskId(lineId,group){
  return `${String(lineId||'line')}::${String(group||'required')}`;
}

function requiredCountForGroup(line,group){
  const qty=Math.max(1,positiveInt(line?.qty,1));
  if(group==='drink')return positiveInt(line?.drinkSlots,0);
  return qty;
}

function completedCountForGroup(line,group,requiredCount){
  if(requiredCount<=0)return 0;
  if(group==='drink'){
    return Math.min(requiredCount,Array.isArray(line?.drinkAssignments)?line.drinkAssignments.length:0);
  }
  return line?.options?.[group]?requiredCount:0;
}

function selectionSnapshot(line,group){
  if(group==='drink'){
    return (Array.isArray(line?.drinkAssignments)?line.drinkAssignments:[]).map((assignment,index)=>({
      index,
      drinkId:assignment?.drinkId||'',
      name:assignment?.name||'',
      sweetness:assignment?.sweetness||'',
      ice:assignment?.ice||''
    }));
  }
  const value=line?.options?.[group];
  return value?{value}:null;
}

function lineOrder(line,index){
  const created=Number(line?.createdOrder);
  return Number.isFinite(created)?created:index;
}

export function buildRequiredTasks(cart=[]){
  const rows=Array.isArray(cart)?cart:[];
  const tasks=[];

  rows.forEach((line,index)=>{
    const requiredGroups=Array.isArray(line?.required)?line.required:[];
    requiredGroups.forEach(group=>{
      const requiredCount=requiredCountForGroup(line,group);
      if(requiredCount<=0)return;
      const completedCount=completedCountForGroup(line,group,requiredCount);
      const remainingCount=Math.max(0,requiredCount-completedCount);
      tasks.push({
        id:requiredTaskId(line?.lineId,group),
        lineId:line?.lineId||'',
        productId:line?.productId||'',
        productName:line?.name||'餐點',
        group,
        label:requiredGroupLabel(group),
        lineQty:Math.max(1,positiveInt(line?.qty,1)),
        requiredCount,
        completedCount,
        remainingCount,
        status:remainingCount===0?'complete':'pending',
        scope:group==='drink'?'slot':'line',
        selection:selectionSnapshot(line,group),
        lineOrder:lineOrder(line,index)
      });
    });
  });

  const groupRank=new Map(REQUIRED_GROUP_ORDER.map((group,index)=>[group,index]));
  return tasks.sort((a,b)=>{
    const aRank=groupRank.has(a.group)?groupRank.get(a.group):REQUIRED_GROUP_ORDER.length;
    const bRank=groupRank.has(b.group)?groupRank.get(b.group):REQUIRED_GROUP_ORDER.length;
    return aRank-bRank||a.lineOrder-b.lineOrder||a.id.localeCompare(b.id);
  });
}

export function buildRequiredWorkflow(cart=[]){
  const tasks=buildRequiredTasks(cart);
  const pendingTasks=tasks.filter(task=>task.remainingCount>0);
  const totalRequired=tasks.reduce((sum,task)=>sum+task.requiredCount,0);
  const totalCompleted=tasks.reduce((sum,task)=>sum+task.completedCount,0);
  const totalRemaining=tasks.reduce((sum,task)=>sum+task.remainingCount,0);

  return {
    tasks,
    pendingTasks,
    nextTask:pendingTasks[0]||null,
    totalRequired,
    totalCompleted,
    totalRemaining,
    canCheckout:totalRemaining===0
  };
}

export function requiredCheckoutGate(cart=[]){
  const workflow=buildRequiredWorkflow(cart);
  return {
    blocked:!workflow.canCheckout,
    remainingCount:workflow.totalRemaining,
    focusTaskId:workflow.nextTask?.id||'',
    focusLineId:workflow.nextTask?.lineId||'',
    focusGroup:workflow.nextTask?.group||''
  };
}

function normalizeDrinkAssignment(selection){
  if(!selection||typeof selection!=='object')return null;
  const drinkId=String(selection.drinkId||selection.productId||selection.id||'').trim();
  const name=String(selection.name||'').trim();
  if(!drinkId&&!name)return null;
  return {
    ...selection,
    drinkId,
    name,
    sweetness:selection.sweetness||'',
    ice:selection.ice||''
  };
}

function taskForId(cart,taskId){
  return buildRequiredTasks(cart).find(task=>task.id===taskId)||null;
}

export function applyRequiredTaskSelection(cart=[],taskId,selection,options={}){
  const rows=Array.isArray(cart)?cart:[];
  const task=taskForId(rows,taskId);
  if(!task)return rows;

  if(task.group!=='drink'){
    const value=typeof selection==='object'&&selection!==null?selection.value:selection;
    if(value===undefined||value===null||String(value).trim()==='')return rows;
    return rows.map(line=>line?.lineId===task.lineId?{
      ...line,
      options:{...(line.options||{}),[task.group]:value}
    }:line);
  }

  const assignment=normalizeDrinkAssignment(selection);
  if(!assignment)return rows;

  return rows.map(line=>{
    if(line?.lineId!==task.lineId)return line;
    const slots=positiveInt(line.drinkSlots,0);
    if(slots<=0)return line;
    const assignments=Array.isArray(line.drinkAssignments)?[...line.drinkAssignments]:[];
    const requestedIndex=Number.isInteger(options.assignmentIndex)?options.assignmentIndex:assignments.length;
    if(requestedIndex<0||requestedIndex>=slots||requestedIndex>assignments.length)return line;
    if(requestedIndex===assignments.length)assignments.push(assignment);
    else assignments[requestedIndex]=assignment;
    return {...line,drinkAssignments:assignments.slice(0,slots)};
  });
}

export function clearRequiredTaskSelection(cart=[],taskId,options={}){
  const rows=Array.isArray(cart)?cart:[];
  const task=taskForId(rows,taskId);
  if(!task)return rows;

  if(task.group!=='drink'){
    return rows.map(line=>{
      if(line?.lineId!==task.lineId)return line;
      const nextOptions={...(line.options||{})};
      delete nextOptions[task.group];
      return {...line,options:nextOptions};
    });
  }

  return rows.map(line=>{
    if(line?.lineId!==task.lineId)return line;
    const assignments=Array.isArray(line.drinkAssignments)?[...line.drinkAssignments]:[];
    if(Number.isInteger(options.assignmentIndex)){
      if(options.assignmentIndex<0||options.assignmentIndex>=assignments.length)return line;
      assignments.splice(options.assignmentIndex,1);
    }else assignments.pop();
    return {...line,drinkAssignments:assignments};
  });
}
