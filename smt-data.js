/* More Fun SMT V16.1 — 5 Root optimized data/config */
'use strict';

const categories=['全部','人氣推薦','飯團','飯團套餐','便當','紫米沙律','薯角餐','小食','飲品','湯品','甜品','加購','更多','搜尋'];

const products=[
{id:'f4',code:'F4',name:'蜜糖雞絲＋鹽酥雞',description:'招牌雙拼紫米飯團，可補選小食及飲品組成套餐',price:45,category:'人氣推薦',image:'./assets/products/f4.webp',required:[],optional:['snack','drink'],linkUp:true},
{id:'a1',code:'A1',name:'紫米飯團 A 餐',description:'飯團＋小食＋飲品',price:59,category:'飯團套餐',image:'./assets/products/f4.webp',required:['snack','drink'],optional:[],drinkSlots:1},
{id:'custom-riceball-set',code:'AC',name:'自選紫米飯團餐',description:'自選飯團、小食及飲品',price:59,category:'飯團套餐',image:'./assets/products/f3.webp',required:['snack','drink'],optional:[],drinkSlots:1},
{id:'b1',code:'B1',name:'自選便當',description:'自選飯底及飲品',price:48,category:'便當',image:'./assets/products/b1.webp',required:['rice','drink'],optional:[],drinkSlots:1},
{id:'b2',code:'B2',name:'泡菜豬肉便當',description:'泡菜豬肉配自選飯底及飲品',price:52,category:'便當',image:'./assets/products/b2.webp',required:['rice','drink'],optional:[],drinkSlots:1},
{id:'f1',code:'F1',name:'原味紫米飯團',description:'單點飯團，可補選小食及飲品組成套餐',price:41,category:'飯團',image:'./assets/products/f1.webp',required:[],optional:['snack','drink'],linkUp:true},
{id:'f3',code:'F3',name:'泡菜豬肉飯團',description:'單點飯團，可補選小食及飲品組成套餐',price:45,category:'飯團',image:'./assets/products/f3.webp',required:[],optional:['snack','drink'],linkUp:true},
{id:'salad1',code:'SL1',name:'紫米能量沙律',description:'醬汁及飲品必選',price:48,category:'紫米沙律',image:'./assets/products/b4.webp',required:['sauce','drink'],optional:[],drinkSlots:1},
{id:'s2',code:'S2',name:'香脆薯角餐',description:'薯角餐連飲品',price:35,category:'薯角餐',image:'./assets/products/s2.webp',required:['drink'],optional:[],drinkSlots:1},
{id:'s1',code:'S1',name:'香脆雞翼（2件）',description:'單點小食',price:18,category:'小食',image:'./assets/products/s1.webp',required:[],optional:[]},
{id:'d1',code:'D1',name:'手打檸檬茶',description:'可選甜度及冰量',price:18,category:'飲品',image:'./assets/products/d1.webp',required:[],optional:['sweetness','ice']},
{id:'d2',code:'D2',name:'台式奶茶',description:'可選甜度及冰量',price:16,category:'飲品',image:'./assets/products/d2.webp',required:[],optional:['sweetness','ice']},
{id:'soup1',code:'SP1',name:'味噌湯',description:'暖胃湯品',price:12,category:'湯品',image:'./assets/products/b4.webp',required:[],optional:[]}
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
  sweetness:['正常甜','多甜','少甜','走甜'],
  ice:['正常冰','少冰','多冰','走冰']
};

const orderPageConfig={
  canvas:{width:1920,height:1080,reflow:false},
  catalog:{defaultTemplate:'large',showCode:true,showDescription:true,productOverrides:{d1:'small',d2:'small',soup1:'text'}},
  cart:{mergeMode:'same_config',showSequence:true},
  quickDrinks:{enabled:true,showImages:true,order:['iced-lemon-tea','taiwan-milk-tea','iced-lemon-water','cola','genmaicha','puer','limited-tea','sparkling-water','wintermelon-lemon','americano','latte']},
  quickAssist:{enabled:true},
  pendingPanel:{maxRatio:.5}
};

window.MoreFunSMTData={categories,products,drinks,optionSets,orderPageConfig};
