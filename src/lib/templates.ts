import type { DiagramDocument, DiagramMode, DiagramNode } from '../types/diagram';
import { BRANCH_COLORS } from '../types/diagram';
const id = () => crypto.randomUUID();
export function createTemplate(mode: DiagramMode): DiagramDocument {
  const now = new Date().toISOString();
  if (mode === 'mindmap') {
    const root = id(); const labels = ['Planejamento','Execução','Análise','Entrega'];
    const nodes: DiagramNode[] = [{ id: root, type: 'mind', position: { x: 330, y: 220 }, data: { kind: 'mind', label: 'Projeto', color: '#5367d8' } }];
    const edges = [] as DiagramDocument['edges'];
    labels.forEach((label, i) => { const child = id(); nodes.push({ id: child, type: 'mind', position: { x: 80 + i * 190, y: 60 + (i % 2) * 350 }, data: { kind: 'mind', label, color: BRANCH_COLORS[i] } }); edges.push({ id: id(), source: root, target: child, type: 'smoothstep', style: { stroke: BRANCH_COLORS[i], strokeWidth: 2 } }); });
    return { id: 'template-mind', name: 'Mapa mental — Projeto', mode, theme: 'light', nodes, edges, updatedAt: now, version: 1 };
  }
  const a = id(), b = id(), c = id(), d = id();
  const nodes: DiagramNode[] = [
    { id: a, type: 'step', position: { x: 80, y: 180 }, data: { kind: 'step', label: 'Início', lane: 'Operação' } },
    { id: b, type: 'decision', position: { x: 330, y: 160 }, data: { kind: 'decision', label: 'Aprovado?', lane: 'Gestão' } },
    { id: c, type: 'step', position: { x: 620, y: 70 }, data: { kind: 'step', label: 'Executar', lane: 'Operação' } },
    { id: d, type: 'step', position: { x: 620, y: 300 }, data: { kind: 'step', label: 'Revisar', lane: 'Operação' } }
  ];
  const edges = [{ id: id(), source: a, target: b, type: 'smoothstep' }, { id: id(), source: b, target: c, label: 'Sim', type: 'smoothstep' }, { id: id(), source: b, target: d, label: 'Não', type: 'smoothstep' }];
  return { id: 'template-flow', name: 'Fluxo — Aprovação', mode, theme: 'light', nodes, edges, updatedAt: now, version: 1 };
}
