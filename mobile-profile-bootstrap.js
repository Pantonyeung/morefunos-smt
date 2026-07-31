const isSmmPath=/^\/smm\/?$/i.test(location.pathname);
const params=new URLSearchParams(location.search);
if(isSmmPath&&!/mobile|smm/i.test(String(params.get('profile')||params.get('mode')||''))){
  params.set('profile','mobile');
  params.set('terminal',params.get('terminal')||'SMM-01');
  history.replaceState(null,'',`${location.pathname}?${params.toString()}${location.hash}`);
}
const profile=isSmmPath||/mobile|smm/i.test(String(params.get('profile')||params.get('mode')||''))?'mobile':'register';
document.documentElement.dataset.appProfile=profile;

if(profile==='mobile'){
  document.title='磨飯 SMM｜售罄管理';
  const enforceSoldoutRoute=()=>{
    if(location.hash!=='#/soldout')history.replaceState(null,'',`${location.pathname}${location.search}#/soldout`);
  };
  enforceSoldoutRoute();
  setTimeout(enforceSoldoutRoute,0);
  window.addEventListener('morefun:shell-unlocked',enforceSoldoutRoute);
  window.addEventListener('hashchange',enforceSoldoutRoute);
}
