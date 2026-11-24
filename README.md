# Diagrama Pro

MVP web para criação de mapas mentais e fluxogramas, com React 19, TypeScript, Vite, Tailwind CSS, React Flow, Zustand e dagre.

## Requisitos
- Node.js 20.19+ ou 22.12+
- npm 10+

## Instalação do zero
```bash
# 1. Criar a pasta e entrar nela
mkdir diagrama-pro && cd diagrama-pro

# 2. Criar o projeto Vite (React + TypeScript)
npm create vite@latest . -- --template react-ts

# 3. Instalar dependências de execução
npm install @xyflow/react zustand dagre html-to-image jspdf lucide-react

# 4. Instalar dependências de desenvolvimento
npm install -D tailwindcss postcss autoprefixer @types/dagre

# 5. Inicializar Tailwind (os arquivos de configuração deste projeto já estão prontos)
npx tailwindcss init -p

# 6. Rodar
npm run dev
```

> Para usar este pacote pronto, extraia o ZIP e execute `npm install` e `npm run dev`. Não execute novamente `create vite` sobre os arquivos extraídos.

## Build de produção
```bash
npm run build
npm run preview
```

## Recursos incluídos
- Dois modos: mapa mental e fluxograma.
- Templates prontos, nó de tópico, etapa e decisão.
- Conexões por arraste, edição do título por duplo clique e propriedades na lateral.
- Arrastar nós, recolher/expandir ramificações, zoom, pan, ajuste inicial à tela e minimapa.
- Organização automática com dagre.
- Histórico, atalhos, autosave local, importação e exportação PNG/SVG/PDF/JSON.
- Temas claro e escuro.

O autosave utiliza localStorage no navegador atual. Os diagramas não são sincronizados entre dispositivos.
