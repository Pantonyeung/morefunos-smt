export const MOCK_CATEGORIES=[
  {id:'all',name:'全部'},{id:'main',name:'測試主食'},{id:'snack',name:'測試小食'},{id:'drink',name:'測試飲品'}
];

export const MOCK_PRODUCTS=[
  {id:'m-a',code:'T001',category:'main',name:'測試主食 A',subtitle:'無選項｜直接入車',price:42,card:'large'},
  {id:'m-b',code:'T002',category:'main',name:'測試主食 B',subtitle:'需要必選項',price:46,card:'large',required:{title:'必選口味',options:['標準','少辣','走辣']}},
  {id:'m-c',code:'T003',category:'main',name:'測試套餐 C',subtitle:'套餐／飲品配對測試',price:58,card:'small',combo:true},
  {id:'s-a',code:'S001',category:'snack',name:'測試小食 A',subtitle:'只供功能驗收',price:12,card:'small'},
  {id:'s-b',code:'S002',category:'snack',name:'測試小食 B',subtitle:'純文字商品卡',price:15,card:'text'},
  {id:'s-c',code:'S003',category:'snack',name:'測試售罄商品',subtitle:'保留位置但不可加入',price:18,card:'text',soldout:true},
  {id:'d-a',code:'D001',category:'drink',name:'測試飲品 A',subtitle:'快捷飲品',price:3,card:'small',drink:true},
  {id:'d-b',code:'D002',category:'drink',name:'測試飲品 B',subtitle:'快捷飲品',price:6,card:'small',drink:true},
  {id:'d-c',code:'D003',category:'drink',name:'測試飲品 C',subtitle:'快捷飲品',price:9,card:'text',drink:true}
];

export const MOCK_PENDING=[
  {id:'P001',source:'磨飯 App',customer:'測試客人 A',amount:88,wait:'4 分鐘',payment:'待核實'},
  {id:'P002',source:'WhatsApp',customer:'測試客人 B',amount:63,wait:'7 分鐘',payment:'到店付款'}
];
