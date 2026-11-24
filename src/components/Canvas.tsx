import { useCallback, useMemo } from 'react';
import { Background, Controls, ReactFlow, ReactFlowProvider, type Connection, type NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MindMapNode from './nodes/MindMapNode';
import StepNode from './nodes/StepNode';
import DecisionNode from './nodes/DecisionNode';
import MiniMap from './MiniMap';
import { useDiagramStore } from '../store/diagramStore';

function CanvasInner() {
  const nodes = useDiagramStore(s => s.nodes), edges = useDiagramStore(s => s.edges);
  const onNodesChange = useDiagramStore(s => s.onNodesChange), onEdgesChange = useDiagramStore(s => s.onEdgesChange), connect = useDiagramStore(s => s.connect), select = useDiagramStore(s => s.select), updateNode = useDiagramStore(s => s.updateNode), recordHistory = useDiagramStore(s => s.recordHistory);
  const nodeTypes = useMemo(() => ({ mind: MindMapNode, step: StepNode, decision: DecisionNode }), []);
  const hidden = useMemo(() => {
    const hiddenIds = new Set<string>(); const queue = nodes.filter(n => n.type === 'mind' && (n.data as { collapsed?: boolean }).collapsed).map(n => n.id);
    while (queue.length) { const parent = queue.shift()!; edges.filter(e => e.source === parent).forEach(e => { if (!hiddenIds.has(e.target)) { hiddenIds.add(e.target); queue.push(e.target); } }); }
    return hiddenIds;
  }, [nodes, edges]);
  const visibleNodes = useMemo(() => nodes.filter(n => !hidden.has(n.id)), [nodes, hidden]);
  const visibleEdges = useMemo(() => edges.filter(e => !hidden.has(e.source) && !hidden.has(e.target)), [edges, hidden]);
  const onConnect = useCallback((connection: Connection) => { if (connection.source && connection.target && connection.source !== connection.target) connect({ ...connection, id: crypto.randomUUID(), type: 'smoothstep' }); }, [connect]);
  const onNodeDoubleClick: NodeMouseHandler = (_, node) => { const label = window.prompt('Editar título do elemento:', String((node.data as { label: string }).label)); if (label?.trim()) updateNode(node.id, { label: label.trim() }); };
  return <div className="canvas-area" onClick={() => document.getElementById('export-menu')?.classList.remove('open')}><ReactFlow nodes={visibleNodes} edges={visibleEdges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={(_, n) => select(n.id)} onPaneClick={() => select(null)} onNodeDoubleClick={onNodeDoubleClick} onNodeDragStart={recordHistory} fitView fitViewOptions={{ padding: .22 }} deleteKeyCode={null} selectionOnDrag={false} panOnDrag={[1,2]} defaultEdgeOptions={{ type: 'smoothstep', style: { strokeWidth: 2, stroke: '#8993a8' } }}>
    <Background color="var(--grid-color)" gap={22} size={1}/><Controls position="bottom-left" showInteractive={false}/><MiniMap/>
  </ReactFlow></div>;
}
export default function Canvas() { return <ReactFlowProvider><CanvasInner/></ReactFlowProvider>; }
