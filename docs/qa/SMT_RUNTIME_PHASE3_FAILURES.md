# SMT Runtime Phase 3 Failure Summary

## Failed subtests / files
not ok 1 - Work and Chat entries point to current baseline
    The input did not match the regular expression /order-v1-31/. Input:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 2 - knowledge graph edges resolve and carry evidence
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
# Subtest: tests/cart-checkout-regression-v2.test.mjs
# Subtest: tests/global-status-actions-contract.test.mjs
# Subtest: tests/health-seal-contract.test.mjs
not ok 73 - 營業日固定由早上五時起計並排除上一營業日訂單
    Expected values to be strictly equal:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 74 - 報表分開淨銷售、付款、平台結算、待核實及打印異常
    Expected values to be strictly equal:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 75 - 歷史報表支援今日昨日七日三十日三個月六個月及自訂日期
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 76 - 選定歷史範圍會由訂單明細重算而不是只讀今日
    Expected values to be strictly equal:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 77 - 付款及渠道分拆提供對數欄位、狀態及對應訂單
    Expected values to be strictly equal:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 78 - 結帳、堂食及舊核數的付款別名會合併到同一對數方式
    Expected values to be strictly deep-equal:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 79 - 未知付款方式歸入其他而不會製造無限新分類
    Expected values to be strictly deep-equal:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 80 - 堂食分拆付款按每次實收方式對數而不只顯示組合付款
    Expected values to be strictly deep-equal:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 81 - 付款實收讀取真正 paidAmount 並保留短收及多收的正負差額
not ok 82 - 現金對數以收款減找續計算，不會把找續再扣一次
not ok 83 - 平台付款別名統一顯示為平台代收
    Expected values to be strictly deep-equal:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 84 - 商品分類、時段及異常資料保留對應訂單供介面下鑽
not ok 85 - 異常報表會由現有 audit 列出付款更改、部分取消、重印及付款問題
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 86 - 異常操作按 audit 發生時間入報表並保留跨日原訂單下鑽
not ok 90 - 日結按實點現金反推待核實訂單的現金及非現金部分
    Expected values to be strictly equal:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 91 - 日結保存現金、支出、差異、版本及稽核而不改寫訂單
not ok 92 - 超出百分之三差異而沒有原因不可正式日結
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 93 - 超出百分之三差異必須明確授權，並保存提取及留底現金
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 94 - 提取及留底現金必須完整分配實點現金
    The input did not match the regular expression /提取及留底/. Input:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
    getActual (node:assert:609:5)
not ok 95 - CSV 匯出包含摘要、訂單及商品明細並正確處理逗號
    The input did not match the regular expression /P100/. Input:
      '"cashExpected","0"\r\n' +
      '"electronicExpected","0"\r\n' +
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
    "cashExpected","0"
    "electronicExpected","0"
# AssertionError [ERR_ASSERTION]: missing responsive More contract: body[data-page="more"] .more-workspace{container-type:size;container-name:more-workspace}
#   code: 'ERR_ASSERTION',
# Subtest: tests/more-responsive-contract.test.mjs
not ok 14 - tests/more-responsive-contract.test.mjs
# Subtest: tests/order-cart-domain.test.mjs
not ok 128 - checkout call to action shows the payable total
    The input did not match the regular expression /:\s*'結帳 '\+money\(cartTotal\(state\.cart\)\)/. Input:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 138 - shell uses a fixed T2S canvas fitted inside both viewport dimensions
    The input did not match the regular expression /logicalHeight/. Input:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 139 - root height chain and scroll regions keep both bars fixed
    The input did not match the regular expression /#app\{width:1920px;height:100%;min-height:0;overflow:hidden\}/. Input:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 152 - paused products sort to the end of their current order category
    The input did not match the regular expression /const filtered=sortPausedLast/. Input:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 163 - 子頁啟動錯誤會顯示可見後備畫面而不是白屏
    The input did not match the regular expression /morefun:page-runtime-error/. Input:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 165 - all drink selection surfaces share the same vertical card language
    The input did not match the regular expression /drinkChoiceCard\(d,'completion-drink'.*'completion'\)/. Input:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
# Subtest: tests/order-required-completion-core.test.mjs
not ok 202 - 每件產品保存獨立堂食或外賣選擇
    The input did not match the regular expression /service-mode/. Input:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
not ok 224 - 底欄高度、選中膠囊、字體及圖標只由共用樣式控制
    The input did not match the regular expression /\.bottom-nav\s*\{[^}]*height:\s*76px/s. Input:
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
# Error: ENOENT: no such file or directory, open '/home/runner/work/morefunos-smt/morefunos-smt/pages/soldout/soldout-enhancements.css'
#   code: 'ENOENT',
# Subtest: tests/soldout-page.test.mjs
not ok 25 - tests/soldout-page.test.mjs

## Totals
# tests 227
# pass 195
# fail 32
# cancelled 0
# skipped 0
# todo 0
