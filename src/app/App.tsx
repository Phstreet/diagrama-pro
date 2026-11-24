import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, FileJson, GitBranch, LayoutDashboard, Plus, Redo2, Share2, Sparkles, Upload, Workflow } from 'lucide-react';
import { useDiagramStore } from '../store/useDiagramStore';
import { loadDocument, saveDocument } from '../lib/persistence';
import { exportCanvas, exportJson } from '../lib/export';
import DiagramCanvas from '../components/DiagramCanvas';
import type { DiagramDocument, DiagramMode, DiagramNode } from '../types/diagram';

function makeNode(label: string, kind: 'topic' | 'process' | 'decision', index: number): DiagramNode {
  const id = crypto.randomUUID();
  return {
    id,
    type: 'default',
    position: { x: 260 + (index % 3) * 70, y: 130 + index * 42 },
    data: { label, kind, color: kind === 'decision' ? 'amber' : kind === 'process' ? 'blue' : 'violet' },
    style: { borderRadius: kind === 'decision' ? 18 : 14 },
  };
}

export default function App() {
  const title = useDiagramStore((s) => s.title);
  const mode = useDiagramStore((s) => s.mode);
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);
  const setTitle = useDiagramStore((s) => s.setTitle);
  const setMode = useDiagramStore((s) => s.setMode);
  const setNodes = useDiagramStore((s) => s.setNodes);
  const setEdges = useDiagramStore((s) => s.setEdges);
  const replace = useDiagramStore((s) => s.replace);
  const [notice, setNotice] = useState('Todas as alterações são salvas automaticamente');
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = loadDocument();
    if (saved) replace(saved);
  }, [replace]);

  useEffect(() => {
    const document: DiagramDocument = { version: 1, title, mode, nodes, edges, updatedAt: new Date().toISOString() };
    const timeout = window.setTimeout(() => {
      try { saveDocument(document); setNotice('Salvo neste dispositivo'); }
      catch { setNotice('Não foi possível salvar'); }
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [title, mode, nodes, edges]);

  const addNode = (kind: 'topic' | 'process' | 'decision') => {
    const label = kind === 'decision' ? 'Nova decisão' : kind === 'process' ? 'Nova etapa' : 'Novo tópico';
    setNodes([...nodes, makeNode(label, kind, nodes.length)]);
  };

  const changeMode = (next: DiagramMode) => {
    setMode(next);
    setNotice(next === 'mindmap' ? 'Modo mapa mental' : 'Modo fluxograma');
  };

  const importJson = async (file?: File) => {
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== 'object') throw new Error('Arquivo inválido.');
      const candidate = parsed as Partial<DiagramDocument>;
      if (candidate.version !== 1 || !Array.isArray(candidate.nodes) || !Array.isArray(candidate.edges)) {
        throw new Error('O arquivo não contém um diagrama compatível.');
      }
      replace({
        version: 1,
        title: typeof candidate.title === 'string' ? candidate.title : 'Diagrama importado',
        mode: candidate.mode === 'flowchart' ? 'flowchart' : 'mindmap',
        nodes: candidate.nodes,
        edges: candidate.edges,
        updatedAt: new Date().toISOString(),
      });
      setNotice('Diagrama importado com sucesso');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Falha ao importar arquivo');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const runExport = async (format: 'png' | 'svg') => {
    try { await exportCanvas(format); setNotice(`Arquivo ${format.toUpperCase()} exportado`); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Falha na exportação'); }
  };

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><Share2 size={19} /></div><div><strong>diagrama<span>pro</span></strong><small>WORKSPACE</small></div></div>
        <div className="document-title"><input aria-label="Nome do diagrama" value={title} onChange={(e) => setTitle(e.target.value)} /><span>{notice}</span></div>
        <div className="top-actions">
          <button className="button button-quiet" onClick={() => fileInput.current?.click()}><Upload size={16} /> Importar</button>
          <button className="button button-quiet" onClick={() => exportJson({ version: 1, title, mode, nodes, edges, updatedAt: new Date().toISOString() })}><FileJson size={16} /> JSON</button>
          <div className="export-menu"><button className="button button-primary" onClick={() => void runExport('png')}><ArrowDownToLine size={16} /> Exportar</button><button className="export-more" aria-label="Exportar SVG" onClick={() => void runExport('svg')}>SVG</button></div>
          <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={(e) => void importJson(e.target.files?.[0])} />
        </div>
      </header>

      <section className="workspace">
        <aside className="sidebar">
          <div className="sidebar-heading"><LayoutDashboard size={17} /><span>EDITOR</span></div>
          <div className="mode-switch">
            <button className={mode === 'mindmap' ? 'active' : ''} onClick={() => changeMode('mindmap')}><GitBranch size={16} /> Mapa mental</button>
            <button className={mode === 'flowchart' ? 'active' : ''} onClick={() => changeMode('flowchart')}><Workflow size={16} /> Fluxograma</button>
          </div>
          <div className="side-section">
            <label>ADICIONAR ELEMENTO</label>
            <button className="add-item" onClick={() => addNode('topic')}><span className="element-dot dot-violet">T</span><span><b>Tópico</b><small>Ideia ou informação</small></span><Plus size={16} /></button>
            <button className="add-item" onClick={() => addNode('process')}><span className="element-dot dot-blue">P</span><span><b>Etapa</b><small>Processo ou atividade</small></span><Plus size={16} /></button>
            <button className="add-item" onClick={() => addNode('decision')}><span className="element-dot dot-amber">?</span><span><b>Decisão</b><small>Ponto de escolha</small></span><Plus size={16} /></button>
          </div>
          <div className="side-bottom">
            <div className="tip-card"><Sparkles size={17} /><b>Dica rápida</b><p>Selecione um cartão para editá-lo. Arraste a partir dos conectores para criar relações.</p></div>
            <div className="side-meta"><span className="online-dot" /> Armazenamento local ativo</div>
          </div>
        </aside>

        <section className="editor-area">
          <div className="canvas-toolbar"><div><span className="crumb">MEUS DIAGRAMAS</span><span className="crumb-sep">/</span><b>{mode === 'mindmap' ? 'Mapa mental' : 'Fluxograma'}</b></div><div className="canvas-tools"><span>{nodes.length} elementos</span><span className="tool-divider" /><button title="Limpar seleção" onClick={() => setNotice('Seleção liberada')}><Redo2 size={16} /></button></div></div>
          <DiagramCanvas />
          <footer className="statusbar"><span><i className="online-dot" /> {notice}</span><span>DIAGRAMA PRO · V2.0</span></footer>
        </section>
      </section>
    </main>
  );
}