# AtivoTrack

> **Desafio Técnico — Consultor de Tecnologia | Grupo Ativos**
>
> Plataforma de controle de despesas pessoais construída com autenticação JWT, login social via Google e Clean Architecture no backend. O nome é um trocadilho intencional com "Grupo Ativos" — seus **ativos** financeiros, sob controle.

![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=github-actions&logoColor=white)

**Aplicação publicada:** https://ativotrack.vercel.app/

---

## Sobre o projeto

O AtivoTrack nasceu como desafio técnico para a vaga de Consultor de Tecnologia (único dev) no Grupo Ativos. Além de atender todos os requisitos funcionais, a entrega foi pensada para demonstrar qualidade de código, capacidade arquitetural e visão de produto — não apenas uma aplicação que funciona, mas uma que escala e faz sentido dentro de um contexto real.

A identidade visual reinterpreta a paleta institucional do Grupo Ativos (`#1a2540` azul-marinho + `#C9A84C` dourado) numa linguagem de produto SaaS moderno com glassmorphism — mantendo o DNA da marca sem copiar o site corporativo, já que o público e o propósito são diferentes.

### Funcionalidades

- Cadastro e login de usuários com e-mail/senha
- Login social via Google (OAuth2 / Google Sign-In)
- Autenticação stateless com JWT (validade de 7 dias)
- CRUD completo de despesas (criar, listar, buscar por ID, editar, excluir)
- Filtros de listagem por categoria e intervalo de datas
- Resumo financeiro por categoria (total gasto, contagem e breakdown por categoria)
- Dashboard com gráficos de barras e donut (Recharts / componentes customizados)
- Rotas protegidas no frontend com redirecionamento automático para login
- Invalidação automática de sessão no frontend ao receber resposta `401`
- Containerização completa do backend e banco de dados via Docker
- Pipeline de CI (lint + testes unitários + build) via GitHub Actions

---

## Quick Start

**Pré-requisitos:** Node.js 20+, Docker e Docker Compose instalados.

```bash
# 1. Clone e entre no projeto
git clone https://github.com/<seu-usuario>/ativotrack.git && cd ativotrack

# 2. Configure as variáveis de ambiente do backend
cp backend/.env.example backend/.env
# Edite backend/.env com seu JWT_SECRET e GOOGLE_CLIENT_ID

# 3. Suba o banco e a API
docker compose up --build

# 4. Em outro terminal, rode o frontend
cd frontend && echo "VITE_API_URL=http://localhost:3000" > .env && npm install && npm run dev
```

Acesse: http://localhost:5173

---

## Visão geral da arquitetura

O AtivoTrack adota **Clean Architecture** no backend: o domínio (entidades e interfaces de repositório) é completamente isolado de frameworks e bibliotecas externas, e a direção das dependências sempre aponta para dentro — camadas externas dependem de camadas internas, nunca o contrário. 

O frontend segue uma separação por responsabilidade entre camada de dados (`api/`), estado global (`context/`), hooks de query (`hooks/`) e componentes de apresentação (`pages/`, `components/`). 

Consulte [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) para a análise completa das camadas, padrões de projeto adotados e decisões arquiteturais documentadas no formato ADR.

### Padrões aplicados

| Padrão | Onde | Benefício |
|---|---|---|
| **Repository Pattern** | `IExpenseRepository` no domínio + implementação Prisma na infra | Troca de banco e mocks em testes sem tocar nas regras de negócio |
| **Use Case Pattern** | Cada operação de negócio é uma classe com `execute()` | Regras isoladas, fáceis de testar e de ler |
| **Dependency Injection (manual)** | Use cases recebem dependências via construtor; `container.ts` monta tudo | Baixo acoplamento, sem framework de DI |
| **DTO Pattern** | Objetos de entrada/saída dos use cases | Evita vazar detalhes internos para a camada HTTP |
| **Adapter/Controller** | Controllers traduzem HTTP ↔ use cases | Controllers sem lógica de negócio |
| **Custom Hooks** | `useExpenses`, `useAuth`, `useExpensesSummary` | Encapsulam React Query + lógica de estado |
| **Container/Presentational** | Páginas orquestram dados via hooks; componentes recebem props | Separação entre lógica e apresentação |

### Estrutura de pastas — Backend

```
src/
  domain/
    entities/          → Expense, User
    repositories/      → IExpenseRepository, IUserRepository
    errors/            → erros de domínio tipados

  application/
    use-cases/
      auth/            → RegisterUser, LoginUser, AuthenticateWithGoogle
      expenses/        → CreateExpense, ListExpenses, UpdateExpense,
                         DeleteExpense, GetExpensesSummary
    dtos/              → objetos de entrada/saída dos use cases

  infrastructure/
    database/prisma/   → schema.prisma, client
    repositories/      → PrismaExpenseRepository, PrismaUserRepository
    auth/              → JwtTokenService, BcryptHasher, GoogleTokenValidator

  presentation/
    http/
      controllers/     → ExpenseController, AuthController
      routes/          → expenseRoutes.ts, authRoutes.ts
      middlewares/     → authMiddleware, errorHandler, validationMiddleware

  main/
    server.ts          → composition root
    container.ts       → injeção de dependência manual
```

### Estrutura de pastas — Frontend

```
src/
  api/           → expensesApi.ts, authApi.ts
  components/    → ExpenseForm, ExpenseCard, SummaryChart, Modal...
  pages/         → LandingPage, LoginPage, DashboardPage, DespesasPage
  hooks/         → useAuth, useExpenses, useExpensesSummary
  context/       → AuthContext
  routes/        → AppRoutes.tsx, ProtectedRoute.tsx
  types/         → Expense, User
  utils/         → formatCurrency, formatDate
```

---

## Pré-requisitos

| Ferramenta | Versão mínima | Observação |
|---|---|---|
| Node.js | 20 LTS | 22 recomendado (usado no Dockerfile) |
| npm | 10+ | Incluso com Node.js |
| Docker | 24+ | Apenas para o fluxo com Docker |
| Docker Compose | v2+ | Plugin integrado ao Docker Desktop |
| Git | qualquer recente | — |

---

## Variáveis de ambiente

### Backend — `backend/.env` (baseado em `backend/.env.example`)

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://ativotrack:ativotrack@localhost:5432/ativotrack` |
| `JWT_SECRET` | Segredo para assinar e verificar tokens JWT | `change-me-to-a-random-secret` |
| `GOOGLE_CLIENT_ID` | Client ID do projeto no Google Cloud Console | `123456-abc.apps.googleusercontent.com` |
| `PORT` | Porta HTTP do servidor Express | `3000` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `CORS_ORIGIN` | Origem permitida pelo CORS em desenvolvimento | `http://localhost:5173` |
| `FRONTEND_URL` | URL de produção do frontend (também liberada no CORS) | `https://ativotrack.vercel.app` |

### Frontend — `frontend/.env` (criar manualmente)

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_URL` | URL base da API backend | `http://localhost:3000` |

> **Nota:** se `VITE_API_URL` não for definida, o cliente HTTP faz fallback para `http://localhost:3000`.

---

## Rodando localmente

### Sem Docker

```bash
# Backend
cd backend
cp .env.example .env        # configure JWT_SECRET e GOOGLE_CLIENT_ID
docker compose up db -d     # sobe apenas o PostgreSQL
npm install
npx prisma migrate deploy
npm run dev                  # API em http://localhost:3000

# Frontend (outro terminal)
cd frontend
echo "VITE_API_URL=http://localhost:3000" > .env
npm install
npm run dev                  # App em http://localhost:5173
```

### Com Docker

O `docker-compose.yml` define três serviços:

| Serviço | Imagem | Porta | Descrição |
|---|---|---|---|
| `db` | `postgres:16-alpine` | `5432` | Banco principal |
| `db_test` | `postgres:16` | `5433` | Banco isolado para testes de integração |
| `api` | Build local | `3000` | API REST (aplica migrações na inicialização) |

```bash
cp backend/.env.example backend/.env   # configure as variáveis
docker compose up --build              # API disponível em http://localhost:3000
```

> O frontend não está containerizado — rode separadamente conforme acima.

---

## Scripts disponíveis

### Backend (`backend/`)

| Script | Comando | Descrição |
|---|---|---|
| Desenvolvimento | `npm run dev` | Inicia com `tsx watch` (hot reload) |
| Build | `npm run build` | Compila TypeScript e resolve aliases de path |
| Produção | `npm start` | Executa o build compilado |
| Testes unitários | `npm test` | Roda a suíte Jest (casos de uso + entidades) |
| Testes (watch) | `npm run test:watch` | Jest em modo watch |
| Cobertura | `npm run test:coverage` | Gera relatório de cobertura em `coverage/` |
| Testes de integração | `npm run test:integration` | Roda testes com Supertest contra banco real |
| Todos os testes | `npm run test:all` | Unitários + integração em sequência |
| Lint | `npm run lint` | ESLint com typescript-eslint |

### Frontend (`frontend/`)

| Script | Comando | Descrição |
|---|---|---|
| Desenvolvimento | `npm run dev` | Inicia Vite em modo dev com HMR |
| Build | `npm run build` | Verificação TypeScript + bundle de produção |
| Preview | `npm run preview` | Serve o build local para inspeção |
| Lint | `npm run lint` | ESLint com plugins React |

---

## Executando os testes

### Testes unitários (sem banco)

```bash
cd backend && npm test
```

Os casos de uso são testados com repositórios in-memory (`InMemoryExpenseRepository`, `InMemoryUserRepository`), sem necessidade de banco.

### Testes de integração (requer banco de teste)

```bash
# Suba o banco de testes
docker compose up db_test -d

# Execute os testes de integração
cd backend
npm run test:integration
```

Os testes de integração usam Supertest contra a aplicação Express real conectada ao banco `ativotrack_test` (porta 5433).

### Relatório de cobertura

```bash
cd backend
npm run test:coverage
# Relatório HTML em: backend/src/coverage/lcov-report/index.html
```

### Todos os testes em sequência

```bash
cd backend
npm run test:all
```

---

## Deploy

O pipeline de **CI** é executado via GitHub Actions (`.github/workflows/ci.yml`) em cada push e pull request para `main`:

- **Backend**: `npm ci` → `prisma generate` → `lint` → `npm test` → `npm run build`
- **Frontend**: `npm ci` → `lint` → `npm run build`

**Frontend** publicado na **Vercel** (`frontend/vercel.json` com rewrite de SPA e header `Cross-Origin-Opener-Policy` para o Google Sign-In).

O **backend** é empacotado como imagem Docker via build multi-stage (`backend/Dockerfile`) e pode ser publicado em qualquer plataforma compatível com containers (Railway, Render, Fly.io, etc.). As migrações são aplicadas automaticamente na inicialização do container (`npx prisma migrate deploy`).
