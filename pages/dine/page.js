import {renderGlobalStatusBar,renderBottomNav,installShellNavigation} from '../../shared/shell.js';

const app=document.getElementById('app');
const terminalId=localStorage.getItem('morefun.terminal.id')||'SMT-T2S';

app.innerHTML=`<main class="smt-app">
  ${renderGlobalStatusBar({terminalId,operationLabel:'接單中',operationTone:'online',lastOrder:'—',context:'堂食'})}
  <section class="workspace">
    <div class="simple-workspace">
      <section class="simple-card">
        <h1>堂食</h1>
        <p>堂食頁保留少量座位操作，只處理開枱、加單、轉外賣及結帳。</p>
        <div class="stat-grid"><span><small>使用中</small><b>3</b></span><span><small>待結帳</small><b>1</b></span><span><small>空枱</small><b>5</b></span></div>
        <div class="placeholder-actions"><button class="btn primary">開枱</button><button>加單</button><button>轉外賣</button><button>結帳</button></div>
      </section>
      <section class="simple-card">
        <h2>高峰速覽</h2>
        <div class="list-stack"><article><span><strong>A1</strong><small>兩位｜加單中</small></span><b>$96</b></article><article><span><strong>A2</strong><small>一位｜待結帳</small></span><b>$52</b></article><article><span><strong>B1</strong><small>空枱</small></span><b>$0</b></article></div>
      </section>
    </div>
  </section>
  ${renderBottomNav('dine')}
</main>`;

installShellNavigation(app);
window.parent?.postMessage({type:'morefun:page-ready',page:'dine'},'*');
