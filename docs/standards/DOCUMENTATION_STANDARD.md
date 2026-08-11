# Padrão de documentação

## Introdução obrigatória

Todo documento técnico deve começar explicando:

- o que é;
- para que serve;
- quando consultar;
- qual documento é a fonte de verdade.

## Hierarquia

- `PROJECT_MASTER.md`: estado consolidado.
- `ROADMAP.md`: futuro planejado.
- `CHANGELOG.md`: trabalho concluído.
- `project-status.md`: checkpoint operacional.
- documentos de módulo: detalhes de negócio e implementação.
- ADRs: decisões arquiteturais estáveis.
- `archive/`: snapshots sem validade operacional.

## Manutenção

Evitar documentos temporários na raiz. Atualizações de sprint devem ser incorporadas ao changelog, status e módulo correspondente.
