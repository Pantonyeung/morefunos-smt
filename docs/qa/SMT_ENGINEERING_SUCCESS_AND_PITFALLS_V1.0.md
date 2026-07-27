# SMT Engineering Success & Pitfalls V1.0

> 狀態：CURRENT / HANDOFF REQUIRED
> 目的：保存已證明有效的工程方法與踩坑紀錄，降低下一個 AI／Codex／工程師重新試錯成本。

## 1. 成功基準

### 1.1 Authority Model
同一 Component 可以跨 Page／Component／Domain／Adaptive／Shell 多層存在，但同一項決策只可以有一個唯一 Authority。

- Page：Composition／外部位置。
- Component：Internal Visual／Interaction Visual。
- Domain：State／Business Truth。
- Adaptive：Token／Profile／Available Area；不得直接重畫 Component。
- Shell：Global Chrome／Route／Transaction。

### 1.2 已證明有效的 Debug 順序
遇到「改咗但畫面冇變」時，固定依次檢查：

1. DOM 真實結構；
2. Component / Page / Shared Authority；
3. CSS selector chain / specificity；
4. Adaptive Token 實際 runtime value；
5. JS 是否再次寫入 inline style / token；
6. Component asset cache key；
7. child page `index.html` cache key；
8. Shell iframe BUILD key；
9. root loader cache key；
10. QA report / browser evidence。

禁止第一步就加新 override。

## 2. 已成功解決的關鍵問題

### S-01｜Global Status Actions
舊：child DOM scan / MutationObserver。
新：render-time Action Descriptor + stable action id。
結果：Shell 只渲染 descriptor，Page 保持 action truth。

### S-02｜Global Overlay
舊：Page state + Shell DOM observer 雙真相。
新：explicit `morefun:overlay-state` message。
結果：Overlay state 單一 truth source。

### S-03｜Child Global Chrome
正式嵌入 Global Shell 時，child page 不再建立第二套 Top Bar / Bottom Nav；standalone QA 才可建立兼容 chrome。

### S-04｜Adaptive / Responsive Ownership
- `shared/adaptive-layout.css` 已收口成 Token Provider。
- `shared/responsive-pages.css` 已收口成 profile boundary。
- Orders／Dine／Soldout／More 的 component responsive 決策回到各自 page-owned CSS。

### S-05｜Drink Card
正式 Visual Authority = `pages/order/drink-card.css`。
規則：名稱區約 10%；圖片區約 90%；圖片本體約 70%；`object-fit: contain`；完整顯示，不裁切。

### S-06｜Product Card
正式 Internal Visual Authority = `pages/order/product-card.css`。
大圖卡 footprint 不變；文字區保留最少 48px；產品圖約 Hero stage 70%；`contain`。

### S-07｜Cart Marker Adaptive Scale
舊 Adaptive 使用 `Math.min(rect.width/610, rect.height/890)`，Global Shell 扣高度後會令 1920 baseline 再被二次縮細。
新：viewport scale + cart width scale；禁止以 cart height 二次縮細 1920 baseline。
Marker 永遠由 Cart Image × 0.9 派生。

### S-08｜Permanent QA
永久 QA 已由舊的 report-only 流程升級：
- Ownership Audit；
- Node contract tests；
- Syntax checks；
- Responsive Playwright browser matrix；
- final hard gate 必須 `RESULT=PASS`。

最近 Node/Authority/Syntax baseline：248/248 PASS。

## 3. 踩坑紀錄

### K-01｜Selector 與 DOM 不一致
曾將 selector 當成圖片內層，但真實 class 在 image shell；規則完全打不中。
**規則：先 fresh-read DOM renderer，再寫 selector。**

### K-02｜Generic child selector 誤傷 image container
例如 `.drink-choice-card > span` 同時命中名稱與 image shell，會將圖片容器壓細。
**規則：reusable component 必須有明確 child namespace。**

### K-03｜多重 Authority
Cart 曾由 `page.css + cart.css + adaptive-layout.css` 同時決定 geometry。
**規則：發現第二 Authority，STOP；先 consolidation。**

### K-04｜Cache chain 不完整
只 bump component CSS key 不足夠；child HTML／Shell iframe BUILD／root loader 任何一層停留舊版本，都可能令人以為修改無效。
**規則：逐層 fresh-read asset chain。**

### K-05｜一次性 Workflow ≠ 已執行
曾新增 QA workflow 但 GitHub trigger/default-branch 行為令它沒有真正 run。
**規則：未見 run/report/artifact evidence，不得寫「測試完成」。**

### K-06｜過度追求一個元件一個檔案
會增加大檔搬遷風險。
**規則：Ownership ≠ File Ownership；追求 single decision authority。**

### K-07｜1920 / 1280 分支思路錯誤
SMT 是單一 Adaptive codebase；1920 是視覺模板，1280 是同一 Runtime profile。
**規則：禁止為尺寸建立第二套產品 UI／第二套 business logic。**

### K-08｜Stale Test 不應迫 Runtime 倒退
舊 tests 曾要求 MutationObserver、Shared direct selectors、固定 60px badge。
**規則：先判斷 test 是否仍代表 Current Lock；不可為了綠燈恢復已淘汰架構。**

### K-09｜Fixed Pixel Contract 與 Adaptive 衝突
例如固定 60px marker 會阻礙跨尺寸同一公式。
**規則：優先鎖 Token、比例、可讀性下限、viewport boundary。**

### K-10｜聊天／舊 report／commit 描述會漂移
曾用舊片段誤判 Shell BUILD 未更新。
**規則：任何根因判斷前 fresh-read 正式 branch 現碼。**

### K-11｜Shared Component Ownership 回流
More／Soldout 已移到 page-owned responsive/adaptive 後，舊 tests 仍查 Shared selector。
**規則：Contract 必須同時驗證新 Owner 存在＋Shared 舊 Owner 不存在。**

### K-12｜有 Playwright spec 不等於 Browser QA
Repo 可以有 `.spec.js` 但冇 dependency/browser/server/workflow，實際完全冇跑。
**規則：Browser tested 必須有 install + server + workflow + report/artifact evidence。**

### K-13｜Report FAIL 但 Workflow 可能綠
`set +e` 只寫 `RESULT=FAIL` 而不 exit，GitHub status 會失真。
**規則：QA 必須有 final hard gate。**

### K-14｜QA Workflow 本身亦要 Single Authority
不可兩條 workflow 同時管理同一 Browser Matrix。
**規則：正式 browser QA 只歸 `qa-runtime-phase3.yml`。**

### K-15｜舊 PASS Report 不等於最新 HEAD PASS
正式 branch 可以在最後一份 QA report 之後繼續前進；如果接手者只見到 `RESULT=PASS` 而冇比較 report 內的 `Commit:` 與目前 branch HEAD，會將未驗證的新改動誤當已通過。
**規則：任何「最新 QA 已通過」聲明前，必須確認 `QA report Commit == 當前驗證目標 commit / branch HEAD`；不一致時只能寫「舊 baseline PASS／新改動待驗」。**

## 4. 當前 Migration Debt

- V1 Cart legacy rules in `pages/order/page.css`：只可刪，不可再改。
- V2 Drink Card legacy rules in `pages/order/page.css`：只可刪。
- V9 Product Card legacy rules in `pages/order/page.css`：只可刪。
- Pairing Modal legacy rules in `pages/order/page.css`：只可刪／縮減。

以上 legacy debt 不可用：
- 更高 specificity；
- `!important`；
- runtime JS patch；
- MutationObserver；
- resolution-specific second UI；
來假裝完成。

## 5. 下一個接手者開始前

必須先確認：
1. `AGENTS.md`；
2. `docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md`；
3. 本文件；
4. 最新 `docs/qa/SMT_RUNTIME_PHASE3_QA.md`；
5. 正式 branch = `smt-functional-completeness-v1`；
6. fresh-read 正式 Runtime，不依賴聊天摘要取代現碼；
7. QA report 內 `Commit:` 必須與本次驗證目標對齊，否則不得把舊 PASS 當最新 PASS。
