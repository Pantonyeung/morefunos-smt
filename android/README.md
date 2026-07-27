# More Fun SMT｜Android APK Foundation

狀態：FOUNDATION / NOT PRODUCTION LOCKED

正式產品決策：`D-052`。
正式計劃：`../docs/SMT_APK_FOUNDATION_DEVELOPMENT_PLAN_V1.0.md`。
裝置兼容矩陣：`../docs/SMT_APK_DEVICE_COMPATIBILITY_MATRIX_V1.0.md`。

## Native 層唯一責任

Android Native 只提供裝置／平台能力：
- WebView App Shell；
- Bridge version／capability discovery；
- Device／Terminal identity；
- Network status；
- Kiosk／lifecycle；
- Print／File／Diagnostics／Update bridge。

禁止將 Order／Pricing／Checkout／Business Rule 搬入 Native。

## 目前已實作

- Kotlin 單 Activity Shell。
- `WebViewAssetLoader` 本地 HTTPS-like origin。
- 新版 WebView：Origin-restricted WebMessage Bridge。
- 舊版 WebView：只在 `WEB_MESSAGE_LISTENER` 不支援時啟用受限制 `LegacyBridgeAdapter`；WebView 仍只容許 packaged appassets origin。
- `bridge.getVersion`。
- `bridge.getCapabilities`。
- `device.getInfo`。
- `network.getStatus`。
- `print.lan.tcp`：背景 TCP Socket 實際寫入、完成後回報、成功 idempotency ledger。
- 本地 Bridge diagnostic page。
- Debug APK CI build + artifact。

## 裝置兼容基準

同一 APK 必須覆蓋：
- 最低災難後備：舊 T2，Android 6.0.1 / API 23。
- 主要舊機：T2S，Android 9 / API 28。
- 主要新機：新 POS，Android 11 / API 30。

`minSdk = 23`。AndroidX WebKit 固定 `1.15.0`，避免 1.16.0 將最低 SDK 提高到 API 24 而令舊 T2 無法安裝。

Android 6 屬災難後備模式：核心點單、訂單、LAN 打印、基本同步必須可用；進階新系統能力可由 capability detection 降級，但不可令核心 POS 流程失效。

## 打印責任邊界

- Web Print Domain 決定 document、template、printer route、Primary／Fallback、retry。
- Android Native 只執行 payload 指定的 TCP target 及 bytes output。
- Native 成功後才回 `printed`；連線／寫入失敗回錯誤，禁止將 queued 當 printed。
- 已成功的 `idempotencyKey` 重送時回既有 printed 結果並 suppress duplicate，避免重複出紙。
- Native 不自行揀後備打印機；Failover 仍由 Web Print Domain 決定。

## 尚未完成

- T2 Android 6.0.1 實機安裝／Bridge／LAN 打印驗收。
- T2S Android 9 實機驗收。
- 新 POS Android 11 實機驗收。
- LAN 實體打印機驗收（包括中文、走紙／切紙及不同機型）。
- Sunmi 真實打印。
- Web Printer Settings → Native Bridge 正式接線。
- Offline Web bundle release management。
- Signed／verified update channel。
- Rollback。
- File import／export bridge。

未完成能力不得出現在 `bridge.getCapabilities()`。

## CI Build

Base branch workflow：`.github/workflows/apk-foundation-contract.yml`

穩定工具鏈：
- JDK 17
- Gradle 9.5.0
- Android Gradle Plugin 9.3.0
- compileSdk / targetSdk 36（Android 16 stable）
- SDK Build Tools 36.0.0
- minSdk 23
- AndroidX WebKit 1.15.0

成功標準：
`gradle -p android :app:assembleDebug` 完成，而且產生 `android/app/build/outputs/apk/debug/app-debug.apk` artifact。

CI 另外硬性驗證 Native Bridge Authority：只可有一套 MainActivity；Legacy JS interface 只可作 Android 6／舊 WebView fallback；未完成 capability 不得誤報。

CI Build PASS 只代表 APK 可編譯；不等於已安裝、Bridge 實機通過、打印實機通過或 Production Lock。
