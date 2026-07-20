# SMT Decision Ledger

`LOCKED` 已確認；`CURRENT` 現行工程規則；`SUPERSEDED` 已取代；`OPEN` 待資料／驗收。

| ID | 狀態 | 決策 | 來源 |
|---|---|---|---|
| D-001 | LOCKED | 頂欄、底欄、結帳固定，內容區內滾動 | Current Lock §2、§5 |
| D-002 | LOCKED | 同時只開一張主卡；背景及空白不可操作 | §3 |
| D-003 | LOCKED | 卡按來源方向展開，箭嘴指實際觸發中心 | §4 |
| D-004 | LOCKED | 購物車金額最右；上價下操作；圖片關閉不留空位 | §16 |
| D-005 | LOCKED | 快捷飲品收起；直向卡名上圖下，選中橙框箭嘴 | §8、§16 |
| D-006 | LOCKED | 所有飲品選擇共用設計語言，按場景縮放 | §16 |
| D-007 | LOCKED | 指定配對按數量動態生成 A–Z | §16 |
| D-008 | LOCKED | 核款才接單；接單後運行30分鐘完成 | §10.1 |
| D-009 | LOCKED | 不設製作中、待取餐 | §10.1 |
| D-010 | SUPERSEDED | `order-v1-9` 是 Context OS 程式基準 | D-017取代 |
| D-011 | CURRENT | 自動測試不等於實機或最終 Lock | §14 |
| D-012 | SUPERSEDED | 快捷飲品長期橫向固定顯示 | D-005取代 |
| D-013 | SUPERSEDED | 修改卡使用大型產品詳情頁 | 25%來源卡取代 |
| D-014 | SUPERSEDED | 結帳按鈕稱「先處理」 | 改為 `結帳 $金額` |
| D-015 | OPEN | 真實訂單、付款、打印、設備 API 格式 | 需後台／硬件 |
| D-016 | OPEN | iPad及T2S最終視覺 Lock | 需實機證據 |
| D-017 | CURRENT | `order-v1-10` 是現行程式基準 | VERSION／Status §18 |
| D-018 | LOCKED | 飯團套餐必須是一張父項；可欠飲品但阻止結帳 | Current Lock §17 |
| D-019 | LOCKED | 快捷飲品可直接嵌入套餐，不必先進購物車 | Current Lock §17 |
| D-020 | LOCKED | 套餐可拆開，並按單品價重新計算 | Current Lock §17 |

新增決策不得改寫舊行；新增一行並把被取代項標 `SUPERSEDED`。
