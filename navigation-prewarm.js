(()=>{
  const moduleAssets=[
    'pages/order/page.js?v=order-v1-31',
    'pages/orders/page.js?v=order-v1-31',
    'pages/dine/page.js?v=order-v1-31',
    'pages/soldout/page.js?v=order-v1-31',
    'pages/more/page.js?v=order-v1-31',
    'pages/checkout/page.js?v=order-v1-31'
  ];
  const styleAssets=[
    'shared/page-base.css?v=order-v1-31',
    'shared/responsive-pages.css?v=adaptive-v1',
    'shared/adaptive-layout.css?v=adaptive-proportion-v1',
    'shared/adaptive-dine.css?v=adaptive-dine-v1',
    'pages/order/page.css?v=order-v1-31',
    'pages/orders/page.css?v=order-v1-31',
    'pages/dine/page.css?v=order-v1-31',
    'pages/soldout/page.css?v=order-v1-31',
    'pages/soldout/soldout-enhancements.css?v=order-v1-31',
    'pages/more/page.css?v=order-v1-31',
    'pages/checkout/page.css?v=order-v1-31'
  ];

  function addLink(rel,href,type){
    if(document.querySelector(`link[data-morefun-prewarm="${type}"][href="${CSS.escape(href)}"]`))return;
    const link=document.createElement('link');
    link.rel=rel;
    link.href=href;
    link.dataset.morefunPrewarm=type;
    if(type==='style')link.as='style';
    document.head.appendChild(link);
  }

  function warm(){
    moduleAssets.forEach(href=>addLink('modulepreload',href,'module'));
    styleAssets.forEach(href=>addLink('prefetch',href,'style'));
    document.documentElement.dataset.routeAssetsPrewarmed='1';
  }

  const start=()=>{
    if('requestIdleCallback' in window)requestIdleCallback(warm,{timeout:900});
    else setTimeout(warm,250);
  };

  if(document.readyState==='complete')start();
  else addEventListener('load',start,{once:true});
})();
