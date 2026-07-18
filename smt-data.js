export const categories = Object.freeze([
  '全部', '人氣推薦', '飯團', '飯團套餐', '便當', '紫米沙律', '薯角餐', '小食', '飲品'
]);

export const products = Object.freeze([
  {id:'f1', code:'F1', name:'原味紫米飯團', price:41, category:'飯團', image:'assets/products/f1.webp', availability:'available'},
  {id:'f2', code:'F2', name:'紫菜吞拿魚飯團', price:43, category:'飯團', image:'assets/products/f2.webp', availability:'sold-out'},
  {id:'f3', code:'F3', name:'泡菜豬肉飯團', price:45, category:'飯團', image:'assets/products/f3.webp', availability:'available'},
  {id:'f4', code:'F4', name:'蜜糖雞絲＋鹽酥雞', price:45, category:'人氣推薦', image:'assets/products/f4.webp', availability:'available', hot:true},
  {id:'f5', code:'F5', name:'煙肉蛋飯團', price:43, category:'飯團', image:'assets/products/f5.webp', availability:'available'},
  {id:'f6', code:'F6', name:'芝士肉鬆飯團', price:47, category:'飯團', image:'assets/products/f6.webp', availability:'available'},
  {id:'a1', code:'A1', name:'紫米飯團 A 餐', price:59, category:'飯團套餐', image:'assets/products/f4.webp', availability:'available'},
  {id:'b1', code:'B1', name:'自選便當', price:48, category:'便當', image:'assets/products/b1.webp', availability:'available', requiredGroups:['rice']},
  {id:'b2', code:'B2', name:'泡菜豬肉便當', price:52, category:'便當', image:'assets/products/b2.webp', availability:'available', requiredGroups:['rice']},
  {id:'b3', code:'B3', name:'照燒雞扒便當', price:52, category:'便當', image:'assets/products/b3.webp', availability:'paused', requiredGroups:['rice']},
  {id:'s1', code:'S1', name:'香脆雞翼（2件）', price:18, category:'小食', image:'assets/products/s1.webp', availability:'available'},
  {id:'s2', code:'S2', name:'香脆薯角', price:16, category:'薯角餐', image:'assets/products/s2.webp', availability:'available'},
  {id:'d1', code:'D1', name:'手打檸檬茶', price:18, category:'飲品', image:'assets/products/d1.webp', availability:'available'},
  {id:'d2', code:'D2', name:'台式奶茶', price:16, category:'飲品', image:'assets/products/d2.webp', availability:'available'},
  {id:'d3', code:'D3', name:'凍檸水', price:12, category:'飲品', image:'assets/products/d3.webp', availability:'available'},
  {id:'d4', code:'D4', name:'可樂', price:10, category:'飲品', image:'assets/products/d4.webp', availability:'available'}
]);

export const optionGroups = Object.freeze({
  rice: {
    label: '選擇飯底',
    required: true,
    values: [
      {id:'braised', label:'肉燥飯', detail:'可選走蛋'},
      {id:'curry', label:'咖喱飯', detail:'不顯示蛋選項'},
      {id:'vegetable', label:'菜飯', detail:'可選走蛋'}
    ]
  }
});

export const demoOrders = Object.freeze([
  {id:'P0053', source:'現場外賣', amount:58, status:'active', minutes:11, payment:'現金已收', print:'打印正常'},
  {id:'P0054', source:'WhatsApp', amount:84, status:'active', minutes:19, payment:'付款待核實', print:'打印正常'},
  {id:'P0055', source:'App', amount:62, status:'active', minutes:27, payment:'FPS 已核實', print:'標籤待重試'}
]);
