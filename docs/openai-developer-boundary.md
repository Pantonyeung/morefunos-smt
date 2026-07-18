# OpenAI Developers｜SMT 安全邊界

## 本切片的正式決策

SMT-00 至 SMT-05 的點單、Required、價格、付款選擇、本機保存、流水、打印任務及新單處理不使用 OpenAI API，也不需要 `OPENAI_API_KEY`。

原因不是拒絕 AI，而是收銀核心必須離線可工作、結果可預測、可以稽核。任何 AI 請求失敗、配額不足、網絡中斷或模型變更，都不得阻塞點單、付款、打印或日結。

## 日後可考慮的非核心用途

- 將技術錯誤翻譯成店員看得懂的繁體中文說明
- 低峰時段生成報表摘要或異常解釋草稿
- Admin 端協助整理商品文案，但不得直接改價或改業務規則

這些功能必須：

1. 放在 Worker／受控 server 端，不把 API key 放入 Web、PWA 或 APK。
2. 預設關閉並有明確人工確認。
3. 有非 AI fallback；AI 不可成為唯一入口。
4. 不傳送不必要的顧客個人資料、付款資料或完整營運資料。
5. 不得直接建立正式 Order、Payment、Refund、PrintJob 或 Day Close。

## API Key 狀態

目前程式不需要 OpenAI API key，因此不建立、不下載，也不把任何 key 寫入 GitHub、Cloudflare Pages、APK 或本機儲存。只有未來批准一個明確的 server-side AI 功能時，才另行建立獨立 Project、最小權限 key、用量限制及撤銷流程。
