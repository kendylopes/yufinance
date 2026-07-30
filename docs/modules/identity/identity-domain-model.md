# Modelo de Domínio — Identity

## Sobre este documento

Este documento descreve os principais conceitos que existem dentro do módulo
**Identity** do YuFinance e como eles se relacionam.

### O que é um modelo de domínio?

Um modelo de domínio representa as "coisas importantes" que existem dentro
de uma área do sistema.

Ele não descreve apenas tabelas de banco de dados.

Ele descreve conceitos do negócio.

Exemplo:

`User`

Tradução: Usuário.

No banco de dados ele possui campos e relacionamentos.

No domínio, porém, ele representa algo maior:

> uma pessoa reconhecida pelo YuFinance.

### Para que este documento serve?

Ele ajuda a responder perguntas como:

- Quais conceitos pertencem ao módulo Identity?
- Qual a responsabilidade de cada conceito?
- Quais conceitos vêm do Better Auth?
- O que é regra de negócio e o que é detalhe técnico?
- Como Identity se relaciona com Workspace?

Este documento deverá ser consultado antes de criar serviços, casos de uso
ou novas entidades relacionadas à identidade do usuário.

---

# 1. Visão geral

O módulo Identity possui atualmente quatro conceitos importantes:

User
Session
Account
Verification

Esses conceitos são persistidos pelo Better Auth.

Entretanto, nem todos possuem a mesma importância dentro do domínio
do YuFinance.

A visão simplificada é:

User
│
├── Session
│
└── Account

Verification
## Checkpoint de implementação — 2026-07-27

**Status: IMPLEMENTADO E VALIDADO no escopo atual.**

- cadastro com e-mail e senha via Better Auth;
- senha validada entre 8 e 128 caracteres;
- criação real de `user`, `account` e `session`;
- `RegisterUser` com schema Zod, caso de uso e `SignUpForm`;
- acessibilidade com `useId()` e elementos semânticos;
- `getCurrentUser()` server-side usando Better Auth e `next/headers`;
- testes de schema, aplicação e apresentação aprovados.

Recuperação de senha, verificação de e-mail e demais extensões de identidade continuam planejadas quando não estiverem explicitamente marcadas como implementadas neste documento.
