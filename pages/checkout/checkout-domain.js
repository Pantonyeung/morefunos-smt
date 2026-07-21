import {recordCheckoutOperator} from '../../shared/operations.js';

const roundMoney=value=>Math.round((Number(value)||0)*100)/100;
const subtotalOf=cart=>roundMoney((cart||[]).reduce((sum,line)=>sum+Number(line.total ?? Number(line.unitPrice||0)*Number(line.qty||0)),0));
const isPlatform=channel=>channel==='Keeta'||channel==='Foodpanda';
const studentDiscountBase=item=>{
  const surcharge=Number(item?.specialDrinkSurcharge)||0;
  return item?.studentDiscountEligible===true&&surcharge>=6?surcharge:0;
};
const eligibleStudentUnits=line=>{
  const ownBase=studentDiscountBase(line);
  if(ownBase)return [{qty:Math.max(0,Number(line.qty)||0),base:ownBase}];
  const assignments=(line.drinkAssignments||[]).map(drink=>({qty:1,base:studentDiscountBase(drink)})).filter(item=>item.base);
  if(assignments.length)return assignments;
  return (line.combo?.components||[])
    .filter(component=>component.role==='drink')
    .map(drink=>({qty:Math.max(1,Number(line.qty)||1),base:studentDiscountBase(drink)}))
    .filter(item=>item.base);
};

export function applyCheckoutDiscount(cart,discount={type:'none'},channel='現場外賣'){
  const subtotal=subtotalOf(cart);
  if(!discount||discount.type==='none')return {subtotal,discountAmount:0,payable:subtotal,appliedUnits:0};
  if(isPlatform(channel))throw new Error('平台訂單不可使用本店優惠');
  let discountAmount=0;
  let appliedUnits=0;
  if(discount.type==='student'){
    let remaining=Math.max(0,Math.floor(Number(discount.studentCount)||0));
    for(const line of cart||[]){
      for(const eligible of eligibleStudentUnits(line)){
        if(!remaining)break;
        const units=Math.min(remaining,eligible.qty);
        discountAmount+=eligible.base*.5*units;
        appliedUnits+=units;
        remaining-=units;
      }
    }
  }else if(discount.type==='group'){
    if(channel==='堂食')throw new Error('堂食不提供團體優惠');
    const percent=Math.max(0,Math.min(100,Number(discount.percent)||0));
    discountAmount=subtotal*percent/100;
  }
  discountAmount=roundMoney(discountAmount);
  return {subtotal,discountAmount,payable:roundMoney(Math.max(0,subtotal-discountAmount)),appliedUnits};
}

export function enterKeypadValue(current,key){
  const value=String(current??'');
  if(key==='clear')return '';
  if(key==='backspace')return value.slice(0,-1);
  if(key==='.'&&value.includes('.'))return value;
  if(key==='.')return value?value+'.':'0.';
  if(key==='00')return value&&value!=='0'?(value+'00').slice(0,9):'0';
  if(!/^\d$/.test(String(key)))return value;
  const next=value==='0'?String(key):value+key;
  const [,decimals='']=next.split('.');
  return decimals.length>2?value:next.slice(0,9);
}

export function buildCheckoutRecord({id,cart,channel,payment,pricing,discount,terminalId,now,audit=[]}){
  const base={
    id,group:channel==='堂食'||channel==='現場外賣'?'onsite':channel==='磨飯 App'||channel==='電話／WhatsApp'?'owned':'platform',
    source:channel,acceptedAt:now,itemCount:(cart||[]).reduce((n,line)=>n+Number(line.qty||0),0),
    subtotal:pricing.subtotal,discountAmount:pricing.discountAmount,amount:pricing.payable,
    discount:{...discount,appliedUnits:pricing.appliedUnits},paymentMethod:payment,paymentStatus:'已付款',printStatus:'正常',
    items:(cart||[]).map(line=>({...line})),cart:(cart||[]).map(line=>({...line})),audit:[...audit]
  };
  if(discount?.type&&discount.type!=='none')base.audit.push({type:'discount.applied',terminalId,at:now,discount:{...base.discount},amount:pricing.discountAmount});
  return recordCheckoutOperator(base,terminalId,now);
}
