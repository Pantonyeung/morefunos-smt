(()=>{
  const SETTINGS_KEY='morefun:smt:v16c:settings';
  const METRIC_PREFIX='morefun:smt:adaptive-product-metrics:';
  const TARGET_ROWS={large:10/3,small:13/3,text:16/3};
  const FONT_SCALES={small:.92,medium:1,large:1.12};
  const MIN_FONT={small:12,medium:13,large:15};
  let frame=0;

  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const number=value=>Number.isFinite(Number(value))?Number(value):0;
  const viewportKey=()=>`${Math.round(innerWidth)}x${Math.round(innerHeight)}`;
  const root=document.documentElement;

  function readSettings(){
    try{return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')||{};}catch{return {};}
  }

  function applyGlobalScale(){
    const sx=innerWidth/1920;
    const sy=innerHeight/1080;
    root.style.setProperty('--adaptive-page-scale-x',String(sx));
    root.style.setProperty('--adaptive-page-scale-y',String(sy));
    root.style.setProperty('--adaptive-page-scale',String(clamp(Math.min(sx,sy),.68,1.18)));
    root.style.setProperty('--adaptive-viewport-width',`${innerWidth}px`);
    root.style.setProperty('--adaptive-viewport-height',`${innerHeight}px`);

    const settings=readSettings();
    const mode=['small','medium','large'].includes(settings.display?.fontSizeMode)?settings.display.fontSizeMode:'medium';
    root.dataset.readabilityMode=mode;
    root.style.setProperty('--readability-scale',String(FONT_SCALES[mode]));
    root.style.setProperty('--min-readable-font',`${MIN_FONT[mode]}px`);
  }

  function contentMetrics(node){
    const style=getComputedStyle(node);
    const paddingTop=number(parseFloat(style.paddingTop));
    const paddingBottom=number(parseFloat(style.paddingBottom));
    const rect=node.getBoundingClientRect();
    const clippedTop=Math.max(0,rect.top);
    const clippedBottom=Math.min(innerHeight,rect.bottom);
    const visibleBox=Math.max(0,clippedBottom-clippedTop);
    const clientBox=Math.max(0,node.clientHeight);
    const box=Math.min(clientBox||visibleBox,visibleBox||clientBox);
    const height=Math.max(0,box-paddingTop-paddingBottom);
    const gap=number(parseFloat(style.rowGap||style.gap));
    return {height,gap,rect};
  }

  function rowHeight(height,gap,visibleRows){
    const visibleGaps=Math.floor(visibleRows);
    return Math.max(48,(height-(visibleGaps*gap))/visibleRows);
  }

  function calculateProductMetrics(products){
    const {height,gap}=contentMetrics(products);
    if(height<100)return null;
    const metrics={};
    for(const [mode,visibleRows] of Object.entries(TARGET_ROWS)){
      metrics[mode]=rowHeight(height,gap,visibleRows);
    }
    return {metrics,height,gap};
  }

  function writeProductMetrics(metrics,products){
    for(const [mode,row] of Object.entries(metrics)){
      root.style.setProperty(`--adaptive-product-row-${mode}`,`${row}px`);
    }
    if(products){
      const mode=products.classList.contains('products-small')?'small':products.classList.contains('products-text')?'text':'large';
      const row=metrics[mode];
      products.style.gridAutoRows=`${row}px`;
      products.dataset.adaptiveTargetRows=String(TARGET_ROWS[mode]);
      products.dataset.adaptiveRowHeight=row.toFixed(3);
      products.dataset.adaptiveVisibleHeight=contentMetrics(products).height.toFixed(3);
      products.querySelectorAll('.product-card').forEach(card=>{card.style.height=`${row}px`;});
    }
  }

  function saveOrderMetrics(metrics){
    try{localStorage.setItem(METRIC_PREFIX+viewportKey(),JSON.stringify(metrics));}catch{}
  }

  function readOrderMetrics(){
    try{
      const parsed=JSON.parse(localStorage.getItem(METRIC_PREFIX+viewportKey())||'null');
      if(parsed&&Object.keys(TARGET_ROWS).every(key=>Number(parsed[key])>0))return parsed;
    }catch{}
    return null;
  }

  function applyProductArea(){
    const products=document.querySelector('.products');
    if(!products)return;
    const page=document.body.dataset.page;
    if(page==='order'){
      const calculated=calculateProductMetrics(products);
      if(!calculated)return;
      writeProductMetrics(calculated.metrics,products);
      saveOrderMetrics(calculated.metrics);
      root.dataset.adaptiveProductSource='order-live-area';
      return;
    }
    if(page==='soldout'){
      const shared=readOrderMetrics();
      if(shared){
        writeProductMetrics(shared,products);
        root.dataset.adaptiveProductSource='order-shared-metric';
        return;
      }
      const calculated=calculateProductMetrics(products);
      if(!calculated)return;
      writeProductMetrics(calculated.metrics,products);
      root.dataset.adaptiveProductSource='soldout-fallback';
    }
  }

  function applyCartArea(){
    const cart=document.querySelector('.cart');
    if(!cart)return;
    const rect=cart.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const scale=clamp(Math.min(rect.width/610,rect.height/890),.72,1.15);
    root.style.setProperty('--adaptive-cart-scale',String(scale));
    root.style.setProperty('--adaptive-cart-image',`${clamp(72*scale,46,78)}px`);
    root.style.setProperty('--adaptive-cart-gap',`${clamp(11*scale,6,12)}px`);
    root.style.setProperty('--adaptive-cart-pad',`${clamp(13*scale,8,14)}px`);
    root.style.setProperty('--adaptive-cart-control',`${clamp(36*scale,30,40)}px`);
    root.style.setProperty('--adaptive-cart-header-pad',`${clamp(14*scale,8,15)}px`);
    root.style.setProperty('--adaptive-cart-footer-pad',`${clamp(13*scale,8,14)}px`);
    root.style.setProperty('--adaptive-cart-pending-pad',`${clamp(10*scale,6,11)}px`);
    cart.dataset.adaptiveScale=scale.toFixed(4);
  }

  function apply(){
    applyGlobalScale();
    applyProductArea();
    applyCartArea();
  }

  function schedule(){
    if(frame)return;
    frame=requestAnimationFrame(()=>{frame=0;apply();});
  }

  const resizeObserver=new ResizeObserver(schedule);
  resizeObserver.observe(document.documentElement);
  const mutationObserver=new MutationObserver(schedule);
  mutationObserver.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('storage',schedule);
  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  schedule();
})();