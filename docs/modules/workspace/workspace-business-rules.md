# Regras de Negócio — Workspace

## Sobre este documento

Este documento registra as regras que o módulo **Workspace** do YuFinance
deve obrigatoriamente respeitar.

### O que são regras de negócio?

Regras de negócio são condições que determinam como o sistema deve se
comportar.

Elas existem independentemente da tecnologia utilizada.

Por exemplo:

> O mesmo usuário não pode ser adicionado duas vezes ao mesmo Workspace.

Essa regra deve continuar válida mesmo que futuramente troquemos:

- banco de dados;
- framework;
- biblioteca;
- interface;
- forma de autenticação.

### Para que este documento serve?

Ele funciona como uma referência para:

- implementação;
- testes;
- revisão de código;
- análise de bugs;
- autorização;
- evolução do produto;
- decisões futuras sobre o módulo Workspace.

Se uma implementação contrariar uma regra deste documento, devemos:

1. corrigir a implementação; ou
2. revisar formalmente a regra.

### Quando consultar este documento?

Consulte estas regras antes de:

- criar ou alterar Workspaces;
- trabalhar com membros;
- implementar papéis e permissões;
- criar onboarding;
- implementar compartilhamento;
- implementar seleção de Workspace;
- criar funcionalidades financeiras relacionadas a Workspace.

---

# 1. O que é um Workspace?

## Nome técnico

`Workspace`

## Tradução

**Espaço de trabalho**.

## Significado no YuFinance

Um Workspace representa um ambiente financeiro separado.

Ele funciona como uma área independente dentro do produto.

Exemplo:

Kennedy

→ Finanças Pessoais  
→ Família  
→ Empresa

Cada Workspace poderá possuir seus próprios:

- membros;
- contas financeiras;
- categorias;
- transações;
- transferências;
- configurações;
- relatórios;
- dashboard.

---

# 2. Por que usamos o nome Workspace?

Poderíamos utilizar termos como:

`Organization`

`Account`

`Space`

Mas `Workspace` representa melhor um ambiente no qual uma ou mais pessoas
podem trabalhar com os mesmos dados.

Além disso, evita conflitos de significado.

Por exemplo:

`Account`

no Better Auth
→ conta de autenticação

`FinancialAccount`

no domínio financeiro
→ conta financeira

`Workspace`

→ ambiente onde esses dados financeiros existem

Por isso, `Workspace` será o termo oficial do domínio YuFinance.

---

# 3. Vocabulário do módulo

## Workspace

Tradução:

Espaço de trabalho.

Representa o ambiente financeiro.

---

## WorkspaceMember

Tradução:

Membro do espaço de trabalho.

Representa o vínculo entre:

User
+
Workspace

Ou seja:

um usuário participa de um Workspace por meio de um WorkspaceMember.

---

## Role

Tradução:

Papel, função ou nível de participação.

Representa a posição daquele membro dentro de um Workspace.

Valores atuais:

OWNER
ADMIN
MEMBER
VIEWER

---

## WorkspaceSettings

Tradução:

Configurações do espaço de trabalho.

Representa preferências e parâmetros daquele Workspace.

Exemplos:

- idioma/região;
- tema;
- início da semana;
- exibição de centavos.

---

## currentUser

Tradução:

Usuário atual.

Representa o User associado à sessão autenticada que está executando
determinada operação.

---

# 4. WS-RN-001 — Todo dado financeiro pertence a um Workspace

Nenhum dado financeiro do YuFinance deverá existir de maneira isolada.

Contas financeiras, categorias, transações, transferências e demais
informações financeiras deverão estar associadas a um Workspace.

Fluxo conceitual:

User
→ Workspace
→ Dados financeiros

Essa regra é fundamental para o isolamento dos dados.

---

# 5. WS-RN-002 — Um User pode participar de vários Workspaces

Uma mesma identidade poderá participar de vários ambientes financeiros.

Exemplo:

Kennedy

→ Workspace Pessoal  
→ Workspace Família  
→ Workspace Empresa

O usuário não deverá precisar criar várias contas no YuFinance para isso.

---

# 6. WS-RN-003 — Um Workspace pode possuir vários membros

Um Workspace poderá ser compartilhado com várias pessoas.

A relação deverá ser representada por:

`WorkspaceMember`

Isso permite:

Workspace
→ vários Users

User
→ vários Workspaces

---

# 7. WS-RN-004 — Um vínculo de membro não pode ser duplicado

O mesmo User não poderá possuir dois vínculos com o mesmo Workspace.

A combinação:

`workspaceId + userId`

deverá ser única.

Tradução:

`workspaceId`
→ identificador do Workspace

`userId`
→ identificador do User

Essa regra já é protegida pela chave primária composta da tabela:

`workspace_members`

---

# 8. WS-RN-005 — Todo membro deve possuir um Role

Todo WorkspaceMember deverá possuir um papel.

Valores atuais:

`OWNER`
→ proprietário

`ADMIN`
→ administrador

`MEMBER`
→ membro

`VIEWER`
→ visualizador

As permissões exatas de cada Role serão documentadas antes da implementação
da camada de autorização.

---

# 9. WS-RN-006 — O criador do primeiro Workspace será OWNER

No onboarding inicial, o User autenticado que criar o Workspace deverá ser
automaticamente associado a ele como:

`OWNER`

Fluxo:

User
→ cria Workspace
→ WorkspaceMember é criado
→ role = OWNER

A interface não deverá pedir ao usuário que escolha seu próprio Role
durante esse fluxo.

---

# 10. WS-RN-007 — A criação inicial exige usuário autenticado

Um visitante anônimo não poderá criar o primeiro Workspace.

Antes da operação, o sistema deverá conhecer:

`currentUser`

Fluxo:

Session válida
→ User identificado
→ criação permitida

Sem sessão válida:

→ operação rejeitada  
→ nenhum dado deverá ser gravado

---

# 11. WS-RN-008 — Nome do Workspace é obrigatório

Todo Workspace deverá possuir um nome.

No MVP:

- mínimo de 2 caracteres;
- máximo de 120 caracteres;
- espaços desnecessários no início e no final deverão ser removidos.

Exemplos válidos:

"Minhas Finanças"

"Família Lopes"

"Empresa"

Exemplos inválidos:

""

"K"

"   "

---

# 12. WS-RN-009 — Todo Workspace possui um tipo

Os tipos atualmente aceitos são:

`PERSONAL`
→ Pessoal

`COUPLE`
→ Casal

`FAMILY`
→ Família

O valor padrão será:

`PERSONAL`

caso outro tipo válido não seja informado.

Valores não reconhecidos deverão ser rejeitados.

---

# 13. WS-RN-010 — WorkspaceSettings devem ser criadas junto com o Workspace inicial

No onboarding, um Workspace não deverá ficar sem suas configurações básicas.

Ao criar o primeiro Workspace, também deverão ser criadas suas:

`WorkspaceSettings`

Isso evita um estado parcialmente configurado.

---

# 14. WS-RN-011 — Configurações padrão iniciais

Durante o onboarding, utilizaremos inicialmente:

`currency`
→ BRL

`timezone`
→ America/Sao_Paulo

`locale`
→ pt-BR

`theme`
→ SYSTEM

`weekStartsOn`
→ MONDAY

`showCents`
→ true

Traduções:

`currency`
→ moeda

`timezone`
→ fuso horário

`locale`
→ idioma/região

`theme`
→ tema

`weekStartsOn`
→ dia em que a semana começa

`showCents`
→ mostrar centavos

Esses valores poderão ser editados posteriormente conforme as funcionalidades
de configurações forem implementadas.

---

# 15. WS-RN-012 — A criação inicial deve ser consistente

A criação inicial envolve três partes obrigatórias:

1. Workspace
2. WorkspaceMember
3. WorkspaceSettings

O onboarding não será considerado concluído se apenas uma parte for criada.

Estado correto:

Workspace
→ criado

WorkspaceMember
→ criado
→ role = OWNER

WorkspaceSettings
→ criado

Estado incorreto:

Workspace criado
→ membro ausente
→ settings ausentes

ou:

Workspace criado
→ membro criado
→ settings ausentes

---

# 16. WS-RN-013 — A criação inicial deve ser atômica sempre que possível

A operação deverá ser executada como uma única unidade de persistência.

Preferencialmente:

BEGIN
→ cria Workspace
→ cria WorkspaceMember
→ cria WorkspaceSettings
→ COMMIT

Se alguma etapa falhar:

ROLLBACK

Tradução:

`COMMIT`
→ confirmar todas as alterações

`ROLLBACK`
→ desfazer as alterações

Isso evita dados parcialmente criados.

---

# 17. WS-RN-014 — WorkspaceSettings são únicas por Workspace

Cada Workspace deverá possuir no máximo um conjunto de configurações.

Relação:

Workspace
1
↕
1
WorkspaceSettings

Essa regra já é reforçada por:

`workspace_settings.workspace_id`

como chave primária.

---

# 18. WS-RN-015 — A participação não deve ser representada por ownerId direto

O Workspace não deverá depender de um campo como:

`ownerId`

como única forma de representar quem participa dele.

A relação oficial será:

User
→ WorkspaceMember
→ Workspace

Isso permite vários membros e papéis diferentes.

---

# 19. WS-RN-016 — OWNER é contextual ao Workspace

Um User não é globalmente OWNER.

Ele pode possuir papéis diferentes em ambientes distintos.

Exemplo:

Kennedy

Workspace Pessoal
→ OWNER

Workspace Empresa
→ MEMBER

Portanto, não devemos verificar autorização apenas olhando o User.

Precisamos considerar:

User
+
Workspace
+
WorkspaceMember
+
Role

---

# 20. WS-RN-017 — O onboarding inicial não pode duplicar Workspace

Se o usuário já possuir um Workspace válido, o sistema não deverá criar
outro Workspace inicial apenas porque `/onboarding` foi acessado novamente.

Exemplo:

User sem Workspace
→ onboarding permitido

User com Workspace
→ criação inicial não permitida

A estratégia técnica poderá evoluir, mas a regra deve permanecer.

---

# 21. WS-RN-018 — A proteção contra onboarding duplicado deve existir no servidor

A interface poderá esconder o onboarding quando ele não for necessário.

Porém isso não é suficiente.

A operação de criação deverá validar no servidor se o User já possui
um Workspace.

Não devemos confiar apenas em:

- estado React;
- rota;
- botão;
- validação do navegador.

Esses elementos podem ser contornados.

---

# 22. WS-RN-019 — Validação não substitui autorização

Dados válidos não significam que a operação é permitida.

Exemplo:

um nome válido de Workspace não é suficiente para autorizar a criação.

O sistema também deve verificar:

- sessão válida;
- User identificado;
- estado do onboarding;
- regras de participação.

Validação responde:

"Os dados estão corretos?"

Autorização responde:

"O usuário pode fazer isso?"

---

# 23. WS-RN-020 — Operações críticas devem ser validadas no servidor

Ações relacionadas a:

- criação;
- remoção;
- mudança de Role;
- convite;
- remoção de membro;
- alterações estruturais;

não deverão depender exclusivamente da interface.

A decisão final deverá ocorrer no servidor.

---

# 24. WS-RN-021 — Um User não pode acessar dados de Workspace sem Membership válida

A autenticação do User não dá acesso automático a todos os Workspaces.

Fluxo incorreto:

User autenticado
→ acessa qualquer Workspace

Fluxo correto:

User autenticado
→ WorkspaceMember encontrado
→ Role avaliado
→ acesso permitido ou rejeitado

Essa regra será fundamental para o multi-tenancy do YuFinance.

---

# 25. WS-RN-022 — O Workspace atual deve ser contextual

Quando um User possuir vários Workspaces, o sistema precisará saber em qual
deles a operação atual está acontecendo.

Esse conceito poderá ser chamado de:

`currentWorkspace`

Tradução:

Workspace atual.

O mecanismo técnico para armazenar ou selecionar esse contexto será definido
em etapa posterior.

---

# 26. WS-RN-023 — Trocar de Workspace não altera a identidade do User

Ao mudar de Workspace:

User
→ continua sendo o mesmo

O que muda é:

Workspace atual
→ Membership
→ Role
→ dados acessíveis

Essa separação deverá ser preservada.

---

# 27. WS-RN-024 — Um Role pertence ao vínculo, não ao User

O Role deverá existir no WorkspaceMember.

Não no User global.

Correto:

WorkspaceMember.role

Incorreto:

User.role

Isso porque o papel varia conforme o Workspace.

---

# 28. WS-RN-025 — Alteração de Role deve respeitar autorização

Nem todo membro poderá alterar papéis de outros membros.

As permissões específicas serão definidas posteriormente.

Entretanto, qualquer mudança de Role deverá:

- exigir usuário autenticado;
- verificar Membership;
- verificar permissão;
- ocorrer no servidor;
- manter pelo menos a integridade necessária do Workspace.

---

# 29. WS-RN-026 — A remoção de membros deverá preservar a consistência do Workspace

A remoção de um WorkspaceMember não poderá deixar o ambiente em um estado
inválido.

Por exemplo, futuramente precisaremos definir:

- se o último OWNER pode sair;
- quem pode remover outro OWNER;
- como transferir responsabilidade;
- o que acontece com dados criados pelo membro removido.

Essas regras serão detalhadas antes da funcionalidade de remoção ser
implementada.

---

# 30. WS-RN-027 — Exclusão de Workspace é uma operação crítica

A exclusão de um Workspace não deverá ser tratada como uma operação simples.

Ela pode afetar:

- membros;
- configurações;
- contas financeiras;
- categorias;
- transações;
- transferências;
- relatórios.

Por isso, antes de implementar exclusão definitiva, será criada uma política
específica de exclusão ou arquivamento.

---

# 31. WS-RN-028 — Arquivamento poderá ser preferido à exclusão definitiva

O YuFinance poderá adotar futuramente:

`archivedAt`

ou conceito equivalente.

Tradução:

arquivado em.

Isso permitiria remover um Workspace do uso normal sem destruir imediatamente
todo o histórico.

Essa decisão ainda não está implementada.

---

# 32. WS-RN-029 — O módulo Workspace não controla autenticação

Workspace não é responsável por:

- senha;
- login;
- sessão;
- recuperação de senha.

Essas responsabilidades pertencem ao módulo:

Identity

Workspace recebe uma identidade já autenticada e aplica suas regras contextuais.

---

# 33. WS-RN-030 — O módulo Workspace não controla regras financeiras específicas

Workspace define o ambiente onde os dados existem.

Porém não deverá assumir regras próprias de:

- cálculo de saldo;
- pagamento;
- recebimento;
- transferência;
- parcelamento;
- vencimento;
- relatórios.

Essas regras pertencem aos módulos financeiros.

---

# 34. Responsabilidades do módulo Workspace

O módulo Workspace será responsável por:

- criação de Workspace;
- onboarding inicial;
- Membership;
- Roles;
- configurações;
- seleção de Workspace atual;
- participação de usuários;
- regras contextuais de acesso;
- preparação do ambiente para os dados financeiros.

---

# 35. Fora da responsabilidade do módulo

Workspace não será responsável diretamente por:

- autenticação;
- senha;
- sessões;
- contas financeiras;
- categorias;
- transações;
- transferências;
- dashboard financeiro;
- relatórios;
- cálculo de saldo.

---

# 36. Resumo conceitual

Identity responde:

"Quem é o usuário?"

Workspace responde:

"Em qual ambiente ele está?"

Membership responde:

"Qual é a relação dele com esse ambiente?"

Role responde:

"O que ele pode fazer nesse ambiente?"

WorkspaceSettings responde:

"Como esse ambiente está configurado?"

Finance responde:

"Quais dados e operações financeiras existem nesse ambiente?"
## Checkpoint de implementação — 2026-07-27

**Status: IMPLEMENTADO E VALIDADO para o Workspace inicial.**

Foram validadas em código e no Neon as regras de criação do Workspace, Membership inicial `OWNER`, Settings padrão, isolamento pela associação de Membership e bloqueio de onboarding duplicado.

A navegação também está protegida no servidor:

```text
sem sessão → /login
sessão sem Membership → /onboarding
sessão com Membership → /dashboard
```

Importante: o Membership encontrado hoje serve para determinar o estado de entrada. Suporte completo a múltiplos Workspaces e seleção explícita do Workspace atual permanecem evoluções futuras.
