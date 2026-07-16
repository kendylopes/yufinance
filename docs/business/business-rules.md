---
title: Regras de Negócio YuFinance
version: 1.0
status: approved
updated_at: 2026-07-15
---

# Regras de Negócio

## BR-001 — Isolamento por workspace

Todo dado financeiro deve pertencer a um workspace.

Nenhuma operação poderá confiar somente no ID do recurso. A autorização deverá validar o workspace do usuário autenticado.

## BR-002 — Workspace pessoal

Ao cadastrar um usuário, o sistema deve criar:

1. usuário;
2. workspace pessoal;
3. membership com papel OWNER;
4. configurações padrão;
5. categorias padrão.

## BR-003 — Contas financeiras

Uma conta representa onde o dinheiro está armazenado.

Tipos:

- CHECKING
- SAVINGS
- CASH
- DIGITAL_WALLET
- INVESTMENT
- OTHER

## BR-004 — Arquivamento de contas

Contas com histórico não devem ser excluídas fisicamente. Devem ser arquivadas.

Contas arquivadas:

- permanecem no histórico;
- permanecem em relatórios;
- não recebem novas transações.

## BR-005 — Categorias

Categorias são classificadas como:

- INCOME
- EXPENSE

Uma categoria de receita não pode ser usada em despesa, e vice-versa.

## BR-006 — Arquivamento de categorias

Categorias utilizadas devem ser arquivadas, não excluídas.

## BR-007 — Transações

Tipos permitidos:

- INCOME
- EXPENSE

Status persistidos:

- PENDING
- PAID
- CANCELED

OVERDUE será derivado.

## BR-008 — Status atrasado

Uma transação será exibida como atrasada quando:

- status persistido for PENDING;
- dueDate for anterior à data local do workspace.

## BR-009 — Pagamento

Ao marcar uma transação como paga:

- status passa para PAID;
- paidAt deve ser preenchido;
- a transação passa a afetar o saldo atual.

## BR-010 — Reversão

Ao reverter um pagamento:

- status volta para PENDING;
- paidAt é removido;
- o efeito no saldo atual deixa de existir.

## BR-011 — Cancelamento

Uma transação cancelada:

- permanece no histórico;
- não afeta saldo atual;
- não afeta saldo previsto;
- não entra nos indicadores principais.

## BR-012 — Transferência

Transferência é uma entidade independente.

Ela:

- move valor entre contas;
- não é receita;
- não é despesa;
- não usa categoria;
- não afeta relatórios de receitas e despesas.

## BR-013 — Transferência entre contas

As contas de origem e destino:

- devem ser diferentes;
- devem pertencer ao mesmo workspace;
- devem estar ativas ao criar a transferência.

## BR-014 — Saldo negativo

Saldo negativo será permitido.

## BR-015 — Categoria obrigatória

Toda receita ou despesa deverá possuir categoria.

Cada workspace terá as categorias padrão:

- Outros — Receita
- Outros — Despesa
