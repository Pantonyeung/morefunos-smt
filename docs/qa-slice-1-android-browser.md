# More Fun／磨飯 SMT Slice 1｜Android Browser QA 報告

日期：2026-07-18  
分支：`feat/smt-intuitive-ui-slice-1`  
範圍：SMT-00 至 SMT-05

## 結論

本輪 Web Core 自動測試、JavaScript 語法檢查、Android 觸控視窗替代驗證及 PWA Release Gate 全部通過。由於目前執行環境沒有 `adb`、Android SDK 或 Android Emulator，本報告不把 Chromium Android 模式當成真正 Sunmi T2s／Android 實機證據；正式合併 `main` 前仍需在 Sunmi T2s 或可用 Android Emulator 執行 `android-qa/run-sunmi-t2s-qa.sh`。

## 自動測試

- Node `node:test`：44 項通過、0 項失敗。
- `node --check`：`app.js`、所有 `smt-*.js`、`service-worker.js` 全部通過。
- Android QA shell：`bash -n android-qa/run-sunmi-t2s-qa.sh` 通過。

測試覆蓋：

- 全繁體中文文案與核心動詞。
- 正式 SVG 圖標及可讀標籤。
- 商品加入、不同選項分行、數量、移除及復原。
- Required 未完成阻塞正式結帳。
- 流水號由 `P0056` 正確遞增至 `P0057`。
- 付款選擇持久化。
- 保存失敗保留購物車、付款及備註狀態。
- 新單「稍後處理」仍維持 pending 與角標。
- 48px 觸控下限、14px 次要字、16px 正文及大型 T2s 閱讀性。
- 結帳 footer 固定可見。
- Reduced Motion 降級。
- Service Worker cache 版本及 Runtime modules。
- 收銀核心不依賴 OpenAI API key。

## Android／觸控替代驗證

使用 Android 9 WebView User-Agent、touch 模式及下列橫屏視窗：

| 視窗 | 觸控小於 48px | 小於閱讀下限文字 | 文件橫向溢出 | 圖片失效替代 | JavaScript 錯誤 |
|---|---:|---:|---:|---:|---:|
| 1024×600 | 0 | 0 | 無 | 16／16 | 0 |
| 1280×800 | 0 | 0 | 無 | 16／16 | 0 |
| 1920×1080 | 0 | 0 | 無 | 16／16 | 0 |

另外驗證：

- Required Drawer 顯示「尚欠飯底」，選擇後可保存。
- 結帳內容可獨立捲動，底部總額及「確認落單」保持在畫面內。
- 選擇現金後有文字、勾選、描邊及底色四重狀態。
- 完整流程：F4 → B1 → 肉燥飯 → 結帳 → 現金 → 確認落單。
- 成功結果：建立 `P0056`、下一流水為 `P0057`、成功後才清空購物車。

## 本輪修正

1. 所有核心按鈕觸控區調整至至少 48px；快速模式為 56px。
2. 商品熱門角標及導航角標提升至 14px。
3. 結帳 Drawer 修正為 `auto minmax(0, 1fr) auto`，避免 footer 被內容推走。
4. 1920×1080 加入大型裝置字級、圖標、觸控及間距規則。
5. 商品圖片載入失敗時顯示「餐點圖片暫未提供」，不留破圖圖標。
6. Service Worker cache 升級至 `morefun-smt-slice1-v2`。
7. 最終可讀性修正獨立放在 `slice1-readability-fixes.css`，避免改動既有版面規則。

## 尚未完成的正式裝置證據

- Sunmi T2s 冷啟動、背景恢復及 WebView 實測。
- 實際 Android 48dp 對應不同 density 的量測。
- UI Automator hierarchy、Logcat、Window／Activity dumpsys。
- APK 全屏、安全區、系統導航列及自動啟動。
- 真實內置收據機及網口打印機。

上述項目屬合併 `main` 前的 Device Gate，不影響目前獨立分支及 Preview 驗收。
