# SMT Context OS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一套不依賴單一對話、同時支援 Work 與 Chat 模式的 SMT AI 專案記憶、程式索引及接力制度。

**Architecture:** 根目錄以 `AGENTS.md` 作 Work 模式入口，以 `SMT_AI_CONTEXT_PACK.md` 作 Chat／手機單檔入口。`docs/ai-context/` 保存機器可讀知識圖、程式地圖、決策及狀態；驗證程式確保入口、JSON及版本不會失聯。

**Tech Stack:** Markdown、JSON、Node.js 內建 test runner、Git。

## Global Constraints

- 最新產品負責人確認高於舊基線，但安全及資料完整不得低於基線。
- `order-v1-9` 是建立 Context OS 時的程式基準。
- 自動測試通過不可寫成 iPad、Sunmi T2S 或產品負責人已驗收。
- Chat 模式必須只靠一個 Context Pack 加最新程式包即可接力。
- 不得因 token、對話結束或七日 Work 模式間隔中止開發。

---

### Task 1: 雙模式入口及精簡接力包

**Files:** Create `AGENTS.md`, `SMT_AI_START_HERE.md`, `SMT_CONTEXT_MIN.md`, `SMT_AI_CONTEXT_PACK.md`.

- [x] 定義真相優先次序、模式入口與禁止事項。
- [x] 建立 Chat 開場指令、附件規則及回合結束 checkpoint。
- [x] 標明版本、測試與待驗收項目。

### Task 2: Graphify／CodeGraph 式索引

**Files:** Create `docs/ai-context/SMT_KNOWLEDGE_GRAPH.json`, `SMT_CODE_MAP.md`, `SMT_CHANGE_IMPACT.md`.

- [x] 建立帶 `EXTRACTED`／`INFERRED` 證據標籤的節點及邊。
- [x] 映射主要畫面、狀態、函數、資料及測試。
- [x] 為高風險修改列出必查依賴及回歸測試。

### Task 3: Headroom 式壓縮及治理

**Files:** Create Decision Ledger, Implementation Status, Chat Handoff Protocol and README under `docs/ai-context/`.

- [x] 將決策標記為 LOCKED、CURRENT、SUPERSEDED 或 OPEN。
- [x] 將完成度分開為 implemented、automated、device、owner lock。
- [x] 定義每次 Chat 開始與結束時必須輸出的最小資料。

### Task 4: 自動驗證

**Files:** Create `scripts/validate-ai-context.mjs`, `tests/ai-context.test.mjs`, `docs/ai-context/manifest.json`.

- [x] 驗證必要文件、JSON、節點邊引用及版本一致。
- [x] 執行 `node --test tests/*.test.mjs`，預期全部通過。
- [x] 執行 `node scripts/validate-ai-context.mjs`，預期輸出 `SMT Context OS valid`。
