import fs from 'node:fs';
import assert from 'node:assert/strict';

const css=fs.readFileSync(new URL('../shared/responsive-pages.css',import.meta.url),'utf8');

const required=[
  'body[data-page="more"] .more-workspace{container-type:size;container-name:more-workspace}',
  'body[data-page="more"] .more-analysis{grid-template-columns:',
  'body[data-page="more"] .more-card{min-height:0',
  'body[data-page="more"] .detail-dialog{width:min(',
  ':root[data-responsive-profile="standard"] body[data-page="more"] .more-analysis',
  ':root[data-responsive-profile="compact"] body[data-page="more"] .more-analysis'
];
for(const token of required)assert.ok(css.includes(token),`missing responsive More contract: ${token}`);
console.log('MORE_RESPONSIVE_CONTRACT_OK');
