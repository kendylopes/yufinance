# PRD — Módulo Identity

## Sobre este documento

Este documento define o que o módulo **Identity** do YuFinance precisa oferecer,
quais problemas ele resolve e quais funcionalidades fazem parte desta etapa.

**PRD** significa *Product Requirements Document*, ou **Documento de Requisitos
do Produto**.

No YuFinance, usamos um PRD para definir uma funcionalidade antes de começar
a implementá-la.

Consulte este documento antes de criar ou alterar funcionalidades relacionadas
a cadastro, autenticação, perfil e identidade do usuário.

---

# 1. O que significa Identity?

**Identity** significa **Identidade**.

No YuFinance, esse nome representa a parte do sistema responsável por reconhecer
quem é o usuário.

Isso inclui:

- cadastro;
- login;
- logout;
- sessão;
- recuperação de senha;
- dados básicos do perfil.

Usamos o nome `identity` porque autenticação é apenas uma parte do problema.

`auth`, abreviação de *authentication*, significaria principalmente
**autenticação**.

`identity` representa um conceito mais amplo:

Identity
→ quem é o usuário

Authentication
→ como comprovamos que ele é quem diz ser

Authorization
→ o que ele pode fazer

---

# 2. Objetivo

Permitir que uma pessoa crie sua identidade no YuFinance e acesse o sistema
de maneira segura.

Depois de autenticado, o usuário poderá participar de um ou mais Workspaces.

---

# 3. Problema que estamos resolvendo

O YuFinance precisa saber quem está utilizando o sistema antes de permitir
acesso aos dados financeiros.

Sem uma identidade não podemos determinar:

- quem criou determinado dado;
- quais Workspaces o usuário pode acessar;
- quais permissões ele possui;
- quais informações pertencem a ele;
- quais sessões estão autenticadas.

O módulo Identity estabelece essa base.

---

# 4. Usuário

A principal entidade deste módulo é:

`User`

Tradução: **Usuário**.

`User` representa uma pessoa que possui uma identidade registrada no YuFinance.

Neste momento seus principais dados são:

- identificador;
- nome;
- e-mail;
- estado de verificação do e-mail;
- imagem;
- data de criação;
- data de atualização.

A persistência dessa entidade é atualmente administrada pelo Better Auth.

---

# 5. Objetivos funcionais

O módulo deverá permitir:

1. Criar uma conta.
2. Entrar utilizando e-mail e senha.
3. Encerrar a sessão.
4. Identificar o usuário autenticado.
5. Manter uma sessão segura.
6. Atualizar informações básicas do perfil.
7. Solicitar recuperação de senha.
8. Redefinir a senha de maneira segura.

---

# 6. Cadastro

O usuário deverá informar inicialmente:

- nome;
- e-mail;
- senha;
- confirmação da senha.

O sistema deverá:

- validar os dados;
- impedir e-mails duplicados;
- proteger a senha;
- criar o usuário;
- tratar erros de cadastro;
- retornar uma resposta adequada ao usuário.

Detalhes técnicos da autenticação continuam sendo responsabilidade do
Better Auth.

---

# 7. Login

O usuário deverá conseguir entrar utilizando:

- e-mail;
- senha.

Quando as credenciais forem válidas:

- uma sessão deverá ser criada;
- o usuário será considerado autenticado;
- o sistema poderá determinar quais Workspaces ele pode acessar.

Credenciais inválidas não deverão revelar informações sensíveis sobre a conta.

---

# 8. Logout

O usuário autenticado deverá conseguir encerrar sua sessão.

Após o logout, recursos protegidos não poderão continuar acessíveis por meio
da sessão encerrada.

---

# 9. Perfil

O MVP permitirá manter informações básicas do usuário.

Inicialmente:

- nome;
- e-mail;
- imagem de perfil.

Informações financeiras não pertencem ao perfil.

Elas pertencem ao Workspace.

---

# 10. Recuperação de senha

O sistema deverá possuir um fluxo seguro para recuperação de senha.

Fluxo esperado:

Usuário esqueceu a senha
→ informa o e-mail
→ sistema inicia recuperação
→ usuário recebe mecanismo de recuperação
→ define nova senha
→ credencial é atualizada

A implementação específica será definida durante a integração do Better Auth.

---

# 11. Relação entre User e Workspace

Um conceito fundamental do YuFinance é separar:

User
→ identidade da pessoa

Workspace
→ ambiente financeiro

Um usuário poderá participar de vários Workspaces.

Um Workspace poderá possuir vários usuários.

A associação será representada por:

`workspaceMembers`

Tradução: **membros do espaço de trabalho**.

Essa associação também determina o papel do usuário dentro daquele Workspace.

---

# 12. Autenticação x autorização

Esses conceitos não devem ser confundidos.

## Authentication

Tradução: **Autenticação**.

Responde:

"Quem é você?"

Exemplo:

e-mail + senha
→ Better Auth
→ usuário autenticado

## Authorization

Tradução: **Autorização**.

Responde:

"O que você pode fazer?"

Exemplo:

User
→ Workspace
→ Membership
→ Role
→ Permissões

A autenticação pertence principalmente ao Identity.

As permissões relacionadas ao Workspace serão tratadas pelo módulo Workspace.

---

# 13. Segurança

O módulo deverá seguir os seguintes princípios:

- senhas nunca devem ser armazenadas em texto puro;
- credenciais não devem aparecer em logs;
- segredos não devem chegar ao client;
- sessões devem ser validadas no servidor;
- endpoints protegidos devem verificar autenticação;
- erros não devem revelar informações sensíveis;
- operações críticas deverão ser validadas no servidor.

---

# 14. Fora do escopo inicial

Não fazem parte desta primeira implementação:

- autenticação biométrica;
- autenticação corporativa;
- SSO;
- múltiplas organizações empresariais;
- autenticação por telefone;
- passkeys;
- login social.

Essas funcionalidades poderão ser avaliadas posteriormente.

---

# 15. Dependências

O módulo depende atualmente de:

Better Auth
→ autenticação e sessões

Drizzle ORM
→ acesso ao banco

PostgreSQL / Neon
→ persistência

Next.js
→ aplicação e rotas

Workspace
→ autorização contextual

---

# 16. Critérios de aceitação

Consideraremos a primeira versão do Identity concluída quando:

- [ ] usuário puder criar conta;
- [ ] e-mail duplicado for rejeitado;
- [ ] usuário puder fazer login;
- [ ] credenciais inválidas forem rejeitadas;
- [ ] sessão puder ser recuperada no servidor;
- [ ] usuário puder fazer logout;
- [ ] rotas protegidas bloquearem usuários não autenticados;
- [ ] usuário puder atualizar informações permitidas do perfil;
- [ ] recuperação de senha estiver funcionando;
- [ ] erros forem tratados adequadamente;
- [ ] testes essenciais estiverem implementados.