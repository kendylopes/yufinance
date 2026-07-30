# Changelog

## Sprint 5 — Categories — 2026-07-30

### Arquitetura

- implementado o módulo Categories;
- criada a tabela `categories`;
- criada migration oficial;
- implementadas permissões por Workspace;
- implementados os casos de uso:
  - Create;
  - List;
  - ListArchived;
  - Get;
  - Update;
  - Archive;
  - Restore.
- padronizadas Server Actions;
- corrigidas inconsistências arquiteturais;
- documentação reconciliada;
- db:check, check, typecheck e suíte de testes aprovados.

### Próxima etapa

Construção da interface `/dashboard/categories`.

## Sprint 4 — Financial Accounts — concluído em 2026-07-29

### Banco e domínio

- criado enum `financial_account_type`;
- criada tabela `financial_accounts`;
- `NUMERIC(19,4)` para saldo inicial;
- FK obrigatória para Workspace;
- índices por Workspace, estado de arquivamento e tipo;
- `archivedAt` adotado como soft archive.

### Casos de uso

- `CreateFinancialAccount`;
- `ListFinancialAccounts`;
- `GetFinancialAccount`;
- `UpdateFinancialAccount`;
- `ArchiveFinancialAccount`;
- `RestoreFinancialAccount`;
- `ListArchivedFinancialAccounts`.

### Permissões

- OWNER/ADMIN: leitura e gerenciamento;
- MEMBER/VIEWER: leitura;
- políticas centralizadas;
- isolamento por Workspace.

### Interface

- `/dashboard/accounts`;
- criação;
- listagem;
- edição;
- retorno à listagem após Update;
- confirmação de Archive;
- seção de contas arquivadas;
- Restore;
- consultas ativa/arquivada em paralelo.

### Validação

- criação real no Neon;
- saldo inicial persistido;
- edição validada;
- Archive validado no banco;
- Restore validado;
- preservação do registro confirmada;
- suíte consolidada em 141 testes verdes.

## Sprint 3 — Identity e Workspace — checkpoint 2026-07-27

### Identity

- cadastro com Zod + Better Auth;
- `SignUpForm` e `/register`;
- sessão real;
- `getCurrentUser()` server-side;
- testes;
- acessibilidade.

### Workspace

- schema, Membership e Settings;
- `CreateInitialWorkspace`;
- Repository;
- OWNER;
- Server Action;
- onboarding;
- `getWorkspaceEntryState()`;
- `/dashboard`;
- teste integrado no Neon.

### Arquitetura

- módulo `src/modules/workspace/`;
- `server-only` preservado;
- Server Actions como fronteira Client/Server;
- mocks com `vi.hoisted()` quando necessário.
