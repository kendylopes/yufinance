---
title: Usar Server Actions como fronteira Client/Server
status: accepted
date: 2026-07-27
---

# ADR-0007 — Server Actions e fronteira Client/Server

## Como usar este documento

Este ADR registra por que Client Components não importam diretamente lógica server-only. Consulte-o ao criar formulários ou mutações disparadas pelo navegador.

## Contexto

Durante o onboarding, um Client Component importou um caso de uso que dependia de `getCurrentUser()`, `next/headers` e `server-only`. O Next.js corretamente bloqueou essa cadeia no bundle do navegador.

## Decisão

Client Components chamarão uma Server Action dedicada (`"use server"`) para mutações que dependam de autenticação server-side, banco ou segredos.

## Consequências

- `next/headers` permanece exclusivamente no servidor;
- casos de uso server-only não entram no bundle cliente;
- formulários possuem uma fronteira explícita de mutação;
- testes de Client Components mockam a Server Action, não sua implementação real;
- não remover `server-only` para contornar testes.
