import assert from 'node:assert/strict';
import {existsSync,readFileSync,statSync} from 'node:fs';
import test from 'node:test';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');

test('公網外層在 1280 闊度使用實際畫布，不再把 1920 整頁縮細',()=>{
  const loader=read('app-loader.js');
  assert.match(loader,/MAX_CANVAS_WIDTH\s*=\s*1920/);
  assert.match(loader,/logicalWidth\s*=\s*Math\.min\(MAX_CANVAS_WIDTH,size\.width\)/);
  assert.match(loader,/stage\.style\.width\s*=\s*logicalWidth\s*\+\s*'px'/);
  assert.match(loader,/frame\.style\.width\s*=\s*logicalWidth\s*\+\s*'px'/);
});

test('六個公網頁面按裝置實際闊度排版',()=>{
  for(const page of ['order','checkout','orders','dine','soldout','more']){
    const html=read(`pages/${page}/index.html`);
    assert.match(html,/name=["']viewport["'][^>]+width=device-width/);
    assert.doesNotMatch(html,/width=1920/);
  }
  const base=read('shared/page-base.css');
  assert.match(base,/#app\s*\{[^}]*width:\s*100%/s);
  assert.match(base,/\.app\s*\{[^}]*width:\s*100%/s);
  assert.doesNotMatch(base,/width:\s*1920px/);
});

test('後備餐牌引用的每張產品圖都真實存在',()=>{
  const data=read('pages/order/page-data.js');
  const paths=[...data.matchAll(/image:'\.\.\/\.\.\/(assets\/products\/[^']+)'/g)].map(match=>match[1]);
  assert.ok(paths.length>=10,'未讀到後備產品圖片路徑');
  for(const path of new Set(paths)){
    const url=new URL(path,root);
    assert.equal(existsSync(url),true,`${path} 不存在`);
    assert.ok(statSync(url).size>100,`${path} 係空白或無效圖片`);
  }
});

test('T2S 點單維持四欄、完整圖片及三分一快捷飲品上限',()=>{
  const css=read('pages/order/page.css');
  const t2s=css.slice(css.lastIndexOf('@media (max-width: 1400px)'));
  assert.match(
    t2s,
    /\.products-large,\s*\.products-small,\s*\.products-text\s*\{[^}]*grid-template-columns:\s*repeat\(4,/s
  );
  assert.match(css,/\.product-hero img,\s*\.product-thumb img\s*\{[^}]*object-fit:\s*contain/s);
  assert.match(t2s,/\.quick-drawer-panel\s*\{[^}]*height:\s*33vh[^}]*max-height:\s*240px/s);
});

test('T2S 更多頁保留兩欄三行，詳情層不遮底部導航',()=>{
  const css=read('pages/more/page.css');
  const t2s=css.slice(css.lastIndexOf('@media (max-width:1400px)'));
  assert.match(t2s,/\.more-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s);
  assert.match(t2s,/\.more-grid\s*\{[^}]*grid-template-rows:\s*repeat\(3,/s);
  assert.match(t2s,/\.dialog-scrim\s*\{[^}]*inset:\s*58px 0 58px/s);
  assert.match(t2s,/\.detail-dialog\s*\{[^}]*max-height:\s*calc\(100vh - 130px\)/s);
});
