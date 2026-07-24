export const MOCK_CATEGORIES=[
  {id:'all',name:'全部'},
  {id:'rice',name:'測試主食'},
  {id:'snack',name:'測試小食'},
  {id:'drink',name:'測試飲品'}
];

export const MOCK_PRODUCTS=[
  {id:'mock-rice-a',category:'rice',name:'測試主食 A',subtitle:'只供版面及操作驗收',price:10,mode:'large'},
  {id:'mock-rice-b',category:'rice',name:'測試主食 B',subtitle:'測試較長產品名稱顯示情況',price:20,mode:'large'},
  {id:'mock-rice-c',category:'rice',name:'測試主食 C',subtitle:'測試售罄位置保留',price:30,mode:'small',soldout:true},
  {id:'mock-snack-a',category:'snack',name:'測試小食 A',subtitle:'只供功能測試',price:5,mode:'small'},
  {id:'mock-snack-b',category:'snack',name:'測試小食 B',subtitle:'只供功能測試',price:8,mode:'text'},
  {id:'mock-drink-a',category:'drink',name:'測試飲品 A',subtitle:'只供快捷飲品流程測試',price:3,mode:'small'},
  {id:'mock-drink-b',category:'drink',name:'測試飲品 B',subtitle:'只供快捷飲品流程測試',price:6,mode:'text'},
  {id:'mock-drink-c',category:'drink',name:'測試飲品 C',subtitle:'只供快捷飲品流程測試',price:9,mode:'small'}
];
