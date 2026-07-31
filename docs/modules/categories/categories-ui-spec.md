# Categories UI Specification

> **Módulo:** Categories\
> **Sprint:** 5\
> **Status:** EM DESENVOLVIMENTO\
> **Última atualização:** 2026-07-30

# 1. Objetivo

A interface do módulo **Categories** permite ao usuário gerenciar as
categorias financeiras utilizadas pelas transações do Workspace.

Esta interface é exclusivamente administrativa e não exibe métricas,
gráficos ou movimentações financeiras.

## Escopo

### Incluído

-   Listar categorias ativas
-   Criar categoria
-   Editar categoria
-   Arquivar categoria
-   Visualizar categorias arquivadas
-   Restaurar categoria

### Fora do escopo

-   Exclusão física
-   Pesquisa
-   Filtros avançados
-   Paginação
-   Drag-and-drop
-   Importação/exportação
-   Dashboard

------------------------------------------------------------------------

# 2. Permissões

  Operação      OWNER   ADMIN   MEMBER   VIEWER
  ------------ ------- ------- -------- --------
  Visualizar      ✔       ✔       ✔        ✔
  Criar           ✔       ✔       ✖        ✖
  Editar          ✔       ✔       ✖        ✖
  Arquivar        ✔       ✔       ✖        ✖
  Restaurar       ✔       ✔       ✖        ✖

A interface apenas reflete permissões. A autorização definitiva
permanece na camada Application.

------------------------------------------------------------------------

# 3. Fluxo

``` text
Entrar na página
      │
      ▼
Carregar categorias
      │
      ├── Lista vazia → Empty State
      │
      └── Lista preenchida
              │
              ├── Nova categoria
              ├── Editar
              ├── Arquivar
              └── Ver arquivadas → Restaurar
```

------------------------------------------------------------------------

# 4. Estrutura

``` text
presentation/
├── page.tsx
├── components/
│   ├── categories-toolbar.tsx
│   ├── categories-table.tsx
│   ├── categories-empty-state.tsx
│   ├── category-type-badge.tsx
│   ├── category-actions-menu.tsx
│   └── archived-categories-sheet.tsx
├── dialogs/
│   ├── create-category-dialog.tsx
│   ├── update-category-dialog.tsx
│   ├── archive-category-dialog.tsx
│   └── restore-category-dialog.tsx
├── forms/
│   └── category-form.tsx
└── actions/
```

------------------------------------------------------------------------

# 5. Layout

``` text
Categorias
Gerencie as categorias do Workspace.

                           [+ Nova Categoria]

Receitas
-----------------------------------------
Salário
Investimentos

Despesas
-----------------------------------------
Alimentação
Moradia
Transporte

[ Ver Arquivadas ]
```

------------------------------------------------------------------------

# 6. Componentes

## Toolbar

-   título
-   descrição
-   botão "Nova Categoria"

## CategoriesTable

Colunas:

-   Categoria
-   Tipo
-   Ações

## Badge

-   Receita → verde
-   Despesa → vermelho

## Menu de ações

Ativa:

-   Editar
-   Arquivar

Arquivada:

-   Restaurar

------------------------------------------------------------------------

# 7. Formulário

Será utilizado **um único formulário**.

Campos:

  Campo   Tipo      Obrigatório
  ------- -------- -------------
  Nome    Input          ✔
  Tipo    Select         ✔

A diferença entre Create e Update será:

-   defaultValues
-   submitAction
-   título do dialog

------------------------------------------------------------------------

# 8. Dialogs

## Criar

Abre CategoryForm vazio.

## Editar

Abre CategoryForm preenchido.

## Arquivar

Confirmação antes da operação.

## Restaurar

Confirmação antes da operação.

------------------------------------------------------------------------

# 9. Sheet de Arquivadas

Não haverá rota dedicada.

As categorias arquivadas serão exibidas em um Sheet contendo:

-   lista
-   ações de restauração

------------------------------------------------------------------------

# 10. Estados

## Loading

Skeleton.

## Empty

Título:

"Nenhuma categoria cadastrada"

Descrição:

"Categorias ajudam a organizar receitas e despesas."

CTA:

"Criar primeira categoria"

## Error

Mensagem amigável + botão "Tentar novamente".

## Success

Toast e atualização da lista.

------------------------------------------------------------------------

# 11. Server / Client

Fluxo:

``` text
Browser
 ↓
Server Component (page)
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

Nunca acessar Repository diretamente da interface.

------------------------------------------------------------------------

# 12. Atualização

Após mutações:

-   revalidatePath da rota
-   fechamento do dialog
-   atualização visual

------------------------------------------------------------------------

# 13. Responsividade

Desktop: - tabela completa.

Tablet: - redução de espaçamento.

Mobile: - lista empilhada. - dialogs em largura total.

------------------------------------------------------------------------

# 14. Acessibilidade

-   labels associados
-   foco restaurado
-   navegação por teclado
-   aria-label em ações
-   contraste adequado
-   mensagens vinculadas aos campos

------------------------------------------------------------------------

# 15. Testes

## Componentes

-   renderização
-   empty
-   loading
-   erro

## Integração

-   criação
-   edição
-   arquivamento
-   restauração

## E2E

-   fluxo completo
-   permissões
-   atualização da lista

------------------------------------------------------------------------

# 16. Critérios de Aceite

-   [ ] CRUD administrativo funcionando
-   [ ] Permissões respeitadas
-   [ ] Formulário reutilizado
-   [ ] Sheet de arquivadas
-   [ ] Estados completos
-   [ ] Responsivo
-   [ ] Acessível
-   [ ] check aprovado
-   [ ] typecheck aprovado
-   [ ] Testes verdes
-   [ ] Documentação atualizada

------------------------------------------------------------------------

# 17. Referências

-   PRD Categories
-   Regras de Negócio
-   Modelo de Domínio
-   Casos de Uso
-   Modelo de Banco
-   module-ui-spec-template.md
