import { describe,expect,it } from 'vitest';
import { serializeDocument } from './export';
const valid={version:1 as const,title:'Teste',mode:'mindmap' as const,nodes:[{id:'a',type:'diagramNode',position:{x:0,y:0},data:{label:'A'}}],edges:[],updatedAt:new Date().toISOString()};
describe('serialização JSON de exportação',()=>{
 it('gera um documento JSON válido e importável',()=>{const value=JSON.parse(serializeDocument(valid));expect(value.title).toBe('Teste');expect(value.nodes).toHaveLength(1);});
 it('rejeita conexões que apontam para nós inexistentes',()=>expect(()=>serializeDocument({...valid,edges:[{id:'e',source:'a',target:'missing'}]})).toThrow(/inexistente/));
});
