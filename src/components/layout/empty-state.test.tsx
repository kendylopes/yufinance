// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  afterEach(() => {
    cleanup();
  });

  it("exibe título e descrição", () => {
    render(<EmptyState title="Nenhum orçamento" description="Crie seu primeiro orçamento." />);

    expect(
      screen.getByRole("heading", {
        name: "Nenhum orçamento",
      }),
    ).toBeTruthy();

    expect(screen.getByText("Crie seu primeiro orçamento.")).toBeTruthy();
  });

  it("renderiza ação quando informada", () => {
    render(
      <EmptyState
        title="Nenhum orçamento"
        action={<button type="button">Criar orçamento</button>}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Criar orçamento",
      }),
    ).toBeTruthy();
  });

  it("funciona sem descrição e ação", () => {
    render(<EmptyState title="Nada encontrado" />);

    expect(
      screen.getByRole("heading", {
        name: "Nada encontrado",
      }),
    ).toBeTruthy();
  });
});
