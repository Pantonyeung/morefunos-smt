# SMT Change Impact／Blast Radius

| 修改 | 必查影響 | 最少驗證 |
|---|---|---|
| 高度／縮放 | 頂底欄、cart footer、飲品抽屜、modal邊界 | 長購物車、大圖卡、iPad、T2S |
| 購物車列 | 分組、圖片、長名稱、價格、操作、required | cart tests + 1／10／50項 |
| modal定位 | 四方向、換向、背景inert、單一卡 | 頂／底／左／右各開一張 |
| 共用飲品卡 | 快捷、產品修改、統一整理、圖片、選中 | 三場景逐一截圖及點擊 |
| 飲品配置 | 正常、toggle、多組、套餐slot、價格 | 同款四配置＋取消選項 |
| 指定配對 | A–Z、餘量、重複、確認 | 5×3→3組；10×10→10組 |
| 待處理 | 兩渠道、proof、QR、接單、30分鐘 | 有／無proof；WhatsApp實掃 |
| Store | 舊快取、service worker、合併展示 | 清快取與保留快取重載 |

實機失敗先更新 Status，再修程式；不得只改 CSS 後直接寫「完成」。
