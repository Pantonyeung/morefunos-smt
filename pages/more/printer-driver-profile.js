const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));

export const PRINTER_COMMAND_LANGUAGES=Object.freeze(['escpos','tspl','epl','zpl','dpl','raw']);
export const LABEL_COMMAND_LANGUAGES=Object.freeze(['tspl','epl','zpl','dpl']);

const normalizeText=value=>String(value??'').trim();

export function supportedCommandLanguagesForMedia(media={}){
  if(media?.kind==='label')return [...LABEL_COMMAND_LANGUAGES,'raw'];
  return ['escpos','raw'];
}

export function normalizePrinterDriver(driver={},media={}){
  const kind=media?.kind==='label'?'label':'roll';
  const fallbackLanguage=kind==='label'?'tspl':'escpos';
  const requested=normalizeText(driver.commandLanguage||driver.language).toLowerCase();
  const supported=supportedCommandLanguagesForMedia(media);
  const commandLanguage=supported.includes(requested)?requested:fallbackLanguage;
  const encoding=normalizeText(driver.encoding)||'utf-8';
  const cutMode=kind==='roll'&&['full','partial','none'].includes(driver.cutMode)?driver.cutMode:'none';
  const density=Number.isFinite(Number(driver.density))?Number(driver.density):null;
  const speed=Number.isFinite(Number(driver.speed))?Number(driver.speed):null;
  return {commandLanguage,encoding,cutMode,density,speed};
}

export function validatePrinterDriver(driver={},media={}){
  const requested=normalizeText(driver.commandLanguage||driver.language).toLowerCase();
  const errors=[];
  if(requested&&!PRINTER_COMMAND_LANGUAGES.includes(requested))errors.push('打印指令語言不支援');
  if(requested&&!supportedCommandLanguagesForMedia(media).includes(requested)){
    errors.push(media?.kind==='label'?'標籤模式需要標籤打印指令語言或 raw driver':'卷紙模式不可使用標籤打印指令語言');
  }
  const normalized=normalizePrinterDriver(driver,media);
  if(!normalized.encoding)errors.push('缺少字符編碼');
  return {ok:errors.length===0,errors,driver:normalized};
}

export function applyPrinterDriver(printer={},driver={}){
  const next=clone(printer)||{};
  const normalized=normalizePrinterDriver(driver,next.media||{});
  return {...next,driver:normalized};
}
