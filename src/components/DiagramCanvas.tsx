import { useCallback, useMemo } from 'react';
import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges, type Connection, type EdgeChange, type NodeChange, Handle, Position } from '@xyflow/react';
import { CirclePlay, CircleStop, GitBranch, FileText, UserRound, Square, Workflow } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import { useDiagramStore } from '../store/useDiagramStore';
import type { DiagramEdge, DiagramNode, NodeKind } from '../types/diagram';
const icons:Record<NodeKind,typeof Square>={topic:GitBranch,process:Workflow,decision:GitBranch,start:CirclePlay,end:CircleStop,document:FileText,person:UserRound,lane:Square};
function DiagramNodeView({data,selected}: {data:DiagramNode['data'];selected:boolean}) {
 const kind=data.kind||'process';const Icon=icons[kind];const isLane=kind==='lane';
 return <div className={`diagram-node shape-${data.shape|| (kind==='decision'?'diamond':'rounded')} kind-${kind}`} style={{background:data.color||'#fff',fontSize:data.fontSize||12,borderWidth:data.lineWidth||1,outline:selected?'2px solid #7669d5':undefined,minWidth:isLane?520:145,minHeight:isLane?260:undefined}} aria-label={data.label}>
 {!isLane&&<><Handle type="target" position={Position.Left}/><span className="node-icon"><Icon size={15}/></span><span className="node-label">{data.label}</span><Handle type="source" position={Position.Right}/></>}
 {isLane&&<span className="lane-title">{data.label}</span>}
 </div>;
}
const nodeTypes={diagramNode:DiagramNodeView};
export default function DiagramCanvas(){
 const nodes=useDiagramStore(s=>s.nodes),edges=useDiagramStore(s=>s.edges),setNodes=useDiagramStore(s=>s.setNodes),setEdges=useDiagramStore(s=>s.setEdges),selectNode=useDiagramStore(s=>s.selectNode),selectEdge=useDiagramStore(s=>s.selectEdge),checkpoint=useDiagramStore(s=>s.checkpoint);
 const onNodesChange=useCallback((changes:NodeChange<DiagramNode>[])=>setNodes(applyNodeChanges(changes,nodes) as DiagramNode[]),[nodes,setNodes]);
 const onEdgesChange=useCallback((changes:EdgeChange<DiagramEdge>[])=>setEdges(applyEdgeChanges(changes,edges) as DiagramEdge[]),[edges,setEdges]);
 const onConnect=useCallback((c:Connection)=>{checkpoint();setEdges(addEdge({ ...c,id:crypto.randomUUID(),type:'smoothstep',markerEnd:{type:'arrowclosed'},style:{stroke:'#8175d8',strokeWidth:2}},edges));},[checkpoint,setEdges,edges]);
 const visibleNodes=useMemo(()=>nodes.filter(n=>!n.data.locked),[nodes]);
 return <div className="canvas-shell"><ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeDragStart={checkpoint} onSelectionChange={({nodes:n,edges:e})=>{selectNode(n[0]?.id||null);selectEdge(e[0]?.id||null);}} fitView fitViewOptions={{padding:.18}} deleteKeyCode={['Backspace','Delete']} selectionOnDrag panOnDrag={[1,2]} nodesDraggable={true} defaultEdgeOptions={{type:'smoothstep',markerEnd:{type:'arrowclosed'},style:{stroke:'#8175d8',strokeWidth:2}}}>
 <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#d9dce5"/><MiniMap pannable zoomable aria-label="Minimapa do diagrama"/><Controls/>
 </ReactFlow><div className="canvas-hint">{visibleNodes.length} elementos editáveis · Arraste conectores para ligar · Shift + clique seleciona vários</div></div>;
}
