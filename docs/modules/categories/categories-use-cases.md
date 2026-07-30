# Casos de Uso — Categories

Todos seguem `CurrentUser → Membership → Role → workspaceId → Repository`.

## CreateCategory
Entrada: `workspaceId`, `name`, `type`. Valida input, autenticação, Membership, OWNER/ADMIN, duplicidade e persiste.

## ListCategories
Permite todas as Roles válidas e retorna somente `archivedAt IS NULL`.

## ListArchivedCategories
Permite todas as Roles válidas e retorna somente `archivedAt IS NOT NULL`.

## GetCategory
Busca Category ativa por `workspaceId + categoryId`. Não revela recurso de outro Workspace.

## UpdateCategory
Entrada: `workspaceId`, `categoryId`, `name`. Exige OWNER/ADMIN. `type` não pertence ao schema de Update.

## ArchiveCategory
Exige OWNER/ADMIN. Define `archivedAt = now()` somente para Category ativa do Workspace.

## RestoreCategory
Exige OWNER/ADMIN. Define `archivedAt = NULL` somente para Category arquivada do Workspace.

## UI prevista
`/dashboard/categories` com ativas, criação, edição, Archive, arquivadas e Restore. Edição: `/dashboard/categories/[categoryId]/edit`.

## Erros
Nunca expor SQL, connection string, stack trace ou existência de recurso em outro Workspace.
