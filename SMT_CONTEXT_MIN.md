# SMT Context Min｜新對話最小上下文

你正在協助開發香港餐飲 POS「磨飯 SMT」。現行功能完整性分支 `smt-functional-completeness-v1`。任何 AI／Codex／Work 開始前必須先讀 `AGENTS.md`、`docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`、`docs/MFKG_STANDARD_V1.0.md`、`docs/SMT_ADAPTIVE_APPLICATION_STANDARD_V1.0.md`、`docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md`、`docs/SMT_EXTERNAL_ENGINEERING_REFERENCE_STANDARD_V1.0.md`、`docs/qa/SMT_ENGINEERING_SUCCESS_AND_PITFALLS_V1.0.md`、根目錄 `SMT_CHANGE_IMPACT.md` 及最新 `docs/qa/SMT_RUNTIME_PHASE3_QA.md`。三份最高標準共同構成 SMT Development Standard。舊 Lock 只作安全回滾；功能真相以最高標準、Decision Ledger、Current Lock、Implementation Status、MFKG、正式 Runtime 及最新證據為準。Firebase RTDB 是即時餐牌來源；Google Sheet 只作 Mirror／Control／Fallback 參考，Apps Script 不在正式 POS 運行鏈路。

`order-v1-29` 起，點單頁基礎狀態欄是所有主要頁永久全域欄，頁面專用狀態只可附加；底部五項導航共用同一元件、尺寸、圖標及完整選中膠囊。分類、頁籤、渠道、付款、來源、模式及主題等文字式選擇亦共用膠囊語言；產品、訂單及飲品內容卡保留卡片選中框。

核心規則：固定頂／底欄；內容內滾動；同時只開一張卡；背景及空白不可關卡；卡貼近來源且箭嘴精確指向；右手主要確認。購物車價格最右，上價下操作，圖片可關且不留空位。快捷模式點產品直接入車，必選進待補。快捷飲品平時只見底部把手，展開向上；快捷飲品、產品修改套餐飲品、必選整理飲品共用同一 image-first Drink Choice Card 核心，圖片係主要辨認資訊，名稱及選中數量屬次要資訊；容器尺寸可不同但不得另寫第二套 Card。指定配對按數量產生 A–Z。待處理分 App／Web 和電話／WhatsApp；核款才接單，接單後運行30分鐘自動完成。

暫存按終端分開流水（SMT-01／SMM-01）；跨機取回保留來源，再暫存改用接手機新編號；結帳寫入實際結帳終端及完整 audit。

渠道付款已分流：只有現場外賣／堂食選付款，現金先顯示鍵盤；電話／WhatsApp及磨飯 App 備用單進入付款待核實；Keeta／Foodpanda為平台已付並記25%佣金預估。完成核對、更正原因、核數／通知隊列及行內部分取消已有本機鏈路，真實 Firebase／通知／硬件 API 尚未接入。

完成度分開：`未做`、`部分做到`、`程式有、實機失敗`、`待實機驗收`、`已鎖定`。自動測試不等於 T2／T2S／新 POS 已鎖定；真實 API、付款上載及硬件必須另有實機證據。

堂食頁固定為一至八號及戶外九宮格；枱位只分未使用／使用中，35分鐘只作紅色提示。空枱進入點餐只建立意圖，正式提交餐品才開枱；點單頁可取消今次堂食點單，有餐品時二次確認，並同步清除購物車及堂食脈絡。已使用枱取消加單不影響原有餐品。撳枱卡亦可開簡潔詳情；掃碼新增單以右側半屏待確認，確認後才打印。付款支援全數或按餐品及數量分拆，多次使用不同方式。程式現為本機鏈路，真實掃碼、付款及打印接口未完全接入。

售罄管理頁：今日售罄移到獨立售罄分類並以橙色顯示；暫停供應留原分類最後並以紅色顯示；兩者不灰化。點單頁售罄保留原位置、停售排分類最後，頂欄角標、預覽及產品卡共用同一供應狀態。小圖卡已修正父子格線擠壓，仍待多尺寸及實機確認。

更多頁固定六個入口：收銀與日結、報表與分析、打印與設備、備份與恢復、顯示與操作、系統與更新。報表可查今日、昨日、七日、三十日、三個月、六個月及自訂日期；營業、渠道、付款、商品、異常五頁共用範圍。打印核心使用 `morefun.print.v1`；排隊不等於實體打印成功。

同一同步訂單集合及活躍堂食共用每日顯示流水，早上五時按營業日由 `P001` 重新開始，最多 `P999`；堂食首次正式落單即鎖號，跨日付款不改號；顯示流水不可作資料庫唯一鍵。跨兩部完全獨立實體終端的唯一派號仍須正式後台原子遞增 API，未接通前不可宣稱跨機 Lock。

## 2026-07-27｜CURRENT A／B／C 接手 checkpoint

### A 線｜永久五尺寸 Browser QA
- 正式 Browser QA Authority：`.github/workflows/qa-runtime-phase3.yml`；禁止再用 Pairing cleanup workflow 當永久 Browser QA。
- 正式驗收尺寸：1920×1080、1600×900、1440×900、1366×768、1280×800；同一 Adaptive App，不是五套 UI。
- 舊 bounded Pairing QA 已證明 Authority／AI Context／Node／Server 前置 PASS，但 Browser regression step FAIL；舊流程曾因單 spec hang 無限卡住。
- 已備份正式 QA workflow：`backup/qa-runtime-before-browser-summary-20260727`。
- commit `b4d01454d53188d492082bd7c0e48c86d8c1918a` 已將正式 `qa-runtime-phase3.yml` 收口為每 spec 180 秒 timeout、逐 spec PASS／FAIL／TIMEOUT 摘要、Playwright artifact、final `RESULT=PASS` hard gate。
- 最新 `docs/qa/SMT_RUNTIME_PHASE3_QA.md` 暫仍係舊 commit `e2145bc3dd48a46127d1abc33aa035fc1bea24d7`，所以現時禁止聲稱最新五尺寸 PASS；下一步必須等正式 QA report 追上新 HEAD，再只修真實 fail spec，禁止倒退 Current Authority。

### B 線｜Printer Module V1｜PR #17
- Branch：`printer-transport-settings-v1`；PR #17：`Printer Module V1｜Transport + Media + Driver + Failover Settings`；保持 Draft／隔離，不直接污染正式 Runtime UI。
- 已有：Sunmi／LAN transport、每機 IP／Port、Media Profile（卷紙／標籤，尺寸可改）、Primary／Fallback、手動／自動 Failover、reroute history、Settings Model／UI Model／Controller／Renderer。
- 新增 Driver Profile：`escpos`、`tspl`、`epl`、`zpl`、`dpl`、`raw`；字符編碼／切紙策略亦屬設備設定，不再將 LAN TCP 誤當完整打印 driver。
- Xprinter 官方資料確認 XP-T271U 同時支援 label／receipt mode；標籤模式支援 TSPL／EPL／DPL／ZPL emulation，故 Transport、Media、Command Language 必須分層。
- PR #17 最新 head checkpoint：`eb769368940c89d0b1997b70053ba5510a671465`；Printer Gate 已擴充 driver／renderer contract，仍需取得最新 CI 證據後先可整合。
- Android Native 不揀後備機、不重算模板；Web Print Domain 負責 document／template／route／fallback／retry，Native 只執行指定 target/bytes 並回真實結果。

### C 線｜APK Foundation｜PR #19｜最高工程優先
- Branch：`apk-foundation-v1`；PR #19：`APK Foundation V1｜Android 6–11 Shell + Versioned Native Bridge`。
- 策略 D-052：先完成可上機 APK Foundation，再逐步受控更新 Web／UI／業務模組；新增 Native permission／driver／破壞性 Bridge Contract 仍要重發 APK。
- 單一 APK 兼容基準：T2 Android 6.0.1 / API 23（災難後備）、T2S Android 9 / API 28、新 POS Android 11 / API 30。
- `minSdk=23`、compile/target=36、AndroidX WebKit 1.15.0；新 WebView 用 origin-restricted WebMessage，舊 WebView 只在 feature 不支援時啟用 `LegacyBridgeAdapter`，兩者共用同一 `BridgeProtocol`。
- LAN TCP Native Bridge 已有：真 Socket、完成後先回 `printed`、失敗回 error、idempotency ledger；queued 不得當 printed。
- Android 6 兼容改動前備份：`backup/apk-foundation-pre-android6-20260727`。
- workflow run `30259155203` 已 PASS：Android 6 Authority Gate、Gradle Build、APK existence、artifact upload 全 PASS；head `eff699126a76c64c1cd1b8cc1d2f48c3d9917c80`。
- APK artifact：`morefun-smt-foundation-debug-apk`，artifact id `8650202686`，SHA-256 digest `2be01992bfc22c623f91fe599f1ed0e19562e985c102fb8416ae25ae4dc84ae4`。
- 本地 diagnostic page 已加入 LAN IP／Port TCP 測試及同一 idempotencyKey 重送測試；此 Gate 只證明 Transport，不等於中文、切紙、標籤模板正式完成。
- 下一個 C 線實機 Gate：T2 API23 安裝／啟動 → Bridge diagnostic → LAN TCP → duplicate suppression → 再做 ESC/POS 中文／切紙 Driver Gate、標籤 Driver／Renderer Gate → T2S API28、新 POS API30 回歸。

## 強制接手規則
任何 checkpoint 都要假設下一句可能由另一個 AI 接手。最少保留：目標、Repo／Branch／PR、最新 head、完成／未完成、CI／QA 真實層級、已知根因、禁止倒退事項、備份／rollback、下一步唯一優先、待實機 Gate。禁止只寫「已處理／繼續」。

若要改程式，必須 fresh-read 正式 repository 及 `AGENTS.md` 必讀鏈；每輪結束同步 checkpoint。