const DEFAULT_ACCOUNT={
  username:'morefun',
  displayName:'磨飯',
  passwordHash:'b86deaa25abc9ed9d3c2e26ed9f9d349a1411856d72328d4fe86618593c45f3d',
  enabled:true
};

export function normalizeAccounts(settings={}){
  const rows=Array.isArray(settings?.auth?.accounts)?settings.auth.accounts:[];
  const normalized=rows.map(row=>({
    username:String(row?.username||'').trim(),
    displayName:String(row?.displayName||row?.username||'').trim(),
    passwordHash:String(row?.passwordHash||'').trim().toLowerCase(),
    enabled:row?.enabled!==false
  })).filter(row=>row.username&&/^[a-f0-9]{64}$/.test(row.passwordHash));
  return normalized.length?normalized:[DEFAULT_ACCOUNT];
}

export async function sha256Fast(value=''){
  const data=new TextEncoder().encode(String(value));
  const digest=await crypto.subtle.digest('SHA-256',data);
  return Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
}

export async function authenticateStaff({username,password,accounts}){
  const normalizedUsername=String(username||'').trim();
  const passwordHash=await sha256Fast(password||'');
  const match=(accounts||[]).find(row=>row.enabled!==false&&row.username===normalizedUsername&&row.passwordHash===passwordHash);
  if(!match)return {ok:false,code:'INVALID_CREDENTIALS'};
  return {ok:true,staff:{username:match.username,displayName:match.displayName||match.username}};
}
