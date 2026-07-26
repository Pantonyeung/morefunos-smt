# 磨飯 SMT AI 工作入口

> **強制規則：任何 AI、Codex、Work 模式、程式代理、開發者或新對話，在分析、設計或修改 SMT 前，必須先完整閱讀 `docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`。未完成閱讀，禁止修改程式。**

所有 AI、Work 模式及程式代理在分析或修改前依次閱讀：

1. `docs/SMT_DEVELOPMENT_CHARTER_V1.0.md` ← **最高產品／工程開發標準**
2. `SMT_AI_START_HERE.md`
3. `SMT_CONTEXT_MIN.md`
4. 與任務相關的 `docs/ai-context/SMT_CODE_MAP.md` 章節
5. `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md` 的相關章節
6. Bug／修改工作必讀 `SMT_CHANGE_IMPACT.md`

## 開工前固定確認

任何修改前，回覆必須至少確認：

- 已閱讀 SMT Development Charter V1.0；
- 本次需求所屬 Domain；
- 將修改的正式責任來源；
- 是否會新增第二套邏輯、Observer、Override、Compatibility Layer 或 Patch；
- Checkout／Responsive／資料／打印的影響；
- 測試及回滾方法。

如方案與憲章衝突：**STOP，不得自行繞過。** 只有產品負責人明確要求「修改／更新憲章」先可以改變最高標準。

## 真相優先次序

1. 安全、資料完整、付款／訂單不可逆風險。
2. 產品負責人明確要求修改／更新憲章的新決策。
3. `docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`。
4. 產品負責人在目前對話的最新明確確認（不得默認推翻憲章）。
5. `docs/ai-context/SMT_DECISION_LEDGER.md` 中 `LOCKED`／`CURRENT` 的決策。
6. `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md`。
7. `docs/ai-context/SMT_IMPLEMENTATION_STATUS.md` 的程式及驗證證據。
8. 舊基線、舊效果圖、舊 log；只作背景，不得推翻上列資料。

安全、資料完整、離線可操作及繁體中文不得低於舊基線。

## 工作規則

- 不得把設計確認、程式存在、自動測試、實機通過及最終 Lock 混為一談。
- 矛盾舊資料標記 `SUPERSEDED`，不要重新詢問已鎖定決策。
- 修改前查 `SMT_CHANGE_IMPACT.md`；修改後更新狀態、決策、程式地圖及 Chat 接力包。
- 所有主卡同時只可開一張；頂欄、底欄及結帳區不得被內容推動或遮蓋。
- 不可聲稱已完成未做的 API、硬件或實機驗收。
- 第一次 Fix 失敗必須 STOP 查根因，禁止直接疊第二層 Fix。
- 禁止以 MutationObserver／DOM 掃描補自己已有 State；禁止永久 Patch／Override／Hotfix 層。
- token 接近結束時，按 `SMT_CHAT_HANDOFF_PROTOCOL.md` 產生 checkpoint，不得以 token 不足停止開發。

## 驗證

```bash
node scripts/validate-ai-context.mjs
node --test tests/*.test.mjs
```
