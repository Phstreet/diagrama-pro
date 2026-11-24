import { create } from 'zustand';
import type { DiagramDocument, DiagramEdge, DiagramMode, DiagramNode } from '../types/diagram';

type DiagramState = DiagramDocument & {
  setTitle: (title: string) => void;
  setMode: (mode: DiagramMode) => void;
  setNodes: (nodes: DiagramNode[]) => void;
  setEdges: (edges: DiagramEdge[]) => void;
  replace: (document: DiagramDocument) => void;
};

const initialNodes: DiagramNode[] = [
  { id: 'root', type: 'default', position: { x: 360, y: 180 }, data: { label: 'Ideia central', description: 'Comece por aqui', kind: 'topic', color: 'violet' } },
  { id: 'branch-a', type: 'default', position: { x: 80, y: 80 }, data: { label: 'Planejamento', kind: 'topic', color: 'blue' } },
  { id: 'branch-b', type: 'default', position: { x: 680, y: 80 }, data: { label: 'Execução', kind: 'topic', color: 'green' } },
];
const initialEdges: DiagramEdge[] = [
  { id: 'e-root-a', source: 'root', target: 'branch-a', animated: false, style: { stroke: '#8b83d9', strokeWidth: 2 } },
  { id: 'e-root-b', source: 'root', target: 'branch-b', animated: false, style: { stroke: '#8b83d9', strokeWidth: 2 } },
];

export const useDiagramStore = create<DiagramState>((set) => ({
  version: 1,
  title: 'Meu primeiro mapa',
  mode: 'mindmap',
  nodes: initialNodes,
  edges: initialEdges,
  updatedAt: new Date().toISOString(),
  setTitle: (title) => set({ title, updatedAt: new Date().toISOString() }),
  setMode: (mode) => set({ mode, updatedAt: new Date().toISOString() }),
  setNodes: (nodes) => set({ nodes, updatedAt: new Date().toISOString() }),
  setEdges: (edges) => set({ edges, updatedAt: new Date().toISOString() }),
  replace: (document) => set({ ...document, updatedAt: new Date().toISOString() }),
}));