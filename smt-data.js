/* More Fun SMT V16 — five-root full-port data and rules */
'use strict';

const categories=['全部','人氣推薦','飯團','飯團套餐','便當','紫米沙律','薯角餐','小食','飲品','湯品','甜品','加購','更多','搜尋'];

const products=[
  {id:'f4',code:'F4',name:'蜜糖雞絲＋鹽酥雞',description:'招牌雙拼紫米飯團，可補選小食及飲品組成套餐',price:45,category:'人氣推薦',image:'./assets/products/f4.webp',requiredGroups:[],optionalGroups:['snack','drink'],combinableGroup:'single-riceball'},
  {id:'f1',code:'F1',name:'原味紫米飯團',description:'單點飯團，可補選小食及飲品組成套餐',price:41,category:'飯團',image:'./assets/products/f1.webp',requiredGroups:[],optionalGroups:['snack','drink'],combinableGroup:'single-riceball'},
  {id:'f3',code:'F3',name:'泡菜豬肉飯團',description:'單點飯團，可補選小食及飲品組成套餐',price:45,category:'飯團',image:'./assets/products/f3.webp',requiredGroups:[],optionalGroups:['snack','drink'],combinableGroup:'single-riceball'},
  {id:'a1',code:'A1',name:'紫米飯團 A 餐',description:'飯團＋小食＋飲品',price:59,category:'飯團套餐',image:'./assets/products/f4.webp',requiredGroups:['snack','drink'],optionalGroups:[],drinkSlotsPerUnit:1},
  {id:'custom-riceball-set',code:'AC',name:'自選紫米飯團餐',description:'自選飯團、小食及飲品',price:59,category:'飯團套餐',image:'./assets/products/f3.webp',requiredGroups:['snack','drink'],optionalGroups:[],drinkSlotsPerUnit:1},
  {id:'b1',code:'B1',name:'自選便當',description:'自選飯底及飲品',price:48,category:'便當',image:'./assets/products/b1.webp',requiredGroups:['rice','drink'],optionalGroups:['adjustment'],drinkSlotsPerUnit:1},
  {id:'b2',code:'B2',name:'泡菜豬肉便當',description:'泡菜豬肉配自選飯底及飲品',price:52,category:'便當',image:'./assets/products/b2.webp',requiredGroups:['rice','drink'],optionalGroups:['adjustment'],drinkSlotsPerUnit:1},
  {id:'salad1',code:'SL1',name:'紫米能量沙律',description:'醬汁及飲品必選',price:48,category:'紫米沙律',image:'./assets/products/b4.webp',requiredGroups:['sauce','drink'],optionalGroups:[],drinkSlotsPerUnit:1},
  {id:'s2',code:'S2',name:'香脆薯角餐',description:'薯角餐連飲品',price:35,category:'薯角餐',image:'./assets/products/s2.webp',requiredGroups:['drink'],optionalGroups:[],drinkSlotsPerUnit:1},
  {id:'s1',code:'S1',name:'香脆雞翼（2件）',description:'單點小食',price:18,category:'小食',image:'./assets/products/s1.webp',requiredGroups:[],optionalGroups:[],linkRole:'snack'},
  {id:'snack-fries',code:'S3',name:'香脆薯角',description:'單點小食',price:16,category:'小食',image:'./assets/products/s2.webp',requiredGroups:[],optionalGroups:[],linkRole:'snack'},
  {id:'d1',code:'D1',name:'手打檸檬茶',description:'可選甜度及冰量',price:18,category:'飲品',image:'./assets/products/d1.webp',requiredGroups:[],optionalGroups:['sweetness','ice'],linkRole:'drink',drinkId:'iced-lemon-tea'},
  {id:'d2',code:'D2',name:'台式奶茶',description:'可選甜度及冰量',price:16,category:'飲品',image:'./assets/products/d2.webp',requiredGroups:[],optionalGroups:['sweetness','ice'],linkRole:'drink',drinkId:'taiwan-milk-tea'},
  {id:'soup1',code:'SP1',name:'味噌湯',description:'暖胃湯品',price:12,category:'湯品',image:'./assets/products/b4.webp',requiredGroups:[],optionalGroups:[],linkRole:'snack'}
];

const drinks=[
  {id:'iced-lemon-tea',name:'凍檸茶',price:18,image:'./assets/products/d1.webp',sweet:true,ice:true},
  {id:'taiwan-milk-tea',name:'台式奶茶',price:16,image:'./assets/products/d2.webp',sweet:true,ice:true},
  {id:'iced-lemon-water',name:'凍檸水',price:16,image:'./assets/products/d1.webp',sweet:true,ice:true},
  {id:'cola',name:'可樂',price:12,image:'./assets/products/d1.webp',sweet:false,ice:true},
  {id:'genmaicha',name:'玄米冷泡茶',price:18,image:'./assets/products/d2.webp',sweet:false,ice:false},
  {id:'puer',name:'普洱冷泡茶',price:18,image:'./assets/products/d2.webp',sweet:false,ice:false},
  {id:'limited-tea',name:'限定冷泡茶',price:18,image:'./assets/products/d1.webp',sweet:false,ice:false},
  {id:'sparkling-water',name:'氣泡水',price:16,image:'./assets/products/d1.webp',sweet:false,ice:false},
  {id:'wintermelon-lemon',name:'冬瓜檸檬',price:16,image:'./assets/products/d1.webp',sweet:false,ice:true},
  {id:'americano',name:'美式咖啡',price:18,image:'./assets/products/d2.webp',sweet:false,ice:true},
  {id:'latte',name:'拿鐵',price:22,image:'./assets/products/d2.webp',sweet:false,ice:true}
];

const optionSets={
  rice:['肉燥飯','咖喱飯','菜飯'],
  sauce:['不需要','標準','少醬','多醬'],
  snack:['薯角','鹽酥雞','沙律','味噌湯'],
  adjustment:['標準飯量','多飯','少飯','半飯'],
  sweetness:['正常甜','多甜','少甜','走甜'],
  ice:['正常冰','少冰','多冰','走冰']
};

const pendingOrders=[
  {id:'app-501',source:'磨飯 App',number:'A501',customer:'陳小姐',items:3,total:126,time:'12:18'},
  {id:'app-502',source:'磨飯 App',number:'A502',customer:'黃先生',items:2,total:88,time:'12:21'},
  {id:'app-503',source:'磨飯 App',number:'A503',customer:'Walk-in',items:4,total:168,time:'12:25'},
  {id:'phone-301',source:'電話／WhatsApp',number:'P301',customer:'李小姐',items:2,total:96,time:'12:27'},
  {id:'phone-302',source:'電話／WhatsApp',number:'P302',customer:'張先生',items:1,total:45,time:'12:29'}
];

const checkoutConfig={
  channels:['現場外賣','電話／WhatsApp','磨飯 App','Foodpanda','Keeta'],
  payments:['現金付款','FPS／轉數快','PayMe','AlipayHK','WeChat Pay HK','組合付款'],
  quickAmounts:[20,50,100,500]
};

const orderPageConfig={
  canvas:{width:1920,height:1080,reflow:false},
  catalog:{defaultTemplate:'large',showCode:true,showDescription:true,productOverrides:{d1:'small',d2:'small',soup1:'text'}},
  cart:{mergeMode:'same_config',showSequence:true},
  quickDrinks:{enabled:true,showImages:true,order:drinks.map(item=>item.id)},
  quickAssist:{enabled:true},
  pendingPanel:{maxRatio:.5}
};

window.MoreFunSMTData={categories,products,drinks,optionSets,pendingOrders,checkoutConfig,orderPageConfig};
