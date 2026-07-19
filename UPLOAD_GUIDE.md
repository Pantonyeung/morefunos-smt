# GitHub 上載指引

目標分支：`feat/smt-master-v1`

## 最簡單方法

將 `MoreFun_SMT_Master_V1.0_Fixed_FULL.zip` 解壓後，完整覆蓋分支內容。

## 手機分 Folder 上載順序

1. `02_SHARED_UPLOAD.zip` → `/shared/`
2. `03_ORDER_PAGE_UPLOAD.zip` → `/pages/order/`
3. `01_ROOT_UPLOAD.zip` → Repository Root
4. 其餘 `docs/`、CHANGELOG、DECISION_LOG、INCIDENT_LOG 可最後上載

Root 必須最後上載，避免 Loader 先讀到未更新 Page。
