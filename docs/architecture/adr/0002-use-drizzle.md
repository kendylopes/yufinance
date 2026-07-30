---
title: Usar Drizzle ORM
status: accepted
date: 2026-07-15
---

# ADR-0002 — Usar Drizzle ORM

## Como usar este documento

Este documento explica uma parte específica do YuFinance em linguagem direta. Use-o para entender **o que foi decidido**, **por que essa decisão existe** e **qual é o estado atual** antes de alterar código relacionado. Quando houver diferença entre uma ideia planejada e o sistema já implementado, o texto deve marcar explicitamente **PLANEJADO**, **IMPLEMENTADO** ou **VALIDADO**.


## Contexto

O domínio financeiro exige consultas agregadas, precisão monetária, constraints e controle explícito sobre PostgreSQL.

## Decisão

Utilizar Drizzle ORM e Drizzle Kit.

## Consequências

- Schema em TypeScript.
- Migrations SQL transparentes.
- Boa proximidade com PostgreSQL.
- Consultas financeiras mais explícitas.
