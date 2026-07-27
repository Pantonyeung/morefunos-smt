const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
const text=value=>String(value??'').trim();

export const PRINT_ASSET_CONTRACT='morefun.print.asset.v1';

export function normalizeRenderedPrintAsset(asset={}){
  return {
    contract:PRINT_ASSET_CONTRACT,
    documentType:text(asset.documentType),
    templateId:text(asset.templateId),
    templateVersion:Number(asset.templateVersion)||0,
    commandLanguage:text(asset.commandLanguage).toLowerCase(),
    media:clone(asset.media||{}),
    base64:text(asset.base64),
    byteLength:Math.max(0,Number(asset.byteLength)||0),
    checksum:text(asset.checksum),
    renderedAt:Number(asset.renderedAt)||0
  };
}

export function validateRenderedPrintAsset(asset={}){
  const normalized=normalizeRenderedPrintAsset(asset);
  const errors=[];
  if(normalized.contract!==PRINT_ASSET_CONTRACT)errors.push('打印資產合約版本不支援');
  if(!normalized.documentType)errors.push('缺少文件類型');
  if(!normalized.templateId)errors.push('缺少模板識別');
  if(!normalized.commandLanguage)errors.push('缺少打印指令語言');
  if(!normalized.base64)errors.push('缺少已渲染打印 bytes');
  if(normalized.byteLength<1)errors.push('打印資產 byteLength 無效');
  return {ok:errors.length===0,errors,asset:normalized};
}

export function buildBinaryAndroidContent(asset={}){
  const validation=validateRenderedPrintAsset(asset);
  if(!validation.ok)throw new Error(validation.errors.join('；'));
  const value=validation.asset;
  return {
    mode:'binary',
    base64:value.base64,
    byteLength:value.byteLength,
    commandLanguage:value.commandLanguage,
    assetContract:value.contract,
    templateId:value.templateId,
    templateVersion:value.templateVersion,
    checksum:value.checksum,
    media:clone(value.media)
  };
}
