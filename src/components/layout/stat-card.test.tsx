// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { StatCard } from "./stat-card";

describe("StatCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("exibe indicador e descrição", () => {
    render(<StatCard label="Planejado" value="R$ 2.500,00" description="Total do período" />);

    expect(screen.getByText("Planejado")).toBeTruthy();

    expect(screen.getByText("R$ 2.500,00")).toBeTruthy();

    expect(screen.getByText("Total do período")).toBeTruthy();
  });

  it("renderiza conteúdo adicional", () => {
    render(<StatCard label="Utilizado" value="80%" trailing={<span>Próximo do limite</span>} />);

    expect(screen.getByText("Próximo do limite")).toBeTruthy();
  });
});
