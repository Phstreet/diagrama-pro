import { ArrowRight, GitBranch, Network, Sparkles } from 'lucide-react';
import { createTemplate } from '../../lib/templates';
import { useDiagramStore } from '../../store/diagramStore';
import type { DiagramMode } from '../../types/diagram';
import { APP_CONFIG } from '../../app/config';
export default function Home({ onStart }: { onStart: () => void }) {
  const load = useDiagramStore(s => s.load);
  const start = (mode: DiagramMode, template: boolean) => { const doc = createTemplate(mode); if (!template) { doc.nodes = []; doc.edges = []; doc.name = mode === 'mindmap' ? 'Novo mapa mental' : 'Novo fluxograma'; } load(doc); onStart(); };
  return <main className="home-screen"><div className="home-top"><div className="brand-mark large">D</div><span>{APP_CONFIG.name.toUpperCase()}</span></div><section className="home-content"><div className="eyebrow">ESPAÇO DE TRABALHO VISUAL</div><h1>Transforme ideias em<br/><span>estruturas claras.</span></h1><p className="home-lead">Crie mapas mentais e fluxogramas com uma experiência de edição simples, organizada e profissional.</p>
    <div className="mode-grid"><article className="mode-card"><div className="mode-icon mind-icon"><Network size={23}/></div><h2>Mapa mental</h2><p>Organize ideias em torno de um conceito central, conectando tópicos e ramificações.</p><button onClick={() => start('mindmap', false)}>Começar do zero <ArrowRight size={16}/></button><button className="template-link" onClick={() => start('mindmap', true)}><Sparkles size={14}/> Abrir template de planejamento</button></article>
    <article className="mode-card"><div className="mode-icon flow-icon"><GitBranch size={23}/></div><h2>Fluxograma</h2><p>Desenhe processos com etapas, decisões, conexões e responsáveis por raia.</p><button onClick={() => start('flowchart', false)}>Começar do zero <ArrowRight size={16}/></button><button className="template-link" onClick={() => start('flowchart', true)}><Sparkles size={14}/> Abrir template de aprovação</button></article></div>
    <div className="home-foot">SEU TRABALHO É SALVO AUTOMATICAMENTE NESTE DISPOSITIVO</div></section></main>;
}
