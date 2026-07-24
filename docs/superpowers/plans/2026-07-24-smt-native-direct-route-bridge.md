# SMT Native Direct Route Bridge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 讓 1280×800 SMT 真機頁在非 iframe 情況下可以直接往返點餐、訂單、堂食、售罄、更多及結帳頁，同時保留 iPhone 黃框預覽的 iframe 訊息橋接。

**Architecture:** `app-loader.js` 維持為 `/smt-preview/` 專用比例檢查器，不再被視為應用程式路由。`shared/page-bridge.js` 成為唯一導航出口：在 iframe 內向父頁發出 `morefun:navigate`；在真機／頂層頁面以受限路由表直接轉到相對頁面。該 bridge 亦在子頁模組啟動失敗時提供可見錯誤後備畫面。

**Tech Stack:** 原生 JavaScript ES modules、classic browser script、HTML、CSS、Node.js `node:test`；不新增依賴。

## Global Constraints

- 目標尺寸是 Sunmi T2S 原生 `1280×800`；不可復原 1920 畫布、iframe 主路由或 `transform: scale` 工作殼。
- 點單頁保持左購物車、右產品目錄兩主區；快捷飲品只可在產品區內收起／上拉。
- 頂欄、底欄、結帳區固定；內容只在既有內容區內滾動。
- `app-loader.js` 只屬 `/smt-preview/` 的黃框 adapter，不能再承載 SMT 主路由。
- 不接入 Firebase 寫入、Worker、付款、實體打印、APK 或 production 流量。
- 每項程式改動先有失敗測試，最後執行 `node scripts/validate-ai-context.mjs`、`node --test tests/*.test.mjs` 及 `git diff --check`。

---

### Task 1: 將驗證由舊 iframe loader 轉到真機直接路由

**Files:**
- Modify: `tests/order-edit-flow.test.mjs`
- Modify: `tests/dine-page.test.mjs`
- Modify: `tests/more-page.test.mjs`
- Modify: `tests/orders-drafts-ui.test.mjs`
- Modify: `tests/soldout-page.test.mjs`
- Modify: `tests/shell-ui.test.mjs`
- Test: `tests/order-edit-flow.test.mjs tests/dine-page.test.mjs tests/more-page.test.mjs tests/orders-drafts-ui.test.mjs tests/soldout-page.test.mjs tests/shell-ui.test.mjs`

**Interfaces:**
- Consumes: `shared/page-bridge.js` 的 `ROUTE_PATHS`、`navigate(route)`、`morefun:page-runtime-error` 後備能力。
- Produces: 對六個直接頁面、1280 根畫布、iframe 訊息模式及頂層直接轉頁的來源合約。

- [ ] **Step 1: 寫入失敗測試。**

  將所有檢查 `app-loader.js` 的路由 regex 改為讀取 `shared/page-bridge.js`；要求 bridge 包含以下路由：

  ```js
  order:'../order/index.html',
  orders:'../orders/index.html',
  dine:'../dine/index.html',
  soldout:'../soldout/index.html',
  more:'../more/index.html',
  checkout:'../checkout/index.html'
  ```

  對每個主頁要求 `window.MoreFunPageBridge.navigate` 或其封裝 `navigate(route)`，不再只檢查 `window.parent.postMessage`。將根畫布 expectation 由 `#app{width:1920px...}` 改為 `#app{width:1280px;height:800px;min-height:0;overflow:hidden}`。保留錯誤後備測試，但改讀 bridge 檔案而不是 adapter。

- [ ] **Step 2: 執行測試，確認目前因 bridge 未有路由表／直接轉頁而失敗。**

  Run:

  ```bash
  node --test tests/order-edit-flow.test.mjs tests/dine-page.test.mjs tests/more-page.test.mjs tests/orders-drafts-ui.test.mjs tests/soldout-page.test.mjs tests/shell-ui.test.mjs
  ```

  Expected: FAIL；失敗訊息指向缺少 `ROUTE_PATHS`、真機直接導航或新 1280 expectation，而不是語法錯誤。

### Task 2: 建立直接頁面導航與啟動錯誤後備

**Files:**
- Modify: `shared/page-bridge.js`
- Modify: `pages/order/page.js`
- Modify: `pages/orders/page.js`
- Modify: `pages/dine/page.js`
- Modify: `pages/soldout/page.js`
- Modify: `pages/more/page.js`
- Modify: `pages/checkout/page.js`
- Test: Task 1 所列六個測試檔

**Interfaces:**
- Consumes: `window.MoreFunPageBridge.navigate(route)`；route 只接受 `order`、`orders`、`dine`、`soldout`、`more`、`checkout`。
- Produces: 在 iframe 內的 `morefun:navigate` 訊息，或在頂層頁的 `location.href` 導航；`window` error／unhandledrejection 觸發的 `morefun:page-runtime-error` 可見後備。

- [ ] **Step 1: 寫最少 bridge 實作。**

  在 `shared/page-bridge.js` 定義不可變路由表，並用單一 `navigate(route)` 處理兩種執行環境：

  ```js
  const ROUTE_PATHS=Object.freeze({
    order:'../order/index.html',
    orders:'../orders/index.html',
    dine:'../dine/index.html',
    soldout:'../soldout/index.html',
    more:'../more/index.html',
    checkout:'../checkout/index.html'
  });

  function navigate(route){
    const target=ROUTE_PATHS[route];
    if(!target)return false;
    if(parent&&parent!==window){
      parent.postMessage({type:'morefun:navigate',route},'*');
      return true;
    }
    location.href=target;
    return true;
  }
  ```

  保留 `ready()`；以 `window.addEventListener('error', ...)` 及 `window.addEventListener('unhandledrejection', ...)` 在 `#app` 顯示繁中錯誤後備，並發出 `morefun:page-runtime-error`。後備不可假裝成功，必須顯示返回點餐及重新載入入口。

- [ ] **Step 2: 讓所有主頁只經 bridge 導航。**

  每個頁面在初始化位置建立：

  ```js
  const navigate=route=>window.MoreFunPageBridge?.navigate?.(route);
  ```

  將現時直接 `window.parent?.postMessage?.({type:'morefun:navigate',route},'*')`、`location.hash` 或相同本地函數改為上述出口。保留點單頁堂食取消確認、售罄頁活動頁 guard、結帳完成資料流；只替換實際跳頁動作。

- [ ] **Step 3: 將其餘四個主頁 viewport 改為原生尺寸。**

  在 `pages/orders/index.html`、`pages/dine/index.html`、`pages/more/index.html`、`pages/soldout/index.html` 將 meta viewport 的 `width=1920` 改為：

  ```html
  width=1280,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no
  ```

  不改 `pages/order/index.html` 已存在的 1280 設定。

- [ ] **Step 4: 執行 Task 1 測試並確認通過。**

  Run:

  ```bash
  node --test tests/order-edit-flow.test.mjs tests/dine-page.test.mjs tests/more-page.test.mjs tests/orders-drafts-ui.test.mjs tests/soldout-page.test.mjs tests/shell-ui.test.mjs
  ```

  Expected: PASS；所有路由、1280 根畫布、直接導航出口及錯誤後備合約均通過。

### Task 3: 全量回歸、記錄與分支同步

**Files:**
- Modify: `docs/ai-context/SMT_IMPLEMENTATION_STATUS.md`
- Modify: `docs/ai-context/SMT_CODE_MAP.md`
- Modify: `SMT_AI_START_HERE.md`
- Modify: `SMT_CONTEXT_MIN.md`
- Test: `tests/*.test.mjs`

**Interfaces:**
- Consumes: Task 2 的 direct bridge。
- Produces: 指出「程式驗證已通過；iPad／Sunmi T2S 實機仍待驗收」的真實狀態，並讓下個接手者知道 `app-loader.js` 只供預覽。

- [ ] **Step 1: 更新交接文件。**

  將舊「`app-loader.js` 是 route」描述改成「`shared/page-bridge.js` 是真機直接路由；`app-loader.js` 只供 `/smt-preview/` 黃框檢查」。在 status 中記錄實際測試數目，並保留 iPad、Sunmi T2S、APK／硬件／正式 API 待驗收。

- [ ] **Step 2: 執行全量驗證。**

  Run:

  ```bash
  node scripts/validate-ai-context.mjs
  node --test tests/*.test.mjs
  git diff --check
  ```

  Expected: 三個指令均 exit 0；不得只以局部測試取代全量回歸。

- [ ] **Step 3: 建立有意義提交並同步 GitHub 分支。**

  Stage 只包含本計劃內檔案，提交訊息：

  ```bash
  git add shared/page-bridge.js pages tests docs SMT_AI_START_HERE.md SMT_CONTEXT_MIN.md
  git commit -m "fix(smt): restore native direct page navigation"
  ```

  以 GitHub app 對 `Pantonyeung/morefunos-smt` 的 `rebuild30-native-1280-unified` 分支同步相同檔案；不合併 `main`，亦不開 production 發布。

