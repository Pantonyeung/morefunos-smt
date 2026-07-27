# 磨飯 SMT｜AI Start Here

> **第一步：完整閱讀 SMT Development Standard 三份 PRIMARY STANDARD。任何 AI／Codex／Work／工程代理未完成閱讀前，禁止分析後直接改碼。**

更新：2026-07-27｜目前功能完整性分支：`smt-functional-completeness-v1`

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
- 每次可驗證成功／踩坑必須追加 `docs/qa/SMT_ENGINEERING_SUCCESS_AND_PITFALLS_V1.0.md`；禁止下一個 AI 重走已證實無效路線。

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
- 成功／踩坑／避錯紀錄：`docs/qa/SMT_ENGINEERING_SUCCESS_AND_PITFALLS_V1.0.md`
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
Success / Pitfall Log 已閱讀：是／否

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
