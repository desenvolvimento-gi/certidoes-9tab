# Apps Script Backend

## Como publicar

1. Crie ou abra o projeto Apps Script vinculado à planilha.
2. Copie o conteúdo de `Code.gs` para o Apps Script.
3. Se o script não estiver vinculado à planilha, preencha `SPREADSHEET_ID`.
4. Faça o deploy como Web App.
5. Em "Quem tem acesso", use a opção adequada para teste.
6. Copie a URL terminada em `/exec`.
7. Cole a URL em `js/config/constants.js` na chave `APPS_SCRIPT_URL`.

## Observação sobre CORS

Nesta sprint o frontend usa `APPS_SCRIPT_FETCH_MODE: "no-cors"`.

Isso permite enviar dados do GitHub Pages/Live Server para o Apps Script sem travar por CORS, mas o navegador não consegue ler a resposta real do servidor.

Por isso, nesta etapa a confirmação no frontend é otimista. Depois da autenticação, podemos revisar a estratégia de API.
