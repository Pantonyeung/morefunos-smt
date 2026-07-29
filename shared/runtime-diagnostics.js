import {runRuntimeSelfTest} from './runtime-self-test.js';
import {runRuntimeIntegrationSelfTest} from './runtime-integration-self-test.js';
import {getRuntimeStatus} from './runtime-status.js';
import {flushRuntimeQueue,getRuntimeController} from './runtime-bootstrap.js';

export async function runAllRuntimeDiagnostics(){
  const core=await runRuntimeSelfTest();
  const integration=await runRuntimeIntegrationSelfTest();
  const report=Object.freeze({
    ok:Boolean(core?.ok&&integration?.ok),
    core,
    integration,
    status:getRuntimeStatus(),
    generatedAt:new Date().toISOString()
  });
  window.dispatchEvent(new CustomEvent('morefun:runtime-diagnostics-complete',{detail:report}));
  return report;
}

export function getRuntimeDiagnosticsSnapshot(){
  return Object.freeze({
    status:getRuntimeStatus(),
    controllerStarted:Boolean(getRuntimeController()),
    generatedAt:new Date().toISOString()
  });
}

export async function retryRuntimeQueue(){
  return flushRuntimeQueue();
}
