import { useRef } from 'react';
import { Download, FileImage, FileJson, FileText, LayoutGrid, Moon, Plus, Redo2, Sun, Undo2, Upload } from 'lucide-react';
import { useDiagramStore } from '../store/diagramStore';
import { exportImage, exportJson, exportPdf, importJson } from '../lib/export';
import { APP_CONFIG } from '../app/config';
type Props = { onAdd: (type: 'mind' | 'step' | 'decision') => void; onOrganize: () => void };
export default function Toolbar({ onAdd, onOrganize }: Props) {
  const mode = useDiagramStore(s => s.mode), theme = useDiagramStore(s => s.theme), setTheme = useDiagramStore(s => s.setTheme), name = useDiagramStore(s => s.name), setName = useDiagramStore(s => s.setName), undo = useDiagramStore(s => s.undo), redo = useDiagramStore(s => s.redo);
  const fileRef = useRef<HTMLInputElement>(null);
  const run = async (fn: () => Promise<void> | void) => { try { await fn(); } catch (e) { alert(e instanceof Error ? e.message : 'Falha ao executar a ação.'); } };
  return <header className="toolbar"><div className="brand-lockup"><div className="brand-mark">D</div><div><strong>{APP_CONFIG.name}</strong><span>EDITOR DE DIAGRAMAS</span></div></div>
    <div className="toolbar-divider" /><input aria-label="Nome do diagrama" className="document-name" value={name} onChange={e => setName(e.target.value)} />
    <div className="toolbar-spacer" />
    <div className="toolbar-group"><button className="icon-button" title="Desfazer (Ctrl+Z)" onClick={undo}><Undo2 size={17}/></button><button className="icon-button" title="Refazer (Ctrl+Y)" onClick={redo}><Redo2 size={17}/></button></div>
    <div className="toolbar-divider" />
    <div className="toolbar-group"><button className="tool-button" onClick={() => onAdd(mode === 'mindmap' ? 'mind' : 'step')}><Plus size={16}/> Novo nó</button><button className="tool-button" onClick={onOrganize}><LayoutGrid size={16}/> Organizar</button></div>
    <div className="toolbar-divider" />
    <div className="toolbar-group"><button className="icon-button" title="Alternar tema" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={17}/> : <Sun size={17}/>}</button>
      <div className="export-wrap"><button className="primary-button" onClick={() => document.getElementById('export-menu')?.classList.toggle('open')}><Download size={16}/> Exportar</button><div id="export-menu" className="export-menu"><button onClick={() => run(() => exportImage('png'))}><FileImage size={15}/> PNG</button><button onClick={() => run(() => exportImage('svg'))}><FileImage size={15}/> SVG</button><button onClick={() => run(exportPdf)}><FileText size={15}/> PDF</button><button onClick={exportJson}><FileJson size={15}/> JSON</button><button onClick={() => fileRef.current?.click()}><Upload size={15}/> Importar JSON</button></div></div>
      <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={e => { const f = e.target.files?.[0]; if (f) void run(() => importJson(f)); e.currentTarget.value = ''; }}/>
    </div>
  </header>;
}
