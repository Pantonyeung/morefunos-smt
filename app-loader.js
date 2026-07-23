const BUILD='smt-t2s-1280x800-product-design-rewrite.01';
const target='./pages/order/index.html';
const hash=location.hash&&location.hash!=='#' ? location.hash : '';
if(!location.pathname.endsWith('/pages/order/index.html')){
  location.replace(target+hash);
}
export {BUILD};
