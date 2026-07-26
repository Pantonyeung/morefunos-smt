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

## 3. 正式主要尺寸

- 1920×1080
- 1600×900
- 1440×900
- 1366×768
- 1280×800

1920×1080 係主要視覺參考模板，但其他尺寸必須重新計算可用工作區，唔係縮細完整畫面。

---

## 4. 固定計算次序

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

## 5. 同一 Component 原則

同一 Component 只得一個核心結構。

例如 Drink Choice Card：

- 必選飲品；
- 快捷飲品；
- 產品內飲品；

共用同一 Card，Adaptive 只改 Container／可用尺寸／密度，不得另起第二套 DOM 或選中邏輯。

---

## 6. 操作一致性

所有 Profile 必須保持：

- 同一功能；
- 同一資料結果；
- 同一主要操作順序；
- 同一 Checkout Lock；
- 同一 Modal 分類；
- 同一 Print／Pricing 結果。

尺寸改變唔可以令功能消失、移去另一套頁面、或變成另一個 Domain。

---

## 7. 正式 Runtime 與手機驗收工具分離

正式 Runtime：

- 使用真實裝置 viewport；
- 按 Adaptive Profile 運行；
- 不使用整頁縮放作正式尺寸適配。

手機尺寸驗收工具：

- 可以由使用者手動選 1920／1600／1440／1366／1280；
- 可以將指定模擬畫布縮放到 iPhone 直屏顯示；
- 只係 QA／視覺驗收工具；
- 不得反向影響正式 Runtime Profile。

---

## 8. Responsive 回歸

重要 UI 修改至少驗：

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
- 觸控區足夠。

---

## 9. CSS 責任

- Base：Token／Reset；
- Adaptive：尺寸／Profile／可用區；
- Component：元件外觀與內部比例；
- Page：頁面布局。

禁止 Adaptive、Page、Component 三層同時競爭控制同一核心比例。

第一次出現尺寸 Regression：STOP 查責任來源，禁止再疊 Override。

---

## 10. 與其他最高標準關係

- MFKG：記錄 Adaptive Node、Profile、依賴及驗證證據；
- Development Charter：規定單一責任、效能、測試及禁止補丁；
- Adaptive Application Standard：規定同一 Application 如何適應不同裝置／尺寸。

三者共同構成 SMT Development Standard。
