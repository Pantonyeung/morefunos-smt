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
- 後續 Print／File／Diagnostics／Update bridge。

禁止將 Order／Pricing／Checkout／Business Rule 搬入 Native。

## 目前已實作

- Kotlin 單 Activity Shell。
- `WebViewAssetLoader` 本地 HTTPS-like origin。
- Origin-restricted WebMessage Bridge。
- `bridge.getVersion`。
- `bridge.getCapabilities`。
- `device.getInfo`。
- `network.getStatus`。
- 本地 Bridge diagnostic page。

## 尚未完成

- LAN TCP/IP 真實打印。
- Sunmi 真實打印。
- Print result callback／Idempotency persistence。
- Offline Web bundle release management。
- Signed／verified update channel。
- Rollback。
- File import／export bridge。
- Real-device acceptance。

未完成能力不得出現在 `bridge.getCapabilities()`。

## CI Build

Base branch workflow：`.github/workflows/apk-foundation-contract.yml`

環境：
- JDK 17
- Gradle 9.5.0
- Android Gradle Plugin 9.3.0
- compileSdk / targetSdk 37
- minSdk 26

成功標準：
`gradle -p android :app:assembleDebug` 完成，而且產生 `android/app/build/outputs/apk/debug/app-debug.apk` artifact。

CI Build PASS 只代表 APK 可編譯；不等於已安裝、Bridge 實機通過、打印通過或 Production Lock。
