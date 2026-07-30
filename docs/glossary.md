# Glossário do YuFinance

## Como usar este documento

Os identificadores permanecem em inglês no código; este documento registra seu significado no domínio.

## Identity

**Identity — Identidade:** cadastro, autenticação e identificação do usuário.

**Session — Sessão:** estado autenticado temporário.

**Better Auth:** biblioteca de autenticação.

**getCurrentUser:** resolve server-side o usuário da sessão.

**Account (Better Auth):** credencial/conta de autenticação. Não representa conta financeira.

## Workspace

**Workspace — Espaço financeiro:** fronteira de isolamento dos dados.

**Membership — Vínculo:** relação entre User e Workspace.

**Role — Papel:** nível de autorização dentro do Workspace.

**OWNER:** pode administrar o Workspace e Financial Accounts no escopo atual.

**ADMIN:** pode gerenciar Financial Accounts.

**MEMBER:** leitura de Financial Accounts no escopo atual.

**VIEWER:** leitura de Financial Accounts no escopo atual.

**WorkspaceSettings:** configurações do Workspace.

**workspaceId:** UUID que identifica a qual Workspace um recurso pertence.

**Entry State:** estado usado para decidir entrada:

- `UNAUTHENTICATED`;
- `ONBOARDING_REQUIRED`;
- `READY`.

## Arquitetura

**Repository — Repositório:** encapsula persistência e conhece Drizzle/PostgreSQL.

**Server Action — Ação de servidor:** fronteira `"use server"` usada por interfaces cliente para mutações server-side.

**Server Component:** componente executado no servidor, útil para composição e leitura protegida.

**Application / Use Case:** camada que coordena autenticação, autorização, validação e persistência.

**Domain Policy:** regra centralizada de permissão ou negócio.

## Financial Accounts

**FinancialAccount — Conta Financeira:** local onde existe dinheiro ou onde futuras movimentações serão registradas.

**FinancialAccountType:** enum com `CHECKING`, `SAVINGS`, `DIGITAL`, `WALLET`, `CASH`.

**initialBalance — Saldo inicial:** valor existente na conta no momento do cadastro.

**archivedAt — Data de arquivamento:** `NULL` quando ativa; timestamp quando arquivada.

**Soft archive — Arquivamento lógico:** preserva o registro em vez de excluí-lo.

**Restore — Restaurar:** remove o estado de arquivamento definindo `archivedAt = NULL`.

## Finanças futuras

**Category — Categoria:** classificação futura de receita ou despesa.

**Transaction — Transação:** futura receita ou despesa.

**Transfer — Transferência:** movimentação futura entre contas do mesmo Workspace.

**Saldo atual:** valor derivado do saldo inicial e movimentações efetivadas.

**Saldo previsto:** saldo atual considerando também movimentações pendentes.
