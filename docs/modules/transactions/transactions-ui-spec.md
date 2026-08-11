# Transactions UI Specification

> **Módulo:** Transactions  
> **Status:** IMPLEMENTADO  
> **Rota principal:** `/dashboard/transactions`  
> **Última atualização:** 2026-08-10

# Introdução

Este documento descreve a camada de apresentação do módulo **Transactions** do YuFinance.

Transactions representa as movimentações financeiras efetivamente realizadas dentro de um Workspace. Enquanto outros módulos organizam ou planejam as finanças, Transactions registra o dinheiro que efetivamente entrou ou saiu de uma conta financeira.

Este documento deve ser consultado sempre que houver alteração em:
- página de transações;
- formulários de criação ou edição;
- tabela de movimentações;
- cancelamento ou restauração;
- loading, empty state ou feedback;
- integração entre Presentation, Server Actions e Application.

A interface não contém regras de autorização definitivas. A autorização permanece na camada Application.

---

# 1. Objetivo

A interface de Transactions permite ao usuário:
- visualizar movimentações do Workspace;
- identificar receitas e despesas;
- visualizar conta financeira e categoria;
- criar uma nova transação;
- editar uma transação ativa;
- cancelar uma transação;
- restaurar uma transação cancelada;
- visualizar o status da movimentação.

## Fora do escopo atual

Não fazem parte da interface atual:
- exclusão física de transações;
- paginação;
- busca textual;
- filtros avançados;
- anexos;
- recorrência automática;
- importação de extratos;
- conciliação bancária;
- transferência entre contas como operação especializada;
- edição de transações canceladas.

---

# 2. Permissões

A autorização oficial é validada pela camada Application.

| Operação | OWNER | ADMIN | MEMBER | VIEWER |
|---|---:|---:|---:|---:|
| Visualizar | ✔ | ✔ | ✔ | ✔ |
| Criar | ✔ | ✔ | ✔ | ✖ |
| Editar | ✔ | ✔ | ✔ | ✖ |
| Cancelar | ✔ | ✔ | ✔ | ✖ |
| Restaurar | ✔ | ✔ | ✔ | ✖ |

A UI pode ocultar ou desabilitar ações, mas isso nunca substitui a validação server-side.

---

# 3. Fluxo arquitetural

```text
Browser
    ↓
Server Component
    ↓
Client Component
    ↓
Server Action
    ↓
Application
    ↓
Repository
    ↓
Database
```

A camada Presentation nunca acessa Repository diretamente.

As páginas resolvem o Workspace atual através de `getWorkspaceEntryState()` antes de carregar dados do módulo.

---

# 4. Rotas

## Listagem e criação

```text
/dashboard/transactions
```

Responsabilidades:
- resolver autenticação e Workspace;
- carregar transações;
- carregar contas financeiras;
- carregar categorias;
- apresentar tabela;
- apresentar formulário de criação.

## Edição

```text
/dashboard/transactions/[transactionId]/edit
```

Responsabilidades:
- resolver autenticação e Workspace;
- buscar a transação;
- carregar contas financeiras disponíveis;
- carregar categorias disponíveis;
- preencher o formulário de edição;
- retornar `notFound()` quando a transação não puder ser carregada.

---

# 5. Página principal

Estrutura:

```text
TransactionsPage
│
├── PageHeader
│
├── ResourceSection — Movimentações
│   ├── ErrorState
│   └── TransactionsTable
│       └── EmptyState
│
└── ResourceSection — Nova transação
    ├── ErrorState de contas
    ├── ErrorState de categorias
    └── CreateTransactionForm
```

Título: `Transações`

Descrição: `Registre e acompanhe as receitas e despesas do seu espaço financeiro.`

---

# 6. Visualização das transações

A listagem utiliza tabela em telas compatíveis.

| Campo | Apresentação |
|---|---|
| Descrição | Texto |
| Categoria | Nome da categoria |
| Conta | Nome da conta financeira |
| Valor | Moeda |
| Data | Data localizada |
| Status | Ativa / Cancelada |
| Ações | Editar / Cancelar / Restaurar |

A interface nunca exibe IDs internos, chaves técnicas, timestamps técnicos ou mensagens de banco de dados.

## Valor

Receitas são apresentadas como valores positivos. Despesas são apresentadas visualmente como valores negativos.

A persistência continua armazenando `amount` como valor positivo. O tipo `INCOME` ou `EXPENSE` define a natureza da movimentação.

---

# 7. Status

## Ativa

```text
canceledAt = null
```

Ações disponíveis:
- Editar;
- Cancelar.

## Cancelada

```text
canceledAt != null
```

Ações disponíveis:
- Restaurar.

Uma transação cancelada não oferece ação de edição na tabela. Cancelamento não representa exclusão física.

---

# 8. Empty State

Título:
```text
Nenhuma transação encontrada
```

Descrição:
```text
As receitas e despesas registradas aparecerão aqui.
```

O estado vazio é responsabilidade de `TransactionsTable`.

---

# 9. Loading

Rotas:
```text
/dashboard/transactions/loading.tsx
/dashboard/transactions/[transactionId]/edit/loading.tsx
```

Os estados utilizam `PageHeader`, `ResourceSection` e `LoadingState`. Mensagens técnicas não devem aparecer ao usuário.

---

# 10. Formulário de criação

Componente: `CreateTransactionForm`

| Campo | Tipo visual | Obrigatório |
|---|---|---:|
| Conta financeira | Select | ✔ |
| Tipo | Select | ✔ |
| Categoria | Select | ✔ |
| Descrição | Text | ✔ |
| Valor | Number | ✔ |
| Data e hora | datetime-local | ✔ |
| Observações | Textarea | ✖ |

Tipos:
```text
INCOME  → Receita
EXPENSE → Despesa
```

Valor padrão: `EXPENSE`.

O formulário inicia a data/hora com o horário local corrente.

---

# 11. Dependência entre tipo e categoria

Categorias são filtradas de acordo com o tipo da transação.

```text
EXPENSE → somente categorias EXPENSE
INCOME  → somente categorias INCOME
```

Quando o usuário altera o tipo:
```text
categoryId = ""
```

A categoria anteriormente selecionada é limpa para impedir combinação incompatível entre tipo e categoria.

---

# 12. Dependência de contas e categorias

Uma transação exige conta financeira disponível e categoria compatível com o tipo selecionado.

Quando não existem contas disponíveis:
```text
Cadastre uma conta financeira ativa antes de criar uma transação.
```

Quando não existem categorias para o tipo:
```text
Não há categorias ativas para o tipo selecionado.
```

O botão de submit permanece desabilitado quando essas dependências não estão satisfeitas.

---

# 13. Formulário de edição

Componente: `UpdateTransactionForm`

Valores iniciais:
- conta;
- categoria;
- tipo;
- descrição;
- valor;
- data/hora;
- observações.

Após sucesso:
```text
router.replace("/dashboard/transactions")
router.refresh()
```

A edição é permitida somente para transações ativas.

---

# 14. Foundation de formulários

Componentes compartilhados:
```text
NumberField
SelectField
TextareaField
TextField
```

O campo `datetime-local` permanece como `input` específico.

Os imports utilizam alias `@/`, resolvido também pelo Vitest através da configuração central do projeto.

---

# 15. Cancelamento

Componente: `CancelTransactionButton`

Fluxo:
```text
Usuário clica Cancelar
        ↓
window.confirm
        ↓
Não ─────────→ encerra
        ↓ Sim
estado pending
        ↓
cancelTransactionAction
        ↓
Application
```

Confirmação:
```text
Deseja realmente cancelar esta transação?
```

Durante processamento:
```text
Cancelar → Cancelando...
```

O botão fica desabilitado durante a operação. Em falha, a mensagem é apresentada com `role="alert"`.

---

# 16. Restauração

Componente: `RestoreTransactionButton`

Confirmação:
```text
Deseja realmente restaurar esta transação?
```

Durante processamento:
```text
Restaurar → Restaurando...
```

O botão fica desabilitado enquanto a operação estiver pendente. Em falha, a mensagem é apresentada de forma acessível com `role="alert"`.

---

# 17. Persistência e cancelamento lógico

Transactions não utiliza exclusão física no fluxo atual.

Cancelar:
```text
canceledAt = nova data
```

Restaurar:
```text
canceledAt = null
```

A atualização de uma transação ativa também atualiza `updatedAt`.

---

# 18. Modelo relevante para a interface

```text
Transaction
├── id
├── workspaceId
├── financialAccountId
├── categoryId
├── type
├── description
├── amount
├── occurredAt
├── notes
├── canceledAt
├── createdAt
└── updatedAt
```

Para a tabela, a View também fornece:
```text
categoryName
financialAccountName
```

Esses dados são obtidos no Repository através de joins.

---

# 19. Estados de feedback

## Validation
Erros de schema são exibidos próximos aos respectivos campos.

## Application Error
Falhas retornadas por Server Actions são apresentadas ao usuário sem expor detalhes técnicos.

## Pending
O submit e as ações destrutivas/reversíveis possuem estado de processamento.

## Success — Create
```text
Transação criada com sucesso.
```

Após criação:
- formulário resetado;
- `EXPENSE` volta a ser o tipo padrão;
- campos editáveis são limpos;
- data/hora volta ao valor padrão gerado.

## Success — Update
Após atualização:
- navega para `/dashboard/transactions`;
- executa refresh da rota.

---

# 20. Acessibilidade

- labels associados aos controles;
- IDs únicos gerados por React;
- seleção por nome acessível;
- `aria-invalid` para campos inválidos;
- `role="alert"` para erros relevantes;
- botões desabilitados durante operações pendentes;
- elementos semânticos sempre que possível;
- navegação e submissão utilizáveis por teclado.

---

# 21. Server / Client Boundary

Server Components:
- página principal;
- página de edição;
- loading routes.

Client Components:
- `CreateTransactionForm`;
- `UpdateTransactionForm`;
- `TransactionsTable`;
- `CancelTransactionButton`;
- `RestoreTransactionButton`.

Server Actions:
```text
src/modules/transactions/presentation/
```

Repositories utilizam:
```ts
import "server-only";
```

---

# 22. Testes de Presentation

## CreateTransactionForm
- tipo padrão;
- filtragem de categorias;
- alteração de tipo;
- submit;
- falha;
- sucesso;
- reset.

## UpdateTransactionForm
- carregamento dos valores atuais;
- categorias compatíveis;
- mudança de tipo;
- submit;
- falha;
- navegação após sucesso.

## TransactionsTable
- empty state;
- renderização;
- status ativo;
- status cancelado;
- ação editar;
- ação cancelar;
- ação restaurar;
- formatação monetária.

## CancelTransactionButton
- recusa da confirmação;
- chamada da Server Action;
- erro;
- pending state.

## RestoreTransactionButton
- recusa da confirmação;
- chamada da Server Action;
- erro;
- pending state.

Os testes de Presentation utilizam `jsdom`.

Quando necessário, `server-only` é isolado nos testes para impedir que dependências server-side sejam executadas no ambiente Client de teste.

---

# 23. Infraestrutura de testes

O Vitest possui configuração central para resolver:
```text
@ → ./src
```

A configuração também controla paralelismo entre arquivos e timeout dos testes.

Isso mantém `npm run test` como entrada oficial da suíte.

---

# 24. Quality Gate

```bash
npm run check
npm run typecheck
npm run test
```

Quando houver alteração de banco:
```bash
npm run db:check
```

Quando aplicável:
```bash
npm run build
```

---

# 25. Critérios de aceite atuais

- [x] Listagem implementada
- [x] Empty State implementado
- [x] Loading principal implementado
- [x] Criação implementada
- [x] Edição implementada
- [x] Loading da edição implementado
- [x] Cancelamento implementado
- [x] Restauração implementada
- [x] Feedback de erro implementado
- [x] Estados pending implementados
- [x] Foundation aplicada aos formulários
- [x] Tabela coberta por testes
- [x] Create form coberto por testes
- [x] Update form coberto por testes
- [x] Cancel coberto por testes
- [x] Restore coberto por testes
- [x] Alias do Vitest centralizado
- [x] `check` aprovado
- [x] `typecheck` aprovado
- [x] testes verdes
- [x] documentação da Presentation atualizada

---

# 26. Decisões adiadas

- busca;
- filtros;
- paginação;
- transações recorrentes;
- anexos;
- importação bancária;
- conciliação;
- bulk actions;
- transferência especializada entre contas;
- optimistic updates;
- substituição de `window.confirm` por `ConfirmationDialog`.

---

# 27. Referências

- PRD Transactions
- Regras de Negócio Transactions
- Modelo de Domínio Transactions
- Casos de Uso Transactions
- Schema `transactions`
- `module-ui-spec-template.md`
- Foundation de Components
- Estratégia de testes do projeto
