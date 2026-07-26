# SMT Runtime Phase 3 QA

Commit: 0087cf486263d973781674a19350b3a3b9f52e20

## node --test tests/*.test.mjs
```text
TAP version 13
# Subtest: Work and Chat entries point to current baseline
not ok 1 - Work and Chat entries point to current baseline
  ---
  duration_ms: 11.318475
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/ai-context.test.mjs:8:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /order-v1-31/. Input:
    
    '# 磨飯 SMT｜AI Start Here\n' +
      '\n' +
      '> **第一步：完整閱讀 SMT Development Standard 三份 PRIMARY STANDARD。任何 AI／Codex／Work／工程代理未完成閱讀前，禁止分析後直接改碼。**\n' +
      '\n' +
      '更新：2026-07-26｜目前功能完整性分支：`smt-functional-completeness-v1`\n' +
      '\n' +
      '## 三份同級最高標準\n' +
      '\n' +
      '1. `docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`\n' +
      '2. `docs/MFKG_STANDARD_V1.0.md`\n' +
      '3. `docs/SMT_ADAPTIVE_APPLICATION_STANDARD_V1.0.md`\n' +
      '\n' +
      '三者共同構成 **SMT Development Standard**。\n' +
      '\n' +
      '- Development Charter：規定點樣開發。\n' +
      '- MFKG：規定系統真相、決策、依賴及跨端關係點樣被理解與追蹤。\n' +
      '- Adaptive Application：規定同一套 App 點樣適應不同正式裝置／尺寸。\n' +
      '\n' +
      '任何新需求必須先對照三份標準：\n' +
      '\n' +
      '1. 屬於邊個 Domain？\n' +
      '2. 真正根因係乜？\n' +
      '3. 涉及邊個 MFKG Node／Edge？\n' +
      '4. 會修改邊個正式責任來源？\n' +
      '5. 有冇新增第二套邏輯、Observer、Override、Compatibility Layer 或 Patch？\n' +
      '6. 有冇將 Adaptive 錯寫成整頁 Scale／第二套 UI？\n' +
      '7. 會唔會影響 Checkout／Responsive／資料／打印／其他端？\n' +
      '8. 點測試、點回滾？\n' +
      '\n' +
      '如果需求與三份標準衝突，必須 STOP；只有產品負責人明確要求「修改／更新標準」先可以改變最高標準。\n' +
      '\n' +
      '## 目標\n' +
      '\n' +
      '建立真正可長期運作、可高峰使用、可持續維護嘅 SMT。現行產品標準在 `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md`；不得回退到早期效果圖或舊 Master 介面。\n' +
      '\n' +
      '## 絕對不可違反\n' +
      '\n' +
      '- 點單頁基礎狀態欄為永久全域狀態欄，所有主要頁不可刪除；頁面專用狀態只可附加。底部五項導航共用同一元件及完整選中膠囊；內容區內滾動。\n' +
      '- 同時只開一張主卡；非阻塞操作應靠近觸發來源；阻礙 Checkout 的必選／交易任務使用中央工作台。\n' +
      '- 購物車金額完全靠右；右側上方價格、下方 `－ 數量 ＋ 修改`。\n' +
      '- 快捷飲品、產品修改套餐飲品、必選整理飲品必須共用同一 Drink Choice Card 核心；容器可不同，Card 不得另寫第二套。\n' +
      '- 指定配對按可配數量動態生成；快速處理與指定例外共用同一 Assignments 資料。\n' +
      '- 待處理核對付款後才接單；接單後為運行中，不設虛構製作中流程。\n' +
      '- 暫存按終端獨立編號；跨機接手後再次暫存改用接手機編號；結帳記錄實際結帳終端及 lineage。\n' +
      '- 只有現場外賣／堂食選付款方式；付款、訂單、打印、日結屬高風險功能。\n' +
      '- 禁止永久 Patch／Override／Hotfix 層；禁止 MutationObserver／DOM 掃描補自己已有 State；禁止所有 State Change 重畫整個 App。\n' +
      '- 第一次 Fix 失敗必須 STOP 查根因，唔可以直接疊第二層 Fix。\n' +
      '- Adaptive Core 只可控制尺寸／密度／Profile／Available Area；不得建立第二套 Component／Domain／Checkout／Pricing／Print。\n' +
      '- 重要修改完成後必須同步 MFKG／Decision／Implementation Status／Code Map（按影響範圍）。\n' +
      '\n' +
      '## 現況判斷方式\n' +
      '\n' +
      '不得將「程式存在」當成「實機已通過」。\n' +
      '\n' +
      '狀態必須分開：\n' +
      '\n' +
      '- 設計已確認；\n' +
      '- 程式已存在；\n' +
      '- 自動測試已通過；\n' +
      '- 實機已通過；\n' +
      '- 最終 Lock。\n' +
      '\n' +
      '不可宣稱完成未實測的 API、硬件、打印或裝置驗收。\n' +
      '\n' +
      '## 按任務載入\n' +
      '\n' +
      '- 三份最高標準：`docs/SMT_DEVELOPMENT_CHARTER_V1.0.md` + `docs/MFKG_STANDARD_V1.0.md` + `docs/SMT_ADAPTIVE_APPLICATION_STANDARD_V1.0.md`\n' +
      '- 機器知識圖：`docs/ai-context/SMT_KNOWLEDGE_GRAPH.json`\n' +
      '- UI：Current Lock + `docs/ai-context/SMT_CODE_MAP.md`\n' +
      '- Bug：`SMT_CHANGE_IMPACT.md` + 對應測試\n' +
      '- 現況：`docs/ai-context/SMT_IMPLEMENTATION_STATUS.md`\n' +
      '- 決策：`docs/ai-context/SMT_DECISION_LEDGER.md`\n' +
      '- Chat：`SMT_AI_CONTEXT_PACK.md`\n' +
      '\n' +
      '## 開工格式\n' +
      '\n' +
      '任何新 AI／新對話接手第一輪，先回覆：\n' +
      '\n' +
      '```text\n' +
      '【SMT Development Standard】\n' +
      'Development Charter 已閱讀：是／否\n' +
      'MFKG Standard 已閱讀：是／否\n' +
      'Adaptive Application Standard 已閱讀：是／否\n' +
      '\n' +
      '【本次 Domain】\n' +
      '\n' +
      '【MFKG】\n' +
      '涉及 Node／Edge：\n' +
      '\n' +
      '【正式責任來源】\n' +
      '\n' +
      '【禁止層檢查】\n' +
      '第二套邏輯：無／有\n' +
      'Observer：無／有\n' +
      'Override／Patch：無／有\n' +
      '整頁 Scale／第二套 Responsive UI：無／有\n' +
      '\n' +
      '【影響】\n' +
      'Checkout：\n' +
      'Adaptive／Responsive：\n' +
      '資料：\n' +
      '打印：\n' +
      '跨端：\n' +
      '\n' +
      '【測試／回滾】\n' +
      '```\n' +
      '\n' +
      '未完成以上確認，不應開始修改。\n'
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    # 磨飯 SMT｜AI Start Here
    
    > **第一步：完整閱讀 SMT Development Standard 三份 PRIMARY STANDARD。任何 AI／Codex／Work／工程代理未完成閱讀前，禁止分析後直接改碼。**
    
    更新：2026-07-26｜目前功能完整性分支：`smt-functional-completeness-v1`
    
    ## 三份同級最高標準
    
    1. `docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`
    2. `docs/MFKG_STANDARD_V1.0.md`
    3. `docs/SMT_ADAPTIVE_APPLICATION_STANDARD_V1.0.md`
    
    三者共同構成 **SMT Development Standard**。
    
    - Development Charter：規定點樣開發。
    - MFKG：規定系統真相、決策、依賴及跨端關係點樣被理解與追蹤。
    - Adaptive Application：規定同一套 App 點樣適應不同正式裝置／尺寸。
    
    任何新需求必須先對照三份標準：
    
    1. 屬於邊個 Domain？
    2. 真正根因係乜？
    3. 涉及邊個 MFKG Node／Edge？
    4. 會修改邊個正式責任來源？
    5. 有冇新增第二套邏輯、Observer、Override、Compatibility Layer 或 Patch？
    6. 有冇將 Adaptive 錯寫成整頁 Scale／第二套 UI？
    7. 會唔會影響 Checkout／Responsive／資料／打印／其他端？
    8. 點測試、點回滾？
    
    如果需求與三份標準衝突，必須 STOP；只有產品負責人明確要求「修改／更新標準」先可以改變最高標準。
    
    ## 目標
    
    建立真正可長期運作、可高峰使用、可持續維護嘅 SMT。現行產品標準在 `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md`；不得回退到早期效果圖或舊 Master 介面。
    
    ## 絕對不可違反
    
    - 點單頁基礎狀態欄為永久全域狀態欄，所有主要頁不可刪除；頁面專用狀態只可附加。底部五項導航共用同一元件及完整選中膠囊；內容區內滾動。
    - 同時只開一張主卡；非阻塞操作應靠近觸發來源；阻礙 Checkout 的必選／交易任務使用中央工作台。
    - 購物車金額完全靠右；右側上方價格、下方 `－ 數量 ＋ 修改`。
    - 快捷飲品、產品修改套餐飲品、必選整理飲品必須共用同一 Drink Choice Card 核心；容器可不同，Card 不得另寫第二套。
    - 指定配對按可配數量動態生成；快速處理與指定例外共用同一 Assignments 資料。
    - 待處理核對付款後才接單；接單後為運行中，不設虛構製作中流程。
    - 暫存按終端獨立編號；跨機接手後再次暫存改用接手機編號；結帳記錄實際結帳終端及 lineage。
    - 只有現場外賣／堂食選付款方式；付款、訂單、打印、日結屬高風險功能。
    - 禁止永久 Patch／Override／Hotfix 層；禁止 MutationObserver／DOM 掃描補自己已有 State；禁止所有 State Change 重畫整個 App。
    - 第一次 Fix 失敗必須 STOP 查根因，唔可以直接疊第二層 Fix。
    - Adaptive Core 只可控制尺寸／密度／Profile／Available Area；不得建立第二套 Component／Domain／Checkout／Pricing／Print。
    - 重要修改完成後必須同步 MFKG／Decision／Implementation Status／Code Map（按影響範圍）。
    
    ## 現況判斷方式
    
    不得將「程式存在」當成「實機已通過」。
    
    狀態必須分開：
    
    - 設計已確認；
    - 程式已存在；
    - 自動測試已通過；
    - 實機已通過；
    - 最終 Lock。
    
    不可宣稱完成未實測的 API、硬件、打印或裝置驗收。
    
    ## 按任務載入
    
    - 三份最高標準：`docs/SMT_DEVELOPMENT_CHARTER_V1.0.md` + `docs/MFKG_STANDARD_V1.0.md` + `docs/SMT_ADAPTIVE_APPLICATION_STANDARD_V1.0.md`
    - 機器知識圖：`docs/ai-context/SMT_KNOWLEDGE_GRAPH.json`
    - UI：Current Lock + `docs/ai-context/SMT_CODE_MAP.md`
    - Bug：`SMT_CHANGE_IMPACT.md` + 對應測試
    - 現況：`docs/ai-context/SMT_IMPLEMENTATION_STATUS.md`
    - 決策：`docs/ai-context/SMT_DECISION_LEDGER.md`
    - Chat：`SMT_AI_CONTEXT_PACK.md`
    
    ## 開工格式
    
    任何新 AI／新對話接手第一輪，先回覆：
    
    ```text
    【SMT Development Standard】
    Development Charter 已閱讀：是／否
    MFKG Standard 已閱讀：是／否
    Adaptive Application Standard 已閱讀：是／否
    
    【本次 Domain】
    
    【MFKG】
    涉及 Node／Edge：
    
    【正式責任來源】
    
    【禁止層檢查】
    第二套邏輯：無／有
    Observer：無／有
    Override／Patch：無／有
    整頁 Scale／第二套 Responsive UI：無／有
    
    【影響】
    Checkout：
    Adaptive／Responsive：
    資料：
    打印：
    跨端：
    
    【測試／回滾】
    ```
    
    未完成以上確認，不應開始修改。
    
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/ai-context.test.mjs:11:10)
    async Test.run (node:internal/test_runner/test:1054:7)
    async startSubtestAfterBootstrap (node:internal/test_runner/harness:296:3)
  ...
# Subtest: knowledge graph edges resolve and carry evidence
not ok 2 - knowledge graph edges resolve and carry evidence
  ---
  duration_ms: 13.6581
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/ai-context.test.mjs:17:1'
  failureType: 'testCodeFailure'
  error: |-
    The expression evaluated to a falsy value:
    
      assert.ok(['EXTRACTED', 'INFERRED'].includes(edge.evidence))
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: true
  actual: false
  operator: '=='
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/ai-context.test.mjs:26:12)
    async Test.run (node:internal/test_runner/test:1054:7)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: status separates automation from device acceptance
ok 3 - status separates automation from device acceptance
  ---
  duration_ms: 2.340958
  type: 'test'
  ...
# SMT_CART_CHECKOUT_CORE_V7_OK
# Subtest: tests/cart-checkout-regression-v2.test.mjs
ok 2 - tests/cart-checkout-regression-v2.test.mjs
  ---
  duration_ms: 40.008411
  type: 'test'
  ...
# Subtest: 分類版面設定只接受每行五至七格、一至兩行及搜尋開關
ok 5 - 分類版面設定只接受每行五至七格、一至兩行及搜尋開關
  ---
  duration_ms: 2.18723
  type: 'test'
  ...
# Subtest: 搜尋開啟時佔最後一行最後一格，超出首屏分類保留在可操作溢出清單
ok 6 - 搜尋開啟時佔最後一行最後一格，超出首屏分類保留在可操作溢出清單
  ---
  duration_ms: 0.388677
  type: 'test'
  ...
# Subtest: 學生優惠只將六元或以上合資格特飲的加價減半，普通凍檸茶不減價
ok 7 - 學生優惠只將六元或以上合資格特飲的加價減半，普通凍檸茶不減價
  ---
  duration_ms: 1.843267
  type: 'test'
  ...
# Subtest: 學生優惠人數不可超過合資格飲品數量
ok 8 - 學生優惠人數不可超過合資格飲品數量
  ---
  duration_ms: 0.316031
  type: 'test'
  ...
# Subtest: 未有明確資格或特飲加價少於六元，一律不可自行推斷為學生優惠
ok 9 - 未有明確資格或特飲加價少於六元，一律不可自行推斷為學生優惠
  ---
  duration_ms: 0.290994
  type: 'test'
  ...
# Subtest: 團體整單折扣與學生優惠互斥，現場可使用
ok 10 - 團體整單折扣與學生優惠互斥，現場可使用
  ---
  duration_ms: 0.2407
  type: 'test'
  ...
# Subtest: 平台訂單不可使用本店優惠
ok 11 - 平台訂單不可使用本店優惠
  ---
  duration_ms: 0.723633
  type: 'test'
  ...
# Subtest: 數字鍵盤支援數字、小數、退格及清除
ok 12 - 數字鍵盤支援數字、小數、退格及清除
  ---
  duration_ms: 0.333954
  type: 'test'
  ...
# Subtest: 數字鍵盤的 00 是獨立雙零鍵
ok 13 - 數字鍵盤的 00 是獨立雙零鍵
  ---
  duration_ms: 0.30459
  type: 'test'
  ...
# Subtest: 完成結帳保存優惠、應付金額及實際操作終端
ok 14 - 完成結帳保存優惠、應付金額及實際操作終端
  ---
  duration_ms: 1.211184
  type: 'test'
  ...
# Subtest: 渠道政策只容許現場單選付款方式，其他渠道只收必要參考資料
ok 15 - 渠道政策只容許現場單選付款方式，其他渠道只收必要參考資料
  ---
  duration_ms: 1.239177
  type: 'test'
  ...
# Subtest: 現場渠道不提供稍後付款
ok 16 - 現場渠道不提供稍後付款
  ---
  duration_ms: 0.695641
  type: 'test'
  ...
# Subtest: 自有渠道不猜付款方式，平台訂單分開保存佣金及預計結算
ok 17 - 自有渠道不猜付款方式，平台訂單分開保存佣金及預計結算
  ---
  duration_ms: 0.53983
  type: 'test'
  ...
# Subtest: 零元訂單不可建立付款紀錄
ok 18 - 零元訂單不可建立付款紀錄
  ---
  duration_ms: 0.252062
  type: 'test'
  ...
# Subtest: 結帳頁使用共用三位每日流水及永久訂單識別
ok 19 - 結帳頁使用共用三位每日流水及永久訂單識別
  ---
  duration_ms: 17.863234
  type: 'test'
  ...
# Subtest: 結帳紀錄同時保存永久編號及每日顯示流水
ok 20 - 結帳紀錄同時保存永久編號及每日顯示流水
  ---
  duration_ms: 0.569425
  type: 'test'
  ...
# Subtest: 結帳頂部只顯示狀態資料，不保留假快捷金額按鈕
ok 21 - 結帳頂部只顯示狀態資料，不保留假快捷金額按鈕
  ---
  duration_ms: 2.144981
  type: 'test'
  ...
# Subtest: 結帳頁保留數字鍵盤而不顯示底部主導航
ok 22 - 結帳頁保留數字鍵盤而不顯示底部主導航
  ---
  duration_ms: 0.531563
  type: 'test'
  ...
# Subtest: 詳情操作固定提供返回訂單及優惠兩欄
ok 23 - 詳情操作固定提供返回訂單及優惠兩欄
  ---
  duration_ms: 0.357158
  type: 'test'
  ...
# Subtest: 付款區及現金鍵盤由渠道政策動態控制而非所有渠道全部顯示
ok 24 - 付款區及現金鍵盤由渠道政策動態控制而非所有渠道全部顯示
  ---
  duration_ms: 0.400719
  type: 'test'
  ...
# Subtest: 結帳完成保留核對卡並提供有原因的更正資料入口
ok 25 - 結帳完成保留核對卡並提供有原因的更正資料入口
  ---
  duration_ms: 0.379379
  type: 'test'
  ...
# Subtest: 非現場渠道有對應的備註、取餐碼、核對碼或平台單號欄位
ok 26 - 非現場渠道有對應的備註、取餐碼、核對碼或平台單號欄位
  ---
  duration_ms: 0.298067
  type: 'test'
  ...
# Subtest: 快捷金額固定在大鍵盤上方，現場轉換付款方式亦不收起鍵盤
ok 27 - 快捷金額固定在大鍵盤上方，現場轉換付款方式亦不收起鍵盤
  ---
  duration_ms: 0.593109
  type: 'test'
  ...
# Subtest: 已收框是唯一金額輸入顯示並在輸入狀態發光
ok 28 - 已收框是唯一金額輸入顯示並在輸入狀態發光
  ---
  duration_ms: 0.343302
  type: 'test'
  ...
# Subtest: 渠道及付款方式引用大圖標 WebP 資源並採用上圖下字
ok 29 - 渠道及付款方式引用大圖標 WebP 資源並採用上圖下字
  ---
  duration_ms: 0.924519
  type: 'test'
  ...
# Subtest: 數字鍵盤使用四行放大按鍵
ok 30 - 數字鍵盤使用四行放大按鍵
  ---
  duration_ms: 0.626572
  type: 'test'
  ...
# Subtest: 零元時確認按鈕停用並顯示清楚原因
ok 31 - 零元時確認按鈕停用並顯示清楚原因
  ---
  duration_ms: 0.388686
  type: 'test'
  ...
# Subtest: 任何渠道的確認結帳操作永遠固定在付款欄最底
ok 32 - 任何渠道的確認結帳操作永遠固定在付款欄最底
  ---
  duration_ms: 0.317343
  type: 'test'
  ...
# Subtest: 堂食頁固定顯示八張室內枱及戶外枱
ok 33 - 堂食頁固定顯示八張室內枱及戶外枱
  ---
  duration_ms: 4.230942
  type: 'test'
  ...
# Subtest: 三十五分鐘提示只標記枱卡，不增加第三種枱位狀態
ok 34 - 三十五分鐘提示只標記枱卡，不增加第三種枱位狀態
  ---
  duration_ms: 0.692495
  type: 'test'
  ...
# Subtest: 逐餐品付款可拆數量並鎖定已付款數量
ok 35 - 逐餐品付款可拆數量並鎖定已付款數量
  ---
  duration_ms: 1.504383
  type: 'test'
  ...
# Subtest: 堂食付款歸零會建立現場歷史訂單並即時清空枱位
ok 36 - 堂食付款歸零會建立現場歷史訂單並即時清空枱位
  ---
  duration_ms: 2.387985
  type: 'test'
  ...
# Subtest: 堂食正式落單即鎖定流水並保存到製作工作，跨營業日付款亦不改號
ok 37 - 堂食正式落單即鎖定流水並保存到製作工作，跨營業日付款亦不改號
  ---
  duration_ms: 2.067837
  type: 'test'
  ...
# Subtest: 同時使用中的堂食枱亦會佔用每日流水避免撞號
ok 38 - 同時使用中的堂食枱亦會佔用每日流水避免撞號
  ---
  duration_ms: 0.636511
  type: 'test'
  ...
# Subtest: 舊版未有識別的堂食枱直接付款時會避開其他活躍枱流水
ok 39 - 舊版未有識別的堂食枱直接付款時會避開其他活躍枱流水
  ---
  duration_ms: 0.600543
  type: 'test'
  ...
# Subtest: 載入舊資料時會補救已付清但未清枱的堂食會話，且不重複寫歷史
ok 40 - 載入舊資料時會補救已付清但未清枱的堂食會話，且不重複寫歷史
  ---
  duration_ms: 0.590534
  type: 'test'
  ...
# Subtest: 堂食掃碼提交保持待確認，確認後才加入落單記錄
ok 41 - 堂食掃碼提交保持待確認，確認後才加入落單記錄
  ---
  duration_ms: 0.944155
  type: 'test'
  ...
# Subtest: 員工堂食點餐會建立指定枱會話內容，金額及批次由同一批餐品計算
ok 42 - 員工堂食點餐會建立指定枱會話內容，金額及批次由同一批餐品計算
  ---
  duration_ms: 1.04271
  type: 'test'
  ...
# Subtest: 堂食枱面摘要提供營運所需時間、餐點及數量資料
ok 43 - 堂食枱面摘要提供營運所需時間、餐點及數量資料
  ---
  duration_ms: 0.405368
  type: 'test'
  ...
# Subtest: 堂食點餐拒絕寫入已失效的舊會話，避免餐品掛錯枱
ok 44 - 堂食點餐拒絕寫入已失效的舊會話，避免餐品掛錯枱
  ---
  duration_ms: 0.378708
  type: 'test'
  ...
# Subtest: 空枱開始點餐只建立意圖，正式提交餐品時才開枱
ok 45 - 空枱開始點餐只建立意圖，正式提交餐品時才開枱
  ---
  duration_ms: 0.603619
  type: 'test'
  ...
# Subtest: 舊版本遺留的空堂食會話會安全清理，有餐品的會話不受影響
ok 46 - 舊版本遺留的空堂食會話會安全清理，有餐品的會話不受影響
  ---
  duration_ms: 0.417901
  type: 'test'
  ...
# Subtest: 堂食頁提供簡潔枱詳情、半屏待確認及兩層付款操作
ok 47 - 堂食頁提供簡潔枱詳情、半屏待確認及兩層付款操作
  ---
  duration_ms: 0.495066
  type: 'test'
  ...
# Subtest: 正式堂食頁不會自動建立示範枱或示範訂單，掃碼入口標示第二版保留
ok 48 - 正式堂食頁不會自動建立示範枱或示範訂單，掃碼入口標示第二版保留
  ---
  duration_ms: 0.418974
  type: 'test'
  ...
# Subtest: 堂食枱卡直接顯示開枱、三十五分鐘及首三項餐點摘要
ok 49 - 堂食枱卡直接顯示開枱、三十五分鐘及首三項餐點摘要
  ---
  duration_ms: 0.362027
  type: 'test'
  ...
# Subtest: 現有點餐及訂單底欄可以進入獨立堂食頁
ok 50 - 現有點餐及訂單底欄可以進入獨立堂食頁
  ---
  duration_ms: 1.172162
  type: 'test'
  ...
# Subtest: 堂食點單提供取消入口並同步清除失效堂食脈絡
ok 51 - 堂食點單提供取消入口並同步清除失效堂食脈絡
  ---
  duration_ms: 0.942312
  type: 'test'
  ...
# Subtest: 點單頁兩個堂食落單入口都會讀取完成歷史避免重複流水
ok 52 - 點單頁兩個堂食落單入口都會讀取完成歷史避免重複流水
  ---
  duration_ms: 0.825444
  type: 'test'
  ...
# Subtest: 堂食頁最近訂單使用共用時間排序及三位顯示號碼
ok 53 - 堂食頁最近訂單使用共用時間排序及三位顯示號碼
  ---
  duration_ms: 0.296174
  type: 'test'
  ...
# Subtest: draft numbers are sequential within each terminal prefix
ok 54 - draft numbers are sequential within each terminal prefix
  ---
  duration_ms: 1.664473
  type: 'test'
  ...
# Subtest: a removed draft number is never reissued after retrieval
ok 55 - a removed draft number is never reissued after retrieval
  ---
  duration_ms: 0.550809
  type: 'test'
  ...
# Subtest: saving a cart records terminal ownership and an audit event
ok 56 - saving a cart records terminal ownership and an audit event
  ---
  duration_ms: 0.344464
  type: 'test'
  ...
# Subtest: taking over another terminal draft preserves lineage
ok 57 - taking over another terminal draft preserves lineage
  ---
  duration_ms: 0.570237
  type: 'test'
  ...
# Subtest: 日結會清空當時所有草稿，而新營業日草稿不會被誤刪
ok 58 - 日結會清空當時所有草稿，而新營業日草稿不會被誤刪
  ---
  duration_ms: 1.836734
  type: 'test'
  ...
# Subtest: a taken-over cart is renumbered under the terminal that saves it again
ok 59 - a taken-over cart is renumbered under the terminal that saves it again
  ---
  duration_ms: 0.396402
  type: 'test'
  ...
# Subtest: checkout records which terminal completed the order
ok 60 - checkout records which terminal completed the order
  ---
  duration_ms: 0.312194
  type: 'test'
  ...
# GLOBAL_STATUS_ACTION_CORE_OK
# Subtest: tests/global-status-actions-contract.test.mjs
ok 8 - tests/global-status-actions-contract.test.mjs
  ---
  duration_ms: 49.491213
  type: 'test'
  ...
# SMT_HEALTH_SEAL_CONTRACT_OK
# Subtest: tests/health-seal-contract.test.mjs
ok 9 - tests/health-seal-contract.test.mjs
  ---
  duration_ms: 63.384681
  type: 'test'
  ...
# Subtest: Firebase keyed catalog normalizes categories, products and availability
ok 63 - Firebase keyed catalog normalizes categories, products and availability
  ---
  duration_ms: 1.947893
  type: 'test'
  ...
# Subtest: remote products use live values while inheriting locked SMT behaviour by code
ok 64 - remote products use live values while inheriting locked SMT behaviour by code
  ---
  duration_ms: 2.137607
  type: 'test'
  ...
# Subtest: live drink products become quick drinks and retain modifier capabilities
ok 65 - live drink products become quick drinks and retain modifier capabilities
  ---
  duration_ms: 0.410808
  type: 'test'
  ...
# Subtest: menu loader caches a successful response and falls back to cache offline
ok 66 - menu loader caches a successful response and falls back to cache offline
  ---
  duration_ms: 1.045875
  type: 'test'
  ...
# Subtest: runtime uses Firebase RTDB and contains no Apps Script transport
ok 67 - runtime uses Firebase RTDB and contains no Apps Script transport
  ---
  duration_ms: 8.74927
  type: 'test'
  ...
# Subtest: 共用頁面橋接會從正式設定套用主題及聲音狀態
ok 68 - 共用頁面橋接會從正式設定套用主題及聲音狀態
  ---
  duration_ms: 2.810576
  type: 'test'
  ...
# Subtest: 點單頁重載會讀取更多頁保存的快速模式及產品圖片設定
ok 69 - 點單頁重載會讀取更多頁保存的快速模式及產品圖片設定
  ---
  duration_ms: 0.249547
  type: 'test'
  ...
# Subtest: 正式結帳會建立中央打印工作而不把排隊當成實體成功
ok 70 - 正式結帳會建立中央打印工作而不把排隊當成實體成功
  ---
  duration_ms: 0.294271
  type: 'test'
  ...
# Subtest: 訂單重印會即時匯入中央打印工作佇列
ok 71 - 訂單重印會即時匯入中央打印工作佇列
  ---
  duration_ms: 0.228648
  type: 'test'
  ...
# Subtest: 堂食正式落單後會把堂食打印工作匯入中央佇列
ok 72 - 堂食正式落單後會把堂食打印工作匯入中央佇列
  ---
  duration_ms: 0.220843
  type: 'test'
  ...
# Subtest: 營業日固定由早上五時起計並排除上一營業日訂單
not ok 73 - 營業日固定由早上五時起計並排除上一營業日訂單
  ---
  duration_ms: 2.852334
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:31:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:
    + actual - expected
    
    + 1784696400000
    - 1784667600000
           ^
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: 1784667600000
  actual: 1784696400000
  operator: 'strictEqual'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:33:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.start (node:internal/test_runner/test:944:17)
    startSubtestAfterBootstrap (node:internal/test_runner/harness:296:17)
  ...
# Subtest: 報表分開淨銷售、付款、平台結算、待核實及打印異常
not ok 74 - 報表分開淨銷售、付款、平台結算、待核實及打印異常
  ---
  duration_ms: 1.286375
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:40:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:
    
    0 !== 3
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: 3
  actual: 0
  operator: 'strictEqual'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:42:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async startSubtestAfterBootstrap (node:internal/test_runner/harness:296:3)
  ...
# Subtest: 歷史報表支援今日昨日七日三十日三個月六個月及自訂日期
not ok 75 - 歷史報表支援今日昨日七日三十日三個月六個月及自訂日期
  ---
  duration_ms: 0.607796
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:59:1'
  failureType: 'testCodeFailure'
  error: |-
    today
    + actual - expected
    
    + 1784696400000
    - 1784667600000
           ^
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: 1784667600000
  actual: 1784696400000
  operator: 'strictEqual'
  stack: |-
    file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:70:12
    Array.forEach (<anonymous>)
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:68:28)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 選定歷史範圍會由訂單明細重算而不是只讀今日
not ok 76 - 選定歷史範圍會由訂單明細重算而不是只讀今日
  ---
  duration_ms: 27.179244
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:85:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:
    
    0 !== 239
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: 239
  actual: 0
  operator: 'strictEqual'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:93:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 付款及渠道分拆提供對數欄位、狀態及對應訂單
not ok 77 - 付款及渠道分拆提供對數欄位、狀態及對應訂單
  ---
  duration_ms: 0.671685
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:98:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:
    
    0 !== 79.67
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: 79.67
  actual: 0
  operator: 'strictEqual'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:100:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 結帳、堂食及舊核數的付款別名會合併到同一對數方式
not ok 78 - 結帳、堂食及舊核數的付款別名會合併到同一對數方式
  ---
  duration_ms: 2.293229
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:119:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly deep-equal:
    + actual - expected
    
    + {}
    - {
    -   '微信支付': 3,
    -   '拍住賞': 1,
    -   '支付寶': 3,
    -   '現金': 1,
    -   '轉數快': 3,
    -   PayMe: 1
    - }
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
    支付寶: 3
    微信支付: 3
    轉數快: 3
    PayMe: 1
    拍住賞: 1
    現金: 1
  actual:
  operator: 'deepStrictEqual'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:131:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 未知付款方式歸入其他而不會製造無限新分類
not ok 79 - 未知付款方式歸入其他而不會製造無限新分類
  ---
  duration_ms: 0.521976
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:138:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly deep-equal:
    + actual - expected
    
    + []
    - [
    -   [
    -     '其他',
    -     1
    -   ]
    - ]
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
    0:
      0: '其他'
      1: 1
  actual:
  operator: 'deepStrictEqual'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:142:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 堂食分拆付款按每次實收方式對數而不只顯示組合付款
not ok 80 - 堂食分拆付款按每次實收方式對數而不只顯示組合付款
  ---
  duration_ms: 0.616333
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:145:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly deep-equal:
    + actual - expected
    
    + []
    - [
    -   [
    -     'PayMe',
    -     1,
    -     60,
    -     60
    -   ],
    -   [
    -     '現金',
    -     1,
    -     40,
    -     40
    -   ]
    - ]
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
    0:
      0: 'PayMe'
      1: 1
      2: 60
      3: 60
    1:
      0: '現金'
      1: 1
      2: 40
      3: 40
  actual:
  operator: 'deepStrictEqual'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:149:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 付款實收讀取真正 paidAmount 並保留短收及多收的正負差額
not ok 81 - 付款實收讀取真正 paidAmount 並保留短收及多收的正負差額
  ---
  duration_ms: 0.925871
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:154:1'
  failureType: 'testCodeFailure'
  error: "Cannot read properties of undefined (reading 'expected')"
  code: 'ERR_TEST_FAILURE'
  name: 'TypeError'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:160:27)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 現金對數以收款減找續計算，不會把找續再扣一次
not ok 82 - 現金對數以收款減找續計算，不會把找續再扣一次
  ---
  duration_ms: 0.728061
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:164:1'
  failureType: 'testCodeFailure'
  error: "Cannot read properties of undefined (reading 'expected')"
  code: 'ERR_TEST_FAILURE'
  name: 'TypeError'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:170:26)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 平台付款別名統一顯示為平台代收
not ok 83 - 平台付款別名統一顯示為平台代收
  ---
  duration_ms: 1.284983
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:178:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly deep-equal:
    + actual - expected
    
      [
        [
          '平台代收',
    +     1
    -     2
        ]
      ]
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
    0:
      0: '平台代收'
      1: 2
  actual:
    0:
      0: '平台代收'
      1: 1
  operator: 'deepStrictEqual'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:183:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 商品分類、時段及異常資料保留對應訂單供介面下鑽
not ok 84 - 商品分類、時段及異常資料保留對應訂單供介面下鑽
  ---
  duration_ms: 0.294491
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:186:1'
  failureType: 'testCodeFailure'
  error: "Cannot read properties of undefined (reading 'quantity')"
  code: 'ERR_TEST_FAILURE'
  name: 'TypeError'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:188:60)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 異常報表會由現有 audit 列出付款更改、部分取消、重印及付款問題
not ok 85 - 異常報表會由現有 audit 列出付款更改、部分取消、重印及付款問題
  ---
  duration_ms: 0.495937
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:197:1'
  failureType: 'testCodeFailure'
  error: '更改付款／訂單資料'
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: true
  actual: false
  operator: '=='
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:204:66)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 異常操作按 audit 發生時間入報表並保留跨日原訂單下鑽
not ok 86 - 異常操作按 audit 發生時間入報表並保留跨日原訂單下鑽
  ---
  duration_ms: 0.315519
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:209:1'
  failureType: 'testCodeFailure'
  error: "Cannot read properties of undefined (reading 'orderIds')"
  code: 'ERR_TEST_FAILURE'
  name: 'TypeError'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:215:65)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 港幣盤點只提供店舖實際接收的五款紙幣及三款硬幣
ok 87 - 港幣盤點只提供店舖實際接收的五款紙幣及三款硬幣
  ---
  duration_ms: 1.11252
  type: 'test'
  ...
# Subtest: 新營業日沿用上次留底並容許開機時加減調整
ok 88 - 新營業日沿用上次留底並容許開機時加減調整
  ---
  duration_ms: 0.36339
  type: 'test'
  ...
# Subtest: 未手動調整前按開工底金建議提取及留底，且不會留多過實點現金
ok 89 - 未手動調整前按開工底金建議提取及留底，且不會留多過實點現金
  ---
  duration_ms: 0.241231
  type: 'test'
  ...
# Subtest: 日結按實點現金反推待核實訂單的現金及非現金部分
not ok 90 - 日結按實點現金反推待核實訂單的現金及非現金部分
  ---
  duration_ms: 0.404977
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:243:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:
    
    40 !== 140
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: 140
  actual: 40
  operator: 'strictEqual'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:246:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 日結保存現金、支出、差異、版本及稽核而不改寫訂單
not ok 91 - 日結保存現金、支出、差異、版本及稽核而不改寫訂單
  ---
  duration_ms: 0.585675
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:256:1'
  failureType: 'testCodeFailure'
  error: '現金差異超出門檻，必須由有權人明確授權通過'
  code: 'ERR_TEST_FAILURE'
  stack: |-
    createDayClose (file:///home/runner/work/morefunos-smt/morefunos-smt/pages/more/more-domain.js:332:46)
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:258:15)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 超出百分之三差異而沒有原因不可正式日結
not ok 92 - 超出百分之三差異而沒有原因不可正式日結
  ---
  duration_ms: 0.500496
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:267:1'
  failureType: 'testCodeFailure'
  error: 'Missing expected exception.'
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  operator: 'throws'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:268:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 超出百分之三差異必須明確授權，並保存提取及留底現金
not ok 93 - 超出百分之三差異必須明確授權，並保存提取及留底現金
  ---
  duration_ms: 0.434823
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:271:1'
  failureType: 'testCodeFailure'
  error: 'Missing expected exception.'
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  operator: 'throws'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:272:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 提取及留底現金必須完整分配實點現金
not ok 94 - 提取及留底現金必須完整分配實點現金
  ---
  duration_ms: 0.387865
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:280:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /提取及留底/. Input:
    
    'Error: 現金差異超出門檻，必須填寫差異原因'
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual:
  error: '現金差異超出門檻，必須填寫差異原因'
  stack: |-
    createDayClose (file:///home/runner/work/morefunos-smt/morefunos-smt/pages/more/more-domain.js:331:51)
    file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:281:21
    getActual (node:assert:609:5)
    Function.throws (node:assert:757:24)
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:281:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
  operator: 'throws'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:281:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: CSV 匯出包含摘要、訂單及商品明細並正確處理逗號
not ok 95 - CSV 匯出包含摘要、訂單及商品明細並正確處理逗號
  ---
  duration_ms: 0.981286
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:287:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /P100/. Input:
    
    '﻿"磨飯 SMT","營業報表","2026-07-22"\r\n' +
      '\r\n' +
      '"營業摘要","數值"\r\n' +
      '"completedOrders","0"\r\n' +
      '"cancelledOrders","0"\r\n' +
      '"refundOrders","0"\r\n' +
      '"itemUnits","0"\r\n' +
      '"grossSales","0"\r\n' +
      '"discounts","0"\r\n' +
      '"refunds","0"\r\n' +
      '"netSales","0"\r\n' +
      '"averageOrderValue","0"\r\n' +
      '"outstandingOrders","0"\r\n' +
      '"outstandingAmount","0"\r\n' +
      '"cashExpected","0"\r\n' +
      '"electronicExpected","0"\r\n' +
      '"unverifiedDirectTotal","0"\r\n' +
      '"unverifiedDirectOrders","0"\r\n' +
      '"platformGross","0"\r\n' +
      '"platformSettlement","0"\r\n' +
      '"pendingPayments","0"\r\n' +
      '"printExceptions","0"\r\n' +
      '\r\n' +
      '"訂單明細"\r\n' +
      '"訂單號","渠道","付款方式","付款狀態","狀態","金額","時間"\r\n' +
      '\r\n' +
      '"商品明細"\r\n' +
      '"商品","分類","數量","銷售額","涉及訂單"'
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    ﻿"磨飯 SMT","營業報表","2026-07-22"
    
    "營業摘要","數值"
    "completedOrders","0"
    "cancelledOrders","0"
    "refundOrders","0"
    "itemUnits","0"
    "grossSales","0"
    "discounts","0"
    "refunds","0"
    "netSales","0"
    "averageOrderValue","0"
    "outstandingOrders","0"
    "outstandingAmount","0"
    "cashExpected","0"
    "electronicExpected","0"
    "unverifiedDirectTotal","0"
    "unverifiedDirectOrders","0"
    "platformGross","0"
    "platformSettlement","0"
    "pendingPayments","0"
    "printExceptions","0"
    
    "訂單明細"
    "訂單號","渠道","付款方式","付款狀態","狀態","金額","時間"
    
    "商品明細"
    "商品","分類","數量","銷售額","涉及訂單"
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:292:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: 備份有可重算校驗值，任何內容被改動都會驗證失敗
ok 96 - 備份有可重算校驗值，任何內容被改動都會驗證失敗
  ---
  duration_ms: 0.922655
  type: 'test'
  ...
# Subtest: 恢復可以只套用設定或完整資料，並拒絕無效備份
ok 97 - 恢復可以只套用設定或完整資料，並拒絕無效備份
  ---
  duration_ms: 0.773967
  type: 'test'
  ...
# Subtest: 系統診斷清楚分開本機能力、同步積壓及未設定更新來源
ok 98 - 系統診斷清楚分開本機能力、同步積壓及未設定更新來源
  ---
  duration_ms: 0.398184
  type: 'test'
  ...
# Subtest: 更多頁已接入正式路由及五項底部導航
ok 99 - 更多頁已接入正式路由及五項底部導航
  ---
  duration_ms: 5.150732
  type: 'test'
  ...
# Subtest: 更多主畫面有營業日及六個帶營運狀態的入口
ok 100 - 更多主畫面有營業日及六個帶營運狀態的入口
  ---
  duration_ms: 0.440264
  type: 'test'
  ...
# Subtest: 更多首頁直接顯示今日營業、渠道及付款分析而毋須進入第二層
ok 101 - 更多首頁直接顯示今日營業、渠道及付款分析而毋須進入第二層
  ---
  duration_ms: 0.271879
  type: 'test'
  ...
# Subtest: 六個入口均有可讀細節面板而非只顯示簡單訊息
ok 102 - 六個入口均有可讀細節面板而非只顯示簡單訊息
  ---
  duration_ms: 0.328143
  type: 'test'
  ...
# Subtest: 日結、恢復、更新及退出全螢幕均先開二次確認
ok 103 - 日結、恢復、更新及退出全螢幕均先開二次確認
  ---
  duration_ms: 0.836384
  type: 'test'
  ...
# Subtest: 六個入口已由死按鈕改成真實本機操作
ok 104 - 六個入口已由死按鈕改成真實本機操作
  ---
  duration_ms: 0.472624
  type: 'test'
  ...
# Subtest: 顯示設定可本機保存，彈窗遮罩不可點空白關閉
ok 105 - 顯示設定可本機保存，彈窗遮罩不可點空白關閉
  ---
  duration_ms: 0.306424
  type: 'test'
  ...
# Subtest: 顯示與操作可設定分類每行格數、行數及最後一格搜尋
ok 106 - 顯示與操作可設定分類每行格數、行數及最後一格搜尋
  ---
  duration_ms: 0.314238
  type: 'test'
  ...
# Subtest: 更多頁沿用共用基礎樣式並固定頂底欄
ok 107 - 更多頁沿用共用基礎樣式並固定頂底欄
  ---
  duration_ms: 0.687957
  type: 'test'
  ...
# Subtest: 收銀日結提供點算、支出、差異原因、版本及正式保存
ok 108 - 收銀日結提供點算、支出、差異原因、版本及正式保存
  ---
  duration_ms: 0.679972
  type: 'test'
  ...
# Subtest: 日結提供面額互推、開工底金、提取留底、待核實反推及超額授權
ok 109 - 日結提供面額互推、開工底金、提取留底、待核實反推及超額授權
  ---
  duration_ms: 0.397954
  type: 'test'
  ...
# Subtest: 開機底金顯示上次留底、調整額及確認後開工現金
ok 110 - 開機底金顯示上次留底、調整額及確認後開工現金
  ---
  duration_ms: 0.234338
  type: 'test'
  ...
# Subtest: 營業分析同時展示每個渠道及每種付款方式的單數和金額
ok 111 - 營業分析同時展示每個渠道及每種付款方式的單數和金額
  ---
  duration_ms: 0.177532
  type: 'test'
  ...
# Subtest: 全局共用樣式提供觸控回饋、彈窗動效及減少動效模式
ok 112 - 全局共用樣式提供觸控回饋、彈窗動效及減少動效模式
  ---
  duration_ms: 0.305982
  type: 'test'
  ...
# Subtest: 報表五個分頁讀取同一選定日期報表並可下載 CSV
ok 113 - 報表五個分頁讀取同一選定日期報表並可下載 CSV
  ---
  duration_ms: 0.231523
  type: 'test'
  ...
# Subtest: 歷史報表提供七種日期入口及自訂開始結束日期
ok 114 - 歷史報表提供七種日期入口及自訂開始結束日期
  ---
  duration_ms: 0.299891
  type: 'test'
  ...
# Subtest: 付款對數逐項顯示單數應收實收退款差額狀態並可下鑽
ok 115 - 付款對數逐項顯示單數應收實收退款差額狀態並可下鑽
  ---
  duration_ms: 0.200705
  type: 'test'
  ...
# Subtest: 商品報表可切換產品及分類並保留時段與日結紀錄
ok 116 - 商品報表可切換產品及分類並保留時段與日結紀錄
  ---
  duration_ms: 0.185848
  type: 'test'
  ...
# Subtest: 打印中心可設定網絡設備、選格式、診斷、預覽、重試及改送
ok 117 - 打印中心可設定網絡設備、選格式、診斷、預覽、重試及改送
  ---
  duration_ms: 0.459949
  type: 'test'
  ...
# Subtest: 備份中心可以建立、下載、匯入、驗證及分範圍恢復
ok 118 - 備份中心可以建立、下載、匯入、驗證及分範圍恢復
  ---
  duration_ms: 0.278511
  type: 'test'
  ...
# Subtest: 系統中心提供真實診斷、操作紀錄、同步重試及更新檢查結果
ok 119 - 系統中心提供真實診斷、操作紀錄、同步重試及更新檢查結果
  ---
  duration_ms: 0.308467
  type: 'test'
  ...
# node:internal/modules/run_main:123
#     triggerUncaughtException(
#     ^
# AssertionError [ERR_ASSERTION]: missing responsive More contract: body[data-page="more"] .more-workspace{container-type:size;container-name:more-workspace}
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
not ok 14 - tests/more-responsive-contract.test.mjs
  ---
  duration_ms: 31.664681
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-responsive-contract.test.mjs:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
# SMT_ORDER_CART_DOMAIN_OK
# Subtest: tests/order-cart-domain.test.mjs
ok 15 - tests/order-cart-domain.test.mjs
  ---
  duration_ms: 43.052668
  type: 'test'
  ...
# Subtest: quick mode uses a direct-add product action
ok 122 - quick mode uses a direct-add product action
  ---
  duration_ms: 3.533067
  type: 'test'
  ...
# Subtest: cart rows expose separate quantity and edit controls
ok 123 - cart rows expose separate quantity and edit controls
  ---
  duration_ms: 0.38505
  type: 'test'
  ...
# Subtest: product editor is a compact anchored card with explicit confirmation
ok 124 - product editor is a compact anchored card with explicit confirmation
  ---
  duration_ms: 0.360204
  type: 'test'
  ...
# Subtest: modal backdrop is inert and cannot dismiss changes
ok 125 - modal backdrop is inert and cannot dismiss changes
  ---
  duration_ms: 0.248495
  type: 'test'
  ...
# Subtest: cart quantity updates totals, trims drink assignments, and removes zero rows
ok 126 - cart quantity updates totals, trims drink assignments, and removes zero rows
  ---
  duration_ms: 1.122559
  type: 'test'
  ...
# Subtest: order shell keeps the bottom navigation inside the fixed canvas
ok 127 - order shell keeps the bottom navigation inside the fixed canvas
  ---
  duration_ms: 0.365424
  type: 'test'
  ...
# Subtest: checkout call to action shows the payable total
not ok 128 - checkout call to action shows the payable total
  ---
  duration_ms: 2.447096
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:50:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /:\s*'結帳 '\+money\(cartTotal\(state\.cart\)\)/. Input:
    
    "import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';\n" +
      "import {ORDER_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,SETTINGS_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,DINE_STORAGE_KEY,SUPPLY_STORAGE_KEY,PRINTER_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';\n" +
      "import {clearExpiredBusinessDayDrafts,createDraftRecord,normalizeTerminalId,restoreDraftForTerminal} from '../../shared/operations.js';\n" +
      "import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';\n" +
      "import {orderPageConfig as defaults} from './page-config.js';\n" +
      "import {categories as fallbackCategories,products as fallbackProducts,drinks as fallbackDrinks,optionSets} from './page-data.js';\n" +
      "import {loadMenuCatalog,MENU_CACHE_KEY} from './menu-api.js';\n" +
      "import {acceptPendingOrder,combineRiceballSet,dissolveRiceballSet,completeExpiredOrders,createWhatsAppLink,updateCartLineQuantity,CART_VIEW_INPUT,CART_VIEW_ORGANIZED,SERVICE_TAKEAWAY,SERVICE_DINE_IN,normalizeCartViewMode,normalizeServiceMode,resolveInitialOrderServiceMode,applyOrderServiceMode,toggleLineServiceMode,cartForView,inferOrderServiceMode} from './order-domain.js';\n" +
      "import {commitTableOrder,createInitialDineState,cleanupEmptyDineSessions} from '../dine/dine-domain.js';\n" +
      "import {defaultPrinterState,importExternalPrintJobs} from '../more/print-domain.js';\n" +
      "import {buildCategoryLayout,normalizeCategoryLayout} from './category-layout.js';\n" +
      "import {renderGlobalStatusBar,renderBottomNav} from '../../shared/shell.js';\n" +
      "import {activeDineOrderIdentities,latestOrderDisplayNumber} from '../../shared/order-identity.js';\n" +
      '\n' +
      "const app=document.getElementById('app');\n" +
      'const fallbackCatalog={categories:fallbackCategories,products:fallbackProducts,drinks:fallbackDrinks};\n' +
      'const cachedCatalog=readJSON(MENU_CACHE_KEY,null);\n' +
      'const initialCatalog=cachedCatalog?.products?.length?cachedCatalog:fallbackCatalog;\n' +
      'let categories=[...(initialCatalog.categories||fallbackCategories)],products=[...(initialCatalog.products||fallbackProducts)],drinks=[...(initialCatalog.drinks||fallbackDrinks)];\n' +
      'let productMap=new Map(),drinkMap=new Map(),snackProducts=[],drinkProducts=[];\n' +
      'function indexCatalog(){\n' +
      '  productMap=new Map(products.map(item=>[item.id,item]));\n' +
      '  drinkMap=new Map(drinks.map(item=>[item.id,item]));\n' +
      "  snackProducts=products.filter(item=>item.linkRole==='snack');\n" +
      "  drinkProducts=products.filter(item=>item.linkRole==='drink');\n" +
      '}\n' +
      'indexCatalog();\n' +
      'let modal=null;\n' +
      'const supplyOverrides=readJSON(SUPPLY_STORAGE_KEY,{})||{};\n' +
      "function supplyStatus(product){return supplyOverrides[product.id]?.status||(product.available===false?'soldout':'available');}\n" +
      "function supplyLabel(status){return status==='soldout'?'今日售罄':status==='paused'?'暫停供應':'供應中';}\n" +
      "function sortPausedLast(items){return items.map((item,index)=>({item,index})).sort((a,b)=>Number(supplyStatus(a.item)==='paused')-Number(supplyStatus(b.item)==='paused')||a.index-b.index).map(row=>row.item);}\n" +
      'let confirmState=null;\n' +
      "let newOrderNotice={id:'A516',source:'磨飯 App',items:3,amount:104,visible:true};\n" +
      'const demoPendingOrders={\n' +
      "  online:[{id:'A512',source:'磨飯 App',contact:'陳小姐',phone:'85291234567',items:5,amount:168,wait:'2 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'FPS',proof:'../../assets/products/f4.webp',lines:[['蜜糖雞絲＋鹽酥雞',2,90],['台式奶茶',2,32],['香脆雞翼',1,18]]},{id:'W331',source:'網頁',contact:'梁先生',phone:'85262345678',items:3,amount:62,wait:'1 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'PayMe',proof:'../../assets/products/f1.webp',lines:[['原味紫米飯團',1,41],['味噌湯',1,12],['可樂',1,9]]}],\n" +
      "  queue:[{id:'T1824',source:'電話',contact:'電話尾號 1824',phone:'85261231824',items:2,amount:96,wait:'4 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'待確認',proof:'',lines:[['自選便當',2,96]]},{id:'T6631',source:'WhatsApp',contact:'WhatsApp 尾號 6631',phone:'85261236631',items:1,amount:59,wait:'6 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'FPS',proof:'',lines:[['紫米飯團 A 餐',1,59]]}]\n" +
      '};\n' +
      '\n' +
      'const saved=readJSON(ORDER_STORAGE_KEY,null);\n' +
      'const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});\n' +
      'let drafts=readJSON(DRAFT_STORAGE_KEY,[]);\n' +
      'const expiredDrafts=clearExpiredBusinessDayDrafts(drafts);\n' +
      'if(expiredDrafts.voided.length){drafts=expiredDrafts.remaining;writeJSON(DRAFT_STORAGE_KEY,drafts);}\n' +
      'let draftCounters=readJSON(DRAFT_COUNTER_STORAGE_KEY,{});\n' +
      "const terminalId=normalizeTerminalId(localStorage.getItem(TERMINAL_ID_STORAGE_KEY)||new URLSearchParams(location.search).get('terminal')||'SMT');\n" +
      'localStorage.setItem(TERMINAL_ID_STORAGE_KEY,terminalId);\n' +
      'const settings={\n' +
      '  catalog:{...defaults.catalog,showImages:true,...(savedSettings.catalog||{}),productOverrides:{}},\n' +
      '  categoryLayout:normalizeCategoryLayout(savedSettings.categoryLayout||defaults.categoryLayout),\n' +
      '  cart:{...defaults.cart,...(savedSettings.cart||{}),viewMode:normalizeCartViewMode(savedSettings.cartViewMode||savedSettings.cart?.viewMode)},\n' +
      '  quickDrinks:{...defaults.quickDrinks,...(savedSettings.quickDrinks||{})}\n' +
      '};\n' +
      'function syncDinePrintJobs(dineState){\n' +
      '  const current=readJSON(PRINTER_STORAGE_KEY,null)||defaultPrinterState();\n' +
      '  writeJSON(PRINTER_STORAGE_KEY,importExternalPrintJobs(current,{dine:dineState}));\n' +
      '}\n' +
      '\n' +
      "function drinkSelection(id,sweetness='',ice=''){\n" +
      '  const d=drinkMap.get(id);\n' +
      '  return {drinkId:id,name:d?.name||id,unitPrice:d?.price||0,sweetness,ice,studentDiscountEligible:d?.studentDiscountEligible===true,specialDrinkSurcharge:Number(d?.specialDrinkSurcharge)||0};\n' +
      '}\n' +
      "function makeLine(productId,qty=1,{options={},drinkAssignments=[],linkedComboId='',linkedQty=0,serviceMode=SERVICE_TAKEAWAY}={}){\n" +
      '  const p=productMap.get(productId);\n' +
      '  qty=Math.max(1,Number(qty)||1);\n' +
      '  return {\n' +
      "    lineId:stableId('line'),productId,name:p.name,image:p.image,category:p.category,qty,\n" +
      '    unitPrice:p.price,total:p.price*qty,options:safeClone(options),\n' +
      '    studentDiscountEligible:p.studentDiscountEligible===true,specialDrinkSurcharge:Number(p.specialDrinkSurcharge)||0,\n' +
      '    drinkAssignments:safeClone(drinkAssignments),drinkSlots:(p.drinkSlots||0)*qty,\n' +
      "    required:[...(p.required||[])],combinable:Boolean(p.combinable),linkRole:p.linkRole||'',\n" +
      "    serviceMode:normalizeServiceMode(serviceMode,SERVICE_TAKEAWAY),serviceModeOverride:'',\n" +
      '    linkedComboId,linkedQty,createdOrder:Date.now()+Math.random()\n' +
      '  };\n' +
      '}\n' +
      'function normalizeCart(cart,defaultMode=SERVICE_TAKEAWAY){\n' +
      '  return (Array.isArray(cart)?cart:[]).map((line,index)=>{\n' +
      '    const p=productMap.get(line.productId)||{};\n' +
      '    const qty=Math.max(1,Number(line.qty)||1);\n' +
      '    const unitPrice=Number(line.unitPrice??p.price??0);\n' +
      '    const serviceMode=normalizeServiceMode(line.serviceMode,defaultMode);\n' +
      "    return {...line,lineId:line.lineId||stableId('line'),name:line.name||p.name||'餐點',image:line.image||p.image||'',category:line.category||p.category||'',qty,unitPrice,total:unitPrice*qty,serviceMode,serviceModeOverride:line.serviceModeOverride||'',options:{...(line.options||{})},studentDiscountEligible:line.studentDiscountEligible===true||p.studentDiscountEligible===true,specialDrinkSurcharge:Number(line.specialDrinkSurcharge??p.specialDrinkSurcharge)||0,drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],drinkSlots:Number(line.drinkSlots??(p.drinkSlots||0)*qty),required:Array.isArray(line.required)?line.required:[...(p.required||[])],combinable:Boolean(line.combinable??p.combinable),linkRole:line.linkRole||p.linkRole||'',linkedComboId:line.linkedComboId||'',linkedQty:Number(line.linkedQty||0),createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:index};\n" +
      '  }).sort((a,b)=>a.createdOrder-b.createdOrder);\n' +
      '}\n' +
      "function mergeKey(line){return JSON.stringify({productId:line.productId,serviceMode:line.serviceMode,options:line.options,drinks:line.drinkAssignments.map(d=>[d.drinkId,d.sweetness||'',d.ice||'']),linkedComboId:line.linkedComboId});}\n" +
      'function mergeCart(cart,mode){\n' +
      "  const rows=normalizeCart(cart);if(mode==='never')return rows;\n" +
      '  const out=[];\n' +
      '  rows.forEach(line=>{\n' +
      "    const found=line.lineType==='combo'?null:out.find(item=>item.productId===line.productId&&(mode==='always'||mergeKey(item)===mergeKey(line)));\n" +
      '    if(!found){out.push(safeClone(line));return;}\n' +
      '    found.qty+=line.qty;found.total=found.unitPrice*found.qty;found.drinkSlots+=line.drinkSlots;found.drinkAssignments.push(...safeClone(line.drinkAssignments));\n' +
      '  });\n' +
      '  return out;\n' +
      '}\n' +
      'function describe(line){\n' +
      '  const parts=[];\n' +
      "  if(line.lineType==='combo'){\n" +
      '    const names=(line.combo?.components||[]).map(item=>item.name).filter(Boolean);\n' +
      "    if(names.length)parts.push(names.join('＋'));\n" +
      "    if(line.combo?.discount)parts.push('套餐優惠 -'+money(line.combo.discount));\n" +
      '  }\n' +
      "  Object.entries(line.options||{}).forEach(([key,value])=>{if(value)parts.push(Array.isArray(value)?value.join('、'):value);});\n" +
      '  const grouped={};\n' +
      "  (line.drinkAssignments||[]).forEach(d=>{const key=[d.name,d.sweetness||'',d.ice||''].join('|');grouped[key]=(grouped[key]||0)+1;});\n" +
      "  Object.entries(grouped).forEach(([key,count])=>{const [name,sweet,ice]=key.split('|');const mods=[sweet,ice].filter(Boolean).join(' · ');parts.push(name+(mods?' · '+mods:'')+(count>1?' ×'+count:''));});\n" +
      "  if(line.linkedComboId)parts.push('已組合套餐'+(line.linkedQty>1?' ×'+line.linkedQty:''));\n" +
      '  const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);\n' +
      "  if(missing&&line.required.includes('drink'))parts.push('尚欠飲品 '+missing+' 份');\n" +
      "  return parts.join(' · ')||'標準';\n" +
      '}\n' +
      'function missingGroups(line){\n' +
      '  const groups=[];\n' +
      '  (line.required||[]).forEach(group=>{\n' +
      "    if(group==='drink'){\n" +
      '      const count=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);\n' +
      "      if(count)groups.push({group,label:'飲品',count});\n" +
      "    }else if(!line.options?.[group]) groups.push({group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':'小食',count:line.qty||1});\n" +
      '  });\n' +
      '  return groups;\n' +
      '}\n' +
      'function pendingSummary(cart){\n' +
      '  const out={rice:0,sauce:0,snack:0,drink:0,total:0};\n' +
      '  cart.forEach(line=>missingGroups(line).forEach(item=>{out[item.group]+=item.count;out.total+=item.count;}));\n' +
      '  ret'... 90308 more characters
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';
    import {ORDER_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,SETTINGS_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,DINE_STORAGE_KEY,SUPPLY_STORAGE_KEY,PRINTER_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';
    import {clearExpiredBusinessDayDrafts,createDraftRecord,normalizeTerminalId,restoreDraftForTerminal} from '../../shared/operations.js';
    import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';
    import {orderPageConfig as defaults} from './page-config.js';
    import {categories as fallbackCategories,products as fallbackProducts,drinks as fallbackDrinks,optionSets} from './page-data.js';
    import {loadMenuCatalog,MENU_CACHE_KEY} from './menu-api.js';
    import {acceptPendingOrder,combineRiceballSet,dissolveRiceballSet,completeExpiredOrders,createWhatsAppLink,updateCartLineQuantity,CART_VIEW_INPUT,CART_VIEW_ORGANIZED,SERVICE_TAKEAWAY,SERVICE_DINE_IN,normalizeCartViewMode,normalizeServiceMode,resolveInitialOrderServiceMode,applyOrderServiceMode,toggleLineServiceMode,cartForView,inferOrderServiceMode} from './order-domain.js';
    import {commitTableOrder,createInitialDineState,cleanupEmptyDineSessions} from '../dine/dine-domain.js';
    import {defaultPrinterState,importExternalPrintJobs} from '../more/print-domain.js';
    import {buildCategoryLayout,normalizeCategoryLayout} from './category-layout.js';
    import {renderGlobalStatusBar,renderBottomNav} from '../../shared/shell.js';
    import {activeDineOrderIdentities,latestOrderDisplayNumber} from '../../shared/order-identity.js';
    
    const app=document.getElementById('app');
    const fallbackCatalog={categories:fallbackCategories,products:fallbackProducts,drinks:fallbackDrinks};
    const cachedCatalog=readJSON(MENU_CACHE_KEY,null);
    const initialCatalog=cachedCatalog?.products?.length?cachedCatalog:fallbackCatalog;
    let categories=[...(initialCatalog.categories||fallbackCategories)],products=[...(initialCatalog.products||fallbackProducts)],drinks=[...(initialCatalog.drinks||fallbackDrinks)];
    let productMap=new Map(),drinkMap=new Map(),snackProducts=[],drinkProducts=[];
    function indexCatalog(){
      productMap=new Map(products.map(item=>[item.id,item]));
      drinkMap=new Map(drinks.map(item=>[item.id,item]));
      snackProducts=products.filter(item=>item.linkRole==='snack');
      drinkProducts=products.filter(item=>item.linkRole==='drink');
    }
    indexCatalog();
    let modal=null;
    const supplyOverrides=readJSON(SUPPLY_STORAGE_KEY,{})||{};
    function supplyStatus(product){return supplyOverrides[product.id]?.status||(product.available===false?'soldout':'available');}
    function supplyLabel(status){return status==='soldout'?'今日售罄':status==='paused'?'暫停供應':'供應中';}
    function sortPausedLast(items){return items.map((item,index)=>({item,index})).sort((a,b)=>Number(supplyStatus(a.item)==='paused')-Number(supplyStatus(b.item)==='paused')||a.index-b.index).map(row=>row.item);}
    let confirmState=null;
    let newOrderNotice={id:'A516',source:'磨飯 App',items:3,amount:104,visible:true};
    const demoPendingOrders={
      online:[{id:'A512',source:'磨飯 App',contact:'陳小姐',phone:'85291234567',items:5,amount:168,wait:'2 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'FPS',proof:'../../assets/products/f4.webp',lines:[['蜜糖雞絲＋鹽酥雞',2,90],['台式奶茶',2,32],['香脆雞翼',1,18]]},{id:'W331',source:'網頁',contact:'梁先生',phone:'85262345678',items:3,amount:62,wait:'1 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'PayMe',proof:'../../assets/products/f1.webp',lines:[['原味紫米飯團',1,41],['味噌湯',1,12],['可樂',1,9]]}],
      queue:[{id:'T1824',source:'電話',contact:'電話尾號 1824',phone:'85261231824',items:2,amount:96,wait:'4 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'待確認',proof:'',lines:[['自選便當',2,96]]},{id:'T6631',source:'WhatsApp',contact:'WhatsApp 尾號 6631',phone:'85261236631',items:1,amount:59,wait:'6 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'FPS',proof:'',lines:[['紫米飯團 A 餐',1,59]]}]
    };
    
    const saved=readJSON(ORDER_STORAGE_KEY,null);
    const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});
    let drafts=readJSON(DRAFT_STORAGE_KEY,[]);
    const expiredDrafts=clearExpiredBusinessDayDrafts(drafts);
    if(expiredDrafts.voided.length){drafts=expiredDrafts.remaining;writeJSON(DRAFT_STORAGE_KEY,drafts);}
    let draftCounters=readJSON(DRAFT_COUNTER_STORAGE_KEY,{});
    const terminalId=normalizeTerminalId(localStorage.getItem(TERMINAL_ID_STORAGE_KEY)||new URLSearchParams(location.search).get('terminal')||'SMT');
    localStorage.setItem(TERMINAL_ID_STORAGE_KEY,terminalId);
    const settings={
      catalog:{...defaults.catalog,showImages:true,...(savedSettings.catalog||{}),productOverrides:{}},
      categoryLayout:normalizeCategoryLayout(savedSettings.categoryLayout||defaults.categoryLayout),
      cart:{...defaults.cart,...(savedSettings.cart||{}),viewMode:normalizeCartViewMode(savedSettings.cartViewMode||savedSettings.cart?.viewMode)},
      quickDrinks:{...defaults.quickDrinks,...(savedSettings.quickDrinks||{})}
    };
    function syncDinePrintJobs(dineState){
      const current=readJSON(PRINTER_STORAGE_KEY,null)||defaultPrinterState();
      writeJSON(PRINTER_STORAGE_KEY,importExternalPrintJobs(current,{dine:dineState}));
    }
    
    function drinkSelection(id,sweetness='',ice=''){
      const d=drinkMap.get(id);
      return {drinkId:id,name:d?.name||id,unitPrice:d?.price||0,sweetness,ice,studentDiscountEligible:d?.studentDiscountEligible===true,specialDrinkSurcharge:Number(d?.specialDrinkSurcharge)||0};
    }
    function makeLine(productId,qty=1,{options={},drinkAssignments=[],linkedComboId='',linkedQty=0,serviceMode=SERVICE_TAKEAWAY}={}){
      const p=productMap.get(productId);
      qty=Math.max(1,Number(qty)||1);
      return {
        lineId:stableId('line'),productId,name:p.name,image:p.image,category:p.category,qty,
        unitPrice:p.price,total:p.price*qty,options:safeClone(options),
        studentDiscountEligible:p.studentDiscountEligible===true,specialDrinkSurcharge:Number(p.specialDrinkSurcharge)||0,
        drinkAssignments:safeClone(drinkAssignments),drinkSlots:(p.drinkSlots||0)*qty,
        required:[...(p.required||[])],combinable:Boolean(p.combinable),linkRole:p.linkRole||'',
        serviceMode:normalizeServiceMode(serviceMode,SERVICE_TAKEAWAY),serviceModeOverride:'',
        linkedComboId,linkedQty,createdOrder:Date.now()+Math.random()
      };
    }
    function normalizeCart(cart,defaultMode=SERVICE_TAKEAWAY){
      return (Array.isArray(cart)?cart:[]).map((line,index)=>{
        const p=productMap.get(line.productId)||{};
        const qty=Math.max(1,Number(line.qty)||1);
        const unitPrice=Number(line.unitPrice??p.price??0);
        const serviceMode=normalizeServiceMode(line.serviceMode,defaultMode);
        return {...line,lineId:line.lineId||stableId('line'),name:line.name||p.name||'餐點',image:line.image||p.image||'',category:line.category||p.category||'',qty,unitPrice,total:unitPrice*qty,serviceMode,serviceModeOverride:line.serviceModeOverride||'',options:{...(line.options||{})},studentDiscountEligible:line.studentDiscountEligible===true||p.studentDiscountEligible===true,specialDrinkSurcharge:Number(line.specialDrinkSurcharge??p.specialDrinkSurcharge)||0,drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],drinkSlots:Number(line.drinkSlots??(p.drinkSlots||0)*qty),required:Array.isArray(line.required)?line.required:[...(p.required||[])],combinable:Boolean(line.combinable??p.combinable),linkRole:line.linkRole||p.linkRole||'',linkedComboId:line.linkedComboId||'',linkedQty:Number(line.linkedQty||0),createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:index};
      }).sort((a,b)=>a.createdOrder-b.createdOrder);
    }
    function mergeKey(line){return JSON.stringify({productId:line.productId,serviceMode:line.serviceMode,options:line.options,drinks:line.drinkAssignments.map(d=>[d.drinkId,d.sweetness||'',d.ice||'']),linkedComboId:line.linkedComboId});}
    function mergeCart(cart,mode){
      const rows=normalizeCart(cart);if(mode==='never')return rows;
      const out=[];
      rows.forEach(line=>{
        const found=line.lineType==='combo'?null:out.find(item=>item.productId===line.productId&&(mode==='always'||mergeKey(item)===mergeKey(line)));
        if(!found){out.push(safeClone(line));return;}
        found.qty+=line.qty;found.total=found.unitPrice*found.qty;found.drinkSlots+=line.drinkSlots;found.drinkAssignments.push(...safeClone(line.drinkAssignments));
      });
      return out;
    }
    function describe(line){
      const parts=[];
      if(line.lineType==='combo'){
        const names=(line.combo?.components||[]).map(item=>item.name).filter(Boolean);
        if(names.length)parts.push(names.join('＋'));
        if(line.combo?.discount)parts.push('套餐優惠 -'+money(line.combo.discount));
      }
      Object.entries(line.options||{}).forEach(([key,value])=>{if(value)parts.push(Array.isArray(value)?value.join('、'):value);});
      const grouped={};
      (line.drinkAssignments||[]).forEach(d=>{const key=[d.name,d.sweetness||'',d.ice||''].join('|');grouped[key]=(grouped[key]||0)+1;});
      Object.entries(grouped).forEach(([key,count])=>{const [name,sweet,ice]=key.split('|');const mods=[sweet,ice].filter(Boolean).join(' · ');parts.push(name+(mods?' · '+mods:'')+(count>1?' ×'+count:''));});
      if(line.linkedComboId)parts.push('已組合套餐'+(line.linkedQty>1?' ×'+line.linkedQty:''));
      const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
      if(missing&&line.required.includes('drink'))parts.push('尚欠飲品 '+missing+' 份');
      return parts.join(' · ')||'標準';
    }
    function missingGroups(line){
      const groups=[];
      (line.required||[]).forEach(group=>{
        if(group==='drink'){
          const count=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
          if(count)groups.push({group,label:'飲品',count});
        }else if(!line.options?.[group]) groups.push({group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':'小食',count:line.qty||1});
      });
      return groups;
    }
    function pendingSummary(cart){
      const out={rice:0,sauce:0,snack:0,drink:0,total:0};
      cart.forEach(line=>missingGroups(line).forEach(item=>{out[item.group]+=item.count;out.total+=item.count;}));
      return out;
    }
    function cartTotal(cart){return cart.reduce((sum,line)=>sum+Number(line.total||0),0);}
    function linkUpSummary(cart){
      const available=cart.filter(line=>line.lineType!=='combo'&&!line.linkedComboId);
      const riceballs=available.filter(line=>line.combinable).reduce((n,line)=>n+line.qty,0);
      const snacks=available.filter(line=>line.linkRole==='snack').reduce((n,line)=>n+line.qty,0);
      const standaloneDrinks=available.filter(line=>line.linkRole==='drink').reduce((n,line)=>n+line.qty,0);
      return {riceballs,snacks,drinks:standaloneDrinks,count:Math.min(riceballs,snacks)};
    }
    function applyLinkUp(count){
      if(!count)return;
      store.set(state=>{
        let next=state.cart;
        for(let index=0;index<count;index++){
          const main=next.find(line=>line.lineType!=='combo'&&line.combinable),snack=next.find(line=>line.lineType!=='combo'&&line.linkRole==='snack'),drink=next.find(line=>line.lineType!=='combo'&&line.linkRole==='drink');
          if(!main||!snack)break;
          next=combineRiceballSet(next,{mainLineId:main.lineId,snackLineId:snack.lineId,drinkLineId:drink?.lineId},{comboId:stableId('combo'),lineId:stableId('line'),comboPrice:59,source:'automatic'});
        }
        state.cart=normalizeCart(next,state.orderServiceMode);
        state.lastAffectedLineId=state.cart.at(-1)?.lineId||'';
        state.lastMutationKind='changed';
        return state;
      });
      queue.afterRender(()=>showToast('已組合 '+count+' 份飯團套餐'));
    }
    
    let initialCart=saved&&Array.isArray(saved.cart)?saved.cart:[];
    let initialDineContext=saved?.dineContext||null;
    if(initialDineContext){
      const dine=cleanupEmptyDineSessions(readJSON(DINE_STORAGE_KEY,null)||createInitialDineState());
      writeJSON(DINE_STORAGE_KEY,dine);
      const table=dine.tables.find(entry=>entry.id===String(initialDineContext.tableId));
      const stale=!table||(initialDineContext.sessionId&&table.session?.id!==initialDineContext.sessionId)||(!initialDineContext.sessionId&&!initialDineContext.startedFromFree&&table.status==='free');
      if(stale){initialDineContext=null;initialCart=[];}
    }
    const initialOrderServiceMode=resolveInitialOrderServiceMode(initialDineContext,initialCart.length?saved?.orderServiceMode:SERVICE_TAKEAWAY);
    initialCart=normalizeCart(initialCart,initialOrderServiceMode);
    const defaultHealth={catalog:{ok:false,label:'餐牌',detail:'正在連接'},api:{ok:false,label:'訂單 API',detail:'未連接'},printer:{ok:false,label:'打印機',detail:'未連接'},sync:{ok:false,label:'同步',detail:'等待 API'},backup:{ok:true,label:'備份',detail:'本機資料正常'}};
    const store=createStore({category:'全部',searchQuery:'',cart:initialCart,dineContext:initialDineContext,orderServiceMode:initialOrderServiceMode,cartViewMode:savedSettings.cartViewMode||settings.cart.viewMode||CART_VIEW_INPUT,lastAffectedLineId:'',lastMutationKind:'',collapsedCartCategories:[],settings,quickMode:saved?.quickMode??savedSettings.morePage?.quickMode??false,quickDrawerOpen:false,pendingOrders:safeClone(demoPendingOrders),runningOrders:[],completedOrders:[],operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false},health:defaultHealth},{storageKey:ORDER_STORAGE_KEY,persistState:state=>({cart:state.cart,dineContext:state.dineContext,orderServiceMode:state.orderServiceMode,cartViewMode:state.cartViewMode,quickMode:state.quickMode,draftSession:state.draftSession,pendingOrders:state.pendingOrders,runningOrders:state.runningOrders,completedOrders:state.completedOrders,operations:state.operations,settings:state.settings}),normalize:state=>({...state,searchQuery:String(state.searchQuery||''),dineContext:state.dineContext||null,orderServiceMode:normalizeServiceMode(state.dineContext?SERVICE_DINE_IN:state.orderServiceMode,SERVICE_TAKEAWAY),cartViewMode:normalizeCartViewMode(state.cartViewMode||settings.cart.viewMode),lastAffectedLineId:String(state.lastAffectedLineId||''),lastMutationKind:String(state.lastMutationKind||''),collapsedCartCategories:Array.isArray(state.collapsedCartCategories)?state.collapsedCartCategories:[],quickMode:Boolean(state.quickMode),quickDrawerOpen:Boolean(state.quickDrawerOpen),cart:normalizeCart(state.cart||[],state.dineContext?SERVICE_DINE_IN:state.orderServiceMode),pendingOrders:state.pendingOrders||safeClone(demoPendingOrders),runningOrders:Array.isArray(state.runningOrders)?state.runningOrders:[],completedOrders:Array.isArray(state.completedOrders)?state.completedOrders:[],settings:{...settings,...(state.settings||{}),categoryLayout:normalizeCategoryLayout(state.settings?.categoryLayout||settings.categoryLayout),catalog:{...settings.catalog,...(state.settings?.catalog||{})},cart:{...settings.cart,...(state.settings?.cart||{})},quickDrinks:{...settings.quickDrinks,...(state.settings?.quickDrinks||{})}},operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false,...(state.operations||{})},health:{...defaultHealth,...(state.health||{})}})});
    const QUICK_DRAWER_IDLE_MS=8000;
    let quickDrawerTimer=null;
    let recentTimer=null;
    let drinkFeedbackTimer=null;
    let pendingDrinkAssignment=null;
    let lastDrinkAssignment=null;
    let cartScrollTop=0;
    function scheduleQuickDrawerClose(){
      clearTimeout(quickDrawerTimer);
      if(!store.get().quickDrawerOpen)return;
      quickDrawerTimer=setTimeout(()=>store.setTransient(state=>({...state,quickDrawerOpen:false})),QUICK_DRAWER_IDLE_MS);
    }
    const queue=createRenderQueue(render);store.subscribe(state=>{queue.schedule();if(state.quickDrawerOpen)scheduleQuickDrawerClose();else clearTimeout(quickDrawerTimer);});
    installErrorBoundary({toast:showToast,report:error=>window.parent?.postMessage?.({type:'morefun:page-runtime-error',page:'order',message:String(error?.message||error)},'*')});
    
    function updateSettings(mutator){
      store.set(state=>{mutator(state.settings);writeJSON(SETTINGS_STORAGE_KEY,{...savedSettings,...state.settings,cartViewMode:state.cartViewMode});return state;});
    }
    function saveCartViewMode(mode){
      const cartViewMode=normalizeCartViewMode(mode);
      store.set(state=>({...state,cartViewMode,settings:{...state.settings,cart:{...state.settings.cart,viewMode:cartViewMode}}}));
      const persisted=readJSON(SETTINGS_STORAGE_KEY,{})||{};
      writeJSON(SETTINGS_STORAGE_KEY,{...persisted,cartViewMode,cart:{...(persisted.cart||{}),viewMode:cartViewMode}});
    }
    function orderedDrinks(){
      const configured=store.get().settings.quickDrinks.order||[];
      return [...configured,...drinks.map(item=>item.id).filter(id=>!configured.includes(id))].map(id=>drinkMap.get(id)).filter(Boolean);
    }
    function productTemplate(){return store.get().settings.catalog.defaultTemplate;}
    function drinkChoiceCard(d,action='select-drink',selected=false,context='default'){
      const imageMode=store.get().settings.quickDrinks.showImages!==false;
      return '<button class="drink-choice-card drink-card--'+context+' '+(imageMode?'is-image':'is-text')+' '+(selected?'selected':'')+'" data-action="'+action+'" data-id="'+d.id+'"><span>'+escapeHtml(d.name)+'</span>'+(imageMode?imageBlock(d.image,d.name,'drink-choice-img'):'')+'</button>';
    }
    function productCard(p){
      const template=productTemplate();const showCode=store.get().settings.catalog.showCode;const showDescription=store.get().settings.catalog.showDescription;
      const showProductImages=store.get().settings.catalog.showImages!==false;
      const action=store.get().quickMode?'quick-add-product':'open-product';
      const status=supplyStatus(p),unavailable=status!=='available',statusClass=status==='soldout'?'sold-out':status==='paused'?'paused':'';
      const code=showCode?'<small class="product-code">'+p.code+'</small>':'';
      const state=unavailable?'<em class="product-supply-state">'+supplyLabel(status)+'</em>':'';
      if(template==='text')return '<button class="product-card text '+statusClass+'" data-action="'+action+'" data-id="'+p.id+'" '+(unavailable?'disabled':'')+'><span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+state+'</span><b class="product-price">'+money(p.price)+'</b></button>';
      if(template==='small')return '<button class="product-card small '+statusClass+' '+(showProductImages?'':'no-product-image')+'" data-action="'+action+'" data-id="'+p.id+'" '+(unavailable?'disabled':'')+'>'+(showProductImages?imageBlock(p.image,p.name,'product-thumb'):'')+'<span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+state+'</span><b class="product-price">'+money(p.price)+'</b></button>';
      const description=showDescription&&p.description?'<p class="product-description">'+p.description+'</p>':'';
      return '<button class="product-card large '+statusClass+' '+(showProductImages?'':'no-product-image')+'" data-action="'+action+'" data-id="'+p.id+'" '+(unavailable?'disabled':'')+'>'+(showProductImages?imageBlock(p.image,p.name,'product-hero'):'')+'<div class="product-info"><span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+description+state+'</span><b class="product-price">'+money(p.price)+'</b></div></button>';
    }
    function cartLineRow(line,index,state){
      const showImages=state.settings.cart.showImages!==false;
      const recent=line.lineId===state.lastAffectedLineId;
      const override=Boolean(line.serviceModeOverride);
      const modeLabel=line.serviceMode===SERVICE_DINE_IN?'堂':'外';
      return '<article class="cart-row '+(showImages?'':'no-image')+' '+(recent?'is-recent':'')+'" data-line-id="'+escapeHtml(line.lineId)+'"><span class="seq-service"><span class="seq">'+(index+1)+'</span><button class="line-service-toggle '+(override?'is-override':'')+'" data-action="toggle-line-service" data-id="'+escapeHtml(line.lineId)+'" aria-label="切換'+escapeHtml(line.name)+'堂食外賣">'+modeLabel+'</button></span>'+(showImages?imageBlock(line.image,line.name,'cart-img'):'')+'<span class="cart-copy"><strong>'+escapeHtml(line.name)+'</strong><small>'+escapeHtml(describe(line))+'</small>'+(recent?'<em class="recent-badge">剛加入</em>':'')+'</span><b class="cart-price">'+money(line.total)+'</b><span class="cart-actions"><button data-action="cart-qty" data-id="'+line.lineId+'" data-delta="-1">−</button><strong>'+line.qty+'</strong><button data-action="cart-qty" data-id="'+line.lineId+'" data-delta="1">＋</button><button class="edit-button" data-action="edit-line" data-id="'+line.lineId+'">修改</button></span></article>';
    }
    function cartRows(){
      const state=store.get(),cart=cartForView(state.cart,state.cartViewMode);if(!cart.length)return '<div class="empty">購物車未有餐點</div>';
      if(state.cartViewMode===CART_VIEW_INPUT)return cart.map((line,index)=>cartLineRow(line,index,state)).join('');
      const grouped=new Map();cart.forEach(line=>{const category=line.category||productMap.get(line.productId)?.category||'其他';if(!grouped.has(category))grouped.set(category,[]);grouped.get(category).push(line);});
      let viewIndex=0;
      return [...grouped].map(([category,rows])=>{
        const collapsed=state.collapsedCartCategories.includes(category);
        const body=collapsed?'':rows.map(line=>cartLineRow(line,viewIndex++,state)).join('');
        if(collapsed)viewIndex+=rows.length;
        return '<section class="cart-category" data-category="'+escapeHtml(category)+'"><header><button class="cart-category-toggle" data-action="toggle-cart-category" data-value="'+escapeHtml(category)+'"><span>'+(collapsed?'▸':'▾')+'</span><strong>'+escapeHtml(category)+'</strong></button><span>'+rows.reduce((n,line)=>n+line.qty,0)+' 件</span></header>'+body+'</section>';
      }).join('');
    }
    function cartSummary(state){
      if(state.cartViewMode!==CART_VIEW_ORGANIZED||!state.cart.length)return '';
      const counts=new Map();cartForView(state.cart,CART_VIEW_ORGANIZED).forEach(line=>{const category=line.category||'其他';counts.set(category,(counts.get(category)||0)+Number(line.qty||0));});
      return '<div class="cart-summary-strip">'+[...counts].map(([category,count])=>'<span>'+escapeHtml(category)+' <b>'+count+'</b></span>').join('<span>｜</span>')+'</div>';
    }
    function findDrinkTarget(cart){return (cart||[]).find(line=>Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length)>0)||null;}
    function pendingArea(){
      const state=store.get();const required=pendingSummary(state.cart);const link=linkUpSummary(state.cart);
      return '<section class="pending-area '+(!required.total?'complete':'')+'"><button class="pending-receipt" data-action="open-completion"><strong>必選補齊</strong><span>'+(required.total?'尚欠 '+required.total+' 項':'全部完成')+'</span><b>整理</b></button><button data-action="linkup-all" data-count="'+link.count+'" '+(link.count?'':'disabled')+'>一鍵自動組合 '+link.count+'</button><button data-action="open-specified-link">指定配對</button></section>';
    }
    function quickDrinks(){
      const state=store.get();if(state.settings.quickDrinks.visible===false)return '';
      const order=orderedDrinks(),missing=pendingSummary(state.cart).drink,target=findDrinkTarget(state.cart);
      const context=(target||lastDrinkAssignment)?'<div class="quick-drink-context">'+(target?'<strong>正在補：'+escapeHtml(target.name)+'</strong>':'')+(lastDrinkAssignment?'<em>已配對：'+escapeHtml(lastDrinkAssignment.drink)+' → '+escapeHtml(lastDrinkAssignment.target)+'</em>':'')+'</div>':'';
      return '<section class="quick-drawer '+(state.quickDrawerOpen?'open':'')+'"><button class="quick-drawer-handle" data-action="toggle-quick-drawer"><span>快捷飲品</span><em>待補 '+missing+'</em><b>'+(state.quickDrawerOpen?'⌄':'⌃')+'</b></button>'+(state.quickDrawerOpen?'<div class="quick-drawer-panel"><header><strong>快捷飲品｜待補 '+missing+'</strong><button data-action="toggle-quick-drawer">×</button></header>'+context+'<div>'+order.filter(d=>d.available!==false).map(d=>drinkChoiceCard(d,'quick-drink',modal?.type==='drink'&&modal.drinkId===d.id,'drawer')).join('')+'</div></div>':'')+'</section>';
    }
    function operationLabel(state){if(state.operations.immediateStopped||!state.operations.acceptingOrders)return '已停止接單';if(state.operations.scheduledClose)return '接單至 '+state.operations.scheduledClose;return '接單中';}
    function healthIssueCount(state){return Object.values(state.health).filter(item=>!item.ok).length;}
    function pendingOrderCount(state){return Object.values(state.pendingOrders||{}).flat().length;}
    function topbar(){
      const state=store.get();const issues=healthIssueCount(state),pendingCount=pendingOrderCount(state),soldout=products.filter(item=>supplyStatus(item)!=='available').length;
      return renderGlobalStatusBar({terminalId,operationLabel:operationLabel(state),operationTone:state.operations.acceptingOrders&&!state.operations.immediateStopped?'online':'offline',lastOrder:latestOrderDisplayNumber([...readJSON(ORDER_HISTORY_STORAGE_KEY,[]),...activeDineOrderIdentities(readJSON(DINE_STORAGE_KEY,null))]),context:state.dineContext?'堂食｜'+state.dineContext.tableId+' 號枱':'',rightActions:'<button class="top-btn" data-action="toggle-pending-panel">待處理 <span class="badge">'+pendingCount+'</span></button><button class="top-btn" data-action="open-soldout">售罄 '+soldout+'</button><button class="top-btn quick-state '+(state.quickMode?'is-on':'is-off')+'" data-action="open-quick-settings">快捷 '+(state.quickMode?'ON':'OFF')+'</button><button class="top-btn health-button '+(issues?'has-error':'is-ok')+'" data-action="open-health"><span>'+(issues?'!':'✓')+'</span>'+(issues?'設備 '+issues:'設備正常')+'</button><button class="top-btn" data-action="open-settings">顯示設定</button>'});
    }
    function draftRows(selectedId=''){
      return drafts.map(d=>'<button class="draft-pick '+(selectedId===d.id?'selected':'')+'" data-action="select-draft" data-id="'+escapeHtml(d.id)+'"><strong>'+escapeHtml(d.draftNumber)+'</strong><small>'+new Date(d.createdAt).toLocaleTimeString('zh-HK',{hour:'2-digit',minute:'2-digit'})+'｜'+d.cart.reduce((n,l)=>n+Number(l.qty||0),0)+' 件｜'+money(cartTotal(d.cart))+'</small></button>').join('')||'<p class="receipt-empty">目前沒有暫存單</p>';
    }
    function tableGrid(){
      const dine=readJSON(DINE_STORAGE_KEY,null)||createInitialDineState(),tables=dine.tables;
      return tables.map(table=>{const minutes=table.status==='occupied'&&table.openedAt?Math.floor((Date.now()-table.openedAt)/60000):0;return '<button class="table-pick '+(table.status==='occupied'?'occupied':'free')+'" data-action="assign-table" data-id="'+escapeHtml(table.id)+'"><strong>'+(table.id==='戶外'?'戶外枱':table.id+' 號枱')+'</strong><small>'+(table.status==='occupied'?'使用中 '+minutes+' 分鐘':'未使用｜自動開枱')+'</small></button>';}).join('')||'<p class="receipt-empty">堂食枱資料未建立</p>';
    }
    function hangModal(){return '<aside class="modal-card order-transfer-card"><header><div><small>目前購物車 '+store.get().cart.reduce((n,l)=>n+l.qty,0)+' 件</small><strong>掛單／加入堂食</strong></div><button data-action="dismiss-modal">×</button></header><div class="transfer-grid"><section><h3>一般掛單</h3><div class="transfer-scroll">'+draftRows()+'</div><button class="save-draft-entry" data-action="add-draft">＋ 加入掛單</button></section><section><h3>堂食枱位｜九宮格</h3><p>撳枱號會立即正式落單、出製作單及所需標籤。</p><div class="table-pick-grid">'+tableGrid()+'</div></section></div><footer><button data-action="dismiss-modal">返回</button></footer></aside>';}
    function takeModal(){
      const selectedDraftId=modal.selectedDraftId||'';
      const selected=drafts.find(d=>d.id===selectedDraftId);
      const detail=selected?'<div class="draft-detail-head"><span><small>暫存編號</small><strong>'+escapeHtml(selected.draftNumber)+'</strong></span><span><small>建立時間</small><strong>'+new Date(selected.createdAt).toLocaleTimeString('zh-HK',{hour:'2-digit',minute:'2-digit'})+'</strong></span><span><small>合計</small><strong>'+money(cartTotal(selected.cart))+'</strong></span></div><div class="draft-detail-lines">'+selected.cart.map((line,index)=>'<article><b>'+(index+1)+'</b><span><strong>'+escapeHtml(line.name)+' ×'+line.qty+'</strong><small>'+escapeHtml(describe(line))+'</small></span><em>'+money(line.total)+'</em></article>').join('')+'</div>':'<div class="draft-empty-detail"><b>請選擇左邊暫存單</b><p>右邊會顯示完整餐點內容，確認後先取回。</p></div>';
      return '<aside class="modal-card order-transfer-card take-card"><header><div><small>目前終端 '+terminalId+'</small><strong>取單</strong></div><button data-action="dismiss-modal">×</button></header><div class="transfer-grid"><section><h3>暫存單列表</h3><div class="transfer-scroll">'+draftRows(selectedDraftId)+'</div></section><section><h3>暫存單內容</h3>'+detail+'</section></div><footer><button data-action="dismiss-modal">返回</button><span></span><button class="danger" data-action="void-draft" '+(selected?'':'disabled')+'>作廢</button><button class="primary" data-action="restore-draft" data-id="'+escapeHtml(selected?.id||'')+'" '+(selected?'':'disabled')+'>取單</button></footer></aside>';
    }
    function pendingPanel(){
      const pendingOrders=store.get().pendingOrders;
      const rows=list=>list.map(x=>'<button data-action="process-pending-order" data-id="'+x.id+'"><span><strong>'+x.id+' · '+x.source+'</strong><small>'+x.contact+'</small></span><b>'+x.items+' 件 · '+money(x.amount)+'</b><small>等待 '+x.wait+' · 按下處理</small></button>').join('');
      return '<aside class="pending-panel modal-card"><header><strong>待處理</strong><button data-action="dismiss-modal">×</button></header><div class="pending-split"><section><h3>磨飯 App／網頁訂單</h3><div class="pending-scroll">'+rows(pendingOrders.online)+'</div></section><section><h3>電話／WhatsApp 排隊單</h3><div class="pending-scroll">'+rows(pendingOrders.queue)+'</div></section></div><footer class="single-action"><button data-action="dismiss-modal">返回</button></footer></aside>';
    }
    function pendingDetailModal(){
      const x=modal.order;
      return '<aside class="pending-panel modal-card"><header><div><small>'+x.source+'</small><strong>'+x.id+' · '+x.contact+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="pending-order-detail"><span>產品數量 <b>'+x.items+' 件</b></span><span>訂單金額 <b>'+money(x.amount)+'</b></span><span>等候時間 <b>'+x.wait+'</b></span><span>付款狀態 <b>'+x.paymentStatus+'</b></span><p>開始核對後會顯示完整產品、金額及付款證明；此時仍未正式接單。</p></div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="start-pending-review">開始核對</button></footer></aside>';
    }
    function pendingReviewModal(){
      const x=modal.order;const whatsapp=createWhatsAppLink(x.phone,(x.contact||'客人')+'，你好。磨飯訂單 '+x.id+' 正在核對中，請回覆或補充付款證明，謝謝。');
      const lines=(x.lines||[]).map(line=>'<div><span>'+escapeHtml(line[0])+' ×'+line[1]+'</span><b>'+money(line[2])+'</b></div>').join('');
      const proof=x.proof?'<button class="payment-proof" data-action="enlarge-proof">'+imageBlock(x.proof,'付款證明','payment-proof-image')+'<span>按下放大付款證明</span></button>':'<div class="payment-proof empty"><strong>尚未收到付款證明</strong><span>請用右方 WhatsApp QR Code 聯絡客人</span></div>';
      return '<aside class="pending-review-card modal-card"><header><div><small>'+x.source+' · 訂單核對</small><strong>'+x.id+' · '+x.contact+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="pending-review-body"><section class="review-order"><div class="review-summary"><span>產品 <b>'+x.items+' 件</b></span><span>總額 <b>'+money(x.amount)+'</b></span><span>付款 <b>'+x.paymentMethod+'</b></span></div><div class="review-lines">'+lines+'</div><div class="payment-status"><span>付款狀態</span><strong>'+x.paymentStatus+'</strong></div>'+proof+'</section><aside class="whatsapp-qr"><strong>WhatsApp QR Code</strong><p>公司電話掃描後，直接開啟客人對話及預設訊息。</p><div class="qr-code" data-qr="'+escapeHtml(whatsapp)+'"></div><a href="'+escapeHtml(whatsapp)+'" target="_blank" rel="noopener">在此裝置開啟 WhatsApp</a></aside></div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button data-action="report-payment-issue">資料有問題</button><button class="primary" data-action="accept-pending-order" '+(x.proof?'':'disabled')+'>確認接單</button></footer></aside>';
    }
    function enlargedProofModal(){const x=modal.order;return '<aside class="proof-lightbox modal-card"><header><strong>'+x.id+' · 付款證明</strong><button data-action="back-to-pending-review">×</button></header>'+imageBlock(x.proof,'付款證明放大圖','proof-full')+'<footer class="right-action"><button data-action="back-to-pending-review">返回核對</button></footer></aside>';}
    function modalScrim(){return modal?'<div class="modal-scrim" aria-hidden="true"></div>':'';}
    function quickSettingsModal(){
      const state=store.get();const q=state.settings.quickDrinks;
      const order=orderedDrinks();
      return '<aside class="side-card modal-card quick-mode-card"><header><strong>快捷模式</strong><button data-action="dismiss-modal">×</button></header><div class="card-scroll"><div class="setting-block"><strong>點單模式</strong><div class="segmented"><button class="'+(!state.quickMode?'active':'')+'" data-action="set-order-mode" data-value="normal">普通模式</button><button class="'+(state.quickMode?'active':'')+'" data-action="set-order-mode" data-value="quick">快捷模式</button></div><small>快捷模式：點產品直接加入購物籃</small></div><div class="setting-row"><div><strong>快捷飲品抽屜</strong><small>平時收起，按下向上展開</small></div><button class="switch '+(q.visible!==false?'on':'')+'" data-action="toggle-quick-drink-strip"><i></i></button></div><div class="setting-block"><strong>飲品卡顯示</strong><div class="segmented"><button class="'+(q.showImages!==false?'active':'')+'" data-action="quick-display" data-value="image">圖片</button><button class="'+(q.showImages===false?'active':'')+'" data-action="quick-display" data-value="text">純文字</button></div></div><div class="setting-block"><strong>飲品排列</strong><div class="quick-order-list">'+order.map((d,index)=>'<div><span><b>'+(index+1)+'</b>'+escapeHtml(d.name)+'</span><span><button data-action="move-quick-drink" data-id="'+d.id+'" data-delta="-1" '+(!index?'disabled':'')+'>↑</button><button data-action="move-quick-drink" data-id="'+d.id+'" data-delta="1" '+(index===order.length-1?'disabled':'')+'>↓</button></span></div>').join('')+'</div></div><div class="setting-row"><div><strong>快捷補選</strong><small>只控制待補飲品快捷套用</small></div><button class="switch '+(q.quickAssist!==false?'on':'')+'" data-action="toggle-quick-assist"><i></i></button></div></div></aside>';
    }
    function settingsModal(){
      const state=store.get();const c=state.settings.catalog,w=Number(state.settings.cart.widthPercent||32);
      return '<aside class="side-card modal-card"><header><strong>顯示設定</strong><button data-action="dismiss-modal">×</button></header><div class="setting-block"><strong>購物籃比例</strong><div class="segmented three">'+[25,30,32].map(x=>'<button data-action="cart-width" data-value="'+x+'" class="'+(w===x?'active':'')+'">'+x+' / '+(100-x)+'</button>').join('')+'</div></div><div class="setting-row"><div><strong>顯示購物車產品圖片</strong><small>關閉後保留名稱、描述、價格與操作</small></div><button class="switch '+(state.settings.cart.showImages!==false?'on':'')+'" data-action="toggle-cart-images"><i></i></button></div><div class="setting-block"><strong>產品卡</strong><div class="segmented three"><button data-action="setting-card" data-value="large" class="'+(c.defaultTemplate==='large'?'active':'')+'">大圖</button><button data-action="setting-card" data-value="small" class="'+(c.defaultTemplate==='small'?'active':'')+'">小圖</button><button data-action="setting-card" data-value="text" class="'+(c.defaultTemplate==='text'?'active':'')+'">純文字</button></div></div><div class="setting-row"><div><strong>顯示產品 Code</strong><small>例如 F4、B1、S1</small></div><button class="switch '+(c.showCode?'on':'')+'" data-action="toggle-code"><i></i></button></div></aside>';
    }
    function healthModal(){const state=store.get();return '<aside class="side-card modal-card"><header><strong>系統狀態</strong><button data-action="dismiss-modal">×</button></header><div class="health-list">'+Object.values(state.health).map(item=>'<div class="health-row '+(item.ok?'ok':'bad')+'"><span>'+(item.ok?'✓':'!')+'</span><div><strong>'+item.label+'</strong><small>'+item.detail+'</small></div><b>'+(item.ok?'正常':'異常')+'</b></div>').join('')+'</div></aside>';}
    function statusModal(){
      const state=store.get(),ops=state.operations;
      return '<aside class="side-card modal-card"><header><strong>今日接單狀態</strong><button data-action="dismiss-modal">×</button></header><div class="setting-row"><div><strong>接受網絡／預約訂單</strong><small>'+operationLabel(state)+'</small></div><button class="switch '+(ops.acceptingOrders&&!ops.immediateStopped?'on':'')+'" data-action="toggle-accepting"><i></i></button></div><div class="setting-block"><label>今日停止接單時間</label><div class="time-row"><input id="scheduled-close" type="time" value="'+(ops.scheduledClose||'')+'"><button data-action="save-close-time">儲存</button></div></div><div class="setting-block"><button class="danger wide" data-action="immediate-stop">即時停止接單</button><button class="wide" data-action="resume-orders">恢復接單</button></div></aside>';
    }
    function soldoutModal(){
      const items=products.filter(item=>supplyStatus(item)!=='available');
      return '<aside class="side-card modal-card soldout-preview"><header><strong>售罄列表</strong><button data-action="dismiss-modal">×</button></header><div class="status-list">'+(items.length?items.map(item=>{const status=supplyStatus(item);return '<div class="'+status+'"><span><b>'+escapeHtml([item.code,item.name].filter(Boolean).join(' '))+'</b><small>'+escapeHtml(item.category||'未分類')+'</small></span><em>'+supplyLabel(supplyStatus(item))+'</em></div>';}).join(''):'<div><span><b>目前全部供應中</b><small>售罄管理頁更新後會即時顯示</small></span></div>')+'</div><footer class="right-action"><button data-action="dismiss-modal">返回</button></footer></aside>';
    }
    function pairingGroupCount(cart){
      const available=cart.filter(line=>line.lineType!=='combo'&&!line.linkedComboId),mains=available.filter(line=>line.combinable).reduce((n,line)=>n+line.qty,0),snacks=available.filter(line=>line.linkRole==='snack').reduce((n,line)=>n+line.qty,0);
      return Math.min(26,mains,snacks);
    }
    function specifiedLinkModal(){
      const available=store.get().cart.filter(line=>line.lineType!=='combo'&&!line.linkedComboId),groups=modal.draft.groups,active=Math.min(modal.draft.active,groups.length-1),current=groups[active]||{main:'',snack:'',drink:''};
      const roles=[['main','飯團／主餐',line=>line.combinable],['snack','小食',line=>line.linkRole==='snack']];
      const selectedCount=(lineId,role)=>groups.reduce((n,group)=>n+(group[role]===lineId?1:0),0),ready=groups.filter(group=>group.main&&group.snack).length;
      const cartDrinks=available.filter(line=>line.linkRole==='drink');
      const drinkCards='<section><strong>3. 飲品 <small>可稍後補選</small></strong><div class="link-candidates drink-link-candidates">'+drinks.map(d=>'<button data-action="select-link-drink" data-source="quick" data-id="quick:'+d.id+'" class="'+(current.drink==='quick:'+d.id?'selected':'')+'"><span>'+escapeHtml(d.name)+'</span><small>快捷飲品</small></button>').join('')+cartDrinks.map(line=>{const used=selectedCount(line.lineId,'drink'),selected=current.drink===line.lineId,full=used>=line.qty&&!selected;return '<button data-action="select-link-drink" data-source="cart" data-id="'+line.lineId+'" class="'+(selected?'selected':'')+'" '+(full?'disabled':'')+'><span>'+escapeHtml(line.name)+'</span><small>購物車 '+Math.max(0,line.qty-used+(selected?1:0))+'／'+line.qty+'</small></button>';}).join('')+'</div></section>';
      return '<aside class="side-card modal-card specified-link-card"><header><div><small>動態指定配對</small><strong>建立 '+groups.length+' 組套餐</strong></div><button data-action="dismiss-modal">×</button></header><div class="pairing-group-tabs">'+groups.map((group,index)=>{const ok=group.main&&group.snack;return '<button data-action="select-pairing-group" data-index="'+index+'" class="'+(index===active?'active ':'')+(ok?'complete':'')+'"><b>'+String.fromCharCode(65+index)+'</b><small>'+(ok?(group.drink?'完成':'欠飲品'):'待選')+'</small></button>';}).join('')+'</div><div class="card-scroll pairing-body"><p>選擇 '+String.fromCharCode(65+active)+' 組主餐及小食即可建立套餐；飲品可直接用快捷飲品或稍後補選。</p>'+roles.map(([role,label,filter],index)=>'<section><strong>'+(index+1)+'. '+label+'</strong><div class="link-candidates">'+available.filter(filter).map(line=>{const used=selectedCount(line.lineId,role),selected=current[role]===line.lineId,full=used>=line.qty&&!selected;return '<button data-action="select-link-item" data-role="'+role+'" data-id="'+line.lineId+'" class="'+(selected?'selected':'')+'" '+(full?'disabled':'')+'><span>'+escapeHtml(line.name)+'</span><small>可用 '+Math.max(0,line.qty-used+(selected?1:0))+'／'+line.qty+'</small></button>';}).join('')+'</div></section>').join('')+drinkCards+'</div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-specified-link" '+(ready?'':'disabled')+'>確認組合 '+ready+' 組</button></footer></aside>';
    }
    function comboEditorModal(){
      const line=store.get().cart.find(item=>item.lineId===modal.lineId),draft=modal.draft;
      if(!line)return '';
      const components=draft.components||[],selected=role=>components.find(item=>item.role===role);
      const withCurrent=(items,role)=>{const current=selected(role);return current&&!items.some(item=>item.id===current.productId)?[{id:current.productId,name:current.name,image:current.image,price:current.unitPrice},...items]:items;};
      const candidates={main:withCurrent(products.filter(item=>item.combinable),'main'),snack:withCurrent(snackProducts,'snack'),drink:withCurrent(drinks,'drink')};
      const roleCard=(role,label,index)=>'<section class="combo-role"><header><strong>'+index+'. '+label+'</strong>'+(role==='drink'?'<button data-action="clear-combo-component">稍後補選</button>':'')+'</header><div class="combo-candidates">'+candidates[role].map(item=>{const id=item.id,active=selected(role)?.productId===id;return '<button data-action="select-combo-component" data-role="'+role+'" data-id="'+id+'" class="'+(active?'selected':'')+'"><span>'+escapeHtml(item.name)+'</span><small>'+money(item.price||0)+'</small></button>';}).join('')+'</div></section>';
      const missing=!selected('drink');
      return '<aside class="product-settings-card modal-card combo-editor-card"><header class="settings-product-head"><div><small>修改套餐</small><h2>'+escapeHtml(line.name)+'</h2><strong>'+money(line.total)+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="product-settings-body card-scroll"><p class="combo-help">飯團、小食及飲品會以一張套餐顯示；飲品可以稍後由快捷飲品補選。</p>'+roleCard('main','飯團／主餐',1)+roleCard('snack','小食',2)+roleCard('drink','飲品',3)+'</div><footer class="product-settings-actions combo-actions"><button class="danger" data-action="request-dissolve-combo">拆開套餐</button><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-combo-edit">確認修改</button></footer>'+(missing?'<p class="missing-hint">尚欠：飲品 1 份</p>':'')+'</aside>';
    }
    function requiredGroupLabel(group){return {rice:'飯底',sauce:'醬汁',snack:'小食',drink:'飲品'}[group]||'必選';}
    function requiredTargets(cart,group){
      const targets=[];
      (cart||[]).forEach((line,lineIndex)=>{
        if(!(line.required||[]).includes(group))return;
        if(group==='drink'){
          const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
          for(let unitIndex=0;unitIndex<missing;unitIndex++)targets.push({id:line.lineId+':drink:'+unitIndex,lineId:line.lineId,lineIndex,unitIndex,name:line.name,qty:line.qty});
          return;
        }
        if(line.options?.[group])return;
        for(let unitIndex=0;unitIndex<Math.max(1,Number(line.qty||1));unitIndex++)targets.push({id:line.lineId+':'+group+':'+unitIndex,lineId:line.lineId,lineIndex,unitIndex,name:line.name,qty:line.qty});
      });
      return targets;
    }
    function completionDraft(group=''){
      const current=modal?.draft||{};
      if(!group)return {...current,activeGroup:'',activeTarget:'',assignments:current.assignments||{}};
      const targets=requiredTargets(store.get().cart,group),assignments=current.activeGroup===group?(current.assignments||{}):{};
      const activeTarget=(current.activeGroup===group&&targets.some(target=>target.id===current.activeTarget))?current.activeTarget:(targets.find(target=>!assignments[target.id])?.id||targets[0]?.id||'');
      return {activeGroup:group,activeTarget,assignments};
    }
    function completionTargetLabel(target){return String(target.lineIndex+1).padStart(2,'0')+'｜'+escapeHtml(target.name)+(target.qty>1?'｜第 '+(target.unitIndex+1)+' 份':'');}
    function requiredSelectionPanel(group){
      const draft=completionDraft(group);modal.draft=draft;
      const targets=requiredTargets(store.get().cart,group),assignments=draft.assignments||{},active=targets.find(target=>target.id===draft.activeTarget)||targets[0];
      const done=targets.filter(target=>assignments[target.id]).length,label=requiredGroupLabel(group);
      const targetHtml=targets.map(target=>'<button class="required-target '+(target.id===active?.id?'active ':'')+(assignments[target.id]?'complete':'')+'" data-action="completion-target" data-id="'+escapeHtml(target.id)+'"><span><b>'+completionTargetLabel(target)+'</b><small>'+(assignments[target.id]?'已選：'+escapeHtml(group==='drink'?(drinkMap.get(assignments[target.id])?.name||assignments[target.id]):assignments[target.id]):'尚未選擇')+'</small></span><em>'+(assignments[target.id]?'✓':'待選')+'</em></button>').join('');
      const drinkAssignmentCounts=new Map();
      if(group==='drink')Object.values(assignments).forEach(id=>{if(id)drinkAssignmentCounts.set(id,(drinkAssignmentCounts.get(id)||0)+1);});
      let choices='';
      if(group==='drink')choices='<div class="required-drink-grid">'+drinks.filter(item=>item.available!==false).map(item=>{const count=drinkAssignmentCounts.get(item.id)||0;return '<button data-action="completion-required-choice" data-value="'+escapeHtml(item.id)+'" class="'+(active&&assignments[active.id]===item.id?'selected ':'')+(count?'has-assignment':'')+'" aria-label="'+escapeHtml(item.name)+(count?'，已選 '+count+' 份':'')+'">'+imageBlock(item.image,item.name,'required-choice-img')+'<span>'+escapeHtml(item.name)+'</span>'+(count?'<em class="drink-choice-count">✓ '+count+'</em>':'')+'</button>';}).join('')+'</div>';
      else choices='<div class="required-option-grid">'+(optionSets[group]||[]).map(value=>'<button data-action="completion-required-choice" data-value="'+escapeHtml(value)+'" class="'+(active&&assignments[active.id]===value?'selected':'')+'">'+escapeHtml(value)+'</button>').join('')+'</div>';
      const selected=active?assignments[active.id]:'';
      return '<div class="required-workflow-head"><div><small>必須完成｜'+label+'</small><strong>已分配 '+done+' / '+targets.length+'</strong><span>每一份都會顯示指定結果，避免配錯餐點。</span></div><button data-action="completion-back">返回必選總覽</button></div><div class="required-workflow-grid"><section class="required-target-pane"><h3>要補選嘅餐點</h3><div class="required-target-list">'+targetHtml+'</div></section><section class="required-choice-pane"><div class="required-active-target"><small>目前指定</small><strong>'+(active?completionTargetLabel(active):'已完成')+'</strong><span>'+(selected?'目前：'+escapeHtml(group==='drink'?(drinkMap.get(selected)?.name||selected):selected):'請選擇 '+label)+'</span></div>'+choices+(selected&&done<targets.length?'<button class="required-fill" data-action="completion-fill-remaining" data-value="'+escapeHtml(selected)+'">其餘未選全部用同一選項</button>':'')+'</section></div><footer class="required-workflow-actions"><button data-action="completion-back">返回</button><button class="primary" data-action="apply-required-group" '+(done===targets.length&&targets.length?'':'disabled')+'>確認 '+label+'｜'+done+' 份</button></footer>';
    }
    function splitLineForRequired(line,group,values){
      if(!values.length)return [line];
      if(values.every(value=>value===values[0]))return [{...line,options:{...(line.options||{}),[group]:values[0]}}];
      const qty=Math.max(1,Number(line.qty||1)),slotsPerUnit=qty?Math.max(0,Math.round(Number(line.drinkSlots||0)/qty)):0,drinkAssignments=[...(line.drinkAssignments||[])];
      return values.map((value,index)=>({...line,lineId:index===0?line.lineId:stableId('line'),qty:1,total:Number(line.unitPrice||0),options:{...(line.options||{}),[group]:value},drinkSlots:slotsPerUnit,drinkAssignments:slotsPerUnit?drinkAssignments.slice(index*slotsPerUnit,(index+1)*slotsPerUnit):[],createdOrder:Number(line.createdOrder||0)+(index*0.0001)}));
    }
    function applyRequiredGroup(){
      const group=modal?.draft?.activeGroup;if(!group)return;
      const targets=requiredTargets(store.get().cart,group),assignments=modal.draft.assignments||{};
      if(targets.some(target=>!assignments[target.id])){showToast('仲有必選項未完成');return;}
      store.set(state=>{
        if(group==='drink'){
          const byLine=new Map();targets.forEach(target=>{if(!byLine.has(target.lineId))byLine.set(target.lineId,[]);byLine.get(target.lineId).push(assignments[target.id]);});
          state.cart=state.cart.map(line=>{const ids=byLine.get(line.lineId);if(!ids)return line;return {...line,drinkAssignments:(line.drinkAssignments||[]).concat(ids.map(id=>drinkSelection(id)))};});
        }else{
          const byLine=new Map();targets.forEach(target=>{if(!byLine.has(target.lineId))byLine.set(target.lineId,[]);byLine.get(target.lineId).push(assignments[target.id]);});
          state.cart=state.cart.flatMap(line=>{const values=byLine.get(line.lineId);return values?splitLineForRequired(line,group,values):[line];});
        }
        state.lastAffectedLineId=targets.at(-1)?.lineId||'';state.lastMutationKind='changed';return state;
      });
      modal={type:'completion',dirty:false,draft:{activeGroup:'',activeTarget:'',assignments:{}}};queue.afterRender(()=>showToast(requiredGroupLabel(group)+'已完成'));
    }
    function completionModal(){
      const state=store.get(),required=pendingSummary(state.cart),link=linkUpSummary(state.cart);
      if(modal?.draft?.activeGroup)return '<aside class="completion-card modal-card required-workflow"><header><div><small>結帳前必須完成</small><strong>快速補選</strong></div><button data-action="dismiss-modal">×</button></header>'+requiredSelectionPanel(modal.draft.activeGroup)+'</aside>';
      return '<aside class="completion-card modal-card"><header><div><small>結帳前檢查</small><strong>必選快速補齊</strong></div><button data-action="dismiss-modal">×</button></header><div class="completion-section required"><div><small>必須完成</small><strong>'+(required.total?'共欠 '+required.total+' 項':'全部完成')+'</strong><span>只處理會阻礙結帳嘅必選；普通口味修改仍然喺產品「修改」處理。</span></div>'+['rice','sauce','snack','drink'].filter(k=>required[k]).map(k=>'<button data-action="complete-group" data-group="'+k+'"><span>'+requiredGroupLabel(k)+'</span><b>'+required[k]+' 份</b><em>快速分配</em></button>').join('')+'</div><div class="completion-section optional"><div><small>普通修改</small><strong>唔影響結帳</strong><span>走青瓜、走蔥、少辣等，請由對應產品「修改」卡處理。</span></div></div><div class="completion-section linkup"><div><small>可組合套餐</small><strong>'+link.count+' 份</strong><span>飯團 '+link.riceballs+'｜小食 '+link.snacks+'｜飲品 '+link.drinks+'</span></div>'+(link.count?'<button class="primary" data-action="linkup-all" data-count="'+link.count+'">一鍵組合</button>':'')+'</div></aside>';
    }
    function optionButtons(group,values,selected,multi=false){return '<div class="option-chips">'+values.map(value=>'<button data-action="detail-option" data-group="'+group+'" data-value="'+escapeHtml(value)+'" data-multi="'+multi+'" class="'+((multi?selected.includes(value):selected===value)?'selected':'')+'">'+escapeHtml(value)+'</button>').join('')+'</div>';}
    function detailGroups(product,draft){
      const rows=[];
      if(product.required.includes('rice'))rows.push('<section><header><strong>飯底</strong><span class="required-tag">必選</span></header>'+optionButtons('rice',optionSets.rice,draft.options.rice||'')+'</section>');
      if(product.required.includes('sauce'))rows.push('<section><header><strong>醬汁</strong><span class="required-tag">必選</span></header>'+optionButtons('sauce',optionSets.sauce,draft.options.sauce||'')+'</section>');
      rows.push('<section><header><strong>飯量／份量</strong><span>可選</span></header>'+optionButtons('portion',['少飯','標準','多飯','加飯 +$5'],draft.options.portion||'標準')+'</section>');
      rows.push('<section><header><strong>口味調整</strong><span>可多選</span></header>'+optionButtons('taste',['走蔥','少辣','走蒜','走香菜','不要花生'],draft.options.taste||[],true)+'</section>');
      if(product.required.includes('snack'))rows.push('<section><header><strong>套餐小食</strong><span class="required-tag">必選</span></header>'+optionButtons('snack',optionSets.snack,draft.options.snack||'')+'</section>');
      if(product.combinable)rows.push('<section class="upgrade-section"><header><strong>升級飯團套餐</strong><span>可補選</span></header><p>小食及飲品都選擇後，會直接組合成飯團套餐。</p>'+optionButtons('snack',optionSets.snack,draft.options.snack||'')+'</section>');
      if(product.required.includes('drink')||product.combinable)rows.push('<section><header><strong>'+(product.required.includes('drink')?'套餐飲品':'加配飲品')+'</strong><span class="'+(product.required.includes('drink')?'required-tag':'')+'">'+(product.required.includes('drink')?'必選':'可補選')+'</span></header><div class="detail-drinks">'+drinks.map(d=>drinkChoiceCard(d,'detail-drink',draft.drink?.drinkId===d.id,'detail')).join('')+'</div></section>');
      rows.push('<section><header><strong>備註</strong><span>可選</span></header><textarea data-action="detail-note" maxlength="80" placeholder="例如：醬汁分開、謝謝">'+escapeHtml(draft.note||'')+'</textarea></section>');
      return rows.join('');
    }
    function productDetailModal(){
      const {productId,draft}=modal;const p=productMap.get(productId);const missing=[];
      p.required.forEach(group=>{if(group==='drink'){if(!draft.drink)missing.push('飲品');}else if(!draft.options[group])missing.push(group==='rice'?'飯底':group==='sauce'?'醬汁':'小食');});
      const subtotal=p.price*draft.qty;
      return '<aside class="product-settings-card modal-card" data-editing="'+Boolean(modal.editLineId)+'"><header class="settings-product-head"><div><small>'+(modal.editLineId?'修改產品':'新增產品')+'</small><h2>'+p.name+'</h2><strong>'+money(p.price)+'</strong></div><button data-action="dismiss-modal" aria-label="返回">×</button></header><div class="product-settings-body"><div class="qty-row"><span>數量</span><button data-action="detail-qty" data-delta="-1">−</button><strong>'+draft.qty+'</strong><button data-action="detail-qty" data-delta="1">＋</button></div>'+detailGroups(p,draft)+'</div><footer class="product-settings-actions"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-product" '+(missing.length?'disabled':'')+'>確認 '+money(subtotal)+'</button></footer>'+(missing.length?'<p class="missing-hint">還欠：'+missing.join('、')+'</p>':'')+'</aside>';
    }
    function drinkModifierModal(){
      const d=drinkMap.get(modal.drinkId),draft=modal.draft;
      const groups=draft.groups||[];const total=draft.qty+groups.reduce((n,g)=>n+g.qty,0);
      return '<aside class="modifier-card modal-card"><header><strong>'+d.name+'</strong><button data-action="dismiss-modal">×</button></header><div class="drink-base-qty"><span>正常</span><span><button data-action="modifier-qty" data-delta="-1">−</button><b>'+draft.qty+'</b><button data-action="modifier-qty" data-delta="1">＋</button></span></div><div class="drink-groups">'+groups.map((g,index)=>'<section class="drink-group '+(g.open?'open':'')+'"><header><button class="group-summary" data-action="toggle-drink-adjustment" data-index="'+index+'">'+([g.sweetness,g.ice].filter(Boolean).join('・')||'選擇調整')+' ×'+g.qty+'</button><span><button data-action="group-qty" data-index="'+index+'" data-delta="-1">−</button><b>'+g.qty+'</b><button data-action="group-qty" data-index="'+index+'" data-delta="1">＋</button></span></header>'+(g.open?'<div class="adjustment-options">'+(d.sweet?optionButtons('group-sweetness-'+index,['多甜','少甜','走甜'],g.sweetness||''):'')+(d.ice?optionButtons('group-ice-'+index,['少冰','多冰'],g.ice||''):'')+'</div>':'')+'</section>').join('')+'</div><button data-action="add-drink-group" class="add-group">＋ 新增調整</button><button class="primary wide" data-action="apply-drink" '+(total?'':'disabled')+'>套用 '+total+' 份</button></aside>';
    }
    function searchModal(){const query=store.get().searchQuery;return '<aside class="side-card modal-card search-card"><header><div><small>產品搜尋</small><strong>名稱或編號</strong></div><button data-action="dismiss-modal">×</button></header><div class="search-field"><input autofocus data-action="search-query" value="'+escapeHtml(query)+'" placeholder="例如：F4、雞絲、奶茶"><button data-action="clear-search" '+(query?'':'disabled')+'>清除</button></div><p>搜尋結果會即時顯示；分類排序及供應狀態仍然保留。</p></aside>';}
    function categoryButton(cat,state){return '<button data-action="category" data-value="'+escapeHtml(cat)+'" class="'+(cat===state.category?'active':'')+'">'+escapeHtml(cat)+'</button>';}
    function categoryBar(state){
      const categoryLayout=buildCategoryLayout(categories,state.settings.categoryLayout);
      const pages=categoryLayout.pages.map((items,index)=>'<div class="category-page" aria-label="分類第 '+(index+1)+' 頁">'+items.map(cat=>categoryButton(cat,state)).join('')+(categoryLayout.showSearch?'<span class="category-search-reserved" aria-hidden="true"></span>':'')+'</div>').join('');
      return '<div class="category-shell" style="--category-columns:'+categoryLayout.columns+';--category-rows:'+categoryLayout.rows+'"><nav class="category-scroll">'+pages+'</nav>'+(categoryLayout.overflow.length?'<span class="category-overflow">可左右滑動查看更多分類</span>':'')+(categoryLayout.showSearch?'<button class="category-search '+(state.searchQuery?'active':'')+'" data-action="open-search" aria-label="搜尋產品">⌕<small>'+(state.searchQuery?'搜尋中':'搜尋')+'</small></button>':'')+'</div>';
    }
    function customConfirm(){
      const notice=newOrderNotice?.visible?'<aside class="new-order-toast"><div><small>'+newOrderNotice.source+' 新訂單</small><strong>'+newOrderNotice.id+'</strong><span>'+newOrderNotice.items+' 件 · '+money(newOrderNotice.amount)+'</span></div><button data-action="later-new-order">稍後處理</button><button class="primary" data-action="process-new-order">立即處理</button></aside>':'';
      if(!confirmState)return notice;
      if(confirmState.kind==='modal-exit')return notice+'<div class="confirm-layer"><section class="confirm-card"><strong>'+confirmState.title+'</strong><p>'+confirmState.message+'</p><div><button data-action="confirm-cancel">繼續調整</button><button class="danger" data-action="confirm-discard">退出不保存</button><button class="primary" data-action="confirm-save-exit" '+(confirmState.saveAction?'':'disabled')+'>保存並退出</button></div></section></div>';
      const dissolve=confirmState.kind==='dissolve',dineCancel=confirmState.kind==='dine-cancel';
      return notice+'<div class="confirm-layer"><section class="confirm-card"><strong>'+confirmState.title+'</strong><p>'+confirmState.message+'</p><div><button data-action="confirm-cancel">'+(dissolve?'返回套餐':dineCancel?'繼續點單':'繼續修改')+'</button><button class="danger" data-action="'+(dissolve?'confirm-dissolve':dineCancel?'confirm-dine-cancel':'confirm-discard')+'">'+(dissolve?'確認拆開':dineCancel?'取消今次點單':'放棄修改')+'</button></div></section></div>';
    }
    function activeModal(){
      if(!modal)return '';
      if(modal.type==='quick')return quickSettingsModal();
      if(modal.type==='settings')return settingsModal();
      if(modal.type==='health')return healthModal();
      if(modal.type==='status')return statusModal();
      if(modal.type==='soldout')return soldoutModal();
      if(modal.type==='hang')return hangModal();
      if(modal.type==='take')return takeModal();
      if(modal.type==='specified-link')return specifiedLinkModal();
      if(modal.type==='combo')return comboEditorModal();
      if(modal.type==='completion')return completionModal();
      if(modal.type==='product')return productDetailModal();
      if(modal.type==='drink')return drinkModifierModal();
      if(modal.type==='search')return searchModal();
      if(modal.type==='pending')return pendingPanel();
      if(modal.type==='pending-detail')return pendingDetailModal();
      if(modal.type==='pending-review')return pendingReviewModal();
      if(modal.type==='proof')return enlargedProofModal();
      return '';
    }
    function anchorRect(button){const r=button?.getBoundingClientRect?.();return r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}:null;}
    function actionAnchor(button,override=null){return override||anchorRect(button);}
    function positionActiveCard(){
      const card=document.querySelector('.side-card,.product-settings-card,.modifier-card,.pending-panel,.pending-review-card,.proof-lightbox');const a=modal?.anchor;if(!card||!a)return;
      const topbarRect=document.querySelector('.topbar')?.getBoundingClientRect(),bottomNavRect=document.querySelector('.bottom-nav')?.getBoundingClientRect();
      const cartRect=document.querySelector('.cart')?.getBoundingClientRect();
      if(modal?.type==='pending'&&cartRect)card.style.maxHeight=Math.min(cartRect.height,(bottomNavRect?.top||innerHeight)-(topbarRect?.bottom||0)-32)+'px';
      const gap=14,w=card.offsetWidth,h=card.offsetHeight,margin=16,minTop=(topbarRect?.bottom||0)+margin,maxBottom=(bottomNavRect?.top||innerHeight)-margin;
      const room={top:a.top-minTop,bottom:maxBottom-a.bottom,left:a.left-margin,right:innerWidth-margin-a.right};
      let side,left,top;
      if(a.top<minTop+90){side='top';left=a.left+a.width/2-w/2;top=a.bottom+gap;}
      else if(a.bottom>maxBottom-110){side='bottom';left=a.left+a.width/2-w/2;top=a.top-h-gap;}
      else if(room.right>=w+gap){side='left';left=a.right+gap;top=a.top+a.height/2-h/2;}
      else {side='right';left=a.left-w-gap;top=a.top+a.height/2-h/2;}
      left=Math.max(margin,Math.min(left,innerWidth-w-margin));top=Math.max(minTop,Math.min(top,maxBottom-h));
      card.style.left=left+'px';card.style.right='auto';card.style.top=top+'px';card.style.transform='none';card.dataset.pointerSide=side;
      card.style.setProperty('--pointer-y',Math.max(24,Math.min(a.top+a.height/2-top,h-24))+'px');card.style.setProperty('--pointer-x',Math.max(24,Math.min(a.left+a.width/2-left,w-24))+'px');
    }
    function clearRecentLater(lineId){
      clearTimeout(recentTimer);
      if(!lineId)return;
      recentTimer=setTimeout(()=>{const current=store.get();if(current.lastAffectedLineId===lineId)store.setTransient(state=>({...state,lastAffectedLineId:'',lastMutationKind:''}));},1500);
    }
    function restoreCartViewport(state,previousScroll){
      const cart=document.querySelector('.cart-list');if(!cart)return;
      const target=state.lastAffectedLineId?document.querySelector('[data-line-id="'+CSS.escape(state.lastAffectedLineId)+'"]'):null;
      if(state.lastAffectedLineId&&state.lastMutationKind==='added'&&state.cartViewMode===CART_VIEW_INPUT){cart.scrollTop=cart.scrollHeight;}
      else if(target){target.scrollIntoView({block:'nearest'});}
      else cart.scrollTop=Math.max(0,previousScroll||0);
      cartScrollTop=cart.scrollTop;
      clearRecentLater(state.lastAffectedLineId);
    }
    let renderStarted=false;
    const renderKeys={top:'',cart:'',category:'',products:'',quick:'',bottom:'',modal:''};
    function surfaceKey(value){try{return JSON.stringify(value);}catch(_error){return String(Date.now());}}
    function cartSurface(state){
      const hasCart=state.cart.length>0;
      const checkoutLabel=state.dineContext?'落單到 '+escapeHtml(state.dineContext.tableId)+' 號枱 '+money(cartTotal(state.cart)):hasCart?'結帳 '+money(cartTotal(state.cart)):'購物車未有餐點';
      const serviceClass=state.orderServiceMode===SERVICE_DINE_IN?'dine':'takeaway';
      const viewClass=state.cartViewMode===CART_VIEW_ORGANIZED?'organized':'input';
      return '<aside class="cart"><header><div><h2>購物車（'+state.cart.reduce((n,l)=>n+l.qty,0)+'）</h2>'+cartSummary(state)+'</div><span class="cart-header-actions"><span class="cart-mode-controls"><button class="cart-mode-toggle '+serviceClass+'" data-action="toggle-order-service">'+state.orderServiceMode+'</button><button class="cart-mode-toggle cart-view-toggle '+viewClass+'" data-action="toggle-cart-view">'+(state.cartViewMode===CART_VIEW_ORGANIZED?'原單':'整理')+'</button></span>'+(state.dineContext?'<button class="cancel-dine-order" data-action="cancel-dine-order">取消堂食點單</button>':'')+'<button data-action="clear-cart">清空</button></span></header><div class="cart-list">'+cartRows()+'</div>'+pendingArea()+'<footer><button data-action="open-hold-panel">掛單</button><button data-action="open-drafts">取單'+(drafts.length?' '+drafts.length:'')+'</button><button class="primary" data-action="checkout" '+(hasCart?'':'disabled')+'>'+checkoutLabel+'</button></footer></aside>';
    }
    function filteredCatalog(state){
      const searchQuery=state.searchQuery.trim().toLocaleLowerCase('zh-HK');
      const categoryProducts=state.category==='全部'?products:products.filter(product=>product.category===state.category);
      return sortPausedLast(categoryProducts.filter(product=>!searchQuery||String(product.name||'').toLocaleLowerCase('zh-HK').includes(searchQuery)||String(product.code||'').toLocaleLowerCase('zh-HK').includes(searchQuery)));
    }
    function productGridSurface(state){
      const filtered=filteredCatalog(state),template=productTemplate();
      return '<div class="products products-'+template+'">'+(filtered.length?filtered.map(productCard).join(''):'<div class="empty search-empty">搵唔到符合「'+escapeHtml(state.searchQuery)+'」嘅產品</div>')+'</div>';
    }
    function refreshQrCodes(scope=document){
      scope.querySelectorAll?.('[data-qr]').forEach(node=>{if(typeof window.qrcode!=='function')return;const qr=window.qrcode(0,'M');qr.addData(node.dataset.qr);qr.make();node.innerHTML=qr.createImgTag(5,8,'WhatsApp QR Code');});
    }
    function replaceOuter(selector,html){
      const node=document.querySelector(selector);if(!node)return null;
      node.outerHTML=html;
      return document.querySelector(selector);
    }
    function refreshQuickSurface(html){
      const catalog=document.querySelector('.catalog');if(!catalog)return null;
      const current=catalog.querySelector('.quick-drawer');
      if(!html){current?.remove();return null;}
      if(current){current.outerHTML=html;}else catalog.insertAdjacentHTML('beforeend',html);
      return catalog.querySelector('.quick-drawer');
    }
    let lastOverlayOpen=null;
    function publishOverlayState(){
      const open=Boolean(modal||confirmState);
      if(open===lastOverlayOpen)return;
      lastOverlayOpen=open;
      window.parent?.postMessage?.({type:'morefun:overlay-state',open},'*');
    }
    function refreshModalSurface(state){
      const toast=document.getElementById('toast');if(!toast)return;
      app.querySelectorAll(':scope > .modal-scrim,:scope > .modal-card,:scope > .confirm-layer,:scope > .new-order-toast').forEach(node=>node.remove());
      toast.insertAdjacentHTML('beforebegin',modalScrim()+activeModal()+customConfirm());
      if(modal?.type==='settings'){
        const first=document.querySelector('.side-card .setting-row');
        first?.insertAdjacentHTML('beforebegin','<div class="setting-block"><strong>購物車相同產品</strong><div class="segmented"><button data-action="cart-merge" data-value="same" class="'+(state.settings.cart.mergeMode!=='never'?'active':'')+'">相同配置合併</button><button data-action="cart-merge" data-value="never" class="'+(state.settings.cart.mergeMode==='never'?'active':'')+'">逐項顯示</button></div></div>');
      }
      app.querySelectorAll(':scope > .modal-card,:scope > .confirm-layer,:scope > .new-order-toast').forEach(node=>{bindImageFallbacks(node);refreshQrCodes(node);});
      requestAnimationFrame(()=>positionActiveCard());
    }
    function render(){
      const state=store.get();
      const pendingCount=pendingOrderCount(state);
      const template=productTemplate();
      const topKey=surfaceKey([state.quickMode,state.operations,state.health,pendingCount,state.dineContext,products.map(item=>[item.id,supplyStatus(item)]),readJSON(ORDER_HISTORY_STORAGE_KEY,[]).length]);
      const cartKey=surfaceKey([state.cart,state.dineContext,state.orderServiceMode,state.cartViewMode,state.lastAffectedLineId,state.lastMutationKind,state.collapsedCartCategories,state.settings.cart,drafts.length]);
      const categoryKey=surfaceKey([state.category,state.searchQuery,state.settings.categoryLayout]);
      const productsKey=surfaceKey([state.category,state.searchQuery,state.quickMode,state.settings.catalog,template,products.map(item=>[item.id,supplyStatus(item)])]);
      const quickKey=surfaceKey([state.quickDrawerOpen,state.settings.quickDrinks,pendingSummary(state.cart).drink,lastDrinkAssignment,modal?.type==='drink'?modal.drinkId:'',drinks.map(item=>[item.id,item.available])]);
      const bottomKey=String(pendingCount);
      const modalKey=surfaceKey([modal,confirmState,newOrderNotice,modal?{cart:state.cart,settings:state.settings,health:state.health,pendingOrders:state.pendingOrders,searchQuery:state.searchQuery,drafts}:null]);
    
      if(!renderStarted){
        const topHtml=topbar(),cartHtml=cartSurface(state),categoryHtml=categoryBar(state),productsHtml=productGridSurface(state),quickHtml=quickDrinks(),bottomHtml=renderBottomNav('order',{badges:{orders:pendingCount}});
        app.innerHTML='<main>'+topHtml+'<section class="workspace"><section class="order-grid" style="--cart-width:'+Number(state.settings.cart.widthPercent||32)+'%">'+cartHtml+'<section class="catalog">'+categoryHtml+productsHtml+quickHtml+'</section></section></section>'+bottomHtml+'</main>'+modalScrim()+activeModal()+customConfirm()+'<div id="toast" class="toast"></div>';
        document.body.classList.toggle('has-modal',Boolean(modal));
        bindImageFallbacks(app);refreshQrCodes(app);
        Object.assign(renderKeys,{top:topKey,cart:cartKey,category:categoryKey,products:productsKey,quick:quickKey,bottom:bottomKey,modal:modalKey});
        renderStarted=true;
        requestAnimationFrame(()=>{positionActiveCard();restoreCartViewport(state,0);});
        publishOverlayState();
        window.dispatchEvent(new Event('morefun:layout-invalidated'));
        return;
      }
    
      let layoutChanged=false;
      const grid=document.querySelector('.order-grid');
      const cartWidth=Number(state.settings.cart.widthPercent||32)+'%';
      if(grid&&grid.style.getPropertyValue('--cart-width')!==cartWidth){grid.style.setProperty('--cart-width',cartWidth);layoutChanged=true;}
      document.body.classList.toggle('has-modal',Boolean(modal));
    
      if(renderKeys.top!==topKey){replaceOuter('.topbar',topbar());renderKeys.top=topKey;}
      if(renderKeys.cart!==cartKey){
        const oldCart=document.querySelector('.cart-list'),previousScroll=oldCart?oldCart.scrollTop:cartScrollTop;
        const node=replaceOuter('.cart',cartSurface(state));if(node)bindImageFallbacks(node);
        renderKeys.cart=cartKey;layoutChanged=true;requestAnimationFrame(()=>restoreCartViewport(state,previousScroll));
      }
      if(renderKeys.category!==categoryKey){replaceOuter('.category-shell',categoryBar(state));renderKeys.category=categoryKey;layoutChanged=true;}
      if(renderKeys.products!==productsKey){const node=replaceOuter('.products',productGridSurface(state));if(node)bindImageFallbacks(node);renderKeys.products=productsKey;layoutChanged=true;}
      if(renderKeys.quick!==quickKey){const node=refreshQuickSurface(quickDrinks());if(node)bindImageFallbacks(node);renderKeys.quick=quickKey;layoutChanged=true;}
      if(renderKeys.bottom!==bottomKey){replaceOuter('.bottom-nav',renderBottomNav('order',{badges:{orders:pendingCount}}));renderKeys.bottom=bottomKey;layoutChanged=true;}
      if(renderKeys.modal!==modalKey){refreshModalSurface(state);renderKeys.modal=modalKey;}
      publishOverlayState();
      if(layoutChanged)window.dispatchEvent(new Event('morefun:layout-invalidated'));
    }
    function completeDineCancellation(){
      const context=store.get().dineContext;
      if(context?.startedFromFree){const dine=cleanupEmptyDineSessions(readJSON(DINE_STORAGE_KEY,null)||createInitialDineState());writeJSON(DINE_STORAGE_KEY,dine);}
      store.set(state=>({...state,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));
      modal=null;confirmState=null;window.parent?.postMessage?.({type:'morefun:navigate',route:'dine'},'*');
    }
    function requestDineCancellation(){
      const state=store.get();if(!state.dineContext){window.parent?.postMessage?.({type:'morefun:navigate',route:'dine'},'*');return;}
      if(!state.cart.length){completeDineCancellation();return;}
      confirmState={kind:'dine-cancel',title:'取消堂食點單？',message:'今次未正式加入 '+state.dineContext.tableId+' 號枱，購物車內容會一併清除；原有堂食餐品不受影響。'};modal=null;render();
    }
    function markDirty(){if(modal)modal.dirty=true;}
    function modalSaveAction(current=modal){
      if(!current)return '';
      if(current.type==='product')return 'apply-product';
      if(current.type==='drink')return 'apply-drink';
      if(current.type==='completion'&&current.draft?.activeGroup)return 'apply-required-group';
      if(current.type==='combo')return 'apply-combo-edit';
      if(current.type==='specified-link')return 'apply-specified-link';
      return '';
    }
    function requestDismiss(){
      if(!modal)return;
      if(modal.dirty){
        confirmState={kind:'modal-exit',title:'已經有調整，是否退出？',message:'你可以繼續調整、退出而不保存，或者保存目前修改後退出。',returnModal:modal.type==='drink'&&modal.parent?modal.parent:null,saveAction:modalSaveAction(modal)};
        render();return;
      }
      modal=modal.type==='drink'&&modal.parent?modal.parent:null;confirmState=null;render();
    }
    function openProduct(productId,lineId='',anchor=null){
      const p=productMap.get(productId),line=lineId?store.get().cart.find(x=>x.lineId===lineId):null;
      modal={type:'product',productId,editLineId:lineId,anchor,dirty:false,draft:{qty:line?.qty||1,options:safeClone(line?.options||{}),drink:line?.drinkAssignments?.[0]||null,note:line?.options?.note||'',keypad:false,keypadValue:''}};
      render();
    }
    function locateMutation(before,after,productId,newLineId=''){
      if(newLineId&&after.some(line=>line.lineId===newLineId))return {lineId:newLineId,kind:'added'};
      const beforeMap=new Map(before.map(line=>[line.lineId,Number(line.qty||0)]));
      const added=after.find(line=>!beforeMap.has(line.lineId));if(added)return {lineId:added.lineId,kind:'added'};
      const changed=[...after].reverse().find(line=>line.productId===productId&&Number(line.qty||0)>Number(beforeMap.get(line.lineId)||0));
      return {lineId:changed?.lineId||after.at(-1)?.lineId||'',kind:changed?'changed':'added'};
    }
    function quickAddProduct(productId){
      const p=productMap.get(productId);if(!p)return;
      const current=store.get();const line=makeLine(productId,1,{serviceMode:current.orderServiceMode});const before=current.cart;
      store.set(state=>{const next=mergeCart(state.cart.concat(line),state.settings.cart.mergeMode);const mutation=locateMutation(before,next,productId,line.lineId);state.cart=next;state.lastAffectedLineId=mutation.lineId;state.lastMutationKind=mutation.kind;return state;});
      queue.afterRender(()=>showToast('已加入 '+p.name));
    }
    function changeCartQuantity(lineId,delta){
      store.set(state=>{state.cart=updateCartLineQuantity(state.cart,lineId,delta,Object.fromEntries(products.map(p=>[p.id,p.drinkSlots||0])));state.lastAffectedLineId=state.cart.some(line=>line.lineId===lineId)?lineId:'';state.lastMutationKind='changed';return state;});
    }
    function openDrink(drinkId,context,maxQty=1,anchor=null){modal={type:'drink',drinkId,context,maxQty,anchor,dirty:false,draft:{qty:1,sweetness:'',ice:'',groups:[]}};render();}
    function applyProduct(){
      const editing=Boolean(modal.editLineId);
      const p=productMap.get(modal.productId),d=modal.draft,options={...d.options};if(d.note)options.note=d.note;
      const current=store.get(),before=current.cart;
      const drinkAssignments=d.drink?Array.from({length:d.qty},()=>safeClone(d.drink)):[];
      let line=makeLine(p.id,d.qty,{options,drinkAssignments,linkedComboId:p.combinable&&d.options.snack&&d.drink?stableId('combo'):'',linkedQty:p.combinable&&d.options.snack&&d.drink?d.qty:0,serviceMode:current.orderServiceMode});
      if(p.category==='飯團套餐'){
        const components=[{role:'main',source:'fixed',productId:p.id,name:p.name,image:p.image,unitPrice:p.price,options:{}},{role:'snack',source:'fixed-option',productId:'snack:'+d.options.snack,name:d.options.snack,image:'',unitPrice:0,options:{}}];
        if(d.drink)components.push({role:'drink',source:'quick',productId:d.drink.drinkId,drinkId:d.drink.drinkId,name:d.drink.name,image:drinkMap.get(d.drink.drinkId)?.image||'',unitPrice:Number(d.drink.unitPrice||0),options:{}});
        line={...line,lineType:'combo',category:'飯團套餐',combo:{id:stableId('combo'),kind:'riceball-set',source:'fixed',components,missingRoles:d.drink?[]:['drink'],singleTotal:p.price,comboPrice:p.price,discount:0}};
      }
      const editLineId=modal.editLineId;
      store.set(state=>{
        if(editLineId){state.cart=state.cart.map(item=>item.lineId===editLineId?{...line,lineId:item.lineId,createdOrder:item.createdOrder,serviceMode:item.serviceMode,serviceModeOverride:item.serviceModeOverride||''}:item);state.lastAffectedLineId=editLineId;state.lastMutationKind='changed';}
        else{const next=mergeCart(state.cart.concat(line),state.settings.cart.mergeMode);const mutation=locateMutation(before,next,p.id,line.lineId);state.cart=next;state.lastAffectedLineId=mutation.lineId;state.lastMutationKind=mutation.kind;}
        return state;
      });
      modal=null;queue.afterRender(()=>showToast(editing?'已更新產品':'已加入購物車'));
    }
    function applyDrink(){
      const groups=modal.draft.groups||[];
      const selections=Array.from({length:modal.draft.qty},()=>drinkSelection(modal.drinkId)).concat(groups.flatMap(group=>Array.from({length:group.qty},()=>drinkSelection(modal.drinkId,group.sweetness,group.ice)))),context=modal.context;
      if(context==='detail'){const productModal=modal.parent;productModal.draft.drink=selections[0];productModal.dirty=true;modal=productModal;render();return;}
      let appliedTarget=null;
      store.set(state=>{let remaining=selections.slice();state.cart=state.cart.map(line=>{if(!remaining.length)return line;const miss=Math.max(0,line.drinkSlots-line.drinkAssignments.length);const taken=remaining.splice(0,miss);if(taken.length&&!appliedTarget)appliedTarget={lineId:line.lineId,name:line.name};return taken.length?{...line,drinkAssignments:line.drinkAssignments.concat(taken)}:line;});if(appliedTarget){state.lastAffectedLineId=appliedTarget.lineId;state.lastMutationKind='changed';}return state;});
      if(appliedTarget&&selections[0]){lastDrinkAssignment={drink:selections[0].name,target:appliedTarget.name};clearTimeout(drinkFeedbackTimer);drinkFeedbackTimer=setTimeout(()=>{lastDrinkAssignment=null;render();},3200);}
      pendingDrinkAssignment=null;modal=null;queue.afterRender(()=>showToast('已補選飲品'));
    }
    function handle(button,anchorOverride=null){
      const action=button.dataset.action;
      if(action==='shell-navigate'){const route=button.dataset.route;if(route==='dine'&&store.get().dineContext)return requestDineCancellation();if(route!=='order')window.parent?.postMessage?.({type:'morefun:navigate',route},'*');return;}
      if(store.get().quickDrawerOpen)scheduleQuickDrawerClose();
      if(action==='category')store.setTransient(state=>({...state,category:button.dataset.value}));
      else if(action==='open-search'){modal={type:'search',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='clear-search'){store.setTransient(state=>({...state,searchQuery:''}));}
      else if(action==='open-product')openProduct(button.dataset.id,'',actionAnchor(button,anchorOverride));
      else if(action==='quick-add-product')quickAddProduct(button.dataset.id);
      else if(action==='cart-qty')changeCartQuantity(button.dataset.id,Number(button.dataset.delta)||0);
      else if(action==='toggle-order-service')store.set(state=>{const next=state.orderServiceMode===SERVICE_DINE_IN?SERVICE_TAKEAWAY:SERVICE_DINE_IN;return {...state,orderServiceMode:next,cart:applyOrderServiceMode(state.cart,next),lastAffectedLineId:'',lastMutationKind:''};});
      else if(action==='toggle-line-service')store.set(state=>({...state,cart:toggleLineServiceMode(state.cart,button.dataset.id,state.orderServiceMode),lastAffectedLineId:button.dataset.id,lastMutationKind:'changed'}));
      else if(action==='toggle-cart-view')saveCartViewMode(store.get().cartViewMode===CART_VIEW_ORGANIZED?CART_VIEW_INPUT:CART_VIEW_ORGANIZED);
      else if(action==='toggle-cart-category')store.setTransient(state=>{const category=button.dataset.value;const collapsed=state.collapsedCartCategories.includes(category);return {...state,collapsedCartCategories:collapsed?state.collapsedCartCategories.filter(item=>item!==category):state.collapsedCartCategories.concat(category)};});
      else if(action==='edit-line'){const line=store.get().cart.find(x=>x.lineId===button.dataset.id);if(line?.lineType==='combo'){modal={type:'combo',lineId:line.lineId,anchor:actionAnchor(button,anchorOverride),dirty:false,draft:{components:safeClone(line.combo?.components||[])}};render();}else if(line)openProduct(line.productId,line.lineId,actionAnchor(button,anchorOverride));}
      else if(action==='open-completion'){modal={type:'completion',dirty:false,draft:{activeGroup:'',activeTarget:'',assignments:{}}};render();}
      else if(action==='open-quick-settings'){modal={type:'quick',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-settings'){modal={type:'settings',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-health'){modal={type:'health',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-status'){modal={type:'status',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-soldout'){modal={type:'soldout',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='navigate-orders')window.parent?.postMessage?.({type:'morefun:navigate',route:'orders'},'*');
      else if(action==='navigate-dine')requestDineCancellation();
      else if(action==='navigate-soldout')window.parent?.postMessage?.({type:'morefun:navigate',route:'soldout'},'*');
      else if(action==='navigate-more')window.parent?.postMessage?.({type:'morefun:navigate',route:'more'},'*');
      else if(action==='open-hold-panel'){if(!store.get().cart.length){showToast('購物車未有餐品');return;}modal={type:'hang',dirty:false};render();}
      else if(action==='select-draft'){modal={...modal,selectedDraftId:button.dataset.id};render();}
      else if(action==='assign-table'){
        const current=store.get();if(!current.cart.length){showToast('購物車未有餐品');return;}
        try{const dineState=readJSON(DINE_STORAGE_KEY,null)||createInitialDineState();const table=dineState.tables.find(entry=>entry.id===button.dataset.id);const context={mode:'dine',tableId:button.dataset.id,sessionId:table?.status==='occupied'?table.session?.id:null};const dineCart=applyOrderServiceMode(current.cart,SERVICE_DINE_IN);const next=commitTableOrder(dineState,context,dineCart,{terminalId,history:readJSON(ORDER_HISTORY_STORAGE_KEY,[])});writeJSON(DINE_STORAGE_KEY,next);syncDinePrintJobs(next);store.set(state=>({...state,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));modal=null;queue.afterRender(()=>showToast('已正式加入 '+button.dataset.id+' 號枱及建立打印工作'));}catch(error){showToast(error.message||'未能加入堂食枱位');}
      }
      else if(action==='add-draft'){
        const state=store.get();if(!state.cart.length)return;
        const draft=createDraftRecord({cart:state.cart,terminalId,drafts,counters:draftCounters,session:state.draftSession||null,context:state.dineContext||null});
        draftCounters={...draftCounters,[terminalId]:Number(draft.draftNumber.split('-').at(-1))};writeJSON(DRAFT_COUNTER_STORAGE_KEY,draftCounters);drafts=drafts.concat(draft);writeJSON(DRAFT_STORAGE_KEY,drafts);
        store.set(next=>({...next,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));modal=null;queue.afterRender(()=>showToast('已暫存 '+draft.draftNumber));
      }
      else if(action==='open-drafts'){modal={type:'take',selectedDraftId:'',dirty:false};render();}
      else if(action==='restore-draft'){
        const draft=drafts.find(item=>item.id===button.dataset.id);if(!draft)return;
        const restored=restoreDraftForTerminal(draft,terminalId);drafts=drafts.filter(item=>item.id!==draft.id);writeJSON(DRAFT_STORAGE_KEY,drafts);
        const orderServiceMode=inferOrderServiceMode(restored.cart,null);
        store.set(state=>({...state,cart:normalizeCart(restored.cart,orderServiceMode),draftSession:restored.session,dineContext:null,orderServiceMode,lastAffectedLineId:'',lastMutationKind:''}));modal=null;queue.afterRender(()=>showToast('已取回 '+draft.draftNumber));
      }
      else if(action==='void-draft'){const draft=drafts.find(item=>item.id===modal?.selectedDraftId);if(!draft)return;if(!window.confirm('確定作廢 '+draft.draftNumber+'？作廢後不能取回。'))return;drafts=drafts.filter(item=>item.id!==draft.id);writeJSON(DRAFT_STORAGE_KEY,drafts);modal={type:'take',selectedDraftId:'',dirty:false};render();showToast('已作廢 '+draft.draftNumber);}
      else if(action==='toggle-quick-drawer'){store.setTransient(state=>({...state,quickDrawerOpen:!state.quickDrawerOpen}));scheduleQuickDrawerClose();}
      else if(action==='move-quick-drink')updateSettings(s=>{const order=s.quickDrinks.order.slice(),from=order.indexOf(button.dataset.id),to=Math.max(0,Math.min(order.length-1,from+Number(button.dataset.delta)));if(from>=0&&from!==to)[order[from],order[to]]=[order[to],order[from]];s.quickDrinks.order=order;});
      else if(action==='ui-scale')window.parent?.postMessage?.({type:'morefun:set-ui-scale',value:Number(button.dataset.value)},'*');
      else if(action==='dismiss-modal')requestDismiss();
      else if(action==='confirm-cancel'){confirmState=null;render();}
      else if(action==='confirm-discard'){modal=confirmState?.returnModal||null;confirmState=null;render();}
      else if(action==='confirm-save-exit'){const saveAction=confirmState?.saveAction;confirmState=null;if(saveAction)handle({dataset:{action:saveAction}});else{modal=null;render();}}
      else if(action==='confirm-dine-cancel')completeDineCancellation();
      else if(action==='confirm-dissolve'){const lineId=confirmState.lineId;store.set(state=>{state.cart=normalizeCart(dissolveRiceballSet(state.cart,lineId,{idFactory:role=>stableId('line-'+role)}),state.orderServiceMode);state.lastAffectedLineId=state.cart.at(-1)?.lineId||'';state.lastMutationKind='changed';return state;});confirmState=null;modal=null;queue.afterRender(()=>showToast('套餐已拆開並按單品重新計價'));}
      else if(action==='toggle-pending-panel'){if(modal?.type==='pending')modal=null;else modal={type:'pending',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='process-pending-order'){const pendingOrders=store.get().pendingOrders;const order=Object.values(pendingOrders).flat().find(x=>x.id===button.dataset.id);if(order){modal={type:'pending-detail',order,anchor:modal?.anchor,dirty:false};showToast('開啟 '+order.id+' 核對流程');render();}}
      else if(action==='start-pending-review'){modal={type:'pending-review',order:modal.order,anchor:modal.anchor,dirty:false};render();}
      else if(action==='enlarge-proof'){modal={type:'proof',order:modal.order,anchor:modal.anchor,dirty:false};render();}
      else if(action==='back-to-pending-review'){modal={type:'pending-review',order:modal.order,anchor:modal.anchor,dirty:false};render();}
      else if(action==='report-payment-issue'){showToast('請掃描 WhatsApp QR Code 聯絡客人');}
      else if(action==='accept-pending-order'){const accepted=acceptPendingOrder(modal.order);store.set(state=>{state.pendingOrders={online:state.pendingOrders.online.filter(x=>x.id!==accepted.id),queue:state.pendingOrders.queue.filter(x=>x.id!==accepted.id)};state.runningOrders=state.runningOrders.concat(accepted);return state;});modal=null;queue.afterRender(()=>showToast('已接單 '+accepted.id+'；30分鐘後自動完成'));}
      else if(action==='set-order-mode')store.set(state=>({...state,quickMode:button.dataset.value==='quick'}));
      else if(action==='toggle-quick-drink-strip')updateSettings(s=>{s.quickDrinks.visible=s.quickDrinks.visible===false;});
      else if(action==='quick-display')updateSettings(s=>{s.quickDrinks.showImages=button.dataset.value==='image';});
      else if(action==='toggle-quick-assist')updateSettings(s=>{s.quickDrinks.quickAssist=s.quickDrinks.quickAssist===false;});
      else if(action==='setting-card')updateSettings(s=>{s.catalog.defaultTemplate=button.dataset.value;s.catalog.productOverrides={};});
      else if(action==='cart-width')updateSettings(s=>{s.cart.widthPercent=Number(button.dataset.value)||32;});
      else if(action==='cart-merge')updateSettings(s=>{s.cart.mergeMode=button.dataset.value;});
      else if(action==='toggle-cart-images')updateSettings(s=>{s.cart.showImages=s.cart.showImages===false;});
      else if(action==='toggle-code')updateSettings(s=>{s.catalog.showCode=!s.catalog.showCode;});
      else if(action==='toggle-accepting')store.set(state=>{state.operations.acceptingOrders=!state.operations.acceptingOrders;state.operations.immediateStopped=false;return state;});
      else if(action==='save-close-time'){const v=document.getElementById('scheduled-close')?.value||'';store.set(state=>{state.operations.scheduledClose=v;return state;});showToast('接單時間已更新');}
      else if(action==='immediate-stop')store.set(state=>{state.operations.acceptingOrders=false;state.operations.immediateStopped=true;return state;});
      else if(action==='resume-orders')store.set(state=>{state.operations.acceptingOrders=true;state.operations.immediateStopped=false;state.operations.scheduledClose='';return state;});
      else if(action==='detail-option'){
        markDirty();const g=button.dataset.group,v=button.dataset.value,multi=button.dataset.multi==='true';
        if(modal.type==='drink'){if(g==='sweetness')modal.draft.sweetness=modal.draft.sweetness===v?'':v;if(g==='ice')modal.draft.ice=modal.draft.ice===v?'':v;if(g.startsWith('group-sweetness-')){const x=Number(g.split('-').pop()),group=modal.draft.groups[x];group.sweetness=group.sweetness===v?'':v;}if(g.startsWith('group-ice-')){const x=Number(g.split('-').pop()),group=modal.draft.groups[x];group.ice=group.ice===v?'':v;}}
        else if(multi){const arr=modal.draft.options[g]||[];modal.draft.options[g]=arr.includes(v)?arr.filter(x=>x!==v):arr.concat(v);}else modal.draft.options[g]=modal.draft.options[g]===v?'':v;
        render();
      }
      else if(action==='detail-drink'){const parent=modal;modal={type:'drink',drinkId:button.dataset.id,context:'detail',maxQty:parent.draft.qty,parent,anchor:actionAnchor(button,anchorOverride),dirty:false,draft:{qty:parent.draft.qty,sweetness:'',ice:'',groups:[]}};render();}
      else if(action==='detail-qty'){markDirty();modal.draft.qty=Math.max(1,modal.draft.qty+Number(button.dataset.delta));render();}
      else if(action==='toggle-keypad'){modal.draft.keypad=!modal.draft.keypad;render();}
      else if(action==='keypad'){const key=button.dataset.key;if(key==='完成')modal.draft.keypad=false;else if(key==='←')modal.draft.keypadValue=modal.draft.keypadValue.slice(0,-1);else modal.draft.keypadValue=(modal.draft.keypadValue+key).replace(/^0+(?=\d)/,'');if(modal.draft.keypadValue)modal.draft.qty=Math.max(1,Number(modal.draft.keypadValue));markDirty();render();}
      else if(action==='apply-product')applyProduct();
      else if(action==='modifier-qty'){markDirty();modal.draft.qty=Math.max(0,Math.min(modal.maxQty,modal.draft.qty+Number(button.dataset.delta)));render();}
      else if(action==='group-qty'){markDirty();const g=modal.draft.groups[Number(button.dataset.index)];const used=modal.draft.qty+modal.draft.groups.reduce((n,x)=>n+x.qty,0);g.qty=Math.max(1,Math.min(g.qty+Number(button.dataset.delta),modal.maxQty-used+g.qty));render();}
      else if(action==='add-drink-group'){markDirty();const used=modal.draft.qty+modal.draft.groups.reduce((n,x)=>n+x.qty,0);if(used<modal.maxQty)modal.draft.groups.push({qty:1,sweetness:'',ice:'',open:true});else showToast('已達可補數量');render();}
      else if(action==='toggle-drink-adjustment'){const g=modal.draft.groups[Number(button.dataset.index)];g.open=!g.open;render();}
      else if(action==='apply-drink')applyDrink();
      else if(action==='quick-drink'){
        if(store.get().settings.quickDrinks.quickAssist===false){showToast('快捷補選已關閉');return;}
        const target=findDrinkTarget(store.get().cart),missing=pendingSummary(store.get().cart).drink;if(!missing||!target){showToast('目前沒有待補飲品');return;}pendingDrinkAssignment={lineId:target.lineId,name:target.name};openDrink(button.dataset.id,'global',missing,actionAnchor(button,anchorOverride));
      }
      else if(action==='complete-group'){modal.draft=completionDraft(button.dataset.group);modal.dirty=false;render();}
      else if(action==='completion-back'){modal.draft={activeGroup:'',activeTarget:'',assignments:{}};modal.dirty=false;render();}
      else if(action==='completion-target'){modal.draft.activeTarget=button.dataset.id;render();}
      else if(action==='completion-required-choice'){
        const target=modal.draft.activeTarget,value=button.dataset.value;if(!target)return;
        modal.draft.assignments={...(modal.draft.assignments||{}),[target]:value};modal.dirty=true;
        const targets=requiredTargets(store.get().cart,modal.draft.activeGroup),next=targets.find(item=>!modal.draft.assignments[item.id]);if(next)modal.draft.activeTarget=next.id;render();
      }
      else if(action==='completion-fill-remaining'){
        const value=button.dataset.value,targets=requiredTargets(store.get().cart,modal.draft.activeGroup);targets.forEach(target=>{if(!modal.draft.assignments[target.id])modal.draft.assignments[target.id]=value;});modal.dirty=true;render();
      }
      else if(action==='apply-required-group')applyRequiredGroup();
      else if(action==='linkup-all')applyLinkUp(Number(button.dataset.count)||0);
      else if(action==='open-specified-link'){const count=pairingGroupCount(store.get().cart),groups=Array.from({length:count},()=>({main:'',snack:'',drink:''}));if(!count){showToast('需要主餐及小食才可指定配對');return;}modal={type:'specified-link',anchor:actionAnchor(button,anchorOverride),dirty:false,draft:{groups,active:0}};render();}
      else if(action==='select-pairing-group'){modal.draft.active=Number(button.dataset.index)||0;render();}
      else if(action==='select-link-item'){const group=modal.draft.groups[modal.draft.active],role=button.dataset.role;group[role]=group[role]===button.dataset.id?'':button.dataset.id;render();}
      else if(action==='select-link-drink'){const group=modal.draft.groups[modal.draft.active];group.drink=group.drink===button.dataset.id?'':button.dataset.id;render();}
      else if(action==='apply-specified-link'){
        const groups=safeClone(modal.draft.groups.filter(group=>group.main&&group.snack));
        store.set(state=>{let next=state.cart;groups.forEach(group=>{const quickId=group.drink?.startsWith('quick:')?group.drink.slice(6):'',quick=quickId?drinkMap.get(quickId):null;next=combineRiceballSet(next,{mainLineId:group.main,snackLineId:group.snack,drinkLineId:quickId?'':group.drink,quickDrink:quick?{productId:quick.id,drinkId:quick.id,name:quick.name,image:quick.image,unitPrice:quick.price,selection:drinkSelection(quick.id)}:null},{comboId:stableId('combo'),lineId:stableId('line'),comboPrice:59,source:'specified'});});state.cart=normalizeCart(next,state.orderServiceMode);state.lastAffectedLineId=state.cart.at(-1)?.lineId||'';state.lastMutationKind='changed';return state;});modal=null;queue.afterRender(()=>showToast('已建立 '+groups.length+' 組指定套餐'));
      }
      else if(action==='select-combo-component'){const role=button.dataset.role,id=button.dataset.id,item=role==='drink'?drinkMap.get(id):productMap.get(id);if(!item)return;modal.draft.components=modal.draft.components.filter(component=>component.role!==role).concat({role,source:role==='drink'?'quick':'catalog',productId:item.id,drinkId:role==='drink'?item.id:'',name:item.name,image:item.image||'',unitPrice:Number(item.price||0),options:{}});modal.dirty=true;render();}
      else if(action==='clear-combo-component'){modal.draft.components=modal.draft.components.filter(component=>component.role!=='drink');modal.dirty=true;render();}
      else if(action==='apply-combo-edit'){const components=safeClone(modal.draft.components),lineId=modal.lineId,drink=components.find(item=>item.role==='drink');store.set(state=>{state.cart=state.cart.map(line=>line.lineId!==lineId?line:{...line,image:components.find(item=>item.role==='main')?.image||line.image,drinkAssignments:drink?[{drinkId:drink.productId,name:drink.name,image:drink.image||'',sweetness:'',ice:'',source:drink.source}]:[],combo:{...line.combo,components,missingRoles:drink?[]:['drink']}});state.lastAffectedLineId=lineId;state.lastMutationKind='changed';return state;});modal=null;queue.afterRender(()=>showToast('套餐組合已更新'));}
      else if(action==='request-dissolve-combo'){const line=store.get().cart.find(item=>item.lineId===modal.lineId);const singles=(line?.combo?.components||[]).reduce((sum,item)=>sum+Number(item.unitPrice||0),0);confirmState={kind:'dissolve',lineId:modal.lineId,title:'拆開套餐？',message:'拆開後會還原為獨立產品，並按單品價格重新計算（'+money(singles)+'）。'};render();}
      else if(action==='later-new-order'){newOrderNotice.visible=false;render();}
      else if(action==='process-new-order'){newOrderNotice.visible=false;modal={type:'pending',anchor:null,dirty:false};render();}
      else if(action==='clear-cart'){if(window.confirm('清空後不可恢復，確定清空整張購物車？'))store.set(state=>({...state,cart:[],orderServiceMode:state.dineContext?SERVICE_DINE_IN:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));}
      else if(action==='cancel-dine-order')requestDineCancellation();
      else if(action==='checkout'){
        const current=store.get();if(pendingSummary(current.cart).total){showToast('請先完成必選項目');return;}if(!current.cart.length)return;
        if(current.dineContext){try{const dineState=readJSON(DINE_STORAGE_KEY,null);const dineCart=applyOrderServiceMode(current.cart,SERVICE_DINE_IN);const next=commitTableOrder(dineState,current.dineContext,dineCart,{terminalId,history:readJSON(ORDER_HISTORY_STORAGE_KEY,[])});writeJSON(DINE_STORAGE_KEY,next);syncDinePrintJobs(next);store.set(state=>({...state,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));window.parent?.postMessage?.({type:'morefun:navigate',route:'dine'},'*');}catch(error){showToast(error.message||'未能加入堂食枱位');}return;}
        window.parent?.postMessage?.({type:'morefun:navigate',route:'checkout'},'*');
      }
    }
    app.addEventListener('morefun:status-action',event=>{const button=event.target.closest('[data-action]');if(!button||button.disabled)return;event.preventDefault();handle(button,event.detail?.anchor||null);});
    app.addEventListener('click',event=>{if(event.target.classList?.contains('modal-scrim')){event.preventDefault();requestDismiss();return;}const button=event.target.closest('[data-action]');if(button&&!button.disabled)handle(button);});
    app.addEventListener('pointerdown',event=>{if(event.target.closest('.quick-drawer-panel'))scheduleQuickDrawerClose();});
    app.addEventListener('input',event=>{if(event.target.matches('[data-action="detail-note"]')&&modal?.type==='product'){modal.draft.note=event.target.value;markDirty();return;}if(event.target.matches('[data-action="search-query"]')&&modal?.type==='search'){const value=event.target.value;store.setTransient(state=>({...state,searchQuery:value}));queue.afterRender(()=>{const input=document.querySelector('[data-action="search-query"]');if(input){input.focus();input.setSelectionRange(value.length,value.length);}});}});
    addEventListener('message',event=>{if(event.data?.type==='morefun:page-activate'&&event.data.route==='order'){const current=readJSON(ORDER_STORAGE_KEY,null);if(current?.dineContext&&!store.get().dineContext)store.set(state=>({...state,dineContext:current.dineContext,orderServiceMode:SERVICE_DINE_IN,cart:applyOrderServiceMode(current.cart||[],SERVICE_DINE_IN)}));}});
    render();
    async function bootstrapLiveMenu(){
      const catalog=await loadMenuCatalog({fallback:fallbackCatalog});
      categories=[...(catalog.categories||fallbackCategories)];products=[...(catalog.products||fallbackProducts)];drinks=[...(catalog.drinks?.length?catalog.drinks:fallbackDrinks)];indexCatalog();
      store.set(state=>{if(!categories.includes(state.category))state.category='全部';const existing=state.settings.quickDrinks.order||[];state.settings.quickDrinks.order=[...existing.filter(id=>drinkMap.has(id)),...drinks.map(item=>item.id).filter(id=>!existing.includes(id))];state.health.catalog={ok:catalog.source!=='fallback',label:'餐牌',detail:catalog.source==='firebase'?'已連接 Firebase 餐牌來源':catalog.source==='cache'?'離線模式：使用上次餐牌':'Firebase 未連接：使用內置後備餐牌'};state.health.sync={...state.health.sync,detail:catalog.source==='firebase'?'餐牌同步正常':'餐牌等待重新連線'};return state;});
      showToast(catalog.source==='firebase'?'餐牌已同步':catalog.source==='cache'?'網絡未連接，已載入上次餐牌':'Firebase 未連接，現正使用後備餐牌');
    }
    bootstrapLiveMenu().catch(error=>{console.error('MENU_BOOTSTRAP_FAILED',error);showToast('餐牌連接失敗，已保留本機點單');});
    setTimeout(()=>{if(newOrderNotice?.visible){newOrderNotice.visible=false;render();}},3000);
    setInterval(()=>{const current=store.get();if(!current.runningOrders.length)return;const next=completeExpiredOrders(current.runningOrders);const completed=next.filter((order,index)=>order.status==='completed'&&current.runningOrders[index]?.status!=='completed');if(!completed.length)return;store.set(state=>{state.runningOrders=next.filter(order=>order.status==='running');state.completedOrders=state.completedOrders.concat(completed);return state;});},30000);
    
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:52:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: quick order mode, drink strip, and quick assist are independent settings
ok 129 - quick order mode, drink strip, and quick assist are independent settings
  ---
  duration_ms: 0.366496
  type: 'test'
  ...
# Subtest: display settings include the three cart ratios
ok 130 - display settings include the three cart ratios
  ---
  duration_ms: 0.526655
  type: 'test'
  ...
# Subtest: cards are positioned from the pressed control and expose a pointer side
ok 131 - cards are positioned from the pressed control and expose a pointer side
  ---
  duration_ms: 0.699628
  type: 'test'
  ...
# Subtest: pending orders use a vertical split
ok 132 - pending orders use a vertical split
  ---
  duration_ms: 0.393345
  type: 'test'
  ...
# Subtest: every expanded card is owned by the single modal controller
ok 133 - every expanded card is owned by the single modal controller
  ---
  duration_ms: 0.267671
  type: 'test'
  ...
# Subtest: pending order card is actionable and grouped by channel
ok 134 - pending order card is actionable and grouped by channel
  ---
  duration_ms: 0.168455
  type: 'test'
  ...
# Subtest: anchored cards support all four pointer directions and stay between fixed bars
ok 135 - anchored cards support all four pointer directions and stay between fixed bars
  ---
  duration_ms: 0.342921
  type: 'test'
  ...
# Subtest: cart image visibility is configurable
ok 136 - cart image visibility is configurable
  ---
  duration_ms: 0.17649
  type: 'test'
  ...
# Subtest: quick drink adjustment stays compact without repeating its image
ok 137 - quick drink adjustment stays compact without repeating its image
  ---
  duration_ms: 0.279533
  type: 'test'
  ...
# Subtest: shell uses a fixed T2S canvas fitted inside both viewport dimensions
not ok 138 - shell uses a fixed T2S canvas fitted inside both viewport dimensions
  ---
  duration_ms: 26.173744
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:111:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /logicalHeight/. Input:
    
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
      'function syncChildOverlay(frame){\n' +
      '  try{\n' +
      '    const doc=frame?.contentDocument;\n' +
      "    const open=Boolean(doc?.querySelector?.('.dialog-layer,.confirm-layer,.overlay-scrim,.anchored-popover'));\n" +
      '    setChildOverlayState(frame,open);\n' +
      '  }catch(_error){}\n' +
      '}\n' +
      'function stopChildOverlayObserver(frame){\n' +
      '  try{\n' +
      '    frame?._shellOverlayObserver?.disconnect?.();\n' +
      '    if(frame)frame._shellOverlayObserver=null;\n' +
      '    const doc=frame?.contentDocument;\n' +
      '    if(doc?.documentElement)delete doc.documentElement.dataset.shellOverlayObserver;\n' +
      '  }catch(_error){}\n' +
      '}\n' +
      '\n' +
      'function installChildOverlayObserver(frame){\n' +
      '  try{\n' +
      "    if(frame?.dataset?.route==='order'||frame!==activeFrame)return;\n" +
      '    const doc=frame?.contentDocument;\n' +
      '    if(!doc?.documentElement||frame._shellOverlayObserver)return;\n' +
      "    doc.documentElement.dataset.shellOverlayObserver='1';\n" +
      '    const observer=new MutationObserver(()=>syncChildOverlay(frame));\n' +
      "    observer.observe(doc.body||doc.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});\n" +
      '    frame._shellOverlayObserver=observer;\n' +
      '    syncChildOverlay(frame);\n' +
      "  }catch(error){console.warn('GLOBAL_SHELL_OVERLAY_OBSERVER_FAILED',error);}\n" +
      '}\n' +
      '\n' +
      'function applyChildShellMode(frame){\n' +
      '  try{\n' +
      '    const doc=frame?.contentDocument;\n' +
      '    if(!doc?.documentElement)return;\n' +
      "    doc.documentElement.dataset.globalShell='1';\n" +
      '    installChildOverlayObserver(frame);\n' +
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
      'function showLoaderError(message,target=activeFrame){\n' +
      "  if(target!==activeFrame){console.error('PAGE_TRANSITION_FAILED',message);if(target?.dataset.route===pending){pending='';delete stage.dataset.pendingRoute;}target?.classList.remove('is-loading');if(routeFeedback)routeFeedback.hidden=true;return;}\n" +
      `  target.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';\n` +
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
      "  if(old&&old!==frame){stopChildOverlayObserver(old);old.classList.remove('is-active','is-loading','has-shell-overlay');old.setAttribute('aria-hidden','true');old.tabIndex=-1;if(old.id==='page')old.id='page-cache-'+String(old.dataset.route||'route');}\n" +
      "  shellApp?.classList.remove('child-overlay-active');\n" +
      "  const existingPage=document.getElementById('page');if(existingPage&&existingPage!==frame)existingPage.removeAttribute('id');\n" +
      "  frame.id='page';frame.classList.remove('is-loading');frame.classList.add('is-active');frame.setAttribute('aria-hidden','false');frame.removeAttribute('tabindex');\n" +
      "  activeFrame=frame;current=key;pending='';childReady=true;clearTimeout(watchdogTimer);stage.dataset.route=current;delete stage.dataset.pendingRoute;\n" +
      "  if(key==='checkout')checkoutExitArmed='';\n" +
      '  setShellRouteUi(key,{loading:false});\n' +
      '  applyChildShellMode(frame);\n' +
      "  if(key!=='order')syncChildOverlay(frame);else setChildOverlayState(frame,frame.classList.contains('has-shell-overlay'));\n" +
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
      "  if(force){readyRoutes.delete(key);stopChildOverlayObserver(frame);frame.classList.add('is-loading');frame.classList.remove('is-active');frame.setAttribute('aria-hidden','true');delete frame.dataset.appliedProfile;frame.src=pageUrl(key,'reload');}\n" +
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
      "  preloadStarted=true;preloadQueue=['checkout',...mainRoutes.filter(key=>key!=='order')];setTimeout(pre"... 3709 more characters
    
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
    function syncChildOverlay(frame){
      try{
        const doc=frame?.contentDocument;
        const open=Boolean(doc?.querySelector?.('.dialog-layer,.confirm-layer,.overlay-scrim,.anchored-popover'));
        setChildOverlayState(frame,open);
      }catch(_error){}
    }
    function stopChildOverlayObserver(frame){
      try{
        frame?._shellOverlayObserver?.disconnect?.();
        if(frame)frame._shellOverlayObserver=null;
        const doc=frame?.contentDocument;
        if(doc?.documentElement)delete doc.documentElement.dataset.shellOverlayObserver;
      }catch(_error){}
    }
    
    function installChildOverlayObserver(frame){
      try{
        if(frame?.dataset?.route==='order'||frame!==activeFrame)return;
        const doc=frame?.contentDocument;
        if(!doc?.documentElement||frame._shellOverlayObserver)return;
        doc.documentElement.dataset.shellOverlayObserver='1';
        const observer=new MutationObserver(()=>syncChildOverlay(frame));
        observer.observe(doc.body||doc.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});
        frame._shellOverlayObserver=observer;
        syncChildOverlay(frame);
      }catch(error){console.warn('GLOBAL_SHELL_OVERLAY_OBSERVER_FAILED',error);}
    }
    
    function applyChildShellMode(frame){
      try{
        const doc=frame?.contentDocument;
        if(!doc?.documentElement)return;
        doc.documentElement.dataset.globalShell='1';
        installChildOverlayObserver(frame);
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
    
    function showLoaderError(message,target=activeFrame){
      if(target!==activeFrame){console.error('PAGE_TRANSITION_FAILED',message);if(target?.dataset.route===pending){pending='';delete stage.dataset.pendingRoute;}target?.classList.remove('is-loading');if(routeFeedback)routeFeedback.hidden=true;return;}
      target.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';
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
      if(old&&old!==frame){stopChildOverlayObserver(old);old.classList.remove('is-active','is-loading','has-shell-overlay');old.setAttribute('aria-hidden','true');old.tabIndex=-1;if(old.id==='page')old.id='page-cache-'+String(old.dataset.route||'route');}
      shellApp?.classList.remove('child-overlay-active');
      const existingPage=document.getElementById('page');if(existingPage&&existingPage!==frame)existingPage.removeAttribute('id');
      frame.id='page';frame.classList.remove('is-loading');frame.classList.add('is-active');frame.setAttribute('aria-hidden','false');frame.removeAttribute('tabindex');
      activeFrame=frame;current=key;pending='';childReady=true;clearTimeout(watchdogTimer);stage.dataset.route=current;delete stage.dataset.pendingRoute;
      if(key==='checkout')checkoutExitArmed='';
      setShellRouteUi(key,{loading:false});
      applyChildShellMode(frame);
      if(key!=='order')syncChildOverlay(frame);else setChildOverlayState(frame,frame.classList.contains('has-shell-overlay'));
      try{
        if(key==='checkout')frame.contentWindow?.postMessage({type:'morefun:checkout-enter',route:key},'*');
        frame.contentWindow?.postMessage({type:'morefun:page-activate',route:key},'*');
      }catch(_error){}
    }
    
    function armWatchdog(frame,key){clearTimeout(watchdogTimer);watchdogTimer=setTimeout(()=>{if(key!==pending||readyRoutes.has(key))return;frame.src=pageUrl(key,'retry');},1800);}
    function ensureFrameLoading(key,{force=false,background=false}={}){
      let frame=frameByRoute.get(key);
      if(!frame){frame=createHiddenFrame(key);frame.src=pageUrl(key,force?'reload':'normal');return frame;}
      if(force){readyRoutes.delete(key);stopChildOverlayObserver(frame);frame.classList.add('is-loading');frame.classList.remove('is-active');frame.setAttribute('aria-hidden','true');delete frame.dataset.appliedProfile;frame.src=pageUrl(key,'reload');}
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
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:113:10)
    async Test.run (node:internal/test_runner/test:1054:7)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: root height chain and scroll regions keep both bars fixed
not ok 139 - root height chain and scroll regions keep both bars fixed
  ---
  duration_ms: 6.552322
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:118:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /#app\{width:1920px;height:100%;min-height:0;overflow:hidden\}/. Input:
    
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
      '  --bottom-nav-pad-y:clamp(3px,.55vh,6px);\n' +
      '  --bottom-nav-icon-size:clamp(21px,2.45vh,25px);\n' +
      '  --bottom-nav-item-pad-y:clamp(2px,.35vh,4px);\n' +
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
      '.bottom-nav{height:auto;min-height:calc(var(--bottom-nav-height) + env(safe-area-inset-bottom));display:grid;grid-template-columns:repeat(5,1fr);align-items:stretch;gap:10px;padding:var(--bottom-nav-pad-y) 16px calc(var(--bottom-nav-pad-y) + env(safe-area-inset-bottom));background:#fff;border-top:1px solid var(--line);flex:none;overflow:visible}\n' +
      '.bottom-nav button{position:relative;border:1px solid transparent;background:#fff;font-weight:850;font-size:calc(17px * var(--responsive-font-scale));line-height:1.15}\n' +
      '.shell-nav-button{display:grid;grid-template-rows:var(--bottom-nav-icon-size) auto;place-content:center;place-items:center;gap:2px;min-width:0;padding:var(--bottom-nav-item-pad-y) 12px;border-radius:var(--choice-pill-radius);overflow:visible}\n' +
      '.shell-nav-button.active{background:var(--orange-soft);border-color:color-mix(in srgb,var(--orange) 44%,white);color:var(--orange);box-shadow:0 3px 12px color-mix(in srgb,var(--orange) 15%,transparent)}\n' +
      '.shell-nav-icon{width:var(--bottom-nav-icon-size);height:var(--bottom-nav-icon-size);display:block;flex:none}\n' +
      '.shell-nav-badge{position:absolute;top:3px;left:calc(50% + 10px);min-width:20px;height:20px;padding:0 5px;display:grid;place-items:center;border-radius:999px;background:var(--red);color:#fff;font-size:11px}\n' +
      '\n' +
      ':is(.top-btn,.category-page>button,.category-search,.categories>button,.segmented>button,.channels>button,.payments>button,.option-grid>button,.option-chips>button,.source-picker>button,.tabs>button,.status-filter>button,.mode-choice,.issue-quick>button,.method-grid>button,.theme){border-radius:var(--choice-pill-radius)!important}\n' +
      ':is(.top-btn,.category-page>button,.category-search,.categories>button,.segmented>button,.channels>button,.payments>button,.option-grid>button,.option-chips>button,.source-picker>button,.tabs>button,.status-filter>button,.mode-choice,.issue-quick>button,.method-grid>button,.theme).active{background:var(--orange-soft)!important;border-color:color-mix(in srgb,var(--orange) 56%,white)!important;color:var(--orange)!important;box-shadow:0 3px 11px color-mix(in srgb,var(--orange) 14%,transparent)}\n' +
      '.global-statusbar{height:var(--topbar-height);min-height:var(--topbar-height)}\n' +
      '.shell-brand{display:flex;align-items:center;gap:9px;white-space:nowrap}.shell-brand-mark{width:38px;height:38px;display:grid;place-items:center;border-radius:50%;background:var(--orange);color:#fff;font-size:19px}.shell-brand strong{font-size:calc(25px * var(--responsive-font-scale))}\n' +
      '.shell-terminal,.shell-context,.shell-operation{min-height:38px;display:inline-flex;align-items:center;padding:0 12px;border:1px solid var(--line);border-radius:999px;background:#fff;font-weight:850;white-space:nowrap}.shell-terminal{background:var(--orange-soft);color:var(--orange)}.shell-operation{gap:8px}.shell-operation i{width:10px;height:10px;border-radius:50%;background:var(--green)}.shell-operation.offline i{background:var(--red)}\n' +
      '.shell-last-order{display:grid;gap:1px;min-width:92px}.shell-last-order small{color:var(--muted);font-size:12px}.shell-last-order strong{font-size:calc(20px * var(--responsive-font-scale))}.shell-actions{display:flex;align-items:center;gap:10px;min-width:0}\n' +
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
      '/* Global App Shell core mode: child pages retain their business logic while shell-owned chrome stays outside the page. */\n' +
      ':root[data-global-shell="1"] :is(.global-statusbar,.shell-bottom-nav,.bottom-nav,.topbar.statusbar){display:none}\n' +
      ':root[data-global-shell="1"] .app{height:100%;min-height:0}\n' +
      ':root[data-global-shell="1"] .workspace{min-height:0}\n' +
      ':root[data-global-shell="1"] body[data-page="more"] .more-heading{display:none}\n' +
      '\n' +
      ':root{--shadow-soft:0 4px 16px rgba(76,46,28,.08);--shadow-press:0 2px 7px rgba(76,46,28,.11);--radius-control:12px;--radius-card:18px;--motion-standard:cubic-bezier(.22,1,.36,1)}\n' +
      'button{-webkit-tap-highlight-color:transparent;touch-action:manipulation;transition:transform .16s var(--motion-standard),box-shadow .18s ease,background-color .18s ease,border-color .18s ease,color .18s ease,opacity .18s ease}\n' +
      'button:active:not(:disabled){transform:translateY(1px) scale(.975);box-shadow:var(--shadow-press)}\n' +
      'button:disabled{cursor:not-allowed;opacity:.42}\n' +
      'button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid color-mix(in srgb,var(--orange) 28%,transparent'... 1007 more characters
    
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
      --bottom-nav-pad-y:clamp(3px,.55vh,6px);
      --bottom-nav-icon-size:clamp(21px,2.45vh,25px);
      --bottom-nav-item-pad-y:clamp(2px,.35vh,4px);
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
    .bottom-nav{height:auto;min-height:calc(var(--bottom-nav-height) + env(safe-area-inset-bottom));display:grid;grid-template-columns:repeat(5,1fr);align-items:stretch;gap:10px;padding:var(--bottom-nav-pad-y) 16px calc(var(--bottom-nav-pad-y) + env(safe-area-inset-bottom));background:#fff;border-top:1px solid var(--line);flex:none;overflow:visible}
    .bottom-nav button{position:relative;border:1px solid transparent;background:#fff;font-weight:850;font-size:calc(17px * var(--responsive-font-scale));line-height:1.15}
    .shell-nav-button{display:grid;grid-template-rows:var(--bottom-nav-icon-size) auto;place-content:center;place-items:center;gap:2px;min-width:0;padding:var(--bottom-nav-item-pad-y) 12px;border-radius:var(--choice-pill-radius);overflow:visible}
    .shell-nav-button.active{background:var(--orange-soft);border-color:color-mix(in srgb,var(--orange) 44%,white);color:var(--orange);box-shadow:0 3px 12px color-mix(in srgb,var(--orange) 15%,transparent)}
    .shell-nav-icon{width:var(--bottom-nav-icon-size);height:var(--bottom-nav-icon-size);display:block;flex:none}
    .shell-nav-badge{position:absolute;top:3px;left:calc(50% + 10px);min-width:20px;height:20px;padding:0 5px;display:grid;place-items:center;border-radius:999px;background:var(--red);color:#fff;font-size:11px}
    
    :is(.top-btn,.category-page>button,.category-search,.categories>button,.segmented>button,.channels>button,.payments>button,.option-grid>button,.option-chips>button,.source-picker>button,.tabs>button,.status-filter>button,.mode-choice,.issue-quick>button,.method-grid>button,.theme){border-radius:var(--choice-pill-radius)!important}
    :is(.top-btn,.category-page>button,.category-search,.categories>button,.segmented>button,.channels>button,.payments>button,.option-grid>button,.option-chips>button,.source-picker>button,.tabs>button,.status-filter>button,.mode-choice,.issue-quick>button,.method-grid>button,.theme).active{background:var(--orange-soft)!important;border-color:color-mix(in srgb,var(--orange) 56%,white)!important;color:var(--orange)!important;box-shadow:0 3px 11px color-mix(in srgb,var(--orange) 14%,transparent)}
    .global-statusbar{height:var(--topbar-height);min-height:var(--topbar-height)}
    .shell-brand{display:flex;align-items:center;gap:9px;white-space:nowrap}.shell-brand-mark{width:38px;height:38px;display:grid;place-items:center;border-radius:50%;background:var(--orange);color:#fff;font-size:19px}.shell-brand strong{font-size:calc(25px * var(--responsive-font-scale))}
    .shell-terminal,.shell-context,.shell-operation{min-height:38px;display:inline-flex;align-items:center;padding:0 12px;border:1px solid var(--line);border-radius:999px;background:#fff;font-weight:850;white-space:nowrap}.shell-terminal{background:var(--orange-soft);color:var(--orange)}.shell-operation{gap:8px}.shell-operation i{width:10px;height:10px;border-radius:50%;background:var(--green)}.shell-operation.offline i{background:var(--red)}
    .shell-last-order{display:grid;gap:1px;min-width:92px}.shell-last-order small{color:var(--muted);font-size:12px}.shell-last-order strong{font-size:calc(20px * var(--responsive-font-scale))}.shell-actions{display:flex;align-items:center;gap:10px;min-width:0}
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
    
    /* Global App Shell core mode: child pages retain their business logic while shell-owned chrome stays outside the page. */
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
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:120:10)
    async Test.run (node:internal/test_runner/test:1054:7)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: quick drinks are a collapsed upward drawer with reorder controls
ok 140 - quick drinks are a collapsed upward drawer with reorder controls
  ---
  duration_ms: 0.440383
  type: 'test'
  ...
# Subtest: drink editor supports multiple configuration groups without forced images
ok 141 - drink editor supports multiple configuration groups without forced images
  ---
  duration_ms: 0.194584
  type: 'test'
  ...
# Subtest: completion exposes automatic, specified, and demo link-up flows
ok 142 - completion exposes automatic, specified, and demo link-up flows
  ---
  duration_ms: 0.116949
  type: 'test'
  ...
# Subtest: large product grid reserves complete rows and never overlaps cards
ok 143 - large product grid reserves complete rows and never overlaps cards
  ---
  duration_ms: 0.197238
  type: 'test'
  ...
# Subtest: collapsed quick drinks use the approved centred pill above navigation
ok 144 - collapsed quick drinks use the approved centred pill above navigation
  ---
  duration_ms: 0.196036
  type: 'test'
  ...
# Subtest: operational surfaces include sold-out preview and new-order toast
ok 145 - operational surfaces include sold-out preview and new-order toast
  ---
  duration_ms: 0.145191
  type: 'test'
  ...
# Subtest: 分類列最右固定搜尋入口並可按名稱或編號篩選產品
ok 146 - 分類列最右固定搜尋入口並可按名稱或編號篩選產品
  ---
  duration_ms: 0.380051
  type: 'test'
  ...
# Subtest: 分類列讀取後台全局設定並按五六七格及一兩行輸出版面
ok 147 - 分類列讀取後台全局設定並按五六七格及一兩行輸出版面
  ---
  duration_ms: 0.153076
  type: 'test'
  ...
# Subtest: 新單提示最少一張產品卡闊及兩張產品卡高
ok 148 - 新單提示最少一張產品卡闊及兩張產品卡高
  ---
  duration_ms: 0.210063
  type: 'test'
  ...
# Subtest: 快捷飲品展開後八秒無操作自動收起並於操作時重時計時
ok 149 - 快捷飲品展開後八秒無操作自動收起並於操作時重時計時
  ---
  duration_ms: 0.137678
  type: 'test'
  ...
# Subtest: sold-out preview reads the same local supply status as the badge
ok 150 - sold-out preview reads the same local supply status as the badge
  ---
  duration_ms: 0.103444
  type: 'test'
  ...
# Subtest: order cards distinguish sold-out orange from paused red without greying
ok 151 - order cards distinguish sold-out orange from paused red without greying
  ---
  duration_ms: 0.194614
  type: 'test'
  ...
# Subtest: paused products sort to the end of their current order category
not ok 152 - paused products sort to the end of their current order category
  ---
  duration_ms: 0.398926
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:206:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /const filtered=sortPausedLast/. Input:
    
    "import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';\n" +
      "import {ORDER_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,SETTINGS_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,DINE_STORAGE_KEY,SUPPLY_STORAGE_KEY,PRINTER_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';\n" +
      "import {clearExpiredBusinessDayDrafts,createDraftRecord,normalizeTerminalId,restoreDraftForTerminal} from '../../shared/operations.js';\n" +
      "import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';\n" +
      "import {orderPageConfig as defaults} from './page-config.js';\n" +
      "import {categories as fallbackCategories,products as fallbackProducts,drinks as fallbackDrinks,optionSets} from './page-data.js';\n" +
      "import {loadMenuCatalog,MENU_CACHE_KEY} from './menu-api.js';\n" +
      "import {acceptPendingOrder,combineRiceballSet,dissolveRiceballSet,completeExpiredOrders,createWhatsAppLink,updateCartLineQuantity,CART_VIEW_INPUT,CART_VIEW_ORGANIZED,SERVICE_TAKEAWAY,SERVICE_DINE_IN,normalizeCartViewMode,normalizeServiceMode,resolveInitialOrderServiceMode,applyOrderServiceMode,toggleLineServiceMode,cartForView,inferOrderServiceMode} from './order-domain.js';\n" +
      "import {commitTableOrder,createInitialDineState,cleanupEmptyDineSessions} from '../dine/dine-domain.js';\n" +
      "import {defaultPrinterState,importExternalPrintJobs} from '../more/print-domain.js';\n" +
      "import {buildCategoryLayout,normalizeCategoryLayout} from './category-layout.js';\n" +
      "import {renderGlobalStatusBar,renderBottomNav} from '../../shared/shell.js';\n" +
      "import {activeDineOrderIdentities,latestOrderDisplayNumber} from '../../shared/order-identity.js';\n" +
      '\n' +
      "const app=document.getElementById('app');\n" +
      'const fallbackCatalog={categories:fallbackCategories,products:fallbackProducts,drinks:fallbackDrinks};\n' +
      'const cachedCatalog=readJSON(MENU_CACHE_KEY,null);\n' +
      'const initialCatalog=cachedCatalog?.products?.length?cachedCatalog:fallbackCatalog;\n' +
      'let categories=[...(initialCatalog.categories||fallbackCategories)],products=[...(initialCatalog.products||fallbackProducts)],drinks=[...(initialCatalog.drinks||fallbackDrinks)];\n' +
      'let productMap=new Map(),drinkMap=new Map(),snackProducts=[],drinkProducts=[];\n' +
      'function indexCatalog(){\n' +
      '  productMap=new Map(products.map(item=>[item.id,item]));\n' +
      '  drinkMap=new Map(drinks.map(item=>[item.id,item]));\n' +
      "  snackProducts=products.filter(item=>item.linkRole==='snack');\n" +
      "  drinkProducts=products.filter(item=>item.linkRole==='drink');\n" +
      '}\n' +
      'indexCatalog();\n' +
      'let modal=null;\n' +
      'const supplyOverrides=readJSON(SUPPLY_STORAGE_KEY,{})||{};\n' +
      "function supplyStatus(product){return supplyOverrides[product.id]?.status||(product.available===false?'soldout':'available');}\n" +
      "function supplyLabel(status){return status==='soldout'?'今日售罄':status==='paused'?'暫停供應':'供應中';}\n" +
      "function sortPausedLast(items){return items.map((item,index)=>({item,index})).sort((a,b)=>Number(supplyStatus(a.item)==='paused')-Number(supplyStatus(b.item)==='paused')||a.index-b.index).map(row=>row.item);}\n" +
      'let confirmState=null;\n' +
      "let newOrderNotice={id:'A516',source:'磨飯 App',items:3,amount:104,visible:true};\n" +
      'const demoPendingOrders={\n' +
      "  online:[{id:'A512',source:'磨飯 App',contact:'陳小姐',phone:'85291234567',items:5,amount:168,wait:'2 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'FPS',proof:'../../assets/products/f4.webp',lines:[['蜜糖雞絲＋鹽酥雞',2,90],['台式奶茶',2,32],['香脆雞翼',1,18]]},{id:'W331',source:'網頁',contact:'梁先生',phone:'85262345678',items:3,amount:62,wait:'1 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'PayMe',proof:'../../assets/products/f1.webp',lines:[['原味紫米飯團',1,41],['味噌湯',1,12],['可樂',1,9]]}],\n" +
      "  queue:[{id:'T1824',source:'電話',contact:'電話尾號 1824',phone:'85261231824',items:2,amount:96,wait:'4 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'待確認',proof:'',lines:[['自選便當',2,96]]},{id:'T6631',source:'WhatsApp',contact:'WhatsApp 尾號 6631',phone:'85261236631',items:1,amount:59,wait:'6 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'FPS',proof:'',lines:[['紫米飯團 A 餐',1,59]]}]\n" +
      '};\n' +
      '\n' +
      'const saved=readJSON(ORDER_STORAGE_KEY,null);\n' +
      'const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});\n' +
      'let drafts=readJSON(DRAFT_STORAGE_KEY,[]);\n' +
      'const expiredDrafts=clearExpiredBusinessDayDrafts(drafts);\n' +
      'if(expiredDrafts.voided.length){drafts=expiredDrafts.remaining;writeJSON(DRAFT_STORAGE_KEY,drafts);}\n' +
      'let draftCounters=readJSON(DRAFT_COUNTER_STORAGE_KEY,{});\n' +
      "const terminalId=normalizeTerminalId(localStorage.getItem(TERMINAL_ID_STORAGE_KEY)||new URLSearchParams(location.search).get('terminal')||'SMT');\n" +
      'localStorage.setItem(TERMINAL_ID_STORAGE_KEY,terminalId);\n' +
      'const settings={\n' +
      '  catalog:{...defaults.catalog,showImages:true,...(savedSettings.catalog||{}),productOverrides:{}},\n' +
      '  categoryLayout:normalizeCategoryLayout(savedSettings.categoryLayout||defaults.categoryLayout),\n' +
      '  cart:{...defaults.cart,...(savedSettings.cart||{}),viewMode:normalizeCartViewMode(savedSettings.cartViewMode||savedSettings.cart?.viewMode)},\n' +
      '  quickDrinks:{...defaults.quickDrinks,...(savedSettings.quickDrinks||{})}\n' +
      '};\n' +
      'function syncDinePrintJobs(dineState){\n' +
      '  const current=readJSON(PRINTER_STORAGE_KEY,null)||defaultPrinterState();\n' +
      '  writeJSON(PRINTER_STORAGE_KEY,importExternalPrintJobs(current,{dine:dineState}));\n' +
      '}\n' +
      '\n' +
      "function drinkSelection(id,sweetness='',ice=''){\n" +
      '  const d=drinkMap.get(id);\n' +
      '  return {drinkId:id,name:d?.name||id,unitPrice:d?.price||0,sweetness,ice,studentDiscountEligible:d?.studentDiscountEligible===true,specialDrinkSurcharge:Number(d?.specialDrinkSurcharge)||0};\n' +
      '}\n' +
      "function makeLine(productId,qty=1,{options={},drinkAssignments=[],linkedComboId='',linkedQty=0,serviceMode=SERVICE_TAKEAWAY}={}){\n" +
      '  const p=productMap.get(productId);\n' +
      '  qty=Math.max(1,Number(qty)||1);\n' +
      '  return {\n' +
      "    lineId:stableId('line'),productId,name:p.name,image:p.image,category:p.category,qty,\n" +
      '    unitPrice:p.price,total:p.price*qty,options:safeClone(options),\n' +
      '    studentDiscountEligible:p.studentDiscountEligible===true,specialDrinkSurcharge:Number(p.specialDrinkSurcharge)||0,\n' +
      '    drinkAssignments:safeClone(drinkAssignments),drinkSlots:(p.drinkSlots||0)*qty,\n' +
      "    required:[...(p.required||[])],combinable:Boolean(p.combinable),linkRole:p.linkRole||'',\n" +
      "    serviceMode:normalizeServiceMode(serviceMode,SERVICE_TAKEAWAY),serviceModeOverride:'',\n" +
      '    linkedComboId,linkedQty,createdOrder:Date.now()+Math.random()\n' +
      '  };\n' +
      '}\n' +
      'function normalizeCart(cart,defaultMode=SERVICE_TAKEAWAY){\n' +
      '  return (Array.isArray(cart)?cart:[]).map((line,index)=>{\n' +
      '    const p=productMap.get(line.productId)||{};\n' +
      '    const qty=Math.max(1,Number(line.qty)||1);\n' +
      '    const unitPrice=Number(line.unitPrice??p.price??0);\n' +
      '    const serviceMode=normalizeServiceMode(line.serviceMode,defaultMode);\n' +
      "    return {...line,lineId:line.lineId||stableId('line'),name:line.name||p.name||'餐點',image:line.image||p.image||'',category:line.category||p.category||'',qty,unitPrice,total:unitPrice*qty,serviceMode,serviceModeOverride:line.serviceModeOverride||'',options:{...(line.options||{})},studentDiscountEligible:line.studentDiscountEligible===true||p.studentDiscountEligible===true,specialDrinkSurcharge:Number(line.specialDrinkSurcharge??p.specialDrinkSurcharge)||0,drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],drinkSlots:Number(line.drinkSlots??(p.drinkSlots||0)*qty),required:Array.isArray(line.required)?line.required:[...(p.required||[])],combinable:Boolean(line.combinable??p.combinable),linkRole:line.linkRole||p.linkRole||'',linkedComboId:line.linkedComboId||'',linkedQty:Number(line.linkedQty||0),createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:index};\n" +
      '  }).sort((a,b)=>a.createdOrder-b.createdOrder);\n' +
      '}\n' +
      "function mergeKey(line){return JSON.stringify({productId:line.productId,serviceMode:line.serviceMode,options:line.options,drinks:line.drinkAssignments.map(d=>[d.drinkId,d.sweetness||'',d.ice||'']),linkedComboId:line.linkedComboId});}\n" +
      'function mergeCart(cart,mode){\n' +
      "  const rows=normalizeCart(cart);if(mode==='never')return rows;\n" +
      '  const out=[];\n' +
      '  rows.forEach(line=>{\n' +
      "    const found=line.lineType==='combo'?null:out.find(item=>item.productId===line.productId&&(mode==='always'||mergeKey(item)===mergeKey(line)));\n" +
      '    if(!found){out.push(safeClone(line));return;}\n' +
      '    found.qty+=line.qty;found.total=found.unitPrice*found.qty;found.drinkSlots+=line.drinkSlots;found.drinkAssignments.push(...safeClone(line.drinkAssignments));\n' +
      '  });\n' +
      '  return out;\n' +
      '}\n' +
      'function describe(line){\n' +
      '  const parts=[];\n' +
      "  if(line.lineType==='combo'){\n" +
      '    const names=(line.combo?.components||[]).map(item=>item.name).filter(Boolean);\n' +
      "    if(names.length)parts.push(names.join('＋'));\n" +
      "    if(line.combo?.discount)parts.push('套餐優惠 -'+money(line.combo.discount));\n" +
      '  }\n' +
      "  Object.entries(line.options||{}).forEach(([key,value])=>{if(value)parts.push(Array.isArray(value)?value.join('、'):value);});\n" +
      '  const grouped={};\n' +
      "  (line.drinkAssignments||[]).forEach(d=>{const key=[d.name,d.sweetness||'',d.ice||''].join('|');grouped[key]=(grouped[key]||0)+1;});\n" +
      "  Object.entries(grouped).forEach(([key,count])=>{const [name,sweet,ice]=key.split('|');const mods=[sweet,ice].filter(Boolean).join(' · ');parts.push(name+(mods?' · '+mods:'')+(count>1?' ×'+count:''));});\n" +
      "  if(line.linkedComboId)parts.push('已組合套餐'+(line.linkedQty>1?' ×'+line.linkedQty:''));\n" +
      '  const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);\n' +
      "  if(missing&&line.required.includes('drink'))parts.push('尚欠飲品 '+missing+' 份');\n" +
      "  return parts.join(' · ')||'標準';\n" +
      '}\n' +
      'function missingGroups(line){\n' +
      '  const groups=[];\n' +
      '  (line.required||[]).forEach(group=>{\n' +
      "    if(group==='drink'){\n" +
      '      const count=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);\n' +
      "      if(count)groups.push({group,label:'飲品',count});\n" +
      "    }else if(!line.options?.[group]) groups.push({group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':'小食',count:line.qty||1});\n" +
      '  });\n' +
      '  return groups;\n' +
      '}\n' +
      'function pendingSummary(cart){\n' +
      '  const out={rice:0,sauce:0,snack:0,drink:0,total:0};\n' +
      '  cart.forEach(line=>missingGroups(line).forEach(item=>{out[item.group]+=item.count;out.total+=item.count;}));\n' +
      '  ret'... 90308 more characters
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';
    import {ORDER_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,SETTINGS_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,DINE_STORAGE_KEY,SUPPLY_STORAGE_KEY,PRINTER_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';
    import {clearExpiredBusinessDayDrafts,createDraftRecord,normalizeTerminalId,restoreDraftForTerminal} from '../../shared/operations.js';
    import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';
    import {orderPageConfig as defaults} from './page-config.js';
    import {categories as fallbackCategories,products as fallbackProducts,drinks as fallbackDrinks,optionSets} from './page-data.js';
    import {loadMenuCatalog,MENU_CACHE_KEY} from './menu-api.js';
    import {acceptPendingOrder,combineRiceballSet,dissolveRiceballSet,completeExpiredOrders,createWhatsAppLink,updateCartLineQuantity,CART_VIEW_INPUT,CART_VIEW_ORGANIZED,SERVICE_TAKEAWAY,SERVICE_DINE_IN,normalizeCartViewMode,normalizeServiceMode,resolveInitialOrderServiceMode,applyOrderServiceMode,toggleLineServiceMode,cartForView,inferOrderServiceMode} from './order-domain.js';
    import {commitTableOrder,createInitialDineState,cleanupEmptyDineSessions} from '../dine/dine-domain.js';
    import {defaultPrinterState,importExternalPrintJobs} from '../more/print-domain.js';
    import {buildCategoryLayout,normalizeCategoryLayout} from './category-layout.js';
    import {renderGlobalStatusBar,renderBottomNav} from '../../shared/shell.js';
    import {activeDineOrderIdentities,latestOrderDisplayNumber} from '../../shared/order-identity.js';
    
    const app=document.getElementById('app');
    const fallbackCatalog={categories:fallbackCategories,products:fallbackProducts,drinks:fallbackDrinks};
    const cachedCatalog=readJSON(MENU_CACHE_KEY,null);
    const initialCatalog=cachedCatalog?.products?.length?cachedCatalog:fallbackCatalog;
    let categories=[...(initialCatalog.categories||fallbackCategories)],products=[...(initialCatalog.products||fallbackProducts)],drinks=[...(initialCatalog.drinks||fallbackDrinks)];
    let productMap=new Map(),drinkMap=new Map(),snackProducts=[],drinkProducts=[];
    function indexCatalog(){
      productMap=new Map(products.map(item=>[item.id,item]));
      drinkMap=new Map(drinks.map(item=>[item.id,item]));
      snackProducts=products.filter(item=>item.linkRole==='snack');
      drinkProducts=products.filter(item=>item.linkRole==='drink');
    }
    indexCatalog();
    let modal=null;
    const supplyOverrides=readJSON(SUPPLY_STORAGE_KEY,{})||{};
    function supplyStatus(product){return supplyOverrides[product.id]?.status||(product.available===false?'soldout':'available');}
    function supplyLabel(status){return status==='soldout'?'今日售罄':status==='paused'?'暫停供應':'供應中';}
    function sortPausedLast(items){return items.map((item,index)=>({item,index})).sort((a,b)=>Number(supplyStatus(a.item)==='paused')-Number(supplyStatus(b.item)==='paused')||a.index-b.index).map(row=>row.item);}
    let confirmState=null;
    let newOrderNotice={id:'A516',source:'磨飯 App',items:3,amount:104,visible:true};
    const demoPendingOrders={
      online:[{id:'A512',source:'磨飯 App',contact:'陳小姐',phone:'85291234567',items:5,amount:168,wait:'2 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'FPS',proof:'../../assets/products/f4.webp',lines:[['蜜糖雞絲＋鹽酥雞',2,90],['台式奶茶',2,32],['香脆雞翼',1,18]]},{id:'W331',source:'網頁',contact:'梁先生',phone:'85262345678',items:3,amount:62,wait:'1 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'PayMe',proof:'../../assets/products/f1.webp',lines:[['原味紫米飯團',1,41],['味噌湯',1,12],['可樂',1,9]]}],
      queue:[{id:'T1824',source:'電話',contact:'電話尾號 1824',phone:'85261231824',items:2,amount:96,wait:'4 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'待確認',proof:'',lines:[['自選便當',2,96]]},{id:'T6631',source:'WhatsApp',contact:'WhatsApp 尾號 6631',phone:'85261236631',items:1,amount:59,wait:'6 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'FPS',proof:'',lines:[['紫米飯團 A 餐',1,59]]}]
    };
    
    const saved=readJSON(ORDER_STORAGE_KEY,null);
    const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});
    let drafts=readJSON(DRAFT_STORAGE_KEY,[]);
    const expiredDrafts=clearExpiredBusinessDayDrafts(drafts);
    if(expiredDrafts.voided.length){drafts=expiredDrafts.remaining;writeJSON(DRAFT_STORAGE_KEY,drafts);}
    let draftCounters=readJSON(DRAFT_COUNTER_STORAGE_KEY,{});
    const terminalId=normalizeTerminalId(localStorage.getItem(TERMINAL_ID_STORAGE_KEY)||new URLSearchParams(location.search).get('terminal')||'SMT');
    localStorage.setItem(TERMINAL_ID_STORAGE_KEY,terminalId);
    const settings={
      catalog:{...defaults.catalog,showImages:true,...(savedSettings.catalog||{}),productOverrides:{}},
      categoryLayout:normalizeCategoryLayout(savedSettings.categoryLayout||defaults.categoryLayout),
      cart:{...defaults.cart,...(savedSettings.cart||{}),viewMode:normalizeCartViewMode(savedSettings.cartViewMode||savedSettings.cart?.viewMode)},
      quickDrinks:{...defaults.quickDrinks,...(savedSettings.quickDrinks||{})}
    };
    function syncDinePrintJobs(dineState){
      const current=readJSON(PRINTER_STORAGE_KEY,null)||defaultPrinterState();
      writeJSON(PRINTER_STORAGE_KEY,importExternalPrintJobs(current,{dine:dineState}));
    }
    
    function drinkSelection(id,sweetness='',ice=''){
      const d=drinkMap.get(id);
      return {drinkId:id,name:d?.name||id,unitPrice:d?.price||0,sweetness,ice,studentDiscountEligible:d?.studentDiscountEligible===true,specialDrinkSurcharge:Number(d?.specialDrinkSurcharge)||0};
    }
    function makeLine(productId,qty=1,{options={},drinkAssignments=[],linkedComboId='',linkedQty=0,serviceMode=SERVICE_TAKEAWAY}={}){
      const p=productMap.get(productId);
      qty=Math.max(1,Number(qty)||1);
      return {
        lineId:stableId('line'),productId,name:p.name,image:p.image,category:p.category,qty,
        unitPrice:p.price,total:p.price*qty,options:safeClone(options),
        studentDiscountEligible:p.studentDiscountEligible===true,specialDrinkSurcharge:Number(p.specialDrinkSurcharge)||0,
        drinkAssignments:safeClone(drinkAssignments),drinkSlots:(p.drinkSlots||0)*qty,
        required:[...(p.required||[])],combinable:Boolean(p.combinable),linkRole:p.linkRole||'',
        serviceMode:normalizeServiceMode(serviceMode,SERVICE_TAKEAWAY),serviceModeOverride:'',
        linkedComboId,linkedQty,createdOrder:Date.now()+Math.random()
      };
    }
    function normalizeCart(cart,defaultMode=SERVICE_TAKEAWAY){
      return (Array.isArray(cart)?cart:[]).map((line,index)=>{
        const p=productMap.get(line.productId)||{};
        const qty=Math.max(1,Number(line.qty)||1);
        const unitPrice=Number(line.unitPrice??p.price??0);
        const serviceMode=normalizeServiceMode(line.serviceMode,defaultMode);
        return {...line,lineId:line.lineId||stableId('line'),name:line.name||p.name||'餐點',image:line.image||p.image||'',category:line.category||p.category||'',qty,unitPrice,total:unitPrice*qty,serviceMode,serviceModeOverride:line.serviceModeOverride||'',options:{...(line.options||{})},studentDiscountEligible:line.studentDiscountEligible===true||p.studentDiscountEligible===true,specialDrinkSurcharge:Number(line.specialDrinkSurcharge??p.specialDrinkSurcharge)||0,drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],drinkSlots:Number(line.drinkSlots??(p.drinkSlots||0)*qty),required:Array.isArray(line.required)?line.required:[...(p.required||[])],combinable:Boolean(line.combinable??p.combinable),linkRole:line.linkRole||p.linkRole||'',linkedComboId:line.linkedComboId||'',linkedQty:Number(line.linkedQty||0),createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:index};
      }).sort((a,b)=>a.createdOrder-b.createdOrder);
    }
    function mergeKey(line){return JSON.stringify({productId:line.productId,serviceMode:line.serviceMode,options:line.options,drinks:line.drinkAssignments.map(d=>[d.drinkId,d.sweetness||'',d.ice||'']),linkedComboId:line.linkedComboId});}
    function mergeCart(cart,mode){
      const rows=normalizeCart(cart);if(mode==='never')return rows;
      const out=[];
      rows.forEach(line=>{
        const found=line.lineType==='combo'?null:out.find(item=>item.productId===line.productId&&(mode==='always'||mergeKey(item)===mergeKey(line)));
        if(!found){out.push(safeClone(line));return;}
        found.qty+=line.qty;found.total=found.unitPrice*found.qty;found.drinkSlots+=line.drinkSlots;found.drinkAssignments.push(...safeClone(line.drinkAssignments));
      });
      return out;
    }
    function describe(line){
      const parts=[];
      if(line.lineType==='combo'){
        const names=(line.combo?.components||[]).map(item=>item.name).filter(Boolean);
        if(names.length)parts.push(names.join('＋'));
        if(line.combo?.discount)parts.push('套餐優惠 -'+money(line.combo.discount));
      }
      Object.entries(line.options||{}).forEach(([key,value])=>{if(value)parts.push(Array.isArray(value)?value.join('、'):value);});
      const grouped={};
      (line.drinkAssignments||[]).forEach(d=>{const key=[d.name,d.sweetness||'',d.ice||''].join('|');grouped[key]=(grouped[key]||0)+1;});
      Object.entries(grouped).forEach(([key,count])=>{const [name,sweet,ice]=key.split('|');const mods=[sweet,ice].filter(Boolean).join(' · ');parts.push(name+(mods?' · '+mods:'')+(count>1?' ×'+count:''));});
      if(line.linkedComboId)parts.push('已組合套餐'+(line.linkedQty>1?' ×'+line.linkedQty:''));
      const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
      if(missing&&line.required.includes('drink'))parts.push('尚欠飲品 '+missing+' 份');
      return parts.join(' · ')||'標準';
    }
    function missingGroups(line){
      const groups=[];
      (line.required||[]).forEach(group=>{
        if(group==='drink'){
          const count=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
          if(count)groups.push({group,label:'飲品',count});
        }else if(!line.options?.[group]) groups.push({group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':'小食',count:line.qty||1});
      });
      return groups;
    }
    function pendingSummary(cart){
      const out={rice:0,sauce:0,snack:0,drink:0,total:0};
      cart.forEach(line=>missingGroups(line).forEach(item=>{out[item.group]+=item.count;out.total+=item.count;}));
      return out;
    }
    function cartTotal(cart){return cart.reduce((sum,line)=>sum+Number(line.total||0),0);}
    function linkUpSummary(cart){
      const available=cart.filter(line=>line.lineType!=='combo'&&!line.linkedComboId);
      const riceballs=available.filter(line=>line.combinable).reduce((n,line)=>n+line.qty,0);
      const snacks=available.filter(line=>line.linkRole==='snack').reduce((n,line)=>n+line.qty,0);
      const standaloneDrinks=available.filter(line=>line.linkRole==='drink').reduce((n,line)=>n+line.qty,0);
      return {riceballs,snacks,drinks:standaloneDrinks,count:Math.min(riceballs,snacks)};
    }
    function applyLinkUp(count){
      if(!count)return;
      store.set(state=>{
        let next=state.cart;
        for(let index=0;index<count;index++){
          const main=next.find(line=>line.lineType!=='combo'&&line.combinable),snack=next.find(line=>line.lineType!=='combo'&&line.linkRole==='snack'),drink=next.find(line=>line.lineType!=='combo'&&line.linkRole==='drink');
          if(!main||!snack)break;
          next=combineRiceballSet(next,{mainLineId:main.lineId,snackLineId:snack.lineId,drinkLineId:drink?.lineId},{comboId:stableId('combo'),lineId:stableId('line'),comboPrice:59,source:'automatic'});
        }
        state.cart=normalizeCart(next,state.orderServiceMode);
        state.lastAffectedLineId=state.cart.at(-1)?.lineId||'';
        state.lastMutationKind='changed';
        return state;
      });
      queue.afterRender(()=>showToast('已組合 '+count+' 份飯團套餐'));
    }
    
    let initialCart=saved&&Array.isArray(saved.cart)?saved.cart:[];
    let initialDineContext=saved?.dineContext||null;
    if(initialDineContext){
      const dine=cleanupEmptyDineSessions(readJSON(DINE_STORAGE_KEY,null)||createInitialDineState());
      writeJSON(DINE_STORAGE_KEY,dine);
      const table=dine.tables.find(entry=>entry.id===String(initialDineContext.tableId));
      const stale=!table||(initialDineContext.sessionId&&table.session?.id!==initialDineContext.sessionId)||(!initialDineContext.sessionId&&!initialDineContext.startedFromFree&&table.status==='free');
      if(stale){initialDineContext=null;initialCart=[];}
    }
    const initialOrderServiceMode=resolveInitialOrderServiceMode(initialDineContext,initialCart.length?saved?.orderServiceMode:SERVICE_TAKEAWAY);
    initialCart=normalizeCart(initialCart,initialOrderServiceMode);
    const defaultHealth={catalog:{ok:false,label:'餐牌',detail:'正在連接'},api:{ok:false,label:'訂單 API',detail:'未連接'},printer:{ok:false,label:'打印機',detail:'未連接'},sync:{ok:false,label:'同步',detail:'等待 API'},backup:{ok:true,label:'備份',detail:'本機資料正常'}};
    const store=createStore({category:'全部',searchQuery:'',cart:initialCart,dineContext:initialDineContext,orderServiceMode:initialOrderServiceMode,cartViewMode:savedSettings.cartViewMode||settings.cart.viewMode||CART_VIEW_INPUT,lastAffectedLineId:'',lastMutationKind:'',collapsedCartCategories:[],settings,quickMode:saved?.quickMode??savedSettings.morePage?.quickMode??false,quickDrawerOpen:false,pendingOrders:safeClone(demoPendingOrders),runningOrders:[],completedOrders:[],operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false},health:defaultHealth},{storageKey:ORDER_STORAGE_KEY,persistState:state=>({cart:state.cart,dineContext:state.dineContext,orderServiceMode:state.orderServiceMode,cartViewMode:state.cartViewMode,quickMode:state.quickMode,draftSession:state.draftSession,pendingOrders:state.pendingOrders,runningOrders:state.runningOrders,completedOrders:state.completedOrders,operations:state.operations,settings:state.settings}),normalize:state=>({...state,searchQuery:String(state.searchQuery||''),dineContext:state.dineContext||null,orderServiceMode:normalizeServiceMode(state.dineContext?SERVICE_DINE_IN:state.orderServiceMode,SERVICE_TAKEAWAY),cartViewMode:normalizeCartViewMode(state.cartViewMode||settings.cart.viewMode),lastAffectedLineId:String(state.lastAffectedLineId||''),lastMutationKind:String(state.lastMutationKind||''),collapsedCartCategories:Array.isArray(state.collapsedCartCategories)?state.collapsedCartCategories:[],quickMode:Boolean(state.quickMode),quickDrawerOpen:Boolean(state.quickDrawerOpen),cart:normalizeCart(state.cart||[],state.dineContext?SERVICE_DINE_IN:state.orderServiceMode),pendingOrders:state.pendingOrders||safeClone(demoPendingOrders),runningOrders:Array.isArray(state.runningOrders)?state.runningOrders:[],completedOrders:Array.isArray(state.completedOrders)?state.completedOrders:[],settings:{...settings,...(state.settings||{}),categoryLayout:normalizeCategoryLayout(state.settings?.categoryLayout||settings.categoryLayout),catalog:{...settings.catalog,...(state.settings?.catalog||{})},cart:{...settings.cart,...(state.settings?.cart||{})},quickDrinks:{...settings.quickDrinks,...(state.settings?.quickDrinks||{})}},operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false,...(state.operations||{})},health:{...defaultHealth,...(state.health||{})}})});
    const QUICK_DRAWER_IDLE_MS=8000;
    let quickDrawerTimer=null;
    let recentTimer=null;
    let drinkFeedbackTimer=null;
    let pendingDrinkAssignment=null;
    let lastDrinkAssignment=null;
    let cartScrollTop=0;
    function scheduleQuickDrawerClose(){
      clearTimeout(quickDrawerTimer);
      if(!store.get().quickDrawerOpen)return;
      quickDrawerTimer=setTimeout(()=>store.setTransient(state=>({...state,quickDrawerOpen:false})),QUICK_DRAWER_IDLE_MS);
    }
    const queue=createRenderQueue(render);store.subscribe(state=>{queue.schedule();if(state.quickDrawerOpen)scheduleQuickDrawerClose();else clearTimeout(quickDrawerTimer);});
    installErrorBoundary({toast:showToast,report:error=>window.parent?.postMessage?.({type:'morefun:page-runtime-error',page:'order',message:String(error?.message||error)},'*')});
    
    function updateSettings(mutator){
      store.set(state=>{mutator(state.settings);writeJSON(SETTINGS_STORAGE_KEY,{...savedSettings,...state.settings,cartViewMode:state.cartViewMode});return state;});
    }
    function saveCartViewMode(mode){
      const cartViewMode=normalizeCartViewMode(mode);
      store.set(state=>({...state,cartViewMode,settings:{...state.settings,cart:{...state.settings.cart,viewMode:cartViewMode}}}));
      const persisted=readJSON(SETTINGS_STORAGE_KEY,{})||{};
      writeJSON(SETTINGS_STORAGE_KEY,{...persisted,cartViewMode,cart:{...(persisted.cart||{}),viewMode:cartViewMode}});
    }
    function orderedDrinks(){
      const configured=store.get().settings.quickDrinks.order||[];
      return [...configured,...drinks.map(item=>item.id).filter(id=>!configured.includes(id))].map(id=>drinkMap.get(id)).filter(Boolean);
    }
    function productTemplate(){return store.get().settings.catalog.defaultTemplate;}
    function drinkChoiceCard(d,action='select-drink',selected=false,context='default'){
      const imageMode=store.get().settings.quickDrinks.showImages!==false;
      return '<button class="drink-choice-card drink-card--'+context+' '+(imageMode?'is-image':'is-text')+' '+(selected?'selected':'')+'" data-action="'+action+'" data-id="'+d.id+'"><span>'+escapeHtml(d.name)+'</span>'+(imageMode?imageBlock(d.image,d.name,'drink-choice-img'):'')+'</button>';
    }
    function productCard(p){
      const template=productTemplate();const showCode=store.get().settings.catalog.showCode;const showDescription=store.get().settings.catalog.showDescription;
      const showProductImages=store.get().settings.catalog.showImages!==false;
      const action=store.get().quickMode?'quick-add-product':'open-product';
      const status=supplyStatus(p),unavailable=status!=='available',statusClass=status==='soldout'?'sold-out':status==='paused'?'paused':'';
      const code=showCode?'<small class="product-code">'+p.code+'</small>':'';
      const state=unavailable?'<em class="product-supply-state">'+supplyLabel(status)+'</em>':'';
      if(template==='text')return '<button class="product-card text '+statusClass+'" data-action="'+action+'" data-id="'+p.id+'" '+(unavailable?'disabled':'')+'><span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+state+'</span><b class="product-price">'+money(p.price)+'</b></button>';
      if(template==='small')return '<button class="product-card small '+statusClass+' '+(showProductImages?'':'no-product-image')+'" data-action="'+action+'" data-id="'+p.id+'" '+(unavailable?'disabled':'')+'>'+(showProductImages?imageBlock(p.image,p.name,'product-thumb'):'')+'<span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+state+'</span><b class="product-price">'+money(p.price)+'</b></button>';
      const description=showDescription&&p.description?'<p class="product-description">'+p.description+'</p>':'';
      return '<button class="product-card large '+statusClass+' '+(showProductImages?'':'no-product-image')+'" data-action="'+action+'" data-id="'+p.id+'" '+(unavailable?'disabled':'')+'>'+(showProductImages?imageBlock(p.image,p.name,'product-hero'):'')+'<div class="product-info"><span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+description+state+'</span><b class="product-price">'+money(p.price)+'</b></div></button>';
    }
    function cartLineRow(line,index,state){
      const showImages=state.settings.cart.showImages!==false;
      const recent=line.lineId===state.lastAffectedLineId;
      const override=Boolean(line.serviceModeOverride);
      const modeLabel=line.serviceMode===SERVICE_DINE_IN?'堂':'外';
      return '<article class="cart-row '+(showImages?'':'no-image')+' '+(recent?'is-recent':'')+'" data-line-id="'+escapeHtml(line.lineId)+'"><span class="seq-service"><span class="seq">'+(index+1)+'</span><button class="line-service-toggle '+(override?'is-override':'')+'" data-action="toggle-line-service" data-id="'+escapeHtml(line.lineId)+'" aria-label="切換'+escapeHtml(line.name)+'堂食外賣">'+modeLabel+'</button></span>'+(showImages?imageBlock(line.image,line.name,'cart-img'):'')+'<span class="cart-copy"><strong>'+escapeHtml(line.name)+'</strong><small>'+escapeHtml(describe(line))+'</small>'+(recent?'<em class="recent-badge">剛加入</em>':'')+'</span><b class="cart-price">'+money(line.total)+'</b><span class="cart-actions"><button data-action="cart-qty" data-id="'+line.lineId+'" data-delta="-1">−</button><strong>'+line.qty+'</strong><button data-action="cart-qty" data-id="'+line.lineId+'" data-delta="1">＋</button><button class="edit-button" data-action="edit-line" data-id="'+line.lineId+'">修改</button></span></article>';
    }
    function cartRows(){
      const state=store.get(),cart=cartForView(state.cart,state.cartViewMode);if(!cart.length)return '<div class="empty">購物車未有餐點</div>';
      if(state.cartViewMode===CART_VIEW_INPUT)return cart.map((line,index)=>cartLineRow(line,index,state)).join('');
      const grouped=new Map();cart.forEach(line=>{const category=line.category||productMap.get(line.productId)?.category||'其他';if(!grouped.has(category))grouped.set(category,[]);grouped.get(category).push(line);});
      let viewIndex=0;
      return [...grouped].map(([category,rows])=>{
        const collapsed=state.collapsedCartCategories.includes(category);
        const body=collapsed?'':rows.map(line=>cartLineRow(line,viewIndex++,state)).join('');
        if(collapsed)viewIndex+=rows.length;
        return '<section class="cart-category" data-category="'+escapeHtml(category)+'"><header><button class="cart-category-toggle" data-action="toggle-cart-category" data-value="'+escapeHtml(category)+'"><span>'+(collapsed?'▸':'▾')+'</span><strong>'+escapeHtml(category)+'</strong></button><span>'+rows.reduce((n,line)=>n+line.qty,0)+' 件</span></header>'+body+'</section>';
      }).join('');
    }
    function cartSummary(state){
      if(state.cartViewMode!==CART_VIEW_ORGANIZED||!state.cart.length)return '';
      const counts=new Map();cartForView(state.cart,CART_VIEW_ORGANIZED).forEach(line=>{const category=line.category||'其他';counts.set(category,(counts.get(category)||0)+Number(line.qty||0));});
      return '<div class="cart-summary-strip">'+[...counts].map(([category,count])=>'<span>'+escapeHtml(category)+' <b>'+count+'</b></span>').join('<span>｜</span>')+'</div>';
    }
    function findDrinkTarget(cart){return (cart||[]).find(line=>Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length)>0)||null;}
    function pendingArea(){
      const state=store.get();const required=pendingSummary(state.cart);const link=linkUpSummary(state.cart);
      return '<section class="pending-area '+(!required.total?'complete':'')+'"><button class="pending-receipt" data-action="open-completion"><strong>必選補齊</strong><span>'+(required.total?'尚欠 '+required.total+' 項':'全部完成')+'</span><b>整理</b></button><button data-action="linkup-all" data-count="'+link.count+'" '+(link.count?'':'disabled')+'>一鍵自動組合 '+link.count+'</button><button data-action="open-specified-link">指定配對</button></section>';
    }
    function quickDrinks(){
      const state=store.get();if(state.settings.quickDrinks.visible===false)return '';
      const order=orderedDrinks(),missing=pendingSummary(state.cart).drink,target=findDrinkTarget(state.cart);
      const context=(target||lastDrinkAssignment)?'<div class="quick-drink-context">'+(target?'<strong>正在補：'+escapeHtml(target.name)+'</strong>':'')+(lastDrinkAssignment?'<em>已配對：'+escapeHtml(lastDrinkAssignment.drink)+' → '+escapeHtml(lastDrinkAssignment.target)+'</em>':'')+'</div>':'';
      return '<section class="quick-drawer '+(state.quickDrawerOpen?'open':'')+'"><button class="quick-drawer-handle" data-action="toggle-quick-drawer"><span>快捷飲品</span><em>待補 '+missing+'</em><b>'+(state.quickDrawerOpen?'⌄':'⌃')+'</b></button>'+(state.quickDrawerOpen?'<div class="quick-drawer-panel"><header><strong>快捷飲品｜待補 '+missing+'</strong><button data-action="toggle-quick-drawer">×</button></header>'+context+'<div>'+order.filter(d=>d.available!==false).map(d=>drinkChoiceCard(d,'quick-drink',modal?.type==='drink'&&modal.drinkId===d.id,'drawer')).join('')+'</div></div>':'')+'</section>';
    }
    function operationLabel(state){if(state.operations.immediateStopped||!state.operations.acceptingOrders)return '已停止接單';if(state.operations.scheduledClose)return '接單至 '+state.operations.scheduledClose;return '接單中';}
    function healthIssueCount(state){return Object.values(state.health).filter(item=>!item.ok).length;}
    function pendingOrderCount(state){return Object.values(state.pendingOrders||{}).flat().length;}
    function topbar(){
      const state=store.get();const issues=healthIssueCount(state),pendingCount=pendingOrderCount(state),soldout=products.filter(item=>supplyStatus(item)!=='available').length;
      return renderGlobalStatusBar({terminalId,operationLabel:operationLabel(state),operationTone:state.operations.acceptingOrders&&!state.operations.immediateStopped?'online':'offline',lastOrder:latestOrderDisplayNumber([...readJSON(ORDER_HISTORY_STORAGE_KEY,[]),...activeDineOrderIdentities(readJSON(DINE_STORAGE_KEY,null))]),context:state.dineContext?'堂食｜'+state.dineContext.tableId+' 號枱':'',rightActions:'<button class="top-btn" data-action="toggle-pending-panel">待處理 <span class="badge">'+pendingCount+'</span></button><button class="top-btn" data-action="open-soldout">售罄 '+soldout+'</button><button class="top-btn quick-state '+(state.quickMode?'is-on':'is-off')+'" data-action="open-quick-settings">快捷 '+(state.quickMode?'ON':'OFF')+'</button><button class="top-btn health-button '+(issues?'has-error':'is-ok')+'" data-action="open-health"><span>'+(issues?'!':'✓')+'</span>'+(issues?'設備 '+issues:'設備正常')+'</button><button class="top-btn" data-action="open-settings">顯示設定</button>'});
    }
    function draftRows(selectedId=''){
      return drafts.map(d=>'<button class="draft-pick '+(selectedId===d.id?'selected':'')+'" data-action="select-draft" data-id="'+escapeHtml(d.id)+'"><strong>'+escapeHtml(d.draftNumber)+'</strong><small>'+new Date(d.createdAt).toLocaleTimeString('zh-HK',{hour:'2-digit',minute:'2-digit'})+'｜'+d.cart.reduce((n,l)=>n+Number(l.qty||0),0)+' 件｜'+money(cartTotal(d.cart))+'</small></button>').join('')||'<p class="receipt-empty">目前沒有暫存單</p>';
    }
    function tableGrid(){
      const dine=readJSON(DINE_STORAGE_KEY,null)||createInitialDineState(),tables=dine.tables;
      return tables.map(table=>{const minutes=table.status==='occupied'&&table.openedAt?Math.floor((Date.now()-table.openedAt)/60000):0;return '<button class="table-pick '+(table.status==='occupied'?'occupied':'free')+'" data-action="assign-table" data-id="'+escapeHtml(table.id)+'"><strong>'+(table.id==='戶外'?'戶外枱':table.id+' 號枱')+'</strong><small>'+(table.status==='occupied'?'使用中 '+minutes+' 分鐘':'未使用｜自動開枱')+'</small></button>';}).join('')||'<p class="receipt-empty">堂食枱資料未建立</p>';
    }
    function hangModal(){return '<aside class="modal-card order-transfer-card"><header><div><small>目前購物車 '+store.get().cart.reduce((n,l)=>n+l.qty,0)+' 件</small><strong>掛單／加入堂食</strong></div><button data-action="dismiss-modal">×</button></header><div class="transfer-grid"><section><h3>一般掛單</h3><div class="transfer-scroll">'+draftRows()+'</div><button class="save-draft-entry" data-action="add-draft">＋ 加入掛單</button></section><section><h3>堂食枱位｜九宮格</h3><p>撳枱號會立即正式落單、出製作單及所需標籤。</p><div class="table-pick-grid">'+tableGrid()+'</div></section></div><footer><button data-action="dismiss-modal">返回</button></footer></aside>';}
    function takeModal(){
      const selectedDraftId=modal.selectedDraftId||'';
      const selected=drafts.find(d=>d.id===selectedDraftId);
      const detail=selected?'<div class="draft-detail-head"><span><small>暫存編號</small><strong>'+escapeHtml(selected.draftNumber)+'</strong></span><span><small>建立時間</small><strong>'+new Date(selected.createdAt).toLocaleTimeString('zh-HK',{hour:'2-digit',minute:'2-digit'})+'</strong></span><span><small>合計</small><strong>'+money(cartTotal(selected.cart))+'</strong></span></div><div class="draft-detail-lines">'+selected.cart.map((line,index)=>'<article><b>'+(index+1)+'</b><span><strong>'+escapeHtml(line.name)+' ×'+line.qty+'</strong><small>'+escapeHtml(describe(line))+'</small></span><em>'+money(line.total)+'</em></article>').join('')+'</div>':'<div class="draft-empty-detail"><b>請選擇左邊暫存單</b><p>右邊會顯示完整餐點內容，確認後先取回。</p></div>';
      return '<aside class="modal-card order-transfer-card take-card"><header><div><small>目前終端 '+terminalId+'</small><strong>取單</strong></div><button data-action="dismiss-modal">×</button></header><div class="transfer-grid"><section><h3>暫存單列表</h3><div class="transfer-scroll">'+draftRows(selectedDraftId)+'</div></section><section><h3>暫存單內容</h3>'+detail+'</section></div><footer><button data-action="dismiss-modal">返回</button><span></span><button class="danger" data-action="void-draft" '+(selected?'':'disabled')+'>作廢</button><button class="primary" data-action="restore-draft" data-id="'+escapeHtml(selected?.id||'')+'" '+(selected?'':'disabled')+'>取單</button></footer></aside>';
    }
    function pendingPanel(){
      const pendingOrders=store.get().pendingOrders;
      const rows=list=>list.map(x=>'<button data-action="process-pending-order" data-id="'+x.id+'"><span><strong>'+x.id+' · '+x.source+'</strong><small>'+x.contact+'</small></span><b>'+x.items+' 件 · '+money(x.amount)+'</b><small>等待 '+x.wait+' · 按下處理</small></button>').join('');
      return '<aside class="pending-panel modal-card"><header><strong>待處理</strong><button data-action="dismiss-modal">×</button></header><div class="pending-split"><section><h3>磨飯 App／網頁訂單</h3><div class="pending-scroll">'+rows(pendingOrders.online)+'</div></section><section><h3>電話／WhatsApp 排隊單</h3><div class="pending-scroll">'+rows(pendingOrders.queue)+'</div></section></div><footer class="single-action"><button data-action="dismiss-modal">返回</button></footer></aside>';
    }
    function pendingDetailModal(){
      const x=modal.order;
      return '<aside class="pending-panel modal-card"><header><div><small>'+x.source+'</small><strong>'+x.id+' · '+x.contact+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="pending-order-detail"><span>產品數量 <b>'+x.items+' 件</b></span><span>訂單金額 <b>'+money(x.amount)+'</b></span><span>等候時間 <b>'+x.wait+'</b></span><span>付款狀態 <b>'+x.paymentStatus+'</b></span><p>開始核對後會顯示完整產品、金額及付款證明；此時仍未正式接單。</p></div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="start-pending-review">開始核對</button></footer></aside>';
    }
    function pendingReviewModal(){
      const x=modal.order;const whatsapp=createWhatsAppLink(x.phone,(x.contact||'客人')+'，你好。磨飯訂單 '+x.id+' 正在核對中，請回覆或補充付款證明，謝謝。');
      const lines=(x.lines||[]).map(line=>'<div><span>'+escapeHtml(line[0])+' ×'+line[1]+'</span><b>'+money(line[2])+'</b></div>').join('');
      const proof=x.proof?'<button class="payment-proof" data-action="enlarge-proof">'+imageBlock(x.proof,'付款證明','payment-proof-image')+'<span>按下放大付款證明</span></button>':'<div class="payment-proof empty"><strong>尚未收到付款證明</strong><span>請用右方 WhatsApp QR Code 聯絡客人</span></div>';
      return '<aside class="pending-review-card modal-card"><header><div><small>'+x.source+' · 訂單核對</small><strong>'+x.id+' · '+x.contact+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="pending-review-body"><section class="review-order"><div class="review-summary"><span>產品 <b>'+x.items+' 件</b></span><span>總額 <b>'+money(x.amount)+'</b></span><span>付款 <b>'+x.paymentMethod+'</b></span></div><div class="review-lines">'+lines+'</div><div class="payment-status"><span>付款狀態</span><strong>'+x.paymentStatus+'</strong></div>'+proof+'</section><aside class="whatsapp-qr"><strong>WhatsApp QR Code</strong><p>公司電話掃描後，直接開啟客人對話及預設訊息。</p><div class="qr-code" data-qr="'+escapeHtml(whatsapp)+'"></div><a href="'+escapeHtml(whatsapp)+'" target="_blank" rel="noopener">在此裝置開啟 WhatsApp</a></aside></div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button data-action="report-payment-issue">資料有問題</button><button class="primary" data-action="accept-pending-order" '+(x.proof?'':'disabled')+'>確認接單</button></footer></aside>';
    }
    function enlargedProofModal(){const x=modal.order;return '<aside class="proof-lightbox modal-card"><header><strong>'+x.id+' · 付款證明</strong><button data-action="back-to-pending-review">×</button></header>'+imageBlock(x.proof,'付款證明放大圖','proof-full')+'<footer class="right-action"><button data-action="back-to-pending-review">返回核對</button></footer></aside>';}
    function modalScrim(){return modal?'<div class="modal-scrim" aria-hidden="true"></div>':'';}
    function quickSettingsModal(){
      const state=store.get();const q=state.settings.quickDrinks;
      const order=orderedDrinks();
      return '<aside class="side-card modal-card quick-mode-card"><header><strong>快捷模式</strong><button data-action="dismiss-modal">×</button></header><div class="card-scroll"><div class="setting-block"><strong>點單模式</strong><div class="segmented"><button class="'+(!state.quickMode?'active':'')+'" data-action="set-order-mode" data-value="normal">普通模式</button><button class="'+(state.quickMode?'active':'')+'" data-action="set-order-mode" data-value="quick">快捷模式</button></div><small>快捷模式：點產品直接加入購物籃</small></div><div class="setting-row"><div><strong>快捷飲品抽屜</strong><small>平時收起，按下向上展開</small></div><button class="switch '+(q.visible!==false?'on':'')+'" data-action="toggle-quick-drink-strip"><i></i></button></div><div class="setting-block"><strong>飲品卡顯示</strong><div class="segmented"><button class="'+(q.showImages!==false?'active':'')+'" data-action="quick-display" data-value="image">圖片</button><button class="'+(q.showImages===false?'active':'')+'" data-action="quick-display" data-value="text">純文字</button></div></div><div class="setting-block"><strong>飲品排列</strong><div class="quick-order-list">'+order.map((d,index)=>'<div><span><b>'+(index+1)+'</b>'+escapeHtml(d.name)+'</span><span><button data-action="move-quick-drink" data-id="'+d.id+'" data-delta="-1" '+(!index?'disabled':'')+'>↑</button><button data-action="move-quick-drink" data-id="'+d.id+'" data-delta="1" '+(index===order.length-1?'disabled':'')+'>↓</button></span></div>').join('')+'</div></div><div class="setting-row"><div><strong>快捷補選</strong><small>只控制待補飲品快捷套用</small></div><button class="switch '+(q.quickAssist!==false?'on':'')+'" data-action="toggle-quick-assist"><i></i></button></div></div></aside>';
    }
    function settingsModal(){
      const state=store.get();const c=state.settings.catalog,w=Number(state.settings.cart.widthPercent||32);
      return '<aside class="side-card modal-card"><header><strong>顯示設定</strong><button data-action="dismiss-modal">×</button></header><div class="setting-block"><strong>購物籃比例</strong><div class="segmented three">'+[25,30,32].map(x=>'<button data-action="cart-width" data-value="'+x+'" class="'+(w===x?'active':'')+'">'+x+' / '+(100-x)+'</button>').join('')+'</div></div><div class="setting-row"><div><strong>顯示購物車產品圖片</strong><small>關閉後保留名稱、描述、價格與操作</small></div><button class="switch '+(state.settings.cart.showImages!==false?'on':'')+'" data-action="toggle-cart-images"><i></i></button></div><div class="setting-block"><strong>產品卡</strong><div class="segmented three"><button data-action="setting-card" data-value="large" class="'+(c.defaultTemplate==='large'?'active':'')+'">大圖</button><button data-action="setting-card" data-value="small" class="'+(c.defaultTemplate==='small'?'active':'')+'">小圖</button><button data-action="setting-card" data-value="text" class="'+(c.defaultTemplate==='text'?'active':'')+'">純文字</button></div></div><div class="setting-row"><div><strong>顯示產品 Code</strong><small>例如 F4、B1、S1</small></div><button class="switch '+(c.showCode?'on':'')+'" data-action="toggle-code"><i></i></button></div></aside>';
    }
    function healthModal(){const state=store.get();return '<aside class="side-card modal-card"><header><strong>系統狀態</strong><button data-action="dismiss-modal">×</button></header><div class="health-list">'+Object.values(state.health).map(item=>'<div class="health-row '+(item.ok?'ok':'bad')+'"><span>'+(item.ok?'✓':'!')+'</span><div><strong>'+item.label+'</strong><small>'+item.detail+'</small></div><b>'+(item.ok?'正常':'異常')+'</b></div>').join('')+'</div></aside>';}
    function statusModal(){
      const state=store.get(),ops=state.operations;
      return '<aside class="side-card modal-card"><header><strong>今日接單狀態</strong><button data-action="dismiss-modal">×</button></header><div class="setting-row"><div><strong>接受網絡／預約訂單</strong><small>'+operationLabel(state)+'</small></div><button class="switch '+(ops.acceptingOrders&&!ops.immediateStopped?'on':'')+'" data-action="toggle-accepting"><i></i></button></div><div class="setting-block"><label>今日停止接單時間</label><div class="time-row"><input id="scheduled-close" type="time" value="'+(ops.scheduledClose||'')+'"><button data-action="save-close-time">儲存</button></div></div><div class="setting-block"><button class="danger wide" data-action="immediate-stop">即時停止接單</button><button class="wide" data-action="resume-orders">恢復接單</button></div></aside>';
    }
    function soldoutModal(){
      const items=products.filter(item=>supplyStatus(item)!=='available');
      return '<aside class="side-card modal-card soldout-preview"><header><strong>售罄列表</strong><button data-action="dismiss-modal">×</button></header><div class="status-list">'+(items.length?items.map(item=>{const status=supplyStatus(item);return '<div class="'+status+'"><span><b>'+escapeHtml([item.code,item.name].filter(Boolean).join(' '))+'</b><small>'+escapeHtml(item.category||'未分類')+'</small></span><em>'+supplyLabel(supplyStatus(item))+'</em></div>';}).join(''):'<div><span><b>目前全部供應中</b><small>售罄管理頁更新後會即時顯示</small></span></div>')+'</div><footer class="right-action"><button data-action="dismiss-modal">返回</button></footer></aside>';
    }
    function pairingGroupCount(cart){
      const available=cart.filter(line=>line.lineType!=='combo'&&!line.linkedComboId),mains=available.filter(line=>line.combinable).reduce((n,line)=>n+line.qty,0),snacks=available.filter(line=>line.linkRole==='snack').reduce((n,line)=>n+line.qty,0);
      return Math.min(26,mains,snacks);
    }
    function specifiedLinkModal(){
      const available=store.get().cart.filter(line=>line.lineType!=='combo'&&!line.linkedComboId),groups=modal.draft.groups,active=Math.min(modal.draft.active,groups.length-1),current=groups[active]||{main:'',snack:'',drink:''};
      const roles=[['main','飯團／主餐',line=>line.combinable],['snack','小食',line=>line.linkRole==='snack']];
      const selectedCount=(lineId,role)=>groups.reduce((n,group)=>n+(group[role]===lineId?1:0),0),ready=groups.filter(group=>group.main&&group.snack).length;
      const cartDrinks=available.filter(line=>line.linkRole==='drink');
      const drinkCards='<section><strong>3. 飲品 <small>可稍後補選</small></strong><div class="link-candidates drink-link-candidates">'+drinks.map(d=>'<button data-action="select-link-drink" data-source="quick" data-id="quick:'+d.id+'" class="'+(current.drink==='quick:'+d.id?'selected':'')+'"><span>'+escapeHtml(d.name)+'</span><small>快捷飲品</small></button>').join('')+cartDrinks.map(line=>{const used=selectedCount(line.lineId,'drink'),selected=current.drink===line.lineId,full=used>=line.qty&&!selected;return '<button data-action="select-link-drink" data-source="cart" data-id="'+line.lineId+'" class="'+(selected?'selected':'')+'" '+(full?'disabled':'')+'><span>'+escapeHtml(line.name)+'</span><small>購物車 '+Math.max(0,line.qty-used+(selected?1:0))+'／'+line.qty+'</small></button>';}).join('')+'</div></section>';
      return '<aside class="side-card modal-card specified-link-card"><header><div><small>動態指定配對</small><strong>建立 '+groups.length+' 組套餐</strong></div><button data-action="dismiss-modal">×</button></header><div class="pairing-group-tabs">'+groups.map((group,index)=>{const ok=group.main&&group.snack;return '<button data-action="select-pairing-group" data-index="'+index+'" class="'+(index===active?'active ':'')+(ok?'complete':'')+'"><b>'+String.fromCharCode(65+index)+'</b><small>'+(ok?(group.drink?'完成':'欠飲品'):'待選')+'</small></button>';}).join('')+'</div><div class="card-scroll pairing-body"><p>選擇 '+String.fromCharCode(65+active)+' 組主餐及小食即可建立套餐；飲品可直接用快捷飲品或稍後補選。</p>'+roles.map(([role,label,filter],index)=>'<section><strong>'+(index+1)+'. '+label+'</strong><div class="link-candidates">'+available.filter(filter).map(line=>{const used=selectedCount(line.lineId,role),selected=current[role]===line.lineId,full=used>=line.qty&&!selected;return '<button data-action="select-link-item" data-role="'+role+'" data-id="'+line.lineId+'" class="'+(selected?'selected':'')+'" '+(full?'disabled':'')+'><span>'+escapeHtml(line.name)+'</span><small>可用 '+Math.max(0,line.qty-used+(selected?1:0))+'／'+line.qty+'</small></button>';}).join('')+'</div></section>').join('')+drinkCards+'</div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-specified-link" '+(ready?'':'disabled')+'>確認組合 '+ready+' 組</button></footer></aside>';
    }
    function comboEditorModal(){
      const line=store.get().cart.find(item=>item.lineId===modal.lineId),draft=modal.draft;
      if(!line)return '';
      const components=draft.components||[],selected=role=>components.find(item=>item.role===role);
      const withCurrent=(items,role)=>{const current=selected(role);return current&&!items.some(item=>item.id===current.productId)?[{id:current.productId,name:current.name,image:current.image,price:current.unitPrice},...items]:items;};
      const candidates={main:withCurrent(products.filter(item=>item.combinable),'main'),snack:withCurrent(snackProducts,'snack'),drink:withCurrent(drinks,'drink')};
      const roleCard=(role,label,index)=>'<section class="combo-role"><header><strong>'+index+'. '+label+'</strong>'+(role==='drink'?'<button data-action="clear-combo-component">稍後補選</button>':'')+'</header><div class="combo-candidates">'+candidates[role].map(item=>{const id=item.id,active=selected(role)?.productId===id;return '<button data-action="select-combo-component" data-role="'+role+'" data-id="'+id+'" class="'+(active?'selected':'')+'"><span>'+escapeHtml(item.name)+'</span><small>'+money(item.price||0)+'</small></button>';}).join('')+'</div></section>';
      const missing=!selected('drink');
      return '<aside class="product-settings-card modal-card combo-editor-card"><header class="settings-product-head"><div><small>修改套餐</small><h2>'+escapeHtml(line.name)+'</h2><strong>'+money(line.total)+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="product-settings-body card-scroll"><p class="combo-help">飯團、小食及飲品會以一張套餐顯示；飲品可以稍後由快捷飲品補選。</p>'+roleCard('main','飯團／主餐',1)+roleCard('snack','小食',2)+roleCard('drink','飲品',3)+'</div><footer class="product-settings-actions combo-actions"><button class="danger" data-action="request-dissolve-combo">拆開套餐</button><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-combo-edit">確認修改</button></footer>'+(missing?'<p class="missing-hint">尚欠：飲品 1 份</p>':'')+'</aside>';
    }
    function requiredGroupLabel(group){return {rice:'飯底',sauce:'醬汁',snack:'小食',drink:'飲品'}[group]||'必選';}
    function requiredTargets(cart,group){
      const targets=[];
      (cart||[]).forEach((line,lineIndex)=>{
        if(!(line.required||[]).includes(group))return;
        if(group==='drink'){
          const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
          for(let unitIndex=0;unitIndex<missing;unitIndex++)targets.push({id:line.lineId+':drink:'+unitIndex,lineId:line.lineId,lineIndex,unitIndex,name:line.name,qty:line.qty});
          return;
        }
        if(line.options?.[group])return;
        for(let unitIndex=0;unitIndex<Math.max(1,Number(line.qty||1));unitIndex++)targets.push({id:line.lineId+':'+group+':'+unitIndex,lineId:line.lineId,lineIndex,unitIndex,name:line.name,qty:line.qty});
      });
      return targets;
    }
    function completionDraft(group=''){
      const current=modal?.draft||{};
      if(!group)return {...current,activeGroup:'',activeTarget:'',assignments:current.assignments||{}};
      const targets=requiredTargets(store.get().cart,group),assignments=current.activeGroup===group?(current.assignments||{}):{};
      const activeTarget=(current.activeGroup===group&&targets.some(target=>target.id===current.activeTarget))?current.activeTarget:(targets.find(target=>!assignments[target.id])?.id||targets[0]?.id||'');
      return {activeGroup:group,activeTarget,assignments};
    }
    function completionTargetLabel(target){return String(target.lineIndex+1).padStart(2,'0')+'｜'+escapeHtml(target.name)+(target.qty>1?'｜第 '+(target.unitIndex+1)+' 份':'');}
    function requiredSelectionPanel(group){
      const draft=completionDraft(group);modal.draft=draft;
      const targets=requiredTargets(store.get().cart,group),assignments=draft.assignments||{},active=targets.find(target=>target.id===draft.activeTarget)||targets[0];
      const done=targets.filter(target=>assignments[target.id]).length,label=requiredGroupLabel(group);
      const targetHtml=targets.map(target=>'<button class="required-target '+(target.id===active?.id?'active ':'')+(assignments[target.id]?'complete':'')+'" data-action="completion-target" data-id="'+escapeHtml(target.id)+'"><span><b>'+completionTargetLabel(target)+'</b><small>'+(assignments[target.id]?'已選：'+escapeHtml(group==='drink'?(drinkMap.get(assignments[target.id])?.name||assignments[target.id]):assignments[target.id]):'尚未選擇')+'</small></span><em>'+(assignments[target.id]?'✓':'待選')+'</em></button>').join('');
      const drinkAssignmentCounts=new Map();
      if(group==='drink')Object.values(assignments).forEach(id=>{if(id)drinkAssignmentCounts.set(id,(drinkAssignmentCounts.get(id)||0)+1);});
      let choices='';
      if(group==='drink')choices='<div class="required-drink-grid">'+drinks.filter(item=>item.available!==false).map(item=>{const count=drinkAssignmentCounts.get(item.id)||0;return '<button data-action="completion-required-choice" data-value="'+escapeHtml(item.id)+'" class="'+(active&&assignments[active.id]===item.id?'selected ':'')+(count?'has-assignment':'')+'" aria-label="'+escapeHtml(item.name)+(count?'，已選 '+count+' 份':'')+'">'+imageBlock(item.image,item.name,'required-choice-img')+'<span>'+escapeHtml(item.name)+'</span>'+(count?'<em class="drink-choice-count">✓ '+count+'</em>':'')+'</button>';}).join('')+'</div>';
      else choices='<div class="required-option-grid">'+(optionSets[group]||[]).map(value=>'<button data-action="completion-required-choice" data-value="'+escapeHtml(value)+'" class="'+(active&&assignments[active.id]===value?'selected':'')+'">'+escapeHtml(value)+'</button>').join('')+'</div>';
      const selected=active?assignments[active.id]:'';
      return '<div class="required-workflow-head"><div><small>必須完成｜'+label+'</small><strong>已分配 '+done+' / '+targets.length+'</strong><span>每一份都會顯示指定結果，避免配錯餐點。</span></div><button data-action="completion-back">返回必選總覽</button></div><div class="required-workflow-grid"><section class="required-target-pane"><h3>要補選嘅餐點</h3><div class="required-target-list">'+targetHtml+'</div></section><section class="required-choice-pane"><div class="required-active-target"><small>目前指定</small><strong>'+(active?completionTargetLabel(active):'已完成')+'</strong><span>'+(selected?'目前：'+escapeHtml(group==='drink'?(drinkMap.get(selected)?.name||selected):selected):'請選擇 '+label)+'</span></div>'+choices+(selected&&done<targets.length?'<button class="required-fill" data-action="completion-fill-remaining" data-value="'+escapeHtml(selected)+'">其餘未選全部用同一選項</button>':'')+'</section></div><footer class="required-workflow-actions"><button data-action="completion-back">返回</button><button class="primary" data-action="apply-required-group" '+(done===targets.length&&targets.length?'':'disabled')+'>確認 '+label+'｜'+done+' 份</button></footer>';
    }
    function splitLineForRequired(line,group,values){
      if(!values.length)return [line];
      if(values.every(value=>value===values[0]))return [{...line,options:{...(line.options||{}),[group]:values[0]}}];
      const qty=Math.max(1,Number(line.qty||1)),slotsPerUnit=qty?Math.max(0,Math.round(Number(line.drinkSlots||0)/qty)):0,drinkAssignments=[...(line.drinkAssignments||[])];
      return values.map((value,index)=>({...line,lineId:index===0?line.lineId:stableId('line'),qty:1,total:Number(line.unitPrice||0),options:{...(line.options||{}),[group]:value},drinkSlots:slotsPerUnit,drinkAssignments:slotsPerUnit?drinkAssignments.slice(index*slotsPerUnit,(index+1)*slotsPerUnit):[],createdOrder:Number(line.createdOrder||0)+(index*0.0001)}));
    }
    function applyRequiredGroup(){
      const group=modal?.draft?.activeGroup;if(!group)return;
      const targets=requiredTargets(store.get().cart,group),assignments=modal.draft.assignments||{};
      if(targets.some(target=>!assignments[target.id])){showToast('仲有必選項未完成');return;}
      store.set(state=>{
        if(group==='drink'){
          const byLine=new Map();targets.forEach(target=>{if(!byLine.has(target.lineId))byLine.set(target.lineId,[]);byLine.get(target.lineId).push(assignments[target.id]);});
          state.cart=state.cart.map(line=>{const ids=byLine.get(line.lineId);if(!ids)return line;return {...line,drinkAssignments:(line.drinkAssignments||[]).concat(ids.map(id=>drinkSelection(id)))};});
        }else{
          const byLine=new Map();targets.forEach(target=>{if(!byLine.has(target.lineId))byLine.set(target.lineId,[]);byLine.get(target.lineId).push(assignments[target.id]);});
          state.cart=state.cart.flatMap(line=>{const values=byLine.get(line.lineId);return values?splitLineForRequired(line,group,values):[line];});
        }
        state.lastAffectedLineId=targets.at(-1)?.lineId||'';state.lastMutationKind='changed';return state;
      });
      modal={type:'completion',dirty:false,draft:{activeGroup:'',activeTarget:'',assignments:{}}};queue.afterRender(()=>showToast(requiredGroupLabel(group)+'已完成'));
    }
    function completionModal(){
      const state=store.get(),required=pendingSummary(state.cart),link=linkUpSummary(state.cart);
      if(modal?.draft?.activeGroup)return '<aside class="completion-card modal-card required-workflow"><header><div><small>結帳前必須完成</small><strong>快速補選</strong></div><button data-action="dismiss-modal">×</button></header>'+requiredSelectionPanel(modal.draft.activeGroup)+'</aside>';
      return '<aside class="completion-card modal-card"><header><div><small>結帳前檢查</small><strong>必選快速補齊</strong></div><button data-action="dismiss-modal">×</button></header><div class="completion-section required"><div><small>必須完成</small><strong>'+(required.total?'共欠 '+required.total+' 項':'全部完成')+'</strong><span>只處理會阻礙結帳嘅必選；普通口味修改仍然喺產品「修改」處理。</span></div>'+['rice','sauce','snack','drink'].filter(k=>required[k]).map(k=>'<button data-action="complete-group" data-group="'+k+'"><span>'+requiredGroupLabel(k)+'</span><b>'+required[k]+' 份</b><em>快速分配</em></button>').join('')+'</div><div class="completion-section optional"><div><small>普通修改</small><strong>唔影響結帳</strong><span>走青瓜、走蔥、少辣等，請由對應產品「修改」卡處理。</span></div></div><div class="completion-section linkup"><div><small>可組合套餐</small><strong>'+link.count+' 份</strong><span>飯團 '+link.riceballs+'｜小食 '+link.snacks+'｜飲品 '+link.drinks+'</span></div>'+(link.count?'<button class="primary" data-action="linkup-all" data-count="'+link.count+'">一鍵組合</button>':'')+'</div></aside>';
    }
    function optionButtons(group,values,selected,multi=false){return '<div class="option-chips">'+values.map(value=>'<button data-action="detail-option" data-group="'+group+'" data-value="'+escapeHtml(value)+'" data-multi="'+multi+'" class="'+((multi?selected.includes(value):selected===value)?'selected':'')+'">'+escapeHtml(value)+'</button>').join('')+'</div>';}
    function detailGroups(product,draft){
      const rows=[];
      if(product.required.includes('rice'))rows.push('<section><header><strong>飯底</strong><span class="required-tag">必選</span></header>'+optionButtons('rice',optionSets.rice,draft.options.rice||'')+'</section>');
      if(product.required.includes('sauce'))rows.push('<section><header><strong>醬汁</strong><span class="required-tag">必選</span></header>'+optionButtons('sauce',optionSets.sauce,draft.options.sauce||'')+'</section>');
      rows.push('<section><header><strong>飯量／份量</strong><span>可選</span></header>'+optionButtons('portion',['少飯','標準','多飯','加飯 +$5'],draft.options.portion||'標準')+'</section>');
      rows.push('<section><header><strong>口味調整</strong><span>可多選</span></header>'+optionButtons('taste',['走蔥','少辣','走蒜','走香菜','不要花生'],draft.options.taste||[],true)+'</section>');
      if(product.required.includes('snack'))rows.push('<section><header><strong>套餐小食</strong><span class="required-tag">必選</span></header>'+optionButtons('snack',optionSets.snack,draft.options.snack||'')+'</section>');
      if(product.combinable)rows.push('<section class="upgrade-section"><header><strong>升級飯團套餐</strong><span>可補選</span></header><p>小食及飲品都選擇後，會直接組合成飯團套餐。</p>'+optionButtons('snack',optionSets.snack,draft.options.snack||'')+'</section>');
      if(product.required.includes('drink')||product.combinable)rows.push('<section><header><strong>'+(product.required.includes('drink')?'套餐飲品':'加配飲品')+'</strong><span class="'+(product.required.includes('drink')?'required-tag':'')+'">'+(product.required.includes('drink')?'必選':'可補選')+'</span></header><div class="detail-drinks">'+drinks.map(d=>drinkChoiceCard(d,'detail-drink',draft.drink?.drinkId===d.id,'detail')).join('')+'</div></section>');
      rows.push('<section><header><strong>備註</strong><span>可選</span></header><textarea data-action="detail-note" maxlength="80" placeholder="例如：醬汁分開、謝謝">'+escapeHtml(draft.note||'')+'</textarea></section>');
      return rows.join('');
    }
    function productDetailModal(){
      const {productId,draft}=modal;const p=productMap.get(productId);const missing=[];
      p.required.forEach(group=>{if(group==='drink'){if(!draft.drink)missing.push('飲品');}else if(!draft.options[group])missing.push(group==='rice'?'飯底':group==='sauce'?'醬汁':'小食');});
      const subtotal=p.price*draft.qty;
      return '<aside class="product-settings-card modal-card" data-editing="'+Boolean(modal.editLineId)+'"><header class="settings-product-head"><div><small>'+(modal.editLineId?'修改產品':'新增產品')+'</small><h2>'+p.name+'</h2><strong>'+money(p.price)+'</strong></div><button data-action="dismiss-modal" aria-label="返回">×</button></header><div class="product-settings-body"><div class="qty-row"><span>數量</span><button data-action="detail-qty" data-delta="-1">−</button><strong>'+draft.qty+'</strong><button data-action="detail-qty" data-delta="1">＋</button></div>'+detailGroups(p,draft)+'</div><footer class="product-settings-actions"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-product" '+(missing.length?'disabled':'')+'>確認 '+money(subtotal)+'</button></footer>'+(missing.length?'<p class="missing-hint">還欠：'+missing.join('、')+'</p>':'')+'</aside>';
    }
    function drinkModifierModal(){
      const d=drinkMap.get(modal.drinkId),draft=modal.draft;
      const groups=draft.groups||[];const total=draft.qty+groups.reduce((n,g)=>n+g.qty,0);
      return '<aside class="modifier-card modal-card"><header><strong>'+d.name+'</strong><button data-action="dismiss-modal">×</button></header><div class="drink-base-qty"><span>正常</span><span><button data-action="modifier-qty" data-delta="-1">−</button><b>'+draft.qty+'</b><button data-action="modifier-qty" data-delta="1">＋</button></span></div><div class="drink-groups">'+groups.map((g,index)=>'<section class="drink-group '+(g.open?'open':'')+'"><header><button class="group-summary" data-action="toggle-drink-adjustment" data-index="'+index+'">'+([g.sweetness,g.ice].filter(Boolean).join('・')||'選擇調整')+' ×'+g.qty+'</button><span><button data-action="group-qty" data-index="'+index+'" data-delta="-1">−</button><b>'+g.qty+'</b><button data-action="group-qty" data-index="'+index+'" data-delta="1">＋</button></span></header>'+(g.open?'<div class="adjustment-options">'+(d.sweet?optionButtons('group-sweetness-'+index,['多甜','少甜','走甜'],g.sweetness||''):'')+(d.ice?optionButtons('group-ice-'+index,['少冰','多冰'],g.ice||''):'')+'</div>':'')+'</section>').join('')+'</div><button data-action="add-drink-group" class="add-group">＋ 新增調整</button><button class="primary wide" data-action="apply-drink" '+(total?'':'disabled')+'>套用 '+total+' 份</button></aside>';
    }
    function searchModal(){const query=store.get().searchQuery;return '<aside class="side-card modal-card search-card"><header><div><small>產品搜尋</small><strong>名稱或編號</strong></div><button data-action="dismiss-modal">×</button></header><div class="search-field"><input autofocus data-action="search-query" value="'+escapeHtml(query)+'" placeholder="例如：F4、雞絲、奶茶"><button data-action="clear-search" '+(query?'':'disabled')+'>清除</button></div><p>搜尋結果會即時顯示；分類排序及供應狀態仍然保留。</p></aside>';}
    function categoryButton(cat,state){return '<button data-action="category" data-value="'+escapeHtml(cat)+'" class="'+(cat===state.category?'active':'')+'">'+escapeHtml(cat)+'</button>';}
    function categoryBar(state){
      const categoryLayout=buildCategoryLayout(categories,state.settings.categoryLayout);
      const pages=categoryLayout.pages.map((items,index)=>'<div class="category-page" aria-label="分類第 '+(index+1)+' 頁">'+items.map(cat=>categoryButton(cat,state)).join('')+(categoryLayout.showSearch?'<span class="category-search-reserved" aria-hidden="true"></span>':'')+'</div>').join('');
      return '<div class="category-shell" style="--category-columns:'+categoryLayout.columns+';--category-rows:'+categoryLayout.rows+'"><nav class="category-scroll">'+pages+'</nav>'+(categoryLayout.overflow.length?'<span class="category-overflow">可左右滑動查看更多分類</span>':'')+(categoryLayout.showSearch?'<button class="category-search '+(state.searchQuery?'active':'')+'" data-action="open-search" aria-label="搜尋產品">⌕<small>'+(state.searchQuery?'搜尋中':'搜尋')+'</small></button>':'')+'</div>';
    }
    function customConfirm(){
      const notice=newOrderNotice?.visible?'<aside class="new-order-toast"><div><small>'+newOrderNotice.source+' 新訂單</small><strong>'+newOrderNotice.id+'</strong><span>'+newOrderNotice.items+' 件 · '+money(newOrderNotice.amount)+'</span></div><button data-action="later-new-order">稍後處理</button><button class="primary" data-action="process-new-order">立即處理</button></aside>':'';
      if(!confirmState)return notice;
      if(confirmState.kind==='modal-exit')return notice+'<div class="confirm-layer"><section class="confirm-card"><strong>'+confirmState.title+'</strong><p>'+confirmState.message+'</p><div><button data-action="confirm-cancel">繼續調整</button><button class="danger" data-action="confirm-discard">退出不保存</button><button class="primary" data-action="confirm-save-exit" '+(confirmState.saveAction?'':'disabled')+'>保存並退出</button></div></section></div>';
      const dissolve=confirmState.kind==='dissolve',dineCancel=confirmState.kind==='dine-cancel';
      return notice+'<div class="confirm-layer"><section class="confirm-card"><strong>'+confirmState.title+'</strong><p>'+confirmState.message+'</p><div><button data-action="confirm-cancel">'+(dissolve?'返回套餐':dineCancel?'繼續點單':'繼續修改')+'</button><button class="danger" data-action="'+(dissolve?'confirm-dissolve':dineCancel?'confirm-dine-cancel':'confirm-discard')+'">'+(dissolve?'確認拆開':dineCancel?'取消今次點單':'放棄修改')+'</button></div></section></div>';
    }
    function activeModal(){
      if(!modal)return '';
      if(modal.type==='quick')return quickSettingsModal();
      if(modal.type==='settings')return settingsModal();
      if(modal.type==='health')return healthModal();
      if(modal.type==='status')return statusModal();
      if(modal.type==='soldout')return soldoutModal();
      if(modal.type==='hang')return hangModal();
      if(modal.type==='take')return takeModal();
      if(modal.type==='specified-link')return specifiedLinkModal();
      if(modal.type==='combo')return comboEditorModal();
      if(modal.type==='completion')return completionModal();
      if(modal.type==='product')return productDetailModal();
      if(modal.type==='drink')return drinkModifierModal();
      if(modal.type==='search')return searchModal();
      if(modal.type==='pending')return pendingPanel();
      if(modal.type==='pending-detail')return pendingDetailModal();
      if(modal.type==='pending-review')return pendingReviewModal();
      if(modal.type==='proof')return enlargedProofModal();
      return '';
    }
    function anchorRect(button){const r=button?.getBoundingClientRect?.();return r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}:null;}
    function actionAnchor(button,override=null){return override||anchorRect(button);}
    function positionActiveCard(){
      const card=document.querySelector('.side-card,.product-settings-card,.modifier-card,.pending-panel,.pending-review-card,.proof-lightbox');const a=modal?.anchor;if(!card||!a)return;
      const topbarRect=document.querySelector('.topbar')?.getBoundingClientRect(),bottomNavRect=document.querySelector('.bottom-nav')?.getBoundingClientRect();
      const cartRect=document.querySelector('.cart')?.getBoundingClientRect();
      if(modal?.type==='pending'&&cartRect)card.style.maxHeight=Math.min(cartRect.height,(bottomNavRect?.top||innerHeight)-(topbarRect?.bottom||0)-32)+'px';
      const gap=14,w=card.offsetWidth,h=card.offsetHeight,margin=16,minTop=(topbarRect?.bottom||0)+margin,maxBottom=(bottomNavRect?.top||innerHeight)-margin;
      const room={top:a.top-minTop,bottom:maxBottom-a.bottom,left:a.left-margin,right:innerWidth-margin-a.right};
      let side,left,top;
      if(a.top<minTop+90){side='top';left=a.left+a.width/2-w/2;top=a.bottom+gap;}
      else if(a.bottom>maxBottom-110){side='bottom';left=a.left+a.width/2-w/2;top=a.top-h-gap;}
      else if(room.right>=w+gap){side='left';left=a.right+gap;top=a.top+a.height/2-h/2;}
      else {side='right';left=a.left-w-gap;top=a.top+a.height/2-h/2;}
      left=Math.max(margin,Math.min(left,innerWidth-w-margin));top=Math.max(minTop,Math.min(top,maxBottom-h));
      card.style.left=left+'px';card.style.right='auto';card.style.top=top+'px';card.style.transform='none';card.dataset.pointerSide=side;
      card.style.setProperty('--pointer-y',Math.max(24,Math.min(a.top+a.height/2-top,h-24))+'px');card.style.setProperty('--pointer-x',Math.max(24,Math.min(a.left+a.width/2-left,w-24))+'px');
    }
    function clearRecentLater(lineId){
      clearTimeout(recentTimer);
      if(!lineId)return;
      recentTimer=setTimeout(()=>{const current=store.get();if(current.lastAffectedLineId===lineId)store.setTransient(state=>({...state,lastAffectedLineId:'',lastMutationKind:''}));},1500);
    }
    function restoreCartViewport(state,previousScroll){
      const cart=document.querySelector('.cart-list');if(!cart)return;
      const target=state.lastAffectedLineId?document.querySelector('[data-line-id="'+CSS.escape(state.lastAffectedLineId)+'"]'):null;
      if(state.lastAffectedLineId&&state.lastMutationKind==='added'&&state.cartViewMode===CART_VIEW_INPUT){cart.scrollTop=cart.scrollHeight;}
      else if(target){target.scrollIntoView({block:'nearest'});}
      else cart.scrollTop=Math.max(0,previousScroll||0);
      cartScrollTop=cart.scrollTop;
      clearRecentLater(state.lastAffectedLineId);
    }
    let renderStarted=false;
    const renderKeys={top:'',cart:'',category:'',products:'',quick:'',bottom:'',modal:''};
    function surfaceKey(value){try{return JSON.stringify(value);}catch(_error){return String(Date.now());}}
    function cartSurface(state){
      const hasCart=state.cart.length>0;
      const checkoutLabel=state.dineContext?'落單到 '+escapeHtml(state.dineContext.tableId)+' 號枱 '+money(cartTotal(state.cart)):hasCart?'結帳 '+money(cartTotal(state.cart)):'購物車未有餐點';
      const serviceClass=state.orderServiceMode===SERVICE_DINE_IN?'dine':'takeaway';
      const viewClass=state.cartViewMode===CART_VIEW_ORGANIZED?'organized':'input';
      return '<aside class="cart"><header><div><h2>購物車（'+state.cart.reduce((n,l)=>n+l.qty,0)+'）</h2>'+cartSummary(state)+'</div><span class="cart-header-actions"><span class="cart-mode-controls"><button class="cart-mode-toggle '+serviceClass+'" data-action="toggle-order-service">'+state.orderServiceMode+'</button><button class="cart-mode-toggle cart-view-toggle '+viewClass+'" data-action="toggle-cart-view">'+(state.cartViewMode===CART_VIEW_ORGANIZED?'原單':'整理')+'</button></span>'+(state.dineContext?'<button class="cancel-dine-order" data-action="cancel-dine-order">取消堂食點單</button>':'')+'<button data-action="clear-cart">清空</button></span></header><div class="cart-list">'+cartRows()+'</div>'+pendingArea()+'<footer><button data-action="open-hold-panel">掛單</button><button data-action="open-drafts">取單'+(drafts.length?' '+drafts.length:'')+'</button><button class="primary" data-action="checkout" '+(hasCart?'':'disabled')+'>'+checkoutLabel+'</button></footer></aside>';
    }
    function filteredCatalog(state){
      const searchQuery=state.searchQuery.trim().toLocaleLowerCase('zh-HK');
      const categoryProducts=state.category==='全部'?products:products.filter(product=>product.category===state.category);
      return sortPausedLast(categoryProducts.filter(product=>!searchQuery||String(product.name||'').toLocaleLowerCase('zh-HK').includes(searchQuery)||String(product.code||'').toLocaleLowerCase('zh-HK').includes(searchQuery)));
    }
    function productGridSurface(state){
      const filtered=filteredCatalog(state),template=productTemplate();
      return '<div class="products products-'+template+'">'+(filtered.length?filtered.map(productCard).join(''):'<div class="empty search-empty">搵唔到符合「'+escapeHtml(state.searchQuery)+'」嘅產品</div>')+'</div>';
    }
    function refreshQrCodes(scope=document){
      scope.querySelectorAll?.('[data-qr]').forEach(node=>{if(typeof window.qrcode!=='function')return;const qr=window.qrcode(0,'M');qr.addData(node.dataset.qr);qr.make();node.innerHTML=qr.createImgTag(5,8,'WhatsApp QR Code');});
    }
    function replaceOuter(selector,html){
      const node=document.querySelector(selector);if(!node)return null;
      node.outerHTML=html;
      return document.querySelector(selector);
    }
    function refreshQuickSurface(html){
      const catalog=document.querySelector('.catalog');if(!catalog)return null;
      const current=catalog.querySelector('.quick-drawer');
      if(!html){current?.remove();return null;}
      if(current){current.outerHTML=html;}else catalog.insertAdjacentHTML('beforeend',html);
      return catalog.querySelector('.quick-drawer');
    }
    let lastOverlayOpen=null;
    function publishOverlayState(){
      const open=Boolean(modal||confirmState);
      if(open===lastOverlayOpen)return;
      lastOverlayOpen=open;
      window.parent?.postMessage?.({type:'morefun:overlay-state',open},'*');
    }
    function refreshModalSurface(state){
      const toast=document.getElementById('toast');if(!toast)return;
      app.querySelectorAll(':scope > .modal-scrim,:scope > .modal-card,:scope > .confirm-layer,:scope > .new-order-toast').forEach(node=>node.remove());
      toast.insertAdjacentHTML('beforebegin',modalScrim()+activeModal()+customConfirm());
      if(modal?.type==='settings'){
        const first=document.querySelector('.side-card .setting-row');
        first?.insertAdjacentHTML('beforebegin','<div class="setting-block"><strong>購物車相同產品</strong><div class="segmented"><button data-action="cart-merge" data-value="same" class="'+(state.settings.cart.mergeMode!=='never'?'active':'')+'">相同配置合併</button><button data-action="cart-merge" data-value="never" class="'+(state.settings.cart.mergeMode==='never'?'active':'')+'">逐項顯示</button></div></div>');
      }
      app.querySelectorAll(':scope > .modal-card,:scope > .confirm-layer,:scope > .new-order-toast').forEach(node=>{bindImageFallbacks(node);refreshQrCodes(node);});
      requestAnimationFrame(()=>positionActiveCard());
    }
    function render(){
      const state=store.get();
      const pendingCount=pendingOrderCount(state);
      const template=productTemplate();
      const topKey=surfaceKey([state.quickMode,state.operations,state.health,pendingCount,state.dineContext,products.map(item=>[item.id,supplyStatus(item)]),readJSON(ORDER_HISTORY_STORAGE_KEY,[]).length]);
      const cartKey=surfaceKey([state.cart,state.dineContext,state.orderServiceMode,state.cartViewMode,state.lastAffectedLineId,state.lastMutationKind,state.collapsedCartCategories,state.settings.cart,drafts.length]);
      const categoryKey=surfaceKey([state.category,state.searchQuery,state.settings.categoryLayout]);
      const productsKey=surfaceKey([state.category,state.searchQuery,state.quickMode,state.settings.catalog,template,products.map(item=>[item.id,supplyStatus(item)])]);
      const quickKey=surfaceKey([state.quickDrawerOpen,state.settings.quickDrinks,pendingSummary(state.cart).drink,lastDrinkAssignment,modal?.type==='drink'?modal.drinkId:'',drinks.map(item=>[item.id,item.available])]);
      const bottomKey=String(pendingCount);
      const modalKey=surfaceKey([modal,confirmState,newOrderNotice,modal?{cart:state.cart,settings:state.settings,health:state.health,pendingOrders:state.pendingOrders,searchQuery:state.searchQuery,drafts}:null]);
    
      if(!renderStarted){
        const topHtml=topbar(),cartHtml=cartSurface(state),categoryHtml=categoryBar(state),productsHtml=productGridSurface(state),quickHtml=quickDrinks(),bottomHtml=renderBottomNav('order',{badges:{orders:pendingCount}});
        app.innerHTML='<main>'+topHtml+'<section class="workspace"><section class="order-grid" style="--cart-width:'+Number(state.settings.cart.widthPercent||32)+'%">'+cartHtml+'<section class="catalog">'+categoryHtml+productsHtml+quickHtml+'</section></section></section>'+bottomHtml+'</main>'+modalScrim()+activeModal()+customConfirm()+'<div id="toast" class="toast"></div>';
        document.body.classList.toggle('has-modal',Boolean(modal));
        bindImageFallbacks(app);refreshQrCodes(app);
        Object.assign(renderKeys,{top:topKey,cart:cartKey,category:categoryKey,products:productsKey,quick:quickKey,bottom:bottomKey,modal:modalKey});
        renderStarted=true;
        requestAnimationFrame(()=>{positionActiveCard();restoreCartViewport(state,0);});
        publishOverlayState();
        window.dispatchEvent(new Event('morefun:layout-invalidated'));
        return;
      }
    
      let layoutChanged=false;
      const grid=document.querySelector('.order-grid');
      const cartWidth=Number(state.settings.cart.widthPercent||32)+'%';
      if(grid&&grid.style.getPropertyValue('--cart-width')!==cartWidth){grid.style.setProperty('--cart-width',cartWidth);layoutChanged=true;}
      document.body.classList.toggle('has-modal',Boolean(modal));
    
      if(renderKeys.top!==topKey){replaceOuter('.topbar',topbar());renderKeys.top=topKey;}
      if(renderKeys.cart!==cartKey){
        const oldCart=document.querySelector('.cart-list'),previousScroll=oldCart?oldCart.scrollTop:cartScrollTop;
        const node=replaceOuter('.cart',cartSurface(state));if(node)bindImageFallbacks(node);
        renderKeys.cart=cartKey;layoutChanged=true;requestAnimationFrame(()=>restoreCartViewport(state,previousScroll));
      }
      if(renderKeys.category!==categoryKey){replaceOuter('.category-shell',categoryBar(state));renderKeys.category=categoryKey;layoutChanged=true;}
      if(renderKeys.products!==productsKey){const node=replaceOuter('.products',productGridSurface(state));if(node)bindImageFallbacks(node);renderKeys.products=productsKey;layoutChanged=true;}
      if(renderKeys.quick!==quickKey){const node=refreshQuickSurface(quickDrinks());if(node)bindImageFallbacks(node);renderKeys.quick=quickKey;layoutChanged=true;}
      if(renderKeys.bottom!==bottomKey){replaceOuter('.bottom-nav',renderBottomNav('order',{badges:{orders:pendingCount}}));renderKeys.bottom=bottomKey;layoutChanged=true;}
      if(renderKeys.modal!==modalKey){refreshModalSurface(state);renderKeys.modal=modalKey;}
      publishOverlayState();
      if(layoutChanged)window.dispatchEvent(new Event('morefun:layout-invalidated'));
    }
    function completeDineCancellation(){
      const context=store.get().dineContext;
      if(context?.startedFromFree){const dine=cleanupEmptyDineSessions(readJSON(DINE_STORAGE_KEY,null)||createInitialDineState());writeJSON(DINE_STORAGE_KEY,dine);}
      store.set(state=>({...state,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));
      modal=null;confirmState=null;window.parent?.postMessage?.({type:'morefun:navigate',route:'dine'},'*');
    }
    function requestDineCancellation(){
      const state=store.get();if(!state.dineContext){window.parent?.postMessage?.({type:'morefun:navigate',route:'dine'},'*');return;}
      if(!state.cart.length){completeDineCancellation();return;}
      confirmState={kind:'dine-cancel',title:'取消堂食點單？',message:'今次未正式加入 '+state.dineContext.tableId+' 號枱，購物車內容會一併清除；原有堂食餐品不受影響。'};modal=null;render();
    }
    function markDirty(){if(modal)modal.dirty=true;}
    function modalSaveAction(current=modal){
      if(!current)return '';
      if(current.type==='product')return 'apply-product';
      if(current.type==='drink')return 'apply-drink';
      if(current.type==='completion'&&current.draft?.activeGroup)return 'apply-required-group';
      if(current.type==='combo')return 'apply-combo-edit';
      if(current.type==='specified-link')return 'apply-specified-link';
      return '';
    }
    function requestDismiss(){
      if(!modal)return;
      if(modal.dirty){
        confirmState={kind:'modal-exit',title:'已經有調整，是否退出？',message:'你可以繼續調整、退出而不保存，或者保存目前修改後退出。',returnModal:modal.type==='drink'&&modal.parent?modal.parent:null,saveAction:modalSaveAction(modal)};
        render();return;
      }
      modal=modal.type==='drink'&&modal.parent?modal.parent:null;confirmState=null;render();
    }
    function openProduct(productId,lineId='',anchor=null){
      const p=productMap.get(productId),line=lineId?store.get().cart.find(x=>x.lineId===lineId):null;
      modal={type:'product',productId,editLineId:lineId,anchor,dirty:false,draft:{qty:line?.qty||1,options:safeClone(line?.options||{}),drink:line?.drinkAssignments?.[0]||null,note:line?.options?.note||'',keypad:false,keypadValue:''}};
      render();
    }
    function locateMutation(before,after,productId,newLineId=''){
      if(newLineId&&after.some(line=>line.lineId===newLineId))return {lineId:newLineId,kind:'added'};
      const beforeMap=new Map(before.map(line=>[line.lineId,Number(line.qty||0)]));
      const added=after.find(line=>!beforeMap.has(line.lineId));if(added)return {lineId:added.lineId,kind:'added'};
      const changed=[...after].reverse().find(line=>line.productId===productId&&Number(line.qty||0)>Number(beforeMap.get(line.lineId)||0));
      return {lineId:changed?.lineId||after.at(-1)?.lineId||'',kind:changed?'changed':'added'};
    }
    function quickAddProduct(productId){
      const p=productMap.get(productId);if(!p)return;
      const current=store.get();const line=makeLine(productId,1,{serviceMode:current.orderServiceMode});const before=current.cart;
      store.set(state=>{const next=mergeCart(state.cart.concat(line),state.settings.cart.mergeMode);const mutation=locateMutation(before,next,productId,line.lineId);state.cart=next;state.lastAffectedLineId=mutation.lineId;state.lastMutationKind=mutation.kind;return state;});
      queue.afterRender(()=>showToast('已加入 '+p.name));
    }
    function changeCartQuantity(lineId,delta){
      store.set(state=>{state.cart=updateCartLineQuantity(state.cart,lineId,delta,Object.fromEntries(products.map(p=>[p.id,p.drinkSlots||0])));state.lastAffectedLineId=state.cart.some(line=>line.lineId===lineId)?lineId:'';state.lastMutationKind='changed';return state;});
    }
    function openDrink(drinkId,context,maxQty=1,anchor=null){modal={type:'drink',drinkId,context,maxQty,anchor,dirty:false,draft:{qty:1,sweetness:'',ice:'',groups:[]}};render();}
    function applyProduct(){
      const editing=Boolean(modal.editLineId);
      const p=productMap.get(modal.productId),d=modal.draft,options={...d.options};if(d.note)options.note=d.note;
      const current=store.get(),before=current.cart;
      const drinkAssignments=d.drink?Array.from({length:d.qty},()=>safeClone(d.drink)):[];
      let line=makeLine(p.id,d.qty,{options,drinkAssignments,linkedComboId:p.combinable&&d.options.snack&&d.drink?stableId('combo'):'',linkedQty:p.combinable&&d.options.snack&&d.drink?d.qty:0,serviceMode:current.orderServiceMode});
      if(p.category==='飯團套餐'){
        const components=[{role:'main',source:'fixed',productId:p.id,name:p.name,image:p.image,unitPrice:p.price,options:{}},{role:'snack',source:'fixed-option',productId:'snack:'+d.options.snack,name:d.options.snack,image:'',unitPrice:0,options:{}}];
        if(d.drink)components.push({role:'drink',source:'quick',productId:d.drink.drinkId,drinkId:d.drink.drinkId,name:d.drink.name,image:drinkMap.get(d.drink.drinkId)?.image||'',unitPrice:Number(d.drink.unitPrice||0),options:{}});
        line={...line,lineType:'combo',category:'飯團套餐',combo:{id:stableId('combo'),kind:'riceball-set',source:'fixed',components,missingRoles:d.drink?[]:['drink'],singleTotal:p.price,comboPrice:p.price,discount:0}};
      }
      const editLineId=modal.editLineId;
      store.set(state=>{
        if(editLineId){state.cart=state.cart.map(item=>item.lineId===editLineId?{...line,lineId:item.lineId,createdOrder:item.createdOrder,serviceMode:item.serviceMode,serviceModeOverride:item.serviceModeOverride||''}:item);state.lastAffectedLineId=editLineId;state.lastMutationKind='changed';}
        else{const next=mergeCart(state.cart.concat(line),state.settings.cart.mergeMode);const mutation=locateMutation(before,next,p.id,line.lineId);state.cart=next;state.lastAffectedLineId=mutation.lineId;state.lastMutationKind=mutation.kind;}
        return state;
      });
      modal=null;queue.afterRender(()=>showToast(editing?'已更新產品':'已加入購物車'));
    }
    function applyDrink(){
      const groups=modal.draft.groups||[];
      const selections=Array.from({length:modal.draft.qty},()=>drinkSelection(modal.drinkId)).concat(groups.flatMap(group=>Array.from({length:group.qty},()=>drinkSelection(modal.drinkId,group.sweetness,group.ice)))),context=modal.context;
      if(context==='detail'){const productModal=modal.parent;productModal.draft.drink=selections[0];productModal.dirty=true;modal=productModal;render();return;}
      let appliedTarget=null;
      store.set(state=>{let remaining=selections.slice();state.cart=state.cart.map(line=>{if(!remaining.length)return line;const miss=Math.max(0,line.drinkSlots-line.drinkAssignments.length);const taken=remaining.splice(0,miss);if(taken.length&&!appliedTarget)appliedTarget={lineId:line.lineId,name:line.name};return taken.length?{...line,drinkAssignments:line.drinkAssignments.concat(taken)}:line;});if(appliedTarget){state.lastAffectedLineId=appliedTarget.lineId;state.lastMutationKind='changed';}return state;});
      if(appliedTarget&&selections[0]){lastDrinkAssignment={drink:selections[0].name,target:appliedTarget.name};clearTimeout(drinkFeedbackTimer);drinkFeedbackTimer=setTimeout(()=>{lastDrinkAssignment=null;render();},3200);}
      pendingDrinkAssignment=null;modal=null;queue.afterRender(()=>showToast('已補選飲品'));
    }
    function handle(button,anchorOverride=null){
      const action=button.dataset.action;
      if(action==='shell-navigate'){const route=button.dataset.route;if(route==='dine'&&store.get().dineContext)return requestDineCancellation();if(route!=='order')window.parent?.postMessage?.({type:'morefun:navigate',route},'*');return;}
      if(store.get().quickDrawerOpen)scheduleQuickDrawerClose();
      if(action==='category')store.setTransient(state=>({...state,category:button.dataset.value}));
      else if(action==='open-search'){modal={type:'search',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='clear-search'){store.setTransient(state=>({...state,searchQuery:''}));}
      else if(action==='open-product')openProduct(button.dataset.id,'',actionAnchor(button,anchorOverride));
      else if(action==='quick-add-product')quickAddProduct(button.dataset.id);
      else if(action==='cart-qty')changeCartQuantity(button.dataset.id,Number(button.dataset.delta)||0);
      else if(action==='toggle-order-service')store.set(state=>{const next=state.orderServiceMode===SERVICE_DINE_IN?SERVICE_TAKEAWAY:SERVICE_DINE_IN;return {...state,orderServiceMode:next,cart:applyOrderServiceMode(state.cart,next),lastAffectedLineId:'',lastMutationKind:''};});
      else if(action==='toggle-line-service')store.set(state=>({...state,cart:toggleLineServiceMode(state.cart,button.dataset.id,state.orderServiceMode),lastAffectedLineId:button.dataset.id,lastMutationKind:'changed'}));
      else if(action==='toggle-cart-view')saveCartViewMode(store.get().cartViewMode===CART_VIEW_ORGANIZED?CART_VIEW_INPUT:CART_VIEW_ORGANIZED);
      else if(action==='toggle-cart-category')store.setTransient(state=>{const category=button.dataset.value;const collapsed=state.collapsedCartCategories.includes(category);return {...state,collapsedCartCategories:collapsed?state.collapsedCartCategories.filter(item=>item!==category):state.collapsedCartCategories.concat(category)};});
      else if(action==='edit-line'){const line=store.get().cart.find(x=>x.lineId===button.dataset.id);if(line?.lineType==='combo'){modal={type:'combo',lineId:line.lineId,anchor:actionAnchor(button,anchorOverride),dirty:false,draft:{components:safeClone(line.combo?.components||[])}};render();}else if(line)openProduct(line.productId,line.lineId,actionAnchor(button,anchorOverride));}
      else if(action==='open-completion'){modal={type:'completion',dirty:false,draft:{activeGroup:'',activeTarget:'',assignments:{}}};render();}
      else if(action==='open-quick-settings'){modal={type:'quick',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-settings'){modal={type:'settings',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-health'){modal={type:'health',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-status'){modal={type:'status',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-soldout'){modal={type:'soldout',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='navigate-orders')window.parent?.postMessage?.({type:'morefun:navigate',route:'orders'},'*');
      else if(action==='navigate-dine')requestDineCancellation();
      else if(action==='navigate-soldout')window.parent?.postMessage?.({type:'morefun:navigate',route:'soldout'},'*');
      else if(action==='navigate-more')window.parent?.postMessage?.({type:'morefun:navigate',route:'more'},'*');
      else if(action==='open-hold-panel'){if(!store.get().cart.length){showToast('購物車未有餐品');return;}modal={type:'hang',dirty:false};render();}
      else if(action==='select-draft'){modal={...modal,selectedDraftId:button.dataset.id};render();}
      else if(action==='assign-table'){
        const current=store.get();if(!current.cart.length){showToast('購物車未有餐品');return;}
        try{const dineState=readJSON(DINE_STORAGE_KEY,null)||createInitialDineState();const table=dineState.tables.find(entry=>entry.id===button.dataset.id);const context={mode:'dine',tableId:button.dataset.id,sessionId:table?.status==='occupied'?table.session?.id:null};const dineCart=applyOrderServiceMode(current.cart,SERVICE_DINE_IN);const next=commitTableOrder(dineState,context,dineCart,{terminalId,history:readJSON(ORDER_HISTORY_STORAGE_KEY,[])});writeJSON(DINE_STORAGE_KEY,next);syncDinePrintJobs(next);store.set(state=>({...state,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));modal=null;queue.afterRender(()=>showToast('已正式加入 '+button.dataset.id+' 號枱及建立打印工作'));}catch(error){showToast(error.message||'未能加入堂食枱位');}
      }
      else if(action==='add-draft'){
        const state=store.get();if(!state.cart.length)return;
        const draft=createDraftRecord({cart:state.cart,terminalId,drafts,counters:draftCounters,session:state.draftSession||null,context:state.dineContext||null});
        draftCounters={...draftCounters,[terminalId]:Number(draft.draftNumber.split('-').at(-1))};writeJSON(DRAFT_COUNTER_STORAGE_KEY,draftCounters);drafts=drafts.concat(draft);writeJSON(DRAFT_STORAGE_KEY,drafts);
        store.set(next=>({...next,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));modal=null;queue.afterRender(()=>showToast('已暫存 '+draft.draftNumber));
      }
      else if(action==='open-drafts'){modal={type:'take',selectedDraftId:'',dirty:false};render();}
      else if(action==='restore-draft'){
        const draft=drafts.find(item=>item.id===button.dataset.id);if(!draft)return;
        const restored=restoreDraftForTerminal(draft,terminalId);drafts=drafts.filter(item=>item.id!==draft.id);writeJSON(DRAFT_STORAGE_KEY,drafts);
        const orderServiceMode=inferOrderServiceMode(restored.cart,null);
        store.set(state=>({...state,cart:normalizeCart(restored.cart,orderServiceMode),draftSession:restored.session,dineContext:null,orderServiceMode,lastAffectedLineId:'',lastMutationKind:''}));modal=null;queue.afterRender(()=>showToast('已取回 '+draft.draftNumber));
      }
      else if(action==='void-draft'){const draft=drafts.find(item=>item.id===modal?.selectedDraftId);if(!draft)return;if(!window.confirm('確定作廢 '+draft.draftNumber+'？作廢後不能取回。'))return;drafts=drafts.filter(item=>item.id!==draft.id);writeJSON(DRAFT_STORAGE_KEY,drafts);modal={type:'take',selectedDraftId:'',dirty:false};render();showToast('已作廢 '+draft.draftNumber);}
      else if(action==='toggle-quick-drawer'){store.setTransient(state=>({...state,quickDrawerOpen:!state.quickDrawerOpen}));scheduleQuickDrawerClose();}
      else if(action==='move-quick-drink')updateSettings(s=>{const order=s.quickDrinks.order.slice(),from=order.indexOf(button.dataset.id),to=Math.max(0,Math.min(order.length-1,from+Number(button.dataset.delta)));if(from>=0&&from!==to)[order[from],order[to]]=[order[to],order[from]];s.quickDrinks.order=order;});
      else if(action==='ui-scale')window.parent?.postMessage?.({type:'morefun:set-ui-scale',value:Number(button.dataset.value)},'*');
      else if(action==='dismiss-modal')requestDismiss();
      else if(action==='confirm-cancel'){confirmState=null;render();}
      else if(action==='confirm-discard'){modal=confirmState?.returnModal||null;confirmState=null;render();}
      else if(action==='confirm-save-exit'){const saveAction=confirmState?.saveAction;confirmState=null;if(saveAction)handle({dataset:{action:saveAction}});else{modal=null;render();}}
      else if(action==='confirm-dine-cancel')completeDineCancellation();
      else if(action==='confirm-dissolve'){const lineId=confirmState.lineId;store.set(state=>{state.cart=normalizeCart(dissolveRiceballSet(state.cart,lineId,{idFactory:role=>stableId('line-'+role)}),state.orderServiceMode);state.lastAffectedLineId=state.cart.at(-1)?.lineId||'';state.lastMutationKind='changed';return state;});confirmState=null;modal=null;queue.afterRender(()=>showToast('套餐已拆開並按單品重新計價'));}
      else if(action==='toggle-pending-panel'){if(modal?.type==='pending')modal=null;else modal={type:'pending',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='process-pending-order'){const pendingOrders=store.get().pendingOrders;const order=Object.values(pendingOrders).flat().find(x=>x.id===button.dataset.id);if(order){modal={type:'pending-detail',order,anchor:modal?.anchor,dirty:false};showToast('開啟 '+order.id+' 核對流程');render();}}
      else if(action==='start-pending-review'){modal={type:'pending-review',order:modal.order,anchor:modal.anchor,dirty:false};render();}
      else if(action==='enlarge-proof'){modal={type:'proof',order:modal.order,anchor:modal.anchor,dirty:false};render();}
      else if(action==='back-to-pending-review'){modal={type:'pending-review',order:modal.order,anchor:modal.anchor,dirty:false};render();}
      else if(action==='report-payment-issue'){showToast('請掃描 WhatsApp QR Code 聯絡客人');}
      else if(action==='accept-pending-order'){const accepted=acceptPendingOrder(modal.order);store.set(state=>{state.pendingOrders={online:state.pendingOrders.online.filter(x=>x.id!==accepted.id),queue:state.pendingOrders.queue.filter(x=>x.id!==accepted.id)};state.runningOrders=state.runningOrders.concat(accepted);return state;});modal=null;queue.afterRender(()=>showToast('已接單 '+accepted.id+'；30分鐘後自動完成'));}
      else if(action==='set-order-mode')store.set(state=>({...state,quickMode:button.dataset.value==='quick'}));
      else if(action==='toggle-quick-drink-strip')updateSettings(s=>{s.quickDrinks.visible=s.quickDrinks.visible===false;});
      else if(action==='quick-display')updateSettings(s=>{s.quickDrinks.showImages=button.dataset.value==='image';});
      else if(action==='toggle-quick-assist')updateSettings(s=>{s.quickDrinks.quickAssist=s.quickDrinks.quickAssist===false;});
      else if(action==='setting-card')updateSettings(s=>{s.catalog.defaultTemplate=button.dataset.value;s.catalog.productOverrides={};});
      else if(action==='cart-width')updateSettings(s=>{s.cart.widthPercent=Number(button.dataset.value)||32;});
      else if(action==='cart-merge')updateSettings(s=>{s.cart.mergeMode=button.dataset.value;});
      else if(action==='toggle-cart-images')updateSettings(s=>{s.cart.showImages=s.cart.showImages===false;});
      else if(action==='toggle-code')updateSettings(s=>{s.catalog.showCode=!s.catalog.showCode;});
      else if(action==='toggle-accepting')store.set(state=>{state.operations.acceptingOrders=!state.operations.acceptingOrders;state.operations.immediateStopped=false;return state;});
      else if(action==='save-close-time'){const v=document.getElementById('scheduled-close')?.value||'';store.set(state=>{state.operations.scheduledClose=v;return state;});showToast('接單時間已更新');}
      else if(action==='immediate-stop')store.set(state=>{state.operations.acceptingOrders=false;state.operations.immediateStopped=true;return state;});
      else if(action==='resume-orders')store.set(state=>{state.operations.acceptingOrders=true;state.operations.immediateStopped=false;state.operations.scheduledClose='';return state;});
      else if(action==='detail-option'){
        markDirty();const g=button.dataset.group,v=button.dataset.value,multi=button.dataset.multi==='true';
        if(modal.type==='drink'){if(g==='sweetness')modal.draft.sweetness=modal.draft.sweetness===v?'':v;if(g==='ice')modal.draft.ice=modal.draft.ice===v?'':v;if(g.startsWith('group-sweetness-')){const x=Number(g.split('-').pop()),group=modal.draft.groups[x];group.sweetness=group.sweetness===v?'':v;}if(g.startsWith('group-ice-')){const x=Number(g.split('-').pop()),group=modal.draft.groups[x];group.ice=group.ice===v?'':v;}}
        else if(multi){const arr=modal.draft.options[g]||[];modal.draft.options[g]=arr.includes(v)?arr.filter(x=>x!==v):arr.concat(v);}else modal.draft.options[g]=modal.draft.options[g]===v?'':v;
        render();
      }
      else if(action==='detail-drink'){const parent=modal;modal={type:'drink',drinkId:button.dataset.id,context:'detail',maxQty:parent.draft.qty,parent,anchor:actionAnchor(button,anchorOverride),dirty:false,draft:{qty:parent.draft.qty,sweetness:'',ice:'',groups:[]}};render();}
      else if(action==='detail-qty'){markDirty();modal.draft.qty=Math.max(1,modal.draft.qty+Number(button.dataset.delta));render();}
      else if(action==='toggle-keypad'){modal.draft.keypad=!modal.draft.keypad;render();}
      else if(action==='keypad'){const key=button.dataset.key;if(key==='完成')modal.draft.keypad=false;else if(key==='←')modal.draft.keypadValue=modal.draft.keypadValue.slice(0,-1);else modal.draft.keypadValue=(modal.draft.keypadValue+key).replace(/^0+(?=\d)/,'');if(modal.draft.keypadValue)modal.draft.qty=Math.max(1,Number(modal.draft.keypadValue));markDirty();render();}
      else if(action==='apply-product')applyProduct();
      else if(action==='modifier-qty'){markDirty();modal.draft.qty=Math.max(0,Math.min(modal.maxQty,modal.draft.qty+Number(button.dataset.delta)));render();}
      else if(action==='group-qty'){markDirty();const g=modal.draft.groups[Number(button.dataset.index)];const used=modal.draft.qty+modal.draft.groups.reduce((n,x)=>n+x.qty,0);g.qty=Math.max(1,Math.min(g.qty+Number(button.dataset.delta),modal.maxQty-used+g.qty));render();}
      else if(action==='add-drink-group'){markDirty();const used=modal.draft.qty+modal.draft.groups.reduce((n,x)=>n+x.qty,0);if(used<modal.maxQty)modal.draft.groups.push({qty:1,sweetness:'',ice:'',open:true});else showToast('已達可補數量');render();}
      else if(action==='toggle-drink-adjustment'){const g=modal.draft.groups[Number(button.dataset.index)];g.open=!g.open;render();}
      else if(action==='apply-drink')applyDrink();
      else if(action==='quick-drink'){
        if(store.get().settings.quickDrinks.quickAssist===false){showToast('快捷補選已關閉');return;}
        const target=findDrinkTarget(store.get().cart),missing=pendingSummary(store.get().cart).drink;if(!missing||!target){showToast('目前沒有待補飲品');return;}pendingDrinkAssignment={lineId:target.lineId,name:target.name};openDrink(button.dataset.id,'global',missing,actionAnchor(button,anchorOverride));
      }
      else if(action==='complete-group'){modal.draft=completionDraft(button.dataset.group);modal.dirty=false;render();}
      else if(action==='completion-back'){modal.draft={activeGroup:'',activeTarget:'',assignments:{}};modal.dirty=false;render();}
      else if(action==='completion-target'){modal.draft.activeTarget=button.dataset.id;render();}
      else if(action==='completion-required-choice'){
        const target=modal.draft.activeTarget,value=button.dataset.value;if(!target)return;
        modal.draft.assignments={...(modal.draft.assignments||{}),[target]:value};modal.dirty=true;
        const targets=requiredTargets(store.get().cart,modal.draft.activeGroup),next=targets.find(item=>!modal.draft.assignments[item.id]);if(next)modal.draft.activeTarget=next.id;render();
      }
      else if(action==='completion-fill-remaining'){
        const value=button.dataset.value,targets=requiredTargets(store.get().cart,modal.draft.activeGroup);targets.forEach(target=>{if(!modal.draft.assignments[target.id])modal.draft.assignments[target.id]=value;});modal.dirty=true;render();
      }
      else if(action==='apply-required-group')applyRequiredGroup();
      else if(action==='linkup-all')applyLinkUp(Number(button.dataset.count)||0);
      else if(action==='open-specified-link'){const count=pairingGroupCount(store.get().cart),groups=Array.from({length:count},()=>({main:'',snack:'',drink:''}));if(!count){showToast('需要主餐及小食才可指定配對');return;}modal={type:'specified-link',anchor:actionAnchor(button,anchorOverride),dirty:false,draft:{groups,active:0}};render();}
      else if(action==='select-pairing-group'){modal.draft.active=Number(button.dataset.index)||0;render();}
      else if(action==='select-link-item'){const group=modal.draft.groups[modal.draft.active],role=button.dataset.role;group[role]=group[role]===button.dataset.id?'':button.dataset.id;render();}
      else if(action==='select-link-drink'){const group=modal.draft.groups[modal.draft.active];group.drink=group.drink===button.dataset.id?'':button.dataset.id;render();}
      else if(action==='apply-specified-link'){
        const groups=safeClone(modal.draft.groups.filter(group=>group.main&&group.snack));
        store.set(state=>{let next=state.cart;groups.forEach(group=>{const quickId=group.drink?.startsWith('quick:')?group.drink.slice(6):'',quick=quickId?drinkMap.get(quickId):null;next=combineRiceballSet(next,{mainLineId:group.main,snackLineId:group.snack,drinkLineId:quickId?'':group.drink,quickDrink:quick?{productId:quick.id,drinkId:quick.id,name:quick.name,image:quick.image,unitPrice:quick.price,selection:drinkSelection(quick.id)}:null},{comboId:stableId('combo'),lineId:stableId('line'),comboPrice:59,source:'specified'});});state.cart=normalizeCart(next,state.orderServiceMode);state.lastAffectedLineId=state.cart.at(-1)?.lineId||'';state.lastMutationKind='changed';return state;});modal=null;queue.afterRender(()=>showToast('已建立 '+groups.length+' 組指定套餐'));
      }
      else if(action==='select-combo-component'){const role=button.dataset.role,id=button.dataset.id,item=role==='drink'?drinkMap.get(id):productMap.get(id);if(!item)return;modal.draft.components=modal.draft.components.filter(component=>component.role!==role).concat({role,source:role==='drink'?'quick':'catalog',productId:item.id,drinkId:role==='drink'?item.id:'',name:item.name,image:item.image||'',unitPrice:Number(item.price||0),options:{}});modal.dirty=true;render();}
      else if(action==='clear-combo-component'){modal.draft.components=modal.draft.components.filter(component=>component.role!=='drink');modal.dirty=true;render();}
      else if(action==='apply-combo-edit'){const components=safeClone(modal.draft.components),lineId=modal.lineId,drink=components.find(item=>item.role==='drink');store.set(state=>{state.cart=state.cart.map(line=>line.lineId!==lineId?line:{...line,image:components.find(item=>item.role==='main')?.image||line.image,drinkAssignments:drink?[{drinkId:drink.productId,name:drink.name,image:drink.image||'',sweetness:'',ice:'',source:drink.source}]:[],combo:{...line.combo,components,missingRoles:drink?[]:['drink']}});state.lastAffectedLineId=lineId;state.lastMutationKind='changed';return state;});modal=null;queue.afterRender(()=>showToast('套餐組合已更新'));}
      else if(action==='request-dissolve-combo'){const line=store.get().cart.find(item=>item.lineId===modal.lineId);const singles=(line?.combo?.components||[]).reduce((sum,item)=>sum+Number(item.unitPrice||0),0);confirmState={kind:'dissolve',lineId:modal.lineId,title:'拆開套餐？',message:'拆開後會還原為獨立產品，並按單品價格重新計算（'+money(singles)+'）。'};render();}
      else if(action==='later-new-order'){newOrderNotice.visible=false;render();}
      else if(action==='process-new-order'){newOrderNotice.visible=false;modal={type:'pending',anchor:null,dirty:false};render();}
      else if(action==='clear-cart'){if(window.confirm('清空後不可恢復，確定清空整張購物車？'))store.set(state=>({...state,cart:[],orderServiceMode:state.dineContext?SERVICE_DINE_IN:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));}
      else if(action==='cancel-dine-order')requestDineCancellation();
      else if(action==='checkout'){
        const current=store.get();if(pendingSummary(current.cart).total){showToast('請先完成必選項目');return;}if(!current.cart.length)return;
        if(current.dineContext){try{const dineState=readJSON(DINE_STORAGE_KEY,null);const dineCart=applyOrderServiceMode(current.cart,SERVICE_DINE_IN);const next=commitTableOrder(dineState,current.dineContext,dineCart,{terminalId,history:readJSON(ORDER_HISTORY_STORAGE_KEY,[])});writeJSON(DINE_STORAGE_KEY,next);syncDinePrintJobs(next);store.set(state=>({...state,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));window.parent?.postMessage?.({type:'morefun:navigate',route:'dine'},'*');}catch(error){showToast(error.message||'未能加入堂食枱位');}return;}
        window.parent?.postMessage?.({type:'morefun:navigate',route:'checkout'},'*');
      }
    }
    app.addEventListener('morefun:status-action',event=>{const button=event.target.closest('[data-action]');if(!button||button.disabled)return;event.preventDefault();handle(button,event.detail?.anchor||null);});
    app.addEventListener('click',event=>{if(event.target.classList?.contains('modal-scrim')){event.preventDefault();requestDismiss();return;}const button=event.target.closest('[data-action]');if(button&&!button.disabled)handle(button);});
    app.addEventListener('pointerdown',event=>{if(event.target.closest('.quick-drawer-panel'))scheduleQuickDrawerClose();});
    app.addEventListener('input',event=>{if(event.target.matches('[data-action="detail-note"]')&&modal?.type==='product'){modal.draft.note=event.target.value;markDirty();return;}if(event.target.matches('[data-action="search-query"]')&&modal?.type==='search'){const value=event.target.value;store.setTransient(state=>({...state,searchQuery:value}));queue.afterRender(()=>{const input=document.querySelector('[data-action="search-query"]');if(input){input.focus();input.setSelectionRange(value.length,value.length);}});}});
    addEventListener('message',event=>{if(event.data?.type==='morefun:page-activate'&&event.data.route==='order'){const current=readJSON(ORDER_STORAGE_KEY,null);if(current?.dineContext&&!store.get().dineContext)store.set(state=>({...state,dineContext:current.dineContext,orderServiceMode:SERVICE_DINE_IN,cart:applyOrderServiceMode(current.cart||[],SERVICE_DINE_IN)}));}});
    render();
    async function bootstrapLiveMenu(){
      const catalog=await loadMenuCatalog({fallback:fallbackCatalog});
      categories=[...(catalog.categories||fallbackCategories)];products=[...(catalog.products||fallbackProducts)];drinks=[...(catalog.drinks?.length?catalog.drinks:fallbackDrinks)];indexCatalog();
      store.set(state=>{if(!categories.includes(state.category))state.category='全部';const existing=state.settings.quickDrinks.order||[];state.settings.quickDrinks.order=[...existing.filter(id=>drinkMap.has(id)),...drinks.map(item=>item.id).filter(id=>!existing.includes(id))];state.health.catalog={ok:catalog.source!=='fallback',label:'餐牌',detail:catalog.source==='firebase'?'已連接 Firebase 餐牌來源':catalog.source==='cache'?'離線模式：使用上次餐牌':'Firebase 未連接：使用內置後備餐牌'};state.health.sync={...state.health.sync,detail:catalog.source==='firebase'?'餐牌同步正常':'餐牌等待重新連線'};return state;});
      showToast(catalog.source==='firebase'?'餐牌已同步':catalog.source==='cache'?'網絡未連接，已載入上次餐牌':'Firebase 未連接，現正使用後備餐牌');
    }
    bootstrapLiveMenu().catch(error=>{console.error('MENU_BOOTSTRAP_FAILED',error);showToast('餐牌連接失敗，已保留本機點單');});
    setTimeout(()=>{if(newOrderNotice?.visible){newOrderNotice.visible=false;render();}},3000);
    setInterval(()=>{const current=store.get();if(!current.runningOrders.length)return;const next=completeExpiredOrders(current.runningOrders);const completed=next.filter((order,index)=>order.status==='completed'&&current.runningOrders[index]?.status!=='completed');if(!completed.length)return;store.set(state=>{state.runningOrders=next.filter(order=>order.status==='running');state.completedOrders=state.completedOrders.concat(completed);return state;});},30000);
    
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:208:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: accepting a verified pending order creates a running order with a 30 minute deadline
ok 153 - accepting a verified pending order creates a running order with a 30 minute deadline
  ---
  duration_ms: 0.243094
  type: 'test'
  ...
# Subtest: running orders auto-complete after 30 minutes without intermediate states
ok 154 - running orders auto-complete after 30 minutes without intermediate states
  ---
  duration_ms: 0.264214
  type: 'test'
  ...
# Subtest: WhatsApp QR target opens the customer chat with the preset message
ok 155 - WhatsApp QR target opens the customer chat with the preset message
  ---
  duration_ms: 0.231343
  type: 'test'
  ...
# Subtest: pending verification uses start review then confirm order wording
ok 156 - pending verification uses start review then confirm order wording
  ---
  duration_ms: 0.234629
  type: 'test'
  ...
# Subtest: cart locks price and quantity-edit controls into dedicated regions
ok 157 - cart locks price and quantity-edit controls into dedicated regions
  ---
  duration_ms: 0.291735
  type: 'test'
  ...
# Subtest: drink adjustment starts compact and expands only after add adjustment
ok 158 - drink adjustment starts compact and expands only after add adjustment
  ---
  duration_ms: 0.228677
  type: 'test'
  ...
# Subtest: specified pairing candidates use a three-column text-card grid
ok 159 - specified pairing candidates use a three-column text-card grid
  ---
  duration_ms: 1.098394
  type: 'test'
  ...
# Subtest: cart keeps price flush right and actions aligned with the image
ok 160 - cart keeps price flush right and actions aligned with the image
  ---
  duration_ms: 0.351588
  type: 'test'
  ...
# Subtest: 首次渲染由共用函數提供待處理數量給頂欄及導航
ok 161 - 首次渲染由共用函數提供待處理數量給頂欄及導航
  ---
  duration_ms: 0.378328
  type: 'test'
  ...
# Subtest: 點單頁最近訂單讀取共用歷史而不再寫死舊單號
ok 162 - 點單頁最近訂單讀取共用歷史而不再寫死舊單號
  ---
  duration_ms: 0.159418
  type: 'test'
  ...
# Subtest: 子頁啟動錯誤會顯示可見後備畫面而不是白屏
not ok 163 - 子頁啟動錯誤會顯示可見後備畫面而不是白屏
  ---
  duration_ms: 16.837688
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:274:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /morefun:page-runtime-error/. Input:
    
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
      'function syncChildOverlay(frame){\n' +
      '  try{\n' +
      '    const doc=frame?.contentDocument;\n' +
      "    const open=Boolean(doc?.querySelector?.('.dialog-layer,.confirm-layer,.overlay-scrim,.anchored-popover'));\n" +
      '    setChildOverlayState(frame,open);\n' +
      '  }catch(_error){}\n' +
      '}\n' +
      'function stopChildOverlayObserver(frame){\n' +
      '  try{\n' +
      '    frame?._shellOverlayObserver?.disconnect?.();\n' +
      '    if(frame)frame._shellOverlayObserver=null;\n' +
      '    const doc=frame?.contentDocument;\n' +
      '    if(doc?.documentElement)delete doc.documentElement.dataset.shellOverlayObserver;\n' +
      '  }catch(_error){}\n' +
      '}\n' +
      '\n' +
      'function installChildOverlayObserver(frame){\n' +
      '  try{\n' +
      "    if(frame?.dataset?.route==='order'||frame!==activeFrame)return;\n" +
      '    const doc=frame?.contentDocument;\n' +
      '    if(!doc?.documentElement||frame._shellOverlayObserver)return;\n' +
      "    doc.documentElement.dataset.shellOverlayObserver='1';\n" +
      '    const observer=new MutationObserver(()=>syncChildOverlay(frame));\n' +
      "    observer.observe(doc.body||doc.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});\n" +
      '    frame._shellOverlayObserver=observer;\n' +
      '    syncChildOverlay(frame);\n' +
      "  }catch(error){console.warn('GLOBAL_SHELL_OVERLAY_OBSERVER_FAILED',error);}\n" +
      '}\n' +
      '\n' +
      'function applyChildShellMode(frame){\n' +
      '  try{\n' +
      '    const doc=frame?.contentDocument;\n' +
      '    if(!doc?.documentElement)return;\n' +
      "    doc.documentElement.dataset.globalShell='1';\n" +
      '    installChildOverlayObserver(frame);\n' +
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
      'function showLoaderError(message,target=activeFrame){\n' +
      "  if(target!==activeFrame){console.error('PAGE_TRANSITION_FAILED',message);if(target?.dataset.route===pending){pending='';delete stage.dataset.pendingRoute;}target?.classList.remove('is-loading');if(routeFeedback)routeFeedback.hidden=true;return;}\n" +
      `  target.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';\n` +
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
      "  if(old&&old!==frame){stopChildOverlayObserver(old);old.classList.remove('is-active','is-loading','has-shell-overlay');old.setAttribute('aria-hidden','true');old.tabIndex=-1;if(old.id==='page')old.id='page-cache-'+String(old.dataset.route||'route');}\n" +
      "  shellApp?.classList.remove('child-overlay-active');\n" +
      "  const existingPage=document.getElementById('page');if(existingPage&&existingPage!==frame)existingPage.removeAttribute('id');\n" +
      "  frame.id='page';frame.classList.remove('is-loading');frame.classList.add('is-active');frame.setAttribute('aria-hidden','false');frame.removeAttribute('tabindex');\n" +
      "  activeFrame=frame;current=key;pending='';childReady=true;clearTimeout(watchdogTimer);stage.dataset.route=current;delete stage.dataset.pendingRoute;\n" +
      "  if(key==='checkout')checkoutExitArmed='';\n" +
      '  setShellRouteUi(key,{loading:false});\n' +
      '  applyChildShellMode(frame);\n' +
      "  if(key!=='order')syncChildOverlay(frame);else setChildOverlayState(frame,frame.classList.contains('has-shell-overlay'));\n" +
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
      "  if(force){readyRoutes.delete(key);stopChildOverlayObserver(frame);frame.classList.add('is-loading');frame.classList.remove('is-active');frame.setAttribute('aria-hidden','true');delete frame.dataset.appliedProfile;frame.src=pageUrl(key,'reload');}\n" +
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
      "  preloadStarted=true;preloadQueue=['checkout',...mainRoutes.filter(key=>key!=='order')];setTimeout(pre"... 3709 more characters
    
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
    function syncChildOverlay(frame){
      try{
        const doc=frame?.contentDocument;
        const open=Boolean(doc?.querySelector?.('.dialog-layer,.confirm-layer,.overlay-scrim,.anchored-popover'));
        setChildOverlayState(frame,open);
      }catch(_error){}
    }
    function stopChildOverlayObserver(frame){
      try{
        frame?._shellOverlayObserver?.disconnect?.();
        if(frame)frame._shellOverlayObserver=null;
        const doc=frame?.contentDocument;
        if(doc?.documentElement)delete doc.documentElement.dataset.shellOverlayObserver;
      }catch(_error){}
    }
    
    function installChildOverlayObserver(frame){
      try{
        if(frame?.dataset?.route==='order'||frame!==activeFrame)return;
        const doc=frame?.contentDocument;
        if(!doc?.documentElement||frame._shellOverlayObserver)return;
        doc.documentElement.dataset.shellOverlayObserver='1';
        const observer=new MutationObserver(()=>syncChildOverlay(frame));
        observer.observe(doc.body||doc.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});
        frame._shellOverlayObserver=observer;
        syncChildOverlay(frame);
      }catch(error){console.warn('GLOBAL_SHELL_OVERLAY_OBSERVER_FAILED',error);}
    }
    
    function applyChildShellMode(frame){
      try{
        const doc=frame?.contentDocument;
        if(!doc?.documentElement)return;
        doc.documentElement.dataset.globalShell='1';
        installChildOverlayObserver(frame);
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
    
    function showLoaderError(message,target=activeFrame){
      if(target!==activeFrame){console.error('PAGE_TRANSITION_FAILED',message);if(target?.dataset.route===pending){pending='';delete stage.dataset.pendingRoute;}target?.classList.remove('is-loading');if(routeFeedback)routeFeedback.hidden=true;return;}
      target.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';
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
      if(old&&old!==frame){stopChildOverlayObserver(old);old.classList.remove('is-active','is-loading','has-shell-overlay');old.setAttribute('aria-hidden','true');old.tabIndex=-1;if(old.id==='page')old.id='page-cache-'+String(old.dataset.route||'route');}
      shellApp?.classList.remove('child-overlay-active');
      const existingPage=document.getElementById('page');if(existingPage&&existingPage!==frame)existingPage.removeAttribute('id');
      frame.id='page';frame.classList.remove('is-loading');frame.classList.add('is-active');frame.setAttribute('aria-hidden','false');frame.removeAttribute('tabindex');
      activeFrame=frame;current=key;pending='';childReady=true;clearTimeout(watchdogTimer);stage.dataset.route=current;delete stage.dataset.pendingRoute;
      if(key==='checkout')checkoutExitArmed='';
      setShellRouteUi(key,{loading:false});
      applyChildShellMode(frame);
      if(key!=='order')syncChildOverlay(frame);else setChildOverlayState(frame,frame.classList.contains('has-shell-overlay'));
      try{
        if(key==='checkout')frame.contentWindow?.postMessage({type:'morefun:checkout-enter',route:key},'*');
        frame.contentWindow?.postMessage({type:'morefun:page-activate',route:key},'*');
      }catch(_error){}
    }
    
    function armWatchdog(frame,key){clearTimeout(watchdogTimer);watchdogTimer=setTimeout(()=>{if(key!==pending||readyRoutes.has(key))return;frame.src=pageUrl(key,'retry');},1800);}
    function ensureFrameLoading(key,{force=false,background=false}={}){
      let frame=frameByRoute.get(key);
      if(!frame){frame=createHiddenFrame(key);frame.src=pageUrl(key,force?'reload':'normal');return frame;}
      if(force){readyRoutes.delete(key);stopChildOverlayObserver(frame);frame.classList.add('is-loading');frame.classList.remove('is-active');frame.setAttribute('aria-hidden','true');delete frame.dataset.appliedProfile;frame.src=pageUrl(key,'reload');}
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
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:276:10)
    async Test.run (node:internal/test_runner/test:1054:7)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: specified pairing creates dynamic labelled groups
ok 164 - specified pairing creates dynamic labelled groups
  ---
  duration_ms: 0.23001
  type: 'test'
  ...
# Subtest: all drink selection surfaces share the same vertical card language
not ok 165 - all drink selection surfaces share the same vertical card language
  ---
  duration_ms: 1.472774
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:291:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /drinkChoiceCard\(d,'completion-drink'.*'completion'\)/. Input:
    
    "import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';\n" +
      "import {ORDER_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,SETTINGS_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,DINE_STORAGE_KEY,SUPPLY_STORAGE_KEY,PRINTER_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';\n" +
      "import {clearExpiredBusinessDayDrafts,createDraftRecord,normalizeTerminalId,restoreDraftForTerminal} from '../../shared/operations.js';\n" +
      "import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';\n" +
      "import {orderPageConfig as defaults} from './page-config.js';\n" +
      "import {categories as fallbackCategories,products as fallbackProducts,drinks as fallbackDrinks,optionSets} from './page-data.js';\n" +
      "import {loadMenuCatalog,MENU_CACHE_KEY} from './menu-api.js';\n" +
      "import {acceptPendingOrder,combineRiceballSet,dissolveRiceballSet,completeExpiredOrders,createWhatsAppLink,updateCartLineQuantity,CART_VIEW_INPUT,CART_VIEW_ORGANIZED,SERVICE_TAKEAWAY,SERVICE_DINE_IN,normalizeCartViewMode,normalizeServiceMode,resolveInitialOrderServiceMode,applyOrderServiceMode,toggleLineServiceMode,cartForView,inferOrderServiceMode} from './order-domain.js';\n" +
      "import {commitTableOrder,createInitialDineState,cleanupEmptyDineSessions} from '../dine/dine-domain.js';\n" +
      "import {defaultPrinterState,importExternalPrintJobs} from '../more/print-domain.js';\n" +
      "import {buildCategoryLayout,normalizeCategoryLayout} from './category-layout.js';\n" +
      "import {renderGlobalStatusBar,renderBottomNav} from '../../shared/shell.js';\n" +
      "import {activeDineOrderIdentities,latestOrderDisplayNumber} from '../../shared/order-identity.js';\n" +
      '\n' +
      "const app=document.getElementById('app');\n" +
      'const fallbackCatalog={categories:fallbackCategories,products:fallbackProducts,drinks:fallbackDrinks};\n' +
      'const cachedCatalog=readJSON(MENU_CACHE_KEY,null);\n' +
      'const initialCatalog=cachedCatalog?.products?.length?cachedCatalog:fallbackCatalog;\n' +
      'let categories=[...(initialCatalog.categories||fallbackCategories)],products=[...(initialCatalog.products||fallbackProducts)],drinks=[...(initialCatalog.drinks||fallbackDrinks)];\n' +
      'let productMap=new Map(),drinkMap=new Map(),snackProducts=[],drinkProducts=[];\n' +
      'function indexCatalog(){\n' +
      '  productMap=new Map(products.map(item=>[item.id,item]));\n' +
      '  drinkMap=new Map(drinks.map(item=>[item.id,item]));\n' +
      "  snackProducts=products.filter(item=>item.linkRole==='snack');\n" +
      "  drinkProducts=products.filter(item=>item.linkRole==='drink');\n" +
      '}\n' +
      'indexCatalog();\n' +
      'let modal=null;\n' +
      'const supplyOverrides=readJSON(SUPPLY_STORAGE_KEY,{})||{};\n' +
      "function supplyStatus(product){return supplyOverrides[product.id]?.status||(product.available===false?'soldout':'available');}\n" +
      "function supplyLabel(status){return status==='soldout'?'今日售罄':status==='paused'?'暫停供應':'供應中';}\n" +
      "function sortPausedLast(items){return items.map((item,index)=>({item,index})).sort((a,b)=>Number(supplyStatus(a.item)==='paused')-Number(supplyStatus(b.item)==='paused')||a.index-b.index).map(row=>row.item);}\n" +
      'let confirmState=null;\n' +
      "let newOrderNotice={id:'A516',source:'磨飯 App',items:3,amount:104,visible:true};\n" +
      'const demoPendingOrders={\n' +
      "  online:[{id:'A512',source:'磨飯 App',contact:'陳小姐',phone:'85291234567',items:5,amount:168,wait:'2 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'FPS',proof:'../../assets/products/f4.webp',lines:[['蜜糖雞絲＋鹽酥雞',2,90],['台式奶茶',2,32],['香脆雞翼',1,18]]},{id:'W331',source:'網頁',contact:'梁先生',phone:'85262345678',items:3,amount:62,wait:'1 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'PayMe',proof:'../../assets/products/f1.webp',lines:[['原味紫米飯團',1,41],['味噌湯',1,12],['可樂',1,9]]}],\n" +
      "  queue:[{id:'T1824',source:'電話',contact:'電話尾號 1824',phone:'85261231824',items:2,amount:96,wait:'4 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'待確認',proof:'',lines:[['自選便當',2,96]]},{id:'T6631',source:'WhatsApp',contact:'WhatsApp 尾號 6631',phone:'85261236631',items:1,amount:59,wait:'6 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'FPS',proof:'',lines:[['紫米飯團 A 餐',1,59]]}]\n" +
      '};\n' +
      '\n' +
      'const saved=readJSON(ORDER_STORAGE_KEY,null);\n' +
      'const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});\n' +
      'let drafts=readJSON(DRAFT_STORAGE_KEY,[]);\n' +
      'const expiredDrafts=clearExpiredBusinessDayDrafts(drafts);\n' +
      'if(expiredDrafts.voided.length){drafts=expiredDrafts.remaining;writeJSON(DRAFT_STORAGE_KEY,drafts);}\n' +
      'let draftCounters=readJSON(DRAFT_COUNTER_STORAGE_KEY,{});\n' +
      "const terminalId=normalizeTerminalId(localStorage.getItem(TERMINAL_ID_STORAGE_KEY)||new URLSearchParams(location.search).get('terminal')||'SMT');\n" +
      'localStorage.setItem(TERMINAL_ID_STORAGE_KEY,terminalId);\n' +
      'const settings={\n' +
      '  catalog:{...defaults.catalog,showImages:true,...(savedSettings.catalog||{}),productOverrides:{}},\n' +
      '  categoryLayout:normalizeCategoryLayout(savedSettings.categoryLayout||defaults.categoryLayout),\n' +
      '  cart:{...defaults.cart,...(savedSettings.cart||{}),viewMode:normalizeCartViewMode(savedSettings.cartViewMode||savedSettings.cart?.viewMode)},\n' +
      '  quickDrinks:{...defaults.quickDrinks,...(savedSettings.quickDrinks||{})}\n' +
      '};\n' +
      'function syncDinePrintJobs(dineState){\n' +
      '  const current=readJSON(PRINTER_STORAGE_KEY,null)||defaultPrinterState();\n' +
      '  writeJSON(PRINTER_STORAGE_KEY,importExternalPrintJobs(current,{dine:dineState}));\n' +
      '}\n' +
      '\n' +
      "function drinkSelection(id,sweetness='',ice=''){\n" +
      '  const d=drinkMap.get(id);\n' +
      '  return {drinkId:id,name:d?.name||id,unitPrice:d?.price||0,sweetness,ice,studentDiscountEligible:d?.studentDiscountEligible===true,specialDrinkSurcharge:Number(d?.specialDrinkSurcharge)||0};\n' +
      '}\n' +
      "function makeLine(productId,qty=1,{options={},drinkAssignments=[],linkedComboId='',linkedQty=0,serviceMode=SERVICE_TAKEAWAY}={}){\n" +
      '  const p=productMap.get(productId);\n' +
      '  qty=Math.max(1,Number(qty)||1);\n' +
      '  return {\n' +
      "    lineId:stableId('line'),productId,name:p.name,image:p.image,category:p.category,qty,\n" +
      '    unitPrice:p.price,total:p.price*qty,options:safeClone(options),\n' +
      '    studentDiscountEligible:p.studentDiscountEligible===true,specialDrinkSurcharge:Number(p.specialDrinkSurcharge)||0,\n' +
      '    drinkAssignments:safeClone(drinkAssignments),drinkSlots:(p.drinkSlots||0)*qty,\n' +
      "    required:[...(p.required||[])],combinable:Boolean(p.combinable),linkRole:p.linkRole||'',\n" +
      "    serviceMode:normalizeServiceMode(serviceMode,SERVICE_TAKEAWAY),serviceModeOverride:'',\n" +
      '    linkedComboId,linkedQty,createdOrder:Date.now()+Math.random()\n' +
      '  };\n' +
      '}\n' +
      'function normalizeCart(cart,defaultMode=SERVICE_TAKEAWAY){\n' +
      '  return (Array.isArray(cart)?cart:[]).map((line,index)=>{\n' +
      '    const p=productMap.get(line.productId)||{};\n' +
      '    const qty=Math.max(1,Number(line.qty)||1);\n' +
      '    const unitPrice=Number(line.unitPrice??p.price??0);\n' +
      '    const serviceMode=normalizeServiceMode(line.serviceMode,defaultMode);\n' +
      "    return {...line,lineId:line.lineId||stableId('line'),name:line.name||p.name||'餐點',image:line.image||p.image||'',category:line.category||p.category||'',qty,unitPrice,total:unitPrice*qty,serviceMode,serviceModeOverride:line.serviceModeOverride||'',options:{...(line.options||{})},studentDiscountEligible:line.studentDiscountEligible===true||p.studentDiscountEligible===true,specialDrinkSurcharge:Number(line.specialDrinkSurcharge??p.specialDrinkSurcharge)||0,drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],drinkSlots:Number(line.drinkSlots??(p.drinkSlots||0)*qty),required:Array.isArray(line.required)?line.required:[...(p.required||[])],combinable:Boolean(line.combinable??p.combinable),linkRole:line.linkRole||p.linkRole||'',linkedComboId:line.linkedComboId||'',linkedQty:Number(line.linkedQty||0),createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:index};\n" +
      '  }).sort((a,b)=>a.createdOrder-b.createdOrder);\n' +
      '}\n' +
      "function mergeKey(line){return JSON.stringify({productId:line.productId,serviceMode:line.serviceMode,options:line.options,drinks:line.drinkAssignments.map(d=>[d.drinkId,d.sweetness||'',d.ice||'']),linkedComboId:line.linkedComboId});}\n" +
      'function mergeCart(cart,mode){\n' +
      "  const rows=normalizeCart(cart);if(mode==='never')return rows;\n" +
      '  const out=[];\n' +
      '  rows.forEach(line=>{\n' +
      "    const found=line.lineType==='combo'?null:out.find(item=>item.productId===line.productId&&(mode==='always'||mergeKey(item)===mergeKey(line)));\n" +
      '    if(!found){out.push(safeClone(line));return;}\n' +
      '    found.qty+=line.qty;found.total=found.unitPrice*found.qty;found.drinkSlots+=line.drinkSlots;found.drinkAssignments.push(...safeClone(line.drinkAssignments));\n' +
      '  });\n' +
      '  return out;\n' +
      '}\n' +
      'function describe(line){\n' +
      '  const parts=[];\n' +
      "  if(line.lineType==='combo'){\n" +
      '    const names=(line.combo?.components||[]).map(item=>item.name).filter(Boolean);\n' +
      "    if(names.length)parts.push(names.join('＋'));\n" +
      "    if(line.combo?.discount)parts.push('套餐優惠 -'+money(line.combo.discount));\n" +
      '  }\n' +
      "  Object.entries(line.options||{}).forEach(([key,value])=>{if(value)parts.push(Array.isArray(value)?value.join('、'):value);});\n" +
      '  const grouped={};\n' +
      "  (line.drinkAssignments||[]).forEach(d=>{const key=[d.name,d.sweetness||'',d.ice||''].join('|');grouped[key]=(grouped[key]||0)+1;});\n" +
      "  Object.entries(grouped).forEach(([key,count])=>{const [name,sweet,ice]=key.split('|');const mods=[sweet,ice].filter(Boolean).join(' · ');parts.push(name+(mods?' · '+mods:'')+(count>1?' ×'+count:''));});\n" +
      "  if(line.linkedComboId)parts.push('已組合套餐'+(line.linkedQty>1?' ×'+line.linkedQty:''));\n" +
      '  const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);\n' +
      "  if(missing&&line.required.includes('drink'))parts.push('尚欠飲品 '+missing+' 份');\n" +
      "  return parts.join(' · ')||'標準';\n" +
      '}\n' +
      'function missingGroups(line){\n' +
      '  const groups=[];\n' +
      '  (line.required||[]).forEach(group=>{\n' +
      "    if(group==='drink'){\n" +
      '      const count=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);\n' +
      "      if(count)groups.push({group,label:'飲品',count});\n" +
      "    }else if(!line.options?.[group]) groups.push({group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':'小食',count:line.qty||1});\n" +
      '  });\n' +
      '  return groups;\n' +
      '}\n' +
      'function pendingSummary(cart){\n' +
      '  const out={rice:0,sauce:0,snack:0,drink:0,total:0};\n' +
      '  cart.forEach(line=>missingGroups(line).forEach(item=>{out[item.group]+=item.count;out.total+=item.count;}));\n' +
      '  ret'... 90308 more characters
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';
    import {ORDER_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,SETTINGS_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,DINE_STORAGE_KEY,SUPPLY_STORAGE_KEY,PRINTER_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';
    import {clearExpiredBusinessDayDrafts,createDraftRecord,normalizeTerminalId,restoreDraftForTerminal} from '../../shared/operations.js';
    import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';
    import {orderPageConfig as defaults} from './page-config.js';
    import {categories as fallbackCategories,products as fallbackProducts,drinks as fallbackDrinks,optionSets} from './page-data.js';
    import {loadMenuCatalog,MENU_CACHE_KEY} from './menu-api.js';
    import {acceptPendingOrder,combineRiceballSet,dissolveRiceballSet,completeExpiredOrders,createWhatsAppLink,updateCartLineQuantity,CART_VIEW_INPUT,CART_VIEW_ORGANIZED,SERVICE_TAKEAWAY,SERVICE_DINE_IN,normalizeCartViewMode,normalizeServiceMode,resolveInitialOrderServiceMode,applyOrderServiceMode,toggleLineServiceMode,cartForView,inferOrderServiceMode} from './order-domain.js';
    import {commitTableOrder,createInitialDineState,cleanupEmptyDineSessions} from '../dine/dine-domain.js';
    import {defaultPrinterState,importExternalPrintJobs} from '../more/print-domain.js';
    import {buildCategoryLayout,normalizeCategoryLayout} from './category-layout.js';
    import {renderGlobalStatusBar,renderBottomNav} from '../../shared/shell.js';
    import {activeDineOrderIdentities,latestOrderDisplayNumber} from '../../shared/order-identity.js';
    
    const app=document.getElementById('app');
    const fallbackCatalog={categories:fallbackCategories,products:fallbackProducts,drinks:fallbackDrinks};
    const cachedCatalog=readJSON(MENU_CACHE_KEY,null);
    const initialCatalog=cachedCatalog?.products?.length?cachedCatalog:fallbackCatalog;
    let categories=[...(initialCatalog.categories||fallbackCategories)],products=[...(initialCatalog.products||fallbackProducts)],drinks=[...(initialCatalog.drinks||fallbackDrinks)];
    let productMap=new Map(),drinkMap=new Map(),snackProducts=[],drinkProducts=[];
    function indexCatalog(){
      productMap=new Map(products.map(item=>[item.id,item]));
      drinkMap=new Map(drinks.map(item=>[item.id,item]));
      snackProducts=products.filter(item=>item.linkRole==='snack');
      drinkProducts=products.filter(item=>item.linkRole==='drink');
    }
    indexCatalog();
    let modal=null;
    const supplyOverrides=readJSON(SUPPLY_STORAGE_KEY,{})||{};
    function supplyStatus(product){return supplyOverrides[product.id]?.status||(product.available===false?'soldout':'available');}
    function supplyLabel(status){return status==='soldout'?'今日售罄':status==='paused'?'暫停供應':'供應中';}
    function sortPausedLast(items){return items.map((item,index)=>({item,index})).sort((a,b)=>Number(supplyStatus(a.item)==='paused')-Number(supplyStatus(b.item)==='paused')||a.index-b.index).map(row=>row.item);}
    let confirmState=null;
    let newOrderNotice={id:'A516',source:'磨飯 App',items:3,amount:104,visible:true};
    const demoPendingOrders={
      online:[{id:'A512',source:'磨飯 App',contact:'陳小姐',phone:'85291234567',items:5,amount:168,wait:'2 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'FPS',proof:'../../assets/products/f4.webp',lines:[['蜜糖雞絲＋鹽酥雞',2,90],['台式奶茶',2,32],['香脆雞翼',1,18]]},{id:'W331',source:'網頁',contact:'梁先生',phone:'85262345678',items:3,amount:62,wait:'1 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'PayMe',proof:'../../assets/products/f1.webp',lines:[['原味紫米飯團',1,41],['味噌湯',1,12],['可樂',1,9]]}],
      queue:[{id:'T1824',source:'電話',contact:'電話尾號 1824',phone:'85261231824',items:2,amount:96,wait:'4 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'待確認',proof:'',lines:[['自選便當',2,96]]},{id:'T6631',source:'WhatsApp',contact:'WhatsApp 尾號 6631',phone:'85261236631',items:1,amount:59,wait:'6 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'FPS',proof:'',lines:[['紫米飯團 A 餐',1,59]]}]
    };
    
    const saved=readJSON(ORDER_STORAGE_KEY,null);
    const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});
    let drafts=readJSON(DRAFT_STORAGE_KEY,[]);
    const expiredDrafts=clearExpiredBusinessDayDrafts(drafts);
    if(expiredDrafts.voided.length){drafts=expiredDrafts.remaining;writeJSON(DRAFT_STORAGE_KEY,drafts);}
    let draftCounters=readJSON(DRAFT_COUNTER_STORAGE_KEY,{});
    const terminalId=normalizeTerminalId(localStorage.getItem(TERMINAL_ID_STORAGE_KEY)||new URLSearchParams(location.search).get('terminal')||'SMT');
    localStorage.setItem(TERMINAL_ID_STORAGE_KEY,terminalId);
    const settings={
      catalog:{...defaults.catalog,showImages:true,...(savedSettings.catalog||{}),productOverrides:{}},
      categoryLayout:normalizeCategoryLayout(savedSettings.categoryLayout||defaults.categoryLayout),
      cart:{...defaults.cart,...(savedSettings.cart||{}),viewMode:normalizeCartViewMode(savedSettings.cartViewMode||savedSettings.cart?.viewMode)},
      quickDrinks:{...defaults.quickDrinks,...(savedSettings.quickDrinks||{})}
    };
    function syncDinePrintJobs(dineState){
      const current=readJSON(PRINTER_STORAGE_KEY,null)||defaultPrinterState();
      writeJSON(PRINTER_STORAGE_KEY,importExternalPrintJobs(current,{dine:dineState}));
    }
    
    function drinkSelection(id,sweetness='',ice=''){
      const d=drinkMap.get(id);
      return {drinkId:id,name:d?.name||id,unitPrice:d?.price||0,sweetness,ice,studentDiscountEligible:d?.studentDiscountEligible===true,specialDrinkSurcharge:Number(d?.specialDrinkSurcharge)||0};
    }
    function makeLine(productId,qty=1,{options={},drinkAssignments=[],linkedComboId='',linkedQty=0,serviceMode=SERVICE_TAKEAWAY}={}){
      const p=productMap.get(productId);
      qty=Math.max(1,Number(qty)||1);
      return {
        lineId:stableId('line'),productId,name:p.name,image:p.image,category:p.category,qty,
        unitPrice:p.price,total:p.price*qty,options:safeClone(options),
        studentDiscountEligible:p.studentDiscountEligible===true,specialDrinkSurcharge:Number(p.specialDrinkSurcharge)||0,
        drinkAssignments:safeClone(drinkAssignments),drinkSlots:(p.drinkSlots||0)*qty,
        required:[...(p.required||[])],combinable:Boolean(p.combinable),linkRole:p.linkRole||'',
        serviceMode:normalizeServiceMode(serviceMode,SERVICE_TAKEAWAY),serviceModeOverride:'',
        linkedComboId,linkedQty,createdOrder:Date.now()+Math.random()
      };
    }
    function normalizeCart(cart,defaultMode=SERVICE_TAKEAWAY){
      return (Array.isArray(cart)?cart:[]).map((line,index)=>{
        const p=productMap.get(line.productId)||{};
        const qty=Math.max(1,Number(line.qty)||1);
        const unitPrice=Number(line.unitPrice??p.price??0);
        const serviceMode=normalizeServiceMode(line.serviceMode,defaultMode);
        return {...line,lineId:line.lineId||stableId('line'),name:line.name||p.name||'餐點',image:line.image||p.image||'',category:line.category||p.category||'',qty,unitPrice,total:unitPrice*qty,serviceMode,serviceModeOverride:line.serviceModeOverride||'',options:{...(line.options||{})},studentDiscountEligible:line.studentDiscountEligible===true||p.studentDiscountEligible===true,specialDrinkSurcharge:Number(line.specialDrinkSurcharge??p.specialDrinkSurcharge)||0,drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],drinkSlots:Number(line.drinkSlots??(p.drinkSlots||0)*qty),required:Array.isArray(line.required)?line.required:[...(p.required||[])],combinable:Boolean(line.combinable??p.combinable),linkRole:line.linkRole||p.linkRole||'',linkedComboId:line.linkedComboId||'',linkedQty:Number(line.linkedQty||0),createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:index};
      }).sort((a,b)=>a.createdOrder-b.createdOrder);
    }
    function mergeKey(line){return JSON.stringify({productId:line.productId,serviceMode:line.serviceMode,options:line.options,drinks:line.drinkAssignments.map(d=>[d.drinkId,d.sweetness||'',d.ice||'']),linkedComboId:line.linkedComboId});}
    function mergeCart(cart,mode){
      const rows=normalizeCart(cart);if(mode==='never')return rows;
      const out=[];
      rows.forEach(line=>{
        const found=line.lineType==='combo'?null:out.find(item=>item.productId===line.productId&&(mode==='always'||mergeKey(item)===mergeKey(line)));
        if(!found){out.push(safeClone(line));return;}
        found.qty+=line.qty;found.total=found.unitPrice*found.qty;found.drinkSlots+=line.drinkSlots;found.drinkAssignments.push(...safeClone(line.drinkAssignments));
      });
      return out;
    }
    function describe(line){
      const parts=[];
      if(line.lineType==='combo'){
        const names=(line.combo?.components||[]).map(item=>item.name).filter(Boolean);
        if(names.length)parts.push(names.join('＋'));
        if(line.combo?.discount)parts.push('套餐優惠 -'+money(line.combo.discount));
      }
      Object.entries(line.options||{}).forEach(([key,value])=>{if(value)parts.push(Array.isArray(value)?value.join('、'):value);});
      const grouped={};
      (line.drinkAssignments||[]).forEach(d=>{const key=[d.name,d.sweetness||'',d.ice||''].join('|');grouped[key]=(grouped[key]||0)+1;});
      Object.entries(grouped).forEach(([key,count])=>{const [name,sweet,ice]=key.split('|');const mods=[sweet,ice].filter(Boolean).join(' · ');parts.push(name+(mods?' · '+mods:'')+(count>1?' ×'+count:''));});
      if(line.linkedComboId)parts.push('已組合套餐'+(line.linkedQty>1?' ×'+line.linkedQty:''));
      const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
      if(missing&&line.required.includes('drink'))parts.push('尚欠飲品 '+missing+' 份');
      return parts.join(' · ')||'標準';
    }
    function missingGroups(line){
      const groups=[];
      (line.required||[]).forEach(group=>{
        if(group==='drink'){
          const count=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
          if(count)groups.push({group,label:'飲品',count});
        }else if(!line.options?.[group]) groups.push({group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':'小食',count:line.qty||1});
      });
      return groups;
    }
    function pendingSummary(cart){
      const out={rice:0,sauce:0,snack:0,drink:0,total:0};
      cart.forEach(line=>missingGroups(line).forEach(item=>{out[item.group]+=item.count;out.total+=item.count;}));
      return out;
    }
    function cartTotal(cart){return cart.reduce((sum,line)=>sum+Number(line.total||0),0);}
    function linkUpSummary(cart){
      const available=cart.filter(line=>line.lineType!=='combo'&&!line.linkedComboId);
      const riceballs=available.filter(line=>line.combinable).reduce((n,line)=>n+line.qty,0);
      const snacks=available.filter(line=>line.linkRole==='snack').reduce((n,line)=>n+line.qty,0);
      const standaloneDrinks=available.filter(line=>line.linkRole==='drink').reduce((n,line)=>n+line.qty,0);
      return {riceballs,snacks,drinks:standaloneDrinks,count:Math.min(riceballs,snacks)};
    }
    function applyLinkUp(count){
      if(!count)return;
      store.set(state=>{
        let next=state.cart;
        for(let index=0;index<count;index++){
          const main=next.find(line=>line.lineType!=='combo'&&line.combinable),snack=next.find(line=>line.lineType!=='combo'&&line.linkRole==='snack'),drink=next.find(line=>line.lineType!=='combo'&&line.linkRole==='drink');
          if(!main||!snack)break;
          next=combineRiceballSet(next,{mainLineId:main.lineId,snackLineId:snack.lineId,drinkLineId:drink?.lineId},{comboId:stableId('combo'),lineId:stableId('line'),comboPrice:59,source:'automatic'});
        }
        state.cart=normalizeCart(next,state.orderServiceMode);
        state.lastAffectedLineId=state.cart.at(-1)?.lineId||'';
        state.lastMutationKind='changed';
        return state;
      });
      queue.afterRender(()=>showToast('已組合 '+count+' 份飯團套餐'));
    }
    
    let initialCart=saved&&Array.isArray(saved.cart)?saved.cart:[];
    let initialDineContext=saved?.dineContext||null;
    if(initialDineContext){
      const dine=cleanupEmptyDineSessions(readJSON(DINE_STORAGE_KEY,null)||createInitialDineState());
      writeJSON(DINE_STORAGE_KEY,dine);
      const table=dine.tables.find(entry=>entry.id===String(initialDineContext.tableId));
      const stale=!table||(initialDineContext.sessionId&&table.session?.id!==initialDineContext.sessionId)||(!initialDineContext.sessionId&&!initialDineContext.startedFromFree&&table.status==='free');
      if(stale){initialDineContext=null;initialCart=[];}
    }
    const initialOrderServiceMode=resolveInitialOrderServiceMode(initialDineContext,initialCart.length?saved?.orderServiceMode:SERVICE_TAKEAWAY);
    initialCart=normalizeCart(initialCart,initialOrderServiceMode);
    const defaultHealth={catalog:{ok:false,label:'餐牌',detail:'正在連接'},api:{ok:false,label:'訂單 API',detail:'未連接'},printer:{ok:false,label:'打印機',detail:'未連接'},sync:{ok:false,label:'同步',detail:'等待 API'},backup:{ok:true,label:'備份',detail:'本機資料正常'}};
    const store=createStore({category:'全部',searchQuery:'',cart:initialCart,dineContext:initialDineContext,orderServiceMode:initialOrderServiceMode,cartViewMode:savedSettings.cartViewMode||settings.cart.viewMode||CART_VIEW_INPUT,lastAffectedLineId:'',lastMutationKind:'',collapsedCartCategories:[],settings,quickMode:saved?.quickMode??savedSettings.morePage?.quickMode??false,quickDrawerOpen:false,pendingOrders:safeClone(demoPendingOrders),runningOrders:[],completedOrders:[],operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false},health:defaultHealth},{storageKey:ORDER_STORAGE_KEY,persistState:state=>({cart:state.cart,dineContext:state.dineContext,orderServiceMode:state.orderServiceMode,cartViewMode:state.cartViewMode,quickMode:state.quickMode,draftSession:state.draftSession,pendingOrders:state.pendingOrders,runningOrders:state.runningOrders,completedOrders:state.completedOrders,operations:state.operations,settings:state.settings}),normalize:state=>({...state,searchQuery:String(state.searchQuery||''),dineContext:state.dineContext||null,orderServiceMode:normalizeServiceMode(state.dineContext?SERVICE_DINE_IN:state.orderServiceMode,SERVICE_TAKEAWAY),cartViewMode:normalizeCartViewMode(state.cartViewMode||settings.cart.viewMode),lastAffectedLineId:String(state.lastAffectedLineId||''),lastMutationKind:String(state.lastMutationKind||''),collapsedCartCategories:Array.isArray(state.collapsedCartCategories)?state.collapsedCartCategories:[],quickMode:Boolean(state.quickMode),quickDrawerOpen:Boolean(state.quickDrawerOpen),cart:normalizeCart(state.cart||[],state.dineContext?SERVICE_DINE_IN:state.orderServiceMode),pendingOrders:state.pendingOrders||safeClone(demoPendingOrders),runningOrders:Array.isArray(state.runningOrders)?state.runningOrders:[],completedOrders:Array.isArray(state.completedOrders)?state.completedOrders:[],settings:{...settings,...(state.settings||{}),categoryLayout:normalizeCategoryLayout(state.settings?.categoryLayout||settings.categoryLayout),catalog:{...settings.catalog,...(state.settings?.catalog||{})},cart:{...settings.cart,...(state.settings?.cart||{})},quickDrinks:{...settings.quickDrinks,...(state.settings?.quickDrinks||{})}},operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false,...(state.operations||{})},health:{...defaultHealth,...(state.health||{})}})});
    const QUICK_DRAWER_IDLE_MS=8000;
    let quickDrawerTimer=null;
    let recentTimer=null;
    let drinkFeedbackTimer=null;
    let pendingDrinkAssignment=null;
    let lastDrinkAssignment=null;
    let cartScrollTop=0;
    function scheduleQuickDrawerClose(){
      clearTimeout(quickDrawerTimer);
      if(!store.get().quickDrawerOpen)return;
      quickDrawerTimer=setTimeout(()=>store.setTransient(state=>({...state,quickDrawerOpen:false})),QUICK_DRAWER_IDLE_MS);
    }
    const queue=createRenderQueue(render);store.subscribe(state=>{queue.schedule();if(state.quickDrawerOpen)scheduleQuickDrawerClose();else clearTimeout(quickDrawerTimer);});
    installErrorBoundary({toast:showToast,report:error=>window.parent?.postMessage?.({type:'morefun:page-runtime-error',page:'order',message:String(error?.message||error)},'*')});
    
    function updateSettings(mutator){
      store.set(state=>{mutator(state.settings);writeJSON(SETTINGS_STORAGE_KEY,{...savedSettings,...state.settings,cartViewMode:state.cartViewMode});return state;});
    }
    function saveCartViewMode(mode){
      const cartViewMode=normalizeCartViewMode(mode);
      store.set(state=>({...state,cartViewMode,settings:{...state.settings,cart:{...state.settings.cart,viewMode:cartViewMode}}}));
      const persisted=readJSON(SETTINGS_STORAGE_KEY,{})||{};
      writeJSON(SETTINGS_STORAGE_KEY,{...persisted,cartViewMode,cart:{...(persisted.cart||{}),viewMode:cartViewMode}});
    }
    function orderedDrinks(){
      const configured=store.get().settings.quickDrinks.order||[];
      return [...configured,...drinks.map(item=>item.id).filter(id=>!configured.includes(id))].map(id=>drinkMap.get(id)).filter(Boolean);
    }
    function productTemplate(){return store.get().settings.catalog.defaultTemplate;}
    function drinkChoiceCard(d,action='select-drink',selected=false,context='default'){
      const imageMode=store.get().settings.quickDrinks.showImages!==false;
      return '<button class="drink-choice-card drink-card--'+context+' '+(imageMode?'is-image':'is-text')+' '+(selected?'selected':'')+'" data-action="'+action+'" data-id="'+d.id+'"><span>'+escapeHtml(d.name)+'</span>'+(imageMode?imageBlock(d.image,d.name,'drink-choice-img'):'')+'</button>';
    }
    function productCard(p){
      const template=productTemplate();const showCode=store.get().settings.catalog.showCode;const showDescription=store.get().settings.catalog.showDescription;
      const showProductImages=store.get().settings.catalog.showImages!==false;
      const action=store.get().quickMode?'quick-add-product':'open-product';
      const status=supplyStatus(p),unavailable=status!=='available',statusClass=status==='soldout'?'sold-out':status==='paused'?'paused':'';
      const code=showCode?'<small class="product-code">'+p.code+'</small>':'';
      const state=unavailable?'<em class="product-supply-state">'+supplyLabel(status)+'</em>':'';
      if(template==='text')return '<button class="product-card text '+statusClass+'" data-action="'+action+'" data-id="'+p.id+'" '+(unavailable?'disabled':'')+'><span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+state+'</span><b class="product-price">'+money(p.price)+'</b></button>';
      if(template==='small')return '<button class="product-card small '+statusClass+' '+(showProductImages?'':'no-product-image')+'" data-action="'+action+'" data-id="'+p.id+'" '+(unavailable?'disabled':'')+'>'+(showProductImages?imageBlock(p.image,p.name,'product-thumb'):'')+'<span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+state+'</span><b class="product-price">'+money(p.price)+'</b></button>';
      const description=showDescription&&p.description?'<p class="product-description">'+p.description+'</p>':'';
      return '<button class="product-card large '+statusClass+' '+(showProductImages?'':'no-product-image')+'" data-action="'+action+'" data-id="'+p.id+'" '+(unavailable?'disabled':'')+'>'+(showProductImages?imageBlock(p.image,p.name,'product-hero'):'')+'<div class="product-info"><span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+description+state+'</span><b class="product-price">'+money(p.price)+'</b></div></button>';
    }
    function cartLineRow(line,index,state){
      const showImages=state.settings.cart.showImages!==false;
      const recent=line.lineId===state.lastAffectedLineId;
      const override=Boolean(line.serviceModeOverride);
      const modeLabel=line.serviceMode===SERVICE_DINE_IN?'堂':'外';
      return '<article class="cart-row '+(showImages?'':'no-image')+' '+(recent?'is-recent':'')+'" data-line-id="'+escapeHtml(line.lineId)+'"><span class="seq-service"><span class="seq">'+(index+1)+'</span><button class="line-service-toggle '+(override?'is-override':'')+'" data-action="toggle-line-service" data-id="'+escapeHtml(line.lineId)+'" aria-label="切換'+escapeHtml(line.name)+'堂食外賣">'+modeLabel+'</button></span>'+(showImages?imageBlock(line.image,line.name,'cart-img'):'')+'<span class="cart-copy"><strong>'+escapeHtml(line.name)+'</strong><small>'+escapeHtml(describe(line))+'</small>'+(recent?'<em class="recent-badge">剛加入</em>':'')+'</span><b class="cart-price">'+money(line.total)+'</b><span class="cart-actions"><button data-action="cart-qty" data-id="'+line.lineId+'" data-delta="-1">−</button><strong>'+line.qty+'</strong><button data-action="cart-qty" data-id="'+line.lineId+'" data-delta="1">＋</button><button class="edit-button" data-action="edit-line" data-id="'+line.lineId+'">修改</button></span></article>';
    }
    function cartRows(){
      const state=store.get(),cart=cartForView(state.cart,state.cartViewMode);if(!cart.length)return '<div class="empty">購物車未有餐點</div>';
      if(state.cartViewMode===CART_VIEW_INPUT)return cart.map((line,index)=>cartLineRow(line,index,state)).join('');
      const grouped=new Map();cart.forEach(line=>{const category=line.category||productMap.get(line.productId)?.category||'其他';if(!grouped.has(category))grouped.set(category,[]);grouped.get(category).push(line);});
      let viewIndex=0;
      return [...grouped].map(([category,rows])=>{
        const collapsed=state.collapsedCartCategories.includes(category);
        const body=collapsed?'':rows.map(line=>cartLineRow(line,viewIndex++,state)).join('');
        if(collapsed)viewIndex+=rows.length;
        return '<section class="cart-category" data-category="'+escapeHtml(category)+'"><header><button class="cart-category-toggle" data-action="toggle-cart-category" data-value="'+escapeHtml(category)+'"><span>'+(collapsed?'▸':'▾')+'</span><strong>'+escapeHtml(category)+'</strong></button><span>'+rows.reduce((n,line)=>n+line.qty,0)+' 件</span></header>'+body+'</section>';
      }).join('');
    }
    function cartSummary(state){
      if(state.cartViewMode!==CART_VIEW_ORGANIZED||!state.cart.length)return '';
      const counts=new Map();cartForView(state.cart,CART_VIEW_ORGANIZED).forEach(line=>{const category=line.category||'其他';counts.set(category,(counts.get(category)||0)+Number(line.qty||0));});
      return '<div class="cart-summary-strip">'+[...counts].map(([category,count])=>'<span>'+escapeHtml(category)+' <b>'+count+'</b></span>').join('<span>｜</span>')+'</div>';
    }
    function findDrinkTarget(cart){return (cart||[]).find(line=>Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length)>0)||null;}
    function pendingArea(){
      const state=store.get();const required=pendingSummary(state.cart);const link=linkUpSummary(state.cart);
      return '<section class="pending-area '+(!required.total?'complete':'')+'"><button class="pending-receipt" data-action="open-completion"><strong>必選補齊</strong><span>'+(required.total?'尚欠 '+required.total+' 項':'全部完成')+'</span><b>整理</b></button><button data-action="linkup-all" data-count="'+link.count+'" '+(link.count?'':'disabled')+'>一鍵自動組合 '+link.count+'</button><button data-action="open-specified-link">指定配對</button></section>';
    }
    function quickDrinks(){
      const state=store.get();if(state.settings.quickDrinks.visible===false)return '';
      const order=orderedDrinks(),missing=pendingSummary(state.cart).drink,target=findDrinkTarget(state.cart);
      const context=(target||lastDrinkAssignment)?'<div class="quick-drink-context">'+(target?'<strong>正在補：'+escapeHtml(target.name)+'</strong>':'')+(lastDrinkAssignment?'<em>已配對：'+escapeHtml(lastDrinkAssignment.drink)+' → '+escapeHtml(lastDrinkAssignment.target)+'</em>':'')+'</div>':'';
      return '<section class="quick-drawer '+(state.quickDrawerOpen?'open':'')+'"><button class="quick-drawer-handle" data-action="toggle-quick-drawer"><span>快捷飲品</span><em>待補 '+missing+'</em><b>'+(state.quickDrawerOpen?'⌄':'⌃')+'</b></button>'+(state.quickDrawerOpen?'<div class="quick-drawer-panel"><header><strong>快捷飲品｜待補 '+missing+'</strong><button data-action="toggle-quick-drawer">×</button></header>'+context+'<div>'+order.filter(d=>d.available!==false).map(d=>drinkChoiceCard(d,'quick-drink',modal?.type==='drink'&&modal.drinkId===d.id,'drawer')).join('')+'</div></div>':'')+'</section>';
    }
    function operationLabel(state){if(state.operations.immediateStopped||!state.operations.acceptingOrders)return '已停止接單';if(state.operations.scheduledClose)return '接單至 '+state.operations.scheduledClose;return '接單中';}
    function healthIssueCount(state){return Object.values(state.health).filter(item=>!item.ok).length;}
    function pendingOrderCount(state){return Object.values(state.pendingOrders||{}).flat().length;}
    function topbar(){
      const state=store.get();const issues=healthIssueCount(state),pendingCount=pendingOrderCount(state),soldout=products.filter(item=>supplyStatus(item)!=='available').length;
      return renderGlobalStatusBar({terminalId,operationLabel:operationLabel(state),operationTone:state.operations.acceptingOrders&&!state.operations.immediateStopped?'online':'offline',lastOrder:latestOrderDisplayNumber([...readJSON(ORDER_HISTORY_STORAGE_KEY,[]),...activeDineOrderIdentities(readJSON(DINE_STORAGE_KEY,null))]),context:state.dineContext?'堂食｜'+state.dineContext.tableId+' 號枱':'',rightActions:'<button class="top-btn" data-action="toggle-pending-panel">待處理 <span class="badge">'+pendingCount+'</span></button><button class="top-btn" data-action="open-soldout">售罄 '+soldout+'</button><button class="top-btn quick-state '+(state.quickMode?'is-on':'is-off')+'" data-action="open-quick-settings">快捷 '+(state.quickMode?'ON':'OFF')+'</button><button class="top-btn health-button '+(issues?'has-error':'is-ok')+'" data-action="open-health"><span>'+(issues?'!':'✓')+'</span>'+(issues?'設備 '+issues:'設備正常')+'</button><button class="top-btn" data-action="open-settings">顯示設定</button>'});
    }
    function draftRows(selectedId=''){
      return drafts.map(d=>'<button class="draft-pick '+(selectedId===d.id?'selected':'')+'" data-action="select-draft" data-id="'+escapeHtml(d.id)+'"><strong>'+escapeHtml(d.draftNumber)+'</strong><small>'+new Date(d.createdAt).toLocaleTimeString('zh-HK',{hour:'2-digit',minute:'2-digit'})+'｜'+d.cart.reduce((n,l)=>n+Number(l.qty||0),0)+' 件｜'+money(cartTotal(d.cart))+'</small></button>').join('')||'<p class="receipt-empty">目前沒有暫存單</p>';
    }
    function tableGrid(){
      const dine=readJSON(DINE_STORAGE_KEY,null)||createInitialDineState(),tables=dine.tables;
      return tables.map(table=>{const minutes=table.status==='occupied'&&table.openedAt?Math.floor((Date.now()-table.openedAt)/60000):0;return '<button class="table-pick '+(table.status==='occupied'?'occupied':'free')+'" data-action="assign-table" data-id="'+escapeHtml(table.id)+'"><strong>'+(table.id==='戶外'?'戶外枱':table.id+' 號枱')+'</strong><small>'+(table.status==='occupied'?'使用中 '+minutes+' 分鐘':'未使用｜自動開枱')+'</small></button>';}).join('')||'<p class="receipt-empty">堂食枱資料未建立</p>';
    }
    function hangModal(){return '<aside class="modal-card order-transfer-card"><header><div><small>目前購物車 '+store.get().cart.reduce((n,l)=>n+l.qty,0)+' 件</small><strong>掛單／加入堂食</strong></div><button data-action="dismiss-modal">×</button></header><div class="transfer-grid"><section><h3>一般掛單</h3><div class="transfer-scroll">'+draftRows()+'</div><button class="save-draft-entry" data-action="add-draft">＋ 加入掛單</button></section><section><h3>堂食枱位｜九宮格</h3><p>撳枱號會立即正式落單、出製作單及所需標籤。</p><div class="table-pick-grid">'+tableGrid()+'</div></section></div><footer><button data-action="dismiss-modal">返回</button></footer></aside>';}
    function takeModal(){
      const selectedDraftId=modal.selectedDraftId||'';
      const selected=drafts.find(d=>d.id===selectedDraftId);
      const detail=selected?'<div class="draft-detail-head"><span><small>暫存編號</small><strong>'+escapeHtml(selected.draftNumber)+'</strong></span><span><small>建立時間</small><strong>'+new Date(selected.createdAt).toLocaleTimeString('zh-HK',{hour:'2-digit',minute:'2-digit'})+'</strong></span><span><small>合計</small><strong>'+money(cartTotal(selected.cart))+'</strong></span></div><div class="draft-detail-lines">'+selected.cart.map((line,index)=>'<article><b>'+(index+1)+'</b><span><strong>'+escapeHtml(line.name)+' ×'+line.qty+'</strong><small>'+escapeHtml(describe(line))+'</small></span><em>'+money(line.total)+'</em></article>').join('')+'</div>':'<div class="draft-empty-detail"><b>請選擇左邊暫存單</b><p>右邊會顯示完整餐點內容，確認後先取回。</p></div>';
      return '<aside class="modal-card order-transfer-card take-card"><header><div><small>目前終端 '+terminalId+'</small><strong>取單</strong></div><button data-action="dismiss-modal">×</button></header><div class="transfer-grid"><section><h3>暫存單列表</h3><div class="transfer-scroll">'+draftRows(selectedDraftId)+'</div></section><section><h3>暫存單內容</h3>'+detail+'</section></div><footer><button data-action="dismiss-modal">返回</button><span></span><button class="danger" data-action="void-draft" '+(selected?'':'disabled')+'>作廢</button><button class="primary" data-action="restore-draft" data-id="'+escapeHtml(selected?.id||'')+'" '+(selected?'':'disabled')+'>取單</button></footer></aside>';
    }
    function pendingPanel(){
      const pendingOrders=store.get().pendingOrders;
      const rows=list=>list.map(x=>'<button data-action="process-pending-order" data-id="'+x.id+'"><span><strong>'+x.id+' · '+x.source+'</strong><small>'+x.contact+'</small></span><b>'+x.items+' 件 · '+money(x.amount)+'</b><small>等待 '+x.wait+' · 按下處理</small></button>').join('');
      return '<aside class="pending-panel modal-card"><header><strong>待處理</strong><button data-action="dismiss-modal">×</button></header><div class="pending-split"><section><h3>磨飯 App／網頁訂單</h3><div class="pending-scroll">'+rows(pendingOrders.online)+'</div></section><section><h3>電話／WhatsApp 排隊單</h3><div class="pending-scroll">'+rows(pendingOrders.queue)+'</div></section></div><footer class="single-action"><button data-action="dismiss-modal">返回</button></footer></aside>';
    }
    function pendingDetailModal(){
      const x=modal.order;
      return '<aside class="pending-panel modal-card"><header><div><small>'+x.source+'</small><strong>'+x.id+' · '+x.contact+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="pending-order-detail"><span>產品數量 <b>'+x.items+' 件</b></span><span>訂單金額 <b>'+money(x.amount)+'</b></span><span>等候時間 <b>'+x.wait+'</b></span><span>付款狀態 <b>'+x.paymentStatus+'</b></span><p>開始核對後會顯示完整產品、金額及付款證明；此時仍未正式接單。</p></div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="start-pending-review">開始核對</button></footer></aside>';
    }
    function pendingReviewModal(){
      const x=modal.order;const whatsapp=createWhatsAppLink(x.phone,(x.contact||'客人')+'，你好。磨飯訂單 '+x.id+' 正在核對中，請回覆或補充付款證明，謝謝。');
      const lines=(x.lines||[]).map(line=>'<div><span>'+escapeHtml(line[0])+' ×'+line[1]+'</span><b>'+money(line[2])+'</b></div>').join('');
      const proof=x.proof?'<button class="payment-proof" data-action="enlarge-proof">'+imageBlock(x.proof,'付款證明','payment-proof-image')+'<span>按下放大付款證明</span></button>':'<div class="payment-proof empty"><strong>尚未收到付款證明</strong><span>請用右方 WhatsApp QR Code 聯絡客人</span></div>';
      return '<aside class="pending-review-card modal-card"><header><div><small>'+x.source+' · 訂單核對</small><strong>'+x.id+' · '+x.contact+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="pending-review-body"><section class="review-order"><div class="review-summary"><span>產品 <b>'+x.items+' 件</b></span><span>總額 <b>'+money(x.amount)+'</b></span><span>付款 <b>'+x.paymentMethod+'</b></span></div><div class="review-lines">'+lines+'</div><div class="payment-status"><span>付款狀態</span><strong>'+x.paymentStatus+'</strong></div>'+proof+'</section><aside class="whatsapp-qr"><strong>WhatsApp QR Code</strong><p>公司電話掃描後，直接開啟客人對話及預設訊息。</p><div class="qr-code" data-qr="'+escapeHtml(whatsapp)+'"></div><a href="'+escapeHtml(whatsapp)+'" target="_blank" rel="noopener">在此裝置開啟 WhatsApp</a></aside></div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button data-action="report-payment-issue">資料有問題</button><button class="primary" data-action="accept-pending-order" '+(x.proof?'':'disabled')+'>確認接單</button></footer></aside>';
    }
    function enlargedProofModal(){const x=modal.order;return '<aside class="proof-lightbox modal-card"><header><strong>'+x.id+' · 付款證明</strong><button data-action="back-to-pending-review">×</button></header>'+imageBlock(x.proof,'付款證明放大圖','proof-full')+'<footer class="right-action"><button data-action="back-to-pending-review">返回核對</button></footer></aside>';}
    function modalScrim(){return modal?'<div class="modal-scrim" aria-hidden="true"></div>':'';}
    function quickSettingsModal(){
      const state=store.get();const q=state.settings.quickDrinks;
      const order=orderedDrinks();
      return '<aside class="side-card modal-card quick-mode-card"><header><strong>快捷模式</strong><button data-action="dismiss-modal">×</button></header><div class="card-scroll"><div class="setting-block"><strong>點單模式</strong><div class="segmented"><button class="'+(!state.quickMode?'active':'')+'" data-action="set-order-mode" data-value="normal">普通模式</button><button class="'+(state.quickMode?'active':'')+'" data-action="set-order-mode" data-value="quick">快捷模式</button></div><small>快捷模式：點產品直接加入購物籃</small></div><div class="setting-row"><div><strong>快捷飲品抽屜</strong><small>平時收起，按下向上展開</small></div><button class="switch '+(q.visible!==false?'on':'')+'" data-action="toggle-quick-drink-strip"><i></i></button></div><div class="setting-block"><strong>飲品卡顯示</strong><div class="segmented"><button class="'+(q.showImages!==false?'active':'')+'" data-action="quick-display" data-value="image">圖片</button><button class="'+(q.showImages===false?'active':'')+'" data-action="quick-display" data-value="text">純文字</button></div></div><div class="setting-block"><strong>飲品排列</strong><div class="quick-order-list">'+order.map((d,index)=>'<div><span><b>'+(index+1)+'</b>'+escapeHtml(d.name)+'</span><span><button data-action="move-quick-drink" data-id="'+d.id+'" data-delta="-1" '+(!index?'disabled':'')+'>↑</button><button data-action="move-quick-drink" data-id="'+d.id+'" data-delta="1" '+(index===order.length-1?'disabled':'')+'>↓</button></span></div>').join('')+'</div></div><div class="setting-row"><div><strong>快捷補選</strong><small>只控制待補飲品快捷套用</small></div><button class="switch '+(q.quickAssist!==false?'on':'')+'" data-action="toggle-quick-assist"><i></i></button></div></div></aside>';
    }
    function settingsModal(){
      const state=store.get();const c=state.settings.catalog,w=Number(state.settings.cart.widthPercent||32);
      return '<aside class="side-card modal-card"><header><strong>顯示設定</strong><button data-action="dismiss-modal">×</button></header><div class="setting-block"><strong>購物籃比例</strong><div class="segmented three">'+[25,30,32].map(x=>'<button data-action="cart-width" data-value="'+x+'" class="'+(w===x?'active':'')+'">'+x+' / '+(100-x)+'</button>').join('')+'</div></div><div class="setting-row"><div><strong>顯示購物車產品圖片</strong><small>關閉後保留名稱、描述、價格與操作</small></div><button class="switch '+(state.settings.cart.showImages!==false?'on':'')+'" data-action="toggle-cart-images"><i></i></button></div><div class="setting-block"><strong>產品卡</strong><div class="segmented three"><button data-action="setting-card" data-value="large" class="'+(c.defaultTemplate==='large'?'active':'')+'">大圖</button><button data-action="setting-card" data-value="small" class="'+(c.defaultTemplate==='small'?'active':'')+'">小圖</button><button data-action="setting-card" data-value="text" class="'+(c.defaultTemplate==='text'?'active':'')+'">純文字</button></div></div><div class="setting-row"><div><strong>顯示產品 Code</strong><small>例如 F4、B1、S1</small></div><button class="switch '+(c.showCode?'on':'')+'" data-action="toggle-code"><i></i></button></div></aside>';
    }
    function healthModal(){const state=store.get();return '<aside class="side-card modal-card"><header><strong>系統狀態</strong><button data-action="dismiss-modal">×</button></header><div class="health-list">'+Object.values(state.health).map(item=>'<div class="health-row '+(item.ok?'ok':'bad')+'"><span>'+(item.ok?'✓':'!')+'</span><div><strong>'+item.label+'</strong><small>'+item.detail+'</small></div><b>'+(item.ok?'正常':'異常')+'</b></div>').join('')+'</div></aside>';}
    function statusModal(){
      const state=store.get(),ops=state.operations;
      return '<aside class="side-card modal-card"><header><strong>今日接單狀態</strong><button data-action="dismiss-modal">×</button></header><div class="setting-row"><div><strong>接受網絡／預約訂單</strong><small>'+operationLabel(state)+'</small></div><button class="switch '+(ops.acceptingOrders&&!ops.immediateStopped?'on':'')+'" data-action="toggle-accepting"><i></i></button></div><div class="setting-block"><label>今日停止接單時間</label><div class="time-row"><input id="scheduled-close" type="time" value="'+(ops.scheduledClose||'')+'"><button data-action="save-close-time">儲存</button></div></div><div class="setting-block"><button class="danger wide" data-action="immediate-stop">即時停止接單</button><button class="wide" data-action="resume-orders">恢復接單</button></div></aside>';
    }
    function soldoutModal(){
      const items=products.filter(item=>supplyStatus(item)!=='available');
      return '<aside class="side-card modal-card soldout-preview"><header><strong>售罄列表</strong><button data-action="dismiss-modal">×</button></header><div class="status-list">'+(items.length?items.map(item=>{const status=supplyStatus(item);return '<div class="'+status+'"><span><b>'+escapeHtml([item.code,item.name].filter(Boolean).join(' '))+'</b><small>'+escapeHtml(item.category||'未分類')+'</small></span><em>'+supplyLabel(supplyStatus(item))+'</em></div>';}).join(''):'<div><span><b>目前全部供應中</b><small>售罄管理頁更新後會即時顯示</small></span></div>')+'</div><footer class="right-action"><button data-action="dismiss-modal">返回</button></footer></aside>';
    }
    function pairingGroupCount(cart){
      const available=cart.filter(line=>line.lineType!=='combo'&&!line.linkedComboId),mains=available.filter(line=>line.combinable).reduce((n,line)=>n+line.qty,0),snacks=available.filter(line=>line.linkRole==='snack').reduce((n,line)=>n+line.qty,0);
      return Math.min(26,mains,snacks);
    }
    function specifiedLinkModal(){
      const available=store.get().cart.filter(line=>line.lineType!=='combo'&&!line.linkedComboId),groups=modal.draft.groups,active=Math.min(modal.draft.active,groups.length-1),current=groups[active]||{main:'',snack:'',drink:''};
      const roles=[['main','飯團／主餐',line=>line.combinable],['snack','小食',line=>line.linkRole==='snack']];
      const selectedCount=(lineId,role)=>groups.reduce((n,group)=>n+(group[role]===lineId?1:0),0),ready=groups.filter(group=>group.main&&group.snack).length;
      const cartDrinks=available.filter(line=>line.linkRole==='drink');
      const drinkCards='<section><strong>3. 飲品 <small>可稍後補選</small></strong><div class="link-candidates drink-link-candidates">'+drinks.map(d=>'<button data-action="select-link-drink" data-source="quick" data-id="quick:'+d.id+'" class="'+(current.drink==='quick:'+d.id?'selected':'')+'"><span>'+escapeHtml(d.name)+'</span><small>快捷飲品</small></button>').join('')+cartDrinks.map(line=>{const used=selectedCount(line.lineId,'drink'),selected=current.drink===line.lineId,full=used>=line.qty&&!selected;return '<button data-action="select-link-drink" data-source="cart" data-id="'+line.lineId+'" class="'+(selected?'selected':'')+'" '+(full?'disabled':'')+'><span>'+escapeHtml(line.name)+'</span><small>購物車 '+Math.max(0,line.qty-used+(selected?1:0))+'／'+line.qty+'</small></button>';}).join('')+'</div></section>';
      return '<aside class="side-card modal-card specified-link-card"><header><div><small>動態指定配對</small><strong>建立 '+groups.length+' 組套餐</strong></div><button data-action="dismiss-modal">×</button></header><div class="pairing-group-tabs">'+groups.map((group,index)=>{const ok=group.main&&group.snack;return '<button data-action="select-pairing-group" data-index="'+index+'" class="'+(index===active?'active ':'')+(ok?'complete':'')+'"><b>'+String.fromCharCode(65+index)+'</b><small>'+(ok?(group.drink?'完成':'欠飲品'):'待選')+'</small></button>';}).join('')+'</div><div class="card-scroll pairing-body"><p>選擇 '+String.fromCharCode(65+active)+' 組主餐及小食即可建立套餐；飲品可直接用快捷飲品或稍後補選。</p>'+roles.map(([role,label,filter],index)=>'<section><strong>'+(index+1)+'. '+label+'</strong><div class="link-candidates">'+available.filter(filter).map(line=>{const used=selectedCount(line.lineId,role),selected=current[role]===line.lineId,full=used>=line.qty&&!selected;return '<button data-action="select-link-item" data-role="'+role+'" data-id="'+line.lineId+'" class="'+(selected?'selected':'')+'" '+(full?'disabled':'')+'><span>'+escapeHtml(line.name)+'</span><small>可用 '+Math.max(0,line.qty-used+(selected?1:0))+'／'+line.qty+'</small></button>';}).join('')+'</div></section>').join('')+drinkCards+'</div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-specified-link" '+(ready?'':'disabled')+'>確認組合 '+ready+' 組</button></footer></aside>';
    }
    function comboEditorModal(){
      const line=store.get().cart.find(item=>item.lineId===modal.lineId),draft=modal.draft;
      if(!line)return '';
      const components=draft.components||[],selected=role=>components.find(item=>item.role===role);
      const withCurrent=(items,role)=>{const current=selected(role);return current&&!items.some(item=>item.id===current.productId)?[{id:current.productId,name:current.name,image:current.image,price:current.unitPrice},...items]:items;};
      const candidates={main:withCurrent(products.filter(item=>item.combinable),'main'),snack:withCurrent(snackProducts,'snack'),drink:withCurrent(drinks,'drink')};
      const roleCard=(role,label,index)=>'<section class="combo-role"><header><strong>'+index+'. '+label+'</strong>'+(role==='drink'?'<button data-action="clear-combo-component">稍後補選</button>':'')+'</header><div class="combo-candidates">'+candidates[role].map(item=>{const id=item.id,active=selected(role)?.productId===id;return '<button data-action="select-combo-component" data-role="'+role+'" data-id="'+id+'" class="'+(active?'selected':'')+'"><span>'+escapeHtml(item.name)+'</span><small>'+money(item.price||0)+'</small></button>';}).join('')+'</div></section>';
      const missing=!selected('drink');
      return '<aside class="product-settings-card modal-card combo-editor-card"><header class="settings-product-head"><div><small>修改套餐</small><h2>'+escapeHtml(line.name)+'</h2><strong>'+money(line.total)+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="product-settings-body card-scroll"><p class="combo-help">飯團、小食及飲品會以一張套餐顯示；飲品可以稍後由快捷飲品補選。</p>'+roleCard('main','飯團／主餐',1)+roleCard('snack','小食',2)+roleCard('drink','飲品',3)+'</div><footer class="product-settings-actions combo-actions"><button class="danger" data-action="request-dissolve-combo">拆開套餐</button><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-combo-edit">確認修改</button></footer>'+(missing?'<p class="missing-hint">尚欠：飲品 1 份</p>':'')+'</aside>';
    }
    function requiredGroupLabel(group){return {rice:'飯底',sauce:'醬汁',snack:'小食',drink:'飲品'}[group]||'必選';}
    function requiredTargets(cart,group){
      const targets=[];
      (cart||[]).forEach((line,lineIndex)=>{
        if(!(line.required||[]).includes(group))return;
        if(group==='drink'){
          const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
          for(let unitIndex=0;unitIndex<missing;unitIndex++)targets.push({id:line.lineId+':drink:'+unitIndex,lineId:line.lineId,lineIndex,unitIndex,name:line.name,qty:line.qty});
          return;
        }
        if(line.options?.[group])return;
        for(let unitIndex=0;unitIndex<Math.max(1,Number(line.qty||1));unitIndex++)targets.push({id:line.lineId+':'+group+':'+unitIndex,lineId:line.lineId,lineIndex,unitIndex,name:line.name,qty:line.qty});
      });
      return targets;
    }
    function completionDraft(group=''){
      const current=modal?.draft||{};
      if(!group)return {...current,activeGroup:'',activeTarget:'',assignments:current.assignments||{}};
      const targets=requiredTargets(store.get().cart,group),assignments=current.activeGroup===group?(current.assignments||{}):{};
      const activeTarget=(current.activeGroup===group&&targets.some(target=>target.id===current.activeTarget))?current.activeTarget:(targets.find(target=>!assignments[target.id])?.id||targets[0]?.id||'');
      return {activeGroup:group,activeTarget,assignments};
    }
    function completionTargetLabel(target){return String(target.lineIndex+1).padStart(2,'0')+'｜'+escapeHtml(target.name)+(target.qty>1?'｜第 '+(target.unitIndex+1)+' 份':'');}
    function requiredSelectionPanel(group){
      const draft=completionDraft(group);modal.draft=draft;
      const targets=requiredTargets(store.get().cart,group),assignments=draft.assignments||{},active=targets.find(target=>target.id===draft.activeTarget)||targets[0];
      const done=targets.filter(target=>assignments[target.id]).length,label=requiredGroupLabel(group);
      const targetHtml=targets.map(target=>'<button class="required-target '+(target.id===active?.id?'active ':'')+(assignments[target.id]?'complete':'')+'" data-action="completion-target" data-id="'+escapeHtml(target.id)+'"><span><b>'+completionTargetLabel(target)+'</b><small>'+(assignments[target.id]?'已選：'+escapeHtml(group==='drink'?(drinkMap.get(assignments[target.id])?.name||assignments[target.id]):assignments[target.id]):'尚未選擇')+'</small></span><em>'+(assignments[target.id]?'✓':'待選')+'</em></button>').join('');
      const drinkAssignmentCounts=new Map();
      if(group==='drink')Object.values(assignments).forEach(id=>{if(id)drinkAssignmentCounts.set(id,(drinkAssignmentCounts.get(id)||0)+1);});
      let choices='';
      if(group==='drink')choices='<div class="required-drink-grid">'+drinks.filter(item=>item.available!==false).map(item=>{const count=drinkAssignmentCounts.get(item.id)||0;return '<button data-action="completion-required-choice" data-value="'+escapeHtml(item.id)+'" class="'+(active&&assignments[active.id]===item.id?'selected ':'')+(count?'has-assignment':'')+'" aria-label="'+escapeHtml(item.name)+(count?'，已選 '+count+' 份':'')+'">'+imageBlock(item.image,item.name,'required-choice-img')+'<span>'+escapeHtml(item.name)+'</span>'+(count?'<em class="drink-choice-count">✓ '+count+'</em>':'')+'</button>';}).join('')+'</div>';
      else choices='<div class="required-option-grid">'+(optionSets[group]||[]).map(value=>'<button data-action="completion-required-choice" data-value="'+escapeHtml(value)+'" class="'+(active&&assignments[active.id]===value?'selected':'')+'">'+escapeHtml(value)+'</button>').join('')+'</div>';
      const selected=active?assignments[active.id]:'';
      return '<div class="required-workflow-head"><div><small>必須完成｜'+label+'</small><strong>已分配 '+done+' / '+targets.length+'</strong><span>每一份都會顯示指定結果，避免配錯餐點。</span></div><button data-action="completion-back">返回必選總覽</button></div><div class="required-workflow-grid"><section class="required-target-pane"><h3>要補選嘅餐點</h3><div class="required-target-list">'+targetHtml+'</div></section><section class="required-choice-pane"><div class="required-active-target"><small>目前指定</small><strong>'+(active?completionTargetLabel(active):'已完成')+'</strong><span>'+(selected?'目前：'+escapeHtml(group==='drink'?(drinkMap.get(selected)?.name||selected):selected):'請選擇 '+label)+'</span></div>'+choices+(selected&&done<targets.length?'<button class="required-fill" data-action="completion-fill-remaining" data-value="'+escapeHtml(selected)+'">其餘未選全部用同一選項</button>':'')+'</section></div><footer class="required-workflow-actions"><button data-action="completion-back">返回</button><button class="primary" data-action="apply-required-group" '+(done===targets.length&&targets.length?'':'disabled')+'>確認 '+label+'｜'+done+' 份</button></footer>';
    }
    function splitLineForRequired(line,group,values){
      if(!values.length)return [line];
      if(values.every(value=>value===values[0]))return [{...line,options:{...(line.options||{}),[group]:values[0]}}];
      const qty=Math.max(1,Number(line.qty||1)),slotsPerUnit=qty?Math.max(0,Math.round(Number(line.drinkSlots||0)/qty)):0,drinkAssignments=[...(line.drinkAssignments||[])];
      return values.map((value,index)=>({...line,lineId:index===0?line.lineId:stableId('line'),qty:1,total:Number(line.unitPrice||0),options:{...(line.options||{}),[group]:value},drinkSlots:slotsPerUnit,drinkAssignments:slotsPerUnit?drinkAssignments.slice(index*slotsPerUnit,(index+1)*slotsPerUnit):[],createdOrder:Number(line.createdOrder||0)+(index*0.0001)}));
    }
    function applyRequiredGroup(){
      const group=modal?.draft?.activeGroup;if(!group)return;
      const targets=requiredTargets(store.get().cart,group),assignments=modal.draft.assignments||{};
      if(targets.some(target=>!assignments[target.id])){showToast('仲有必選項未完成');return;}
      store.set(state=>{
        if(group==='drink'){
          const byLine=new Map();targets.forEach(target=>{if(!byLine.has(target.lineId))byLine.set(target.lineId,[]);byLine.get(target.lineId).push(assignments[target.id]);});
          state.cart=state.cart.map(line=>{const ids=byLine.get(line.lineId);if(!ids)return line;return {...line,drinkAssignments:(line.drinkAssignments||[]).concat(ids.map(id=>drinkSelection(id)))};});
        }else{
          const byLine=new Map();targets.forEach(target=>{if(!byLine.has(target.lineId))byLine.set(target.lineId,[]);byLine.get(target.lineId).push(assignments[target.id]);});
          state.cart=state.cart.flatMap(line=>{const values=byLine.get(line.lineId);return values?splitLineForRequired(line,group,values):[line];});
        }
        state.lastAffectedLineId=targets.at(-1)?.lineId||'';state.lastMutationKind='changed';return state;
      });
      modal={type:'completion',dirty:false,draft:{activeGroup:'',activeTarget:'',assignments:{}}};queue.afterRender(()=>showToast(requiredGroupLabel(group)+'已完成'));
    }
    function completionModal(){
      const state=store.get(),required=pendingSummary(state.cart),link=linkUpSummary(state.cart);
      if(modal?.draft?.activeGroup)return '<aside class="completion-card modal-card required-workflow"><header><div><small>結帳前必須完成</small><strong>快速補選</strong></div><button data-action="dismiss-modal">×</button></header>'+requiredSelectionPanel(modal.draft.activeGroup)+'</aside>';
      return '<aside class="completion-card modal-card"><header><div><small>結帳前檢查</small><strong>必選快速補齊</strong></div><button data-action="dismiss-modal">×</button></header><div class="completion-section required"><div><small>必須完成</small><strong>'+(required.total?'共欠 '+required.total+' 項':'全部完成')+'</strong><span>只處理會阻礙結帳嘅必選；普通口味修改仍然喺產品「修改」處理。</span></div>'+['rice','sauce','snack','drink'].filter(k=>required[k]).map(k=>'<button data-action="complete-group" data-group="'+k+'"><span>'+requiredGroupLabel(k)+'</span><b>'+required[k]+' 份</b><em>快速分配</em></button>').join('')+'</div><div class="completion-section optional"><div><small>普通修改</small><strong>唔影響結帳</strong><span>走青瓜、走蔥、少辣等，請由對應產品「修改」卡處理。</span></div></div><div class="completion-section linkup"><div><small>可組合套餐</small><strong>'+link.count+' 份</strong><span>飯團 '+link.riceballs+'｜小食 '+link.snacks+'｜飲品 '+link.drinks+'</span></div>'+(link.count?'<button class="primary" data-action="linkup-all" data-count="'+link.count+'">一鍵組合</button>':'')+'</div></aside>';
    }
    function optionButtons(group,values,selected,multi=false){return '<div class="option-chips">'+values.map(value=>'<button data-action="detail-option" data-group="'+group+'" data-value="'+escapeHtml(value)+'" data-multi="'+multi+'" class="'+((multi?selected.includes(value):selected===value)?'selected':'')+'">'+escapeHtml(value)+'</button>').join('')+'</div>';}
    function detailGroups(product,draft){
      const rows=[];
      if(product.required.includes('rice'))rows.push('<section><header><strong>飯底</strong><span class="required-tag">必選</span></header>'+optionButtons('rice',optionSets.rice,draft.options.rice||'')+'</section>');
      if(product.required.includes('sauce'))rows.push('<section><header><strong>醬汁</strong><span class="required-tag">必選</span></header>'+optionButtons('sauce',optionSets.sauce,draft.options.sauce||'')+'</section>');
      rows.push('<section><header><strong>飯量／份量</strong><span>可選</span></header>'+optionButtons('portion',['少飯','標準','多飯','加飯 +$5'],draft.options.portion||'標準')+'</section>');
      rows.push('<section><header><strong>口味調整</strong><span>可多選</span></header>'+optionButtons('taste',['走蔥','少辣','走蒜','走香菜','不要花生'],draft.options.taste||[],true)+'</section>');
      if(product.required.includes('snack'))rows.push('<section><header><strong>套餐小食</strong><span class="required-tag">必選</span></header>'+optionButtons('snack',optionSets.snack,draft.options.snack||'')+'</section>');
      if(product.combinable)rows.push('<section class="upgrade-section"><header><strong>升級飯團套餐</strong><span>可補選</span></header><p>小食及飲品都選擇後，會直接組合成飯團套餐。</p>'+optionButtons('snack',optionSets.snack,draft.options.snack||'')+'</section>');
      if(product.required.includes('drink')||product.combinable)rows.push('<section><header><strong>'+(product.required.includes('drink')?'套餐飲品':'加配飲品')+'</strong><span class="'+(product.required.includes('drink')?'required-tag':'')+'">'+(product.required.includes('drink')?'必選':'可補選')+'</span></header><div class="detail-drinks">'+drinks.map(d=>drinkChoiceCard(d,'detail-drink',draft.drink?.drinkId===d.id,'detail')).join('')+'</div></section>');
      rows.push('<section><header><strong>備註</strong><span>可選</span></header><textarea data-action="detail-note" maxlength="80" placeholder="例如：醬汁分開、謝謝">'+escapeHtml(draft.note||'')+'</textarea></section>');
      return rows.join('');
    }
    function productDetailModal(){
      const {productId,draft}=modal;const p=productMap.get(productId);const missing=[];
      p.required.forEach(group=>{if(group==='drink'){if(!draft.drink)missing.push('飲品');}else if(!draft.options[group])missing.push(group==='rice'?'飯底':group==='sauce'?'醬汁':'小食');});
      const subtotal=p.price*draft.qty;
      return '<aside class="product-settings-card modal-card" data-editing="'+Boolean(modal.editLineId)+'"><header class="settings-product-head"><div><small>'+(modal.editLineId?'修改產品':'新增產品')+'</small><h2>'+p.name+'</h2><strong>'+money(p.price)+'</strong></div><button data-action="dismiss-modal" aria-label="返回">×</button></header><div class="product-settings-body"><div class="qty-row"><span>數量</span><button data-action="detail-qty" data-delta="-1">−</button><strong>'+draft.qty+'</strong><button data-action="detail-qty" data-delta="1">＋</button></div>'+detailGroups(p,draft)+'</div><footer class="product-settings-actions"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-product" '+(missing.length?'disabled':'')+'>確認 '+money(subtotal)+'</button></footer>'+(missing.length?'<p class="missing-hint">還欠：'+missing.join('、')+'</p>':'')+'</aside>';
    }
    function drinkModifierModal(){
      const d=drinkMap.get(modal.drinkId),draft=modal.draft;
      const groups=draft.groups||[];const total=draft.qty+groups.reduce((n,g)=>n+g.qty,0);
      return '<aside class="modifier-card modal-card"><header><strong>'+d.name+'</strong><button data-action="dismiss-modal">×</button></header><div class="drink-base-qty"><span>正常</span><span><button data-action="modifier-qty" data-delta="-1">−</button><b>'+draft.qty+'</b><button data-action="modifier-qty" data-delta="1">＋</button></span></div><div class="drink-groups">'+groups.map((g,index)=>'<section class="drink-group '+(g.open?'open':'')+'"><header><button class="group-summary" data-action="toggle-drink-adjustment" data-index="'+index+'">'+([g.sweetness,g.ice].filter(Boolean).join('・')||'選擇調整')+' ×'+g.qty+'</button><span><button data-action="group-qty" data-index="'+index+'" data-delta="-1">−</button><b>'+g.qty+'</b><button data-action="group-qty" data-index="'+index+'" data-delta="1">＋</button></span></header>'+(g.open?'<div class="adjustment-options">'+(d.sweet?optionButtons('group-sweetness-'+index,['多甜','少甜','走甜'],g.sweetness||''):'')+(d.ice?optionButtons('group-ice-'+index,['少冰','多冰'],g.ice||''):'')+'</div>':'')+'</section>').join('')+'</div><button data-action="add-drink-group" class="add-group">＋ 新增調整</button><button class="primary wide" data-action="apply-drink" '+(total?'':'disabled')+'>套用 '+total+' 份</button></aside>';
    }
    function searchModal(){const query=store.get().searchQuery;return '<aside class="side-card modal-card search-card"><header><div><small>產品搜尋</small><strong>名稱或編號</strong></div><button data-action="dismiss-modal">×</button></header><div class="search-field"><input autofocus data-action="search-query" value="'+escapeHtml(query)+'" placeholder="例如：F4、雞絲、奶茶"><button data-action="clear-search" '+(query?'':'disabled')+'>清除</button></div><p>搜尋結果會即時顯示；分類排序及供應狀態仍然保留。</p></aside>';}
    function categoryButton(cat,state){return '<button data-action="category" data-value="'+escapeHtml(cat)+'" class="'+(cat===state.category?'active':'')+'">'+escapeHtml(cat)+'</button>';}
    function categoryBar(state){
      const categoryLayout=buildCategoryLayout(categories,state.settings.categoryLayout);
      const pages=categoryLayout.pages.map((items,index)=>'<div class="category-page" aria-label="分類第 '+(index+1)+' 頁">'+items.map(cat=>categoryButton(cat,state)).join('')+(categoryLayout.showSearch?'<span class="category-search-reserved" aria-hidden="true"></span>':'')+'</div>').join('');
      return '<div class="category-shell" style="--category-columns:'+categoryLayout.columns+';--category-rows:'+categoryLayout.rows+'"><nav class="category-scroll">'+pages+'</nav>'+(categoryLayout.overflow.length?'<span class="category-overflow">可左右滑動查看更多分類</span>':'')+(categoryLayout.showSearch?'<button class="category-search '+(state.searchQuery?'active':'')+'" data-action="open-search" aria-label="搜尋產品">⌕<small>'+(state.searchQuery?'搜尋中':'搜尋')+'</small></button>':'')+'</div>';
    }
    function customConfirm(){
      const notice=newOrderNotice?.visible?'<aside class="new-order-toast"><div><small>'+newOrderNotice.source+' 新訂單</small><strong>'+newOrderNotice.id+'</strong><span>'+newOrderNotice.items+' 件 · '+money(newOrderNotice.amount)+'</span></div><button data-action="later-new-order">稍後處理</button><button class="primary" data-action="process-new-order">立即處理</button></aside>':'';
      if(!confirmState)return notice;
      if(confirmState.kind==='modal-exit')return notice+'<div class="confirm-layer"><section class="confirm-card"><strong>'+confirmState.title+'</strong><p>'+confirmState.message+'</p><div><button data-action="confirm-cancel">繼續調整</button><button class="danger" data-action="confirm-discard">退出不保存</button><button class="primary" data-action="confirm-save-exit" '+(confirmState.saveAction?'':'disabled')+'>保存並退出</button></div></section></div>';
      const dissolve=confirmState.kind==='dissolve',dineCancel=confirmState.kind==='dine-cancel';
      return notice+'<div class="confirm-layer"><section class="confirm-card"><strong>'+confirmState.title+'</strong><p>'+confirmState.message+'</p><div><button data-action="confirm-cancel">'+(dissolve?'返回套餐':dineCancel?'繼續點單':'繼續修改')+'</button><button class="danger" data-action="'+(dissolve?'confirm-dissolve':dineCancel?'confirm-dine-cancel':'confirm-discard')+'">'+(dissolve?'確認拆開':dineCancel?'取消今次點單':'放棄修改')+'</button></div></section></div>';
    }
    function activeModal(){
      if(!modal)return '';
      if(modal.type==='quick')return quickSettingsModal();
      if(modal.type==='settings')return settingsModal();
      if(modal.type==='health')return healthModal();
      if(modal.type==='status')return statusModal();
      if(modal.type==='soldout')return soldoutModal();
      if(modal.type==='hang')return hangModal();
      if(modal.type==='take')return takeModal();
      if(modal.type==='specified-link')return specifiedLinkModal();
      if(modal.type==='combo')return comboEditorModal();
      if(modal.type==='completion')return completionModal();
      if(modal.type==='product')return productDetailModal();
      if(modal.type==='drink')return drinkModifierModal();
      if(modal.type==='search')return searchModal();
      if(modal.type==='pending')return pendingPanel();
      if(modal.type==='pending-detail')return pendingDetailModal();
      if(modal.type==='pending-review')return pendingReviewModal();
      if(modal.type==='proof')return enlargedProofModal();
      return '';
    }
    function anchorRect(button){const r=button?.getBoundingClientRect?.();return r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}:null;}
    function actionAnchor(button,override=null){return override||anchorRect(button);}
    function positionActiveCard(){
      const card=document.querySelector('.side-card,.product-settings-card,.modifier-card,.pending-panel,.pending-review-card,.proof-lightbox');const a=modal?.anchor;if(!card||!a)return;
      const topbarRect=document.querySelector('.topbar')?.getBoundingClientRect(),bottomNavRect=document.querySelector('.bottom-nav')?.getBoundingClientRect();
      const cartRect=document.querySelector('.cart')?.getBoundingClientRect();
      if(modal?.type==='pending'&&cartRect)card.style.maxHeight=Math.min(cartRect.height,(bottomNavRect?.top||innerHeight)-(topbarRect?.bottom||0)-32)+'px';
      const gap=14,w=card.offsetWidth,h=card.offsetHeight,margin=16,minTop=(topbarRect?.bottom||0)+margin,maxBottom=(bottomNavRect?.top||innerHeight)-margin;
      const room={top:a.top-minTop,bottom:maxBottom-a.bottom,left:a.left-margin,right:innerWidth-margin-a.right};
      let side,left,top;
      if(a.top<minTop+90){side='top';left=a.left+a.width/2-w/2;top=a.bottom+gap;}
      else if(a.bottom>maxBottom-110){side='bottom';left=a.left+a.width/2-w/2;top=a.top-h-gap;}
      else if(room.right>=w+gap){side='left';left=a.right+gap;top=a.top+a.height/2-h/2;}
      else {side='right';left=a.left-w-gap;top=a.top+a.height/2-h/2;}
      left=Math.max(margin,Math.min(left,innerWidth-w-margin));top=Math.max(minTop,Math.min(top,maxBottom-h));
      card.style.left=left+'px';card.style.right='auto';card.style.top=top+'px';card.style.transform='none';card.dataset.pointerSide=side;
      card.style.setProperty('--pointer-y',Math.max(24,Math.min(a.top+a.height/2-top,h-24))+'px');card.style.setProperty('--pointer-x',Math.max(24,Math.min(a.left+a.width/2-left,w-24))+'px');
    }
    function clearRecentLater(lineId){
      clearTimeout(recentTimer);
      if(!lineId)return;
      recentTimer=setTimeout(()=>{const current=store.get();if(current.lastAffectedLineId===lineId)store.setTransient(state=>({...state,lastAffectedLineId:'',lastMutationKind:''}));},1500);
    }
    function restoreCartViewport(state,previousScroll){
      const cart=document.querySelector('.cart-list');if(!cart)return;
      const target=state.lastAffectedLineId?document.querySelector('[data-line-id="'+CSS.escape(state.lastAffectedLineId)+'"]'):null;
      if(state.lastAffectedLineId&&state.lastMutationKind==='added'&&state.cartViewMode===CART_VIEW_INPUT){cart.scrollTop=cart.scrollHeight;}
      else if(target){target.scrollIntoView({block:'nearest'});}
      else cart.scrollTop=Math.max(0,previousScroll||0);
      cartScrollTop=cart.scrollTop;
      clearRecentLater(state.lastAffectedLineId);
    }
    let renderStarted=false;
    const renderKeys={top:'',cart:'',category:'',products:'',quick:'',bottom:'',modal:''};
    function surfaceKey(value){try{return JSON.stringify(value);}catch(_error){return String(Date.now());}}
    function cartSurface(state){
      const hasCart=state.cart.length>0;
      const checkoutLabel=state.dineContext?'落單到 '+escapeHtml(state.dineContext.tableId)+' 號枱 '+money(cartTotal(state.cart)):hasCart?'結帳 '+money(cartTotal(state.cart)):'購物車未有餐點';
      const serviceClass=state.orderServiceMode===SERVICE_DINE_IN?'dine':'takeaway';
      const viewClass=state.cartViewMode===CART_VIEW_ORGANIZED?'organized':'input';
      return '<aside class="cart"><header><div><h2>購物車（'+state.cart.reduce((n,l)=>n+l.qty,0)+'）</h2>'+cartSummary(state)+'</div><span class="cart-header-actions"><span class="cart-mode-controls"><button class="cart-mode-toggle '+serviceClass+'" data-action="toggle-order-service">'+state.orderServiceMode+'</button><button class="cart-mode-toggle cart-view-toggle '+viewClass+'" data-action="toggle-cart-view">'+(state.cartViewMode===CART_VIEW_ORGANIZED?'原單':'整理')+'</button></span>'+(state.dineContext?'<button class="cancel-dine-order" data-action="cancel-dine-order">取消堂食點單</button>':'')+'<button data-action="clear-cart">清空</button></span></header><div class="cart-list">'+cartRows()+'</div>'+pendingArea()+'<footer><button data-action="open-hold-panel">掛單</button><button data-action="open-drafts">取單'+(drafts.length?' '+drafts.length:'')+'</button><button class="primary" data-action="checkout" '+(hasCart?'':'disabled')+'>'+checkoutLabel+'</button></footer></aside>';
    }
    function filteredCatalog(state){
      const searchQuery=state.searchQuery.trim().toLocaleLowerCase('zh-HK');
      const categoryProducts=state.category==='全部'?products:products.filter(product=>product.category===state.category);
      return sortPausedLast(categoryProducts.filter(product=>!searchQuery||String(product.name||'').toLocaleLowerCase('zh-HK').includes(searchQuery)||String(product.code||'').toLocaleLowerCase('zh-HK').includes(searchQuery)));
    }
    function productGridSurface(state){
      const filtered=filteredCatalog(state),template=productTemplate();
      return '<div class="products products-'+template+'">'+(filtered.length?filtered.map(productCard).join(''):'<div class="empty search-empty">搵唔到符合「'+escapeHtml(state.searchQuery)+'」嘅產品</div>')+'</div>';
    }
    function refreshQrCodes(scope=document){
      scope.querySelectorAll?.('[data-qr]').forEach(node=>{if(typeof window.qrcode!=='function')return;const qr=window.qrcode(0,'M');qr.addData(node.dataset.qr);qr.make();node.innerHTML=qr.createImgTag(5,8,'WhatsApp QR Code');});
    }
    function replaceOuter(selector,html){
      const node=document.querySelector(selector);if(!node)return null;
      node.outerHTML=html;
      return document.querySelector(selector);
    }
    function refreshQuickSurface(html){
      const catalog=document.querySelector('.catalog');if(!catalog)return null;
      const current=catalog.querySelector('.quick-drawer');
      if(!html){current?.remove();return null;}
      if(current){current.outerHTML=html;}else catalog.insertAdjacentHTML('beforeend',html);
      return catalog.querySelector('.quick-drawer');
    }
    let lastOverlayOpen=null;
    function publishOverlayState(){
      const open=Boolean(modal||confirmState);
      if(open===lastOverlayOpen)return;
      lastOverlayOpen=open;
      window.parent?.postMessage?.({type:'morefun:overlay-state',open},'*');
    }
    function refreshModalSurface(state){
      const toast=document.getElementById('toast');if(!toast)return;
      app.querySelectorAll(':scope > .modal-scrim,:scope > .modal-card,:scope > .confirm-layer,:scope > .new-order-toast').forEach(node=>node.remove());
      toast.insertAdjacentHTML('beforebegin',modalScrim()+activeModal()+customConfirm());
      if(modal?.type==='settings'){
        const first=document.querySelector('.side-card .setting-row');
        first?.insertAdjacentHTML('beforebegin','<div class="setting-block"><strong>購物車相同產品</strong><div class="segmented"><button data-action="cart-merge" data-value="same" class="'+(state.settings.cart.mergeMode!=='never'?'active':'')+'">相同配置合併</button><button data-action="cart-merge" data-value="never" class="'+(state.settings.cart.mergeMode==='never'?'active':'')+'">逐項顯示</button></div></div>');
      }
      app.querySelectorAll(':scope > .modal-card,:scope > .confirm-layer,:scope > .new-order-toast').forEach(node=>{bindImageFallbacks(node);refreshQrCodes(node);});
      requestAnimationFrame(()=>positionActiveCard());
    }
    function render(){
      const state=store.get();
      const pendingCount=pendingOrderCount(state);
      const template=productTemplate();
      const topKey=surfaceKey([state.quickMode,state.operations,state.health,pendingCount,state.dineContext,products.map(item=>[item.id,supplyStatus(item)]),readJSON(ORDER_HISTORY_STORAGE_KEY,[]).length]);
      const cartKey=surfaceKey([state.cart,state.dineContext,state.orderServiceMode,state.cartViewMode,state.lastAffectedLineId,state.lastMutationKind,state.collapsedCartCategories,state.settings.cart,drafts.length]);
      const categoryKey=surfaceKey([state.category,state.searchQuery,state.settings.categoryLayout]);
      const productsKey=surfaceKey([state.category,state.searchQuery,state.quickMode,state.settings.catalog,template,products.map(item=>[item.id,supplyStatus(item)])]);
      const quickKey=surfaceKey([state.quickDrawerOpen,state.settings.quickDrinks,pendingSummary(state.cart).drink,lastDrinkAssignment,modal?.type==='drink'?modal.drinkId:'',drinks.map(item=>[item.id,item.available])]);
      const bottomKey=String(pendingCount);
      const modalKey=surfaceKey([modal,confirmState,newOrderNotice,modal?{cart:state.cart,settings:state.settings,health:state.health,pendingOrders:state.pendingOrders,searchQuery:state.searchQuery,drafts}:null]);
    
      if(!renderStarted){
        const topHtml=topbar(),cartHtml=cartSurface(state),categoryHtml=categoryBar(state),productsHtml=productGridSurface(state),quickHtml=quickDrinks(),bottomHtml=renderBottomNav('order',{badges:{orders:pendingCount}});
        app.innerHTML='<main>'+topHtml+'<section class="workspace"><section class="order-grid" style="--cart-width:'+Number(state.settings.cart.widthPercent||32)+'%">'+cartHtml+'<section class="catalog">'+categoryHtml+productsHtml+quickHtml+'</section></section></section>'+bottomHtml+'</main>'+modalScrim()+activeModal()+customConfirm()+'<div id="toast" class="toast"></div>';
        document.body.classList.toggle('has-modal',Boolean(modal));
        bindImageFallbacks(app);refreshQrCodes(app);
        Object.assign(renderKeys,{top:topKey,cart:cartKey,category:categoryKey,products:productsKey,quick:quickKey,bottom:bottomKey,modal:modalKey});
        renderStarted=true;
        requestAnimationFrame(()=>{positionActiveCard();restoreCartViewport(state,0);});
        publishOverlayState();
        window.dispatchEvent(new Event('morefun:layout-invalidated'));
        return;
      }
    
      let layoutChanged=false;
      const grid=document.querySelector('.order-grid');
      const cartWidth=Number(state.settings.cart.widthPercent||32)+'%';
      if(grid&&grid.style.getPropertyValue('--cart-width')!==cartWidth){grid.style.setProperty('--cart-width',cartWidth);layoutChanged=true;}
      document.body.classList.toggle('has-modal',Boolean(modal));
    
      if(renderKeys.top!==topKey){replaceOuter('.topbar',topbar());renderKeys.top=topKey;}
      if(renderKeys.cart!==cartKey){
        const oldCart=document.querySelector('.cart-list'),previousScroll=oldCart?oldCart.scrollTop:cartScrollTop;
        const node=replaceOuter('.cart',cartSurface(state));if(node)bindImageFallbacks(node);
        renderKeys.cart=cartKey;layoutChanged=true;requestAnimationFrame(()=>restoreCartViewport(state,previousScroll));
      }
      if(renderKeys.category!==categoryKey){replaceOuter('.category-shell',categoryBar(state));renderKeys.category=categoryKey;layoutChanged=true;}
      if(renderKeys.products!==productsKey){const node=replaceOuter('.products',productGridSurface(state));if(node)bindImageFallbacks(node);renderKeys.products=productsKey;layoutChanged=true;}
      if(renderKeys.quick!==quickKey){const node=refreshQuickSurface(quickDrinks());if(node)bindImageFallbacks(node);renderKeys.quick=quickKey;layoutChanged=true;}
      if(renderKeys.bottom!==bottomKey){replaceOuter('.bottom-nav',renderBottomNav('order',{badges:{orders:pendingCount}}));renderKeys.bottom=bottomKey;layoutChanged=true;}
      if(renderKeys.modal!==modalKey){refreshModalSurface(state);renderKeys.modal=modalKey;}
      publishOverlayState();
      if(layoutChanged)window.dispatchEvent(new Event('morefun:layout-invalidated'));
    }
    function completeDineCancellation(){
      const context=store.get().dineContext;
      if(context?.startedFromFree){const dine=cleanupEmptyDineSessions(readJSON(DINE_STORAGE_KEY,null)||createInitialDineState());writeJSON(DINE_STORAGE_KEY,dine);}
      store.set(state=>({...state,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));
      modal=null;confirmState=null;window.parent?.postMessage?.({type:'morefun:navigate',route:'dine'},'*');
    }
    function requestDineCancellation(){
      const state=store.get();if(!state.dineContext){window.parent?.postMessage?.({type:'morefun:navigate',route:'dine'},'*');return;}
      if(!state.cart.length){completeDineCancellation();return;}
      confirmState={kind:'dine-cancel',title:'取消堂食點單？',message:'今次未正式加入 '+state.dineContext.tableId+' 號枱，購物車內容會一併清除；原有堂食餐品不受影響。'};modal=null;render();
    }
    function markDirty(){if(modal)modal.dirty=true;}
    function modalSaveAction(current=modal){
      if(!current)return '';
      if(current.type==='product')return 'apply-product';
      if(current.type==='drink')return 'apply-drink';
      if(current.type==='completion'&&current.draft?.activeGroup)return 'apply-required-group';
      if(current.type==='combo')return 'apply-combo-edit';
      if(current.type==='specified-link')return 'apply-specified-link';
      return '';
    }
    function requestDismiss(){
      if(!modal)return;
      if(modal.dirty){
        confirmState={kind:'modal-exit',title:'已經有調整，是否退出？',message:'你可以繼續調整、退出而不保存，或者保存目前修改後退出。',returnModal:modal.type==='drink'&&modal.parent?modal.parent:null,saveAction:modalSaveAction(modal)};
        render();return;
      }
      modal=modal.type==='drink'&&modal.parent?modal.parent:null;confirmState=null;render();
    }
    function openProduct(productId,lineId='',anchor=null){
      const p=productMap.get(productId),line=lineId?store.get().cart.find(x=>x.lineId===lineId):null;
      modal={type:'product',productId,editLineId:lineId,anchor,dirty:false,draft:{qty:line?.qty||1,options:safeClone(line?.options||{}),drink:line?.drinkAssignments?.[0]||null,note:line?.options?.note||'',keypad:false,keypadValue:''}};
      render();
    }
    function locateMutation(before,after,productId,newLineId=''){
      if(newLineId&&after.some(line=>line.lineId===newLineId))return {lineId:newLineId,kind:'added'};
      const beforeMap=new Map(before.map(line=>[line.lineId,Number(line.qty||0)]));
      const added=after.find(line=>!beforeMap.has(line.lineId));if(added)return {lineId:added.lineId,kind:'added'};
      const changed=[...after].reverse().find(line=>line.productId===productId&&Number(line.qty||0)>Number(beforeMap.get(line.lineId)||0));
      return {lineId:changed?.lineId||after.at(-1)?.lineId||'',kind:changed?'changed':'added'};
    }
    function quickAddProduct(productId){
      const p=productMap.get(productId);if(!p)return;
      const current=store.get();const line=makeLine(productId,1,{serviceMode:current.orderServiceMode});const before=current.cart;
      store.set(state=>{const next=mergeCart(state.cart.concat(line),state.settings.cart.mergeMode);const mutation=locateMutation(before,next,productId,line.lineId);state.cart=next;state.lastAffectedLineId=mutation.lineId;state.lastMutationKind=mutation.kind;return state;});
      queue.afterRender(()=>showToast('已加入 '+p.name));
    }
    function changeCartQuantity(lineId,delta){
      store.set(state=>{state.cart=updateCartLineQuantity(state.cart,lineId,delta,Object.fromEntries(products.map(p=>[p.id,p.drinkSlots||0])));state.lastAffectedLineId=state.cart.some(line=>line.lineId===lineId)?lineId:'';state.lastMutationKind='changed';return state;});
    }
    function openDrink(drinkId,context,maxQty=1,anchor=null){modal={type:'drink',drinkId,context,maxQty,anchor,dirty:false,draft:{qty:1,sweetness:'',ice:'',groups:[]}};render();}
    function applyProduct(){
      const editing=Boolean(modal.editLineId);
      const p=productMap.get(modal.productId),d=modal.draft,options={...d.options};if(d.note)options.note=d.note;
      const current=store.get(),before=current.cart;
      const drinkAssignments=d.drink?Array.from({length:d.qty},()=>safeClone(d.drink)):[];
      let line=makeLine(p.id,d.qty,{options,drinkAssignments,linkedComboId:p.combinable&&d.options.snack&&d.drink?stableId('combo'):'',linkedQty:p.combinable&&d.options.snack&&d.drink?d.qty:0,serviceMode:current.orderServiceMode});
      if(p.category==='飯團套餐'){
        const components=[{role:'main',source:'fixed',productId:p.id,name:p.name,image:p.image,unitPrice:p.price,options:{}},{role:'snack',source:'fixed-option',productId:'snack:'+d.options.snack,name:d.options.snack,image:'',unitPrice:0,options:{}}];
        if(d.drink)components.push({role:'drink',source:'quick',productId:d.drink.drinkId,drinkId:d.drink.drinkId,name:d.drink.name,image:drinkMap.get(d.drink.drinkId)?.image||'',unitPrice:Number(d.drink.unitPrice||0),options:{}});
        line={...line,lineType:'combo',category:'飯團套餐',combo:{id:stableId('combo'),kind:'riceball-set',source:'fixed',components,missingRoles:d.drink?[]:['drink'],singleTotal:p.price,comboPrice:p.price,discount:0}};
      }
      const editLineId=modal.editLineId;
      store.set(state=>{
        if(editLineId){state.cart=state.cart.map(item=>item.lineId===editLineId?{...line,lineId:item.lineId,createdOrder:item.createdOrder,serviceMode:item.serviceMode,serviceModeOverride:item.serviceModeOverride||''}:item);state.lastAffectedLineId=editLineId;state.lastMutationKind='changed';}
        else{const next=mergeCart(state.cart.concat(line),state.settings.cart.mergeMode);const mutation=locateMutation(before,next,p.id,line.lineId);state.cart=next;state.lastAffectedLineId=mutation.lineId;state.lastMutationKind=mutation.kind;}
        return state;
      });
      modal=null;queue.afterRender(()=>showToast(editing?'已更新產品':'已加入購物車'));
    }
    function applyDrink(){
      const groups=modal.draft.groups||[];
      const selections=Array.from({length:modal.draft.qty},()=>drinkSelection(modal.drinkId)).concat(groups.flatMap(group=>Array.from({length:group.qty},()=>drinkSelection(modal.drinkId,group.sweetness,group.ice)))),context=modal.context;
      if(context==='detail'){const productModal=modal.parent;productModal.draft.drink=selections[0];productModal.dirty=true;modal=productModal;render();return;}
      let appliedTarget=null;
      store.set(state=>{let remaining=selections.slice();state.cart=state.cart.map(line=>{if(!remaining.length)return line;const miss=Math.max(0,line.drinkSlots-line.drinkAssignments.length);const taken=remaining.splice(0,miss);if(taken.length&&!appliedTarget)appliedTarget={lineId:line.lineId,name:line.name};return taken.length?{...line,drinkAssignments:line.drinkAssignments.concat(taken)}:line;});if(appliedTarget){state.lastAffectedLineId=appliedTarget.lineId;state.lastMutationKind='changed';}return state;});
      if(appliedTarget&&selections[0]){lastDrinkAssignment={drink:selections[0].name,target:appliedTarget.name};clearTimeout(drinkFeedbackTimer);drinkFeedbackTimer=setTimeout(()=>{lastDrinkAssignment=null;render();},3200);}
      pendingDrinkAssignment=null;modal=null;queue.afterRender(()=>showToast('已補選飲品'));
    }
    function handle(button,anchorOverride=null){
      const action=button.dataset.action;
      if(action==='shell-navigate'){const route=button.dataset.route;if(route==='dine'&&store.get().dineContext)return requestDineCancellation();if(route!=='order')window.parent?.postMessage?.({type:'morefun:navigate',route},'*');return;}
      if(store.get().quickDrawerOpen)scheduleQuickDrawerClose();
      if(action==='category')store.setTransient(state=>({...state,category:button.dataset.value}));
      else if(action==='open-search'){modal={type:'search',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='clear-search'){store.setTransient(state=>({...state,searchQuery:''}));}
      else if(action==='open-product')openProduct(button.dataset.id,'',actionAnchor(button,anchorOverride));
      else if(action==='quick-add-product')quickAddProduct(button.dataset.id);
      else if(action==='cart-qty')changeCartQuantity(button.dataset.id,Number(button.dataset.delta)||0);
      else if(action==='toggle-order-service')store.set(state=>{const next=state.orderServiceMode===SERVICE_DINE_IN?SERVICE_TAKEAWAY:SERVICE_DINE_IN;return {...state,orderServiceMode:next,cart:applyOrderServiceMode(state.cart,next),lastAffectedLineId:'',lastMutationKind:''};});
      else if(action==='toggle-line-service')store.set(state=>({...state,cart:toggleLineServiceMode(state.cart,button.dataset.id,state.orderServiceMode),lastAffectedLineId:button.dataset.id,lastMutationKind:'changed'}));
      else if(action==='toggle-cart-view')saveCartViewMode(store.get().cartViewMode===CART_VIEW_ORGANIZED?CART_VIEW_INPUT:CART_VIEW_ORGANIZED);
      else if(action==='toggle-cart-category')store.setTransient(state=>{const category=button.dataset.value;const collapsed=state.collapsedCartCategories.includes(category);return {...state,collapsedCartCategories:collapsed?state.collapsedCartCategories.filter(item=>item!==category):state.collapsedCartCategories.concat(category)};});
      else if(action==='edit-line'){const line=store.get().cart.find(x=>x.lineId===button.dataset.id);if(line?.lineType==='combo'){modal={type:'combo',lineId:line.lineId,anchor:actionAnchor(button,anchorOverride),dirty:false,draft:{components:safeClone(line.combo?.components||[])}};render();}else if(line)openProduct(line.productId,line.lineId,actionAnchor(button,anchorOverride));}
      else if(action==='open-completion'){modal={type:'completion',dirty:false,draft:{activeGroup:'',activeTarget:'',assignments:{}}};render();}
      else if(action==='open-quick-settings'){modal={type:'quick',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-settings'){modal={type:'settings',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-health'){modal={type:'health',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-status'){modal={type:'status',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-soldout'){modal={type:'soldout',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='navigate-orders')window.parent?.postMessage?.({type:'morefun:navigate',route:'orders'},'*');
      else if(action==='navigate-dine')requestDineCancellation();
      else if(action==='navigate-soldout')window.parent?.postMessage?.({type:'morefun:navigate',route:'soldout'},'*');
      else if(action==='navigate-more')window.parent?.postMessage?.({type:'morefun:navigate',route:'more'},'*');
      else if(action==='open-hold-panel'){if(!store.get().cart.length){showToast('購物車未有餐品');return;}modal={type:'hang',dirty:false};render();}
      else if(action==='select-draft'){modal={...modal,selectedDraftId:button.dataset.id};render();}
      else if(action==='assign-table'){
        const current=store.get();if(!current.cart.length){showToast('購物車未有餐品');return;}
        try{const dineState=readJSON(DINE_STORAGE_KEY,null)||createInitialDineState();const table=dineState.tables.find(entry=>entry.id===button.dataset.id);const context={mode:'dine',tableId:button.dataset.id,sessionId:table?.status==='occupied'?table.session?.id:null};const dineCart=applyOrderServiceMode(current.cart,SERVICE_DINE_IN);const next=commitTableOrder(dineState,context,dineCart,{terminalId,history:readJSON(ORDER_HISTORY_STORAGE_KEY,[])});writeJSON(DINE_STORAGE_KEY,next);syncDinePrintJobs(next);store.set(state=>({...state,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));modal=null;queue.afterRender(()=>showToast('已正式加入 '+button.dataset.id+' 號枱及建立打印工作'));}catch(error){showToast(error.message||'未能加入堂食枱位');}
      }
      else if(action==='add-draft'){
        const state=store.get();if(!state.cart.length)return;
        const draft=createDraftRecord({cart:state.cart,terminalId,drafts,counters:draftCounters,session:state.draftSession||null,context:state.dineContext||null});
        draftCounters={...draftCounters,[terminalId]:Number(draft.draftNumber.split('-').at(-1))};writeJSON(DRAFT_COUNTER_STORAGE_KEY,draftCounters);drafts=drafts.concat(draft);writeJSON(DRAFT_STORAGE_KEY,drafts);
        store.set(next=>({...next,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));modal=null;queue.afterRender(()=>showToast('已暫存 '+draft.draftNumber));
      }
      else if(action==='open-drafts'){modal={type:'take',selectedDraftId:'',dirty:false};render();}
      else if(action==='restore-draft'){
        const draft=drafts.find(item=>item.id===button.dataset.id);if(!draft)return;
        const restored=restoreDraftForTerminal(draft,terminalId);drafts=drafts.filter(item=>item.id!==draft.id);writeJSON(DRAFT_STORAGE_KEY,drafts);
        const orderServiceMode=inferOrderServiceMode(restored.cart,null);
        store.set(state=>({...state,cart:normalizeCart(restored.cart,orderServiceMode),draftSession:restored.session,dineContext:null,orderServiceMode,lastAffectedLineId:'',lastMutationKind:''}));modal=null;queue.afterRender(()=>showToast('已取回 '+draft.draftNumber));
      }
      else if(action==='void-draft'){const draft=drafts.find(item=>item.id===modal?.selectedDraftId);if(!draft)return;if(!window.confirm('確定作廢 '+draft.draftNumber+'？作廢後不能取回。'))return;drafts=drafts.filter(item=>item.id!==draft.id);writeJSON(DRAFT_STORAGE_KEY,drafts);modal={type:'take',selectedDraftId:'',dirty:false};render();showToast('已作廢 '+draft.draftNumber);}
      else if(action==='toggle-quick-drawer'){store.setTransient(state=>({...state,quickDrawerOpen:!state.quickDrawerOpen}));scheduleQuickDrawerClose();}
      else if(action==='move-quick-drink')updateSettings(s=>{const order=s.quickDrinks.order.slice(),from=order.indexOf(button.dataset.id),to=Math.max(0,Math.min(order.length-1,from+Number(button.dataset.delta)));if(from>=0&&from!==to)[order[from],order[to]]=[order[to],order[from]];s.quickDrinks.order=order;});
      else if(action==='ui-scale')window.parent?.postMessage?.({type:'morefun:set-ui-scale',value:Number(button.dataset.value)},'*');
      else if(action==='dismiss-modal')requestDismiss();
      else if(action==='confirm-cancel'){confirmState=null;render();}
      else if(action==='confirm-discard'){modal=confirmState?.returnModal||null;confirmState=null;render();}
      else if(action==='confirm-save-exit'){const saveAction=confirmState?.saveAction;confirmState=null;if(saveAction)handle({dataset:{action:saveAction}});else{modal=null;render();}}
      else if(action==='confirm-dine-cancel')completeDineCancellation();
      else if(action==='confirm-dissolve'){const lineId=confirmState.lineId;store.set(state=>{state.cart=normalizeCart(dissolveRiceballSet(state.cart,lineId,{idFactory:role=>stableId('line-'+role)}),state.orderServiceMode);state.lastAffectedLineId=state.cart.at(-1)?.lineId||'';state.lastMutationKind='changed';return state;});confirmState=null;modal=null;queue.afterRender(()=>showToast('套餐已拆開並按單品重新計價'));}
      else if(action==='toggle-pending-panel'){if(modal?.type==='pending')modal=null;else modal={type:'pending',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='process-pending-order'){const pendingOrders=store.get().pendingOrders;const order=Object.values(pendingOrders).flat().find(x=>x.id===button.dataset.id);if(order){modal={type:'pending-detail',order,anchor:modal?.anchor,dirty:false};showToast('開啟 '+order.id+' 核對流程');render();}}
      else if(action==='start-pending-review'){modal={type:'pending-review',order:modal.order,anchor:modal.anchor,dirty:false};render();}
      else if(action==='enlarge-proof'){modal={type:'proof',order:modal.order,anchor:modal.anchor,dirty:false};render();}
      else if(action==='back-to-pending-review'){modal={type:'pending-review',order:modal.order,anchor:modal.anchor,dirty:false};render();}
      else if(action==='report-payment-issue'){showToast('請掃描 WhatsApp QR Code 聯絡客人');}
      else if(action==='accept-pending-order'){const accepted=acceptPendingOrder(modal.order);store.set(state=>{state.pendingOrders={online:state.pendingOrders.online.filter(x=>x.id!==accepted.id),queue:state.pendingOrders.queue.filter(x=>x.id!==accepted.id)};state.runningOrders=state.runningOrders.concat(accepted);return state;});modal=null;queue.afterRender(()=>showToast('已接單 '+accepted.id+'；30分鐘後自動完成'));}
      else if(action==='set-order-mode')store.set(state=>({...state,quickMode:button.dataset.value==='quick'}));
      else if(action==='toggle-quick-drink-strip')updateSettings(s=>{s.quickDrinks.visible=s.quickDrinks.visible===false;});
      else if(action==='quick-display')updateSettings(s=>{s.quickDrinks.showImages=button.dataset.value==='image';});
      else if(action==='toggle-quick-assist')updateSettings(s=>{s.quickDrinks.quickAssist=s.quickDrinks.quickAssist===false;});
      else if(action==='setting-card')updateSettings(s=>{s.catalog.defaultTemplate=button.dataset.value;s.catalog.productOverrides={};});
      else if(action==='cart-width')updateSettings(s=>{s.cart.widthPercent=Number(button.dataset.value)||32;});
      else if(action==='cart-merge')updateSettings(s=>{s.cart.mergeMode=button.dataset.value;});
      else if(action==='toggle-cart-images')updateSettings(s=>{s.cart.showImages=s.cart.showImages===false;});
      else if(action==='toggle-code')updateSettings(s=>{s.catalog.showCode=!s.catalog.showCode;});
      else if(action==='toggle-accepting')store.set(state=>{state.operations.acceptingOrders=!state.operations.acceptingOrders;state.operations.immediateStopped=false;return state;});
      else if(action==='save-close-time'){const v=document.getElementById('scheduled-close')?.value||'';store.set(state=>{state.operations.scheduledClose=v;return state;});showToast('接單時間已更新');}
      else if(action==='immediate-stop')store.set(state=>{state.operations.acceptingOrders=false;state.operations.immediateStopped=true;return state;});
      else if(action==='resume-orders')store.set(state=>{state.operations.acceptingOrders=true;state.operations.immediateStopped=false;state.operations.scheduledClose='';return state;});
      else if(action==='detail-option'){
        markDirty();const g=button.dataset.group,v=button.dataset.value,multi=button.dataset.multi==='true';
        if(modal.type==='drink'){if(g==='sweetness')modal.draft.sweetness=modal.draft.sweetness===v?'':v;if(g==='ice')modal.draft.ice=modal.draft.ice===v?'':v;if(g.startsWith('group-sweetness-')){const x=Number(g.split('-').pop()),group=modal.draft.groups[x];group.sweetness=group.sweetness===v?'':v;}if(g.startsWith('group-ice-')){const x=Number(g.split('-').pop()),group=modal.draft.groups[x];group.ice=group.ice===v?'':v;}}
        else if(multi){const arr=modal.draft.options[g]||[];modal.draft.options[g]=arr.includes(v)?arr.filter(x=>x!==v):arr.concat(v);}else modal.draft.options[g]=modal.draft.options[g]===v?'':v;
        render();
      }
      else if(action==='detail-drink'){const parent=modal;modal={type:'drink',drinkId:button.dataset.id,context:'detail',maxQty:parent.draft.qty,parent,anchor:actionAnchor(button,anchorOverride),dirty:false,draft:{qty:parent.draft.qty,sweetness:'',ice:'',groups:[]}};render();}
      else if(action==='detail-qty'){markDirty();modal.draft.qty=Math.max(1,modal.draft.qty+Number(button.dataset.delta));render();}
      else if(action==='toggle-keypad'){modal.draft.keypad=!modal.draft.keypad;render();}
      else if(action==='keypad'){const key=button.dataset.key;if(key==='完成')modal.draft.keypad=false;else if(key==='←')modal.draft.keypadValue=modal.draft.keypadValue.slice(0,-1);else modal.draft.keypadValue=(modal.draft.keypadValue+key).replace(/^0+(?=\d)/,'');if(modal.draft.keypadValue)modal.draft.qty=Math.max(1,Number(modal.draft.keypadValue));markDirty();render();}
      else if(action==='apply-product')applyProduct();
      else if(action==='modifier-qty'){markDirty();modal.draft.qty=Math.max(0,Math.min(modal.maxQty,modal.draft.qty+Number(button.dataset.delta)));render();}
      else if(action==='group-qty'){markDirty();const g=modal.draft.groups[Number(button.dataset.index)];const used=modal.draft.qty+modal.draft.groups.reduce((n,x)=>n+x.qty,0);g.qty=Math.max(1,Math.min(g.qty+Number(button.dataset.delta),modal.maxQty-used+g.qty));render();}
      else if(action==='add-drink-group'){markDirty();const used=modal.draft.qty+modal.draft.groups.reduce((n,x)=>n+x.qty,0);if(used<modal.maxQty)modal.draft.groups.push({qty:1,sweetness:'',ice:'',open:true});else showToast('已達可補數量');render();}
      else if(action==='toggle-drink-adjustment'){const g=modal.draft.groups[Number(button.dataset.index)];g.open=!g.open;render();}
      else if(action==='apply-drink')applyDrink();
      else if(action==='quick-drink'){
        if(store.get().settings.quickDrinks.quickAssist===false){showToast('快捷補選已關閉');return;}
        const target=findDrinkTarget(store.get().cart),missing=pendingSummary(store.get().cart).drink;if(!missing||!target){showToast('目前沒有待補飲品');return;}pendingDrinkAssignment={lineId:target.lineId,name:target.name};openDrink(button.dataset.id,'global',missing,actionAnchor(button,anchorOverride));
      }
      else if(action==='complete-group'){modal.draft=completionDraft(button.dataset.group);modal.dirty=false;render();}
      else if(action==='completion-back'){modal.draft={activeGroup:'',activeTarget:'',assignments:{}};modal.dirty=false;render();}
      else if(action==='completion-target'){modal.draft.activeTarget=button.dataset.id;render();}
      else if(action==='completion-required-choice'){
        const target=modal.draft.activeTarget,value=button.dataset.value;if(!target)return;
        modal.draft.assignments={...(modal.draft.assignments||{}),[target]:value};modal.dirty=true;
        const targets=requiredTargets(store.get().cart,modal.draft.activeGroup),next=targets.find(item=>!modal.draft.assignments[item.id]);if(next)modal.draft.activeTarget=next.id;render();
      }
      else if(action==='completion-fill-remaining'){
        const value=button.dataset.value,targets=requiredTargets(store.get().cart,modal.draft.activeGroup);targets.forEach(target=>{if(!modal.draft.assignments[target.id])modal.draft.assignments[target.id]=value;});modal.dirty=true;render();
      }
      else if(action==='apply-required-group')applyRequiredGroup();
      else if(action==='linkup-all')applyLinkUp(Number(button.dataset.count)||0);
      else if(action==='open-specified-link'){const count=pairingGroupCount(store.get().cart),groups=Array.from({length:count},()=>({main:'',snack:'',drink:''}));if(!count){showToast('需要主餐及小食才可指定配對');return;}modal={type:'specified-link',anchor:actionAnchor(button,anchorOverride),dirty:false,draft:{groups,active:0}};render();}
      else if(action==='select-pairing-group'){modal.draft.active=Number(button.dataset.index)||0;render();}
      else if(action==='select-link-item'){const group=modal.draft.groups[modal.draft.active],role=button.dataset.role;group[role]=group[role]===button.dataset.id?'':button.dataset.id;render();}
      else if(action==='select-link-drink'){const group=modal.draft.groups[modal.draft.active];group.drink=group.drink===button.dataset.id?'':button.dataset.id;render();}
      else if(action==='apply-specified-link'){
        const groups=safeClone(modal.draft.groups.filter(group=>group.main&&group.snack));
        store.set(state=>{let next=state.cart;groups.forEach(group=>{const quickId=group.drink?.startsWith('quick:')?group.drink.slice(6):'',quick=quickId?drinkMap.get(quickId):null;next=combineRiceballSet(next,{mainLineId:group.main,snackLineId:group.snack,drinkLineId:quickId?'':group.drink,quickDrink:quick?{productId:quick.id,drinkId:quick.id,name:quick.name,image:quick.image,unitPrice:quick.price,selection:drinkSelection(quick.id)}:null},{comboId:stableId('combo'),lineId:stableId('line'),comboPrice:59,source:'specified'});});state.cart=normalizeCart(next,state.orderServiceMode);state.lastAffectedLineId=state.cart.at(-1)?.lineId||'';state.lastMutationKind='changed';return state;});modal=null;queue.afterRender(()=>showToast('已建立 '+groups.length+' 組指定套餐'));
      }
      else if(action==='select-combo-component'){const role=button.dataset.role,id=button.dataset.id,item=role==='drink'?drinkMap.get(id):productMap.get(id);if(!item)return;modal.draft.components=modal.draft.components.filter(component=>component.role!==role).concat({role,source:role==='drink'?'quick':'catalog',productId:item.id,drinkId:role==='drink'?item.id:'',name:item.name,image:item.image||'',unitPrice:Number(item.price||0),options:{}});modal.dirty=true;render();}
      else if(action==='clear-combo-component'){modal.draft.components=modal.draft.components.filter(component=>component.role!=='drink');modal.dirty=true;render();}
      else if(action==='apply-combo-edit'){const components=safeClone(modal.draft.components),lineId=modal.lineId,drink=components.find(item=>item.role==='drink');store.set(state=>{state.cart=state.cart.map(line=>line.lineId!==lineId?line:{...line,image:components.find(item=>item.role==='main')?.image||line.image,drinkAssignments:drink?[{drinkId:drink.productId,name:drink.name,image:drink.image||'',sweetness:'',ice:'',source:drink.source}]:[],combo:{...line.combo,components,missingRoles:drink?[]:['drink']}});state.lastAffectedLineId=lineId;state.lastMutationKind='changed';return state;});modal=null;queue.afterRender(()=>showToast('套餐組合已更新'));}
      else if(action==='request-dissolve-combo'){const line=store.get().cart.find(item=>item.lineId===modal.lineId);const singles=(line?.combo?.components||[]).reduce((sum,item)=>sum+Number(item.unitPrice||0),0);confirmState={kind:'dissolve',lineId:modal.lineId,title:'拆開套餐？',message:'拆開後會還原為獨立產品，並按單品價格重新計算（'+money(singles)+'）。'};render();}
      else if(action==='later-new-order'){newOrderNotice.visible=false;render();}
      else if(action==='process-new-order'){newOrderNotice.visible=false;modal={type:'pending',anchor:null,dirty:false};render();}
      else if(action==='clear-cart'){if(window.confirm('清空後不可恢復，確定清空整張購物車？'))store.set(state=>({...state,cart:[],orderServiceMode:state.dineContext?SERVICE_DINE_IN:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));}
      else if(action==='cancel-dine-order')requestDineCancellation();
      else if(action==='checkout'){
        const current=store.get();if(pendingSummary(current.cart).total){showToast('請先完成必選項目');return;}if(!current.cart.length)return;
        if(current.dineContext){try{const dineState=readJSON(DINE_STORAGE_KEY,null);const dineCart=applyOrderServiceMode(current.cart,SERVICE_DINE_IN);const next=commitTableOrder(dineState,current.dineContext,dineCart,{terminalId,history:readJSON(ORDER_HISTORY_STORAGE_KEY,[])});writeJSON(DINE_STORAGE_KEY,next);syncDinePrintJobs(next);store.set(state=>({...state,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));window.parent?.postMessage?.({type:'morefun:navigate',route:'dine'},'*');}catch(error){showToast(error.message||'未能加入堂食枱位');}return;}
        window.parent?.postMessage?.({type:'morefun:navigate',route:'checkout'},'*');
      }
    }
    app.addEventListener('morefun:status-action',event=>{const button=event.target.closest('[data-action]');if(!button||button.disabled)return;event.preventDefault();handle(button,event.detail?.anchor||null);});
    app.addEventListener('click',event=>{if(event.target.classList?.contains('modal-scrim')){event.preventDefault();requestDismiss();return;}const button=event.target.closest('[data-action]');if(button&&!button.disabled)handle(button);});
    app.addEventListener('pointerdown',event=>{if(event.target.closest('.quick-drawer-panel'))scheduleQuickDrawerClose();});
    app.addEventListener('input',event=>{if(event.target.matches('[data-action="detail-note"]')&&modal?.type==='product'){modal.draft.note=event.target.value;markDirty();return;}if(event.target.matches('[data-action="search-query"]')&&modal?.type==='search'){const value=event.target.value;store.setTransient(state=>({...state,searchQuery:value}));queue.afterRender(()=>{const input=document.querySelector('[data-action="search-query"]');if(input){input.focus();input.setSelectionRange(value.length,value.length);}});}});
    addEventListener('message',event=>{if(event.data?.type==='morefun:page-activate'&&event.data.route==='order'){const current=readJSON(ORDER_STORAGE_KEY,null);if(current?.dineContext&&!store.get().dineContext)store.set(state=>({...state,dineContext:current.dineContext,orderServiceMode:SERVICE_DINE_IN,cart:applyOrderServiceMode(current.cart||[],SERVICE_DINE_IN)}));}});
    render();
    async function bootstrapLiveMenu(){
      const catalog=await loadMenuCatalog({fallback:fallbackCatalog});
      categories=[...(catalog.categories||fallbackCategories)];products=[...(catalog.products||fallbackProducts)];drinks=[...(catalog.drinks?.length?catalog.drinks:fallbackDrinks)];indexCatalog();
      store.set(state=>{if(!categories.includes(state.category))state.category='全部';const existing=state.settings.quickDrinks.order||[];state.settings.quickDrinks.order=[...existing.filter(id=>drinkMap.has(id)),...drinks.map(item=>item.id).filter(id=>!existing.includes(id))];state.health.catalog={ok:catalog.source!=='fallback',label:'餐牌',detail:catalog.source==='firebase'?'已連接 Firebase 餐牌來源':catalog.source==='cache'?'離線模式：使用上次餐牌':'Firebase 未連接：使用內置後備餐牌'};state.health.sync={...state.health.sync,detail:catalog.source==='firebase'?'餐牌同步正常':'餐牌等待重新連線'};return state;});
      showToast(catalog.source==='firebase'?'餐牌已同步':catalog.source==='cache'?'網絡未連接，已載入上次餐牌':'Firebase 未連接，現正使用後備餐牌');
    }
    bootstrapLiveMenu().catch(error=>{console.error('MENU_BOOTSTRAP_FAILED',error);showToast('餐牌連接失敗，已保留本機點單');});
    setTimeout(()=>{if(newOrderNotice?.visible){newOrderNotice.visible=false;render();}},3000);
    setInterval(()=>{const current=store.get();if(!current.runningOrders.length)return;const next=completeExpiredOrders(current.runningOrders);const completed=next.filter((order,index)=>order.status==='completed'&&current.runningOrders[index]?.status!=='completed');if(!completed.length)return;store.set(state=>{state.runningOrders=next.filter(order=>order.status==='running');state.completedOrders=state.completedOrders.concat(completed);return state;});},30000);
    
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:294:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: riceball and snack can become one pending-drink combo without a cart drink
ok 166 - riceball and snack can become one pending-drink combo without a cart drink
  ---
  duration_ms: 0.870428
  type: 'test'
  ...
# Subtest: quick drink embeds inside combo without first becoming a cart line
ok 167 - quick drink embeds inside combo without first becoming a cart line
  ---
  duration_ms: 0.325939
  type: 'test'
  ...
# Subtest: cart drink can be consumed into a combo and remaining quantity stays standalone
ok 168 - cart drink can be consumed into a combo and remaining quantity stays standalone
  ---
  duration_ms: 0.302265
  type: 'test'
  ...
# Subtest: dissolving a combo restores standalone components at single prices
ok 169 - dissolving a combo restores standalone components at single prices
  ---
  duration_ms: 0.653532
  type: 'test'
  ...
# Subtest: specified pairing offers quick drinks and accepts main plus snack before drink
ok 170 - specified pairing offers quick drinks and accepts main plus snack before drink
  ---
  duration_ms: 0.168084
  type: 'test'
  ...
# Subtest: order page loads the shared live menu contract with offline fallback
ok 171 - order page loads the shared live menu contract with offline fallback
  ---
  duration_ms: 0.220643
  type: 'test'
  ...
# Subtest: 每日流水以早上五時為分界並固定三位數
ok 172 - 每日流水以早上五時為分界並固定三位數
  ---
  duration_ms: 2.155791
  type: 'test'
  ...
# Subtest: 所有渠道共用同一每日流水並兼容舊 P 編號
ok 173 - 所有渠道共用同一每日流水並兼容舊 P 編號
  ---
  duration_ms: 0.672387
  type: 'test'
  ...
# Subtest: 每日流水到 P999 後拒絕循環覆蓋
ok 174 - 每日流水到 P999 後拒絕循環覆蓋
  ---
  duration_ms: 0.801649
  type: 'test'
  ...
# Subtest: 顯示號碼支援新舊訂單並按真實時間找最新一張
ok 175 - 顯示號碼支援新舊訂單並按真實時間找最新一張
  ---
  duration_ms: 0.482001
  type: 'test'
  ...
# Subtest: 流水營業日及最近訂單以開單時間為準而不受完成時間延遲影響
ok 176 - 流水營業日及最近訂單以開單時間為準而不受完成時間延遲影響
  ---
  duration_ms: 0.533007
  type: 'test'
  ...
# Subtest: 永久編號使用實際日期並在堂食單包含枱號
ok 177 - 永久編號使用實際日期並在堂食單包含枱號
  ---
  duration_ms: 0.299309
  type: 'test'
  ...
# SMT_ORDER_REQUIRED_COMPLETION_CORE_V2_OK
# Subtest: tests/order-required-completion-core.test.mjs
ok 18 - tests/order-required-completion-core.test.mjs
  ---
  duration_ms: 64.701608
  type: 'test'
  ...
# Subtest: order runtime does not load post-render drink enhancer
ok 179 - order runtime does not load post-render drink enhancer
  ---
  duration_ms: 1.265416
  type: 'test'
  ...
# Subtest: drink assignment badges render from assignment state
ok 180 - drink assignment badges render from assignment state
  ---
  duration_ms: 0.459309
  type: 'test'
  ...
# Subtest: modal policy is owned by order core, not an external runtime layer
ok 181 - modal policy is owned by order core, not an external runtime layer
  ---
  duration_ms: 0.362588
  type: 'test'
  ...
# Subtest: order runtime keeps required completion in page state
ok 182 - order runtime keeps required completion in page state
  ---
  duration_ms: 0.365694
  type: 'test'
  ...
# Subtest: transient UI state bypasses transaction persistence and full normalization
ok 183 - transient UI state bypasses transaction persistence and full normalization
  ---
  duration_ms: 0.448008
  type: 'test'
  ...
# Subtest: order page uses lazy surface rendering
ok 184 - order page uses lazy surface rendering
  ---
  duration_ms: 0.297346
  type: 'test'
  ...
# Subtest: 運行訂單滿三十分鐘會持久轉入歷史而唔係只改畫面
ok 185 - 運行訂單滿三十分鐘會持久轉入歷史而唔係只改畫面
  ---
  duration_ms: 2.972378
  type: 'test'
  ...
# Subtest: filters can switch between source, payment exception, print exception and history
ok 186 - filters can switch between source, payment exception, print exception and history
  ---
  duration_ms: 0.542955
  type: 'test'
  ...
# Subtest: changing channel and payment persists values and audit instead of only showing a toast
ok 187 - changing channel and payment persists values and audit instead of only showing a toast
  ---
  duration_ms: 0.413783
  type: 'test'
  ...
# Subtest: 更改渠道會套用正式付款狀態，非現場渠道不可保留舊付款方式
ok 188 - 更改渠道會套用正式付款狀態，非現場渠道不可保留舊付款方式
  ---
  duration_ms: 0.268913
  type: 'test'
  ...
# Subtest: 待核實訂單可核實付款或標記問題及通知客戶
ok 189 - 待核實訂單可核實付款或標記問題及通知客戶
  ---
  duration_ms: 0.538627
  type: 'test'
  ...
# Subtest: 訂單頁待核實入口共用完整核數及通知客戶操作
ok 190 - 訂單頁待核實入口共用完整核數及通知客戶操作
  ---
  duration_ms: 0.306223
  type: 'test'
  ...
# Subtest: 問題原因提供快選亦容許留空，唔會卡住待處理流程
ok 191 - 問題原因提供快選亦容許留空，唔會卡住待處理流程
  ---
  duration_ms: 0.41711
  type: 'test'
  ...
# Subtest: 打印異常訂單由職員打開後勾選需要重印的文件
ok 192 - 打印異常訂單由職員打開後勾選需要重印的文件
  ---
  duration_ms: 0.265847
  type: 'test'
  ...
# Subtest: 部分取消使用商品行內加減及一次確認，不再逐項使用下拉選單
ok 193 - 部分取消使用商品行內加減及一次確認，不再逐項使用下拉選單
  ---
  duration_ms: 0.788685
  type: 'test'
  ...
# Subtest: partial cancellation keeps cancelled quantity visible and recalculates total
ok 194 - partial cancellation keeps cancelled quantity visible and recalculates total
  ---
  duration_ms: 0.851182
  type: 'test'
  ...
# Subtest: whole-order cancellation remains in history instead of disappearing
ok 195 - whole-order cancellation remains in history instead of disappearing
  ---
  duration_ms: 0.348532
  type: 'test'
  ...
# Subtest: reprint creates a visible print job and clears the exception after retry
ok 196 - reprint creates a visible print job and clears the exception after retry
  ---
  duration_ms: 0.279352
  type: 'test'
  ...
# Subtest: 掛單只開左右面板，再由一般掛單或堂食枱號完成操作
ok 197 - 掛單只開左右面板，再由一般掛單或堂食枱號完成操作
  ---
  duration_ms: 1.616993
  type: 'test'
  ...
# Subtest: 取單使用左列表右內容，並固定返回、作廢及取單操作
ok 198 - 取單使用左列表右內容，並固定返回、作廢及取單操作
  ---
  duration_ms: 0.321611
  type: 'test'
  ...
# Subtest: checkout persists the completing terminal and order audit
ok 199 - checkout persists the completing terminal and order audit
  ---
  duration_ms: 0.220061
  type: 'test'
  ...
# Subtest: bottom navigation opens the independent orders page
ok 200 - bottom navigation opens the independent orders page
  ---
  duration_ms: 0.330929
  type: 'test'
  ...
# Subtest: orders page uses the three approved channel columns and payment methods
ok 201 - orders page uses the three approved channel columns and payment methods
  ---
  duration_ms: 0.293409
  type: 'test'
  ...
# Subtest: 每件產品保存獨立堂食或外賣選擇
not ok 202 - 每件產品保存獨立堂食或外賣選擇
  ---
  duration_ms: 2.365784
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/orders-drafts-ui.test.mjs:57:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /service-mode/. Input:
    
    "import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';\n" +
      "import {ORDER_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,SETTINGS_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,DINE_STORAGE_KEY,SUPPLY_STORAGE_KEY,PRINTER_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';\n" +
      "import {clearExpiredBusinessDayDrafts,createDraftRecord,normalizeTerminalId,restoreDraftForTerminal} from '../../shared/operations.js';\n" +
      "import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';\n" +
      "import {orderPageConfig as defaults} from './page-config.js';\n" +
      "import {categories as fallbackCategories,products as fallbackProducts,drinks as fallbackDrinks,optionSets} from './page-data.js';\n" +
      "import {loadMenuCatalog,MENU_CACHE_KEY} from './menu-api.js';\n" +
      "import {acceptPendingOrder,combineRiceballSet,dissolveRiceballSet,completeExpiredOrders,createWhatsAppLink,updateCartLineQuantity,CART_VIEW_INPUT,CART_VIEW_ORGANIZED,SERVICE_TAKEAWAY,SERVICE_DINE_IN,normalizeCartViewMode,normalizeServiceMode,resolveInitialOrderServiceMode,applyOrderServiceMode,toggleLineServiceMode,cartForView,inferOrderServiceMode} from './order-domain.js';\n" +
      "import {commitTableOrder,createInitialDineState,cleanupEmptyDineSessions} from '../dine/dine-domain.js';\n" +
      "import {defaultPrinterState,importExternalPrintJobs} from '../more/print-domain.js';\n" +
      "import {buildCategoryLayout,normalizeCategoryLayout} from './category-layout.js';\n" +
      "import {renderGlobalStatusBar,renderBottomNav} from '../../shared/shell.js';\n" +
      "import {activeDineOrderIdentities,latestOrderDisplayNumber} from '../../shared/order-identity.js';\n" +
      '\n' +
      "const app=document.getElementById('app');\n" +
      'const fallbackCatalog={categories:fallbackCategories,products:fallbackProducts,drinks:fallbackDrinks};\n' +
      'const cachedCatalog=readJSON(MENU_CACHE_KEY,null);\n' +
      'const initialCatalog=cachedCatalog?.products?.length?cachedCatalog:fallbackCatalog;\n' +
      'let categories=[...(initialCatalog.categories||fallbackCategories)],products=[...(initialCatalog.products||fallbackProducts)],drinks=[...(initialCatalog.drinks||fallbackDrinks)];\n' +
      'let productMap=new Map(),drinkMap=new Map(),snackProducts=[],drinkProducts=[];\n' +
      'function indexCatalog(){\n' +
      '  productMap=new Map(products.map(item=>[item.id,item]));\n' +
      '  drinkMap=new Map(drinks.map(item=>[item.id,item]));\n' +
      "  snackProducts=products.filter(item=>item.linkRole==='snack');\n" +
      "  drinkProducts=products.filter(item=>item.linkRole==='drink');\n" +
      '}\n' +
      'indexCatalog();\n' +
      'let modal=null;\n' +
      'const supplyOverrides=readJSON(SUPPLY_STORAGE_KEY,{})||{};\n' +
      "function supplyStatus(product){return supplyOverrides[product.id]?.status||(product.available===false?'soldout':'available');}\n" +
      "function supplyLabel(status){return status==='soldout'?'今日售罄':status==='paused'?'暫停供應':'供應中';}\n" +
      "function sortPausedLast(items){return items.map((item,index)=>({item,index})).sort((a,b)=>Number(supplyStatus(a.item)==='paused')-Number(supplyStatus(b.item)==='paused')||a.index-b.index).map(row=>row.item);}\n" +
      'let confirmState=null;\n' +
      "let newOrderNotice={id:'A516',source:'磨飯 App',items:3,amount:104,visible:true};\n" +
      'const demoPendingOrders={\n' +
      "  online:[{id:'A512',source:'磨飯 App',contact:'陳小姐',phone:'85291234567',items:5,amount:168,wait:'2 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'FPS',proof:'../../assets/products/f4.webp',lines:[['蜜糖雞絲＋鹽酥雞',2,90],['台式奶茶',2,32],['香脆雞翼',1,18]]},{id:'W331',source:'網頁',contact:'梁先生',phone:'85262345678',items:3,amount:62,wait:'1 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'PayMe',proof:'../../assets/products/f1.webp',lines:[['原味紫米飯團',1,41],['味噌湯',1,12],['可樂',1,9]]}],\n" +
      "  queue:[{id:'T1824',source:'電話',contact:'電話尾號 1824',phone:'85261231824',items:2,amount:96,wait:'4 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'待確認',proof:'',lines:[['自選便當',2,96]]},{id:'T6631',source:'WhatsApp',contact:'WhatsApp 尾號 6631',phone:'85261236631',items:1,amount:59,wait:'6 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'FPS',proof:'',lines:[['紫米飯團 A 餐',1,59]]}]\n" +
      '};\n' +
      '\n' +
      'const saved=readJSON(ORDER_STORAGE_KEY,null);\n' +
      'const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});\n' +
      'let drafts=readJSON(DRAFT_STORAGE_KEY,[]);\n' +
      'const expiredDrafts=clearExpiredBusinessDayDrafts(drafts);\n' +
      'if(expiredDrafts.voided.length){drafts=expiredDrafts.remaining;writeJSON(DRAFT_STORAGE_KEY,drafts);}\n' +
      'let draftCounters=readJSON(DRAFT_COUNTER_STORAGE_KEY,{});\n' +
      "const terminalId=normalizeTerminalId(localStorage.getItem(TERMINAL_ID_STORAGE_KEY)||new URLSearchParams(location.search).get('terminal')||'SMT');\n" +
      'localStorage.setItem(TERMINAL_ID_STORAGE_KEY,terminalId);\n' +
      'const settings={\n' +
      '  catalog:{...defaults.catalog,showImages:true,...(savedSettings.catalog||{}),productOverrides:{}},\n' +
      '  categoryLayout:normalizeCategoryLayout(savedSettings.categoryLayout||defaults.categoryLayout),\n' +
      '  cart:{...defaults.cart,...(savedSettings.cart||{}),viewMode:normalizeCartViewMode(savedSettings.cartViewMode||savedSettings.cart?.viewMode)},\n' +
      '  quickDrinks:{...defaults.quickDrinks,...(savedSettings.quickDrinks||{})}\n' +
      '};\n' +
      'function syncDinePrintJobs(dineState){\n' +
      '  const current=readJSON(PRINTER_STORAGE_KEY,null)||defaultPrinterState();\n' +
      '  writeJSON(PRINTER_STORAGE_KEY,importExternalPrintJobs(current,{dine:dineState}));\n' +
      '}\n' +
      '\n' +
      "function drinkSelection(id,sweetness='',ice=''){\n" +
      '  const d=drinkMap.get(id);\n' +
      '  return {drinkId:id,name:d?.name||id,unitPrice:d?.price||0,sweetness,ice,studentDiscountEligible:d?.studentDiscountEligible===true,specialDrinkSurcharge:Number(d?.specialDrinkSurcharge)||0};\n' +
      '}\n' +
      "function makeLine(productId,qty=1,{options={},drinkAssignments=[],linkedComboId='',linkedQty=0,serviceMode=SERVICE_TAKEAWAY}={}){\n" +
      '  const p=productMap.get(productId);\n' +
      '  qty=Math.max(1,Number(qty)||1);\n' +
      '  return {\n' +
      "    lineId:stableId('line'),productId,name:p.name,image:p.image,category:p.category,qty,\n" +
      '    unitPrice:p.price,total:p.price*qty,options:safeClone(options),\n' +
      '    studentDiscountEligible:p.studentDiscountEligible===true,specialDrinkSurcharge:Number(p.specialDrinkSurcharge)||0,\n' +
      '    drinkAssignments:safeClone(drinkAssignments),drinkSlots:(p.drinkSlots||0)*qty,\n' +
      "    required:[...(p.required||[])],combinable:Boolean(p.combinable),linkRole:p.linkRole||'',\n" +
      "    serviceMode:normalizeServiceMode(serviceMode,SERVICE_TAKEAWAY),serviceModeOverride:'',\n" +
      '    linkedComboId,linkedQty,createdOrder:Date.now()+Math.random()\n' +
      '  };\n' +
      '}\n' +
      'function normalizeCart(cart,defaultMode=SERVICE_TAKEAWAY){\n' +
      '  return (Array.isArray(cart)?cart:[]).map((line,index)=>{\n' +
      '    const p=productMap.get(line.productId)||{};\n' +
      '    const qty=Math.max(1,Number(line.qty)||1);\n' +
      '    const unitPrice=Number(line.unitPrice??p.price??0);\n' +
      '    const serviceMode=normalizeServiceMode(line.serviceMode,defaultMode);\n' +
      "    return {...line,lineId:line.lineId||stableId('line'),name:line.name||p.name||'餐點',image:line.image||p.image||'',category:line.category||p.category||'',qty,unitPrice,total:unitPrice*qty,serviceMode,serviceModeOverride:line.serviceModeOverride||'',options:{...(line.options||{})},studentDiscountEligible:line.studentDiscountEligible===true||p.studentDiscountEligible===true,specialDrinkSurcharge:Number(line.specialDrinkSurcharge??p.specialDrinkSurcharge)||0,drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],drinkSlots:Number(line.drinkSlots??(p.drinkSlots||0)*qty),required:Array.isArray(line.required)?line.required:[...(p.required||[])],combinable:Boolean(line.combinable??p.combinable),linkRole:line.linkRole||p.linkRole||'',linkedComboId:line.linkedComboId||'',linkedQty:Number(line.linkedQty||0),createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:index};\n" +
      '  }).sort((a,b)=>a.createdOrder-b.createdOrder);\n' +
      '}\n' +
      "function mergeKey(line){return JSON.stringify({productId:line.productId,serviceMode:line.serviceMode,options:line.options,drinks:line.drinkAssignments.map(d=>[d.drinkId,d.sweetness||'',d.ice||'']),linkedComboId:line.linkedComboId});}\n" +
      'function mergeCart(cart,mode){\n' +
      "  const rows=normalizeCart(cart);if(mode==='never')return rows;\n" +
      '  const out=[];\n' +
      '  rows.forEach(line=>{\n' +
      "    const found=line.lineType==='combo'?null:out.find(item=>item.productId===line.productId&&(mode==='always'||mergeKey(item)===mergeKey(line)));\n" +
      '    if(!found){out.push(safeClone(line));return;}\n' +
      '    found.qty+=line.qty;found.total=found.unitPrice*found.qty;found.drinkSlots+=line.drinkSlots;found.drinkAssignments.push(...safeClone(line.drinkAssignments));\n' +
      '  });\n' +
      '  return out;\n' +
      '}\n' +
      'function describe(line){\n' +
      '  const parts=[];\n' +
      "  if(line.lineType==='combo'){\n" +
      '    const names=(line.combo?.components||[]).map(item=>item.name).filter(Boolean);\n' +
      "    if(names.length)parts.push(names.join('＋'));\n" +
      "    if(line.combo?.discount)parts.push('套餐優惠 -'+money(line.combo.discount));\n" +
      '  }\n' +
      "  Object.entries(line.options||{}).forEach(([key,value])=>{if(value)parts.push(Array.isArray(value)?value.join('、'):value);});\n" +
      '  const grouped={};\n' +
      "  (line.drinkAssignments||[]).forEach(d=>{const key=[d.name,d.sweetness||'',d.ice||''].join('|');grouped[key]=(grouped[key]||0)+1;});\n" +
      "  Object.entries(grouped).forEach(([key,count])=>{const [name,sweet,ice]=key.split('|');const mods=[sweet,ice].filter(Boolean).join(' · ');parts.push(name+(mods?' · '+mods:'')+(count>1?' ×'+count:''));});\n" +
      "  if(line.linkedComboId)parts.push('已組合套餐'+(line.linkedQty>1?' ×'+line.linkedQty:''));\n" +
      '  const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);\n' +
      "  if(missing&&line.required.includes('drink'))parts.push('尚欠飲品 '+missing+' 份');\n" +
      "  return parts.join(' · ')||'標準';\n" +
      '}\n' +
      'function missingGroups(line){\n' +
      '  const groups=[];\n' +
      '  (line.required||[]).forEach(group=>{\n' +
      "    if(group==='drink'){\n" +
      '      const count=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);\n' +
      "      if(count)groups.push({group,label:'飲品',count});\n" +
      "    }else if(!line.options?.[group]) groups.push({group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':'小食',count:line.qty||1});\n" +
      '  });\n' +
      '  return groups;\n' +
      '}\n' +
      'function pendingSummary(cart){\n' +
      '  const out={rice:0,sauce:0,snack:0,drink:0,total:0};\n' +
      '  cart.forEach(line=>missingGroups(line).forEach(item=>{out[item.group]+=item.count;out.total+=item.count;}));\n' +
      '  ret'... 90308 more characters
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';
    import {ORDER_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,SETTINGS_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,DINE_STORAGE_KEY,SUPPLY_STORAGE_KEY,PRINTER_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';
    import {clearExpiredBusinessDayDrafts,createDraftRecord,normalizeTerminalId,restoreDraftForTerminal} from '../../shared/operations.js';
    import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';
    import {orderPageConfig as defaults} from './page-config.js';
    import {categories as fallbackCategories,products as fallbackProducts,drinks as fallbackDrinks,optionSets} from './page-data.js';
    import {loadMenuCatalog,MENU_CACHE_KEY} from './menu-api.js';
    import {acceptPendingOrder,combineRiceballSet,dissolveRiceballSet,completeExpiredOrders,createWhatsAppLink,updateCartLineQuantity,CART_VIEW_INPUT,CART_VIEW_ORGANIZED,SERVICE_TAKEAWAY,SERVICE_DINE_IN,normalizeCartViewMode,normalizeServiceMode,resolveInitialOrderServiceMode,applyOrderServiceMode,toggleLineServiceMode,cartForView,inferOrderServiceMode} from './order-domain.js';
    import {commitTableOrder,createInitialDineState,cleanupEmptyDineSessions} from '../dine/dine-domain.js';
    import {defaultPrinterState,importExternalPrintJobs} from '../more/print-domain.js';
    import {buildCategoryLayout,normalizeCategoryLayout} from './category-layout.js';
    import {renderGlobalStatusBar,renderBottomNav} from '../../shared/shell.js';
    import {activeDineOrderIdentities,latestOrderDisplayNumber} from '../../shared/order-identity.js';
    
    const app=document.getElementById('app');
    const fallbackCatalog={categories:fallbackCategories,products:fallbackProducts,drinks:fallbackDrinks};
    const cachedCatalog=readJSON(MENU_CACHE_KEY,null);
    const initialCatalog=cachedCatalog?.products?.length?cachedCatalog:fallbackCatalog;
    let categories=[...(initialCatalog.categories||fallbackCategories)],products=[...(initialCatalog.products||fallbackProducts)],drinks=[...(initialCatalog.drinks||fallbackDrinks)];
    let productMap=new Map(),drinkMap=new Map(),snackProducts=[],drinkProducts=[];
    function indexCatalog(){
      productMap=new Map(products.map(item=>[item.id,item]));
      drinkMap=new Map(drinks.map(item=>[item.id,item]));
      snackProducts=products.filter(item=>item.linkRole==='snack');
      drinkProducts=products.filter(item=>item.linkRole==='drink');
    }
    indexCatalog();
    let modal=null;
    const supplyOverrides=readJSON(SUPPLY_STORAGE_KEY,{})||{};
    function supplyStatus(product){return supplyOverrides[product.id]?.status||(product.available===false?'soldout':'available');}
    function supplyLabel(status){return status==='soldout'?'今日售罄':status==='paused'?'暫停供應':'供應中';}
    function sortPausedLast(items){return items.map((item,index)=>({item,index})).sort((a,b)=>Number(supplyStatus(a.item)==='paused')-Number(supplyStatus(b.item)==='paused')||a.index-b.index).map(row=>row.item);}
    let confirmState=null;
    let newOrderNotice={id:'A516',source:'磨飯 App',items:3,amount:104,visible:true};
    const demoPendingOrders={
      online:[{id:'A512',source:'磨飯 App',contact:'陳小姐',phone:'85291234567',items:5,amount:168,wait:'2 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'FPS',proof:'../../assets/products/f4.webp',lines:[['蜜糖雞絲＋鹽酥雞',2,90],['台式奶茶',2,32],['香脆雞翼',1,18]]},{id:'W331',source:'網頁',contact:'梁先生',phone:'85262345678',items:3,amount:62,wait:'1 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'PayMe',proof:'../../assets/products/f1.webp',lines:[['原味紫米飯團',1,41],['味噌湯',1,12],['可樂',1,9]]}],
      queue:[{id:'T1824',source:'電話',contact:'電話尾號 1824',phone:'85261231824',items:2,amount:96,wait:'4 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'待確認',proof:'',lines:[['自選便當',2,96]]},{id:'T6631',source:'WhatsApp',contact:'WhatsApp 尾號 6631',phone:'85261236631',items:1,amount:59,wait:'6 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'FPS',proof:'',lines:[['紫米飯團 A 餐',1,59]]}]
    };
    
    const saved=readJSON(ORDER_STORAGE_KEY,null);
    const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});
    let drafts=readJSON(DRAFT_STORAGE_KEY,[]);
    const expiredDrafts=clearExpiredBusinessDayDrafts(drafts);
    if(expiredDrafts.voided.length){drafts=expiredDrafts.remaining;writeJSON(DRAFT_STORAGE_KEY,drafts);}
    let draftCounters=readJSON(DRAFT_COUNTER_STORAGE_KEY,{});
    const terminalId=normalizeTerminalId(localStorage.getItem(TERMINAL_ID_STORAGE_KEY)||new URLSearchParams(location.search).get('terminal')||'SMT');
    localStorage.setItem(TERMINAL_ID_STORAGE_KEY,terminalId);
    const settings={
      catalog:{...defaults.catalog,showImages:true,...(savedSettings.catalog||{}),productOverrides:{}},
      categoryLayout:normalizeCategoryLayout(savedSettings.categoryLayout||defaults.categoryLayout),
      cart:{...defaults.cart,...(savedSettings.cart||{}),viewMode:normalizeCartViewMode(savedSettings.cartViewMode||savedSettings.cart?.viewMode)},
      quickDrinks:{...defaults.quickDrinks,...(savedSettings.quickDrinks||{})}
    };
    function syncDinePrintJobs(dineState){
      const current=readJSON(PRINTER_STORAGE_KEY,null)||defaultPrinterState();
      writeJSON(PRINTER_STORAGE_KEY,importExternalPrintJobs(current,{dine:dineState}));
    }
    
    function drinkSelection(id,sweetness='',ice=''){
      const d=drinkMap.get(id);
      return {drinkId:id,name:d?.name||id,unitPrice:d?.price||0,sweetness,ice,studentDiscountEligible:d?.studentDiscountEligible===true,specialDrinkSurcharge:Number(d?.specialDrinkSurcharge)||0};
    }
    function makeLine(productId,qty=1,{options={},drinkAssignments=[],linkedComboId='',linkedQty=0,serviceMode=SERVICE_TAKEAWAY}={}){
      const p=productMap.get(productId);
      qty=Math.max(1,Number(qty)||1);
      return {
        lineId:stableId('line'),productId,name:p.name,image:p.image,category:p.category,qty,
        unitPrice:p.price,total:p.price*qty,options:safeClone(options),
        studentDiscountEligible:p.studentDiscountEligible===true,specialDrinkSurcharge:Number(p.specialDrinkSurcharge)||0,
        drinkAssignments:safeClone(drinkAssignments),drinkSlots:(p.drinkSlots||0)*qty,
        required:[...(p.required||[])],combinable:Boolean(p.combinable),linkRole:p.linkRole||'',
        serviceMode:normalizeServiceMode(serviceMode,SERVICE_TAKEAWAY),serviceModeOverride:'',
        linkedComboId,linkedQty,createdOrder:Date.now()+Math.random()
      };
    }
    function normalizeCart(cart,defaultMode=SERVICE_TAKEAWAY){
      return (Array.isArray(cart)?cart:[]).map((line,index)=>{
        const p=productMap.get(line.productId)||{};
        const qty=Math.max(1,Number(line.qty)||1);
        const unitPrice=Number(line.unitPrice??p.price??0);
        const serviceMode=normalizeServiceMode(line.serviceMode,defaultMode);
        return {...line,lineId:line.lineId||stableId('line'),name:line.name||p.name||'餐點',image:line.image||p.image||'',category:line.category||p.category||'',qty,unitPrice,total:unitPrice*qty,serviceMode,serviceModeOverride:line.serviceModeOverride||'',options:{...(line.options||{})},studentDiscountEligible:line.studentDiscountEligible===true||p.studentDiscountEligible===true,specialDrinkSurcharge:Number(line.specialDrinkSurcharge??p.specialDrinkSurcharge)||0,drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],drinkSlots:Number(line.drinkSlots??(p.drinkSlots||0)*qty),required:Array.isArray(line.required)?line.required:[...(p.required||[])],combinable:Boolean(line.combinable??p.combinable),linkRole:line.linkRole||p.linkRole||'',linkedComboId:line.linkedComboId||'',linkedQty:Number(line.linkedQty||0),createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:index};
      }).sort((a,b)=>a.createdOrder-b.createdOrder);
    }
    function mergeKey(line){return JSON.stringify({productId:line.productId,serviceMode:line.serviceMode,options:line.options,drinks:line.drinkAssignments.map(d=>[d.drinkId,d.sweetness||'',d.ice||'']),linkedComboId:line.linkedComboId});}
    function mergeCart(cart,mode){
      const rows=normalizeCart(cart);if(mode==='never')return rows;
      const out=[];
      rows.forEach(line=>{
        const found=line.lineType==='combo'?null:out.find(item=>item.productId===line.productId&&(mode==='always'||mergeKey(item)===mergeKey(line)));
        if(!found){out.push(safeClone(line));return;}
        found.qty+=line.qty;found.total=found.unitPrice*found.qty;found.drinkSlots+=line.drinkSlots;found.drinkAssignments.push(...safeClone(line.drinkAssignments));
      });
      return out;
    }
    function describe(line){
      const parts=[];
      if(line.lineType==='combo'){
        const names=(line.combo?.components||[]).map(item=>item.name).filter(Boolean);
        if(names.length)parts.push(names.join('＋'));
        if(line.combo?.discount)parts.push('套餐優惠 -'+money(line.combo.discount));
      }
      Object.entries(line.options||{}).forEach(([key,value])=>{if(value)parts.push(Array.isArray(value)?value.join('、'):value);});
      const grouped={};
      (line.drinkAssignments||[]).forEach(d=>{const key=[d.name,d.sweetness||'',d.ice||''].join('|');grouped[key]=(grouped[key]||0)+1;});
      Object.entries(grouped).forEach(([key,count])=>{const [name,sweet,ice]=key.split('|');const mods=[sweet,ice].filter(Boolean).join(' · ');parts.push(name+(mods?' · '+mods:'')+(count>1?' ×'+count:''));});
      if(line.linkedComboId)parts.push('已組合套餐'+(line.linkedQty>1?' ×'+line.linkedQty:''));
      const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
      if(missing&&line.required.includes('drink'))parts.push('尚欠飲品 '+missing+' 份');
      return parts.join(' · ')||'標準';
    }
    function missingGroups(line){
      const groups=[];
      (line.required||[]).forEach(group=>{
        if(group==='drink'){
          const count=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
          if(count)groups.push({group,label:'飲品',count});
        }else if(!line.options?.[group]) groups.push({group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':'小食',count:line.qty||1});
      });
      return groups;
    }
    function pendingSummary(cart){
      const out={rice:0,sauce:0,snack:0,drink:0,total:0};
      cart.forEach(line=>missingGroups(line).forEach(item=>{out[item.group]+=item.count;out.total+=item.count;}));
      return out;
    }
    function cartTotal(cart){return cart.reduce((sum,line)=>sum+Number(line.total||0),0);}
    function linkUpSummary(cart){
      const available=cart.filter(line=>line.lineType!=='combo'&&!line.linkedComboId);
      const riceballs=available.filter(line=>line.combinable).reduce((n,line)=>n+line.qty,0);
      const snacks=available.filter(line=>line.linkRole==='snack').reduce((n,line)=>n+line.qty,0);
      const standaloneDrinks=available.filter(line=>line.linkRole==='drink').reduce((n,line)=>n+line.qty,0);
      return {riceballs,snacks,drinks:standaloneDrinks,count:Math.min(riceballs,snacks)};
    }
    function applyLinkUp(count){
      if(!count)return;
      store.set(state=>{
        let next=state.cart;
        for(let index=0;index<count;index++){
          const main=next.find(line=>line.lineType!=='combo'&&line.combinable),snack=next.find(line=>line.lineType!=='combo'&&line.linkRole==='snack'),drink=next.find(line=>line.lineType!=='combo'&&line.linkRole==='drink');
          if(!main||!snack)break;
          next=combineRiceballSet(next,{mainLineId:main.lineId,snackLineId:snack.lineId,drinkLineId:drink?.lineId},{comboId:stableId('combo'),lineId:stableId('line'),comboPrice:59,source:'automatic'});
        }
        state.cart=normalizeCart(next,state.orderServiceMode);
        state.lastAffectedLineId=state.cart.at(-1)?.lineId||'';
        state.lastMutationKind='changed';
        return state;
      });
      queue.afterRender(()=>showToast('已組合 '+count+' 份飯團套餐'));
    }
    
    let initialCart=saved&&Array.isArray(saved.cart)?saved.cart:[];
    let initialDineContext=saved?.dineContext||null;
    if(initialDineContext){
      const dine=cleanupEmptyDineSessions(readJSON(DINE_STORAGE_KEY,null)||createInitialDineState());
      writeJSON(DINE_STORAGE_KEY,dine);
      const table=dine.tables.find(entry=>entry.id===String(initialDineContext.tableId));
      const stale=!table||(initialDineContext.sessionId&&table.session?.id!==initialDineContext.sessionId)||(!initialDineContext.sessionId&&!initialDineContext.startedFromFree&&table.status==='free');
      if(stale){initialDineContext=null;initialCart=[];}
    }
    const initialOrderServiceMode=resolveInitialOrderServiceMode(initialDineContext,initialCart.length?saved?.orderServiceMode:SERVICE_TAKEAWAY);
    initialCart=normalizeCart(initialCart,initialOrderServiceMode);
    const defaultHealth={catalog:{ok:false,label:'餐牌',detail:'正在連接'},api:{ok:false,label:'訂單 API',detail:'未連接'},printer:{ok:false,label:'打印機',detail:'未連接'},sync:{ok:false,label:'同步',detail:'等待 API'},backup:{ok:true,label:'備份',detail:'本機資料正常'}};
    const store=createStore({category:'全部',searchQuery:'',cart:initialCart,dineContext:initialDineContext,orderServiceMode:initialOrderServiceMode,cartViewMode:savedSettings.cartViewMode||settings.cart.viewMode||CART_VIEW_INPUT,lastAffectedLineId:'',lastMutationKind:'',collapsedCartCategories:[],settings,quickMode:saved?.quickMode??savedSettings.morePage?.quickMode??false,quickDrawerOpen:false,pendingOrders:safeClone(demoPendingOrders),runningOrders:[],completedOrders:[],operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false},health:defaultHealth},{storageKey:ORDER_STORAGE_KEY,persistState:state=>({cart:state.cart,dineContext:state.dineContext,orderServiceMode:state.orderServiceMode,cartViewMode:state.cartViewMode,quickMode:state.quickMode,draftSession:state.draftSession,pendingOrders:state.pendingOrders,runningOrders:state.runningOrders,completedOrders:state.completedOrders,operations:state.operations,settings:state.settings}),normalize:state=>({...state,searchQuery:String(state.searchQuery||''),dineContext:state.dineContext||null,orderServiceMode:normalizeServiceMode(state.dineContext?SERVICE_DINE_IN:state.orderServiceMode,SERVICE_TAKEAWAY),cartViewMode:normalizeCartViewMode(state.cartViewMode||settings.cart.viewMode),lastAffectedLineId:String(state.lastAffectedLineId||''),lastMutationKind:String(state.lastMutationKind||''),collapsedCartCategories:Array.isArray(state.collapsedCartCategories)?state.collapsedCartCategories:[],quickMode:Boolean(state.quickMode),quickDrawerOpen:Boolean(state.quickDrawerOpen),cart:normalizeCart(state.cart||[],state.dineContext?SERVICE_DINE_IN:state.orderServiceMode),pendingOrders:state.pendingOrders||safeClone(demoPendingOrders),runningOrders:Array.isArray(state.runningOrders)?state.runningOrders:[],completedOrders:Array.isArray(state.completedOrders)?state.completedOrders:[],settings:{...settings,...(state.settings||{}),categoryLayout:normalizeCategoryLayout(state.settings?.categoryLayout||settings.categoryLayout),catalog:{...settings.catalog,...(state.settings?.catalog||{})},cart:{...settings.cart,...(state.settings?.cart||{})},quickDrinks:{...settings.quickDrinks,...(state.settings?.quickDrinks||{})}},operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false,...(state.operations||{})},health:{...defaultHealth,...(state.health||{})}})});
    const QUICK_DRAWER_IDLE_MS=8000;
    let quickDrawerTimer=null;
    let recentTimer=null;
    let drinkFeedbackTimer=null;
    let pendingDrinkAssignment=null;
    let lastDrinkAssignment=null;
    let cartScrollTop=0;
    function scheduleQuickDrawerClose(){
      clearTimeout(quickDrawerTimer);
      if(!store.get().quickDrawerOpen)return;
      quickDrawerTimer=setTimeout(()=>store.setTransient(state=>({...state,quickDrawerOpen:false})),QUICK_DRAWER_IDLE_MS);
    }
    const queue=createRenderQueue(render);store.subscribe(state=>{queue.schedule();if(state.quickDrawerOpen)scheduleQuickDrawerClose();else clearTimeout(quickDrawerTimer);});
    installErrorBoundary({toast:showToast,report:error=>window.parent?.postMessage?.({type:'morefun:page-runtime-error',page:'order',message:String(error?.message||error)},'*')});
    
    function updateSettings(mutator){
      store.set(state=>{mutator(state.settings);writeJSON(SETTINGS_STORAGE_KEY,{...savedSettings,...state.settings,cartViewMode:state.cartViewMode});return state;});
    }
    function saveCartViewMode(mode){
      const cartViewMode=normalizeCartViewMode(mode);
      store.set(state=>({...state,cartViewMode,settings:{...state.settings,cart:{...state.settings.cart,viewMode:cartViewMode}}}));
      const persisted=readJSON(SETTINGS_STORAGE_KEY,{})||{};
      writeJSON(SETTINGS_STORAGE_KEY,{...persisted,cartViewMode,cart:{...(persisted.cart||{}),viewMode:cartViewMode}});
    }
    function orderedDrinks(){
      const configured=store.get().settings.quickDrinks.order||[];
      return [...configured,...drinks.map(item=>item.id).filter(id=>!configured.includes(id))].map(id=>drinkMap.get(id)).filter(Boolean);
    }
    function productTemplate(){return store.get().settings.catalog.defaultTemplate;}
    function drinkChoiceCard(d,action='select-drink',selected=false,context='default'){
      const imageMode=store.get().settings.quickDrinks.showImages!==false;
      return '<button class="drink-choice-card drink-card--'+context+' '+(imageMode?'is-image':'is-text')+' '+(selected?'selected':'')+'" data-action="'+action+'" data-id="'+d.id+'"><span>'+escapeHtml(d.name)+'</span>'+(imageMode?imageBlock(d.image,d.name,'drink-choice-img'):'')+'</button>';
    }
    function productCard(p){
      const template=productTemplate();const showCode=store.get().settings.catalog.showCode;const showDescription=store.get().settings.catalog.showDescription;
      const showProductImages=store.get().settings.catalog.showImages!==false;
      const action=store.get().quickMode?'quick-add-product':'open-product';
      const status=supplyStatus(p),unavailable=status!=='available',statusClass=status==='soldout'?'sold-out':status==='paused'?'paused':'';
      const code=showCode?'<small class="product-code">'+p.code+'</small>':'';
      const state=unavailable?'<em class="product-supply-state">'+supplyLabel(status)+'</em>':'';
      if(template==='text')return '<button class="product-card text '+statusClass+'" data-action="'+action+'" data-id="'+p.id+'" '+(unavailable?'disabled':'')+'><span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+state+'</span><b class="product-price">'+money(p.price)+'</b></button>';
      if(template==='small')return '<button class="product-card small '+statusClass+' '+(showProductImages?'':'no-product-image')+'" data-action="'+action+'" data-id="'+p.id+'" '+(unavailable?'disabled':'')+'>'+(showProductImages?imageBlock(p.image,p.name,'product-thumb'):'')+'<span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+state+'</span><b class="product-price">'+money(p.price)+'</b></button>';
      const description=showDescription&&p.description?'<p class="product-description">'+p.description+'</p>':'';
      return '<button class="product-card large '+statusClass+' '+(showProductImages?'':'no-product-image')+'" data-action="'+action+'" data-id="'+p.id+'" '+(unavailable?'disabled':'')+'>'+(showProductImages?imageBlock(p.image,p.name,'product-hero'):'')+'<div class="product-info"><span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+description+state+'</span><b class="product-price">'+money(p.price)+'</b></div></button>';
    }
    function cartLineRow(line,index,state){
      const showImages=state.settings.cart.showImages!==false;
      const recent=line.lineId===state.lastAffectedLineId;
      const override=Boolean(line.serviceModeOverride);
      const modeLabel=line.serviceMode===SERVICE_DINE_IN?'堂':'外';
      return '<article class="cart-row '+(showImages?'':'no-image')+' '+(recent?'is-recent':'')+'" data-line-id="'+escapeHtml(line.lineId)+'"><span class="seq-service"><span class="seq">'+(index+1)+'</span><button class="line-service-toggle '+(override?'is-override':'')+'" data-action="toggle-line-service" data-id="'+escapeHtml(line.lineId)+'" aria-label="切換'+escapeHtml(line.name)+'堂食外賣">'+modeLabel+'</button></span>'+(showImages?imageBlock(line.image,line.name,'cart-img'):'')+'<span class="cart-copy"><strong>'+escapeHtml(line.name)+'</strong><small>'+escapeHtml(describe(line))+'</small>'+(recent?'<em class="recent-badge">剛加入</em>':'')+'</span><b class="cart-price">'+money(line.total)+'</b><span class="cart-actions"><button data-action="cart-qty" data-id="'+line.lineId+'" data-delta="-1">−</button><strong>'+line.qty+'</strong><button data-action="cart-qty" data-id="'+line.lineId+'" data-delta="1">＋</button><button class="edit-button" data-action="edit-line" data-id="'+line.lineId+'">修改</button></span></article>';
    }
    function cartRows(){
      const state=store.get(),cart=cartForView(state.cart,state.cartViewMode);if(!cart.length)return '<div class="empty">購物車未有餐點</div>';
      if(state.cartViewMode===CART_VIEW_INPUT)return cart.map((line,index)=>cartLineRow(line,index,state)).join('');
      const grouped=new Map();cart.forEach(line=>{const category=line.category||productMap.get(line.productId)?.category||'其他';if(!grouped.has(category))grouped.set(category,[]);grouped.get(category).push(line);});
      let viewIndex=0;
      return [...grouped].map(([category,rows])=>{
        const collapsed=state.collapsedCartCategories.includes(category);
        const body=collapsed?'':rows.map(line=>cartLineRow(line,viewIndex++,state)).join('');
        if(collapsed)viewIndex+=rows.length;
        return '<section class="cart-category" data-category="'+escapeHtml(category)+'"><header><button class="cart-category-toggle" data-action="toggle-cart-category" data-value="'+escapeHtml(category)+'"><span>'+(collapsed?'▸':'▾')+'</span><strong>'+escapeHtml(category)+'</strong></button><span>'+rows.reduce((n,line)=>n+line.qty,0)+' 件</span></header>'+body+'</section>';
      }).join('');
    }
    function cartSummary(state){
      if(state.cartViewMode!==CART_VIEW_ORGANIZED||!state.cart.length)return '';
      const counts=new Map();cartForView(state.cart,CART_VIEW_ORGANIZED).forEach(line=>{const category=line.category||'其他';counts.set(category,(counts.get(category)||0)+Number(line.qty||0));});
      return '<div class="cart-summary-strip">'+[...counts].map(([category,count])=>'<span>'+escapeHtml(category)+' <b>'+count+'</b></span>').join('<span>｜</span>')+'</div>';
    }
    function findDrinkTarget(cart){return (cart||[]).find(line=>Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length)>0)||null;}
    function pendingArea(){
      const state=store.get();const required=pendingSummary(state.cart);const link=linkUpSummary(state.cart);
      return '<section class="pending-area '+(!required.total?'complete':'')+'"><button class="pending-receipt" data-action="open-completion"><strong>必選補齊</strong><span>'+(required.total?'尚欠 '+required.total+' 項':'全部完成')+'</span><b>整理</b></button><button data-action="linkup-all" data-count="'+link.count+'" '+(link.count?'':'disabled')+'>一鍵自動組合 '+link.count+'</button><button data-action="open-specified-link">指定配對</button></section>';
    }
    function quickDrinks(){
      const state=store.get();if(state.settings.quickDrinks.visible===false)return '';
      const order=orderedDrinks(),missing=pendingSummary(state.cart).drink,target=findDrinkTarget(state.cart);
      const context=(target||lastDrinkAssignment)?'<div class="quick-drink-context">'+(target?'<strong>正在補：'+escapeHtml(target.name)+'</strong>':'')+(lastDrinkAssignment?'<em>已配對：'+escapeHtml(lastDrinkAssignment.drink)+' → '+escapeHtml(lastDrinkAssignment.target)+'</em>':'')+'</div>':'';
      return '<section class="quick-drawer '+(state.quickDrawerOpen?'open':'')+'"><button class="quick-drawer-handle" data-action="toggle-quick-drawer"><span>快捷飲品</span><em>待補 '+missing+'</em><b>'+(state.quickDrawerOpen?'⌄':'⌃')+'</b></button>'+(state.quickDrawerOpen?'<div class="quick-drawer-panel"><header><strong>快捷飲品｜待補 '+missing+'</strong><button data-action="toggle-quick-drawer">×</button></header>'+context+'<div>'+order.filter(d=>d.available!==false).map(d=>drinkChoiceCard(d,'quick-drink',modal?.type==='drink'&&modal.drinkId===d.id,'drawer')).join('')+'</div></div>':'')+'</section>';
    }
    function operationLabel(state){if(state.operations.immediateStopped||!state.operations.acceptingOrders)return '已停止接單';if(state.operations.scheduledClose)return '接單至 '+state.operations.scheduledClose;return '接單中';}
    function healthIssueCount(state){return Object.values(state.health).filter(item=>!item.ok).length;}
    function pendingOrderCount(state){return Object.values(state.pendingOrders||{}).flat().length;}
    function topbar(){
      const state=store.get();const issues=healthIssueCount(state),pendingCount=pendingOrderCount(state),soldout=products.filter(item=>supplyStatus(item)!=='available').length;
      return renderGlobalStatusBar({terminalId,operationLabel:operationLabel(state),operationTone:state.operations.acceptingOrders&&!state.operations.immediateStopped?'online':'offline',lastOrder:latestOrderDisplayNumber([...readJSON(ORDER_HISTORY_STORAGE_KEY,[]),...activeDineOrderIdentities(readJSON(DINE_STORAGE_KEY,null))]),context:state.dineContext?'堂食｜'+state.dineContext.tableId+' 號枱':'',rightActions:'<button class="top-btn" data-action="toggle-pending-panel">待處理 <span class="badge">'+pendingCount+'</span></button><button class="top-btn" data-action="open-soldout">售罄 '+soldout+'</button><button class="top-btn quick-state '+(state.quickMode?'is-on':'is-off')+'" data-action="open-quick-settings">快捷 '+(state.quickMode?'ON':'OFF')+'</button><button class="top-btn health-button '+(issues?'has-error':'is-ok')+'" data-action="open-health"><span>'+(issues?'!':'✓')+'</span>'+(issues?'設備 '+issues:'設備正常')+'</button><button class="top-btn" data-action="open-settings">顯示設定</button>'});
    }
    function draftRows(selectedId=''){
      return drafts.map(d=>'<button class="draft-pick '+(selectedId===d.id?'selected':'')+'" data-action="select-draft" data-id="'+escapeHtml(d.id)+'"><strong>'+escapeHtml(d.draftNumber)+'</strong><small>'+new Date(d.createdAt).toLocaleTimeString('zh-HK',{hour:'2-digit',minute:'2-digit'})+'｜'+d.cart.reduce((n,l)=>n+Number(l.qty||0),0)+' 件｜'+money(cartTotal(d.cart))+'</small></button>').join('')||'<p class="receipt-empty">目前沒有暫存單</p>';
    }
    function tableGrid(){
      const dine=readJSON(DINE_STORAGE_KEY,null)||createInitialDineState(),tables=dine.tables;
      return tables.map(table=>{const minutes=table.status==='occupied'&&table.openedAt?Math.floor((Date.now()-table.openedAt)/60000):0;return '<button class="table-pick '+(table.status==='occupied'?'occupied':'free')+'" data-action="assign-table" data-id="'+escapeHtml(table.id)+'"><strong>'+(table.id==='戶外'?'戶外枱':table.id+' 號枱')+'</strong><small>'+(table.status==='occupied'?'使用中 '+minutes+' 分鐘':'未使用｜自動開枱')+'</small></button>';}).join('')||'<p class="receipt-empty">堂食枱資料未建立</p>';
    }
    function hangModal(){return '<aside class="modal-card order-transfer-card"><header><div><small>目前購物車 '+store.get().cart.reduce((n,l)=>n+l.qty,0)+' 件</small><strong>掛單／加入堂食</strong></div><button data-action="dismiss-modal">×</button></header><div class="transfer-grid"><section><h3>一般掛單</h3><div class="transfer-scroll">'+draftRows()+'</div><button class="save-draft-entry" data-action="add-draft">＋ 加入掛單</button></section><section><h3>堂食枱位｜九宮格</h3><p>撳枱號會立即正式落單、出製作單及所需標籤。</p><div class="table-pick-grid">'+tableGrid()+'</div></section></div><footer><button data-action="dismiss-modal">返回</button></footer></aside>';}
    function takeModal(){
      const selectedDraftId=modal.selectedDraftId||'';
      const selected=drafts.find(d=>d.id===selectedDraftId);
      const detail=selected?'<div class="draft-detail-head"><span><small>暫存編號</small><strong>'+escapeHtml(selected.draftNumber)+'</strong></span><span><small>建立時間</small><strong>'+new Date(selected.createdAt).toLocaleTimeString('zh-HK',{hour:'2-digit',minute:'2-digit'})+'</strong></span><span><small>合計</small><strong>'+money(cartTotal(selected.cart))+'</strong></span></div><div class="draft-detail-lines">'+selected.cart.map((line,index)=>'<article><b>'+(index+1)+'</b><span><strong>'+escapeHtml(line.name)+' ×'+line.qty+'</strong><small>'+escapeHtml(describe(line))+'</small></span><em>'+money(line.total)+'</em></article>').join('')+'</div>':'<div class="draft-empty-detail"><b>請選擇左邊暫存單</b><p>右邊會顯示完整餐點內容，確認後先取回。</p></div>';
      return '<aside class="modal-card order-transfer-card take-card"><header><div><small>目前終端 '+terminalId+'</small><strong>取單</strong></div><button data-action="dismiss-modal">×</button></header><div class="transfer-grid"><section><h3>暫存單列表</h3><div class="transfer-scroll">'+draftRows(selectedDraftId)+'</div></section><section><h3>暫存單內容</h3>'+detail+'</section></div><footer><button data-action="dismiss-modal">返回</button><span></span><button class="danger" data-action="void-draft" '+(selected?'':'disabled')+'>作廢</button><button class="primary" data-action="restore-draft" data-id="'+escapeHtml(selected?.id||'')+'" '+(selected?'':'disabled')+'>取單</button></footer></aside>';
    }
    function pendingPanel(){
      const pendingOrders=store.get().pendingOrders;
      const rows=list=>list.map(x=>'<button data-action="process-pending-order" data-id="'+x.id+'"><span><strong>'+x.id+' · '+x.source+'</strong><small>'+x.contact+'</small></span><b>'+x.items+' 件 · '+money(x.amount)+'</b><small>等待 '+x.wait+' · 按下處理</small></button>').join('');
      return '<aside class="pending-panel modal-card"><header><strong>待處理</strong><button data-action="dismiss-modal">×</button></header><div class="pending-split"><section><h3>磨飯 App／網頁訂單</h3><div class="pending-scroll">'+rows(pendingOrders.online)+'</div></section><section><h3>電話／WhatsApp 排隊單</h3><div class="pending-scroll">'+rows(pendingOrders.queue)+'</div></section></div><footer class="single-action"><button data-action="dismiss-modal">返回</button></footer></aside>';
    }
    function pendingDetailModal(){
      const x=modal.order;
      return '<aside class="pending-panel modal-card"><header><div><small>'+x.source+'</small><strong>'+x.id+' · '+x.contact+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="pending-order-detail"><span>產品數量 <b>'+x.items+' 件</b></span><span>訂單金額 <b>'+money(x.amount)+'</b></span><span>等候時間 <b>'+x.wait+'</b></span><span>付款狀態 <b>'+x.paymentStatus+'</b></span><p>開始核對後會顯示完整產品、金額及付款證明；此時仍未正式接單。</p></div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="start-pending-review">開始核對</button></footer></aside>';
    }
    function pendingReviewModal(){
      const x=modal.order;const whatsapp=createWhatsAppLink(x.phone,(x.contact||'客人')+'，你好。磨飯訂單 '+x.id+' 正在核對中，請回覆或補充付款證明，謝謝。');
      const lines=(x.lines||[]).map(line=>'<div><span>'+escapeHtml(line[0])+' ×'+line[1]+'</span><b>'+money(line[2])+'</b></div>').join('');
      const proof=x.proof?'<button class="payment-proof" data-action="enlarge-proof">'+imageBlock(x.proof,'付款證明','payment-proof-image')+'<span>按下放大付款證明</span></button>':'<div class="payment-proof empty"><strong>尚未收到付款證明</strong><span>請用右方 WhatsApp QR Code 聯絡客人</span></div>';
      return '<aside class="pending-review-card modal-card"><header><div><small>'+x.source+' · 訂單核對</small><strong>'+x.id+' · '+x.contact+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="pending-review-body"><section class="review-order"><div class="review-summary"><span>產品 <b>'+x.items+' 件</b></span><span>總額 <b>'+money(x.amount)+'</b></span><span>付款 <b>'+x.paymentMethod+'</b></span></div><div class="review-lines">'+lines+'</div><div class="payment-status"><span>付款狀態</span><strong>'+x.paymentStatus+'</strong></div>'+proof+'</section><aside class="whatsapp-qr"><strong>WhatsApp QR Code</strong><p>公司電話掃描後，直接開啟客人對話及預設訊息。</p><div class="qr-code" data-qr="'+escapeHtml(whatsapp)+'"></div><a href="'+escapeHtml(whatsapp)+'" target="_blank" rel="noopener">在此裝置開啟 WhatsApp</a></aside></div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button data-action="report-payment-issue">資料有問題</button><button class="primary" data-action="accept-pending-order" '+(x.proof?'':'disabled')+'>確認接單</button></footer></aside>';
    }
    function enlargedProofModal(){const x=modal.order;return '<aside class="proof-lightbox modal-card"><header><strong>'+x.id+' · 付款證明</strong><button data-action="back-to-pending-review">×</button></header>'+imageBlock(x.proof,'付款證明放大圖','proof-full')+'<footer class="right-action"><button data-action="back-to-pending-review">返回核對</button></footer></aside>';}
    function modalScrim(){return modal?'<div class="modal-scrim" aria-hidden="true"></div>':'';}
    function quickSettingsModal(){
      const state=store.get();const q=state.settings.quickDrinks;
      const order=orderedDrinks();
      return '<aside class="side-card modal-card quick-mode-card"><header><strong>快捷模式</strong><button data-action="dismiss-modal">×</button></header><div class="card-scroll"><div class="setting-block"><strong>點單模式</strong><div class="segmented"><button class="'+(!state.quickMode?'active':'')+'" data-action="set-order-mode" data-value="normal">普通模式</button><button class="'+(state.quickMode?'active':'')+'" data-action="set-order-mode" data-value="quick">快捷模式</button></div><small>快捷模式：點產品直接加入購物籃</small></div><div class="setting-row"><div><strong>快捷飲品抽屜</strong><small>平時收起，按下向上展開</small></div><button class="switch '+(q.visible!==false?'on':'')+'" data-action="toggle-quick-drink-strip"><i></i></button></div><div class="setting-block"><strong>飲品卡顯示</strong><div class="segmented"><button class="'+(q.showImages!==false?'active':'')+'" data-action="quick-display" data-value="image">圖片</button><button class="'+(q.showImages===false?'active':'')+'" data-action="quick-display" data-value="text">純文字</button></div></div><div class="setting-block"><strong>飲品排列</strong><div class="quick-order-list">'+order.map((d,index)=>'<div><span><b>'+(index+1)+'</b>'+escapeHtml(d.name)+'</span><span><button data-action="move-quick-drink" data-id="'+d.id+'" data-delta="-1" '+(!index?'disabled':'')+'>↑</button><button data-action="move-quick-drink" data-id="'+d.id+'" data-delta="1" '+(index===order.length-1?'disabled':'')+'>↓</button></span></div>').join('')+'</div></div><div class="setting-row"><div><strong>快捷補選</strong><small>只控制待補飲品快捷套用</small></div><button class="switch '+(q.quickAssist!==false?'on':'')+'" data-action="toggle-quick-assist"><i></i></button></div></div></aside>';
    }
    function settingsModal(){
      const state=store.get();const c=state.settings.catalog,w=Number(state.settings.cart.widthPercent||32);
      return '<aside class="side-card modal-card"><header><strong>顯示設定</strong><button data-action="dismiss-modal">×</button></header><div class="setting-block"><strong>購物籃比例</strong><div class="segmented three">'+[25,30,32].map(x=>'<button data-action="cart-width" data-value="'+x+'" class="'+(w===x?'active':'')+'">'+x+' / '+(100-x)+'</button>').join('')+'</div></div><div class="setting-row"><div><strong>顯示購物車產品圖片</strong><small>關閉後保留名稱、描述、價格與操作</small></div><button class="switch '+(state.settings.cart.showImages!==false?'on':'')+'" data-action="toggle-cart-images"><i></i></button></div><div class="setting-block"><strong>產品卡</strong><div class="segmented three"><button data-action="setting-card" data-value="large" class="'+(c.defaultTemplate==='large'?'active':'')+'">大圖</button><button data-action="setting-card" data-value="small" class="'+(c.defaultTemplate==='small'?'active':'')+'">小圖</button><button data-action="setting-card" data-value="text" class="'+(c.defaultTemplate==='text'?'active':'')+'">純文字</button></div></div><div class="setting-row"><div><strong>顯示產品 Code</strong><small>例如 F4、B1、S1</small></div><button class="switch '+(c.showCode?'on':'')+'" data-action="toggle-code"><i></i></button></div></aside>';
    }
    function healthModal(){const state=store.get();return '<aside class="side-card modal-card"><header><strong>系統狀態</strong><button data-action="dismiss-modal">×</button></header><div class="health-list">'+Object.values(state.health).map(item=>'<div class="health-row '+(item.ok?'ok':'bad')+'"><span>'+(item.ok?'✓':'!')+'</span><div><strong>'+item.label+'</strong><small>'+item.detail+'</small></div><b>'+(item.ok?'正常':'異常')+'</b></div>').join('')+'</div></aside>';}
    function statusModal(){
      const state=store.get(),ops=state.operations;
      return '<aside class="side-card modal-card"><header><strong>今日接單狀態</strong><button data-action="dismiss-modal">×</button></header><div class="setting-row"><div><strong>接受網絡／預約訂單</strong><small>'+operationLabel(state)+'</small></div><button class="switch '+(ops.acceptingOrders&&!ops.immediateStopped?'on':'')+'" data-action="toggle-accepting"><i></i></button></div><div class="setting-block"><label>今日停止接單時間</label><div class="time-row"><input id="scheduled-close" type="time" value="'+(ops.scheduledClose||'')+'"><button data-action="save-close-time">儲存</button></div></div><div class="setting-block"><button class="danger wide" data-action="immediate-stop">即時停止接單</button><button class="wide" data-action="resume-orders">恢復接單</button></div></aside>';
    }
    function soldoutModal(){
      const items=products.filter(item=>supplyStatus(item)!=='available');
      return '<aside class="side-card modal-card soldout-preview"><header><strong>售罄列表</strong><button data-action="dismiss-modal">×</button></header><div class="status-list">'+(items.length?items.map(item=>{const status=supplyStatus(item);return '<div class="'+status+'"><span><b>'+escapeHtml([item.code,item.name].filter(Boolean).join(' '))+'</b><small>'+escapeHtml(item.category||'未分類')+'</small></span><em>'+supplyLabel(supplyStatus(item))+'</em></div>';}).join(''):'<div><span><b>目前全部供應中</b><small>售罄管理頁更新後會即時顯示</small></span></div>')+'</div><footer class="right-action"><button data-action="dismiss-modal">返回</button></footer></aside>';
    }
    function pairingGroupCount(cart){
      const available=cart.filter(line=>line.lineType!=='combo'&&!line.linkedComboId),mains=available.filter(line=>line.combinable).reduce((n,line)=>n+line.qty,0),snacks=available.filter(line=>line.linkRole==='snack').reduce((n,line)=>n+line.qty,0);
      return Math.min(26,mains,snacks);
    }
    function specifiedLinkModal(){
      const available=store.get().cart.filter(line=>line.lineType!=='combo'&&!line.linkedComboId),groups=modal.draft.groups,active=Math.min(modal.draft.active,groups.length-1),current=groups[active]||{main:'',snack:'',drink:''};
      const roles=[['main','飯團／主餐',line=>line.combinable],['snack','小食',line=>line.linkRole==='snack']];
      const selectedCount=(lineId,role)=>groups.reduce((n,group)=>n+(group[role]===lineId?1:0),0),ready=groups.filter(group=>group.main&&group.snack).length;
      const cartDrinks=available.filter(line=>line.linkRole==='drink');
      const drinkCards='<section><strong>3. 飲品 <small>可稍後補選</small></strong><div class="link-candidates drink-link-candidates">'+drinks.map(d=>'<button data-action="select-link-drink" data-source="quick" data-id="quick:'+d.id+'" class="'+(current.drink==='quick:'+d.id?'selected':'')+'"><span>'+escapeHtml(d.name)+'</span><small>快捷飲品</small></button>').join('')+cartDrinks.map(line=>{const used=selectedCount(line.lineId,'drink'),selected=current.drink===line.lineId,full=used>=line.qty&&!selected;return '<button data-action="select-link-drink" data-source="cart" data-id="'+line.lineId+'" class="'+(selected?'selected':'')+'" '+(full?'disabled':'')+'><span>'+escapeHtml(line.name)+'</span><small>購物車 '+Math.max(0,line.qty-used+(selected?1:0))+'／'+line.qty+'</small></button>';}).join('')+'</div></section>';
      return '<aside class="side-card modal-card specified-link-card"><header><div><small>動態指定配對</small><strong>建立 '+groups.length+' 組套餐</strong></div><button data-action="dismiss-modal">×</button></header><div class="pairing-group-tabs">'+groups.map((group,index)=>{const ok=group.main&&group.snack;return '<button data-action="select-pairing-group" data-index="'+index+'" class="'+(index===active?'active ':'')+(ok?'complete':'')+'"><b>'+String.fromCharCode(65+index)+'</b><small>'+(ok?(group.drink?'完成':'欠飲品'):'待選')+'</small></button>';}).join('')+'</div><div class="card-scroll pairing-body"><p>選擇 '+String.fromCharCode(65+active)+' 組主餐及小食即可建立套餐；飲品可直接用快捷飲品或稍後補選。</p>'+roles.map(([role,label,filter],index)=>'<section><strong>'+(index+1)+'. '+label+'</strong><div class="link-candidates">'+available.filter(filter).map(line=>{const used=selectedCount(line.lineId,role),selected=current[role]===line.lineId,full=used>=line.qty&&!selected;return '<button data-action="select-link-item" data-role="'+role+'" data-id="'+line.lineId+'" class="'+(selected?'selected':'')+'" '+(full?'disabled':'')+'><span>'+escapeHtml(line.name)+'</span><small>可用 '+Math.max(0,line.qty-used+(selected?1:0))+'／'+line.qty+'</small></button>';}).join('')+'</div></section>').join('')+drinkCards+'</div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-specified-link" '+(ready?'':'disabled')+'>確認組合 '+ready+' 組</button></footer></aside>';
    }
    function comboEditorModal(){
      const line=store.get().cart.find(item=>item.lineId===modal.lineId),draft=modal.draft;
      if(!line)return '';
      const components=draft.components||[],selected=role=>components.find(item=>item.role===role);
      const withCurrent=(items,role)=>{const current=selected(role);return current&&!items.some(item=>item.id===current.productId)?[{id:current.productId,name:current.name,image:current.image,price:current.unitPrice},...items]:items;};
      const candidates={main:withCurrent(products.filter(item=>item.combinable),'main'),snack:withCurrent(snackProducts,'snack'),drink:withCurrent(drinks,'drink')};
      const roleCard=(role,label,index)=>'<section class="combo-role"><header><strong>'+index+'. '+label+'</strong>'+(role==='drink'?'<button data-action="clear-combo-component">稍後補選</button>':'')+'</header><div class="combo-candidates">'+candidates[role].map(item=>{const id=item.id,active=selected(role)?.productId===id;return '<button data-action="select-combo-component" data-role="'+role+'" data-id="'+id+'" class="'+(active?'selected':'')+'"><span>'+escapeHtml(item.name)+'</span><small>'+money(item.price||0)+'</small></button>';}).join('')+'</div></section>';
      const missing=!selected('drink');
      return '<aside class="product-settings-card modal-card combo-editor-card"><header class="settings-product-head"><div><small>修改套餐</small><h2>'+escapeHtml(line.name)+'</h2><strong>'+money(line.total)+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="product-settings-body card-scroll"><p class="combo-help">飯團、小食及飲品會以一張套餐顯示；飲品可以稍後由快捷飲品補選。</p>'+roleCard('main','飯團／主餐',1)+roleCard('snack','小食',2)+roleCard('drink','飲品',3)+'</div><footer class="product-settings-actions combo-actions"><button class="danger" data-action="request-dissolve-combo">拆開套餐</button><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-combo-edit">確認修改</button></footer>'+(missing?'<p class="missing-hint">尚欠：飲品 1 份</p>':'')+'</aside>';
    }
    function requiredGroupLabel(group){return {rice:'飯底',sauce:'醬汁',snack:'小食',drink:'飲品'}[group]||'必選';}
    function requiredTargets(cart,group){
      const targets=[];
      (cart||[]).forEach((line,lineIndex)=>{
        if(!(line.required||[]).includes(group))return;
        if(group==='drink'){
          const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
          for(let unitIndex=0;unitIndex<missing;unitIndex++)targets.push({id:line.lineId+':drink:'+unitIndex,lineId:line.lineId,lineIndex,unitIndex,name:line.name,qty:line.qty});
          return;
        }
        if(line.options?.[group])return;
        for(let unitIndex=0;unitIndex<Math.max(1,Number(line.qty||1));unitIndex++)targets.push({id:line.lineId+':'+group+':'+unitIndex,lineId:line.lineId,lineIndex,unitIndex,name:line.name,qty:line.qty});
      });
      return targets;
    }
    function completionDraft(group=''){
      const current=modal?.draft||{};
      if(!group)return {...current,activeGroup:'',activeTarget:'',assignments:current.assignments||{}};
      const targets=requiredTargets(store.get().cart,group),assignments=current.activeGroup===group?(current.assignments||{}):{};
      const activeTarget=(current.activeGroup===group&&targets.some(target=>target.id===current.activeTarget))?current.activeTarget:(targets.find(target=>!assignments[target.id])?.id||targets[0]?.id||'');
      return {activeGroup:group,activeTarget,assignments};
    }
    function completionTargetLabel(target){return String(target.lineIndex+1).padStart(2,'0')+'｜'+escapeHtml(target.name)+(target.qty>1?'｜第 '+(target.unitIndex+1)+' 份':'');}
    function requiredSelectionPanel(group){
      const draft=completionDraft(group);modal.draft=draft;
      const targets=requiredTargets(store.get().cart,group),assignments=draft.assignments||{},active=targets.find(target=>target.id===draft.activeTarget)||targets[0];
      const done=targets.filter(target=>assignments[target.id]).length,label=requiredGroupLabel(group);
      const targetHtml=targets.map(target=>'<button class="required-target '+(target.id===active?.id?'active ':'')+(assignments[target.id]?'complete':'')+'" data-action="completion-target" data-id="'+escapeHtml(target.id)+'"><span><b>'+completionTargetLabel(target)+'</b><small>'+(assignments[target.id]?'已選：'+escapeHtml(group==='drink'?(drinkMap.get(assignments[target.id])?.name||assignments[target.id]):assignments[target.id]):'尚未選擇')+'</small></span><em>'+(assignments[target.id]?'✓':'待選')+'</em></button>').join('');
      const drinkAssignmentCounts=new Map();
      if(group==='drink')Object.values(assignments).forEach(id=>{if(id)drinkAssignmentCounts.set(id,(drinkAssignmentCounts.get(id)||0)+1);});
      let choices='';
      if(group==='drink')choices='<div class="required-drink-grid">'+drinks.filter(item=>item.available!==false).map(item=>{const count=drinkAssignmentCounts.get(item.id)||0;return '<button data-action="completion-required-choice" data-value="'+escapeHtml(item.id)+'" class="'+(active&&assignments[active.id]===item.id?'selected ':'')+(count?'has-assignment':'')+'" aria-label="'+escapeHtml(item.name)+(count?'，已選 '+count+' 份':'')+'">'+imageBlock(item.image,item.name,'required-choice-img')+'<span>'+escapeHtml(item.name)+'</span>'+(count?'<em class="drink-choice-count">✓ '+count+'</em>':'')+'</button>';}).join('')+'</div>';
      else choices='<div class="required-option-grid">'+(optionSets[group]||[]).map(value=>'<button data-action="completion-required-choice" data-value="'+escapeHtml(value)+'" class="'+(active&&assignments[active.id]===value?'selected':'')+'">'+escapeHtml(value)+'</button>').join('')+'</div>';
      const selected=active?assignments[active.id]:'';
      return '<div class="required-workflow-head"><div><small>必須完成｜'+label+'</small><strong>已分配 '+done+' / '+targets.length+'</strong><span>每一份都會顯示指定結果，避免配錯餐點。</span></div><button data-action="completion-back">返回必選總覽</button></div><div class="required-workflow-grid"><section class="required-target-pane"><h3>要補選嘅餐點</h3><div class="required-target-list">'+targetHtml+'</div></section><section class="required-choice-pane"><div class="required-active-target"><small>目前指定</small><strong>'+(active?completionTargetLabel(active):'已完成')+'</strong><span>'+(selected?'目前：'+escapeHtml(group==='drink'?(drinkMap.get(selected)?.name||selected):selected):'請選擇 '+label)+'</span></div>'+choices+(selected&&done<targets.length?'<button class="required-fill" data-action="completion-fill-remaining" data-value="'+escapeHtml(selected)+'">其餘未選全部用同一選項</button>':'')+'</section></div><footer class="required-workflow-actions"><button data-action="completion-back">返回</button><button class="primary" data-action="apply-required-group" '+(done===targets.length&&targets.length?'':'disabled')+'>確認 '+label+'｜'+done+' 份</button></footer>';
    }
    function splitLineForRequired(line,group,values){
      if(!values.length)return [line];
      if(values.every(value=>value===values[0]))return [{...line,options:{...(line.options||{}),[group]:values[0]}}];
      const qty=Math.max(1,Number(line.qty||1)),slotsPerUnit=qty?Math.max(0,Math.round(Number(line.drinkSlots||0)/qty)):0,drinkAssignments=[...(line.drinkAssignments||[])];
      return values.map((value,index)=>({...line,lineId:index===0?line.lineId:stableId('line'),qty:1,total:Number(line.unitPrice||0),options:{...(line.options||{}),[group]:value},drinkSlots:slotsPerUnit,drinkAssignments:slotsPerUnit?drinkAssignments.slice(index*slotsPerUnit,(index+1)*slotsPerUnit):[],createdOrder:Number(line.createdOrder||0)+(index*0.0001)}));
    }
    function applyRequiredGroup(){
      const group=modal?.draft?.activeGroup;if(!group)return;
      const targets=requiredTargets(store.get().cart,group),assignments=modal.draft.assignments||{};
      if(targets.some(target=>!assignments[target.id])){showToast('仲有必選項未完成');return;}
      store.set(state=>{
        if(group==='drink'){
          const byLine=new Map();targets.forEach(target=>{if(!byLine.has(target.lineId))byLine.set(target.lineId,[]);byLine.get(target.lineId).push(assignments[target.id]);});
          state.cart=state.cart.map(line=>{const ids=byLine.get(line.lineId);if(!ids)return line;return {...line,drinkAssignments:(line.drinkAssignments||[]).concat(ids.map(id=>drinkSelection(id)))};});
        }else{
          const byLine=new Map();targets.forEach(target=>{if(!byLine.has(target.lineId))byLine.set(target.lineId,[]);byLine.get(target.lineId).push(assignments[target.id]);});
          state.cart=state.cart.flatMap(line=>{const values=byLine.get(line.lineId);return values?splitLineForRequired(line,group,values):[line];});
        }
        state.lastAffectedLineId=targets.at(-1)?.lineId||'';state.lastMutationKind='changed';return state;
      });
      modal={type:'completion',dirty:false,draft:{activeGroup:'',activeTarget:'',assignments:{}}};queue.afterRender(()=>showToast(requiredGroupLabel(group)+'已完成'));
    }
    function completionModal(){
      const state=store.get(),required=pendingSummary(state.cart),link=linkUpSummary(state.cart);
      if(modal?.draft?.activeGroup)return '<aside class="completion-card modal-card required-workflow"><header><div><small>結帳前必須完成</small><strong>快速補選</strong></div><button data-action="dismiss-modal">×</button></header>'+requiredSelectionPanel(modal.draft.activeGroup)+'</aside>';
      return '<aside class="completion-card modal-card"><header><div><small>結帳前檢查</small><strong>必選快速補齊</strong></div><button data-action="dismiss-modal">×</button></header><div class="completion-section required"><div><small>必須完成</small><strong>'+(required.total?'共欠 '+required.total+' 項':'全部完成')+'</strong><span>只處理會阻礙結帳嘅必選；普通口味修改仍然喺產品「修改」處理。</span></div>'+['rice','sauce','snack','drink'].filter(k=>required[k]).map(k=>'<button data-action="complete-group" data-group="'+k+'"><span>'+requiredGroupLabel(k)+'</span><b>'+required[k]+' 份</b><em>快速分配</em></button>').join('')+'</div><div class="completion-section optional"><div><small>普通修改</small><strong>唔影響結帳</strong><span>走青瓜、走蔥、少辣等，請由對應產品「修改」卡處理。</span></div></div><div class="completion-section linkup"><div><small>可組合套餐</small><strong>'+link.count+' 份</strong><span>飯團 '+link.riceballs+'｜小食 '+link.snacks+'｜飲品 '+link.drinks+'</span></div>'+(link.count?'<button class="primary" data-action="linkup-all" data-count="'+link.count+'">一鍵組合</button>':'')+'</div></aside>';
    }
    function optionButtons(group,values,selected,multi=false){return '<div class="option-chips">'+values.map(value=>'<button data-action="detail-option" data-group="'+group+'" data-value="'+escapeHtml(value)+'" data-multi="'+multi+'" class="'+((multi?selected.includes(value):selected===value)?'selected':'')+'">'+escapeHtml(value)+'</button>').join('')+'</div>';}
    function detailGroups(product,draft){
      const rows=[];
      if(product.required.includes('rice'))rows.push('<section><header><strong>飯底</strong><span class="required-tag">必選</span></header>'+optionButtons('rice',optionSets.rice,draft.options.rice||'')+'</section>');
      if(product.required.includes('sauce'))rows.push('<section><header><strong>醬汁</strong><span class="required-tag">必選</span></header>'+optionButtons('sauce',optionSets.sauce,draft.options.sauce||'')+'</section>');
      rows.push('<section><header><strong>飯量／份量</strong><span>可選</span></header>'+optionButtons('portion',['少飯','標準','多飯','加飯 +$5'],draft.options.portion||'標準')+'</section>');
      rows.push('<section><header><strong>口味調整</strong><span>可多選</span></header>'+optionButtons('taste',['走蔥','少辣','走蒜','走香菜','不要花生'],draft.options.taste||[],true)+'</section>');
      if(product.required.includes('snack'))rows.push('<section><header><strong>套餐小食</strong><span class="required-tag">必選</span></header>'+optionButtons('snack',optionSets.snack,draft.options.snack||'')+'</section>');
      if(product.combinable)rows.push('<section class="upgrade-section"><header><strong>升級飯團套餐</strong><span>可補選</span></header><p>小食及飲品都選擇後，會直接組合成飯團套餐。</p>'+optionButtons('snack',optionSets.snack,draft.options.snack||'')+'</section>');
      if(product.required.includes('drink')||product.combinable)rows.push('<section><header><strong>'+(product.required.includes('drink')?'套餐飲品':'加配飲品')+'</strong><span class="'+(product.required.includes('drink')?'required-tag':'')+'">'+(product.required.includes('drink')?'必選':'可補選')+'</span></header><div class="detail-drinks">'+drinks.map(d=>drinkChoiceCard(d,'detail-drink',draft.drink?.drinkId===d.id,'detail')).join('')+'</div></section>');
      rows.push('<section><header><strong>備註</strong><span>可選</span></header><textarea data-action="detail-note" maxlength="80" placeholder="例如：醬汁分開、謝謝">'+escapeHtml(draft.note||'')+'</textarea></section>');
      return rows.join('');
    }
    function productDetailModal(){
      const {productId,draft}=modal;const p=productMap.get(productId);const missing=[];
      p.required.forEach(group=>{if(group==='drink'){if(!draft.drink)missing.push('飲品');}else if(!draft.options[group])missing.push(group==='rice'?'飯底':group==='sauce'?'醬汁':'小食');});
      const subtotal=p.price*draft.qty;
      return '<aside class="product-settings-card modal-card" data-editing="'+Boolean(modal.editLineId)+'"><header class="settings-product-head"><div><small>'+(modal.editLineId?'修改產品':'新增產品')+'</small><h2>'+p.name+'</h2><strong>'+money(p.price)+'</strong></div><button data-action="dismiss-modal" aria-label="返回">×</button></header><div class="product-settings-body"><div class="qty-row"><span>數量</span><button data-action="detail-qty" data-delta="-1">−</button><strong>'+draft.qty+'</strong><button data-action="detail-qty" data-delta="1">＋</button></div>'+detailGroups(p,draft)+'</div><footer class="product-settings-actions"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-product" '+(missing.length?'disabled':'')+'>確認 '+money(subtotal)+'</button></footer>'+(missing.length?'<p class="missing-hint">還欠：'+missing.join('、')+'</p>':'')+'</aside>';
    }
    function drinkModifierModal(){
      const d=drinkMap.get(modal.drinkId),draft=modal.draft;
      const groups=draft.groups||[];const total=draft.qty+groups.reduce((n,g)=>n+g.qty,0);
      return '<aside class="modifier-card modal-card"><header><strong>'+d.name+'</strong><button data-action="dismiss-modal">×</button></header><div class="drink-base-qty"><span>正常</span><span><button data-action="modifier-qty" data-delta="-1">−</button><b>'+draft.qty+'</b><button data-action="modifier-qty" data-delta="1">＋</button></span></div><div class="drink-groups">'+groups.map((g,index)=>'<section class="drink-group '+(g.open?'open':'')+'"><header><button class="group-summary" data-action="toggle-drink-adjustment" data-index="'+index+'">'+([g.sweetness,g.ice].filter(Boolean).join('・')||'選擇調整')+' ×'+g.qty+'</button><span><button data-action="group-qty" data-index="'+index+'" data-delta="-1">−</button><b>'+g.qty+'</b><button data-action="group-qty" data-index="'+index+'" data-delta="1">＋</button></span></header>'+(g.open?'<div class="adjustment-options">'+(d.sweet?optionButtons('group-sweetness-'+index,['多甜','少甜','走甜'],g.sweetness||''):'')+(d.ice?optionButtons('group-ice-'+index,['少冰','多冰'],g.ice||''):'')+'</div>':'')+'</section>').join('')+'</div><button data-action="add-drink-group" class="add-group">＋ 新增調整</button><button class="primary wide" data-action="apply-drink" '+(total?'':'disabled')+'>套用 '+total+' 份</button></aside>';
    }
    function searchModal(){const query=store.get().searchQuery;return '<aside class="side-card modal-card search-card"><header><div><small>產品搜尋</small><strong>名稱或編號</strong></div><button data-action="dismiss-modal">×</button></header><div class="search-field"><input autofocus data-action="search-query" value="'+escapeHtml(query)+'" placeholder="例如：F4、雞絲、奶茶"><button data-action="clear-search" '+(query?'':'disabled')+'>清除</button></div><p>搜尋結果會即時顯示；分類排序及供應狀態仍然保留。</p></aside>';}
    function categoryButton(cat,state){return '<button data-action="category" data-value="'+escapeHtml(cat)+'" class="'+(cat===state.category?'active':'')+'">'+escapeHtml(cat)+'</button>';}
    function categoryBar(state){
      const categoryLayout=buildCategoryLayout(categories,state.settings.categoryLayout);
      const pages=categoryLayout.pages.map((items,index)=>'<div class="category-page" aria-label="分類第 '+(index+1)+' 頁">'+items.map(cat=>categoryButton(cat,state)).join('')+(categoryLayout.showSearch?'<span class="category-search-reserved" aria-hidden="true"></span>':'')+'</div>').join('');
      return '<div class="category-shell" style="--category-columns:'+categoryLayout.columns+';--category-rows:'+categoryLayout.rows+'"><nav class="category-scroll">'+pages+'</nav>'+(categoryLayout.overflow.length?'<span class="category-overflow">可左右滑動查看更多分類</span>':'')+(categoryLayout.showSearch?'<button class="category-search '+(state.searchQuery?'active':'')+'" data-action="open-search" aria-label="搜尋產品">⌕<small>'+(state.searchQuery?'搜尋中':'搜尋')+'</small></button>':'')+'</div>';
    }
    function customConfirm(){
      const notice=newOrderNotice?.visible?'<aside class="new-order-toast"><div><small>'+newOrderNotice.source+' 新訂單</small><strong>'+newOrderNotice.id+'</strong><span>'+newOrderNotice.items+' 件 · '+money(newOrderNotice.amount)+'</span></div><button data-action="later-new-order">稍後處理</button><button class="primary" data-action="process-new-order">立即處理</button></aside>':'';
      if(!confirmState)return notice;
      if(confirmState.kind==='modal-exit')return notice+'<div class="confirm-layer"><section class="confirm-card"><strong>'+confirmState.title+'</strong><p>'+confirmState.message+'</p><div><button data-action="confirm-cancel">繼續調整</button><button class="danger" data-action="confirm-discard">退出不保存</button><button class="primary" data-action="confirm-save-exit" '+(confirmState.saveAction?'':'disabled')+'>保存並退出</button></div></section></div>';
      const dissolve=confirmState.kind==='dissolve',dineCancel=confirmState.kind==='dine-cancel';
      return notice+'<div class="confirm-layer"><section class="confirm-card"><strong>'+confirmState.title+'</strong><p>'+confirmState.message+'</p><div><button data-action="confirm-cancel">'+(dissolve?'返回套餐':dineCancel?'繼續點單':'繼續修改')+'</button><button class="danger" data-action="'+(dissolve?'confirm-dissolve':dineCancel?'confirm-dine-cancel':'confirm-discard')+'">'+(dissolve?'確認拆開':dineCancel?'取消今次點單':'放棄修改')+'</button></div></section></div>';
    }
    function activeModal(){
      if(!modal)return '';
      if(modal.type==='quick')return quickSettingsModal();
      if(modal.type==='settings')return settingsModal();
      if(modal.type==='health')return healthModal();
      if(modal.type==='status')return statusModal();
      if(modal.type==='soldout')return soldoutModal();
      if(modal.type==='hang')return hangModal();
      if(modal.type==='take')return takeModal();
      if(modal.type==='specified-link')return specifiedLinkModal();
      if(modal.type==='combo')return comboEditorModal();
      if(modal.type==='completion')return completionModal();
      if(modal.type==='product')return productDetailModal();
      if(modal.type==='drink')return drinkModifierModal();
      if(modal.type==='search')return searchModal();
      if(modal.type==='pending')return pendingPanel();
      if(modal.type==='pending-detail')return pendingDetailModal();
      if(modal.type==='pending-review')return pendingReviewModal();
      if(modal.type==='proof')return enlargedProofModal();
      return '';
    }
    function anchorRect(button){const r=button?.getBoundingClientRect?.();return r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}:null;}
    function actionAnchor(button,override=null){return override||anchorRect(button);}
    function positionActiveCard(){
      const card=document.querySelector('.side-card,.product-settings-card,.modifier-card,.pending-panel,.pending-review-card,.proof-lightbox');const a=modal?.anchor;if(!card||!a)return;
      const topbarRect=document.querySelector('.topbar')?.getBoundingClientRect(),bottomNavRect=document.querySelector('.bottom-nav')?.getBoundingClientRect();
      const cartRect=document.querySelector('.cart')?.getBoundingClientRect();
      if(modal?.type==='pending'&&cartRect)card.style.maxHeight=Math.min(cartRect.height,(bottomNavRect?.top||innerHeight)-(topbarRect?.bottom||0)-32)+'px';
      const gap=14,w=card.offsetWidth,h=card.offsetHeight,margin=16,minTop=(topbarRect?.bottom||0)+margin,maxBottom=(bottomNavRect?.top||innerHeight)-margin;
      const room={top:a.top-minTop,bottom:maxBottom-a.bottom,left:a.left-margin,right:innerWidth-margin-a.right};
      let side,left,top;
      if(a.top<minTop+90){side='top';left=a.left+a.width/2-w/2;top=a.bottom+gap;}
      else if(a.bottom>maxBottom-110){side='bottom';left=a.left+a.width/2-w/2;top=a.top-h-gap;}
      else if(room.right>=w+gap){side='left';left=a.right+gap;top=a.top+a.height/2-h/2;}
      else {side='right';left=a.left-w-gap;top=a.top+a.height/2-h/2;}
      left=Math.max(margin,Math.min(left,innerWidth-w-margin));top=Math.max(minTop,Math.min(top,maxBottom-h));
      card.style.left=left+'px';card.style.right='auto';card.style.top=top+'px';card.style.transform='none';card.dataset.pointerSide=side;
      card.style.setProperty('--pointer-y',Math.max(24,Math.min(a.top+a.height/2-top,h-24))+'px');card.style.setProperty('--pointer-x',Math.max(24,Math.min(a.left+a.width/2-left,w-24))+'px');
    }
    function clearRecentLater(lineId){
      clearTimeout(recentTimer);
      if(!lineId)return;
      recentTimer=setTimeout(()=>{const current=store.get();if(current.lastAffectedLineId===lineId)store.setTransient(state=>({...state,lastAffectedLineId:'',lastMutationKind:''}));},1500);
    }
    function restoreCartViewport(state,previousScroll){
      const cart=document.querySelector('.cart-list');if(!cart)return;
      const target=state.lastAffectedLineId?document.querySelector('[data-line-id="'+CSS.escape(state.lastAffectedLineId)+'"]'):null;
      if(state.lastAffectedLineId&&state.lastMutationKind==='added'&&state.cartViewMode===CART_VIEW_INPUT){cart.scrollTop=cart.scrollHeight;}
      else if(target){target.scrollIntoView({block:'nearest'});}
      else cart.scrollTop=Math.max(0,previousScroll||0);
      cartScrollTop=cart.scrollTop;
      clearRecentLater(state.lastAffectedLineId);
    }
    let renderStarted=false;
    const renderKeys={top:'',cart:'',category:'',products:'',quick:'',bottom:'',modal:''};
    function surfaceKey(value){try{return JSON.stringify(value);}catch(_error){return String(Date.now());}}
    function cartSurface(state){
      const hasCart=state.cart.length>0;
      const checkoutLabel=state.dineContext?'落單到 '+escapeHtml(state.dineContext.tableId)+' 號枱 '+money(cartTotal(state.cart)):hasCart?'結帳 '+money(cartTotal(state.cart)):'購物車未有餐點';
      const serviceClass=state.orderServiceMode===SERVICE_DINE_IN?'dine':'takeaway';
      const viewClass=state.cartViewMode===CART_VIEW_ORGANIZED?'organized':'input';
      return '<aside class="cart"><header><div><h2>購物車（'+state.cart.reduce((n,l)=>n+l.qty,0)+'）</h2>'+cartSummary(state)+'</div><span class="cart-header-actions"><span class="cart-mode-controls"><button class="cart-mode-toggle '+serviceClass+'" data-action="toggle-order-service">'+state.orderServiceMode+'</button><button class="cart-mode-toggle cart-view-toggle '+viewClass+'" data-action="toggle-cart-view">'+(state.cartViewMode===CART_VIEW_ORGANIZED?'原單':'整理')+'</button></span>'+(state.dineContext?'<button class="cancel-dine-order" data-action="cancel-dine-order">取消堂食點單</button>':'')+'<button data-action="clear-cart">清空</button></span></header><div class="cart-list">'+cartRows()+'</div>'+pendingArea()+'<footer><button data-action="open-hold-panel">掛單</button><button data-action="open-drafts">取單'+(drafts.length?' '+drafts.length:'')+'</button><button class="primary" data-action="checkout" '+(hasCart?'':'disabled')+'>'+checkoutLabel+'</button></footer></aside>';
    }
    function filteredCatalog(state){
      const searchQuery=state.searchQuery.trim().toLocaleLowerCase('zh-HK');
      const categoryProducts=state.category==='全部'?products:products.filter(product=>product.category===state.category);
      return sortPausedLast(categoryProducts.filter(product=>!searchQuery||String(product.name||'').toLocaleLowerCase('zh-HK').includes(searchQuery)||String(product.code||'').toLocaleLowerCase('zh-HK').includes(searchQuery)));
    }
    function productGridSurface(state){
      const filtered=filteredCatalog(state),template=productTemplate();
      return '<div class="products products-'+template+'">'+(filtered.length?filtered.map(productCard).join(''):'<div class="empty search-empty">搵唔到符合「'+escapeHtml(state.searchQuery)+'」嘅產品</div>')+'</div>';
    }
    function refreshQrCodes(scope=document){
      scope.querySelectorAll?.('[data-qr]').forEach(node=>{if(typeof window.qrcode!=='function')return;const qr=window.qrcode(0,'M');qr.addData(node.dataset.qr);qr.make();node.innerHTML=qr.createImgTag(5,8,'WhatsApp QR Code');});
    }
    function replaceOuter(selector,html){
      const node=document.querySelector(selector);if(!node)return null;
      node.outerHTML=html;
      return document.querySelector(selector);
    }
    function refreshQuickSurface(html){
      const catalog=document.querySelector('.catalog');if(!catalog)return null;
      const current=catalog.querySelector('.quick-drawer');
      if(!html){current?.remove();return null;}
      if(current){current.outerHTML=html;}else catalog.insertAdjacentHTML('beforeend',html);
      return catalog.querySelector('.quick-drawer');
    }
    let lastOverlayOpen=null;
    function publishOverlayState(){
      const open=Boolean(modal||confirmState);
      if(open===lastOverlayOpen)return;
      lastOverlayOpen=open;
      window.parent?.postMessage?.({type:'morefun:overlay-state',open},'*');
    }
    function refreshModalSurface(state){
      const toast=document.getElementById('toast');if(!toast)return;
      app.querySelectorAll(':scope > .modal-scrim,:scope > .modal-card,:scope > .confirm-layer,:scope > .new-order-toast').forEach(node=>node.remove());
      toast.insertAdjacentHTML('beforebegin',modalScrim()+activeModal()+customConfirm());
      if(modal?.type==='settings'){
        const first=document.querySelector('.side-card .setting-row');
        first?.insertAdjacentHTML('beforebegin','<div class="setting-block"><strong>購物車相同產品</strong><div class="segmented"><button data-action="cart-merge" data-value="same" class="'+(state.settings.cart.mergeMode!=='never'?'active':'')+'">相同配置合併</button><button data-action="cart-merge" data-value="never" class="'+(state.settings.cart.mergeMode==='never'?'active':'')+'">逐項顯示</button></div></div>');
      }
      app.querySelectorAll(':scope > .modal-card,:scope > .confirm-layer,:scope > .new-order-toast').forEach(node=>{bindImageFallbacks(node);refreshQrCodes(node);});
      requestAnimationFrame(()=>positionActiveCard());
    }
    function render(){
      const state=store.get();
      const pendingCount=pendingOrderCount(state);
      const template=productTemplate();
      const topKey=surfaceKey([state.quickMode,state.operations,state.health,pendingCount,state.dineContext,products.map(item=>[item.id,supplyStatus(item)]),readJSON(ORDER_HISTORY_STORAGE_KEY,[]).length]);
      const cartKey=surfaceKey([state.cart,state.dineContext,state.orderServiceMode,state.cartViewMode,state.lastAffectedLineId,state.lastMutationKind,state.collapsedCartCategories,state.settings.cart,drafts.length]);
      const categoryKey=surfaceKey([state.category,state.searchQuery,state.settings.categoryLayout]);
      const productsKey=surfaceKey([state.category,state.searchQuery,state.quickMode,state.settings.catalog,template,products.map(item=>[item.id,supplyStatus(item)])]);
      const quickKey=surfaceKey([state.quickDrawerOpen,state.settings.quickDrinks,pendingSummary(state.cart).drink,lastDrinkAssignment,modal?.type==='drink'?modal.drinkId:'',drinks.map(item=>[item.id,item.available])]);
      const bottomKey=String(pendingCount);
      const modalKey=surfaceKey([modal,confirmState,newOrderNotice,modal?{cart:state.cart,settings:state.settings,health:state.health,pendingOrders:state.pendingOrders,searchQuery:state.searchQuery,drafts}:null]);
    
      if(!renderStarted){
        const topHtml=topbar(),cartHtml=cartSurface(state),categoryHtml=categoryBar(state),productsHtml=productGridSurface(state),quickHtml=quickDrinks(),bottomHtml=renderBottomNav('order',{badges:{orders:pendingCount}});
        app.innerHTML='<main>'+topHtml+'<section class="workspace"><section class="order-grid" style="--cart-width:'+Number(state.settings.cart.widthPercent||32)+'%">'+cartHtml+'<section class="catalog">'+categoryHtml+productsHtml+quickHtml+'</section></section></section>'+bottomHtml+'</main>'+modalScrim()+activeModal()+customConfirm()+'<div id="toast" class="toast"></div>';
        document.body.classList.toggle('has-modal',Boolean(modal));
        bindImageFallbacks(app);refreshQrCodes(app);
        Object.assign(renderKeys,{top:topKey,cart:cartKey,category:categoryKey,products:productsKey,quick:quickKey,bottom:bottomKey,modal:modalKey});
        renderStarted=true;
        requestAnimationFrame(()=>{positionActiveCard();restoreCartViewport(state,0);});
        publishOverlayState();
        window.dispatchEvent(new Event('morefun:layout-invalidated'));
        return;
      }
    
      let layoutChanged=false;
      const grid=document.querySelector('.order-grid');
      const cartWidth=Number(state.settings.cart.widthPercent||32)+'%';
      if(grid&&grid.style.getPropertyValue('--cart-width')!==cartWidth){grid.style.setProperty('--cart-width',cartWidth);layoutChanged=true;}
      document.body.classList.toggle('has-modal',Boolean(modal));
    
      if(renderKeys.top!==topKey){replaceOuter('.topbar',topbar());renderKeys.top=topKey;}
      if(renderKeys.cart!==cartKey){
        const oldCart=document.querySelector('.cart-list'),previousScroll=oldCart?oldCart.scrollTop:cartScrollTop;
        const node=replaceOuter('.cart',cartSurface(state));if(node)bindImageFallbacks(node);
        renderKeys.cart=cartKey;layoutChanged=true;requestAnimationFrame(()=>restoreCartViewport(state,previousScroll));
      }
      if(renderKeys.category!==categoryKey){replaceOuter('.category-shell',categoryBar(state));renderKeys.category=categoryKey;layoutChanged=true;}
      if(renderKeys.products!==productsKey){const node=replaceOuter('.products',productGridSurface(state));if(node)bindImageFallbacks(node);renderKeys.products=productsKey;layoutChanged=true;}
      if(renderKeys.quick!==quickKey){const node=refreshQuickSurface(quickDrinks());if(node)bindImageFallbacks(node);renderKeys.quick=quickKey;layoutChanged=true;}
      if(renderKeys.bottom!==bottomKey){replaceOuter('.bottom-nav',renderBottomNav('order',{badges:{orders:pendingCount}}));renderKeys.bottom=bottomKey;layoutChanged=true;}
      if(renderKeys.modal!==modalKey){refreshModalSurface(state);renderKeys.modal=modalKey;}
      publishOverlayState();
      if(layoutChanged)window.dispatchEvent(new Event('morefun:layout-invalidated'));
    }
    function completeDineCancellation(){
      const context=store.get().dineContext;
      if(context?.startedFromFree){const dine=cleanupEmptyDineSessions(readJSON(DINE_STORAGE_KEY,null)||createInitialDineState());writeJSON(DINE_STORAGE_KEY,dine);}
      store.set(state=>({...state,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));
      modal=null;confirmState=null;window.parent?.postMessage?.({type:'morefun:navigate',route:'dine'},'*');
    }
    function requestDineCancellation(){
      const state=store.get();if(!state.dineContext){window.parent?.postMessage?.({type:'morefun:navigate',route:'dine'},'*');return;}
      if(!state.cart.length){completeDineCancellation();return;}
      confirmState={kind:'dine-cancel',title:'取消堂食點單？',message:'今次未正式加入 '+state.dineContext.tableId+' 號枱，購物車內容會一併清除；原有堂食餐品不受影響。'};modal=null;render();
    }
    function markDirty(){if(modal)modal.dirty=true;}
    function modalSaveAction(current=modal){
      if(!current)return '';
      if(current.type==='product')return 'apply-product';
      if(current.type==='drink')return 'apply-drink';
      if(current.type==='completion'&&current.draft?.activeGroup)return 'apply-required-group';
      if(current.type==='combo')return 'apply-combo-edit';
      if(current.type==='specified-link')return 'apply-specified-link';
      return '';
    }
    function requestDismiss(){
      if(!modal)return;
      if(modal.dirty){
        confirmState={kind:'modal-exit',title:'已經有調整，是否退出？',message:'你可以繼續調整、退出而不保存，或者保存目前修改後退出。',returnModal:modal.type==='drink'&&modal.parent?modal.parent:null,saveAction:modalSaveAction(modal)};
        render();return;
      }
      modal=modal.type==='drink'&&modal.parent?modal.parent:null;confirmState=null;render();
    }
    function openProduct(productId,lineId='',anchor=null){
      const p=productMap.get(productId),line=lineId?store.get().cart.find(x=>x.lineId===lineId):null;
      modal={type:'product',productId,editLineId:lineId,anchor,dirty:false,draft:{qty:line?.qty||1,options:safeClone(line?.options||{}),drink:line?.drinkAssignments?.[0]||null,note:line?.options?.note||'',keypad:false,keypadValue:''}};
      render();
    }
    function locateMutation(before,after,productId,newLineId=''){
      if(newLineId&&after.some(line=>line.lineId===newLineId))return {lineId:newLineId,kind:'added'};
      const beforeMap=new Map(before.map(line=>[line.lineId,Number(line.qty||0)]));
      const added=after.find(line=>!beforeMap.has(line.lineId));if(added)return {lineId:added.lineId,kind:'added'};
      const changed=[...after].reverse().find(line=>line.productId===productId&&Number(line.qty||0)>Number(beforeMap.get(line.lineId)||0));
      return {lineId:changed?.lineId||after.at(-1)?.lineId||'',kind:changed?'changed':'added'};
    }
    function quickAddProduct(productId){
      const p=productMap.get(productId);if(!p)return;
      const current=store.get();const line=makeLine(productId,1,{serviceMode:current.orderServiceMode});const before=current.cart;
      store.set(state=>{const next=mergeCart(state.cart.concat(line),state.settings.cart.mergeMode);const mutation=locateMutation(before,next,productId,line.lineId);state.cart=next;state.lastAffectedLineId=mutation.lineId;state.lastMutationKind=mutation.kind;return state;});
      queue.afterRender(()=>showToast('已加入 '+p.name));
    }
    function changeCartQuantity(lineId,delta){
      store.set(state=>{state.cart=updateCartLineQuantity(state.cart,lineId,delta,Object.fromEntries(products.map(p=>[p.id,p.drinkSlots||0])));state.lastAffectedLineId=state.cart.some(line=>line.lineId===lineId)?lineId:'';state.lastMutationKind='changed';return state;});
    }
    function openDrink(drinkId,context,maxQty=1,anchor=null){modal={type:'drink',drinkId,context,maxQty,anchor,dirty:false,draft:{qty:1,sweetness:'',ice:'',groups:[]}};render();}
    function applyProduct(){
      const editing=Boolean(modal.editLineId);
      const p=productMap.get(modal.productId),d=modal.draft,options={...d.options};if(d.note)options.note=d.note;
      const current=store.get(),before=current.cart;
      const drinkAssignments=d.drink?Array.from({length:d.qty},()=>safeClone(d.drink)):[];
      let line=makeLine(p.id,d.qty,{options,drinkAssignments,linkedComboId:p.combinable&&d.options.snack&&d.drink?stableId('combo'):'',linkedQty:p.combinable&&d.options.snack&&d.drink?d.qty:0,serviceMode:current.orderServiceMode});
      if(p.category==='飯團套餐'){
        const components=[{role:'main',source:'fixed',productId:p.id,name:p.name,image:p.image,unitPrice:p.price,options:{}},{role:'snack',source:'fixed-option',productId:'snack:'+d.options.snack,name:d.options.snack,image:'',unitPrice:0,options:{}}];
        if(d.drink)components.push({role:'drink',source:'quick',productId:d.drink.drinkId,drinkId:d.drink.drinkId,name:d.drink.name,image:drinkMap.get(d.drink.drinkId)?.image||'',unitPrice:Number(d.drink.unitPrice||0),options:{}});
        line={...line,lineType:'combo',category:'飯團套餐',combo:{id:stableId('combo'),kind:'riceball-set',source:'fixed',components,missingRoles:d.drink?[]:['drink'],singleTotal:p.price,comboPrice:p.price,discount:0}};
      }
      const editLineId=modal.editLineId;
      store.set(state=>{
        if(editLineId){state.cart=state.cart.map(item=>item.lineId===editLineId?{...line,lineId:item.lineId,createdOrder:item.createdOrder,serviceMode:item.serviceMode,serviceModeOverride:item.serviceModeOverride||''}:item);state.lastAffectedLineId=editLineId;state.lastMutationKind='changed';}
        else{const next=mergeCart(state.cart.concat(line),state.settings.cart.mergeMode);const mutation=locateMutation(before,next,p.id,line.lineId);state.cart=next;state.lastAffectedLineId=mutation.lineId;state.lastMutationKind=mutation.kind;}
        return state;
      });
      modal=null;queue.afterRender(()=>showToast(editing?'已更新產品':'已加入購物車'));
    }
    function applyDrink(){
      const groups=modal.draft.groups||[];
      const selections=Array.from({length:modal.draft.qty},()=>drinkSelection(modal.drinkId)).concat(groups.flatMap(group=>Array.from({length:group.qty},()=>drinkSelection(modal.drinkId,group.sweetness,group.ice)))),context=modal.context;
      if(context==='detail'){const productModal=modal.parent;productModal.draft.drink=selections[0];productModal.dirty=true;modal=productModal;render();return;}
      let appliedTarget=null;
      store.set(state=>{let remaining=selections.slice();state.cart=state.cart.map(line=>{if(!remaining.length)return line;const miss=Math.max(0,line.drinkSlots-line.drinkAssignments.length);const taken=remaining.splice(0,miss);if(taken.length&&!appliedTarget)appliedTarget={lineId:line.lineId,name:line.name};return taken.length?{...line,drinkAssignments:line.drinkAssignments.concat(taken)}:line;});if(appliedTarget){state.lastAffectedLineId=appliedTarget.lineId;state.lastMutationKind='changed';}return state;});
      if(appliedTarget&&selections[0]){lastDrinkAssignment={drink:selections[0].name,target:appliedTarget.name};clearTimeout(drinkFeedbackTimer);drinkFeedbackTimer=setTimeout(()=>{lastDrinkAssignment=null;render();},3200);}
      pendingDrinkAssignment=null;modal=null;queue.afterRender(()=>showToast('已補選飲品'));
    }
    function handle(button,anchorOverride=null){
      const action=button.dataset.action;
      if(action==='shell-navigate'){const route=button.dataset.route;if(route==='dine'&&store.get().dineContext)return requestDineCancellation();if(route!=='order')window.parent?.postMessage?.({type:'morefun:navigate',route},'*');return;}
      if(store.get().quickDrawerOpen)scheduleQuickDrawerClose();
      if(action==='category')store.setTransient(state=>({...state,category:button.dataset.value}));
      else if(action==='open-search'){modal={type:'search',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='clear-search'){store.setTransient(state=>({...state,searchQuery:''}));}
      else if(action==='open-product')openProduct(button.dataset.id,'',actionAnchor(button,anchorOverride));
      else if(action==='quick-add-product')quickAddProduct(button.dataset.id);
      else if(action==='cart-qty')changeCartQuantity(button.dataset.id,Number(button.dataset.delta)||0);
      else if(action==='toggle-order-service')store.set(state=>{const next=state.orderServiceMode===SERVICE_DINE_IN?SERVICE_TAKEAWAY:SERVICE_DINE_IN;return {...state,orderServiceMode:next,cart:applyOrderServiceMode(state.cart,next),lastAffectedLineId:'',lastMutationKind:''};});
      else if(action==='toggle-line-service')store.set(state=>({...state,cart:toggleLineServiceMode(state.cart,button.dataset.id,state.orderServiceMode),lastAffectedLineId:button.dataset.id,lastMutationKind:'changed'}));
      else if(action==='toggle-cart-view')saveCartViewMode(store.get().cartViewMode===CART_VIEW_ORGANIZED?CART_VIEW_INPUT:CART_VIEW_ORGANIZED);
      else if(action==='toggle-cart-category')store.setTransient(state=>{const category=button.dataset.value;const collapsed=state.collapsedCartCategories.includes(category);return {...state,collapsedCartCategories:collapsed?state.collapsedCartCategories.filter(item=>item!==category):state.collapsedCartCategories.concat(category)};});
      else if(action==='edit-line'){const line=store.get().cart.find(x=>x.lineId===button.dataset.id);if(line?.lineType==='combo'){modal={type:'combo',lineId:line.lineId,anchor:actionAnchor(button,anchorOverride),dirty:false,draft:{components:safeClone(line.combo?.components||[])}};render();}else if(line)openProduct(line.productId,line.lineId,actionAnchor(button,anchorOverride));}
      else if(action==='open-completion'){modal={type:'completion',dirty:false,draft:{activeGroup:'',activeTarget:'',assignments:{}}};render();}
      else if(action==='open-quick-settings'){modal={type:'quick',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-settings'){modal={type:'settings',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-health'){modal={type:'health',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-status'){modal={type:'status',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='open-soldout'){modal={type:'soldout',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='navigate-orders')window.parent?.postMessage?.({type:'morefun:navigate',route:'orders'},'*');
      else if(action==='navigate-dine')requestDineCancellation();
      else if(action==='navigate-soldout')window.parent?.postMessage?.({type:'morefun:navigate',route:'soldout'},'*');
      else if(action==='navigate-more')window.parent?.postMessage?.({type:'morefun:navigate',route:'more'},'*');
      else if(action==='open-hold-panel'){if(!store.get().cart.length){showToast('購物車未有餐品');return;}modal={type:'hang',dirty:false};render();}
      else if(action==='select-draft'){modal={...modal,selectedDraftId:button.dataset.id};render();}
      else if(action==='assign-table'){
        const current=store.get();if(!current.cart.length){showToast('購物車未有餐品');return;}
        try{const dineState=readJSON(DINE_STORAGE_KEY,null)||createInitialDineState();const table=dineState.tables.find(entry=>entry.id===button.dataset.id);const context={mode:'dine',tableId:button.dataset.id,sessionId:table?.status==='occupied'?table.session?.id:null};const dineCart=applyOrderServiceMode(current.cart,SERVICE_DINE_IN);const next=commitTableOrder(dineState,context,dineCart,{terminalId,history:readJSON(ORDER_HISTORY_STORAGE_KEY,[])});writeJSON(DINE_STORAGE_KEY,next);syncDinePrintJobs(next);store.set(state=>({...state,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));modal=null;queue.afterRender(()=>showToast('已正式加入 '+button.dataset.id+' 號枱及建立打印工作'));}catch(error){showToast(error.message||'未能加入堂食枱位');}
      }
      else if(action==='add-draft'){
        const state=store.get();if(!state.cart.length)return;
        const draft=createDraftRecord({cart:state.cart,terminalId,drafts,counters:draftCounters,session:state.draftSession||null,context:state.dineContext||null});
        draftCounters={...draftCounters,[terminalId]:Number(draft.draftNumber.split('-').at(-1))};writeJSON(DRAFT_COUNTER_STORAGE_KEY,draftCounters);drafts=drafts.concat(draft);writeJSON(DRAFT_STORAGE_KEY,drafts);
        store.set(next=>({...next,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));modal=null;queue.afterRender(()=>showToast('已暫存 '+draft.draftNumber));
      }
      else if(action==='open-drafts'){modal={type:'take',selectedDraftId:'',dirty:false};render();}
      else if(action==='restore-draft'){
        const draft=drafts.find(item=>item.id===button.dataset.id);if(!draft)return;
        const restored=restoreDraftForTerminal(draft,terminalId);drafts=drafts.filter(item=>item.id!==draft.id);writeJSON(DRAFT_STORAGE_KEY,drafts);
        const orderServiceMode=inferOrderServiceMode(restored.cart,null);
        store.set(state=>({...state,cart:normalizeCart(restored.cart,orderServiceMode),draftSession:restored.session,dineContext:null,orderServiceMode,lastAffectedLineId:'',lastMutationKind:''}));modal=null;queue.afterRender(()=>showToast('已取回 '+draft.draftNumber));
      }
      else if(action==='void-draft'){const draft=drafts.find(item=>item.id===modal?.selectedDraftId);if(!draft)return;if(!window.confirm('確定作廢 '+draft.draftNumber+'？作廢後不能取回。'))return;drafts=drafts.filter(item=>item.id!==draft.id);writeJSON(DRAFT_STORAGE_KEY,drafts);modal={type:'take',selectedDraftId:'',dirty:false};render();showToast('已作廢 '+draft.draftNumber);}
      else if(action==='toggle-quick-drawer'){store.setTransient(state=>({...state,quickDrawerOpen:!state.quickDrawerOpen}));scheduleQuickDrawerClose();}
      else if(action==='move-quick-drink')updateSettings(s=>{const order=s.quickDrinks.order.slice(),from=order.indexOf(button.dataset.id),to=Math.max(0,Math.min(order.length-1,from+Number(button.dataset.delta)));if(from>=0&&from!==to)[order[from],order[to]]=[order[to],order[from]];s.quickDrinks.order=order;});
      else if(action==='ui-scale')window.parent?.postMessage?.({type:'morefun:set-ui-scale',value:Number(button.dataset.value)},'*');
      else if(action==='dismiss-modal')requestDismiss();
      else if(action==='confirm-cancel'){confirmState=null;render();}
      else if(action==='confirm-discard'){modal=confirmState?.returnModal||null;confirmState=null;render();}
      else if(action==='confirm-save-exit'){const saveAction=confirmState?.saveAction;confirmState=null;if(saveAction)handle({dataset:{action:saveAction}});else{modal=null;render();}}
      else if(action==='confirm-dine-cancel')completeDineCancellation();
      else if(action==='confirm-dissolve'){const lineId=confirmState.lineId;store.set(state=>{state.cart=normalizeCart(dissolveRiceballSet(state.cart,lineId,{idFactory:role=>stableId('line-'+role)}),state.orderServiceMode);state.lastAffectedLineId=state.cart.at(-1)?.lineId||'';state.lastMutationKind='changed';return state;});confirmState=null;modal=null;queue.afterRender(()=>showToast('套餐已拆開並按單品重新計價'));}
      else if(action==='toggle-pending-panel'){if(modal?.type==='pending')modal=null;else modal={type:'pending',anchor:actionAnchor(button,anchorOverride),dirty:false};render();}
      else if(action==='process-pending-order'){const pendingOrders=store.get().pendingOrders;const order=Object.values(pendingOrders).flat().find(x=>x.id===button.dataset.id);if(order){modal={type:'pending-detail',order,anchor:modal?.anchor,dirty:false};showToast('開啟 '+order.id+' 核對流程');render();}}
      else if(action==='start-pending-review'){modal={type:'pending-review',order:modal.order,anchor:modal.anchor,dirty:false};render();}
      else if(action==='enlarge-proof'){modal={type:'proof',order:modal.order,anchor:modal.anchor,dirty:false};render();}
      else if(action==='back-to-pending-review'){modal={type:'pending-review',order:modal.order,anchor:modal.anchor,dirty:false};render();}
      else if(action==='report-payment-issue'){showToast('請掃描 WhatsApp QR Code 聯絡客人');}
      else if(action==='accept-pending-order'){const accepted=acceptPendingOrder(modal.order);store.set(state=>{state.pendingOrders={online:state.pendingOrders.online.filter(x=>x.id!==accepted.id),queue:state.pendingOrders.queue.filter(x=>x.id!==accepted.id)};state.runningOrders=state.runningOrders.concat(accepted);return state;});modal=null;queue.afterRender(()=>showToast('已接單 '+accepted.id+'；30分鐘後自動完成'));}
      else if(action==='set-order-mode')store.set(state=>({...state,quickMode:button.dataset.value==='quick'}));
      else if(action==='toggle-quick-drink-strip')updateSettings(s=>{s.quickDrinks.visible=s.quickDrinks.visible===false;});
      else if(action==='quick-display')updateSettings(s=>{s.quickDrinks.showImages=button.dataset.value==='image';});
      else if(action==='toggle-quick-assist')updateSettings(s=>{s.quickDrinks.quickAssist=s.quickDrinks.quickAssist===false;});
      else if(action==='setting-card')updateSettings(s=>{s.catalog.defaultTemplate=button.dataset.value;s.catalog.productOverrides={};});
      else if(action==='cart-width')updateSettings(s=>{s.cart.widthPercent=Number(button.dataset.value)||32;});
      else if(action==='cart-merge')updateSettings(s=>{s.cart.mergeMode=button.dataset.value;});
      else if(action==='toggle-cart-images')updateSettings(s=>{s.cart.showImages=s.cart.showImages===false;});
      else if(action==='toggle-code')updateSettings(s=>{s.catalog.showCode=!s.catalog.showCode;});
      else if(action==='toggle-accepting')store.set(state=>{state.operations.acceptingOrders=!state.operations.acceptingOrders;state.operations.immediateStopped=false;return state;});
      else if(action==='save-close-time'){const v=document.getElementById('scheduled-close')?.value||'';store.set(state=>{state.operations.scheduledClose=v;return state;});showToast('接單時間已更新');}
      else if(action==='immediate-stop')store.set(state=>{state.operations.acceptingOrders=false;state.operations.immediateStopped=true;return state;});
      else if(action==='resume-orders')store.set(state=>{state.operations.acceptingOrders=true;state.operations.immediateStopped=false;state.operations.scheduledClose='';return state;});
      else if(action==='detail-option'){
        markDirty();const g=button.dataset.group,v=button.dataset.value,multi=button.dataset.multi==='true';
        if(modal.type==='drink'){if(g==='sweetness')modal.draft.sweetness=modal.draft.sweetness===v?'':v;if(g==='ice')modal.draft.ice=modal.draft.ice===v?'':v;if(g.startsWith('group-sweetness-')){const x=Number(g.split('-').pop()),group=modal.draft.groups[x];group.sweetness=group.sweetness===v?'':v;}if(g.startsWith('group-ice-')){const x=Number(g.split('-').pop()),group=modal.draft.groups[x];group.ice=group.ice===v?'':v;}}
        else if(multi){const arr=modal.draft.options[g]||[];modal.draft.options[g]=arr.includes(v)?arr.filter(x=>x!==v):arr.concat(v);}else modal.draft.options[g]=modal.draft.options[g]===v?'':v;
        render();
      }
      else if(action==='detail-drink'){const parent=modal;modal={type:'drink',drinkId:button.dataset.id,context:'detail',maxQty:parent.draft.qty,parent,anchor:actionAnchor(button,anchorOverride),dirty:false,draft:{qty:parent.draft.qty,sweetness:'',ice:'',groups:[]}};render();}
      else if(action==='detail-qty'){markDirty();modal.draft.qty=Math.max(1,modal.draft.qty+Number(button.dataset.delta));render();}
      else if(action==='toggle-keypad'){modal.draft.keypad=!modal.draft.keypad;render();}
      else if(action==='keypad'){const key=button.dataset.key;if(key==='完成')modal.draft.keypad=false;else if(key==='←')modal.draft.keypadValue=modal.draft.keypadValue.slice(0,-1);else modal.draft.keypadValue=(modal.draft.keypadValue+key).replace(/^0+(?=\d)/,'');if(modal.draft.keypadValue)modal.draft.qty=Math.max(1,Number(modal.draft.keypadValue));markDirty();render();}
      else if(action==='apply-product')applyProduct();
      else if(action==='modifier-qty'){markDirty();modal.draft.qty=Math.max(0,Math.min(modal.maxQty,modal.draft.qty+Number(button.dataset.delta)));render();}
      else if(action==='group-qty'){markDirty();const g=modal.draft.groups[Number(button.dataset.index)];const used=modal.draft.qty+modal.draft.groups.reduce((n,x)=>n+x.qty,0);g.qty=Math.max(1,Math.min(g.qty+Number(button.dataset.delta),modal.maxQty-used+g.qty));render();}
      else if(action==='add-drink-group'){markDirty();const used=modal.draft.qty+modal.draft.groups.reduce((n,x)=>n+x.qty,0);if(used<modal.maxQty)modal.draft.groups.push({qty:1,sweetness:'',ice:'',open:true});else showToast('已達可補數量');render();}
      else if(action==='toggle-drink-adjustment'){const g=modal.draft.groups[Number(button.dataset.index)];g.open=!g.open;render();}
      else if(action==='apply-drink')applyDrink();
      else if(action==='quick-drink'){
        if(store.get().settings.quickDrinks.quickAssist===false){showToast('快捷補選已關閉');return;}
        const target=findDrinkTarget(store.get().cart),missing=pendingSummary(store.get().cart).drink;if(!missing||!target){showToast('目前沒有待補飲品');return;}pendingDrinkAssignment={lineId:target.lineId,name:target.name};openDrink(button.dataset.id,'global',missing,actionAnchor(button,anchorOverride));
      }
      else if(action==='complete-group'){modal.draft=completionDraft(button.dataset.group);modal.dirty=false;render();}
      else if(action==='completion-back'){modal.draft={activeGroup:'',activeTarget:'',assignments:{}};modal.dirty=false;render();}
      else if(action==='completion-target'){modal.draft.activeTarget=button.dataset.id;render();}
      else if(action==='completion-required-choice'){
        const target=modal.draft.activeTarget,value=button.dataset.value;if(!target)return;
        modal.draft.assignments={...(modal.draft.assignments||{}),[target]:value};modal.dirty=true;
        const targets=requiredTargets(store.get().cart,modal.draft.activeGroup),next=targets.find(item=>!modal.draft.assignments[item.id]);if(next)modal.draft.activeTarget=next.id;render();
      }
      else if(action==='completion-fill-remaining'){
        const value=button.dataset.value,targets=requiredTargets(store.get().cart,modal.draft.activeGroup);targets.forEach(target=>{if(!modal.draft.assignments[target.id])modal.draft.assignments[target.id]=value;});modal.dirty=true;render();
      }
      else if(action==='apply-required-group')applyRequiredGroup();
      else if(action==='linkup-all')applyLinkUp(Number(button.dataset.count)||0);
      else if(action==='open-specified-link'){const count=pairingGroupCount(store.get().cart),groups=Array.from({length:count},()=>({main:'',snack:'',drink:''}));if(!count){showToast('需要主餐及小食才可指定配對');return;}modal={type:'specified-link',anchor:actionAnchor(button,anchorOverride),dirty:false,draft:{groups,active:0}};render();}
      else if(action==='select-pairing-group'){modal.draft.active=Number(button.dataset.index)||0;render();}
      else if(action==='select-link-item'){const group=modal.draft.groups[modal.draft.active],role=button.dataset.role;group[role]=group[role]===button.dataset.id?'':button.dataset.id;render();}
      else if(action==='select-link-drink'){const group=modal.draft.groups[modal.draft.active];group.drink=group.drink===button.dataset.id?'':button.dataset.id;render();}
      else if(action==='apply-specified-link'){
        const groups=safeClone(modal.draft.groups.filter(group=>group.main&&group.snack));
        store.set(state=>{let next=state.cart;groups.forEach(group=>{const quickId=group.drink?.startsWith('quick:')?group.drink.slice(6):'',quick=quickId?drinkMap.get(quickId):null;next=combineRiceballSet(next,{mainLineId:group.main,snackLineId:group.snack,drinkLineId:quickId?'':group.drink,quickDrink:quick?{productId:quick.id,drinkId:quick.id,name:quick.name,image:quick.image,unitPrice:quick.price,selection:drinkSelection(quick.id)}:null},{comboId:stableId('combo'),lineId:stableId('line'),comboPrice:59,source:'specified'});});state.cart=normalizeCart(next,state.orderServiceMode);state.lastAffectedLineId=state.cart.at(-1)?.lineId||'';state.lastMutationKind='changed';return state;});modal=null;queue.afterRender(()=>showToast('已建立 '+groups.length+' 組指定套餐'));
      }
      else if(action==='select-combo-component'){const role=button.dataset.role,id=button.dataset.id,item=role==='drink'?drinkMap.get(id):productMap.get(id);if(!item)return;modal.draft.components=modal.draft.components.filter(component=>component.role!==role).concat({role,source:role==='drink'?'quick':'catalog',productId:item.id,drinkId:role==='drink'?item.id:'',name:item.name,image:item.image||'',unitPrice:Number(item.price||0),options:{}});modal.dirty=true;render();}
      else if(action==='clear-combo-component'){modal.draft.components=modal.draft.components.filter(component=>component.role!=='drink');modal.dirty=true;render();}
      else if(action==='apply-combo-edit'){const components=safeClone(modal.draft.components),lineId=modal.lineId,drink=components.find(item=>item.role==='drink');store.set(state=>{state.cart=state.cart.map(line=>line.lineId!==lineId?line:{...line,image:components.find(item=>item.role==='main')?.image||line.image,drinkAssignments:drink?[{drinkId:drink.productId,name:drink.name,image:drink.image||'',sweetness:'',ice:'',source:drink.source}]:[],combo:{...line.combo,components,missingRoles:drink?[]:['drink']}});state.lastAffectedLineId=lineId;state.lastMutationKind='changed';return state;});modal=null;queue.afterRender(()=>showToast('套餐組合已更新'));}
      else if(action==='request-dissolve-combo'){const line=store.get().cart.find(item=>item.lineId===modal.lineId);const singles=(line?.combo?.components||[]).reduce((sum,item)=>sum+Number(item.unitPrice||0),0);confirmState={kind:'dissolve',lineId:modal.lineId,title:'拆開套餐？',message:'拆開後會還原為獨立產品，並按單品價格重新計算（'+money(singles)+'）。'};render();}
      else if(action==='later-new-order'){newOrderNotice.visible=false;render();}
      else if(action==='process-new-order'){newOrderNotice.visible=false;modal={type:'pending',anchor:null,dirty:false};render();}
      else if(action==='clear-cart'){if(window.confirm('清空後不可恢復，確定清空整張購物車？'))store.set(state=>({...state,cart:[],orderServiceMode:state.dineContext?SERVICE_DINE_IN:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));}
      else if(action==='cancel-dine-order')requestDineCancellation();
      else if(action==='checkout'){
        const current=store.get();if(pendingSummary(current.cart).total){showToast('請先完成必選項目');return;}if(!current.cart.length)return;
        if(current.dineContext){try{const dineState=readJSON(DINE_STORAGE_KEY,null);const dineCart=applyOrderServiceMode(current.cart,SERVICE_DINE_IN);const next=commitTableOrder(dineState,current.dineContext,dineCart,{terminalId,history:readJSON(ORDER_HISTORY_STORAGE_KEY,[])});writeJSON(DINE_STORAGE_KEY,next);syncDinePrintJobs(next);store.set(state=>({...state,cart:[],draftSession:null,dineContext:null,orderServiceMode:SERVICE_TAKEAWAY,lastAffectedLineId:'',lastMutationKind:''}));window.parent?.postMessage?.({type:'morefun:navigate',route:'dine'},'*');}catch(error){showToast(error.message||'未能加入堂食枱位');}return;}
        window.parent?.postMessage?.({type:'morefun:navigate',route:'checkout'},'*');
      }
    }
    app.addEventListener('morefun:status-action',event=>{const button=event.target.closest('[data-action]');if(!button||button.disabled)return;event.preventDefault();handle(button,event.detail?.anchor||null);});
    app.addEventListener('click',event=>{if(event.target.classList?.contains('modal-scrim')){event.preventDefault();requestDismiss();return;}const button=event.target.closest('[data-action]');if(button&&!button.disabled)handle(button);});
    app.addEventListener('pointerdown',event=>{if(event.target.closest('.quick-drawer-panel'))scheduleQuickDrawerClose();});
    app.addEventListener('input',event=>{if(event.target.matches('[data-action="detail-note"]')&&modal?.type==='product'){modal.draft.note=event.target.value;markDirty();return;}if(event.target.matches('[data-action="search-query"]')&&modal?.type==='search'){const value=event.target.value;store.setTransient(state=>({...state,searchQuery:value}));queue.afterRender(()=>{const input=document.querySelector('[data-action="search-query"]');if(input){input.focus();input.setSelectionRange(value.length,value.length);}});}});
    addEventListener('message',event=>{if(event.data?.type==='morefun:page-activate'&&event.data.route==='order'){const current=readJSON(ORDER_STORAGE_KEY,null);if(current?.dineContext&&!store.get().dineContext)store.set(state=>({...state,dineContext:current.dineContext,orderServiceMode:SERVICE_DINE_IN,cart:applyOrderServiceMode(current.cart||[],SERVICE_DINE_IN)}));}});
    render();
    async function bootstrapLiveMenu(){
      const catalog=await loadMenuCatalog({fallback:fallbackCatalog});
      categories=[...(catalog.categories||fallbackCategories)];products=[...(catalog.products||fallbackProducts)];drinks=[...(catalog.drinks?.length?catalog.drinks:fallbackDrinks)];indexCatalog();
      store.set(state=>{if(!categories.includes(state.category))state.category='全部';const existing=state.settings.quickDrinks.order||[];state.settings.quickDrinks.order=[...existing.filter(id=>drinkMap.has(id)),...drinks.map(item=>item.id).filter(id=>!existing.includes(id))];state.health.catalog={ok:catalog.source!=='fallback',label:'餐牌',detail:catalog.source==='firebase'?'已連接 Firebase 餐牌來源':catalog.source==='cache'?'離線模式：使用上次餐牌':'Firebase 未連接：使用內置後備餐牌'};state.health.sync={...state.health.sync,detail:catalog.source==='firebase'?'餐牌同步正常':'餐牌等待重新連線'};return state;});
      showToast(catalog.source==='firebase'?'餐牌已同步':catalog.source==='cache'?'網絡未連接，已載入上次餐牌':'Firebase 未連接，現正使用後備餐牌');
    }
    bootstrapLiveMenu().catch(error=>{console.error('MENU_BOOTSTRAP_FAILED',error);showToast('餐牌連接失敗，已保留本機點單');});
    setTimeout(()=>{if(newOrderNotice?.visible){newOrderNotice.visible=false;render();}},3000);
    setInterval(()=>{const current=store.get();if(!current.runningOrders.length)return;const next=completeExpiredOrders(current.runningOrders);const completed=next.filter((order,index)=>order.status==='completed'&&current.runningOrders[index]?.status!=='completed');if(!completed.length)return;store.set(state=>{state.runningOrders=next.filter(order=>order.status==='running');state.completedOrders=state.completedOrders.concat(completed);return state;});},30000);
    
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/orders-drafts-ui.test.mjs:58:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: reverse checkout reuse loads the original cart then navigates to the locked ordering page
ok 203 - reverse checkout reuse loads the original cart then navigates to the locked ordering page
  ---
  duration_ms: 0.276627
  type: 'test'
  ...
# Subtest: 預設建立五部設備及四款由管理端發佈的示範格式
ok 204 - 預設建立五部設備及四款由管理端發佈的示範格式
  ---
  duration_ms: 2.737589
  type: 'test'
  ...
# Subtest: 網絡打印機必須有有效網絡地址、連接埠、紙寬、用途及格式
ok 205 - 網絡打印機必須有有效網絡地址、連接埠、紙寬、用途及格式
  ---
  duration_ms: 0.959214
  type: 'test'
  ...
# Subtest: 製作及打包統計同時提供每款產品與飲品、飯餐、飯團總數
ok 206 - 製作及打包統計同時提供每款產品與飲品、飯餐、飯團總數
  ---
  duration_ms: 13.051748
  type: 'test'
  ...
# Subtest: 四款格式生成可讀預覽，製作單及打包單頂部先顯示合併統計
ok 207 - 四款格式生成可讀預覽，製作單及打包單頂部先顯示合併統計
  ---
  duration_ms: 42.472183
  type: 'test'
  ...
# Subtest: 舊非 P 渠道訂單重印保留原識別而不會顯示測試工作
ok 208 - 舊非 P 渠道訂單重印保留原識別而不會顯示測試工作
  ---
  duration_ms: 0.527978
  type: 'test'
  ...
# Subtest: 打印工作按用途及格式路由，未設定設備會停在 blocked 而非假成功
ok 209 - 打印工作按用途及格式路由，未設定設備會停在 blocked 而非假成功
  ---
  duration_ms: 6.652069
  type: 'test'
  ...
# Subtest: 重試沿用同一工作並增加嘗試；改送會保存原目的地
ok 210 - 重試沿用同一工作並增加嘗試；改送會保存原目的地
  ---
  duration_ms: 0.488814
  type: 'test'
  ...
# Subtest: 安卓橋接封包包含傳輸資料、格式內容及冪等工作編號
ok 211 - 安卓橋接封包包含傳輸資料、格式內容及冪等工作編號
  ---
  duration_ms: 0.489655
  type: 'test'
  ...
# Subtest: 設備診斷會分開設定驗證、瀏覽器限制及安卓橋接狀態
ok 212 - 設備診斷會分開設定驗證、瀏覽器限制及安卓橋接狀態
  ---
  duration_ms: 0.703365
  type: 'test'
  ...
# Subtest: 現有訂單與堂食打印工作可去重匯入中央工作佇列
ok 213 - 現有訂單與堂食打印工作可去重匯入中央工作佇列
  ---
  duration_ms: 1.429924
  type: 'test'
  ...
# Subtest: seed frame stays hidden until child ready
ok 214 - seed frame stays hidden until child ready
  ---
  duration_ms: 1.394167
  type: 'test'
  ...
# Subtest: unlock does not force reload the active order page
ok 215 - unlock does not force reload the active order page
  ---
  duration_ms: 0.360173
  type: 'test'
  ...
# Subtest: page ready waits for stable frames
ok 216 - page ready waits for stable frames
  ---
  duration_ms: 1.721529
  type: 'test'
  ...
# Subtest: order overlay state stays event driven
ok 217 - order overlay state stays event driven
  ---
  duration_ms: 0.238867
  type: 'test'
  ...
# Subtest: responsive profile writes are deduplicated per frame
ok 218 - responsive profile writes are deduplicated per frame
  ---
  duration_ms: 0.239167
  type: 'test'
  ...
# Subtest: inactive preloaded pages do not keep overlay observers running
ok 219 - inactive preloaded pages do not keep overlay observers running
  ---
  duration_ms: 0.28368
  type: 'test'
  ...
# Subtest: 共用狀態欄永久包含品牌、終端、接單狀態及最近訂單
ok 220 - 共用狀態欄永久包含品牌、終端、接單狀態及最近訂單
  ---
  duration_ms: 1.549728
  type: 'test'
  ...
# Subtest: 共用底欄固定五項、同一套線性圖標及唯一選中項
ok 221 - 共用底欄固定五項、同一套線性圖標及唯一選中項
  ---
  duration_ms: 1.645056
  type: 'test'
  ...
# Subtest: 五個主要頁面全部使用共用狀態欄及底部導航
ok 222 - 五個主要頁面全部使用共用狀態欄及底部導航
  ---
  duration_ms: 0.284061
  type: 'test'
  ...
# Subtest: 五個主要頁面共用同一最近訂單顯示規則
ok 223 - 五個主要頁面共用同一最近訂單顯示規則
  ---
  duration_ms: 0.310761
  type: 'test'
  ...
# Subtest: 底欄高度、選中膠囊、字體及圖標只由共用樣式控制
not ok 224 - 底欄高度、選中膠囊、字體及圖標只由共用樣式控制
  ---
  duration_ms: 1.80759
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/shell-ui.test.mjs:41:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /\.bottom-nav\s*\{[^}]*height:\s*76px/s. Input:
    
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
      '  --bottom-nav-pad-y:clamp(3px,.55vh,6px);\n' +
      '  --bottom-nav-icon-size:clamp(21px,2.45vh,25px);\n' +
      '  --bottom-nav-item-pad-y:clamp(2px,.35vh,4px);\n' +
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
      '.bottom-nav{height:auto;min-height:calc(var(--bottom-nav-height) + env(safe-area-inset-bottom));display:grid;grid-template-columns:repeat(5,1fr);align-items:stretch;gap:10px;padding:var(--bottom-nav-pad-y) 16px calc(var(--bottom-nav-pad-y) + env(safe-area-inset-bottom));background:#fff;border-top:1px solid var(--line);flex:none;overflow:visible}\n' +
      '.bottom-nav button{position:relative;border:1px solid transparent;background:#fff;font-weight:850;font-size:calc(17px * var(--responsive-font-scale));line-height:1.15}\n' +
      '.shell-nav-button{display:grid;grid-template-rows:var(--bottom-nav-icon-size) auto;place-content:center;place-items:center;gap:2px;min-width:0;padding:var(--bottom-nav-item-pad-y) 12px;border-radius:var(--choice-pill-radius);overflow:visible}\n' +
      '.shell-nav-button.active{background:var(--orange-soft);border-color:color-mix(in srgb,var(--orange) 44%,white);color:var(--orange);box-shadow:0 3px 12px color-mix(in srgb,var(--orange) 15%,transparent)}\n' +
      '.shell-nav-icon{width:var(--bottom-nav-icon-size);height:var(--bottom-nav-icon-size);display:block;flex:none}\n' +
      '.shell-nav-badge{position:absolute;top:3px;left:calc(50% + 10px);min-width:20px;height:20px;padding:0 5px;display:grid;place-items:center;border-radius:999px;background:var(--red);color:#fff;font-size:11px}\n' +
      '\n' +
      ':is(.top-btn,.category-page>button,.category-search,.categories>button,.segmented>button,.channels>button,.payments>button,.option-grid>button,.option-chips>button,.source-picker>button,.tabs>button,.status-filter>button,.mode-choice,.issue-quick>button,.method-grid>button,.theme){border-radius:var(--choice-pill-radius)!important}\n' +
      ':is(.top-btn,.category-page>button,.category-search,.categories>button,.segmented>button,.channels>button,.payments>button,.option-grid>button,.option-chips>button,.source-picker>button,.tabs>button,.status-filter>button,.mode-choice,.issue-quick>button,.method-grid>button,.theme).active{background:var(--orange-soft)!important;border-color:color-mix(in srgb,var(--orange) 56%,white)!important;color:var(--orange)!important;box-shadow:0 3px 11px color-mix(in srgb,var(--orange) 14%,transparent)}\n' +
      '.global-statusbar{height:var(--topbar-height);min-height:var(--topbar-height)}\n' +
      '.shell-brand{display:flex;align-items:center;gap:9px;white-space:nowrap}.shell-brand-mark{width:38px;height:38px;display:grid;place-items:center;border-radius:50%;background:var(--orange);color:#fff;font-size:19px}.shell-brand strong{font-size:calc(25px * var(--responsive-font-scale))}\n' +
      '.shell-terminal,.shell-context,.shell-operation{min-height:38px;display:inline-flex;align-items:center;padding:0 12px;border:1px solid var(--line);border-radius:999px;background:#fff;font-weight:850;white-space:nowrap}.shell-terminal{background:var(--orange-soft);color:var(--orange)}.shell-operation{gap:8px}.shell-operation i{width:10px;height:10px;border-radius:50%;background:var(--green)}.shell-operation.offline i{background:var(--red)}\n' +
      '.shell-last-order{display:grid;gap:1px;min-width:92px}.shell-last-order small{color:var(--muted);font-size:12px}.shell-last-order strong{font-size:calc(20px * var(--responsive-font-scale))}.shell-actions{display:flex;align-items:center;gap:10px;min-width:0}\n' +
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
      '/* Global App Shell core mode: child pages retain their business logic while shell-owned chrome stays outside the page. */\n' +
      ':root[data-global-shell="1"] :is(.global-statusbar,.shell-bottom-nav,.bottom-nav,.topbar.statusbar){display:none}\n' +
      ':root[data-global-shell="1"] .app{height:100%;min-height:0}\n' +
      ':root[data-global-shell="1"] .workspace{min-height:0}\n' +
      ':root[data-global-shell="1"] body[data-page="more"] .more-heading{display:none}\n' +
      '\n' +
      ':root{--shadow-soft:0 4px 16px rgba(76,46,28,.08);--shadow-press:0 2px 7px rgba(76,46,28,.11);--radius-control:12px;--radius-card:18px;--motion-standard:cubic-bezier(.22,1,.36,1)}\n' +
      'button{-webkit-tap-highlight-color:transparent;touch-action:manipulation;transition:transform .16s var(--motion-standard),box-shadow .18s ease,background-color .18s ease,border-color .18s ease,color .18s ease,opacity .18s ease}\n' +
      'button:active:not(:disabled){transform:translateY(1px) scale(.975);box-shadow:var(--shadow-press)}\n' +
      'button:disabled{cursor:not-allowed;opacity:.42}\n' +
      'button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid color-mix(in srgb,var(--orange) 28%,transparent'... 1007 more characters
    
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
      --bottom-nav-pad-y:clamp(3px,.55vh,6px);
      --bottom-nav-icon-size:clamp(21px,2.45vh,25px);
      --bottom-nav-item-pad-y:clamp(2px,.35vh,4px);
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
    .bottom-nav{height:auto;min-height:calc(var(--bottom-nav-height) + env(safe-area-inset-bottom));display:grid;grid-template-columns:repeat(5,1fr);align-items:stretch;gap:10px;padding:var(--bottom-nav-pad-y) 16px calc(var(--bottom-nav-pad-y) + env(safe-area-inset-bottom));background:#fff;border-top:1px solid var(--line);flex:none;overflow:visible}
    .bottom-nav button{position:relative;border:1px solid transparent;background:#fff;font-weight:850;font-size:calc(17px * var(--responsive-font-scale));line-height:1.15}
    .shell-nav-button{display:grid;grid-template-rows:var(--bottom-nav-icon-size) auto;place-content:center;place-items:center;gap:2px;min-width:0;padding:var(--bottom-nav-item-pad-y) 12px;border-radius:var(--choice-pill-radius);overflow:visible}
    .shell-nav-button.active{background:var(--orange-soft);border-color:color-mix(in srgb,var(--orange) 44%,white);color:var(--orange);box-shadow:0 3px 12px color-mix(in srgb,var(--orange) 15%,transparent)}
    .shell-nav-icon{width:var(--bottom-nav-icon-size);height:var(--bottom-nav-icon-size);display:block;flex:none}
    .shell-nav-badge{position:absolute;top:3px;left:calc(50% + 10px);min-width:20px;height:20px;padding:0 5px;display:grid;place-items:center;border-radius:999px;background:var(--red);color:#fff;font-size:11px}
    
    :is(.top-btn,.category-page>button,.category-search,.categories>button,.segmented>button,.channels>button,.payments>button,.option-grid>button,.option-chips>button,.source-picker>button,.tabs>button,.status-filter>button,.mode-choice,.issue-quick>button,.method-grid>button,.theme){border-radius:var(--choice-pill-radius)!important}
    :is(.top-btn,.category-page>button,.category-search,.categories>button,.segmented>button,.channels>button,.payments>button,.option-grid>button,.option-chips>button,.source-picker>button,.tabs>button,.status-filter>button,.mode-choice,.issue-quick>button,.method-grid>button,.theme).active{background:var(--orange-soft)!important;border-color:color-mix(in srgb,var(--orange) 56%,white)!important;color:var(--orange)!important;box-shadow:0 3px 11px color-mix(in srgb,var(--orange) 14%,transparent)}
    .global-statusbar{height:var(--topbar-height);min-height:var(--topbar-height)}
    .shell-brand{display:flex;align-items:center;gap:9px;white-space:nowrap}.shell-brand-mark{width:38px;height:38px;display:grid;place-items:center;border-radius:50%;background:var(--orange);color:#fff;font-size:19px}.shell-brand strong{font-size:calc(25px * var(--responsive-font-scale))}
    .shell-terminal,.shell-context,.shell-operation{min-height:38px;display:inline-flex;align-items:center;padding:0 12px;border:1px solid var(--line);border-radius:999px;background:#fff;font-weight:850;white-space:nowrap}.shell-terminal{background:var(--orange-soft);color:var(--orange)}.shell-operation{gap:8px}.shell-operation i{width:10px;height:10px;border-radius:50%;background:var(--green)}.shell-operation.offline i{background:var(--red)}
    .shell-last-order{display:grid;gap:1px;min-width:92px}.shell-last-order small{color:var(--muted);font-size:12px}.shell-last-order strong{font-size:calc(20px * var(--responsive-font-scale))}.shell-actions{display:flex;align-items:center;gap:10px;min-width:0}
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
    
    /* Global App Shell core mode: child pages retain their business logic while shell-owned chrome stays outside the page. */
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
ok 225 - 分類、頁籤、分段、付款、來源及模式選擇共用膠囊規則
  ---
  duration_ms: 0.391392
  type: 'test'
  ...
# Subtest: 來源彈窗支援四方向箭嘴並由定位器標記實際方向
ok 226 - 來源彈窗支援四方向箭嘴並由定位器標記實際方向
  ---
  duration_ms: 0.393415
  type: 'test'
  ...
# node:fs:440
#     return binding.readFileUtf8(path, stringToFlags(options.flag));
#                    ^
# Error: ENOENT: no such file or directory, open '/home/runner/work/morefunos-smt/morefunos-smt/pages/soldout/soldout-enhancements.css'
#     at Object.readFileSync (node:fs:440:20)
#     at file:///home/runner/work/morefunos-smt/morefunos-smt/tests/soldout-page.test.mjs:7:23
#     at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
#     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
#     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5) {
#   errno: -2,
#   code: 'ENOENT',
#   syscall: 'open',
#   path: '/home/runner/work/morefunos-smt/morefunos-smt/pages/soldout/soldout-enhancements.css'
# }
# Node.js v22.23.1
# Subtest: tests/soldout-page.test.mjs
not ok 25 - tests/soldout-page.test.mjs
  ---
  duration_ms: 52.913876
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/soldout-page.test.mjs:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
1..227
# tests 227
# suites 0
# pass 195
# fail 32
# cancelled 0
# skipped 0
# todo 0
# duration_ms 767.842213
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

TEST_STATUS=1
SYNTAX_STATUS=0
RESULT=FAIL
