# More Fun SMT｜A 線完成長期記錄 V1.0

## 文件身份

- 狀態：`CURRENT / LONG-TERM HANDOFF / A-LINE COMPLETE`
- 正式 GitHub 文件：`docs/SMT_A_LINE_COMPLETION_RECORD_V1.0.md`
- 正式工程基準：`smt-functional-completeness-v1`
- 日期：2026-07-29
- 用途：之後任何 AI／工程師判斷 A 線是否完成、A 線權威係邊、可否覆蓋 A 線 UI／Adaptive 時，必須先讀本文件。

> GitHub 係正式工程 Authority。Google Drive 同 Jade Note 只作長期鏡像／接手導航，不得反向覆蓋 GitHub。

## A 線正式範圍

A 線只負責 SMT UI／Adaptive／五尺寸 Browser QA 根因收口，包括：

- Android Window Size Class／Adaptive Contract。
- 1920×1080、1600×900、1440×900、1366×768、1280×800 五尺寸。
- Shell action proxy／child source bridge。
- Secondary-page iframe readiness race。
- Preview sequential viewport timeout。
- Compact large-card 圖片比例。
- Soldout／Order 共用 Adaptive product metrics。
- Legacy CSS／第二 Authority 清理。
- Stress Matrix／Full Browser Matrix。

A 線不包括 Firebase、正式訂單 API、付款、實體打印、APK Production signing、Android 實機或硬件驗收。

## 完成證據

- PR：`#22 SMT Adaptive QA V1｜Android Window Contract＋五尺寸根因修正`
- PR 狀態：`MERGED / CLOSED`
- 合併時間：2026-07-28 20:59（香港時間）
- A 線完成合併基準：`bbecd4ce66802a9a78262abe9573615fa57bb360`
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

## A 線完成判斷

A 線已完成，並成為 SMT UI／Adaptive／1280×800 架構與五尺寸行為的正式權威基準。

後續 B／C／D／E 或其他線只可以：

1. 從 A 線正式基準整合功能。
2. 保留 A 線 UI、Adaptive、Component Authority 及五尺寸行為。
3. 功能接入後重新跑受影響 Contract／Browser／實機 Gate。

禁止：

- 用舊分支、舊畫面或近似版本取代 A 線。
- 1920 整頁縮放成 1280。
- page-by-page 單尺寸永久 patch。
- 大量 `!important`、fixed height、z-index 壓住 layout。
- 同一 Component 存在第二個 Authority。
- 有 fail／flaky 仍合併。
- 長期落後分支直接硬 merge。

## 成功方法與長期教訓

- 每次只處理一個失敗 spec／一個根因／一個最小修正。
- 單項 PASS 後先做最小回歸；全部 isolated PASS 後先跑一次 Full Integration Gate。
- Adaptive 係 reflow／density／tokens／layout profile，唔係整頁 scale。
- 原 A 分支累積約 161 commits 且長期 behind／conflict，最終用最新 base Clean Rebuild，只搬已驗證有效內容。
- Stress flaky 根因係測試內大量重複 `locator.count()` 與 async overhead，唔係正式 Runtime 壞。
- GitHub marker 必須同測試 head SHA 對齊，禁止用舊 run 當新證據。

## 過期文件處理

`WORK03 Staff Login／Session／Bootstrap` 舊文件屬過期產物，唔係 A 線 Authority，禁止再用佢判斷 SMT A 線進度、完成度或 UI 基準。

## 長期鏡像名稱

以下三處必須指向同一份 A 線完成真相：

- GitHub：`docs/SMT_A_LINE_COMPLETION_RECORD_V1.0.md`
- Google Drive：`More Fun SMT｜A 線完成長期記錄 V1.0`
- Jade Note：`More Fun SMT｜A 線完成長期記錄 V1.0`

如三者內容衝突：GitHub 最新正式分支為準，立即同步 Drive／Jade，禁止建立第二套真相。
