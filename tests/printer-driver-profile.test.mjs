import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePrinterDriver,
  validatePrinterDriver,
  applyPrinterDriver,
  supportedCommandLanguagesForMedia
} from '../pages/more/printer-driver-profile.js';

test('卷紙預設使用 escpos 並只提供 escpos/raw',()=>{
  const driver=normalizePrinterDriver({}, {kind:'roll'});
  assert.equal(driver.commandLanguage,'escpos');
  assert.deepEqual(supportedCommandLanguagesForMedia({kind:'roll'}),['escpos','raw']);
});

test('標籤預設使用 tspl 並可選多種標籤指令語言',()=>{
  const driver=normalizePrinterDriver({}, {kind:'label'});
  assert.equal(driver.commandLanguage,'tspl');
  assert.deepEqual(supportedCommandLanguagesForMedia({kind:'label'}),['tspl','epl','zpl','dpl','raw']);
});

test('標籤模式拒絕 escpos，卷紙模式拒絕 tspl',()=>{
  assert.equal(validatePrinterDriver({commandLanguage:'escpos'},{kind:'label'}).ok,false);
  assert.equal(validatePrinterDriver({commandLanguage:'tspl'},{kind:'roll'}).ok,false);
});

test('driver profile 保留字符編碼與切紙策略作設備設定',()=>{
  const printer=applyPrinterDriver({media:{kind:'roll'}},{commandLanguage:'escpos',encoding:'GB18030',cutMode:'partial'});
  assert.equal(printer.driver.commandLanguage,'escpos');
  assert.equal(printer.driver.encoding,'GB18030');
  assert.equal(printer.driver.cutMode,'partial');
});
