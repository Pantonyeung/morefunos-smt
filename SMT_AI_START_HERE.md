# 磨飯 SMT｜AI Start Here

更新：2026-07-31｜分支：`feat/smt-order-page-v1`｜程式：`order-v1-32`

## 最新必讀 Addendum

處理售罄、供應狀態、SMT／SMM Mobile Profile 或 Customer 同步前，必須先讀：

1. `docs/ai-context/SMT_DECISION_LEDGER_ORDER_V1_32.md`
2. `docs/ai-context/SMT_IMPLEMENTATION_STATUS_ORDER_V1_32.md`
3. `docs/ai-context/SMT_CODE_MAP_ORDER_V1_32.md`
4. `docs/ai-context/SMT_CHAT_HANDOFF_ORDER_V1_32.md`
5. `docs/milestones/G1-F-01-smt-smm-shared-soldout-control.md`

上述 Addendum 對供應狀態議題優先於舊 `order-v1-31` 文件；其他功能仍由原 Decision Ledger、Current Lock、Implementation Status 管理。

## 目標

先完成真正可運作的 SMT 點單垂直鏈路，再補其他營運功能。現行產品標準在 `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md`；不得回退到早期效果圖或舊 Master 介面。

SMM 不再作獨立 Application／Runtime。正式產品為同一 SMT Application：

- `register`：收銀機／大屏 Profile
- `mobile`：原 SMM 手機 Profile

兩個 Profile 必須共用 Domain、Data Model、Business Rule、Staff Session、Availability、Sync、Recovery、API Contract 及 Audit。

## 絕對不可違反

- 點單頁基礎狀態欄為永久全域狀態欄，所有主要頁不可刪除；頁面專用狀態只可附加。底部五項導航共用同一元件及完整選中膠囊，文字式單選／篩選亦共用膠囊語言；內容區內滾動。
- 同時只開一張主卡；背景不可按、空白不關卡，箭嘴指向觸發來源。
- 購物車金額完全靠右；右側上方價格、下方 `－ 數量 ＋ 修改`。
- 快捷飲品平時收起成底部把手；展開為向上抽屜及直向卡，名稱置頂、圖片在下、選中橙框加箭嘴。
- 快捷飲品、產品修改套餐飲品、統一整理飲品共用設計語言，只改尺寸。
- 指定配對按可配數量動態生成 A–Z，每組選主餐、小食及飲品。
- 待處理核對付款後才接單；接單後為運行中，30分鐘後完成，不設製作中／待取餐。
- 暫存按終端獨立編號；跨機接手後再次暫存改用接手機編號；結帳記錄實際結帳終端及 lineage。
- 只有現場外賣／堂食選付款方式，只有現金顯示鍵盤；其他渠道按政策進入待核實或平台已付。
- 平台百分之二十五只記佣金預估，不可當客人折扣；完成後更正必須保留原因及 audit。
- SMT／SMM 都可控制 `今日售罄／暫停供應／恢復供應`，但必須經同一 Staff Availability Runtime；不得建立第二套 SMM 售罄核心。
- 供應狀態必須 local-first：斷線仍可操作並排隊，重連後同步；Admin 發佈不得覆蓋現場供應狀態。

## 現況

- 程式及舊自動測試已有：真實餐牌讀取與離線快取、單一卡片、購物車分組與圖片開關、普通／快捷模式、飲品多配置、動態配對、待處理核對、付款證明、WhatsApp QR、售罄預覽、更多頁六入口、設備／線上卡、新單提示。
- `order-v1-32` 新增 SMT Register／SMM Mobile 共用供應狀態 Runtime、Staff Session、離線排隊、15秒更新、網絡恢復同步及 Customer Public Runtime overlay。
- SMT 原售罄頁及點單頁已接入共用 Runtime；SMM Mobile Profile 正式入口為 `?profile=mobile#/soldout`。
- 今日售罄於香港時間下一個早上五時失效；暫停供應必須明確恢復。
- 新供應狀態測試已寫入，但本輪 connector-only 環境未執行；Cloudflare、Firebase、兩端裝置及 Customer 傳播仍待驗收，不可寫成完成。
- 更多頁日結可按港幣面額以數量／金額雙向盤點、設定提取及留底現金、以實點現金反推待核實電話／WhatsApp／App 單的現金與非現金，並以當日淨銷售 3% 觸發原因及有權人稽核授權。
- 更多頁亦已接通報表與 CSV、備份／恢復、跨頁顯示設定、系統診斷，以及五部打印機設定、四款示範格式、預覽、打印工作、重試／改送及安卓橋接合約。
- 報表可查今日、昨日、七日、三十日、三個月、六個月及自訂日期；營業、渠道、付款、商品、異常共用範圍並可下鑽訂單。每日顯示流水統一為早上五時重置的 `P001` 至 `P999`，永久後台識別另存。
- 堂食第一版已有獨立路由、九宮格、輪候入口、簡潔枱詳情、掃碼待確認、逐餐品付款及枱碼本機鏈路；空枱只在正式落單後開枱，取消點單可清除本次脈絡並返回堂食。
- 不可宣稱完成：供應狀態部署／跨機實測、真實訂單提交 API、掃碼會話 API、付款閘道、安卓原生打印橋接、實體出紙、餐牌 API 實機驗收、iPad Safari、Sunmi T2S、產品負責人最終 Lock。

## 按任務載入

- UI：Current Lock + `SMT_CODE_MAP.md`
- 售罄／SMT／SMM 同步：四份 `ORDER_V1_32` Addendum + G1-F-01 milestone
- Bug：`SMT_CHANGE_IMPACT.md` + 對應測試
- 現況：`SMT_IMPLEMENTATION_STATUS.md` + 最新 Addendum
- 決策：`SMT_DECISION_LEDGER.md` + 最新 Addendum
- Chat：`SMT_AI_CONTEXT_PACK.md` + 最新 Chat Handoff
- 機器查詢：`SMT_KNOWLEDGE_GRAPH.json`

## 驗證

```bash
node scripts/validate-ai-context.mjs
node --test tests/*.test.mjs
```

下一個安全工作單位：先完成 Admin／SMT 最新分支部署及 SMT→SMM→Customer 供應狀態閉環驗收，再進行 iPad／Sunmi T2S 整體介面 review、APK 封裝與安卓打印橋接。任何失敗先記為「程式有、實機失敗」。
