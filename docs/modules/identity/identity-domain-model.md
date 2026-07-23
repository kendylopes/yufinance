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