import type { Edge, Node } from '@xyflow/react';

export type DiagramMode = 'mindmap' | 'flowchart';
export type ThemeMode = 'light' | 'dark';
export type MindNodeData = { label: string; color: string; collapsed?: boolean; description?: string; kind: 'mind' };
export type StepNodeData = { label: string; description?: string; lane?: string; kind: 'step' };
export type DecisionNodeData = { label: string; description?: string; lane?: string; kind: 'decision' };
export type DiagramNodeData = MindNodeData | StepNodeData | DecisionNodeData;
export type DiagramNode = Node<DiagramNodeData>;
export type DiagramEdge = Edge;
export type DiagramDocument = { id: string; name: string; mode: DiagramMode; theme: ThemeMode; nodes: DiagramNode[]; edges: DiagramEdge[]; updatedAt: string; version: 1 };
export const BRANCH_COLORS = ['#6478e8','#18a58b','#e39b42','#d66a86','#8b68c8','#3996c7'];
