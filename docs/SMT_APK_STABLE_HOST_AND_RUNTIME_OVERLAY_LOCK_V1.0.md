# More Fun SMT｜Stable Android Host × Runtime Overlay Lock V1.0

狀態：LOCKED ARCHITECTURE / C-LINE

## 1. 核心決策

SMT Android APK 分為兩層，而且責任不可混合：

### A. Stable Physical Host（固定實體機基座）

一次完成、低頻改動、隨 APK 發佈：

- Android Shell／WebView Runtime Host
- Versioned Native Bridge／Capability Discovery
- Device／Terminal Identity
- Network／Lifecycle／Kiosk
- Offline Queue／Crash Recovery
- Verified Web Bundle Install／Health Gate／Rollback
- Printer Transport（LAN／Sunmi／USB 等）
- Printer Device Settings
- File Import／Export
- Diagnostics／Support Export
- App Update／Signing／Production Lock

此層禁止包含 Order、Menu、Pricing、Checkout、Pairing、Required Rules 或任何業務頁面邏輯。

### B. Replaceable SMT Web Runtime（可疊加更新業務層）

經簽署 Web Bundle 更新，不重新安裝 APK：

- 點單頁
- 訂單頁
- 待處理頁
- 產品卡／購物車／快捷飲品
- 設定頁 UI
- 業務流程、顯示及互動
- Printer Settings UI（只透過 Bridge 讀寫 Host 設定）

更新流程必須為：下載 → 驗簽 → Bridge 兼容檢查 → staging → reload → health confirm → current；失敗則自動回滾 N-1／N-2／factory fallback。

## 2. 打印方向鎖定

每部實體機、每個 printerId 可獨立設定：

- `forward`：正向
- `reverse`：反向／180°

設定儲存在 Native device preferences，Web Runtime 更新、回滾或清 cache 不會清除。

Bridge：

- `print.settings.get`
- `print.settings.set`
- `print.lan.tcp`

`print.lan.tcp` 解析順序：

1. Print job 明確 `paperDirection` override
2. 本機對應 `printerId` 設定
3. 預設 `forward`

禁止把 raw ESC/POS bytes 倒序。反向模式由 Native 以 ESC/POS `ESC { n` 包裝，打印完成後必須恢復正向，避免污染下一張單。

## 3. Printer ID

Printer Settings UI 必須使用穩定 printerId；建議：

- `receipt-main`
- `kitchen-1`
- `kitchen-2`
- `label-1`
- `label-2`
- `sunmi-built-in`

未提供 printerId 時，LAN transport 暫以 `host:port` 作 fallback identity；Production Lock 前必須由後台完成穩定映射。

## 4. 不可破壞條件

- Web Runtime 不可直接使用 Android SDK 或保存硬件真相。
- Native 不可重新計價、改訂單、選打印路由或修改業務模板。
- Native 只執行已驗證 payload，回傳真實成功／失敗。
- 每個打印工作必須有 idempotencyKey。
- 所有 Native capability 必須可由 `bridge.getCapabilities` 發現。
- 新 Web Bundle 必須聲明 bridgeMin／bridgeMax。

## 5. C 線完成 Gate

- Gradle debug/release build PASS
- APK install PASS：Android 6／9／11
- Runtime overlay install／rollback PASS
- LAN TCP real print PASS
- Sunmi built-in real print PASS
- 正向／反向各打印 PASS
- 中文、圖片、走紙、切紙、標籤 PASS
- 每機設定重啟後保留 PASS
- Production signing／checksum／rollback drill PASS
