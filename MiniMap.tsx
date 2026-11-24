import { MiniMap as FlowMiniMap } from '@xyflow/react';
export default function MiniMap() { return <FlowMiniMap pannable zoomable nodeColor={node => String((node.data as { color?: string }).color || (node.type === 'decision' ? '#e4a33e' : '#7182db'))} maskColor="rgba(30,41,59,.08)" />; }
