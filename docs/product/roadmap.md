---
title: Roadmap YuFinance
version: 1.3
status: active
updated_at: 2026-07-29
---

# Roadmap do YuFinance

## Como usar este documento

Este documento registra a ordem de evolução do produto. PRDs e regras de negócio continuam sendo a fonte detalhada de cada domínio.

## Fase 0 — Fundação — CONCLUÍDA

- Next.js + TypeScript + Tailwind CSS v4;
- Biome;
- Drizzle ORM / Drizzle Kit;
- Neon PostgreSQL;
- documentação;
- migrations;
- scripts de banco.

## Fase 1A — Identity — CONCLUÍDA no escopo atual

- cadastro;
- sessão;
- Better Auth;
- `RegisterUser`;
- `/register`;
- testes;
- integração real.

Recuperação de senha e verificação de e-mail permanecem para iteração futura.

## Fase 1B — Workspace / Onboarding — CONCLUÍDA

- Workspace;
- Membership;
- Roles;
- WorkspaceSettings;
- onboarding;
- `getWorkspaceEntryState`;
- Server Actions;
- `/dashboard`;
- integração real com Neon.

## Sprint 4 — Financial Accounts — CONCLUÍDA

Implementado:

1. modelo e migration;
2. Create;
3. List;
4. Get;
5. Update;
6. Archive;
7. Restore;
8. listagem de arquivadas;
9. autorização por Workspace/Role;
10. interface integrada;
11. testes;
12. validação funcional no Neon.

O domínio utiliza `archivedAt` para soft archive e `NUMERIC(19,4)` para valores monetários.

## Próxima etapa — Categorias

Categorias serão implementadas antes de receitas/despesas para fornecer classificação consistente às futuras transações.

Sequência recomendada:

1. revisar PRD e regras de Categorias;
2. definir modelo de domínio;
3. definir categorias padrão;
4. modelar schema/migration;
5. Create/List/Get/Update/Archive/Restore conforme escopo aprovado;
6. autorização por Workspace;
7. testes;
8. UI;
9. validação;
10. atualização documental.

## Fase 2 — Categories — EM ANDAMENTO

### Backend

- ✅ Banco
- ✅ Repository
- ✅ Casos de uso
- ✅ Permissões
- ✅ Testes

### Frontend

- ⏳ Interface
- ⏳ Integração
- ⏳ Validação final

## Etapas seguintes

- Receitas e Despesas / Transactions;
- Transferências;
- saldo atual derivado;
- saldo previsto;
- Dashboard financeiro;
- busca e filtros;
- refinamento de Design System;
- E2E/CI;
- segurança e observabilidade;
- deploy;
- pós-MVP: cartões, recorrências, orçamentos, metas e extensões.
