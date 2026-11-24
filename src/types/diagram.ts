import type { Edge, Node } from '@xyflow/react';

export type DiagramMode = 'mindmap' | 'flowchart' | 'orgchart' | 'sequence';
export type NodeKind = 'topic' | 'process' | 'decision' | 'start' | 'end' | 'person';
export type DiagramNodeData = {
  label: string;
  description?: string;
  color?: string;
  kind?: NodeKind;
};
export type DiagramNode = Node<DiagramNodeData>;
export type DiagramEdge = Edge;
export type DiagramDocument = {
  version: 1;
  title: string;
  mode: DiagramMode;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  updatedAt: string;
};