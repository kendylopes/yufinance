# Roadmap oficial do YuFinance

## Como usar

Este documento define a sequência macro de evolução. O estado vigente também aparece no [PROJECT_MASTER.md](PROJECT_MASTER.md).

## Concluído

- **Sprint 0–1 — Fundação:** Next.js, TypeScript, Tailwind, Biome, testes e estrutura inicial.
- **Sprint 2 — Banco:** Drizzle, PostgreSQL Neon, migrations e schemas base.
- **Sprint 3 — Identity + Workspace:** autenticação, cadastro, onboarding, Membership e entry state.
- **Sprint 4 — Financial Accounts:** ciclo completo de contas financeiras.
- **Sprint 5 — Categories:** ciclo completo de categorias.
- **Sprint 6 — Transactions:** ciclo completo de transações.
- **Sprint 7 — Dashboard:** resumo, KPIs, transações recentes, gráficos e insights.
- **Sprint 7.1 — Consolidação:** contexto compartilhado, período via URL, organização da Presentation e loading.

## Em consolidação

### Sprint 7.2 — Zero Boilerplate e documentação

- identidade e metadata do YuFinance;
- rota raiz integrada ao entry state;
- remoção de resíduos do create-next-app;
- organização documental e criação do PROJECT_MASTER;
- revisão de README, assets, favicon e manifesto;
- Quality Gate final.

## Próximas sprints

### Sprint 8 — Budgets

- PRD e regras;
- modelo e migration;
- permissões;
- criar/listar/consultar/editar/arquivar/restaurar;
- UI e testes;
- integração ao Dashboard.

### Sprint 9 — Installments

- parcelamentos;
- recorrência e vencimentos;
- vínculo com transações e contas.

### Sprint 10 — Contas a pagar e receber

- status, vencimento e liquidação;
- juros, multas e pagamentos parciais.

### Sprint 11 — Calendário financeiro

- agenda de vencimentos;
- lembretes e visão temporal.

### Sprint 12 — Relatórios

- filtros avançados;
- exportações;
- comparações e histórico.

### Sprints posteriores

- automações e notificações;
- integração WhatsApp/e-mail;
- metas financeiras;
- investimentos;
- Copilot/IA;
- observabilidade e produção.
