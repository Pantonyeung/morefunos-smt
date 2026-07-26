# 磨飯 SMT｜AI Start Here

> **第一步必讀：`docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`。任何 AI／Codex／Work／工程代理未完整閱讀前，禁止分析後直接改碼。**

更新：2026-07-26｜目前功能完整性分支：`smt-functional-completeness-v1`

## 最高標準

`docs/SMT_DEVELOPMENT_CHARTER_V1.0.md` 係 SMT 目前最高產品／工程開發標準。

任何新需求必須先對照憲章：

1. 屬於邊個 Domain？
2. 真正根因係乜？
3. 會修改邊個正式責任來源？
4. 有冇新增第二套邏輯、Observer、Override、Compatibility Layer 或 Patch？
5. 會唔會影響 Checkout／Responsive／資料／打印？
6. 點測試、點回滾？

如果需求與憲章衝突，必須 STOP；只有產品負責人明確要求「修改／更新憲章」先可以改變最高標準。

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

- 最高規範：`docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`
- UI：Current Lock + `docs/ai-context/SMT_CODE_MAP.md`
- Bug：`SMT_CHANGE_IMPACT.md` + 對應測試
- 現況：`docs/ai-context/SMT_IMPLEMENTATION_STATUS.md`
- 決策：`docs/ai-context/SMT_DECISION_LEDGER.md`
- Chat：`SMT_AI_CONTEXT_PACK.md`
- 機器查詢：`SMT_KNOWLEDGE_GRAPH.json`

## 開工格式

任何新 AI／新對話接手第一輪，先回覆：

```text
【憲章】
已閱讀 SMT Development Charter V1.0：是／否

【本次 Domain】

【正式責任來源】

【禁止層檢查】
第二套邏輯：無／有
Observer：無／有
Override／Patch：無／有

【影響】
Checkout：
Responsive：
資料：
打印：

【測試／回滾】
```

未完成以上確認，不應開始修改。
