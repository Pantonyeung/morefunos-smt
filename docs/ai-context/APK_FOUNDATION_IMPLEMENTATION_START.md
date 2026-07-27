# APK Foundation Implementation Start

狀態：IN PROGRESS / C-LINE

正式決策：D-052。

第一個實作階段：建立 Android 原生 Shell 骨架，採 Kotlin + 單 Activity + WebView；Native 只提供裝置能力，Business Logic 保留於共用 Web／Domain。

首輪 Contract：
- Bridge version/capabilities
- Device/terminal info
- Network status
- Print request/result boundary
- App/Web version diagnostics
- Local verified Web fallback boundary

禁止把 Pricing／Order／Checkout／Business Rule 搬入 Android Native。
