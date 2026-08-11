// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ResourceSection } from "./resource-section";

describe("ResourceSection", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza cabeçalho e conteúdo", () => {
    render(
      <ResourceSection
        title="Orçamentos ativos"
        description="Orçamentos do período atual."
        meta="2 cadastrados"
      >
        <article>Orçamento Alimentação</article>
      </ResourceSection>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Orçamentos ativos",
      }),
    ).toBeTruthy();

    expect(screen.getByText("Orçamento Alimentação")).toBeTruthy();

    expect(screen.getByText("2 cadastrados")).toBeTruthy();
  });

  it("renderiza ações no cabeçalho", () => {
    render(
      <ResourceSection title="Orçamentos" actions={<button type="button">Novo</button>}>
        <div>Conteúdo</div>
      </ResourceSection>,
    );

    expect(
      screen.getByRole("button", {
        name: "Novo",
      }),
    ).toBeTruthy();
  });
});
