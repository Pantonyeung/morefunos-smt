# SMT Shared Supply Runtime｜接手與進度｜2026-07-31

> 狀態：CURRENT CHECKPOINT / SOURCE IMPLEMENTED / TARGETED CONTRACT PASS / DEPLOYMENT AND DEVICE ACCEPTANCE PENDING  
> Current Authority：`smt-main-candidate-v1`／PR #34  
> 適用：SMT Register Profile、SMM Mobile Profile、Admin Worker、Customer Public Runtime  
> 正確回滾點：`backup/supply-runtime-pre-unified-20260731-v2` → `bd8de413ed17cbc1196abed512ef009a7c5fb1fa`

## 1. 需求與目前結論

### SMT／SMM 售罄
- SMT、SMM 都可以操作「今日售罄／暫停供應／恢復供應」。
- SMM 不是第二套 App；是同一 SMT Shared Application 的 Mobile Profile。
- 本機先寫、斷線排隊、重連及重新登入後同步的 Source Implementation 已完成。
- Targeted Contract 已執行通過。
- Admin Worker、SMT Pages Functions、兩部裝置及 Customer 實際閉環仍待 staging／device acceptance。

### Customer 離線菜單
- Customer 保存最近一份完整有效 Runtime，並保留上一份有效版本。
- 新 Runtime 無效時不會覆蓋最後有效菜單。
- 最新快照損壞時回退上一份有效快照。
- Source Implementation 及本機 Targeted Contract 已通過。
- 真實 iPhone／Safari／PWA 斷線重開驗收仍待完成。

## 2. 唯一 Authority／責任

| 決策 | 唯一 Authority |
|---|---|
| 售罄操作 UI | `pages/soldout/page.js` |
| 本機供應狀態 | `SUPPLY_STORAGE_KEY` |
| 跨端同步／Queue／Staff Session | `shared/supply-runtime.js` |
| Shell 登入與離線降級 | `shell-startup.js` |
| 重連登入事件橋 | `shared/supply-session-control.js` |
| Page storage refresh | `shared/supply-page-bridge.js` |
| Server operational truth | Firebase `morefun/runtime/operations/v1/availability` |
| Staff API | Admin Worker `/v1/staff/availability` |
| Customer projection | Admin Worker Public Runtime overlay |
| Customer 離線快照 | `customerOfflineRuntimeStore.js` |

禁止：MutationObserver、DOM 掃描、`Storage.prototype` patch、獨立 SMM Domain、Admin publish 覆蓋 operational availability。

## 3. 正式資料流

```text
SMT Register / SMM Mobile
→ pages/soldout local update
→ writeJSON(SUPPLY_STORAGE_KEY)
→ morefun:critical-storage-written
→ Shell Supply Runtime pending queue
→ SMT same-origin Pages Function
→ Admin Worker Staff API
→ Firebase operational availability
→ Customer Public Runtime overlay
→ Customer latest-valid / previous-valid offline cache
```

## 4. 今次正式修改

### SMT Candidate
- `shared/supply-runtime.js`
  - persisted Staff Session 必須同目前 `source + deviceId` 一致；SMT token 不可被 SMM 重用。
  - 401／403 會清除失效 token，但保留本機供應狀態與 pending queue。
  - 網絡／5xx 保持 `offline-local`，不刪 Staff Session 或 Queue。
  - 登入後即時 flush 舊 Queue 如遇 auth revoke，登入流程會明確失敗，不能假裝成功。
- `shell-startup.js`
  - 改為 remote-first Staff Login。
  - 401／403 明確拒絕；只有網絡類失敗且本機已有相同帳密才可 offline fallback。
  - 已解鎖 Shell 可重新登入，不會重跑開工現金流程。
  - 顯示 connected／syncing／offline-local／session-required／pending count。
- `shared/supply-session-control.js`
  - 只做 status control 事件橋；登入 Gate 由 `shell-startup.js::showLogin` 單一控制。
- 新增：
  - `tests/supply-runtime.test.mjs`
  - `tests/supply-profile-contract.test.mjs`

### Admin Worker
- 新增 `worker/test/staff-availability-smm.test.mjs`。
- 明確驗證 `source=smm` 可寫同一 Firebase operational availability，並留下 SMM device audit。
- `package.json` 已把 SMM contract 納入 `test:staff-availability`、`test:contracts`、`test:firebase`。

### Customer
- 今次沒有重造第二套 cache。
- 已核對既有：
  - `customerOfflineRuntimeStore.js`
  - `morefunPublicRuntime.js`
  - `customerRuntimeAdapter.js`
  - `tests/customer-offline-runtime-store.test.mjs`
  - `tests/customer-public-runtime-client.test.mjs`
  - `tests/customer-availability-status-normalization.test.mjs`
- `soldout` 與 `paused` 都會令 Customer `is_available=false`，但保留各自狀態語意。

## 5. 已執行 Targeted Evidence

> 以下為同 committed source 對齊的 isolated local verification；不是 Full Repository／Browser／Device Gate。

| Gate | 結果 |
|---|---|
| `shared/supply-runtime.js` syntax | PASS |
| `shell-startup.js` syntax | PASS |
| `shared/supply-session-control.js` syntax | PASS |
| SMT／SMM Supply Runtime contract | 6／6 PASS |
| Shared Profile／same-origin wiring contract | 5／5 PASS |
| Admin SMM availability mutation contract | PASS |
| Customer latest／previous valid offline cache contract | 4／4 PASS |

未執行：Full SMT Node regression、Browser Matrix、Android compile、Cloudflare staging、兩裝置 propagation、iPhone PWA offline cold start。

## 6. 踩坑與成功方案

### K1｜舊分支有功能，不代表 Current Authority 完成
第一版售罄同步曾落在已被取代的舊分支。

**成功方案：**先讀 Current Registry、AGENTS、PR head，再寫入 `smt-main-candidate-v1`。

### K2｜Keyed localStorage 丟失產品 ID
`{F4:{status:'soldout'}}` 若直接 `Object.values()`，會失去 `F4`。

**成功方案：**用 entries 正規化，將 key 注入 canonical `productId`。

### K3｜SMT／SMM 共用瀏覽器 storage 會錯用 token
同一 Staff Session key 可能令 Mobile Profile 沿用 Register token，audit source／device 失真。

**成功方案：**session 必須同目前 `source + deviceId` 完全一致；不一致立即清除 token，但不刪供應資料／Queue。

### K4｜先查本機帳密會阻塞 Admin 新帳號
舊流程先要求 local account match，Admin 新增但未落本機的 Staff 無法登入。

**成功方案：**remote-first；只有 network failure 才檢查 local offline fallback。

### K5｜401／403 不等於離線
若把 auth failure 當網絡失敗，會錯誤放行失效／停用帳號。

**成功方案：**401／403 明確拒絕並要求重新登入；network／5xx 才進 offline-local。

### K6｜登入成功後 flush 仍可能撤銷 token
Login 200 後，舊 Queue PATCH 可能立即收到 401；原流程可能仍然回報登入成功。

**成功方案：**login-to-flush auth race 有獨立 contract；flush 失效後 login 必須 throw，Queue 保留。

### K7｜安全上不能保存密碼，自動換 token 不成立
首次離線登入只能本機開工，網絡恢復後不能靜默取得 Staff JWT。

**成功方案：**Shell status 提供重新登入入口；登入後自動 flush。

### K8｜Admin publish 不可覆蓋現場售罄
餐牌版本同 operational availability 是兩種 authority。

**成功方案：**Admin publish 更新 catalog；售罄只寫 operational path；Customer Runtime read-time overlay。

### K9｜Preview CORS 造成跨網域脆弱點
Browser 直接打 Admin Worker 會受 Preview origin／CORS 影響。

**成功方案：**SMT／Customer 均使用 same-origin Pages Function proxy。

### K10｜回滾分支曾指向較早 commit
第一次修正 backup ref 時使用了過早 head。

**成功方案：**新建不可混淆的 `backup/supply-runtime-pre-unified-20260731-v2`，精確指向改碼前 `bd8de413…`；舊 backup 名稱不得作正式回滾依據。

### K11｜Source／Contract／Deployment／Device 不可混寫
程式存在或 isolated test pass 不等於跨裝置成功。

**成功方案：**所有接手紀錄固定分六層：Source、Targeted Test、Full Test、Deployment、Device、Production。

## 7. 未完成 Gate

1. Full SMT Node regression。
2. Admin Worker latest staging deployment。
3. SMT Pages Functions latest staging deployment。
4. Customer latest staging deployment。
5. SMT 設售罄 → SMM 15 秒內收到 → Customer 不可下單。
6. SMM 恢復 → SMT／Customer 同步。
7. 斷網改狀態 → Queue 保留 → 重連未登入不丟失 → 重新登入後 flush。
8. 香港時間 05:00 跨日 staging 實測。
9. iPhone／Android Mobile Profile 操作與排版。
10. Customer Safari／PWA 離線 cold start 顯示 latest-valid menu 與更新時間。

## 8. 下一步唯一優先

部署 Admin＋SMT＋Customer staging，完成兩裝置＋Customer 的真實供應狀態閉環；未通過前不得標記 Production Ready。
