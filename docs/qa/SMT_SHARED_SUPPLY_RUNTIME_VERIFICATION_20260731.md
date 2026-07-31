# SMT Shared Supply Runtime｜驗證狀態｜2026-07-31

> Current branch：`smt-main-candidate-v1`  
> Evidence level：SOURCE IMPLEMENTED / TARGETED ISOLATED CONTRACT PASS / FULL REPO AND DEVICE PENDING

## 1. Source checks

| 檢查 | 狀態 |
|---|---|
| Shared Supply Domain 存在 | PASS — source present |
| SMT Register 使用現有 Soldout Page | PASS — source present |
| SMM Mobile 使用同一 Soldout Page／Domain | PASS — source present |
| Staff login same-origin proxy | PASS — source present |
| Availability GET／PATCH same-origin proxy | PASS — source present |
| 本機 pending queue | PASS — source present |
| Offline re-login control | PASS — source present |
| Order／Soldout shared storage refresh | PASS — source present |
| SMT token 不可被 SMM profile 重用 | PASS — source＋targeted contract |
| 401／403 清 token 但保留 Queue | PASS — source＋targeted contract |
| Network failure 保持 offline-local | PASS — source＋targeted contract |
| Remote-first login／local offline fallback | PASS — source＋static contract |
| MutationObserver absent from Supply Runtime | PASS — static source review |
| `Storage.prototype` patch absent | PASS — static source review |

## 2. Executed targeted evidence

> 執行環境：隔離本機 Node reconstruction，內容與 committed source 對齊。呢個證據不等於 Full Repository／Browser／Device Pass。

| Command scope | 結果 |
|---|---|
| Supply Runtime syntax | PASS |
| Shell Startup syntax | PASS |
| Supply Session Control syntax | PASS |
| `tests/supply-runtime.test.mjs` | 6／6 PASS |
| `tests/supply-profile-contract.test.mjs` | 5／5 PASS |
| Admin `source=smm` availability mutation | PASS |
| Customer offline latest／previous cache | 4／4 PASS |

## 3. Contracts committed

### SMT
- `tests/supply-runtime.test.mjs`
- `tests/supply-profile-contract.test.mjs`

### Admin
- `worker/test/staff-availability-hk-cutoff.test.mjs`
- `worker/test/staff-availability.test.mjs`
- `worker/test/staff-availability-smm.test.mjs`
- `worker/test/customer-availability-overlay.test.mjs`

### Customer
- `tests/customer-offline-runtime-store.test.mjs`
- `tests/customer-public-runtime-client.test.mjs`
- `tests/customer-availability-status-normalization.test.mjs`

## 4. Completion verdict

### SMT／SMM 同時控制售罄

`SOURCE IMPLEMENTED + TARGETED CONTRACT PASS`

尚未可標記：`DEPLOYED`、`DEVICE PASS`、`PRODUCTION READY`。

### Customer 斷線保留最新有效本機菜單

`SOURCE IMPLEMENTED + LOCAL CACHE CONTRACT PASS`

已證明：
- latest-valid 保存；
- previous-valid 保留；
- invalid new Runtime 不覆蓋 latest-valid；
- latest 損壞回退 previous-valid。

尚未可標記：Safari／PWA cold-start offline device pass。

## 5. Not yet verified

- Full SMT Node regression against latest head。
- Full Admin test suites against latest head。
- Full Customer Runtime suites against latest head。
- Browser QA matrix。
- Cloudflare Pages Functions deployment。
- Admin Worker latest deployment。
- Live Staff account/token acceptance。
- Cross-device propagation latency。
- Customer UI actual soldout／paused result。
- iPhone／Android Mobile Profile。
- 05:00 HKT real-time expiry。
- Customer Safari／PWA offline cold start。

## 6. Required staging matrix

1. SMT／Register：F4 → 今日售罄。
2. SMM／Mobile：15 秒內顯示 F4 售罄。
3. Customer Runtime：F4 `is_available=false`／`availability_status=soldout`。
4. Customer UI：F4 不可加入購物車。
5. SMM：F4 → 恢復供應。
6. SMT／Customer：狀態同步。
7. 關網：R1 → paused；本機仍顯示，pending queue > 0。
8. 開網但未重新登入：Queue 保留。
9. 重新登入：Queue flush，Customer 收到 paused。
10. 將 token 撤銷：Queue 保留、狀態顯示重新登入，不能假裝 connected。
11. Customer Runtime 斷線：顯示 latest-valid offline menu，標示更新時間。
12. 破壞 latest cache：自動回退 previous-valid。
13. 香港時間 05:00：今日售罄自動失效；paused 不自動失效。

## 7. Acceptance language

未完成以上 staging／device matrix 前，唯一正確結論：

`SOURCE IMPLEMENTED / TARGETED CONTRACT PASS / DEPLOYMENT AND DEVICE ACCEPTANCE PENDING`
