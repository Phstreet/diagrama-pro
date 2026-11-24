import {beforeEach,describe,expect,it} from 'vitest';
import 'fake-indexeddb/auto';
import {deleteDB} from 'idb';
import {exportBackup,importBackup,loadDocument,listDiagrams,saveDocument,validateDocument} from './persistence';
const doc={version:1 as const,id:'doc-a',title:'Mapa local',mode:'mindmap' as const,nodes:[{id:'n1',position:{x:0,y:0},data:{label:'Raiz'}}],edges:[],updatedAt:new Date().toISOString()};
beforeEach(async()=>{await deleteDB('diagrama-pro-local');localStorage.clear();});
describe('armazenamento offline',()=>{it('salva e carrega no IndexedDB',async()=>{await saveDocument(doc);expect((await loadDocument())?.title).toBe('Mapa local');});it('exporta e importa backup',async()=>{await saveDocument(doc);const backup=await exportBackup();await importBackup(backup,'replace');expect((await listDiagrams()).length).toBe(1);});it('rejeita diagrama corrompido',()=>expect(()=>validateDocument({...doc,nodes:[{...doc.nodes[0],position:{x:NaN,y:0}}]})).toThrow());it('migra diagramas legados do localStorage',async()=>{localStorage.setItem('diagrama-pro.documents.v3',JSON.stringify([doc]));expect((await listDiagrams()).map(x=>x.id)).toContain('doc-a');});});
