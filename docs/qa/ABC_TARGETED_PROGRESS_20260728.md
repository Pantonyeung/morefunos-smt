# A／B／C Targeted Progress｜2026-07-28

> CURRENT checkpoint. GitHub = engineering authority；Google Drive／Jade Note 必須同步。任何 FAIL 只處理 exact failing unit，禁止以 full suite 作 root-cause debug。

## A｜Proportional Layout
- Branch：`qa-root-cause-fix-v1`
- Isolated target：`tests/proportional-layout.spec.js`
- Run `30329898771`：12 FAIL。
- 根因 1：11 個測試仍點 child `[data-action="open-settings"]`；Current Authority 已將「顯示設定」搬到 Parent Shell。
- 根因 2：Cart footer 舊門檻要求 primary / utility `>3.4`；Current `cart.css` Authority 為 `92px 92px 1fr`，1280×800 實測 3.2109375，舊門檻並非 Current Contract。
- 第一刀 commit：`f3db0d31529ef92c5d7e144bde496928d0bf2686`。
- 第二層根因：QA 專用 `#dev-preview-entry` z-index 覆蓋 Parent Shell settings button，pointer click 被攔截；該 spec 驗 layout 而非 hit-area。
- 第二刀 commit：`ba6bfeef06e8e82b75c270c345451625b8ea1bde`，只將 shell action 改為 DOM click；Runtime／Adaptive Core／1920 Lock 未改。
- 狀態：等待同一 spec isolated rerun；未 PASS 不切下一項。

## B｜Printer／Incoming Queue
- Printer branch：`printer-transport-settings-v1`；workflow commit `f4e65d177cf45c1342fd95b6694318e937b4d5c3`。
- Printer Module Contract run `30330815664`：SUCCESS。
- Incoming branch：`incoming-queue-domain-v1`；workflow commit `9c4f8616f6dd2e32adec74668d1f34f5a6cc18cc`。
- Incoming Queue Contract run `30330838438`：SUCCESS。
- Evidence level：兩者為 isolated CONTRACT_PASS；A 未全 PASS 前仍禁止合併 baseline。

## C｜Production APK Keystore Decode
- 最新完整 Production run `30327777075` 仍只在 Decode Android keystore FAIL；已停止用完整 APK Build debug decode。
- Decode-only workflow 第一版 shell quoting error；修正 commit `8d2e7c69d78685c2c78067414d93744c5bf7c7ec`。
- 真實 diagnosis run `30331143581`：`raw_len=4131`、`normalized_len=4131`、`length_mod4=3`、`invalid_count=0`、`prefix_detected=0`、`decode_ok=0`。
- 根因：Secret 全為合法 Base64 字元，但尾部缺 1 個標準 padding `=`。
- Padding isolated test commit：`4f2bafe59460e47a36eda1ede24b814d2ef85657`。只驗 decode；PASS 後先修改 Production workflow。
