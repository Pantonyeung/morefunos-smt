# SMT Targeted Failure Log

> 狀態：CURRENT。任何 FAIL／TIMEOUT 必須按 `docs/SMT_TARGETED_FAILURE_PROTOCOL_V1.0.md` 拆開處理；本文件只記錄 isolated diagnosis／fix／evidence，不取代正式 final integration QA。

## 2026-07-28｜C｜Production APK keystore decode

- Target：`Build Production APK` → `Decode Android keystore`。
- Evidence：run `30324446035`；Validate signing secrets=PASS、Web Release public key=PASS、Release APK build=PASS；第一個失敗 step=`Decode Android keystore`，之後 alias／APK path／apksigner 全部 skipped。
- 根因分類：GitHub Secret `MOREFUN_ANDROID_KEYSTORE_B64` 在 CI base64 decode 層失敗；未有證據指向 keystore alias／password／APK／apksigner。
- 修改：只改 decode step，先移除 secret 中所有 whitespace，再做 base64 decode；不修改後續 signing gate。
- Commit：`d9ec61fc035aae046190c287a6d89674a5b043c1`。
- Rollback：回退上述 commit 即可；不影響 APK Runtime／Web Runtime／Bridge。
- Current isolated result：待下一個 Production APK marker；如果 decode PASS，下一步只處理下一個首次失敗 step。
