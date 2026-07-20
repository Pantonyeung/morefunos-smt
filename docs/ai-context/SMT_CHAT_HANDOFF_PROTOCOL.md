# SMT Chat 接力協議

新 Chat 上載：`SMT_AI_CONTEXT_PACK.md` + 最新 repo zip + 最後 checkpoint + 實機圖。要求 AI 先報版本、任務、風險及改動檔案。

每個批次：提供完整替換檔；執行語法、全測試、Context驗證及 `git diff --check`；更新狀態及 checkpoint。

token 接近上限：停止加入新範圍，完成當前最小安全批次，交付完整 zip、修改檔、測試、待驗及 checkpoint；下一 Chat 從「下一步唯一任務」繼續。

```text
SMT CHECKPOINT
branch:
version/commit:
本輪已完成:
本輪未完成:
修改檔案:
測試結果:
實機結果:
下一步唯一任務:
需上載附件:
新／變更決策:
```
