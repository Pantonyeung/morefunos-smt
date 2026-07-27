# SMT_CHANGE_IMPACT

> 狀態：CURRENT / HARD RULE / MUST READ BEFORE BUG OR CHANGE WORK
> 作用：任何 Bug、UI、Runtime、Domain、Adaptive、Responsive、Cache、QA、API、Print、Sync 修改前，先做影響分析；修改後同步實際結果、測試、回滾與新踩坑。
> 真相來源：GitHub 正式分支為程式／工程真相；Jade Note 必須保留同名鏡像摘要，方便新對話／接手 AI 快速理解，但不得取代 GitHub。

## 1. 強制工作流

任何修改前必須回答：

1. 問題／需求係乜？可否穩定重現？
2. 根因證據係乜？禁止只按畫面猜原因。
3. 所屬 Domain／Component／Global Surface 係邊個？
4. Composition／DOM／Visual／State／Domain／Token 唯一 Authority 係邊個？
5. 會影響邊啲檔案、頁面、流程、裝置尺寸、API、打印、同步或資料？
6. 有冇第二 Authority、舊 Selector、Observer、Override、Cache、Build Key 或 Legacy Runtime 重新覆蓋？
7. 會唔會碰已封板 1920×1080？如果會，必須證明根因直接位於該區。
8. 有冇對 Checkout／付款／訂單／打印／資料完整造成不可逆風險？
9. 需要新增／更新邊個 Contract Test／Authority Audit？
10. 回滾方式係乜？

修改後必須更新：

- 實際修改檔案／Commit；
- 成功證據；
- 失敗／踩坑證據；
- QA／CI／Browser／實機驗收狀態（不得混為一談）；
- 新增或解除嘅 Authority Migration；
- MFKG／Decision Ledger／Implementation Status／Code Map（如相關）；
- `docs/qa/SMT_ENGINEERING_SUCCESS_AND_PITFALLS_V1.0.md`；
- Jade Note 同名鏡像摘要；
- 下一步唯一優先事項。

## 2. 固定 Debug 排查鏈

遇到「改咗但冇變」或修改無效，固定依次查：

`DOM → Authority → selector chain → Adaptive Token → JS runtime write → asset cache → child build → Shell build → root loader → QA evidence`

禁止：

- 未查根因就加第二層 CSS；
- 用更高 specificity／`!important` 掩蓋第二 Authority；
- 用 MutationObserver／DOM 掃描補已有 State；
- 為單一尺寸建立第二套 UI；
- 用 Runtime Patch／Hotfix／Compatibility Layer 當永久解法；
- 只因舊測試 Fail 就令 Runtime 倒退返已淘汰架構。

## 3. 目前 SMT 重要 Change Impact 狀態｜2026-07-27

### A. Cart／Order Page

正式 Authority：
- Page Composition：`pages/order/page.css`
- Cart DOM：`pages/order/page.js::cartLineRow/cartSurface`
- Cart Internal Visual：`pages/order/cart.css`
- Cart／Pricing／Service Domain：`pages/order/order-domain.js`
- Adaptive Numeric Token：`shared/adaptive-layout.js` + `shared/adaptive-layout.css`

已知 Migration：
- V1：`page.css` 仍有 Cart legacy internal rules，正式 Authority 已切去 `cart.css`；legacy 只可刪除，不可擴張。
- Marker：`--adaptive-cart-marker = --adaptive-cart-image × 0.9`。
- Adaptive scale 已移除 `rect.height/890` 對 1920 baseline 的二次縮細；1920 應保持 72px image → 64.8px marker 基準，其他尺寸由同一 Adaptive 公式縮放。

高風險影響：
- `cart-row` grid column；
- 外／堂＋序號 Marker；
- Cart image；
- Cart actions／pending／footer；
- 1920 視覺封板與其他 Adaptive profile。

### B. Drink Card

正式 Visual Authority：`pages/order/drink-card.css`

鎖定視覺：
- 名稱區約 10%；
- 圖片區約 90%；
- 圖片本體 70%；
- `object-fit: contain`；
- 完整置中、保留留白、不裁切。

已知 Migration：
- V2：`page.css` 舊 Drink Card selector 仍存在，屬 frozen legacy，只可物理刪除。

### C. Product Card

正式 Visual Authority：`pages/order/product-card.css`

鎖定視覺：
- 卡 footprint 不變；
- Product image 本體 70% × 70%；
- `object-fit: contain`；
- Text／Price 可讀區不得因 literal 10% 被壓到不可讀；目前最少 48px。

已知 Migration：
- V9：`page.css` 舊 Product Card internal rules 仍存在，屬 frozen legacy，只可物理刪除。

### D. Pairing Task Modal

正式 Visual Authority：`pages/order/pairing-modal.css`

鎖定 Contract：
- Modal = flex column；
- Header／Tabs／Footer = `flex:none`；
- Body = `flex:1; min-height:0; overflow-y:auto`；
- Footer 永遠留在 Modal 內可見；
- 指向箭嘴不得因外層 `overflow:hidden` 被剪走。

已知 Migration：
- `page.css` 舊 Pairing selector 仍存在，只可移除／縮減。

### E. Global Shell／Status Actions／Overlay

正式規則：
- Global Status Bar／Bottom Nav 只屬 Global Shell；
- Child page 正式 Runtime 不建立第二套 global chrome；standalone QA 例外；
- Status Actions = render-time Action Descriptor＋固定 Action ID；
- 禁止重新引入 DOM scan／MutationObserver；
- Overlay state = explicit `morefun:overlay-state` 單一真相。

注意：
- 舊 Contract Test 如仍要求 `syncChildStatusActions`／DOM scanner，應更新測試去驗證新 Descriptor Authority；禁止倒退 Runtime。

### F. Adaptive／Responsive

正式規則：
- `shared/adaptive-layout.css` = Token Provider only；
- `shared/responsive-pages.css` = cross-page profile boundary only；
- Page component responsive rules 必須留喺 page-owned responsive／component stylesheet；
- 1920×1080 = 唯一視覺封板模板；其他尺寸係同一 App Adaptive Regression，唔係第二套 UI。

### G. Cache／Build Chain

任何 Component／Adaptive 核心修改都要檢查完整 chain：

`component asset query key → pages/order/index.html → child build query → app-loader BUILD → root index app-loader query key`

目前已知：
- Order `adaptive-layout.js` 已升到 `adaptive-event-v3`；
- `app-loader.js` BUILD 已係 2026-07-27 component-authority 版本；
- root `index.html` 已使用 2026-07-27 loader cache key；
- Service Worker preview/runtime 未註冊，不應將舊畫面問題誤判為 SW cache。

### H. QA／CI

最新已取得嘅機器證據：
- Authority Audit：硬規則 PASS；
- Syntax：PASS；
- Node test suite 曾出現 248 tests / 239 pass / 9 fail；
- 至少兩個 Fail 已確認係舊 Contract Test 仍要求被淘汰嘅 Status Action DOM scanner 架構，屬測試規格漂移，唔應倒退 Runtime；
- 未修到全綠之前，禁止聲稱 Automated QA 全綠；
- Browser QA／實機驗收必須另外記錄。

## 4. 成功做法｜接手優先複用

1. Authority first：先確定唯一責任來源，再改功能。
2. Fresh-read：每次寫入前 fresh-read 正式分支，避免 stale SHA／舊片段誤判。
3. Contract first：對 Authority／Adaptive／DOM order 先建立 Contract，再修 Runtime。
4. Cache chain together：核心 asset 改動必須同步檢查 child／Shell／root cache chain。
5. Strangler migration：大型 legacy 不一次爆改；新 Authority 自足、舊責任凍結、逐組物理移除。
6. Evidence levels 分開：程式存在 ≠ Unit Test PASS ≠ Browser QA PASS ≠ 實機驗收 ≠ 最終 Lock。

## 5. 已證明會浪費時間／禁止重試嘅坑

1. 同一 Component 同時由 `page.css`／component CSS／Adaptive 直接管理。
2. 看到畫面冇變就即刻再加 CSS override。
3. 用 CSS `grid-row`／order 去掩蓋 DOM semantic order 錯誤，而唔先查 DOM Authority。
4. 把 1920 與 1280 拆成兩套 UI／兩套產品分支。
5. 一次過重寫大型 `page.css` 只為架構潔癖。
6. 一次性 QA Driver／Workflow 未確認真正 run 就當作有測試證據。
7. 只睇 commit message／文件敘述，唔 fresh-read 正式分支現碼。
8. 舊 Contract Test 與新 Authority 衝突時，為令 test 綠而倒退 Runtime。

## 6. 下一個接手 AI 開工最短路徑

1. 讀 `AGENTS.md`。
2. 讀本文件 `SMT_CHANGE_IMPACT.md`。
3. 讀 `docs/qa/SMT_ENGINEERING_SUCCESS_AND_PITFALLS_V1.0.md`。
4. 讀最新 `docs/qa/SMT_RUNTIME_PHASE3_QA.md`。
5. 讀 Ownership Registry 對應元件。
6. Fresh-read 真正要改嘅 Runtime／test 檔案。
7. 先修已知 QA Fail／Authority Migration，再新增功能。
8. 完成後同步 GitHub＋Jade Note。
