# 磨飯 SMT AI 工作入口

> **強制規則：任何 AI、Codex、Work 模式、程式代理、開發者或新對話，在分析、設計或修改 SMT 前，必須先完整閱讀三份 PRIMARY STANDARD、Component Ownership Registry、多專業工程與外部參考標準，以及 Engineering Success & Pitfalls。未完成閱讀，禁止修改程式。**

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

- **一個元件可以由多層架構共同組成，但同一項決策只可以有一個唯一 Authority；**
- Page／Composition 只決定元件放邊、佔幾多外部空間；不得重新定義 Component 內部 Visual；
- Component Visual Authority 只決定自己內部 DOM 幾何、樣式及互動視覺；
- State／Domain Truth Source 只可以有一個；UI、Checkout、Print 不得自行再算第二套；
- Adaptive 只可以提供 Token／Available Area／Density／Grid／Typography，不得成為第二 Component Authority；
- Shell 只管理 Global Chrome／Route／Transaction Layer；Page 不得重建第二套 Global Status Bar／Global Bottom Navigation；
- 如發現兩個 Layer 同時對同一屬性、同一狀態、同一行為擁有最終決定權：**STOP，先收口 Authority，再修改功能**；
- 第一次 Fix 無效，第一檢查項必須係 Ownership／Authority Conflict，不得直接疊第二層 Fix。

## 強制多專業工程與外部參考標準

`docs/SMT_EXTERNAL_ENGINEERING_REFERENCE_STANDARD_V1.0.md`

任何重要架構、效能、Adaptive、離線、POS、打印、同步、平台生命週期決策，必須以多專業角度交叉審視，並在有需要時主動核對最新官方資料及成熟產品模式。

至少考慮：

- 產品經理；
- 前端架構；
- 後端架構；
- App 工程；
- Apple 平台設計／開發；
- Android 開發；
- POS 工程；
- QA／可靠性工程。

外部資料只用於驗證、挑戰假設及找更穩陣做法，不得取代 More Fun 已鎖定 Business Rule、實機證據及資料完整性要求。

如果產品要求同更安全、更可維護、更符合成熟 App／POS 工程原則嘅方法衝突，工程代理有責任直接指出風險、提出替代方案並說明原因；不得只為迎合要求而製造長期技術債。

## 強制 Engineering Success & Pitfalls

`docs/qa/SMT_ENGINEERING_SUCCESS_AND_PITFALLS_V1.0.md`

任何 Bug、Regression、Responsive、Authority、Cache、QA／CI 修改前必須先讀。已記錄成功做法不得重新發明第二套；已記錄踩坑不得在沒有新證據下重試。

## 強制 Change Impact 雙鏡像

`SMT_CHANGE_IMPACT.md`

- **任何 Bug／修改工作必讀；修改前未讀，禁止改程式。**
- GitHub 正式分支必須存在 `SMT_CHANGE_IMPACT.md`，作工程 Change Impact 正式來源。
- Jade Note 必須存在同名 `SMT_CHANGE_IMPACT` 鏡像，作新對話／接手 AI 快速導航；Jade 不取代 GitHub。
- 任何可驗證修改完成後，GitHub Change Impact、Jade 鏡像、Engineering Success & Pitfalls 必須同步更新。
- 任一邊缺失、明顯過期或與正式 Runtime 衝突：**STOP，先同步文件，再繼續 Bug／修改工作。**

---

## 強制閱讀順序

所有 AI、Work 模式及程式代理在分析或修改前依次閱讀：

1. `docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`
2. `docs/MFKG_STANDARD_V1.0.md`
3. `docs/SMT_ADAPTIVE_APPLICATION_STANDARD_V1.0.md`
4. `docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md`
5. `docs/SMT_EXTERNAL_ENGINEERING_REFERENCE_STANDARD_V1.0.md`
6. `docs/qa/SMT_ENGINEERING_SUCCESS_AND_PITFALLS_V1.0.md`
7. `SMT_AI_START_HERE.md`
8. `SMT_CONTEXT_MIN.md`
9. 與任務相關的 `docs/ai-context/SMT_CODE_MAP.md` 章節
10. `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md` 的相關章節
11. Bug／修改工作必讀 `SMT_CHANGE_IMPACT.md`，並確認 Jade Note 同名鏡像存在且同步
12. 機器知識圖：`docs/ai-context/SMT_KNOWLEDGE_GRAPH.json`
13. 最新 `docs/qa/SMT_RUNTIME_PHASE3_QA.md`，確認目前自動測試／Browser QA 真實狀態

---

## 開工前固定確認

任何修改前，回覆必須至少確認：

- 已閱讀 Development Charter；
- 已閱讀 MFKG Standard；
- 已閱讀 Adaptive Application Standard；
- 已閱讀 Component Ownership Registry；
- 已閱讀多專業工程與外部參考標準；
- 已閱讀 Engineering Success & Pitfalls；
- 已閱讀 GitHub `SMT_CHANGE_IMPACT.md`，並確認 Jade Note 同名鏡像存在及同步；
- 已閱讀最新 QA report，並分清程式存在／自動測試／Browser QA／實機驗收；
- 本次需求所屬 Domain；
- Registry 指定嘅 Layout／Visual／State／Domain Authority；
- 將新增／修改邊個 MFKG Node／Edge；
- 將修改的正式責任來源；
- 是否會新增第二套邏輯、Observer、Override、Compatibility Layer 或 Patch；
- 是否誤用整頁 Scale／第二套 Responsive UI；
- 是否會碰觸已封板位置；若會，必須證明係本次問題根因；
- Checkout／Responsive／資料／打印／跨端依賴的影響；
- 是否需要查閱最新 Apple／Android／Web／POS 官方或成熟產品資料；
- 測試及回滾方法。

如方案與三份 PRIMARY STANDARD、Ownership Registry 或多專業工程標準衝突：**STOP，不得自行繞過。** 只有產品負責人明確要求「修改／更新標準」先可以改變最高標準。

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
5. `docs/SMT_EXTERNAL_ENGINEERING_REFERENCE_STANDARD_V1.0.md`。
6. `docs/qa/SMT_ENGINEERING_SUCCESS_AND_PITFALLS_V1.0.md`（已證明有效／失敗的工程經驗，不得無證據重踩）。
7. `SMT_CHANGE_IMPACT.md`（Bug／修改前必讀；GitHub 正式來源＋Jade 同名鏡像必須同步）。
8. 產品負責人在目前對話的最新明確確認（不得默認推翻最高標準）。
9. `docs/ai-context/SMT_DECISION_LEDGER.md` 中 `LOCKED`／`CURRENT` 決策。
10. `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md`。
11. `docs/ai-context/SMT_IMPLEMENTATION_STATUS.md` 的程式及驗證證據。
12. 最新 `docs/qa/SMT_RUNTIME_PHASE3_QA.md` 的機器驗證證據。
13. 最新官方 Apple／Android／Web／POS 工程資料，用作技術驗證及風險挑戰，不得推翻 More Fun Business Rule。
14. 舊基線、舊效果圖、舊 log；只作背景，不得推翻上列資料。

安全、資料完整、離線可操作及繁體中文不得低於舊基線。

---

## 工作規則

- 不得把設計確認、程式存在、自動測試、Browser QA、實機通過及最終 Lock 混為一談。
- 矛盾舊資料標記 `SUPERSEDED`，不要重新詢問已鎖定決策。
- 修改前查 `SMT_CHANGE_IMPACT.md`，並確認 Jade Note 同名鏡像存在且同步；修改後更新 GitHub Change Impact、Jade 鏡像、狀態、決策、程式地圖、MFKG、Engineering Success & Pitfalls 及 Chat 接力包。
- 所有主卡同時只可開一張；頂欄、底欄及結帳區不得被內容推動或遮蓋。
- 不可聲稱已完成未做的 API、硬件、Browser 或實機驗收。
- 第一次 Fix 失敗必須 STOP 查根因及 Ownership／Authority Conflict，禁止直接疊第二層 Fix。
- 禁止以 MutationObserver／DOM 掃描補自己已有 State；禁止永久 Patch／Override／Hotfix 層。
- 禁止所有 State Change 重畫整個 App；優先局部 Surface Update。
- 已封板 Component 預設不可修改；新需求只可改 Registry 指定真正責任來源。
- Debug「改咗但冇變」固定按 `DOM → Authority → selector chain → Adaptive Token → JS runtime write → asset cache → child build → Shell build → root loader → QA evidence` 排查；禁止先加 override。
- 對重要架構、效能、Adaptive、離線、POS、打印、同步問題，應主動查閱最新官方資料；不得用過時記憶取代驗證。
- 當產品要求與更安全、更可維護的工程方案衝突時，先指出風險並採用能長期維護 SMT 的方案；除非產品負責人明確要求改標準。
- token 接近結束時，按 `SMT_CHAT_HANDOFF_PROTOCOL.md` 產生 checkpoint，不得以 token 不足停止開發。

## 驗證

```bash
node scripts/validate-ai-context.mjs
node scripts/audit-component-ownership.mjs
node --test tests/*.test.mjs
npm run qa:browser
```

只有 `docs/qa/SMT_RUNTIME_PHASE3_QA.md` 同時顯示 Authority、Node、Syntax、Browser 全部成功，先可以寫自動 QA 全綠；實機驗收仍然必須另外記錄。
