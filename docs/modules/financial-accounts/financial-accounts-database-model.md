# Modelo de Banco — Financial Accounts

## Status

**IMPLEMENTADO, MIGRADO E VALIDADO NO NEON.**

## Enum

```text
financial_account_type
```

Valores:

```text
CHECKING
SAVINGS
DIGITAL
WALLET
CASH
```

## Tabela

```text
financial_accounts
```

| Coluna | Tipo | Regra |
| --- | --- | --- |
| `id` | UUID | PK, `gen_random_uuid()` |
| `workspace_id` | UUID | NOT NULL, FK → `workspaces.id`, ON DELETE CASCADE |
| `name` | VARCHAR(80) | NOT NULL |
| `type` | `financial_account_type` | NOT NULL |
| `initial_balance` | NUMERIC(19,4) | NOT NULL, default 0 |
| `currency` | CHAR(3) | NOT NULL, default BRL |
| `archived_at` | TIMESTAMPTZ | NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL, default now() |
| `updated_at` | TIMESTAMPTZ | NOT NULL, default now() |

## Índices

O schema implementado possui índices para consultas por:

- `workspace_id`;
- `workspace_id + archived_at`;
- `workspace_id + type`.

## Soft archive

Ativa:

```sql
archived_at IS NULL
```

Arquivada:

```sql
archived_at IS NOT NULL
```

Não existe coluna `is_archived`.

## Precisão monetária

`initial_balance` usa:

```text
NUMERIC(19,4)
```

Não usar FLOAT/REAL/DOUBLE como fonte de verdade para dinheiro.

## Isolamento

Repositories combinam `id` e `workspace_id` em operações específicas para impedir acesso cruzado entre Workspaces.

## Validação real

Foram observados registros reais no Neon com:

- saldo inicial persistido com quatro casas decimais;
- `currency = BRL`;
- `archived_at = NULL` para conta ativa;
- timestamp em `archived_at` após Archive;
- retorno a `NULL` após Restore;
- preservação do mesmo registro.
