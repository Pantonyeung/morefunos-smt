# More Fun SMT｜C 線 PR #19 處理決策補充 V1.1

狀態：CURRENT / REVERSIBLE DECISION  
日期：2026-07-28  
正式基準：`smt-functional-completeness-v1`

## 目的

本補充文件修正 V1.0 交接文件中過早把 PR #19 定性為必須廢棄的表述。

正式原則不是「一定新開 PR」，而是：

> 以最快、最安全、最容易完成 APK 封裝並留下可驗證證據為唯一判斷標準。

PR #19 暫時保留，不立即關閉、不刪除、不破壞。其內容可作：

- 原地整理對象；
- 核心資產來源；
- 舊歷史封存；
- 新乾淨 PR 的來源參考。

## 三條可行路線

### 路線 A｜原地整理 PR #19

做法：rebase／重寫 PR #19 branch，保留同一 PR 編號。

優點：

- 唔需要另開 PR；
- 原有討論、連結同上下文保留；
- 若一次性 clean rebuild workflow 成功，可直接把同一 branch 重寫到最新 base。

缺點：

- 目前 ahead 約 99、behind 約 84、mergeable false；
- 歷史改寫失敗時容易再產生混亂；
- GitHub Actions 及 PR 狀態可能因 force update 需要重新核對；
- 需要證明最終 diff 只保留 APK Authority，不能只睇 commit 數減少。

適用條件：

- 可以自動把 branch 重建成 latest base + 1 至數個乾淨 commits；
- 重建後 behind = 0；
- mergeable = true；
- Gradle Debug build + artifact + checksum PASS。

### 路線 B｜抽核心到新 PR，PR #19 封存

做法：由最新 base 建立新 branch，只搬入經核對的 `android/**`、APK workflows、APK docs；新開 PR。PR #19 標記 superseded/reference only，但保留不刪。

優點：

- 最容易審核；
- 完全避開 99 commits 歷史；
- 可以逐批搬入、逐批 build；
- PR diff 清楚，風險最低；
- A 線 Clean Rebuild 已證明此策略有效。

缺點：

- 需要新 PR；
- 原 PR 討論要由交接文件串接；
- 需要確保冇漏搬有效資產。

適用條件：

- PR #19 原地重寫仍然 mergeable false；
- clean rebuild workflow 未能可靠完成；
- GitHub history／workflow trigger 持續干擾；
- 新 branch 可以更快完成 compile gate。

### 路線 C｜先保留 PR #19，建立短期比較分支

做法：不關閉 PR #19；另由最新 base 建立一個 temporary clean candidate，搬核心後跑 build。比較兩者成本，再決定最終使用哪個 PR。

優點：

- 決策完全可逆；
- 可以用實際 build 結果決定，而唔係估；
- 不會提早破壞 PR #19。

缺點：

- 短期會有兩條 branch；
- 需要清楚標記 authority，避免兩邊同時繼續加功能。

## 目前建議

目前最合理、最快的策略係「路線 C → 以結果決定 A 或 B」：

1. 保留 PR #19；
2. 停止在 PR #19 加新功能，只容許重建／驗證；
3. 由最新 base 建立乾淨 candidate；
4. 只搬 APK 核心；
5. 跑 static preflight、Gradle assembleDebug、APK non-empty、SHA-256 artifact；
6. 比較：
   - 若 PR #19 可被 clean rewrite 成同樣乾淨結果，保留 PR #19；
   - 若 PR #19 仍有歷史／merge 問題，使用新 PR，PR #19 封存。

## 決策門檻

選擇保留 PR #19，必須同時達到：

- behind = 0；
- ahead 小量、可理解；
- changed files 只屬 APK Authority；
- mergeable = true；
- static preflight PASS；
- Gradle Debug build PASS；
- APK artifact + SHA-256 可取得；
- 不修改 A 線 Runtime／UI／商業規則。

任何一項未達，立即轉新 PR，不再浪費時間修舊歷史。

## 封存原則

若最終使用新 PR：

- PR #19 不刪除；
- 更新標題或留言為 `SUPERSEDED / REFERENCE ONLY`；
- 保留所有有效設計作 audit trail；
- 新 PR body 必須引用 PR #19 及本交接文件；
- 禁止兩個 PR 同時作 Production Authority。
