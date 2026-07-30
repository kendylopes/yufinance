# YuFinance

Aplicação web de gestão financeira pessoal e compartilhada, construída com foco em organização por **Workspace**, isolamento de dados, regras de negócio explícitas, segurança server-side e evolução incremental por domínios.

> **Status:** em desenvolvimento  
> **Último marco:** Sprint 4 — Financial Accounts concluída

---

## Sobre o projeto

O **YuFinance** tem como objetivo centralizar a gestão financeira de uma pessoa, casal ou família em um ambiente organizado por Workspaces.

Cada Workspace funciona como uma fronteira independente para os dados financeiros.

```text
User
  ↓
Workspace
  ↓
Financial Accounts
  ↓
Transactions
  ↓
Budgets / Reports / Goals
```

A aplicação está sendo desenvolvida seguindo uma abordagem **documentation-first**:

```text
Análise
↓
Documentação
↓
Modelagem
↓
Implementação
↓
Testes
↓
Validação
↓
Atualização da documentação
```

---

# Estado atual

A fundação técnica, Identity, Workspace e o primeiro domínio financeiro já foram implementados.

## Fundação

- Next.js
- React
- TypeScript
- Tailwind CSS v4
- PostgreSQL
- Neon
- Drizzle ORM / Drizzle Kit
- Better Auth
- Zod
- React Hook Form
- Biome
- Vitest
- Testing Library

## Identity

Implementado:

- cadastro de usuário;
- autenticação;
- sessão;
- identificação server-side do usuário atual;
- integração com Better Auth;
- persistência real no PostgreSQL/Neon.

## Workspace

Implementado:

- onboarding inicial;
- criação do primeiro Workspace;
- Membership;
- Roles;
- configurações iniciais;
- proteção contra criação duplicada;
- resolução centralizada do estado de entrada da aplicação;
- isolamento de recursos por Workspace.

Roles atuais:

```text
OWNER
ADMIN
MEMBER
VIEWER
```

## Financial Accounts

O módulo de **Contas Financeiras** está concluído no escopo atual do MVP.

Casos de uso implementados:

- CreateFinancialAccount;
- ListFinancialAccounts;
- GetFinancialAccount;
- UpdateFinancialAccount;
- ArchiveFinancialAccount;
- RestoreFinancialAccount.

Também estão implementados:

- listagem de contas ativas;
- listagem separada de contas arquivadas;
- edição;
- soft archive;
- restauração;
- autorização baseada em Membership e Role;
- isolamento por Workspace;
- validação de entrada;
- integração completa com PostgreSQL/Neon;
- testes automatizados;
- validação funcional pela interface.

---

# Financial Account

`FinancialAccount` representa um local onde existe dinheiro ou onde futuras movimentações financeiras serão registradas.

Exemplos:

```text
Nubank
Conta corrente
Poupança
Carteira
Dinheiro em espécie
```

O nome `FinancialAccount` é utilizado para evitar conflito conceitual com `account`, já utilizado pelo Better Auth para autenticação.

## Tipos suportados

| Código | Descrição |
| --- | --- |
| `CHECKING` | Conta corrente |
| `SAVINGS` | Poupança |
| `DIGITAL` | Conta digital |
| `WALLET` | Carteira |
| `CASH` | Dinheiro em espécie |

---

# Valores financeiros

Valores monetários persistidos no PostgreSQL utilizam:

```text
NUMERIC(19,4)
```

Isso evita utilizar tipos de ponto flutuante como fonte de verdade para dinheiro.

Uma Financial Account possui um:

```text
initialBalance
```

Esse valor representa quanto já existia na conta quando ela foi cadastrada no YuFinance.

Exemplo:

```text
Conta: Nubank
Saldo inicial: R$ 1.500,25
```

O saldo inicial não representa uma receita criada pelo sistema.

## Saldo atual

O saldo atual não será armazenado como um número livremente editável.

A arquitetura prevê saldo derivado:

```text
saldo atual
=
saldo inicial
+
entradas
-
saídas
+
transferências recebidas
-
transferências enviadas
```

O cálculo completo será implementado junto aos domínios responsáveis pelas movimentações financeiras.

Enquanto Transactions ainda não estiver implementado, a interface apresenta explicitamente o valor como **Saldo inicial**.

---

# Arquivamento

Financial Accounts utilizam **soft archive**.

Uma conta não é excluída fisicamente quando o usuário escolhe arquivá-la.

O estado é controlado por:

```text
archivedAt
```

Conta ativa:

```text
archivedAt = NULL
```

Conta arquivada:

```text
archivedAt = timestamp
```

Isso permite preservar histórico e integridade referencial.

Uma conta arquivada pode posteriormente ser restaurada:

```text
Archive
archivedAt = timestamp

Restore
archivedAt = NULL
```

O fluxo completo de arquivamento e restauração já foi validado contra o banco PostgreSQL/Neon.

---

# Permissões

Toda operação financeira considera:

```text
User
↓
Workspace
↓
Membership
↓
Role
↓
FinancialAccount
```

Não é suficiente possuir apenas um `financialAccountId`.

A aplicação valida também o Workspace e o Membership do usuário.

## Matriz atual

| Operação | OWNER | ADMIN | MEMBER | VIEWER |
| --- | :---: | :---: | :---: | :---: |
| Visualizar contas | ✅ | ✅ | ✅ | ✅ |
| Criar conta | ✅ | ✅ | ❌ | ❌ |
| Editar conta | ✅ | ✅ | ❌ | ❌ |
| Arquivar conta | ✅ | ✅ | ❌ | ❌ |
| Restaurar conta | ✅ | ✅ | ❌ | ❌ |

As políticas são centralizadas no domínio e verificadas no servidor.

---

# Edição de contas

No fluxo comum de atualização, somente os seguintes campos podem ser alterados:

```text
name
type
```

Não são editados pelo formulário:

```text
initialBalance
currency
workspaceId
archivedAt
```

Após uma atualização bem-sucedida, a aplicação retorna para:

```text
/dashboard/accounts
```

e revalida os dados server-side.

---

# Arquitetura

O YuFinance utiliza uma arquitetura de **monólito modular**.

A aplicação permanece em um único sistema implantável, mas seus domínios são separados por responsabilidades.

Estrutura conceitual:

```text
src/
├── app/
├── db/
└── modules/
    ├── identity/
    ├── workspace/
    └── financial-accounts/
        ├── application/
        ├── domain/
        ├── infrastructure/
        └── presentation/
```

## Fluxo de uma mutação

```text
Browser
↓
Client Component
↓
Server Action
↓
Application / Use Case
↓
Domain Policy
↓
Repository
↓
Drizzle ORM
↓
PostgreSQL / Neon
```

## Leitura server-side

Server Components podem executar composição server-side:

```text
Server Component
↓
Application
↓
Authorization
↓
Repository
↓
Drizzle
↓
PostgreSQL
```

---

# Camadas

## Presentation

Responsável por:

- componentes;
- formulários;
- interação do usuário;
- Server Actions;
- apresentação de erros e estados.

Client Components não devem importar diretamente código protegido por `server-only`.

## Application

Responsável pelos casos de uso.

Exemplos:

```text
CreateFinancialAccount
GetFinancialAccount
UpdateFinancialAccount
ArchiveFinancialAccount
RestoreFinancialAccount
```

A camada de Application coordena:

- autenticação;
- autorização;
- validações;
- políticas;
- chamadas aos repositories.

## Domain

Responsável por regras que pertencem ao negócio.

Exemplo:

```text
canReadFinancialAccounts
canManageFinancialAccounts
```

## Infrastructure

Responsável por persistência e detalhes externos.

Repositories encapsulam operações com:

```text
Drizzle ORM
PostgreSQL
Neon
```

Componentes de interface não executam SQL.

---

# Fronteira Client / Server

Código dependente de:

```text
server-only
next/headers
sessão server-side
banco de dados
segredos
```

permanece exclusivamente no servidor.

Client Components executam mutações através de Server Actions.

Exemplo:

```text
UpdateFinancialAccountForm
↓
updateFinancialAccountAction()
↓
updateFinancialAccount()
↓
Repository
```

Essa separação evita que dependências server-side entrem no bundle do navegador.

---

# Workspace Entry State

A entrada na aplicação é centralizada por:

```text
getWorkspaceEntryState()
```

Existem três estados:

```text
UNAUTHENTICATED
ONBOARDING_REQUIRED
READY
```

Fluxo:

```text
UNAUTHENTICATED
→ autenticação

ONBOARDING_REQUIRED
→ /onboarding

READY
→ /dashboard
```

Quando o estado é `READY`, existe um Membership válido e um `workspaceId` disponível para a composição da experiência atual.

---

# Banco de dados

O banco principal é:

```text
PostgreSQL
```

Hospedado atualmente no:

```text
Neon
```

O acesso é realizado através do:

```text
Drizzle ORM
```

Alterações estruturais são controladas por migrations.

## Financial Accounts

Estrutura principal:

```text
financial_accounts
```

Campos:

```text
id
workspace_id
name
type
initial_balance
currency
archived_at
created_at
updated_at
```

Características:

- UUID como identificador;
- FK obrigatória para Workspace;
- `NUMERIC(19,4)` para valores monetários;
- moeda padrão BRL;
- soft archive através de `archived_at`;
- timestamps;
- índices voltados para consultas por Workspace e estado.

---

# Stack oficial

## Front-end

- Next.js
- React
- TypeScript
- Tailwind CSS v4
- Shadcn UI
- Lucide
- React Hook Form
- Zod

## Back-end

- Next.js Server Components
- Server Actions
- Better Auth
- Drizzle ORM

## Banco de dados

- PostgreSQL
- Neon
- Drizzle Kit

## Qualidade

- TypeScript
- Biome
- Vitest
- Testing Library
- Playwright

## Deploy

- Vercel

---

# Desenvolvimento local

## Requisitos

Você precisa ter instalado:

- Node.js;
- npm;
- Git.

Também é necessário acesso a um banco PostgreSQL compatível com a configuração do projeto.

## Clone

```bash
git clone <URL-DO-REPOSITORIO>
cd yufinance
```

## Dependências

```bash
npm install
```

## Variáveis de ambiente

Crie:

```text
.env.local
```

a partir das variáveis documentadas pelo projeto.

Nunca versione credenciais reais.

O repositório deve utilizar:

```text
.env.example
```

apenas como referência de configuração, sem segredos.

## Desenvolvimento

```bash
npm run dev
```

---

# Banco e migrations

Comandos atualmente utilizados:

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
npm run db:check
npm run db:ping
```

## Gerar migration

```bash
npm run db:generate
```

## Aplicar migrations

```bash
npm run db:migrate
```

## Drizzle Studio

```bash
npm run db:studio
```

## Validar configuração

```bash
npm run db:check
```

## Validar conexão

```bash
npm run db:ping
```

Migrations já aplicadas em ambientes compartilhados ou de produção não devem ser reescritas.

---

# Qualidade e testes

O projeto utiliza uma sequência de validação antes de considerar uma alteração concluída.

```bash
npm run check:fix
npm run check
npm run typecheck
npm run test
npm run build
```

## Biome

Verificação:

```bash
npm run check
```

Correções automáticas:

```bash
npm run check:fix
```

## TypeScript

```bash
npm run typecheck
```

## Testes

```bash
npm run test
```

## Build

```bash
npm run build
```

Uma funcionalidade não deve ser considerada concluída apenas porque funciona manualmente.

Ela deve também respeitar:

- regras de negócio;
- autorização;
- tipos;
- testes;
- build;
- documentação.

---

# Estratégia de testes

O projeto trabalha com diferentes níveis de validação.

## Unitários

Cobrem:

- schemas;
- casos de uso;
- políticas;
- regras de negócio.

## Componentes

Cobrem:

- formulários;
- validação;
- interação;
- Server Actions mockadas;
- navegação.

## Integração

Utilizados quando é necessário validar infraestrutura e persistência.

## E2E

Destinados às jornadas críticas completas da aplicação.

Além dos testes automatizados, fluxos relevantes são validados manualmente contra o PostgreSQL/Neon durante o desenvolvimento.

---

# Segurança

Princípios atuais:

- autenticação validada no servidor;
- autorização baseada em Membership;
- controle por Role;
- isolamento por Workspace;
- recursos financeiros sempre associados a um Workspace;
- IDs enviados pelo cliente nunca constituem autorização;
- Server Actions não executam SQL diretamente;
- repositories encapsulam persistência;
- erros internos não devem expor SQL, connection strings ou stack traces;
- segredos nunca devem ser versionados;
- operações financeiras devem preservar integridade histórica.

---

# Documentação

A documentação oficial está em:

```text
docs/
```

Estrutura:

```text
docs/
├── architecture/
│   ├── adr/
│   ├── architecture-overview.md
│   ├── database-model.md
│   └── domain-model.md
│
├── business/
│   ├── business-rules.md
│   └── financial-rules.md
│
├── development/
│   ├── development-guide.md
│   ├── documentation-guide.md
│   └── testing-strategy.md
│
├── modules/
│   ├── identity/
│   ├── workspace/
│   └── financial-accounts/
│
├── product/
│   ├── prd.md
│   ├── roadmap.md
│   └── scope.md
│
├── ux/
├── changelog.md
├── glossary.md
├── project-status.md
└── README.md
```

Antes de alterar um domínio, consulte sua documentação correspondente.

---

# ADRs

Decisões arquiteturais importantes são registradas através de **Architecture Decision Records**.

Atualmente existem decisões documentadas para:

```text
ADR-0001 — Next.js
ADR-0002 — Drizzle
ADR-0003 — Neon
ADR-0004 — Saldo derivado
ADR-0005 — Biome
ADR-0006 — Monólito modular
ADR-0007 — Fronteira Client/Server
ADR-0008 — Workspace Entry State
```

ADRs evitam que decisões arquiteturais importantes existam apenas na memória dos desenvolvedores.

---

# Roadmap

## Fundação

```text
Sprint 0 — Fundação
✅ Concluída
```

## Identity

```text
Sprint 1/2 — Identity e autenticação
✅ Concluídas no escopo atual
```

## Workspace

```text
Sprint 3 — Identity + Workspace
✅ Concluída
```

Inclui:

- onboarding;
- Workspace inicial;
- Membership;
- Roles;
- WorkspaceSettings;
- Entry State.

## Financial Accounts

```text
Sprint 4 — Financial Accounts
✅ Concluída
```

Inclui:

```text
Create   ✅
List     ✅
Get      ✅
Update   ✅
Archive  ✅
Restore  ✅
```

Também foram validados:

- persistência real;
- isolamento por Workspace;
- autorização;
- listagem ativa;
- listagem de arquivadas;
- edição;
- soft archive;
- restauração;
- interface integrada.

## Próximas etapas

Os próximos domínios devem seguir o roadmap oficial em `docs/product/roadmap.md`.

A implementação continuará respeitando a ordem de dependências entre os domínios financeiros.

---

# Definition of Done

Uma tarefa é considerada concluída quando:

```text
[ ] requisito implementado
[ ] regras de negócio respeitadas
[ ] autorização validada
[ ] isolamento por Workspace garantido
[ ] testes relevantes criados
[ ] Biome aprovado
[ ] TypeScript aprovado
[ ] testes aprovados
[ ] build aprovado
[ ] migration revisada quando aplicável
[ ] documentação atualizada
[ ] validação funcional realizada quando necessária
```

---

# Convenções

## Código

Identificadores permanecem predominantemente em inglês:

```text
FinancialAccount
Workspace
Membership
CreateFinancialAccount
ArchiveFinancialAccount
```

A documentação utiliza português para explicar o significado e o motivo desses conceitos.

## Commits

O projeto adota Conventional Commits.

Exemplos:

```text
feat: add financial account restoration
fix: prevent cross-workspace account access
docs: update financial accounts documentation
test: cover archive financial account
refactor: extract financial account permissions
chore: update drizzle migration
```

---

# Princípios de desenvolvimento

O YuFinance prioriza:

1. documentação antes de mudanças estruturais;
2. regras de negócio explícitas;
3. isolamento entre Workspaces;
4. autorização server-side;
5. tipagem forte;
6. dinheiro sem ponto flutuante como fonte de verdade;
7. separação de responsabilidades;
8. migrations rastreáveis;
9. testes automatizados;
10. preservação de histórico financeiro;
11. evolução incremental;
12. documentação sincronizada com o código.

---

# Status do projeto

```text
Fundação            ✅
Identity            ✅
Workspace           ✅
Financial Accounts  ✅

Transactions         ⏳ Próximas etapas do roadmap
Budgets              ⏳ Planejado
Reports              ⏳ Planejado
```

O **Sprint 4 — Financial Accounts** está concluído no escopo atual.

O YuFinance possui agora a fundação necessária para começar a introduzir movimentações financeiras sobre contas reais sem comprometer isolamento, autorização ou integridade histórica.

---

## Licença

A licença do projeto ainda deve ser definida.