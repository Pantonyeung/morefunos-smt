# More Fun SMT Intuitive UI Slice 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 把現有 SMT Web Core 的 SMT-00 至 SMT-05 推進為全繁體中文、閱讀性強、第一次使用也能自然完成點單的新操作切片，同時保留所有已鎖定商業規則。

**Architecture:** 保持 Cloudflare Pages 可直接部署的純 HTML/CSS/ES Modules 架構，不引入打包器或前端框架。把單一 `app.js` 拆成資料、文案、狀態、業務函數、圖標、動效、視圖及啟動層；業務與狀態轉換使用純函數並以 Node 內建測試驗證。

**Tech Stack:** HTML5、CSS Custom Properties、Vanilla JavaScript ES Modules、Node.js `node:test`、inline SVG、PWA Service Worker、Cloudflare Pages。

## Global Constraints

- 所有介面、按鈕、提示、狀態、錯誤及空白畫面只使用繁體中文。
- 主導航固定：點單｜訂單｜堂食｜售罄｜更多。
- 一般模式觸控面積至少 48×48px；快速模式至少 56×56px。
- 正文至少 16px；次要說明至少 14px；金額、流水、倒數及待處理數量為 20–32px。
- 正式圖標至少 22px；導航與狀態圖標以 24–28px 為主。
- 核心操作不得只顯示圖標、英文或縮寫。
- 重要狀態必須同時提供圖標、短文字及語義色。
- 不以 Unicode 符號冒充正式圖標。
- Required 未完成才阻塞落單；一般備註、電話、稱呼及外部參考號不得阻塞。
- 正式接受或「先製作」後才建立流水、Print Job 及 30 分鐘計時。
- 暫存不派流水、不打印、不啟動計時。
- 「稍後處理」後待處理角標仍保留。
- 保存、離線、打印或同步失敗不得清空購物車。
- 動效只回答「按到了嗎、改了甚麼、結果去哪裡」。
- `prefers-reduced-motion` 必須有完整降級。
- 第一切片不接 Firebase、Worker、SQLite、真實付款核實或實體打印機。

## File Map

- `index.html`：語言、meta、無障礙入口與模組啟動。
- `app.js`：boot、render 排程與事件委派。
- `smt-data.js`：產品、分類與展示資料。
- `smt-copy.js`：所有可見繁體中文文案。
- `smt-domain.js`：購物車、Required、付款及成單純函數。
- `smt-state.js`：state schema、migration、reducer、storage。
- `smt-icons.js`：inline SVG 圖標。
- `smt-motion.js`：按壓、加入、Toast、Drawer、Reduced Motion。
- `smt-views.js`：SMT-00 至 SMT-05 view functions。
- `styles.css`：輕日系 Token、閱讀性、Responsive、Motion。
- `tests/*.test.mjs`：domain、state、copy/readability、smoke tests。
- `docs/qa/smt-slice-1-manual-checklist.md`：平板橫屏與高峰驗收。

## Task 1 — Testable ES-module baseline

- 建立 `package.json`，使用 `node --test tests/*.test.mjs`，不加入第三方 dependency。
- `index.html` 加入 `#live-region`、skip link、`zh-HK` 與繁體中文標題。
- 建立八個可 import 的模組 shell。
- 驗證：`npm test`、`node --check app.js`。
- Commit：`chore: establish testable SMT module baseline`。

## Task 2 — Traditional Chinese copy and formal icons

- 所有可見文案集中在 `smt-copy.js`。
- 建立 `flattenCopy()` 與靜態掃描，拒絕空文案和常見簡體字。
- 建立 `smt-icons.js` inline SVG registry，核心圖標有 `aria-label` 或配對文字。
- 禁止舊有 `▣ ▤ ♨ ⊠ ♧ ⌁ ◷ ▦ ◉` 偽圖標。
- Commit：`feat: lock Traditional Chinese copy and accessible icons`。

## Task 3 — Cart, Required and safe order domain

Required interfaces:

```js
export function addCartItem(cart, product, options = {})
export function changeCartItemQuantity(cart, lineId, delta)
export function removeCartItem(cart, lineId)
export function updateCartItemOptions(cart, lineId, options)
export function getCartSummary(cart)
export function getRequiredState(cart)
export function incrementOrderNumber(current)
export function createLocalOrder({state, now, nextOrderNumber, persist})
```

Tests must prove:
- Same configured item increments quantity without mutation.
- Different options create different CartItem rows.
- Sold-out or paused products cannot be added.
- Quantity cannot fall below one.
- Required missing blocks checkout.
- `P0056` increments to `P0057` rather than staying fixed.
- Persistence failure keeps cart and checkout data.
- Commit：`feat: extract SMT cart and safe order domain rules`。

## Task 4 — Versioned state and reducer

Required state:

```js
{
  schemaVersion: 2,
  page: 'order',
  quickMode: false,
  online: true,
  currentOrderNumber: 'P0056',
  category: '全部',
  search: {open: false, query: ''},
  cart: [],
  checkout: {
    source: 'walk-in', mode: 'takeaway', packaging: 'standard',
    discount: null, paymentMethod: null, optionalOpen: false, note: ''
  },
  orders: [], incomingOrders: [],
  incomingBatch: {visible: false, reminderRequired: false},
  overlay: null, toast: null, undo: null
}
```

Tests must prove:
- Search opening leaves query as empty string, not a space.
- Payment choice is stored.
- Later processing keeps order pending.
- Legacy unversioned storage migrates safely.
- Commit：`feat: add versioned SMT state and persistent checkout choices`。

## Task 5 — SMT-00 readable shell

- Top bar reading order：品牌與在線狀態 → 當前流水與待處理 → 時間與狀態中心。
- Bottom nav remains five fixed equal-width items with SVG + Traditional Chinese label.
- `styles.css` tokens:

```css
--color-bg: #f7f3ed;
--color-surface: #fffdf9;
--color-ink: #2d241f;
--color-muted: #6f625a;
--color-line: #ddd3c9;
--color-primary: #d96d30;
--touch: 48px;
--text-xs: 14px;
--text-sm: 16px;
--text-md: 18px;
--text-lg: 24px;
--text-xl: 32px;
```

- 1024px 橫屏使用 30% 購物車／70% 商品區。
- `app.js` 使用單一事件委派和 `requestAnimationFrame` render 排程。
- Commit：`feat: build readable SMT shell and navigation`。

## Task 6 — SMT-02 intuitive order page

- 商品卡閱讀順序固定：代碼 → 名稱 → 價格 → 圖片 → 狀態／數量。
- 圖片使用固定比例、`object-fit: cover` 與文字 fallback。
- 商品按下 70–100ms 觸控回饋；加入後卡片、購物車行與總額有明確結果。
- 售罄／暫停保留原位置並顯示完整文字。
- 搜尋入口不令商品區大幅跳位。
- 購物車 footer 固定；空白顯示「先由右邊選擇餐點」。
- Required 未完成顯示「先整理 · 尚欠 N 項」。
- 移除商品提供五秒復原。
- Commit：`feat: add intuitive product and cart interactions`。

## Task 7 — SMT-03 Required and product drawer

- 使用右側 Drawer，左側購物車保持可見。
- 頂部固定商品、價錢與完成度；底部固定取消與確認。
- Required 永遠第一，顯示「尚欠 N」「已完成」，不用 technical key。
- 修改 CartItem 只更新該行，不重排其他項目。
- Drawer 支援鍵盤 focus、關閉後返回觸發位置。
- Commit：`feat: add readable Required and product drawer flow`。

## Task 8 — SMT-04 checkout

- 決策順序：來源 → 用餐方式 → 包裝 → 優惠 → 付款 → 其他資料（可選） → 確認。
- 付款選中同時顯示勾選、文字、描邊與淡底色。
- 未選付款時確認鍵 disabled。
- 總額固定靠近確認鍵。
- 確認時顯示「正在安全保存…」。
- 成功後才清空購物車；失敗顯示「訂單內容已保留，請重試」。
- Commit：`feat: add safe readable checkout flow`。

## Task 9 — SMT-05 incoming-order batch

- 同一批新單只顯示一個摘要 Dialog。
- 固定兩個行動：「稍後處理」「查看及處理」。
- 稍後處理只關閉 Dialog，不改 pending 狀態，角標保留。
- 查看不建立正式流水；只有接受／先製作才成為正式訂單及啟動 30 分鐘。
- 新批次只播放一次提示／震動，未處理狀態以固定角標維持。
- Commit：`feat: add non-blocking incoming order batches`。

## Task 10 — Release gates

Automated gates:
- 所有模組可 import 且通過 `node --check`。
- 文案沒有簡體字、空字串或只圖標核心行動。
- CSS 存在 14px／16px／48px／56px／24px 最低標準。
- runtime 不含舊 Unicode 偽圖標。
- Service Worker cache 包含所有 ES modules 並使用新版本。

Manual gates:
- 1024×600 與 1280×800 橫屏不需放大即可閱讀。
- 商品名稱、價格、圖片和售罄文字不互相遮蓋。
- 圖片失效顯示文字 fallback。
- 保存失敗不清購物車。
- 稍後處理新單後角標仍保留。
- Reduced Motion 下狀態仍完整清楚。

Final commands:

```bash
npm test
node --check app.js
node --check smt-data.js
node --check smt-copy.js
node --check smt-domain.js
node --check smt-state.js
node --check smt-icons.js
node --check smt-motion.js
node --check smt-views.js
python3 -m http.server 8080
```

Commit：`test: add SMT readability and PWA release gates`。

## Support artifacts

- Figma 維護 Token、Typography、Icon、Components 及狀態參考；目前連接 seat 為 View，權限失敗不得阻塞 Web Core。
- Remotion 只在 Slice 1 穩定後輸出短 motion-reference clip，不進 production bundle。
- Status Centre 與日後報表遵守 operational visualization：live state first、控制貼近受影響資料、離線／延遲狀態明確、不做等權重卡片牆。

## Scope Review

本計畫覆蓋 SMT-00、02、03、04、05、全繁體中文、文字／圖片／圖標閱讀性、動效、Reduced Motion、離線保存與 PWA。SMT-06 至 SMT-16、Firebase、Worker、SQLite、真實打印及付款核實不在第一切片內。
