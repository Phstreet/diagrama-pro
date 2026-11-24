import dagre from 'dagre';
import type { DiagramEdge, DiagramNode } from '../types/diagram';

export function autoLayout(nodes: DiagramNode[], edges: DiagramEdge[], direction: 'TB' | 'LR' = 'TB') {
  if (!nodes.length) return nodes;
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: direction, nodesep: 48, ranksep: 90, marginx: 30, marginy: 30 });
  nodes.forEach((node) => graph.setNode(node.id, { width: 190, height: 76 }));
  edges.forEach((edge) => { if (edge.source && edge.target) graph.setEdge(edge.source, edge.target); });
  dagre.layout(graph);
  return nodes.map((node) => {
    const point = graph.node(node.id);
    return point ? { ...node, position: { x: point.x - 95, y: point.y - 38 } } : node;
  });
}