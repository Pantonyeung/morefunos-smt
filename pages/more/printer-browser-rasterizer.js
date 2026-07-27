import {validatePrintLayoutPlan} from './printer-template-layout.js';

function createDefaultCanvas(width,height){
  if(typeof document==='undefined')throw new Error('目前環境沒有 Canvas DOM');
  const canvas=document.createElement('canvas');
  canvas.width=width;canvas.height=height;
  return canvas;
}

export function monochromeBytesFromImageData(imageData,widthDots,heightDots,{threshold=180}={}){
  const widthBytes=Math.ceil(widthDots/8);
  const bytes=new Uint8Array(widthBytes*heightDots);
  const data=imageData?.data||[];
  for(let y=0;y<heightDots;y++){
    for(let x=0;x<widthDots;x++){
      const index=(y*widthDots+x)*4;
      const r=data[index]??255,g=data[index+1]??255,b=data[index+2]??255,a=data[index+3]??255;
      const luminance=(r*299+g*587+b*114)/1000;
      const isBlack=a>0&&luminance<threshold;
      if(isBlack)bytes[y*widthBytes+(x>>3)]|=(0x80>>(x&7));
    }
  }
  return {widthDots,heightDots,data:bytes};
}

export function rasterizePrintLayout(plan={},options={}){
  const validation=validatePrintLayoutPlan(plan);
  if(!validation.ok)throw new Error(validation.errors.join('；'));
  const canvasFactory=options.canvasFactory||createDefaultCanvas;
  const canvas=canvasFactory(plan.widthDots,plan.heightDots);
  if(!canvas)throw new Error('無法建立打印 Canvas');
  canvas.width=plan.widthDots;canvas.height=plan.heightDots;
  const context=canvas.getContext?.('2d',{willReadFrequently:true});
  if(!context)throw new Error('無法取得 Canvas 2D Context');
  context.fillStyle='#fff';context.fillRect(0,0,plan.widthDots,plan.heightDots);
  context.fillStyle='#000';
  context.textBaseline='top';
  context.font=`${plan.bodyFontDots}px "Noto Sans CJK TC","PingFang HK","Microsoft JhengHei",sans-serif`;
  for(const line of plan.lines){
    context.textAlign=line.align==='center'?'center':line.align==='right'?'right':'left';
    const x=line.align==='center'?Math.floor(plan.widthDots/2):line.align==='right'?plan.widthDots-plan.marginDots:line.x;
    context.fillText(String(line.text||''),x,line.y,plan.usableWidthDots);
  }
  const imageData=context.getImageData(0,0,plan.widthDots,plan.heightDots);
  return monochromeBytesFromImageData(imageData,plan.widthDots,plan.heightDots,{threshold:options.threshold});
}
