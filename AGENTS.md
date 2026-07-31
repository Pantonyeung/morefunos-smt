# More Fun SMT｜AI／工程工作入口

> 強制規則：任何 AI、Codex、Work、程式代理或開發者，在分析、設計或修改 SMT 前，必須完成以下 Fresh Read。未完成不得改程式。

## 必讀順序

1. `Pantonyeung/morefunos/MOREFUNOS_MASTER_KNOWLEDGE_AUTHORITY.md`
2. `Pantonyeung/morefunos/knowledge-base/CURRENT_STATUS.md`
3. `Pantonyeung/morefunos/knowledge-base/AI_EXECUTION_RULES.md`
4. 本 repo `README.md`
5. 本 repo `CURRENT_DOMAIN_AUTHORITY.md`
6. 本 repo `ENGINEERING_LOG.md`
7. Active PR／Branch Diff／observed source／可執行測試／原始 Evidence
8. 需要時才讀 Shared Technology、Specification、QA 或 Archive

## Mandatory discipline

- 全部工作流程、Scope Lock、Authority Resolution、Evidence Level、記錄、Commit、交付及 autonomous execution boundary，以中央 `AI_EXECUTION_RULES.md` 為準。
- Register 與 Mobile 係同一 Shared Core 的兩個 Profile；不得重建獨立 SMM Core。
- 不得建立第二套 Business Logic、State、Runtime、Data Model、Cart、Pricing、Order、Auth、Firebase、Sync、Print 或 Current Authority。
- State → Domain → Render；禁止 DOM 反推正式 State。
- Adaptive ≠ whole-page scale。
- Mobile 可建立 Print Job／Command，但不得直接控制實體打印機。
- 網絡／5xx 失敗須保留 local state 與 pending queue。
- 不得把 Source、Contract、Browser、Device、Hardware、Store 或 Product Lock 混為一談。
- 舊 `LOCK／FINAL／MASTER／CURRENT／READY` 文件只係歷史，除非 Authority 明確 re-adopt。

## 文件更新規則

所有日期進度、根因、踩坑、成功方法、Commit、測試結果、部署、設備驗收、失敗、回滾及下一步，只追加到 `ENGINEERING_LOG.md`。

不得再建立新的 milestone、handoff、progress、pitfall、success、latest、final 或 verification-summary Authority 文件。原始測試及不可變輸出可保留為 Evidence。

## 基本驗證

```bash
node scripts/validate-ai-context.mjs
node --test tests/*.test.mjs
```

只執行與本次變更匹配的最低成本 targeted verification；完整 CI／Browser／Android／Hardware Gate 留待整合與正式驗收。
