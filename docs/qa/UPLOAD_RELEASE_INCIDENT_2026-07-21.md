# SMT 上載與發布事故記錄（2026-07-21）

## 結論

GitHub 並沒有封鎖檔案或分支。事故由兩個獨立問題造成：

1. 手機版 GitHub 批量上載未完整處理新目錄，令 `pages/orders/` 整個目錄缺失。
2. Work 環境的普通 HTTPS Git 沒有寫入憑證，所以 `git push` 無法讀取 Username；這不是 branch protection、程式錯誤或 GitHub 拒絕使用。

## 實際影響

手機成功提交大部分檔案，但遠端仍欠 12 個必要變更：

- 缺少 `pages/orders/index.html`、`pages/orders/page.css`、`pages/orders/page.js`。
- 九個檔案仍是舊版：五個 `docs/ai-context/` 檔案、`ORDER_PAGE_CURRENT_LOCK.md`、`pages/checkout/page.js`、`pages/order/page.css`、`pages/order/page.js`。

因此 AI Context 版本不一致，訂單頁測試亦因 `pages/orders/page.js` 不存在而失敗。

## 已採取修復

- 以遠端最新 commit `bd66e11` 為父節點，不覆蓋手機已上載的 commits。
- 用單一原子 commit 補齊 12 個檔案。
- 以 `force: false` fast-forward 更新 `feat/smt-order-page-v1`。
- 遠端修復 commit：`6236c8c0f089d0bbd447bfffd118e95df0be23b2`。
- 修復後 AI Context 驗證通過、自動測試 59/59 通過、`git diff --check` 通過。

## 往後每次更新的固定程序

1. **先讀遠端**：fetch 目標分支並記錄遠端 HEAD，不假設本地或 ZIP 是最新版。
2. **以遠端為基礎整合**：手機上載後比較 `遠端 HEAD..待發布版本`，不可直接覆蓋或 force push。
3. **檢查新目錄**：發布清單必須包含所有新增路徑；特別檢查手機有否漏掉整個目錄。
4. **核對完整差異**：上載前後都比較檔案清單及內容，不以「upload successful」作完整證明。
5. **先驗證再發布**：執行 `node scripts/validate-ai-context.mjs`、`node --test tests/*.test.mjs`、`git diff --check`。
6. **只准 fast-forward**：使用 `force: false`；遠端 HEAD 改變就停止並重新整合。
7. **上載後遠端回讀**：重新 fetch，確認遠端 commit、內容及測試。
8. **ZIP 只作後備**：GitHub 分支及鎖定文件才是開發基準。

## 禁止重複的做法

- 不再要求使用者用手機逐個建立 folder 或猜測漏檔。
- 不把 HTTPS 缺少憑證誤判為 GitHub 封鎖或 branch protection。
- 不在比較遠端手機 commits 前直接 push、覆蓋或 force push。
- 不因本地測試通過，就假設遠端已包含所有新目錄。
- 不把「部分做到」標記成「已完成」；必須有遠端回讀及測試證據。

## 完成判定

只有遠端包含預期檔案與新目錄、HEAD 是已核對的 fast-forward、Context 驗證及全部測試通過，才可報告完成；報告必須附 commit 與測試數量。
