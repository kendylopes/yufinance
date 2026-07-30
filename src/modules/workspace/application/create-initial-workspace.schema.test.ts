import { describe, expect, it } from "vitest";

import { createInitialWorkspaceSchema } from "./create-initial-workspace.schema";

describe("createInitialWorkspaceSchema", () => {
  it("aceita um Workspace válido", () => {
    const result = createInitialWorkspaceSchema.safeParse({
      name: "Minhas Finanças",
      type: "PERSONAL",
    });

    expect(result.success).toBe(true);
  });

  it("remove espaços desnecessários do nome", () => {
    const result = createInitialWorkspaceSchema.safeParse({
      name: "  Minhas Finanças  ",
      type: "PERSONAL",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Minhas Finanças");
    }
  });

  it("rejeita nome com menos de 2 caracteres", () => {
    const result = createInitialWorkspaceSchema.safeParse({
      name: "M",
      type: "PERSONAL",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita nome com mais de 120 caracteres", () => {
    const result = createInitialWorkspaceSchema.safeParse({
      name: "a".repeat(121),
      type: "PERSONAL",
    });

    expect(result.success).toBe(false);
  });

  it("aceita o tipo PERSONAL", () => {
    const result = createInitialWorkspaceSchema.safeParse({
      name: "Minhas Finanças",
      type: "PERSONAL",
    });

    expect(result.success).toBe(true);
  });

  it("aceita o tipo COUPLE", () => {
    const result = createInitialWorkspaceSchema.safeParse({
      name: "Nossa Casa",
      type: "COUPLE",
    });

    expect(result.success).toBe(true);
  });

  it("aceita o tipo FAMILY", () => {
    const result = createInitialWorkspaceSchema.safeParse({
      name: "Família",
      type: "FAMILY",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita um tipo de Workspace desconhecido", () => {
    const result = createInitialWorkspaceSchema.safeParse({
      name: "Empresa",
      type: "BUSINESS",
    });

    expect(result.success).toBe(false);
  });

  it("utiliza PERSONAL quando o tipo não é informado", () => {
    const result = createInitialWorkspaceSchema.safeParse({
      name: "Minhas Finanças",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.type).toBe("PERSONAL");
    }
  });
});
