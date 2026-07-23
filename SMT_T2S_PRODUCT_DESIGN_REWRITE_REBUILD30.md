# SMT T2S 1280×800｜Product Design Rewrite from rebuild30

## 任務定位

今次唔係補丁式修正，而係由 rebuild30 作功能參考，重建一套以 Sunmi T2S 1280×800 橫屏為唯一主尺寸嘅 SMT 介面骨架。

## 已確認問題根源

1. 外層雖然有 1280×800 stage，但舊 app-loader 仍然用 iframe、stage、viewport scale 去模擬畫面，容易造成雙重縮放。
2. shared/page-base.css 舊版仍寫死 1920px，導致各 page 底層同 T2S 目標尺寸不一致。
3. order/index.html 內有大量 inline CSS、!important、MutationObserver、scroll restore、position lock，屬於補丁式修正。
4. order/t2s-1280.css 係後加嘅 T2S 適配補丁，唔應再作為正式架構基礎。
5. checkout、orders、dine、soldout、more 多個入口仍使用 width=1920 或舊版本 query，會拖返舊尺寸系統。
6. 舊 bottom nav 只有五項，缺少「收銀」。

## 新架構

### Root

- index.html 目前作 iPhone 預覽 adapter 入口，用黑底、黃框、縮放控制檢查 1280×800 T2S 邊界。
- adapter 只供手機比例驗收，唔係正式 SMT runtime。
- 正式 SMT 真機入口仍然係 pages/order/index.html。
- 封裝 APK 或正式部署前，必須移除 adapter，將 root 回復為直接進入真機頁，避免 iframe／縮放層進入正式包。

### Shared layout system

- shared/page-base.css 重建為固定 1280×800。
- #app 固定 1280×800。
- .smt-app 固定 1280×800。
- 畫面分為：58px 上方狀態列、主 workspace、74px 底部導航。
- bottom nav 固定六格：點單、收銀、訂單、堂食、售罄、更多。

### Order page

點單頁重建為三欄：

1. 左側產品區：產品分類、搜尋、三欄產品卡。
2. 中間操作流：單源、接單狀態、補選狀態、飲品加購。
3. 右側購物車：餐點、數量、補選、合計、完成／可取餐。

### Modal system

所有彈出操作由同一套 modal layer 管理：

- 必選項
- 飯底選擇
- 小食補選
- 飲品加購
- 甜度冰量
- 售罄管理
- 列印工作
- 完成／可取餐

不再使用逐個 popover 補丁定位。

## iPhone Adapter 使用邊界

- adapter 入口：index.html。
- adapter 用途：只畀 iPhone 橫屏／豎屏查看 1280×800 比例、縮放、黑邊同黃色實際邊界。
- adapter 內部可以使用 iframe 同 scale，因為佢只係驗收工具。
- pages/order/index.html 及其他正式 page 不可以引入 adapter scale。
- 封裝前處理：移除 adapter 或另存到 preview-only 路徑，root 必須改回正式真機入口。

## 已保留嘅磨飯商業邏輯

- 紫米飯團
- 飯團套餐
- 便當
- 小食
- 飲品
- 飯底
- 飲品升級
- F1-F6 產品資料
- 現場外賣、網站單、App 單、WhatsApp 單、電話單、平台單
- 高峰快速操作：少步驟、清楚狀態、大按鈕

## 已改動檔案類型

1. Root shell：index.html、app-loader.js、app-shell.css
2. Shared：shared/page-base.css、shared/shell.js
3. Order：pages/order/index.html、pages/order/page.css、pages/order/page.js、pages/order/t2s-1280.css
4. Main pages：checkout、orders、dine、soldout、more 嘅 index/css/js

## 驗收重點

1. 喺 Sunmi T2S 1280×800 橫屏打開 pages/order/index.html。
2. 檢查無 1920px 殘留於活動入口。
3. 檢查無新增 !important 補丁。
4. 點單流程：揀產品 → 必選補選 → 加入購物車 → 加減數量 → 完成／可取餐。
5. 檢查飲品加購、甜度冰量、飯底、套餐補選是否同一套 modal 層處理。
6. 檢查購物車、產品卡、售罄入口、列印入口不互相遮擋。
7. 檢查底部六格導航可跳轉。
8. 喺 iPhone 打開 root adapter 檢查黑邊、黃框、橫屏／豎屏縮放比例。
9. 封裝 APK 前移除 root adapter，正式包不得包含 iframe 預覽層。

## 後續注意

checkout、orders、dine、soldout、more 現時已改成 1280×800 清潔骨架，避免舊 1920 頁拖垮 shell。正式功能可以逐頁接返，但唔應再複製舊 1920 結構。