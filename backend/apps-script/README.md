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


## Sprint 5.1 — Autorização no login

Além de validar o token no envio, o backend agora também valida o token durante o login.

Fluxo:

```text
Google Login
↓
Frontend recebe ID token
↓
Frontend chama doGet?action=verifyAccess via JSONP
↓
Apps Script valida o token
↓
Apps Script verifica a aba Emails
↓
Frontend libera ou bloqueia o workspace
```

### Importante

Mantenha o Web App como:

```text
Executar como: Eu
Quem pode acessar: Qualquer pessoa
```

Mesmo com "Qualquer pessoa", o acesso ao sistema continua protegido porque o Apps Script valida o ID token e confere o e-mail na aba `Emails`.

A opção "Qualquer pessoa com Conta do Google" pode impedir que chamadas externas cheguem ao `doGet/doPost`, especialmente em fluxos com `fetch` ou JSONP.


## Sprint 5.2 - Autorização via JSONP

A verificação inicial de autorização usa JSONP com o e-mail do usuário apenas como pré-check de experiência. A segurança definitiva continua no `doPost(e)`, que valida o ID token do Google antes de salvar a solicitação.

Mantenha o Web App implantado como:

- Executar como: **Eu**
- Quem pode acessar: **Qualquer pessoa**

