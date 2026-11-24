import { memo } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { StepNodeData } from '../../types/diagram';
function StepNode({ data, selected }: NodeProps<Node<StepNodeData, 'step'>>) {
  return <div className={`step-node ${selected ? 'selected' : ''}`}>
    <Handle type="target" position={Position.Left} />
    <span className="step-kicker">{data.lane || 'ETAPA'}</span><strong>{data.label}</strong>
    {data.description && <small>{data.description}</small>}
    <Handle type="source" position={Position.Right} />
  </div>;
}
export default memo(StepNode);
