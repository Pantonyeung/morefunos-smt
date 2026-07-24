const BUILD='smt-t2s-iphone-adapter.02';
const TARGET_WIDTH=1280;
const TARGET_HEIGHT=800;
const floor=document.getElementById('preview-floor');
const box=document.getElementById('frame-box');
const frame=document.getElementById('t2s-frame');
const detail=document.getElementById('adapter-detail');
let scale=1;
let mode='fit';
let focusMode=false;
let resizeTimer=0;

function viewportSize(){
  const viewport=window.visualViewport;
  return {
    width:Math.round(viewport?.width||window.innerWidth),
    height:Math.round(viewport?.height||window.innerHeight)
  };
}

function clamp(value,min,max){return Math.min(max,Math.max(min,value));}

function availableFloorSize(){
  const rect=floor.getBoundingClientRect();
  const styles=getComputedStyle(floor);
  const horizontalPadding=(Number.parseFloat(styles.paddingLeft)||0)+(Number.parseFloat(styles.paddingRight)||0);
  const verticalPadding=(Number.parseFloat(styles.paddingTop)||0)+(Number.parseFloat(styles.paddingBottom)||0);
  return {
    width:Math.max(220,rect.width-horizontalPadding),
    height:Math.max(220,rect.height-verticalPadding)
  };
}

function fitScale(){
  const available=availableFloorSize();
  return clamp(Math.min(available.width/TARGET_WIDTH,available.height/TARGET_HEIGHT),0.16,1);
}

function applyScale(nextScale,{keepScroll=false}={}){
  const previous=scale||1;
  scale=clamp(nextScale,0.16,1.35);
  const previousLeft=floor.scrollLeft;
  const previousTop=floor.scrollTop;
  const renderedWidth=Math.round(TARGET_WIDTH*scale);
  const renderedHeight=Math.round(TARGET_HEIGHT*scale);
  box.style.width=renderedWidth+'px';
  box.style.height=renderedHeight+'px';
  frame.style.transform='scale('+scale+')';
  const available=availableFloorSize();
  const spareX=Math.max(0,Math.round((available.width-renderedWidth)/2));
  const spareY=Math.max(0,Math.round((available.height-renderedHeight)/2));
  box.style.marginLeft=spareX+'px';
  box.style.marginRight=spareX+'px';
  box.style.marginTop=spareY+'px';
  box.style.marginBottom=spareY+'px';
  if(keepScroll&&previous){
    floor.scrollLeft=Math.round(previousLeft*(scale/previous));
    floor.scrollTop=Math.round(previousTop*(scale/previous));
  }else{
    floor.scrollLeft=0;
    floor.scrollTop=0;
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

function refit(){
  mode='fit';
  requestAnimationFrame(()=>applyScale(fitScale()));
}

function setNative(){mode='manual';applyScale(1,{keepScroll:true});}
function zoom(delta){mode='manual';applyScale(scale+delta,{keepScroll:true});}

function toggleFocus(){
  focusMode=!focusMode;
  document.documentElement.dataset.focus=String(focusMode);
  const button=document.querySelector('[data-action="focus"]');
  if(button)button.textContent=focusMode?'返回':'全屏';
  setTimeout(()=>{if(mode==='fit')refit();else updateDetail();},80);
}

function scheduleLayout(){
  window.clearTimeout(resizeTimer);
  resizeTimer=window.setTimeout(()=>{
    if(mode==='fit')refit();
    else updateDetail();
  },80);
}

window.addEventListener('resize',scheduleLayout,{passive:true});
window.addEventListener('orientationchange',()=>window.setTimeout(scheduleLayout,180),{passive:true});
window.visualViewport?.addEventListener('resize',scheduleLayout,{passive:true});
window.visualViewport?.addEventListener('scroll',scheduleLayout,{passive:true});

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action]');
  if(!button)return;
  const action=button.dataset.action;
  if(action==='fit')refit();
  else if(action==='native')setNative();
  else if(action==='in')zoom(0.08);
  else if(action==='out')zoom(-0.08);
  else if(action==='focus')toggleFocus();
});

frame.addEventListener('load',()=>{
  updateDetail();
  if(mode==='fit')refit();
});

document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible')scheduleLayout();
});

refit();
export {BUILD};
