# HTML

html não é layout, é semântica.
é para descrever o significado do conteúdo.


## TAGS

<nav> navegação
<section> seção temática
<article> conteúdo independente
<aside> informação complementar
<div> apenas um agrupamento

<div>
    <button>A</button>
    <button>B</button>
</div>


## ESTRUTURA

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


## DATA ATTRIBUTES
usado para atribuir propriedades extras nos elementos
- data-anythings

<article
  id="electriccars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
  ...
</article>

e para acessar essas informações?

- var article = document.getElementById("electriccars");
    article.dataset.columns; // "3"
    article.dataset.indexNumber; // "12314"
    article.dataset.parent; // "cars"

cada propriedade é uma string
esses dados são acessíveis no CSS

