import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CircleHelp, Plus, Workflow } from 'lucide-react';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';
import Sidebar from '../components/Sidebar';
import Home from '../components/ui/Home';
import { useDiagramStore, readDocument, saveDocument } from '../store/diagramStore';
import { useKeyboard } from '../hooks/useKeyboard';
import { APP_CONFIG } from './config';
import type { DiagramNode } from '../types/diagram';

export default function App() {
  const [started, setStarted] = useState(false);
  const mode = useDiagramStore(s => s.mode), theme = useDiagramStore(s => s.theme), name = useDiagramStore(s => s.name);
  const add = useCallback((type: 'mind' | 'step' | 'decision', parentId?: string) => {
    const s = useDiagramStore.getState(); const parent = s.nodes.find(n => n.id === (parentId || s.selectedId)); const id = crypto.randomUUID();
    const data = type === 'mind' ? { kind: 'mind' as const, label: 'Novo tópico', color: '#6478e8' } : type === 'decision' ? { kind: 'decision' as const, label: 'Nova decisão', lane: 'Processo' } : { kind: 'step' as const, label: 'Nova etapa', lane: 'Processo' };
    const node: DiagramNode = { id, type, position: parent ? { x: parent.position.x + 240, y: parent.position.y + 100 } : { x: 240 + s.nodes.length * 20, y: 180 + s.nodes.length * 20 }, data };
    s.addNode(node); if (parent) s.connect({ id: crypto.randomUUID(), source: parent.id, target: id, type: 'smoothstep' });
  }, []);
  useKeyboard({ add });
  useEffect(() => { const saved = readDocument(); if (saved) { useDiagramStore.getState().load(saved); setStarted(true); } }, []);
  useEffect(() => { if (!started) return; const timer = window.setTimeout(saveDocument, APP_CONFIG.autosaveDelay); return () => window.clearTimeout(timer); }, [started, mode, theme, name]);
  useEffect(() => { if (!started) return; let timer = 0; const unsub = useDiagramStore.subscribe(() => { window.clearTimeout(timer); timer = window.setTimeout(saveDocument, APP_CONFIG.autosaveDelay); }); return () => { window.clearTimeout(timer); unsub(); }; }, [started]);
  const onOrganize = () => { const s = useDiagramStore.getState(); import('../lib/layout').then(({ organize }) => s.setNodes(organize(s.nodes, s.edges))); };
  if (!started) return <Home onStart={() => setStarted(true)}/>;
  return <div className={`app-shell theme-${theme}`}><Toolbar onAdd={add} onOrganize={onOrganize}/><div className="workspace"><main className="editor-column"><div className="canvas-topline"><div><span className="eyebrow">{mode === 'mindmap' ? 'MAPA MENTAL' : 'DIAGRAMA SEQUENCIAL'}</span><span className="save-state"><i/> Salvo automaticamente</span></div><div className="quick-actions"><button onClick={() => setStarted(false)} title="Voltar à tela inicial"><ArrowLeft size={15}/> Início</button><button onClick={() => add(mode === 'mindmap' ? 'mind' : 'step')}><Plus size={15}/> Adicionar</button>{mode === 'flowchart' && <button onClick={() => add('decision')}><Workflow size={15}/> Decisão</button>}</div></div><Canvas/><div className="canvas-hint"><CircleHelp size={13}/> Arraste para conectar · Duplo clique para editar · Tab cria um filho</div></main><Sidebar/></div></div>;
}
