import type { DiagramDocument, DiagramMode, SavedDiagram } from '../types/diagram';
const ACTIVE_KEY='diagrama-pro.active.v3'; const LIST_KEY='diagrama-pro.documents.v3';
const modes:DiagramMode[]=['mindmap','flowchart','orgchart','sequence'];
export function validateDocument(value:unknown):DiagramDocument {
 if(!value||typeof value!=='object')throw new Error('O JSON não contém um objeto de diagrama.');
 const d=value as Partial<DiagramDocument>;
 if(d.version!==1)throw new Error('Versão de arquivo não suportada. Exporte novamente pelo Diagrama Pro.');
 if(typeof d.title!=='string'||!modes.includes(d.mode as DiagramMode)||!Array.isArray(d.nodes)||!Array.isArray(d.edges))throw new Error('Estrutura inválida: título, modo, nós ou conexões ausentes.');
 const ids=new Set<string>();
 for(const n of d.nodes){if(!n||typeof n.id!=='string'||!n.position||typeof n.position.x!=='number'||typeof n.position.y!=='number'||!n.data||typeof n.data.label!=='string')throw new Error('Um nó possui dados inválidos.');if(ids.has(n.id))throw new Error('O arquivo contém identificadores de nós duplicados.');ids.add(n.id);}
 for(const e of d.edges){if(!e||typeof e.id!=='string'||!ids.has(e.source)||!ids.has(e.target))throw new Error('Uma conexão aponta para um nó inexistente.');}
 return {...d,version:1,updatedAt:typeof d.updatedAt==='string'?d.updatedAt:new Date().toISOString()} as DiagramDocument;
}
export function loadDocument():DiagramDocument|null {try{const raw=localStorage.getItem(ACTIVE_KEY);return raw?validateDocument(JSON.parse(raw)):null;}catch{return null;}}
export function saveDocument(doc:DiagramDocument):void {try{localStorage.setItem(ACTIVE_KEY,JSON.stringify(doc));upsertDiagram(doc);}catch{throw new Error('Não foi possível salvar. Verifique o espaço disponível no navegador.');}}
export function listDiagrams():SavedDiagram[]{try{const v=JSON.parse(localStorage.getItem(LIST_KEY)||'[]');return Array.isArray(v)?v.map(validateDocument).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)):[];}catch{return [];}}
export function upsertDiagram(doc:DiagramDocument):void {const list=listDiagrams().filter(d=>d.id!==doc.id);localStorage.setItem(LIST_KEY,JSON.stringify([{...doc,id:doc.id||crypto.randomUUID()},...list].slice(0,100)));}
export function deleteDiagram(id:string):void {localStorage.setItem(LIST_KEY,JSON.stringify(listDiagrams().filter(d=>d.id!==id)));}
export function activateDiagram(doc:DiagramDocument):void {localStorage.setItem(ACTIVE_KEY,JSON.stringify(doc));}
