import { useDiagramStore } from '../store/diagramStore';
import { BRANCH_COLORS } from '../types/diagram';
export default function Sidebar() {
  const selectedId = useDiagramStore(s => s.selectedId); const node = useDiagramStore(s => s.nodes.find(n => n.id === selectedId)); const update = useDiagramStore(s => s.updateNode);
  if (!node) return <aside className="sidebar"><div className="sidebar-empty"><div className="empty-icon">⌁</div><strong>Nenhum elemento selecionado</strong><p>Selecione um nó no canvas para editar suas propriedades.</p></div></aside>;
  const data = node.data as { label: string; description?: string; color?: string; lane?: string };
  return <aside className="sidebar"><div className="sidebar-heading"><div><span className="eyebrow">PROPRIEDADES</span><h3>Elemento</h3></div><span className="type-pill">{node.type === 'mind' ? 'Ramo' : node.type === 'decision' ? 'Decisão' : 'Etapa'}</span></div>
    <label className="field-label" htmlFor="node-label">Título</label><input id="node-label" className="field" value={data.label} maxLength={100} onChange={e => update(node.id, { label: e.target.value })} />
    <label className="field-label" htmlFor="node-description">Descrição</label><textarea id="node-description" className="field textarea" rows={4} value={data.description || ''} maxLength={500} placeholder="Adicione detalhes..." onChange={e => update(node.id, { description: e.target.value })} />
    {node.type === 'mind' ? <><label className="field-label">Cor do ramo</label><div className="color-list">{BRANCH_COLORS.map(color => <button key={color} aria-label={`Selecionar cor ${color}`} className={`color-swatch ${data.color === color ? 'active' : ''}`} style={{ background: color }} onClick={() => update(node.id, { color })} />)}</div></> : <><label className="field-label" htmlFor="node-lane">Raia / responsável</label><input id="node-lane" className="field" value={data.lane || ''} maxLength={60} placeholder="Ex.: Operação" onChange={e => update(node.id, { lane: e.target.value })} /></>}
    <div className="sidebar-tip">Dica: use duplo clique no elemento para editar o título diretamente.</div>
  </aside>;
}
