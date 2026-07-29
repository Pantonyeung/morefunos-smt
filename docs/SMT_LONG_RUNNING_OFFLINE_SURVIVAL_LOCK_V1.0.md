# SMT 長時間離線生存規格 Lock V1.0

更新：2026-07-29

## 核心要求

首次成功連網並完成資料同步後，SMT 必須把完整可營運資料下載並保存於收銀機。本地資料不可只作短期 cache；斷網後必須可以重新開機及長時間維持營運。

## 必須本機保存

- 產品及分類
- 選項群組
- 套餐規則
- 價格及計價資料
- Runtime／售罄／等候時間
- 打印規則、打印機設定及工作佇列
- SMT 設定
- 營運資料、訂單、草稿、堂食及供應覆蓋
- 版本、來源、時間及 checksum

## 儲存策略

- IndexedDB 保存完整版本化資料包。
- 保留 Active、Previous 及最近三個可用世代。
- 新資料必須完整下載及校驗後才可取代 Active。
- 新資料失敗時繼續使用 Last-known-good。
- localStorage 保留現有即時操作資料及離線寫入 queue。
- Service Worker 保存 App Shell、各主要頁面、JS 及 CSS，支援斷網後冷啟動。

## 斷網營運

斷網不得阻塞：登入、開工、點單、計價、付款、本機訂單保存、售罄、日結、打印工作建立及本機報表。

所有需要外部同步的寫入必須加入本機 queue；恢復網絡後按 idempotency、revision 及 conflict guard 補傳。

## 上線 Gate

- 首次在線完整下載測試
- 下載途中斷線測試
- Active package 損壞後 Previous fallback 測試
- 完全斷網重新開 App 測試
- 斷網持續跨營業日測試
- 斷網大量訂單及打印 queue 壓力測試
- 恢復網絡補傳及衝突測試
- Android WebView／APK 實機儲存保留測試

未完成以上驗證，不得宣稱長時間離線 release-ready。
