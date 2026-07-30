# Casos de Uso — Financial Accounts

## Estado

Todos os casos de uso previstos para o Sprint 4 foram implementados e validados.

## CreateFinancialAccount

Entrada:

```text
workspaceId
name
type
initialBalance?
```

Fluxo:

1. resolve usuário atual;
2. valida Membership;
3. exige OWNER/ADMIN;
4. valida entrada;
5. obtém moeda do Workspace;
6. persiste FinancialAccount;
7. retorna registro criado.

## ListFinancialAccounts

Entrada:

```text
workspaceId
```

Fluxo:

1. autentica;
2. valida Membership;
3. permite OWNER/ADMIN/MEMBER/VIEWER;
4. retorna somente `archivedAt IS NULL`.

## GetFinancialAccount

Entrada:

```text
workspaceId
financialAccountId
```

Retorna somente conta ativa pertencente ao Workspace autorizado.

## UpdateFinancialAccount

Entrada:

```text
workspaceId
financialAccountId
data:
  name
  type
```

Fluxo:

1. autentica;
2. valida Membership;
3. exige OWNER/ADMIN;
4. valida `name/type`;
5. atualiza somente conta ativa do Workspace;
6. preserva saldo inicial, moeda, Workspace e estado de arquivamento.

Na UI, após sucesso:

```text
router.replace("/dashboard/accounts")
router.refresh()
```

A Server Action revalida `/dashboard/accounts`.

## ArchiveFinancialAccount

Entrada:

```text
workspaceId
financialAccountId
```

Exige OWNER/ADMIN.

Persistência:

```text
archivedAt = now()
updatedAt = now()
```

Somente conta ativa do Workspace pode ser arquivada.

## ListArchivedFinancialAccounts

Entrada:

```text
workspaceId
```

Permite OWNER/ADMIN/MEMBER/VIEWER.

Retorna somente:

```text
archivedAt IS NOT NULL
```

## RestoreFinancialAccount

Entrada:

```text
workspaceId
financialAccountId
```

Exige OWNER/ADMIN.

Persistência:

```text
archivedAt = null
updatedAt = now()
```

Somente conta arquivada do Workspace pode ser restaurada.

## Composição da página

`/dashboard/accounts` consulta contas ativas e arquivadas em paralelo:

```text
Promise.all([
  listFinancialAccounts(workspaceId),
  listArchivedFinancialAccounts(workspaceId)
])
```

## Casos negativos cobertos

- usuário não autenticado;
- ausência de Membership;
- Role insuficiente;
- conta inexistente;
- conta fora do estado exigido;
- falha de infraestrutura;
- tentativa de acessar outro Workspace.

## Fronteira Client/Server

Formulários e botões Client chamam Server Actions.

Client Components não importam diretamente casos de uso que dependem de `server-only`, `next/headers`, banco ou sessão server-side.
