export const MOCK_CATEGORIES=[
  {id:'all',name:'全部'},{id:'rice',name:'測試主食'},{id:'combo',name:'測試套餐'},{id:'snack',name:'測試小食'},{id:'drink',name:'測試飲品'}
];
export const MOCK_PRODUCTS=[
  {id:'P001',category:'rice',name:'測試主食 A',subtitle:'無必選｜快速加入',price:10,mode:'large'},
  {id:'P002',category:'rice',name:'測試主食 B',subtitle:'有必選｜開詳細卡',price:20,mode:'large',required:[{id:'size',name:'份量',options:['標準','加大']} ]},
  {id:'P003',category:'rice',name:'測試主食 C',subtitle:'售罄位置保留',price:30,mode:'small',soldout:true},
  {id:'C001',category:'combo',name:'測試套餐 A',subtitle:'Required／Pool／Link Up 驗收',price:35,mode:'large',combo:true,required:[{id:'side',name:'必選小食',options:['測試小食 A','測試小食 B']},{id:'drink',name:'必選飲品',options:['測試飲品 A','測試飲品 B','測試飲品 C']} ]},
  {id:'S001',category:'snack',name:'測試小食 A',subtitle:'小圖卡',price:5,mode:'small'},
  {id:'S002',category:'snack',name:'測試小食 B',subtitle:'純文字卡',price:8,mode:'text'},
  {id:'D001',category:'drink',name:'測試飲品 A',subtitle:'快捷飲品流程',price:3,mode:'small',quickDrink:true},
  {id:'D002',category:'drink',name:'測試飲品 B',subtitle:'快捷飲品流程',price:6,mode:'text',quickDrink:true},
  {id:'D003',category:'drink',name:'測試飲品 C',subtitle:'快捷飲品流程',price:9,mode:'small',quickDrink:true}
];