import test from 'node:test';
import assert from 'node:assert/strict';
import {monochromeBytesFromImageData,rasterizePrintLayout} from '../pages/more/printer-browser-rasterizer.js';

function rgba(pixels){
  const data=[];
  for(const pixel of pixels)data.push(...pixel);
  return {data:Uint8ClampedArray.from(data)};
}

test('monochrome converter packs dark pixels into printer bitmap bytes',()=>{
  const image=rgba([
    [0,0,0,255],[255,255,255,255],[0,0,0,255],[255,255,255,255],
    [0,0,0,255],[255,255,255,255],[0,0,0,255],[255,255,255,255]
  ]);
  const raster=monochromeBytesFromImageData(image,8,1);
  assert.deepEqual([...raster.data],[0b10101010]);
});

test('rasterizer uses layout geometry and returns packed raster',()=>{
  const calls=[];
  const image=rgba(Array.from({length:8*8},()=>[255,255,255,255]));
  image.data[0]=0;image.data[1]=0;image.data[2]=0;
  const context={
    fillStyle:'',textBaseline:'',font:'',textAlign:'',
    fillRect(){},fillText(text,x,y,maxWidth){calls.push({text,x,y,maxWidth});},
    getImageData(){return image;}
  };
  const plan={contract:'morefun.print.layout.v1',documentType:'receipt',templateId:'r1',templateVersion:1,media:{kind:'roll',widthMm:20,heightMm:0},dotsPerMm:1,widthDots:8,heightDots:8,marginDots:1,usableWidthDots:6,bodyFontDots:2,lineHeightDots:3,maxUnits:3,lines:[{index:0,text:'磨飯',x:1,y:1,align:'left'}],overflow:false};
  const raster=rasterizePrintLayout(plan,{canvasFactory:()=>({width:0,height:0,getContext:()=>context})});
  assert.equal(calls.length,1);
  assert.equal(raster.widthDots,8);
  assert.equal(raster.heightDots,8);
  assert.equal(raster.data[0],0x80);
});
