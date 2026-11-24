import { describe,expect,it } from 'vitest';
import { validateDocument } from './persistence';
describe('validação de documento para exportação/importação',()=>{
 const valid={version:1,title:'Teste',mode:'mindmap',nodes:[{id:'a',position:{x:0,y:0},data:{label:'A'}}],edges:[],updatedAt:new Date().toISOString()};
 it('aceita documento válido',()=>expect(validateDocument(valid).title).toBe('Teste'));
 it('rejeita versão desconhecida',()=>expect(()=>validateDocument({...valid,version:9})).toThrow(/Versão/));
 it('rejeita conexão órfã',()=>expect(()=>validateDocument({...valid,edges:[{id:'e',source:'a',target:'missing'}]})).toThrow(/inexistente/));
});
