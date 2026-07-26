# SMT Runtime Phase 3 Failure Summary

## Failed tests with context
not ok 1 - Work and Chat entries point to current baseline
  ---
  duration_ms: 13.947214
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/ai-context.test.mjs:8:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /order-v1-31/. Input:
    
    '# 磨飯 SMT｜AI Start Here\n' +
      '\n' +
      '> **第一步：完整閱讀 SMT Development Standard 三份 PRIMARY STANDARD。任何 AI／Codex／Work／工程代理未完成閱讀前，禁止分析後直接改碼。**\n' +
      '\n' +
--
not ok 2 - knowledge graph edges resolve and carry evidence
  ---
  duration_ms: 41.208408
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/ai-context.test.mjs:17:1'
  failureType: 'testCodeFailure'
  error: |-
    The expression evaluated to a falsy value:
    
      assert.ok(['EXTRACTED', 'INFERRED'].includes(edge.evidence))
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
--
# Subtest: tests/cart-checkout-regression-v2.test.mjs
ok 2 - tests/cart-checkout-regression-v2.test.mjs
  ---
  duration_ms: 41.826065
  type: 'test'
  ...
# Subtest: 分類版面設定只接受每行五至七格、一至兩行及搜尋開關
ok 5 - 分類版面設定只接受每行五至七格、一至兩行及搜尋開關
  ---
  duration_ms: 2.190797
  type: 'test'
  ...
# Subtest: 搜尋開啟時佔最後一行最後一格，超出首屏分類保留在可操作溢出清單
--
# Subtest: tests/global-status-actions-contract.test.mjs
ok 8 - tests/global-status-actions-contract.test.mjs
  ---
  duration_ms: 55.185028
  type: 'test'
  ...
# SMT_HEALTH_SEAL_CONTRACT_OK
# Subtest: tests/health-seal-contract.test.mjs
ok 9 - tests/health-seal-contract.test.mjs
  ---
  duration_ms: 48.702603
  type: 'test'
  ...
# Subtest: Firebase keyed catalog normalizes categories, products and availability
ok 63 - Firebase keyed catalog normalizes categories, products and availability
  ---
  duration_ms: 2.518123
  type: 'test'
  ...
# Subtest: remote products use live values while inheriting locked SMT behaviour by code
--
not ok 73 - 營業日固定由早上五時起計並排除上一營業日訂單
  ---
  duration_ms: 3.129643
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:31:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:
    + actual - expected
    
    + 1784696400000
    - 1784667600000
           ^
--
not ok 74 - 報表分開淨銷售、付款、平台結算、待核實及打印異常
  ---
  duration_ms: 1.292728
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:40:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:
    
    0 !== 3
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
--
not ok 75 - 歷史報表支援今日昨日七日三十日三個月六個月及自訂日期
  ---
  duration_ms: 0.645157
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:59:1'
  failureType: 'testCodeFailure'
  error: |-
    today
    + actual - expected
    
    + 1784696400000
    - 1784667600000
           ^
--
not ok 76 - 選定歷史範圍會由訂單明細重算而不是只讀今日
  ---
  duration_ms: 196.063833
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:85:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:
    
    0 !== 239
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
--
not ok 77 - 付款及渠道分拆提供對數欄位、狀態及對應訂單
  ---
  duration_ms: 0.832707
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:98:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:
    
    0 !== 79.67
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
--
not ok 78 - 結帳、堂食及舊核數的付款別名會合併到同一對數方式
  ---
  duration_ms: 2.697735
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:119:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly deep-equal:
    + actual - expected
    
    + {}
    - {
    -   '微信支付': 3,
--
not ok 79 - 未知付款方式歸入其他而不會製造無限新分類
  ---
  duration_ms: 0.407081
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:138:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly deep-equal:
    + actual - expected
    
    + []
    - [
    -   [
--
not ok 80 - 堂食分拆付款按每次實收方式對數而不只顯示組合付款
  ---
  duration_ms: 2.523058
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:145:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly deep-equal:
    + actual - expected
    
    + []
    - [
    -   [
--
not ok 81 - 付款實收讀取真正 paidAmount 並保留短收及多收的正負差額
  ---
  duration_ms: 1.785646
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
--
not ok 82 - 現金對數以收款減找續計算，不會把找續再扣一次
  ---
  duration_ms: 0.73818
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
--
not ok 83 - 平台付款別名統一顯示為平台代收
  ---
  duration_ms: 1.341279
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:178:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly deep-equal:
    + actual - expected
    
      [
        [
          '平台代收',
--
not ok 84 - 商品分類、時段及異常資料保留對應訂單供介面下鑽
  ---
  duration_ms: 0.301003
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
--
not ok 85 - 異常報表會由現有 audit 列出付款更改、部分取消、重印及付款問題
  ---
  duration_ms: 0.573293
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
--
not ok 86 - 異常操作按 audit 發生時間入報表並保留跨日原訂單下鑽
  ---
  duration_ms: 0.280184
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
--
not ok 90 - 日結按實點現金反推待核實訂單的現金及非現金部分
  ---
  duration_ms: 0.470069
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:243:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:
    
    40 !== 140
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
--
not ok 91 - 日結保存現金、支出、差異、版本及稽核而不改寫訂單
  ---
  duration_ms: 0.548837
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
--
not ok 92 - 超出百分之三差異而沒有原因不可正式日結
  ---
  duration_ms: 0.541543
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
--
not ok 93 - 超出百分之三差異必須明確授權，並保存提取及留底現金
  ---
  duration_ms: 0.375913
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
--
not ok 94 - 提取及留底現金必須完整分配實點現金
  ---
  duration_ms: 0.409696
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:280:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /提取及留底/. Input:
    
    'Error: 現金差異超出門檻，必須填寫差異原因'
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
--
not ok 95 - CSV 匯出包含摘要、訂單及商品明細並正確處理逗號
  ---
  duration_ms: 0.980955
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/more-operations-domain.test.mjs:287:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /P100/. Input:
    
    '﻿"磨飯 SMT","營業報表","2026-07-22"\r\n' +
      '\r\n' +
      '"營業摘要","數值"\r\n' +
      '"completedOrders","0"\r\n' +
--
# Subtest: tests/more-responsive-contract.test.mjs
not ok 14 - tests/more-responsive-contract.test.mjs
  ---
  duration_ms: 45.590779
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
  duration_ms: 47.515004
  type: 'test'
  ...
# Subtest: quick mode uses a direct-add product action
ok 122 - quick mode uses a direct-add product action
  ---
  duration_ms: 2.303288
  type: 'test'
  ...
# Subtest: cart rows expose separate quantity and edit controls
--
not ok 128 - checkout call to action shows the payable total
  ---
  duration_ms: 1.540331
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:50:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /:\s*'結帳 '\+money\(cartTotal\(state\.cart\)\)/. Input:
    
    "import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';\n" +
      "import {ORDER_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,SETTINGS_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,DINE_STORAGE_KEY,SUPPLY_STORAGE_KEY,PRINTER_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';\n" +
      "import {clearExpiredBusinessDayDrafts,createDraftRecord,normalizeTerminalId,restoreDraftForTerminal} from '../../shared/operations.js';\n" +
      "import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';\n" +
--
not ok 138 - shell uses a fixed T2S canvas fitted inside both viewport dimensions
  ---
  duration_ms: 26.779063
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:111:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /logicalHeight/. Input:
    
    "import {applyResponsiveProfile,getResponsiveProfile} from './shared/responsive.js';\n" +
      '\n' +
      "const stage=document.getElementById('stage');\n" +
      "const seedFrame=document.getElementById('page');\n" +
--
not ok 139 - root height chain and scroll regions keep both bars fixed
  ---
  duration_ms: 6.560302
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:118:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /#app\{width:1920px;height:100%;min-height:0;overflow:hidden\}/. Input:
    
    "@import url('./responsive.css');\n" +
      '\n' +
      ':root {\n' +
      '  --orange: #ef5218;\n' +
--
not ok 152 - paused products sort to the end of their current order category
  ---
  duration_ms: 0.471522
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:206:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /const filtered=sortPausedLast/. Input:
    
    "import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';\n" +
      "import {ORDER_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,SETTINGS_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,DINE_STORAGE_KEY,SUPPLY_STORAGE_KEY,PRINTER_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';\n" +
      "import {clearExpiredBusinessDayDrafts,createDraftRecord,normalizeTerminalId,restoreDraftForTerminal} from '../../shared/operations.js';\n" +
      "import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';\n" +
--
not ok 163 - 子頁啟動錯誤會顯示可見後備畫面而不是白屏
  ---
  duration_ms: 21.113467
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:274:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /morefun:page-runtime-error/. Input:
    
    "import {applyResponsiveProfile,getResponsiveProfile} from './shared/responsive.js';\n" +
      '\n' +
      "const stage=document.getElementById('stage');\n" +
      "const seedFrame=document.getElementById('page');\n" +
--
not ok 165 - all drink selection surfaces share the same vertical card language
  ---
  duration_ms: 0.844158
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/order-edit-flow.test.mjs:291:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /drinkChoiceCard\(d,'completion-drink'.*'completion'\)/. Input:
    
    "import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';\n" +
      "import {ORDER_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,SETTINGS_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,DINE_STORAGE_KEY,SUPPLY_STORAGE_KEY,PRINTER_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';\n" +
      "import {clearExpiredBusinessDayDrafts,createDraftRecord,normalizeTerminalId,restoreDraftForTerminal} from '../../shared/operations.js';\n" +
      "import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';\n" +
--
# Subtest: tests/order-required-completion-core.test.mjs
ok 18 - tests/order-required-completion-core.test.mjs
  ---
  duration_ms: 61.662734
  type: 'test'
  ...
# Subtest: order runtime does not load post-render drink enhancer
ok 179 - order runtime does not load post-render drink enhancer
  ---
  duration_ms: 1.399938
  type: 'test'
  ...
# Subtest: drink assignment badges render from assignment state
--
not ok 202 - 每件產品保存獨立堂食或外賣選擇
  ---
  duration_ms: 2.067767
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/orders-drafts-ui.test.mjs:57:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /service-mode/. Input:
    
    "import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';\n" +
      "import {ORDER_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,SETTINGS_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,DINE_STORAGE_KEY,SUPPLY_STORAGE_KEY,PRINTER_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';\n" +
      "import {clearExpiredBusinessDayDrafts,createDraftRecord,normalizeTerminalId,restoreDraftForTerminal} from '../../shared/operations.js';\n" +
      "import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';\n" +
--
not ok 224 - 底欄高度、選中膠囊、字體及圖標只由共用樣式控制
  ---
  duration_ms: 1.429884
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/shell-ui.test.mjs:41:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /\.bottom-nav\s*\{[^}]*height:\s*76px/s. Input:
    
    "@import url('./responsive.css');\n" +
      '\n' +
      ':root {\n' +
      '  --orange: #ef5218;\n' +
--
# Subtest: tests/soldout-page.test.mjs
not ok 25 - tests/soldout-page.test.mjs
  ---
  duration_ms: 57.731166
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

## Totals
# tests 227
# pass 195
# fail 32
# cancelled 0
# skipped 0
# todo 0
