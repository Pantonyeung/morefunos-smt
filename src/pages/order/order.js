import {MOCK_CATEGORIES,MOCK_PRODUCTS} from '../../data/mock-catalog.js';

const state={category:'all',query:'',ratio:'30-70',cart:[]};

function money(value){return `$${Number(value||0).toFixed(0)}`}
function cartTotal(){return state.cart.reduce((sum,line)=>sum+(line.price*line.qty),0)}

function addProduct(product){
  if(product.soldout)return;
  const line=state.cart.find(item=>item.id===product.id);
  if(line)line.qty+=1;else state.cart.push({...product,qty:1});
}

function changeQty(id,delta){
  const line=state.cart.find(item=>item.id===id);
  if(!line)return;
  line.qty+=delta;
  if(line.qty<=0)state.cart=state.cart.filter(item=>item.id!==id);
}

function filteredProducts(){
  const q=state.query.trim().toLowerCase();
  return MOCK_PRODUCTS.filter(product=>{
    const categoryOk=state.category==='all'||product.category===state.category;
    const searchOk=!q||`${product.name} ${product.subtitle}`.toLowerCase().includes(q);
    return categoryOk&&searchOk;
  });
}

function productGridMarkup(){
  const products=filteredProducts();
  return products.length?products.map(product=>`
    <button type="button" class="product-card product-card--${product.mode}${product.soldout?' is-soldout':''}" data-product-id="${product.id}" ${product.soldout?'disabled':''}>
      <span class="product-card__flag">${product.soldout?'測試售罄':'測試商品'}</span>
      <strong>${product.name}</strong>
      <span>${product.subtitle}</span>
      <b>${money(product.price)}</b>
    </button>`).join(''):`<div class="product-empty">沒有符合搜尋條件的測試商品</div>`;
}

function bindProductButtons(container){
  container.querySelectorAll('[data-product-id]').forEach(button=>button.addEventListener('click',()=>{
    const product=MOCK_PRODUCTS.find(item=>item.id===button.dataset.productId);
    if(!product)return;
    addProduct(product);
    renderOrderPage(container);
  }));
}

function refreshProductGrid(container){
  const grid=container.querySelector('.product-grid');
  if(!grid)return;
  grid.innerHTML=productGridMarkup();
  bindProductButtons(container);
}

export function renderOrderPage(container){
  container.innerHTML=`
    <section class="order-page" data-ratio="${state.ratio}">
      <aside class="order-cart" aria-label="測試購物車">
        <header class="order-cart__head">
          <div><span class="test-badge">測試資料</span><h1>購物車</h1></div>
          <span class="cart-count">${state.cart.reduce((n,line)=>n+line.qty,0)} 件</span>
        </header>
        <div class="order-cart__list">
          ${state.cart.length?state.cart.map(line=>`
            <article class="cart-line" data-line-id="${line.id}">
              <div class="cart-line__copy"><strong>${line.name}</strong><span>${line.subtitle}</span></div>
              <strong class="cart-line__price">${money(line.price*line.qty)}</strong>
              <div class="cart-line__actions">
                <button type="button" data-cart-action="minus" data-id="${line.id}">－</button>
                <span>${line.qty}</span>
                <button type="button" data-cart-action="plus" data-id="${line.id}">＋</button>
                <button type="button" class="modify" disabled>修改</button>
              </div>
            </article>`).join(''):`<div class="cart-empty"><strong>購物車暫時未有項目</strong><span>按右邊測試商品加入，驗證版面同操作。</span></div>`}
        </div>
        <footer class="order-cart__footer">
          <button type="button" class="secondary" disabled aria-disabled="true">暫存｜未實作</button>
          <button type="button" class="secondary" disabled aria-disabled="true">取單｜未實作</button>
          <button type="button" class="checkout" disabled aria-disabled="true">結帳｜未實作 ${money(cartTotal())}</button>
        </footer>
      </aside>

      <section class="order-products" aria-label="測試商品區">
        <header class="product-toolbar">
          <div class="category-strip" role="tablist" aria-label="測試分類">
            ${MOCK_CATEGORIES.map(category=>`<button type="button" data-category="${category.id}" aria-selected="${state.category===category.id}">${category.name}</button>`).join('')}
          </div>
          <label class="search-box"><span>搜尋</span><input id="mock-search" type="search" inputmode="search" autocomplete="off" autocorrect="off" spellcheck="false" value="${state.query.replaceAll('"','&quot;')}" placeholder="搜尋測試商品"></label>
        </header>

        <div class="order-test-controls">
          <span>工作區比例（個人顯示設定）</span>
          <div class="ratio-switch" role="group" aria-label="工作區比例">
            ${['25-75','30-70','32-68'].map(value=>`<button type="button" data-ratio-value="${value}" aria-pressed="${state.ratio===value}">${value.replace('-', '/')}</button>`).join('')}
          </div>
        </div>

        <div class="product-grid">${productGridMarkup()}</div>

        <button type="button" class="quick-drink-handle" disabled>快捷飲品｜後續接入</button>
      </section>
    </section>`;

  container.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
    state.category=button.dataset.category;
    renderOrderPage(container);
  }));

  const searchInput=container.querySelector('#mock-search');
  searchInput?.addEventListener('input',event=>{
    state.query=event.currentTarget.value;
    refreshProductGrid(container);
  });

  bindProductButtons(container);

  container.querySelectorAll('[data-cart-action]').forEach(button=>button.addEventListener('click',()=>{
    changeQty(button.dataset.id,button.dataset.cartAction==='plus'?1:-1);
    renderOrderPage(container);
  }));

  container.querySelectorAll('[data-ratio-value]').forEach(button=>button.addEventListener('click',()=>{
    state.ratio=button.dataset.ratioValue;
    renderOrderPage(container);
  }));
}