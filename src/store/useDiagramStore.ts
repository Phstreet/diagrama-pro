import { create } from 'zustand';
import type { DiagramDocument, DiagramEdge, DiagramMode, DiagramNode } from '../types/diagram';

type Snapshot = Pick<DiagramDocument, 'nodes' | 'edges'>;
type DiagramState = DiagramDocument & {
  selectedNodeId: string | null;
  past: Snapshot[];
  future: Snapshot[];
  setTitle: (title: string) => void;
  setMode: (mode: DiagramMode) => void;
  setNodes: (nodes: DiagramNode[]) => void;
  setEdges: (edges: DiagramEdge[]) => void;
  updateNode: (id: string, patch: Partial<DiagramNode['data']>) => void;
  selectNode: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  replace: (document: DiagramDocument) => void;
};

const initialNodes: DiagramNode[] = [
  { id: 'root', type: 'default', position: { x: 360, y: 180 }, data: { label: 'Ideia central', description: 'Comece por aqui', kind: 'topic', color: 'violet' } },
  { id: 'branch-a', type: 'default', position: { x: 80, y: 80 }, data: { label: 'Planejamento', kind: 'topic', color: 'blue' } },
  { id: 'branch-b', type: 'default', position: { x: 680, y: 80 }, data: { label: 'Execução', kind: 'topic', color: 'green' } },
];
const initialEdges: DiagramEdge[] = [
  { id: 'e-root-a', source: 'root', target: 'branch-a', type: 'smoothstep', style: { stroke: '#8b83d9', strokeWidth: 2 } },
  { id: 'e-root-b', source: 'root', target: 'branch-b', type: 'smoothstep', style: { stroke: '#8b83d9', strokeWidth: 2 } },
];
const snapshot = (state: DiagramState): Snapshot => ({ nodes: state.nodes, edges: state.edges });
const history = (state: DiagramState) => ({ past: [...state.past, snapshot(state)].slice(-80), future: [] as Snapshot[] });

export const useDiagramStore = create<DiagramState>((set, get) => ({
  version: 1, title: 'Meu primeiro mapa', mode: 'mindmap',
  nodes: initialNodes, edges: initialEdges, updatedAt: new Date().toISOString(),
  selectedNodeId: null, past: [], future: [],
  setTitle: (title) => set({ title, updatedAt: new Date().toISOString() }),
  setMode: (mode) => set({ mode, updatedAt: new Date().toISOString() }),
  setNodes: (nodes) => set((state) => ({ ...history(state), nodes, updatedAt: new Date().toISOString() })),
  setEdges: (edges) => set((state) => ({ ...history(state), edges, updatedAt: new Date().toISOString() })),
  updateNode: (id, patch) => set((state) => ({ ...history(state), nodes: state.nodes.map((node) => node.id === id ? { ...node, data: { ...node.data, ...patch } } : node), updatedAt: new Date().toISOString() })),
  selectNode: (selectedNodeId) => set({ selectedNodeId }),
  undo: () => set((state) => {
    if (!state.past.length) return state;
    const previous = state.past[state.past.length - 1];
    return { nodes: previous.nodes, edges: previous.edges, past: state.past.slice(0, -1), future: [snapshot(state), ...state.future].slice(0, 80), updatedAt: new Date().toISOString() };
  }),
  redo: () => set((state) => {
    if (!state.future.length) return state;
    const next = state.future[0];
    return { nodes: next.nodes, edges: next.edges, past: [...state.past, snapshot(state)].slice(-80), future: state.future.slice(1), updatedAt: new Date().toISOString() };
  }),
  replace: (document) => set({ ...document, selectedNodeId: null, past: [], future: [], updatedAt: new Date().toISOString() }),
}));