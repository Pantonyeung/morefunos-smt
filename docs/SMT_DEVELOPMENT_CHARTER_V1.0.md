# More Fun／磨飯 SMT｜產品設計與工程開發憲章 V1.0

狀態：**CURRENT / PRIMARY STANDARD**  
生效日期：2026-07-26  
適用範圍：SMT 全部頁面、功能、重構、修正、Responsive、Checkout、打印、同步、Admin 接入、效能及後續 AI／工程代理工作。

---

## 0. 強制入口規則

任何 AI、Codex、Work 模式、工程代理、開發者或新對話，在分析、設計或修改 SMT 前，**必須先完整閱讀本文件**。

未完成閱讀：

- 禁止修改程式；
- 禁止新增功能；
- 禁止重構；
- 禁止提出與本文件衝突的工程方案作為預設做法。

任何工作開始前，必須先回答：

1. 本次需求屬於哪個 Domain？
2. 本文件哪幾條規則直接適用？
3. 會修改哪個正式責任來源？
4. 有沒有建立第二套邏輯、Observer、Override、Compatibility Layer 或 Patch？
5. 如何測試、如何回滾？

### 規則優先次序

1. 安全、資料完整、付款／訂單不可逆風險；
2. 產品負責人明確要求「修改／更新本憲章」的新決策；
3. 本憲章；
4. `AGENTS.md`、`SMT_AI_START_HERE.md` 及 Current Lock；
5. 任務級指令；
6. 舊效果圖、舊 Log、舊版本。

一般新需求**不得默認推翻本憲章**。如需求與本憲章衝突，先指出衝突並要求產品負責人決定是否正式修改本憲章。

---

# 一、最高產品目標

SMT 係餐廳收銀及營運工具，不係展示網站。

任何功能優先次序固定為：

1. 操作正確
2. 操作快速
3. 防止出錯
4. 資訊清楚
5. 高峰期可操作
6. 穩定
7. 視覺美化
8. 動畫

任何美化不得犧牲前六項。

---

# 二、人唔應該遷就系統

員工可以按真實客人講單、平台單、電話單嘅順序輸入。

系統負責：

- 整理；
- 分類；
- 提示；
- 驗證；
- 計價；
- 配對；
- 同步；
- 打印。

禁止為咗程式方便，要求員工改變真實營運方式。

---

# 三、一個功能只准一個真正責任來源

固定責任例子：

- 購物車資料 → Order Domain
- 價格／附加費 → Pricing Domain
- 堂食／外賣 → Service Mode Domain
- 打印 → Print Domain
- Modal 生命週期 → Modal Core
- Responsive → Responsive Core
- Checkout → Transaction Layer

禁止形成：

`Core → Patch → Override → Compatibility → Observer → 再改 DOM`

如果功能真正屬於某 Domain，就修改該 Domain。

---

# 四、資料先於畫面

正確：

`State → Domain → Render`

禁止：

`Render → 掃 DOM → 猜 State → 再補 DOM`

畫面永遠係資料結果，唔可以成為業務資料來源。

除非係第三方不可控內容，否則禁止用 MutationObserver、文字掃描、DOM 反推去補自己系統已有 State。

---

# 五、局部更新原則

修改購物車，只更新購物車相關 Surface。

開 Modal，只更新 Modal Surface。

修改飲品，只更新相關飲品、配對及合計。

禁止因為一粒按鈕：

- 重建整個產品 Grid；
- 重建 Global Status Bar；
- 重建 Bottom Navigation；
- 重建全部圖片；
- 重新初始化所有 Page。

已 Ready 的頁面保持持久化。

---

# 六、互動速度標準

所有可操作控制：手指按下後必須立即有 Pressed Feedback。

內部產品目標：

- 首個視覺回饋：目標 ≤ 100ms；
- 一般互動完成到下一幀：目標 ≤ 200ms；
- 0.5–1 秒無反應：不可接受；
- 需要 Double Click：Regression；
- 使用者懷疑「究竟有冇撳到」：Regression。

效能優化以真實量度為準，唔靠感覺猜測。

---

# 七、POS 高峰操作原則

高頻操作優先 1 Tap。

常見任務原則上最多 2 Tap 完成。

優先使用：

- 圖片辨認；
- 位置記憶；
- 數量；
- 即時狀態；
- 明確 Highlight；

避免要求員工閱讀大量文字先決定。

批量工作提供快速處理；只有例外先進入指定處理。

---

# 八、兩類彈窗制度

## A. 來源浮卡（Anchored Popover）

適用：

- 普通產品修改；
- 快捷模式；
- 顯示設定；
- 設備狀態；
- 搜尋；
- 小型設定。

規則：

- 必須靠近真正 Trigger；
- 必須有來源箭嘴／清楚視覺關聯；
- 不得無原因跳到畫面另一邊；
- 不得變成大型任務工作台；
- 同一時間只開一張。

## B. 任務工作台（Task Modal）

適用：

- 必選補齊；
- Checkout；
- 付款；
- 批量配對；
- 重大確認；
- 阻礙交易完成的任務。

規則：

- 中央顯示；
- 可以佔用大部分可用工作區；
- 背景完全鎖定；
- 必須提供足夠資訊完成決策；
- 一次只處理一個清晰任務。

---

# 九、Modal 退出制度

沒有修改：按背景可直接退出。

已有修改：不得直接丟失。

必須提供：

- 繼續修改；
- 放棄修改；
- 保存並退出。

任何 Modal 必須有可靠退出路徑，禁止只剩 Overlay、內容不可見而造成死鎖。

---

# 十、同一資訊只准一個 Component

例如 Drink Choice Card：

必選飲品、快捷飲品、產品內飲品必須共用同一核心 Card。

共用：

- DOM 結構；
- 圖片比例；
- 名稱位置；
- 選中狀態；
- 數量 Badge；
- Loading；
- Fallback；
- Accessibility 狀態。

容器可以不同，但 Card 本身禁止重新設計第二套。

---

# 十一、餐飲圖片原則

產品圖片係辨認工具，唔係裝飾。

有圖卡片：圖片必須係主要視覺。

禁止：

- 大量無用途留白；
- 圖片只佔極小比例；
- Placeholder 文字搶過產品資訊；
- 為咗「靚」而降低辨認速度。

Drink Choice Card 建議以圖片約佔卡片 75–80% 作為設計起點，再按實機驗收調整。

---

# 十二、必選流程

所有會阻礙 Checkout 的必選項，由系統主動帶員工完成。

例：

`飯底 → 醬汁 → 小食 → 飲品`

必須清楚顯示：

- 尚欠幾多；
- 目前處理邊一份；
- 已完成邊一份；
- 每份揀咗乜；
- 尚欠乜。

未完成：Checkout 不可正式提交。

普通口味修改（例如走青瓜、走蔥等）唔應污染必選工作流。

---

# 十三、快速處理＋指定例外

大量同類工作預設快速順序處理。

例如八杯飲品：員工可以連續選八杯，由同一套 Assignments 按未完成目標順序分配。

如客人有指定，先選目標，再指定選項。

禁止為「快速模式」另建第二套交易資料。

---

# 十四、Responsive 原則

禁止將 1920×1080 整頁縮放成其他正式運行尺寸。

每個正式尺寸按 Available Content Area 重新計算：

`可用工作區 → 元件容量 → Grid → 圖片 → 文字`

所有尺寸使用同一功能架構。

Responsive / Adaptive Core 只負責尺寸、Token、可用區與 Profile；**不得重新設計 Component**。

正式主要驗收尺寸：

- 1920×1080
- 1600×900
- 1440×900
- 1366×768
- 1280×800

手機尺寸驗收工具可以縮放模擬畫布，但唔代表正式 Runtime 使用整頁縮放。

---

# 十五、CSS 責任制度

固定分工：

- Base：Token／基本 Reset；
- Responsive：尺寸／Profile；
- Component：元件自身外觀；
- Page：頁面布局。

禁止三個 Stylesheet 同時決定同一 Component 的核心比例。

禁止為咗壓過舊規則不停提高 Selector Specificity。

禁止大量 `!important`。

---

# 十六、禁止 Observer 補自己嘅 State

除非真正係外部不可控資料源，否則禁止用：

- MutationObserver；
- DOM 全樹掃描；
- 讀畫面文字反推資料；

去補本身已經存在 State 的功能。

例如飲品「✓3」應直接由 Assignments Render，而唔係 Render 後再掃 DOM 計算。

---

# 十七、Persistence 分級

## 必須可靠保存

- 購物車；
- 交易內容；
- 套餐配對；
- 堂／外狀態；
- 會員；
- 必選結果；
- 未完成交易需要恢復的 Context。

## 不應每次同步保存

- Highlight；
- Drawer 開／關；
- Modal 開／關；
- Anchor；
- Hover；
- Toast；
- 短暫動畫；
- 臨時視覺 Feedback。

禁止任何 UI 小變化都同步序列化並寫入完整交易 State。

---

# 十八、Checkout Transaction Layer

Checkout 高於普通 Page。

進入 Checkout：

- Global Bottom Navigation 不得離開交易；
- 取消 Checkout 必須完整恢復 Cart；
- Checkout 頁可預備 Ready，但交易資料必須在 Activate 時取得最新 State；
- 空 Cart 的 Checkout 按鈕真正 Disabled；
- 不得因新功能破壞 Transaction Lock。

---

# 十九、打印／資料輸出原則

輸入順序、員工檢視順序、正式輸出順序係三個概念。

- Input Order：保留真實錄入次序；
- Operator View：可原單／整理切換；
- Receipt / Print：按正式輸出規則整理。

客人小票唔可以因員工當時停留「原單」就變成亂序。

打印、Checkout、Receipt 必須共用同一 Pricing / Service Mode 結果，禁止各自重算。

---

# 二十、修改前 12 問

每次修改前必須回答：

1. 使用者真正問題係乜？
2. 根因屬於邊個 Domain？
3. 成熟產品通常點處理？
4. 現有核心可唔可以做到？
5. 需要修改邊個責任來源？
6. 有冇建立第二套邏輯？
7. 會唔會重新 Render 不相關區域？
8. 會唔會增加 Observer／Override／Compatibility Layer？
9. Checkout 有冇受影響？
10. Responsive 有冇受影響？
11. 點測試／實機驗收？
12. 點回滾？

未回答清楚，禁止開始寫 Code。

---

# 二十一、第一次 Fix 失敗規則

第一次修改效果唔啱：**STOP**。

重新查根因。

禁止立即再加：

- 第二層 CSS；
- Observer；
- Wrapper；
- Compatibility Layer；
- Hotfix；
- Patch。

---

# 二十二、正式修改流程

`需求 → 研究 → 根因 → 方案 → 影響分析 → 使用者確認 → 實作 → 自動測試 → 效能測試 → Responsive 測試 → 實機驗收 → Lock`

如使用者明確要求「先討論」，任何寫操作必須暫停到方案確認。

---

# 二十三、驗收分級

每個重要功能最少分五類：

1. 功能驗收；
2. 操作驗收；
3. 視覺驗收；
4. 效能驗收；
5. 回歸驗收。

「畫面睇落啱」不可取代其他四類。

---

# 二十四、最高禁止事項

禁止：

- 新增 `patch.css`、`override.css`、`hotfix.css`、`fix2.css` 類永久補丁；
- Render 後掃 DOM 補 State；
- 一個功能兩套 Core；
- 所有 State Change 重畫整個 App；
- 所有 UI 狀態同步寫完整交易 Storage；
- Adaptive CSS 重新 Design Component；
- 為咗測試綠而刪真實營運功能；
- 新功能破壞已驗收 Checkout／Cart／Startup；
- 未找根因就落 Code；
- 未討論清楚就自行擴大需求。

---

# 二十五、SMT 產品方向

固定方向：

**餐飲專業收銀效率 × 蘋果式互動清晰 × 嚴格單一責任工程架構。**

目標唔係「似蘋果畫面」，而係：

- 狀態立即有反應；
- 來源清楚；
- 上下文唔丟失；
- 同類操作一致；
- 少步驟；
- 少錯誤；
- 高峰時唔需要思考程式點運作。

---

# 二十六、外部設計／效能依據

本憲章參考以下成熟規範，但 More Fun 真實營運需求及本憲章鎖定規則優先於表面模仿：

1. Apple Human Interface Guidelines — Design principles  
   https://developer.apple.com/design/human-interface-guidelines/design-principles

2. Apple Human Interface Guidelines — Popovers  
   https://developer.apple.com/design/human-interface-guidelines/popovers/

3. Apple Human Interface Guidelines — Modality  
   https://developer.apple.com/design/human-interface-guidelines/modality

4. web.dev — Interaction to Next Paint (INP)  
   https://web.dev/articles/inp

5. Square / Restaurant POS modifier patterns：餐飲選項、必選／修改組及營運工作流可作產品模式參考；實作仍須遵守 More Fun Domain。  
   https://squareup.com/

### 來源轉化原則

- Apple HIG：引用「目的、一致、來源關聯、適度使用 Modal／Popover」等互動思想；唔做表面仿製。
- web.dev：以 INP ≤ 200ms 作一般良好互動參考；SMT 內部目標更嚴格，首個視覺回饋目標 ≤100ms。
- 餐飲 POS：只借鑑高峰操作、Modifier、快速輸入、廚房／收銀分工等成熟模式；More Fun 真實營運規則優先。

---

# 二十七、最終判斷句

每次準備修改之前，必須問：

> 「一間成熟 POS 公司，或者以 Apple 級產品紀律長期維護，會唔會用呢個方法？」

如果答案只係：

> 「暫時令畫面啱。」

就唔可以做。
