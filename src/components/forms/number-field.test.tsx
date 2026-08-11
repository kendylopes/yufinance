// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { NumberField } from "./number-field";

describe("NumberField", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza um campo numérico acessível", () => {
    render(<NumberField label="Mês" min={1} max={12} />);

    const input = screen.getByRole("spinbutton", {
      name: "Mês",
    });

    expect(input).toBeTruthy();
    expect(input.getAttribute("min")).toBe("1");
    expect(input.getAttribute("max")).toBe("12");
  });

  it("marca o campo como inválido quando há erro", () => {
    render(<NumberField label="Mês" error="Mês inválido." />);

    expect(
      screen
        .getByRole("spinbutton", {
          name: "Mês",
        })
        .getAttribute("aria-invalid"),
    ).toBe("true");

    expect(screen.getByText("Mês inválido.")).toBeTruthy();
  });
});
