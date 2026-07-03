# 02/07/2026

## HTML

html não é layout, é semântica.
é para descrever o significado do conteúdo.

### TAGS
<nav> navegação
<section> seção temática
<article> conteúdo independente
<aside> informação complementar
<div> apenas um agrupamento

<div>
    <button>A</button>
    <button>B</button>
</div>

### ESTRUTURA
<html>
    <head>
        metadados: <meta>
        título: <title>
        dependências (css): <link>
    </head>
    <body>
        componentes <p></p>
        aplicação: <script>
    </body>
</html>


## CSS

layout
-> componentes
 -> detalhes

o pai define o layout, o filho define a aparência

body
 -> app
  -> card
   -> button

componentes descrevem a si mesmos
layout é responsabilidade do contêiner

### FONTE

existem 5 famílias genéricas de fontes
- serif
- sans-serif
- monospace
- cursive
- fantasy

### LAYOUT

* display: flex
flex é como uma mesa com várias caixas
a organização é na mesa, não nas caixas

<div class="container">
    <button>A</button>
    <button>B</button>
    <button>C</button>
</div>

### ALINHAMENTO

* flex-direction -> eixo principal
* justify-content -> organiza no eixo principal
* align-items -> organiza no eixo transversal

### ESTADOS

estados do componente (pseudo-classes)
- .card
- .card hidden

estados do navegador e/ou da aplicação
- :hover -> mouse sobre o elemento
- :focus -> o campo recebeu foco (clicou no input)
- :disabled -> desabilitado
- :checked -> checkbox marcado


# 03/07/2026

## JAVASCRIPT

é uma linguagem baseada em eventos
ou seja, não escrevemos o que ocorre do início ao fim
escrevemos reações a eventos
eventos disparam ações/comportamentos
organizar js por responsabilidade (visuais, serviços etc.)

