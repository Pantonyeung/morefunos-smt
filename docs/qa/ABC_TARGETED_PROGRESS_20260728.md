# A／B／C Targeted Progress｜2026-07-28

> CURRENT checkpoint. GitHub = engineering authority；Google Drive／Jade Note 必須同步。任何 FAIL 只處理 exact failing unit，禁止以 full suite 作 root-cause debug。

## A｜Proportional Layout
- Branch：`qa-root-cause-fix-v1`
- Isolated target：`tests/proportional-layout.spec.js`
- Run `30329898771`：12 FAIL。
- 根因 1：11 個測試仍點 child `[data-action="open-settings"]`；Current Authority 已將「顯示設定」搬到 Parent Shell。
- 根因 2：Cart footer 舊門檻要求 primary / utility `>3.4`；Current `cart.css` Authority 為 `92px 92px 1fr`，1280×800 實測 3.2109375，舊門檻並非 Current Contract。
- 修正 commit：`f3db0d31529ef92c5d7e144bde496928d0bf2686`。只改該 spec：用 Parent Shell accessible button，門檻改驗 Current Authority `>3.0 && <4.6`。
- 狀態：等待同一 spec isolated rerun；未 PASS 不切下一項。

## B｜Printer／Incoming Queue
- Printer branch：`printer-transport-settings-v1`；workflow commit `f4e65d177cf45c1342fd95b6694318e937b4d5c3`。
- Printer Gate 已移除 unrelated full-node debug，只跑 Printer module tests，並回寫 `.github/printer-contract-last-result.txt`。
- Incoming branch：`incoming-queue-domain-v1`；workflow commit `9c4f8616f6dd2e32adec74668d1f34f5a6cc18cc`。
- Incoming Gate 只跑 `tests/incoming-queue-domain.test.mjs`，並回寫 `.github/incoming-queue-contract-last-result.txt`。
- 狀態：等待兩個 isolated markers。

## C｜Production APK Keystore Decode
- 最新 Production run `30327777075` 仍只在 Decode Android keystore FAIL。
- 已停止重跑完整 APK Build 作 decode debug。
- 新增 decode-only workflow：`.github/workflows/diagnose-keystore-secret.yml`，commit `3c34c31f40206be79a98c53281270a8dccb84b0c`。
- 只輸出安全 metadata：raw/normalized length、mod4、invalid-character count、prefix detected、decode status、decoded byte count；不輸出 Secret 內容。
- 結果 marker：`.github/keystore-decode-diagnosis.txt`。
