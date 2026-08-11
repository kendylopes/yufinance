# PROJECT MASTER — YuFinance

## 1. Finalidade

Este documento é a fonte de verdade consolidada do YuFinance. Ele orienta planejamento, implementação, revisão, homologação e continuidade do projeto. Documentos especializados permanecem válidos, mas devem estar alinhados a este baseline.

## 2. Visão do produto

O YuFinance é uma aplicação de gestão financeira pessoal e compartilhada, inspirada funcionalmente no Yume's Finance, porém com identidade, experiência e arquitetura próprias. O produto busca transformar registros financeiros em organização, acompanhamento e decisões práticas.

### Proposta de valor

- Centralizar contas, categorias e transações.
- Operar em Workspaces pessoais, de casal ou família.
- Apresentar visão financeira por período.
- Evoluir para orçamentos, parcelamentos, contas a pagar/receber, calendário, relatórios, automações e insights.

## 3. Princípios do projeto

1. **Documentação first:** documentar antes de modelar e implementar.
2. **Vertical slices:** concluir regras, dados, aplicação, UI, testes e documentação por funcionalidade.
3. **Domínio explícito:** regras de negócio não ficam dispersas em componentes ou páginas.
4. **Server boundaries:** código de autenticação, banco e casos de uso server-side deve permanecer protegido.
5. **Quality Gate obrigatório:** não avançar com `check`, `typecheck`, `test` ou `build` quebrados.
6. **Saldo derivado:** o saldo atual não é editado diretamente; é derivado do saldo inicial e das transações válidas.
7. **Workspace como fronteira:** recursos financeiros pertencem obrigatoriamente a um Workspace.
8. **Arquivamento preferencial:** preservar histórico em vez de exclusão destrutiva quando aplicável.

## 4. Stack oficial

- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS v4
- Shadcn UI e Lucide
- Drizzle ORM e Drizzle Kit
- PostgreSQL Neon
- Better Auth
- Zod 4
- Vitest
- Playwright
- Biome
- Vercel

## 5. Arquitetura oficial

O YuFinance é um monólito modular com separação por módulo e camadas:

```text
Presentation
    ↓
Application
    ↓
Domain
    ↓
Infrastructure
    ↓
PostgreSQL
```

### Responsabilidades

- **Presentation:** páginas, componentes, formulários e Server Actions.
- **Application:** casos de uso, schemas de entrada, DTOs e orquestração.
- **Domain:** regras, permissões e conceitos centrais.
- **Infrastructure:** repositories, persistência e integrações técnicas.

Consulte [architecture/architecture-overview.md](architecture/architecture-overview.md).

## 6. Módulos e estado atual

| Módulo | Estado | Observação |
|---|---|---|
| Identity | Concluído no escopo atual | Cadastro, autenticação e sessão via Better Auth |
| Workspace | Concluído | Onboarding, Membership, roles e entry state |
| Financial Accounts | Concluído | Criar, listar, editar, arquivar e restaurar |
| Categories | Concluído | Categorias de receita/despesa com arquivamento |
| Transactions | Concluído | Criar, listar, consultar, editar, cancelar e restaurar |
| Dashboard | Concluído e consolidado | Resumo, KPIs, gráficos, insights, período via URL e loading |
| Budgets | Próximo módulo planejado | Sprint 8 |
| Installments | Planejado | Após Budgets |
| Accounts Payable/Receivable | Planejado | Evolução financeira operacional |
| Reports | Planejado | Relatórios e exportações |
| Calendar/Reminders | Planejado | Agenda financeira e notificações |

## 7. Dashboard consolidado — Sprint 7 e 7.1

O Dashboard inclui:

- resumo financeiro;
- KPIs operacionais;
- últimas transações;
- receitas versus despesas;
- evolução mensal;
- despesas por categoria;
- insights financeiros;
- filtro de período sincronizado com a URL;
- contexto compartilhado `getDashboardContext()`;
- loading state via App Router;
- widgets organizados por responsabilidade.

### Períodos suportados

- `TODAY`
- `LAST_7_DAYS`
- `LAST_30_DAYS`
- `CURRENT_MONTH`
- `CURRENT_YEAR`

## 8. Permissões

A política segue roles do Workspace:

- `OWNER`
- `ADMIN`
- `MEMBER`
- `VIEWER`

Leitura e gerenciamento devem ser definidos em helpers de permissão por módulo. Recursos nunca devem ser acessados apenas por ID sem validar Membership no Workspace.

## 9. Processo oficial de desenvolvimento

```text
Documentação
→ Regras de negócio
→ Modelo de domínio
→ Contratos e schemas
→ Banco e repository
→ Caso de uso
→ Testes
→ Presentation e integração
→ Quality Gate
→ Homologação
→ Atualização documental
```

Consulte [standards/DEVELOPMENT_WORKFLOW.md](standards/DEVELOPMENT_WORKFLOW.md).

## 10. Definition of Done

Uma entrega só está concluída quando:

- regras e escopo estão documentados;
- contratos estão tipados e validados;
- permissões e Workspace foram considerados;
- testes relevantes estão aprovados;
- `npm run check` está verde;
- `npm run typecheck` está verde;
- `npm run test` está verde;
- `npm run build` está verde no fechamento do bloco/sprint;
- homologação manual foi realizada;
- documentação e changelog foram atualizados.

## 11. Baseline atual

- Sprint 0–6: fundação, Identity, Workspace, Financial Accounts, Categories e Transactions concluídos.
- Sprint 7: Dashboard funcional concluído.
- Sprint 7.1: consolidação arquitetural e UX do Dashboard concluída.
- Sprint 7.2: housekeeping, identidade e documentação em execução/consolidação.
- Próxima sprint funcional: **Sprint 8 — Budgets**.

## 12. Próximas prioridades

1. Encerrar Zero Boilerplate e identidade do repositório.
2. Validar documentação consolidada.
3. Implementar Budgets em vertical slices.
4. Integrar Budgets ao Dashboard.
5. Evoluir para parcelamentos e contas a pagar/receber.

## 13. Documentos centrais

- [ROADMAP.md](ROADMAP.md)
- [CHANGELOG.md](CHANGELOG.md)
- [project-status.md](project-status.md)
- [architecture/architecture-overview.md](architecture/architecture-overview.md)
- [development/development-guide.md](development/development-guide.md)
- [standards/QUALITY_GATES.md](standards/QUALITY_GATES.md)
- [modules/README.md](modules/README.md)
- [glossary.md](glossary.md)
