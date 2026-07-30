---
title: Regras de Negócio YuFinance
version: 1.2
status: approved
updated_at: 2026-07-29
---

# Regras de Negócio

## Como usar este documento

Regras transversais do YuFinance. Regras específicas de um módulo permanecem nos documentos do próprio módulo.

## BR-001 — Isolamento por Workspace

Todo dado financeiro pertence a um Workspace.

Nenhuma operação confia somente no ID do recurso.

## BR-002 — Workspace inicial

Cadastro cria identidade/sessão. O Workspace inicial é criado no onboarding.

Fluxo validado:

```text
User
→ Session
→ ONBOARDING_REQUIRED
→ CreateInitialWorkspace
→ Membership OWNER
→ WorkspaceSettings
→ READY
```

## BR-003 — Financial Accounts

**IMPLEMENTADO.**

Tipos oficiais:

- CHECKING;
- SAVINGS;
- DIGITAL;
- WALLET;
- CASH.

Financial Accounts pertencem a um Workspace e usam `NUMERIC(19,4)` para saldo inicial.

## BR-004 — Arquivamento de contas

**IMPLEMENTADO.**

Contas usam `archivedAt`, não exclusão física comum.

```text
ativa      → archivedAt = NULL
arquivada  → archivedAt = timestamp
```

Contas arquivadas podem ser restauradas.

## BR-005 — Permissões de contas

Leitura:

- OWNER;
- ADMIN;
- MEMBER;
- VIEWER.

Gerenciamento:

- OWNER;
- ADMIN.

## BR-006 — Categorias

**PLANEJADO — próximo domínio.**

Categorias serão classificadas como:

- INCOME;
- EXPENSE.

## BR-007 — Arquivamento de categorias

**PLANEJADO.**

Categorias utilizadas deverão preferir arquivamento a exclusão destrutiva.

## BR-008 — Transactions

**PLANEJADO.**

Tipos:

- INCOME;
- EXPENSE.

Status previstos:

- PENDING;
- PAID;
- CANCELED.

OVERDUE será derivado.

## BR-009 — Pagamento

**PLANEJADO.**

Transação paga deverá preencher `paidAt` e passar a afetar saldo atual.

## BR-010 — Cancelamento

**PLANEJADO.**

Transação cancelada permanece no histórico e não afeta saldos.

## BR-011 — Transferência

**PLANEJADO.**

Transferência:

- move valor entre contas;
- não é receita;
- não é despesa;
- não usa categoria;
- exige contas distintas do mesmo Workspace.

## BR-012 — Saldo negativo

A regra global permanece prevista como permitida para saldo derivado futuro. O `initialBalance` do fluxo atual de criação é validado como maior ou igual a zero.

## BR-013 — Categoria obrigatória

**PLANEJADO.**

Receitas e despesas deverão possuir categoria.
