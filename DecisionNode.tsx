import { memo } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { DecisionNodeData } from '../../types/diagram';
function DecisionNode({ data, selected }: NodeProps<Node<DecisionNodeData, 'decision'>>) {
  return <div className={`decision-node ${selected ? 'selected' : ''}`}>
    <Handle type="target" position={Position.Left} />
    <div className="decision-inner"><span>{data.lane || 'DECISÃO'}</span><strong>{data.label}</strong></div>
    <Handle type="source" position={Position.Right} />
  </div>;
}
export default memo(DecisionNode);
