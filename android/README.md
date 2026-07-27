# More Fun SMT｜Android APK Foundation

狀態：FOUNDATION / NOT PRODUCTION LOCKED

正式產品決策：`D-052`。
正式計劃：`../docs/SMT_APK_FOUNDATION_DEVELOPMENT_PLAN_V1.0.md`。

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
- Origin-restricted WebMessage Bridge。
- `bridge.getVersion`。
- `bridge.getCapabilities`。
- `device.getInfo`。
- `network.getStatus`。
- `print.lan.tcp`：背景 TCP Socket 實際寫入、完成後回報、成功 idempotency ledger。
- 本地 Bridge diagnostic page。
- Debug APK CI build + artifact。

## 打印責任邊界

- Web Print Domain 決定 document、template、printer route、Primary／Fallback、retry。
- Android Native 只執行 payload 指定的 TCP target 及 bytes output。
- Native 成功後才回 `printed`；連線／寫入失敗回錯誤，禁止將 queued 當 printed。
- 已成功的 `idempotencyKey` 重送時回既有 printed 結果並 suppress duplicate，避免重複出紙。
- Native 不自行揀後備打印機；Failover 仍由 Web Print Domain 決定。

## 尚未完成

- LAN 實體打印機驗收（包括中文、走紙／切紙及不同機型）。
- Sunmi 真實打印。
- Web Printer Settings → Native Bridge 正式接線。
- Offline Web bundle release management。
- Signed／verified update channel。
- Rollback。
- File import／export bridge。
- Real-device acceptance。

未完成能力不得出現在 `bridge.getCapabilities()`。

## CI Build

Base branch workflow：`.github/workflows/apk-foundation-contract.yml`

穩定工具鏈：
- JDK 17
- Gradle 9.5.0
- Android Gradle Plugin 9.3.0
- compileSdk / targetSdk 36（Android 16 stable）
- SDK Build Tools 36.0.0
- minSdk 26

成功標準：
`gradle -p android :app:assembleDebug` 完成，而且產生 `android/app/build/outputs/apk/debug/app-debug.apk` artifact。

CI 另外硬性驗證 Native Bridge Authority：只可有一套 MainActivity、禁止 `addJavascriptInterface`、未完成 capability 不得誤報。

CI Build PASS 只代表 APK 可編譯；不等於已安裝、Bridge 實機通過、打印實機通過或 Production Lock。
