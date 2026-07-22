export const orderPageConfig={
  canvas:{width:1920,height:1080,reflow:false,profile:'sunmi-t2s-contain'},
  catalog:{defaultTemplate:'large',showCode:true,showDescription:true,productOverrides:{}},
  categoryLayout:{columns:6,rows:1,showSearch:true},
  cart:{mergeMode:'same_config',showSequence:true,showImages:true,widthPercent:32},
  quickDrinks:{
    mode:'custom',visible:true,showImages:true,quickAssist:true,
    widthRatioToLargeCard:0.6667,heightPx:72,
    order:['iced-lemon-tea','taiwan-milk-tea','iced-lemon-water','cola','genmaicha','puer','limited-tea','sparkling-water','wintermelon-lemon','americano','latte']
  }
};
