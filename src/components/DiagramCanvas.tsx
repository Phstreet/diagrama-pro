import { useCallback } from 'react';
import {
  Background, BackgroundVariant, Controls, MiniMap, ReactFlow, addEdge,
  applyEdgeChanges, applyNodeChanges, type Connection, type EdgeChange, type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDiagramStore } from '../store/useDiagramStore';
import type { DiagramEdge, DiagramNode } from '../types/diagram';

export default function DiagramCanvas() {
  const nodes = useDiagramStore((state) => state.nodes);
  const edges = useDiagramStore((state) => state.edges);
  const setNodes = useDiagramStore((state) => state.setNodes);
  const setEdges = useDiagramStore((state) => state.setEdges);
  const selectNode = useDiagramStore((state) => state.selectNode);
  const onNodesChange = useCallback((changes: NodeChange<DiagramNode>[]) => setNodes(applyNodeChanges(changes, nodes) as DiagramNode[]), [nodes, setNodes]);
  const onEdgesChange = useCallback((changes: EdgeChange<DiagramEdge>[]) => setEdges(applyEdgeChanges(changes, edges) as DiagramEdge[]), [edges, setEdges]);
  const onConnect = useCallback((connection: Connection) => setEdges(addEdge({ ...connection, type: 'smoothstep', style: { stroke: '#8175d8', strokeWidth: 2 } }, edges)), [edges, setEdges]);
  return <div className="canvas-shell">
    <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
      onSelectionChange={({ nodes: selected }) => selectNode(selected[0]?.id ?? null)}
      fitView fitViewOptions={{ padding: 0.2 }} deleteKeyCode={['Backspace', 'Delete']} selectionOnDrag panOnDrag={[1, 2]}
      defaultEdgeOptions={{ type: 'smoothstep', style: { strokeWidth: 2, stroke: '#a5a1c8' } }}>
      <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#d9dce5" />
      <MiniMap pannable zoomable />
      <Controls />
    </ReactFlow>
    <div className="canvas-hint">Arraste para organizar · Conecte pelos pontos · Delete remove a seleção</div>
  </div>;
}