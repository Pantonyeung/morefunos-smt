# More Fun Knowledge Graph（MFKG）Standard V1.0

狀態：**CURRENT / PRIMARY STANDARD**  
生效日期：2026-07-26  
適用範圍：More Fun／磨飯 SMT 及與 SMT 有直接依賴的 SMM、Admin、Customer、API、Print、Sync、資料模型、裝置與後續 AI／工程代理工作。

---

## 0. 定位

MFKG = **More Fun Knowledge Graph**。

MFKG 不是普通文件索引，而係 More Fun 系統的「可追溯知識真相層」。任何 AI／Codex／Work／工程代理都不得只靠目前畫面、聊天記憶、單一舊文件或局部程式碼自行推斷整個系統。

MFKG 必須用來連接：

- Business Rule
- Domain
- Feature
- Component
- Data Model
- API
- Runtime
- Device
- Print
- Sync
- Decision
- Design Lock
- Implementation Status
- Test
- Version／Branch／Baseline
- External Dependency

現行 SMT 機器圖：`docs/ai-context/SMT_KNOWLEDGE_GRAPH.json`。

---

## 1. 最高原則

每個重要決策／功能都要可以回答：

1. 它係乜？
2. 屬於邊個 Domain？
3. 邊份文件鎖定？
4. 邊段程式實作？
5. 邊個測試驗證？
6. 依賴咩？
7. 影響咩？
8. 目前係設計確認、程式存在、自動測試通過、實機通過，定最終 Lock？

禁止建立第二套平行知識真相。

---

## 2. 真相來源

MFKG 只可以引用可追溯來源：

- CURRENT／LOCKED 規格；
- 正式 Domain／Component 程式；
- 自動測試；
- Implementation Status；
- Decision Ledger；
- 實機驗收證據；
- 外部依賴合約。

舊 Log／舊效果圖／舊分支可以作歷史背景，但不得直接推翻 Current／Locked Node。

---

## 3. 新功能開工前 MFKG 檢查

任何修改前必須回答：

- 會新增／修改邊個 Node？
- 已經有冇相同責任 Node？
- 會新增咩 Edge／依賴？
- 會影響邊個 Page／Domain／API／Print／Sync／Device？
- 有冇同現有 LOCKED Decision 衝突？
- 應該更新邊份 Knowledge Graph／Decision／Status 文件？

未完成以上分析，禁止開始修改 Core。

---

## 4. 修改後同步規則

重要功能完成後，必須同步更新與該變更相關的：

- `docs/ai-context/SMT_KNOWLEDGE_GRAPH.json`
- `docs/ai-context/SMT_DECISION_LEDGER.md`
- `docs/ai-context/SMT_IMPLEMENTATION_STATUS.md`
- `docs/ai-context/SMT_CODE_MAP.md`
- Current Lock／Handoff（如適用）

禁止程式已變但知識圖仍停留舊狀態。

---

## 5. Evidence 狀態

至少區分：

- `EXTRACTED`：由正式文件／程式／測試直接取得；
- `INFERRED`：合理推論，但未有正式證據；
- `LOCKED`：產品負責人已確認；
- `SUPERSEDED`：已被新決策取代；
- `REQUIRES_ACCEPTANCE`：程式存在但仍需實機驗收。

AI 不得將 `INFERRED` 寫成 `LOCKED`，亦不得將 `程式存在` 寫成 `實機已通過`。

---

## 6. 跨端關係

SMT 不是孤立 App。涉及以下資料時必須查看跨端影響：

- Customer：客人點單／會員／訂單來源；
- SMM：手機營運／SMT 輔助；
- Admin：餐牌、帳號、設定、售罄、打印、營運規則；
- API／Firebase／Worker／Sheet：正式資料流；
- Print：製作單、打包單、小票、Label；
- Device：Sunmi／Android／Browser／打印機。

禁止 SMT 自行複製一套已由其他端負責的真相資料。

---

## 7. MFKG 與開發憲章關係

- **MFKG**：回答「系統知道甚麼、真相喺邊、彼此點連」。
- **Development Charter**：回答「工程應該點改」。
- **Adaptive Application Standard**：回答「同一套 App 點適應不同裝置／尺寸」。

三者共同構成 SMT Development Standard，任何一份都唔係可選參考。
