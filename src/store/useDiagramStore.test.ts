import { beforeEach,describe,expect,it } from 'vitest';
import { act,renderHook } from '@testing-library/react';
import { useDiagramStore } from './useDiagramStore';
describe('useDiagramStore',()=>{
 beforeEach(()=>useDiagramStore.getState().createDiagram('Teste'));
 it('cria um diagrama vazio',()=>{const {result}=renderHook(()=>useDiagramStore());expect(result.current.title).toBe('Teste');expect(result.current.nodes).toHaveLength(0);});
 it('desfaz e refaz atualização de nó',()=>{const {result}=renderHook(()=>useDiagramStore());const node={id:'n',type:'diagramNode',position:{x:0,y:0},data:{label:'Antes'}} as never;act(()=>result.current.setNodes([node]));act(()=>result.current.updateNode('n',{label:'Depois'}));expect(result.current.nodes[0].data.label).toBe('Depois');act(()=>result.current.undo());expect(result.current.nodes[0].data.label).toBe('Antes');act(()=>result.current.redo());expect(result.current.nodes[0].data.label).toBe('Depois');});
});
