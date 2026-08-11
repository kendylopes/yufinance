# Relatório da atualização documental — 2026-07-29

## Objetivo

Reconciliar a documentação oficial após a conclusão do Sprint 4 — Financial Accounts.

## Estado anterior

O baseline de 2026-07-27 ainda descrevia Financial Accounts como próximo domínio e registrava 42 testes.

Alguns documentos também utilizavam propostas que mudaram durante a implementação, como:

- `isArchived` em vez de `archivedAt`;
- tipos de conta divergentes;
- critérios de aceitação não marcados;
- ausência de Archive/Restore implementados;
- ausência da listagem separada de arquivadas.

## Estado reconciliado

Financial Accounts está concluído no escopo atual.

Implementado:

- Create;
- List;
- Get;
- Update;
- Archive;
- Restore;
- ListArchived;
- autorização;
- UI;
- persistência;
- testes;
- validação real no Neon.

## Decisões consolidadas

### Tipos

```text
CHECKING
SAVINGS
DIGITAL
WALLET
CASH
```

### Dinheiro

```text
NUMERIC(19,4)
```

### Arquivamento

```text
archivedAt
```

Não utilizar `isArchived` como estado persistido paralelo.

### Update

Edita somente:

```text
name
type
```

### Permissões

Leitura:

```text
OWNER / ADMIN / MEMBER / VIEWER
```

Gerenciamento:

```text
OWNER / ADMIN
```

### Listagens

Ativas:

```text
archivedAt IS NULL
```

Arquivadas:

```text
archivedAt IS NOT NULL
```

## Testes

Checkpoint após o Sprint 4:

```text
141 testes aprovados
```

## Próximo domínio

O roadmap oficial segue para **Categorias** antes de Transactions.

## Regra para o próximo ciclo

Aplicar novamente:

```text
documentar
→ modelar
→ implementar
→ testar
→ validar
→ reconciliar documentação
```
