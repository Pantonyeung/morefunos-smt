# SMT Runtime Phase 3 QA

Commit: 3820735f661a684451d9190e10a0b97573661bad

## QA environment setup
```text
NPM_SETUP_OUTCOME=success
BROWSER_SETUP_OUTCOME=success
SERVER_SETUP_OUTCOME=success
```

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
CLEARED V1_CART_INTERNAL_VISUAL_AUTHORITY
CLEARED V2_DRINK_CARD_LEGACY_PAGE_CSS
CLEARED V9_PRODUCT_CARD_LEGACY_PAGE_CSS
CLEARED PAIRING_MODAL_LEGACY_PAGE_CSS

Authority audit passed for locked boundaries. Known migrations remain visible until consolidated.
```

## node --test tests/*.test.mjs
```text
TAP version 13
# Subtest: Work and Chat entries point to current baseline
not ok 1 - Work and Chat entries point to current baseline
  ---
  duration_ms: 11.000184
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/ai-context.test.mjs:8:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /SMT Development Standard/. Input:
    
    '# SMT Context Min｜新對話最小上下文\n' +
      '\n' +
      '你正在協助開發香港餐飲 POS「磨飯 SMT」。正式功能基準分支：`smt-functional-completeness-v1`。\n' +
      '\n' +
      '## 開工必讀\n' +
      '任何 AI／Codex／Work 開始前先讀：\n' +
      '1. `AGENTS.md`\n' +
      '2. `docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`\n' +
      '3. `docs/MFKG_STANDARD_V1.0.md`\n' +
      '4. `docs/SMT_ADAPTIVE_APPLICATION_STANDARD_V1.0.md`\n' +
      '5. `docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md`\n' +
      '6. `docs/SMT_EXTERNAL_ENGINEERING_REFERENCE_STANDARD_V1.0.md`\n' +
      '7. `docs/qa/SMT_ENGINEERING_SUCCESS_AND_PITFALLS_V1.0.md`\n' +
      '8. `SMT_CHANGE_IMPACT.md`\n' +
      '9. 最新 `docs/qa/SMT_RUNTIME_PHASE3_QA.md`\n' +
      '\n' +
      'GitHub = 程式／工程 Authority；Google Drive = 後端／設定／歷史參考；Jade = AI 接手導航。禁止建立第二套真相。\n' +
      '\n' +
      '## 核心硬規則\n' +
      '- 1920×1080 = 唯一視覺封板模板；1600×900、1440×900、1366×768、1280×800 只做同一 App Adaptive Regression。\n' +
      '- 一項決策只可有一個 Authority；發現兩套 State／Domain／Visual／Payload 真相先收口再改功能。\n' +
      '- 程式存在 ≠ 自動測試 PASS ≠ Browser QA PASS ≠ 實機 PASS ≠ 最終 Lock。\n' +
      '- SMT／SMM 共用同一 Domain／資料模型／Business Rule；SMM 只係手機衍生 UI，打印交 SMT／打印端。\n' +
      '- D-052：APK-first。先穩定 Android Shell／Bridge／Recovery／Update／Print 底層，再逐步接 Web／UI／業務模組。\n' +
      '\n' +
      '# CURRENT A／B／C｜2026-07-27\n' +
      '\n' +
      '## A｜五尺寸 Browser QA\n' +
      '正式 Authority：`.github/workflows/qa-runtime-phase3.yml`。\n' +
      '\n' +
      '已做：\n' +
      '- 每個 Playwright spec 180 秒 timeout；\n' +
      '- PASS／FAIL／TIMEOUT 摘要；\n' +
      '- Playwright artifact；\n' +
      '- 最終 `RESULT=PASS` hard gate；\n' +
      '- 已備份：`backup/qa-runtime-before-browser-summary-20260727`。\n' +
      '\n' +
      '真實狀態：\n' +
      '- 最新 `docs/qa/SMT_RUNTIME_PHASE3_QA.md` 仍係舊 `Commit: e2145bc3dd48a46127d1abc33aa035fc1bea24d7`；\n' +
      '- 因此**禁止聲稱最新五尺寸 PASS**；\n' +
      '- 舊 bounded QA 已知 Authority／AI Context／Node／Server 前置 PASS，Browser regression 為唯一失敗層；\n' +
      '- 下一步：令正式 QA 產生對齊最新 base HEAD 嘅 report，再只修真正 fail spec，禁止倒退 Current Authority。\n' +
      '\n' +
      '## B｜Printer Module V1｜PR #17\n' +
      'Branch：`printer-transport-settings-v1`\n' +
      'PR：#17 `Printer Module V1｜Transport + Media + Driver + Failover Settings`\n' +
      '最新 head：`91864cceb0d37e7fbe7ec6994019355a3ffe5ff6` 之後仍有持續提交；接手時必須 fresh-read PR head。\n' +
      '\n' +
      '已建立：\n' +
      '- Sunmi／LAN TCP transport；\n' +
      '- 五部打印機獨立 IP／Port；\n' +
      '- Media Profile：roll／label，尺寸任意可設，不硬鎖 80／50mm；\n' +
      '- Driver Profile：`escpos/tspl/epl/zpl/dpl/raw`，encoding／cut／density／speed；\n' +
      '- Primary／Fallback、manual／auto failover、reroute history；\n' +
      '- Settings Model／UI Model／Controller／Renderer；\n' +
      '- `morefun.print.asset.v1` Rendered Asset Contract；\n' +
      '- ESC/POS raster renderer；\n' +
      '- TSPL bitmap renderer；\n' +
      '- Template Layout Plan；\n' +
      '- Browser/WebView Rasterizer；\n' +
      '- 單一路徑 Render Pipeline；\n' +
      '- B↔C `morefun.print.v1` binary Payload Builder；\n' +
      '- Print Domain 已收口：LAN 正式路徑只接受 Rendered Binary Asset；紙張尺寸跟 Media Profile 驗證。\n' +
      '\n' +
      '正式打印鏈：\n' +
      '`Print Document → Layout Plan → WebView Raster → ESC/POS/TSPL Binary Asset → morefun.print.v1 Payload → Android TCP Bridge`\n' +
      '\n' +
      '禁止倒退：\n' +
      '- Native 不解析模板；\n' +
      '- Native 不揀 fallback；\n' +
      '- LAN raw TCP write 不等於打印格式成功；\n' +
      '- ZPL／EPL／DPL 暫只係可設定 Driver Profile，未有 Renderer 前不得聲稱正式支援。\n' +
      '\n' +
      '整合風險：\n' +
      '- PR #17 相對 base 已 diverged；最近一次 compare = ahead 55／behind 22，merge-base `7cded53e...`；\n' +
      '- 呢個符合隔離模組策略，但正式整合前必須由最新 base 建 integration branch，再跑 Printer Contract + 全量 Node + Browser QA；禁止直接硬 merge。\n' +
      '- GitHub Actions 對 API commit 觸發暫有不穩定；未取得最新 Printer Contract CI evidence 前不得合併。\n' +
      '\n' +
      '## C｜APK Foundation｜PR #19｜最高工程優先\n' +
      'Branch：`apk-foundation-v1`\n' +
      'PR：#19 `APK Foundation V1｜Android 6–11 Shell + Versioned Native Bridge`\n' +
      '最新已驗 head：`36512925d38c66e1993b2ca216898cfe4acd8216`\n' +
      '\n' +
      '兼容基準：\n' +
      '- T2 Android 6.0.1 / API 23 = 災難後備最低線；\n' +
      '- T2S Android 9 / API 28；\n' +
      '- 新 POS Android 11 / API 30。\n' +
      '\n' +
      '已建立：\n' +
      '- Kotlin 單 Activity Shell；\n' +
      '- WebViewAssetLoader；\n' +
      '- 新 WebView origin-restricted WebMessage；舊 WebView fallback `LegacyBridgeAdapter`；\n' +
      '- `minSdk=23`、compile/target=36、AndroidX WebKit 1.15.0；\n' +
      '- Device／Terminal identity；Network status；Kiosk 基礎；\n' +
      '- LAN TCP Socket；\n' +
      '- 真實 `printed/failed` callback；\n' +
      '- idempotency ledger；\n' +
      '- `content.base64` exact binary bytes；binary 模式不自行加換行／切紙／模板命令。\n' +
      '\n' +
      '最新 Build evidence：\n' +
      '- workflow run `30262432561` = COMPLETED / SUCCESS；\n' +
      '- Authority Gate、Android SDK、Gradle Build、APK exists、artifact upload 全 PASS；\n' +
      '- artifact id `8651471180`；GitHub digest `sha256:356b1ee91e1a5d61db05b77f3259a2065a05cbc86a2884763e2188ba15fd2f8b`；\n' +
      '- 對話工作區 ZIP：`/mnt/data/MoreFun_SMT_APK_Foundation_Latest_Debug.zip`；\n' +
      '- 解壓 APK：1,367,821 bytes；SHA-256 `c1806dbff77a64cecc55de861dbf20c0084378104f3bb593c1ad60860b6e7fb8`。\n' +
      '\n' +
      '注意：Build PASS ≠ 實機 PASS。\n' +
      '\n' +
      '下一個 C Gate：\n' +
      '`T2 API23 安裝／啟動 → Bridge diagnostic → LAN TCP → duplicate suppression → ESC/POS raster 中文／切紙 → TSPL label bitmap → T2S API28 回歸 → 新 POS API30 回歸`\n' +
      '\n' +
      '## 備份／Rollback\n' +
      '- `backup/apk-foundation-pre-android6-20260727`\n' +
      '- `backup/qa-runtime-before-browser-summary-20260727`\n' +
      '- 舊 APK artifacts 保留作 rollback，不可當 latest。\n' +
      '\n' +
      '## 強制接手規則\n' +
      '任何 checkpoint 都假設下一句可能由另一個 AI 接手。最少保留：目標、Repo／Branch／PR、latest head、完成／未完成、CI／QA 層級、已知根因、禁止倒退事項、backup／rollback、下一步唯一優先、待實機 Gate。\n' +
      '\n' +
      '若要改程式，必須 fresh-read 正式 repository、`AGENTS.md` 必讀鏈及各 PR 最新 head；聊天摘要不得取代 GitHub Authority。\n'
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    # SMT Context Min｜新對話最小上下文
    
    你正在協助開發香港餐飲 POS「磨飯 SMT」。正式功能基準分支：`smt-functional-completeness-v1`。
    
    ## 開工必讀
    任何 AI／Codex／Work 開始前先讀：
    1. `AGENTS.md`
    2. `docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`
    3. `docs/MFKG_STANDARD_V1.0.md`
    4. `docs/SMT_ADAPTIVE_APPLICATION_STANDARD_V1.0.md`
    5. `docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md`
    6. `docs/SMT_EXTERNAL_ENGINEERING_REFERENCE_STANDARD_V1.0.md`
    7. `docs/qa/SMT_ENGINEERING_SUCCESS_AND_PITFALLS_V1.0.md`
    8. `SMT_CHANGE_IMPACT.md`
    9. 最新 `docs/qa/SMT_RUNTIME_PHASE3_QA.md`
    
    GitHub = 程式／工程 Authority；Google Drive = 後端／設定／歷史參考；Jade = AI 接手導航。禁止建立第二套真相。
    
    ## 核心硬規則
    - 1920×1080 = 唯一視覺封板模板；1600×900、1440×900、1366×768、1280×800 只做同一 App Adaptive Regression。
    - 一項決策只可有一個 Authority；發現兩套 State／Domain／Visual／Payload 真相先收口再改功能。
    - 程式存在 ≠ 自動測試 PASS ≠ Browser QA PASS ≠ 實機 PASS ≠ 最終 Lock。
    - SMT／SMM 共用同一 Domain／資料模型／Business Rule；SMM 只係手機衍生 UI，打印交 SMT／打印端。
    - D-052：APK-first。先穩定 Android Shell／Bridge／Recovery／Update／Print 底層，再逐步接 Web／UI／業務模組。
    
    # CURRENT A／B／C｜2026-07-27
    
    ## A｜五尺寸 Browser QA
    正式 Authority：`.github/workflows/qa-runtime-phase3.yml`。
    
    已做：
    - 每個 Playwright spec 180 秒 timeout；
    - PASS／FAIL／TIMEOUT 摘要；
    - Playwright artifact；
    - 最終 `RESULT=PASS` hard gate；
    - 已備份：`backup/qa-runtime-before-browser-summary-20260727`。
    
    真實狀態：
    - 最新 `docs/qa/SMT_RUNTIME_PHASE3_QA.md` 仍係舊 `Commit: e2145bc3dd48a46127d1abc33aa035fc1bea24d7`；
    - 因此**禁止聲稱最新五尺寸 PASS**；
    - 舊 bounded QA 已知 Authority／AI Context／Node／Server 前置 PASS，Browser regression 為唯一失敗層；
    - 下一步：令正式 QA 產生對齊最新 base HEAD 嘅 report，再只修真正 fail spec，禁止倒退 Current Authority。
    
    ## B｜Printer Module V1｜PR #17
    Branch：`printer-transport-settings-v1`
    PR：#17 `Printer Module V1｜Transport + Media + Driver + Failover Settings`
    最新 head：`91864cceb0d37e7fbe7ec6994019355a3ffe5ff6` 之後仍有持續提交；接手時必須 fresh-read PR head。
    
    已建立：
    - Sunmi／LAN TCP transport；
    - 五部打印機獨立 IP／Port；
    - Media Profile：roll／label，尺寸任意可設，不硬鎖 80／50mm；
    - Driver Profile：`escpos/tspl/epl/zpl/dpl/raw`，encoding／cut／density／speed；
    - Primary／Fallback、manual／auto failover、reroute history；
    - Settings Model／UI Model／Controller／Renderer；
    - `morefun.print.asset.v1` Rendered Asset Contract；
    - ESC/POS raster renderer；
    - TSPL bitmap renderer；
    - Template Layout Plan；
    - Browser/WebView Rasterizer；
    - 單一路徑 Render Pipeline；
    - B↔C `morefun.print.v1` binary Payload Builder；
    - Print Domain 已收口：LAN 正式路徑只接受 Rendered Binary Asset；紙張尺寸跟 Media Profile 驗證。
    
    正式打印鏈：
    `Print Document → Layout Plan → WebView Raster → ESC/POS/TSPL Binary Asset → morefun.print.v1 Payload → Android TCP Bridge`
    
    禁止倒退：
    - Native 不解析模板；
    - Native 不揀 fallback；
    - LAN raw TCP write 不等於打印格式成功；
    - ZPL／EPL／DPL 暫只係可設定 Driver Profile，未有 Renderer 前不得聲稱正式支援。
    
    整合風險：
    - PR #17 相對 base 已 diverged；最近一次 compare = ahead 55／behind 22，merge-base `7cded53e...`；
    - 呢個符合隔離模組策略，但正式整合前必須由最新 base 建 integration branch，再跑 Printer Contract + 全量 Node + Browser QA；禁止直接硬 merge。
    - GitHub Actions 對 API commit 觸發暫有不穩定；未取得最新 Printer Contract CI evidence 前不得合併。
    
    ## C｜APK Foundation｜PR #19｜最高工程優先
    Branch：`apk-foundation-v1`
    PR：#19 `APK Foundation V1｜Android 6–11 Shell + Versioned Native Bridge`
    最新已驗 head：`36512925d38c66e1993b2ca216898cfe4acd8216`
    
    兼容基準：
    - T2 Android 6.0.1 / API 23 = 災難後備最低線；
    - T2S Android 9 / API 28；
    - 新 POS Android 11 / API 30。
    
    已建立：
    - Kotlin 單 Activity Shell；
    - WebViewAssetLoader；
    - 新 WebView origin-restricted WebMessage；舊 WebView fallback `LegacyBridgeAdapter`；
    - `minSdk=23`、compile/target=36、AndroidX WebKit 1.15.0；
    - Device／Terminal identity；Network status；Kiosk 基礎；
    - LAN TCP Socket；
    - 真實 `printed/failed` callback；
    - idempotency ledger；
    - `content.base64` exact binary bytes；binary 模式不自行加換行／切紙／模板命令。
    
    最新 Build evidence：
    - workflow run `30262432561` = COMPLETED / SUCCESS；
    - Authority Gate、Android SDK、Gradle Build、APK exists、artifact upload 全 PASS；
    - artifact id `8651471180`；GitHub digest `sha256:356b1ee91e1a5d61db05b77f3259a2065a05cbc86a2884763e2188ba15fd2f8b`；
    - 對話工作區 ZIP：`/mnt/data/MoreFun_SMT_APK_Foundation_Latest_Debug.zip`；
    - 解壓 APK：1,367,821 bytes；SHA-256 `c1806dbff77a64cecc55de861dbf20c0084378104f3bb593c1ad60860b6e7fb8`。
    
    注意：Build PASS ≠ 實機 PASS。
    
    下一個 C Gate：
    `T2 API23 安裝／啟動 → Bridge diagnostic → LAN TCP → duplicate suppression → ESC/POS raster 中文／切紙 → TSPL label bitmap → T2S API28 回歸 → 新 POS API30 回歸`
    
    ## 備份／Rollback
    - `backup/apk-foundation-pre-android6-20260727`
    - `backup/qa-runtime-before-browser-summary-20260727`
    - 舊 APK artifacts 保留作 rollback，不可當 latest。
    
    ## 強制接手規則
    任何 checkpoint 都假設下一句可能由另一個 AI 接手。最少保留：目標、Repo／Branch／PR、latest head、完成／未完成、CI／QA 層級、已知根因、禁止倒退事項、backup／rollback、下一步唯一優先、待實機 Gate。
    
    若要改程式，必須 fresh-read 正式 repository、`AGENTS.md` 必讀鏈及各 PR 最新 head；聊天摘要不得取代 GitHub Authority。
    
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/morefunos-smt/morefunos-smt/tests/ai-context.test.mjs:14:10)
    async Test.run (node:internal/test_runner/test:1054:7)
    async startSubtestAfterBootstrap (node:internal/test_runner/harness:296:3)
  ...
# Subtest: knowledge graph edges resolve and carry evidence
ok 2 - knowledge graph edges resolve and carry evidence
  ---
  duration_ms: 5.018974
  type: 'test'
  ...
# Subtest: status separates automation from device acceptance
ok 3 - status separates automation from device acceptance
  ---
  duration_ms: 1.384431
  type: 'test'
  ...
# Subtest: cart adaptive scale must not shrink from cart height at 1920 baseline
ok 4 - cart adaptive scale must not shrink from cart height at 1920 baseline
  ---
  duration_ms: 0.876848
  type: 'test'
  ...
# Subtest: cart marker remains exactly 90% of cart image token
ok 5 - cart marker remains exactly 90% of cart image token
  ---
  duration_ms: 0.178034
  type: 'test'
  ...
# SMT_CART_CHECKOUT_CORE_V7_OK
# Subtest: tests/cart-checkout-regression-v2.test.mjs
ok 3 - tests/cart-checkout-regression-v2.test.mjs
  ---
  duration_ms: 49.396211
  type: 'test'
  ...
# Subtest: cart.css owns pending action layout before page.css legacy removal
ok 7 - cart.css owns pending action layout before page.css legacy removal
  ---
  duration_ms: 1.30323
  type: 'test'
  ...
# Subtest: cart.css owns cart shell internals before page.css legacy removal
ok 8 - cart.css owns cart shell internals before page.css legacy removal
  ---
  duration_ms: 0.279875
  type: 'test'
  ...
# Subtest: cart.css preserves the effective two-row cart layout and right-side price/actions
ok 9 - cart.css preserves the effective two-row cart layout and right-side price/actions
  ---
  duration_ms: 2.094873
  type: 'test'
  ...
# Subtest: cart.css owns quick drawer container geometry but not drink-card internals
ok 10 - cart.css owns quick drawer container geometry but not drink-card internals
  ---
  duration_ms: 0.342918
  type: 'test'
  ...
# Subtest: order page uses the current versioned cart authority asset
ok 11 - order page uses the current versioned cart authority asset
  ---
  duration_ms: 0.168559
  type: 'test'
  ...
# (node:3037) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/pages/order/category-layout.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: 分類版面設定只接受每行五至七格、一至兩行及搜尋開關
ok 12 - 分類版面設定只接受每行五至七格、一至兩行及搜尋開關
  ---
  duration_ms: 2.089255
  type: 'test'
  ...
# Subtest: 搜尋開啟時佔最後一行最後一格，超出首屏分類保留在可操作溢出清單
ok 13 - 搜尋開啟時佔最後一行最後一格，超出首屏分類保留在可操作溢出清單
  ---
  duration_ms: 0.595532
  type: 'test'
  ...
# (node:3049) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/pages/checkout/checkout-domain.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: 學生優惠只將六元或以上合資格特飲的加價減半，普通凍檸茶不減價
ok 14 - 學生優惠只將六元或以上合資格特飲的加價減半，普通凍檸茶不減價
  ---
  duration_ms: 2.139429
  type: 'test'
  ...
# Subtest: 學生優惠人數不可超過合資格飲品數量
ok 15 - 學生優惠人數不可超過合資格飲品數量
  ---
  duration_ms: 0.384079
  type: 'test'
  ...
# Subtest: 未有明確資格或特飲加價少於六元，一律不可自行推斷為學生優惠
ok 16 - 未有明確資格或特飲加價少於六元，一律不可自行推斷為學生優惠
  ---
  duration_ms: 0.427604
  type: 'test'
  ...
# Subtest: 團體整單折扣與學生優惠互斥，現場可使用
ok 17 - 團體整單折扣與學生優惠互斥，現場可使用
  ---
  duration_ms: 0.243641
  type: 'test'
  ...
# Subtest: 平台訂單不可使用本店優惠
ok 18 - 平台訂單不可使用本店優惠
  ---
  duration_ms: 0.596814
  type: 'test'
  ...
# Subtest: 數字鍵盤支援數字、小數、退格及清除
ok 19 - 數字鍵盤支援數字、小數、退格及清除
  ---
  duration_ms: 0.340855
  type: 'test'
  ...
# Subtest: 數字鍵盤的 00 是獨立雙零鍵
ok 20 - 數字鍵盤的 00 是獨立雙零鍵
  ---
  duration_ms: 0.238774
  type: 'test'
  ...
# Subtest: 完成結帳保存優惠、應付金額及實際操作終端
ok 21 - 完成結帳保存優惠、應付金額及實際操作終端
  ---
  duration_ms: 0.918
  type: 'test'
  ...
# Subtest: 渠道政策只容許現場單選付款方式，其他渠道只收必要參考資料
ok 22 - 渠道政策只容許現場單選付款方式，其他渠道只收必要參考資料
  ---
  duration_ms: 1.295559
  type: 'test'
  ...
# Subtest: 現場渠道不提供稍後付款
ok 23 - 現場渠道不提供稍後付款
  ---
  duration_ms: 0.778653
  type: 'test'
  ...
# Subtest: 自有渠道不猜付款方式，平台訂單分開保存佣金及預計結算
ok 24 - 自有渠道不猜付款方式，平台訂單分開保存佣金及預計結算
  ---
  duration_ms: 2.198126
  type: 'test'
  ...
# Subtest: 零元訂單不可建立付款紀錄
ok 25 - 零元訂單不可建立付款紀錄
  ---
  duration_ms: 0.221548
  type: 'test'
  ...
# Subtest: 結帳頁使用共用三位每日流水及永久訂單識別
ok 26 - 結帳頁使用共用三位每日流水及永久訂單識別
  ---
  duration_ms: 26.007293
  type: 'test'
  ...
# Subtest: 結帳紀錄同時保存永久編號及每日顯示流水
ok 27 - 結帳紀錄同時保存永久編號及每日顯示流水
  ---
  duration_ms: 0.58062
  type: 'test'
  ...
# Subtest: 結帳頂部只顯示狀態資料，不保留假快捷金額按鈕
ok 28 - 結帳頂部只顯示狀態資料，不保留假快捷金額按鈕
  ---
  duration_ms: 1.454785
  type: 'test'
  ...
# Subtest: 結帳頁保留數字鍵盤而不顯示底部主導航
ok 29 - 結帳頁保留數字鍵盤而不顯示底部主導航
  ---
  duration_ms: 0.432921
  type: 'test'
  ...
# Subtest: 詳情操作固定提供返回訂單及優惠兩欄
ok 30 - 詳情操作固定提供返回訂單及優惠兩欄
  ---
  duration_ms: 0.246545
  type: 'test'
  ...
# Subtest: 付款區及現金鍵盤由渠道政策動態控制而非所有渠道全部顯示
ok 31 - 付款區及現金鍵盤由渠道政策動態控制而非所有渠道全部顯示
  ---
  duration_ms: 0.2971
  type: 'test'
  ...
# Subtest: 結帳完成保留核對卡並提供有原因的更正資料入口
ok 32 - 結帳完成保留核對卡並提供有原因的更正資料入口
  ---
  duration_ms: 0.287927
  type: 'test'
  ...
# Subtest: 非現場渠道有對應的備註、取餐碼、核對碼或平台單號欄位
ok 33 - 非現場渠道有對應的備註、取餐碼、核對碼或平台單號欄位
  ---
  duration_ms: 0.191012
  type: 'test'
  ...
# Subtest: 快捷金額固定在大鍵盤上方，現場轉換付款方式亦不收起鍵盤
ok 34 - 快捷金額固定在大鍵盤上方，現場轉換付款方式亦不收起鍵盤
  ---
  duration_ms: 0.392221
  type: 'test'
  ...
# Subtest: 已收框是唯一金額輸入顯示並在輸入狀態發光
ok 35 - 已收框是唯一金額輸入顯示並在輸入狀態發光
  ---
  duration_ms: 0.219925
  type: 'test'
  ...
# Subtest: 渠道及付款方式引用大圖標 WebP 資源並採用上圖下字
ok 36 - 渠道及付款方式引用大圖標 WebP 資源並採用上圖下字
  ---
  duration_ms: 0.569854
  type: 'test'
  ...
# Subtest: 數字鍵盤使用四行放大按鍵
ok 37 - 數字鍵盤使用四行放大按鍵
  ---
  duration_ms: 0.496916
  type: 'test'
  ...
# Subtest: 零元時確認按鈕停用並顯示清楚原因
ok 38 - 零元時確認按鈕停用並顯示清楚原因
  ---
  duration_ms: 0.293335
  type: 'test'
  ...
# Subtest: 任何渠道的確認結帳操作永遠固定在付款欄最底
ok 39 - 任何渠道的確認結帳操作永遠固定在付款欄最底
  ---
  duration_ms: 0.26972
  type: 'test'
  ...
# Subtest: removes a fully cart-owned rule
ok 40 - removes a fully cart-owned rule
  ---
  duration_ms: 1.870491
  type: 'test'
  ...
# Subtest: removes cart rule after a legacy comment while preserving the comment
ok 41 - removes cart rule after a legacy comment while preserving the comment
  ---
  duration_ms: 0.576264
  type: 'test'
  ...
# Subtest: rewrites mixed page composition selector without deleting catalog
ok 42 - rewrites mixed page composition selector without deleting catalog
  ---
  duration_ms: 0.351
  type: 'test'
  ...
# Subtest: keeps drink-card internals even when nested in quick drawer
ok 43 - keeps drink-card internals even when nested in quick drawer
  ---
  duration_ms: 0.215499
  type: 'test'
  ...
# Subtest: keeps product and pairing authorities untouched
ok 44 - keeps product and pairing authorities untouched
  ---
  duration_ms: 0.245754
  type: 'test'
  ...
# Subtest: removes pending and cart footer legacy rules
ok 45 - removes pending and cart footer legacy rules
  ---
  duration_ms: 0.15522
  type: 'test'
  ...
# Subtest: removes a fully Drink Card owned rule
ok 46 - removes a fully Drink Card owned rule
  ---
  duration_ms: 1.696553
  type: 'test'
  ...
# Subtest: rewrites mixed selectors and preserves non-Drink container rules
ok 47 - rewrites mixed selectors and preserves non-Drink container rules
  ---
  duration_ms: 0.530526
  type: 'test'
  ...
# Subtest: removes contextual Drink Card overrides without deleting drawer container
ok 48 - removes contextual Drink Card overrides without deleting drawer container
  ---
  duration_ms: 0.37111
  type: 'test'
  ...
# Subtest: removes Drink Card variants while keeping Pairing and Product authorities
ok 49 - removes Drink Card variants while keeping Pairing and Product authorities
  ---
  duration_ms: 0.311622
  type: 'test'
  ...
# Subtest: already-cleared CSS is stable
ok 50 - already-cleared CSS is stable
  ---
  duration_ms: 0.339493
  type: 'test'
  ...
# Subtest: removes Product Card internals while preserving product-list geometry
ok 51 - removes Product Card internals while preserving product-list geometry
  ---
  duration_ms: 1.742971
  type: 'test'
  ...
# Subtest: removes supply-state Product Card rules without deleting status-list rules
ok 52 - removes supply-state Product Card rules without deleting status-list rules
  ---
  duration_ms: 0.55336
  type: 'test'
  ...
# Subtest: removes contextual Product Card internals and keeps unrelated modal authority
ok 53 - removes contextual Product Card internals and keeps unrelated modal authority
  ---
  duration_ms: 0.429597
  type: 'test'
  ...
# Subtest: rewrites mixed selectors without removing products container
ok 54 - rewrites mixed selectors without removing products container
  ---
  duration_ms: 0.34407
  type: 'test'
  ...
# Subtest: already-cleared Product Card CSS is stable
ok 55 - already-cleared Product Card CSS is stable
  ---
  duration_ms: 0.424438
  type: 'test'
  ...
# (node:3086) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/pages/dine/dine-domain.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: 堂食頁固定顯示八張室內枱及戶外枱
ok 56 - 堂食頁固定顯示八張室內枱及戶外枱
  ---
  duration_ms: 5.606795
  type: 'test'
  ...
# Subtest: 三十五分鐘提示只標記枱卡，不增加第三種枱位狀態
ok 57 - 三十五分鐘提示只標記枱卡，不增加第三種枱位狀態
  ---
  duration_ms: 0.656453
  type: 'test'
  ...
# Subtest: 逐餐品付款可拆數量並鎖定已付款數量
ok 58 - 逐餐品付款可拆數量並鎖定已付款數量
  ---
  duration_ms: 1.001043
  type: 'test'
  ...
# Subtest: 堂食付款歸零會建立現場歷史訂單並即時清空枱位
ok 59 - 堂食付款歸零會建立現場歷史訂單並即時清空枱位
  ---
  duration_ms: 2.611648
  type: 'test'
  ...
# Subtest: 堂食正式落單即鎖定流水並保存到製作工作，跨營業日付款亦不改號
ok 60 - 堂食正式落單即鎖定流水並保存到製作工作，跨營業日付款亦不改號
  ---
  duration_ms: 1.087771
  type: 'test'
  ...
# Subtest: 同時使用中的堂食枱亦會佔用每日流水避免撞號
ok 61 - 同時使用中的堂食枱亦會佔用每日流水避免撞號
  ---
  duration_ms: 0.793856
  type: 'test'
  ...
# Subtest: 舊版未有識別的堂食枱直接付款時會避開其他活躍枱流水
ok 62 - 舊版未有識別的堂食枱直接付款時會避開其他活躍枱流水
  ---
  duration_ms: 0.80996
  type: 'test'
  ...
# Subtest: 載入舊資料時會補救已付清但未清枱的堂食會話，且不重複寫歷史
ok 63 - 載入舊資料時會補救已付清但未清枱的堂食會話，且不重複寫歷史
  ---
  duration_ms: 0.819274
  type: 'test'
  ...
# Subtest: 堂食掃碼提交保持待確認，確認後才加入落單記錄
ok 64 - 堂食掃碼提交保持待確認，確認後才加入落單記錄
  ---
  duration_ms: 0.876418
  type: 'test'
  ...
# Subtest: 員工堂食點餐會建立指定枱會話內容，金額及批次由同一批餐品計算
ok 65 - 員工堂食點餐會建立指定枱會話內容，金額及批次由同一批餐品計算
  ---
  duration_ms: 0.995415
  type: 'test'
  ...
# Subtest: 堂食枱面摘要提供營運所需時間、餐點及數量資料
ok 66 - 堂食枱面摘要提供營運所需時間、餐點及數量資料
  ---
  duration_ms: 0.414164
  type: 'test'
  ...
# Subtest: 堂食點餐拒絕寫入已失效的舊會話，避免餐品掛錯枱
ok 67 - 堂食點餐拒絕寫入已失效的舊會話，避免餐品掛錯枱
  ---
  duration_ms: 0.414724
  type: 'test'
  ...
# Subtest: 空枱開始點餐只建立意圖，正式提交餐品時才開枱
ok 68 - 空枱開始點餐只建立意圖，正式提交餐品時才開枱
  ---
  duration_ms: 0.58087
  type: 'test'
  ...
# Subtest: 舊版本遺留的空堂食會話會安全清理，有餐品的會話不受影響
ok 69 - 舊版本遺留的空堂食會話會安全清理，有餐品的會話不受影響
  ---
  duration_ms: 0.401925
  type: 'test'
  ...
# Subtest: 堂食頁提供簡潔枱詳情、半屏待確認及兩層付款操作
ok 70 - 堂食頁提供簡潔枱詳情、半屏待確認及兩層付款操作
  ---
  duration_ms: 0.50637
  type: 'test'
  ...
# Subtest: 正式堂食頁不會自動建立示範枱或示範訂單，掃碼入口標示第二版保留
ok 71 - 正式堂食頁不會自動建立示範枱或示範訂單，掃碼入口標示第二版保留
  ---
  duration_ms: 0.413713
  type: 'test'
  ...
# Subtest: 堂食枱卡直接顯示開枱、三十五分鐘及首三項餐點摘要
ok 72 - 堂食枱卡直接顯示開枱、三十五分鐘及首三項餐點摘要
  ---
  duration_ms: 0.318752
  type: 'test'
  ...
# Subtest: 現有點餐及訂單底欄可以進入獨立堂食頁
ok 73 - 現有點餐及訂單底欄可以進入獨立堂食頁
  ---
  duration_ms: 1.183293
  type: 'test'
  ...
# Subtest: 堂食點單提供取消入口並同步清除失效堂食脈絡
ok 74 - 堂食點單提供取消入口並同步清除失效堂食脈絡
  ---
  duration_ms: 0.852773
  type: 'test'
  ...
# Subtest: 點單頁兩個堂食落單入口都會讀取完成歷史避免重複流水
ok 75 - 點單頁兩個堂食落單入口都會讀取完成歷史避免重複流水
  ---
  duration_ms: 1.722431
  type: 'test'
  ...
# Subtest: 堂食頁最近訂單使用共用時間排序及三位顯示號碼
ok 76 - 堂食頁最近訂單使用共用時間排序及三位顯示號碼
  ---
  duration_ms: 0.339913
  type: 'test'
  ...
# (node:3100) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/shared/operations.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: draft numbers are sequential within each terminal prefix
ok 77 - draft numbers are sequential within each terminal prefix
  ---
  duration_ms: 1.236261
  type: 'test'
  ...
# Subtest: a removed draft number is never reissued after retrieval
ok 78 - a removed draft number is never reissued after retrieval
  ---
  duration_ms: 0.49322
  type: 'test'
  ...
# Subtest: saving a cart records terminal ownership and an audit event
ok 79 - saving a cart records terminal ownership and an audit event
  ---
  duration_ms: 1.130825
  type: 'test'
  ...
# Subtest: taking over another terminal draft preserves lineage
ok 80 - taking over another terminal draft preserves lineage
  ---
  duration_ms: 0.390689
  type: 'test'
  ...
# Subtest: 日結會清空當時所有草稿，而新營業日草稿不會被誤刪
ok 81 - 日結會清空當時所有草稿，而新營業日草稿不會被誤刪
  ---
  duration_ms: 1.378822
  type: 'test'
  ...
# Subtest: a taken-over cart is renumbered under the terminal that saves it again
ok 82 - a taken-over cart is renumbered under the terminal that saves it again
  ---
  duration_ms: 0.287556
  type: 'test'
  ...
# Subtest: checkout records which terminal completed the order
ok 83 - checkout records which terminal completed the order
  ---
  duration_ms: 0.204433
  type: 'test'
  ...
# Subtest: drink-card.css owns selected state and external pointer
ok 84 - drink-card.css owns selected state and external pointer
  ---
  duration_ms: 1.226997
  type: 'test'
  ...
# Subtest: drink-card.css owns the shared image-first card geometry
ok 85 - drink-card.css owns the shared image-first card geometry
  ---
  duration_ms: 0.300945
  type: 'test'
  ...
# Subtest: order page loads the current Drink Card authority asset
ok 86 - order page loads the current Drink Card authority asset
  ---
  duration_ms: 0.171644
  type: 'test'
  ...
# GLOBAL_STATUS_ACTION_DESCRIPTOR_CORE_OK
# Subtest: tests/global-status-actions-contract.test.mjs
ok 14 - tests/global-status-actions-contract.test.mjs
  ---
  duration_ms: 48.030198
  type: 'test'
  ...
# SMT_HEALTH_SEAL_DESCRIPTOR_CONTRACT_OK
# Subtest: tests/health-seal-contract.test.mjs
ok 15 - tests/health-seal-contract.test.mjs
  ---
  duration_ms: 48.221823
  type: 'test'
  ...
# (node:3121) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/pages/order/menu-api.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: Firebase keyed catalog normalizes categories, products and availability
ok 89 - Firebase keyed catalog normalizes categories, products and availability
  ---
  duration_ms: 2.01868
  type: 'test'
  ...
# Subtest: remote products use live values while inheriting locked SMT behaviour by code
ok 90 - remote products use live values while inheriting locked SMT behaviour by code
  ---
  duration_ms: 2.255541
  type: 'test'
  ...
# Subtest: live drink products become quick drinks and retain modifier capabilities
ok 91 - live drink products become quick drinks and retain modifier capabilities
  ---
  duration_ms: 0.455515
  type: 'test'
  ...
# Subtest: menu loader caches a successful response and falls back to cache offline
ok 92 - menu loader caches a successful response and falls back to cache offline
  ---
  duration_ms: 1.05324
  type: 'test'
  ...
# Subtest: runtime uses Firebase RTDB and contains no Apps Script transport
ok 93 - runtime uses Firebase RTDB and contains no Apps Script transport
  ---
  duration_ms: 9.32323
  type: 'test'
  ...
# Subtest: 共用頁面橋接會從正式設定套用主題及聲音狀態
ok 94 - 共用頁面橋接會從正式設定套用主題及聲音狀態
  ---
  duration_ms: 2.88254
  type: 'test'
  ...
# Subtest: 點單頁重載會讀取更多頁保存的快速模式及產品圖片設定
ok 95 - 點單頁重載會讀取更多頁保存的快速模式及產品圖片設定
  ---
  duration_ms: 0.234948
  type: 'test'
  ...
# Subtest: 正式結帳會建立中央打印工作而不把排隊當成實體成功
ok 96 - 正式結帳會建立中央打印工作而不把排隊當成實體成功
  ---
  duration_ms: 0.261117
  type: 'test'
  ...
# Subtest: 訂單重印會即時匯入中央打印工作佇列
ok 97 - 訂單重印會即時匯入中央打印工作佇列
  ---
  duration_ms: 0.178464
  type: 'test'
  ...
# Subtest: 堂食正式落單後會把堂食打印工作匯入中央佇列
ok 98 - 堂食正式落單後會把堂食打印工作匯入中央佇列
  ---
  duration_ms: 0.17552
  type: 'test'
  ...
# (node:3142) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/pages/more/more-domain.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: 營業日固定由早上五時起計並排除上一營業日訂單
ok 99 - 營業日固定由早上五時起計並排除上一營業日訂單
  ---
  duration_ms: 11.381388
  type: 'test'
  ...
# Subtest: 報表分開淨銷售、付款、平台結算、待核實及打印異常
ok 100 - 報表分開淨銷售、付款、平台結算、待核實及打印異常
  ---
  duration_ms: 0.872672
  type: 'test'
  ...
# Subtest: 歷史報表支援今日昨日七日三十日三個月六個月及自訂日期
ok 101 - 歷史報表支援今日昨日七日三十日三個月六個月及自訂日期
  ---
  duration_ms: 2.169012
  type: 'test'
  ...
# Subtest: 選定歷史範圍會由訂單明細重算而不是只讀今日
ok 102 - 選定歷史範圍會由訂單明細重算而不是只讀今日
  ---
  duration_ms: 1.295078
  type: 'test'
  ...
# Subtest: 付款及渠道分拆提供對數欄位、狀態及對應訂單
ok 103 - 付款及渠道分拆提供對數欄位、狀態及對應訂單
  ---
  duration_ms: 0.529193
  type: 'test'
  ...
# Subtest: 結帳、堂食及舊核數的付款別名會合併到同一對數方式
ok 104 - 結帳、堂食及舊核數的付款別名會合併到同一對數方式
  ---
  duration_ms: 0.665326
  type: 'test'
  ...
# Subtest: 未知付款方式歸入其他而不會製造無限新分類
ok 105 - 未知付款方式歸入其他而不會製造無限新分類
  ---
  duration_ms: 0.444819
  type: 'test'
  ...
# Subtest: 堂食分拆付款按每次實收方式對數而不只顯示組合付款
ok 106 - 堂食分拆付款按每次實收方式對數而不只顯示組合付款
  ---
  duration_ms: 0.403638
  type: 'test'
  ...
# Subtest: 付款實收讀取真正 paidAmount 並保留短收及多收的正負差額
ok 107 - 付款實收讀取真正 paidAmount 並保留短收及多收的正負差額
  ---
  duration_ms: 0.559949
  type: 'test'
  ...
# Subtest: 現金對數以收款減找續計算，不會把找續再扣一次
ok 108 - 現金對數以收款減找續計算，不會把找續再扣一次
  ---
  duration_ms: 0.599849
  type: 'test'
  ...
# Subtest: 平台付款別名統一顯示為平台代收
ok 109 - 平台付款別名統一顯示為平台代收
  ---
  duration_ms: 0.405821
  type: 'test'
  ...
# Subtest: 商品分類、時段及異常資料保留對應訂單供介面下鑽
ok 110 - 商品分類、時段及異常資料保留對應訂單供介面下鑽
  ---
  duration_ms: 0.380153
  type: 'test'
  ...
# Subtest: 異常報表會由現有 audit 列出付款更改、部分取消、重印及付款問題
ok 111 - 異常報表會由現有 audit 列出付款更改、部分取消、重印及付款問題
  ---
  duration_ms: 0.400984
  type: 'test'
  ...
# Subtest: 異常操作按 audit 發生時間入報表並保留跨日原訂單下鑽
ok 112 - 異常操作按 audit 發生時間入報表並保留跨日原訂單下鑽
  ---
  duration_ms: 0.215789
  type: 'test'
  ...
# Subtest: 港幣盤點只提供店舖實際接收的五款紙幣及三款硬幣
ok 113 - 港幣盤點只提供店舖實際接收的五款紙幣及三款硬幣
  ---
  duration_ms: 0.312843
  type: 'test'
  ...
# Subtest: 新營業日沿用上次留底並容許開機時加減調整
ok 114 - 新營業日沿用上次留底並容許開機時加減調整
  ---
  duration_ms: 0.222159
  type: 'test'
  ...
# Subtest: 未手動調整前按開工底金建議提取及留底，且不會留多過實點現金
ok 115 - 未手動調整前按開工底金建議提取及留底，且不會留多過實點現金
  ---
  duration_ms: 0.320695
  type: 'test'
  ...
# Subtest: 日結按實點現金反推待核實訂單的現金及非現金部分
ok 116 - 日結按實點現金反推待核實訂單的現金及非現金部分
  ---
  duration_ms: 0.315317
  type: 'test'
  ...
# Subtest: 日結保存現金、支出、差異、版本及稽核而不改寫訂單
ok 117 - 日結保存現金、支出、差異、版本及稽核而不改寫訂單
  ---
  duration_ms: 1.630435
  type: 'test'
  ...
# Subtest: 超出百分之三差異而沒有原因不可正式日結
ok 118 - 超出百分之三差異而沒有原因不可正式日結
  ---
  duration_ms: 0.288497
  type: 'test'
  ...
# Subtest: 超出百分之三差異必須明確授權，並保存提取及留底現金
ok 119 - 超出百分之三差異必須明確授權，並保存提取及留底現金
  ---
  duration_ms: 0.542954
  type: 'test'
  ...
# Subtest: 提取及留底現金必須完整分配實點現金
ok 120 - 提取及留底現金必須完整分配實點現金
  ---
  duration_ms: 0.446922
  type: 'test'
  ...
# Subtest: CSV 匯出包含摘要、訂單及商品明細並正確處理逗號
ok 121 - CSV 匯出包含摘要、訂單及商品明細並正確處理逗號
  ---
  duration_ms: 0.778504
  type: 'test'
  ...
# Subtest: 備份有可重算校驗值，任何內容被改動都會驗證失敗
ok 122 - 備份有可重算校驗值，任何內容被改動都會驗證失敗
  ---
  duration_ms: 0.614931
  type: 'test'
  ...
# Subtest: 恢復可以只套用設定或完整資料，並拒絕無效備份
ok 123 - 恢復可以只套用設定或完整資料，並拒絕無效備份
  ---
  duration_ms: 0.469074
  type: 'test'
  ...
# Subtest: 系統診斷清楚分開本機能力、同步積壓及未設定更新來源
ok 124 - 系統診斷清楚分開本機能力、同步積壓及未設定更新來源
  ---
  duration_ms: 0.238493
  type: 'test'
  ...
# Subtest: 更多頁已接入正式路由及五項底部導航
ok 125 - 更多頁已接入正式路由及五項底部導航
  ---
  duration_ms: 6.355163
  type: 'test'
  ...
# Subtest: 更多主畫面有營業日及六個帶營運狀態的入口
ok 126 - 更多主畫面有營業日及六個帶營運狀態的入口
  ---
  duration_ms: 0.464298
  type: 'test'
  ...
# Subtest: 更多首頁直接顯示今日營業、渠道及付款分析而毋須進入第二層
ok 127 - 更多首頁直接顯示今日營業、渠道及付款分析而毋須進入第二層
  ---
  duration_ms: 0.281958
  type: 'test'
  ...
# Subtest: 六個入口均有可讀細節面板而非只顯示簡單訊息
ok 128 - 六個入口均有可讀細節面板而非只顯示簡單訊息
  ---
  duration_ms: 0.342868
  type: 'test'
  ...
# Subtest: 日結、恢復、更新及退出全螢幕均先開二次確認
ok 129 - 日結、恢復、更新及退出全螢幕均先開二次確認
  ---
  duration_ms: 0.774597
  type: 'test'
  ...
# Subtest: 六個入口已由死按鈕改成真實本機操作
ok 130 - 六個入口已由死按鈕改成真實本機操作
  ---
  duration_ms: 0.4789
  type: 'test'
  ...
# Subtest: 顯示設定可本機保存，彈窗遮罩不可點空白關閉
ok 131 - 顯示設定可本機保存，彈窗遮罩不可點空白關閉
  ---
  duration_ms: 0.332523
  type: 'test'
  ...
# Subtest: 顯示與操作可設定分類每行格數、行數及最後一格搜尋
ok 132 - 顯示與操作可設定分類每行格數、行數及最後一格搜尋
  ---
  duration_ms: 0.343469
  type: 'test'
  ...
# Subtest: 更多頁沿用共用基礎樣式並固定頂底欄
ok 133 - 更多頁沿用共用基礎樣式並固定頂底欄
  ---
  duration_ms: 0.584947
  type: 'test'
  ...
# Subtest: 收銀日結提供點算、支出、差異原因、版本及正式保存
ok 134 - 收銀日結提供點算、支出、差異原因、版本及正式保存
  ---
  duration_ms: 0.600209
  type: 'test'
  ...
# Subtest: 日結提供面額互推、開工底金、提取留底、待核實反推及超額授權
ok 135 - 日結提供面額互推、開工底金、提取留底、待核實反推及超額授權
  ---
  duration_ms: 0.429116
  type: 'test'
  ...
# Subtest: 開機底金顯示上次留底、調整額及確認後開工現金
ok 136 - 開機底金顯示上次留底、調整額及確認後開工現金
  ---
  duration_ms: 0.257211
  type: 'test'
  ...
# Subtest: 營業分析同時展示每個渠道及每種付款方式的單數和金額
ok 137 - 營業分析同時展示每個渠道及每種付款方式的單數和金額
  ---
  duration_ms: 0.151655
  type: 'test'
  ...
# Subtest: 全局共用樣式提供觸控回饋、彈窗動效及減少動效模式
ok 138 - 全局共用樣式提供觸控回饋、彈窗動效及減少動效模式
  ---
  duration_ms: 0.310159
  type: 'test'
  ...
# Subtest: 報表五個分頁讀取同一選定日期報表並可下載 CSV
ok 139 - 報表五個分頁讀取同一選定日期報表並可下載 CSV
  ---
  duration_ms: 0.246926
  type: 'test'
  ...
# Subtest: 歷史報表提供七種日期入口及自訂開始結束日期
ok 140 - 歷史報表提供七種日期入口及自訂開始結束日期
  ---
  duration_ms: 0.287196
  type: 'test'
  ...
# Subtest: 付款對數逐項顯示單數應收實收退款差額狀態並可下鑽
ok 141 - 付款對數逐項顯示單數應收實收退款差額狀態並可下鑽
  ---
  duration_ms: 0.130523
  type: 'test'
  ...
# Subtest: 商品報表可切換產品及分類並保留時段與日結紀錄
ok 142 - 商品報表可切換產品及分類並保留時段與日結紀錄
  ---
  duration_ms: 0.098957
  type: 'test'
  ...
# Subtest: 打印中心可設定網絡設備、選格式、診斷、預覽、重試及改送
ok 143 - 打印中心可設定網絡設備、選格式、診斷、預覽、重試及改送
  ---
  duration_ms: 0.339953
  type: 'test'
  ...
# Subtest: 備份中心可以建立、下載、匯入、驗證及分範圍恢復
ok 144 - 備份中心可以建立、下載、匯入、驗證及分範圍恢復
  ---
  duration_ms: 0.281807
  type: 'test'
  ...
# Subtest: 系統中心提供真實診斷、操作紀錄、同步重試及更新檢查結果
ok 145 - 系統中心提供真實診斷、操作紀錄、同步重試及更新檢查結果
  ---
  duration_ms: 0.267756
  type: 'test'
  ...
# MORE_RESPONSIVE_PAGE_AUTHORITY_CONTRACT_OK
# Subtest: tests/more-responsive-contract.test.mjs
ok 20 - tests/more-responsive-contract.test.mjs
  ---
  duration_ms: 51.746884
  type: 'test'
  ...
# (node:3167) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/pages/order/order-domain.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: standalone riceball is packaging-fee exempt even when display category is popularity
ok 147 - standalone riceball is packaging-fee exempt even when display category is popularity
  ---
  duration_ms: 1.112217
  type: 'test'
  ...
# Subtest: standalone drink is packaging-fee exempt
ok 148 - standalone drink is packaging-fee exempt
  ---
  duration_ms: 0.295268
  type: 'test'
  ...
# Subtest: standalone riceball plus discounted drink remains packaging-fee exempt
ok 149 - standalone riceball plus discounted drink remains packaging-fee exempt
  ---
  duration_ms: 0.342337
  type: 'test'
  ...
# Subtest: riceball combo and other takeaway boxed meals still charge packaging
ok 150 - riceball combo and other takeaway boxed meals still charge packaging
  ---
  duration_ms: 0.2427
  type: 'test'
  ...
# SMT_ORDER_CART_DOMAIN_OK
# (node:3173) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/shared/store.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: tests/order-cart-domain.test.mjs
ok 22 - tests/order-cart-domain.test.mjs
  ---
  duration_ms: 42.196893
  type: 'test'
  ...
# (node:3180) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/pages/order/order-domain.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: quick mode uses a direct-add product action
ok 152 - quick mode uses a direct-add product action
  ---
  duration_ms: 1.820256
  type: 'test'
  ...
# Subtest: cart rows expose separate quantity and edit controls
ok 153 - cart rows expose separate quantity and edit controls
  ---
  duration_ms: 0.225003
  type: 'test'
  ...
# Subtest: product editor is a compact anchored card with explicit confirmation
ok 154 - product editor is a compact anchored card with explicit confirmation
  ---
  duration_ms: 0.417659
  type: 'test'
  ...
# Subtest: modal backdrop is inert and cannot dismiss changes
ok 155 - modal backdrop is inert and cannot dismiss changes
  ---
  duration_ms: 0.228118
  type: 'test'
  ...
# Subtest: cart quantity updates totals, trims drink assignments, and removes zero rows
ok 156 - cart quantity updates totals, trims drink assignments, and removes zero rows
  ---
  duration_ms: 0.966101
  type: 'test'
  ...
# Subtest: order shell keeps the bottom navigation inside the fixed canvas
ok 157 - order shell keeps the bottom navigation inside the fixed canvas
  ---
  duration_ms: 0.315347
  type: 'test'
  ...
# Subtest: checkout call to action shows the payable total
ok 158 - checkout call to action shows the payable total
  ---
  duration_ms: 0.248408
  type: 'test'
  ...
# Subtest: quick order mode, drink strip, and quick assist are independent settings
ok 159 - quick order mode, drink strip, and quick assist are independent settings
  ---
  duration_ms: 0.203852
  type: 'test'
  ...
# Subtest: display settings include the three cart ratios
ok 160 - display settings include the three cart ratios
  ---
  duration_ms: 0.43917
  type: 'test'
  ...
# Subtest: cards are positioned from the pressed control and expose a pointer side
ok 161 - cards are positioned from the pressed control and expose a pointer side
  ---
  duration_ms: 0.605327
  type: 'test'
  ...
# Subtest: pending orders use a vertical split
ok 162 - pending orders use a vertical split
  ---
  duration_ms: 0.302819
  type: 'test'
  ...
# Subtest: every expanded card is owned by the single modal controller
ok 163 - every expanded card is owned by the single modal controller
  ---
  duration_ms: 0.260305
  type: 'test'
  ...
# Subtest: pending order card is actionable and grouped by channel
ok 164 - pending order card is actionable and grouped by channel
  ---
  duration_ms: 0.155881
  type: 'test'
  ...
# Subtest: anchored cards support all four pointer directions and stay between fixed bars
ok 165 - anchored cards support all four pointer directions and stay between fixed bars
  ---
  duration_ms: 0.318972
  type: 'test'
  ...
# Subtest: cart image visibility is configurable
ok 166 - cart image visibility is configurable
  ---
  duration_ms: 0.179115
  type: 'test'
  ...
# Subtest: quick drink adjustment stays compact without repeating its image
ok 167 - quick drink adjustment stays compact without repeating its image
  ---
  duration_ms: 0.217372
  type: 'test'
  ...
# Subtest: shell uses a fixed T2S canvas fitted inside both viewport dimensions
ok 168 - shell uses a fixed T2S canvas fitted inside both viewport dimensions
  ---
  duration_ms: 17.993642
  type: 'test'
  ...
# Subtest: root height chain and scroll regions keep both bars fixed
ok 169 - root height chain and scroll regions keep both bars fixed
  ---
  duration_ms: 1.479181
  type: 'test'
  ...
# Subtest: quick drinks are a collapsed upward drawer with reorder controls
ok 170 - quick drinks are a collapsed upward drawer with reorder controls
  ---
  duration_ms: 0.326954
  type: 'test'
  ...
# Subtest: drink editor supports multiple configuration groups without forced images
ok 171 - drink editor supports multiple configuration groups without forced images
  ---
  duration_ms: 0.228348
  type: 'test'
  ...
# Subtest: completion exposes automatic, specified, and demo link-up flows
ok 172 - completion exposes automatic, specified, and demo link-up flows
  ---
  duration_ms: 0.20306
  type: 'test'
  ...
# Subtest: large product grid reserves complete rows and never overlaps cards
ok 173 - large product grid reserves complete rows and never overlaps cards
  ---
  duration_ms: 0.252343
  type: 'test'
  ...
# Subtest: collapsed quick drinks use the approved centred pill above navigation
ok 174 - collapsed quick drinks use the approved centred pill above navigation
  ---
  duration_ms: 0.2701
  type: 'test'
  ...
# Subtest: operational surfaces include sold-out preview and new-order toast
ok 175 - operational surfaces include sold-out preview and new-order toast
  ---
  duration_ms: 0.223972
  type: 'test'
  ...
# Subtest: 分類列最右固定搜尋入口並可按名稱或編號篩選產品
ok 176 - 分類列最右固定搜尋入口並可按名稱或編號篩選產品
  ---
  duration_ms: 0.415295
  type: 'test'
  ...
# Subtest: 分類列讀取後台全局設定並按五六七格及一兩行輸出版面
ok 177 - 分類列讀取後台全局設定並按五六七格及一兩行輸出版面
  ---
  duration_ms: 0.20239
  type: 'test'
  ...
# Subtest: 新單提示最少一張產品卡闊及兩張產品卡高
ok 178 - 新單提示最少一張產品卡闊及兩張產品卡高
  ---
  duration_ms: 0.245764
  type: 'test'
  ...
# Subtest: 快捷飲品展開後八秒無操作自動收起並於操作時重時計時
ok 179 - 快捷飲品展開後八秒無操作自動收起並於操作時重時計時
  ---
  duration_ms: 0.199255
  type: 'test'
  ...
# Subtest: sold-out preview reads the same local supply status as the badge
ok 180 - sold-out preview reads the same local supply status as the badge
  ---
  duration_ms: 0.167849
  type: 'test'
  ...
# Subtest: order cards distinguish sold-out orange from paused red without greying
ok 181 - order cards distinguish sold-out orange from paused red without greying
  ---
  duration_ms: 3.606863
  type: 'test'
  ...
# Subtest: paused products sort to the end of their current order category
ok 182 - paused products sort to the end of their current order category
  ---
  duration_ms: 0.207297
  type: 'test'
  ...
# Subtest: accepting a verified pending order creates a running order with a 30 minute deadline
ok 183 - accepting a verified pending order creates a running order with a 30 minute deadline
  ---
  duration_ms: 0.20232
  type: 'test'
  ...
# Subtest: running orders auto-complete after 30 minutes without intermediate states
ok 184 - running orders auto-complete after 30 minutes without intermediate states
  ---
  duration_ms: 0.237702
  type: 'test'
  ...
# Subtest: WhatsApp QR target opens the customer chat with the preset message
ok 185 - WhatsApp QR target opens the customer chat with the preset message
  ---
  duration_ms: 0.638405
  type: 'test'
  ...
# Subtest: pending verification uses start review then confirm order wording
ok 186 - pending verification uses start review then confirm order wording
  ---
  duration_ms: 0.238243
  type: 'test'
  ...
# Subtest: cart locks price and quantity-edit controls into dedicated regions
ok 187 - cart locks price and quantity-edit controls into dedicated regions
  ---
  duration_ms: 0.289759
  type: 'test'
  ...
# Subtest: drink adjustment starts compact and expands only after add adjustment
ok 188 - drink adjustment starts compact and expands only after add adjustment
  ---
  duration_ms: 0.232454
  type: 'test'
  ...
# Subtest: specified pairing candidates use a three-column text-card grid
ok 189 - specified pairing candidates use a three-column text-card grid
  ---
  duration_ms: 0.230461
  type: 'test'
  ...
# Subtest: cart keeps price flush right and actions aligned with the image
ok 190 - cart keeps price flush right and actions aligned with the image
  ---
  duration_ms: 0.299954
  type: 'test'
  ...
# Subtest: 首次渲染由共用函數提供待處理數量給頂欄及導航
ok 191 - 首次渲染由共用函數提供待處理數量給頂欄及導航
  ---
  duration_ms: 0.539309
  type: 'test'
  ...
# Subtest: 點單頁最近訂單讀取共用歷史而不再寫死舊單號
ok 192 - 點單頁最近訂單讀取共用歷史而不再寫死舊單號
  ---
  duration_ms: 1.35655
  type: 'test'
  ...
# Subtest: 子頁啟動錯誤會顯示可見後備畫面而不是白屏
ok 193 - 子頁啟動錯誤會顯示可見後備畫面而不是白屏
  ---
  duration_ms: 19.89861
  type: 'test'
  ...
# Subtest: specified pairing creates dynamic labelled groups
ok 194 - specified pairing creates dynamic labelled groups
  ---
  duration_ms: 0.376287
  type: 'test'
  ...
# Subtest: all drink selection surfaces share one image-first Drink Choice Card
ok 195 - all drink selection surfaces share one image-first Drink Choice Card
  ---
  duration_ms: 0.527852
  type: 'test'
  ...
# Subtest: riceball and snack can become one pending-drink combo without a cart drink
ok 196 - riceball and snack can become one pending-drink combo without a cart drink
  ---
  duration_ms: 0.764913
  type: 'test'
  ...
# Subtest: quick drink embeds inside combo without first becoming a cart line
ok 197 - quick drink embeds inside combo without first becoming a cart line
  ---
  duration_ms: 0.348937
  type: 'test'
  ...
# Subtest: cart drink can be consumed into a combo and remaining quantity stays standalone
ok 198 - cart drink can be consumed into a combo and remaining quantity stays standalone
  ---
  duration_ms: 0.271222
  type: 'test'
  ...
# Subtest: dissolving a combo restores standalone components at single prices
ok 199 - dissolving a combo restores standalone components at single prices
  ---
  duration_ms: 0.529004
  type: 'test'
  ...
# Subtest: specified pairing offers quick drinks and accepts main plus snack before drink
ok 200 - specified pairing offers quick drinks and accepts main plus snack before drink
  ---
  duration_ms: 0.186656
  type: 'test'
  ...
# Subtest: order page loads the shared live menu contract with offline fallback
ok 201 - order page loads the shared live menu contract with offline fallback
  ---
  duration_ms: 0.178754
  type: 'test'
  ...
# (node:3188) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/shared/order-identity.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: 每日流水以早上五時為分界並固定三位數
ok 202 - 每日流水以早上五時為分界並固定三位數
  ---
  duration_ms: 1.643444
  type: 'test'
  ...
# Subtest: 所有渠道共用同一每日流水並兼容舊 P 編號
ok 203 - 所有渠道共用同一每日流水並兼容舊 P 編號
  ---
  duration_ms: 0.517466
  type: 'test'
  ...
# Subtest: 每日流水到 P999 後拒絕循環覆蓋
ok 204 - 每日流水到 P999 後拒絕循環覆蓋
  ---
  duration_ms: 2.579511
  type: 'test'
  ...
# Subtest: 顯示號碼支援新舊訂單並按真實時間找最新一張
ok 205 - 顯示號碼支援新舊訂單並按真實時間找最新一張
  ---
  duration_ms: 0.443146
  type: 'test'
  ...
# Subtest: 流水營業日及最近訂單以開單時間為準而不受完成時間延遲影響
ok 206 - 流水營業日及最近訂單以開單時間為準而不受完成時間延遲影響
  ---
  duration_ms: 0.496325
  type: 'test'
  ...
# Subtest: 永久編號使用實際日期並在堂食單包含枱號
ok 207 - 永久編號使用實際日期並在堂食單包含枱號
  ---
  duration_ms: 0.276239
  type: 'test'
  ...
# (node:3194) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/pages/order/order-domain.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: takeaway packaging fee exempts standalone riceballs and drinks
ok 208 - takeaway packaging fee exempts standalone riceballs and drinks
  ---
  duration_ms: 2.410049
  type: 'test'
  ...
# Subtest: checkout discount does not discount packaging fee
ok 209 - checkout discount does not discount packaging fee
  ---
  duration_ms: 0.588451
  type: 'test'
  ...
# Subtest: mixed service order splits production and packing jobs
ok 210 - mixed service order splits production and packing jobs
  ---
  duration_ms: 22.566866
  type: 'test'
  ...
# SMT_ORDER_REQUIRED_COMPLETION_TOKEN_CORE_OK
# Subtest: tests/order-required-completion-core.test.mjs
ok 26 - tests/order-required-completion-core.test.mjs
  ---
  duration_ms: 54.710318
  type: 'test'
  ...
# Subtest: order runtime does not load post-render drink enhancer
ok 212 - order runtime does not load post-render drink enhancer
  ---
  duration_ms: 1.196772
  type: 'test'
  ...
# Subtest: drink assignment badges render from assignment state
ok 213 - drink assignment badges render from assignment state
  ---
  duration_ms: 0.42562
  type: 'test'
  ...
# Subtest: modal policy is owned by order core, not an external runtime layer
ok 214 - modal policy is owned by order core, not an external runtime layer
  ---
  duration_ms: 0.35803
  type: 'test'
  ...
# Subtest: order runtime keeps required completion in page state
ok 215 - order runtime keeps required completion in page state
  ---
  duration_ms: 0.264742
  type: 'test'
  ...
# Subtest: transient UI state bypasses transaction persistence and full normalization
ok 216 - transient UI state bypasses transaction persistence and full normalization
  ---
  duration_ms: 0.382386
  type: 'test'
  ...
# Subtest: order page uses lazy surface rendering
ok 217 - order page uses lazy surface rendering
  ---
  duration_ms: 0.293655
  type: 'test'
  ...
# (node:3217) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/pages/orders/orders-domain.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: 運行訂單滿三十分鐘會持久轉入歷史而唔係只改畫面
ok 218 - 運行訂單滿三十分鐘會持久轉入歷史而唔係只改畫面
  ---
  duration_ms: 2.777904
  type: 'test'
  ...
# Subtest: filters can switch between source, payment exception, print exception and history
ok 219 - filters can switch between source, payment exception, print exception and history
  ---
  duration_ms: 0.363658
  type: 'test'
  ...
# Subtest: changing channel and payment persists values and audit instead of only showing a toast
ok 220 - changing channel and payment persists values and audit instead of only showing a toast
  ---
  duration_ms: 0.257221
  type: 'test'
  ...
# Subtest: 更改渠道會套用正式付款狀態，非現場渠道不可保留舊付款方式
ok 221 - 更改渠道會套用正式付款狀態，非現場渠道不可保留舊付款方式
  ---
  duration_ms: 0.208749
  type: 'test'
  ...
# Subtest: 待核實訂單可核實付款或標記問題及通知客戶
ok 222 - 待核實訂單可核實付款或標記問題及通知客戶
  ---
  duration_ms: 0.335066
  type: 'test'
  ...
# Subtest: 訂單頁待核實入口共用完整核數及通知客戶操作
ok 223 - 訂單頁待核實入口共用完整核數及通知客戶操作
  ---
  duration_ms: 0.235238
  type: 'test'
  ...
# Subtest: 問題原因提供快選亦容許留空，唔會卡住待處理流程
ok 224 - 問題原因提供快選亦容許留空，唔會卡住待處理流程
  ---
  duration_ms: 0.355186
  type: 'test'
  ...
# Subtest: 打印異常訂單由職員打開後勾選需要重印的文件
ok 225 - 打印異常訂單由職員打開後勾選需要重印的文件
  ---
  duration_ms: 0.201138
  type: 'test'
  ...
# Subtest: 部分取消使用商品行內加減及一次確認，不再逐項使用下拉選單
ok 226 - 部分取消使用商品行內加減及一次確認，不再逐項使用下拉選單
  ---
  duration_ms: 0.545618
  type: 'test'
  ...
# Subtest: partial cancellation keeps cancelled quantity visible and recalculates total
ok 227 - partial cancellation keeps cancelled quantity visible and recalculates total
  ---
  duration_ms: 0.539609
  type: 'test'
  ...
# Subtest: whole-order cancellation remains in history instead of disappearing
ok 228 - whole-order cancellation remains in history instead of disappearing
  ---
  duration_ms: 0.21598
  type: 'test'
  ...
# Subtest: reprint creates a visible print job and clears the exception after retry
ok 229 - reprint creates a visible print job and clears the exception after retry
  ---
  duration_ms: 0.253957
  type: 'test'
  ...
# Subtest: 掛單只開左右面板，再由一般掛單或堂食枱號完成操作
ok 230 - 掛單只開左右面板，再由一般掛單或堂食枱號完成操作
  ---
  duration_ms: 1.421265
  type: 'test'
  ...
# Subtest: 取單使用左列表右內容，並固定返回、作廢及取單操作
ok 231 - 取單使用左列表右內容，並固定返回、作廢及取單操作
  ---
  duration_ms: 0.371431
  type: 'test'
  ...
# Subtest: checkout persists the completing terminal and order audit
ok 232 - checkout persists the completing terminal and order audit
  ---
  duration_ms: 0.213657
  type: 'test'
  ...
# Subtest: bottom navigation opens the independent orders page
ok 233 - bottom navigation opens the independent orders page
  ---
  duration_ms: 0.340745
  type: 'test'
  ...
# Subtest: orders page uses the three approved channel columns and payment methods
ok 234 - orders page uses the three approved channel columns and payment methods
  ---
  duration_ms: 0.301957
  type: 'test'
  ...
# Subtest: 每件產品保存獨立堂食或外賣選擇
ok 235 - 每件產品保存獨立堂食或外賣選擇
  ---
  duration_ms: 0.25693
  type: 'test'
  ...
# Subtest: reverse checkout reuse loads the original cart then navigates to the locked ordering page
ok 236 - reverse checkout reuse loads the original cart then navigates to the locked ordering page
  ---
  duration_ms: 0.494332
  type: 'test'
  ...
# Subtest: pairing-modal.css owns specified pairing task layout
ok 237 - pairing-modal.css owns specified pairing task layout
  ---
  duration_ms: 1.298704
  type: 'test'
  ...
# Subtest: pairing modal keeps body scroll bounded and fixed task surfaces
ok 238 - pairing modal keeps body scroll bounded and fixed task surfaces
  ---
  duration_ms: 0.287696
  type: 'test'
  ...
# Subtest: pairing candidate visuals are scoped to the modal owner
ok 239 - pairing candidate visuals are scoped to the modal owner
  ---
  duration_ms: 0.219334
  type: 'test'
  ...
# Subtest: order page loads current Pairing Modal authority asset
ok 240 - order page loads current Pairing Modal authority asset
  ---
  duration_ms: 0.176311
  type: 'test'
  ...
# (node:3246) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/pages/more/print-domain.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: 預設建立五部設備及四款由管理端發佈的示範格式
ok 241 - 預設建立五部設備及四款由管理端發佈的示範格式
  ---
  duration_ms: 2.716824
  type: 'test'
  ...
# Subtest: 網絡打印機必須有有效網絡地址、連接埠、紙寬、用途及格式
ok 242 - 網絡打印機必須有有效網絡地址、連接埠、紙寬、用途及格式
  ---
  duration_ms: 0.874385
  type: 'test'
  ...
# Subtest: 製作及打包統計同時提供每款產品與飲品、飯餐、飯團總數
ok 243 - 製作及打包統計同時提供每款產品與飲品、飯餐、飯團總數
  ---
  duration_ms: 9.337251
  type: 'test'
  ...
# Subtest: 四款格式生成可讀預覽，製作單及打包單頂部先顯示合併統計
ok 244 - 四款格式生成可讀預覽，製作單及打包單頂部先顯示合併統計
  ---
  duration_ms: 13.504343
  type: 'test'
  ...
# Subtest: 舊非 P 渠道訂單重印保留原識別而不會顯示測試工作
ok 245 - 舊非 P 渠道訂單重印保留原識別而不會顯示測試工作
  ---
  duration_ms: 0.529744
  type: 'test'
  ...
# Subtest: 打印工作按用途及格式路由，未設定設備會停在 blocked 而非假成功
ok 246 - 打印工作按用途及格式路由，未設定設備會停在 blocked 而非假成功
  ---
  duration_ms: 3.204376
  type: 'test'
  ...
# Subtest: 重試沿用同一工作並增加嘗試；改送會保存原目的地
ok 247 - 重試沿用同一工作並增加嘗試；改送會保存原目的地
  ---
  duration_ms: 0.453191
  type: 'test'
  ...
# Subtest: 安卓橋接封包包含傳輸資料、格式內容及冪等工作編號
ok 248 - 安卓橋接封包包含傳輸資料、格式內容及冪等工作編號
  ---
  duration_ms: 0.455655
  type: 'test'
  ...
# Subtest: 設備診斷會分開設定驗證、瀏覽器限制及安卓橋接狀態
ok 249 - 設備診斷會分開設定驗證、瀏覽器限制及安卓橋接狀態
  ---
  duration_ms: 0.592919
  type: 'test'
  ...
# Subtest: 現有訂單與堂食打印工作可去重匯入中央工作佇列
ok 250 - 現有訂單與堂食打印工作可去重匯入中央工作佇列
  ---
  duration_ms: 1.177534
  type: 'test'
  ...
# PRODUCT_CARD_AUTHORITY_CONTRACT_OK
# Subtest: tests/product-card-authority-contract.test.mjs
ok 32 - tests/product-card-authority-contract.test.mjs
  ---
  duration_ms: 34.927836
  type: 'test'
  ...
# Subtest: product-card.css owns the base card shell and typography
ok 252 - product-card.css owns the base card shell and typography
  ---
  duration_ms: 1.043906
  type: 'test'
  ...
# Subtest: product-card.css owns no-image and supply states
ok 253 - product-card.css owns no-image and supply states
  ---
  duration_ms: 0.224933
  type: 'test'
  ...
# Subtest: product-card.css keeps adaptive row tokens as the only size source
ok 254 - product-card.css keeps adaptive row tokens as the only size source
  ---
  duration_ms: 0.233616
  type: 'test'
  ...
# Subtest: order page loads the current Product Card authority asset
ok 255 - order page loads the current Product Card authority asset
  ---
  duration_ms: 0.126197
  type: 'test'
  ...
# node:internal/modules/run_main:123
#     triggerUncaughtException(
#     ^
# AssertionError [ERR_ASSERTION]: permanent QA must execute Playwright browser regression
#     at file:///home/runner/work/morefunos-smt/morefunos-smt/tests/qa-pipeline-contract.test.mjs:8:8
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
# Subtest: tests/qa-pipeline-contract.test.mjs
not ok 34 - tests/qa-pipeline-contract.test.mjs
  ---
  duration_ms: 46.532535
  type: 'test'
  location: '/home/runner/work/morefunos-smt/morefunos-smt/tests/qa-pipeline-contract.test.mjs:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
# Subtest: seed frame stays hidden until child ready
ok 257 - seed frame stays hidden until child ready
  ---
  duration_ms: 1.169863
  type: 'test'
  ...
# Subtest: unlock does not force reload the active order page
ok 258 - unlock does not force reload the active order page
  ---
  duration_ms: 0.331862
  type: 'test'
  ...
# Subtest: page ready waits for stable frames and republishes explicit actions
ok 259 - page ready waits for stable frames and republishes explicit actions
  ---
  duration_ms: 2.019602
  type: 'test'
  ...
# Subtest: overlay state stays explicit and event driven
ok 260 - overlay state stays explicit and event driven
  ---
  duration_ms: 0.308958
  type: 'test'
  ...
# Subtest: responsive profile writes are deduplicated per frame
ok 261 - responsive profile writes are deduplicated per frame
  ---
  duration_ms: 0.207978
  type: 'test'
  ...
# Subtest: inactive pages cannot keep a second overlay truth source
ok 262 - inactive pages cannot keep a second overlay truth source
  ---
  duration_ms: 0.246215
  type: 'test'
  ...
# (node:3281) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/runner/work/morefunos-smt/morefunos-smt/shared/shell.js is not specified and it doesn't parse as CommonJS.
# Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
# To eliminate this warning, add "type": "module" to /home/runner/work/morefunos-smt/morefunos-smt/package.json.
# (Use `node --trace-warnings ...` to show where the warning was created)
# Subtest: 共用狀態欄永久包含品牌、終端、接單狀態及最近訂單
ok 263 - 共用狀態欄永久包含品牌、終端、接單狀態及最近訂單
  ---
  duration_ms: 1.739377
  type: 'test'
  ...
# Subtest: 共用底欄固定五項、同一套線性圖標及唯一選中項
ok 264 - 共用底欄固定五項、同一套線性圖標及唯一選中項
  ---
  duration_ms: 0.599358
  type: 'test'
  ...
# Subtest: 五個主要頁面全部使用共用狀態欄及底部導航
ok 265 - 五個主要頁面全部使用共用狀態欄及底部導航
  ---
  duration_ms: 0.214388
  type: 'test'
  ...
# Subtest: 五個主要頁面共用同一最近訂單顯示規則
ok 266 - 五個主要頁面共用同一最近訂單顯示規則
  ---
  duration_ms: 0.252173
  type: 'test'
  ...
# Subtest: 底欄高度、選中膠囊、字體及圖標只由全局 Shell 樣式控制
ok 267 - 底欄高度、選中膠囊、字體及圖標只由全局 Shell 樣式控制
  ---
  duration_ms: 0.449015
  type: 'test'
  ...
# Subtest: 分類、頁籤、分段、付款、來源及模式選擇共用膠囊規則
ok 268 - 分類、頁籤、分段、付款、來源及模式選擇共用膠囊規則
  ---
  duration_ms: 0.304822
  type: 'test'
  ...
# Subtest: 來源彈窗支援四方向箭嘴並由定位器標記實際方向
ok 269 - 來源彈窗支援四方向箭嘴並由定位器標記實際方向
  ---
  duration_ms: 0.260967
  type: 'test'
  ...
# Subtest: 售罄頁沿用產品分類與三種點單卡模板
ok 270 - 售罄頁沿用產品分類與三種點單卡模板
  ---
  duration_ms: 1.094912
  type: 'test'
  ...
# Subtest: 右欄提供分類售罄列表、收起與圖片顯示切換
ok 271 - 右欄提供分類售罄列表、收起與圖片顯示切換
  ---
  duration_ms: 0.247407
  type: 'test'
  ...
# Subtest: 批量模式使用待確認欄及四個固定操作
ok 272 - 批量模式使用待確認欄及四個固定操作
  ---
  duration_ms: 0.163282
  type: 'test'
  ...
# Subtest: 正常模式產品詳情提供四個供應狀態操作
ok 273 - 正常模式產品詳情提供四個供應狀態操作
  ---
  duration_ms: 0.336318
  type: 'test'
  ...
# Subtest: 批量模式點擊整張產品卡即可加入或取消
ok 274 - 批量模式點擊整張產品卡即可加入或取消
  ---
  duration_ms: 0.218113
  type: 'test'
  ...
# Subtest: 目前分類支援一次性多選、全選及全不選並保留跨分類選取
ok 275 - 目前分類支援一次性多選、全選及全不選並保留跨分類選取
  ---
  duration_ms: 0.149371
  type: 'test'
  ...
# Subtest: 提供紫米快捷操作、售罄獨立分類及清晰狀態卡
ok 276 - 提供紫米快捷操作、售罄獨立分類及清晰狀態卡
  ---
  duration_ms: 0.240997
  type: 'test'
  ...
# Subtest: 售罄頁可獨立切換大圖小圖及純文字卡
ok 277 - 售罄頁可獨立切換大圖小圖及純文字卡
  ---
  duration_ms: 0.221508
  type: 'test'
  ...
# Subtest: 應用程式路由已接入售罄頁
ok 278 - 應用程式路由已接入售罄頁
  ---
  duration_ms: 0.400183
  type: 'test'
  ...
# Subtest: 售罄頁使用正確餐牌後備參數，網絡失敗亦保留可操作頁面
ok 279 - 售罄頁使用正確餐牌後備參數，網絡失敗亦保留可操作頁面
  ---
  duration_ms: 0.553089
  type: 'test'
  ...
# Subtest: 售罄產品移出原分類並集中到售罄分類，停售仍留原分類
ok 280 - 售罄產品移出原分類並集中到售罄分類，停售仍留原分類
  ---
  duration_ms: 0.26298
  type: 'test'
  ...
# Subtest: 小圖與純文字卡由售罄頁自己消費自適應 Token
ok 281 - 小圖與純文字卡由售罄頁自己消費自適應 Token
  ---
  duration_ms: 0.262078
  type: 'test'
  ...
1..281
# tests 281
# suites 0
# pass 279
# fail 2
# cancelled 0
# skipped 0
# todo 0
# duration_ms 964.277197
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

## Playwright responsive browser matrix
```text
===== RUN tests/responsive-profile.spec.js =====

Running 6 tests using 1 worker

[1/6] tests/responsive-profile.spec.js:13:3 › responsive profile 1920x1080 -> large
[2/6] tests/responsive-profile.spec.js:13:3 › responsive profile 1600x900 -> standard
[3/6] tests/responsive-profile.spec.js:13:3 › responsive profile 1440x900 -> standard
[4/6] tests/responsive-profile.spec.js:13:3 › responsive profile 1366x768 -> standard
[5/6] tests/responsive-profile.spec.js:13:3 › responsive profile 1280x800 -> compact
[6/6] tests/responsive-profile.spec.js:26:1 › 1920 baseline boots after responsive engine integration
  6 passed (3.8s)
PASS tests/responsive-profile.spec.js
===== RUN tests/responsive-shell.spec.js =====

Running 10 tests using 1 worker

[1/10] tests/responsive-shell.spec.js:15:3 › shell fits 1920x1080 without horizontal overflow
[2/10] tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1920x1080
[3/10] (retries) tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1920x1080 (retry #1)
  1) tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1920x1080 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('.shell-bottom-nav')
    Expected: visible
    Timeout: 15000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 15000ms
      - waiting for locator('.shell-bottom-nav')


       8 |   const frame=page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
       9 |   if(!frame)throw new Error('order iframe not loaded');
    > 10 |   await expect(frame.locator('.shell-bottom-nav')).toBeVisible();
         |                                                    ^
      11 |   return frame;
      12 | }
      13 |
        at orderFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:10:52)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:36:17

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-da7c9-ically-clipped-at-1920x1080/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-shell-bottom-na-da7c9-ically-clipped-at-1920x1080/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-da7c9-ically-clipped-at-1920x1080/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-shell-bottom-na-da7c9-ically-clipped-at-1920x1080/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator: locator('.shell-bottom-nav')
    Expected: visible
    Timeout: 15000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 15000ms
      - waiting for locator('.shell-bottom-nav')


       8 |   const frame=page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
       9 |   if(!frame)throw new Error('order iframe not loaded');
    > 10 |   await expect(frame.locator('.shell-bottom-nav')).toBeVisible();
         |                                                    ^
      11 |   return frame;
      12 | }
      13 |
        at orderFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:10:52)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:36:17

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-da7c9-ically-clipped-at-1920x1080-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-shell-bottom-na-da7c9-ically-clipped-at-1920x1080-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-da7c9-ically-clipped-at-1920x1080-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-shell-bottom-na-da7c9-ically-clipped-at-1920x1080-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[4/10] tests/responsive-shell.spec.js:15:3 › shell fits 1600x900 without horizontal overflow
[5/10] tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1600x900
[6/10] (retries) tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1600x900 (retry #1)
  2) tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1600x900 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('.shell-bottom-nav')
    Expected: visible
    Timeout: 15000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 15000ms
      - waiting for locator('.shell-bottom-nav')


       8 |   const frame=page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
       9 |   if(!frame)throw new Error('order iframe not loaded');
    > 10 |   await expect(frame.locator('.shell-bottom-nav')).toBeVisible();
         |                                                    ^
      11 |   return frame;
      12 | }
      13 |
        at orderFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:10:52)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:36:17

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-03ca9-tically-clipped-at-1600x900/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-shell-bottom-na-03ca9-tically-clipped-at-1600x900/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-03ca9-tically-clipped-at-1600x900/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-shell-bottom-na-03ca9-tically-clipped-at-1600x900/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator: locator('.shell-bottom-nav')
    Expected: visible
    Timeout: 15000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 15000ms
      - waiting for locator('.shell-bottom-nav')


       8 |   const frame=page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
       9 |   if(!frame)throw new Error('order iframe not loaded');
    > 10 |   await expect(frame.locator('.shell-bottom-nav')).toBeVisible();
         |                                                    ^
      11 |   return frame;
      12 | }
      13 |
        at orderFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:10:52)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:36:17

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-03ca9-tically-clipped-at-1600x900-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-shell-bottom-na-03ca9-tically-clipped-at-1600x900-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-03ca9-tically-clipped-at-1600x900-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-shell-bottom-na-03ca9-tically-clipped-at-1600x900-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[7/10] tests/responsive-shell.spec.js:15:3 › shell fits 1440x900 without horizontal overflow
[8/10] tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1440x900
[9/10] (retries) tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1440x900 (retry #1)
  3) tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1440x900 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('.shell-bottom-nav')
    Expected: visible
    Timeout: 15000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 15000ms
      - waiting for locator('.shell-bottom-nav')


       8 |   const frame=page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
       9 |   if(!frame)throw new Error('order iframe not loaded');
    > 10 |   await expect(frame.locator('.shell-bottom-nav')).toBeVisible();
         |                                                    ^
      11 |   return frame;
      12 | }
      13 |
        at orderFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:10:52)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:36:17

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-c58c1-tically-clipped-at-1440x900/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-shell-bottom-na-c58c1-tically-clipped-at-1440x900/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-c58c1-tically-clipped-at-1440x900/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-shell-bottom-na-c58c1-tically-clipped-at-1440x900/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator: locator('.shell-bottom-nav')
    Expected: visible
    Timeout: 15000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 15000ms
      - waiting for locator('.shell-bottom-nav')


       8 |   const frame=page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
       9 |   if(!frame)throw new Error('order iframe not loaded');
    > 10 |   await expect(frame.locator('.shell-bottom-nav')).toBeVisible();
         |                                                    ^
      11 |   return frame;
      12 | }
      13 |
        at orderFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:10:52)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:36:17

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-c58c1-tically-clipped-at-1440x900-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-shell-bottom-na-c58c1-tically-clipped-at-1440x900-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-c58c1-tically-clipped-at-1440x900-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-shell-bottom-na-c58c1-tically-clipped-at-1440x900-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[10/10] tests/responsive-shell.spec.js:15:3 › shell fits 1366x768 without horizontal overflow
[11/10] tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1366x768
[12/10] (retries) tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1366x768 (retry #1)
  4) tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1366x768 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('.shell-bottom-nav')
    Expected: visible
    Timeout: 15000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 15000ms
      - waiting for locator('.shell-bottom-nav')


       8 |   const frame=page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
       9 |   if(!frame)throw new Error('order iframe not loaded');
    > 10 |   await expect(frame.locator('.shell-bottom-nav')).toBeVisible();
         |                                                    ^
      11 |   return frame;
      12 | }
      13 |
        at orderFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:10:52)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:36:17

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-ef011-tically-clipped-at-1366x768/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-shell-bottom-na-ef011-tically-clipped-at-1366x768/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-ef011-tically-clipped-at-1366x768/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-shell-bottom-na-ef011-tically-clipped-at-1366x768/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator: locator('.shell-bottom-nav')
    Expected: visible
    Timeout: 15000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 15000ms
      - waiting for locator('.shell-bottom-nav')


       8 |   const frame=page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
       9 |   if(!frame)throw new Error('order iframe not loaded');
    > 10 |   await expect(frame.locator('.shell-bottom-nav')).toBeVisible();
         |                                                    ^
      11 |   return frame;
      12 | }
      13 |
        at orderFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:10:52)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:36:17

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-ef011-tically-clipped-at-1366x768-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-shell-bottom-na-ef011-tically-clipped-at-1366x768-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-ef011-tically-clipped-at-1366x768-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-shell-bottom-na-ef011-tically-clipped-at-1366x768-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[13/10] tests/responsive-shell.spec.js:15:3 › shell fits 1280x800 without horizontal overflow
[14/10] tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1280x800
[15/10] (retries) tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1280x800 (retry #1)
  5) tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1280x800 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('.shell-bottom-nav')
    Expected: visible
    Timeout: 15000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 15000ms
      - waiting for locator('.shell-bottom-nav')


       8 |   const frame=page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
       9 |   if(!frame)throw new Error('order iframe not loaded');
    > 10 |   await expect(frame.locator('.shell-bottom-nav')).toBeVisible();
         |                                                    ^
      11 |   return frame;
      12 | }
      13 |
        at orderFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:10:52)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:36:17

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-23d72-tically-clipped-at-1280x800/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-shell-bottom-na-23d72-tically-clipped-at-1280x800/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-23d72-tically-clipped-at-1280x800/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-shell-bottom-na-23d72-tically-clipped-at-1280x800/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator: locator('.shell-bottom-nav')
    Expected: visible
    Timeout: 15000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 15000ms
      - waiting for locator('.shell-bottom-nav')


       8 |   const frame=page.frames().find(f=>/pages\/order\/index\.html/.test(f.url()));
       9 |   if(!frame)throw new Error('order iframe not loaded');
    > 10 |   await expect(frame.locator('.shell-bottom-nav')).toBeVisible();
         |                                                    ^
      11 |   return frame;
      12 | }
      13 |
        at orderFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:10:52)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-shell.spec.js:36:17

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-23d72-tically-clipped-at-1280x800-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-shell-bottom-na-23d72-tically-clipped-at-1280x800-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-shell-bottom-na-23d72-tically-clipped-at-1280x800-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-shell-bottom-na-23d72-tically-clipped-at-1280x800-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


  5 failed
    tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1920x1080 
    tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1600x900 
    tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1440x900 
    tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1366x768 
    tests/responsive-shell.spec.js:33:3 › bottom navigation content is not vertically clipped at 1280x800 
  5 passed (2.9m)
FAIL tests/responsive-shell.spec.js exit=1
===== RUN tests/responsive-order.spec.js =====

Running 5 tests using 1 worker

[1/5] tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1920x1080
[2/5] (retries) tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1920x1080 (retry #1)
  1) tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1920x1080 

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0.5
    Received:   0

      58 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeLessThanOrEqual(.72);
      59 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeLessThanOrEqual(.72);
    > 60 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeGreaterThan(.5);
         |                                                              ^
      61 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeGreaterThan(.5);
      62 |     }
      63 |
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-order.spec.js:60:62

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-459bb-nent-contracts-at-1920x1080/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-order-order-pag-459bb-nent-contracts-at-1920x1080/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-459bb-nent-contracts-at-1920x1080/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-order-order-pag-459bb-nent-contracts-at-1920x1080/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0.5
    Received:   0

      58 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeLessThanOrEqual(.72);
      59 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeLessThanOrEqual(.72);
    > 60 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeGreaterThan(.5);
         |                                                              ^
      61 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeGreaterThan(.5);
      62 |     }
      63 |
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-order.spec.js:60:62

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-459bb-nent-contracts-at-1920x1080-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-order-order-pag-459bb-nent-contracts-at-1920x1080-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-459bb-nent-contracts-at-1920x1080-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-order-order-pag-459bb-nent-contracts-at-1920x1080-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[3/5] tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1600x900
[4/5] (retries) tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1600x900 (retry #1)
  2) tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1600x900 

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0.5
    Received:   0

      58 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeLessThanOrEqual(.72);
      59 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeLessThanOrEqual(.72);
    > 60 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeGreaterThan(.5);
         |                                                              ^
      61 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeGreaterThan(.5);
      62 |     }
      63 |
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-order.spec.js:60:62

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-beda1-onent-contracts-at-1600x900/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-order-order-pag-beda1-onent-contracts-at-1600x900/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-beda1-onent-contracts-at-1600x900/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-order-order-pag-beda1-onent-contracts-at-1600x900/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0.5
    Received:   0

      58 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeLessThanOrEqual(.72);
      59 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeLessThanOrEqual(.72);
    > 60 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeGreaterThan(.5);
         |                                                              ^
      61 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeGreaterThan(.5);
      62 |     }
      63 |
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-order.spec.js:60:62

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-beda1-onent-contracts-at-1600x900-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-order-order-pag-beda1-onent-contracts-at-1600x900-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-beda1-onent-contracts-at-1600x900-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-order-order-pag-beda1-onent-contracts-at-1600x900-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[5/5] tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1440x900
[6/5] (retries) tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1440x900 (retry #1)
  3) tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1440x900 

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0.5
    Received:   0

      58 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeLessThanOrEqual(.72);
      59 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeLessThanOrEqual(.72);
    > 60 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeGreaterThan(.5);
         |                                                              ^
      61 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeGreaterThan(.5);
      62 |     }
      63 |
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-order.spec.js:60:62

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-7c06c-onent-contracts-at-1440x900/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-order-order-pag-7c06c-onent-contracts-at-1440x900/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-7c06c-onent-contracts-at-1440x900/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-order-order-pag-7c06c-onent-contracts-at-1440x900/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0.5
    Received:   0

      58 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeLessThanOrEqual(.72);
      59 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeLessThanOrEqual(.72);
    > 60 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeGreaterThan(.5);
         |                                                              ^
      61 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeGreaterThan(.5);
      62 |     }
      63 |
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-order.spec.js:60:62

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-7c06c-onent-contracts-at-1440x900-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-order-order-pag-7c06c-onent-contracts-at-1440x900-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-7c06c-onent-contracts-at-1440x900-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-order-order-pag-7c06c-onent-contracts-at-1440x900-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[7/5] tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1366x768
[8/5] (retries) tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1366x768 (retry #1)
  4) tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1366x768 

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0.5
    Received:   0

      58 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeLessThanOrEqual(.72);
      59 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeLessThanOrEqual(.72);
    > 60 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeGreaterThan(.5);
         |                                                              ^
      61 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeGreaterThan(.5);
      62 |     }
      63 |
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-order.spec.js:60:62

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-b4819-onent-contracts-at-1366x768/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-order-order-pag-b4819-onent-contracts-at-1366x768/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-b4819-onent-contracts-at-1366x768/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-order-order-pag-b4819-onent-contracts-at-1366x768/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0.5
    Received:   0

      58 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeLessThanOrEqual(.72);
      59 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeLessThanOrEqual(.72);
    > 60 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeGreaterThan(.5);
         |                                                              ^
      61 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeGreaterThan(.5);
      62 |     }
      63 |
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-order.spec.js:60:62

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-b4819-onent-contracts-at-1366x768-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-order-order-pag-b4819-onent-contracts-at-1366x768-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-b4819-onent-contracts-at-1366x768-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-order-order-pag-b4819-onent-contracts-at-1366x768-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[9/5] tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1280x800
[10/5] (retries) tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1280x800 (retry #1)
  5) tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1280x800 

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0.5
    Received:   0

      58 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeLessThanOrEqual(.72);
      59 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeLessThanOrEqual(.72);
    > 60 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeGreaterThan(.5);
         |                                                              ^
      61 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeGreaterThan(.5);
      62 |     }
      63 |
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-order.spec.js:60:62

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-8fa7f-onent-contracts-at-1280x800/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-order-order-pag-8fa7f-onent-contracts-at-1280x800/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-8fa7f-onent-contracts-at-1280x800/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-order-order-pag-8fa7f-onent-contracts-at-1280x800/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0.5
    Received:   0

      58 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeLessThanOrEqual(.72);
      59 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeLessThanOrEqual(.72);
    > 60 |       expect(layout.heroImgRect.width/layout.heroRect.width).toBeGreaterThan(.5);
         |                                                              ^
      61 |       expect(layout.heroImgRect.height/layout.heroRect.height).toBeGreaterThan(.5);
      62 |     }
      63 |
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-order.spec.js:60:62

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-8fa7f-onent-contracts-at-1280x800-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-order-order-pag-8fa7f-onent-contracts-at-1280x800-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-order-order-pag-8fa7f-onent-contracts-at-1280x800-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-order-order-pag-8fa7f-onent-contracts-at-1280x800-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


  5 failed
    tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1920x1080 
    tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1600x900 
    tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1440x900 
    tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1366x768 
    tests/responsive-order.spec.js:16:3 › order page fits and keeps component contracts at 1280x800 
FAIL tests/responsive-order.spec.js exit=1
===== RUN tests/responsive-checkout.spec.js =====

Running 5 tests using 1 worker

[1/5] tests/responsive-checkout.spec.js:16:3 › checkout controls fit 1920x1080
[2/5] tests/responsive-checkout.spec.js:16:3 › checkout controls fit 1600x900
[3/5] tests/responsive-checkout.spec.js:16:3 › checkout controls fit 1440x900
[4/5] tests/responsive-checkout.spec.js:16:3 › checkout controls fit 1366x768
[5/5] tests/responsive-checkout.spec.js:16:3 › checkout controls fit 1280x800
  5 passed (5.7s)
PASS tests/responsive-checkout.spec.js
===== RUN tests/responsive-secondary-pages.spec.js =====

Running 20 tests using 1 worker

[1/20] tests/responsive-secondary-pages.spec.js:24:5 › orders fits 1920x1080
[2/20] tests/responsive-secondary-pages.spec.js:24:5 › orders fits 1600x900
[3/20] tests/responsive-secondary-pages.spec.js:24:5 › orders fits 1440x900
[4/20] tests/responsive-secondary-pages.spec.js:24:5 › orders fits 1366x768
[5/20] tests/responsive-secondary-pages.spec.js:24:5 › orders fits 1280x800
[6/20] tests/responsive-secondary-pages.spec.js:24:5 › dine fits 1920x1080
[7/20] tests/responsive-secondary-pages.spec.js:24:5 › dine fits 1600x900
[8/20] tests/responsive-secondary-pages.spec.js:24:5 › dine fits 1440x900
[9/20] tests/responsive-secondary-pages.spec.js:24:5 › dine fits 1366x768
[10/20] tests/responsive-secondary-pages.spec.js:24:5 › dine fits 1280x800
[11/20] tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1920x1080
[12/20] tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1600x900
[13/20] (retries) tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1600x900 (retry #1)
  1) tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1600x900 ─────────────────────────

    Error: soldout iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-soldout-fits-1600x900/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-soldout-fits-1600x900/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-soldout-fits-1600x900/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-soldout-fits-1600x900/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: soldout iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-soldout-fits-1600x900-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-soldout-fits-1600x900-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-soldout-fits-1600x900-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-soldout-fits-1600x900-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[14/20] tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1440x900
[15/20] tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1366x768
[16/20] (retries) tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1366x768 (retry #1)
  2) tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1366x768 ─────────────────────────

    Error: soldout iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-soldout-fits-1366x768/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-soldout-fits-1366x768/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-soldout-fits-1366x768/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-soldout-fits-1366x768/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: soldout iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-soldout-fits-1366x768-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-soldout-fits-1366x768-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-soldout-fits-1366x768-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-soldout-fits-1366x768-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[17/20] tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1280x800
[18/20] (retries) tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1280x800 (retry #1)
  3) tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1280x800 ─────────────────────────

    Error: soldout iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-soldout-fits-1280x800/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-soldout-fits-1280x800/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-soldout-fits-1280x800/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-soldout-fits-1280x800/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[19/20] tests/responsive-secondary-pages.spec.js:24:5 › more fits 1920x1080
[20/20] (retries) tests/responsive-secondary-pages.spec.js:24:5 › more fits 1920x1080 (retry #1)
  4) tests/responsive-secondary-pages.spec.js:24:5 › more fits 1920x1080 ───────────────────────────

    Error: more iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1920x1080/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-more-fits-1920x1080/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1920x1080/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-more-fits-1920x1080/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: more iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1920x1080-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-more-fits-1920x1080-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1920x1080-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-more-fits-1920x1080-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[21/20] tests/responsive-secondary-pages.spec.js:24:5 › more fits 1600x900
[22/20] (retries) tests/responsive-secondary-pages.spec.js:24:5 › more fits 1600x900 (retry #1)
  5) tests/responsive-secondary-pages.spec.js:24:5 › more fits 1600x900 ────────────────────────────

    Error: more iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1600x900/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-more-fits-1600x900/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1600x900/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-more-fits-1600x900/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: more iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1600x900-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-more-fits-1600x900-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1600x900-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-more-fits-1600x900-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[23/20] tests/responsive-secondary-pages.spec.js:24:5 › more fits 1440x900
[24/20] (retries) tests/responsive-secondary-pages.spec.js:24:5 › more fits 1440x900 (retry #1)
  6) tests/responsive-secondary-pages.spec.js:24:5 › more fits 1440x900 ────────────────────────────

    Error: more iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1440x900/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-more-fits-1440x900/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1440x900/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-more-fits-1440x900/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: more iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1440x900-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-more-fits-1440x900-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1440x900-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-more-fits-1440x900-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[25/20] tests/responsive-secondary-pages.spec.js:24:5 › more fits 1366x768
[26/20] (retries) tests/responsive-secondary-pages.spec.js:24:5 › more fits 1366x768 (retry #1)
  7) tests/responsive-secondary-pages.spec.js:24:5 › more fits 1366x768 ────────────────────────────

    Error: more iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1366x768/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-more-fits-1366x768/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1366x768/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-more-fits-1366x768/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: more iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1366x768-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-more-fits-1366x768-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1366x768-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-more-fits-1366x768-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[27/20] tests/responsive-secondary-pages.spec.js:24:5 › more fits 1280x800
[28/20] (retries) tests/responsive-secondary-pages.spec.js:24:5 › more fits 1280x800 (retry #1)
  8) tests/responsive-secondary-pages.spec.js:24:5 › more fits 1280x800 ────────────────────────────

    Error: more iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1280x800/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-more-fits-1280x800/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1280x800/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-more-fits-1280x800/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: more iframe not loaded

      14 |   const re=new RegExp(`pages/${route}/index\\.html`);
      15 |   const frame=page.frame({url:re})||page.frames().find(f=>re.test(f.url()));
    > 16 |   if(!frame)throw new Error(`${route} iframe not loaded`);
         |                   ^
      17 |   await expect(frame.locator(`body[data-page="${route}"]`)).toBeVisible();
      18 |   await expect(frame.locator('#app')).toBeVisible();
      19 |   return frame;
        at routeFrame (/home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:16:19)
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-secondary-pages.spec.js:27:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1280x800-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/responsive-secondary-pages-more-fits-1280x800-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-secondary-pages-more-fits-1280x800-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-secondary-pages-more-fits-1280x800-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


  7 failed
    tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1600x900 ──────────────────────────
    tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1366x768 ──────────────────────────
    tests/responsive-secondary-pages.spec.js:24:5 › more fits 1920x1080 ────────────────────────────
    tests/responsive-secondary-pages.spec.js:24:5 › more fits 1600x900 ─────────────────────────────
    tests/responsive-secondary-pages.spec.js:24:5 › more fits 1440x900 ─────────────────────────────
    tests/responsive-secondary-pages.spec.js:24:5 › more fits 1366x768 ─────────────────────────────
    tests/responsive-secondary-pages.spec.js:24:5 › more fits 1280x800 ─────────────────────────────
  1 flaky
    tests/responsive-secondary-pages.spec.js:24:5 › soldout fits 1280x800 ──────────────────────────
  12 passed (38.4s)
FAIL tests/responsive-secondary-pages.spec.js exit=1
===== RUN tests/responsive-architecture-guard.spec.js =====

Running 7 tests using 1 worker

[1/7] tests/responsive-architecture-guard.spec.js:33:1 › adaptive branch has no legacy size patch files
[2/7] tests/responsive-architecture-guard.spec.js:37:1 › loader does not inject page CSS patches
[3/7] tests/responsive-architecture-guard.spec.js:44:1 › all SMT child pages use device-width viewport
[4/7] tests/responsive-architecture-guard.spec.js:54:1 › new responsive layers do not use important overrides
[5/7] tests/responsive-architecture-guard.spec.js:59:1 › soldout product cards cannot define independent fixed geometry
[6/7] (retries) tests/responsive-architecture-guard.spec.js:59:1 › soldout product cards cannot define independent fixed geometry (retry #1)
  1) tests/responsive-architecture-guard.spec.js:59:1 › soldout product cards cannot define independent fixed geometry 

    Error: .supply-product.large{height:

    expect(received).not.toContain(expected) // indexOf

    Expected substring: not ".supply-product.large{height:"
    Received string:        ":root{--side-width:32%}.soldout-grid{height:100%;display:grid;grid-template-columns:minmax(0,1fr) var(--side-width);gap:16px}.page-title{display:grid;gap:2px}.page-title strong{font-size:22px}.page-title small,.catalog-caption,.panel-tools small{color:var(--muted)}.search-box{width:330px;height:46px;display:flex;align-items:center;gap:8px;padding:0 13px;border:1px solid var(--line);border-radius:11px;background:#fff}.search-box input{width:100%;border:0;outline:0}.status-filter{display:flex}.status-filter button{min-width:82px;border:1px solid var(--line);background:#fff;padding:0 14px;font-weight:850}.status-filter button:first-child{border-radius:11px 0 0 11px}.status-filter button:last-child{border-radius:0 11px 11px 0}.status-filter .active{background:var(--orange);color:#fff}.catalog-caption{display:flex;justify-content:space-between;padding:0 16px 10px}.catalog-caption strong{color:var(--text)}.supply-product{position:relative}.supply-product .card-open{width:100%;height:100%;border:0;background:transparent;padding:0;text-align:left;color:inherit}.supply-product.large .card-open{display:grid}.supply-product.small .card-open{display:grid;align-items:center}.supply-product.text .card-open{display:grid;align-items:center}.supply-product.selected{border-color:var(--orange);box-shadow:inset 0 0 0 2px var(--orange),var(--lift)}.supply-state{width:max-content;font-style:normal;font-size:13px;font-weight:900;border-radius:999px;padding:3px 8px}.supply-state.soldout{background:#fff0ee;color:#b53f35}.supply-state.paused{background:#f0ece8;color:#715c4e}.select-switch{position:absolute;right:10px;top:10px;width:54px;height:32px;border:2px solid #fff;border-radius:999px;background:#c8bdb5;box-shadow:0 2px 9px #0002;padding:3px;z-index:3}.select-switch span{display:block;width:22px;height:22px;border-radius:50%;background:#fff}.select-switch.active{background:var(--orange)}.select-switch.active span{transform:translateX(20px)}
    .supply-panel{height:100%;min-width:0;background:#fff;border:1px solid var(--line);border-radius:15px;overflow:hidden;display:flex;flex-direction:column}.supply-panel.is-collapsed{height:auto;align-self:start}.supply-panel>header{min-height:78px;padding:13px 16px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between}.supply-panel h2{margin:2px 0 0}.supply-panel header button,.panel-tools button{border:1px solid var(--line);border-radius:9px;background:#fff;padding:9px 12px;font-weight:850}.panel-tools{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid var(--line)}.supply-list{flex:1;min-height:0;overflow:auto;padding:0 14px}.supply-list-group{border-bottom:1px solid var(--line)}.group-head{width:100%;height:52px;display:grid;grid-template-columns:1fr auto 30px;align-items:center;gap:8px;border:0;background:#fff;text-align:left}.group-lines{display:grid}.collapsed .group-lines{display:none}.supply-row{display:grid;grid-template-columns:32px 62px 1fr;align-items:center;gap:10px;width:100%;border:0;border-top:1px solid #f0ebe7;background:#fff;padding:10px 0;text-align:left}.supply-row.no-image{grid-template-columns:32px 1fr}.supply-row-img{width:62px;height:62px;border-radius:10px}.supply-row>span:last-child{display:grid;gap:4px}.supply-row small{color:var(--muted)}.supply-panel>footer{padding:13px;border-top:1px solid var(--line)}.supply-panel>footer button{min-height:48px;border:1px solid var(--line);border-radius:11px;background:#fff;font-weight:900}.supply-panel>footer .primary{width:100%;background:var(--orange);border-color:var(--orange);color:#fff}.batch-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.batch-actions button:first-child{color:#b53f35}.batch-actions button:nth-child(3){color:var(--green)}.batch-actions button:disabled{opacity:.4}.empty-state{height:100%;display:grid;place-content:center;text-align:center;color:var(--muted)}.empty-state strong{font-size:20px;color:var(--text)}
    .detail-scrim{position:fixed;inset:0;border:0;background:#30251f66;backdrop-filter:blur(5px);z-index:80}.readonly-detail{position:fixed;z-index:81;left:50%;top:50%;transform:translate(-50%,-50%);width:680px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 25px 80px #24170f55}.readonly-detail>header{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid var(--line)}.readonly-detail h2{margin:2px 0 0}.readonly-detail header button{width:42px;height:42px;border:0;border-radius:10px;font-size:25px}.detail-body{padding:20px;display:grid;grid-template-columns:210px 1fr;gap:20px}.detail-image{width:210px;height:210px;border-radius:14px}.detail-body dl{margin:0;display:grid;gap:8px}.detail-body dl div{display:grid;grid-template-columns:90px 1fr;padding:9px;border-bottom:1px solid var(--line)}.detail-body dt{color:var(--muted)}.detail-body dd{margin:0;font-weight:850}.detail-body p{grid-column:1/-1;margin:0;padding:12px;border-radius:10px;background:#f7f3ef;color:var(--muted)}.readonly-detail>footer{padding:14px 20px;border-top:1px solid var(--line);text-align:right}.readonly-detail>footer button{min-width:120px;min-height:46px;border:1px solid var(--line);border-radius:10px;background:#fff;font-weight:900}
    
    /* Sold-out page operational enhancements are part of the page core. */
    .purple-actions{display:flex;align-items:center;gap:9px;padding:10px 16px}
    .purple-actions button,.batch-entry,.selection-tools button,.card-mode button{min-height:40px;border:1px solid var(--line);border-radius:9px;background:#fff;font-weight:900;padding:0 13px}
    .purple-actions button:first-child{background:#6f4b83;color:#fff;border-color:#6f4b83}.purple-actions button:nth-child(2){color:#6f4b83;border-color:#9a7cab}.purple-actions span{color:var(--muted)}
    .soldout-category{color:#b53f35}.catalog-caption{align-items:center;gap:10px}.card-mode,.selection-tools{display:flex;align-items:center;gap:6px}.card-mode .active{background:var(--orange);color:#fff;border-color:var(--orange)}.selection-tools{margin-left:auto}.selection-tools b{font-size:13px}
    .supply-product.large,.supply-product.small,.supply-product.text{display:block;padding:0}
    .supply-product.text .card-open{grid-template-columns:minmax(0,1fr) auto}
    .supply-product.soldout{border:2px solid #f47b35;background:#fff4ea}.supply-product.soldout .card-open,.supply-product.soldout .product-info{background:#fff4ea}
    .supply-product.paused{border:2px solid #c83c36;background:#fff0ef}.supply-product.paused .card-open,.supply-product.paused .product-info{background:#fff0ef}
    .supply-product.soldout:hover{border-color:#df6420;box-shadow:0 7px 20px #f47b3526}.supply-product.paused:hover{border-color:#a92f2a;box-shadow:0 7px 20px #c83c3626}
    .supply-state.soldout{background:#f47b35;color:#fff}.supply-state.paused{background:#c83c36;color:#fff}
    .selection-mark{position:absolute;right:10px;top:10px;display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#fff;border:2px solid var(--orange);color:var(--orange);font-size:20px;font-weight:950;box-shadow:0 2px 9px #0002}.supply-product.selected .selection-mark{background:var(--orange);color:#fff}
    .detail-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.detail-actions button:first-child{background:#f47b35;color:#fff;border-color:#f47b35}.detail-actions button:nth-child(2){background:#c83c36;color:#fff;border-color:#c83c36}.detail-actions button:nth-child(3){color:var(--green);border-color:#9ac4ae}.supply-state.available{background:#e9f5ee;color:var(--green)}
    
    /* Adaptive product visuals belong to the Soldout page; shared adaptive core only supplies tokens. */
    .products{grid-auto-flow:row;align-content:start;min-height:0;overflow-y:auto;overscroll-behavior:contain}
    .products-large{grid-auto-rows:var(--adaptive-product-row-large)}
    .products-small{grid-auto-rows:var(--adaptive-product-row-small)}
    .products-text{grid-auto-rows:var(--adaptive-product-row-text)}
    .supply-product.large{height:var(--adaptive-product-row-large);min-height:0;max-height:var(--adaptive-product-row-large);align-self:stretch}
    .supply-product.small{height:var(--adaptive-product-row-small);min-height:0;max-height:var(--adaptive-product-row-small);align-self:stretch}
    .supply-product.text{height:var(--adaptive-product-row-text);min-height:0;max-height:var(--adaptive-product-row-text);align-self:stretch}
    .supply-product.large,.supply-product.small,.supply-product.text{display:block;grid-template-rows:none}
    .supply-product.large .card-open{grid-template-rows:minmax(0,3fr) minmax(0,1fr);min-height:0;height:100%}
    .supply-product.large .product-hero{width:100%;height:100%;min-height:0;max-height:none}
    .supply-product.large .product-info{min-height:0;height:100%;overflow:hidden;align-content:center;padding-block:clamp(5px,calc(var(--adaptive-product-row-large) * .035),10px)}
    .product-card strong{font-size:max(var(--min-readable-font),calc(17px * var(--readability-scale)))}
    .product-price{font-size:max(var(--min-readable-font),calc(21px * var(--readability-scale)))}
    .product-description{font-size:max(var(--min-readable-font),calc(13px * var(--readability-scale)));-webkit-line-clamp:1}
    .product-code{font-size:max(var(--min-readable-font),calc(16px * var(--readability-scale)))}
    .supply-product.small .card-open{grid-template-columns:min(calc(var(--adaptive-product-row-small) - 18px),82px) minmax(0,1fr) auto;gap:var(--adaptive-cart-gap);padding:calc(var(--adaptive-cart-pad) * .7) var(--adaptive-cart-pad)}
    .product-thumb{width:min(calc(var(--adaptive-product-row-small) - 18px),82px);height:min(calc(var(--adaptive-product-row-small) - 18px),82px)}
    .supply-product.text .card-open{grid-template-columns:minmax(0,1fr) auto;gap:max(8px,calc(var(--adaptive-cart-gap) * 1.08));padding:var(--adaptive-cart-pad) calc(var(--adaptive-cart-pad) * 1.15)}"

      65 |     '.supply-product.small{height:',
      66 |     '.supply-product.text{height:'
    > 67 |   ])expect(source,token).not.toContain(token);
         |                              ^
      68 |   const shared=read('shared/adaptive-layout.css');
      69 |   expect(shared).toContain('body[data-page="order"] .product-card.large');
      70 |   expect(shared).toContain('body[data-page="soldout"] .supply-product.large');
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-architecture-guard.spec.js:67:30

    Error Context: test-results/responsive-architecture-gu-355af--independent-fixed-geometry/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-architecture-gu-355af--independent-fixed-geometry/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-architecture-gu-355af--independent-fixed-geometry/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: .supply-product.large{height:

    expect(received).not.toContain(expected) // indexOf

    Expected substring: not ".supply-product.large{height:"
    Received string:        ":root{--side-width:32%}.soldout-grid{height:100%;display:grid;grid-template-columns:minmax(0,1fr) var(--side-width);gap:16px}.page-title{display:grid;gap:2px}.page-title strong{font-size:22px}.page-title small,.catalog-caption,.panel-tools small{color:var(--muted)}.search-box{width:330px;height:46px;display:flex;align-items:center;gap:8px;padding:0 13px;border:1px solid var(--line);border-radius:11px;background:#fff}.search-box input{width:100%;border:0;outline:0}.status-filter{display:flex}.status-filter button{min-width:82px;border:1px solid var(--line);background:#fff;padding:0 14px;font-weight:850}.status-filter button:first-child{border-radius:11px 0 0 11px}.status-filter button:last-child{border-radius:0 11px 11px 0}.status-filter .active{background:var(--orange);color:#fff}.catalog-caption{display:flex;justify-content:space-between;padding:0 16px 10px}.catalog-caption strong{color:var(--text)}.supply-product{position:relative}.supply-product .card-open{width:100%;height:100%;border:0;background:transparent;padding:0;text-align:left;color:inherit}.supply-product.large .card-open{display:grid}.supply-product.small .card-open{display:grid;align-items:center}.supply-product.text .card-open{display:grid;align-items:center}.supply-product.selected{border-color:var(--orange);box-shadow:inset 0 0 0 2px var(--orange),var(--lift)}.supply-state{width:max-content;font-style:normal;font-size:13px;font-weight:900;border-radius:999px;padding:3px 8px}.supply-state.soldout{background:#fff0ee;color:#b53f35}.supply-state.paused{background:#f0ece8;color:#715c4e}.select-switch{position:absolute;right:10px;top:10px;width:54px;height:32px;border:2px solid #fff;border-radius:999px;background:#c8bdb5;box-shadow:0 2px 9px #0002;padding:3px;z-index:3}.select-switch span{display:block;width:22px;height:22px;border-radius:50%;background:#fff}.select-switch.active{background:var(--orange)}.select-switch.active span{transform:translateX(20px)}
    .supply-panel{height:100%;min-width:0;background:#fff;border:1px solid var(--line);border-radius:15px;overflow:hidden;display:flex;flex-direction:column}.supply-panel.is-collapsed{height:auto;align-self:start}.supply-panel>header{min-height:78px;padding:13px 16px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between}.supply-panel h2{margin:2px 0 0}.supply-panel header button,.panel-tools button{border:1px solid var(--line);border-radius:9px;background:#fff;padding:9px 12px;font-weight:850}.panel-tools{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid var(--line)}.supply-list{flex:1;min-height:0;overflow:auto;padding:0 14px}.supply-list-group{border-bottom:1px solid var(--line)}.group-head{width:100%;height:52px;display:grid;grid-template-columns:1fr auto 30px;align-items:center;gap:8px;border:0;background:#fff;text-align:left}.group-lines{display:grid}.collapsed .group-lines{display:none}.supply-row{display:grid;grid-template-columns:32px 62px 1fr;align-items:center;gap:10px;width:100%;border:0;border-top:1px solid #f0ebe7;background:#fff;padding:10px 0;text-align:left}.supply-row.no-image{grid-template-columns:32px 1fr}.supply-row-img{width:62px;height:62px;border-radius:10px}.supply-row>span:last-child{display:grid;gap:4px}.supply-row small{color:var(--muted)}.supply-panel>footer{padding:13px;border-top:1px solid var(--line)}.supply-panel>footer button{min-height:48px;border:1px solid var(--line);border-radius:11px;background:#fff;font-weight:900}.supply-panel>footer .primary{width:100%;background:var(--orange);border-color:var(--orange);color:#fff}.batch-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.batch-actions button:first-child{color:#b53f35}.batch-actions button:nth-child(3){color:var(--green)}.batch-actions button:disabled{opacity:.4}.empty-state{height:100%;display:grid;place-content:center;text-align:center;color:var(--muted)}.empty-state strong{font-size:20px;color:var(--text)}
    .detail-scrim{position:fixed;inset:0;border:0;background:#30251f66;backdrop-filter:blur(5px);z-index:80}.readonly-detail{position:fixed;z-index:81;left:50%;top:50%;transform:translate(-50%,-50%);width:680px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 25px 80px #24170f55}.readonly-detail>header{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid var(--line)}.readonly-detail h2{margin:2px 0 0}.readonly-detail header button{width:42px;height:42px;border:0;border-radius:10px;font-size:25px}.detail-body{padding:20px;display:grid;grid-template-columns:210px 1fr;gap:20px}.detail-image{width:210px;height:210px;border-radius:14px}.detail-body dl{margin:0;display:grid;gap:8px}.detail-body dl div{display:grid;grid-template-columns:90px 1fr;padding:9px;border-bottom:1px solid var(--line)}.detail-body dt{color:var(--muted)}.detail-body dd{margin:0;font-weight:850}.detail-body p{grid-column:1/-1;margin:0;padding:12px;border-radius:10px;background:#f7f3ef;color:var(--muted)}.readonly-detail>footer{padding:14px 20px;border-top:1px solid var(--line);text-align:right}.readonly-detail>footer button{min-width:120px;min-height:46px;border:1px solid var(--line);border-radius:10px;background:#fff;font-weight:900}
    
    /* Sold-out page operational enhancements are part of the page core. */
    .purple-actions{display:flex;align-items:center;gap:9px;padding:10px 16px}
    .purple-actions button,.batch-entry,.selection-tools button,.card-mode button{min-height:40px;border:1px solid var(--line);border-radius:9px;background:#fff;font-weight:900;padding:0 13px}
    .purple-actions button:first-child{background:#6f4b83;color:#fff;border-color:#6f4b83}.purple-actions button:nth-child(2){color:#6f4b83;border-color:#9a7cab}.purple-actions span{color:var(--muted)}
    .soldout-category{color:#b53f35}.catalog-caption{align-items:center;gap:10px}.card-mode,.selection-tools{display:flex;align-items:center;gap:6px}.card-mode .active{background:var(--orange);color:#fff;border-color:var(--orange)}.selection-tools{margin-left:auto}.selection-tools b{font-size:13px}
    .supply-product.large,.supply-product.small,.supply-product.text{display:block;padding:0}
    .supply-product.text .card-open{grid-template-columns:minmax(0,1fr) auto}
    .supply-product.soldout{border:2px solid #f47b35;background:#fff4ea}.supply-product.soldout .card-open,.supply-product.soldout .product-info{background:#fff4ea}
    .supply-product.paused{border:2px solid #c83c36;background:#fff0ef}.supply-product.paused .card-open,.supply-product.paused .product-info{background:#fff0ef}
    .supply-product.soldout:hover{border-color:#df6420;box-shadow:0 7px 20px #f47b3526}.supply-product.paused:hover{border-color:#a92f2a;box-shadow:0 7px 20px #c83c3626}
    .supply-state.soldout{background:#f47b35;color:#fff}.supply-state.paused{background:#c83c36;color:#fff}
    .selection-mark{position:absolute;right:10px;top:10px;display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#fff;border:2px solid var(--orange);color:var(--orange);font-size:20px;font-weight:950;box-shadow:0 2px 9px #0002}.supply-product.selected .selection-mark{background:var(--orange);color:#fff}
    .detail-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.detail-actions button:first-child{background:#f47b35;color:#fff;border-color:#f47b35}.detail-actions button:nth-child(2){background:#c83c36;color:#fff;border-color:#c83c36}.detail-actions button:nth-child(3){color:var(--green);border-color:#9ac4ae}.supply-state.available{background:#e9f5ee;color:var(--green)}
    
    /* Adaptive product visuals belong to the Soldout page; shared adaptive core only supplies tokens. */
    .products{grid-auto-flow:row;align-content:start;min-height:0;overflow-y:auto;overscroll-behavior:contain}
    .products-large{grid-auto-rows:var(--adaptive-product-row-large)}
    .products-small{grid-auto-rows:var(--adaptive-product-row-small)}
    .products-text{grid-auto-rows:var(--adaptive-product-row-text)}
    .supply-product.large{height:var(--adaptive-product-row-large);min-height:0;max-height:var(--adaptive-product-row-large);align-self:stretch}
    .supply-product.small{height:var(--adaptive-product-row-small);min-height:0;max-height:var(--adaptive-product-row-small);align-self:stretch}
    .supply-product.text{height:var(--adaptive-product-row-text);min-height:0;max-height:var(--adaptive-product-row-text);align-self:stretch}
    .supply-product.large,.supply-product.small,.supply-product.text{display:block;grid-template-rows:none}
    .supply-product.large .card-open{grid-template-rows:minmax(0,3fr) minmax(0,1fr);min-height:0;height:100%}
    .supply-product.large .product-hero{width:100%;height:100%;min-height:0;max-height:none}
    .supply-product.large .product-info{min-height:0;height:100%;overflow:hidden;align-content:center;padding-block:clamp(5px,calc(var(--adaptive-product-row-large) * .035),10px)}
    .product-card strong{font-size:max(var(--min-readable-font),calc(17px * var(--readability-scale)))}
    .product-price{font-size:max(var(--min-readable-font),calc(21px * var(--readability-scale)))}
    .product-description{font-size:max(var(--min-readable-font),calc(13px * var(--readability-scale)));-webkit-line-clamp:1}
    .product-code{font-size:max(var(--min-readable-font),calc(16px * var(--readability-scale)))}
    .supply-product.small .card-open{grid-template-columns:min(calc(var(--adaptive-product-row-small) - 18px),82px) minmax(0,1fr) auto;gap:var(--adaptive-cart-gap);padding:calc(var(--adaptive-cart-pad) * .7) var(--adaptive-cart-pad)}
    .product-thumb{width:min(calc(var(--adaptive-product-row-small) - 18px),82px);height:min(calc(var(--adaptive-product-row-small) - 18px),82px)}
    .supply-product.text .card-open{grid-template-columns:minmax(0,1fr) auto;gap:max(8px,calc(var(--adaptive-cart-gap) * 1.08));padding:var(--adaptive-cart-pad) calc(var(--adaptive-cart-pad) * 1.15)}"

      65 |     '.supply-product.small{height:',
      66 |     '.supply-product.text{height:'
    > 67 |   ])expect(source,token).not.toContain(token);
         |                              ^
      68 |   const shared=read('shared/adaptive-layout.css');
      69 |   expect(shared).toContain('body[data-page="order"] .product-card.large');
      70 |   expect(shared).toContain('body[data-page="soldout"] .supply-product.large');
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-architecture-guard.spec.js:67:30

    Error Context: test-results/responsive-architecture-gu-355af--independent-fixed-geometry-retry1/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-architecture-gu-355af--independent-fixed-geometry-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-architecture-gu-355af--independent-fixed-geometry-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[7/7] tests/responsive-architecture-guard.spec.js:77:1 › shared bottom navigation geometry has a single owner
[8/7] (retries) tests/responsive-architecture-guard.spec.js:77:1 › shared bottom navigation geometry has a single owner (retry #1)
  2) tests/responsive-architecture-guard.spec.js:77:1 › shared bottom navigation geometry has a single owner 

    Error: Bottom-nav geometry must live only in shared/page-base.css

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "styles.css",
    + ]

      85 |     }
      86 |   }
    > 87 |   expect(offenders,'Bottom-nav geometry must live only in shared/page-base.css').toEqual([]);
         |                                                                                  ^
      88 | });
      89 |
      90 | test('shared shell cannot regress to fixed bottom-nav child geometry',()=>{
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-architecture-guard.spec.js:87:82

    Error Context: test-results/responsive-architecture-gu-76f14-geometry-has-a-single-owner/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-architecture-gu-76f14-geometry-has-a-single-owner/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-architecture-gu-76f14-geometry-has-a-single-owner/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Bottom-nav geometry must live only in shared/page-base.css

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "styles.css",
    + ]

      85 |     }
      86 |   }
    > 87 |   expect(offenders,'Bottom-nav geometry must live only in shared/page-base.css').toEqual([]);
         |                                                                                  ^
      88 | });
      89 |
      90 | test('shared shell cannot regress to fixed bottom-nav child geometry',()=>{
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-architecture-guard.spec.js:87:82

    Error Context: test-results/responsive-architecture-gu-76f14-geometry-has-a-single-owner-retry1/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-architecture-gu-76f14-geometry-has-a-single-owner-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-architecture-gu-76f14-geometry-has-a-single-owner-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[9/7] tests/responsive-architecture-guard.spec.js:90:1 › shared shell cannot regress to fixed bottom-nav child geometry
[10/7] (retries) tests/responsive-architecture-guard.spec.js:90:1 › shared shell cannot regress to fixed bottom-nav child geometry (retry #1)
  3) tests/responsive-architecture-guard.spec.js:90:1 › shared shell cannot regress to fixed bottom-nav child geometry 

    Error: expect(received).toContain(expected) // indexOf

    Expected substring: "--bottom-nav-icon-size"
    Received string:    "@import url('./responsive.css');·
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
      font-family: -apple-system, BlinkMacSystemFont, \"PingFang HK\", \"Noto Sans TC\", \"Microsoft JhengHei\", sans-serif;
      color: var(--text);
    }
    :root[data-theme=\"warm\"]{--orange:#ef5218;--orange-soft:#fff2e9;--bg:#f8f6f2;--text:#251f1b;--line:#e7dfd8}
    :root[data-theme=\"tea\"]{--orange:#845d45;--orange-soft:#f5eee8;--bg:#f7f4f0;--text:#2d211b;--line:#e2d8cf}
    :root[data-theme=\"sprout\"]{--orange:#34755e;--orange-soft:#eaf4ef;--bg:#f3f7f4;--text:#17251f;--line:#d7e3dc}
    :root[data-theme=\"purple\"]{--orange:#755d86;--orange-soft:#f1edf4;--bg:#f7f4f8;--text:#281f2d;--line:#e1d9e5}
    :root[data-theme=\"sunset\"]{--orange:#a95048;--orange-soft:#f8ecea;--bg:#f8f4f2;--text:#2e1e1c;--line:#e6d7d3}
    :root[data-theme=\"mist\"]{--orange:#4d6477;--orange-soft:#edf2f5;--bg:#f4f6f7;--text:#1c252c;--line:#d8e0e5}
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
    .anchored-card::before{content:\"\";position:absolute;width:16px;height:16px;background:#fff;border-left:1px solid var(--line);border-top:1px solid var(--line);transform:rotate(45deg);z-index:-1}
    .anchored-card[data-arrow-side=\"top\"]::before{top:-9px;left:var(--anchor-x,50%);margin-left:-8px}
    .anchored-card[data-arrow-side=\"right\"]::before{right:-9px;top:var(--anchor-y,50%);margin-top:-8px;transform:rotate(135deg)}
    .anchored-card[data-arrow-side=\"bottom\"]::before{bottom:-9px;left:var(--anchor-x,50%);margin-left:-8px;transform:rotate(225deg)}
    .anchored-card[data-arrow-side=\"left\"]::before{left:-9px;top:var(--anchor-y,50%);margin-top:-8px;transform:rotate(-45deg)}
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
    .image-fallback{display:grid;place-items:center;width:100%;height:100%;color:#966f58;font-weight:850}·
    /* Transitional runtime guard only: global chrome visual ownership lives in app-shell.css. */
    :root[data-global-shell=\"1\"] :is(.global-statusbar,.shell-bottom-nav,.bottom-nav,.topbar.statusbar){display:none}
    :root[data-global-shell=\"1\"] .app{height:100%;min-height:0}
    :root[data-global-shell=\"1\"] .workspace{min-height:0}
    :root[data-global-shell=\"1\"] body[data-page=\"more\"] .more-heading{display:none}·
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
    @media (prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}button:not(:disabled):active{transform:none}}"

      90 | test('shared shell cannot regress to fixed bottom-nav child geometry',()=>{
      91 |   const source=read('shared/page-base.css');
    > 92 |   expect(source).toContain('--bottom-nav-icon-size');
         |                  ^
      93 |   expect(source).toContain('env(safe-area-inset-bottom)');
      94 |   expect(source).toContain('height:auto');
      95 |   expect(source).not.toContain('.shell-nav-button{display:grid;grid-template-rows:25px auto');
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-architecture-guard.spec.js:92:18

    Error Context: test-results/responsive-architecture-gu-1008e-d-bottom-nav-child-geometry/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-architecture-gu-1008e-d-bottom-nav-child-geometry/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-architecture-gu-1008e-d-bottom-nav-child-geometry/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toContain(expected) // indexOf

    Expected substring: "--bottom-nav-icon-size"
    Received string:    "@import url('./responsive.css');·
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
      font-family: -apple-system, BlinkMacSystemFont, \"PingFang HK\", \"Noto Sans TC\", \"Microsoft JhengHei\", sans-serif;
      color: var(--text);
    }
    :root[data-theme=\"warm\"]{--orange:#ef5218;--orange-soft:#fff2e9;--bg:#f8f6f2;--text:#251f1b;--line:#e7dfd8}
    :root[data-theme=\"tea\"]{--orange:#845d45;--orange-soft:#f5eee8;--bg:#f7f4f0;--text:#2d211b;--line:#e2d8cf}
    :root[data-theme=\"sprout\"]{--orange:#34755e;--orange-soft:#eaf4ef;--bg:#f3f7f4;--text:#17251f;--line:#d7e3dc}
    :root[data-theme=\"purple\"]{--orange:#755d86;--orange-soft:#f1edf4;--bg:#f7f4f8;--text:#281f2d;--line:#e1d9e5}
    :root[data-theme=\"sunset\"]{--orange:#a95048;--orange-soft:#f8ecea;--bg:#f8f4f2;--text:#2e1e1c;--line:#e6d7d3}
    :root[data-theme=\"mist\"]{--orange:#4d6477;--orange-soft:#edf2f5;--bg:#f4f6f7;--text:#1c252c;--line:#d8e0e5}
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
    .anchored-card::before{content:\"\";position:absolute;width:16px;height:16px;background:#fff;border-left:1px solid var(--line);border-top:1px solid var(--line);transform:rotate(45deg);z-index:-1}
    .anchored-card[data-arrow-side=\"top\"]::before{top:-9px;left:var(--anchor-x,50%);margin-left:-8px}
    .anchored-card[data-arrow-side=\"right\"]::before{right:-9px;top:var(--anchor-y,50%);margin-top:-8px;transform:rotate(135deg)}
    .anchored-card[data-arrow-side=\"bottom\"]::before{bottom:-9px;left:var(--anchor-x,50%);margin-left:-8px;transform:rotate(225deg)}
    .anchored-card[data-arrow-side=\"left\"]::before{left:-9px;top:var(--anchor-y,50%);margin-top:-8px;transform:rotate(-45deg)}
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
    .image-fallback{display:grid;place-items:center;width:100%;height:100%;color:#966f58;font-weight:850}·
    /* Transitional runtime guard only: global chrome visual ownership lives in app-shell.css. */
    :root[data-global-shell=\"1\"] :is(.global-statusbar,.shell-bottom-nav,.bottom-nav,.topbar.statusbar){display:none}
    :root[data-global-shell=\"1\"] .app{height:100%;min-height:0}
    :root[data-global-shell=\"1\"] .workspace{min-height:0}
    :root[data-global-shell=\"1\"] body[data-page=\"more\"] .more-heading{display:none}·
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
    @media (prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}button:not(:disabled):active{transform:none}}"

      90 | test('shared shell cannot regress to fixed bottom-nav child geometry',()=>{
      91 |   const source=read('shared/page-base.css');
    > 92 |   expect(source).toContain('--bottom-nav-icon-size');
         |                  ^
      93 |   expect(source).toContain('env(safe-area-inset-bottom)');
      94 |   expect(source).toContain('height:auto');
      95 |   expect(source).not.toContain('.shell-nav-button{display:grid;grid-template-rows:25px auto');
        at /home/runner/work/morefunos-smt/morefunos-smt/tests/responsive-architecture-guard.spec.js:92:18

    Error Context: test-results/responsive-architecture-gu-1008e-d-bottom-nav-child-geometry-retry1/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/responsive-architecture-gu-1008e-d-bottom-nav-child-geometry-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/responsive-architecture-gu-1008e-d-bottom-nav-child-geometry-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


  3 failed
    tests/responsive-architecture-guard.spec.js:59:1 › soldout product cards cannot define independent fixed geometry 
    tests/responsive-architecture-guard.spec.js:77:1 › shared bottom navigation geometry has a single owner 
    tests/responsive-architecture-guard.spec.js:90:1 › shared shell cannot regress to fixed bottom-nav child geometry 
  4 passed (3.1s)
FAIL tests/responsive-architecture-guard.spec.js exit=1
===== RUN tests/stress-responsive-matrix.spec.js =====

Running 5 tests using 1 worker

[1/5] tests/stress-responsive-matrix.spec.js:18:3 › responsive stress matrix 1920x1080
[2/5] tests/stress-responsive-matrix.spec.js:18:3 › responsive stress matrix 1600x900
[3/5] tests/stress-responsive-matrix.spec.js:18:3 › responsive stress matrix 1440x900
TIMEOUT tests/stress-responsive-matrix.spec.js
===== RUN tests/dev-preview.spec.js =====

Running 2 tests using 1 worker

[1/2] tests/dev-preview.spec.js:11:1 › development preview exposes all target sizes and gives SMT the requested viewport
TIMEOUT tests/dev-preview.spec.js
===== RUN tests/responsive-visual-contract.spec.js =====

Running 6 tests using 1 worker

[1/6] tests/responsive-visual-contract.spec.js:42:3 › visual contract 1920x1080
TIMEOUT tests/responsive-visual-contract.spec.js
===== RUN tests/proportional-layout.spec.js =====

Running 12 tests using 1 worker

[1/12] tests/proportional-layout.spec.js:46:3 › order exact visible-row capacity 1920x1080
TIMEOUT tests/proportional-layout.spec.js
Browser regression failures: 8
```

### Per-spec summary
```text
PASS tests/responsive-profile.spec.js
FAIL tests/responsive-shell.spec.js exit=1
FAIL tests/responsive-order.spec.js exit=1
PASS tests/responsive-checkout.spec.js
FAIL tests/responsive-secondary-pages.spec.js exit=1
FAIL tests/responsive-architecture-guard.spec.js exit=1
TIMEOUT tests/stress-responsive-matrix.spec.js
TIMEOUT tests/dev-preview.spec.js
TIMEOUT tests/responsive-visual-contract.spec.js
TIMEOUT tests/proportional-layout.spec.js
Browser regression failures: 8
```

NPM_STATUS=0
BROWSER_INSTALL_STATUS=0
SERVER_STATUS=0
AUDIT_STATUS=0
TEST_STATUS=1
SYNTAX_STATUS=0
BROWSER_STATUS=1
RESULT=FAIL
