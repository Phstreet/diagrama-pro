import { create } from 'zustand';
import type { DiagramDocument, DiagramEdge, DiagramMode, DiagramNode, SavedDiagram } from '../types/diagram';

type Snapshot = { nodes: DiagramNode[]; edges: DiagramEdge[] };
type State = DiagramDocument & {
 selectedNodeId: string|null; selectedEdgeId: string|null; past: Snapshot[]; future: Snapshot[];
 setTitle:(v:string)=>void; setMode:(v:DiagramMode)=>void; setNodes:(v:DiagramNode[])=>void;
 setEdges:(v:DiagramEdge[])=>void; updateNode:(id:string,patch:Partial<DiagramNode['data']>)=>void;
 updateEdge:(id:string,patch:Partial<DiagramEdge>)=>void; selectNode:(id:string|null)=>void;
 selectEdge:(id:string|null)=>void; checkpoint:()=>void; undo:()=>void; redo:()=>void;
 replace:(doc:DiagramDocument)=>void; createDiagram:(title?:string)=>void;
};
const initialNodes:DiagramNode[]=[
 {id:'root',type:'diagramNode',position:{x:340,y:170},data:{label:'Ideia central',description:'Comece por aqui',kind:'topic',color:'#eeeaff',shape:'rounded'}},
 {id:'branch-a',type:'diagramNode',position:{x:80,y:80},data:{label:'Planejamento',kind:'topic',color:'#eaf2ff'}},
 {id:'branch-b',type:'diagramNode',position:{x:650,y:80},data:{label:'Execução',kind:'topic',color:'#e8f7ef'}}
];
const initialEdges:DiagramEdge[]=[
 {id:'e-root-a',source:'root',target:'branch-a',type:'smoothstep',style:{stroke:'#8175d8',strokeWidth:2},markerEnd:{type:'arrowclosed'}},
 {id:'e-root-b',source:'root',target:'branch-b',type:'smoothstep',style:{stroke:'#8175d8',strokeWidth:2},markerEnd:{type:'arrowclosed'}}
];
const now=()=>new Date().toISOString();
const snap=(s:State):Snapshot=>({nodes:structuredClone(s.nodes),edges:structuredClone(s.edges)});
const history=(s:State)=>({past:[...s.past,snap(s)].slice(-60),future:[] as Snapshot[]});
export const useDiagramStore=create<State>((set,get)=>({
 version:1,id:crypto.randomUUID(),title:'Meu primeiro mapa',mode:'mindmap',nodes:initialNodes,edges:initialEdges,updatedAt:now(),
 selectedNodeId:null,selectedEdgeId:null,past:[],future:[],
 setTitle:title=>set({title,updatedAt:now()}),setMode:mode=>set({mode,updatedAt:now()}),
 setNodes:nodes=>set({nodes,updatedAt:now()}),setEdges:edges=>set({edges,updatedAt:now()}),
 checkpoint:()=>set(s=>({...history(s)})),
 updateNode:(id,patch)=>set(s=>({...history(s),nodes:s.nodes.map(n=>n.id===id?{...n,data:{...n.data,...patch}}:n),updatedAt:now()})),
 updateEdge:(id,patch)=>set(s=>({...history(s),edges:s.edges.map(e=>e.id===id?{...e,...patch}:e),updatedAt:now()})),
 selectNode:selectedNodeId=>set({selectedNodeId,selectedEdgeId:null}),selectEdge:selectedEdgeId=>set({selectedEdgeId,selectedNodeId:null}),
 undo:()=>set(s=>{if(!s.past.length)return s;const prev=s.past[s.past.length-1];return {...prev,past:s.past.slice(0,-1),future:[snap(s),...s.future].slice(0,60),updatedAt:now()};}),
 redo:()=>set(s=>{if(!s.future.length)return s;const next=s.future[0];return {...next,past:[...s.past,snap(s)].slice(-60),future:s.future.slice(1),updatedAt:now()};}),
 replace:doc=>set({...doc,selectedNodeId:null,selectedEdgeId:null,past:[],future:[],updatedAt:now()}),
 createDiagram:(title='Novo diagrama')=>set({version:1,id:crypto.randomUUID(),title,mode:'mindmap',nodes:[],edges:[],selectedNodeId:null,selectedEdgeId:null,past:[],future:[],updatedAt:now()})
}));
export type { SavedDiagram };
