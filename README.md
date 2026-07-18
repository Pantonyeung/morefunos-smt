# More Fun／磨飯 SMT｜Page Folder Preview V1

## 已完成範圍

- SMT-00：固定 T2 Shell／Page Loader
- SMT-01：啟動頁
- SMT-02＋SMT-03：點單頁
- SMT-04：全屏結帳頁

## 固定畫布

主設計尺寸鎖定 `1920×1080`，對應 SUNMI T2s 主屏。外層只會將整個畫布等比例縮放；不使用手機版重新排版。iPhone 橫屏會出現黑色 letterbox，屬預期結果。

## 路由

- `#/order`
- `#/checkout`
- `#/boot`
- `#/orders`、`#/dine`、`#/supply`、`#/more` 暫時進入預留頁。

## Page Folder

```text
/
├── index.html
├── app-loader.js
├── app-shell.css
├── manifest.webmanifest
├── service-worker.js
├── shared/
│   ├── page-base.css
│   └── page-bridge.js
└── pages/
    ├── boot/
    ├── order/
    ├── checkout/
    └── placeholder/
```

日後普通更新只改對應 `pages/<page>/`，Root Loader 不需要反覆重傳。

## 測試

```bash
npm test
node scripts/verify-fixed-canvas.mjs
```
