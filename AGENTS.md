# More Fun SMT｜AI／工程工作入口

> 強制規則：任何 AI、Codex、Work、程式代理或開發者，在分析、設計或修改 SMT 前，必須完成以下 Fresh Read。未完成不得改程式。

## 必讀順序

1. `README.md`
2. `CURRENT_DOMAIN_AUTHORITY.md`
3. `ENGINEERING_LOG.md`
4. 與本次任務直接相關的 Active PR／Branch Diff／可執行測試／原始 Evidence
5. `Pantonyeung/morefunos` Knowledge Base V2

其他文件只按任務需要讀取，包括：

- `docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`
- `docs/MFKG_STANDARD_V1.0.md`
- `docs/SMT_ADAPTIVE_APPLICATION_STANDARD_V1.0.md`
- `docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md`
- `SMT_CHANGE_IMPACT.md`
- `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md`
- `docs/qa/`
- `docs/ai-context/`

以上文件不得與 `CURRENT_DOMAIN_AUTHORITY.md` 並列成第二套 Current Authority。

## 開工前固定確認

- 本次需求所屬 Domain；
- 正式責任來源及 Component／State owner；
- 是否影響 Register、Mobile、Android Host、Customer、Admin、Order API、Firebase、Print 或 Offline Queue；
- 是否新增第二套 Business Logic、State、Observer、Override、Compatibility Layer 或 Patch；
- 是否誤用整頁 Scale 或第二套 Responsive UI；
- Evidence Level、測試方法及回滾點。

如方案與 `CURRENT_DOMAIN_AUTHORITY.md` 衝突：STOP，不得自行繞過。

## 永久工程規則

- Register 與 Mobile 係同一 Shared Core 的兩個 Profile；
- 不得重建獨立 SMM Core；
- 一個決策只准一個 Authority；
- State → Domain → Render，禁止 DOM 反推正式 State；
- Adaptive ≠ whole-page scale；
- Mobile 可建立 Print Job／Command，但不得直接控制實體打印機；
- 網絡／5xx 失敗須保留 local state 與 pending queue；
- 401／403、撤銷 Session 或帳戶停用必須按 Authority 清理身份狀態；
- 不得把 Source、Contract、Browser、Device、Hardware、Store 或 Product Lock 混為一談；
- 舊 `LOCK／FINAL／MASTER／CURRENT／READY` 文件只係歷史，除非 Authority 明確 re-adopt。

## 文件更新規則

所有進度、根因、踩坑、成功方法、測試結果、部署、設備驗收、失敗、回滾及下一步，只追加到 `ENGINEERING_LOG.md`。

不得再建立新的 milestone、handoff、progress、pitfall、success、latest、final 或 verification-summary Authority 文件。原始測試及不可變輸出可保留為 Evidence。

## 基本驗證

```bash
node scripts/validate-ai-context.mjs
node --test tests/*.test.mjs
```

只執行與本次變更匹配的最低成本 targeted verification；完整 CI／Browser／Android／Hardware Gate 留待整合與正式驗收。
