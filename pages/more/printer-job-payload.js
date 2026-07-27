import {buildBinaryAndroidContent,validateRenderedPrintAsset} from './printer-rendered-asset.js';
import {normalizePrinterDevice} from './printer-settings-model.js';

const number=value=>Number.isFinite(Number(value))?Number(value):0;

export function buildPrinterJobPayload(job={},printer={},asset={}){
  const device=normalizePrinterDevice(printer);
  const validation=validateRenderedPrintAsset(asset);
  if(!validation.ok)throw new Error(validation.errors.join('；'));
  if(!job?.id)throw new Error('打印工作缺少 id');
  if(device.enabled===false)throw new Error('打印機已停用');
  if(device.transport!=='network')throw new Error('此 Payload Builder 目前只處理 LAN TCP 打印機');
  if(!device.host||!Number(device.port))throw new Error('打印機 IP／Port 未完成設定');
  if(validation.asset.commandLanguage!==device.driver.commandLanguage){
    throw new Error('打印資產指令語言與打印機 Driver 不一致');
  }
  return {
    contract:'morefun.print.v1',
    idempotencyKey:String(job.id),
    jobId:String(job.id),
    documentType:String(job.documentType||validation.asset.documentType),
    copies:Math.max(1,number(job.copies)||1),
    target:{
      transport:'tcp',host:String(device.host),port:Number(device.port),
      timeoutMs:Math.max(1000,number(device.timeoutMs)||5000)
    },
    content:buildBinaryAndroidContent(validation.asset),
    completion:{required:true,acceptedStatuses:['printed','failed'],doNotTreatQueuedAsPrinted:true}
  };
}

export function assertPrinterPayloadMatchesRoute(payload={},job={},printer={}){
  const errors=[];
  if(payload.jobId!==String(job.id||''))errors.push('Payload jobId 與 Print Job 不一致');
  if(payload.idempotencyKey!==String(job.id||''))errors.push('idempotencyKey 必須使用 Print Job id');
  if(payload.target?.host!==String(printer.host||''))errors.push('Payload target host 與路由打印機不一致');
  if(Number(payload.target?.port)!==Number(printer.port))errors.push('Payload target port 與路由打印機不一致');
  if(payload.completion?.doNotTreatQueuedAsPrinted!==true)errors.push('queued 不可視為 printed');
  return {ok:errors.length===0,errors};
}
