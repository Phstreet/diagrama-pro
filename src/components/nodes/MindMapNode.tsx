import { memo } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { MindNodeData } from '../../types/diagram';
import { useDiagramStore } from '../../store/diagramStore';
function MindMapNode({ id, data, selected }: NodeProps<Node<MindNodeData, 'mind'>>) {
  const update = useDiagramStore(s => s.updateNode);
  return <div className={`mind-node ${selected ? 'selected' : ''}`} style={{ borderColor: data.color }}>
    <Handle type="target" position={Position.Left} />
    <span className="node-dot" style={{ background: data.color }} />
    <span className="node-label">{data.label}</span>
    <button className="collapse-node" title={data.collapsed ? 'Expandir ramificações' : 'Recolher ramificações'} onClick={e => { e.stopPropagation(); update(id, { collapsed: !data.collapsed }); }}>{data.collapsed ? '+' : '−'}</button>
    <Handle type="source" position={Position.Right} />
  </div>;
}
export default memo(MindMapNode);
