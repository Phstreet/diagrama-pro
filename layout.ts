import dagre from 'dagre';
import type { DiagramEdge, DiagramNode } from '../types/diagram';
export function organize(nodes: DiagramNode[], edges: DiagramEdge[], direction: 'LR' | 'TB' = 'LR'): DiagramNode[] {
  const graph = new dagre.graphlib.Graph(); graph.setDefaultEdgeLabel(() => ({})); graph.setGraph({ rankdir: direction, nodesep: 55, ranksep: 100, marginx: 40, marginy: 40 });
  nodes.forEach(n => graph.setNode(n.id, { width: n.type === 'decision' ? 150 : 190, height: n.type === 'decision' ? 110 : 76 }));
  edges.forEach(e => graph.setEdge(e.source, e.target)); dagre.layout(graph);
  return nodes.map(n => { const p = graph.node(n.id); return { ...n, position: { x: p.x - (n.type === 'decision' ? 75 : 95), y: p.y - (n.type === 'decision' ? 55 : 38) } }; });
}
