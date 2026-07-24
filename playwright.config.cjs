const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
  testDir:'./tests',
  testMatch:['responsive-profile.spec.js','responsive-shell.spec.js','responsive-order.spec.js'],
  timeout:120000,
  expect:{timeout:15000},
  retries:1,
  workers:1,
  reporter:[['list'],['html',{outputFolder:'playwright-report',open:'never'}]],
  use:{browserName:'chromium',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'}
});
