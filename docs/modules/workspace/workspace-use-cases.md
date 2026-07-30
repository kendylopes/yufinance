# Casos de Uso — Workspace

## Sobre este documento

Este documento descreve as principais ações que o YuFinance executará dentro
do módulo **Workspace**.

### O que é um caso de uso?

Um caso de uso representa uma ação relevante do sistema.

Ele descreve:

- quem inicia a ação;
- quais dados são necessários;
- quais regras precisam ser respeitadas;
- o que deve acontecer;
- o que fazer quando algo falha.

Ele não representa uma tela específica.

Por exemplo:

`CreateInitialWorkspace`

Tradução:

**Criar Workspace inicial**.

Esse caso de uso representa a criação do primeiro ambiente financeiro do usuário,
independentemente de qual tela iniciou a ação.

---

# 1. Convenção de nomes

Os casos de uso seguem normalmente:

Verbo + Objeto

Exemplo:

`CreateInitialWorkspace`

Separando o nome:

`Create`
→ Criar

`Initial`
→ Inicial

`Workspace`
→ Espaço de trabalho

O nome indica claramente que não estamos criando um Workspace qualquer.

Estamos criando o **primeiro Workspace necessário para iniciar o uso do produto**.

---

# 2. WS-UC-001 — CreateInitialWorkspace

## Tradução

Criar Workspace inicial.

## Objetivo

Criar o primeiro ambiente financeiro de um usuário autenticado durante
o processo de onboarding.

---

# 3. Ator

Usuário autenticado.

O sistema deverá conhecer a identidade atual antes de executar a operação.

Conceitualmente:

Session válida
→ User identificado
→ CreateInitialWorkspace

---

# 4. Pré-condições

Antes de executar o caso de uso:

- o usuário deve estar autenticado;
- deve existir um User válido;
- o usuário não deve possuir um Workspace que torne o onboarding inicial
  desnecessário.

---

# 5. Entrada

A primeira versão receberá:

`name`

Tradução:

Nome do Workspace.

`type`

Tradução:

Tipo do Workspace.

Estrutura conceitual:

```ts
{
  name: string;
  type: "PERSONAL" | "COUPLE" | "FAMILY";
}
## 10. Estado implementado e validado

`CreateInitialWorkspace` está concluído de ponta a ponta.

Fluxo real:

```text
OnboardingForm (Client)
→ createInitialWorkspaceAction (Server Action)
→ createInitialWorkspace (Application)
→ getCurrentUser
→ persistInitialWorkspace
→ workspace-repository
→ Neon
```

Resultados validados:

- bloqueia usuário não autenticado;
- valida nome e tipo com Zod;
- `PERSONAL` é o tipo padrão do formulário;
- bloqueia onboarding inicial duplicado;
- gera UUID para Workspace;
- cria Workspace, Membership `OWNER` e Settings;
- retorna erro amigável sem expor detalhes do banco;
- após sucesso, a interface usa `router.replace("/dashboard")` e `router.refresh()`.

### Estado de entrada

`getWorkspaceEntryState()` não é um seletor definitivo de Workspace. Ele responde apenas se o usuário pode entrar no produto:

- `UNAUTHENTICATED`;
- `ONBOARDING_REQUIRED`;
- `READY`.
