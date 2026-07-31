# More Fun SMT｜Register／Mobile Shared Core

> **Authority boundary：本 repo 只係 SMT Application＋Android Host implementation surface。**
> 任何 AI／Codex／Work 開始前，必須先讀中央 MoreFunOS Master Authority、Must Read、Current Registry、Document Classification、Legacy Inventory，再讀本 repo `MOREFUNOS_AUTHORITY_BOUNDARY.md`、`AGENTS.md`、`SMT_CONTEXT_MIN.md`。

## 正式產品定位

More FunOS 只保留一個 SMT Application：

- `register`：收銀機／大屏 Profile；
- `mobile`：手機／平板 Profile。

兩個 Profile 共用同一 Domain、Data Model、Business Rule、Cart、Pricing、Checkout、Order、Payment、Sync、Recovery、Audit 及 Print Job Contract。

舊 `morefunos-smm` 已 `SUPERSEDED AS INDEPENDENT CORE`，只作 migration／mobile UI reference。

## 舊文件降權

以下只屬 `REFERENCE ONLY`：

- WORK01／02／03；
- V42／SA2／EG；
- Rebuild39／舊 1920→1280 文件；
- 舊 A／B／C／D／E 線接手；
- Apps Script／Google Sheet Staff Sync／RegisterHub；
- 舊 SMM core；
- 舊 branch／PR／CI／artifact／handoff。

即使標題包含 `LOCK／FINAL／MASTER／CURRENT／READY`，都不得直接施工。舊文件只可抽取產品需求、UI 素材、migration source、contract、踩坑及成功方法；需要重新採用，必須經 re-adoption proposal。

## 現役邊界

- Firebase RTDB＝Operational Authority；
- Cloudflare Worker／Order API＝validation、repricing、idempotency、protected write；
- Google Sheet V2＝ledger／reporting mirror；
- SMT／mobile 不直接寫受保護 RTDB；
- Android Host 負責設備、打印、OTA、硬件級結果；
- Queue success 不等於實體打印 success。

## 現役狀態入口

- 中央 Current：`Pantonyeung/morefunos/MOREFUNOS_CURRENT_DEVELOPMENT_REGISTRY.md`
- Repo Boundary：`MOREFUNOS_AUTHORITY_BOUNDARY.md`
- Repo Agent：`AGENTS.md`
- 最小上下文：`SMT_CONTEXT_MIN.md`
- Change Impact：`SMT_CHANGE_IMPACT.md`
- QA／Pitfalls：`docs/qa/`

文件內 branch／PR／head／artifact 只係 checkpoint；必須 fresh-read GitHub，唔可以當永久最新。

## Evidence

`CODE_EXISTS → CONTRACT_PASS → BROWSER_PASS → DEVICE_PASS → STORE_PASS → PRODUCT_LOCKED`

Browser／software PASS 不等於 Device／Hardware／Store／Production PASS。

## 本機預覽

```bash
python3 -m http.server 8080
```

打開 `http://localhost:8080`。
