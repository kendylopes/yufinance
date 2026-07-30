---
title: PRD YuFinance
version: 1.1
status: approved
updated_at: 2026-07-27
---

# PRD — YuFinance v1.0

## Como usar este documento

Este documento explica uma parte específica do YuFinance em linguagem direta. Use-o para entender **o que foi decidido**, **por que essa decisão existe** e **qual é o estado atual** antes de alterar código relacionado. Quando houver diferença entre uma ideia planejada e o sistema já implementado, o texto deve marcar explicitamente **PLANEJADO**, **IMPLEMENTADO** ou **VALIDADO**.


## 1. Visão do produto

O YuFinance será um SaaS de finanças pessoais, acessível pelo navegador e projetado com abordagem mobile first.

O produto permitirá que o usuário acompanhe receitas, despesas, contas financeiras, transferências, saldo atual, saldo previsto e indicadores financeiros essenciais.

## 2. Problema

Muitas pessoas mantêm suas finanças distribuídas entre aplicativos bancários, planilhas, anotações e memória pessoal. As soluções existentes costumam ser simples demais ou complexas demais.

## 3. Proposta de valor

> Controle sua vida financeira de forma simples, visual e inteligente.

## 4. Público-alvo

Pessoas físicas que desejam organizar suas finanças pessoais, incluindo:

- trabalhadores assalariados;
- autônomos;
- freelancers;
- estudantes;
- usuários com múltiplas contas;
- usuários que atualmente utilizam planilhas.

## 5. Modelo de negócio

O YuFinance será um SaaS.

Cada usuário configura seu primeiro Workspace no onboarding. O modelo já aceita tipos `PERSONAL`, `COUPLE` e `FAMILY`; colaboração completa e seleção entre múltiplos Workspaces serão evoluções posteriores.

## 6. Princípios do produto

- Clareza
- Simplicidade
- Velocidade
- Confiabilidade
- Segurança
- Mobile first

## 7. Módulos do MVP

- Autenticação
- Workspace pessoal
- Onboarding
- Contas financeiras
- Categorias
- Receitas
- Despesas
- Transferências
- Dashboard
- Busca e filtros
- Configurações
- Tema claro, escuro e sistema

## 8. Funcionalidades pós-MVP

- Cartões de crédito
- Faturas
- Parcelamentos
- Recorrências
- Pagamentos parciais
- Orçamentos
- Metas
- Empréstimos
- Juros e multas
- Calendário
- WhatsApp
- Notificações push
- Open Finance
- Inteligência artificial

## 9. Jornada principal do MVP

1. Criar conta
2. Iniciar onboarding autenticado
3. Criar o Workspace inicial e tornar o usuário OWNER
4. Criar primeira conta financeira
5. Registrar receita
6. Registrar despesa
7. Realizar transferência
8. Consultar saldo atual
9. Consultar saldo previsto
10. Usar filtros e busca
11. Editar e arquivar dados

## 10. Critério de sucesso do MVP

O MVP será considerado funcional quando o usuário conseguir concluir a jornada principal sem inconsistências financeiras e com boa experiência em celular e desktop.

## 11. Requisitos não funcionais

- Aplicação responsiva
- Validação no servidor
- Isolamento por workspace
- Valores financeiros com precisão decimal
- Histórico como fonte da verdade
- HTTPS em produção
- Autorização em todas as operações
- Testes unitários e E2E
