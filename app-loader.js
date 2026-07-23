const BUILD='smt-t2s-iphone-adapter.01';
const TARGET_WIDTH=1280;
const TARGET_HEIGHT=800;
const floor=document.getElementById('preview-floor');
const box=document.getElementById('frame-box');
const frame=document.getElementById('t2s-frame');
const detail=document.getElementById('adapter-detail');
let scale=1;
let mode='fit';

function viewportSize(){
  const viewport=window.visualViewport;
  return {
    width:Math.round(viewport?.width||window.innerWidth),
    height:Math.round(viewport?.height||window.innerHeight)
  };
}

function clamp(value,min,max){return Math.min(max,Math.max(min,value));}

function fitScale(){
  const size=viewportSize();
  const floorTop=Number.parseFloat(getComputedStyle(floor).top)||64;
  const availableWidth=Math.max(220,size.width-36);
  const availableHeight=Math.max(220,size.height-floorTop-36);
  return clamp(Math.min(availableWidth/TARGET_WIDTH,availableHeight/TARGET_HEIGHT),0.18,1);
}

function applyScale(nextScale,{keepScroll=false}={}){
  const previous=scale||1;
  scale=clamp(nextScale,0.18,1.35);
  const previousLeft=floor.scrollLeft;
  const previousTop=floor.scrollTop;
  box.style.width=Math.round(TARGET_WIDTH*scale)+'px';
  box.style.height=Math.round(TARGET_HEIGHT*scale)+'px';
  frame.style.transform='scale('+scale+')';
  const floorWidth=floor.clientWidth;
  const floorHeight=floor.clientHeight;
  const spareX=Math.max(0,Math.round((floorWidth-TARGET_WIDTH*scale-36)/2));
  const spareY=Math.max(0,Math.round((floorHeight-TARGET_HEIGHT*scale-36)/2));
  box.style.marginLeft=spareX+'px';
  box.style.marginRight=spareX+'px';
  box.style.marginTop=spareY+'px';
  box.style.marginBottom=spareY+'px';
  if(keepScroll&&previous){
    floor.scrollLeft=Math.round(previousLeft*(scale/previous));
    floor.scrollTop=Math.round(previousTop*(scale/previous));
  }
  updateDetail();
}

function updateDetail(){
  const size=viewportSize();
  const orientation=size.width>=size.height?'橫屏':'豎屏';
  const renderedWidth=Math.round(TARGET_WIDTH*scale);
  const renderedHeight=Math.round(TARGET_HEIGHT*scale);
  document.documentElement.dataset.orientation=orientation==='橫屏'?'landscape':'portrait';
  detail.textContent=`iPhone ${size.width}×${size.height}｜${orientation}｜黃框=1280×800｜顯示 ${renderedWidth}×${renderedHeight}｜縮放 ${Math.round(scale*100)}%｜${BUILD}`;
}

function refit(){mode='fit';applyScale(fitScale());}

function setNative(){mode='manual';applyScale(1,{keepScroll:true});}
function zoom(delta){mode='manual';applyScale(scale+delta,{keepScroll:true});}

window.addEventListener('resize',()=>{if(mode==='fit')refit();else updateDetail();},{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(()=>{if(mode==='fit')refit();else updateDetail();},160),{passive:true});
window.visualViewport?.addEventListener('resize',()=>{if(mode==='fit')refit();else updateDetail();},{passive:true});

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action]');
  if(!button)return;
  const action=button.dataset.action;
  if(action==='fit')refit();
  else if(action==='native')setNative();
  else if(action==='in')zoom(0.08);
  else if(action==='out')zoom(-0.08);
});

frame.addEventListener('load',()=>updateDetail());
refit();
export {BUILD};
