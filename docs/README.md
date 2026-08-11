# YuFinance — Documentação Oficial

Esta pasta é a fonte documental do YuFinance. O ponto de entrada obrigatório é o [PROJECT_MASTER.md](PROJECT_MASTER.md), que consolida visão, estado atual, arquitetura, módulos, processo e roadmap.

## Ordem recomendada de leitura

1. [PROJECT_MASTER.md](PROJECT_MASTER.md) — visão consolidada e fonte de verdade.
2. [product/prd.md](product/prd.md) — produto, problema e público.
3. [architecture/architecture-overview.md](architecture/architecture-overview.md) — arquitetura oficial.
4. [standards/DEVELOPMENT_WORKFLOW.md](standards/DEVELOPMENT_WORKFLOW.md) — processo de entrega.
5. [standards/QUALITY_GATES.md](standards/QUALITY_GATES.md) — critérios obrigatórios de qualidade.
6. [modules/README.md](modules/README.md) — índice dos módulos.
7. [ROADMAP.md](ROADMAP.md) — sequência oficial de evolução.
8. [CHANGELOG.md](CHANGELOG.md) — histórico consolidado.

## Estrutura

```text
docs/
├── README.md
├── PROJECT_MASTER.md
├── ROADMAP.md
├── CHANGELOG.md
├── project-status.md
├── glossary.md
├── architecture/
├── business/
├── development/
├── modules/
├── product/
├── standards/
├── templates/
├── ux/
├── reviews/
└── archive/
```

## Regra de manutenção

- O `PROJECT_MASTER.md` representa o estado vigente.
- Documentos de módulo detalham regras específicas.
- ADRs registram decisões arquiteturais estáveis.
- O `CHANGELOG.md` registra mudanças concluídas.
- Registros temporários e snapshots devem ir para `archive/`.
- Nenhuma sprint é encerrada sem atualizar documentação e Quality Gates.
