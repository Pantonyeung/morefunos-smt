# More Fun SMT｜Register／Mobile Shared Core

SMT 係 MoreFunOS 店內 Application＋Android Host implementation surface。

## 系統定位

MoreFunOS 只保留一個 SMT Shared Core：

- `register`：收銀機／大屏 Profile；
- `mobile`：手機／平板 Profile。

兩個 Profile 共用同一 Domain、Data Model、Business Rule、Cart、Pricing、Checkout、Order、Payment、Supply Runtime、Sync、Recovery、Audit 及 Print Job Contract。

舊 `morefunos-smm` 只係 migration／歷史 UI 參考，不得重新成為第二套 Core。

## 必讀入口

任何分析、設計或修改前依次閱讀：

1. `AGENTS.md`
2. `CURRENT_DOMAIN_AUTHORITY.md`
3. `ENGINEERING_LOG.md`
4. 與任務直接相關的 Active PR、可執行測試及原始 Evidence
5. `Pantonyeung/morefunos` Knowledge Base V2

文件名稱包含 `LOCK`、`FINAL`、`MASTER`、`CURRENT` 或 `READY`，不代表它仍然係現行 Authority。

## 穩定責任邊界

- Firebase RTDB：Operational Authority；
- Cloudflare Worker／Order API：validation、repricing、idempotency、protected write；
- Google Sheet V2：ledger／reporting mirror；
- SMT／Mobile 不直接寫受保護 RTDB；
- Android Host 負責設備、打印、OTA 與硬件級結果；
- Queue success 不等於實體打印 success；
- Browser PASS 不等於 Device／Hardware／Store PASS。

## 文件治理

- `CURRENT_DOMAIN_AUTHORITY.md`：唯一 CURRENT SMT Authority；
- `ENGINEERING_LOG.md`：唯一 append-only 工程歷史；
- 其他 Start Here、Context、Decision、Status、QA、Handoff、Lock、Plan 文件只屬索引、規格、Evidence 或 Archive，除非 Authority 明確重新採納。

## 本機預覽

```bash
python3 -m http.server 8080
```

打開 `http://localhost:8080`。
