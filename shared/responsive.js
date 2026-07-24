export const RESPONSIVE_PROFILES=Object.freeze({
  LARGE:'large',
  STANDARD:'standard',
  COMPACT:'compact',
  DENSE:'dense'
});

function finiteDimension(value,fallback){
  const parsed=Number(value);
  return Number.isFinite(parsed)&&parsed>0?Math.round(parsed):fallback;
}

export function getResponsiveProfile(width,height){
  const viewportWidth=finiteDimension(width,1920);
  const viewportHeight=finiteDimension(height,1080);
  const landscape=viewportWidth>=viewportHeight;
  const aspectRatio=viewportWidth/viewportHeight;

  let name=RESPONSIVE_PROFILES.DENSE;
  if(viewportWidth>=1680&&viewportHeight>=900)name=RESPONSIVE_PROFILES.LARGE;
  else if(viewportWidth>=1440&&viewportHeight>=820)name=RESPONSIVE_PROFILES.STANDARD;
  else if(viewportWidth>=1200&&viewportHeight>=720)name=RESPONSIVE_PROFILES.COMPACT;

  return Object.freeze({
    name,
    width:viewportWidth,
    height:viewportHeight,
    landscape,
    orientation:landscape?'landscape':'portrait',
    aspectRatio
  });
}

export function applyResponsiveProfile(targetDocument,profile){
  if(!targetDocument?.documentElement||!profile)return profile;
  const root=targetDocument.documentElement;
  root.dataset.responsiveProfile=profile.name;
  root.dataset.viewportWidth=String(profile.width);
  root.dataset.viewportHeight=String(profile.height);
  root.dataset.orientation=profile.orientation;
  if(targetDocument.body){
    targetDocument.body.dataset.responsiveProfile=profile.name;
    targetDocument.body.dataset.viewportWidth=String(profile.width);
    targetDocument.body.dataset.viewportHeight=String(profile.height);
  }
  return profile;
}
