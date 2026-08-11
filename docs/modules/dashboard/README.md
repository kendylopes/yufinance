# Dashboard

## O que é

O Dashboard é a camada de leitura analítica do YuFinance. Ele consolida dados do Workspace e apresenta resumo, indicadores, gráficos, transações recentes e insights.

## Estado

Concluído na Sprint 7 e consolidado na Sprint 7.1.

## Funcionalidades

- resumo financeiro;
- KPIs;
- últimas transações;
- receitas versus despesas;
- evolução mensal;
- despesas por categoria;
- insights financeiros;
- filtro de período pela URL;
- loading state.

## Arquitetura

Os casos de uso usam `getDashboardContext()` para autenticação, Membership e resolução do período. Cada widget mantém DTO, caso de uso, repository quando necessário, testes e Presentation.

## Regras centrais

- apenas dados do Workspace autorizado;
- transações canceladas não entram em métricas financeiras;
- períodos são validados por schema;
- valores financeiros são agregados no banco e formatados na apresentação;
- insights interpretam dados existentes sem novas consultas redundantes.
