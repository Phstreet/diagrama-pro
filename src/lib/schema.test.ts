import {describe,it,expect} from 'vitest';
import {diagramSchema} from './schema';
const valid={version:1,title:'Teste',mode:'mindmap',updatedAt:new Date().toISOString(),nodes:[{id:'a',position:{x:0,y:0},data:{label:'A'}}],edges:[]};
describe('diagramSchema',()=>{it('aceita um documento válido',()=>expect(diagramSchema.safeParse(valid).success).toBe(true));it('rejeita conexão para nó inexistente',()=>expect(diagramSchema.safeParse({...valid,edges:[{id:'e',source:'a',target:'missing'}]}).success).toBe(false));it('rejeita texto vazio',()=>expect(diagramSchema.safeParse({...valid,nodes:[{...valid.nodes[0],data:{label:''}}]}).success).toBe(false));});
