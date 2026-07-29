const {test,expect}=require('@playwright/test');

const APP='http://127.0.0.1:4173/#/order';

async function waitForOfflineReady(page){
  await expect.poll(async()=>page.evaluate(async()=>{
    const module=await import('/shared/offline-survival.js');
    const status=await module.getOfflineSurvivalStatus();
    return Boolean(status.ready&&status.serviceWorker);
  }),{timeout:20000}).toBe(true);
}

test('runtime and offline survival start without blocking the shell',async({page})=>{
  await page.goto(APP,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toBeVisible();
  await expect(page.locator('#page')).toBeVisible();
  await waitForOfflineReady(page);
  const status=await page.evaluate(async()=>{
    const runtime=await import('/shared/runtime-status.js');
    const offline=await import('/shared/offline-survival.js');
    return {runtime:runtime.getRuntimeStatus(),offline:await offline.getOfflineSurvivalStatus()};
  });
  expect(status.runtime.ready).toBe(true);
  expect(status.offline.longRunReady).toBe(true);
});

test('critical local writes are captured by the durable journal',async({page})=>{
  await page.goto(APP,{waitUntil:'domcontentloaded'});
  await waitForOfflineReady(page);
  const marker='journal-'+Date.now();
  await page.evaluate(async marker=>{
    const store=await import('/shared/store.js');
    const current=store.readJSON(store.OPERATIONS_STORAGE_KEY,{});
    store.writeJSON(store.OPERATIONS_STORAGE_KEY,{...current,offlineJournalTest:marker});
  },marker);
  await expect.poll(async()=>page.evaluate(async marker=>{
    const journal=await import('/shared/offline-journal.js');
    const latest=await journal.readLatestJournalValues();
    return latest['morefun:smt:v1:operations']?.offlineJournalTest===marker;
  },marker),{timeout:10000}).toBe(true);
});

test('cached SMT shell survives a true browser offline reload',async({page,context})=>{
  await page.goto(APP,{waitUntil:'domcontentloaded'});
  await waitForOfflineReady(page);
  await context.setOffline(true);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toBeVisible({timeout:15000});
  await expect(page.locator('#page')).toBeVisible({timeout:15000});
  await expect(page.locator('#global-bottom-nav')).toBeVisible({timeout:15000});
  await context.setOffline(false);
});
