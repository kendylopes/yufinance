---
title: Usar monólito modular
status: accepted
date: 2026-07-16
---

# ADR-0006 — Usar Monólito Modular

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
