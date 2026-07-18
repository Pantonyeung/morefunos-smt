function keepReplicaControlsActionable() {
  const incomingButton = document.querySelector('.top-alert[data-action="incoming-open"]');
  if (incomingButton instanceof HTMLButtonElement) incomingButton.disabled = false;
}

const app = document.getElementById('app');
if (app) {
  new MutationObserver(keepReplicaControlsActionable).observe(app, {childList: true, subtree: true});
  keepReplicaControlsActionable();
}
