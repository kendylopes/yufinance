---
title: Usar Drizzle ORM
status: accepted
date: 2026-07-15
---

# ADR-0002 — Usar Drizzle ORM

## Contexto

O domínio financeiro exige consultas agregadas, precisão monetária, constraints e controle explícito sobre PostgreSQL.

## Decisão

Utilizar Drizzle ORM e Drizzle Kit.

## Consequências

- Schema em TypeScript.
- Migrations SQL transparentes.
- Boa proximidade com PostgreSQL.
- Consultas financeiras mais explícitas.
