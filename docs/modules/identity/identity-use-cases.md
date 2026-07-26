# Casos de Uso — Identity

## Sobre este documento

Este documento descreve as principais ações que uma pessoa poderá realizar
dentro do módulo **Identity** do YuFinance.

### O que é um caso de uso?

Um caso de uso descreve uma ação que o sistema precisa executar para atingir
um objetivo do usuário.

Por exemplo:

"Quero entrar no YuFinance."

Essa necessidade será representada pelo caso de uso:

`SignIn`

Tradução: Entrar no sistema.

Um caso de uso não representa uma tela específica.

A mesma ação poderá futuramente ser iniciada por uma página web, aplicativo
mobile ou outra interface.

### Para que este documento serve?

Ele conecta as regras de negócio com a implementação.

Fluxo:

PRD
→ define o que queremos construir

Regras de negócio
→ definem as condições que devem ser respeitadas

Modelo de domínio
→ define os conceitos envolvidos

Casos de uso
→ definem as ações que o sistema executará

Implementação
→ transforma essas definições em código

Testes
→ verificam se o comportamento está correto

---

# 1. Convenção de nomes

Os casos de uso utilizarão nomes em inglês no código.

A estrutura será normalmente:

Verbo + Objeto

Exemplos:

`RegisterUser`
→ Register + User
→ Registrar + Usuário

`UpdateProfile`
→ Update + Profile
→ Atualizar + Perfil

Isso deixa explícita a ação realizada.

Evitaremos nomes genéricos como:

`Process`
`Handler`
`Manager`
`Execute`

quando eles não explicarem claramente a intenção do código.

---

# 2. Casos de uso iniciais

O módulo Identity possuirá inicialmente:

1. RegisterUser
2. SignIn
3. SignOut
4. GetCurrentUser
5. UpdateProfile
6. RequestPasswordReset
7. ResetPassword

Cada caso de uso possui uma responsabilidade específica.

---

# 3. ID-UC-001 — RegisterUser

## Tradução

Registrar usuário.

## Por que esse nome?

`Register`
significa registrar ou cadastrar.

`User`
significa usuário.

Preferimos `RegisterUser` em vez de `CreateUser` porque estamos descrevendo
um processo de cadastro de uma nova identidade no produto, e não apenas
uma operação técnica de criação de registro no banco.

## Objetivo

Permitir que uma nova pessoa crie uma identidade no YuFinance.

## Ator

Visitante não autenticado.

## Entrada

- nome;
- e-mail;
- senha;
- confirmação da senha.

## Fluxo principal

Visitante
→ informa os dados
→ dados são validados
→ senha e confirmação são comparadas
→ solicitação é enviada ao serviço de autenticação
→ usuário é registrado
→ resultado é retornado

## Resultado esperado

Uma nova identidade válida é criada.

## Possíveis falhas

- dados inválidos;
- senha e confirmação diferentes;
- e-mail já registrado;
- falha do serviço de autenticação;
- erro interno inesperado.

## Comportamento atual após cadastro

Na configuração atual do Better Auth, o cadastro por e-mail e senha
cria automaticamente uma sessão autenticada.

Fluxo observado:

RegisterUser
→ User criado
→ Account criada
→ Session criada
→ usuário autenticado

O e-mail permanece inicialmente com:

`emailVerified = false`

A verificação de e-mail será implementada em etapa posterior.

## Estado da implementação

Status: Concluído ✅

Implementado com:

- validação Zod;
- React Hook Form;
- Better Auth;
- PostgreSQL / Neon;
- tratamento de erros;
- sessão automática após cadastro;
- testes de schema;
- testes da aplicação;
- testes da interface.

Comportamento validado:

RegisterUser
→ User criado
→ Account criada
→ Session criada
→ usuário autenticado

O e-mail permanece inicialmente com:

`emailVerified = false`

## Regras relacionadas

- ID-RN-001
- ID-RN-002
- ID-RN-003
- ID-RN-004
- ID-RN-005
- ID-RN-023
- ID-RN-024
- ID-RN-025

---

# 4. ID-UC-002 — SignIn

## Tradução

Entrar no sistema.

## Por que esse nome?

`Sign In` é um termo utilizado para representar o ato de iniciar uma
sessão autenticada.

Preferimos `SignIn` a um nome genérico como `LoginUser` porque ele se
mantém alinhado ao vocabulário utilizado pela solução de autenticação.

## Objetivo

Autenticar uma identidade existente utilizando e-mail e senha.

## Ator

Visitante não autenticado.

## Entrada

- e-mail;
- senha.

## Fluxo principal

Visitante
→ informa e-mail e senha
→ credenciais são enviadas para autenticação
→ Better Auth valida as credenciais
→ sessão é criada
→ usuário passa a estar autenticado

## Resultado esperado

Uma sessão válida é estabelecida.

## Possíveis falhas

- formato de e-mail inválido;
- credenciais inválidas;
- falha no serviço de autenticação;
- erro interno.

## Regras relacionadas

- ID-RN-006
- ID-RN-007
- ID-RN-008
- ID-RN-009
- ID-RN-023
- ID-RN-024
- ID-RN-025

---

# 5. ID-UC-003 — SignOut

## Tradução

Sair do sistema ou encerrar sessão.

## Objetivo

Encerrar a sessão autenticada atual.

## Ator

Usuário autenticado.

## Entrada

Não necessita de dados de negócio adicionais.

A sessão atual fornece o contexto necessário.

## Fluxo principal

Usuário
→ solicita logout
→ sessão atual é encerrada
→ recursos protegidos deixam de estar acessíveis
→ usuário é direcionado para área pública

## Resultado esperado

A sessão atual deixa de permitir acesso autenticado.

## Regras relacionadas

- ID-RN-010
- ID-RN-011

---

# 6. ID-UC-004 — GetCurrentUser

## Tradução

Obter usuário atual.

## Por que esse nome?

`Get`
significa obter.

`Current`
significa atual.

`User`
significa usuário.

O nome descreve que queremos descobrir qual usuário corresponde à sessão
que está realizando a operação.

## Objetivo

Obter a identidade do usuário associado à sessão atual.

## Ator

Usuário autenticado ou componente do sistema que precisa verificar
autenticação.

## Entrada

Sessão atual.

## Fluxo principal

Requisição
→ sessão é verificada
→ identidade correspondente é localizada
→ dados permitidos do usuário são retornados

## Resultado esperado

O sistema conhece o usuário autenticado.

## Possíveis resultados

Sessão válida
→ User

Sessão inexistente ou inválida
→ usuário não autenticado

## Regras relacionadas

- ID-RN-008
- ID-RN-009
- ID-RN-013

---

# 7. ID-UC-005 — UpdateProfile

## Tradução

Atualizar perfil.

## Objetivo

Permitir que o usuário altere informações básicas permitidas de sua
identidade.

## Ator

Usuário autenticado.

## Entrada inicial

- nome;
- imagem, quando suportada.

A alteração de e-mail não fará parte deste caso de uso inicial porque
é uma operação sensível de identidade.

## Fluxo principal

Usuário autenticado
→ informa novos dados
→ sistema valida os dados
→ identidade é atualizada
→ dados atualizados são retornados

## Resultado esperado

As informações permitidas do perfil são atualizadas.

## O que não pode ser alterado por este caso de uso?

- user.id;
- senha;
- papel dentro do Workspace;
- dados financeiros;
- e-mail por edição simples.

## Regras relacionadas

- ID-RN-012
- ID-RN-013
- ID-RN-014
- ID-RN-015
- ID-RN-023
- ID-RN-025

---

# 8. ID-UC-006 — RequestPasswordReset

## Tradução

Solicitar redefinição de senha.

## Por que esse nome?

`Request`
significa solicitar.

`Password`
significa senha.

`Reset`
significa redefinir.

Este caso de uso inicia o processo, mas não altera a senha diretamente.

Por isso ele é separado de `ResetPassword`.

## Objetivo

Permitir que uma pessoa inicie o processo de recuperação de acesso à conta.

## Ator

Pessoa sem acesso à senha atual.

## Entrada

- e-mail.

## Fluxo principal

Pessoa
→ informa o e-mail
→ sistema valida o formato
→ solicita o processo de recuperação
→ resposta neutra é apresentada

## Resultado esperado

Quando aplicável, um mecanismo temporário de recuperação é iniciado.

## Segurança

A resposta não deverá confirmar desnecessariamente se o e-mail existe.

## Regras relacionadas

- ID-RN-017
- ID-RN-018
- ID-RN-019
- ID-RN-023
- ID-RN-024
- ID-RN-025

---

# 9. ID-UC-007 — ResetPassword

## Tradução

Redefinir senha.

## Objetivo

Permitir a definição de uma nova senha após uma solicitação válida de
recuperação.

## Ator

Pessoa que possui um mecanismo válido de recuperação.

## Entrada conceitual

- mecanismo de recuperação válido;
- nova senha;
- confirmação da nova senha.

A estrutura técnica exata será definida de acordo com a integração
oficial do Better Auth.

## Fluxo principal

Pessoa
→ acessa mecanismo de recuperação
→ validade é verificada
→ informa nova senha
→ confirmação é validada
→ senha é redefinida
→ mecanismo utilizado deixa de ser reutilizável conforme a política adotada

## Resultado esperado

A credencial passa a utilizar a nova senha.

## Possíveis falhas

- mecanismo inválido;
- mecanismo expirado;
- senha inválida;
- confirmação diferente;
- falha interna.

## Regras relacionadas

- ID-RN-004
- ID-RN-005
- ID-RN-018
- ID-RN-019
- ID-RN-023
- ID-RN-024
- ID-RN-025

---

# 10. O que não é um caso de uso do Identity?

Algumas ações envolvem um User, mas pertencem a outros módulos.

Exemplos:

`CreateWorkspace`
→ criar Workspace

`InviteWorkspaceMember`
→ convidar membro

`ChangeMemberRole`
→ alterar papel de um membro

`CreateFinancialAccount`
→ criar conta financeira

Essas ações não pertencem ao Identity.

O simples fato de uma operação envolver um usuário não significa que
ela pertence ao módulo Identity.

---

# 11. Relação com Workspace

Depois da autenticação, o fluxo geral do produto será aproximadamente:

User
→ Authentication
→ Session
→ Workspace
→ Authorization
→ Finance

Em português:

Usuário
→ Autenticação
→ Sessão
→ Espaço de trabalho
→ Autorização
→ Domínio financeiro

Identity termina sua responsabilidade principal quando sabemos com
segurança quem está realizando a operação.

Workspace e Authorization determinam o que essa pessoa pode acessar.

---

# 12. Rastreabilidade

Cada caso de uso deverá ser associado às regras de negócio relevantes.

Exemplo:

ID-RN-002
E-mail deve ser único

        ↓

ID-UC-001
RegisterUser

        ↓

Teste
Não permite cadastro com e-mail já registrado

Isso permite descobrir por que determinado teste ou comportamento existe.

---

# 13. Casos de uso futuros

Poderão ser adicionados posteriormente:

`ChangeEmail`
→ Alterar e-mail

`ChangePassword`
→ Alterar senha estando autenticado

`VerifyEmail`
→ Verificar e-mail

`DeleteUser`
→ Excluir usuário

`ListSessions`
→ Listar sessões

`RevokeSession`
→ Revogar uma sessão

Eles não fazem parte da implementação inicial até que suas regras sejam
formalmente definidas.

---

# 14. Critério para criação de novos casos de uso

Não criaremos um caso de uso apenas porque existe um botão na interface.

Um novo caso de uso deverá representar uma ação relevante da aplicação
ou do domínio.

A interface chama os casos de uso.

Os casos de uso não devem depender da existência de uma tela específica.

Esse princípio permite reutilizar a lógica em diferentes interfaces.