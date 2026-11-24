import { create } from 'zustand';
import { applyEdgeChanges, applyNodeChanges, type EdgeChange, type NodeChange } from '@xyflow/react';
import type { DiagramEdge, DiagramMode, DiagramNode, DiagramDocument, ThemeMode } from '../types/diagram';
import { APP_CONFIG } from '../app/config';

type Snapshot = { nodes: DiagramNode[]; edges: DiagramEdge[] };
type Store = {
  nodes: DiagramNode[]; edges: DiagramEdge[]; mode: DiagramMode; theme: ThemeMode; name: string;
  selectedId: string | null; past: Snapshot[]; future: Snapshot[];
  setMode: (mode: DiagramMode) => void; setTheme: (theme: ThemeMode) => void; setName: (name: string) => void;
  setNodes: (nodes: DiagramNode[]) => void; setEdges: (edges: DiagramEdge[]) => void; recordHistory: () => void;
  onNodesChange: (changes: NodeChange<DiagramNode>[]) => void; onEdgesChange: (changes: EdgeChange<DiagramEdge>[]) => void;
  addNode: (node: DiagramNode) => void; updateNode: (id: string, data: Partial<DiagramNode['data']>) => void;
  deleteSelected: () => void; select: (id: string | null) => void; connect: (edge: DiagramEdge) => void;
  undo: () => void; redo: () => void; copy: () => void; paste: () => void;
  load: (doc: DiagramDocument) => void; reset: () => void;
};
const snapshot = (s: Store): Snapshot => ({ nodes: structuredClone(s.nodes), edges: structuredClone(s.edges) });
const commit = (s: Store, patch: Partial<Store>) => ({ ...patch, past: [...s.past.slice(-49), snapshot(s)], future: [] });
let clipboard: DiagramNode | null = null;
export const useDiagramStore = create<Store>((set, get) => ({
  nodes: [], edges: [], mode: 'mindmap', theme: 'light', name: 'Meu diagrama', selectedId: null, past: [], future: [],
  setMode: mode => set({ mode }), setTheme: theme => set({ theme }), setName: name => set({ name }),
  setNodes: nodes => set(s => ({ ...commit(s, {}), nodes })), setEdges: edges => set(s => ({ ...commit(s, {}), edges })), recordHistory: () => set(s => ({ past: [...s.past.slice(-49), snapshot(s)], future: [] })),
  onNodesChange: changes => set(s => ({ nodes: applyNodeChanges(changes, s.nodes) as DiagramNode[] })),
  onEdgesChange: changes => set(s => ({ edges: applyEdgeChanges(changes, s.edges) as DiagramEdge[] })),
  addNode: node => set(s => ({ ...commit(s, {}), nodes: [...s.nodes, node], selectedId: node.id })),
  updateNode: (id, data) => set(s => ({ ...commit(s, {}), nodes: s.nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } as DiagramNode['data'] } : n) })),
  deleteSelected: () => set(s => ({ ...commit(s, {}), nodes: s.nodes.filter(n => n.id !== s.selectedId), edges: s.edges.filter(e => e.source !== s.selectedId && e.target !== s.selectedId), selectedId: null })),
  select: selectedId => set({ selectedId }),
  connect: edge => set(s => ({ ...commit(s, {}), edges: [...s.edges, edge] })),
  undo: () => set(s => { const prev = s.past.at(-1); if (!prev) return s; return { nodes: prev.nodes, edges: prev.edges, past: s.past.slice(0,-1), future: [snapshot(s), ...s.future] }; }),
  redo: () => set(s => { const next = s.future[0]; if (!next) return s; return { nodes: next.nodes, edges: next.edges, past: [...s.past, snapshot(s)], future: s.future.slice(1) }; }),
  copy: () => { const n = get().nodes.find(x => x.id === get().selectedId); clipboard = n ? structuredClone(n) : null; },
  paste: () => { if (!clipboard) return; const n = structuredClone(clipboard); n.id = crypto.randomUUID(); n.position = { x: n.position.x + 40, y: n.position.y + 40 }; get().addNode(n); },
  load: doc => set({ nodes: doc.nodes, edges: doc.edges, mode: doc.mode, theme: doc.theme, name: doc.name, selectedId: null, past: [], future: [] }),
  reset: () => set({ nodes: [], edges: [], selectedId: null, past: [], future: [] })
}));

export function saveDocument() {
  const s = useDiagramStore.getState();
  const doc: DiagramDocument = { id: 'workspace', name: s.name, mode: s.mode, theme: s.theme, nodes: s.nodes, edges: s.edges, updatedAt: new Date().toISOString(), version: 1 };
  try { localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(doc)); } catch (error) { console.error('Não foi possível salvar o diagrama:', error); }
}
export function readDocument(): DiagramDocument | null {
  try { const raw = localStorage.getItem(APP_CONFIG.storageKey); if (!raw) return null; const doc = JSON.parse(raw) as DiagramDocument; if (doc.version !== 1 || !Array.isArray(doc.nodes) || !Array.isArray(doc.edges)) return null; return doc; }
  catch (error) { console.error('Dados locais inválidos:', error); return null; }
}
