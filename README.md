# eContador Bank

Aplicativo para estudo de automação bancária desenvolvido com JavaScript (Node.js + React).

## Funcionalidades

- **Autenticação**: Login e cadastro com token JWT (expira em 1h)
- **Gestão de Contas**: CRUD completo de contas bancárias
- **Transferências**: Sistema de transferências entre contas com validações
- **Dashboard**: Visão geral com saldo, movimentações e gráficos
- **Comprovantes**: Geração e compartilhamento de comprovantes

## Tecnologias

### Backend
- Node.js + Express
- JWT para autenticação
- Bcrypt para criptografia
- Banco de dados em memória
- Arquitetura MVC (Model, Service, Controller)

### Frontend
- React + React Router
- Axios para requisições HTTP
- Recharts para gráficos
- CSS responsivo

## Como executar

### Backend
```bash
cd backend
npm install
npm run dev
```
O servidor rodará na porta 3001.

### Frontend
```bash
cd frontend
npm install
npm start
```
A aplicação rodará na porta 3000.

## Dados de Teste

O sistema já vem com dados pré-cadastrados:
- **Usuário**: joao@email.com / 123456
- **Contas**: 2 contas já cadastradas
- **Transferência**: 1 transferência de exemplo

## Validações Implementadas

- Valor máximo de transferência: R$ 5.000,00
- Não permite transferir para a mesma conta
- Validação de saldo suficiente
- Não permite contas duplicadas por usuário
- Todos os campos obrigatórios validados

## Estrutura do Projeto

```
econtador-bank/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   └── database/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── context/
    │   └── utils/
    └── public/
```