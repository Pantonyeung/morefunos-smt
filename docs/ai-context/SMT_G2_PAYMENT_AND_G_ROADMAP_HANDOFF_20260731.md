# SMT｜G2 付款決策＋G0.5→G9 Roadmap 接手

狀態：`CURRENT HANDOFF / SOURCE BOUNDARY`
日期：2026-07-31 13:54 HKT

## Owner 已確認

- 公司 WhatsApp：`85261123071`
- Customer 上傳付款截圖。
- SMT／SMM 必須沿用現有付款核對卡：保留待處理／資料有問題／核實成功。
- 核款成功後先確認接單。
- 圖片本體存私有 Google Drive。
- Google Sheet 保存 proof ledger、核對人、結果、Audit、留存期。
- 最少保存 60 日；爭議／退款／核數 hold 不自動刪除。

## SMT 現況

已存在本機付款核對 UI／Domain／Contract；目前本機圖片仍以 FileReader／local storage 模式保存，唔係正式跨端儲存。

未完成：Customer upload API、Private Drive、Sheet adapter、SMT／SMM shared remote queue、短效預覽、retention job、deployment／device acceptance。

## Authority 引用

- Central Governance：`Pantonyeung/morefunos@main/docs/governance/MOREFUNOS_DECISION_RECORDING_AND_MULTI_REFERENCE_POLICY_V1.0.md`
- G Roadmap：`Pantonyeung/morefunos@main/docs/roadmap/MOREFUNOS_G0_5_TO_G9_EXECUTION_ROADMAP_V1.0.md`
- Payment Decision：`Pantonyeung/morefunos@main/docs/decisions/DEC-G2-20260731-PAYMENT_PROOF_DRIVE_SHEET_60D.md`
- Current Status：`Pantonyeung/morefunos@main/docs/status/MOREFUNOS_G_STAGE_STATUS_20260731.md`

## 禁止

- 禁止重造第二套付款核對 UI。
- 禁止將圖片 base64 長期放入 localStorage、Firebase 或 Sheet。
- 禁止圖片存在即視為付款真實。
- 禁止未部署／未實機驗收就標 G5 完成。

目前：`G1 91% / G2 DECISION LOCKED / G5 SMT LOCAL FOUNDATION ONLY`。
