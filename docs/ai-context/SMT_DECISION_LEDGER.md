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
| D-017 | SUPERSEDED | `order-v1-10` 是飯團套餐父項基準 | VERSION／Status §18 |
| D-018 | SUPERSEDED | `order-v1-11` 接入客戶端既有 `menu.read` | D-021取代 |
| D-018 | LOCKED | 飯團套餐必須是一張父項；可欠飲品但阻止結帳 | Current Lock §17 |
| D-019 | LOCKED | 快捷飲品可直接嵌入套餐，不必先進購物車 | Current Lock §17 |
| D-020 | LOCKED | 套餐可拆開，並按單品價重新計算 | Current Lock §17 |
| D-021 | CURRENT | `order-v1-12` 以 Firebase RTDB `public/catalogV1` 作唯一即時餐牌/API來源；Firebase→快取→內置餐牌三級回退。Google Sheet只作記錄投影，Apps Script不得進入SMT運行鏈路 | `pages/order/menu-api.js`／menu API tests |
| D-022 | LOCKED | 暫存按操作終端獨立流水編號；跨機取回保留來源，接手機再次暫存改用接手機新編號 | Current Lock §18／draft tests |
| D-023 | LOCKED | 結帳訂單必須記錄實際完成結帳的終端及完整暫存交接 audit | Current Lock §18／checkout tests |
| D-024 | LOCKED | 反結帳並重用直接載回既有點單頁，不在訂單頁重造產品編輯器 | Current Lock §18 |
| D-025 | CURRENT | 訂單頁所有可見操作必須有真實資料結果及明確回饋；整單取消保留於歷史，不可刪除原訂單 | Current Lock §19／orders actions tests |
| D-026 | LOCKED | 渠道、付款方式、付款狀態、核數狀態及平台結算分開；只有現場外賣／堂食可選付款方式，只有現金顯示鍵盤 | 2026-07-21 已確認渠道付款設計／checkout tests |
| D-027 | LOCKED | 電話／WhatsApp及磨飯 App 備用單進入付款待核實；Keeta／Foodpanda 為平台已付，只收渠道參考資料 | 2026-07-21 已確認渠道矩陣／orders tests |
| D-028 | LOCKED | 平台百分之二十五記為佣金預估及預計結算，不可記為客人折扣 | 2026-07-21 已確認平台結算規則／checkout tests |
| D-029 | LOCKED | 部分取消在商品行內加減，最後只做一次金額確認 | 2026-07-21 已確認取消流程／orders tests |
| D-030 | LOCKED | 堂食固定一至八號及戶外九宮格；枱位只分未使用／使用中，35分鐘只以紅色提示 | 2026-07-21 最新產品對話／dine tests |
| D-031 | LOCKED | 撳枱卡直接點餐或開簡潔詳情；掃碼新增單必須半屏確認後才正式打印及入記錄 | 2026-07-21 最新產品對話／dine tests |
| D-032 | LOCKED | 堂食付款支援全數或按餐品及數量分拆，同枱可用多種付款方式分批結算 | 2026-07-21 最新產品對話／dine tests |
| D-033 | SUPERSEDED | 堂食第一版只接員工 SMT／SMM 點餐、枱位暫存、正式批次及付款；掃碼、多手機共同點餐與確認人機制保留入口及文件，延後第二版接入 | D-034取代 |
| D-034 | LOCKED | 堂食沒有暫存狀態；掛單面板左側只處理一般掛單，右側枱號一按即建立正式堂食批次及打印工作 | 2026-07-21 最新產品確認／dine及draft UI tests |
| D-035 | LOCKED | 取單固定左側掛單列表、右側內容，底部返回／作廢／取單；堂食枱卡直接顯示時間、三十五分鐘、首三項餐點、數量及金額摘要 | 2026-07-21 最新產品確認／dine及draft UI tests |
| D-036 | LOCKED | 堂食未付金額一歸零，必須同一流程建立來源為「現場」的完成歷史訂單並清空枱位；載入舊付清會話亦要補救且不可重複入歷史 | 2026-07-22 實機問題確認／dine tests |
| D-037 | LOCKED | 一般掛單可作廢；日結以早上五時營業日分界自動清理上一營業日仍未處理草稿 | 2026-07-22 實機問題確認／draft tests |
| D-038 | LOCKED | 獨立售罄頁把今日售罄移到售罄分類，停售留原分類最後；售罄用橙、停售用紅且不灰化。點單頁售罄保留位置、停售排分類最後，角標／列表／卡片共用供應狀態 | 2026-07-22 實機問題確認／soldout及order tests |

新增決策不得改寫舊行；新增一行並把被取代項標 `SUPERSEDED`。
