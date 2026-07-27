import test from 'node:test';
import assert from 'node:assert/strict';
import {PRINT_ASSET_CONTRACT,buildBinaryAndroidContent,normalizeRenderedPrintAsset,validateRenderedPrintAsset} from '../pages/more/printer-rendered-asset.js';

test('rendered asset preserves exact binary payload metadata',()=>{
  const asset=normalizeRenderedPrintAsset({
    documentType:'receipt',templateId:'receipt-v1',templateVersion:3,
    commandLanguage:'escpos',media:{kind:'roll',widthMm:80},
    base64:'AQIDBA==',byteLength:4,checksum:'sha256:test',renderedAt:123
  });
  assert.equal(asset.contract,PRINT_ASSET_CONTRACT);
  assert.equal(asset.commandLanguage,'escpos');
  assert.equal(asset.byteLength,4);
});

test('binary asset validation requires template, language, bytes and byteLength',()=>{
  assert.equal(validateRenderedPrintAsset({}).ok,false);
  assert.equal(validateRenderedPrintAsset({documentType:'label',templateId:'l1',commandLanguage:'tspl',base64:'AQ==',byteLength:1}).ok,true);
});

test('Android content uses base64 exact bytes rather than rebuilding template in Native',()=>{
  const content=buildBinaryAndroidContent({
    documentType:'label',templateId:'label-v2',templateVersion:2,
    commandLanguage:'tspl',media:{kind:'label',widthMm:60,heightMm:40},
    base64:'VEVTVA==',byteLength:4,checksum:'sha256:test'
  });
  assert.equal(content.mode,'binary');
  assert.equal(content.base64,'VEVTVA==');
  assert.equal(content.commandLanguage,'tspl');
  assert.deepEqual(content.media,{kind:'label',widthMm:60,heightMm:40});
});
