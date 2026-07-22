import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');

test('Work and Chat entries point to current baseline', async () => {
  const [agents, start, compact, pack] = await Promise.all([read('AGENTS.md'), read('SMT_AI_START_HERE.md'), read('SMT_CONTEXT_MIN.md'), read('SMT_AI_CONTEXT_PACK.md')]);
  assert.match(agents, /SMT_AI_START_HERE\.md/);
  assert.match(start, /order-v1-31/);
  assert.match(compact, /order-v1-31/);
  assert.match(pack, /SMT CHECKPOINT/);
  assert.match(pack, /token 不足不是阻止開發的理由/);
});

test('knowledge graph edges resolve and carry evidence', async () => {
  const graph = JSON.parse(await read('docs/ai-context/SMT_KNOWLEDGE_GRAPH.json'));
  const ids = new Set(graph.nodes.map(node => node.id));
  assert.ok(ids.has('feature.drinks'));
  assert.ok(ids.has('feature.pending'));
  assert.ok(ids.has('feature.supply-state'));
  for (const edge of graph.edges) {
    assert.ok(ids.has(edge.from));
    assert.ok(ids.has(edge.to));
    assert.ok(['EXTRACTED', 'INFERRED'].includes(edge.evidence));
  }
});

test('status separates automation from device acceptance', async () => {
  const status = await read('docs/ai-context/SMT_IMPLEMENTATION_STATUS.md');
  assert.match(status, /自動測試/);
  assert.match(status, /iPad／T2S/);
  assert.match(status, /未 Lock/);
  assert.match(status, /真實訂單提交及付款 API \| 未接入/);
});
