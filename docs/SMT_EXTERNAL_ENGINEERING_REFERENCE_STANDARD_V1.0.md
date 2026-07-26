# More Fun／磨飯 SMT｜多專業工程與外部參考標準 V1.0

狀態：CURRENT / PRIMARY SUPPORTING STANDARD
生效日期：2026-07-27
適用範圍：SMT 產品、前端、後端、Android、iOS／Apple 平台思維、POS、資料、離線、效能、打印、同步、Adaptive、可用性及後續 AI／工程代理工作。

---

## 1. 核心要求

SMT 不可只用單一「前端畫面」角度開發。

每個重要決策至少從以下角色交叉審視：

- 產品經理：任務是否符合真實營運、是否減少步驟、是否避免誤操作；
- 前端架構師：Component Authority、Render 邊界、狀態流、效能、可維護性；
- 後端架構師：資料真相、Idempotency、同步、離線、交易完整性、API 邊界；
- App 工程師：生命週期、持久化、裝置能力、前後台切換、低資源環境；
- Apple 平台開發／設計：清晰、直接回饋、來源關聯、一致性、適度 Modal／Popover；
- Android 開發：Adaptive、離線優先、裝置多樣性、生命週期、資料層分離；
- POS 工程師：高峰速度、少步驟、不中斷交易、離線可用、打印／付款／同步故障降級；
- QA／可靠性工程：回歸、錯誤狀態、恢復路徑、壓力、失敗模式、證據先於結論。

任何角色都不得獨立推翻 More Fun 已鎖定 Business Rule。

---

## 2. 外部資料使用規則

重要架構／效能／Adaptive／離線／POS／平台行為決策，應主動查閱最新官方資料及成熟產品做法。

外部資料用途：

1. 驗證現行方案是否合理；
2. 發現盲點；
3. 挑戰錯誤假設；
4. 提供成熟實作模式；
5. 找出可靠性、效能、生命週期及可維護性風險。

外部資料不得：

- 取代 More Fun 真實營運規則；
- 因為「大公司咁做」就硬搬入 SMT；
- 為追求框架純度犧牲 POS 高峰效率；
- 將第三方產品 UI 當成必須模仿的視覺模板。

真相優先：

安全／資料完整 → More Fun 鎖定商業邏輯 → 實機證據 → SMT 標準 → 官方平台工程指引 → 成熟產品模式 → 一般網路意見。

---

## 3. 目前正式外部參考

### Apple

- Apple Human Interface Guidelines — Design principles
  https://developer.apple.com/design/human-interface-guidelines/design-principles

用途：目的、一致、直接回饋、資訊層級、互動清晰。

### Android

- Android Developers — Guide to app architecture
  https://developer.android.com/topic/architecture

用途：Separation of Concerns、清楚責任邊界、UI 不持有唯一資料真相。

- Android Developers — Build an offline-first app
  https://developer.android.com/topic/architecture/data-layer/offline-first

用途：核心功能在網絡不可靠時仍可工作、先讀本機資料、同步屬資料層責任。

### Web／PWA 效能

- web.dev — Optimize Interaction to Next Paint
  https://web.dev/articles/optimize-inp

用途：互動延遲、長任務、輸入延遲、Style／Layout 成本、局部更新。

### POS／離線可靠性

- Square Developer — POS API Offline Mode
  https://developer.squareup.com/docs/pos-api/cookbook/offline-mode

- Square Support — Offline payments
  https://squareup.com/help/us/en/article/7777-process-card-payments-with-offline-mode

用途：POS 在連線不穩下仍保持核心營運、離線資料暫存、重連後同步、失敗狀態可見。

---

## 4. 多專業決策流程

重要需求不得直接由「需求 → 寫 Code」。

正式流程：

需求
→ 真實營運任務
→ Domain／Authority
→ 多專業風險審視
→ 外部官方／成熟產品驗證
→ 方案比較
→ 選擇最少長期技術債方案
→ 實作
→ Contract／Regression
→ 效能／失敗模式
→ 1920 實機驗收
→ Lock

如產品負責人提出的方法不是最佳方案，工程代理有責任直接指出問題、提出替代方案及原因，而不是照單全收。

---

## 5. Authority 與架構原則

Ownership ≠ File Ownership。

一個 Component 可以跨多層共同構成，但同一種決策只能有一個 Authority：

- Page／Composition：元件外部位置及可用空間；
- Component：內部 DOM／Visual／Interaction；
- Domain：資料／商業規則；
- Adaptive：只提供 Token／Available Area／Density；
- Shell：Global Chrome／Route／Transaction；
- Persistence／Sync：資料層；
- Print：Print Domain。

禁止：

- 同一屬性多個 Stylesheet 最終決策；
- UI、Checkout、Print 各自重算同一價格；
- Adaptive 直接變成第二 Component Designer；
- Observer／DOM 掃描補自己已有 State；
- Patch／Override／Compatibility Layer 作永久架構。

---

## 6. POS 專用工程標準

SMT 屬營運系統，優先級：

1. 交易正確；
2. 操作即時；
3. 高峰期少步驟；
4. 不因網絡／打印／同步暫時失敗而鎖死整個 POS；
5. 所有失敗有可見狀態及恢復路徑；
6. 本機先保持可操作，再處理外部同步；
7. 重要寫入必須可重試而避免重複交易；
8. 打印工作與訂單真相分離，打印失敗不得改寫訂單本身。

---

## 7. 效能標準

- Pressed Feedback：目標立即；
- 一般互動：SMT 內部目標 ≤ 200ms；
- 0.5–1 秒無反應視為 Regression；
- 禁止 Double Click 才成功；
- 優先局部 Surface Update；
- 避免大型 DOM、全頁重 Render、Layout Thrashing、重複 Style 計算；
- 效能判斷要有量度，不可只靠感覺。

---

## 8. Adaptive 標準

1920×1080 為目前唯一視覺封板模板。

其他尺寸：

1920 Lock
→ Adaptive Core 計算 Available Area
→ Token／Density／Grid／Typography
→ Component 使用同一 Authority
→ Regression

禁止為單一尺寸重畫第二套 UI。

---

## 9. 持續更新規則

本文件不是一次性文件。

當出現以下情況，必須檢查並按需要更新：

- Apple／Android 官方平台指引重大更新；
- Web／PWA 效能標準更新；
- 新硬件／打印／離線／同步實機證據；
- SMT 出現新的重複 Regression；
- Authority 模型需要調整；
- More Fun 真實營運流程改變；
- 新成熟 POS 模式證明現行方案有更安全做法。

更新標準必須記錄版本、理由、受影響 Authority／Domain 及回歸要求。

---

## 10. 最終判斷

每個重要修改前，必須問：

「如果由一隊頂級產品、前端、後端、Apple、Android、POS、可靠性工程師共同維護五年，呢個方法仲會唔會成立？」

如果答案只係「暫時畫面啱」或者「暫時可以用」，就唔可以當正式方案。