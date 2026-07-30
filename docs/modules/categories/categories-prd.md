# PRD — Categories

## Introdução
Categories organiza a classificação das futuras receitas e despesas do YuFinance.

## Objetivo
Permitir que cada Workspace mantenha categorias próprias, isoladas e reutilizáveis por futuras Transactions.

## Entidade
```text
Category
id
workspaceId
name
type
archivedAt
createdAt
updatedAt
```

## Tipos
```text
INCOME
EXPENSE
```

## Escopo
- CreateCategory
- ListCategories
- ListArchivedCategories
- GetCategory
- UpdateCategory
- ArchiveCategory
- RestoreCategory
- autorização, UI, testes e validação no Neon

## Nome
Obrigatório, `trim`, 2–60 caracteres. Não permitir duplicidade lógica de `workspaceId + type + name`. O mesmo nome pode existir em tipos diferentes.

## Update
Altera somente `name`. `type` é imutável após criação para preservar semântica histórica.

## Arquivamento
`archivedAt = NULL` significa ativa; timestamp significa arquivada. Não criar `isArchived`. Categoria arquivada permanece para histórico e poderá ser restaurada.

## Permissões
| Operação | OWNER | ADMIN | MEMBER | VIEWER |
| --- | :---: | :---: | :---: | :---: |
| List/Get | ✅ | ✅ | ✅ | ✅ |
| Create/Update/Archive/Restore | ✅ | ✅ | ❌ | ❌ |

## Categorias padrão
Serão registros normais pertencentes ao Workspace, nunca globais. O seed no onboarding será tratado somente depois de Categories estar implementado e validado.

Sugestões futuras: EXPENSE — Alimentação, Moradia, Transporte, Saúde, Educação, Lazer, Assinaturas, Outros. INCOME — Salário, Freelance, Rendimentos, Outros.

## Fora do escopo
Subcategorias, ícones, cores, emojis, favoritos, ordenação manual, budgets, valores monetários, `financialAccountId`, exclusão física, Transactions e seed no onboarding.

## Critérios de aceitação
- [ ] Workspace obrigatório e isolamento garantido
- [ ] nome/type validados
- [ ] duplicidade impedida
- [ ] List ativa e ListArchived separadas
- [ ] Update altera somente name
- [ ] Archive/Restore preservam registro
- [ ] permissões por Role
- [ ] testes, build e validação Neon
- [ ] documentação reconciliada
