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
