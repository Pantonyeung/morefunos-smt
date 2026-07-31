const isSmmPath=/^\/smm\/?$/i.test(location.pathname);
const params=new URLSearchParams(location.search);
if(isSmmPath&&!/mobile|smm/i.test(String(params.get('profile')||params.get('mode')||''))){
  params.set('profile','mobile');
  params.set('terminal',params.get('terminal')||'SMM-01');
  history.replaceState(null,'',`${location.pathname}?${params.toString()}${location.hash}`);
}

const profile=isSmmPath||/mobile|smm/i.test(String(params.get('profile')||params.get('mode')||''))?'mobile':'register';
document.documentElement.dataset.appProfile=profile;
document.documentElement.dataset.printAuthority=profile==='mobile'?'remote-smt':'local-host';

if(profile==='mobile'){
  document.title='磨飯 SMM';
  document.documentElement.classList.add('is-smm-profile');
  window.__MOREFUN_APP_PROFILE__=Object.freeze({
    profile:'mobile',
    source:'smm',
    terminalId:params.get('terminal')||'SMM-01',
    printMode:'remote-job'
  });
}else{
  window.__MOREFUN_APP_PROFILE__=Object.freeze({
    profile:'register',
    source:'smt',
    terminalId:params.get('terminal')||'SMT-01',
    printMode:'local-host'
  });
}
