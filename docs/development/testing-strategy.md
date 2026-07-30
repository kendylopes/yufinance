---
title: Estratégia de Testes YuFinance
version: 1.1
status: approved
updated_at: 2026-07-29
---

# Estratégia de Testes

## Como usar este documento

Define o que testar em cada camada e como manter a suíte compatível com a fronteira Client/Server.

## Schema

Testa validação e normalização Zod sem React ou banco.

## Application

Testa casos de uso com autenticação, Membership e infraestrutura mockados.

Casos comuns:

- sucesso;
- não autenticado;
- sem Membership;
- Role insuficiente;
- recurso inexistente;
- falha de persistência.

## Infrastructure

Repositories encapsulam Drizzle. Casos de uso mockam o Repository em vez de reproduzir a API interna do ORM.

## Presentation

Testing Library + user-event.

Testar:

- labels;
- valores iniciais;
- validação;
- submit;
- mensagens;
- navegação;
- estado de envio;
- Server Action mockada.

## `server-only`

Não remover `import "server-only"` do código de produção para satisfazer Vitest.

Quando necessário:

```ts
vi.mock("server-only", () => ({}));
```

## Server Actions

Client Components devem mockar a Server Action, não importar a cadeia server-only real.

Quando necessário, usar `vi.hoisted()` para mocks criados antes da resolução do módulo.

## Financial Accounts

O Sprint 4 adicionou cobertura para:

- permissões;
- Create;
- List;
- Get;
- Update;
- Archive;
- Restore;
- listagem de arquivadas;
- formulário de criação;
- formulário de edição;
- navegação pós-update.

## Validação integrada/manual

Já foram validados contra o Neon:

### Workspace

- Workspace;
- Membership OWNER;
- Settings;
- proteção contra duplicação.

### Financial Accounts

- Create;
- persistência de `NUMERIC(19,4)`;
- List;
- Update;
- Archive;
- listagem de arquivadas;
- Restore;
- preservação do registro;
- transição de `archived_at`.

## Checkpoint

Após o fechamento do Sprint 4:

```text
141 testes automatizados aprovados
```

## Checklist

```text
[ ] caminho feliz
[ ] entrada inválida
[ ] não autenticado
[ ] sem Membership
[ ] Role insuficiente quando aplicável
[ ] recurso de outro Workspace não é acessado
[ ] falha de infraestrutura
[ ] nenhum detalhe interno exposto
[ ] acessibilidade básica
[ ] navegação correta
[ ] check
[ ] typecheck
[ ] test
[ ] build
[ ] validação real quando necessária
[ ] documentação atualizada
```
