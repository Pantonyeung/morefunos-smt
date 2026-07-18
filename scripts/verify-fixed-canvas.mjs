import assert from 'node:assert/strict';
const W=1920,H=1080;
function fit(width,height){const scale=Math.min(1,width/W,height/H);return {scale,left:(width-W*scale)/2,top:(height-H*scale)/2};}
const t2=fit(1920,1080);assert.equal(t2.scale,1);assert.equal(t2.left,0);assert.equal(t2.top,0);
const iphone=fit(852,393);assert.equal(Number(iphone.scale.toFixed(6)),0.363889);assert.equal(Number(iphone.left.toFixed(3)),76.667);assert.equal(iphone.top,0);
console.log(JSON.stringify({t2,iphone,ratio:`${W}:${H}`,reflow:false},null,2));
