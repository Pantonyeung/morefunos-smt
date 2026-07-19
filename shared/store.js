import {safeClone} from './runtime.js';

export function readStore(key, fallback, {storage = globalThis.localStorage, migrate} = {}) {
  try {
    const raw = storage?.getItem(key);
    if (raw == null) return safeClone(fallback);
    const parsed = JSON.parse(raw);
    return typeof migrate === 'function' ? migrate(parsed) : parsed;
  } catch (error) {
    console.warn(`[MoreFun SMT] failed to read ${key}`, error);
    return safeClone(fallback);
  }
}

export function writeStore(key, value, {storage = globalThis.localStorage} = {}) {
  try {
    const payload = JSON.stringify(value);
    storage?.setItem(`${key}:pending`, payload);
    storage?.setItem(key, payload);
    storage?.removeItem(`${key}:pending`);
    return true;
  } catch (error) {
    console.warn(`[MoreFun SMT] failed to write ${key}`, error);
    return false;
  }
}

export function removeStore(key, {storage = globalThis.localStorage} = {}) {
  try {
    storage?.removeItem(key);
    storage?.removeItem(`${key}:pending`);
    return true;
  } catch { return false; }
}

export function migrateStore(value, {version = 1, defaults = {}, migrate} = {}) {
  const source = value && typeof value === 'object' ? safeClone(value) : {};
  if (source.schemaVersion === version) return {...safeClone(defaults), ...source};
  const migrated = typeof migrate === 'function' ? migrate(source) : source;
  return {...safeClone(defaults), ...migrated, schemaVersion: version};
}
