export const orderPageConfig={
  canvas:{width:1920,height:'viewport',reflow:true,profile:'tablet-landscape-width-fit'},
  catalog:{defaultTemplate:'large',showCode:true,showDescription:true,productOverrides:{}},
  cart:{mergeMode:'same_config',showSequence:true,widthPercent:32},
  quickDrinks:{
    mode:'custom',visible:true,showImages:true,quickAssist:true,
    widthRatioToLargeCard:0.6667,heightPx:72,
    order:['iced-lemon-tea','taiwan-milk-tea','iced-lemon-water','cola','genmaicha','puer','limited-tea','sparkling-water','wintermelon-lemon','americano','latte']
  }
};
