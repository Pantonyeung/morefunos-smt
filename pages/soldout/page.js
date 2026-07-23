import {renderGlobalStatusBar,renderBottomNav,installShellNavigation} from '../../shared/shell.js';

const app=document.getElementById('app');
const terminalId=localStorage.getItem('morefun.terminal.id')||'SMT-T2S';

app.innerHTML=`<main class="smt-app">
  ${renderGlobalStatusBar({terminalId,operationLabel:'接單中',operationTone:'online',lastOrder:'—',context:'售罄'})}
  <section class="workspace">
    <div class="simple-workspace">
      <section class="simple-card">
        <h1>售罄</h1>
        <p>售罄頁以快速批量操作為主，支援紫米、飯底、飲品及單品售罄。</p>
        <div class="stat-grid"><span><small>今日售罄</small><b>2</b></span><span><small>暫停供應</small><b>1</b></span><span><small>可恢復</small><b>12</b></span></div>
        <div class="placeholder-actions"><button class="btn primary">一鍵售罄</button><button>恢復供應</button><button>紫米專用</button><button>每日重設</button></div>
      </section>
      <section class="simple-card">
        <h2>高峰速覽</h2>
        <div class="list-stack"><article><span><strong>紫米飯團</strong><small>影響飯團套餐</small></span><b>售罄</b></article><article><span><strong>咖喱飯底</strong><small>便當可選</small></span><b>供應中</b></article><article><span><strong>台式奶茶</strong><small>飲品升級</small></span><b>供應中</b></article></div>
      </section>
    </div>
  </section>
  ${renderBottomNav('soldout')}
</main>`;

installShellNavigation(app);
window.parent?.postMessage({type:'morefun:page-ready',page:'soldout'},'*');
