# Diagrama Pro

Aplicação web para criar e editar mapas mentais e fluxogramas.

## Stack

- React 19 + TypeScript + Vite
- React Flow para o canvas de diagramas
- Zustand para estado global
- Tailwind CSS e CSS próprio para a interface

## Requisitos

Node.js 22.12+ e npm 10+.

## Instalação

```bash
npm install
npm run dev
```

## Verificação

```bash
npm run typecheck
npm run build
npm run preview
```

## Estrutura

```text
src/
  app/          composição e aplicação
  components/   interface e nós
  hooks/        comportamento reutilizável
  lib/          persistência e exportação
  store/        estado global
  types/        tipos compartilhados
```

## Recursos da versão 2

- Canvas de mapa mental e fluxograma.
- Criação, edição, conexão e remoção de nós.
- Nós de processo e decisão.
- Salvamento automático no navegador.
- Importação e exportação de diagramas em JSON.
- Exportação do canvas para PNG e SVG.
- Zoom, minimapa e controles do React Flow.

Os dados permanecem no navegador por meio do armazenamento local. Sincronização em nuvem e colaboração multiusuário não fazem parte desta versão.
