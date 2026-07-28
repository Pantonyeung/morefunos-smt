const {test,expect}=require('@playwright/test');
const fs=require('fs');
const path=require('path');

const root=path.resolve(__dirname,'..');
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');

const pageIndexes=[
  'pages/order/index.html',
  'pages/checkout/index.html',
  'pages/orders/index.html',
  'pages/dine/index.html',
  'pages/soldout/index.html',
  'pages/more/index.html'
];

const forbiddenFiles=[
  'pages/order/t2s-1280.css',
  'pages/checkout/t2s-restore.css'
];

function walk(dir){
  const out=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(['node_modules','.git','test-results','playwright-report'].includes(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

test('adaptive branch has no legacy size patch files',()=>{
  for(const file of forbiddenFiles)expect(fs.existsSync(path.join(root,file)),file).toBeFalsy();
});

test('loader does not inject page CSS patches',()=>{
  const source=read('app-loader.js');
  for(const token of ['injectPageFixes','checkoutFixCss','orderFixCss','smt-loader-t2s-fixes']){
    expect(source,token).not.toContain(token);
  }
});

test('all SMT child pages use device-width viewport',()=>{
  for(const file of pageIndexes){
    const source=read(file);
    expect(source,file).toContain('width=device-width');
    expect(source,file).not.toContain('width=1920');
    expect(source,file).not.toContain('t2s-1280.css');
    expect(source,file).not.toContain('t2s-restore.css');
  }
});

test('new responsive layers do not use important overrides',()=>{
  expect(read('shared/responsive.css')).not.toContain('!important');
  expect(read('shared/responsive-pages.css')).not.toContain('!important');
});

test('order and soldout product cards consume the same adaptive row tokens',()=>{
  const soldout=read('pages/soldout/page.css');
  const order=read('pages/order/product-card.css');
  const shared=read('shared/adaptive-layout.css');
  const tokens=['--adaptive-product-row-large','--adaptive-product-row-small','--adaptive-product-row-text'];

  for(const token of tokens){
    expect(shared,`${token} must be owned by shared adaptive layout`).toContain(token);
    expect(order,`${token} must drive order product cards`).toContain(`var(${token})`);
    expect(soldout,`${token} must drive soldout product cards`).toContain(`var(${token})`);
  }

  for(const hardcoded of [
    'grid-template-rows:150px auto',
    'grid-template-columns:72px 1fr auto',
    '.supply-product.large{height:150px',
    '.supply-product.small{height:72px'
  ])expect(soldout,hardcoded).not.toContain(hardcoded);

  expect(soldout).not.toMatch(/\.supply-product\.text\{height:\s*\d+(?:\.\d+)?px/);
});

test('global bottom navigation geometry has a single owner',()=>{
  const offenders=[];
  for(const file of walk(root).filter(file=>file.endsWith('.css'))){
    const source=fs.readFileSync(file,'utf8');
    if(path.relative(root,file)==='app-shell.css')continue;
    if(/\.global-bottom-nav\s*\{|\.global-bottom-nav\s+button\s*\{/.test(source)){
      offenders.push(path.relative(root,file));
    }
  }
  expect(offenders,'Global bottom-nav geometry must live only in app-shell.css').toEqual([]);
});

test('global shell bottom navigation remains adaptive and safe-area aware',()=>{
  const source=read('app-shell.css');
  expect(source).toContain('.global-bottom-nav{');
  expect(source).toContain('env(safe-area-inset-bottom)');
  expect(source).toContain('var(--bottom-nav-height)');
  expect(source).toContain('min-height:44px');
  expect(source).not.toContain('grid-template-rows:25px auto');
});
