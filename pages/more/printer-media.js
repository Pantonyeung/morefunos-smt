export const MEDIA_KIND_ROLL='roll';
export const MEDIA_KIND_LABEL='label';

const number=value=>Number.isFinite(Number(value))?Number(value):0;

export function normalizeMediaProfile(profile={},fallback={}){
  const kind=profile.kind===MEDIA_KIND_LABEL?MEDIA_KIND_LABEL:MEDIA_KIND_ROLL;
  const widthMm=Math.max(20,number(profile.widthMm||fallback.widthMm||80));
  const heightMm=kind===MEDIA_KIND_LABEL?Math.max(10,number(profile.heightMm||fallback.heightMm||50)):0;
  return {kind,widthMm,heightMm};
}

export function applyMediaProfile(printer,profile){
  const current=normalizeMediaProfile(printer?.media||{}, {widthMm:printer?.paperWidth||80,heightMm:printer?.labelHeight||50});
  const media=normalizeMediaProfile({...current,...profile},current);
  return {
    ...printer,
    media,
    paperWidth:media.widthMm,
    labelHeight:media.kind===MEDIA_KIND_LABEL?media.heightMm:0
  };
}

export function templateSupportsMedia(template,documentType,profile){
  if(!template||template.documentType!==documentType)return false;
  const media=normalizeMediaProfile(profile);
  const minWidth=number(template.minWidthMm)||20;
  const maxWidth=number(template.maxWidthMm)||200;
  if(media.widthMm<minWidth||media.widthMm>maxWidth)return false;
  if(media.kind===MEDIA_KIND_LABEL){
    const minHeight=number(template.minHeightMm)||10;
    const maxHeight=number(template.maxHeightMm)||300;
    if(media.heightMm<minHeight||media.heightMm>maxHeight)return false;
  }
  return true;
}

export function compatibleTemplates(templates,documentType,profile){
  return (templates||[]).filter(template=>template.status==='published'&&templateSupportsMedia(template,documentType,profile));
}

export function templateLayoutScale(template,profile){
  const media=normalizeMediaProfile(profile);
  const designWidth=Math.max(20,number(template?.designWidthMm||template?.paperWidth||media.widthMm));
  return {scale:media.widthMm/designWidth,widthMm:media.widthMm,heightMm:media.heightMm};
}
