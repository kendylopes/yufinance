---
title: Centralizar estado de entrada do Workspace
status: accepted
date: 2026-07-27
---

# ADR-0008 — Estado de entrada do Workspace

## Como usar este documento

Este ADR explica como o YuFinance decide entre login, onboarding e dashboard sem espalhar consultas de Membership pelas páginas.

## Contexto

As páginas protegidas precisam saber se existe sessão e se o usuário já possui Membership. Repetir consultas Drizzle em cada página aumentaria acoplamento e risco de divergência.

## Decisão

Usar `getWorkspaceEntryState()` como consulta server-side reutilizável com três estados:

- `UNAUTHENTICATED`;
- `ONBOARDING_REQUIRED`;
- `READY`.

## Consequências

- `/onboarding` e `/dashboard` usam a mesma fonte de decisão;
- páginas não consultam Drizzle diretamente;
- `READY.workspaceId` serve hoje para comprovar Membership;
- seleção explícita do Workspace atual será projetada separadamente quando múltiplos Workspaces forem suportados.
