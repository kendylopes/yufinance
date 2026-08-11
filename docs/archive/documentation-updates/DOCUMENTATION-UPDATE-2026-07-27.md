# Relatório da atualização documental — 2026-07-27

## Objetivo

Registrar exatamente o que foi reconciliado após a implementação de Identity, Workspace e Onboarding.

## Principais inconsistências corrigidas

- `workspaces/` → `workspace/` no nome do módulo de código;
- Workspace não é mais documentado como criado automaticamente no cadastro: ele é criado no onboarding;
- categorias padrão não são tratadas como implementadas;
- tabelas financeiras foram separadas do schema já existente;
- nomes reais do Better Auth (`user`, `session`, `account`, `verification`) foram registrados;
- senha atual documentada como 8–128 caracteres;
- Server Action e fronteira Client/Server documentadas;
- `getWorkspaceEntryState()` e navegação oficial documentados;
- Repository/Drizzle e persistência do onboarding documentados;
- status antigo de “Backend/Frontend/Testes 0%” removido;
- roadmap atualizado para Contas Financeiras como próximo domínio.

## Novos documentos

- ADR-0007 — Server Actions e fronteira Client/Server;
- ADR-0008 — estado de entrada do Workspace;
- Estratégia de Testes;
- este relatório de atualização.

## Regra para o próximo ciclo

Antes de implementar Contas Financeiras, criar/revisar sua documentação de domínio, regras e casos de uso. Depois implementar verticalmente e atualizar este baseline novamente.
