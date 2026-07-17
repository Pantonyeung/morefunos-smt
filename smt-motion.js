export const motionProfile = Object.freeze({
  normal: Object.freeze({touch:90, update:150, page:170, drawer:240, modal:220, toast:180}),
  quick: Object.freeze({touch:70, update:110, page:120, drawer:165, modal:150, toast:130}),
  reduced: Object.freeze({touch:0, update:0, page:0, drawer:0, modal:0, toast:0})
});

export function getMotionDuration(kind, profile = motionProfile.normal) {
  return Number(profile[kind] ?? 0);
}

export function resolveMotionProfile({quickMode = false, reducedMotion = false} = {}) {
  if (reducedMotion) return motionProfile.reduced;
  return quickMode ? motionProfile.quick : motionProfile.normal;
}

export function applyMotionVariables(root, options = {}) {
  const profile = resolveMotionProfile(options);
  for (const [key, value] of Object.entries(profile)) {
    root.style.setProperty(`--motion-${key}`, `${value}ms`);
  }
}

export function announce(message, documentRef = document) {
  const region = documentRef.getElementById('live-region');
  if (!region) return;
  region.textContent = '';
  requestAnimationFrame(() => { region.textContent = message; });
}
