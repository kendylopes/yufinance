# Fluxo oficial de desenvolvimento

## Objetivo

Padronizar a entrega de funcionalidades e impedir divergência entre documentação, arquitetura, implementação e testes.

## Fluxo obrigatório

1. Definir problema, escopo e fora do escopo.
2. Atualizar PRD e regras de negócio.
3. Modelar domínio e persistência.
4. Definir DTOs e schemas antes da implementação.
5. Implementar repository e casos de uso.
6. Escrever testes antes da integração visual.
7. Implementar Server Actions e Presentation quando necessário.
8. Executar Quality Gates.
9. Homologar fluxos felizes, erros, acessibilidade e responsividade.
10. Atualizar documentação e changelog.

## Regra de avanço

Nenhuma etapa avança com o projeto vermelho. Falhas devem ser corrigidas no bloco atual antes da próxima funcionalidade.

## Trabalho sobre código existente

Em refatorações, ler o arquivo real antes de alterar. Não presumir nomes de exports, paths ou contratos. Em módulos novos, gerar a estrutura a partir dos padrões oficiais.
