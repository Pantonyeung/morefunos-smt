# More Fun SMT｜SMT 自適應系統長期記錄 V1.1

## 正式身份

- 正式名稱：`SMT 自適應系統`
- 舊稱：`A 線`（由本版本起正式停用，只保留歷史識別）
- 系統版本：`V1.0`
- 記錄版本：`V1.1`（正式改名＋補齊 Repo／Branch／時間／版本／改動）
- 狀態：`CURRENT / LONG-TERM HANDOFF / COMPLETE`
- 記錄時間：`2026-07-29 14:30 HKT`
- 正式 GitHub 文件：`docs/SMT_ADAPTIVE_SYSTEM_RECORD_V1.0.md`

## 最終版本定位

- Repository：`Pantonyeung/morefunos-smt`
- 最終整合分支：`smt-functional-completeness-v1`
- SMT 自適應系統 V1.0 不可變完成基準：`bbecd4ce66802a9a78262abe9573615fa57bb360`
- 完成 PR：`#22 SMT Adaptive QA V1｜Android Window Contract＋五尺寸根因修正`
- PR 狀態：`MERGED / CLOSED`
- 合併時間：`2026-07-28 20:59 HKT`

> `smt-functional-completeness-v1` 係後續功能整合分支；即使之後加入其他模組，SMT 自適應系統 V1.0 的完成證據仍以以上不可變 commit 為準。

## SMT 自適應系統正式範圍

本系統負責 SMT UI／Adaptive／五尺寸 Browser QA 根因收口，包括：

- Android Window Size Class／Adaptive Contract。
- 1920×1080、1600×900、1440×900、1366×768、1280×800 五尺寸。
- Shell action proxy／child source bridge。
- Secondary-page iframe readiness race。
- Preview sequential viewport timeout。
- Compact large-card 圖片比例。
- Soldout／Order 共用 Adaptive product metrics。
- Legacy CSS／第二 Authority 清理。
- Stress Matrix／Full Browser Matrix。

本系統不包括 Firebase、正式訂單 API、付款、實體打印、APK Production signing、Android 實機或硬件驗收。

## V1.0 主要改變

1. 由「1920 畫面縮放到 1280」改為 Android Window Size Class／Adaptive Layout。
2. 五個正式 viewport 共用同一 Domain、Component、Layout Authority。
3. 產品卡 geometry、售罄卡 metrics、Shell action、iframe readiness 收口為單一真相來源。
4. 移除 retired CSS／第二 Authority，禁止 page-by-page 永久尺寸補丁。
5. 修正 preview viewport、overlay restore、hero sequence、產品卡比例、售罄寬高及 stress test timeout 根因。
6. 將 QA 改為「單一 fail → 單一 spec → 單一根因 → 最小修正 → 最小回歸 → 最終全量 gate」。
7. 將長期落後及衝突分支以最新 base Clean Rebuild，只搬已驗證有效內容。

## 完成證據

- Full Browser Matrix：`78 / 78 PASS`
- Failure：`0`
- Flaky：`0`
- Stress Matrix：`5 / 5 PASS`
- Stress Matrix 時間：約 `41.7 秒`
- 正式尺寸全部 PASS：
  - 1920×1080
  - 1600×900
  - 1440×900
  - 1366×768
  - 1280×800

## 後續整合規則

後續 B／C／D／E 或其他模組只可以：

1. 從 `smt-functional-completeness-v1` 整合。
2. 保留 SMT 自適應系統 UI、Adaptive、Component Authority 及五尺寸行為。
3. 功能接入後重新跑受影響 Contract／Browser／實機 Gate。

永久禁止：

- 用舊分支、舊畫面或近似版本取代 SMT 自適應系統。
- 1920 整頁縮放成 1280。
- page-by-page 單尺寸永久 patch。
- 大量 `!important`、fixed height、z-index 壓住 layout。
- 同一 Component 存在第二個 Authority。
- 有 fail／flaky 仍合併。
- 長期落後分支直接硬 merge。

## 過期文件

`WORK03 Staff Login／Session／Bootstrap` 舊文件屬過期產物，唔係 SMT 自適應系統 Authority，禁止用佢判斷本系統進度、完成度或 UI 基準。

## 三方鏡像

- GitHub：`docs/SMT_ADAPTIVE_SYSTEM_RECORD_V1.0.md`
- Google Drive：`More Fun SMT｜SMT 自適應系統長期記錄 V1.1`
- Jade Note：`More Fun SMT｜SMT 自適應系統長期記錄 V1.1`

如三者內容衝突，以 GitHub `smt-functional-completeness-v1` 最新正式文件為準，立即同步 Google Drive／Jade Note，禁止建立第二套真相。
