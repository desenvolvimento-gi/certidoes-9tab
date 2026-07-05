# Solicitação de Certidões — 9tab

Aplicação web para solicitação e consulta de certidões do 9º Tabelionato.

O sistema foi desenvolvido para ser hospedado no GitHub Pages, utilizando Google Identity Services para autenticação, Google Apps Script como backend e Google Sheets como armazenamento operacional consumido por um RPA.

---

Primeiro projeto da plataforma de soluções da trintaetr3s. Desenvolvido com foco em simplicidade, arquitetura modular e aprendizagem contínua.

---

## Objetivos

- Permitir que usuários autorizados solicitem certidões.
- Validar automaticamente os dados informados.
- Registrar as solicitações em uma planilha Google.
- Permitir que o usuário acompanhe o andamento de suas solicitações.
- Disponibilizar os dados para processamento por um RPA.

---

# Arquitetura

```text
GitHub Pages
        │
        ▼
Google Identity Services
        │
        ▼
Frontend
        │
        ▼
Apps Script
        │
        ▼
Google Sheets
        │
        ▼
RPA
```

---

# Funcionalidades

## Autenticação

- Login com Google
- Exibição do nome e e-mail do usuário

## Autorização

- Lista de usuários autorizados
- Validação do ID Token
- Controle de acesso

## Solicitações

- Formulário de solicitação
- Validação dos campos
- Máscaras
- Envio para Google Sheets

## Consulta

- Consulta apenas das solicitações do usuário
- Status colorido
- Número da certidão
- Número do protocolo
- Datas
- Detalhamento

## Dashboard

- Total de solicitações
- Total de certidões emitidas

---

# Estrutura do Projeto

```text
certidoes-9tab/

│
├── css/
├── js/
│   ├── config/
│   ├── core/
│   ├── forms/
│   ├── services/
│   ├── ui/
│   └── utils/
│
├── views/
├── backend/
│   └── apps-script/
└── roadmap.md
```

---

# Engines

O projeto foi organizado em módulos independentes.

## Forms Engine

Responsável pela construção e gerenciamento dos formulários.

## Validation Engine

Validação em tempo real e antes do envio.

## Metadata Engine

Centraliza a configuração estrutural dos formulários.

## Authentication Engine

Integração com Google Identity Services.

## Authorization Engine

Controle de acesso baseado na lista de usuários autorizados.

## API Layer

Comunicação entre frontend e Apps Script.

## Status Configuration

Centraliza os estados visuais da aplicação.

---

# Tecnologias

- HTML5
- CSS3
- JavaScript (ES6)
- Google Identity Services
- Google Apps Script
- Google Sheets
- GitHub Pages

---

# Roadmap

- [x] Estrutura do projeto
- [x] Interface inicial
- [x] Validation Engine
- [x] Metadata Engine
- [x] Integração com Apps Script
- [x] Login Google
- [x] Authorization Engine
- [x] Consulta de solicitações
- [x] Dashboard do usuário
- [ ] Forms Engine baseado em metadados
- [ ] Componentização dos formulários
- [ ] Sessão persistente
- [ ] Testes automatizados

---
# Lições aprendidas

Durante o desenvolvimento deste projeto foram estudados e aplicados:

- Organização de projetos frontend.
- Git e GitHub Pages.
- Live Server.
- Google Identity Services.
- OAuth2.
- Google Apps Script.
- Comunicação HTTP.
- CORS.
- JSONP.
- Validação em duas etapas.
- Arquitetura em camadas.
- Separação de responsabilidades.

---

# Licença

Projeto desenvolvido pela **trintaetr3s** para o **9º Tabelionato**.

Versão atual: **1.0.0**