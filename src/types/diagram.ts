import type { Edge, Node } from '@xyflow/react';

export type DiagramMode = 'mindmap' | 'flowchart' | 'orgchart' | 'sequence';
export type NodeKind = 'topic' | 'process' | 'decision' | 'start' | 'end' | 'document' | 'person' | 'lane';
export type ConnectorKind = 'straight' | 'default' | 'smoothstep';
export type DiagramNodeData = {
  label: string; description?: string; color?: string; kind?: NodeKind;
  shape?: 'rounded' | 'rectangle' | 'pill' | 'diamond'; fontSize?: number;
  lineWidth?: number; locked?: boolean; groupId?: string; laneLabel?: string;
};
export type DiagramNode = Node<DiagramNodeData>;
export type DiagramEdge = Edge;
export type DiagramDocument = {
  version: 1; id?: string; title: string; mode: DiagramMode;
  nodes: DiagramNode[]; edges: DiagramEdge[]; updatedAt: string;
};
export type SavedDiagram = DiagramDocument;
