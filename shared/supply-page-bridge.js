import {SUPPLY_STORAGE_KEY} from './store.js';

let profile='register';
try{profile=window.parent?.document?.documentElement?.dataset?.appProfile||profile}catch{}
const params=new URLSearchParams(location.search);
if(/mobile|smm/i.test(String(params.get('profile')||params.get('mode')||'')))profile='mobile';
document.documentElement.dataset.appProfile=profile;
document.body.dataset.appProfile=profile;

let reloadQueued=false;
window.addEventListener('storage',event=>{
  if(event.key!==SUPPLY_STORAGE_KEY||event.oldValue===event.newValue||reloadQueued)return;
  reloadQueued=true;
  requestAnimationFrame(()=>location.reload());
});
