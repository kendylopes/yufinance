// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SectionHeader } from "./section-header";

describe("SectionHeader", () => {
  afterEach(() => {
    cleanup();
  });

  it("exibe título, descrição e metadado", () => {
    render(
      <SectionHeader
        title="Orçamentos ativos"
        description="Acompanhe os limites do período."
        meta="3 orçamentos cadastrados"
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Orçamentos ativos",
      }),
    ).toBeTruthy();

    expect(screen.getByText("Acompanhe os limites do período.")).toBeTruthy();

    expect(screen.getByText("3 orçamentos cadastrados")).toBeTruthy();
  });

  it("renderiza ações", () => {
    render(<SectionHeader title="Orçamentos" actions={<button type="button">Filtrar</button>} />);

    expect(
      screen.getByRole("button", {
        name: "Filtrar",
      }),
    ).toBeTruthy();
  });
});
