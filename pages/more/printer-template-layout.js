const n=value=>Number.isFinite(Number(value))?Number(value):0;
const text=value=>String(value??'');

export function printerDotsPerMm(printer={}){
  const explicit=n(printer?.driver?.dotsPerMm||printer?.dotsPerMm);
  return explicit>0?explicit:8;
}

function charUnits(char){
  // CJK/full-width characters consume roughly two latin units in the layout plan.
  return /[\u2e80-\u9fff\uf900-\ufaff\uff01-\uff60]/u.test(char)?2:1;
}

export function wrapPrintText(value,maxUnits){
  const limit=Math.max(2,Math.floor(n(maxUnits)||2));
  const source=text(value);
  if(!source)return [''];
  const rows=[];
  for(const rawLine of source.split(/\r?\n/)){
    let row='',units=0;
    for(const char of rawLine){
      const width=charUnits(char);
      if(row&&units+width>limit){rows.push(row);row='';units=0;}
      row+=char;units+=width;
    }
    rows.push(row);
  }
  return rows;
}

export function buildPrintLayoutPlan(document={},printer={},options={}){
  const media=printer?.media||{};
  const dotsPerMm=printerDotsPerMm(printer);
  const widthMm=Math.max(20,n(media.widthMm||document.paperWidth||80));
  const heightMm=media.kind==='label'?Math.max(10,n(media.heightMm||30)):0;
  const widthDots=Math.max(1,Math.floor(widthMm*dotsPerMm));
  const fixedHeightDots=heightMm?Math.max(1,Math.floor(heightMm*dotsPerMm)):0;
  const marginDots=Math.max(4,Math.floor(n(options.marginMm||2)*dotsPerMm));
  const bodyFontDots=Math.max(16,Math.floor(n(options.bodyFontMm||3.2)*dotsPerMm));
  const lineGapDots=Math.max(2,Math.floor(n(options.lineGapMm||0.8)*dotsPerMm));
  const lineHeightDots=bodyFontDots+lineGapDots;
  const usableWidthDots=Math.max(1,widthDots-marginDots*2);
  const approxLatinCharDots=Math.max(6,Math.floor(bodyFontDots*.56));
  const maxUnits=Math.max(2,Math.floor(usableWidthDots/approxLatinCharDots));
  const sourceLines=Array.isArray(document.lines)?document.lines:text(document.text).split(/\r?\n/);
  const lines=sourceLines.flatMap(line=>wrapPrintText(line,maxUnits));
  const contentHeightDots=marginDots*2+Math.max(1,lines.length)*lineHeightDots;
  const heightDots=fixedHeightDots||contentHeightDots;
  return {
    contract:'morefun.print.layout.v1',
    documentType:text(document.documentType),templateId:text(document.templateId),templateVersion:n(document.templateVersion),
    media:{kind:media.kind==='label'?'label':'roll',widthMm,heightMm},dotsPerMm,widthDots,heightDots,
    marginDots,usableWidthDots,bodyFontDots,lineHeightDots,maxUnits,
    lines:lines.map((value,index)=>({index,text:value,x:marginDots,y:marginDots+index*lineHeightDots,align:'left'})),
    overflow:fixedHeightDots>0&&contentHeightDots>fixedHeightDots
  };
}

export function validatePrintLayoutPlan(plan={}){
  const errors=[];
  if(plan.contract!=='morefun.print.layout.v1')errors.push('Layout contract 不支援');
  if(!Number.isInteger(plan.widthDots)||plan.widthDots<1)errors.push('打印寬度無效');
  if(!Number.isInteger(plan.heightDots)||plan.heightDots<1)errors.push('打印高度無效');
  if(!Array.isArray(plan.lines)||!plan.lines.length)errors.push('打印內容為空');
  if(plan.overflow)errors.push('打印內容超出固定標籤高度');
  return {ok:errors.length===0,errors};
}
