# Guia de Implementação — Categories

## Estrutura prevista
```text
src/modules/categories/
├── application/
├── domain/
├── infrastructure/
└── presentation/
```

Casos de uso: Create, List, ListArchived, Get, Update, Archive e Restore.

## Ordem
1. enum/schema Drizzle
2. migration
3. db:check
4. Repository
5. `canReadCategories` / `canManageCategories`
6. schemas Zod
7. casos de uso
8. Server Actions
9. UI
10. testes
11. Neon
12. reconciliação documental

## Fronteira Client/Server
`server-only`, `next/headers`, sessão e banco permanecem no servidor. Client Components chamam Server Actions.

## Testes
Cobrir schemas, matriz das quatro Roles, não autenticado, sem Membership, cross-workspace, duplicidade, estados Archive/Restore, falhas seguras, formulários e navegação.

Preservar `server-only` em produção; em Vitest usar mock quando necessário.

## Qualidade
```text
npm run check:fix
npm run check
npm run typecheck
npm run test
npm run build
```

## Validação Neon
Confirmar Workspace, enum, unicidade, Archive, Restore, mesmo ID, type imutável e isolamento.

## Definition of Done
Schema/migration + Repository + permissions + 7 casos de uso + Server Actions + UI + testes + build + Neon + docs + memória.
