import test from 'node:test';
import assert from 'node:assert/strict';
import {rendererAvailable,renderEscPosRaster,renderRasterPrintAsset,renderTsplBitmap} from '../pages/more/printer-command-renderer.js';

const raster={widthDots:8,heightDots:2,data:Uint8Array.from([0xff,0x81])};

test('ESC/POS raster includes init, GS v 0 header and exact bitmap bytes',()=>{
  const bytes=renderEscPosRaster(raster,{cutMode:'partial'});
  assert.deepEqual([...bytes.slice(0,2)],[0x1b,0x40]);
  assert.deepEqual([...bytes.slice(2,10)],[0x1d,0x76,0x30,0x00,0x01,0x00,0x02,0x00]);
  assert.deepEqual([...bytes.slice(10,12)],[0xff,0x81]);
  assert.deepEqual([...bytes.slice(-3)],[0x1d,0x56,0x01]);
});

test('TSPL bitmap contains configured media and raw bitmap bytes',()=>{
  const bytes=renderTsplBitmap(raster,{kind:'label',widthMm:60,heightMm:40},{density:9,speed:5});
  const text=Buffer.from(bytes).toString('latin1');
  assert.match(text,/SIZE 60 mm,40 mm/);
  assert.match(text,/BITMAP 0,0,1,2,0,/);
  assert.ok(bytes.includes(0xff));
  assert.match(text,/PRINT 1,1/);
});

test('first production renderer gate only advertises escpos and tspl',()=>{
  assert.equal(rendererAvailable('escpos'),true);
  assert.equal(rendererAvailable('tspl'),true);
  assert.equal(rendererAvailable('zpl'),false);
  assert.equal(rendererAvailable('epl'),false);
  assert.equal(rendererAvailable('dpl'),false);
});

test('rendered asset becomes exact base64 Android binary content',()=>{
  const result=renderRasterPrintAsset({
    raster,documentType:'receipt',templateId:'receipt-v1',templateVersion:1,now:123,
    printer:{media:{kind:'roll',widthMm:80},driver:{commandLanguage:'escpos',cutMode:'none'}}
  });
  assert.equal(result.commandLanguage,'escpos');
  assert.equal(result.androidContent.mode,'binary');
  assert.equal(result.androidContent.base64,result.base64);
  assert.ok(result.byteLength>2);
});

test('raster byte length mismatch is blocked before printing',()=>{
  assert.throws(()=>renderEscPosRaster({widthDots:16,heightDots:2,data:[0xff]}),/Raster bytes 不符/);
});
