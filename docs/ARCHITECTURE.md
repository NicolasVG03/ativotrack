# Arquitetura do AtivoTrack

> Documento de referência da estrutura arquitetural, padrões de projeto adotados, justificativas de decisão (formato ADR) e estratégias de manutenção, escalabilidade e testes.

---

## Sumário

1. [Arquitetura geral](#1-arquitetura-geral)
2. [Padrões de projeto](#2-padrões-de-projeto)
3. [Decisões arquiteturais (ADRs)](#3-decisões-arquiteturais-adrs)
4. [Manutenção, escalabilidade e testes](#4-manutenção-escalabilidade-e-testes)

---

## 1. Arquitetura geral

### 1.1 Clean Architecture no backend

O backend implementa uma variante de **Clean Architecture** (Robert C. Martin) organizada em quatro camadas concêntricas. A regra de dependência é estrita: o código de uma camada interna nunca importa nada de uma camada externa — toda dependência aponta para dentro.

```
┌─────────────────────────────────────────────────────────────────┐
│  Frameworks & Drivers  (Presentation + Infrastructure)          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Interface Adapters  (Controllers, Routes, Middlewares)    │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Application  (Use Cases, DTOs, AppError)            │  │ │
│  │  │  ┌────────────────────────────────────────────────┐  │  │ │
│  │  │  │  Domain  (Entities, Repository Interfaces,     │  │  │ │
│  │  │  │           Service Interfaces)                  │  │  │ │
│  │  │  └────────────────────────────────────────────────┘  │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### Camada de Domínio (`src/domain/`)

O núcleo puro da aplicação. Não depende de nenhuma biblioteca externa.

| Artefato | Arquivo | Responsabilidade |
|---|---|---|
| Entidade `User` | `domain/entities/User.ts` | Estrutura de dados do usuário; sem lógica de persistência |
| Entidade `Expense` | `domain/entities/Expense.ts` | Estrutura de dados de uma despesa |
| Interface `IUserRepository` | `domain/repositories/IUserRepository.ts` | Contrato de acesso a dados para usuários |
| Interface `IExpenseRepository` | `domain/repositories/IExpenseRepository.ts` | Contrato com filtros, resumo e CRUD de despesas |
| Interface `ITokenService` | `domain/services/ITokenService.ts` | Contrato de geração e verificação de tokens |
| Interface `IHasher` | `domain/services/IHasher.ts` | Contrato de hash e comparação de senhas |

#### Camada de Aplicação (`src/application/`)

Orquestra a lógica de negócio usando somente as interfaces do domínio. Nunca referencia Prisma, Express ou JWT diretamente.

| Artefato | Arquivo | Responsabilidade |
|---|---|---|
| `RegisterUser` | `use-cases/auth/RegisterUser.ts` | Cadastro com validação de e-mail único e hash de senha |
| `LoginUser` | `use-cases/auth/LoginUser.ts` | Autenticação local com comparação de hash |
| `AuthenticateWithGoogle` | `use-cases/auth/AuthenticateWithGoogle.ts` | Verificação de ID token e upsert de usuário Google |
| `CreateExpense` | `use-cases/expenses/CreateExpense.ts` | Criação com validação de valor positivo |
| `ListExpenses` | `use-cases/expenses/ListExpenses.ts` | Listagem com filtros opcionais |
| `GetExpenseById` | `use-cases/expenses/GetExpenseById.ts` | Busca por ID com verificação de ownership |
| `UpdateExpense` | `use-cases/expenses/UpdateExpense.ts` | Atualização com verificação de ownership |
| `DeleteExpense` | `use-cases/expenses/DeleteExpense.ts` | Exclusão com verificação de ownership |
| `GetExpensesSummary` | `use-cases/expenses/GetExpensesSummary.ts` | Agregação total + breakdown por categoria |
| `AppError` | `application/errors/AppError.ts` | Erro de domínio com código HTTP (padrão: 400) |

#### Camada de Infraestrutura (`src/infrastructure/`)

Implementações concretas dos contratos do domínio. Aqui ficam Prisma, bcrypt e jsonwebtoken.

| Artefato | Arquivo | Implementa |
|---|---|---|
| `PrismaUserRepository` | `infrastructure/repositories/PrismaUserRepository.ts` | `IUserRepository` |
| `PrismaExpenseRepository` | `infrastructure/repositories/PrismaExpenseRepository.ts` | `IExpenseRepository` |
| `JwtTokenService` | `infrastructure/auth/JwtTokenService.ts` | `ITokenService` |
| `BcryptHasher` | `infrastructure/auth/BcryptHasher.ts` | `IHasher` |
| Cliente Prisma | `infrastructure/database/prisma/cliente.ts` | Singleton com conexão ao banco |

#### Camada de Apresentação (`src/presentation/`)

Adaptadores HTTP: converte requisições Express em chamadas de use cases e resultados em respostas JSON.

| Artefato | Arquivo | Responsabilidade |
|---|---|---|
| `AuthController` | `presentation/http/controllers/AuthController.ts` | Endpoints de registro, login e Google Sign-In |
| `ExpenseController` | `presentation/http/controllers/ExpenseController.ts` | CRUD + resumo de despesas |
| `authRoutes` | `presentation/http/routes/authRoutes.ts` | Registro de rotas públicas |
| `expenseRoutes` | `presentation/http/routes/expenseRoutes.ts` | Registro de rotas protegidas |
| `authMiddleware` | `presentation/http/middlewares/authMiddleware.ts` | Verificação de Bearer token |
| `validate` | `presentation/http/middlewares/validate.ts` | Validação de body via Zod schema |
| `validateQuery` | `presentation/http/middlewares/validateQuery.ts` | Validação de query params via Zod schema |
| `errorHandler` | `presentation/http/middlewares/errorHandler.ts` | Tratamento centralizado de erros |

#### Composition Root (`src/main/container.ts`)

Ponto único onde todas as dependências são instanciadas e injetadas manualmente. Nenhum framework de IoC é usado — a simplicidade do projeto não justificou essa complexidade adicional.

### 1.2 Arquitetura do frontend

O frontend separa responsabilidades em camadas horizontais, sem adotar Clean Architecture formal:

```
pages/          → Componentes de rota (DashboardPage, AuthPage, LandingPage)
components/ui/  → Componentes visuais reutilizáveis (Button, FormInput, Charts)
hooks/          → Lógica de fetching e mutação com TanStack Query
api/            → Funções de chamada HTTP (authApi, expensesApi, httpClient)
context/        → Estado global de autenticação (AuthContext + AuthProvider)
routes/         → Guards de rota (ProtectedRoute)
types/          → Tipos TypeScript compartilhados
utils/          → Helpers de formatação e cálculo
```

---

## 2. Padrões de projeto

### 2.1 Repository Pattern

**Intenção:** desacoplar a lógica de negócio do mecanismo de persistência por meio de uma interface abstrata.

**Implementação:**

```typescript
// Contrato no domínio — sem dependência de ORM
// backend/src/domain/repositories/IExpenseRepository.ts
export interface IExpenseRepository {
  create(expense: Expense): Promise<Expense>;
  findById(id: string): Promise<Expense | null>;
  findAllByUserId(userId: string, filters?: ExpenseFilters): Promise<Expense[]>;
  update(expense: Expense): Promise<Expense>;
  delete(id: string): Promise<void>;
  getSummaryByUserId(userId: string): Promise<ExpenseSummary>;
}

// Implementação concreta com Prisma — na camada de infraestrutura
// backend/src/infrastructure/repositories/PrismaExpenseRepository.ts
export class PrismaExpenseRepository implements IExpenseRepository { ... }

// Implementação in-memory — usada exclusivamente nos testes unitários
// backend/src/tests/repositories/InMemoryExpenseRepository.ts
export class InMemoryExpenseRepository implements IExpenseRepository { ... }
```

**Por que foi a escolha certa:** os use cases (`CreateExpense`, `ListExpenses`, etc.) recebem `IExpenseRepository` no construtor e nunca sabem se estão falando com o Prisma ou com um array em memória. Isso permite que toda a suíte de testes unitários rode sem banco de dados.

---

### 2.2 Dependency Injection (Injeção de Dependência via construtor)

**Intenção:** inverter o controle da criação de dependências, tornando os objetos configuráveis de fora.

**Implementação:**

Todos os use cases e controllers recebem suas dependências exclusivamente pelo construtor. O composition root em `container.ts` é o único lugar que instancia objetos concretos:

```typescript
// backend/src/main/container.ts
const userRepository = new PrismaUserRepository();
const hasher         = new BcryptHasher();
const tokenService   = new JwtTokenService(JWT_SECRET);

const registerUser   = new RegisterUser(userRepository, hasher, tokenService);
const loginUser      = new LoginUser(userRepository, hasher, tokenService);

export const authController = new AuthController(registerUser, loginUser, authenticateWithGoogle);
```

**Por que foi a escolha certa:** substitui implementações sem alterar nenhum use case. Para testes, basta passar um `InMemoryUserRepository` em vez do `PrismaUserRepository`.

---

### 2.3 Adapter (mapeamento de modelo de persistência para entidade de domínio)

**Intenção:** converter a representação de dados de uma camada para outra sem vazar detalhes de implementação.

**Implementação:**

```typescript
// backend/src/infrastructure/repositories/PrismaExpenseRepository.ts
private toDomain(raw: PrismaExpense): Expense {
  return {
    id: raw.id,
    userId: raw.userId,
    amount: Number(raw.amount),  // Prisma retorna Decimal; domínio usa number
    description: raw.description,
    date: raw.date,
    category: raw.category,
  };
}
```

O Prisma representa `amount` como `Prisma.Decimal`. O domínio usa `number`. O método `toDomain` adapta esse tipo sem que os use cases precisem saber sobre essa diferença.

**Por que foi a escolha certa:** protege o domínio de mudanças no schema do banco (ex: trocar `Decimal` por `Float` no Prisma exigiria mudança apenas em `toDomain`, não nos use cases).

---

### 2.4 Middleware Chain (Cadeia de Middlewares)

**Intenção:** compor comportamentos transversais (autenticação, validação, tratamento de erros) em pipeline, sem poluir os controllers.

**Implementação:**

```
Requisição HTTP
    ↓
CORS middleware           (app.ts)
    ↓
express.json()            (app.ts)
    ↓
authMiddleware            (expenseRoutes.ts — aplicado a todas as rotas de despesas)
    ↓
validate(schema)          (expenseRoutes.ts — aplicado por rota, valida req.body via Zod)
    ↓
validateQuery(schema)     (expenseRoutes.ts — valida req.query via Zod)
    ↓
Controller                (lógica de negócio via use case)
    ↓
errorHandler              (app.ts — captura AppError, ZodError e erros genéricos)
```

**Por que foi a escolha certa:** cada middleware tem uma única responsabilidade. O errorHandler centralizado elimina blocos `try/catch` repetidos nos controllers (que apenas chamam `next(err)` em caso de falha).

---

### 2.5 Padrões complementares

| Padrão | Onde | Benefício |
|---|---|---|
| **Factory Function** | `makeAuthMiddleware(tokenService)` | Middleware parametrizável e testável sem acoplamento ao JWT concreto |
| **Strategy** | `IHasher`, `ITokenService` | Troca bcrypt por argon2 ou JWT por PASETO sem alterar nenhum use case |
| **Singleton** | Cliente Prisma | Conexão única reaproveitada em toda a aplicação |
| **Custom Hooks** | `useExpenses`, `useAuth`, `useExpensesSummary` | Encapsulam TanStack Query e isolam lógica de estado dos componentes |
| **Container/Presentational** | Páginas (hooks) vs. componentes (props) | Separação entre orquestração de dados e apresentação visual |

---

## 3. Decisões arquiteturais (ADRs)

### ADR-00 — Arquitetura geral: Clean Architecture

**Contexto:** Projeto solo dev que precisa demonstrar qualidade arquitetural, ser testável sem infraestrutura externa e suportar mudanças sem efeitos colaterais inesperados.

**Alternativas consideradas:**

| Opção | Por que foi descartada |
|---|---|
| MVC tradicional | Lógica de negócio vaza para controllers e models; difícil testar sem subir o framework |
| Arquitetura em camadas simples | Melhor que MVC, mas ainda permite dependências cruzadas entre camadas |
| Clean Architecture | Escolhida — domínio completamente isolado, dependências sempre apontam para dentro |

**Decisão:** Clean Architecture com quatro camadas concêntricas (Domain → Application → Infrastructure → Presentation).

**Consequências:**
- O domínio não tem nenhuma dependência externa — pode ser testado com `InMemoryRepository` sem banco, sem Express, sem Prisma.
- Adicionar uma nova funcionalidade segue um caminho previsível: use case em `application/`, implementação em `infrastructure/` se necessário, controller e rota em `presentation/` — o domínio raramente muda.
- Mais boilerplate do que MVC para CRUD simples — trade-off consciente em favor da manutenibilidade e demonstração de capacidade arquitetural.

---

### ADR-01 — Runtime e framework HTTP: Node.js + Express 5

**Contexto:** API REST para SPA com volume de dados moderado e equipe com proficiência em TypeScript.

**Decisão:** Node.js 22 com Express 5.

**Consequências:**
- Express 5 propaga erros assíncronos nativamente para o error handler sem `try/catch` explícito nos handlers.
- Ecossistema maduro com curva de entrada baixa para qualquer desenvolvedor JS/TS.
- Sem injeção de dependência automática — o `container.ts` cresce linearmente com novos use cases. NestJS resolveria isso, mas traria complexidade desnecessária para o escopo atual.

---

### ADR-02 — Biblioteca de frontend: React 19 + Vite

**Contexto:** SPA com estado de autenticação global, data fetching com cache e componentes interativos.

**Decisão:** React 19 com Vite como bundler e TanStack Query v5 para estado de servidor.

**Consequências:**
- Vite oferece HMR instantâneo e build rápido via Rollup; TanStack Query elimina gerenciamento manual de loading/error/cache.
- Para a landing page estática, React é overhead — Next.js seria mais adequado para SEO, mas aumentaria a complexidade do projeto.

---

### ADR-03 — Banco de dados: PostgreSQL + Prisma

**Contexto:** Dados relacionais com consultas de agregação (totais por categoria) e necessidade de precisão em valores monetários.

**Decisão:** PostgreSQL 16 com Prisma 7.

**Consequências:**
- Prisma oferece type safety end-to-end e migrações versionadas, garantindo reprodutibilidade do schema em qualquer ambiente.
- O cliente Prisma gerado é pesado para ambientes serverless (cold start), embora o `@prisma/adapter-pg` mitigue parte desse problema.

---

### ADR-04 — Estratégia de autenticação: JWT stateless

**Contexto:** API REST que precisa suportar dois fluxos de autenticação (e-mail/senha e Google Sign-In) e escalar horizontalmente sem infraestrutura adicional de sessão.

**Alternativas consideradas:**

| Opção | Por que foi descartada |
|---|---|
| Sessões + Redis | Requer Redis como dependência de infraestrutura; cria ponto único de falha e impede escala horizontal sem session affinity |
| Sessões em banco de dados | Adiciona leitura ao banco em cada requisição autenticada; penaliza latência |
| JWT stateless | Escolhido — qualquer instância da API verifica o token sem consulta externa |

**Decisão:** JWT assinado com HMAC-SHA256, validade de 7 dias, armazenado em `localStorage` no frontend. O ID token do Google é verificado via `google-auth-library` e convertido em um JWT do próprio sistema — os dois fluxos de autenticação convergem para o mesmo formato de token e o mesmo `authMiddleware`, sem bifurcação de lógica nas rotas protegidas.

**Consequências:**
- Completamente stateless: qualquer instância da API pode verificar qualquer token sem consultar banco ou cache externo.
- Tokens não podem ser revogados antes do vencimento sem uma blocklist — trade-off consciente de escopo. Para um MVP, o risco é aceitável; em produção com requisitos maiores de segurança, a evolução natural seria `HttpOnly cookies` + refresh token de curta duração.
- `localStorage` é vulnerável a XSS. A mitigação correta seria `HttpOnly cookies`, mas exigiria ajustes de CORS e infraestrutura de cookie cross-origin que estão fora do escopo deste desafio.

---

### ADR-05 — Estrutura do repositório: Monorepo simples

**Decisão:** Duas pastas `frontend/` e `backend/` na raiz, cada uma com seu próprio `package.json`, sem workspace manager (Turborepo, Nx ou npm workspaces).

**Consequências:**
- PRs atômicos para mudanças de contrato entre frontend e backend; CI simples com dois jobs independentes.
- Dependências compartilhadas (Zod, TypeScript) duplicadas nos dois `package.json`. Ao crescer, Turborepo seria o próximo passo natural.

---

### ADR-06 — Containerização: Docker com multi-stage build

**Decisão:** `docker-compose.yml` para desenvolvimento (db + db_test + api) e `Dockerfile` multi-stage para produção.

**Consequências:**
- Stage `build` compila TypeScript e gera o cliente Prisma; stage `production` copia apenas `dist/` e dependências de produção, resultando em imagem ~3x menor.
- `db_test` isolado garante que testes de integração nunca contaminam dados de desenvolvimento.
- O frontend não está containerizado — decisão consciente, já que o deploy via Vercel faz o build na nuvem.

---

### ADR-07 — Estrutura do frontend: organização por tipo

**Contexto:** Frontend com três páginas principais (Landing, Auth, Dashboard) e escopo controlado de features.

**Alternativas consideradas:**

| Opção | Estrutura | Quando faz sentido |
|---|---|---|
| Por tipo | `hooks/`, `components/`, `pages/`, `api/` | Projetos pequenos e médios com poucos domínios |
| Por feature | `expenses/`, `auth/`, `dashboard/` cada um com seus hooks, components e api | Projetos grandes com times por domínio |
| Híbrida | Features em `pages/`, compartilhados na raiz | Evolução natural do por tipo |

**Decisão:** Organização por tipo — `pages/`, `components/ui/`, `hooks/`, `api/`, `context/`, `routes/`.

**Consequências:**
- Simples de navegar no escopo atual; todos os hooks em um lugar, todos os componentes em outro.
- Não escala bem conforme novas features são adicionadas — `hooks/` e `components/` se tornam gavetas genéricas com artefatos de domínios distintos misturados.
- A evolução natural para o próximo estágio seria uma estrutura híbrida: features encapsuladas em `src/features/expenses/`, `src/features/auth/`, com componentes e utilitários verdadeiramente genéricos na raiz.

---

### ADR-08 — CRUD de despesas: modal vs rota dedicada

**Contexto:** O formulário de criação e edição de despesas tem quatro campos (descrição, valor, data, categoria). O usuário tipicamente cria e edita sem sair do contexto da listagem com filtros ativos.

**Alternativas consideradas:**

| Opção | Impacto no UX |
|---|---|
| Rota `/despesas/nova` | Perde o contexto da lista — filtros e scroll position são redefinidos ao voltar |
| Modal sobre a lista | Contexto preservado; ao fechar, a lista está intacta com os mesmos filtros |

**Decisão:** `ExpenseFormModal` reutilizado para criar e editar — recebe `expense?: Expense` como prop; se definido, pré-popula os campos em modo edição. `ConfirmDeleteDialog` separado para exclusão.

**Consequências:**
- O usuário não perde o estado da tela (filtros, paginação) ao abrir o formulário — padrão consistente com ferramentas SaaS como Linear e Notion.
- O componente `ExpenseFormModal` centraliza toda a lógica de validação de formulário, eliminando duplicação entre criação e edição.
- Se o formulário evoluir para múltiplas etapas ou upload de comprovante, uma rota dedicada passa a fazer mais sentido — é o gatilho natural para revisitar esta decisão.

---

### ADR-09 — Gerenciamento de estado: Context API + TanStack Query

**Contexto:** O frontend tem dois tipos distintos de estado: autenticação (global, persistente entre navegações) e dados do servidor (despesas, resumo financeiro — remotos, com cache e invalidação).

**Alternativas consideradas:**

| Opção | Por que foi descartada ou limitada |
|---|---|
| Redux / Zustand para tudo | Over-engineering — adiciona um store global para gerenciar estado que já tem solução especializada (TanStack Query para servidor, Context para auth) |
| Context API para tudo | Context não é otimizado para atualizações frequentes de dados remotos — causaria re-renders desnecessários na lista de despesas |
| TanStack Query para tudo | Não é adequado para estado puramente cliente como o token de autenticação |

**Decisão:** Context API exclusivamente para autenticação (`AuthContext` com token + dados do usuário). TanStack Query (`useQuery` + `useMutation`) para todo o estado de servidor — despesas, resumo, operações de CRUD com invalidação automática de cache.

**Consequências:**
- TanStack Query elimina o gerenciamento manual de `loading`, `error` e `refetch` — mutations invalidam automaticamente as queries afetadas, mantendo a UI sincronizada sem código extra.
- `AuthContext` permanece pequeno e estável — evita os problemas de performance do Context (re-render em cascata) por não carregar dados que mudam com frequência.
- Nenhum Zustand ou Redux no projeto — a combinação Context + TanStack Query cobre todos os casos de uso sem adicionar dependências ou conceitos extras.
---

## 4. Manutenção, escalabilidade e testes

### 4.1 Localidade de mudanças

A separação em camadas garante que alterações se propaguem de forma previsível:

| Tipo de mudança | Camadas afetadas |
|---|---|
| Trocar Prisma por outro ORM | Somente `infrastructure/repositories/` |
| Trocar bcrypt por argon2 | Somente `infrastructure/auth/BcryptHasher.ts` |
| Trocar JWT por PASETO | Somente `infrastructure/auth/JwtTokenService.ts` |
| Adicionar campo em `Expense` | `domain/entities/`, schema Prisma, repositório e DTOs — use cases não mudam |
| Adicionar novo endpoint | Novo use case em `application/`, novo método no controller, nova rota — domínio não muda |

**Convenções de nomenclatura:**
- Use cases: `SubstantivoVerbo` com método único `execute()` — ex: `CreateExpense`, `ListExpenses`
- Interfaces: prefixo `I` — ex: `IExpenseRepository`, `ITokenService`
- Implementações Prisma: prefixo `Prisma` — ex: `PrismaExpenseRepository`
- Implementações in-memory (testes): prefixo `InMemory`

---

### 4.2 Escalabilidade

**Horizontal:** A ausência de estado no servidor (JWT stateless) permite rodar múltiplas instâncias atrás de um load balancer sem session affinity. O Docker Compose pode ser substituído por Kubernetes ou ECS sem mudanças no código.

**Banco de dados:** Os campos `userId` (em `Expense`) e `email` (em `User`) são candidatos prioritários a índices, adicionados com `@@index([userId])` no schema Prisma conforme o volume crescer. Consultas de agregação como `getSummaryByUserId` são candidatas a réplica de leitura sem alterar use cases — apenas a implementação do repositório precisaria suportar dois clientes.

**Cache:** Não implementado nesta versão. O endpoint `/expenses/summary` é o candidato natural para Redis (TTL curto, invalidação em create/update/delete).

---

### 4.3 Testes

```
         /\
        /  \       E2E (não implementado — Playwright seria o próximo passo)
       /    \
      /──────\
     /        \    Integração (Supertest + banco real)
    /          \   → auth.integration.spec.ts
   /            \  → expenses.integration.spec.ts
  /──────────────\
 /                \ Unitários (Jest + repositórios in-memory)
/                  \ → LoginUser, RegisterUser, CreateExpense
────────────────────  → ListExpenses, GetExpensesSummary
```

**Testes unitários:** isolam completamente a lógica de negócio. Rodam sem infraestrutura externa, em milissegundos.

```bash
cd backend && npm test
```

**Testes de integração:** testam o sistema de ponta a ponta, da requisição HTTP até o banco real. Cada suite limpa o banco em `beforeEach` via `clearDatabase()`.

```bash
docker compose up db_test -d
cd backend && npm run test:integration
```

**Cobertura:**

```bash
cd backend && npm run test:coverage
# Relatório HTML: backend/src/coverage/lcov-report/index.html
```

**Testabilidade pelo design:** a inversão de dependência (use cases dependem de interfaces, não de implementações) é o que torna a suíte unitária possível sem mocks pesados. Não há `jest.mock()` nos testes unitários — as implementações in-memory são suficientes e mais próximas do comportamento real do que mocks.
