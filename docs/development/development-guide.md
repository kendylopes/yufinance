---
title: Guia de Desenvolvimento
version: 1.0
status: approved
updated_at: 2026-07-16
---

# Guia de Desenvolvimento do YuFinance

## 1. Objetivo

Este documento define o padrão de trabalho oficial do YuFinance.

A documentação é a fonte de verdade e deve evoluir junto com o código.

## 2. Fluxo obrigatório

```text
Análise
↓
Documentação
↓
Validação
↓
Implementação
↓
Testes
↓
Documentação atualizada
```

Nenhuma alteração importante deve ser implementada sem atualização documental correspondente.

## 3. Stack oficial

- Next.js
- React
- TypeScript
- Tailwind CSS v4
- Shadcn UI
- Lucide
- React Hook Form
- Zod
- Drizzle ORM
- Drizzle Kit
- PostgreSQL
- Neon
- Better Auth
- Biome
- Vitest
- Playwright
- Vercel

## 4. Biome

O Biome é responsável por:

- lint;
- formatação;
- organização de imports;
- correções automáticas.

Comandos:

```bash
npm run check
npm run check:fix
npm run typecheck
npm run build
```

Antes de commit:

```bash
npm run check
npm run typecheck
npm run build
```

## 5. Nomenclatura de arquivos

### Casos de uso

```text
create-transaction.use-case.ts
mark-transaction-as-paid.use-case.ts
archive-account.use-case.ts
```

### Repositories

```text
transaction.repository.ts
drizzle-transaction.repository.ts
```

### Schemas

```text
create-transaction.schema.ts
transaction-filter.schema.ts
```

### Entidades

```text
transaction.entity.ts
financial-account.entity.ts
```

### Componentes

```text
TransactionForm.tsx
AccountCard.tsx
DashboardSummary.tsx
```

### Hooks

```text
useTransactions.ts
useAccounts.ts
```

## 6. TypeScript

Regras:

- evitar `any`;
- preferir `unknown` para dados externos;
- usar `import type`;
- não ignorar erros com `@ts-ignore`;
- modelar estados com unions e enums;
- evitar casts sem validação;
- não usar `number` para dinheiro na persistência.

## 7. Valores financeiros

No banco:

```text
NUMERIC(19,4)
```

No domínio:

- string decimal;
- ou tipo decimal dedicado;
- nunca converter dinheiro indiscriminadamente para `number`.

## 8. Validação

A validação deve existir em duas camadas:

### Entrada

Zod valida:

- estrutura;
- tipos;
- campos obrigatórios;
- tamanho;
- formato.

### Domínio

O domínio valida:

- regras financeiras;
- invariantes;
- transições de estado;
- permissões de operação.

## 9. Server Actions

Padrão:

1. obter sessão;
2. validar entrada;
3. resolver workspace autorizado;
4. chamar caso de uso;
5. tratar erro conhecido;
6. revalidar cache;
7. retornar resultado serializável.

Server Actions não devem executar SQL diretamente.

## 10. Casos de uso

Cada caso de uso deve representar uma intenção clara.

Exemplos:

- CreateTransaction
- MarkTransactionAsPaid
- RevertTransactionPayment
- CancelTransaction
- CreateTransfer
- ArchiveFinancialAccount

Um caso de uso não deve se transformar em um serviço genérico com muitas responsabilidades.

## 11. Repositories

Repositories:

- encapsulam persistência;
- não contêm lógica de interface;
- não retornam erros do driver diretamente;
- devem respeitar o workspace;
- devem participar de transações quando necessário.

## 12. Segurança

É obrigatório validar:

- autenticação;
- membership;
- papel;
- workspace;
- propriedade do recurso.

Nunca confiar em `workspaceId` enviado pelo cliente sem validação.

## 13. Erros

Erros conhecidos devem ter nomes claros:

```text
ValidationError
AuthenticationError
AuthorizationError
NotFoundError
ConflictError
BusinessRuleError
```

Não expor:

- SQL;
- stack trace;
- connection string;
- detalhes internos.

## 14. Commits

Utilizar Conventional Commits.

Exemplos:

```text
feat: add financial account creation
fix: prevent cross-workspace transaction access
docs: update transaction business rules
test: cover projected balance calculation
refactor: extract transaction repository
chore: configure drizzle migrations
```

## 15. Branches

Padrão recomendado:

```text
main
develop
feature/nome-da-feature
fix/nome-da-correcao
docs/nome-da-documentacao
```

Para equipe pequena, `main` poderá ser usada com branches curtas e Pull Requests.

## 16. Pull Requests

Toda PR deve informar:

- objetivo;
- documentos alterados;
- decisões técnicas;
- testes executados;
- riscos;
- screenshots quando houver UI;
- impacto em migrations.

## 17. Checklist de Pull Request

```text
[ ] Documentação atualizada
[ ] Regras de negócio respeitadas
[ ] Autorização por workspace validada
[ ] Biome aprovado
[ ] TypeScript aprovado
[ ] Testes aprovados
[ ] Build aprovado
[ ] Migration revisada
[ ] Sem segredos versionados
[ ] Sem logs temporários
```

## 18. Migrations

Regras:

- não editar migration já aplicada em produção;
- revisar SQL gerado;
- não usar `db:push` em produção;
- migrations destrutivas exigem plano;
- alterações de precisão monetária exigem atenção especial;
- backups devem existir antes de migrations críticas.

## 19. Testes

### Unitários

Devem cobrir regras de negócio.

### Integração

Devem cobrir banco e repositories.

### E2E

Devem cobrir jornadas críticas.

Nomenclatura:

```text
transaction-balance.spec.ts
create-transfer.integration.spec.ts
onboarding.e2e.spec.ts
```

## 20. Definition of Done

Uma tarefa está concluída quando:

- requisito implementado;
- documentação atualizada;
- testes criados;
- lint aprovado;
- typecheck aprovado;
- build aprovado;
- critérios de aceite atendidos;
- revisão concluída.

## 21. Práticas proibidas

- SQL direto em componente;
- regra financeira em JSX;
- acesso a recurso sem workspace;
- `account.balance` como fonte da verdade;
- dinheiro em `float`;
- dependência circular;
- imports internos entre módulos;
- credenciais no Git;
- código incompleto em produção.
## Gestão de variáveis de ambiente

### Arquivos

.env.local
→ Desenvolvimento local
→ Nunca versionar

.env.example
→ Modelo para outros desenvolvedores
→ Nunca conter valores reais

### Regras

- Nunca versionar segredos.
- Nunca publicar DATABASE_URL real.
- Nunca publicar chaves de API.
- Rotacionar imediatamente qualquer credencial exposta.
- Todo segredo deve existir apenas em:
  - .env.local
  - Variáveis do ambiente de produção (Vercel, CI/CD, etc.).