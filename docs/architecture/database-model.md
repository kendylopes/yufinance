---
title: Modelo de Banco de Dados YuFinance
version: 1.2
status: approved
updated_at: 2026-07-27
---

# Modelo de Banco de Dados

## Como usar este documento

Este documento mostra **o que existe hoje no PostgreSQL** e separa isso do que ainda será criado. Consulte-o antes de alterar schemas Drizzle, gerar migrations ou implementar um novo domínio.

## Stack

- PostgreSQL gerenciado pelo Neon;
- Drizzle ORM + Drizzle Kit;
- migrations versionadas;
- `DATABASE_URL` real somente em ambiente local/produção, nunca no Git.

## Convenções

- SQL: `snake_case`;
- TypeScript: `camelCase`;
- Workspace: UUID;
- Identity/Better Auth: IDs `text`;
- eventos temporais do Workspace: `TIMESTAMPTZ`;
- valores financeiros planejados: `NUMERIC(19,4)`.

## IMPLEMENTADO E VALIDADO

### Better Auth

- `user`;
- `session`;
- `account`;
- `verification`.

As tabelas são mantidas com os nomes exigidos pela integração atual do Better Auth. Cadastro real já confirmou criação de `user`, `account` e `session`.

### Workspace

- `workspaces`;
- `workspace_members`;
- `workspace_settings`.

Enums implementados:

- `workspace_type`: `PERSONAL`, `COUPLE`, `FAMILY`;
- `workspace_role`: `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`;
- `theme_preference`: `LIGHT`, `DARK`, `SYSTEM`;
- `week_start`: `SUNDAY`, `MONDAY`.

Defaults validados:

- moeda: `BRL`;
- timezone: `America/Sao_Paulo`;
- locale: `pt-BR`;
- tema: `SYSTEM`;
- início da semana: `MONDAY`;
- exibir centavos: `true`;
- primeiro Membership: `OWNER`.

Integridade já implementada inclui PK composta de Membership, FK com cascade, índices por usuário e Workspace/papel, unicidade de settings por Workspace e checks de nome/moeda/locale.

## PLANEJADO — domínios financeiros

Ainda não considerar como schema implementado:

- `financial_accounts`;
- `categories`;
- `transactions`;
- `transfers`;
- enums financeiros correspondentes.

Essas estruturas serão detalhadas e migradas nas próximas etapas. As regras de precisão monetária e saldo derivado continuam decisões aprovadas, mas ainda não representam tabelas existentes.

## Fluxo de alteração

```text
Regra/documentação
→ schema Drizzle
→ db:generate
→ revisar SQL
→ db:migrate
→ db:check / db:ping
→ testes
→ documentação atualizada
```

`db:push` não é o fluxo oficial para produção.


## Financial Accounts — IMPLEMENTADO

Tabela real:

```text
financial_accounts
```

Campos:

- `id UUID` PK;
- `workspace_id UUID NOT NULL` FK → `workspaces.id` ON DELETE CASCADE;
- `name VARCHAR(80) NOT NULL`;
- `type financial_account_type NOT NULL`;
- `initial_balance NUMERIC(19,4) NOT NULL DEFAULT 0`;
- `currency CHAR(3) NOT NULL DEFAULT BRL`;
- `archived_at TIMESTAMPTZ NULL`;
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`;
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`.

Enum:

```text
CHECKING
SAVINGS
DIGITAL
WALLET
CASH
```

Soft archive é representado por `archived_at`, sem coluna booleana redundante.
