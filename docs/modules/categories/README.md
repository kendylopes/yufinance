# Categories — Documentação do Módulo

## O que é
`Category` significa **Categoria Financeira**. Classifica futuras movimentações como receita (`INCOME`) ou despesa (`EXPENSE`). Não armazena dinheiro, saldo ou vínculo com uma Financial Account específica.

## Status
**Sprint 5 — backend concluído e validado. Interface em desenvolvimento.**

## Documentos
- `categories-prd.md`
- `categories-business-rules.md`
- `categories-domain-model.md`
- `categories-database-model.md`
- `categories-use-cases.md`
- `categories-implementation-guide.md`

ADR relacionado: `docs/architecture/adr/ADR-0010-managed-resource-pattern.md`.

## Escopo aprovado
Create, List, ListArchived, Get, Update, Archive e Restore. OWNER/ADMIN gerenciam; MEMBER/VIEWER leem. Soft archive usa `archivedAt`.
