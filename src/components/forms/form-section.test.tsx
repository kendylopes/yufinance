// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { FormSection } from "./form-section";

describe("FormSection", () => {
  afterEach(() => {
    cleanup();
  });

  it("agrupa campos com título e descrição", () => {
    render(
      <FormSection title="Planejamento" description="Defina os dados do orçamento.">
        <input aria-label="Valor planejado" />
      </FormSection>,
    );

    expect(screen.getByText("Planejamento")).toBeTruthy();

    expect(screen.getByText("Defina os dados do orçamento.")).toBeTruthy();

    expect(screen.getByRole("group")).toBeTruthy();
  });

  it("funciona sem cabeçalho", () => {
    render(
      <FormSection>
        <input aria-label="Nome" />
      </FormSection>,
    );

    expect(screen.getByRole("group")).toBeTruthy();
  });
});
