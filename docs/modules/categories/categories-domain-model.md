# Modelo de Domínio — Categories

## Entidade
```text
Category
id: UUID
workspaceId: UUID
name: string
type: INCOME | EXPENSE
archivedAt: Date | null
createdAt: Date
updatedAt: Date
```

## Relação
```text
Workspace 1 ─── N Category
```

Futuramente Transaction referenciará Category, mas esse contrato será definido na Sprint de Transactions.

## Estados
```text
archivedAt = null  → ACTIVE
archivedAt != null → ARCHIVED
```

## Ciclo
```text
Create → ACTIVE → Rename
                → Archive → ARCHIVED → Restore → ACTIVE
```

## Invariantes
Workspace obrigatório; Membership; nome normalizado 2–60; tipo válido e imutável; unicidade Workspace+Type+Name; OWNER/ADMIN gerenciam; MEMBER/VIEWER leem; Archive/Restore preservam o registro; UUID sozinho nunca autoriza acesso.

## Não é responsabilidade de Category
Saldo, valor monetário, FinancialAccount, Budget ou Transaction.
