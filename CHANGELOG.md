# CHANGELOG｜More Fun SMT Master V1.0 Fixed

日期：2026-07-19
基準：使用者上載 `morefunos-smt-feat-smt-master-v1.zip`
目標分支：`feat/smt-master-v1`

## 修正

- 移除 `pages/order/index.html` 內嵌快捷飲品 CSS 及文字攔截 Script。
- 移除 `shared/runtime.js` V16i 自動猜來源／文字判斷／全頁 Click 攔截。
- 新增正式 `positionAnchoredElement()` 共用定位函數。
- 快捷按鈕改為正式 `data-action="open-quick-mode"`。
- 新增快捷模式設定卡，箭嘴指向快捷按鈕。
- 待處理、顯示設定、系統狀態、接單狀態全部有正式 Anchor Key。
- 統一補選卡固定由待補區向右彈出，左箭嘴指向待補區。
- 修改卡由被按購物籃產品向右彈出，左箭嘴指向該產品。
- 飲品／飯底／醬汁／小食 Popover 沿用正式 Overlay Anchor。
- 飲品卡統一鎖定 168×78px，圖片 46×46px。
- 快捷飲品標題改為窄直排。
- Root／Order Build 更新為 `master-v11`。
- 保留 iPhone 橫屏穩定等比縮放。

## V1.1｜飲品卡及快捷模式修正
- 飲品卡由 168×78 收細為 112×52（原尺寸 2/3）。
- 圖片由 46×46 收細為 31×31。
- 快捷飲品、修改卡、統一補選共用同一尺寸變數。
- 快捷模式恢復兩行式介面：快捷飲品列開關＋快捷補選狀態。

## V1.2｜產品區浮卡阻擋層
- 浮卡後方磨砂玻璃化。
- 後面產品、分類及快捷飲品禁止點擊。
- 點空白背景退出。
- 無選擇立即退出；有選擇先確認。
- 修改卡、飲品 Popover、補選 Popover 使用同一規則。
- Build 更新為 `master-v12`。
