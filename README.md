# Diagrama Pro

Editor web para criação de mapas mentais e fluxogramas. O projeto utiliza React 19, TypeScript, Vite, React Flow, Zustand e dagre.

## Requisitos

- Node.js 22.12 ou superior
- npm 10 ou superior

## Executar localmente

```bash
git clone https://github.com/Phstreet/diagrama-pro.git
cd diagrama-pro
npm install
npm run dev
```

O Vite exibirá o endereço local no terminal.

## Scripts

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run typecheck` | Executa a verificação de tipos TypeScript |
| `npm run build` | Verifica os tipos e gera a versão de produção |
| `npm run preview` | Executa uma prévia da versão de produção |

## Estrutura do projeto

```text
.
├── public/                 # Arquivos estáticos
├── src/
│   ├── app/                # Composição da aplicação e configuração
│   ├── components/
│   │   ├── nodes/          # Tipos visuais dos nós
│   │   └── ui/             # Telas e componentes de interface
│   ├── hooks/              # Hooks reutilizáveis
│   ├── lib/                # Layout, templates e exportação
│   ├── store/              # Estado global e persistência local
│   ├── types/              # Tipos compartilhados
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

## Recursos atuais

- Modo de mapa mental e modo de fluxograma.
- Templates iniciais para planejamento e aprovação.
- Nós de tópico, etapa e decisão.
- Conexões por arraste, edição de propriedades e recolher/expandir ramificações.
- Zoom, navegação pelo canvas e minimapa.
- Organização automática com dagre.
- Histórico de desfazer/refazer e atalhos de teclado.
- Salvamento automático no armazenamento local do navegador.
- Importação e exportação JSON, PNG, SVG e PDF.
- Tema claro e escuro.

## Persistência e limitações

Os diagramas são salvos no `localStorage` do navegador e, nesta versão, não são sincronizados entre dispositivos. Os campos de raia/responsável estão disponíveis nos nós do fluxograma; a visualização de raias como colunas ou faixas completas ainda é uma evolução planejada.

## Validação

Cada push para `main` e cada pull request executa a verificação TypeScript e o build de produção pelo GitHub Actions.
