# Regras de Negócio — Identity

## Sobre este documento

Este documento registra as regras que o módulo **Identity** do YuFinance
deve obrigatoriamente respeitar.

### O que são regras de negócio?

Regras de negócio são condições que determinam como o sistema deve se
comportar.

Enquanto o PRD descreve **o que queremos construir**, as regras de negócio
definem **o que pode, o que não pode e quais condições precisam ser
respeitadas**.

Exemplo simples:

> Um mesmo e-mail não pode possuir duas contas no YuFinance.

Essa é uma regra de negócio porque deve ser respeitada independentemente
da tela, API ou tecnologia utilizada.

### Para que este documento serve?

Ele serve como referência para:

- desenvolvimento;
- validações;
- testes;
- revisão de código;
- análise de bugs;
- futuras alterações no módulo.

Se uma implementação contrariar uma regra aprovada neste documento,
a implementação deverá ser corrigida ou a regra deverá ser formalmente
revisada.

---

# 1. Vocabulário do módulo

Antes das regras, estes são os principais termos utilizados.

## User

**Tradução:** Usuário.

Representa a identidade de uma pessoa registrada no YuFinance.

O nome `User` foi mantido porque é o termo utilizado pelo Better Auth
e também é uma convenção amplamente utilizada em sistemas de autenticação.

---

## Identity

**Tradução:** Identidade.

Representa o conjunto de informações que permite ao YuFinance reconhecer
quem está utilizando o sistema.

Utilizamos `Identity` em vez de simplesmente `Auth` porque o módulo não
trata apenas do login.

---

## Authentication

**Tradução:** Autenticação.

É o processo utilizado para confirmar quem é o usuário.

Exemplo:

e-mail + senha
→ validação
→ usuário autenticado

---

## Session

**Tradução:** Sessão.

Representa um período em que o sistema reconhece que determinado usuário
está autenticado.

O termo `Session` é utilizado pelo Better Auth e pelo próprio modelo
de autenticação adotado no projeto.

---

## Account

**Tradução literal:** Conta.

No contexto do Better Auth, `Account` representa uma credencial ou
forma de autenticação associada ao usuário.

IMPORTANTE:

`account` do Better Auth não representa uma conta bancária.

As contas financeiras do YuFinance utilizarão outro conceito:

`FinancialAccount`

Tradução: Conta Financeira.

Essa separação evita confusão entre autenticação e domínio financeiro.

---

# 2. Cadastro

## ID-RN-001 — E-mail obrigatório

Todo usuário deverá possuir um endereço de e-mail válido.

O cadastro não poderá ser concluído sem um e-mail.

---

## ID-RN-002 — E-mail único

Um endereço de e-mail não poderá representar mais de um usuário.

Exemplo:

usuario@exemplo.com

não poderá ser utilizado para criar duas identidades diferentes.

A restrição deverá existir tanto na aplicação quanto no banco de dados.

---

## ID-RN-003 — Nome obrigatório

Todo usuário deverá possuir um nome.

A interface poderá posteriormente definir regras adicionais de tamanho
e apresentação.

---

## ID-RN-004 — Senha obrigatória no cadastro tradicional

Quando o cadastro utilizar autenticação por e-mail e senha, uma senha
válida será obrigatória.

A senha nunca deverá ser armazenada em texto puro.

O tratamento criptográfico da credencial será responsabilidade do
Better Auth.

---

## ID-RN-005 — Confirmação de senha

A interface de cadastro deverá solicitar confirmação da senha.

Os dois valores deverão ser iguais antes da solicitação de cadastro
ser enviada.

A confirmação da senha é uma validação de entrada e não deverá ser
armazenada no banco de dados.

---

# 3. Autenticação

## ID-RN-006 — Credenciais válidas

Somente credenciais válidas poderão iniciar uma sessão autenticada.

---

## ID-RN-007 — Resposta segura para falha de autenticação

Uma tentativa inválida de login não deverá revelar informações que
facilitem descobrir se determinada conta existe.

A interface deverá apresentar uma mensagem segura e compreensível.

Exemplo:

"Não foi possível entrar com os dados informados."

Evitar mensagens desnecessariamente específicas como:

"Este e-mail existe, mas a senha está errada."

---

## ID-RN-008 — Sessão necessária para recursos protegidos

Recursos privados do YuFinance deverão exigir uma sessão válida.

Um usuário sem sessão válida não poderá acessar dados financeiros
protegidos.

---

## ID-RN-009 — Validação no servidor

A existência de uma sessão não deverá ser confiada apenas ao estado
da interface.

Operações protegidas deverão validar a autenticação no servidor.

---

# 4. Logout

## ID-RN-010 — Encerramento da sessão

Quando o usuário realizar logout, a sessão correspondente deverá deixar
de permitir acesso aos recursos protegidos.

---

## ID-RN-011 — Redirecionamento após logout

Depois do encerramento da sessão, o usuário deverá ser direcionado para
uma área pública apropriada da aplicação.

A rota exata será definida durante a implementação da experiência de
autenticação.

---

# 5. Perfil

## ID-RN-012 — Dados básicos editáveis

O usuário poderá alterar os dados de perfil permitidos pelo sistema.

Inicialmente:

- nome;
- imagem de perfil.

Alterações de e-mail terão tratamento próprio por afetarem a identidade
utilizada na autenticação.

---

## ID-RN-013 — Identificador imutável pela interface

O identificador interno do usuário não poderá ser alterado pelo próprio
usuário.

No código:

`user.id`

Significado:

identificador único da identidade.

Ele é utilizado para estabelecer relações com outras entidades e,
portanto, não deve funcionar como um dado editável do perfil.

---

## ID-RN-014 — Dados financeiros não pertencem ao perfil

Contas financeiras, categorias, transações, saldos e demais informações
financeiras não deverão ser armazenados diretamente no perfil do usuário.

Esses dados pertencem ao contexto de um Workspace.

---

# 6. E-mail

## ID-RN-015 — Alteração de e-mail é uma operação sensível

Alterar o e-mail de uma identidade não deverá ser tratado como uma simples
edição de texto do perfil.

O fluxo deverá considerar mecanismos de segurança e verificação fornecidos
pela solução de autenticação.

A implementação definitiva será especificada quando esse caso de uso
for desenvolvido.

---

## ID-RN-016 — Verificação de e-mail

O domínio deverá reconhecer o estado de verificação disponibilizado pelo
Better Auth:

`emailVerified`

Tradução:

**e-mail verificado**.

Esse campo indica se o endereço de e-mail passou pelo processo de
verificação configurado no sistema.

As funcionalidades que exigirão e-mail verificado serão definidas
explicitamente pelas regras correspondentes.

---

# 7. Recuperação de senha

## ID-RN-017 — Recuperação não deve revelar existência da conta

Uma solicitação de recuperação não deverá fornecer informações
desnecessárias sobre a existência ou inexistência de determinado e-mail.

A resposta da interface deverá ser neutra.

---

## ID-RN-018 — Recuperação deve ser temporária

Qualquer mecanismo utilizado para redefinição de senha deverá possuir
validade limitada.

---

## ID-RN-019 — Mecanismo de recuperação não pode ser reutilizado
indevidamente

Após utilização válida ou expiração, o mecanismo de recuperação deverá
deixar de ser aceito conforme o comportamento de segurança adotado pelo
Better Auth.

---

# 8. Workspace

## ID-RN-020 — Identity não determina propriedade financeira

O módulo Identity determina quem é o usuário.

Ele não determina sozinho quais dados financeiros o usuário pode acessar.

O acesso será determinado pela relação:

User
→ Workspace Member
→ Workspace
→ Role
→ Permissões

---

## ID-RN-021 — Usuário poderá participar de múltiplos Workspaces

Uma identidade poderá possuir vínculo com mais de um Workspace.

Exemplo:

User: Kennedy

→ Workspace Pessoal
→ Workspace Família
→ Workspace Empresa

A mesma identidade não deverá precisar criar contas diferentes para
participar desses ambientes.

---

## ID-RN-022 — Membership pertence ao domínio Workspace

`Membership`

Tradução:

**Participação** ou **Vínculo de membro**.

Representa a relação entre um User e um Workspace.

Apesar de envolver o usuário, as regras de Membership e Role serão
responsabilidade do módulo Workspace.

---

# 9. Segurança

## ID-RN-023 — Segredos não podem ser enviados ao cliente

Segredos de autenticação, credenciais do banco e outras informações
sensíveis deverão permanecer no ambiente do servidor.

---

## ID-RN-024 — Senhas não podem aparecer em logs

Senha, confirmação de senha, tokens sensíveis e credenciais não deverão
ser registrados em logs da aplicação.

---

## ID-RN-025 — Erros internos não devem ser expostos diretamente

Mensagens internas de banco de dados, stack traces e detalhes técnicos
não deverão ser apresentados diretamente ao usuário final.

A aplicação deverá converter erros técnicos em respostas apropriadas.

---

## ID-RN-026 — Validação de entrada não substitui autorização

Uma requisição possuir dados válidos não significa que o usuário possui
permissão para executar a operação.

Autenticação, validação e autorização deverão ser tratadas como
responsabilidades diferentes.

---

# 10. Exclusão de usuário

## ID-RN-027 — Exclusão definitiva exige tratamento específico

A exclusão definitiva de uma identidade é uma operação crítica.

Ela não será implementada como um simples:

DELETE user

Isso ocorre porque um User poderá possuir relações com Workspaces e
informações importantes para integridade e histórico do sistema.

A política completa de exclusão será definida antes da implementação
dessa funcionalidade.

---

# 11. Responsabilidades externas ao Identity

O módulo Identity não será responsável por:

- contas financeiras;
- saldos;
- categorias;
- transações;
- transferências;
- permissões financeiras específicas;
- regras de Workspace;
- relatórios;
- dashboard financeiro.

Essas responsabilidades pertencem a outros módulos.

---

# 12. Resumo das responsabilidades

Identity responde:

"Quem é o usuário?"

Workspace responde:

"De qual ambiente financeiro ele participa?"

Authorization responde:

"O que ele pode fazer nesse ambiente?"

Finance responde:

"Quais operações financeiras existem nesse ambiente?"

Essa separação deverá ser preservada durante a implementação.