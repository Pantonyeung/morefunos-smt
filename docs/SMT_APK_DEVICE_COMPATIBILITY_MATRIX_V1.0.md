# More Fun SMT｜APK Device Compatibility Matrix V1.0

狀態：CURRENT / FOUNDATION COMPATIBILITY LOCK
日期：2026-07-27

## 目標

使用同一個 SMT APK 支援現場三代 Android POS 裝置，避免主要設備故障時因 Android 版本過舊而無法應急。

## 已知實機基準

| 裝置角色 | 裝置 | Android | API | 定位 | 最低要求 |
|---|---|---:|---:|---|---|
| 災難後備機 | 舊 T2 / 型號畫面顯示 `t1host` | 6.0.1 | 23 | T2S 故障時立即頂替 | 核心點單、訂單、LAN 打印、基本同步必須可用 |
| 主要舊機 | T2S | 9 | 28 | 舊主要／兼容設備 | 完整 SMT 核心流程、打印、同步 |
| 主要新機 | 新 POS | 11 | 30 | 新主要設備 | 完整 SMT 功能及後續增量能力 |

## APK 編譯鎖

- 單一 APK，不為三部機分裂三套 Business Logic。
- `minSdk = 23`。
- `compileSdk = 36`。
- `targetSdk = 36`。
- AndroidX WebKit = `1.15.0`。
- 禁止升到會令 API 23 無法安裝的依賴，除非另有正式決策及替代備機方案。

## WebView / Native Bridge 兼容策略

Android OS 版本只係第一層兼容。T2 是否真實可用，同時取決於裝置實際 System WebView 能否解析 Web Bundle。

### 新版 WebView

優先使用 `WebViewCompat.addWebMessageListener`，只允許 packaged appassets origin。

### 舊版 WebView / Android 6

當 `WEB_MESSAGE_LISTENER` 不支援時，才啟用 `LegacyBridgeAdapter`。

Foundation diagnostic 必須保持舊 WebView 可解析語法；禁止在該入口直接加入會令舊 WebView parse 失敗的 optional chaining、arrow function、`async/await`、`const/let` 等新語法。正式 SMT Web Bundle 之後如使用新語法，必須有明確 transpile / compatibility build 或實機證據證明 T2 WebView 支援，不能只靠 Android API level 推斷。

限制：
- WebView 導航仍只允許 `https://appassets.androidplatform.net`。
- Legacy Bridge 只轉送至同一個 `BridgeProtocol`，不得建立第二套 Business Logic。
- 未實作 capability 不得回報為已支援。
- Android 6 fallback 必須以 T2 實機驗證，不能只靠編譯通過。
- 實機驗收必須記錄 `navigator.userAgent` / WebView 版本證據，供後續決定正式 Web Bundle transpile target。

## 打印兼容要求

三個 Android 基準均應共用 `morefun.print.v1`：
- LAN TCP/IP 打印。
- 真實 `printed` / `failed` 回報。
- `idempotencyKey` 防重複打印。
- Primary / Fallback 路由仍由 Web Print Domain 決定。

Android 6 災難後備模式至少必須支援：
1. 小票機 LAN 打印。
2. 製作單 LAN 打印。
3. 打包單 LAN 打印。
4. 飯團／外賣標籤機 LAN 打印。
5. 打印失敗回報與手動改送後備機。

## 驗收 Gate

### CI
- minSdk 23。
- WebKit 1.15.0。
- Foundation diagnostic legacy WebView syntax gate PASS。
- 唯一正式 diagnostic entry = `assets/smt/index.html`；禁止保留第二個死入口造成 Authority 混亂。
- APK assembleDebug PASS。
- APK artifact 產出。
- Bridge Authority PASS。

### 實機
每個基準裝置必須逐項記錄：
- 安裝成功。
- 啟動成功。
- Kiosk / 橫屏成功。
- Bridge Version / Capabilities 可讀。
- Device / Network status 可讀。
- WebView / user-agent 證據已記錄。
- LAN 純 Transport 測試成功。
- ESC/POS binary 測試成功（適用卷紙機）。
- TSPL binary 測試成功（適用標籤機）。
- 正式 Raster 中文內容正常。
- 切紙／標籤走紙正常。
- 斷線時回報失敗而非假成功。
- 重送同一 idempotencyKey 不重複出紙。

## 未完成聲明

截至建立本文件時，Android 6 / 9 / 11 均未完成正式實機驗收。CI Build PASS 不等於裝機 PASS，不得提早標記 Production Locked。
