import fs from 'node:fs';
import assert from 'node:assert/strict';

const css=fs.readFileSync(new URL('../shared/responsive-pages.css',import.meta.url),'utf8');
const shellCss=fs.readFileSync(new URL('../app-shell.css',import.meta.url),'utf8');
const loader=fs.readFileSync(new URL('../app-loader.js',import.meta.url),'utf8');

const required=[
  'body[data-page="more"] .more-workspace{container-type:size;container-name:more-workspace;',
  'body[data-page="more"] .more-analysis{grid-template-columns:',
  'body[data-page="more"] .more-card{min-height:0',
  'body[data-page="more"] .detail-dialog{width:min(',
  ':root[data-responsive-profile="standard"] body[data-page="more"] .more-analysis',
  ':root[data-responsive-profile="compact"] body[data-page="more"] .more-analysis'
];
for(const token of required)assert.ok(css.includes(token),`missing responsive More contract: ${token}`);
assert.ok(loader.includes('body[data-page="more"] .more-heading{display:none!important}'),'global shell must own the More page title');
assert.ok(loader.includes("shellApp?.classList.toggle('child-overlay-active'"),'child modal must signal the outer shell');
assert.ok(shellCss.includes('#shell-app.child-overlay-active #page-host{position:fixed;inset:0'),'child modal must expand over the complete shell viewport');
assert.ok(shellCss.includes('#shell-app.child-overlay-active .global-shell-status,#shell-app.child-overlay-active .global-bottom-nav'),'outer shell chrome must be included in modal blocking state');
console.log('MORE_RESPONSIVE_CONTRACT_OK');
