import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));

const checks=[
  {
    id:'GLOBAL_SHELL_STATUS_OWNER',
    description:'Global Status Bar visual must only be owned by app-shell.css',
    owner:'app-shell.css',
    forbidden:[
      ['shared/page-base.css','.global-shell-status'],
      ['shared/responsive-pages.css','.global-shell-status'],
      ['shared/adaptive-layout.css','.global-shell-status']
    ]
  },
  {
    id:'GLOBAL_BOTTOM_NAV_OWNER',
    description:'Global Bottom Navigation visual must only be owned by app-shell.css',
    owner:'app-shell.css',
    forbidden:[
      ['shared/page-base.css','.global-bottom-nav'],
      ['shared/responsive-pages.css','.global-bottom-nav'],
      ['shared/adaptive-layout.css','.global-bottom-nav']
    ]
  },
  {
    id:'CART_MARKER_SINGLE_OWNER',
    description:'Cart service/sequence marker must converge on pages/order/cart.css',
    owner:'pages/order/cart.css',
    forbidden:[
      ['pages/order/page.css','.seq-service'],
      ['shared/responsive-pages.css','.seq-service']
    ]
  },
  {
    id:'DRINK_CARD_VISUAL_SINGLE_OWNER',
    description:'Drink Choice Card visual must only be owned by pages/order/page.css',
    owner:'pages/order/page.css',
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
    description:'Global overlay state must come only from explicit morefun:overlay-state messages',
    owner:'app-loader.js::message(morefun:overlay-state)',
    forbidden:[
      ['app-loader.js','installChildOverlayObserver'],
      ['app-loader.js','syncChildOverlay'],
      ['app-loader.js','_shellOverlayObserver']
    ]
  },
  {
    id:'PACKAGING_DOMAIN_SINGLE_OWNER',
    description:'Packaging pricing truth must remain in order-domain.js',
    owner:'pages/order/order-domain.js',
    forbidden:[
      ['pages/order/page.js','TAKEAWAY_PACKAGING_FEE_PER_UNIT'],
      ['pages/checkout/page.js','TAKEAWAY_PACKAGING_FEE_PER_UNIT'],
      ['pages/more/print-domain.js','TAKEAWAY_PACKAGING_FEE_PER_UNIT']
    ]
  }
];

const knownMigrations=[
  {
    id:'V1_ORDER_CART_MULTI_OWNER',
    files:['pages/order/page.css','pages/order/cart.css','shared/adaptive-layout.css'],
    needles:['.cart-row','.cart-img','.pending-area','.cart footer']
  },
  {
    id:'V3_STATUS_ACTION_DOM_OBSERVER',
    files:['shared/status-actions.js'],
    needles:['MutationObserver','childActionNodes']
  },
  {
    id:'V5_LEGACY_CHILD_GLOBAL_CHROME',
    files:['shared/shell.js','shared/page-base.css'],
    needles:['renderGlobalStatusBar','renderBottomNav','.global-statusbar','.bottom-nav']
  },
  {
    id:'V6_ADAPTIVE_DIRECT_COMPONENT_SELECTORS',
    files:['shared/adaptive-layout.css'],
    needles:['body[data-page="order"] .product-card','body[data-page="order"] .cart-row','body[data-page="orders"] .order-card']
  },
  {
    id:'V7_RESPONSIVE_PAGES_DIRECT_COMPONENT_SELECTORS',
    files:['shared/responsive-pages.css'],
    needles:['body[data-page="orders"]','body[data-page="dine"]','body[data-page="soldout"]','body[data-page="more"]']
  }
];

let hardFailures=0;
console.log('SMT COMPONENT OWNERSHIP AUDIT');
console.log('================================');

for(const check of checks){
  let failed=false;
  for(const [file,needle] of check.forbidden){
    if(!exists(file))continue;
    if(read(file).includes(needle)){
      failed=true;
      hardFailures++;
      console.error(`FAIL ${check.id}: ${file} contains ${needle}; owner=${check.owner}`);
    }
  }
  if(!failed)console.log(`PASS ${check.id}: owner=${check.owner}`);
}

console.log('\nKNOWN MIGRATIONS');
console.log('----------------');
for(const migration of knownMigrations){
  const hits=[];
  for(const file of migration.files){
    if(!exists(file))continue;
    const text=read(file);
    const matched=migration.needles.filter(needle=>text.includes(needle));
    if(matched.length)hits.push(`${file} [${matched.join(', ')}]`);
  }
  if(hits.length)console.warn(`MIGRATION ${migration.id}: ${hits.join(' | ')}`);
  else console.log(`CLEARED ${migration.id}`);
}

if(hardFailures){
  console.error(`\nOwnership audit failed: ${hardFailures} new/unregistered ownership violation(s).`);
  process.exit(1);
}

console.log('\nOwnership audit passed for locked rules. Known migrations remain visible until consolidated.');
