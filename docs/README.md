# YuFinance — Documentação Oficial

Esta pasta é a fonte documental do YuFinance. Antes de alterar um domínio, consulte o PRD, regras de negócio, arquitetura, casos de uso e status correspondentes.

## Estado em 2026-07-29

- Fundação técnica: **concluída**;
- Identity: **concluída no escopo atual**;
- Workspace/Onboarding: **concluído**;
- Financial Accounts: **concluído no escopo atual do MVP**;
- Create/List/Get/Update/Archive/Restore: **implementados e validados**;
- soft archive e restauração: **validados no Neon**;
- suíte automatizada: **141 testes aprovados**;
- próximo domínio oficial: **Categorias**.

## Índice

### Produto

- [PRD](product/prd.md)
- [Escopo](product/scope.md)
- [Roadmap](product/roadmap.md)

### Negócio

- [Regras de Negócio](business/business-rules.md)
- [Regras Financeiras](business/financial-rules.md)

### Arquitetura

- [Visão Geral](architecture/architecture-overview.md)
- [Modelo de Domínio](architecture/domain-model.md)
- [Modelo de Banco](architecture/database-model.md)
- [ADRs](architecture/adr/)

### Módulos

- [Identity](modules/identity/)
- [Workspace](modules/workspace/)
- [Financial Accounts](modules/financial-accounts/)

### Desenvolvimento

- [Guia de Desenvolvimento](development/development-guide.md)
- [Guia de Documentação](development/documentation-guide.md)
- [Estratégia de Testes](development/testing-strategy.md)

### UX

- [Design System](ux/design-system.md)
- [User Flows](ux/user-flows.md)
- [Wireframes](ux/wireframes.md)

### Controle do projeto

- [Status do Projeto](project-status.md)
- [Changelog](changelog.md)
- [Glossário](glossary.md)
- [Atualização documental — 2026-07-27](DOCUMENTATION-UPDATE-2026-07-27.md)
- [Atualização documental — 2026-07-29](DOCUMENTATION-UPDATE-2026-07-29.md)

## Baseline atual

```text
User
↓
Workspace
↓
FinancialAccount
↓
Categories (próximo domínio)
↓
Transactions
↓
Transfers / Dashboard
```

## Regra de manutenção

Mudanças relevantes de domínio, arquitetura, banco ou fluxo devem terminar com:

1. implementação;
2. testes;
3. validação;
4. atualização documental;
5. atualização do status/changelog.

Documentação antiga não deve permanecer descrevendo como “planejado” algo já implementado.

## Estado em 2026-07-30

- Fundação técnica: **concluída**;
- Identity: **concluída no escopo atual**;
- Workspace/Onboarding: **concluído**;
- Financial Accounts: **concluído no escopo atual do MVP**;
- Categories (backend): **concluído**;
- Categories (Server Actions): **concluído**;
- Categories (UI): **em desenvolvimento**;
- suíte automatizada: **todos os testes verdes**;
- próximo marco: **interface de Categories**.