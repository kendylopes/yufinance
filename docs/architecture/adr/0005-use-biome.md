---
title: Usar Biome para qualidade de código
status: accepted
date: 2026-07-14
---

# ADR-0005 — Usar Biome

## Contexto

O YuFinance precisa de uma ferramenta única para:

- lint;
- formatação;
- organização de imports;
- correções automáticas;
- integração com CI e editor.

## Decisão

Utilizar o Biome como ferramenta oficial de lint e formatação.

Não utilizar ESLint ou Prettier no projeto inicial.

## Consequências positivas

- configuração centralizada;
- execução rápida;
- menos dependências;
- menos conflitos entre formatter e linter;
- integração oficial com VS Code.

## Consequências negativas

- algumas regras específicas do ecossistema ESLint podem não existir;
- regras muito especializadas poderão exigir validações adicionais;
- a equipe precisa utilizar a extensão oficial do Biome.