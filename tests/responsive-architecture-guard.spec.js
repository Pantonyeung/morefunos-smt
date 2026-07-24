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
