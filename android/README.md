# More Fun SMT｜Android APK Foundation

狀態：FOUNDATION / NOT PRODUCTION LOCKED

正式產品決策：`D-052`。
正式計劃：`../docs/SMT_APK_FOUNDATION_DEVELOPMENT_PLAN_V1.0.md`。
裝置兼容矩陣：`../docs/SMT_APK_DEVICE_COMPATIBILITY_MATRIX_V1.0.md`。

## Native 層唯一責任
Android Native 只提供裝置／平台能力：WebView Shell、Bridge capability、Device／Network、Kiosk／Lifecycle、Print、File、Diagnostics、Offline Queue、Verified Web Bundle／Rollback。
禁止將 Order／Pricing／Checkout／Required／Pairing 搬入 Native。

## 目前已實作
- Kotlin 單 Activity Shell。
- `WebViewAssetLoader` 本地 HTTPS-like origin。
- Origin-restricted WebMessage Bridge；Android 6 舊 WebView 受限制 Legacy fallback。
- `device.getInfo`、`network.getStatus`。
- `print.lan.tcp`：TCP binary/text output、真實結果、idempotency ledger。
- Verified Web Bundle Store：SHA-256、Bridge compatibility、staging install。
- Version Vault：current + N-1 + N-2 + APK factory fallback。
- Health-confirm／unhealthy restart 自動 rollback。
- SQLite Offline Queue：enqueue、pending、complete、failed、retry、status。
- File import／export、runtime reload、Kiosk control、diagnostics（Host 能力存在時）。
- Debug APK CI build／artifact 基礎。

## 裝置兼容基準
同一 APK 必須覆蓋：
- T2：Android 6.0.1 / API 23（最低災難後備）。
- T2S：Android 9 / API 28。
- 新 POS：Android 11 / API 30。

`minSdk = 23`；AndroidX WebKit 固定 `1.15.0`。

## 打印責任邊界
- Web Print Domain 決定 document、template、route、Primary／Fallback、retry。
- Native 只按 payload 送指定 target／bytes，唔自行改路由或重算模板。
- 成功後先回 `printed`；成功 idempotencyKey 重送會 suppress duplicate。

## 尚未完成
- T2／T2S／Android 11 三機實機 Gate。
- LAN 實體打印機中文／走紙／切紙／標籤驗收。
- Sunmi 真實打印。
- Web Printer Settings → Native Bridge 正式接線。
- 正式 SMT Web Runtime Bootstrap／Bundle release source。
- Signed release manifest／下載來源驗證。
- 更新後完整 health-check handshake 實機驗收。

未完成 capability 不得誤報；已宣告 capability 必須有對應實作及 CI Contract。

## CI Build
Base workflow：`.github/workflows/apk-foundation-contract.yml`
工具鏈：JDK 17、Gradle 9.5.0、AGP 9.3.0、compileSdk/targetSdk 36、Build Tools 36.0.0、minSdk 23、WebKit 1.15.0。

成功標準：`gradle -p android :app:assembleDebug` PASS 並產生 APK artifact。
CI Build PASS 只代表可編譯；未有實機證據前不得標 Production Lock。
