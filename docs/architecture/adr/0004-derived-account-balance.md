---
title: Usar saldo derivado
status: accepted
date: 2026-07-15
---

# ADR-0004 — Saldo derivado do histórico

## Contexto

Atualizar account.balance manualmente cria risco de inconsistência em edições, reversões e exclusões.

## Decisão

O saldo atual será calculado pelo histórico financeiro.

## Consequências

- Histórico como fonte da verdade.
- Menor risco de divergência.
- Consultas agregadas mais complexas.
- Possibilidade futura de snapshots ou materialized views.
