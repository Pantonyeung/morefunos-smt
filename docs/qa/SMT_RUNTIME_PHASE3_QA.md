# SMT Runtime Phase 3 QA

Commit: 6efd4de6eb886103d4702b3e08a07fc7cfdcb3e5

## component ownership audit
```text
SMT COMPONENT AUTHORITY AUDIT
=============================
PASS GLOBAL_SHELL_STATUS_VISUAL_AUTHORITY: authority=app-shell.css
PASS GLOBAL_BOTTOM_NAV_VISUAL_AUTHORITY: authority=app-shell.css
PASS LEGACY_CHILD_CHROME_STANDALONE_ONLY: authority=shared/shell.js compatibility gate
PASS STATUS_ACTION_EXPLICIT_REGISTRATION: authority=page render descriptors + shared/status-actions.js
PASS CART_MARKER_VISUAL_AUTHORITY: authority=pages/order/cart.css
PASS ADAPTIVE_CART_TOKEN_ONLY: authority=pages/order/cart.css consumes --adaptive-cart-* tokens
PASS ADAPTIVE_ORDER_PRODUCT_LIST_ONLY: authority=pages/order/adaptive.css list geometry + pages/order/product-card.css internal visual
PASS PRODUCT_CARD_VISUAL_AUTHORITY: authority=pages/order/product-card.css
PASS ADAPTIVE_ORDERS_TOKEN_ONLY: authority=pages/orders/page.css + pages/orders/responsive.css
PASS ADAPTIVE_SOLDOUT_TOKEN_ONLY: authority=pages/soldout/page.css + pages/soldout/responsive.css
PASS RESPONSIVE_ORDERS_PAGE_AUTHORITY: authority=pages/orders/responsive.css
PASS RESPONSIVE_SOLDOUT_PAGE_AUTHORITY: authority=pages/soldout/responsive.css
PASS RESPONSIVE_DINE_PAGE_AUTHORITY: authority=pages/dine/responsive.css
PASS RESPONSIVE_MORE_PAGE_AUTHORITY: authority=pages/more/responsive.css
PASS DRINK_CARD_VISUAL_AUTHORITY: authority=pages/order/drink-card.css
PASS PAIRING_TASK_MODAL_VISUAL_AUTHORITY: authority=pages/order/pairing-modal.css
PASS OVERLAY_STATE_SINGLE_TRUTH: authority=page state -> app-loader.js message handler
PASS PACKAGING_DOMAIN_SINGLE_TRUTH: authority=pages/order/order-domain.js

KNOWN AUTHORITY MIGRATIONS
--------------------------
MIGRATION V1_CART_INTERNAL_VISUAL_AUTHORITY: pages/order/page.css [.cart-row, .cart-img, .cart-actions, .pending-area, .cart footer] | pages/order/cart.css [.cart-row, .cart-img, .cart-actions, .pending-area, .cart footer] :: page.css legacy cart internals are frozen by policy; cart.css is the final authority; legacy rules may only be removed, never extended
MIGRATION V2_DRINK_CARD_LEGACY_PAGE_CSS: pages/order/page.css [.drink-choice-card, .drink-choice-img, .drink-choice-count] :: drink-card.css is the final component authority; page.css drink-card internals are frozen legacy and may only be physically removed
MIGRATION V9_PRODUCT_CARD_LEGACY_PAGE_CSS: pages/order/page.css [.product-card, .product-hero, .product-info, .product-thumb] :: product-card.css is the final Product Card internal visual authority; page.css Product Card internals are frozen legacy and may only be physically removed
MIGRATION PAIRING_MODAL_LEGACY_PAGE_CSS: pages/order/page.css [.specified-link-card, .pairing-group-tabs, .pairing-body, .combo-editor-card] :: pairing-modal.css owns the bounded task layout; legacy page.css rules remain migration debt and may only be removed or reduced

Authority audit passed for locked boundaries. Known migrations remain visible until consolidated.
```

## node --test tests/*.test.mjs
```text
TAP version 13
# Subtest: Work and Chat entries point to current baseline
ok 1 - Work and Chat entries point to current baseline
  ---
  duration_ms: 9.143439
  type: 'test'
  ...
# Subtest: knowledge graph edges resolve and carry evidence
ok 2 - knowledge graph edges resolve and carry evidence
  ---
  duration_ms: 2.285314
  type: 'test'
  ...
# Subtest: status separates automation from device acceptance
ok 3 - status separates automation from device acceptance
  ---
  duration_ms: 2.742792
  type: 'test'
  ...
# SMT_CART_CHECKOUT_CORE_V7_OK
# Subtest: tests/cart-checkout-regression-v2.test.mjs
ok 2 - tests/cart-checkout-regression-v2.test.mjs
  ---
  duration_ms: 48.321501
  type: 'test'
  ...
# node:internal/modules/run_main:123
#     triggerUncaughtException(
#     ^
# AssertionError [ERR_ASSERTION]: DOM source order must be 外/堂 first, sequence second
#     at file:///home/runner/work/morefunos-smt/morefunos-smt/tests/cart-marker-dom-contract.test.mjs:13:8
#     at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
#     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
#     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5) {
#   generatedMessage: false,
#   code: 'ERR_ASSERTION',
#   actual: false,
#   expected: true,
#   operator: '==',
#   diff: 'simple'
# }
# Node.js v22.23.1
# Subtest: tests/cart-marker-dom-contract.test.mjs
not ok 3 - tests/cart-marker-dom-contract.test.mjs
  ---
  duration_ms: 51.198331
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/cart-marker-dom-contract.test.mjs:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
# Subtest: 分類版面設定只接受每行五至七格、一至兩行及搜尋開關
ok 6 - 分類版面設定只接受每行五至七格、一至兩行及搜尋開關
  ---
  duration_ms: 1.825463
  type: 'test'
  ...
# Subtest: 搜尋開啟時佔最後一行最後一格，超出首屏分類保留在可操作溢出清單
ok 7 - 搜尋開啟時佔最後一行最後一格，超出首屏分類保留在可操作溢出清單
  ---
  duration_ms: 0.532358
  type: 'test'
  ...
# Subtest: 學生優惠只將六元或以上合資格特飲的加價減半，普通凍檸茶不減價
ok 8 - 學生優惠只將六元或以上合資格特飲的加價減半，普通凍檸茶不減價
  ---
  duration_ms: 2.063786
  type: 'test'
  ...
# Subtest: 學生優惠人數不可超過合資格飲品數量
ok 9 - 學生優惠人數不可超過合資格飲品數量
  ---
  duration_ms: 0.416557
  type: 'test'
  ...
# Subtest: 未有明確資格或特飲加價少於六元，一律不可自行推斷為學生優惠
ok 10 - 未有明確資格或特飲加價少於六元，一律不可自行推斷為學生優惠
  ---
  duration_ms: 0.479741
  type: 'test'
  ...
# Subtest: 團體整單折扣與學生優惠互斥，現場可使用
ok 11 - 團體整單折扣與學生優惠互斥，現場可使用
  ---
  duration_ms: 0.273695
  type: 'test'
  ...
# Subtest: 平台訂單不可使用本店優惠
ok 12 - 平台訂單不可使用本店優惠
  ---
  duration_ms: 0.703622
  type: 'test'
  ...
# Subtest: 數字鍵盤支援數字、小數、退格及清除
ok 13 - 數字鍵盤支援數字、小數、退格及清除
  ---
  duration_ms: 0.377088
  type: 'test'
  ...
# Subtest: 數字鍵盤的 00 是獨立雙零鍵
ok 14 - 數字鍵盤的 00 是獨立雙零鍵
  ---
  duration_ms: 0.331541
  type: 'test'
  ...
# Subtest: 完成結帳保存優惠、應付金額及實際操作終端
ok 15 - 完成結帳保存優惠、應付金額及實際操作終端
  ---
  duration_ms: 1.231925
  type: 'test'
  ...
# Subtest: 渠道政策只容許現場單選付款方式，其他渠道只收必要參考資料
ok 16 - 渠道政策只容許現場單選付款方式，其他渠道只收必要參考資料
  ---
  duration_ms: 1.354976
  type: 'test'
  ...
# Subtest: 現場渠道不提供稍後付款
ok 17 - 現場渠道不提供稍後付款
  ---
  duration_ms: 0.859843
  type: 'test'
  ...
# Subtest: 自有渠道不猜付款方式，平台訂單分開保存佣金及預計結算
ok 18 - 自有渠道不猜付款方式，平台訂單分開保存佣金及預計結算
  ---
  duration_ms: 1.773056
  type: 'test'
  ...
# Subtest: 零元訂單不可建立付款紀錄
ok 19 - 零元訂單不可建立付款紀錄
  ---
  duration_ms: 0.280796
  type: 'test'
  ...
# Subtest: 結帳頁使用共用三位每日流水及永久訂單識別
ok 20 - 結帳頁使用共用三位每日流水及永久訂單識別
  ---
  duration_ms: 16.574148
  type: 'test'
  ...
# Subtest: 結帳紀錄同時保存永久編號及每日顯示流水
ok 21 - 結帳紀錄同時保存永久編號及每日顯示流水
  ---
  duration_ms: 0.586218
  type: 'test'
  ...
# Subtest: 結帳頂部只顯示狀態資料，不保留假快捷金額按鈕
ok 22 - 結帳頂部只顯示狀態資料，不保留假快捷金額按鈕
  ---
  duration_ms: 1.353204
  type: 'test'
  ...
# Subtest: 結帳頁保留數字鍵盤而不顯示底部主導航
ok 23 - 結帳頁保留數字鍵盤而不顯示底部主導航
  ---
  duration_ms: 0.338962
  type: 'test'
  ...
# Subtest: 詳情操作固定提供返回訂單及優惠兩欄
ok 24 - 詳情操作固定提供返回訂單及優惠兩欄
  ---
  duration_ms: 0.168629
  type: 'test'
  ...
# Subtest: 付款區及現金鍵盤由渠道政策動態控制而非所有渠道全部顯示
ok 25 - 付款區及現金鍵盤由渠道政策動態控制而非所有渠道全部顯示
  ---
  duration_ms: 0.256921
  type: 'test'
  ...
# Subtest: 結帳完成保留核對卡並提供有原因的更正資料入口
ok 26 - 結帳完成保留核對卡並提供有原因的更正資料入口
  ---
  duration_ms: 0.203932
  type: 'test'
  ...
# Subtest: 非現場渠道有對應的備註、取餐碼、核對碼或平台單號欄位
ok 27 - 非現場渠道有對應的備註、取餐碼、核對碼或平台單號欄位
  ---
  duration_ms: 0.141539
  type: 'test'
  ...
# Subtest: 快捷金額固定在大鍵盤上方，現場轉換付款方式亦不收起鍵盤
ok 28 - 快捷金額固定在大鍵盤上方，現場轉換付款方式亦不收起鍵盤
  ---
  duration_ms: 0.31793
  type: 'test'
  ...
# Subtest: 已收框是唯一金額輸入顯示並在輸入狀態發光
ok 29 - 已收框是唯一金額輸入顯示並在輸入狀態發光
  ---
  duration_ms: 0.253616
  type: 'test'
  ...
# Subtest: 渠道及付款方式引用大圖標 WebP 資源並採用上圖下字
ok 30 - 渠道及付款方式引用大圖標 WebP 資源並採用上圖下字
  ---
  duration_ms: 0.473731
  type: 'test'
  ...
# Subtest: 數字鍵盤使用四行放大按鍵
ok 31 - 數字鍵盤使用四行放大按鍵
  ---
  duration_ms: 0.56081
  type: 'test'
  ...
# Subtest: 零元時確認按鈕停用並顯示清楚原因
ok 32 - 零元時確認按鈕停用並顯示清楚原因
  ---
  duration_ms: 0.309778
  type: 'test'
  ...
# Subtest: 任何渠道的確認結帳操作永遠固定在付款欄最底
ok 33 - 任何渠道的確認結帳操作永遠固定在付款欄最底
  ---
  duration_ms: 0.271802
  type: 'test'
  ...
# Subtest: 堂食頁固定顯示八張室內枱及戶外枱
ok 34 - 堂食頁固定顯示八張室內枱及戶外枱
  ---
  duration_ms: 3.812225
  type: 'test'
  ...
# Subtest: 三十五分鐘提示只標記枱卡，不增加第三種枱位狀態
ok 35 - 三十五分鐘提示只標記枱卡，不增加第三種枱位狀態
  ---
  duration_ms: 0.494412
  type: 'test'
  ...
# Subtest: 逐餐品付款可拆數量並鎖定已付款數量
ok 36 - 逐餐品付款可拆數量並鎖定已付款數量
  ---
  duration_ms: 0.802578
  type: 'test'
  ...
# Subtest: 堂食付款歸零會建立現場歷史訂單並即時清空枱位
ok 37 - 堂食付款歸零會建立現場歷史訂單並即時清空枱位
  ---
  duration_ms: 1.778794
  type: 'test'
  ...
# Subtest: 堂食正式落單即鎖定流水並保存到製作工作，跨營業日付款亦不改號
ok 38 - 堂食正式落單即鎖定流水並保存到製作工作，跨營業日付款亦不改號
  ---
  duration_ms: 0.676782
  type: 'test'
  ...
# Subtest: 同時使用中的堂食枱亦會佔用每日流水避免撞號
ok 39 - 同時使用中的堂食枱亦會佔用每日流水避免撞號
  ---
  duration_ms: 0.538748
  type: 'test'
  ...
# Subtest: 舊版未有識別的堂食枱直接付款時會避開其他活躍枱流水
ok 40 - 舊版未有識別的堂食枱直接付款時會避開其他活躍枱流水
  ---
  duration_ms: 0.595301
  type: 'test'
  ...
# Subtest: 載入舊資料時會補救已付清但未清枱的堂食會話，且不重複寫歷史
ok 41 - 載入舊資料時會補救已付清但未清枱的堂食會話，且不重複寫歷史
  ---
  duration_ms: 0.592046
  type: 'test'
  ...
# Subtest: 堂食掃碼提交保持待確認，確認後才加入落單記錄
ok 42 - 堂食掃碼提交保持待確認，確認後才加入落單記錄
  ---
  duration_ms: 0.684483
  type: 'test'
  ...
# Subtest: 員工堂食點餐會建立指定枱會話內容，金額及批次由同一批餐品計算
ok 43 - 員工堂食點餐會建立指定枱會話內容，金額及批次由同一批餐品計算
  ---
  duration_ms: 0.795748
  type: 'test'
  ...
# Subtest: 堂食枱面摘要提供營運所需時間、餐點及數量資料
ok 44 - 堂食枱面摘要提供營運所需時間、餐點及數量資料
  ---
  duration_ms: 0.322618
  type: 'test'
  ...
# Subtest: 堂食點餐拒絕寫入已失效的舊會話，避免餐品掛錯枱
ok 45 - 堂食點餐拒絕寫入已失效的舊會話，避免餐品掛錯枱
  ---
  duration_ms: 0.349237
  type: 'test'
  ...
# Subtest: 空枱開始點餐只建立意圖，正式提交餐品時才開枱
ok 46 - 空枱開始點餐只建立意圖，正式提交餐品時才開枱
  ---
  duration_ms: 0.450157
  type: 'test'
  ...
# Subtest: 舊版本遺留的空堂食會話會安全清理，有餐品的會話不受影響
ok 47 - 舊版本遺留的空堂食會話會安全清理，有餐品的會話不受影響
  ---
  duration_ms: 0.322628
  type: 'test'
  ...
# Subtest: 堂食頁提供簡潔枱詳情、半屏待確認及兩層付款操作
ok 48 - 堂食頁提供簡潔枱詳情、半屏待確認及兩層付款操作
  ---
  duration_ms: 0.372321
  type: 'test'
  ...
# Subtest: 正式堂食頁不會自動建立示範枱或示範訂單，掃碼入口標示第二版保留
ok 49 - 正式堂食頁不會自動建立示範枱或示範訂單，掃碼入口標示第二版保留
  ---
  duration_ms: 0.309519
  type: 'test'
  ...
# Subtest: 堂食枱卡直接顯示開枱、三十五分鐘及首三項餐點摘要
ok 50 - 堂食枱卡直接顯示開枱、三十五分鐘及首三項餐點摘要
  ---
  duration_ms: 0.25622
  type: 'test'
  ...
# Subtest: 現有點餐及訂單底欄可以進入獨立堂食頁
ok 51 - 現有點餐及訂單底欄可以進入獨立堂食頁
  ---
  duration_ms: 0.850309
  type: 'test'
  ...
# Subtest: 堂食點單提供取消入口並同步清除失效堂食脈絡
ok 52 - 堂食點單提供取消入口並同步清除失效堂食脈絡
  ---
  duration_ms: 0.733677
  type: 'test'
  ...
# Subtest: 點單頁兩個堂食落單入口都會讀取完成歷史避免重複流水
ok 53 - 點單頁兩個堂食落單入口都會讀取完成歷史避免重複流水
  ---
  duration_ms: 1.19556
  type: 'test'
  ...
# Subtest: 堂食頁最近訂單使用共用時間排序及三位顯示號碼
ok 54 - 堂食頁最近訂單使用共用時間排序及三位顯示號碼
  ---
  duration_ms: 0.252865
  type: 'test'
  ...
# Subtest: draft numbers are sequential within each terminal prefix
ok 55 - draft numbers are sequential within each terminal prefix
  ---
  duration_ms: 1.31672
  type: 'test'
  ...
# Subtest: a removed draft number is never reissued after retrieval
ok 56 - a removed draft number is never reissued after retrieval
  ---
  duration_ms: 0.484287
  type: 'test'
  ...
# Subtest: saving a cart records terminal ownership and an audit event
ok 57 - saving a cart records terminal ownership and an audit event
  ---
  duration_ms: 0.247186
  type: 'test'
  ...
# Subtest: taking over another terminal draft preserves lineage
ok 58 - taking over another terminal draft preserves lineage
  ---
  duration_ms: 0.545888
  type: 'test'
  ...
# Subtest: 日結會清空當時所有草稿，而新營業日草稿不會被誤刪
ok 59 - 日結會清空當時所有草稿，而新營業日草稿不會被誤刪
  ---
  duration_ms: 1.844361
  type: 'test'
  ...
# Subtest: a taken-over cart is renumbered under the terminal that saves it again
ok 60 - a taken-over cart is renumbered under the terminal that saves it again
  ---
  duration_ms: 0.407323
  type: 'test'
  ...
# Subtest: checkout records which terminal completed the order
ok 61 - checkout records which terminal completed the order
  ---
  duration_ms: 0.282769
  type: 'test'
  ...
# node:internal/modules/run_main:123
#     triggerUncaughtException(
#     ^
# AssertionError [ERR_ASSERTION]: shared core must sync child-page status actions
#     at file:///home/runner/work/morefunos-smt/morefunos-smt/tests/global-status-actions-contract.test.mjs:10:8
#     at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
#     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
#     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5) {
#   generatedMessage: false,
#   code: 'ERR_ASSERTION',
#   actual: false,
#   expected: true,
#   operator: '==',
#   diff: 'simple'
# }
# Node.js v22.23.1
# Subtest: tests/global-status-actions-contract.test.mjs
not ok 9 - tests/global-status-actions-contract.test.mjs
  ---
  duration_ms: 54.58034
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/global-status-actions-contract.test.mjs:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
# node:internal/modules/run_main:123
#     triggerUncaughtException(
#     ^
# AssertionError [ERR_ASSERTION]: page-specific status actions must remain functional through shared core
#     at file:///home/runner/work/morefunos-smt/morefunos-smt/tests/health-seal-contract.test.mjs:16:8
#     at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
#     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
#     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5) {
#   generatedMessage: false,
#   code: 'ERR_ASSERTION',
#   actual: false,
#   expected: true,
#   operator: '==',
#   diff: 'simple'
# }
# Node.js v22.23.1
# Subtest: tests/health-seal-contract.test.mjs
not ok 10 - tests/health-seal-contract.test.mjs
  ---
  duration_ms: 51.102199
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/health-seal-contract.test.mjs:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
# Subtest: Firebase keyed catalog normalizes categories, products and availability
ok 64 - Firebase keyed catalog normalizes categories, products and availability
  ---
  duration_ms: 2.859424
  type: 'test'
  ...
# Subtest: remote products use live values while inheriting locked SMT behaviour by code
ok 65 - remote products use live values while inheriting locked SMT behaviour by code
  ---
  duration_ms: 2.37023
  type: 'test'
  ...
# Subtest: live drink products become quick drinks and retain modifier capabilities
ok 66 - live drink products become quick drinks and retain modifier capabilities
  ---
  duration_ms: 0.630253
  type: 'test'
  ...
# Subtest: menu loader caches a successful response and falls back to cache offline
ok 67 - menu loader caches a successful response and falls back to cache offline
  ---
  duration_ms: 1.351702
  type: 'test'
  ...
# Subtest: runtime uses Firebase RTDB and contains no Apps Script transport
ok 68 - runtime uses Firebase RTDB and contains no Apps Script transport
  ---
  duration_ms: 11.547188
  type: 'test'
  ...
# Subtest: 共用頁面橋接會從正式設定套用主題及聲音狀態
ok 69 - 共用頁面橋接會從正式設定套用主題及聲音狀態
  ---
  duration_ms: 2.713568
  type: 'test'
  ...
# Subtest: 點單頁重載會讀取更多頁保存的快速模式及產品圖片設定
ok 70 - 點單頁重載會讀取更多頁保存的快速模式及產品圖片設定
  ---
  duration_ms: 0.189311
  type: 'test'
  ...
# Subtest: 正式結帳會建立中央打印工作而不把排隊當成實體成功
ok 71 - 正式結帳會建立中央打印工作而不把排隊當成實體成功
  ---
  duration_ms: 0.18232
  type: 'test'
  ...
# Subtest: 訂單重印會即時匯入中央打印工作佇列
ok 72 - 訂單重印會即時匯入中央打印工作佇列
  ---
  duration_ms: 0.15522
  type: 'test'
  ...
# Subtest: 堂食正式落單後會把堂食打印工作匯入中央佇列
ok 73 - 堂食正式落單後會把堂食打印工作匯入中央佇列
  ---
  duration_ms: 0.130723
  type: 'test'
  ...
# Subtest: 營業日固定由早上五時起計並排除上一營業日訂單
ok 74 - 營業日固定由早上五時起計並排除上一營業日訂單
  ---
  duration_ms: 28.054582
  type: 'test'
  ...
# Subtest: 報表分開淨銷售、付款、平台結算、待核實及打印異常
ok 75 - 報表分開淨銷售、付款、平台結算、待核實及打印異常
  ---
  duration_ms: 1.242369
  type: 'test'
  ...
# Subtest: 歷史報表支援今日昨日七日三十日三個月六個月及自訂日期
ok 76 - 歷史報表支援今日昨日七日三十日三個月六個月及自訂日期
  ---
  duration_ms: 1.724764
  type: 'test'
  ...
# Subtest: 選定歷史範圍會由訂單明細重算而不是只讀今日
ok 77 - 選定歷史範圍會由訂單明細重算而不是只讀今日
  ---
  duration_ms: 3.598649
  type: 'test'
  ...
# Subtest: 付款及渠道分拆提供對數欄位、狀態及對應訂單
ok 78 - 付款及渠道分拆提供對數欄位、狀態及對應訂單
  ---
  duration_ms: 0.616603
  type: 'test'
  ...
# Subtest: 結帳、堂食及舊核數的付款別名會合併到同一對數方式
ok 79 - 結帳、堂食及舊核數的付款別名會合併到同一對數方式
  ---
  duration_ms: 0.899742
  type: 'test'
  ...
# Subtest: 未知付款方式歸入其他而不會製造無限新分類
ok 80 - 未知付款方式歸入其他而不會製造無限新分類
  ---
  duration_ms: 0.494502
  type: 'test'
  ...
# Subtest: 堂食分拆付款按每次實收方式對數而不只顯示組合付款
ok 81 - 堂食分拆付款按每次實收方式對數而不只顯示組合付款
  ---
  duration_ms: 0.616403
  type: 'test'
  ...
# Subtest: 付款實收讀取真正 paidAmount 並保留短收及多收的正負差額
ok 82 - 付款實收讀取真正 paidAmount 並保留短收及多收的正負差額
  ---
  duration_ms: 0.775338
  type: 'test'
  ...
# Subtest: 現金對數以收款減找續計算，不會把找續再扣一次
ok 83 - 現金對數以收款減找續計算，不會把找續再扣一次
  ---
  duration_ms: 0.901916
  type: 'test'
  ...
# Subtest: 平台付款別名統一顯示為平台代收
ok 84 - 平台付款別名統一顯示為平台代收
  ---
  duration_ms: 1.363018
  type: 'test'
  ...
# Subtest: 商品分類、時段及異常資料保留對應訂單供介面下鑽
ok 85 - 商品分類、時段及異常資料保留對應訂單供介面下鑽
  ---
  duration_ms: 0.622692
  type: 'test'
  ...
# Subtest: 異常報表會由現有 audit 列出付款更改、部分取消、重印及付款問題
ok 86 - 異常報表會由現有 audit 列出付款更改、部分取消、重印及付款問題
  ---
  duration_ms: 0.578908
  type: 'test'
  ...
# Subtest: 異常操作按 audit 發生時間入報表並保留跨日原訂單下鑽
ok 87 - 異常操作按 audit 發生時間入報表並保留跨日原訂單下鑽
  ---
  duration_ms: 0.314355
  type: 'test'
  ...
# Subtest: 港幣盤點只提供店舖實際接收的五款紙幣及三款硬幣
ok 88 - 港幣盤點只提供店舖實際接收的五款紙幣及三款硬幣
  ---
  duration_ms: 0.511257
  type: 'test'
  ...
# Subtest: 新營業日沿用上次留底並容許開機時加減調整
ok 89 - 新營業日沿用上次留底並容許開機時加減調整
  ---
  duration_ms: 0.322528
  type: 'test'
  ...
# Subtest: 未手動調整前按開工底金建議提取及留底，且不會留多過實點現金
ok 90 - 未手動調整前按開工底金建議提取及留底，且不會留多過實點現金
  ---
  duration_ms: 0.370239
  type: 'test'
  ...
# Subtest: 日結按實點現金反推待核實訂單的現金及非現金部分
ok 91 - 日結按實點現金反推待核實訂單的現金及非現金部分
  ---
  duration_ms: 0.481833
  type: 'test'
  ...
# Subtest: 日結保存現金、支出、差異、版本及稽核而不改寫訂單
ok 92 - 日結保存現金、支出、差異、版本及稽核而不改寫訂單
  ---
  duration_ms: 3.318954
  type: 'test'
  ...
# Subtest: 超出百分之三差異而沒有原因不可正式日結
ok 93 - 超出百分之三差異而沒有原因不可正式日結
  ---
  duration_ms: 0.453562
  type: 'test'
  ...
# Subtest: 超出百分之三差異必須明確授權，並保存提取及留底現金
ok 94 - 超出百分之三差異必須明確授權，並保存提取及留底現金
  ---
  duration_ms: 0.870749
  type: 'test'
  ...
# Subtest: 提取及留底現金必須完整分配實點現金
ok 95 - 提取及留底現金必須完整分配實點現金
  ---
  duration_ms: 0.731623
  type: 'test'
  ...
# Subtest: CSV 匯出包含摘要、訂單及商品明細並正確處理逗號
ok 96 - CSV 匯出包含摘要、訂單及商品明細並正確處理逗號
  ---
  duration_ms: 1.159297
  type: 'test'
  ...
# Subtest: 備份有可重算校驗值，任何內容被改動都會驗證失敗
ok 97 - 備份有可重算校驗值，任何內容被改動都會驗證失敗
  ---
  duration_ms: 0.909998
  type: 'test'
  ...
# Subtest: 恢復可以只套用設定或完整資料，並拒絕無效備份
ok 98 - 恢復可以只套用設定或完整資料，並拒絕無效備份
  ---
  duration_ms: 0.726946
  type: 'test'
  ...
# Subtest: 系統診斷清楚分開本機能力、同步積壓及未設定更新來源
ok 99 - 系統診斷清楚分開本機能力、同步積壓及未設定更新來源
  ---
  duration_ms: 0.418649
  type: 'test'
  ...
# Subtest: 更多頁已接入正式路由及五項底部導航
ok 100 - 更多頁已接入正式路由及五項底部導航
  ---
  duration_ms: 3.831363
  type: 'test'
  ...
# Subtest: 更多主畫面有營業日及六個帶營運狀態的入口
ok 101 - 更多主畫面有營業日及六個帶營運狀態的入口
  ---
  duration_ms: 0.472039
  type: 'test'
  ...
# Subtest: 更多首頁直接顯示今日營業、渠道及付款分析而毋須進入第二層
ok 102 - 更多首頁直接顯示今日營業、渠道及付款分析而毋須進入第二層
  ---
  duration_ms: 0.23687
  type: 'test'
  ...
# Subtest: 六個入口均有可讀細節面板而非只顯示簡單訊息
ok 103 - 六個入口均有可讀細節面板而非只顯示簡單訊息
  ---
  duration_ms: 0.350429
  type: 'test'
  ...
# Subtest: 日結、恢復、更新及退出全螢幕均先開二次確認
ok 104 - 日結、恢復、更新及退出全螢幕均先開二次確認
  ---
  duration_ms: 0.824781
  type: 'test'
  ...
# Subtest: 六個入口已由死按鈕改成真實本機操作
ok 105 - 六個入口已由死按鈕改成真實本機操作
  ---
  duration_ms: 0.467352
  type: 'test'
  ...
# Subtest: 顯示設定可本機保存，彈窗遮罩不可點空白關閉
ok 106 - 顯示設定可本機保存，彈窗遮罩不可點空白關閉
  ---
  duration_ms: 0.306373
  type: 'test'
  ...
# Subtest: 顯示與操作可設定分類每行格數、行數及最後一格搜尋
ok 107 - 顯示與操作可設定分類每行格數、行數及最後一格搜尋
  ---
  duration_ms: 0.326614
  type: 'test'
  ...
# Subtest: 更多頁沿用共用基礎樣式並固定頂底欄
ok 108 - 更多頁沿用共用基礎樣式並固定頂底欄
  ---
  duration_ms: 0.578066
  type: 'test'
  ...
# Subtest: 收銀日結提供點算、支出、差異原因、版本及正式保存
ok 109 - 收銀日結提供點算、支出、差異原因、版本及正式保存
  ---
  duration_ms: 0.666757
  type: 'test'
  ...
# Subtest: 日結提供面額互推、開工底金、提取留底、待核實反推及超額授權
ok 110 - 日結提供面額互推、開工底金、提取留底、待核實反推及超額授權
  ---
  duration_ms: 0.382616
  type: 'test'
  ...
# Subtest: 開機底金顯示上次留底、調整額及確認後開工現金
ok 111 - 開機底金顯示上次留底、調整額及確認後開工現金
  ---
  duration_ms: 0.205814
  type: 'test'
  ...
# Subtest: 營業分析同時展示每個渠道及每種付款方式的單數和金額
ok 112 - 營業分析同時展示每個渠道及每種付款方式的單數和金額
  ---
  duration_ms: 0.155139
  type: 'test'
  ...
# Subtest: 全局共用樣式提供觸控回饋、彈窗動效及減少動效模式
ok 113 - 全局共用樣式提供觸控回饋、彈窗動效及減少動效模式
  ---
  duration_ms: 0.303249
  type: 'test'
  ...
# Subtest: 報表五個分頁讀取同一選定日期報表並可下載 CSV
ok 114 - 報表五個分頁讀取同一選定日期報表並可下載 CSV
  ---
  duration_ms: 0.217682
  type: 'test'
  ...
# Subtest: 歷史報表提供七種日期入口及自訂開始結束日期
ok 115 - 歷史報表提供七種日期入口及自訂開始結束日期
  ---
  duration_ms: 0.35781
  type: 'test'
  ...
# Subtest: 付款對數逐項顯示單數應收實收退款差額狀態並可下鑽
ok 116 - 付款對數逐項顯示單數應收實收退款差額狀態並可下鑽
  ---
  duration_ms: 0.18231
  type: 'test'
  ...
# Subtest: 商品報表可切換產品及分類並保留時段與日結紀錄
ok 117 - 商品報表可切換產品及分類並保留時段與日結紀錄
  ---
  duration_ms: 0.167187
  type: 'test'
  ...
# Subtest: 打印中心可設定網絡設備、選格式、診斷、預覽、重試及改送
ok 118 - 打印中心可設定網絡設備、選格式、診斷、預覽、重試及改送
  ---
  duration_ms: 0.493361
  type: 'test'
  ...
# Subtest: 備份中心可以建立、下載、匯入、驗證及分範圍恢復
ok 119 - 備份中心可以建立、下載、匯入、驗證及分範圍恢復
  ---
  duration_ms: 0.286414
  type: 'test'
  ...
# Subtest: 系統中心提供真實診斷、操作紀錄、同步重試及更新檢查結果
ok 120 - 系統中心提供真實診斷、操作紀錄、同步重試及更新檢查結果
  ---
  duration_ms: 0.306434
  type: 'test'
  ...
# node:internal/modules/run_main:123
#     triggerUncaughtException(
#     ^
# AssertionError [ERR_ASSERTION]: missing responsive More contract: body[data-page="more"] .more-workspace{container-type:size;container-name:more-workspace;
#     at file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-responsive-contract.test.mjs:16:36
#     at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
#     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
#     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5) {
#   generatedMessage: false,
#   code: 'ERR_ASSERTION',
#   actual: false,
#   expected: true,
#   operator: '==',
#   diff: 'simple'
# }
# Node.js v22.23.1
# Subtest: tests/more-responsive-contract.test.mjs
not ok 15 - tests/more-responsive-contract.test.mjs
  ---
  duration_ms: 39.599662
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-responsive-contract.test.mjs:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
# Subtest: standalone riceball is packaging-fee exempt even when display category is popularity
ok 122 - standalone riceball is packaging-fee exempt even when display category is popularity
  ---
  duration_ms: 1.352382
  type: 'test'
  ...
# Subtest: standalone drink is packaging-fee exempt
ok 123 - standalone drink is packaging-fee exempt
  ---
  duration_ms: 0.345762
  type: 'test'
  ...
# Subtest: standalone riceball plus discounted drink remains packaging-fee exempt
ok 124 - standalone riceball plus discounted drink remains packaging-fee exempt
  ---
  duration_ms: 2.264874
  type: 'test'
  ...
# Subtest: riceball combo and other takeaway boxed meals still charge packaging
ok 125 - riceball combo and other takeaway boxed meals still charge packaging
  ---
  duration_ms: 0.365171
  type: 'test'
  ...
# SMT_ORDER_CART_DOMAIN_OK
# Subtest: tests/order-cart-domain.test.mjs
ok 17 - tests/order-cart-domain.test.mjs
  ---
  duration_ms: 59.870979
  type: 'test'
  ...
# Subtest: quick mode uses a direct-add product action
ok 127 - quick mode uses a direct-add product action
  ---
  duration_ms: 3.547172
  type: 'test'
  ...
# Subtest: cart rows expose separate quantity and edit controls
ok 128 - cart rows expose separate quantity and edit controls
  ---
  duration_ms: 0.410038
  type: 'test'
  ...
# Subtest: product editor is a compact anchored card with explicit confirmation
ok 129 - product editor is a compact anchored card with explicit confirmation
  ---
  duration_ms: 0.342618
  type: 'test'
  ...
# Subtest: modal backdrop is inert and cannot dismiss changes
ok 130 - modal backdrop is inert and cannot dismiss changes
  ---
  duration_ms: 0.24287
  type: 'test'
  ...
# Subtest: cart quantity updates totals, trims drink assignments, and removes zero rows
ok 131 - cart quantity updates totals, trims drink assignments, and removes zero rows
  ---
  duration_ms: 1.181089
  type: 'test'
  ...
# Subtest: order shell keeps the bottom navigation inside the fixed canvas
ok 132 - order shell keeps the bottom navigation inside the fixed canvas
  ---
  duration_ms: 0.36509
  type: 'test'
  ...
# Subtest: checkout call to action shows the payable total
ok 133 - checkout call to action shows the payable total
  ---
  duration_ms: 0.363047
  type: 'test'
  ...
# Subtest: quick order mode, drink strip, and quick assist are independent settings
ok 134 - quick order mode, drink strip, and quick assist are independent settings
  ---
  duration_ms: 0.267697
  type: 'test'
  ...
# Subtest: display settings include the three cart ratios
ok 135 - display settings include the three cart ratios
  ---
  duration_ms: 0.573549
  type: 'test'
  ...
# Subtest: cards are positioned from the pressed control and expose a pointer side
ok 136 - cards are positioned from the pressed control and expose a pointer side
  ---
  duration_ms: 0.679286
  type: 'test'
  ...
# Subtest: pending orders use a vertical split
ok 137 - pending orders use a vertical split
  ---
  duration_ms: 0.332313
  type: 'test'
  ...
# Subtest: every expanded card is owned by the single modal controller
ok 138 - every expanded card is owned by the single modal controller
  ---
  duration_ms: 0.307706
  type: 'test'
  ...
# Subtest: pending order card is actionable and grouped by channel
ok 139 - pending order card is actionable and grouped by channel
  ---
  duration_ms: 0.179046
  type: 'test'
  ...
# Subtest: anchored cards support all four pointer directions and stay between fixed bars
ok 140 - anchored cards support all four pointer directions and stay between fixed bars
  ---
  duration_ms: 0.311621
  type: 'test'
  ...
# Subtest: cart image visibility is configurable
ok 141 - cart image visibility is configurable
  ---
  duration_ms: 0.192585
  type: 'test'
  ...
# Subtest: quick drink adjustment stays compact without repeating its image
ok 142 - quick drink adjustment stays compact without repeating its image
  ---
  duration_ms: 0.289088
  type: 'test'
  ...
# Subtest: shell uses a fixed T2S canvas fitted inside both viewport dimensions
ok 143 - shell uses a fixed T2S canvas fitted inside both viewport dimensions
  ---
  duration_ms: 21.15186
  type: 'test'
  ...
# Subtest: root height chain and scroll regions keep both bars fixed
ok 144 - root height chain and scroll regions keep both bars fixed
  ---
  duration_ms: 1.692286
  type: 'test'
  ...
# Subtest: quick drinks are a collapsed upward drawer with reorder controls
ok 145 - quick drinks are a collapsed upward drawer with reorder controls
  ---
  duration_ms: 0.204573
  type: 'test'
  ...
# Subtest: drink editor supports multiple configuration groups without forced images
ok 146 - drink editor supports multiple configuration groups without forced images
  ---
  duration_ms: 0.150553
  type: 'test'
  ...
# Subtest: completion exposes automatic, specified, and demo link-up flows
ok 147 - completion exposes automatic, specified, and demo link-up flows
  ---
  duration_ms: 0.11524
  type: 'test'
  ...
# Subtest: large product grid reserves complete rows and never overlaps cards
ok 148 - large product grid reserves complete rows and never overlaps cards
  ---
  duration_ms: 0.254948
  type: 'test'
  ...
# Subtest: collapsed quick drinks use the approved centred pill above navigation
ok 149 - collapsed quick drinks use the approved centred pill above navigation
  ---
  duration_ms: 0.220937
  type: 'test'
  ...
# Subtest: operational surfaces include sold-out preview and new-order toast
ok 150 - operational surfaces include sold-out preview and new-order toast
  ---
  duration_ms: 0.155801
  type: 'test'
  ...
# Subtest: 分類列最右固定搜尋入口並可按名稱或編號篩選產品
ok 151 - 分類列最右固定搜尋入口並可按名稱或編號篩選產品
  ---
  duration_ms: 0.33044
  type: 'test'
  ...
# Subtest: 分類列讀取後台全局設定並按五六七格及一兩行輸出版面
ok 152 - 分類列讀取後台全局設定並按五六七格及一兩行輸出版面
  ---
  duration_ms: 0.171354
  type: 'test'
  ...
# Subtest: 新單提示最少一張產品卡闊及兩張產品卡高
ok 153 - 新單提示最少一張產品卡闊及兩張產品卡高
  ---
  duration_ms: 0.205745
  type: 'test'
  ...
# Subtest: 快捷飲品展開後八秒無操作自動收起並於操作時重時計時
ok 154 - 快捷飲品展開後八秒無操作自動收起並於操作時重時計時
  ---
  duration_ms: 0.140148
  type: 'test'
  ...
# Subtest: sold-out preview reads the same local supply status as the badge
ok 155 - sold-out preview reads the same local supply status as the badge
  ---
  duration_ms: 0.10138
  type: 'test'
  ...
# Subtest: order cards distinguish sold-out orange from paused red without greying
ok 156 - order cards distinguish sold-out orange from paused red without greying
  ---
  duration_ms: 0.26971
  type: 'test'
  ...
# Subtest: paused products sort to the end of their current order category
ok 157 - paused products sort to the end of their current order category
  ---
  duration_ms: 0.18246
  type: 'test'
  ...
# Subtest: accepting a verified pending order creates a running order with a 30 minute deadline
ok 158 - accepting a verified pending order creates a running order with a 30 minute deadline
  ---
  duration_ms: 0.210993
  type: 'test'
  ...
# Subtest: running orders auto-complete after 30 minutes without intermediate states
ok 159 - running orders auto-complete after 30 minutes without intermediate states
  ---
  duration_ms: 0.243201
  type: 'test'
  ...
# Subtest: WhatsApp QR target opens the customer chat with the preset message
ok 160 - WhatsApp QR target opens the customer chat with the preset message
  ---
  duration_ms: 0.239094
  type: 'test'
  ...
# Subtest: pending verification uses start review then confirm order wording
ok 161 - pending verification uses start review then confirm order wording
  ---
  duration_ms: 0.22947
  type: 'test'
  ...
# Subtest: cart locks price and quantity-edit controls into dedicated regions
ok 162 - cart locks price and quantity-edit controls into dedicated regions
  ---
  duration_ms: 0.253005
  type: 'test'
  ...
# Subtest: drink adjustment starts compact and expands only after add adjustment
ok 163 - drink adjustment starts compact and expands only after add adjustment
  ---
  duration_ms: 0.230531
  type: 'test'
  ...
# Subtest: specified pairing candidates use a three-column text-card grid
ok 164 - specified pairing candidates use a three-column text-card grid
  ---
  duration_ms: 2.361657
  type: 'test'
  ...
# Subtest: cart keeps price flush right and actions aligned with the image
ok 165 - cart keeps price flush right and actions aligned with the image
  ---
  duration_ms: 0.355917
  type: 'test'
  ...
# Subtest: 首次渲染由共用函數提供待處理數量給頂欄及導航
ok 166 - 首次渲染由共用函數提供待處理數量給頂欄及導航
  ---
  duration_ms: 0.556324
  type: 'test'
  ...
# Subtest: 點單頁最近訂單讀取共用歷史而不再寫死舊單號
ok 167 - 點單頁最近訂單讀取共用歷史而不再寫死舊單號
  ---
  duration_ms: 0.174198
  type: 'test'
  ...
# Subtest: 子頁啟動錯誤會顯示可見後備畫面而不是白屏
ok 168 - 子頁啟動錯誤會顯示可見後備畫面而不是白屏
  ---
  duration_ms: 15.796215
  type: 'test'
  ...
# Subtest: specified pairing creates dynamic labelled groups
ok 169 - specified pairing creates dynamic labelled groups
  ---
  duration_ms: 0.414824
  type: 'test'
  ...
# Subtest: all drink selection surfaces share one image-first Drink Choice Card
ok 170 - all drink selection surfaces share one image-first Drink Choice Card
  ---
  duration_ms: 2.743502
  type: 'test'
  ...
# Subtest: riceball and snack can become one pending-drink combo without a cart drink
ok 171 - riceball and snack can become one pending-drink combo without a cart drink
  ---
  duration_ms: 0.723882
  type: 'test'
  ...
# Subtest: quick drink embeds inside combo without first becoming a cart line
ok 172 - quick drink embeds inside combo without first becoming a cart line
  ---
  duration_ms: 0.33099
  type: 'test'
  ...
# Subtest: cart drink can be consumed into a combo and remaining quantity stays standalone
ok 173 - cart drink can be consumed into a combo and remaining quantity stays standalone
  ---
  duration_ms: 0.21618
  type: 'test'
  ...
# Subtest: dissolving a combo restores standalone components at single prices
ok 174 - dissolving a combo restores standalone components at single prices
  ---
  duration_ms: 0.470387
  type: 'test'
  ...
# Subtest: specified pairing offers quick drinks and accepts main plus snack before drink
ok 175 - specified pairing offers quick drinks and accepts main plus snack before drink
  ---
  duration_ms: 0.164033
  type: 'test'
  ...
# Subtest: order page loads the shared live menu contract with offline fallback
ok 176 - order page loads the shared live menu contract with offline fallback
  ---
  duration_ms: 0.165094
  type: 'test'
  ...
# Subtest: 每日流水以早上五時為分界並固定三位數
ok 177 - 每日流水以早上五時為分界並固定三位數
  ---
  duration_ms: 1.817261
  type: 'test'
  ...
# Subtest: 所有渠道共用同一每日流水並兼容舊 P 編號
ok 178 - 所有渠道共用同一每日流水並兼容舊 P 編號
  ---
  duration_ms: 0.559128
  type: 'test'
  ...
# Subtest: 每日流水到 P999 後拒絕循環覆蓋
ok 179 - 每日流水到 P999 後拒絕循環覆蓋
  ---
  duration_ms: 0.719926
  type: 'test'
  ...
# Subtest: 顯示號碼支援新舊訂單並按真實時間找最新一張
ok 180 - 顯示號碼支援新舊訂單並按真實時間找最新一張
  ---
  duration_ms: 0.44547
  type: 'test'
  ...
# Subtest: 流水營業日及最近訂單以開單時間為準而不受完成時間延遲影響
ok 181 - 流水營業日及最近訂單以開單時間為準而不受完成時間延遲影響
  ---
  duration_ms: 0.489474
  type: 'test'
  ...
# Subtest: 永久編號使用實際日期並在堂食單包含枱號
ok 182 - 永久編號使用實際日期並在堂食單包含枱號
  ---
  duration_ms: 0.280776
  type: 'test'
  ...
# Subtest: takeaway packaging fee exempts standalone riceballs and drinks
ok 183 - takeaway packaging fee exempts standalone riceballs and drinks
  ---
  duration_ms: 1.893865
  type: 'test'
  ...
# Subtest: checkout discount does not discount packaging fee
ok 184 - checkout discount does not discount packaging fee
  ---
  duration_ms: 0.532449
  type: 'test'
  ...
# Subtest: mixed service order splits production and packing jobs
ok 185 - mixed service order splits production and packing jobs
  ---
  duration_ms: 44.624051
  type: 'test'
  ...
# node:internal/modules/run_main:123
#     triggerUncaughtException(
#     ^
# AssertionError [ERR_ASSERTION]: service badge must remain compact and aligned with the current 60px cart image
#     at file:///home/runner/work/morefunos-smt/morefunos-smt/tests/order-required-completion-core.test.mjs:16:8
#     at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
#     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
#     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5) {
#   generatedMessage: false,
#   code: 'ERR_ASSERTION',
#   actual: false,
#   expected: true,
#   operator: '==',
#   diff: 'simple'
# }
# Node.js v22.23.1
# Subtest: tests/order-required-completion-core.test.mjs
not ok 21 - tests/order-required-completion-core.test.mjs
  ---
  duration_ms: 46.425049
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-required-completion-core.test.mjs:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
# Subtest: order runtime does not load post-render drink enhancer
ok 187 - order runtime does not load post-render drink enhancer
  ---
  duration_ms: 1.744693
  type: 'test'
  ...
# Subtest: drink assignment badges render from assignment state
ok 188 - drink assignment badges render from assignment state
  ---
  duration_ms: 0.453642
  type: 'test'
  ...
# Subtest: modal policy is owned by order core, not an external runtime layer
ok 189 - modal policy is owned by order core, not an external runtime layer
  ---
  duration_ms: 0.35754
  type: 'test'
  ...
# Subtest: order runtime keeps required completion in page state
ok 190 - order runtime keeps required completion in page state
  ---
  duration_ms: 0.335206
  type: 'test'
  ...
# Subtest: transient UI state bypasses transaction persistence and full normalization
ok 191 - transient UI state bypasses transaction persistence and full normalization
  ---
  duration_ms: 0.357519
  type: 'test'
  ...
# Subtest: order page uses lazy surface rendering
ok 192 - order page uses lazy surface rendering
  ---
  duration_ms: 0.238342
  type: 'test'
  ...
# Subtest: 運行訂單滿三十分鐘會持久轉入歷史而唔係只改畫面
ok 193 - 運行訂單滿三十分鐘會持久轉入歷史而唔係只改畫面
  ---
  duration_ms: 1.892152
  type: 'test'
  ...
# Subtest: filters can switch between source, payment exception, print exception and history
ok 194 - filters can switch between source, payment exception, print exception and history
  ---
  duration_ms: 0.33035
  type: 'test'
  ...
# Subtest: changing channel and payment persists values and audit instead of only showing a toast
ok 195 - changing channel and payment persists values and audit instead of only showing a toast
  ---
  duration_ms: 0.345352
  type: 'test'
  ...
# Subtest: 更改渠道會套用正式付款狀態，非現場渠道不可保留舊付款方式
ok 196 - 更改渠道會套用正式付款狀態，非現場渠道不可保留舊付款方式
  ---
  duration_ms: 0.313865
  type: 'test'
  ...
# Subtest: 待核實訂單可核實付款或標記問題及通知客戶
ok 197 - 待核實訂單可核實付款或標記問題及通知客戶
  ---
  duration_ms: 0.435014
  type: 'test'
  ...
# Subtest: 訂單頁待核實入口共用完整核數及通知客戶操作
ok 198 - 訂單頁待核實入口共用完整核數及通知客戶操作
  ---
  duration_ms: 0.189601
  type: 'test'
  ...
# Subtest: 問題原因提供快選亦容許留空，唔會卡住待處理流程
ok 199 - 問題原因提供快選亦容許留空，唔會卡住待處理流程
  ---
  duration_ms: 0.267305
  type: 'test'
  ...
# Subtest: 打印異常訂單由職員打開後勾選需要重印的文件
ok 200 - 打印異常訂單由職員打開後勾選需要重印的文件
  ---
  duration_ms: 0.207978
  type: 'test'
  ...
# Subtest: 部分取消使用商品行內加減及一次確認，不再逐項使用下拉選單
ok 201 - 部分取消使用商品行內加減及一次確認，不再逐項使用下拉選單
  ---
  duration_ms: 0.516665
  type: 'test'
  ...
# Subtest: partial cancellation keeps cancelled quantity visible and recalculates total
ok 202 - partial cancellation keeps cancelled quantity visible and recalculates total
  ---
  duration_ms: 0.733997
  type: 'test'
  ...
# Subtest: whole-order cancellation remains in history instead of disappearing
ok 203 - whole-order cancellation remains in history instead of disappearing
  ---
  duration_ms: 0.35148
  type: 'test'
  ...
# Subtest: reprint creates a visible print job and clears the exception after retry
ok 204 - reprint creates a visible print job and clears the exception after retry
  ---
  duration_ms: 0.249559
  type: 'test'
  ...
# Subtest: 掛單只開左右面板，再由一般掛單或堂食枱號完成操作
ok 205 - 掛單只開左右面板，再由一般掛單或堂食枱號完成操作
  ---
  duration_ms: 1.317561
  type: 'test'
  ...
# Subtest: 取單使用左列表右內容，並固定返回、作廢及取單操作
ok 206 - 取單使用左列表右內容，並固定返回、作廢及取單操作
  ---
  duration_ms: 0.359713
  type: 'test'
  ...
# Subtest: checkout persists the completing terminal and order audit
ok 207 - checkout persists the completing terminal and order audit
  ---
  duration_ms: 0.174999
  type: 'test'
  ...
# Subtest: bottom navigation opens the independent orders page
ok 208 - bottom navigation opens the independent orders page
  ---
  duration_ms: 0.292263
  type: 'test'
  ...
# Subtest: orders page uses the three approved channel columns and payment methods
ok 209 - orders page uses the three approved channel columns and payment methods
  ---
  duration_ms: 0.229519
  type: 'test'
  ...
# Subtest: 每件產品保存獨立堂食或外賣選擇
ok 210 - 每件產品保存獨立堂食或外賣選擇
  ---
  duration_ms: 0.199987
  type: 'test'
  ...
# Subtest: reverse checkout reuse loads the original cart then navigates to the locked ordering page
ok 211 - reverse checkout reuse loads the original cart then navigates to the locked ordering page
  ---
  duration_ms: 0.370529
  type: 'test'
  ...
# Subtest: 預設建立五部設備及四款由管理端發佈的示範格式
ok 212 - 預設建立五部設備及四款由管理端發佈的示範格式
  ---
  duration_ms: 2.301068
  type: 'test'
  ...
# Subtest: 網絡打印機必須有有效網絡地址、連接埠、紙寬、用途及格式
ok 213 - 網絡打印機必須有有效網絡地址、連接埠、紙寬、用途及格式
  ---
  duration_ms: 0.846634
  type: 'test'
  ...
# Subtest: 製作及打包統計同時提供每款產品與飲品、飯餐、飯團總數
ok 214 - 製作及打包統計同時提供每款產品與飲品、飯餐、飯團總數
  ---
  duration_ms: 11.362676
  type: 'test'
  ...
# Subtest: 四款格式生成可讀預覽，製作單及打包單頂部先顯示合併統計
ok 215 - 四款格式生成可讀預覽，製作單及打包單頂部先顯示合併統計
  ---
  duration_ms: 15.069314
  type: 'test'
  ...
# Subtest: 舊非 P 渠道訂單重印保留原識別而不會顯示測試工作
ok 216 - 舊非 P 渠道訂單重印保留原識別而不會顯示測試工作
  ---
  duration_ms: 0.442845
  type: 'test'
  ...
# Subtest: 打印工作按用途及格式路由，未設定設備會停在 blocked 而非假成功
ok 217 - 打印工作按用途及格式路由，未設定設備會停在 blocked 而非假成功
  ---
  duration_ms: 3.074503
  type: 'test'
  ...
# Subtest: 重試沿用同一工作並增加嘗試；改送會保存原目的地
ok 218 - 重試沿用同一工作並增加嘗試；改送會保存原目的地
  ---
  duration_ms: 0.483696
  type: 'test'
  ...
# Subtest: 安卓橋接封包包含傳輸資料、格式內容及冪等工作編號
ok 219 - 安卓橋接封包包含傳輸資料、格式內容及冪等工作編號
  ---
  duration_ms: 0.472119
  type: 'test'
  ...
# Subtest: 設備診斷會分開設定驗證、瀏覽器限制及安卓橋接狀態
ok 220 - 設備診斷會分開設定驗證、瀏覽器限制及安卓橋接狀態
  ---
  duration_ms: 0.592678
  type: 'test'
  ...
# Subtest: 現有訂單與堂食打印工作可去重匯入中央工作佇列
ok 221 - 現有訂單與堂食打印工作可去重匯入中央工作佇列
  ---
  duration_ms: 1.239966
  type: 'test'
  ...
# PRODUCT_CARD_AUTHORITY_CONTRACT_OK
# Subtest: tests/product-card-authority-contract.test.mjs
ok 26 - tests/product-card-authority-contract.test.mjs
  ---
  duration_ms: 51.195928
  type: 'test'
  ...
# Subtest: seed frame stays hidden until child ready
ok 223 - seed frame stays hidden until child ready
  ---
  duration_ms: 1.366053
  type: 'test'
  ...
# Subtest: unlock does not force reload the active order page
ok 224 - unlock does not force reload the active order page
  ---
  duration_ms: 0.40548
  type: 'test'
  ...
# Subtest: page ready waits for stable frames
not ok 225 - page ready waits for stable frames
  ---
  duration_ms: 3.607632
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/shell-atomic-ready-contract.test.mjs:19:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /requestAnimationFrame\(\(\)=>requestAnimationFrame\(ready\)\)/. Input:
    
    "function navigate(route){if(parent&&parent!==window)parent.postMessage({type:'morefun:navigate',route},'*');else location.hash=`#/${route}`;}\n" +
      "function ready(){if(parent&&parent!==window)parent.postMessage({type:'morefun:page-ready',page:document.body.dataset.page||'unknown'},'*');}\n" +
      'function applyPreferences(){\n' +
      '  try{\n' +
      "    const settings=JSON.parse(localStorage.getItem('morefun:smt:v16c:settings')||'{}');\n" +
      "    document.documentElement.dataset.theme=settings.morePage?.theme||'warm';\n" +
      "    document.documentElement.dataset.sounds=settings.morePage?.sounds===false?'off':'on';\n" +
      "  }catch(_error){document.documentElement.dataset.theme='warm';document.documentElement.dataset.sounds='on';}\n" +
      '}\n' +
      'function handleShellNavigation(event){\n' +
      `  const button=event.target?.closest?.('[data-action="shell-navigate"]');\n` +
      '  if(!button||button.disabled)return;\n' +
      '  event.preventDefault();\n' +
      '  event.stopImmediatePropagation();\n' +
      '  const route=button.dataset.route;\n' +
      '  if(!route||route===document.body.dataset.page)return;\n' +
      '  navigate(route);\n' +
      '}\n' +
      'let statusActions=[];\n' +
      'function normalizeStatusActions(actions){\n' +
      '  return (Array.isArray(actions)?actions:[]).map((action,index)=>({\n' +
      '    id:String(action?.id||`action-${index}`),\n' +
      '    sourceId:String(action?.sourceId||action?.id||`action-${index}`),\n' +
      "    className:String(action?.className||''),\n" +
      "    html:String(action?.html||action?.label||''),\n" +
      '    disabled:Boolean(action?.disabled),\n' +
      "    ariaLabel:String(action?.ariaLabel||action?.label||'')\n" +
      '  }));\n' +
      '}\n' +
      'function publishStatusActions(){\n' +
      '  if(!(parent&&parent!==window))return;\n' +
      "  parent.postMessage({type:'morefun:status-actions',page:document.body.dataset.page||'unknown',actions:statusActions.map(({sourceId,...action})=>action)},'*');\n" +
      '}\n' +
      'function setStatusActions(actions){statusActions=normalizeStatusActions(actions);publishStatusActions();}\n' +
      'function triggerStatusAction(message){\n' +
      '  const action=statusActions.find(item=>item.id===message.id);\n' +
      '  if(!action||action.disabled)return;\n' +
      '  const source=document.querySelector(`[data-shell-source-id="${CSS.escape(action.sourceId)}"]`);\n' +
      '  if(!source||source.disabled)return;\n' +
      '  let handled=false;\n' +
      '  try{\n' +
      "    const actionEvent=new CustomEvent('morefun:status-action',{bubbles:true,cancelable:true,detail:{anchor:message.anchor||null}});\n" +
      '    handled=!source.dispatchEvent(actionEvent);\n' +
      '  }catch(_error){}\n' +
      '  if(!handled)source.click();\n' +
      '}\n' +
      'function handleParentMessage(event){\n' +
      '  if(event.source!==parent)return;\n' +
      '  const message=event.data||{};\n' +
      "  if(message.type==='morefun:status-action-trigger'){triggerStatusAction(message);return;}\n" +
      "  if(message.type==='morefun:page-activate'){publishStatusActions();}\n" +
      '}\n' +
      'function announceReadyAfterStableFrames(){\n' +
      '  const announce=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{ready();publishStatusActions();}));\n' +
      '  if(document.fonts?.ready)document.fonts.ready.then(announce,announce);\n' +
      '  else announce();\n' +
      '}\n' +
      'applyPreferences();\n' +
      "document.addEventListener('click',handleShellNavigation,true);\n" +
      "window.addEventListener('message',handleParentMessage);\n" +
      "document.addEventListener('DOMContentLoaded',()=>{applyPreferences();announceReadyAfterStableFrames();},{once:true});\n" +
      'window.MoreFunPageBridge={navigate,ready,applyPreferences,publishStatusActions,setStatusActions};'
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    function navigate(route){if(parent&&parent!==window)parent.postMessage({type:'morefun:navigate',route},'*');else location.hash=`#/${route}`;}
    function ready(){if(parent&&parent!==window)parent.postMessage({type:'morefun:page-ready',page:document.body.dataset.page||'unknown'},'*');}
    function applyPreferences(){
      try{
        const settings=JSON.parse(localStorage.getItem('morefun:smt:v16c:settings')||'{}');
        document.documentElement.dataset.theme=settings.morePage?.theme||'warm';
        document.documentElement.dataset.sounds=settings.morePage?.sounds===false?'off':'on';
      }catch(_error){document.documentElement.dataset.theme='warm';document.documentElement.dataset.sounds='on';}
    }
    function handleShellNavigation(event){
      const button=event.target?.closest?.('[data-action="shell-navigate"]');
      if(!button||button.disabled)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const route=button.dataset.route;
      if(!route||route===document.body.dataset.page)return;
      navigate(route);
    }
    let statusActions=[];
    function normalizeStatusActions(actions){
      return (Array.isArray(actions)?actions:[]).map((action,index)=>({
        id:String(action?.id||`action-${index}`),
        sourceId:String(action?.sourceId||action?.id||`action-${index}`),
        className:String(action?.className||''),
        html:String(action?.html||action?.label||''),
        disabled:Boolean(action?.disabled),
        ariaLabel:String(action?.ariaLabel||action?.label||'')
      }));
    }
    function publishStatusActions(){
      if(!(parent&&parent!==window))return;
      parent.postMessage({type:'morefun:status-actions',page:document.body.dataset.page||'unknown',actions:statusActions.map(({sourceId,...action})=>action)},'*');
    }
    function setStatusActions(actions){statusActions=normalizeStatusActions(actions);publishStatusActions();}
    function triggerStatusAction(message){
      const action=statusActions.find(item=>item.id===message.id);
      if(!action||action.disabled)return;
      const source=document.querySelector(`[data-shell-source-id="${CSS.escape(action.sourceId)}"]`);
      if(!source||source.disabled)return;
      let handled=false;
      try{
        const actionEvent=new CustomEvent('morefun:status-action',{bubbles:true,cancelable:true,detail:{anchor:message.anchor||null}});
        handled=!source.dispatchEvent(actionEvent);
      }catch(_error){}
      if(!handled)source.click();
    }
    function handleParentMessage(event){
      if(event.source!==parent)return;
      const message=event.data||{};
      if(message.type==='morefun:status-action-trigger'){triggerStatusAction(message);return;}
      if(message.type==='morefun:page-activate'){publishStatusActions();}
    }
    function announceReadyAfterStableFrames(){
      const announce=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{ready();publishStatusActions();}));
      if(document.fonts?.ready)document.fonts.ready.then(announce,announce);
      else announce();
    }
    applyPreferences();
    document.addEventListener('click',handleShellNavigation,true);
    window.addEventListener('message',handleParentMessage);
    document.addEventListener('DOMContentLoaded',()=>{applyPreferences();announceReadyAfterStableFrames();},{once:true});
    window.MoreFunPageBridge={navigate,ready,applyPreferences,publishStatusActions,setStatusActions};
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/shell-atomic-ready-contract.test.mjs:20:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: order overlay state stays event driven
not ok 226 - order overlay state stays event driven
  ---
  duration_ms: 1.786075
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/shell-atomic-ready-contract.test.mjs:23:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /frame\?\.dataset\?\.route==='order'/. Input:
    
    "import {applyResponsiveProfile,getResponsiveProfile} from './shared/responsive.js';\n" +
      '\n' +
      "const stage=document.getElementById('stage');\n" +
      "const seedFrame=document.getElementById('page');\n" +
      "const nav=document.getElementById('global-bottom-nav');\n" +
      "const shellApp=document.getElementById('shell-app');\n" +
      "const routeLabel=document.getElementById('shell-route-label');\n" +
      "const shellContext=document.getElementById('shell-context');\n" +
      "const routeFeedback=document.getElementById('route-feedback');\n" +
      "const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html',orders:'pages/orders/index.html',dine:'pages/dine/index.html',soldout:'pages/soldout/index.html',more:'pages/more/index.html'};\n" +
      "const labels={order:'點餐',orders:'訂單',dine:'堂食',soldout:'售罄',more:'更多',checkout:'結帳'};\n" +
      "const mainRoutes=['order','orders','dine','soldout','more'];\n" +
      "const checkoutExitRoutes=new Set(['order','orders']);\n" +
      "const BUILD='global-shell-v2-20260726-atomic-ready';\n" +
      'const frameByRoute=new Map();\n' +
      'const allFrames=new Set();\n' +
      'const readyRoutes=new Set();\n' +
      'let activeFrame=null;\n' +
      "let current='';\n" +
      "let pending='';\n" +
      'let childReady=false;\n' +
      'let resizeFrame=0;\n' +
      'let currentProfile=null;\n' +
      'let watchdogTimer=0;\n' +
      "let shellUnlocked=document.documentElement.dataset.shellUnlocked==='1';\n" +
      'let preloadStarted=false;\n' +
      'let preloadQueue=[];\n' +
      "let preloadingRoute='';\n" +
      "let checkoutExitArmed='';\n" +
      "const SCALE_KEY='morefun-smt-ui-scale';\n" +
      'let uiScale=Math.max(.82,Math.min(1,Number(localStorage.getItem(SCALE_KEY)||1)));\n' +
      '\n' +
      'function viewportSize(){const viewport=window.visualViewport;return {width:Math.round(viewport?.width||window.innerWidth),height:Math.round(viewport?.height||window.innerHeight)};}\n' +
      'function frameList(){return [...allFrames];}\n' +
      "function route(){const key=(location.hash.replace(/^#\\/?/,'')||'order').split('?')[0];return routes[key]?key:'order';}\n" +
      "function pageUrl(key,mode='normal'){const base=routes[key]+'?build='+encodeURIComponent(BUILD);return mode==='normal'?base:base+'&'+mode+'='+Date.now();}\n" +
      "function isCheckoutTransaction(key=current){return key==='checkout';}\n" +
      '\n' +
      'function setChildOverlayState(frame,open){\n' +
      "  frame?.classList.toggle('has-shell-overlay',Boolean(open));\n" +
      "  if(frame===activeFrame)shellApp?.classList.toggle('child-overlay-active',Boolean(open));\n" +
      '}\n' +
      '\n' +
      'function applyChildShellMode(frame){\n' +
      '  try{\n' +
      '    const doc=frame?.contentDocument;\n' +
      '    if(!doc?.documentElement)return;\n' +
      "    doc.documentElement.dataset.globalShell='1';\n" +
      "  }catch(error){console.warn('GLOBAL_SHELL_CHILD_MODE_FAILED',error);}\n" +
      '}\n' +
      '\n' +
      "function profileSignature(profile=currentProfile){return profile?profile.name+':'+profile.width+'x'+profile.height:'';}\n" +
      'function applyProfileToFrame(frame){\n' +
      '  if(!frame||!currentProfile)return;\n' +
      "  frame.style.width='100%';frame.style.height='100%';\n" +
      '  const signature=profileSignature();\n' +
      '  if(frame.dataset.appliedProfile!==signature){\n' +
      "    try{if(frame.contentDocument?.documentElement)applyResponsiveProfile(frame.contentDocument,currentProfile);}catch(error){console.warn('RESPONSIVE_CHILD_PROFILE_FAILED',error);}\n" +
      '    frame.dataset.appliedProfile=signature;\n' +
      '  }\n' +
      '  applyChildShellMode(frame);\n' +
      '}\n' +
      '\n' +
      'function applyProfile(){\n' +
      '  const size=viewportSize();currentProfile=getResponsiveProfile(size.width,size.height);applyResponsiveProfile(document,currentProfile);\n' +
      "  document.documentElement.style.setProperty('--user-ui-scale',String(uiScale));\n" +
      "  stage.style.width='100%';stage.style.height='100%';stage.style.left='0px';stage.style.top='0px';stage.style.transform='none';\n" +
      "  stage.dataset.profile=currentProfile.name;stage.dataset.viewportWidth=String(currentProfile.width);stage.dataset.viewportHeight=String(currentProfile.height);stage.dataset.fitted=currentProfile.landscape?'1':'0';\n" +
      '  frameList().forEach(applyProfileToFrame);\n' +
      '}\n' +
      'function scheduleProfileUpdate(){if(resizeFrame)return;resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;applyProfile();});}\n' +
      '\n' +
      'function setTransactionUi(active){\n' +
      "  shellApp?.classList.toggle('transaction-active',active);\n" +
      "  if(shellApp)shellApp.dataset.transaction=active?'checkout':'';\n" +
      "  if(nav){nav.hidden=active;nav.setAttribute('aria-hidden',active?'true':'false');}\n" +
      "  nav?.querySelectorAll('[data-route]').forEach(button=>{\n" +
      '    button.disabled=active;\n' +
      '    button.tabIndex=active?-1:0;\n' +
      "    button.setAttribute('aria-disabled',active?'true':'false');\n" +
      '  });\n' +
      '}\n' +
      '\n' +
      'function setShellRouteUi(key,{loading=false}={}){\n' +
      '  const checkout=isCheckoutTransaction(key);\n' +
      '  setTransactionUi(checkout);\n' +
      "  nav?.querySelectorAll('[data-route]').forEach(button=>{const active=!checkout&&button.dataset.route===key;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});\n" +
      '  if(routeLabel)routeLabel.textContent=labels[key]||key;\n' +
      '  if(routeFeedback)routeFeedback.hidden=!loading;\n' +
      "  if(shellContext)shellContext.textContent=checkout?'結帳進行中｜交易模式':loading?'正在準備 '+(labels[key]||key)+'…':'營業操作中';\n" +
      '}\n' +
      '\n' +
      'function loaderErrorDocument(message){\n' +
      `  return '<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';\n` +
      '}\n' +
      'function showLoaderError(message,target=activeFrame){\n' +
      '  if(!target)return;\n' +
      "  const key=target.dataset.route||pending||current||'order';\n" +
      '  const mayReveal=target===activeFrame||key===pending||(!childReady&&key===current);\n' +
      "  if(!mayReveal){console.error('PAGE_TRANSITION_FAILED',message);return;}\n" +
      '  clearTimeout(watchdogTimer);\n' +
      "  if(target!==activeFrame)target.addEventListener('load',()=>{readyRoutes.add(key);setActiveFrame(target,key);},{once:true});\n" +
      '  target.srcdoc=loaderErrorDocument(message);\n' +
      '  if(target===activeFrame)setShellRouteUi(key,{loading:false});\n' +
      '}\n' +
      '\n' +
      'function attachFrame(frame,key){\n' +
      "  frame.dataset.route=key;frame.title='磨飯 SMT｜'+(labels[key]||key);allFrames.add(frame);frameByRoute.set(key,frame);\n" +
      "  frame.addEventListener('error',()=>showLoaderError('子頁載入失敗，資料仍保存在本機。',frame));\n" +
      "  frame.addEventListener('load',()=>{delete frame.dataset.appliedProfile;applyProfileToFrame(frame);});\n" +
      '}\n' +
      "function createHiddenFrame(key){const frame=document.createElement('iframe');frame.className='shell-page is-loading';frame.setAttribute('aria-hidden','true');frame.tabIndex=-1;attachFrame(frame,key);stage.appendChild(frame);return frame;}\n" +
      'function findSourceFrame(source){return frameList().find(frame=>source===frame.contentWindow)||null;}\n' +
      '\n' +
      'function setActiveFrame(frame,key){\n' +
      '  if(!frame)return;\n' +
      '  const old=activeFrame;\n' +
      "  if(old&&old!==frame){old.classList.remove('is-active','is-loading','has-shell-overlay');old.setAttribute('aria-hidden','true');old.tabIndex=-1;if(old.id==='page')old.id='page-cache-'+String(old.dataset.route||'route');}\n" +
      "  shellApp?.classList.remove('child-overlay-active');\n" +
      "  const existingPage=document.getElementById('page');if(existingPage&&existingPage!==frame)existingPage.removeAttribute('id');\n" +
      "  frame.id='page';frame.classList.remove('is-loading');frame.classList.add('is-active');frame.setAttribute('aria-hidden','false');frame.removeAttribute('tabindex');\n" +
      "  activeFrame=frame;current=key;pending='';childReady=true;clearTimeout(watchdogTimer);stage.dataset.route=current;delete stage.dataset.pendingRoute;\n" +
      "  if(key==='checkout')checkoutExitArmed='';\n" +
      '  setShellRouteUi(key,{loading:false});\n' +
      '  applyChildShellMode(frame);\n' +
      "  setChildOverlayState(frame,frame.classList.contains('has-shell-overlay'));\n" +
      '  try{\n' +
      "    if(key==='checkout')frame.contentWindow?.postMessage({type:'morefun:checkout-enter',route:key},'*');\n" +
      "    frame.contentWindow?.postMessage({type:'morefun:page-activate',route:key},'*');\n" +
      '  }catch(_error){}\n' +
      '}\n' +
      '\n' +
      "function armWatchdog(frame,key){clearTimeout(watchdogTimer);watchdogTimer=setTimeout(()=>{if(key!==pending||readyRoutes.has(key))return;frame.src=pageUrl(key,'retry');},1800);}\n" +
      'function ensureFrameLoading(key,{force=false,background=false}={}){\n' +
      '  let frame=frameByRoute.get(key);\n' +
      "  if(!frame){frame=createHiddenFrame(key);frame.src=pageUrl(key,force?'reload':'normal');return frame;}\n" +
      "  if(force){readyRoutes.delete(key);setChildOverlayState(frame,false);frame.classList.add('is-loading');frame.classList.remove('is-active');frame.setAttribute('aria-hidden','true');delete frame.dataset.appliedProfile;frame.src=pageUrl(key,'reload');}\n" +
      "  if(background)frame.classList.add('is-loading');\n" +
      '  return frame;\n' +
      '}\n' +
      '\n' +
      'function preloadNext(){\n' +
      '  if(!shellUnlocked||preloadingRoute||!preloadQueue.length)return;\n' +
      '  const key=preloadQueue.shift();\n' +
      '  if(readyRoutes.has(key)||frameByRoute.has(key)){setTimeout(preloadNext,80);return;}\n' +
      '  preloadingRoute=key;\n' +
      '  ensureFrameLoading(key,{background:true});\n' +
      '}\n' +
      'function startSequentialPreload(){\n' +
      "  if(preloadStarted||!shellUnlocked||!readyRoutes.has('order'))return;\n" +
      "  preloadStarted=true;preloadQueue=['checkout',...mainRoutes.filter(key=>key!=='order')];setTimeout(preloadNext,40);\n" +
      '}\n' +
      '\n' +
      'function load({force=false}={}){\n' +
      '  const key=route();if(!force&&key===current)return;\n' +
      '  const cached=frameByRoute.get(key);\n' +
      '  if(!force&&cached&&readyRoutes.has(key)){setActiveFrame(cached,key);return;}\n' +
      '  pending=key;childReady=false;stage.dataset.pendingRoute=key;setShellRouteUi(key,{loading:true});\n' +
      '  const frame=ensureFrameLoading(key,{force});armWatchdog(frame,key);\n' +
      '}\n' +
      '\n' +
      'function boot(){\n' +
      "  const key='order';\n" +
      "  current='';pending=key;childReady=false;attachFrame(seedFrame,key);\n" +
      "  seedFrame.classList.remove('is-active');seedFrame.classList.add('is-loading');seedFrame.setAttribute('aria-hidden','true');seedFrame.tabIndex=-1;\n" +
      '  seedFrame.src=pageUrl(key);stage.dataset.pendingRoute=key;setShellRouteUi(key,{loading:true});\n' +
      "  if(location.hash!=='#/order')history.replaceState(null,'','#/order');\n" +
      '}\n' +
      '\n' +
      'function armCheckoutExit(next){\n' +
      '  if(!isCheckoutTransaction()||!checkoutExitRoutes.has(next))return false;\n' +
      '  checkoutExitArmed=next;\n' +
      '  return true;\n' +
      '}\n' +
      '\n' +
      "nav?.addEventListener('cl"... 3141 more characters
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    import {applyResponsiveProfile,getResponsiveProfile} from './shared/responsive.js';
    
    const stage=document.getElementById('stage');
    const seedFrame=document.getElementById('page');
    const nav=document.getElementById('global-bottom-nav');
    const shellApp=document.getElementById('shell-app');
    const routeLabel=document.getElementById('shell-route-label');
    const shellContext=document.getElementById('shell-context');
    const routeFeedback=document.getElementById('route-feedback');
    const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html',orders:'pages/orders/index.html',dine:'pages/dine/index.html',soldout:'pages/soldout/index.html',more:'pages/more/index.html'};
    const labels={order:'點餐',orders:'訂單',dine:'堂食',soldout:'售罄',more:'更多',checkout:'結帳'};
    const mainRoutes=['order','orders','dine','soldout','more'];
    const checkoutExitRoutes=new Set(['order','orders']);
    const BUILD='global-shell-v2-20260726-atomic-ready';
    const frameByRoute=new Map();
    const allFrames=new Set();
    const readyRoutes=new Set();
    let activeFrame=null;
    let current='';
    let pending='';
    let childReady=false;
    let resizeFrame=0;
    let currentProfile=null;
    let watchdogTimer=0;
    let shellUnlocked=document.documentElement.dataset.shellUnlocked==='1';
    let preloadStarted=false;
    let preloadQueue=[];
    let preloadingRoute='';
    let checkoutExitArmed='';
    const SCALE_KEY='morefun-smt-ui-scale';
    let uiScale=Math.max(.82,Math.min(1,Number(localStorage.getItem(SCALE_KEY)||1)));
    
    function viewportSize(){const viewport=window.visualViewport;return {width:Math.round(viewport?.width||window.innerWidth),height:Math.round(viewport?.height||window.innerHeight)};}
    function frameList(){return [...allFrames];}
    function route(){const key=(location.hash.replace(/^#\/?/,'')||'order').split('?')[0];return routes[key]?key:'order';}
    function pageUrl(key,mode='normal'){const base=routes[key]+'?build='+encodeURIComponent(BUILD);return mode==='normal'?base:base+'&'+mode+'='+Date.now();}
    function isCheckoutTransaction(key=current){return key==='checkout';}
    
    function setChildOverlayState(frame,open){
      frame?.classList.toggle('has-shell-overlay',Boolean(open));
      if(frame===activeFrame)shellApp?.classList.toggle('child-overlay-active',Boolean(open));
    }
    
    function applyChildShellMode(frame){
      try{
        const doc=frame?.contentDocument;
        if(!doc?.documentElement)return;
        doc.documentElement.dataset.globalShell='1';
      }catch(error){console.warn('GLOBAL_SHELL_CHILD_MODE_FAILED',error);}
    }
    
    function profileSignature(profile=currentProfile){return profile?profile.name+':'+profile.width+'x'+profile.height:'';}
    function applyProfileToFrame(frame){
      if(!frame||!currentProfile)return;
      frame.style.width='100%';frame.style.height='100%';
      const signature=profileSignature();
      if(frame.dataset.appliedProfile!==signature){
        try{if(frame.contentDocument?.documentElement)applyResponsiveProfile(frame.contentDocument,currentProfile);}catch(error){console.warn('RESPONSIVE_CHILD_PROFILE_FAILED',error);}
        frame.dataset.appliedProfile=signature;
      }
      applyChildShellMode(frame);
    }
    
    function applyProfile(){
      const size=viewportSize();currentProfile=getResponsiveProfile(size.width,size.height);applyResponsiveProfile(document,currentProfile);
      document.documentElement.style.setProperty('--user-ui-scale',String(uiScale));
      stage.style.width='100%';stage.style.height='100%';stage.style.left='0px';stage.style.top='0px';stage.style.transform='none';
      stage.dataset.profile=currentProfile.name;stage.dataset.viewportWidth=String(currentProfile.width);stage.dataset.viewportHeight=String(currentProfile.height);stage.dataset.fitted=currentProfile.landscape?'1':'0';
      frameList().forEach(applyProfileToFrame);
    }
    function scheduleProfileUpdate(){if(resizeFrame)return;resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;applyProfile();});}
    
    function setTransactionUi(active){
      shellApp?.classList.toggle('transaction-active',active);
      if(shellApp)shellApp.dataset.transaction=active?'checkout':'';
      if(nav){nav.hidden=active;nav.setAttribute('aria-hidden',active?'true':'false');}
      nav?.querySelectorAll('[data-route]').forEach(button=>{
        button.disabled=active;
        button.tabIndex=active?-1:0;
        button.setAttribute('aria-disabled',active?'true':'false');
      });
    }
    
    function setShellRouteUi(key,{loading=false}={}){
      const checkout=isCheckoutTransaction(key);
      setTransactionUi(checkout);
      nav?.querySelectorAll('[data-route]').forEach(button=>{const active=!checkout&&button.dataset.route===key;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
      if(routeLabel)routeLabel.textContent=labels[key]||key;
      if(routeFeedback)routeFeedback.hidden=!loading;
      if(shellContext)shellContext.textContent=checkout?'結帳進行中｜交易模式':loading?'正在準備 '+(labels[key]||key)+'…':'營業操作中';
    }
    
    function loaderErrorDocument(message){
      return '<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';
    }
    function showLoaderError(message,target=activeFrame){
      if(!target)return;
      const key=target.dataset.route||pending||current||'order';
      const mayReveal=target===activeFrame||key===pending||(!childReady&&key===current);
      if(!mayReveal){console.error('PAGE_TRANSITION_FAILED',message);return;}
      clearTimeout(watchdogTimer);
      if(target!==activeFrame)target.addEventListener('load',()=>{readyRoutes.add(key);setActiveFrame(target,key);},{once:true});
      target.srcdoc=loaderErrorDocument(message);
      if(target===activeFrame)setShellRouteUi(key,{loading:false});
    }
    
    function attachFrame(frame,key){
      frame.dataset.route=key;frame.title='磨飯 SMT｜'+(labels[key]||key);allFrames.add(frame);frameByRoute.set(key,frame);
      frame.addEventListener('error',()=>showLoaderError('子頁載入失敗，資料仍保存在本機。',frame));
      frame.addEventListener('load',()=>{delete frame.dataset.appliedProfile;applyProfileToFrame(frame);});
    }
    function createHiddenFrame(key){const frame=document.createElement('iframe');frame.className='shell-page is-loading';frame.setAttribute('aria-hidden','true');frame.tabIndex=-1;attachFrame(frame,key);stage.appendChild(frame);return frame;}
    function findSourceFrame(source){return frameList().find(frame=>source===frame.contentWindow)||null;}
    
    function setActiveFrame(frame,key){
      if(!frame)return;
      const old=activeFrame;
      if(old&&old!==frame){old.classList.remove('is-active','is-loading','has-shell-overlay');old.setAttribute('aria-hidden','true');old.tabIndex=-1;if(old.id==='page')old.id='page-cache-'+String(old.dataset.route||'route');}
      shellApp?.classList.remove('child-overlay-active');
      const existingPage=document.getElementById('page');if(existingPage&&existingPage!==frame)existingPage.removeAttribute('id');
      frame.id='page';frame.classList.remove('is-loading');frame.classList.add('is-active');frame.setAttribute('aria-hidden','false');frame.removeAttribute('tabindex');
      activeFrame=frame;current=key;pending='';childReady=true;clearTimeout(watchdogTimer);stage.dataset.route=current;delete stage.dataset.pendingRoute;
      if(key==='checkout')checkoutExitArmed='';
      setShellRouteUi(key,{loading:false});
      applyChildShellMode(frame);
      setChildOverlayState(frame,frame.classList.contains('has-shell-overlay'));
      try{
        if(key==='checkout')frame.contentWindow?.postMessage({type:'morefun:checkout-enter',route:key},'*');
        frame.contentWindow?.postMessage({type:'morefun:page-activate',route:key},'*');
      }catch(_error){}
    }
    
    function armWatchdog(frame,key){clearTimeout(watchdogTimer);watchdogTimer=setTimeout(()=>{if(key!==pending||readyRoutes.has(key))return;frame.src=pageUrl(key,'retry');},1800);}
    function ensureFrameLoading(key,{force=false,background=false}={}){
      let frame=frameByRoute.get(key);
      if(!frame){frame=createHiddenFrame(key);frame.src=pageUrl(key,force?'reload':'normal');return frame;}
      if(force){readyRoutes.delete(key);setChildOverlayState(frame,false);frame.classList.add('is-loading');frame.classList.remove('is-active');frame.setAttribute('aria-hidden','true');delete frame.dataset.appliedProfile;frame.src=pageUrl(key,'reload');}
      if(background)frame.classList.add('is-loading');
      return frame;
    }
    
    function preloadNext(){
      if(!shellUnlocked||preloadingRoute||!preloadQueue.length)return;
      const key=preloadQueue.shift();
      if(readyRoutes.has(key)||frameByRoute.has(key)){setTimeout(preloadNext,80);return;}
      preloadingRoute=key;
      ensureFrameLoading(key,{background:true});
    }
    function startSequentialPreload(){
      if(preloadStarted||!shellUnlocked||!readyRoutes.has('order'))return;
      preloadStarted=true;preloadQueue=['checkout',...mainRoutes.filter(key=>key!=='order')];setTimeout(preloadNext,40);
    }
    
    function load({force=false}={}){
      const key=route();if(!force&&key===current)return;
      const cached=frameByRoute.get(key);
      if(!force&&cached&&readyRoutes.has(key)){setActiveFrame(cached,key);return;}
      pending=key;childReady=false;stage.dataset.pendingRoute=key;setShellRouteUi(key,{loading:true});
      const frame=ensureFrameLoading(key,{force});armWatchdog(frame,key);
    }
    
    function boot(){
      const key='order';
      current='';pending=key;childReady=false;attachFrame(seedFrame,key);
      seedFrame.classList.remove('is-active');seedFrame.classList.add('is-loading');seedFrame.setAttribute('aria-hidden','true');seedFrame.tabIndex=-1;
      seedFrame.src=pageUrl(key);stage.dataset.pendingRoute=key;setShellRouteUi(key,{loading:true});
      if(location.hash!=='#/order')history.replaceState(null,'','#/order');
    }
    
    function armCheckoutExit(next){
      if(!isCheckoutTransaction()||!checkoutExitRoutes.has(next))return false;
      checkoutExitArmed=next;
      return true;
    }
    
    nav?.addEventListener('click',event=>{
      if(isCheckoutTransaction()){
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const button=event.target.closest('[data-route]');if(!button)return;
      const next=button.dataset.route;if(!routes[next]||next===current)return;
      setShellRouteUi(next,{loading:!readyRoutes.has(next)});
      if(location.hash==='#/'+next)load();else location.hash='#/'+next;
    },true);
    
    addEventListener('hashchange',()=>{
      if(!shellUnlocked)return;
      const next=route();
      if(isCheckoutTransaction()){
        if(checkoutExitArmed===next&&checkoutExitRoutes.has(next)){
          checkoutExitArmed='';
          load();
          return;
        }
        history.replaceState(null,'','#/checkout');
        setShellRouteUi('checkout',{loading:false});
        return;
      }
      checkoutExitArmed='';
      load();
    });
    addEventListener('pageshow',()=>applyProfile());
    addEventListener('resize',scheduleProfileUpdate,{passive:true});
    window.visualViewport?.addEventListener('resize',scheduleProfileUpdate,{passive:true});
    window.visualViewport?.addEventListener('scroll',scheduleProfileUpdate,{passive:true});
    
    addEventListener('message',event=>{
      const frame=findSourceFrame(event.source);if(!frame)return;
      const message=event.data||{};
      if(message.type==='morefun:page-runtime-error'){
        const key=frame.dataset.route||message.page||pending||current||'order';
        console.error('PAGE_RUNTIME_ERROR',key,message.message||'');
        if(!readyRoutes.has(key)||key===pending||(!childReady&&key===current))showLoaderError((labels[key]||'頁面')+'啟動失敗，資料仍保存在本機。',frame);
        else if(frame===activeFrame&&shellContext)shellContext.textContent='操作異常｜資料已保留';
        return;
      }
      if(message.type==='morefun:overlay-state'){
        setChildOverlayState(frame,Boolean(message.open));
        return;
      }
      if(message.type==='morefun:page-ready'){
        const key=frame.dataset.route||message.page||pending||current;readyRoutes.add(key);frame.classList.remove('is-loading');applyProfileToFrame(frame);
        if(preloadingRoute===key){preloadingRoute='';setTimeout(preloadNext,40);}
        if(key===pending||(!childReady&&key===current))requestAnimationFrame(()=>setActiveFrame(frame,key));
        if(key==='order')startSequentialPreload();
        return;
      }
      if(message.type==='morefun:navigate'){
        const next=message.route;if(!routes[next])return;
        if(isCheckoutTransaction()&&next!==current){if(!armCheckoutExit(next))return;}
        if(next===current)return;
        if(location.hash==='#/'+next)load();else location.hash='#/'+next;
      }
    });
    
    window.MoreFunShell={
      unlock(){
        shellUnlocked=true;document.documentElement.dataset.shellUnlocked='1';applyProfile();
        const key=route();
        const cached=frameByRoute.get(key);
        if(cached&&readyRoutes.has(key)){if(current!==key)setActiveFrame(cached,key);return;}
        if(!cached)load();
      },
      reload(){load({force:true});},
      setScale(value){uiScale=Math.max(.82,Math.min(1,Number(value)||1));localStorage.setItem(SCALE_KEY,String(uiScale));applyProfile();},
      getScale(){return uiScale;},
      profile(){return currentProfile;}
    };
    addEventListener('morefun:shell-unlocked',()=>window.MoreFunShell.unlock());
    
    applyProfile();boot();
    
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/shell-atomic-ready-contract.test.mjs:25:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: responsive profile writes are deduplicated per frame
ok 227 - responsive profile writes are deduplicated per frame
  ---
  duration_ms: 0.300144
  type: 'test'
  ...
# Subtest: inactive preloaded pages do not keep overlay observers running
not ok 228 - inactive preloaded pages do not keep overlay observers running
  ---
  duration_ms: 1.181729
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/shell-atomic-ready-contract.test.mjs:33:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /function stopChildOverlayObserver\(/. Input:
    
    "import {applyResponsiveProfile,getResponsiveProfile} from './shared/responsive.js';\n" +
      '\n' +
      "const stage=document.getElementById('stage');\n" +
      "const seedFrame=document.getElementById('page');\n" +
      "const nav=document.getElementById('global-bottom-nav');\n" +
      "const shellApp=document.getElementById('shell-app');\n" +
      "const routeLabel=document.getElementById('shell-route-label');\n" +
      "const shellContext=document.getElementById('shell-context');\n" +
      "const routeFeedback=document.getElementById('route-feedback');\n" +
      "const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html',orders:'pages/orders/index.html',dine:'pages/dine/index.html',soldout:'pages/soldout/index.html',more:'pages/more/index.html'};\n" +
      "const labels={order:'點餐',orders:'訂單',dine:'堂食',soldout:'售罄',more:'更多',checkout:'結帳'};\n" +
      "const mainRoutes=['order','orders','dine','soldout','more'];\n" +
      "const checkoutExitRoutes=new Set(['order','orders']);\n" +
      "const BUILD='global-shell-v2-20260726-atomic-ready';\n" +
      'const frameByRoute=new Map();\n' +
      'const allFrames=new Set();\n' +
      'const readyRoutes=new Set();\n' +
      'let activeFrame=null;\n' +
      "let current='';\n" +
      "let pending='';\n" +
      'let childReady=false;\n' +
      'let resizeFrame=0;\n' +
      'let currentProfile=null;\n' +
      'let watchdogTimer=0;\n' +
      "let shellUnlocked=document.documentElement.dataset.shellUnlocked==='1';\n" +
      'let preloadStarted=false;\n' +
      'let preloadQueue=[];\n' +
      "let preloadingRoute='';\n" +
      "let checkoutExitArmed='';\n" +
      "const SCALE_KEY='morefun-smt-ui-scale';\n" +
      'let uiScale=Math.max(.82,Math.min(1,Number(localStorage.getItem(SCALE_KEY)||1)));\n' +
      '\n' +
      'function viewportSize(){const viewport=window.visualViewport;return {width:Math.round(viewport?.width||window.innerWidth),height:Math.round(viewport?.height||window.innerHeight)};}\n' +
      'function frameList(){return [...allFrames];}\n' +
      "function route(){const key=(location.hash.replace(/^#\\/?/,'')||'order').split('?')[0];return routes[key]?key:'order';}\n" +
      "function pageUrl(key,mode='normal'){const base=routes[key]+'?build='+encodeURIComponent(BUILD);return mode==='normal'?base:base+'&'+mode+'='+Date.now();}\n" +
      "function isCheckoutTransaction(key=current){return key==='checkout';}\n" +
      '\n' +
      'function setChildOverlayState(frame,open){\n' +
      "  frame?.classList.toggle('has-shell-overlay',Boolean(open));\n" +
      "  if(frame===activeFrame)shellApp?.classList.toggle('child-overlay-active',Boolean(open));\n" +
      '}\n' +
      '\n' +
      'function applyChildShellMode(frame){\n' +
      '  try{\n' +
      '    const doc=frame?.contentDocument;\n' +
      '    if(!doc?.documentElement)return;\n' +
      "    doc.documentElement.dataset.globalShell='1';\n" +
      "  }catch(error){console.warn('GLOBAL_SHELL_CHILD_MODE_FAILED',error);}\n" +
      '}\n' +
      '\n' +
      "function profileSignature(profile=currentProfile){return profile?profile.name+':'+profile.width+'x'+profile.height:'';}\n" +
      'function applyProfileToFrame(frame){\n' +
      '  if(!frame||!currentProfile)return;\n' +
      "  frame.style.width='100%';frame.style.height='100%';\n" +
      '  const signature=profileSignature();\n' +
      '  if(frame.dataset.appliedProfile!==signature){\n' +
      "    try{if(frame.contentDocument?.documentElement)applyResponsiveProfile(frame.contentDocument,currentProfile);}catch(error){console.warn('RESPONSIVE_CHILD_PROFILE_FAILED',error);}\n" +
      '    frame.dataset.appliedProfile=signature;\n' +
      '  }\n' +
      '  applyChildShellMode(frame);\n' +
      '}\n' +
      '\n' +
      'function applyProfile(){\n' +
      '  const size=viewportSize();currentProfile=getResponsiveProfile(size.width,size.height);applyResponsiveProfile(document,currentProfile);\n' +
      "  document.documentElement.style.setProperty('--user-ui-scale',String(uiScale));\n" +
      "  stage.style.width='100%';stage.style.height='100%';stage.style.left='0px';stage.style.top='0px';stage.style.transform='none';\n" +
      "  stage.dataset.profile=currentProfile.name;stage.dataset.viewportWidth=String(currentProfile.width);stage.dataset.viewportHeight=String(currentProfile.height);stage.dataset.fitted=currentProfile.landscape?'1':'0';\n" +
      '  frameList().forEach(applyProfileToFrame);\n' +
      '}\n' +
      'function scheduleProfileUpdate(){if(resizeFrame)return;resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;applyProfile();});}\n' +
      '\n' +
      'function setTransactionUi(active){\n' +
      "  shellApp?.classList.toggle('transaction-active',active);\n" +
      "  if(shellApp)shellApp.dataset.transaction=active?'checkout':'';\n" +
      "  if(nav){nav.hidden=active;nav.setAttribute('aria-hidden',active?'true':'false');}\n" +
      "  nav?.querySelectorAll('[data-route]').forEach(button=>{\n" +
      '    button.disabled=active;\n' +
      '    button.tabIndex=active?-1:0;\n' +
      "    button.setAttribute('aria-disabled',active?'true':'false');\n" +
      '  });\n' +
      '}\n' +
      '\n' +
      'function setShellRouteUi(key,{loading=false}={}){\n' +
      '  const checkout=isCheckoutTransaction(key);\n' +
      '  setTransactionUi(checkout);\n' +
      "  nav?.querySelectorAll('[data-route]').forEach(button=>{const active=!checkout&&button.dataset.route===key;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});\n" +
      '  if(routeLabel)routeLabel.textContent=labels[key]||key;\n' +
      '  if(routeFeedback)routeFeedback.hidden=!loading;\n' +
      "  if(shellContext)shellContext.textContent=checkout?'結帳進行中｜交易模式':loading?'正在準備 '+(labels[key]||key)+'…':'營業操作中';\n" +
      '}\n' +
      '\n' +
      'function loaderErrorDocument(message){\n' +
      `  return '<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';\n` +
      '}\n' +
      'function showLoaderError(message,target=activeFrame){\n' +
      '  if(!target)return;\n' +
      "  const key=target.dataset.route||pending||current||'order';\n" +
      '  const mayReveal=target===activeFrame||key===pending||(!childReady&&key===current);\n' +
      "  if(!mayReveal){console.error('PAGE_TRANSITION_FAILED',message);return;}\n" +
      '  clearTimeout(watchdogTimer);\n' +
      "  if(target!==activeFrame)target.addEventListener('load',()=>{readyRoutes.add(key);setActiveFrame(target,key);},{once:true});\n" +
      '  target.srcdoc=loaderErrorDocument(message);\n' +
      '  if(target===activeFrame)setShellRouteUi(key,{loading:false});\n' +
      '}\n' +
      '\n' +
      'function attachFrame(frame,key){\n' +
      "  frame.dataset.route=key;frame.title='磨飯 SMT｜'+(labels[key]||key);allFrames.add(frame);frameByRoute.set(key,frame);\n" +
      "  frame.addEventListener('error',()=>showLoaderError('子頁載入失敗，資料仍保存在本機。',frame));\n" +
      "  frame.addEventListener('load',()=>{delete frame.dataset.appliedProfile;applyProfileToFrame(frame);});\n" +
      '}\n' +
      "function createHiddenFrame(key){const frame=document.createElement('iframe');frame.className='shell-page is-loading';frame.setAttribute('aria-hidden','true');frame.tabIndex=-1;attachFrame(frame,key);stage.appendChild(frame);return frame;}\n" +
      'function findSourceFrame(source){return frameList().find(frame=>source===frame.contentWindow)||null;}\n' +
      '\n' +
      'function setActiveFrame(frame,key){\n' +
      '  if(!frame)return;\n' +
      '  const old=activeFrame;\n' +
      "  if(old&&old!==frame){old.classList.remove('is-active','is-loading','has-shell-overlay');old.setAttribute('aria-hidden','true');old.tabIndex=-1;if(old.id==='page')old.id='page-cache-'+String(old.dataset.route||'route');}\n" +
      "  shellApp?.classList.remove('child-overlay-active');\n" +
      "  const existingPage=document.getElementById('page');if(existingPage&&existingPage!==frame)existingPage.removeAttribute('id');\n" +
      "  frame.id='page';frame.classList.remove('is-loading');frame.classList.add('is-active');frame.setAttribute('aria-hidden','false');frame.removeAttribute('tabindex');\n" +
      "  activeFrame=frame;current=key;pending='';childReady=true;clearTimeout(watchdogTimer);stage.dataset.route=current;delete stage.dataset.pendingRoute;\n" +
      "  if(key==='checkout')checkoutExitArmed='';\n" +
      '  setShellRouteUi(key,{loading:false});\n' +
      '  applyChildShellMode(frame);\n' +
      "  setChildOverlayState(frame,frame.classList.contains('has-shell-overlay'));\n" +
      '  try{\n' +
      "    if(key==='checkout')frame.contentWindow?.postMessage({type:'morefun:checkout-enter',route:key},'*');\n" +
      "    frame.contentWindow?.postMessage({type:'morefun:page-activate',route:key},'*');\n" +
      '  }catch(_error){}\n' +
      '}\n' +
      '\n' +
      "function armWatchdog(frame,key){clearTimeout(watchdogTimer);watchdogTimer=setTimeout(()=>{if(key!==pending||readyRoutes.has(key))return;frame.src=pageUrl(key,'retry');},1800);}\n" +
      'function ensureFrameLoading(key,{force=false,background=false}={}){\n' +
      '  let frame=frameByRoute.get(key);\n' +
      "  if(!frame){frame=createHiddenFrame(key);frame.src=pageUrl(key,force?'reload':'normal');return frame;}\n" +
      "  if(force){readyRoutes.delete(key);setChildOverlayState(frame,false);frame.classList.add('is-loading');frame.classList.remove('is-active');frame.setAttribute('aria-hidden','true');delete frame.dataset.appliedProfile;frame.src=pageUrl(key,'reload');}\n" +
      "  if(background)frame.classList.add('is-loading');\n" +
      '  return frame;\n' +
      '}\n' +
      '\n' +
      'function preloadNext(){\n' +
      '  if(!shellUnlocked||preloadingRoute||!preloadQueue.length)return;\n' +
      '  const key=preloadQueue.shift();\n' +
      '  if(readyRoutes.has(key)||frameByRoute.has(key)){setTimeout(preloadNext,80);return;}\n' +
      '  preloadingRoute=key;\n' +
      '  ensureFrameLoading(key,{background:true});\n' +
      '}\n' +
      'function startSequentialPreload(){\n' +
      "  if(preloadStarted||!shellUnlocked||!readyRoutes.has('order'))return;\n" +
      "  preloadStarted=true;preloadQueue=['checkout',...mainRoutes.filter(key=>key!=='order')];setTimeout(preloadNext,40);\n" +
      '}\n' +
      '\n' +
      'function load({force=false}={}){\n' +
      '  const key=route();if(!force&&key===current)return;\n' +
      '  const cached=frameByRoute.get(key);\n' +
      '  if(!force&&cached&&readyRoutes.has(key)){setActiveFrame(cached,key);return;}\n' +
      '  pending=key;childReady=false;stage.dataset.pendingRoute=key;setShellRouteUi(key,{loading:true});\n' +
      '  const frame=ensureFrameLoading(key,{force});armWatchdog(frame,key);\n' +
      '}\n' +
      '\n' +
      'function boot(){\n' +
      "  const key='order';\n" +
      "  current='';pending=key;childReady=false;attachFrame(seedFrame,key);\n" +
      "  seedFrame.classList.remove('is-active');seedFrame.classList.add('is-loading');seedFrame.setAttribute('aria-hidden','true');seedFrame.tabIndex=-1;\n" +
      '  seedFrame.src=pageUrl(key);stage.dataset.pendingRoute=key;setShellRouteUi(key,{loading:true});\n' +
      "  if(location.hash!=='#/order')history.replaceState(null,'','#/order');\n" +
      '}\n' +
      '\n' +
      'function armCheckoutExit(next){\n' +
      '  if(!isCheckoutTransaction()||!checkoutExitRoutes.has(next))return false;\n' +
      '  checkoutExitArmed=next;\n' +
      '  return true;\n' +
      '}\n' +
      '\n' +
      "nav?.addEventListener('cl"... 3141 more characters
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    import {applyResponsiveProfile,getResponsiveProfile} from './shared/responsive.js';
    
    const stage=document.getElementById('stage');
    const seedFrame=document.getElementById('page');
    const nav=document.getElementById('global-bottom-nav');
    const shellApp=document.getElementById('shell-app');
    const routeLabel=document.getElementById('shell-route-label');
    const shellContext=document.getElementById('shell-context');
    const routeFeedback=document.getElementById('route-feedback');
    const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html',orders:'pages/orders/index.html',dine:'pages/dine/index.html',soldout:'pages/soldout/index.html',more:'pages/more/index.html'};
    const labels={order:'點餐',orders:'訂單',dine:'堂食',soldout:'售罄',more:'更多',checkout:'結帳'};
    const mainRoutes=['order','orders','dine','soldout','more'];
    const checkoutExitRoutes=new Set(['order','orders']);
    const BUILD='global-shell-v2-20260726-atomic-ready';
    const frameByRoute=new Map();
    const allFrames=new Set();
    const readyRoutes=new Set();
    let activeFrame=null;
    let current='';
    let pending='';
    let childReady=false;
    let resizeFrame=0;
    let currentProfile=null;
    let watchdogTimer=0;
    let shellUnlocked=document.documentElement.dataset.shellUnlocked==='1';
    let preloadStarted=false;
    let preloadQueue=[];
    let preloadingRoute='';
    let checkoutExitArmed='';
    const SCALE_KEY='morefun-smt-ui-scale';
    let uiScale=Math.max(.82,Math.min(1,Number(localStorage.getItem(SCALE_KEY)||1)));
    
    function viewportSize(){const viewport=window.visualViewport;return {width:Math.round(viewport?.width||window.innerWidth),height:Math.round(viewport?.height||window.innerHeight)};}
    function frameList(){return [...allFrames];}
    function route(){const key=(location.hash.replace(/^#\/?/,'')||'order').split('?')[0];return routes[key]?key:'order';}
    function pageUrl(key,mode='normal'){const base=routes[key]+'?build='+encodeURIComponent(BUILD);return mode==='normal'?base:base+'&'+mode+'='+Date.now();}
    function isCheckoutTransaction(key=current){return key==='checkout';}
    
    function setChildOverlayState(frame,open){
      frame?.classList.toggle('has-shell-overlay',Boolean(open));
      if(frame===activeFrame)shellApp?.classList.toggle('child-overlay-active',Boolean(open));
    }
    
    function applyChildShellMode(frame){
      try{
        const doc=frame?.contentDocument;
        if(!doc?.documentElement)return;
        doc.documentElement.dataset.globalShell='1';
      }catch(error){console.warn('GLOBAL_SHELL_CHILD_MODE_FAILED',error);}
    }
    
    function profileSignature(profile=currentProfile){return profile?profile.name+':'+profile.width+'x'+profile.height:'';}
    function applyProfileToFrame(frame){
      if(!frame||!currentProfile)return;
      frame.style.width='100%';frame.style.height='100%';
      const signature=profileSignature();
      if(frame.dataset.appliedProfile!==signature){
        try{if(frame.contentDocument?.documentElement)applyResponsiveProfile(frame.contentDocument,currentProfile);}catch(error){console.warn('RESPONSIVE_CHILD_PROFILE_FAILED',error);}
        frame.dataset.appliedProfile=signature;
      }
      applyChildShellMode(frame);
    }
    
    function applyProfile(){
      const size=viewportSize();currentProfile=getResponsiveProfile(size.width,size.height);applyResponsiveProfile(document,currentProfile);
      document.documentElement.style.setProperty('--user-ui-scale',String(uiScale));
      stage.style.width='100%';stage.style.height='100%';stage.style.left='0px';stage.style.top='0px';stage.style.transform='none';
      stage.dataset.profile=currentProfile.name;stage.dataset.viewportWidth=String(currentProfile.width);stage.dataset.viewportHeight=String(currentProfile.height);stage.dataset.fitted=currentProfile.landscape?'1':'0';
      frameList().forEach(applyProfileToFrame);
    }
    function scheduleProfileUpdate(){if(resizeFrame)return;resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;applyProfile();});}
    
    function setTransactionUi(active){
      shellApp?.classList.toggle('transaction-active',active);
      if(shellApp)shellApp.dataset.transaction=active?'checkout':'';
      if(nav){nav.hidden=active;nav.setAttribute('aria-hidden',active?'true':'false');}
      nav?.querySelectorAll('[data-route]').forEach(button=>{
        button.disabled=active;
        button.tabIndex=active?-1:0;
        button.setAttribute('aria-disabled',active?'true':'false');
      });
    }
    
    function setShellRouteUi(key,{loading=false}={}){
      const checkout=isCheckoutTransaction(key);
      setTransactionUi(checkout);
      nav?.querySelectorAll('[data-route]').forEach(button=>{const active=!checkout&&button.dataset.route===key;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
      if(routeLabel)routeLabel.textContent=labels[key]||key;
      if(routeFeedback)routeFeedback.hidden=!loading;
      if(shellContext)shellContext.textContent=checkout?'結帳進行中｜交易模式':loading?'正在準備 '+(labels[key]||key)+'…':'營業操作中';
    }
    
    function loaderErrorDocument(message){
      return '<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';
    }
    function showLoaderError(message,target=activeFrame){
      if(!target)return;
      const key=target.dataset.route||pending||current||'order';
      const mayReveal=target===activeFrame||key===pending||(!childReady&&key===current);
      if(!mayReveal){console.error('PAGE_TRANSITION_FAILED',message);return;}
      clearTimeout(watchdogTimer);
      if(target!==activeFrame)target.addEventListener('load',()=>{readyRoutes.add(key);setActiveFrame(target,key);},{once:true});
      target.srcdoc=loaderErrorDocument(message);
      if(target===activeFrame)setShellRouteUi(key,{loading:false});
    }
    
    function attachFrame(frame,key){
      frame.dataset.route=key;frame.title='磨飯 SMT｜'+(labels[key]||key);allFrames.add(frame);frameByRoute.set(key,frame);
      frame.addEventListener('error',()=>showLoaderError('子頁載入失敗，資料仍保存在本機。',frame));
      frame.addEventListener('load',()=>{delete frame.dataset.appliedProfile;applyProfileToFrame(frame);});
    }
    function createHiddenFrame(key){const frame=document.createElement('iframe');frame.className='shell-page is-loading';frame.setAttribute('aria-hidden','true');frame.tabIndex=-1;attachFrame(frame,key);stage.appendChild(frame);return frame;}
    function findSourceFrame(source){return frameList().find(frame=>source===frame.contentWindow)||null;}
    
    function setActiveFrame(frame,key){
      if(!frame)return;
      const old=activeFrame;
      if(old&&old!==frame){old.classList.remove('is-active','is-loading','has-shell-overlay');old.setAttribute('aria-hidden','true');old.tabIndex=-1;if(old.id==='page')old.id='page-cache-'+String(old.dataset.route||'route');}
      shellApp?.classList.remove('child-overlay-active');
      const existingPage=document.getElementById('page');if(existingPage&&existingPage!==frame)existingPage.removeAttribute('id');
      frame.id='page';frame.classList.remove('is-loading');frame.classList.add('is-active');frame.setAttribute('aria-hidden','false');frame.removeAttribute('tabindex');
      activeFrame=frame;current=key;pending='';childReady=true;clearTimeout(watchdogTimer);stage.dataset.route=current;delete stage.dataset.pendingRoute;
      if(key==='checkout')checkoutExitArmed='';
      setShellRouteUi(key,{loading:false});
      applyChildShellMode(frame);
      setChildOverlayState(frame,frame.classList.contains('has-shell-overlay'));
      try{
        if(key==='checkout')frame.contentWindow?.postMessage({type:'morefun:checkout-enter',route:key},'*');
        frame.contentWindow?.postMessage({type:'morefun:page-activate',route:key},'*');
      }catch(_error){}
    }
    
    function armWatchdog(frame,key){clearTimeout(watchdogTimer);watchdogTimer=setTimeout(()=>{if(key!==pending||readyRoutes.has(key))return;frame.src=pageUrl(key,'retry');},1800);}
    function ensureFrameLoading(key,{force=false,background=false}={}){
      let frame=frameByRoute.get(key);
      if(!frame){frame=createHiddenFrame(key);frame.src=pageUrl(key,force?'reload':'normal');return frame;}
      if(force){readyRoutes.delete(key);setChildOverlayState(frame,false);frame.classList.add('is-loading');frame.classList.remove('is-active');frame.setAttribute('aria-hidden','true');delete frame.dataset.appliedProfile;frame.src=pageUrl(key,'reload');}
      if(background)frame.classList.add('is-loading');
      return frame;
    }
    
    function preloadNext(){
      if(!shellUnlocked||preloadingRoute||!preloadQueue.length)return;
      const key=preloadQueue.shift();
      if(readyRoutes.has(key)||frameByRoute.has(key)){setTimeout(preloadNext,80);return;}
      preloadingRoute=key;
      ensureFrameLoading(key,{background:true});
    }
    function startSequentialPreload(){
      if(preloadStarted||!shellUnlocked||!readyRoutes.has('order'))return;
      preloadStarted=true;preloadQueue=['checkout',...mainRoutes.filter(key=>key!=='order')];setTimeout(preloadNext,40);
    }
    
    function load({force=false}={}){
      const key=route();if(!force&&key===current)return;
      const cached=frameByRoute.get(key);
      if(!force&&cached&&readyRoutes.has(key)){setActiveFrame(cached,key);return;}
      pending=key;childReady=false;stage.dataset.pendingRoute=key;setShellRouteUi(key,{loading:true});
      const frame=ensureFrameLoading(key,{force});armWatchdog(frame,key);
    }
    
    function boot(){
      const key='order';
      current='';pending=key;childReady=false;attachFrame(seedFrame,key);
      seedFrame.classList.remove('is-active');seedFrame.classList.add('is-loading');seedFrame.setAttribute('aria-hidden','true');seedFrame.tabIndex=-1;
      seedFrame.src=pageUrl(key);stage.dataset.pendingRoute=key;setShellRouteUi(key,{loading:true});
      if(location.hash!=='#/order')history.replaceState(null,'','#/order');
    }
    
    function armCheckoutExit(next){
      if(!isCheckoutTransaction()||!checkoutExitRoutes.has(next))return false;
      checkoutExitArmed=next;
      return true;
    }
    
    nav?.addEventListener('click',event=>{
      if(isCheckoutTransaction()){
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const button=event.target.closest('[data-route]');if(!button)return;
      const next=button.dataset.route;if(!routes[next]||next===current)return;
      setShellRouteUi(next,{loading:!readyRoutes.has(next)});
      if(location.hash==='#/'+next)load();else location.hash='#/'+next;
    },true);
    
    addEventListener('hashchange',()=>{
      if(!shellUnlocked)return;
      const next=route();
      if(isCheckoutTransaction()){
        if(checkoutExitArmed===next&&checkoutExitRoutes.has(next)){
          checkoutExitArmed='';
          load();
          return;
        }
        history.replaceState(null,'','#/checkout');
        setShellRouteUi('checkout',{loading:false});
        return;
      }
      checkoutExitArmed='';
      load();
    });
    addEventListener('pageshow',()=>applyProfile());
    addEventListener('resize',scheduleProfileUpdate,{passive:true});
    window.visualViewport?.addEventListener('resize',scheduleProfileUpdate,{passive:true});
    window.visualViewport?.addEventListener('scroll',scheduleProfileUpdate,{passive:true});
    
    addEventListener('message',event=>{
      const frame=findSourceFrame(event.source);if(!frame)return;
      const message=event.data||{};
      if(message.type==='morefun:page-runtime-error'){
        const key=frame.dataset.route||message.page||pending||current||'order';
        console.error('PAGE_RUNTIME_ERROR',key,message.message||'');
        if(!readyRoutes.has(key)||key===pending||(!childReady&&key===current))showLoaderError((labels[key]||'頁面')+'啟動失敗，資料仍保存在本機。',frame);
        else if(frame===activeFrame&&shellContext)shellContext.textContent='操作異常｜資料已保留';
        return;
      }
      if(message.type==='morefun:overlay-state'){
        setChildOverlayState(frame,Boolean(message.open));
        return;
      }
      if(message.type==='morefun:page-ready'){
        const key=frame.dataset.route||message.page||pending||current;readyRoutes.add(key);frame.classList.remove('is-loading');applyProfileToFrame(frame);
        if(preloadingRoute===key){preloadingRoute='';setTimeout(preloadNext,40);}
        if(key===pending||(!childReady&&key===current))requestAnimationFrame(()=>setActiveFrame(frame,key));
        if(key==='order')startSequentialPreload();
        return;
      }
      if(message.type==='morefun:navigate'){
        const next=message.route;if(!routes[next])return;
        if(isCheckoutTransaction()&&next!==current){if(!armCheckoutExit(next))return;}
        if(next===current)return;
        if(location.hash==='#/'+next)load();else location.hash='#/'+next;
      }
    });
    
    window.MoreFunShell={
      unlock(){
        shellUnlocked=true;document.documentElement.dataset.shellUnlocked='1';applyProfile();
        const key=route();
        const cached=frameByRoute.get(key);
        if(cached&&readyRoutes.has(key)){if(current!==key)setActiveFrame(cached,key);return;}
        if(!cached)load();
      },
      reload(){load({force:true});},
      setScale(value){uiScale=Math.max(.82,Math.min(1,Number(value)||1));localStorage.setItem(SCALE_KEY,String(uiScale));applyProfile();},
      getScale(){return uiScale;},
      profile(){return currentProfile;}
    };
    addEventListener('morefun:shell-unlocked',()=>window.MoreFunShell.unlock());
    
    applyProfile();boot();
    
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/shell-atomic-ready-contract.test.mjs:34:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 共用狀態欄永久包含品牌、終端、接單狀態及最近訂單
ok 229 - 共用狀態欄永久包含品牌、終端、接單狀態及最近訂單
  ---
  duration_ms: 1.622352
  type: 'test'
  ...
# Subtest: 共用底欄固定五項、同一套線性圖標及唯一選中項
ok 230 - 共用底欄固定五項、同一套線性圖標及唯一選中項
  ---
  duration_ms: 1.805053
  type: 'test'
  ...
# Subtest: 五個主要頁面全部使用共用狀態欄及底部導航
ok 231 - 五個主要頁面全部使用共用狀態欄及底部導航
  ---
  duration_ms: 0.191453
  type: 'test'
  ...
# Subtest: 五個主要頁面共用同一最近訂單顯示規則
ok 232 - 五個主要頁面共用同一最近訂單顯示規則
  ---
  duration_ms: 0.178494
  type: 'test'
  ...
# Subtest: 底欄高度、選中膠囊、字體及圖標只由共用樣式控制
not ok 233 - 底欄高度、選中膠囊、字體及圖標只由共用樣式控制
  ---
  duration_ms: 1.110204
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/shell-ui.test.mjs:41:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /\.bottom-nav\s*\{[^}]*height:\s*auto[^}]*min-height:\s*calc\(var\(--bottom-nav-height\)/s. Input:
    
    "@import url('./responsive.css');\n" +
      '\n' +
      ':root {\n' +
      '  --orange: #ef5218;\n' +
      '  --orange-soft: #fff2e9;\n' +
      '  --coffee: #ead8c8;\n' +
      '  --coffee-text: #805a43;\n' +
      '  --surface: #fff;\n' +
      '  --bg: #f8f6f2;\n' +
      '  --text: #251f1b;\n' +
      '  --muted: #756b64;\n' +
      '  --line: #e7dfd8;\n' +
      '  --red: #cf4338;\n' +
      '  --green: #39835a;\n' +
      '  --shadow: 0 12px 36px rgba(76, 46, 28, 0.14);\n' +
      '  --choice-pill-radius: 999px;\n' +
      '  font-family: -apple-system, BlinkMacSystemFont, "PingFang HK", "Noto Sans TC", "Microsoft JhengHei", sans-serif;\n' +
      '  color: var(--text);\n' +
      '}\n' +
      ':root[data-theme="warm"]{--orange:#ef5218;--orange-soft:#fff2e9;--bg:#f8f6f2;--text:#251f1b;--line:#e7dfd8}\n' +
      ':root[data-theme="tea"]{--orange:#845d45;--orange-soft:#f5eee8;--bg:#f7f4f0;--text:#2d211b;--line:#e2d8cf}\n' +
      ':root[data-theme="sprout"]{--orange:#34755e;--orange-soft:#eaf4ef;--bg:#f3f7f4;--text:#17251f;--line:#d7e3dc}\n' +
      ':root[data-theme="purple"]{--orange:#755d86;--orange-soft:#f1edf4;--bg:#f7f4f8;--text:#281f2d;--line:#e1d9e5}\n' +
      ':root[data-theme="sunset"]{--orange:#a95048;--orange-soft:#f8ecea;--bg:#f8f4f2;--text:#2e1e1c;--line:#e6d7d3}\n' +
      ':root[data-theme="mist"]{--orange:#4d6477;--orange-soft:#edf2f5;--bg:#f4f6f7;--text:#1c252c;--line:#d8e0e5}\n' +
      '*{box-sizing:border-box}\n' +
      'html,body{margin:0;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;background:var(--bg)}\n' +
      '#app{width:100%;height:100%;min-width:0;min-height:0;overflow:hidden}\n' +
      'button,input,select,textarea{font:inherit}\n' +
      'button{cursor:pointer}\n' +
      '.app{width:100%;height:100vh;min-width:0;min-height:0;display:flex;flex-direction:column;background:var(--bg);overflow:hidden}\n' +
      '.topbar{height:var(--topbar-height);min-height:var(--topbar-height);display:flex;align-items:center;padding:0 calc(var(--page-padding-x) + 8px);gap:calc(var(--space-unit) * 2.25);background:#fff;border-bottom:1px solid var(--line);flex:none}\n' +
      '.brand{font-size:calc(25px * var(--responsive-font-scale));font-weight:950;color:var(--orange)}\n' +
      '.serial small{display:block;color:var(--muted)}\n' +
      '.serial strong{font-size:calc(20px * var(--responsive-font-scale))}\n' +
      '.spacer{flex:1}\n' +
      '.top-btn{min-height:var(--control-min-height);padding:10px 15px;border:1px solid var(--line);border-radius:11px;background:#fff;font-weight:850}\n' +
      '.top-btn.active{background:#fff5ef;border-color:#d7b8a6;color:#8d4d2c}\n' +
      '.badge{display:inline-grid;place-items:center;min-width:27px;height:27px;border-radius:999px;background:var(--orange);color:#fff;font-size:13px}\n' +
      '.health-button span{margin-right:6px}\n' +
      '.workspace{flex:1;min-height:0;padding:var(--page-gap) var(--page-padding-x)}\n' +
      ':is(.top-btn,.category-page>button,.category-search,.categories>button,.segmented>button,.channels>button,.payments>button,.option-grid>button,.option-chips>button,.source-picker>button,.tabs>button,.status-filter>button,.mode-choice,.issue-quick>button,.method-grid>button,.theme){border-radius:var(--choice-pill-radius)!important}\n' +
      ':is(.top-btn,.category-page>button,.category-search,.categories>button,.segmented>button,.channels>button,.payments>button,.option-grid>button,.option-chips>button,.source-picker>button,.tabs>button,.status-filter>button,.mode-choice,.issue-quick>button,.method-grid>button,.theme).active{background:var(--orange-soft)!important;border-color:color-mix(in srgb,var(--orange) 56%,white)!important;color:var(--orange)!important;box-shadow:0 3px 11px color-mix(in srgb,var(--orange) 14%,transparent)}\n' +
      '.page-statusbar{height:calc(var(--topbar-height) * .82);display:flex;align-items:center;gap:14px;padding:8px calc(var(--page-padding-x) + 8px);background:#fff;border-bottom:1px solid var(--line);flex:none}\n' +
      '.panel{background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden}\n' +
      '.btn{min-height:var(--control-min-height);padding:10px 15px;border:1px solid var(--line);border-radius:11px;background:#fff;font-weight:850}\n' +
      '.btn.primary{background:var(--orange);border-color:var(--orange);color:#fff}\n' +
      '.btn.danger{background:#b84d42;border-color:#b84d42;color:#fff}\n' +
      '.btn:disabled{opacity:.4}\n' +
      '.overlay-scrim{position:fixed;inset:0;border:0;background:rgba(246,242,238,.52);-webkit-backdrop-filter:blur(12px) saturate(.82);backdrop-filter:blur(12px) saturate(.82);z-index:80;cursor:default;touch-action:none}\n' +
      '.anchored-popover{position:fixed;z-index:81;background:#fff;border:1px solid var(--line);border-radius:15px;box-shadow:var(--shadow);padding:14px;max-width:var(--modal-max-width);max-height:var(--modal-max-height);overflow:auto}\n' +
      '.anchored-popover header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}\n' +
      '.anchored-popover h2,.anchored-popover h3{margin:0}\n' +
      '.anchored-card{overflow:visible}\n' +
      '.anchored-card::before{content:"";position:absolute;width:16px;height:16px;background:#fff;border-left:1px solid var(--line);border-top:1px solid var(--line);transform:rotate(45deg);z-index:-1}\n' +
      '.anchored-card[data-arrow-side="top"]::before{top:-9px;left:var(--anchor-x,50%);margin-left:-8px}\n' +
      '.anchored-card[data-arrow-side="right"]::before{right:-9px;top:var(--anchor-y,50%);margin-top:-8px;transform:rotate(135deg)}\n' +
      '.anchored-card[data-arrow-side="bottom"]::before{bottom:-9px;left:var(--anchor-x,50%);margin-left:-8px;transform:rotate(225deg)}\n' +
      '.anchored-card[data-arrow-side="left"]::before{left:-9px;top:var(--anchor-y,50%);margin-top:-8px;transform:rotate(-45deg)}\n' +
      '.close{width:40px;height:40px;border:0;border-radius:9px;background:#f4f0ec}\n' +
      '.chips{display:flex;gap:7px;flex-wrap:wrap}\n' +
      '.chips button{min-height:42px;border:1px solid var(--line);border-radius:9px;background:#fff;padding:8px 11px;font-weight:800}\n' +
      '.chips button.active{background:var(--orange-soft);border-color:var(--orange);color:#9a4f2a}\n' +
      '.stepper{display:grid;grid-template-columns:58px 1fr 58px;align-items:center;margin-top:12px;border:1px solid var(--line);border-radius:11px;overflow:hidden}\n' +
      '.stepper button{height:54px;border:0;background:#fff4ec;color:#9b4e28;font-size:28px;font-weight:950}\n' +
      '.stepper strong{text-align:center;font-size:25px}\n' +
      '.toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);padding:13px 20px;border-radius:11px;background:#222;color:#fff;z-index:120;opacity:0;pointer-events:none;transition:.18s}\n' +
      '.toast.show{opacity:1}\n' +
      '.image-shell{position:relative;display:grid;place-items:center;overflow:hidden;background:linear-gradient(145deg,#fff6ee,#eadbce)}\n' +
      '.image-shell img{width:100%;height:100%;object-fit:cover}\n' +
      '.image-fallback{display:grid;place-items:center;width:100%;height:100%;color:#966f58;font-weight:850}\n' +
      '\n' +
      '/* Transitional runtime guard only: global chrome visual ownership lives in app-shell.css. */\n' +
      ':root[data-global-shell="1"] :is(.global-statusbar,.shell-bottom-nav,.bottom-nav,.topbar.statusbar){display:none}\n' +
      ':root[data-global-shell="1"] .app{height:100%;min-height:0}\n' +
      ':root[data-global-shell="1"] .workspace{min-height:0}\n' +
      ':root[data-global-shell="1"] body[data-page="more"] .more-heading{display:none}\n' +
      '\n' +
      ':root{--shadow-soft:0 4px 16px rgba(76,46,28,.08);--shadow-press:0 2px 7px rgba(76,46,28,.11);--radius-control:12px;--radius-card:18px;--motion-standard:cubic-bezier(.22,1,.36,1)}\n' +
      'button{-webkit-tap-highlight-color:transparent;touch-action:manipulation;transition:transform .16s var(--motion-standard),box-shadow .18s ease,background-color .18s ease,border-color .18s ease,color .18s ease,opacity .18s ease}\n' +
      'button:active:not(:disabled){transform:translateY(1px) scale(.975);box-shadow:var(--shadow-press)}\n' +
      'button:disabled{cursor:not-allowed;opacity:.42}\n' +
      'button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid color-mix(in srgb,var(--orange) 28%,transparent);outline-offset:2px;border-color:var(--orange)}\n' +
      'input,select,textarea{transition:border-color .18s ease,box-shadow .18s ease,background-color .18s ease}\n' +
      '.dialog-scrim,.modal-scrim,.overlay-scrim{animation:mf-scrim-in .2s ease-out both}\n' +
      '.detail-dialog,.confirm-dialog,.modal-card,.confirm-card,.anchored-popover{animation:mf-dialog-in .22s ease-out both}\n' +
      '.side-panel,.pending-review-panel{animation:mf-drawer-in .28s var(--motion-standard) both}\n' +
      '@keyframes mf-scrim-in{from{opacity:0}to{opacity:1}}\n' +
      '@keyframes mf-dialog-in{from{opacity:0}to{opacity:1}}\n' +
      '@keyframes mf-drawer-in{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}\n' +
      '@media (hover:hover){button:not(:disabled):hover{filter:saturate(1.04);box-shadow:var(--shadow-soft)}}\n' +
      '@media (prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}button:not(:disabled):active{transform:none}}'
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    @import url('./responsive.css');
    
    :root {
      --orange: #ef5218;
      --orange-soft: #fff2e9;
      --coffee: #ead8c8;
      --coffee-text: #805a43;
      --surface: #fff;
      --bg: #f8f6f2;
      --text: #251f1b;
      --muted: #756b64;
      --line: #e7dfd8;
      --red: #cf4338;
      --green: #39835a;
      --shadow: 0 12px 36px rgba(76, 46, 28, 0.14);
      --choice-pill-radius: 999px;
      font-family: -apple-system, BlinkMacSystemFont, "PingFang HK", "Noto Sans TC", "Microsoft JhengHei", sans-serif;
      color: var(--text);
    }
    :root[data-theme="warm"]{--orange:#ef5218;--orange-soft:#fff2e9;--bg:#f8f6f2;--text:#251f1b;--line:#e7dfd8}
    :root[data-theme="tea"]{--orange:#845d45;--orange-soft:#f5eee8;--bg:#f7f4f0;--text:#2d211b;--line:#e2d8cf}
    :root[data-theme="sprout"]{--orange:#34755e;--orange-soft:#eaf4ef;--bg:#f3f7f4;--text:#17251f;--line:#d7e3dc}
    :root[data-theme="purple"]{--orange:#755d86;--orange-soft:#f1edf4;--bg:#f7f4f8;--text:#281f2d;--line:#e1d9e5}
    :root[data-theme="sunset"]{--orange:#a95048;--orange-soft:#f8ecea;--bg:#f8f4f2;--text:#2e1e1c;--line:#e6d7d3}
    :root[data-theme="mist"]{--orange:#4d6477;--orange-soft:#edf2f5;--bg:#f4f6f7;--text:#1c252c;--line:#d8e0e5}
    *{box-sizing:border-box}
    html,body{margin:0;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;background:var(--bg)}
    #app{width:100%;height:100%;min-width:0;min-height:0;overflow:hidden}
    button,input,select,textarea{font:inherit}
    button{cursor:pointer}
    .app{width:100%;height:100vh;min-width:0;min-height:0;display:flex;flex-direction:column;background:var(--bg);overflow:hidden}
    .topbar{height:var(--topbar-height);min-height:var(--topbar-height);display:flex;align-items:center;padding:0 calc(var(--page-padding-x) + 8px);gap:calc(var(--space-unit) * 2.25);background:#fff;border-bottom:1px solid var(--line);flex:none}
    .brand{font-size:calc(25px * var(--responsive-font-scale));font-weight:950;color:var(--orange)}
    .serial small{display:block;color:var(--muted)}
    .serial strong{font-size:calc(20px * var(--responsive-font-scale))}
    .spacer{flex:1}
    .top-btn{min-height:var(--control-min-height);padding:10px 15px;border:1px solid var(--line);border-radius:11px;background:#fff;font-weight:850}
    .top-btn.active{background:#fff5ef;border-color:#d7b8a6;color:#8d4d2c}
    .badge{display:inline-grid;place-items:center;min-width:27px;height:27px;border-radius:999px;background:var(--orange);color:#fff;font-size:13px}
    .health-button span{margin-right:6px}
    .workspace{flex:1;min-height:0;padding:var(--page-gap) var(--page-padding-x)}
    :is(.top-btn,.category-page>button,.category-search,.categories>button,.segmented>button,.channels>button,.payments>button,.option-grid>button,.option-chips>button,.source-picker>button,.tabs>button,.status-filter>button,.mode-choice,.issue-quick>button,.method-grid>button,.theme){border-radius:var(--choice-pill-radius)!important}
    :is(.top-btn,.category-page>button,.category-search,.categories>button,.segmented>button,.channels>button,.payments>button,.option-grid>button,.option-chips>button,.source-picker>button,.tabs>button,.status-filter>button,.mode-choice,.issue-quick>button,.method-grid>button,.theme).active{background:var(--orange-soft)!important;border-color:color-mix(in srgb,var(--orange) 56%,white)!important;color:var(--orange)!important;box-shadow:0 3px 11px color-mix(in srgb,var(--orange) 14%,transparent)}
    .page-statusbar{height:calc(var(--topbar-height) * .82);display:flex;align-items:center;gap:14px;padding:8px calc(var(--page-padding-x) + 8px);background:#fff;border-bottom:1px solid var(--line);flex:none}
    .panel{background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden}
    .btn{min-height:var(--control-min-height);padding:10px 15px;border:1px solid var(--line);border-radius:11px;background:#fff;font-weight:850}
    .btn.primary{background:var(--orange);border-color:var(--orange);color:#fff}
    .btn.danger{background:#b84d42;border-color:#b84d42;color:#fff}
    .btn:disabled{opacity:.4}
    .overlay-scrim{position:fixed;inset:0;border:0;background:rgba(246,242,238,.52);-webkit-backdrop-filter:blur(12px) saturate(.82);backdrop-filter:blur(12px) saturate(.82);z-index:80;cursor:default;touch-action:none}
    .anchored-popover{position:fixed;z-index:81;background:#fff;border:1px solid var(--line);border-radius:15px;box-shadow:var(--shadow);padding:14px;max-width:var(--modal-max-width);max-height:var(--modal-max-height);overflow:auto}
    .anchored-popover header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
    .anchored-popover h2,.anchored-popover h3{margin:0}
    .anchored-card{overflow:visible}
    .anchored-card::before{content:"";position:absolute;width:16px;height:16px;background:#fff;border-left:1px solid var(--line);border-top:1px solid var(--line);transform:rotate(45deg);z-index:-1}
    .anchored-card[data-arrow-side="top"]::before{top:-9px;left:var(--anchor-x,50%);margin-left:-8px}
    .anchored-card[data-arrow-side="right"]::before{right:-9px;top:var(--anchor-y,50%);margin-top:-8px;transform:rotate(135deg)}
    .anchored-card[data-arrow-side="bottom"]::before{bottom:-9px;left:var(--anchor-x,50%);margin-left:-8px;transform:rotate(225deg)}
    .anchored-card[data-arrow-side="left"]::before{left:-9px;top:var(--anchor-y,50%);margin-top:-8px;transform:rotate(-45deg)}
    .close{width:40px;height:40px;border:0;border-radius:9px;background:#f4f0ec}
    .chips{display:flex;gap:7px;flex-wrap:wrap}
    .chips button{min-height:42px;border:1px solid var(--line);border-radius:9px;background:#fff;padding:8px 11px;font-weight:800}
    .chips button.active{background:var(--orange-soft);border-color:var(--orange);color:#9a4f2a}
    .stepper{display:grid;grid-template-columns:58px 1fr 58px;align-items:center;margin-top:12px;border:1px solid var(--line);border-radius:11px;overflow:hidden}
    .stepper button{height:54px;border:0;background:#fff4ec;color:#9b4e28;font-size:28px;font-weight:950}
    .stepper strong{text-align:center;font-size:25px}
    .toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);padding:13px 20px;border-radius:11px;background:#222;color:#fff;z-index:120;opacity:0;pointer-events:none;transition:.18s}
    .toast.show{opacity:1}
    .image-shell{position:relative;display:grid;place-items:center;overflow:hidden;background:linear-gradient(145deg,#fff6ee,#eadbce)}
    .image-shell img{width:100%;height:100%;object-fit:cover}
    .image-fallback{display:grid;place-items:center;width:100%;height:100%;color:#966f58;font-weight:850}
    
    /* Transitional runtime guard only: global chrome visual ownership lives in app-shell.css. */
    :root[data-global-shell="1"] :is(.global-statusbar,.shell-bottom-nav,.bottom-nav,.topbar.statusbar){display:none}
    :root[data-global-shell="1"] .app{height:100%;min-height:0}
    :root[data-global-shell="1"] .workspace{min-height:0}
    :root[data-global-shell="1"] body[data-page="more"] .more-heading{display:none}
    
    :root{--shadow-soft:0 4px 16px rgba(76,46,28,.08);--shadow-press:0 2px 7px rgba(76,46,28,.11);--radius-control:12px;--radius-card:18px;--motion-standard:cubic-bezier(.22,1,.36,1)}
    button{-webkit-tap-highlight-color:transparent;touch-action:manipulation;transition:transform .16s var(--motion-standard),box-shadow .18s ease,background-color .18s ease,border-color .18s ease,color .18s ease,opacity .18s ease}
    button:active:not(:disabled){transform:translateY(1px) scale(.975);box-shadow:var(--shadow-press)}
    button:disabled{cursor:not-allowed;opacity:.42}
    button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid color-mix(in srgb,var(--orange) 28%,transparent);outline-offset:2px;border-color:var(--orange)}
    input,select,textarea{transition:border-color .18s ease,box-shadow .18s ease,background-color .18s ease}
    .dialog-scrim,.modal-scrim,.overlay-scrim{animation:mf-scrim-in .2s ease-out both}
    .detail-dialog,.confirm-dialog,.modal-card,.confirm-card,.anchored-popover{animation:mf-dialog-in .22s ease-out both}
    .side-panel,.pending-review-panel{animation:mf-drawer-in .28s var(--motion-standard) both}
    @keyframes mf-scrim-in{from{opacity:0}to{opacity:1}}
    @keyframes mf-dialog-in{from{opacity:0}to{opacity:1}}
    @keyframes mf-drawer-in{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}
    @media (hover:hover){button:not(:disabled):hover{filter:saturate(1.04);box-shadow:var(--shadow-soft)}}
    @media (prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}button:not(:disabled):active{transform:none}}
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/shell-ui.test.mjs:42:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 分類、頁籤、分段、付款、來源及模式選擇共用膠囊規則
ok 234 - 分類、頁籤、分段、付款、來源及模式選擇共用膠囊規則
  ---
  duration_ms: 0.25005
  type: 'test'
  ...
# Subtest: 來源彈窗支援四方向箭嘴並由定位器標記實際方向
ok 235 - 來源彈窗支援四方向箭嘴並由定位器標記實際方向
  ---
  duration_ms: 0.230982
  type: 'test'
  ...
# Subtest: 售罄頁沿用產品分類與三種點單卡模板
ok 236 - 售罄頁沿用產品分類與三種點單卡模板
  ---
  duration_ms: 1.110174
  type: 'test'
  ...
# Subtest: 右欄提供分類售罄列表、收起與圖片顯示切換
ok 237 - 右欄提供分類售罄列表、收起與圖片顯示切換
  ---
  duration_ms: 0.255929
  type: 'test'
  ...
# Subtest: 批量模式使用待確認欄及四個固定操作
ok 238 - 批量模式使用待確認欄及四個固定操作
  ---
  duration_ms: 0.193336
  type: 'test'
  ...
# Subtest: 正常模式產品詳情提供四個供應狀態操作
ok 239 - 正常模式產品詳情提供四個供應狀態操作
  ---
  duration_ms: 0.243361
  type: 'test'
  ...
# Subtest: 批量模式點擊整張產品卡即可加入或取消
ok 240 - 批量模式點擊整張產品卡即可加入或取消
  ---
  duration_ms: 0.161689
  type: 'test'
  ...
# Subtest: 目前分類支援一次性多選、全選及全不選並保留跨分類選取
ok 241 - 目前分類支援一次性多選、全選及全不選並保留跨分類選取
  ---
  duration_ms: 0.134349
  type: 'test'
  ...
# Subtest: 提供紫米快捷操作、售罄獨立分類及清晰狀態卡
ok 242 - 提供紫米快捷操作、售罄獨立分類及清晰狀態卡
  ---
  duration_ms: 0.219996
  type: 'test'
  ...
# Subtest: 售罄頁可獨立切換大圖小圖及純文字卡
ok 243 - 售罄頁可獨立切換大圖小圖及純文字卡
  ---
  duration_ms: 0.187688
  type: 'test'
  ...
# Subtest: 應用程式路由已接入售罄頁
ok 244 - 應用程式路由已接入售罄頁
  ---
  duration_ms: 0.376548
  type: 'test'
  ...
# Subtest: 售罄頁使用正確餐牌後備參數，網絡失敗亦保留可操作頁面
ok 245 - 售罄頁使用正確餐牌後備參數，網絡失敗亦保留可操作頁面
  ---
  duration_ms: 0.474963
  type: 'test'
  ...
# Subtest: 售罄產品移出原分類並集中到售罄分類，停售仍留原分類
ok 246 - 售罄產品移出原分類並集中到售罄分類，停售仍留原分類
  ---
  duration_ms: 0.198934
  type: 'test'
  ...
# Subtest: 小圖與純文字卡共用點單頁自適應卡尺寸模型
not ok 247 - 小圖與純文字卡共用點單頁自適應卡尺寸模型
  ---
  duration_ms: 0.92557
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/soldout-page.test.mjs:80:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /body\[data-page="soldout"\] \.supply-product\.small \.card-open\{[\s\S]*?grid-template-columns:min\(calc\(var\(--adaptive-product-row-small\) - 18px\),82px\)/. Input:
    
    ':root{\n' +
      '  --readability-scale:1;\n' +
      '  --min-readable-font:13px;\n' +
      '  --adaptive-product-row-large:180px;\n' +
      '  --adaptive-product-row-small:126px;\n' +
      '  --adaptive-product-row-text:102px;\n' +
      '  --adaptive-cart-scale:1;\n' +
      '  --adaptive-cart-image:72px;\n' +
      '  --adaptive-cart-marker:calc(var(--adaptive-cart-image) * .9);\n' +
      '  --adaptive-cart-gap:11px;\n' +
      '  --adaptive-cart-pad:13px;\n' +
      '  --adaptive-cart-control:36px;\n' +
      '  --adaptive-cart-header-pad:14px;\n' +
      '  --adaptive-cart-footer-pad:13px;\n' +
      '  --adaptive-cart-pending-pad:10px;\n' +
      '}\n'
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    :root{
      --readability-scale:1;
      --min-readable-font:13px;
      --adaptive-product-row-large:180px;
      --adaptive-product-row-small:126px;
      --adaptive-product-row-text:102px;
      --adaptive-cart-scale:1;
      --adaptive-cart-image:72px;
      --adaptive-cart-marker:calc(var(--adaptive-cart-image) * .9);
      --adaptive-cart-gap:11px;
      --adaptive-cart-pad:13px;
      --adaptive-cart-control:36px;
      --adaptive-cart-header-pad:14px;
      --adaptive-cart-footer-pad:13px;
      --adaptive-cart-pending-pad:10px;
    }
    
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/soldout-page.test.mjs:82:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
1..247
# tests 247
# suites 0
# pass 237
# fail 10
# cancelled 0
# skipped 0
# todo 0
# duration_ms 867.154994
```

## Syntax checks
```text
> node --check app-loader.js
> node --check shared/runtime.js
> node --check shared/adaptive-layout.js
> node --check shared/page-bridge.js
> node --check pages/order/page.js
> node --check pages/order/order-domain.js
> node --check pages/order/menu-api.js
> node --check pages/checkout/page.js
```

AUDIT_STATUS=0
TEST_STATUS=1
SYNTAX_STATUS=0
RESULT=FAIL
