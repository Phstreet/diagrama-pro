import type { Edge, Node } from '@xyflow/react';

export type DiagramMode = 'mindmap' | 'flowchart';
export type DiagramNodeData = {
  label: string;
  description?: string;
  color?: string;
  kind?: 'topic' | 'process' | 'decision';
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