# Backend Apps Script

## Sprint 5 — Login Google

Este backend recebe solicitações do frontend, valida o ID token do Google e grava os dados na aba `Solicitações`.

## Configuração obrigatória

No `Code.gs`, configure:

```js
const GOOGLE_CLIENT_ID = "SEU_CLIENT_ID.apps.googleusercontent.com";
```

Use exatamente o mesmo Client ID configurado no frontend em:

```js
APP_CONFIG.GOOGLE_CLIENT_ID
```

## Deploy

No Apps Script:

1. Implantar > Gerenciar implantações.
2. Editar implantação do Web App.
3. Executar como: **Eu**.
4. Quem pode acessar: **Qualquer pessoa**.
5. Implantar.
6. Copiar a URL `/exec`.
7. Colar em `APP_CONFIG.APPS_SCRIPT_URL`.

## Abas esperadas

- `Solicitações`
- `Emails`

A aba `Emails` deve ter a lista de e-mails autorizados na coluna A, a partir da linha 2.

## Observação sobre CORS

O frontend usa `mode: "no-cors"` para enviar dados ao Apps Script.

Consequência: o envio chega ao backend, mas o navegador não consegue ler a resposta real do servidor.

Por isso, erros de autorização ou validação do backend devem ser conferidos em:

- Apps Script > Executions
- Planilha `Solicitações`
