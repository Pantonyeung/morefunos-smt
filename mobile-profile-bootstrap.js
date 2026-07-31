const params=new URLSearchParams(location.search);
const profile=/mobile|smm/i.test(String(params.get('profile')||params.get('mode')||''))?'mobile':'register';
document.documentElement.dataset.appProfile=profile;

if(profile==='mobile'){
  document.title='磨飯 SMM｜售罄管理';
  if(location.hash!=='#/soldout')location.hash='#/soldout';
  window.addEventListener('hashchange',()=>{
    if(location.hash!=='#/soldout')history.replaceState(null,'',`${location.pathname}${location.search}#/soldout`);
  });
}
