# 磨飯 SMT AI 工作入口

所有 AI、Work 模式及程式代理在分析或修改前依次閱讀：

1. `SMT_AI_START_HERE.md`
2. `SMT_CONTEXT_MIN.md`
3. 與任務相關的 `docs/ai-context/SMT_CODE_MAP.md` 章節
4. `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md` 的相關章節

## 真相優先次序

1. 產品負責人在目前對話的最新明確確認。
2. `docs/ai-context/SMT_DECISION_LEDGER.md` 中 `LOCKED`／`CURRENT` 的決策。
3. `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md`。
4. `docs/ai-context/SMT_IMPLEMENTATION_STATUS.md` 的程式及驗證證據。
5. 舊基線、舊效果圖、舊 log；只作背景，不得推翻上列資料。

安全、資料完整、離線可操作及繁體中文不得低於舊基線。

## 工作規則

- 不得把設計確認、程式存在、自動測試、實機通過及最終 Lock 混為一談。
- 矛盾舊資料標記 `SUPERSEDED`，不要重新詢問已鎖定決策。
- 修改前查 `SMT_CHANGE_IMPACT.md`；修改後更新狀態、決策、程式地圖及 Chat 接力包。
- 所有主卡同時只可開一張；頂欄、底欄及結帳區不得被內容推動或遮蓋。
- 不可聲稱已完成未做的 API、硬件或實機驗收。
- token 接近結束時，按 `SMT_CHAT_HANDOFF_PROTOCOL.md` 產生 checkpoint，不得以 token 不足停止開發。

## 驗證

```bash
node scripts/validate-ai-context.mjs
node --test tests/*.test.mjs
```
