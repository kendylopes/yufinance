---
title: Modelo de Banco de Dados YuFinance
version: 1.0
status: approved
updated_at: 2026-07-15
---

# Modelo de Banco de Dados

## Banco

PostgreSQL gerenciado pelo Neon.

## ORM

Drizzle ORM.

## Convenções

- SQL em snake_case
- TypeScript em camelCase
- IDs em UUID
- dinheiro em NUMERIC(19,4)
- datas financeiras em DATE
- eventos temporais em TIMESTAMPTZ

## Tabelas principais

- users
- sessions
- accounts_auth
- verifications
- workspaces
- workspace_members
- workspace_settings
- financial_accounts
- categories
- transactions
- transfers

## Enums

- workspace_type
- workspace_role
- account_type
- category_type
- transaction_type
- transaction_status
- theme_preference
- week_start

## Integridade

O banco deverá garantir:

- amount > 0;
- contas diferentes em transferências;
- membership único;
- settings únicas por workspace;
- consistência entre status e paid_at;
- integridade de workspace por foreign keys compostas;
- contas e categorias históricas preservadas.

## Exclusão

- Workspace: CASCADE em exclusão definitiva controlada.
- Account: RESTRICT nas relações e arquivamento na aplicação.
- Category: RESTRICT nas relações e arquivamento na aplicação.
- Transaction: cancelamento preferencial.
- Transfer: exclusão controlada no MVP.

## Índices principais

- workspace_members(user_id)
- workspace_members(workspace_id, role)
- financial_accounts(workspace_id, is_archived)
- categories(workspace_id, type, is_archived)
- transactions(workspace_id, transaction_date)
- transactions(workspace_id, status)
- transactions(workspace_id, type, paid_at)
- transactions(workspace_id, due_date)
- transfers(workspace_id, transfer_date)
