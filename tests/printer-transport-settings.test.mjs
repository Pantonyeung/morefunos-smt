import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRINTER_TRANSPORT_SUNMI,
  PRINTER_TRANSPORT_NETWORK,
  normalizePrinterTransport,
  applyPrinterTransport,
  printerTransportFields
} from '../pages/more/printer-transport.js';

test('printer transport supports Sunmi and LAN network modes',()=>{
  assert.equal(normalizePrinterTransport(PRINTER_TRANSPORT_SUNMI),PRINTER_TRANSPORT_SUNMI);
  assert.equal(normalizePrinterTransport(PRINTER_TRANSPORT_NETWORK),PRINTER_TRANSPORT_NETWORK);
  assert.equal(normalizePrinterTransport('unknown'),PRINTER_TRANSPORT_SUNMI);
});

test('switching to LAN keeps address and defaults port to 9100',()=>{
  const result=applyPrinterTransport({id:'receipt-1',host:'192.168.1.88',port:0},PRINTER_TRANSPORT_NETWORK);
  assert.equal(result.transport,PRINTER_TRANSPORT_NETWORK);
  assert.equal(result.host,'192.168.1.88');
  assert.equal(result.port,9100);
  assert.deepEqual(printerTransportFields(result),{transport:PRINTER_TRANSPORT_NETWORK,showNetworkFields:true,host:'192.168.1.88',port:9100});
});

test('switching back to Sunmi clears LAN-only fields',()=>{
  const result=applyPrinterTransport({id:'receipt-1',host:'192.168.1.88',port:9100},PRINTER_TRANSPORT_SUNMI);
  assert.equal(result.transport,PRINTER_TRANSPORT_SUNMI);
  assert.equal(result.host,'');
  assert.equal(result.port,0);
  assert.equal(printerTransportFields(result).showNetworkFields,false);
});
