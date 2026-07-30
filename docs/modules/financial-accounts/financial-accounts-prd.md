# PRD — Financial Accounts

## Sobre este documento

Este PRD registra o escopo do módulo **Financial Accounts** e, após o fechamento do Sprint 4, também registra o que foi efetivamente entregue.

**Status: IMPLEMENTADO E VALIDADO no escopo atual do MVP.**

## 1. Conceito

`FinancialAccount` significa **Conta Financeira**: um local onde existe dinheiro ou onde futuras movimentações serão registradas.

O nome evita conflito com `account`, tabela usada pelo Better Auth para autenticação.

Exemplos:

- conta corrente;
- poupança;
- conta digital;
- carteira;
- dinheiro em espécie.

## 2. Objetivo

Permitir que cada Workspace mantenha suas próprias contas financeiras, que futuramente serão origem/destino de Transactions e Transfers.

```text
Workspace
→ FinancialAccount
→ Transactions
```

## 3. Propriedade

Toda Financial Account pertence obrigatoriamente a um único Workspace.

Nenhuma operação confia somente em `financialAccountId`: o acesso também é limitado por `workspaceId`, Membership e Role.

## 4. Campos implementados

```text
id
workspaceId
name
type
initialBalance
currency
archivedAt
createdAt
updatedAt
```

## 5. Tipos implementados

- `CHECKING` — Conta corrente;
- `SAVINGS` — Poupança;
- `DIGITAL` — Conta digital;
- `WALLET` — Carteira;
- `CASH` — Dinheiro em espécie.

## 6. Nome

O nome:

- é obrigatório;
- é normalizado com trim;
- possui 2–80 caracteres;
- pode ser duplicado dentro do mesmo Workspace.

## 7. Saldo inicial

`initialBalance` representa quanto já existia na conta no momento do cadastro.

Ele não representa receita.

Persistência:

```text
NUMERIC(19,4)
```

No fluxo atual, o saldo inicial deve ser maior ou igual a zero.

O saldo atual completo será derivado quando Transactions/Transfers existirem.

## 8. Moeda

A conta herda a moeda do Workspace no momento da criação.

No estado atual, o fluxo trabalha com BRL como padrão do Workspace.

`currency` não é editável pelo formulário comum de atualização.

## 9. Edição

A edição comum permite apenas:

```text
name
type
```

Não são alterados pelo formulário:

```text
initialBalance
currency
workspaceId
archivedAt
```

## 10. Arquivamento

O módulo usa soft archive:

```text
ativa      → archivedAt = NULL
arquivada  → archivedAt = timestamp
```

Arquivar não exclui o registro.

A conta arquivada é removida da listagem ativa e exibida em seção separada.

## 11. Restauração

Uma conta arquivada pode ser restaurada:

```text
archivedAt = NULL
```

O mesmo registro é preservado.

## 12. Permissões

| Operação | OWNER | ADMIN | MEMBER | VIEWER |
| --- | :---: | :---: | :---: | :---: |
| Ler | ✅ | ✅ | ✅ | ✅ |
| Criar | ✅ | ✅ | ❌ | ❌ |
| Editar | ✅ | ✅ | ❌ | ❌ |
| Arquivar | ✅ | ✅ | ❌ | ❌ |
| Restaurar | ✅ | ✅ | ❌ | ❌ |

## 13. Casos de uso entregues

- `CreateFinancialAccount`;
- `ListFinancialAccounts`;
- `GetFinancialAccount`;
- `UpdateFinancialAccount`;
- `ArchiveFinancialAccount`;
- `RestoreFinancialAccount`;
- `ListArchivedFinancialAccounts`.

## 14. Interface entregue

Rota principal:

```text
/dashboard/accounts
```

A página apresenta:

- contas ativas;
- saldo inicial;
- edição;
- arquivamento;
- formulário de criação;
- contas arquivadas;
- data de arquivamento;
- restauração.

A edição usa rota dedicada por `financialAccountId`.

## 15. Critérios de aceitação

- [x] uma Financial Account pode ser criada;
- [x] pertence obrigatoriamente a um Workspace;
- [x] usuários sem Membership não acessam a conta;
- [x] nome é validado;
- [x] tipo é validado;
- [x] saldo inicial pode ser informado;
- [x] moeda do Workspace é aplicada;
- [x] contas ativas podem ser listadas;
- [x] uma conta pode ser obtida por ID dentro do Workspace;
- [x] uma conta pode ser editada nos campos permitidos;
- [x] uma conta pode ser arquivada;
- [x] contas arquivadas podem ser listadas;
- [x] uma conta arquivada pode ser restaurada;
- [x] dados são preservados no soft archive;
- [x] autorização por Role está centralizada;
- [x] testes automatizados cobrem os comportamentos principais;
- [x] fluxo real foi validado no Neon.

## 16. Fora do escopo atual

- Open Finance;
- sincronização bancária;
- OFX;
- reconciliação;
- múltiplas moedas completas;
- investimentos;
- cartões de crédito como domínio próprio;
- exclusão física comum;
- saldo atual baseado em Transactions;
- instituições financeiras externas.

## 17. Dependência futura

Financial Accounts está pronto para servir de base a:

```text
Categories
→ Transactions
→ Transfers
→ Balance
→ Dashboard
```
