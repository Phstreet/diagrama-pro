import { useEffect } from 'react';
import { useDiagramStore } from '../store/diagramStore';
type Actions = { add: (type: 'mind' | 'step' | 'decision', parentId?: string) => void };
export function useKeyboard({ add }: Actions) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = !!target && (['INPUT','TEXTAREA','SELECT'].includes(target.tagName) || target.isContentEditable);
      const s = useDiagramStore.getState();
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { if (!typing) { event.preventDefault(); s.undo(); } return; }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') { if (!typing) { event.preventDefault(); s.redo(); } return; }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') { if (!typing) { event.preventDefault(); s.copy(); } return; }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') { if (!typing) { event.preventDefault(); s.paste(); } return; }
      if (typing) return;
      if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); s.deleteSelected(); }
      if (event.key === 'Tab' && s.selectedId && s.mode === 'mindmap') { event.preventDefault(); add('mind', s.selectedId); }
      if (event.key === 'Enter' && s.selectedId) {
        event.preventDefault();
        const parentEdge = s.edges.find(e => e.target === s.selectedId);
        if (s.mode === 'mindmap') add('mind', parentEdge?.source);
        else add('step', s.selectedId);
      }
    };
    window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler);
  }, [add]);
}
