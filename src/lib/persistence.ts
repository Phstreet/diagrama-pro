import { openDB, type IDBPDatabase } from 'idb';
import type { DiagramDocument, DiagramMode, SavedDiagram } from '../types/diagram';

const DB_NAME='diagrama-pro-local';
const DB_VERSION=1;
const ACTIVE_KEY='diagrama-pro.active.v3';
const LIST_KEY='diagrama-pro.documents.v3';
const BACKUP_KEY='diagrama-pro.last-valid-backup.v1';
const modes:DiagramMode[]=['mindmap','flowchart','orgchart','sequence'];
type LocalDB={diagrams:SavedDiagram;meta:{key:string;value:unknown}};
let dbPromise:Promise<IDBPDatabase<LocalDB>>|null=null;
let recoveryMessage='';
function database(){if(!dbPromise)dbPromise=openDB<LocalDB>(DB_NAME,DB_VERSION,{upgrade(db){if(!db.objectStoreNames.contains('diagrams'))db.createObjectStore('diagrams',{keyPath:'id'});if(!db.objectStoreNames.contains('meta'))db.createObjectStore('meta',{keyPath:'key'});}});return dbPromise;}
export function validateDocument(value:unknown):DiagramDocument{
 if(!value||typeof value!=='object')throw new Error('O JSON não contém um objeto de diagrama.');
 const d=value as Partial<DiagramDocument>;
 if(d.version!==1||typeof d.title!=='string'||!modes.includes(d.mode as DiagramMode)||!Array.isArray(d.nodes)||!Array.isArray(d.edges))throw new Error('Estrutura inválida: versão, título, modo, nós ou conexões.');
 const ids=new Set<string>();
 for(const n of d.nodes){if(!n||typeof n.id!=='string'||!n.position||!Number.isFinite(n.position.x)||!Number.isFinite(n.position.y)||!n.data||typeof n.data.label!=='string')throw new Error('Um nó possui dados inválidos.');if(ids.has(n.id))throw new Error('O arquivo contém identificadores de nós duplicados.');ids.add(n.id);}
 for(const e of d.edges){if(!e||typeof e.id!=='string'||!ids.has(e.source)||!ids.has(e.target))throw new Error('Uma conexão aponta para um nó inexistente.');}
 return {...d,version:1,updatedAt:typeof d.updatedAt==='string'?d.updatedAt:new Date().toISOString()} as DiagramDocument;
}
async function migrateLegacy(){const db=await database();const count=await db.count('diagrams');if(count>0)return;try{const activeRaw=localStorage.getItem(ACTIVE_KEY);const listRaw=localStorage.getItem(LIST_KEY);const docs:SavedDiagram[]=[];if(listRaw){const parsed=JSON.parse(listRaw);if(Array.isArray(parsed))for(const item of parsed){try{docs.push(validateDocument(item));}catch{recoveryMessage='Alguns diagramas antigos estavam corrompidos e foram ignorados. O conteúdo original continua no armazenamento antigo.';}}}if(activeRaw){try{const active=validateDocument(JSON.parse(activeRaw));if(!docs.some(d=>d.id===active.id))docs.unshift(active);}catch{recoveryMessage='O diagrama ativo antigo estava corrompido. Os demais diagramas foram preservados quando possível.';localStorage.setItem(BACKUP_KEY,activeRaw);}}if(docs.length){const tx=db.transaction('diagrams','readwrite');for(const doc of docs)await tx.store.put(doc);await tx.done;await db.put('meta',{key:'activeId',value:docs[0].id});}}catch{recoveryMessage='Não foi possível migrar todos os dados antigos. O armazenamento original foi mantido para recuperação manual.';}}
let migrationPromise:Promise<void>|null=null;
async function ready(){if(!migrationPromise)migrationPromise=migrateLegacy();await migrationPromise;return database();}
export async function loadDocument():Promise<DiagramDocument|null>{try{const db=await ready();const id=await db.get('meta','activeId');if(id?.value){const found=await db.get('diagrams',String(id.value));if(found)return validateDocument(found);}const all=await db.getAll('diagrams');return all.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0]||null;}catch{recoveryMessage='Falha ao ler o IndexedDB. Os dados antigos não foram apagados; importe um backup ou tente reabrir o aplicativo.';return null;}}
export async function saveDocument(doc:DiagramDocument):Promise<void>{try{const db=await ready();const valid=validateDocument(doc);const tx=db.transaction(['diagrams','meta'],'readwrite');await tx.objectStore('diagrams').put(valid);await tx.objectStore('meta').put({key:'activeId',value:valid.id});await tx.done;try{localStorage.setItem(BACKUP_KEY,JSON.stringify(valid));}catch{/* IndexedDB continua sendo a fonte principal. */}}catch{throw new Error('Não foi possível salvar no armazenamento local. Exporte um backup e verifique o espaço disponível.');}}
export async function listDiagrams():Promise<SavedDiagram[]>{const db=await ready();const all=await db.getAll('diagrams');return all.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));}
export async function upsertDiagram(doc:DiagramDocument):Promise<void>{const db=await ready();await db.put('diagrams',validateDocument(doc));}
export async function deleteDiagram(id:string):Promise<void>{const db=await ready();await db.delete('diagrams',id);}
export async function activateDiagram(doc:DiagramDocument):Promise<void>{const db=await ready();const valid=validateDocument(doc);const tx=db.transaction(['diagrams','meta'],'readwrite');await tx.objectStore('diagrams').put(valid);await tx.objectStore('meta').put({key:'activeId',value:valid.id});await tx.done;}
export async function renameDiagram(id:string,title:string):Promise<void>{const db=await ready();const doc=await db.get('diagrams',id);if(doc)await db.put('diagrams',{...doc,title,updatedAt:new Date().toISOString()});}
export async function importBackup(value:unknown,mode:'replace'|'merge'):Promise<number>{if(!value||typeof value!=='object'||!Array.isArray((value as {diagrams?:unknown}).diagrams))throw new Error('Backup inválido: campo diagrams ausente.');const docs=(value as {diagrams:unknown[]}).diagrams.map(validateDocument);if(!docs.length)throw new Error('O backup não contém diagramas.');const db=await ready();const tx=db.transaction('diagrams','readwrite');if(mode==='replace')await tx.store.clear();for(const doc of docs){const existing=await tx.store.get(doc.id||'');const normalized={...doc,id:mode==='merge'&&existing?crypto.randomUUID():doc.id||crypto.randomUUID()};await tx.store.put(normalized);}await tx.done;return docs.length;}
export async function exportBackup(){const diagrams=await listDiagrams();return {format:'diagrama-pro-backup',version:1,exportedAt:new Date().toISOString(),diagrams};}
export function getRecoveryMessage(){return recoveryMessage;}
export async function requestPersistentStorage():Promise<boolean>{try{return await navigator.storage?.persist?.()??false;}catch{return false;}}
export async function estimateStorage(){try{return await navigator.storage?.estimate?.()??null;}catch{return null;}}
