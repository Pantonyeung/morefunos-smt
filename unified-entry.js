const hint=document.getElementById('device-hint');
const cards=[...document.querySelectorAll('.mode-card')];

function classify(width,height){
  const orientation=width>=height?'橫屏':'豎屏';
  const isMobile=width<760||/iPhone|Android.+Mobile|Mobile/i.test(navigator.userAgent);
  const isTablet=width>=760&&width<1180;
  const isWide=width>=1180||orientation==='橫屏';
  if(isMobile&&orientation==='豎屏')return {device:'mobile',orientation,label:'手機豎屏',recommended:['smm','preview'],text:'手機：建議先睇 SMM，亦可開 SMT 黃框檢查比例'};
  if(isMobile&&orientation==='橫屏')return {device:'mobile',orientation,label:'手機橫屏',recommended:['preview','smm'],text:'手機橫屏：建議先睇 SMT 黃框，再睇 SMM'};
  if(isTablet)return {device:'tablet',orientation,label:'平板 / iPad',recommended:['preview','smt'],text:'平板：建議先睇 SMT 黃框，再開 SMT 真機頁'};
  if(isWide)return {device:'wide',orientation,label:'電腦 / 收銀機橫屏',recommended:['smt'],text:'電腦／收銀機：建議直接開 SMT 真機頁'};
  return {device:'unknown',orientation,label:'未知裝置',recommended:['smt','preview','smm'],text:'可手動選擇任何入口'};
}

function updateHint(){
  const viewport=window.visualViewport;
  const width=Math.round(viewport?.width||innerWidth);
  const height=Math.round(viewport?.height||innerHeight);
  const info=classify(width,height);
  document.documentElement.dataset.device=info.device;
  document.documentElement.dataset.orientation=info.orientation==='橫屏'?'landscape':'portrait';
  cards.forEach(card=>card.classList.toggle('is-recommended',info.recommended.includes(card.dataset.mode)));
  hint.textContent=`目前 viewport ${width}×${height}｜${info.label}｜${info.text}`;
}

addEventListener('resize',updateHint,{passive:true});
addEventListener('orientationchange',()=>setTimeout(updateHint,160),{passive:true});
window.visualViewport?.addEventListener('resize',updateHint,{passive:true});
updateHint();
