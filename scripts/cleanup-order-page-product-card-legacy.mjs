import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const DEFAULT_FILE='pages/order/page.css';
const productNeedles=['.product-card','.product-hero','.product-info','.product-copy','.product-price','.product-description','.product-code','.product-thumb','.product-supply-state'];

function splitTopLevelSelectors(text){
  const selectors=[];
  let buf='';
  let paren=0;
  let bracket=0;
  let quote='';
  for(let i=0;i<text.length;i+=1){
    const ch=text[i];
    if(quote){
      buf+=ch;
      if(ch===quote&&text[i-1]!=='\\')quote='';
      continue;
    }
    if(ch==='"'||ch==="'"){quote=ch;buf+=ch;continue;}
    if(ch==='(')paren+=1;
    else if(ch===')')paren=Math.max(0,paren-1);
    else if(ch==='[')bracket+=1;
    else if(ch===']')bracket=Math.max(0,bracket-1);
    if(ch===','&&paren===0&&bracket===0){selectors.push(buf.trim());buf='';}
    else buf+=ch;
  }
  if(buf.trim())selectors.push(buf.trim());
  return selectors;
}

function isProductOwnedSelector(selector){
  const normalized=selector.replace(/\s+/g,' ').trim();
  if(!normalized)return false;
  return productNeedles.some(needle=>normalized.includes(needle));
}

function findMatchingBrace(css,openIndex){
  let depth=0;
  let quote='';
  let inComment=false;
  for(let i=openIndex;i<css.length;i+=1){
    const ch=css[i];
    const next=css[i+1];
    if(inComment){if(ch==='*'&&next==='/'){inComment=false;i+=1;}continue;}
    if(quote){if(ch===quote&&css[i-1]!=='\\')quote='';continue;}
    if(ch==='/'&&next==='*'){inComment=true;i+=1;continue;}
    if(ch==='"'||ch==="'"){quote=ch;continue;}
    if(ch==='{')depth+=1;
    else if(ch==='}'){
      depth-=1;
      if(depth===0)return i;
    }
  }
  throw new Error(`Unbalanced CSS brace at ${openIndex}`);
}

function previousBoundary(css,index){
  const semi=css.lastIndexOf(';',index-1);
  const close=css.lastIndexOf('}',index-1);
  return Math.max(semi,close)+1;
}

function peelLeadingComments(prelude){
  let rest=prelude;
  let comments='';
  while(true){
    const match=rest.match(/^(\s*\/\*[\s\S]*?\*\/)/);
    if(!match)break;
    comments+=match[1];
    rest=rest.slice(match[1].length);
  }
  const leadingWhitespace=rest.match(/^\s*/)?.[0]||'';
  comments+=leadingWhitespace;
  rest=rest.slice(leadingWhitespace.length);
  return {comments,selectorText:rest.trim()};
}

export function cleanupProductCardLegacy(css){
  let cursor=0;
  let output='';
  let removedSelectors=0;
  let rewrittenRules=0;
  let removedRules=0;

  while(cursor<css.length){
    const open=css.indexOf('{',cursor);
    if(open===-1){output+=css.slice(cursor);break;}
    const boundary=previousBoundary(css,open);
    if(boundary<cursor){output+=css.slice(cursor,open+1);cursor=open+1;continue;}
    const rawPrefix=css.slice(cursor,boundary);
    const prelude=css.slice(boundary,open);
    const {comments,selectorText}=peelLeadingComments(prelude);

    if(selectorText.startsWith('@')){
      const close=findMatchingBrace(css,open);
      output+=css.slice(cursor,close+1);
      cursor=close+1;
      continue;
    }

    const close=findMatchingBrace(css,open);
    const selectors=splitTopLevelSelectors(selectorText);
    const kept=selectors.filter(selector=>!isProductOwnedSelector(selector));
    const removed=selectors.length-kept.length;

    if(!removed){
      output+=css.slice(cursor,close+1);
      cursor=close+1;
      continue;
    }

    removedSelectors+=removed;
    output+=rawPrefix+comments;
    if(kept.length){
      output+=`${kept.join(',\n')} ${css.slice(open,close+1)}`;
      rewrittenRules+=1;
    }else{
      removedRules+=1;
    }
    cursor=close+1;
  }

  return {css:output,removedSelectors,rewrittenRules,removedRules};
}

function assertOwnershipBoundary(css){
  for(const needle of productNeedles){
    if(css.includes(needle))throw new Error(`Product Card legacy selector remains: ${needle}`);
  }
  const mustRemain=['.products','.products-large','.products-small','.products-text','.catalog','.specified-link-card','.detail-drinks'];
  for(const needle of mustRemain){
    if(!css.includes(needle))throw new Error(`Non-Product authority was removed unexpectedly: ${needle}`);
  }
}

function assertSafeMigration(result){
  if(result.removedSelectors<15)throw new Error(`Expected at least 15 Product Card selectors, removed ${result.removedSelectors}`);
  if(result.removedSelectors>100)throw new Error(`Refusing unexpectedly broad Product Card cleanup: ${result.removedSelectors} selectors`);
  assertOwnershipBoundary(result.css);
}

function main(){
  const args=new Set(process.argv.slice(2));
  const check=args.has('--check');
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const file=path.join(root,DEFAULT_FILE);
  const source=fs.readFileSync(file,'utf8');
  const result=cleanupProductCardLegacy(source);

  if(source===result.css){
    assertOwnershipBoundary(source);
    console.log('V9_PRODUCT_CARD_ALREADY_CLEARED');
    return;
  }

  assertSafeMigration(result);
  console.log(`V9_PRODUCT_CARD_CLEANUP selectors=${result.removedSelectors} rules=${result.removedRules} rewritten=${result.rewrittenRules}`);
  if(check){
    process.exitCode=2;
    console.log('V9_PRODUCT_CARD_CLEANUP_REQUIRED');
    return;
  }
  fs.writeFileSync(file,result.css,'utf8');
  console.log(`WROTE ${DEFAULT_FILE}`);
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
