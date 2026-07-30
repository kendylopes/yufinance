---
title: Fluxos de Usuário YuFinance
version: 1.1
status: active
updated_at: 2026-07-27
---

# Fluxos de Usuário

## Como usar este documento

Este documento explica uma parte específica do YuFinance em linguagem direta. Use-o para entender **o que foi decidido**, **por que essa decisão existe** e **qual é o estado atual** antes de alterar código relacionado. Quando houver diferença entre uma ideia planejada e o sistema já implementado, o texto deve marcar explicitamente **PLANEJADO**, **IMPLEMENTADO** ou **VALIDADO**.


## Fluxo principal

```text
Cadastro
↓
Sessão autenticada
↓
Onboarding
↓
Criação do Workspace + OWNER + Settings
↓
Dashboard
↓
Primeira conta
↓
Dashboard
↓
Nova receita ou despesa
```

## Fluxos a detalhar

- Cadastro e login
- Recuperação de senha
- Onboarding
- Criar conta financeira
- Criar receita
- Criar despesa
- Marcar como pago
- Reverter pagamento
- Cancelar transação
- Criar transferência
- Arquivar conta
- Arquivar categoria

## Fluxo de entrada implementado

```text
/register
  ↓
sessão
  ↓
getWorkspaceEntryState()
  ├─ UNAUTHENTICATED → /login
  ├─ ONBOARDING_REQUIRED → /onboarding
  └─ READY → /dashboard
```

Ao concluir o onboarding, a interface substitui a rota por `/dashboard`, evitando que o botão Voltar retorne a um onboarding já concluído.
