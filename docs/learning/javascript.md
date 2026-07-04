# JAVASCRIPT


é uma linguagem baseada em eventos
ou seja, não escrevemos o que ocorre do início ao fim
escrevemos reações a eventos
eventos disparam ações/comportamentos
organizar js por responsabilidade (visuais, serviços etc.)

ORDEM DOS MÓDULOS
carregar primeiro os arquivos que não dependem de ninguém
depois os que dependem do primeiro e assim sucessivamente

- dom.js
- views.js
- events.js
- app.js

dom.js expõe os elementos da página.
views.js utiliza esses elementos para alterar a interface.
events.js conecta eventos do usuário às funções das views.
app.js apenas inicializa tudo.