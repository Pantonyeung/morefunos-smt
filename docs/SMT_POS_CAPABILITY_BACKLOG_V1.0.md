# More Fun SMT｜POS Capability Backlog V1.0

狀態：CANDIDATE / NOT INTEGRATED
基準：`smt-functional-completeness-v1`
原則：只吸收真正適合磨飯高峰、夫妻店、人手、設備、打印及外賣主導流程嘅能力；唔照搬大型西餐／多分店複雜流程。

## P0｜值得獨立模組開發

### M-03 Link Up／指定配對／套餐重組
- 自動配對 Preview
- 指定 A/B/C 配對
- 部分數量配對
- 未配對餘量
- 拆套餐／重配
- 修改小食／飲品後重新計價

### M-04 Modifier／Option Schema
- Required／Optional／Multi-select
- 順序／權重／預設值
- Admin → Domain → Required Flow 單一 Contract

### M-05 正式 Checkout Commit／Order API
- Idempotent commit
- 本地先寫入／遠端非阻塞同步
- 失敗保留草稿及可恢復

### M-06 Staff Session／Bootstrap
- Staff Login
- Session restore
- 權限 bootstrap
- 裝置／員工狀態恢復

### M-10 Unified Incoming Queue
- Website／App／WhatsApp／電話／Foodpanda／Keeta 統一待處理入口
- Source adapter 只轉換來源，不建立第二套訂單模型

### M-11 Order Recovery／Reopen／Void／Audit
- Reopen 已完成但未日結訂單
- Void item／order 必須 Reason Code
- 高風險操作要求 Manager PIN／Permission
- Audit trail：誰、何時、改咗乜
- Move item／merge order 只在磨飯實際需要時開啟

### M-12 Quick Repeat／Duplicate Order
- 複製上一單
- 複製指定產品並保留 Modifier
- 複製後仍重新走售罄／價格／Required 驗證

### M-13 Offline Local Sync／Recovery
- Internet down 仍可本地開單／打印
- SMT／SMM LAN-first 同步
- reconnect 後自動補同步
- duplicate suppression／conflict policy

## P1｜高價值效率模組
- 指定單據一鍵重印
- Printer Failover 一鍵改送
- Recent Products／Favorites
- Undo 最近一步（只限未提交交易）
- 訂單來源 Filter
- 高峰 Queue Load 指示
- Scheduled Menu／Availability
- 輕量 Upsell Prompt（不可阻塞 Checkout）

## 不直接照搬
以下成熟 POS 常見功能暫不作 SMT 預設：
- Course 1/2/3
- Seat-level 1/2/3 精細管理
- Hold／Fire 每道菜
- 大型 Floor Section／Server assignment
原因：對磨飯高峰快餐／外賣流程增加步驟多過增加價值。

## 市場參考原則
- Square 類型：Reopen、Void with Reason、Move/Reassign、Permission → 值得抽取「訂單恢復＋權限＋Audit」模式。
- Toast 類型：Offline local sync／local hub → 值得抽取「斷網仍本地協作」模式。
- TouchBistro 類型：硬線本地後備、Scheduled Menu、Modifiers → 值得抽取「LAN-first＋後台設定」模式。
- Lightspeed 類型：多來源訂單集中／Offline local storage → 值得抽取「單一 Incoming Queue＋恢復後同步」模式。

## Integration Gate
任何候選模組只有經：
`CODE_EXISTS → CONTRACT_PASS → BROWSER_PASS → DEVICE_PASS → PRODUCT_LOCKED`
先可以標完成。
A 線正式五尺寸 QA 未全 PASS 前，本文件所有模組只可獨立開發，不得合併入正式 baseline。
