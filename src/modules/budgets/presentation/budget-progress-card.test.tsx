// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { BudgetProgressCard } from "./budget-progress-card";

describe("BudgetProgressCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("exibe os dados do orçamento", () => {
    render(
      <BudgetProgressCard
        categoryName="Alimentação"
        month={8}
        year={2026}
        plannedAmount="1200.0000"
        spentAmount="750.0000"
        remainingAmount="450.0000"
        percentage={62.5}
        status="ON_TRACK"
      />,
    );

    expect(screen.getByText("Alimentação")).toBeTruthy();

    expect(screen.getByText("Agosto de 2026")).toBeTruthy();

    expect(screen.getByText("R$ 1.200,00")).toBeTruthy();

    expect(screen.getByText("R$ 750,00")).toBeTruthy();

    expect(screen.getByText("R$ 450,00")).toBeTruthy();

    expect(screen.getByText("62,5%")).toBeTruthy();

    expect(screen.getByText("Dentro do orçamento")).toBeTruthy();
  });

  it("expõe o progresso de forma acessível", () => {
    render(
      <BudgetProgressCard
        categoryName="Transporte"
        month={8}
        year={2026}
        plannedAmount="1000.0000"
        spentAmount="800.0000"
        remainingAmount="200.0000"
        percentage={80}
        status="NEAR_LIMIT"
      />,
    );

    const progress = screen.getByRole("progressbar", {
      name: "Progresso do orçamento de Transporte",
    });

    expect(progress.getAttribute("aria-valuemin")).toBe("0");

    expect(progress.getAttribute("aria-valuemax")).toBe("100");

    expect(progress.getAttribute("aria-valuenow")).toBe("80");
  });

  it("limita somente a barra visual quando o orçamento é excedido", () => {
    render(
      <BudgetProgressCard
        categoryName="Lazer"
        month={8}
        year={2026}
        plannedAmount="1000.0000"
        spentAmount="1250.0000"
        remainingAmount="-250.0000"
        percentage={125}
        status="EXCEEDED"
      />,
    );

    expect(screen.getByText("125%")).toBeTruthy();

    expect(screen.getByText("Orçamento excedido")).toBeTruthy();

    expect(screen.getByText("-R$ 250,00")).toBeTruthy();

    const progress = screen.getByRole("progressbar");

    expect(progress.getAttribute("aria-valuenow")).toBe("100");

    const indicator = progress.firstElementChild as HTMLElement;

    expect(indicator.style.width).toBe("100%");
  });

  it("exibe o status de atenção", () => {
    render(
      <BudgetProgressCard
        categoryName="Moradia"
        month={12}
        year={2026}
        plannedAmount="2000.0000"
        spentAmount="1800.0000"
        remainingAmount="200.0000"
        percentage={90}
        status="NEAR_LIMIT"
      />,
    );

    expect(screen.getByText("Próximo do limite")).toBeTruthy();

    expect(screen.getByText("Dezembro de 2026")).toBeTruthy();
  });
});
