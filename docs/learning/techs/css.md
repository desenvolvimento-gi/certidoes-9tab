# CSS

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


## FONTE

existem 5 famílias genéricas de fontes
- serif
- sans-serif
- monospace
- cursive
- fantasy


## LAYOUT

* display: flex
flex é como uma mesa com várias caixas
a organização é na mesa, não nas caixas

<div class="container">
    <button>A</button>
    <button>B</button>
    <button>C</button>
</div>


## ALINHAMENTO

* flex-direction -> eixo principal
* justify-content -> organiza no eixo principal
* align-items -> organiza no eixo transversal


## ESTADOS

estados do componente
- .card
- .card hidden

estados do navegador/aplicação
- :hover -> mouse sobre o elemento
- :focus -> o campo recebeu foco (clicou no input)
- :disabled -> desabilitado
- :checked -> checkbox marcado