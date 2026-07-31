# SMT Shared Supply Runtime｜驗證狀態｜2026-07-31

> Current branch：`smt-main-candidate-v1`  
> Evidence level：SOURCE PRESENT / CONTRACTS COMMITTED / EXECUTION PENDING

## Source checks

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
| MutationObserver absent from Supply Runtime | PASS — static source review |
| `Storage.prototype` patch absent | PASS — static source review |

## Contracts committed

- `tests/shared-supply-runtime.test.mjs`
- `tests/shared-supply-runtime-integration.test.mjs`

## Not yet verified

- Node execution against latest head.
- Full SMT Node regression.
- Browser QA matrix against latest head.
- Cloudflare Pages Functions deployment.
- Admin Worker latest deployment.
- Live Staff account/token acceptance.
- Cross-device propagation latency.
- Customer UI availability result.
- iPhone／Android Mobile Profile.
- 05:00 HKT real-time expiry.

## Required staging matrix

1. SMT／Register：F4 → 今日售罄。
2. SMM／Mobile：15 秒內顯示 F4 售罄。
3. Customer Runtime：F4 `is_available=false`／`availability_status=soldout`。
4. Customer UI：F4 不可加入購物車。
5. SMM：F4 → 恢復供應。
6. SMT／Customer：狀態同步。
7. 關網：R1 → paused；本機仍顯示，pending queue > 0。
8. 開網但未重新登入：Queue 保留。
9. 重新登入：Queue flush，Customer 收到 paused。
10. Customer Runtime 斷線：顯示 latest-valid offline menu，標示更新時間。

## Acceptance language

未完成以上 staging／device matrix 前，唯一正確結論：

`SOURCE IMPLEMENTED / CONTRACTS COMMITTED / DEPLOYMENT AND DEVICE ACCEPTANCE PENDING`
