# SMT Runtime＋長時間離線生存｜最終軟件 Gate Checkpoint

更新：2026-07-29 19:37 HKT

## Authority

- Repo：`Pantonyeung/morefunos-smt`
- Branch：`smt-adaptive-runtime-integration-v1`
- Base：`smt-functional-completeness-v1`
- PR：`#30`
- PR 狀態：`OPEN / READY FOR REVIEW / MERGEABLE`
- 最新 Head：`cab4bdddda49c85b2431d155a2d5a4f0828c3a28`

## 最終自動化證據

- Runtime Offline Browser Gate Run #16
- Targeted Offline Gate：`3 / 3 PASS`
- Full Browser Matrix：`81 / 81 PASS`
- Failure：`0`
- Flaky：`0`
- 五尺寸 Stress Matrix：1920×1080、1600×900、1440×900、1366×768、1280×800 全部 PASS

## 完成邊界

除 Firebase Adapter 及 Android／打印實機驗收外，本輪 Runtime、長時間離線生存、Journal、Service Worker、Browser Targeted Gate、完整 Browser Matrix已完成軟件收口。

## 本輪改動

- 建立真正會執行的 Runtime Offline Browser Gate。
- 將 offline survival spec 加入正式 Playwright config。
- 離線 reload 前確認 Service Worker controller 接管。
- Stress Matrix 每輪重新取得可見產品卡，避免 stale／hidden locator。
- 以 `failOnFlakyTests: Boolean(process.env.CI)` 將 flaky 變成 CI hard failure。
- PR body 更新為完整完成證據與未完成邊界。
- PR #30 由 Draft 轉為 Ready for review。

## 踩坑

1. Service Worker ready 不代表當前頁已由 controller 接管。
2. Job success 可能仍有 flaky；上一輪 79 PASS／2 flaky 不可接受。
3. 固定 `nth()` locator 經 modal churn 後可能指向不可見 DOM。
4. Playwright 1.61.1 不支援 CLI `--fail-on-flaky`；必須由 config 設定。
5. 同 repo PR 更新時設定 `maintainer_can_modify` 會 GitHub 422；該欄位只適用 cross-repo fork，移除後成功。
6. 本地無法拉取 GitHub 時，不得冒充 Browser PASS。

## 成功方法

`exact fail → exact log → root cause → minimal fix → targeted rerun → affected regression → full integration gate → three-way record`

## 三方記錄

- GitHub：本文件＋`docs/SMT_OFFLINE_ENDURANCE_IMPLEMENTATION_V1.0.md`
- Google Drive：`More Fun SMT｜Runtime＋長時間離線生存｜PR #30 三方接手記錄 V1.0`
- Jade Note：同名 pinned Note，ID `764195dc-5c4b-4f1d-a4a5-056e29a5fb03`
- PR 流水：PR #30 comments

## 仍未完成／禁止誤報

- Firebase Auth／Rules／正式 Runtime Adapter／遠端 acknowledgement
- Android 收銀機首次完整下載、拔網線／飛行模式冷啟動、多日離線、斷電、真實打印、儲存壓力、恢復補傳實機驗收
- 未完成以上項目前，不得標 `Production Release Ready`

## 下一步

進行 PR #30 合併前審核。Firebase／實機維持獨立後續 Gate，不得混寫為本 PR 已完成內容。