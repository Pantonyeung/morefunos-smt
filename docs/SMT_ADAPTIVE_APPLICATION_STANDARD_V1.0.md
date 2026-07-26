# More Fun／磨飯 SMT｜自適應應用標準 V1.0

狀態：**CURRENT / PRIMARY STANDARD**  
生效日期：2026-07-26  
適用範圍：SMT 正式 Runtime、尺寸驗收工具、Component、Responsive／Adaptive Core、裝置 Profile 及後續多裝置擴展。

---

## 0. 定義

Adaptive Application ≠ Scale。

正式 SMT 只得一套 Application、Domain、Component、資料模型及交易邏輯。不同裝置／解像度只係不同 Profile，不係不同版本。

禁止：

`1920×1080 → transform scale → 1280×800`

正式模型：

`Same Domain → Same Feature → Same Component → Adaptive Core → Device／Viewport Profile → Available Content Area → Layout／Density／Grid／Typography adaptation`

---

## 1. Adaptive Core 可以控制

- Available Content Area；
- Layout token；
- Spacing；
- Density；
- Grid capacity；
- Typography scale；
- Component available size；
- Modal maximum bounds；
- Device／Viewport Profile；
- Interaction Profile（例如滑鼠／觸控安全尺寸）。

---

## 2. Adaptive Core 禁止控制

禁止因尺寸而建立第二套：

- Business Logic；
- Order Domain；
- Cart Domain；
- Checkout；
- Pricing；
- Print；
- Drink Choice Card；
- Modal Lifecycle；
- Service Mode；
- 資料模型；
- API Contract。

Responsive／Adaptive CSS 亦不得重新 Design Component。

---

## 3. 1920 視覺封板模板｜CURRENT HARD RULE

現階段 **1920×1080 係唯一視覺封板模板**。

固定工作順序：

`1920×1080 正確 → 產品負責人實機驗收 → 封板 → Adaptive Core 套用其他尺寸 → 其他尺寸只做 Regression／必要 Token 調整`

### 規則

- 1920 未封板前，禁止同時為其他尺寸逐個調 UI；
- 1600／1440／1366／1280 唔係獨立設計模板；
- 其他尺寸唔可以反向改變已封板 1920 的 DOM、操作順序、Component 結構或核心比例；
- 已封板區域預設為 **READ-ONLY**；只有證明新問題根因直接位於該區域，先可以修改；
- 如果其他尺寸出現爆框／密度問題，優先修 Adaptive Core、Profile、Token、Available Content Area；
- 禁止為單一尺寸修改已封板 1920 畫面去「撞到啱」。

---

## 4. Global Shell 架構｜正式鎖定

SMT 採用單一 Persistent Global Shell：

`Global Status Bar → Central Page View → Global Bottom Navigation`

### 固定規則

- Global Status Bar 全局唯一；
- Global Bottom Navigation 全局唯一；
- 五個主頁只切換 Central Page View；
- 已 Ready 的頁面保留自身狀態，切換時不得重建整個頁面；
- 頁面可以提供 Contextual Actions，但不得重新建立第二條 Status Bar 或 Bottom Navigation；
- Checkout 屬 Transaction Layer，可以隱藏／鎖死 Bottom Navigation，但唔代表建立第二套導航。

### 點解保留同一位置

SMT 係固定工作站／橫屏 POS，肌肉記憶同高峰操作速度優先。現階段不因不同橫屏尺寸自動改成 Sidebar 或另一套導航位置。

導航位置改變只可以喺未來出現真正不同裝置類型時，另立 Device Interaction Profile，並先經產品驗收。

---

## 5. Global Shell 尺寸規則

Shell 不可以跟整頁同比例縮放。

### 正確方式

先決定：

1. Safe Area；
2. Global Status Bar 合理高度；
3. Global Bottom Navigation 合理高度；
4. 最低觸控尺寸；
5. 剩餘 Available Content Area。

之後先將剩餘空間交畀頁面 Adaptive Layout。

### Shell 高度

- 使用 Token + `min / preferred / max` 範圍；
- 可以按 viewport height 在範圍內微調；
- 禁止直接按 1920 比例整體縮小；
- 禁止某尺寸突然產生另一套 Shell。

### 觸控尺寸

- 可按控制最低有效觸控高度：**44px**；
- POS 高頻主要控制目標：**48px 或以上**；
- 純資訊標籤可以細過 44px，但唔可以假裝成可按控制；
- Adaptive 不得為了塞更多內容將高頻按鈕壓到 44px 以下。

---

## 6. 固定計算次序

任何 Profile 先計：

1. Global Status Bar；
2. Global Bottom Navigation；
3. 固定側欄／購物車；
4. 安全區；
5. 其他固定 UI；
6. 剩餘 Available Content Area。

之後先決定：

- Product Grid；
- Cart Density；
- Modal Bounds；
- Card Size；
- Image Ratio；
- Text Scale；
- Gap／Padding。

---

## 7. Product Grid 穩定性

1920 模板先決定產品卡正式視覺、比例與欄位邏輯。

Adaptive 套用其他尺寸時可以調整：

- Card 高度；
- 圖片高度；
- Gap；
- Padding；
- 字體 Token；
- 垂直可見行數。

但不得重新設計產品卡，亦不得因個別尺寸改變產品位置記憶及核心操作方式。

---

## 8. 同一 Component 原則

同一 Component 只得一個核心結構。

例如 Drink Choice Card：

- 必選飲品；
- 快捷飲品；
- 產品內飲品；

共用同一 Card，Adaptive 只改 Container／可用尺寸／密度，不得另起第二套 DOM 或選中邏輯。

---

## 9. 已封板 Component 保護

一旦產品負責人將某區域／Component 標記為已封板：

- 預設不可修改 DOM 結構；
- 不可改主要位置；
- 不可改操作順序；
- 不可改已驗收比例；
- 不可因其他尺寸出現問題就順手重構；
- 不可因「整理程式」而令已封板畫面重新漂移。

只有以下情況可改：

1. 新問題根因直接位於該 Component；
2. 安全／資料完整／交易正確性要求；
3. 產品負責人明確解鎖。

修改前必須先列出影響面，修改後必須重新驗該封板區域。

---

## 10. 操作一致性

所有 Profile 必須保持：

- 同一功能；
- 同一資料結果；
- 同一主要操作順序；
- 同一頂層導航位置；
- 同一 Checkout Lock；
- 同一 Modal 分類；
- 同一 Print／Pricing 結果。

尺寸改變唔可以令功能消失、移去另一套頁面、或變成另一個 Domain。

---

## 11. 字體與資訊密度

Typography Adaptive 唔等於全頁字體同比例縮小。

規則：

- 先保留最低可讀字級；
- 優先減少 Gap／Padding／次要資訊，再考慮縮字；
- 產品名稱、價格、數量、付款金額、錯誤／警告等高優先資訊不得因 Profile 過度縮細；
- 小字／中字／大字必須由統一 Token／Profile 控制；
- 頁面不得自行另設縮字規則去解決爆框。

---

## 12. 正式 Runtime 與手機驗收工具分離

正式 Runtime：

- 使用真實裝置 viewport；
- 按 Adaptive Profile 運行；
- 不使用整頁縮放作正式尺寸適配。

手機尺寸驗收工具：

- 現階段主要用作 **1920×1080 模板視覺驗收**；
- 可以將 1920 模擬畫布縮放到 iPhone／iPad 顯示，方便查看細節；
- 只係 QA／視覺驗收工具；
- 不得反向影響正式 Runtime Profile。

其他尺寸只有喺 1920 封板後，先進入 Adaptive Regression 階段。

---

## 13. Adaptive 回歸

1920 封板後，其他尺寸只驗：

- 不爆框；
- 不裁切重要內容；
- 不遮操作；
- 無不必要水平滾動；
- Modal 完整；
- Overlay 完整；
- Cart 正常；
- Checkout 正常；
- Navigation 正常；
- 文字可讀；
- 可按控制有效觸控高度不得低於 44px；
- 已封板 Component 的資訊層級、操作順序及核心視覺不得被改寫。

發現問題時，先判斷係 Adaptive Core／Profile 問題，唔可以直接改 1920 封板 Component。

---

## 14. CSS 責任

- Base：Token／Reset；
- Adaptive：尺寸／Profile／可用區；
- Component：元件外觀與內部比例；
- Page：頁面布局；
- Shell：Global Status Bar／Central Page Host／Global Bottom Navigation。

禁止 Adaptive、Page、Component、Shell 多層同時競爭控制同一核心比例。

第一次出現尺寸 Regression：STOP 查責任來源，禁止再疊 Override。
