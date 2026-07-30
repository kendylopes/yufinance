---
title: Usar Next.js
status: accepted
date: 2026-07-15
---

# ADR-0001 — Usar Next.js

## Como usar este documento

Este documento explica uma parte específica do YuFinance em linguagem direta. Use-o para entender **o que foi decidido**, **por que essa decisão existe** e **qual é o estado atual** antes de alterar código relacionado. Quando houver diferença entre uma ideia planejada e o sistema já implementado, o texto deve marcar explicitamente **PLANEJADO**, **IMPLEMENTADO** ou **VALIDADO**.


## Contexto

O YuFinance precisa de frontend React, recursos server-side, autenticação, banco de dados, APIs internas e deploy simples.

## Decisão

Utilizar Next.js com React e TypeScript.

## Consequências

- Aplicação full stack em um único repositório.
- Suporte a Server Components, Server Actions e Route Handlers.
- Integração direta com Vercel.
