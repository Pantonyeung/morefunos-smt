export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) ?? fallback);
  } catch (error) {
    console.warn(`[MoreFun SMT] read failed: ${key}`, error);
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[MoreFun SMT] write failed: ${key}`, error);
    return false;
  }
}

export function removeStored(key) {
  try { localStorage.removeItem(key); return true; }
  catch { return false; }
}
