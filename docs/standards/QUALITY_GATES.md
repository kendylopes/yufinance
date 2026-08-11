# Quality Gates

## Gates obrigatórios

```bash
npm run check
npm run typecheck
npm run test
```

No fechamento de bloco funcional, sprint ou alteração estrutural:

```bash
npm run build
```

## Critérios adicionais

- console sem erros ou warnings relevantes;
- acessibilidade básica validada;
- comportamento responsivo verificado;
- fluxos de erro homologados;
- migrations verificadas quando houver alteração de banco;
- documentação atualizada.

## Política

Um gate quebrado bloqueia o avanço. Correções não devem ser postergadas para outro bloco quando foram introduzidas pela mudança atual.
