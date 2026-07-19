window.MoreFunSMTData = {
  categories: ["人氣", "飯團", "飯團套餐", "便當", "紫米沙律", "小食", "飲品", "更多"],
  products: [
    {id:"f4", category:"人氣", name:"F4 招牌紫米飯團", code:"F4", price:45, kind:"riceball", description:"招牌人氣配搭", required:[]},
    {id:"setA", category:"人氣", name:"紫米 A 餐", code:"A SET", price:58, kind:"combo", description:"飯團＋小食＋飲品", required:["drink"], save:8},
    {id:"bento12", category:"人氣", name:"招牌肉燥便當", code:"12", price:52, kind:"bento", description:"預設肉燥飯，可走蛋", required:[]},
    {id:"f1", category:"飯團", name:"F1 紫米飯團", code:"F1", price:41, kind:"riceball", description:"A 價層", required:[]},
    {id:"f2", category:"飯團", name:"F2 紫米飯團", code:"F2", price:43, kind:"riceball", description:"B 價層", required:[]},
    {id:"f3", category:"飯團", name:"F3 紫米飯團", code:"F3", price:45, kind:"riceball", description:"C 價層", required:[]},
    {id:"f5", category:"飯團", name:"F5 紫米飯團", code:"F5", price:47, kind:"riceball", description:"D 價層", required:[]},
    {id:"setF4", category:"飯團套餐", name:"F4 紫米能量餐", code:"F4 SET", price:64, kind:"combo", description:"主餐＋小食＋飲品", required:["drink"], save:9},
    {id:"customSet", category:"飯團套餐", name:"自選紫米套餐", code:"CUSTOM", price:60, kind:"combo", description:"自由配搭，集中待補", required:["riceball","snack","drink"]},
    {id:"curry", category:"便當", name:"咖喱便當", code:"C12", price:54, kind:"bento", description:"咖喱飯底，不顯示蛋選項", required:[]},
    {id:"veg", category:"便當", name:"菜飯便當", code:"V12", price:50, kind:"bento", description:"可走蛋，多／少／半飯", required:[]},
    {id:"potato", category:"便當", name:"薯角餐", code:"POTATO", price:49, kind:"bento", description:"薯角主餐配搭", required:[]},
    {id:"salad", category:"紫米沙律", name:"紫米沙律", code:"S2", price:48, kind:"salad", description:"醬汁預設不需要", required:[]},
    {id:"fries", category:"小食", name:"香脆薯角", code:"S01", price:20, kind:"snack", description:"蜜糖芥末固定配搭", required:[]},
    {id:"chicken", category:"小食", name:"香烤雞件", code:"S02", price:24, kind:"snack", description:"可作套餐小食", required:[]},
    {id:"milkTea", category:"飲品", name:"台式奶茶", code:"D01", price:18, kind:"drink", description:"可調冰量／甜度", required:[]},
    {id:"lemonTea", category:"飲品", name:"手打檸檬茶", code:"D02", price:20, kind:"drink", description:"可調冰量／甜度", required:[]},
    {id:"genmai", category:"飲品", name:"玄米冷泡茶", code:"D03", price:16, kind:"drink", description:"冷泡茶升級選項", required:[]},
    {id:"sparkling", category:"飲品", name:"氣泡水", code:"D04", price:15, kind:"drink", description:"無需冰甜選項", required:[]},
    {id:"studentDrink", category:"更多", name:"學生特飲升級", code:"STUDENT", price:9, kind:"discount", description:"只限門店認證使用", required:[]}
  ],
  quickDrinks: ["milkTea", "lemonTea", "genmai", "sparkling"]
};
