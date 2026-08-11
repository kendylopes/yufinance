# ADR 0009 — Managed Workspace Resource Pattern

## Status

Aceito.

## Contexto

Contas financeiras, categorias, transações e futuros recursos precisam de uma fronteira consistente de tenancy, autorização e ciclo de vida.

## Decisão

Todo recurso financeiro gerenciado deve:

- pertencer obrigatoriamente a um Workspace;
- validar Membership antes de leitura ou alteração;
- usar helpers de permissão por módulo;
- preferir arquivamento/cancelamento quando o histórico for relevante;
- manter repository isolado da Presentation;
- expor operações por casos de uso tipados e testados.

## Consequências

A implementação ganha previsibilidade, reduz acesso cruzado entre Workspaces e estabelece um padrão reutilizável para Budgets, Installments e demais módulos.
