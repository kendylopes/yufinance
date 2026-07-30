---
title: Usar Biome
status: accepted
date: 2026-07-15
---

# ADR-0005 — Usar Biome

## Como usar este documento

Este documento explica uma parte específica do YuFinance em linguagem direta. Use-o para entender **o que foi decidido**, **por que essa decisão existe** e **qual é o estado atual** antes de alterar código relacionado. Quando houver diferença entre uma ideia planejada e o sistema já implementado, o texto deve marcar explicitamente **PLANEJADO**, **IMPLEMENTADO** ou **VALIDADO**.


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
