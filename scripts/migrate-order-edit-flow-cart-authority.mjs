import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'tests/order-edit-flow.test.mjs');
let source=fs.readFileSync(file,'utf8');

const insertAfter="const css = await readFile(new URL('../pages/order/page.css', import.meta.url), 'utf8');";
if(!source.includes("const cartCss = await readFile(new URL('../pages/order/cart.css', import.meta.url), 'utf8');")){
  if(!source.includes(insertAfter))throw new Error('order-edit-flow css declaration not found');
  source=source.replace(insertAfter,`${insertAfter}\nconst cartCss = await readFile(new URL('../pages/order/cart.css', import.meta.url), 'utf8');`);
}

const replacements=[
  ["assert.match(css,/\\.cart-list\\{[^}]*min-height:0[^}]*overflow-y:auto/);","assert.match(cartCss,/\\.cart-list\\{[^}]*min-height:0[^}]*overflow-y:auto/);"],
  ["assert.match(css,/\\.quick-drawer-handle\\s*\\{[^}]*left:\\s*50%[^}]*transform:\\s*translateX\\(-50%\\)/);","assert.match(cartCss,/\\.quick-drawer-handle\\s*\\{[^}]*left:\\s*50%[^}]*transform:\\s*translateX\\(-50%\\)/);"],
  ["assert.match(css,/\\.quick-drawer-panel\\s*\\{[^}]*position:\\s*absolute[^}]*bottom:\\s*44px/);","assert.match(cartCss,/\\.quick-drawer-panel\\s*\\{[^}]*position:\\s*absolute[^}]*bottom:\\s*44px/);"],
  ["assert.match(css,/\\.cart-price\\s*\\{/);assert.match(css,/\\.cart-actions\\s*\\{/);","assert.match(cartCss,/\\.cart-price\\s*\\{/);assert.match(cartCss,/\\.cart-actions\\s*\\{/);"],
  ["assert.match(css,/\\.cart-price\\s*\\{[^}]*justify-self:\\s*end/);","assert.match(cartCss,/\\.cart-price\\s*\\{[^}]*justify-self:\\s*end/);"],
  ["assert.match(css,/grid-template-areas:\\s*\"seq image copy price\"\\s*\"seq image copy actions\"/);","assert.match(cartCss,/grid-template-areas:\\s*\"seq image copy price\"\\s*\"seq image copy actions\"/);"],
  ["assert.match(css,/\\.cart-copy strong\\s*\\{[^}]*font-size:/);","assert.match(cartCss,/\\.cart-copy strong\\s*\\{[^}]*font-size:/);"],
];

let changed=0;
for(const [from,to] of replacements){
  if(source.includes(from)){source=source.replace(from,to);changed+=1;}
  else if(!source.includes(to))throw new Error(`Expected cart assertion not found: ${from}`);
}
if(changed!==0&&changed!==replacements.length)throw new Error(`Partial migration refused: changed ${changed}/${replacements.length}`);

fs.writeFileSync(file,source,'utf8');
console.log(`ORDER_EDIT_FLOW_CART_AUTHORITY migrated=${changed}`);
