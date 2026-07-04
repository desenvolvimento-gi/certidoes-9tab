# Decisões de Arquitetura

## ADR-001 — Remover pasta frontend

A raiz do repositório passa a ser o ponto de entrada do GitHub Pages. Isso elimina o redirecionamento para `/frontend/`.

## ADR-002 — Usar views em vez de partials

Fragmentos HTML reutilizáveis serão armazenados em `views/`, por representar melhor pedaços de interface carregados pela aplicação.

## ADR-003 — Criar camada core

A inicialização e o carregamento da aplicação ficam em `js/core/`, separando bootstrap, carregamento de views e futuramente estado da aplicação.
