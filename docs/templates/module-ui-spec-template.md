# Template de Especificação de Interface de Módulo

> **Objetivo**
>
> Este documento é o template oficial para especificação da camada
> **Presentation** do YuFinance. Todo novo módulo deve possuir uma
> especificação de interface antes do início da implementação.

------------------------------------------------------------------------

# 1. Informações Gerais

  Campo                Valor
  -------------------- ------------
  Módulo               
  Sprint               
  Status               PROPOSTO
  Rota principal       
  Última atualização   AAAA-MM-DD

------------------------------------------------------------------------

# 2. Objetivo

Descreva o propósito da interface.

**Permite ao usuário:**

-   ...
-   ...
-   ...

**Não faz parte do escopo:**

-   ...
-   ...
-   ...

------------------------------------------------------------------------

# 3. Usuários e Permissões

  Operação      OWNER   ADMIN   MEMBER   VIEWER
  ------------ ------- ------- -------- --------
  Visualizar      ✔       ✔       ✔        ✔
  Criar           ✔       ✔       ✖        ✖
  Editar          ✔       ✔       ✖        ✖
  Arquivar        ✔       ✔       ✖        ✖
  Restaurar       ✔       ✔       ✖        ✖

> A UI pode ocultar ações, porém a autorização oficial permanece na
> camada Application/Server.

------------------------------------------------------------------------

# 4. Fluxo Arquitetural

``` text
Browser
    ↓
Server Component (Page)
    ↓
Client Components
    ↓
Server Action
    ↓
Application
    ↓
Repository
    ↓
Database
```

**Nunca acessar Repository diretamente da interface.**

------------------------------------------------------------------------

# 5. Estrutura da Página

``` text
Page
├── Header
├── Toolbar
├── Content
│   ├── Loading
│   ├── Error
│   ├── Empty
│   └── Data
└── Dialogs / Sheets
```

------------------------------------------------------------------------

# 6. Header

## Título

...

## Descrição

...

## CTA principal

-   Label:
-   Ícone:
-   Permissão:
-   Ação:

------------------------------------------------------------------------

# 7. Visualização dos Dados

## Tipo

-   Lista
-   Tabela
-   Cards
-   Agrupado

## Campos

  Campo   Tipo   Observação
  ------- ------ ------------
                 
                 

Nunca exibir:

-   IDs
-   Chaves internas
-   Informações técnicas

------------------------------------------------------------------------

# 8. Ordenação

Definir:

-   padrão
-   secundária
-   agrupamentos

------------------------------------------------------------------------

# 9. Ações

  Ação        Condição   Resultado
  ----------- ---------- -----------
  Criar                  
  Editar                 
  Arquivar               
  Restaurar              

------------------------------------------------------------------------

# 10. Formulários

## Campos

  Campo   Tipo    Obrigatório  Validação
  ------- ------ ------------- -----------
                               

## Reutilização

Sempre preferir **um único formulário** quando Create e Update possuem
os mesmos campos.

Configurar apenas:

-   defaultValues
-   submitAction
-   labels

Evitar duplicação de código.

------------------------------------------------------------------------

# 11. Dialogs / Sheets

Para cada container documentar:

-   Objetivo
-   Forma de abertura
-   Forma de fechamento
-   Confirmação
-   Feedback
-   Atualização dos dados

------------------------------------------------------------------------

# 12. Estados da Interface

## Loading

Descrever Skeleton e bloqueios.

## Empty

-   Ícone
-   Título
-   Descrição
-   CTA

## Error

-   Mensagem
-   Retry

## Success

-   Feedback
-   Atualização
-   Fechamento

------------------------------------------------------------------------

# 13. Feedback

Definir:

-   sucesso
-   erro
-   validação
-   loading

Mensagens técnicas não devem ser exibidas ao usuário.

------------------------------------------------------------------------

# 14. Acessibilidade

Checklist mínimo:

-   labels associados
-   navegação por teclado
-   foco restaurado
-   aria adequados
-   contraste
-   foco visível
-   dialogs acessíveis
-   mensagens de erro vinculadas ao campo

------------------------------------------------------------------------

# 15. Responsividade

## Desktop

...

## Tablet

...

## Mobile

Definir comportamento específico.

------------------------------------------------------------------------

# 16. Componentes

``` text
presentation/
├── page.tsx
├── components/
├── dialogs/
├── forms/
└── actions/
```

  Componente   Tipo            Responsabilidade
  ------------ --------------- ------------------
               Server/Client   

Evitar transformar toda a página em Client Component.

------------------------------------------------------------------------

# 17. Atualização dos Dados

Definir estratégia:

-   revalidatePath
-   revalidateTag
-   optimistic update
-   refresh

Registrar a decisão adotada.

------------------------------------------------------------------------

# 18. Testes

## Unitários

-   renderização
-   estados
-   permissões

## Integração

-   formulário
-   server action
-   atualização

## E2E

-   fluxo feliz
-   erro
-   permissão

------------------------------------------------------------------------

# 19. Critérios de Aceite

-   [ ] Escopo implementado
-   [ ] Permissões respeitadas
-   [ ] Estados completos
-   [ ] Responsivo
-   [ ] Acessível
-   [ ] Testes verdes
-   [ ] check aprovado
-   [ ] typecheck aprovado
-   [ ] Documentação atualizada

------------------------------------------------------------------------

# 20. Decisões Adiadas

Registrar funcionalidades propositalmente fora do escopo.

------------------------------------------------------------------------

# 21. Referências

-   PRD
-   Regras de negócio
-   Modelo de domínio
-   Casos de uso
-   Banco
-   Estratégia de testes
-   ADRs (somente existentes)

------------------------------------------------------------------------

# Convenções Oficiais do YuFinance

## Obrigatório

-   Documentação antes da implementação.
-   Server Actions na camada `presentation`.
-   Repository com `import "server-only";`.
-   Nunca presumir caminhos ou imports.
-   Não duplicar formulários quando a diferença for apenas a ação e os
    valores iniciais.
-   Separar responsabilidades entre Server e Client Components.
-   Registrar explicitamente o que está fora do escopo.

## Erros conhecidos que este template evita

-   Referenciar ADR inexistente.
-   Marcar documentação como "proposta" após implementação.
-   Fixar quantidade de testes em documentação.
-   Acessar banco diretamente da interface.
-   Criar abstrações prematuras.
-   Ignorar estados de loading, empty, error e success.
