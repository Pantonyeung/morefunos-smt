# More Fun／磨飯 SMT Web Core

目前分支實作 **SMT 直覺操作 Slice 1**，適用 SMT-00 至 SMT-05。介面採輕日系現代簡約風格，全程使用繁體中文，核心操作同時提供清楚文字與正式 SVG 圖標。

## Slice 1 已完成

- SMT Shell、頂部狀態與固定五項導航：點單｜訂單｜堂食｜售罄｜更多
- 商品分類、搜尋、商品卡、圖片失效文字替代及購物車
- Required 必選整理 Drawer；尚欠內容時阻塞正式結帳
- 來源、用餐方式、包裝、優惠、付款及可選備註的自然結帳順序
- 流水號遞增、安全保存、保存失敗保留購物車
- 新 App／Web 訂單批次提醒及「稍後處理」保留角標
- 正常、快速及 Reduced Motion 動效節奏
- Versioned localStorage state、舊展示資料安全遷移
- PWA 核心模組離線快取
- Node 內建測試覆蓋文案、圖標、Domain、State、View 與 Release Gate

## 尚未接入

- Firebase／Cloudflare Worker 正式訂單通道
- Room／SQLite 原生權威資料層
- 實體後廚機、標籤機及 Sunmi 收據打印服務
- 真實付款核實、退款、日結、備份及同步
- SMT-06 至 SMT-16 完整功能

目前商品及訂單資料仍為介面驗證資料；不能把本版本描述為已完成正式 POS 接線。

## 測試

```bash
npm test
```

## 本機預覽

```bash
python3 -m http.server 8080
```

打開 `http://localhost:8080`。建議使用 1024×600 或 1280×800 橫屏驗收。
