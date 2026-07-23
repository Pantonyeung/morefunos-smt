import {renderGlobalStatusBar,renderBottomNav,installShellNavigation} from '../../shared/shell.js';

const app=document.getElementById('app');
const terminalId=localStorage.getItem('morefun.terminal.id')||'SMT-T2S';

app.innerHTML=`<main class="smt-app">
  ${renderGlobalStatusBar({terminalId,operationLabel:'接單中',operationTone:'online',lastOrder:'—',context:'訂單'})}
  <section class="workspace">
    <div class="simple-workspace">
      <section class="simple-card">
        <h1>訂單</h1>
        <p>訂單頁集中顯示接單中、完成可取餐、已通知及列印狀態。</p>
        <div class="stat-grid"><span><small>接單中</small><b>4</b></span><span><small>可取餐</small><b>3</b></span><span><small>已通知</small><b>2</b></span></div>
        <div class="placeholder-actions"><button class="btn primary">完成／可取餐</button><button>通知客人</button><button>重印小票</button><button>查找訂單</button></div>
      </section>
      <section class="simple-card">
        <h2>高峰速覽</h2>
        <div class="list-stack"><article><span><strong>MF1001</strong><small>應用單｜可取餐</small></span><b>$59</b></article><article><span><strong>MF1002</strong><small>網站單｜接單中</small></span><b>$104</b></article><article><span><strong>MF1003</strong><small>電話單｜待付款</small></span><b>$48</b></article></div>
      </section>
    </div>
  </section>
  ${renderBottomNav('orders')}
</main>`;

installShellNavigation(app);
window.parent?.postMessage({type:'morefun:page-ready',page:'orders'},'*');
