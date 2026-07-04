# DOM

document object model
DOM é para o javascript o que o DATAFRAME é para o python
javascript não altera o HTML, ele conversa com o DOM
o DOM lê o arquivo HTML e cria uma árvore de objetos
então o javascript não está alterando o arquivo html

PROGRAMAÇÃO ORIENTADA A OBJETOS
object.property
object.method()

1. javascript encontra o objeto e adiciona a classe
2. DOM muda o objeto em memória e o navegador percebe
3. navegador recalcula o CSS e atualiza a página


MÉTODOS DOM
- document.getElementById()
- elemento
    .classList.add()
    .addEventListener()
    .focus()

CLASSLIST
- separação javascript x css
em vez de alterar estilos diretamente no javascript,
é preferível deixar a responsabilidade com o CSS

EVENTOS RECEBEM FUNÇÕES
//hideLogin em vez de hideLogin()
- button.addEventListener(
    "click",
    hideLogin
);