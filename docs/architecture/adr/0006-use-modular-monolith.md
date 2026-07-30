---
title: Usar monólito modular
status: accepted
date: 2026-07-16
---

# ADR-0006 — Usar Monólito Modular

## Como usar este documento

Este documento explica uma parte específica do YuFinance em linguagem direta. Use-o para entender **o que foi decidido**, **por que essa decisão existe** e **qual é o estado atual** antes de alterar código relacionado. Quando houver diferença entre uma ideia planejada e o sistema já implementado, o texto deve marcar explicitamente **PLANEJADO**, **IMPLEMENTADO** ou **VALIDADO**.


## Contexto

O YuFinance precisa crescer com organização, mas ainda não possui necessidade comprovada de microsserviços.

## Decisão

Utilizar um monólito modular full stack dentro do projeto Next.js.

Cada domínio será isolado em um módulo com camadas próprias.

## Consequências positivas

- deploy simples;
- transações locais;
- menor custo operacional;
- desenvolvimento rápido;
- separação por domínio;
- evolução futura controlada.

## Consequências negativas

- exige disciplina para evitar acoplamento;
- todos os módulos compartilham o mesmo processo;
- uma falha grave pode afetar toda a aplicação.

## Critério de revisão

A decisão será revista se um módulo exigir escala, equipe, ciclo de deploy ou isolamento operacional independente.
