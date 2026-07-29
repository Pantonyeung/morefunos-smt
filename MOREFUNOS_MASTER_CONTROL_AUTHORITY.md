# More FunOS｜四端閉環總控權威文件 V1.0

> 狀態：CURRENT / HIGHEST AUTHORITY / MUST READ FIRST
> 更新：2026-07-29 19:42 HKT
> 適用範圍：Admin／Customer／SMT Register／SMT Mobile（原 SMM）／Android Host／打印／Firebase／Order API／Audit／Report

## 0. 最高身份

本文件係 More FunOS 全系統最高接手入口、總控文件及跨端閉環 Authority。

任何單一 PR、單一模組、單一分支、單一測試報告、單一對話或單一端口文件，都只可以係本文件下面嘅子記錄，不得取代本文件。

以下主題一律降級為子模組記錄：

- PR #30
- Runtime
- 長時間離線生存
- Journal／Service Worker／Browser Gate
- 單一 SMT／SMM／Admin／Customer 工作包

## 1. 四端正式定義

### A. Admin Control Plane

負責：

- 產品、分類、價格、選項、套餐、售罄、公告、營業時間
- Draft／Published／Runtime／Release／Audit
- Firebase Auth、Role、Rules、Publish、Recovery
- 所有跨端設定嘅唯一管理入口

### B. Customer Experience

負責：

- 顧客瀏覽、選餐、會員、優惠、提交訂單
- 只讀 Published／Runtime Snapshot
- 透過 Order API 提交訂單
- 不自行成為價格、售罄、產品規則或 Order Authority

### C. SMT Application

SMT 包含兩個 UI Profile，但共用同一套 Shared Core：

1. SMT Register UI：收銀機／大屏／高峰操作
2. SMT Mobile UI：原 SMM，手機／遙距操作

兩者必須共用：

- Domain
- State
- Business Rule
- Cart
- Pricing
- Checkout
- Order
- Payment
- Sync
- Permission
- Audit
- Recovery
- API Contract

禁止建立第二套 SMM 商業邏輯。

### D. SMT Android Host／Hardware Plane

負責：

- Kiosk／WebView Host
- Native Bridge
- LAN／Sunmi／Label 打印
- Offline queue／SQLite／Recovery
- Runtime OTA／APK OTA
- 安裝、版本、診斷、設備能力

SMT Mobile 只建立 Print Job／Command，不直接連實體打印機；Android Host 執行並回傳 printed／failed／retry。

## 2. 唯一閉環

```text
Admin Draft
→ Admin Publish
→ Firebase Published／Runtime Snapshot
→ Customer／SMT Register／SMT Mobile
→ Cart／Checkout
→ Order API
→ 後端重新計價／Idempotency／唯一 Order ID
→ Order Authority
→ SMT Local Queue／Firebase
→ Print Job
→ SMT Android Host
→ Receipt／Kitchen／Label
→ printed／failed／retry
→ Audit／Report／Google Sheet Mirror
```

任何端口都不得跳過呢條鏈建立第二套真相。

## 3. Source of Truth Map

| 領域 | 唯一 Authority | 禁止 |
|---|---|---|
| 產品／價格／規則 | Admin Published | Customer／SMT 自行改價 |
| 售罄／等候時間 | Runtime Snapshot | 各端各自永久保存第二真相 |
| 顧客訂單提交 | Order API | 前端直接寫 Order Authority |
| 訂單正式狀態 | Order Authority＋SMT Local durable queue | Google Sheet 作即時真相 |
| 打印工作 | Print Job Contract | SMM／Customer 直接控制打印機 |
| Android 硬件 | SMT Android Host | Web Runtime 假裝具 Native 能力 |
| 報表／帳簿 | Google Sheet Mirror／Audit | Sheet 分配正式流水或重新計價 |
| UI／Adaptive | SMT 自適應系統 Authority | 1920→1280 整頁縮放／第二套 UI |

## 4. 當前真實狀態｜2026-07-29

### 已完成

- SMT 自適應系統 V1.0：Full Browser Matrix 78／78 PASS、0 failure、0 flaky
- Runtime／離線軟件整合：Targeted 3／3 PASS；Full Browser Matrix 81／81 PASS；0 failure；0 flaky
- Journal、Snapshot、Queue、Recovery、Service Worker、Storage Health、Runtime UI Hook
- APK Foundation／D／E 線已有獨立軟件及 CI 成果

### 未完成

- Admin Firebase Auth／Rules／真實 Publish 閉環
- 統一 Published／Runtime Consumer Adapter
- 正式 Order API／後端重新計價／原子派號
- Customer 下單後 SMT 即時 Intake
- Print Closure 真實紙張、中文、切紙、標籤驗收
- Android／打印／斷網／斷電／多日營運實機驗收
- Store Acceptance／Production Ready

## 5. 正式推進 Gate

### G0｜Authority 收口

- 四端角色鎖定
- Source of Truth Map 鎖定
- SMM 合併 SMT Shared Core
- 所有舊文件重新分類為 Current／Submodule／Superseded

### G1｜Admin Publish 閉環

- Firebase Auth
- Owner Account／Role Claims
- Security Rules
- Draft Write／Runtime Write／Publish／Audit／Recovery
- 首次 Published Seed

### G2｜統一 Consumer Adapter

- Customer／SMT Register／SMT Mobile 共用 Published／Runtime Snapshot Contract
- 產品、價格、選項、售罄、公告、營業時間同步
- Offline last-known-good

### G3｜Order Commit 閉環

- 後端重新計價
- Idempotency
- 唯一 Order ID／派號
- Offline Queue／Retry／Conflict Recovery
- Customer → SMT 即時 Intake

### G4｜Print Closure

- Print Job Contract
- SMT Mobile 只發命令
- Android Host 靜默打印
- ESC/POS／TSPL 中文、切紙、Label
- printed／failed／retry／fallback 回傳

### G5｜Store Acceptance

- Admin 改價四端同步
- 售罄即時同步
- 雙擊／重試不重複單
- 斷網可開單，恢復後同步
- Crash／Reload／斷電可恢復
- 多機同時開單
- 高峰壓力、跨日、日結、報表、Audit

## 6. 總控工作規則

每次執行必須先回答：

1. 今次屬於邊個 Gate？
2. 影響邊幾端？
3. Authority 係邊個？
4. 有冇破壞閉環？
5. 測試證據屬於 Code／Contract／Browser／Device／Store 邊一層？
6. 三方記錄有冇同步？

未回答以上問題，禁止開始修改。

## 7. 三方最高記錄

### GitHub

本文件：`MOREFUNOS_MASTER_CONTROL_AUTHORITY.md`

GitHub 係正式工程 Authority。

### Google Drive

鏡像文件：`More FunOS｜四端閉環總控權威文件 V1.0`

負責長期可讀接手、跨 repo 導航及營運層閱讀。

### Jade Note

Pinned Note：`More FunOS｜四端閉環總控權威文件 V1.0`

負責 AI 接手記憶、索引、當前 Gate、下一步及風險。

三方衝突時，以 GitHub 本文件最新內容為準。

## 8. 子記錄規則

所有 PR、branch、module、CI、QA、實機報告，都必須記錄：

- 所屬 Gate
- 影響端口
- 改動內容
- 根因
- 踩坑
- 成功方法
- Commit／Run／Artifact
- 未完成邊界
- 下一步

子記錄完成後，必須回寫本文件嘅「當前真實狀態」或 Gate 狀態。

## 9. 永久禁止

- 用單一 PR／單一模組作 More FunOS 最高主題
- 將 SMM 繼續發展成第二套系統
- 未有 Firebase／Order API 就聲稱四端閉環
- 未有實機證據就聲稱 Production Ready
- Google Sheet 作即時 Order Truth
- 各端自行重新計價
- Customer／SMM 直接控制打印機
- 有 fail／flaky 仍合併
- 文件存在但冇同步三方記錄

## 10. 下一步唯一優先

完成 G0 收口：

1. 將本文件同步到 Google Drive／Jade Note並置頂。
2. 將 PR #30／離線文件標記為 G2/G3 支援子模組，不再作最高入口。
3. 在 Admin repo 建立本文件鏡像入口。
4. 盤點 Customer repo／正式分支；未確認前不得假設。
5. 進入 G1：Admin Firebase Publish 真閉環。
