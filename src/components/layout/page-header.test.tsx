// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { PageHeader } from "./page-header";

describe("PageHeader", () => {
  afterEach(() => {
    cleanup();
  });

  it("exibe título e descrição", () => {
    render(<PageHeader title="Orçamentos" description="Planeje seus gastos mensais." />);

    expect(
      screen.getByRole("heading", {
        name: "Orçamentos",
      }),
    ).toBeTruthy();

    expect(screen.getByText("Planeje seus gastos mensais.")).toBeTruthy();
  });

  it("não renderiza descrição quando ela não é informada", () => {
    render(<PageHeader title="Orçamentos" />);

    expect(screen.queryByText("Planeje seus gastos mensais.")).toBeNull();
  });

  it("renderiza ações", () => {
    render(
      <PageHeader title="Orçamentos" actions={<button type="button">Novo orçamento</button>} />,
    );

    expect(
      screen.getByRole("button", {
        name: "Novo orçamento",
      }),
    ).toBeTruthy();
  });
});
