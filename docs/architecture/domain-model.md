---
title: Modelo de Domínio YuFinance
version: 1.0
status: approved
updated_at: 2026-07-15
---

# Modelo de Domínio

## Entidades

### User
Representa a identidade autenticada.

### Workspace
Representa um espaço financeiro isolado.

### WorkspaceMember
Relaciona usuário e workspace.

### WorkspaceSettings
Armazena preferências do workspace.

### Account
Representa onde o dinheiro está armazenado.

### Category
Classifica receitas e despesas.

### Transaction
Representa receita ou despesa.

### Transfer
Representa movimentação entre contas.

## Relacionamentos

```text
User
  ↓
WorkspaceMember
  ↓
Workspace
  ├── Account
  ├── Category
  ├── Transaction
  ├── Transfer
  └── WorkspaceSettings
```

## Agregados

### Workspace Aggregate
- Workspace
- WorkspaceMember
- WorkspaceSettings

### Account Aggregate
- Account

### Transaction Aggregate
- Transaction

### Transfer Aggregate
- Transfer

## Serviços de domínio

- AccountBalanceService
- WorkspaceAccessService
- TransactionStatusService
- DefaultCategoryService
- DashboardQueryService

## Eventos de domínio previstos

- UserRegistered
- WorkspaceCreated
- DefaultCategoriesCreated
- AccountCreated
- TransactionCreated
- TransactionPaid
- TransactionPaymentReverted
- TransactionCanceled
- TransferCreated
- TransferUpdated
- TransferDeleted
- AccountArchived
- CategoryArchived
