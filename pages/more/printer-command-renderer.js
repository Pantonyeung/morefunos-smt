import {buildBinaryAndroidContent,PRINT_ASSET_CONTRACT} from './printer-rendered-asset.js';

const byte=value=>Number(value)&0xff;
const u16=value=>[byte(value),byte(Number(value)>>8)];
const ascii=text=>Uint8Array.from([...String(text)].map(char=>char.charCodeAt(0)&0x7f));
const concat=(...parts)=>{
  const arrays=parts.filter(Boolean).map(part=>part instanceof Uint8Array?part:Uint8Array.from(part));
  const total=arrays.reduce((sum,item)=>sum+item.length,0);
  const out=new Uint8Array(total);let offset=0;
  arrays.forEach(item=>{out.set(item,offset);offset+=item.length;});
  return out;
};

export function bytesToBase64(bytes){
  const data=bytes instanceof Uint8Array?bytes:Uint8Array.from(bytes||[]);
  if(typeof Buffer!=='undefined')return Buffer.from(data).toString('base64');
  let binary='';
  for(let i=0;i<data.length;i+=0x8000)binary+=String.fromCharCode(...data.subarray(i,i+0x8000));
  return btoa(binary);
}

export function normalizeMonochromeRaster(raster={}){
  const widthDots=Math.max(1,Math.floor(Number(raster.widthDots)||0));
  const heightDots=Math.max(1,Math.floor(Number(raster.heightDots)||0));
  const widthBytes=Math.ceil(widthDots/8);
  const expected=widthBytes*heightDots;
  const data=raster.data instanceof Uint8Array?raster.data:Uint8Array.from(raster.data||[]);
  if(data.length!==expected)throw new Error(`Raster bytes 不符：需要 ${expected}，實際 ${data.length}`);
  return {widthDots,heightDots,widthBytes,data};
}

export function renderEscPosRaster(raster={},driver={}){
  const image=normalizeMonochromeRaster(raster);
  const [xL,xH]=u16(image.widthBytes),[yL,yH]=u16(image.heightDots);
  const init=Uint8Array.from([0x1b,0x40]);
  const rasterHeader=Uint8Array.from([0x1d,0x76,0x30,0x00,xL,xH,yL,yH]);
  const feed=Uint8Array.from([0x1b,0x64,0x03]);
  let cut=Uint8Array.from([]);
  if(driver.cutMode==='full')cut=Uint8Array.from([0x1d,0x56,0x00]);
  if(driver.cutMode==='partial')cut=Uint8Array.from([0x1d,0x56,0x01]);
  return concat(init,rasterHeader,image.data,feed,cut);
}

export function renderTsplBitmap(raster={},media={},driver={}){
  const image=normalizeMonochromeRaster(raster);
  const widthMm=Math.max(1,Number(media.widthMm)||50);
  const heightMm=Math.max(1,Number(media.heightMm)||30);
  const density=Number.isFinite(Number(driver.density))?Number(driver.density):8;
  const speed=Number.isFinite(Number(driver.speed))?Number(driver.speed):4;
  const prefix=ascii(`SIZE ${widthMm} mm,${heightMm} mm\r\nDENSITY ${density}\r\nSPEED ${speed}\r\nCLS\r\nBITMAP 0,0,${image.widthBytes},${image.heightDots},0,`);
  const suffix=ascii('\r\nPRINT 1,1\r\n');
  return concat(prefix,image.data,suffix);
}

export function rendererAvailable(commandLanguage){
  return ['escpos','tspl'].includes(String(commandLanguage||'').toLowerCase());
}

export function renderRasterPrintAsset({raster,documentType,templateId,templateVersion=1,printer,now=Date.now()}={}){
  const language=String(printer?.driver?.commandLanguage||'').toLowerCase();
  if(!rendererAvailable(language))throw new Error(`未有 ${language||'指定'} 打印 Renderer`);
  const media=printer?.media||{};
  const bytes=language==='escpos'?renderEscPosRaster(raster,printer.driver||{}):renderTsplBitmap(raster,media,printer.driver||{});
  const asset={
    contract:PRINT_ASSET_CONTRACT,documentType,templateId,templateVersion,
    commandLanguage:language,media,base64:bytesToBase64(bytes),byteLength:bytes.length,renderedAt:Number(now)||Date.now()
  };
  return {...asset,androidContent:buildBinaryAndroidContent(asset)};
}
