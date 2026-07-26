(()=>{
  const app=document.getElementById('app');
  if(!app)return;
  let frame=0;

  function schedule(){
    if(frame)return;
    frame=requestAnimationFrame(()=>{frame=0;sync();});
  }

  function assignmentCounts(){
    const counts=new Map();
    app.querySelectorAll('.required-target.complete small').forEach(node=>{
      const text=(node.textContent||'').trim();
      const prefix='已選：';
      if(!text.startsWith(prefix))return;
      const name=text.slice(prefix.length).trim();
      if(!name)return;
      counts.set(name,(counts.get(name)||0)+1);
    });
    return counts;
  }

  function sync(){
    const grid=app.querySelector('.required-drink-grid');
    if(!grid)return;
    const counts=assignmentCounts();
    grid.querySelectorAll('button').forEach(button=>{
      const nameNode=button.querySelector(':scope > span:last-child');
      const name=(nameNode?.textContent||'').trim();
      const count=counts.get(name)||0;
      let badge=button.querySelector(':scope > .drink-choice-count');
      if(!count){badge?.remove();button.classList.remove('has-assignment');return;}
      if(!badge){badge=document.createElement('em');badge.className='drink-choice-count';button.appendChild(badge);}
      badge.textContent='✓ '+count;
      button.classList.add('has-assignment');
      button.setAttribute('aria-label',`${name}，已選 ${count} 份`);
    });
  }

  new MutationObserver(schedule).observe(app,{subtree:true,childList:true,characterData:true});
  document.addEventListener('click',schedule,true);
  schedule();
})();
