const hint=document.getElementById('device-hint');
function updateHint(){
  const viewport=window.visualViewport;
  const width=Math.round(viewport?.width||innerWidth);
  const height=Math.round(viewport?.height||innerHeight);
  const orientation=width>=height?'橫屏':'豎屏';
  const likely=width>=1000&&orientation==='橫屏'?'較似 SMT / iPad 檢查環境':'較似 SMM 手機檢查環境';
  hint.textContent=`目前 viewport ${width}×${height}｜${orientation}｜${likely}`;
}
addEventListener('resize',updateHint,{passive:true});
window.visualViewport?.addEventListener('resize',updateHint,{passive:true});
updateHint();
