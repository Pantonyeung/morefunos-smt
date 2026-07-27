# SMT Success / Pitfall Log

> 狀態：CURRENT / APPEND-ONLY KNOWLEDGE LOG
> 用途：記錄已證實成功做法、踩坑、錯誤假設、回歸根因及下次接手必須避開的路徑。
> 真相優先：Runtime／Tests／Ownership Registry／Implementation Status 高於本 Log；本 Log 不得成為第二套產品規格。

## 使用規則

每次完成一個可驗證階段，追加：
1. Success：做了甚麼、為何有效、證據 commit／test／device。
2. Pitfall：錯誤方法／錯誤假設、根因、浪費成本。
3. Guardrail：之後用哪個 test／audit／authority rule 防止重犯。
4. Next：仍未完成、不可誤稱完成的項目。

禁止刪除歷史踩坑；被推翻的判斷標示 `SUPERSEDED`，保留原因。

---

## S-01｜Authority Model 收口成功

**成功**
- SMT 由「一個元件一個檔案」修正為「同一項決策只可有一個 Authority」。
- Page = Composition；Component = internal Visual；Domain = State / Business Truth；Adaptive = Token Provider；Shell = Global Chrome / Route / Transaction。
- V3 Status Actions、V4 Overlay、V5 Child Chrome、V6 Shared Adaptive、V7 Shared Responsive、V8 Global Chrome Visual 已完成責任收口。

**踩坑**
- 同一 Cart 曾同時由 `page.css`、`cart.css`、`adaptive-layout.css` 控制，造成「改了但畫面不變」。
- Drink Card、Global Status、Overlay 都曾有雙 Authority。

**Guardrail**
- `docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md`
- `scripts/audit-component-ownership.mjs`

---

## S-02｜永久 QA 由 9 FAIL 收到 0 FAIL

**成功**
- 永久 QA workflow 改為監聽正式 Authority／Adaptive／Audit／tests 檔案。
- 最新已驗證 baseline：Ownership Audit PASS；`248/248` Node tests PASS；Syntax PASS；`RESULT=PASS`。

**踩坑**
- 舊 tests 一度仍要求已淘汰的 `MutationObserver`／`syncChildStatusActions`／Shared direct selector／固定 pixel contract。
- 錯誤做法係令 Runtime 倒退去迎合舊 test。

**正確方法**
- 先判斷 fail 係 stale test 定真回歸；只有產品／Authority contract 已改時才更新 test。
- 新 test 鎖 Authority、Token、比例、狀態真相，不鎖過時 implementation detail。

**Guardrail**
- `.github/workflows/qa-runtime-phase3.yml`
- `docs/qa/SMT_RUNTIME_PHASE3_QA.md`

---

## S-03｜Cart Marker 反覆無效的真正根因鏈

**已證實根因**
1. Cart marker/image 曾被多層 CSS 管理。
2. Marker 雖改成 Image × 0.9，但 `shared/adaptive-layout.js` 仍用 `cart.height/890` 二次縮細 1920 baseline。
3. Shell 扣走可用高度後，1920 image 先被縮細，marker 再按 90% 計，因此比例正確但整體仍偏細。

**成功修正**
- Cart adaptive scale 改為 viewport baseline＋cart width；禁止 `rect.height/890` 回流。
- 1920 目標：Cart image 約 72px；marker 約 64.8px。
- `tests/cart-adaptive-scale-contract.test.mjs` 已鎖定呢個 contract。

**踩坑**
- 未查 Adaptive 計算就反覆改 CSS，只會浪費時間。
- 未 fresh-read 正式 branch 就根據舊片段判斷 cache/build，會得出錯誤結論。

---

## S-04｜Drink / Product Card 圖片完整顯示

**成功方向**
- Drink Card 正式 Authority = `pages/order/drink-card.css`。
- Product Card 正式 Authority = `pages/order/product-card.css`。
- 圖片本體使用 `object-fit: contain`；產品／飲品圖片本體約佔 stage 70%，卡 footprint 不變，增加留白，避免裁切。

**踩坑**
- Generic `.image-shell img { object-fit: cover }` 曾令產品被放大裁切。
- 舊 selector 曾誤中圖片容器／文字 span，造成飲品圖片異常縮細。

**Guardrail**
- Product / Drink Authority contract tests＋Ownership Audit。

---

## S-05｜Cache / Deployment 判斷紀律

**成功做法**
每次『Repo 已改但實機似無變』按固定順序查：
`DOM → Authority → Adaptive Token → asset query key → Shell iframe BUILD → QA report → deployment`。

**踩坑**
- 曾以舊片段誤判 Shell BUILD 仍停 20260726；fresh-read 正式 branch 後證實已升 20260727。
- Cloudflare 曾有兩個 Pages project 同時被同一 commit 觸發；呢個不等於兩個 Git branch。

**Guardrail**
- 任何判斷必須 fresh-read `smt-functional-completeness-v1`。
- Commit 描述、聊天記憶、舊 QA report 不能單獨當真相。

---

## CURRENT｜仍未完成

- V1 Cart：新 Authority 已切換；`page.css` legacy internal rules 尚未物理移除。
- V2 Drink Card：新 Authority 已切換；`page.css` legacy 尚未物理移除。
- V9 Product Card：新 Authority 已切換；`page.css` legacy 尚未物理移除。
- Pairing Modal：新 Authority 已切換；`page.css` legacy 尚未物理移除。
- 1920 實機視覺回歸仍要完成；自動測試 PASS 不等於 device acceptance。
- 1280×800 及其他尺寸只可在 1920 封板後由同一 Adaptive Core 做 regression，禁止另開第二套 UI。
