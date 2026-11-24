import type { DiagramDocument } from '../types/diagram';

const STORAGE_KEY = 'diagrama-pro.document.v2';

export function loadDocument(): DiagramDocument | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const doc = value as Partial<DiagramDocument>;
    if (doc.version !== 1 || !Array.isArray(doc.nodes) || !Array.isArray(doc.edges)) return null;
    return {
      version: 1,
      title: typeof doc.title === 'string' ? doc.title : 'Meu diagrama',
      mode: doc.mode === 'flowchart' ? 'flowchart' : 'mindmap',
      nodes: doc.nodes,
      edges: doc.edges,
      updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : new Date().toISOString(),
    };
  } catch (error) {
    console.error('Não foi possível carregar o diagrama salvo.', error);
    return null;
  }
}

export function saveDocument(document: DiagramDocument): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
  } catch (error) {
    console.error('Não foi possível salvar o diagrama.', error);
    throw new Error('Falha ao salvar. Verifique o espaço disponível no navegador.');
  }
}