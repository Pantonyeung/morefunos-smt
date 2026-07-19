export const orderPageConfig={
  canvas:{width:1920,height:1080,reflow:false,profile:'iphone-landscape-fit'},
  catalog:{defaultTemplate:'large',showCode:true,showDescription:true,productOverrides:{}},
  cart:{mergeMode:'same_config',showSequence:true},
  quickDrinks:{
    mode:'custom',
    showImages:true,
    quickAssist:true,
    cardWidthPx:92,
    cardHeightPx:58,
    imageSizePx:34,
    maxRatioToLargeCard:0.6667,
    order:['iced-lemon-tea','taiwan-milk-tea','iced-lemon-water','cola','genmaicha','puer','limited-tea','sparkling-water','wintermelon-lemon','americano','latte']
  }
};
