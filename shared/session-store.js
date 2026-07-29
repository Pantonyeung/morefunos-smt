export const STAFF_SESSION_KEY='morefun:smt:staff-session:v1';
const DEFAULT_TTL_MS=1000*60*60*24*30;

export function createSession(staff,{now=Date.now(),ttlMs=DEFAULT_TTL_MS}={}){
  return {
    version:1,
    username:String(staff?.username||''),
    displayName:String(staff?.displayName||staff?.username||''),
    issuedAt:now,
    expiresAt:now+ttlMs
  };
}

export function isValidSession(session,{now=Date.now()}={}){
  return Boolean(session&&session.version===1&&session.username&&Number.isFinite(session.issuedAt)&&Number.isFinite(session.expiresAt)&&session.expiresAt>now);
}

export function readSession(storage=localStorage){
  try{
    const session=JSON.parse(storage.getItem(STAFF_SESSION_KEY)||'null');
    if(!isValidSession(session)){
      storage.removeItem(STAFF_SESSION_KEY);
      return null;
    }
    return session;
  }catch{return null;}
}

export function writeSession(session,storage=localStorage){
  storage.setItem(STAFF_SESSION_KEY,JSON.stringify(session));
  return session;
}

export function clearSession(storage=localStorage){
  storage.removeItem(STAFF_SESSION_KEY);
}
