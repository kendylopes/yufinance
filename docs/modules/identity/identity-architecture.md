# Arquitetura — Módulo Identity

## Sobre este documento

Este documento define como o módulo **Identity** será organizado tecnicamente
dentro do YuFinance.

Até aqui definimos:

- o que o módulo precisa fazer;
- quais regras deve respeitar;
- quais conceitos existem;
- quais ações o sistema deverá executar.

Agora definimos onde cada responsabilidade ficará no código.

### O que significa arquitetura neste contexto?

Arquitetura é a forma como organizamos as partes do software e definimos
as responsabilidades de cada uma.

Uma boa arquitetura ajuda a responder:

- Onde deve ficar uma regra?
- Onde colocamos integração com Better Auth?
- Onde validamos dados?
- Onde ficam componentes de interface?
- O que pode depender do quê?

O objetivo não é criar muitas pastas.

O objetivo é evitar que responsabilidades diferentes fiquem misturadas.

---

# 1. Objetivo arquitetural

O Identity deverá manter separados:

Domínio
→ conceitos e regras

Aplicação
→ ações executadas pelo sistema

Infraestrutura
→ integração com tecnologias

Apresentação
→ interação com o usuário

Representação:

Presentation
      ↓
Application
      ↓
Domain
      ↑
Infrastructure

Essa representação é conceitual.

Não significa que criaremos abstrações desnecessárias apenas para seguir
o desenho.

---

# 2. Estrutura inicial

A estrutura proposta é:

src/modules/identity/
├── application/
├── domain/
├── infrastructure/
├── presentation/
└── index.ts

Não criaremos inicialmente pastas genéricas como:

services/
types/
utils/
helpers/

sem uma necessidade concreta.

O arquivo deve ficar próximo da responsabilidade à qual pertence.

---

# 3. Domain

Nome:

`domain`

Tradução:

Domínio.

Representa conceitos e regras importantes do Identity.

Local:

src/modules/identity/domain/

O domínio deverá evitar dependências diretas de:

- Next.js;
- React;
- Neon;
- Drizzle;
- HTTP;
- cookies;
- componentes visuais.

Exemplos futuros:

domain/
├── identity.errors.ts
└── identity.types.ts

Esses arquivos só deverão ser criados quando houver uma necessidade real.

---

# 4. Application

Nome:

`application`

Tradução:

Aplicação.

Esta camada coordena as ações que o YuFinance executa.

Os casos de uso documentados pertencem conceitualmente aqui.

Estrutura provável:

application/
├── register-user.ts
├── sign-in.ts
├── sign-out.ts
├── get-current-user.ts
├── update-profile.ts
├── request-password-reset.ts
└── reset-password.ts

Por exemplo:

`register-user.ts`

Tradução:

registrar usuário.

O arquivo representará a ação de registrar uma nova identidade.

Não significa que todos esses arquivos precisam ser criados imediatamente.

Eles serão adicionados conforme implementarmos cada funcionalidade.

---

# 5. Por que arquivos em kebab-case?

Exemplo:

register-user.ts

Esse padrão é chamado:

`kebab-case`

O nome vem da aparência das palavras separadas por hífen.

Exemplo:

register-user
      ↑
     hífen

Utilizaremos esse padrão para nomes de arquivos quando ele estiver alinhado
às convenções já adotadas no projeto.

No código, funções continuarão normalmente em:

`camelCase`

Exemplo:

registerUser()

Tradução:

registrar usuário.

---

# 6. Infrastructure

Nome:

`infrastructure`

Tradução:

Infraestrutura.

Esta camada contém implementações ligadas a tecnologias externas.

No Identity, o principal exemplo é:

Better Auth.

Estrutura provável:

infrastructure/
└── better-auth/

A organização interna será definida conforme a integração real exigir.

Não criaremos wrappers apenas para esconder o Better Auth.

Uma abstração será introduzida somente quando trouxer benefício concreto,
como:

- isolamento;
- testabilidade;
- substituição;
- redução de acoplamento;
- simplificação de uma API externa.

---

# 7. Better Auth

Better Auth é uma dependência de infraestrutura.

Ele poderá ser responsável por:

- criação de credenciais;
- autenticação;
- sessões;
- logout;
- recuperação de senha;
- verificação.

O módulo Identity não deverá duplicar funcionalidades que o Better Auth
já implementa corretamente.

Fluxo desejado:

YuFinance
→ caso de uso
→ Better Auth
→ banco

e não:

YuFinance
→ recria sistema de autenticação
→ Better Auth
→ banco

---

# 8. Presentation

Nome:

`presentation`

Tradução:

Apresentação.

Representa a camada com a qual o usuário interage.

Exemplos futuros:

presentation/
├── components/
└── forms/

Poderemos ter:

sign-in-form.tsx
sign-up-form.tsx
profile-form.tsx

Componentes de apresentação poderão:

- receber dados;
- mostrar dados;
- capturar entrada;
- apresentar estados;
- mostrar erros apropriados.

Eles não deverão conter regras importantes de negócio.

---

# 9. App Router

O Next.js continuará responsável pelas rotas.

Exemplo conceitual:

src/app/
├── (auth)/
│   ├── login/
│   └── register/
│
└── (app)/
    └── ...

As páginas poderão utilizar componentes fornecidos pelo módulo Identity.

Portanto:

app/
→ composição e roteamento

modules/identity/
→ funcionalidade Identity

Essa separação evita colocar toda a lógica dentro de `app/`.

---

# 10. Route Groups

Os nomes:

(auth)
(app)

são Route Groups do Next.js.

Tradução aproximada:

grupos de rotas.

Os parênteses permitem organizar rotas sem adicionar esse nome à URL.

Exemplo:

app/(auth)/login/page.tsx

continua representando:

/login

e não:

/auth/login

Usaremos esse recurso quando ele melhorar a organização da aplicação.

---

# 11. Validação

Dados externos nunca deverão ser considerados confiáveis automaticamente.

Exemplo:

formulário
→ entrada
→ validação
→ caso de uso

A biblioteca e a estratégia definitiva de validação deverão seguir as
dependências oficiais aprovadas para o projeto.

Não adicionaremos uma nova biblioteca apenas por conveniência sem registrar
a decisão.

---

# 12. Tratamento de erros

Não queremos espalhar:

try/catch

arbitrariamente por todo o sistema.

Erros deverão ser tratados no nível adequado.

Exemplo conceitual:

Infrastructure
→ erro técnico

Application
→ interpreta resultado

Presentation
→ apresenta mensagem adequada

Um erro interno como:

duplicate key value violates unique constraint

não deverá aparecer diretamente para o usuário.

A interface poderá apresentar:

"Não foi possível concluir o cadastro."

ou uma mensagem de domínio mais específica quando for seguro fazê-lo.

---

# 13. Dependências

A direção desejada é:

Presentation
→ Application
→ Domain

Infrastructure
→ fornece capacidades técnicas

Domain
→ não depende das demais camadas

Na prática, evitaremos rigidez artificial.

O objetivo é preservar responsabilidades, não reproduzir uma arquitetura
acadêmica linha por linha.

---

# 14. Barrel exports

O arquivo:

index.ts

na raiz do módulo poderá funcionar como ponto público de exportação.

Exemplo conceitual:

modules/identity/index.ts

Isso é conhecido como:

`barrel`

Um barrel reúne exports públicos de uma parte do sistema.

Entretanto, não exportaremos tudo automaticamente.

Somente APIs que realmente precisarem ser utilizadas fora do módulo deverão
ser públicas.

---

# 15. API pública do módulo

O restante do sistema não deverá conhecer todos os detalhes internos
do Identity.

Idealmente:

outros módulos
      ↓
identity/index.ts
      ↓
API pública
      ↓
implementação interna

Isso reduz acoplamento.

---

# 16. O que não faremos

Não criaremos automaticamente:

- repository para cada tabela;
- interface para cada função;
- factory para cada caso de uso;
- classe para cada operação;
- DTO para qualquer objeto;
- service genérico;
- manager genérico;
- helper genérico.

Essas estruturas serão criadas apenas quando resolverem um problema concreto.

---

# 17. Por que evitar abstrações prematuras?

Uma abstração adiciona uma nova forma de pensar sobre o sistema.

Quando ela não resolve um problema real, aumenta:

- quantidade de arquivos;
- navegação;
- complexidade;
- manutenção;
- dificuldade de aprendizado.

Nosso princípio será:

começar simples
→ identificar repetição ou acoplamento real
→ criar abstração
→ testar
→ documentar

---

# 18. Testabilidade

A arquitetura deverá permitir testar principalmente comportamentos.

Exemplo:

RegisterUser
→ dados válidos
→ cadastro permitido

RegisterUser
→ e-mail existente
→ cadastro rejeitado

Os testes não deverão existir apenas para aumentar métricas de cobertura.

Eles deverão proteger comportamentos importantes definidos nas regras de
negócio.

---

# 19. Segurança

As fronteiras arquiteturais também ajudam na segurança.

Client
→ nunca recebe segredos

Presentation
→ não decide autorização sozinha

Server
→ valida sessão

Application
→ coordena operação

Infrastructure
→ acessa recursos protegidos

As verificações críticas deverão ocorrer no servidor.

---

# 20. Relação com Workspace

Identity não deverá importar regras financeiras do Workspace.

Fluxo:

Identity
→ identifica User

Workspace
→ encontra Membership

Authorization
→ verifica Role

Finance
→ executa operação permitida

Isso mantém cada módulo responsável pelo seu próprio domínio.

---

# 21. Estrutura inicial aprovada

A estrutura mínima será:

src/
└── modules/
    └── identity/
        ├── application/
        ├── domain/
        ├── infrastructure/
        ├── presentation/
        └── index.ts

As subpastas serão criadas conforme funcionalidades reais forem
implementadas.

---

# 22. Princípio final

A arquitetura existe para facilitar o desenvolvimento do YuFinance.

Quando uma abstração tornar o sistema mais simples, ela poderá ser utilizada.

Quando tornar o sistema desnecessariamente complexo, deverá ser evitada.

A prioridade será:

clareza
→ separação de responsabilidades
→ segurança
→ testabilidade
→ manutenção
→ evolução

## Implementação atual do Better Auth

A configuração do Better Auth está localizada em:

`src/modules/identity/infrastructure/better-auth.ts`

Esse arquivo pertence à camada Infrastructure porque depende diretamente
de uma tecnologia externa.

A rota:

`src/app/api/auth/[...all]/route.ts`

não contém regras de autenticação.

Ela apenas conecta as requisições HTTP do Next.js ao handler fornecido
pelo Better Auth.