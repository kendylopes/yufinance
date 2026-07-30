# Regras de Negócio — Categories

## Propriedade
**CAT-RN-001** Toda Category pertence a um Workspace.  
**CAT-RN-002** Uma Category pertence a exatamente um Workspace.  
**CAT-RN-003** Workspace referenciado deve existir.  
**CAT-RN-004** Membership é obrigatório.  
**CAT-RN-005** Nenhuma operação confia somente em `categoryId`; `workspaceId` também limita o recurso.

## Tipo
**CAT-RN-006** Tipos válidos: `INCOME | EXPENSE`.  
**CAT-RN-007** `type` é imutável após Create.

## Nome
**CAT-RN-008** Nome obrigatório.  
**CAT-RN-009** Aplicar `trim`.  
**CAT-RN-010** Comprimento de 2–60 caracteres.  
**CAT-RN-011** Impedir duplicidade lógica em `workspaceId + type + name`, inclusive contra concorrência no banco.  
**CAT-RN-012** Mesmo nome em tipos diferentes é permitido.

## Permissões
**CAT-RN-013** OWNER/ADMIN/MEMBER/VIEWER podem ler.  
**CAT-RN-014** OWNER/ADMIN podem gerenciar.  
**CAT-RN-015** MEMBER/VIEWER não criam, renomeiam, arquivam ou restauram.

## Update
**CAT-RN-016** Update altera somente `name`; não altera `workspaceId`, `type` ou `archivedAt`.

## Archive
**CAT-RN-017** Archive define `archivedAt = timestamp`.  
**CAT-RN-018** Não há exclusão física comum.  
**CAT-RN-019** Somente ativa do Workspace pode ser arquivada.  
**CAT-RN-020** List ativa usa `archivedAt IS NULL`.

## Restore
**CAT-RN-021** Restore define `archivedAt = NULL`.  
**CAT-RN-022** Somente arquivada do Workspace pode ser restaurada.  
**CAT-RN-023** ListArchived usa `archivedAt IS NOT NULL`.

## Histórico
**CAT-RN-024** Archive/Restore preservam id, Workspace, nome, tipo e createdAt; updatedAt acompanha alterações.  
**CAT-RN-025** Categoria arquivada não poderá ser usada em nova Transaction, mas referências históricas serão preservadas.

## Categorias padrão
**CAT-RN-026** Não existirão categorias globais no MVP.  
**CAT-RN-027** Seed no `CreateInitialWorkspace` só será integrado após validação isolada de Categories.
