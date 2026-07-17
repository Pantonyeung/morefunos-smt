# More Fun SMT Web Core V1.0

基於《MoreFun SMT Web UI Slide Master Lock V1.0》建立的可操作 Web Core 第一版。

## 已實作
- 橫屏 SMT Shell、頂部全局狀態、底部五項導航
- 六套主題輪換、快速模式
- 點單、分類、搜尋、商品卡、購物車、結帳及正式成單模擬
- 新 App／Web 訂單彈窗、稍後處理、角標
- 訂單30分鐘倒數視圖
- 堂食枱位與35分鐘提示
- 今日售罄／暫停供應／恢復
- 更多入口、全局狀態中心
- localStorage 本機狀態保存
- PWA manifest及service worker

## 未接入
- 真實 Firebase／Cloudflare Worker／Admin Catalog
- Room／SQLite原生層
- 五部打印機原生服務
- 真實付款核實、退款、日結及備份資料層

以上未接入項目已保留清楚介面邊界，應以垂直切片逐步接入，不能改動已封板UI及業務規則。

## 本機預覽
```bash
python3 -m http.server 8080
```
打開 `http://localhost:8080`。
