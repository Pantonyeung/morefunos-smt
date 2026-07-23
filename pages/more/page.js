import {renderGlobalStatusBar,renderBottomNav,installShellNavigation} from '../../shared/shell.js';

const app=document.getElementById('app');
const terminalId=localStorage.getItem('morefun.terminal.id')||'SMT-T2S';

app.innerHTML=`<main class="smt-app">
  ${renderGlobalStatusBar({terminalId,operationLabel:'接單中',operationTone:'online',lastOrder:'—',context:'更多'})}
  <section class="workspace">
    <div class="simple-workspace">
      <section class="simple-card">
        <h1>更多</h1>
        <p>更多頁集中放打印、同步、帳號、日結及備份，不再影響點單主流程。</p>
        <div class="stat-grid"><span><small>打印機</small><b>5</b></span><span><small>同步</small><b>正常</b></span><span><small>日結</small><b>未完成</b></span></div>
        <div class="placeholder-actions"><button class="btn primary">打印設定</button><button>帳號權限</button><button>同步狀態</button><button>日結備份</button></div>
      </section>
      <section class="simple-card">
        <h2>高峰速覽</h2>
        <div class="list-stack"><article><span><strong>後廚機甲</strong><small>網口</small></span><b>正常</b></article><article><span><strong>標籤機甲</strong><small>網口</small></span><b>正常</b></article><article><span><strong>備份</strong><small>本機優先</small></span><b>待同步</b></article></div>
      </section>
    </div>
  </section>
  ${renderBottomNav('more')}
</main>`;

installShellNavigation(app);
window.parent?.postMessage({type:'morefun:page-ready',page:'more'},'*');
