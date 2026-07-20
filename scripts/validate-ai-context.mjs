import { access, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('docs/ai-context/manifest.json', root), 'utf8'));
for (const file of manifest.requiredFiles) await access(new URL(file, root));

const graph = JSON.parse(await readFile(new URL('docs/ai-context/SMT_KNOWLEDGE_GRAPH.json', root), 'utf8'));
if (graph.baseline !== manifest.baseline) throw new Error('Graph and manifest baseline mismatch');
const ids = new Set(graph.nodes.map(node => node.id));
if (ids.size !== graph.nodes.length) throw new Error('Duplicate knowledge graph node id');
for (const edge of graph.edges) {
  if (!ids.has(edge.from) || !ids.has(edge.to)) throw new Error(`Broken graph edge: ${edge.from} -> ${edge.to}`);
  if (!graph.evidenceTypes.includes(edge.evidence)) throw new Error(`Unknown evidence type: ${edge.evidence}`);
}
const pack = await readFile(new URL('SMT_AI_CONTEXT_PACK.md', root), 'utf8');
for (const phrase of ['Chat 模式開發協議', 'SMT CHECKPOINT', manifest.branch, manifest.baseline]) {
  if (!pack.includes(phrase)) throw new Error(`Context pack missing: ${phrase}`);
}
console.log(`SMT Context OS valid: ${manifest.requiredFiles.length} files, ${graph.nodes.length} nodes, ${graph.edges.length} edges`);
