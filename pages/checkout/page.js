import {renderGlobalStatusBar,renderBottomNav,installShellNavigation} from '../../shared/shell.js';

const app=document.getElementById('app');
const terminalId=localStorage.getItem('morefun.terminal.id')||'SMT-T2S';

app.innerHTML=`<main class="smt-app">
  ${renderGlobalStatusBar({terminalId,operationLabel:'接單中',operationTone:'online',lastOrder:'—',context:'收銀'})}
  <section class="workspace">
    <div class="simple-workspace">
      <section class="simple-card">
        <h1>收銀</h1>
        <p>收銀頁已改用 1280×800 清潔版骨架；付款、找續、付款方式及備註集中處理。</p>
        <div class="stat-grid"><span><small>待收款</small><b>2</b></span><span><small>已付款</small><b>5</b></span><span><small>異常</small><b>0</b></span></div>
        <div class="placeholder-actions"><button class="btn primary">現金收款</button><button>電子付款</button><button>找續檢查</button><button>付款備註</button></div>
      </section>
      <section class="simple-card">
        <h2>高峰速覽</h2>
        <div class="list-stack"><article><span><strong>電子付款</strong><small>今日已核對</small></span><b>$326</b></article><article><span><strong>現金</strong><small>待日結</small></span><b>$188</b></article><article><span><strong>平台</strong><small>只作記錄</small></span><b>$420</b></article></div>
      </section>
    </div>
  </section>
  ${renderBottomNav('checkout')}
</main>`;

installShellNavigation(app);
window.parent?.postMessage({type:'morefun:page-ready',page:'checkout'},'*');
