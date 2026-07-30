---
title: Regras Financeiras YuFinance
version: 1.0
status: approved
updated_at: 2026-07-27
---

# Regras Financeiras

## Como usar este documento

Este documento explica uma parte específica do YuFinance em linguagem direta. Use-o para entender **o que foi decidido**, **por que essa decisão existe** e **qual é o estado atual** antes de alterar código relacionado. Quando houver diferença entre uma ideia planejada e o sistema já implementado, o texto deve marcar explicitamente **PLANEJADO**, **IMPLEMENTADO** ou **VALIDADO**.


## FR-001 — Precisão monetária

Valores financeiros serão armazenados como NUMERIC(19,4).

Não utilizar FLOAT, REAL ou DOUBLE PRECISION para dinheiro.

## FR-002 — Valor positivo

O campo amount deverá ser sempre maior que zero.

O tipo da transação determina se o valor representa entrada ou saída.

## FR-003 — Saldo inicial

O saldo inicial será armazenado na conta financeira e representará a posição da conta no momento do cadastro.

## FR-004 — Saldo atual

Saldo atual:

```text
saldo inicial
+ receitas pagas
- despesas pagas
+ transferências recebidas
- transferências enviadas
```

## FR-005 — Saldo previsto

Saldo previsto:

```text
saldo atual
+ receitas pendentes
- despesas pendentes
```

## FR-006 — Receita pendente

Receita pendente não aumenta o saldo atual.

## FR-007 — Receita paga

Receita paga aumenta o saldo atual.

## FR-008 — Despesa pendente

Despesa pendente não reduz o saldo atual.

## FR-009 — Despesa paga

Despesa paga reduz o saldo atual.

## FR-010 — Transferências

Transferências afetam somente as contas envolvidas.

## FR-011 — Edição de transação paga

Alterar valor, conta ou tipo de uma transação paga deverá refletir imediatamente no saldo derivado.

## FR-012 — Datas financeiras

- transactionDate: data de ocorrência ou competência;
- dueDate: vencimento;
- paidAt: momento de efetivação.

transactionDate e dueDate serão DATE.

paidAt será TIMESTAMPTZ.

## FR-013 — Fonte da verdade

O saldo não será armazenado como fonte primária.

O histórico financeiro será a fonte da verdade.
