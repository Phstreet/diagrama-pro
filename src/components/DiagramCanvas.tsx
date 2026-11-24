import { useCallback, useEffect } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import {
  Background, BackgroundVariant, Controls, MiniMap, ReactFlow,
  addEdge, useEdgesState, useNodesState, type Connection, type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDiagramStore } from '../store/useDiagramStore';
import type { DiagramEdge, DiagramNode } from '../types/diagram';

export default function DiagramCanvas() {
  const storedNodes = useDiagramStore((state) => state.nodes);
  const storedEdges = useDiagramStore((state) => state.edges);
  const setStoredNodes = useDiagramStore((state) => state.setNodes);
  const setStoredEdges = useDiagramStore((state) => state.setEdges);
  const [nodes, setNodes, onNodesChange] = useNodesState<DiagramNode>(storedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<DiagramEdge>(storedEdges);

  useEffect(() => setStoredNodes(nodes), [nodes, setStoredNodes]);
  useEffect(() => setStoredEdges(edges), [edges, setStoredEdges]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((current) => addEdge({ ...connection, type: 'smoothstep', animated: false }, current));
  }, [setEdges]);

  const onNodeDoubleClick = useCallback((_event: ReactMouseEvent, node: Node) => {
    const current = String((node.data as { label?: string }).label ?? '');
    const label = window.prompt('Nome do elemento:', current);
    if (label?.trim()) {
      setNodes((items) => items.map((item) => item.id === node.id
        ? { ...item, data: { ...item.data, label: label.trim() } }
        : item));
    }
  }, [setNodes]);

  return (
    <div className="canvas-shell">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode={['Backspace', 'Delete']}
        selectionOnDrag
        panOnDrag={[1, 2]}
        defaultEdgeOptions={{ type: 'smoothstep', style: { strokeWidth: 2, stroke: '#a5a1c8' } }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#d9dce5" />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
      <div className="canvas-hint">Arraste para organizar · Conecte pelos pontos · Duplo clique para renomear</div>
    </div>
  );
}