# SMT Adaptive PWA Window Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 將 SMT 現有 Responsive Engine 收斂成同一套自適應 PWA Window Contract，令 1920×1080、1280×800、平板及手機尺寸只屬驗收 Profile，而唔係獨立 UI 版本。

**Architecture:** 保留現有 Shared Core、Route、State、Store 及 Component Authority。以 `shared/responsive.js` 作唯一視窗分類來源，輸出 `layoutMode`、方向、Window Size Class 及雙欄資格；Shell 與子頁只讀取同一 Contract，禁止整頁 Scale、按型號分流或複製頁面。

**Tech Stack:** 原生 ES Modules、CSS Custom Properties、Node test runner、Playwright、PWA manifest。

## Global Constraints

- 同一功能只保留一套 Business Domain、State／Store、Route Contract、Design Token。
- 1920×1080、1280×800、手機及平板只作驗收矩陣。
- 禁止整頁 `transform: scale()` 適配。
- 禁止以 User-Agent、手機型號或獨立 iframe 尺寸版本分流。
- 每個改動先測試 Contract，再改 Shell／Page Layout。
- 未完成 Browser／Device 驗收不得宣稱自適應完成。

---

### Task 1: 建立唯一 Layout Mode Contract

**Files:**
- Modify: `shared/responsive.js`
- Create: `tests/adaptive-window-contract.test.mjs`

**Interfaces:**
- Consumes: `getWindowSizeClass(width, height)`
- Produces: `getAdaptiveLayoutMode(width, height)`；`getResponsiveProfile()` 新增 `layoutMode`

- [ ] 寫入 1920×1080、1280×800、768×1024、430×932、390×844 測試。
- [ ] 確認測試先失敗。
- [ ] 實作 `compact`／`medium`／`wide`／`expanded` 四種 Layout Mode。
- [ ] 將 `layoutMode` 寫入 root/body dataset。
- [ ] 執行 `npm run qa:node`。
- [ ] Commit：`feat: add adaptive window layout contract`。

### Task 2: 移除直屏硬封鎖

**Files:**
- Modify: `index.html`
- Modify: `app-shell.css`
- Modify: `mobile-profile.css`
- Test: `tests/adaptive-window-contract.test.mjs`
- Test: Playwright responsive matrix

**Interfaces:**
- Consumes: `data-layout-mode`、`data-orientation`、`data-app-profile`
- Produces: Portrait 下仍可操作嘅 compact shell，而唔係隱藏整個 App

- [ ] 寫入 Portrait Shell 可見性驗收。
- [ ] 移除 `#orientation-lock` 作為阻擋層。
- [ ] Compact Portrait 改用可滾動單欄／底部操作模式。
- [ ] 保留方向提示，但提示不可阻止操作。
- [ ] 執行 Browser Matrix。

### Task 3: Shell 與子頁共用同一 Contract

**Files:**
- Modify: `app-loader.js`
- Modify: `shared/responsive.css`
- Modify affected page CSS only where targeted tests prove necessary

**Interfaces:**
- Consumes: `ResponsiveProfile.layoutMode`
- Produces: Shell、Order、Checkout、Orders、Soldout 同步 dataset 及 token

- [ ] Profile signature 加入 `layoutMode`。
- [ ] 子頁套用同一 dataset。
- [ ] CSS 改由 `data-layout-mode` 控制結構；舊 density profile 暫保留作 compatibility token。
- [ ] 確認 resize／orientationchange／visualViewport 更新不重建 State。

### Task 4: PWA 裝置與尺寸驗收

**Files:**
- Modify/Create Playwright responsive acceptance tests
- Update: `ENGINEERING_LOG.md` CURRENT HANDOFF

**Acceptance Matrix:**
- 1920×1080 Landscape：expanded
- 1366×768 Landscape：wide
- 1280×800 Landscape：wide
- 1024×768 Landscape：medium
- 768×1024 Portrait：medium
- 430×932 Portrait：compact
- 390×844 Portrait：compact
- PWA standalone：Safe Area、visualViewport、resize persistence

- [ ] 驗證冇水平溢出、冇遮住 Primary Action。
- [ ] 驗證 Cart／Route／Login State resize 前後不丟失。
- [ ] 驗證 touch target 最少 44×44。
- [ ] 更新 Evidence Level、Rollback、未完成項目。
