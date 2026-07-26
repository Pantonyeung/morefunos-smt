(()=>{
  const DIRTY_ACTIONS=new Set([
    'detail-option','detail-drink','detail-qty','keypad','modifier-qty','group-qty','add-drink-group',
    'completion-required-choice','completion-fill-remaining','select-link-item','select-link-drink',
    'select-combo-component','clear-combo-component'
  ]);
  const SAVE_ACTIONS=['apply-product','apply-drink','apply-required-group','apply-combo-edit','apply-specified-link'];
  let dirty=false;
  let confirmLayer=null;

  function activeModal(){return document.querySelector('.modal-card');}
  function modalScrim(){return document.querySelector('.modal-scrim');}
  function closeButton(){return activeModal()?.querySelector('[data-action="dismiss-modal"]');}
  function saveButton(){return SAVE_ACTIONS.map(action=>activeModal()?.querySelector(`[data-action="${action}"]`)).find(Boolean)||null;}
  function clearPolicyConfirm(){confirmLayer?.remove();confirmLayer=null;}

  function finishDiscard(){
    const close=closeButton();
    if(!close){dirty=false;clearPolicyConfirm();return;}
    close.click();
    requestAnimationFrame(()=>{
      const discard=document.querySelector('[data-action="confirm-discard"]');
      if(discard)discard.click();
      dirty=false;
      clearPolicyConfirm();
    });
  }

  function showUnsavedConfirm(){
    if(confirmLayer)return;
    confirmLayer=document.createElement('div');
    confirmLayer.className='modal-policy-confirm';
    confirmLayer.innerHTML='<section><strong>已經有調整，是否退出？</strong><p>你可以繼續調整、退出而不保存，或者保存目前修改後退出。</p><div><button data-modal-policy="continue">繼續調整</button><button class="danger" data-modal-policy="discard">退出不保存</button><button class="primary" data-modal-policy="save">保存並退出</button></div><small data-modal-policy-status></small></section>';
    document.body.appendChild(confirmLayer);
    confirmLayer.addEventListener('click',event=>{
      const action=event.target.closest('[data-modal-policy]')?.dataset.modalPolicy;
      if(!action)return;
      if(action==='continue'){clearPolicyConfirm();return;}
      if(action==='discard'){finishDiscard();return;}
      if(action==='save'){
        const save=saveButton();
        const status=confirmLayer.querySelector('[data-modal-policy-status]');
        if(save&&save.disabled){if(status)status.textContent='仍有必選項未完成，請先完成再保存。';return;}
        if(save){clearPolicyConfirm();dirty=false;save.click();return;}
        clearPolicyConfirm();dirty=false;closeButton()?.click();
      }
    });
  }

  document.addEventListener('click',event=>{
    const scrim=event.target.closest('.modal-scrim');
    if(scrim&&event.target===scrim){
      event.preventDefault();event.stopPropagation();
      if(!activeModal())return;
      if(dirty)showUnsavedConfirm();else closeButton()?.click();
      return;
    }
    const action=event.target.closest('[data-action]')?.dataset.action;
    if(action&&DIRTY_ACTIONS.has(action)&&activeModal())dirty=true;
    if(action==='dismiss-modal'||SAVE_ACTIONS.includes(action)){
      if(!document.querySelector('.confirm-layer'))dirty=false;
    }
  },true);

  document.addEventListener('input',event=>{
    if(activeModal()&&event.target.closest('.modal-card'))dirty=true;
  },true);

  new MutationObserver(()=>{
    if(!activeModal()){dirty=false;clearPolicyConfirm();}
  }).observe(document.documentElement,{subtree:true,childList:true});
})();
