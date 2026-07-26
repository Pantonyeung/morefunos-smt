# 磨飯 SMT AI 工作入口

> **強制規則：任何 AI、Codex、Work 模式、程式代理、開發者或新對話，在分析、設計或修改 SMT 前，必須先完整閱讀三份 PRIMARY STANDARD 以及 Component Ownership Registry。未完成閱讀，禁止修改程式。**

## 三份同級最高開發標準

1. `docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`  
   → 產品／工程開發紀律、單一責任、效能、Modal、Checkout、測試、禁止補丁。

2. `docs/MFKG_STANDARD_V1.0.md`  
   → More Fun Knowledge Graph（MFKG）標準；系統真相、Domain、Feature、Decision、依賴、跨端關係及驗證證據。

3. `docs/SMT_ADAPTIVE_APPLICATION_STANDARD_V1.0.md`  
   → 自適應應用標準；同一 Application 如何適應多尺寸／多裝置，禁止把 Adaptive 當成整頁縮放或第二套 UI。

**三者共同構成 SMT Development Standard；全部屬強制規範，不是參考文件。**

## 強制 Component Ownership Registry

`docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md`

任何 UI Component、Global Surface、Domain、State、Adaptive Token 修改前必須先查 Registry。

硬規則：

- 一個 Component 只可以有一個真正 Owner；
- 一個 Business Rule 只可以有一個 Domain truth source；
- Adaptive 只可以提供 Token／Available Area／Density／Grid／Typography，不得成為第二 Component Owner；
- 如發現第二 Owner、Override、Observer、Compatibility Layer 或舊 Runtime 同時控制：**STOP，先收口 Ownership，再修改功能**；
- 第一次 Fix 無效，第一檢查項必須係 Ownership Conflict，不得直接疊第二層 Fix。

---

## 強制閱讀順序

所有 AI、Work 模式及程式代理在分析或修改前依次閱讀：

1. `docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`
2. `docs/MFKG_STANDARD_V1.0.md`
3. `docs/SMT_ADAPTIVE_APPLICATION_STANDARD_V1.0.md`
4. `docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md`
5. `SMT_AI_START_HERE.md`
6. `SMT_CONTEXT_MIN.md`
7. 與任務相關的 `docs/ai-context/SMT_CODE_MAP.md` 章節
8. `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md` 的相關章節
9. Bug／修改工作必讀 `SMT_CHANGE_IMPACT.md`
10. 機器知識圖：`docs/ai-context/SMT_KNOWLEDGE_GRAPH.json`

---

## 開工前固定確認

任何修改前，回覆必須至少確認：

- 已閱讀 Development Charter；
- 已閱讀 MFKG Standard；
- 已閱讀 Adaptive Application Standard；
- 已閱讀 Component Ownership Registry；
- 本次需求所屬 Domain；
- Registry 指定唯一 Owner；
- 將新增／修改邊個 MFKG Node／Edge；
- 將修改的正式責任來源；
- 是否會新增第二套邏輯、Observer、Override、Compatibility Layer 或 Patch；
- 是否誤用整頁 Scale／第二套 Responsive UI；
- 是否會碰觸已封板位置；若會，必須證明係本次問題根因；
- Checkout／Responsive／資料／打印／跨端依賴的影響；
- 測試及回滾方法。

如方案與三份 PRIMARY STANDARD 或 Ownership Registry 衝突：**STOP，不得自行繞過。** 只有產品負責人明確要求「修改／更新標準」先可以改變最高標準。

---

## 1920 視覺封板工作流｜CURRENT HARD RULE

現階段所有 UI／互動優化先以 **1920×1080 作唯一視覺封板模板**。

固定順序：

`1920×1080 Template 正確 → 實機驗收 → 封板 → Adaptive Core 套用其他尺寸 → 其他尺寸只做 Regression／必要 Token 調整`

規則：

- 1920 未正確前，不得同時為 1600／1440／1366／1280 個別調畫面；
- 其他尺寸不得反向迫使已封板的 1920 Component 改位置、改 DOM、改操作順序；
- 已封板區域預設 **READ-ONLY**；除非新問題根因直接位於該區域，否則禁止順手重構、改比例、改位置、改動畫；
- Adaptive 只可以調整可用空間、Token、Density、Grid、Gap、Typography、Modal Bounds，不得重新設計已封板 Component；
- 如其他尺寸出現問題，先修 Adaptive Core／Profile；不得先改 1920 已封板模板去遷就單一尺寸。

---

## MFKG 強制規則

任何 AI 不得只靠聊天記憶、單一畫面或局部程式自行理解 SMT。

重要功能必須可追溯：

`Business Rule → Domain → Feature → Component／Code → Test → Implementation Status → Device／API／Print／Sync Dependency`

修改前必須查：

- 已有冇相同責任 Node；
- 影響哪些 Node／Edge；
- 有冇與 LOCKED／CURRENT Decision 衝突；
- 修改後需唔需要同步 Knowledge Graph、Decision Ledger、Implementation Status、Code Map。

禁止建立第二套平行知識真相。

---

## 自適應應用強制規則

Adaptive ≠ Scale。

正式 Runtime 禁止：

`1920×1080 → 整頁縮放 → 1280×800`

正式模型：

`Same Domain → Same Feature → Same Component → Adaptive Core → Device／Viewport Profile → Available Content Area → Layout／Density／Grid／Typography adaptation`

Adaptive Core 可以控制尺寸、Spacing、Density、Grid、Typography、Available Area、Device Profile；**不得重新定義 Business Logic、Cart、Checkout、Pricing、Print、Component Core 或資料模型。**

現階段視覺封板只驗 1920×1080；其他正式尺寸由 Adaptive Core 套用後再做回歸，不作獨立設計模板。

手機尺寸驗收工具可以縮放模擬畫布，但只屬 QA 工具，不代表正式 Runtime 使用 Scale。

---

## 真相優先次序

1. 安全、資料完整、付款／訂單不可逆風險。
2. 產品負責人明確要求修改／更新最高標準的新決策。
3. SMT Development Charter + MFKG Standard + Adaptive Application Standard。
4. `docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md`。
5. 產品負責人在目前對話的最新明確確認（不得默認推翻最高標準）。
6. `docs/ai-context/SMT_DECISION_LEDGER.md` 中 `LOCKED`／`CURRENT` 決策。
7. `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md`。
8. `docs/ai-context/SMT_IMPLEMENTATION_STATUS.md` 的程式及驗證證據。
9. 舊基線、舊效果圖、舊 log；只作背景，不得推翻上列資料。

安全、資料完整、離線可操作及繁體中文不得低於舊基線。

---

## 工作規則

- 不得把設計確認、程式存在、自動測試、實機通過及最終 Lock 混為一談。
- 矛盾舊資料標記 `SUPERSEDED`，不要重新詢問已鎖定決策。
- 修改前查 `SMT_CHANGE_IMPACT.md`；修改後更新狀態、決策、程式地圖、MFKG 及 Chat 接力包。
- 所有主卡同時只可開一張；頂欄、底欄及結帳區不得被內容推動或遮蓋。
- 不可聲稱已完成未做的 API、硬件或實機驗收。
- 第一次 Fix 失敗必須 STOP 查根因及 Ownership Conflict，禁止直接疊第二層 Fix。
- 禁止以 MutationObserver／DOM 掃描補自己已有 State；禁止永久 Patch／Override／Hotfix 層。
- 禁止所有 State Change 重畫整個 App；優先局部 Surface Update。
- 已封板 Component 預設不可修改；新需求只可改 Registry 指定真正責任來源。
- token 接近結束時，按 `SMT_CHAT_HANDOFF_PROTOCOL.md` 產生 checkpoint，不得以 token 不足停止開發。

## 驗證

```bash
node scripts/validate-ai-context.mjs
node --test tests/*.test.mjs
```
