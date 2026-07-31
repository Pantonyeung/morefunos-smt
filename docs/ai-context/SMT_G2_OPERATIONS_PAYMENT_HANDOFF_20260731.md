# SMT／SMM｜G2 營運權限＋付款審批接手｜2026-07-31

> Branch：`smt-main-candidate-v1`  
> Head at intake：`5e9d17509448661123bef1e446099e65dcfda1b0`  
> Status：`REQUIREMENTS INTAKE / DESIGN REVIEW PENDING / NO NEW FEATURE CODE`

## 1. Application Boundary

- SMT Register與SMM Mobile係同一Application的不同Profile；
- 共用Domain、API、Firebase operational state及Audit；
- 禁止重新建立獨立SMM Core；
- UI可因Profile改composition，但業務狀態與審批結果只得一個Authority。

## 2. Catalog Scope

SMT／SMM只可讀取及操作Admin分發到該端的Assigned Catalog。

- 不可自行建立權威產品；
- 不可用本機fallback取代Admin Published Catalog；
- Admin回收assignment後，下次refresh必須移除操作權；
- 已存在cart／order引用被回收產品時，要保留歷史資料但禁止新下單。

## 3. Availability Permission

SMT／SMM可控制Admin授權產品：

- 供應中；
- 售罄；
- 停售／paused。

每次寫入必須：

1. Staff Session有效；
2. source／deviceId一致；
3. 產品在本端assignment；
4. scope包含`availability.write.assigned`；
5. Admin runtimeLock未鎖定；
6. expectedRevision正確；
7. Worker回canonical result後才標同步成功。

本機離線可先保存pending queue，但不得將未同步狀態當成其他端已生效。

## 4. Store／Pickup Runtime

SMT／SMM可在獲授權下控制：

- 開店／休息／暫停接單；
- 今日臨時營業時間；
- 等候分鐘；
- 最早／最遲取餐時間；
- 對客原因。

UI必須顯示：

- server revision；
- 最後同步時間；
- actor／source；
- offline-local／pending／connected／conflict／locked；
- Admin lock原因。

衝突409時不得靜默覆蓋；先refresh，再顯示最新狀態及重試選項。

## 5. Offline WhatsApp Intake

Customer離線WhatsApp訊息只係`OFFLINE_UNCONFIRMED` intake。

SMT／SMM後續要支援：

- 按localOrderId搜尋／建立正式order；
- 檢查menuVersion／savedAt；
- 重新計價及檢查availability；
- 確認取餐時間；
- 防止同一localOrderId重複建立；
- 回覆Customer正式接單結果。

未完成reconciliation前，WhatsApp訊息不可自動進廚房／打印。

## 6. Payment Proof Review

SMT／SMM共用同一Payment Review Queue。

每張待審批卡顯示：

- order ID／來源；
- Customer；
- payment method；
- expected amount；
- proof image／submittedAt；
- duplicate signal；
- current paymentStatus／orderStatus。

Staff操作：

- 批准；
- 拒絕；
- 要求重新上傳。

規則：

- 圖片只係submission；
- Staff必須核對實際收款紀錄；
- approval寫Server Audit；
- 已批准後變更需要Admin override；
- 電子支付未approved，order不可transition到accepted／print；
- 同一proof decision使用idempotency防雙按。

## 7. Existing Source

- shared Supply Runtime；
- Staff Session／pending queue；
- Soldout Page；
- SMT／SMM source分流；
- 15秒refresh；
- same-origin proxy。

## 8. New Source Not Started

- Assigned Catalog enforcement；
- permission scope／runtimeLock UI；
- store／pickup multiwriter controller；
- WhatsApp intake reconciliation；
- Payment Review Queue；
- proof signed view；
- approval→order gate；
- browser／device acceptance。

## 9. 禁止做法

- 第二套SMM queue；
- 直接寫Firebase；
- Client timestamp決定勝負；
- DOM掃描取得order／payment state；
- payment screenshot自動判真；
- 未approved先打印／製作；
- Offline WhatsApp單自動同Online submit雙重建立。

## 10. Central References

- `Pantonyeung/morefunos/docs/handoff/MOREFUNOS_G2_OPERATIONS_AUTHORITY_HANDOFF_20260731.md`
- `Pantonyeung/morefunos/docs/qa/MOREFUNOS_G2_PITFALLS_20260731.md`
- `Pantonyeung/morefunos/docs/architecture/MOREFUNOS_G2_SUCCESS_SOLUTION_20260731.md`
