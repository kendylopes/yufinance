// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { SelectField } from "./select-field";

describe("SelectField", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza opções", () => {
    render(
      <SelectField label="Categoria">
        <option value="food">Alimentação</option>

        <option value="transport">Transporte</option>
      </SelectField>,
    );

    expect(
      screen.getByRole("combobox", {
        name: "Categoria",
      }),
    ).toBeTruthy();

    expect(
      screen.getByRole("option", {
        name: "Alimentação",
      }),
    ).toBeTruthy();

    expect(
      screen.getByRole("option", {
        name: "Transporte",
      }),
    ).toBeTruthy();
  });

  it("permite selecionar uma opção", async () => {
    const user = userEvent.setup();

    render(
      <SelectField label="Categoria">
        <option value="food">Alimentação</option>

        <option value="transport">Transporte</option>
      </SelectField>,
    );

    const select = screen.getByRole("combobox", {
      name: "Categoria",
    }) as HTMLSelectElement;

    await user.selectOptions(select, "transport");

    expect(select.value).toBe("transport");
  });
});
