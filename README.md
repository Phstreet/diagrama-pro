# Diagrama Pro

Editor web de diagramas com React, TypeScript, React Flow e Zustand. Esta versão oferece edição local, templates, exportação e importação de arquivos JSON.

## Requisitos e instalação

- Node.js 20.19+ ou 22.12+
- npm 10+

```bash
git clone https://github.com/Phstreet/diagrama-pro.git
cd diagrama-pro
npm install
npm run dev
```

A aplicação estará disponível no endereço informado pelo Vite (normalmente http://localhost:5173).

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor local |
| `npm run typecheck` | Verificação TypeScript |
| `npm test` | Testes Vitest |
| `npm run build` | Typecheck e build de produção |
| `npm run preview` | Pré-visualização da build |

## Funcionalidades

- Mapa mental, fluxograma, organograma e diagrama sequencial.
- Nós de tópico, início, fim, processo, decisão, documento e pessoa.
- Edição de texto, descrição, cor, forma, fonte e borda.
- Conexões retas, curvas e em degrau, com setas e rótulos.
- Raias sequenciais, busca, bloqueio, duplicação, alinhamento e distribuição.
- Zoom, pan, minimapa, seleção e layout automático.
- Desfazer/refazer e atalhos de teclado.
- Seis templates editáveis.
- Salvamento local automático e gerenciador de diagramas.
- Importação JSON com validação e exportação JSON, PNG, SVG e PDF.
- Tema claro/escuro e interface adaptável.

## Atalhos

| Atalho | Ação |
|---|---|
| Ctrl/⌘ + Z | Desfazer |
| Ctrl/⌘ + Shift + Z ou Ctrl/⌘ + Y | Refazer |
| Ctrl/⌘ + D | Duplicar nó selecionado |
| Delete / Backspace | Excluir seleção |
| Ctrl/⌘ + S | Salvar (o autosave já está ativo) |
| ? | Abrir atalhos |
| Esc | Fechar janelas e limpar seleção |

## Estrutura

```text
src/
  app/                 Aplicação e configuração
  components/          Canvas e componentes visuais
  lib/                 Templates, layout, persistência e exportação
  store/               Estado e histórico Zustand
  types/               Tipos compartilhados
  index.css            Tema e responsividade
  main.tsx             Entrada React
```

## Testes e qualidade

```bash
npm test
npm run typecheck
npm run build
```

## Deploy na Vercel

1. Envie o repositório para o GitHub.
2. Na Vercel, escolha **Add New Project** e importe `Phstreet/diagrama-pro`.
3. Framework: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Não é necessária variável de ambiente para o MVP.
5. Clique em Deploy. Cada push na branch conectada dispara novo deploy.

O arquivo `vercel.json` contém o fallback de SPA. Para Netlify, use build `npm run build`, diretório `dist` e o arquivo `public/_redirects`.

## Armazenamento e limites

Os diagramas ficam no armazenamento local do navegador. Não há login, sincronização entre dispositivos nem colaboração simultânea nesta fase. Exporte backups JSON regularmente.

## Fase 2

Adicionar autenticação, banco PostgreSQL/Supabase, sincronização em nuvem, compartilhamento por permissões, colaboração em tempo real, histórico remoto e recuperação de versões.
