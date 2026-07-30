# Modelo de Domínio — Financial Accounts

## Objetivo

Descrever o modelo efetivamente implementado no Sprint 4.

**Status: IMPLEMENTADO E VALIDADO.**

## Entidade principal

```text
FinancialAccount
```

Atributos:

```text
id: UUID
workspaceId: UUID
name: string
type: FinancialAccountType
initialBalance: decimal
currency: string
archivedAt: Date | null
createdAt: Date
updatedAt: Date
```

## FinancialAccountType

```text
CHECKING
SAVINGS
DIGITAL
WALLET
CASH
```

## Relação

```text
Workspace 1 ───── N FinancialAccount
```

Uma conta nunca é global.

## Estados

O estado ativo/arquivado é derivado de `archivedAt`.

```text
archivedAt = null
→ ACTIVE

archivedAt != null
→ ARCHIVED
```

Não existe `isArchived` persistido.

## Invariantes principais

1. `workspaceId` obrigatório;
2. nome entre 2–80 caracteres;
3. tipo dentro do enum;
4. `initialBalance` persistido com precisão decimal;
5. moeda obrigatória;
6. gerenciamento somente OWNER/ADMIN;
7. acesso sempre limitado ao Workspace;
8. Archive não exclui;
9. Restore preserva o mesmo registro.

## Operações

```text
Create
ListActive
GetActive
UpdateActive
ArchiveActive
ListArchived
RestoreArchived
```

## Update

O comando comum de atualização aceita:

```text
name
type
```

Não aceita:

```text
initialBalance
currency
workspaceId
archivedAt
```

## Saldo

`initialBalance` é persistido.

`currentBalance` não é campo persistido como fonte da verdade.

Futuramente:

```text
currentBalance
=
initialBalance
+ entradas efetivadas
- saídas efetivadas
+ transferências recebidas
- transferências enviadas
```

## Fronteira de segurança

```text
CurrentUser
↓
WorkspaceMembership
↓
Role
↓
FinancialAccount.workspaceId
↓
Operação
```

Conhecer um UUID de conta não concede acesso.
