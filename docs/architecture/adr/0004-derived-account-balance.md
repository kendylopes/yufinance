---
title: Usar saldo derivado
status: accepted
date: 2026-07-15
---

# ADR-0004 — Saldo derivado do histórico

## Como usar este documento

Este documento explica uma parte específica do YuFinance em linguagem direta. Use-o para entender **o que foi decidido**, **por que essa decisão existe** e **qual é o estado atual** antes de alterar código relacionado. Quando houver diferença entre uma ideia planejada e o sistema já implementado, o texto deve marcar explicitamente **PLANEJADO**, **IMPLEMENTADO** ou **VALIDADO**.


## Contexto

Atualizar account.balance manualmente cria risco de inconsistência em edições, reversões e exclusões.

## Decisão

O saldo atual será calculado pelo histórico financeiro.

## Consequências

- Histórico como fonte da verdade.
- Menor risco de divergência.
- Consultas agregadas mais complexas.
- Possibilidade futura de snapshots ou materialized views.
