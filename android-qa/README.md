# SMT Android／Sunmi T2s QA

此套件依照 SMT Lock 驗證 Android 平板及 Sunmi T2s 的畫面、觸控、旋轉、WebView／Chrome 行為和錯誤證據。它不會把未驗收版本合併到 `main`，亦不會連接正式訂單或打印端點。

## 目標裝置

- Sunmi T2s 主屏：15.6 吋、1920×1080、SUNMI OS（Android 9）。
- 1024×600：作低解析度／副屏版面壓力測試，不代表把客戶副屏當 SMT 主操作屏。
- 1280×800：一般 Android 平板橫屏回歸測試。

## 目前環境限制

本次 ChatGPT 執行環境沒有 `adb`、Android SDK 或 Android Emulator，因此沒有假稱已完成 Android 模擬器／Sunmi 實機測試。已完成 Chromium Android WebView User-Agent、觸控模式及 1024×600、1280×800、1920×1080 的替代驗證；真正 Android 證據需在有 SDK 或 Sunmi T2s 的環境執行本套件。

## 使用方法

先把未合併分支部署到獨立 Preview URL，開啟 USB 偵錯並確認：

```bash
adb devices -l
./android-qa/run-sunmi-t2s-qa.sh 'https://你的-preview-網址/'
```

測試 APK 時：

```bash
SMT_PACKAGE='你的.package.name' \
SMT_ACTIVITY='.MainActivity' \
./android-qa/run-sunmi-t2s-qa.sh
```

每次執行會保存：

- 裝置型號、Android 版本、解析度、密度及 WebView 資訊
- Android UI hierarchy (`window.xml`)
- 畫面截圖 (`screen.png`)
- Window／Activity dumpsys
- 記憶體快照及 Logcat

## 必做流程

1. 冷啟動，確認沒有白屏、過期快取或英／簡體文案。
2. 點 F4，再點 B1；完成 Required 飯底。
3. 打開結帳；確認 footer 一直可見，內容區可獨立捲動。
4. 選擇付款並正式落單；確認流水遞增、購物車成功後才清空。
5. 模擬保存失敗；確認餐點、付款和備註仍保留。
6. 新 App／Web 訂單選「稍後處理」；確認訂單角標仍在。
7. 斷開網絡；確認顯示「離線可工作」且本機點單不被鎖死。
8. 以 10 次連續點擊驗證沒有重複成單。
9. 檢查所有核心按鈕的實際觸控區不少於 48dp。
10. 開啟系統「移除動畫」或 Reduced Motion，確認操作結果仍清楚。

## 驗收阻塞

出現下列任何一項都不可合併 `main`：

- 文字／按鍵被裁切，或核心操作低於 48dp
- 結帳確認鍵因內容高度而離開畫面
- 保存失敗清空購物車
- 稍後處理令新單消失
- WebView／APK 白屏、持續崩潰或大量 JavaScript error
- 需要 OpenAI API、網絡或雲端 AI 才能完成基本收銀
