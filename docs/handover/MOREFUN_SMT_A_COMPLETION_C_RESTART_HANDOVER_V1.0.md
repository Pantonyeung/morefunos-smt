# More Fun／磨飯 SMT｜A 線完成 × C 線 APK 重啟交接文件 V1.0

狀態：CURRENT HANDOVER AUTHORITY  
日期：2026-07-28  
正式基準：`smt-functional-completeness-v1`

---

# 一、文件目的

本文件用作 More Fun／磨飯 SMT 專案的正式交接依據，記錄：

1. A 線如何完成 Android Adaptive／五尺寸 QA；
2. 成功方法及不能再重犯的問題；
3. A 線完成證據及正式基準；
4. C 線 APK 封裝接手後發現的問題；
5. 為何放棄 PR #19 的舊歷史，改為乾淨重啟；
6. 新 C 線接手者必須遵守的流程、邊界及驗收 Gate。

任何後續 AI／工程師接手前，必須先讀取本文件，不得依靠舊對話猜測狀態。

---

# 二、A 線正式定義

A 線任務：SMT Android Adaptive Design、五尺寸根因修正及 Browser QA 收口。

A 線不是：

- APK 封裝；
- Android Native Bridge；
- 打印機實機驗收；
- Firebase／正式訂單同步；
- Production APK signing。

---

# 三、A 線完成內容

## 3.1 Android Adaptive Contract

已建立 Android Window Size Class 思路，而不是把 1920×1080 舊畫面縮放成 1280×800。

Width classes：

- compact
- medium
- expanded
- large
- xlarge

Height classes：

- compact
- medium
- expanded

同時提供 two-pane eligibility，並保留 responsive density 作 Adaptive Contract 下層密度控制。

主要 Runtime：

- `shared/responsive.js`
- `shared/runtime.js`

## 3.2 五個正式尺寸

以下尺寸全部納入正式 QA：

- 1920×1080
- 1600×900
- 1440×900
- 1366×768
- 1280×800

## 3.3 Root Cause Fix

已處理：

- Shell action proxy／child source bridge；
- Secondary page iframe readiness race；
- Preview sequential viewport timeout；
- Compact large-card 72/28 image geometry；
- Soldout／Order 共用產品卡尺寸模型；
- 移除 retired `styles.css` authority；
- 全局 bottom navigation 單一 owner；
- safe-area-aware shell；
- 禁止 legacy size patch files；
- 禁止新 responsive layer 使用 `!important` 補丁。

## 3.4 QA 結果

Final Full Browser Matrix：

- 78／78 PASS
- 0 failure
- 0 flaky
- 5 個 viewport 全部通過
- 執行時間約 2.6 分鐘

Stress Matrix：

- 5／5 PASS
- 0 flaky
- 約 41.7 秒

## 3.5 正式合併

PR：#22  
標題：`SMT Adaptive QA V1｜Android Window Contract＋五尺寸根因修正`

最終狀態：

- merged = true
- closed = true
- merged at：2026-07-28 20:59 香港時間
- 正式基準：`smt-functional-completeness-v1`

---

# 四、A 線點解成功

## 4.1 放棄補丁式尺寸修正

錯誤做法包括：

- 喺 1920 舊結構上不斷加 media query；
- 使用 fixed height、z-index、hardcoded override 壓住問題；
- 大量 `!important`；
- 每個頁面各自定義卡片高度；
- 售罄頁同點單頁分別擁有產品卡 Authority。

最終成功方法：

- 先定義 Adaptive Contract；
- 尺寸 class 由 Runtime 單一計算；
- 組件只消費 shared tokens；
- 一個幾何模型只容許一個 owner；
- 測試驗證 Authority，而唔只驗證畫面「睇落差唔多」。

## 4.2 由 Root Cause 修正，不再修表面

每個 failure 必須先定位：

- Runtime race；
- iframe readiness；
- locator async overhead；
- geometry owner 重複；
- obsolete CSS authority；
- 測試本身 timeout／flaky。

禁止未理解根因就直接改 CSS。

## 4.3 重建乾淨 PR，而不是修補 161 commits 舊歷史

原 A 線分支曾出現：

- 約 161 commits；
- behind base；
- merge conflict；
- PR 難以審核；
- 舊提交混入大量已淘汰修改。

成功做法：

1. 由最新正式 base 重建乾淨 branch；
2. 只搬入已驗證有效內容；
3. 重跑完整 gate；
4. 以乾淨 PR 合併。

此方法已證明比 rebase／逐個解 conflict 更安全。

## 4.4 Stress Test Flaky 的真正原因

原壓力測試在重循環內重複呼叫 `locator.count()`，造成 async overhead 及 timeout，並非 Runtime 功能錯誤。

修正原則：

- 減少重複 locator discovery；
- 使用明確 iframe readiness polling；
- 把測試工具成本同產品 bug 分開判斷；
- 任何 flaky 必須收口至 0，不能以「重跑會過」當完成。

---

# 五、A 線踩過的坑及永久限制

## 5.1 禁止再做

- 禁止把 1920×1080 舊 UI 縮放成 1280×800；
- 禁止 page-by-page size patch；
- 禁止新增大量 `!important`；
- 禁止用 fixed height／z-index 遮蓋 overflow；
- 禁止同一組件有多個 CSS Authority；
- 禁止未跑五尺寸 Full Browser Matrix 就聲稱完成；
- 禁止有 flaky 仍合併；
- 禁止在落後數十個 commits 的長歷史分支直接合併。

## 5.2 必須保留

- Android Adaptive Window Contract；
- 1920 視覺封板；
- 1280×800 正式尺寸；
- shared product-card geometry；
- safe-area-aware shell；
- Full Browser Matrix；
- Architecture Guard。

---

# 六、C 線正式定義

C 線任務：SMT APK 封裝／Android Native Host。

C 線不是 Printer Web Module。Printer Module 為另一條獨立工作線；C 線只提供 Native transport／device capability，不重新計算打印模板、路由或業務規則。

C 線目標：

- Kotlin Android Shell；
- WebViewAssetLoader；
- Origin-restricted WebMessage Bridge；
- Android 6／9／11 單一 APK；
- Device／Terminal identity；
- Network／Lifecycle／Kiosk；
- Offline Queue；
- Verified Web Runtime bundle；
- Version Vault、health confirm、rollback；
- LAN／Sunmi Native print transport；
- Diagnostics；
- Debug APK artifact；
- Production signing workflow。

---

# 七、接手 C 線後發現的問題

## 7.1 PR #19 歷史過重

舊 PR：#19  
Branch：`apk-foundation-v1`

接手時狀態：

- ahead 約 96–99 commits；
- behind 正式基準約 84 commits；
- status = diverged；
- mergeable = false；
- 36–38 changed files；
- 約 2,900–3,000 additions；
- PR 歷史混合多次 CI trigger、修正及舊 base。

問題不是 APK 概念完全錯誤，而是交付歷史不可安全審核及合併。

## 7.2 已存在的有效資產

PR #19 內已有可參考的有效設計：

- `android/**` Kotlin foundation；
- `validate-apk-foundation.yml`；
- `build-production-apk.yml`；
- `publish-smt-web-bundle.yml`；
- API 23 minSdk；
- AndroidX WebKit 1.15.0；
- Bridge 1.2.0；
- Debug APK checksum；
- Runtime overlay／rollback 架構；
- Release manifest signature verification；
- LAN TCP print transport；
- offline queue；
- device printer settings。

但這些內容只能作來源參考，不可把 99 個舊 commits 原樣帶入新線。

## 7.3 尚未完成的真實 Gate

以下未有證據，不得聲稱完成：

- Debug APK CI artifact 確認；
- Production signed APK secrets 完整；
- Android 6 實機安裝；
- Android 9 實機安裝；
- Android 11 實機安裝；
- T2／T2S／新 POS WebView 實際兼容；
- Runtime overlay install／rollback 實機；
- LAN 真實打印；
- Sunmi built-in 真實打印；
- 中文 raster、走紙、切紙、標籤；
- 正向／反向打印；
- restart 後 device settings 保留。

---

# 八、C 線重啟決策

正式決策：PR #19 不再作最終合併 PR，標記為 superseded／reference only。

原因：

- behind 84 commits；
- ahead 99 commits；
- 舊歷史過重；
- mergeable false；
- 即使逐個解 conflict，都難以證明未混入 obsolete base；
- A 線已證明 Clean Rebuild 係更安全方法。

新方法：

1. 由最新 `smt-functional-completeness-v1` 建立乾淨 C 線；
2. 重新定義最小 APK Foundation；
3. 只搬入經逐檔審核的 Native Host 資產；
4. 不搬舊 CI trigger／result marker／歷史噪音；
5. 先 Static Preflight；
6. 再 Gradle Debug Build；
7. 產生 APK＋SHA-256 artifact；
8. PR 必須 ahead 小量 commits、behind 0、mergeable true；
9. 合併後再進入實機 Gate；
10. Production signing 與三機驗收必須獨立記錄。

---

# 九、新 C 線不可破壞的架構邊界

Native Host 可以負責：

- WebView；
- Bridge；
- device／network；
- kiosk；
- file import／export；
- offline queue；
- verified update／rollback；
- print bytes transport；
- device settings；
- diagnostics。

Native Host 禁止負責：

- menu；
- pricing；
- order business logic；
- checkout；
- Required／Optional／Pairing；
- product card UI；
- 打印模板重新計算；
- 自行選 Primary／Fallback 路由；
- 建立第二套 Business Logic。

---

# 十、新 C 線完成 Gate

## Phase C1｜乾淨 Foundation

- branch 由最新 base 建立；
- behind 0；
- Static Preflight PASS；
- Gradle `assembleDebug` PASS；
- APK 非空；
- SHA-256 產出；
- GitHub artifact 可下載；
- PR mergeable true；
- 不改 A 線 Runtime／UI／商業規則。

## Phase C2｜實機兼容

- Android 6 安裝及啟動；
- Android 9 安裝及啟動；
- Android 11 安裝及啟動；
- Bridge／device／network；
- Kiosk／landscape；
- WebView user-agent 證據；
- offline queue；
- update／rollback。

## Phase C3｜硬件與 Production

- LAN real print；
- Sunmi built-in；
- receipt／kitchen／label；
- 中文 raster；
- cut／feed；
- forward／reverse；
- idempotency；
- production signing；
- checksum；
- rollback drill。

只有 C1、C2、C3 全部有證據，才可以標記 C 線 Production Complete。

---

# 十一、交接者執行順序

1. 讀本文件；
2. 讀正式基準 `smt-functional-completeness-v1`；
3. 不再使用 PR #19 作可合併歷史；
4. 建立乾淨 branch；
5. 逐檔搬 Native Host；
6. 每批次 build；
7. 保留 evidence；
8. 未有實機證據時，明確標示 Foundation／Not Production Locked；
9. 任何新問題更新本文件、Google Drive 交接文件及 Jade Note 長期記錄。

---

# 十二、目前狀態摘要

A 線：已完成、已合併、78／78 PASS。  
C 線：舊 PR #19 判定歷史過重，停止作最終合併來源；改由最新正式基準乾淨重啟。  
下一步：建立新 C 線 branch／PR，完成 Debug APK build artifact，再安排三機實機驗收。
