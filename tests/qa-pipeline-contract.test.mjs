import fs from 'node:fs';
import assert from 'node:assert/strict';

const workflowPath=new URL('../.github/workflows/qa-runtime-phase3.yml',import.meta.url);
const workflow=fs.readFileSync(workflowPath,'utf8');

assert.ok(workflow.includes("name: qa-runtime-phase3"),'permanent QA workflow must remain the single runtime QA owner');
assert.ok(workflow.includes('npm run qa:browser'),'permanent QA must execute Playwright browser regression');
assert.ok(workflow.includes('BROWSER_STATUS=$?'),'browser result must be captured in the QA report');
assert.ok(workflow.includes("grep -q '^RESULT=PASS$'"),'workflow must hard-fail when the consolidated QA report is not PASS');
assert.ok(workflow.includes('playwright-responsive-report'),'browser diagnostics must remain downloadable as an artifact');
assert.ok(workflow.includes("tests/**/*.spec.js"),'browser spec changes must trigger permanent QA');
assert.ok(workflow.includes("pages/order/**"),'order runtime changes must trigger permanent QA');

console.log('SMT_QA_PIPELINE_SINGLE_AUTHORITY_OK');
