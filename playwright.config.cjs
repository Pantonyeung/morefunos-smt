const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
  testDir:'./tests',
  testMatch:['responsive-profile.spec.js','responsive-shell.spec.js','responsive-order.spec.js','responsive-checkout.spec.js','responsive-secondary-pages.spec.js','responsive-architecture-guard.spec.js','stress-responsive-matrix.spec.js','dev-preview.spec.js','responsive-visual-contract.spec.js','proportional-layout.spec.js','offline-survival.spec.js'],
  timeout:180000,
  expect:{timeout:15000},
  retries:1,
  workers:1,
  reporter:[['list'],['html',{outputFolder:'playwright-report',open:'never'}]],
  use:{browserName:'chromium',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'}
});