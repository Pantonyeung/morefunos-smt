export const RESPONSIVE_PROFILES=Object.freeze({
  LARGE:'large',
  STANDARD:'standard',
  COMPACT:'compact',
  DENSE:'dense'
});

export const WINDOW_WIDTH_CLASSES=Object.freeze({
  COMPACT:'compact',
  MEDIUM:'medium',
  EXPANDED:'expanded',
  LARGE:'large',
  EXTRA_LARGE:'extra-large'
});

export const WINDOW_HEIGHT_CLASSES=Object.freeze({
  COMPACT:'compact',
  MEDIUM:'medium',
  EXPANDED:'expanded'
});

function finiteDimension(value,fallback){
  const parsed=Number(value);
  return Number.isFinite(parsed)&&parsed>0?Math.round(parsed):fallback;
}

export function getWindowSizeClass(width,height){
  const viewportWidth=finiteDimension(width,1920);
  const viewportHeight=finiteDimension(height,1080);

  let widthClass=WINDOW_WIDTH_CLASSES.COMPACT;
  if(viewportWidth>=1600)widthClass=WINDOW_WIDTH_CLASSES.EXTRA_LARGE;
  else if(viewportWidth>=1200)widthClass=WINDOW_WIDTH_CLASSES.LARGE;
  else if(viewportWidth>=840)widthClass=WINDOW_WIDTH_CLASSES.EXPANDED;
  else if(viewportWidth>=600)widthClass=WINDOW_WIDTH_CLASSES.MEDIUM;

  let heightClass=WINDOW_HEIGHT_CLASSES.COMPACT;
  if(viewportHeight>=900)heightClass=WINDOW_HEIGHT_CLASSES.EXPANDED;
  else if(viewportHeight>=480)heightClass=WINDOW_HEIGHT_CLASSES.MEDIUM;

  return Object.freeze({
    width:viewportWidth,
    height:viewportHeight,
    widthClass,
    heightClass,
    twoPaneEligible:viewportWidth>=840&&viewportHeight>=480
  });
}

export function getResponsiveProfile(width,height){
  const windowSizeClass=getWindowSizeClass(width,height);
  const viewportWidth=windowSizeClass.width;
  const viewportHeight=windowSizeClass.height;
  const landscape=viewportWidth>=viewportHeight;
  const aspectRatio=viewportWidth/viewportHeight;

  /*
   * Keep the common POS sizes on adjacent density bands without a hard
   * 1440 -> 1366 cliff. 1920 remains the visual master; 1600/1440/1366
   * share the same structural density and 1280 uses compact density.
   *
   * Android-style window size classes are carried alongside this visual
   * density profile. Window classes make high-level pane decisions while
   * the existing profile preserves the locked SMT geometry.
   */
  let name=RESPONSIVE_PROFILES.DENSE;
  if(viewportWidth>=1680&&viewportHeight>=900)name=RESPONSIVE_PROFILES.LARGE;
  else if(viewportWidth>=1360&&viewportHeight>=760)name=RESPONSIVE_PROFILES.STANDARD;
  else if(viewportWidth>=1200&&viewportHeight>=720)name=RESPONSIVE_PROFILES.COMPACT;

  return Object.freeze({
    name,
    width:viewportWidth,
    height:viewportHeight,
    landscape,
    orientation:landscape?'landscape':'portrait',
    aspectRatio,
    windowWidthClass:windowSizeClass.widthClass,
    windowHeightClass:windowSizeClass.heightClass,
    twoPaneEligible:windowSizeClass.twoPaneEligible
  });
}

export function applyResponsiveProfile(targetDocument,profile){
  if(!targetDocument?.documentElement||!profile)return profile;
  const root=targetDocument.documentElement;
  root.dataset.responsiveProfile=profile.name;
  root.dataset.viewportWidth=String(profile.width);
  root.dataset.viewportHeight=String(profile.height);
  root.dataset.orientation=profile.orientation;
  root.dataset.windowWidthClass=profile.windowWidthClass;
  root.dataset.windowHeightClass=profile.windowHeightClass;
  root.dataset.twoPaneEligible=String(Boolean(profile.twoPaneEligible));
  if(targetDocument.body){
    targetDocument.body.dataset.responsiveProfile=profile.name;
    targetDocument.body.dataset.viewportWidth=String(profile.width);
    targetDocument.body.dataset.viewportHeight=String(profile.height);
    targetDocument.body.dataset.windowWidthClass=profile.windowWidthClass;
    targetDocument.body.dataset.windowHeightClass=profile.windowHeightClass;
    targetDocument.body.dataset.twoPaneEligible=String(Boolean(profile.twoPaneEligible));
  }
  return profile;
}
