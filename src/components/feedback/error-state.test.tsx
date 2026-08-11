// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ErrorState } from "./error-state";

describe("ErrorState", () => {
  afterEach(() => {
    cleanup();
  });

  it("exibe título padrão e mensagem", () => {
    render(<ErrorState message="Erro ao carregar os orçamentos." />);

    expect(
      screen.getByRole("heading", {
        name: "Não foi possível carregar os dados",
      }),
    ).toBeTruthy();

    expect(screen.getByText("Erro ao carregar os orçamentos.")).toBeTruthy();
  });

  it("aceita título personalizado", () => {
    render(<ErrorState title="Falha ao carregar orçamentos" message="Tente novamente." />);

    expect(
      screen.getByRole("heading", {
        name: "Falha ao carregar orçamentos",
      }),
    ).toBeTruthy();
  });

  it("renderiza ação quando informada", () => {
    render(
      <ErrorState
        message="Erro inesperado."
        action={<button type="button">Tentar novamente</button>}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Tentar novamente",
      }),
    ).toBeTruthy();
  });
});
