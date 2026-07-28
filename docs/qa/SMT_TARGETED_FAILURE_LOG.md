# SMT Targeted Failure Log

> 狀態：CURRENT。任何 FAIL／TIMEOUT 必須按 `docs/SMT_TARGETED_FAILURE_PROTOCOL_V1.0.md` 拆開處理；本文件只記錄 isolated diagnosis／fix／evidence，不取代正式 final integration QA。

## 2026-07-28｜C｜Production APK keystore decode

- Target：`Build Production APK` → `Decode Android keystore`。
- Evidence：run `30324446035`；Validate signing secrets=PASS、Web Release public key=PASS、Release APK build=PASS；第一個失敗 step=`Decode Android keystore`，之後 alias／APK path／apksigner 全部 skipped。
- First fix：先移除 secret whitespace 再 base64 decode；commit `d9ec61fc035aae046190c287a6d89674a5b043c1`。
- First rerun：run `30327307684` 仍只係 `Decode Android keystore` FAIL；後續 steps 仍 skipped，證明唔係單純換行／空白。
- Second fix：decode 前額外兼容手機複製時可能連埋 `MOREFUN_ANDROID_KEYSTORE_B64=` 前綴或單／雙引號，再做 base64 decode；commit `b50fcd5b8367302de083358e39c4651e2147f81a`。
- 未修改：JKS 本體、alias、store password、key password、APK path、apksigner、Runtime／Bridge。
- Rollback：逐個回退上述 decode-only commits 即可。
- Current isolated result：等待下一個 Production APK marker；如 decode PASS，下一步只處理下一個首次失敗 step；如仍 FAIL，改做不洩漏 Secret 嘅 length/mod4/invalid-char metadata diagnosis，唔猜後面 signing 問題。
