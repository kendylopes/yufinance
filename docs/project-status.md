---
title: Status do Projeto YuFinance
version: 1.4
status: active
updated_at: 2026-07-29
---

# Status do Projeto

## Como usar este documento

Este é o checkpoint operacional do YuFinance. Consulte-o primeiro ao retomar o projeto. Ele registra o que está concluído, o que foi validado e qual é o próximo passo oficial.

## Fundação — CONCLUÍDA

- Next.js / React / TypeScript;
- Tailwind CSS v4;
- Biome;
- Drizzle ORM / Drizzle Kit;
- Neon PostgreSQL;
- Better Auth;
- Vitest + Testing Library;
- documentação estruturada;
- scripts de banco e migrations.

## Sprint 2 — Fundação do banco — CONCLUÍDA

Implementado e migrado:

- Better Auth: `user`, `session`, `account`, `verification`;
- Workspace: `workspaces`, `workspace_members`, `workspace_settings`;
- Financial Accounts: `financial_accounts`;
- enums, constraints e índices correspondentes;
- migrations Drizzle;
- Drizzle Studio funcional.

## Sprint 3A — Identity — CONCLUÍDA no escopo atual

- `RegisterUser`;
- validação Zod;
- Better Auth client/server;
- `SignUpForm`;
- `/register`;
- cadastro real;
- `user`, `account` e `session` validados no Neon;
- `getCurrentUser()` server-side;
- acessibilidade com `useId()` e elementos semânticos;
- testes de schema, aplicação e apresentação.

Senha atual: mínimo de 8 e máximo de 128 caracteres.

## Sprint 3B — Workspace / Onboarding — CONCLUÍDA

- módulo oficial em `src/modules/workspace/`;
- `CreateInitialWorkspace`;
- `persistInitialWorkspace`;
- Repository;
- Membership;
- WorkspaceSettings;
- criação conjunta de Workspace + OWNER + Settings;
- proteção contra onboarding duplicado;
- Server Action;
- `OnboardingForm`;
- `/onboarding`;
- `getWorkspaceEntryState()`;
- `/dashboard`;
- teste integrado real no Neon.

### Entry State oficial

```text
UNAUTHENTICATED
→ autenticação

ONBOARDING_REQUIRED
→ /onboarding

READY
→ /dashboard
```

## Sprint 4 — Financial Accounts — CONCLUÍDA

O primeiro domínio financeiro do YuFinance foi implementado e validado ponta a ponta.

### Modelo

`FinancialAccount` pertence obrigatoriamente a um Workspace.

Tipos:

- `CHECKING`;
- `SAVINGS`;
- `DIGITAL`;
- `WALLET`;
- `CASH`.

Persistência monetária:

```text
NUMERIC(19,4)
```

Arquivamento:

```text
ativa      → archivedAt = NULL
arquivada  → archivedAt = timestamp
```

### Casos de uso concluídos

- `CreateFinancialAccount`;
- `ListFinancialAccounts`;
- `GetFinancialAccount`;
- `UpdateFinancialAccount`;
- `ArchiveFinancialAccount`;
- `RestoreFinancialAccount`;
- `ListArchivedFinancialAccounts`.

### Permissões

Leitura:

```text
OWNER / ADMIN / MEMBER / VIEWER
```

Gerenciamento:

```text
OWNER / ADMIN
```

### Regras validadas

- isolamento por `workspaceId`;
- Membership obrigatório;
- nome validado e normalizado;
- nomes duplicados permitidos dentro do Workspace;
- moeda herdada do Workspace;
- saldo inicial com precisão decimal;
- edição comum limitada a `name` e `type`;
- `initialBalance`, `currency`, `workspaceId` e `archivedAt` não são editados pelo formulário comum;
- arquivamento sem exclusão física;
- restauração preservando o mesmo registro;
- contas ativas e arquivadas consultadas separadamente;
- `/dashboard/accounts` consulta ambas em paralelo com `Promise.all`.

### Validação funcional real

Foi validado no navegador e no Neon:

1. criação de conta;
2. persistência do saldo inicial;
3. listagem;
4. edição;
5. retorno para `/dashboard/accounts` após atualização;
6. arquivamento;
7. `archived_at` preenchido no banco;
8. exibição em “Contas arquivadas”;
9. restauração;
10. `archived_at` retornando a `NULL`;
11. preservação dos demais campos.

## Testes

A suíte permanece verde após a conclusão do Sprint 4.

Checkpoint consolidado: **141 testes automatizados aprovados**.

A cobertura inclui:

- Identity;
- Workspace;
- schemas Zod;
- políticas de permissão;
- Create/List/Get/Update/Archive/Restore;
- listagem de arquivadas;
- formulários;
- Server Actions mockadas;
- navegação;
- tratamento seguro de falhas.

## Arquitetura validada

```text
Browser
↓
Client Component
↓
Server Action
↓
Application
↓
Domain Policy
↓
Repository
↓
Drizzle ORM
↓
Neon PostgreSQL
```

Server Components também executam composição e leitura server-side.

## Próxima etapa oficial

**Categorias (Categories).**

Motivo: receitas e despesas precisarão de classificação por categoria. O domínio deve ser documentado antes da implementação, seguindo o mesmo processo usado em Financial Accounts.

## Progresso

```text
Fundação técnica       ██████████ 100%
Identity               ██████████ 100%
Workspace/onboarding   ██████████ 100%
Financial Accounts     ██████████ 100%
Categorias             ░░░░░░░░░░   0%
Transações             ░░░░░░░░░░   0%
Transferências         ░░░░░░░░░░   0%
Dashboard financeiro   ░░░░░░░░░░   0%
```
## Sprint 5 — Categories — EM ANDAMENTO

### Concluído

- modelo de domínio;
- regras de negócio;
- schema Drizzle;
- migration aplicada;
- índices e constraints;
- repository;
- políticas de permissão;
- CreateCategory;
- ListCategories;
- ListArchivedCategories;
- GetCategory;
- UpdateCategory;
- ArchiveCategory;
- RestoreCategory;
- Server Actions;
- testes unitários;
- db:check, check, typecheck e testes aprovados.

### Em andamento

- interface `/dashboard/categories`;
- formulários;
- dialogs;
- integração visual.

### Próximo passo oficial

Construção da interface do módulo Categories.