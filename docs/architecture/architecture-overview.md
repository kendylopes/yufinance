---
title: Visão Geral da Arquitetura
version: 1.1
status: approved
updated_at: 2026-07-16
---

# Arquitetura do YuFinance

## 1. Objetivo

Este documento define a arquitetura técnica oficial do YuFinance v1.0.

Ele estabelece:

- camadas;
- módulos;
- responsabilidades;
- dependências permitidas;
- fluxo de leitura e escrita;
- organização do código;
- padrões de integração;
- critérios para evolução da aplicação.

## 2. Estilo arquitetural

O YuFinance utilizará um **Monólito Modular Full Stack**.

A aplicação será executada em um único projeto Next.js, porém organizada em módulos de negócio independentes.

```text
Browser
   ↓
Next.js App Router
   ↓
Presentation
   ↓
Application
   ↓
Domain
   ↓
Infrastructure
   ↓
Drizzle ORM
   ↓
PostgreSQL (Neon)
```

## 3. Justificativa

O monólito modular foi escolhido porque oferece:

- menor complexidade operacional;
- implantação simples;
- transações locais;
- desenvolvimento rápido;
- separação clara de responsabilidades;
- possibilidade de extrair serviços no futuro.

Microsserviços não serão utilizados no MVP.

## 4. Camadas

### 4.1 Presentation

Responsável por:

- páginas;
- layouts;
- componentes React;
- formulários;
- tabelas;
- dialogs;
- feedback visual;
- navegação;
- Server Actions;
- Route Handlers.

A camada Presentation não pode acessar o banco diretamente.

### 4.2 Application

Responsável por:

- casos de uso;
- autorização;
- coordenação entre módulos;
- transações de banco;
- validação de entrada;
- conversão de erros;
- DTOs de entrada e saída.

Exemplos:

- CreateFinancialAccountUseCase
- CreateTransactionUseCase
- MarkTransactionAsPaidUseCase
- RevertTransactionPaymentUseCase
- CreateTransferUseCase
- ArchiveCategoryUseCase

### 4.3 Domain

Responsável por:

- regras de negócio;
- entidades;
- value objects;
- invariantes;
- serviços de domínio;
- contratos de repository;
- eventos de domínio.

A camada Domain não pode depender de:

- Next.js;
- React;
- Drizzle;
- Neon;
- Better Auth;
- bibliotecas de interface.

### 4.4 Infrastructure

Responsável por:

- Drizzle ORM;
- PostgreSQL;
- Better Auth;
- implementação de repositories;
- armazenamento externo;
- e-mail;
- logs;
- integrações.

## 5. Módulos

```text
src/modules/
├── identity/
├── workspaces/
├── accounts/
├── categories/
├── transactions/
├── transfers/
├── dashboard/
└── settings/
```

Cada módulo poderá conter:

```text
module/
├── application/
├── domain/
├── infrastructure/
├── presentation/
└── index.ts
```

## 6. Estrutura recomendada

```text
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   └── layout.tsx
│
├── modules/
│   ├── identity/
│   ├── workspaces/
│   ├── accounts/
│   ├── categories/
│   ├── transactions/
│   ├── transfers/
│   ├── dashboard/
│   └── settings/
│
├── db/
│   ├── schema/
│   ├── seed/
│   └── index.ts
│
├── shared/
│   ├── components/
│   ├── errors/
│   ├── lib/
│   ├── validation/
│   ├── types/
│   └── utils/
│
└── config/
```

## 7. Dependências permitidas

```text
Presentation → Application
Application → Domain
Infrastructure → Domain
Application → Infrastructure por composição
Domain → nenhuma camada externa
```

Não são permitidas dependências circulares.

## 8. Fluxo de escrita

```text
Usuário
↓
Formulário React
↓
Server Action
↓
Schema Zod
↓
Use Case
↓
Autorização
↓
Regra de domínio
↓
Repository
↓
Drizzle
↓
PostgreSQL
```

## 9. Fluxo de leitura

```text
Server Component
↓
Query Service
↓
Repository
↓
Drizzle
↓
PostgreSQL
↓
DTO de leitura
↓
Componente React
```

## 10. Server Actions

Usadas para mutações internas da aplicação.

Regras:

- devem executar no servidor;
- devem validar entrada;
- devem validar sessão;
- devem validar workspace;
- não devem conter regras de negócio complexas;
- devem chamar casos de uso;
- devem retornar resultado serializável;
- devem revalidar cache quando necessário.

## 11. Route Handlers

Usados para:

- webhooks;
- endpoints públicos;
- integrações externas;
- callbacks;
- APIs consumidas fora da aplicação.

Não serão usados como camada intermediária obrigatória para Server Components.

## 12. Repositories

Repositories serão definidos por contratos no domínio e implementados na infraestrutura.

Exemplo conceitual:

```text
TransactionRepository
├── create()
├── update()
├── findById()
├── list()
└── cancel()
```

A aplicação não deverá importar consultas Drizzle diretamente.

## 13. Tratamento de erros

Categorias iniciais:

- ValidationError
- AuthenticationError
- AuthorizationError
- NotFoundError
- ConflictError
- BusinessRuleError
- InfrastructureError

Erros internos não devem ser expostos diretamente ao usuário.

## 14. Resultado de casos de uso

Casos de uso devem retornar dados de aplicação ou lançar erros conhecidos.

Componentes não devem receber registros crus do banco quando um DTO específico for mais adequado.

## 15. Banco de dados

O banco continuará sendo organizado em:

```text
src/db/
├── schema/
├── seed/
└── index.ts

drizzle/
└── migrations/
```

Migrations serão versionadas e revisadas antes da aplicação em produção.

## 16. Comunicação entre módulos

Módulos podem consumir contratos públicos de outros módulos.

Não devem acessar arquivos internos de outro módulo.

Exemplo permitido:

```text
transactions/application
→ accounts/public-api
```

Exemplo proibido:

```text
transactions/application
→ accounts/infrastructure/drizzle-account.repository
```

## 17. Dashboard

O Dashboard será um módulo somente de leitura.

Ele poderá consultar:

- contas;
- transações;
- transferências;
- categorias.

Ele não poderá modificar entidades financeiras.

## 18. Segurança

Toda operação deverá validar:

```text
Usuário autenticado
↓
Membership no workspace
↓
Permissão
↓
Propriedade do recurso
↓
Ação
```

## 19. Testes

### Unitários

Cobrirão:

- regras financeiras;
- serviços de domínio;
- casos de uso;
- transições de status;
- saldo atual;
- saldo previsto.

### Integração

Cobrirão:

- repositories;
- constraints;
- transações SQL;
- isolamento por workspace.

### E2E

Cobrirão jornadas críticas do usuário.

## 20. Evolução

Um módulo só deverá ser extraído para serviço independente quando existir necessidade comprovada de:

- escala independente;
- isolamento operacional;
- integração externa;
- equipe separada;
- ciclo de deploy independente.
