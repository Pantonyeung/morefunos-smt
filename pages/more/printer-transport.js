export const PRINTER_TRANSPORT_SUNMI='sunmi-native';
export const PRINTER_TRANSPORT_NETWORK='network';

export const PRINTER_TRANSPORT_OPTIONS=[
  {value:PRINTER_TRANSPORT_SUNMI,label:'Sunmi 內置打印機'},
  {value:PRINTER_TRANSPORT_NETWORK,label:'LAN 網絡打印機（TCP/IP）'}
];

export function normalizePrinterTransport(value){
  return value===PRINTER_TRANSPORT_NETWORK?PRINTER_TRANSPORT_NETWORK:PRINTER_TRANSPORT_SUNMI;
}

export function applyPrinterTransport(printer,transport){
  const next=normalizePrinterTransport(transport);
  if(next===PRINTER_TRANSPORT_NETWORK){
    return {...printer,transport:next,host:String(printer?.host||''),port:Number(printer?.port)||9100};
  }
  return {...printer,transport:next,host:'',port:0};
}

export function printerTransportFields(printer){
  const transport=normalizePrinterTransport(printer?.transport);
  return {
    transport,
    showNetworkFields:transport===PRINTER_TRANSPORT_NETWORK,
    host:transport===PRINTER_TRANSPORT_NETWORK?String(printer?.host||''):'',
    port:transport===PRINTER_TRANSPORT_NETWORK?(Number(printer?.port)||9100):0
  };
}
