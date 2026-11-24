import { beforeEach,describe,expect,it } from 'vitest';
import { useDiagramStore } from './useDiagramStore';
describe('useDiagramStore',()=>{
 beforeEach(()=>useDiagramStore.getState().createDiagram('Teste'));
 it('cria um diagrama vazio',()=>{const s=useDiagramStore.getState();expect(s.title).toBe('Teste');expect(s.nodes).toHaveLength(0);});
 it('desfaz e refaz atualização de nó',()=>{const s=useDiagramStore.getState();const node={id:'n',type:'diagramNode',position:{x:0,y:0},data:{label:'Antes'}} as never;s.setNodes([node]);s.updateNode('n',{label:'Depois'});expect(useDiagramStore.getState().nodes[0].data.label).toBe('Depois');useDiagramStore.getState().undo();expect(useDiagramStore.getState().nodes[0].data.label).toBe('Antes');useDiagramStore.getState().redo();expect(useDiagramStore.getState().nodes[0].data.label).toBe('Depois');});
});
