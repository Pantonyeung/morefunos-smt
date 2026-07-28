# SMT Targeted Failure Protocol V1.0

狀態：CURRENT / HARD RULE

目的：任何 QA／CI／Browser／APK／Printer／Domain 問題一旦已知具體失敗位置，禁止反覆用全量 Suite 當 Debug 方法。必須先隔離、單獨重現、定位根因、單獨修正及單獨 PASS，最後先回到整合 Gate。

## 固定流程

`FAIL → isolate exact failing part → reproduce only that part → inspect evidence/log → identify root cause → fix only root cause → rerun only that part → PASS → integrate → run minimum affected regression → final full gate once`

## 強制規則

1. 已知 FAIL spec／step／module 後，下一次 Debug run 只可以跑該失敗單元及其直接依賴。
2. 禁止為單一 FAIL 每次重新跑完整 Browser Matrix、完整 Node Suite、完整 APK Pipeline 或完整 Module Suite。
3. 若一個 step 包含多個可能失敗點，必須拆成獨立 steps，令 CI 明確指出真正 failure boundary。
4. Timeout 必須先判斷係 test contract、wait strategy、race condition、environment、performance 定 Runtime 真問題；禁止直接加大 timeout 當修復。
5. 修正後先取得 isolated PASS；未 isolated PASS，不得合拼。
6. isolated PASS 後，只跑最小 affected regression；最後先跑一次完整正式 Gate 作整體驗收。
7. Full Suite 角色只係 Integration／Regression Gate，不係 Root Cause Debug 工具。
8. 所有 A／B／C 線及之後 SMM 共用同一規則。

## A 線例子

若 `responsive-visual-contract` TIMEOUT：
- 只跑 `responsive-visual-contract`；
- 取得 stack／trace；
- 判斷 Parent Shell／iframe／selector／wait strategy／Runtime 根因；
- 修該根因；
- 單 spec PASS；
- 再跑直接受影響 spec；
- 最後先跑正式五尺寸全 Gate。

## C 線例子

若 Production APK 只喺 signing FAIL：
- 禁止重做完整 Web Bundle／Gradle／全部前置步驟作 Debug；
- 將 signing 拆成 keystore decode、alias/password preflight、APK path、apksigner、verify；
- 單獨定位 failing step；
- 該 step PASS 後先重跑 Production APK final gate。

## 完成定義

任何問題只有以下證據鏈先算完成：

`isolated reproducible FAIL → root cause identified → isolated PASS → affected regression PASS → final integration gate PASS`
