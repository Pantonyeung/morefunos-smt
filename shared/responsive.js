export const RESPONSIVE_PROFILES=Object.freeze({
  LARGE:'large',
  STANDARD:'standard',
  COMPACT:'compact',
  DENSE:'dense'
});

export const ADAPTIVE_LAYOUT_MODES=Object.freeze({
  COMPACT:'compact',
  MEDIUM:'medium',
  WIDE:'wide',
  EXPANDED:'expanded'
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
  const viewportWidth=finiteDimension(width,1280);
  const viewportHeight=finiteDimension(height,800);

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

export function getAdaptiveLayoutMode(width,height){
  const {width:viewportWidth,height:viewportHeight}=getWindowSizeClass(width,height);
  const longEdge=Math.max(viewportWidth,viewportHeight);
  const shortEdge=Math.min(viewportWidth,viewportHeight);

  if(longEdge>=1600&&shortEdge>=900)return ADAPTIVE_LAYOUT_MODES.EXPANDED;
  if(longEdge>=1180&&shortEdge>=700)return ADAPTIVE_LAYOUT_MODES.WIDE;
  if(longEdge>=768&&shortEdge>=600)return ADAPTIVE_LAYOUT_MODES.MEDIUM;
  return ADAPTIVE_LAYOUT_MODES.COMPACT;
}

export function getResponsiveProfile(width,height){
  const windowSizeClass=getWindowSizeClass(width,height);
  const viewportWidth=windowSizeClass.width;
  const viewportHeight=windowSizeClass.height;
  const landscape=viewportWidth>=viewportHeight;
  const aspectRatio=viewportWidth/viewportHeight;
  const layoutMode=getAdaptiveLayoutMode(viewportWidth,viewportHeight);

  /*
   * `name` remains a compatibility density token for existing CSS only.
   * Structural layout decisions must use `layoutMode` and window classes.
   * Physical resolutions are acceptance samples, never independent UI builds.
   */
  let name=RESPONSIVE_PROFILES.DENSE;
  if(layoutMode===ADAPTIVE_LAYOUT_MODES.EXPANDED)name=RESPONSIVE_PROFILES.LARGE;
  else if(layoutMode===ADAPTIVE_LAYOUT_MODES.WIDE&&viewportWidth>=1360&&viewportHeight>=760)name=RESPONSIVE_PROFILES.STANDARD;
  else if(layoutMode===ADAPTIVE_LAYOUT_MODES.WIDE)name=RESPONSIVE_PROFILES.COMPACT;
  else if(layoutMode===ADAPTIVE_LAYOUT_MODES.MEDIUM)name=RESPONSIVE_PROFILES.COMPACT;

  return Object.freeze({
    name,
    layoutMode,
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
  root.dataset.layoutMode=profile.layoutMode;
  root.dataset.viewportWidth=String(profile.width);
  root.dataset.viewportHeight=String(profile.height);
  root.dataset.orientation=profile.orientation;
  root.dataset.windowWidthClass=profile.windowWidthClass;
  root.dataset.windowHeightClass=profile.windowHeightClass;
  root.dataset.twoPaneEligible=String(Boolean(profile.twoPaneEligible));
  if(targetDocument.body){
    targetDocument.body.dataset.responsiveProfile=profile.name;
    targetDocument.body.dataset.layoutMode=profile.layoutMode;
    targetDocument.body.dataset.viewportWidth=String(profile.width);
    targetDocument.body.dataset.viewportHeight=String(profile.height);
    targetDocument.body.dataset.orientation=profile.orientation;
    targetDocument.body.dataset.windowWidthClass=profile.windowWidthClass;
    targetDocument.body.dataset.windowHeightClass=profile.windowHeightClass;
    targetDocument.body.dataset.twoPaneEligible=String(Boolean(profile.twoPaneEligible));
  }
  return profile;
}
