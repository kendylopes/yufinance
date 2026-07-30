# Regras de Negócio — Financial Accounts

## Sobre este documento

Regras oficiais do módulo Financial Accounts.

**Status: IMPLEMENTADO E VALIDADO no escopo atual do Sprint 4.**

## Propriedade e isolamento

### FA-RN-001 — Workspace obrigatório

Toda Financial Account possui `workspaceId`.

### FA-RN-002 — Um único Workspace

Uma Financial Account pertence a somente um Workspace.

### FA-RN-003 — Workspace existente

A FK deve impedir referência a Workspace inexistente.

### FA-RN-004 — Membership obrigatório

O usuário precisa possuir Membership no Workspace.

### FA-RN-005 — Isolamento por Workspace

Nenhuma operação confia apenas em `financialAccountId`.

Consultas e mutações relevantes restringem também por `workspaceId`.

## Permissões

### FA-RN-006 — Leitura

Podem ler contas:

- OWNER;
- ADMIN;
- MEMBER;
- VIEWER.

### FA-RN-007 — Gerenciamento

Podem criar, editar, arquivar e restaurar:

- OWNER;
- ADMIN.

MEMBER e VIEWER não gerenciam contas.

As políticas são centralizadas em helpers de domínio.

## Nome

### FA-RN-008 — Nome obrigatório

O nome é obrigatório.

### FA-RN-009 — Normalização

Espaços externos são removidos.

### FA-RN-010 — Tamanho

O nome possui entre 2 e 80 caracteres após normalização.

### FA-RN-011 — Duplicidade permitida

Nomes iguais são permitidos dentro do mesmo Workspace.

## Tipo

### FA-RN-012 — Tipos válidos

Somente:

- CHECKING;
- SAVINGS;
- DIGITAL;
- WALLET;
- CASH.

## Saldo inicial

### FA-RN-013 — Precisão

`initialBalance` usa `NUMERIC(19,4)` no PostgreSQL.

### FA-RN-014 — Ponto de partida

O saldo inicial representa o valor existente no cadastro e não cria receita.

### FA-RN-015 — Valor atual do MVP

O saldo inicial aceito pelo fluxo atual é maior ou igual a zero.

### FA-RN-016 — Não editar pelo Update comum

`UpdateFinancialAccount` não altera `initialBalance`.

## Moeda

### FA-RN-017 — Moeda do Workspace

Na criação, a moeda é obtida do Workspace.

### FA-RN-018 — Não editar pelo Update comum

`currency` não é alterada pelo formulário de edição.

## Atualização

### FA-RN-019 — Campos editáveis

A edição comum permite somente:

- `name`;
- `type`.

Não permite alterar:

- `workspaceId`;
- `initialBalance`;
- `currency`;
- `archivedAt`.

## Arquivamento

### FA-RN-020 — Soft archive

Arquivar define `archivedAt` com timestamp.

### FA-RN-021 — Sem exclusão física comum

Arquivamento preserva o registro.

### FA-RN-022 — Apenas conta ativa pode ser arquivada

O repository restringe o Archive a:

```text
workspaceId correto
AND id correto
AND archivedAt IS NULL
```

### FA-RN-023 — Listagem ativa

Contas ativas são consultadas com `archivedAt IS NULL`.

## Restauração

### FA-RN-024 — Restaurar conta arquivada

Restore define:

```text
archivedAt = NULL
```

### FA-RN-025 — Apenas conta arquivada pode ser restaurada

O repository restringe Restore a:

```text
workspaceId correto
AND id correto
AND archivedAt IS NOT NULL
```

### FA-RN-026 — Listagem arquivada

Contas arquivadas são consultadas separadamente com `archivedAt IS NOT NULL`.

## Histórico

### FA-RN-027 — Preservação

Archive/Restore preservam:

- `id`;
- `workspaceId`;
- `name`;
- `type`;
- `initialBalance`;
- `currency`;
- `createdAt`.

`updatedAt` muda quando o estado é alterado.

## Saldo atual futuro

### FA-RN-028 — Saldo derivado

Quando Transactions/Transfers forem implementados, saldo atual será derivado do histórico. O campo `initialBalance` permanece apenas como ponto de partida.

## Validação

Estas regras foram cobertas por testes automatizados e por validação funcional real no navegador/Neon durante o Sprint 4.
