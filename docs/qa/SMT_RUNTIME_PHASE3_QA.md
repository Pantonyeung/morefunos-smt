# SMT Runtime Phase 3 QA

Commit: e2145bc3dd48a46127d1abc33aa035fc1bea24d7

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
  duration_ms: 5.54059
  type: 'test'
  ...
# Subtest: knowledge graph edges resolve and carry evidence
ok 2 - knowledge graph edges resolve and carry evidence
  ---
  duration_ms: 1.380357
  type: 'test'
  ...
# Subtest: status separates automation from device acceptance
ok 3 - status separates automation from device acceptance
  ---
  duration_ms: 1.905237
  type: 'test'
  ...
# Subtest: cart adaptive scale must not shrink from cart height at 1920 baseline
ok 4 - cart adaptive scale must not shrink from cart height at 1920 baseline
  ---
  duration_ms: 0.773347
  type: 'test'
  ...
# Subtest: cart marker remains exactly 90% of cart image token
ok 5 - cart marker remains exactly 90% of cart image token
  ---
  duration_ms: 0.144614
  type: 'test'
  ...
# SMT_CART_CHECKOUT_CORE_V7_OK
# Subtest: tests/cart-checkout-regression-v2.test.mjs
ok 3 - tests/cart-checkout-regression-v2.test.mjs
  ---
  duration_ms: 47.99033
  type: 'test'
  ...
# Subtest: 分類版面設定只接受每行五至七格、一至兩行及搜尋開關
ok 7 - 分類版面設定只接受每行五至七格、一至兩行及搜尋開關
  ---
  duration_ms: 1.845036
  type: 'test'
  ...
# Subtest: 搜尋開啟時佔最後一行最後一格，超出首屏分類保留在可操作溢出清單
ok 8 - 搜尋開啟時佔最後一行最後一格，超出首屏分類保留在可操作溢出清單
  ---
  duration_ms: 0.477072
  type: 'test'
  ...
# Subtest: 學生優惠只將六元或以上合資格特飲的加價減半，普通凍檸茶不減價
ok 9 - 學生優惠只將六元或以上合資格特飲的加價減半，普通凍檸茶不減價
  ---
  duration_ms: 1.43757
  type: 'test'
  ...
# Subtest: 學生優惠人數不可超過合資格飲品數量
ok 10 - 學生優惠人數不可超過合資格飲品數量
  ---
  duration_ms: 0.396388
  type: 'test'
  ...
# Subtest: 未有明確資格或特飲加價少於六元，一律不可自行推斷為學生優惠
ok 11 - 未有明確資格或特飲加價少於六元，一律不可自行推斷為學生優惠
  ---
  duration_ms: 0.410071
  type: 'test'
  ...
# Subtest: 團體整單折扣與學生優惠互斥，現場可使用
ok 12 - 團體整單折扣與學生優惠互斥，現場可使用
  ---
  duration_ms: 0.276797
  type: 'test'
  ...
# Subtest: 平台訂單不可使用本店優惠
ok 13 - 平台訂單不可使用本店優惠
  ---
  duration_ms: 0.609176
  type: 'test'
  ...
# Subtest: 數字鍵盤支援數字、小數、退格及清除
ok 14 - 數字鍵盤支援數字、小數、退格及清除
  ---
  duration_ms: 0.362256
  type: 'test'
  ...
# Subtest: 數字鍵盤的 00 是獨立雙零鍵
ok 15 - 數字鍵盤的 00 是獨立雙零鍵
  ---
  duration_ms: 0.27215
  type: 'test'
  ...
# Subtest: 完成結帳保存優惠、應付金額及實際操作終端
ok 16 - 完成結帳保存優惠、應付金額及實際操作終端
  ---
  duration_ms: 1.302801
  type: 'test'
  ...
# Subtest: 渠道政策只容許現場單選付款方式，其他渠道只收必要參考資料
ok 17 - 渠道政策只容許現場單選付款方式，其他渠道只收必要參考資料
  ---
  duration_ms: 1.316704
  type: 'test'
  ...
# Subtest: 現場渠道不提供稍後付款
ok 18 - 現場渠道不提供稍後付款
  ---
  duration_ms: 0.836674
  type: 'test'
  ...
# Subtest: 自有渠道不猜付款方式，平台訂單分開保存佣金及預計結算
ok 19 - 自有渠道不猜付款方式，平台訂單分開保存佣金及預計結算
  ---
  duration_ms: 1.468686
  type: 'test'
  ...
# Subtest: 零元訂單不可建立付款紀錄
ok 20 - 零元訂單不可建立付款紀錄
  ---
  duration_ms: 0.25277
  type: 'test'
  ...
# Subtest: 結帳頁使用共用三位每日流水及永久訂單識別
ok 21 - 結帳頁使用共用三位每日流水及永久訂單識別
  ---
  duration_ms: 12.017727
  type: 'test'
  ...
# Subtest: 結帳紀錄同時保存永久編號及每日顯示流水
ok 22 - 結帳紀錄同時保存永久編號及每日顯示流水
  ---
  duration_ms: 0.537155
  type: 'test'
  ...
# Subtest: 結帳頂部只顯示狀態資料，不保留假快捷金額按鈕
ok 23 - 結帳頂部只顯示狀態資料，不保留假快捷金額按鈕
  ---
  duration_ms: 0.886065
  type: 'test'
  ...
# Subtest: 結帳頁保留數字鍵盤而不顯示底部主導航
ok 24 - 結帳頁保留數字鍵盤而不顯示底部主導航
  ---
  duration_ms: 0.246425
  type: 'test'
  ...
# Subtest: 詳情操作固定提供返回訂單及優惠兩欄
ok 25 - 詳情操作固定提供返回訂單及優惠兩欄
  ---
  duration_ms: 0.128915
  type: 'test'
  ...
# Subtest: 付款區及現金鍵盤由渠道政策動態控制而非所有渠道全部顯示
ok 26 - 付款區及現金鍵盤由渠道政策動態控制而非所有渠道全部顯示
  ---
  duration_ms: 0.15827
  type: 'test'
  ...
# Subtest: 結帳完成保留核對卡並提供有原因的更正資料入口
ok 27 - 結帳完成保留核對卡並提供有原因的更正資料入口
  ---
  duration_ms: 0.151945
  type: 'test'
  ...
# Subtest: 非現場渠道有對應的備註、取餐碼、核對碼或平台單號欄位
ok 28 - 非現場渠道有對應的備註、取餐碼、核對碼或平台單號欄位
  ---
  duration_ms: 0.107848
  type: 'test'
  ...
# Subtest: 快捷金額固定在大鍵盤上方，現場轉換付款方式亦不收起鍵盤
ok 29 - 快捷金額固定在大鍵盤上方，現場轉換付款方式亦不收起鍵盤
  ---
  duration_ms: 0.242825
  type: 'test'
  ...
# Subtest: 已收框是唯一金額輸入顯示並在輸入狀態發光
ok 30 - 已收框是唯一金額輸入顯示並在輸入狀態發光
  ---
  duration_ms: 0.132041
  type: 'test'
  ...
# Subtest: 渠道及付款方式引用大圖標 WebP 資源並採用上圖下字
ok 31 - 渠道及付款方式引用大圖標 WebP 資源並採用上圖下字
  ---
  duration_ms: 0.420526
  type: 'test'
  ...
# Subtest: 數字鍵盤使用四行放大按鍵
ok 32 - 數字鍵盤使用四行放大按鍵
  ---
  duration_ms: 0.33374
  type: 'test'
  ...
# Subtest: 零元時確認按鈕停用並顯示清楚原因
ok 33 - 零元時確認按鈕停用並顯示清楚原因
  ---
  duration_ms: 0.207643
  type: 'test'
  ...
# Subtest: 任何渠道的確認結帳操作永遠固定在付款欄最底
ok 34 - 任何渠道的確認結帳操作永遠固定在付款欄最底
  ---
  duration_ms: 0.173345
  type: 'test'
  ...
# Subtest: 堂食頁固定顯示八張室內枱及戶外枱
ok 35 - 堂食頁固定顯示八張室內枱及戶外枱
  ---
  duration_ms: 4.447771
  type: 'test'
  ...
# Subtest: 三十五分鐘提示只標記枱卡，不增加第三種枱位狀態
ok 36 - 三十五分鐘提示只標記枱卡，不增加第三種枱位狀態
  ---
  duration_ms: 0.549469
  type: 'test'
  ...
# Subtest: 逐餐品付款可拆數量並鎖定已付款數量
ok 37 - 逐餐品付款可拆數量並鎖定已付款數量
  ---
  duration_ms: 0.93926
  type: 'test'
  ...
# Subtest: 堂食付款歸零會建立現場歷史訂單並即時清空枱位
ok 38 - 堂食付款歸零會建立現場歷史訂單並即時清空枱位
  ---
  duration_ms: 2.351581
  type: 'test'
  ...
# Subtest: 堂食正式落單即鎖定流水並保存到製作工作，跨營業日付款亦不改號
ok 39 - 堂食正式落單即鎖定流水並保存到製作工作，跨營業日付款亦不改號
  ---
  duration_ms: 1.98727
  type: 'test'
  ...
# Subtest: 同時使用中的堂食枱亦會佔用每日流水避免撞號
ok 40 - 同時使用中的堂食枱亦會佔用每日流水避免撞號
  ---
  duration_ms: 0.672484
  type: 'test'
  ...
# Subtest: 舊版未有識別的堂食枱直接付款時會避開其他活躍枱流水
ok 41 - 舊版未有識別的堂食枱直接付款時會避開其他活躍枱流水
  ---
  duration_ms: 0.837147
  type: 'test'
  ...
# Subtest: 載入舊資料時會補救已付清但未清枱的堂食會話，且不重複寫歷史
ok 42 - 載入舊資料時會補救已付清但未清枱的堂食會話，且不重複寫歷史
  ---
  duration_ms: 0.817959
  type: 'test'
  ...
# Subtest: 堂食掃碼提交保持待確認，確認後才加入落單記錄
ok 43 - 堂食掃碼提交保持待確認，確認後才加入落單記錄
  ---
  duration_ms: 0.890299
  type: 'test'
  ...
# Subtest: 員工堂食點餐會建立指定枱會話內容，金額及批次由同一批餐品計算
ok 44 - 員工堂食點餐會建立指定枱會話內容，金額及批次由同一批餐品計算
  ---
  duration_ms: 1.008673
  type: 'test'
  ...
# Subtest: 堂食枱面摘要提供營運所需時間、餐點及數量資料
ok 45 - 堂食枱面摘要提供營運所需時間、餐點及數量資料
  ---
  duration_ms: 0.444338
  type: 'test'
  ...
# Subtest: 堂食點餐拒絕寫入已失效的舊會話，避免餐品掛錯枱
ok 46 - 堂食點餐拒絕寫入已失效的舊會話，避免餐品掛錯枱
  ---
  duration_ms: 0.399149
  type: 'test'
  ...
# Subtest: 空枱開始點餐只建立意圖，正式提交餐品時才開枱
ok 47 - 空枱開始點餐只建立意圖，正式提交餐品時才開枱
  ---
  duration_ms: 0.692046
  type: 'test'
  ...
# Subtest: 舊版本遺留的空堂食會話會安全清理，有餐品的會話不受影響
ok 48 - 舊版本遺留的空堂食會話會安全清理，有餐品的會話不受影響
  ---
  duration_ms: 0.492767
  type: 'test'
  ...
# Subtest: 堂食頁提供簡潔枱詳情、半屏待確認及兩層付款操作
ok 49 - 堂食頁提供簡潔枱詳情、半屏待確認及兩層付款操作
  ---
  duration_ms: 0.427354
  type: 'test'
  ...
# Subtest: 正式堂食頁不會自動建立示範枱或示範訂單，掃碼入口標示第二版保留
ok 50 - 正式堂食頁不會自動建立示範枱或示範訂單，掃碼入口標示第二版保留
  ---
  duration_ms: 0.333086
  type: 'test'
  ...
# Subtest: 堂食枱卡直接顯示開枱、三十五分鐘及首三項餐點摘要
ok 51 - 堂食枱卡直接顯示開枱、三十五分鐘及首三項餐點摘要
  ---
  duration_ms: 0.2405
  type: 'test'
  ...
# Subtest: 現有點餐及訂單底欄可以進入獨立堂食頁
ok 52 - 現有點餐及訂單底欄可以進入獨立堂食頁
  ---
  duration_ms: 0.918633
  type: 'test'
  ...
# Subtest: 堂食點單提供取消入口並同步清除失效堂食脈絡
ok 53 - 堂食點單提供取消入口並同步清除失效堂食脈絡
  ---
  duration_ms: 0.683163
  type: 'test'
  ...
# Subtest: 點單頁兩個堂食落單入口都會讀取完成歷史避免重複流水
ok 54 - 點單頁兩個堂食落單入口都會讀取完成歷史避免重複流水
  ---
  duration_ms: 0.695492
  type: 'test'
  ...
# Subtest: 堂食頁最近訂單使用共用時間排序及三位顯示號碼
ok 55 - 堂食頁最近訂單使用共用時間排序及三位顯示號碼
  ---
  duration_ms: 1.092448
  type: 'test'
  ...
# Subtest: draft numbers are sequential within each terminal prefix
ok 56 - draft numbers are sequential within each terminal prefix
  ---
  duration_ms: 1.332883
  type: 'test'
  ...
# Subtest: a removed draft number is never reissued after retrieval
ok 57 - a removed draft number is never reissued after retrieval
  ---
  duration_ms: 0.505308
  type: 'test'
  ...
# Subtest: saving a cart records terminal ownership and an audit event
ok 58 - saving a cart records terminal ownership and an audit event
  ---
  duration_ms: 0.257485
  type: 'test'
  ...
# Subtest: taking over another terminal draft preserves lineage
ok 59 - taking over another terminal draft preserves lineage
  ---
  duration_ms: 0.522449
  type: 'test'
  ...
# Subtest: 日結會清空當時所有草稿，而新營業日草稿不會被誤刪
ok 60 - 日結會清空當時所有草稿，而新營業日草稿不會被誤刪
  ---
  duration_ms: 1.67473
  type: 'test'
  ...
# Subtest: a taken-over cart is renumbered under the terminal that saves it again
ok 61 - a taken-over cart is renumbered under the terminal that saves it again
  ---
  duration_ms: 0.382777
  type: 'test'
  ...
# Subtest: checkout records which terminal completed the order
ok 62 - checkout records which terminal completed the order
  ---
  duration_ms: 0.265855
  type: 'test'
  ...
# GLOBAL_STATUS_ACTION_DESCRIPTOR_CORE_OK
# Subtest: tests/global-status-actions-contract.test.mjs
ok 9 - tests/global-status-actions-contract.test.mjs
  ---
  duration_ms: 37.841108
  type: 'test'
  ...
# SMT_HEALTH_SEAL_DESCRIPTOR_CONTRACT_OK
# Subtest: tests/health-seal-contract.test.mjs
ok 10 - tests/health-seal-contract.test.mjs
  ---
  duration_ms: 44.649435
  type: 'test'
  ...
# Subtest: Firebase keyed catalog normalizes categories, products and availability
ok 65 - Firebase keyed catalog normalizes categories, products and availability
  ---
  duration_ms: 2.612918
  type: 'test'
  ...
# Subtest: remote products use live values while inheriting locked SMT behaviour by code
ok 66 - remote products use live values while inheriting locked SMT behaviour by code
  ---
  duration_ms: 2.880618
  type: 'test'
  ...
# Subtest: live drink products become quick drinks and retain modifier capabilities
ok 67 - live drink products become quick drinks and retain modifier capabilities
  ---
  duration_ms: 0.577791
  type: 'test'
  ...
# Subtest: menu loader caches a successful response and falls back to cache offline
ok 68 - menu loader caches a successful response and falls back to cache offline
  ---
  duration_ms: 1.35682
  type: 'test'
  ...
# Subtest: runtime uses Firebase RTDB and contains no Apps Script transport
ok 69 - runtime uses Firebase RTDB and contains no Apps Script transport
  ---
  duration_ms: 13.403057
  type: 'test'
  ...
# Subtest: 共用頁面橋接會從正式設定套用主題及聲音狀態
ok 70 - 共用頁面橋接會從正式設定套用主題及聲音狀態
  ---
  duration_ms: 2.085736
  type: 'test'
  ...
# Subtest: 點單頁重載會讀取更多頁保存的快速模式及產品圖片設定
ok 71 - 點單頁重載會讀取更多頁保存的快速模式及產品圖片設定
  ---
  duration_ms: 0.256245
  type: 'test'
  ...
# Subtest: 正式結帳會建立中央打印工作而不把排隊當成實體成功
ok 72 - 正式結帳會建立中央打印工作而不把排隊當成實體成功
  ---
  duration_ms: 0.227428
  type: 'test'
  ...
# Subtest: 訂單重印會即時匯入中央打印工作佇列
ok 73 - 訂單重印會即時匯入中央打印工作佇列
  ---
  duration_ms: 0.168841
  type: 'test'
  ...
# Subtest: 堂食正式落單後會把堂食打印工作匯入中央佇列
ok 74 - 堂食正式落單後會把堂食打印工作匯入中央佇列
  ---
  duration_ms: 0.129869
  type: 'test'
  ...
# Subtest: 營業日固定由早上五時起計並排除上一營業日訂單
ok 75 - 營業日固定由早上五時起計並排除上一營業日訂單
  ---
  duration_ms: 172.152564
  type: 'test'
  ...
# Subtest: 報表分開淨銷售、付款、平台結算、待核實及打印異常
ok 76 - 報表分開淨銷售、付款、平台結算、待核實及打印異常
  ---
  duration_ms: 4.139038
  type: 'test'
  ...
# Subtest: 歷史報表支援今日昨日七日三十日三個月六個月及自訂日期
ok 77 - 歷史報表支援今日昨日七日三十日三個月六個月及自訂日期
  ---
  duration_ms: 1.728864
  type: 'test'
  ...
# Subtest: 選定歷史範圍會由訂單明細重算而不是只讀今日
ok 78 - 選定歷史範圍會由訂單明細重算而不是只讀今日
  ---
  duration_ms: 6.932598
  type: 'test'
  ...
# Subtest: 付款及渠道分拆提供對數欄位、狀態及對應訂單
ok 79 - 付款及渠道分拆提供對數欄位、狀態及對應訂單
  ---
  duration_ms: 0.615724
  type: 'test'
  ...
# Subtest: 結帳、堂食及舊核數的付款別名會合併到同一對數方式
ok 80 - 結帳、堂食及舊核數的付款別名會合併到同一對數方式
  ---
  duration_ms: 0.930642
  type: 'test'
  ...
# Subtest: 未知付款方式歸入其他而不會製造無限新分類
ok 81 - 未知付款方式歸入其他而不會製造無限新分類
  ---
  duration_ms: 0.533461
  type: 'test'
  ...
# Subtest: 堂食分拆付款按每次實收方式對數而不只顯示組合付款
ok 82 - 堂食分拆付款按每次實收方式對數而不只顯示組合付款
  ---
  duration_ms: 3.65049
  type: 'test'
  ...
# Subtest: 付款實收讀取真正 paidAmount 並保留短收及多收的正負差額
ok 83 - 付款實收讀取真正 paidAmount 並保留短收及多收的正負差額
  ---
  duration_ms: 0.797477
  type: 'test'
  ...
# Subtest: 現金對數以收款減找續計算，不會把找續再扣一次
ok 84 - 現金對數以收款減找續計算，不會把找續再扣一次
  ---
  duration_ms: 0.894513
  type: 'test'
  ...
# Subtest: 平台付款別名統一顯示為平台代收
ok 85 - 平台付款別名統一顯示為平台代收
  ---
  duration_ms: 0.543453
  type: 'test'
  ...
# Subtest: 商品分類、時段及異常資料保留對應訂單供介面下鑽
ok 86 - 商品分類、時段及異常資料保留對應訂單供介面下鑽
  ---
  duration_ms: 0.580882
  type: 'test'
  ...
# Subtest: 異常報表會由現有 audit 列出付款更改、部分取消、重印及付款問題
ok 87 - 異常報表會由現有 audit 列出付款更改、部分取消、重印及付款問題
  ---
  duration_ms: 0.549744
  type: 'test'
  ...
# Subtest: 異常操作按 audit 發生時間入報表並保留跨日原訂單下鑽
ok 88 - 異常操作按 audit 發生時間入報表並保留跨日原訂單下鑽
  ---
  duration_ms: 0.30085
  type: 'test'
  ...
# Subtest: 港幣盤點只提供店舖實際接收的五款紙幣及三款硬幣
ok 89 - 港幣盤點只提供店舖實際接收的五款紙幣及三款硬幣
  ---
  duration_ms: 0.462064
  type: 'test'
  ...
# Subtest: 新營業日沿用上次留底並容許開機時加減調整
ok 90 - 新營業日沿用上次留底並容許開機時加減調整
  ---
  duration_ms: 1.535469
  type: 'test'
  ...
# Subtest: 未手動調整前按開工底金建議提取及留底，且不會留多過實點現金
ok 91 - 未手動調整前按開工底金建議提取及留底，且不會留多過實點現金
  ---
  duration_ms: 0.365367
  type: 'test'
  ...
# Subtest: 日結按實點現金反推待核實訂單的現金及非現金部分
ok 92 - 日結按實點現金反推待核實訂單的現金及非現金部分
  ---
  duration_ms: 0.516289
  type: 'test'
  ...
# Subtest: 日結保存現金、支出、差異、版本及稽核而不改寫訂單
ok 93 - 日結保存現金、支出、差異、版本及稽核而不改寫訂單
  ---
  duration_ms: 3.100066
  type: 'test'
  ...
# Subtest: 超出百分之三差異而沒有原因不可正式日結
ok 94 - 超出百分之三差異而沒有原因不可正式日結
  ---
  duration_ms: 0.444826
  type: 'test'
  ...
# Subtest: 超出百分之三差異必須明確授權，並保存提取及留底現金
ok 95 - 超出百分之三差異必須明確授權，並保存提取及留底現金
  ---
  duration_ms: 0.758712
  type: 'test'
  ...
# Subtest: 提取及留底現金必須完整分配實點現金
ok 96 - 提取及留底現金必須完整分配實點現金
  ---
  duration_ms: 0.744403
  type: 'test'
  ...
# Subtest: CSV 匯出包含摘要、訂單及商品明細並正確處理逗號
ok 97 - CSV 匯出包含摘要、訂單及商品明細並正確處理逗號
  ---
  duration_ms: 1.037053
  type: 'test'
  ...
# Subtest: 備份有可重算校驗值，任何內容被改動都會驗證失敗
ok 98 - 備份有可重算校驗值，任何內容被改動都會驗證失敗
  ---
  duration_ms: 0.844604
  type: 'test'
  ...
# Subtest: 恢復可以只套用設定或完整資料，並拒絕無效備份
ok 99 - 恢復可以只套用設定或完整資料，並拒絕無效備份
  ---
  duration_ms: 0.696233
  type: 'test'
  ...
# Subtest: 系統診斷清楚分開本機能力、同步積壓及未設定更新來源
ok 100 - 系統診斷清楚分開本機能力、同步積壓及未設定更新來源
  ---
  duration_ms: 0.355508
  type: 'test'
  ...
# Subtest: 更多頁已接入正式路由及五項底部導航
ok 101 - 更多頁已接入正式路由及五項底部導航
  ---
  duration_ms: 4.261841
  type: 'test'
  ...
# Subtest: 更多主畫面有營業日及六個帶營運狀態的入口
ok 102 - 更多主畫面有營業日及六個帶營運狀態的入口
  ---
  duration_ms: 0.44156
  type: 'test'
  ...
# Subtest: 更多首頁直接顯示今日營業、渠道及付款分析而毋須進入第二層
ok 103 - 更多首頁直接顯示今日營業、渠道及付款分析而毋須進入第二層
  ---
  duration_ms: 0.22769
  type: 'test'
  ...
# Subtest: 六個入口均有可讀細節面板而非只顯示簡單訊息
ok 104 - 六個入口均有可讀細節面板而非只顯示簡單訊息
  ---
  duration_ms: 0.344911
  type: 'test'
  ...
# Subtest: 日結、恢復、更新及退出全螢幕均先開二次確認
ok 105 - 日結、恢復、更新及退出全螢幕均先開二次確認
  ---
  duration_ms: 0.768996
  type: 'test'
  ...
# Subtest: 六個入口已由死按鈕改成真實本機操作
ok 106 - 六個入口已由死按鈕改成真實本機操作
  ---
  duration_ms: 0.451654
  type: 'test'
  ...
# Subtest: 顯示設定可本機保存，彈窗遮罩不可點空白關閉
ok 107 - 顯示設定可本機保存，彈窗遮罩不可點空白關閉
  ---
  duration_ms: 0.318705
  type: 'test'
  ...
# Subtest: 顯示與操作可設定分類每行格數、行數及最後一格搜尋
ok 108 - 顯示與操作可設定分類每行格數、行數及最後一格搜尋
  ---
  duration_ms: 0.322518
  type: 'test'
  ...
# Subtest: 更多頁沿用共用基礎樣式並固定頂底欄
ok 109 - 更多頁沿用共用基礎樣式並固定頂底欄
  ---
  duration_ms: 0.620216
  type: 'test'
  ...
# Subtest: 收銀日結提供點算、支出、差異原因、版本及正式保存
ok 110 - 收銀日結提供點算、支出、差異原因、版本及正式保存
  ---
  duration_ms: 0.604906
  type: 'test'
  ...
# Subtest: 日結提供面額互推、開工底金、提取留底、待核實反推及超額授權
ok 111 - 日結提供面額互推、開工底金、提取留底、待核實反推及超額授權
  ---
  duration_ms: 0.387102
  type: 'test'
  ...
# Subtest: 開機底金顯示上次留底、調整額及確認後開工現金
ok 112 - 開機底金顯示上次留底、調整額及確認後開工現金
  ---
  duration_ms: 0.219546
  type: 'test'
  ...
# Subtest: 營業分析同時展示每個渠道及每種付款方式的單數和金額
ok 113 - 營業分析同時展示每個渠道及每種付款方式的單數和金額
  ---
  duration_ms: 0.169831
  type: 'test'
  ...
# Subtest: 全局共用樣式提供觸控回饋、彈窗動效及減少動效模式
ok 114 - 全局共用樣式提供觸控回饋、彈窗動效及減少動效模式
  ---
  duration_ms: 0.307427
  type: 'test'
  ...
# Subtest: 報表五個分頁讀取同一選定日期報表並可下載 CSV
ok 115 - 報表五個分頁讀取同一選定日期報表並可下載 CSV
  ---
  duration_ms: 0.199571
  type: 'test'
  ...
# Subtest: 歷史報表提供七種日期入口及自訂開始結束日期
ok 116 - 歷史報表提供七種日期入口及自訂開始結束日期
  ---
  duration_ms: 0.308723
  type: 'test'
  ...
# Subtest: 付款對數逐項顯示單數應收實收退款差額狀態並可下鑽
ok 117 - 付款對數逐項顯示單數應收實收退款差額狀態並可下鑽
  ---
  duration_ms: 0.167274
  type: 'test'
  ...
# Subtest: 商品報表可切換產品及分類並保留時段與日結紀錄
ok 118 - 商品報表可切換產品及分類並保留時段與日結紀錄
  ---
  duration_ms: 0.170523
  type: 'test'
  ...
# Subtest: 打印中心可設定網絡設備、選格式、診斷、預覽、重試及改送
ok 119 - 打印中心可設定網絡設備、選格式、診斷、預覽、重試及改送
  ---
  duration_ms: 0.368503
  type: 'test'
  ...
# Subtest: 備份中心可以建立、下載、匯入、驗證及分範圍恢復
ok 120 - 備份中心可以建立、下載、匯入、驗證及分範圍恢復
  ---
  duration_ms: 0.244245
  type: 'test'
  ...
# Subtest: 系統中心提供真實診斷、操作紀錄、同步重試及更新檢查結果
ok 121 - 系統中心提供真實診斷、操作紀錄、同步重試及更新檢查結果
  ---
  duration_ms: 0.289774
  type: 'test'
  ...
# MORE_RESPONSIVE_PAGE_AUTHORITY_CONTRACT_OK
# Subtest: tests/more-responsive-contract.test.mjs
ok 15 - tests/more-responsive-contract.test.mjs
  ---
  duration_ms: 41.634027
  type: 'test'
  ...
# Subtest: standalone riceball is packaging-fee exempt even when display category is popularity
ok 123 - standalone riceball is packaging-fee exempt even when display category is popularity
  ---
  duration_ms: 0.748205
  type: 'test'
  ...
# Subtest: standalone drink is packaging-fee exempt
ok 124 - standalone drink is packaging-fee exempt
  ---
  duration_ms: 0.184879
  type: 'test'
  ...
# Subtest: standalone riceball plus discounted drink remains packaging-fee exempt
ok 125 - standalone riceball plus discounted drink remains packaging-fee exempt
  ---
  duration_ms: 1.033391
  type: 'test'
  ...
# Subtest: riceball combo and other takeaway boxed meals still charge packaging
ok 126 - riceball combo and other takeaway boxed meals still charge packaging
  ---
  duration_ms: 0.205128
  type: 'test'
  ...
# SMT_ORDER_CART_DOMAIN_OK
# Subtest: tests/order-cart-domain.test.mjs
ok 17 - tests/order-cart-domain.test.mjs
  ---
  duration_ms: 46.147534
  type: 'test'
  ...
# Subtest: quick mode uses a direct-add product action
ok 128 - quick mode uses a direct-add product action
  ---
  duration_ms: 3.008907
  type: 'test'
  ...
# Subtest: cart rows expose separate quantity and edit controls
ok 129 - cart rows expose separate quantity and edit controls
  ---
  duration_ms: 0.323548
  type: 'test'
  ...
# Subtest: product editor is a compact anchored card with explicit confirmation
ok 130 - product editor is a compact anchored card with explicit confirmation
  ---
  duration_ms: 0.287392
  type: 'test'
  ...
# Subtest: modal backdrop is inert and cannot dismiss changes
ok 131 - modal backdrop is inert and cannot dismiss changes
  ---
  duration_ms: 0.17829
  type: 'test'
  ...
# Subtest: cart quantity updates totals, trims drink assignments, and removes zero rows
ok 132 - cart quantity updates totals, trims drink assignments, and removes zero rows
  ---
  duration_ms: 0.643139
  type: 'test'
  ...
# Subtest: order shell keeps the bottom navigation inside the fixed canvas
ok 133 - order shell keeps the bottom navigation inside the fixed canvas
  ---
  duration_ms: 0.225478
  type: 'test'
  ...
# Subtest: checkout call to action shows the payable total
ok 134 - checkout call to action shows the payable total
  ---
  duration_ms: 0.238659
  type: 'test'
  ...
# Subtest: quick order mode, drink strip, and quick assist are independent settings
ok 135 - quick order mode, drink strip, and quick assist are independent settings
  ---
  duration_ms: 0.160172
  type: 'test'
  ...
# Subtest: display settings include the three cart ratios
ok 136 - display settings include the three cart ratios
  ---
  duration_ms: 0.354365
  type: 'test'
  ...
# Subtest: cards are positioned from the pressed control and expose a pointer side
ok 137 - cards are positioned from the pressed control and expose a pointer side
  ---
  duration_ms: 0.384757
  type: 'test'
  ...
# Subtest: pending orders use a vertical split
ok 138 - pending orders use a vertical split
  ---
  duration_ms: 0.18753
  type: 'test'
  ...
# Subtest: every expanded card is owned by the single modal controller
ok 139 - every expanded card is owned by the single modal controller
  ---
  duration_ms: 0.222521
  type: 'test'
  ...
# Subtest: pending order card is actionable and grouped by channel
ok 140 - pending order card is actionable and grouped by channel
  ---
  duration_ms: 0.117449
  type: 'test'
  ...
# Subtest: anchored cards support all four pointer directions and stay between fixed bars
ok 141 - anchored cards support all four pointer directions and stay between fixed bars
  ---
  duration_ms: 0.23349
  type: 'test'
  ...
# Subtest: cart image visibility is configurable
ok 142 - cart image visibility is configurable
  ---
  duration_ms: 0.098697
  type: 'test'
  ...
# Subtest: quick drink adjustment stays compact without repeating its image
ok 143 - quick drink adjustment stays compact without repeating its image
  ---
  duration_ms: 0.170849
  type: 'test'
  ...
# Subtest: shell uses a fixed T2S canvas fitted inside both viewport dimensions
ok 144 - shell uses a fixed T2S canvas fitted inside both viewport dimensions
  ---
  duration_ms: 14.994668
  type: 'test'
  ...
# Subtest: root height chain and scroll regions keep both bars fixed
ok 145 - root height chain and scroll regions keep both bars fixed
  ---
  duration_ms: 1.072895
  type: 'test'
  ...
# Subtest: quick drinks are a collapsed upward drawer with reorder controls
ok 146 - quick drinks are a collapsed upward drawer with reorder controls
  ---
  duration_ms: 0.194064
  type: 'test'
  ...
# Subtest: drink editor supports multiple configuration groups without forced images
ok 147 - drink editor supports multiple configuration groups without forced images
  ---
  duration_ms: 0.130395
  type: 'test'
  ...
# Subtest: completion exposes automatic, specified, and demo link-up flows
ok 148 - completion exposes automatic, specified, and demo link-up flows
  ---
  duration_ms: 0.092731
  type: 'test'
  ...
# Subtest: large product grid reserves complete rows and never overlaps cards
ok 149 - large product grid reserves complete rows and never overlaps cards
  ---
  duration_ms: 0.16992
  type: 'test'
  ...
# Subtest: collapsed quick drinks use the approved centred pill above navigation
ok 150 - collapsed quick drinks use the approved centred pill above navigation
  ---
  duration_ms: 0.164739
  type: 'test'
  ...
# Subtest: operational surfaces include sold-out preview and new-order toast
ok 151 - operational surfaces include sold-out preview and new-order toast
  ---
  duration_ms: 0.127259
  type: 'test'
  ...
# Subtest: 分類列最右固定搜尋入口並可按名稱或編號篩選產品
ok 152 - 分類列最右固定搜尋入口並可按名稱或編號篩選產品
  ---
  duration_ms: 0.339367
  type: 'test'
  ...
# Subtest: 分類列讀取後台全局設定並按五六七格及一兩行輸出版面
ok 153 - 分類列讀取後台全局設定並按五六七格及一兩行輸出版面
  ---
  duration_ms: 0.150208
  type: 'test'
  ...
# Subtest: 新單提示最少一張產品卡闊及兩張產品卡高
ok 154 - 新單提示最少一張產品卡闊及兩張產品卡高
  ---
  duration_ms: 0.181679
  type: 'test'
  ...
# Subtest: 快捷飲品展開後八秒無操作自動收起並於操作時重時計時
ok 155 - 快捷飲品展開後八秒無操作自動收起並於操作時重時計時
  ---
  duration_ms: 0.105812
  type: 'test'
  ...
# Subtest: sold-out preview reads the same local supply status as the badge
ok 156 - sold-out preview reads the same local supply status as the badge
  ---
  duration_ms: 0.087411
  type: 'test'
  ...
# Subtest: order cards distinguish sold-out orange from paused red without greying
ok 157 - order cards distinguish sold-out orange from paused red without greying
  ---
  duration_ms: 0.224741
  type: 'test'
  ...
# Subtest: paused products sort to the end of their current order category
ok 158 - paused products sort to the end of their current order category
  ---
  duration_ms: 0.1709
  type: 'test'
  ...
# Subtest: accepting a verified pending order creates a running order with a 30 minute deadline
ok 159 - accepting a verified pending order creates a running order with a 30 minute deadline
  ---
  duration_ms: 0.202066
  type: 'test'
  ...
# Subtest: running orders auto-complete after 30 minutes without intermediate states
ok 160 - running orders auto-complete after 30 minutes without intermediate states
  ---
  duration_ms: 0.220199
  type: 'test'
  ...
# Subtest: WhatsApp QR target opens the customer chat with the preset message
ok 161 - WhatsApp QR target opens the customer chat with the preset message
  ---
  duration_ms: 0.227165
  type: 'test'
  ...
# Subtest: pending verification uses start review then confirm order wording
ok 162 - pending verification uses start review then confirm order wording
  ---
  duration_ms: 0.218331
  type: 'test'
  ...
# Subtest: cart locks price and quantity-edit controls into dedicated regions
ok 163 - cart locks price and quantity-edit controls into dedicated regions
  ---
  duration_ms: 0.240232
  type: 'test'
  ...
# Subtest: drink adjustment starts compact and expands only after add adjustment
ok 164 - drink adjustment starts compact and expands only after add adjustment
  ---
  duration_ms: 0.212883
  type: 'test'
  ...
# Subtest: specified pairing candidates use a three-column text-card grid
ok 165 - specified pairing candidates use a three-column text-card grid
  ---
  duration_ms: 2.319136
  type: 'test'
  ...
# Subtest: cart keeps price flush right and actions aligned with the image
ok 166 - cart keeps price flush right and actions aligned with the image
  ---
  duration_ms: 0.368109
  type: 'test'
  ...
# Subtest: 首次渲染由共用函數提供待處理數量給頂欄及導航
ok 167 - 首次渲染由共用函數提供待處理數量給頂欄及導航
  ---
  duration_ms: 0.493826
  type: 'test'
  ...
# Subtest: 點單頁最近訂單讀取共用歷史而不再寫死舊單號
ok 168 - 點單頁最近訂單讀取共用歷史而不再寫死舊單號
  ---
  duration_ms: 0.161866
  type: 'test'
  ...
# Subtest: 子頁啟動錯誤會顯示可見後備畫面而不是白屏
ok 169 - 子頁啟動錯誤會顯示可見後備畫面而不是白屏
  ---
  duration_ms: 21.098691
  type: 'test'
  ...
# Subtest: specified pairing creates dynamic labelled groups
ok 170 - specified pairing creates dynamic labelled groups
  ---
  duration_ms: 0.303657
  type: 'test'
  ...
# Subtest: all drink selection surfaces share one image-first Drink Choice Card
ok 171 - all drink selection surfaces share one image-first Drink Choice Card
  ---
  duration_ms: 0.490532
  type: 'test'
  ...
# Subtest: riceball and snack can become one pending-drink combo without a cart drink
ok 172 - riceball and snack can become one pending-drink combo without a cart drink
  ---
  duration_ms: 0.751791
  type: 'test'
  ...
# Subtest: quick drink embeds inside combo without first becoming a cart line
ok 173 - quick drink embeds inside combo without first becoming a cart line
  ---
  duration_ms: 0.313432
  type: 'test'
  ...
# Subtest: cart drink can be consumed into a combo and remaining quantity stays standalone
ok 174 - cart drink can be consumed into a combo and remaining quantity stays standalone
  ---
  duration_ms: 0.258069
  type: 'test'
  ...
# Subtest: dissolving a combo restores standalone components at single prices
ok 175 - dissolving a combo restores standalone components at single prices
  ---
  duration_ms: 0.5753
  type: 'test'
  ...
# Subtest: specified pairing offers quick drinks and accepts main plus snack before drink
ok 176 - specified pairing offers quick drinks and accepts main plus snack before drink
  ---
  duration_ms: 0.161188
  type: 'test'
  ...
# Subtest: order page loads the shared live menu contract with offline fallback
ok 177 - order page loads the shared live menu contract with offline fallback
  ---
  duration_ms: 0.166859
  type: 'test'
  ...
# Subtest: 每日流水以早上五時為分界並固定三位數
ok 178 - 每日流水以早上五時為分界並固定三位數
  ---
  duration_ms: 1.795477
  type: 'test'
  ...
# Subtest: 所有渠道共用同一每日流水並兼容舊 P 編號
ok 179 - 所有渠道共用同一每日流水並兼容舊 P 編號
  ---
  duration_ms: 0.652261
  type: 'test'
  ...
# Subtest: 每日流水到 P999 後拒絕循環覆蓋
ok 180 - 每日流水到 P999 後拒絕循環覆蓋
  ---
  duration_ms: 0.526109
  type: 'test'
  ...
# Subtest: 顯示號碼支援新舊訂單並按真實時間找最新一張
ok 181 - 顯示號碼支援新舊訂單並按真實時間找最新一張
  ---
  duration_ms: 0.437733
  type: 'test'
  ...
# Subtest: 流水營業日及最近訂單以開單時間為準而不受完成時間延遲影響
ok 182 - 流水營業日及最近訂單以開單時間為準而不受完成時間延遲影響
  ---
  duration_ms: 0.459381
  type: 'test'
  ...
# Subtest: 永久編號使用實際日期並在堂食單包含枱號
ok 183 - 永久編號使用實際日期並在堂食單包含枱號
  ---
  duration_ms: 0.267777
  type: 'test'
  ...
# Subtest: takeaway packaging fee exempts standalone riceballs and drinks
ok 184 - takeaway packaging fee exempts standalone riceballs and drinks
  ---
  duration_ms: 2.215092
  type: 'test'
  ...
# Subtest: checkout discount does not discount packaging fee
ok 185 - checkout discount does not discount packaging fee
  ---
  duration_ms: 0.509759
  type: 'test'
  ...
# Subtest: mixed service order splits production and packing jobs
ok 186 - mixed service order splits production and packing jobs
  ---
  duration_ms: 291.503734
  type: 'test'
  ...
# SMT_ORDER_REQUIRED_COMPLETION_TOKEN_CORE_OK
# Subtest: tests/order-required-completion-core.test.mjs
ok 21 - tests/order-required-completion-core.test.mjs
  ---
  duration_ms: 50.885261
  type: 'test'
  ...
# Subtest: order runtime does not load post-render drink enhancer
ok 188 - order runtime does not load post-render drink enhancer
  ---
  duration_ms: 0.740529
  type: 'test'
  ...
# Subtest: drink assignment badges render from assignment state
ok 189 - drink assignment badges render from assignment state
  ---
  duration_ms: 0.313903
  type: 'test'
  ...
# Subtest: modal policy is owned by order core, not an external runtime layer
ok 190 - modal policy is owned by order core, not an external runtime layer
  ---
  duration_ms: 0.247767
  type: 'test'
  ...
# Subtest: order runtime keeps required completion in page state
ok 191 - order runtime keeps required completion in page state
  ---
  duration_ms: 0.289783
  type: 'test'
  ...
# Subtest: transient UI state bypasses transaction persistence and full normalization
ok 192 - transient UI state bypasses transaction persistence and full normalization
  ---
  duration_ms: 0.35539
  type: 'test'
  ...
# Subtest: order page uses lazy surface rendering
ok 193 - order page uses lazy surface rendering
  ---
  duration_ms: 0.287121
  type: 'test'
  ...
# Subtest: 運行訂單滿三十分鐘會持久轉入歷史而唔係只改畫面
ok 194 - 運行訂單滿三十分鐘會持久轉入歷史而唔係只改畫面
  ---
  duration_ms: 1.591943
  type: 'test'
  ...
# Subtest: filters can switch between source, payment exception, print exception and history
ok 195 - filters can switch between source, payment exception, print exception and history
  ---
  duration_ms: 0.273202
  type: 'test'
  ...
# Subtest: changing channel and payment persists values and audit instead of only showing a toast
ok 196 - changing channel and payment persists values and audit instead of only showing a toast
  ---
  duration_ms: 0.230459
  type: 'test'
  ...
# Subtest: 更改渠道會套用正式付款狀態，非現場渠道不可保留舊付款方式
ok 197 - 更改渠道會套用正式付款狀態，非現場渠道不可保留舊付款方式
  ---
  duration_ms: 0.168049
  type: 'test'
  ...
# Subtest: 待核實訂單可核實付款或標記問題及通知客戶
ok 198 - 待核實訂單可核實付款或標記問題及通知客戶
  ---
  duration_ms: 0.332316
  type: 'test'
  ...
# Subtest: 訂單頁待核實入口共用完整核數及通知客戶操作
ok 199 - 訂單頁待核實入口共用完整核數及通知客戶操作
  ---
  duration_ms: 0.161406
  type: 'test'
  ...
# Subtest: 問題原因提供快選亦容許留空，唔會卡住待處理流程
ok 200 - 問題原因提供快選亦容許留空，唔會卡住待處理流程
  ---
  duration_ms: 0.234127
  type: 'test'
  ...
# Subtest: 打印異常訂單由職員打開後勾選需要重印的文件
ok 201 - 打印異常訂單由職員打開後勾選需要重印的文件
  ---
  duration_ms: 0.151666
  type: 'test'
  ...
# Subtest: 部分取消使用商品行內加減及一次確認，不再逐項使用下拉選單
ok 202 - 部分取消使用商品行內加減及一次確認，不再逐項使用下拉選單
  ---
  duration_ms: 0.357609
  type: 'test'
  ...
# Subtest: partial cancellation keeps cancelled quantity visible and recalculates total
ok 203 - partial cancellation keeps cancelled quantity visible and recalculates total
  ---
  duration_ms: 0.705402
  type: 'test'
  ...
# Subtest: whole-order cancellation remains in history instead of disappearing
ok 204 - whole-order cancellation remains in history instead of disappearing
  ---
  duration_ms: 0.321965
  type: 'test'
  ...
# Subtest: reprint creates a visible print job and clears the exception after retry
ok 205 - reprint creates a visible print job and clears the exception after retry
  ---
  duration_ms: 0.212517
  type: 'test'
  ...
# Subtest: 掛單只開左右面板，再由一般掛單或堂食枱號完成操作
ok 206 - 掛單只開左右面板，再由一般掛單或堂食枱號完成操作
  ---
  duration_ms: 1.104749
  type: 'test'
  ...
# Subtest: 取單使用左列表右內容，並固定返回、作廢及取單操作
ok 207 - 取單使用左列表右內容，並固定返回、作廢及取單操作
  ---
  duration_ms: 0.269418
  type: 'test'
  ...
# Subtest: checkout persists the completing terminal and order audit
ok 208 - checkout persists the completing terminal and order audit
  ---
  duration_ms: 0.122332
  type: 'test'
  ...
# Subtest: bottom navigation opens the independent orders page
ok 209 - bottom navigation opens the independent orders page
  ---
  duration_ms: 0.198874
  type: 'test'
  ...
# Subtest: orders page uses the three approved channel columns and payment methods
ok 210 - orders page uses the three approved channel columns and payment methods
  ---
  duration_ms: 0.158811
  type: 'test'
  ...
# Subtest: 每件產品保存獨立堂食或外賣選擇
ok 211 - 每件產品保存獨立堂食或外賣選擇
  ---
  duration_ms: 0.166883
  type: 'test'
  ...
# Subtest: reverse checkout reuse loads the original cart then navigates to the locked ordering page
ok 212 - reverse checkout reuse loads the original cart then navigates to the locked ordering page
  ---
  duration_ms: 0.248797
  type: 'test'
  ...
# Subtest: 預設建立五部設備及四款由管理端發佈的示範格式
ok 213 - 預設建立五部設備及四款由管理端發佈的示範格式
  ---
  duration_ms: 1.639473
  type: 'test'
  ...
# Subtest: 網絡打印機必須有有效網絡地址、連接埠、紙寬、用途及格式
ok 214 - 網絡打印機必須有有效網絡地址、連接埠、紙寬、用途及格式
  ---
  duration_ms: 0.547068
  type: 'test'
  ...
# Subtest: 製作及打包統計同時提供每款產品與飲品、飯餐、飯團總數
ok 215 - 製作及打包統計同時提供每款產品與飲品、飯餐、飯團總數
  ---
  duration_ms: 8.513104
  type: 'test'
  ...
# Subtest: 四款格式生成可讀預覽，製作單及打包單頂部先顯示合併統計
ok 216 - 四款格式生成可讀預覽，製作單及打包單頂部先顯示合併統計
  ---
  duration_ms: 157.239304
  type: 'test'
  ...
# Subtest: 舊非 P 渠道訂單重印保留原識別而不會顯示測試工作
ok 217 - 舊非 P 渠道訂單重印保留原識別而不會顯示測試工作
  ---
  duration_ms: 0.52364
  type: 'test'
  ...
# Subtest: 打印工作按用途及格式路由，未設定設備會停在 blocked 而非假成功
ok 218 - 打印工作按用途及格式路由，未設定設備會停在 blocked 而非假成功
  ---
  duration_ms: 3.380204
  type: 'test'
  ...
# Subtest: 重試沿用同一工作並增加嘗試；改送會保存原目的地
ok 219 - 重試沿用同一工作並增加嘗試；改送會保存原目的地
  ---
  duration_ms: 0.478937
  type: 'test'
  ...
# Subtest: 安卓橋接封包包含傳輸資料、格式內容及冪等工作編號
ok 220 - 安卓橋接封包包含傳輸資料、格式內容及冪等工作編號
  ---
  duration_ms: 0.498507
  type: 'test'
  ...
# Subtest: 設備診斷會分開設定驗證、瀏覽器限制及安卓橋接狀態
ok 221 - 設備診斷會分開設定驗證、瀏覽器限制及安卓橋接狀態
  ---
  duration_ms: 0.605469
  type: 'test'
  ...
# Subtest: 現有訂單與堂食打印工作可去重匯入中央工作佇列
ok 222 - 現有訂單與堂食打印工作可去重匯入中央工作佇列
  ---
  duration_ms: 1.260418
  type: 'test'
  ...
# PRODUCT_CARD_AUTHORITY_CONTRACT_OK
# Subtest: tests/product-card-authority-contract.test.mjs
ok 26 - tests/product-card-authority-contract.test.mjs
  ---
  duration_ms: 29.591215
  type: 'test'
  ...
# Subtest: seed frame stays hidden until child ready
ok 224 - seed frame stays hidden until child ready
  ---
  duration_ms: 0.73517
  type: 'test'
  ...
# Subtest: unlock does not force reload the active order page
ok 225 - unlock does not force reload the active order page
  ---
  duration_ms: 0.225619
  type: 'test'
  ...
# Subtest: page ready waits for stable frames and republishes explicit actions
ok 226 - page ready waits for stable frames and republishes explicit actions
  ---
  duration_ms: 0.947621
  type: 'test'
  ...
# Subtest: overlay state stays explicit and event driven
ok 227 - overlay state stays explicit and event driven
  ---
  duration_ms: 0.213012
  type: 'test'
  ...
# Subtest: responsive profile writes are deduplicated per frame
ok 228 - responsive profile writes are deduplicated per frame
  ---
  duration_ms: 0.120801
  type: 'test'
  ...
# Subtest: inactive pages cannot keep a second overlay truth source
ok 229 - inactive pages cannot keep a second overlay truth source
  ---
  duration_ms: 0.109718
  type: 'test'
  ...
# Subtest: 共用狀態欄永久包含品牌、終端、接單狀態及最近訂單
ok 230 - 共用狀態欄永久包含品牌、終端、接單狀態及最近訂單
  ---
  duration_ms: 1.476972
  type: 'test'
  ...
# Subtest: 共用底欄固定五項、同一套線性圖標及唯一選中項
ok 231 - 共用底欄固定五項、同一套線性圖標及唯一選中項
  ---
  duration_ms: 0.486477
  type: 'test'
  ...
# Subtest: 五個主要頁面全部使用共用狀態欄及底部導航
ok 232 - 五個主要頁面全部使用共用狀態欄及底部導航
  ---
  duration_ms: 0.236701
  type: 'test'
  ...
# Subtest: 五個主要頁面共用同一最近訂單顯示規則
ok 233 - 五個主要頁面共用同一最近訂單顯示規則
  ---
  duration_ms: 0.262971
  type: 'test'
  ...
# Subtest: 底欄高度、選中膠囊、字體及圖標只由全局 Shell 樣式控制
ok 234 - 底欄高度、選中膠囊、字體及圖標只由全局 Shell 樣式控制
  ---
  duration_ms: 0.357078
  type: 'test'
  ...
# Subtest: 分類、頁籤、分段、付款、來源及模式選擇共用膠囊規則
ok 235 - 分類、頁籤、分段、付款、來源及模式選擇共用膠囊規則
  ---
  duration_ms: 0.348565
  type: 'test'
  ...
# Subtest: 來源彈窗支援四方向箭嘴並由定位器標記實際方向
ok 236 - 來源彈窗支援四方向箭嘴並由定位器標記實際方向
  ---
  duration_ms: 0.309975
  type: 'test'
  ...
# Subtest: 售罄頁沿用產品分類與三種點單卡模板
ok 237 - 售罄頁沿用產品分類與三種點單卡模板
  ---
  duration_ms: 1.026604
  type: 'test'
  ...
# Subtest: 右欄提供分類售罄列表、收起與圖片顯示切換
ok 238 - 右欄提供分類售罄列表、收起與圖片顯示切換
  ---
  duration_ms: 0.209467
  type: 'test'
  ...
# Subtest: 批量模式使用待確認欄及四個固定操作
ok 239 - 批量模式使用待確認欄及四個固定操作
  ---
  duration_ms: 0.140849
  type: 'test'
  ...
# Subtest: 正常模式產品詳情提供四個供應狀態操作
ok 240 - 正常模式產品詳情提供四個供應狀態操作
  ---
  duration_ms: 0.196314
  type: 'test'
  ...
# Subtest: 批量模式點擊整張產品卡即可加入或取消
ok 241 - 批量模式點擊整張產品卡即可加入或取消
  ---
  duration_ms: 0.177758
  type: 'test'
  ...
# Subtest: 目前分類支援一次性多選、全選及全不選並保留跨分類選取
ok 242 - 目前分類支援一次性多選、全選及全不選並保留跨分類選取
  ---
  duration_ms: 0.133004
  type: 'test'
  ...
# Subtest: 提供紫米快捷操作、售罄獨立分類及清晰狀態卡
ok 243 - 提供紫米快捷操作、售罄獨立分類及清晰狀態卡
  ---
  duration_ms: 0.191906
  type: 'test'
  ...
# Subtest: 售罄頁可獨立切換大圖小圖及純文字卡
ok 244 - 售罄頁可獨立切換大圖小圖及純文字卡
  ---
  duration_ms: 0.133682
  type: 'test'
  ...
# Subtest: 應用程式路由已接入售罄頁
ok 245 - 應用程式路由已接入售罄頁
  ---
  duration_ms: 0.347068
  type: 'test'
  ...
# Subtest: 售罄頁使用正確餐牌後備參數，網絡失敗亦保留可操作頁面
ok 246 - 售罄頁使用正確餐牌後備參數，網絡失敗亦保留可操作頁面
  ---
  duration_ms: 0.354284
  type: 'test'
  ...
# Subtest: 售罄產品移出原分類並集中到售罄分類，停售仍留原分類
ok 247 - 售罄產品移出原分類並集中到售罄分類，停售仍留原分類
  ---
  duration_ms: 0.157432
  type: 'test'
  ...
# Subtest: 小圖與純文字卡由售罄頁自己消費自適應 Token
ok 248 - 小圖與純文字卡由售罄頁自己消費自適應 Token
  ---
  duration_ms: 0.145526
  type: 'test'
  ...
1..248
# tests 248
# suites 0
# pass 248
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 890.806654
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
TEST_STATUS=0
SYNTAX_STATUS=0
RESULT=PASS
