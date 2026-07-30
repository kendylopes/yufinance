# Modelo de Banco — Categories

**Status: IMPLEMENTADO**

## Enum
`category_type`: `INCOME`, `EXPENSE`.

## Tabela `categories`
| Coluna | Tipo | Regra |
| --- | --- | --- |
| id | UUID | PK, `gen_random_uuid()` |
| workspace_id | UUID | NOT NULL, FK → workspaces.id, ON DELETE CASCADE |
| name | VARCHAR(60) | NOT NULL |
| type | category_type | NOT NULL |
| archived_at | TIMESTAMPTZ | NULL |
| created_at | TIMESTAMPTZ | NOT NULL, now() |
| updated_at | TIMESTAMPTZ | NOT NULL, now() |

## Índices propostos
- `(workspace_id)`
- `(workspace_id, archived_at)`
- `(workspace_id, type)`

## Unicidade
O banco deve proteger `workspace_id + type + nome normalizado` contra concorrência. Antes da migration, definir explicitamente a estratégia de comparação de caixa/normalização; não assumir silenciosamente que `UNIQUE(workspace_id,type,name)` resolve a semântica desejada.

## Soft archive
Ativa: `archived_at IS NULL`. Arquivada: `archived_at IS NOT NULL`. Não criar `is_archived`.

## Update
Altera apenas `name` e `updated_at`.

## Archive/Restore
Archive: timestamp em `archived_at`; Restore: NULL. Ambos filtram por `id + workspace_id` e pelo estado atual.
