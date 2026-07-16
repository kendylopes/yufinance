---
title: Usar Biome
status: accepted
date: 2026-07-15
---

# ADR-0005 — Usar Biome

## Contexto

O projeto precisa de lint, formatação e organização de imports.

## Decisão

Utilizar Biome como ferramenta oficial.

Não utilizar ESLint ou Prettier inicialmente.

## Consequências positivas

- Configuração centralizada.
- Execução rápida.
- Menos dependências.
- Integração com VS Code.

## Consequências negativas

- Algumas regras específicas do ecossistema ESLint podem não existir.
