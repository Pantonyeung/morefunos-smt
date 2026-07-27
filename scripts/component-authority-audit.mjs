import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));

const checks=[
  {
    id:'GLOBAL_SHELL_STATUS_VISUAL_AUTHORITY',
    description:'Global Status Bar visual authority belongs to app-shell.css',
    authority:'app-shell.css',
    forbidden:[
      ['shared/page-base.css','.global-shell-status'],
      ['shared/page-base.css','.global-statusbar{'],
      ['shared/responsive-pages.css','.global-shell-status'],
      ['shared/adaptive-layout.css','.global-shell-status']
    ]
  },
  {
    id:'GLOBAL_BOTTOM_NAV_VISUAL_AUTHORITY',
    description:'Global Bottom Navigation visual authority belongs to app-shell.css',
    authority:'app-shell.css',
    forbidden:[
      ['shared/page-base.css','.global-bottom-nav'],
      ['shared/page-base.css','.bottom-nav{'],
      ['shared/responsive-pages.css','.global-bottom-nav'],
      ['shared/adaptive-layout.css','.global-bottom-nav']
    ]
  },
  {
    id:'LEGACY_CHILD_CHROME_STANDALONE_ONLY',
    description:'Legacy child chrome may render only when a page is opened standalone for QA',
    authority:'shared/shell.js compatibility gate',
    required:[
      ['shared/shell.js','function isEmbeddedInGlobalShell()'],
      ['shared/shell.js',"if(isEmbeddedInGlobalShell())return '';"]
    ]
  },
  {
    id:'STATUS_ACTION_EXPLICIT_REGISTRATION',
    description:'Global status actions use render-time registration, never DOM observers/scanners',
    authority:'page render descriptors + shared/status-actions.js',
    forbidden:[
      ['shared/status-actions.js','MutationObserver'],
      ['shared/status-actions.js','childActionNodes'],
      ['shared/page-bridge.js','statusActionNodes'],
      ['shared/page-bridge.js','MutationObserver']
    ]
  },
  {
    id:'CART_MARKER_VISUAL_AUTHORITY',
    description:'Cart service/sequence marker internal visual belongs to pages/order/cart.css',
    authority:'pages/order/cart.css',
    forbidden:[
      ['pages/order/page.css','.seq-service'],
      ['shared/responsive-pages.css','.seq-service'],
      ['shared/adaptive-layout.css','.seq-service']
    ]
  },
  {
    id:'ADAPTIVE_CART_TOKEN_ONLY',
    description:'Adaptive core may provide cart tokens but may not directly style cart internals',
    authority:'pages/order/cart.css consumes --adaptive-cart-* tokens',
    forbidden:[
      ['shared/adaptive-layout.css','body[data-page="order"] .cart-row'],
      ['shared/adaptive-layout.css','body[data-page="order"] .cart-img'],
      ['shared/adaptive-layout.css','body[data-page="order"] .pending-area'],
      ['shared/adaptive-layout.css','body[data-page="order"] .cart footer']
    ]
  },
  {
    id:'ADAPTIVE_ORDER_PRODUCT_PAGE_AUTHORITY',
    description:'Order product adaptive visuals belong to the Order page authority',
    authority:'pages/order/adaptive.css',
    forbidden:[['shared/adaptive-layout.css','body[data-page="order"]']]
  },
  {
    id:'ADAPTIVE_ORDERS_TOKEN_ONLY',
    description:'Adaptive core must not directly style Orders page components',
    authority:'pages/orders/page.css + pages/orders/responsive.css',
    forbidden:[['shared/adaptive-layout.css','body[data-page="orders"]']]
  },
  {
    id:'ADAPTIVE_SOLDOUT_TOKEN_ONLY',
    description:'Adaptive core must not directly style Soldout page components',
    authority:'pages/soldout/page.css + pages/soldout/responsive.css',
    forbidden:[['shared/adaptive-layout.css','body[data-page="soldout"]']]
  },
  {
    id:'RESPONSIVE_ORDERS_PAGE_AUTHORITY',
    description:'Orders responsive component decisions belong to the Orders page authority',
    authority:'pages/orders/responsive.css',
    forbidden:[['shared/responsive-pages.css','body[data-page="orders"]']]
  },
  {
    id:'RESPONSIVE_SOLDOUT_PAGE_AUTHORITY',
    description:'Soldout responsive component decisions belong to the Soldout page authority',
    authority:'pages/soldout/responsive.css',
    forbidden:[['shared/responsive-pages.css','body[data-page="soldout"]']]
  },
  {
    id:'RESPONSIVE_DINE_PAGE_AUTHORITY',
    description:'Dine responsive component decisions belong to the Dine page authority',
    authority:'pages/dine/responsive.css',
    forbidden:[['shared/responsive-pages.css','body[data-page="dine"]']]
  },
  {
    id:'RESPONSIVE_MORE_PAGE_AUTHORITY',
    description:'More responsive component decisions belong to the More page authority',
    authority:'pages/more/responsive.css',
    forbidden:[['shared/responsive-pages.css','body[data-page="more"]']]
  },
  {
    id:'DRINK_CARD_VISUAL_AUTHORITY',
    description:'Drink Choice Card internal visual belongs to pages/order/drink-card.css',
    authority:'pages/order/drink-card.css',
    required:[
      ['pages/order/drink-card.css','.drink-choice-card'],
      ['pages/order/drink-card.css','object-fit:contain'],
      ['pages/order/drink-card.css','width:70%']
    ],
    forbidden:[
      ['pages/order/cart.css','.drink-choice-card'],
      ['pages/order/cart.css','.drink-choice-img'],
      ['pages/order/cart.css','.drink-choice-count'],
      ['shared/adaptive-layout.css','.drink-choice-card'],
      ['shared/responsive-pages.css','.drink-choice-card']
    ]
  },
  {
    id:'OVERLAY_STATE_SINGLE_TRUTH',
    description:'Global overlay state comes only from explicit morefun:overlay-state messages',
    authority:'page state -> app-loader.js message handler',
    forbidden:[
      ['app-loader.js','installChildOverlayObserver'],
      ['app-loader.js','syncChildOverlay'],
      ['app-loader.js','_shellOverlayObserver']
    ]
  },
  {
    id:'PACKAGING_DOMAIN_SINGLE_TRUTH',
    description:'Packaging pricing truth remains in order-domain.js',
    authority:'pages/order/order-domain.js',
    forbidden:[
      ['pages/order/page.js','TAKEAWAY_PACKAGING_FEE_PER_UNIT'],
      ['pages/checkout/page.js','TAKEAWAY_PACKAGING_FEE_PER_UNIT'],
      ['pages/more/print-domain.js','TAKEAWAY_PACKAGING_FEE_PER_UNIT']
    ]
  }
];

const knownMigrations=[
  {
    id:'V1_CART_INTERNAL_VISUAL_AUTHORITY',
    files:['pages/order/page.css','pages/order/cart.css'],
    needles:['.cart-row','.cart-img','.cart-actions','.pending-area','.cart footer'],
    note:'page.css legacy cart internals are frozen by policy; new cart work belongs to cart.css; migrate one responsibility group at a time with a contract test before removing the legacy rules'
  },
  {
    id:'V2_DRINK_CARD_LEGACY_PAGE_CSS',
    files:['pages/order/page.css'],
    needles:['.drink-choice-card','.drink-choice-img','.drink-choice-count'],
    note:'drink-card.css is the final component authority; page.css selectors are frozen legacy and must only be removed, never extended'
  }
];

let hardFailures=0;
console.log('SMT COMPONENT AUTHORITY AUDIT');
console.log('=============================');

for(const check of checks){
  let failed=false;
  for(const [file,needle] of check.required||[]){
    if(!exists(file)||!read(file).includes(needle)){
      failed=true;
      hardFailures++;
      console.error(`FAIL ${check.id}: ${file} missing required boundary ${needle}; authority=${check.authority}`);
    }
  }
  for(const [file,needle] of check.forbidden||[]){
    if(!exists(file))continue;
    if(read(file).includes(needle)){
      failed=true;
      hardFailures++;
      console.error(`FAIL ${check.id}: ${file} contains ${needle}; authority=${check.authority}`);
    }
  }
  if(!failed)console.log(`PASS ${check.id}: authority=${check.authority}`);
}

console.log('\nKNOWN AUTHORITY MIGRATIONS');
console.log('--------------------------');
for(const migration of knownMigrations){
  const hits=[];
  for(const file of migration.files){
    if(!exists(file))continue;
    const text=read(file);
    const matched=migration.needles.filter(needle=>text.includes(needle));
    if(matched.length)hits.push(`${file} [${matched.join(', ')}]`);
  }
  if(hits.length)console.warn(`MIGRATION ${migration.id}: ${hits.join(' | ')} :: ${migration.note}`);
  else console.log(`CLEARED ${migration.id}`);
}

if(hardFailures){
  console.error(`\nAuthority audit failed: ${hardFailures} conflicting authority violation(s).`);
  process.exit(1);
}

console.log('\nAuthority audit passed for locked boundaries. Known migrations remain visible until consolidated.');