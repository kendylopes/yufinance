---
title: Modelo de Domínio YuFinance
version: 1.1
status: approved
updated_at: 2026-07-27
---

# Modelo de Domínio

## Como usar este documento

Este documento explica uma parte específica do YuFinance em linguagem direta. Use-o para entender **o que foi decidido**, **por que essa decisão existe** e **qual é o estado atual** antes de alterar código relacionado. Quando houver diferença entre uma ideia planejada e o sistema já implementado, o texto deve marcar explicitamente **PLANEJADO**, **IMPLEMENTADO** ou **VALIDADO**.


## Estado do modelo

**Implementado:** User, Workspace, WorkspaceMember e WorkspaceSettings.

**Planejado:** Account, Category, Transaction e Transfer.

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
